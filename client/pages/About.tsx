// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Layout from "@/components/site/Layout";
// import {
//   SparklesIcon,
//   AcademicCapIcon,
//   LightBulbIcon,
//   PuzzlePieceIcon,
//   BuildingOfficeIcon,
//   MapPinIcon,
//   PhoneIcon,
//   EnvelopeIcon,
//   UserGroupIcon,
//   TrophyIcon,
//   ChartBarIcon
// } from "@heroicons/react/24/outline";

// export default function About() {
//   const [activeSection, setActiveSection] = useState("education");
//   const [hoveredCard, setHoveredCard] = useState(null);

//   const coreValues = [
//     {
//       icon: AcademicCapIcon,
//       title: "Education",
//       description: "Education is key to personal and professional growth. We empower individuals to excel academically and professionally, opening doors to new opportunities and horizons.",
//       color: "from-blue-500 to-cyan-500"
//     },
//     {
//       icon: LightBulbIcon,
//       title: "Belief",
//       description: "We believe in nurturing talent and fostering careers. We connect top-tier talent with leading organizations, facilitating mutually beneficial partnerships.",
//       color: "from-purple-500 to-pink-500"
//     },
//     {
//       icon: PuzzlePieceIcon,
//       title: "Solutions",
//       description: "Our tailored solutions ensure that your projects are executed flawlessly and meet your unique requirements. Driven by excellence, integrity, and client satisfaction.",
//       color: "from-orange-500 to-red-500"
//     }
//   ];

//   const teamMembers = [
//     {
//       name: "Arjun",
//       role: "Full-Stack Java Trainer",
//       experience: "10+ years",
//       specialization: "Java, Spring Boot, Microservices",
//       achievements: ["Mentored 1000+ students", "Ex-Senior Developer at Tech Giant"]
//     },
//     {
//       name: "Priya",
//       role: "React & Frontend Trainer",
//       experience: "8+ years",
//       specialization: "React, TypeScript, UI/UX",
//       achievements: ["Frontend Architect", "Open Source Contributor"]
//     }
//   ];

//   const stats = [
//     { value: "10,000+", label: "Students Trained", icon: UserGroupIcon },
//     { value: "95%", label: "Placement Rate", icon: TrophyIcon },
//     { value: "50+", label: "Courses Offered", icon: AcademicCapIcon },
//     { value: "200+", label: "Partner Companies", icon: BuildingOfficeIcon }
//   ];

//   return (
//     <Layout>
//       {/* Animated Background Elements */}
//       <div className="fixed inset-0 -z-10 overflow-hidden">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 1 }}
//           className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-full blur-3xl"
//         />
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 1, delay: 0.2 }}
//           className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-600/20 to-primary/20 rounded-full blur-3xl"
//         />
//       </div>

//       <section className="container py-20 relative">
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
//             className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
//           >
//             {/* <SparklesIcon className="w-4 h-4 text-primary" /> */}
//             <span className="text-sm font-semibold text-primary">Innovating Education</span>
//           </motion.div>

//           <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
//             About Skill Training Center
//           </h1>
//           <p className="mt-6 text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
//             Where innovation meets excellence in the realm of IT solutions and transformative education.
//           </p>
//         </motion.div>

//         {/* Stats Grid */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//           className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
//         >
//           {stats.map((stat, index) => (
//             <motion.div
//               key={stat.label}
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: 0.6 + index * 0.1 }}
//               whileHover={{ scale: 1.05, y: -5 }}
//               className="text-center p-6 rounded-2xl bg-background/50 border border-border/30 backdrop-blur-sm"
//             >
//               <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
//               <div className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
//                 {stat.value}
//               </div>
//               <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
//             </motion.div>
//           ))}
//         </motion.div>

//         {/* Introduction */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="max-w-4xl mx-auto text-center mb-16"
//         >
//           <p className="text-lg text-foreground/70 leading-relaxed">
//             Skill Training Center is a premier software organization with a strong presence in Pune and Nagpur.
//             We specialize in cutting-edge IT solutions, digital marketing, and transformative education programs
//             designed to bridge the gap between academia and industry.
//           </p>
//         </motion.div>

