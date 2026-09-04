"use client";

import { Camera, Eye, EyeOff, Pause, Play, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  ARKWRIGHT_DEFAULT_CONTROLS,
  ARKWRIGHT_FRANKENSIM_BOUNDARY,
  ARKWRIGHT_KERNEL_SOURCE,
  ARKWRIGHT_SOURCE_BOUNDARY,
  ARKWRIGHT_ZERO_PHASES,
  getArkwrightTapeFrame,
  readArkwrightControls,
  stepArkwrightWaterFrame,
} from "@/physics/arkwrightKernel";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { buildArkwrightWaterFrameModel } from "./arkwrightWaterFrameModel";
import { type KernelChip, StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

const EXHIBIT_ID = "gb-931-arkwright-water-frame";

type CameraPreset = "iso" | "drafting" | "flyer" | "cam" | "drum";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [1.8, 1.4, 2.2], target: [0, 0.7, 0] },
  drafting: { pos: [0, 1.15, 0.45], target: [0, 0.88, 0] },
  flyer: { pos: [-0.36, 0.85, 0.55], target: [-0.36, 0.65, 0.06] },
  cam: { pos: [0.75, 0.65, 0.4], target: [0.55, 0.52, 0] },
  drum: { pos: [0.65, 0.45, 0.6], target: [0.35, 0.22, 0] },
};

const PRESET_CHIPS: ReadonlyArray<{ id: CameraPreset; label: string }> = [
  { id: "iso", label: "Full Frame" },
  { id: "drafting", label: "Draft Rollers (C)" },
  { id: "flyer", label: "Spindle & Flyer (E)" },
  { id: "cam", label: "Heart-Cam (G)" },
  { id: "drum", label: "Driving Drum (A)" },
];

