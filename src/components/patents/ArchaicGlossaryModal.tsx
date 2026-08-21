"use client";

import { BookOpen, Check, Copy, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Patent } from "@/types/patent";

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
  const [copiedCitation, setCopiedCitation] = useState(false);
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

  const filteredGlossary = GLOSSARY_TERMS.filter(
    (g) =>
      g.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.modernEngineeringTranslation.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const inventorNamesBibtex = patent ? patent.inventors.join(" and ") : "";
  const inventorNamesApa = patent ? patent.inventors.join(", ") : "";

  const bibtexCitation = patent
    ? `@patent{${patent.id},
  author    = {${inventorNamesBibtex}},
  title     = {${patent.title}},
  number    = {${patent.patentNumber}},
  year      = {${patent.grantDate.split("-")[0]}},
  month     = {${patent.grantDate.split("-")[1]}},
  day       = {${patent.grantDate.split("-")[2]}},
  url       = {https://classic-patents.com/patents/${patent.id}},
  note      = {Classic Patents Digital Museum}
}`
    : "";

  const [copiedApa, setCopiedApa] = useState(false);

  const apaCitation = patent
    ? `${inventorNamesApa}. (${patent.grantDate.split("-")[0]}). ${patent.title} (U.S. Patent No. ${patent.patentNumber}). U.S. Patent and Trademark Office. https://classic-patents.com/patents/${patent.id}`
    : "";

  const copyApa = () => {
    if (typeof window !== "undefined" && apaCitation && navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(apaCitation)
        .then(() => {
          setCopiedApa(true);
          setTimeout(() => setCopiedApa(false), 2000);
        })
        .catch(() => {});
    }
  };

  const copyBibtex = () => {
    if (typeof window !== "undefined" && bibtexCitation && navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(bibtexCitation)
        .then(() => {
          setCopiedCitation(true);
          setTimeout(() => setCopiedCitation(false), 2000);
        })
        .catch(() => {});
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="glossary-modal-title"
      className="fixed inset-0 z-50 m-auto w-[min(42rem,calc(100vw-2rem))] max-h-[85vh] p-0 bg-transparent border-none open:flex open:items-center open:justify-center backdrop:bg-ink-950/80 backdrop:backdrop-blur-sm"
      onClose={onClose}
      onClick={(e) => {
        // Clicks on the native <dialog> backdrop land on the dialog element.
        if (e.target === dialogRef.current) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div className="w-full max-w-2xl bg-parchment-50 dark:bg-ink-950 rounded-2xl border border-parchment-300 dark:border-ink-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] relative">
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
            className="p-1.5 rounded-lg text-ink-500 hover:text-ink-800 dark:hover:text-ink-200 hover:bg-parchment-200 dark:hover:bg-ink-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div
          role="tablist"
          aria-label="Glossary sections"
          className="flex items-center gap-2 px-5 pt-3 border-b border-parchment-200 dark:border-ink-800 text-xs font-mono"
        >
          <button
            type="button"
            role="tab"
            id="glossary-tab-glossary"
            aria-selected={activeTab === "glossary"}
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
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === "glossary" && (
            <div className="space-y-4">
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
                  className="w-full pl-9 pr-4 py-2 bg-parchment-100 dark:bg-ink-900 border border-parchment-300 dark:border-ink-700 rounded-lg text-xs font-mono text-ink-900 dark:text-parchment-100 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-amber-600"
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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-ink-900 dark:text-parchment-100">
                  BibTeX Citation Entry
                </span>
                <button
                  type="button"
                  onClick={copyBibtex}
                  className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedCitation ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedCitation ? "Copied BibTeX!" : "Copy BibTeX"}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-ink-950 text-amber-300 font-mono text-xs overflow-x-auto whitespace-pre border border-ink-800 leading-relaxed">
                {bibtexCitation}
              </div>

              <div className="p-4 rounded-xl bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink-800 dark:text-parchment-200 block font-mono">
                    APA Format:
                  </span>
                  <button
                    type="button"
                    onClick={copyApa}
                    className="px-2.5 py-1 rounded-md bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer border border-parchment-300 dark:border-ink-700"
                  >
                    {copiedApa ? (
                      <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedApa ? "Copied!" : "Copy APA"}</span>
                  </button>
                </div>
                <p className="text-ink-700 dark:text-ink-300 italic font-serif text-sm">
                  {inventorNamesApa}. ({patent.grantDate.split("-")[0]}). <em>{patent.title}</em>{" "}
                  (U.S. Patent No. {patent.patentNumber}). U.S. Patent and Trademark Office.
                  https://classic-patents.com/patents/{patent.id}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
