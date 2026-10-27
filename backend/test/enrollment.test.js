// End-to-end checks for the website enrollment form: validation, saving, duplicate protection and HR email.
// Uses a throwaway database and a local fake SMTP server, so no real mail is sent.
import "dotenv/config";
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import crypto from "node:crypto";
import net from "node:net";
import { MongoClient } from "mongodb";

const PORT = 8898;
const SMTP_PORT = 2526;
const BASE = `http://localhost:${PORT}`;
const DB = `s2s_selftest_${crypto.randomBytes(4).toString("hex")}`;
const admin = { "x-admin-token": process.env.ADMIN_TOKEN };

// Minimal SMTP server: records each message; `smtp.reject = true` makes it refuse recipients.
const smtp = { mails: [], reject: false };
const smtpServer = net.createServer(socket => {
  const CRLF = "\r\n";
  let buffer = "";
  let inData = false;
  let rcpt = [];
  const reply = text => socket.write(text + CRLF);
  reply("220 fake ESMTP");
  socket.on("data", chunk => {
    buffer += chunk;
    for (;;) {
      if (inData) {
        const end = buffer.indexOf(`${CRLF}.${CRLF}`);
        if (end === -1) return;
        // undo quoted-printable so tests can search the text
        const body = buffer.slice(0, end).replace(/=\r\n/g, "")
          .replace(/=([0-9A-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
        smtp.mails.push({ to: rcpt, body });
        buffer = buffer.slice(end + 5); inData = false; rcpt = [];
        reply("250 queued");
        continue;
      }
      const eol = buffer.indexOf(CRLF);
      if (eol === -1) return;
      const line = buffer.slice(0, eol);
      buffer = buffer.slice(eol + 2);
      const cmd = line.slice(0, 4).toUpperCase();
      if (cmd === "EHLO") reply(`250-fake${CRLF}250 AUTH PLAIN LOGIN`);
      else if (cmd === "AUTH") reply("235 ok");
      else if (cmd === "RCPT") {
        if (smtp.reject) reply("550 mailbox unavailable");
        else { rcpt.push(line.match(/<(.+)>/)?.[1]); reply("250 ok"); }
      } else if (cmd === "DATA") { inData = true; reply("354 go"); }
      else if (cmd === "QUIT") { reply("221 bye"); socket.end(); }
      else reply("250 ok");
    }
  });
});

let server;
let mongo;
let db;

async function api(path, { body, headers = {}, method = "POST" } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, data: await res.json().catch(() => null) };
}

const form = (extra = {}) => ({
  name: "Riya Sharma",
  email: `riya-${crypto.randomBytes(3).toString("hex")}@example.com`,
  phone: "+91 98765-43210",
  college: "VNIT Nagpur",
  courseId: "test-java",
  submissionId: crypto.randomUUID(),
  ...extra,
});

const count = filter => db.collection("enrollments").countDocuments(filter);

before(async () => {
  await new Promise(resolve => smtpServer.listen(SMTP_PORT, "127.0.0.1", resolve));
  mongo = new MongoClient(process.env.MONGODB_URI);
  await mongo.connect();
  db = mongo.db(DB);

  server = spawn(process.execPath, ["server/index.js"], {
    cwd: new URL("..", import.meta.url),
    env: {
      ...process.env, PORT: String(PORT), MONGODB_DB: DB,
      SMTP_HOST: "127.0.0.1", SMTP_PORT: String(SMTP_PORT), SMTP_SECURE: "false",
      SMTP_USER: "noreply@example.com", SMTP_PASS: "x", HR_NOTIFICATION_EMAIL: "",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.stderr.on("data", d => process.stderr.write(`[server] ${d}`));
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("server did not start")), 30000);
    server.stdout.on("data", d => String(d).includes("API running") && (clearTimeout(timer), resolve()));
    server.on("exit", code => reject(new Error(`server exited with ${code}`)));
  });

  const created = await api("/api/courses", {
    headers: admin, body: { title: "Test Java Course", slug: "test-java", published: true },
  });
  assert.equal(created.status, 201);
  await api("/api/courses", { headers: admin, body: { title: "Hidden Draft", slug: "test-draft", published: false } });
});

after(async () => {
  server?.kill();
  smtpServer.close();
  await db?.dropDatabase();
  await mongo?.close();
});

test("a valid enrollment is saved and HR is emailed", async () => {
  const before = smtp.mails.length;
  const input = form();
  const res = await api("/api/enrollments", { body: input });
  assert.equal(res.status, 201);
  assert.equal(res.data.course, "Test Java Course");
  assert.equal(res.data.hrNotified, true);
  assert.match(res.data.trackingToken, /^[a-f0-9]{64}$/);

  const row = await db.collection("enrollments").findOne({ id: res.data.id });
  assert.equal(row.name, "Riya Sharma");
  assert.equal(row.email, input.email);
  assert.equal(row.phone, "9876543210");
  assert.equal(row.college, "VNIT Nagpur");
  assert.equal(row.course, "Test Java Course");
  assert.equal(row.course_slug, "test-java");
  assert.equal(row.status, "pending");
  assert.ok(!Number.isNaN(Date.parse(row.created_at)));
  assert.equal(row.hr_notification.status, "sent");

  assert.equal(smtp.mails.length, before + 1);
  const mail = smtp.mails.at(-1);
  assert.deepEqual(mail.to, ["hr@ssinfotech.co.in"]);
  for (const text of ["Riya Sharma", input.email, "9876543210", "VNIT Nagpur", "Test Java Course", "Enrollment Date"]) {
    assert.ok(mail.body.includes(text), `email contains ${text}`);
  }

  // The returned token works with the existing "My Enrollments" status lookup.
  const status = await api("/api/enrollments/status", { body: { id: res.data.id, trackingToken: res.data.trackingToken } });
  assert.equal(status.status, 200);
  assert.equal(status.data.status, "pending");
});

test("repeat clicks and retries with the same submission create one enrollment", async () => {
  const input = form();
  const mailsBefore = smtp.mails.length;
  const results = await Promise.all(Array.from({ length: 5 }, () => api("/api/enrollments", { body: input })));
  assert.ok(results.every(r => r.status === 201 || r.status === 200), JSON.stringify(results.map(r => r.status)));
  assert.equal(new Set(results.map(r => r.data.id)).size, 1);
  assert.equal(await count({ submission_id: input.submissionId }), 1);
  assert.equal(smtp.mails.length, mailsBefore + 1, "HR is emailed once");
});

test("invalid input is rejected with field messages and nothing is saved", async () => {
  const total = await count({});
  const cases = [
    [{ name: "" }, "name"],
    [{ name: "<script>alert(1)</script>" }, "name"],
    [{ email: "not-an-email" }, "email"],
    [{ phone: "12345" }, "phone"],
    [{ phone: "5876543210" }, "phone"],
    [{ college: " " }, "college"],
    [{ courseId: "" }, "courseId"],
    [{ courseId: "no-such-course" }, "courseId"],
    [{ courseId: "test-draft" }, "courseId"],
  ];
  for (const [patch, field] of cases) {
    const res = await api("/api/enrollments", { body: form(patch) });
    assert.equal(res.status, 400, JSON.stringify(patch));
    assert.ok(res.data.fields?.[field], `${field} error for ${JSON.stringify(patch)}`);
  }
  assert.equal((await api("/api/enrollments", { body: ["array"] })).status, 400);
  assert.equal(await count({}), total);
});

test("submitted text is stored as text and escaped in the HR email", async () => {
  const res = await api("/api/enrollments", { body: form({ college: "<b>Bold</b> College & Co" }) });
  assert.equal(res.status, 201);
  const mail = smtp.mails.at(-1);
  assert.ok(mail.body.includes("&lt;b&gt;Bold&lt;/b&gt; College &amp; Co"));
  assert.equal((await db.collection("enrollments").findOne({ id: res.data.id })).college, "<b>Bold</b> College & Co");
});

test("client cannot set status, account links or batch on a website enrollment", async () => {
  const res = await api("/api/enrollments", {
    body: form({ status: "confirmed", studentId: "SSS-HACK", batch_id: "b1", course: "Other" }),
  });
  assert.equal(res.status, 201);
  const row = await db.collection("enrollments").findOne({ id: res.data.id });
  assert.equal(row.status, "pending");
  assert.equal(row.studentId, undefined);
  assert.equal(row.batch_id, undefined);
  assert.equal(row.course, "Test Java Course");
});

test("an email failure keeps the enrollment and a retry sends it without duplicating", async () => {
  smtp.reject = true;
  const input = form();
  const first = await api("/api/enrollments", { body: input });
  assert.equal(first.status, 201);
  assert.equal(first.data.hrNotified, false);
  const row = await db.collection("enrollments").findOne({ id: first.data.id });
  assert.equal(row.hr_notification.status, "failed");

  smtp.reject = false;
  const retry = await api("/api/enrollments", { body: input });
  assert.equal(retry.status, 200);
  assert.equal(retry.data.id, first.data.id);
  assert.equal(retry.data.hrNotified, true);
  assert.equal(await count({ submission_id: input.submissionId }), 1);

  // Admin retry endpoint is protected and works.
  smtp.reject = true;
  const failed = await api("/api/enrollments", { body: form() });
  smtp.reject = false;
  assert.equal((await api(`/api/enrollments/${failed.data.id}/notify-hr`)).status, 401);
  assert.equal((await api(`/api/enrollments/${failed.data.id}/notify-hr`, { headers: admin })).status, 200);
  assert.equal((await db.collection("enrollments").findOne({ id: failed.data.id })).hr_notification.status, "sent");
});

test("enrolling does not create an account or grant course access", async () => {
  const input = form();
  await api("/api/enrollments", { body: input });
  assert.equal(await db.collection("students").countDocuments({ email: input.email }), 0);

  const reg = await fetch(`${BASE}/api/student-auth/register`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Riya", email: input.email, phone: "9876543210", password: "Passw0rd123" }),
  });
  const cookie = reg.headers.getSetCookie()[0].split(";")[0];
  const mine = await fetch(`${BASE}/api/student/courses`, { headers: { Cookie: cookie } }).then(r => r.json());
  assert.deepEqual(mine.courses, []);
});

test("admin-created enrollments still use the generic admin route", async () => {
  const res = await api("/api/enrollments", { headers: admin, body: { name: "Walk-in", phone: "9876543210", status: "confirmed", city: "Nagpur" } });
  assert.equal(res.status, 201);
  assert.equal(res.data.status, "confirmed");
  assert.equal(res.data.city, "Nagpur");
});
