"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { stepGliddenBarbedWire } from "@/physics/catalogKernels";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { createStudioClock } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import {
  buildGliddenBarbedWireModel,
  updateGliddenBarbedWireKinematics,
} from "./gliddenBarbedWireModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "barb_lock" | "twisting_helix" | "takeup_drum" | "feed_spools" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [9.5, 6.5, 10.5], target: [0, 0, 0] },
  barb_lock: { pos: [0, 1.2, 3.2], target: [0, 0.4, 0] },
  twisting_helix: { pos: [-2.5, 1.8, 3.5], target: [-1.0, 0, 0] },
  takeup_drum: { pos: [3.5, 2.0, 4.0], target: [2.2, 0, 0] },
  feed_spools: { pos: [-4.8, 2.0, 3.2], target: [-3.8, 0, -1.2] },
  top: { pos: [0, 11.5, 0.1], target: [0, 0, 0] },
};

export const GliddenBarbedWire3D = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // Wire Manufacturing Parameters
  const { params, updateParam } = usePatentPhysics("us-157124-glidden-barbed-wire");
  const wireTensionN = (params.wireTensionN as number) ?? 650;
  const twistsPerFoot = (params.twistsPerFoot as number) ?? 5;
  const animalPushForceN = (params.animalPushForceN as number) ?? 120;
  const barbSpacingInches = (params.barbSpacingInches as number) ?? 5.0;
  const glidden = stepGliddenBarbedWire({
    wireTensionN,
    twistsPerFoot,
    animalPushForceN,
    barbSpacingInches,
  });
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  const live = useLiveSimParams({
    machineRpm: glidden.machineRpm,
    barbSpacingInches,
    isAudioMuted,
    sagCm: glidden.sagCm,
    isLocked: glidden.isLocked,
    flyerOmegaRadPerS: glidden.flyerOmegaRadPerS,
    reelOmegaRadPerS: glidden.reelOmegaRadPerS,
    isCutaway,
  });

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

    const { rootGroup, nodes, materials, dispose } = buildGliddenBarbedWireModel();
    scene.add(rootGroup);

    // Animation Loop
    let reqId: number;
    const clock = createStudioClock();

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      const { dt, simTimeSec: timeSec } = clock.pump(now);
      const p = live.current;

      updateGliddenBarbedWireKinematics(
        nodes,
        materials,
        dt,
        timeSec,
        p.flyerOmegaRadPerS,
        p.reelOmegaRadPerS,
        p.isLocked,
        p.isCutaway,
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
      <div className="sr-only">
        Glidden Barbed Wire Machine 3D (Joseph F. Glidden twisted wire-fence assembly)
      </div>
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
                ["barb_lock", "Barb Locking"],
                ["twisting_helix", "Twisted Strands"],
                ["takeup_drum", "Wire Ends"],
                ["feed_spools", "Post / Key"],
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

        {/* Top Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Solid Assembly" : "Cutaway Assembly View"}
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
                Wire Tension:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">{wireTensionN} N</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Twist Pitch:</span>
              <span className="font-bold text-purple-800 dark:text-purple-400">
                {twistsPerFoot} twists/ft
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Lock Integrity:</span>
              <span
                className={`font-bold ${glidden.isLocked ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}`}
              >
                {glidden.isLocked ? "LOCKED (No Slip)" : "SLIPPAGE"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Catenary Sag:</span>
              <span className="font-bold text-cyan-800 dark:text-cyan-400">
                {glidden.sagCm.toFixed(1)} cm
              </span>
            </div>
          </div>
        )}

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="Glidden source-described wire-fence kinematics"
          chips={[
            { label: "Twist Rate", value: String(twistsPerFoot), unit: "twists/ft" },
            { label: "Barb Spacing", value: barbSpacingInches.toFixed(1), unit: "in" },
            { label: "Catenary Sag", value: glidden.sagCm.toFixed(1), unit: "cm" },
            { label: "Slip Threshold", value: String(glidden.barbSlipThresholdN), unit: "N" },
            {
              label: "Lock State",
              value: glidden.isLocked ? "LOCKED" : "SLIPPAGE",
              tone: glidden.isLocked ? "ok" : "warn",
            },
            { label: "Tensile Strength", value: String(glidden.tensileStrengthLbs), unit: "lbs" },
            { label: "ω_flyer", value: glidden.flyerOmegaRadPerS.toFixed(1), unit: "rad/s" },
            {
              label: "Flyer crate",
              value: crateSource === "wasm" ? "fs-symmetry" : "ts-cyclic-fallback",
            },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Line Wire Tension</span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {wireTensionN} N
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="1200"
              step="50"
              value={wireTensionN}
              onChange={(e) => updateParam("wireTensionN", Number.parseInt(e.target.value, 10))}
              className="w-full accent-amber-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Helical Twist Rate</span>
              <span className="text-purple-700 dark:text-purple-400 font-mono font-bold">
                {twistsPerFoot} twists/ft
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="10"
              step="1"
              value={twistsPerFoot}
              onChange={(e) => updateParam("twistsPerFoot", Number.parseInt(e.target.value, 10))}
              className="w-full accent-purple-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Livestock Push Force
              </span>
              <span className="text-rose-700 dark:text-rose-400 font-mono font-bold">
                {animalPushForceN} N
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="300"
              step="10"
              value={animalPushForceN}
              onChange={(e) => updateParam("animalPushForceN", Number.parseInt(e.target.value, 10))}
              className="w-full accent-rose-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>

        <ClaimConstraintToggle
          patentId="us-157124-glidden-barbed-wire"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-157124-glidden-barbed-wire"
          params={params}
          className="mt-3"
        />
      </div>
    </div>
  );
});
