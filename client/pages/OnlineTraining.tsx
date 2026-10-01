// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Layout from "@/components/site/Layout";
// import { Link } from "react-router-dom";
// import { courses } from "../data/courses";
// import CourseCard from "../components/site/CourseCard";
// import GallerySection from "../components/site/GallerySection";
// import {
//   SparklesIcon,
//   PlayCircleIcon,
//   ClockIcon,
//   UserGroupIcon,
//   ChartBarIcon,
//   MagnifyingGlassIcon,
//   FunnelIcon,
//   XMarkIcon,
//   AcademicCapIcon,
//   TrophyIcon,
//   StarIcon
// } from "@heroicons/react/24/outline";

// export default function OnlineTraining() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [selectedLevel, setSelectedLevel] = useState("all");
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [hoveredCard, setHoveredCard] = useState(null);

//   // Extract unique categories and levels
//   const categories = ["all", ...new Set(courses.map(course => course.category))];
//   const levels = ["all", ...new Set(courses.map(course => course.level))];

//   // Filter courses based on search and filters
//   const filteredCourses = courses.filter(course => {
//     const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       course.short.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
//     const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;

//     return matchesSearch && matchesCategory && matchesLevel;
//   });

//   // Stats for the platform
//   const stats = [
//     { value: "10,000+", label: "Students Trained", icon: UserGroupIcon },
//     { value: "98%", label: "Success Rate", icon: ChartBarIcon },
//     { value: "24/7", label: "Mentor Support", icon: ClockIcon },
//     { value: "50+", label: "Projects", icon: SparklesIcon }
//   ];

//   return (
//     <Layout>
//       {/* Full-width white background */}
//       <div className="fixed inset-0 -z-10 bg-white w-screen h-screen" />

//       <section className="container mx-auto px-4 py-16 relative">
//         {/* Hero Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="mx-auto max-w-4xl text-center mb-16"
//         >
//           <motion.div
//             initial={{ opacity: 0, scale: 0.5 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.2, type: "spring" }}
//             className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200 mb-6"
//           >
//             <AcademicCapIcon className="w-4 h-4 text-blue-600" />
//             <span className="text-sm font-semibold text-blue-600">Live Online Learning Platform</span>
//           </motion.div>

//           <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900">
//             Online Training
//           </h1>

//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
//           >
//             Join live instructor-led online classes with recorded sessions, assignments, and
//             <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold"> dedicated mentor support</span>.
//           </motion.p>

//           {/* Stats Grid */}
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.6 }}
//             className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
//           >
//             {stats.map((stat, index) => (
//               <motion.div
//                 key={stat.label}
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: 0.8 + index * 0.1 }}
//                 whileHover={{ scale: 1.05, y: -5 }}
//                 className="text-center p-4 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
//               >
//                 <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
//                 <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                   {stat.value}
//                 </div>
//                 <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
//               </motion.div>
//             ))}
//           </motion.div>
//         </motion.div>

//         {/* Search and Filters */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.8 }}
//           className="mb-12"
//         >
//           <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
//             {/* Search Bar */}
//             <div className="relative flex-1 max-w-2xl w-full">
//               <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search courses by title, technology, or topic..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm"
//               />
//             </div>

//             {/* Filter Toggle for Mobile */}
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setIsFilterOpen(!isFilterOpen)}
//               className="lg:hidden flex items-center gap-2 px-6 py-4 rounded-2xl bg-white border border-gray-300 shadow-sm hover:shadow-md transition-shadow"
//             >
//               <FunnelIcon className="w-5 h-5 text-gray-600" />
//               <span className="text-gray-700">Filters</span>
//             </motion.button>

