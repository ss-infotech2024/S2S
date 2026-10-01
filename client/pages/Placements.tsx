// pages/Placements.tsx
import { useEffect, useMemo, useState } from "react";
import Layout from "@/components/site/Layout";
import { MotionConfig, motion } from "framer-motion";
import { fadeInUp, stagger } from "@/lib/animations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AcademicCapIcon,
  ArrowPathIcon,
  ArrowRightIcon,
  ArrowTrendingUpIcon,
  BoltIcon,
  BookmarkIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PhoneIcon,
  TrophyIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolidIcon, StarIcon } from "@heroicons/react/24/solid";

// ---------------------------------------------------------------------------
// Theme — one soft pastel palette per card. Every place a palette is used
// (stat tile, job card, testimonial, filter chip) reads from these objects, so
// colors stay consistent. Class names are written out in full so Tailwind keeps them.
// ---------------------------------------------------------------------------

const palettes = {
  blue: {
    surface: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200",
    cardHover: "hover:border-blue-300 hover:shadow-blue-900/10",
    chip: "bg-blue-100 text-blue-700",
    accent: "text-blue-600",
    button:
      "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700",
  },
  amber: {
    surface: "bg-gradient-to-br from-yellow-50 to-amber-50 border-amber-200",
    cardHover: "hover:border-amber-300 hover:shadow-amber-900/10",
    chip: "bg-amber-100 text-amber-800",
    accent: "text-amber-600",
    // dark text keeps the yellow button readable
    button:
      "bg-gradient-to-r from-yellow-400 to-amber-400 text-amber-950 shadow-amber-500/25 hover:from-yellow-500 hover:to-amber-500",
  },
  emerald: {
    surface: "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200",
    cardHover: "hover:border-emerald-300 hover:shadow-emerald-900/10",
    chip: "bg-emerald-100 text-emerald-700",
    accent: "text-emerald-600",
    button:
      "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/25 hover:from-emerald-700 hover:to-teal-700",
  },
  pink: {
    surface: "bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200",
    cardHover: "hover:border-pink-300 hover:shadow-pink-900/10",
    chip: "bg-pink-100 text-pink-700",
    accent: "text-pink-600",
    button:
      "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-pink-500/25 hover:from-pink-700 hover:to-purple-700",
  },
  violet: {
    surface: "bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200",
    cardHover: "hover:border-violet-300 hover:shadow-violet-900/10",
    chip: "bg-violet-100 text-violet-700",
    accent: "text-violet-600",
    button:
      "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-violet-500/25 hover:from-violet-700 hover:to-purple-700",
  },
  red: {
    surface: "bg-gradient-to-br from-red-50 to-orange-50 border-red-200",
    cardHover: "hover:border-red-300 hover:shadow-red-900/10",
    chip: "bg-red-100 text-red-700",
    accent: "text-red-600",
    button:
      "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-red-500/25 hover:from-red-700 hover:to-orange-700",
  },
};

type Theme = (typeof palettes)["blue"];

const paletteCycle: Theme[] = [
  palettes.blue,
  palettes.amber,
  palettes.emerald,
  palettes.pink,
  palettes.violet,
  palettes.red,
];

/** Neutral primary button, used for "All" filter chip and generic CTAs. */
const primaryButton =
  "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-violet-500/25 hover:from-blue-700 hover:to-violet-700";

// ---------------------------------------------------------------------------
// Content — edit the data below; the layout renders whatever it contains.
// ---------------------------------------------------------------------------

const testimonials = [
  {
    id: 1,
    quote:
      "The instructors are top-notch and the curriculum is very practical. I landed a job just two months after completing the course!",
    author: "Niharika Sharma",
    rating: 5,
    course: "Python + DSA",
    achievements: ["Got 3 job offers", "Salary increased by 200%", "Placed in 2 months"],
    // photo: "/img/reviews/niharika.jpg",
  },
  {
    id: 2,
    quote:
      "Skill Training Center's course gave me the skills and confidence I needed to switch my career. The projects were invaluable for my portfolio.",
    author: "Prateek Kumar",
    rating: 5,
    course: "Full Stack Development",
    achievements: ["Career switch successful", "Built 5+ real projects", "Mentorship support"],
  },
  {
    id: 3,
    quote:
      "Hands-on learning and personalized attention made all the difference. Highly recommend this course to anyone serious about data analysis.",
    author: "Raj Borkar",
    rating: 5,
    course: "Data Analytics",
    achievements: ["Mastered ML algorithms", "Real-world case studies", "Industry ready skills"],
  },
  {
    id: 4,
    quote:
      "The projects were hands-on and very practical. I gained confidence in real-world data analysis and visualization techniques.",
    author: "Saloni Patel",
    rating: 5,
    course: "Data Science",
    achievements: ["Data visualization expert", "Business insights skills", "Client project experience"],
  },
  {
    id: 5,
    quote:
      "The mentorship and guidance from Skill Training Center helped me grow faster than I expected. The career support was exceptional.",
    author: "Ajay Singh",
    rating: 5,
    course: "Machine Learning",
    achievements: ["Advanced ML concepts", "Model deployment", "Research opportunities"],
  },
  {
    id: 6,
    quote:
      "The projects and real-life case studies really boosted my confidence. The interview preparation sessions were incredibly helpful.",
    author: "Meenal Gupta",
    rating: 5,
    course: "Data Analytics",
    achievements: ["Multiple job offers", "Confident in interviews", "Practical experience"],
  },
];

