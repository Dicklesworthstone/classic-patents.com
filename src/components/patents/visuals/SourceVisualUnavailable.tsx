import { FileSearch, ShieldAlert } from "lucide-react";

interface SourceVisualUnavailableProps {
  title: string;
  detail: string;
}

/**
 * An explicit refusal state for a route whose inherited simulator has been
 * shown not to describe the pinned patent. It is deliberately text-only: a
 * plausible animation of a different invention is worse than no animation.
 */
export function SourceVisualUnavailable({ title, detail }: SourceVisualUnavailableProps) {
  return (
    <section
      aria-labelledby="source-visual-unavailable-title"
      className="rounded-2xl border border-amber-300 bg-amber-50 p-5 shadow-patent dark:border-amber-900/70 dark:bg-amber-950/20 sm:p-7"
    >
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0 text-amber-700 dark:text-amber-400" />
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-amber-800 dark:text-amber-300">
            Visual-model boundary
          </p>
          <h3
            id="source-visual-unavailable-title"
            className="mt-2 font-serif text-2xl font-bold text-ink-950 dark:text-parchment-50"
          >
            {title}
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-700 dark:text-ink-300 sm:text-base">
            {detail}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-white/70 p-4 text-sm leading-6 text-ink-800 dark:border-amber-900/70 dark:bg-ink-950/50 dark:text-ink-200">
        <FileSearch className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400" />
        <p>
          The complete patent text remains available on the Original Patent Text face. This
          visual-only boundary prevents an inherited model from being presented as evidence for the
          wrong invention. A new visual must be authored from the pinned source before this panel is
          replaced.
        </p>
      </div>
    </section>
  );
}
