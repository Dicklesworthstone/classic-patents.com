"use client";

import { Flame, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect } from "react";
import { stepOttoEngine } from "@/physics/catalogKernels";
import {
  createOttoTransportUpdater,
  getOttoTapePose,
  OTTO_MODEL_CONNECTING_ROD_LENGTH,
  OTTO_MODEL_CRANK_RADIUS,
  resetOttoTapePose,
  stepOttoMechanism,
} from "@/physics/ottoKernel";
import { globalTransportBus, useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "./ClaimConstraintToggle";
import { useLiveSimParams } from "./three/useLiveSimParams";
import { usePatentAudio } from "./three/usePatentAudio";
import { useOffscreenGate } from "./useOffscreenGate";

export function OttoEngineSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-194047-otto-engine");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const engineRpm = params.engineRpm ?? 180;
  const compressionRatio = params.compressionRatio ?? 4.5;
  const claim1ChargeGradingPresent = (params.claim1ChargeGradingPresent ?? 1) >= 0.5;
  const claimStates = { 1: claim1ChargeGradingPresent };
  const otto = stepOttoEngine({ engineRpm, compressionRatio });
  const isPlaying = (params.isRunning ?? 1) >= 0.5;
  const { rootRef, onscreenRef } = useOffscreenGate<HTMLDivElement>();
  const liveControls = useLiveSimParams({ engineRpm, isPlaying, claim1ChargeGradingPresent });

  const { frame } = useFrankenSimPhysics("us-194047-otto-engine", {
    domain: "thermodynamics_transport",
    refusal: {
      isRefused: !claim1ChargeGradingPresent,
      reason: !claim1ChargeGradingPresent
        ? "Claim 1 charge grading is absent; source-bounded performance telemetry is refused."
        : undefined,
    },
    machine: {
      poseXMeters: 0,
      poseYMeters: 0,
      headingRad: 0,
      modeLabel: "stopped",
      wheelSpeedMps: 0,
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: The registered transport intentionally stays mounted while this layout-effect-synchronized ref supplies latest controls.
  useEffect(() => {
    return globalTransportBus.registerUpdater(
      "us-194047-otto-engine",
      createOttoTransportUpdater(() => ({
        engineRpm: liveControls.current.engineRpm,
        running: liveControls.current.isPlaying && onscreenRef.current,
        claim1ChargeGradingPresent: liveControls.current.claim1ChargeGradingPresent,
      })),
    );
  }, [onscreenRef]);

  const pose =
    getOttoTapePose() ??
    stepOttoMechanism({
      crankAngleRad: frame.telemetry.machine?.headingRad ?? 0,
      crankRadius: OTTO_MODEL_CRANK_RADIUS,
      connectingRodLength: OTTO_MODEL_CONNECTING_ROD_LENGTH,
      engineRpm,
    });
  const crankAngleDeg = (pose.cycleAngleRad * 180) / Math.PI;
  const mechanicalCrankAngleDeg = (Math.atan2(pose.crankPinY, pose.crankPinX) * 180) / Math.PI;

  // 4-Stroke Thermodynamics (720-degree cycle)
  const cycleAngleDeg = crankAngleDeg % otto.cycleWrapDeg;
  const strokePhase =
    pose.cyclePhase === "intake"
      ? 1
      : pose.cyclePhase === "compression"
        ? 2
        : pose.cyclePhase === "power"
          ? 3
          : 4;
  const currentStroke =
    strokePhase === 1
      ? "1. INTAKE (Air, Then Combustible Mixture)"
      : strokePhase === 2
        ? "2. COMPRESSION (Separate Charges Compressed)"
        : strokePhase === 3
          ? "3. POWER (Gradual Heat & Pressure Rise)"
          : "4. EXHAUST (Scavenging Stroke)";

  const isSparkFiring = cycleAngleDeg >= otto.sparkStartDeg && cycleAngleDeg <= otto.sparkEndDeg;
  const thermalEfficiencyPct = otto.thermalEfficiencyPct;

  // Orthographic reduction of the same fs-mbd pin coordinates consumed by 3D.
  const svgScale = otto.flywheelSvgR / OTTO_MODEL_CRANK_RADIUS;
  const pistonPinX = otto.crankCx + pose.pistonPinX * svgScale;
  const pistonGroupX = pistonPinX - 22;
  const crankPinX = otto.crankCx + pose.crankPinX * svgScale;
  const crankPinY = otto.crankCy + pose.crankPinY * svgScale;
  const cylinderOuterFaceX = 45;
  const cylinderInnerFaceX = 60;
  const gasWidth = Math.max(0, pistonGroupX - cylinderInnerFaceX);

  return (
    <div
      ref={rootRef}
      className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
              Nicolaus Otto Four-Stroke Internal Combustion Engine (US 194,047)
            </h3>
          </div>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400 mt-0.5">
            4-stroke thermodynamic sequence (720° cycle), 2:1 camshaft valve timing, and
            pre-compression.
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => {
              updateParam("isRunning", isPlaying ? 0 : 1);
              soundEngine.playSwitchClick();
            }}
            aria-label={isPlaying ? "Pause Simulation" : "Play Simulation"}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-amber-600" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              toggleSound();
              soundEngine.playSwitchClick();
            }}
            aria-label={isAudioMuted ? "Unmute Audio" : "Mute Audio"}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
          >
            {isAudioMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-600" />
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              resetParams();
              resetOttoTapePose();
              soundEngine.playSwitchClick();
            }}
            aria-label="Reset Simulation"
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Animation Stage */}
      <div className="relative w-full aspect-[16/9] max-h-[360px] bg-parchment-100 dark:bg-ink-900 rounded-xl overflow-hidden border border-parchment-200 dark:border-ink-800 flex items-center justify-center">
        <svg
          viewBox="0 0 600 340"
          role="img"
          aria-label={`Four-stroke gas engine simulation: ${isPlaying ? `crank at ${Math.round(crankAngleDeg)} degrees, ${currentStroke.toLowerCase()}, flywheel spinning` : "engine paused, flywheel stationary"}`}
          className="w-full h-full"
        >
          {/* Cylinder Block and Combustion Chamber */}
          <rect
            x={cylinderOuterFaceX}
            y="100"
            width={340 - cylinderOuterFaceX}
            height="140"
            rx="8"
            fill="#4A5568"
            stroke="#1A202C"
            strokeWidth="3"
          />

          {/* Combustion Gas Color changing with stroke */}
          <rect
            x={cylinderInnerFaceX}
            y="115"
            width={gasWidth}
            height="110"
            fill={
              isSparkFiring
                ? "#ECC94B"
                : strokePhase === 1
                  ? "#63B3ED" // Intake (Blue air)
                  : strokePhase === 2
                    ? "#D69E2E" // Compression (Gold)
                    : strokePhase === 3
                      ? "#E53E3E" // Power (Fire Red)
                      : "#718096" // Exhaust (Grey smoke)
            }
            opacity={Math.min(1, 0.55 + otto.cycleHeatSample)}
          />

          {/* Flame Ignition Port in Slide Valve */}
          {isSparkFiring && (
            <circle
              cx={cylinderInnerFaceX}
              cy="170"
              r="14"
              fill="#FFFFFF"
              stroke="#E53E3E"
              strokeWidth="3"
            />
          )}

          {/* Reciprocating Piston Head */}
          <g transform={`translate(${pistonGroupX}, ${otto.pistonSvgY})`}>
            <rect
              x="0"
              y="-50"
              width="45"
              height="100"
              rx="3"
              fill="#A0AEC0"
              stroke="#2D3748"
              strokeWidth="2"
            />
            <circle cx="22" cy="0" r="6" fill="#1A202C" />
          </g>

          {/* Crankshaft & Heavy Flywheel */}
          <g transform={`translate(${otto.crankCx}, ${otto.crankCy})`}>
            <circle
              cx="0"
              cy="0"
              r={otto.flywheelRimR}
              fill="none"
              stroke="#2D3748"
              strokeWidth="16"
            />
            <circle cx="0" cy="0" r={otto.flywheelHubR} fill="#111" />
            {/* Flywheel Spokes */}
            {Array.from({ length: otto.spokeCount }).map((_, i) => {
              const spkAngle =
                (i * otto.spokePitchDeg + mechanicalCrankAngleDeg) % otto.crankWrapDeg;
              return (
                <line
                  key={`otto-spoke-${spkAngle}`}
                  x1="0"
                  y1="0"
                  x2={Math.cos((spkAngle * Math.PI) / 180) * otto.flywheelSvgR}
                  y2={Math.sin((spkAngle * Math.PI) / 180) * otto.flywheelSvgR}
                  stroke="#4A5568"
                  strokeWidth="4"
                />
              );
            })}
            {/* Crank Pin */}
            <circle
              data-otto-crank-pin="true"
              cx={crankPinX - otto.crankCx}
              cy={crankPinY - otto.crankCy}
              r={otto.crankPinR}
              fill="#D4AF37"
            />
          </g>

          {/* Connecting Rod */}
          <line
            data-otto-connecting-rod="true"
            x1={pistonPinX}
            y1={otto.crankCy}
            x2={crankPinX}
            y2={crankPinY}
            stroke="#1A202C"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Current Stroke Banner */}
          <rect x="120" y="40" width="360" height="30" rx="6" fill="#1A202C" opacity="0.9" />
          <text
            x="300"
            y="60"
            fill="#ECC94B"
            fontWeight="bold"
            fontSize="13"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            {currentStroke} ({Math.round(cycleAngleDeg)}° / {otto.cycleWrapDeg}°)
          </text>
        </svg>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Engine Speed
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {engineRpm} RPM
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Counter-Shaft K
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500">
            {(engineRpm / 2).toFixed(1)} RPM
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Claim 1 Charge
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500">
            {claim1ChargeGradingPresent ? "GRADED" : "ABSENT"}
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Modern Ideal η
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {thermalEfficiencyPct}%
          </span>
          <span className="block text-[9px] text-ink-500 dark:text-ink-400">
            declared r · not measured
          </span>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-parchment-200 dark:border-ink-800">
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Crankshaft Rotational Speed</span>
            <span className="font-mono">{engineRpm} RPM</span>
          </div>
          <input
            type="range"
            min="60"
            max="320"
            step="10"
            value={engineRpm}
            onChange={(e) => updateParam("engineRpm", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Declared Analysis Compression Ratio (r)</span>
            <span className="font-mono">{compressionRatio}:1</span>
          </div>
          <input
            type="range"
            min="3.0"
            max="8.0"
            step="0.5"
            value={compressionRatio}
            onChange={(e) => updateParam("compressionRatio", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </div>
      </div>

      <ClaimConstraintToggle
        patentId="us-194047-otto-engine"
        claimStates={claimStates}
        onToggleClaim={(_claimNo, active) =>
          updateParam("claim1ChargeGradingPresent", active ? 1 : 0)
        }
        className="mt-4"
      />
    </div>
  );
}
