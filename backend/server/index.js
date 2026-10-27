import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import "dotenv/config";
import http from "node:http";
import fs from "node:fs";
import crypto from "node:crypto";
import { MongoClient } from "mongodb";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import {
  createLms, LMS_TABLES, UPLOAD_MAX_BYTES,
  normalizeCurriculum, normalizeCompletion, publishedCurriculum
} from "./lms.js";

const SESSION_COOKIE = "s2s_student_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
// Set SESSION_COOKIE_SAMESITE=None (which implies Secure) when the website and API are on different sites.
const COOKIE_SAMESITE = process.env.SESSION_COOKIE_SAMESITE || "Lax";
const COOKIE_SECURE =
  process.env.SESSION_COOKIE_SECURE === "true" ||
  COOKIE_SAMESITE.toLowerCase() === "none";

function sessionCookie(value, maxAgeSeconds) {
  return `${SESSION_COOKIE}=${value}; HttpOnly; Path=/; SameSite=${COOKIE_SAMESITE}; Max-Age=${maxAgeSeconds}${COOKIE_SECURE ? "; Secure" : ""}`;
}

function createStudentSessionId() {
  return crypto.randomBytes(32).toString("hex");
}

function parseCookies(req) {
  const cookieHeader = req.headers.cookie || "";

  return Object.fromEntries(
    cookieHeader
      .split(";")
      .map((cookie) => cookie.trim())
      .filter(Boolean)
      .map((cookie) => {
        const separatorIndex = cookie.indexOf("=");

        if (separatorIndex === -1) {
          return [cookie, ""];
        }

        const name = cookie.slice(0, separatorIndex).trim();
        const value = cookie.slice(separatorIndex + 1).trim();

        try {
          return [name, decodeURIComponent(value)];
        } catch {
          return [name, value];
        }
      })
  );
}
function hashSessionId(sessionId) {
  return crypto.createHash("sha256").update(sessionId).digest("hex");
}
const PORT = Number(process.env.PORT || 8787);
const TOKEN = process.env.ADMIN_TOKEN;
const URI = process.env.MONGODB_URI;

const toOrigin = value => {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
};

// Local dev servers (website on 8080, admin on 5174 — Vite moves to the next port when one is busy),
// plus the deployed portals and any extra origins listed in CORS_ORIGINS (comma separated).
const DEV_ORIGINS = ["localhost", "127.0.0.1"].flatMap(host =>
  [8080, 5173, 5174, 5175, 5176].map(port => `http://${host}:${port}`)
);

const ALLOWED_ORIGINS = new Set(
  [
    ...DEV_ORIGINS,
    process.env.STUDENT_PORTAL_URL,
    process.env.ADMIN_PORTAL_URL,
    ...String(process.env.CORS_ORIGINS || "").split(","),
  ]
    .map(value => String(value || "").trim())
    .filter(Boolean)
    .map(toOrigin)
    .filter(Boolean)
);

// Batch fields that only students enrolled in that batch may see.
const PRIVATE_BATCH_FIELDS = ["meeting_link"];
const BATCH_TABLES = new Set(["online_training", "classroom_training"]);

const SEED = new URL("../src/seed.json", import.meta.url);

const TABLES = [
  "courses", "students", "student_setup_tokens", "student_sessions",
  "placements", "posts", "gallery", "colleges",
  "online_training", "classroom_training", "settings", "trainers",
  "corporate_programs", "corp_categories", "companies", "locations",
  "overseas_courses", "overseas_countries", "overseas_languages",
  "placement_companies", "placement_stats", "jobs", "testimonials",
  "enrollments", "enquiries", "corp_enquiries", "overseas_enquiries",
  "banners", "site_content",
  ...LMS_TABLES
];

// LMS records that only change through their dedicated, validated endpoints.
const NO_GENERIC_WRITE = new Set(["assignment_submissions", "lesson_progress", "certificates", "files"]);
const NO_GENERIC_DELETE = new Set(["lesson_progress", "files"]);

const PUBLIC_WRITE = new Set([
  "enrollments", "enquiries", "corp_enquiries",
  "overseas_enquiries", "testimonials"
]);

const PUBLIC_READ = new Set([
  "courses",
  "posts",
  "gallery",
  "colleges",
  "online_training",
  "classroom_training",
  "testimonials"
]);

const send = (res, code, data, origin = null, extraHeaders = {}) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type,x-admin-token",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Vary": "Origin",
    ...extraHeaders,
  };

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Credentials"] = "true";
  }

  res.writeHead(code, headers);

  if (code === 204 || data === undefined) {
    return res.end();
  }

  return res.end(JSON.stringify(data));
};



  


const readBody = req => new Promise((resolve, reject) => {
  let raw = "";
  req.on("data", chunk => {
    raw += chunk;
    if (raw.length > Math.max(8e6, UPLOAD_MAX_BYTES * 1.4 + 1e5)) {
      reject(new Error("too large"));
      req.destroy();
    }
  });
  req.on("end", () => {
    try {
      resolve(raw ? JSON.parse(raw) : {});
    } catch {
      reject(new Error("invalid JSON"));
    }
  });
});

const isObject = value =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const isAdmin = req => {
  const supplied = Buffer.from(String(req.headers["x-admin-token"] ?? ""));
  const expected = Buffer.from(TOKEN || "");
  return Boolean(TOKEN) &&
    supplied.length === expected.length &&
    crypto.timingSafeEqual(supplied, expected);
};

const visibleTo = (admin, table, row) =>
  admin || (
    row.published !== false &&
    (table !== "testimonials" || row.status === "approved")
  );

const clean = doc => {
  if (!doc) return doc;
  const { _id, ...row } = doc;
  return row;
};

const publicView = (admin, table, row) => {
  if (!admin && table === "courses") {
    // Lesson content is only served to assigned students through /api/student/courses.
    const { curriculum, completion, ...rest } = row;
    return rest;
  }
  if (admin || !BATCH_TABLES.has(table)) return row;
  const copy = { ...row };
  for (const field of PRIVATE_BATCH_FIELDS) delete copy[field];
  return copy;
};

