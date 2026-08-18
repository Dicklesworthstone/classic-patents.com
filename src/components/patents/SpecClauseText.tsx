"use client";

import { useMemo } from "react";
import { ESOTERIC_PATENT_GLOSSARY, type EsotericTermDefinition } from "@/data/esotericPatentTerms";
import { specClausesFor } from "@/physics/specClauses";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

interface SpecClauseTextProps {
  patentId: string;
  text: string;
  className?: string;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Normalizes paragraph text to eliminate hard OCR line breaks while preserving words.
 */
function normalizeParagraph(raw: string): string {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .reduce((acc, line, idx) => {
      if (idx === 0) return line;
      if (acc.endsWith("-") && /^[a-zA-Z]/.test(line)) {
        return acc.slice(0, -1) + line;
      }
      return `${acc} ${line}`;
    }, "")
    .replace(/[ \t]+/g, " ")
    .replace(/ ([.,;:?!])/g, "$1")
    .trim();
}

interface TermTooltipProps {
  term: string;
  definition: EsotericTermDefinition;
}

function TermTooltip({ term, definition }: TermTooltipProps) {
  const categoryBadgeColors: Record<string, string> = {
    legal:
      "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300",
    mechanics: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300",
    materials: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300",
    electrical:
      "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-300",
    acoustics:
      "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300",
    thermodynamics: "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300",
    nuclear:
      "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950 dark:text-orange-300",
    semiconductor: "bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-950 dark:text-cyan-300",
  };
  const badgeClass =
    categoryBadgeColors[definition.category] ||
    "bg-ink-100 text-ink-800 border-ink-300 dark:bg-ink-800 dark:text-ink-200";

  return (
    <span className="group relative inline-block cursor-help select-text">
      <span className="underline decoration-dotted decoration-amber-600 dark:decoration-amber-400 decoration-2 underline-offset-4 text-ink-950 dark:text-parchment-50 hover:bg-amber-500/10 dark:hover:bg-amber-400/10 rounded px-0.5 transition-colors">
        {term}
      </span>
      <span className="pointer-events-none invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 sm:w-80 p-3.5 rounded-xl bg-ink-950/95 dark:bg-parchment-950/95 text-parchment-100 text-xs font-sans shadow-2xl border border-amber-500/40 z-50 backdrop-blur-md text-left">
        <span className="flex items-center justify-between gap-2 border-b border-parchment-700/50 pb-1.5 mb-2">
          <span className="font-serif font-bold text-amber-300 text-sm">{definition.term}</span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${badgeClass}`}
          >
            {definition.category}
          </span>
        </span>
        <span className="block text-parchment-200 leading-snug mb-2 font-normal font-sans">
          {definition.historicalDefinition}
        </span>
        <span className="block pt-1.5 border-t border-parchment-800 text-[11px] text-amber-200/90 font-mono">
          <strong className="text-amber-400">Modern Equivalent:</strong>{" "}
          {definition.modernEquivalent}
        </span>
      </span>
    </span>
  );
}

function RenderSegment({
  text,
  byPhrase,
  glossaryEntries,
}: {
  text: string;
  byPhrase: Map<string, any>;
  glossaryEntries: [string, EsotericTermDefinition][];
}) {
  // Collect all searchable keys
  const patterns: { key: string; isClause: boolean; def?: EsotericTermDefinition }[] = [];

  for (const [phrase] of byPhrase) {
    patterns.push({ key: phrase, isClause: true });
  }

  for (const [key, def] of glossaryEntries) {
    if (!patterns.some((p) => p.key.toLowerCase() === key.toLowerCase())) {
      patterns.push({ key, isClause: false, def });
    }
  }

  if (patterns.length === 0) return <>{text}</>;

  // Sort longest keys first so longer phrases match before sub-words
  patterns.sort((a, b) => b.key.length - a.key.length);

  const regex = new RegExp(`(${patterns.map((p) => escapeRegExp(p.key)).join("|")})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;

        const lowerPart = part.toLowerCase();
        const matched = patterns.find((p) => p.key.toLowerCase() === lowerPart);

        if (!matched) {
          return <span key={`${i}-${part.slice(0, 8)}`}>{part}</span>;
        }

        if (matched.isClause) {
          const clause = byPhrase.get(matched.key);
          const tone =
            clause?.tone === "broken"
              ? "bg-red-200/80 dark:bg-red-900/50 text-red-950 dark:text-red-100 ring-1 ring-red-400/70"
              : clause?.tone === "held"
                ? "bg-emerald-200/80 dark:bg-emerald-900/40 text-emerald-950 dark:text-emerald-100 ring-1 ring-emerald-400/70"
                : "bg-amber-200/80 dark:bg-amber-900/40 text-amber-950 dark:text-amber-100 ring-1 ring-amber-400/70";
          return (
            <mark
              key={`clause-${i}-${part}`}
              className={`rounded-sm px-1 py-0.5 font-medium transition-colors ${tone}`}
              title={clause?.caption}
            >
              {part}
            </mark>
          );
        }

        if (matched.def) {
          return <TermTooltip key={`term-${i}-${part}`} term={part} definition={matched.def} />;
        }

        return <span key={`${i}-${part.slice(0, 8)}`}>{part}</span>;
      })}
    </>
  );
}

