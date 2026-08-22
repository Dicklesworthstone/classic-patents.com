"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Sparkles, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepMcCormickReaper } from "@/physics/catalogKernels";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { TickScheduler } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { buildMcCormickReaperModel, updateMcCormickReaperKinematics } from "./mccormickReaperModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "sickle_guards" | "grain_reel" | "platform" | "drive_wheel" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [10.5, 7.0, 11.0], target: [0, 0, 0] },
  sickle_guards: { pos: [-1.0, 1.0, 4.5], target: [-0.5, -0.6, 1.8] },
  grain_reel: { pos: [2.8, 3.8, 4.0], target: [0, 1.2, 0] },
  platform: { pos: [0, 5.0, 0], target: [0, -0.5, -0.5] },
  drive_wheel: { pos: [-5.0, 1.2, 3.2], target: [-3.2, 0.4, 0] },
  top: { pos: [0, 13.0, 0.1], target: [0, 0, 0] },
};

export function McCormickReaper3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);

  const [showStalks, setShowStalks] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [crateSource, setCrateSource] = useState(genericKernelSource());
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  const { params, updateParam } = usePatentPhysics("us-x8277-mccormick-reaper");
  const groundSpeedMph = params.draftSpeedMph ?? params.forwardSpeedMph ?? 2.5;
  const { isAudioMuted, toggleSound } = usePatentAudio();

  const reaper = stepMcCormickReaper({
    forwardSpeedMph: groundSpeedMph,
  });

  const live = useLiveSimParams({
    groundSpeedMph,
    showStalks,
    isAudioMuted,
    isCutaway,
    groundWheelOmegaRadPerS: reaper.groundWheelOmegaRadPerS,
    reelOmegaRadPerS: reaper.reelOmegaRadPerS,
    cutterOmegaRadPerS: reaper.cutterOmegaRadPerS,
  });

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  useEffect(() => {
    if (!isAudioMuted && groundSpeedMph > 0.1) {
      soundEngine.playContinuousTone(55 + groundSpeedMph * 12, "sawtooth", 0.035);
    } else {
      soundEngine.stopContinuousTone();
    }
    return () => {
      soundEngine.stopContinuousTone();
    };
  }, [isAudioMuted, groundSpeedMph]);

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

    // Build procedural 3D model
    const model = buildMcCormickReaperModel();
    scene.add(model.rootGroup);

    // Animation Loop
    let reqId: number;
    let simTimeSec = 0;
    const sched = new TickScheduler(1 / 60, 0);

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      sched.pump(now / 1000, () => {
        simTimeSec += 1 / 60;
      });
      const p = live.current;
      const elapsedSeconds = simTimeSec;

      updateMcCormickReaperKinematics(
        model,
        p.groundWheelOmegaRadPerS,
        p.reelOmegaRadPerS,
        p.cutterOmegaRadPerS,
        elapsedSeconds,
        p.showStalks,
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
      <div className="sr-only">McCormick Reaper 3D</div>
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
                ["sickle_guards", "Sickle Bar"],
                ["grain_reel", "Grain Reel"],
                ["platform", "Platform"],
                ["drive_wheel", "Drive Wheel"],
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

        {/* Top-Right Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Switch to Solid Platform" : "Switch to Platform Cutaway"}
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
            onClick={() => setShowStalks(!showStalks)}
            title={showStalks ? "Hide Wheat Stalks" : "Show Wheat Stalks"}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showStalks
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            <Sparkles className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
          >
            {isAudioMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            )}
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

          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              showUiOverlay
                ? "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
                : "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-600"
            }`}
            title={showUiOverlay ? "Hide Overlay Telemetry" : "Show Overlay Telemetry"}
            aria-label={showUiOverlay ? "Hide Overlay Telemetry" : "Show Overlay Telemetry"}
          >
            {showUiOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden md:inline">{showUiOverlay ? "Hide HUD" : "Show HUD"}</span>
          </button>
        </div>

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                Cutter Cadence:
              </span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {reaper.cutterHz.toFixed(1)} Hz
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Ground Speed:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {groundSpeedMph.toFixed(1)} mph
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Grain Reel:</span>
              <span className="text-cyan-800 dark:text-cyan-400 font-bold">
                {reaper.reelRpm.toFixed(0)} RPM
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Draft Ground Speed</span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {groundSpeedMph.toFixed(1)} mph
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="6.0"
              step="0.2"
              value={groundSpeedMph}
              onChange={(e) => updateParam("forwardSpeedMph", Number.parseFloat(e.target.value))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Kinematic Cutter Speed
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                {reaper.cutterCrankRpm.toFixed(0)} RPM
              </span>
            </div>
            <div className="text-[11px] font-sans text-ink-500">
              Geared directly to main ground wheel
            </div>
          </div>
        </div>

        <ClaimConstraintToggle
          patentId="us-x8277-mccormick-reaper"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-x8277-mccormick-reaper"
          params={params}
          className="mt-3"
        />
      </div>

      <StudioKernelChips
        visible
        side="right"
        title="McCormick cutter bar"
        chips={[
          { label: "Ground", value: String(groundSpeedMph), unit: "mph" },
          { label: "24-inch wheel", value: String(reaper.groundWheelRpm), unit: "rpm" },
          { label: "Crank", value: String(reaper.cutterCrankRpm), unit: "rpm" },
          { label: "Reel", value: String(reaper.reelRpm), unit: "rpm" },
          { label: "v", value: String(reaper.groundSpeedMps), unit: "m/s" },
          { label: "f_cut", value: String(reaper.cutterHz), unit: "Hz" },
          { label: "ω_cut", value: reaper.cutterOmegaRadPerS.toFixed(2), unit: "rad/s" },
          {
            label: "Reel crate",
            value: crateSource === "wasm" ? "fs-symmetry" : "ts-cyclic-fallback",
          },
        ]}
      />
    </div>
  );
}
