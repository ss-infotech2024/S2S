import { Fragment, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Home page banner for Skill Training Center (SS Skill 2 Success).
 *
 * Every slide is plain data below, so headlines, bullet points, buttons and
 * photos can be edited here without touching any layout code.
 * Photos live in /public/img (use paths starting with "/").
 *
 * Layout notes
 * - All slides are stacked in ONE grid cell, so the banner is always as tall as
 *   its tallest slide and the page below never jumps when the slide changes.
 * - Desktop: copy left, photo right. Tablet/mobile: copy first, photo below.
 * - Controls sit in normal flow under the content, so they can never overlap it.
 */
type Slide = {
  eyebrow: string;
  title: string;
  highlight: string; // shown in the accent gradient on its own line
  text: string;
  points: string[]; // shown from the `sm` breakpoint up
  primary: { label: string; to: string };
  secondary: { label: string; to: string };
  image: string;
  imageAlt: string;
  imagePosition?: string; // CSS object-position, e.g. "75% 50%" to keep a subject in frame
  badge: { value: string; label: string };
};

const slides: Slide[] = [
  {
    eyebrow: "Welcome to Skill Training Center",
    title: "Skill 2 Success:",
    highlight: "Learn Job-Ready Skills",
    text: "Industry-focused software training with live projects, expert mentors and placement support — in Nagpur and online.",
    points: ["Live Projects", "Expert Mentors", "Placement Support"],
    primary: { label: "Explore Courses", to: "/courses" },
    secondary: { label: "Talk to a Counsellor", to: "/contact" },
    image: "/img/group.jpeg",
    imageAlt: "Students receiving certificates at a Skill Training Center event",
    imagePosition: "50% 40%",
    badge: { value: "60,000+", label: "Students Trained" },
  },
  {
    eyebrow: "Placement-Focused Training",
    title: "Train Hard.",
    highlight: "Get Placed.",
    text: "Resume building, mock interviews and job fairs are part of the journey, so you walk into interviews prepared.",
    points: ["Mock Interviews", "Resume Building", "Job Fairs"],
    primary: { label: "View Placements", to: "/placements" },
    secondary: { label: "Browse Courses", to: "/courses" },
    image: "/img/jobfair.jpeg",
    imageAlt: "Job fair hosted with Skill Training Center",
    imagePosition: "50% 55%",
    badge: { value: "5,000+", label: "Successful Placements" },
  },
  {
    eyebrow: "Online Training",
    title: "Learn Live,",
    highlight: "From Anywhere",
    text: "Interactive instructor-led sessions with hands-on assignments, so you can upskill without leaving home.",
    points: ["Live Interactive Classes", "Expert Trainers", "Hands-on Assignments"],
    primary: { label: "Start Online Training", to: "/online-training" },
    secondary: { label: "Talk to Us", to: "/contact" },
    image: "/img/live.png",
    imageAlt: "Live online training session on a laptop",
    imagePosition: "50% 45%",
    badge: { value: "200+", label: "Courses Offered" },
  },
  {
    eyebrow: "Campus & Corporate Programs",
    title: "Workshops that",
    highlight: "Build Talent",
    text: "Customised workshops for colleges and companies, delivered by industry trainers at your campus or ours.",
    points: ["Campus Workshops", "Corporate Programs", "Custom Curriculum"],
    primary: { label: "Corporate Training", to: "/corporate-training" },
    secondary: { label: "Request a Workshop", to: "/contact" },
    image: "/img/workshop.jpeg",
    imageAlt: "Trainer conducting a workshop for students in a classroom",
    imagePosition: "75% 50%",
    badge: { value: "Nagpur", label: "Classroom & On-site" },
  },
  {
    eyebrow: "Get In Touch",
    title: "Have a Question?",
    highlight: "Talk to Us Today",
    text: "Our counsellors are here to help you choose the right course and batch — reach out and we'll get back to you fast.",
    points: ["Free Counselling", "Quick Response", "No Obligation"],
    primary: { label: "Contact Us", to: "/contact" },
    secondary: { label: "Explore Courses", to: "/courses" },
    image: "/img/gd.jpeg",
    imageAlt: "Counsellor session with students at Skill Training Center",
    imagePosition: "50% 35%",
    badge: { value: "24 hrs", label: "Response Time" },
  },
];

const AUTOPLAY_MS = 1000;

/** Soft fade-and-rise used to stagger the copy in when a slide becomes active. */
const rise = (active: boolean, step: number) => ({
  className: cn(
    "transition-[opacity,transform] duration-[600ms] ease-out motion-reduce:transition-none motion-reduce:translate-y-0",
    active ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
  ),
  style: { transitionDelay: active ? `${200 + step * 80}ms` : "0ms" },
});

function SlideView({
  slide,
  index,
  active,
  loadImage,
}: {
  slide: Slide;
  index: number;
  active: boolean;
  loadImage: boolean;
}) {
  const Heading = index === 0 ? "h1" : "h2"; // one <h1> per page
  const eyebrow = rise(active, 0);
  const heading = rise(active, 1);
  const text = rise(active, 2);
  const points = rise(active, 3);
  const ctas = rise(active, 4);

  return (
    <div
      id={`hero-slide-${index}`}
      role="tabpanel"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${slides.length}`}
      className={cn(
        "col-start-1 row-start-1 grid items-center gap-9 md:gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16",
        "transition-[opacity,visibility] motion-reduce:transition-none",
        // Outgoing slide fades out quickly, incoming waits for it — no overlapping text.
        active ? "visible opacity-100 duration-500 delay-200" : "invisible opacity-0 duration-200",
      )}
    >
      {/* ── Copy ───────────────────────────────────────────── */}
      <div className="min-w-0">
        <span
          style={eyebrow.style}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-pink-100 backdrop-blur-sm sm:text-xs",
            eyebrow.className,
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-pink-300" aria-hidden="true" />
          {slide.eyebrow}
        </span>

        <Heading
          style={heading.style}
          className={cn(
            "mt-5 text-[2rem] font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-4xl xl:text-5xl 2xl:text-[3.25rem]",
            heading.className,
          )}
        >
          <span className="block">{slide.title}</span>
          <span className="block w-fit max-w-full bg-gradient-to-r from-pink-200 via-fuchsia-200 to-violet-200 bg-clip-text pb-1.5 text-transparent [text-wrap:pretty]">
            {slide.highlight.split(" ").map((word, i) => (
              <Fragment key={i}>
                {i > 0 && " "}
                <span className="inline-block whitespace-nowrap">{word}</span>
              </Fragment>
            ))}
          </span>
        </Heading>

        <p
          style={text.style}
          className={cn(
            "mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg",
            text.className,
          )}
        >
          {slide.text}
        </p>

        <ul
          style={points.style}
          className={cn("mt-6 hidden flex-wrap gap-x-6 gap-y-2 sm:flex", points.className)}
        >
          {slide.points.map((p) => (
            <li key={p} className="flex items-center gap-2 text-sm font-medium text-white/85">
              <Check className="h-4 w-4 shrink-0 text-pink-300" strokeWidth={3} aria-hidden="true" />
              {p}
            </li>
          ))}
        </ul>

        {/* Buttons: identical height/radius; equal width when side by side, full width on phones */}
        <div
          style={ctas.style}
          className={cn(
            "mt-8 grid gap-3 sm:mt-9 sm:inline-grid sm:auto-cols-fr sm:grid-flow-col",
            ctas.className,
          )}
        >
          <Link
            to={slide.primary.to}
            className="group inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-white px-6 text-[0.95rem] font-semibold text-[#2b1450] shadow-lg shadow-black/25 transition duration-200 hover:-translate-y-0.5 hover:bg-pink-50 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2b1450] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            {slide.primary.label}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </Link>
          <Link
            to={slide.secondary.to}
            className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-xl border border-white/30 bg-white/10 px-6 text-[0.95rem] font-semibold text-white backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2b1450] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            {slide.secondary.label}
          </Link>
        </div>
      </div>

      {/* ── Photo ──────────────────────────────────────────── */}
      <div className="relative w-full">
        {/* soft glow behind the photo (kept inside the section padding) */}
        <div
          aria-hidden="true"
          className="absolute -inset-3 rounded-[2.25rem] bg-fuchsia-500/20 blur-2xl"
        />

        <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-white/10 shadow-2xl shadow-black/40 ring-1 ring-white/25 md:aspect-[2/1] lg:aspect-[16/10]">
          <img
            src={loadImage ? slide.image : undefined}
            alt={slide.imageAlt}
            decoding="async"
            className={cn(
              "h-full w-full object-cover transition-transform duration-[1400ms] ease-out motion-reduce:transition-none motion-reduce:scale-100",
              active ? "scale-100" : "scale-105",
            )}
            style={{ objectPosition: slide.imagePosition ?? "center" }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#1e0e3a]/55 via-transparent to-transparent"
          />

          {/* Stat badge sits inside the frame, so it can never collide with the controls */}
          <div className="absolute bottom-3 left-3 rounded-2xl border border-white/50 bg-white/90 px-3 py-2 text-[#2b1450] shadow-lg backdrop-blur sm:bottom-5 sm:left-5 sm:px-5 sm:py-3 lg:bottom-4 lg:left-4 lg:px-3.5 lg:py-2 xl:bottom-5 xl:left-5 xl:px-5 xl:py-3">
            <div className="text-lg font-extrabold leading-none sm:text-2xl lg:text-xl xl:text-2xl">
              {slide.badge.value}
            </div>
            <div className="mt-1 text-[0.7rem] font-medium text-[#2b1450]/70 sm:text-sm lg:text-xs xl:text-sm">
              {slide.badge.label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // Remember which photos were needed so we only download the current + next one up front.
  const [seen, setSeen] = useState<number[]>([0, 1]);
  const reduceMotion = useReducedMotion();

  const go = useCallback(
    (next: number) => setIndex((next + slides.length) % slides.length),
    [],
  );

  useEffect(() => {
    if (paused || reduceMotion) return;
    const id = window.setTimeout(() => go(index + 1), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [index, paused, reduceMotion, go]);

  useEffect(() => {
    setSeen((prev) => {
      const merged = Array.from(new Set([...prev, index, (index + 1) % slides.length]));
      return merged.length === prev.length ? prev : merged;
    });
  }, [index]);

  const nextIndex = (index + 1) % slides.length;

  return (
    <div
      className="relative isolate w-full overflow-hidden text-white"
      style={{
        backgroundColor: "#1e0e3a",
        backgroundImage: [
          "radial-gradient(60% 85% at 88% 15%, rgba(217,70,239,0.26), transparent 62%)",
          "radial-gradient(55% 75% at 0% 100%, rgba(139,92,246,0.30), transparent 62%)",
          "linear-gradient(135deg, #1e0e3a 0%, #33185c 55%, #5a2a7e 100%)",
        ].join(","),
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Skill Training Center highlights"
    >
      {/* Decorative dot grid that fades out toward the bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08]"
        style={{
          backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "linear-gradient(to bottom, #000, transparent 85%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000, transparent 85%)",
        }}
      />

      <div className="container px-5 py-12 sm:px-8 sm:py-14 lg:py-20">
        {/* Stage: every slide shares one grid cell → constant height, no layout shift */}
        <div className="grid" aria-live={paused ? "polite" : "off"}>
          {slides.map((s, i) => (
            <SlideView
              key={s.eyebrow}
              slide={s}
              index={i}
              active={i === index}
              loadImage={seen.includes(i) || i === index || i === nextIndex}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center justify-between lg:mt-12">
          <div className="-ml-1 flex items-center gap-1" role="tablist" aria-label="Choose slide">
            {slides.map((s, i) => (
              <button
                key={s.eyebrow}
                role="tab"
                aria-selected={index === i}
                aria-controls={`hero-slide-${i}`}
                aria-label={`Go to slide ${i + 1}: ${s.eyebrow}`}
                onClick={() => go(i)}
                className="group flex h-8 items-center rounded-full px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span
                  className={cn(
                    "block h-2 rounded-full transition-all duration-300 motion-reduce:transition-none",
                    index === i ? "w-8 bg-white" : "w-2 bg-white/35 group-hover:bg-white/70",
                  )}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {[
              { label: "Previous slide", Icon: ChevronLeft, to: index - 1 },
              { label: "Next slide", Icon: ChevronRight, to: index + 1 },
            ].map(({ label, Icon, to }) => (
              <button
                key={label}
                aria-label={label}
                onClick={() => go(to)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition duration-200 hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none"
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
