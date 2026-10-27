// End-to-end checks for student auth, course assignment and LMS authorisation.
// Starts the real server against a throwaway database on MONGODB_URI and drops it afterwards.
import "dotenv/config";
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import crypto from "node:crypto";
import { MongoClient } from "mongodb";

const PORT = 8899;
const BASE = `http://localhost:${PORT}`;
const DB = `s2s_selftest_${crypto.randomBytes(4).toString("hex")}`;
const TOKEN = process.env.ADMIN_TOKEN;

let server;
let mongo;
let db;

const admin = { "x-admin-token": TOKEN, "Content-Type": "application/json" };

async function api(path, { cookie, headers = {}, body, method = "GET" } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, data, res };
}

const sessionCookie = res =>
  res.headers.getSetCookie().find(c => c.startsWith("s2s_student_session="))?.split(";")[0];

async function register(name) {
  const email = `${name.toLowerCase()}-${crypto.randomBytes(3).toString("hex")}@example.com`;
  const { status, data, res } = await api("/api/student-auth/register", {
    method: "POST",
    body: { name, email, phone: "9876543210", password: "Passw0rd123" },
  });
  assert.equal(status, 201);
  return { cookie: sessionCookie(res), studentId: data.student.studentId, email };
}

const ctx = {};

before(async () => {
  assert.ok(process.env.MONGODB_URI, "MONGODB_URI must be set in backend/.env");
  mongo = new MongoClient(process.env.MONGODB_URI);
  await mongo.connect();
  db = mongo.db(DB);

  server = spawn(process.execPath, ["server/index.js"], {
    cwd: new URL("..", import.meta.url),
    // SMTP blanked so approvals exercise the "email failed" path without sending mail.
    env: { ...process.env, PORT: String(PORT), MONGODB_DB: DB, SMTP_USER: "", STUDENT_PORTAL_URL: "" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.stderr.on("data", d => process.stderr.write(`[server] ${d}`));
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("server did not start")), 30000);
    server.stdout.on("data", d => {
      if (String(d).includes("API running")) { clearTimeout(timer); resolve(); }
    });
    server.on("exit", code => reject(new Error(`server exited with ${code}`)));
  });

  // Two courses, two students, one assignment each.
  for (const key of ["c1", "c2", "c3"]) {
    const { status, data } = await api("/api/courses", {
      method: "POST", headers: admin, body: { title: `Test Course ${key}`, slug: `test-${key}-${DB}`, published: true },
    });
    assert.equal(status, 201);
    ctx[key] = data;
  }
  ctx.a = await register("Alice");
  ctx.b = await register("Bob");
  ctx.c = await register("Carol");

  assert.equal((await api(`/api/students/${ctx.a.studentId}/courses`, { method: "PUT", headers: admin, body: { courseIds: [ctx.c1.id] } })).status, 200);
  assert.equal((await api(`/api/students/${ctx.b.studentId}/courses`, { method: "PUT", headers: admin, body: { courseIds: [ctx.c2.id, ctx.c1.id] } })).status, 200);
});

after(async () => {
  server?.kill();
  await db?.dropDatabase();
  await mongo?.close();
});

test("public course metadata needs no login", async () => {
  const { status, data } = await api("/api/courses");
  assert.equal(status, 200);
  assert.ok(data.some(c => c.id === ctx.c1.id));
});

test("public batch listings hide meeting links; admin still sees them", async () => {
  const { data: batch } = await api("/api/online_training", {
    method: "POST", headers: admin,
    body: { course: ctx.c1.title, batch_name: "Evening", meeting_link: "https://meet.example/secret", status: "upcoming", published: true },
  });
  ctx.batch = batch;
  const pub = await api("/api/online_training");
  assert.ok(pub.data.every(b => !("meeting_link" in b)));
  assert.equal((await api(`/api/online_training/${batch.id}`)).data.meeting_link, undefined);
  const adm = await api("/api/online_training", { headers: admin });
  assert.equal(adm.data.find(b => b.id === batch.id).meeting_link, "https://meet.example/secret");
});

test("logged-out visitors cannot reach LMS endpoints", async () => {
  assert.equal((await api("/api/student/courses")).status, 401);
  assert.equal((await api(`/api/student/courses/${ctx.c1.id}`)).status, 401);
  assert.equal((await api("/api/student/courses", { cookie: "s2s_student_session=" + "a".repeat(64) })).status, 401);
});

