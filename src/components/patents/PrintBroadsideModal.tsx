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

interface BroadsideSections {
  readonly includePreamble: boolean;
  readonly includeMechanism: boolean;
  readonly includeClaims: boolean;
  readonly includeInnovations: boolean;
  readonly includeCitation: boolean;
}

const PAPER_FORMATS: readonly { readonly id: BroadsidePaperFormat; readonly label: string }[] = [
  { id: "letter", label: "Letter (8.5×11″)" },
  { id: "a4", label: "A4 (210×297mm)" },
  { id: "tabloid", label: "Tabloid (11×17″)" },
];

const BROADSIDE_THEMES: readonly { readonly id: BroadsideTheme; readonly label: string }[] = [
  { id: "parchment", label: "Parchment" },
  { id: "blueprint", label: "Blueprint" },
  { id: "monochrome", label: "Monochrome" },
];

const BROADSIDE_SECTION_TOGGLES: readonly {
  readonly id: keyof BroadsideSections;
  readonly label: string;
}[] = [
  { id: "includePreamble", label: "Preamble" },
  { id: "includeMechanism", label: "Mechanism" },
  { id: "includeClaims", label: "Claims" },
  { id: "includeInnovations", label: "Innovations" },
  { id: "includeCitation", label: "Citation" },
];

function printBroadside() {
  if (typeof window !== "undefined") window.print();
}

function broadsideText(patent: Patent, sectionsToInclude: BroadsideSections) {
  const sections = [
    "========================================================================",
    "THE UNITED STATES PATENT ARCHIVE — HISTORICAL SPECIFICATION BROADSIDE",
    "Curated & Published by Classic Patents (https://classic-patents.com)",
    "========================================================================",
    "",
    `PATENT: ${patent.patentNumber} — ${patent.title.toUpperCase()}`,
    `SHORT TITLE: ${patent.shortTitle}`,
    `SUBTITLE: ${patent.subtitle}`,
    `INVENTORS: ${patent.inventors.join(", ")}`,
    `LOCATION: ${patent.inventorLocation}`,
    `CLASSIFICATION: ${patent.usptoClassification}`,
    `GRANT DATE: ${formatPatentDate(patent.grantDate)}`,
    `FILING DATE: ${patent.filingDate ? formatPatentDate(patent.filingDate) : "Not recorded"}`,
    `ERA: ${patent.era} (${patent.categoryLabel})`,
    "",
  ];

  if (sectionsToInclude.includePreamble) {
    sections.push(
      "------------------------------------------------------------------------",
      "HISTORICAL SUMMARY & EXCERPT",
      "------------------------------------------------------------------------",
      patent.summary,
      "",
    );
  }
  if (sectionsToInclude.includeMechanism && patent.plainEnglishExplanation) {
    const explanation = patent.plainEnglishExplanation;
    sections.push(
      "------------------------------------------------------------------------",
      "CORE MECHANISM & SCIENTIFIC PRINCIPLES",
      "------------------------------------------------------------------------",
      explanation.overview,
      "",
      explanation.coreMechanism,
      "",
    );
    if (explanation.scientificPrinciples?.length) {
      sections.push("GOVERNING PRINCIPLES:");
      for (const principle of explanation.scientificPrinciples) {
        sections.push(`• ${principle.principle}: ${principle.formula} — ${principle.explanation}`);
      }
      sections.push("");
    }
  }
  if (sectionsToInclude.includeClaims && patent.claims?.length) {
    sections.push(
      "------------------------------------------------------------------------",
      "KEY PATENT CLAIMS & LEGAL SIGNIFICANCE",
      "------------------------------------------------------------------------",
    );
    for (const claim of patent.claims.slice(0, 5)) {
      sections.push(
        `[Claim ${claim.number} (${claim.isIndependent ? "INDEPENDENT" : "DEPENDENT"})]`,
        claim.plainEnglish,
        claim.legalSignificance ? `Legal Significance: ${claim.legalSignificance}` : "",
        "",
      );
    }
  }
  if (
    sectionsToInclude.includeInnovations &&
    patent.plainEnglishExplanation?.mechanicalBreakdown?.length
  ) {
    sections.push(
      "------------------------------------------------------------------------",
      "MECHANICAL BREAKDOWN & ARCHAIC-TO-MODERN CONVERSIONS",
      "------------------------------------------------------------------------",
    );
    for (const mechanism of patent.plainEnglishExplanation.mechanicalBreakdown) {
      sections.push(
        `• ${mechanism.title.toUpperCase()}: ${mechanism.summary}`,
        `  Archaic Term: "${mechanism.archaicTerm}" -> Modern: "${mechanism.modernEquivalent}"`,
        "",
      );
    }
  }
  if (sectionsToInclude.includeCitation) {
    sections.push(
      "------------------------------------------------------------------------",
      "ARCHIVAL CITATION & PERSISTENT IDENTIFIER",
      "------------------------------------------------------------------------",
      `Persistent URL: https://classic-patents.com/patents/${patent.id}`,
      `Original USPTO Facsimile: https://classic-patents.com${patent.originalPdfUrl}`,
      "Retrieved from Classic Patents Digital Museum.",
    );
  }
  return sections.join("\n");
}

