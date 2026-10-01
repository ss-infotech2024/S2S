import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Reusable page-top banner, styled to match the home page hero
 * (client/components/site/HeroSlider.tsx). Drop it at the top of any
 * inner page for a consistent title band with breadcrumbs.
 *
 * Usage:
 *   <PageBanner
 *     eyebrow="Get In Touch"
 *     title="Contact Us"
 *     text="Have a question about a course, batch or fee? We're happy to help."
 *     crumbs={[{ label: "Contact" }]}
 *   />
 */
type Crumb = { label: string; to?: string };

export default function PageBanner({
  eyebrow,
  title,
  text,
  crumbs = [],
  className,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  crumbs?: Crumb[];
  className?: string;
}) {
  return (
    <div
      className={cn("relative isolate w-full overflow-hidden text-white", className)}
      style={{
        backgroundColor: "#1e0e3a",
        backgroundImage: [
          "radial-gradient(60% 85% at 88% 15%, rgba(217,70,239,0.26), transparent 62%)",
          "radial-gradient(55% 75% at 0% 100%, rgba(139,92,246,0.30), transparent 62%)",
          "linear-gradient(135deg, #1e0e3a 0%, #33185c 55%, #5a2a7e 100%)",
        ].join(","),
      }}
    >
      {/* Decorative dot grid, matching the home hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08]"
        style={{
          backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "linear-gradient(to bottom, #000, transparent 85%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000, transparent 85%)",
        }}
      />

      <div className="container px-5 py-14 text-center sm:px-8 sm:py-16 lg:py-20">
        {eyebrow && (
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-pink-100 backdrop-blur-sm sm:text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-pink-300" aria-hidden="true" />
            {eyebrow}
          </span>
        )}

        <h1 className="mx-auto mt-5 max-w-3xl text-[2.25rem] font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>

        {text && (
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            {text}
          </p>
        )}

        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mt-7 flex justify-center">
            <ol className="flex flex-wrap items-center justify-center gap-1.5 text-sm text-white/60">
              <li className="flex items-center gap-1.5">
                <Link to="/" className="flex items-center gap-1 transition-colors hover:text-white">
                  <Home className="h-3.5 w-3.5" aria-hidden="true" />
                  Home
                </Link>
              </li>
              {crumbs.map((c, i) => (
                <li key={c.label} className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5 text-white/35" aria-hidden="true" />
                  {c.to ? (
                    <Link to={c.to} className="transition-colors hover:text-white">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="font-medium text-white">
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>
    </div>
  );
}
