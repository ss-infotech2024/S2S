// Online / Classroom batches — schedule, fees, trainer, live seat count, publish toggle and a batch-wise student list.
import { useEffect, useMemo, useState, FormEvent } from "react";
import { listRows, saveRow, deleteRow, download, Row } from "./store";
import { resources } from "./resources";
import { Form } from "./ResourcePage";

const STATUS = ["upcoming", "ongoing", "completed", "cancelled"];
const ENROL = ["pending", "confirmed", "joined", "cancelled"];
const pad = (n: number) => String(n).padStart(2, "0");
const day = (s?: string) => (s ? new Date(`${s.slice(0, 10)}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "");
const wa = (p: string) => { const d = String(p).replace(/\D/g, ""); return d.length === 10 ? "91" + d : d; };
const money = (f: unknown) => (/^\d+$/.test(String(f ?? "")) ? `₹${Number(f).toLocaleString("en-IN")}` : String(f ?? ""));
const eid = () => `SS-${Math.floor(100000 + Math.random() * 900000)}`;
const active = (s: Row) => s.status !== "cancelled";
const initials = (n: string) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";

/** Seat maths shared by the table and the student list. */
function seatInfo(b: Row, students: Row[]) {
  const enrolled = students.filter((s) => s.batch_id === b.id && active(s)).length;
  const total = Number(b.seats || 0);
  const booked = Number(b.seats_filled || 0) + enrolled;
  return { enrolled, total, booked, left: total ? Math.max(0, total - booked) : null, pct: total ? Math.min(100, (booked / total) * 100) : 0 };
}

export default function Batches({ kind }: { kind: "online" | "classroom" }) {
  const cfg = resources[kind];
  const online = kind === "online";
  const [rows, setRows] = useState<Row[]>([]);
  const [students, setStudents] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [tab, setTab] = useState("all");
  const [course, setCourse] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);
  const [roster, setRoster] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const say = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  const load = async () => {
    const [b, s] = await Promise.all([listRows(cfg.table), listRows("enrollments")]);
    setRows(b); setStudents(s); setLoading(false);
  };
  useEffect(() => { document.title = `${cfg.label} · Skill Training Center Admin`; load(); }, []);

  const courses = useMemo(() => [...new Set(rows.map((r) => r.course).filter(Boolean))].sort(), [rows]);
  const base = useMemo(() => {
    const n = q.trim().toLowerCase();
    return rows.filter((r) => (!course || r.course === course) && (!n || [r.batch_name, r.course, r.trainer, r.center, r.timing].join(" ").toLowerCase().includes(n)));
  }, [rows, q, course]);
  const list = useMemo(
    () => (tab === "all" ? base : base.filter((r) => r.status === tab)).sort((a, b) => (a.start_date || "9999").localeCompare(b.start_date || "9999")),
    [base, tab]);

  const save = async (v: Row) => {
    const old = rows.find((r) => r.id === v.id);
    try {
      await saveRow(cfg.table, v);
      // keep enrolled students in step if the batch is renamed or re-pointed at a different course
      if (old && (old.batch_name !== v.batch_name || old.course !== v.course))
        for (const s of students.filter((x) => x.batch_id === v.id)) await saveRow("enrollments", { ...s, batch_name: v.batch_name, course: v.course });
    } catch (e) { return say(e instanceof Error && e.message ? `Could not save: ${e.message}` : "Could not save (storage full or server unreachable)."); }
    setEditing(null); say(v.id ? "Batch saved" : "Batch added"); load();
  };
  const patch = async (r: Row, p: Row) => {
    try { await saveRow(cfg.table, { ...r, ...p }); } catch { return say("Could not update."); }
    load();
  };
  const remove = async (r: Row) => {
    const n = students.filter((s) => s.batch_id === r.id).length;
    if (!confirm(`Delete batch "${r.batch_name}"? This can't be undone.${n ? `\n\n${n} student(s) are enrolled. They stay in the Students list but are removed from this batch.` : ""}`)) return;
    try {
      for (const s of students.filter((x) => x.batch_id === r.id)) await saveRow("enrollments", { ...s, batch_id: "", batch_name: "" });
      await deleteRow(cfg.table, r.id);
    } catch { return say("Could not delete."); }
    say("Batch deleted"); load();
  };
  const exportCsv = () => {
    const esc = (x: unknown) => `"${String(x ?? "").replace(/"/g, '""')}"`;
    const head = ["Batch", "Course", "Trainer", "Start date", "Days", "Timing", "Duration", "Fees", ...(online ? ["Platform"] : ["Centre", "Batch type"]), "Total seats", "Booked", "Available", "Status", "Website"];
    const body = list.map((r) => {
      const s = seatInfo(r, students);
      return [r.batch_name, r.course, r.trainer, r.start_date, r.days, r.timing, r.duration, r.fees, ...(online ? [r.platform] : [r.center, r.batch]), r.seats, s.booked, s.left ?? "", r.status, r.published ? "Live" : "Draft"].map(esc).join(",");
    });
    download(`${cfg.table}.csv`, "﻿" + [head.map(esc).join(","), ...body].join("\n"), "text/csv");
  };

  const rosterBatch = rows.find((r) => r.id === roster) ?? null;
  const tabs = ["all", ...STATUS];
  const countOf = (t: string) => (t === "all" ? base.length : base.filter((r) => r.status === t).length);

  return (
    <>
      <header className="bar">
        <h2>{cfg.label} <small>{rows.length} {rows.length === 1 ? "batch" : "batches"}</small></h2>
        <button onClick={exportCsv} disabled={!list.length}>Export CSV</button>
        <button className="primary" onClick={() => setEditing(cfg.defaults())}>Add batch</button>
      </header>

      <div className="crm-card">
        <div className="crm-tabs" role="tablist" aria-label="Batch status">
          {tabs.map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}><span>{t}</span><b>{countOf(t)}</b></button>
          ))}
        </div>
        <div className="crm-tools">
          <input type="search" className="cm-q" style={{ flex: 1, minWidth: 220 }} placeholder="Search batch, course, trainer or centre…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search batches" />
          <select value={course} onChange={(e) => setCourse(e.target.value)} aria-label="Course">
            <option value="">All courses</option>
            {courses.map((c) => <option key={c}>{c}</option>)}
          </select>
          {(q || course || tab !== "all") && <button className="crm-clear" onClick={() => { setQ(""); setCourse(""); setTab("all"); }}>Clear filters</button>}
        </div>

        <div className="crm-scroll">
          <table className="crm-table bt">
            <thead>
              <tr><th>Batch</th><th>Schedule</th><th>Trainer</th><th>Fees</th><th>Seats</th><th>Status</th><th>Website</th><th /></tr>
            </thead>
            <tbody>
              {list.map((r) => {
                const s = seatInfo(r, students);
                const state = s.left === 0 ? "full" : s.total && s.left! / s.total <= 0.2 ? "low" : "";
                return (
                  <tr key={r.id} onClick={() => setRoster(r.id)}>
                    <td><div className="crm-nm"><b>{r.batch_name}</b><em>{r.course || "No course"}</em></div></td>
                    <td>
                      <div className="crm-nm"><b>{day(r.start_date) || "Date not set"}</b>
                        <em>{[r.days, r.timing].filter(Boolean).join(" · ") || "Timing not set"}{!online && r.center ? ` · ${r.center}` : ""}</em></div>
                    </td>
                    <td>{r.trainer || <span className="crm-none">Not assigned</span>}</td>
                    <td>{r.fees ? money(r.fees) : <span className="crm-none">Not set</span>}</td>
                    <td>
                      {s.total ? (
                        <div className={`bt-seats ${state}`}>
                          <span><b>{s.left}</b> left <em>of {s.total}</em></span>
                          <i className="meter"><i style={{ width: `${s.pct}%` }} /></i>
                        </div>
                      ) : <span className="crm-none">Seats not set</span>}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <select className={`tag s-${r.status} pick`} aria-label={`Status of ${r.batch_name}`} value={r.status ?? "upcoming"} onChange={(e) => patch(r, { status: e.target.value })}>
                        {STATUS.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button className={`cm-pub inline${r.published ? " on" : ""}`} onClick={() => patch(r, { published: !r.published })} aria-pressed={!!r.published} title={r.published ? "Click to unpublish" : "Click to publish"}><i />{r.published ? "Live" : "Draft"}</button>
                    </td>
                    <td className="act" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => setRoster(r.id)}>Students ({s.enrolled})</button>
                      <button onClick={() => setEditing(r)}>Edit</button>
                      <button className="danger" onClick={() => remove(r)} aria-label={`Delete ${r.batch_name}`} title="Delete batch">✕</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!loading && !list.length && (
            <div className="crm-empty">
              <p>{rows.length ? "No batches match these filters." : `No ${cfg.label.toLowerCase()} batches yet.`}</p>
              {!rows.length && <button className="primary" onClick={() => setEditing(cfg.defaults())}>Add batch</button>}
            </div>
          )}
        </div>
      </div>

      {editing && <Form cfg={cfg} row={editing} onSave={save} onClose={() => setEditing(null)} />}
      {rosterBatch && <Roster batch={rosterBatch} kind={kind} students={students} onClose={() => setRoster(null)} onChange={load} say={say} onEdit={() => { setRoster(null); setEditing(rosterBatch); }} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}

/* ---------- batch-wise student list ---------- */
function Roster({ batch, kind, students, onClose, onChange, say, onEdit }: {
  batch: Row; kind: "online" | "classroom"; students: Row[]; onClose: () => void; onChange: () => void; say: (m: string) => void; onEdit: () => void;
}) {
  const mine = students.filter((s) => s.batch_id === batch.id).sort((a, b) => String(a.name).localeCompare(String(b.name)));
  const free = students.filter((s) => !s.batch_id && active(s));
  const seat = seatInfo(batch, students);
  const full = seat.left === 0;
  const [pick, setPick] = useState("");
  const [find, setFind] = useState("");
  const [adding, setAdding] = useState(false);
  const [nv, setNv] = useState({ name: "", phone: "", email: "" });
  const [errs, setErrs] = useState<Record<string, string>>({});

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  const options = free
    .filter((s) => !find.trim() || [s.name, s.phone, s.course].join(" ").toLowerCase().includes(find.trim().toLowerCase()))
    .sort((a, b) => Number(b.course === batch.course) - Number(a.course === batch.course) || String(a.name).localeCompare(String(b.name)));

  const assign = (s: Row): Row => ({
    ...s, batch_id: batch.id, batch_name: batch.batch_name, course: batch.course || s.course,
    mode: kind === "online" ? "Online" : "Classroom", ...(kind === "classroom" && batch.batch ? { batch: batch.batch } : {}),
    status: s.status === "cancelled" ? "pending" : s.status || "pending",
  });
  const run = async (fn: () => Promise<void>, ok: string) => {
    try { await fn(); } catch { return say("Could not save. Please try again."); }
    say(ok); onChange();
  };
  const enrollExisting = () => {
    const s = students.find((x) => x.id === pick);
    if (!s) return;
    if (full) return say("This batch is full.");
    run(() => saveRow("enrollments", assign(s)), `${s.name} enrolled`).then(() => setPick(""));
  };
  const enrollNew = (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!nv.name.trim()) er.name = "Name is required.";
    const p = nv.phone.replace(/[\s-]/g, "");
    if (!p) er.phone = "Phone is required."; else if (!/^(\+91)?[6-9]\d{9}$/.test(p)) er.phone = "Enter a valid 10-digit mobile number.";
    if (nv.email.trim() && !/^\S+@\S+\.\S+$/.test(nv.email.trim())) er.email = "Enter a valid email.";
    setErrs(er);
    if (Object.keys(er).length) return;
    if (full) return say("This batch is full.");
    run(() => saveRow("enrollments", assign({ enrollment_id: eid(), name: nv.name.trim(), phone: nv.phone.trim(), email: nv.email.trim(), status: "confirmed" })), `${nv.name.trim()} enrolled`)
      .then(() => { setNv({ name: "", phone: "", email: "" }); setAdding(false); });
  };
  const setStatus = (s: Row, status: string) => {
    if (s.status === "cancelled" && status !== "cancelled" && full) return say("This batch is full — no seat to restore.");
    run(() => saveRow("enrollments", { ...s, status }), "Status updated");
  };
  const unenroll = (s: Row) => {
    if (!confirm(`Remove ${s.name} from this batch? They stay in the Students list.`)) return;
    run(() => saveRow("enrollments", { ...s, batch_id: "", batch_name: "" }), `${s.name} removed from batch`);
  };
  const exportCsv = () => {
    const esc = (x: unknown) => `"${String(x ?? "").replace(/"/g, '""')}"`;
    const head = ["Enrollment ID", "Name", "Phone", "Email", "City", "Status"];
    const body = mine.map((s) => [s.enrollment_id, s.name, s.phone, s.email, s.city, s.status].map(esc).join(","));
    download(`${String(batch.batch_name).replace(/[^\w]+/g, "-")}-students.csv`, "﻿" + [head.map(esc).join(","), ...body].join("\n"), "text/csv");
  };

  return (
    <div className="scrim" onClick={onClose}>
      <section className="panel crm-panel ro" onClick={(e) => e.stopPropagation()} aria-label={`Students in ${batch.batch_name}`}>
        <div className="crm-ph-head">
          <div className="crm-ph-t">
            <h3>{batch.batch_name}</h3>
            <small>{[batch.course, batch.trainer && `Trainer: ${batch.trainer}`, batch.timing].filter(Boolean).join(" · ")}</small>
          </div>
          <button type="button" className="crm-x" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className={`ro-seats${full ? " full" : ""}`}>
          <div>
            <strong>{seat.total ? seat.left : "—"}</strong><span>{seat.total ? "seats available" : "Total seats not set"}</span>
          </div>
          <div className="ro-sub">
            <span>{seat.booked} booked{seat.total ? ` of ${seat.total}` : ""}</span>
            <span>{seat.enrolled} enrolled here{Number(batch.seats_filled) ? ` + ${batch.seats_filled} offline` : ""}</span>
          </div>
          {seat.total > 0 && <i className="meter"><i style={{ width: `${seat.pct}%` }} /></i>}
        </div>
        <div className="crm-contact">
          <button type="button" onClick={onEdit}>Edit batch</button>
          <button type="button" onClick={exportCsv} disabled={!mine.length}>Export student list</button>
        </div>

        <div className="crm-sec">Enrolled students ({mine.filter(active).length}{mine.length !== mine.filter(active).length ? ` + ${mine.length - mine.filter(active).length} cancelled` : ""})</div>
        {mine.length ? (
          <ul className="ro-list">
            {mine.map((s) => (
              <li key={s.id} className={s.status === "cancelled" ? "off" : ""}>
                <span className="av" style={{ background: "#6d28d9" }}>{initials(s.name ?? "")}</span>
                <span className="crm-nm"><b>{s.name}</b><em>{s.phone}{s.enrollment_id ? ` · ${s.enrollment_id}` : ""}</em></span>
                <select className={`tag s-${s.status} pick`} value={s.status ?? "pending"} onChange={(e) => setStatus(s, e.target.value)} aria-label={`Status of ${s.name}`}>
                  {ENROL.map((o) => <option key={o}>{o}</option>)}
                </select>
                <a className="call" href={`tel:${s.phone}`} title="Call" aria-label={`Call ${s.name}`}>☎</a>
                <a className="call" href={`https://wa.me/${wa(s.phone)}`} target="_blank" rel="noreferrer" title="WhatsApp" aria-label={`WhatsApp ${s.name}`}>💬</a>
                <button type="button" className="crm-x" onClick={() => unenroll(s)} title="Remove from batch" aria-label={`Remove ${s.name} from batch`}>✕</button>
              </li>
            ))}
          </ul>
        ) : <p className="empty" style={{ padding: "4px 0" }}>No students enrolled yet.</p>}

        <div className="crm-sec">Enroll a student</div>
        {full && <p className="error" role="alert">This batch is full. Increase total seats or cancel an enrollment to add more students.</p>}
        <div className="ro-add">
          <input type="search" placeholder="Search existing students…" value={find} onChange={(e) => setFind(e.target.value)} aria-label="Search existing students" disabled={full} />
          <select value={pick} onChange={(e) => setPick(e.target.value)} aria-label="Existing student" disabled={full}>
            <option value="">{options.length ? "Select a student…" : "No unassigned students"}</option>
            {options.map((s) => <option key={s.id} value={s.id}>{s.name} · {s.phone}{s.course ? ` · ${s.course}` : ""}</option>)}
          </select>
          <button className="primary" onClick={enrollExisting} disabled={!pick || full}>Enroll</button>
        </div>
        {!adding ? (
          <button type="button" className="ro-new" onClick={() => setAdding(true)} disabled={full}>+ New student</button>
        ) : (
          <form className="ro-form" onSubmit={enrollNew} noValidate>
            <label><span>Name <i>*</i></span><input value={nv.name} onChange={(e) => setNv({ ...nv, name: e.target.value })} autoFocus />{errs.name && <b className="ferr">{errs.name}</b>}</label>
            <div className="crm-two">
              <label><span>Phone <i>*</i></span><input inputMode="tel" value={nv.phone} onChange={(e) => setNv({ ...nv, phone: e.target.value })} />{errs.phone && <b className="ferr">{errs.phone}</b>}</label>
              <label><span>Email</span><input type="email" value={nv.email} onChange={(e) => setNv({ ...nv, email: e.target.value })} />{errs.email && <b className="ferr">{errs.email}</b>}</label>
            </div>
            <div className="row" style={{ position: "static", padding: 0 }}>
              <button type="button" onClick={() => { setAdding(false); setErrs({}); }}>Cancel</button>
              <button className="primary">Add &amp; enroll</button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}