test("each student sees only their own assigned courses", async () => {
  const a = await api("/api/student/courses", { cookie: ctx.a.cookie });
  assert.deepEqual(a.data.courses.map(c => c.id), [ctx.c1.id]);
  const b = await api("/api/student/courses", { cookie: ctx.b.cookie });
  assert.deepEqual(b.data.courses.map(c => c.id), [ctx.c2.id, ctx.c1.id]);
  const c = await api("/api/student/courses", { cookie: ctx.c.cookie });
  assert.deepEqual(c.data.courses, []);
});

test("changing the course ID in the URL does not bypass authorisation", async () => {
  assert.equal((await api(`/api/student/courses/${ctx.c1.id}`, { cookie: ctx.a.cookie })).status, 200);
  assert.equal((await api(`/api/student/courses/${ctx.c2.id}`, { cookie: ctx.a.cookie })).status, 403);
  assert.equal((await api(`/api/student/courses/${ctx.c3.id}`, { cookie: ctx.b.cookie })).status, 403);
  assert.equal((await api("/api/student/courses/does-not-exist", { cookie: ctx.a.cookie })).status, 403);
  assert.equal((await api(`/api/student/courses/${ctx.c1.id}/extra`, { cookie: ctx.a.cookie })).status, 404);
});

test("a student ID supplied by the client is ignored", async () => {
  const spoof = await api(`/api/student/courses?studentId=${ctx.b.studentId}`, {
    cookie: ctx.a.cookie, headers: { "x-student-id": ctx.b.studentId },
  });
  assert.deepEqual(spoof.data.courses.map(c => c.id), [ctx.c1.id]);
});

test("meeting link is shown only to a student with an approved enrollment in that batch", async () => {
  // A public form submission cannot attach itself to an account or batch.
  const pub = await api("/api/enrollments", {
    method: "POST", body: { name: "Mallory", email: "m@example.com", phone: "9876543210", college: "Test College", courseId: ctx.c1.slug, studentId: ctx.b.studentId, batch_id: ctx.batch.id, status: "confirmed" },
  });
  assert.equal(pub.status, 201);
  assert.equal(pub.data.studentId, undefined);
  assert.equal(pub.data.batch_id, undefined);
  assert.equal(pub.data.status, "pending");

  await api("/api/enrollments", {
    method: "POST", headers: admin,
    body: { name: "Alice", email: ctx.a.email, course: ctx.c1.title, studentId: ctx.a.studentId, batch_id: ctx.batch.id, status: "confirmed" },
  });
  const a = await api(`/api/student/courses/${ctx.c1.id}`, { cookie: ctx.a.cookie });
  assert.equal(a.data.course.batches[0].meeting_link, "https://meet.example/secret");
  const b = await api(`/api/student/courses/${ctx.c1.id}`, { cookie: ctx.b.cookie });
  assert.deepEqual(b.data.course.batches, []);
});

test("course assignment is admin-only and validates course IDs", async () => {
  assert.equal((await api(`/api/students/${ctx.a.studentId}/courses`, { method: "PUT", body: { courseIds: [ctx.c2.id] } })).status, 401);
  assert.equal((await api(`/api/students/${ctx.a.studentId}/courses`, { method: "PUT", cookie: ctx.a.cookie, body: { courseIds: [ctx.c2.id] } })).status, 401);
  assert.equal((await api(`/api/students/${ctx.a.studentId}/courses`, { method: "PUT", headers: admin, body: { courseIds: ["nope"] } })).status, 400);
  assert.equal((await api("/api/students/SSS-NOPE/courses", { method: "PUT", headers: admin, body: { courseIds: [] } })).status, 404);
  assert.equal((await api("/api/students")).status, 401);
  const list = await api("/api/students", { headers: admin });
  assert.equal(list.status, 200);
  assert.ok(list.data.every(s => !("passwordHash" in s)));
  assert.equal((await api("/api/students/" + ctx.a.studentId, { headers: admin })).status, 404); // generic route stays closed
});

