"use client";

import { AlertTriangle, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepWhitneyCottonGin } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { usePatentAudio } from "./three/usePatentAudio";

export function WhitneyCottonGinSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-x72-whitney-cotton-gin");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const crankRpm = params.crankRpm ?? 180;
  const grateClearanceMm = params.seedGridClearance ?? 3.2;
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [angle, setAngle] = useState<number>(0);
  const animRef = useRef<number | null>(null);

  const gin = stepWhitneyCottonGin({ crankRpm, seedGridClearance: grateClearanceMm });
  const sawSpeedMps = gin.sawTipSpeedMps;
  const brushRpm = gin.brushRpm;
  const ginningRateLbsPerDay = gin.outputLbsPerDay;
  const isClogged = grateClearanceMm < 1.8;
  const isSeedDamaged = grateClearanceMm > 3.8;

  useEffect(() => {
    if (!isPlaying) return;

    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min(0.1, (time - lastTime) / 1000);
      lastTime = time;

      setAngle((prev) => (prev + gin.crankOmegaDegPerS * dt) % gin.displayWrapDeg);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, gin.crankOmegaDegPerS, gin.displayWrapDeg]);

  return (
    <div className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
            Whitney Cotton Gin & Grate Separator (US X72)
          </h3>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400">
            Interactive 2D Kinematic Model — Circular Saw Teeth, Slotted Breast Grate, and
            Counter-Rotating Brush Cylinder
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

      {/* SVG Simulation Stage */}
      <div className="relative w-full aspect-[16/9] max-h-[360px] bg-parchment-100 dark:bg-ink-900 rounded-xl overflow-hidden border border-parchment-200 dark:border-ink-800 flex items-center justify-center">
        <svg viewBox="0 0 600 340" className="w-full h-full">
          {/* Hopper and Housing Frame */}
          <path
            d="M 60 40 L 180 180 L 160 300 L 40 300 Z"
            fill="#8B5A2B"
            opacity="0.15"
            stroke="#8B5A2B"
            strokeWidth="2"
          />
          <path
            d="M 180 180 L 260 220 L 250 300 L 160 300 Z"
            fill="#5C4033"
            opacity="0.2"
            stroke="#5C4033"
            strokeWidth="2"
          />

          {/* Cotton Seeds in Hopper */}
          <g transform="translate(100, 110)">
            <circle cx="0" cy="0" r="10" fill="#EAE6DF" stroke="#4A3B32" strokeWidth="1.5" />
            <circle cx="16" cy="8" r="9" fill="#EAE6DF" stroke="#4A3B32" strokeWidth="1.5" />
            <circle cx="-12" cy="14" r="8.5" fill="#EAE6DF" stroke="#4A3B32" strokeWidth="1.5" />
            <circle cx="5" cy="22" r="9.5" fill="#EAE6DF" stroke="#4A3B32" strokeWidth="1.5" />
            <circle cx="22" cy="28" r="8" fill="#EAE6DF" stroke="#4A3B32" strokeWidth="1.5" />
            {/* Seeds */}
            <circle cx="0" cy="0" r="3.5" fill="#2E1F14" />
            <circle cx="16" cy="8" r="3.5" fill="#2E1F14" />
            <circle cx="-12" cy="14" r="3" fill="#2E1F14" />
          </g>

          {/* Slotted Iron Grate Bars */}
          <g id="grate-bars">
            <line
              x1="200"
              y1="80"
              x2="200"
              y2="260"
              stroke="#333333"
              strokeWidth={gin.grateStrokePx}
              strokeLinecap="round"
            />
            <line
              x1="212"
              y1="80"
              x2="212"
              y2="260"
              stroke="#444444"
              strokeWidth={gin.grateStrokePx}
              strokeLinecap="round"
            />
            <line
              x1="224"
              y1="80"
              x2="224"
              y2="260"
              stroke="#555555"
              strokeWidth={gin.grateStrokePx}
              strokeLinecap="round"
            />
            <text x="175" y="70" fill="#666666" fontSize="10" fontFamily="sans-serif">
              Slotted Grate ({grateClearanceMm} mm)
            </text>
          </g>

          {/* Rotating Saw Cylinder */}
          <g transform={`translate(260, 170) rotate(${angle * gin.sawToCrankRatio})`}>
            <circle cx="0" cy="0" r={gin.sawSvgR} fill="#2A2A2A" stroke="#C5A059" strokeWidth="3" />
            {/* Saw teeth */}
            {Array.from({ length: gin.sawToothCount }).map((_, i) => {
              const toothAngle = i * gin.sawToothPitchDeg;
              return (
                <path
                  key={`saw-tooth-${toothAngle}`}
                  d={`M ${gin.sawSvgR} 0 L ${gin.sawToothOuterSvgR} -12 L ${gin.sawSvgR} -6 Z`}
                  fill="#D4AF37"
                  transform={`rotate(${toothAngle})`}
                />
              );
            })}
            <circle cx="0" cy="0" r="18" fill="#1A1A1A" stroke="#888" strokeWidth="2" />
          </g>

          {/* Rotating Brush Cylinder (counter-rotating at kernel brush/crank ratio) */}
          <g transform={`translate(420, 170) rotate(${-angle * gin.brushToCrankRatio})`}>
            <circle
              cx="0"
              cy="0"
              r={gin.brushSvgR}
              fill="#3D2817"
              stroke="#8B5A2B"
              strokeWidth="2"
            />
            {/* Bristles */}
            {Array.from({ length: gin.bristleCount }).map((_, i) => {
              const bristleAngle = i * gin.bristlePitchDeg;
              return (
                <line
                  key={`bristle-${bristleAngle}`}
                  x1={gin.brushSvgR}
                  y1="0"
                  x2={gin.bristleOuterSvgR}
                  y2="0"
                  stroke="#C2B280"
                  strokeWidth="2"
                  transform={`rotate(${bristleAngle})`}
                />
              );
            })}
            <circle cx="0" cy="0" r="16" fill="#1A1A1A" stroke="#888" strokeWidth="2" />
          </g>

          {/* Fiber Stream being carried away */}
          <path
            d="M 330 170 Q 380 130, 440 90 Q 500 50, 560 60"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="8"
            strokeDasharray="6 4"
            opacity={Math.min(1, 0.5 + gin.lintCrateDensity)}
          />
          <text x="450" y="50" fill="#888888" fontSize="11" fontFamily="sans-serif">
            Clean Lint Discharge
          </text>

          {/* Seeds Dropping Down Chute */}
          <g transform="translate(170, 260)">
            <circle cx="0" cy="15" r="4" fill="#2E1F14" />
            <circle cx="8" cy="30" r="4.5" fill="#2E1F14" />
            <circle cx="-6" cy="45" r="4" fill="#2E1F14" />
            <text x="-40" y="55" fill="#888888" fontSize="10" fontFamily="sans-serif">
              Seed Exit Chute
            </text>
          </g>
        </svg>

        {/* Warning Badge if misconfigured */}
        {(isClogged || isSeedDamaged) && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/90 text-white font-sans text-xs font-semibold backdrop-blur-sm shadow">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>
              {isClogged ? "Grate Too Narrow: Clogged Fibers" : "Grate Too Wide: Crushing Seeds"}
            </span>
          </div>
        )}
      </div>

      {/* Real-Time Telemetry Badge Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Saw Speed
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {sawSpeedMps} m/s
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Brush RPM
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500">
            {brushRpm.toFixed(0)} RPM
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Ginning Rate
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500">
            {ginningRateLbsPerDay} lbs/day
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Separation Mode
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {isClogged ? "Clogged" : isSeedDamaged ? "Crushing" : "Optimal"}
          </span>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-parchment-200 dark:border-ink-800">
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Hand Crank Speed</span>
            <span className="font-mono">{crankRpm} RPM</span>
          </div>
          <input
            type="range"
            min="20"
            max="120"
            step="5"
            value={crankRpm}
            onChange={(e) => updateParam("crankRpm", Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Grate Slot Clearance</span>
            <span className="font-mono">{grateClearanceMm.toFixed(1)} mm</span>
          </div>
          <input
            type="range"
            min="1.5"
            max="6.0"
            step="0.1"
            value={grateClearanceMm}
            onChange={(e) => updateParam("seedGridClearance", Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
