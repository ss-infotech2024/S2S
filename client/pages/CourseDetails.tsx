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
  CheckCircleIcon,
  SunIcon,
  MoonIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  CodeBracketIcon,
  BriefcaseIcon,
  BookOpenIcon,
  ClipboardDocumentCheckIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { CheckBadgeIcon as CheckBadgeSolid } from "@heroicons/react/24/solid";

import Layout from "@/components/site/Layout";
import { getCourseById } from "@/data/courses";

// ==================== DESIGN SYSTEM — blue / indigo / purple, subtle pink accent ====================

const COLORS = {
  primary: "from-blue-600 to-purple-600",
  primarySoft: "from-blue-50 to-purple-50",
  card: "bg-white border border-slate-200",
  hoverCard: "hover:border-indigo-200",
};

const SPACING = {
  section: "py-10 sm:py-14 md:py-16",
  card: "p-6 sm:p-8",
};

const TYPOGRAPHY = {
  h1: "text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight",
  h2: "text-xl sm:text-2xl font-bold",
};

const LEVEL_STYLES: Record<string, { dot: string; text: string; bg: string }> = {
  Beginner: { dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
  Intermediate: { dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50" },
  Advanced: { dot: "bg-rose-500", text: "text-rose-700", bg: "bg-rose-50" },
};

// Framer Motion variants
const fadeInUp = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: easeOut },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const itemVariant = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
};

// ==================== SMALL REUSABLE PIECES ====================

interface SectionHeadingProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}

const SectionHeading = ({ icon, title, subtitle }: SectionHeadingProps) => (
  <div className="mb-6 flex items-start gap-3">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-sm">
      {icon}
    </div>
    <div>
      <h2 className={`${TYPOGRAPHY.h2} text-[#171034]`}>{title}</h2>
      {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
    </div>
  </div>
);

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className = "" }: CardProps) => (
  <div
    className={`rounded-[20px] ${COLORS.card} shadow-sm ${COLORS.hoverCard} transition-colors duration-300 ${className}`}
  >
    {children}
  </div>
);

interface PrimaryButtonProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
}

const PrimaryButton = ({ children, href, className = "" }: PrimaryButtonProps) => {
  const Component = href ? Link : "button";
  return (
    <Component
      to={href}
      className={`flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r ${COLORS.primary} px-8 py-4 text-base font-semibold text-white shadow-md shadow-indigo-600/25 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-600/30 active:scale-[0.98] ${className}`}
    >
      {children}
    </Component>
  );
};

interface MetaChipProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const MetaChip = ({ icon, label, value }: MetaChipProps) => (
  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="truncate text-sm font-bold text-[#171034]">{value}</p>
    </div>
  </div>
);

const OutcomeItem = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start gap-3">
    <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
    <span className="text-sm leading-relaxed text-slate-600">{children}</span>
  </div>
);

const SyllabusItem = ({ index, children }: { index: number; children: React.ReactNode }) => (
  <div className="flex items-start gap-3">
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-[10px] font-bold text-purple-700">
      {index + 1}
    </span>
    <span className="text-sm leading-relaxed text-slate-600">{children}</span>
  </div>
);

// ---- Curriculum accordion (functionality unchanged) ----

interface ModuleCardProps {
  module: any;
  index: number;
  isActive: boolean;
  onToggle: (index: number) => void;
}

