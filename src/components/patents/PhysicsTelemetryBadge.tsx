"use client";

import { Activity, Cpu, Gauge, Info, RotateCcw, Zap } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { EnergyFlowStrip } from "@/components/patents/EnergyFlowStrip";
import { ColorizedEquation } from "@/components/ui/ColorizedEquation";
import { LatexRenderer } from "@/components/ui/LatexRenderer";
import { getColorizedEquationsForPatent } from "@/data/colorizedEquations";
import { coupleEdgesFor } from "@/physics/coupleGraph";
import { energyChannelsFor } from "@/physics/energyChannels";
import { qtyDimension } from "@/physics/qty";
import { computeParameterSensitivity } from "@/physics/sensitivityKernel";
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
  const {
    meta: data,
    metrics: liveMetrics,
    params,
    updateParam,
    lastChange,
    resetParams,
  } = usePatentPhysics(patentId);
  const [showTheory, setShowTheory] = useState(defaultExpanded);
  const equations = useMemo(() => getColorizedEquationsForPatent(patentId), [patentId]);

  const handleReset = useCallback(() => {
    resetParams();
    if (typeof window !== "undefined") {
      soundEngine.playSwitchClick();
    }
  }, [resetParams]);

  const energy = useMemo(() => energyChannelsFor(patentId, params), [patentId, params]);
  const coupleEdges = useMemo(() => coupleEdgesFor(patentId, params), [patentId, params]);
  const sliderSensitivity = useMemo(() => {
    const key = lastChange?.id ?? data?.controls[0]?.id;
    if (!key) return null;
    return computeParameterSensitivity(patentId, key, params);
  }, [lastChange?.id, data?.controls, patentId, params]);
  const liveEnvelope = liveMetrics.map((m) => `${m.label} ${m.value} ${m.unit}`).join("; ");
  const [announcedEnvelope, setAnnouncedEnvelope] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnnouncedEnvelope(liveEnvelope);
    }, 1500); // Throttled interval for screen readers
    return () => clearTimeout(timer);
  }, [liveEnvelope]);

  if (!data) return null;

  return (
    <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50/90 dark:bg-ink-950/90 p-4 sm:p-5 text-xs font-sans text-ink-800 dark:text-parchment-200 shadow-sm space-y-4">
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {data.domainTitle}. {announcedEnvelope}
      </div>

      {/* Header Bar */}
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
              <span className="text-ink-950 dark:text-parchment-100 font-bold">
                Computed Readout
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-parchment-100 dark:bg-ink-900 hover:bg-parchment-200 dark:hover:bg-ink-800 text-ink-700 dark:text-ink-300 hover:text-ink-950 dark:hover:text-white font-mono text-[11px] font-semibold transition-all border border-parchment-300 dark:border-ink-700 shadow-2xs cursor-pointer"
            title="Reset to Baseline Parameters"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Baseline</span>
          </button>

          <button
            type="button"
            onClick={() => setShowTheory((v) => !v)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-mono text-[11px] font-bold transition-all border shadow-2xs cursor-pointer ${
              showTheory
                ? "bg-amber-700 text-white border-amber-800 dark:bg-amber-600 dark:border-amber-500"
                : "bg-parchment-100 dark:bg-ink-900 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-200 dark:hover:bg-ink-800"
            }`}
          >
            <Zap className="w-3 h-3 text-amber-400" />
            <span>{showTheory ? "Hide Theory" : "Governing Law"}</span>
          </button>
        </div>
      </div>

      {/* Live SI Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {liveMetrics.map((metric) => {
          const barColor =
            metric.badgeColor === "rose"
              ? "bg-rose-600 dark:bg-rose-500"
              : metric.badgeColor === "emerald"
                ? "bg-emerald-600 dark:bg-emerald-500"
                : metric.badgeColor === "cyan" || metric.badgeColor === "indigo"
                  ? "bg-sky-600 dark:bg-sky-500"
                  : "bg-amber-600 dark:bg-amber-500";

          const valColor =
            metric.badgeColor === "rose"
              ? "text-rose-700 dark:text-rose-400"
              : metric.badgeColor === "emerald"
                ? "text-emerald-700 dark:text-emerald-400"
                : metric.badgeColor === "cyan" || metric.badgeColor === "indigo"
                  ? "text-sky-700 dark:text-sky-400"
                  : "text-amber-800 dark:text-amber-400";

          return (
            <div
              key={metric.label}
              className="p-3.5 rounded-xl border border-parchment-300/80 dark:border-ink-800 bg-white dark:bg-ink-900/90 text-ink-900 dark:text-parchment-100 flex flex-col justify-between shadow-2xs hover:border-amber-700/30 dark:hover:border-ink-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-ink-500 dark:text-ink-400 truncate">
                  {metric.label}
                </span>
                <Gauge className="w-3.5 h-3.5 text-amber-700/60 dark:text-amber-400/60" />
              </div>

              <div className="flex items-baseline gap-1.5 my-2">
                <span
                  className={`font-mono text-base sm:text-lg font-extrabold tracking-tight ${valColor}`}
                >
                  {metric.value}
                </span>
                <span className="font-mono text-[10px] text-ink-500 dark:text-ink-400 font-medium">
                  {metric.unit}
                  <span className="ml-1 opacity-70">[{qtyDimension(metric.unit)}]</span>
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

      {coupleEdges.length > 0 ? (
        <div className="flex flex-wrap gap-2 pt-1">
          {coupleEdges.map((edge) => (
            <div
              key={`${edge.from}->${edge.to}`}
              className="rounded-lg border border-parchment-300 dark:border-ink-800 bg-white/80 dark:bg-ink-900/80 px-2.5 py-1.5"
              title={`${edge.crate} ${edge.source}`}
            >
              <div className="text-[9px] uppercase tracking-wider font-mono text-ink-500 dark:text-ink-400">
                {edge.from} → {edge.to}
              </div>
              <div className="text-[11px] font-mono font-bold text-ink-900 dark:text-parchment-100">
                {edge.gain}{" "}
                <span className="font-normal text-ink-500 dark:text-ink-400">{edge.unit}</span>
              </div>
              <div className="text-[9px] font-mono text-ink-400">{edge.source}</div>
            </div>
          ))}
          {sliderSensitivity ? (
            <div className="rounded-lg border border-parchment-300 dark:border-ink-800 bg-white/80 dark:bg-ink-900/80 px-2.5 py-1.5">
              <div className="text-[9px] uppercase tracking-wider font-mono text-ink-500 dark:text-ink-400">
                {sliderSensitivity.derivativeSymbol} (host Dual)
              </div>
              <div className="text-[11px] font-mono font-bold text-ink-900 dark:text-parchment-100">
                {sliderSensitivity.derivativeValue}{" "}
                <span className="font-normal text-ink-500 dark:text-ink-400">
                  {sliderSensitivity.derivativeUnit}
                </span>
              </div>
            </div>
          ) : null}
          {lastChange ? (
            <div className="rounded-lg border border-parchment-300 dark:border-ink-800 bg-white/80 dark:bg-ink-900/80 px-2.5 py-1.5">
              <div className="text-[9px] uppercase tracking-wider font-mono text-ink-500 dark:text-ink-400">
                d({lastChange.id})/dt
              </div>
              <div className="text-[11px] font-mono font-bold text-ink-900 dark:text-parchment-100">
                {lastChange.ratePerSec.toFixed(3)} /s
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Live Parameter Controls Grid (Unified Physical Inputs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4 border-t border-parchment-200 dark:border-ink-800">
        {data.controls.map((ctrl) => {
          const val = params[ctrl.id] ?? ctrl.defaultValue;
          const isCheckbox = ctrl.min === 0 && ctrl.max === 1 && ctrl.step === 1 && !ctrl.unit;
          return (
            <div
              key={ctrl.id}
              className="p-3 rounded-xl border border-parchment-200 dark:border-ink-800 bg-white/50 dark:bg-ink-950/50 shadow-2xs space-y-1.5 flex flex-col justify-center"
            >
              {isCheckbox ? (
                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono">
                  <input
                    type="checkbox"
                    checked={val > 0.5}
                    onChange={(e) => updateParam(ctrl.id, e.target.checked ? 1 : 0)}
                    className="rounded accent-emerald-600 w-4 h-4"
                  />
                  <span className="font-bold text-ink-900 dark:text-parchment-100 truncate">
                    {ctrl.label}
                  </span>
                </label>
              ) : (
                <>
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="font-semibold text-ink-800 dark:text-parchment-200 truncate pr-2">
                      {ctrl.label}
                    </span>
                    <span className="text-amber-700 dark:text-amber-400 font-bold whitespace-nowrap">
                      {val > 0 && ctrl.min < 0 ? `+${val}` : val} {ctrl.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={ctrl.min}
                    max={ctrl.max}
                    step={ctrl.step}
                    value={val}
                    onChange={(e) => updateParam(ctrl.id, Number(e.target.value))}
                    className="w-full accent-amber-600 dark:accent-amber-400 cursor-pointer h-1.5 bg-parchment-300 dark:bg-ink-700 rounded-lg"
                    aria-label={ctrl.label}
                  />
                </>
              )}
            </div>
          );
        })}
      </div>

      {lastChange && (
        <div className="font-mono text-[10px] text-ink-600 dark:text-ink-400">
          d({lastChange.id})/dt = {lastChange.ratePerSec >= 0 ? "+" : ""}
          {lastChange.ratePerSec.toFixed(2)} /s
        </div>
      )}

      {energy.length > 0 && <EnergyFlowStrip title={data.domain} channels={energy} />}

      {/* Expanded Governing Equations & Deep Pedagogical Theory */}
      {showTheory && (
        <div className="pt-4 border-t border-parchment-200 dark:border-ink-800 space-y-4 animate-[ui-fade-in_200ms_ease-out]">
          {equations.length > 0 ? (
            <ColorizedEquation equation={equations[0]} />
          ) : (
            <>
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-800 dark:text-amber-400 mb-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Governing Equation: {data.equationName}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white dark:bg-ink-900 border border-parchment-300 dark:border-ink-800 text-center font-mono text-sm overflow-x-auto text-ink-950 dark:text-parchment-100 shadow-inner">
                  <LatexRenderer math={data.governingEquation} block />
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-ink-800 dark:text-parchment-200 leading-relaxed font-sans bg-parchment-100/70 dark:bg-ink-900/60 p-3.5 rounded-xl border border-parchment-300 dark:border-ink-800 shadow-2xs">
                <Info className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-ink-950 dark:text-white font-serif">
                    Physical Principle:
                  </strong>{" "}
                  {data.pedagogicalInsight}
                </p>
              </div>
            </>
          )}

          <div className="text-[10px] font-mono text-ink-500 dark:text-ink-400 flex flex-wrap items-center justify-between gap-2 pt-1">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Host calculation:</span>{" "}
              <code className="text-amber-800 dark:text-amber-400 font-bold">
                {data.engineMethod}()
              </code>
            </span>
            <span className="text-ink-500 dark:text-ink-400">
              A patent-specific WASM kernel is identified only by its visual when it is loaded.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
