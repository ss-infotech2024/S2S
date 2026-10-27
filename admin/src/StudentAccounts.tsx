// Student accounts — who can log in to the student LMS, and which courses each one can open.
import { useEffect, useMemo, useState } from "react";
import { listRows, listStudentAccounts, assignStudentCourses, resendStudentSetup, Row } from "./store";

const dateText = (v: string) => new Date(v).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function StudentAccounts() {
  const [rows, setRows] = useState<Row[]>([]);
  const [courses, setCourses] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);
  const [toast, setToast] = useState("");
  const say = (m: string, ms = 3000) => { setToast(m); setTimeout(() => setToast(""), ms); };

  const load = async () => {
    try {
      const [s, c] = await Promise.all([listStudentAccounts(), listRows("courses")]);
      setRows(s); setCourses(c);
    } catch (e) { say(`Could not load: ${e instanceof Error ? e.message : "server unreachable"}`, 6000); }
    setLoading(false);
  };
  useEffect(() => { document.title = "Student Accounts · Skill Training Center Admin"; load(); }, []);

  const titles = useMemo(() => new Map(courses.map((c) => [c.id, c.title])), [courses]);
  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return rows.filter((r) => !n || [r.studentId, r.name, r.email, r.phone, r.course].join(" ").toLowerCase().includes(n));
  }, [rows, q]);

  const save = async (r: Row, ids: string[]) => {
    try { await assignStudentCourses(r.studentId, ids); } catch (e) { return say(`Could not save: ${e instanceof Error ? e.message : "server unreachable"}`, 6000); }
    setEditing(null); say(`Courses updated for ${r.name || r.email}`); load();
  };
  const resend = async (r: Row) => {
    if (!confirm(`Resend password setup email to ${r.email || r.name}?`)) return;
    try { const res = await resendStudentSetup(r.studentId); say(res.message || "Password setup email sent.", 6000); }
    catch (e) { say(`Resend failed: ${e instanceof Error ? e.message : "server unreachable"}`, 6000); }
  };

  return (
    <>
      <header className="bar">
        <h2>Student Accounts <small>{list.length}</small></h2>
        <input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search student accounts" />
      </header>
      <p className="crm-none">Students only see the courses assigned here on their dashboard. Approving an enrollment creates the account but does not assign courses.</p>
      <div className="scroll">
        <table>
          <thead>
            <tr><th>Student ID</th><th>Name</th><th>Email</th><th>Status</th><th>Assigned courses</th><th>Created</th><th /></tr>
          </thead>
          <tbody>
            {list.map((r) => {
              const assigned: string[] = r.assignedCourseIds ?? [];
              return (
                <tr key={r.studentId}>
                  <td>{r.studentId}</td>
                  <td>{r.name}</td>
                  <td>{r.email}</td>
                  <td><span className={`tag ${r.status === "active" ? "on" : "s-pending"}`}>{r.status === "pending_setup" ? "password not set" : r.status}</span></td>
                  <td>{assigned.length ? assigned.map((id) => titles.get(id) ?? "(deleted course)").join(", ") : <span className="crm-none">None</span>}</td>
                  <td>{r.created_at ? dateText(r.created_at) : ""}</td>
                  <td className="act">
                    {r.status === "pending_setup" && <button onClick={() => resend(r)}>Resend Setup Link</button>}
                    <button className="primary" onClick={() => setEditing(r)}>Assign courses</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!loading && !list.length && <p className="empty">{q ? "Nothing matches your search." : "No student accounts yet. They are created when students register or an enrollment is approved."}</p>}
      {editing && <AssignForm student={editing} courses={courses} onSave={(ids) => save(editing, ids)} onClose={() => setEditing(null)} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}

function AssignForm({ student, courses, onSave, onClose }: { student: Row; courses: Row[]; onSave: (ids: string[]) => void; onClose: () => void }) {
  const [picked, setPicked] = useState<Set<string>>(() => new Set(student.assignedCourseIds ?? []));
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);
  const toggle = (id: string) => setPicked((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const sorted = [...courses].sort((a, b) => String(a.title).localeCompare(String(b.title)));

  return (
    <div className="scrim" onClick={onClose}>
      <form className="panel" onClick={(e) => e.stopPropagation()} onSubmit={async (e) => {
        e.preventDefault(); setBusy(true);
        // keep previously assigned order, then append newly ticked courses
        const before: string[] = (student.assignedCourseIds ?? []).filter((id: string) => picked.has(id));
        await onSave([...before, ...sorted.map((c) => c.id).filter((id) => picked.has(id) && !before.includes(id))]);
        setBusy(false);
      }}>
        <h3>Assign courses</h3>
        <p className="crm-none">{student.name} · {student.studentId} · {student.email}</p>
        {sorted.map((c) => (
          <label key={c.id} className="check">
            <input type="checkbox" checked={picked.has(c.id)} onChange={() => toggle(c.id)} />
            <span>{c.title}{!c.published && <small className="crm-none"> (draft)</small>}</span>
          </label>
        ))}
        {!sorted.length && <p className="empty">No courses yet. Add courses first.</p>}
        <div className="row">
          <button type="button" onClick={onClose}>Cancel</button>
          <button className="primary" disabled={busy}>Save ({picked.size})</button>
        </div>
      </form>
    </div>
  );
}
