"use client";

import { Cpu, RotateCcw, Zap } from "lucide-react";

interface PhysicsTelemetryBadgeHeaderProps {
  domainTitle: string;
  onReset: () => void;
  onToggleTheory: () => void;
  showTheory: boolean;
}

/**
 * The persistent badge identity and its two actions. Keeping this separate
 * from the telemetry subscription makes button interactions independent of
 * metric refreshes.
 */
export function PhysicsTelemetryBadgeHeader({
  domainTitle,
  onReset,
  onToggleTheory,
  showTheory,
}: PhysicsTelemetryBadgeHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3">
      <div className="flex items-center gap-2.5">
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600 dark:bg-emerald-400" />
        </span>
        <div>
          <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest">
            <Cpu className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>Host-Model Telemetry</span>
            <span className="text-ink-300 dark:text-ink-600">/</span>
            <span className="text-ink-950 dark:text-parchment-100 font-bold">Computed Readout</span>
          </div>
          <div className="text-xs text-ink-600 dark:text-ink-400 font-serif italic mt-0.5">
            {domainTitle}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-parchment-100 dark:bg-ink-900 hover:bg-parchment-200 dark:hover:bg-ink-800 text-ink-700 dark:text-ink-300 hover:text-ink-950 dark:hover:text-white font-mono text-[11px] font-semibold transition-colors border border-parchment-300 dark:border-ink-700 shadow-2xs cursor-pointer"
          title="Reset to Baseline Parameters"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Baseline</span>
        </button>

        <button
          type="button"
          onClick={onToggleTheory}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-mono text-[11px] font-bold transition-colors border shadow-2xs cursor-pointer ${
            showTheory
              ? "bg-amber-700 text-white border-amber-800 dark:bg-amber-700 dark:border-amber-500"
              : "bg-parchment-100 dark:bg-ink-900 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-200 dark:hover:bg-ink-800"
          }`}
        >
          <Zap className="w-3 h-3 text-amber-400" />
          <span>{showTheory ? "Hide Theory" : "Governing Law"}</span>
        </button>
      </div>
    </div>
  );
}
