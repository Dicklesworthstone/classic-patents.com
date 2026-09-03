"use client";

import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CoupledDynamicsStrip } from "@/components/patents/CoupledDynamicsStrip";
import { TextWithLatex } from "@/components/ui/LatexRenderer";
import { allPatents } from "@/data/patents";
import { coupleEdgesFor } from "@/physics/coupleGraph";
import { formatPatentDate } from "@/utils/patentDate";

type EraGroup = "all" | "early" | "gilded" | "modern";

const ERA_TABS: { id: EraGroup; label: string; range: string }[] = [
  { id: "all", label: "All Milestones", range: "1769–2009" },
  { id: "early", label: "Early Republic & Industrial", range: "1769–1869" },
  { id: "gilded", label: "Gilded Age & Electrification", range: "1870–1909" },
  { id: "modern", label: "Atomic, Silicon & Computing", range: "1910–2009" },
];

export function PatentTimeline() {
  const [selectedPatentId, setSelectedPatentId] = useState<string>(allPatents[0].id);
  const [selectedEra, setSelectedEra] = useState<EraGroup>("all");

  // Chronological sort
  const sortedPatents = useMemo(() => {
    return [...allPatents].sort((a, b) => a.grantDate.localeCompare(b.grantDate));
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
  const currentFilteredIndex = filteredPatents.findIndex((p) => p.id === selectedPatent.id);
  const coupleEdges = useMemo(() => coupleEdgesFor(selectedPatent.id, {}), [selectedPatent.id]);
  const selectedPatentHasVisualHold = selectedPatent.id === "us-3671542-kwolek-kevlar";

  // Sync selected patent to filtered set on era tab switch
  useEffect(() => {
    if (filteredPatents.length > 0 && !filteredPatents.some((p) => p.id === selectedPatentId)) {
      setSelectedPatentId(filteredPatents[0].id);
    }
  }, [filteredPatents, selectedPatentId]);

  const selectIndex = useCallback(
    (index: number) => {
      const bounded = Math.max(0, Math.min(filteredPatents.length - 1, index));
      if (filteredPatents[bounded]) {
        setSelectedPatentId(filteredPatents[bounded].id);
      }
    },
    [filteredPatents],
  );

  const selectPrevious = useCallback(() => {
    selectIndex(currentFilteredIndex - 1);
  }, [currentFilteredIndex, selectIndex]);

  const selectNext = useCallback(() => {
    selectIndex(currentFilteredIndex + 1);
  }, [currentFilteredIndex, selectIndex]);

  const selectFirst = useCallback(() => {
    selectIndex(0);
  }, [selectIndex]);

  const selectLast = useCallback(() => {
    selectIndex(filteredPatents.length - 1);
  }, [filteredPatents.length, selectIndex]);

  const stepBy = useCallback(
    (delta: number) => {
      selectIndex(currentFilteredIndex + delta);
    },
    [currentFilteredIndex, selectIndex],
  );

  // Keyboard navigation: Left/Right arrows, Home/End, PageUp/PageDown
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return;
      }
      // Never steal keys while a modal dialog owns the interaction.
      if (typeof document !== "undefined" && document.querySelector("dialog[open]")) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        selectPrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        selectNext();
      } else if (e.key === "Home") {
        e.preventDefault();
        selectFirst();
      } else if (e.key === "End") {
        e.preventDefault();
        selectLast();
      } else if (e.key === "PageUp") {
        e.preventDefault();
        stepBy(-5);
      } else if (e.key === "PageDown") {
        e.preventDefault();
        stepBy(5);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectPrevious, selectNext, selectFirst, selectLast, stepBy]);

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
                aria-pressed={isSelected}
                className={`px-3.5 py-2.5 sm:py-2 rounded-xl text-xs sm:text-sm font-sans font-semibold transition-colors shadow-xs flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-amber-700 text-white font-bold shadow-sm dark:bg-amber-700"
                    : "bg-parchment-50 dark:bg-ink-950 text-ink-800 dark:text-parchment-200 border border-parchment-300 dark:border-ink-800 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-600 dark:text-ink-300"
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
          <span className="font-bold text-amber-700 dark:text-amber-400">
            {currentFilteredIndex + 1}
          </span>{" "}
          of {filteredPatents.length}
        </div>
      </div>

      {/* Interactive Timeline Milestone Scrubber */}
      <div
        data-testid="timeline-scrubber"
        className="p-4 rounded-2xl bg-parchment-100/90 dark:bg-ink-900/80 border border-parchment-300 dark:border-ink-800 shadow-xs space-y-3"
      >
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-700 dark:text-amber-400 text-sm">
              {selectedPatent.grantDate.split("-")[0]}
            </span>
            <span className="text-ink-400 dark:text-ink-500">·</span>
            <span className="font-serif font-bold text-ink-900 dark:text-parchment-100 truncate max-w-[220px] sm:max-w-md">
              {selectedPatent.shortTitle}
            </span>
          </div>
          <div className="text-ink-600 dark:text-ink-400">
            Milestone {currentFilteredIndex + 1} of {filteredPatents.length}
          </div>
        </div>

        <div className="relative flex items-center">
          <input
            type="range"
            min={0}
            max={filteredPatents.length - 1}
            value={currentFilteredIndex >= 0 ? currentFilteredIndex : 0}
            onChange={(e) => selectIndex(Number(e.target.value))}
            aria-label="Timeline milestone scrubber"
            aria-valuemin={1}
            aria-valuemax={filteredPatents.length}
            aria-valuenow={currentFilteredIndex + 1}
            aria-valuetext={`${selectedPatent.shortTitle} (${selectedPatent.grantDate.split("-")[0]})`}
            className="w-full h-2.5 bg-parchment-300 dark:bg-ink-800 rounded-lg appearance-none cursor-pointer accent-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>

        {/* Milestone Key Anchors */}
        <div className="flex justify-between text-[10px] font-mono text-ink-500 dark:text-ink-400 pt-0.5">
          <span>{filteredPatents[0]?.grantDate.split("-")[0] || "1769"}</span>
          <span className="hidden sm:inline">1836 (Colt)</span>
          <span className="hidden md:inline">1876 (Bell)</span>
          <span className="hidden sm:inline">1906 (Wright)</span>
          <span className="hidden md:inline">1947 (Transistor)</span>
          <span className="hidden lg:inline">1977 (Apple)</span>
          <span>
            {filteredPatents[filteredPatents.length - 1]?.grantDate.split("-")[0] || "2009"}
          </span>
        </div>
      </div>

      {/* Interactive Timeline Milestone Cards Grid */}
      <div className="relative py-1">
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 relative z-10">
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
                    ? "bg-amber-700 text-white border-amber-800 dark:bg-amber-700 dark:border-amber-500 scale-102 shadow-md ring-2 ring-amber-400"
                    : "bg-parchment-100 dark:bg-ink-900 border-parchment-300 dark:border-ink-800 hover:bg-parchment-200 dark:hover:bg-ink-800 text-ink-800 dark:text-parchment-200"
                }`}
              >
                <div>
                  <div
                    className={`font-mono font-bold text-xs ${
                      isSelected ? "text-amber-50" : "text-amber-700 dark:text-amber-400"
                    }`}
                  >
                    {year}
                  </div>
                  <div className="font-serif font-bold text-xs mt-1 line-clamp-1">
                    {p.shortTitle}
                  </div>
                </div>
                <div
                  className={`text-[11px] font-mono mt-2 truncate ${
                    isSelected ? "text-amber-50" : "text-ink-600 dark:text-ink-300"
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
                {formatPatentDate(selectedPatent.grantDate)}
              </span>
              <span className="font-mono text-xs text-ink-500 dark:text-ink-400 font-semibold">
                {selectedPatent.patentNumber}
              </span>
              <span className="font-mono text-xs text-ink-500 dark:text-ink-400 uppercase">
                · {selectedPatent.categoryLabel}
              </span>
              <span className="font-mono text-[11px] text-amber-800 dark:text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                #{currentFilteredIndex + 1} of {filteredPatents.length}
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
                className="p-2.5 min-h-11 min-w-11 flex items-center justify-center rounded-lg text-ink-700 dark:text-parchment-300 hover:bg-parchment-300 dark:hover:bg-ink-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                title="Previous Milestone (← Arrow Key)"
                aria-label="Previous Milestone"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={selectNext}
                disabled={currentFilteredIndex >= filteredPatents.length - 1}
                className="p-2.5 min-h-11 min-w-11 flex items-center justify-center rounded-lg text-ink-700 dark:text-parchment-300 hover:bg-parchment-300 dark:hover:bg-ink-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                title="Next Milestone (→ Arrow Key)"
                aria-label="Next Milestone"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <Link
              href={`/patents/${selectedPatent.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 dark:bg-amber-700 dark:hover:bg-amber-800 text-white text-xs sm:text-sm font-sans font-bold transition-colors shadow-sm"
            >
              <span>
                {selectedPatentHasVisualHold
                  ? "Explore Source-Bound Record"
                  : "Explore Patent & 3D Model"}
              </span>
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

        {coupleEdges.length > 0 && (
          <div className="pt-2">
            <CoupledDynamicsStrip edges={coupleEdges} />
          </div>
        )}
      </div>
    </div>
  );
}
