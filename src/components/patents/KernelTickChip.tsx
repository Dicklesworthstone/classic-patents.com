"use client";

import type { ParamChange } from "@/physics/usePatentPhysics";

interface KernelTickChipProps {
  tick: number;
  lastChange: ParamChange | null;
  face: string;
}

export function KernelTickChip({ tick, lastChange, face }: KernelTickChipProps) {
  const rate =
    lastChange && Number.isFinite(lastChange.ratePerSec)
      ? `${lastChange.ratePerSec >= 0 ? "+" : ""}${lastChange.ratePerSec.toFixed(1)} ${lastChange.id}/s`
      : "idle";
  return (
    <div className="inline-flex flex-wrap items-center gap-2 rounded-lg border border-parchment-300 dark:border-ink-700 bg-parchment-100/80 dark:bg-ink-900/80 px-2.5 py-1 font-mono text-[10px] text-ink-700 dark:text-ink-300">
      <span className="uppercase tracking-wider text-ink-600 dark:text-ink-400">{face}</span>
      <span className="font-bold text-amber-800 dark:text-amber-400">tick {tick}</span>
      <span className="text-ink-400">·</span>
      <span>{rate}</span>
    </div>
  );
}
