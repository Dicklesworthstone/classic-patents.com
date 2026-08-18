"use client";

import { type ReactNode, useMemo } from "react";
import { type SpecClause, specClausesFor } from "@/physics/specClauses";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

interface SpecClauseTextProps {
  patentId: string;
  text: string;
  className?: string;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toneClassName(clause: SpecClause): string {
  return clause.tone === "broken"
    ? "bg-red-200/80 dark:bg-red-900/50 text-red-950 dark:text-red-100 ring-1 ring-red-400/70"
    : clause.tone === "held"
      ? "bg-emerald-200/80 dark:bg-emerald-900/40 text-emerald-950 dark:text-emerald-100 ring-1 ring-emerald-400/70"
      : "bg-amber-200/80 dark:bg-amber-900/40 text-amber-950 dark:text-amber-100 ring-1 ring-amber-400/70";
}

/**
 * Render physics links as React nodes, never as generated HTML. Patent text is
 * archival data, not markup: even a manually prepared edition must not be able
 * to introduce executable or layout-altering HTML through its transcript.
 */
function renderPhysicsHighlighting(
  text: string,
  byPhrase: ReadonlyMap<string, SpecClause>,
): ReactNode {
  if (byPhrase.size === 0) return text;

  const phrases = [...byPhrase.keys()].sort((left, right) => right.length - left.length);
  const matcher = new RegExp(`(${phrases.map(escapeRegExp).join("|")})`, "gi");

  return text.split(matcher).map((fragment, index) => {
    const clause = byPhrase.get(fragment.toLocaleLowerCase());
    if (!clause) return fragment;

    return (
      <mark
        key={`${clause.id}-${index}`}
        className={`rounded-sm px-1 py-0.5 font-medium transition-colors ${toneClassName(clause)}`}
        title={clause.caption}
      >
        {fragment}
      </mark>
    );
  });
}

export function SpecClauseText({ patentId, text, className }: SpecClauseTextProps) {
  const { params } = usePatentPhysics(patentId);
  const clauses = useMemo(() => specClausesFor(patentId, params), [patentId, params]);
  const active = clauses.filter((c) => c.active && text.includes(c.phrase));
  const byPhrase = useMemo(
    () => new Map(active.map((clause) => [clause.phrase.toLocaleLowerCase(), clause])),
    [active],
  );

  const blocks = useMemo(() => {
    if (!text) return [];
    return text
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
      {blocks.map((block, idx) => {
        const pageMarker = /^--- REVIEWED TRANSCRIPTION PAGE (\d+) OF (\d+) ---$/.exec(block);
        if (pageMarker) {
          return (
            <div
              key={`page-${pageMarker[1]}`}
              className="border-y border-parchment-300 py-3 text-center font-mono text-xs font-bold uppercase tracking-[0.2em] text-amber-800 dark:border-ink-800 dark:text-amber-400"
            >
              Source PDF page {pageMarker[1]} of {pageMarker[2]}
            </div>
          );
        }

        const isHeader =
          block.length < 95 &&
          (block === block.toUpperCase() ||
            block.startsWith("UNITED STATES PATENT OFFICE") ||
            block.startsWith("SPECIFICATION") ||
            block.startsWith("CLAIMS"));

        if (isHeader) {
          return (
            <div
              key={`header-${idx}`}
              className="pt-4 pb-2 border-b border-parchment-300 dark:border-ink-800"
            >
              <h4 className="text-sm sm:text-base font-mono font-bold tracking-widest text-amber-900 dark:text-amber-400 uppercase text-center">
                {renderPhysicsHighlighting(block, byPhrase)}
              </h4>
            </div>
          );
        }

        const isPreamble = block.startsWith("To all whom it may concern");
        if (isPreamble) {
          return (
            <p
              key={`preamble-${idx}`}
              className="text-lg sm:text-xl font-serif font-bold text-ink-950 dark:text-parchment-50 leading-relaxed italic border-l-4 border-amber-600 pl-4 my-4"
            >
              {renderPhysicsHighlighting(block, byPhrase)}
            </p>
          );
        }

        const isNumberedClause = /^[0-9]+\.\s/.test(block);
        if (isNumberedClause) {
          return (
            <div
              key={`clause-${idx}`}
              className="pl-6 sm:pl-8 py-2 my-2 border-l-2 border-amber-400/50 dark:border-amber-700/50 bg-parchment-100/40 dark:bg-ink-900/40 rounded-r-xl"
            >
              <p className="text-base sm:text-lg font-serif leading-relaxed text-ink-900 dark:text-parchment-100">
                {renderPhysicsHighlighting(block, byPhrase)}
              </p>
            </div>
          );
        }

        return (
          <p
            key={`para-${idx}`}
            className="text-base sm:text-lg font-serif leading-relaxed text-ink-900 dark:text-parchment-100 tracking-normal"
          >
            {renderPhysicsHighlighting(block, byPhrase)}
          </p>
        );
      })}
    </div>
  );
}
