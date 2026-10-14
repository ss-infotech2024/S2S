import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import "dotenv/config";
import http from "node:http";
import fs from "node:fs";
import crypto from "node:crypto";
import { MongoClient } from "mongodb";

const PORT = Number(process.env.PORT || 8787);
const TOKEN = process.env.ADMIN_TOKEN;
const URI = process.env.MONGODB_URI;
const SEED = new URL("../src/seed.json", import.meta.url);

const TABLES = [
  "courses", "placements", "posts", "gallery", "colleges",
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

const PUBLIC_READ = new Set(
  TABLES.filter(t => t === "testimonials" || !PUBLIC_WRITE.has(t))
);

const send = (res, code, data) => {
  res.writeHead(code, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,x-admin-token",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  });
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
    if (req.method === "OPTIONS") return send(res, 204);

    const url = new URL(req.url, "http://localhost");
    const parts = url.pathname.split("/");
    const table = parts[2];
    const id = parts[3];

    
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


    if (parts[1] !== "api" || !TABLES.includes(table)) {
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
  console.error("Backend startup failed:", error.message);
  process.exit(1);
});
