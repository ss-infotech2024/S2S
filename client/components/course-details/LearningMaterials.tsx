import { ArrowTopRightOnSquareIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import type { LearningMaterial } from "@/data/courseExtras";
import { Card, SectionHeading, SPACING } from "./shared";

const TAG_STYLES: Record<LearningMaterial["type"], string> = {
  Documentation: "bg-blue-50 text-blue-700",
  Tutorial: "bg-purple-50 text-purple-700",
};

export default function LearningMaterials({ materials }: { materials: LearningMaterial[] }) {
  if (!materials.length) return null;
  return (
    <Card className={SPACING.card}>
      <SectionHeading
        icon={<BookOpenIcon className="h-5 w-5" aria-hidden="true" />}
        title="Learning Materials"
        subtitle="Free official documentation, practice platforms and guides to study alongside your classes"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {materials.map((m) => (
          <a
            key={m.url}
            href={m.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-2xl border border-slate-200 p-5 transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-500/10"
          >
            <div className="flex items-center justify-between">
              <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${TAG_STYLES[m.type]}`}>
                {m.type}
              </span>
              <ArrowTopRightOnSquareIcon
                className="h-4 w-4 text-slate-300 transition-colors group-hover:text-indigo-500"
                aria-hidden="true"
              />
            </div>
            <h4 className="mt-3 text-sm font-bold text-[#171034]">{m.title}</h4>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{m.description}</p>
          </a>
        ))}
      </div>
    </Card>
  );
}