// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Link } from "react-router-dom";
// import type { Course } from "@/data/courses";
// import {
//   SparklesIcon,
//   ClockIcon,
//   AcademicCapIcon,
//   ChartBarIcon,
//   PlayCircleIcon,
//   ChevronDownIcon,
//   CheckBadgeIcon,
//   ArrowRightIcon,
// } from "@heroicons/react/24/outline";

// export default function CourseCard({ course }: { course: Course }) {
//   const [isHovered, setIsHovered] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(false);

//   const cardVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { type: "spring", stiffness: 300, damping: 24 },
//     },
//     hover: {
//       y: -6,
//       scale: 1.02,
//       transition: { type: "spring", stiffness: 400, damping: 25 },
//     },
//   };

//   return (
//     <motion.article
//       variants={cardVariants}
//       initial="hidden"
//       animate="visible"
//       whileHover="hover"
//       onHoverStart={() => setIsHovered(true)}
//       onHoverEnd={() => setIsHovered(false)}
//       className="relative bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer max-w-sm mx-auto"
//       style={{
//         background: "white",
//         borderColor: "rgb(229 231 235)"
//       }}
//     >
//       {/* Background Highlight Effect - Removed colored overlay */}

//       {/* Course Image */}
//       <div className="relative overflow-hidden">
//         <motion.img
//           whileHover={{ scale: 1.08 }}
//           transition={{ duration: 0.4 }}
//           src={course.image}
//           alt={course.title}
//           className="w-full h-48 object-cover relative z-10"
//         />

//         {/* Enhanced Overlay */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

//         {/* Category Badge */}
//         <div className="absolute top-3 left-3 z-30">
//           <span
//             className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-full border border-gray-200 shadow-lg"
//             style={{ background: "white" }}
//           >
//             {course.category}
//           </span>
//         </div>

//         {/* Hover View Button */}
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           whileHover={{ opacity: 1, y: 0 }}
//           className="absolute bottom-3 right-3 z-30"
//         >
//           <Button
//             size="sm"
//             className="bg-white/95 backdrop-blur-sm text-gray-900 hover:bg-white border border-gray-200 shadow-lg rounded-full gap-1 text-xs"
//             style={{ background: "white" }}
//           >
//             <PlayCircleIcon className="w-3 h-3" />
//             Quick View
//           </Button>
//         </motion.div>
//       </div>

//       {/* Card Body */}
//       <div className="p-6 relative z-10" style={{ background: "white" }}>
//         {/* Progress Bar */}
//         <div className="h-1.5 w-full bg-gray-100 rounded-full mb-4 overflow-hidden">
//           <motion.div
//             initial={{ width: 0 }}
//             animate={{ width: "75%" }}
//             transition={{ delay: 0.3, duration: 0.8 }}
//             className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-sm"
//           />
//         </div>

//         {/* Title and Description */}
//         <div className="mb-4">
//           <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-gray-800 transition-colors">
//             {course.title}
//           </h3>

//           <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 group-hover:text-gray-700 transition-colors">
//             {course.short}
//           </p>
//         </div>

//         {/* Course Metadata */}
//         <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
//           <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
//             <AcademicCapIcon className="w-4 h-4 text-blue-600" />
//             <span className="font-medium text-gray-700">{course.level}</span>
//           </div>
//           <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
//             <ClockIcon className="w-4 h-4 text-purple-600" />
//             <span className="font-medium text-gray-700">{course.duration}</span>
//           </div>
//         </div>

//         {/* Expandable Details */}
//         <AnimatePresence>
//           {isExpanded && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               exit={{ opacity: 0, height: 0 }}
//               transition={{ duration: 0.3 }}
//               className="mb-4 space-y-3 overflow-hidden"
//             >
//               <div className="border-t border-gray-200 pt-4">
//                 <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-800">
//                   <CheckBadgeIcon className="w-4 h-4 text-blue-600" />
//                   Key Topics
//                 </h4>
//                 <div className="flex flex-wrap gap-2">
//                   {course.syllabus?.slice(0, 3).map((topic, index) => (
//                     <motion.span
//                       key={index}
//                       initial={{ opacity: 0, scale: 0.8 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       transition={{ delay: index * 0.1 }}
//                       className="px-3 py-1.5 bg-gray-50 text-gray-800 rounded-xl text-xs font-semibold border border-gray-200 shadow-sm"
//                     >
//                       {topic}
//                     </motion.span>
//                   ))}
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Action Section */}
//         <div className="flex items-center justify-between pt-2">
//           {/* Price and Expand Button */}
//           <div className="flex items-center gap-3">
//             <motion.span
//               className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
//               whileHover={{ scale: 1.05 }}
//             >
//               {course.fees}
//             </motion.span>
//             <motion.button
//               whileHover={{ scale: 1.1, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
//               whileTap={{ scale: 0.9 }}
//               onClick={() => setIsExpanded(!isExpanded)}
//               className="p-2 rounded-xl bg-gray-100 hover:bg-blue-100 transition-colors group/button"
//             >
//               <ChevronDownIcon
//                 className={`w-4 h-4 text-gray-600 group-hover/button:text-blue-600 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""
//                   }`}
//               />
//             </motion.button>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex items-center gap-2">
//             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//               <Link to={`/enroll/${course.id}`}>
//                 <Button
//                   className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold gap-2 rounded-xl"
//                 >
//                   <SparklesIcon className="w-4 h-4" />
//                   Enroll
//                 </Button>
//               </Link>
//             </motion.div>
//           </div>
//         </div>

