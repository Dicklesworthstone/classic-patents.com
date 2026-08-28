"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import {
  BARDEEN_REPORTED_SAMPLES,
  type BardeenOperatingSampleNumber,
  stepBardeenPointContact,
} from "@/physics/bardeenPointContactKernel";
import type { MachineState, SemiconductorState } from "@/physics/types";
import {
  globalTransportBus,
  type TapeUpdater,
  useFrankenSimPhysics,
} from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import {
  buildBardeenTransistorModel,
  updateBardeenTransistorKinematics,
} from "./bardeenTransistorModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

type CameraPreset = "iso" | "contacts" | "layer" | "base" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [10, 8, 12], target: [0, 0.5, 0] },
  contacts: { pos: [0, 1.2, 3.2], target: [0, 0.4, 0] },
  layer: { pos: [0, 6.4, 0.1], target: [0, 0, 0] },
  base: { pos: [-5, 2, 4], target: [-2, 0, 1] },
  top: { pos: [0, 12.0, 0.1], target: [0, 0, 0] },
};

export const BardeenTransistor3D = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  const { params, updateParam } = usePatentPhysics("us-2524035-bardeen-transistor");
  const operatingSample = Math.min(3, Math.max(1, Math.round(params.operatingSample ?? 1)));
  const pointSpacingMils = params.pointSpacingMils ?? 2;
  const claim1Active = (params.claim1Active ?? 1) >= 0.5;
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({
    1: claim1Active,
  });
  const sourceState = stepBardeenPointContact({
    operatingSample,
    pointSpacingMils,
    claim1Active: claimStates[1] ?? true,
  });
  const sample = sourceState.sample;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");

  const live = useLiveSimParams({
    carrierDisplaySpeed: sourceState.carrierDisplaySpeed,
    gapStudioUnits: sourceState.gapStudioUnits,
    showCarrierPaths: sourceState.collectorCollectionActive,
    isCutaway,
  });

  // Shared transport tape: only the specification's reported Table I sample
  // values (bias, gains) ride the semi channel; the carrier stream is an
  // authored display mapping carried by the machine pose channel. The
  // updater integrates the display stream so every reader sees one state.
  useFrankenSimPhysics("us-2524035-bardeen-transistor", {
    domain: "semiconductor_carrier",
    refusal: {
      isRefused: !(claimStates[1] ?? true),
      reason: !(claimStates[1] ?? true)
        ? "Contact spacing beyond diffusion length: injected holes recombine before collection"
        : undefined,
    },
    semi: {
      biasVoltageVolts: sample.collectorBiasVolts,
      currentGainAlpha: sample.sourceStatedCurrentGain ?? 0,
      holeDiffusionCoefficientCm2ps: 0,
      chargeTransferEfficiencyPct: 0,
      clockPeriodNs: 0,
      busBandwidthMbps: 0,
      electronVelocityMps: 0,
      relativisticFractionC: 0,
      voltageGain: sample.voltageGainFactor,
      powerGainDb: Number((10 * Math.log10(sample.powerGainFactor)).toFixed(2)),
      collectorCurrentMa: 0,
      gapStudioUnits: sourceState.gapStudioUnits,
      pointGapSvgPx: sourceState.pointGapSvgPx,
    } satisfies SemiconductorState,
  });

  const carrierTravelRef = useRef(0);
  useEffect(() => {
    const integrate: TapeUpdater = (_prev, dt) => {
      carrierTravelRef.current += live.current.carrierDisplaySpeed * dt;
      const active = live.current.showCarrierPaths;
      const machine: MachineState = {
        poseXMeters: 0,
        poseYMeters: 0,
        headingRad: carrierTravelRef.current % (2 * Math.PI),
        modeLabel: active ? "carrier display stream" : "collector collection quenched",
        wheelSpeedMps: 0,
      };
      return { machine };
    };
    globalTransportBus.registerUpdater("us-2524035-bardeen-transistor", integrate, "TS_FALLBACK");
    return () => globalTransportBus.unregisterUpdater("us-2524035-bardeen-transistor");
  }, [live.current.carrierDisplaySpeed, live.current.showCarrierPaths]);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const iso = CAMERA_PRESETS.iso;
    const studio = createThreeStudioScene({
      container,
      cameraPos: iso.pos,
      targetPos: iso.target,
    });
    studioRef.current = studio;

    const { scene, camera, renderer, controls } = studio;

    const { rootGroup, nodes, materials, dispose } = buildBardeenTransistorModel();
    scene.add(rootGroup);

    // Animation Loop: pure consumer of the shared transport tape. The bus
    // updater owns the carrier-stream integration and the tape tick; this
    // loop only paces mesh interpolation with frame delta.
    let reqId: number;
    const transport = globalTransportBus.getTransport("us-2524035-bardeen-transistor");
    let lastMs: number | undefined;

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const dt = lastMs !== undefined ? Math.min((now - lastMs) / 1000, 0.1) : 1 / 60;
      lastMs = now;
      const p = live.current;

      updateBardeenTransistorKinematics(
        nodes,
        materials,
        dt,
        transport.lastFrame.tick,
        p.gapStudioUnits,
        p.carrierDisplaySpeed,
        p.showCarrierPaths,
        p.isCutaway ?? false,
      );

      controls.update();
      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">John Bardeen & Walter Brattain Point-Contact Transistor 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-9.5rem)] sm:max-w-[calc(100%-28rem)] gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["contacts", "Contacts 5 & 6"],
                ["layer", "Layer 3 / Barrier 4"],
                ["base", "Plated Base 2"],
                ["top", "Plan View"],
              ] as [CameraPreset, string][]
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyCameraPreset(preset)}
                className={`min-h-9 px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
                  activeCamera === preset
                    ? "bg-amber-600 text-white shadow-xs font-semibold"
                    : "text-ink-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Top Right Tool Bar */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Solid Crystal" : "Cutaway Crystal"}
            className={`min-h-9 p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm text-xs font-sans flex items-center gap-1 ${
              isCutaway
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">{isCutaway ? "Cutaway" : "Solid"}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`min-h-9 p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showUiOverlay
                ? "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
                : "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
            }`}
            title={showUiOverlay ? "Hide Overlay UI (Clean 3D View)" : "Show Overlay UI"}
            aria-label={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
          >
            {showUiOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                Reported Sample:
              </span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {sample.number}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Input / output bias:</span>
              <span className="text-purple-800 dark:text-purple-400 font-bold">
                +{sample.emitterBiasVolts} / {sample.collectorBiasVolts} V
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Reported voltage / power gain:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {sample.voltageGainFactor}× / {sample.powerGainFactor}×
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Contact Spacing:</span>
              <span className="text-cyan-800 dark:text-cyan-400 font-bold">
                {sourceState.pointSpacingMils} mils
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-parchment-300 dark:border-ink-700 p-3">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-600 dark:text-ink-300">
              Table I operating sample
            </span>
            <div className="grid grid-cols-3 gap-2">
              {([1, 2, 3] as BardeenOperatingSampleNumber[]).map((number) => (
                <button
                  key={number}
                  type="button"
                  aria-pressed={sample.number === number}
                  onClick={() => updateParam("operatingSample", number)}
                  className={`rounded-lg border px-3 py-2 font-mono text-xs transition-colors ${
                    sample.number === number
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-parchment-300 dark:border-ink-700 text-ink-800 dark:text-parchment-200"
                  }`}
                >
                  {BARDEEN_REPORTED_SAMPLES[number].number}
                </button>
              ))}
            </div>
          </div>
          <SensitivitySlider
            id="bardeenPointSpacing"
            patentId="us-2524035-bardeen-transistor"
            paramKey="pointSpacingMils"
            label="Preferred Contact Spacing"
            value={sourceState.pointSpacingMils}
            min={1}
            max={10}
            step={0.5}
            unit=" mils"
            onChange={(val) => updateParam("pointSpacingMils", val)}
            allParams={params}
          />
        </div>

        <ClaimConstraintToggle
          patentId="us-2524035-bardeen-transistor"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) => {
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }));
            updateParam("claim1Active", active ? 1 : 0);
          }}
          className="mt-3"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-2524035-bardeen-transistor"
          params={params}
          className="mt-3"
        />
      </div>

      <StudioKernelChips
        visible={showUiOverlay}
        side="right"
        title="US 2,524,035 source-bounded point-contact model"
        chips={[
          { label: "Reported sample", value: `${sample.number}` },
          { label: "Emitter bias", value: `${sample.emitterBiasVolts}`, unit: "V" },
          { label: "Collector bias", value: `${sample.collectorBiasVolts}`, unit: "V" },
          { label: "Contact gap", value: `${sourceState.pointSpacingMils}`, unit: "mils" },
          { label: "Reported voltage gain", value: `${sample.voltageGainFactor}×` },
          { label: "Reported power gain", value: `${sample.powerGainFactor}×` },
          {
            label: "Claim 1 path",
            value: claim1Active ? "complete" : "removed",
            tone: claim1Active ? "ok" : "warn",
          },
          {
            label: "Kernel",
            value: sourceState.kernelSource,
          },
        ]}
      />
    </div>
  );
});
