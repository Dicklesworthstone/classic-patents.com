"use client";

import { useMemo } from "react";
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
    .replace(/ ([,\.;:\?!])/g, "$1")
    .trim();
}

function RenderSegment({ text, byPhrase }: { text: string; byPhrase: Map<string, any> }) {
  if (byPhrase.size === 0) return <>{text}</>;

  const activePhrases = Array.from(byPhrase.keys());
  const pattern = new RegExp(`(${activePhrases.map(escapeRegExp).join("|")})`, "g");
  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, i) => {
        const clause = byPhrase.get(part);
        if (!clause) return <span key={`${i}-${part.slice(0, 10)}`}>{part}</span>;
        const tone =
          clause.tone === "broken"
            ? "bg-red-200/80 dark:bg-red-900/50 text-red-950 dark:text-red-100 ring-1 ring-red-400/70"
            : clause.tone === "held"
              ? "bg-emerald-200/80 dark:bg-emerald-900/40 text-emerald-950 dark:text-emerald-100 ring-1 ring-emerald-400/70"
              : "bg-amber-200/80 dark:bg-amber-900/40 text-amber-950 dark:text-amber-100 ring-1 ring-amber-400/70";
        return (
          <mark
            key={`${clause.id}-${i}`}
            className={`rounded-sm px-1 py-0.5 font-medium transition-colors ${tone}`}
            title={clause.caption}
          >
            {part}
          </mark>
        );
      })}
    </>
  );
}

export function SpecClauseText({ patentId, text, className }: SpecClauseTextProps) {
  const { params } = usePatentPhysics(patentId);
  const clauses = useMemo(() => specClausesFor(patentId, params), [patentId, params]);
  const active = clauses.filter((c) => c.active && text.includes(c.phrase));
  const byPhrase = useMemo(() => new Map(active.map((c) => [c.phrase, c])), [active]);

  // Parse text into logical blocks
  const blocks = useMemo(() => {
    if (!text) return [];
    return text
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
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
          normalized.length < 90 &&
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
                <RenderSegment text={normalized} byPhrase={byPhrase} />
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
              <RenderSegment text={normalized} byPhrase={byPhrase} />
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
                <RenderSegment text={normalized} byPhrase={byPhrase} />
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
            <RenderSegment text={normalized} byPhrase={byPhrase} />
          </p>
        );
      })}
    </div>
  );
}
