// Course content editor — modules, lessons, resources and certificate rules, saved on the course record.
import { useEffect, useState } from "react";
import { saveRow, uploadLessonFile, openAdminFile, Row } from "./store";

type Resource = { id: string; kind: "link"; title: string; url: string } | { id: string; kind: "file"; title: string; file_id: string; file_name: string };
type Lesson = { id: string; title: string; description: string; video_url: string; body: string; duration: string; required: boolean; published: boolean; resources: Resource[] };
type Module = { id: string; title: string; description: string; published: boolean; lessons: Lesson[] };
type Completion = { require_all_lessons: boolean; require_admin_approval: boolean; signatory_name: string; signatory_title: string };

const uid = () => crypto.randomUUID();
const move = <T,>(list: T[], i: number, d: number) => {
  const j = i + d;
  if (j < 0 || j >= list.length) return list;
  const a = [...list]; [a[i], a[j]] = [a[j], a[i]]; return a;
};
const asModules = (v: unknown): Module[] => (Array.isArray(v) ? v : []).map((m: any) => ({
  id: m.id || uid(), title: m.title ?? "", description: m.description ?? "", published: m.published !== false,
  lessons: (m.lessons ?? []).map((l: any) => ({
    id: l.id || uid(), title: l.title ?? "", description: l.description ?? "", video_url: l.video_url ?? "", body: l.body ?? "",
    duration: l.duration ?? "", required: l.required !== false, published: l.published !== false, resources: l.resources ?? [],
  })),
}));

