import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AcademicCapIcon, BriefcaseIcon, BookOpenIcon } from "@heroicons/react/24/outline";

function useCounter(to: number, duration = 1.2) {
  const controls = useAnimation();
  const [value, setValue] = useState(0);
  useEffect(() => {
    controls.start({ count: to, transition: { duration, ease: "easeOut" } });
  }, [to]);
  return { controls, value, setValue };
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const a = useCounter(60000);
  const b = useCounter(5000);
  const c = useCounter(200);

  useEffect(() => {
    if (inView) {
      a.controls.start({ count: 60000 });
      b.controls.start({ count: 5000 });
      c.controls.start({ count: 200 });
    }
  }, [inView]);

  return (
    <section ref={ref} className="container py-10 sm:py-12">
      <div className="mx-auto grid max-w-2xl grid-cols-3 gap-3 sm:gap-4">
        <AnimatedNumber controls={a.controls} suffix="+" label="Students Trained" icon={AcademicCapIcon} delay={0} />
        <AnimatedNumber controls={b.controls} suffix="+" label="Successful Placements" icon={BriefcaseIcon} delay={0.1} />
        <AnimatedNumber controls={c.controls} suffix="+" label="Courses Offered" icon={BookOpenIcon} delay={0.2} />
      </div>
    </section>
  );
}

function AnimatedNumber({
  controls,
  suffix,
  label,
  icon: Icon,
  delay = 0,
}: {
  controls: any;
  suffix?: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  delay?: number;
}) {
  const [display, setDisplay] = useState(0);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className="group rounded-xl border border-primary/10 bg-accent/50 px-2 py-3 text-center shadow-sm backdrop-blur transition-shadow duration-300 hover:border-primary/30 hover:shadow-md sm:rounded-2xl sm:px-4 sm:py-4"
    >
      <div className="mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-secondary to-primary text-white transition-transform duration-300 group-hover:scale-110 sm:h-8 sm:w-8">
        <Icon className="h-4 w-4" />
      </div>
      <motion.span
        initial={{ count: 0 }}
        animate={controls}
        onUpdate={(latest: any) => setDisplay(Math.floor(latest.count || 0))}
        className="hidden"
      />
      <div className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-xl font-extrabold leading-tight tracking-tight text-transparent sm:text-2xl md:text-3xl">
        {display}{suffix}
      </div>
      <div className="mt-0.5 text-[10px] leading-tight text-foreground/70 sm:text-xs">{label}</div>
    </motion.div>
  );
}
