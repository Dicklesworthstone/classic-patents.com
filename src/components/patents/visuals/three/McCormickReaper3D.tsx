"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepMcCormickReaper } from "@/physics/catalogKernels";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { buildMcCormickReaperModel, updateMcCormickReaperKinematics } from "./mccormickReaperModel";
import { StudioKernelChips } from "./StudioKernelChips";
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
  const [showUiOverlay, _setShowUiOverlay] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  const { params } = usePatentPhysics("us-x8277-mccormick-reaper");
  const groundSpeedMph = params.draftSpeedMph ?? params.forwardSpeedMph ?? 2.5;
  const { isAudioMuted } = usePatentAudio();

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
    let presentationStep = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const p = live.current;
      const elapsedSeconds = presentationStep / 60;
      presentationStep += 1;

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
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Title HUD */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 pointer-events-none rounded-xl border border-parchment-700/60 bg-parchment-950/80 px-3.5 py-2 backdrop-blur-md shadow-lg">
            <div className="font-mono text-xs font-bold text-parchment-100 uppercase tracking-wider">
              McCormick Reaper 3D
            </div>
            <div className="text-[11px] text-parchment-300 font-sans">
              US Patent X8,277 • Mechanical Grain Harvester
            </div>
          </div>
        )}

        {/* Top Controls */}
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
            title="Toggle Wheat Stalks"
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showStalks
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            {showStalks ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
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

        {/* Camera Views Bar */}
        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-1.5rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs">
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
    </div>
  );
}
