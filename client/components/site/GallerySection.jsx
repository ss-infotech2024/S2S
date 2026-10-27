import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  EyeIcon,
  PlayCircleIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BuildingLibraryIcon,
  MapPinIcon,
  PhotoIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/outline";

/**
 * WHICH PAGE SHOWS WHICH PHOTO
 * Every photo carries a `sections` tag. The page decides what it wants:
 *
 *    <GallerySection section="online" />      // Online Training page
 *    <GallerySection section="classroom" />   // Classroom Training page
 *
 * If you do not pass `section`, the "classroom" set is shown, so the gallery looks
 * exactly the same on every page (Online, Classroom, Corporate...).
 *
 * Only photos whose `sections` include that value are shown (tabs that end up
 * empty are hidden). Use any of: "online", "classroom", "corporate", "overseas",
 * or "events" (celebrations, job fairs etc. — kept out of the training pages).
 * A photo can belong to more than one page, e.g. sections: ["online", "classroom"].
 * No `section` prop = the "classroom" set.
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
  },
  {
    id: 7,
    type: "image",
    category: "celebration",
    title: "Independence Day Celebration",
    description: "Group photo with students and team on Independence Day",
    image: "/img/celebration/celebration-1.jpg",
    sections: ["classroom", "online"],
    badge: "Celebration"
  },
  {
    id: 8,
    type: "image",
    category: "celebration",
    title: "Independence Day Celebration",
    description: "Classroom decorated in tricolour for Independence Day",
    image: "/img/celebration/celebration-2.jpg",
    sections: ["classroom", "online"],
    badge: "Celebration"
  },
  {
    id: 9,
    type: "image",
    category: "celebration",
    title: "Independence Day Celebration",
    description: "Address to students during the Independence Day programme",
    image: "/img/celebration/celebration-3.jpg",
    sections: ["classroom", "online"],
    badge: "Celebration"
  },
  {
    id: 10,
    type: "image",
    category: "celebration",
    title: "Independence Day Celebration",
    description: "Team celebrating Independence Day on the terrace",
    image: "/img/celebration/celebration-4.jpg",
    sections: ["classroom", "online"],
    badge: "Celebration"
  },
  {
    id: 11,
    type: "image",
    category: "celebration",
    title: "Independence Day Celebration",
    description: "Students and staff together on Independence Day",
    image: "/img/celebration/celebration-5.jpg",
    sections: ["classroom", "online"],
    badge: "Celebration"
  },
  {
    id: 12,
    type: "image",
    category: "celebration",
    title: "Independence Day Celebration",
    description: "Students and team members on the terrace after the flag hoisting",
    image: "/img/celebration/celebration-6.jpg",
    sections: ["classroom", "online"],
    badge: "Celebration"
  },
  {
    id: 13,
    type: "image",
    category: "celebration",
    title: "Independence Day Celebration",
    description: "Floral tribute at the Independence Day celebration",
    image: "/img/celebration/celebration-7.jpg",
    sections: ["classroom", "online"],
    badge: "Celebration"
  },
  {
    id: 16,
    type: "image",
    category: "celebration",
    title: "Independence Day Celebration",
    description: "Flag hoisting on Independence Day",
    image: "/img/celebration/celebration-10.jpg",
    sections: ["classroom", "online"],
    badge: "Celebration"
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
        src: "/img/rufe/WhatsApp Image 2025-10-01 at 11.23.02 AM.jpeg",
        sections: ["online"],
        caption: "Group activity",
      },
      {
        src: "/img/gd.jpeg",
        caption: "Interactive session",
      },
      {
        src: "/img/rufe/WhatsApp Image 2025-10-01 at 11.30.23 AM.jpeg",
        caption: "Student engagement",
      },
      {
        src: "/img/workshop.jpeg",
        caption: "Practical workshop",
      },
      {
        src: "/img/rufe/group.jpeg",
        caption: "Group photo with participants",
      },
    ],
  },
  {
    id: "ghrstu",
    sections: ["classroom"],
    name: "G H Raisoni Skill Tech University",
    location: "Nagpur",
    images: [
      { src: "/img/ghrstu/ghrstu-1.jpg", caption: "Industrial visit — group photo of students and faculty at SS Infotech" },
      { src: "/img/ghrstu/ghrstu-2.jpg", caption: "Students and faculty during the industrial visit" },
      { src: "/img/ghrstu/ghrstu-3.jpg", caption: "Interactive session with students during the industrial visit" },
      { src: "/img/ghrstu/ghrstu-7.jpg", caption: "Students attending the session" },
      { src: "/img/ghrstu/ghrstu-11.jpg", caption: "Technical session with a presentation for students during the industrial visit" },
      { src: "/img/ghrstu/ghrstu-12.jpg", caption: "Trainer interacting with students during the session" },
      { src: "/img/ghrstu/ghrstu-13.jpg", caption: "Trainer explaining a concept to students" },
      { src: "/img/ghrstu/ghrstu-14.jpg", caption: "Interactive activity — students raising hands to participate" },
      { src: "/img/ghrstu/ghrstu-16.jpg", caption: "Trainer interacting with students during the industrial visit" },
      { src: "/img/ghrstu/ghrstu-17.jpg", caption: "Trainer addressing students during the session" },
      { src: "/img/ghrstu/ghrstu-18.jpg", caption: "Discussion with students during the session" },
      { src: "/img/ghrstu/ghrstu-19.jpg", caption: "Trainer speaking with students during the session" },
      { src: "/img/ghrstu/ghrstu-20.jpg", caption: "Trainers and faculty with students during the session" },
      { src: "/img/ghrstu/ghrstu-21.jpg", caption: "Students attentively following the session" },
      { src: "/img/ghrstu/ghrstu-22.jpg", caption: "Students taking part in the session" },
      { src: "/img/ghrstu/ghrstu-23.jpg", caption: "Students attending the session" },
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
    id: "ycce-mou",
    mou: true, // MoU signed — shows in the "MoU" tab
    sections: ["classroom"],
    name: "Yeshwantrao Chavan College of Engineering",
    location: "Nagpur",
    images: [
      { src: "/img/mou/ycce/mou-1.jpeg", caption: "MoU document handover at SS Infotech" },
      { src: "/img/mou/ycce/mou-2.jpeg", caption: "Exchange of the signed MoU" },
      { src: "/img/mou/ycce/mou-3.jpeg", caption: "MoU exchange between YCCE and SS Infotech" },
      { src: "/img/mou/ycce/mou-6.jpeg", caption: "YCCE and SS Infotech MoU handover" },
      { src: "/img/mou/ycce/mou-7.jpeg", caption: "MoU discussion and review" },
      { src: "/img/mou/ycce/mou-8.jpeg", caption: "Reviewing the MoU terms" },
      { src: "/img/mou/ycce/mou-9.jpeg", caption: "MoU signing" },
      { src: "/img/mou/ycce/mou-11.jpeg", caption: "MoU signing in progress" },
    ],
  },
  {
    id: "atos-mou",
    mou: true, // MoU signed — shows in the "MoU" tab
    sections: ["classroom"],
    name: "ATOS",
    images: [
      { src: "/img/mou/atos/mou-1.jpeg", caption: "MoU meeting — welcome and felicitation with the team" },
      { src: "/img/mou/atos/mou-2.jpeg", caption: "ATOS and SS Infotech team after the MoU meeting" },
      { src: "/img/mou/atos/mou-4.jpeg", caption: "Felicitation during the MoU meeting" },
      { src: "/img/mou/atos/mou-6.jpeg", caption: "Welcoming the guests with a bouquet" },
      { src: "/img/mou/atos/mou-7.jpeg", caption: "Discussion during the MoU meeting" },
      { src: "/img/mou/atos/mou-8.jpeg", caption: "Interaction with the ATOS team" },
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

// Keep only the first copy of any photo that is used under more than one college
const uniqueBySrc = (list) => {
  const seen = new Set();
  return list.filter((img) => {
    if (seen.has(img.src)) return false;
    seen.add(img.src);
    return true;
  });
};

// Does a photo (or college) with these tags belong on this page?
const matchesSection = (tags, section) =>
  section === "all" || (Array.isArray(tags) && tags.includes(section));

// Turn a general photo (galleryItems entry) into the shape the masonry card + lightbox use
const itemToMedia = (item) => ({
  key: `item-${item.id}`,
  src: item.image,
  type: item.type === "video" ? "video" : "image",
  title: item.title,
  sub: item.description,
  badge: item.badge,
});

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

  // "All" tab: every photo for this page — general/celebration photos first, then MoU colleges,
  // then the other colleges. A file that is used in several places is only shown once.
  const seen = new Set();
  const everything = [];
  const addUnique = (media) => {
    if (seen.has(media.src)) return;
    seen.add(media.src);
    everything.push(media);
  };
  items.forEach((item) => addUnique(itemToMedia(item)));
  [...colleges.filter((c) => c.mou), ...colleges.filter((c) => !c.mou)].forEach((college) =>
    college.images.forEach((img, index) =>
      addUnique({
        key: `${college.id}-${index}`,
        src: img.src,
        poster: img.poster,
        type: img.type,
        title: college.name,
        sub: img.caption,
        badge: college.mou ? "MoU" : "College",
      }),
    ),
  );

  return { items, colleges, allImages, everything };
}

// Sub-heading text per page (falls back to the generic one)
const sectionCopy = {
  online: "Get a glimpse of our live online sessions, student engagement, and success stories",
  classroom: "Get a glimpse of our interactive classrooms, workshops, campus events, and success stories",
};
const defaultCopy =
  "Get a glimpse of our interactive classrooms, student projects, and success stories";

/*
 * Gallery styles. Plain CSS (not Tailwind classes) so the layout, masonry and
 * lightbox behave the same regardless of Tailwind content-scan / breakpoint config.
 * Everything is namespaced with `ssg-` so nothing leaks into the rest of the site.
 */