function BroadsideHeader({ onClose }: Pick<PrintBroadsideModalProps, "onClose">) {
  return (
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
  );
}

function BroadsideToolbar({
  paperFormat,
  theme,
  sections,
  onPaperFormatChange,
  onThemeChange,
  onSectionChange,
}: {
  readonly paperFormat: BroadsidePaperFormat;
  readonly theme: BroadsideTheme;
  readonly sections: BroadsideSections;
  readonly onPaperFormatChange: (format: BroadsidePaperFormat) => void;
  readonly onThemeChange: (theme: BroadsideTheme) => void;
  readonly onSectionChange: (section: keyof BroadsideSections, included: boolean) => void;
}) {
  return (
    <div className="px-4 py-3 border-b border-parchment-200 dark:border-ink-800 bg-parchment-100/40 dark:bg-ink-900/40 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-ink-500 uppercase tracking-wider text-[10px] font-bold">
            Paper:
          </span>
          <div className="inline-flex rounded-lg border border-parchment-300 dark:border-ink-700 bg-white dark:bg-ink-900 p-0.5">
            {PAPER_FORMATS.map((format) => (
              <button
                key={format.id}
                type="button"
                onClick={() => onPaperFormatChange(format.id)}
                className={`px-2 py-1 rounded-md transition-colors ${
                  paperFormat === format.id
                    ? "bg-amber-700 text-white font-bold shadow-2xs"
                    : "text-ink-700 dark:text-ink-300 hover:text-amber-700 dark:hover:text-amber-400"
                }`}
              >
                {format.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-ink-500 uppercase tracking-wider text-[10px] font-bold">
            Theme:
          </span>
          <div className="inline-flex rounded-lg border border-parchment-300 dark:border-ink-700 bg-white dark:bg-ink-900 p-0.5">
            {BROADSIDE_THEMES.map((themeOption) => (
              <button
                key={themeOption.id}
                type="button"
                onClick={() => onThemeChange(themeOption.id)}
                className={`px-2 py-1 rounded-md transition-colors ${
                  theme === themeOption.id
                    ? "bg-amber-700 text-white font-bold shadow-2xs"
                    : "text-ink-700 dark:text-ink-300 hover:text-amber-700 dark:hover:text-amber-400"
                }`}
              >
                {themeOption.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {BROADSIDE_SECTION_TOGGLES.map((toggle) => (
          <label
            key={toggle.id}
            className="flex items-center gap-1 cursor-pointer text-ink-700 dark:text-ink-300"
          >
            <input
              type="checkbox"
              checked={sections[toggle.id]}
              onChange={(event) => onSectionChange(toggle.id, event.target.checked)}
              className="rounded border-parchment-300 text-amber-700 focus:ring-amber-500"
            />
            <span>{toggle.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function broadsideThemeClasses(theme: BroadsideTheme) {
  if (theme === "parchment") {
    return {
      sheet: "bg-[#faf6ee] text-[#241c15] border-4 border-double border-[#8a6845]/40",
      border: "border-[#8a6845]/30 text-[#423120]",
      heading: "border-[#8a6845]/30 text-[#694e33]",
      inset: "bg-[#f2ebd9] border border-[#8a6845]/20 text-[#3d2b1a]",
      card: "bg-[#f5eedf] border-[#8a6845]/20",
      minorCard: "border-[#8a6845]/20 bg-[#f7f2e6]",
      accent: "text-amber-900",
      subtitle: "text-[#59432e]",
      masthead: "border-[#8a6845]/50 text-[#694e33]",
    };
  }
  if (theme === "blueprint") {
    return {
      sheet:
        "bg-[#0b1d33] text-[#d6e5ff] border-4 border-double border-[#38bdf8]/40 blueprint-grid",
      border: "border-[#38bdf8]/30 text-[#c7d2fe]",
      heading: "border-[#38bdf8]/30 text-[#7dd3fc]",
      inset: "bg-[#132c4a] border border-[#38bdf8]/30 text-[#e0f2fe]",
      card: "bg-[#112742] border-[#38bdf8]/20",
      minorCard: "border-[#38bdf8]/20 bg-[#0f233b]",
      accent: "text-cyan-300",
      subtitle: "text-[#bae6fd]",
      masthead: "border-[#38bdf8]/50 text-[#7dd3fc]",
    };
  }
  return {
    sheet: "bg-white text-black border-4 border-double border-black",
    border: "border-gray-300 text-gray-800",
    heading: "border-black text-black",
    inset: "bg-gray-100 border border-gray-300 text-gray-900",
    card: "bg-gray-50 border-gray-200",
    minorCard: "border-gray-200 bg-gray-50",
    accent: "text-black",
    subtitle: "text-gray-700",
    masthead: "border-black text-gray-700",
  };
}

function BroadsidePreview({
  patent,
  theme,
  sections,
}: {
  readonly patent: Patent;
  readonly theme: BroadsideTheme;
  readonly sections: BroadsideSections;
}) {
  const classes = broadsideThemeClasses(theme);
  const explanation = patent.plainEnglishExplanation;
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-parchment-200/50 dark:bg-ink-900/50 flex justify-center">
      <div
        id="archival-broadside-sheet"
        className={`w-full max-w-3xl rounded-xl transition-all shadow-md p-6 sm:p-8 font-serif leading-relaxed ${classes.sheet}`}
      >
        <div className={`text-center pb-4 mb-5 border-b-2 ${classes.masthead}`}>
          <div className="text-[9pt] sm:text-[10pt] tracking-[0.3em] uppercase font-bold">
            The United States Patent &amp; Trademark Archive
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wide uppercase mt-1">
            Historical Specification &amp; Engineering Broadside
          </h1>
          <div className="text-[9pt] italic mt-1 font-sans">
            Curated, Verified &amp; Restored by Classic Patents (classic-patents.com)
          </div>
        </div>
        <div
          className={`flex flex-wrap items-baseline justify-between gap-3 pb-3 mb-4 border-b border-dashed ${classes.border}`}
        >
          <div>
            <span className="font-bold text-lg sm:text-xl block tracking-tight">
              {patent.title.toUpperCase()}
            </span>
            <span className={`text-xs sm:text-sm italic block mt-0.5 ${classes.subtitle}`}>
              {patent.subtitle}
            </span>
          </div>
          <div className="text-right font-mono">
            <span className={`font-bold text-lg sm:text-xl block ${classes.accent}`}>
              {patent.patentNumber}
            </span>
            <span className="text-xs block">Class: {patent.usptoClassification}</span>
          </div>
        </div>
        <div
          className={`grid grid-cols-1 sm:grid-cols-3 gap-3 text-[9pt] font-sans pb-3 mb-5 border-b ${classes.border}`}
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
        {sections.includePreamble && (
          <div className="space-y-2 mb-5 text-sm sm:text-base">
            <h3
              className={`text-xs uppercase font-sans font-bold tracking-widest border-b pb-1 ${classes.heading}`}
            >
              I. Historical Context &amp; Grant Summary
            </h3>
            <div className="leading-relaxed">
              <TextWithLatex text={patent.summary} />
            </div>
          </div>
        )}
        {sections.includeMechanism && explanation && (
          <div className="space-y-3 mb-5 text-sm sm:text-base">
            <h3
              className={`text-xs uppercase font-sans font-bold tracking-widest border-b pb-1 ${classes.heading}`}
            >
              II. Core Mechanism &amp; Scientific Principles
            </h3>
            <p className="leading-relaxed text-xs sm:text-sm">{explanation.overview}</p>
            <div
              className={`p-3 rounded-lg text-xs sm:text-sm font-sans leading-relaxed ${classes.inset}`}
            >
              <strong className="block font-serif text-sm mb-1">Physical Operation:</strong>
              {explanation.coreMechanism}
            </div>
            {explanation.scientificPrinciples?.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-bold font-sans uppercase tracking-wider block opacity-80">
                  Governing Formulation:
                </span>
                {explanation.scientificPrinciples.slice(0, 3).map((principle) => (
                  <div
                    key={principle.principle}
                    className="flex flex-wrap items-baseline justify-between gap-2 text-xs font-mono border-b border-dotted pb-1 border-current/20"
                  >
                    <span className="font-bold">{principle.principle}:</span>
                    <span className="font-semibold text-amber-800 dark:text-amber-300">
                      {principle.formula}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {sections.includeClaims && patent.claims?.length > 0 && (
          <div className="space-y-3 mb-5 text-sm sm:text-base">
            <h3
              className={`text-xs uppercase font-sans font-bold tracking-widest border-b pb-1 ${classes.heading}`}
            >
              III. The Granted Legal Monopoly (Key Claims)
            </h3>
            <div className="space-y-2.5">
              {patent.claims.slice(0, 3).map((claim) => (
                <div
                  key={claim.number}
                  className={`p-2.5 rounded-lg text-xs font-sans leading-relaxed border ${classes.card}`}
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
        {sections.includeInnovations && explanation?.mechanicalBreakdown?.length > 0 && (
          <div className="space-y-3 mb-5 text-sm sm:text-base">
            <h3
              className={`text-xs uppercase font-sans font-bold tracking-widest border-b pb-1 ${classes.heading}`}
            >
              IV. Mechanical Organ Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
              {explanation.mechanicalBreakdown.slice(0, 4).map((mechanism) => (
                <div key={mechanism.title} className={`p-2 rounded border ${classes.minorCard}`}>
                  <span className="font-bold block font-serif text-xs">{mechanism.title}</span>
                  <span className="text-[10px] font-mono opacity-80 block mb-0.5">
                    Term: &ldquo;{mechanism.archaicTerm}&rdquo; → {mechanism.modernEquivalent}
                  </span>
                  <p className="text-[11px] leading-tight">{mechanism.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {sections.includeCitation && (
          <div
            className={`pt-3 border-t-2 text-center text-[8pt] font-mono flex flex-wrap items-center justify-between gap-2 ${classes.masthead}`}
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
  );
}

function BroadsideActions({
  copied,
  patent,
  onCopy,
  onClose,
}: {
  readonly copied: boolean;
  readonly patent: Patent;
  readonly onCopy: () => void;
  readonly onClose: () => void;
}) {
  return (
    <div className="p-4 sm:p-5 border-t border-parchment-200 dark:border-ink-800 bg-parchment-100/70 dark:bg-ink-900/60 flex flex-wrap items-center justify-between gap-3 font-mono text-sm">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onCopy}
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
          onClick={printBroadside}
          className="px-5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Broadside / Save PDF</span>
        </button>
      </div>
    </div>
  );
}

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

  const handleCopyText = () => {
    if (typeof window === "undefined" || !navigator.clipboard?.writeText) return;
    const sections: BroadsideSections = {
      includePreamble,
      includeMechanism,
      includeClaims,
      includeInnovations,
      includeCitation,
    };

    navigator.clipboard
      .writeText(broadsideText(patent, sections))
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
        <BroadsideHeader onClose={onClose} />
        <BroadsideToolbar
          paperFormat={paperFormat}
          theme={theme}
          sections={{
            includePreamble,
            includeMechanism,
            includeClaims,
            includeInnovations,
            includeCitation,
          }}
          onPaperFormatChange={setPaperFormat}
          onThemeChange={setTheme}
          onSectionChange={(section, included) => {
            const setters = {
              includePreamble: setIncludePreamble,
              includeMechanism: setIncludeMechanism,
              includeClaims: setIncludeClaims,
              includeInnovations: setIncludeInnovations,
              includeCitation: setIncludeCitation,
            };
            setters[section](included);
          }}
        />

        <BroadsidePreview
          patent={patent}
          theme={theme}
          sections={{
            includePreamble,
            includeMechanism,
            includeClaims,
            includeInnovations,
            includeCitation,
          }}
        />

        <BroadsideActions
          copied={copied}
          patent={patent}
          onCopy={handleCopyText}
          onClose={onClose}
        />
      </div>
    </dialog>
  );
}
