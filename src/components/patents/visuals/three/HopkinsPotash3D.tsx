"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepHopkinsPotash } from "@/physics/hopkinsPotashKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { animateHopkinsPotashModel, buildHopkinsPotashModel } from "./hopkinsPotashModel";
import { type KernelChip, StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "furnace" | "leaching" | "crystallizer" | "ingot" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [4.5, 3.2, 4.8], target: [0, 0.5, 0] },
  furnace: { pos: [-1.6, 1.4, 2.5], target: [-1.6, 0.6, 0] },
  leaching: { pos: [-0.4, 1.3, 2.2], target: [-0.4, 0.5, 0] },
  crystallizer: { pos: [0.8, 1.4, 2.2], target: [0.8, 0.5, 0] },
  ingot: { pos: [1.8, 1.0, 1.8], target: [1.8, 0.25, 0] },
  top: { pos: [0, 6.0, 0.1], target: [0, 0, 0] },
};

export function HopkinsPotash3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const { params } = usePatentPhysics("us-x1-hopkins-potash");
  const roastTempC = params.roastTempC ?? 750;
  const roastTimeHours = params.roastTimeHours ?? 4;
  const ashBatchKg = params.ashBatchKg ?? 500;
  const waterTempC = params.waterTempC ?? 80;

  const pot = stepHopkinsPotash({
    roastTempC,
    roastTimeHours,
    ashBatchKg,
    waterTempC,
  });

  const live = useLiveSimParams({
    roastTempC,
    roastTimeHours,
    ashBatchKg,
    waterTempC,
    isCutaway,
    isAudioMuted,
    decarbonizationPct: pot.decarbonizationPct,
    pearlAshYieldKg: pot.pearlAshYieldKg,
  });

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
      fov: 45,
    });

    studioRef.current = studio;

    const modelResult = buildHopkinsPotashModel();
    studio.scene.add(modelResult.rootGroup);

    let animId: number;

    const animate = (now: number) => {
      animId = requestAnimationFrame(animate);
      const timeS = now / 1000;
      const p = live.current;

      animateHopkinsPotashModel(
        modelResult,
        {
          roastTempC: p.roastTempC,
          roastTimeHours: p.roastTimeHours,
          ashBatchKg: p.ashBatchKg,
          waterTempC: p.waterTempC,
          isCutaway: Boolean(p.isCutaway),
        },
        timeS,
      );

      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      modelResult.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  const kernelChips: KernelChip[] = [
    {
      label: "Decarbonization",
      value: `${pot.decarbonizationPct.toFixed(1)}%`,
      tone: pot.decarbonizationPct > 80 ? "ok" : "warn",
    },
    {
      label: "Pearl Ash Yield",
      value: `${pot.pearlAshYieldKg.toFixed(1)} kg`,
      tone: "hot",
    },
    {
      label: "Purity",
      value: `${pot.pearlAshPurityPct.toFixed(1)}%`,
      tone: "ok",
    },
    {
      label: "Ley Density",
      value: `${pot.leyDensityKgM3.toFixed(0)} kg/m³`,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm text-xs font-sans flex items-center gap-1 ${
              isCutaway
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
            title="Toggle Cutaway View"
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">{isCutaway ? "Cutaway" : "Solid"}</span>
          </button>

          <button
            type="button"
            onClick={toggleEngine}
            className="p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
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
            title="Toggle Overlay UI"
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

        {/* Camera Views Bar */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-1.5rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3.5 h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Overview"],
                ["furnace", "Kiln (Stage 1)"],
                ["leaching", "Tub (Stage 2)"],
                ["crystallizer", "Pot (Stage 3)"],
                ["ingot", "Ingot (Stage 4)"],
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

        {/* Physics Chips */}
        <StudioKernelChips
          visible={showUiOverlay}
          title="Arrhenius Calcination & Leaching Yield"
          chips={kernelChips}
          side="right"
        />
      </div>
    </div>
  );
}
