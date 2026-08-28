"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { stepGrammeDynamo } from "@/physics/catalogKernels";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { createStudioClock } from "@/physics/tickScheduler";
import type { ElectromagneticsState, MachineState } from "@/physics/types";
import {
  globalTransportBus,
  type TapeUpdater,
  useFrankenSimPhysics,
} from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { buildGrammeDynamoModel, updateGrammeDynamoKinematics } from "./grammeDynamoModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset =
  | "iso"
  | "ring_armature"
  | "collector_rods"
  | "pole_pieces"
  | "bearing_pedestal"
  | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [10.0, 7.5, 11.5], target: [0, 0, 0] },
  ring_armature: { pos: [0, 0.8, 4.2], target: [0, 0, 0] },
  collector_rods: { pos: [-2.8, 1.2, 3.2], target: [-1.4, 0, 0] },
  pole_pieces: { pos: [2.8, 2.5, 3.8], target: [1.2, 0, 0] },
  bearing_pedestal: { pos: [-4.5, 1.0, 2.5], target: [-3.8, -0.6, 0] },
  top: { pos: [0, 12.0, 0.1], target: [0, 0, 0] },
};

const IDLE_EM: ElectromagneticsState = {
  frequencyHz: 0,
  magneticFluxDensityTesla: 0,
  electricFieldVpm: 0,
  phaseAngleRad: 0,
  inductanceHenry: 0,
  capacitanceFarad: 0,
  currentAmperes: 0,
  voltageVolts: 0,
  powerFactor: 0,
  efficiencyPct: 0,
  synchronousRpm: 0,
  slipFraction: 0,
  rotorRpm: 0,
  shaftPowerWatts: 0,
  electricalInputWatts: 0,
};

const IDLE_MACHINE: MachineState = {
  poseXMeters: 0,
  poseYMeters: 0,
  headingRad: 0,
  modeLabel: "ring-armature",
  wheelSpeedMps: 0,
};

