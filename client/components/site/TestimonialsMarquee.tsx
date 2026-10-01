// components/site/TestimonialsMarquee.tsx
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";

export interface Testimonial {
  id: number | string;
  quote: string;
  author: string;
  course: string;
  rating: number;
  postedAt: string;
}

const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      "The instructors are top-notch and the curriculum is very practical. I landed a job just two months after completing the course!",
    author: "Niharika Sharma",
    course: "Python + DSA",
    rating: 5,
    postedAt: "5 days ago",
  },
  {
    id: 2,
    quote:
      "Skill Training Center's course gave me the skills and confidence I needed to switch my career. The projects were invaluable for my portfolio.",
    author: "Prateek Kumar",
    course: "Full Stack Development",
    rating: 5,
    postedAt: "1 week ago",
  },
  {
    id: 3,
    quote:
      "Hands-on learning and personalized attention made all the difference. Highly recommend this course to anyone serious about data analysis.",
    author: "Raj Borkar",
    course: "Data Analytics",
    rating: 4,
    postedAt: "10 days ago",
  },
  {
    id: 4,
    quote:
      "The projects were hands-on and very practical. I gained confidence in real-world data analysis and visualization techniques.",
    author: "Saloni Patel",
    course: "Data Science",
    rating: 5,
    postedAt: "2 weeks ago",
  },
  {
    id: 5,
    quote:
      "The mentorship and guidance from Skill Training Center helped me grow faster than I expected. The career support was exceptional.",
    author: "Ajay Singh",
    course: "Machine Learning",
    rating: 5,
    postedAt: "3 days ago",
  },
  {
    id: 6,
    quote:
      "The projects and real-life case studies really boosted my confidence. The interview preparation sessions were incredibly helpful.",
    author: "Meenal Gupta",
    course: "Data Analytics",
    rating: 5,
    postedAt: "1 week ago",
  },
];

const avatarAccents = [
  "from-blue-500 to-cyan-500",
  "from-violet-500 to-fuchsia-500",
  "from-teal-500 to-emerald-500",
  "from-rose-500 to-orange-500",
];

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
}

function Row({
  items,
  duration,
  reverse = false,
}: {
  items: Testimonial[];
  duration: number;
  reverse?: boolean;
}) {
  // Duplicate the list so the strip can loop seamlessly at -50%.
  const looped = [...items, ...items];

  return (
    <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <div
        className="flex w-max gap-5 py-2 [animation-play-state:running] group-hover:[animation-play-state:paused]"
        style={{
          animation: `marquee ${duration}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {looped.map((t, i) => (
          <TestimonialMiniCard key={`${t.id}-${i}`} testimonial={t} accent={avatarAccents[i % avatarAccents.length]} />
        ))}
      </div>
    </div>
  );
}

function TestimonialMiniCard({ testimonial, accent }: { testimonial: Testimonial; accent: string }) {
  return (
    <figure className="relative w-[300px] shrink-0 overflow-hidden rounded-2xl border border-brand-aqua/40 bg-white/90 backdrop-blur-sm p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg hover:shadow-gray-900/5 sm:w-[320px]">
      {/* Decorative quote mark */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-2 right-4 select-none font-serif text-7xl leading-none text-primary/10"
      >
        &rdquo;
      </span>

      {/* Star rating */}
      <div className="relative flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) =>
          i < testimonial.rating ? (
            <StarSolid key={i} className="h-4 w-4 text-amber-500" />
          ) : (
            <StarOutline key={i} className="h-4 w-4 text-amber-500/40" />
          ),
        )}
      </div>

      <blockquote className="relative mt-4 line-clamp-4 text-[0.9rem] leading-relaxed text-gray-600">
        "{testimonial.quote}"
      </blockquote>

      <figcaption className="relative mt-6 flex items-center gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${accent} text-sm font-bold text-white shadow-sm ring-2 ring-white`}
        >
          {initials(testimonial.author)}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-bold text-gray-900">{testimonial.author}</div>
          <div className="truncate text-xs text-gray-400">
            {testimonial.course} · {testimonial.postedAt}
          </div>
        </div>
      </figcaption>
    </figure>
  );
}

export default function TestimonialsMarquee({
  testimonials = defaultTestimonials,
}: {
  testimonials?: Testimonial[];
}) {
  const half = Math.ceil(testimonials.length / 2);
  const rowA = testimonials.slice(0, half);
  const rowB = testimonials.slice(half).length ? testimonials.slice(half) : testimonials;

  return (
    <div className="space-y-5">
      <Row items={rowA} duration={32} />
      <Row items={rowB} duration={36} reverse />
    </div>
  );
}
