import { useEffect, useState, FormEvent } from "react";
import { BrowserRouter, NavLink, Navigate, Route, Routes } from "react-router-dom";
import { nav } from "./resources";
import { readSync } from "./store";
import Settings from "./Settings";
import ResourcePage from "./ResourcePage";
import Dashboard from "./Dashboard";
import Enquiries from "./Enquiries";
import WebsiteContent from "./WebsiteContent";
import StudentAccounts from "./StudentAccounts";
import Assignments from "./Assignments";
import Certificates from "./Certificates";

const ID = import.meta.env.VITE_ADMIN_ID ?? "admin@123";
const PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? "admin@123";
const AUTH = "ssc-admin:auth";
const LOCK = "ssc-admin:lock";
const IDLE_MS = 30 * 60 * 1000;

function Login({ onDone }: { onDone: () => void }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [fails, setFails] = useState(0);
  const [error, setError] = useState("");
  const [now, setNow] = useState(Date.now());
  const lockedUntil = Number(localStorage.getItem(LOCK) ?? 0);
  const wait = Math.max(0, Math.ceil((lockedUntil - now) / 1000));

  useEffect(() => {
    if (!wait) return;
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, [wait]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (wait) return;
    if (id.trim() === ID && password === PASSWORD) {
      sessionStorage.setItem(AUTH, "1");
      return onDone();
    }
    const n = fails + 1;
    setFails(n);
    if (n >= 5) {
      localStorage.setItem(LOCK, String(Date.now() + 30000));
      setFails(0); setNow(Date.now());
      setError("Too many attempts. Try again in 30 seconds.");
    } else setError("Login ID or password is incorrect.");
  };

  return (
    <main className="login">
      <section className="hero">
        <div className="plate"><img src="/logo.png" alt="Skill Training Center" /></div>
        <h1>Skill Training Center</h1>
        <p>Admin console for courses, placements, blog and student leads.</p>
        <small>Ramdaspeth, Nagpur · ssinfotech.co</small>
      </section>
      <form onSubmit={submit} autoComplete="off">
        <h2>Sign in</h2>
        <label>Login ID<input required autoFocus value={id} onChange={(e) => setId(e.target.value)} /></label>
        <label>Password
          <span className="pw">
            <input required type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button>
          </span>
        </label>
        {(wait > 0 || error) && <div className="error" role="alert">{wait > 0 ? `Locked. Try again in ${wait}s.` : error}</div>}
        <button className="primary" disabled={wait > 0}>Sign in</button>
      </form>
    </main>
  );
}

export default function App() {
  const [authed, setAuthed] = useState(sessionStorage.getItem(AUTH) === "1");
  const [open, setOpen] = useState(false);
  const signOut = () => { sessionStorage.removeItem(AUTH); setAuthed(false); };

  useEffect(() => {
    if (!authed) return;
    const idle = (Number(readSync("settings")[0]?.idle_minutes) || 30) * 60 * 1000;
    let t = setTimeout(signOut, idle);
    const reset = () => { clearTimeout(t); t = setTimeout(signOut, idle); };
    const evs = ["click", "keydown", "mousemove", "touchstart"];
    evs.forEach((e) => window.addEventListener(e, reset));
    return () => { clearTimeout(t); evs.forEach((e) => window.removeEventListener(e, reset)); };
  }, [authed]);

  if (!authed) return <Login onDone={() => setAuthed(true)} />;

  return (
    <BrowserRouter>
      <div className="shell">
        <aside className={open ? "open" : ""}>
          <div className="brand">
            <span className="plate"><img src="/logo.png" alt="" /></span><b>Skill Training Center</b>
            <button className="burger" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>☰</button>
          </div>
          <nav aria-label="Main">
            {nav.map((n) => <NavLink key={n.to} to={`/${n.to}`} onClick={() => setOpen(false)}>{n.label}</NavLink>)}
          </nav>
          <div className="who"><button onClick={signOut}>Sign out</button></div>
        </aside>
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/enquiries" element={<Enquiries />} />
            <Route path="/website-content" element={<WebsiteContent />} />
            <Route path="/student-accounts" element={<StudentAccounts />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/:name" element={<ResourcePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}