export const GrammeDynamo3D = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // The shared parameter map carries an explicitly illustrative shaft rate.
  const { params, updateParam } = usePatentPhysics("us-120057-gramme-dynamo");
  const shaftRate = params.shaftRate ?? 1;
  const gramme = stepGrammeDynamo({ shaftRate });
  const showMagneticFlux = true;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [crateSource, setCrateSource] = useState(genericKernelSource());
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  const live = useLiveSimParams({
    shaftRate,
    inducedEmfIndex: gramme.inducedEmfIndex,
    showMagneticFlux,
    isAudioMuted,
    displayRadPerFrame: gramme.displayRadPerFrame,
    fluxOpacity: gramme.fluxOpacity,
    isCutaway,
    claim1Active: claimStates[1] === false ? 0 : 1,
  });

  // Shared transport tape: the US 120,057 ring-armature state publishes to
  // the patentId-keyed bus so every face reads one deterministic state.
  // The illustrative shaft rate maps to display omega only (rad/frame * 60).
  const ringOmegaRadPerS = gramme.displayRadPerFrame * 60;
  useFrankenSimPhysics("us-120057-gramme-dynamo", {
    domain: "electromagnetics_flux",
    refusal: { isRefused: false },
    em: {
      ...IDLE_EM,
      frequencyHz: ringOmegaRadPerS / (2 * Math.PI),
      synchronousRpm: (ringOmegaRadPerS * 60) / (2 * Math.PI),
      rotorRpm: (ringOmegaRadPerS * 60) / (2 * Math.PI),
    },
    machine: { ...IDLE_MACHINE },
  });

  // One tape-bound integrator (br-ixl): the bus updater owns the ring
  // rotation phase. Refusal freezes the armature at the last legal angle.
  const ringAngleRef = useRef(0);
  const lastLegalAngleRef = useRef(0);
  useEffect(() => {
    const integrate: TapeUpdater = (prev, dt) => {
      const refused = (live.current.claim1Active ?? 1) < 0.5;
      const omega = (live.current.displayRadPerFrame ?? 0) * 60;
      if (!refused) {
        ringAngleRef.current += omega * dt;
        lastLegalAngleRef.current = ringAngleRef.current;
      } else {
        ringAngleRef.current = lastLegalAngleRef.current;
      }
      return {
        refusal: {
          isRefused: refused,
          reason: refused
            ? "Claim 1 drive disengaged: ring armature held at last legal angle"
            : undefined,
        },
        em: {
          ...(prev.em ?? IDLE_EM),
          frequencyHz: omega / (2 * Math.PI),
          synchronousRpm: (omega * 60) / (2 * Math.PI),
          rotorRpm: (omega * 60) / (2 * Math.PI),
        },
        machine: {
          ...IDLE_MACHINE,
          headingRad: ringAngleRef.current,
        },
      };
    };
    globalTransportBus.registerUpdater("us-120057-gramme-dynamo", integrate, "TS_FALLBACK");
    return () => globalTransportBus.unregisterUpdater("us-120057-gramme-dynamo");
  }, [live.current.claim1Active, live.current.displayRadPerFrame]);

  const studioRef = useRef<StudioContext | null>(null);

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
    void ensureGenericWasm().then((next) => setCrateSource(next));
  }, []);

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

    const { rootGroup, nodes, materials, dispose } = buildGrammeDynamoModel();
    scene.add(rootGroup);

    // Animation Loop
    let reqId: number;
    const clock = createStudioClock();

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const { dt, simTimeSec: timeSec } = clock.pump(now);
      const p = live.current;

      updateGrammeDynamoKinematics(
        nodes,
        materials,
        dt,
        timeSec,
        p.shaftRate,
        p.inducedEmfIndex,
        p.displayRadPerFrame,
        p.fluxOpacity,
        p.showMagneticFlux,
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
      <div className="sr-only">Gramme Ring Dynamo 3D</div>
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
                ["ring_armature", "Ring Armature"],
                ["collector_rods", "Junctions & Rubbers"],
                ["pole_pieces", "Field Poles"],
                ["bearing_pedestal", "Pedestals"],
                ["top", "Plan View"],
              ] as [CameraPreset, string][]
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyCameraPreset(preset)}
                className={`px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
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
            title={isCutaway ? "Solid Apparatus" : "Cutaway View"}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm text-xs font-sans flex items-center gap-1 ${
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
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            aria-label={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
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
            className="p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
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
                Induced EMF Index:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {gramme.inducedEmfIndex}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Ring Bobbins:</span>
              <span className="font-bold text-cyan-800 dark:text-cyan-400">36 wound</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Printed Junctions:</span>
              <span className="font-bold text-emerald-800 dark:text-emerald-400">
                {gramme.printedJunctionCount}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Shaft Angular Rate:</span>
              <span className="text-purple-800 dark:text-purple-400 font-bold">
                {shaftRate.toFixed(1)}x
              </span>
            </div>
          </div>
        )}

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="Gramme ring collection"
          chips={[
            { label: "Shaft Rate", value: shaftRate.toFixed(1), unit: "relative" },
            { label: "Induced EMF", value: String(gramme.inducedEmfIndex), unit: "index" },
            { label: "Ring Bobbins", value: "36", unit: "wound" },
            { label: "Junctions", value: String(gramme.printedJunctionCount), unit: "printed" },
            {
              label: "Collection",
              value: String(gramme.collectionContinuityPct),
              unit: "% continuity",
            },
            { label: "Shaft Velocity", value: String(gramme.displayDegPerFrame), unit: "°/frame" },
            {
              label: "Ring crate",
              value: crateSource === "wasm" ? "fs-symmetry" : "ts-cyclic-fallback",
            },
            { label: "h₁", value: gramme.ringHarmonicH1.toFixed(3) },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Illustrative Shaft-Rate Factor
              </span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {shaftRate.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min="0.4"
              max="1.6"
              step="0.1"
              value={shaftRate}
              onChange={(e) => updateParam("shaftRate", Number.parseFloat(e.target.value))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>
        </div>

        <ClaimConstraintToggle
          patentId="us-120057-gramme-dynamo"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-120057-gramme-dynamo"
          params={params}
          className="mt-3"
        />
      </div>
    </div>
  );
});
