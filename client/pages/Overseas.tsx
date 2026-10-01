// // pages/Overseas.tsx
// import { useState } from "react";
// import Layout from "@/components/site/Layout";
// import { motion } from "framer-motion";
// import { fadeInUp, stagger } from "@/lib/animations";
// import {
//   GlobeAltIcon,
//   AcademicCapIcon,
//   UserGroupIcon,
//   PlayIcon,
//   SparklesIcon,
//   ChatBubbleLeftRightIcon,
//   ClockIcon,
//   CheckBadgeIcon,
//   ArrowRightIcon,
//   PresentationChartLineIcon,
//   PuzzlePieceIcon,
// } from "@heroicons/react/24/outline";

// // Import flag images
// import germanFlag from "/flags/germ.png";
// import japaneseFlag from "/flags/japan.png";
// import frenchFlag from "/flags/fran.png";
// import spanishFlag from "/flags/spain.png";

// // Language courses data
// const languageCourses = [
//   {
//     id: "german",
//     name: "German",
//     flag: germanFlag,
//     flagEmoji: "🇩🇪",
//     level: "A1 to C2",
//     duration: "12 weeks",
//     batchSize: "10-15 students",
//     description: "Master German language from basics to advanced level with native speakers and interactive sessions.",
//     features: [
//       "Goethe Institute Curriculum",
//       "Exam Preparation (A1-C2)",
//       "Conversation Practice",
//       "Cultural Immersion"
//     ],
//     color: "from-red-500 to-orange-500",
//     bgColor: "from-red-500/10 to-orange-500/10",
//     gameAvailable: true,
//     gameUrl: "https://learn-gern-play.vercel.app/",
//     gameFeatures: ["Flip Cards", "Quiz", "Memory Game"]
//   },
//   {
//     id: "japanese",
//     name: "Japanese",
//     flag: japaneseFlag,
//     flagEmoji: "🇯🇵",
//     level: "N5 to N1",
//     duration: "14 weeks",
//     batchSize: "8-12 students",
//     description: "Learn Japanese language with focus on JLPT preparation, kanji mastery, and business communication.",
//     features: [
//       "JLPT Preparation (N5-N1)",
//       "Kanji Mastery Program",
//       "Business Japanese",
//       "Cultural Workshops"
//     ],
//     color: "from-pink-500 to-purple-500",
//     bgColor: "from-pink-500/10 to-purple-500/10",
//     gameAvailable: false
//   },
//   {
//     id: "french",
//     name: "French",
//     flag: frenchFlag,
//     flagEmoji: "🇫🇷",
//     level: "A1 to C2",
//     duration: "12 weeks",
//     batchSize: "10-15 students",
//     description: "Parlez-vous français? Master the language of love, diplomacy, and culture with our comprehensive French program.",
//     features: [
//       "DELF/DALF Preparation",
//       "Pronunciation Excellence",
//       "French Literature",
//       "Cultural Immersion"
//     ],
//     color: "from-blue-500 to-indigo-500",
//     bgColor: "from-blue-500/10 to-indigo-500/10",
//     gameAvailable: false
//   },
//   {
//     id: "spanish",
//     name: "Spanish",
//     flag: spanishFlag,
//     flagEmoji: "🇪🇸",
//     level: "A1 to C2",
//     duration: "12 weeks",
//     batchSize: "12-18 students",
//     description: "Learn Spanish, the second most spoken language in the world, with our immersive and practical approach.",
//     features: [
//       "DELE Preparation",
//       "Conversation Mastery",
//       "Business Spanish",
//       "Hispanic Culture"
//     ],
//     color: "from-yellow-500 to-amber-500",
//     bgColor: "from-yellow-500/10 to-amber-500/10",
//     gameAvailable: false
//   }
// ];

// // Benefits of learning with us
// const benefits = [
//   {
//     icon: UserGroupIcon,
//     title: "Native Speakers",
//     description: "Learn from experienced native language instructors"
//   },
//   {
//     icon: ClockIcon,
//     title: "Flexible Batches",
//     description: "Weekday and weekend batches to suit your schedule"
//   },
//   {
//     icon: CheckBadgeIcon,
//     title: "Certification",
//     description: "Globally recognized certificates upon completion"
//   },
//   {
//     icon: PresentationChartLineIcon,
//     title: "Career Support",
//     description: "Job assistance and placement support"
//   }
// ];

