// LMS features: course curriculum, lesson progress, assignments, uploads and certificates.
// Every student route derives the student from the session and checks the course assignment first.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import PDFDocument from "pdfkit";

export const LMS_TABLES = [
  "assignments", "assignment_submissions", "lesson_progress", "certificates", "files"
];

const MB = 1024 * 1024;
export const UPLOAD_MAX_BYTES = Math.max(1, Number(process.env.UPLOAD_MAX_MB || 5)) * MB;
const ALLOWED_EXTENSIONS = new Set(
  String(process.env.UPLOAD_ALLOWED_TYPES || "pdf,doc,docx,ppt,pptx,xls,xlsx,txt,zip,png,jpg,jpeg")
    .split(",").map(s => s.trim().toLowerCase().replace(/^\./, "")).filter(Boolean)
);
const MIME = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  txt: "text/plain; charset=utf-8",
  zip: "application/zip",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg"
};
// First bytes each file type must start with, so a renamed file is rejected.
const SIGNATURES = {
  pdf: ["25504446"],
  png: ["89504e47"],
  jpg: ["ffd8ff"],
  jpeg: ["ffd8ff"],
  zip: ["504b0304"],
  docx: ["504b0304"],
  pptx: ["504b0304"],
  xlsx: ["504b0304"],
  doc: ["d0cf11e0"],
  ppt: ["d0cf11e0"],
  xls: ["d0cf11e0"]
};

const UPLOAD_DIR = path.resolve(
  process.env.UPLOAD_DIR || fileURLToPath(new URL("../uploads", import.meta.url))
);
const LOGO = fileURLToPath(new URL("../assets/logo.png", import.meta.url));

const str = (value, max = 5000) =>
  typeof value === "string" ? value.replace(/\u0000/g, "").trim().slice(0, max) : "";
const newId = () => crypto.randomUUID();
const isId = value => typeof value === "string" && /^[A-Za-z0-9-]{1,100}$/.test(value);

/* ---------- Curriculum ---------- */

