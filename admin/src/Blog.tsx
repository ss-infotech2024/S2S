// Blog — publish / unpublish workflow with a reader-style preview before going live.
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { listRows, saveRow, deleteRow, uniqueClash, Row } from "./store";
import { resources } from "./resources";
import { Form } from "./ResourcePage";

const cfg = resources.posts;
const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const fmt = (s?: string) => (s ? new Date(s.length > 10 ? s : `${s}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "");
const readMins = (p: Row) => Math.max(1, Math.round(`${p.excerpt ?? ""} ${p.body ?? ""}`.split(/\s+/).filter(Boolean).length / 200));

export default function Blog() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | "published" | "draft">("all");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);
  const [preview, setPreview] = useState<Row | null>(null);
  const [toast, setToast] = useState("");
  const [sp, setSp] = useSearchParams();
  const say = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  const load = async () => { setRows(await listRows("posts")); setLoading(false); };
  useEffect(() => {
    document.title = "Blog · Skill Training Center Admin";
    load();
    if (sp.get("new")) { setEditing(cfg.defaults()); setSp({}, { replace: true }); }
  }, []);

  const cats = useMemo(() => [...new Set(rows.map((r) => r.category).filter(Boolean))].sort(), [rows]);
  const counts = { all: rows.length, published: rows.filter((r) => r.published).length, draft: rows.filter((r) => !r.published).length };
  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return rows.filter((r) => (tab === "all" || (tab === "published") === !!r.published) && (!cat || r.category === cat) &&
      (!n || [r.title, r.author, r.category, r.excerpt].join(" ").toLowerCase().includes(n)));
  }, [rows, tab, q, cat]);

  const save = async (v: Row) => {
    const clash = uniqueClash(rows, v);
    if (clash) return say(clash);
    try { await saveRow("posts", v); } catch { return say("Could not save (storage full or server unreachable)."); }
    setEditing(null); say(v.id ? "Post saved" : "Draft created"); load();
  };
  const publish = async (r: Row) => {
    if (!r.published && (!r.title || !(r.body || r.excerpt))) { say("Add some content before publishing."); return setEditing(r); }
    const next = { ...r, published: !r.published, ...(!r.published && !r.day ? { day: ymd(new Date()) } : {}) };
    try { await saveRow("posts", next); } catch { return say("Could not update."); }
    say(r.published ? "Unpublished — back to draft" : "Published — live on the website"); setPreview(null); load();
  };
  const remove = async (r: Row) => {
    if (!confirm(`Delete "${r.title}"? This can't be undone.`)) return;
    try { await deleteRow("posts", r.id); } catch { return say("Could not delete."); }
    say("Post deleted"); setPreview(null); load();
  };

  return (
    <>
      <header className="bar">
        <h2>Blog <small>{rows.length} posts</small></h2>
        <button className="primary" onClick={() => setEditing(cfg.defaults())}>New post</button>
      </header>
      <div className="cm-tools">
        <div className="cm-tabs" role="tablist" aria-label="Post status">
          {(["all", "published", "draft"] as const).map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>
              <span style={{ textTransform: "capitalize" }}>{t}</span><b>{counts[t]}</b>
            </button>
          ))}
        </div>
        <input type="search" className="cm-q" placeholder="Search title, author or category…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search posts" />
        <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category">
          <option value="">All categories</option>
          {cats.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="crm-card">
        <div className="crm-scroll">
          <table className="crm-table bl">
            <thead><tr><th>Post</th><th>Category</th><th>Author</th><th>Date</th><th>Status</th><th /></tr></thead>
            <tbody>
              {list.map((r) => (
                <tr key={r.id} onClick={() => setPreview(r)}>
                  <td>
                    <div className="bl-t">
                      {r.image ? <img className="thumb" src={r.image} alt="" onError={(e) => ((e.target as HTMLImageElement).style.visibility = "hidden")} /> : <span className="thumb bl-ph" />}
                      <span className="crm-nm"><b>{r.title}</b><em>{r.excerpt || <span className="crm-none">No excerpt</span>}</em></span>
                    </div>
                  </td>
                  <td>{r.category ? <span className="crm-course">{r.category}</span> : <span className="crm-none">—</span>}</td>
                  <td>{r.author || <span className="crm-none">—</span>}</td>
                  <td className="crm-date">{fmt(r.day) || "—"}</td>
                  <td><span className={`cm-pub inline${r.published ? " on" : ""}`}><i />{r.published ? "Published" : "Draft"}</span></td>
                  <td className="act" onClick={(e) => e.stopPropagation()}>
                    <button className={r.published ? "" : "primary"} onClick={() => publish(r)}>{r.published ? "Unpublish" : "Publish"}</button>
                    <button onClick={() => setEditing(r)}>Edit</button>
                    <button className="danger" onClick={() => remove(r)} aria-label={`Delete ${r.title}`} title="Delete">✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && !list.length && <div className="crm-empty"><p>{rows.length ? "No posts match." : "No posts yet. Select “New post” to write one."}</p></div>}
        </div>
      </div>

      {preview && (
        <div className="scrim" onClick={() => setPreview(null)}>
          <article className="panel crm-panel bl-prev" onClick={(e) => e.stopPropagation()} aria-label="Post preview">
            <div className="crm-ph-head">
              <span className={`cm-pub inline${preview.published ? " on" : ""}`}><i />{preview.published ? "Published" : "Draft preview"}</span>
              <span className="wc-sp" />
              <button type="button" className="crm-x" onClick={() => setPreview(null)} aria-label="Close">✕</button>
            </div>
            {preview.image && <img className="bl-cover" src={preview.image} alt="" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />}
            <p className="cm-meta">{preview.category}</p>
            <h2 className="bl-h">{preview.title}</h2>
            <p className="bl-by">{[preview.author, fmt(preview.day), `${readMins(preview)} min read`].filter(Boolean).join(" · ")}</p>
            {preview.excerpt && <p className="bl-ex">{preview.excerpt}</p>}
            {preview.body ? String(preview.body).split(/\n{2,}/).map((p, i) => <p key={i} className="bl-p">{p}</p>) : <p className="crm-none">This post has no body text yet.</p>}
            <div className="row crm-actions">
              <button type="button" onClick={() => { setEditing(preview); setPreview(null); }}>Edit</button>
              <span className="sp" />
              <button className={preview.published ? "" : "primary"} onClick={() => publish(preview)}>{preview.published ? "Unpublish" : "Publish now"}</button>
            </div>
          </article>
        </div>
      )}
      {editing && <Form cfg={cfg} row={editing} onSave={save} onClose={() => setEditing(null)} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}