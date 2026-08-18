"use client";

import { ArrowUpRight, Image, ScrollText } from "lucide-react";
import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";
import { useId, useState } from "react";
import type {
  CuratedSpecificationEdition as CuratedSpecificationEditionData,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
  PatentClaim,
} from "@/types/patent";

interface CuratedSpecificationEditionProps {
  edition: CuratedSpecificationEditionData;
  /** Hand-authored notes keyed to the edition's stable block order. */
  paragraphNotes: Readonly<Record<number, string>>;
  /** Separately hand-authored claim decoders from the canonical patent record. */
  claimDecoders: readonly Pick<PatentClaim, "number" | "plainEnglish">[];
  className?: string;
}

function hasFineHoverPointer() {
  return (
    typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

function AnnotatedTerm({
  inline,
}: {
  inline: Extract<CuratedSpecificationInline, { kind: "term" }>;
}) {
  const tooltipId = useId();
  const [touchOpen, setTouchOpen] = useState(false);
  const handleSummaryClick = (event: ReactMouseEvent<HTMLElement>) => {
    // Mouse/trackpad annotations are hover-only. Keyboard interaction and
    // touch remain deliberate toggles, so neither modality loses access.
    if (event.detail > 0 && hasFineHoverPointer()) {
      event.currentTarget.blur();
      return;
    }
    setTouchOpen((open) => !open);
  };

  return (
    <span className="group relative inline">
      <button
        type="button"
        aria-controls={tooltipId}
        aria-expanded={touchOpen}
        aria-label={`${inline.text}. ${inline.label ?? "Historical-term definition."}`}
        className="inline cursor-help border-b border-dotted border-amber-700 bg-transparent p-0 font-inherit font-medium text-amber-950 decoration-amber-700 underline decoration-dotted underline-offset-4 dark:border-amber-400 dark:text-amber-200 dark:decoration-amber-400"
        onClick={handleSummaryClick}
      >
        {inline.text}
      </button>
      <span
        id={tooltipId}
        role="tooltip"
        className={`absolute bottom-full left-0 z-20 mb-2 w-72 rounded-xl border border-amber-300 bg-parchment-50 p-3 font-sans text-xs font-normal leading-relaxed text-ink-900 shadow-xl group-hover:block group-focus-within:block dark:border-amber-800 dark:bg-ink-950 dark:text-parchment-100 ${
          touchOpen ? "block" : "hidden"
        }`}
      >
        {inline.label && (
          <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
            {inline.label}
          </span>
        )}
        {inline.definition}
      </span>
    </span>
  );
}

function SourceReference({
  inline,
}: {
  inline: Extract<CuratedSpecificationInline, { kind: "reference" }>;
}) {
  const isFigure = inline.referenceType === "figure";
  const Icon = isFigure ? Image : ScrollText;
  const typeLabel = isFigure ? "Figure" : inline.referenceType === "claim" ? "Claim" : "Section";

  return (
    <a
      href={inline.href}
      aria-label={inline.label}
      className="mx-0.5 inline-flex items-center gap-1 rounded-md border border-amber-500/45 bg-amber-100/75 px-1.5 py-0.5 align-baseline font-sans text-[0.72em] font-bold leading-none text-amber-950 no-underline shadow-xs transition-colors hover:border-amber-700 hover:bg-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 dark:border-amber-500/50 dark:bg-amber-950/45 dark:text-amber-100 dark:hover:bg-amber-900/70"
    >
      <Icon className="h-[0.95em] w-[0.95em]" aria-hidden="true" />
      <span className="font-mono text-[0.8em] uppercase tracking-[0.08em]">{typeLabel}</span>
      <span>{inline.text}</span>
      <ArrowUpRight className="h-[0.9em] w-[0.9em]" aria-hidden="true" />
    </a>
  );
}

function RenderInlines({ inlines }: { inlines: CuratedSpecificationInlines }) {
  return (
    <>
      {inlines.map((inline, index) => {
        const key = `${inline.kind}-${index}`;
        if (inline.kind === "text") return <span key={key}>{inline.text}</span>;
        if (inline.kind === "reference") return <SourceReference key={key} inline={inline} />;
        if (inline.kind === "emphasis") return <em key={key}>{inline.text}</em>;
        if (inline.kind === "small-caps") {
          return (
            <span key={key} className="font-semibold text-[0.92em] uppercase tracking-[0.08em]">
              {inline.text}
            </span>
          );
        }
        return <AnnotatedTerm key={key} inline={inline} />;
      })}
    </>
  );
}

function ParallelReading({
  children,
  plainEnglish,
  sourceLabel = "Original patent text",
}: {
  children: ReactNode;
  plainEnglish: string;
  sourceLabel?: string;
}) {
  return (
    <section className="grid gap-5 border-b border-parchment-300/80 pb-8 last:border-b-0 dark:border-ink-800 lg:grid-cols-[minmax(0,1.28fr)_minmax(18rem,0.72fr)] lg:gap-8 lg:pb-10">
      <div className="min-w-0 space-y-3">
        <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500 dark:text-ink-400">
          {sourceLabel}
        </span>
        {children}
      </div>
      <aside className="rounded-xl border border-emerald-300/80 bg-emerald-50/70 px-4 py-4 font-sans text-base leading-7 text-ink-900 shadow-xs dark:border-emerald-800/80 dark:bg-emerald-950/20 dark:text-emerald-100 sm:px-5 sm:text-[1.05rem] sm:leading-7">
        <span className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-800 dark:text-emerald-300">
          Plain English
        </span>
        <p className="text-pretty">{plainEnglish}</p>
      </aside>
    </section>
  );
}

/**
 * A presentation-only renderer for an edition that was already prepared by an
 * editor. It deliberately contains no OCR cleanup, source-text parsing,
 * Markdown/HTML interpretation, automatic glossary matching, or PDF-page
 * reconstruction. React escapes each authored string by default.
 */
export function CuratedSpecificationEdition({
  edition,
  paragraphNotes,
  claimDecoders,
  className,
}: CuratedSpecificationEditionProps) {
  const readingRhythm =
    "space-y-8 font-serif text-lg leading-8 text-ink-900 dark:text-parchment-100 sm:space-y-10 sm:text-[1.25rem] sm:leading-9";

  return (
    <article
      className={className ? `${readingRhythm} ${className}` : readingRhythm}
      data-edition-kind={edition.kind}
    >
      {edition.blocks.map((block, index) => {
        const key = `${block.kind}-${index}`;

        if (block.kind === "masthead") {
          return (
            <header
              key={key}
              className="border-y border-parchment-300 py-6 text-center font-mono text-xs font-bold uppercase tracking-[0.16em] text-amber-900 dark:border-ink-800 dark:text-amber-400 sm:text-sm"
            >
              {block.lines.map((line, lineIndex) => (
                <p key={`${key}-line-${lineIndex}`} className="my-1">
                  {line}
                </p>
              ))}
            </header>
          );
        }

        if (block.kind === "heading") {
          const Heading = block.level === 2 ? "h3" : "h4";
          return (
            <Heading
              key={key}
              className={
                block.level === 2
                  ? "pt-7 text-center font-serif text-2xl font-bold text-ink-950 dark:text-parchment-50"
                  : "pt-5 font-serif text-xl font-bold text-ink-950 dark:text-parchment-50"
              }
            >
              {block.text}
            </Heading>
          );
        }

        if (block.kind === "paragraph") {
          const plainEnglish = paragraphNotes[index];
          if (!plainEnglish) {
            throw new Error(
              `Manual archival paragraph ${index + 1} is missing its Plain English reading.`,
            );
          }
          return (
            <ParallelReading key={key} plainEnglish={plainEnglish}>
              <p className="text-pretty">
                <RenderInlines inlines={block.inlines} />
              </p>
            </ParallelReading>
          );
        }

        if (block.kind === "claim") {
          const plainEnglish = claimDecoders.find(
            (claim) => claim.number === block.number,
          )?.plainEnglish;
          if (!plainEnglish) {
            throw new Error(
              `Manual archival claim ${block.number} is missing its canonical Plain English decoder.`,
            );
          }
          const claim = (
            <section
              id={`claim-${block.number}`}
              aria-label={`Claim ${block.number}`}
              className="grid grid-cols-[auto_1fr] gap-x-3 rounded-r-xl border-l-2 border-amber-500/70 bg-parchment-100/50 px-4 py-3 dark:border-amber-700 dark:bg-ink-900/50"
            >
              <span className="pt-1 font-mono text-xs font-bold text-amber-800 dark:text-amber-400">
                {block.number}.
              </span>
              <p className="text-pretty">
                <RenderInlines inlines={block.inlines} />
              </p>
            </section>
          );
          return (
            <ParallelReading
              key={key}
              plainEnglish={plainEnglish}
              sourceLabel={`Original claim ${block.number}`}
            >
              {claim}
            </ParallelReading>
          );
        }

        if (block.kind === "figure-sheet") {
          return (
            <figure
              key={key}
              className="rounded-xl border border-parchment-300 bg-parchment-100/60 px-5 py-4 dark:border-ink-800 dark:bg-ink-900/60"
            >
              <figcaption className="mb-2 font-mono text-xs font-bold uppercase tracking-[0.12em] text-amber-800 dark:text-amber-400">
                {block.figureLabel}
                {block.title ? ` — ${block.title}` : ""}
              </figcaption>
              <p className="text-sm leading-relaxed sm:text-base">
                <RenderInlines inlines={block.description} />
              </p>
            </figure>
          );
        }

        if (block.kind === "table") {
          return (
            <figure
              key={key}
              className="overflow-x-auto rounded-xl border border-parchment-300 dark:border-ink-800"
            >
              {block.caption && (
                <figcaption className="border-b border-parchment-300 bg-parchment-100 px-4 py-3 font-sans text-sm font-semibold text-ink-900 dark:border-ink-800 dark:bg-ink-900 dark:text-parchment-100">
                  {block.caption}
                </figcaption>
              )}
              <table className="min-w-full border-collapse text-left font-sans text-sm">
                <thead className="bg-parchment-100/70 dark:bg-ink-900/70">
                  <tr>
                    {block.headers.map((header, headerIndex) => (
                      <th
                        key={`${key}-header-${headerIndex}`}
                        scope="col"
                        className="border-b border-parchment-300 px-4 py-3 font-semibold text-ink-900 dark:border-ink-800 dark:text-parchment-100"
                      >
                        <RenderInlines inlines={header} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={`${key}-row-${rowIndex}`}>
                      {row.map((cell, cellIndex) => (
                        <td
                          key={`${key}-cell-${rowIndex}-${cellIndex}`}
                          className="border-b border-parchment-200 px-4 py-3 align-top last:border-b-0 dark:border-ink-800"
                        >
                          <RenderInlines inlines={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </figure>
          );
        }

        return (
          <figure
            key={key}
            className="rounded-xl border border-amber-300 bg-amber-50/70 px-5 py-4 text-center dark:border-amber-800 dark:bg-amber-950/20"
          >
            <code className="font-mono text-sm text-ink-950 dark:text-parchment-50">
              {block.text}
            </code>
            {block.description && (
              <figcaption className="mt-2 font-sans text-xs leading-relaxed text-ink-700 dark:text-ink-300">
                {block.description}
              </figcaption>
            )}
          </figure>
        );
      })}
    </article>
  );
}