/** Cleans the admin-supplied curriculum so it always has a predictable shape. */
export function normalizeCurriculum(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 100).filter(m => m && typeof m === "object").map(m => ({
    id: isId(m.id) ? m.id : newId(),
    title: str(m.title, 200) || "Untitled module",
    description: str(m.description, 2000),
    published: m.published !== false,
    lessons: (Array.isArray(m.lessons) ? m.lessons : []).slice(0, 200)
      .filter(l => l && typeof l === "object")
      .map(l => ({
        id: isId(l.id) ? l.id : newId(),
        title: str(l.title, 200) || "Untitled lesson",
        description: str(l.description, 2000),
        video_url: /^https?:\/\//i.test(str(l.video_url, 1000)) ? str(l.video_url, 1000) : "",
        body: str(l.body, 50000),
        duration: str(l.duration, 50),
        required: l.required !== false,
        published: l.published !== false,
        resources: (Array.isArray(l.resources) ? l.resources : []).slice(0, 50)
          .filter(r => r && typeof r === "object")
          .map(r => r.kind === "file" && isId(r.file_id)
            ? { id: isId(r.id) ? r.id : newId(), kind: "file", title: str(r.title, 200) || str(r.file_name, 200), file_id: r.file_id, file_name: str(r.file_name, 200) }
            : { id: isId(r.id) ? r.id : newId(), kind: "link", title: str(r.title, 200), url: /^https?:\/\//i.test(str(r.url, 1000)) ? str(r.url, 1000) : "" })
          .filter(r => r.kind === "file" || r.url)
      }))
  }));
}

export function normalizeCompletion(value) {
  const v = value && typeof value === "object" ? value : {};
  return {
    require_all_lessons: v.require_all_lessons !== false,
    require_admin_approval: v.require_admin_approval === true,
    signatory_name: str(v.signatory_name, 100),
    signatory_title: str(v.signatory_title, 100)
  };
}

/** What an authorised student may see: published modules and lessons only. */
export const publishedCurriculum = course =>
  normalizeCurriculum(course?.curriculum)
    .filter(m => m.published)
    .map(({ published, ...m }) => ({
      ...m,
      lessons: m.lessons.filter(l => l.published).map(({ published: _p, ...l }) => l)
    }));

const publishedLessons = course => publishedCurriculum(course).flatMap(m => m.lessons);

/* ---------- Uploads ---------- */

function decodeUpload(file) {
  if (!file || typeof file !== "object") throw new UploadError("Choose a file to upload.");
  const name = str(file.name, 200).replace(/[\\/:*?"<>|]+/g, "_");
  const ext = path.extname(name).slice(1).toLowerCase();
  if (!name || !ALLOWED_EXTENSIONS.has(ext) || !MIME[ext]) {
    throw new UploadError(`File type not allowed. Allowed: ${[...ALLOWED_EXTENSIONS].join(", ")}.`);
  }
  const data = typeof file.data === "string" ? file.data.replace(/^data:[^,]*,/, "") : "";
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(data) || !data) throw new UploadError("The file could not be read.");
  const bytes = Buffer.from(data, "base64");
  if (!bytes.length) throw new UploadError("The file is empty.");
  if (bytes.length > UPLOAD_MAX_BYTES) {
    throw new UploadError(`File is too large. Maximum size is ${UPLOAD_MAX_BYTES / MB} MB.`);
  }
  const head = bytes.subarray(0, 8).toString("hex");
  if (SIGNATURES[ext] && !SIGNATURES[ext].some(sig => head.startsWith(sig))) {
    throw new UploadError(`The file content does not match a .${ext} file.`);
  }
  if (ext === "txt" && bytes.includes(0)) throw new UploadError("The text file contains binary data.");
  return { name, ext, bytes };
}

class UploadError extends Error {}

/* ---------- Certificates ---------- */

const certificateCode = () =>
  `SSI-${new Date().getFullYear()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

function writeCertificatePdf(cert, res, verifyUrl) {
  const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 0 });
  res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="certificate-${cert.certificate_id}.pdf"`,
    "Cache-Control": "no-store"
  });
  doc.pipe(res);

  const W = doc.page.width, H = doc.page.height;
  const purple = "#33185c", accent = "#c026d3", grey = "#4b5563";
  doc.rect(0, 0, W, H).fill("#ffffff");
  doc.lineWidth(6).strokeColor(purple).rect(24, 24, W - 48, H - 48).stroke();
  doc.lineWidth(1.5).strokeColor(accent).rect(36, 36, W - 72, H - 72).stroke();

  if (fs.existsSync(LOGO)) {
    try { doc.image(LOGO, W / 2 - 80, 46, { fit: [160, 92], align: "center" }); } catch { /* logo is optional */ }
  }
  doc.fillColor(grey).font("Helvetica").fontSize(12).text("SS INFOTECH · SKILL TRAINING CENTER", 0, 142, { align: "center", characterSpacing: 2 });
  doc.fillColor(purple).font("Helvetica-Bold").fontSize(34).text("Certificate of Completion", 0, 170, { align: "center" });
  doc.fillColor(grey).font("Helvetica").fontSize(14).text("This is to certify that", 0, 228, { align: "center" });
  doc.fillColor("#111827").font("Helvetica-Bold").fontSize(30).text(cert.student_name, 60, 254, { align: "center", width: W - 120 });
  doc.fillColor(grey).font("Helvetica").fontSize(14).text("has successfully completed the course", 0, 302, { align: "center" });
  doc.fillColor(accent).font("Helvetica-Bold").fontSize(22).text(cert.course_title, 60, 326, { align: "center", width: W - 120 });

  const issued = new Date(cert.issued_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const y = H - 150;
  doc.fillColor(grey).font("Helvetica").fontSize(11);
  doc.text("Issue date", 90, y).font("Helvetica-Bold").fillColor("#111827").fontSize(13).text(issued, 90, y + 16);
  doc.font("Helvetica").fillColor(grey).fontSize(11).text("Certificate ID", 90, y + 44)
    .font("Helvetica-Bold").fillColor("#111827").fontSize(13).text(cert.certificate_id, 90, y + 60);

  if (cert.signatory_name) {
    doc.lineWidth(1).strokeColor("#9ca3af").moveTo(W - 300, y + 30).lineTo(W - 90, y + 30).stroke();
    doc.font("Helvetica-Bold").fillColor("#111827").fontSize(13).text(cert.signatory_name, W - 300, y + 38, { width: 210, align: "center" });
    if (cert.signatory_title) {
      doc.font("Helvetica").fillColor(grey).fontSize(11).text(cert.signatory_title, W - 300, y + 56, { width: 210, align: "center" });
    }
  }
  if (verifyUrl) {
    doc.font("Helvetica").fillColor(grey).fontSize(9).text(`Verify at ${verifyUrl}`, 0, H - 58, { align: "center" });
  }
  doc.end();
}

/* ---------- Routes ---------- */

