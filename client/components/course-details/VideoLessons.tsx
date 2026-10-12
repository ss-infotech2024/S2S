import { useState, useEffect } from "react";
import { PlayIcon, VideoCameraIcon, AcademicCapIcon } from "@heroicons/react/24/outline";
import { PlayIcon as PlaySolid } from "@heroicons/react/24/solid";
import type { Course } from "@/data/courses";
import type { CourseExtras } from "@/data/courseExtras";
import { Card, SectionHeading, SPACING } from "./shared";

interface Lesson {
  kind: "preview" | "module";
  label: string;
  title: string;
  topics: string[];
  youtubeId?: string;
}

const THUMB_GRADIENTS = [
  "from-blue-600 to-indigo-700",
  "from-purple-600 to-fuchsia-700",
  "from-indigo-600 to-blue-800",
  "from-violet-600 to-purple-800",
  "from-sky-600 to-blue-700",
];

function ytSearch(query: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

function buildLessons(course: Course, extras: CourseExtras): Lesson[] {
  const preview: Lesson = {
    kind: "preview",
    label: "Introduction",
    title: "Course Preview",
    topics: course.syllabus.slice(0, 3),
    youtubeId: extras.previewYoutubeId,
  };
  const modules: Lesson[] = (course.modules ?? []).map((m, i) => ({
    kind: "module",
    label: `Module ${i + 1}`,
    title: m.title,
    topics: m.topics,
    youtubeId: extras.videoIds?.[m.title],
  }));
  return [preview, ...modules];
}

export default function VideoLessons({
  course,
  extras,
  selected,
  onSelect,
}: {
  course: Course;
  extras: CourseExtras;
  selected: number;
  onSelect: (index: number) => void;
}) {
  const lessons = buildLessons(course, extras);
  const lesson = lessons[Math.min(selected, lessons.length - 1)];
  const [playing, setPlaying] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);

  // Stop playback whenever a different lesson is picked.
  useEffect(() => {
    setPlaying(false);
    setVideoFailed(false);
  }, [selected]);

  const localVideo =
    lesson.kind === "preview" && course.demoVideo && !videoFailed
      ? course.demoVideo.replace(/^(\.\.\/)+/, "/")
      : undefined;
  const searchUrl = ytSearch(
    lesson.kind === "preview" ? `${course.title} course tutorial` : `${course.title} ${lesson.title} tutorial`,
  );
  const watchUrl = lesson.youtubeId ? `https://www.youtube.com/watch?v=${lesson.youtubeId}` : searchUrl;
  const canEmbed = Boolean(lesson.youtubeId || localVideo);

  const handlePlay = () => {
    if (canEmbed) setPlaying(true);
    else window.open(searchUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className={SPACING.card}>
      <SectionHeading
        icon={<VideoCameraIcon className="h-5 w-5" aria-hidden="true" />}
        title="Video Lessons"
        subtitle="Pick a lesson from the playlist and start learning"
        right={
          <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 sm:inline-flex">
            <PlaySolid className="h-3 w-3" aria-hidden="true" />
            {lessons.length - 1} lessons
          </span>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* Player */}
        <div>
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-900">
            {playing && lesson.youtubeId ? (
              <iframe
                title={`${course.title} — ${lesson.title}`}
                src={`https://www.youtube.com/embed/${lesson.youtubeId}?autoplay=1&rel=0`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : playing && localVideo ? (
              <video
                controls
                autoPlay
                onError={() => {
                  setPlaying(false);
                  setVideoFailed(true);
                }}
                className="absolute inset-0 h-full w-full bg-black"
              >
                <source src={localVideo} type="video/mp4" />
              </video>
            ) : (
              <>
                {course.image && !posterFailed ? (
                  <img
                    src={course.image}
                    alt=""
                    onError={() => setPosterFailed(true)}
                    className="absolute inset-0 h-full w-full object-cover opacity-60"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-purple-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

                <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-red-600 px-2 py-1 text-[11px] font-bold text-white">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                  LIVE ONLINE
                </span>
                <p className="absolute left-4 top-3 max-w-[60%] truncate text-xs font-semibold text-white/90">
                  {course.title}
                </p>

                <button
                  type="button"
                  onClick={handlePlay}
                  aria-label={`Play ${lesson.title}`}
                  className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-indigo-600 shadow-xl transition-transform hover:scale-105 active:scale-95"
                >
                  <PlaySolid className="ml-1 h-7 w-7" aria-hidden="true" />
                </button>

                <div className="absolute bottom-3 left-4 right-4">
                  <p className="text-[11px] font-semibold text-white/70">{lesson.label}</p>
                  <p className="text-lg font-bold text-white">{lesson.title}</p>
                </div>
              </>
            )}
          </div>

          {/* Lesson info */}
          <div className="mt-4 rounded-2xl border border-slate-200 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <AcademicCapIcon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h4 className="truncate text-sm font-bold text-[#171034]">{lesson.title}</h4>
                  <p className="text-xs text-slate-500">
                    {lesson.kind === "preview" ? "Overview of the course" : `${lesson.topics.length} topics covered`}
                  </p>
                </div>
              </div>
              <a
                href={watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700"
              >
                <PlaySolid className="h-3.5 w-3.5" aria-hidden="true" />
                Watch on YouTube
              </a>
            </div>
            {lesson.topics.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {lesson.topics.map((t) => (
                  <span
                    key={t}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Playlist */}
        <div className="rounded-2xl border border-slate-200 p-3">
          <div className="flex items-center justify-between px-2 pb-3 pt-1">
            <h4 className="text-sm font-bold text-[#171034]">Course Playlist</h4>
            <span className="text-xs text-slate-400">{lessons.length} videos</span>
          </div>
          <ul className="space-y-2" role="listbox" aria-label="Course playlist">
            {lessons.map((l, i) => {
              const isActive = i === selected;
              return (
                <li key={l.label + l.title}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => onSelect(i)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-2 text-left transition-colors ${
                      isActive
                        ? "border-blue-300 bg-blue-50/60"
                        : "border-transparent hover:border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`flex h-12 w-[72px] shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${
                        THUMB_GRADIENTS[i % THUMB_GRADIENTS.length]
                      } text-white`}
                    >
                      <PlayIcon className="h-5 w-5 opacity-90" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[11px] font-semibold text-indigo-500">{l.label}</span>
                      <span className="block truncate text-sm font-semibold text-[#171034]">{l.title}</span>
                      <span className="block text-[11px] text-slate-400">
                        {l.kind === "preview" ? "Intro" : `${l.topics.length} topics`}
                      </span>
                    </span>
                    {isActive && <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600" aria-hidden="true" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Card>
  );
}