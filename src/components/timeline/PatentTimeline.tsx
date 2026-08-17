"use client";

import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { allPatents } from "@/data/patents";

export function PatentTimeline() {
  const [selectedPatentId, setSelectedPatentId] = useState<string>(allPatents[0].id);

  // Chronological sort
  const sortedPatents = [...allPatents].sort(
    (a, b) => new Date(a.grantDate).getTime() - new Date(b.grantDate).getTime(),
  );

  const selectedPatent = sortedPatents.find((p) => p.id === selectedPatentId) || sortedPatents[0];

  return (
    <div className="space-y-10">
      {/* Horizontal / Stepped Interactive Timeline Ribbon */}
      <div className="relative py-6">
        {/* Connecting Axis Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-parchment-300 dark:bg-ink-800 -translate-y-1/2 z-0 hidden md:block" />

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 relative z-10">
          {sortedPatents.map((p, _idx) => {
            const isSelected = p.id === selectedPatentId;
            const year = p.grantDate.split("-")[0];

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPatentId(p.id)}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 ${
                  isSelected
                    ? "bg-amber-700 text-white border-amber-800 dark:bg-amber-600 dark:border-amber-500 scale-105 shadow-md"
                    : "bg-parchment-100 dark:bg-ink-900 border-parchment-300 dark:border-ink-800 hover:bg-parchment-200 dark:hover:bg-ink-800 text-ink-800 dark:text-parchment-200"
                }`}
              >
                <div>
                  <div
                    className={`font-mono font-bold text-xs ${
                      isSelected ? "text-amber-200" : "text-amber-700 dark:text-amber-400"
                    }`}
                  >
                    {year}
                  </div>
                  <div className="font-serif font-bold text-xs mt-1 line-clamp-1">
                    {p.shortTitle}
                  </div>
                </div>
                <div
                  className={`text-[10px] font-mono mt-2 truncate ${
                    isSelected ? "text-amber-100" : "text-ink-500"
                  }`}
                >
                  {p.patentNumber}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Patent Milestone Deep-Dive Spotlight Card */}
      <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-8 shadow-patent space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-mono text-xs font-bold border border-amber-300 dark:border-amber-700">
                {selectedPatent.grantDate}
              </span>
              <span className="font-mono text-xs text-ink-500">{selectedPatent.patentNumber}</span>
              <span className="font-mono text-xs text-ink-500 uppercase">
                · {selectedPatent.categoryLabel}
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink-900 dark:text-parchment-100">
              {selectedPatent.shortTitle}
            </h3>
            <p className="font-serif text-sm sm:text-base text-ink-700 dark:text-parchment-300 italic">
              {selectedPatent.subtitle}
            </p>
          </div>

          <div>
            <Link
              href={`/patents/${selectedPatent.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 text-white text-xs font-mono font-medium transition-colors shadow-sm"
            >
              Open Full Workstation &amp; Simulation <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 3 Columns: Inventor & Prior Art, Breakthrough, Civilizational Consequence */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans">
          {/* Col 1 */}
          <div className="p-4 rounded-xl bg-parchment-100/70 dark:bg-ink-900/60 border border-parchment-200 dark:border-ink-800 space-y-2">
            <span className="font-serif font-bold text-sm text-ink-900 dark:text-parchment-100 block">
              Inventor &amp; Bottleneck
            </span>
            <div className="font-mono text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
              {selectedPatent.inventors.join(", ")}
            </div>
            <p className="text-ink-700 dark:text-ink-300 leading-relaxed">
              {selectedPatent.historicalContext.problemStatement}
            </p>
          </div>

          {/* Col 2 */}
          <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 space-y-2">
            <span className="font-serif font-bold text-sm text-amber-900 dark:text-amber-300 block flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> The Breakthrough Insight
            </span>
            <p className="text-ink-800 dark:text-parchment-200 leading-relaxed italic">
              &ldquo;{selectedPatent.historicalContext.breakthroughInsight}&rdquo;
            </p>
          </div>

          {/* Col 3 */}
          <div className="p-4 rounded-xl bg-parchment-100/70 dark:bg-ink-900/60 border border-parchment-200 dark:border-ink-800 space-y-2">
            <span className="font-serif font-bold text-sm text-ink-900 dark:text-parchment-100 block">
              Civilizational Impact
            </span>
            <p className="text-ink-700 dark:text-ink-300 leading-relaxed">
              {selectedPatent.historicalContext.civilizationalImpact}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
