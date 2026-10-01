import usePageMeta from "@/hooks/use-page-meta";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  animate,
  useInView,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Layout from "@/components/site/Layout";
import {
  AcademicCapIcon,
  LightBulbIcon,
  PuzzlePieceIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  UserGroupIcon,
  TrophyIcon,
  ChartBarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  SparklesIcon,
  BookOpenIcon,
  CodeBracketIcon,
  BriefcaseIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassPlusIcon,
} from "@heroicons/react/24/outline";

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

const stats = [
  { value: 10000, suffix: "+", label: "Students Trained", icon: UserGroupIcon },
  { value: 95, suffix: "%", label: "Placement Rate", icon: TrophyIcon },
  { value: 50, suffix: "+", label: "Courses Offered", icon: AcademicCapIcon },
  { value: 200, suffix: "+", label: "Partner Companies", icon: BuildingOfficeIcon },
];

const coreValues = [
  {
    icon: AcademicCapIcon,
    title: "Education",
    description:
      "Education is key to personal and professional growth. We empower individuals to excel academically and professionally, opening doors to new opportunities and horizons.",
    gradient: "from-blue-500 to-cyan-500",
    soft: "bg-blue-50",
  },
  {
    icon: LightBulbIcon,
    title: "Belief",
    description:
      "We believe in nurturing talent and fostering careers. We connect top-tier talent with leading organizations, facilitating mutually beneficial partnerships.",
    gradient: "from-violet-500 to-fuchsia-500",
    soft: "bg-violet-50",
  },
  {
    icon: PuzzlePieceIcon,
    title: "Solutions",
    description:
      "Our tailored solutions ensure that your projects are executed flawlessly and meet your unique requirements. Driven by excellence, integrity, and client satisfaction.",
    gradient: "from-amber-500 to-orange-500",
    soft: "bg-amber-50",
  },
];

const journey = [
  {
    icon: BookOpenIcon,
    title: "Learn",
    text: "Structured, industry-aligned curriculum taught by experienced trainers.",
  },
  {
    icon: CodeBracketIcon,
    title: "Practice",
    text: "Hands-on labs and assignments with mentor support at every step.",
  },
  {
    icon: PuzzlePieceIcon,
    title: "Build",
    text: "Real-world projects that become the highlight of your portfolio.",
  },
  {
    icon: BriefcaseIcon,
    title: "Get placed",
    text: "Resume building, mock interviews and dedicated placement assistance.",
  },
];

const gallery = [
  { src: "/img/group.jpeg", alt: "Students receiving certificates and awards", span: "sm:col-span-2 sm:row-span-2" },
  { src: "/img/workshop.jpeg", alt: "Expert-led seminar session", span: "" },
  { src: "/img/jobfair.jpeg", alt: "Job fair event", span: "" },
  { src: "/img/live.webp", alt: "Live online classroom", span: "sm:col-span-2" },
  { src: "/img/gd.jpeg", alt: "Group discussion practice session", span: "sm:col-span-2" },
  { src: "/img/jayanti.jpeg", alt: "Team and students celebrating together", span: "sm:col-span-2" },
];

const trainers = [
  {
    name: "Arjun",
    role: "Full-Stack Java Trainer",
    experience: "10+ years",
    specialization: "Java, Spring Boot, Microservices",
    achievements: ["Mentored 1000+ students", "Ex-Senior Developer at Tech Giant"],
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    name: "Priya",
    role: "React & Frontend Trainer",
    experience: "8+ years",
    specialization: "React, TypeScript, UI/UX",
    achievements: ["Frontend Architect", "Open Source Contributor"],
    gradient: "from-violet-500 to-fuchsia-500",
  },
];

const successStories = [
  {
    name: "Manan Agrawal",
    company: "Mindcan Inc",
    package: "20 LPA",
    photo: "/img/students/manan-agrawal.jpg",
  },
  {
    name: "Shradha Alewar",
    company: "Tech Mahindra",
    package: "3.65 LPA",
    photo: "/img/students/shradha-alewar.jpg",
  },
];

