import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  UserGroupIcon,
  ChartBarIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";

// `duration` is per-stat so each counter climbs at its own natural pace —
// roughly scaled to how large the number is, so 60,000+ doesn't feel like
// it's ticking at the same rate as 200+.
const stats = [
  {
    icon: UserGroupIcon,
    value: 60000,
    suffix: "+",
    label: "Students Trained",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-400",
    duration: 2.4,
  },
  {
    icon: ChartBarIcon,
    value: 5000,
    suffix: "+",
    label: "Successful Placements",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-400",
    duration: 1.7,
  },
  {
    icon: BookOpenIcon,
    value: 200,
    suffix: "+",
    label: "Courses Offered",
    iconBg: "bg-teal-500/15",
    iconColor: "text-teal-400",
    duration: 1.1,
  },
];

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="container py-16">
      <div
        className="relative overflow-hidden rounded-3xl px-6 py-10 shadow-xl shadow-indigo-950/20 sm:px-10 sm:py-12"
        style={{
          backgroundImage: [
            "radial-gradient(60% 90% at 90% 0%, rgba(45,212,191,0.18), transparent 60%)",
            "radial-gradient(55% 80% at 5% 100%, rgba(139,92,246,0.22), transparent 60%)",
            "linear-gradient(120deg, #0b1230 0%, #151b4d 45%, #0f2f4a 100%)",
          ].join(","),
        }}
      >
        {/* Decorative wave */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full opacity-[0.08]"
          viewBox="0 0 800 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60 C 150 100, 300 20, 450 55 C 600 90, 700 30, 800 55 L800 100 L0 100 Z"
            fill="white"
          />
        </svg>
        {/* Decorative dot grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            maskImage: "linear-gradient(to bottom, #000, transparent 90%)",
            WebkitMaskImage: "linear-gradient(to bottom, #000, transparent 90%)",
          }}
        />

        <div className="relative grid gap-8 sm:grid-cols-3 sm:divide-x sm:divide-white/10">
          {stats.map((s, i) => (
            <StatItem key={s.label} stat={s} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatItem({
  stat,
  index,
  inView,
}: {
  stat: (typeof stats)[number];
  index: number;
  inView: boolean;
}) {
  const count = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const controls = animate(count, stat.value, {
      duration: stat.duration,
      delay: index * 0.15,
      // Fast start that settles gently at the end — reads as a clean,
      // deliberate count rather than a linear tick.
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.floor(latest)),
    });

    return () => controls.stop();
  }, [inView, stat.value, stat.duration, index, count]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      className="flex items-center justify-center gap-4 px-2 sm:justify-start sm:px-8 sm:first:pl-0"
    >
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${stat.iconBg} ${stat.iconColor}`}
      >
        <stat.icon className="h-7 w-7" />
      </div>
      <div>
        <div className="text-3xl font-extrabold tracking-tight text-white tabular-nums sm:text-4xl">
          {display.toLocaleString()}
          {stat.suffix}
        </div>
        <div className="text-sm font-medium text-white/70">{stat.label}</div>
      </div>
    </motion.div>
  );
}