//         {/* Interactive Core Values */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.8 }}
//           className="mb-20"
//         >
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-4">
//               Our Core Values
//             </h2>
//             <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
//               The principles that guide our mission and shape our success stories
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8">
//             {coreValues.map((value, index) => (
//               <motion.div
//                 key={value.title}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: 0.2 + index * 0.1 }}
//                 whileHover={{ y: -8, scale: 1.02 }}
//                 onHoverStart={() => setHoveredCard(index)}
//                 onHoverEnd={() => setHoveredCard(null)}
//                 className={`group relative rounded-2xl bg-gradient-to-br from-background to-muted/20 p-8 border border-border/50 overflow-hidden backdrop-blur-sm cursor-pointer transition-all duration-500 ${hoveredCard === index ? 'bg-background/80' : 'hover:bg-background/60'
//                   }`}
//               >
//                 {/* Animated Background Glow */}
//                 <motion.div
//                   animate={{
//                     opacity: hoveredCard === index ? 1 : 0,
//                     scale: hoveredCard === index ? 1 : 0.8
//                   }}
//                   className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-10 rounded-2xl pointer-events-none transition-all duration-500`}
//                 />

//                 <div className="relative z-10">
//                   {/* Icon */}
//                   <motion.div
//                     animate={{ scale: hoveredCard === index ? 1.1 : 1 }}
//                     className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${value.color} text-white mb-6 transition-all duration-300`}
//                   >
//                     <value.icon className="w-8 h-8" />
//                   </motion.div>

//                   <h3 className="text-xl font-bold text-foreground mb-4">
//                     {value.title}
//                   </h3>
//                   <p className="text-foreground/70 leading-relaxed">
//                     {value.description}
//                   </p>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>

//         {/* Mission & Vision */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.8 }}
//           className="grid md:grid-cols-2 gap-8 mb-20"
//         >
//           <motion.div
//             whileHover={{ y: -5, scale: 1.02 }}
//             className="relative rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-8 border border-blue-500/20 backdrop-blur-sm"
//           >
//             <div className="flex items-center gap-4 mb-6">
//               <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
//                 <TrophyIcon className="w-6 h-6 text-white" />
//               </div>
//               <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
//             </div>
//             <p className="text-foreground/70 text-lg leading-relaxed">
//               Provide job-ready training with comprehensive mentor support, real-world projects,
//               and dedicated placement assistance to transform careers through practical, industry-aligned education.
//             </p>
//           </motion.div>

//           <motion.div
//             whileHover={{ y: -5, scale: 1.02 }}
//             className="relative rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-8 border border-purple-500/20 backdrop-blur-sm"
//           >
//             <div className="flex items-center gap-4 mb-6">
//               <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
//                 <ChartBarIcon className="w-6 h-6 text-white" />
//               </div>
//               <h3 className="text-2xl font-bold text-foreground">Our Vision</h3>
//             </div>
//             <p className="text-foreground/70 text-lg leading-relaxed">
//               Become the leading institute for practical software education in the region,
//               recognized for producing industry-ready professionals who drive innovation and excellence in technology.
//             </p>
//           </motion.div>
//         </motion.div>



//         {/* Contact Information */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.8 }}
//           className="max-w-4xl mx-auto"
//         >
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-4">
//               Get In Touch
//             </h2>
//             <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
//               Reach out to us for more information about our services and training programs
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 gap-8">
//             {/* Contact Cards */}
//             <motion.div
//               whileHover={{ y: -5 }}
//               className="rounded-2xl bg-gradient-to-br from-primary/10 to-purple-600/10 p-8 border border-primary/20 backdrop-blur-sm"
//             >
//               <h3 className="text-2xl font-bold text-foreground mb-6">Our Locations</h3>

//               <div className="space-y-6">
//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
//                     <MapPinIcon className="w-6 h-6 text-primary" />
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-foreground mb-2">Pune Office</h4>
//                     <p className="text-foreground/70">IT Park, Hinjawadi, Pune, Maharashtra</p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
//                     <MapPinIcon className="w-6 h-6 text-primary" />
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-foreground mb-2">Nagpur Office</h4>
//                     <p className="text-foreground/70">Tech Hub, Sitabuldi, Nagpur, Maharashtra</p>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>

