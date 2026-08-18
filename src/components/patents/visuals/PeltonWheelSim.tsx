"use client";

import { Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepPeltonWheel } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { usePatentAudio } from "./three/usePatentAudio";

export function PeltonWheelSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-233692-pelton-water-wheel");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const waterHeadMeters = params.headMeters ?? 450;
  const wheelRpm = params.runnerRpm ?? 600;
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [wheelAngleDeg, setWheelAngleDeg] = useState<number>(0);
  const animRef = useRef<number | null>(null);

  const pelton = stepPeltonWheel({ headMeters: waterHeadMeters, runnerRpm: wheelRpm });
  const jetVelocityMps = pelton.jetVelocityMps;
  const optimalSpeedRatio = pelton.speedRatio;
  const turbineEfficiencyPct = pelton.etaPct;
  const shaftPowerKw = pelton.shaftPowerKw;

  useEffect(() => {
    if (!isPlaying) return;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      setWheelAngleDeg((prev) => (prev + wheelRpm * 6 * dt) % 360);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, wheelRpm]);

  return (
    <div className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
            Pelton Split-Bucket Impulse Turbine (US 233,692)
          </h3>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400">
            Interactive 2D Hydrodynamic Model — High-Head Water Jet, Knife-Edge Splitter Wedge, and
            170° Flow Reversal
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
            onClick={resetParams}
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
          {/* High-Pressure Needle Nozzle (Left) */}
          <g transform="translate(60, 260)">
            <polygon
              points="0,-15 100,-8 100,8 0,15"
              fill="#4A5568"
              stroke="#2D3748"
              strokeWidth="2"
            />
            <polygon
              points="100,-8 130,-4 130,4 100,8"
              fill="#D4AF37"
              stroke="#8B5A2B"
              strokeWidth="1.5"
            />
            <text
              x="-40"
              y="5"
              fill="#4A5568"
              fontSize="10"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Penstock Nozzle
            </text>
          </g>

          {/* High-Velocity Supersonic Water Jet */}
          <line
            x1="190"
            y1="260"
            x2="360"
            y2="260"
            stroke="#3182CE"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Pelton Turbine Runner Disk (Center) */}
          <g transform={`translate(360, 150) rotate(${wheelAngleDeg})`}>
            {/* Center Hub */}
            <circle cx="0" cy="0" r="75" fill="#2D3748" stroke="#1A202C" strokeWidth="4" />
            <circle cx="0" cy="0" r="18" fill="#1A1A1A" />

            {/* Perimeter Split Buckets */}
            {Array.from({ length: 12 }).map((_, i) => {
              const bAngle = (i * 360) / 12;
              return (
                <g key={`pelton-bucket-${bAngle}`} transform={`rotate(${bAngle}) translate(0, 75)`}>
                  {/* Double-cup bucket profile */}
                  <path
                    d="M -14 0 Q -18 22, -8 30 Q 0 15, 0 5 Q 0 15, 8 30 Q 18 22, 14 0 Z"
                    fill="#D4AF37"
                    stroke="#744210"
                    strokeWidth="1.5"
                  />
                  {/* Knife edge splitter line */}
                  <line x1="0" y1="5" x2="0" y2="28" stroke="#FFFFFF" strokeWidth="1.5" />
                </g>
              );
            })}
          </g>

          {/* Symmetrical 170-degree Reversed Water Discharge Sheets */}
          <path
            d="M 360 260 Q 320 280, 270 310"
            stroke="#63B3ED"
            strokeWidth="4"
            fill="none"
            opacity="0.8"
          />
          <path
            d="M 360 260 Q 400 280, 450 310"
            stroke="#63B3ED"
            strokeWidth="4"
            fill="none"
            opacity="0.8"
          />
          <text
            x="320"
            y="325"
            fill="#3182CE"
            fontSize="10"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            Reversed Discharge Flow (Exit Velocity ≈ 0)
          </text>
        </svg>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Jet Velocity
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {jetVelocityMps} m/s · u {pelton.bucketSpeedMps} m/s
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Speed Ratio (u/v)
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500">
            {optimalSpeedRatio} (Optimal: 0.50)
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Shaft Output
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500">
            {shaftPowerKw} kW
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Hydro Efficiency
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {turbineEfficiencyPct}%
          </span>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-parchment-200 dark:border-ink-800">
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Alpine Hydraulic Head (H)</span>
            <span className="font-mono">{waterHeadMeters} meters</span>
          </div>
          <input
            type="range"
            min="50"
            max="600"
            step="25"
            value={waterHeadMeters}
            onChange={(e) => updateParam("headMeters", Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Turbine Runner Speed</span>
            <span className="font-mono">{wheelRpm} RPM</span>
          </div>
          <input
            type="range"
            min="100"
            max="900"
            step="25"
            value={wheelRpm}
            onChange={(e) => updateParam("runnerRpm", Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
