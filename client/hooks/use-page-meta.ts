import { useEffect } from "react";

const SITE = "Skill Training Center";

function setMeta(attr: "name" | "property", key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

/** Sets a unique <title> and description for each page (better Google results and share previews). */
export default function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    const full = title === SITE ? title : `${title} | ${SITE}`;
    document.title = full;
    setMeta("property", "og:title", full);
    if (description) {
      setMeta("name", "description", description);
      setMeta("property", "og:description", description);
    }
  }, [title, description]);
}
