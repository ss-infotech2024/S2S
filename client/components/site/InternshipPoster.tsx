import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

const highlights = [
  "6-month career-oriented internship program",
  "Choose Full Stack, Data Analytics, App Development or AI & Automation",
  "10+ additional skills including Power BI, SQL, Databricks and Generative AI",
  "Internship opportunities across Nagpur & Pan India",
  "Resume building, interview preparation and placement support",
];

/** Portrait internship poster shown under the home page slider. */
export default function InternshipPoster() {
  return (
    <section className="bg-gradient-to-br from-violet-100 via-fuchsia-50 to-white">
      <div className="container grid items-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:py-16">
        <a
          href="/honeBanner/internship.png"
          target="_blank"
          rel="noreferrer"
          className="mx-auto block w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl shadow-violet-900/15 ring-1 ring-violet-100 transition hover:-translate-y-1 hover:shadow-violet-900/25"
          aria-label="Open the full internship poster"
        >
          <img
            src="/honeBanner/internship.png"
            alt="SS Training Center 6 months internship opportunity — domains, skills, benefits and program fee ₹9,999"
            loading="lazy"
            decoding="async"
            width={1024}
            height={1536}
            className="h-auto w-full"
          />
        </a>

        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-violet-700 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-500" aria-hidden="true" />
            Registrations Open
          </span>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[#2b1450] sm:text-4xl">
            6 Months Internship Opportunity
          </h2>
          <p className="mt-3 text-slate-600">Get real-world experience and build your future with SS Training Center.</p>
          <ul className="mx-auto mt-6 max-w-lg space-y-3 text-left lg:mx-0">
            {highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-slate-700">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-fuchsia-600" strokeWidth={3} aria-hidden="true" />
                {h}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-lg font-bold text-[#2b1450]">
            Program fee <span className="text-fuchsia-600">₹9,999/-</span> · Limited seats
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-7 font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:-translate-y-0.5"
          >
            Apply Now <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