// Student account fields that are safe to show in the admin panel (never the password hash).
const studentSummary = student => ({
  id: student.id,
  studentId: student.studentId,
  name: student.name ?? "",
  email: student.email ?? "",
  phone: student.phone ?? "",
  course: student.course ?? "",
  enrollmentId: student.enrollmentId ?? "",
  status: student.status ?? "",
  assignedCourseIds: assignedCourseIds(student),
  created_at: student.created_at ?? ""
});

const assignedCourseIds = student =>
  Array.isArray(student?.assignedCourseIds)
    ? student.assignedCourseIds.filter(value => typeof value === "string")
    : [];

const courseCard = course => ({
  id: course.id,
  slug: course.slug ?? "",
  title: course.title ?? "",
  short: course.short ?? "",
  description: course.description ?? "",
  image: course.image ?? "",
  category: course.category ?? "",
  level: course.level ?? "",
  duration: course.duration ?? ""
});

function createStudentId() {
  return `SSS-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}

function hashSetupToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function createSetupToken() {
  const token = crypto.randomBytes(32).toString("hex");

  return {
    token,
    tokenHash: hashSetupToken(token),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString()
  };
}

const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendPasswordSetupEmail(email, studentId, token) {
  const baseUrl = process.env.STUDENT_PORTAL_URL;

  if (!baseUrl || !process.env.SMTP_USER) {
    throw new Error("Student portal URL or SMTP configuration is missing");
  }

  const setupUrl = `${baseUrl}/set-password?token=${encodeURIComponent(token)}`;

  await mailer.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: "Your Student Account - Set Your Password",
    text: `Your Student ID is ${studentId}.\nSet your password using this link:\n${setupUrl}\n\nThis link expires in 10 minutes.`,
    html: `<p>Your Student ID is <strong>${studentId}</strong>.</p>
      <p><a href="${setupUrl}">Set your password</a></p>
      <p>This link expires in 10 minutes.</p>`
  });
}

const HR_EMAIL = process.env.HR_NOTIFICATION_EMAIL || "hr@ssinfotech.co.in";
const EMAIL_TIMEOUT_MS = 15000;

const escapeHtml = value =>
  String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[ch]);

// Trim, drop control characters and collapse runs of whitespace.
const tidy = value =>
  typeof value === "string"
    ? value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim()
    : "";

function validateEnrollment(body) {
  const fields = {};
  const name = tidy(body.name);
  const email = tidy(body.email).toLowerCase();
  const rawPhone = tidy(body.phone).replace(/[\s()-]/g, "");
  const college = tidy(body.college);
  const courseId = tidy(body.courseId);

  if (name.length < 2 || name.length > 100 || !/^[\p{L}][\p{L} .'-]*$/u.test(name)) {
    fields.name = "Enter your full name (letters only).";
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fields.email = "Enter a valid email address.";
  }
  const phoneMatch = rawPhone.match(/^(?:\+?91|0)?([6-9]\d{9})$/);
  if (!phoneMatch) {
    fields.phone = "Enter a valid 10-digit Indian mobile number.";
  }
  if (college.length < 2 || college.length > 150) {
    fields.college = "Enter your college name.";
  }
  if (!courseId || courseId.length > 100) {
    fields.courseId = "Choose a course to enroll in.";
  }

  return {
    fields,
    value: { name, email, phone: phoneMatch?.[1] ?? "", college, courseId }
  };
}

const withTimeout = (promise, ms) =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("email timed out")), ms))
  ]);

async function sendHrEnrollmentEmail(enrollment) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    throw new Error("SMTP configuration is missing");
  }

  const when = new Date(enrollment.created_at).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short"
  });
  const rows = [
    ["Student Name", enrollment.name],
    ["Student Email", enrollment.email],
    ["Phone Number", enrollment.phone],
    ["College Name", enrollment.college],
    ["Course Name", enrollment.course],
    ["Enrollment Date & Time", `${when} IST`],
    ["Enrollment ID", enrollment.enrollment_id]
  ];

  await withTimeout(
    mailer.sendMail({
      from: process.env.SMTP_USER,
      to: HR_EMAIL,
      replyTo: enrollment.email,
      subject: `New enrollment: ${enrollment.course} — ${enrollment.name}`,
      text: rows.map(([label, value]) => `${label}: ${value}`).join("\n"),
      html: `<h2>New course enrollment</h2><table cellpadding="6">${rows
        .map(([label, value]) => `<tr><th align="left">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`)
        .join("")}</table>`
    }),
    EMAIL_TIMEOUT_MS
  );
}

async function start() {
  if (!URI) throw new Error("MONGODB_URI is missing in .env");
  if (!TOKEN || TOKEN === "change-me") {
    throw new Error("Set a strong ADMIN_TOKEN in .env");
  }

  const client = new MongoClient(URI);
  await client.connect();

  const database = client.db(process.env.MONGODB_DB || "test");
  await database.command({ ping: 1 });
  console.log("Connected to MongoDB");

  const collections = Object.fromEntries(
    TABLES.map(table => [table, database.collection(table)])
  );

  // Lets a retried website enrollment find the record it already created.
  await collections.enrollments.createIndex(
    { submission_id: 1 },
    { unique: true, partialFilterExpression: { submission_id: { $type: "string" } } }
  );

  // Sends the HR email for a saved enrollment and records the outcome on the enrollment.
  async function notifyHr(enrollment) {
    const attempts = (enrollment.hr_notification?.attempts ?? 0) + 1;
    let result;

    try {
      await sendHrEnrollmentEmail(enrollment);
      result = { status: "sent", attempts, sent_at: new Date().toISOString() };
    } catch (error) {
      console.error("HR enrollment email failed:", error.message);
      result = {
        status: "failed",
        attempts,
        last_error: String(error.message).slice(0, 200),
        last_attempt_at: new Date().toISOString()
      };
    }

    await collections.enrollments.updateOne(
      { id: enrollment.id },
      { $set: { hr_notification: result } }
    );
    return result.status === "sent";
  }

  // Resolve the logged-in student from the HttpOnly session cookie only — never from request data.
  async function getSessionStudent(req, res) {
    const sessionId = parseCookies(req)[SESSION_COOKIE];

    if (!sessionId || !/^[a-f0-9]{64}$/i.test(sessionId)) {
      return { error: "Please log in" };
    }

    const session = await collections.student_sessions.findOne({
      sessionHash: hashSessionId(sessionId)
    });

    if (!session || new Date(session.expiresAt).getTime() <= Date.now()) {
      if (session) {
        await collections.student_sessions.deleteOne({ id: session.id });
      }

      res.setHeader("Set-Cookie", sessionCookie("", 0));
      return { error: "Session expired. Please log in again." };
    }

    const student = await collections.students.findOne({
      studentId: session.studentId,
      status: "active"
    });

    if (!student) {
      await collections.student_sessions.deleteOne({ id: session.id });
      res.setHeader("Set-Cookie", sessionCookie("", 0));
      return { error: "Student account is not active" };
    }

    return { student };
  }

  const lms = createLms({
    collections, send, readBody, isObject, isAdmin, getSessionStudent, assignedCourseIds
  });
  await lms.setup();

  // Seed each collection only when it is empty.
  const seed = JSON.parse(fs.readFileSync(SEED, "utf8"));
  for (const table of TABLES) {
    const collection = collections[table];
    if (await collection.countDocuments() === 0) {
      const now = new Date().toISOString();
      const rows = (seed[table] ?? []).map(row => ({
        ...row,
        id: row.id ?? crypto.randomUUID(),
        created_at: row.created_at ?? now
      }));
      if (rows.length) await collection.insertMany(rows);
    }
  }

  // Shape-checks course content and assignments written through the generic admin routes.
  async function prepareLmsRow(table, row) {
    if (table === "courses") {
      if ("curriculum" in row) row.curriculum = normalizeCurriculum(row.curriculum);
      if ("completion" in row) row.completion = normalizeCompletion(row.completion);
    }
    if (table === "assignments") {
      row.title = tidy(row.title).slice(0, 200);
      if (!row.title) return "Assignment title is required";
      if (!(await collections.courses.findOne({ id: row.course_id }))) return "Choose a valid course";
      row.instructions = typeof row.instructions === "string" ? row.instructions.slice(0, 20000) : "";
      row.max_marks = Math.max(0, Number(row.max_marks) || 0);
      row.pass_marks = Math.min(row.max_marks, Math.max(0, Number(row.pass_marks) || 0));
      row.due_date = /^\d{4}-\d{2}-\d{2}/.test(String(row.due_date ?? "")) ? String(row.due_date).slice(0, 10) : "";
      for (const key of ["required", "is_final", "allow_file"]) row[key] = row[key] === true;
      row.allow_text = row.allow_text !== false;
      row.active = row.active !== false;
      if (!row.allow_text && !row.allow_file) return "Allow a text answer, a file, or both";
    }
    return "";
  }

  // Returns a reason when deleting would break student data, otherwise "".
  async function deleteBlocker(table, id) {
    if (table === "courses") {
      const assigned = await collections.students.countDocuments({ assignedCourseIds: id });
      if (assigned) return `This course is assigned to ${assigned} student(s). Unpublish it, or remove it from their accounts in Student Accounts first.`;
      const certs = await collections.certificates.countDocuments({ course_id: id });
      if (certs) return "Certificates have been issued for this course, so it cannot be deleted. Unpublish it instead.";
      await collections.assignments.deleteMany({ course_id: id });
    }
    if (table === "assignments") {
      const subs = await collections.assignment_submissions.countDocuments({ assignment_id: id });
      if (subs) return `This assignment has ${subs} submission(s). Deactivate it instead of deleting.`;
    }
    return "";
  }

  const server = http.createServer(async (req, res) => {
   

    const url = new URL(req.url, "http://localhost");
    const parts = url.pathname.split("/");
    const table = parts[2];
    const id = parts[3];

    const origin = req.headers.origin || null;

    if (origin && !ALLOWED_ORIGINS.has(origin)) {
      return send(res, 403, { error: "Origin not allowed" });
    }

    // Applied to every response from an allowed origin, including those sent without passing `origin`.
    if (origin) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type,x-admin-token");
      res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
      res.setHeader("Vary", "Origin");
    }

    const reply = (code, data, extraHeaders = {}) =>
      send(res, code, data, origin, extraHeaders);

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      return res.end();
    }

    try {
      if (await lms.handle(req, res, parts)) return;
    } catch (error) {
      console.error("LMS API error:", error);
      if (res.headersSent) return res.end();
      return send(res, error.message === "too large" ? 413 : 500, {
        error: error.message === "too large" ? "request too large" : "server error"
      });
    }


    // Admin-only enrollment approval and student account creation
    if (
      parts[1] === "api" &&
      parts[2] === "enrollments" &&
      parts[4] === "approve" &&
      req.method === "POST"
    ) {
      if (!isAdmin(req)) {
        return reply(401, { error: "unauthorized" });
      }

      try {
        const enrollment = await collections.enrollments.findOne({ id });

        if (!enrollment) {
          return send(res, 404, { error: "Enrollment not found" });
        }

        if (enrollment.status !== "pending") {
          return send(res, 409, {
            error: `Only pending enrollments can be approved. Current status: ${enrollment.status}`
          });
        }

        const email = String(enrollment.email || "").trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return send(res, 400, { error: "Enrollment has no valid email address" });
        }

        if (!Array.isArray(TABLES) || !collections.students || !collections.student_setup_tokens) {
          return send(res, 500, {
            error: "Student collections are not configured yet"
          });
        }

        const existingStudent = await collections.students.findOne({
          $or: [{ enrollmentId: id }, { email }]
        });

        let student;
        let createdStudent = false;

        if (existingStudent) {
          // Resume an approval that created the account but could not send the setup email.
          if (
            existingStudent.enrollmentId === id &&
            existingStudent.status === "pending_setup"
          ) {
            student = existingStudent;
          } else if (existingStudent.email === email && existingStudent.status === "active") {
            // The applicant already has a working login (e.g. self-registered): link it, no setup email needed.
            await collections.enrollments.updateOne(
              { id },
              { $set: { status: "confirmed", studentId: existingStudent.studentId, approved_at: new Date().toISOString() } }
            );
            return send(res, 200, {
              message: "Enrollment approved and linked to the student's existing account",
              studentId: existingStudent.studentId,
              linked: true
            });
          } else {
            return send(res, 409, {
              error: "A student account already exists for this enrollment or email"
            });
          }
        } else {
          let newStudentId;

          for (let attempt = 0; attempt < 5; attempt++) {
            const candidate = createStudentId();
            if (!(await collections.students.findOne({ studentId: candidate }))) {
              newStudentId = candidate;
              break;
            }
          }

          if (!newStudentId) {
            return send(res, 500, { error: "Could not generate a unique student ID" });
          }

          student = {
            id: crypto.randomUUID(),
            studentId: newStudentId,
            enrollmentId: id,
            name: enrollment.name || "",
            email,
            course: enrollment.course || "",
            assignedCourseIds: [],
            passwordHash: null,
            status: "pending_setup",
            created_at: new Date().toISOString()
          };

          await collections.students.insertOne(student);
          createdStudent = true;
        }

        const studentId = student.studentId;
        const setup = createSetupToken();

        const tokenRecord = {
          id: crypto.randomUUID(),
          studentId,
          tokenHash: setup.tokenHash,
          expiresAt: setup.expiresAt,
          usedAt: null,
          created_at: new Date().toISOString()
        };

        await collections.student_setup_tokens.insertOne(tokenRecord);

        try {
          await sendPasswordSetupEmail(
            student.email,
            studentId,
            setup.token
          );
        } catch (emailError) {
          await collections.student_setup_tokens.deleteOne({
            id: tokenRecord.id
          });

          // Roll back so the enrollment stays pending and can simply be approved again.
          if (createdStudent) {
            await collections.students.deleteOne({ id: student.id });
          }

          console.error("Student setup email failed:", emailError.message);

          return send(res, 502, {
            error: "Email could not be sent. Please try again."
          });
        }

        // Only the newest setup link stays valid.
        await collections.student_setup_tokens.updateMany(
          { studentId, id: { $ne: tokenRecord.id }, usedAt: null },
          { $set: { usedAt: new Date().toISOString() } }
        );

        await collections.enrollments.updateOne(
          { id },
          {
            $set: {
              status: "confirmed",
              studentId,
              approved_at: new Date().toISOString()
            }
          }
        );

        return send(res, 201, {
          message: "Enrollment approved and setup email sent",
          studentId
        });
      } catch (error) {
        console.error("Enrollment approval failed:", error);
        return send(res, 500, { error: "Could not approve enrollment" });
      }
    }
    
    
    // Student self-registration API
    if (
      parts[1] === "api" &&
      parts[2] === "student-auth" &&
      parts[3] === "register" &&
      req.method === "POST"
    ) {
      try {
        const body = await readBody(req);

        if (
          !isObject(body) ||
          typeof body.name !== "string" ||
          typeof body.email !== "string" ||
          typeof body.phone !== "string" ||
          typeof body.password !== "string"
        ) {
          return send(res, 400, {
            error: "Name, email, phone and password are required"
          });
        }

        const name = body.name.trim();
        const email = body.email.trim().toLowerCase();
        const phone = body.phone.trim();
        const password = body.password;

        if (
          name.length < 2 ||
          name.length > 100 ||
          email.length > 254 ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
          phone.length < 10 ||
          phone.length > 20 ||
          password.length < 8 ||
          password.length > 128 ||
          !/[A-Za-z]/.test(password) ||
          !/[0-9]/.test(password)
        ) {
          return send(res, 400, {
            error: "Please enter valid details. Password must be at least 8 characters with a letter and a number."
          });
        }

        const existingStudent = await collections.students.findOne({ email });

        if (existingStudent) {
          return send(res, 409, {
            error: "An account with this email already exists. Please log in."
          });
        }

        const studentId = createStudentId();
        const passwordHash = await bcrypt.hash(password, 12);

        const student = {
          id: crypto.randomUUID(),
          studentId,
          name,
          email,
          phone,
          passwordHash,
          status: "active",
          course: "",
          assignedCourseIds: [],
          created_at: new Date().toISOString()
        };

        await collections.students.insertOne(student);

        const sessionId = createStudentSessionId();
        const now = Date.now();

        await collections.student_sessions.insertOne({
          id: crypto.randomUUID(),
          sessionHash: hashSessionId(sessionId),
          studentId,
          created_at: new Date(now).toISOString(),
          expiresAt: new Date(now + SESSION_TTL_MS).toISOString()
        });

       
return send(
  res,
  201,
  {
    message: "Registration successful!",
    student: {
      studentId,
      name,
      email,
      phone,
      course: ""
    }
  },
  origin,
  {
    "Set-Cookie": sessionCookie(sessionId, Math.floor(SESSION_TTL_MS / 1000))
  }
);
      } catch (error) {
        console.error("Student registration error:", error);

        return send(res, 500, {
          error: "Registration failed. Please try again."
        }, origin);
      }
}

        // Student login API
    if (
      parts[1] === "api" &&
      parts[2] === "student-auth" &&
      parts[3] === "login" &&
      req.method === "POST"
    ) {
      try {
        const body = await readBody(req);

        if (
          !isObject(body) ||
          typeof body.email !== "string" ||
          typeof body.password !== "string"
        ) {
          return send(res, 400, {
            error: "Email and password are required"
          });
        }

        const email = body.email.trim().toLowerCase();

        if (
          email.length > 254 ||
          body.password.length > 128 ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {
          return send(res, 400, {
            error: "Invalid email or password"
          });
        }

        const student = await collections.students.findOne({ email });

        if (
          !student ||
          student.status !== "active" ||
          typeof student.passwordHash !== "string" ||
          !(await bcrypt.compare(body.password, student.passwordHash))
        ) {
          return send(res, 401, {
            error: "Invalid email or password"
          });
        }

        // Temporary response: session creation will be added next.
        
const sessionId = createStudentSessionId();
const now = Date.now();
const expiresAt = new Date(now + SESSION_TTL_MS).toISOString();

await collections.student_sessions.insertOne({
  id: crypto.randomUUID(),
  sessionHash: hashSessionId(sessionId),
  studentId: student.studentId,
  created_at: new Date(now).toISOString(),
  expiresAt
});

return send(
  res,
  200,
  {
    message: "Login successful",
    student: {
      studentId: student.studentId,
      name: student.name,
      email: student.email,
      course: student.course
    }
  },
  origin,
  {
    "Set-Cookie": sessionCookie(sessionId, Math.floor(SESSION_TTL_MS / 1000))
  }
);

      } catch (error) {
        console.error("Student login failed:", error.message);
        return send(res, 500, {
          error: "Unable to log in right now"
        });
      }
    }
     
    // Verify the current student's session
    if (
      parts[1] === "api" &&
      parts[2] === "student-auth" &&
      parts[3] === "me" &&
      req.method === "GET"
    ) {
      try {
        const { student, error } = await getSessionStudent(req, res);

        if (!student) {
          return send(res, 401, { error });
        }

        return send(res, 200, {
          student: {
            studentId: student.studentId,
            name: student.name,
            email: student.email,
            course: student.course
          }
        });
      } catch (error) {
        console.error("Student session verification failed:", error.message);
        return send(res, 500, { error: "Unable to verify session" });
      }
    }
    
    
    // Student logout API
    if (
      parts[1] === "api" &&
      parts[2] === "student-auth" &&
      parts[3] === "logout" &&
      req.method === "POST"
    ) {
      try {
        const cookies = parseCookies(req);
        const sessionId = cookies[SESSION_COOKIE];

        if (sessionId && /^[a-f0-9]{64}$/i.test(sessionId)) {
          await collections.student_sessions.deleteOne({
            sessionHash: hashSessionId(sessionId)
          });
        }

        return send(
          res,
          200,
          { message: "Logged out successfully" },
          origin,
          { "Set-Cookie": sessionCookie("", 0) }
        );
      } catch (error) {
        console.error("Student logout failed:", error);

        return send(res, 500, {
          error: "Unable to log out right now"
        }, origin);
      }
    }

    // Student LMS: courses assigned to the logged-in student
    if (
      parts[1] === "api" &&
      parts[2] === "student" &&
      parts[3] === "courses" &&
      req.method === "GET"
    ) {
      try {
        const { student, error } = await getSessionStudent(req, res);

        if (!student) {
          return send(res, 401, { error });
        }

        const courseIds = assignedCourseIds(student);
        const courseId = parts[4];

        if (parts.length > 5 || (parts.length === 5 && !courseId)) {
          return send(res, 404, { error: "not found" });
        }

        if (!courseId) {
          const courses = courseIds.length
            ? await collections.courses.find({ id: { $in: courseIds } }).toArray()
            : [];

          // Keep the order in which the admin assigned the courses.
          const byId = new Map(courses.map(course => [course.id, course]));

          const cards = [];
          for (const course of courseIds.map(value => byId.get(value)).filter(Boolean)) {
            const status = await lms.completionStatus(course, student.studentId);
            cards.push({ ...courseCard(course), progress: status.progress, totalLessons: status.totalLessons });
          }

          return send(res, 200, { courses: cards });
        }

        // Authorise against the session's assignments before loading anything.
        if (courseId.length > 100 || !courseIds.includes(courseId)) {
          return send(res, 403, { error: "This course is not assigned to your account" });
        }

        const course = await collections.courses.findOne({ id: courseId });

        if (!course) {
          return send(res, 404, { error: "Course not found" });
        }

        // Batches come from this student's own approved enrollments for this course.
        const enrollments = await collections.enrollments
          .find({
            studentId: student.studentId,
            status: { $in: ["confirmed", "joined"] },
            batch_id: { $nin: [null, ""] }
          })
          .toArray();

        const batches = [];

        for (const enrollment of enrollments) {
          for (const table of BATCH_TABLES) {
            const batch = await collections[table].findOne({ id: enrollment.batch_id });

            if (batch && batch.course === course.title) {
              batches.push({
                id: batch.id,
                mode: table === "online_training" ? "Online" : "Classroom",
                batch_name: batch.batch_name ?? "",
                status: batch.status ?? "",
                start_date: batch.start_date ?? "",
                days: batch.days ?? "",
                timing: batch.timing ?? "",
                trainer: batch.trainer ?? "",
                center: batch.center ?? "",
                platform: batch.platform ?? "",
                meeting_link: batch.meeting_link ?? ""
              });
            }
          }
        }

        const { _id, published, curriculum, completion, ...details } = course;
        const status = await lms.completionStatus(course, student.studentId);
        const certificate = await collections.certificates.findOne({ studentId: student.studentId, course_id: course.id });

        return send(res, 200, {
          course: {
            ...details,
            batches,
            curriculum: publishedCurriculum(course),
            completion: status,
            certificate: certificate
              ? { certificate_id: certificate.certificate_id, status: certificate.status, issued_at: certificate.issued_at ?? null }
              : null
          }
        });
      } catch (error) {
        console.error("Student courses lookup failed:", error);
        return send(res, 500, { error: "Unable to load your courses right now" });
      }
    }

    // Admin: list student accounts (without password hashes)
    if (
      parts[1] === "api" &&
      parts[2] === "students" &&
      parts.length === 3 &&
      req.method === "GET"
    ) {
      if (!isAdmin(req)) {
        return send(res, 401, { error: "unauthorized" });
      }

      try {
        const students = await collections.students
          .find({})
          .sort({ created_at: -1 })
          .toArray();

        return send(res, 200, students.map(studentSummary));
      } catch (error) {
        console.error("Student list failed:", error);
        return send(res, 500, { error: "Unable to load students" });
      }
    }

    // Admin: replace the list of courses assigned to a student
    if (
      parts[1] === "api" &&
      parts[2] === "students" &&
      parts[4] === "courses" &&
      parts.length === 5 &&
      (req.method === "PUT" || req.method === "PATCH")
    ) {
      if (!isAdmin(req)) {
        return send(res, 401, { error: "unauthorized" });
      }

      try {
        const studentId = decodeURIComponent(parts[3] || "");
        const body = await readBody(req);

        if (
          !isObject(body) ||
          !Array.isArray(body.courseIds) ||
          body.courseIds.length > 200 ||
          !body.courseIds.every(value => typeof value === "string" && value.length <= 100)
        ) {
          return send(res, 400, { error: "courseIds must be an array of course IDs" });
        }

        const student = await collections.students.findOne({ studentId });

        if (!student) {
          return send(res, 404, { error: "Student not found" });
        }

        const courseIds = [...new Set(body.courseIds)];
        const found = courseIds.length
          ? await collections.courses
              .find({ id: { $in: courseIds } }, { projection: { id: 1 } })
              .toArray()
          : [];
        const known = new Set(found.map(course => course.id));
        const unknown = courseIds.filter(value => !known.has(value));

        if (unknown.length) {
          return send(res, 400, { error: `Unknown course ID(s): ${unknown.join(", ")}` });
        }

        await collections.students.updateOne(
          { id: student.id },
          {
            $set: {
              assignedCourseIds: courseIds,
              courses_updated_at: new Date().toISOString()
            }
          }
        );

        return send(res, 200, studentSummary({ ...student, assignedCourseIds: courseIds }));
      } catch (error) {
        console.error("Course assignment failed:", error);
        const code =
          error.message === "too large" ? 413 : error.message === "invalid JSON" ? 400 : 500;
        return send(res, code, { error: "Could not update assigned courses" });
      }
    }

    // Student password setup API
    if (
      parts[1] === "api" &&
      parts[2] === "student-auth" &&
      parts[3] === "set-password" &&
      req.method === "POST"
    ) {
      try {
        const body = await readBody(req);

        if (
          !isObject(body) ||
          typeof body.token !== "string" ||
          typeof body.password !== "string"
        ) {
          return send(res, 400, {
            error: "Setup token and password are required"
          });
        }

        if (body.password.length < 8 || body.password.length > 128) {
          return send(res, 400, {
            error: "Password must be between 8 and 128 characters"
          });
        }

        const tokenHash = hashSetupToken(body.token);

        const tokenRecord =
          await collections.student_setup_tokens.findOne({ tokenHash });

        if (!tokenRecord || tokenRecord.usedAt) {
          return send(res, 400, {
            error: "Invalid or already-used setup link"
          });
        }

        if (new Date(tokenRecord.expiresAt).getTime() <= Date.now()) {
          return send(res, 400, {
            error: "Setup link has expired. Please contact the administrator."
          });
        }

        const student = await collections.students.findOne({
          studentId: tokenRecord.studentId
        });

        if (!student || student.status !== "pending_setup") {
          return send(res, 400, {
            error: "Student account is not available for setup"
          });
        }

        // Mark token used only if it has not already been used.
        const tokenUpdate =
          await collections.student_setup_tokens.updateOne(
            { id: tokenRecord.id, usedAt: null },
            { $set: { usedAt: new Date().toISOString() } }
          );

        if (tokenUpdate.modifiedCount !== 1) {
          return send(res, 400, {
            error: "This setup link has already been used"
          });
        }

        const passwordHash = await bcrypt.hash(body.password, 12);

        await collections.students.updateOne(
          { id: student.id, status: "pending_setup" },
          {
            $set: {
              passwordHash,
              status: "active",
              password_set_at: new Date().toISOString()
            }
          }
        );

        return send(res, 200, {
          message: "Password set successfully. Your account is activated."
        });
      } catch (error) {
        console.error("Student password setup failed:", error);
        return send(res, 500, {
          error: "Could not set password. Please try again."
        });
      }
    }

    // Website enrollment form (admins creating enrollments still use the generic route below)
    if (
      parts[1] === "api" &&
      parts[2] === "enrollments" &&
      parts.length === 3 &&
      req.method === "POST" &&
      !isAdmin(req)
    ) {
      try {
        const body = await readBody(req);

        if (!isObject(body)) {
          return send(res, 400, { error: "Invalid enrollment details" });
        }

        const { fields, value } = validateEnrollment(body);

        if (Object.keys(fields).length) {
          return send(res, 400, { error: "Please correct the highlighted fields.", fields });
        }

        const submissionId =
          typeof body.submissionId === "string" && /^[A-Za-z0-9-]{16,64}$/.test(body.submissionId)
            ? body.submissionId
            : null;

        const course = await collections.courses.findOne({
          $or: [{ id: value.courseId }, { slug: value.courseId }],
          published: { $ne: false }
        });

        if (!course) {
          return send(res, 400, {
            error: "This course is not open for enrollment.",
            fields: { courseId: "This course is not open for enrollment." }
          });
        }

        const respond = (code, enrollment, trackingToken, hrNotified) =>
          send(res, code, {
            message: "Enrollment submitted successfully",
            id: enrollment.id,
            enrollment_id: enrollment.enrollment_id,
            course: enrollment.course,
            status: enrollment.status,
            created_at: enrollment.created_at,
            trackingToken,
            hrNotified
          });

        // A retry of the same form submission returns the saved record instead of creating another.
        const replay = async () => {
          const existing = submissionId
            ? await collections.enrollments.findOne({ submission_id: submissionId })
            : null;
          if (!existing) return null;

          // Only the original response carried the tracking token, so issue a fresh one.
          const trackingToken = crypto.randomBytes(32).toString("hex");
          await collections.enrollments.updateOne(
            { id: existing.id },
            { $set: { trackingTokenHash: crypto.createHash("sha256").update(trackingToken).digest("hex") } }
          );
          // Retry a failed HR email once; a request already sending it is left alone.
          let hrNotified = existing.hr_notification?.status === "sent";
          if (existing.hr_notification?.status === "failed") {
            const claim = await collections.enrollments.updateOne(
              { id: existing.id, "hr_notification.status": "failed" },
              { $set: { "hr_notification.status": "sending" } }
            );
            if (claim.modifiedCount === 1) hrNotified = await notifyHr(existing);
          }
          return respond(200, existing, trackingToken, hrNotified);
        };

        const replayed = await replay();
        if (replayed) return replayed;

        const trackingToken = crypto.randomBytes(32).toString("hex");
        const enrollment = {
          id: crypto.randomUUID(),
          enrollment_id: `SS-${crypto.randomInt(100000, 1000000)}`,
          name: value.name,
          email: value.email,
          phone: value.phone,
          college: value.college,
          course: course.title,
          course_id: course.id,
          course_slug: course.slug ?? "",
          status: "pending",
          source: "website",
          trackingTokenHash: crypto.createHash("sha256").update(trackingToken).digest("hex"),
          ...(submissionId ? { submission_id: submissionId } : {}),
          hr_notification: { status: "sending", attempts: 0 },
          created_at: new Date().toISOString()
        };

        try {
          await collections.enrollments.insertOne(enrollment);
        } catch (error) {
          // Two identical submissions raced; the other one was saved.
          if (error?.code === 11000) {
            const raced = await replay();
            if (raced) return raced;
          }
          throw error;
        }

        const hrNotified = await notifyHr(enrollment);
        return respond(201, enrollment, trackingToken, hrNotified);
      } catch (error) {
        console.error("Website enrollment failed:", error);
        if (error.message === "too large" || error.message === "invalid JSON") {
          return send(res, 400, { error: "Invalid enrollment details" });
        }
        return send(res, 500, { error: "We could not save your enrollment. Please try again." });
      }
    }

    // Admin: record payment verification and give the enrolled student access to the course
    if (
      parts[1] === "api" &&
      parts[2] === "enrollments" &&
      parts[4] === "grant-access" &&
      parts.length === 5 &&
      req.method === "POST"
    ) {
      if (!isAdmin(req)) {
        return send(res, 401, { error: "unauthorized" });
      }

      try {
        const body = await readBody(req).catch(() => ({}));
        const enrollment = await collections.enrollments.findOne({ id });

        if (!enrollment) {
          return send(res, 404, { error: "Enrollment not found" });
        }
        if (!enrollment.studentId || !["confirmed", "joined"].includes(enrollment.status)) {
          return send(res, 409, { error: "Approve the enrollment first so the student has an account." });
        }

        const course = enrollment.course_id
          ? await collections.courses.findOne({ id: enrollment.course_id })
          : await collections.courses.findOne({ title: enrollment.course });

        if (!course) {
          return send(res, 409, { error: "The enrolled course no longer exists. Assign a course from Student Accounts instead." });
        }

        const student = await collections.students.findOne({ studentId: enrollment.studentId });
        if (!student) {
          return send(res, 404, { error: "Student account not found" });
        }

        const now = new Date().toISOString();
        await collections.students.updateOne(
          { id: student.id },
          { $addToSet: { assignedCourseIds: course.id }, $set: { courses_updated_at: now } }
        );
        await collections.enrollments.updateOne(
          { id },
          {
            $set: {
              payment_status: "verified",
              payment_reference: isObject(body) ? tidy(body.payment_reference).slice(0, 100) : "",
              payment_verified_at: now,
              course_id: course.id
            }
          }
        );

        return send(res, 200, {
          message: `Payment verified. ${student.name || student.email} can now open ${course.title}.`,
          studentId: student.studentId,
          courseId: course.id
        });
      } catch (error) {
        console.error("Grant access failed:", error);
        return send(res, 500, { error: "Could not grant course access" });
      }
    }

    // Admin: retry the HR notification email for an enrollment
    if (
      parts[1] === "api" &&
      parts[2] === "enrollments" &&
      parts[4] === "notify-hr" &&
      parts.length === 5 &&
      req.method === "POST"
    ) {
      if (!isAdmin(req)) {
        return send(res, 401, { error: "unauthorized" });
      }

      try {
        const enrollment = await collections.enrollments.findOne({ id });
        if (!enrollment) {
          return send(res, 404, { error: "Enrollment not found" });
        }
        const sent = await notifyHr(enrollment);
        return sent
          ? send(res, 200, { message: `Notification sent to ${HR_EMAIL}` })
          : send(res, 502, { error: "Email could not be sent. Check the SMTP settings." });
      } catch (error) {
        console.error("HR notification retry failed:", error);
        return send(res, 500, { error: "Could not send the notification" });
      }
    }

    // Secure student enrollment status lookup
    if (
      parts[1] === "api" &&
      parts[2] === "enrollments" &&
      parts[3] === "status" &&
      req.method === "POST"
    ) {
      try {
        const body = await readBody(req);

        if (
          !isObject(body) ||
          typeof body.id !== "string" ||
          typeof body.trackingToken !== "string"
        ) {
          return send(res, 400, { error: "Enrollment ID and tracking token are required" });
        }

        const enrollment = await collections.enrollments.findOne({
          id: body.id
        });

        if (!enrollment || !enrollment.trackingTokenHash) {
          return send(res, 404, { error: "Enrollment not found or invalid credentials" });
        }

        const suppliedHash = crypto
          .createHash("sha256")
          .update(body.trackingToken)
          .digest("hex");

        const supplied = Buffer.from(suppliedHash, "hex");
        const stored = Buffer.from(enrollment.trackingTokenHash, "hex");

        if (
          supplied.length !== stored.length ||
          !crypto.timingSafeEqual(supplied, stored)
        ) {
          return send(res, 404, { error: "Enrollment not found or invalid credentials" });
        }

        return send(res, 200, {
          id: enrollment.id,
          course: enrollment.course ?? "",
          batch: enrollment.batch ?? "",
          status: enrollment.status ?? "pending",
          created_at: enrollment.created_at ?? ""
        });
      } catch (error) {
        console.error("Enrollment status lookup error:", error);
        return send(res, 400, { error: "Invalid request" });
      }
    }

    
    // Admin: resend student password setup email
    if (
      parts[1] === "api" &&
      parts[2] === "students" &&
      parts[4] === "resend-setup" &&
      req.method === "POST"
    ) {
      if (!isAdmin(req)) {
        return send(res, 401, { error: "Unauthorized" });
      }

      try {
        const studentId = parts[3];

        if (!studentId) {
          return send(res, 400, { error: "Student ID is required" });
        }

        const student = await collections.students.findOne({ studentId });

        if (!student) {
          return send(res, 404, { error: "Student not found" });
        }

        if (student.status !== "pending_setup") {
          return send(res, 409, {
            error: "Password setup is not pending for this student"
          });
        }

        // Create a new, short-lived, single-use setup token.
        const setup = createSetupToken();

        const tokenRecord = {
          id: crypto.randomUUID(),
          studentId,
          tokenHash: setup.tokenHash,
          expiresAt: setup.expiresAt,
          usedAt: null,
          created_at: new Date().toISOString()
        };

        await collections.student_setup_tokens.insertOne(tokenRecord);



        try {
          await sendPasswordSetupEmail(
            student.email,
            studentId,
            setup.token
          );
        } catch (emailError) {
          await collections.student_setup_tokens.deleteOne({
            id: tokenRecord.id
          });

          console.error("Student setup email failed:", emailError);

          return send(res, 502, {
            error: "Email could not be sent. Please try again."
          });
        }

        // Invalidate older unused setup links only after email succeeds.
        await collections.student_setup_tokens.updateMany(
          {
            studentId,
            id: { $ne: tokenRecord.id },
            usedAt: null
          },
          {
            $set: { usedAt: new Date().toISOString() }
          }
        );

        return send(res, 200, {
          message: "A new password setup link has been sent."
        });
      } catch (error) {
        console.error("Resend setup error:", error);

        return send(res, 500, {
          error: "Unable to resend setup email right now."
        });
      }
    }


    if (parts[1] !== "api" || !TABLES.includes(table)) {
      return send(res, 404, { error: "not found" });
    }
    
    // Never expose student accounts or setup tokens through generic API routes.
if (
  table === "students" ||
  table === "student_setup_tokens" ||
  table === "student_sessions"
) {
  return send(res, 404, { error: "not found" });
}
    const admin = isAdmin(req);
    const collection = collections[table];

    try {
      if (req.method === "GET") {
        if (!admin && !PUBLIC_READ.has(table)) {
          return send(res, 401, { error: "unauthorized" });
        }

        if (id) {
          const row = clean(await collection.findOne({ id }));
          return row && visibleTo(admin, table, row)
            ? send(res, 200, publicView(admin, table, row))
            : send(res, 404, { error: "not found" });
        }

        const rows = (await collection.find({}).toArray())
          .map(clean)
          .filter(row => visibleTo(admin, table, row))
          .map(row => publicView(admin, table, row))
          .sort((a, b) =>
            String(b.created_at ?? "").localeCompare(String(a.created_at ?? ""))
          );

        return send(res, 200, rows);
      }

      if (req.method === "POST") {
        if (!admin && !PUBLIC_WRITE.has(table)) {
          return send(res, 401, { error: "unauthorized" });
        }
        if (id) return send(res, 405, { error: `POST goes to /api/${table}` });
        if (NO_GENERIC_WRITE.has(table)) return send(res, 405, { error: "method not allowed" });

       
        const body = await readBody(req);
        if (!isObject(body)) {
          return send(res, 400, { error: "body must be a JSON object" });
        }

        const row = {
          ...body,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString()
        };

        let trackingToken;

        if (!admin) {
          delete row.published;
          delete row.featured;
          delete row.notes;
          delete row.follow_up;
          delete row.trackingTokenHash;
          // Account links and batch placement are set by the admin only.
          delete row.studentId;
          delete row.batch_id;
          delete row.batch_name;
          delete row.approved_at;

          row.status = table === "enrollments" || table === "testimonials"
            ? "pending"
            : "new";

          if (table === "enrollments") {
            trackingToken = crypto.randomBytes(32).toString("hex");
            row.trackingTokenHash = crypto
              .createHash("sha256")
              .update(trackingToken)
              .digest("hex");
          }
        }

        const invalid = await prepareLmsRow(table, row);
        if (invalid) return send(res, 400, { error: invalid });

        if (row.slug && await collection.findOne({ slug: row.slug })) {
          return send(res, 409, { error: `slug "${row.slug}" is already used` });
        }

        await collection.insertOne(row);

        if (trackingToken) {
          return send(res, 201, { ...row, trackingToken });
        }

        return send(res, 201, row);

      }
      if (!admin) return send(res, 401, { error: "unauthorized" });

      if (req.method === "PUT" || req.method === "PATCH") {
        if (!id) return send(res, 400, { error: "id required" });
        if (NO_GENERIC_WRITE.has(table)) return send(res, 405, { error: "method not allowed" });

        const existing = await collection.findOne({ id });
        if (!existing) return send(res, 404, { error: "not found" });

        const body = await readBody(req);
        if (!isObject(body)) {
          return send(res, 400, { error: "body must be a JSON object" });
        }

        const next = {
          ...clean(existing),
          ...body,
          id,
          created_at: existing.created_at
        };

        const invalid = await prepareLmsRow(table, next);
        if (invalid) return send(res, 400, { error: invalid });

        if (next.slug && await collection.findOne({
          slug: next.slug,
          id: { $ne: id }
        })) {
          return send(res, 409, { error: `slug "${next.slug}" is already used` });
        }

        await collection.replaceOne({ id }, next);
        return send(res, 200, next);
      }

      if (req.method === "DELETE") {
        if (!id) return send(res, 400, { error: "id required" });
        if (NO_GENERIC_DELETE.has(table)) return send(res, 405, { error: "method not allowed" });

        const blocked = await deleteBlocker(table, id);
        if (blocked) return send(res, 409, { error: blocked });

        const result = await collection.deleteOne({ id });
        if (!result.deletedCount) {
          return send(res, 404, { error: "not found" });
        }
        return send(res, 204);
      }

      return send(res, 405, { error: "method not allowed" });
    } catch (error) {
      console.error("API error:", error);
      return send(res, error.message === "too large" ? 413 : 500, {
        error: error.message === "too large" ? "request too large" : "server error"
      });
    }
  });

  server.listen(PORT, () => {
    console.log(`API running at http://localhost:${PORT}`);
  });
}

start().catch(error => {
  console.error("Backend startup failed:", error);
  process.exit(1);
});
