"use client";

import { Activity, Cpu, Gauge, Info, RotateCcw, Zap } from "lucide-react";
import { useCallback, useState } from "react";
import { LatexRenderer } from "@/components/ui/LatexRenderer";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";

interface PhysicsTelemetryBadgeProps {
  patentId: string;
  defaultExpanded?: boolean;
}

export function PhysicsTelemetryBadge({
  patentId,
  defaultExpanded = false,
}: PhysicsTelemetryBadgeProps) {
  const { meta: data, metrics: liveMetrics, resetParams } = usePatentPhysics(patentId);
  const [showTheory, setShowTheory] = useState(defaultExpanded);

  const handleReset = useCallback(() => {
    resetParams();
    if (typeof window !== "undefined") {
      soundEngine.playSwitchClick();
    }
  }, [resetParams]);

  if (!data) return null;

  return (
    <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/60 dark:bg-ink-950/90 p-4 sm:p-5 text-xs font-sans text-ink-800 dark:text-parchment-200 shadow-sm space-y-4">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-300 dark:border-ink-800 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
          </span>
          <div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest">
              <Cpu className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>FrankenSim SI kernel</span>
              <span className="text-ink-400 dark:text-ink-600">/</span>
              <span className="text-ink-900 dark:text-parchment-100 font-bold">
                Live SI Telemetry
              </span>
            </div>
            <div className="text-xs text-ink-600 dark:text-ink-400 font-serif italic mt-0.5">
              {data.domainTitle}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-parchment-200/80 dark:bg-ink-900 hover:bg-parchment-300 text-ink-700 dark:text-ink-300 hover:text-ink-950 font-mono text-[11px] transition-colors border border-parchment-300 dark:border-ink-700 shadow-2xs"
            title="Reset to Canonical Baseline"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Baseline</span>
          </button>

          <button
            type="button"
            onClick={() => setShowTheory((v) => !v)}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg font-mono text-[11px] font-bold transition-colors border shadow-2xs ${
              showTheory
                ? "bg-amber-700 text-white border-amber-800 dark:bg-amber-600"
                : "bg-parchment-200/80 dark:bg-ink-900 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700 hover:bg-parchment-300"
            }`}
          >
            <Zap className="w-3 h-3 text-amber-300" />
            <span>{showTheory ? "Hide Theory" : "View Equation"}</span>
          </button>
        </div>
      </div>

      {/* Live SI Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {liveMetrics.map((metric) => {
          const barColor =
            metric.badgeColor === "rose"
              ? "bg-rose-600 dark:bg-rose-500"
              : metric.badgeColor === "emerald"
                ? "bg-emerald-600 dark:bg-emerald-500"
                : metric.badgeColor === "cyan" || metric.badgeColor === "indigo"
                  ? "bg-sky-600 dark:bg-sky-500"
                  : "bg-amber-600 dark:bg-amber-500";

          return (
            <div
              key={metric.label}
              className="p-3.5 rounded-xl border border-parchment-300 dark:border-ink-800/90 bg-white/80 dark:bg-ink-900/80 text-ink-900 dark:text-parchment-100 flex flex-col justify-between shadow-2xs transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-ink-600 dark:text-ink-400 truncate">
                  {metric.label}
                </span>
                <Gauge className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 opacity-70" />
              </div>

              <div className="flex items-baseline gap-1 my-1.5">
                <span className="font-mono text-base sm:text-lg font-extrabold text-ink-950 dark:text-white tracking-tight">
                  {metric.value}
                </span>
                <span className="font-mono text-[10px] text-ink-500 dark:text-ink-400 font-medium">
                  {metric.unit}
                </span>
              </div>

              {/* Mini visual progress bar */}
              {typeof metric.progressPct === "number" && (
                <div className="w-full bg-parchment-200 dark:bg-ink-800 h-1.5 rounded-full overflow-hidden mt-0.5">
                  <div
                    className={`h-full ${barColor} transition-all duration-200 rounded-full`}
                    style={{ width: `${Math.max(3, Math.min(100, metric.progressPct))}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Expanded Governing Equations & Deep Pedagogical Theory */}
      {showTheory && (
        <div className="pt-3 border-t border-parchment-300 dark:border-ink-800 space-y-3">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-800 dark:text-amber-400 mb-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Active Governing Formula: {data.equationName}</span>
            </div>
            <div className="p-3 rounded-xl bg-white/80 dark:bg-ink-950 border border-parchment-300 dark:border-ink-800 text-center font-mono text-sm overflow-x-auto text-ink-950 dark:text-parchment-100 shadow-inner">
              <LatexRenderer math={data.governingEquation} block />
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs text-ink-800 dark:text-parchment-200 leading-relaxed font-sans bg-parchment-200/50 dark:bg-ink-900/50 p-3 rounded-xl border border-parchment-300 dark:border-ink-800 shadow-2xs">
            <Info className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-ink-950 dark:text-white font-serif">
                Computational Mechanics:
              </strong>{" "}
              {data.pedagogicalInsight}
            </p>
          </div>

          <div className="text-[10px] font-mono text-ink-500 dark:text-ink-400 flex flex-wrap items-center justify-between gap-2 pt-1">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              Host fallback engine:{" "}
              <code className="text-amber-800 dark:text-amber-400 font-bold">
                {data.engineMethod}()
              </code>
            </span>
            <span className="text-ink-600 dark:text-ink-400">
              SI Telemetry Protocol · 6-DoF Synchronized
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
