// Acceptance flow for LMS content: curriculum, payment-gated access, progress, assignments and certificates.
// Runs the real server against a throwaway database and upload folder; both are removed afterwards.
import "dotenv/config";
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { MongoClient } from "mongodb";

const PORT = 8897;
const BASE = `http://localhost:${PORT}`;
const DB = `s2s_selftest_${crypto.randomBytes(4).toString("hex")}`;
const UPLOADS = fs.mkdtempSync(path.join(os.tmpdir(), "s2s-uploads-"));
const admin = { "x-admin-token": process.env.ADMIN_TOKEN };
const PDF = Buffer.from("%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n");
const b64 = buf => buf.toString("base64");

let server, mongo, db;
const ctx = {};

async function api(pathname, { body, headers = {}, method = body ? "POST" : "GET", cookie } = {}) {
  const res = await fetch(`${BASE}${pathname}`, {
    method,
    headers: { "Content-Type": "application/json", ...(cookie ? { Cookie: cookie } : {}), ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  const type = res.headers.get("content-type") || "";
  const data = type.includes("json") ? await res.json().catch(() => null) : Buffer.from(await res.arrayBuffer());
  return { status: res.status, data, res };
}

async function register(name) {
  const email = `${name.toLowerCase()}-${crypto.randomBytes(3).toString("hex")}@example.com`;
  const r = await api("/api/student-auth/register", { body: { name, email, phone: "9876543210", password: "Passw0rd123" } });
  assert.equal(r.status, 201);
  return { email, studentId: r.data.student.studentId, cookie: r.res.headers.getSetCookie()[0].split(";")[0] };
}

before(async () => {
  mongo = new MongoClient(process.env.MONGODB_URI);
  await mongo.connect();
  db = mongo.db(DB);
  server = spawn(process.execPath, ["server/index.js"], {
    cwd: new URL("..", import.meta.url),
    env: { ...process.env, PORT: String(PORT), MONGODB_DB: DB, UPLOAD_DIR: UPLOADS, UPLOAD_MAX_MB: "1", SMTP_USER: "", STUDENT_PORTAL_URL: "http://localhost:8080" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.stderr.on("data", d => process.stderr.write(`[server] ${d}`));
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("server did not start")), 30000);
    server.stdout.on("data", d => String(d).includes("API running") && (clearTimeout(timer), resolve()));
    server.on("exit", code => reject(new Error(`server exited with ${code}`)));
  });
});

after(async () => {
  server?.kill();
  await db?.dropDatabase();
  await mongo?.close();
  fs.rmSync(UPLOADS, { recursive: true, force: true });
});

test("1-2. admin creates a course with modules, lessons, a PDF resource and assignments", async () => {
  const upload = await api("/api/admin/files", { headers: admin, body: { file: { name: "notes.pdf", data: b64(PDF) } } });
  assert.equal(upload.status, 201);
  ctx.file = upload.data;

  // Upload validation: type, content signature, size, admin only.
  assert.equal((await api("/api/admin/files", { headers: admin, body: { file: { name: "virus.exe", data: b64(PDF) } } })).status, 400);
  assert.equal((await api("/api/admin/files", { headers: admin, body: { file: { name: "fake.pdf", data: b64(Buffer.from("MZ not a pdf")) } } })).status, 400);
  assert.equal((await api("/api/admin/files", { headers: admin, body: { file: { name: "big.pdf", data: b64(Buffer.concat([PDF, Buffer.alloc(1.2 * 1024 * 1024)])) } } })).status, 400);
  assert.equal((await api("/api/admin/files", { body: { file: { name: "notes.pdf", data: b64(PDF) } } })).status, 401);

  const course = await api("/api/courses", {
    headers: admin,
    body: {
      title: "Cyber Security (Test)", slug: `cyber-test-${DB}`, category: "Security", published: true,
      curriculum: [
        {
          id: "m1", title: "Foundations", published: true, lessons: [
            { id: "l1", title: "What is security?", video_url: "https://www.youtube.com/watch?v=abc", body: "Intro text", resources: [{ kind: "file", file_id: ctx.file.id, file_name: "notes.pdf", title: "Notes" }] },
            { id: "l2", title: "Threat models", body: "Second lesson" },
            { id: "l-draft", title: "Unfinished lesson", published: false },
          ],
        },
        { id: "m-draft", title: "Secret module", published: false, lessons: [{ id: "l-secret", title: "Secret lesson" }] },
      ],
      completion: { require_all_lessons: true, require_admin_approval: true, signatory_name: "A. Trainer", signatory_title: "Lead Instructor" },
    },
  });
  assert.equal(course.status, 201);
  ctx.course = course.data;

  const mk = async body => (await api("/api/assignments", { headers: admin, body: { course_id: ctx.course.id, ...body } })).data;
  ctx.a1 = await mk({ title: "Lab report", instructions: "Upload your report", max_marks: 10, required: true, allow_file: true, due_date: "2099-01-01" });
  ctx.final = await mk({ title: "Final quiz", max_marks: 10, pass_marks: 6, is_final: true });
  ctx.inactive = await mk({ title: "Old task", active: false });
  assert.ok(ctx.a1.id && ctx.final.id && ctx.inactive.id);
  assert.equal((await api("/api/assignments", { headers: admin, body: { title: "x", course_id: "missing" } })).status, 400);

  ctx.other = (await api("/api/courses", { headers: admin, body: { title: "Other course", slug: `other-${DB}`, published: true } })).data;
});

test("public course metadata never includes lesson content", async () => {
  const one = await api(`/api/courses/${ctx.course.id}`);
  assert.equal(one.status, 200);
  assert.equal(one.data.curriculum, undefined);
  assert.ok((await api("/api/courses")).data.every(c => c.curriculum === undefined));
  assert.equal((await api(`/api/assignments`)).status, 401);
});

test("3-5. enrollment → approval → payment verification grants access to that course only", async () => {
  ctx.A = await register("Asha");
  ctx.B = await register("Bilal");
  const enrol = await api("/api/enrollments", { body: { name: "Asha Rao", email: ctx.A.email, phone: "9876543210", college: "VNIT", courseId: ctx.course.slug, submissionId: crypto.randomUUID() } });
  assert.equal(enrol.status, 201);

  // Approval links the existing self-registered account (it used to fail with 409).
  const approve = await api(`/api/enrollments/${enrol.data.id}/approve`, { method: "POST", headers: admin });
  assert.equal(approve.status, 200);
  assert.equal(approve.data.studentId, ctx.A.studentId);

  assert.equal((await api(`/api/student/courses/${ctx.course.id}`, { cookie: ctx.A.cookie })).status, 403, "no access before payment");
  assert.equal((await api(`/api/enrollments/${enrol.data.id}/grant-access`, { method: "POST" })).status, 401);
  const grant = await api(`/api/enrollments/${enrol.data.id}/grant-access`, { headers: admin, body: { payment_reference: "UPI-123" } });
  assert.equal(grant.status, 200);

  const mine = await api("/api/student/courses", { cookie: ctx.A.cookie });
  assert.deepEqual(mine.data.courses.map(c => c.id), [ctx.course.id]);
  assert.equal(mine.data.courses[0].progress, 0);

  const detail = await api(`/api/student/courses/${ctx.course.id}`, { cookie: ctx.A.cookie });
  assert.equal(detail.status, 200);
  const { curriculum } = detail.data.course;
  assert.deepEqual(curriculum.map(m => m.id), ["m1"], "draft module hidden");
  assert.deepEqual(curriculum[0].lessons.map(l => l.id), ["l1", "l2"], "draft lesson hidden");
  assert.equal(curriculum[0].lessons[0].body, "Intro text");

  // Student B gets a different course only.
  await api(`/api/students/${ctx.B.studentId}/courses`, { method: "PUT", headers: admin, body: { courseIds: [ctx.other.id] } });
});

test("lesson resources are downloadable only by authorised students", async () => {
  const ok = await api(`/api/student/files/${ctx.file.id}`, { cookie: ctx.A.cookie });
  assert.equal(ok.status, 200);
  assert.equal(ok.data.subarray(0, 4).toString(), "%PDF");
  assert.equal((await api(`/api/student/files/${ctx.file.id}`, { cookie: ctx.B.cookie })).status, 404);
  assert.equal((await api(`/api/student/files/${ctx.file.id}`)).status, 401);
});

test("6. progress is stored per student and only for real, published lessons", async () => {
  const done = await api(`/api/student/courses/${ctx.course.id}/lessons/l1/complete`, { method: "POST", cookie: ctx.A.cookie });
  assert.equal(done.status, 200);
  assert.equal(done.data.progress, 50);
  assert.equal((await api(`/api/student/courses/${ctx.course.id}/lessons/l1/complete`, { method: "POST", cookie: ctx.A.cookie })).data.progress, 50, "idempotent");
  assert.equal((await api(`/api/student/courses/${ctx.course.id}/lessons/l-draft/complete`, { method: "POST", cookie: ctx.A.cookie })).status, 404);
  assert.equal((await api(`/api/student/courses/${ctx.course.id}/lessons/nope/complete`, { method: "POST", cookie: ctx.A.cookie })).status, 404);
  assert.equal((await api(`/api/student/courses/${ctx.course.id}/lessons/l1/complete`, { method: "POST", cookie: ctx.B.cookie })).status, 403);
  assert.equal(await db.collection("lesson_progress").countDocuments({ studentId: ctx.A.studentId }), 1);
  // Survives a new login (another device).
  const login = await api("/api/student-auth/login", { body: { email: ctx.A.email, password: "Passw0rd123" } });
  const fresh = login.res.headers.getSetCookie()[0].split(";")[0];
  assert.deepEqual((await api(`/api/student/courses/${ctx.course.id}`, { cookie: fresh })).data.course.completion.completedLessonIds, ["l1"]);
});

test("certificate is refused while requirements are unmet", async () => {
  const r = await api(`/api/student/courses/${ctx.course.id}/certificate`, { method: "POST", cookie: ctx.A.cookie });
  assert.equal(r.status, 403);
  assert.equal(r.data.eligible, false);
  assert.equal((await api("/api/certificates", { headers: admin, body: { studentId: ctx.A.studentId, course_id: ctx.course.id, status: "issued" } })).status, 405, "no forged certificates via generic API");
  assert.equal((await api("/api/certificates", { body: { status: "issued" } })).status, 401);
});

test("6-7. assignments: submit, validation, private submissions, evaluation and released feedback", async () => {
  const list = await api(`/api/student/courses/${ctx.course.id}/assignments`, { cookie: ctx.A.cookie });
  assert.deepEqual(list.data.assignments.map(a => a.id).sort(), [ctx.a1.id, ctx.final.id].sort(), "inactive hidden");
  assert.equal((await api(`/api/student/courses/${ctx.course.id}/assignments`, { cookie: ctx.B.cookie })).status, 403);

  const sub = p => `/api/student/courses/${ctx.course.id}/assignments/${p}/submission`;
  assert.equal((await api(sub(ctx.a1.id), { cookie: ctx.A.cookie, body: { text: "", file: { name: "x.exe", data: b64(PDF) } } })).status, 400);
  assert.equal((await api(sub(ctx.a1.id), { cookie: ctx.A.cookie, body: {} })).status, 400);
  assert.equal((await api(sub(ctx.inactive.id), { cookie: ctx.A.cookie, body: { text: "hi" } })).status, 404);
  assert.equal((await api(sub(ctx.a1.id), { cookie: ctx.B.cookie, body: { text: "steal" } })).status, 403);

  const s1 = await api(sub(ctx.a1.id), { cookie: ctx.A.cookie, body: { text: "My report", file: { name: "report.pdf", data: b64(PDF) }, marks: 10, status: "evaluated", studentId: ctx.B.studentId } });
  assert.equal(s1.status, 200);
  assert.equal(s1.data.assignment.submission.status, "submitted", "client cannot set status or marks");
  assert.equal(s1.data.assignment.submission.marks, undefined);
  ctx.subFile = s1.data.assignment.submission.file.id;
  assert.equal((await api(sub(ctx.final.id), { cookie: ctx.A.cookie, body: { text: "Answers" } })).status, 200);

  assert.equal((await api(`/api/student/files/${ctx.subFile}`, { cookie: ctx.A.cookie })).status, 200);
  assert.equal((await api(`/api/student/files/${ctx.subFile}`, { cookie: ctx.B.cookie })).status, 404, "B cannot read A's upload");

  assert.equal((await api("/api/admin/submissions")).status, 401);
  const subs = (await api(`/api/admin/submissions?course_id=${ctx.course.id}`, { headers: admin })).data;
  assert.equal(subs.length, 2);
  assert.equal(subs[0].student_email, ctx.A.email);
  const byAssignment = Object.fromEntries(subs.map(s => [s.assignment_id, s]));
  assert.equal((await api(`/api/admin/files/${ctx.subFile}`, { headers: admin })).status, 200);

  const evaluate = (s, body) => api(`/api/assignment_submissions/${s.id}/evaluate`, { headers: admin, body });
  assert.equal((await api(`/api/assignment_submissions/${byAssignment[ctx.a1.id].id}/evaluate`, { body: { marks: 9 } })).status, 401);
  assert.equal((await evaluate(byAssignment[ctx.a1.id], { marks: 11 })).status, 400, "over max marks");
  assert.equal((await evaluate(byAssignment[ctx.a1.id], { marks: 9, feedback: "Good work", release: false })).status, 200);
  let view = (await api(`/api/student/courses/${ctx.course.id}/assignments`, { cookie: ctx.A.cookie })).data.assignments.find(a => a.id === ctx.a1.id);
  assert.equal(view.submission.marks, undefined, "hidden until released");
  assert.equal((await evaluate(byAssignment[ctx.a1.id], { marks: 9, feedback: "Good work", release: true })).status, 200);
  view = (await api(`/api/student/courses/${ctx.course.id}/assignments`, { cookie: ctx.A.cookie })).data.assignments.find(a => a.id === ctx.a1.id);
  assert.equal(view.submission.marks, 9);
  assert.equal(view.submission.feedback, "Good work");
  assert.equal((await api(sub(ctx.a1.id), { cookie: ctx.A.cookie, body: { text: "again" } })).status, 409, "evaluated work is locked");

  // Failing the final assessment keeps the certificate locked.
  await evaluate(byAssignment[ctx.final.id], { marks: 5, release: true });
  await api(`/api/student/courses/${ctx.course.id}/lessons/l2/complete`, { method: "POST", cookie: ctx.A.cookie });
  const status = (await api(`/api/student/courses/${ctx.course.id}/certificate`, { cookie: ctx.A.cookie })).data;
  assert.equal(status.eligible, false);
  assert.equal(status.requirements.find(r => r.key === `assignment:${ctx.final.id}`).met, false);
  await evaluate(byAssignment[ctx.final.id], { marks: 7, release: true });
});

test("8-9. completion is verified on the server, approved by admin, then downloadable and verifiable", async () => {
  const req = await api(`/api/student/courses/${ctx.course.id}/certificate`, { method: "POST", cookie: ctx.A.cookie });
  assert.equal(req.status, 200);
  assert.equal(req.data.eligible, true);
  assert.equal(req.data.certificate.status, "pending_approval");
  const code = req.data.certificate.certificate_id;
  assert.equal((await api(`/api/student/certificates/${code}/pdf`, { cookie: ctx.A.cookie })).status, 404, "not downloadable before approval");
  assert.equal((await api(`/api/certificates/verify/${code}`)).status, 404);

  const cert = await db.collection("certificates").findOne({ certificate_id: code });
  assert.equal((await api(`/api/certificates/${cert.id}/approve`, { method: "POST" })).status, 401);
  assert.equal((await api(`/api/certificates/${cert.id}/approve`, { method: "POST", headers: admin })).status, 200);

  const pdf = await api(`/api/student/certificates/${code}/pdf`, { cookie: ctx.A.cookie });
  assert.equal(pdf.status, 200);
  assert.equal(pdf.res.headers.get("content-type"), "application/pdf");
  assert.equal(pdf.data.subarray(0, 4).toString(), "%PDF");
  fs.writeFileSync(path.join(os.tmpdir(), "s2s-sample-certificate.pdf"), pdf.data);

  const verify = await api(`/api/certificates/verify/${code}`);
  assert.equal(verify.data.valid, true);
  assert.equal(verify.data.student_name, "Asha");
  assert.equal(verify.data.course_title, "Cyber Security (Test)");
  assert.equal((await api("/api/certificates/verify/SSI-0000-NOPE0000")).status, 404);

  // 10. Student B cannot reach A's certificate, content or progress.
  assert.equal((await api(`/api/student/certificates/${code}/pdf`, { cookie: ctx.B.cookie })).status, 404);
  assert.equal((await api(`/api/student/courses/${ctx.course.id}/certificate`, { cookie: ctx.B.cookie })).status, 403);
  assert.equal((await api(`/api/student/courses/${ctx.course.id}`, { cookie: ctx.B.cookie })).status, 403);
  assert.deepEqual((await api(`/api/student/courses/${ctx.other.id}`, { cookie: ctx.B.cookie })).data.course.completion.completedLessonIds, []);
});

test("11. admin edits persist and show up for students", async () => {
  const course = (await api(`/api/courses/${ctx.course.id}`, { headers: admin })).data;
  course.curriculum[0].lessons[1].title = "Threat modelling (updated)";
  course.curriculum[0].lessons.push({ id: "l3", title: "New lesson" });
  assert.equal((await api(`/api/courses/${ctx.course.id}`, { method: "PUT", headers: admin, body: course })).status, 200);
  const detail = (await api(`/api/student/courses/${ctx.course.id}`, { cookie: ctx.A.cookie })).data.course;
  assert.equal(detail.curriculum[0].lessons[1].title, "Threat modelling (updated)");
  assert.equal(detail.completion.progress, 67, "progress reflects the new lesson");
});

test("safe deletes: assigned courses and assignments with submissions are protected", async () => {
  assert.equal((await api(`/api/courses/${ctx.course.id}`, { method: "DELETE", headers: admin })).status, 409);
  assert.equal((await api(`/api/assignments/${ctx.a1.id}`, { method: "DELETE", headers: admin })).status, 409);
  assert.equal((await api(`/api/assignments/${ctx.inactive.id}`, { method: "DELETE", headers: admin })).status, 204);
  const unused = (await api("/api/courses", { headers: admin, body: { title: "Temp", slug: `temp-${DB}` } })).data;
  assert.equal((await api(`/api/courses/${unused.id}`, { method: "DELETE", headers: admin })).status, 204);
});