const offices = [
  {
    city: "Nagpur Office",
    lines: ["Plot No.26, Khandwekar Bunglow", "2nd Floor, Near Lendra Park", "Ramdaspeth, Nagpur-440010"],
  },
  {
    city: "Pune Office",
    lines: ["IT Park, Hinjawadi", "Pune, Maharashtra"],
  },
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function Reveal({
  children,
  delay = 0,
  className = "",
  y = 16,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref}>
      {n.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: ReactNode;
  text?: string;
}) {
  return (
    <Reveal className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">
        {eyebrow}
      </span>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-[1.75rem] md:leading-9">
        {title}
      </h2>
      {text && <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-slate-600">{text}</p>}
    </Reveal>
  );
}

const gradientText = "text-indigo-600";
const cardBase =
  "rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md";

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function About() {
  usePageMeta("About Us", "Learn about Skill Training Center, our trainers, our students and our mission.");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  // Subtle parallax on hero collage
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const yBack = useTransform(heroScroll, [0, 1], [0, 60]);
  const yFront = useTransform(heroScroll, [0, 1], [0, -40]);

  // Lightbox keyboard + scroll lock
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? i : (i + 1) % gallery.length));
      if (e.key === "ArrowLeft")
        setLightbox((i) => (i === null ? i : (i - 1 + gallery.length) % gallery.length));
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox]);

  return (
    <Layout>
      <MotionConfig reducedMotion="user">
        <motion.div
          style={{ scaleX: progress }}
          className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-indigo-600"
        />

        <div className="relative overflow-hidden bg-slate-50 text-slate-700">
          <div className="container relative max-w-7xl">
            {/* ------------------------------ Hero ------------------------------ */}
            <section ref={heroRef} className="grid items-center gap-10 py-10 md:py-14 lg:grid-cols-2 lg:gap-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">
                  <SparklesIcon className="h-4 w-4" />
                  About Skill Training Center
                </span>
                <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-[2.6rem] lg:leading-[1.15]">
                  Where learning turns into{" "}
                  <span className={gradientText}>careers</span>
                </h1>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600">
                  Skill Training Center is a premier software organization with a strong
                  presence in Pune and Nagpur. We combine cutting-edge IT solutions and
                  transformative education to bridge the gap between academia and industry.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/courses"
                    className="group inline-flex h-10 items-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition-all hover:gap-3 hover:bg-indigo-700"
                  >
                    Explore courses
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                  >
                    Talk to us
                  </Link>
                </div>
              </motion.div>

              {/* Photo collage */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.15 }}
                className="relative mx-auto h-[300px] w-full max-w-md sm:h-[360px] lg:max-w-lg"
              >
                <motion.div
                  style={{ y: yBack }}
                  className="absolute left-0 top-0 h-[78%] w-[78%] overflow-hidden rounded-xl border-2 border-white shadow-md"
                >
                  <img
                    src="/img/workshop.jpeg"
                    alt="Expert-led seminar at Skill Training Center"
                    className="h-full w-full object-cover"
                  />
                </motion.div>
                <motion.div
                  style={{ y: yFront }}
                  className="absolute bottom-0 right-0 h-[52%] w-[58%] overflow-hidden rounded-xl border-2 border-white shadow-md"
                >
                  <img
                    src="/img/group.jpeg"
                    alt="Students with certificates and awards"
                    className="h-full w-full object-cover"
                  />
                </motion.div>

                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -left-1 bottom-8 flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md sm:-left-4"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600 text-white">
                    <TrophyIcon className="h-5 w-5" />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-base font-bold text-slate-900">95%</span>
                    <span className="text-[11px] text-slate-500">Placement rate</span>
                  </span>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute right-1 top-1 flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md sm:-right-3"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-amber-500 text-white">
                    <UserGroupIcon className="h-5 w-5" />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-base font-bold text-slate-900">10,000+</span>
                    <span className="text-[11px] text-slate-500">Students trained</span>
                  </span>
                </motion.div>
              </motion.div>
            </section>

            {/* ------------------------------ Stats ----------------------------- */}
            <Reveal>
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 shadow-sm lg:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.label} className="bg-white px-4 py-5 text-center sm:py-6">
                    <s.icon className="mx-auto mb-2 h-5 w-5 text-indigo-600" />
                    <div className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                      <Counter to={s.value} suffix={s.suffix} />
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500 sm:text-sm">{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* ------------------------------ Story ----------------------------- */}
            <section className="grid items-center gap-8 py-12 md:py-16 lg:grid-cols-2 lg:gap-12">
              <Reveal>
                <div className="relative">
                  <img
                    src="/img/jobfair.jpeg"
                    alt="Job fair hosted with our students"
                    loading="lazy"
                    className="relative aspect-[4/3] w-full rounded-xl border border-slate-200 object-cover shadow-sm"
                  />
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">
                  Our story
                </span>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-[1.75rem] md:leading-9">
                  Bridging the gap between <span className={gradientText}>academia and industry</span>
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
                  We specialize in cutting-edge IT solutions, digital marketing and
                  transformative education programs. Our mission is simple: provide
                  job-ready training with comprehensive mentor support, real-world
                  projects, and dedicated placement assistance.
                </p>
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {[
                    "Job-ready practical training",
                    "Real-world projects",
                    "Dedicated mentor support",
                    "Placement assistance",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm font-medium text-slate-800">
                      <CheckCircleIcon className="h-5 w-5 shrink-0 text-indigo-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </section>

            {/* --------------------------- Core values -------------------------- */}
            <section className="pb-12 md:pb-16">
              <SectionHeading
                eyebrow="What drives us"
                title={
                  <>
                    Our <span className={gradientText}>core values</span>
                  </>
                }
                text="The principles that guide our mission and shape our success stories."
              />
              <div className="grid gap-4 md:grid-cols-3 md:gap-5">
                {coreValues.map((v, i) => (
                  <Reveal key={v.title} delay={i * 0.1}>
                    <div className={`relative h-full overflow-hidden p-5 md:p-6 ${cardBase}`}>
                      <div
                        className={`relative inline-flex rounded-lg bg-gradient-to-br ${v.gradient} p-2.5 text-white`}
                      >
                        <v.icon className="h-5 w-5" />
                      </div>
                      <h3 className="relative mt-4 text-base font-semibold text-slate-900">{v.title}</h3>
                      <p className="relative mt-2 text-sm leading-relaxed text-slate-600">{v.description}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* ------------------------ Mission & Vision ------------------------ */}
            <section className="grid gap-5 pb-12 md:grid-cols-2 md:pb-16">
              <Reveal>
                <div className="relative h-full overflow-hidden rounded-xl bg-indigo-700 p-6 text-white shadow-sm md:p-7">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 ring-1 ring-white/20">
                    <TrophyIcon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">Our Mission</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/80">
                    Provide job-ready training with comprehensive mentor support, real-world
                    projects, and dedicated placement assistance to transform careers through
                    practical, industry-aligned education.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="relative h-full overflow-hidden rounded-xl bg-slate-900 p-6 text-white shadow-sm md:p-7">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 ring-1 ring-white/20">
                    <ChartBarIcon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">Our Vision</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/80">
                    Become the leading institute for practical software education in the region,
                    recognized for producing industry-ready professionals who drive innovation
                    and excellence in technology.
                  </p>
                </div>
              </Reveal>
            </section>

            {/* ----------------------------- Journey ---------------------------- */}
            <section className="pb-12 md:pb-16">
              <SectionHeading
                eyebrow="How we train"
                title={
                  <>
                    Your journey from <span className={gradientText}>learner to professional</span>
                  </>
                }
              />
              <div className="relative grid gap-6 sm:grid-cols-2 md:grid-cols-4">
                <div className="pointer-events-none absolute left-[12%] right-[12%] top-7 hidden h-px bg-slate-300 md:block" />
                {journey.map((step, i) => (
                  <Reveal key={step.title} delay={i * 0.12} className="relative text-center">
                    <div className="relative mx-auto grid h-14 w-14 place-items-center rounded-full bg-indigo-600 text-white shadow-sm ring-4 ring-slate-50">
                      <step.icon className="h-6 w-6" />
                      <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full border border-slate-200 bg-white text-[10px] font-bold text-indigo-600">
                        {i + 1}
                      </span>
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-slate-900">{step.title}</h3>
                    <p className="mx-auto mt-1.5 max-w-[15rem] text-sm leading-relaxed text-slate-600">{step.text}</p>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* ----------------------------- Gallery ---------------------------- */}
            <section className="pb-12 md:pb-16">
              <SectionHeading
                eyebrow="Life at Skill Training Center"
                title={
                  <>
                    Moments that <span className={gradientText}>define us</span>
                  </>
                }
                text="Seminars, job fairs, live classes and celebrations with our students."
              />
              <div className="grid auto-rows-[130px] grid-cols-2 gap-3 sm:auto-rows-[120px] sm:grid-cols-4 lg:auto-rows-[140px]">
                {gallery.map((g, i) => (
                  <Reveal key={g.src} delay={(i % 4) * 0.06} y={24} className={g.span}>
                    <button
                      onClick={() => setLightbox(i)}
                      aria-label={`Open photo: ${g.alt}`}
                      className="group relative h-full w-full overflow-hidden rounded-lg border border-slate-200 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                    >
                      <img
                        src={g.src}
                        alt={g.alt}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute inset-0 grid place-items-center bg-slate-900/0 transition-colors duration-300 group-hover:bg-slate-900/35">
                        <MagnifyingGlassPlusIcon className="h-7 w-7 scale-75 text-white opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100" />
                      </span>
                    </button>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* ----------------------------- Trainers --------------------------- */}
            <section className="pb-12 md:pb-16">
              <SectionHeading
                eyebrow="Meet the mentors"
                title={
                  <>
                    Learn from <span className={gradientText}>industry practitioners</span>
                  </>
                }
              />
              <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-2 md:gap-5">
                {trainers.map((t, i) => (
                  <Reveal key={t.name} delay={i * 0.1}>
                    <div className={`h-full p-5 md:p-6 ${cardBase}`}>
                      <div className="flex items-center gap-3.5">
                        <span
                          className={`grid h-12 w-12 place-items-center rounded-lg bg-gradient-to-br ${t.gradient} text-lg font-bold text-white`}
                        >
                          {t.name[0]}
                        </span>
                        <div>
                          <h3 className="text-base font-semibold text-slate-900">{t.name}</h3>
                          <p className="text-sm font-medium text-indigo-600">{t.role}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                          {t.experience}
                        </span>
                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                          {t.specialization}
                        </span>
                      </div>
                      <ul className="mt-4 space-y-1.5">
                        {t.achievements.map((a) => (
                          <li key={a} className="flex items-center gap-2 text-sm text-slate-700">
                            <CheckCircleIcon className="h-4 w-4 shrink-0 text-emerald-500" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* ------------------------- Success stories ------------------------ */}
            <section className="pb-12 md:pb-16">
              <SectionHeading
                eyebrow="Success stories"
                title={
                  <>
                    Our students, <span className={gradientText}>placed and thriving</span>
                  </>
                }
              />
              <div className="mx-auto grid max-w-xl grid-cols-2 gap-3 sm:gap-5">
                {successStories.map((s, i) => (
                  <Reveal key={s.name} delay={i * 0.1}>
                    <div className="group relative aspect-[4/5] overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                      <img
                        src={s.photo}
                        alt={s.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-indigo-950/10 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-3.5 text-white sm:p-4">
                        <span className="inline-block rounded-md bg-indigo-600 px-2 py-0.5 text-xs font-semibold">
                          {s.package}
                        </span>
                        <h3 className="mt-2 text-base font-semibold sm:text-lg">{s.name}</h3>
                        <p className="text-xs text-white/80 sm:text-sm">Placed at {s.company}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
              <Reveal className="mt-6 text-center">
                <Link
                  to="/placements"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition-all hover:gap-3"
                >
                  See all placements <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </Reveal>
            </section>

            {/* ----------------------------- Locations -------------------------- */}
            <section className="pb-12 md:pb-16">
              <SectionHeading
                eyebrow="Get in touch"
                title={
                  <>
                    Visit us or <span className={gradientText}>call anytime</span>
                  </>
                }
                text="Reach out for more information about our services and training programs."
              />
              <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5">
                {offices.map((o, i) => (
                  <Reveal key={o.city} delay={i * 0.1}>
                    <div className={`h-full p-5 ${cardBase}`}>
                      <span className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
                        <MapPinIcon className="h-5 w-5" />
                      </span>
                      <h3 className="mt-3 text-base font-semibold text-slate-900">{o.city}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                        {o.lines.map((l) => (
                          <span key={l} className="block">
                            {l}
                          </span>
                        ))}
                      </p>
                    </div>
                  </Reveal>
                ))}
                <Reveal delay={0.2}>
                  <div className={`h-full p-5 ${cardBase}`}>
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
                      <PhoneIcon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-3 text-base font-semibold text-slate-900">Call us</h3>
                    <div className="mt-1.5 space-y-1">
                      <a href="tel:+919399345989" className="block text-sm font-medium text-slate-700 hover:text-indigo-600">
                        +91 93993 45989
                      </a>
                      <a href="tel:+918446691425" className="block text-sm font-medium text-slate-700 hover:text-indigo-600">
                        +91 84466 91425
                      </a>
                    </div>
                  </div>
                </Reveal>
              </div>
            </section>

            {/* ------------------------------- CTA ------------------------------ */}
            <Reveal className="pb-12 md:pb-16">
              <div className="relative overflow-hidden rounded-xl bg-slate-900 px-6 py-10 text-center shadow-sm sm:px-12 sm:py-12">
                <div className="relative">
                  <h2 className="text-2xl font-bold tracking-tight text-white md:text-[1.75rem] md:leading-9">
                    Ready to transform your career?
                  </h2>
                  <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-white/75">
                    Join thousands of successful students who have accelerated their careers
                    with our industry-leading training programs.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Link
                      to="/courses"
                      className="inline-flex h-10 items-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                    >
                      <SparklesIcon className="h-4 w-4" /> Browse courses
                    </Link>
                    <Link
                      to="/contact"
                      className="inline-flex h-10 items-center rounded-lg border border-white/30 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      Contact us
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* ----------------------------- Lightbox ----------------------------- */}
        <AnimatePresence>
          {lightbox !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md"
              onClick={() => setLightbox(null)}
              role="dialog"
              aria-modal="true"
              aria-label="Photo viewer"
            >
              <button
                onClick={() => setLightbox(null)}
                aria-label="Close"
                className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:rotate-90 hover:bg-white/20"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((lightbox - 1 + gallery.length) % gallery.length);
                }}
                aria-label="Previous photo"
                className="absolute left-3 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((lightbox + 1) % gallery.length);
                }}
                aria-label="Next photo"
                className="absolute right-3 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>

              <AnimatePresence mode="wait">
                <motion.figure
                  key={lightbox}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.25 }}
                  onClick={(e) => e.stopPropagation()}
                  className="max-h-[88vh] max-w-5xl"
                >
                  <img
                    src={gallery[lightbox].src}
                    alt={gallery[lightbox].alt}
                    className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
                  />
                  <figcaption className="mt-3 text-center text-sm text-white/80">
                    {gallery[lightbox].alt} &middot; {lightbox + 1} / {gallery.length}
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </MotionConfig>
    </Layout>
  );
}
