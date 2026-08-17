"use client";

import {
  Activity,
  Columns,
  Compass,
  Download,
  ExternalLink,
  FileText,
  Scroll,
  Sparkles,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { LatexRenderer, TextWithLatex } from "@/components/ui/LatexRenderer";
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
    | "plain-english"
    | "original-spec"
    | "interactive-sim"
    | "schematic-sheet"
    | "pdf-facsimile"
    | "split-view"
  >("plain-english");

  return (
    <div className="space-y-8">
      {/* Mode Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-parchment-100/90 dark:bg-ink-900/90 p-2.5 rounded-2xl border border-parchment-300 dark:border-ink-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 text-sm font-sans">
          <button
            type="button"
            onClick={() => setViewMode("plain-english")}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all ${
              viewMode === "plain-english"
                ? "bg-amber-700 text-white font-bold shadow-sm dark:bg-amber-600"
                : "text-ink-800 dark:text-parchment-200 hover:bg-parchment-200 dark:hover:bg-ink-800 font-medium"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Plain English Face</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("original-spec")}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all ${
              viewMode === "original-spec"
                ? "bg-amber-700 text-white font-bold shadow-sm dark:bg-amber-600"
                : "text-ink-800 dark:text-parchment-200 hover:bg-parchment-200 dark:hover:bg-ink-800 font-medium"
            }`}
          >
            <Scroll className="w-4 h-4 text-amber-300" />
            <span>Verified Specification Face</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("interactive-sim")}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all ${
              viewMode === "interactive-sim"
                ? "bg-amber-700 text-white font-bold shadow-sm dark:bg-amber-600"
                : "text-ink-800 dark:text-parchment-200 hover:bg-parchment-200 dark:hover:bg-ink-800 font-medium"
            }`}
          >
            <Activity className="w-4 h-4 text-amber-300" />
            <span>Interactive 3D Simulator</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("schematic-sheet")}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all ${
              viewMode === "schematic-sheet"
                ? "bg-amber-700 text-white font-bold shadow-sm dark:bg-amber-600"
                : "text-ink-800 dark:text-parchment-200 hover:bg-parchment-200 dark:hover:bg-ink-800 font-medium"
            }`}
          >
            <Compass className="w-4 h-4 text-amber-300" />
            <span>Schematic &amp; Pins</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("pdf-facsimile")}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all ${
              viewMode === "pdf-facsimile"
                ? "bg-amber-700 text-white font-bold shadow-sm dark:bg-amber-600"
                : "text-ink-800 dark:text-parchment-200 hover:bg-parchment-200 dark:hover:bg-ink-800 font-medium"
            }`}
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <span>Full Original PDF</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === "split-view" ? "plain-english" : "split-view")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-sans border flex items-center gap-2 transition-colors shadow-xs ${
              viewMode === "split-view"
                ? "bg-blue-600 text-white border-blue-700 font-bold"
                : "border-parchment-300 dark:border-ink-700 hover:bg-parchment-200 dark:hover:bg-ink-800 text-ink-800 dark:text-ink-200 font-semibold"
            }`}
          >
            <Columns className="w-4 h-4" />
            <span className="hidden sm:inline">Dual Split-Screen</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE: FULL ORIGINAL PDF FACSIMILE */}
      {viewMode === "pdf-facsimile" && (
        <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-8 shadow-patent space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
            <div>
              <span className="text-xs sm:text-sm font-mono text-amber-700 dark:text-amber-400 font-bold uppercase tracking-widest block">
                Primary Archival Facsimile
              </span>
              <h3 className="font-serif text-2xl font-bold text-ink-950 dark:text-parchment-100">
                {patent.patentNumber} — Original Scanned USPTO Document
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={patent.originalPdfUrl}
                download
                className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-sm font-mono font-bold transition-colors flex items-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" /> Download PDF
              </a>
              <a
                href={patent.googlePatentsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 text-ink-900 dark:text-parchment-100 text-sm font-mono font-semibold transition-colors flex items-center gap-2 border border-parchment-300 dark:border-ink-700"
              >
                <ExternalLink className="w-4 h-4" /> Google Patents
              </a>
            </div>
          </div>

          {/* Embedded PDF Viewer */}
          <div className="w-full h-[800px] rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 bg-ink-900 shadow-inner">
            <iframe
              src={`${patent.originalPdfUrl}#toolbar=1&navpanes=0`}
              title={`${patent.patentNumber} PDF Facsimile`}
              className="w-full h-full border-none"
            />
          </div>
        </div>
      )}

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Plain English */}
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-parchment-300 dark:border-ink-800">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h3 className="font-serif text-xl font-bold text-ink-950 dark:text-parchment-100">
                Face 1: Plain English Breakdown
              </h3>
            </div>
            <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-4">
              <p className="text-base font-sans leading-relaxed text-ink-900 dark:text-parchment-100">
                {patent.plainEnglishExplanation.overview}
              </p>
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-sm font-sans text-ink-900 dark:text-emerald-200 leading-relaxed">
                <span className="font-bold block mb-1">Core Physical Mechanism:</span>
                {patent.plainEnglishExplanation.coreMechanism}
              </div>
            </div>
            <PatentVisualDispatcher patentId={patent.id} />
          </div>

          {/* Right Column: Original Legal Specification */}
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-parchment-300 dark:border-ink-800">
              <Scroll className="w-5 h-5 text-amber-600" />
              <h3 className="font-serif text-xl font-bold text-ink-950 dark:text-parchment-100">
                Face 2: Verbatim Historical Specification
              </h3>
            </div>
            <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/70 dark:bg-ink-900/70 p-6 sm:p-8 shadow-patent max-h-[700px] overflow-y-auto font-serif text-base sm:text-lg text-ink-900 dark:text-parchment-100 space-y-4 whitespace-pre-wrap leading-relaxed">
              {patent.originalText}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE: PLAIN ENGLISH FACE */}
      {viewMode === "plain-english" && (
        <div className="space-y-10">
          {/* Top Interactive Sim Embed */}
          <PatentVisualDispatcher patentId={patent.id} />

          {/* Overview & Core Mechanism */}
          <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50/90 dark:bg-ink-950 p-7 sm:p-9 shadow-patent space-y-7">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-widest text-amber-700 dark:text-amber-400 font-bold">
                <Zap className="w-4 h-4" />
                Physical &amp; Engineering Fundamentals
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink-950 dark:text-parchment-50">
                How It Actually Works (Without Dumbing Things Down)
              </h3>
            </div>

            <p className="text-base sm:text-lg font-sans text-ink-800 dark:text-parchment-200 leading-relaxed">
              {patent.plainEnglishExplanation.overview}
            </p>

            <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-ink-950 dark:text-parchment-100 space-y-2.5 shadow-xs">
              <span className="font-serif font-bold text-base sm:text-lg text-amber-900 dark:text-amber-300 block">
                The Core Mechanism:
              </span>
              <div className="text-sm sm:text-base font-sans leading-relaxed text-ink-800 dark:text-parchment-200">
                <TextWithLatex text={patent.plainEnglishExplanation.coreMechanism} />
              </div>
            </div>

            {/* Step-by-Step Mechanical Deconstructions */}
            <div className="space-y-5 pt-5 border-t border-parchment-200 dark:border-ink-800">
              <h4 className="font-serif font-bold text-xl text-ink-950 dark:text-parchment-50">
                Detailed Mechanical Deconstruction
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {patent.plainEnglishExplanation.mechanicalBreakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-parchment-100/80 dark:bg-ink-900/70 border border-parchment-200 dark:border-ink-800 space-y-3 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-serif font-bold text-lg text-ink-950 dark:text-parchment-50">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base font-sans text-ink-800 dark:text-ink-200 leading-relaxed">
                      {item.summary}
                    </p>
                    <div className="text-xs sm:text-sm font-mono text-ink-800 dark:text-ink-200 bg-parchment-200/60 dark:bg-ink-950/70 p-3 rounded-xl border border-parchment-300 dark:border-ink-800 leading-relaxed">
                      <TextWithLatex text={item.technicalDetails} />
                    </div>
                    {item.archaicTerm && (
                      <div className="flex items-center justify-between text-xs font-mono pt-1 text-ink-600 dark:text-ink-400">
                        <span>
                          19th-C Term: <em>&ldquo;{item.archaicTerm}&rdquo;</em>
                        </span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
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
              <div className="space-y-5 pt-5 border-t border-parchment-200 dark:border-ink-800">
                <h4 className="font-serif font-bold text-xl text-ink-950 dark:text-parchment-50">
                  Governing Physical Equations &amp; Principles
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {patent.plainEnglishExplanation.scientificPrinciples.map((sci, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-ink-950 text-white border border-ink-800 space-y-3 font-mono text-sm shadow-md"
                    >
                      <span className="text-amber-400 font-bold text-base block">
                        {sci.principle}
                      </span>
                      {sci.formula && (
                        <div className="bg-ink-900/90 p-4 rounded-xl text-emerald-300 text-center text-sm sm:text-base border border-ink-800 overflow-x-auto">
                          <LatexRenderer math={sci.formula} block={true} />
                        </div>
                      )}
                      <div className="text-xs sm:text-sm text-ink-300 font-sans leading-relaxed">
                        <TextWithLatex text={sci.explanation} />
                      </div>
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
          <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50/90 dark:bg-ink-950 p-7 sm:p-9 shadow-patent space-y-7">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
              <div>
                <span className="text-xs sm:text-sm font-mono text-amber-700 dark:text-amber-400 font-bold uppercase tracking-widest block">
                  USPTO Verified Historical Record
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink-950 dark:text-parchment-50">
                  {patent.patentNumber} · Specification of Letters Patent
                </h3>
              </div>
              <a
                href={patent.originalPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-sm font-mono font-bold transition-colors flex items-center gap-2 shadow-sm"
              >
                <FileText className="w-4 h-4" /> Download Original USPTO PDF
              </a>
            </div>

            {/* Verbatim Text Block */}
            <div className="p-8 sm:p-10 rounded-2xl bg-parchment-100/80 dark:bg-ink-900/80 border border-parchment-300 dark:border-ink-800 text-base sm:text-lg font-serif text-ink-950 dark:text-parchment-100 leading-relaxed whitespace-pre-wrap select-text shadow-xs">
              {patent.originalText}
            </div>

            {/* Claims section */}
            <div className="space-y-4 pt-5 border-t border-parchment-200 dark:border-ink-800">
              <h4 className="font-serif font-bold text-xl text-ink-950 dark:text-parchment-50">
                Formal Numbered Claims
              </h4>
              <div className="space-y-4">
                {patent.claims.map((claim) => (
                  <div
                    key={claim.number}
                    className="p-5 rounded-xl bg-parchment-100/60 dark:bg-ink-900/60 border border-parchment-200 dark:border-ink-800 space-y-2 text-sm font-mono shadow-xs"
                  >
                    <span className="font-bold text-amber-800 dark:text-amber-400 block text-base">
                      Claim #{claim.number} {claim.isIndependent ? "(Independent)" : "(Dependent)"}
                    </span>
                    <p className="text-ink-900 dark:text-parchment-100 italic leading-relaxed text-sm sm:text-base">
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
