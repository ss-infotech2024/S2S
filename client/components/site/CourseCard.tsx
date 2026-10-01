import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { Course } from "@/data/courses";
import {
  SparklesIcon,
  ClockIcon,
  AcademicCapIcon,
  ChartBarIcon,
  PlayCircleIcon,
  ChevronDownIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

export default function CourseCard({ course }: { course: Course }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    hover: {
      y: -6,
      scale: 1.02,
      transition: { type: "spring", stiffness: 400, damping: 25 },
    },
  };

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer w-full h-full flex flex-col"
      style={{
        background: "white",
        borderColor: "rgb(229 231 235)"
      }}
    >
      {/* Background Highlight Effect - Removed colored overlay */}

      {/* Course Image */}
      <div className="relative overflow-hidden rounded-t-2xl">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          src={course.image}
          alt={course.title}
          className="w-full h-24 sm:h-28 object-cover object-center relative z-10"
        />

        {/* Subtle bottom fade so the card body meets the cover smoothly */}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent z-20" />

        {/* Enhanced Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

        {/* Category Badge */}
        <div className="absolute top-2 left-2 z-30">
          <span
            className="px-2.5 py-1 bg-white/95 backdrop-blur-sm text-gray-900 text-[10px] font-semibold rounded-full border border-gray-200 shadow-lg"
            style={{ background: "white" }}
          >
            {course.category}
          </span>
        </div>

        {/* Hover View Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute bottom-2 right-2 z-30"
        >
          <Button
            size="sm"
            className="h-6 px-2 bg-white/95 backdrop-blur-sm text-gray-900 hover:bg-white border border-gray-200 shadow-lg rounded-full gap-1 text-[10px]"
            style={{ background: "white" }}
          >
            <PlayCircleIcon className="w-3 h-3" />
            Quick View
          </Button>
        </motion.div>
      </div>

      {/* Card Body */}
      <div className="p-4 relative z-10 flex-1 flex flex-col" style={{ background: "white" }}>
        {/* Level Indicator */}
        <div className="flex items-center gap-1.5 mb-3">
          {["Beginner", "Intermediate", "Advanced"].map((lvl, i) => {
            const levelIndex = ["Beginner", "Intermediate", "Advanced"].indexOf(course.level);
            const filled = i <= levelIndex;
            return (
              <motion.div
                key={lvl}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
                style={{ transformOrigin: "left" }}
                className={`h-1.5 flex-1 rounded-full ${
                  filled ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-gray-100"
                }`}
              />
            );
          })}
        </div>

        {/* Title and Description */}
        <div className="mb-3">
          <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-gray-800 transition-colors">
            {course.title}
          </h3>

          <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 group-hover:text-gray-700 transition-colors">
            {course.short}
          </p>
        </div>

        {/* Course Metadata */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg">
            <AcademicCapIcon className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-medium text-gray-700">{course.level}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg">
            <ClockIcon className="w-3.5 h-3.5 text-purple-600" />
            <span className="font-medium text-gray-700">{course.duration}</span>
          </div>
        </div>

        {/* Expandable Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-3 space-y-3 overflow-hidden"
            >
              <div className="border-t border-gray-200 pt-3">
                <h4 className="text-xs font-semibold mb-2 flex items-center gap-1.5 text-gray-800">
                  <CheckBadgeIcon className="w-3.5 h-3.5 text-blue-600" />
                  Key Topics
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {course.syllabus?.slice(0, 3).map((topic, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="px-2 py-1 bg-gray-50 text-gray-800 rounded-xl text-[10px] font-semibold border border-gray-200 shadow-sm"
                    >
                      {topic}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Section */}
        <div className="flex items-center justify-between pt-1 mt-auto">
          {/* Price and Expand Button */}
          <div className="flex items-center gap-2">
            <motion.span
              className="text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              {course.fees}
            </motion.span>
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-xl bg-gray-100 hover:bg-blue-100 transition-colors group/button"
            >
              <ChevronDownIcon
                className={`w-3.5 h-3.5 text-gray-600 group-hover/button:text-blue-600 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""
                  }`}
              />
            </motion.button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to={`/courses/${course.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2.5 gap-1.5 text-gray-600 hover:text-gray-900 border-gray-300 hover:border-gray-400 bg-white rounded-xl font-medium text-xs"
                  style={{ background: "white" }}
                >
                  <PlayCircleIcon className="w-3.5 h-3.5" />
                  Preview
                </Button>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to={`/enroll/${course.id}`}>
                <Button
                  size="sm"
                  className="h-8 px-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold gap-1.5 rounded-xl text-xs"
                >
                  <SparklesIcon className="w-3.5 h-3.5" />
                  Enroll
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Hover Border Effect */}
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 border-2 border-blue-200 rounded-2xl pointer-events-none shadow-2xl"
      />
    </motion.article>
  );
}