"use client";

import { CircuitBoard, Layers3, Split, Waypoints } from "lucide-react";
import Image from "next/image";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

const SOURCE_VIEWS = [
  {
    figure: 1,
    title: "One transistor and its crossing lead",
    sourceLabel:
      "Figs. 1 and 2: body 1, junctions 3 and 4, oxide 5, contacts 6 and 8, leads 7 and 9",
    detail:
      "The single-transistor example shows a lead reaching contact 6 by crossing oxide tongue 5″ over the nested junctions. A separate C-shaped base contact 8 and its lead 9 remain electrically distinct. This is the concrete geometry behind Claims 1 through 4.",
    width: 820,
    height: 760,
  },
  {
    figure: 3,
    title: "Several device regions in one semiconductor body",
    sourceLabel:
      "Figs. 3 and 4: body 11, junctions 14 through 22, contacts 16 through 26, oxide 27",
    detail:
      "The larger plan and section combine rectifying junctions with an N-P-N transistor. The surface remains oxide-covered except at contacts, so strips can join selected contacts without becoming unintended connections to the intervening semiconductor regions.",
    width: 920,
    height: 620,
  },
  {
    figure: 5,
    title: "The illustrated equivalent circuit",
    sourceLabel:
      "Fig. 5: leads 28 through 32, rectifying junctions 14 and 15, junction capacitances 18 and 22",
    detail:
      "Fig. 5 translates the multi-device structure into circuit roles. The specification says reverse-biased junctions 18 and 22 act as capacitances, while the narrow leads 30, 31, and 32 can provide resistance. It gives no operating clock, bandwidth, or numerical bias value.",
    width: 920,
    height: 440,
  },
  {
    figure: 6,
    title: "Parallel-strip contact variant",
    sourceLabel: "Figs. 6 and 7: junction 38, contacts 40 and 41, oxide, and strips 43 and 44",
    detail:
      "The final example uses parallel metal-strip contacts around an elongated closed junction outline. The oxide covers the junction edge; strips 43 and 44 run over that oxide to the intended contacts. Claim 10 defines this different geometry.",
    width: 780,
    height: 600,
  },
] as const;

const viewIcons = [Layers3, CircuitBoard, Waypoints, Split] as const;

/**
 * Source-bounded visual guide for US 2,981,877. The patent supplies layouts,
 * contact relations, and one illustrative circuit, not a package, clock rate,
 * dopant profile, or device-performance data set.
 */
export function NoycePlanarSourceVisual() {
  const { params, updateParam } = usePatentPhysics("us-2981877-noyce-ic");
  const selectedIndex = Math.max(
    0,
    Math.min(SOURCE_VIEWS.length - 1, Math.round(params.sourceFocus ?? 1) - 1),
  );
  const selected = SOURCE_VIEWS[selectedIndex];

  return (
    <section
      aria-labelledby="noyce-source-guide-title"
      className="rounded-2xl border border-amber-900/20 bg-parchment-50 p-5 shadow-patent dark:border-ink-800 dark:bg-ink-950 sm:p-7"
    >
      <div className="border-b border-parchment-200 pb-5 dark:border-ink-800">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-400">
          Pinned facsimile guide · PDF pp. 1–3
        </p>
        <h3
          id="noyce-source-guide-title"
          className="mt-2 font-serif text-2xl font-bold text-ink-950 dark:text-parchment-50"
        >
          Noyce&apos;s oxide-supported crossing leads
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-700 dark:text-ink-300 sm:text-base">
          This guide follows the seven printed figures of US 2,981,877. It tracks how retained
          semiconductor oxide supports a metal lead across a surface-reaching P-N junction while
          cleared windows provide chosen contacts. It is not a modern integrated-circuit package,
          clock-speed, depletion-width, or fabrication-yield simulator.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(17rem,0.9fr)]">
        <figure className="rounded-2xl border border-parchment-300 bg-white p-3 shadow-sm dark:border-ink-800 dark:bg-ink-900 sm:p-4">
          <div className="relative mx-auto max-w-[34rem] overflow-hidden rounded-xl border border-parchment-200 bg-parchment-100 dark:border-ink-700 dark:bg-ink-950">
            <Image
              alt={`US 2,981,877 Fig. ${selected.figure}: ${selected.title}.`}
              className="h-auto w-full object-contain"
              height={selected.height}
              priority={false}
              src={`/patents/figures/us-2981877-noyce-ic/fig-${selected.figure}-source-crop-v1.png`}
              width={selected.width}
            />
          </div>
          <figcaption className="mt-3 text-sm leading-6 text-ink-700 dark:text-ink-300">
            <span className="font-semibold text-ink-950 dark:text-parchment-50">
              Fig. {selected.figure}.
            </span>{" "}
            Direct crop from the pinned facsimile. The authored figure references in Original Patent
            Text open their matching crops on hover, focus, or touch.
          </figcaption>
        </figure>

        <fieldset className="space-y-3">
          <legend className="sr-only">Source figure relationships</legend>
          {SOURCE_VIEWS.map((view, index) => {
            const Icon = viewIcons[index];
            const isSelected = index === selectedIndex;
            return (
              <button
                aria-pressed={isSelected}
                className={`w-full rounded-xl border p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 ${
                  isSelected
                    ? "border-amber-500 bg-amber-100/70 dark:border-amber-500 dark:bg-amber-950/40"
                    : "border-parchment-300 bg-parchment-100/80 hover:border-amber-400 hover:bg-amber-50 dark:border-ink-800 dark:bg-ink-900/70 dark:hover:bg-ink-800"
                }`}
                key={view.figure}
                onClick={() => updateParam("sourceFocus", index + 1)}
                type="button"
              >
                <span className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400" />
                  <span>
                    <span className="block font-serif text-lg font-bold text-ink-950 dark:text-parchment-50">
                      {view.title}
                    </span>
                    <span className="mt-1 block font-mono text-xs text-amber-700 dark:text-amber-400">
                      {view.sourceLabel}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </fieldset>
      </div>

      <div
        aria-live="polite"
        className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/70 dark:bg-amber-950/20"
      >
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-amber-800 dark:text-amber-300">
          {selected.sourceLabel}
        </p>
        <p className="mt-2 text-sm leading-6 text-ink-800 dark:text-ink-200 sm:text-base">
          {selected.detail}
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-parchment-300 bg-parchment-100/80 p-4 text-sm leading-6 text-ink-700 dark:border-ink-800 dark:bg-ink-900/70 dark:text-ink-300">
        <span className="font-semibold text-ink-950 dark:text-parchment-50">
          Claim-linked probe:
        </span>{" "}
        use the figure selector to compare Claim 1&apos;s basic oxide-supported crossing lead with
        Claim 10&apos;s parallel-strip variant. The grant supplies layouts and material relations;
        it does not print a voltage, a switching frequency, a package, a performance rate, or a
        quantitative semiconductor model for this guide.
      </div>
    </section>
  );
}
