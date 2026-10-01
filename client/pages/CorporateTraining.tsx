// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Layout from "@/components/site/Layout";
// import GallerySection from "../components/site/GallerySection"
// import {
//   BuildingOfficeIcon,
//   UserGroupIcon,
//   ChartBarIcon,
//   ClockIcon,
//   AcademicCapIcon,
//   TrophyIcon,
//   CheckBadgeIcon,
//   PlayCircleIcon,
//   ArrowRightIcon,
//   PhoneIcon,
//   EnvelopeIcon
// } from "@heroicons/react/24/outline";

// export default function CorporateTraining() {
//   const [form, setForm] = useState({
//     company: "",
//     contact: "",
//     email: "",
//     phone: "",
//     employees: "",
//     message: ""
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [activeFeature, setActiveFeature] = useState(0);

//   function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
//     setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
//   }

//   async function submit(e: React.FormEvent) {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // Format form data into a WhatsApp message
//     const whatsappMessage = `
// 🏢 Corporate Training Enquiry

// 🏛️ Company: ${form.company}
// 👤 Contact: ${form.contact}
// 📧 Email: ${form.email}
// 📞 Phone: ${form.phone}
// 👥 No. of Employees: ${form.employees}
// 📝 Details: ${form.message}

// 📚 Sent via Corporate Training Portal
//     `.trim();

//     // WhatsApp Click to Chat URL
//     const phoneNumber = "919399345989";
//     const encodedMessage = encodeURIComponent(whatsappMessage);
//     const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

//     // Simulate loading for better UX
//     await new Promise(resolve => setTimeout(resolve, 1500));

//     // Open WhatsApp in a new tab/window
//     window.open(whatsappUrl, "_blank");

//     // Reset form after opening
//     setForm({ company: "", contact: "", email: "", phone: "", employees: "", message: "" });
//     setIsSubmitting(false);
//   }

//   // Features data
//   const features = [
//     {
//       icon: BuildingOfficeIcon,
//       title: "Customized Curriculum",
//       description: "Tailored learning paths aligned with your business objectives and technology stack",
//       benefits: ["Industry-specific content", "Real-world projects", "Custom assessments"]
//     },
//     {
//       icon: UserGroupIcon,
//       title: "Team Upskilling",
//       description: "Transform your workforce with cutting-edge technology skills",
//       benefits: ["Group learning", "Team projects", "Progress tracking"]
//     },
//     {
//       icon: ChartBarIcon,
//       title: "Performance Analytics",
//       description: "Comprehensive tracking and reporting on team progress and skill development",
//       benefits: ["Skill gap analysis", "Progress reports", "ROI measurement"]
//     },
//     {
//       icon: ClockIcon,
//       title: "Flexible Scheduling",
//       description: "On-site, remote, or hybrid delivery options to suit your team's workflow",
//       benefits: ["24/7 access", "Recorded sessions", "Multiple time zones"]
//     }
//   ];

//   // Success metrics
//   const metrics = [
//     { value: "200+", label: "Corporate Clients", icon: BuildingOfficeIcon },
//     { value: "15,000+", label: "Professionals Trained", icon: UserGroupIcon },
//     { value: "95%", label: "Satisfaction Rate", icon: ChartBarIcon },
//     { value: "50%", label: "Productivity Boost", icon: TrophyIcon }
//   ];

//   // Training domains
//   const domains = [
//     {
//       title: "Data Science & Machine Learning",
//       description: "Build in-house expertise in modern machine learning and data workflows",
//       technologies: ["TensorFlow", "PyTorch", "MLOps", "Computer Vision"]
//     },
//     {
//       title: "Cloud & DevOps",
//       description: "Master cloud infrastructure and deployment strategies",
//       technologies: ["AWS", "Azure", "Docker", "Kubernetes"]
//     },
//     {
//       title: "Full Stack Development",
//       description: "End-to-end web and mobile development expertise",
//       technologies: ["React", "Node.js", "Python", "MongoDB"]
//     },
//     {
//       title: "Data Science",
//       description: "Leverage data for strategic decision making",
//       technologies: ["Python", "SQL", "Tableau", "Big Data"]
//     }
//   ];

