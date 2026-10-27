// import Layout from "@/components/site/Layout";
// import GallerySection from "../components/site/GallerySection";
// import { motion } from "framer-motion";
// import { fadeInUp, stagger } from "@/lib/animations";
// import {
//   CalendarDaysIcon,
//   ClockIcon,
//   SunIcon,
//   MoonIcon,
//   UserGroupIcon,
//   SparklesIcon,
//   MapPinIcon,
// } from "@heroicons/react/24/outline";

// /**
//  * Batch data lives here as plain config, so schedules/notes can be edited
//  * without touching any layout or animation code below.
//  */
// const batches = [
//   {
//     icon: SunIcon,
//     title: "Weekday Batch",
//     schedule: "Monday – Friday",
//     time: "6:30 PM – 8:30 PM",
//     note: "Ideal for working professionals upskilling after hours.",
//     iconColor: "from-blue-500 to-blue-600",
//     fill: "from-blue-500 to-blue-600",
//     glow: "shadow-blue-500/25",
//   },
//   {
//     icon: MoonIcon,
//     title: "Weekend Batch",
//     schedule: "Saturday & Sunday",
//     time: "10:00 AM – 2:00 PM",
//     note: "Perfect for students and job seekers with weekday commitments.",
//     iconColor: "from-violet-500 to-violet-600",
//     fill: "from-violet-500 to-violet-600",
//     glow: "shadow-violet-500/25",
//   },
// ];

// const heroPills = [
//   { icon: UserGroupIcon, label: "Small batches", tint: "text-blue-600" },
//   { icon: SparklesIcon, label: "Live projects", tint: "text-violet-600" },
// ];

// export default function ClassroomTraining() {
//   return (
//     <Layout>
//       <div className="bg-white">
//         {/* ── Hero ─────────────────────────────────────────── */}
//         <section
//           aria-labelledby="classroom-hero-heading"
//           className="relative overflow-hidden"
//         >
//           <div
//             aria-hidden="true"
//             className="pointer-events-none absolute inset-0 -z-10"
//             style={{
//               backgroundImage: [
//                 "radial-gradient(50% 60% at 85% 0%, rgba(139,92,246,0.10), transparent 60%)",
//                 "radial-gradient(45% 55% at 0% 100%, rgba(59,130,246,0.10), transparent 60%)",
//               ].join(","),
//             }}
//           />

//           <div className="container grid items-center gap-8 pt-14 pb-8 md:grid-cols-[1.15fr_0.85fr] md:gap-10 md:pt-16 md:pb-10">
//             <motion.div
//               initial="hidden"
//               animate="show"
//               variants={stagger}
//             >
//               <motion.span
//                 variants={fadeInUp()}
//                 className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3.5 py-1.5 text-xs font-semibold text-violet-700"
//               >
//                 <MapPinIcon className="h-3.5 w-3.5" aria-hidden="true" />
//                 Nagpur Center
//               </motion.span>

//               <motion.h1
//                 id="classroom-hero-heading"
//                 variants={fadeInUp(0.08)}
//                 className="mt-5 text-4xl font-extrabold tracking-tight text-[#171034] sm:text-5xl"
//               >
//                 Classroom{" "}
//                 <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
//                   Training
//                 </span>
//               </motion.h1>

//               <motion.p
//                 variants={fadeInUp(0.16)}
//                 className="mt-4 max-w-md text-base leading-relaxed text-slate-600 sm:text-lg"
//               >
//                 In-person, instructor-led classes at our Nagpur center — small
//                 batches, live projects and hands-on mentorship.
//               </motion.p>

//               <motion.div
//                 variants={fadeInUp(0.24)}
//                 className="mt-6 flex flex-wrap gap-3"
//               >
//                 {heroPills.map(({ icon: Icon, label, tint }) => (
//                   <span
//                     key={label}
//                     className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-1.5 text-sm font-medium text-slate-700 transition-colors duration-300 hover:border-violet-200 hover:bg-violet-50/60"
//                   >
//                     <Icon className={`h-4 w-4 ${tint}`} aria-hidden="true" />
//                     {label}
//                   </span>
//                 ))}
//               </motion.div>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, scale: 0.94, y: 12 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
//               className="relative mx-auto w-full max-w-sm md:max-w-none"
//             >
//               {/* Ambient glow behind the frame */}
//               <div
//                 aria-hidden="true"
//                 className="absolute -inset-3 -z-10 rounded-[1.9rem] bg-gradient-to-br from-blue-300/30 to-violet-300/30 blur-2xl"
//               />

