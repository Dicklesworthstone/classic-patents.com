"use client";

import { Camera, CircleDot, Flame, Orbit } from "lucide-react";
import Image from "next/image";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

const SOURCE_COMPONENTS = [
  {
    title: "Primary rocket",
    sourceLabel: "Fig. 1: 10, 11, 12, 13, and 14",
    detail:
      "The main casing holds combustion chamber 10 and explosive disks 12. Fuse 14 lights the charge; the gases leave through elongated tapered tube 11 below it.",
  },
  {
    title: "Auxiliary rocket",
    sourceLabel: "Fig. 1: 24, 25, 26, 27, and 28",
    detail:
      "Firing tube 24 carries the smaller rocket. When the main charge is substantially consumed, fuse 28 ignites the smaller charge and tube 24 fires that rocket forward for a further flight.",
  },
  {
    title: "Spin-producing passages",
    sourceLabel: "Figs. 3 and 4: 15 through 20; 30 through 32",
    detail:
      "Backwardly curved passages contain separate explosive charges. Their gas discharge produces the initial spin in the main rocket and can later restore spin in the auxiliary rocket.",
  },
  {
    title: "Gyroscopic camera support",
    sourceLabel: "Figs. 1 and 2: 29, 33 through 45",
    detail:
      "The apparatus head carries a pivoted support and gyroscope. Goddard illustrates a camera on that support so the instrument need not rotate with the spinning head.",
  },
] as const;

const componentIcons = [Flame, CircleDot, Orbit, Camera] as const;

/**
 * Source-bounded guide for US 1,102,653. It deliberately shows the pinned
 * Fig. 1 crop rather than reusing the unrelated US 1,155,986 liquid-rocket
 * simulation that previously occupied this route.
 */
export function GoddardRocketSourceVisual() {
  const { params, updateParam } = usePatentPhysics("us-1102653-goddard-rocket");
  const selectedIndex = Math.max(
    0,
    Math.min(SOURCE_COMPONENTS.length - 1, Math.round(params.sourceFocus ?? 1) - 1),
  );
  const selected = SOURCE_COMPONENTS[selectedIndex];

  return (
    <section
      aria-labelledby="goddard-source-guide-title"
      className="rounded-2xl border border-amber-900/20 bg-parchment-50 p-5 shadow-patent dark:border-ink-800 dark:bg-ink-950 sm:p-7"
    >
      <div className="border-b border-parchment-200 pb-5 dark:border-ink-800">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-400">
          Pinned facsimile guide · PDF p. 1
        </p>
        <h3
          id="goddard-source-guide-title"
          className="mt-2 font-serif text-2xl font-bold text-ink-950 dark:text-parchment-50"
        >
          Goddard&apos;s solid-charge auxiliary rocket
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-700 dark:text-ink-300 sm:text-base">
          This guide follows US 1,102,653&apos;s drawing and specification: a main solid-explosive
          rocket, a forward firing tube for a smaller auxiliary rocket, spin-producing passages, and
          a gyroscopically held recording instrument. It is not a thrust, Mach, liquid-fuel, or
          stage-separation simulation.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(17rem,0.9fr)]">
        <figure className="rounded-2xl border border-parchment-300 bg-white p-3 shadow-sm dark:border-ink-800 dark:bg-ink-900 sm:p-4">
          <div className="relative mx-auto max-w-[25rem] overflow-hidden rounded-xl border border-parchment-200 bg-parchment-100 dark:border-ink-700 dark:bg-ink-950">
            <Image
              alt="US 1,102,653 Figure 1: longitudinal partial section of Goddard's primary rocket, firing tube, auxiliary rocket, and tapered discharge tube."
              className="h-auto w-full object-contain"
              height={2020}
              priority={false}
              src="/patents/figures/us-1102653-goddard-rocket-fig-1-source-crop-v4.png"
              width={540}
            />
          </div>
          <figcaption className="mt-3 text-sm leading-6 text-ink-700 dark:text-ink-300">
            <span className="font-semibold text-ink-950 dark:text-parchment-50">Fig. 1.</span>{" "}
            Longitudinal source crop. The exact figure references in the Original Patent Text open
            their individual source previews on hover, focus, or touch.
          </figcaption>
        </figure>

        <fieldset className="space-y-3">
          <legend className="sr-only">Source apparatus components</legend>
          {SOURCE_COMPONENTS.map((component, index) => {
            const Icon = componentIcons[index];
            const isSelected = index === selectedIndex;
            return (
              <button
                aria-pressed={isSelected}
                className={`w-full rounded-xl border p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 ${
                  isSelected
                    ? "border-amber-500 bg-amber-100/70 dark:border-amber-500 dark:bg-amber-950/40"
                    : "border-parchment-300 bg-parchment-100/80 hover:border-amber-400 hover:bg-amber-50 dark:border-ink-800 dark:bg-ink-900/70 dark:hover:bg-ink-800"
                }`}
                key={component.title}
                onClick={() => updateParam("sourceFocus", index + 1)}
                type="button"
              >
                <span className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400" />
                  <span>
                    <span className="block font-serif text-lg font-bold text-ink-950 dark:text-parchment-50">
                      {component.title}
                    </span>
                    <span className="mt-1 block font-mono text-xs text-amber-700 dark:text-amber-400">
                      {component.sourceLabel}
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
        <span className="font-semibold text-ink-950 dark:text-parchment-50">Claim 2 geometry:</span>{" "}
        tapered tube 11 is a slightly tapered truncated cone whose length is not less than three
        times its longest diameter. The patent says the best proportion is to be determined
        experimentally; it gives no chamber pressure, mass flow, exit Mach number, or numerical
        thrust for this apparatus.
      </div>
    </section>
  );
}
