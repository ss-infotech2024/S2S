import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import "dotenv/config";
import http from "node:http";
import fs from "node:fs";
import crypto from "node:crypto";
import { MongoClient } from "mongodb";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

const SESSION_COOKIE = "s2s_student_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
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

        return [name, decodeURIComponent(value)];
      })
  );
}
function hashSessionId(sessionId) {
  return crypto.createHash("sha256").update(sessionId).digest("hex");
}
const PORT = Number(process.env.PORT || 8787);
const TOKEN = process.env.ADMIN_TOKEN;
const URI = process.env.MONGODB_URI;

const ALLOWED_ORIGINS = new Set([
  "http://localhost:5174",
  "http://localhost:8080",
]);

const SEED = new URL("../src/seed.json", import.meta.url);

const TABLES = [
  "courses", "students", "student_setup_tokens", "student_sessions",
  "placements", "posts", "gallery", "colleges",
  "online_training", "classroom_training", "settings", "trainers",
  "corporate_programs", "corp_categories", "companies", "locations",
  "overseas_courses", "overseas_countries", "overseas_languages",
  "placement_companies", "placement_stats", "jobs", "testimonials",
  "enrollments", "enquiries", "corp_enquiries", "overseas_enquiries",
  "banners", "site_content"
];

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

const FRONTEND_ORIGIN =
  process.env.STUDENT_PORTAL_URL || "http://localhost:8080";


const send = (res, code, data, origin = null) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type,x-admin-token",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Vary": "Origin",
  };

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Credentials"] = "true";
  }

  res.writeHead(code, headers);
  res.end(data === undefined ? "" : JSON.stringify(data));
};


  


const readBody = req => new Promise((resolve, reject) => {
  let raw = "";
  req.on("data", chunk => {
    raw += chunk;
    if (raw.length > 8e6) {
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

async function start() {
  if (!URI) throw new Error("MONGODB_URI is missing in .env");
  if (!TOKEN || TOKEN === "change-me") {
    throw new Error("Set a strong ADMIN_TOKEN in .env");
  }

  const client = new MongoClient(URI);
  await client.connect();

const database = client.db("test");
  await database.command({ ping: 1 });
  console.log("Connected to MongoDB");

  const collections = Object.fromEntries(
    TABLES.map(table => [table, database.collection(table)])
  );

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

  const server = http.createServer(async (req, res) => {
   

    const url = new URL(req.url, "http://localhost");
    const parts = url.pathname.split("/");
    const table = parts[2];
    const id = parts[3];

    
const origin = req.headers.origin || null;

if (origin && !ALLOWED_ORIGINS.has(origin)) {
  return send(res, 403, { error: "Origin not allowed" });
}

if (req.method === "OPTIONS") {
  if (!origin) {
    return send(res, 403, { error: "Origin required" });
  }

  return send(res, 204, undefined, origin);
}

    // Admin-only enrollment approval and student account creation
    if (
      parts[1] === "api" &&
      parts[2] === "enrollments" &&
      parts[4] === "approve" &&
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

        if (existingStudent) {
          return send(res, 409, {
            error: "A student account already exists for this enrollment or email"
          });
        }

        let studentId;

        for (let attempt = 0; attempt < 5; attempt++) {
          const candidate = createStudentId();
          if (!(await collections.students.findOne({ studentId: candidate }))) {
            studentId = candidate;
            break;
          }
        }

        if (!studentId) {
          return send(res, 500, { error: "Could not generate a unique student ID" });
        }

        const setup = createSetupToken();

        const student = {
          id: crypto.randomUUID(),
          studentId,
          enrollmentId: id,
          name: enrollment.name || "",
          email,
          course: enrollment.course || "",
          passwordHash: null,
          status: "pending_setup",
          created_at: new Date().toISOString()
        };

        const tokenRecord = {
          id: crypto.randomUUID(),
          studentId,
          tokenHash: setup.tokenHash,
          expiresAt: setup.expiresAt,
          usedAt: null,
          created_at: new Date().toISOString()
        };

        await collections.students.insertOne(student);

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

          console.error("Student setup email failed:", emailError.message);

          return send(res, 502, {
            error: "Email could not be sent. Please try again."
          });
        }

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

        res.writeHead(201, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": FRONTEND_ORIGIN,
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Headers": "Content-Type,x-admin-token",
          "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
          "Vary": "Origin",
          "Set-Cookie": `${SESSION_COOKIE}=${sessionId}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`
        });

        return res.end(JSON.stringify({
          message: "Registration successful!",
          student: {
            studentId,
            name,
            email,
            phone,
            course: ""
          }
        }));
      } catch (error) {
        console.error("Student registration failed:", error.message);

        return send(res, 500, {
          error: "Unable to register right now. Please try again."
        });
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

        res.writeHead(200, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": FRONTEND_ORIGIN,
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Headers": "Content-Type,x-admin-token",
          "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
          "Vary": "Origin",
          "Set-Cookie": `${SESSION_COOKIE}=${sessionId}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`
        });

return res.end(JSON.stringify({
  message: "Login successful",
  student: {
    studentId: student.studentId,
    name: student.name,
    email: student.email,
    course: student.course
  }
}));

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
        const cookies = parseCookies(req);
        const sessionId = cookies[SESSION_COOKIE];

        if (!sessionId || !/^[a-f0-9]{64}$/i.test(sessionId)) {
          return send(res, 401, { error: "Please log in" });
        }

        const sessionHash = hashSessionId(sessionId);

        const session = await collections.student_sessions.findOne({
          sessionHash
        });

        if (!session || new Date(session.expiresAt).getTime() <= Date.now()) {
          if (session) {
            await collections.student_sessions.deleteOne({ id: session.id });
          }

          res.setHeader(
            "Set-Cookie",
            `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`
          );

          return send(res, 401, { error: "Session expired. Please log in again." });
        }

        const student = await collections.students.findOne({
          studentId: session.studentId,
          status: "active"
        });

        if (!student) {
          await collections.student_sessions.deleteOne({ id: session.id });
          return send(res, 401, { error: "Student account is not active" });
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

        res.writeHead(200, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": FRONTEND_ORIGIN,
          "Access-Control-Allow-Headers": "Content-Type,x-admin-token",
          "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
          "Set-Cookie": `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`
        });

        return res.end(JSON.stringify({
          message: "Logged out successfully"
        }));
      } catch (error) {
        console.error("Student logout failed:", error.message);
        return send(res, 500, { error: "Unable to log out right now" });
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
if (table === "students" || table === "student_setup_tokens") {
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
            ? send(res, 200, row)
            : send(res, 404, { error: "not found" });
        }

        const rows = (await collection.find({}).toArray())
          .map(clean)
          .filter(row => visibleTo(admin, table, row))
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
