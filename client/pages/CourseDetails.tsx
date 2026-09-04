import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import {
  ChevronDownIcon,
  PlayIcon,
  ClockIcon,
  AcademicCapIcon,
  CheckBadgeIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

import Layout from "@/components/site/Layout";
import { getCourseById } from "@/data/courses";

// ==================== NEW LAVENDER + PINK DESIGN SYSTEM ====================

const COLORS = {
  primary: "from-violet-400 to-pink-400",
  primaryLight: "from-violet-500/10 to-pink-500/10",
  accent: "pink-400",
  card: "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-violet-200/60 dark:border-violet-800/60",
  hoverCard: "hover:border-pink-300 dark:hover:border-pink-700",
};

const SPACING = {
  section: "py-10 sm:py-16 md:py-20",
  card: "p-6 sm:p-8 md:p-10",
  inner: "p-4 sm:p-5",
} as const;

const TYPOGRAPHY = {
  h1: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter",
  h2: "text-2xl sm:text-3xl font-semibold",
  h3: "text-xl sm:text-2xl font-semibold",
  body: "text-base sm:text-lg",
  small: "text-sm",
} as const;

// Framer Motion Variants
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: easeOut },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.12 } },
};

const itemVariant = {
  initial: { opacity: 0, y: 25 },
  animate: { opacity: 1, y: 0 },
};

// ==================== REUSABLE COMPONENTS ====================

interface HeadingProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const Heading = ({ children, icon }: HeadingProps) => (
  <div className="flex items-center gap-3 mb-6">
    {icon && <div className="text-violet-400">{icon}</div>}
    <h3 className={TYPOGRAPHY.h2}>{children}</h3>
  </div>
);

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className = "" }: CardProps) => (
  <div
    className={`
      rounded-3xl ${COLORS.card} shadow-xl shadow-violet-500/5 
      ${COLORS.hoverCard} transition-all duration-300 ${className}
    `}
  >
    {children}
  </div>
);

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
}

const Button = ({ children, href, className = "" }: ButtonProps) => {
  const Component = href ? Link : "button";
  return (
    <Component
      to={href}
      className={`
        w-full flex items-center justify-center gap-3 
        bg-gradient-to-r ${COLORS.primary} text-white 
        font-semibold text-lg py-4 px-8 rounded-2xl 
        shadow-lg shadow-pink-500/30 hover:shadow-xl 
        hover:scale-[1.02] active:scale-[0.98] 
        transition-all duration-300 ${className}
      `}
    >
      {children}
    </Component>
  );
};

interface InfoPillProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoPill = ({ icon, label, value }: InfoPillProps) => (
  <motion.div
    whileHover={{ scale: 1.03, y: -3 }}
    className="flex items-center gap-4 bg-white/70 dark:bg-zinc-800/70 p-5 rounded-2xl border border-violet-100 dark:border-violet-800"
  >
    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-100 to-pink-100 dark:from-violet-900/50 dark:to-pink-900/50 flex items-center justify-center text-2xl">
      {icon}
    </div>
    <div>
      <p className="text-xs uppercase tracking-widest text-violet-500 dark:text-violet-400 font-medium">{label}</p>
      <p className="text-xl font-semibold mt-0.5">{value}</p>
    </div>
  </motion.div>
);

interface ListItemProps {
  children: React.ReactNode;
}

const ListItem = ({ children }: ListItemProps) => (
  <div className="flex items-start gap-4 group">
    <div className="mt-1.5 w-2 h-2 rounded-full bg-gradient-to-r from-pink-400 to-violet-400 flex-shrink-0 group-hover:scale-125 transition-transform" />
    <span className="text-foreground/80 leading-relaxed">{children}</span>
  </div>
);

// Module Card & FaqItem (unchanged for consistency)
interface ModuleCardProps {
  module: any;
  index: number;
  isActive: boolean;
  onToggle: (index: number) => void;
}

