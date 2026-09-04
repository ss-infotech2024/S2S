// pages/Overseas.tsx
import { useState } from "react";
import Layout from "@/components/site/Layout";
import { motion } from "framer-motion";
import { fadeInUp, stagger } from "@/lib/animations";
import {
  GlobeAltIcon,
  AcademicCapIcon,
  UserGroupIcon,
  PlayIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
  PresentationChartLineIcon,
  PuzzlePieceIcon,
} from "@heroicons/react/24/outline";

// Import flag images
import germanFlag from "/flags/germ.png";
import japaneseFlag from "/flags/japan.png";
import frenchFlag from "/flags/fran.png";
import spanishFlag from "/flags/spain.png";

// Language courses data
const languageCourses = [
  {
    id: "german",
    name: "German",
    flag: germanFlag,
    flagEmoji: "🇩🇪",
    level: "A1 to C2",
    duration: "12 weeks",
    batchSize: "10-15 students",
    description: "Master German language from basics to advanced level with native speakers and interactive sessions.",
    features: [
      "Goethe Institute Curriculum",
      "Exam Preparation (A1-C2)",
      "Conversation Practice",
      "Cultural Immersion"
    ],
    color: "from-red-500 to-orange-500",
    bgColor: "from-red-500/10 to-orange-500/10",
    gameAvailable: true,
    gameUrl: "https://learn-gern-play.vercel.app/",
    gameFeatures: ["Flip Cards", "Quiz", "Memory Game"]
  },
  {
    id: "japanese",
    name: "Japanese",
    flag: japaneseFlag,
    flagEmoji: "🇯🇵",
    level: "N5 to N1",
    duration: "14 weeks",
    batchSize: "8-12 students",
    description: "Learn Japanese language with focus on JLPT preparation, kanji mastery, and business communication.",
    features: [
      "JLPT Preparation (N5-N1)",
      "Kanji Mastery Program",
      "Business Japanese",
      "Cultural Workshops"
    ],
    color: "from-pink-500 to-purple-500",
    bgColor: "from-pink-500/10 to-purple-500/10",
    gameAvailable: false
  },
  {
    id: "french",
    name: "French",
    flag: frenchFlag,
    flagEmoji: "🇫🇷",
    level: "A1 to C2",
    duration: "12 weeks",
    batchSize: "10-15 students",
    description: "Parlez-vous français? Master the language of love, diplomacy, and culture with our comprehensive French program.",
    features: [
      "DELF/DALF Preparation",
      "Pronunciation Excellence",
      "French Literature",
      "Cultural Immersion"
    ],
    color: "from-blue-500 to-indigo-500",
    bgColor: "from-blue-500/10 to-indigo-500/10",
    gameAvailable: false
  },
  {
    id: "spanish",
    name: "Spanish",
    flag: spanishFlag,
    flagEmoji: "🇪🇸",
    level: "A1 to C2",
    duration: "12 weeks",
    batchSize: "12-18 students",
    description: "Learn Spanish, the second most spoken language in the world, with our immersive and practical approach.",
    features: [
      "DELE Preparation",
      "Conversation Mastery",
      "Business Spanish",
      "Hispanic Culture"
    ],
    color: "from-yellow-500 to-amber-500",
    bgColor: "from-yellow-500/10 to-amber-500/10",
    gameAvailable: false
  }
];

// Benefits of learning with us
const benefits = [
  {
    icon: UserGroupIcon,
    title: "Native Speakers",
    description: "Learn from experienced native language instructors"
  },
  {
    icon: ClockIcon,
    title: "Flexible Batches",
    description: "Weekday and weekend batches to suit your schedule"
  },
  {
    icon: CheckBadgeIcon,
    title: "Certification",
    description: "Globally recognized certificates upon completion"
  },
  {
    icon: PresentationChartLineIcon,
    title: "Career Support",
    description: "Job assistance and placement support"
  }
];

