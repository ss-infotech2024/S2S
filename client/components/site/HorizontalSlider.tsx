import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRightIcon,
  PlayIcon,
  CalendarDaysIcon,
  ClockIcon,
  ComputerDesktopIcon,
  EyeIcon,
  XMarkIcon,
  BookOpenIcon,
  CodeBracketIcon,
  UserGroupIcon,
  CheckBadgeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import newposter6 from "../../../public/homeUpdates/newposter6.jpg";
import newposter5 from "../../../public/homeUpdates/newposter5.jpg";
import poster3 from "../../../public/homeUpdates/poster3.jpg"; 
import poster4 from "../../../public/homeUpdates/poster4.jpg";
import service from "../../../public/homeUpdates/service.jpeg";
import databricks from "../../../public/homeUpdates/databricks.jpeg";
import german from "../../../public/homeUpdates/german.jpeg";
import germani from "../../../public/homeUpdates/germani.jpeg";

// Card Data
// `titleHighlight`: the trailing part of the title rendered in the accent gradient.
// `badgeLabel`: short pill shown above the title (mirrors the "Industry Webinar" pill style).
// `meta`: optional date/time/mode row — only added when the poster itself states real specifics,
//   so we never invent a schedule the poster doesn't show.
// `points`: 3–4 key highlights pulled from each poster, shown as icon tiles on the card.
const cardData = [
  {
    id: 1,
    badgeLabel: "Free Workshop",
    title: "ServiceNow Data Analytics",
    titleHighlight: "Data Analytics",
    description: "Training",
    image: service,
    meta: [],
    points: [
      "2-day free hands-on workshop",
      "High salary packages & career growth",
      "Workflow integration in ServiceNow",
      "Workshop completion certificate",
    ],
  },
  {
    id: 2,
    badgeLabel: "Language Workshop",
    title: "German Workshop",
    titleHighlight: "Workshop",
    description: "German Language Workshop",
    image: germani,
    meta: [],
    points: [
      "Free 3-day intensive training",
      "Speaking practice & self introduction",
      "Study in Germany guidance",
      "Certificate included",
    ],
  },
  {
    id: 3,
    badgeLabel: "Industry Webinar",
    title: "Databricks Data Analytics",
    titleHighlight: "Data Analytics",
    description: "DataBricks Webinar, Industry Awareness Session",
    image: databricks,
    meta: [
      { icon: CalendarDaysIcon, label: "18 April 2026" },
      { icon: ClockIcon, label: "10:00 AM – 12:00 PM" },
      { icon: ComputerDesktopIcon, label: "Online Live" },
    ],
    points: [
      "Databricks fundamentals & real-world usage",
      "Hands-on data engineering project",
      "Live interactive sessions with an expert",
      "Certification included",
    ],
  },
  {
    id: 4,
    badgeLabel: "Power Workshop",
    title: "German Language 3 Days Workshop",
    titleHighlight: "3 Days Workshop",
    description: "3-Day German Language Power Workshop",
    image: german,
    meta: [],
    points: [
      "Free consulting & counselling",
      "German language roadmap",
      "Basic German speaking practice",
      "Certificate of completion",
    ],
  },
  {
    id: 5,
    badgeLabel: "Training Program",
    title: "Data Analytics",
    titleHighlight: "Analytics",
    description: "Training & Certification",
    image: newposter6,
    meta: [],
    points: [
      "Excel, BI tools & SQL database",
      "Python programming for data",
      "Placement assistance & career guidance",
      "Internship completion certificate",
    ],
  },
  {
    id: 6,
    badgeLabel: "Special Offer",
    title: "Data Analytics",
    titleHighlight: "Analytics",
    description: "Training & Certification",
    image: newposter5,
    meta: [],
    points: [
      "Batches start 6th Oct — ₹18,000 only",
      "3 easy installments, Forage certification",
      "Hands-on practice with real datasets",
      "Placement assistance & career guidance",
    ],
  },
  {
    id: 7,
    badgeLabel: "Seminar",
    title: "Data-Bricks Seminar",
    titleHighlight: "Seminar",
    description: "Data Analytics Engineering On Data-Bricks Seminar",
    image: poster3,
    meta: [],
    points: [
      "Real-time analytics",
      "Concepts of data engineering",
      "Concepts of the Databricks platform",
      "Real-world use cases on Databricks",
    ],
  },
  {
    id: 8,
    badgeLabel: "Professional Training",
    title: "Answercraft",
    titleHighlight: "Answercraft",
    description: "Professional training on communication",
    image: poster4,
    meta: [],
    points: [
      "STAR+ strategy & tactical answering",
      "Persuade without pressure",
      "Interview rehearsal lab with live feedback",
      "Closing impact: negotiation & offer sealing",
    ],
  },
];