const galleryCss = `
.ssg{--ssg-ink:#0f172a;--ssg-line:#e2e8f0;--ssg-mute:#64748b;--ssg-accent:#7c3aed;--ssg-accent-soft:#f5f3ff;--ssg-accent-line:#ddd6fe;width:100%;max-width:100%;min-width:0}

/* ---------- Filter pills ---------- */
.ssg-pills{display:flex;flex-wrap:wrap;justify-content:center;gap:.5rem;margin:0 0 2rem}
.ssg-pill{display:inline-flex;align-items:center;gap:.5rem;padding:.5rem .5rem .5rem 1rem;border:1px solid var(--ssg-line);border-radius:9999px;background:#fff;color:#475569;font-size:.875rem;font-weight:600;line-height:1.25rem;letter-spacing:-.005em;white-space:nowrap;cursor:pointer;transition:color .2s,border-color .2s,background-color .2s,box-shadow .25s}
.ssg-pill:hover{border-color:#c4b5fd;color:#6d28d9;box-shadow:0 4px 14px -8px rgba(109,40,217,.45)}
.ssg-pill:focus-visible{outline:2px solid var(--ssg-accent);outline-offset:2px}
.ssg-pill-count{min-width:1.5rem;padding:.125rem .5rem;border-radius:9999px;background:var(--ssg-accent-soft);color:#6d28d9;font-size:.6875rem;font-weight:700;text-align:center;font-variant-numeric:tabular-nums;transition:background-color .2s,color .2s}
.ssg-pill.is-active{border-color:transparent;color:#fff;background:linear-gradient(135deg,#2563eb 0%,#7c3aed 100%);box-shadow:0 8px 20px -8px rgba(91,33,182,.55)}
.ssg-pill.is-active .ssg-pill-count{background:rgba(255,255,255,.2);color:#fff}
@media (max-width:639px){
  .ssg-pills{flex-wrap:nowrap;justify-content:flex-start;overflow-x:auto;margin:0 -1rem 1.5rem;padding:.25rem 1rem .5rem;scrollbar-width:none;-webkit-overflow-scrolling:touch;scroll-snap-type:x proximity}
  .ssg-pills::-webkit-scrollbar{display:none}
  .ssg-pill{flex:0 0 auto;scroll-snap-align:start}
}

/* ---------- Masonry + cards ---------- */
.ssg-masonry{column-count:2;column-gap:.625rem}
.ssg-card{position:relative;display:block;width:100%;margin:0 0 .625rem;padding:0;break-inside:avoid;-webkit-column-break-inside:avoid;page-break-inside:avoid;overflow:hidden;border:1px solid rgba(226,232,240,.9);border-radius:.875rem;background:#f1f5f9;text-align:left;cursor:zoom-in;box-shadow:0 1px 2px rgba(15,23,42,.05),0 6px 16px -8px rgba(15,23,42,.14);transition:box-shadow .4s ease,border-color .4s ease;-webkit-tap-highlight-color:transparent}
.ssg-card:not(.is-loaded){min-height:110px;background:linear-gradient(100deg,#f1f5f9 30%,#e8edf4 50%,#f1f5f9 70%);background-size:200% 100%;animation:ssg-shimmer 1.4s linear infinite}
@keyframes ssg-shimmer{to{background-position:-200% 0}}
.ssg-card:hover{border-color:#cbd5e1;box-shadow:0 2px 4px rgba(15,23,42,.06),0 22px 40px -18px rgba(15,23,42,.34)}
.ssg-card:focus-visible{outline:2px solid var(--ssg-accent);outline-offset:2px}
.ssg-card-img{display:block;width:100%;height:auto;opacity:0;transform:scale(1);transition:transform .8s cubic-bezier(.2,.7,.2,1),opacity .5s ease}
.ssg-card.is-loaded .ssg-card-img{opacity:1}
.ssg-card:hover .ssg-card-img,.ssg-card:focus-visible .ssg-card-img{transform:scale(1.06)}
.ssg-badge{position:absolute;top:.5rem;left:.5rem;z-index:2;padding:.125rem .5rem;border:1px solid rgba(255,255,255,.7);border-radius:9999px;background:rgba(255,255,255,.88);color:#334155;font-size:.625rem;font-weight:600;line-height:1rem;letter-spacing:.01em;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);box-shadow:0 1px 2px rgba(15,23,42,.08)}
.ssg-zoom{position:absolute;top:.5rem;right:.5rem;z-index:2;display:flex;align-items:center;justify-content:center;width:1.75rem;height:1.75rem;border-radius:9999px;background:rgba(255,255,255,.9);color:#334155;opacity:0;transform:translateY(-4px) scale(.92);transition:opacity .3s ease,transform .3s ease;box-shadow:0 2px 8px rgba(15,23,42,.18)}
.ssg-zoom svg{width:.875rem;height:.875rem;stroke-width:2}
.ssg-card:hover .ssg-zoom,.ssg-card:focus-visible .ssg-zoom{opacity:1;transform:none}
.ssg-over{position:absolute;inset:0;z-index:1;display:flex;flex-direction:column;justify-content:flex-end;gap:.125rem;padding:2rem .625rem .625rem;color:#fff;background:linear-gradient(to top,rgba(10,10,25,.82) 0%,rgba(10,10,25,.35) 45%,transparent 75%);opacity:0;transition:opacity .35s ease}
.ssg-over>*{transform:translateY(6px);transition:transform .4s ease}
.ssg-card:hover .ssg-over,.ssg-card:focus-visible .ssg-over{opacity:1}
.ssg-card:hover .ssg-over>*,.ssg-card:focus-visible .ssg-over>*{transform:none}
.ssg-over-title{font-size:.75rem;font-weight:600;line-height:1.3;letter-spacing:-.005em}
.ssg-over-sub{font-size:.6875rem;line-height:1.4;color:rgba(255,255,255,.78);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.ssg-play{position:absolute;top:50%;left:50%;z-index:2;display:flex;align-items:center;justify-content:center;width:2.75rem;height:2.75rem;margin:-1.375rem 0 0 -1.375rem;border:1.5px solid rgba(255,255,255,.9);border-radius:9999px;background:rgba(10,10,25,.5);color:#fff;pointer-events:none;backdrop-filter:blur(4px)}
.ssg-play svg{width:1.5rem;height:1.5rem}
@media (hover:none){
  .ssg-over{opacity:1;padding-top:2rem;background:linear-gradient(to top,rgba(10,10,25,.7) 0%,transparent 60%)}
  .ssg-over>*{transform:none}
  .ssg-over-sub,.ssg-zoom{display:none}
}
/* Compact thumbnails: more columns = smaller photos */
@media (min-width:640px){.ssg-masonry.ssg-masonry--wide{column-count:3}}
@media (min-width:900px){.ssg-masonry.ssg-masonry--wide{column-count:4}}
@media (min-width:1100px){.ssg-masonry.ssg-masonry--wide{column-count:5}}
@media (min-width:1500px){.ssg-masonry.ssg-masonry--wide{column-count:6}}
@media (min-width:900px){.ssg-masonry:not(.ssg-masonry--wide){column-count:3}}
@media (min-width:1100px){.ssg-masonry:not(.ssg-masonry--wide){column-count:4}}
@media (min-width:1500px){.ssg-masonry:not(.ssg-masonry--wide){column-count:5}}

/* ---------- Colleges / MoU layout ---------- */
.ssg-layout{display:grid;grid-template-columns:minmax(0,1fr);gap:1.25rem;align-items:start;width:100%;min-width:0}
.ssg-list{display:flex;flex-direction:row;gap:.5rem;min-width:0;margin:0 -1rem;padding:.25rem 1rem .5rem;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.ssg-list::-webkit-scrollbar{display:none}
.ssg-college{position:relative;display:flex;flex:0 0 auto;align-items:center;gap:.75rem;min-width:13.5rem;max-width:17rem;padding:.75rem .875rem;border:1px solid var(--ssg-line);border-radius:.875rem;background:#fff;text-align:left;cursor:pointer;transition:border-color .25s,background-color .25s,box-shadow .25s}
.ssg-college:hover{border-color:#c4b5fd;box-shadow:0 8px 20px -14px rgba(76,29,149,.5)}
.ssg-college:focus-visible{outline:2px solid var(--ssg-accent);outline-offset:2px}
.ssg-college-ico{display:flex;flex:0 0 auto;align-items:center;justify-content:center;width:2.25rem;height:2.25rem;border-radius:.625rem;background:var(--ssg-accent-soft);color:#6d28d9;transition:background .25s,color .25s}
.ssg-college-ico svg{width:1.125rem;height:1.125rem}
.ssg-college-txt{min-width:0;flex:1 1 auto}
.ssg-college-name{display:block;color:#1e293b;font-size:.875rem;font-weight:600;line-height:1.25;letter-spacing:-.005em}
.ssg-college-loc{display:block;margin-top:.125rem;color:var(--ssg-mute);font-size:.75rem;line-height:1.2}
.ssg-college-count{flex:0 0 auto;padding:.125rem .5rem;border-radius:9999px;background:#f1f5f9;color:#475569;font-size:.6875rem;font-weight:700;font-variant-numeric:tabular-nums;transition:background .25s,color .25s}
.ssg-college.is-active{border-color:var(--ssg-accent-line);background:var(--ssg-accent-soft);box-shadow:0 8px 20px -14px rgba(76,29,149,.55)}
.ssg-college.is-active .ssg-college-ico{background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff}
.ssg-college.is-active .ssg-college-name{color:#4c1d95}
.ssg-college.is-active .ssg-college-count{background:#fff;color:#6d28d9}
.ssg-panel{min-width:0;max-width:100%;padding:1rem;border:1px solid var(--ssg-line);border-radius:1.5rem;background:#fff;box-shadow:0 1px 2px rgba(15,23,42,.04),0 18px 40px -28px rgba(15,23,42,.25)}
.ssg-panel-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.75rem;margin-bottom:1.25rem;padding-bottom:1rem;border-bottom:1px solid #f1f5f9}
.ssg-panel-ico{display:flex;align-items:center;justify-content:center;width:2.5rem;height:2.5rem;flex:0 0 auto;border-radius:.75rem;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff}
.ssg-panel-ico svg{width:1.25rem;height:1.25rem}
.ssg-panel-title{margin:0;color:var(--ssg-ink);font-size:1.125rem;font-weight:700;line-height:1.25;letter-spacing:-.015em}
.ssg-panel-meta{display:flex;align-items:center;gap:.25rem;margin:.125rem 0 0;color:var(--ssg-mute);font-size:.8125rem}
.ssg-panel-meta svg{width:.875rem;height:.875rem}
.ssg-panel-count{display:inline-flex;align-items:center;gap:.375rem;padding:.375rem .75rem;border-radius:9999px;background:var(--ssg-accent-soft);color:#6d28d9;font-size:.75rem;font-weight:600}
.ssg-panel-count svg{width:.875rem;height:.875rem}
@media (min-width:768px){
  .ssg-layout{grid-template-columns:17.5rem minmax(0,1fr);gap:1.5rem}
  .ssg-list{position:sticky;top:6rem;flex-direction:column;max-height:36rem;margin:0;padding:.25rem;overflow-x:visible;overflow-y:auto}
  .ssg-college{min-width:0;max-width:none;width:100%}
  .ssg-panel{padding:1.5rem}
  .ssg-panel-title{font-size:1.25rem}
}

/* ---------- Full-screen lightbox ---------- */
.ssg-lb{position:fixed;inset:0;z-index:99999;display:flex;flex-direction:column;background:rgba(8,8,18,.96);color:#fff;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
.ssg-lb-top{display:flex;flex:0 0 auto;align-items:center;justify-content:space-between;gap:1rem;padding:.875rem 1rem}
.ssg-lb-meta{min-width:0}
.ssg-lb-title{margin:0;overflow:hidden;font-size:.9375rem;font-weight:600;letter-spacing:-.01em;text-overflow:ellipsis;white-space:nowrap}
.ssg-lb-cap{display:-webkit-box;margin:.125rem 0 0;overflow:hidden;color:rgba(255,255,255,.62);font-size:.8125rem;line-height:1.4;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.ssg-lb-actions{display:flex;flex:0 0 auto;align-items:center;gap:.625rem}
.ssg-lb-count{padding:.3rem .7rem;border:1px solid rgba(255,255,255,.12);border-radius:9999px;background:rgba(255,255,255,.08);color:rgba(255,255,255,.8);font-size:.8125rem;font-weight:600;font-variant-numeric:tabular-nums}
.ssg-lb-btn{display:inline-flex;align-items:center;justify-content:center;width:2.75rem;height:2.75rem;padding:0;border:1px solid rgba(255,255,255,.18);border-radius:9999px;background:rgba(255,255,255,.08);color:#fff;cursor:pointer;transition:background-color .2s,border-color .2s,transform .2s}
.ssg-lb-btn:hover{background:rgba(255,255,255,.2);border-color:rgba(255,255,255,.4)}
.ssg-lb-btn:active{transform:scale(.94)}
.ssg-lb-btn:focus-visible{outline:2px solid #a78bfa;outline-offset:2px}
.ssg-lb-btn svg{width:1.25rem;height:1.25rem;stroke-width:2}
.ssg-lb-stage{position:relative;flex:1 1 auto;min-height:0;touch-action:pan-y}
.ssg-lb-slide{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:0 .5rem .75rem}
.ssg-lb-media{display:block;width:auto;height:auto;max-width:100%;max-height:100%;border-radius:.5rem;object-fit:contain;box-shadow:0 30px 80px -24px rgba(0,0,0,.75)}
.ssg-lb-nav{position:absolute;top:50%;z-index:3;width:2.5rem;height:2.5rem;margin-top:-1.25rem;background:rgba(8,8,18,.55)}
.ssg-lb-prev{left:.5rem}
.ssg-lb-next{right:.5rem}
.ssg-lb-thumbs{display:none;flex:0 0 auto;overflow-x:auto;padding:.5rem 1.5rem 1.25rem;scrollbar-width:none}
.ssg-lb-thumbs::-webkit-scrollbar{display:none}
.ssg-lb-thumbs-inner{position:relative;display:flex;gap:.5rem;width:max-content;margin:0 auto}
.ssg-thumb{flex:0 0 auto;width:4rem;height:2.75rem;padding:0;overflow:hidden;border:2px solid transparent;border-radius:.5rem;background:#1e1e2e;opacity:.5;cursor:pointer;transition:opacity .25s,border-color .25s,transform .25s}
.ssg-thumb:hover{opacity:.85}
.ssg-thumb.is-active{border-color:#a78bfa;opacity:1;transform:translateY(-2px)}
.ssg-thumb img{display:block;width:100%;height:100%;object-fit:cover}
@media (min-width:640px) and (min-height:560px){.ssg-lb-thumbs{display:block}.ssg-lb-slide{padding-bottom:.25rem}}
@media (min-width:768px){
  .ssg-lb-top{padding:1.25rem 1.75rem}
  .ssg-lb-slide{padding-left:5rem;padding-right:5rem}
  .ssg-lb-nav{width:3rem;height:3rem;margin-top:-1.5rem}
  .ssg-lb-prev{left:1.5rem}
  .ssg-lb-next{right:1.5rem}
}
@media (prefers-reduced-motion:reduce){
  .ssg *,.ssg-lb *{animation:none!important;transition-duration:.01ms!important}
}
`;

