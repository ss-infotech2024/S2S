// components/site/AboutSection.tsx
import { motion } from "framer-motion";
import {
  BriefcaseIcon,
  AcademicCapIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

interface AboutCard {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  content: string;
  iconBg: string; // tailwind bg class for the icon badge
  iconColor: string; // tailwind text class for the icon
}

interface AboutSectionProps {
  badgeText?: string;
  titleMain?: string;
  titleAccent?: string;
  mainDescription?: {
    heading: string;
    content: string;
  };
  cards?: AboutCard[];
  floatingBadge?: string;
}

const defaultCards: AboutCard[] = [
  {
    icon: AcademicCapIcon,
    title: "Education",
    content:
      "Key to personal and professional growth. We empower individuals to excel academically and professionally through industry-aligned, hands-on training.",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: LightBulbIcon,
    title: "Belief",
    content:
      "We nurture talent and foster careers. We connect top-tier talent with leading organizations, facilitating mutually beneficial partnerships.",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    icon: RocketLaunchIcon,
    title: "Solutions",
    content:
      "We offer innovative, tech-driven solutions tailored to industry needs — from skill development to career transformation.",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
  },
];

export default function AboutSection({
  badgeText = "Industry-Focused Learning",
  titleMain = "Innovating Education with",
  titleAccent = "Purpose",
  mainDescription = {
    heading:
      "Where innovation meets excellence in the realm of IT solutions and education.",
    content:
      "Skill Training Center is a premier software organization with a strong presence in Pune and Nagpur. We specialize in cutting-edge IT solutions, digital marketing, and transformative education programs.",
  },
  cards = defaultCards,
  floatingBadge = "Live Classroom",
}: AboutSectionProps) {
  return (
    <section id="about" className="container py-20 bg-white">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left Column — Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="min-w-0"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-5"
          >
            <BriefcaseIcon className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{badgeText}</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-gray-900">
            {titleMain}
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {titleAccent}
            </span>
          </h2>

          <div className="mt-6 space-y-3">
            <p className="text-lg font-semibold text-gray-900">
              {mainDescription.heading}
            </p>
            <p className="text-[0.95rem] leading-relaxed text-gray-600">
              {mainDescription.content}
            </p>
          </div>

          {/* Compact cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {cards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 + index * 0.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="group rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-gray-900/5"
              >
                <div
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor} transition-transform duration-300 group-hover:scale-110`}
                >
                  <card.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-base font-bold text-gray-900">{card.title}</h3>
                <p className="mt-1.5 text-[0.83rem] leading-relaxed text-gray-600">
                  {card.content}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Column — Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          {/* Soft glow behind the frame */}
          <div
            aria-hidden="true"
            className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/15 via-secondary/10 to-teal-400/15 blur-2xl"
          />

          <div className="relative aspect-[4/3.1] overflow-hidden rounded-[1.75rem] border border-gray-100 shadow-xl shadow-gray-900/10">
            <EducationIllustration />
          </div>

          {/* Floating badge */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-primary/25 sm:right-6"
          >
            <AcademicCapIcon className="h-3.5 w-3.5" />
            {floatingBadge}
          </motion.div>

          {/* Floating stat chip */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            className="absolute -bottom-4 left-4 inline-flex items-center gap-2 rounded-2xl border border-gray-100 bg-white px-4 py-2.5 shadow-lg shadow-gray-900/10 sm:left-6"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-teal-600">
              <ChartBarIcon className="h-4 w-4" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-extrabold text-gray-900">Industry-Aligned</div>
              <div className="text-[0.65rem] font-medium text-gray-500">Curriculum</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/** Lightweight, theme-colored education illustration — no external image assets. */
function EducationIllustration() {
  return (
    <svg
      viewBox="0 0 560 435"
      className="h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Illustration of an interactive online learning dashboard"
    >
      <defs>
        <linearGradient id="aiBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#eef2ff" />
          <stop offset="55%" stopColor="#e0e7ff" />
          <stop offset="100%" stopColor="#ccfbf1" />
        </linearGradient>
        <linearGradient id="aiScreen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0052BB" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient id="aiBar1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#0052BB" />
        </linearGradient>
        <linearGradient id="aiBar2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="aiBar3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="560" height="435" fill="url(#aiBg)" />

      {/* Decorative dot grid */}
      <g opacity="0.35">
        {Array.from({ length: 6 }).map((_, r) =>
          Array.from({ length: 6 }).map((_, c) => (
            <circle key={`${r}-${c}`} cx={40 + c * 16} cy={40 + r * 16} r="1.6" fill="#4338ca" />
          )),
        )}
      </g>

      {/* Soft decorative blobs */}
      <circle cx="500" cy="60" r="70" fill="#5eead4" opacity="0.25" />
      <circle cx="60" cy="380" r="90" fill="#a78bfa" opacity="0.2" />

      {/* Floating network/connection nodes (top-right accent) */}
      <g stroke="#0052BB" strokeWidth="1.4" opacity="0.5">
        <line x1="430" y1="70" x2="470" y2="45" />
        <line x1="470" y1="45" x2="505" y2="70" />
        <line x1="430" y1="70" x2="470" y2="95" />
        <line x1="470" y1="95" x2="505" y2="70" />
      </g>
      <circle cx="430" cy="70" r="6" fill="#0052BB" />
      <circle cx="470" cy="45" r="6" fill="#7c3aed" />
      <circle cx="505" cy="70" r="6" fill="#0d9488" />
      <circle cx="470" cy="95" r="6" fill="#0052BB" />

      {/* Central dashboard card (laptop / analytics mockup) */}
      <g>
        <rect x="95" y="120" width="370" height="230" rx="18" fill="white" opacity="0.92" />
        <rect x="95" y="120" width="370" height="230" rx="18" fill="none" stroke="#e5e7eb" strokeWidth="1.5" />

        {/* Top bar */}
        <rect x="95" y="120" width="370" height="34" rx="18" fill="url(#aiScreen)" />
        <rect x="95" y="138" width="370" height="16" fill="url(#aiScreen)" />
        <circle cx="117" cy="137" r="5" fill="#fca5a5" />
        <circle cx="135" cy="137" r="5" fill="#fde68a" />
        <circle cx="153" cy="137" r="5" fill="#86efac" />
        <text x="280" y="141" textAnchor="middle" fontSize="11" fontWeight="700" fill="white" fontFamily="Inter, sans-serif">
          Learning Dashboard
        </text>

        {/* Bars chart */}
        <rect x="128" y="245" width="26" height="80" rx="6" fill="url(#aiBar1)" />
        <rect x="166" y="215" width="26" height="110" rx="6" fill="url(#aiBar2)" />
        <rect x="204" y="260" width="26" height="65" rx="6" fill="url(#aiBar3)" />
        <rect x="242" y="195" width="26" height="130" rx="6" fill="url(#aiBar1)" />
        <line x1="118" y1="325" x2="278" y2="325" stroke="#e5e7eb" strokeWidth="1.5" />

        {/* Progress ring */}
        <circle cx="380" cy="230" r="42" fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="380"
          cy="230"
          r="42"
          fill="none"
          stroke="url(#aiScreen)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray="205 264"
          transform="rotate(-90 380 230)"
        />
        <text x="380" y="226" textAnchor="middle" fontSize="18" fontWeight="800" fill="#111827" fontFamily="Inter, sans-serif">
          78%
        </text>
        <text x="380" y="242" textAnchor="middle" fontSize="9" fontWeight="600" fill="#6b7280" fontFamily="Inter, sans-serif">
          Progress
        </text>

        {/* Mini rows */}
        <rect x="118" y="185" width="66" height="10" rx="5" fill="#e0e7ff" />
        <rect x="330" y="290" width="100" height="8" rx="4" fill="#e5e7eb" />
        <rect x="330" y="304" width="72" height="8" rx="4" fill="#e5e7eb" />
      </g>

      {/* Icon badge overlapping bottom-left of the card */}
      <g>
        <rect x="70" y="300" width="86" height="86" rx="20" fill="url(#aiScreen)" opacity="0.97" />
        <rect x="98" y="328" width="30" height="30" rx="6" fill="none" stroke="white" strokeWidth="2.2" />
        <rect x="106" y="336" width="14" height="14" rx="2" fill="white" />
        <line x1="113" y1="322" x2="113" y2="328" stroke="white" strokeWidth="2" />
        <line x1="113" y1="358" x2="113" y2="364" stroke="white" strokeWidth="2" />
        <line x1="92" y1="343" x2="98" y2="343" stroke="white" strokeWidth="2" />
        <line x1="128" y1="343" x2="134" y2="343" stroke="white" strokeWidth="2" />
      </g>

      {/* Graduation cap badge, bottom-right */}
      <g>
        <circle cx="470" cy="345" r="34" fill="white" />
        <circle cx="470" cy="345" r="34" fill="none" stroke="#e5e7eb" strokeWidth="1.5" />
        <path
          d="M470 330 L494 340 L470 350 L446 340 Z"
          fill="#0d9488"
        />
        <path
          d="M458 344 v10 c0 4 5 8 12 8 s12 -4 12 -8 v-10"
          fill="none"
          stroke="#0d9488"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
