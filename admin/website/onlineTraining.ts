// Copy into the USER WEBSITE project (next to courses.ts). Uses the same VITE_API_URL as the admin.
import { useCallback, useEffect, useState } from "react";

export type Trainer = { id: string; name: string; designation: string; experience: string; expertise: string[]; bio: string; photo: string; linkedin: string };
export type Course = { id: string; slug: string; title: string; image: string; category: string; level: string; short: string };
export type OnlineBatch = {
  id: string; course: string; batch_name: string; trainer: string; start_date: string; timing: string;
  duration: string; seats: string; fees: string; highlights: string[]; description: string; language: string;
  certificate: boolean; recordings: boolean; days: string; platform: string; status: string;
  courseInfo?: Course; trainerInfo?: Trainer; // filled in by the hook
};

const API = import.meta.env.VITE_API_URL as string;
const get = async <T,>(t: string): Promise<T[]> => {
  const r = await fetch(`${API}/api/${t}`);
  if (!r.ok) throw new Error(`Could not load ${t}`);
  return r.json();
};

/** Live online batches with their course and trainer attached. Refreshes every minute and when the tab regains focus. */
export function useOnlineTraining(refreshMs = 60000) {
  const [batches, setBatches] = useState<OnlineBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [b, c, t] = await Promise.all([get<OnlineBatch>("online_training"), get<Course>("courses"), get<Trainer>("trainers")]);
      setBatches(
        b.filter((x) => x.status === "upcoming" || x.status === "ongoing")
          .map((x) => ({ ...x, courseInfo: c.find((y) => y.title === x.course), trainerInfo: t.find((y) => y.name === x.trainer) }))
          .sort((p, q) => (p.start_date || "9").localeCompare(q.start_date || "9")),
      );
      setError("");
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, refreshMs);
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => { clearInterval(t); window.removeEventListener("focus", onFocus); };
  }, [load, refreshMs]);

  return { batches, loading, error, reload: load };
}
