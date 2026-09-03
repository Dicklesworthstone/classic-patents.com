"use client";

import type { ReactNode } from "react";

type SimulationTelemetryCard = {
  label: string;
  value: ReactNode;
  valueClassName?: string;
};

type SimulationTelemetryGridProps = {
  cards: readonly SimulationTelemetryCard[];
};

const DEFAULT_VALUE_CLASS_NAME =
  "font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100";

/**
 * A compact, data-driven readout grid for mechanism simulators. The calling
 * simulator remains responsible for SI telemetry and only supplies its labels
 * and already-computed values.
 */
export function SimulationTelemetryGrid({ cards }: SimulationTelemetryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 my-4 sm:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-parchment-200 bg-parchment-100 p-2.5 text-center dark:border-ink-800 dark:bg-ink-900"
        >
          <span className="block font-sans text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400">
            {card.label}
          </span>
          <span className={card.valueClassName ?? DEFAULT_VALUE_CLASS_NAME}>{card.value}</span>
        </div>
      ))}
    </div>
  );
}
