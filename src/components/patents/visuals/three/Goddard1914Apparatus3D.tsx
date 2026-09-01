"use client";

import { Camera, Eye, EyeOff, Layers, Pause, Play, RotateCcw, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { FrankenSimEngine } from "@/physics/engine";
import { ensureGoddardWasm, goddardKernelSource } from "@/physics/goddardWasm";
import { createStudioClock } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import {
  buildGoddard1914ApparatusModel,
  updateGoddard1914ApparatusKinematics,
} from "./goddard1914ApparatusModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

type CameraPreset = "iso" | "solid_charge" | "spin_tubes" | "auxiliary" | "gyro" | "frame";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [14.5, 4.4, 18.5], target: [0, -1.7, 0] },
  solid_charge: { pos: [4.4, -0.5, 5.4], target: [0, -0.6, 0] },
  spin_tubes: { pos: [4.2, 1.8, 4.2], target: [0, 1.0, 0] },
  auxiliary: { pos: [4.2, 4.3, 5.2], target: [0, 3.1, 0] },
  gyro: { pos: [2.2, 4.2, 3.0], target: [0, 3.85, 0] },
  frame: { pos: [8.2, -1.6, 10.5], target: [0, -2.6, 0] },
};

export function GoddardRocket3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [kernelSource, setKernelSource] = useState(goddardKernelSource());
  const { params, updateParam, resetParams } = usePatentPhysics("us-1102653-goddard-rocket");
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [isCutaway, setIsCutaway] = useState(true);
  const [showEfflux, setShowEfflux] = useState(true);
  const [showCalloutPins, setShowCalloutPins] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    7: true,
  });

  useEffect(() => {
    let active = true;
    void ensureGoddardWasm().then((nextSource) => {
      if (active) setKernelSource(nextSource);
    });
    return () => {
      active = false;
    };
  }, []);

  const primarySpinRpm = params.primarySpinRpm ?? 120;
  const gyroSpinRpm = params.gyroSpinRpm ?? 6_000;
  const tubeLengthRatio = params.tubeLengthRatio ?? 4.5;
  const auxiliaryReleaseFraction = params.auxiliaryReleaseFraction ?? 0;
  const primaryChargeSubstantiallyConsumed = (params.primaryChargeConsumed ?? 0) !== 0;
  const gyroEnabled = (params.gyroEnabled ?? 1) !== 0;

  const effectivePrimarySpinRpm = claimStates[3] === false ? 0 : primarySpinRpm;
  const effectiveGyroEnabled = claimStates[7] !== false && gyroEnabled;
  const effectiveTubeLengthRatio = claimStates[2] === false ? 2.5 : tubeLengthRatio;
  const effectiveAuxiliaryRelease = claimStates[1] === false ? 0 : auxiliaryReleaseFraction;
  const telemetry = FrankenSimEngine.stepGoddardApparatus(
    0,
    effectivePrimarySpinRpm,
    gyroSpinRpm,
    effectiveTubeLengthRatio,
    effectiveAuxiliaryRelease,
    primaryChargeSubstantiallyConsumed,
    effectiveGyroEnabled,
  );

  const live = useLiveSimParams({
    primarySpinRpm: effectivePrimarySpinRpm,
    gyroSpinRpm,
    tubeLengthRatio: effectiveTubeLengthRatio,
    auxiliaryReleaseFraction: effectiveAuxiliaryRelease,
    primaryChargeSubstantiallyConsumed,
    gyroEnabled: effectiveGyroEnabled,
    claim1Present: claimStates[1] !== false,
    claim3Present: claimStates[3] !== false,
    claim7Present: claimStates[7] !== false,
    showEfflux,
    showCalloutPins,
    isCutaway,
    isPaused,
  });

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const view = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(view.pos, view.target);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const initial = CAMERA_PRESETS.iso;
    const studio = createThreeStudioScene({
      container,
      cameraPos: initial.pos,
      targetPos: initial.target,
    });
    studioRef.current = studio;
    const model = buildGoddard1914ApparatusModel();
    studio.scene.add(model.root);

    const clock = createStudioClock();
    let elapsedSeconds = 0;
    let requestId = 0;
    const animate = (now: number) => {
      requestId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const { dt } = clock.pump(now);
      const current = live.current;
      if (!current.isPaused) elapsedSeconds = (elapsedSeconds + dt) % 600;

      const physics = FrankenSimEngine.stepGoddardApparatus(
        elapsedSeconds,
        current.primarySpinRpm,
        current.gyroSpinRpm,
        current.tubeLengthRatio,
        current.auxiliaryReleaseFraction,
        current.primaryChargeSubstantiallyConsumed,
        current.gyroEnabled,
      );
      updateGoddard1914ApparatusKinematics(model, {
        elapsedSeconds,
        primaryQuaternion: physics.primaryQuaternion,
        gyroQuaternion: physics.gyroQuaternion,
        tubeLengthRatio: physics.tubeLengthRatio,
        auxiliaryReleaseFraction: current.auxiliaryReleaseFraction,
        primaryChargeSubstantiallyConsumed: current.primaryChargeSubstantiallyConsumed,
        claim1SequenceSatisfied: physics.claim1SequenceSatisfied,
        claim2Satisfied: physics.claim2Satisfied,
        gyroEnabled: current.gyroEnabled,
        gyroOperational: current.gyroEnabled && physics.gyroAngularVelocityRadPerSec > 0,
        claim1Present: current.claim1Present,
        claim3Present: current.claim3Present,
        claim7Present: current.claim7Present,
        showEfflux: current.showEfflux,
        showCalloutPins: current.showCalloutPins,
        isCutaway: current.isCutaway,
      });

      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };
    requestId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(requestId);
      model.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-parchment-300 bg-parchment-50/60 shadow-patent dark:border-ink-800 dark:bg-ink-950/80">
      <div className="sr-only">
        Connected source-bounded model of Goddard&apos;s 1914 solid-charge rocket apparatus, nested
        auxiliary rocket, launch bearings, spin passages, and gyroscope-isolated camera.
      </div>
      <div className="relative min-h-[430px] w-full flex-1 cursor-grab active:cursor-grabbing sm:min-h-[520px]">
        <div ref={containerRef} className="absolute inset-0 h-full w-full" />

        {showUiOverlay && (
          <div className="scrollbar-none absolute top-3 left-3 z-10 flex max-w-[calc(100%-8rem)] flex-nowrap gap-1 overflow-x-auto rounded-xl border border-parchment-300 bg-white/88 p-1.5 text-[10px] shadow-sm backdrop-blur-md dark:border-ink-700 dark:bg-ink-900/88 sm:top-4 sm:left-4 sm:max-w-[calc(100%-25rem)] sm:text-xs">
            <span className="flex shrink-0 items-center gap-1 px-2 py-1 font-sans text-ink-500">
              <Camera className="h-3.5 w-3.5" /> View
            </span>
            {(
              [
                ["iso", "Whole apparatus"],
                ["solid_charge", "Charge 12"],
                ["spin_tubes", "Spin tubes 15"],
                ["auxiliary", "Auxiliary 25"],
                ["gyro", "Gyroscope 37"],
                ["frame", "Frame 21"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => applyCameraPreset(id)}
                className={`min-h-9 shrink-0 whitespace-nowrap rounded-lg px-2.5 py-1 font-sans transition-colors ${
                  activeCamera === id
                    ? "bg-amber-700 font-semibold text-white"
                    : "text-ink-700 hover:bg-parchment-200 dark:text-parchment-300 dark:hover:bg-ink-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <div className="absolute top-3 right-3 z-10 flex max-w-[24rem] flex-wrap justify-end gap-1.5 sm:top-4 sm:right-4">
          <ClaimConstraintToggle
            patentId="us-1102653-goddard-rocket"
            claimStates={claimStates}
            onToggleClaim={(claimNumber, active) =>
              setClaimStates((previous) => ({ ...previous, [claimNumber]: active }))
            }
          />
          <button
            type="button"
            onClick={() => setIsPaused((paused) => !paused)}
            aria-label={isPaused ? "Resume rigid-body pose" : "Pause rigid-body pose"}
            className="flex min-h-9 min-w-9 items-center justify-center rounded-xl border border-parchment-300 bg-white/90 p-2 text-ink-700 shadow-sm backdrop-blur-md dark:border-ink-700 dark:bg-ink-900/90 dark:text-parchment-300"
          >
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setIsCutaway((cutaway) => !cutaway)}
            aria-label="Toggle source apparatus cutaway"
            className={`flex min-h-9 min-w-9 items-center justify-center rounded-xl border p-2 shadow-sm backdrop-blur-md ${
              isCutaway
                ? "border-amber-700 bg-amber-600 text-white"
                : "border-parchment-300 bg-white/90 text-ink-700 dark:border-ink-700 dark:bg-ink-900/90 dark:text-parchment-300"
            }`}
          >
            <Layers className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowCalloutPins((shown) => !shown)}
            aria-label="Toggle facsimile element pins"
            className={`flex min-h-9 min-w-9 items-center justify-center rounded-xl border p-2 shadow-sm backdrop-blur-md ${
              showCalloutPins
                ? "border-amber-700 bg-amber-600 text-white"
                : "border-parchment-300 bg-white/90 text-ink-700 dark:border-ink-700 dark:bg-ink-900/90 dark:text-parchment-300"
            }`}
          >
            <Zap className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay((shown) => !shown)}
            aria-label={showUiOverlay ? "Hide overlay" : "Show overlay"}
            className="flex min-h-9 min-w-9 items-center justify-center rounded-xl border border-parchment-300 bg-white/90 p-2 text-ink-700 shadow-sm backdrop-blur-md dark:border-ink-700 dark:bg-ink-900/90 dark:text-parchment-300"
          >
            {showUiOverlay ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => applyCameraPreset("iso")}
            aria-label="Reset camera"
            className="flex min-h-9 min-w-9 items-center justify-center rounded-xl border border-parchment-300 bg-white/90 p-2 text-ink-700 shadow-sm backdrop-blur-md dark:border-ink-700 dark:bg-ink-900/90 dark:text-parchment-300"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        {showUiOverlay && (
          <div className="pointer-events-none absolute bottom-3 left-3 z-10 max-w-sm rounded-xl border border-parchment-300 bg-parchment-50/95 p-3 font-mono text-xs text-ink-900 shadow-md backdrop-blur-md dark:border-ink-800 dark:bg-ink-950/95 dark:text-parchment-100 sm:bottom-4 sm:left-4">
            <div className="mb-2 border-b border-parchment-200 pb-1 font-sans text-[10px] font-bold tracking-wider text-amber-700 uppercase dark:border-ink-800 dark:text-amber-400">
              US 1,102,653 source apparatus — no fabricated thrust
            </div>
            <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1">
              <span>Claim 2 tube</span>
              <span className={telemetry.claim2Satisfied ? "text-emerald-600" : "text-red-500"}>
                L/D {effectiveTubeLengthRatio.toFixed(1)} ·{" "}
                {telemetry.claim2Satisfied ? "PASS" : "FAIL"}
              </span>
              <span>Claim 1 sequence</span>
              <span
                className={telemetry.claim1SequenceSatisfied ? "text-emerald-600" : "text-red-500"}
              >
                {telemetry.claim1SequenceSatisfied ? "ordered" : "premature release"}
              </span>
              <span>Primary ω</span>
              <span>{telemetry.primaryAngularVelocityRadPerSec.toFixed(2)} rad/s</span>
              <span>Camera support ω</span>
              <span>{telemetry.cameraSupportAngularVelocityRadPerSec.toFixed(2)} rad/s</span>
            </div>
          </div>
        )}

        <StudioKernelChips
          side="right"
          visible={showUiOverlay}
          title="SOURCE-BOUNDED RIGID-BODY KINEMATICS"
          chips={[
            {
              label: "Kernel",
              value:
                kernelSource === "wasm"
                  ? "fs-mbd compiled browser kernel stepped"
                  : "typed TS fallback",
              tone: kernelSource === "wasm" ? "ok" : "warn",
            },
            { label: "Primary", value: `${primarySpinRpm.toFixed(0)}`, unit: "declared rpm" },
            {
              label: "Gyro",
              value: `${gyroSpinRpm.toFixed(0)}`,
              unit: effectiveGyroEnabled ? "declared rpm" : "omitted",
              tone: effectiveGyroEnabled && gyroSpinRpm > 0 ? "ok" : "warn",
            },
            {
              label: "Tube margin",
              value: `${telemetry.claim2RatioMargin >= 0 ? "+" : ""}${telemetry.claim2RatioMargin.toFixed(1)} D`,
              tone: telemetry.claim2Satisfied ? "ok" : "hot",
            },
            {
              label: "Auxiliary",
              value: effectiveAuxiliaryRelease === 0 ? "nested in tube 24" : "source firing path",
            },
          ]}
        />
      </div>

      <div className="space-y-4 border-t border-parchment-300 bg-parchment-100/90 p-4 dark:border-ink-800 dark:bg-ink-900/90">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SensitivitySlider
            id="tubeLengthRatio"
            patentId="us-1102653-goddard-rocket"
            paramKey="tubeLengthRatio"
            label="Tapered tube L/D"
            value={tubeLengthRatio}
            min={1.5}
            max={6}
            step={0.1}
            unit=":1"
            onChange={(value) => updateParam("tubeLengthRatio", value)}
            allParams={params}
          />
          <SensitivitySlider
            id="primarySpinRpm"
            patentId="us-1102653-goddard-rocket"
            paramKey="primarySpinRpm"
            label="Declared primary spin"
            value={primarySpinRpm}
            min={0}
            max={300}
            step={5}
            unit="rpm"
            onChange={(value) => updateParam("primarySpinRpm", value)}
            allParams={params}
          />
          <SensitivitySlider
            id="gyroSpinRpm"
            patentId="us-1102653-goddard-rocket"
            paramKey="gyroSpinRpm"
            label="Declared gyro spin"
            value={gyroSpinRpm}
            min={0}
            max={12_000}
            step={250}
            unit="rpm"
            onChange={(value) => updateParam("gyroSpinRpm", value)}
            allParams={params}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto_auto]">
          <label className="space-y-1 font-mono text-xs text-ink-700 dark:text-ink-200">
            <span className="flex justify-between gap-2">
              <span>Auxiliary release from tube 24</span>
              <span>{Math.round(auxiliaryReleaseFraction * 100)}%</span>
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.02}
              value={auxiliaryReleaseFraction}
              onChange={(event) =>
                updateParam("auxiliaryReleaseFraction", Number(event.target.value))
              }
              className="h-11 w-full cursor-pointer accent-amber-700"
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => updateParam("primaryChargeConsumed", 0)}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold ${
                !primaryChargeSubstantiallyConsumed
                  ? "border-amber-700 bg-amber-700 text-white"
                  : "border-parchment-300 bg-white text-ink-700 dark:border-ink-700 dark:bg-ink-950 dark:text-ink-200"
              }`}
            >
              Main charge burning
            </button>
            <button
              type="button"
              onClick={() => updateParam("primaryChargeConsumed", 1)}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold ${
                primaryChargeSubstantiallyConsumed
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-parchment-300 bg-white text-ink-700 dark:border-ink-700 dark:bg-ink-950 dark:text-ink-200"
              }`}
            >
              Substantially consumed
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              updateParam("gyroEnabled", gyroEnabled ? 0 : 1);
              setShowEfflux(true);
            }}
            className="rounded-xl border border-parchment-300 bg-white px-3 py-2 text-xs font-semibold text-ink-700 dark:border-ink-700 dark:bg-ink-950 dark:text-ink-200"
          >
            Gyro {gyroEnabled ? "on" : "off"}
          </button>
          <button
            type="button"
            onClick={() => {
              resetParams();
              setClaimStates({ 1: true, 2: true, 3: true, 7: true });
              setShowEfflux(true);
            }}
            className="rounded-xl border border-parchment-300 bg-white px-3 py-2 text-xs font-semibold text-ink-700 dark:border-ink-700 dark:bg-ink-950 dark:text-ink-200"
          >
            Reset apparatus
          </button>
        </div>
        <p className="text-xs leading-relaxed text-ink-600 dark:text-ink-300">
          RPM values are declared operating inputs because the facsimile prints no numerical speeds.
          FrankenSim owns the torque-free poses and ideal gyroscope isolation. The model
          intentionally publishes no mass, thrust, Mach number, liquid propellant, or trajectory.
        </p>
      </div>
    </div>
  );
}