export function SpecClauseText({ patentId, text, className }: SpecClauseTextProps) {
  const { params } = usePatentPhysics(patentId);
  const clauses = useMemo(() => specClausesFor(patentId, params), [patentId, params]);
  const active = clauses.filter((c) => c.active && text.includes(c.phrase));
  const byPhrase = useMemo(() => new Map(active.map((c) => [c.phrase, c])), [active]);

  const glossaryEntries = useMemo(() => {
    return Object.entries(ESOTERIC_PATENT_GLOSSARY).filter(([term]) => {
      const regex = new RegExp(`\\b${escapeRegExp(term)}\\b`, "i");
      return regex.test(text);
    });
  }, [text]);

  // Parse text into logical blocks
  const blocks = useMemo(() => {
    if (!text) return [];

    let processed = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    // Remove page markers completely
    processed = processed.replace(/---\s*SOURCE PDF PAGE \d+ OF \d+\s*---/gi, " ");

    // Ensure numbered claims start on a new block
    processed = processed.replace(/(\s)([0-9]+\.\s+[A-Z])/g, "$1\n\n$2");

    return processed
      .split(/\n{2,}/)
      .map((b) => b.trim())
      .filter(Boolean);
  }, [text]);

  return (
    <div
      className={
        className || "space-y-6 text-ink-950 dark:text-parchment-100 font-serif leading-relaxed"
      }
    >
      {blocks.map((rawBlock, idx) => {
        const normalized = normalizeParagraph(rawBlock);
        if (!normalized) return null;

        // Header Detection: All caps or short legal banner
        const isHeader =
          normalized.length < 95 &&
          (normalized === normalized.toUpperCase() ||
            normalized.startsWith("UNITED STATES PATENT OFFICE") ||
            normalized.startsWith("SPECIFICATION") ||
            normalized.startsWith("CLAIMS"));

        if (isHeader) {
          return (
            <div
              key={`header-${idx}`}
              className="pt-4 pb-2 border-b border-parchment-300 dark:border-ink-800"
            >
              <h4 className="text-sm sm:text-base font-mono font-bold tracking-widest text-amber-900 dark:text-amber-400 uppercase text-center">
                <RenderSegment
                  text={normalized}
                  byPhrase={byPhrase}
                  glossaryEntries={glossaryEntries}
                />
              </h4>
            </div>
          );
        }

        // Preamble / Salutation Detection ("To all whom it may concern:")
        const isPreamble = normalized.startsWith("To all whom it may concern");
        if (isPreamble) {
          return (
            <p
              key={`preamble-${idx}`}
              className="text-lg sm:text-xl font-serif font-bold text-ink-950 dark:text-parchment-50 leading-relaxed italic border-l-4 border-amber-600 pl-4 my-4"
            >
              <RenderSegment
                text={normalized}
                byPhrase={byPhrase}
                glossaryEntries={glossaryEntries}
              />
            </p>
          );
        }

        // Numbered Claim Clause or List Item
        const isNumberedClause = /^[0-9]+\.\s/.test(normalized);
        if (isNumberedClause) {
          return (
            <div
              key={`clause-${idx}`}
              className="pl-6 sm:pl-8 py-2 my-2 border-l-2 border-amber-400/50 dark:border-amber-700/50 bg-parchment-100/40 dark:bg-ink-900/40 rounded-r-xl"
            >
              <p className="text-base sm:text-lg font-serif leading-relaxed text-ink-900 dark:text-parchment-100">
                <RenderSegment
                  text={normalized}
                  byPhrase={byPhrase}
                  glossaryEntries={glossaryEntries}
                />
              </p>
            </div>
          );
        }

        // Standard Flowing Prose Paragraph
        return (
          <p
            key={`para-${idx}`}
            className="text-base sm:text-lg font-serif leading-relaxed text-ink-900 dark:text-parchment-100 tracking-normal"
          >
            <RenderSegment
              text={normalized}
              byPhrase={byPhrase}
              glossaryEntries={glossaryEntries}
            />
          </p>
        );
      })}
    </div>
  );
}
