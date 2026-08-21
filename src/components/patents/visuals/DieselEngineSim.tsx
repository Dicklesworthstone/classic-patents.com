"use client";

import { AlertTriangle } from "lucide-react";

export function DieselEngineSim() {
  return (
    <section
      aria-labelledby="diesel-source-hold-title"
      className="w-full rounded-2xl border border-amber-300 bg-amber-50 p-4 shadow-md dark:border-amber-800 dark:bg-amber-950/30 sm:p-6"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" />
        <div>
          <h3 id="diesel-source-hold-title" className="font-serif text-lg font-bold">
            Diesel visual held for facsimile review
          </h3>
          <p className="mt-2 text-sm leading-6 text-ink-700 dark:text-parchment-200">
            US 542,846 describes theoretical cycle diagrams, gradual fuel admission, and
            cut-off-controlled expansion. The source does not establish a measured cycle,
            engine dimensions, operating range, injector pressure, or efficiency readout.
          </p>
          <p className="mt-2 text-xs leading-5 text-ink-600 dark:text-parchment-300">
            The interactive instrument is withheld until the Swiss foreign-patent line and
            Figures 1–10 are independently checked against the pinned facsimile.
          </p>
        </div>
      </div>
    </section>
  );
}
