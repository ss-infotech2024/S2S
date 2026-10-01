import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Hero1 from "../../../public/honeBanner/crt.jpeg";
import Hero2 from "../../../public/honeBanner/databricks.jpeg";
import Hero3 from "../../../public/honeBanner/german.jpeg";
import hero4 from "../../../public/honeBanner/service.jpeg";

type Slide = {
  image: string;
  /** "cover" for photos, "contain" for poster banners (shown in full on a blurred backdrop) */
  fit: "cover" | "contain";
  pill: string;
  title: [string, string];
  text: string;
  points: string[];
  cta: { label: string; to: string };
  cta2: { label: string; to: string };
  stat?: { value: string; label: string };
};

const points = ["Live Projects", "Expert Mentors", "Placement Support"];
const cta2 = { label: "Talk to a Counsellor", to: "/contact" };

// Slide order = order they appear on the site. Re-order this list to re-sequence the loop.
const slides: Slide[] = [
  {
    image: "/img/group.jpeg",
    fit: "cover",
    pill: "Welcome to Skill Training Center",
    title: ["Skill 2 Success:", "Learn Job-Ready Skills"],
    text: "Industry-focused software training with live projects, expert mentors and placement support — in Nagpur and online.",
    points,
    cta: { label: "Explore Courses", to: "/courses" },
    cta2,
    stat: { value: "60,000+", label: "Students Trained" },
  },
  {
    image: Hero3,
    fit: "contain",
    pill: "Upcoming Workshop",
    title: ["German Language", "Workshop"],
    text: "Free consulting, a German language roadmap and basic speaking practice — right here in Nagpur.",
    points,
    cta: { label: "Explore Courses", to: "/courses" },
    cta2,
  },
  {
    image: Hero2,
    fit: "contain",
    pill: "Upcoming Workshop",
    title: ["Databricks", "Workshop"],
    text: "An industry awareness session on AI analytics engineering with Databricks.",
    points,
    cta: { label: "View Programs", to: "/courses" },
    cta2,
  },
  {
    image: Hero1,
    fit: "contain",
    pill: "Training Program",
    title: ["CRT Coding", "Bootcamp"],
    text: "Sharpen your coding skills with mentor-led practice and get ready for placements.",
    points,
    cta: { label: "Contact Us", to: "/contact" },
    cta2: { label: "Explore Courses", to: "/courses" },
  },
  {
    image: hero4,
    fit: "contain",
    pill: "Upcoming Workshop",
    title: ["ServiceNow", "Workshop"],
    text: "Get hands-on with ServiceNow, guided by expert trainers.",
    points,
    cta: { label: "Contact Us", to: "/contact" },
    cta2: { label: "Explore Courses", to: "/courses" },
  },
];

const SLIDE_DURATION_MS = 6500;
const EASE = [0.22, 1, 0.36, 1] as const;

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  const go = useCallback((dir: number) => setIndex((i) => (i + dir + slides.length) % slides.length), []);

  // Auto-advance, always loops; pauses while the pointer/focus is on the hero
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => go(1), SLIDE_DURATION_MS);
    return () => clearTimeout(t);
  }, [index, paused, go]);

  // Preload banners so they are decoded before they slide in
  useEffect(() => {
    slides.forEach((s) => { const img = new Image(); img.src = s.image; });
  }, []);

  const s = slides[index];
  const shift = reduceMotion ? 0 : 24;

  return (
    <div
      className="relative isolate overflow-hidden bg-gradient-to-br from-[#25104a] via-[#3a1670] to-[#6d2a9c] text-white"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured programs"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* dotted texture + soft glows */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-40"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.35) 1px, transparent 1px)", backgroundSize: "36px 36px" }}
      />
      <div className="pointer-events-none absolute -right-32 -top-32 -z-10 h-[420px] w-[420px] rounded-full bg-fuchsia-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 -z-10 h-[420px] w-[420px] rounded-full bg-indigo-500/25 blur-3xl" />

      <div className="container flex min-h-[560px] flex-col justify-between py-12 lg:min-h-[640px] lg:py-16">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0, x: shift }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -shift }}
            transition={{ duration: 0.5, ease: EASE }}
            className="grid flex-1 items-center gap-10 lg:grid-cols-2 lg:gap-16"
            aria-label={`${index + 1} of ${slides.length}`}
          >
            {/* Text */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur sm:text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-pink-300" />
                {s.pill}
              </span>

              <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                {s.title[0]}
                <br />
                <span className="bg-gradient-to-r from-pink-200 via-fuchsia-200 to-violet-200 bg-clip-text text-transparent">
                  {s.title[1]}
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">{s.text}</p>

              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/90">
                {s.points.map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-pink-200" /> {p}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={s.cta.to}
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 font-semibold text-[#2a1250] shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  {s.cta.label} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to={s.cta2.to}
                  className="inline-flex h-12 items-center rounded-xl border border-white/20 bg-white/10 px-6 font-semibold backdrop-blur transition hover:bg-white/20"
                >
                  {s.cta2.label}
                </Link>
              </div>
            </div>

            {/* Image card */}
            <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] border border-white/25 bg-white/5 shadow-2xl shadow-black/30">
                {s.fit === "contain" && (
                  <img src={s.image} alt="" aria-hidden="true" draggable={false}
                    className="absolute inset-0 h-full w-full scale-110 object-cover opacity-80 blur-2xl" />
                )}
                <img
                  src={s.image}
                  alt={s.title.join(" ")}
                  draggable={false}
                  className={`relative h-full w-full select-none ${s.fit === "cover" ? "object-cover" : "object-contain"}`}
                />
                {s.stat && (
                  <div className="absolute bottom-4 left-4 rounded-2xl bg-white/95 px-5 py-3 text-[#25104a] shadow-xl backdrop-blur sm:bottom-6 sm:left-6">
                    <div className="text-2xl font-extrabold leading-none sm:text-3xl">{s.stat.value}</div>
                    <div className="mt-1 text-xs text-slate-600 sm:text-sm">{s.stat.label}</div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="mt-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5" role="tablist" aria-label="Choose a slide">
            {slides.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-10 bg-white" : "w-2 bg-white/40 hover:bg-white/70"}`}
              />
            ))}
          </div>
          <div className="flex gap-3">
            <button aria-label="Previous slide" onClick={() => go(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur transition hover:bg-white/25">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button aria-label="Next slide" onClick={() => go(1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur transition hover:bg-white/25">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
