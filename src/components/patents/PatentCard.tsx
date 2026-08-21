import { Activity, ArrowRight, Calendar, User } from "lucide-react";
import Link from "next/link";
import { TextWithLatex } from "@/components/ui/LatexRenderer";
import type { Patent } from "@/types/patent";
import { formatPatentDate } from "@/utils/patentDate";

interface PatentCardProps {
  patent: Patent;
}

export function PatentCard({ patent }: PatentCardProps) {
  return (
    <Link
      href={`/patents/${patent.id}`}
      className="group relative block rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-7 shadow-patent hover:shadow-patent-lg hover:border-amber-600/60 dark:hover:border-amber-500/60 transition-colors duration-300 flex flex-col justify-between kinetic-card overflow-hidden"
    >
      {/* Subtle Top Gold Accent Line on Hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-600 via-amber-400 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="space-y-4">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 text-xs sm:text-sm font-sans">
          <span className="font-bold text-amber-800 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/90 px-2.5 py-1 rounded-md border border-amber-300 dark:border-amber-700/80 shadow-xs">
            {patent.patentNumber}
          </span>
          <span className="text-ink-600 dark:text-ink-400 text-xs sm:text-sm font-medium">
            {patent.era}
          </span>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1.5 pt-1">
          <h3 className="font-serif text-2xl font-bold tracking-tight text-ink-950 dark:text-parchment-50 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors leading-snug">
            {patent.shortTitle}
          </h3>
          <p className="font-serif text-sm sm:text-base text-ink-700 dark:text-parchment-300 italic line-clamp-1">
            {patent.subtitle}
          </p>
        </div>

        {/* Summary */}
        <div className="text-sm sm:text-base font-sans text-ink-800 dark:text-ink-200 line-clamp-3 leading-relaxed">
          <TextWithLatex text={patent.summary} />
        </div>

        {/* Inventors & Meta */}
        <div className="pt-3 border-t border-parchment-200 dark:border-ink-800/80 space-y-2 text-xs sm:text-sm font-sans text-ink-700 dark:text-ink-300">
          <div className="flex items-start gap-2">
            <User className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2 font-semibold" title={patent.inventors.join(", ")}>
              {patent.inventors.join(", ")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
            <span>Granted: {formatPatentDate(patent.grantDate)}</span>
          </div>
        </div>
      </div>

      {/* Footer tags & CTA */}
      <div className="mt-6 pt-4 border-t border-parchment-200 dark:border-ink-800 flex items-center justify-between text-xs sm:text-sm font-sans">
        <span className="inline-flex items-center gap-1.5 text-amber-800 dark:text-amber-400 font-bold group-hover:underline">
          <Activity className="w-4 h-4 text-amber-600" />
          Interactive Sim &amp; Claims
        </span>
        <span className="flex items-center gap-1 text-ink-600 dark:text-ink-400 font-semibold group-hover:text-amber-800 dark:group-hover:text-amber-400 group-hover:translate-x-1 transition-transform">
          Explore <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}
