// Copy into the USER WEBSITE project. Uses the same VITE_API_URL as the admin.
import { useCallback, useEffect, useState } from "react";

export type Location = { id: string; name: string; city: string; address: string; phone: string; map_link: string; photo: string };
export type Trainer = { id: string; name: string; designation: string; experience: string; expertise: string[]; photo: string };
export type Course = { id: string; slug: string; title: string; image: string; category: string; level: string; short: string };
export type ClassroomBatch = {
  id: string; course: string; batch_name: string; trainer: string; center: string; batch: "Weekday" | "Weekend";
  days: string; start_date: string; timing: string; duration: string; seats: string; seats_filled: string; fees: string;
  highlights: string[]; description: string; certificate: boolean; placement_support: boolean; status: string;
  courseInfo?: Course; trainerInfo?: Trainer; locationInfo?: Location; seatsLeft: number; // filled in by the hook
};

const API = import.meta.env.VITE_API_URL as string;
const get = async <T,>(t: string): Promise<T[]> => {
  const r = await fetch(`${API}/api/${t}`);
  if (!r.ok) throw new Error(`Could not load ${t}`);
  return r.json();
};

/** Live upcoming/ongoing classroom batches with course, trainer, location and seats left. Refreshes every minute and on tab focus. */
export function useClassroomTraining(refreshMs = 60000) {
  const [batches, setBatches] = useState<ClassroomBatch[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [b, c, t, l] = await Promise.all([get<ClassroomBatch>("classroom_training"), get<Course>("courses"), get<Trainer>("trainers"), get<Location>("locations")]);
      setLocations(l);
      setBatches(
        b.filter((x) => x.status === "upcoming" || x.status === "ongoing")
          .map((x) => ({
            ...x,
            courseInfo: c.find((y) => y.title === x.course),
            trainerInfo: t.find((y) => y.name === x.trainer),
            locationInfo: l.find((y) => y.name === x.center),
            seatsLeft: Math.max(0, Number(x.seats || 0) - Number(x.seats_filled || 0)),
          }))
          .sort((p, q) => (p.start_date || "9").localeCompare(q.start_date || "9")),
      );
      setError("");
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, refreshMs);
    window.addEventListener("focus", load);
    return () => { clearInterval(t); window.removeEventListener("focus", load); };
  }, [load, refreshMs]);

  return {
    batches, locations, loading, error, reload: load,
    weekday: batches.filter((b) => b.batch === "Weekday"),
    weekend: batches.filter((b) => b.batch === "Weekend"),
  };
}

/** Enrol from the website; the student appears in the admin under Students / Users as "pending". */
export async function enrollInBatch(student: { name: string; phone: string; email?: string; city?: string; qualification?: string; message?: string }, batch: ClassroomBatch): Promise<void> {
  const body = {
    ...student, enrollment_id: `SS-${Math.floor(100000 + Math.random() * 900000)}`,
    course: batch.course, mode: "Classroom", batch: batch.batch,
  };
  const r = await fetch(`${API}/api/enrollments`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error("Could not submit enrolment");
}
