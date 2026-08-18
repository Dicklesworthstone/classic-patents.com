"use client";

import {
  Activity,
  Columns,
  Compass,
  Download,
  ExternalLink,
  FileText,
  Printer,
  Scroll,
  Sparkles,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ColorizedEquation } from "@/components/ui/ColorizedEquation";
import { LatexRenderer, TextWithLatex } from "@/components/ui/LatexRenderer";
import { getColorizedEquationsForPatent } from "@/data/colorizedEquations";
import { archivalParallelReadingFor } from "@/data/editions/parallelReadings";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import type { ColorizedEquation as ColorizedEquationType } from "@/types/equation";
import type { Patent } from "@/types/patent";
import { ClaimsDecoder } from "./ClaimsDecoder";
import { CuratedSpecificationEdition } from "./CuratedSpecificationEdition";
import { HistoricalContextPanel } from "./HistoricalContextPanel";
import { InteractiveDiagramViewer } from "./InteractiveDiagramViewer";
import { KernelTickChip } from "./KernelTickChip";
import { MuseumBroadsidePlaque } from "./MuseumBroadsidePlaque";
import { PhysicsTelemetryBadge } from "./PhysicsTelemetryBadge";
import { PatentVisualDispatcher } from "./visuals";
import { WeaveInstrument } from "./WeaveInstrument";

interface DualProjectionViewerProps {
  patent: Patent;
  initialView?: string;
}

const PATENT_VIEW_MODES: PatentViewMode[] = [
  "plain-english",
  "original-spec",
  "interactive-sim",
  "schematic-sheet",
  "pdf-facsimile",
  "split-view",
];

function isPatentViewMode(value: string | undefined): value is PatentViewMode {
  return !!value && (PATENT_VIEW_MODES as string[]).includes(value);
}

function viewModeFromLocation(): PatentViewMode | undefined {
  const candidate = new URLSearchParams(window.location.search).get("view") ?? undefined;
  return isPatentViewMode(candidate) ? candidate : undefined;
}

function handlePrint() {
  if (typeof window !== "undefined") {
    window.print();
  }
}

