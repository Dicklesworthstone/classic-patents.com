"use client";

import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TextWithLatex } from "@/components/ui/LatexRenderer";
import { allPatents } from "@/data/patents";

type EraGroup = "all" | "early" | "gilded" | "modern";

const ERA_TABS: { id: EraGroup; label: string; range: string }[] = [
  { id: "all", label: "All Milestones", range: "1794–1979" },
  { id: "early", label: "Early Republic & Industrial", range: "1794–1869" },
  { id: "gilded", label: "Gilded Age & Electrification", range: "1870–1909" },
  { id: "modern", label: "Atomic, Silicon & Computing", range: "1910–1979" },
];

export function PatentTimeline() {
  const [selectedPatentId, setSelectedPatentId] = useState<string>(allPatents[0].id);
  const [selectedEra, setSelectedEra] = useState<EraGroup>("all");

  // Chronological sort
  const sortedPatents = useMemo(() => {
    return [...allPatents].sort(
      (a, b) => new Date(a.grantDate).getTime() - new Date(b.grantDate).getTime(),
    );
  }, []);

  const filteredPatents = useMemo(() => {
    if (selectedEra === "all") return sortedPatents;
    return sortedPatents.filter((p) => {
      const year = Number.parseInt(p.grantDate.split("-")[0], 10);
      if (selectedEra === "early") return year < 1870;
      if (selectedEra === "gilded") return year >= 1870 && year < 1910;
      if (selectedEra === "modern") return year >= 1910;
      return true;
    });
  }, [sortedPatents, selectedEra]);

  const selectedPatent =
    filteredPatents.find((p) => p.id === selectedPatentId) ||
    sortedPatents.find((p) => p.id === selectedPatentId) ||
    sortedPatents[0];
  const currentIndex = sortedPatents.findIndex((p) => p.id === selectedPatent.id);
  const currentFilteredIndex = filteredPatents.findIndex((p) => p.id === selectedPatent.id);

  // Sync selected patent to filtered set on era tab switch
  useEffect(() => {
    if (filteredPatents.length > 0 && !filteredPatents.some((p) => p.id === selectedPatentId)) {
      setSelectedPatentId(filteredPatents[0].id);
    }
  }, [filteredPatents, selectedPatentId]);

  const selectPrevious = useCallback(() => {
    if (currentFilteredIndex > 0) {
      setSelectedPatentId(filteredPatents[currentFilteredIndex - 1].id);
    }
  }, [currentFilteredIndex, filteredPatents]);

  const selectNext = useCallback(() => {
    if (currentFilteredIndex < filteredPatents.length - 1) {
      setSelectedPatentId(filteredPatents[currentFilteredIndex + 1].id);
    }
  }, [currentFilteredIndex, filteredPatents]);

  // Keyboard navigation: Left/Right arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        selectPrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        selectNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectPrevious, selectNext]);

  return (
    <div className="space-y-8">
      {/* Era Filter Navigation Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-parchment-100/90 dark:bg-ink-900/80 p-3 rounded-2xl border border-parchment-300 dark:border-ink-800 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {ERA_TABS.map((tab) => {
            const isSelected = selectedEra === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedEra(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-sans font-semibold transition-colors shadow-xs flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-amber-700 text-white font-bold shadow-sm dark:bg-amber-600"
                    : "bg-parchment-50 dark:bg-ink-950 text-ink-800 dark:text-parchment-200 border border-parchment-300 dark:border-ink-800 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-600 dark:text-ink-400"
                  }`}
                >
                  {tab.range}
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-xs font-mono text-ink-600 dark:text-ink-400 px-2 font-medium">
          Milestone{" "}
          <span className="font-bold text-amber-700 dark:text-amber-400">{currentIndex + 1}</span>{" "}
          of {sortedPatents.length}
        </div>
      </div>

      {/* Interactive Timeline Milestone Cards Grid */}
      <div className="relative py-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 relative z-10">
          {filteredPatents.map((p) => {
            const isSelected = p.id === selectedPatent.id;
            const year = p.grantDate.split("-")[0];

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPatentId(p.id)}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? "bg-amber-700 text-white border-amber-800 dark:bg-amber-600 dark:border-amber-500 scale-102 shadow-md ring-2 ring-amber-400"
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
      <div className="rounded-3xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-8 shadow-patent space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-parchment-200 dark:border-ink-800 pb-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-mono text-xs font-bold border border-amber-300 dark:border-amber-700">
                {selectedPatent.grantDate}
              </span>
              <span className="font-mono text-xs text-ink-500 font-semibold">
                {selectedPatent.patentNumber}
              </span>
              <span className="font-mono text-xs text-ink-500 uppercase">
                · {selectedPatent.categoryLabel}
              </span>
              <span className="font-mono text-[11px] text-amber-800 dark:text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                #{currentIndex + 1} of {sortedPatents.length}
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink-900 dark:text-parchment-100">
              {selectedPatent.shortTitle}
            </h3>
            <p className="font-serif text-sm sm:text-base text-ink-700 dark:text-parchment-300 italic">
              {selectedPatent.subtitle}
            </p>
          </div>

          {/* Action & Step Navigation Controls */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 bg-parchment-200 dark:bg-ink-900 p-1 rounded-xl border border-parchment-300 dark:border-ink-800">
              <button
                type="button"
                onClick={selectPrevious}
                disabled={currentFilteredIndex <= 0}
                className="p-1.5 rounded-lg text-ink-700 dark:text-parchment-300 hover:bg-parchment-300 dark:hover:bg-ink-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                title="Previous Milestone (← Arrow Key)"
                aria-label="Previous Milestone"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={selectNext}
                disabled={currentFilteredIndex >= filteredPatents.length - 1}
                className="p-1.5 rounded-lg text-ink-700 dark:text-parchment-300 hover:bg-parchment-300 dark:hover:bg-ink-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                title="Next Milestone (→ Arrow Key)"
                aria-label="Next Milestone"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <Link
              href={`/patents/${selectedPatent.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 text-white text-xs sm:text-sm font-sans font-bold transition-colors shadow-sm"
            >
              <span>Explore Patent &amp; 3D Model</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 3 Columns: Inventor & Bottleneck, Breakthrough, Civilizational Consequence */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-sans">
          {/* Col 1: Problem & Prior Art */}
          <div className="p-4 sm:p-5 rounded-2xl bg-parchment-100/70 dark:bg-ink-900/60 border border-parchment-200 dark:border-ink-800 space-y-2.5">
            <div className="flex items-center justify-between border-b border-parchment-200 dark:border-ink-800 pb-2">
              <span className="font-serif font-bold text-sm text-ink-900 dark:text-parchment-100">
                Inventor &amp; Bottleneck
              </span>
            </div>
            <div className="font-mono text-[11px] text-amber-700 dark:text-amber-400 font-bold">
              {selectedPatent.inventors.join(", ")} · {selectedPatent.inventorLocation}
            </div>
            <div className="text-ink-700 dark:text-ink-300 leading-relaxed font-serif text-sm">
              <TextWithLatex text={selectedPatent.historicalContext.problemStatement} />
            </div>
          </div>

          {/* Col 2: Breakthrough Insight */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 space-y-2.5">
            <div className="flex items-center gap-1.5 border-b border-amber-200 dark:border-amber-800/50 pb-2">
              <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="font-serif font-bold text-sm text-amber-900 dark:text-amber-300">
                The Breakthrough Insight
              </span>
            </div>
            <div className="text-ink-800 dark:text-parchment-200 leading-relaxed italic font-serif text-sm">
              &ldquo;
              <TextWithLatex text={selectedPatent.historicalContext.breakthroughInsight} />
              &rdquo;
            </div>
          </div>

          {/* Col 3: Civilizational Impact */}
          <div className="p-4 sm:p-5 rounded-2xl bg-parchment-100/70 dark:bg-ink-900/60 border border-parchment-200 dark:border-ink-800 space-y-2.5">
            <div className="flex items-center justify-between border-b border-parchment-200 dark:border-ink-800 pb-2">
              <span className="font-serif font-bold text-sm text-ink-900 dark:text-parchment-100">
                Civilizational Impact
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-ink-700 dark:text-ink-300 leading-relaxed font-serif text-sm">
              <TextWithLatex text={selectedPatent.historicalContext.civilizationalImpact} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
