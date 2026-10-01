import usePageMeta from "@/hooks/use-page-meta";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2, Users, BarChart3, Clock, Trophy, CheckCircle2, ArrowRight, Phone, MessageCircle,
  MapPin, Send, Loader2, Target, Rocket, ClipboardCheck, Cpu, Cloud, Code2, Database,
} from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/site/Layout";
import SectionHeading from "@/components/site/SectionHeading";

const WHATSAPP = "919399345989";

const metrics = [
  { value: "200+", label: "Corporate Clients", icon: Building2 },
  { value: "15,000+", label: "Professionals Trained", icon: Users },
  { value: "95%", label: "Satisfaction Rate", icon: BarChart3 },
  { value: "50%", label: "Productivity Boost", icon: Trophy },
];

const features = [
  { icon: Target, title: "Customized Curriculum", description: "Learning paths aligned with your business objectives and technology stack.", benefits: ["Industry-specific content", "Real-world projects", "Custom assessments"] },
  { icon: Users, title: "Team Upskilling", description: "Transform your workforce with in-demand AI and technology skills.", benefits: ["Group learning", "Team projects", "Progress tracking"] },
  { icon: BarChart3, title: "Performance Analytics", description: "Clear reporting on team progress and skill development.", benefits: ["Skill gap analysis", "Progress reports", "ROI measurement"] },
  { icon: Clock, title: "Flexible Delivery", description: "On-site, remote or hybrid delivery to suit your team's workflow.", benefits: ["Recorded sessions", "Flexible timings", "Weekend batches"] },
];

const domains = [
  { icon: Cpu, title: "AI & Machine Learning", description: "Build practical AI capability across your teams.", tech: ["TensorFlow", "PyTorch", "MLOps", "Computer Vision"] },
  { icon: Cloud, title: "Cloud & DevOps", description: "Master cloud infrastructure and deployment practices.", tech: ["AWS", "Azure", "Docker", "Kubernetes"] },
  { icon: Code2, title: "Full Stack Development", description: "End-to-end web and application development expertise.", tech: ["React", "Node.js", "Python", "MongoDB"] },
  { icon: Database, title: "Data Science & Analytics", description: "Turn data into confident business decisions.", tech: ["Python", "SQL", "Tableau", "Big Data"] },
];

const process = [
  { icon: MessageCircle, title: "Discovery", text: "We understand your goals, team level and timelines." },
  { icon: ClipboardCheck, title: "Custom Plan", text: "A tailored curriculum and proposal for your team." },
  { icon: Rocket, title: "Delivery", text: "Trainer-led sessions with hands-on labs and projects." },
  { icon: BarChart3, title: "Assess & Report", text: "Assessments and reports that show measurable progress." },
];

const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10";

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, delay: i * 0.08 },
});