//               {/* Slim gradient border, framing a slightly smaller photo */}
//               <div className="rounded-[1.6rem] bg-gradient-to-br from-blue-400 via-indigo-400 to-violet-500 p-[2px] shadow-xl shadow-slate-900/10 transition-transform duration-500 hover:-translate-y-1">
//                 <div className="overflow-hidden rounded-[1.5rem] bg-white">
//                   <img
//                     src="/img/workshop.jpeg"
//                     alt="Trainer conducting a classroom session for students at Skill Training Center"
//                     className="h-52 w-full object-cover sm:h-64"
//                     style={{ objectPosition: "50% 30%" }}
//                   />
//                 </div>
//               </div>

//               {/* Overlapping "Live Classroom" badge */}
//               <div className="absolute -bottom-4 left-4 flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-3.5 py-2 shadow-lg shadow-slate-900/10 sm:-bottom-5 sm:left-6">
//                 <span className="relative flex h-2.5 w-2.5">
//                   <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
//                   <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gradient-to-br from-blue-500 to-violet-600" />
//                 </span>
//                 <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-xs font-bold text-transparent sm:text-sm">
//                   Live Classroom
//                 </span>
//               </div>
//             </motion.div>
//           </div>
//         </section>

//         {/* ── Batch timings ────────────────────────────────── */}
//         <section
//           aria-labelledby="batch-timings-heading"
//           className="container pt-8 pb-16 md:pt-10 md:pb-20"
//         >
//           <motion.div
//             initial={{ opacity: 0, y: 12 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, margin: "-80px" }}
//             transition={{ duration: 0.5 }}
//             className="mx-auto max-w-xl text-center"
//           >
//             <h2
//               id="batch-timings-heading"
//               className="text-2xl font-extrabold tracking-tight text-[#171034] sm:text-3xl"
//             >
//               Choose Your Batch
//             </h2>
//             <p className="mt-2 text-sm text-slate-500 sm:text-base">
//               Two schedules, same live, instructor-led experience.
//             </p>
//           </motion.div>

//           <motion.div
//             initial="hidden"
//             whileInView="show"
//             viewport={{ once: true, margin: "-80px" }}
//             variants={stagger}
//             className="mt-10 grid gap-5 sm:grid-cols-2"
//           >
//             {batches.map((b) => (
//               <motion.div
//                 key={b.title}
//                 variants={fadeInUp()}
//                 whileHover={{ y: -4 }}
//                 className={`group relative isolate overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-colors duration-300 hover:border-transparent hover:shadow-lg ${b.glow} sm:p-6`}
//               >
//                 {/* Theme-colored fill that sweeps in on hover */}
//                 <motion.div
//                   aria-hidden="true"
//                   initial={{ scaleY: 0 }}
//                   whileHover={{ scaleY: 1 }}
//                   transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
//                   style={{ originY: 1 }}
//                   className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${b.fill}`}
//                 />

