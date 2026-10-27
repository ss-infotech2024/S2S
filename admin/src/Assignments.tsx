// Assignments — create per course/module, then review student submissions and release marks and feedback.
import { useEffect, useMemo, useState, FormEvent } from "react";
import { listRows, saveRow, deleteRow, listSubmissions, evaluateSubmission, openAdminFile, Row } from "./store";

const day = (v?: string) => (v ? new Date(v.length === 10 ? `${v}T00:00:00` : v).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "");
const blank = (course_id = ""): Row => ({ course_id, title: "", instructions: "", module_id: "", due_date: "", max_marks: 10, pass_marks: 0, required: true, is_final: false, allow_text: true, allow_file: false, active: true });

export default function Assignments() {
  const [rows, setRows] = useState<Row[]>([]);
  const [courses, setCourses] = useState<Row[]>([]);
  const [subs, setSubs] = useState<Row[]>([]);
  const [course, setCourse] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Row | null>(null);
  const [reviewing, setReviewing] = useState<Row | null>(null);
  const [toast, setToast] = useState("");
  const say = (m: string, ms = 3500) => { setToast(m); setTimeout(() => setToast(""), ms); };

  const load = async () => {
    try {
      const [a, c, s] = await Promise.all([listRows("assignments"), listRows("courses"), listSubmissions({})]);
      setRows(a); setCourses(c); setSubs(s);
    } catch (e) { say(`Could not load: ${e instanceof Error ? e.message : "server unreachable"}`, 6000); }
    setLoading(false);
  };
  useEffect(() => { document.title = "Assignments · Skill Training Center Admin"; load(); }, []);

  const title = useMemo(() => new Map(courses.map((c) => [c.id, c.title])), [courses]);
  const list = rows.filter((r) => !course || r.course_id === course)
    .sort((a, b) => String(title.get(a.course_id) ?? "").localeCompare(String(title.get(b.course_id) ?? "")) || String(a.created_at ?? "").localeCompare(String(b.created_at ?? "")));
  const stats = (id: string) => {
    const s = subs.filter((x) => x.assignment_id === id);
    return { total: s.length, toReview: s.filter((x) => x.status !== "evaluated").length };
  };

  const save = async (v: Row) => {
    try { await saveRow("assignments", v); } catch (e) { return say(`Could not save: ${e instanceof Error ? e.message : "server unreachable"}`, 6000); }
    setEditing(null); say(v.id ? "Assignment saved" : "Assignment added"); load();
  };
  const remove = async (r: Row) => {
    if (!confirm(`Delete assignment "${r.title}"?`)) return;
    try { await deleteRow("assignments", r.id); } catch (e) { return say(e instanceof Error ? e.message : "Could not delete", 6000); }
    say("Assignment deleted"); load();
  };

  return (
    <>
      <header className="bar">
        <h2>Assignments <small>{list.length}</small></h2>
        <select value={course} onChange={(e) => setCourse(e.target.value)} aria-label="Course">
          <option value="">All courses</option>
          {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        <button className="primary" onClick={() => setEditing(blank(course))} disabled={!courses.length}>Add assignment</button>
      </header>
      <div className="scroll">
        <table>
          <thead><tr><th>Assignment</th><th>Course</th><th>Due</th><th>Marks</th><th>Type</th><th>Submissions</th><th>Status</th><th /></tr></thead>
          <tbody>
            {list.map((r) => {
              const s = stats(r.id);
              return (
                <tr key={r.id}>
                  <td><button className="linkish" onClick={() => setReviewing(r)}>{r.title}</button></td>
                  <td>{title.get(r.course_id) ?? <span className="crm-none">(deleted course)</span>}</td>
                  <td>{day(r.due_date) || "—"}</td>
                  <td>{r.max_marks || "—"}{r.is_final ? ` · pass ${r.pass_marks}` : ""}</td>
                  <td>{r.is_final ? "Final assessment" : r.required ? "Required" : "Optional"}</td>
                  <td>{s.total}{s.toReview ? <b className="tag s-pending" style={{ marginLeft: 6 }}>{s.toReview} to review</b> : null}</td>
                  <td><span className={`tag${r.active !== false ? " on" : ""}`}>{r.active !== false ? "Active" : "Inactive"}</span></td>
                  <td className="act">
                    <button className="primary" onClick={() => setReviewing(r)}>Submissions</button>
                    <button onClick={() => setEditing(r)}>Edit</button>
                    <button onClick={() => save({ ...r, active: r.active === false })}>{r.active === false ? "Activate" : "Deactivate"}</button>
                    <button className="danger" onClick={() => remove(r)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!loading && !list.length && <p className="empty">No assignments yet. Select “Add assignment” to create one.</p>}
      {editing && <AssignmentForm row={editing} courses={courses} onSave={save} onClose={() => setEditing(null)} />}
      {reviewing && <Submissions assignment={reviewing} onClose={() => { setReviewing(null); load(); }} say={say} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}

function AssignmentForm({ row, courses, onSave, onClose }: { row: Row; courses: Row[]; onSave: (v: Row) => void; onClose: () => void }) {
  const [v, setV] = useState<Row>({ ...row });
  const [err, setErr] = useState("");
  const set = (k: string, val: unknown) => setV((p) => ({ ...p, [k]: val }));
  const modules: Row[] = courses.find((c) => c.id === v.course_id)?.curriculum ?? [];
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!v.course_id) return setErr("Choose a course.");
    if (!String(v.title).trim()) return setErr("Enter a title.");
    if (!v.allow_text && !v.allow_file) return setErr("Allow a text answer, a file, or both.");
    if (v.is_final && Number(v.pass_marks) > Number(v.max_marks)) return setErr("Pass marks cannot be more than maximum marks.");
    onSave({ ...v, max_marks: Number(v.max_marks) || 0, pass_marks: Number(v.pass_marks) || 0 });
  };
  return (
    <div className="scrim" onClick={onClose}>
      <form className="panel" onClick={(e) => e.stopPropagation()} onSubmit={submit} noValidate>
        <h3>{v.id ? "Edit" : "Add"} assignment</h3>
        <label><span>Course <i>*</i></span>
          <select value={v.course_id} onChange={(e) => { set("course_id", e.target.value); set("module_id", ""); }}>
            <option value="">— Select —</option>
            {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </label>
        <label>Module (optional)
          <select value={v.module_id ?? ""} onChange={(e) => set("module_id", e.target.value)}>
            <option value="">Whole course</option>
            {modules.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
          </select>
        </label>
        <label><span>Title <i>*</i></span><input value={v.title} onChange={(e) => set("title", e.target.value)} /></label>
        <label>Instructions<textarea rows={6} value={v.instructions} onChange={(e) => set("instructions", e.target.value)} /></label>
        <label>Due date<input type="date" value={v.due_date ?? ""} onChange={(e) => set("due_date", e.target.value)} /></label>
        <label>Maximum marks<input type="number" min={0} value={v.max_marks} onChange={(e) => set("max_marks", e.target.value)} /></label>
        <label className="check"><input type="checkbox" checked={!!v.required} onChange={(e) => set("required", e.target.checked)} />Required for the certificate (must be submitted and evaluated)</label>
        <label className="check"><input type="checkbox" checked={!!v.is_final} onChange={(e) => set("is_final", e.target.checked)} />This is the final assessment</label>
        {v.is_final && <label>Pass marks<input type="number" min={0} value={v.pass_marks} onChange={(e) => set("pass_marks", e.target.value)} /><em>Students must score at least this to get the certificate.</em></label>}
        <label className="check"><input type="checkbox" checked={v.allow_text !== false} onChange={(e) => set("allow_text", e.target.checked)} />Students can type an answer</label>
        <label className="check"><input type="checkbox" checked={!!v.allow_file} onChange={(e) => set("allow_file", e.target.checked)} />Students can attach a file</label>
        <label className="check"><input type="checkbox" checked={v.active !== false} onChange={(e) => set("active", e.target.checked)} />Active (visible to students)</label>
        {err && <b className="ferr">{err}</b>}
        <div className="row">
          <button type="button" onClick={onClose}>Cancel</button>
          <button className="primary">Save assignment</button>
        </div>
      </form>
    </div>
  );
}

function Submissions({ assignment, onClose, say }: { assignment: Row; onClose: () => void; say: (m: string, ms?: number) => void }) {
  const [subs, setSubs] = useState<Row[] | null>(null);
  const load = () => listSubmissions({ assignment_id: assignment.id }).then(setSubs).catch((e) => say(e.message, 6000));
  useEffect(() => { load(); }, []);

  return (
    <div className="scrim" onClick={onClose}>
      <section className="panel wide" onClick={(e) => e.stopPropagation()} aria-label="Submissions">
        <h3>Submissions · {assignment.title}</h3>
        <p className="crm-none">Max marks {assignment.max_marks || 0}{assignment.is_final ? ` · pass ${assignment.pass_marks}` : ""}{assignment.due_date ? ` · due ${day(assignment.due_date)}` : ""}</p>
        {!subs && <p className="crm-none">Loading…</p>}
        {subs?.length === 0 && <p className="empty">No submissions yet.</p>}
        {subs?.map((s) => <Evaluate key={s.id} sub={s} max={Number(assignment.max_marks) || 0} onDone={(m) => { say(m); load(); }} onError={(m) => say(m, 6000)} />)}
        <div className="row"><button type="button" onClick={onClose}>Close</button></div>
      </section>
    </div>
  );
}

function Evaluate({ sub, max, onDone, onError }: { sub: Row; max: number; onDone: (m: string) => void; onError: (m: string) => void }) {
  const [marks, setMarks] = useState(sub.marks ?? "");
  const [feedback, setFeedback] = useState(sub.feedback ?? "");
  // A first evaluation is shown to the student by default; later edits keep the current choice.
  const [release, setRelease] = useState(sub.status === "evaluated" ? sub.released === true : true);
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const n = Number(marks);
    if (marks === "" || !Number.isFinite(n) || n < 0 || (max && n > max)) return onError(`Marks must be between 0 and ${max}.`);
    setBusy(true);
    try { await evaluateSubmission(sub.id, { marks: n, feedback, release }); onDone(`Evaluation saved for ${sub.student_name || sub.student_email}`); }
    catch (err) { onError(err instanceof Error ? err.message : "Could not save"); }
    setBusy(false);
  };
  return (
    <form className="lms-sub" onSubmit={submit}>
      <div className="lms-row">
        <b style={{ flex: 1 }}>{sub.student_name || "Student"} <span className="crm-none">· {sub.student_email} · {sub.studentId}</span></b>
        <span className={`tag s-${sub.status}`}>{sub.status}{sub.status === "evaluated" && !sub.released ? " (hidden)" : ""}</span>
        <span className="crm-none">{day(sub.submitted_at)}{sub.late ? " · late" : ""}</span>
      </div>
      {sub.text && <pre>{sub.text}</pre>}
      {sub.file_id && <button type="button" onClick={() => openAdminFile(sub.file_id, sub.file_name).catch((e) => onError(e.message))}>📎 {sub.file_name}</button>}
      <div className="lms-row">
        <input type="number" min={0} max={max || undefined} placeholder={`Marks / ${max}`} value={marks} onChange={(e) => setMarks(e.target.value)} aria-label="Marks" style={{ maxWidth: 140 }} />
        <input placeholder="Feedback for the student" value={feedback} onChange={(e) => setFeedback(e.target.value)} aria-label="Feedback" />
      </div>
      <div className="lms-row">
        <label className="check"><input type="checkbox" checked={release} onChange={(e) => setRelease(e.target.checked)} />Show marks and feedback to the student</label>
        <button className="primary" disabled={busy}>{sub.status === "evaluated" ? "Update evaluation" : "Save evaluation"}</button>
      </div>
    </form>
  );
}
