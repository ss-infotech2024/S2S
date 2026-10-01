import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import {
  BriefcaseIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  TrophyIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";

/* ------------------------------------------------------------------ *
 *  EDIT THE DATA BELOW — the section renders automatically from it.  *
 *  All numbers / names here are SAMPLE placeholders. Replace them    *
 *  with your real placement data before publishing.                  *
 * ------------------------------------------------------------------ */

interface Stat {
  icon: typeof BriefcaseIcon;
  value: string;
  label: string;
}
interface Recruiter {
  name: string;
  logo?: string; // e.g. "/img/recruiters/pwc.png" — shown instead of the initials badge
  featured?: boolean; // highlight as a top recruiter (dark gradient card)
}
interface Review {
  name: string;
  course: string;
  review: string;
  rating: number; // 1-5
  photo?: string; // e.g. "/img/reviews/niharika.jpg"
}
interface PlacedStudent {
  name: string;
  role?: string;
  company: string;
  package?: string;
  photo?: string;
}

// Top stats — same numbers as your Placements page (pages/Placements.tsx)
const stats: Stat[] = [
  { icon: UserGroupIcon, value: "2500+", label: "Students Placed" },
  { icon: BuildingOffice2Icon, value: "200+", label: "Partner Companies" },
  { icon: TrophyIcon, value: "₹22.0 LPA", label: "Highest Package" },
  { icon: CheckBadgeIcon, value: "85%", label: "Placement Success Rate" },
];

// Companies that recruit from you.
//  - Add `logo: "/img/recruiters/xyz.png"` to show the company logo (grayscale -> colour on hover).
//  - Add `featured: true` to highlight a top recruiter with a dark gradient card.
const recruiters: Recruiter[] = [
  { name: "X-Duce" },
  { name: "ABM" },
  { name: "PWC" },
  { name: "IDFC" },
  { name: "Jade Global" },
  { name: "Expleo" },
  { name: "Capgemini" },
  { name: "Stetig" },
];

// Placed students (success stories). Photos live in  public/img/placements/
// Add / remove entries freely — the grid adjusts itself. `role` is optional.
// If a photo is missing, the student's initial is shown instead of a broken image.
const placedStudents: PlacedStudent[] = [
  { name: "Nitisha Borkar", company: "X-Duce", package: "4.2 LPA", photo: "/img/placements/nitisha-borkar.jpg" },
  { name: "Manthan Borkar", company: "ABM", package: "13 LPA", photo: "/img/placements/manthan-borkar.jpg" },
  { name: "Prajakta Dhengre", company: "PWC", package: "6.4 LPA", photo: "/img/placements/prajakta-dhengre.jpg" },
  { name: "Tanmay Agnihotri", company: "IDFC", package: "13 LPA", photo: "/img/placements/tanmay-agnihotri.jpg" },
  { name: "Shiv Das", company: "X-Duce", package: "4.2 LPA", photo: "/img/placements/shiv-das.jpg" },
  { name: "Asit Sahu", company: "Jade Global", package: "12 LPA", photo: "/img/placements/asit-sahu.jpg" },
  { name: "Zeba Sheikh", company: "Expleo", package: "4.5 LPA", photo: "/img/placements/zeba-sheikh.jpg" },
  { name: "Mrunal Umredkar", company: "Capgemini", package: "3.8 LPA", photo: "/img/placements/mrunal-umredkar.jpg" },
  { name: "Vaishnavi Khoware", company: "Stetig", package: "4.8 LPA", photo: "/img/placements/vaishnavi-khoware.jpg" },
];

// Student reviews — shown as a moving (auto-scrolling) strip.
// Same reviews as your Placements page. Add `photo: "/img/reviews/name.jpg"` to show a photo.
const reviews: Review[] = [
  {
    name: "Niharika Sharma",
    course: "Python + DSA",
    rating: 5,
    review:
      "The instructors are top-notch and the curriculum is very practical. I landed a job just two months after completing the course!",
  },
  {
    name: "Prateek Kumar",
    course: "Full Stack Development",
    rating: 5,
    review:
      "Skill Training Center's course gave me the skills and confidence I needed to switch my career. The projects were invaluable for my portfolio.",
  },
  {
    name: "Raj Borkar",
    course: "Data Analytics",
    rating: 5,
    review:
      "Hands-on learning and personalized attention made all the difference. Highly recommend this course to anyone serious about data analysis.",
  },
  {
    name: "Saloni Patel",
    course: "Data Science",
    rating: 5,
    review:
      "The projects were hands-on and very practical. I gained confidence in real-world data analysis and visualization techniques.",
  },
  {
    name: "Ajay Singh",
    course: "Machine Learning",
    rating: 5,
    review:
      "The mentorship and guidance from Skill Training Center helped me grow faster than I expected. The career support was exceptional.",
  },
  {
    name: "Meenal Gupta",
    course: "Data Analytics",
    rating: 5,
    review:
      "The projects and real-life case studies really boosted my confidence. The interview preparation sessions were incredibly helpful.",
  },
];

// Where the "View all placements" button goes
const PLACEMENTS_PAGE_URL = "/placements";

/* Plain CSS so the layout works regardless of Tailwind config/scan */
const css = `
.pl-section{width:100%;max-width:1200px;margin:0 auto;padding:4rem 1rem 3rem;box-sizing:border-box}
.pl-head{text-align:center;margin-bottom:2.5rem}
.pl-pill{display:inline-flex;align-items:center;gap:.5rem;padding:.5rem 1rem;border-radius:9999px;background:#f5f3ff;border:1px solid #ddd6fe;color:#6d28d9;font-size:.875rem;font-weight:600;margin-bottom:1rem}
.pl-pill svg{width:16px;height:16px}
.pl-title{font-size:1.875rem;line-height:1.2;font-weight:800;color:#0f172a;margin:0 0 .75rem}
.pl-title span{background:linear-gradient(90deg,#2563eb,#7c3aed);-webkit-background-clip:text;background-clip:text;color:transparent}
.pl-sub{max-width:640px;margin:0 auto;color:#475569;font-size:1.05rem;line-height:1.6}
@media (min-width:768px){.pl-title{font-size:2.5rem}}

.pl-stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;margin-bottom:2.5rem}
@media (min-width:768px){.pl-stats{grid-template-columns:repeat(4,minmax(0,1fr))}}
.pl-stat{display:flex;flex-direction:column;align-items:center;text-align:center;padding:1.25rem 1rem;border-radius:1.25rem;background:#fff;border:1px solid #e2e8f0;box-shadow:0 1px 2px rgba(15,23,42,.05);transition:transform .25s,box-shadow .25s}
.pl-stat:hover{transform:translateY(-4px);box-shadow:0 12px 28px rgba(124,58,237,.14)}
.pl-stat-icon{display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:.875rem;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;margin-bottom:.75rem}
.pl-stat-icon svg{width:22px;height:22px}
.pl-stat-value{font-size:1.75rem;font-weight:800;color:#0f172a;line-height:1.1}
.pl-stat-label{margin-top:.25rem;font-size:.875rem;color:#64748b;font-weight:500}

.pl-block-title{display:flex;align-items:center;justify-content:center;gap:.5rem;font-size:1.125rem;font-weight:700;color:#0f172a;margin:0 0 1rem}
.pl-block-title svg{width:20px;height:20px;color:#7c3aed}

.pl-marquee{position:relative;overflow:hidden;margin-bottom:2.5rem;padding:.5rem 0;-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
.pl-track{display:flex;width:max-content;gap:1rem;animation:pl-scroll 28s linear infinite}
.pl-marquee:hover .pl-track{animation-play-state:paused}
@keyframes pl-scroll{from{transform:translateX(0)}to{transform:translateX(calc(-50% - .5rem))}}
.pl-recruiters{display:flex;flex-direction:column;gap:1rem;margin-bottom:2.5rem}
.pl-recruiters .pl-marquee{margin-bottom:0}
.pl-recruiters-sub{margin:-.5rem 0 1.25rem;text-align:center;color:#64748b;font-size:.95rem}
.pl-chip{position:relative;display:flex;align-items:center;gap:.75rem;min-width:210px;height:76px;padding:0 1.5rem 0 1rem;border-radius:1.125rem;overflow:hidden;background:#fff;border:1px solid #e2e8f0;box-shadow:0 2px 8px rgba(15,23,42,.06);cursor:default;transition:transform .25s,box-shadow .25s,border-color .25s}
.pl-chip::before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--tone,linear-gradient(135deg,#2563eb,#7c3aed))}
.pl-chip:hover{transform:translateY(-4px);border-color:#c4b5fd;box-shadow:0 14px 28px rgba(124,58,237,.2)}
.pl-chip-badge{flex:0 0 auto;display:flex;align-items:center;justify-content:center;width:46px;height:46px;border-radius:.875rem;color:#fff;font-size:.95rem;font-weight:800;letter-spacing:.02em;box-shadow:0 6px 14px rgba(15,23,42,.2);transition:transform .25s}
.pl-chip:hover .pl-chip-badge{transform:scale(1.08) rotate(-4deg)}
.pl-chip-text{display:flex;flex-direction:column;gap:.125rem}
.pl-chip-name{font-size:1.05rem;font-weight:700;line-height:1.15;color:#0f172a;white-space:nowrap}
.pl-chip-sub{font-size:.68rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#7c3aed}
.pl-chip-featured{background:linear-gradient(135deg,#1e1b4b,#4c1d95);border-color:transparent}
.pl-chip-featured .pl-chip-name{color:#fff}
.pl-chip-featured .pl-chip-sub{color:#fcd34d}
.pl-chip img{max-height:42px;max-width:140px;object-fit:contain;filter:grayscale(1);opacity:.8;transition:filter .25s,opacity .25s}
.pl-chip:hover img{filter:none;opacity:1}
.pl-track-rev{animation-direction:reverse}
.pl-students{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}
@media (min-width:768px){.pl-students{grid-template-columns:repeat(3,minmax(0,1fr));gap:1.25rem}}
.pl-card{position:relative;display:flex;flex-direction:column;align-items:center;text-align:center;overflow:hidden;padding:1.5rem 1rem 1.25rem;border-radius:1.25rem;background:#fff;border:1px solid #e2e8f0;box-shadow:0 2px 8px rgba(15,23,42,.06);transition:transform .3s,box-shadow .3s,border-color .3s}
.pl-card::before{content:"";position:absolute;left:0;right:0;top:0;height:76px;background:linear-gradient(135deg,#dbeafe,#ede9fe 55%,#fce7f3)}
.pl-card:hover{transform:translateY(-6px);border-color:#c4b5fd;box-shadow:0 18px 36px rgba(124,58,237,.2)}
.pl-photo{position:relative;display:flex;align-items:center;justify-content:center;width:112px;height:112px;border-radius:9999px;overflow:hidden;background:#ede9fe;color:#7c3aed;font-size:2.5rem;font-weight:800;border:4px solid #fff;box-shadow:0 8px 20px rgba(76,29,149,.28);transition:transform .4s}
.pl-card:hover .pl-photo{transform:scale(1.06)}
.pl-photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.pl-name{position:relative;margin-top:.875rem;font-size:1.05rem;font-weight:700;line-height:1.25;color:#0f172a}
.pl-role{position:relative;margin-top:.125rem;font-size:.85rem;color:#64748b}
.pl-company{position:relative;display:inline-flex;align-items:center;gap:.375rem;margin-top:.625rem;padding:.3rem .8rem;border-radius:9999px;background:#eff6ff;color:#1d4ed8;font-size:.8rem;font-weight:700}
.pl-package{position:relative;margin-top:.5rem;padding:.25rem .8rem;border-radius:9999px;background:linear-gradient(90deg,#059669,#14b8a6);color:#fff;font-size:.8rem;font-weight:800;letter-spacing:.01em;box-shadow:0 4px 10px rgba(5,150,105,.3)}

.pl-spaced{margin-top:2.75rem}
.pl-reviews{position:relative;overflow:hidden;padding:.5rem 0;-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
.pl-rtrack{display:flex;width:max-content;gap:1rem;animation:pl-scroll 55s linear infinite}
.pl-reviews:hover .pl-rtrack{animation-play-state:paused}
.pl-review{flex:0 0 auto;width:300px;display:flex;flex-direction:column;margin:0;padding:1.25rem;border-radius:1.25rem;background:#fff;border:1px solid #e2e8f0;box-shadow:0 2px 6px rgba(15,23,42,.06)}
@media (min-width:768px){.pl-review{width:360px}}
.pl-stars{display:flex;gap:2px;color:#f59e0b}
.pl-stars svg{width:16px;height:16px}
.pl-stars .pl-off{color:#cbd5e1}
.pl-quote{flex:1;margin:.75rem 0 1rem;font-size:.9rem;line-height:1.6;color:#334155}
.pl-rauthor{display:flex;align-items:center;gap:.75rem}
.pl-ravatar{position:relative;display:flex;align-items:center;justify-content:center;flex-shrink:0;width:44px;height:44px;border-radius:9999px;overflow:hidden;background:linear-gradient(135deg,#dbeafe,#ede9fe);color:#6d28d9;font-weight:800}
.pl-ravatar img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.pl-rname{font-size:.95rem;font-weight:700;color:#0f172a;line-height:1.2}
.pl-rmeta{font-size:.8rem;color:#64748b}

.pl-cta{display:flex;justify-content:center;margin-top:2.25rem}
.pl-btn{display:inline-flex;align-items:center;gap:.5rem;padding:.875rem 1.75rem;border-radius:1rem;background:linear-gradient(90deg,#2563eb,#7c3aed);color:#fff;font-weight:700;text-decoration:none;box-shadow:0 10px 24px rgba(124,58,237,.3);transition:transform .2s,box-shadow .2s}
.pl-btn:hover{transform:translateY(-2px);box-shadow:0 14px 30px rgba(124,58,237,.4)}
.pl-btn svg{width:18px;height:18px}
.pl-btn:focus-visible{outline:3px solid #7c3aed;outline-offset:3px}
@media (prefers-reduced-motion:reduce){
  .pl-track,.pl-rtrack{animation:none}
  .pl-marquee,.pl-reviews{overflow-x:auto;-webkit-mask-image:none;mask-image:none}
  .pl-stat,.pl-card,.pl-card img,.pl-btn{transition:none}
  .pl-stat:hover,.pl-card:hover,.pl-btn:hover{transform:none}
  .pl-card:hover img{transform:none}
}
`;

const chipTones = [
  "linear-gradient(135deg,#2563eb,#4f46e5)",
  "linear-gradient(135deg,#7c3aed,#a855f7)",
  "linear-gradient(135deg,#db2777,#f43f5e)",
  "linear-gradient(135deg,#059669,#14b8a6)",
  "linear-gradient(135deg,#d97706,#f59e0b)",
  "linear-gradient(135deg,#0891b2,#2563eb)",
];

function companyInitials(name: string) {
  const parts = name.split(/[\s-]+/).filter(Boolean);
  return (parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2)).toUpperCase();
}

