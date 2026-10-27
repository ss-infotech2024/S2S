import type { ReactNode } from "react";

export const TYPOGRAPHY = {
  h1: "text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight",
  h2: "text-xl sm:text-2xl font-bold",
};

export const SPACING = {
  card: "p-6 sm:p-8",
};

export function SectionHeading({
  icon,
  title,
  subtitle,
  right,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-sm">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className={`${TYPOGRAPHY.h2} text-[#171034]`}>{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[20px] border border-slate-200 bg-white shadow-sm transition-colors duration-300 hover:border-indigo-200 ${className}`}
    >
      {children}
    </div>
  );
}

export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}