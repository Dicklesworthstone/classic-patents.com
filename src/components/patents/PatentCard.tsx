import { Activity, ArrowRight, Calendar, User } from "lucide-react";
import Link from "next/link";
import type { Patent } from "@/types/patent";

interface PatentCardProps {
  patent: Patent;
}

export function PatentCard({ patent }: PatentCardProps) {
  return (
    <Link
      href={`/patents/${patent.id}`}
      className="group block rounded-xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 shadow-patent hover:shadow-patent-lg hover:border-amber-600/50 dark:hover:border-amber-500/50 transition-all duration-200 flex flex-col justify-between"
    >
      <div className="space-y-4">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 text-xs font-mono">
          <span className="font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-800">
            {patent.patentNumber}
          </span>
          <span className="text-ink-500 text-[11px]">{patent.era}</span>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1">
          <h3 className="font-serif text-xl font-bold text-ink-900 dark:text-parchment-100 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors">
            {patent.shortTitle}
          </h3>
          <p className="font-serif text-xs text-ink-600 dark:text-parchment-300 italic line-clamp-1">
            {patent.subtitle}
          </p>
        </div>

        {/* Summary */}
        <p className="text-xs font-sans text-ink-700 dark:text-ink-300 line-clamp-3 leading-relaxed">
          {patent.summary}
        </p>

        {/* Inventors & Meta */}
        <div className="pt-2 border-t border-parchment-200 dark:border-ink-800/80 space-y-1.5 text-xs font-mono text-ink-600 dark:text-ink-400">
          <div className="flex items-center gap-1.5 truncate">
            <User className="w-3.5 h-3.5 text-amber-700 dark:text-amber-500 flex-shrink-0" />
            <span className="truncate">{patent.inventors.join(", ")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-700 dark:text-amber-500 flex-shrink-0" />
            <span>Granted: {patent.grantDate}</span>
          </div>
        </div>
      </div>

      {/* Footer tags & CTA */}
      <div className="mt-5 pt-3 border-t border-parchment-200 dark:border-ink-800 flex items-center justify-between text-xs font-mono">
        <span className="inline-flex items-center gap-1 text-amber-800 dark:text-amber-400 font-semibold group-hover:underline">
          <Activity className="w-3 h-3" />
          Interactive Sim &amp; Claims
        </span>
        <span className="flex items-center gap-1 text-ink-500 group-hover:text-amber-700 dark:group-hover:text-amber-400 group-hover:translate-x-1 transition-transform">
          Explore <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}
