import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Phone, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const inputWrap =
  "relative flex items-center rounded-xl border border-slate-200 bg-white transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10";
const inputCls =
  "w-full bg-transparent py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none";
const iconCls = "pointer-events-none absolute left-4 h-4 w-4 text-slate-400";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">{label}</span>
      {children}
      {error && <span className="block text-xs font-medium text-red-600">{error}</span>}
    </label>
  );
}

function PasswordInput({ value, onChange, placeholder, autoComplete }: any) {
  const [show, setShow] = useState(false);
  return (
    <div className={inputWrap}>
      <Lock className={iconCls} />
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={cn(inputCls, "pr-12")}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 rounded-md p-1 text-slate-400 hover:text-slate-700"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const perks = ["Track your course progress", "Download notes & recordings", "Get placement drive alerts"];

/**
 * Login and Register are both always visible as a two-option tab switch at the top of the form.
 * "Login" shows email + password; "Register" adds name, mobile and confirm password.
 */
export default function AuthPanel({
  onDone, className, defaultMode = "login",
}: { onDone?: () => void; className?: string; defaultMode?: "login" | "register" }) {
  const [isNew, setIsNew] = useState(defaultMode === "register");
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "", confirm: "", remember: true, terms: false });
  const [err, setErr] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const set = (k: string) => (e: any) => setF((s) => ({ ...s, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!emailOk(f.email)) er.email = "Enter a valid email address";
    if (f.password.length < (isNew ? 8 : 6)) er.password = `Password must be at least ${isNew ? 8 : 6} characters`;
    if (isNew) {
      if (f.name.trim().length < 2) er.name = "Please enter your full name";
      if (!/^[6-9]\d{9}$/.test(f.phone.replace(/\D/g, "").slice(-10))) er.phone = "Enter a valid 10-digit mobile number";
      if (f.confirm !== f.password) er.confirm = "Passwords do not match";
      if (!f.terms) er.terms = "Please accept the terms to continue";
    }
    setErr(er);
    if (Object.keys(er).length) return;

    setBusy(true);
    // TODO: replace with real API calls, e.g. POST /api/auth/login or POST /api/auth/register
    await new Promise((r) => setTimeout(r, 800));
    setBusy(false);

    if (isNew) {
      toast.info("Registration received (demo)", { description: "The Student Portal is launching soon. We'll contact you on your mobile when it is live." });
      setIsNew(false); // switch to the Login tab
      setF((s) => ({ ...s, password: "", confirm: "", terms: false }));
    } else {
      toast.info("Student Portal is launching soon", { description: "Login is not connected yet. Please check back shortly." });
      onDone?.();
    }
  }

  return (
    <div className={cn("grid overflow-hidden bg-white md:grid-cols-5", className)}>
      {/* Brand panel */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#25104a] via-[#3a1670] to-[#6d2a9c] p-8 text-white md:col-span-2 md:flex">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-fuchsia-400/20 blur-2xl" />
        <div className="relative">
          <img src="/newlogo.png" alt="Skill Training Center" className="h-16 w-16 rounded-xl bg-white object-contain p-1" />
          <h3 className="mt-6 text-2xl font-extrabold leading-tight">
            {isNew ? "Start your learning journey" : "Welcome back, learner!"}
          </h3>
          <p className="mt-2 text-sm text-white/75">One place for your courses, resources and placement updates.</p>
        </div>
        <ul className="relative mt-8 space-y-3 text-sm">
          {perks.map((p) => (
            <li key={p} className="flex items-center gap-2.5 text-white/90">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-pink-200" /> {p}
            </li>
          ))}
        </ul>
      </aside>

      {/* Unified form */}
      <div className="p-6 sm:p-8 md:col-span-3">
        <h2 className="text-2xl font-extrabold text-slate-900">{isNew ? "Create your account" : "Welcome back"}</h2>
        <p className="mb-5 mt-1 text-sm text-slate-500">
          {isNew ? "Create your Student Portal account in under a minute." : "Sign in to your Student Portal to continue learning."}
        </p>

        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Student Portal is launching soon. Login and registration are not connected yet.
        </div>

        {/* Login / Register switch — both options always visible */}
        <div role="tablist" aria-label="Login or Register" className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
          {([
            { id: "login", label: "Login", active: !isNew },
            { id: "register", label: "Register", active: isNew },
          ] as const).map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`auth-tab-${t.id}`}
              aria-selected={t.active}
              aria-controls="auth-form"
              onClick={() => { setIsNew(t.id === "register"); setErr({}); }}
              className={cn(
                "rounded-lg py-2.5 text-sm font-semibold transition",
                t.active ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-800",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <form id="auth-form" role="tabpanel" aria-labelledby={isNew ? "auth-tab-register" : "auth-tab-login"} onSubmit={submit} className="space-y-4" noValidate>
          <AnimatePresence initial={false}>
            {isNew && (
              <motion.div
                key="new-top"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 overflow-hidden px-0.5 pb-0.5 -mx-0.5"
              >
                <Field label="Full name" error={err.name}>
                  <div className={inputWrap}><User className={iconCls} />
                    <input autoComplete="name" placeholder="Your full name" value={f.name} onChange={set("name")} className={inputCls} />
                  </div>
                </Field>
              </motion.div>
            )}
          </AnimatePresence>

          <Field label="Email" error={err.email}>
            <div className={inputWrap}><Mail className={iconCls} />
              <input type="email" autoComplete="email" placeholder="you@example.com" value={f.email} onChange={set("email")} className={inputCls} />
            </div>
          </Field>

          <AnimatePresence initial={false}>
            {isNew && (
              <motion.div
                key="new-phone"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden px-0.5 pb-0.5 -mx-0.5"
              >
                <Field label="Mobile" error={err.phone}>
                  <div className={inputWrap}><Phone className={iconCls} />
                    <input type="tel" autoComplete="tel" placeholder="98765 43210" value={f.phone} onChange={set("phone")} className={inputCls} />
                  </div>
                </Field>
              </motion.div>
            )}
          </AnimatePresence>

          <Field label="Password" error={err.password}>
            <PasswordInput value={f.password} onChange={set("password")}
              placeholder={isNew ? "Min. 8 characters" : "Enter your password"}
              autoComplete={isNew ? "new-password" : "current-password"} />
          </Field>

          <AnimatePresence initial={false}>
            {isNew && (
              <motion.div
                key="new-confirm"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden px-0.5 pb-0.5 -mx-0.5"
              >
                <Field label="Confirm password" error={err.confirm}>
                  <PasswordInput value={f.confirm} onChange={set("confirm")} placeholder="Repeat password" autoComplete="new-password" />
                </Field>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login-only row / Register-only terms */}
          {!isNew ? (
            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-slate-600">
                <input type="checkbox" checked={f.remember} onChange={(e) => setF({ ...f, remember: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 accent-primary" />
                Remember me
              </label>
              <a
                href="https://wa.me/919399345989?text=Hi%2C%20I%20forgot%20my%20Student%20Portal%20password."
                target="_blank" rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                Forgot password?
              </a>
            </div>
          ) : (
            <div>
              <label className="flex cursor-pointer items-start gap-2 text-xs text-slate-600">
                <input type="checkbox" checked={f.terms} onChange={(e) => setF({ ...f, terms: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-primary" />
                I agree to the Terms of Use and Privacy Policy.
              </label>
              {err.terms && <span className="mt-1 block text-xs font-medium text-red-600">{err.terms}</span>}
            </div>
          )}

          <button type="submit" disabled={busy}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-indigo-600 font-semibold text-white shadow-lg shadow-primary/25 transition hover:shadow-xl hover:brightness-110 disabled:opacity-60">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {busy ? (isNew ? "Creating account..." : "Signing in...") : isNew ? "Create Account" : "Sign In"}
          </button>

          <p className="text-center text-sm text-slate-500">
            {isNew ? "Already have an account?" : "New to Skill Training Center?"}{" "}
            <button type="button" onClick={() => { setIsNew(!isNew); setErr({}); }} className="font-semibold text-primary hover:underline">
              {isNew ? "Login" : "Register"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