// // Game Card Component
// const GameCard = ({ gameUrl, features }: { gameUrl: string; features: string[] }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true }}
//       transition={{ delay: 0.2 }}
//       className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-purple-600/10 to-pink-500/10 border border-primary/20 p-6 backdrop-blur-sm"
//     >
//       <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-full blur-2xl" />
      
//       <div className="relative">
//         <div className="flex items-center gap-3 mb-4">
//           <div className="p-3 rounded-xl bg-gradient-to-r from-primary to-purple-600">
//             <PuzzlePieceIcon className="w-6 h-6 text-white" />
//           </div>
//           <div>
//             <h3 className="text-xl font-bold text-foreground">Learn & Play German</h3>
//             <p className="text-sm text-muted-foreground">Interactive Vocabulary Games</p>
//           </div>
//         </div>
        
//         <p className="text-foreground/70 mb-4">
//           Master German vocabulary through fun and engaging games. Perfect for beginners and intermediate learners.
//         </p>
        
//         {/* Game Features */}
//         <div className="grid grid-cols-3 gap-3 mb-6">
//           {features.map((feature) => (
//             <div
//               key={feature}
//               className="text-center p-3 rounded-lg bg-white/10 backdrop-blur-sm"
//             >
//               <span className="text-sm font-medium text-foreground">{feature}</span>
//             </div>
//           ))}
//         </div>
        
//         {/* Play Button */}
//         <motion.a
//           href={gameUrl}
//           target="_blank"
//           rel="noopener noreferrer"
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
//         >
//           <PlayIcon className="w-5 h-5" />
//           <span>Play Now</span>
//           <ArrowRightIcon className="w-4 h-4" />
//         </motion.a>
//       </div>
//     </motion.div>
//   );
// };

// // Language Card Component
// const LanguageCard = ({ course, index }: { course: any; index: number }) => {
//   const [isExpanded, setIsExpanded] = useState(false);

//   return (
//     <motion.div
//       variants={fadeInUp(index * 0.1)}
//       initial="hidden"
//       whileInView="show"
//       viewport={{ once: true }}
//       className="group relative h-full"
//     >
//       <div className={`h-full relative rounded-2xl bg-gradient-to-br from-background to-muted/20 p-6 border border-border/50 overflow-hidden backdrop-blur-sm transition-all duration-500 hover:shadow-xl ${course.bgColor}`}>
//         {/* Animated Background */}
//         <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
        
//         <div className="relative z-10 h-full flex flex-col">
//           {/* Header with Flag Image */}
//           <div className="flex items-start justify-between mb-4">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 rounded-lg overflow-hidden shadow-md">
//                 <img 
//                   src={course.flag} 
//                   alt={`${course.name} Flag`}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div>
//                 <h3 className="text-xl font-bold text-foreground">{course.name}</h3>
//                 <p className="text-sm text-muted-foreground">{course.level}</p>
//               </div>
//             </div>
//             <div className="text-3xl">{course.flagEmoji}</div>
//           </div>
          
//           {/* Description */}
//           <p className="text-foreground/70 text-sm mb-4 line-clamp-3">
//             {course.description}
//           </p>
          
//           {/* Course Info */}
//           <div className="grid grid-cols-2 gap-3 mb-4">
//             <div className="flex items-center gap-2">
//               <ClockIcon className="w-4 h-4 text-primary" />
//               <span className="text-sm text-foreground/70">{course.duration}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <UserGroupIcon className="w-4 h-4 text-primary" />
//               <span className="text-sm text-foreground/70">{course.batchSize}</span>
//             </div>
//           </div>
          
//           {/* Features */}
//           <div className="space-y-2 mb-4 flex-grow">
//             {course.features.slice(0, isExpanded ? undefined : 3).map((feature: string) => (
//               <div key={feature} className="flex items-center gap-2">
//                 <CheckBadgeIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
//                 <span className="text-sm text-foreground/70">{feature}</span>
//               </div>
//             ))}
//           </div>
          
//           {/* Expand Button */}
//           {course.features.length > 3 && (
//             <button
//               onClick={() => setIsExpanded(!isExpanded)} 
//               className="text-sm text-primary hover:text-primary/80 transition-colors mb-4 text-left"
//             >
//               {isExpanded ? "Show Less" : `+${course.features.length - 3} More Features`}
//             </button>
//           )}
          
//           {/* Game Available Badge */}
//           {course.gameAvailable && (
//             <div className="mb-4">
//               {/* <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
//                 <SparklesIcon className="w-4 h-4 text-green-500" />
//                 <span className="text-xs font-medium text-green-600">Interactive Games Available</span>
//               </div> */}
//             </div>
//           )}
          