//         {/* Explore Course CTA — centered, links to the dedicated course details page */}
//         <Link
//           to={`/courses/${course.id}`}
//           aria-label={`Explore ${course.title} course details`}
//           className="mt-4 block"
//         >
//           <motion.div
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             className="group/explore relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-blue-100 bg-blue-50/60 py-3 text-sm font-semibold text-blue-700 transition-colors duration-300 hover:border-transparent hover:text-white"
//           >
//             <span
//               aria-hidden="true"
//               className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 transition-opacity duration-300 group-hover/explore:opacity-100"
//             />
//             <span>Explore Course</span>
//             <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover/explore:translate-x-1" />
//           </motion.div>
//         </Link>
//       </div>

//       {/* Enhanced Hover Border Effect */}
//       <motion.div
//         animate={{ opacity: isHovered ? 1 : 0 }}
//         className="absolute inset-0 border-2 border-blue-200 rounded-2xl pointer-events-none shadow-2xl"
//       />
//     </motion.article>
//   );
// }
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { Course } from "@/data/courses";
import {
  SparklesIcon,
  ClockIcon,
  AcademicCapIcon,
  ChevronDownIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

// Deterministic 0-100 style width so every card doesn't show an identical
// bar — purely a decorative accent, not tied to any real metric.
function accentWidth(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) % 1000;
  return 55 + (hash % 40); // 55–94%
}

const LEVEL_STYLES: Record<string, { dot: string; text: string }> = {
  Beginner: { dot: "bg-emerald-500", text: "text-emerald-700" },
  Intermediate: { dot: "bg-amber-500", text: "text-amber-700" },
  Advanced: { dot: "bg-rose-500", text: "text-rose-700" },
};

export default function CourseCard({ course }: { course: Course }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const level = LEVEL_STYLES[course.level] ?? {
    dot: "bg-blue-500",
    text: "text-blue-700",
  };
  const accent = course.color || "from-blue-600 to-purple-600";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:border-blue-200 hover:shadow-xl hover:shadow-indigo-500/10"
    >
      {/* Course Image */}
      <div className="relative h-48 shrink-0 overflow-hidden sm:h-52">
        {!imgError ? (
          <img
            src={course.image}
            alt={course.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        ) : (
          <div
            className={`flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br ${accent} px-6 text-center text-white`}
          >
            <AcademicCapIcon className="h-10 w-10 opacity-90" aria-hidden="true" />
            <span className="text-sm font-semibold leading-snug">{course.title}</span>
          </div>
        )}

        {/* Gradient wash for badge legibility + hover depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-70 transition-opacity duration-300 group-hover:opacity-90" />

        {/* Category badge */}
        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#171034] shadow-sm backdrop-blur-sm">
            {course.category}
          </span>
        </div>

        {/* Level badge */}
        <div className="absolute right-3 top-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm">
            <span className={`h-1.5 w-1.5 rounded-full ${level.dot}`} />
            <span className={level.text}>{course.level}</span>
          </span>
        </div>

        {/* Duration chip on image */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <ClockIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {course.duration}
          </span>
        </div>
      </div>

      {/* Decorative accent bar */}
      <div className="h-1 w-full overflow-hidden bg-slate-100">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${accentWidth(course.id)}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${accent}`}
        />
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-[#171034] sm:text-xl">
          {course.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
          {course.short}
        </p>

        {/* Expand key topics */}
        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          className="mt-3 flex items-center gap-1.5 self-start text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700"
        >
          <CheckBadgeIcon className="h-4 w-4" aria-hidden="true" />
          Key topics
          <ChevronDownIcon
            className={`h-3.5 w-3.5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex flex-wrap gap-1.5">
                {course.syllabus?.slice(0, 3).map((topic, index) => (
                  <span
                    key={index}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Spacer pushes CTA row to the bottom for equal-height cards */}
        <div className="mt-4 flex-1" />

        {/* CTA row — pinned to bottom, consistent across every card */}
        <div className="mt-4 flex items-center gap-2.5 border-t border-slate-100 pt-4">
          <Link to={`/enroll/${course.id}`} className="flex-1">
            <motion.div whileTap={{ scale: 0.97 }}>
              <Button className="w-full gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 font-semibold text-white shadow-md shadow-indigo-600/20 transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg">
                {/* <SparklesIcon className="h-4 w-4" aria-hidden="true" /> */}
                Enroll
              </Button>
            </motion.div>
          </Link>

          <Link
            to={`/courses/${course.id}`}
            aria-label={`Explore ${course.title} course details`}
            className="flex-1"
          >
            <motion.div
              whileTap={{ scale: 0.97 }}
              className="group/explore flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border-2 border-blue-200 text-sm font-semibold text-blue-700 transition-colors duration-300 hover:border-blue-600 hover:bg-blue-50"
            >
              Explore
              <ArrowRightIcon
                className="h-4 w-4 transition-transform duration-300 ease-out group-hover/explore:translate-x-1"
                aria-hidden="true"
              />
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}