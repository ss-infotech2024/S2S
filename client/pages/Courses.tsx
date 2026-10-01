import usePageMeta from "@/hooks/use-page-meta";
import Layout from "@/components/site/Layout";
import CourseCard from "@/components/site/CourseCard";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { courses } from "@/data/courses";
import {
  SparklesIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  AcademicCapIcon,
  UserGroupIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";

// Design System (kept consistent with CourseDetails)
const COLORS = {
  primary: "from-violet-400 to-pink-400",
  accent: "pink-400",
  bg: "bg-[#f5f2ff] dark:bg-[#0f0a1f]",
};

const TYPOGRAPHY = {
  h1: "text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.1]",
  subtitle: "text-[18px] sm:text-[19px] md:text-[20px] text-foreground/70",
};

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const fadeInUp = (delay: number = 0) => ({
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: delay * 0.03 },
  },
});

const STATS = [
  { icon: AcademicCapIcon, value: "9+", label: "Expert-Led Courses" },
  { icon: UserGroupIcon, value: "1200+", label: "Learners Trained" },
  { icon: BriefcaseIcon, value: "50+", label: "Hiring Partners" },
  { icon: StarSolid, value: "4.8", label: "Average Rating" },
];

export default function Courses() {
  usePageMeta("Courses", "Explore job-oriented courses in Python, Java, AI & Data Analytics, Cyber Security, Cloud and more with placement support.");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("");
  const [level, setLevel] = useState<string>("");

  const categories = useMemo(() => Array.from(new Set(courses.map((c) => c.category))), []);
  const levels = useMemo(() => Array.from(new Set(courses.map((c) => c.level))), []);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      if (category && c.category !== category) return false;
      if (level && c.level !== level) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          c.title.toLowerCase().includes(q) ||
          c.short?.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [query, category, level]);

  const clearFilters = () => {
    setQuery("");
    setCategory("");
    setLevel("");
  };

  return (
    <Layout>
      {/* Elegant Background (same as CourseDetails) */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#c4b5fd_0.6px,transparent_1px)] dark:bg-[radial-gradient(#8b7cf0_0.6px,transparent_1px)] [background-size:50px_50px] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-violet-100/40 via-transparent to-pink-100/30 dark:from-violet-950/30 dark:via-transparent dark:to-pink-950/20" />
        <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-violet-300/25 dark:bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-15%] left-[-15%] w-[700px] h-[700px] bg-pink-300/25 dark:bg-pink-600/10 rounded-full blur-[110px]" />
      </div>

      <section className={`min-h-screen ${COLORS.bg}`}>
        <div className="container py-12 sm:py-16 md:py-20 relative">
          <div className="grid gap-10 lg:gap-14 md:grid-cols-12">
            
            {/* ===================== LEFT SIDE - Main Content ===================== */}
            <div className="md:col-span-8 space-y-12">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center md:text-left"
              >
                <h1 className={`${TYPOGRAPHY.h1} bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 bg-clip-text text-transparent`}>
                  Our Popular Courses
                </h1>
                <p className={`${TYPOGRAPHY.subtitle} mt-3 max-w-2xl md:mx-0 mx-auto`}>
                  Interactive, job-ready programs with hands-on projects, real-world case studies, and expert mentor support.
                </p>

                {/* Trust Stats Strip */}
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-2xl md:mx-0 mx-auto">
                  {STATS.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.05 }}
                      className="flex flex-col items-center md:items-start gap-1 rounded-xl bg-white/70 dark:bg-zinc-900/70 border border-violet-200/70 dark:border-violet-800/60 px-3 py-2.5 backdrop-blur-md"
                    >
                      <stat.icon className="w-4 h-4 text-pink-500" />
                      <span className="text-2xl font-bold text-foreground leading-none">{stat.value}</span>
                      <span className="text-xs uppercase tracking-wide text-foreground/60 text-center md:text-left">
                        {stat.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Filters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl rounded-3xl border border-violet-200/80 dark:border-violet-800/80 p-3 md:p-4 shadow-xl">
                  <div className="flex flex-col lg:flex-row gap-2.5">
                    {/* Search */}
                    <div className="relative flex-1">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400">
                        <MagnifyingGlassIcon className="w-4 h-4" />
                      </div>
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search courses by title or keywords..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-800 border border-violet-200 dark:border-violet-700 rounded-2xl focus:outline-none focus:border-pink-400 text-sm placeholder:text-muted-foreground"
                      />
                    </div>

                    {/* Category Filter */}
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="px-4 py-2.5 bg-white dark:bg-zinc-800 border border-violet-200 dark:border-violet-700 rounded-2xl focus:outline-none focus:border-pink-400 text-sm cursor-pointer min-w-[150px]"
                    >
                      <option value="">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>

                    {/* Level Filter */}
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="px-4 py-2.5 bg-white dark:bg-zinc-800 border border-violet-200 dark:border-violet-700 rounded-2xl focus:outline-none focus:border-pink-400 text-sm cursor-pointer min-w-[130px]"
                    >
                      <option value="">All Levels</option>
                      {levels.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>

                    {/* Clear Filters */}
                    {(query || category || level) && (
                      <button
                        onClick={clearFilters}
                        className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-white dark:bg-zinc-800 hover:bg-pink-50 dark:hover:bg-pink-950 border border-violet-200 dark:border-violet-700 hover:border-pink-400 rounded-2xl text-pink-500 hover:text-pink-600 transition-all font-medium text-sm"
                      >
                        <XMarkIcon className="w-4 h-4" />
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Results Count */}
              <div className="flex items-center justify-between px-1">
                <p className="text-sm text-foreground/60">
                  Showing <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
                  {filtered.length === 1 ? "course" : "courses"}
                </p>
              </div>

              {/* Courses Grid */}
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-stretch"
              >
                {filtered.map((course, index) => (
                  <motion.div
                    key={course.id}
                    variants={fadeInUp(index)}
                    className="h-full"
                  >
                    <CourseCard course={course} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Empty State */}
              {filtered.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <div className="mx-auto w-20 h-20 bg-violet-100 dark:bg-violet-900/50 rounded-3xl flex items-center justify-center mb-6">
                    <SparklesIcon className="w-10 h-10 text-violet-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground mb-3">No courses found</h3>
                  <p className="text-foreground/60 max-w-sm mx-auto">
                    We couldn't find any courses matching your filters. Try adjusting your search or filters.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-8 text-pink-500 hover:text-pink-600 font-medium flex items-center gap-2 mx-auto"
                  >
                    Clear all filters <XMarkIcon className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </div>

            {/* ===================== RIGHT SIDE - Sidebar (Sticky) ===================== */}
            <div className="md:col-span-4 space-y-8 lg:sticky lg:top-10 self-start">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="rounded-3xl bg-gradient-to-br from-violet-50 to-pink-50 dark:from-violet-950 dark:to-pink-950 p-9 border border-violet-200 dark:border-violet-800 shadow-2xl shadow-pink-500/10">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-400 to-pink-400 text-white mb-6">
                      <SparklesIcon className="w-9 h-9" />
                    </div>
                    <h3 className="text-3xl font-bold text-violet-700 dark:text-violet-300 tracking-tight">
                      Ready to Start Learning?
                    </h3>
                    <p className="mt-4 text-foreground/70 leading-relaxed">
                      Join thousands of learners who transformed their careers with our premium AI &amp; tech courses.
                    </p>
                  </div>

                  <div className="mt-10 space-y-6 text-sm">
                    <div className="flex justify-between py-3 border-b border-violet-200 dark:border-violet-800">
                      <span className="text-muted-foreground">Hands-on Projects</span>
                      <span className="font-medium text-emerald-500">✓ Included</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-violet-200 dark:border-violet-800">
                      <span className="text-muted-foreground">Lifetime Access</span>
                      <span className="font-medium text-emerald-500">✓ Included</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-violet-200 dark:border-violet-800">
                      <span className="text-muted-foreground">Certificate</span>
                      <span className="font-medium text-emerald-500">✓ Included</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-muted-foreground">Mentor Support</span>
                      <span className="font-medium text-emerald-500">✓ Included</span>
                    </div>
                  </div>

                  <motion.a
                    href="/courses"
                    whileHover={{ scale: 1.02 }}
                    className="mt-10 block w-full text-center bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold text-lg py-4 px-8 rounded-2xl shadow-lg shadow-pink-500/30 hover:shadow-xl transition-all"
                  >
                    Browse All Courses
                  </motion.a>
                </div>
              </motion.div>

              {/* Extra Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="rounded-3xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-violet-200/60 dark:border-violet-800/60 p-8">
                  <h4 className="font-semibold text-xl mb-4 text-violet-700 dark:text-violet-300">
                    Why Choose Us?
                  </h4>
                  <ul className="space-y-4 text-sm text-foreground/70">
                    {[
                      "Industry-aligned curriculum",
                      "Real-world projects & case studies",
                      "Expert instructors from top companies",
                      "Placement assistance",
                    ].map((item) => (
                      <li key={item} className="flex gap-3 items-start">
                        <StarSolid className="w-4 h-4 text-pink-400 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}