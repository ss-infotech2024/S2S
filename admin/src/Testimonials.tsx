// Testimonials — review queue: approve / reject in one click, feature the best ones.
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { listRows, saveRow, deleteRow, Row } from "./store";
import { resources } from "./resources";
import { Form } from "./ResourcePage";

const cfg = resources.testimonials;
const TABS = ["pending", "approved", "rejected", "all"] as const;
type Tab = (typeof TABS)[number];
const initials = (n: string) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";
const when = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function Testimonials() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("pending");
  const [q, setQ] = useState("");
  const [stars, setStars] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);
  const [toast, setToast] = useState("");
  const [sp, setSp] = useSearchParams();
  const say = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2800); };

  const load = async () => { setRows(await listRows("testimonials")); setLoading(false); };
  useEffect(() => {
    document.title = "Testimonials · Skill Training Center Admin";
    load();
    if (sp.get("new")) { setEditing(cfg.defaults()); setSp({}, { replace: true }); }
  }, []);

  const base = useMemo(() => {
    const n = q.trim().toLowerCase();
    return rows.filter((r) => (!stars || String(r.rating) === stars) && (!n || [r.name, r.course, r.feedback].join(" ").toLowerCase().includes(n)));
  }, [rows, q, stars]);
  const count = (t: Tab) => (t === "all" ? base.length : base.filter((r) => r.status === t).length);
  const list = tab === "all" ? base : base.filter((r) => r.status === tab);
  const pending = rows.filter((r) => r.status === "pending").length;
  const avg = useMemo(() => {
    const a = rows.filter((r) => r.status === "approved");
    return a.length ? (a.reduce((x, r) => x + Number(r.rating || 0), 0) / a.length).toFixed(1) : "—";
  }, [rows]);

  const setStatus = async (r: Row, status: string) => {
    try { await saveRow("testimonials", { ...r, status }); } catch { return say("Could not update."); }
    say(status === "approved" ? `Approved — ${r.name}'s review is live` : status === "rejected" ? "Rejected — hidden from the website" : "Moved back to pending"); load();
  };
  const feature = async (r: Row) => {
    try { await saveRow("testimonials", { ...r, featured: !r.featured }); } catch { return say("Could not update."); }
    load();
  };
  const approveAll = async () => {
    const t = list.filter((r) => r.status === "pending");
    if (!t.length || !confirm(`Approve ${t.length} pending review${t.length > 1 ? "s" : ""}? They go live on the website immediately.`)) return;
    try { for (const r of t) await saveRow("testimonials", { ...r, status: "approved" }); } catch { say("Could not approve all."); return load(); }
    say(`${t.length} approved`); load();
  };
  const save = async (v: Row) => {
    try { await saveRow("testimonials", v); } catch { return say("Could not save."); }
    setEditing(null); say(v.id ? "Saved" : "Testimonial added"); load();
  };
  const remove = async (r: Row) => {
    if (!confirm(`Delete the review from "${r.name}"? This can't be undone.`)) return;
    try { await deleteRow("testimonials", r.id); } catch { return say("Could not delete."); }
    say("Deleted"); load();
  };

  return (
    <>
      <header className="bar">
        <h2>Testimonials <small>{rows.length} total · {avg} ★ average (approved)</small></h2>
        <button className="primary" onClick={() => setEditing(cfg.defaults())}>Add testimonial</button>
      </header>

      <div className="cm-tools">
        <div className="cm-tabs" role="tablist" aria-label="Review status">
          {TABS.map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>
              <span style={{ textTransform: "capitalize" }}>{t}</span><b>{count(t)}</b>
            </button>
          ))}
        </div>
        <input type="search" className="cm-q" placeholder="Search name, course or feedback…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search testimonials" />
        <select value={stars} onChange={(e) => setStars(e.target.value)} aria-label="Rating">
          <option value="">Any rating</option>
          {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
        </select>
        {tab === "pending" && list.length > 1 && <button onClick={approveAll}>Approve all ({list.length})</button>}
      </div>

      {tab !== "pending" && pending > 0 && <p className="wc-note"><b>{pending}</b> review{pending > 1 ? "s are" : " is"} waiting for approval. <button className="crm-clear" onClick={() => setTab("pending")}>Review now</button></p>}

      <div className="tm-list">
        {list.map((r) => (
          <article key={r.id} className={`tm-card s-${r.status}`}>
            <div className="tm-head">
              {r.image ? <img className="tm-av" src={r.image} alt="" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} /> : <span className="av lg" style={{ background: "#6d28d9" }}>{initials(r.name ?? "")}</span>}
              <div className="tm-who"><b>{r.name}</b><em>{r.course || "No course"} · {when(r.created_at)}</em></div>
              <span className="stars" title={`${r.rating} / 5`}>{"★".repeat(Number(r.rating) || 0)}{"☆".repeat(5 - (Number(r.rating) || 0))}</span>
            </div>
            <p className="tm-text">“{r.feedback}”</p>
            <div className="tm-act">
              <span className={`tag s-${r.status}`}>{r.status}</span>
              {r.status === "approved" && <button className={`tm-star${r.featured ? " on" : ""}`} onClick={() => feature(r)} aria-pressed={!!r.featured} title="Feature on homepage">{r.featured ? "★ Featured" : "☆ Feature"}</button>}
              <span className="wc-sp" />
              {r.status !== "approved" && <button className="tm-ok" onClick={() => setStatus(r, "approved")}>✓ Approve</button>}
              {r.status !== "rejected" && <button className="tm-no" onClick={() => setStatus(r, "rejected")}>✕ Reject</button>}
              {r.status !== "pending" && <button onClick={() => setStatus(r, "pending")} title="Move back to pending">Undo</button>}
              <button onClick={() => setEditing(r)}>Edit</button>
              <button className="danger" onClick={() => remove(r)} aria-label={`Delete review from ${r.name}`} title="Delete">🗑</button>
            </div>
          </article>
        ))}
      </div>
      {!loading && !list.length && (
        <p className="empty">{tab === "pending" && !q && !stars ? "All caught up — no reviews waiting for approval." : "No reviews match."}</p>
      )}
      {editing && <Form cfg={cfg} row={editing} onSave={save} onClose={() => setEditing(null)} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}