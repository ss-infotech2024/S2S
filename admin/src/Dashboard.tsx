import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { resources } from "./resources";
import { listRows, Row } from "./store";
import { Sparkline, TrendChart } from "./charts";

const MS = 864e5;
const ICON: Record<string, string> = {
  book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14zM20 17v4H6.5A2.5 2.5 0 0 1 4 18.5",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  inbox: "M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
  chevron: "M9 18l6-6-6-6",
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z",
  check: "M20 6 9 17l-5-5",
};
const Icon = ({ n, size = 18 }: { n: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={ICON[n]} /></svg>
);

const ago = (iso: string) => {
  const m = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (m < 60) return `${m} min ago`;
  if (m < 1440) return `${Math.round(m / 60)} hr ago`;
  if (m < 43200) return `${Math.round(m / 1440)} d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};
const today0 = () => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); };
const parseDay = (s?: string) => (s ? new Date(s.length <= 10 ? `${s}T00:00:00` : s) : null);
const daysTo = (s?: string) => { const d = parseDay(s); return d && !isNaN(+d) ? Math.round((+d - +today0()) / MS) : null; };
const short = (s?: string) => { const d = parseDay(s); return d && !isNaN(+d) ? d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"; };
const when = (n: number | null) => n === null ? "Date not set" : n === 0 ? "Today" : n === 1 ? "Tomorrow" : n > 1 ? `in ${n} days` : `${-n} d overdue`;
const plural = (n: number, a: string, b = a + "s") => `${n} ${n === 1 ? a : b}`;
const initials = (s = "") => s.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?";
const HUES = ["#0052bd", "#6d28d9", "#0e7490", "#b45309", "#be185d", "#15803d"];
const hue = (s = "") => HUES[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % HUES.length];

const ACTIONS = [
  { to: "/students?new=1", label: "Add student" },
  { to: "/courses?new=1", label: "Add course" },
  { to: "/classroom-training?new=1", label: "New classroom batch" },
  { to: "/online-training?new=1", label: "New online batch" },
  { to: "/placements?new=1", label: "Add placement" },
  { to: "/blog?new=1", label: "Write blog post" },
  { to: "/testimonials?new=1", label: "Add testimonial" },
  { to: "/corporate-training?new=1", label: "Corporate program" },
];

/** Number of rows created in each of the last `n` months (oldest → newest, current month last). */
const monthly = (rows: Row[], n: number) => {
  const now = new Date(), base = now.getFullYear() * 12 + now.getMonth();
  const out: number[] = Array(n).fill(0);
  rows.forEach((r) => {
    const d = new Date(r.created_at), i = n - 1 - (base - (d.getFullYear() * 12 + d.getMonth()));
    if (i >= 0 && i < n) out[i]++;
  });
  return out;
};
const monthLabels = (n: number) => {
  const now = new Date();
  const ds = Array.from({ length: n }, (_, i) => new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1));
  return {
    labels: ds.map((d) => d.toLocaleDateString("en-IN", { month: "short" })),
    tips: ds.map((d) => d.toLocaleDateString("en-IN", { month: "long", year: "numeric" })),
  };
};
const delta = (s: number[]) => {
  const cur = s[s.length - 1], prev = s[s.length - 2] ?? 0;
  if (!prev) return cur ? { t: "New", up: true } : null;
  const p = Math.round(((cur - prev) / prev) * 100);
  return { t: `${p > 0 ? "+" : ""}${p}%`, up: p >= 0 };
};

type Task = { to: string; n: number; text: string; hint?: string; hot?: boolean };

export default function Dashboard() {
  const [d, setD] = useState<Record<string, Row[]> | null>(null);
  const [err, setErr] = useState(false);
  const [range, setRange] = useState<6 | 12>(12);
  const [mode, setMode] = useState<"all" | "online" | "classroom">("all");

  const load = () => {
    setErr(false);
    Promise.all(Object.values(resources).map(async (r) => [r.table, await listRows(r.table)] as const))
      .then((e) => setD(Object.fromEntries(e)), () => setErr(true));
  };
  useEffect(() => { document.title = "Dashboard · Skill Training Center Admin"; load(); }, []);

  if (err) return <div className="error" role="alert">Could not load data. <button onClick={load}>Retry</button></div>;
  if (!d) return null;

  const rows = (t: string) => d[t] ?? [];
  const live = (t: string) => rows(t).filter((r) => r.published).length;
  const n = (t: string, s: string) => rows(t).filter((r) => r.status === s).length;
  const isActive = (r: Row) => ["upcoming", "ongoing"].includes(r.status);

  /* ---------- data ---------- */
  const booked = (r: Row) => Number(r.seats_filled || 0) + rows("enrollments").filter((e) => e.batch_id === r.id && e.status !== "cancelled").length;
  const online: Row[] = rows("online_training").map((r) => ({ ...r, seats_filled: booked(r), _mode: "Online", _to: "/online-training" }));
  const classroom: Row[] = rows("classroom_training").map((r) => ({ ...r, seats_filled: booked(r), _mode: "Classroom", _to: "/classroom-training" }));
  const batches: Row[] = [...online, ...classroom];
  const upcoming = batches.filter((b) => b.status === "upcoming").length;
  const ongoing = batches.filter((b) => b.status === "ongoing").length;
  const done = batches.length - upcoming - ongoing;

  const leads = ([
    ...rows("enquiries").map((r) => ({ ...r, _kind: "Contact", _to: "/enquiries", _who: r.name, _what: r.message })),
    ...rows("corp_enquiries").map((r) => ({ ...r, _kind: "Corporate", _to: "/corporate-training", _who: r.company, _what: r.message || r.program })),
    ...rows("overseas_enquiries").map((r) => ({ ...r, _kind: "Overseas", _to: "/overseas", _who: r.name, _what: r.message || [r.interest, r.country].filter(Boolean).join(" · ") })),
  ] as Row[]).sort((a, b) => b.created_at.localeCompare(a.created_at));
  const newLeads = leads.filter((r) => r.status === "new");
  const students = rows("enrollments");
  const recentStudents = students.slice(0, 6);

  const sEnq = monthly(leads, 12), sEnr = monthly(students, 12);
  const enq6 = sEnq.slice(-6), enr6 = sEnr.slice(-6);
  const dEnq = delta(sEnq), dEnr = delta(sEnr);
  const { labels, tips } = monthLabels(range);
  const cEnq = sEnq.slice(-range), cEnr = sEnr.slice(-range);
  const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);

  const upcomingList = batches
    .filter((b) => b.status === "upcoming" && (mode === "all" || b._mode.toLowerCase() === mode))
    .sort((a, b) => (a.start_date || "9999").localeCompare(b.start_date || "9999"))
    .slice(0, 6);

  const by: Record<string, number> = {};
  students.forEach((r) => { if (r.course) by[r.course] = (by[r.course] || 0) + 1; });
  const top = Object.entries(by).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const max = top[0]?.[1] || 1;

  /* ---------- pending tasks (derived, so they clear themselves once fixed) ---------- */
  const open = batches.filter(isActive);
  const noTrainer = open.filter((b) => !b.trainer);
  const overdueStart = batches.filter((b) => b.status === "upcoming" && (daysTo(b.start_date) ?? 0) < 0);
  const lowFill = classroom.filter((b) => b.status === "upcoming" && Number(b.seats) > 0 && (daysTo(b.start_date) ?? 99) <= 14 && (daysTo(b.start_date) ?? 0) >= 0 && Number(b.seats_filled || 0) / Number(b.seats) < 0.5);
  const noLink = online.filter((b) => isActive(b) && (daysTo(b.start_date) ?? 0) <= 7 && !b.meeting_link);
  const staleLeads = newLeads.filter((r) => Date.now() - +new Date(r.created_at) > 2 * MS);
  const jobsDue = rows("jobs").filter((j) => j.status === "open" && j.last_date && (daysTo(j.last_date) ?? 99) <= 7);
  const drafts = (t: string) => rows(t).length - live(t);
  const tasks: Task[] = ([
    { to: "/enquiries", n: newLeads.length, text: `Follow up on ${plural(newLeads.length, "new enquiry", "new enquiries")}`, hint: staleLeads.length ? `${staleLeads.length} waiting for more than 2 days` : undefined, hot: staleLeads.length > 0 },
    { to: "/students", n: n("enrollments", "pending"), text: `Confirm ${plural(n("enrollments", "pending"), "pending registration")}` },
    { to: overdueStart[0]?._to ?? "/classroom-training", n: overdueStart.length, text: `Update ${plural(overdueStart.length, "batch", "batches")} past start date`, hint: overdueStart[0]?.batch_name, hot: true },
    { to: noTrainer[0]?._to ?? "/classroom-training", n: noTrainer.length, text: `Assign a trainer to ${plural(noTrainer.length, "batch", "batches")}`, hint: noTrainer.slice(0, 2).map((b) => b.batch_name).join(", ") },
    { to: "/classroom-training", n: lowFill.length, text: `Promote ${plural(lowFill.length, "batch", "batches")} starting soon with low enrolment`, hint: lowFill[0] && `${lowFill[0].batch_name}: ${lowFill[0].seats_filled || 0}/${lowFill[0].seats} filled` },
    { to: "/online-training", n: noLink.length, text: `Add meeting link for ${plural(noLink.length, "online batch", "online batches")}`, hint: noLink[0]?.batch_name },
    { to: "/testimonials", n: n("testimonials", "pending"), text: `Approve ${plural(n("testimonials", "pending"), "student review")}` },
    { to: "/placements", n: jobsDue.length, text: `${plural(jobsDue.length, "job opening")} closing within a week`, hint: jobsDue[0]?.title },
    { to: "/courses", n: drafts("courses"), text: `Publish or finish ${plural(drafts("courses"), "draft course")}` },
    { to: "/blog", n: drafts("posts"), text: `${plural(drafts("posts"), "blog draft")} not published` },
  ] as Task[]).filter((t) => t.n > 0).sort((a, b) => +!!b.hot - +!!a.hot);

  const cards = [
    { to: "/courses", icon: "book", label: "Courses", big: rows("courses").length, c: "#4f46e5", d: null as ReturnType<typeof delta>, sub: `${live("courses")} live · ${drafts("courses")} drafts`,
      vis: <Segs parts={[[live("courses"), "#4f46e5"], [drafts("courses"), "#cbd5e1"]]} /> },
    { to: "/students", icon: "users", label: "Students", big: students.length, c: "#0052bd", d: dEnr, sub: `${sEnr[11]} this month · ${n("enrollments", "pending")} pending`, vis: <Sparkline values={enr6} color="#0052bd" /> },
    { to: "/classroom-training", icon: "calendar", label: "Batches", big: batches.length, c: "#0e7490", d: null as ReturnType<typeof delta>, sub: `${upcoming} upcoming · ${ongoing} ongoing`,
      vis: <Segs parts={[[upcoming, "#0052bd"], [ongoing, "#16a34a"], [done, "#cbd5e1"]]} /> },
    { to: "/enquiries", icon: "inbox", label: "Enquiries", big: leads.length, c: "#6d28d9", d: dEnq, sub: `${newLeads.length} new · ${sEnq[11]} this month`, vis: <Sparkline values={enq6} color="#6d28d9" /> },
  ];

  const chips = [
    { to: "/online-training", label: "Online batches", v: online.filter(isActive).length },
    { to: "/classroom-training", label: "Classroom batches", v: classroom.filter(isActive).length },
    { to: "/classroom-training", label: "Classroom seats left", v: classroom.filter(isActive).reduce((a, r) => a + Math.max(0, Number(r.seats || 0) - Number(r.seats_filled || 0)), 0) },
    { to: "/colleges-gallery", label: "Colleges", v: live("colleges") },
    { to: "/colleges-gallery", label: "Gallery photos", v: live("gallery") },
    { to: "/placements", label: "Open jobs", v: n("jobs", "open") },
    { to: "/placements", label: "Hiring partners", v: live("placement_companies") },
    { to: "/corporate-training", label: "Corporate programs", v: live("corporate_programs") },
    { to: "/overseas", label: "Overseas programs", v: live("overseas_courses") },
  ];

  const todayLabel = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <>
      <header className="bar"><h2>Dashboard<small>{todayLabel}</small></h2></header>

      <div className="kpis">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="kpi" style={{ ["--c" as string]: c.c }}>
            <span className="kpi-top">
              <span className="kpi-ico"><Icon n={c.icon} /></span>
              <span className="kpi-lbl">{c.label}</span>
              {c.d && <span className={`delta ${c.d.up ? "up" : "down"}`} title="vs last month">{c.d.t}</span>}
            </span>
            <strong>{c.big}</strong>
            <small>{c.sub}</small>
            <span className="kpi-vis">{c.vis}</span>
          </Link>
        ))}
      </div>

      <div className="grid2">
        <section className="panel2">
          <div className="ph">
            <h3>Enquiries &amp; enrollments</h3>
            <div className="segbtn" role="group" aria-label="Chart range">
              {([6, 12] as const).map((v) => <button key={v} className={range === v ? "on" : ""} aria-pressed={range === v} onClick={() => setRange(v)}>{v} months</button>)}
            </div>
          </div>
          <div className="legend">
            <span><i style={{ background: "#6d28d9" }} />Enquiries <b>{sum(cEnq)}</b></span>
            <span><i style={{ background: "#0052bd" }} />Enrollments <b>{sum(cEnr)}</b></span>
            {sum(cEnq) > 0 && <span className="muted">{Math.round((sum(cEnr) / sum(cEnq)) * 100)} enrollments per 100 enquiries</span>}
          </div>
          <TrendChart height={300} labels={labels} tips={tips} series={[
            { name: "Enquiries", color: "#6d28d9", values: cEnq, area: true },
            { name: "Enrollments", color: "#0052bd", values: cEnr, area: true },
          ]} />
        </section>

        <section className="panel2">
          <div className="ph"><h3>Pending tasks</h3>{tasks.length > 0 && <span className="count">{tasks.length}</span>}</div>
          {tasks.length ? (
            <ul className="tasks">
              {tasks.slice(0, 7).map((t) => (
                <li key={t.text}>
                  <Link to={t.to} className={t.hot ? "hot" : ""}>
                    <b className="tn">{t.n}</b>
                    <span className="tt">{t.text}{t.hint && <em>{t.hint}</em>}</span>
                    <Icon n="chevron" size={16} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : <p className="allgood"><Icon n="check" size={20} /> All caught up. Nothing needs attention.</p>}
        </section>
      </div>

      <div className="grid3">
        <section className="panel2">
          <div className="ph"><h3>New enquiries</h3>{newLeads.length > 0 && <span className="count">{newLeads.length}</span>}<Link to="/enquiries" className="all">View all</Link></div>
          {newLeads.length ? (
            <ul className="list">
              {newLeads.slice(0, 6).map((r) => (
                <li key={r._kind + r.id}>
                  <span className="av" style={{ background: hue(r._who) }} aria-hidden>{initials(r._who)}</span>
                  <span className="what">
                    <Link to={r._to}><b>{r._who}</b></Link>
                    {r._what && <em>{r._what}</em>}
                  </span>
                  <span className="meta"><span className="kindtag">{r._kind}</span><time>{ago(r.created_at)}</time></span>
                  {r.phone && <a className="call" href={`tel:${r.phone}`} aria-label={`Call ${r._who}`}><Icon n="phone" size={15} /></a>}
                </li>
              ))}
            </ul>
          ) : <p className="empty">No new enquiries. New leads from the website appear here.</p>}
        </section>

        <section className="panel2">
          <div className="ph"><h3>Recent registrations</h3><Link to="/students" className="all">View all</Link></div>
          {recentStudents.length ? (
            <ul className="list">
              {recentStudents.map((r) => (
                <li key={r.id}>
                  <span className="av" style={{ background: hue(r.name) }} aria-hidden>{initials(r.name)}</span>
                  <span className="what">
                    <Link to="/students"><b>{r.name}</b></Link>
                    <em>{[r.course, r.mode].filter(Boolean).join(" · ") || r.enrollment_id}</em>
                  </span>
                  <span className="meta">{r.status && <span className={`tag s-${r.status}`}>{r.status}</span>}<time>{ago(r.created_at)}</time></span>
                </li>
              ))}
            </ul>
          ) : <p className="empty">No registrations yet.</p>}
        </section>
      </div>

      <div className="grid2 b">
        <section className="panel2">
          <div className="ph">
            <h3>Upcoming batches</h3>
            <div className="segbtn" role="group" aria-label="Batch mode">
              {(["all", "online", "classroom"] as const).map((v) => <button key={v} className={mode === v ? "on" : ""} aria-pressed={mode === v} onClick={() => setMode(v)}>{v[0].toUpperCase() + v.slice(1)}</button>)}
            </div>
          </div>
          {upcomingList.length ? (
            <ul className="batches">
              {upcomingList.map((b) => {
                const dd = daysTo(b.start_date), left = Math.max(0, Number(b.seats || 0) - Number(b.seats_filled || 0));
                const pct = b._mode === "Classroom" && Number(b.seats) ? Math.min(100, (Number(b.seats_filled || 0) / Number(b.seats)) * 100) : 0;
                return (
                  <li key={b._mode + b.id}>
                    <div className="bwhen"><b>{short(b.start_date)}</b><span className={dd !== null && dd < 0 ? "late" : ""}>{when(dd)}</span></div>
                    <div className="binfo">
                      <Link to={b._to}><b>{b.batch_name}</b></Link>
                      <em>{[b.course, b.timing, b.trainer || "No trainer yet"].filter(Boolean).join(" · ")}</em>
                    </div>
                    <span className={`modetag ${b._mode.toLowerCase()}`}>{b._mode}</span>
                    <div className="bseats">
                      {b._mode === "Classroom" ? (
                        <>
                          <span>{left} seats left</span>
                          <i className="meter"><i style={{ width: `${pct}%` }} /></i>
                        </>
                      ) : <span>{b.seats ? `${b.seats} seats` : "—"}</span>}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : <p className="empty">No upcoming {mode === "all" ? "" : mode + " "}batches. <Link to={mode === "online" ? "/online-training?new=1" : "/classroom-training?new=1"}>Add one</Link>.</p>}
        </section>

        <div className="stack">
          <section className="panel2">
            <div className="ph"><h3>Students by course</h3></div>
            {top.length ? (
              <div className="bars flat">
                {top.map(([k, c]) => <div key={k}><span>{k}</span><i style={{ width: `${(c / max) * 100}%` }} /><b>{c}</b></div>)}
              </div>
            ) : <p className="empty">No students with a course yet.</p>}
          </section>
          <section className="panel2">
            <div className="ph"><h3>Quick actions</h3></div>
            <div className="quick">
              {ACTIONS.map((a) => <Link key={a.to} to={a.to}>+ {a.label}</Link>)}
            </div>
          </section>
        </div>
      </div>

      <h3 className="sec">At a glance</h3>
      <div className="chips">
        {chips.map((c) => <Link key={c.label} to={c.to}><b>{c.v}</b> {c.label}</Link>)}
      </div>
    </>
  );
}

function Segs({ parts }: { parts: [number, string][] }) {
  const total = parts.reduce((a, [v]) => a + v, 0) || 1;
  return (
    <span className="segs" aria-hidden>
      {parts.filter(([v]) => v > 0).map(([v, c], i) => <i key={i} style={{ flex: v / total, background: c }} />)}
    </span>
  );
}