export default function CourseContent({ course, onClose, onSaved }: { course: Row; onClose: () => void; onSaved: (msg: string) => void }) {
  const [mods, setMods] = useState<Module[]>(() => asModules(course.curriculum));
  const [cfg, setCfg] = useState<Completion>(() => ({
    require_all_lessons: course.completion?.require_all_lessons !== false,
    require_admin_approval: course.completion?.require_admin_approval === true,
    signatory_name: course.completion?.signatory_name ?? "",
    signatory_title: course.completion?.signatory_title ?? "",
  }));
  const [open, setOpen] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");

  const close = () => { if (!dirty || confirm("Discard unsaved changes?")) onClose(); };
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  });

  const update = (next: Module[]) => { setMods(next); setDirty(true); };
  const setMod = (mi: number, p: Partial<Module>) => update(mods.map((m, i) => (i === mi ? { ...m, ...p } : m)));
  const setLesson = (mi: number, li: number, p: Partial<Lesson>) =>
    setMod(mi, { lessons: mods[mi].lessons.map((l, i) => (i === li ? { ...l, ...p } : l)) });
  const addLesson = (mi: number) => {
    const l: Lesson = { id: uid(), title: "New lesson", description: "", video_url: "", body: "", duration: "", required: true, published: false, resources: [] };
    setMod(mi, { lessons: [...mods[mi].lessons, l] }); setOpen(l.id);
  };

  const upload = async (mi: number, li: number, file: File) => {
    setBusy("Uploading…"); setErr("");
    try {
      const f = await uploadLessonFile(file);
      setLesson(mi, li, { resources: [...mods[mi].lessons[li].resources, { id: uid(), kind: "file", title: file.name, file_id: f.id, file_name: f.name }] });
    } catch (e) { setErr(e instanceof Error ? e.message : "Upload failed"); }
    setBusy("");
  };

  const save = async () => {
    const bad = mods.flatMap((m) => m.lessons).find((l) => l.video_url && !/^https?:\/\//i.test(l.video_url));
    if (bad) return setErr(`Video URL for "${bad.title}" must start with http:// or https://`);
    setBusy("Saving…"); setErr("");
    try {
      await saveRow("courses", { ...course, curriculum: mods, completion: cfg });
      setDirty(false); onSaved("Course content saved");
    } catch (e) { setErr(e instanceof Error ? e.message : "Could not save"); }
    setBusy("");
  };

  const lessonCount = mods.reduce((n, m) => n + m.lessons.length, 0);
  const visible = mods.filter((m) => m.published).map((m) => ({ ...m, lessons: m.lessons.filter((l) => l.published) }));

  return (
    <div className="scrim" onClick={close}>
      <section className="panel wide" onClick={(e) => e.stopPropagation()} aria-label="Course content">
        <h3>Content · {course.title}</h3>
        <p className="crm-none">{mods.length} modules · {lessonCount} lessons. Students only see published modules and lessons, and only after the course is assigned to them.</p>
        <div className="cm-tabs" role="tablist">
          <button role="tab" aria-selected={!preview} className={!preview ? "on" : ""} onClick={() => setPreview(false)}>Edit</button>
          <button role="tab" aria-selected={preview} className={preview ? "on" : ""} onClick={() => setPreview(true)}>Preview as student</button>
        </div>

        {preview ? (
          <div className="lms-prev">
            {!visible.some((m) => m.lessons.length) && <p className="empty">Nothing is published yet.</p>}
            {visible.map((m, mi) => (
              <div key={m.id} className="lms-box">
                <h4>Module {mi + 1}: {m.title}</h4>
                {m.description && <p className="crm-none">{m.description}</p>}
                {m.lessons.map((l, li) => (
                  <div key={l.id}>
                    <h5>{li + 1}. {l.title}{!l.required && " (optional)"}{l.duration && ` · ${l.duration}`}</h5>
                    {l.description && <p className="crm-none">{l.description}</p>}
                    {l.video_url && <p>Video: <a href={l.video_url} target="_blank" rel="noreferrer">{l.video_url}</a></p>}
                    {l.body && <div className="body">{l.body}</div>}
                    {l.resources.map((r) => (
                      <p key={r.id} className="lms-res">📎 {r.kind === "file"
                        ? <button type="button" onClick={() => openAdminFile(r.file_id, r.file_name).catch((e) => setErr(e.message))}>{r.title || r.file_name}</button>
                        : <a href={r.url} target="_blank" rel="noreferrer">{r.title || r.url}</a>}</p>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="lms-box">
              <h4>Certificate rules</h4>
              <label className="check"><input type="checkbox" checked={cfg.require_all_lessons} onChange={(e) => { setCfg({ ...cfg, require_all_lessons: e.target.checked }); setDirty(true); }} />Students must complete all required lessons</label>
              <label className="check"><input type="checkbox" checked={cfg.require_admin_approval} onChange={(e) => { setCfg({ ...cfg, require_admin_approval: e.target.checked }); setDirty(true); }} />An admin must approve each certificate</label>
              <p className="crm-none">Assignments marked “Required” or “Final assessment” (in the Assignments screen) are also checked.</p>
              <div className="lms-row">
                <input placeholder="Signatory name (e.g. Course Director)" value={cfg.signatory_name} onChange={(e) => { setCfg({ ...cfg, signatory_name: e.target.value }); setDirty(true); }} aria-label="Signatory name" />
                <input placeholder="Signatory title" value={cfg.signatory_title} onChange={(e) => { setCfg({ ...cfg, signatory_title: e.target.value }); setDirty(true); }} aria-label="Signatory title" />
              </div>
            </div>

            {mods.map((m, mi) => (
              <div key={m.id} className={`lms-mod${m.published ? "" : " draft"}`}>
                <div className="lms-row">
                  <b>Module {mi + 1}</b>
                  <input value={m.title} placeholder="Module title" onChange={(e) => setMod(mi, { title: e.target.value })} aria-label="Module title" />
                  <label className="check"><input type="checkbox" checked={m.published} onChange={(e) => setMod(mi, { published: e.target.checked })} />Published</label>
                  <button type="button" onClick={() => update(move(mods, mi, -1))} disabled={mi === 0} aria-label="Move module up">↑</button>
                  <button type="button" onClick={() => update(move(mods, mi, 1))} disabled={mi === mods.length - 1} aria-label="Move module down">↓</button>
                  <button type="button" className="danger" onClick={() => confirm(`Delete module "${m.title}" and its ${m.lessons.length} lessons?`) && update(mods.filter((_, i) => i !== mi))}>Delete</button>
                </div>
                <input value={m.description} placeholder="Short description (optional)" onChange={(e) => setMod(mi, { description: e.target.value })} aria-label="Module description" />

                {m.lessons.map((l, li) => (
                  <div key={l.id} className={`lms-les${l.published ? "" : " draft"}`}>
                    <div className="lms-les-head">
                      <b>{li + 1}. {l.title || "Untitled lesson"}</b>
                      <span className={`tag${l.published ? " on" : ""}`}>{l.published ? "Published" : "Draft"}</span>
                      {l.video_url && <span className="tag">Video</span>}
                      {l.resources.length > 0 && <span className="tag">{l.resources.length} resources</span>}
                      <button type="button" onClick={() => setOpen(open === l.id ? null : l.id)}>{open === l.id ? "Close" : "Edit"}</button>
                      <button type="button" onClick={() => setMod(mi, { lessons: move(m.lessons, li, -1) })} disabled={li === 0} aria-label="Move lesson up">↑</button>
                      <button type="button" onClick={() => setMod(mi, { lessons: move(m.lessons, li, 1) })} disabled={li === m.lessons.length - 1} aria-label="Move lesson down">↓</button>
                      <button type="button" className="danger" onClick={() => confirm(`Delete lesson "${l.title}"?`) && setMod(mi, { lessons: m.lessons.filter((_, i) => i !== li) })}>Delete</button>
                    </div>
                    {open === l.id && (
                      <>
                        <label>Title<input value={l.title} onChange={(e) => setLesson(mi, li, { title: e.target.value })} /></label>
                        <label>Short description<input value={l.description} onChange={(e) => setLesson(mi, li, { description: e.target.value })} /></label>
                        <div className="lms-row">
                          <label style={{ flex: 3 }}>Video URL<input value={l.video_url} placeholder="https://www.youtube.com/watch?v=…" onChange={(e) => setLesson(mi, li, { video_url: e.target.value })} /><em>YouTube, Vimeo or a direct .mp4 link</em></label>
                          <label style={{ flex: 1 }}>Duration<input value={l.duration} placeholder="e.g. 15 min" onChange={(e) => setLesson(mi, li, { duration: e.target.value })} /></label>
                        </div>
                        <label>Lesson notes / text<textarea rows={6} value={l.body} onChange={(e) => setLesson(mi, li, { body: e.target.value })} /></label>
                        <div className="lms-row">
                          <label className="check"><input type="checkbox" checked={l.published} onChange={(e) => setLesson(mi, li, { published: e.target.checked })} />Published</label>
                          <label className="check"><input type="checkbox" checked={l.required} onChange={(e) => setLesson(mi, li, { required: e.target.checked })} />Required for completion</label>
                        </div>
                        <div className="lms-box">
                          <h4>Resources</h4>
                          {l.resources.length === 0 && <p className="crm-none">No resources yet.</p>}
                          {l.resources.map((r, ri) => (
                            <div key={r.id} className="lms-res">
                              <input value={r.title} onChange={(e) => setLesson(mi, li, { resources: l.resources.map((x, i) => (i === ri ? { ...x, title: e.target.value } : x)) })} aria-label="Resource title" style={{ flex: 1 }} />
                              {r.kind === "file"
                                ? <button type="button" onClick={() => openAdminFile(r.file_id, r.file_name).catch((e) => setErr(e.message))}>Open {r.file_name}</button>
                                : <a href={r.url} target="_blank" rel="noreferrer">{r.url}</a>}
                              <button type="button" className="danger" onClick={() => setLesson(mi, li, { resources: l.resources.filter((_, i) => i !== ri) })}>Remove</button>
                            </div>
                          ))}
                          <AddLink onAdd={(title, url) => setLesson(mi, li, { resources: [...l.resources, { id: uid(), kind: "link", title, url }] })} />
                          <label>Upload a file (PDF, Office, ZIP, image)
                            <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.png,.jpg,.jpeg" disabled={!!busy}
                              onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) void upload(mi, li, f); }} />
                          </label>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addLesson(mi)}>+ Add lesson</button>
              </div>
            ))}
            <button type="button" onClick={() => update([...mods, { id: uid(), title: `Module ${mods.length + 1}`, description: "", published: false, lessons: [] }])}>+ Add module</button>
          </>
        )}

        {err && <div className="error" role="alert">{err}</div>}
        <div className="row">
          {busy && <span className="crm-none">{busy}</span>}
          <button type="button" onClick={close}>Close</button>
          <button type="button" className="primary" onClick={() => void save()} disabled={!!busy || !dirty}>Save content</button>
        </div>
      </section>
    </div>
  );
}

function AddLink({ onAdd }: { onAdd: (title: string, url: string) => void }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const ok = /^https?:\/\/\S+$/i.test(url.trim());
  return (
    <div className="lms-row">
      <input placeholder="Link title" value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Link title" />
      <input placeholder="https://…" value={url} onChange={(e) => setUrl(e.target.value)} aria-label="Link URL" />
      <button type="button" disabled={!ok} onClick={() => { onAdd(title.trim() || url.trim(), url.trim()); setTitle(""); setUrl(""); }}>Add link</button>
    </div>
  );
}