//   // Get the current active feature icon component
//   const ActiveFeatureIcon = features[activeFeature].icon;

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

//       <section className="container py-16 relative">
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
//             <AcademicCapIcon className="w-4 h-4 text-primary" />
//             <span className="text-sm font-semibold text-primary">Enterprise Training Programs</span>
//           </motion.div>

//           <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
//             Corporate Training
//           </h1>

//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             className="mt-6 text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed"
//           >
//             Transform your workforce with customized training programs,
//             <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent font-semibold"> industry-aligned learning</span>,
//             and enterprise-grade skill development.
//           </motion.p>
//         </motion.div>

//         {/* Metrics Grid */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.6 }}
//           className="mb-20"
//         >
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
//             {metrics.map((metric, index) => (
//               <motion.div
//                 key={metric.label}
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: 0.8 + index * 0.1 }}
//                 whileHover={{ scale: 1.05, y: -5 }}
//                 className="text-center p-6 rounded-2xl bg-background/50 border border-border/30 backdrop-blur-sm"
//               >
//                 <metric.icon className="w-8 h-8 text-primary mx-auto mb-3" />
//                 <div className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
//                   {metric.value}
//                 </div>
//                 <div className="text-sm text-muted-foreground mt-1">{metric.label}</div>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>

//         {/* Features Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.8 }}
//           className="mb-20"
//         >
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-4">
//               Why Choose Our Corporate Training?
//             </h2>
//             <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
//               Comprehensive solutions designed for enterprise success and team growth
//             </p>
//           </div>

//           <div className="grid lg:grid-cols-2 gap-8 items-center">
//             {/* Feature Cards */}
//             <div className="space-y-4">
//               {features.map((feature, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 1 + index * 0.1 }}
//                   whileHover={{ scale: 1.02 }}
//                   onClick={() => setActiveFeature(index)}
//                   className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${activeFeature === index
//                     ? "bg-gradient-to-br from-primary/10 to-purple-600/10 border-primary/50 shadow-lg shadow-primary/10"
//                     : "bg-background/50 border-border/30 hover:border-primary/30"
//                     }`}
//                 >
//                   <div className="flex items-start gap-4">
//                     <div className={`p-3 rounded-xl ${activeFeature === index
//                       ? "bg-primary text-primary-foreground"
//                       : "bg-primary/10 text-primary"
//                       }`}>
//                       <feature.icon className="w-6 h-6" />
//                     </div>
//                     <div className="flex-1">
//                       <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
//                       <p className="text-foreground/70 text-sm mb-3">{feature.description}</p>
//                       <div className="flex flex-wrap gap-2">
//                         {feature.benefits.map((benefit, i) => (
//                           <span
//                             key={i}
//                             className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
//                           >
//                             {benefit}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>

//             {/* Feature Visualization */}
//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 1.2 }}
//               className="relative"
//             >
//               <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-purple-600/5 border border-border/30 p-8 backdrop-blur-sm">
//                 <div className="text-center mb-6">
//                   <ActiveFeatureIcon className="w-12 h-12 text-primary mx-auto mb-4" />
//                   <h3 className="text-2xl font-bold mb-2">{features[activeFeature].title}</h3>
//                   <p className="text-foreground/70">{features[activeFeature].description}</p>
//                 </div>

//                 {/* Animated Progress Visualization */}
//                 <div className="space-y-4">
//                   {features[activeFeature].benefits.map((benefit, index) => (
//                     <motion.div
//                       key={index}
//                       initial={{ opacity: 0, width: 0 }}
//                       animate={{ opacity: 1, width: "100%" }}
//                       transition={{ delay: 1.4 + index * 0.2 }}
//                       className="flex items-center gap-3"
//                     >
//                       <CheckBadgeIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
//                       <div className="flex-1">
//                         <div className="text-sm font-medium mb-1">{benefit}</div>
//                         <motion.div
//                           initial={{ width: 0 }}
//                           animate={{ width: `${80 + index * 5}%` }}
//                           transition={{ delay: 1.6 + index * 0.2, duration: 1 }}
//                           className="h-2 bg-gradient-to-r from-primary to-purple-600 rounded-full"
//                         />
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </motion.div>