test("login, me and logout keep working and logout ends the session", async () => {
  const login = await api("/api/student-auth/login", { method: "POST", body: { email: ctx.c.email, password: "Passw0rd123" } });
  assert.equal(login.status, 200);
  const cookie = sessionCookie(login.res);
  assert.match(login.res.headers.getSetCookie()[0], /HttpOnly/);
  assert.equal((await api("/api/student-auth/me", { cookie })).status, 200);
  const out = await api("/api/student-auth/logout", { method: "POST", cookie });
  assert.equal(out.status, 200);
  assert.match(out.res.headers.getSetCookie()[0], /Max-Age=0/);
  assert.equal((await api("/api/student-auth/me", { cookie })).status, 401);
  assert.equal((await api("/api/courses")).status, 200, "server still alive after logout");
});

test("approval with a failed setup email rolls back and can be retried", async () => {
  const { data: enrollment } = await api("/api/enrollments", { method: "POST", body: { name: "Dan", email: "dan-retry@example.com", phone: "9876543210", college: "Test College", courseId: ctx.c1.slug } });
  assert.equal((await api(`/api/enrollments/${enrollment.id}/approve`, { method: "POST", headers: admin })).status, 502);
  assert.equal(await db.collection("students").countDocuments({ email: "dan-retry@example.com" }), 0);
  assert.equal((await db.collection("enrollments").findOne({ id: enrollment.id })).status, "pending");
  assert.equal((await api(`/api/enrollments/${enrollment.id}/approve`, { method: "POST", headers: admin })).status, 502, "retry is not blocked by a 409");

  // Legacy stuck record (account created, email failed before this fix) can be resumed too.
  await db.collection("students").insertOne({ id: crypto.randomUUID(), studentId: "SSS-STUCK1", enrollmentId: enrollment.id, email: "dan-retry@example.com", status: "pending_setup", passwordHash: null });
  assert.equal((await api(`/api/enrollments/${enrollment.id}/approve`, { method: "POST", headers: admin })).status, 502);
  assert.equal(await db.collection("students").countDocuments({ studentId: "SSS-STUCK1" }), 1, "existing account is kept");
});

test("pending_setup students set a password via the setup link, then log in", async () => {
  const email = "eve-setup@example.com";
  const token = crypto.randomBytes(32).toString("hex");
  await db.collection("students").insertOne({ id: crypto.randomUUID(), studentId: "SSS-SETUP1", email, name: "Eve", status: "pending_setup", passwordHash: null });
  await db.collection("student_setup_tokens").insertOne({
    id: crypto.randomUUID(), studentId: "SSS-SETUP1", usedAt: null,
    tokenHash: crypto.createHash("sha256").update(token).digest("hex"),
    expiresAt: new Date(Date.now() + 600000).toISOString(),
  });

  assert.equal((await api("/api/student-auth/login", { method: "POST", body: { email, password: "Passw0rd123" } })).status, 401, "cannot log in before setting a password");
  assert.equal((await api("/api/student-auth/set-password", { method: "POST", body: { token, password: "Passw0rd123" } })).status, 200);
  assert.equal((await api("/api/student-auth/set-password", { method: "POST", body: { token, password: "Other123456" } })).status, 400, "token is single use");
  assert.equal((await api("/api/student-auth/login", { method: "POST", body: { email, password: "Passw0rd123" } })).status, 200);
});

test("CORS allows local dev origins and rejects unknown ones", async () => {
  for (const origin of ["http://localhost:8080", "http://127.0.0.1:8080", "http://localhost:5175"]) {
    const { res } = await api("/api/courses", { headers: { Origin: origin } });
    assert.equal(res.headers.get("access-control-allow-origin"), origin);
    assert.equal(res.headers.get("access-control-allow-credentials"), "true");
  }
  const pre = await fetch(`${BASE}/api/student-auth/login`, { method: "OPTIONS", headers: { Origin: "http://localhost:8080" } });
  assert.equal(pre.status, 204);
  const bad = await api("/api/courses", { headers: { Origin: "http://evil.example" } });
  assert.equal(bad.status, 403);
  assert.equal(bad.res.headers.get("access-control-allow-origin"), null);
});

test("admin endpoints still require the admin token", async () => {
  assert.equal((await api("/api/enrollments")).status, 401);
  assert.equal((await api("/api/enrollments", { headers: { "x-admin-token": "wrong" } })).status, 401);
  assert.equal((await api("/api/enrollments", { headers: admin })).status, 200);
});