//             <motion.div
//               whileHover={{ y: -5 }}
//               className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-8 border border-blue-500/20 backdrop-blur-sm"
//             >
//               <h3 className="text-2xl font-bold text-foreground mb-6">Contact Details</h3>

//               <div className="space-y-6">
//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
//                     <PhoneIcon className="w-6 h-6 text-blue-500" />
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-foreground mb-2">Phone</h4>
//                     <p className="text-foreground/70">+91 93993 45989</p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
//                     <EnvelopeIcon className="w-6 h-6 text-blue-500" />
//                   </div>
//                   <div>
//                     <h4 className="font-semibold text-foreground mb-2">Email</h4>
//                     <p className="text-foreground/70">info@Skill Training Center.com</p>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </motion.div>

//         {/* CTA Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.8, delay: 0.2 }}
//           className="text-center mt-16"
//         >
//           <div className="rounded-3xl bg-gradient-to-br from-primary/10 via-purple-600/10 to-transparent border border-primary/20 p-12 backdrop-blur-sm">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">
//               Ready to Transform Your Career?
//             </h2>
//             <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
//               Join thousands of successful students who have accelerated their careers with our industry-leading training programs.
//             </p>
//             {/* <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-purple-600 text-white font-bold shadow-lg shadow-primary/25"
//             >
//               <SparklesIcon className="w-5 h-5" />

