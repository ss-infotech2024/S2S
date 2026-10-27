import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft, Award, CalendarDays, CheckCircle2, Circle, ClipboardList, Download,
  ExternalLink, FileText, Loader2, PlayCircle, Video,
} from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { getCourseById } from "@/data/courses";
import { cn } from "@/lib/utils";
import {
  ApiError, certificatePdfUrl, fileToBase64, studentFetch, studentFileUrl,
  type AssignedCourseDetails, type Assignment, type CertificateInfo, type CompletionStatus, type Lesson,
} from "@/lib/studentApi";

const dateText = (value: string) =>
  new Date(value.length === 10 ? `${value}T00:00:00` : value).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

type Tab = "learn" | "assignments" | "certificate" | "about";

/** YouTube / Vimeo links become embeds, direct video files play inline, anything else opens in a new tab. */
function VideoPlayer({ url, title }: { url: string; title: string }) {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  const src = yt ? `https://www.youtube-nocookie.com/embed/${yt[1]}` : vimeo ? `https://player.vimeo.com/video/${vimeo[1]}` : "";
  if (src) {
    return (
      <div className="aspect-video overflow-hidden rounded-xl bg-black">
        <iframe src={src} title={title} className="h-full w-full" allow="accelerometer; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
      </div>
    );
  }
  if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) {
    return <video src={url} controls className="aspect-video w-full rounded-xl bg-black" />;
  }
  return (
    <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
      <Video className="h-4 w-4" /> Watch video <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}

function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-violet-100", className)} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-all" style={{ width: `${value}%` }} />
    </div>
  );
}

