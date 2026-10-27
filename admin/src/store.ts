// Frontend-only data layer: everything lives in this browser's localStorage.
// To use a real backend later, replace listRows / saveRow / deleteRow; nothing else changes.
import seed from "./seed.json";
import { resources } from "./resources";

export type Row = Record<string, any>;
const key = (t: string) => `ssc-admin:v2:${t}`;
const write = (t: string, rows: Row[]) => localStorage.setItem(key(t), JSON.stringify(rows));

// Seed rows may carry `_ago` (days since created), `_start_in` (days until start_date) and `_follow_in` (days until follow_up) so demo data stays fresh.
const day = (ms: number) => { const d = new Date(ms); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
function fromSeed(r: Row): Row {
  const { _ago, _start_in, _follow_in, ...rest } = r;
  const now = Date.now();
  const row: Row = { ...rest, id: rest.id ?? crypto.randomUUID(), created_at: new Date(now - (Number(_ago) || 0) * 864e5).toISOString() };
  if (_start_in !== undefined) row.start_date = day(now + Number(_start_in) * 864e5);
  if (_follow_in !== undefined) row.follow_up = day(now + Number(_follow_in) * 864e5);
  return row;
}

function read(table: string): Row[] {
  try {
    const raw = localStorage.getItem(key(table));
    if (raw) return JSON.parse(raw);
  } catch { /* fall through to seed */ }
  const rows = ((seed as Record<string, Row[]>)[table] ?? []).map(fromSeed);
  write(table, rows);
  return rows;
}

async function localList(table: string): Promise<Row[]> {
  return read(table).sort((a, b) => b.created_at.localeCompare(a.created_at));
}
async function localSave(table: string, row: Row): Promise<void> {
  const rows = read(table);
  if (!row.id) return write(table, [{ ...row, id: crypto.randomUUID(), created_at: new Date().toISOString() }, ...rows]);
  if (!rows.some((r) => r.id === row.id)) throw new Error("This item no longer exists (it may have been deleted elsewhere). Reload the page.");
  write(table, rows.map((r) => (r.id === row.id ? { ...r, ...row, id: r.id, created_at: r.created_at } : r)));
}
async function localDelete(table: string, id: string): Promise<void> {
  write(table, read(table).filter((r) => r.id !== id));
}
async function localDeleteMany(table: string, ids: string[]): Promise<void> {
  const gone = new Set(ids);
  write(table, read(table).filter((r) => !gone.has(r.id)));
}
export function download(name: string, text: string, type: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}
export const exportAll = (tables: string[]) =>
  download("ssc-admin-backup.json", JSON.stringify(Object.fromEntries(tables.map((t) => [t, read(t)])), null, 2), "application/json");
export const resetAll = (tables: string[]) => tables.forEach((t) => localStorage.removeItem(key(t)));
export const readSync = read;
export function importAll(data: Record<string, unknown>, tables: string[]) {
  tables.forEach((t) => { if (Array.isArray(data[t])) write(t, data[t] as Row[]); });
}

// If VITE_API_URL is set, data lives on the shared server (so the website sees changes); otherwise in this browser.
const API = import.meta.env.VITE_API_URL as string | undefined;
console.log("Backend API URL:", API);

async function call(path: string, init: RequestInit = {}) {
  if (!API) {
    throw new Error("Backend API is not configured. Check VITE_API_URL in .env");
  }

  const token = import.meta.env.VITE_ADMIN_TOKEN as string | undefined;

  const r = await fetch(`${API.replace(/\/$/, "")}/api/${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": token ?? "",
      ...init.headers,
    },
  });

  if (!r.ok) {
    const msg = await r.json().then((b) => b?.error).catch(() => "");
    throw new Error(msg || `API ${r.status}`);
  }

  return r.status === 204 ? null : r.json();
}

export const listRows = (t: string): Promise<Row[]> => (API ? call(t) : localList(t));
export const saveRow = async (t: string, row: Row): Promise<void> => {
  if (!API) return localSave(t, row);
  await call(row.id ? `${t}/${row.id}` : t, { method: row.id ? "PUT" : "POST", body: JSON.stringify(row) });
};


export const approveEnrollment = async (enrollmentId: string) => {
  if (!API) {
    throw new Error("Backend API is not configured.");
  }

  return call(`enrollments/${encodeURIComponent(enrollmentId)}/approve`, {
    method: "POST",
  });
};


export const resendStudentSetup = async (studentId: string) => {
  if (!API) throw new Error("Backend API is not configured.");
  return call(`students/${encodeURIComponent(studentId)}/resend-setup`, {
    method: "POST",
  });
};


// Student login accounts (the `students` collection) — separate from the enrollment leads in "Students / Users".
export const listStudentAccounts = async (): Promise<Row[]> => {
  if (!API) throw new Error("Backend API is not configured.");
  return call("students");
};

export const assignStudentCourses = async (studentId: string, courseIds: string[]): Promise<Row> => {
  if (!API) throw new Error("Backend API is not configured.");
  return call(`students/${encodeURIComponent(studentId)}/courses`, {
    method: "PUT",
    body: JSON.stringify({ courseIds }),
  });
};

export const deleteRow = async (t: string, id: string): Promise<void> => {
  if (!API) return localDelete(t, id);
  await call(`${t}/${id}`, { method: "DELETE" });
};
export const getRow = async (t: string, id: string): Promise<Row | null> =>
  API ? call(`${t}/${id}`).catch(() => null) : (read(t).find((r) => r.id === id) ?? null);
export const deleteMany = async (t: string, ids: string[]): Promise<void> => {
  if (!API) return localDeleteMany(t, ids);
  for (const id of ids) await call(`${t}/${id}`, { method: "DELETE" });
};

/* ---------- Relationships ----------
   Screens link to each other by name (a batch stores its course's title, a gallery photo its college's name…).
   These helpers read those links from resources.ts so renames follow through and deletes can warn. */
export type RefLink = { table: string; name: string; field: string; refKey: string };
export function refsTo(table: string): RefLink[] {
  const out: RefLink[] = [];
  for (const r of Object.values(resources))
    for (const f of r.fields)
      if (f.type === "ref" && f.refTable === table) out.push({ table: r.table, name: r.table.replace(/_/g, " "), field: f.key, refKey: f.refKey! });
  return out;
}
/** Rows in other tables that point at `row`, grouped by table. Empty array = safe to delete. */
export async function usageOf(table: string, row: Row): Promise<(RefLink & { count: number })[]> {
  const hits: (RefLink & { count: number })[] = [];
  for (const l of refsTo(table)) {
    const val = row[l.refKey];
    if (!val) continue;
    const count = (await listRows(l.table)).filter((x) => x[l.field] === val).length;
    if (count) hits.push({ ...l, count });
  }
  return hits;
}
export const describeUsage = (hits: { name: string; count: number }[]) => hits.map((h) => `${h.count} in ${h.name}`).join(", ");
/** After renaming `oldRow` -> `newRow`, repoint every row that referenced the old name. */
export async function cascadeRename(table: string, oldRow: Row, newRow: Row): Promise<void> {
  for (const l of refsTo(table)) {
    const from = oldRow[l.refKey], to = newRow[l.refKey];
    if (!from || from === to) continue;
    for (const x of (await listRows(l.table)).filter((x) => x[l.field] === from)) await saveRow(l.table, { ...x, [l.field]: to });
  }
}
/** Returns a message if `v` reuses another row's URL slug or enrollment ID, otherwise "". */
export function uniqueClash(rows: Row[], v: Row): string {
  for (const k of ["slug", "enrollment_id"]) {
    const val = String(v[k] ?? "").trim().toLowerCase();
    if (val && rows.some((r) => r.id !== v.id && String(r[k] ?? "").trim().toLowerCase() === val))
      return `Another entry already uses this ${k === "slug" ? "URL slug" : "enrollment ID"} (${v[k]}). Change it and save again.`;
  }
  return "";
}
