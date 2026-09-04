"use client";

import {
  Camera,
  Eye,
  EyeOff,
  Layers,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getHopkinsTapeFrame,
  HOPKINS_DEFAULT_CONTROLS,
  HOPKINS_FRANKENSIM_BOUNDARY,
  HOPKINS_KERNEL_SOURCE,
  HOPKINS_SOURCE_BOUNDARY,
  HOPKINS_ZERO_PHASES,
  stepHopkinsPotash,
} from "@/physics/hopkinsPotashKernel";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import {
  type HopkinsPotashCameraPreset as CameraPreset,
  hopkinsPotashViewForViewport,
} from "./hopkinsPotashCamera";
import { animateHopkinsPotashModel, buildHopkinsPotashModel } from "./hopkinsPotashModel";
import { type KernelChip, StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

const CAMERA_PRESET_OPTIONS: readonly { readonly id: CameraPreset; readonly label: string }[] = [
  { id: "iso", label: "Overview" },
  { id: "furnace", label: "1 Burn Ashes" },
  { id: "leaching", label: "2 Dissolve & Boil" },
  { id: "settling", label: "3 Settle Ley" },
  { id: "crystallizer", label: "4 Make Pearl Ash" },
  { id: "fluxing", label: "5 Flux Pot Ash" },
  { id: "top", label: "Plan View" },
];

const HOPKINS_READER_STEPS = [
  "1 Burn Ashes",
  "2 Dissolve & Boil",
  "3 Settle Ley",
  "4 Make Pearl Ash",
  "5 Optional Fluxing",
] as const;

export function HopkinsPotash3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const { params, updateParam, resetParams } = usePatentPhysics("us-x1-hopkins-potash");
  const roastTempC = params.roastTempC ?? HOPKINS_DEFAULT_CONTROLS.roastTempC;
  const roastTimeHours = params.roastTimeHours ?? HOPKINS_DEFAULT_CONTROLS.roastTimeHours;
  const ashBatchKg = params.ashBatchKg ?? HOPKINS_DEFAULT_CONTROLS.ashBatchKg;
  const waterVolumeLiters = params.waterVolumeLiters ?? HOPKINS_DEFAULT_CONTROLS.waterVolumeLiters;
  const waterTempC = params.waterTempC ?? HOPKINS_DEFAULT_CONTROLS.waterTempC;
  const isRunning = (params.isRunning ?? 1) > 0.5;

  const pot = useMemo(
    () =>
      stepHopkinsPotash({
        roastTempC,
        roastTimeHours,
        ashBatchKg,
        waterVolumeLiters,
        waterTempC,
      }),
    [ashBatchKg, roastTempC, roastTimeHours, waterTempC, waterVolumeLiters],
  );

  const live = useLiveSimParams({ isCutaway, fallbackOutputs: pot });
  const { frame } = useFrankenSimPhysics("us-x1-hopkins-potash", {
    domain: "thermodynamics_transport",
    refusal: { isRefused: true, reason: HOPKINS_SOURCE_BOUNDARY },
  });
  const tape = getHopkinsTapeFrame();
  const outputs = tape?.outputs ?? pot;

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = hopkinsPotashViewForViewport(preset, containerRef.current?.clientWidth ?? 1000);
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  useEffect(() => {
    const restoreResponsiveView = () => {
      const container = containerRef.current;
      if (!container) return;
      const view = hopkinsPotashViewForViewport(activeCamera, container.clientWidth);
      studioRef.current?.controls.setView(view.pos, view.target);
    };
    window.addEventListener("resize", restoreResponsiveView);
    return () => window.removeEventListener("resize", restoreResponsiveView);
  }, [activeCamera]);

  useEffect(() => {
    if (!isAudioMuted) {
      soundEngine.playContinuousTone(80 + (roastTempC / 1000) * 40, "triangle", 0.04);
    } else {
      soundEngine.stopContinuousTone();
    }
    return () => {
      soundEngine.stopContinuousTone();
    };
  }, [isAudioMuted, roastTempC]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const iso = hopkinsPotashViewForViewport("iso", container.clientWidth);
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

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const liveTape = getHopkinsTapeFrame();
      animateHopkinsPotashModel(
        modelResult,
        liveTape?.outputs ?? live.current.fallbackOutputs,
        liveTape?.phases ?? HOPKINS_ZERO_PHASES,
        Boolean(live.current.isCutaway),
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

  const currentStageName =
    HOPKINS_READER_STEPS[
      Math.min(HOPKINS_READER_STEPS.length - 1, Math.floor((tape?.phases.processCycle01 ?? 0) * 5))
    ];

  const kernelChips: KernelChip[] = [
    {
      label: "Furnace T",
      value: `${roastTempC}`,
      unit: "°C",
      tone: roastTempC >= 700 ? "ok" : "warn",
    },
    {
      label: "Decarb",
      value: `${outputs.decarbonizationPct.toFixed(1)}`,
      unit: "%",
      tone: outputs.decarbonizationPct >= 80 ? "ok" : "warn",
    },
    {
      label: "Yield",
      value: `${outputs.pearlAshYieldKg.toFixed(1)}`,
      unit: "kg K₂CO₃",
      tone: "ok",
    },
    {
      label: "Purity",
      value: `${outputs.pearlAshPurityPct.toFixed(1)}`,
      unit: "%",
      tone: outputs.pearlAshPurityPct >= 85 ? "ok" : "warn",
    },
    {
      label: "Reader step",
      value: currentStageName,
      tone: "ok",
    },
  ];

  return (
    <div
      className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent"
      data-hopkins-face="three"
      data-hopkins-runtime-tick={frame.tick}
      data-hopkins-runtime-provenance={frame.provenance}
      data-hopkins-kernel-source={HOPKINS_KERNEL_SOURCE}
      data-hopkins-frankensim-boundary={HOPKINS_FRANKENSIM_BOUNDARY}
      data-hopkins-running={isRunning}
      data-hopkins-process-cycle={tape?.phases.processCycle01 ?? 0}
      data-hopkins-flame-phase-rad={tape?.phases.flamePhaseRad ?? 0}
      data-hopkins-boil-phase-rad={tape?.phases.boilPhaseRad ?? 0}
    >
      <div className="sr-only">Samuel Hopkins Potash and Pearl Ash Apparatus 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        <label className="absolute top-14 left-3 z-10 sm:hidden">
          <span className="sr-only">Hopkins process camera view</span>
          <select
            aria-label="Hopkins process camera view"
            value={activeCamera}
            onChange={(event) => applyCameraPreset(event.target.value as CameraPreset)}
            className="min-h-10 max-w-[10.75rem] rounded-lg border border-parchment-300 bg-white/90 px-2 text-xs font-semibold text-ink-800 shadow-sm backdrop-blur-md dark:border-ink-700 dark:bg-ink-900/90 dark:text-parchment-200"
          >
            {CAMERA_PRESET_OPTIONS.map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </label>

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-4 left-4 z-10 hidden max-w-[calc(100%-28rem)] flex-nowrap gap-1.5 overflow-x-auto rounded-xl border border-parchment-300 bg-white/85 p-1.5 text-xs shadow-sm backdrop-blur-md transition-opacity duration-200 scrollbar-none dark:border-ink-700 dark:bg-ink-900/85 sm:flex">
            <span className="px-2 py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3.5 h-3.5" /> View:
            </span>
            {CAMERA_PRESET_OPTIONS.map(({ id: preset, label }) => (
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
            title={isCutaway ? "Restore Opaque Vessel Walls" : "Reveal Vessel Contents"}
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
            onClick={() => {
              updateParam("isRunning", isRunning ? 0 : 1);
              soundEngine.playSwitchClick();
            }}
            title={isRunning ? "Pause Process Reader" : "Resume Process Reader"}
            aria-label={isRunning ? "Pause Process Reader" : "Resume Process Reader"}
            className="min-h-9 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm text-xs font-semibold flex items-center gap-1"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="hidden md:inline">{isRunning ? "Pause" : "Resume"}</span>
          </button>

          <button
            type="button"
            onClick={toggleEngine}
            className="min-h-9 p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
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
            title="Toggle Overlay UI"
          >
            {showUiOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          <button
            aria-label="Reset Process and Camera"
            type="button"
            onClick={() => {
              resetParams();
              updateParam("resetEpoch", (params.resetEpoch ?? 0) + 1);
              applyCameraPreset("iso");
              soundEngine.playSwitchClick();
            }}
            className="min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title="Reset Process and Camera"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                Pearl Ash Yield:
              </span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {outputs.pearlAshYieldKg.toFixed(1)} kg scenario
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Scenario burnout:</span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {outputs.decarbonizationPct.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Scenario assay:</span>
              <span className="font-bold text-cyan-800 dark:text-cyan-400">
                {outputs.pearlAshPurityPct.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Reader step:</span>
              <span className="font-bold text-purple-800 dark:text-purple-400">
                {currentStageName}
              </span>
            </div>
          </div>
        )}

        {/* Physics Chips */}
        <StudioKernelChips
          visible={showUiOverlay}
          title="SOURCE-BOUNDED SI TEACHING SCENARIO"
          chips={kernelChips}
          side="right"
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Furnace Temp</span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {roastTempC} °C
              </span>
            </div>
            <input
              type="range"
              aria-label="Furnace temperature"
              min="500"
              max="950"
              step="25"
              value={roastTempC}
              onChange={(e) => updateParam("roastTempC", Number.parseInt(e.target.value, 10))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Roasting Time</span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {roastTimeHours} hrs
              </span>
            </div>
            <input
              type="range"
              aria-label="Roasting time"
              min="0.5"
              max="6.0"
              step="0.5"
              value={roastTimeHours}
              onChange={(e) => updateParam("roastTimeHours", Number.parseFloat(e.target.value))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Raw Ash Batch</span>
              <span className="text-purple-700 dark:text-purple-400 font-mono font-bold">
                {ashBatchKg} kg
              </span>
            </div>
            <input
              type="range"
              aria-label="Raw ash batch mass"
              min="50"
              max="500"
              step="25"
              value={ashBatchKg}
              onChange={(e) => updateParam("ashBatchKg", Number.parseInt(e.target.value, 10))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-purple-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Water Temp</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                {waterTempC} °C
              </span>
            </div>
            <input
              type="range"
              aria-label="Water temperature"
              min="20"
              max="100"
              step="5"
              value={waterTempC}
              onChange={(e) => updateParam("waterTempC", Number.parseInt(e.target.value, 10))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
          {HOPKINS_SOURCE_BOUNDARY}
        </p>
      </div>
    </div>
  );
}
