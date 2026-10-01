import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SectionHeading({
  eyebrow, title, subtitle, light = false, compact = false, className,
}: { eyebrow?: string; title: string; subtitle?: string; light?: boolean; compact?: boolean; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className={cn("mx-auto max-w-2xl text-center", compact ? "mb-8" : "mb-12", className)}
    >
      {eyebrow && (
        <span className={cn(
          "inline-block rounded-full font-semibold uppercase tracking-widest",
          compact ? "mb-2 px-3 py-0.5 text-[11px]" : "mb-3 px-3.5 py-1 text-xs",
          light ? "bg-white/10 text-blue-100" : "bg-primary/10 text-primary",
        )}>
          {eyebrow}
        </span>
      )}
      <h2 className={cn(
        "tracking-tight",
        compact ? "text-xl font-bold md:text-2xl" : "text-3xl font-extrabold md:text-4xl",
        light ? "text-white" : "text-slate-900",
      )}>{title}</h2>
      {subtitle && (
        <p className={cn(
          compact ? "mt-2 text-sm md:text-base" : "mt-3 text-base md:text-lg",
          light ? "text-blue-100" : "text-slate-600",
        )}>{subtitle}</p>
      )}
    </motion.div>
  );
}