//           {/* CTA Button */}
//           <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             className={`w-full px-4 py-2.5 rounded-xl bg-gradient-to-r ${course.color} text-white font-semibold hover:shadow-lg transition-all duration-300 mt-auto`}
//           >
//             Enroll Now
//           </motion.button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default function Overseas() {
//   const germanCourse = languageCourses.find(c => c.id === "german");

//   return (
//     <Layout>
//       <div className="bg-white">
//         {/* Hero Section */}
//         <section className="relative bg-gradient-to-br from-primary/5 via-purple-600/5 to-pink-500/5 py-20">
//           <div className="container">
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.8 }}
//               className="mx-auto max-w-4xl text-center"
//             >
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.5 }}
//                 whileInView={{ opacity: 1, scale: 1 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: 0.2, type: "spring" }}
//                 className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
//               >
//                 <GlobeAltIcon className="w-4 h-4 text-primary" />
//                 <span className="text-sm font-semibold text-primary">Overseas Education</span>
//               </motion.div>

//               <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent mb-6">
//                 Master Foreign Languages with
//                 <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"> Expert Guidance</span>
//               </h1>
              
//               <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
//                 Learn German, Japanese, French, Spanish and more from native speakers. 
//                 Prepare for international certifications and unlock global opportunities.
//               </p>
//             </motion.div>
//           </div>
//         </section>

//         {/* Interactive Game Section */}
//         {germanCourse && (
//           <section className="py-16 bg-gradient-to-b from-white to-primary/5">
//             <div className="container">
//               <motion.div
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 className="text-center mb-12"
//               >
//                 {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 mb-6">
//                   <SparklesIcon className="w-4 h-4 text-green-500" />
//                   <span className="text-sm font-semibold text-green-600">Featured Game</span>
//                 </div> */}
//                 <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
//                   Learn German Through Play
//                 </h2>
//                 <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
//                   Make vocabulary learning fun with our interactive games. Perfect for beginners!
//                 </p>
//               </motion.div>

//               <div className="max-w-4xl mx-auto">
//                 <GameCard 
//                   gameUrl={germanCourse.gameUrl!} 
//                   features={germanCourse.gameFeatures!} 
//                 />
//               </div>
//             </div>
//           </section>
//         )}

//         {/* Language Courses Section */}
//         <section className="py-20">
//           <div className="container">
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               className="text-center mb-16"
//             >
//               <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
//                 Choose Your Language
//               </h2>
//               <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
//                 Comprehensive language programs designed to help you achieve fluency and certification
//               </p>
//             </motion.div>

//             <motion.div
//               variants={stagger}
//               initial="hidden"
//               whileInView="show"
//               viewport={{ once: true }}
//               className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
//             >
//               {languageCourses.map((course, index) => (
//                 <LanguageCard key={course.id} course={course} index={index} />
//               ))}
//             </motion.div>
//           </div>
//         </section>

//         {/* Benefits Section */}
//         <section className="py-20 bg-gradient-to-b from-primary/5 to-transparent">
//           <div className="container">
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               className="text-center mb-16"
//             >
//               <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
//                 Why Learn With Us?
//               </h2>
//               <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
//                 Experience world-class language education with unique advantages
//               </p>
//             </motion.div>

//             <motion.div
//               variants={stagger}
//               initial="hidden"
//               whileInView="show"
//               viewport={{ once: true }}
//               className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
//             >
//               {benefits.map((benefit, index) => {
//                 const IconComponent = benefit.icon;
//                 return (
//                   <motion.div
//                     key={benefit.title}
//                     variants={fadeInUp(index * 0.1)}
//                     className="text-center p-6 rounded-2xl bg-white border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300"
//                   >
//                     <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white mb-4">
//                       <IconComponent className="w-6 h-6" />
//                     </div>
//                     <h3 className="text-lg font-bold text-foreground mb-2">{benefit.title}</h3>
//                     <p className="text-sm text-foreground/70">{benefit.description}</p>
//                   </motion.div>
//                 );
//               })}
//             </motion.div>
//           </div>
//         </section>

//         {/* CTA Section */}
//         <section className="py-20">
//           <div className="container">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               viewport={{ once: true }}
//               className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-purple-600 p-12 text-center"
//             >
//               <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl" />
//               <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
//               <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
              
