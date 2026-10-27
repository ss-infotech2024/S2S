// Copy into the USER WEBSITE project. Uses the same VITE_API_URL as the admin.
import { useCallback, useEffect, useState } from "react";

export type Banner = { id: string; heading: string; subheading: string; image: string; cta_text: string; cta_link: string; align: "left" | "center"; position: number };
export type SiteContent = Record<string, any> & {
  announce_show?: boolean; announce_text?: string; announce_link?: string;
  hero_title?: string; hero_subtitle?: string; hero_cta_text?: string; hero_cta_link?: string; hero_cta2_text?: string; hero_cta2_link?: string; about_text?: string;
};

const API = import.meta.env.VITE_API_URL as string;
const get = async <T,>(t: string): Promise<T[]> => {
  const r = await fetch(`${API}/api/${t}`);
  if (!r.ok) throw new Error(`Could not load ${t}`);
  return r.json();
};

/** Live homepage banners (in display order) plus the editable homepage text. The server returns live banners only. */
export function useSiteContent(refreshMs = 60000) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [content, setContent] = useState<SiteContent>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [b, c] = await Promise.all([get<Banner>("banners"), get<SiteContent>("site_content")]);
      setBanners([...b].sort((x, y) => (Number(x.position) || 999) - (Number(y.position) || 999)));
      setContent(c[0] ?? {});
    } catch { /* keep the built-in text if the API is unreachable */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, refreshMs);
    window.addEventListener("focus", load);
    return () => { clearInterval(t); window.removeEventListener("focus", load); };
  }, [load, refreshMs]);

  /** Section helpers: sec("online") -> { show, title, sub }. Sections are shown unless switched off. */
  const sec = (k: string, fallbackTitle = "", fallbackSub = "") => ({
    show: content[`sec_${k}_show`] !== false,
    title: content[`sec_${k}_title`] || fallbackTitle,
    sub: content[`sec_${k}_sub`] || fallbackSub,
  });
  return { banners, content, sec, loading };
}