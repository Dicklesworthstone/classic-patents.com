"use client";

import { Camera, Eye, EyeOff, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepDeLavalSeparator } from "@/physics/catalogKernels";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildDeLavalSeparatorModel } from "./delavalSeparatorModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "centrifuge_bowl" | "conical_discs" | "outlet_spouts" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [9.5, 7.5, 11.0], target: [0, 0, 0] },
  centrifuge_bowl: { pos: [0, 1.8, 3.8], target: [0, 0.8, 0] },
  conical_discs: { pos: [2.2, 2.2, 2.8], target: [0, 0.8, 0] },
  outlet_spouts: { pos: [-2.5, 3.2, 3.0], target: [0, 2.2, 0] },
  top: { pos: [0, 12.0, 0.1], target: [0, 0, 0] },
};

export function DeLavalSeparator3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // Centrifugal Separation Parameters
  const { params, updateParam } = usePatentPhysics("us-247804-delaval-separator");
  const bowlRpm = params.bowlRpm ?? params.rotorRpm ?? 6500;
  const rawMilkFlowLph = params.rawMilkFlowLph ?? 300;
  const sep = stepDeLavalSeparator({
    bowlRpm,
    rawMilkFlowLph,
  });
  const centrifugalGs = sep.gForce;
  const throughputLitersPerHr = sep.creamFlowLph;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  const live = useLiveSimParams({
    bowlRpm,
    centrifugalGs,
    fatYieldPct: sep.fatYieldPct,
    creamFlowLph: sep.creamFlowLph,
    isAudioMuted,
    isCutaway,
    displayOmegaRadPerS: sep.displayOmegaRadPerS,
    bowlOmegaRadPerS: sep.bowlOmegaRadPerS,
    creamDropAdvancePerS: sep.creamDropAdvancePerS,
    pulleyDisplayOmegaRadPerS: sep.pulleyDisplayOmegaRadPerS,
    skimDropAdvancePerS: sep.skimDropAdvancePerS,
    creamDropOriginY: sep.creamDropOriginY,
    creamDropSpacing: sep.creamDropSpacing,
    creamDropWrap: sep.creamDropWrap,
    skimDropOriginY: sep.skimDropOriginY,
    skimDropSpacing: sep.skimDropSpacing,
    skimDropWrap: sep.skimDropWrap,
  });

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

    // Build procedural 3D model
    const model = buildDeLavalSeparatorModel();
    scene.add(model.rootGroup);

    // Animation Loop
    let reqId: number;
    let _timeSec = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const dt = 1 / 60;
      _timeSec += dt;
      const p = live.current;

      // Rotate Spindle & Bowl
      model.spindleGroup.rotation.y += p.displayOmegaRadPerS * dt;
      model.bowlGroup.rotation.y += p.displayOmegaRadPerS * dt;

      // Animate Milk/Cream Stream Particles
      const dropCount = model.creamDrops.length;
      for (let i = 0; i < dropCount; i++) {
        const drop = model.creamDrops[i];
        if (drop) {
          drop.position.y -= p.creamDropAdvancePerS * dt;
          if (drop.position.y < p.creamDropOriginY - p.creamDropWrap) {
            drop.position.y = p.creamDropOriginY + i * p.creamDropSpacing;
          }
        }
      }

      const skimCount = model.skimDrops.length;
      for (let i = 0; i < skimCount; i++) {
        const drop = model.skimDrops[i];
        if (drop) {
          drop.position.y -= p.skimDropAdvancePerS * dt;
          if (drop.position.y < p.skimDropOriginY - p.skimDropWrap) {
            drop.position.y = p.skimDropOriginY + i * p.skimDropSpacing;
          }
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      model.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">De Laval Separator 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-14rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3.5 h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["centrifuge_bowl", "Centrifuge Bowl"],
                ["conical_discs", "Conical Discs"],
                ["outlet_spouts", "Outlet Spouts"],
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
            title={isCutaway ? "Solid Centrifuge" : "Cutaway Chamber"}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm text-xs font-sans flex items-center gap-1 ${
              isCutaway
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            {isCutaway ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
            title={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
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
                Bowl Speed:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {Math.round(bowlRpm).toLocaleString()} RPM
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Centrifugal G-Force:</span>
              <span className="font-bold text-rose-700 dark:text-rose-400">
                {centrifugalGs.toLocaleString()} ×g
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Fat Separation:</span>
              <span className="font-bold text-emerald-800 dark:text-emerald-400">
                {sep.fatYieldPct.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Cream Yield:</span>
              <span className="text-purple-800 dark:text-purple-400 font-bold">
                {throughputLitersPerHr.toFixed(1)} L/h
              </span>
            </div>
          </div>
        )}

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="De Laval centrifuge"
          chips={[
            { label: "Bowl", value: String(Math.round(bowlRpm)), unit: "rpm" },
            {
              label: "g",
              value: centrifugalGs.toLocaleString(),
              unit: "×g",
              tone: centrifugalGs > 2000 ? "ok" : "warn",
            },
            { label: "Fat yield", value: sep.fatYieldPct.toFixed(1), unit: "%" },
            { label: "Cream", value: throughputLitersPerHr.toFixed(1), unit: "L/h" },
            { label: "Skim", value: sep.skimFlowLph.toFixed(1), unit: "L/h" },
            { label: "ω", value: sep.bowlOmegaRadPerS.toFixed(0), unit: "rad/s" },
            { label: "ω×0.15", value: sep.displayOmegaRadPerS.toFixed(1), unit: "rad/s" },
            {
              label: "Cream crate",
              value: crateSource === "wasm" ? "fs-lbm" : "ts-fluid-fallback",
            },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Centrifuge Bowl Speed
              </span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {Math.round(bowlRpm).toLocaleString()} RPM
              </span>
            </div>
            <input
              type="range"
              min="2000"
              max="9000"
              step="250"
              value={bowlRpm}
              onChange={(e) => updateParam("bowlRpm", Number.parseInt(e.target.value, 10))}
              className="w-full accent-amber-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Raw Milk Feed Rate</span>
              <span className="text-purple-700 dark:text-purple-400 font-mono font-bold">
                {rawMilkFlowLph} L/h
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="600"
              step="25"
              value={rawMilkFlowLph}
              onChange={(e) => updateParam("rawMilkFlowLph", Number.parseInt(e.target.value, 10))}
              className="w-full accent-purple-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