export default function StudentCourse() {
  const { courseId = "" } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [course, setCourse] = useState<AssignedCourseDetails | null>(null);
  const [completion, setCompletion] = useState<CompletionStatus | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const tab = (params.get("tab") as Tab) || "learn";
  const setTab = (next: Tab) => setParams((p) => { p.set("tab", next); return p; }, { replace: true });

  const handleError = useCallback((e: unknown, fallback: string) => {
    if (e instanceof ApiError && e.status === 401) {
      navigate("/login", { replace: true, state: { from: `/student-dashboard/courses/${courseId}` } });
    } else if (e instanceof ApiError && (e.status === 403 || e.status === 404)) {
      setError("This course is not assigned to your account.");
    } else {
      setError(fallback);
    }
  }, [courseId, navigate]);
  const onAuthError = useCallback((e: unknown) => handleError(e, ""), [handleError]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    studentFetch<{ course: AssignedCourseDetails }>(`/api/student/courses/${encodeURIComponent(courseId)}`)
      .then((data) => {
        if (!active) return;
        setCourse(data.course);
        setCompletion(data.course.completion);
      })
      .catch((e) => active && handleError(e, "Unable to load this course. Please try again."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [courseId, handleError]);

  const lessons = useMemo(() => course?.curriculum.flatMap((m) => m.lessons) ?? [], [course]);
  const done = useMemo(() => new Set(completion?.completedLessonIds ?? []), [completion]);
  // Resume: the lesson in the URL, else the first lesson not yet completed.
  const current: Lesson | undefined =
    lessons.find((l) => l.id === params.get("lesson")) ?? lessons.find((l) => !done.has(l.id)) ?? lessons[0];
  const currentIndex = current ? lessons.indexOf(current) : -1;

  const openLesson = (id: string) => {
    setParams((p) => { p.set("lesson", id); p.set("tab", "learn"); return p; }, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleComplete = async (lesson: Lesson) => {
    setSaving(true);
    try {
      const status = await studentFetch<CompletionStatus>(
        `/api/student/courses/${encodeURIComponent(courseId)}/lessons/${encodeURIComponent(lesson.id)}/complete`,
        { method: done.has(lesson.id) ? "DELETE" : "POST" },
      );
      setCompletion(status);
      if (!done.has(lesson.id)) {
        toast.success("Lesson marked as complete");
        const next = lessons[currentIndex + 1];
        if (next) openLesson(next.id);
      }
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) onAuthError(e);
      else toast.error(e instanceof Error ? e.message : "Could not save your progress.");
    } finally {
      setSaving(false);
    }
  };

  const catalogue = course ? getCourseById(course.slug) : undefined;
  const image = course?.image || catalogue?.image;

  return (
    <Layout>
      <main className="min-h-[70vh] bg-gradient-to-b from-violet-50/70 to-slate-50">
        <div className="container py-8">
          <Link to="/student-dashboard" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> My Courses
          </Link>

          {loading && <p className="mt-6 flex items-center gap-2 text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading course...</p>}

          {!loading && error && (
            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 text-center">
              <h1 className="text-lg font-semibold">{error}</h1>
              <Link to="/student-dashboard" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">Back to dashboard</Link>
            </div>
          )}

          {!loading && course && completion && (
            <>
              <header className="mt-5 overflow-hidden rounded-xl border border-violet-100 bg-white shadow-sm sm:flex">
                {image && <img src={image} alt="" className="h-40 w-full object-cover sm:h-auto sm:w-60" />}
                <div className="flex-1 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {[course.category, course.level, course.duration].filter(Boolean).join(" · ")}
                  </p>
                  <h1 className="mt-1 text-2xl font-bold text-slate-900">{course.title}</h1>
                  <div className="mt-4 max-w-md">
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium text-slate-700">Your progress</span>
                      <span className="font-semibold text-primary">{completion.progress}%</span>
                    </div>
                    <ProgressBar value={completion.progress} />
                    <p className="mt-1 text-xs text-slate-500">
                      {completion.completedLessonIds.length} of {completion.totalLessons} lessons completed
                    </p>
                  </div>
                </div>
              </header>

              <nav className="mt-6 flex gap-1 overflow-x-auto rounded-xl bg-white p-1 shadow-sm" role="tablist" aria-label="Course sections">
                {([
                  ["learn", "Lessons", PlayCircle],
                  ["assignments", "Assignments", ClipboardList],
                  ["certificate", "Certificate", Award],
                  ["about", "About", FileText],
                ] as const).map(([key, label, Icon]) => (
                  <button
                    key={key}
                    role="tab"
                    aria-selected={tab === key}
                    onClick={() => setTab(key)}
                    className={cn(
                      "flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition",
                      tab === key ? "bg-primary text-primary-foreground" : "text-slate-600 hover:bg-violet-50",
                    )}
                  >
                    <Icon className="h-4 w-4" /> {label}
                  </button>
                ))}
              </nav>

              <div className="mt-6">
                {tab === "learn" && (
                  lessons.length === 0 ? (
                    <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
                      <PlayCircle className="mx-auto h-8 w-8 text-slate-400" />
                      <h2 className="mt-3 text-lg font-semibold">Lessons are not published yet</h2>
                      <p className="mt-1 text-sm text-slate-500">Your trainer will publish the learning content here. Check the About tab for the course outline.</p>
                    </div>
                  ) : (
                    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
                      <aside className="h-fit rounded-xl border border-slate-200 bg-white p-3 lg:sticky lg:top-28">
                        {course.curriculum.map((module, mi) => (
                          <div key={module.id} className="mb-2">
                            <p className="px-2 pb-1 pt-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                              Module {mi + 1} · {module.title}
                            </p>
                            {module.lessons.map((lesson) => (
                              <button
                                key={lesson.id}
                                onClick={() => openLesson(lesson.id)}
                                className={cn(
                                  "flex w-full items-start gap-2 rounded-lg px-2 py-2 text-left text-sm transition",
                                  current?.id === lesson.id ? "bg-violet-100 font-semibold text-violet-900" : "text-slate-700 hover:bg-violet-50",
                                )}
                              >
                                {done.has(lesson.id)
                                  ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" aria-label="Completed" />
                                  : <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" aria-label="Not completed" />}
                                <span>{lesson.title}{lesson.duration && <span className="ml-1 font-normal text-slate-400">· {lesson.duration}</span>}</span>
                              </button>
                            ))}
                          </div>
                        ))}
                      </aside>

                      {current && (
                        <article className="min-w-0 space-y-5 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-violet-500">
                              Lesson {currentIndex + 1} of {lessons.length}{!current.required && " · Optional"}
                            </p>
                            <h2 className="mt-1 text-xl font-bold text-slate-900">{current.title}</h2>
                            {current.description && <p className="mt-2 text-sm text-slate-600">{current.description}</p>}
                          </div>

                          {current.video_url && <VideoPlayer url={current.video_url} title={current.title} />}

                          {current.body && (
                            <div className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-800">{current.body}</div>
                          )}

                          {current.resources.length > 0 && (
                            <section>
                              <h3 className="mb-2 text-sm font-bold text-slate-900">Resources</h3>
                              <ul className="grid gap-2 sm:grid-cols-2">
                                {current.resources.map((r) => (
                                  <li key={r.id}>
                                    <a
                                      href={r.kind === "file" ? studentFileUrl(r.file_id) : r.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 hover:border-violet-300 hover:bg-violet-50"
                                    >
                                      {r.kind === "file" ? <Download className="h-4 w-4 text-primary" /> : <ExternalLink className="h-4 w-4 text-primary" />}
                                      <span className="truncate">{r.title || (r.kind === "file" ? r.file_name : r.url)}</span>
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </section>
                          )}

                          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                            <Button variant="outline" disabled={currentIndex <= 0} onClick={() => openLesson(lessons[currentIndex - 1].id)}>
                              Previous
                            </Button>
                            <Button onClick={() => void toggleComplete(current)} disabled={saving} variant={done.has(current.id) ? "outline" : "default"}>
                              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                              {done.has(current.id) ? "Completed · Undo" : "Mark as complete"}
                            </Button>
                            <Button variant="outline" disabled={currentIndex >= lessons.length - 1} onClick={() => openLesson(lessons[currentIndex + 1].id)}>
                              Next
                            </Button>
                          </div>
                        </article>
                      )}
                    </div>
                  )
                )}

                {tab === "assignments" && <AssignmentsPanel courseId={courseId} onAuthError={onAuthError} onChange={setCompletion} />}

                {tab === "certificate" && (
                  <CertificatePanel courseId={courseId} initial={course.certificate} completion={completion} onAuthError={onAuthError} />
                )}

                {tab === "about" && <AboutPanel course={course} />}
              </div>
            </>
          )}
        </div>
      </main>
    </Layout>
  );
}

function AssignmentsPanel({ courseId, onAuthError, onChange }: {
  courseId: string; onAuthError: (e: unknown) => void; onChange: (s: CompletionStatus) => void;
}) {
  const [items, setItems] = useState<Assignment[] | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    studentFetch<{ assignments: Assignment[] }>(`/api/student/courses/${encodeURIComponent(courseId)}/assignments`)
      .then((d) => setItems(d.assignments))
      .catch((e) => (e instanceof ApiError && e.status === 401 ? onAuthError(e) : setError("Unable to load assignments.")));
  }, [courseId, onAuthError]);
  useEffect(load, [load]);

  const refreshCompletion = () =>
    studentFetch<CompletionStatus>(`/api/student/courses/${encodeURIComponent(courseId)}/certificate`).then(onChange).catch(() => {});

  if (error) return <p className="rounded-xl border border-red-200 bg-white p-4 text-red-700">{error}</p>;
  if (!items) return <p className="flex items-center gap-2 text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading assignments...</p>;
  if (!items.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
        <ClipboardList className="mx-auto h-8 w-8 text-slate-400" />
        <h2 className="mt-3 text-lg font-semibold">No assignments yet</h2>
        <p className="mt-1 text-sm text-slate-500">Assignments for this course will appear here.</p>
      </div>
    );
  }

  const pending = items.filter((a) => !a.submission).length;
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">{pending ? `${pending} pending · ` : ""}{items.length - pending} submitted</p>
      {items.map((a) => (
        <AssignmentCard
          key={a.id}
          courseId={courseId}
          assignment={a}
          onSaved={(next) => { setItems((list) => list!.map((x) => (x.id === next.id ? next : x))); void refreshCompletion(); }}
          onAuthError={onAuthError}
        />
      ))}
    </div>
  );
}

function AssignmentCard({ courseId, assignment: a, onSaved, onAuthError }: {
  courseId: string; assignment: Assignment; onSaved: (a: Assignment) => void; onAuthError: (e: unknown) => void;
}) {
  const s = a.submission;
  const [editing, setEditing] = useState(!s);
  const [text, setText] = useState(s?.text ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const overdue = a.due_date && !s && new Date(`${a.due_date}T23:59:59`) < new Date();
  const status = s?.status === "evaluated" ? (s.marks !== undefined ? "Evaluated" : "Under review") : s ? "Submitted" : overdue ? "Overdue" : "Pending";

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!text.trim() && !file && !s?.file) return setError(a.allow_file ? "Write an answer or attach a file." : "Write your answer first.");
    setBusy(true);
    try {
      const body: Record<string, unknown> = { text };
      if (file) body.file = { name: file.name, data: await fileToBase64(file) };
      else if (s?.file) body.keepFile = true;
      const res = await studentFetch<{ assignment: Assignment }>(
        `/api/student/courses/${encodeURIComponent(courseId)}/assignments/${encodeURIComponent(a.id)}/submission`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) },
      );
      toast.success("Assignment submitted");
      setEditing(false);
      setFile(null);
      onSaved(res.assignment);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) onAuthError(err);
      else setError(err instanceof Error ? err.message : "Could not submit. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {a.title} {a.is_final && <span className="ml-1 rounded-full bg-fuchsia-100 px-2 py-0.5 text-xs font-semibold text-fuchsia-700">Final assessment</span>}
          </h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            {a.due_date && <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> Due {dateText(a.due_date)}</span>}
            {a.max_marks > 0 && <span>Max marks {a.max_marks}{a.pass_marks ? ` · Pass ${a.pass_marks}` : ""}</span>}
            {a.required && <span>Required for certificate</span>}
          </p>
        </div>
        <span className={cn("rounded-full px-3 py-1 text-xs font-semibold",
          status === "Evaluated" ? "bg-green-100 text-green-700" : status === "Submitted" || status === "Under review" ? "bg-violet-100 text-violet-700" : status === "Overdue" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700")}>
          {status}
        </span>
      </div>

      {a.instructions && <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{a.instructions}</p>}

      {s?.marks !== undefined && (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm">
          <p className="font-semibold text-green-800">Marks: {s.marks}{a.max_marks ? ` / ${a.max_marks}` : ""}</p>
          {s.feedback && <p className="mt-1 whitespace-pre-wrap text-green-900">{s.feedback}</p>}
        </div>
      )}

      {s && !editing && (
        <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Your submission · {dateText(s.submitted_at)}{s.late && " · Late"}
          </p>
          {s.text && <p className="mt-2 whitespace-pre-wrap text-slate-800">{s.text}</p>}
          {s.file && (
            <a href={studentFileUrl(s.file.id)} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
              <Download className="h-4 w-4" /> {s.file.name}
            </a>
          )}
          {s.status !== "evaluated" && (
            <button onClick={() => setEditing(true)} className="mt-3 block text-sm font-semibold text-primary hover:underline">Edit submission</button>
          )}
        </div>
      )}

      {editing && s?.status !== "evaluated" && (
        <form onSubmit={submit} className="mt-4 space-y-3">
          {a.allow_text && (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              placeholder="Write your answer"
              className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          )}
          {a.allow_file && (
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Attachment {s?.file && !file && <span className="font-normal text-slate-500">(current: {s.file.name})</span>}</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.png,.jpg,.jpeg"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="mt-1 block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-violet-100 file:px-3 file:py-2 file:font-semibold file:text-violet-800"
              />
              <span className="mt-1 block text-xs text-slate-500">PDF, Office, text, ZIP or image files.</span>
            </label>
          )}
          {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit" disabled={busy}>
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{busy ? "Submitting..." : s ? "Update submission" : "Submit assignment"}
            </Button>
            {s && <Button type="button" variant="outline" onClick={() => setEditing(false)} disabled={busy}>Cancel</Button>}
          </div>
        </form>
      )}
    </article>
  );
}

function CertificatePanel({ courseId, initial, completion, onAuthError }: {
  courseId: string; initial: CertificateInfo | null; completion: CompletionStatus; onAuthError: (e: unknown) => void;
}) {
  const [status, setStatus] = useState<CompletionStatus>(completion);
  const [cert, setCert] = useState<CertificateInfo | null>(initial);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    studentFetch<CompletionStatus & { certificate: CertificateInfo | null }>(`/api/student/courses/${encodeURIComponent(courseId)}/certificate`)
      .then((d) => { setStatus(d); setCert(d.certificate); })
      .catch((e) => e instanceof ApiError && e.status === 401 && onAuthError(e));
  }, [courseId, onAuthError]);

  const request = async () => {
    setBusy(true);
    try {
      const d = await studentFetch<CompletionStatus & { certificate: CertificateInfo }>(
        `/api/student/courses/${encodeURIComponent(courseId)}/certificate`, { method: "POST" },
      );
      setStatus(d);
      setCert(d.certificate);
      toast.success(d.certificate.status === "issued" ? "Your certificate is ready" : "Certificate requested — awaiting approval");
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) onAuthError(e);
      else toast.error(e instanceof Error ? e.message : "Could not request the certificate.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-900">Completion requirements</h2>
        {status.requirements.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">Completion requirements for this course have not been set up yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {status.requirements.map((r) => (
              <li key={r.key} className="flex items-start gap-2 text-sm">
                {r.met ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" /> : <Circle className="mt-0.5 h-5 w-5 shrink-0 text-slate-300" />}
                <span className={r.met ? "text-slate-700" : "text-slate-600"}>{r.label}</span>
              </li>
            ))}
            {status.requiresApproval && (
              <li className="flex items-start gap-2 text-sm text-slate-600">
                <Circle className="mt-0.5 h-5 w-5 shrink-0 text-slate-300" /> Final approval by the institute
              </li>
            )}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-violet-100 bg-gradient-to-br from-violet-600 to-fuchsia-600 p-5 text-white shadow-lg">
        <Award className="h-9 w-9" />
        <h2 className="mt-3 text-xl font-bold">Certificate</h2>
        {cert?.status === "issued" ? (
          <>
            <p className="mt-2 text-sm text-white/85">Issued {cert.issued_at && dateText(cert.issued_at)} · ID {cert.certificate_id}</p>
            <a href={certificatePdfUrl(cert.certificate_id)} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 font-semibold text-violet-800 hover:bg-violet-50">
              <Download className="h-4 w-4" /> Download Certificate (PDF)
            </a>
            <Link to={`/verify-certificate/${cert.certificate_id}`} className="mt-3 block text-center text-sm text-white/85 underline">
              Public verification page
            </Link>
          </>
        ) : cert?.status === "pending_approval" ? (
          <p className="mt-2 text-sm text-white/90">You have completed the requirements. Your certificate is awaiting approval from the institute.</p>
        ) : status.eligible ? (
          <>
            <p className="mt-2 text-sm text-white/90">Congratulations! You have completed all requirements.</p>
            <button onClick={() => void request()} disabled={busy} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 font-semibold text-violet-800 hover:bg-violet-50 disabled:opacity-60">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} {status.requiresApproval ? "Request certificate" : "Get my certificate"}
            </button>
          </>
        ) : (
          <p className="mt-2 text-sm text-white/90">Complete the requirements on the left to unlock your certificate.</p>
        )}
      </section>
    </div>
  );
}

function AboutPanel({ course }: { course: AssignedCourseDetails }) {
  const catalogue = getCourseById(course.slug);
  const outline = course.modules?.length ? course.modules : catalogue?.modules;
  const List = ({ title, items }: { title: string; items?: string[] }) =>
    items?.length ? (
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-700">{items.map((x, i) => <li key={i}>{x}</li>)}</ul>
      </section>
    ) : null;

  return (
    <div className="space-y-6">
      {course.description && (
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-900">About this course</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{course.description}</p>
        </section>
      )}

      {course.batches.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-900">My Batch</h2>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            {course.batches.map((batch) => (
              <div key={batch.id} className="rounded-xl border border-slate-200 p-4 text-sm">
                <p className="font-semibold text-slate-900">{batch.batch_name} <span className="font-normal text-slate-500">· {batch.mode}</span></p>
                <p className="mt-2 flex items-center gap-1.5 text-slate-600">
                  <CalendarDays className="h-4 w-4" />
                  {[batch.start_date && `Starts ${dateText(batch.start_date)}`, batch.days, batch.timing].filter(Boolean).join(" · ") || "Schedule to be announced"}
                </p>
                {batch.trainer && <p className="mt-1 text-slate-600">Trainer: {batch.trainer}</p>}
                {batch.center && <p className="mt-1 text-slate-600">Centre: {batch.center}</p>}
                {batch.meeting_link && (
                  <a href={batch.meeting_link} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 font-semibold text-primary-foreground hover:bg-primary/90">
                    <Video className="h-4 w-4" /> Join class{batch.platform ? ` (${batch.platform})` : ""}
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {outline?.length ? (
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-900">Course outline</h2>
          <ol className="mt-3 space-y-3">
            {outline.map((m, i) => (
              <li key={i} className="rounded-xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-900">Module {i + 1}: {m.title}</p>
                {m.topics?.length > 0 && <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">{m.topics.map((t, j) => <li key={j}>{t}</li>)}</ul>}
              </li>
            ))}
          </ol>
        </section>
      ) : (
        <List title="Syllabus" items={course.syllabus} />
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <List title="Projects" items={course.projects} />
        <List title="Outcomes" items={course.outcomes} />
      </div>
    </div>
  );
}
