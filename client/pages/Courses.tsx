
import Layout from "@/components/site/Layout";
import CourseCard from "@/components/site/CourseCard";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { courses as staticCourses } from "@/data/courses";
import type { Course } from "@/data/courses";
import {
  SparklesIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  UsersIcon,
  BookOpenIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

const API_URL = import.meta.env.VITE_ADMIN_API_URL;

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const fadeInUp = (delay: number = 0) => ({
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: delay * 0.04 },
  },
});

const benefits = [
  { label: "Hands-on Projects" },
  { label: "Lifetime Access" },
  { label: "Certificate" },
  { label: "Mentor Support" },
];

const whyChooseUs = [
  { icon: BookOpenIcon, label: "Industry-aligned curriculum" },
  { icon: RocketLaunchIcon, label: "Real-world projects & case studies" },
  { icon: UsersIcon, label: "Expert instructors from top companies" },
  { icon: BriefcaseIcon, label: "Placement assistance" },
];

function normalizeCourse(raw: Record<string, unknown>): Course | null {
 const id = String(raw.slug ?? raw.id ?? "").trim();

if (!id) return null;

  const existing = staticCourses.find(
    (course) => course.id === id
  );

  // Keep admin-managed courses that are published.
  if (raw.published === false) return null;

  const stringArray = (value: unknown): string[] | undefined =>
    Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string")
      : undefined;

  const modules = Array.isArray(raw.modules)
    ? raw.modules.filter(
        (item): item is { title: string; topics: string[] } =>
          typeof item === "object" &&
          item !== null &&
          "title" in item &&
          typeof item.title === "string"
      ).map((item) => ({
        title: item.title,
        topics: Array.isArray(item.topics)
          ? item.topics.filter(
              (topic): topic is string => typeof topic === "string"
            )
          : [],
      }))
    : existing?.modules;

  return {
    ...(existing ?? {}),
    id,
    title:
      typeof raw.title === "string"
        ? raw.title
        : existing?.title ?? id,
    short:
      typeof raw.short === "string"
        ? raw.short
        : existing?.short ?? "",
    description:
      typeof raw.description === "string"
        ? raw.description
        : existing?.description ?? "",
    duration:
      typeof raw.duration === "string"
        ? raw.duration
        : existing?.duration ?? "",
    fees:
      typeof raw.fees === "string" || typeof raw.fees === "number"
        ? String(raw.fees)
        : existing?.fees ?? "",
    level:
      raw.level === "Beginner" ||
      raw.level === "Intermediate" ||
      raw.level === "Advanced"
        ? raw.level
        : existing?.level ?? "Beginner",
    category:
      typeof raw.category === "string"
        ? raw.category
        : existing?.category ?? "Other",
    syllabus: stringArray(raw.syllabus) ?? existing?.syllabus ?? [],
    modules,
    projects: stringArray(raw.projects) ?? existing?.projects,
    outcomes: stringArray(raw.outcomes) ?? existing?.outcomes ?? [],
    prerequisites:
      stringArray(raw.prerequisites) ?? existing?.prerequisites,
    schedule:
      typeof raw.schedule === "string"
        ? raw.schedule
        : existing?.schedule,
    image:
      typeof raw.image === "string"
        ? raw.image
        : existing?.image,
    certificate: existing?.certificate,
    demoVideo: existing?.demoVideo,
    color: existing?.color,
    bgColor: existing?.bgColor,
  };
}

