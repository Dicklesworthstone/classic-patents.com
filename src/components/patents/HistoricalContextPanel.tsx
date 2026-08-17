import { AlertCircle, Globe, History, Lightbulb, Sparkles, Swords } from "lucide-react";
import type { HistoricalContext } from "@/types/patent";

interface HistoricalContextPanelProps {
  context: HistoricalContext;
}

export function HistoricalContextPanel({ context }: HistoricalContextPanelProps) {
  return (
    <div className="space-y-8">
      {/* Problem & Prior Art Bottleneck */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50/90 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-3">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="font-serif text-lg sm:text-xl font-bold text-ink-950 dark:text-parchment-100">
              The Historical Bottleneck
            </h3>
          </div>
          <p className="text-sm sm:text-base text-ink-800 dark:text-ink-200 leading-relaxed font-sans">
            {context.problemStatement}
          </p>
        </div>

        <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50/90 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-3">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-ink-600 dark:text-ink-400" />
            <h3 className="font-serif text-lg sm:text-xl font-bold text-ink-950 dark:text-parchment-100">
              Why Prior Art Failed
            </h3>
          </div>
          <ul className="space-y-2.5 text-sm sm:text-base font-sans text-ink-800 dark:text-ink-200">
            {context.priorArtLimitations.map((lim, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-red-500 font-bold mt-1 text-base">•</span>
                <span className="leading-relaxed">{lim}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* The Breakthrough Insight */}
      <div className="rounded-2xl border border-amber-300 dark:border-amber-900/50 bg-gradient-to-r from-amber-50 to-parchment-100 dark:from-ink-900 dark:to-ink-950 p-7 sm:p-8 shadow-patent space-y-3">
        <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-300 font-serif font-bold text-lg sm:text-xl">
          <Lightbulb className="w-5 h-5 text-amber-600" />
          The Breakthrough Insight
        </div>
        <p className="text-base sm:text-lg text-ink-900 dark:text-parchment-100 leading-relaxed font-sans italic font-medium">
          &ldquo;{context.breakthroughInsight}&rdquo;
        </p>
      </div>

      {/* Patent Battles & Litigation Wars */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 border-b border-parchment-300 dark:border-ink-800 pb-3">
          <Swords className="w-5 h-5 text-red-600" />
          <h3 className="font-serif text-lg sm:text-xl font-bold text-ink-950 dark:text-parchment-100">
            Patent Wars &amp; Legal Litigations
          </h3>
        </div>

        <div className="space-y-5">
          {context.patentWars.map((war, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50/90 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800 pb-3.5">
                <span className="font-serif font-bold text-ink-950 dark:text-parchment-100 text-base sm:text-lg">
                  Vs. {war.rivalName}
                </span>
                <span className="text-xs sm:text-sm font-mono px-3 py-1 rounded-md bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800 font-semibold">
                  Infringement Challenge
                </span>
              </div>

              <div className="space-y-3 text-sm sm:text-base font-sans text-ink-800 dark:text-ink-200">
                <div>
                  <span className="font-bold text-ink-950 dark:text-parchment-100 block font-mono text-xs uppercase tracking-wider mb-1">
                    Rival Claim &amp; Defense:
                  </span>
                  <p className="leading-relaxed">{war.rivalClaim}</p>
                </div>
                <div>
                  <span className="font-bold text-ink-950 dark:text-parchment-100 block font-mono text-xs uppercase tracking-wider mb-1">
                    Litigation Conflict:
                  </span>
                  <p className="leading-relaxed">{war.conflictDetails}</p>
                </div>
                <div>
                  <span className="font-bold text-ink-950 dark:text-parchment-100 block font-mono text-xs uppercase tracking-wider mb-1">
                    Final Resolution &amp; Judicial Outcome:
                  </span>
                  <p className="text-emerald-800 dark:text-emerald-300 font-semibold leading-relaxed">
                    {war.resolution}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Civilizational Impact & Fun Fact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50/90 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-3">
          <div className="flex items-center gap-2.5 text-ink-950 dark:text-parchment-100 font-serif font-bold text-lg">
            <Globe className="w-5 h-5 text-blue-500" />
            Civilizational Impact
          </div>
          <p className="text-sm sm:text-base text-ink-800 dark:text-ink-200 leading-relaxed font-sans">
            {context.civilizationalImpact}
          </p>
        </div>

        {context.funFact && (
          <div className="rounded-2xl border border-amber-300 dark:border-amber-900/40 bg-amber-50/70 dark:bg-ink-900/60 p-6 sm:p-7 shadow-patent space-y-3">
            <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-300 font-serif font-bold text-lg">
              <Sparkles className="w-5 h-5 text-amber-600" />
              Historical Fact
            </div>
            <p className="text-sm sm:text-base text-ink-900 dark:text-parchment-100 leading-relaxed font-sans">
              {context.funFact}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