//                 <div className="flex items-center gap-4">
//                   <div
//                     className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${b.iconColor} text-white shadow-md transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3 group-hover:bg-white group-hover:text-[#171034] group-hover:[background-image:none]`}
//                   >
//                     <b.icon className="h-5 w-5" aria-hidden="true" />
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-bold text-[#171034] transition-colors duration-300 group-hover:text-white">
//                       {b.title}
//                     </h3>
//                     <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs font-medium text-slate-600 transition-colors duration-300 group-hover:text-white/85 sm:text-sm">
//                       <span className="inline-flex items-center gap-1">
//                         <CalendarDaysIcon
//                           className="h-3.5 w-3.5 text-slate-400 transition-colors duration-300 group-hover:text-white/70"
//                           aria-hidden="true"
//                         />
//                         {b.schedule}
//                       </span>
//                       <span className="inline-flex items-center gap-1">
//                         <ClockIcon
//                           className="h-3.5 w-3.5 text-slate-400 transition-colors duration-300 group-hover:text-white/70"
//                           aria-hidden="true"
//                         />
//                         {b.time}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <p className="mt-3 border-t border-black/5 pt-3 text-sm leading-relaxed text-slate-500 transition-colors duration-300 group-hover:border-white/20 group-hover:text-white/85">
//                   {b.note}
//                 </p>
//               </motion.div>
//             ))}
//           </motion.div>
//         </section>

//         {/* ── Learning journey / gallery ───────────────────── */}
//         <section aria-labelledby="learning-journey-heading" className="container pb-20">
//           <GallerySection />
//         </section>
//       </div>
//     </Layout>
//   );
// }
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "@/components/site/Layout";
import GallerySection from "../components/site/GallerySection";
import { courses } from "../data/courses";
import CourseCard from "../components/site/CourseCard";
import { fadeInUp, stagger } from "@/lib/animations";
import {
  CalendarDaysIcon,
  ClockIcon,
  SunIcon,
  MoonIcon,
  UserGroupIcon,
  SparklesIcon,
  MapPinIcon,
  AcademicCapIcon,
  RocketLaunchIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
  PlayCircleIcon,
  ClipboardDocumentCheckIcon,
  UsersIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";

// ---------------------------------------------------------------------------
// Static content for the Classroom Training page
// ---------------------------------------------------------------------------

const batches = [
  {
    icon: SunIcon,
    title: "Weekday Batch",
    schedule: "Monday – Friday",
    time: "6:30 PM – 8:30 PM",
    seats: "8 seats left",
    note: "Ideal for working professionals upskilling after hours.",
    fill: "from-blue-500 to-blue-600",
    glow: "shadow-blue-500/25",
  },
  {
    icon: MoonIcon,
    title: "Weekend Batch",
    schedule: "Saturday & Sunday",
    time: "10:00 AM – 2:00 PM",
    seats: "5 seats left",
    note: "Perfect for students and job seekers with weekday commitments.",
    fill: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/25",
  },
];

const whyClassroom = [
  {
    icon: AcademicCapIcon,
    title: "Expert Trainers",
    desc: "Learn face-to-face from industry professionals with real project experience.",
    color: "from-blue-600 to-indigo-600",
  },
  {
    icon: RocketLaunchIcon,
    title: "Hands-on Projects",
    desc: "Build real-world projects in a lab environment with guided practice.",
    color: "from-purple-600 to-fuchsia-600",
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: "Doubt Support",
    desc: "Get your doubts resolved instantly, right there in the classroom.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: CheckBadgeIcon,
    title: "Certification",
    desc: "Earn an industry-recognized certificate on successful completion.",
    color: "from-indigo-600 to-purple-600",
  },
];

const howItWorks = [
  {
    step: "01",
    icon: ClipboardDocumentCheckIcon,
    title: "Choose Course",
    desc: "Pick the classroom program that matches your career goals.",
  },
  {
    step: "02",
    icon: CalendarDaysIcon,
    title: "Select Batch",
    desc: "Choose a weekday or weekend batch that fits your schedule.",
  },
  {
    step: "03",
    icon: UsersIcon,
    title: "Attend Classes",
    desc: "Learn in person with hands-on labs and expert guidance.",
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
    course: "",
    batch: "Weekday",
    date: "06 Oct 2026",
    time: "6:30 PM – 8:30 PM",
    location: "Nagpur Center, Room 204",
  },
  {
    course: "Python & DSA",
    batch: "Weekend",
    date: "11 Oct 2026",
    time: "10:00 AM – 2:00 PM",
    location: "Nagpur Center, Room 101",
  },
  {
    course: "Digital Marketing",
    batch: "Weekday",
    date: "20 Oct 2026",
    time: "6:30 PM – 8:30 PM",
    location: "Nagpur Center, Room 204",
  },
  {
    course: "Data Analytics",
    batch: "Weekend",
    date: "25 Oct 2026",
    time: "10:00 AM – 2:00 PM",
    location: "Nagpur Center, Room 101",
  },
];

const batchBadgeStyle: Record<string, string> = {
  Weekday: "bg-blue-100 text-blue-700",
  Weekend: "bg-purple-100 text-purple-700",
};

const heroPills = [
  { icon: UserGroupIcon, label: "Small batches", tint: "text-blue-600" },
  { icon: SparklesIcon, label: "Live projects", tint: "text-violet-600" },
];

export default function ClassroomTraining() {
  return (
    <Layout>
      <div className="bg-white">
        {/* ================= HERO ================= */}
        <section
          aria-labelledby="classroom-hero-heading"
          className="relative overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#2e1065] to-[#312e81] text-white"
        >
          <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-pink-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="container grid items-center gap-8 py-16 md:grid-cols-[1.1fr_0.9fr] md:gap-10 md:py-20">
            <motion.div initial="hidden" animate="show" variants={stagger}>
              <motion.span
                variants={fadeInUp()}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3.5 py-1.5 text-xs font-semibold text-pink-100"
              >
                <MapPinIcon className="h-3.5 w-3.5" aria-hidden="true" />
                Nagpur Center
              </motion.span>

              <motion.h1
                id="classroom-hero-heading"
                variants={fadeInUp(0.08)}
                className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-tight"
              >
                Classroom{" "}
                <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Training
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp(0.16)}
                className="mt-5 max-w-md text-lg leading-relaxed text-indigo-100/90"
              >
                In-person, instructor-led classes at our Nagpur center — small
                batches, live projects and hands-on mentorship from day one.
              </motion.p>

              <motion.div variants={fadeInUp(0.22)} className="mt-6 flex flex-wrap gap-3">
                {heroPills.map(({ icon: Icon, label, tint }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3.5 py-1.5 text-sm font-medium text-indigo-100"
                  >
                    <Icon className="h-4 w-4 text-pink-300" aria-hidden="true" />
                    {label}
                  </span>
                ))}
              </motion.div>

              <motion.div variants={fadeInUp(0.3)} className="mt-8">
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
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              className="relative mx-auto w-full max-w-sm md:max-w-none"
            >
              <div
                aria-hidden="true"
                className="absolute -inset-3 -z-10 rounded-[1.9rem] bg-gradient-to-br from-blue-400/30 to-pink-400/30 blur-2xl"
              />

              <div className="rounded-[1.6rem] bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 p-[2px] shadow-xl shadow-black/20 transition-transform duration-500 hover:-translate-y-1">
                <div className="overflow-hidden rounded-[1.5rem] bg-white">
                  <img
                    src="/img/workshop.jpeg"
                    alt="Trainer conducting a classroom session for students at Skill Training Center"
                    className="h-64 w-full object-cover sm:h-80"
                    style={{ objectPosition: "50% 30%" }}
                  />
                </div>
              </div>

              <div className="absolute -bottom-4 left-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white px-3.5 py-2 shadow-lg shadow-black/20 sm:-bottom-5 sm:left-6">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
                </span>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xs font-bold text-transparent sm:text-sm">
                  Live Classroom
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= BATCH TIMINGS ================= */}
        <section aria-labelledby="batch-timings-heading" className="container py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="mx-auto max-w-xl text-center mb-10"
          >
            <span className="text-sm font-bold uppercase tracking-wide text-purple-600">
              Flexible Timings
            </span>
            <h2
              id="batch-timings-heading"
              className="text-3xl md:text-4xl font-extrabold text-[#171034] mt-2"
            >
              Choose Your Batch
            </h2>
            <p className="mt-2 text-slate-600">
              Two schedules, same live, instructor-led experience.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto"
          >
            {batches.map((b) => (
              <motion.div
                key={b.title}
                variants={fadeInUp()}
                whileHover={{ y: -4 }}
                className={`group relative isolate overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-colors duration-300 hover:border-transparent hover:shadow-xl ${b.glow}`}
              >
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 -z-10 origin-bottom scale-y-0 bg-gradient-to-br transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100 ${b.fill}`}
                />

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${b.fill} text-white shadow-md transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3 group-hover:bg-white group-hover:text-[#171034] group-hover:[background-image:none]`}
                    >
                      <b.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#171034] transition-colors duration-300 group-hover:text-white">
                        {b.title}
                      </h3>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm font-medium text-slate-600 transition-colors duration-300 group-hover:text-white/85">
                        <span className="inline-flex items-center gap-1">
                          <CalendarDaysIcon className="h-3.5 w-3.5 text-slate-400 transition-colors duration-300 group-hover:text-white/70" />
                          {b.schedule}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <ClockIcon className="h-3.5 w-3.5 text-slate-400 transition-colors duration-300 group-hover:text-white/70" />
                          {b.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 transition-colors duration-300 group-hover:bg-white/20 group-hover:text-white">
                    {b.seats}
                  </span>
                </div>

                <p className="mt-4 border-t border-black/5 pt-4 text-sm leading-relaxed text-slate-500 transition-colors duration-300 group-hover:border-white/20 group-hover:text-white/85">
                  {b.note}
                </p>

                <Link to="/contact" className="mt-5 block">
                  <motion.span
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-[#171034] text-sm font-bold text-white shadow-md transition-all duration-300 group-hover:bg-white group-hover:text-[#171034] hover:shadow-lg"
                  >
                    Select Batch
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </motion.span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ================= WHY CLASSROOM TRAINING ================= */}
        <section className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
          <div className="container py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-10"
            >
              <span className="text-sm font-bold uppercase tracking-wide text-blue-600">
                The Advantage
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#171034] mt-2">
                Why Classroom Training?
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {whyClassroom.map((w, i) => (
                <motion.div
                  key={w.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${w.color} flex items-center justify-center mb-4 shadow-md`}
                  >
                    <w.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-[#171034] mb-1.5">{w.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{w.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="bg-white">
          <div className="container py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-12"
            >
              <span className="text-sm font-bold uppercase tracking-wide text-purple-600">
                Simple Process
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#171034] mt-2">
                How It Works
              </h2>
            </motion.div>

            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
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
                  <div className="text-xs font-bold text-purple-600 mb-1">STEP {s.step}</div>
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
        <section id="courses" className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
          <div className="container py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-10"
            >
              <span className="text-sm font-bold uppercase tracking-wide text-blue-600">
                Our Programs
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#171034] mt-2">
                Choose Your Classroom Course
              </h2>
              <p className="text-slate-600 mt-3">
                Job-ready, project-driven programs taught live at our Nagpur center.
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: (index % 3) * 0.08 }}
                >
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= UPCOMING BATCHES ================= */}
        <section className="bg-gradient-to-br from-[#1e1b4b] via-[#2e1065] to-[#312e81] text-white">
          <div className="container py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-10"
            >
              <span className="text-sm font-bold uppercase tracking-wide text-pink-300">
                Reserve Your Seat
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold mt-2">
                Upcoming Classroom Batches
              </h2>
              <p className="text-indigo-200/80 mt-3">
                Limited seats per batch — walk in or enquire to lock your spot.
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
                    className={`self-start px-2.5 py-1 rounded-full text-[11px] font-bold mb-3 ${batchBadgeStyle[batch.batch]}`}
                  >
                    {batch.batch}
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
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4 text-pink-300 shrink-0" />
                      {batch.location}
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
        <section aria-labelledby="learning-journey-heading" className="bg-white">
          <div className="container py-16">
            <GallerySection />
          </div>
        </section>

        {/* ================= FINAL CTA ================= */}
        <section className="bg-gradient-to-br from-purple-50 via-white to-pink-50">
          <div className="container py-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-10 md:p-14 text-center text-white shadow-xl shadow-purple-500/20"
            >
              <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-pink-400/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-blue-300/20 blur-3xl" />

              <h2 className="relative text-3xl md:text-4xl font-extrabold mb-4">
                Start Your Classroom Journey
              </h2>
              <p className="relative text-lg text-indigo-100/90 mb-8 max-w-2xl mx-auto">
                Join a live batch at our Nagpur center and learn hands-on with
                expert trainers and fellow learners.
              </p>
              <div className="relative flex flex-wrap items-center justify-center gap-4">
                <Link to="/courses">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-indigo-700 font-bold shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <PlayCircleIcon className="w-5 h-5" />
                    Explore Courses
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
      </div>
    </Layout>
  );
}