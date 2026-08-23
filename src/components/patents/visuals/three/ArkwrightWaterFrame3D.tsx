"use client";

import { Camera, Eye, EyeOff, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepArkwrightWaterFrame } from "@/physics/arkwrightKernel";
import type { MachineState } from "@/physics/types";
import {
  globalTransportBus,
  type TapeUpdater,
  useFrankenSimPhysics,
} from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
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
  const [cutaway, _setCutaway] = useState(false);
  const [showCallouts, setShowCallouts] = useState(true);
  const [activePreset, setActivePreset] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  const { params, updateParam } = usePatentPhysics(EXHIBIT_ID);
  const waterWheelRpm = params.waterWheelRpm ?? 32;
  const totalDraftRatio = params.totalDraftRatio ?? 4.2;
  const rollerClampingWeightKg = params.rollerClampingWeightKg ?? 4.5;

  const live = useLiveSimParams({
    waterWheelRpm,
    totalDraftRatio,
    rollerClampingWeightKg,
    stapleLengthMm: params.stapleLengthMm,
    inputRovingCountNe: params.inputRovingCountNe,
  });

  // Shared transport tape: honest envelope plus one bus-owned integrator.
  // The updater steps every roller/flyer/traverse phase from the shared
  // kernel; the render loop consumes the integrated phases instead of
  // privately stepping. Accumulators live in a ref so re-registering on
  // control changes never snaps a phase back to zero.
  useFrankenSimPhysics(EXHIBIT_ID, {
    domain: "continuum_elasticity",
    refusal: { isRefused: false },
  });

  const phasesRef = useRef({
    wheel: 0,
    shaft: 0,
    feed: 0,
    delivery: 0,
    spindle: 0,
    bobbin: 0,
    traverse: 0,
  });
  useEffect(() => {
    const integrate: TapeUpdater = (_prev, dt) => {
      const out = stepArkwrightWaterFrame({
        waterWheelRpm: live.current.waterWheelRpm,
        totalDraftRatio: live.current.totalDraftRatio,
        rollerClampingWeightKg: live.current.rollerClampingWeightKg,
        stapleLengthMm: live.current.stapleLengthMm,
        inputRovingCountNe: live.current.inputRovingCountNe,
      });
      const ph = phasesRef.current;
      ph.wheel += out.wheelOmegaRadPerS * dt;
      ph.shaft += out.wheelOmegaRadPerS * dt;
      ph.feed += out.feedRollerOmegaRadPerS * dt;
      ph.delivery += out.deliveryRollerOmegaRadPerS * dt;
      ph.spindle += out.spindleOmegaRadPerSec * dt;
      ph.bobbin += out.bobbinOmegaRadPerS * dt;
      ph.traverse = (ph.traverse + out.traverseFreqHz * 2 * Math.PI * dt) % (2 * Math.PI);
      const machine: MachineState = {
        poseXMeters: 0,
        poseYMeters: 0,
        headingRad: ph.spindle % (2 * Math.PI),
        modeLabel: "water-frame drafting + flyer twist",
        wheelSpeedMps: out.deliveryVelocityMPerMin / 60,
      };
      return { machine };
    };
    globalTransportBus.registerUpdater(EXHIBIT_ID, integrate, "TS_FALLBACK");
    return () => globalTransportBus.unregisterUpdater(EXHIBIT_ID);
  }, [
    live.current.waterWheelRpm,
    live.current.totalDraftRatio,
    live.current.rollerClampingWeightKg,
    live.current.stapleLengthMm,
    live.current.inputRovingCountNe,
  ]);

  const handlePresetChange = (preset: CameraPreset) => {
    setActivePreset(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const cutawayRef = useRef(cutaway);
  cutawayRef.current = cutaway;
  const calloutsRef = useRef(showCallouts);
  calloutsRef.current = showCallouts;

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

      // Pure consumer of the shared transport tape: every phase below is
      // integrated by the bus updater from the shared kernel ω.
      const ph = phasesRef.current;

      // Kinematic rotations from the shared kernel ω
      model.wheelGroup.rotation.x = ph.wheel;
      model.shaftGroup.rotation.z = ph.shaft;

      // Rollers
      model.feedRollersGroup.rotation.x = ph.feed;
      model.deliveryRollersGroup.rotation.x = ph.delivery;

      // Flyers & Bobbins
      for (const f of model.flyerGroups) {
        f.rotation.y = ph.spindle;
      }

      for (const b of model.bobbinGroups) {
        b.rotation.y = ph.bobbin;
      }

      // Heart-cam & traverse rail lift
      const traverseOffset = Math.sin(ph.traverse) * 0.04;
      model.traverseRailGroup.position.y = 0.52 + traverseOffset;
      model.camGroup.rotation.z = ph.traverse;

      model.setCutaway(cutawayRef.current);
      model.setCalloutsVisible(calloutsRef.current);

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
  }, []);

  const outputs = stepArkwrightWaterFrame({
    waterWheelRpm,
    totalDraftRatio,
    rollerClampingWeightKg,
    stapleLengthMm: params.stapleLengthMm,
    inputRovingCountNe: params.inputRovingCountNe,
  });

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
      label: "Yarn Tenacity",
      value: `${outputs.yarnBreakingForceN.toFixed(2)} N`,
      unit: outputs.isWarpGradeWaterTwist ? "Warp-Grade" : "Weft-Only",
      tone: outputs.isWarpGradeWaterTwist ? "ok" : "warn",
    },
    {
      label: "Fiber Parallel",
      value: `${outputs.fiberParallelizationPct.toFixed(1)}%`,
      unit: "Slip-Free",
      tone: "ok",
    },
    {
      label: "Cromford Output",
      value: `${outputs.millProductionKgPerDay.toFixed(1)} kg/d`,
      unit: "96 Spindles",
      tone: "ok",
    },
  ];

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
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
                className={`px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
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
              setShowCallouts((prev) => !prev);
              soundEngine.playSwitchClick();
            }}
            title={showCallouts ? "Hide Callout Letters" : "Show Callout Letters"}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs flex items-center gap-1 ${
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
              toggleSound();
              soundEngine.playSwitchClick();
            }}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
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
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
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
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Bottom SI Telemetry Chips */}
        <StudioKernelChips visible={showUiOverlay} chips={chips} title="SI Telemetry" />
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
              min="10"
              max="60"
              step="1"
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
              min="2.0"
              max="6.0"
              step="0.1"
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
              min="2.0"
              max="10.0"
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

        <PortHamiltonianEnergyStrip
          patentId="gb-931-arkwright-water-frame"
          params={params}
          className="mt-3"
        />
      </div>
    </div>
  );
}