//             {/* Desktop Filters */}
//             <div className="hidden lg:flex items-center gap-4">
//               <select
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 className="px-4 py-3 rounded-2xl bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm"
//               >
//                 {categories.map(category => (
//                   <option key={category} value={category}>
//                     {category === "all" ? "All Categories" : category}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 value={selectedLevel}
//                 onChange={(e) => setSelectedLevel(e.target.value)}
//                 className="px-4 py-3 rounded-2xl bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm"
//               >
//                 {levels.map(level => (
//                   <option key={level} value={level}>
//                     {level === "all" ? "All Levels" : level}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Mobile Filters */}
//           <AnimatePresence>
//             {isFilterOpen && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: "auto" }}
//                 exit={{ opacity: 0, height: 0 }}
//                 className="lg:hidden mt-4 space-y-4 overflow-hidden"
//               >
//                 <div className="flex gap-4">
//                   <select
//                     value={selectedCategory}
//                     onChange={(e) => setSelectedCategory(e.target.value)}
//                     className="flex-1 px-4 py-3 rounded-2xl bg-white border border-gray-300 shadow-sm"
//                   >
//                     {categories.map(category => (
//                       <option key={category} value={category}>
//                         {category === "all" ? "All Categories" : category}
//                       </option>
//                     ))}
//                   </select>

//                   <select
//                     value={selectedLevel}
//                     onChange={(e) => setSelectedLevel(e.target.value)}
//                     className="flex-1 px-4 py-3 rounded-2xl bg-white border border-gray-300 shadow-sm"
//                   >
//                     {levels.map(level => (
//                       <option key={level} value={level}>
//                         {level === "all" ? "All Levels" : level}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </motion.div>

//         {/* Courses Grid */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 1 }}
//           className="relative mb-20"
//         >
//           {/* Results Count */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="mb-6 flex items-center justify-between"
//           >
//             <p className="text-gray-600">
//               Showing <span className="font-semibold text-gray-900">{filteredCourses.length}</span> courses
//               {(searchTerm || selectedCategory !== "all" || selectedLevel !== "all") && (
//                 <motion.span
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className="ml-2"
//                 >
//                   •{" "}
//                   <button
//                     onClick={() => {
//                       setSearchTerm("");
//                       setSelectedCategory("all");
//                       setSelectedLevel("all");
//                     }}
//                     className="text-blue-600 hover:underline flex items-center gap-1"
//                   >
//                     Clear filters
//                     <XMarkIcon className="w-4 h-4" />
//                   </button>
//                 </motion.span>
//               )}
//             </p>
//           </motion.div>

//           {/* Courses Grid */}
//           {filteredCourses.length > 0 ? (
//             <motion.div
//               layout
//               className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
//             >
//               <AnimatePresence mode="popLayout">
//                 {filteredCourses.map((course, index) => (
//                   <motion.div
//                     key={course.id}
//                     layout
//                     initial={{ opacity: 0, scale: 0.9, y: 20 }}
//                     animate={{ opacity: 1, scale: 1, y: 0 }}
//                     exit={{ opacity: 0, scale: 0.9, y: -20 }}
//                     transition={{
//                       type: "spring",
//                       stiffness: 300,
//                       damping: 30,
//                       delay: index * 0.1
//                     }}
//                     whileHover={{ y: -5 }}
//                     onHoverStart={() => setHoveredCard(course.id)}
//                     onHoverEnd={() => setHoveredCard(null)}
//                   >
//                     <CourseCard course={course} />
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//             </motion.div>
//           ) : (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-center py-16"
//             >
//               <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
//                 <MagnifyingGlassIcon className="w-10 h-10 text-gray-400" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
//               <p className="text-gray-600 mb-6">
//                 Try adjusting your search or filters to find what you're looking for.
//               </p>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => {
//                   setSearchTerm("");
//                   setSelectedCategory("all");
//                   setSelectedLevel("all");
//                 }}
//                 className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-shadow"
//               >
//                 Clear all filters
//               </motion.button>
//             </motion.div>
//           )}
//         </motion.div>

//         {/* Gallery Section */}
//         <GallerySection />

//         {/* CTA Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 1.6 }}
//           className="text-center"
//         >
//           <div className="rounded-3xl bg-white border border-blue-200 p-12">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//               Ready to Start Your Learning Journey?
//             </h2>
//             <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
//               Join thousands of students who have transformed their careers with our online learning platform.
//             </p>
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow"
//             >
//               <PlayCircleIcon className="w-5 h-5" />
//               <span>Explore All Courses</span>
//             </motion.div>
//           </div>
//         </motion.div>
//       </section>
//     </Layout>
//   );
// }
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/site/Layout";
import { Link } from "react-router-dom";
import { courses } from "../data/courses";
import CourseCard from "../components/site/CourseCard";
import GallerySection from "../components/site/GallerySection";
import {
  SparklesIcon,
  PlayCircleIcon,
  ClockIcon,
  UserGroupIcon,
  VideoCameraIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  SignalIcon,
  ComputerDesktopIcon,
  PencilSquareIcon,
  RocketLaunchIcon,
  TrophyIcon,
  WifiIcon,
} from "@heroicons/react/24/outline";

