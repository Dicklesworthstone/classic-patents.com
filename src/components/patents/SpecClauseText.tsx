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

function applyPhysicsHighlighting(html: string, byPhrase: Map<string, any>): string {
  if (byPhrase.size === 0) return html;

  let highlighted = html;
  const phrases = Array.from(byPhrase.entries()).sort((a, b) => b[0].length - a[0].length);

  for (const [phrase, clause] of phrases) {
    const tone =
      clause.tone === "broken"
        ? "bg-red-200/80 dark:bg-red-900/50 text-red-950 dark:text-red-100 ring-1 ring-red-400/70"
        : clause.tone === "held"
          ? "bg-emerald-200/80 dark:bg-emerald-900/40 text-emerald-950 dark:text-emerald-100 ring-1 ring-emerald-400/70"
          : "bg-amber-200/80 dark:bg-amber-900/40 text-amber-950 dark:text-amber-100 ring-1 ring-amber-400/70";

    const safeRegex = new RegExp(`(${escapeRegExp(phrase)})(?![^<]*>)`, "gi");
    highlighted = highlighted.replace(
      safeRegex,
      `<mark class="rounded-sm px-1 py-0.5 font-medium transition-colors ${tone}" title="${clause.caption}">$1</mark>`,
    );
  }

  return highlighted;
}

export function SpecClauseText({ patentId, text, className }: SpecClauseTextProps) {
  const { params } = usePatentPhysics(patentId);
  const clauses = useMemo(() => specClausesFor(patentId, params), [patentId, params]);
  const active = clauses.filter((c) => c.active && text.includes(c.phrase));
  const byPhrase = useMemo(() => new Map(active.map((c) => [c.phrase, c])), [active]);

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
        if (block.startsWith("<pre")) {
          return (
            <div
              key={`block-${idx}`}
              // biome-ignore lint/security/noDangerouslySetInnerHtml: pre-rendered trusted data
              dangerouslySetInnerHTML={{ __html: applyPhysicsHighlighting(block, byPhrase) }}
            />
          );
        }

        const isHeader =
          block.length < 95 &&
          !block.includes("<dfn") &&
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
              <h4
                className="text-sm sm:text-base font-mono font-bold tracking-widest text-amber-900 dark:text-amber-400 uppercase text-center"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: pre-rendered trusted data
                dangerouslySetInnerHTML={{ __html: applyPhysicsHighlighting(block, byPhrase) }}
              />
            </div>
          );
        }

        const isPreamble = block.startsWith("To all whom it may concern");
        if (isPreamble) {
          return (
            <p
              key={`preamble-${idx}`}
              className="text-lg sm:text-xl font-serif font-bold text-ink-950 dark:text-parchment-50 leading-relaxed italic border-l-4 border-amber-600 pl-4 my-4"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: pre-rendered trusted data
              dangerouslySetInnerHTML={{ __html: applyPhysicsHighlighting(block, byPhrase) }}
            />
          );
        }

        const isNumberedClause = /^[0-9]+\.\s/.test(block);
        if (isNumberedClause) {
          return (
            <div
              key={`clause-${idx}`}
              className="pl-6 sm:pl-8 py-2 my-2 border-l-2 border-amber-400/50 dark:border-amber-700/50 bg-parchment-100/40 dark:bg-ink-900/40 rounded-r-xl"
            >
              <p
                className="text-base sm:text-lg font-serif leading-relaxed text-ink-900 dark:text-parchment-100"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: pre-rendered trusted data
                dangerouslySetInnerHTML={{ __html: applyPhysicsHighlighting(block, byPhrase) }}
              />
            </div>
          );
        }

        return (
          <p
            key={`para-${idx}`}
            className="text-base sm:text-lg font-serif leading-relaxed text-ink-900 dark:text-parchment-100 tracking-normal"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: pre-rendered trusted data
            dangerouslySetInnerHTML={{ __html: applyPhysicsHighlighting(block, byPhrase) }}
          />
        );
      })}
    </div>
  );
}
