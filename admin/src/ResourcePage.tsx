import { nav, resources } from "./resources";
import type { Field, Resource } from "./resources";
import { useEffect, useRef, useState, FormEvent } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";

import { listRows, saveRow, deleteRow, deleteMany, download, usageOf, describeUsage, cascadeRename, uniqueClash, approveEnrollment, resendStudentSetup, retryHrNotification, grantCourseAccess, Row } from "./store";

import Courses from "./Courses";
import Batches from "./Batches";
import Testimonials from "./Testimonials";
import Blog from "./Blog";

const PAGE = 10;
const wa = (p: string) => { const d = String(p).replace(/\D/g, ""); return d.length === 10 ? "91" + d : d; };
const shrink = (file: File, maxW = 900) => new Promise<string>((ok, no) => {
  const img = new Image(), u = URL.createObjectURL(file);
  img.onload = () => {
    const k = Math.min(1, maxW / img.width), c = document.createElement("canvas");
    c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
    c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
    URL.revokeObjectURL(u); ok(c.toDataURL("image/jpeg", 0.8));
  };
  img.onerror = () => no(new Error("Not a valid image"));
  img.src = u;
});
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function ResourcePage() {
  const { name = "" } = useParams();
  const [tab, setTab] = useState(0);
  useEffect(() => setTab(0), [name]);
  const item = nav.find((n) => n.to === name && n.keys);
  if (!item) return <Navigate to="/dashboard" replace />;
  const keys = item.keys!;
  const k = keys[Math.min(tab, keys.length - 1)];
  return (
    <>
      {keys.length > 1 && (
        <div className="tabs" role="tablist">
          {keys.map((x, i) => <button key={x} role="tab" aria-selected={i === tab} className={i === tab ? "on" : ""} onClick={() => setTab(i)}>{resources[x].label}</button>)}
        </div>
      )}
      {k === "courses" ? <Courses key={k} /> : k === "online" || k === "classroom" ? <Batches key={k} kind={k} /> : k === "testimonials" ? <Testimonials key={k} /> : k === "posts" ? <Blog key={k} /> : <Screen key={k} cfg={resources[k]} />}
    </>
  );
}