export function ArkwrightWaterFrame3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [cutaway, setCutaway] = useState(false);
  const [showCallouts, setShowCallouts] = useState(true);
  const [activePreset, setActivePreset] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  const { params, updateParam } = usePatentPhysics(EXHIBIT_ID);
  const waterWheelRpm = params.waterWheelRpm ?? ARKWRIGHT_DEFAULT_CONTROLS.waterWheelRpm;
  const totalDraftRatio = params.totalDraftRatio ?? ARKWRIGHT_DEFAULT_CONTROLS.totalDraftRatio;
  const rollerClampingWeightKg =
    params.rollerClampingWeightKg ?? ARKWRIGHT_DEFAULT_CONTROLS.rollerClampingWeightKg;
  const isRunning = (params.isRunning ?? 1) > 0.5;

  const live = useLiveSimParams({
    waterWheelRpm,
    totalDraftRatio,
    rollerClampingWeightKg,
    stapleLengthMm: params.stapleLengthMm,
    inputRovingCountNe: params.inputRovingCountNe,
    cutaway,
    showCallouts,
  });

  const { frame } = useFrankenSimPhysics(EXHIBIT_ID, {
    domain: "continuum_elasticity",
    refusal: { isRefused: true, reason: ARKWRIGHT_SOURCE_BOUNDARY },
  });

  const handlePresetChange = (preset: CameraPreset) => {
    setActivePreset(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  // The persistent WebGL scene consumes the stable layout-effect-synchronized control ref so toggles do not rebuild and flash the studio.
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

    const model = buildArkwrightWaterFrameModel();
    studio.scene.add(model.root);

    let rafId = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;

      // Pure consumer of the shared transport tape: the route-level owner survives
      // 2D/3D switches; this face only consumes it. The model owns the axis
      // mapping so a renderer cannot accidentally rotate an entire nip cage.
      model.updateAnimation(getArkwrightTapeFrame()?.phases ?? ARKWRIGHT_ZERO_PHASES);

      model.setCutaway(live.current.cutaway);
      model.setCalloutsVisible(live.current.showCallouts);

      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      model.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  const outputs =
    getArkwrightTapeFrame()?.outputs ??
    stepArkwrightWaterFrame(
      readArkwrightControls({
        waterWheelRpm,
        totalDraftRatio,
        rollerClampingWeightKg,
        stapleLengthMm: params.stapleLengthMm,
        inputRovingCountNe: params.inputRovingCountNe,
      }),
    );

  const chips: KernelChip[] = [
    {
      label: "Spindle Speed",
      value: `${outputs.flyerSpindleRpm.toFixed(0)} RPM`,
      unit: `Draft ×${outputs.totalDraftRatio.toFixed(1)}`,
      tone: "ok",
    },
    {
      label: "Twist Density",
      value: `${outputs.twistTurnsPerInch.toFixed(1)} TPI`,
      unit: `${outputs.twistMultiplier.toFixed(2)} TM`,
      tone: "ok",
    },
    {
      label: "Scenario Break Load",
      value: `${outputs.yarnBreakingForceN.toFixed(2)} N`,
      unit: outputs.isWarpGradeWaterTwist ? "≥ 1.8 N threshold" : "< 1.8 N threshold",
      tone: outputs.isWarpGradeWaterTwist ? "ok" : "warn",
    },
    {
      label: "Fiber Parallel",
      value: `${outputs.fiberParallelizationPct.toFixed(1)}%`,
      unit: "scenario estimate",
      tone: "ok",
    },
    {
      label: "Scaled Scenario Output",
      value: `${outputs.millProductionKgPerDay.toFixed(1)} kg/d`,
      unit: "96 lanes × 12 h",
      tone: "ok",
    },
  ];

  return (
    <div
      className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent"
      data-arkwright-face="three"
      data-arkwright-runtime-tick={frame.tick}
      data-arkwright-runtime-provenance={frame.provenance}
      data-arkwright-kernel-source={ARKWRIGHT_KERNEL_SOURCE}
      data-arkwright-frankensim-boundary={ARKWRIGHT_FRANKENSIM_BOUNDARY}
      data-arkwright-running={isRunning}
      data-arkwright-wheel-phase-rad={getArkwrightTapeFrame()?.phases.wheelRad ?? 0}
      data-arkwright-feed-phase-rad={getArkwrightTapeFrame()?.phases.feedRollerRad ?? 0}
      data-arkwright-intermediate-one-phase-rad={
        getArkwrightTapeFrame()?.phases.intermediateRollerOneRad ?? 0
      }
      data-arkwright-intermediate-two-phase-rad={
        getArkwrightTapeFrame()?.phases.intermediateRollerTwoRad ?? 0
      }
      data-arkwright-delivery-phase-rad={getArkwrightTapeFrame()?.phases.deliveryRollerRad ?? 0}
      data-arkwright-spindle-layshaft-phase-rad={
        getArkwrightTapeFrame()?.phases.spindleLayshaftRad ?? 0
      }
      data-arkwright-spindle-phase-rad={getArkwrightTapeFrame()?.phases.spindleRad ?? 0}
      data-arkwright-traverse-phase-rad={getArkwrightTapeFrame()?.phases.traverseRad ?? 0}
    >
      <div className="sr-only">Richard Arkwright Spinning Water Frame 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-9.5rem)] sm:max-w-[calc(100%-28rem)] gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3.5 h-3.5" /> View:
            </span>
            {PRESET_CHIPS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetChange(preset.id)}
                className={`min-h-9 px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
                  activePreset === preset.id
                    ? "bg-amber-600 text-white shadow-xs font-semibold"
                    : "text-ink-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}

        {/* Top-Right Action Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap justify-end gap-1.5 sm:gap-2 max-w-[min(90%,26rem)] sm:max-w-[26rem]">
          <button
            type="button"
            onClick={() => {
              setCutaway((previous) => !previous);
              soundEngine.playSwitchClick();
            }}
            title={cutaway ? "Show Transmission Cover" : "Hide Transmission Cover"}
            aria-label={cutaway ? "Show Transmission Cover" : "Hide Transmission Cover"}
            className={`min-h-9 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              cutaway
                ? "bg-cyan-700 text-white border-cyan-800"
                : "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700"
            }`}
          >
            <span className="hidden md:inline">{cutaway ? "Show Cover" : "Hide Cover"}</span>
            <span className="md:hidden">Cover</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowCallouts((prev) => !prev);
              soundEngine.playSwitchClick();
            }}
            title={showCallouts ? "Hide Callout Letters" : "Show Callout Letters"}
            className={`min-h-9 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs flex items-center gap-1 ${
              showCallouts
                ? "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-700"
                : "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
            }`}
          >
            <Zap className="w-3.5 h-3.5 inline sm:mr-1" />
            <span className="hidden md:inline">{showCallouts ? "Pins" : "Pins Off"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              updateParam("isRunning", isRunning ? 0 : 1);
              soundEngine.playSwitchClick();
            }}
            className="min-h-9 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border border-parchment-300 dark:border-ink-700 bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 shadow-xs flex items-center gap-1"
            aria-label={isRunning ? "Pause Motion" : "Resume Motion"}
            title={isRunning ? "Pause Motion" : "Resume Motion"}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="hidden md:inline">{isRunning ? "Pause" : "Resume"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              toggleSound();
              soundEngine.playSwitchClick();
            }}
            className="min-h-9 p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            aria-label={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`min-h-9 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              showUiOverlay
                ? "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
                : "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-700"
            }`}
            title={showUiOverlay ? "Hide Overlay Telemetry" : "Show Overlay Telemetry"}
            aria-label={showUiOverlay ? "Hide Overlay Telemetry" : "Show Overlay Telemetry"}
          >
            {showUiOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden md:inline">{showUiOverlay ? "Hide HUD" : "Show HUD"}</span>
          </button>

          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => handlePresetChange("iso")}
            className="min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Bottom SI Telemetry Chips */}
        <StudioKernelChips visible={showUiOverlay} chips={chips} title="Declared SI Scenario" />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Water Wheel Speed</span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {waterWheelRpm} RPM
              </span>
            </div>
            <input
              type="range"
              aria-label="Water wheel speed"
              min="60"
              max="260"
              step="10"
              value={waterWheelRpm}
              onChange={(e) => updateParam("waterWheelRpm", Number.parseFloat(e.target.value))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Total Draft Ratio</span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                ×{totalDraftRatio.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              aria-label="Total draft ratio"
              min="3.0"
              max="10.0"
              step="0.5"
              value={totalDraftRatio}
              onChange={(e) => updateParam("totalDraftRatio", Number.parseFloat(e.target.value))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Roller Clamp Weight
              </span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {rollerClampingWeightKg.toFixed(1)} kg
              </span>
            </div>
            <input
              type="range"
              aria-label="Roller clamp weight"
              min="1.0"
              max="6.0"
              step="0.5"
              value={rollerClampingWeightKg}
              onChange={(e) =>
                updateParam("rollerClampingWeightKg", Number.parseFloat(e.target.value))
              }
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>
        </div>

        <ClaimConstraintToggle
          patentId="gb-931-arkwright-water-frame"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <p className="mt-3 rounded-xl border border-amber-500/25 bg-amber-950/10 px-3 py-2 text-xs leading-relaxed text-ink-700 dark:text-parchment-300">
          <strong className="text-ink-900 dark:text-parchment-100">Source boundary.</strong>{" "}
          {ARKWRIGHT_SOURCE_BOUNDARY}
        </p>
      </div>
    </div>
  );
}