//         {/* Training Domains */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 1.4 }}
//           className="mb-20"
//         >
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-4">
//               Our Training Domains
//             </h2>
//             <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
//               Comprehensive coverage of modern technologies and methodologies
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 gap-6">
//             {domains.map((domain, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 1.6 + index * 0.1 }}
//                 whileHover={{ scale: 1.02, y: -5 }}
//                 className="p-6 rounded-2xl bg-background/50 border border-border/30 backdrop-blur-sm"
//               >
//                 <h3 className="font-bold text-xl mb-3">{domain.title}</h3>
//                 <p className="text-foreground/70 mb-4">{domain.description}</p>
//                 <div className="flex flex-wrap gap-2">
//                   {domain.technologies.map((tech, i) => (
//                     <motion.span
//                       key={i}
//                       initial={{ opacity: 0, scale: 0.8 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       transition={{ delay: 1.8 + i * 0.1 }}
//                       className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
//                     >
//                       {tech}
//                     </motion.span>
//                   ))}
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </motion.div>

//         {/* Contact Form Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 1.8 }}
//           className="grid lg:grid-cols-2 gap-12 items-start"
//         >
//           {/* Form Section */}
//           <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-purple-600/5 border border-border/30 p-8 backdrop-blur-sm">
//             <div className="text-center mb-8">
//               <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-2">
//                 Request a Corporate Program
//               </h2>
//               <p className="text-foreground/70">
//                 Get in touch to discuss your training needs and get a customized proposal
//               </p>
//             </div>

//             <form onSubmit={submit} className="space-y-4">
//               <div className="grid md:grid-cols-2 gap-4">
//                 <motion.div whileHover={{ scale: 1.02 }}>
//                   <input
//                     name="company"
//                     value={form.company}
//                     onChange={handleChange}
//                     placeholder="Company name"
//                     className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
//                     required
//                   />
//                 </motion.div>
//                 <motion.div whileHover={{ scale: 1.02 }}>
//                   <input
//                     name="contact"
//                     value={form.contact}
//                     onChange={handleChange}
//                     placeholder="Contact person"
//                     className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
//                     required
//                   />
//                 </motion.div>
//               </div>

//               <div className="grid md:grid-cols-2 gap-4">
//                 <motion.div whileHover={{ scale: 1.02 }}>
//                   <input
//                     name="email"
//                     type="email"
//                     value={form.email}
//                     onChange={handleChange}
//                     placeholder="Email address"
//                     className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
//                     required
//                   />
//                 </motion.div>
//                 <motion.div whileHover={{ scale: 1.02 }}>
//                   <input
//                     name="phone"
//                     value={form.phone}
//                     onChange={handleChange}
//                     placeholder="Phone number"
//                     className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
//                     required
//                   />
//                 </motion.div>
//               </div>

//               <motion.div whileHover={{ scale: 1.02 }}>
//                 <input
//                   name="employees"
//                   value={form.employees}
//                   onChange={handleChange}
//                   placeholder="Number of employees to train"
//                   className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
//                   required
//                 />
//               </motion.div>

//               <motion.div whileHover={{ scale: 1.02 }}>
//                 <textarea
//                   name="message"
//                   value={form.message}
//                   onChange={handleChange}
//                   placeholder="Tell us about your training requirements, goals, and timeline..."
//                   className="w-full min-h-[120px] px-4 py-3 rounded-xl bg-background/50 border border-border/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-none"
//                   required
//                 />
//               </motion.div>

