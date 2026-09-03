"use client";

import { Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { stepCorlissEngine } from "@/physics/catalogKernels";
import { createStudioClock } from "@/physics/tickScheduler";
import type { MachineState } from "@/physics/types";
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
import { buildCorlissEngineModel, updateCorlissEngineKinematics } from "./corlissSteamEngineModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { StudioOverlayActionToolbar } from "./StudioOverlayActionToolbar";
import { createStandardStudioOverlayActions } from "./studioOverlayActions";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "wrist_plate" | "dashpots" | "flywheel" | "governor" | "top";
type CameraConfig = { pos: [number, number, number]; target: [number, number, number] };

const COMPACT_STUDIO_MAX_WIDTH_PX = 640;

const CAMERA_PRESETS: Record<CameraPreset, CameraConfig> = {
  iso: { pos: [12.0, 9.0, 13.0], target: [0, 0, 0] },
  wrist_plate: { pos: [-2.0, 1.8, 4.5], target: [-1.8, 0.4, 0] },
  dashpots: { pos: [-2.2, -0.8, 3.8], target: [-2.0, -1.8, 0] },
  flywheel: { pos: [4.5, 2.5, 6.0], target: [3.8, 0.5, 0] },
  governor: { pos: [-1.0, 3.2, 4.0], target: [-1.0, 1.8, 1.2] },
  top: { pos: [0, 14.0, 0.1], target: [0, 0, 0] },
};

// The full girder engine is wider than a portrait phone's default isometric
// frustum. Pull back only the compact overview; named close-up presets retain
// their inspection scale after the visitor deliberately chooses them.
const MOBILE_CAMERA_PRESETS: Partial<Record<CameraPreset, CameraConfig>> = {
  iso: { pos: [17.0, 10.5, 22.5], target: [0, -0.5, 0] },
};

function resolveCameraPreset(preset: CameraPreset, viewportWidth: number): CameraConfig {
  if (viewportWidth <= COMPACT_STUDIO_MAX_WIDTH_PX) {
    return MOBILE_CAMERA_PRESETS[preset] ?? CAMERA_PRESETS[preset];
  }
  return CAMERA_PRESETS[preset];
}

export function CorlissSteamEngine3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);

  // Thermodynamic Simulation Parameters
  const { params, updateParam } = usePatentPhysics("us-6162-corliss-steam-engine");
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const engineRpm = params.engineRpm ?? 65;
  const steamPressurePsi = params.steamPressurePsi ?? 100;
  const cutoffPct = params.cutoffPct ?? 25;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const crateSource = useGenericWasmSource();
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  const corliss = stepCorlissEngine({ steamPressurePsi, engineRpm, cutoffPct });
  const indicatedHp = corliss.indicatedHp;
  const thermalEfficiencyPct = corliss.thermalEfficiencyPct.toFixed(1);

  const live = useLiveSimParams({
    engineRpm,
    steamPressurePsi,
    cutoffPct,
    isAudioMuted,
    isCutaway,
    indicatedHp,
    thermalEfficiencyPct: Number(thermalEfficiencyPct),
    crankOmegaRadPerS: corliss.crankOmegaRadPerS,
    governorOmegaRadPerS: corliss.governorOmegaRadPerS,
    govSpread: corliss.govSpread,
    wristAmp: corliss.wristAmp,
    wristLeadRad: corliss.wristLeadRad,
    crankWrapRad: corliss.crankWrapRad,
  });

  // Shared transport tape: one bus-owned integrator steps the crank angle
  // from the kernel ω; the pose publishes on the machine channel so any
  // reader sees one engine state. Accumulator lives in a ref so
  // re-registering on control changes never snaps the crank back to TDC.
  useFrankenSimPhysics("us-6162-corliss-steam-engine", {
    domain: "thermodynamics_transport",
    refusal: { isRefused: false },
  });

  const crankPhaseRef = useRef(0);
  useEffect(() => {
    const integrate: TapeUpdater = (_prev, dt) => {
      crankPhaseRef.current =
        (crankPhaseRef.current + live.current.crankOmegaRadPerS * dt) %
        Math.max(live.current.crankWrapRad, 1e-6);
      const machine: MachineState = {
        poseXMeters: 0,
        poseYMeters: 0,
        headingRad: crankPhaseRef.current,
        modeLabel: "governor-tripped variable cut-off",
        wheelSpeedMps: 0,
      };
      return { machine };
    };
    const unregister = globalTransportBus.registerUpdater(
      "us-6162-corliss-steam-engine",
      integrate,
      "TS_FALLBACK",
    );
    return unregister;
  }, [live]);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = resolveCameraPreset(preset, containerRef.current?.clientWidth ?? 0);
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

    const iso = resolveCameraPreset("iso", container.clientWidth);
    const studio = createThreeStudioScene({
      container,
      cameraPos: iso.pos,
      targetPos: iso.target,
    });
    studioRef.current = studio;

    const { scene, camera, renderer, controls } = studio;

    // Build procedural 3D model
    const model = buildCorlissEngineModel();
    scene.add(model.rootGroup);

    // Animation Loop
    let reqId: number;
    const clock = createStudioClock();

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const { dt } = clock.pump(now);
      const p = live.current;

      // Pure consumer of the shared transport tape: the crank angle is
      // integrated by the bus updater from the kernel ω.
      const crankAngleRad = crankPhaseRef.current;

      updateCorlissEngineKinematics(model, {
        crankAngleRad,
        governorOmegaRadPerS: p.governorOmegaRadPerS,
        cutoffFraction: p.cutoffPct / 100,
        isCutaway: p.isCutaway,
        dt,
        govSpread: p.govSpread,
        wristAmp: p.wristAmp,
        wristLeadRad: p.wristLeadRad,
      });

      // Periodic audio tick on valve disengagement trip
      if (!p.isAudioMuted && Math.sin(crankAngleRad) > 0.98) {
        soundEngine.playSwitchClick();
      }

      controls.update();
      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      model.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Corliss Steam Engine 3D</div>
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
                ["wrist_plate", "Wrist Plate"],
                ["dashpots", "Dashpots"],
                ["flywheel", "Flywheel"],
                ["governor", "Governor"],
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

        <StudioOverlayActionToolbar
          actions={createStandardStudioOverlayActions({
            isCutaway,
            onToggleCutaway: () => setIsCutaway(!isCutaway),
            cutawayTitle: isCutaway ? "Switch to Solid Engine" : "Switch to Cylinder Cutaway",
            isAudioMuted,
            onToggleSound: toggleSound,
            showUiOverlay,
            onToggleUiOverlay: () => setShowUiOverlay(!showUiOverlay),
            overlayTitle: showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI",
            onResetCamera: () => applyCameraPreset("iso"),
          })}
        />

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                Indicated Power:
              </span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {indicatedHp} IHP
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Steam Pressure:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {steamPressurePsi} psi
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Cutoff Point:</span>
              <span className="text-cyan-800 dark:text-cyan-400 font-bold">
                {cutoffPct}% stroke
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Engine Speed:</span>
              <span className="text-purple-800 dark:text-purple-400 font-bold">
                {engineRpm} RPM
              </span>
            </div>
          </div>
        )}

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="Corliss dashpot trip"
          chips={[
            { label: "Steam", value: String(steamPressurePsi), unit: "psi" },
            { label: "Cutoff", value: String(cutoffPct), unit: "%" },
            { label: "IHP", value: String(indicatedHp), unit: "hp" },
            { label: "η", value: thermalEfficiencyPct, unit: "%" },
            { label: "P", value: String(corliss.boilerMpa), unit: "MPa" },
            { label: "r_exp", value: String(corliss.expansionRatio) },
            { label: "ω", value: corliss.crankOmegaRadPerS.toFixed(2), unit: "rad/s" },
            {
              label: "Valve crate",
              value: crateSource === "wasm" ? "fs-symmetry" : "ts-cyclic-fallback",
            },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SensitivitySlider
            id="steamPressure"
            patentId="us-6162-corliss-steam-engine"
            paramKey="boilerPressurePsi"
            label="Boiler Steam Pressure"
            value={steamPressurePsi}
            min={40}
            max={180}
            step={5}
            onChange={(val) => updateParam("steamPressurePsi", val)}
            allParams={params}
          />

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Engine Speed</span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {engineRpm} RPM
              </span>
            </div>
            <input
              type="range"
              aria-label="Engine speed"
              min="20"
              max="120"
              step="5"
              value={engineRpm}
              onChange={(e) => updateParam("engineRpm", Number.parseInt(e.target.value, 10))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>

          <SensitivitySlider
            id="cutoffPct"
            patentId="us-6162-corliss-steam-engine"
            paramKey="cutoffPct"
            label="Governor Cutoff Fraction"
            value={cutoffPct}
            min={10}
            max={60}
            step={5}
            onChange={(val) => updateParam("cutoffPct", val)}
            allParams={params}
          />
        </div>

        <ClaimConstraintToggle
          patentId="us-6162-corliss-steam-engine"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-6162-corliss-steam-engine"
          params={params}
          className="mt-3"
        />
      </div>
    </div>
  );
}
