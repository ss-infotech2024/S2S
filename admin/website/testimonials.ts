// Copy into the USER WEBSITE project. Uses the same VITE_API_URL as the admin.
import { useCallback, useEffect, useState } from "react";

export type Testimonial = { id: string; name: string; image: string; course: string; rating: number; feedback: string };
export type NewTestimonial = { name: string; course?: string; rating: number; feedback: string; image?: string };

const API = import.meta.env.VITE_API_URL as string;

/** Approved testimonials only (the server filters them). Refreshes every minute and on tab focus. */
export function useTestimonials(refreshMs = 60000) {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const r = await fetch(`${API}/api/testimonials`);
      if (!r.ok) throw new Error("Could not load testimonials");
      const rows: (Omit<Testimonial, "rating"> & { rating: string })[] = await r.json();
      setItems(rows.map((x) => ({ ...x, rating: Number(x.rating) || 5 })));
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

  const average = items.length ? items.reduce((a, x) => a + x.rating, 0) / items.length : 0;
  return { testimonials: items, average, loading, error, reload: load };
}

/** Optional "share your experience" form. Saved as pending; it shows on the site only after the admin approves it. */
export async function submitTestimonial(t: NewTestimonial): Promise<void> {
  const r = await fetch(`${API}/api/testimonials`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...t, rating: String(Math.min(5, Math.max(1, Math.round(t.rating)))) }),
  });
  if (!r.ok) throw new Error("Could not submit testimonial");
}