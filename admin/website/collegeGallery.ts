// Copy into the USER WEBSITE project. Uses the same VITE_API_URL as the admin.
import { useCallback, useEffect, useState } from "react";

export type Photo = { id: string; college: string; image_url: string; title: string; tag: string };
export type College = {
  id: string; name: string; city: string; type: string; programs: string; students_trained: string;
  since: string; website: string; logo: string; photos: Photo[]; // photos filled in by the hook
};

const API = import.meta.env.VITE_API_URL as string;
const get = async <T,>(t: string): Promise<T[]> => {
  const r = await fetch(`${API}/api/${t}`);
  if (!r.ok) throw new Error(`Could not load ${t}`);
  return r.json();
};

/** Live colleges, each with its live training photos (newest first). Refreshes every minute and on tab focus. */
export function useCollegeGallery(refreshMs = 60000) {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [c, p] = await Promise.all([get<Omit<College, "photos">>("colleges"), get<Photo>("gallery")]);
      setColleges(c.map((x) => ({ ...x, photos: p.filter((y) => y.college === x.name) })));
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

  return { colleges, loading, error, reload: load };
}