export default function CorporateTraining() {
  usePageMeta("Corporate Training", "Customized AI, cloud, data and software training programs for your team, delivered on-site or online.");
  const empty = { company: "", contact: "", email: "", phone: "", employees: "", message: "" };
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const text = `Corporate Training Enquiry\n\nCompany: ${form.company}\nContact: ${form.contact}\nEmail: ${form.email}\nPhone: ${form.phone}\nEmployees to train: ${form.employees}\nDetails: ${form.message}\n\nSent via Skill Training Center website`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank");
    setForm(empty);
    setBusy(false);
    toast.success("Your enquiry is ready in WhatsApp", { description: "Press send there to confirm." });
  }

  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-sky-50">
        <div className="pointer-events-none absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-violet-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-10 h-[380px] w-[380px] rounded-full bg-sky-300/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-fuchsia-200/30 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.5]" style={{ backgroundImage: "radial-gradient(rgba(99,102,241,.22) 1px, transparent 1px)", backgroundSize: "28px 28px", maskImage: "linear-gradient(to bottom, black 40%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent)" }} />
        <div className="container relative grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-700 shadow-sm backdrop-blur">
              <Building2 className="h-3.5 w-3.5" /> Corporate Training
            </span>
            <h1 className="mt-5 text-2xl font-bold leading-tight tracking-tight text-slate-900 md:text-3xl lg:text-4xl">
              Upskill your workforce with{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">enterprise-grade</span> training
            </h1>
            <p className="mt-4 max-w-xl text-base text-slate-600">
              Customized programs in AI, cloud, data and software development — delivered on-site or online by industry practitioners.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#enquire" className="inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:-translate-y-0.5 hover:shadow-xl">
                Request a Proposal <ArrowRight className="h-4 w-4" />
              </a>
              <a href="tel:+919399345989" className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-5 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur transition hover:bg-white hover:shadow-md">
                <Phone className="h-4 w-4 text-primary" /> +91 93993 45989
              </a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
            className="grid grid-cols-2 gap-3">
            {metrics.map((m, i) => (
              <div key={m.label} className={`rounded-xl border border-white bg-white/70 p-4 shadow-[0_10px_40px_-15px_rgba(79,70,229,0.3)] ring-1 ring-violet-100 backdrop-blur-md ${i % 2 ? "translate-y-3" : ""}`}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 text-white">
                  <m.icon className="h-4 w-4" />
                </div>
                <div className="mt-3 text-xl font-bold text-slate-900">{m.value}</div>
                <div className="text-xs text-slate-600">{m.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SOLUTIONS */}
      <section className="bg-gradient-to-b from-sky-50/70 via-white to-white py-14">
        <div className="container">
          <SectionHeading compact eyebrow="Why Us" title="Built for enterprise outcomes" subtitle="Everything your L&D team needs to plan, deliver and measure training." />
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((f, i) => (
              <motion.div key={f.title} {...fadeUp(i)}
                className="group rounded-xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{f.title}</h3>
                    <p className="mt-1 text-xs text-slate-600 sm:text-sm">{f.description}</p>
                    <ul className="mt-3 grid gap-1 sm:grid-cols-2">
                      {f.benefits.map((b) => (
                        <li key={b} className="flex items-center gap-2 text-xs text-slate-700 sm:text-sm">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" /> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DOMAINS */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-violet-50/70 to-white py-14">
        <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="container relative">
          <SectionHeading compact eyebrow="Domains" title="Training tracks" subtitle="Modern technologies and methodologies, taught hands-on." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {domains.map((d, i) => (
              <motion.div key={d.title} {...fadeUp(i)}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <d.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-3 text-sm font-bold text-slate-900">{d.title}</h3>
                <p className="mt-1 text-xs text-slate-600">{d.description}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {d.tech.map((t) => (
                    <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">{t}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-white py-14">
        <div className="container">
          <SectionHeading compact eyebrow="How It Works" title="From first call to measurable results" />
          <div className="relative grid gap-5 md:grid-cols-4">
            <div className="absolute left-[12%] right-[12%] top-6 hidden h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent md:block" />
            {process.map((p, i) => (
              <motion.div key={p.title} {...fadeUp(i)} className="relative text-center">
                <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg ring-8 ring-white">
                  <p.icon className="h-5 w-5" />
                </div>
                <div className="mt-3 text-[11px] font-bold uppercase tracking-widest text-primary">Step {i + 1}</div>
                <h3 className="mt-1 text-sm font-bold text-slate-900">{p.title}</h3>
                <p className="mx-auto mt-1 max-w-[200px] text-xs text-slate-600">{p.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ENQUIRY */}
      <section id="enquire" className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-violet-50 to-sky-50 py-14">
        <div className="pointer-events-none absolute -left-20 top-0 h-80 w-80 rounded-full bg-violet-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl" />
        <div className="container relative">
          <SectionHeading compact eyebrow="Get Started" title="Request a corporate program" subtitle="Tell us about your team and we'll come back with a customized proposal." />
          <div className="mx-auto grid max-w-4xl overflow-hidden rounded-2xl bg-white text-slate-900 shadow-[0_30px_80px_-30px_rgba(79,70,229,0.4)] ring-1 ring-violet-100 lg:grid-cols-5">
            <aside className="bg-gradient-to-br from-[#25104a] via-[#3a1670] to-[#6d2a9c] p-6 text-white lg:col-span-2">
              <h3 className="text-lg font-bold">Talk to our training consultants</h3>
              <p className="mt-2 text-sm text-blue-100">We'll help you scope the right program for your goals, team size and timeline.</p>
              <ul className="mt-6 space-y-4 text-sm">
                <li className="flex gap-3"><Phone className="mt-0.5 h-5 w-5 shrink-0 text-blue-200" /><div><div className="font-semibold">Call us</div><a href="tel:+919399345989" className="text-blue-100 hover:underline">+91 93993 45989</a><br /><a href="tel:+918446691425" className="text-blue-100 hover:underline">+91 84466 91425</a></div></li>
                <li className="flex gap-3"><MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-200" /><div><div className="font-semibold">WhatsApp</div><a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="text-blue-100 hover:underline">Chat with us</a></div></li>
                <li className="flex gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue-200" /><div><div className="font-semibold">Visit</div><span className="text-blue-100">Ramdaspeth, Nagpur-440010</span></div></li>
                <li className="flex gap-3"><Clock className="mt-0.5 h-5 w-5 shrink-0 text-blue-200" /><div><div className="font-semibold">Response time</div><span className="text-blue-100">Within 24 hours</span></div></li>
              </ul>
            </aside>
            <form onSubmit={submit} className="grid gap-3 p-5 sm:p-6 lg:col-span-3">
              <div className="grid gap-4 sm:grid-cols-2">
                <input className={inputCls} placeholder="Company name" value={form.company} onChange={set("company")} required />
                <input className={inputCls} placeholder="Contact person" value={form.contact} onChange={set("contact")} required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input className={inputCls} type="email" placeholder="Work email" value={form.email} onChange={set("email")} required />
                <input className={inputCls} type="tel" placeholder="Phone number" value={form.phone} onChange={set("phone")} required />
              </div>
              <input className={inputCls} placeholder="Number of employees to train" value={form.employees} onChange={set("employees")} required />
              <textarea className={`${inputCls} min-h-[96px] resize-none`} placeholder="Training requirements, goals and timeline" value={form.message} onChange={set("message")} required />
              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="submit" disabled={busy}
                  className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg text-sm bg-gradient-to-r from-primary to-indigo-600 font-semibold text-white shadow-lg shadow-primary/25 transition hover:brightness-110 disabled:opacity-60">
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send via WhatsApp
                </button>
                <button type="button" onClick={() => setForm(empty)}
                  className="h-10 rounded-lg border border-slate-200 px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