export function createLms(ctx) {
  const { collections, send, readBody, isObject, isAdmin, getSessionStudent, assignedCourseIds } = ctx;

  async function setup() {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    await collections.lesson_progress.createIndex({ studentId: 1, course_id: 1, lesson_id: 1 }, { unique: true });
    await collections.assignment_submissions.createIndex({ assignment_id: 1, studentId: 1 }, { unique: true });
    await collections.certificates.createIndex({ studentId: 1, course_id: 1 }, { unique: true });
    await collections.certificates.createIndex({ certificate_id: 1 }, { unique: true });
  }

  async function saveUpload(file, owner) {
    const { name, ext, bytes } = decodeUpload(file);
    const id = newId();
    await fs.promises.writeFile(path.join(UPLOAD_DIR, id), bytes);
    const meta = {
      id, name, ext, mime: MIME[ext], size: bytes.length,
      ...owner, created_at: new Date().toISOString()
    };
    await collections.files.insertOne(meta);
    return { id, name, size: bytes.length, ext };
  }

  async function streamFile(res, meta) {
    const filePath = path.join(UPLOAD_DIR, meta.id);
    if (!fs.existsSync(filePath)) return send(res, 404, { error: "File not found" });
    res.writeHead(200, {
      "Content-Type": meta.mime || "application/octet-stream",
      "Content-Length": meta.size,
      "Content-Disposition": `attachment; filename="${encodeURIComponent(meta.name)}"; filename*=UTF-8''${encodeURIComponent(meta.name)}`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store"
    });
    fs.createReadStream(filePath).pipe(res);
  }

  /** Progress and certificate requirements, computed only from stored data. */
  async function completionStatus(course, studentId) {
    const config = normalizeCompletion(course.completion);
    const lessons = publishedLessons(course);
    const done = new Set(
      (await collections.lesson_progress.find({ studentId, course_id: course.id }).toArray())
        .map(p => p.lesson_id)
    );
    const completedLessonIds = lessons.filter(l => done.has(l.id)).map(l => l.id);
    const requiredLessons = lessons.filter(l => l.required);
    const requiredDone = requiredLessons.filter(l => done.has(l.id)).length;

    const assignments = await collections.assignments.find({ course_id: course.id, active: { $ne: false } }).toArray();
    const submissions = new Map(
      (await collections.assignment_submissions.find({ studentId, course_id: course.id }).toArray())
        .map(s => [s.assignment_id, s])
    );

    const requirements = [];
    if (config.require_all_lessons && requiredLessons.length) {
      requirements.push({
        key: "lessons",
        label: `Complete all required lessons (${requiredDone}/${requiredLessons.length})`,
        met: requiredDone === requiredLessons.length
      });
    }
    for (const a of assignments.filter(a => a.required || a.is_final)) {
      const s = submissions.get(a.id);
      const evaluated = s?.status === "evaluated" && s.released === true;
      requirements.push(a.is_final
        ? {
          key: `assignment:${a.id}`,
          label: `Pass the final assessment "${a.title}" (pass mark ${Number(a.pass_marks) || 0}/${Number(a.max_marks) || 0})`,
          met: evaluated && Number(s.marks) >= (Number(a.pass_marks) || 0)
        }
        : { key: `assignment:${a.id}`, label: `Submit "${a.title}" and get it evaluated`, met: evaluated });
    }

    return {
      progress: lessons.length ? Math.round((completedLessonIds.length / lessons.length) * 100) : 0,
      completedLessonIds,
      totalLessons: lessons.length,
      requirements,
      eligible: requirements.length > 0 && requirements.every(r => r.met),
      requiresApproval: config.require_admin_approval
    };
  }

  const certificateView = c => c && ({
    certificate_id: c.certificate_id,
    status: c.status,
    student_name: c.student_name,
    course_title: c.course_title,
    requested_at: c.requested_at,
    issued_at: c.issued_at ?? null
  });

  async function issueOrRequestCertificate(course, student) {
    const existing = await collections.certificates.findOne({ studentId: student.studentId, course_id: course.id });
    if (existing) return { certificate: existing, created: false };

    const config = normalizeCompletion(course.completion);
    const now = new Date().toISOString();
    const cert = {
      id: newId(),
      certificate_id: certificateCode(),
      studentId: student.studentId,
      student_name: student.name || student.email,
      course_id: course.id,
      course_title: course.title,
      status: config.require_admin_approval ? "pending_approval" : "issued",
      requested_at: now,
      issued_at: config.require_admin_approval ? null : now,
      signatory_name: config.signatory_name || process.env.CERT_SIGNATORY_NAME || "",
      signatory_title: config.signatory_title || process.env.CERT_SIGNATORY_TITLE || "",
      created_at: now
    };
    try {
      await collections.certificates.insertOne(cert);
      return { certificate: cert, created: true };
    } catch (error) {
      if (error?.code === 11000) {
        return { certificate: await collections.certificates.findOne({ studentId: student.studentId, course_id: course.id }), created: false };
      }
      throw error;
    }
  }

  /** Resolves the session student and an assigned course, or sends the error response. */
  async function studentCourse(req, res, courseId) {
    const { student, error } = await getSessionStudent(req, res);
    if (!student) { send(res, 401, { error }); return null; }
    if (!isId(courseId) || !assignedCourseIds(student).includes(courseId)) {
      send(res, 403, { error: "This course is not assigned to your account" });
      return null;
    }
    const course = await collections.courses.findOne({ id: courseId });
    if (!course) { send(res, 404, { error: "Course not found" }); return null; }
    return { student, course };
  }

  const assignmentView = (a, s) => ({
    id: a.id,
    title: a.title ?? "",
    instructions: a.instructions ?? "",
    module_id: a.module_id ?? "",
    due_date: a.due_date ?? "",
    max_marks: Number(a.max_marks) || 0,
    pass_marks: a.is_final ? Number(a.pass_marks) || 0 : null,
    required: !!a.required,
    is_final: !!a.is_final,
    allow_text: a.allow_text !== false,
    allow_file: !!a.allow_file,
    submission: s ? {
      status: s.status,
      text: s.text ?? "",
      file: s.file_id ? { id: s.file_id, name: s.file_name } : null,
      submitted_at: s.submitted_at,
      late: !!s.late,
      // Marks and feedback stay hidden until the admin releases them.
      ...(s.released ? { marks: s.marks, feedback: s.feedback ?? "", evaluated_at: s.evaluated_at } : {})
    } : null
  });

  /** Returns true when the request was handled here. */
  async function handle(req, res, parts) {
    if (parts[1] !== "api") return false;
    const method = req.method;
    const [, , a, b, c, d, e, f] = parts;

    /* ----- Student ----- */
    if (a === "student" && b === "courses" && c) {
      // POST|DELETE /api/student/courses/:cid/lessons/:lid/complete
      if (d === "lessons" && e && f === "complete" && parts.length === 8 && (method === "POST" || method === "DELETE")) {
        const ok = await studentCourse(req, res, c);
        if (!ok) return true;
        if (!publishedLessons(ok.course).some(l => l.id === e)) {
          return send(res, 404, { error: "Lesson not found" }), true;
        }
        if (method === "POST") {
          await collections.lesson_progress.updateOne(
            { studentId: ok.student.studentId, course_id: c, lesson_id: e },
            { $setOnInsert: { id: newId(), completed_at: new Date().toISOString() } },
            { upsert: true }
          );
        } else {
          await collections.lesson_progress.deleteOne({ studentId: ok.student.studentId, course_id: c, lesson_id: e });
        }
        return send(res, 200, await completionStatus(ok.course, ok.student.studentId)), true;
      }

      // GET /api/student/courses/:cid/assignments
      if (d === "assignments" && parts.length === 6 && method === "GET") {
        const ok = await studentCourse(req, res, c);
        if (!ok) return true;
        const list = await collections.assignments.find({ course_id: c, active: { $ne: false } }).sort({ created_at: 1 }).toArray();
        const subs = new Map(
          (await collections.assignment_submissions.find({ studentId: ok.student.studentId, course_id: c }).toArray())
            .map(s => [s.assignment_id, s])
        );
        return send(res, 200, { assignments: list.map(x => assignmentView(x, subs.get(x.id))) }), true;
      }

      // POST /api/student/courses/:cid/assignments/:aid/submission
      if (d === "assignments" && e && f === "submission" && parts.length === 8 && method === "POST") {
        const ok = await studentCourse(req, res, c);
        if (!ok) return true;
        const assignment = await collections.assignments.findOne({ id: e, course_id: c, active: { $ne: false } });
        if (!assignment) return send(res, 404, { error: "Assignment not found" }), true;

        const body = await readBody(req);
        if (!isObject(body)) return send(res, 400, { error: "Invalid submission" }), true;
        const studentId = ok.student.studentId;
        const previous = await collections.assignment_submissions.findOne({ assignment_id: e, studentId });
        if (previous?.status === "evaluated") {
          return send(res, 409, { error: "This assignment has already been evaluated." }), true;
        }

        const text = assignment.allow_text !== false ? str(body.text, 20000) : "";
        const hasFile = !!(assignment.allow_file && body.file);
        const keepFile = !!(assignment.allow_file && !hasFile && body.keepFile && previous?.file_id);
        if (!text && !hasFile && !keepFile) {
          return send(res, 400, { error: assignment.allow_file ? "Write an answer or attach a file." : "Write your answer before submitting." }), true;
        }

        let file = null;
        if (hasFile) {
          try {
            file = await saveUpload(body.file, { owner: "student", studentId, course_id: c, assignment_id: e, purpose: "submission" });
          } catch (error) {
            if (error instanceof UploadError) return send(res, 400, { error: error.message }), true;
            throw error;
          }
        }

        const now = new Date();
        const due = assignment.due_date ? new Date(`${String(assignment.due_date).slice(0, 10)}T23:59:59+05:30`) : null;
        const submission = {
          text,
          file_id: file?.id ?? (keepFile ? previous.file_id : null),
          file_name: file?.name ?? (keepFile ? previous.file_name : null),
          status: "submitted",
          late: !!(due && now > due),
          submitted_at: now.toISOString()
        };
        await collections.assignment_submissions.updateOne(
          { assignment_id: e, studentId },
          { $set: submission, $setOnInsert: { id: newId(), course_id: c, released: false, created_at: now.toISOString() } },
          { upsert: true }
        );
        const saved = await collections.assignment_submissions.findOne({ assignment_id: e, studentId });
        return send(res, 200, { assignment: assignmentView(assignment, saved) }), true;
      }

      // GET|POST /api/student/courses/:cid/certificate
      if (d === "certificate" && parts.length === 6 && (method === "GET" || method === "POST")) {
        const ok = await studentCourse(req, res, c);
        if (!ok) return true;
        const status = await completionStatus(ok.course, ok.student.studentId);
        let cert = await collections.certificates.findOne({ studentId: ok.student.studentId, course_id: c });
        if (method === "POST" && !cert) {
          if (!status.eligible) {
            return send(res, 403, { error: "You have not met the completion requirements yet.", ...status }), true;
          }
          cert = (await issueOrRequestCertificate(ok.course, ok.student)).certificate;
        }
        return send(res, 200, { ...status, certificate: certificateView(cert) }), true;
      }
    }

    // GET /api/student/certificates/:certificateId/pdf
    if (a === "student" && b === "certificates" && c && d === "pdf" && parts.length === 6 && method === "GET") {
      const { student, error } = await getSessionStudent(req, res);
      if (!student) return send(res, 401, { error }), true;
      const cert = await collections.certificates.findOne({ certificate_id: c, studentId: student.studentId, status: "issued" });
      if (!cert) return send(res, 404, { error: "Certificate not found" }), true;
      const base = (process.env.STUDENT_PORTAL_URL || "").replace(/\/$/, "");
      writeCertificatePdf(cert, res, base ? `${base}/verify-certificate/${cert.certificate_id}` : "");
      return true;
    }

    // GET /api/student/files/:fileId — lesson resources of assigned courses, or the student's own uploads
    if (a === "student" && b === "files" && c && parts.length === 5 && method === "GET") {
      const { student, error } = await getSessionStudent(req, res);
      if (!student) return send(res, 401, { error }), true;
      const meta = isId(c) ? await collections.files.findOne({ id: c }) : null;
      let allowed = false;
      if (meta?.purpose === "submission") {
        allowed = meta.studentId === student.studentId;
      } else if (meta?.purpose === "lesson_resource") {
        for (const courseId of assignedCourseIds(student)) {
          const course = await collections.courses.findOne({ id: courseId });
          if (course && publishedLessons(course).some(l => l.resources.some(r => r.kind === "file" && r.file_id === meta.id))) {
            allowed = true;
            break;
          }
        }
      }
      if (!allowed) return send(res, 404, { error: "File not found" }), true;
      await streamFile(res, meta);
      return true;
    }

    /* ----- Public ----- */

    // GET /api/certificates/verify/:certificateId
    if (a === "certificates" && b === "verify" && c && parts.length === 5 && method === "GET") {
      const cert = /^[A-Z0-9-]{6,40}$/.test(c)
        ? await collections.certificates.findOne({ certificate_id: c, status: "issued" })
        : null;
      if (!cert) return send(res, 404, { valid: false, error: "No certificate found with this ID" }), true;
      return send(res, 200, {
        valid: true,
        certificate_id: cert.certificate_id,
        student_name: cert.student_name,
        course_title: cert.course_title,
        issued_at: cert.issued_at
      }), true;
    }

    /* ----- Admin ----- */
    const adminOnly = () => {
      if (isAdmin(req)) return true;
      send(res, 401, { error: "unauthorized" });
      return false;
    };

    // POST /api/admin/files — upload a lesson resource; GET /api/admin/files/:id — download any file
    if (a === "admin" && b === "files") {
      if (parts.length === 4 && method === "POST") {
        if (!adminOnly()) return true;
        const body = await readBody(req);
        try {
          const file = await saveUpload(isObject(body) ? body.file : null, { owner: "admin", purpose: "lesson_resource" });
          return send(res, 201, file), true;
        } catch (error) {
          if (error instanceof UploadError) return send(res, 400, { error: error.message }), true;
          throw error;
        }
      }
      if (parts.length === 5 && c && method === "GET") {
        if (!adminOnly()) return true;
        const meta = isId(c) ? await collections.files.findOne({ id: c }) : null;
        if (!meta) return send(res, 404, { error: "File not found" }), true;
        await streamFile(res, meta);
        return true;
      }
    }

    // GET /api/admin/submissions?assignment_id=… — submissions with student details
    if (a === "admin" && b === "submissions" && parts.length === 4 && method === "GET") {
      if (!adminOnly()) return true;
      const url = new URL(req.url, "http://localhost");
      const filter = {};
      if (url.searchParams.get("assignment_id")) filter.assignment_id = url.searchParams.get("assignment_id");
      if (url.searchParams.get("course_id")) filter.course_id = url.searchParams.get("course_id");
      const subs = await collections.assignment_submissions.find(filter).sort({ submitted_at: -1 }).toArray();
      const students = new Map(
        (await collections.students.find({ studentId: { $in: [...new Set(subs.map(s => s.studentId))] } }).toArray())
          .map(s => [s.studentId, s])
      );
      return send(res, 200, subs.map(({ _id, ...s }) => ({
        ...s,
        student_name: students.get(s.studentId)?.name ?? "",
        student_email: students.get(s.studentId)?.email ?? ""
      }))), true;
    }

    // POST /api/assignment_submissions/:id/evaluate  { marks, feedback, release }
    if (a === "assignment_submissions" && b && c === "evaluate" && parts.length === 5 && method === "POST") {
      if (!adminOnly()) return true;
      const sub = await collections.assignment_submissions.findOne({ id: b });
      if (!sub) return send(res, 404, { error: "Submission not found" }), true;
      const assignment = await collections.assignments.findOne({ id: sub.assignment_id });
      const body = await readBody(req);
      const marks = Number(isObject(body) ? body.marks : NaN);
      const max = Number(assignment?.max_marks) || 0;
      if (!Number.isFinite(marks) || marks < 0 || (max && marks > max)) {
        return send(res, 400, { error: `Marks must be between 0 and ${max || "the maximum"}.` }), true;
      }
      const update = {
        marks,
        feedback: str(body.feedback, 5000),
        status: "evaluated",
        released: body.release !== false,
        evaluated_at: new Date().toISOString()
      };
      await collections.assignment_submissions.updateOne({ id: b }, { $set: update });
      return send(res, 200, { ...sub, ...update, _id: undefined }), true;
    }

    // POST /api/certificates/:id/approve — issue a certificate waiting for approval
    if (a === "certificates" && b && c === "approve" && parts.length === 5 && method === "POST") {
      if (!adminOnly()) return true;
      const cert = await collections.certificates.findOne({ id: b });
      if (!cert) return send(res, 404, { error: "Certificate not found" }), true;
      if (cert.status === "issued") return send(res, 409, { error: "Certificate is already issued" }), true;
      const course = await collections.courses.findOne({ id: cert.course_id });
      const status = course ? await completionStatus(course, cert.studentId) : { eligible: false };
      if (!status.eligible) {
        return send(res, 409, { error: "The student no longer meets the completion requirements." }), true;
      }
      const issued_at = new Date().toISOString();
      await collections.certificates.updateOne({ id: b }, { $set: { status: "issued", issued_at } });
      return send(res, 200, { ...cert, _id: undefined, status: "issued", issued_at }), true;
    }

    return false;
  }

  return { setup, handle, completionStatus };
}
