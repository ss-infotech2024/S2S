
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/site/Layout";

type SavedEnrollment = {
  id: string;
  trackingToken: string;
  course?: string;
  batch?: string;
  created_at?: string;
};

type EnrollmentStatus = SavedEnrollment & {
  status: string;
};

const API_URL = (import.meta.env.VITE_ADMIN_API_URL || "").replace(/\/$/, "");

export default function MyEnrollments() {
  const [enrollments, setEnrollments] = useState<EnrollmentStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadEnrollments() {
      try {
        const saved: unknown = JSON.parse(
          localStorage.getItem("s2s_my_enrollments") || "[]"
        );

        if (!Array.isArray(saved)) {
          throw new Error("Saved enrollment data is invalid.");
        }

        const results = await Promise.all(
          (saved as SavedEnrollment[]).map(async (item) => {
            const response = await fetch(`${API_URL}/api/enrollments/status`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: item.id,
                trackingToken: item.trackingToken,
              }),
            });

            if (!response.ok) {
              return {
                ...item,
                status: response.status === 404 ? "unavailable" : "error",
              };
            }

            const data = await response.json();
            return { ...item, ...data };
          })
        );

        if (!cancelled) setEnrollments(results);
      } catch {
        if (!cancelled) {
          setError("Unable to load enrollments. Please check your connection and try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadEnrollments();

    return () => {
      cancelled = true;
    };
  }, []);

  const statusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <Layout>
      <main className="mx-auto min-h-[70vh] max-w-5xl px-4 py-12 sm:px-6">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
            Student Portal
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            My Enrollments
          </h1>
          <p className="mt-2 text-slate-500">
            Track your course enrollment requests and their latest status.
          </p>
        </div>

        {loading && <p className="text-slate-500">Loading enrollments...</p>}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 p-4 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && enrollments.length === 0 && (
          <div className="rounded-2xl border border-slate-200 p-8 text-center dark:border-slate-700">
            <h2 className="text-xl font-semibold">No enrollments found</h2>
            <p className="mt-2 text-slate-500">
              Your enrollments will appear here after you submit a course application on this browser.
            </p>
            <Link
              to="/courses"
              className="mt-5 inline-block rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              Explore Courses
            </Link>
          </div>
        )}

        {!loading && !error && enrollments.length > 0 && (
          <div className="grid gap-5">
            {enrollments.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Enrollment Reference
                    </p>
                    <p className="mt-1 break-all font-mono text-sm font-semibold">
                      {item.id}
                    </p>
                    <h2 className="mt-3 text-lg font-bold">
                      {item.course || "Course enrollment"}
                    </h2>
                    {item.batch && (
                      <p className="mt-1 text-sm text-slate-500">
                        Batch: {item.batch}
                      </p>
                    )}
                    {item.created_at && (
                      <p className="mt-1 text-sm text-slate-500">
                        Applied: {new Date(item.created_at).toLocaleDateString("en-IN")}
                      </p>
                    )}
                  </div>

                  <span
                    className={`rounded-full px-3 py-1.5 text-sm font-semibold ${statusStyle(item.status)}`}
                  >
                    {item.status === "unavailable"
                      ? "Unable to verify"
                      : item.status === "error"
                      ? "Check connection"
                      : item.status}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </Layout>
  );
}
