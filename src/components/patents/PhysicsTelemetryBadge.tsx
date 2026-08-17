"use client";

import {
  Activity,
  ChevronDown,
  ChevronUp,
  Cpu,
  Gauge,
  Info,
  RotateCcw,
  Sliders,
  Zap,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { LatexRenderer } from "@/components/ui/LatexRenderer";
import { PATENT_PHYSICS_REGISTRY } from "@/physics/telemetryData";
import { soundEngine } from "@/utils/soundEngine";

interface PhysicsTelemetryBadgeProps {
  patentId: string;
  defaultExpanded?: boolean;
}

export function PhysicsTelemetryBadge({
  patentId,
  defaultExpanded = true,
}: PhysicsTelemetryBadgeProps) {
  const data = PATENT_PHYSICS_REGISTRY[patentId];

  // Initialize control values from defaults
  const initialParams = useMemo(() => {
    if (!data) return {};
    const params: Record<string, number> = {};
    for (const ctrl of data.controls) {
      params[ctrl.id] = ctrl.defaultValue;
    }
    return params;
  }, [data]);

  const [paramValues, setParamValues] = useState<Record<string, number>>(initialParams);
  const [expanded, setExpanded] = useState(defaultExpanded);

  // Compute live real-time metrics from current slider states
  const liveMetrics = useMemo(() => {
    if (!data) return [];
    return data.computeMetrics(paramValues);
  }, [data, paramValues]);

  const handleSliderChange = useCallback((id: string, val: number) => {
    setParamValues((prev) => ({
      ...prev,
      [id]: val,
    }));
    // Subtle physical micro-click feedback
    if (typeof window !== "undefined") {
      soundEngine.playMicroswitchClick();
    }
  }, []);

  const handleReset = useCallback(() => {
    setParamValues(initialParams);
    if (typeof window !== "undefined") {
      soundEngine.playSwitchClick();
    }
  }, [initialParams]);

  if (!data) return null;

  return (
    <div className="rounded-2xl border border-cyan-800/80 bg-linear-to-b from-[#071322] via-[#09182a] to-[#040a14] p-4 sm:p-5 text-xs font-sans text-cyan-100 shadow-xl space-y-4 ring-1 ring-cyan-500/20">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-800/60 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
          </span>
          <div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-cyan-300 uppercase tracking-widest">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>FrankenSim WASM Core</span>
              <span className="text-cyan-600">/</span>
              <span className="text-amber-400 font-bold">Interactive Telemetry</span>
            </div>
            <div className="text-xs text-cyan-200/90 font-serif italic mt-0.5">
              {data.domainTitle}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 hover:text-white font-mono text-[11px] transition-colors border border-cyan-800/70 shadow-2xs"
            title="Reset to Patent Canonical Baseline"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Baseline</span>
          </button>

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-200 font-mono text-[11px] font-bold transition-colors border border-cyan-500/40 shadow-2xs"
          >
            <Sliders className="w-3 h-3 text-cyan-400" />
            <span>{expanded ? "Collapse HUD" : "Tune Parameters"}</span>
            {expanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Interactive Parameter Control Sliders */}
      {expanded && data.controls.length > 0 && (
        <div className="bg-cyan-950/40 p-3.5 rounded-xl border border-cyan-800/50 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-cyan-300">
            <span className="flex items-center gap-1.5 uppercase tracking-wide">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              Real-Time Physics Tuning Controls
            </span>
            <span className="text-[10px] text-cyan-400/70">60 FPS Live Computation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {data.controls.map((ctrl) => {
              const currentVal = paramValues[ctrl.id] ?? ctrl.defaultValue;
              return (
                <div
                  key={ctrl.id}
                  className="space-y-1.5 p-2.5 rounded-lg bg-black/30 border border-cyan-900/60"
                >
                  <div className="flex justify-between items-baseline text-[11px]">
                    <span className="text-cyan-200 font-medium">{ctrl.label}</span>
                    <span className="font-mono font-bold text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40 text-[10px]">
                      {currentVal} {ctrl.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={ctrl.min}
                    max={ctrl.max}
                    step={ctrl.step}
                    value={currentVal}
                    onChange={(e) => handleSliderChange(ctrl.id, Number.parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-cyan-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-cyan-800 focus:outline-hidden"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-cyan-500">
                    <span>
                      {ctrl.min} {ctrl.unit}
                    </span>
                    <span>
                      {ctrl.max} {ctrl.unit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Live SI Telemetry Metrics Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {liveMetrics.map((metric) => {
          const colorStyles = {
            cyan: "border-cyan-700/60 bg-cyan-950/60 text-cyan-300 bar-cyan",
            emerald: "border-emerald-700/60 bg-emerald-950/60 text-emerald-300 bar-emerald",
            amber: "border-amber-700/60 bg-amber-950/60 text-amber-300 bar-amber",
            indigo: "border-indigo-700/60 bg-indigo-950/60 text-indigo-300 bar-indigo",
            rose: "border-rose-700/60 bg-rose-950/60 text-rose-300 bar-rose",
            purple: "border-purple-700/60 bg-purple-950/60 text-purple-300 bar-purple",
          }[metric.badgeColor];

          return (
            <div
              key={metric.label}
              className={`p-3 rounded-xl border flex flex-col justify-between shadow-xs transition-all duration-150 ${colorStyles}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-wider font-semibold opacity-90 truncate">
                  {metric.label}
                </span>
                <Gauge className="w-3 h-3 opacity-60" />
              </div>

              <div className="flex items-baseline gap-1 my-1.5">
                <span className="font-mono text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  {metric.value}
                </span>
                <span className="font-mono text-[10px] text-cyan-300/80 font-medium">
                  {metric.unit}
                </span>
              </div>

              {/* Mini visual progress / safe operating gauge */}
              {typeof metric.progressPct === "number" && (
                <div className="w-full bg-black/50 h-1 rounded-full overflow-hidden mt-0.5">
                  <div
                    className="h-full bg-current transition-all duration-150 rounded-full"
                    style={{ width: `${Math.max(3, Math.min(100, metric.progressPct))}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Expanded Governing Equations & Deep Pedagogical Theory */}
      {expanded && (
        <div className="pt-3 border-t border-cyan-800/50 space-y-3">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-300 mb-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Active Governing Formula: {data.equationName}</span>
            </div>
            <div className="p-3 rounded-xl bg-black/60 border border-cyan-800/80 text-center font-serif text-sm overflow-x-auto text-cyan-50 shadow-inner">
              <LatexRenderer math={data.governingEquation} block />
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs text-cyan-100/90 leading-relaxed font-sans bg-cyan-950/60 p-3 rounded-xl border border-cyan-800/60 shadow-xs">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-white font-serif">Computational Mechanics:</strong>{" "}
              {data.pedagogicalInsight}
            </p>
          </div>

          <div className="text-[10px] font-mono text-cyan-400/80 flex flex-wrap items-center justify-between gap-2 pt-1">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400" />
              WASM Engine: <code className="text-amber-300 font-bold">{data.engineMethod}()</code>
            </span>
            <span className="text-cyan-300/80">SI Telemetry Protocol · 6-DoF Synchronized</span>
          </div>
        </div>
      )}
    </div>
  );
}