type Testimonial = {
  id: number;
  quote: string;
  author: string;
  rating: number;
  course: string;
  achievements: string[];
  photo?: string; // e.g. "/img/reviews/niharika.jpg"
};

interface PlacedStudent {
  name: string;
  role?: string;
  company: string;
  package?: string;
  photo?: string;
}

// Placed students (success stories). Photos live in  public/img/placements/
// Add / remove entries freely — the grid adjusts itself. `role` is optional.
// If a photo is missing, the student's initial is shown instead of a broken image.
const placedStudents: PlacedStudent[] = [
  { name: "Nitisha Borkar", company: "X-Duce", package: "4.2 LPA", photo: "/img/placements/nitisha-borkar.jpg" },
  { name: "Manthan Borkar", company: "ABM", package: "13 LPA", photo: "/img/placements/manthan-borkar.jpg" },
  { name: "Prajakta Dhengre", company: "PWC", package: "6.4 LPA", photo: "/img/placements/prajakta-dhengre.jpg" },
  { name: "Tanmay Agnihotri", company: "IDFC", package: "13 LPA", photo: "/img/placements/tanmay-agnihotri.jpg" },
  { name: "Shiv Das", company: "X-Duce", package: "4.2 LPA", photo: "/img/placements/shiv-das.jpg" },
  { name: "Asit Sahu", company: "Jade Global", package: "12 LPA", photo: "/img/placements/asit-sahu.jpg" },
  { name: "Zeba Sheikh", company: "Expleo", package: "4.5 LPA", photo: "/img/placements/zeba-sheikh.jpg" },
  { name: "Mrunal Umredkar", company: "Capgemini", package: "3.8 LPA", photo: "/img/placements/mrunal-umredkar.jpg" },
  { name: "Vaishnavi Khoware", company: "Stetig", package: "4.8 LPA", photo: "/img/placements/vaishnavi-khoware.jpg" },
];

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  postedAt: string;
  requirements: string[];
  skills: string[];
  category: string;
  description: string;
  experience: string;
  urgent?: boolean;
  contact?: string;
  eligibility?: string;
  interview?: string;
  workMode?: string;
  vacancies?: string;
  workingHours?: string;
  gender?: string;
  mindset?: string;
}

const jobs: Job[] = [
  {
    id: 5,
    title: "Associate Band U1",
    company: "Tech Mahindra",
    location: "Pune, India",
    salary: "₹3.0 - 3.5 LPA",
    type: "Full-Time",
    postedAt: "2025-10-10T09:00:00Z",
    requirements: ["BE/BTECH/BCA/MCA ONLY", "Excellent Communication Skills", "Low MTI Parameter", "Flexible for 24/7 shifts"],
    skills: ["Communication", "Flexibility", "Technical Knowledge"],
    category: "IT Services",
    description: "Blended process role requiring excellent communication and flexibility for rotational shifts.",
    experience: "0-1 years",
    urgent: true,
    contact: "7719927774, 7720846048",
    eligibility: "BE/BTECH/BCA/MCA ONLY",
    interview: "Monday (Virtual)",
    workMode: "Work From Office",
  },
  {
    id: 6,
    title: "Manufacturing Plant Roles",
    company: "Leading Manufacturing Plant",
    location: "Ahmednagar, Maharashtra",
    salary: "₹18,000 - 25,000",
    type: "Full-Time",
    postedAt: "2025-10-09T11:00:00Z",
    requirements: ["ITI, Diploma/Degree", "Mechanical/Electrical/Electronics/Automobile", "12 Hours/Day"],
    skills: ["Production", "Maintenance", "Quality", "Testing"],
    category: "Manufacturing",
    description:
      "Multiple vacancies in production, maintenance, quality and testing departments for a leading manufacturing plant.",
    experience: "0-2 years",
    urgent: true,
    contact: "9422129534, 7719927774, 7720846048",
    vacancies: "6000+",
    workingHours: "12 Hours/Day",
    gender: "Male & Female",
  },
  {
    id: 7,
    title: "Data Sorter",
    company: "Data Management Solutions",
    location: "Nagpur, Maharashtra",
    salary: "₹16,000 CTC",
    type: "Full-Time",
    postedAt: "2025-10-10T08:00:00Z",
    requirements: ["Any Graduate", "Good English (speaking & writing)", "Basic computer Excel/Google Sheets"],
    skills: ["Data Organization", "Attention to Detail", "Excel", "Record Keeping"],
    category: "Data Entry",
    description:
      "Non-technical role involving sorting and organizing data, checking for mistakes, and maintaining records.",
    experience: "0 years",
    urgent: true,
    contact: "7720846048, 7719927774",
    mindset: "Hard-working, Eager to learn",
  },
];

