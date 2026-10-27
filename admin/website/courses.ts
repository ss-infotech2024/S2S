// Copy into the USER WEBSITE project. Set VITE_API_URL there to the same API the admin uses.
import { useEffect, useState } from "react";

export type Course = {
  id: string; slug: string; title: string; image: string; category: string; level: string;
  duration: string; fees: string; short: string; description: string;
  syllabus: string[]; outcomes: string[]; projects: string[]; prerequisites: string[]; schedule: string;
};

const API = import.meta.env.VITE_API_URL as string;

export async function fetchCourses(): Promise<Course[]> {
  const r = await fetch(`${API}/api/courses`); // server returns only courses marked Live
  if (!r.ok) throw new Error("Could not load courses");
  return r.json();
}

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    fetchCourses().then(setCourses).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);
  return { courses, loading, error };
}
