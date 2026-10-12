import { useEffect, useState } from "react";
import { scrollToSection } from "./shared";

export interface TabItem {
  id: string;
  label: string;
}

export default function SectionTabs({ tabs }: { tabs: TabItem[] }) {
  const [active, setActive] = useState(tabs[0]?.id);

  // Highlight the tab whose section is currently near the top of the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    tabs.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [tabs]);

  return (
    <nav
      aria-label="Course sections"
      className="sticky top-24 z-30 -mx-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white/90 p-1.5 shadow-sm backdrop-blur [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <ul className="flex min-w-max gap-1">
        {tabs.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              onClick={() => {
                setActive(t.id);
                scrollToSection(t.id);
              }}
              aria-current={active === t.id ? "true" : undefined}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                active === t.id
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 hover:text-[#171034]"
              }`}
            >
              {t.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}