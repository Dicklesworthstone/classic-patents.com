"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX, Waves } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepEricssonPropeller } from "@/physics/catalogKernels";
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
import {
  buildEricssonPropellerModel,
  updateEricssonPropellerKinematics,
} from "./ericssonPropellerModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "propeller_drum" | "helical_blades" | "sternpost" | "rudder" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  // Pull the default reader view clear of the camera toolbar: the tall
  // sternpost stays visible while the source-named rudder remains beside the
  // telemetry rail rather than underneath it.
  iso: { pos: [11.5, 8.0, 13.5], target: [1.4, 0.35, 0] },
  propeller_drum: { pos: [0, 0.5, 4.2], target: [0, 0, 0] },
  helical_blades: { pos: [2.5, 1.8, 3.0], target: [0.5, 0, 0] },
  sternpost: { pos: [-3.2, 1.2, 3.5], target: [-1.5, 0, 0] },
  rudder: { pos: [4.2, 0.8, 2.5], target: [2.8, 0, 0] },
  top: { pos: [0, 11.0, 0.1], target: [0, 0, 0] },
};

const IDLE_MACHINE: MachineState = {
  poseXMeters: 0,
  poseYMeters: 0,
  headingRad: 0,
  modeLabel: "spiral-propeller-shaft",
  wheelSpeedMps: 0,
};

export function EricssonPropeller3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const [showWake, setShowWake] = useState<boolean>(true);

  // Hydrodynamic & Marine Propulsion Parameters
  const { params, updateParam } = usePatentPhysics("us-588-ericsson-propeller");
  const shaftRpm = (params.shaftRpm as number) ?? 120;
  const bladeCount = (params.bladeCount as number) ?? 8;
  const pitchAngleDeg =
    (params.bladePitchAngleDeg as number) ?? (params.pitchAngleDeg as number) ?? 35;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const crateSource = useGenericWasmSource();
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  const ericson = stepEricssonPropeller({
    shaftRpm,
    bladePitchAngleDeg: pitchAngleDeg,
  });

  const live = useLiveSimParams({
    shipSpeedKnots: ericson.shipSpeedKnots,
    shaftRpm,
    bladeCount,
    pitchAngleDeg,
    isAudioMuted,
    isCutaway,
    showWake,
    thrustKn: ericson.thrustKn,
    efficiencyPct: ericson.propulsiveEfficiencyPct,
    slipRatio: ericson.slipFraction,
    shaftOmegaRadPerS: ericson.shaftOmegaRadPerS,
    wakeSwirlCoeff: ericson.wakeSwirlCoeff,
    wakeOpacity: ericson.wakeOpacity,
    wakeCrateDensity: ericson.wakeCrateDensity,
    claim1Active: claimStates[1] === false ? 0 : 1,
  });

  // Shared transport tape: the US 588 shaft pose publishes to the
  // patentId-keyed bus so every face reads one deterministic state.
  useFrankenSimPhysics("us-588-ericsson-propeller", {
    domain: "solid_mechanics",
    refusal: { isRefused: false },
    machine: {
      ...IDLE_MACHINE,
      wheelSpeedMps: ericson.shipSpeedKnots * 0.514444,
    },
  });

  // One tape-bound integrator (br-ixl): the bus updater owns the shaft
  // rotation phase. Refusal freezes the shaft at the last legal angle.
  const shaftAngleRef = useRef(0);
  const lastLegalAngleRef = useRef(0);
  useEffect(() => {
    const integrate: TapeUpdater = (_prev, dt) => {
      const refused = (live.current.claim1Active ?? 1) < 0.5;
      if (!refused) {
        shaftAngleRef.current += (live.current.shaftOmegaRadPerS ?? 0) * dt;
        lastLegalAngleRef.current = shaftAngleRef.current;
      } else {
        shaftAngleRef.current = lastLegalAngleRef.current;
      }
      return {
        refusal: {
          isRefused: refused,
          reason: refused
            ? "Claim 1 engine stopped: spiral shaft held at last legal angle"
            : undefined,
        },
        machine: {
          ...IDLE_MACHINE,
          headingRad: shaftAngleRef.current,
          wheelSpeedMps: (live.current.shipSpeedKnots ?? 0) * 0.514444,
        },
      };
    };
    const unregister = globalTransportBus.registerUpdater(
      "us-588-ericsson-propeller",
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

    // Build authentic procedural model
    const model = buildEricssonPropellerModel();
    scene.add(model.rootGroup);

    // Animation Loop
    let reqId: number;

    const clock = createStudioClock();

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const { dt } = clock.pump(now);
      const p = live.current;

      updateEricssonPropellerKinematics(
        model,
        dt,
        p.shaftOmegaRadPerS,
        Math.min(1, (p.wakeOpacity ?? 0.65) * (0.45 + (p.wakeCrateDensity ?? 0))),
        p.pitchAngleDeg ?? 0,
        p.wakeSwirlCoeff ?? 1.0,
        p.showWake ?? true,
        p.isCutaway,
      );

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
      <div className="sr-only">Ericsson Spiral-Plate Reader Aid 3D</div>
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
                ["propeller_drum", "Propeller Drum"],
                ["helical_blades", "Helical Blades"],
                ["sternpost", "Sternpost"],
                ["rudder", "Rudder"],
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
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Switch to Solid Hull" : "Switch to Hull Cutaway"}
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
            onClick={() => setShowWake(!showWake)}
            title={showWake ? "Hide Wake Streamlines" : "Show Wake Streamlines"}
            className={`min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showWake
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            <Waves className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="min-h-9 p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`min-h-9 p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showUiOverlay
                ? "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
                : "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
            }`}
            title={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
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
                Model Speed:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {Math.round(shaftRpm)} RPM
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Spiral Advance:</span>
              <span className="font-bold text-cyan-800 dark:text-cyan-400">3 diameters/turn</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Shaft Relation:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                b opp a (slower)
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Plate Angle:</span>
              <span className="font-bold text-purple-800 dark:text-purple-400">
                {pitchAngleDeg}°
              </span>
            </div>
          </div>
        )}

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="Source-bounded reader aid"
          chips={[
            { label: "Source hoops", value: "2", unit: "broad hoops" },
            {
              label: "Source spiral",
              value: "3",
              unit: "diameters / turn",
            },
            { label: "Source shafts", value: "b opposite a", unit: "b slower" },
            { label: "Source casing", value: "about 1/8", unit: "inch clearance" },
            { label: "Display motion", value: String(Math.round(shaftRpm)), unit: "model rpm" },
            {
              label: "Wake crate",
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
                Illustrative Shaft Motion
              </span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {Math.round(shaftRpm)} RPM
              </span>
            </div>
            <input
              type="range"
              aria-label="Illustrative shaft motion"
              min="40"
              max="240"
              step="10"
              value={shaftRpm}
              onChange={(e) => updateParam("shaftRpm", Number.parseInt(e.target.value, 10))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Illustrative Plate Angle
              </span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {pitchAngleDeg}°
              </span>
            </div>
            <input
              type="range"
              aria-label="Illustrative plate angle"
              min="20"
              max="55"
              step="1"
              value={pitchAngleDeg}
              onChange={(e) =>
                updateParam("bladePitchAngleDeg", Number.parseInt(e.target.value, 10))
              }
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>
        </div>

        <ClaimConstraintToggle
          patentId="us-588-ericsson-propeller"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-588-ericsson-propeller"
          params={params}
          className="mt-3"
        />
      </div>
    </div>
  );
}
