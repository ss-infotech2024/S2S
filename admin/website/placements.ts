// Copy into the USER WEBSITE project. Uses the same VITE_API_URL as the admin.
import { useCallback, useEffect, useState } from "react";

export type Story = { id: string; name: string; company: string; role: string; package: string; course: string; year: string; testimonial: string; photo_url: string };
export type HiringCompany = { id: string; name: string; logo: string; industry: string; students_placed: string; position: string; website: string };
export type Stat = { id: string; label: string; value: string; note: string; position: string };
export type Job = {
  id: string; title: string; company: string; location: string; type: string; experience: string; salary: string;
  skills: string[]; description: string; apply_link: string; last_date: string; status: string;
  companyInfo?: HiringCompany; // filled in by the hook
};

const API = import.meta.env.VITE_API_URL as string;
const get = async <T,>(t: string): Promise<T[]> => {
  const r = await fetch(`${API}/api/${t}`);
  if (!r.ok) throw new Error(`Could not load ${t}`);
  return r.json();
};
const byOrder = <T extends { position?: string }>(a: T, b: T) => Number(a.position || 999) - Number(b.position || 999);

/** Everything the Placements page needs. Refreshes every minute and on tab focus. */
export function usePlacements(refreshMs = 60000) {
  const [data, setData] = useState<{ stories: Story[]; companies: HiringCompany[]; stats: Stat[]; jobs: Job[] }>({ stories: [], companies: [], stats: [], jobs: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [stories, companies, stats, jobs] = await Promise.all([get<Story>("placements"), get<HiringCompany>("placement_companies"), get<Stat>("placement_stats"), get<Job>("jobs")]);
      const today = new Date().toISOString().slice(0, 10);
      setData({
        stories,
        companies: companies.sort(byOrder),
        stats: stats.sort(byOrder),
        // only open jobs whose last date has not passed
        jobs: jobs.filter((j) => j.status === "open" && (!j.last_date || j.last_date >= today)).map((j) => ({ ...j, companyInfo: companies.find((c) => c.name === j.company) })),
      });
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

  return { ...data, loading, error, reload: load };
}
