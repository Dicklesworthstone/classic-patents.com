"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CoupledDynamicsStrip } from "@/components/patents/CoupledDynamicsStrip";
import { EnergyFlowStrip } from "@/components/patents/EnergyFlowStrip";
import { coupleEdgesFor } from "@/physics/coupleGraph";
import { energyChannelsFor } from "@/physics/energyChannels";
import { computeParameterSensitivity } from "@/physics/sensitivityKernel";
import { usePatentRuntimeTick } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import type { ColorizedEquation as ColorizedEquationType } from "@/types/equation";
import { soundEngine } from "@/utils/soundEngine";
import { PhysicsTelemetryBadgeHeader } from "./PhysicsTelemetryBadgeHeader";
import { PhysicsTelemetryControls } from "./PhysicsTelemetryControls";
import { PhysicsTelemetryMetrics } from "./PhysicsTelemetryMetrics";
import { PhysicsTelemetryTheory } from "./PhysicsTelemetryTheory";

interface PhysicsTelemetryBadgeProps {
  patentId: string;
  /** Per-patent colorized equations, resolved server-side and passed down. */
  equations: ColorizedEquationType[];
  defaultExpanded?: boolean;
}

export function PhysicsTelemetryBadge({
  patentId,
  equations,
  defaultExpanded = false,
}: PhysicsTelemetryBadgeProps) {
  const {
    meta: data,
    effectiveParams,
    metrics: parameterMetrics,
    params,
    updateParam,
    lastChange,
    resetParams,
  } = usePatentPhysics(patentId);
  const runtimeTick = usePatentRuntimeTick(patentId, 6, data?.refreshFromRuntimeTape === true);
  const liveMetrics = useMemo(() => {
    if (!data?.refreshFromRuntimeTape) return parameterMetrics;
    void runtimeTick;
    return data.computeMetrics(effectiveParams);
  }, [data, effectiveParams, parameterMetrics, runtimeTick]);
  const [showTheory, setShowTheory] = useState(defaultExpanded);

  const handleReset = useCallback(() => {
    resetParams();
    data?.resetRuntimeTape?.();
    if (typeof window !== "undefined") {
      soundEngine.playSwitchClick();
    }
  }, [data, resetParams]);

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
    <div
      className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50/90 dark:bg-ink-950/90 p-4 sm:p-5 text-xs font-sans text-ink-800 dark:text-parchment-200 shadow-sm space-y-4"
      data-testid="physics-telemetry-badge"
      data-patent-id={patentId}
      data-kernel-method={data.engineMethod}
      data-last-change={lastChange?.id ?? ""}
      data-telemetry-envelope={liveEnvelope}
    >
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {data.domainTitle}. {announcedEnvelope}
      </div>

      <PhysicsTelemetryBadgeHeader
        domainTitle={data.domainTitle}
        onReset={handleReset}
        onToggleTheory={() => setShowTheory((value) => !value)}
        showTheory={showTheory}
      />

      <PhysicsTelemetryMetrics
        coupleEdges={coupleEdges}
        lastChange={lastChange}
        metrics={liveMetrics}
        sliderSensitivity={sliderSensitivity}
      />

      <PhysicsTelemetryControls
        controls={data.controls}
        lastChange={lastChange}
        onUpdateParam={updateParam}
        params={params}
        patentId={patentId}
      />

      {energy.length > 0 && <EnergyFlowStrip title={data.domain} channels={energy} />}
      {coupleEdges.length > 0 && <CoupledDynamicsStrip edges={coupleEdges} />}

      {showTheory ? (
        <PhysicsTelemetryTheory
          engineMethod={data.engineMethod}
          equationName={data.equationName}
          equations={equations}
          governingEquation={data.governingEquation}
          pedagogicalInsight={data.pedagogicalInsight}
        />
      ) : null}
    </div>
  );
}