// One photo/video tile in the masonry grid
function GalleryCard({ media, index, onOpen, reduceMotion, eager }) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);
  const isVideo = media.type === "video";
  const label = media.sub || media.title || "Gallery photo";

  // Images served from cache can finish loading before React attaches onLoad
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label={`View photo: ${label}`}
      className={`ssg-card${loaded ? " is-loaded" : ""}`}
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: (index % 8) * 0.04 }}
    >
      <img
        ref={imgRef}
        src={isVideo ? media.poster : media.src}
        alt={label}
        decoding="async"
        loading={eager ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className="ssg-card-img"
      />
      {media.badge && <span className="ssg-badge">{media.badge}</span>}
      {isVideo ? (
        <span className="ssg-play" aria-hidden="true">
          <PlayCircleIcon />
        </span>
      ) : (
        <span className="ssg-zoom" aria-hidden="true">
          <ArrowsPointingOutIcon />
        </span>
      )}
      {(media.title || media.sub) && (
        <span className="ssg-over">
          {media.title && <span className="ssg-over-title">{media.title}</span>}
          {media.sub && <span className="ssg-over-sub">{media.sub}</span>}
        </span>
      )}
    </motion.button>
  );
}

// Full-screen viewer: arrows, keyboard, swipe, thumbnail strip, counter
function Lightbox({ state, onClose, onStep, onJump, reduceMotion }) {
  const { items, index, dir } = state;
  const item = items[index];
  const count = items.length;
  const touchStart = useRef(null);
  const stripRef = useRef(null);
  const thumbRefs = useRef([]);

  // Keyboard controls + lock page scroll while open
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onStep(1);
      else if (e.key === "ArrowLeft") onStep(-1);
      else if (e.key === "Home") onJump(0);
      else if (e.key === "End") onJump(count - 1);
    };
    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, onStep, onJump, count]);

  // Preload neighbours + keep the active thumbnail centred
  useEffect(() => {
    [1, -1].forEach((step) => {
      const next = items[(index + step + count) % count];
      if (next && next.type !== "video") {
        const preload = new Image();
        preload.src = next.src;
      }
    });
    const strip = stripRef.current;
    const thumb = thumbRefs.current[index];
    if (strip && thumb) {
      const delta =
        thumb.getBoundingClientRect().left -
        strip.getBoundingClientRect().left -
        (strip.clientWidth / 2 - thumb.clientWidth / 2);
      strip.scrollBy({ left: delta, behavior: reduceMotion ? "auto" : "smooth" });
    }
  }, [index, items, count, reduceMotion]);

  const onTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStart.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(delta) > 50) onStep(delta < 0 ? 1 : -1);
  };
  const closeOnBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <motion.div
      className="ssg-lb"
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="ssg-lb-top">
        <div className="ssg-lb-meta">
          {item.title && <p className="ssg-lb-title">{item.title}</p>}
          {item.caption && <p className="ssg-lb-cap">{item.caption}</p>}
        </div>
        <div className="ssg-lb-actions">
          {count > 1 && (
            <span className="ssg-lb-count" aria-live="polite">
              {index + 1} / {count}
            </span>
          )}
          <button type="button" onClick={onClose} aria-label="Close photo viewer" className="ssg-lb-btn">
            <XMarkIcon aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        className="ssg-lb-stage"
        onClick={closeOnBackdrop}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {count > 1 && (
          <>
            <button type="button" onClick={() => onStep(-1)} aria-label="Previous photo" className="ssg-lb-btn ssg-lb-nav ssg-lb-prev">
              <ChevronLeftIcon aria-hidden="true" />
            </button>
            <button type="button" onClick={() => onStep(1)} aria-label="Next photo" className="ssg-lb-btn ssg-lb-nav ssg-lb-next">
              <ChevronRightIcon aria-hidden="true" />
            </button>
          </>
        )}

        <motion.div
          key={index}
          className="ssg-lb-slide"
          onClick={closeOnBackdrop}
          initial={reduceMotion ? false : { opacity: 0, x: dir * 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {item.type === "video" ? (
            <video
              key={item.src}
              src={item.src}
              poster={item.poster}
              controls
              autoPlay
              playsInline
              preload="metadata"
              aria-label={item.caption || item.title}
              className="ssg-lb-media"
            />
          ) : (
            <img src={item.src} alt={item.caption || item.title || "Gallery photo"} className="ssg-lb-media" />
          )}
        </motion.div>
      </div>

      {count > 1 && (
        <div className="ssg-lb-thumbs" ref={stripRef}>
          <div className="ssg-lb-thumbs-inner">
            {items.map((thumb, thumbIndex) => (
              <button
                key={`${thumb.src}-${thumbIndex}`}
                type="button"
                ref={(el) => {
                  thumbRefs.current[thumbIndex] = el;
                }}
                onClick={() => onJump(thumbIndex)}
                aria-label={`Go to photo ${thumbIndex + 1}`}
                aria-current={thumbIndex === index}
                className={`ssg-thumb${thumbIndex === index ? " is-active" : ""}`}
              >
                <img src={thumb.type === "video" ? thumb.poster : thumb.src} alt="" loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Everything the gallery needs for the shape the lightbox expects
const toLightboxItem = (m) => ({
  src: m.src,
  poster: m.poster,
  type: m.type,
  title: m.title,
  caption: m.sub,
});

export default function GallerySection({ section: sectionProp }) {
  // Same gallery on every page: always the Classroom set unless a page passes `section` explicitly
  const section = sectionProp ?? "classroom";
  const reduceMotion = useReducedMotion();
  const [selectedTab, setSelectedTab] = useState("all");

  // Which college is selected in the list. null = "All Colleges" (default)
  const [selectedCollegeIndex, setSelectedCollegeIndex] = useState(null);
  // Masonry starts with a short preview so the section does not run thousands of pixels long
  const PREVIEW_COUNT = 12;
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  // Lightbox state: the list of media currently being browsed, the index and the direction last moved
  const [lightbox, setLightbox] = useState(null); // { items, index, dir }

  const openLightbox = (items, index) => setLightbox({ items, index, dir: 1 });
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const stepLightbox = useCallback((direction) => {
    setLightbox((current) => {
      if (!current) return current;
      const count = current.items.length;
      return { ...current, index: (current.index + direction + count) % count, dir: direction };
    });
  }, []);
  const jumpLightbox = useCallback((target) => {
    setLightbox((current) => {
      if (!current || target === current.index) return current;
      return { ...current, index: target, dir: target > current.index ? 1 : -1 };
    });
  }, []);

  // Data for this page only
  const { items, colleges, everything } = useMemo(() => buildSectionData(section), [section]);

  // Colleges with an MoU go in the "MoU" tab, the rest in "Colleges"
  const mouColleges = colleges.filter((c) => c.mou);
  const regularColleges = colleges.filter((c) => !c.mou);

  // Tabs: only the ones that actually have photos on this page
  const tabs = [
    { id: "all", label: "All", count: everything.length },
    { id: "classroom", label: "Classroom", count: items.filter((i) => i.category === "classroom").length },
    { id: "projects", label: "Projects", count: items.filter((i) => i.category === "projects").length },
    { id: "success", label: "Success", count: items.filter((i) => i.category === "success").length },
    { id: "celebration", label: "Celebration", count: items.filter((i) => i.category === "celebration").length },
    { id: "colleges", label: "Colleges", count: regularColleges.length },
    { id: "mou", label: "MoU", count: mouColleges.length },
  ].filter((tab) => tab.count > 0);

  // Active tab falls back to the first available one
  const activeGalleryTab = tabs.some((t) => t.id === selectedTab) ? selectedTab : tabs[0]?.id;

  // The "Colleges" and "MoU" tabs share one layout, each with its own college list
  const isCollegeTab = activeGalleryTab === "colleges" || activeGalleryTab === "mou";
  const isMouTab = activeGalleryTab === "mou";
  const tabColleges = isMouTab ? mouColleges : regularColleges;
  const tabImages = uniqueBySrc(
    tabColleges.flatMap((college) =>
      college.images.map((img) => ({ ...img, collegeId: college.id, collegeName: college.name })),
    ),
  );
  const allLabel = isMouTab ? "All MoU Colleges" : "All Colleges";

  // Selected college (null when showing all colleges)
  const selectedCollege =
    selectedCollegeIndex === null ? null : tabColleges[selectedCollegeIndex] ?? null;

  // Images shown in the gallery panel: all photos by default, or one college's photos
  const visibleImages = selectedCollege
    ? selectedCollege.images.map((img) => ({
        ...img,
        collegeId: selectedCollege.id,
        collegeName: selectedCollege.name,
      }))
    : tabImages;

  // Filter gallery items
  const galleryList =
    activeGalleryTab === "all"
      ? everything
      : items.filter((item) => item.category === activeGalleryTab).map(itemToMedia);

  // Nothing tagged for this page yet
  if (tabs.length === 0) {
    return (
      <section className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Explore Our Learning Journey</h2>
        <p className="text-lg text-foreground/70">Photos coming soon.</p>
      </section>
    );
  }

  const rise = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "0px 0px -60px 0px" },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  });

  return (
    <section className="ssg mb-12" aria-labelledby="learning-journey-heading">
      <style>{galleryCss}</style>

      {/* Header */}
      <div className="mx-auto mb-6 max-w-2xl text-center">
        <motion.div
          {...rise()}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-3 py-1 shadow-sm"
        >
          <EyeIcon className="h-4 w-4 text-violet-600" aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-violet-700">
            Learning Experience
          </span>
        </motion.div>
        <motion.h2
          {...rise(0.08)}
          id="learning-journey-heading"
          className="mb-3 text-2xl font-bold leading-tight tracking-tight text-foreground md:text-3xl"
        >
          Explore Our Learning Journey
        </motion.h2>
        <motion.p {...rise(0.16)} className="text-[15px] leading-relaxed text-foreground/60 md:text-base">
          {sectionCopy[section] ?? defaultCopy}
        </motion.p>
      </div>

      {/* Filter pills */}
      <motion.div {...rise(0.22)} className="ssg-pills" role="tablist" aria-label="Filter gallery">
        {tabs.map((tab) => {
          const isActive = activeGalleryTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                setSelectedTab(tab.id);
                setSelectedCollegeIndex(null);
                setShowAllPhotos(false);
              }}
              className={`ssg-pill${isActive ? " is-active" : ""}`}
            >
              {tab.label}
              <span className="ssg-pill-count">{tab.count}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Colleges & MoU — college list on the left (chips on mobile), photos on the right */}
      {isCollegeTab ? (
        <div className="ssg-layout">
          <div className="ssg-list">
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
              <button
                key={key}
                type="button"
                onClick={onClick}
                aria-pressed={isActive}
                className={`ssg-college${isActive ? " is-active" : ""}`}
              >
                <span className="ssg-college-ico">
                  <Icon aria-hidden="true" />
                </span>
                <span className="ssg-college-txt">
                  <span className="ssg-college-name">{title}</span>
                  {subtitle && <span className="ssg-college-loc">{subtitle}</span>}
                </span>
                <span className="ssg-college-count">{count}</span>
              </button>
            ))}
          </div>

          <div className="ssg-panel-wrap" style={{ minWidth: 0 }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${activeGalleryTab}-${selectedCollege ? selectedCollege.id : "all"}`}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="ssg-panel"
              >
                <div className="ssg-panel-head">
                  <div className="flex items-center gap-3">
                    <span className="ssg-panel-ico">
                      {selectedCollege ? (
                        <BuildingLibraryIcon aria-hidden="true" />
                      ) : (
                        <PhotoIcon aria-hidden="true" />
                      )}
                    </span>
                    <div>
                      <h3 className="ssg-panel-title">{selectedCollege ? selectedCollege.name : allLabel}</h3>
                      {(!selectedCollege || selectedCollege.location) && (
                        <p className="ssg-panel-meta">
                          <MapPinIcon aria-hidden="true" />
                          {selectedCollege
                            ? selectedCollege.location
                            : `${tabColleges.length} ${isMouTab ? "MoU partner colleges" : "partner colleges"}`}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="ssg-panel-count">
                    <PhotoIcon aria-hidden="true" />
                    {visibleImages.length} {visibleImages.length === 1 ? "Photo" : "Photos"}
                  </span>
                </div>

                <div className="ssg-masonry">
                  {visibleImages.map((img, imageIndex) => (
                    <GalleryCard
                      key={`${img.collegeId}-${imageIndex}`}
                      index={imageIndex}
                      reduceMotion={reduceMotion}
                      eager={imageIndex < 6}
                      media={{
                        src: img.src,
                        poster: img.poster,
                        type: img.type,
                        title: selectedCollege ? undefined : img.collegeName,
                        sub: img.caption,
                      }}
                      onOpen={() =>
                        openLightbox(
                          visibleImages.map((m) =>
                            toLightboxItem({
                              src: m.src,
                              poster: m.poster,
                              type: m.type,
                              title: m.collegeName,
                              sub: m.caption,
                            }),
                          ),
                          imageIndex,
                        )
                      }
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      ) : (
        /* Masonry grid. "All" shows every photo (general, celebration, MoU, colleges) */
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeGalleryTab}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="ssg-masonry ssg-masonry--wide"
          >
            {(showAllPhotos ? galleryList : galleryList.slice(0, PREVIEW_COUNT)).map((media, index) => (
              <GalleryCard
                key={media.key}
                media={media}
                index={index}
                reduceMotion={reduceMotion}
                eager={index < 8}
                onOpen={() => openLightbox(galleryList.map(toLightboxItem), index)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {!isCollegeTab && galleryList.length > PREVIEW_COUNT && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAllPhotos((value) => !value)}
            aria-expanded={showAllPhotos}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-violet-200 bg-white px-4 text-sm font-semibold text-violet-700 shadow-sm transition-colors hover:border-violet-300 hover:bg-violet-50"
          >
            {showAllPhotos ? "Show fewer photos" : `Show all ${galleryList.length} photos`}
          </button>
        </div>
      )}

      {/* Full-screen lightbox — rendered on document.body so it always sits above the page */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {lightbox && (
              <Lightbox
                key="ssg-lightbox"
                state={lightbox}
                onClose={closeLightbox}
                onStep={stepLightbox}
                onJump={jumpLightbox}
                reduceMotion={reduceMotion}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </section>
  );
}