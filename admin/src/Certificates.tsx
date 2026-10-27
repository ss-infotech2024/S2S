// Certificates — issued and awaiting approval. Eligibility is re-checked by the server on approval.
import { useEffect, useMemo, useState } from "react";
import { listRows, approveCertificate, Row } from "./store";

const SITE = (import.meta.env.VITE_WEBSITE_URL as string | undefined)?.replace(/\/$/, "") || "http://localhost:8080";
const day = (v?: string) => (v ? new Date(v).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—");

export default function Certificates() {
  const [rows, setRows] = useState<Row[]>([]);
  const [tab, setTab] = useState<"all" | "pending_approval" | "issued">("all");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const say = (m: string, ms = 4000) => { setToast(m); setTimeout(() => setToast(""), ms); };

  const load = async () => {
    try { setRows(await listRows("certificates")); } catch (e) { say(`Could not load: ${e instanceof Error ? e.message : "server unreachable"}`, 6000); }
    setLoading(false);
  };
  useEffect(() => { document.title = "Certificates · Skill Training Center Admin"; load(); }, []);

  const counts = useMemo(() => ({ all: rows.length, pending_approval: rows.filter((r) => r.status === "pending_approval").length, issued: rows.filter((r) => r.status === "issued").length }), [rows]);
  const n = q.trim().toLowerCase();
  const list = rows.filter((r) => (tab === "all" || r.status === tab) && (!n || [r.certificate_id, r.student_name, r.studentId, r.course_title].join(" ").toLowerCase().includes(n)));

  const approve = async (r: Row) => {
    if (!confirm(`Issue the certificate for ${r.student_name} — ${r.course_title}?`)) return;
    try { await approveCertificate(r.id); say("Certificate issued"); load(); }
    catch (e) { say(e instanceof Error ? e.message : "Could not approve", 6000); }
  };

  return (
    <>
      <header className="bar">
        <h2>Certificates <small>{list.length}</small></h2>
        <input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search certificates" />
      </header>
      <div className="cm-tabs" role="tablist" style={{ marginBottom: 12 }}>
        {(["all", "pending_approval", "issued"] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>
            {t === "all" ? "All" : t === "issued" ? "Issued" : "Awaiting approval"}<b>{counts[t]}</b>
          </button>
        ))}
      </div>
      <div className="scroll">
        <table>
          <thead><tr><th>Certificate ID</th><th>Student</th><th>Course</th><th>Status</th><th>Requested</th><th>Issued</th><th /></tr></thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id}>
                <td>{r.certificate_id}</td>
                <td>{r.student_name} <span className="crm-none">{r.studentId}</span></td>
                <td>{r.course_title}</td>
                <td><span className={`tag s-${r.status}`}>{r.status === "issued" ? "Issued" : "Awaiting approval"}</span></td>
                <td>{day(r.requested_at)}</td>
                <td>{day(r.issued_at)}</td>
                <td className="act">
                  {r.status === "pending_approval" && <button className="primary" onClick={() => approve(r)}>Approve &amp; issue</button>}
                  {r.status === "issued" && <a href={`${SITE}/verify-certificate/${r.certificate_id}`} target="_blank" rel="noreferrer">Verify page</a>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!loading && !list.length && <p className="empty">No certificates yet. They appear when students complete a course and request one.</p>}
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}