/** One recruiter card: coloured initials badge (or logo), name, "Hiring partner" label. */
function RecruiterChip({
  company,
  tone,
  hidden = false,
}: {
  company: Recruiter;
  tone: string;
  hidden?: boolean;
}) {
  return (
    <div
      className={`pl-chip${company.featured ? " pl-chip-featured" : ""}`}
      style={{ "--tone": tone } as CSSProperties}
      aria-hidden={hidden ? true : undefined}
    >
      {company.logo ? (
        <img src={company.logo} alt={company.name} loading="lazy" decoding="async" />
      ) : (
        <>
          <span className="pl-chip-badge" style={{ background: tone }} aria-hidden="true">
            {companyInitials(company.name)}
          </span>
          <span className="pl-chip-text">
            <span className="pl-chip-name">{company.name}</span>
            <span className="pl-chip-sub">{company.featured ? "Top recruiter" : "Hiring partner"}</span>
          </span>
        </>
      )}
    </div>
  );
}

export default function PlacementsSection() {
  // Duplicate the list so the marquee loops seamlessly
  // Repeat the list until one "half" of the track is wider than a big screen, so the loop never shows a gap
  const half = Array.from({ length: Math.ceil(12 / Math.max(recruiters.length, 1)) }, () => recruiters).flat();
  const rowOne = [...half, ...half];
  const rowTwo = [...[...half].reverse(), ...[...half].reverse()];
  const reviewItems = [...reviews, ...reviews];

  return (
    <section className="pl-section" aria-labelledby="placements-heading">
      <style>{css}</style>

      {/* Heading */}
      <motion.div
        className="pl-head"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="pl-pill">
          <BriefcaseIcon aria-hidden="true" />
          Placements &amp; Recruitment
        </div>
        <h2 id="placements-heading" className="pl-title">
          Our <span>Placements</span> &amp; Recruiters
        </h2>
        <p className="pl-sub">
          Our students get hired by leading companies. See where our training
          takes you.
        </p>
      </motion.div>

      {stats.length > 0 && (
        <>
      {/* Stats */}
      <div className="pl-stats">
        {stats.map(({ icon: Icon, value, label }, i) => (
          <motion.div
            key={label}
            className="pl-stat"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <span className="pl-stat-icon">
              <Icon aria-hidden="true" />
            </span>
            <span className="pl-stat-value">{value}</span>
            <span className="pl-stat-label">{label}</span>
          </motion.div>
        ))}
      </div>
        </>
      )}

      {recruiters.length > 0 && (
        <>
      {/* Recruiters marquee */}
      <h3 className="pl-block-title">
        <BuildingOffice2Icon aria-hidden="true" />
        Our Recruiters
      </h3>
      <p className="pl-recruiters-sub">Leading companies that hire our students</p>
      <div className="pl-recruiters" role="region" aria-label="Our recruiters">
        <div className="pl-marquee">
          <div className="pl-track">
            {rowOne.map((company, i) => (
              <RecruiterChip
                key={`a-${company.name}-${i}`}
                company={company}
                tone={chipTones[i % recruiters.length % chipTones.length]}
                hidden={i >= half.length}
              />
            ))}
          </div>
        </div>
        {recruiters.length >= 4 && (
          <div className="pl-marquee" aria-hidden="true">
            <div className="pl-track pl-track-rev" style={{ animationDuration: "36s" }}>
              {rowTwo.map((company, i) => (
                <RecruiterChip
                  key={`b-${company.name}-${i}`}
                  company={company}
                  tone={chipTones[recruiters.indexOf(company) % chipTones.length]}
                  hidden
                />
              ))}
            </div>
          </div>
        )}
      </div>
        </>
      )}

      {placedStudents.length > 0 && (
        <>
      {/* Placed students — photo wall */}
      <h3 className="pl-block-title">
        <TrophyIcon aria-hidden="true" />
        Our Placed Students
      </h3>
      <div className="pl-students">
        {placedStudents.map((student, i) => (
          <motion.div
            key={`${student.name}-${i}`}
            className="pl-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
          >
            <div className="pl-photo">
              {student.name.charAt(0)}
              {student.photo && (
                <img
                  src={student.photo}
                  alt={`${student.name}, placed at ${student.company}`}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
            </div>
            <div className="pl-name">{student.name}</div>
            {student.role && <div className="pl-role">{student.role}</div>}
            <div className="pl-company">{student.company}</div>
            {student.package && <div className="pl-package">{student.package}</div>}
          </motion.div>
        ))}
      </div>
        </>
      )}

      {/* Student reviews — moving strip */}
      {reviews.length > 0 && (
        <>
          <h3 className="pl-block-title pl-spaced">
            <ChatBubbleLeftRightIcon aria-hidden="true" />
            What Our Placed Students Say
          </h3>
          <div className="pl-reviews" role="region" aria-label="Student reviews">
            <div className="pl-rtrack">
              {reviewItems.map((r, i) => (
                <figure
                  className="pl-review"
                  key={`${r.name}-${i}`}
                  aria-hidden={i >= reviews.length ? true : undefined}
                >
                  <div
                    className="pl-stars"
                    role="img"
                    aria-label={`${r.rating} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }, (_, n) => (
                      <StarIcon
                        key={n}
                        className={n < r.rating ? "" : "pl-off"}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <blockquote className="pl-quote">“{r.review}”</blockquote>
                  <figcaption className="pl-rauthor">
                    <span className="pl-ravatar">
                      {r.name.charAt(0)}
                      {r.photo && (
                        <img
                          src={r.photo}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                    </span>
                    <span>
                      <span className="pl-rname" style={{ display: "block" }}>{r.name}</span>
                      <span className="pl-rmeta">{r.course}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </>
      )}

      {/* CTA */}
      <div className="pl-cta">
        <a href={PLACEMENTS_PAGE_URL} className="pl-btn">
          View all placements
          <ArrowRightIcon aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}