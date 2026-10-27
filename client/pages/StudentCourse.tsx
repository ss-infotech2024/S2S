import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Video } from "lucide-react";
import Layout from "@/components/site/Layout";
import { getCourseById } from "@/data/courses";
import { ApiError, studentFetch, type AssignedCourseDetails } from "@/lib/studentApi";

const dateText = (value: string) =>
  new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

function List({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-700">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export default function StudentCourse() {
  const { courseId = "" } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<AssignedCourseDetails | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    studentFetch<{ course: AssignedCourseDetails }>(
      `/api/student/courses/${encodeURIComponent(courseId)}`,
    )
      .then((data) => active && setCourse(data.course))
      .catch((e) => {
        if (!active) return;
        if (e instanceof ApiError && e.status === 401) {
          navigate("/login", {
            replace: true,
            state: { from: `/student-dashboard/courses/${courseId}` },
          });
        } else if (e instanceof ApiError && (e.status === 403 || e.status === 404)) {
          setError("This course is not assigned to your account.");
        } else {
          setError("Unable to load this course. Please try again.");
        }
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [courseId, navigate]);

  // Fill gaps (modules, image) from the website's course catalogue, matched by slug.
  const catalogue = course ? getCourseById(course.slug) : undefined;
  const modules = course?.modules?.length ? course.modules : catalogue?.modules;
  const image = course?.image || catalogue?.image;

  return (
    <Layout>
      <main className="min-h-[70vh] bg-slate-50">
        <div className="container py-10">
          <Link
            to="/student-dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> My Courses
          </Link>

          {loading && <p className="mt-6 text-slate-500">Loading course...</p>}

          {!loading && error && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <h1 className="text-lg font-semibold">{error}</h1>
              <Link
                to="/student-dashboard"
                className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
              >
                Back to dashboard
              </Link>
            </div>
          )}

          {!loading && course && (
            <div className="mt-6 space-y-6">
              <header className="overflow-hidden rounded-2xl border border-slate-200 bg-white sm:flex">
                {image && (
                  <img src={image} alt="" className="h-48 w-full object-cover sm:h-auto sm:w-72" />
                )}
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {[course.category, course.level, course.duration].filter(Boolean).join(" · ")}
                  </p>
                  <h1 className="mt-1 text-2xl font-bold text-slate-900">{course.title}</h1>
                  {course.description && (
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{course.description}</p>
                  )}
                </div>
              </header>

              {course.batches.length > 0 && (
                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h2 className="text-lg font-bold text-slate-900">My Batch</h2>
                  <div className="mt-3 grid gap-4 md:grid-cols-2">
                    {course.batches.map((batch) => (
                      <div key={batch.id} className="rounded-xl border border-slate-200 p-4 text-sm">
                        <p className="font-semibold text-slate-900">
                          {batch.batch_name} <span className="font-normal text-slate-500">· {batch.mode}</span>
                        </p>
                        <p className="mt-2 flex items-center gap-1.5 text-slate-600">
                          <CalendarDays className="h-4 w-4" />
                          {[batch.start_date && `Starts ${dateText(batch.start_date)}`, batch.days, batch.timing]
                            .filter(Boolean)
                            .join(" · ") || "Schedule to be announced"}
                        </p>
                        {batch.trainer && <p className="mt-1 text-slate-600">Trainer: {batch.trainer}</p>}
                        {batch.center && <p className="mt-1 text-slate-600">Centre: {batch.center}</p>}
                        {batch.meeting_link && (
                          <a
                            href={batch.meeting_link}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 font-semibold text-primary-foreground hover:bg-primary/90"
                          >
                            <Video className="h-4 w-4" /> Join class{batch.platform ? ` (${batch.platform})` : ""}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {modules?.length ? (
                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h2 className="text-lg font-bold text-slate-900">Modules</h2>
                  <ol className="mt-3 space-y-3">
                    {modules.map((module, i) => (
                      <li key={i} className="rounded-xl border border-slate-200 p-4">
                        <p className="font-semibold text-slate-900">
                          Module {i + 1}: {module.title}
                        </p>
                        {module.topics?.length > 0 && (
                          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                            {module.topics.map((topic, j) => (
                              <li key={j}>{topic}</li>
                            ))}
                          </ul>
                        )}
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
          )}
        </div>
      </main>
    </Layout>
  );
}
