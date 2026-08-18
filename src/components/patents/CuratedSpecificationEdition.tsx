import type {
  CuratedSpecificationEdition as CuratedSpecificationEditionData,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

interface CuratedSpecificationEditionProps {
  edition: CuratedSpecificationEditionData;
  className?: string;
}

function AnnotatedTerm({
  inline,
}: {
  inline: Extract<CuratedSpecificationInline, { kind: "term" }>;
}) {
  return (
    <details className="group relative inline">
      <summary className="inline cursor-help list-none border-b border-dotted border-amber-700 font-medium text-amber-950 decoration-amber-700 underline decoration-dotted underline-offset-4 marker:hidden dark:border-amber-400 dark:text-amber-200 dark:decoration-amber-400">
        {inline.text}
        <span className="sr-only">. Definition available.</span>
      </summary>
      <span
        role="tooltip"
        className="absolute bottom-full left-0 z-20 mb-2 hidden w-72 rounded-xl border border-amber-300 bg-parchment-50 p-3 font-sans text-xs font-normal leading-relaxed text-ink-900 shadow-xl group-hover:block group-focus-within:block group-open:block dark:border-amber-800 dark:bg-ink-950 dark:text-parchment-100"
      >
        {inline.label && (
          <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
            {inline.label}
          </span>
        )}
        {inline.definition}
      </span>
    </details>
  );
}

function RenderInlines({ inlines }: { inlines: CuratedSpecificationInlines }) {
  return (
    <>
      {inlines.map((inline, index) => {
        const key = `${inline.kind}-${index}`;
        if (inline.kind === "text") return <span key={key}>{inline.text}</span>;
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

/**
 * A presentation-only renderer for an edition that was already prepared by an
 * editor. It deliberately contains no OCR cleanup, source-text parsing,
 * Markdown/HTML interpretation, automatic glossary matching, or PDF-page
 * reconstruction. React escapes each authored string by default.
 */
export function CuratedSpecificationEdition({
  edition,
  className,
}: CuratedSpecificationEditionProps) {
  return (
    <article
      className={
        className ??
        "space-y-6 font-serif text-base leading-relaxed text-ink-900 dark:text-parchment-100 sm:text-lg"
      }
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
          return (
            <p key={key} className="text-pretty">
              <RenderInlines inlines={block.inlines} />
            </p>
          );
        }

        if (block.kind === "claim") {
          return (
            <section
              key={key}
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
