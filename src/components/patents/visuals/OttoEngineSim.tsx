"use client";

import { Flame, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  ottoConnectingRod,
  ottoStrokePhase,
  pistonSvgDisplacement,
  stepOttoEngine,
} from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";

export function OttoEngineSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-194047-otto-engine");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const engineRpm = params.engineRpm ?? 180;
  const compressionRatio = params.compressionRatio ?? 4.5;
  const otto = stepOttoEngine({ engineRpm, compressionRatio });
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [crankAngleDeg, setCrankAngleDeg] = useState<number>(0);
  const animRef = useRef<number | null>(null);

  // 4-Stroke Thermodynamics (720-degree cycle)
  const cycleAngleDeg = crankAngleDeg % otto.cycleWrapDeg;
  const strokePhase = ottoStrokePhase(
    cycleAngleDeg,
    otto.stroke1EndDeg,
    otto.stroke2EndDeg,
    otto.stroke3EndDeg,
  );
  const currentStroke =
    strokePhase === 1
      ? "1. INTAKE (Fuel-Air Induction)"
      : strokePhase === 2
        ? "2. COMPRESSION (Charge Squeeze)"
        : strokePhase === 3
          ? "3. POWER (Combustion Expansion)"
          : "4. EXHAUST (Scavenging Stroke)";

  const isSparkFiring = cycleAngleDeg >= otto.sparkStartDeg && cycleAngleDeg <= otto.sparkEndDeg;
  const thermalEfficiencyPct = otto.thermalEfficiencyPct;
  const peakPressureBar =
    cycleAngleDeg >= otto.firingStartDeg && cycleAngleDeg < otto.firingEndDeg
      ? otto.peakFiringBar
      : otto.peakCompressionBar;
  const indicatedHorsepower = otto.brakeHorsepower;

  useEffect(() => {
    if (!isPlaying) return;

    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min(0.1, (time - lastTime) / 1000);
      lastTime = time;

      setCrankAngleDeg((prev) => (prev + otto.crankOmegaDegPerS * dt) % otto.cycleWrapDeg);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, otto.crankOmegaDegPerS, otto.cycleWrapDeg]);

  // Piston linear displacement x(theta)
  const pistonDisplacement = pistonSvgDisplacement(cycleAngleDeg, otto.pistonStrokePx);
  const connectingRod = ottoConnectingRod(
    crankAngleDeg,
    pistonDisplacement,
    otto.pistonStrokePx,
    otto.crankCx,
    otto.crankCy,
    otto.rodOriginY0,
  );

  return (
    <div className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors">
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
              setIsPlaying(!isPlaying);
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
              setCrankAngleDeg(0);
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
        <svg viewBox="0 0 600 340" className="w-full h-full">
          {/* Cylinder Block and Combustion Chamber */}
          <rect
            x="80"
            y="100"
            width="260"
            height="140"
            rx="8"
            fill="#4A5568"
            stroke="#1A202C"
            strokeWidth="3"
          />

          {/* Combustion Gas Color changing with stroke */}
          <rect
            x="95"
            y="115"
            width={otto.gasChargeW0 + pistonDisplacement}
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
            <circle cx="95" cy="170" r="14" fill="#FFFFFF" stroke="#E53E3E" strokeWidth="3" />
          )}

          {/* Reciprocating Piston Head */}
          <g transform={`translate(${otto.pistonSvgX + pistonDisplacement}, ${otto.pistonSvgY})`}>
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
                (i * otto.spokePitchDeg + (crankAngleDeg % otto.crankWrapDeg)) % otto.crankWrapDeg;
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
              cx={connectingRod.x2 - otto.crankCx}
              cy={connectingRod.y2 - otto.crankCy}
              r={otto.crankPinR}
              fill="#D4AF37"
            />
          </g>

          {/* Connecting Rod */}
          <line
            x1={connectingRod.x1}
            y1={connectingRod.y1}
            x2={connectingRod.x2}
            y2={connectingRod.y2}
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
            Peak Pressure
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500">
            {peakPressureBar} bar · P2 {otto.peakCompressionBar} / P3 {otto.peakFiringBar}
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Indicated Power
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500">
            {indicatedHorsepower} hp
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Thermal Efficiency
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {thermalEfficiencyPct}%
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
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Compression Ratio (r)</span>
            <span className="font-mono">{compressionRatio}:1</span>
          </div>
          <input
            type="range"
            min="3.0"
            max="8.0"
            step="0.5"
            value={compressionRatio}
            onChange={(e) => updateParam("compressionRatio", Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
