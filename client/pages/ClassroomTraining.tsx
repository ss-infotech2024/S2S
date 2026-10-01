import usePageMeta from "@/hooks/use-page-meta";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/site/Layout";
import GallerySection from "../components/site/GallerySection";
import { courses } from "../data/courses";
import {
  AcademicCapIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ChartBarIcon,
  ClockIcon,
  ComputerDesktopIcon,
  MapPinIcon,
  SparklesIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "0px 0px -60px 0px" },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const stats = [
  { value: "10,000+", label: "Students Trained", icon: UserGroupIcon },
  { value: "98%", label: "Success Rate", icon: ChartBarIcon },
  { value: "Small", label: "Batch Sizes", icon: AcademicCapIcon },
  { value: "50+", label: "Live Projects", icon: SparklesIcon },
];

const benefits = [
  { icon: UserGroupIcon, title: "Small, Focused Batches", text: "Personal attention from trainers so nobody gets left behind." },
  { icon: ComputerDesktopIcon, title: "Hands-on Labs", text: "Every student works on their own system, guided step by step." },
  { icon: WrenchScrewdriverIcon, title: "Live Projects", text: "Build real, portfolio-ready projects under mentor guidance." },
  { icon: BriefcaseIcon, title: "Placement Support", text: "Resume building, mock interviews and job-fair opportunities." },
];

const batches = [
  { name: "Weekday Batch", days: "Monday – Friday", time: "6:30 PM – 8:30 PM", note: "Ideal for college students and working professionals", icon: ClockIcon },
  { name: "Weekend Batch", days: "Saturday & Sunday", time: "10:00 AM – 2:00 PM", note: "Perfect if you're busy during the week", icon: CalendarDaysIcon },
];

const steps = [
  { n: "01", title: "Choose a Course", text: "Pick the program that fits your career goals." },
  { n: "02", title: "Book a Free Demo", text: "Visit our Nagpur center and meet the trainers." },
  { n: "03", title: "Learn & Build", text: "Attend live classes and work on real projects." },
  { n: "04", title: "Get Certified & Placed", text: "Earn your certificate and get placement help." },
];

const card =
  "rounded-xl border border-violet-200/60 dark:border-violet-800/50 bg-white/80 dark:bg-zinc-900/70 backdrop-blur-sm shadow-sm";

