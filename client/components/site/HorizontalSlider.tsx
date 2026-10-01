import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { BadgeCheck, BookOpen, ChevronLeft, ChevronRight, Code2, Play, Users } from "lucide-react";
import newposter6 from "../../../public/homeUpdates/newposter6.jpg";
import newposter5 from "../../../public/homeUpdates/newposter5.jpg";
import poster3 from "../../../public/homeUpdates/poster3.jpg";
import poster4 from "../../../public/homeUpdates/poster4.jpg";
import service from "../../../public/homeUpdates/service.jpeg";
import databricks from "../../../public/homeUpdates/databricks.jpeg";
import german from "../../../public/homeUpdates/german.jpeg";
import germani from "../../../public/homeUpdates/germani.jpeg";

interface CardItem {
  id: number;
  title: string;
  description: string;
  /** Part of the title shown in the accent gradient */
  highlight: string;
  /** Four short selling points shown under the button */
  features: [string, string, string, string];
  image: string;
  /** Page opened by the "Enroll Now" button */
  enrollTo: string;
  /** Optional page with full details (shown as a second link in the popup) */
  detailsTo?: string;
}

// Card Data — every banner knows which page its "Enroll Now" button should open
const cardData: CardItem[] = [
  {
    id: 1,
    title: "ServiceNow AI-Data Analytics",
    description: "Training",
    highlight: "AI-Data Analytics",
    features: ["Expert-led live sessions", "Hands-on practice", "Industry insights", "Certificate of completion"],
    image: service,
    enrollTo: "/enroll/ai-data-analytics",
    detailsTo: "/courses/ai-data-analytics",
  },
  {
    id: 2,
    title: "German Workshop",
    description: "German Language Workshop",
    highlight: "Workshop",
    features: ["Free consulting & counselling", "German language roadmap", "Basic German speaking practice", "Certificate of completion"],
    image: germani,
    enrollTo: "/overseas",
  },
  {
    id: 3,
    title: "DataBricks AI-Data Analytics",
    description: "DataBricks Webinar, Industry Awareness Session",
    highlight: "AI-Data Analytics",
    features: ["Expert-led live sessions", "Hands-on practice", "Industry insights", "Certificate of completion"],
    image: databricks,
    enrollTo: "/enroll/databricks",
    detailsTo: "/courses/databricks",
  },
  {
    id: 4,
    title: "German Language 3 Days Workshop",
    description: "3-DAY GERMAN LANGUAGE POWER WORKSHOP",
    highlight: "3 Days",
    features: ["Free consulting & counselling", "German language roadmap", "Basic German speaking practice", "Certificate of completion"],
    image: german,
    enrollTo: "/overseas",
  },
  {
    id: 5,
    title: "AI-Data Analytics",
    description: "Training & Certification",
    highlight: "Analytics",
    features: ["Expert-led live sessions", "Hands-on practice", "Industry insights", "Certificate of completion"],
    image: newposter6,
    enrollTo: "/enroll/ai-data-analytics",
    detailsTo: "/courses/ai-data-analytics",
  },
  {
    id: 6,
    title: "AI-Data Analytics",
    description: "Training & Certification",
    highlight: "Analytics",
    features: ["Expert-led live sessions", "Hands-on practice", "Industry insights", "Certificate of completion"],
    image: newposter5,
    enrollTo: "/enroll/ai-data-analytics",
    detailsTo: "/courses/ai-data-analytics",
  },
  {
    id: 7,
    title: "AI Data-Bricks Seminar",
    description: "AI Analytics Engineering On Data-Bricks Seminar",
    highlight: "Seminar",
    features: ["Expert-led live sessions", "Hands-on practice", "Industry insights", "Certificate of completion"],
    image: poster3,
    enrollTo: "/enroll/databricks",
    detailsTo: "/courses/databricks",
  },
  {
    id: 8,
    title: "Answercraft",
    description: "Professional training On communication",
    highlight: "Answercraft",
    features: ["Communication skills", "Confidence building", "Practical exercises", "Certificate of completion"],
    image: poster4,
    enrollTo: "/contact",
  },
];

const AUTO_SLIDE_MS = 5000;

const featureIcons = [
  { Icon: BookOpen, tile: "bg-sky-100 text-sky-600" },
  { Icon: Code2, tile: "bg-violet-100 text-violet-600" },
  { Icon: Users, tile: "bg-rose-100 text-rose-500" },
  { Icon: BadgeCheck, tile: "bg-amber-100 text-amber-500" },
];

