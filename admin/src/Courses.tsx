// Courses — card view with image preview, publish/unpublish, syllabus and linked batch / student counts.
import { useEffect, useMemo, useState } from "react";
import { listRows, saveRow, deleteRow, download, usageOf, describeUsage, cascadeRename, uniqueClash, Row } from "./store";
import { resources } from "./resources";
import { Form } from "./ResourcePage";

const cfg = resources.courses;
const initials = (t: string) => t.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";
const HUES = [212, 262, 190, 330, 150, 24];
const hue = (t: string) => HUES[[...t].reduce((a, c) => a + c.charCodeAt(0), 0) % HUES.length];

export default function Courses() {
  const [rows, setRows] = useState<Row[]>([]);
  const [batches, setBatches] = useState<Row[]>([]);
  const [students, setStudents] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [tab, setTab] = useState<"all" | "live" | "draft">("all");
  const [editing, setEditing] = useState<Row | null>(null);
  const [toast, setToast] = useState("");
  const say = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  const load = async () => {
    const [c, o, k, s] = await Promise.all(["courses", "online_training", "classroom_training", "enrollments"].map(listRows));
    setRows(c); setBatches([...o, ...k]); setStudents(s); setLoading(false);
  };
  useEffect(() => { document.title = "Courses · Skill Training Center Admin"; load(); }, []);

  const info = (title: string) => ({
    batches: batches.filter((b) => b.course === title && ["upcoming", "ongoing"].includes(b.status)).length,
    allBatches: batches.filter((b) => b.course === title).length,
    students: students.filter((s) => s.course === title && s.status !== "cancelled").length,
  });

  const cats = useMemo(() => [...new Set(rows.map((r) => r.category).filter(Boolean))].sort(), [rows]);
  const counts = useMemo(() => ({ all: rows.length, live: rows.filter((r) => r.published).length, draft: rows.filter((r) => !r.published).length }), [rows]);
  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return rows
      .filter((r) => (tab === "all" || (tab === "live") === !!r.published) && (!cat || r.category === cat) &&
        (!n || [r.title, r.category, r.short, r.level, ...(r.syllabus ?? [])].join(" ").toLowerCase().includes(n)))
      .sort((a, b) => String(a.title).localeCompare(String(b.title)));
  }, [rows, q, cat, tab]);

  const save = async (v: Row) => {
    const clash = uniqueClash(rows, v);
    if (clash) return say(clash);
    const old = rows.find((r) => r.id === v.id);
    try {
      await saveRow("courses", v);
      // courses are referenced by title everywhere else (batches, students, placements, testimonials…), so a rename must follow through
      if (old) await cascadeRename("courses", old, v);
    } catch (e) { return say(e instanceof Error && e.message ? `Could not save: ${e.message}` : "Could not save (storage full or server unreachable)."); }
    setEditing(null); say(v.id ? "Course saved" : "Course added"); load();
  };
  const toggle = async (r: Row) => {
    try { await saveRow("courses", { ...r, published: !r.published }); } catch { return say("Could not update."); }
    say(r.published ? "Unpublished — hidden from the website" : "Published — live on the website"); load();
  };
  const remove = async (r: Row) => {
    let used = "";
    try { used = describeUsage(await usageOf("courses", r)); } catch { /* warn only if we can tell */ }
    const warn = used ? `\n\nStill used by: ${used}. They will keep the course name but it will no longer exist. Unpublishing is safer.` : "";
    if (!confirm(`Delete course "${r.title}"? This can't be undone.${warn}`)) return;
    try { await deleteRow("courses", r.id); } catch { return say("Could not delete."); }
    say("Course deleted"); load();
  };
  const exportCsv = () => {
    const esc = (x: unknown) => `"${(Array.isArray(x) ? x.join(" | ") : String(x ?? "")).replace(/"/g, '""')}"`;
    const head = ["Title", "Category", "Level", "Duration", "Fees", "Status", "Syllabus topics", "Active batches", "Students"];
    const body = list.map((r) => { const i = info(r.title); return [r.title, r.category, r.level, r.duration, r.fees, r.published ? "Live" : "Draft", (r.syllabus ?? []).join(" | "), i.batches, i.students].map(esc).join(","); });
    download("courses.csv", "﻿" + [head.map(esc).join(","), ...body].join("\n"), "text/csv");
  };

  return (
    <>
      <header className="bar">
        <h2>Courses <small>{rows.length} total</small></h2>
        <button onClick={exportCsv} disabled={!list.length}>Export CSV</button>
        <button className="primary" onClick={() => setEditing(cfg.defaults())}>Add course</button>
      </header>

      <div className="cm-tools">
        <div className="cm-tabs" role="tablist" aria-label="Visibility">
          {(["all", "live", "draft"] as const).map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>
              {t === "all" ? "All" : t === "live" ? "Live" : "Draft"}<b>{counts[t]}</b>
            </button>
          ))}
        </div>
        <input type="search" className="cm-q" placeholder="Search course, category or topic…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search courses" />
        <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category">
          <option value="">All categories</option>
          {cats.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="cm-grid">
        {list.map((r) => {
          const i = info(r.title), topics: string[] = r.syllabus ?? [];
          return (
            <article key={r.id} className={`cm-card${r.published ? "" : " draft"}`}>
              <div className="cm-img" style={{ ["--h" as string]: hue(r.title ?? "") }}>
                <span>{initials(r.title ?? "")}</span>
                {r.image && <img src={r.image} alt="" loading="lazy" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />}
                <button className={`cm-pub${r.published ? " on" : ""}`} onClick={() => toggle(r)} aria-pressed={!!r.published} title={r.published ? "Click to unpublish" : "Click to publish"}>
                  <i />{r.published ? "Live" : "Draft"}
                </button>
              </div>
              <div className="cm-body">
                <h3 title={r.title}>{r.title}</h3>
                <p className="cm-meta">{[r.category, r.level].filter(Boolean).join(" · ")}</p>
                <p className="cm-short">{r.short || <span className="crm-none">No short description</span>}</p>
                <div className="cm-facts">
                  <span>{r.duration || "—"}</span><span>{r.fees ? (/^\d+$/.test(String(r.fees)) ? `₹${r.fees}` : r.fees) : "Fees not set"}</span>
                </div>
                <div className="cm-stats">
                  <span title="Syllabus topics"><b>{topics.length}</b> topics</span>
                  <span title="Upcoming or ongoing batches"><b>{i.batches}</b> batches</span>
                  <span title="Enrolled students"><b>{i.students}</b> students</span>
                </div>
                <details className="cm-syl">
                  <summary>Syllabus</summary>
                  {topics.length ? <ol>{topics.map((t, n) => <li key={n}>{t}</li>)}</ol> : <p className="crm-none">No topics yet. Edit the course to add them.</p>}
                </details>
              </div>
              <div className="cm-act">
                <button onClick={() => setEditing(r)}>Edit</button>
                <button className="danger" onClick={() => remove(r)}>Delete</button>
              </div>
            </article>
          );
        })}
      </div>

      {!loading && !list.length && (
        <p className="empty">{rows.length ? "No courses match your filters." : "No courses yet. Select “Add course” to create one."}</p>
      )}
      {editing && <Form cfg={cfg} row={editing} onSave={save} onClose={() => setEditing(null)} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}