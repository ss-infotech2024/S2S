// Copy into the USER WEBSITE project. Uses the same VITE_API_URL as the admin.
import { useCallback, useEffect, useState } from "react";

export type Category = { id: string; name: string; description: string; position: string };
export type Program = {
  id: string; slug: string; title: string; category: string; image: string; duration: string; mode: string;
  audience: string; trainer: string; fees: string; short: string; description: string; objectives: string[]; topics: string[];
};
export type Company = { id: string; name: string; industry: string; logo: string; website: string; employees_trained: string; testimonial: string };
export type Trainer = { id: string; name: string; designation: string; experience: string; photo: string };
export type CorporateEnquiry = {
  company: string; contact_name: string; phone: string; email?: string; program?: string;
  participants?: number; mode?: string; message?: string;
};

const API = import.meta.env.VITE_API_URL as string;
const get = async <T,>(t: string): Promise<T[]> => {
  const r = await fetch(`${API}/api/${t}`);
  if (!r.ok) throw new Error(`Could not load ${t}`);
  return r.json();
};

/** Categories (in admin order) each with their live programs, plus client companies. Refreshes every minute and on tab focus. */
export function useCorporate(refreshMs = 60000) {
  const [data, setData] = useState<{ categories: (Category & { programs: Program[] })[]; companies: Company[]; trainers: Trainer[] }>({ categories: [], companies: [], trainers: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [c, p, co, t] = await Promise.all([get<Category>("corp_categories"), get<Program>("corporate_programs"), get<Company>("companies"), get<Trainer>("trainers")]);
      const categories = c
        .sort((a, b) => Number(a.position || 999) - Number(b.position || 999))
        .map((x) => ({ ...x, programs: p.filter((y) => y.category === x.name) }));
      setData({ categories, companies: co, trainers: t });
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

/** Call from the Corporate page's enquiry form; it appears in the admin under Corporate Training → Enquiries. */
export async function submitCorporateEnquiry(e: CorporateEnquiry): Promise<void> {
  const r = await fetch(`${API}/api/corp_enquiries`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) });
  if (!r.ok) throw new Error("Could not send enquiry");
}
