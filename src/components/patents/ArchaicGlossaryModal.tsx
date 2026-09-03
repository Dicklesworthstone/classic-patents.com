"use client";

import { BookOpen, Check, Copy, Download, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

const GLOSSARY_TERMS: GlossaryEntry[] = [
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

export function ArchaicGlossaryModal({ isOpen, onClose, patent }: ArchaicGlossaryModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"glossary" | "citation">("glossary");
  const [citationFormat, setCitationFormat] = useState<"bibtex" | "ris" | "chicago" | "apa">(
    "bibtex",
  );
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

  const filteredGlossary = GLOSSARY_TERMS.filter(
    (g) =>
      g.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.modernEngineeringTranslation.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const bibtexCitation = patent ? generateBibtexCitation(patent) : "";
  const risCitation = patent ? generateRisCitation(patent) : "";
  const chicagoCitation = patent ? generateChicagoCitation(patent) : "";
  const apaCitation = patent ? generateApaCitation(patent) : "";

  const activeCitationText =
    citationFormat === "bibtex"
      ? bibtexCitation
      : citationFormat === "ris"
        ? risCitation
        : citationFormat === "chicago"
          ? chicagoCitation
          : apaCitation;

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
    if (citationFormat === "bibtex") {
      downloadCitationFile(
        `${patent.id}.bib`,
        bibtexCitation,
        "application/x-bibtex;charset=utf-8",
      );
    } else if (citationFormat === "ris") {
      downloadCitationFile(
        `${patent.id}.ris`,
        risCitation,
        "application/x-research-info-systems;charset=utf-8",
      );
    } else if (citationFormat === "chicago") {
      downloadCitationFile(`${patent.id}-chicago.txt`, chicagoCitation, "text/plain;charset=utf-8");
    } else {
      downloadCitationFile(`${patent.id}-apa.txt`, apaCitation, "text/plain;charset=utf-8");
    }
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
        {/* Modal Header */}
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

        {/* Tab switch */}
        <div
          role="tablist"
          aria-label="Glossary sections"
          onKeyDown={(e) => {
            if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
            e.preventDefault();
            const next = activeTab === "glossary" ? "citation" : "glossary";
            if (next === "citation" && !patent) return;
            setActiveTab(next);
            document.getElementById(`glossary-tab-${next}`)?.focus();
          }}
          className="flex items-center gap-2 px-5 pt-3 border-b border-parchment-200 dark:border-ink-800 text-xs font-mono"
        >
          <button
            type="button"
            role="tab"
            id="glossary-tab-glossary"
            aria-selected={activeTab === "glossary"}
            aria-controls="glossary-panel-glossary"
            onClick={() => setActiveTab("glossary")}
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
              onClick={() => setActiveTab("citation")}
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

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto overscroll-contain space-y-4 flex-1">
          {activeTab === "glossary" && (
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-parchment-100 dark:bg-ink-900 border border-parchment-300 dark:border-ink-700 rounded-lg text-base font-mono text-ink-900 dark:text-parchment-100 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-amber-600"
                />
              </div>

              <div className="space-y-3">
                {filteredGlossary.map((g) => (
                  <div
                    key={g.term}
                    className="p-4 rounded-xl bg-parchment-100/60 dark:bg-ink-900/60 border border-parchment-200 dark:border-ink-800 space-y-2 text-xs"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-serif font-bold text-sm text-ink-900 dark:text-parchment-100">
                        &ldquo;{g.term}&rdquo;
                      </span>
                      <span className="font-mono text-[10px] text-ink-500">{g.era}</span>
                    </div>

                    <div>
                      <span className="font-mono text-[11px] text-ink-500 block">
                        19th-C Meaning:
                      </span>
                      <p className="text-ink-700 dark:text-ink-300 italic">{g.literalDefinition}</p>
                    </div>

                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 font-sans">
                      <span className="font-mono text-[10px] font-bold block text-emerald-700 dark:text-emerald-400 uppercase">
                        Modern Engineering Decoded:
                      </span>
                      {g.modernEngineeringTranslation}
                    </div>

                    <div className="text-[11px] text-ink-500 font-mono">
                      Historical note: {g.historicalContext}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "citation" && patent && (
            <div
              id="glossary-panel-citation"
              role="tabpanel"
              aria-labelledby="glossary-tab-citation"
              className="space-y-4"
            >
              {/* Citation Format Selector */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-parchment-200 dark:border-ink-800">
                <div className="flex flex-wrap items-center gap-1.5">
                  {(
                    [
                      { id: "bibtex", label: "BibTeX", ext: ".bib" },
                      { id: "ris", label: "RIS", ext: ".ris" },
                      { id: "chicago", label: "Chicago", ext: ".txt" },
                      { id: "apa", label: "APA (7th)", ext: ".txt" },
                    ] as const
                  ).map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => setCitationFormat(fmt.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                        citationFormat === fmt.id
                          ? "bg-amber-600 text-white shadow-xs"
                          : "bg-parchment-200/80 dark:bg-ink-800 text-ink-700 dark:text-parchment-300 hover:bg-parchment-300 dark:hover:bg-ink-700"
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyCitation(activeCitationText, citationFormat)}
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
                    onClick={handleDownloadCitation}
                    className="px-3 py-1.5 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-parchment-300 dark:border-ink-700"
                    title={`Download ${citationFormat.toUpperCase()} file`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Format Description Banner */}
              <div className="text-[11px] font-mono text-ink-500 dark:text-ink-400">
                {citationFormat === "bibtex" && "BibTeX format for LaTeX, Overleaf, and BibDesk."}
                {citationFormat === "ris" &&
                  "RIS format for Zotero, Mendeley, EndNote, Citavi, and RefWorks."}
                {citationFormat === "chicago" &&
                  "Chicago Manual of Style (Notes & Bibliography) patent citation."}
                {citationFormat === "apa" &&
                  "American Psychological Association (APA 7th Edition) format."}
              </div>

              {/* Citation Content Box */}
              {citationFormat === "bibtex" || citationFormat === "ris" ? (
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

              {/* All Formats Quick Copy Grid */}
              <div className="pt-2 border-t border-parchment-200 dark:border-ink-800">
                <span className="text-xs font-mono font-semibold text-ink-500 block mb-2">
                  Quick Access Formats
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 flex items-center justify-between">
                    <span className="font-mono text-ink-700 dark:text-parchment-300 font-medium">
                      BibTeX (.bib)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCitation(bibtexCitation, "quick-bibtex")}
                      className="text-xs font-mono text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedFormat === "quick-bibtex" ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedFormat === "quick-bibtex" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>

                  <div className="p-2.5 rounded-lg bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 flex items-center justify-between">
                    <span className="font-mono text-ink-700 dark:text-parchment-300 font-medium">
                      RIS (.ris - Zotero)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCitation(risCitation, "quick-ris")}
                      className="text-xs font-mono text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedFormat === "quick-ris" ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedFormat === "quick-ris" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>

                  <div className="p-2.5 rounded-lg bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 flex items-center justify-between">
                    <span className="font-mono text-ink-700 dark:text-parchment-300 font-medium">
                      Chicago Manual of Style
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCitation(chicagoCitation, "quick-chicago")}
                      className="text-xs font-mono text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedFormat === "quick-chicago" ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedFormat === "quick-chicago" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>

                  <div className="p-2.5 rounded-lg bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 flex items-center justify-between">
                    <span className="font-mono text-ink-700 dark:text-parchment-300 font-medium">
                      APA 7th Edition
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCitation(apaCitation, "quick-apa")}
                      className="text-xs font-mono text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedFormat === "quick-apa" ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedFormat === "quick-apa" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