// ---------------------------------------------------------------------------
// Static content for the new EdTech-style Online Training sections
// ---------------------------------------------------------------------------

const highlights = [
  {
    icon: SignalIcon,
    title: "Live Classes",
    desc: "Real-time instructor-led sessions with interactive Q&A.",
    color: "from-blue-600 to-indigo-600",
  },
  {
    icon: VideoCameraIcon,
    title: "Recorded Sessions",
    desc: "Lifetime access to recordings — learn at your own pace.",
    color: "from-purple-600 to-fuchsia-600",
  },
  {
    icon: AcademicCapIcon,
    title: "Expert Trainers",
    desc: "Learn from industry professionals with real project experience.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: "Doubt Support",
    desc: "Dedicated mentors to clear your doubts, anytime you're stuck.",
    color: "from-indigo-600 to-blue-600",
  },
  {
    icon: CheckBadgeIcon,
    title: "Certificates",
    desc: "Industry-recognized certification on successful completion.",
    color: "from-fuchsia-600 to-purple-600",
  },
];

const learningModes = [
  {
    icon: SignalIcon,
    title: "Live",
    tagline: "Real-time, interactive",
    points: [
      "Instructor-led online sessions",
      "Live doubt-solving & discussions",
      "Fixed weekly schedule",
    ],
    accent: "from-blue-600 to-indigo-600",
    ring: "hover:border-blue-300",
  },
  {
    icon: VideoCameraIcon,
    title: "Recorded",
    tagline: "Self-paced, flexible",
    points: [
      "Learn anytime, anywhere",
      "Lifetime access to content",
      "Pause, rewind & revise freely",
    ],
    accent: "from-purple-600 to-fuchsia-600",
    ring: "hover:border-purple-300",
  },
  {
    icon: ComputerDesktopIcon,
    title: "Hybrid",
    tagline: "Best of both worlds",
    points: [
      "Live classes + recorded backup",
      "Mentor support on both tracks",
      "Ideal for working professionals",
    ],
    accent: "from-pink-500 to-purple-600",
    ring: "hover:border-pink-300",
  },
];

const howItWorks = [
  {
    step: "01",
    icon: PencilSquareIcon,
    title: "Enroll",
    desc: "Pick your course and secure your seat in a few clicks.",
  },
  {
    step: "02",
    icon: AcademicCapIcon,
    title: "Learn",
    desc: "Attend live or recorded classes led by expert trainers.",
  },
  {
    step: "03",
    icon: RocketLaunchIcon,
    title: "Practice",
    desc: "Build real projects, assignments and hands-on labs.",
  },
  {
    step: "04",
    icon: TrophyIcon,
    title: "Get Certified",
    desc: "Clear assessments and earn your industry-ready certificate.",
  },
];

const upcomingBatches = [
  {
    course: "Full-Stack Java Developer",
    mode: "Live",
    date: "06 Oct 2026",
    time: "7:00 AM – 8:30 AM IST",
  },
  {
    course: "Python & DSA",
    mode: "Hybrid",
    date: "13 Oct 2026",
    time: "8:00 PM – 9:30 PM IST",
  },
  {
    course: "Data Analytics",
    mode: "Live",
    date: "20 Oct 2026",
    time: "7:30 AM – 9:00 AM IST",
  },
  {
    course: "Microsoft Azure Cloud",
    mode: "Recorded",
    date: "Starts Anytime",
    time: "Self-paced",
  },
];

const modeBadgeStyle: Record<string, string> = {
  Live: "bg-blue-100 text-blue-700",
  Recorded: "bg-purple-100 text-purple-700",
  Hybrid: "bg-pink-100 text-pink-700",
};

