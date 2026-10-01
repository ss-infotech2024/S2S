import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  EyeIcon,
  PlayCircleIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

const G = (n) => `/img/gallery/gallery-${String(n).padStart(2, "0")}.jpg`;

const galleryItems = [
  {
    id: 1,
    type: "image",
    category: "classroom",
    title: "Live Interactive Sessions",
    description: "Real-time learning with expert instructors",
    image: "/img/live.webp",
    badge: "Live"
  },
  {
    id: 2,
    type: "discussion",
    category: "group",
    title: "Chhatrapati Shivaji Maharaj Jayanti Celebration",
    description: "A group discussion and cultural celebration honoring the legacy of Chhatrapati Shivaji Maharaj.",
    image: "/img/jayanti.jpeg",
    badge: "Celebration"
  },
  {
    id: 3,
    type: "discussion",
    category: "group",
    title: "Job Fair 2023",
    description: "Interactive group discussion on career opportunities, placements, and experiences from Job Fair 2023.",
    image: "/img/jobfair.jpeg",
    badge: "Job Fair 2023"
  },
  {
    id: 4,
    type: "discussion",
    category: "group",
    title: "Group Discussion on AI",
    description: "Interactive group discussion about AI-powered learning and its impact on education.",
    image: "/img/gd.jpeg",
    badge: "Group Discussion"
  },
  {
    id: 5,
    type: "image",
    category: "projects",
    title: "Hands-on Workshops",
    description: "Practical coding sessions",
    image: "/img/workshop.jpeg",
    badge: "Workshop"
  },
  {
    id: 6,
    type: "image",
    category: "success",
    title: "Certificate Distribution",
    description: "Celebrating student achievements",
    image: "/img/group.jpeg",
    badge: "Certified"
  },

  // ---- New gallery photos ----
  // Kept in true capture order (WhatsApp file timestamps: "…" → "… (1)" → "… (2)").
  // `pos` = focal point used when a photo is cropped into the equal-size card.
  { id: 7,  type: "image", category: "group",     title: "Team Celebration",            description: "Our team and mentors together at the institute",            image: G(1),  badge: "Celebration" },
  { id: 8,  type: "image", category: "group",     title: "Festive Moments",             description: "Traditional festivities shared with the team",              image: G(2),  badge: "Celebration", pos: "center 35%" },
  { id: 9,  type: "image", category: "group",     title: "Learners & Mentors",          description: "A joyful get-together with students and trainers",           image: G(3),  badge: "Community" },
  { id: 10, type: "image", category: "group",     title: "Festival Celebration",        description: "Celebrating with colour, culture and community",             image: G(5),  badge: "Celebration" },
  { id: 11, type: "image", category: "group",     title: "Campus Group Photo",          description: "A large batch gathered together on campus",                  image: G(4),  badge: "Community" },
  { id: 12, type: "image", category: "success",   title: "Felicitation Ceremony",       description: "Honouring our trainer with a warm felicitation",             image: G(6),  badge: "Felicitation" },
  { id: 13, type: "image", category: "classroom", title: "Expert Seminar",              description: "Industry expert addressing students on stage",               image: G(7),  badge: "Seminar" },
  { id: 14, type: "image", category: "success",   title: "Certificates of Appreciation", description: "Recognition and certificates presented to our team",        image: G(8),  badge: "Certified" },
  { id: 15, type: "image", category: "success",   title: "Recognition Moment",          description: "Certificates handed over in the presence of leaders",        image: G(9),  badge: "Certified" },
  { id: 16, type: "image", category: "success",   title: "Token of Appreciation",       description: "Students and faculty exchanging a token of thanks",          image: G(10), badge: "Appreciation" },
  { id: 17, type: "image", category: "success",   title: "Training Programme Welcome",  description: "Guests welcomed at the ServiceNow + AI training programme",  image: G(11), badge: "Programme" },
  { id: 18, type: "image", category: "success",   title: "Valedictory Function",        description: "Closing ceremony of the training programme",                 image: G(12), badge: "Valedictory" },
  { id: 19, type: "image", category: "classroom", title: "Packed Lecture Hall",         description: "A full house of eager learners at a live session",           image: G(15), badge: "Session", pos: "center 72%" },
  { id: 20, type: "image", category: "classroom", title: "Focused Classroom Session",   description: "Students engaged in a guided learning session",              image: G(13), badge: "Classroom", pos: "center 60%" },
  { id: 21, type: "image", category: "success",   title: "Institute Partnership",       description: "Gifts exchanged with our academic partner institute",        image: G(14), badge: "Partnership" },
  { id: 22, type: "image", category: "success",   title: "Valedictory Ceremony",        description: "Certificates and plants presented to the guests",            image: G(18), badge: "Valedictory" },
  { id: 23, type: "image", category: "projects",  title: "Hands-on Lab Practice",       description: "Every student working on their own system",                  image: G(16), badge: "Hands-on" },
  { id: 24, type: "image", category: "success",   title: "Gift of Gratitude",           description: "Handing over a memento at the partner college",              image: G(17), badge: "Appreciation", pos: "center 35%" },
  { id: 25, type: "image", category: "group",     title: "Leadership Meet",             description: "A meeting with leaders and mentors",                         image: G(21), badge: "Community" },
  { id: 26, type: "image", category: "classroom", title: "Interactive Training",        description: "Trainer guiding students through live concepts",             image: G(19), badge: "Training" },
  { id: 27, type: "image", category: "projects",  title: "Guided Project Work",         description: "Students building and practising under mentor guidance",     image: G(20), badge: "Project" },
  { id: 28, type: "image", category: "group",     title: "Happy Team Moments",          description: "A cheerful group photo with the whole team",                 image: G(23), badge: "Celebration" },
  { id: 29, type: "image", category: "success",   title: "Partnership Certificates",    description: "Certificates exchanged during a partnership visit",          image: G(22), badge: "Certified" }
];