function Cell({ f, r, cfg, patch }: { f: Field; r: Row; cfg: Resource; patch: (r: Row, p: Row) => void }) {
  const v = r[f.key];
  if (f.type === "bool") return <button className={v ? "tag on" : "tag"} title="Click to toggle" onClick={() => patch(r, { [f.key]: !v })}>{v ? "Live" : "Draft"}</button>;
  if (f.key === "status" && cfg.filter) return (
    <select className={`tag s-${v} pick`} aria-label="Status" value={v ?? ""} onChange={(e) => patch(r, { status: e.target.value })}>
      {cfg.filter.options.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
  if (f.key === "rating" && v) return <span className="stars" title={`${v} / 5`}>{"★".repeat(Number(v))}{"☆".repeat(5 - Number(v))}</span>;
  if (f.type === "image") return v ? <img className="thumb" src={v} alt="" onError={(e) => ((e.target as HTMLImageElement).style.visibility = "hidden")} /> : <></>;
  if ((f.type === "created" || f.type === "day") && v) return <>{new Date(v).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</>;
  return <>{v}</>;
}

const fail = (what: string, e: unknown) =>
  `${what}: ${e instanceof DOMException && e.name === "QuotaExceededError" ? "browser storage is full — use smaller images or delete something" : e instanceof Error && e.message ? e.message : "server unreachable"}`;
const dateText = (v: string) => new Date(v).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

function Screen({ cfg }: { cfg: Resource }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Row | null>(null);
  const [viewing, setViewing] = useState<Row | null>(null);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [sp, setSp] = useSearchParams();
  useEffect(() => { if (sp.get("new")) { setEditing(cfg.defaults()); setSp({}, { replace: true }); } }, []);

  const say = (m: string, ms = 2500) => { setToast(m); setTimeout(() => setToast(""), ms); };
  const load = async () => {
    try {
      const data = await listRows(cfg.table);
      setRows(data);
      setSel((prev) => new Set([...prev].filter((id) => data.some((r) => r.id === id)))); // drop selections that no longer exist
    } catch (e) { say(fail("Could not load", e), 5000); }
    setLoading(false);
  };
  useEffect(() => { load(); document.title = `${cfg.label} · Skill Training Center Admin`; }, []);

  const hasLive = cfg.fields.some((f) => f.key === "published");

  // ---- Create / Update
  const save = async (v: Row) => {
    const { _batch, ...base } = v;
    const clash = uniqueClash(rows, base);
    if (clash) return say(clash, 5000);
    const items: Row[] = _batch?.length ? _batch.map((u: string) => ({ ...base, image_url: u })) : [base];
    const old = rows.find((r) => r.id === base.id);
    try {
      for (const it of items) await saveRow(cfg.table, it);
      if (old) await cascadeRename(cfg.table, old, base); // other screens refer to this row by name, so a rename must follow through
    } catch (e) { return say(fail("Could not save", e), 5000); }
    setEditing(null); setViewing(null); say(items.length > 1 ? `${items.length} photos added` : v.id ? "Changes saved" : "Added"); load();
  };
  const patch = async (r: Row, p: Row) => {
    try { await saveRow(cfg.table, { ...r, ...p }); } catch (e) { return say(fail("Could not update", e), 5000); }
    load();
  };
  
const approveStudent = async (r: Row) => {
  if (cfg.table !== "enrollments") return;

  if (!confirm(`Approve enrollment for ${r.name || r.email}? A student account will be created and a password setup email will be sent.`)) {
    return;
  }

  try {
    const result = await approveEnrollment(r.id);
    say(`Approved! Student ID: ${result.studentId}`, 6000);
    await load();
  } catch (e) {
    say(fail("Approval failed", e), 6000);
  }
};

const resendSetupLink = async (r: Row) => {
  if (!r.studentId) {
    say("Student ID is not available for this enrollment.", 5000);
    return;
  }

  if (
    !confirm(
      `Resend password setup email to ${r.email || r.name}?`
    )
  ) {
    return;
  }

  try {
    const result = await resendStudentSetup(String(r.studentId));
    say(result.message || "Password setup email sent.", 6000);
  } catch (e) {
    say(fail("Resend failed", e), 6000);
  }
};

  const grantAccess = async (r: Row) => {
    const ref = prompt(`Confirm payment received from ${r.name || r.email} for "${r.course}".

Payment reference (UPI / receipt no., optional):`, "");
    if (ref === null) return;
    try {
      const result = await grantCourseAccess(r.id, ref);
      say(result.message || "Course access granted.", 6000);
      await load();
    } catch (e) {
      say(fail("Could not grant access", e), 6000);
    }
  };

  const retryHr = async (r: Row) => {
    try {
      const result = await retryHrNotification(r.id);
      say(result.message || "HR notification sent.", 6000);
      await load();
    } catch (e) {
      say(fail("HR email failed", e), 6000);
    }
  };

  const duplicate = (r: Row) => {
    const copy: Row = { ...r };
    delete copy.id; delete copy.created_at; delete copy.batch_id; delete copy.batch_name;
    copy[cfg.titleKey] = `${r[cfg.titleKey] ?? ""} (copy)`.trim();
    const d = cfg.defaults();
    if (cfg.fields.some((f) => f.key === "slug")) copy.slug = "";
    if ("enrollment_id" in d) copy.enrollment_id = d.enrollment_id;
    if (hasLive) copy.published = false;
    setViewing(null); setEditing(copy);
  };

  // ---- Delete (single + bulk), warning when other screens still point at the row
  const remove = async (r: Row) => {
    let used = "";
    try { used = describeUsage(await usageOf(cfg.table, r)); } catch { /* warn only if we can tell */ }
    const warn = used ? `\n\nStill used by: ${used}. Those entries keep the name, but it will no longer exist here.` : "";
    if (!confirm(`Delete "${r[cfg.titleKey] ?? "this item"}"? This can't be undone.${warn}`)) return;
    try { await deleteRow(cfg.table, r.id); } catch (e) { return say(fail("Could not delete", e), 5000); }
    setViewing(null); say("Deleted"); load();
  };
  const picked = () => rows.filter((r) => sel.has(r.id));
  const bulkDelete = async () => {
    const targets = picked();
    if (!targets.length) return;
    let refs = 0;
    try { for (const r of targets) refs += (await usageOf(cfg.table, r)).reduce((n, h) => n + h.count, 0); } catch { /* ignore */ }
    if (!confirm(`Delete ${targets.length} selected ${cfg.label.toLowerCase()}? This can't be undone.${refs ? `\n\n${refs} entries in other screens still use them.` : ""}`)) return;
    try { await deleteMany(cfg.table, targets.map((r) => r.id)); } catch (e) { return say(fail("Could not delete all", e), 5000); }
    setSel(new Set()); say(`${targets.length} deleted`); load();
  };
  const bulkPatch = async (p: Row) => {
    const targets = picked();
    try { for (const r of targets) await saveRow(cfg.table, { ...r, ...p }); } catch (e) { return say(fail("Could not update all", e), 5000); }
    say(`${targets.length} updated`); load();
  };
  const toggleSel = (id: string) => setSel((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const cols = cfg.fields.filter((f) => f.list);
  const filtered = rows.filter((r) =>
    (!status || r[cfg.filter!.key] === status) && JSON.stringify(r).toLowerCase().includes(q.toLowerCase()));
  const sorted = !sort ? filtered : [...filtered].sort((a, b) => {
    const x = a[sort.key], y = b[sort.key], nx = Number(x), ny = Number(y);
    const num = x !== undefined && x !== "" && y !== undefined && y !== "" && !isNaN(nx) && !isNaN(ny);
    return sort.dir * (num ? nx - ny : String(x ?? "").localeCompare(String(y ?? ""), undefined, { numeric: true, sensitivity: "base" }));
  });
  const grouped: Record<string, Row[]> = {};
  if (cfg.groupBy) sorted.forEach((r) => (grouped[r[cfg.groupBy!] || "Unassigned"] ||= []).push(r));
  const pages = Math.max(1, Math.ceil(sorted.length / PAGE));
  const shown = sorted.slice((page - 1) * PAGE, page * PAGE);
  const allShown = shown.length > 0 && shown.every((r) => sel.has(r.id));
  const sortBy = (key: string) => setSort((s) => (s?.key !== key ? { key, dir: 1 } : s.dir === 1 ? { key, dir: -1 } : null));

  const exportCsv = () => {
    const esc = (x: unknown) => `"${(Array.isArray(x) ? x.join(" | ") : String(x ?? "")).replace(/"/g, '""')}"`;
    const body = sorted.map((r) => cfg.fields.map((c) => esc(r[c.key])).join(","));
    download(`${cfg.table}.csv`, "\uFEFF" + [cfg.fields.map((c) => esc(c.label)).join(","), ...body].join("\n"), "text/csv");
  };

  return (
    <>
      <header className="bar">
        <h2>{cfg.label} <small>{filtered.length}</small></h2>
        <input placeholder="Search…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
        {cfg.filter && (
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="">All statuses</option>
            {cfg.filter.options.map((o) => <option key={o}>{o}</option>)}
          </select>
        )}
        <button onClick={exportCsv}>Export CSV</button>
        <button className="primary" onClick={() => setEditing(cfg.defaults())}>Add new</button>
      </header>
      {sel.size > 0 && (
        <div className="crm-bulk" role="region" aria-label="Bulk actions">
          <b>{sel.size} selected</b>
          {hasLive && <><button onClick={() => bulkPatch({ published: true })}>Set live</button><button onClick={() => bulkPatch({ published: false })}>Set draft</button></>}
          {cfg.filter && (
            <select value="" aria-label="Set status for selected" onChange={(e) => e.target.value && bulkPatch({ [cfg.filter!.key]: e.target.value })}>
              <option value="">Set status…</option>
              {cfg.filter.options.map((o) => <option key={o}>{o}</option>)}
            </select>
          )}
          <button className="danger" onClick={bulkDelete}>Delete selected</button>
          <button onClick={() => setSel(new Set())}>Clear</button>
        </div>
      )}
      {cfg.groupBy ? (
        Object.entries(grouped).sort(([x], [y]) => x.localeCompare(y)).map(([g, items]) => (
          <section key={g}>
            <h3 className="sec gal-h">{g} <small className="cnt">{items.length} photos</small>
              {g !== "Unassigned" && <button className="gal-add" onClick={() => setEditing({ ...cfg.defaults(), college: g })}>+ Add photos</button>}</h3>
            <div className="photos">
              {items.map((r) => (
                <figure key={r.id} className={r.published ? "" : "draft"}>
                  <input type="checkbox" className="fsel" checked={sel.has(r.id)} onChange={() => toggleSel(r.id)} aria-label={`Select ${r.title || "photo"}`} />
                  <img src={r.image_url} alt={r.title ?? ""} loading="lazy" />
                  <figcaption>{r.title || r.tag}</figcaption>
                  <div className="pa">
                    <button onClick={() => patch(r, { published: !r.published })}>{r.published ? "Live" : "Draft"}</button>
                    <button onClick={() => setEditing(r)}>Edit</button>
                    <button className="danger" onClick={() => remove(r)}>Delete</button>
                  </div>
                </figure>
              ))}
            </div>
          </section>
        ))
      ) : (
      <div className="scroll">
        <table>
          <thead>
            <tr>
              <th className="selc"><input type="checkbox" aria-label="Select all on this page" checked={allShown}
                onChange={() => setSel((p) => { const n = new Set(p); shown.forEach((r) => (allShown ? n.delete(r.id) : n.add(r.id))); return n; })} /></th>
              {cols.map((c) => (
                <th key={c.key} aria-sort={sort?.key === c.key ? (sort.dir === 1 ? "ascending" : "descending") : "none"}>
                  <button className="th-sort" onClick={() => sortBy(c.key)} title="Sort">{c.label}{sort?.key === c.key ? (sort.dir === 1 ? " ▲" : " ▼") : ""}</button>
                </th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id} className={sel.has(r.id) ? "picked" : ""}>
                <td className="selc"><input type="checkbox" checked={sel.has(r.id)} onChange={() => toggleSel(r.id)} aria-label={`Select ${r[cfg.titleKey] ?? "row"}`} /></td>
                {cols.map((c) => (
                  <td key={c.key}>
                    {c.key === cfg.titleKey && !c.type
                      ? <button className="linkish" onClick={() => setViewing(r)} title="View details">{r[c.key] || "(untitled)"}</button>
                      : <Cell f={c} r={r} cfg={cfg} patch={patch} />}
                  </td>
                ))}
                <td className="act">
                  
{cfg.table === "enrollments" &&
  r.status === "pending" &&
  <button className="primary" onClick={() => approveStudent(r)}>
    Approve
  </button>
}

{cfg.table === "enrollments" &&
  r.studentId &&
  ["confirmed", "joined"].includes(r.status) &&
  (r.payment_status === "verified"
    ? <span className="tag on" title={r.payment_reference ? `Ref: ${r.payment_reference}` : undefined}>Paid · access granted</span>
    : <button type="button" className="primary" onClick={() => grantAccess(r)} title="Record the payment and open the course in the student's dashboard">
        Verify payment &amp; grant access
      </button>)}

{cfg.table === "enrollments" &&
  r.hr_notification?.status === "failed" && (
    <button type="button" onClick={() => retryHr(r)} title={r.hr_notification.last_error || "HR email was not sent"}>
      Retry HR email
    </button>
  )}

{cfg.table === "enrollments" &&
  r.studentId &&
  r.status === "confirmed" && (
    <button
      type="button"
      onClick={() => resendSetupLink(r)}
    >
      Resend Setup Link
    </button>
  )}

                  {cfg.contact && r.phone && <><a href={`tel:${r.phone}`}>Call</a><a href={`https://wa.me/${wa(r.phone)}`} target="_blank" rel="noreferrer">WhatsApp</a></>}
                  <button onClick={() => setEditing(r)}>Edit</button>
                  {!cfg.contact && <button onClick={() => duplicate(r)} title="Create a copy as a draft">Copy</button>}
                  <button className="danger" onClick={() => remove(r)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
      {!loading && !filtered.length && (
        <p className="empty">{q || status ? "Nothing matches your filters." : `No ${cfg.label.toLowerCase()} yet. Select “Add new” to create one.`}</p>
      )}
      {pages > 1 && !cfg.groupBy && (
        <div className="pager">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span>Page {page} of {pages}</span>
          <button disabled={page === pages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
      {viewing && <Detail cfg={cfg} row={viewing} onEdit={() => { setEditing(viewing); setViewing(null); }} onCopy={() => duplicate(viewing)} onDelete={() => remove(viewing)} onClose={() => setViewing(null)} />}
      {editing && <Form cfg={cfg} row={editing} onSave={save} onClose={() => setEditing(null)} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}

/* Read-only view of every field on a row (the table only shows the list columns). */
function Detail({ cfg, row, onEdit, onCopy, onDelete, onClose }: { cfg: Resource; row: Row; onEdit: () => void; onCopy: () => void; onDelete: () => void; onClose: () => void }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);
  const show = (f: Field) => {
    const v = row[f.key];
    if (f.type === "image") return v ? <img className="dl-img" src={v} alt="" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} /> : "—";
    if (Array.isArray(v)) return v.length ? <ol className="dl-list">{v.map((x, i) => <li key={i}>{x}</li>)}</ol> : "—";
    if (f.type === "bool") return f.key === "published" ? (v ? "Live" : "Draft") : v ? "Yes" : "No";
    if ((f.type === "day" || f.type === "created") && v) return dateText(v);
    return v === undefined || v === null || v === "" ? "—" : String(v);
  };
  return (
    <div className="scrim" onClick={onClose}>
      <article className="panel" onClick={(e) => e.stopPropagation()} aria-label={`${cfg.one} details`}>
        <h3>{row[cfg.titleKey] || cfg.one}</h3>
        <dl className="dl">
          {cfg.fields.map((f) => <div key={f.key}><dt>{f.label}</dt><dd>{show(f)}</dd></div>)}
          {row.created_at && !cfg.fields.some((f) => f.key === "created_at") && <div><dt>Created</dt><dd>{dateText(row.created_at)}</dd></div>}
        </dl>
        <div className="row">
          <button type="button" onClick={onClose}>Close</button>
          <button type="button" className="danger" onClick={onDelete}>Delete</button>
          {!cfg.contact && <button type="button" onClick={onCopy}>Copy</button>}
          <button type="button" className="primary" onClick={onEdit}>Edit</button>
        </div>
      </article>
    </div>
  );
}

function check(f: Field, val: any): string {
  const s = String(val ?? "").trim();
  if (f.required && !s) return "This field is required.";
  if (s && f.type === "email" && !/^\S+@\S+\.\S+$/.test(s)) return "Enter a valid email address.";
  if (s && f.type === "phone" && !/^(\+91)?[6-9]\d{9}$/.test(s.replace(/[\s-]/g, ""))) return "Enter a valid 10-digit mobile number.";
  return "";
}

export function Form({ cfg, row, onSave, onClose }: { cfg: Resource; row: Row; onSave: (v: Row) => void; onClose: () => void }) {
  const fields = cfg.fields.filter((f) => f.type !== "created");
  const [v, setV] = useState<Row>(() => {
    const o = { ...row };
    fields.forEach((f) => { if (f.type === "lines") o[f.key] = (row[f.key] ?? []).join("\n"); });
    return o;
  });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const set = (k: string, val: unknown) => setV((p) => ({ ...p, [k]: val }));
  const [refs, setRefs] = useState<Record<string, string[]>>({});
  useEffect(() => {
    fields.filter((f) => f.type === "ref").forEach(async (f) => {
      const rows = await listRows(f.refTable!);
      setRefs((p) => ({ ...p, [f.key]: rows.map((r) => r[f.refKey!]).filter(Boolean) }));
    });
  }, []);
  const opts = (f: Field) => { const l = refs[f.key] ?? []; const c = v[f.key]; return c && !l.includes(c) ? [c, ...l] : l; };

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const out: Record<string, string> = {};
    fields.forEach((f) => { const m = f.multi && v._batch?.length ? "" : check(f, v[f.key]); if (m) out[f.key] = m; });
    setErrs(out);
    if (Object.keys(out).length) return;
    const clean: Row = { ...v };
    fields.forEach((f) => {
      if (f.type === "lines") clean[f.key] = String(v[f.key] ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
      else if (typeof clean[f.key] === "string") clean[f.key] = clean[f.key].trim();
    });
    if (fields.some((f) => f.key === "slug") && !clean.slug) clean.slug = slugify(String(clean[cfg.titleKey] ?? ""));
    if ((cfg.table === "classroom_training" || cfg.table === "online_training") && Number(clean.seats_filled || 0) > Number(clean.seats || 0)) {
      setErrs({ seats_filled: "Cannot be more than total seats." }); return;
    }
    onSave(clean);
  };

  return (
    <div className="scrim" onClick={onClose}>
      <form className="panel" onClick={(e) => e.stopPropagation()} onSubmit={submit} noValidate>
        <h3>{v.id ? "Edit" : "Add"} {cfg.one}</h3>
        {fields.map((f) => (
          <label key={f.key} className={f.type === "bool" ? "check" : ""}>
            <span>{f.label}{f.required && <i> *</i>}</span>
            {f.type === "lines" ? (
              <LinesEditor value={v[f.key] ?? ""} onChange={(x) => set(f.key, x)} />
            ) : f.type === "textarea" ? (
              <textarea rows={4} value={v[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} />
            ) : f.type === "image" ? (
              <span className="img">
                {v[f.key] && <img src={v[f.key]} alt="" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} />}
                <input type="file" accept="image/*" multiple={!!f.multi && !v.id} onChange={async (e) => {
                  const files = Array.from(e.target.files ?? []);
                  if (!files.length) return;
                  try {
                    if (f.multi && !v.id) set("_batch", await Promise.all(files.map(shrink)));
                    else set(f.key, await shrink(files[0], f.maxWidth));
                  } catch { setErrs((p) => ({ ...p, [f.key]: "Choose valid image files." })); }
                }} />
                {v._batch?.length > 0 && (
                  <span className="pv">{v._batch.map((u: string, i: number) => <img key={i} src={u} alt="" />)}<em>{v._batch.length} photos selected</em></span>
                )}
                <input placeholder="…or paste an image URL / path" value={String(v[f.key] ?? "").startsWith("data:") ? "" : v[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} />
              </span>
            ) : f.type === "ref" ? (
              <select value={v[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)}>
                <option value="">— Select —</option>
                {opts(f).map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : f.type === "select" ? (
              <select value={v[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)}>
                {f.options!.map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : f.type === "bool" ? (
              <input type="checkbox" checked={!!v[f.key]} onChange={(e) => set(f.key, e.target.checked)} />
            ) : (
              <input type={f.type === "day" ? "date" : f.type === "email" ? "email" : f.type === "number" ? "number" : "text"} inputMode={f.type === "phone" ? "tel" : undefined}
                value={v[f.key] ?? ""} disabled={f.readonly} onChange={(e) => set(f.key, e.target.value)} />
            )}
            {f.hint && !errs[f.key] && <em>{f.hint}</em>}
            {errs[f.key] && <b className="ferr">{errs[f.key]}</b>}
          </label>
        ))}
        <div className="row">
          <button type="button" onClick={onClose}>Cancel</button>
          <button className="primary">Save changes</button>
        </div>
      </form>
    </div>
  );
}

/* One row per item (syllabus topics, outcomes…). Enter adds a row, pasting a list splits it, arrows reorder. */
function LinesEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [items, setItems] = useState<string[]>(() => (value ? value.split("\n") : []));
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const [focus, setFocus] = useState<number | null>(null);
  useEffect(() => { if (focus !== null) { refs.current[focus]?.focus(); setFocus(null); } }, [focus, items]);
  const commit = (a: string[]) => { setItems(a); onChange(a.join("\n")); };
  const add = (at = items.length) => { const a = [...items]; a.splice(at, 0, ""); commit(a); setFocus(at); };
  const del = (i: number) => { commit(items.filter((_, j) => j !== i)); setFocus(Math.max(0, i - 1)); };
  const move = (i: number, d: number) => {
    const j = i + d; if (j < 0 || j >= items.length) return;
    const a = [...items]; [a[i], a[j]] = [a[j], a[i]]; commit(a); setFocus(j);
  };
  const paste = (e: React.ClipboardEvent<HTMLInputElement>, i: number) => {
    const t = e.clipboardData.getData("text");
    if (!/\r?\n/.test(t)) return;
    e.preventDefault();
    const lines = t.split(/\r?\n/).map((x) => x.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim()).filter(Boolean);
    const a = [...items]; a.splice(i, items[i]?.trim() ? 0 : 1, ...lines); commit(a);
  };
  return (
    <span className="le">
      {items.length === 0 && <em>Nothing added yet.</em>}
      {items.map((t, i) => (
        <span className="le-row" key={i}>
          <b>{i + 1}</b>
          <input ref={(el) => { refs.current[i] = el; }} value={t} onChange={(e) => commit(items.map((x, j) => (j === i ? e.target.value : x)))}
            onPaste={(e) => paste(e, i)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); add(i + 1); }
              else if (e.key === "Backspace" && !t) { e.preventDefault(); del(i); }
            }} aria-label={`Item ${i + 1}`} />
          <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" title="Move up">↑</button>
          <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down" title="Move down">↓</button>
          <button type="button" className="danger" onClick={() => del(i)} aria-label="Remove" title="Remove">✕</button>
        </span>
      ))}
      <button type="button" className="le-add" onClick={() => add()}>+ Add item</button>
    </span>
  );
}