const Card = ({ item, onOpen }: { item: CardItem; onOpen: () => void }) => {
  const at = item.title.indexOf(item.highlight);
  const before = at >= 0 ? item.title.slice(0, at) : item.title;
  const mark = at >= 0 ? item.highlight : "";
  const after = at >= 0 ? item.title.slice(at + item.highlight.length) : "";

  return (
    <div className="relative flex flex-col gap-6 overflow-hidden rounded-[2rem] border border-violet-100 bg-gradient-to-br from-white via-white to-violet-50/80 p-4 shadow-[0_20px_60px_-20px_rgba(76,29,149,0.25)] sm:p-5 md:flex-row md:gap-10">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-violet-200/40 blur-3xl" />

      {/* Poster */}
      <button
        type="button"
        onClick={onOpen}
        aria-label={`View details: ${item.title}`}
        className="group relative mx-auto aspect-[3/4] w-full max-w-[300px] shrink-0 overflow-hidden rounded-2xl bg-violet-50 shadow-lg ring-1 ring-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary md:mx-0 md:w-[290px] md:max-w-none lg:w-[330px]"
      >
        <img loading="lazy" src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </button>

      {/* Content */}
      <div className="relative flex min-w-0 flex-1 flex-col justify-center py-2 md:pr-6">
        <h3 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
          {before}
          {mark && <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">{mark}</span>}
          {after}
        </h3>
        <p className="mt-3 text-base text-slate-600 sm:text-lg">{item.description}</p>

        <button
          type="button"
          onClick={onOpen}
          className="group mt-6 inline-flex h-12 w-fit items-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <Play className="h-4 w-4" /> Click to learn more
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>

        <div className="my-6 h-px bg-slate-200/80" />

        <ul className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          {item.features.map((f, i) => {
            const { Icon, tile } = featureIcons[i % featureIcons.length];
            return (
              <li key={f} className="flex items-center gap-3">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${tile}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm leading-snug text-slate-700 sm:text-base">{f}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

// Details popup — "Enroll Now" opens the correct page for the selected banner
const Modal = ({
  isOpen,
  onClose,
  card,
}: {
  isOpen: boolean;
  onClose: () => void;
  card: CardItem | null;
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && card && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={card.title}
          >
            <div
              className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                aria-label="Close"
                className="group absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 transition-colors hover:bg-black/70"
              >
                <XMarkIcon className="h-6 w-6 text-white transition-transform group-hover:scale-110" />
              </button>

              <div className="flex h-full max-h-[90vh] flex-col md:flex-row">
                <div className="relative h-[260px] overflow-hidden md:h-auto md:w-1/2">
                  <img loading="lazy" src={card.image} alt={card.title} className="h-full w-full object-cover" />
                </div>

                <div className="overflow-y-auto p-6 md:w-1/2 md:p-8">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold leading-tight text-white md:text-3xl">
                      {card.title}
                    </h2>
                    <p className="text-base leading-relaxed text-gray-300">{card.description}</p>

                    <div className="mt-6 space-y-4 border-t border-white/10 pt-6">
                      <div>
                        <h3 className="mb-2 text-lg font-semibold text-white">Training Details</h3>
                        <ul className="space-y-2 text-gray-400">
                          <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-blue-400" />Duration: 8 Weeks</li>
                          <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-blue-400" />Mode: Online &amp; Offline</li>
                          <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-blue-400" />Certificate: Yes</li>
                        </ul>
                      </div>
                      <div className="pt-2">
                        <h3 className="mb-2 text-lg font-semibold text-white">What You'll Learn</h3>
                        <ul className="space-y-2 text-gray-400">
                          <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-green-400" />Fundamentals &amp; Advanced Concepts</li>
                          <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-green-400" />Hands-on Projects</li>
                          <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-green-400" />Industry Best Practices</li>
                        </ul>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-4">
                        <Link
                          to={card.enrollTo}
                          onClick={onClose}
                          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-blue-700"
                        >
                          Enroll Now
                          <ArrowRightIcon className="h-4 w-4" />
                        </Link>
                        {card.detailsTo && (
                          <Link
                            to={card.detailsTo}
                            onClick={onClose}
                            className="rounded-lg border border-white/25 px-5 py-3 font-medium text-white transition-colors hover:bg-white/10"
                          >
                            View Course
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const HorizontalSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [manualHold, setManualHold] = useState(0); // bumps on every manual pick to restart the timer

  // Auto slide — pauses on hover and while the popup is open, restarts after a manual pick
  useEffect(() => {
    if (isPaused || isModalOpen) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cardData.length);
    }, AUTO_SLIDE_MS);
    return () => clearInterval(interval);
  }, [isPaused, isModalOpen, manualHold]);

  const openCard = (card: CardItem) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCard(null), 300);
  }, []);

  const select = (index: number) => {
    setCurrentIndex((index + cardData.length) % cardData.length);
    setManualHold((n) => n + 1);
  };

  const currentCard = cardData[currentIndex];

  return (
    <>
      <section className="w-full bg-gradient-to-b from-white to-violet-50/40 px-4 py-12 sm:py-16" aria-label="Upcoming programs">
        <div
          className="relative mx-auto w-full max-w-5xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card item={currentCard} onOpen={() => openCard(currentCard)} />
            </motion.div>
          </AnimatePresence>

          <button
            type="button"
            aria-label="Previous banner"
            onClick={() => select(currentIndex - 1)}
            className="absolute left-1 top-[28%] z-10 flex h-10 w-10 items-center justify-center rounded-full border border-violet-100 bg-white text-primary shadow-lg transition hover:scale-105 md:top-1/2 md:-left-5 md:-translate-y-1/2 lg:-left-6"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next banner"
            onClick={() => select(currentIndex + 1)}
            className="absolute right-1 top-[28%] z-10 flex h-10 w-10 items-center justify-center rounded-full border border-violet-100 bg-white text-primary shadow-lg transition hover:scale-105 md:top-1/2 md:-right-5 md:-translate-y-1/2 lg:-right-6"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="mt-8 flex justify-center gap-3" role="tablist" aria-label="Choose a banner">
          {cardData.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Show ${item.title}`}
              onClick={() => select(index)}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${index === currentIndex ? "scale-125 bg-blue-600" : "bg-slate-300 hover:bg-slate-400"}`}
            />
          ))}
        </div>
      </section>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} card={selectedCard} />
    </>
  );
};

export default HorizontalSlider;
