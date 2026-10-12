import { Link } from "react-router-dom";
import { PlayCircleIcon } from "@heroicons/react/24/outline";
import type { Course } from "@/data/courses";
import { scrollToSection } from "./shared";

export default function CourseHero({ course }: { course: Course }) {
  const modules = course.modules?.length ?? 0;
  const topics = course.modules?.reduce((sum, m) => sum + m.topics.length, 0) ?? 0;
  const projects = course.projects?.length ?? 0;

  const stats = [
    { value: modules, label: "Modules" },
    { value: topics, label: "Topics" },
    { value: projects, label: "Projects" },
    { value: course.duration, label: "Duration" },
  ].filter((s) => s.value !== 0);

  return (
    <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#1b1145] via-[#2e1a6b] to-[#5b21b6] p-6 text-white shadow-xl shadow-indigo-900/20 sm:p-9">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-10 h-60 w-60 rounded-full bg-blue-400/20 blur-3xl"
      />

      <div className="relative">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {course.category} · Online Course
        </span>

        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          {course.title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
          {course.description}
        </p>

        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-2xl font-bold leading-none sm:text-3xl">{s.value}</dd>
              <p className="mt-1 text-xs text-white/60">{s.label}</p>
            </div>
          ))}
        </dl>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to={`/enroll/${course.id}`}
            className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-700 shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Enquire Now
          </Link>
          <button
            type="button"
            onClick={() => scrollToSection("video-lessons")}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <PlayCircleIcon className="h-5 w-5" aria-hidden="true" />
            Watch Lessons
          </button>
        </div>
      </div>
    </div>
  );
}