//               <div className="relative z-10">
//                 <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
//                   Ready to Start Your Language Journey?
//                 </h2>
//                 <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
//                   Join thousands of students who have successfully learned a new language with us
//                 </p>
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="px-8 py-4 bg-white text-primary font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
//                 >
//                   Book Free Demo Class
//                 </motion.button>
//               </div>
//             </motion.div>
//           </div>
//         </section>
//       </div>
//     </Layout>
//   );
// }
// pages/Overseas.tsx
// pages/Overseas.tsx
import { useState } from "react";
import Layout from "@/components/site/Layout";
import { MotionConfig, motion } from "framer-motion";
import { fadeInUp, stagger } from "@/lib/animations";
import {
  ArrowRightIcon,
  BuildingLibraryIcon,
  CalendarDaysIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  ClockIcon,
  GlobeAltIcon,
  PhoneIcon,
  PlayIcon,
  PresentationChartLineIcon,
  PuzzlePieceIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

// Import flag images
import germanFlag from "/flags/germ.png";
import japaneseFlag from "/flags/japan.png";
import frenchFlag from "/flags/fran.png";
import spanishFlag from "/flags/spain.png";

// ---------------------------------------------------------------------------
// Content — edit the data below; the layout renders whatever it contains.
// ---------------------------------------------------------------------------

/**
 * One soft pastel palette per language. Every place a language appears (hero
 * tile, course card, exam list, enrollment picker) reads from its theme, so the
 * colors stay consistent. Class names are written out in full so Tailwind keeps them.
 */
const themes = {
  german: {
    // red / orange
    surface: "bg-gradient-to-br from-red-50 to-orange-50 border-red-200",
    cardHover: "hover:border-red-300 hover:shadow-red-900/10",
    chip: "bg-red-100 text-red-700",
    accent: "text-red-600",
    button: "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-red-500/25 hover:from-red-700 hover:to-orange-700",
    selected: "!border-red-400 ring-2 ring-red-200",
  },
  japanese: {
    // pink / purple
    surface: "bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200",
    cardHover: "hover:border-pink-300 hover:shadow-pink-900/10",
    chip: "bg-pink-100 text-pink-700",
    accent: "text-pink-600",
    button: "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-pink-500/25 hover:from-pink-700 hover:to-purple-700",
    selected: "!border-pink-400 ring-2 ring-pink-200",
  },
  french: {
    // blue / indigo
    surface: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200",
    cardHover: "hover:border-blue-300 hover:shadow-blue-900/10",
    chip: "bg-blue-100 text-blue-700",
    accent: "text-blue-600",
    button: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700",
    selected: "!border-blue-400 ring-2 ring-blue-200",
  },
  spanish: {
    // yellow / amber (dark text keeps the button readable)
    surface: "bg-gradient-to-br from-yellow-50 to-amber-50 border-amber-200",
    cardHover: "hover:border-amber-300 hover:shadow-amber-900/10",
    chip: "bg-amber-100 text-amber-800",
    accent: "text-amber-600",
    button: "bg-gradient-to-r from-yellow-400 to-amber-400 text-amber-950 shadow-amber-500/25 hover:from-yellow-500 hover:to-amber-500",
    selected: "!border-amber-400 ring-2 ring-amber-200",
  },
};

type Theme = (typeof themes)["german"];

/** Used before a language is chosen. */
const defaultTheme: Theme = {
  surface: "bg-slate-50 border-slate-200",
  cardHover: "",
  chip: "bg-violet-100 text-violet-700",
  accent: "text-violet-600",
  button: "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-violet-500/20",
  selected: "!border-violet-400 ring-2 ring-violet-200",
};

// Language courses data
const languageCourses = [
  {
    id: "german",
    theme: themes.german,
    name: "German",
    flag: germanFlag,
    greeting: "Hallo",
    langCode: "de",
    exam: "Goethe",
    level: "A1 to C2",
    duration: "12 weeks",
    batchSize: "10–15 students",
    description: "Master German language from basics to advanced level with native speakers and interactive sessions.",
    features: [
      "Goethe Institute Curriculum",
      "Exam Preparation (A1-C2)",
      "Conversation Practice",
      "Cultural Immersion",
    ],
    gameAvailable: true,
    gameUrl: "https://learn-gern-play.vercel.app/",
    gameFeatures: ["Flip Cards", "Quiz", "Memory Game"],
  },
  {
    id: "japanese",
    theme: themes.japanese,
    name: "Japanese",
    flag: japaneseFlag,
    greeting: "こんにちは",
    langCode: "ja",
    exam: "JLPT",
    level: "N5 to N1",
    duration: "14 weeks",
    batchSize: "8–12 students",
    description: "Learn Japanese language with focus on JLPT preparation, kanji mastery, and business communication.",
    features: [
      "JLPT Preparation (N5-N1)",
      "Kanji Mastery Program",
      "Business Japanese",
      "Cultural Workshops",
    ],
    gameAvailable: false,
  },
  {
    id: "french",
    theme: themes.french,
    name: "French",
    flag: frenchFlag,
    greeting: "Bonjour",
    langCode: "fr",
    exam: "DELF / DALF",
    level: "A1 to C2",
    duration: "12 weeks",
    batchSize: "10–15 students",
    description: "Parlez-vous français? Master the language of love, diplomacy, and culture with our comprehensive French program.",
    features: [
      "DELF/DALF Preparation",
      "Pronunciation Excellence",
      "French Literature",
      "Cultural Immersion",
    ],
    gameAvailable: false,
  },
  {
    id: "spanish",
    theme: themes.spanish,
    name: "Spanish",
    flag: spanishFlag,
    greeting: "Hola",
    langCode: "es",
    exam: "DELE",
    level: "A1 to C2",
    duration: "12 weeks",
    batchSize: "12–18 students",
    description: "Learn Spanish, the second most spoken language in the world, with our immersive and practical approach.",
    features: [
      "DELE Preparation",
      "Conversation Mastery",
      "Business Spanish",
      "Hispanic Culture",
    ],
    gameAvailable: false,
  },
];

type LanguageCourse = (typeof languageCourses)[number];

// Non-language cards (benefits) borrow the same four palettes in turn.
const paletteCycle: Theme[] = languageCourses.map((c) => c.theme);

// Benefits of learning with us
const benefits = [
  {
    icon: UserGroupIcon,
    title: "Native Speakers",
    description: "Learn from experienced native language instructors.",
  },
  {
    icon: ClockIcon,
    title: "Flexible Batches",
    description: "Weekday and weekend batches to suit your schedule.",
  },
  {
    icon: CheckBadgeIcon,
    title: "Certification",
    description: "Globally recognized certificates upon completion.",
  },
  {
    icon: PresentationChartLineIcon,
    title: "Career Support",
    description: "Job assistance and placement support.",
  },
];

const batchOptions = ["Weekday batch", "Weekend batch"];

const enrollPerks = [
  "Live demo class with an instructor",
  "Weekday and weekend batches",
  "Certificate on completion",
];

const WHATSAPP_NUMBER = "919399345989";

// Hero figures are derived from the course data so they never drift out of sync.
const numbersIn = (s: string) => (s.match(/\d+/g) ?? []).map(Number);
const spanOf = (values: number[]) => `${Math.min(...values)}–${Math.max(...values)}`;

const heroStats = [
  { value: String(languageCourses.length), label: "Languages" },
  { value: spanOf(languageCourses.flatMap((c) => numbersIn(c.duration))), label: "Weeks per course" },
  { value: spanOf(languageCourses.flatMap((c) => numbersIn(c.batchSize))), label: "Students per batch" },
];

const emptyForm = { name: "", phone: "", email: "", language: "", batch: "" };

const field =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-200 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200";
const fieldLabel = "mb-1 block text-xs font-semibold text-slate-600";
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2";

function scrollToId(id: string) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

// ---------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------

function Flag({ course, className = "h-7 w-10" }: { course: LanguageCourse; className?: string }) {
  return (
    <img
      src={course.flag}
      alt=""
      className={`${className} shrink-0 rounded-md object-cover shadow-sm ring-1 ring-black/10`}
    />
  );
}

/** Faint globe line-art used as a hero backdrop. */
function GlobeLines({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      aria-hidden="true"
      className={className}
    >
      <circle cx="200" cy="200" r="180" />
      <ellipse cx="200" cy="200" rx="70" ry="180" />
      <ellipse cx="200" cy="200" rx="130" ry="180" />
      <ellipse cx="200" cy="200" rx="180" ry="60" />
      <ellipse cx="200" cy="200" rx="180" ry="120" />
      <line x1="20" y1="200" x2="380" y2="200" />
      <line x1="200" y1="20" x2="200" y2="380" />
      <path d="M52 110 C 140 70, 260 70, 348 110" strokeDasharray="4 6" />
    </svg>
  );
}

function LanguageCard({
  course,
  onEnroll,
}: {
  course: LanguageCourse;
  onEnroll: (id: string) => void;
}) {
  const t = course.theme;
  return (
    <motion.article
      variants={fadeInUp()}
      whileHover={{ y: -4 }}
      className={`group flex h-full flex-col rounded-2xl border p-5 shadow-sm transition-[border-color,box-shadow] duration-300 hover:shadow-xl ${t.surface} ${t.cardHover}`}
    >
      <div className="flex items-center gap-3">
        <Flag course={course} className="h-9 w-[3.25rem]" />
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold leading-tight text-[#171034]">{course.name}</h3>
          <p className="text-sm text-slate-500">{course.level}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${t.chip}`}>
          {course.exam}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-600">{course.description}</p>

      <ul className="mt-4 grid grid-cols-2 divide-x divide-slate-900/10 rounded-xl border border-slate-900/10 bg-white/70 text-sm font-medium text-slate-700">
        <li className="flex items-center gap-2 px-3 py-2">
          <ClockIcon className={`h-4 w-4 shrink-0 ${t.accent}`} aria-hidden="true" />
          <span className="sr-only">Duration: </span>
          {course.duration}
        </li>
        <li className="flex items-center gap-2 px-3 py-2">
          <UserGroupIcon className={`h-4 w-4 shrink-0 ${t.accent}`} aria-hidden="true" />
          <span className="sr-only">Batch size: </span>
          {course.batchSize}
        </li>
      </ul>

      <ul className="mt-4 flex-grow space-y-1.5">
        {course.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-slate-700">
            <CheckCircleIcon className={`mt-0.5 h-4 w-4 shrink-0 ${t.accent}`} aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => onEnroll(course.id)}
        className={`mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-bold shadow-md transition-all duration-300 hover:shadow-lg ${t.button} ${focusRing}`}
      >
        Enroll in {course.name}
        <ArrowRightIcon
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </button>
    </motion.article>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function Overseas() {
  const germanCourse = languageCourses.find((c) => c.id === "german");
  const [form, setForm] = useState(emptyForm);
  const [sent, setSent] = useState(false);

  // Enrollment button and picker follow the language the visitor selects.
  const activeTheme = languageCourses.find((c) => c.name === form.language)?.theme ?? defaultTheme;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setSent(false);
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  function enrollIn(id: string) {
    const course = languageCourses.find((c) => c.id === id);
    if (!course) return;
    setSent(false);
    setForm((s) => ({ ...s, language: course.name }));
    scrollToId("enroll");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();

    const message = `
🌍 Language Demo Class Request

👤 Name: ${form.name}
📞 Phone: ${form.phone}
📧 Email: ${form.email || "-"}
🗣️ Language: ${form.language}
📅 Batch: ${form.batch || "No preference"}

📚 Sent via Overseas Education page
    `.trim();

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
    setForm(emptyForm);
    setSent(true);
  }

  return (
    <Layout>
      <MotionConfig reducedMotion="user">
        <div className="bg-white">
          {/* ================= HERO ================= */}
          <section
            aria-labelledby="overseas-hero-heading"
            className="relative overflow-hidden bg-[#1e1b4b] text-white"
          >
            <GlobeLines className="pointer-events-none absolute -right-24 -top-20 h-[30rem] w-[30rem] text-white/[0.07]" />

            <div className="container relative grid items-center gap-10 py-12 md:grid-cols-[1.1fr_0.9fr] md:py-16">
              <motion.div initial="hidden" animate="show" variants={stagger}>
                <motion.span
                  variants={fadeInUp()}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-indigo-100"
                >
                  <GlobeAltIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  Overseas Education
                </motion.span>

                <motion.h1
                  id="overseas-hero-heading"
                  variants={fadeInUp(0.08)}
                  className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl"
                >
                  Learn a language.
                  <br />
                  <span className="text-violet-300">Open doors abroad.</span>
                </motion.h1>

                <motion.p
                  variants={fadeInUp(0.16)}
                  className="mt-4 max-w-lg text-lg leading-relaxed text-indigo-100/90"
                >
                  Learn German, Japanese, French and Spanish from native speakers, and prepare for the international
                  certifications that count.
                </motion.p>

                <motion.div variants={fadeInUp(0.24)} className="mt-6 flex flex-wrap gap-3">
                  <motion.button
                    type="button"
                    onClick={() => scrollToId("enroll")}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-6 py-3 font-bold shadow-lg shadow-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1e1b4b]"
                  >
                    Book a free demo class
                    <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => scrollToId("languages")}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 font-semibold transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1e1b4b]"
                  >
                    Explore languages
                  </motion.button>
                </motion.div>

                <motion.ul
                  variants={fadeInUp(0.32)}
                  className="mt-8 grid max-w-md grid-cols-3 divide-x divide-white/15 border-t border-white/15 pt-5"
                >
                  {heroStats.map((st) => (
                    <li key={st.label} className="px-4 first:pl-0">
                      <p className="text-2xl font-extrabold">{st.value}</p>
                      <p className="text-xs text-indigo-200/80">{st.label}</p>
                    </li>
                  ))}
                </motion.ul>
              </motion.div>

              {/* Greeting tiles — one per language */}
              <motion.ul
                aria-label="Languages offered"
                initial="hidden"
                animate="show"
                variants={stagger}
                className="grid grid-cols-2 gap-3 sm:gap-4"
              >
                {languageCourses.map((c, i) => (
                  <li key={c.id} className={`flex flex-col ${i % 2 === 1 ? "md:pt-6" : ""}`}>
                    <motion.div
                      variants={fadeInUp()}
                      whileHover={{ y: -3 }}
                      className={`flex-1 rounded-2xl border p-4 shadow-lg shadow-black/10 sm:p-5 ${c.theme.surface}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Flag course={c} className="h-7 w-10" />
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${c.theme.chip}`}>
                          {c.exam}
                        </span>
                      </div>
                      <p lang={c.langCode} className="mt-4 text-2xl font-bold leading-tight text-[#171034] sm:text-3xl">
                        {c.greeting}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">{c.name}</p>
                      <p className="text-xs text-slate-600">{c.level}</p>
                    </motion.div>
                  </li>
                ))}
              </motion.ul>
            </div>
          </section>

          {/* ================= LANGUAGES ================= */}
          <section id="languages" aria-labelledby="languages-heading" className="scroll-mt-20">
            <div className="container py-12 md:py-14">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8 max-w-2xl"
              >
                <h2 id="languages-heading" className="text-3xl font-extrabold tracking-tight text-[#171034] md:text-4xl">
                  Choose your language
                </h2>
                <p className="mt-2 text-lg text-slate-600">
                  Programs built to take you from first words to certification.
                </p>
              </motion.div>

              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"
              >
                {languageCourses.map((course) => (
                  <LanguageCard key={course.id} course={course} onEnroll={enrollIn} />
                ))}
              </motion.div>

              {/* German vocabulary games */}
              {germanCourse?.gameAvailable && germanCourse.gameUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`mt-6 flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:gap-6 ${germanCourse.theme.surface}`}
                >
                  <div className="flex items-center gap-4 sm:flex-1">
                    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-md ${germanCourse.theme.button}`}>
                      <PuzzlePieceIcon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-[#171034]">Learn &amp; Play German</h3>
                      <p className="text-sm text-slate-600">
                        Build vocabulary with interactive games. Great for beginner and intermediate learners.
                      </p>
                    </div>
                  </div>

                  <ul className="flex flex-wrap gap-2">
                    {germanCourse.gameFeatures?.map((f) => (
                      <li
                        key={f}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${germanCourse.theme.chip}`}
                      >
                        {f}
                      </li>
                    ))}
                  </ul>

                  <motion.a
                    href={germanCourse.gameUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold shadow-md transition-all hover:shadow-lg ${germanCourse.theme.button} ${focusRing}`}
                  >
                    <PlayIcon className="h-4 w-4" aria-hidden="true" />
                    Play now
                  </motion.a>
                </motion.div>
              )}
            </div>
          </section>

          {/* ================= BENEFITS ================= */}
          <section aria-labelledby="benefits-heading" className="bg-slate-50">
            <div className="container grid gap-8 py-12 md:py-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 id="benefits-heading" className="text-3xl font-extrabold tracking-tight text-[#171034] md:text-4xl">
                  Why learn with us
                </h2>
                <p className="mt-2 max-w-md text-lg text-slate-600">
                  Small batches, native-speaking instructors and a clear path to an international certificate.
                </p>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-[#171034]">
                    <BuildingLibraryIcon className="h-4 w-4 text-violet-600" aria-hidden="true" />
                    Exams we prepare you for
                  </h3>
                  <ul className="mt-3 grid grid-cols-2 gap-2">
                    {languageCourses.map((c) => (
                      <li
                        key={c.id}
                        className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-sm font-semibold text-slate-800 ${c.theme.surface}`}
                      >
                        <Flag course={c} className="h-4 w-6" />
                        {c.exam}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className="grid gap-4 sm:grid-cols-2"
              >
                {benefits.map((b, i) => {
                  const t = paletteCycle[i % paletteCycle.length];
                  return (
                    <motion.div
                      key={b.title}
                      variants={fadeInUp()}
                      whileHover={{ y: -3 }}
                      className={`rounded-2xl border p-5 shadow-sm transition-shadow duration-300 hover:shadow-lg ${t.surface} ${t.cardHover}`}
                    >
                      <span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/5 ${t.accent}`}>
                        <b.icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <h3 className="mt-3 text-lg font-bold text-[#171034]">{b.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-700">{b.description}</p>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </section>

          {/* ================= ENROLL ================= */}
          <section id="enroll" aria-labelledby="enroll-heading" className="scroll-mt-20">
            <div className="container py-12 md:py-14">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid overflow-hidden rounded-3xl border border-slate-200 shadow-xl shadow-slate-900/5 lg:grid-cols-[0.85fr_1.15fr]"
              >
                {/* Info panel */}
                <div className="relative overflow-hidden bg-[#1e1b4b] p-7 text-white sm:p-9">
                  <GlobeLines className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 text-white/[0.07]" />
                  <div className="relative">
                    <h2 id="enroll-heading" className="text-3xl font-extrabold leading-tight tracking-tight">
                      Book a free demo class
                    </h2>
                    <p className="mt-3 text-indigo-100/90">
                      Try a live session, meet your instructor and pick the batch that fits your schedule.
                    </p>

                    <ul className="mt-6 space-y-3">
                      {enrollPerks.map((perk) => (
                        <li key={perk} className="flex items-start gap-2.5 text-sm text-indigo-50">
                          <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-violet-300" aria-hidden="true" />
                          {perk}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-7 flex items-center gap-3 border-t border-white/15 pt-5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                        <PhoneIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div>
                        <div className="text-xs text-indigo-200/75">Prefer to talk?</div>
                        <a
                          href="tel:+919399345989"
                          className="font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                          +91 93993 45989
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <div className="bg-white p-7 sm:p-9">
                  <div className="flex items-center gap-2 text-violet-700">
                    <CalendarDaysIcon className="h-5 w-5" aria-hidden="true" />
                    <h3 className="text-lg font-bold text-[#171034]">Your details</h3>
                  </div>

                  <form onSubmit={submit} className="mt-5 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="ov-name" className={fieldLabel}>Full name</label>
                        <input id="ov-name" name="name" value={form.name} onChange={handleChange} className={field} required autoComplete="name" />
                      </div>
                      <div>
                        <label htmlFor="ov-phone" className={fieldLabel}>Phone number</label>
                        <input id="ov-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} className={field} required autoComplete="tel" />
                      </div>
                      <div>
                        <label htmlFor="ov-email" className={fieldLabel}>Email (optional)</label>
                        <input id="ov-email" name="email" type="email" value={form.email} onChange={handleChange} className={field} autoComplete="email" />
                      </div>
                      <div>
                        <label htmlFor="ov-batch" className={fieldLabel}>Preferred batch</label>
                        <select id="ov-batch" name="batch" value={form.batch} onChange={handleChange} className={field}>
                          <option value="">No preference</option>
                          {batchOptions.map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <fieldset>
                      <legend className={fieldLabel}>Language</legend>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {languageCourses.map((c) => {
                          const on = form.language === c.name;
                          return (
                            <label key={c.id} className="relative cursor-pointer">
                              <input
                                type="radio"
                                name="language"
                                value={c.name}
                                checked={on}
                                onChange={handleChange}
                                required
                                className="peer sr-only"
                              />
                              <span
                                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold text-slate-800 transition-all duration-200 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-violet-500 ${c.theme.surface} ${
                                  on ? c.theme.selected : "hover:brightness-95"
                                }`}
                              >
                                <Flag course={c} className="h-4 w-6" />
                                {c.name}
                                {on && <CheckCircleIcon className={`ml-auto h-4 w-4 ${c.theme.accent}`} aria-hidden="true" />}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-bold shadow-lg transition-all duration-300 hover:shadow-xl ${activeTheme.button} ${focusRing}`}
                    >
                      <PhoneIcon className="h-5 w-5" aria-hidden="true" />
                      Book free demo on WhatsApp
                    </motion.button>

                    <p role="status" className="min-h-[1.25rem] text-center text-sm text-slate-600">
                      {sent && "WhatsApp opened in a new tab. Send the message there to confirm your booking."}
                    </p>
                  </form>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </MotionConfig>
    </Layout>
  );
}