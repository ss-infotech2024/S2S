import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, LogOut } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/site/Layout";
import { getCourseById } from "@/data/courses";
import {
  ApiError,
  logoutStudent,
  studentFetch,
  type AssignedCourse,
  type StudentProfile,
} from "@/lib/studentApi";

export default function StudentDashboard() {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [courses, setCourses] = useState<AssignedCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    Promise.all([
      studentFetch<{ student: StudentProfile }>("/api/student-auth/me"),
      studentFetch<{ courses: AssignedCourse[] }>("/api/student/courses"),
    ])
      .then(([me, assigned]) => {
        if (!active) return;
        setStudent(me.student);
        setCourses(assigned.courses);
      })
      .catch((e) => {
        if (!active) return;
        if (e instanceof ApiError && e.status === 401) {
          navigate("/login", { replace: true, state: { from: "/student-dashboard" } });
        } else {
          setError("Unable to load your dashboard. Please try again.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logoutStudent();
    } catch {
      toast.error("Could not confirm logout with the server.");
    } finally {
      navigate("/", { replace: true });
    }
  };

  return (
    <Layout>
      <main className="min-h-[70vh] bg-slate-50">
        <div className="container py-10">
          {loading && <p className="text-slate-500">Loading student dashboard...</p>}

          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-white p-4 text-red-700">
              {error}
            </div>
          )}

          {!loading && student && (
            <>
              <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-primary">
                    Student Dashboard
                  </p>
                  <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                    Welcome, {student.name}
                  </h1>
                  <p className="mt-1 text-sm text-slate-600">
                    Student ID {student.studentId} · {student.email}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </header>

              <section id="my-courses" aria-labelledby="my-courses-heading">
                <h2 id="my-courses-heading" className="mb-4 text-xl font-bold text-slate-900">
                  My Courses
                </h2>

                {courses.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                    <BookOpen className="mx-auto h-8 w-8 text-slate-400" />
                    <h3 className="mt-3 text-lg font-semibold">No courses assigned yet</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Your courses will appear here once the institute assigns them to your
                      account. Meanwhile you can browse what we offer.
                    </p>
                    <Link
                      to="/courses"
                      className="mt-5 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                    >
                      Explore Courses
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => {
                      const image = course.image || getCourseById(course.slug)?.image;
                      const summary = course.short || course.description;
                      return (
                        <Link
                          key={course.id}
                          to={`/student-dashboard/courses/${encodeURIComponent(course.id)}`}
                          className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                          <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-violet-100 to-fuchsia-100">
                            {image ? (
                              <img src={image} alt="" loading="lazy" className="h-full w-full object-cover" />
                            ) : (
                              <BookOpen className="h-10 w-10 text-violet-400" />
                            )}
                          </div>
                          <div className="p-5">
                            {(course.category || course.level) && (
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                {[course.category, course.level].filter(Boolean).join(" · ")}
                              </p>
                            )}
                            <h3 className="mt-1 text-lg font-bold text-slate-900 group-hover:text-primary">
                              {course.title}
                            </h3>
                            {summary && (
                              <p className="mt-2 line-clamp-3 text-sm text-slate-600">{summary}</p>
                            )}
                            {course.totalLessons ? (
                              <div className="mt-4">
                                <div className="mb-1 flex justify-between text-xs text-slate-500">
                                  <span>{course.progress ? "In progress" : "Not started"}</span>
                                  <span className="font-semibold text-primary">{course.progress ?? 0}%</span>
                                </div>
                                <div className="h-1.5 overflow-hidden rounded-full bg-violet-100">
                                  <div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500" style={{ width: `${course.progress ?? 0}%` }} />
                                </div>
                              </div>
                            ) : null}
                            <span className="mt-4 inline-block text-sm font-semibold text-primary">
                              {course.progress ? "Continue learning →" : "Open course →"}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </Layout>
  );
}