const placementStats = [
  { label: "Placement success rate", value: "85%", icon: CheckBadgeIcon },
  { label: "Average package", value: "₹6.2 LPA", icon: CurrencyRupeeIcon },
  { label: "Highest package", value: "₹22.0 LPA", icon: ArrowTrendingUpIcon },
  { label: "Partner companies", value: "200+", icon: BuildingOffice2Icon },
  { label: "Students placed", value: "2500+", icon: UserGroupIcon },
  { label: "Average hike", value: "150%", icon: TrophyIcon },
];

const heroPills = [
  { icon: AcademicCapIcon, label: "Pre-placement training" },
  { icon: DocumentTextIcon, label: "Resume building" },
  { icon: ChatBubbleLeftRightIcon, label: "Mock interviews" },
];

const educationOptions = ["B.Tech / B.E", "BCA", "MCA", "M.Tech", "Other"];
const specializationOptions = [
  "Computer Science",
  "Information Technology",
  "Electronics & Communication",
  "Mechanical",
  "Civil",
  "Other",
];
const passoutYears = Array.from({ length: 11 }, (_, i) => String(2020 + i));

const WHATSAPP_NUMBER = "917720846048";

// Category → palette, assigned in order of first appearance so it never changes on filter.
const categoryOrder = Array.from(new Set(jobs.map((j) => j.category)));
const themeForCategory = (category: string): Theme => paletteCycle[categoryOrder.indexOf(category) % paletteCycle.length];

// ---------------------------------------------------------------------------
// Shared styles + helpers
// ---------------------------------------------------------------------------

const field =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-200 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200";
const fieldLabel = "mb-1 block text-xs font-semibold text-slate-600";
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2";

/**
 * Keyframes + layout for the moving (auto-scrolling) reviews strip.
 * Plain CSS on purpose: it does not depend on Tailwind config / plugins.
 */
const marqueeCss = `
.pl-marquee-wrap{overflow:hidden;padding:.5rem 0;-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.pl-marquee-track{display:flex;width:max-content;gap:1.25rem;animation:pl-marquee 60s linear infinite}
.pl-marquee-wrap:hover .pl-marquee-track,.pl-marquee-wrap:focus-within .pl-marquee-track{animation-play-state:paused}
@keyframes pl-marquee{from{transform:translateX(0)}to{transform:translateX(calc(-50% - .625rem))}}
@media (prefers-reduced-motion:reduce){
  .pl-marquee-track{animation:none}
  .pl-marquee-wrap{overflow-x:auto;-webkit-mask-image:none;mask-image:none}
}
`;

function scrollToId(id: string) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

