"use client";

import { Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FrankenSimEngine } from "@/physics/engine";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { usePatentAudio } from "./three/usePatentAudio";

export function DieselEngineSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-542846-diesel-engine");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const compressionRatio = params.compRatio ?? 18;
  const engineRpm = params.engineRpm ?? 150;
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [crankAngleDeg, setCrankAngleDeg] = useState<number>(0);
  const animRef = useRef<number | null>(null);

  const diesel = FrankenSimEngine.stepDieselEngine({
    compressionRatio,
    blastAirPressureBar: params.blastAirPressure ?? 65,
    cutoffRatio: params.cutoffRatio ?? 1.6,
    engineRpm,
  });
  const peakAirTempC = diesel.tCompressionC;
  const peakAirTempKelvin = peakAirTempC + 273;
  const isAutoIgnition = diesel.isAutoIgnition;
  const peakPressureAtm = diesel.pCompBar;
  const thermalEfficiencyPct = diesel.idealEfficiencyPct;
  const brakeEfficiencyPct = diesel.brakeEfficiencyPct;

  useEffect(() => {
    if (!isPlaying) return;

    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min(0.1, (time - lastTime) / 1000);
      lastTime = time;

      setCrankAngleDeg((prev) => (prev + diesel.crankOmegaDegPerS * dt) % 720);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, diesel.crankOmegaDegPerS]);

  const cycleAngleDeg = crankAngleDeg % 720;
  const isInjectingFuel = cycleAngleDeg >= 355 && cycleAngleDeg <= 390;
  const crankRad = ((cycleAngleDeg % 360) * Math.PI) / 180;
  const pistonDisplacement = (1 - Math.cos(crankRad)) * 35;

  return (
    <div className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
            Diesel Rational Heat Motor & Auto-Ignition (US 542,846)
          </h3>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400">
            Interactive 2D Thermodynamic Model — High Adiabatic Compression (16:1, 600°C+),
            Air-Blast Fuel Injection, and Constant-Pressure Combustion
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
          {/* Heavy Cast-Steel Cylinder Liner */}
          <rect
            x="220"
            y="50"
            width="160"
            height="160"
            rx="8"
            fill="#2D3748"
            stroke="#1A202C"
            strokeWidth="3"
          />

          {/* Compressed Hot Air Gas Column */}
          <rect
            x="235"
            y="65"
            width="130"
            height={20 + pistonDisplacement}
            fill={
              isInjectingFuel
                ? "#E53E3E"
                : cycleAngleDeg > 270 && cycleAngleDeg < 450
                  ? "#DD6B20"
                  : "#4299E1"
            }
            opacity="0.85"
          />

          {/* High-Pressure Air-Blast Fuel Injection Nozzle (Top Center) */}
          <g transform="translate(300, 50)">
            <rect
              x="-8"
              y="-15"
              width="16"
              height="25"
              rx="3"
              fill="#B87333"
              stroke="#8B5A2B"
              strokeWidth="1.5"
            />
            {isInjectingFuel && (
              <g>
                <polygon points="0,10 -15,40 15,40" fill="#ECC94B" opacity="0.9" />
                <circle cx="0" cy="25" r="10" fill="#FFFFFF" opacity="0.95" />
              </g>
            )}
            <text
              x="18"
              y="-5"
              fill="#B87333"
              fontSize="9"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Air-Blast Injector
            </text>
          </g>

          {/* Trunk Piston Head with Pressure Rings */}
          <g transform={`translate(235, ${75 + pistonDisplacement})`}>
            <rect
              x="0"
              y="0"
              width="130"
              height="55"
              rx="4"
              fill="#A0AEC0"
              stroke="#2D3748"
              strokeWidth="2"
            />
            <circle cx="65" cy="28" r="7" fill="#1A202C" />
            {/* Piston Rings */}
            <line x1="0" y1="8" x2="130" y2="8" stroke="#1A202C" strokeWidth="1.5" />
            <line x1="0" y1="16" x2="130" y2="16" stroke="#1A202C" strokeWidth="1.5" />
            <line x1="0" y1="24" x2="130" y2="24" stroke="#1A202C" strokeWidth="1.5" />
          </g>

          {/* Massive Flywheel & Crankshaft */}
          <g transform="translate(300, 260)">
            <circle cx="0" cy="0" r="65" fill="none" stroke="#2D3748" strokeWidth="14" />
            <circle cx="0" cy="0" r="14" fill="#111" />
            {/* Crank Pin */}
            <circle
              cx={Math.cos(crankRad) * 35}
              cy={Math.sin(crankRad) * 35}
              r="7"
              fill="#D4AF37"
            />
          </g>

          {/* Connecting Rod */}
          <line
            x1={300}
            y1={103 + pistonDisplacement}
            x2={300 + Math.cos(crankRad) * 35}
            y2={260 + Math.sin(crankRad) * 35}
            stroke="#1A202C"
            strokeWidth="7"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Compression Temp
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {peakAirTempC}°C ({peakAirTempKelvin} K)
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Peak Pressure
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500">
            {peakPressureAtm} atm (r={compressionRatio}:1)
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Brake η / Fire
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500">
            {brakeEfficiencyPct}% {isAutoIgnition ? "FIRE" : "NO FIRE"}
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
            <span>Compression Ratio (r)</span>
            <span className="font-mono">{compressionRatio}:1</span>
          </div>
          <input
            type="range"
            min="12"
            max="22"
            step="0.5"
            value={compressionRatio}
            onChange={(e) => updateParam("compRatio", Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Engine Rotational Speed</span>
            <span className="font-mono">{engineRpm} RPM</span>
          </div>
          <input
            type="range"
            min="60"
            max="300"
            step="10"
            value={engineRpm}
            onChange={(e) => updateParam("engineRpm", Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
