// components/site/TopCourses.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeInUp, stagger } from "@/lib/animations";
import {
  SparklesIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ArrowRightIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

interface Course {
  id: string; // must match an id in client/data/courses.ts → opens /courses/:id
  title: string;
  description: string;
  duration: string;
  level: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  features: string[];
}

interface TopCoursesProps {
  showViewAllButton?: boolean;
  limit?: number;
}

/**
 * "Explore Course" pill: hover keeps the existing arrow cross-fade. A click
 * additionally fires a one-shot rocket-launch sequence on the arrow —
 * ignition burst, tilt, accelerating diagonal ascent and fade-out — then the
 * replacement arrow eases back into the slot instead of just snapping back.
 */
function ExploreCourseButton({ courseId }: { courseId: string }) {
  const [phase, setPhase] = useState<"idle" | "launch" | "reenter">("idle");

  const launch = () => {
    setPhase("launch");
    window.setTimeout(() => setPhase("reenter"), 520);
    window.setTimeout(() => setPhase("idle"), 520 + 300);
  };

  return (
    <Link
      to={`/courses/${courseId}`}
      onClick={(e) => {
        e.stopPropagation();
        launch();
      }}
      className="group/btn inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-600 hover:text-white hover:shadow-lg hover:shadow-violet-600/25 active:translate-y-0 active:scale-95 active:duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
    >
      Explore Course
      <span className="relative flex h-4 w-4 items-center justify-center overflow-visible">
        {/* Ignition burst, only present during liftoff */}
        {phase === "launch" && (
          <span
            aria-hidden="true"
            className="animate-rocket-thrust absolute h-2.5 w-2.5 rounded-full bg-current opacity-70"
          />
        )}

        {phase === "idle" ? (
          <>
            {/* Resting arrow: hover cross-fade, as before */}
            <ArrowRightIcon className="absolute h-4 w-4 transition-all duration-300 ease-out group-hover/btn:translate-x-5 group-hover/btn:opacity-0" />
            <ArrowRightIcon className="absolute h-4 w-4 -translate-x-5 opacity-0 transition-all duration-300 ease-out group-hover/btn:translate-x-0 group-hover/btn:opacity-100" />
          </>
        ) : (
          <ArrowRightIcon
            key={phase}
            className={
              phase === "launch"
                ? "absolute h-4 w-4 animate-rocket-launch"
                : "absolute h-4 w-4 animate-rocket-reenter"
            }
          />
        )}
      </span>
    </Link>
  );
}

export default function TopCourses({
  showViewAllButton = true,
  limit = 3,
}: TopCoursesProps) {
  const navigate = useNavigate();

  const featuredCourses: Course[] = [
    {
      id: "python-dsa",
      title: "Python + DSA",
      description: "Master Python programming with advanced Data Structures and Algorithms",
      duration: "12 weeks",
      level: "Beginner to Advanced",
      icon: SparklesIcon,
      color: "from-orange-500 to-rose-500",
      features: ["Live Sessions", "100+ Problems", "Interview Prep"],
    },
    {
      id: "databricks",
      title: "Databricks",
      description: "Become an expert in big data processing and analytics",
      duration: "10 weeks",
      level: "Intermediate",
      icon: ChartBarIcon,
      color: "from-blue-500 to-cyan-500",
      features: ["Real Projects", "Cloud Integration", "Certification"],
    },
    {
      id: "data-analytics",
      title: "Data Analytics",
      description: "Data-driven analysis and machine learning applications",
      duration: "14 weeks",
      level: "Advanced",
      icon: AcademicCapIcon,
      color: "from-violet-500 to-fuchsia-500",
      features: ["ML Models", "Data Visualization", "Industry Projects"],
    },
  ];

  const displayedCourses = featuredCourses.slice(0, limit);

  return (
    <section id="courses" className="relative py-24 bg-white overflow-hidden">
      {/* Ambient background accents — subtle, keeps section from feeling flat */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-violet-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-fuchsia-100/50 blur-3xl" />

      <div className="container relative mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-violet-100 to-fuchsia-100 border border-violet-200 mb-6">
            <BriefcaseIcon className="w-5 h-5 text-violet-600" />
            <span className="text-sm font-semibold tracking-wide text-violet-700">
              INDUSTRY-READY LEARNING PATHS
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            Top Trending Courses
          </h2>
          <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">
            Industry-relevant programs crafted with experts to fast-track your career in tech.
          </p>
        </motion.div>

        {/* Courses Grid — compact cards, width-capped so they stay small on wide screens */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {displayedCourses.map((course, i) => (
            <motion.div
              key={course.id}
              variants={fadeInUp(i * 0.08)}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              onClick={() => navigate(`/courses/${course.id}`)}
              className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-violet-900/10 hover:border-violet-200/70 transition-[box-shadow,border-color] duration-300 cursor-pointer flex flex-col h-full"
            >
              {/* Soft gradient wash that fades in on hover, sits above the surface, below the content */}
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${course.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300`}
              />

              {/* Top Gradient Accent */}
              <div className={`h-1.5 bg-gradient-to-r ${course.color} w-full`} />

              <div className="relative p-6 flex-1 flex flex-col">
                {/* Icon + Level badge row */}
                <div className="flex items-start justify-between mb-5">
                  <div
                    className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${course.color} text-white shadow-md w-fit transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-3`}
                  >
                    <course.icon className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-widest text-gray-500 bg-gray-50 border border-gray-100 rounded-full">
                    {course.level}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 tracking-tight mb-2.5 transition-colors group-hover:text-violet-700">
                  {course.title}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed flex-1">
                  {course.description}
                </p>

                {/* Duration */}
                <div className="mt-6 pt-5 border-t border-gray-100 flex items-center gap-2 text-sm">
                  <span className="text-gray-500 text-[0.68rem] font-medium tracking-widest">DURATION</span>
                  <span className="h-1 w-1 rounded-full bg-gray-300" />
                  <span className="font-semibold text-gray-900">{course.duration}</span>
                </div>

                {/* Features */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {course.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-2.5 py-1 text-xs font-medium bg-gray-50 text-gray-700 border border-gray-100 rounded-full transition-colors duration-300 group-hover:bg-violet-50 group-hover:text-violet-700 group-hover:border-violet-100"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Footer — centered pill button, still a real link so keyboard/middle-click/"open in new tab" all work */}
              <div className="relative flex justify-center border-t border-gray-100 bg-gray-50/80 py-6 transition-colors duration-300 group-hover:bg-gradient-to-r group-hover:from-violet-50 group-hover:to-fuchsia-50">
                <ExploreCourseButton courseId={course.id} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        {showViewAllButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex justify-center mt-16"
          >
            <Link
              to="/courses"
              className="group inline-flex items-center gap-3 px-10 py-4 bg-gray-900 hover:bg-black text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30 hover:-translate-y-0.5"
            >
              View All Courses
              <EyeIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
