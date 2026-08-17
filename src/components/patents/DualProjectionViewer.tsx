"use client";

import { Activity, Columns, Compass, FileText, Scroll, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import type { Patent } from "@/types/patent";
import { ClaimsDecoder } from "./ClaimsDecoder";
import { HistoricalContextPanel } from "./HistoricalContextPanel";
import { InteractiveDiagramViewer } from "./InteractiveDiagramViewer";
import { PatentVisualDispatcher } from "./visuals";

interface DualProjectionViewerProps {
  patent: Patent;
}

export function DualProjectionViewer({ patent }: DualProjectionViewerProps) {
  const [viewMode, setViewMode] = useState<
    "plain-english" | "original-spec" | "interactive-sim" | "schematic-sheet" | "split-view"
  >("plain-english");

  return (
    <div className="space-y-6">
      {/* Mode Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-parchment-100 dark:bg-ink-900/80 p-2 rounded-xl border border-parchment-300 dark:border-ink-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <button
            type="button"
            onClick={() => setViewMode("plain-english")}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === "plain-english"
                ? "bg-amber-700 text-white font-bold shadow-sm dark:bg-amber-600"
                : "text-ink-700 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Plain English Face</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("original-spec")}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === "original-spec"
                ? "bg-amber-700 text-white font-bold shadow-sm dark:bg-amber-600"
                : "text-ink-700 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
            }`}
          >
            <Scroll className="w-4 h-4" />
            <span>Verbatim Specification Face</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("interactive-sim")}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === "interactive-sim"
                ? "bg-amber-700 text-white font-bold shadow-sm dark:bg-amber-600"
                : "text-ink-700 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Interactive Simulator</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("schematic-sheet")}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === "schematic-sheet"
                ? "bg-amber-700 text-white font-bold shadow-sm dark:bg-amber-600"
                : "text-ink-700 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Schematic &amp; Callouts</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === "split-view" ? "plain-english" : "split-view")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono border flex items-center gap-1.5 transition-colors ${
              viewMode === "split-view"
                ? "bg-blue-600 text-white border-blue-700 font-bold"
                : "border-parchment-300 dark:border-ink-700 hover:bg-parchment-200 dark:hover:bg-ink-800 text-ink-700 dark:text-ink-300"
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dual Split-Screen</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE: INTERACTIVE SIMULATOR */}
      {viewMode === "interactive-sim" && (
        <div className="space-y-6">
          <PatentVisualDispatcher patentId={patent.id} />
        </div>
      )}

      {/* VIEW MODE: SCHEMATIC SHEET & NUMBERED CALLOUTS */}
      {viewMode === "schematic-sheet" && (
        <div className="space-y-6">
          <InteractiveDiagramViewer drawings={patent.drawings} patentNumber={patent.patentNumber} />
        </div>
      )}

      {/* VIEW MODE: SPLIT-SCREEN (DIPTYCH) */}
      {viewMode === "split-view" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Plain English */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-parchment-300 dark:border-ink-800">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h3 className="font-serif font-bold text-ink-900 dark:text-parchment-100">
                Face 1: Plain English Breakdown
              </h3>
            </div>
            <div className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 shadow-patent space-y-4">
              <p className="text-sm font-sans leading-relaxed text-ink-800 dark:text-parchment-200">
                {patent.plainEnglishExplanation.overview}
              </p>
              <div className="p-4 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs font-sans text-ink-800 dark:text-emerald-200">
                <span className="font-bold block mb-1">Core Physical Mechanism:</span>
                {patent.plainEnglishExplanation.coreMechanism}
              </div>
            </div>
            <PatentVisualDispatcher patentId={patent.id} />
          </div>

          {/* Right Column: Original Legal Specification */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-parchment-300 dark:border-ink-800">
              <Scroll className="w-4 h-4 text-amber-600" />
              <h3 className="font-serif font-bold text-ink-900 dark:text-parchment-100">
                Face 2: Verbatim Historical Specification
              </h3>
            </div>
            <div className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/60 dark:bg-ink-900/60 p-6 shadow-patent max-h-[600px] overflow-y-auto font-mono text-xs text-ink-800 dark:text-parchment-200 space-y-4 whitespace-pre-wrap leading-relaxed">
              {patent.originalText}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE: PLAIN ENGLISH FACE */}
      {viewMode === "plain-english" && (
        <div className="space-y-8">
          {/* Top Interactive Sim Embed */}
          <PatentVisualDispatcher patentId={patent.id} />

          {/* Overview & Core Mechanism */}
          <div className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-8 shadow-patent space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-700 dark:text-amber-400 font-bold">
                <Zap className="w-3.5 h-3.5" />
                Physical &amp; Engineering Fundamentals
              </div>
              <h3 className="font-serif text-2xl font-bold text-ink-900 dark:text-parchment-100">
                How It Actually Works (Without Dumbing Things Down)
              </h3>
            </div>

            <p className="text-sm sm:text-base font-sans text-ink-800 dark:text-parchment-200 leading-relaxed">
              {patent.plainEnglishExplanation.overview}
            </p>

            <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-ink-900 dark:text-parchment-100 space-y-2">
              <span className="font-serif font-bold text-sm text-amber-900 dark:text-amber-300 block">
                The Core Mechanism:
              </span>
              <p className="text-xs sm:text-sm font-sans leading-relaxed text-ink-800 dark:text-parchment-200">
                {patent.plainEnglishExplanation.coreMechanism}
              </p>
            </div>

            {/* Step-by-Step Mechanical Deconstructions */}
            <div className="space-y-4 pt-4 border-t border-parchment-200 dark:border-ink-800">
              <h4 className="font-serif font-bold text-base text-ink-900 dark:text-parchment-100">
                Detailed Mechanical Deconstruction
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {patent.plainEnglishExplanation.mechanicalBreakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-parchment-100/70 dark:bg-ink-900/60 border border-parchment-200 dark:border-ink-800 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-serif font-bold text-sm text-ink-900 dark:text-parchment-100">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-xs font-sans text-ink-700 dark:text-ink-300 leading-relaxed">
                      {item.summary}
                    </p>
                    <div className="text-[11px] font-mono text-ink-600 dark:text-ink-400 bg-parchment-200/50 dark:bg-ink-950/60 p-2.5 rounded border border-parchment-300 dark:border-ink-800">
                      {item.technicalDetails}
                    </div>
                    {item.archaicTerm && (
                      <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-ink-500">
                        <span>
                          19th-C Term: <em>&ldquo;{item.archaicTerm}&rdquo;</em>
                        </span>
                        <span className="text-emerald-700 dark:text-emerald-400">
                          → {item.modernEquivalent}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Governing Scientific Equations & Principles */}
            {patent.plainEnglishExplanation.scientificPrinciples.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-parchment-200 dark:border-ink-800">
                <h4 className="font-serif font-bold text-base text-ink-900 dark:text-parchment-100">
                  Governing Physical Equations &amp; Principles
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {patent.plainEnglishExplanation.scientificPrinciples.map((sci, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg bg-ink-950 text-white border border-ink-800 space-y-2 font-mono text-xs"
                    >
                      <span className="text-amber-400 font-bold block">{sci.principle}</span>
                      {sci.formula && (
                        <div className="bg-ink-900 p-2 rounded text-emerald-300 text-center text-xs tracking-wider border border-ink-800">
                          {sci.formula}
                        </div>
                      )}
                      <p className="text-[11px] text-ink-300 font-sans leading-normal">
                        {sci.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Line-by-Line Claims Decoder */}
          <ClaimsDecoder claims={patent.claims} />

          {/* Historical Context & Patent Wars */}
          <HistoricalContextPanel context={patent.historicalContext} />
        </div>
      )}

      {/* VIEW MODE: ORIGINAL SPECIFICATION */}
      {viewMode === "original-spec" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-8 shadow-patent space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
              <div>
                <span className="text-xs font-mono text-amber-700 dark:text-amber-400 font-bold uppercase tracking-widest block">
                  USPTO Verified Historical Record
                </span>
                <h3 className="font-serif text-2xl font-bold text-ink-900 dark:text-parchment-100">
                  {patent.patentNumber} · Specification of Letters Patent
                </h3>
              </div>
              <a
                href={patent.originalPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-mono font-medium transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" /> Download Original USPTO PDF
              </a>
            </div>

            {/* Verbatim OCR Text Block */}
            <div className="p-6 rounded-xl bg-parchment-100/70 dark:bg-ink-900/80 border border-parchment-300 dark:border-ink-800 text-xs font-mono text-ink-900 dark:text-parchment-100 leading-relaxed whitespace-pre-wrap font-mono select-text">
              {patent.originalText}
            </div>

            {/* Claims section */}
            <div className="space-y-4 pt-4 border-t border-parchment-200 dark:border-ink-800">
              <h4 className="font-serif font-bold text-lg text-ink-900 dark:text-parchment-100">
                Formal Numbered Claims
              </h4>
              <div className="space-y-3">
                {patent.claims.map((claim) => (
                  <div
                    key={claim.number}
                    className="p-4 rounded-lg bg-parchment-100/50 dark:bg-ink-900/50 border border-parchment-200 dark:border-ink-800 space-y-1 text-xs font-mono"
                  >
                    <span className="font-bold text-amber-800 dark:text-amber-400 block">
                      Claim {claim.number} {claim.isIndependent ? "(Independent)" : "(Dependent)"}
                    </span>
                    <p className="text-ink-800 dark:text-parchment-200 italic leading-relaxed">
                      &ldquo;{claim.originalText}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