// Cycled per point tile so each highlight gets its own icon + soft color chip.
const pointStyles = [
  { Icon: BookOpenIcon, chip: "bg-sky-100 text-sky-600" },
  { Icon: CodeBracketIcon, chip: "bg-violet-100 text-violet-600" },
  { Icon: UserGroupIcon, chip: "bg-rose-100 text-rose-600" },
  { Icon: CheckBadgeIcon, chip: "bg-amber-100 text-amber-600" },
];

const Card = ({ badgeLabel, title, titleHighlight, description, image, meta, points, onClick }) => {
  // Split off the highlighted tail of the title so it can render in the accent gradient.
  const leadTitle =
    titleHighlight && title.endsWith(titleHighlight)
      ? title.slice(0, title.length - titleHighlight.length).trim()
      : "";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      role="button"
      tabIndex={0}
      aria-label={`${title} – open details`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="group relative mx-auto w-full max-w-[880px] cursor-pointer overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-br from-white via-white to-sky-50/60 shadow-xl shadow-slate-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      {/* Decorative soft blobs, echoing the reference design's rounded corner accents */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-200/30 blur-2xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-8 bottom-0 h-28 w-28 rounded-full bg-violet-200/30 blur-2xl" />

      <div className="relative flex flex-col md:flex-row md:items-center">

        {/* Left Side - Poster (fixed frame; posters are never cropped, so their text stays readable) */}
        <div className="relative h-72 w-full flex-shrink-0 overflow-hidden bg-slate-100 sm:h-80 md:aspect-[3/4] md:h-auto md:w-2/5 md:m-4 md:rounded-2xl md:shadow-lg">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-[#2b1450]/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <EyeIcon className="h-10 w-10 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="flex min-h-[13.5rem] flex-1 flex-col justify-center p-6 pt-7 md:min-h-0 md:p-8 md:pt-9">
          <h3 className="mb-2 line-clamp-2 text-2xl font-extrabold leading-tight text-[#171034] md:text-[1.85rem]">
            {leadTitle && <span>{leadTitle} </span>}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              {titleHighlight || title}
            </span>
          </h3>

          <p className="line-clamp-2 text-sm leading-relaxed text-slate-600 md:text-base">
            {description}
          </p>

          {/* Date / time / mode row — only rendered when the poster actually states these */}
          {meta?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {meta.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm"
                >
                  <Icon className="h-4 w-4 text-blue-600" aria-hidden="true" />
                  {label}
                </span>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition-transform duration-200 group-hover:-translate-y-0.5">
            <PlayIcon className="h-4 w-4" aria-hidden="true" />
            Click to learn more
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </div>

          {/* Key points, pulled from the poster, as icon tiles */}
          {points?.length > 0 && (
            <ul className="mt-6 grid grid-cols-1 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2">
              {points.map((point, i) => {
                const { Icon, chip } = pointStyles[i % pointStyles.length];
                return (
                  <li key={point} className="flex items-start gap-2.5">
                    <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${chip}`}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="pt-1 text-sm leading-snug text-slate-600">{point}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Modal Component (unchanged)
const Modal = ({ isOpen, onClose, card }) => {
  if (!card) return null;

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
            onClick={onClose}
          >
            <div
              className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full border border-slate-200 bg-white/90 backdrop-blur-sm hover:bg-slate-100 transition-colors group"
              >
                <XMarkIcon className="h-6 w-6 text-slate-700 group-hover:scale-110 transition-transform" />
              </button>
              
              <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-1/2 h-[300px] md:h-auto relative overflow-hidden bg-slate-50">
                  <img src={card.image} alt={card.title} className="w-full h-full object-contain" />
                </div>
                
                <div className="md:w-1/2 p-6 md:p-8 overflow-y-auto">
                  <div className="space-y-4">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#171034] leading-tight">
                      {card.title}
                    </h2>
                    <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                      {card.description}
                    </p>
                    
                    <div className="pt-6 mt-6 border-t border-slate-100 space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <h3 className="text-[#171034] font-semibold mb-2 text-lg">Training Details</h3>
                          <ul className="space-y-2 text-slate-600">
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-violet-500 rounded-full"></span>Duration: 8 Weeks</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-violet-500 rounded-full"></span>Mode: Online & Offline</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-violet-500 rounded-full"></span>Certificate: Yes</li>
                          </ul>
                        </div>
                        <div className="pt-4">
                          <h3 className="text-[#171034] font-semibold mb-2 text-lg">What You'll Learn</h3>
                          <ul className="space-y-2 text-slate-600">
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>Fundamentals & Advanced Concepts</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>Hands-on Projects</li>
                            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>Industry Best Practices</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="pt-6">
                        <button className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold rounded-lg shadow-md shadow-violet-900/20 transition-all duration-200 transform hover:scale-105">
                          Enroll Now
                        </button>
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
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Auto slide every 2 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cardData.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCard(null), 300);
  };

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Manual navigation: jump a slide and give the user a few seconds before autoplay resumes.
  const pauseThenResume = () => {
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 4000);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + cardData.length) % cardData.length);
    pauseThenResume();
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % cardData.length);
    pauseThenResume();
  };

  const currentCard = cardData[currentIndex];

  return (
    <>
      <div className="w-full py-12">
        <div
          className="relative w-full"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Invisible copy of the current card: keeps the height constant while the visible card fades */}
          <div aria-hidden="true" className="invisible px-5 sm:px-8">
            <Card
              badgeLabel={currentCard.badgeLabel}
              title={currentCard.title}
              titleHighlight={currentCard.titleHighlight}
              description={currentCard.description}
              image={currentCard.image}
              meta={currentCard.meta}
              points={currentCard.points}
              onClick={() => {}}
            />
          </div>

          <div className="absolute inset-0 flex items-center px-5 sm:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}                    // Important for AnimatePresence
                className="w-full"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } }}
                exit={{ opacity: 0, y: -12, transition: { duration: 0.2, ease: "easeIn" } }}
              >
                <Card
                  badgeLabel={currentCard.badgeLabel}
                  title={currentCard.title}
                  titleHighlight={currentCard.titleHighlight}
                  description={currentCard.description}
                  image={currentCard.image}
                  meta={currentCard.meta}
                  points={currentCard.points}
                  onClick={() => handleCardClick(currentCard)}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Prev/Next arrows: sit in the gutter beside the card, never over it */}
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Previous poster"
            className="group absolute left-0 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-violet-200 bg-white/90 text-violet-700 shadow-md shadow-slate-900/10 backdrop-blur transition-all duration-300 hover:-translate-x-1 hover:border-violet-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-violet-600 hover:text-white hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 sm:left-1 lg:flex xl:-left-2"
          >
            <ChevronLeftIcon className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
          </button>

          <button
            type="button"
            onClick={goToNext}
            aria-label="Next poster"
            className="group absolute right-0 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-violet-200 bg-white/90 text-violet-700 shadow-md shadow-slate-900/10 backdrop-blur transition-all duration-300 hover:translate-x-1 hover:border-violet-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-violet-600 hover:text-white hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 sm:right-1 lg:flex xl:-right-2"
          >
            <ChevronRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Optional: Dots Indicator */}
        <div className="mt-6 flex justify-center gap-1">
          {cardData.map((_, index) => (
            <button
              key={index}
              aria-label={`Show slide ${index + 1} of ${cardData.length}`}
              aria-current={index === currentIndex}
              onClick={() => {
                setCurrentIndex(index);
                setIsPaused(true);
                // Resume after 4 seconds of manual interaction
                setTimeout(() => setIsPaused(false), 4000);
              }}
              className="flex h-6 w-6 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span
                className={`block h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-blue-500 scale-125'
                    : 'bg-slate-300 hover:bg-slate-400'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        card={selectedCard} 
      />
    </>
  );
};

export default HorizontalSlider;