function timeAgo(dateStr: string) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000));
  const units: [number, string][] = [
    [31536000, "year"],
    [2592000, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ];
  for (const [size, label] of units) {
    const n = Math.floor(seconds / size);
    if (n >= 1) return `${n} ${label}${n > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

/** The handful of extra facts worth showing on a card, whichever the job provides. */
function jobDetails(job: Job) {
  const rows: { label: string; value: string }[] = [];
  const add = (label: string, value?: string) => value && rows.push({ label, value });
  add("Eligibility", job.eligibility ?? job.requirements[0]);
  add("Interview", job.interview);
  add("Vacancies", job.vacancies);
  add("Work mode", job.workMode);
  add("Hours", job.workingHours);
  add("Open to", job.gender);
  add("Mindset", job.mindset);
  return rows.slice(0, 4);
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
}

// ---------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------

function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  center = false,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  center?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`mb-8 max-w-2xl ${center ? "mx-auto text-center" : ""}`}
    >
      <span className="text-sm font-bold uppercase tracking-wide text-blue-600">{eyebrow}</span>
      <h2 id={id} className="mt-2 text-3xl font-extrabold tracking-tight text-[#171034] md:text-4xl">
        {title}
      </h2>
      <p className="mt-2 text-lg text-slate-600">{description}</p>
    </motion.div>
  );
}

/** One placed student: circular photo on a soft gradient, name, company, package badge. */
function PlacedStudentCard({ student, theme }: { student: PlacedStudent; theme: Theme }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <motion.figure
      variants={fadeInUp()}
      whileHover={{ y: -6 }}
      className={`group relative flex flex-col items-center overflow-hidden rounded-2xl border bg-white px-4 pb-5 pt-6 text-center shadow-sm transition-shadow duration-300 hover:shadow-xl ${theme.cardHover} ${theme.surface.split(" ").pop()}`}
    >
      {/* Soft coloured header band behind the photo */}
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-[76px] ${theme.surface.split(" ").slice(0, 3).join(" ")}`}
      />

      <span
        className={`relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white text-4xl font-extrabold shadow-lg ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-105 ${theme.accent}`}
      >
        {initials(student.name)}
        {student.photo && !imageFailed && (
          <img
            src={student.photo}
            alt={`${student.name}, placed at ${student.company}`}
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </span>

      <figcaption className="relative mt-3.5">
        <p className="text-base font-bold leading-tight text-[#171034]">{student.name}</p>
        {student.role && <p className="mt-0.5 text-sm text-slate-500">{student.role}</p>}
        <span className={`mt-2.5 inline-block rounded-full px-3 py-1 text-xs font-bold ${theme.chip}`}>
          {student.company}
        </span>
        {student.package && (
          <p className="mt-2">
            <span className="inline-block rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 px-3 py-1 text-xs font-extrabold text-white shadow-md shadow-emerald-600/25">
              {student.package}
            </span>
          </p>
        )}
      </figcaption>
    </motion.figure>
  );
}

/** One review card inside the moving strip. `hidden` marks the duplicated (loop) copy. */
function ReviewCard({ item, theme, hidden = false }: { item: Testimonial; theme: Theme; hidden?: boolean }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <figure
      aria-hidden={hidden || undefined}
      className={`flex w-[300px] shrink-0 flex-col rounded-2xl border p-5 shadow-sm md:w-[360px] ${theme.surface}`}
    >
      <figcaption className="flex items-center gap-3">
        <span
          className={`relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-sm font-extrabold shadow-sm ring-1 ring-black/5 ${theme.accent}`}
        >
          {initials(item.author)}
          {item.photo && !imageFailed && (
            <img
              src={item.photo}
              alt=""
              loading="lazy"
              decoding="async"
              onError={() => setImageFailed(true)}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-bold leading-tight text-[#171034]">{item.author}</p>
          <p className="text-sm text-slate-600">{item.course}</p>
        </div>
        <span className="flex shrink-0" role="img" aria-label={`${item.rating} out of 5 stars`}>
          {Array.from({ length: 5 }, (_, s) => (
            <StarIcon
              key={s}
              className={`h-4 w-4 ${s < item.rating ? "text-amber-400" : "text-slate-300"}`}
              aria-hidden="true"
            />
          ))}
        </span>
      </figcaption>

      <blockquote className="mt-4 flex-grow text-sm leading-relaxed text-slate-700">“{item.quote}”</blockquote>

      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Highlights">
        {item.achievements.map((a) => (
          <li key={a} className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${theme.chip}`}>
            {a}
          </li>
        ))}
      </ul>
    </figure>
  );
}

function JobCard({
  job,
  saved,
  onToggleSave,
  onApply,
}: {
  job: Job;
  saved: boolean;
  onToggleSave: (id: number) => void;
  onApply: (job: Job) => void;
}) {
  const t = themeForCategory(job.category);
  const details = jobDetails(job);

  return (
    <motion.article
      variants={fadeInUp()}
      whileHover={{ y: -4 }}
      className={`group flex h-full flex-col rounded-2xl border p-5 shadow-sm transition-[border-color,box-shadow] duration-300 hover:shadow-xl ${t.surface} ${t.cardHover}`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/5 ${t.accent}`}
        >
          <BriefcaseIcon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold leading-tight text-[#171034]">{job.title}</h3>
          <p className="mt-0.5 text-sm text-slate-600">{job.company}</p>
        </div>
        {job.urgent && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-bold text-red-700">
            <BoltIcon className="h-3 w-3" aria-hidden="true" />
            Urgent
          </span>
        )}
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
        <li className="flex items-center gap-1.5">
          <MapPinIcon className={`h-4 w-4 ${t.accent}`} aria-hidden="true" />
          {job.location}
        </li>
        <li className="flex items-center gap-1.5">
          <ClockIcon className={`h-4 w-4 ${t.accent}`} aria-hidden="true" />
          {timeAgo(job.postedAt)}
        </li>
      </ul>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${t.chip}`}>{job.category}</span>
        <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-900/10">
          {job.type}
        </span>
        <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-900/10">
          {job.experience}
        </span>
      </div>

      <p className="mt-4 flex items-center gap-1.5 text-xl font-extrabold text-[#171034]">
        <CurrencyRupeeIcon className={`h-5 w-5 ${t.accent}`} aria-hidden="true" />
        <span className="sr-only">Salary: </span>
        {job.salary.replace("₹", "")}
      </p>

      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{job.description}</p>

      {details.length > 0 && (
        <dl className="mt-4 grid grid-cols-2 overflow-hidden rounded-xl border border-slate-900/10 bg-white/80 text-sm">
          {details.map((d) => (
            <div
              key={d.label}
              className="border-slate-900/10 px-3 py-2 odd:border-r last:odd:col-span-2 last:odd:border-r-0 [&:nth-child(n+3)]:border-t"
            >
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{d.label}</dt>
              <dd className="font-semibold leading-snug text-slate-800">{d.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Skills">
        {job.skills.map((s) => (
          <li key={s} className="rounded-md bg-white/70 px-2 py-0.5 text-xs font-medium text-slate-700">
            {s}
          </li>
        ))}
      </ul>

      {job.contact && (
        <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600">
          <PhoneIcon className={`h-4 w-4 shrink-0 ${t.accent}`} aria-hidden="true" />
          {job.contact.split(",").map((n, i) => (
            <span key={n}>
              <a
                href={`tel:${n.trim()}`}
                className={`font-semibold text-slate-800 underline-offset-2 hover:underline ${focusRing} rounded`}
              >
                {n.trim()}
              </a>
              {i < job.contact!.split(",").length - 1 && <span aria-hidden="true">,</span>}
            </span>
          ))}
        </p>
      )}

      <div className="mt-auto flex items-center gap-2 pt-5">
        <button
          type="button"
          onClick={() => onApply(job)}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-bold shadow-md transition-all duration-300 hover:shadow-lg ${t.button} ${focusRing}`}
        >
          Apply Now
          <ArrowRightIcon
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </button>
        <button
          type="button"
          onClick={() => onToggleSave(job.id)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-900/10 bg-white/80 transition-colors hover:bg-white ${t.accent} ${focusRing}`}
        >
          {saved ? (
            <BookmarkSolidIcon className="h-5 w-5" aria-hidden="true" />
          ) : (
            <BookmarkIcon className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>
    </motion.article>
  );
}

// ---------------------------------------------------------------------------
// Application modal (submits through WhatsApp, as before)
// ---------------------------------------------------------------------------

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  education: "",
  specialization: "",
  aggregate: "",
  passoutYear: "",
  skills: "",
  experience: "",
};

function JobApplicationModal({
  job,
  isOpen,
  onClose,
}: {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState(emptyForm);
  const [resume, setResume] = useState<File | null>(null);
  const [status, setStatus] = useState<{ kind: "error" | "success"; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) setStatus(null);
  }, [isOpen]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setStatus(null);
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.firstName || !form.lastName || !form.email || !form.phone || !resume) {
      setStatus({ kind: "error", text: "Please fill all required fields and upload a resume." });
      return;
    }
    if (resume.type !== "application/pdf" || resume.size > 5 * 1024 * 1024) {
      setStatus({ kind: "error", text: "Please upload a PDF file smaller than 5MB." });
      return;
    }

    const message = `
*Job Application*
*Job Title*: ${job ? job.title : "Not specified"}
*Company*: ${job ? job.company : "Not specified"}
*Name*: ${form.firstName} ${form.lastName}
*Email*: ${form.email}
*Phone*: ${form.phone}
*Education*: ${form.education || "Not provided"}
*Specialization*: ${form.specialization || "Not provided"}
*Aggregate*: ${form.aggregate || "Not provided"}
*Passout Year*: ${form.passoutYear || "Not provided"}
*Skills*: ${form.skills || "Not provided"}
*Experience*: ${form.experience || "Not provided"}
*Note*: Please find my resume attached in this chat.
    `.trim();

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener");

    setStatus({ kind: "success", text: "Redirected to WhatsApp. Please attach your resume and send the message." });
    setForm(emptyForm);
    setResume(null);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold tracking-tight text-[#171034]">
            {job ? `Apply for ${job.title}` : "Apply Now"}
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            {job
              ? `${job.company} · ${job.location}`
              : "Share your details and our placement team will match you with openings."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className={fieldLabel}>First name *</label>
              <input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} placeholder="Enter first name" autoComplete="given-name" className={field} />
            </div>
            <div>
              <label htmlFor="lastName" className={fieldLabel}>Last name *</label>
              <input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Enter last name" autoComplete="family-name" className={field} />
            </div>
            <div>
              <label htmlFor="email" className={fieldLabel}>Email address *</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="your.email@example.com" autoComplete="email" className={field} />
            </div>
            <div>
              <label htmlFor="phone" className={fieldLabel}>Phone number *</label>
              <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 xxxxx xxxxx" autoComplete="tel" className={field} />
            </div>
            <div>
              <label htmlFor="education" className={fieldLabel}>Education</label>
              <select id="education" name="education" value={form.education} onChange={handleChange} className={field}>
                <option value="">Select your education</option>
                {educationOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="specialization" className={fieldLabel}>Specialization</label>
              <select id="specialization" name="specialization" value={form.specialization} onChange={handleChange} className={field}>
                <option value="">Select specialization</option>
                {specializationOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="aggregate" className={fieldLabel}>Aggregate percentage</label>
              <input id="aggregate" name="aggregate" type="number" min="0" max="100" value={form.aggregate} onChange={handleChange} placeholder="Enter percentage" className={field} />
            </div>
            <div>
              <label htmlFor="passoutYear" className={fieldLabel}>Passout year</label>
              <select id="passoutYear" name="passoutYear" value={form.passoutYear} onChange={handleChange} className={field}>
                <option value="">Select year</option>
                {passoutYears.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="skills" className={fieldLabel}>Technical skills</label>
            <textarea id="skills" name="skills" rows={2} value={form.skills} onChange={handleChange} placeholder="e.g., Java, Python, React" className={`${field} resize-none`} />
          </div>
          <div>
            <label htmlFor="experience" className={fieldLabel}>Work / internship experience</label>
            <textarea id="experience" name="experience" rows={2} value={form.experience} onChange={handleChange} placeholder="Describe any experience or internships (if any)" className={`${field} resize-none`} />
          </div>
          <div>
            <label htmlFor="resume" className={fieldLabel}>Upload resume (PDF, max 5MB) *</label>
            <input
              id="resume"
              name="resume"
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                setStatus(null);
                setResume(e.target.files?.[0] ?? null);
              }}
              className={`${field} file:mr-3 file:rounded-lg file:border-0 file:bg-violet-100 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-violet-700`}
            />
          </div>

          {status && (
            <p
              role={status.kind === "error" ? "alert" : "status"}
              className={`rounded-xl px-4 py-2.5 text-center text-sm font-medium ${
                status.kind === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {status.text}
            </p>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <button
              type="button"
              onClick={onClose}
              className={`rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 ${focusRing}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`rounded-xl px-5 py-2.5 text-sm font-bold shadow-md transition-all hover:shadow-lg ${primaryButton} ${focusRing}`}
            >
              Submit via WhatsApp
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const PAGE_SIZE = 6;

export default function Placements() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [jobType, setJobType] = useState("");
  const [category, setCategory] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [saved, setSaved] = useState<Record<number, boolean>>({});

  // Filter options come from the data, so they can never drift out of sync with it.
  const locations = useMemo(() => Array.from(new Set(jobs.map((j) => j.location))), []);
  const experiences = useMemo(() => Array.from(new Set(jobs.map((j) => j.experience))), []);
  const types = useMemo(() => Array.from(new Set(jobs.map((j) => j.type))), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesQuery =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.category.toLowerCase().includes(q) ||
        job.skills.some((s) => s.toLowerCase().includes(q));
      return (
        matchesQuery &&
        (!location || job.location === location) &&
        (!experience || job.experience === experience) &&
        (!jobType || job.type === jobType) &&
        (!category || job.category === category)
      );
    });
  }, [query, location, experience, jobType, category]);

  const hasFilters = Boolean(query || location || experience || jobType || category);
  const savedCount = Object.values(saved).filter(Boolean).length;

  function resetFilters() {
    setQuery("");
    setLocation("");
    setExperience("");
    setJobType("");
    setCategory("");
    setVisible(PAGE_SIZE);
  }

  function toggleSave(id: number) {
    setSaved((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function openApply(job: Job | null = null) {
    setSelectedJob(job);
    setIsModalOpen(true);
  }

  return (
    <Layout>
      <MotionConfig reducedMotion="user">
        <style>{marqueeCss}</style>
        <div className="bg-white">
          {/* ================= HERO ================= */}
          <section
            aria-labelledby="placements-hero-heading"
            className="relative overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#2e1065] to-[#312e81] text-white"
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-pink-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="container relative grid items-center gap-10 py-12 md:grid-cols-[1.1fr_0.9fr] md:py-16">
              <motion.div initial="hidden" animate="show" variants={stagger}>
                <motion.span
                  variants={fadeInUp()}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-pink-100"
                >
                  <BriefcaseIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  Placement Cell
                </motion.span>

                <motion.h1
                  id="placements-hero-heading"
                  variants={fadeInUp(0.08)}
                  className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
                >
                  Launch your career.
                  <br />
                  <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                    Get hired.
                  </span>
                </motion.h1>

                <motion.p
                  variants={fadeInUp(0.16)}
                  className="mt-4 max-w-lg text-lg leading-relaxed text-indigo-100/90"
                >
                  Join 2500+ students who transformed their careers with our placement program — training, resume
                  support and direct openings with hiring partners.
                </motion.p>

                <motion.ul variants={fadeInUp(0.22)} className="mt-5 flex flex-wrap gap-2.5">
                  {heroPills.map(({ icon: Icon, label }) => (
                    <li
                      key={label}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-sm font-medium text-indigo-100"
                    >
                      <Icon className="h-4 w-4 text-pink-300" aria-hidden="true" />
                      {label}
                    </li>
                  ))}
                </motion.ul>

                <motion.div variants={fadeInUp(0.3)} className="mt-7 flex flex-wrap gap-3">
                  <motion.button
                    type="button"
                    onClick={() => openApply()}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-6 py-3 font-bold shadow-lg shadow-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1e1b4b]"
                  >
                    Apply Now
                    <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => scrollToId("jobs")}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 font-semibold transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1e1b4b]"
                  >
                    View Jobs
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Compact placement statistics */}
              <motion.ul
                aria-label="Placement statistics"
                initial="hidden"
                animate="show"
                variants={stagger}
                className="grid grid-cols-2 gap-3"
              >
                {placementStats.map((s, i) => {
                  const t = paletteCycle[i % paletteCycle.length];
                  return (
                    <motion.li
                      key={s.label}
                      variants={fadeInUp()}
                      whileHover={{ y: -3 }}
                      className={`rounded-2xl border p-4 shadow-lg shadow-black/10 ${t.surface}`}
                    >
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/5 ${t.accent}`}
                      >
                        <s.icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <p className="mt-3 text-2xl font-extrabold leading-none text-[#171034]">{s.value}</p>
                      <p className="mt-1 text-xs font-medium text-slate-600">{s.label}</p>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </div>
          </section>

          {/* ================= PLACED STUDENTS (photo wall) ================= */}
          {placedStudents.length > 0 && (
            <section id="placed-students" aria-labelledby="placed-students-heading" className="scroll-mt-20">
              <div className="container py-12 md:py-14">
                <SectionHeading
                  id="placed-students-heading"
                  eyebrow="Our placed students"
                  title="Meet the students we've placed"
                  description="Real students, real offers — trained with us and now working with leading companies."
                  center
                />

                <motion.div
                  variants={stagger}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5"
                >
                  {placedStudents.map((student, i) => (
                    <PlacedStudentCard
                      key={`${student.name}-${i}`}
                      student={student}
                      theme={paletteCycle[i % paletteCycle.length]}
                    />
                  ))}
                </motion.div>
              </div>
            </section>
          )}

          {/* ================= JOBS ================= */}
          <section id="jobs" aria-labelledby="jobs-heading" className="scroll-mt-20">
            <div className="container py-12 md:py-14">
              <SectionHeading
                id="jobs-heading"
                eyebrow="Current openings"
                title="Explore job opportunities"
                description="Fresh openings from our hiring partners — search, filter and apply in minutes."
              />

              {/* Filters */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
                  <div className="relative col-span-2 sm:col-span-3 lg:col-span-1">
                    <MagnifyingGlassIcon
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      aria-hidden="true"
                    />
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search title, company or skill"
                      aria-label="Search jobs"
                      className={`${field} pl-10`}
                    />
                  </div>
                  <select value={location} onChange={(e) => setLocation(e.target.value)} aria-label="Location" className={`${field} col-span-2 sm:col-span-1`}>
                    <option value="">All locations</option>
                    {locations.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <select value={experience} onChange={(e) => setExperience(e.target.value)} aria-label="Experience" className={field}>
                    <option value="">Experience</option>
                    {experiences.map((x) => <option key={x} value={x}>{x}</option>)}
                  </select>
                  <select value={jobType} onChange={(e) => setJobType(e.target.value)} aria-label="Job type" className={field}>
                    <option value="">Job type</option>
                    {types.map((x) => <option key={x} value={x}>{x}</option>)}
                  </select>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setCategory("")}
                      aria-pressed={category === ""}
                      className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all ${focusRing} ${
                        category === ""
                          ? `${primaryButton} shadow-md`
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      All
                    </button>
                    {categoryOrder.map((c) => {
                      const active = category === c;
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setCategory(active ? "" : c)}
                          aria-pressed={active}
                          className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all ${focusRing} ${
                            active
                              ? `${themeForCategory(c).button} shadow-md`
                              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <p aria-live="polite">
                      <strong className="text-[#171034]">{filtered.length}</strong>{" "}
                      {filtered.length === 1 ? "job" : "jobs"}
                      {savedCount > 0 && <span> · {savedCount} saved</span>}
                    </p>
                    {hasFilters && (
                      <button
                        type="button"
                        onClick={resetFilters}
                        className={`inline-flex items-center gap-1 rounded-lg font-semibold text-violet-700 hover:text-violet-900 ${focusRing}`}
                      >
                        <ArrowPathIcon className="h-4 w-4" aria-hidden="true" />
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Job cards */}
              {filtered.length > 0 ? (
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
                >
                  {filtered.slice(0, visible).map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      saved={Boolean(saved[job.id])}
                      onToggleSave={toggleSave}
                      onApply={openApply}
                    />
                  ))}
                </motion.div>
              ) : (
                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-10 text-center">
                  <p className="text-lg font-bold text-[#171034]">No jobs match your search</p>
                  <p className="mt-1 text-sm text-slate-600">Try different keywords or clear the filters.</p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className={`mt-4 rounded-xl px-5 py-2.5 text-sm font-bold shadow-md transition-all hover:shadow-lg ${primaryButton} ${focusRing}`}
                  >
                    Clear filters
                  </button>
                </div>
              )}

              {visible < filtered.length && (
                <div className="mt-8 text-center">
                  <button
                    type="button"
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className={`rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-slate-800 shadow-sm transition-all hover:shadow-md ${focusRing}`}
                  >
                    Load more jobs
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* ================= TESTIMONIALS (moving strip) ================= */}
          <section
            aria-labelledby="testimonials-heading"
            className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
          >
            <div className="container py-12 md:py-14">
              <SectionHeading
                id="testimonials-heading"
                eyebrow="Student voices"
                title="Success stories from our alumni"
                description="Real results from students who trained with us and started their careers."
                center
              />
            </div>

            {/* Full-width auto-scrolling strip; pauses on hover / keyboard focus */}
            <div className="pb-12 md:pb-14">
              <div className="pl-marquee-wrap" role="region" aria-label="Student reviews">
                <div className="pl-marquee-track">
                  {[...testimonials, ...testimonials].map((item, i) => (
                    <ReviewCard
                      key={`${item.id}-${i}`}
                      item={item}
                      theme={paletteCycle[i % testimonials.length % paletteCycle.length]}
                      hidden={i >= testimonials.length}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ================= CTA ================= */}
          <section
            aria-labelledby="placements-cta-heading"
            className="bg-gradient-to-br from-[#1e1b4b] via-[#2e1065] to-[#312e81] text-white"
          >
            <div className="container py-12 text-center md:py-14">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 id="placements-cta-heading" className="text-3xl font-extrabold tracking-tight md:text-4xl">
                  Ready to start your career?
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-lg text-indigo-100/90">
                  Apply to an opening today or browse everything currently available.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <motion.button
                    type="button"
                    onClick={() => openApply()}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-6 py-3 font-bold shadow-lg shadow-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1e1b4b]"
                  >
                    Apply Now
                    <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => scrollToId("jobs")}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 font-semibold transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1e1b4b]"
                  >
                    View Jobs
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </MotionConfig>

      <JobApplicationModal job={selectedJob} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Layout>
  );
}