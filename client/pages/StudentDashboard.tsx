import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const API = (
  import.meta.env.VITE_API_URL || "http://localhost:8787"
).replace(/\/$/, "");

type Student = {
  studentId: string;
  name: string;
  email: string;
  course: string;
};

export default function StudentDashboard() {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    fetch(`${API}/api/student-auth/me`, {
      credentials: "include",
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.error || "Please log in again.");
        }

        return data;
      })
      .then((data) => {
        if (active) setStudent(data.student);
      })
      .catch(() => {
        if (active) navigate("/login", { replace: true });
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
      await fetch(`${API}/api/student-auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      toast.error("Server se logout confirm nahi ho saka.");
    } finally {
      navigate("/login", { replace: true });
    }
  };

  if (loading) {
    return <div className="p-6">Loading student dashboard...</div>;
  }

  if (!student) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
          <p className="text-sm text-slate-600">
            Welcome, {student.name}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-slate-900 px-4 py-2 text-white"
        >
          Logout
        </button>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">Student ID</p>
          <h2 className="mt-2 text-xl font-semibold">
            {student.studentId}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-slate-500">Registered Email</p>
          <h2 className="mt-2 break-all font-semibold">
            {student.email}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5 sm:col-span-2">
          <p className="text-sm text-slate-500">Enrolled Course</p>
          <h2 className="mt-2 text-xl font-semibold">
            {student.course}
          </h2>
        </div>
      </section>
    </div>
  );
}