//             </motion.button> */}
//           </div>
//         </motion.div>
//       </section>
//     </Layout>
//   );
// }
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  animate,
  useInView,
  useMotionValue,
} from "framer-motion";
import Layout from "@/components/site/Layout";
import { fadeInUp, stagger } from "@/lib/animations";
import {
  AcademicCapIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  GlobeAltIcon,
  LightBulbIcon,
  MapPinIcon,
  PhoneIcon,
  PlayCircleIcon,
  PuzzlePieceIcon,
  RocketLaunchIcon,
  TrophyIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

/* -------------------------------------------------------------------------- */
/*  Content (edit copy here – layout code below stays untouched)              */
/* -------------------------------------------------------------------------- */

const heroPills = [
  { icon: MapPinIcon, label: "Nagpur & Pune" },
  { icon: AcademicCapIcon, label: "Job-ready training" },
  { icon: TrophyIcon, label: "Placement support" },
];

// Numbers match the home-page stats strip.
const stats = [
  {
    icon: UserGroupIcon,
    value: 60000,
    suffix: "+",
    label: "Students Trained",
    chip: "from-blue-500 to-blue-600",
  },
  {
    icon: TrophyIcon,
    value: 5000,
    suffix: "+",
    label: "Successful Placements",
    chip: "from-violet-500 to-purple-600",
  },
  {
    icon: AcademicCapIcon,
    value: 200,
    suffix: "+",
    label: "Courses Offered",
    chip: "from-indigo-500 to-blue-600",
  },
  {
    icon: BuildingOffice2Icon,
    value: 200,
    suffix: "+",
    label: "Partner Companies",
    chip: "from-fuchsia-500 to-pink-500",
  },
];

const introPoints = [
  "Industry-aligned curriculum built with working professionals",
  "Live projects with hands-on mentor support",
  "Dedicated placement assistance and interview preparation",
  "Classroom, online and corporate training formats",
];

const coreValues = [
  {
    icon: AcademicCapIcon,
    title: "Education",
    description:
      "Education is key to personal and professional growth. We empower individuals to excel academically and professionally, opening doors to new opportunities and horizons.",
    chip: "from-blue-500 to-blue-600",
    glow: "hover:shadow-blue-500/20",
    accent: "from-blue-500 to-indigo-500",
  },
  {
    icon: LightBulbIcon,
    title: "Belief",
    description:
      "We believe in nurturing talent and fostering careers. We connect top-tier talent with leading organizations, facilitating mutually beneficial partnerships.",
    chip: "from-violet-500 to-purple-600",
    glow: "hover:shadow-violet-500/20",
    accent: "from-indigo-500 to-purple-500",
  },
  {
    icon: PuzzlePieceIcon,
    title: "Solutions",
    description:
      "Our tailored solutions ensure that your projects are executed flawlessly and meet your unique requirements. Driven by excellence, integrity, and client satisfaction.",
    chip: "from-fuchsia-500 to-pink-500",
    glow: "hover:shadow-pink-500/20",
    accent: "from-purple-500 to-pink-500",
  },
];

const missionVision = [
  {
    icon: RocketLaunchIcon,
    eyebrow: "What we do",
    title: "Our Mission",
    text: "Provide job-ready training with comprehensive mentor support, real-world projects, and dedicated placement assistance to transform careers through practical, industry-aligned education.",
    points: ["Job-ready training", "Mentor support", "Placement assistance"],
    chip: "from-blue-500 to-indigo-500",
  },
  {
    icon: EyeIcon,
    eyebrow: "Where we're heading",
    title: "Our Vision",
    text: "Become the leading institute for practical software education in the region, recognized for producing industry-ready professionals who drive innovation and excellence in technology.",
    points: ["Practical education leader", "Industry-ready talent", "Innovation & excellence"],
    chip: "from-purple-500 to-pink-500",
  },
];

// Same details as the footer and Contact page.
const contactCards = [
  {
    icon: MapPinIcon,
    label: "Visit Us",
    lines: [
      "Plot No.26, Khandwekar Bunglow,",
      "2nd Floor, Near Lendra Park,",
      "Ramdaspeth, Nagpur-440010",
    ],
    chip: "from-blue-500 to-blue-600",
  },
  {
    icon: PhoneIcon,
    label: "Call Us",
    links: [
      { text: "9399345989", href: "tel:+919399345989" },
      { text: "8446691425", href: "tel:+918446691425" },
    ],
    chip: "from-violet-500 to-purple-600",
  },
  {
    icon: GlobeAltIcon,
    label: "Online",
    links: [{ text: "ssinfotech.co.in", href: "https://ssinfotech.co.in" }],
    note: "We usually reply within 24 hours",
    chip: "from-fuchsia-500 to-pink-500",
  },
];

/* -------------------------------------------------------------------------- */
/*  Small pieces                                                              */
/* -------------------------------------------------------------------------- */

function Eyebrow({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <span
      className={`text-sm font-bold uppercase tracking-wide ${
        light ? "text-pink-300" : "text-purple-600"
      }`}
    >
      {children}
    </span>
  );
}

function CountUp({
  value,
  suffix,
  delay = 0,
}: {
  value: number;
  suffix: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const count = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, value, {
      duration: value > 10000 ? 2.2 : 1.5,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.floor(v)),
    });
    return () => controls.stop();
  }, [inView, value, delay, count]);

  return (
    <span ref={ref} className="tabular-nums">
      {display.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function About() {
  return (
    <Layout>
      <div className="bg-white">
        {/* ================= HERO ================= */}
        <section
          aria-labelledby="about-hero-heading"
          className="relative overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#2e1065] to-[#312e81] text-white"
        >
          <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-pink-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="container grid items-center gap-10 pt-16 pb-28 md:grid-cols-[1.1fr_0.9fr] md:pt-20 md:pb-32">
            <motion.div initial="hidden" animate="show" variants={stagger}>
              <motion.span
                variants={fadeInUp()}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-pink-100"
              >
                <LightBulbIcon className="h-3.5 w-3.5" aria-hidden="true" />
                Innovating Education
              </motion.span>

              <motion.h1
                id="about-hero-heading"
                variants={fadeInUp(0.08)}
                className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
              >
                About{" "}
                <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Skill Training Center
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp(0.16)}
                className="mt-5 max-w-lg text-lg leading-relaxed text-indigo-100/90"
              >
                Where innovation meets excellence in the realm of IT solutions
                and transformative education.
              </motion.p>

              <motion.div variants={fadeInUp(0.22)} className="mt-6 flex flex-wrap gap-3">
                {heroPills.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-sm font-medium text-indigo-100"
                  >
                    <Icon className="h-4 w-4 text-pink-300" aria-hidden="true" />
                    {label}
                  </span>
                ))}
              </motion.div>

              <motion.div variants={fadeInUp(0.3)} className="mt-8 flex flex-wrap gap-3">
                <Link to="/courses">
                  <motion.span
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-7 py-3.5 font-bold shadow-lg shadow-purple-900/40 transition-shadow hover:shadow-xl"
                  >
                    <PlayCircleIcon className="h-5 w-5" aria-hidden="true" />
                    Explore Courses
                  </motion.span>
                </Link>
                <Link to="/contact">
                  <motion.span
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 font-semibold transition-colors hover:bg-white/20"
                  >
                    Contact Us
                    <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
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
                    alt="Students attending a hands-on workshop at Skill Training Center"
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
                  Trusted by 60,000+ learners
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= STATISTICS ================= */}
        <section aria-label="Skill Training Center in numbers" className="container relative z-10 -mt-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 gap-y-8 rounded-3xl border border-slate-200/80 bg-white px-4 py-8 shadow-xl shadow-indigo-500/10 sm:px-6 lg:grid-cols-4 lg:gap-y-0 lg:divide-x lg:divide-slate-100"
          >
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="flex flex-col items-center gap-3 px-2 text-center lg:flex-row lg:justify-center lg:gap-4 lg:text-left"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${s.chip} text-white shadow-md`}
                >
                  <s.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold tracking-tight text-[#171034] sm:text-3xl">
                    <CountUp value={s.value} suffix={s.suffix} delay={i * 0.12} />
                  </div>
                  <div className="text-xs font-medium text-slate-500 sm:text-sm">
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ================= ABOUT / INTRODUCTION ================= */}
        <section aria-labelledby="about-intro-heading" className="container py-16 md:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <Eyebrow>Who We Are</Eyebrow>
              <h2
                id="about-intro-heading"
                className="mt-2 text-3xl font-extrabold leading-tight text-[#171034] md:text-4xl"
              >
                Bridging the gap between{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  academia and industry
                </span>
              </h2>
              <p className="mt-4 leading-relaxed text-slate-600">
                Skill Training Center is a premier software organization with a
                strong presence in Pune and Nagpur. We specialize in
                cutting-edge IT solutions, digital marketing, and
                transformative education programs designed to bridge the gap
                between academia and industry.
              </p>

              <ul className="mt-6 space-y-3">
                {introPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-slate-700 sm:text-base">
                    <CheckCircleIcon
                      className="mt-0.5 h-5 w-5 shrink-0 text-purple-500"
                      aria-hidden="true"
                    />
                    {point}
                  </li>
                ))}
              </ul>

              <Link to="/courses" className="mt-8 inline-block">
                <motion.span
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-purple-500/25 transition-shadow hover:shadow-lg"
                >
                  Explore Our Courses
                  <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                </motion.span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="relative mx-auto w-full max-w-lg lg:max-w-none"
            >
              <div
                aria-hidden="true"
                className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 blur-xl"
              />
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-3 overflow-hidden rounded-2xl border-4 border-white shadow-lg shadow-indigo-500/15">
                  <img
                    src="/img/group.jpeg"
                    alt="Students receiving certificates at a Skill Training Center event"
                    loading="lazy"
                    className="h-64 w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-80"
                  />
                </div>
                <div className="col-span-2 mt-10 overflow-hidden rounded-2xl border-4 border-white shadow-lg shadow-indigo-500/15">
                  <img
                    src="/img/jobfair.jpeg"
                    alt="Campus job fair organised with Skill Training Center"
                    loading="lazy"
                    className="h-64 w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-80"
                  />
                </div>
              </div>
              <div className="absolute -bottom-5 left-6 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-xl shadow-indigo-500/10">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  <BriefcaseIcon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <div className="text-sm font-extrabold text-[#171034]">5,000+ placements</div>
                  <div className="text-xs text-slate-500">and counting</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= CORE VALUES ================= */}
        <section
          aria-labelledby="core-values-heading"
          className="bg-gradient-to-b from-indigo-50/70 via-purple-50/60 to-white"
        >
          <div className="container py-16 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              className="mx-auto mb-10 max-w-xl text-center"
            >
              <Eyebrow>What Guides Us</Eyebrow>
              <h2
                id="core-values-heading"
                className="mt-2 text-3xl font-extrabold text-[#171034] md:text-4xl"
              >
                Our Core Values
              </h2>
              <p className="mt-2 text-slate-600">
                The principles that guide our mission and shape our success stories.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3">
              {coreValues.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl sm:p-7 ${v.glow}`}
                >
                  <div
                    aria-hidden="true"
                    className={`absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r ${v.accent} transition-transform duration-500 group-hover:scale-x-100`}
                  />
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${v.chip} text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}
                  >
                    <v.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-[#171034]">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                    {v.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= MISSION & VISION ================= */}
        <section
          aria-labelledby="mission-vision-heading"
          className="relative overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#2e1065] to-[#312e81] text-white"
        >
          <div className="pointer-events-none absolute -top-20 left-1/3 h-72 w-72 rounded-full bg-pink-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="container relative py-16 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto mb-10 max-w-2xl text-center"
            >
              <Eyebrow light>Purpose & Direction</Eyebrow>
              <h2
                id="mission-vision-heading"
                className="mt-2 text-3xl font-extrabold md:text-4xl"
              >
                Our Mission & Vision
              </h2>
              <p className="mt-3 text-indigo-200/80">
                Practical education today, industry leadership tomorrow.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2">
              {missionVision.map((m, i) => (
                <motion.div
                  key={m.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.12 }}
                  whileHover={{ y: -5 }}
                  className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm sm:p-8"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${m.chip} shadow-md`}
                    >
                      <m.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-pink-300">
                        {m.eyebrow}
                      </div>
                      <h3 className="text-2xl font-bold">{m.title}</h3>
                    </div>
                  </div>
                  <p className="mt-4 leading-relaxed text-indigo-100/90">{m.text}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {m.points.map((p) => (
                      <span
                        key={p}
                        className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-indigo-100"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= GET IN TOUCH ================= */}
        <section aria-labelledby="get-in-touch-heading" className="container py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="mx-auto mb-10 max-w-xl text-center"
          >
            <Eyebrow>Contact</Eyebrow>
            <h2
              id="get-in-touch-heading"
              className="mt-2 text-3xl font-extrabold text-[#171034] md:text-4xl"
            >
              Get In Touch
            </h2>
            <p className="mt-2 text-slate-600">
              Reach out for more information about our services and training programs.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {contactCards.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${c.chip} text-white shadow-md`}
                >
                  <c.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-[#171034]">{c.label}</h3>

                {c.lines && (
                  <address className="mt-2 text-sm not-italic leading-relaxed text-slate-600">
                    {c.lines.map((l) => (
                      <span key={l} className="block">
                        {l}
                      </span>
                    ))}
                  </address>
                )}

                {c.links && (
                  <div className="mt-2 space-y-1">
                    {c.links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        target={l.href.startsWith("http") ? "_blank" : undefined}
                        rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="block text-sm font-semibold text-slate-700 transition-colors hover:text-purple-600"
                      >
                        {l.text}
                      </a>
                    ))}
                  </div>
                )}

                {c.note && (
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                    <ClockIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    {c.note}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================= FINAL CTA ================= */}
        <section className="bg-gradient-to-br from-purple-50 via-white to-pink-50">
          <div className="container py-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-10 text-center text-white shadow-xl shadow-purple-500/20 md:p-14"
            >
              <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-pink-400/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-blue-300/20 blur-3xl" />

              <h2 className="relative mb-4 text-3xl font-extrabold md:text-4xl">
                Ready to Transform Your Career?
              </h2>
              <p className="relative mx-auto mb-8 max-w-2xl text-lg text-indigo-100/90">
                Join thousands of successful students who have accelerated their
                careers with our industry-leading training programs.
              </p>
              <div className="relative flex flex-wrap items-center justify-center gap-4">
                <Link to="/courses">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-indigo-700 shadow-lg transition-shadow hover:shadow-xl"
                  >
                    <PlayCircleIcon className="h-5 w-5" aria-hidden="true" />
                    Explore Courses
                  </motion.span>
                </Link>
                <Link to="/contact">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-8 py-4 font-semibold transition-colors hover:bg-white/20"
                  >
                    Talk to Us
                    <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
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