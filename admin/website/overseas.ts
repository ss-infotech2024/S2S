// Copy into the USER WEBSITE project. Uses the same VITE_API_URL as the admin.
import { useCallback, useEffect, useState } from "react";

export type Program = {
  id: string; title: string; country: string; institution: string; level: string; duration: string; fees: string;
  intake: string; language_req: string; eligibility: string[]; highlights: string[]; description: string; image: string;
};
export type Country = {
  id: string; name: string; position: string; tagline: string; overview: string; why_study: string[];
  top_universities: string[]; intakes: string; cost_of_living: string; visa_info: string; image: string;
};
export type Language = {
  id: string; name: string; level: string; exam: string; duration: string; fees: string; mode: string;
  syllabus: string[]; description: string; image: string;
};
export type OverseasEnquiry = {
  name: string; phone: string; email?: string; interest?: "Study abroad" | "Language training" | "Both";
  country?: string; program?: string; qualification?: string; message?: string;
};

const API = import.meta.env.VITE_API_URL as string;
const get = async <T,>(t: string): Promise<T[]> => {
  const r = await fetch(`${API}/api/${t}`);
  if (!r.ok) throw new Error(`Could not load ${t}`);
  return r.json();
};

/** Countries (admin order) each with their live study programs, plus language courses. Refreshes every minute and on tab focus. */
export function useOverseas(refreshMs = 60000) {
  const [countries, setCountries] = useState<(Country & { programs: Program[] })[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [c, p, l] = await Promise.all([get<Country>("overseas_countries"), get<Program>("overseas_courses"), get<Language>("overseas_languages")]);
      setCountries(c.sort((a, b) => Number(a.position || 999) - Number(b.position || 999)).map((x) => ({ ...x, programs: p.filter((y) => y.country === x.name) })));
      setLanguages(l);
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

  return { countries, languages, loading, error, reload: load };
}

/** Call from the Overseas page's enquiry form; it appears in the admin under Overseas Education → Enquiries. */
export async function submitOverseasEnquiry(e: OverseasEnquiry): Promise<void> {
  const r = await fetch(`${API}/api/overseas_enquiries`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) });
  if (!r.ok) throw new Error("Could not send enquiry");
}
