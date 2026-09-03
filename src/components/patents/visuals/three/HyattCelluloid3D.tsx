"use client";

import { Camera } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { stepHyattCelluloid } from "@/physics/catalogKernels";
import { createStudioClock } from "@/physics/tickScheduler";
import type { ThermodynamicsState } from "@/physics/types";
import {
  globalTransportBus,
  type TapeUpdater,
  useFrankenSimPhysics,
} from "@/physics/useFrankenSimPhysics";
import { useGenericWasmSource } from "@/physics/useGenericWasmSource";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { buildHyattCelluloidModel, updateHyattCelluloidKinematics } from "./hyattCelluloidModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { StudioOverlayActionToolbar } from "./StudioOverlayActionToolbar";
import { createStandardStudioOverlayActions } from "./studioOverlayActions";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

const IDLE_THERMO: ThermodynamicsState = {
  temperatureCelsius: 135,
  temperatureKelvin: 408.15,
  pressureAtm: 1,
  partialPressureButaneAtm: 0,
  heatInputWatts: 0,
  coolingPowerWatts: 0,
  coefficientOfPerformance: 0,
  blackbodyRadiantPowerWatts: 0,
  fluidFlowVelocityMps: 0,
};

type CameraPreset =
  | "iso"
  | "hydraulic_ram"
  | "steam_jacket"
  | "nozzle_die"
  | "billiard_balls"
  | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [10.5, 7.5, 12.0], target: [0, 0, 0] },
  hydraulic_ram: { pos: [-3.5, 2.0, 4.5], target: [-2.0, 0, 0] },
  steam_jacket: { pos: [0, 1.2, 4.2], target: [0, 0, 0] },
  nozzle_die: { pos: [3.8, 1.5, 3.5], target: [2.5, -0.4, 0] },
  billiard_balls: { pos: [4.8, -0.5, 2.5], target: [4.2, -1.6, 0] },
  top: { pos: [0, 12.5, 0.1], target: [0, 0, 0] },
};