export default function OnlineTraining() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = ["all", ...new Set(courses.map((course) => course.category))];
  const levels = ["all", ...new Set(courses.map((course) => course.level))];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.short.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const stats = [
    { value: "10,000+", label: "Students Trained", icon: UserGroupIcon },
    { value: "98%", label: "Success Rate", icon: TrophyIcon },
    { value: "24/7", label: "Mentor Support", icon: ChatBubbleLeftRightIcon },
    { value: "50+", label: "Projects", icon: SparklesIcon },
  ];

  return (
    <Layout>
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-indigo-50 via-white to-purple-50 w-screen h-screen" />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#2e1065] to-[#312e81] text-white">
        {/* Decorative glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-pink-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="container mx-auto px-4 py-16 md:py-20 relative">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left: copy */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-5"
              >
                <WifiIcon className="w-4 h-4 text-pink-300" />
                <span className="text-sm font-semibold text-pink-100">
                  Live Online Learning Platform
                </span>
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                Learn Online with{" "}
                <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  SS Training Center
                </span>
              </h1>

              <p className="mt-5 text-lg text-indigo-100/90 max-w-xl leading-relaxed">
                Join live instructor-led classes, revisit recorded sessions anytime,
                get doubt support from mentors, and earn an industry-ready
                certificate — all from home.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/courses">
                  <motion.span
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 font-bold shadow-lg shadow-purple-900/40 hover:shadow-xl transition-shadow"
                  >
                    <PlayCircleIcon className="w-5 h-5" />
                    Explore Courses
                  </motion.span>
                </Link>
                <Link to="/contact">
                  <motion.span
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 border border-white/25 font-semibold hover:bg-white/20 transition-colors"
                  >
                    Talk to a Counselor
                    <ArrowRightIcon className="w-4 h-4" />
                  </motion.span>
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.08 }}
                    className="rounded-xl bg-white/8 border border-white/15 px-3 py-3 text-center backdrop-blur-sm"
                  >
                    <stat.icon className="w-5 h-5 text-pink-300 mx-auto mb-1.5" />
                    <div className="text-lg font-bold">{stat.value}</div>
                    <div className="text-[11px] text-indigo-200/80 leading-tight mt-0.5">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: highlight cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="grid grid-cols-2 gap-4"
            >
              {highlights.map((h, i) => (
                <motion.div
                  key={h.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className={`rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm p-4 sm:p-5 ${
                    i === 4 ? "col-span-2" : ""
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${h.color} flex items-center justify-center mb-3 shadow-md`}
                  >
                    <h.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="font-bold text-sm">{h.title}</div>
                  <div className="text-xs text-indigo-200/80 mt-1 leading-relaxed">
                    {h.desc}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= LEARNING MODES ================= */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-10"
          >
            <span className="text-sm font-bold uppercase tracking-wide text-purple-600">
              Flexible Learning
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#171034] mt-2">
              Choose Your Learning Mode
            </h2>
            <p className="text-slate-600 mt-3">
              Live, recorded or a mix of both — learn the way that fits your schedule.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {learningModes.map((mode, i) => (
              <motion.div
                key={mode.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -6 }}
                className={`rounded-2xl border-2 border-slate-100 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 ${mode.ring}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mode.accent} flex items-center justify-center mb-4 shadow-md`}
                >
                  <mode.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#171034]">{mode.title}</h3>
                <p className="text-sm font-semibold text-purple-600 mb-3">{mode.tagline}</p>
                <ul className="space-y-2">
                  {mode.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckBadgeIcon className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <span className="text-sm font-bold uppercase tracking-wide text-blue-600">
              Simple Process
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#171034] mt-2">
              How It Works
            </h2>
          </motion.div>

          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-8 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300" />

            {howItWorks.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.12 }}
                className="relative text-center"
              >
                <div className="relative z-10 mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25 mb-4">
                  <s.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-xs font-bold text-pink-500 mb-1">STEP {s.step}</div>
                <h3 className="text-lg font-bold text-[#171034]">{s.title}</h3>
                <p className="text-sm text-slate-600 mt-1.5 max-w-[180px] mx-auto leading-relaxed">
                  {s.desc}
                </p>
                {i < howItWorks.length - 1 && (
                  <ArrowRightIcon className="hidden md:block absolute top-6 -right-4 w-5 h-5 text-purple-300" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= COURSES ================= */}
      <section id="courses" className="bg-white">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-10"
          >
            <span className="text-sm font-bold uppercase tracking-wide text-purple-600">
              Our Programs
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#171034] mt-2">
              Choose Your Online Course
            </h2>
            <p className="text-slate-600 mt-3">
              Job-ready, project-driven programs designed with industry mentors.
            </p>
          </motion.div>

          {/* Search & Filters */}
          <div className="mb-10">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-2xl w-full">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search courses by title, technology, or topic..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>

              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200"
              >
                <FunnelIcon className="w-5 h-5 text-slate-600" />
                <span className="text-slate-700">Filters</span>
              </button>

              <div className="hidden lg:flex items-center gap-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500"
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
                  className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500"
                >
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level === "all" ? "All Levels" : level}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="lg:hidden mt-4 flex gap-3 overflow-hidden"
                >
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200"
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
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    {levels.map((level) => (
                      <option key={level} value={level}>
                        {level === "all" ? "All Levels" : level}
                      </option>
                    ))}
                  </select>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-slate-600 mt-5">
              Showing <span className="font-semibold text-[#171034]">{filteredCourses.length}</span>{" "}
              courses
              {(searchTerm || selectedCategory !== "all" || selectedLevel !== "all") && (
                <>
                  {" "}
                  •{" "}
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                      setSelectedLevel("all");
                    }}
                    className="text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    Clear filters <XMarkIcon className="w-4 h-4" />
                  </button>
                </>
              )}
            </p>
          </div>

          {filteredCourses.length > 0 ? (
            <motion.div layout className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filteredCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    layout
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <CourseCard course={course} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-slate-100 flex items-center justify-center">
                <MagnifyingGlassIcon className="w-9 h-9 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-[#171034] mb-2">No courses found</h3>
              <p className="text-slate-600 mb-6">Try adjusting your search or filters.</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedLevel("all");
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-md"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ================= UPCOMING BATCHES ================= */}
      <section className="bg-gradient-to-br from-[#1e1b4b] via-[#2e1065] to-[#312e81] text-white">
        <div className="container mx-auto px-4 py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-10"
          >
            <span className="text-sm font-bold uppercase tracking-wide text-pink-300">
              Don't Miss Out
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-2">Upcoming Online Batches</h2>
            <p className="text-indigo-200/80 mt-3">
              Reserve your seat in the next live cohort or start a self-paced track today.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {upcomingBatches.map((batch, i) => (
              <motion.div
                key={batch.course + i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm p-5 flex flex-col"
              >
                <span
                  className={`self-start px-2.5 py-1 rounded-full text-[11px] font-bold mb-3 ${modeBadgeStyle[batch.mode]}`}
                >
                  {batch.mode}
                </span>
                <h3 className="font-bold text-base leading-snug mb-3">{batch.course}</h3>
                <div className="space-y-1.5 text-sm text-indigo-100/85 mb-4">
                  <div className="flex items-center gap-2">
                    <CalendarDaysIcon className="w-4 h-4 text-pink-300 shrink-0" />
                    {batch.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-pink-300 shrink-0" />
                    {batch.time}
                  </div>
                </div>
                <Link to="/contact" className="mt-auto">
                  <motion.span
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-sm font-bold shadow-md hover:shadow-lg transition-shadow"
                  >
                    Enquire Now
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </motion.span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= GALLERY ================= */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-14">
          <GallerySection />
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-10 md:p-14 text-center text-white shadow-xl shadow-purple-500/20"
          >
            <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-pink-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-blue-300/20 blur-3xl" />

            <h2 className="relative text-3xl md:text-4xl font-extrabold mb-4">
              Start Learning Online Today
            </h2>
            <p className="relative text-lg text-indigo-100/90 mb-8 max-w-2xl mx-auto">
              Join thousands of students building real careers with live classes,
              expert mentors and certified outcomes.
            </p>
            <div className="relative flex flex-wrap items-center justify-center gap-4">
              <Link to="#courses">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-indigo-700 font-bold shadow-lg hover:shadow-xl transition-shadow"
                >
                  <PlayCircleIcon className="w-5 h-5" />
                  Start Learning Online
                </motion.span>
              </Link>
              <Link to="/contact">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/10 border border-white/30 font-semibold hover:bg-white/20 transition-colors"
                >
                  Talk to Us
                  <ArrowRightIcon className="w-4 h-4" />
                </motion.span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}