"use client";

import { BookOpen, Check, Copy, Download, Search, X } from "lucide-react";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import type { Patent } from "@/types/patent";
import {
  downloadCitationFile,
  generateApaCitation,
  generateBibtexCitation,
  generateChicagoCitation,
  generateRisCitation,
} from "@/utils/patentCitations";

interface ArchaicGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  patent?: Patent;
}

interface GlossaryEntry {
  term: string;
  era: string;
  literalDefinition: string;
  modernEngineeringTranslation: string;
  historicalContext: string;
}

type GlossaryTab = "glossary" | "citation";
type CitationFormat = "bibtex" | "ris" | "chicago" | "apa";

interface CitationTextSet {
  bibtex: string;
  ris: string;
  chicago: string;
  apa: string;
}

const CITATION_FORMATS: readonly {
  readonly id: CitationFormat;
  readonly label: string;
  readonly description: string;
  readonly filenameSuffix: string;
  readonly mimeType: string;
  readonly machineReadable: boolean;
}[] = [
  {
    id: "bibtex",
    label: "BibTeX",
    description: "BibTeX format for LaTeX, Overleaf, and BibDesk.",
    filenameSuffix: ".bib",
    mimeType: "application/x-bibtex;charset=utf-8",
    machineReadable: true,
  },
  {
    id: "ris",
    label: "RIS",
    description: "RIS format for Zotero, Mendeley, EndNote, Citavi, and RefWorks.",
    filenameSuffix: ".ris",
    mimeType: "application/x-research-info-systems;charset=utf-8",
    machineReadable: true,
  },
  {
    id: "chicago",
    label: "Chicago",
    description: "Chicago Manual of Style (Notes & Bibliography) patent citation.",
    filenameSuffix: "-chicago.txt",
    mimeType: "text/plain;charset=utf-8",
    machineReadable: false,
  },
  {
    id: "apa",
    label: "APA (7th)",
    description: "American Psychological Association (APA 7th Edition) format.",
    filenameSuffix: "-apa.txt",
    mimeType: "text/plain;charset=utf-8",
    machineReadable: false,
  },
];

const QUICK_ACCESS_CITATION_FORMATS = [
  { format: "bibtex", label: "BibTeX (.bib)" },
  { format: "ris", label: "RIS (.ris - Zotero)" },
  { format: "chicago", label: "Chicago Manual of Style" },
  { format: "apa", label: "APA 7th Edition" },
] as const;

const GLOSSARY_TERMS: readonly GlossaryEntry[] = [
  {
    term: "Letters Patent",
    era: "14th–20th Century",
    literalDefinition:
      "Open public letters from a monarch or government (literae patentes) granting monopoly rights.",
    modernEngineeringTranslation: "Issued USPTO utility or design patent publication.",
    historicalContext: "Contrasted with 'letters close' (private sealed royal correspondence).",
  },
  {
    term: "In testimony whereof",
    era: "19th Century",
    literalDefinition:
      "Formal concluding legal formula affirming under oath the execution of the instrument.",
    modernEngineeringTranslation: "Inventor and witness digital/physical signatures.",
    historicalContext: "Required two witness attestations in 19th-century USPTO filing procedure.",
  },
  {
    term: "Aeroplane",
    era: "Early 20th Century (Wright era)",
    literalDefinition:
      "A flat or cambered lifting aerofoil surface supported dynamically by air pressure.",
    modernEngineeringTranslation:
      "Wing / Airfoil lifting surface (later evolved to mean the entire motorized aircraft).",
    historicalContext:
      "The Wrights used 'aeroplane' to denote the individual fabric-covered wings.",
  },
  {
    term: "Undulating Current",
    era: "19th Century (Bell era)",
    literalDefinition:
      "An electric current whose magnitude varies continuously and periodically without interruption.",
    modernEngineeringTranslation: "Continuous analog AC or audio-frequency electrical waveform.",
    historicalContext:
      "Bell's central legal weapon against telegraph companies who relied on pulsed DC make-and-break circuits.",
  },
  {
    term: "Subdivision of the Electric Light",
    era: "1870s–1880s (Edison era)",
    literalDefinition:
      "The problem of operating numerous small domestic lamps off a single electrical generator.",
    modernEngineeringTranslation:
      "Parallel circuit wiring of high-resistance incandescent electrical loads.",
    historicalContext:
      "Pundits claimed it was physically impossible until Edison increased filament resistance to 100 ohms.",
  },
  {
    term: "Optically Anisotropic Solution",
    era: "1960s (Kwolek era)",
    literalDefinition:
      "A liquid solution that exhibits direction-dependent refractive indices due to molecular alignment.",
    modernEngineeringTranslation: "Liquid crystalline nematic phase polymer dope.",
    historicalContext:
      "Technicians initially tried to throw out Kwolek's cloudy solution thinking it was contaminated.",
  },
  {
    term: "Unitary Body of Semiconductor Material",
    era: "1950s–1960s (Noyce era)",
    literalDefinition: "A single continuous crystal structure of silicon or germanium.",
    modernEngineeringTranslation:
      "Monolithic single-crystal silicon die / integrated circuit wafer.",
    historicalContext:
      "Differentiated Noyce's monolithic planar circuit from Jack Kilby's hybrid flying-wire prototype.",
  },
  {
    term: "Peculiar and Novel Construction",
    era: "19th Century",
    literalDefinition: "A distinctive, patentable structural arrangement not found in prior art.",
    modernEngineeringTranslation:
      "Novel and non-obvious mechanical embodiment under 35 U.S.C. § 103.",
    historicalContext: "Standard 19th-century legal terminology establishing novelty.",
  },
];

