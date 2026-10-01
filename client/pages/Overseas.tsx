import usePageMeta from "@/hooks/use-page-meta";
// pages/Overseas.tsx
import { motion } from "framer-motion";
import {
  Globe2, Users, Clock, BadgeCheck, Briefcase, Play, ArrowRight, Sparkles, Gamepad2,
  MessageCircle, CheckCircle2, ClipboardList, Mic2, Award, BookOpen,
} from "lucide-react";
import Layout from "@/components/site/Layout";
import SectionHeading from "@/components/site/SectionHeading";

const WHATSAPP = "919399345989";
const wa = (msg: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

const languageCourses = [
  {
    id: "german", name: "German", native: "Deutsch", flag: "/flags/germ.png", level: "A1 to C2", duration: "12 weeks", batchSize: "10-15 students",
    description: "Master German from basics to advanced level with native speakers and interactive sessions.",
    features: ["Goethe Institute Curriculum", "Exam Preparation (A1-C2)", "Conversation Practice", "Cultural Immersion"],
    accent: "from-red-500 to-orange-500", game: true,
  },
  {
    id: "japanese", name: "Japanese", native: "日本語", flag: "/flags/japan.png", level: "N5 to N1", duration: "14 weeks", batchSize: "8-12 students",
    description: "Learn Japanese with a focus on JLPT preparation, kanji mastery and business communication.",
    features: ["JLPT Preparation (N5-N1)", "Kanji Mastery Program", "Business Japanese", "Cultural Workshops"],
    accent: "from-pink-500 to-purple-500", game: false,
  },
  {
    id: "french", name: "French", native: "Français", flag: "/flags/fran.png", level: "A1 to C2", duration: "12 weeks", batchSize: "10-15 students",
    description: "Master the language of diplomacy and culture with our comprehensive French program.",
    features: ["DELF/DALF Preparation", "Pronunciation Excellence", "French Literature", "Cultural Immersion"],
    accent: "from-blue-500 to-indigo-500", game: false,
  },
  {
    id: "spanish", name: "Spanish", native: "Español", flag: "/flags/spain.png", level: "A1 to C2", duration: "12 weeks", batchSize: "12-18 students",
    description: "Learn Spanish, one of the most spoken languages in the world, with an immersive and practical approach.",
    features: ["DELE Preparation", "Conversation Mastery", "Business Spanish", "Hispanic Culture"],
    accent: "from-yellow-500 to-amber-500", game: false,
  },
];

const gameUrl = "https://learn-gern-play.vercel.app/";
const gameFeatures = ["Flip Cards", "Quiz", "Memory Game"];

const highlights = [
  { icon: Globe2, value: "4", label: "Languages" },
  { icon: Award, value: "A1–C2", label: "Exam-aligned levels" },
  { icon: Users, value: "8–18", label: "Students per batch" },
  { icon: BadgeCheck, value: "Certified", label: "On completion" },
];

const benefits = [
  { icon: Users, title: "Native Speakers", description: "Learn from experienced native language instructors." },
  { icon: Clock, title: "Flexible Batches", description: "Weekday and weekend batches to suit your schedule." },
  { icon: BadgeCheck, title: "Certification", description: "Globally recognized certificates upon completion." },
  { icon: Briefcase, title: "Career Support", description: "Job assistance and placement support." },
];

const path = [
  { icon: ClipboardList, title: "Level Assessment", text: "We place you in the right batch for your current level." },
  { icon: BookOpen, title: "Structured Learning", text: "Exam-aligned curriculum with regular practice material." },
  { icon: Mic2, title: "Speaking Practice", text: "Conversation sessions to build real-world confidence." },
  { icon: Award, title: "Certification", text: "Prepare for and clear your international exam." },
];

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, delay: i * 0.08 },
});