// Game Card Component
const GameCard = ({ gameUrl, features }: { gameUrl: string; features: string[] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-purple-600/10 to-pink-500/10 border border-primary/20 p-6 backdrop-blur-sm"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-full blur-2xl" />
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-r from-primary to-purple-600">
            <PuzzlePieceIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Learn & Play German</h3>
            <p className="text-sm text-muted-foreground">Interactive Vocabulary Games</p>
          </div>
        </div>
        
        <p className="text-foreground/70 mb-4">
          Master German vocabulary through fun and engaging games. Perfect for beginners and intermediate learners.
        </p>
        
        {/* Game Features */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {features.map((feature) => (
            <div
              key={feature}
              className="text-center p-3 rounded-lg bg-white/10 backdrop-blur-sm"
            >
              <span className="text-sm font-medium text-foreground">{feature}</span>
            </div>
          ))}
        </div>
        
        {/* Play Button */}
        <motion.a
          href={gameUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
        >
          <PlayIcon className="w-5 h-5" />
          <span>Play Now</span>
          <ArrowRightIcon className="w-4 h-4" />
        </motion.a>
      </div>
    </motion.div>
  );
};

// Language Card Component
const LanguageCard = ({ course, index }: { course: any; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      variants={fadeInUp(index * 0.1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="group relative h-full"
    >
      <div className={`h-full relative rounded-2xl bg-gradient-to-br from-background to-muted/20 p-6 border border-border/50 overflow-hidden backdrop-blur-sm transition-all duration-500 hover:shadow-xl ${course.bgColor}`}>
        {/* Animated Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
        
        <div className="relative z-10 h-full flex flex-col">
          {/* Header with Flag Image */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden shadow-md">
                <img 
                  src={course.flag} 
                  alt={`${course.name} Flag`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{course.name}</h3>
                <p className="text-sm text-muted-foreground">{course.level}</p>
              </div>
            </div>
            <div className="text-3xl">{course.flagEmoji}</div>
          </div>
          
          {/* Description */}
          <p className="text-foreground/70 text-sm mb-4 line-clamp-3">
            {course.description}
          </p>
          
          {/* Course Info */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground/70">{course.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <UserGroupIcon className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground/70">{course.batchSize}</span>
            </div>
          </div>
          
          {/* Features */}
          <div className="space-y-2 mb-4 flex-grow">
            {course.features.slice(0, isExpanded ? undefined : 3).map((feature: string) => (
              <div key={feature} className="flex items-center gap-2">
                <CheckBadgeIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-sm text-foreground/70">{feature}</span>
              </div>
            ))}
          </div>
          
          {/* Expand Button */}
          {course.features.length > 3 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)} 
              className="text-sm text-primary hover:text-primary/80 transition-colors mb-4 text-left"
            >
              {isExpanded ? "Show Less" : `+${course.features.length - 3} More Features`}
            </button>
          )}
          
          {/* Game Available Badge */}
          {course.gameAvailable && (
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
                <SparklesIcon className="w-4 h-4 text-green-500" />
                <span className="text-xs font-medium text-green-600">Interactive Games Available</span>
              </div>
            </div>
          )}
          
          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full px-4 py-2.5 rounded-xl bg-gradient-to-r ${course.color} text-white font-semibold hover:shadow-lg transition-all duration-300 mt-auto`}
          >
            Enroll Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default function Overseas() {
  const germanCourse = languageCourses.find(c => c.id === "german");

  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/5 via-purple-600/5 to-pink-500/5 py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mx-auto max-w-4xl text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
              >
                <GlobeAltIcon className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Overseas Education</span>
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent mb-6">
                Master Foreign Languages with
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"> Expert Guidance</span>
              </h1>
              
              <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
                Learn German, Japanese, French, Spanish and more from native speakers. 
                Prepare for international certifications and unlock global opportunities.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Interactive Game Section */}
        {germanCourse && (
          <section className="py-16 bg-gradient-to-b from-white to-primary/5">
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 mb-6">
                  <SparklesIcon className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-semibold text-green-600">Featured Game</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Learn German Through Play
                </h2>
                <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                  Make vocabulary learning fun with our interactive games. Perfect for beginners!
                </p>
              </motion.div>

              <div className="max-w-4xl mx-auto">
                <GameCard 
                  gameUrl={germanCourse.gameUrl!} 
                  features={germanCourse.gameFeatures!} 
                />
              </div>
            </div>
          </section>
        )}

        {/* Language Courses Section */}
        <section className="py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Choose Your Language
              </h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                Comprehensive language programs designed to help you achieve fluency and certification
              </p>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            >
              {languageCourses.map((course, index) => (
                <LanguageCard key={course.id} course={course} index={index} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Learn With Us?
              </h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                Experience world-class language education with unique advantages
              </p>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            >
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <motion.div
                    key={benefit.title}
                    variants={fadeInUp(index * 0.1)}
                    className="text-center p-6 rounded-2xl bg-white border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white mb-4">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-sm text-foreground/70">{benefit.description}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-purple-600 p-12 text-center"
            >
              <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Start Your Language Journey?
                </h2>
                <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                  Join thousands of students who have successfully learned a new language with us
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-primary font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Book Free Demo Class
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
}