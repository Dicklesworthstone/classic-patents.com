"use client";

import { ArrowRight, Compass, GitBranch, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ALL_PATENT_LINEAGES, getLineageAncestryForPatent } from "@/data/patentLineages";
import { getPatentById } from "@/data/patents";

interface PatentLineageViewProps {
  currentPatentId?: string;
  initialLineageId?: string;
}

export function PatentLineageView({ currentPatentId, initialLineageId }: PatentLineageViewProps) {
  // If currentPatentId is provided, default to its primary lineage
  const contextAncestry = useMemo(() => {
    return currentPatentId ? getLineageAncestryForPatent(currentPatentId) : null;
  }, [currentPatentId]);

  const defaultLineageId =
    contextAncestry?.lineage?.id || initialLineageId || ALL_PATENT_LINEAGES[0].id;
  const [selectedLineageId, setSelectedLineageId] = useState<string>(defaultLineageId);

  const activeLineage = useMemo(() => {
    return ALL_PATENT_LINEAGES.find((l) => l.id === selectedLineageId) || ALL_PATENT_LINEAGES[0];
  }, [selectedLineageId]);

  return (
    <div
      data-testid="patent-lineage-view"
      className="rounded-3xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-8 shadow-patent space-y-6"
    >
      {/* Header & Lineage Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-parchment-200 dark:border-ink-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400">
              <GitBranch className="w-4 h-4" />
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              Technological Lineage &amp; Descent
            </span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink-950 dark:text-parchment-50">
            {activeLineage.title}
          </h3>
          <p className="font-serif text-sm italic text-ink-600 dark:text-parchment-300">
            {activeLineage.subtitle}
          </p>
        </div>

        {/* Lineage Tab Selector (if multiple lineages available) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-parchment-200/80 dark:bg-ink-900 border border-parchment-300 dark:border-ink-800 text-xs font-mono">
          {ALL_PATENT_LINEAGES.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setSelectedLineageId(l.id)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedLineageId === l.id
                  ? "bg-amber-700 text-white font-bold shadow-xs"
                  : "text-ink-700 dark:text-parchment-300 hover:text-ink-950 dark:hover:text-white"
              }`}
            >
              {l.category.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Lineage Narrative Description */}
      <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm font-sans text-ink-700 dark:text-parchment-200 leading-relaxed flex items-start gap-3">
        <Compass className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
        <p>{activeLineage.description}</p>
      </div>

      {/* Sequential Milestone Lineage Chain */}
      <div className="relative pt-2">
        {/* Step Nodes */}
        <div className="space-y-4 relative">
          {activeLineage.steps.map((step, index) => {
            const patent = getPatentById(step.patentId);
            const isCurrent = currentPatentId === step.patentId;
            const isLast = index === activeLineage.steps.length - 1;

            return (
              <div key={step.patentId} className="relative">
                {/* Connecting Vertical Line */}
                {!isLast && (
                  <div
                    aria-hidden="true"
                    className="absolute left-6 sm:left-7 top-14 bottom-[-16px] w-0.5 bg-gradient-to-b from-amber-600/40 via-amber-600/20 to-parchment-300 dark:to-ink-800 -z-0"
                  />
                )}

                <div
                  className={`p-4 sm:p-5 rounded-2xl border transition-all duration-150 relative z-10 ${
                    isCurrent
                      ? "bg-amber-100/90 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-400 shadow-md"
                      : "bg-parchment-100/80 dark:bg-ink-900/70 border-parchment-200 dark:border-ink-800 hover:bg-parchment-200/60 dark:hover:bg-ink-800/80"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-parchment-200 dark:border-ink-800">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-amber-700 text-white font-mono text-xs font-bold flex items-center justify-center shadow-xs">
                        {step.year}
                      </span>
                      <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-parchment-200 dark:bg-ink-800 text-ink-800 dark:text-parchment-200 font-semibold">
                        {step.roleLabel}
                      </span>
                      {isCurrent && (
                        <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-amber-600 text-white font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>This Patent</span>
                        </span>
                      )}
                    </div>

                    {patent && (
                      <Link
                        href={`/patents/${patent.id}`}
                        className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
                      >
                        <span>{patent.patentNumber}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>

                  <div className="pt-2.5 space-y-1">
                    <h4 className="font-serif font-bold text-base sm:text-lg text-ink-950 dark:text-parchment-50">
                      {patent ? patent.shortTitle : step.patentId}
                    </h4>
                    <p className="text-xs sm:text-sm font-sans text-ink-700 dark:text-parchment-300 leading-relaxed">
                      {step.technicalConcept}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