//               <div className="flex flex-col sm:flex-row gap-3 pt-4">
//                 <motion.button
//                   type="submit"
//                   disabled={isSubmitting}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-bold shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <motion.div
//                         animate={{ rotate: 360 }}
//                         transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                         className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
//                       />
//                       Sending...
//                     </>
//                   ) : (
//                     <>
//                       <PhoneIcon className="w-5 h-5" />
//                       Send via WhatsApp
//                     </>
//                   )}
//                 </motion.button>

//                 <motion.button
//                   type="button"
//                   onClick={() => setForm({ company: "", contact: "", email: "", phone: "", employees: "", message: "" })}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="px-6 py-4 rounded-xl bg-background/50 border border-border/30 hover:border-primary/30 transition-all duration-300"
//                 >
//                   Reset Form
//                 </motion.button>
//               </div>
//             </form>
//           </div>

//           {/* Contact Info */}
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 2 }}
//             className="space-y-6"
//           >
//             <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-purple-600/10 border border-primary/20 p-8 backdrop-blur-sm">
//               <h3 className="text-2xl font-bold mb-4">Get Started Today</h3>
//               <p className="text-foreground/70 mb-6">
//                 Our corporate training experts are ready to design a customized program that drives real business results.
//               </p>

//               <div className="space-y-4">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-primary/10 rounded-lg">
//                     <PhoneIcon className="w-5 h-5 text-primary" />
//                   </div>
//                   <div>
//                     <div className="font-semibold">Call Us</div>
//                     <div className="text-foreground/70">+91 93993 45989</div>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-primary/10 rounded-lg">
//                     <EnvelopeIcon className="w-5 h-5 text-primary" />
//                   </div>
//                   <div>
//                     <div className="font-semibold">Email Us</div>
//                     <div className="text-foreground/70">corporate@ailearning.com</div>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-primary/10 rounded-lg">
//                     <ClockIcon className="w-5 h-5 text-primary" />
//                   </div>
//                   <div>
//                     <div className="font-semibold">Response Time</div>
//                     <div className="text-foreground/70">Within 24 hours</div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Quick Action Card */}
//             <motion.div
//               whileHover={{ scale: 1.02 }}
//               className="rounded-2xl bg-background/50 border border-border/30 p-6 backdrop-blur-sm"
//             >
//               <h4 className="font-bold text-lg mb-3">Need Immediate Assistance?</h4>
//               <p className="text-foreground/70 text-sm mb-4">
//                 Schedule a quick call with our training consultant to discuss your requirements.
//               </p>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-all duration-300"
//               >
//                 <PlayCircleIcon className="w-4 h-4" />
//                 Schedule Discovery Call
//               </motion.button>
//             </motion.div>
//           </motion.div>
//         </motion.div>
//         <GallerySection/>
//       </section>
//     </Layout>
//   );
// }
import { useState } from "react";
import { Link } from "react-router-dom";
import { MotionConfig, motion } from "framer-motion";
import Layout from "@/components/site/Layout";
import { fadeInUp, stagger } from "@/lib/animations";
import {
  AdjustmentsHorizontalIcon,
  ArrowRightIcon,
  BuildingOffice2Icon,
  BuildingOfficeIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  CloudIcon,
  CodeBracketIcon,
  Cog6ToothIcon,
  EnvelopeIcon,
  MegaphoneIcon,
  PhoneIcon,
  PresentationChartLineIcon,
  ShieldCheckIcon,
  TrophyIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

// ---------------------------------------------------------------------------
// Content for the Corporate Training page — edit the arrays below; the layout
// below them renders whatever they contain.
// ---------------------------------------------------------------------------

/**
 * Companies shown in the "Companies we've trained" strip.
 * PLACEHOLDERS — replace with your real client names. Set to [] to hide the strip.
 */
const clients = [
  "Partner Company A",
  "Partner Company B",
  "Partner Company C",
  "Partner Company D",
  "Partner Company E",
  "Partner Company F",
  "Partner Company G",
  "Partner Company H",
];

const heroPills = [
  { icon: UserGroupIcon, label: "Team-based learning" },
  { icon: AdjustmentsHorizontalIcon, label: "Custom curriculum" },
];

const metrics = [
  { value: "200+", label: "Corporate clients", icon: BuildingOfficeIcon },
  { value: "15,000+", label: "Professionals trained", icon: UserGroupIcon },
  { value: "95%", label: "Satisfaction rate", icon: ChartBarIcon },
  { value: "50%", label: "Productivity boost", icon: TrophyIcon },
];

/** Categories mirror the course catalog on the Courses page. */
const categories = [
  {
    icon: CodeBracketIcon,
    title: "Software Development",
    desc: "Build and modernize applications with full-stack and core programming skills.",
    topics: ["Java", "Spring Boot", "Python", "DSA"],
    color: "from-blue-600 to-indigo-600",
  },
  {
    icon: PresentationChartLineIcon,
    title: "Data & Analytics",
    desc: "Turn business data into decisions with analytics and big data engineering.",
    topics: ["Data Analytics", "Databricks", "Spark SQL", "Delta Lake"],
    color: "from-purple-600 to-fuchsia-600",
  },
  {
    icon: CloudIcon,
    title: "Cloud Computing",
    desc: "Move to the cloud and run your workloads with confidence on Microsoft Azure.",
    topics: ["Microsoft Azure", "Virtual Machines", "Storage"],
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: ShieldCheckIcon,
    title: "Cyber Security",
    desc: "Protect systems and data with network security, cryptography and threat response.",
    topics: ["Network Security", "Cryptography", "Threat Management"],
    color: "from-indigo-600 to-purple-600",
  },
  {
    icon: Cog6ToothIcon,
    title: "Enterprise Platforms",
    desc: "Administer Salesforce and run IT services to ITIL best practice.",
    topics: ["Salesforce", "ITIL"],
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: MegaphoneIcon,
    title: "Digital Marketing",
    desc: "Grow reach and leads with search, paid campaigns, social media and analytics.",
    topics: ["SEO & PPC", "Social Media", "Web Analytics"],
    color: "from-pink-500 to-rose-500",
  },
];

const benefits = [
  {
    icon: AdjustmentsHorizontalIcon,
    title: "Customized Curriculum",
    desc: "Learning paths aligned with your business objectives and technology stack.",
    points: ["Industry-specific content", "Real-world projects", "Custom assessments"],
    color: "from-blue-600 to-indigo-600",
  },
  {
    icon: UserGroupIcon,
    title: "Team Upskilling",
    desc: "Build cutting-edge skills across your whole workforce, together.",
    points: ["Group learning", "Team projects", "Progress tracking"],
    color: "from-purple-600 to-fuchsia-600",
  },
  {
    icon: ChartBarIcon,
    title: "Performance Analytics",
    desc: "Clear reporting on team progress and skill development.",
    points: ["Skill gap analysis", "Progress reports", "ROI measurement"],
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: ClockIcon,
    title: "Flexible Scheduling",
    desc: "On-site, remote or hybrid delivery to suit your team's workflow.",
    points: ["24/7 access", "Recorded sessions", "Multiple time zones"],
    color: "from-indigo-600 to-purple-600",
  },
];

const programs = [
  {
    title: "Team Bootcamp",
    format: "On-site, online or hybrid",
    desc: "An intensive, instructor-led program that brings a whole team up to speed on one technology.",
    audience: "New hires and project teams",
    points: ["Curriculum from our course catalog", "Hands-on labs and a capstone project", "Certificate on completion"],
  },
  {
    title: "Role-Based Upskilling",
    format: "On-site, online or hybrid",
    desc: "Learning paths matched to job roles and built around your existing tech stack.",
    audience: "Developers, analysts and admins",
    points: ["Skill-gap assessment before you start", "Modules tailored to each role", "Progress reports for managers"],
  },
  {
    title: "Custom Enterprise Program",
    format: "Hybrid, across locations",
    desc: "A fully tailored, multi-track program aligned with your business goals and schedule.",
    audience: "Departments and large organizations",
    points: ["Curriculum designed with your leads", "Flexible delivery across time zones", "Post-training assessment and ROI review"],
  },
];

const contactDetails = [
  { icon: PhoneIcon, label: "Call us", value: "+91 93993 45989", href: "tel:+919399345989" },
  { icon: EnvelopeIcon, label: "Email us", value: "corporate@ailearning.com", href: "mailto:corporate@ailearning.com" },
  { icon: ClockIcon, label: "Response time", value: "Within 24 hours" },
];

const WHATSAPP_NUMBER = "919399345989";

const emptyForm = {
  company: "",
  contact: "",
  email: "",
  phone: "",
  employees: "",
  program: "",
  message: "",
};

const field =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-200 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200";
const label = "mb-1 block text-xs font-semibold text-slate-600";

function scrollToId(id: string) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

// ---------------------------------------------------------------------------

export default function CorporateTraining() {
  const [form, setForm] = useState(emptyForm);
  const [sent, setSent] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setSent(false);
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  function requestProgram(title: string) {
    setSent(false);
    setForm((s) => ({ ...s, program: title }));
    scrollToId("enquiry");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();

    const whatsappMessage = `
🏢 Corporate Training Enquiry

🏛️ Company: ${form.company}
👤 Contact: ${form.contact}
📧 Email: ${form.email}
📞 Phone: ${form.phone}
👥 No. of Employees: ${form.employees}
🎯 Program: ${form.program || "Not sure yet"}
📝 Details: ${form.message || "-"}

📚 Sent via Corporate Training Portal
    `.trim();

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, "_blank", "noopener");

    setForm(emptyForm);
    setSent(true);
  }

  return (
    <Layout>
      <MotionConfig reducedMotion="user">
        <div className="bg-white">
          {/* ================= HERO ================= */}
          <section
            aria-labelledby="corporate-hero-heading"
            className="relative overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#2e1065] to-[#312e81] text-white"
          >
            <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-pink-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="container grid items-center gap-8 py-12 md:grid-cols-[1.1fr_0.9fr] md:gap-10 md:py-16">
              <motion.div initial="hidden" animate="show" variants={stagger}>
                <motion.span
                  variants={fadeInUp()}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-pink-100"
                >
                  <BuildingOffice2Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  For teams and enterprises
                </motion.span>

                <motion.h1
                  id="corporate-hero-heading"
                  variants={fadeInUp(0.08)}
                  className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
                >
                  Corporate{" "}
                  <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                    Training
                  </span>
                </motion.h1>

                <motion.p
                  variants={fadeInUp(0.16)}
                  className="mt-4 max-w-md text-lg leading-relaxed text-indigo-100/90"
                >
                  Instructor-led programs built around your team&apos;s tech stack and business goals, delivered
                  on-site, online or hybrid.
                </motion.p>

                <motion.div variants={fadeInUp(0.22)} className="mt-5 flex flex-wrap gap-3">
                  {heroPills.map(({ icon: Icon, label: text }) => (
                    <span
                      key={text}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-sm font-medium text-indigo-100"
                    >
                      <Icon className="h-4 w-4 text-pink-300" aria-hidden="true" />
                      {text}
                    </span>
                  ))}
                </motion.div>

                <motion.div variants={fadeInUp(0.3)} className="mt-7 flex flex-wrap gap-3">
                  <motion.button
                    type="button"
                    onClick={() => scrollToId("enquiry")}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-7 py-3.5 font-bold shadow-lg shadow-purple-900/40 transition-shadow hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2e1065]"
                  >
                    Request a Proposal
                    <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => scrollToId("programs")}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 font-semibold transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2e1065]"
                  >
                    View Programs
                  </motion.button>
                </motion.div>
              </motion.div>

              <motion.ul
                initial={{ opacity: 0, scale: 0.94, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                className="grid grid-cols-2 gap-3 rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm sm:gap-4 sm:p-5"
              >
                {metrics.map((m) => (
                  <li key={m.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <m.icon className="mb-2 h-5 w-5 text-pink-300" aria-hidden="true" />
                    <p className="text-2xl font-extrabold sm:text-3xl">{m.value}</p>
                    <p className="mt-0.5 text-sm text-indigo-100/80">{m.label}</p>
                  </li>
                ))}
              </motion.ul>
            </div>
          </section>

          {/* ================= COMPANIES ================= */}
          {clients.length > 0 && (
            <section aria-labelledby="corporate-clients-heading" className="container pt-10">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:gap-8"
              >
                <h2
                  id="corporate-clients-heading"
                  className="shrink-0 text-base font-bold text-[#171034] lg:w-40"
                >
                  Companies we&apos;ve trained
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {clients.map((name) => (
                    <li
                      key={name}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-sm font-medium text-slate-700 transition-colors duration-300 hover:border-purple-300 hover:bg-purple-50/60"
                    >
                      <BuildingOffice2Icon className="h-4 w-4 text-purple-500" aria-hidden="true" />
                      {name}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </section>
          )}

          {/* ================= CATEGORIES ================= */}
          <section aria-labelledby="corporate-categories-heading" className="container py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto mb-8 max-w-2xl text-center"
            >
              <span className="text-sm font-bold uppercase tracking-wide text-purple-600">Training Categories</span>
              <h2
                id="corporate-categories-heading"
                className="mt-2 text-3xl font-extrabold text-[#171034] md:text-4xl"
              >
                What We Train Your Team On
              </h2>
              <p className="mt-2 text-slate-600">Six focus areas, taught by trainers with real project experience.</p>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((c, i) => (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: (i % 3) * 0.08 }}
                  whileHover={{ y: -5 }}
                  className="flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${c.color} shadow-md`}
                    >
                      <c.icon className="h-5 w-5 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-bold text-[#171034]">{c.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{c.desc}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {c.topics.map((t) => (
                      <li key={t} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {t}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/courses"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700 hover:text-purple-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2"
              >
                Browse the full course catalog
                <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </section>

          {/* ================= KEY BENEFITS ================= */}
          <section
            aria-labelledby="corporate-benefits-heading"
            className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
          >
            <div className="container py-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mx-auto mb-8 max-w-2xl text-center"
              >
                <span className="text-sm font-bold uppercase tracking-wide text-blue-600">Key Benefits</span>
                <h2
                  id="corporate-benefits-heading"
                  className="mt-2 text-3xl font-extrabold text-[#171034] md:text-4xl"
                >
                  Why Teams Choose Us
                </h2>
              </motion.div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {benefits.map((b, i) => (
                  <motion.div
                    key={b.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -6 }}
                    className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-xl"
                  >
                    <div
                      className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${b.color} shadow-md`}
                    >
                      <b.icon className="h-5 w-5 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-bold text-[#171034]">{b.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{b.desc}</p>
                    <ul className="mt-3 space-y-1.5 border-t border-slate-100 pt-3">
                      {b.points.map((p) => (
                        <li key={p} className="flex items-center gap-2 text-sm text-slate-700">
                          <CheckCircleIcon className="h-4 w-4 shrink-0 text-purple-500" aria-hidden="true" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ================= PROGRAMS ================= */}
          <section
            id="programs"
            aria-labelledby="corporate-programs-heading"
            className="scroll-mt-20 bg-gradient-to-br from-[#1e1b4b] via-[#2e1065] to-[#312e81] text-white"
          >
            <div className="container py-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mx-auto mb-8 max-w-2xl text-center"
              >
                <span className="text-sm font-bold uppercase tracking-wide text-pink-300">Our Programs</span>
                <h2 id="corporate-programs-heading" className="mt-2 text-3xl font-extrabold md:text-4xl">
                  Choose How You Want to Train
                </h2>
                <p className="mt-2 text-indigo-200/80">
                  Start with a ready program or have us build one around your goals.
                </p>
              </motion.div>

              <div className="grid gap-5 md:grid-cols-3">
                {programs.map((p, i) => (
                  <motion.div
                    key={p.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="flex flex-col rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm"
                  >
                    <span className="self-start rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                      {p.format}
                    </span>
                    <h3 className="mt-3 text-lg font-bold leading-snug">{p.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-indigo-100/85">{p.desc}</p>
                    <p className="mt-3 text-sm text-indigo-100/85">
                      <span className="font-semibold text-white">Best for: </span>
                      {p.audience}
                    </p>
                    <ul className="mt-3 space-y-1.5 text-sm text-indigo-100/85">
                      {p.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-2">
                          <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-pink-300" aria-hidden="true" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                    <motion.button
                      type="button"
                      onClick={() => requestProgram(p.title)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 py-2.5 text-sm font-bold shadow-md transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2e1065] md:mt-auto"
                    >
                      Request this program
                      <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ================= CTA + ENQUIRY ================= */}
          <section
            id="enquiry"
            aria-labelledby="corporate-cta-heading"
            className="scroll-mt-20 bg-gradient-to-br from-purple-50 via-white to-pink-50"
          >
            <div className="container py-12">
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
                {/* CTA panel */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 text-white shadow-xl shadow-purple-500/20"
                >
                  <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-pink-400/20 blur-3xl" />
                  <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-blue-300/20 blur-3xl" />

                  <div className="relative">
                    <h2 id="corporate-cta-heading" className="text-3xl font-extrabold leading-tight md:text-4xl">
                      Plan a Program for Your Team
                    </h2>
                    <p className="mt-3 text-indigo-100/90">
                      Tell us about your team and goals. Our training experts will send a customized proposal.
                    </p>

                    <ul className="mt-6 space-y-4">
                      {contactDetails.map((d) => (
                        <li key={d.label} className="flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                            <d.icon className="h-5 w-5" aria-hidden="true" />
                          </span>
                          <div className="min-w-0">
                            <div className="text-xs text-indigo-100/75">{d.label}</div>
                            {d.href ? (
                              <a
                                href={d.href}
                                className="break-all font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                              >
                                {d.value}
                              </a>
                            ) : (
                              <div className="font-semibold">{d.value}</div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                {/* Enquiry form */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8"
                >
                  <h3 className="text-xl font-bold text-[#171034]">Request a Corporate Program</h3>

                  <form onSubmit={submit} className="mt-5 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="company" className={label}>Company name</label>
                        <input id="company" name="company" value={form.company} onChange={handleChange} className={field} required autoComplete="organization" />
                      </div>
                      <div>
                        <label htmlFor="contact" className={label}>Contact person</label>
                        <input id="contact" name="contact" value={form.contact} onChange={handleChange} className={field} required autoComplete="name" />
                      </div>
                      <div>
                        <label htmlFor="email" className={label}>Email address</label>
                        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className={field} required autoComplete="email" />
                      </div>
                      <div>
                        <label htmlFor="phone" className={label}>Phone number</label>
                        <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} className={field} required autoComplete="tel" />
                      </div>
                      <div>
                        <label htmlFor="employees" className={label}>Employees to train</label>
                        <input id="employees" name="employees" value={form.employees} onChange={handleChange} className={field} required inputMode="numeric" />
                      </div>
                      <div>
                        <label htmlFor="program" className={label}>Program</label>
                        <select id="program" name="program" value={form.program} onChange={handleChange} className={field}>
                          <option value="">Not sure yet</option>
                          {programs.map((p) => (
                            <option key={p.title} value={p.title}>{p.title}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className={label}>Requirements and timeline (optional)</label>
                      <textarea
                        id="message"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={3}
                        className={`${field} resize-none`}
                      />
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-purple-500/25 transition-shadow hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                    >
                      <PhoneIcon className="h-5 w-5" aria-hidden="true" />
                      Send via WhatsApp
                    </motion.button>

                    <p role="status" className="min-h-[1.25rem] text-center text-sm text-slate-600">
                      {sent && "WhatsApp opened in a new tab. Send the message there to complete your enquiry."}
                    </p>
                  </form>
                </motion.div>
              </div>
            </div>
          </section>
        </div>
      </MotionConfig>
    </Layout>
  );
}