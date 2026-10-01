import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/site/Layout";
import { getCourseById } from "@/data/courses";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  AcademicCapIcon,
  ChatBubbleBottomCenterTextIcon,
  SparklesIcon,
  ClockIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  SunIcon,
  MoonIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  UserGroupIcon,
  ExclamationCircleIcon,
  Squares2X2Icon,
  TicketIcon,
} from "@heroicons/react/24/outline";
import { CheckBadgeIcon as CheckBadgeSolid } from "@heroicons/react/24/solid";

// TODO: replace with your own deployed Apps Script Web App URL
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzikXYaDkViNbbW0mJE421h401IrdjyRVUCctcqiDgVidrppGCnVkJzYm7D1Sd_CiM/exec";

const LEVEL_STYLES: Record<string, { dot: string; text: string; bg: string }> = {
  Beginner: { dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
  Intermediate: { dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50" },
  Advanced: { dot: "bg-rose-500", text: "text-rose-700", bg: "bg-rose-50" },
};

interface BatchOption {
  id: "weekday" | "weekend";
  title: string;
  icon: typeof SunIcon;
  schedule: string;
  time: string;
  theme: string;
  startDay: number; // 0 = Sun ... 6 = Sat
}

const batchOptions: BatchOption[] = [
  {
    id: "weekday",
    title: "Weekday Batch",
    icon: SunIcon,
    schedule: "Monday – Friday",
    time: "6:30 PM – 8:30 PM",
    theme: "from-blue-500 to-blue-600",
    startDay: 1,
  },
  {
    id: "weekend",
    title: "Weekend Batch",
    icon: MoonIcon,
    schedule: "Saturday & Sunday",
    time: "10:00 AM – 2:00 PM",
    theme: "from-purple-500 to-purple-600",
    startDay: 6,
  },
];

// Next real-world occurrence of the batch's starting weekday — not a
// fabricated date, just calendar math from "today".
function nextStartDate(startDay: number) {
  const now = new Date();
  const diff = (startDay - now.getDay() + 7) % 7;
  const result = new Date(now);
  result.setDate(now.getDate() + (diff === 0 ? 7 : diff));
  return result.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function generateEnrollmentId() {
  const ref = Math.floor(100000 + Math.random() * 900000);
  return `SS-${ref}`;
}

const inputClasses =
  "w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3 pl-11 pr-3.5 text-sm text-foreground placeholder:text-slate-400 shadow-sm transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20";

function FieldShell({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" aria-hidden="true" />
      {children}
    </div>
  );
}

interface BatchCardProps {
  batch: BatchOption;
  isSelected: boolean;
  onSelect: () => void;
}

const BatchCard = ({ batch, isSelected, onSelect }: BatchCardProps) => {
  const Icon = batch.icon;
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden rounded-2xl border-2 bg-white p-5 text-left transition-colors duration-300 ${
        isSelected ? "border-blue-400 shadow-lg shadow-indigo-500/10" : "border-slate-200 hover:border-indigo-200"
      }`}
    >
      {isSelected && (
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white">
          <CheckBadgeSolid className="h-3.5 w-3.5" aria-hidden="true" />
          Selected
        </div>
      )}
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${batch.theme} text-white shadow-sm`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h4 className="text-base font-bold text-[#171034]">{batch.title}</h4>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Seats open
          </span>
        </div>
      </div>
      <div className="mt-3 space-y-1 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <CalendarDaysIcon className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
          {batch.schedule}
        </div>
        <div className="flex items-center gap-1.5">
          <ClockIcon className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
          {batch.time}
        </div>
      </div>
    </motion.button>
  );
};

const TRUST_INDICATORS = [
  { icon: LockClosedIcon, label: "Secure & encrypted form" },
  { icon: ShieldCheckIcon, label: "No spam, ever" },
  { icon: UserGroupIcon, label: "Trusted training partner" },
];

export default function Enroll() {
  const { id } = useParams();
  const course = id ? getCourseById(id) : null;
  const navigate = useNavigate();

  const initialFormState = {
    course: course?.title || "",
    name: "",
    email: "",
    phone: "",
    qualification: "",
    city: "",
    message: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [selectedBatch, setSelectedBatch] = useState<BatchOption["id"] | null>(null);
  const [batchError, setBatchError] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState("");

  const selectedBatchDetails = batchOptions.find((b) => b.id === selectedBatch) || null;
  const level = course ? LEVEL_STYLES[course.level] ?? { dot: "bg-blue-500", text: "text-blue-700", bg: "bg-blue-50" } : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectBatch = (batchId: BatchOption["id"]) => {
    setSelectedBatch(batchId);
    setBatchError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBatch) {
      setBatchError(true);
      document.getElementById("choose-batch")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const payload = new URLSearchParams();
      const submission = { ...form, batch: selectedBatchDetails?.title || "" };
      Object.entries(submission).forEach(([key, value]) =>
        payload.append(key, (value ?? "").toString())
      );

      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          Accept: "application/json",
        },
        body: payload.toString(),
      });

      const rawText = await response.text();
      let json: any;

      try {
        json = JSON.parse(rawText || "{}");
      } catch {
        json = { status: response.ok ? "success" : "error", message: rawText };
      }

      if (response.ok && json.status === "success") {
        setEnrollmentId(json.enrollmentId || generateEnrollmentId());
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        throw new Error(json.message || "Unknown server error");
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setStatusMessage(
        "Something went wrong while submitting your enrollment. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================== Course not found ====================
  if (!course) {
    return (
      <Layout>
        <div className="container py-24 text-center">
          <SparklesIcon className="mx-auto mb-6 h-16 w-16 text-indigo-400" aria-hidden="true" />
          <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
            Course Not Found
          </h1>
          <p className="mx-auto mt-4 max-w-md text-slate-500">
            We couldn't find the course you're trying to enroll in.
          </p>
          <Link
            to="/courses"
            className="mx-auto mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3.5 text-sm font-semibold text-white shadow-md"
          >
            Browse All Courses
          </Link>
        </div>
      </Layout>
    );
  }

  // ==================== Success confirmation state ====================
  if (submitted) {
    return (
      <Layout>
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-indigo-950/30 dark:via-background dark:to-background" />
          <div className="absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-blue-200/25 blur-[110px] dark:bg-blue-600/10" />
          <div className="absolute -bottom-32 -left-32 h-[380px] w-[380px] rounded-full bg-pink-200/20 blur-[100px] dark:bg-pink-600/10" />
        </div>

        <section className="container flex min-h-[80vh] items-center justify-center py-14">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-lg overflow-hidden rounded-[24px] border border-slate-200 bg-white p-8 text-center shadow-xl shadow-indigo-500/10 sm:p-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg"
            >
              <CheckCircleIcon className="h-9 w-9" aria-hidden="true" />
            </motion.div>

            <h1 className="mt-6 text-2xl font-bold text-[#171034] sm:text-3xl">Enrollment Successful!</h1>
            <p className="mt-2 text-sm text-slate-500">
              Thank you, {form.name.split(" ")[0] || "learner"}! Our admissions team will reach out shortly to confirm the next steps.
            </p>

            <div className="mt-7 space-y-3 rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5 text-left">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                <span className="flex items-center gap-2 text-sm text-slate-500">
                  <TicketIcon className="h-4 w-4 text-indigo-500" aria-hidden="true" />
                  Enrollment ID
                </span>
                <span className="font-mono text-sm font-bold text-[#171034]">{enrollmentId}</span>
              </div>
              <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                <span className="text-sm text-slate-500">Course</span>
                <span className="max-w-[60%] text-right text-sm font-semibold text-[#171034]">{course.title}</span>
              </div>
              <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                <span className="text-sm text-slate-500">Selected Batch</span>
                <span className="text-sm font-semibold text-[#171034]">{selectedBatchDetails?.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Start Date</span>
                <span className="text-sm font-semibold text-[#171034]">
                  {selectedBatchDetails ? nextStartDate(selectedBatchDetails.startDay) : "—"}
                </span>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/portal"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 text-sm font-semibold text-white shadow-md transition-shadow hover:shadow-lg"
              >
                <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
                Go to Dashboard
              </Link>
              <Link
                to="/courses"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition-colors hover:border-indigo-200 hover:text-indigo-700"
              >
                Explore More Courses
              </Link>
            </div>
          </motion.div>
        </section>
      </Layout>
    );
  }

  // ==================== Enrollment form ====================
  return (
    <Layout>
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#c7d2fe_0.6px,transparent_1px)] dark:bg-[radial-gradient(#4338ca_0.6px,transparent_1px)] [background-size:44px_44px] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-indigo-950/30 dark:via-background dark:to-background" />
        <div className="absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full bg-blue-200/25 blur-[110px] dark:bg-blue-600/10" />
        <div className="absolute -bottom-32 -left-32 h-[420px] w-[420px] rounded-full bg-pink-200/20 blur-[100px] dark:bg-pink-600/10" />
      </div>

      <section className="container relative min-h-screen py-10 sm:py-14">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-1.5">
            <SparklesIcon className="h-4 w-4 text-purple-500" aria-hidden="true" />
            <span className="text-xs font-semibold tracking-wide text-indigo-700">SECURE ENROLLMENT</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#171034] dark:text-white sm:text-4xl">
            Enroll in{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {course.title}
            </span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
            Complete the form below and our admissions team will contact you to confirm your seat.
          </p>
        </motion.div>

        <div className="mt-8 lg:flex lg:items-start lg:gap-8 xl:gap-10">
          {/* ===================== Main Content ===================== */}
          <div className="min-w-0 flex-1 space-y-8">
            {/* Course Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Selected Course</p>
                  <h2 className="mt-1 text-xl font-bold text-[#171034]">{course.title}</h2>
                </div>
                {level && (
                  <span className={`inline-flex items-center gap-1.5 rounded-full ${level.bg} px-3 py-1 text-xs font-semibold ${level.text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${level.dot}`} />
                    {course.level}
                  </span>
                )}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 py-2.5">
                  <ClockIcon className="h-5 w-5 text-indigo-500" aria-hidden="true" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-slate-400">Duration</p>
                    <p className="text-sm font-bold text-[#171034]">{course.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 py-2.5">
                  <AcademicCapIcon className="h-5 w-5 text-indigo-500" aria-hidden="true" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-slate-400">Level</p>
                    <p className="text-sm font-bold text-[#171034]">{course.level}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 py-2.5">
                  <CheckBadgeIcon className="h-5 w-5 text-indigo-500" aria-hidden="true" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-slate-400">Certificate</p>
                    <p className="text-sm font-bold text-[#171034]">Included</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Choose Your Batch */}
            <motion.div
              id="choose-batch"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="scroll-mt-24 rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                  <CalendarDaysIcon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#171034]">Choose Your Batch</h3>
                  <p className="text-xs text-slate-500">Pick the schedule that works best for you</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {batchOptions.map((batch) => (
                  <BatchCard
                    key={batch.id}
                    batch={batch}
                    isSelected={selectedBatch === batch.id}
                    onSelect={() => handleSelectBatch(batch.id)}
                  />
                ))}
              </div>

              <AnimatePresence>
                {batchError && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 flex items-center gap-1.5 text-xs font-medium text-rose-500"
                  >
                    <ExclamationCircleIcon className="h-4 w-4" aria-hidden="true" />
                    Please select a batch to continue.
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Registration Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                  <UserIcon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#171034]">Student Registration</h3>
                  <p className="text-xs text-slate-500">Your details are used only to process this enrollment</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Course (auto-filled, readonly) */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500">Course</label>
                  <FieldShell icon={AcademicCapIcon}>
                    <input
                      name="course"
                      value={form.course}
                      readOnly
                      className={`${inputClasses} cursor-not-allowed bg-slate-100 text-slate-500`}
                    />
                  </FieldShell>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-500">Full Name</label>
                    <FieldShell icon={UserIcon}>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Your full name"
                        className={inputClasses}
                      />
                    </FieldShell>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-500">Email</label>
                    <FieldShell icon={EnvelopeIcon}>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="you@example.com"
                        className={inputClasses}
                      />
                    </FieldShell>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-500">Mobile Number</label>
                    <FieldShell icon={PhoneIcon}>
                      <input
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        pattern="[0-9+\s-]{7,15}"
                        placeholder="10-digit mobile number"
                        className={inputClasses}
                      />
                    </FieldShell>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-500">City</label>
                    <FieldShell icon={MapPinIcon}>
                      <input
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        required
                        placeholder="Your city"
                        className={inputClasses}
                      />
                    </FieldShell>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500">Qualification</label>
                  <FieldShell icon={AcademicCapIcon}>
                    <input
                      name="qualification"
                      value={form.qualification}
                      onChange={handleChange}
                      required
                      placeholder="e.g. B.E. Computer Science"
                      className={inputClasses}
                    />
                  </FieldShell>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                    Anything you'd like us to know? <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <div className="relative">
                    <ChatBubbleBottomCenterTextIcon className="pointer-events-none absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" aria-hidden="true" />
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Questions, preferred start date, etc."
                      className={`${inputClasses} resize-none`}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileTap={{ scale: 0.98 }}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 py-4 text-base font-semibold text-white shadow-md shadow-indigo-600/25 transition-all duration-300 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                          className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white"
                        />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="h-5 w-5" aria-hidden="true" />
                        Confirm Enrollment
                      </>
                    )}
                  </motion.button>

                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mt-3 w-full rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700"
                  >
                    Cancel
                  </button>

                  {/* Trust indicators */}
                  <div className="mt-5 grid grid-cols-1 gap-2 border-t border-slate-100 pt-5 sm:grid-cols-3">
                    {TRUST_INDICATORS.map(({ icon: Icon, label }) => (
                      <div key={label} className="flex items-center gap-2 text-xs text-slate-500">
                        <Icon className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                        {label}
                      </div>
                    ))}
                  </div>

                  {statusMessage && (
                    <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-sm font-medium text-rose-500">
                      <ExclamationCircleIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {statusMessage}
                    </p>
                  )}
                </div>
              </form>
            </motion.div>
          </div>

          {/* ===================== Sidebar: Enrollment Summary ===================== */}
          <aside className="mt-8 shrink-0 lg:mt-0 lg:sticky lg:top-24 lg:w-[300px] xl:w-[320px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="overflow-hidden rounded-[20px] border border-indigo-100 bg-gradient-to-br from-white to-indigo-50/60 p-6 shadow-lg shadow-indigo-500/10"
            >
              <div className="flex items-center gap-2">
                <CheckBadgeIcon className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                <h3 className="text-base font-bold text-[#171034]">Enrollment Summary</h3>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-start justify-between gap-3 border-b border-indigo-100 pb-3">
                  <span className="text-slate-500">Course</span>
                  <span className="max-w-[60%] text-right font-semibold text-[#171034]">{course.title}</span>
                </div>
                <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                  <span className="text-slate-500">Batch</span>
                  {selectedBatchDetails ? (
                    <span className="font-semibold text-[#171034]">{selectedBatchDetails.title}</span>
                  ) : (
                    <span className="text-xs font-medium text-slate-400">Not selected</span>
                  )}
                </div>
                <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                  <span className="text-slate-500">Duration</span>
                  <span className="font-semibold text-[#171034]">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                  <span className="text-slate-500">Certificate</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                    <CheckCircleIcon className="h-4 w-4" aria-hidden="true" />
                    Included
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-semibold text-slate-600">Total Fee</span>
                  <span className="text-base font-bold text-[#171034]">
                    {course.fees || "To be shared"}
                  </span>
                </div>
              </div>

              {!course.fees && (
                <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
                  Our counselor will share fee details and current offers during your enrollment call.
                </p>
              )}
            </motion.div>
          </aside>
        </div>
      </section>
    </Layout>
  );
}