"use client";

import { AlertTriangle } from "lucide-react";

export function DieselEngine3D() {
  return (
    <section
      aria-labelledby="diesel-3d-source-hold-title"
      className="flex min-h-[380px] flex-col justify-center rounded-2xl border border-amber-300 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-950/30"
    >
      <div className="mx-auto max-w-xl text-center">
        <AlertTriangle className="mx-auto h-8 w-8 text-amber-700 dark:text-amber-300" />
        <h3 id="diesel-3d-source-hold-title" className="mt-3 font-serif text-xl font-bold">
          Diesel 3D model held for source acceptance
        </h3>
        <p className="mt-3 text-sm leading-6 text-ink-700 dark:text-parchment-200">
          A procedural machine model would imply dimensions, fabrication details, valve architecture,
          and operating telemetry that this 1895 grant does not print. The 3D face therefore
          stays unavailable while the facsimile figure boundaries and source wording are
          independently reviewed.
        </p>
        <p className="mt-3 text-xs leading-5 text-ink-600 dark:text-parchment-300">
          Source claims remain readable in the archival candidate; no later engine prototype
          is presented as evidence from US 542,846.
        </p>
      </div>
    </section>
  );
}