const ModuleCard = ({ module, index, isActive, onToggle }: ModuleCardProps) => (
  <div
    className={`overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
      isActive ? "border-blue-300 bg-blue-50/40" : "border-slate-200 hover:border-indigo-200"
    }`}
  >
    <button
      onClick={() => onToggle(index)}
      className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-base font-bold transition-colors ${
            isActive
              ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {index + 1}
        </div>
        <div>
          <h4 className="font-semibold text-[#171034]">{module.title}</h4>
          <p className="mt-0.5 text-xs text-slate-400">{module.topics.length} topics</p>
        </div>
      </div>
      <motion.div animate={{ rotate: isActive ? 180 : 0 }} transition={{ duration: 0.3 }} className="shrink-0 text-slate-400">
        <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
      </motion.div>
    </button>

    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="space-y-3 border-t border-slate-100 px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
            {module.topics.map((topic: string, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-start gap-2.5 text-sm text-slate-600"
              >
                <PlayIcon className="mt-0.5 h-4 w-4 shrink-0 text-purple-500" aria-hidden="true" />
                <span>{topic}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// ---- FAQ ----

interface FaqItemProps {
  faq: { question: string; answer: string };
  index: number;
  isExpanded: boolean;
  onToggle: (index: number) => void;
}

const FaqItem = ({ faq, isExpanded, onToggle, index }: FaqItemProps) => (
  <div
    className={`overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
      isExpanded ? "border-blue-300 bg-blue-50/30" : "border-slate-200 hover:border-indigo-200"
    }`}
  >
    <button onClick={() => onToggle(index)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left">
      <span className="text-sm font-semibold leading-snug text-[#171034] sm:text-base">{faq.question}</span>
      <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} className="shrink-0 text-slate-400">
        <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
      </motion.div>
    </button>
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <p className="px-6 pb-6 text-sm leading-relaxed text-slate-500">{faq.answer}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// ---- Choose Your Batch ----

interface BatchOption {
  id: "weekday" | "weekend";
  title: string;
  icon: typeof SunIcon;
  schedule: string;
  time: string;
  description: string;
  theme: string;
}

const batchOptions: BatchOption[] = [
  {
    id: "weekday",
    title: "Weekday Batch",
    icon: SunIcon,
    schedule: "Monday – Friday",
    time: "6:30 PM – 8:30 PM",
    description: "Ideal for working professionals upskilling after hours.",
    theme: "from-blue-500 to-blue-600",
  },
  {
    id: "weekend",
    title: "Weekend Batch",
    icon: MoonIcon,
    schedule: "Saturday & Sunday",
    time: "10:00 AM – 2:00 PM",
    description: "Perfect for students and job seekers with weekday commitments.",
    theme: "from-purple-500 to-purple-600",
  },
];

interface BatchCardProps {
  batch: BatchOption;
  isSelected: boolean;
  onSelect: () => void;
}

const BatchCard = ({ batch, isSelected, onSelect }: BatchCardProps) => {
  const Icon = batch.icon;
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={`relative overflow-hidden rounded-2xl border-2 bg-white p-6 transition-colors duration-300 ${
        isSelected ? "border-blue-400 shadow-lg shadow-indigo-500/10" : "border-slate-200 hover:border-indigo-200"
      }`}
    >
      {isSelected && (
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white">
          <CheckBadgeSolid className="h-3.5 w-3.5" aria-hidden="true" />
          Selected
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${batch.theme} text-white shadow-sm`}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-[#171034]">{batch.title}</h4>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Seats open
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-4 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <CalendarDaysIcon className="h-4 w-4 text-slate-400" aria-hidden="true" />
          {batch.schedule}
        </div>
        <div className="flex items-center gap-2">
          <ClockIcon className="h-4 w-4 text-slate-400" aria-hidden="true" />
          {batch.time}
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-500">{batch.description}</p>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onSelect}
        className={`mt-5 w-full rounded-xl py-2.5 text-sm font-semibold transition-all duration-300 ${
          isSelected
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
            : "border border-slate-300 text-slate-600 hover:border-blue-400 hover:text-blue-700"
        }`}
      >
        {isSelected ? "Batch Selected ✓" : "Select Batch"}
      </motion.button>
    </motion.div>
  );
};

// ==================== MAIN COMPONENT ====================

export default function CourseDetails() {
  const { id } = useParams();
  const course = id ? getCourseById(id) : null;

  const [activeModule, setActiveModule] = useState<number>(-1);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState<BatchOption["id"] | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
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
            <SparklesIcon className="mx-auto mb-6 h-16 w-16 text-indigo-400" aria-hidden="true" />
            <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
              Course Not Found
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base text-slate-500">
              Sorry, we couldn't find that course. Try exploring our full collection instead.
            </p>
            <PrimaryButton href="/courses" className="mx-auto mt-8 max-w-xs">
              Explore All Courses
            </PrimaryButton>
          </motion.div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-[70vh] items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
            className="h-14 w-14 rounded-full border-4 border-indigo-100 border-t-indigo-500"
          />
        </div>
      </Layout>
    );
  }

  const level = LEVEL_STYLES[course.level] ?? { dot: "bg-blue-500", text: "text-blue-700", bg: "bg-blue-50" };
  const selectedBatchDetails = batchOptions.find((b) => b.id === selectedBatch) || null;

  const whyLearnWithUs = [
    { icon: UserGroupIcon, title: "Expert Mentors", desc: "Learn from industry professionals with real-world experience." },
    { icon: CodeBracketIcon, title: "Hands-on Projects", desc: "Apply concepts through practical, portfolio-ready projects." },
    { icon: CheckBadgeIcon, title: "Recognized Certificate", desc: "Earn a certificate that validates your skills to employers." },
    { icon: BriefcaseIcon, title: "Placement Assistance", desc: "Get interview prep and support connecting with hiring partners." },
    { icon: CalendarDaysIcon, title: "Flexible Batches", desc: "Choose weekday or weekend timings that fit your schedule." },
    { icon: BookOpenIcon, title: "Lifetime Access", desc: "Revisit recordings and course material anytime, at no extra cost." },
  ];

  const trainingProcess = [
    { icon: ClipboardDocumentCheckIcon, title: "Enroll & Onboard", desc: "Sign up and get access to your learning dashboard." },
    { icon: VideoCameraIcon, title: "Live Interactive Classes", desc: "Attend expert-led sessions with real-time doubt solving." },
    { icon: CodeBracketIcon, title: "Practice & Build Projects", desc: "Strengthen concepts with hands-on assignments and projects." },
    { icon: ChatBubbleLeftRightIcon, title: "Mentor Support", desc: "Get 1:1 guidance whenever you're stuck." },
    { icon: BriefcaseIcon, title: "Certify & Get Placed", desc: "Earn your certificate and receive placement assistance." },
  ];

  const faqs = [
    {
      question: "Do you provide placement assistance?",
      answer:
        "Yes, we offer comprehensive placement support including interview preparation, resume reviews, mock interviews, and direct connections with our hiring partners.",
    },
    {
      question: "What is the class schedule?",
      answer:
        "We offer flexible batches including weekday evenings and weekend sessions — pick the one that works best for you in the Choose Your Batch section above.",
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
      {/* Subtle background — light lavender, not overdone */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#c7d2fe_0.6px,transparent_1px)] dark:bg-[radial-gradient(#4338ca_0.6px,transparent_1px)] [background-size:44px_44px] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-indigo-950/30 dark:via-background dark:to-background" />
        <div className="absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full bg-blue-200/25 blur-[110px] dark:bg-blue-600/10" />
        <div className="absolute -bottom-32 -left-32 h-[420px] w-[420px] rounded-full bg-pink-200/20 blur-[100px] dark:bg-pink-600/10" />
      </div>

      <section className={`container ${SPACING.section} relative min-h-screen`}>
        {/* Breadcrumb */}
        <motion.div {...fadeInUp} className="mb-6 flex items-center gap-1.5 text-xs text-slate-400">
          <Link to="/courses" className="font-medium hover:text-indigo-600">Courses</Link>
          <span>/</span>
          <span className="truncate text-slate-500">{course.title}</span>
        </motion.div>

        <div className="lg:flex lg:items-start lg:gap-8 xl:gap-10">
          {/* ===================== Main Content ===================== */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="min-w-0 flex-1 space-y-10"
          >
            {/* Hero */}
            <motion.div variants={itemVariant}>
              {/* <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-1.5">
                <SparklesIcon className="h-4 w-4 text-purple-500" aria-hidden="true" />
                <span className="text-xs font-semibold tracking-wide text-indigo-700">PREMIUM LEARNING EXPERIENCE</span>
              </div> */}

              <h1 className={`${TYPOGRAPHY.h1} mt-4 text-[#171034] dark:text-white`}>
                {course.title}
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
                {course.description}
              </p>

              {/* Meta strip */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <MetaChip icon={<ClockIcon className="h-5 w-5" />} label="Duration" value={course.duration} />
                <MetaChip icon={<AcademicCapIcon className="h-5 w-5" />} label="Level" value={course.level} />
                <MetaChip icon={<CheckBadgeIcon className="h-5 w-5" />} label="Certificate" value="Included" />
                <MetaChip icon={<MapPinIcon className="h-5 w-5" />} label="Mode" value="Live Online" />
              </div>

              <div className="mt-6 hidden sm:block">
                <PrimaryButton href={`/enroll/${course.id}`} className="max-w-xs">
                  {/* <SparklesIcon className="h-5 w-5" aria-hidden="true" /> */}
                  Enquire Now
                </PrimaryButton>
              </div>
            </motion.div>

            {/* What You'll Learn + Syllabus */}
            <motion.div variants={itemVariant}>
              <Card className={SPACING.card}>
                <div className="grid gap-10 md:grid-cols-2">
                  <div>
                    <SectionHeading icon={<SparklesIcon className="h-5 w-5" aria-hidden="true" />} title="What You'll Learn" />
                    <div className="space-y-4">
                      {course.outcomes.map((item: string, i: number) => (
                        <OutcomeItem key={i}>{item}</OutcomeItem>
                      ))}
                    </div>
                  </div>
                  <div>
                    <SectionHeading icon={<BookOpenIcon className="h-5 w-5" aria-hidden="true" />} title="Course Syllabus" />
                    <div className="space-y-4">
                      {course.syllabus.map((item: string, i: number) => (
                        <SyllabusItem key={i} index={i}>{item}</SyllabusItem>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Curriculum */}
            {course.modules && course.modules.length > 0 && (
              <motion.div variants={itemVariant}>
                <Card className={SPACING.card}>
                  <SectionHeading
                    icon={<AcademicCapIcon className="h-5 w-5" aria-hidden="true" />}
                    title="Course Curriculum"
                    subtitle="Click a module to see what's covered"
                  />
                  <div className="space-y-4">
                    {course.modules.map((module: any, index: number) => (
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
            )}

            {/* Choose Your Batch */}
            <motion.div id="choose-batch" variants={itemVariant} className="scroll-mt-24">
              <Card className={SPACING.card}>
                <SectionHeading
                  icon={<CalendarDaysIcon className="h-5 w-5" aria-hidden="true" />}
                  title="Choose Your Batch"
                  subtitle="Two schedules, same live, instructor-led experience"
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  {batchOptions.map((batch) => (
                    <BatchCard
                      key={batch.id}
                      batch={batch}
                      isSelected={selectedBatch === batch.id}
                      onSelect={() => setSelectedBatch(batch.id)}
                    />
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Key Projects */}
            {course.projects && course.projects.length > 0 && (
              <motion.div variants={itemVariant}>
                <Card className={SPACING.card}>
                  <SectionHeading icon={<CodeBracketIcon className="h-5 w-5" aria-hidden="true" />} title="Key Projects You'll Build" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    {course.projects.map((project: string, i: number) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4 transition-colors hover:border-indigo-200"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 text-blue-600">
                          <CodeBracketIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <span className="text-sm font-medium leading-snug text-[#171034]">{project}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Why Learn With Us */}
            <motion.div variants={itemVariant}>
              <Card className={SPACING.card}>
                <SectionHeading icon={<CheckBadgeIcon className="h-5 w-5" aria-hidden="true" />} title="Why Learn With Us?" />
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {whyLearnWithUs.map(({ icon: Icon, title, desc }) => (
                    <motion.div
                      key={title}
                      whileHover={{ y: -3 }}
                      className="rounded-2xl border border-slate-200 p-5 transition-colors hover:border-indigo-200"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h4 className="mt-3 text-sm font-bold text-[#171034]">{title}</h4>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500">{desc}</p>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Training Process */}
            <motion.div variants={itemVariant}>
              <Card className={SPACING.card}>
                <SectionHeading icon={<ClipboardDocumentCheckIcon className="h-5 w-5" aria-hidden="true" />} title="Our Training Process" />
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
                  {trainingProcess.map(({ icon: Icon, title, desc }, i) => (
                    <div key={title} className="relative">
                      {i < trainingProcess.length - 1 && (
                        <div className="absolute right-0 top-6 hidden h-px w-full translate-x-1/2 bg-slate-200 lg:block" />
                      )}
                      <div className="relative z-10 flex flex-col items-start gap-3 lg:items-center lg:text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-sm">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-indigo-500">Step {i + 1}</p>
                          <h4 className="mt-0.5 text-sm font-bold text-[#171034]">{title}</h4>
                          <p className="mt-1 text-xs leading-relaxed text-slate-500">{desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Demo Video */}
            {course.demoVideo && (
              <motion.div variants={itemVariant}>
                <Card className={SPACING.card}>
                  <SectionHeading icon={<PlayIcon className="h-5 w-5" aria-hidden="true" />} title="Course Preview" />
                  <div className="overflow-hidden rounded-2xl border border-slate-200">
                    <video controls poster={course.image} className="aspect-video w-full">
                      <source src={course.demoVideo} type="video/mp4" />
                    </video>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* FAQ */}
            <motion.div variants={itemVariant}>
              <Card className={SPACING.card}>
                <SectionHeading icon={<ChatBubbleLeftRightIcon className="h-5 w-5" aria-hidden="true" />} title="Frequently Asked Questions" />
                <div className="space-y-4">
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

            {/* Final CTA */}
            <motion.div variants={itemVariant}>
              <div className="overflow-hidden rounded-[20px] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 text-center sm:p-12">
                <SparklesIcon className="mx-auto h-8 w-8 text-white/90" aria-hidden="true" />
                <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                  Ready to start your {course.title} journey?
                </h3>
                <p className="mx-auto mt-2 max-w-lg text-sm text-white/80 sm:text-base">
                  Talk to our counselors, pick your batch, and take the first step toward your new career.
                </p>
                <Link
                  to={`/enroll/${course.id}`}
                  className="mx-auto mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-sm font-semibold text-indigo-700 shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <SparklesIcon className="h-5 w-5" aria-hidden="true" />
                  Enquire Now
                </Link>
              </div>
            </motion.div>
          </motion.div>

          {/* ===================== Sidebar ===================== */}
          <aside className="mt-10 shrink-0 space-y-6 lg:mt-0 lg:sticky lg:top-24 lg:w-[300px] xl:w-[340px]">
            {/* Enquiry / Course Info Card */}
            <motion.div variants={itemVariant} initial="initial" animate="animate">
              <div className="overflow-hidden rounded-[20px] border border-indigo-100 bg-gradient-to-br from-white to-indigo-50/60 p-6 shadow-lg shadow-indigo-500/10 sm:p-7">
                {course.fees ? (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#171034]">{course.fees}</div>
                    <p className="mt-1 text-xs text-slate-500">One-time investment • Lifetime access</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Course Fees</p>
                    <p className="mt-1 text-lg font-bold text-[#171034]">Get Personalized Pricing</p>
                    <p className="mt-1 text-xs text-slate-500">Talk to our counselor for fees & current offers</p>
                  </div>
                )}

                {/* Selected batch indicator */}
                <AnimatePresence mode="wait">
                  {selectedBatchDetails ? (
                    <motion.div
                      key="selected"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="mt-5 flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3"
                    >
                      <selectedBatchDetails.icon className="h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-500">Selected Batch</p>
                        <p className="truncate text-sm font-bold text-[#171034]">
                          {selectedBatchDetails.title} · {selectedBatchDetails.time}
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.a
                      key="unselected"
                      href="#choose-batch"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="mt-5 block rounded-xl border border-dashed border-slate-300 px-4 py-3 text-center text-xs font-medium text-slate-500 transition-colors hover:border-indigo-300 hover:text-indigo-600"
                    >
                      No batch selected — choose one below ↓
                    </motion.a>
                  )}
                </AnimatePresence>

                <PrimaryButton href={`/enroll/${course.id}`} className="mt-5">
                  {/* <SparklesIcon className="h-5 w-5" aria-hidden="true" /> */}
                  Enquire Now
                </PrimaryButton>

                <div className="mt-6 space-y-3 border-t border-indigo-100 pt-5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Duration</span>
                    <span className="font-semibold text-[#171034]">{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Level</span>
                    <span className={`inline-flex items-center gap-1.5 rounded-full ${level.bg} px-2.5 py-0.5 text-xs font-semibold ${level.text}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${level.dot}`} />
                      {course.level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Certificate</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                      <CheckCircleIcon className="h-4 w-4" aria-hidden="true" />
                      Included
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Expert Instructors */}
            <motion.div variants={itemVariant} initial="initial" animate="animate">
              <Card className="p-6">
                <SectionHeading icon={<UserGroupIcon className="h-5 w-5" aria-hidden="true" />} title="Expert Instructors" />
                <p className="text-sm leading-relaxed text-slate-500">
                  Learn from passionate industry leaders and subject-matter experts with years of real-world experience.
                </p>
              </Card>
            </motion.div>
          </aside>
        </div>

        {/* Mobile Floating Button */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 left-4 right-4 z-50 sm:hidden"
        >
          <PrimaryButton href={`/enroll/${course.id}`}>
            {/* <SparklesIcon className="h-5 w-5" aria-hidden="true" /> */}
            Enquire Now
          </PrimaryButton>
        </motion.div>
      </section>
    </Layout>
  );
}