function citationTextsFor(patent: Patent): CitationTextSet {
  return {
    bibtex: generateBibtexCitation(patent),
    ris: generateRisCitation(patent),
    chicago: generateChicagoCitation(patent),
    apa: generateApaCitation(patent),
  };
}

function findCitationFormat(format: CitationFormat) {
  const definition = CITATION_FORMATS.find((candidate) => candidate.id === format);
  if (!definition) throw new Error(`Unsupported citation format: ${format}`);
  return definition;
}

function filteredGlossaryFor(searchTerm: string) {
  const normalizedSearch = searchTerm.toLowerCase();
  return GLOSSARY_TERMS.filter(
    (entry) =>
      entry.term.toLowerCase().includes(normalizedSearch) ||
      entry.modernEngineeringTranslation.toLowerCase().includes(normalizedSearch),
  );
}

function GlossaryModalHeader({ onClose }: Pick<ArchaicGlossaryModalProps, "onClose">) {
  return (
    <div className="p-4 sm:p-5 border-b border-parchment-200 dark:border-ink-800 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-amber-700 dark:text-amber-500" />
        <h3
          id="glossary-modal-title"
          className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100"
        >
          Archaic Legal Glossary &amp; Citations
        </h3>
      </div>
      <button
        aria-label="Close"
        type="button"
        onClick={onClose}
        className="p-1.5 min-h-11 min-w-11 flex items-center justify-center rounded-lg text-ink-500 hover:text-ink-800 dark:hover:text-ink-200 hover:bg-parchment-200 dark:hover:bg-ink-800 transition-colors cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

function GlossaryTabs({
  activeTab,
  patent,
  onSelectTab,
}: {
  readonly activeTab: GlossaryTab;
  readonly patent?: Patent;
  readonly onSelectTab: (tab: GlossaryTab) => void;
}) {
  const handleNavigation = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const next = activeTab === "glossary" ? "citation" : "glossary";
    if (next === "citation" && !patent) return;
    onSelectTab(next);
    document.getElementById(`glossary-tab-${next}`)?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Glossary sections"
      onKeyDown={handleNavigation}
      className="flex items-center gap-2 px-5 pt-3 border-b border-parchment-200 dark:border-ink-800 text-xs font-mono"
    >
      <button
        type="button"
        role="tab"
        id="glossary-tab-glossary"
        aria-selected={activeTab === "glossary"}
        aria-controls="glossary-panel-glossary"
        onClick={() => onSelectTab("glossary")}
        className={`pb-2 border-b-2 font-bold transition-colors cursor-pointer ${
          activeTab === "glossary"
            ? "border-amber-600 text-amber-700 dark:text-amber-400"
            : "border-transparent text-ink-500 hover:text-ink-800"
        }`}
      >
        Historical Patent Glossary
      </button>
      {patent && (
        <button
          type="button"
          role="tab"
          id="glossary-tab-citation"
          aria-selected={activeTab === "citation"}
          aria-controls="glossary-panel-citation"
          onClick={() => onSelectTab("citation")}
          className={`pb-2 border-b-2 font-bold transition-colors cursor-pointer ${
            activeTab === "citation"
              ? "border-amber-600 text-amber-700 dark:text-amber-400"
              : "border-transparent text-ink-500 hover:text-ink-800"
          }`}
        >
          Academic Citation (BibTeX / APA)
        </button>
      )}
    </div>
  );
}

function GlossaryPanel({
  searchTerm,
  onSearchTermChange,
}: {
  readonly searchTerm: string;
  readonly onSearchTermChange: (value: string) => void;
}) {
  const glossaryEntries = filteredGlossaryFor(searchTerm);
  return (
    <div
      id="glossary-panel-glossary"
      role="tabpanel"
      aria-labelledby="glossary-tab-glossary"
      className="space-y-4"
    >
      <div className="relative">
        <label htmlFor="archaic-glossary-search" className="sr-only">
          Search archaic legal terms or modern engineering equivalents
        </label>
        <Search className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          id="archaic-glossary-search"
          type="search"
          placeholder="e.g. means, said, Letters Patent"
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-parchment-100 dark:bg-ink-900 border border-parchment-300 dark:border-ink-700 rounded-lg text-base font-mono text-ink-900 dark:text-parchment-100 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-amber-600"
        />
      </div>
      <div className="space-y-3">
        {glossaryEntries.map((entry) => (
          <div
            key={entry.term}
            className="p-4 rounded-xl bg-parchment-100/60 dark:bg-ink-900/60 border border-parchment-200 dark:border-ink-800 space-y-2 text-xs"
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-serif font-bold text-sm text-ink-900 dark:text-parchment-100">
                &ldquo;{entry.term}&rdquo;
              </span>
              <span className="font-mono text-[10px] text-ink-500">{entry.era}</span>
            </div>
            <div>
              <span className="font-mono text-[11px] text-ink-500 block">19th-C Meaning:</span>
              <p className="text-ink-700 dark:text-ink-300 italic">{entry.literalDefinition}</p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 font-sans">
              <span className="font-mono text-[10px] font-bold block text-emerald-700 dark:text-emerald-400 uppercase">
                Modern Engineering Decoded:
              </span>
              {entry.modernEngineeringTranslation}
            </div>
            <div className="text-[11px] text-ink-500 font-mono">
              Historical note: {entry.historicalContext}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CitationPanel({
  citationFormat,
  citations,
  copiedFormat,
  onCitationFormatChange,
  onCopy,
  onDownload,
}: {
  readonly citationFormat: CitationFormat;
  readonly citations: CitationTextSet;
  readonly copiedFormat: string | null;
  readonly onCitationFormatChange: (format: CitationFormat) => void;
  readonly onCopy: (text: string, formatKey: string) => void;
  readonly onDownload: () => void;
}) {
  const activeFormat = findCitationFormat(citationFormat);
  const activeCitationText = citations[citationFormat];

  return (
    <div
      id="glossary-panel-citation"
      role="tabpanel"
      aria-labelledby="glossary-tab-citation"
      className="space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-parchment-200 dark:border-ink-800">
        <div className="flex flex-wrap items-center gap-1.5">
          {CITATION_FORMATS.map((format) => (
            <button
              key={format.id}
              type="button"
              onClick={() => onCitationFormatChange(format.id)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                citationFormat === format.id
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-parchment-200/80 dark:bg-ink-800 text-ink-700 dark:text-parchment-300 hover:bg-parchment-300 dark:hover:bg-ink-700"
              }`}
            >
              {format.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onCopy(activeCitationText, citationFormat)}
            className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            {copiedFormat === citationFormat ? (
              <Check className="w-3.5 h-3.5 text-emerald-300" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>
              {copiedFormat === citationFormat
                ? `Copied ${citationFormat.toUpperCase()}!`
                : `Copy ${citationFormat.toUpperCase()}`}
            </span>
          </button>
          <button
            type="button"
            onClick={onDownload}
            className="px-3 py-1.5 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-parchment-300 dark:border-ink-700"
            title={`Download ${citationFormat.toUpperCase()} file`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>
      <div className="text-[11px] font-mono text-ink-500 dark:text-ink-400">
        {activeFormat.description}
      </div>
      {activeFormat.machineReadable ? (
        <div className="p-4 rounded-xl bg-ink-950 text-amber-300 font-mono text-xs overflow-x-auto whitespace-pre border border-ink-800 leading-relaxed select-all">
          {activeCitationText}
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 text-xs leading-relaxed select-all">
          <p className="text-ink-800 dark:text-parchment-200 font-serif text-sm italic">
            {activeCitationText}
          </p>
        </div>
      )}
      <div className="pt-2 border-t border-parchment-200 dark:border-ink-800">
        <span className="text-xs font-mono font-semibold text-ink-500 block mb-2">
          Quick Access Formats
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {QUICK_ACCESS_CITATION_FORMATS.map(({ format, label }) => {
            const copyKey = `quick-${format}`;
            const wasCopied = copiedFormat === copyKey;
            return (
              <div
                key={format}
                className="p-2.5 rounded-lg bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 flex items-center justify-between"
              >
                <span className="font-mono text-ink-700 dark:text-parchment-300 font-medium">
                  {label}
                </span>
                <button
                  type="button"
                  onClick={() => onCopy(citations[format], copyKey)}
                  className="text-xs font-mono text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {wasCopied ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{wasCopied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ArchaicGlossaryModal({ isOpen, onClose, patent }: ArchaicGlossaryModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<GlossaryTab>("glossary");
  const [citationFormat, setCitationFormat] = useState<CitationFormat>("bibtex");
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const closeOnBackdropClick = (event: MouseEvent) => {
      // Native <dialog> backdrop clicks target the dialog itself.
      if (event.target === dialog) onClose();
    };
    dialog.addEventListener("click", closeOnBackdropClick);
    return () => dialog.removeEventListener("click", closeOnBackdropClick);
  }, [onClose]);

  const citations = patent
    ? citationTextsFor(patent)
    : ({ bibtex: "", ris: "", chicago: "", apa: "" } satisfies CitationTextSet);

  const handleCopyCitation = (text: string, formatKey: string) => {
    if (typeof window !== "undefined" && text && navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopiedFormat(formatKey);
          setTimeout(() => setCopiedFormat(null), 2000);
        })
        .catch(() => {});
    }
  };

  const handleDownloadCitation = () => {
    if (!patent) return;
    const definition = findCitationFormat(citationFormat);
    downloadCitationFile(
      `${patent.id}${definition.filenameSuffix}`,
      citations[citationFormat],
      definition.mimeType,
    );
  };

  return (
    <dialog
      ref={dialogRef}
      aria-modal="true"
      aria-labelledby="glossary-modal-title"
      className="fixed inset-0 z-50 m-auto w-[min(42rem,calc(100vw-2rem))] max-h-[85dvh] p-0 bg-transparent border-none open:flex open:items-center open:justify-center backdrop:bg-ink-950/80 backdrop:backdrop-blur-sm"
      onClose={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div className="w-full max-w-2xl bg-parchment-50 dark:bg-ink-950 rounded-2xl border border-parchment-300 dark:border-ink-800 shadow-2xl overflow-hidden flex flex-col max-h-[85dvh] relative">
        <GlossaryModalHeader onClose={onClose} />
        <GlossaryTabs activeTab={activeTab} patent={patent} onSelectTab={setActiveTab} />

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto overscroll-contain space-y-4 flex-1">
          {activeTab === "glossary" && (
            <GlossaryPanel searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
          )}

          {activeTab === "citation" && patent && (
            <CitationPanel
              citationFormat={citationFormat}
              citations={citations}
              copiedFormat={copiedFormat}
              onCitationFormatChange={setCitationFormat}
              onCopy={handleCopyCitation}
              onDownload={handleDownloadCitation}
            />
          )}
        </div>
      </div>
    </dialog>
  );
}