export default function Courses() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("");
  const [level, setLevel] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>(staticCourses);
  const [loading, setLoading] = useState(Boolean(API_URL));
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    if (!API_URL) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadCourses() {
      try {
        const response = await fetch(
          `${API_URL.replace(/\/$/, "")}/api/courses`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`Courses API returned ${response.status}`);
        }

        const result: unknown = await response.json();

        // Support both a normal JSON array and a wrapped array response.
        const records = Array.isArray(result)
          ? result
          : typeof result === "object" &&
              result !== null &&
              "value" in result &&
              Array.isArray(result.value)
            ? result.value
            : null;

        if (!records) {
          throw new Error("Invalid courses API response");
        }

        const apiCourses = records
          .filter(
            (item): item is Record<string, unknown> =>
              typeof item === "object" && item !== null
          )
          .map(normalizeCourse)
          .filter((course): course is Course => course !== null);
        
          console.table(
  apiCourses.map((course) => ({
    title: course.title,
    id: course.id,
    category: course.category,
    level: course.level,
  }))
);
        setCourses(apiCourses);
        setApiError(false);
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("Unable to load courses from Admin API:", error);
        setCourses(staticCourses);
        setApiError(true);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadCourses();

    return () => controller.abort();
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(courses.map((course) => course.category))),
    [courses]
  );

  const levels = useMemo(
    () => Array.from(new Set(courses.map((course) => course.level))),
    [courses]
  );

  const filtered = useMemo(() => {
    return courses.filter((course) => {
      if (category && course.category !== category) return false;
      if (level && course.level !== level) return false;

      if (query) {
        const q = query.toLowerCase();

        return (
          course.title.toLowerCase().includes(q) ||
          course.short?.toLowerCase().includes(q) ||
          course.description.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [courses, query, category, level]);
  console.table(
  filtered.map((course) => ({
    title: course.title,
    id: course.id,
    category: course.category,
  }))
);

  const hasActiveFilters = Boolean(query || category || level);

  const clearFilters = () => {
    setQuery("");
    setCategory("");
    setLevel("");
  };

  return (
    <Layout>
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#c7d2fe_0.6px,transparent_1px)] dark:bg-[radial-gradient(#4338ca_0.6px,transparent_1px)] [background-size:44px_44px] opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/60 via-white to-white dark:from-indigo-950/30 dark:via-background dark:to-background" />
        <div className="absolute top-[-12%] right-[-8%] w-[600px] h-[600px] bg-blue-200/30 dark:bg-blue-600/10 rounded-full blur-[110px]" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] bg-purple-200/25 dark:bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      <section className="min-h-screen">
        <div className="container py-10 sm:py-14 lg:py-16">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#171034] dark:text-white sm:text-4xl md:text-5xl">
              Our{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Popular Courses
              </span>
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500 dark:text-slate-400 sm:text-base">
              Interactive, job-ready programs with hands-on projects,
              real-world case studies, and expert mentor support.
            </p>
          </motion.div>

          {/* Search and filters */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mx-auto mt-8 max-w-5xl"
          >
            <div className="flex flex-col divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white/90 shadow-md shadow-indigo-500/5 backdrop-blur-xl dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/90 sm:flex-row sm:divide-x sm:divide-y-0">
              <div className="relative flex flex-1 items-center px-4 py-3 sm:px-5">
                <MagnifyingGlassIcon className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search courses by title or keywords..."
                  aria-label="Search courses"
                  className="w-full bg-transparent pl-3 text-sm text-[#171034] outline-none placeholder:text-slate-400 dark:text-white"
                />
              </div>

              <div className="flex items-center px-4 py-3 sm:px-5">
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  aria-label="Filter by category"
                  className="w-full min-w-[150px] cursor-pointer bg-transparent text-sm font-medium text-[#171034] outline-none dark:text-white sm:w-auto"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center px-4 py-3 sm:px-5">
                <select
                  value={level}
                  onChange={(event) => setLevel(event.target.value)}
                  aria-label="Filter by level"
                  className="w-full min-w-[130px] cursor-pointer bg-transparent text-sm font-medium text-[#171034] outline-none dark:text-white sm:w-auto"
                >
                  <option value="">All Levels</option>
                  {levels.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              <AnimatePresence>
                {hasActiveFilters && (
                  <motion.button
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    onClick={clearFilters}
                    className="flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap px-5 py-3 text-sm font-semibold text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                  >
                    <XMarkIcon className="h-4 w-4" aria-hidden="true" />
                    Clear
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Course grid and sidebar */}
          <div className="mt-10 lg:flex lg:items-start lg:gap-8 xl:gap-10">
            <div className="min-w-0 flex-1">
              {loading && (
                <p className="mb-5 text-center text-sm text-slate-500 dark:text-slate-400">
                  Loading courses...
                </p>
              )}

              {apiError && (
                <p
                  role="status"
                  className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200"
                >
                  Unable to connect to the Admin API. Showing default courses instead.
                </p>
              )}

              
<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
  {filtered.map((course, index) => (
    <motion.div
      key={course.id}
      variants={fadeInUp(index)}
      className="h-full"
    >
      <CourseCard course={course} />
    </motion.div>
  ))}
</div>


              {filtered.length === 0 && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 text-center"
                >
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/50">
                    <SparklesIcon className="h-8 w-8 text-indigo-500" aria-hidden="true" />
                  </div>

                  <h3 className="mb-2 text-xl font-semibold text-[#171034] dark:text-white">
                    No courses found
                  </h3>

                  <p className="mx-auto max-w-sm text-sm text-slate-500 dark:text-slate-400">
                    We couldn't find any courses matching your filters. Try
                    adjusting your search or filters.
                  </p>

                  <button
                    onClick={clearFilters}
                    className="mx-auto mt-6 flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Clear all filters
                    <XMarkIcon className="h-4 w-4" aria-hidden="true" />
                  </button>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="mt-10 shrink-0 space-y-6 lg:mt-0 lg:w-[300px] lg:sticky lg:top-24 xl:w-[320px]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50/60 p-6 shadow-lg shadow-indigo-500/10 dark:border-indigo-900 dark:from-zinc-900 dark:to-indigo-950/40"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md">
                  <RocketLaunchIcon className="h-5 w-5" aria-hidden="true" />
                </div>

                <h3 className="mt-4 text-lg font-bold leading-snug text-[#171034] dark:text-white">
                  Ready to Start Learning?
                </h3>

                <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Join learners who transformed their careers with our tech courses.
                </p>

                <ul className="mt-5 space-y-2.5">
                  {benefits.map((benefit) => (
                    <li
                      key={benefit.label}
                      className="flex items-center justify-between gap-2 text-sm"
                    >
                      <span className="text-slate-600 dark:text-slate-300">
                        {benefit.label}
                      </span>
                      <CheckCircleIcon className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                    </li>
                  ))}
                </ul>

                <motion.a
                  href="/courses"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 block w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 text-center text-sm font-semibold text-white shadow-md shadow-indigo-600/25 transition-shadow hover:shadow-lg"
                >
                  Browse All Courses
                </motion.a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.18, duration: 0.5 }}
                className="rounded-2xl border border-slate-200 bg-white/90 p-6 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/90"
              >
                <h4 className="flex items-center gap-2 text-sm font-bold text-[#171034] dark:text-white">
                  <AcademicCapIcon className="h-4 w-4 text-indigo-600" aria-hidden="true" />
                  Why Choose Us?
                </h4>

                <ul className="mt-4 space-y-3.5">
                  {whyChooseUs.map(({ icon: Icon, label }) => (
                    <li key={label} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="text-sm leading-snug text-slate-600 dark:text-slate-300">
                        {label}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  );
}