export const HyattCelluloid3D = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // Polymer Extrusion & Thermal Parameters
  const { params, updateParam } = usePatentPhysics("us-105338-hyatt-celluloid");
  const steamTempC = (params.steamTempC as number) ?? 135;
  const hydraulicPressureMpa =
    typeof params.hydraulicPressureMpa === "number"
      ? (params.hydraulicPressureMpa as number)
      : typeof params.ramPressurePsi === "number"
        ? (params.ramPressurePsi as number) * 0.00689476
        : 10;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const crateSource = useGenericWasmSource();
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  const hyatt = stepHyattCelluloid({
    steamTempC,
    hydraulicPressureMpa,
  });

  const live = useLiveSimParams({
    steamTempC,
    hydraulicPressureMpa,
    isAudioMuted,
    isCutaway,
    viscosityPaS: hyatt.viscosityPaS,
    ramHz: hyatt.ramHz,
    ramStrokeStudio: hyatt.ramStrokeStudio,
    isMelted: hyatt.isMelted,
  });

  // Shared transport tape: the celluloid rheology kernel step is owned by the
  // bus updater (TS_FALLBACK); the render loop keeps its own kinematics.
  useFrankenSimPhysics("us-105338-hyatt-celluloid", {
    domain: "thermodynamics_transport",
    refusal: { isRefused: false },
    thermo: {
      ...IDLE_THERMO,
      temperatureCelsius: steamTempC,
      temperatureKelvin: steamTempC + 273.15,
      fluidFlowVelocityMps: Number((hyatt.extrusionRateCmPerMin / 6000).toFixed(5)),
    },
  });

  useEffect(() => {
    const integrate: TapeUpdater = (prev) => {
      const s = stepHyattCelluloid({
        steamTempC: live.current.steamTempC,
        hydraulicPressureMpa: live.current.hydraulicPressureMpa,
      });
      return {
        refusal: { isRefused: false },
        thermo: {
          ...(prev.thermo ?? IDLE_THERMO),
          temperatureCelsius: live.current.steamTempC,
          temperatureKelvin: live.current.steamTempC + 273.15,
          fluidFlowVelocityMps: Number((s.extrusionRateCmPerMin / 6000).toFixed(5)),
        },
      };
    };
    const unregister = globalTransportBus.registerUpdater(
      "us-105338-hyatt-celluloid",
      integrate,
      "TS_FALLBACK",
    );
    return unregister;
  }, [live]);
  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const toggleSound = () => {
    toggleEngine(() => {
      soundEngine.playSwitchClick();
    });
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

    const { rootGroup, nodes, materials, dispose } = buildHyattCelluloidModel();
    scene.add(rootGroup);

    // Animation Loop
    let reqId: number;
    const clock = createStudioClock();

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const { dt, simTimeSec: timeSec } = clock.pump(now);
      const p = live.current;

      updateHyattCelluloidKinematics(
        nodes,
        materials,
        dt,
        timeSec,
        p.steamTempC,
        p.viscosityPaS,
        p.isMelted ?? true,
        p.ramHz,
        p.ramStrokeStudio,
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
      <div className="sr-only">Hyatt Celluloid Press 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-9.5rem)] sm:max-w-[calc(100%-28rem)] gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3.5 h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["hydraulic_ram", "Hydraulic Ram"],
                ["steam_jacket", "Steam Jacket"],
                ["nozzle_die", "Extrusion Die"],
                ["billiard_balls", "Billiard Balls"],
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

        {/* Top Controls */}
        <StudioOverlayActionToolbar
          actions={createStandardStudioOverlayActions({
            isCutaway,
            onToggleCutaway: () => setIsCutaway(!isCutaway),
            cutawayTitle: isCutaway ? "Solid Frame" : "Cutaway Machine View",
            isAudioMuted,
            onToggleSound: toggleSound,
            showUiOverlay,
            onToggleUiOverlay: () => setShowUiOverlay(!showUiOverlay),
            overlayTitle: showUiOverlay ? "Hide Overlay UI (Clean 3D View)" : "Show Overlay UI",
            onResetCamera: () => applyCameraPreset("iso"),
          })}
        />

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                Steam Temp:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">{steamTempC} °C</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Ram Pressure:</span>
              <span className="font-bold text-cyan-800 dark:text-cyan-400">
                {hydraulicPressureMpa.toFixed(1)} MPa
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Melt State:</span>
              <span
                className={`font-bold ${hyatt.isMelted ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}`}
              >
                {hyatt.isMelted ? "PLASTIC MELT" : "RIGID SOLID"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Extrusion Rate:</span>
              <span className="font-bold text-purple-800 dark:text-purple-400">
                {hyatt.extrusionRateCmPerMin.toFixed(1)} cm/min
              </span>
            </div>
          </div>
        )}

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="Hyatt hydraulic polymer press kinematics"
          chips={[
            {
              label: "Steam Temp",
              value: `${steamTempC}`,
              unit: "°C",
              tone: hyatt.isMelted ? "ok" : "warn",
            },
            { label: "Hydraulic Ram", value: hydraulicPressureMpa.toFixed(0), unit: "MPa" },
            { label: "Melt Viscosity", value: `${hyatt.viscosityPaS}`, unit: "Pa·s" },
            {
              label: "Consolidation ρ",
              value: hyatt.consolidationDensityGPerCm3.toFixed(2),
              unit: "g/cm³",
            },
            { label: "Transparency", value: `${hyatt.transparencyPct}`, unit: "%" },
            {
              label: "Extrusion Rate",
              value: hyatt.isMelted ? hyatt.extrusionRateCmPerMin.toFixed(1) : "0.0",
              unit: "cm/min",
              tone: hyatt.isMelted ? "ok" : "warn",
            },
            { label: "Ram Stroke Freq", value: hyatt.ramHz.toFixed(2), unit: "Hz" },
            {
              label: "Melt crate",
              value: crateSource === "wasm" ? "fs-lbm" : "ts-fluid-fallback",
            },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Steam Jacket Temperature
              </span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {steamTempC} °C
              </span>
            </div>
            <input
              type="range"
              aria-label="Steam jacket temperature"
              min="70"
              max="160"
              step="5"
              value={steamTempC}
              onChange={(e) => updateParam("steamTempC", Number.parseInt(e.target.value, 10))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Hydraulic Ram Pressure
              </span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {hydraulicPressureMpa.toFixed(0)} MPa
              </span>
            </div>
            <input
              type="range"
              aria-label="Hydraulic ram pressure"
              min="4"
              max="25"
              step="1"
              value={hydraulicPressureMpa}
              onChange={(e) =>
                updateParam("hydraulicPressureMpa", Number.parseInt(e.target.value, 10))
              }
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>
        </div>

        <ClaimConstraintToggle
          patentId="us-105338-hyatt-celluloid"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-105338-hyatt-celluloid"
          params={params}
          className="mt-3"
        />
      </div>
    </div>
  );
});
