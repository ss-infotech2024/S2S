// components/site/AboutSection.tsx
import { motion } from "framer-motion";
import { BarChart3, Cpu, GraduationCap, Lightbulb, Rocket, Library } from "lucide-react";

interface AboutSectionProps {
  /** Optional: pass a video to show it instead of the dashboard illustration */
  videoSrc?: string;
  badgeText?: string;
  title?: string;
  /** Part of the title shown in the accent colour */
  titleHighlight?: string;
  mainDescription?: { heading: string; content: string };
  sections?: Array<{ title: string; content: string; icon: "education" | "belief" | "solutions" }>;
  floatingBadges?: { top: string; bottomTitle: string; bottomSub: string };
}

const iconMap = {
  education: { Icon: GraduationCap, tile: "bg-blue-100 text-blue-600" },
  belief: { Icon: Lightbulb, tile: "bg-violet-100 text-violet-600" },
  solutions: { Icon: Rocket, tile: "bg-emerald-100 text-emerald-600" },
};

export default function AboutSection({
  videoSrc,
  badgeText = "Industry-Focused Learning",
  title = "Innovating Education with Purpose",
  titleHighlight = "Purpose",
  mainDescription = {
    heading: "Where innovation meets excellence in the realm of IT solutions and education.",
    content:
      "Skill Training Center is a premier software organization with a strong presence in Pune and Nagpur. We specialize in cutting-edge IT solutions, digital marketing, and transformative education programs.",
  },
  sections = [
    { icon: "education", title: "Education", content: "Key to personal and professional growth. We empower individuals to excel academically and professionally through industry-aligned, hands-on training." },
    { icon: "belief", title: "Belief", content: "We nurture talent and foster careers. We connect top-tier talent with leading organizations, facilitating mutually beneficial partnerships." },
    { icon: "solutions", title: "Solutions", content: "We offer innovative, tech-driven solutions tailored to industry needs — from skill development to career transformation." },
  ],
  floatingBadges = { top: "Live Classroom", bottomTitle: "Industry-Aligned", bottomSub: "Curriculum" },
}: AboutSectionProps) {
  const at = title.indexOf(titleHighlight);
  const before = at >= 0 ? title.slice(0, at) : title;
  const after = at >= 0 ? title.slice(at + titleHighlight.length) : "";

  return (
    <section id="about" className="container py-16 sm:py-24">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        {/* Left — content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            <Library className="h-4 w-4" /> {badgeText}
          </span>

          <h2 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
            {before}
            {at >= 0 && <span className="text-blue-700">{titleHighlight}</span>}
            {after}
          </h2>

          <p className="mt-8 text-xl font-semibold leading-snug text-slate-900">{mainDescription.heading}</p>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">{mainDescription.content}</p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {sections.map((sec, i) => {
              const { Icon, tile } = iconMap[sec.icon];
              return (
                <motion.div
                  key={sec.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tile}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">{sec.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{sec.content}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Right — dashboard illustration (or video if videoSrc is given) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto w-full max-w-[640px] pb-6 pt-4"
        >
          <div className="relative aspect-[1.08/1] w-full">
            <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-100 via-violet-100 to-emerald-100 shadow-[0_25px_60px_-25px_rgba(79,70,229,0.35)]">
              {videoSrc ? (
                <video src={videoSrc} className="h-full w-full object-cover" controls autoPlay muted loop playsInline />
              ) : (
                <>
                  {/* dotted grid */}
                  <div className="absolute left-[8%] top-[10%] h-[22%] w-[24%] opacity-60"
                    style={{ backgroundImage: "radial-gradient(#818cf8 1.6px, transparent 1.6px)", backgroundSize: "18px 18px" }} />
                  {/* soft circles */}
                  <div className="absolute -right-6 -top-6 h-[44%] w-[44%] rounded-full bg-cyan-200/60" />
                  <div className="absolute -bottom-10 -left-8 h-[40%] w-[40%] rounded-full bg-violet-300/50" />

                  {/* network diamond */}
                  <svg className="absolute right-[6%] top-[8%] h-[24%] w-[24%]" viewBox="0 0 100 100" fill="none">
                    <path d="M50 12 L88 50 L50 88 L12 50 Z" stroke="#2563eb" strokeWidth="2" />
                    <path d="M12 50 H88" stroke="#2563eb" strokeWidth="2" />
                    <circle cx="50" cy="12" r="7" fill="#7c3aed" />
                    <circle cx="88" cy="50" r="7" fill="#0d9488" />
                    <circle cx="50" cy="88" r="7" fill="#2563eb" />
                    <circle cx="12" cy="50" r="7" fill="#1d4ed8" />
                  </svg>

                  {/* browser window */}
                  <div className="absolute inset-x-[12%] bottom-[15%] top-[31%] overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
                    <div className="flex h-[17%] items-center bg-gradient-to-r from-blue-700 to-violet-600 px-4">
                      <div className="flex gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      </div>
                      <span className="flex-1 pr-10 text-center text-[11px] font-bold text-white sm:text-sm">Learning Dashboard</span>
                    </div>
                    <div className="grid h-[83%] grid-cols-2 gap-3 p-4 sm:p-5">
                      <div className="flex flex-col justify-end">
                        <div className="mb-auto h-2.5 w-2/5 rounded-full bg-slate-200" />
                        <div className="flex h-[78%] items-end gap-2 border-b border-slate-200 pb-0.5 pl-[26%] sm:gap-3">
                          {[
                            ["h-[45%]", "from-blue-400 to-blue-600"],
                            ["h-[68%]", "from-violet-300 to-violet-500"],
                            ["h-[38%]", "from-teal-300 to-teal-500"],
                            ["h-[95%]", "from-blue-500 to-blue-700"],
                          ].map(([h, g], i) => (
                            <motion.div
                              key={i}
                              initial={{ scaleY: 0 }}
                              whileInView={{ scaleY: 1 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.7, delay: 0.3 + i * 0.1 }}
                              style={{ transformOrigin: "bottom" }}
                              className={`w-[15%] rounded-t-md bg-gradient-to-b ${h} ${g}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="relative h-[70%] max-h-[130px] aspect-square">
                          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                            <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="11" />
                            <circle cx="60" cy="60" r="50" fill="none" stroke="#3b3bd6" strokeWidth="11" strokeLinecap="round"
                              strokeDasharray="314.16" strokeDashoffset={314.16 * 0.22} />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xl font-extrabold text-slate-900 sm:text-2xl">78%</span>
                            <span className="text-[10px] text-slate-500 sm:text-xs">Progress</span>
                          </div>
                        </div>
                        <div className="w-4/5 space-y-1.5">
                          <div className="h-2 rounded-full bg-slate-200" />
                          <div className="h-2 w-4/5 rounded-full bg-slate-200" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* chip tile */}
                  <div className="absolute bottom-[11%] left-[8%] flex h-[24%] w-[22%] items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-xl">
                    <Cpu className="h-1/2 w-1/2 text-white" strokeWidth={1.6} />
                  </div>
                  {/* cap circle */}
                  <div className="absolute bottom-[8%] right-[7%] flex h-[19%] w-[19%] items-center justify-center rounded-full bg-white shadow-xl">
                    <GraduationCap className="h-1/2 w-1/2 text-teal-600" strokeWidth={1.8} />
                  </div>
                </>
              )}
            </div>

            {/* floating badges */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-3 right-2 flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-700 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xl sm:right-4"
            >
              <GraduationCap className="h-4 w-4" /> {floatingBadges.top}
            </motion.div>
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
              className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl ring-1 ring-black/5 sm:left-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <BarChart3 className="h-5 w-5" />
              </span>
              <div className="leading-tight">
                <div className="text-sm font-extrabold text-slate-900">{floatingBadges.bottomTitle}</div>
                <div className="text-xs text-slate-500">{floatingBadges.bottomSub}</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