const galleryTabs = [
  { id: "all", label: "All", count: galleryItems.length },
  { id: "classroom", label: "Classroom", count: galleryItems.filter(item => item.category === "classroom").length },
  { id: "projects", label: "Projects", count: galleryItems.filter(item => item.category === "projects").length },
  { id: "success", label: "Success", count: galleryItems.filter(item => item.category === "success").length }
];

// Number of grid columns at the current width (mirrors the Tailwind breakpoints used by the grid)
function useGridColumns() {
  const get = () => {
    if (typeof window === "undefined") return 4;
    const w = window.innerWidth;
    return w >= 1280 ? 4 : w >= 1024 ? 3 : w >= 480 ? 2 : 1;
  };
  const [cols, setCols] = useState(get);
  useEffect(() => {
    const onResize = () => setCols(get());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return cols;
}

export default function GallerySection({ variant = "grid", compact = false, hideBadge = false } = {}) {
  const [activeGalleryTab, setActiveGalleryTab] = useState("all");
  const columns = useGridColumns();
  const reduceMotion = useReducedMotion();
  const [selectedIndex, setSelectedIndex] = useState(null);

  // "All" shows every photo; other tabs show only their own category
  const filteredGallery = activeGalleryTab === "all"
    ? galleryItems
    : galleryItems.filter(item => item.category === activeGalleryTab);

  const selectedImage = selectedIndex !== null ? filteredGallery[selectedIndex] : null;

  const closePreview = useCallback(() => setSelectedIndex(null), []);
  const showPrev = useCallback(
    () => setSelectedIndex((i) => (i === null ? i : (i - 1 + filteredGallery.length) % filteredGallery.length)),
    [filteredGallery.length]
  );
  const showNext = useCallback(
    () => setSelectedIndex((i) => (i === null ? i : (i + 1) % filteredGallery.length)),
    [filteredGallery.length]
  );

  // Keyboard support for the preview (Esc / arrows) + lock page scroll while open
  useEffect(() => {
    if (selectedIndex === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") closePreview();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [selectedIndex, closePreview, showPrev, showNext]);

  // ---- Marquee (infinite loop) helpers ----
  // Repeat the filtered photos until one "set" is wider than any screen, then render the
  // set twice and slide by exactly -50%: the loop is seamless, never empty, never stops.
  const MIN_SET_SIZE = 9;
  const repeatCount = Math.max(1, Math.ceil(MIN_SET_SIZE / filteredGallery.length));
  const marqueeSet = Array.from({ length: repeatCount }).flatMap(() =>
    filteredGallery.map((item, idx) => ({ item, idx }))
  );
  const marqueeItems = [...marqueeSet, ...marqueeSet];
  const marqueeDuration = marqueeSet.length * 4; // seconds — constant speed on every tab

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4 }}
      className={compact ? "mb-6" : "mb-20"}
    >
      <div className={`text-center ${compact ? "mb-5" : "mb-12"}`}>
        {variant === "marquee" || hideBadge ? (
          // Online Training / hideBadge: no badge above the heading (logo now sits at the top of the page)
          <div className="pt-12 sm:pt-14" aria-hidden="true" />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 ${compact ? "px-3 py-1 mb-2 mt-10" : "px-4 py-2 mb-4 mt-16"}`}
          >
            <EyeIcon className="w-4 h-4 text-primary" />
            <span className={`${compact ? "text-xs" : "text-sm"} font-semibold text-primary`}>Learning Experience</span>
          </motion.div>
        )}
        <h2 className={`font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent ${compact ? "text-xl md:text-2xl mb-1" : "text-3xl md:text-4xl mb-4"}`}>
          Explore Our Learning Journey
        </h2>
        <p className={`text-foreground/70 max-w-2xl mx-auto ${compact ? "text-xs sm:text-sm" : "text-xl"}`}>
          Get a glimpse of our interactive classrooms, student projects, and success stories
        </p>
      </div>

      {/* Gallery Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        role="tablist"
        aria-label="Filter gallery photos"
        className={`flex flex-wrap justify-center ${compact ? "gap-1.5 mb-4" : "gap-2 sm:gap-3 mb-8"}`}
      >
        {galleryTabs.map((tab) => (
          <motion.button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeGalleryTab === tab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setActiveGalleryTab(tab.id); setSelectedIndex(null); }}
            className={`${compact ? "px-3 py-1.5 rounded-xl text-xs" : "px-4 py-2.5 sm:px-6 sm:py-3 rounded-2xl text-sm sm:text-base"} font-semibold transition-all duration-300 flex items-center gap-2 ${
              activeGalleryTab === tab.id
                ? "bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/25"
                : "bg-background/50 border border-border/30 text-foreground/70 hover:border-primary/30"
            }`}
          >
            {tab.label}
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                activeGalleryTab === tab.id
                  ? "bg-white/20 text-white"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {tab.count}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {variant === "marquee" ? (
        /* Gallery Marquee — photos only, equal size, continuous infinite loop */
        <div
          className="gallery-marquee relative -mx-4 sm:mx-0"
          style={{
            WebkitMaskImage: "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)",
            maskImage: "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)"
          }}
        >
          <div className="overflow-hidden py-3 gallery-marquee-viewport">
            <motion.div
              key={activeGalleryTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`gallery-marquee-track flex ${selectedIndex !== null ? "gallery-marquee-paused" : ""}`}
              style={{ animationDuration: `${marqueeDuration}s` }}
            >
              {marqueeItems.map(({ item, idx }, i) => (
                <button
                  type="button"
                  key={`${item.id}-${i}`}
                  onClick={() => setSelectedIndex(idx)}
                  aria-label={`Open photo: ${item.title}`}
                  aria-hidden={i >= marqueeSet.length ? "true" : undefined}
                  tabIndex={i >= marqueeSet.length ? -1 : 0}
                  className="group relative shrink-0 mr-4 sm:mr-5 w-[220px] h-[165px] sm:w-[260px] sm:h-[195px] lg:w-[300px] lg:h-[225px] rounded-2xl overflow-hidden bg-violet-100/60 dark:bg-zinc-800 border border-violet-200/60 dark:border-violet-800/60 shadow-md hover:shadow-xl hover:border-pink-300 transition-[box-shadow,transform,border-color] duration-300 hover:-translate-y-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <img
                    src={item.image}
                    alt={i >= marqueeSet.length ? "" : item.title}
                    loading="eager"
                    decoding="async"
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover object-[center_30%] transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold shadow-sm ${
                      item.badge === "Live" ? "bg-red-500/90 text-white" : "bg-white/95 text-violet-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                  <span className="absolute inset-x-0 bottom-0 px-4 pb-3 pt-10 bg-gradient-to-t from-black/70 to-transparent text-left text-sm font-semibold text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 line-clamp-1">
                    {item.title}
                  </span>
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      ) : (
        /* Gallery Grid — equal-size cards, filter swap + one-by-one staggered reveal */
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeGalleryTab}
          exit={{ opacity: 0, transition: { duration: 0.18 } }}
          className={`grid grid-cols-1 min-[480px]:grid-cols-2 auto-rows-fr ${compact ? "md:grid-cols-3 lg:grid-cols-5 gap-2.5" : "lg:grid-cols-4 gap-3 sm:gap-4"}`}
        >
          {filteredGallery.map((item, index) => (
            <motion.button
              type="button"
              key={item.id}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 32, scale: reduceMotion ? 1 : 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "0px 0px -50px 0px" }}
              // Photos appear one after another, left → right along each row
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: (index % columns) * 0.09 }}
              whileHover={reduceMotion ? undefined : { y: -6, transition: { duration: 0.25, delay: 0 } }}
              onClick={() => setSelectedIndex(index)}
              aria-label={`Open photo: ${item.title}`}
              className="group relative flex flex-col h-full text-left rounded-xl overflow-hidden bg-white/90 dark:bg-zinc-900/80 border border-violet-200/60 dark:border-violet-800/60 shadow-sm hover:shadow-lg hover:border-pink-300 transition-[box-shadow,border-color] duration-300 backdrop-blur-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {/* Image container — identical ratio for every photo */}
              <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-violet-100/60 dark:bg-zinc-800">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: item.pos || "center 30%" }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold shadow-sm ${
                      item.badge === "Live"
                        ? "bg-red-500/90 text-white"
                        : "bg-white/95 text-violet-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>

                {/* Video Play Button */}
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <PlayCircleIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content — fixed height so every card is exactly the same size */}
              <div className={`shrink-0 overflow-hidden ${compact ? "px-2.5 py-2 h-[58px]" : "px-3 py-2.5 h-[76px]"}`}>
                <h3 className={`font-semibold mb-0.5 text-foreground group-hover:text-pink-500 transition-colors line-clamp-1 ${compact ? "text-xs" : "text-sm"}`}>
                  {item.title}
                </h3>
                <p className={`text-foreground/60 line-clamp-2 ${compact ? "text-[10px] leading-snug" : "text-xs"}`}>{item.description}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>
      )}

      <style>{`
        .gallery-marquee-track {
          width: max-content;
          animation-name: gallery-marquee-scroll;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        .gallery-marquee:hover .gallery-marquee-track,
        .gallery-marquee-track.gallery-marquee-paused {
          animation-play-state: paused;
        }
        @keyframes gallery-marquee-scroll {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .gallery-marquee-track { animation: none; }
          .gallery-marquee-viewport { overflow-x: auto; }
        }
      `}</style>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closePreview}
            role="dialog"
            aria-modal="true"
            aria-label={selectedImage.title}
          >
            <motion.div
              key={selectedImage.id}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-4xl max-h-full bg-background rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-black flex items-center justify-center">
                <img loading="lazy"
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="max-h-[70vh] w-auto max-w-full object-contain"
                />
                <button
                  type="button"
                  onClick={closePreview}
                  aria-label="Close preview"
                  className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
                {filteredGallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={showPrev}
                      aria-label="Previous photo"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
                    >
                      <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={showNext}
                      aria-label="Next photo"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
                    >
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
              <div className="p-5 sm:p-6 text-center">
                <h3 className="text-xl sm:text-2xl font-bold mb-2">{selectedImage.title}</h3>
                <p className="text-foreground/70 text-sm sm:text-base">{selectedImage.description}</p>
                <p className="mt-3 text-xs text-foreground/50">
                  {selectedIndex + 1} / {filteredGallery.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}