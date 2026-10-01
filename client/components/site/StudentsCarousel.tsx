import { motion } from "framer-motion";
import { StarIcon } from "@heroicons/react/24/solid";

// Add more students here (photo = 4:5 portrait works best) — the loop adapts automatically.
// NOTE: the `review` texts are short placeholder messages — replace them with each student's own words.
const students = [
  {
    name: "Manan Agrawal",
    company: "Mindcan Inc",
    package: "20 LPA",
    review: "Practical training and real projects helped me crack my dream job.",
    photo: "/img/students/manan-agrawal.jpg",
  },
  {
    name: "Shradha Alewar",
    company: "Tech Mahindra",
    package: "3.65 LPA",
    review: "Great mentors and interview prep gave me the confidence to get placed.",
    photo: "/img/students/shradha-alewar.jpg",
  },
];

const MIN_SET_SIZE = 8; // one "set" must be wider than any screen so the loop never shows a gap
const SECONDS_PER_CARD = 4; // constant speed no matter how many students there are

export default function StudentsCarousel() {
  const repeat = Math.max(1, Math.ceil(MIN_SET_SIZE / students.length));
  const set = Array.from({ length: repeat }).flatMap(() => students);
  const items = [...set, ...set];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="students-marquee relative -mx-6 sm:mx-0"
      style={{
        WebkitMaskImage: "linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)",
        maskImage: "linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)",
      }}
    >
      <div className="students-viewport overflow-hidden py-6">
        <div
          className="students-track flex"
          style={{ animationDuration: `${set.length * SECONDS_PER_CARD}s` }}
        >
          {items.map((s, i) => {
            const isClone = i >= set.length;
            return (
              <article
                key={`${s.name}-${i}`}
                aria-hidden={isClone ? "true" : undefined}
                className="group shrink-0 mr-4 sm:mr-5 w-[190px] sm:w-[215px] lg:w-[230px] rounded-2xl bg-white border border-slate-200 shadow-md p-2.5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/30"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-purple-600/10">
                  <img
                    src={s.photo}
                    alt={isClone ? "" : s.name}
                    loading="eager"
                    decoding="async"
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-primary shadow-sm">
                    Placed
                  </span>
                  <span className="absolute bottom-3 right-3 rounded-full bg-gradient-to-r from-primary to-purple-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
                    {s.package}
                  </span>
                </div>

                <div className="px-1.5 pb-1.5 pt-3">
                  <div className="mb-1.5 flex gap-0.5">
                    {[...Array(5)].map((_, k) => (
                      <StarIcon key={k} className="h-3.5 w-3.5 text-yellow-400" />
                    ))}
                  </div>
                  <p className="mb-2 text-xs italic leading-snug text-foreground/70 line-clamp-3 min-h-[3.1em]">“{s.review}”</p>
                  <h3 className="text-sm sm:text-base font-bold text-foreground line-clamp-1">{s.name}</h3>
                  <p className="text-xs text-foreground/60 line-clamp-1">
                    Placed at <span className="font-semibold text-primary">{s.company}</span>
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <style>{`
        .students-track {
          width: max-content;
          animation-name: students-scroll;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        .students-marquee:hover .students-track { animation-play-state: paused; }
        @keyframes students-scroll {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .students-track { animation: none; }
          .students-viewport { overflow-x: auto; }
        }
      `}</style>
    </motion.div>
  );
}
