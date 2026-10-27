import { useEffect, useRef, useState } from "react";
import { scrollToSection } from "./shared";

export interface TabItem {
  id: string;
  label: string;
}

export default function SectionTabs({ tabs }: { tabs: TabItem[] }) {
  const [active, setActive] = useState(tabs[0]?.id);

  // Follow the site header: when it slides away on scroll-down, the tab bar
  // glides up to the top edge instead of floating with a gap; when the header
  // returns, the bar sits right below it. Mirrors Header's scroll logic.
  const [headerHidden, setHeaderHidden] = useState(false);
  const lastY = useRef(0);
  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (Math.abs(delta) < 6) return;
      if (y <= 80) setHeaderHidden(false);
      else setHeaderHidden(delta > 0);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      className={`sticky z-30 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm transition-[top] duration-300 ease-in-out [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
        headerHidden ? "top-3" : "top-24"
      }`}
    >
      <ul className="flex min-w-max gap-1">
        {tabs.map((t) => (
          <li key={t.id} className="flex-1">
            <button
              type="button"
              onClick={() => {
                setActive(t.id);
                scrollToSection(t.id);
              }}
              aria-current={active === t.id ? "true" : undefined}
              className={`w-full whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
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