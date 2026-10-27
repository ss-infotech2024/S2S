// Contact Enquiries — CRM view: status pipeline tabs, follow-ups, admin notes, search/filters, CSV export.
import { useEffect, useMemo, useState, FormEvent } from "react";
import { listRows, saveRow, deleteRow, download, Row } from "./store";

const STATUSES = ["new", "contacted", "enrolled", "closed"] as const;
type Status = (typeof STATUSES)[number];
const OPEN: string[] = ["new", "contacted"];
const SIZES = [10, 25, 50];
const COLORS = ["#0052bd", "#6d28d9", "#0e7490", "#b45309", "#be185d", "#15803d", "#4338ca"];

/* ---------- helpers ---------- */
const pad = (n: number) => String(n).padStart(2, "0");
const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const local = (s: string) => { const [y, m, d] = s.slice(0, 10).split("-").map(Number); return new Date(y, m - 1, d); };
const today = () => ymd(new Date());
const daysTo = (s?: string) => (s ? Math.round((local(s).getTime() - local(today()).getTime()) / 864e5) : null);
const addDays = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return ymd(d); };
const fmt = (s?: string) => (s ? local(s).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "");
const fmtRecv = (s: string) => local(s).toLocaleDateString("en-IN", local(s).getFullYear() === new Date().getFullYear() ? { day: "numeric", month: "short" } : { day: "numeric", month: "short", year: "2-digit" });
const fmtShort = (s?: string) => (s ? local(s).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "");
const created = (r: Row) => ymd(new Date(r.created_at));
const digits = (p: unknown) => String(p ?? "").replace(/\D/g, "");
const wa = (p: string) => { const d = digits(p); return d.length === 10 ? "91" + d : d; };
const initials = (n: string) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";
const colorOf = (n: string) => COLORS[[...n].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length];
const norm = (r: Row): Row => ({ ...r, course_interest: r.course_interest ?? r.course ?? r.interest ?? "", status: r.status || "new" });

function followInfo(r: Row): { text: string; cls: string } | null {
  const d = daysTo(r.follow_up);
  if (d === null) return null;
  if (!OPEN.includes(r.status)) return { text: fmtShort(r.follow_up), cls: "" };
  if (d < 0) return { text: `${-d}d overdue`, cls: "late" };
  if (d === 0) return { text: "Today", cls: "due" };
  if (d === 1) return { text: "Tomorrow", cls: "soon" };
  return { text: fmtShort(r.follow_up), cls: d <= 7 ? "soon" : "" };
}

function validate(v: Row) {
  const e: Record<string, string> = {};
  if (!String(v.name ?? "").trim()) e.name = "Name is required.";
  const p = String(v.phone ?? "").replace(/[\s-]/g, "");
  if (!p) e.phone = "Phone number is required.";
  else if (!/^(\+91)?[6-9]\d{9}$/.test(p)) e.phone = "Enter a valid 10-digit mobile number.";
  const m = String(v.email ?? "").trim();
  if (m && !/^\S+@\S+\.\S+$/.test(m)) e.email = "Enter a valid email address.";
  return e;
}

/* ---------- icons ---------- */
const paths: Record<string, string> = {
  phone: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z",
  chat: "M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 20.5l1.7-5.4A8.4 8.4 0 1 1 21 11.5z",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm18 2-10 7L2 6",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm10 2-4.3-4.3",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  plus: "M12 5v14M5 12h14",
  trash: "M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",
  x: "M18 6 6 18M6 6l12 12",
  cal: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  inbox: "M22 12h-6l-2 3h-4l-2-3H2M5.5 5h13L22 12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6z",
  alert: "M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
  check: "M20 6 9 17l-5-5",
  sort: "M7 15l5 5 5-5M7 9l5-5 5 5",
};
const Ico = ({ n, s = 16 }: { n: string; s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[n]} /></svg>
);