export default function ClassroomTraining() {
  usePageMeta("Classroom Training", "Hands-on classroom training in Nagpur with expert trainers, labs and placement assistance.");
  return (
    <Layout>
      {/* Background — same purple/pink style as Online Training */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#f5f2ff] dark:bg-[#0f0a1f]">
        <div className="absolute inset-0 bg-[radial-gradient(#c4b5fd_0.6px,transparent_1px)] dark:bg-[radial-gradient(#8b7cf0_0.6px,transparent_1px)] [background-size:50px_50px] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-violet-100/40 via-transparent to-pink-100/30 dark:from-violet-950/30 dark:via-transparent dark:to-pink-950/20" />
        <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-violet-300/25 dark:bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-15%] left-[-15%] w-[700px] h-[700px] bg-pink-300/25 dark:bg-pink-600/10 rounded-full blur-[110px]" />
      </div>

      <section className="container mx-auto max-w-5xl px-4 pt-6 sm:pt-8 pb-10 relative">
        {/* ================= HERO ================= */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <img
              src="/img/classroom-training-logo.svg"
              alt="SS Classroom Training – Skill 2 Success"
              className="h-16 sm:h-20 w-auto object-contain"
              draggable={false}
            />
            <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-[1.08]">
              <span className="bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                Classroom Training
              </span>
              <span className="block text-foreground/90 text-base sm:text-lg md:text-xl font-semibold mt-1">
                that turns learners into professionals
              </span>
            </h1>
            <p className="mt-3 text-sm text-foreground/70 max-w-lg">
              Instructor-led classes at our Nagpur center with small batches, hands-on labs and live projects, so you learn by doing and graduate job-ready.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-pink-500 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Book a Free Demo <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-foreground/80 bg-white/70 dark:bg-zinc-900/60 border border-violet-200/70 dark:border-violet-800/60 hover:border-pink-300 hover:-translate-y-0.5 transition-all"
              >
                Explore Courses
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative w-full max-w-sm mx-auto lg:mr-0 lg:ml-auto"
          >
            <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-violet-400/30 to-pink-400/30 blur-2xl" aria-hidden />
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-white/80 dark:border-zinc-800 shadow-2xl">
              <img
                src="/img/gallery/gallery-19.jpg"
                alt="Trainer guiding students in a live classroom session"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-5 left-4 sm:-left-5 flex items-center gap-3 px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 shadow-lg border border-violet-100 dark:border-violet-900">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center">
                <AcademicCapIcon className="w-4 h-4 text-white" />
              </span>
              <div>
                <p className="text-sm font-bold leading-tight">Expert Trainers</p>
                <p className="text-xs text-foreground/60">Industry-experienced mentors</p>
              </div>
            </div>
            <div className="absolute -top-4 right-4 sm:-right-4 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 shadow-lg border border-violet-100 dark:border-violet-900 text-center">
              <p className="text-base font-extrabold bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent leading-none">98%</p>
              <p className="text-[11px] text-foreground/60 mt-1">Success Rate</p>
            </div>
          </motion.div>
        </div>

        {/* ================= STATS ================= */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {stats.map((s, i) => (
            <motion.div key={s.label} {...fadeUp(i * 0.07)} className={`${card} p-2.5 text-center`}>
              <s.icon className="w-4 h-4 mx-auto text-pink-500" />
              <p className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">{s.value}</p>
              <p className="text-xs text-foreground/60">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* ================= WHY CLASSROOM ================= */}
        <div className="mt-10">
          <motion.div {...fadeUp()} className="text-center max-w-2xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold">Why Learn in the Classroom?</h2>
            <p className="mt-1 text-xs sm:text-sm text-foreground/70">A focused environment, real mentors and real practice.</p>
          </motion.div>
          <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {benefits.map((b, i) => (
              <motion.div key={b.title} {...fadeUp(i * 0.08)} whileHover={{ y: -6 }} className={`${card} p-3.5 hover:border-pink-300 hover:shadow-xl transition-shadow`}>
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center shadow-md shadow-violet-500/20">
                  <b.icon className="w-4 h-4 text-white" />
                </span>
                <h3 className="mt-2.5 text-sm font-bold">{b.title}</h3>
                <p className="mt-1 text-xs text-foreground/70">{b.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ================= BATCHES ================= */}
        <div className="mt-10">
          <motion.div {...fadeUp()} className="text-center max-w-2xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold">Choose Your Batch</h2>
            <p className="mt-1 text-xs sm:text-sm text-foreground/70">Flexible timings that fit your schedule.</p>
          </motion.div>
          <div className="mt-5 grid md:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {batches.map((b, i) => (
              <motion.div key={b.name} {...fadeUp(i * 0.1)} className={`${card} p-4 relative overflow-hidden`}>
                <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-gradient-to-br from-violet-300/40 to-pink-300/40 blur-2xl" aria-hidden />
                <div className="relative flex items-start gap-4">
                  <span className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center">
                    <b.icon className="w-4 h-4 text-white" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold">{b.name}</h3>
                    <p className="mt-0.5 text-xs font-semibold text-foreground/80">{b.days}</p>
                    <p className="text-lg font-extrabold bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">{b.time}</p>
                    <p className="mt-1 flex items-start gap-1.5 text-[11px] text-foreground/60">
                      <CheckCircleIcon className="w-4 h-4 mt-0.5 shrink-0 text-emerald-500" /> {b.note}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ================= HOW IT WORKS ================= */}
        <div className="mt-10">
          <motion.div {...fadeUp()} className="text-center max-w-2xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold">Your Journey With Us</h2>
            <p className="mt-1 text-xs sm:text-sm text-foreground/70">From first visit to first job in four simple steps.</p>
          </motion.div>
          <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((s, i) => (
              <motion.div key={s.n} {...fadeUp(i * 0.08)} className={`${card} p-3.5 relative`}>
                <span className="text-2xl font-black bg-gradient-to-br from-violet-500/40 to-pink-500/40 bg-clip-text text-transparent">{s.n}</span>
                <h3 className="mt-0.5 text-sm font-bold">{s.title}</h3>
                <p className="mt-1 text-xs text-foreground/70">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ================= COURSES ================= */}
        <div className="mt-10">
          <motion.div {...fadeUp()} className="text-center max-w-2xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold">Courses Available in Classroom</h2>
            <p className="mt-1 text-xs sm:text-sm text-foreground/70">Tap a course to see the syllabus, fees and projects.</p>
          </motion.div>
          <motion.div {...fadeUp(0.1)} className="mt-5 flex flex-wrap justify-center gap-1.5">
            {courses.map((c) => (
              <Link
                key={c.id}
                to={`/courses/${c.id}`}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/80 dark:bg-zinc-900/70 border border-violet-200/70 dark:border-violet-800/60 text-foreground/80 hover:text-white hover:bg-gradient-to-r hover:from-violet-600 hover:to-pink-500 hover:border-transparent hover:-translate-y-0.5 hover:shadow-lg transition-all"
              >
                {c.title}
              </Link>
            ))}
          </motion.div>
        </div>

        {/* ================= LOCATION + CTA ================= */}
        <motion.div
          {...fadeUp()}
          className="mt-10 relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-700 via-purple-700 to-pink-600 p-5 sm:p-6 text-white shadow-2xl"
        >
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-2xl" aria-hidden />
          <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-pink-300/20 blur-3xl" aria-hidden />
          <div className="relative grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">Visit Our Nagpur Center</h2>
              <p className="mt-1.5 text-white/85 text-xs sm:text-sm max-w-xl">
                Walk in, meet our trainers and sit in on a demo class. No commitment, just a real look at how we teach.
              </p>
              <p className="mt-3 flex items-center gap-2 text-xs sm:text-sm font-semibold">
                <MapPinIcon className="w-5 h-5" /> Ramdaspeth, Nagpur – 440010
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-white text-violet-700 hover:-translate-y-0.5 hover:shadow-xl transition-all"
              >
                Book a Free Demo <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <Link
                to="/courses"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold border border-white/40 hover:bg-white/10 transition-all"
              >
                View All Courses
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Gallery section (unchanged) */}
        <GallerySection compact />
      </section>
    </Layout>
  );
}
