import { useState, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  EyeIcon,
  PlayCircleIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BuildingLibraryIcon,
  MapPinIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

/**
 * WHICH PAGE SHOWS WHICH PHOTO
 * Every photo carries a `sections` tag. The page decides what it wants:
 *
 *    <GallerySection section="online" />      // Online Training page
 *    <GallerySection section="classroom" />   // Classroom Training page
 *
 * If you do not pass `section`, it is picked from the page URL automatically:
 * /online-training -> "online", /classroom-training -> "classroom",
 * /corporate... -> "corporate", /overseas... -> "overseas". Anywhere else = show all.
 *
 * Only photos whose `sections` include that value are shown (tabs that end up
 * empty are hidden). Use any of: "online", "classroom", "corporate", "overseas",
 * or "events" (celebrations, job fairs etc. — kept out of the training pages).
 * A photo can belong to more than one page, e.g. sections: ["online", "classroom"].
 * No `section` prop = show everything.
 *
 * Colleges that have signed an MoU get `mou: true` and show in the "MoU" tab; all other
 * colleges show in the "Colleges" tab.
 *
 * For colleges, `sections` on the college is the default for all its photos, and a
 * single photo can override it with its own `sections`.
 */
const galleryItems = [
  {
    id: 1,
    type: "image",
    category: "classroom",
    title: "Live Interactive Sessions",
    description: "Real-time learning with expert instructors",
    image: "/img/live.png",
    sections: ["online"],
    badge: "Live"
  },
  {
    id: 2,
    type: "discussion",
    category: "group",
    title: "Chhatrapati Shivaji Maharaj Jayanti Celebration",
    description: "A group discussion and cultural celebration honoring the legacy of Chhatrapati Shivaji Maharaj.",
    image: "/img/jayanti.jpeg",
    sections: ["events"],
    badge: "Celebration"
  },
  {
    id: 3,
    type: "discussion",
    category: "group",
    title: "Job Fair 2023",
    description: "Interactive group discussion on career opportunities, placements, and experiences from Job Fair 2023.",
    image: "/img/jobfair.jpeg",
    sections: ["events"],
    badge: "Job Fair 2023"
  },
  {
    id: 4,
    type: "discussion",
    category: "group",
    title: "Group Discussion on Emerging Technology",
    description: "Interactive group discussion about technology-driven learning and its impact on education.",
    image: "/img/gd.jpeg",
    sections: ["classroom"],
    badge: "Group Discussion"
  },
  {
    id: 5,
    type: "image",
    category: "projects",
    title: "Hands-on Workshops",
    description: "Practical coding sessions",
    image: "/img/workshop.jpeg",
    sections: ["classroom"],
    badge: "Workshop"
  },
  {
    id: 6,
    type: "image",
    category: "success",
    title: "Certificate Distribution",
    description: "Celebrating student achievements",
    image: "/img/group.jpeg",
    sections: ["classroom"],
    badge: "Certified"
  }
];

/**
 * College-wise training gallery.
 * Each entry is one partner college/institute where SS Infotech has
 * conducted training, workshops, job fairs, etc. Add a new object here
 * for every college — the list item and gallery render automatically.
 *
 * NOTE: names and photos below are sample placeholders. Replace them with
 * the real college names and photos — nothing else needs to change.
 */
const collegeGalleries = [
  {
    id: "raisoni",
    sections: ["classroom"],
    name: "G H Raisoni College of Engineering",
    location: "Nagpur",
    images: [
      {
        src: "/img/rufe/WhatsApp Image 2025-10-01 at 11.23.01 AM.jpeg",
        sections: ["online"],
        caption: "On-campus training session",
      },
      {
        src: "/img/rufe/WhatsApp Image 2025-10-01 at 11.23.01 AM (1).jpeg",
        sections: ["online"],
        caption: "Hands-on workshop",
      },
      {
        src: "/img/rufe/WhatsApp Image 2025-10-01 at 11.23.02 AM.jpeg",
        sections: ["online"],
        caption: "Group activity",
      },
      {
        src: "/img/rufe/WhatsApp Image 2025-10-01 at 11.29.59 AM.jpeg",
        caption: "Interactive session",
      },
      {
        src: "/img/rufe/WhatsApp Image 2025-10-01 at 11.30.23 AM.jpeg",
        caption: "Student engagement",
      },
      {
        src: "/img/rufe/workshop.jpeg",
        caption: "Practical workshop",
      },
      {
        src: "/img/rufe/group.jpeg",
        caption: "Group photo with participants",
      },
    ],
  },
  {
    id: "priyadarshini",
    sections: ["classroom"],
    name: "Priyadarshini College of Engineering",
    location: "Nagpur",
    images: [
      {
        src: "/img/jobfair.jpeg",
        caption: "Job Fair 2023 — career guidance & placement drive",
      },
      {
        src: "/img/gd.jpeg",
        caption: "Group discussion on emerging technology",
      },
    ],
  },
  {
    id: "kdk",
    sections: ["classroom"],
    name: "K.D.K. College of Engineering",
    location: "Nagpur",
    images: [
      {
        src: "/img/workshop.jpeg",
        caption: "Hands-on coding workshop",
      },
      {
        src: "/img/group.jpeg",
        caption: "Certificate distribution",
      },
    ],
  },
  {
    id: "tgpcet",
    sections: ["classroom"],
    name: "TGPCET (Tulsiramji Gaikwad-Patil)",
    location: "Nagpur",
    images: [
      {
        src: "/img/jayanti.jpeg",
        caption: "Chhatrapati Shivaji Maharaj Jayanti celebration",
      },
      {
        src: "/img/live.png",
        sections: ["online"],
        caption: "Live interactive training session",
      },
    ],
  },
  {
    id: "ycce",
    sections: ["classroom"],
    name: "Yeshwantrao Chavan College of Engineering",
    location: "Nagpur",
    images: [
      {
        src: "/img/gd.jpeg",
        caption: "Group discussion session",
      },
      {
        src: "/img/jobfair.jpeg",
        caption: "Placement drive",
      },
      {
        src: "/img/workshop.jpeg",
        caption: "Practical workshop",
      },
    ],
  },
  {
    id: "kksu",
    sections: ["classroom"],
    name: "KKSU, Ramtek",
    location: "Ramtek",
    images: [
      {
        src: "/img/kksu/kksu-1.jpeg",
        caption: "Felicitation of the guest during the campus placement drive",
      },
      {
        src: "/img/kksu/kksu-2.jpeg",
        caption: "Guest speaker addressing students at the campus placement drive",
      },
      {
        src: "/img/kksu/kksu-3.jpeg",
        caption: "Group photo of students and faculty after the placement drive",
      },
      {
        src: "/img/kksu/kksu-4.jpeg",
        caption: "Inauguration of the campus placement drive — lamp lighting",
      },
      {
        src: "/img/kksu/kksu-5.jpeg",
        caption: "Career guidance session for students during the placement drive",
      },
    ],
  },
  {
    id: "cet",
    sections: ["classroom"],
    name: "College of Engineering and Technology",
    images: [
      {
        src: "/img/cet/cet-1.jpeg",
        caption: "GEN-AI session — live demo for students",
      },
      {
        src: "/img/cet/cet-2.jpeg",
        caption: "Trainer explaining GEN-AI concepts on screen",
      },
      {
        src: "/img/cet/cet-3.jpeg",
        caption: "Students attending the GEN-AI session in the computer lab",
      },
      {
        src: "/img/cet/cet-4.jpeg",
        caption: "GEN-AI training session in progress",
      },
    ],
  },
  {
    id: "ghriet",
    mou: true, // MoU signed — shows in the "MoU" tab
    sections: ["classroom"],
    name: "G H Raisoni Institute of Engineering & Technology",
    location: "Nagpur",
    images: [
      {
        src: "/img/ghriet/mou.jpg",
        caption: "MoU signing — Dept. of Computer Science & Engineering (Cyber Security)",
      },
    ],
  },
];

/*
 * Layout CSS for the Colleges tab. Written as plain CSS (not Tailwind classes)
 * so the sidebar/grid layout works regardless of Tailwind content-scan or
 * breakpoint config.
 */
const collegeGalleryCss = `
.cg-layout{display:grid;grid-template-columns:minmax(0,1fr);gap:1.5rem;width:100%;max-width:100%;min-width:0;align-items:start}
.cg-list{display:flex;flex-direction:column;gap:.625rem;min-width:0;padding:4px}
.cg-panel{min-width:0;max-width:100%}
.cg-grid{display:grid;gap:.75rem;grid-template-columns:repeat(3,minmax(0,1fr))}
@media (min-width:640px){.cg-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}
@media (min-width:768px){
  .cg-layout{grid-template-columns:280px minmax(0,1fr)}
  .cg-list{position:sticky;top:6rem;max-height:560px;overflow-y:auto}
}
.cg-lb{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:1rem;background:rgba(0,0,0,.88)}
.cg-lb-card{position:relative;display:flex;flex-direction:column;width:100%;max-width:900px;max-height:88vh;overflow:hidden;border-radius:1rem;background:#fff;box-shadow:0 25px 60px rgba(0,0,0,.5)}
.cg-lb-img{display:block;width:100%;max-height:68vh;object-fit:contain;background:#0f0b24}
.cg-lb-info{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.5rem;padding:.875rem 1.25rem;background:#fff;border-top:1px solid #f1f5f9}
.cg-lb-btn{position:fixed;z-index:100000;display:flex;align-items:center;justify-content:center;width:48px;height:48px;border:2px solid rgba(255,255,255,.7);border-radius:9999px;background:rgba(0,0,0,.55);color:#fff;cursor:pointer;transition:background .2s,transform .2s}
.cg-lb-btn:hover{background:rgba(124,58,237,.95);transform:scale(1.08)}
.cg-lb-btn svg{width:24px;height:24px;stroke-width:2.5}
.cg-lb-prev{left:12px;top:50%;margin-top:-24px}
.cg-lb-next{right:12px;top:50%;margin-top:-24px}
.cg-lb-close{right:12px;top:12px}
@media (min-width:768px){.cg-lb-prev{left:32px}.cg-lb-next{right:32px}.cg-lb-close{right:32px;top:24px}}
.cg-play{position:absolute;top:50%;left:50%;width:44px;height:44px;margin:-22px 0 0 -22px;display:flex;align-items:center;justify-content:center;border-radius:9999px;background:rgba(0,0,0,.55);border:2px solid rgba(255,255,255,.85);color:#fff;pointer-events:none}
.cg-play svg{width:24px;height:24px}
.cg-tag{position:absolute;left:0;right:0;bottom:0;padding:1rem .375rem .25rem;font-size:10px;font-weight:600;line-height:1.2;color:#fff;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:linear-gradient(to top,rgba(0,0,0,.78),transparent);pointer-events:none}
@media (min-width:1024px){.cg-grid{grid-template-columns:repeat(6,minmax(0,1fr))}}
@media (min-width:1280px){.cg-grid{grid-template-columns:repeat(7,minmax(0,1fr))}}
`;

// Which page are we on? (used only when no `section` prop is passed)
function sectionFromPath() {
  if (typeof window === "undefined") return "all";
  const path = window.location.pathname.toLowerCase();
  if (path.includes("online")) return "online";
  if (path.includes("classroom")) return "classroom";
  if (path.includes("corporate")) return "corporate";
  if (path.includes("overseas")) return "overseas";
  return "all";
}

// Does a photo (or college) with these tags belong on this page?
const matchesSection = (tags, section) =>
  section === "all" || (Array.isArray(tags) && tags.includes(section));

// Everything the gallery needs, filtered for one page/section
function buildSectionData(section) {
  const items = galleryItems.filter((item) => matchesSection(item.sections, section));

  const colleges = collegeGalleries
    .map((college) => ({
      ...college,
      images: college.images.filter((img) =>
        matchesSection(img.sections ?? college.sections, section),
      ),
    }))
    .filter((college) => college.images.length > 0);

  // Every college photo in one flat list (default "All Colleges" view)
  const allImages = colleges.flatMap((college) =>
    college.images.map((img) => ({
      ...img,
      collegeId: college.id,
      collegeName: college.name,
    })),
  );

  return { items, colleges, allImages };
}

// Sub-heading text per page (falls back to the generic one)
const sectionCopy = {
  online: "Get a glimpse of our live online sessions, student engagement, and success stories",
  classroom: "Get a glimpse of our interactive classrooms, workshops, campus events, and success stories",
};
const defaultCopy =
  "Get a glimpse of our interactive classrooms, student projects, and success stories";

export default function GallerySection({ section: sectionProp }) {
  const section = sectionProp ?? sectionFromPath();
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);

  // Which college is selected in the list. null = "All Colleges" (default)
  const [selectedCollegeIndex, setSelectedCollegeIndex] = useState(null);

  // Lightbox state: the list of images currently being browsed + current index
  const [lightbox, setLightbox] = useState(null); // { items, index }

  const openLightbox = (items, index) => setLightbox({ items, index });
  const closeLightbox = () => setLightbox(null);

  const stepLightbox = useCallback((direction) => {
    setLightbox((current) => {
      if (!current) return current;
      const count = current.items.length;
      return { ...current, index: (current.index + direction + count) % count };
    });
  }, []);

  // Keyboard navigation for the lightbox
  useEffect(() => {
    if (!lightbox) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") stepLightbox(1);
      if (e.key === "ArrowLeft") stepLightbox(-1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightbox, stepLightbox]);

  const activeItem = lightbox ? lightbox.items[lightbox.index] : null;

  // Data for this page only
  const { items, colleges, allImages } = useMemo(() => buildSectionData(section), [section]);

  // Colleges with an MoU go in the "MoU" tab, the rest in "Colleges"
  const mouColleges = colleges.filter((c) => c.mou);
  const regularColleges = colleges.filter((c) => !c.mou);

  // Tabs: only the ones that actually have photos on this page
  const tabs = [
    { id: "all", label: "All", count: items.length },
    { id: "classroom", label: "Classroom", count: items.filter((i) => i.category === "classroom").length },
    { id: "projects", label: "Projects", count: items.filter((i) => i.category === "projects").length },
    { id: "success", label: "Success", count: items.filter((i) => i.category === "success").length },
    { id: "colleges", label: "Colleges", count: regularColleges.length },
    { id: "mou", label: "MoU", count: mouColleges.length },
  ].filter((tab) => tab.count > 0);

  // Active tab falls back to the first available one
  const activeGalleryTab = tabs.some((t) => t.id === selectedTab) ? selectedTab : tabs[0]?.id;

  // The "Colleges" and "MoU" tabs share one layout, each with its own college list
  const isCollegeTab = activeGalleryTab === "colleges" || activeGalleryTab === "mou";
  const isMouTab = activeGalleryTab === "mou";
  const tabColleges = isMouTab ? mouColleges : regularColleges;
  const tabImages = tabColleges.flatMap((college) =>
    college.images.map((img) => ({
      ...img,
      collegeId: college.id,
      collegeName: college.name,
    })),
  );
  const allLabel = isMouTab ? "All MoU Colleges" : "All Colleges";

  // Selected college (null when showing all colleges)
  const selectedCollege =
    selectedCollegeIndex === null
      ? null
      : tabColleges[selectedCollegeIndex] ?? null;

  // Images shown in the gallery panel: all photos by default, or one college's photos
  const visibleImages = selectedCollege
    ? selectedCollege.images.map((img) => ({
        ...img,
        collegeId: selectedCollege.id,
        collegeName: selectedCollege.name,
      }))
    : tabImages;

  // Filter gallery items
  const filteredGallery = activeGalleryTab === "all"
    ? items
    : items.filter((item) => item.category === activeGalleryTab);

  // Nothing tagged for this page yet
  if (tabs.length === 0) {
    return (
      <section className="mb-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Our Learning Journey</h2>
        <p className="text-lg text-foreground/70">Photos coming soon.</p>
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4 }}
      className="mb-20"
    >
      <style>{collegeGalleryCss}</style>
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 border border-violet-200 mb-4"
        >
          <EyeIcon className="w-4 h-4 text-violet-600" />
          <span className="text-sm font-semibold text-violet-700">Learning Experience</span>
        </motion.div>
        <h2 id="learning-journey-heading" className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-4">
          Explore Our Learning Journey
        </h2>
        <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
          {sectionCopy[section] ?? defaultCopy}
        </p>
      </div>

      {/* Gallery Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="flex flex-wrap justify-center gap-2 mb-8"
      >
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedTab(tab.id);
              setSelectedCollegeIndex(null);
            }}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 ${
              activeGalleryTab === tab.id
                ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-violet-600/25"
                : "bg-white border border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-700 hover:shadow-sm"
            }`}
          >
            {tab.label}
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                activeGalleryTab === tab.id
                  ? "bg-white/20 text-white"
                  : "bg-violet-50 text-violet-700"
              }`}
            >
              {tab.count}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Colleges — college list on the left, all photos by default / selected college on the right */}
      {isCollegeTab ? (
        <div className="cg-layout">

          {/* College list (vertical, one below another) — first item shows all photos */}
          <div className="cg-list">
            {[
              {
                key: "all",
                isActive: selectedCollegeIndex === null,
                onClick: () => setSelectedCollegeIndex(null),
                Icon: PhotoIcon,
                title: allLabel,
                subtitle: "Show all photos",
                count: tabImages.length,
              },
              ...tabColleges.map((college, collegeIndex) => ({
                key: college.id,
                isActive: collegeIndex === selectedCollegeIndex,
                onClick: () => setSelectedCollegeIndex(collegeIndex),
                Icon: BuildingLibraryIcon,
                title: college.name,
                subtitle: college.location,
                count: college.images.length,
              })),
            ].map(({ key, isActive, onClick, Icon, title, subtitle, count }) => (
              <motion.button
                key={key}
                type="button"
                onClick={onClick}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                aria-pressed={isActive}
                className={`relative isolate flex w-full items-center gap-2.5 overflow-hidden rounded-2xl border px-4 py-3 text-left transition-colors duration-300 ${
                  isActive
                    ? "border-transparent text-white shadow-lg shadow-violet-600/25"
                    : "border-slate-200 bg-white text-slate-700 hover:border-violet-300 hover:shadow-sm"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="college-active-bg"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600 to-violet-600"
                  />
                )}
                <span
                  className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-300 ${
                    isActive ? "bg-white/20" : "bg-violet-50 text-violet-600"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="relative z-10 min-w-0 flex-1">
                  <span className="block text-sm font-semibold leading-tight">
                    {title}
                  </span>
                  {subtitle && (
                    <span
                      className={`block text-[11px] leading-tight ${
                        isActive ? "text-white/75" : "text-slate-500"
                      }`}
                    >
                      {subtitle}
                    </span>
                  )}
                </span>
                <span
                  className={`relative z-10 ml-1 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isActive ? "bg-white/20" : "bg-violet-50 text-violet-700"
                  }`}
                >
                  {count}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Gallery panel — all photos by default, or only the selected college's photos */}
          <div className="cg-panel">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCollege ? selectedCollege.id : "all"}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="rounded-3xl border border-slate-200 bg-slate-50/60 p-5 sm:p-6"
              >
                {/* Heading */}
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-md shadow-violet-600/20">
                      {selectedCollege ? (
                        <BuildingLibraryIcon className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <PhotoIcon className="h-5 w-5" aria-hidden="true" />
                      )}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-foreground sm:text-2xl">
                        {selectedCollege ? selectedCollege.name : allLabel}
                      </h3>
                      {(!selectedCollege || selectedCollege.location) && (
                        <p className="mt-0.5 flex items-center gap-1 text-sm text-foreground/60">
                          <MapPinIcon className="h-3.5 w-3.5" aria-hidden="true" />
                          {selectedCollege
                            ? selectedCollege.location
                            : `${tabColleges.length} ${isMouTab ? "MoU partner colleges" : "partner colleges"}`}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
                    <PhotoIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    {visibleImages.length}{" "}
                    {visibleImages.length === 1 ? "Photo" : "Photos"}
                  </span>
                </div>

                {/* Image Grid — 6-7 images per row on desktop */}
                <div className="cg-grid">
                  {visibleImages.map((img, imageIndex) => (
                    <motion.button
                      key={`${img.collegeId}-${imageIndex}`}
                      type="button"
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: Math.min(imageIndex, 20) * 0.03 }}
                      whileHover={{ y: -4 }}
                      onClick={() => openLightbox(visibleImages, imageIndex)}
                      className="group relative aspect-square min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-violet-600/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                    >
                      <img
                        src={img.type === "video" ? img.poster : img.src}
                        alt={img.caption || img.collegeName}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                      />
                      {img.type === "video" && (
                        <span className="cg-play" aria-hidden="true">
                          <PlayCircleIcon />
                        </span>
                      )}
                      {/* Hover overlay with zoom cue */}
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#171034] shadow-md">
                          <EyeIcon className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </div>
                      {/* College name tag — only in the "All Colleges" view */}
                      {!selectedCollege && (
                        <span className="cg-tag">
                          {img.collegeName}
                        </span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      ) : (

      /* Gallery Grid */
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredGallery.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                delay: index * 0.1,
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-violet-600/10 cursor-pointer"
              onClick={() => setSelectedImage(item)}
            >
              {/* Image Container */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.badge === "Live"
                        ? "bg-red-500/20 text-red-500"
                        : item.badge === "Projects"
                        ? "bg-green-500/20 text-green-500"
                        : item.badge === "Success"
                        ? "bg-yellow-500/20 text-yellow-500"
                        : "bg-primary/20 text-primary"
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>

                {/* Video Play Button */}
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                    >
                      <PlayCircleIcon className="w-8 h-8 text-white" />
                    </motion.div>
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-foreground/70">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      )}

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-full bg-white rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">{selectedImage.title}</h3>
                <p className="text-foreground/70 mb-6">{selectedImage.description}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(null)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold"
                >
                  Close Preview
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Lightbox — rendered on document.body so it always sits above the page */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {lightbox && activeItem && (
              <motion.div
                key="cg-lightbox"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="cg-lb"
                onClick={closeLightbox}
              >
                {/* Close */}
                <button
                  type="button"
                  onClick={closeLightbox}
                  aria-label="Close image preview"
                  className="cg-lb-btn cg-lb-close"
                >
                  <XMarkIcon aria-hidden="true" />
                </button>

                {/* Previous / Next arrows */}
                {lightbox.items.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        stepLightbox(-1);
                      }}
                      aria-label="Previous image"
                      className="cg-lb-btn cg-lb-prev"
                    >
                      <ChevronLeftIcon aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        stepLightbox(1);
                      }}
                      aria-label="Next image"
                      className="cg-lb-btn cg-lb-next"
                    >
                      <ChevronRightIcon aria-hidden="true" />
                    </button>
                  </>
                )}

                <motion.div
                  key={lightbox.index}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="cg-lb-card"
                  onClick={(e) => e.stopPropagation()}
                >
                  {activeItem.type === "video" ? (
                    <video
                      key={activeItem.src}
                      src={activeItem.src}
                      poster={activeItem.poster}
                      controls
                      autoPlay
                      playsInline
                      preload="metadata"
                      aria-label={activeItem.caption || activeItem.collegeName}
                      className="cg-lb-img"
                    />
                  ) : (
                    <img
                      src={activeItem.src}
                      alt={activeItem.caption || activeItem.collegeName}
                      className="cg-lb-img"
                    />
                  )}
                  <div className="cg-lb-info">
                    <div>
                      <p className="text-sm font-bold text-foreground sm:text-base">
                        {activeItem.collegeName}
                      </p>
                      {activeItem.caption && (
                        <p className="mt-0.5 text-xs text-foreground/60 sm:text-sm">
                          {activeItem.caption}
                        </p>
                      )}
                    </div>
                    {lightbox.items.length > 1 && (
                      <span className="shrink-0 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                        {lightbox.index + 1} / {lightbox.items.length}
                      </span>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </motion.section>
  );
}