export default function Overseas() {
  usePageMeta("Overseas Education: German, Japanese, French & Spanish", "Learn German, Japanese, French and Spanish from native speakers and prepare for international certification exams.");
  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-indigo-50 text-slate-900">
        <div className="pointer-events-none absolute -left-24 -top-24 h-[380px] w-[380px] rounded-full bg-sky-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-10 h-[360px] w-[360px] rounded-full bg-violet-300/30 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-50" style={{ backgroundImage: "radial-gradient(rgba(99,102,241,.22) 1px, transparent 1px)", backgroundSize: "28px 28px", maskImage: "linear-gradient(to bottom, black 40%, transparent)", WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent)" }} />
        <div className="container relative grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-700 shadow-sm backdrop-blur">
              <Globe2 className="h-3.5 w-3.5" /> Overseas Education
            </span>
            <h1 className="mt-5 text-2xl font-bold leading-tight tracking-tight text-slate-900 md:text-3xl lg:text-4xl">
              Speak the world's languages with{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">expert guidance</span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-slate-600">
              Learn German, Japanese, French and Spanish from native speakers, and prepare for international certifications that unlock global opportunities.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#languages" className="inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:-translate-y-0.5 hover:shadow-xl">
                Explore Languages <ArrowRight className="h-4 w-4" />
              </a>
              <a href={wa("Hi, I'd like to book a free demo class for a foreign language course.")} target="_blank" rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-5 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur transition hover:bg-white hover:shadow-md">
                <MessageCircle className="h-4 w-4" /> Book Free Demo
              </a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
            className="grid grid-cols-2 gap-3">
            {languageCourses.map((l, i) => (
              <a key={l.id} href={`#${l.id}`}
                className={`group rounded-xl border border-white bg-white/80 p-4 shadow-[0_10px_40px_-15px_rgba(79,70,229,0.3)] ring-1 ring-indigo-100 backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white ${i % 2 ? "translate-y-3" : ""}`}>
                <img src={l.flag} alt={`${l.name} flag`} className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-100" />
                <div className="mt-3 text-base font-bold text-slate-900">{l.name}</div>
                <div className="text-xs text-slate-500">{l.native} · {l.level}</div>
              </a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="relative z-10 -mt-px border-b border-slate-200 bg-white">
        <div className="container grid grid-cols-2 gap-y-4 py-6 lg:grid-cols-4">
          {highlights.map((h) => (
            <div key={h.label} className="flex items-center justify-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><h.icon className="h-4 w-4" /></div>
              <div>
                <div className="text-lg font-bold leading-none text-slate-900">{h.value}</div>
                <div className="mt-1 text-xs text-slate-500">{h.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LANGUAGES */}
      <section id="languages" className="bg-slate-50 py-14">
        <div className="container">
          <SectionHeading compact eyebrow="Programs" title="Choose your language" subtitle="Comprehensive programs designed to help you reach fluency and certification." />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {languageCourses.map((c, i) => (
              <motion.article key={c.id} id={c.id} {...fadeUp(i)}
                className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className={`h-1 bg-gradient-to-r ${c.accent}`} />
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-center gap-3">
                    <img loading="lazy" src={c.flag} alt={`${c.name} flag`} className="h-10 w-10 rounded-full object-cover shadow ring-2 ring-slate-100" />
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{c.name}</h3>
                      <p className="text-xs font-medium text-slate-500">{c.native} · {c.level}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-600 sm:text-sm">{c.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-medium text-slate-600">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5"><Clock className="h-3 w-3" />{c.duration}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5"><Users className="h-3 w-3" />{c.batchSize}</span>
                  </div>
                  <ul className="mt-4 flex-1 space-y-1.5">
                    {c.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-slate-700 sm:text-sm">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" /> {f}
                      </li>
                    ))}
                  </ul>
                  {c.game && (
                    <a href={gameUrl} target="_blank" rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100">
                      <Sparkles className="h-3.5 w-3.5" /> Interactive games available
                    </a>
                  )}
                  <a href={wa(`Hi, I'd like to enroll in the ${c.name} language course.`)} target="_blank" rel="noopener noreferrer"
                    className={`mt-4 inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-gradient-to-r ${c.accent} text-sm font-semibold text-white shadow-md transition hover:shadow-lg hover:brightness-105`}>
                    Enroll Now <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* GAME */}
      <section className="bg-white py-14">
        <div className="container">
          <motion.div {...fadeUp()} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-6 text-white shadow-xl md:p-8">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 left-10 h-64 w-64 rounded-full bg-purple-400/20 blur-3xl" />
            <div className="relative grid items-center gap-8 lg:grid-cols-2">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-blue-100">
                  <Gamepad2 className="h-3.5 w-3.5" /> Featured Game
                </span>
                <h2 className="mt-3 text-xl font-bold tracking-tight md:text-2xl">Learn & Play German</h2>
                <p className="mt-2 max-w-md text-sm text-blue-100">
                  Make vocabulary learning fun with interactive games. Perfect for beginners and intermediate learners.
                </p>
                <a href={gameUrl} target="_blank" rel="noopener noreferrer"
                  className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-blue-900 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">
                  <Play className="h-4 w-4" /> Play Now <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {gameFeatures.map((g) => (
                  <div key={g} className="rounded-xl border border-white/15 bg-white/10 p-3.5 text-center backdrop-blur">
                    <Sparkles className="mx-auto h-5 w-5 text-blue-200" />
                    <div className="mt-2 text-xs font-semibold">{g}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* LEARNING PATH */}
      <section className="bg-slate-50 py-14">
        <div className="container">
          <SectionHeading compact eyebrow="Your Journey" title="From first class to certification" />
          <div className="relative grid gap-5 md:grid-cols-4">
            <div className="absolute left-[12%] right-[12%] top-6 hidden h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent md:block" />
            {path.map((p, i) => (
              <motion.div key={p.title} {...fadeUp(i)} className="relative text-center">
                <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg ring-8 ring-slate-50">
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

      {/* BENEFITS */}
      <section className="bg-white py-14">
        <div className="container">
          <SectionHeading compact eyebrow="Why Us" title="Why learn with us?" subtitle="World-class language education with real advantages." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, i) => (
              <motion.div key={b.title} {...fadeUp(i)}
                className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md">
                  <b.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-900">{b.title}</h3>
                <p className="mt-1 text-xs text-slate-600">{b.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white pb-14">
        <div className="container">
          <motion.div {...fadeUp()} className="relative overflow-hidden rounded-2xl bg-slate-950 px-6 py-10 text-center text-white shadow-xl md:px-10">
            <div className="absolute inset-0 opacity-70" style={{ backgroundImage: "radial-gradient(50% 80% at 50% 0%, rgba(99,102,241,.45), transparent)" }} />
            <div className="relative">
              <h2 className="text-xl font-bold tracking-tight md:text-2xl">Ready to start your language journey?</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-slate-300">Book a free demo class and meet your trainer before you commit.</p>
              <a href={wa("Hi, I'd like to book a free demo class for a foreign language course.")} target="_blank" rel="noopener noreferrer"
                className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">
                <MessageCircle className="h-4 w-4" /> Book Free Demo Class
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
