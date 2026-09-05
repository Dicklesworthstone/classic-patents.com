"use client";

import { Gauge } from "lucide-react";
import type { CoupleEdge } from "@/physics/coupleGraph";
import { qtyDimension } from "@/physics/qty";
import type { SensitivityResult } from "@/physics/sensitivityKernel";
import type { PhysicsMetric } from "@/physics/telemetryData";
import { getProvenanceLabel } from "@/physics/telemetryProvenance";
import type { ParamChange } from "@/physics/usePatentPhysics";

interface PhysicsTelemetryMetricsProps {
  coupleEdges: CoupleEdge[];
  lastChange: ParamChange | null;
  metrics: PhysicsMetric[];
  sliderSensitivity: SensitivityResult | null;
}

function metricColors(metric: PhysicsMetric) {
  if (metric.badgeColor === "rose") {
    return {
      bar: "bg-rose-600 dark:bg-rose-500",
      value: "text-rose-700 dark:text-rose-400",
    };
  }
  if (metric.badgeColor === "emerald") {
    return {
      bar: "bg-emerald-600 dark:bg-emerald-500",
      value: "text-emerald-700 dark:text-emerald-400",
    };
  }
  if (metric.badgeColor === "cyan" || metric.badgeColor === "indigo") {
    return {
      bar: "bg-sky-600 dark:bg-sky-500",
      value: "text-sky-700 dark:text-sky-400",
    };
  }
  return {
    bar: "bg-amber-600 dark:bg-amber-500",
    value: "text-amber-800 dark:text-amber-400",
  };
}

function PhysicsTelemetryMetricCard({ metric }: { metric: PhysicsMetric }) {
  const colors = metricColors(metric);
  const provenance = metric.provenance ? getProvenanceLabel(metric.provenance) : null;

  return (
    <div className="p-3.5 rounded-xl border border-parchment-300/80 dark:border-ink-800 bg-white dark:bg-ink-900/90 text-ink-900 dark:text-parchment-100 flex flex-col justify-between shadow-2xs hover:border-amber-700/30 dark:hover:border-ink-700 transition-colors">
      <div className="flex min-w-0 items-start justify-between gap-1">
        <span
          className="text-[10px] uppercase font-mono tracking-wider font-semibold leading-tight break-words text-ink-500 dark:text-ink-400"
          title={metric.label}
        >
          {metric.label}
        </span>
        <div className="flex items-center gap-1">
          {provenance ? (
            <span
              className={`inline-block px-1 py-0.2 rounded text-[8px] font-mono border leading-none ${provenance.badgeClass}`}
              title={provenance.description}
            >
              {provenance.shortLabel}
            </span>
          ) : null}
          <Gauge className="w-3.5 h-3.5 text-amber-700/60 dark:text-amber-400/60 shrink-0" />
        </div>
      </div>

      <div className="flex min-w-0 flex-wrap items-baseline gap-1.5 my-2">
        <span
          className={`min-w-0 break-words font-mono text-base sm:text-lg font-extrabold tracking-tight ${colors.value}`}
        >
          {metric.value}
        </span>
        <span className="break-words font-mono text-[10px] text-ink-500 dark:text-ink-400 font-medium">
          {metric.unit}
          <span className="ml-1 opacity-70">[{qtyDimension(metric.unit)}]</span>
        </span>
      </div>

      {typeof metric.progressPct === "number" ? (
        <div className="w-full bg-parchment-200 dark:bg-ink-800 h-1.5 rounded-full overflow-hidden mt-0.5">
          <div
            className={`h-full ${colors.bar} transition-[width] duration-200 rounded-full`}
            style={{ width: `${Math.max(3, Math.min(100, metric.progressPct))}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}

function CouplingSummary({
  coupleEdges,
  lastChange,
  sliderSensitivity,
}: Omit<PhysicsTelemetryMetricsProps, "metrics">) {
  if (coupleEdges.length === 0 && !sliderSensitivity) return null;

  return (
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
        <div
          className="min-w-0 rounded-lg border border-parchment-300 dark:border-ink-800 bg-white/80 dark:bg-ink-900/80 px-2.5 py-1.5"
          data-testid="parameter-sensitivity"
          title={sliderSensitivity.interpretation}
        >
          <div className="text-[11px] font-semibold text-ink-900 dark:text-parchment-100">
            {sliderSensitivity.metricName}
          </div>
          <div className="text-[9px] tracking-wider font-mono text-ink-500 dark:text-ink-400">
            {sliderSensitivity.derivativeSymbol} (host sensitivity)
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
  );
}

export function PhysicsTelemetryMetrics({
  coupleEdges,
  lastChange,
  metrics,
  sliderSensitivity,
}: PhysicsTelemetryMetricsProps) {
  return (
    <>
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 10rem), 1fr))" }}
      >
        {metrics.map((metric) => (
          <PhysicsTelemetryMetricCard key={metric.label} metric={metric} />
        ))}
      </div>
      <CouplingSummary
        coupleEdges={coupleEdges}
        lastChange={lastChange}
        sliderSensitivity={sliderSensitivity}
      />
    </>
  );
}
