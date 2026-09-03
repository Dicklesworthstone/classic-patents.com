"use client";

import { Activity, Info, Zap } from "lucide-react";
import { ColorizedEquation } from "@/components/ui/ColorizedEquation";
import { LatexRenderer } from "@/components/ui/LatexRenderer";
import type { ColorizedEquation as ColorizedEquationType } from "@/types/equation";

interface PhysicsTelemetryTheoryProps {
  engineMethod: string;
  equationName: string;
  equations: ColorizedEquationType[];
  governingEquation: string;
  pedagogicalInsight: string;
}

/** The expanded governing-law surface, rendered only at the visitor's request. */
export function PhysicsTelemetryTheory({
  engineMethod,
  equationName,
  equations,
  governingEquation,
  pedagogicalInsight,
}: PhysicsTelemetryTheoryProps) {
  return (
    <div className="pt-4 border-t border-parchment-200 dark:border-ink-800 space-y-4 animate-[ui-fade-in_200ms_ease-out]">
      {equations.length > 0 ? (
        <ColorizedEquation equation={equations[0]} />
      ) : (
        <>
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-800 dark:text-amber-400 mb-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Governing Equation: {equationName}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-ink-900 border border-parchment-300 dark:border-ink-800 text-center font-mono text-sm overflow-x-auto text-ink-950 dark:text-parchment-100 shadow-inner">
              <LatexRenderer math={governingEquation} block />
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-xs text-ink-800 dark:text-parchment-200 leading-relaxed font-sans bg-parchment-100/70 dark:bg-ink-900/60 p-3.5 rounded-xl border border-parchment-300 dark:border-ink-800 shadow-2xs">
            <Info className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-ink-950 dark:text-white font-serif">
                Physical Principle:
              </strong>{" "}
              {pedagogicalInsight}
            </p>
          </div>
        </>
      )}

      <div className="text-[10px] font-mono text-ink-500 dark:text-ink-400 flex flex-wrap items-center justify-between gap-2 pt-1">
        <span className="flex items-center gap-1.5">
          <Activity className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>Host calculation:</span>{" "}
          <code className="text-amber-800 dark:text-amber-400 font-bold">{engineMethod}</code>
        </span>
        <span className="text-ink-500 dark:text-ink-400">
          A patent-specific WASM kernel is identified only by its visual when it is loaded.
        </span>
      </div>
    </div>
  );
}