const ModuleCard = ({ module, index, isActive, onToggle }: ModuleCardProps) => (
  <div
    className={`rounded-3xl border-2 transition-all duration-300 overflow-hidden ${
      isActive
        ? "border-violet-400 bg-gradient-to-br from-violet-50 to-pink-50 dark:from-violet-950/30 dark:to-pink-950/30"
        : "border-violet-200/70 dark:border-violet-800/70 hover:border-pink-300"
    }`}
  >
    <button
      onClick={() => onToggle(index)}
      className="w-full p-7 text-left flex items-center justify-between group"
    >
      <div className="flex items-center gap-5">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold transition-all ${
            isActive
              ? "bg-gradient-to-br from-violet-400 to-pink-400 text-white"
              : "bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-300"
          }`}
        >
          {index + 1}
        </div>
        <div>
          <h4 className="font-semibold text-xl group-hover:text-pink-500 transition-colors">
            {module.title}
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            {module.topics.length} engaging topics
          </p>
        </div>
      </div>

      <motion.div
        animate={{ rotate: isActive ? 180 : 0 }}
        transition={{ duration: 0.4 }}
        className="text-violet-400"
      >
        <ChevronDownIcon className="w-6 h-6" />
      </motion.div>
    </button>

    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="px-7 pb-7"
        >
          <div className="pl-2 border-l-2 border-dashed border-pink-300 space-y-4">
            {module.topics.map((topic: string, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 text-foreground/80"
              >
                <PlayIcon className="w-5 h-5 mt-0.5 text-pink-400 flex-shrink-0" />
                <span>{topic}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

interface FaqItemProps {
  faq: { question: string; answer: string };
  index: number;
  isExpanded: boolean;
  onToggle: (index: number) => void;
}

const FaqItem = ({ faq, index, isExpanded, onToggle }: FaqItemProps) => (
  <div
    className={`rounded-3xl border-2 transition-all duration-300 overflow-hidden ${
      isExpanded
        ? "border-pink-400 bg-gradient-to-br from-pink-50/80 to-violet-50/80 dark:from-pink-950/30 dark:to-violet-950/30"
        : "border-violet-200/60 dark:border-violet-800/60 hover:border-pink-300"
    }`}
  >
    <button
      onClick={() => onToggle(index)}
      className="w-full px-7 py-6 text-left flex items-center justify-between"
    >
      <span className="font-medium text-lg pr-8 leading-tight">{faq.question}</span>
      <motion.div
        animate={{ rotate: isExpanded ? 180 : 0 }}
        className="text-pink-400"
      >
        <ChevronDownIcon className="w-6 h-6" />
      </motion.div>
    </button>

    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4 }}
          className="px-7 pb-7 text-foreground/70"
        >
          {faq.answer}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// ==================== MAIN COMPONENT ====================

export default function CourseDetails() {
  const { id } = useParams();
  const course = id ? getCourseById(id) : null;

  const [activeModule, setActiveModule] = useState<number>(-1);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 450);
    return () => clearTimeout(timer);
  }, []);

  const toggleModule = (index: number) => {
    setActiveModule(activeModule === index ? -1 : index);
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  if (!course) {
    return (
      <Layout>
        <div className="container py-24 text-center">
          <motion.div {...fadeInUp}>
            <SparklesIcon className="w-20 h-20 mx-auto text-pink-400 mb-6" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              Course Not Found
            </h1>
            <p className="mt-6 text-xl text-foreground/70 max-w-md mx-auto">
              Sorry, we couldn't find that course. Try exploring our beautiful collection.
            </p>
            <Button href="/courses" className="mt-10 max-w-xs mx-auto">
              Explore All Courses
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
            className="w-20 h-20 border-4 border-violet-200 border-t-violet-400 rounded-full"
          />
        </div>
      </Layout>
    );
  }

  const faqs = [
    {
      question: "Do you provide placement assistance?",
      answer: "Yes, we offer comprehensive placement support including interview preparation, resume reviews, mock interviews, and direct connections with our hiring partners.",
    },
    {
      question: "What is the class schedule?",
      answer: "We offer flexible batches including weekday evenings and weekend sessions. You can choose the schedule that works best for you.",
    },
    {
      question: "Is there any prerequisite knowledge required?",
      answer: course.prerequisites?.length
        ? `Basic knowledge of ${course.prerequisites.join(", ")} is recommended.`
        : "No prior experience required! This course is designed for beginners.",
    },
  ];

  return (
    <Layout>
      {/* Elegant New Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Soft subtle texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#c4b5fd_0.6px,transparent_1px)] dark:bg-[radial-gradient(#8b7cf0_0.6px,transparent_1px)] [background-size:60px_60px] opacity-20" />

        {/* Gentle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-100/50 via-transparent to-pink-100/40 dark:from-violet-950/40 dark:via-transparent dark:to-pink-950/30" />

        {/* Very soft decorative glows */}
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] bg-violet-300/25 dark:bg-violet-600/10 rounded-full blur-[130px]" />
        <div className="absolute -bottom-40 -left-40 w-[650px] h-[650px] bg-pink-300/25 dark:bg-pink-600/10 rounded-full blur-[120px]" />
      </div>

      <section className={`container ${SPACING.section} relative min-h-screen bg-[#f5f2ff] dark:bg-[#0f0a1f]`}>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid gap-10 lg:gap-14 md:grid-cols-12"
        >
          {/* Main Content */}
          <div className="md:col-span-8 space-y-12">
            {/* Hero */}
            <motion.div variants={itemVariant}>
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-3xl bg-gradient-to-r from-violet-100 to-pink-100 dark:from-violet-900/50 dark:to-pink-900/50 border border-violet-200 dark:border-violet-700 mb-6">
                <SparklesIcon className="w-5 h-5 text-pink-500" />
                <span className="font-medium text-violet-600 dark:text-violet-300">Premium AI Learning Experience</span>
              </div>

              <h1 className={`${TYPOGRAPHY.h1} leading-none bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 bg-clip-text text-transparent`}>
                {course.title}
              </h1>

              <p className="mt-8 text-xl text-foreground/80 max-w-3xl leading-relaxed">
                {course.description}
              </p>
            </motion.div>

            {/* Info Pills */}
            <motion.div variants={itemVariant}>
              <Card className={SPACING.card}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <InfoPill icon="⏱️" label="Duration" value={course.duration} />
                  <InfoPill icon="📚" label="Level" value={course.level || "All Levels"} />
                  <InfoPill icon="🏆" label="Certificate" value="Included" />
                </div>

                {/* Outcomes & Syllabus */}
                <div className="grid md:grid-cols-2 gap-12 mt-12 pt-12 border-t border-violet-100 dark:border-violet-800">
                  <div>
                    <Heading icon="✨">What You'll Learn</Heading>
                    <div className="space-y-5">
                      {course.outcomes.map((item: string, i: number) => (
                        <ListItem key={i}>{item}</ListItem>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Heading icon="📋">Course Syllabus</Heading>
                    <div className="space-y-5">
                      {course.syllabus.map((item: string, i: number) => (
                        <ListItem key={i}>{item}</ListItem>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Curriculum */}
            <motion.div variants={itemVariant}>
              <Card className={SPACING.card}>
                <Heading icon="🎓">Course Curriculum</Heading>
                <div className="space-y-5">
                  {course.modules?.map((module: any, index: number) => (
                    <ModuleCard
                      key={index}
                      module={module}
                      index={index}
                      isActive={activeModule === index}
                      onToggle={toggleModule}
                    />
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Demo Video */}
            {course.demoVideo && (
              <motion.div variants={itemVariant}>
                <Card className={SPACING.card}>
                  <Heading icon={<PlayIcon className="w-7 h-7 text-pink-400" />}>
                    Course Preview
                  </Heading>
                  <div className="rounded-3xl overflow-hidden border border-violet-100 dark:border-violet-800 shadow-inner">
                    <video controls poster={course.image} className="w-full aspect-video">
                      <source src={course.demoVideo} type="video/mp4" />
                    </video>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* FAQ */}
            <motion.div variants={itemVariant}>
              <Card className={SPACING.card}>
                <h2 className={TYPOGRAPHY.h2 + " mb-8"}>Frequently Asked Questions</h2>
                <div className="space-y-5">
                  {faqs.map((faq, index) => (
                    <FaqItem
                      key={index}
                      faq={faq}
                      index={index}
                      isExpanded={expandedFaq === index}
                      onToggle={toggleFaq}
                    />
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-4 space-y-8 lg:sticky lg:top-10 self-start">
            {/* Enrollment Card */}
            <motion.div variants={itemVariant}>
              <div className="rounded-3xl bg-gradient-to-br from-violet-50 to-pink-50 dark:from-violet-950 dark:to-pink-950 p-9 border border-violet-200 dark:border-violet-800 shadow-2xl shadow-pink-500/10">
                <div className="text-center">
                  <div className="text-5xl font-bold text-violet-600 dark:text-violet-300 tracking-tighter">
                    {course.fees}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">One-time investment • Lifetime access</p>
                </div>

                <Button href={`/enroll/${course.id}`} className="mt-10 text-xl">
                  <SparklesIcon className="w-6 h-6" />
                  Enquire Now
                </Button>

                <div className="mt-10 pt-8 border-t border-violet-200 dark:border-violet-800 space-y-5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{course.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Level</span>
                    <span className="font-medium">{course.level || "All Levels"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Certificate</span>
                    <span className="font-medium text-emerald-500">✓ Included</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Batch & Instructors */}
            <motion.div variants={itemVariant}>
              <Card className="p-8">
                <Heading icon="🗓️">Upcoming Batches</Heading>
                <p className="text-foreground/70 leading-relaxed">
                  {course.schedule || "Next batch starts soon. Contact us for personalized batch information."}
                </p>
              </Card>
            </motion.div>

            <motion.div variants={itemVariant}>
              <Card className="p-8">
                <Heading icon="👩‍🏫">Expert Instructors</Heading>
                <p className="text-foreground/70 leading-relaxed">
                  Learn from passionate industry leaders and AI researchers with years of real-world experience.
                </p>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Mobile Floating Button */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 left-4 right-4 md:hidden z-50"
        >
          <Button href={`/enroll/${course.id}`}>
            <SparklesIcon className="w-6 h-6" />
            Enquire Now
          </Button>
        </motion.div>
      </section>
    </Layout>
  );
}