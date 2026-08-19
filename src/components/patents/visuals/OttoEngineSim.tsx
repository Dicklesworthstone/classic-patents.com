"use client";

import { Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { pistonSvgDisplacement, stepOttoEngine } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
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
  const cycleAngleDeg = crankAngleDeg % 720;
  const currentStroke =
    cycleAngleDeg < 180
      ? "1. INTAKE (Fuel-Air Induction)"
      : cycleAngleDeg < 360
        ? "2. COMPRESSION (Charge Squeeze)"
        : cycleAngleDeg < 540
          ? "3. POWER (Combustion Expansion)"
          : "4. EXHAUST (Scavenging Stroke)";

  const isSparkFiring = cycleAngleDeg >= 350 && cycleAngleDeg <= 370;
  const thermalEfficiencyPct = otto.thermalEfficiencyPct;
  const peakPressureBar =
    cycleAngleDeg >= 360 && cycleAngleDeg < 450 ? otto.peakFiringBar : otto.peakCompressionBar;
  const indicatedHorsepower = otto.brakeHorsepower;

  useEffect(() => {
    if (!isPlaying) return;

    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min(0.1, (time - lastTime) / 1000);
      lastTime = time;

      setCrankAngleDeg((prev) => (prev + otto.crankOmegaDegPerS * dt) % 720);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, otto.crankOmegaDegPerS]);

  // Piston linear displacement x(theta)
  const pistonDisplacement = pistonSvgDisplacement(cycleAngleDeg, otto.pistonStrokePx);

  return (
    <div className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
            Otto Four-Stroke Internal Combustion Engine (US 194,047)
          </h3>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400">
            Interactive 2D Thermodynamic Model — 4-Stroke Sequence (720° Cycle), 2:1 Camshaft Valve
            Timing, and Pre-Compression Power
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause Simulation" : "Play Simulation"}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
          >
            <Play className={`w-4 h-4 ${isPlaying ? "text-amber-600" : ""}`} />
          </button>
          <button
            type="button"
            onClick={() => {
              resetParams();
              setCrankAngleDeg(0);
            }}
            aria-label="Reset Simulation"
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => toggleSound()}
            aria-label={isAudioMuted ? "Unmute Audio" : "Mute Audio"}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
          >
            {isAudioMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-600" />
            )}
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
            width={50 + pistonDisplacement}
            height="110"
            fill={
              isSparkFiring
                ? "#ECC94B"
                : cycleAngleDeg < 180
                  ? "#63B3ED" // Intake (Blue air)
                  : cycleAngleDeg < 360
                    ? "#D69E2E" // Compression (Gold)
                    : cycleAngleDeg < 540
                      ? "#E53E3E" // Power (Fire Red)
                      : "#718096" // Exhaust (Grey smoke)
            }
            opacity="0.8"
          />

          {/* Flame Ignition Port in Slide Valve */}
          {isSparkFiring && (
            <circle cx="95" cy="170" r="14" fill="#FFFFFF" stroke="#E53E3E" strokeWidth="3" />
          )}

          {/* Reciprocating Piston Head */}
          <g transform={`translate(${145 + pistonDisplacement}, 170)`}>
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
          <g transform="translate(460, 170)">
            <circle cx="0" cy="0" r="90" fill="none" stroke="#2D3748" strokeWidth="16" />
            <circle cx="0" cy="0" r="15" fill="#111" />
            {/* Flywheel Spokes */}
            {Array.from({ length: otto.spokeCount }).map((_, i) => {
              const spkAngle = (i * otto.spokePitchDeg + (crankAngleDeg % 360)) % 360;
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
              cx={Math.cos((crankAngleDeg * Math.PI) / 180) * otto.pistonStrokePx}
              cy={Math.sin((crankAngleDeg * Math.PI) / 180) * otto.pistonStrokePx}
              r="7"
              fill="#D4AF37"
            />
          </g>

          {/* Connecting Rod */}
          <line
            x1={167 + pistonDisplacement}
            y1="170"
            x2={460 + Math.cos((crankAngleDeg * Math.PI) / 180) * otto.pistonStrokePx}
            y2={170 + Math.sin((crankAngleDeg * Math.PI) / 180) * otto.pistonStrokePx}
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
            {currentStroke} ({Math.round(cycleAngleDeg)}° / 720°)
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
