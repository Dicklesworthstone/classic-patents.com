"use client";

import { Check, Copy, Download, Printer, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TextWithLatex } from "@/components/ui/LatexRenderer";
import type { Patent } from "@/types/patent";
import { formatPatentDate } from "@/utils/patentDate";

export interface PrintBroadsideModalProps {
  isOpen: boolean;
  onClose: () => void;
  patent: Patent;
}

export type BroadsidePaperFormat = "letter" | "a4" | "tabloid";
export type BroadsideTheme = "parchment" | "blueprint" | "monochrome";

export function PrintBroadsideModal({ isOpen, onClose, patent }: PrintBroadsideModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [paperFormat, setPaperFormat] = useState<BroadsidePaperFormat>("letter");
  const [theme, setTheme] = useState<BroadsideTheme>("parchment");
  const [includePreamble, setIncludePreamble] = useState<boolean>(true);
  const [includeMechanism, setIncludeMechanism] = useState<boolean>(true);
  const [includeClaims, setIncludeClaims] = useState<boolean>(true);
  const [includeInnovations, setIncludeInnovations] = useState<boolean>(true);
  const [includeCitation, setIncludeCitation] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const closeOnBackdropClick = (event: MouseEvent) => {
      if (event.target === dialog) onClose();
    };
    dialog.addEventListener("click", closeOnBackdropClick);
    return () => dialog.removeEventListener("click", closeOnBackdropClick);
  }, [onClose]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleCopyText = () => {
    if (typeof window === "undefined" || !navigator.clipboard?.writeText) return;

    const sections: string[] = [
      `========================================================================`,
      `THE UNITED STATES PATENT ARCHIVE — HISTORICAL SPECIFICATION BROADSIDE`,
      `Curated & Published by Classic Patents (https://classic-patents.com)`,
      `========================================================================`,
      ``,
      `PATENT: ${patent.patentNumber} — ${patent.title.toUpperCase()}`,
      `SHORT TITLE: ${patent.shortTitle}`,
      `SUBTITLE: ${patent.subtitle}`,
      `INVENTORS: ${patent.inventors.join(", ")}`,
      `LOCATION: ${patent.inventorLocation}`,
      `CLASSIFICATION: ${patent.usptoClassification}`,
      `GRANT DATE: ${formatPatentDate(patent.grantDate)}`,
      `FILING DATE: ${patent.filingDate ? formatPatentDate(patent.filingDate) : "Not recorded"}`,
      `ERA: ${patent.era} (${patent.categoryLabel})`,
      ``,
      `------------------------------------------------------------------------`,
      `HISTORICAL SUMMARY & EXCERPT`,
      `------------------------------------------------------------------------`,
      patent.summary,
      ``,
    ];

    if (includeMechanism && patent.plainEnglishExplanation) {
      sections.push(
        `------------------------------------------------------------------------`,
        `CORE MECHANISM & SCIENTIFIC PRINCIPLES`,
        `------------------------------------------------------------------------`,
        patent.plainEnglishExplanation.overview,
        ``,
        patent.plainEnglishExplanation.coreMechanism,
        ``,
      );
      if (patent.plainEnglishExplanation.scientificPrinciples?.length) {
        sections.push(`GOVERNING PRINCIPLES:`);
        for (const p of patent.plainEnglishExplanation.scientificPrinciples) {
          sections.push(`• ${p.principle}: ${p.formula} — ${p.explanation}`);
        }
        sections.push(``);
      }
    }

    if (includeClaims && patent.claims?.length) {
      sections.push(
        `------------------------------------------------------------------------`,
        `KEY PATENT CLAIMS & LEGAL SIGNIFICANCE`,
        `------------------------------------------------------------------------`,
      );
      for (const c of patent.claims.slice(0, 5)) {
        const typeLabel = c.isIndependent ? "INDEPENDENT" : "DEPENDENT";
        sections.push(
          `[Claim ${c.number} (${typeLabel})]`,
          c.plainEnglish,
          c.legalSignificance ? `Legal Significance: ${c.legalSignificance}` : ``,
          ``,
        );
      }
    }

    if (includeInnovations && patent.plainEnglishExplanation?.mechanicalBreakdown?.length) {
      sections.push(
        `------------------------------------------------------------------------`,
        `MECHANICAL BREAKDOWN & ARCHAIC-TO-MODERN CONVERSIONS`,
        `------------------------------------------------------------------------`,
      );
      for (const m of patent.plainEnglishExplanation.mechanicalBreakdown) {
        sections.push(
          `• ${m.title.toUpperCase()}: ${m.summary}`,
          `  Archaic Term: "${m.archaicTerm}" -> Modern: "${m.modernEquivalent}"`,
          ``,
        );
      }
    }

    if (includeCitation) {
      sections.push(
        `------------------------------------------------------------------------`,
        `ARCHIVAL CITATION & PERSISTENT IDENTIFIER`,
        `------------------------------------------------------------------------`,
        `Persistent URL: https://classic-patents.com/patents/${patent.id}`,
        `Original USPTO Facsimile: https://classic-patents.com${patent.originalPdfUrl}`,
        `Retrieved from Classic Patents Digital Museum.`,
      );
    }

    navigator.clipboard
      .writeText(sections.join("\n"))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  };

  return (
    <dialog
      ref={dialogRef}
      id="patent-broadside-dialog"
      data-testid="patent-broadside-dialog"
      aria-modal="true"
      aria-labelledby="broadside-modal-title"
      className="fixed inset-0 z-50 m-auto w-[min(56rem,calc(100vw-2rem))] max-h-[92dvh] p-0 bg-transparent border-none open:flex open:items-center open:justify-center backdrop:bg-ink-950/80 backdrop:backdrop-blur-sm"
      onClose={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div className="w-full max-w-5xl bg-parchment-50 dark:bg-ink-950 rounded-2xl border border-parchment-300 dark:border-ink-800 shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] relative">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-parchment-200 dark:border-ink-800 flex items-center justify-between gap-3 bg-parchment-100/70 dark:bg-ink-900/60">
          <div className="flex items-center gap-2.5">
            <Printer className="w-5 h-5 text-amber-700 dark:text-amber-500" />
            <div>
              <h2
                id="broadside-modal-title"
                className="font-serif text-lg sm:text-xl font-bold text-ink-950 dark:text-parchment-100"
              >
                Museum Broadside &amp; Archival Print Edition
              </h2>
              <p className="text-xs text-ink-500 dark:text-ink-400 font-sans">
                Authentic archival layout formatted for framing, study, and high-resolution printing
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-ink-500 hover:text-ink-950 dark:text-ink-400 dark:hover:text-parchment-100 hover:bg-parchment-200/50 dark:hover:bg-ink-800/50 transition-colors cursor-pointer"
            aria-label="Close broadside modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customization Toolbar */}
        <div className="px-4 py-3 border-b border-parchment-200 dark:border-ink-800 bg-parchment-100/40 dark:bg-ink-900/40 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          {/* Format & Theme Selectors */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-ink-500 uppercase tracking-wider text-[10px] font-bold">
                Paper:
              </span>
              <div className="inline-flex rounded-lg border border-parchment-300 dark:border-ink-700 bg-white dark:bg-ink-900 p-0.5">
                {(
                  [
                    ["letter", "Letter (8.5×11″)"],
                    ["a4", "A4 (210×297mm)"],
                    ["tabloid", "Tabloid (11×17″)"],
                  ] as const
                ).map(([fmt, label]) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setPaperFormat(fmt)}
                    className={`px-2 py-1 rounded-md transition-colors ${
                      paperFormat === fmt
                        ? "bg-amber-700 text-white font-bold shadow-2xs"
                        : "text-ink-700 dark:text-ink-300 hover:text-amber-700 dark:hover:text-amber-400"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-ink-500 uppercase tracking-wider text-[10px] font-bold">
                Theme:
              </span>
              <div className="inline-flex rounded-lg border border-parchment-300 dark:border-ink-700 bg-white dark:bg-ink-900 p-0.5">
                {(
                  [
                    ["parchment", "Parchment"],
                    ["blueprint", "Blueprint"],
                    ["monochrome", "Monochrome"],
                  ] as const
                ).map(([thm, label]) => (
                  <button
                    key={thm}
                    type="button"
                    onClick={() => setTheme(thm)}
                    className={`px-2 py-1 rounded-md transition-colors ${
                      theme === thm
                        ? "bg-amber-700 text-white font-bold shadow-2xs"
                        : "text-ink-700 dark:text-ink-300 hover:text-amber-700 dark:hover:text-amber-400"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-1 cursor-pointer text-ink-700 dark:text-ink-300">
              <input
                type="checkbox"
                checked={includePreamble}
                onChange={(e) => setIncludePreamble(e.target.checked)}
                className="rounded border-parchment-300 text-amber-700 focus:ring-amber-500"
              />
              <span>Preamble</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer text-ink-700 dark:text-ink-300">
              <input
                type="checkbox"
                checked={includeMechanism}
                onChange={(e) => setIncludeMechanism(e.target.checked)}
                className="rounded border-parchment-300 text-amber-700 focus:ring-amber-500"
              />
              <span>Mechanism</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer text-ink-700 dark:text-ink-300">
              <input
                type="checkbox"
                checked={includeClaims}
                onChange={(e) => setIncludeClaims(e.target.checked)}
                className="rounded border-parchment-300 text-amber-700 focus:ring-amber-500"
              />
              <span>Claims</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer text-ink-700 dark:text-ink-300">
              <input
                type="checkbox"
                checked={includeInnovations}
                onChange={(e) => setIncludeInnovations(e.target.checked)}
                className="rounded border-parchment-300 text-amber-700 focus:ring-amber-500"
              />
              <span>Innovations</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer text-ink-700 dark:text-ink-300">
              <input
                type="checkbox"
                checked={includeCitation}
                onChange={(e) => setIncludeCitation(e.target.checked)}
                className="rounded border-parchment-300 text-amber-700 focus:ring-amber-500"
              />
              <span>Citation</span>
            </label>
          </div>
        </div>

        {/* Broadside Scrollable Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-parchment-200/50 dark:bg-ink-900/50 flex justify-center">
          <div
            id="archival-broadside-sheet"
            className={`w-full max-w-3xl rounded-xl transition-all shadow-md p-6 sm:p-8 font-serif leading-relaxed ${
              theme === "parchment"
                ? "bg-[#faf6ee] text-[#241c15] border-4 border-double border-[#8a6845]/40"
                : theme === "blueprint"
                  ? "bg-[#0b1d33] text-[#d6e5ff] border-4 border-double border-[#38bdf8]/40 blueprint-grid"
                  : "bg-white text-black border-4 border-double border-black"
            }`}
          >
            {/* Broadside Archival Header / Masthead */}
            <div
              className={`text-center pb-4 mb-5 border-b-2 ${
                theme === "parchment"
                  ? "border-[#8a6845]/50"
                  : theme === "blueprint"
                    ? "border-[#38bdf8]/50"
                    : "border-black"
              }`}
            >
              <div
                className={`text-[9pt] sm:text-[10pt] tracking-[0.3em] uppercase font-bold ${
                  theme === "parchment"
                    ? "text-[#694e33]"
                    : theme === "blueprint"
                      ? "text-[#7dd3fc]"
                      : "text-gray-700"
                }`}
              >
                The United States Patent &amp; Trademark Archive
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-wide uppercase mt-1">
                Historical Specification &amp; Engineering Broadside
              </h1>
              <div
                className={`text-[9pt] italic mt-1 font-sans ${
                  theme === "parchment"
                    ? "text-[#7a624d]"
                    : theme === "blueprint"
                      ? "text-[#93c5fd]"
                      : "text-gray-600"
                }`}
              >
                Curated, Verified &amp; Restored by Classic Patents (classic-patents.com)
              </div>
            </div>

            {/* Patent Identity Bar */}
            <div
              className={`flex flex-wrap items-baseline justify-between gap-3 pb-3 mb-4 border-b border-dashed ${
                theme === "parchment"
                  ? "border-[#8a6845]/40"
                  : theme === "blueprint"
                    ? "border-[#38bdf8]/40"
                    : "border-gray-400"
              }`}
            >
              <div>
                <span className="font-bold text-lg sm:text-xl block tracking-tight">
                  {patent.title.toUpperCase()}
                </span>
                <span
                  className={`text-xs sm:text-sm italic block mt-0.5 ${
                    theme === "parchment"
                      ? "text-[#59432e]"
                      : theme === "blueprint"
                        ? "text-[#bae6fd]"
                        : "text-gray-700"
                  }`}
                >
                  {patent.subtitle}
                </span>
              </div>
              <div className="text-right font-mono">
                <span
                  className={`font-bold text-lg sm:text-xl block ${
                    theme === "parchment"
                      ? "text-amber-900"
                      : theme === "blueprint"
                        ? "text-cyan-300"
                        : "text-black"
                  }`}
                >
                  {patent.patentNumber}
                </span>
                <span
                  className={`text-xs block ${
                    theme === "parchment"
                      ? "text-[#694e33]"
                      : theme === "blueprint"
                        ? "text-[#7dd3fc]"
                        : "text-gray-600"
                  }`}
                >
                  Class: {patent.usptoClassification}
                </span>
              </div>
            </div>

            {/* Metadata 3-Column Grid */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-3 gap-3 text-[9pt] font-sans pb-3 mb-5 border-b ${
                theme === "parchment"
                  ? "border-[#8a6845]/30 text-[#423120]"
                  : theme === "blueprint"
                    ? "border-[#38bdf8]/30 text-[#c7d2fe]"
                    : "border-gray-300 text-gray-800"
              }`}
            >
              <div>
                <span className="font-bold block uppercase text-[8pt] tracking-wider opacity-75">
                  Inventor(s):
                </span>
                <span className="font-semibold">{patent.inventors.join(", ")}</span>
              </div>
              <div>
                <span className="font-bold block uppercase text-[8pt] tracking-wider opacity-75">
                  Origin / Location:
                </span>
                <span>{patent.inventorLocation}</span>
              </div>
              <div>
                <span className="font-bold block uppercase text-[8pt] tracking-wider opacity-75">
                  Grant &amp; Filing:
                </span>
                <span>
                  {patent.filingDate ? `Filed ${formatPatentDate(patent.filingDate)} · ` : ""}
                  Granted {formatPatentDate(patent.grantDate)}
                </span>
              </div>
            </div>

            {/* Section 1: Summary & Excerpt */}
            {includePreamble && (
              <div className="space-y-2 mb-5 text-sm sm:text-base">
                <h3
                  className={`text-xs uppercase font-sans font-bold tracking-widest border-b pb-1 ${
                    theme === "parchment"
                      ? "border-[#8a6845]/30 text-[#694e33]"
                      : theme === "blueprint"
                        ? "border-[#38bdf8]/30 text-[#7dd3fc]"
                        : "border-black text-black"
                  }`}
                >
                  I. Historical Context &amp; Grant Summary
                </h3>
                <div className="leading-relaxed">
                  <TextWithLatex text={patent.summary} />
                </div>
              </div>
            )}

            {/* Section 2: Core Mechanism & Governing Equations */}
            {includeMechanism && patent.plainEnglishExplanation && (
              <div className="space-y-3 mb-5 text-sm sm:text-base">
                <h3
                  className={`text-xs uppercase font-sans font-bold tracking-widest border-b pb-1 ${
                    theme === "parchment"
                      ? "border-[#8a6845]/30 text-[#694e33]"
                      : theme === "blueprint"
                        ? "border-[#38bdf8]/30 text-[#7dd3fc]"
                        : "border-black text-black"
                  }`}
                >
                  II. Core Mechanism &amp; Scientific Principles
                </h3>
                <p className="leading-relaxed text-xs sm:text-sm">
                  {patent.plainEnglishExplanation.overview}
                </p>
                <div
                  className={`p-3 rounded-lg text-xs sm:text-sm font-sans leading-relaxed ${
                    theme === "parchment"
                      ? "bg-[#f2ebd9] border border-[#8a6845]/20 text-[#3d2b1a]"
                      : theme === "blueprint"
                        ? "bg-[#132c4a] border border-[#38bdf8]/30 text-[#e0f2fe]"
                        : "bg-gray-100 border border-gray-300 text-gray-900"
                  }`}
                >
                  <strong className="block font-serif text-sm mb-1">Physical Operation:</strong>
                  {patent.plainEnglishExplanation.coreMechanism}
                </div>

                {patent.plainEnglishExplanation.scientificPrinciples?.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-xs font-bold font-sans uppercase tracking-wider block opacity-80">
                      Governing Formulation:
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {patent.plainEnglishExplanation.scientificPrinciples.slice(0, 3).map((p) => (
                        <div
                          key={p.principle}
                          className="flex flex-wrap items-baseline justify-between gap-2 text-xs font-mono border-b border-dotted pb-1 border-current/20"
                        >
                          <span className="font-bold">{p.principle}:</span>
                          <span className="font-semibold text-amber-800 dark:text-amber-300">
                            {p.formula}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Section 3: Key Claims Decoder */}
            {includeClaims && patent.claims?.length > 0 && (
              <div className="space-y-3 mb-5 text-sm sm:text-base">
                <h3
                  className={`text-xs uppercase font-sans font-bold tracking-widest border-b pb-1 ${
                    theme === "parchment"
                      ? "border-[#8a6845]/30 text-[#694e33]"
                      : theme === "blueprint"
                        ? "border-[#38bdf8]/30 text-[#7dd3fc]"
                        : "border-black text-black"
                  }`}
                >
                  III. The Granted Legal Monopoly (Key Claims)
                </h3>
                <div className="space-y-2.5">
                  {patent.claims.slice(0, 3).map((claim) => (
                    <div
                      key={claim.number}
                      className={`p-2.5 rounded-lg text-xs font-sans leading-relaxed border ${
                        theme === "parchment"
                          ? "bg-[#f5eedf] border-[#8a6845]/20"
                          : theme === "blueprint"
                            ? "bg-[#112742] border-[#38bdf8]/20"
                            : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold font-mono text-[11px] uppercase tracking-wider">
                          Claim {claim.number} ({claim.isIndependent ? "Independent" : "Dependent"})
                        </span>
                        {claim.keyInnovations?.length > 0 && (
                          <span className="text-[10px] font-mono opacity-80">
                            {claim.keyInnovations[0]}
                          </span>
                        )}
                      </div>
                      <p className="text-xs">{claim.plainEnglish}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 4: Mechanical Breakdown & Archaic Terms */}
            {includeInnovations &&
              patent.plainEnglishExplanation?.mechanicalBreakdown?.length > 0 && (
                <div className="space-y-3 mb-5 text-sm sm:text-base">
                  <h3
                    className={`text-xs uppercase font-sans font-bold tracking-widest border-b pb-1 ${
                      theme === "parchment"
                        ? "border-[#8a6845]/30 text-[#694e33]"
                        : theme === "blueprint"
                          ? "border-[#38bdf8]/30 text-[#7dd3fc]"
                          : "border-black text-black"
                    }`}
                  >
                    IV. Mechanical Organ Breakdown
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
                    {patent.plainEnglishExplanation.mechanicalBreakdown.slice(0, 4).map((m) => (
                      <div
                        key={m.title}
                        className={`p-2 rounded border ${
                          theme === "parchment"
                            ? "border-[#8a6845]/20 bg-[#f7f2e6]"
                            : theme === "blueprint"
                              ? "border-[#38bdf8]/20 bg-[#0f233b]"
                              : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <span className="font-bold block font-serif text-xs">{m.title}</span>
                        <span className="text-[10px] font-mono opacity-80 block mb-0.5">
                          Term: &ldquo;{m.archaicTerm}&rdquo; → {m.modernEquivalent}
                        </span>
                        <p className="text-[11px] leading-tight">{m.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Archival Broadside Colophon / Footer */}
            {includeCitation && (
              <div
                className={`pt-3 border-t-2 text-center text-[8pt] font-mono flex flex-wrap items-center justify-between gap-2 ${
                  theme === "parchment"
                    ? "border-[#8a6845]/50 text-[#694e33]"
                    : theme === "blueprint"
                      ? "border-[#38bdf8]/50 text-[#7dd3fc]"
                      : "border-black text-gray-700"
                }`}
              >
                <div>
                  CLASSIC PATENTS DIGITAL ARCHIVE &bull; PERMANENT EXHIBIT ID:{" "}
                  <strong>{patent.id}</strong>
                </div>
                <div>classic-patents.com/patents/{patent.id}</div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer / Actions */}
        <div className="p-4 sm:p-5 border-t border-parchment-200 dark:border-ink-800 bg-parchment-100/70 dark:bg-ink-900/60 flex flex-wrap items-center justify-between gap-3 font-mono text-sm">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="px-3.5 py-2 rounded-xl border border-parchment-300 dark:border-ink-700 bg-white dark:bg-ink-900 text-ink-800 dark:text-parchment-200 hover:text-amber-700 dark:hover:text-amber-400 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copied ? "Copied Broadside!" : "Copy Broadside Text"}</span>
            </button>
            <a
              href={patent.originalPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl border border-parchment-300 dark:border-ink-700 bg-white dark:bg-ink-900 text-ink-800 dark:text-parchment-200 hover:text-amber-700 dark:hover:text-amber-400 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Original USPTO PDF</span>
            </a>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800 transition-colors text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Broadside / Save PDF</span>
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