function TranscriptUnavailable({
  patent,
  hasRawSourceText,
}: {
  patent: Patent;
  hasRawSourceText: boolean;
}) {
  return (
    <div
      className="rounded-2xl border border-amber-300 bg-amber-50/80 p-6 text-ink-900 dark:border-amber-800 dark:bg-amber-950/20 dark:text-parchment-100"
      role="status"
    >
      <h4 className="font-serif text-xl font-bold">
        Complete archival edition is not published yet
      </h4>
      <p className="mt-2 font-sans text-sm leading-relaxed">
        {hasRawSourceText
          ? "A private raw comparison layer exists, but it is not a publication-ready edition. The page deliberately does not render it or substitute a short editorial excerpt."
          : "This record does not yet have an explicitly authored archival edition. The page deliberately does not substitute its short editorial excerpt for the full legal instrument."}
      </p>
      <p className="mt-3 font-sans text-sm leading-relaxed">
        The complete primary source is available as the scanned patent PDF. It remains the
        authoritative comparison document until a full manual React edition is published.
      </p>
      <a
        href={patent.originalPdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-700 px-4 py-2 text-sm font-mono font-bold text-white shadow-sm transition-colors hover:bg-amber-800"
      >
        <FileText className="h-4 w-4" /> Open Complete Original PDF
      </a>
    </div>
  );
}

export type PatentViewMode =
  | "plain-english"
  | "original-spec"
  | "interactive-sim"
  | "schematic-sheet"
  | "pdf-facsimile"
  | "split-view";

export function DualProjectionViewer({ patent, initialView }: DualProjectionViewerProps) {
  const { tick, lastChange } = usePatentPhysics(patent.id);
  const colorizedEquations = useMemo(() => getColorizedEquationsForPatent(patent.id), [patent.id]);
  const [viewMode, setViewModeState] = useState<PatentViewMode>(
    isPatentViewMode(initialView) ? initialView : "plain-english",
  );
  // A raw PDF text layer is private comparison evidence, never a public
  // publication source. The optional edition is already hand-authored in
  // semantic nodes; this component intentionally performs no text cleanup.
  const rawSourceTextAsset =
    patent.originalTextAsset?.kind === "source-pdf-text-layer"
      ? patent.originalTextAsset
      : undefined;
  const archivalEdition = patent.archivalEdition;
  const originalTextLabel = archivalEdition
    ? `Complete manually prepared edition · facsimile reviewed ${archivalEdition.preparedAt}`
    : rawSourceTextAsset
      ? "Raw source-PDF text layer retained privately · manual edition pending"
      : "Complete archival edition unavailable";

  // Hydration-safe: SSR stays on the default face; URL selection applies after
  // mount, so routes remain static while refresh, bookmarks, and history work.
  useEffect(() => {
    const syncFromLocation = () => {
      const view = viewModeFromLocation();
      if (view) setViewModeState(view);
    };

    syncFromLocation();
    window.addEventListener("popstate", syncFromLocation);
    return () => window.removeEventListener("popstate", syncFromLocation);
  }, []);

  const setViewMode = useCallback((mode: PatentViewMode) => {
    setViewModeState(mode);
    const url = new URL(window.location.href);
    if (url.searchParams.get("view") === mode) return;
    url.searchParams.set("view", mode);
    window.history.pushState({ patentView: mode }, "", url);
  }, []);

  // Quick keyboard shortcuts: 1-6 for instant face switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "1") setViewMode("plain-english");
      else if (e.key === "2") setViewMode("original-spec");
      else if (e.key === "3") setViewMode("interactive-sim");
      else if (e.key === "4") setViewMode("schematic-sheet");
      else if (e.key === "5") setViewMode("pdf-facsimile");
      else if (e.key === "6")
        setViewMode(viewMode === "split-view" ? "plain-english" : "split-view");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setViewMode, viewMode]);

  return (
    <div
      className="space-y-8 print:space-y-4"
      data-archival-edition={archivalEdition?.kind ?? "withheld"}
    >
      {/* Archival Broadside Plaque Header (Active during print) */}
      <MuseumBroadsidePlaque patent={patent} />

      {/* Mode Navigation Bar (Hidden during print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-parchment-100/90 dark:bg-ink-900/90 p-2.5 rounded-2xl border border-parchment-300 dark:border-ink-800 shadow-sm print:hidden">
        <div className="flex flex-wrap items-center gap-2 text-sm font-sans">
          <button
            type="button"
            onClick={() => setViewMode("plain-english")}
            title="Plain English Face (Shortcut: 1)"
            className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer ${
              viewMode === "plain-english"
                ? "bg-amber-700 text-white font-bold shadow-sm dark:bg-amber-600"
                : "text-ink-800 dark:text-parchment-200 hover:bg-parchment-200 dark:hover:bg-ink-800 font-medium"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Plain English Face</span>
            <kbd className="hidden md:inline-block text-[10px] font-mono px-1 py-0.2 rounded bg-black/15 dark:bg-white/15 opacity-80">
              1
            </kbd>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("original-spec")}
            title="Original Patent Text (Shortcut: 2)"
            className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer ${
              viewMode === "original-spec"
                ? "bg-amber-700 text-white font-bold shadow-sm dark:bg-amber-600"
                : "text-ink-800 dark:text-parchment-200 hover:bg-parchment-200 dark:hover:bg-ink-800 font-medium"
            }`}
          >
            <Scroll className="w-4 h-4 text-amber-300" />
            <span>Original Patent Text</span>
            <kbd className="hidden md:inline-block text-[10px] font-mono px-1 py-0.2 rounded bg-black/15 dark:bg-white/15 opacity-80">
              2
            </kbd>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("interactive-sim")}
            title="Interactive 3D Simulator (Shortcut: 3)"
            className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer ${
              viewMode === "interactive-sim"
                ? "bg-amber-700 text-white font-bold shadow-sm dark:bg-amber-600"
                : "text-ink-800 dark:text-parchment-200 hover:bg-parchment-200 dark:hover:bg-ink-800 font-medium"
            }`}
          >
            <Activity className="w-4 h-4 text-amber-300" />
            <span>Interactive 3D Simulator</span>
            <kbd className="hidden md:inline-block text-[10px] font-mono px-1 py-0.2 rounded bg-black/15 dark:bg-white/15 opacity-80">
              3
            </kbd>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("schematic-sheet")}
            title="Schematic & Pins (Shortcut: 4)"
            className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer ${
              viewMode === "schematic-sheet"
                ? "bg-amber-700 text-white font-bold shadow-sm dark:bg-amber-600"
                : "text-ink-800 dark:text-parchment-200 hover:bg-parchment-200 dark:hover:bg-ink-800 font-medium"
            }`}
          >
            <Compass className="w-4 h-4 text-amber-300" />
            <span>Schematic &amp; Pins</span>
            <kbd className="hidden md:inline-block text-[10px] font-mono px-1 py-0.2 rounded bg-black/15 dark:bg-white/15 opacity-80">
              4
            </kbd>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("pdf-facsimile")}
            title="Full Original PDF (Shortcut: 5)"
            className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer ${
              viewMode === "pdf-facsimile"
                ? "bg-amber-700 text-white font-bold shadow-sm dark:bg-amber-600"
                : "text-ink-800 dark:text-parchment-200 hover:bg-parchment-200 dark:hover:bg-ink-800 font-medium"
            }`}
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <span>Full Original PDF</span>
            <kbd className="hidden md:inline-block text-[10px] font-mono px-1 py-0.2 rounded bg-black/15 dark:bg-white/15 opacity-80">
              5
            </kbd>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label="Print Museum Plaque & Broadside"
            type="button"
            onClick={handlePrint}
            title="Print Museum Plaque & Broadside"
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-sans border border-parchment-300 dark:border-ink-700 hover:bg-parchment-200 dark:hover:bg-ink-800 text-ink-800 dark:text-ink-200 font-medium flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <span className="hidden sm:inline">Print Broadside</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode(viewMode === "split-view" ? "plain-english" : "split-view")}
            title="Toggle Dual Split-Screen (Shortcut: 6)"
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-sans border flex items-center gap-2 transition-colors shadow-xs cursor-pointer ${
              viewMode === "split-view"
                ? "bg-blue-600 text-white border-blue-700 font-bold"
                : "border-parchment-300 dark:border-ink-700 hover:bg-parchment-200 dark:hover:bg-ink-800 text-ink-800 dark:text-ink-200 font-semibold"
            }`}
          >
            <Columns className="w-4 h-4" />
            <span className="hidden sm:inline">Dual Split-Screen</span>
            <kbd className="hidden md:inline-block text-[10px] font-mono px-1 py-0.2 rounded bg-black/15 dark:bg-white/15 opacity-80">
              6
            </kbd>
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
            <object
              data={`${patent.originalPdfUrl}#toolbar=1&navpanes=0`}
              type="application/pdf"
              aria-label={`${patent.patentNumber} PDF Facsimile`}
              className="w-full h-full border-none bg-ink-900"
            >
              <a
                href={patent.originalPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full items-center justify-center text-sm font-sans text-parchment-100 underline"
              >
                Open the {patent.patentNumber} PDF facsimile
              </a>
            </object>
          </div>
        </div>
      )}

      {/* VIEW MODE: INTERACTIVE SIMULATOR */}
      {viewMode === "interactive-sim" && (
        <div className="space-y-6">
          <PatentVisualDispatcher patentId={patent.id} />
          <WeaveInstrument patentId={patent.id} />
        </div>
      )}

      {/* VIEW MODE: SCHEMATIC SHEET & NUMBERED CALLOUTS */}
      {viewMode === "schematic-sheet" && (
        <div className="space-y-6">
          <InteractiveDiagramViewer
            drawings={patent.drawings}
            patentNumber={patent.patentNumber}
            patentId={patent.id}
          />
          <WeaveInstrument patentId={patent.id} />
        </div>
      )}

      {/* VIEW MODE: SPLIT-SCREEN (DIPTYCH) */}
      {viewMode === "split-view" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Plain English */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-parchment-300 dark:border-ink-800">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h3 className="font-serif text-xl font-bold text-ink-950 dark:text-parchment-100">
                  Face 1: Plain English Breakdown
                </h3>
              </div>
              <KernelTickChip tick={tick} lastChange={lastChange} face="plain" />
            </div>
            <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-4">
              <div className="text-base font-sans leading-relaxed text-ink-900 dark:text-parchment-100">
                <TextWithLatex text={patent.plainEnglishExplanation.overview} />
              </div>
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-sm font-sans text-ink-900 dark:text-emerald-200 leading-relaxed">
                <span className="font-bold block mb-1">Core Physical Mechanism:</span>
                <TextWithLatex text={patent.plainEnglishExplanation.coreMechanism} />
              </div>
            </div>
            <PatentVisualDispatcher patentId={patent.id} />
          </div>

          {/* Right Column: Original Specification */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-parchment-300 dark:border-ink-800">
              <div className="flex items-center gap-2.5">
                <Scroll className="w-5 h-5 text-amber-700 dark:text-amber-500" />
                <h3 className="font-serif text-xl font-bold text-ink-950 dark:text-parchment-100">
                  Face 2: Complete Archival Source Text
                </h3>
              </div>
              <KernelTickChip tick={tick} lastChange={lastChange} face="spec" />
            </div>
            <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-4 max-h-[700px] overflow-y-auto overscroll-contain">
              <p className="text-[11px] font-mono uppercase tracking-wider text-amber-800 dark:text-amber-400">
                {originalTextLabel}
              </p>
              {archivalEdition ? (
                <CuratedSpecificationEdition
                  edition={archivalEdition}
                  paragraphNotes={archivalParallelReadingFor(patent.id)}
                  claimDecoders={patent.claims}
                  className="text-ink-950 select-text dark:text-parchment-100"
                />
              ) : (
                <TranscriptUnavailable
                  patent={patent}
                  hasRawSourceText={Boolean(rawSourceTextAsset)}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE: PLAIN ENGLISH FACE */}
      {viewMode === "plain-english" && (
        <div className="space-y-8">
          {/* Main Plain English Card */}
          <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50/90 dark:bg-ink-950 p-7 sm:p-9 shadow-patent space-y-8">
            <div>
              <span className="text-xs sm:text-sm font-mono text-amber-700 dark:text-amber-400 font-bold uppercase tracking-widest block">
                Engineering Analysis &amp; Physical Principles
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink-950 dark:text-parchment-50">
                How It Works: Step-by-Step Mechanical &amp; Physical Breakdown
              </h3>
            </div>

            {/* Overview */}
            <div className="prose dark:prose-invert max-w-none">
              <div className="font-sans text-base sm:text-lg text-ink-900 dark:text-parchment-100 leading-relaxed">
                <TextWithLatex text={patent.plainEnglishExplanation.overview} />
              </div>
            </div>

            {/* Core Mechanism Callout */}
            <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 dark:bg-amber-950/20 space-y-2">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-serif font-bold text-lg">
                <Zap className="w-5 h-5" />
                <span>The Core Breakthrough Mechanism</span>
              </div>
              <p className="font-sans text-base text-ink-900 dark:text-parchment-100 leading-relaxed">
                <TextWithLatex text={patent.plainEnglishExplanation.coreMechanism} />
              </p>
            </div>

            {/* 3D / 2D Simulation Embedded in Plain English View */}
            <div className="space-y-4 pt-2 print:hidden">
              <div className="flex items-center justify-between">
                <h4 className="font-serif font-bold text-xl text-ink-950 dark:text-parchment-50 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-amber-700 dark:text-amber-500" />
                  <span>Interactive Real-Time Physical Simulation</span>
                </h4>
                <span className="text-xs font-sans text-ink-500 hidden sm:inline">
                  Drag to rotate · Scroll to zoom · Parameters synchronize with live SI telemetry
                </span>
              </div>
              <PatentVisualDispatcher patentId={patent.id} />
              <PhysicsTelemetryBadge patentId={patent.id} />
              <WeaveInstrument patentId={patent.id} />
            </div>

            {/* Step-by-Step Mechanical Breakdown Grid */}
            <div className="space-y-5 pt-5 border-t border-parchment-200 dark:border-ink-800">
              <h4 className="font-serif font-bold text-xl text-ink-950 dark:text-parchment-50">
                Detailed Component Architecture
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {patent.plainEnglishExplanation.mechanicalBreakdown.map((item, idx) => (
                  <div
                    key={item.title}
                    className="p-6 rounded-2xl bg-parchment-100/70 dark:bg-ink-900/60 border border-parchment-300 dark:border-ink-800 space-y-3 shadow-xs"
                  >
                    <h5 className="font-serif font-bold text-lg text-ink-950 dark:text-parchment-100 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-700 text-white text-xs font-mono font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      {item.title}
                    </h5>
                    <div className="text-sm font-sans text-ink-800 dark:text-parchment-200 font-semibold leading-snug">
                      <TextWithLatex text={item.summary} />
                    </div>
                    <p className="text-xs sm:text-sm font-sans text-ink-700 dark:text-ink-300 leading-relaxed">
                      <TextWithLatex text={item.technicalDetails} />
                    </p>
                    {item.archaicTerm && item.modernEquivalent && (
                      <div className="pt-2 border-t border-parchment-200 dark:border-ink-800/80 flex items-center justify-between text-[11px] font-sans">
                        <span className="text-ink-500">
                          19th-C. Term:{" "}
                          <span className="italic text-ink-700 dark:text-ink-300">
                            {item.archaicTerm}
                          </span>
                        </span>
                        <span className="text-amber-800 dark:text-amber-400 font-semibold">
                          Modern: {item.modernEquivalent}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Governing Scientific Equations & Principles (Interactive Colorized Math Explainer) */}
            {(colorizedEquations.length > 0 ||
              patent.plainEnglishExplanation.scientificPrinciples.length > 0) && (
              <div className="space-y-6 pt-6 border-t border-parchment-200 dark:border-ink-800">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <span className="text-xs font-mono text-amber-700 dark:text-amber-400 font-bold uppercase tracking-widest block">
                      Interactive Mathematical Physics &amp; Rigorous Mechanics
                    </span>
                    <h4 className="font-serif font-bold text-xl sm:text-2xl text-ink-950 dark:text-parchment-50">
                      Governing Equations &amp; Colorized Principles
                    </h4>
                  </div>
                  <span className="text-xs font-sans text-ink-600 dark:text-ink-400 italic">
                    Dual-coded visual mapping &amp; live SI telemetry
                  </span>
                </div>

                {/* Primary Interactive Colorized Equations */}
                {colorizedEquations.length > 0 && (
                  <div className="space-y-6">
                    {colorizedEquations.map((eq: ColorizedEquationType) => (
                      <ColorizedEquation key={eq.id} equation={eq} />
                    ))}
                  </div>
                )}

                {/* Additional Scientific Principles Cards */}
                {patent.plainEnglishExplanation.scientificPrinciples.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    {patent.plainEnglishExplanation.scientificPrinciples.map((sci, idx) => (
                      <div
                        key={sci.principle}
                        className="p-6 rounded-2xl bg-parchment-100/80 dark:bg-ink-900/80 border border-parchment-300 dark:border-ink-800 space-y-4 shadow-sm hover:border-amber-700/40 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-amber-900 dark:text-amber-400 font-serif font-bold text-base sm:text-lg">
                            {sci.principle}
                          </span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-700/10 text-amber-800 dark:text-amber-400 border border-amber-700/20">
                            Principle {idx + 1}
                          </span>
                        </div>
                        {sci.formula && (
                          <div className="bg-white dark:bg-ink-950 p-4 rounded-xl text-ink-950 dark:text-parchment-100 text-center text-sm sm:text-base border border-parchment-300 dark:border-ink-800 font-mono overflow-x-auto shadow-inner">
                            <LatexRenderer math={sci.formula} block={true} />
                          </div>
                        )}
                        <div className="text-xs sm:text-sm text-ink-800 dark:text-parchment-200 font-sans leading-relaxed">
                          <TextWithLatex text={sci.explanation} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Historical Schematic Blueprint & Pin Inspector */}
            {patent.drawings && patent.drawings.length > 0 && (
              <div className="space-y-4 pt-5 border-t border-parchment-200 dark:border-ink-800">
                <InteractiveDiagramViewer
                  drawings={patent.drawings}
                  patentNumber={patent.patentNumber}
                  patentId={patent.id}
                />
              </div>
            )}

            {patent.plainEnglishExplanation.whyItMattersToday && (
              <div className="space-y-3 pt-5 border-t border-parchment-200 dark:border-ink-800">
                <h4 className="font-serif font-bold text-xl text-ink-950 dark:text-parchment-50">
                  Why It Still Matters
                </h4>
                <p className="text-base sm:text-lg text-ink-800 dark:text-parchment-200 leading-relaxed font-sans">
                  <TextWithLatex text={patent.plainEnglishExplanation.whyItMattersToday} />
                </p>
              </div>
            )}
          </div>

          {/* Line-by-Line Claims Decoder */}
          <ClaimsDecoder claims={patent.claims} patentId={patent.id} />

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
                  {archivalEdition
                    ? "Complete Manually Prepared Archival Edition"
                    : rawSourceTextAsset
                      ? "Raw Source Layer Withheld From Publication"
                      : "Original-Source Edition Status"}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink-950 dark:text-parchment-50">
                  {patent.patentNumber} · Specification of Letters Patent
                </h3>
                <p className="mt-1 text-xs font-mono text-ink-600 dark:text-ink-400">
                  {originalTextLabel}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={patent.originalPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-sm font-mono font-bold transition-colors flex items-center gap-2 shadow-sm"
                >
                  <FileText className="w-4 h-4" /> Download Original USPTO PDF
                </a>
              </div>
            </div>

            {archivalEdition ? (
              <CuratedSpecificationEdition
                edition={archivalEdition}
                paragraphNotes={archivalParallelReadingFor(patent.id)}
                claimDecoders={patent.claims}
                className="rounded-2xl border border-parchment-300 bg-parchment-100/80 p-6 text-ink-950 shadow-xs select-text dark:border-ink-800 dark:bg-ink-900/80 dark:text-parchment-100 sm:p-10"
              />
            ) : (
              <TranscriptUnavailable
                patent={patent}
                hasRawSourceText={Boolean(rawSourceTextAsset)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
