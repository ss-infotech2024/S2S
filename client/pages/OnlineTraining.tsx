import usePageMeta from "@/hooks/use-page-meta";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/site/Layout";
import { courses } from "../data/courses";
import CourseCard from "../components/site/CourseCard";
import GallerySection from "../components/site/GallerySection";
import {
  SparklesIcon,
  PlayCircleIcon,
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// ==================== DESIGN SYSTEM (matches Courses / CourseDetails) ====================
const TYPOGRAPHY = {
  h1: "text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-[1.15]",
  subtitle: "text-sm sm:text-base md:text-lg text-foreground/70",
};

const containerStagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const fadeInUp = (delay: number = 0) => ({
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: delay * 0.045, ease: "easeOut" },
  },
});

export default function OnlineTraining() {
  usePageMeta("Online Training", "Live online classes with recordings, projects and mentor support from industry practitioners.");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Extract unique categories and levels
  const categories = ["all", ...new Set(courses.map((course) => course.category))];
  const levels = ["all", ...new Set(courses.map((course) => course.level))];

  // Filter courses based on search and filters
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.short.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedLevel("all");
  };

  // Stats for the platform
  const stats = [
    { value: "10,000+", label: "Students Trained", icon: UserGroupIcon },
    { value: "98%", label: "Success Rate", icon: ChartBarIcon },
    { value: "24/7", label: "Mentor Support", icon: ClockIcon },
    { value: "50+", label: "Projects", icon: SparklesIcon },
  ];

  const hasActiveFilters = !!(searchTerm || selectedCategory !== "all" || selectedLevel !== "all");

  return (
    <Layout>
      {/* Elegant Purple/Pink Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#f5f2ff] dark:bg-[#0f0a1f]">
        <div className="absolute inset-0 bg-[radial-gradient(#c4b5fd_0.6px,transparent_1px)] dark:bg-[radial-gradient(#8b7cf0_0.6px,transparent_1px)] [background-size:50px_50px] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-violet-100/40 via-transparent to-pink-100/30 dark:from-violet-950/30 dark:via-transparent dark:to-pink-950/20" />
        <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-violet-300/25 dark:bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-15%] left-[-15%] w-[700px] h-[700px] bg-pink-300/25 dark:bg-pink-600/10 rounded-full blur-[110px]" />
      </div>

      <section className="container mx-auto px-4 pt-6 sm:pt-8 pb-12 sm:pb-16 md:pb-20 relative">
        {/* ===================== Hero Section (title top-left) ===================== */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl text-left mb-6 sm:mb-8"
        >
          <img
            src="/img/online-training-logo.svg"
            alt="SS Online Training – Skill 2 Success"
            className="h-16 sm:h-20 w-auto object-contain mb-3"
            draggable={false}
          />
          <h1 className={`${TYPOGRAPHY.h1} bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 bg-clip-text text-transparent`}>
            Online Training
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className={`${TYPOGRAPHY.subtitle} mt-3 leading-relaxed`}
          >
            Join live instructor-led online classes with recorded sessions, assignments, and
            <span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent font-semibold">
              {" "}
              AI-powered mentor support
            </span>
            .
          </motion.p>

          {/* Stats Strip */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-5 flex flex-wrap gap-2.5"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.07 }}
                whileHover={{ scale: 1.05, y: -3 }}
                className="flex items-center gap-2 pl-2.5 pr-3.5 py-2 rounded-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-violet-200/70 dark:border-violet-800/60 shadow-sm hover:shadow-md hover:border-pink-300 transition-all"
              >
                <stat.icon className="w-4 h-4 text-pink-500 shrink-0" />
                <span className="text-sm font-bold bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
                  {stat.value}
                </span>
                <span className="text-[11px] text-foreground/60">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* ===================== Search and Filters (compact navbar) ===================== */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mb-8 sm:mb-10 max-w-4xl"
        >
          <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl rounded-2xl border border-violet-200/80 dark:border-violet-800/80 p-2 sm:p-2.5 shadow-md">
            <div className="flex flex-col lg:flex-row gap-2 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 w-full">
                <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400" />
                <input
                  type="text"
                  placeholder="Search courses by title, technology, or topic..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-violet-200 dark:border-violet-700 focus:outline-none focus:border-pink-400 text-sm transition-all duration-300 placeholder:text-muted-foreground"
                />
              </div>

              {/* Filter Toggle for Mobile */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-violet-200 dark:border-violet-700 text-sm shadow-sm hover:border-pink-400 transition-colors"
              >
                <FunnelIcon className="w-4 h-4 text-violet-500" />
                <span className="text-foreground/80">Filters</span>
              </motion.button>

              {/* Desktop Filters */}
              <div className="hidden lg:flex items-center gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-violet-200 dark:border-violet-700 focus:outline-none focus:border-pink-400 text-sm cursor-pointer min-w-[140px] transition-all duration-300"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-violet-200 dark:border-violet-700 focus:outline-none focus:border-pink-400 text-sm cursor-pointer min-w-[120px] transition-all duration-300"
                >
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level === "all" ? "All Levels" : level}
                    </option>
                  ))}
                </select>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-800 hover:bg-pink-50 dark:hover:bg-pink-950 border border-violet-200 dark:border-violet-700 hover:border-pink-400 rounded-xl text-pink-500 hover:text-pink-600 transition-all font-medium text-sm"
                  >
                    <XMarkIcon className="w-3.5 h-3.5" />
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Filters */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="lg:hidden mt-3 space-y-3 overflow-hidden"
                >
                  <div className="flex gap-2">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-violet-200 dark:border-violet-700 text-sm"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </option>
                      ))}
                    </select>

                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-violet-200 dark:border-violet-700 text-sm"
                    >
                      {levels.map((level) => (
                        <option key={level} value={level}>
                          {level === "all" ? "All Levels" : level}
                        </option>
                      ))}
                    </select>
                  </div>

                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-800 border border-violet-200 dark:border-violet-700 rounded-xl text-pink-500 font-medium text-sm"
                    >
                      <XMarkIcon className="w-4 h-4" />
                      Clear filters
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ===================== Courses Grid ===================== */}
        <div className="relative mb-16 sm:mb-20">
          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-5 flex items-center justify-between px-1"
          >
            <p className="text-sm text-foreground/60">
              Showing <span className="font-semibold text-foreground">{filteredCourses.length}</span>{" "}
              {filteredCourses.length === 1 ? "course" : "courses"}
              {hasActiveFilters && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-2">
                  •{" "}
                  <button
                    onClick={clearFilters}
                    className="text-pink-500 hover:text-pink-600 hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    Clear filters
                    <XMarkIcon className="w-3.5 h-3.5" />
                  </button>
                </motion.span>
              )}
            </p>
          </motion.div>

          {/* Courses Grid — compact, 3-4 per row on desktop */}
          {filteredCourses.length > 0 ? (
            <motion.div
              layout
              variants={containerStagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch"
            >
              <AnimatePresence mode="popLayout">
                {filteredCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    layout
                    variants={fadeInUp(index)}
                    exit={{ opacity: 0, scale: 0.92, y: -16 }}
                    className="h-full"
                  >
                    <CourseCard course={course} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
                <MagnifyingGlassIcon className="w-9 h-9 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No courses found</h3>
              <p className="text-foreground/60 mb-6 max-w-sm mx-auto">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold shadow-lg shadow-pink-500/25 hover:shadow-xl transition-shadow"
              >
                Clear all filters
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* ===================== Gallery Section ===================== */}
        <GallerySection variant="marquee" />

        {/* ===================== CTA Section ===================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16 sm:mt-20"
        >
          <div className="rounded-3xl bg-gradient-to-br from-violet-50 to-pink-50 dark:from-violet-950 dark:to-pink-950 border border-violet-200 dark:border-violet-800 p-8 sm:p-12 shadow-2xl shadow-pink-500/10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
              Ready to Start Your AI Journey?
            </h2>
            <p className="text-base sm:text-lg text-foreground/70 mb-7 max-w-2xl mx-auto">
              Join thousands of students who have transformed their careers with our AI-powered learning platform.
            </p>
            <motion.a
              href="/courses"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-bold shadow-xl shadow-pink-500/25 hover:shadow-pink-500/40 transition-shadow"
            >
              <PlayCircleIcon className="w-5 h-5" />
              <span>Explore All Courses</span>
            </motion.a>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
}