/* ---------- page ---------- */
export default function Enquiries() {
  const [rows, setRows] = useState<Row[]>([]);
  const [courses, setCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | Status>("all");
  const [course, setCourse] = useState("");
  const [fup, setFup] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 }>({ key: "created_at", dir: -1 });
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<Row | null>(null);
  const [toast, setToast] = useState("");

  const say = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };
  const load = async () => { setRows((await listRows("enquiries")).map(norm)); setLoading(false); };
  useEffect(() => {
    document.title = "Contact Enquiries · Skill Training Center Admin";
    load();
    listRows("courses").then((c) => setCourses(c.map((x) => x.title).filter(Boolean))).catch(() => {});
  }, []);

  const courseOptions = useMemo(() => [...new Set([...courses, ...rows.map((r) => r.course_interest).filter(Boolean)])].sort(), [courses, rows]);

  /* everything except the status tab, so tab counts reflect the other filters */
  const base = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const nd = digits(q);
    return rows.filter((r) => {
      if (needle) {
        const hay = [r.name, r.email, r.message, r.course_interest, r.notes, r.phone].join(" ").toLowerCase();
        if (!hay.includes(needle) && !(nd.length > 2 && digits(r.phone).includes(nd))) return false;
      }
      if (course && r.course_interest !== course) return false;
      if (from && created(r) < from) return false;
      if (to && created(r) > to) return false;
      const d = daysTo(r.follow_up), open = OPEN.includes(r.status);
      if (fup === "overdue" && !(open && d !== null && d < 0)) return false;
      if (fup === "today" && !(open && d === 0)) return false;
      if (fup === "week" && !(open && d !== null && d >= 0 && d <= 7)) return false;
      if (fup === "none" && !(open && d === null)) return false;
      return true;
    });
  }, [rows, q, course, from, to, fup]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: base.length };
    STATUSES.forEach((s) => (c[s] = base.filter((r) => r.status === s).length));
    return c;
  }, [base]);

  const filtered = useMemo(() => {
    const list = tab === "all" ? base : base.filter((r) => r.status === tab);
    const { key, dir } = sort;
    return [...list].sort((a, b) => {
      const x = String(a[key] ?? ""), y = String(b[key] ?? "");
      if (!x && !y) return 0;
      if (!x) return 1; // empty values always last
      if (!y) return -1;
      return x.localeCompare(y) * dir;
    });
  }, [base, tab, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / size));
  const cur = Math.min(page, pages);
  const shown = filtered.slice((cur - 1) * size, cur * size);
  useEffect(() => { if (page > pages) setPage(pages); }, [pages]);

  /* summary cards use the full data set */
  const stats = useMemo(() => {
    const open = rows.filter((r) => OPEN.includes(r.status));
    const late = open.filter((r) => (daysTo(r.follow_up) ?? 0) < 0 && r.follow_up).length;
    const dueToday = open.filter((r) => daysTo(r.follow_up) === 0).length;
    const enrolled = rows.filter((r) => r.status === "enrolled").length;
    return { total: rows.length, fresh: rows.filter((r) => r.status === "new").length, late, dueToday, enrolled, rate: rows.length ? Math.round((enrolled / rows.length) * 100) : 0 };
  }, [rows]);

  const resetPage = () => setPage(1);
  const filtersOn = !!(q || course || fup || from || to || tab !== "all");
  const clearAll = () => { setQ(""); setCourse(""); setFup(""); setFrom(""); setTo(""); setTab("all"); resetPage(); };

  /* ---------- actions ---------- */
  const patch = async (r: Row, p: Row) => {
    try { await saveRow("enquiries", { ...r, ...p }); } catch { return say("Could not save changes."); }
    load();
  };
  const save = async (v: Row) => {
    try { await saveRow("enquiries", v); } catch { return say("Could not save (storage full or server unreachable)."); }
    setEditing(null); say(v.id ? "Changes saved" : "Enquiry added"); load();
  };
  const remove = async (r: Row) => {
    if (!confirm(`Delete the enquiry from "${r.name ?? "this person"}"? This can't be undone.`)) return;
    try { await deleteRow("enquiries", r.id); } catch { return say("Could not delete."); }
    setEditing(null); setSel((s) => { const n = new Set(s); n.delete(r.id); return n; }); say("Deleted"); load();
  };
  const bulk = async (p: Row) => {
    const targets = rows.filter((r) => sel.has(r.id));
    try { for (const r of targets) await saveRow("enquiries", { ...r, ...p }); } catch { return say("Could not update all enquiries."); }
    say(`${targets.length} updated`); setSel(new Set()); load();
  };
  const bulkDelete = async () => {
    if (!confirm(`Delete ${sel.size} selected ${sel.size === 1 ? "enquiry" : "enquiries"}? This can't be undone.`)) return;
    try { for (const id of sel) await deleteRow("enquiries", id); } catch { return say("Could not delete all."); }
    say("Deleted"); setSel(new Set()); load();
  };

  const exportCsv = () => {
    const list = sel.size ? filtered.filter((r) => sel.has(r.id)) : filtered;
    const esc = (x: unknown) => `"${String(x ?? "").replace(/"/g, '""')}"`;
    const head = ["Received", "Name", "Phone", "Email", "Course interest", "Message", "Status", "Follow-up date", "Admin notes"];
    const body = list.map((r) => [created(r), r.name, r.phone, r.email, r.course_interest, r.message, r.status, r.follow_up, r.notes].map(esc).join(","));
    download(`contact-enquiries-${today()}.csv`, "﻿" + [head.map(esc).join(","), ...body].join("\n"), "text/csv");
    say(`Exported ${list.length} ${list.length === 1 ? "enquiry" : "enquiries"}`);
  };

  const sortBy = (key: string) => { setSort((s) => (s.key === key ? { key, dir: (-s.dir as 1 | -1) } : { key, dir: key === "created_at" ? -1 : 1 })); resetPage(); };
  const th = (key: string, label: string) => (
    <th aria-sort={sort.key === key ? (sort.dir === 1 ? "ascending" : "descending") : "none"}>
      <button className="crm-th" onClick={() => sortBy(key)}>{label}<span className={sort.key === key ? "on" : ""}><Ico n="sort" s={12} /></span></button>
    </th>
  );

  const pageIds = shown.map((r) => r.id);
  const allOnPage = pageIds.length > 0 && pageIds.every((id) => sel.has(id));
  const togglePage = () => setSel((s) => { const n = new Set(s); pageIds.forEach((id) => (allOnPage ? n.delete(id) : n.add(id))); return n; });
  const toggle = (id: string) => setSel((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const card = (icon: string, label: string, value: number | string, sub: string, c: string, onClick?: () => void, hot = false) => (
    <button className={`crm-kpi${hot ? " hot" : ""}`} style={{ ["--c" as string]: c }} onClick={onClick} disabled={!onClick}>
      <span className="kpi-ico"><Ico n={icon} /></span>
      <span className="crm-kpi-t"><small>{label}</small><strong>{value}</strong><em>{sub}</em></span>
    </button>
  );

  return (
    <>
      <header className="bar">
        <h2>Contact Enquiries <small>{stats.total} total</small></h2>
        <button onClick={exportCsv} disabled={!filtered.length}><Ico n="download" /> Export CSV{sel.size ? ` (${sel.size})` : ""}</button>
        <button className="primary" onClick={() => setEditing({ status: "new" })}><Ico n="plus" /> Add enquiry</button>
      </header>

      <section className="crm-kpis" aria-label="Summary">
        {card("inbox", "New enquiries", stats.fresh, stats.fresh ? "Waiting for a first call" : "All contacted", "#0052bd", () => { setTab("new"); setFup(""); resetPage(); })}
        {card("alert", "Overdue follow-ups", stats.late, stats.late ? "Needs attention" : "Nothing overdue", "#b42318", () => { setTab("all"); setFup("overdue"); resetPage(); }, stats.late > 0)}
        {card("cal", "Follow-up today", stats.dueToday, stats.dueToday ? "Scheduled for today" : "None scheduled", "#b45309", () => { setTab("all"); setFup("today"); resetPage(); })}
        {card("check", "Enrolled", stats.enrolled, `${stats.rate}% of all enquiries`, "#17663a", () => { setTab("enrolled"); setFup(""); resetPage(); })}
      </section>

      <div className="crm-card">
        <div className="crm-tabs" role="tablist" aria-label="Status">
          {(["all", ...STATUSES] as const).map((s) => (
            <button key={s} role="tab" aria-selected={tab === s} className={`${tab === s ? "on" : ""} t-${s}`} onClick={() => { setTab(s); resetPage(); }}>
              <span>{s === "all" ? "All" : s}</span><b>{counts[s]}</b>
            </button>
          ))}
        </div>

        <div className="crm-tools">
          <label className="crm-search"><Ico n="search" />
            <input type="search" placeholder="Search name, phone, email, message or notes…" value={q} onChange={(e) => { setQ(e.target.value); resetPage(); }} aria-label="Search enquiries" />
          </label>
          <select value={course} onChange={(e) => { setCourse(e.target.value); resetPage(); }} aria-label="Course interest">
            <option value="">All courses</option>
            {courseOptions.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={fup} onChange={(e) => { setFup(e.target.value); resetPage(); }} aria-label="Follow-up">
            <option value="">Any follow-up</option>
            <option value="overdue">Overdue</option>
            <option value="today">Due today</option>
            <option value="week">Next 7 days</option>
            <option value="none">No follow-up set</option>
          </select>
          <span className="crm-range" role="group" aria-label="Received between">
            <input type="date" value={from} max={to || undefined} onChange={(e) => { setFrom(e.target.value); resetPage(); }} aria-label="Received from" />
            <i>→</i>
            <input type="date" value={to} min={from || undefined} onChange={(e) => { setTo(e.target.value); resetPage(); }} aria-label="Received to" />
          </span>
          {filtersOn && <button className="crm-clear" onClick={clearAll}>Clear filters</button>}
        </div>

        {sel.size > 0 && (
          <div className="crm-bulk" role="region" aria-label="Bulk actions">
            <b>{sel.size} selected</b>
            <select value="" onChange={(e) => e.target.value && bulk({ status: e.target.value })} aria-label="Change status of selected">
              <option value="">Change status…</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
            </select>
            <button onClick={() => bulk({ follow_up: addDays(1) })}>Follow up tomorrow</button>
            <button onClick={exportCsv}>Export selected</button>
            <button className="danger" onClick={bulkDelete}>Delete</button>
            <button className="crm-x" onClick={() => setSel(new Set())} aria-label="Clear selection"><Ico n="x" /></button>
          </div>
        )}

        <div className="crm-scroll">
          <table className="crm-table">
            <thead>
              <tr>
                <th className="crm-chk"><input type="checkbox" checked={allOnPage} onChange={togglePage} aria-label="Select all on this page" disabled={!shown.length} /></th>
                {th("created_at", "Received")}
                {th("name", "Name")}
                <th>Phone</th>
                <th>Course interest</th>
                <th>Status</th>
                {th("follow_up", "Follow-up")}
                <th />
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => {
                const f = followInfo(r);
                return (
                  <tr key={r.id} className={sel.has(r.id) ? "picked" : ""} onClick={() => setEditing(r)}>
                    <td className="crm-chk" onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={sel.has(r.id)} onChange={() => toggle(r.id)} aria-label={`Select ${r.name}`} /></td>
                    <td className="crm-date">{fmtRecv(created(r))}</td>
                    <td>
                      <div className="crm-who">
                        <span className="av" style={{ background: colorOf(r.name ?? "") }}>{initials(r.name ?? "")}</span>
                        <span className="crm-nm"><b>{r.name}</b><em title={r.message}>{r.message || r.email || "—"}</em></span>
                      </div>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="crm-ph">
                        <span>{r.phone}</span>
                        <a href={`tel:${r.phone}`} title="Call" aria-label={`Call ${r.name}`}><Ico n="phone" s={14} /></a>
                        <a href={`https://wa.me/${wa(r.phone)}`} target="_blank" rel="noreferrer" title="WhatsApp" aria-label={`WhatsApp ${r.name}`}><Ico n="chat" s={14} /></a>
                      </div>
                    </td>
                    <td>{r.course_interest ? <span className="crm-course" title={r.course_interest}>{r.course_interest}</span> : <span className="crm-none">Not specified</span>}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <select className={`tag s-${r.status} pick`} aria-label={`Status of ${r.name}`} value={r.status} onChange={(e) => patch(r, { status: e.target.value })}>
                        {STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>{f ? <span className={`crm-fup ${f.cls}`}><Ico n="cal" s={12} />{f.text}</span> : OPEN.includes(r.status) ? <span className="crm-none">Not set</span> : <span className="crm-none">—</span>}</td>
                    <td className="act" onClick={(e) => e.stopPropagation()}>
                      <button className="crm-ico danger" onClick={() => remove(r)} aria-label={`Delete ${r.name}`} title="Delete"><Ico n="trash" s={14} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!loading && !filtered.length && (
            <div className="crm-empty">
              <Ico n="inbox" s={28} />
              <p>{rows.length ? "No enquiries match these filters." : "No enquiries yet. New leads from the website will appear here."}</p>
              {filtersOn ? <button onClick={clearAll}>Clear filters</button> : <button className="primary" onClick={() => setEditing({ status: "new" })}>Add enquiry</button>}
            </div>
          )}
        </div>

        <div className="crm-foot">
          <span>Showing {filtered.length ? (cur - 1) * size + 1 : 0}–{Math.min(cur * size, filtered.length)} of {filtered.length}</span>
          <label className="crm-size">Rows
            <select value={size} onChange={(e) => { setSize(Number(e.target.value)); resetPage(); }}>{SIZES.map((n) => <option key={n}>{n}</option>)}</select>
          </label>
          <span className="crm-pg">
            <button disabled={cur === 1} onClick={() => setPage(cur - 1)}>Previous</button>
            <span>Page {cur} of {pages}</span>
            <button disabled={cur === pages} onClick={() => setPage(cur + 1)}>Next</button>
          </span>
        </div>
      </div>

      {editing && <Drawer row={editing} courses={courseOptions} onSave={save} onDelete={remove} onClose={() => setEditing(null)} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}

/* ---------- detail drawer ---------- */
function Drawer({ row, courses, onSave, onDelete, onClose }: { row: Row; courses: string[]; onSave: (v: Row) => void; onDelete: (r: Row) => void; onClose: () => void }) {
  const [v, setV] = useState<Row>({ status: "new", ...row });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const set = (k: string, val: unknown) => setV((p) => ({ ...p, [k]: val }));
  const isNew = !row.id;

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const out = validate(v);
    setErrs(out);
    if (Object.keys(out).length) return;
    const clean: Row = { ...v };
    ["name", "phone", "email", "course_interest", "message", "notes"].forEach((k) => { if (typeof clean[k] === "string") clean[k] = clean[k].trim(); });
    clean.updated_at = new Date().toISOString();
    onSave(clean);
  };

  const quick = [["Tomorrow", 1], ["In 3 days", 3], ["Next week", 7], ["In 2 weeks", 14]] as const;
  const f = followInfo(v);

  return (
    <div className="scrim" onClick={onClose}>
      <form className="panel crm-panel" onClick={(e) => e.stopPropagation()} onSubmit={submit} noValidate aria-label={isNew ? "Add enquiry" : "Enquiry details"}>
        <div className="crm-ph-head">
          <span className="av lg" style={{ background: colorOf(v.name ?? "") }}>{initials(v.name ?? "")}</span>
          <div className="crm-ph-t">
            <h3>{isNew ? "New enquiry" : v.name}</h3>
            <small>{isNew ? "Add a walk-in or phone enquiry" : `Received ${fmt(created(v))}${v.updated_at ? ` · updated ${fmt(created({ created_at: v.updated_at }))}` : ""}`}</small>
          </div>
          <button type="button" className="crm-x" onClick={onClose} aria-label="Close"><Ico n="x" /></button>
        </div>

        {!isNew && (
          <div className="crm-contact">
            <a href={`tel:${v.phone}`}><Ico n="phone" /> Call</a>
            <a href={`https://wa.me/${wa(v.phone)}`} target="_blank" rel="noreferrer"><Ico n="chat" /> WhatsApp</a>
            {v.email && <a href={`mailto:${v.email}`}><Ico n="mail" /> Email</a>}
          </div>
        )}

        <fieldset className="crm-fs">
          <legend>Status</legend>
          <div className="crm-pipe" role="radiogroup" aria-label="Status">
            {STATUSES.map((s) => (
              <button type="button" key={s} role="radio" aria-checked={v.status === s} className={`s-${s}${v.status === s ? " on" : ""}`} onClick={() => set("status", s)}>{s}</button>
            ))}
          </div>
        </fieldset>

        <div className="crm-sec">Enquiry details</div>
        <label><span>Name <i>*</i></span><input value={v.name ?? ""} onChange={(e) => set("name", e.target.value)} autoFocus={isNew} />{errs.name && <b className="ferr">{errs.name}</b>}</label>
        <div className="crm-two">
          <label><span>Phone number <i>*</i></span><input inputMode="tel" value={v.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />{errs.phone && <b className="ferr">{errs.phone}</b>}</label>
          <label><span>Email</span><input type="email" value={v.email ?? ""} onChange={(e) => set("email", e.target.value)} />{errs.email && <b className="ferr">{errs.email}</b>}</label>
        </div>
        <label><span>Course interest</span>
          <input list="crm-courses" placeholder="Choose or type a course" value={v.course_interest ?? ""} onChange={(e) => set("course_interest", e.target.value)} />
          <datalist id="crm-courses">{courses.map((c) => <option key={c} value={c} />)}</datalist>
        </label>
        <label><span>Message from enquirer</span><textarea rows={3} value={v.message ?? ""} onChange={(e) => set("message", e.target.value)} /></label>

        <div className="crm-sec">Follow-up</div>
        <label><span>Follow-up date {f && <em className={`crm-fup ${f.cls}`}>{f.text}</em>}</span>
          <input type="date" value={v.follow_up ?? ""} onChange={(e) => set("follow_up", e.target.value)} />
        </label>
        <div className="crm-quick">
          {quick.map(([l, n]) => <button type="button" key={l} onClick={() => set("follow_up", addDays(n))}>{l}</button>)}
          {v.follow_up && <button type="button" className="clr" onClick={() => set("follow_up", "")}>Clear</button>}
        </div>
        <label><span>Admin notes</span>
          <textarea rows={5} placeholder="Call outcome, fees discussed, preferred batch…" value={v.notes ?? ""} onChange={(e) => set("notes", e.target.value)} />
          <em>Only visible to admins — never shown on the website.</em>
        </label>

        <div className="row crm-actions">
          {!isNew && <button type="button" className="danger" onClick={() => onDelete(row)}><Ico n="trash" s={14} /> Delete</button>}
          <span className="sp" />
          <button type="button" onClick={onClose}>Cancel</button>
          <button className="primary">{isNew ? "Add enquiry" : "Save changes"}</button>
        </div>
      </form>
    </div>
  );
}