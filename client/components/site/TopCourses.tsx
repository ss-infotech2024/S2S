// components/site/TopCourses.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeInUp, stagger } from "@/lib/animations";
import {
  SparklesIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ArrowRightIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  features: string[];
}

interface TopCoursesProps {
  onCourseClick?: (courseId: string) => void;
  showViewAllButton?: boolean;
  limit?: number;
}

export default function TopCourses({
  onCourseClick,
  showViewAllButton = true,
  limit = 3,
}: TopCoursesProps) {
  const [hoveredCourse, setHoveredCourse] = useState<number | null>(null);
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
      id: "ai-data-analytics",
      title: "AI-Data Analytics",
      description: "AI-powered data analysis and machine learning applications",
      duration: "14 weeks",
      level: "Advanced",
      icon: AcademicCapIcon,
      color: "from-violet-500 to-fuchsia-500",
      features: ["ML Models", "Data Visualization", "Industry Projects"],
    },
  ];

  const displayedCourses = featuredCourses.slice(0, limit);

  // Always go to the course page; still notify the parent if it wants to know
  const handleCourseClick = (courseId: string) => {
    onCourseClick?.(courseId);
    navigate(`/courses/${courseId}`);
  };

  return (
    <section id="courses" className="py-14 sm:py-16 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl text-center mb-10 sm:mb-12"
        >

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
            Top Trending Courses
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Industry-relevant programs crafted with experts to fast-track your career in tech.
          </p>
        </motion.div>

        {/* Courses Grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto grid max-w-5xl gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {displayedCourses.map((course, i) => (
            <motion.div
              key={course.id}
              variants={fadeInUp(i * 0.08)}
              whileHover={{ y: -6 }}
              onHoverStart={() => setHoveredCourse(i)}
              onHoverEnd={() => setHoveredCourse(null)}
              onClick={() => handleCourseClick(course.id)}
              className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-violet-200 transition-all duration-300 cursor-pointer flex flex-col h-full"
            >
              {/* Top Gradient Accent */}
              <div
                className={`h-1.5 bg-gradient-to-r ${course.color} w-full`}
              />

              <div className="p-4 sm:p-5 flex-1 flex flex-col">
                {/* Icon */}
                <div
                  className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${course.color} text-white mb-4 w-fit shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}
                >
                  <course.icon className="w-5 h-5" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 tracking-tight mb-2 group-hover:text-violet-700 transition-colors">
                  {course.title}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed flex-1">
                  {course.description}
                </p>

                {/* Meta Info */}
                <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500 block text-xs tracking-widest">DURATION</span>
                    <span className="font-medium text-gray-900">{course.duration}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs tracking-widest">LEVEL</span>
                    <span className="font-medium text-gray-900">{course.level}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {course.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 text-[11px] font-medium bg-gray-100 text-gray-700 rounded-full transition-colors group-hover:bg-violet-100 group-hover:text-violet-700"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Footer — a real link, so the button always works */}
              <Link
                to={`/courses/${course.id}`}
                onClick={(e) => e.stopPropagation()}
                aria-label={`Explore ${course.title} course`}
                className="px-4 sm:px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between group-hover:bg-gradient-to-r group-hover:from-violet-50 group-hover:to-fuchsia-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              >
                <span className="font-semibold text-sm text-gray-900 group-hover:text-violet-700 transition-colors flex items-center gap-2">
                  Explore Course
                  <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
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
            className="flex justify-center mt-10 sm:mt-12"
          >
            <Link
              to="/courses"
              className="group inline-flex items-center gap-3 px-8 py-3 bg-gray-900 hover:bg-black text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30"
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