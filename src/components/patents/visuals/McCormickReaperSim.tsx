"use client";

import { Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepMcCormickReaper } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

export function McCormickReaperSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-x8277-mccormick-reaper");
  const groundSpeedMph = params.forwardSpeedMph ?? params.groundSpeedMph ?? 2.5;
  const reaper = stepMcCormickReaper({ forwardSpeedMph: groundSpeedMph });
  const cutterCyclesPerSecond = reaper.cutterHz;
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [phase, setPhase] = useState<number>(0);
  const animRef = useRef<number | null>(null);

  const groundSpeedMps = reaper.groundSpeedMps;
  const reelRpm = reaper.reelRpm;

  useEffect(() => {
    if (!isPlaying) return;
    const loop = () => {
      // Fixed presentation steps make the visual reproducible from the same
      // shared control state. They do not claim to be a physical time solver.
      setPhase((prev) => (prev + (cutterCyclesPerSecond * (2 * Math.PI)) / 60) % (2 * Math.PI));
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, cutterCyclesPerSecond]);

  const cutterX = Math.sin(phase) * 18;
  const reelAngleDeg =
    (phase * (reelRpm / Math.max(cutterCyclesPerSecond * 60, 1)) * (180 / Math.PI)) % 360;

  return (
    <div className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
            McCormick Reaper Motion Transmission (US X8277)
          </h3>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400">
            Interactive 2D host estimate from the printed wheel, gear, and pulley dimensions; not a
            measured field-performance simulation.
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
        </div>
      </div>

      {/* SVG Animation Stage */}
      <div className="relative w-full aspect-[16/9] max-h-[360px] bg-parchment-100 dark:bg-ink-900 rounded-xl overflow-hidden border border-parchment-200 dark:border-ink-800 flex items-center justify-center">
        <svg viewBox="0 0 600 340" className="w-full h-full">
          {/* Standing Grain Stems */}
          <g id="grain-field" opacity="0.6">
            {Array.from({ length: 14 }).map((_, i) => (
              <path
                key={`stem-${i * 12}`}
                d={`M ${60 + i * 14} 280 Q ${65 + i * 14} 200, ${58 + i * 14} 120`}
                stroke="#D4AF37"
                strokeWidth="2.5"
                fill="none"
              />
            ))}
          </g>

          {/* Grain Platform Frame & Catch Bed */}
          <rect
            x="230"
            y="210"
            width="310"
            height="70"
            rx="4"
            fill="#8B5A2B"
            opacity="0.25"
            stroke="#5C4033"
            strokeWidth="2"
          />
          <text x="350" y="250" fill="#888888" fontSize="12" fontFamily="sans-serif">
            Reaper Collection Platform
          </text>

          {/* Stationary Guard Fingers (Knife Guards) */}
          <g id="guard-fingers" transform="translate(180, 210)">
            {Array.from({ length: 12 }).map((_, i) => (
              <polygon
                key={`guard-${i * 24}`}
                points={`${i * 25},0 ${i * 25 + 12},-35 ${i * 25 + 24},0`}
                fill="#3A3A3A"
                stroke="#1A1A1A"
                strokeWidth="1.5"
              />
            ))}
          </g>

          {/* Reciprocating Serrated Sickle Blade */}
          <g id="sickle-blade" transform={`translate(${180 + cutterX}, 205)`}>
            <rect x="0" y="0" width="280" height="6" fill="#C5A059" stroke="#888" strokeWidth="1" />
            {Array.from({ length: 11 }).map((_, i) => (
              <polygon
                key={`sickle-tooth-${i * 25}`}
                points={`${i * 25 + 5},0 ${i * 25 + 16},-26 ${i * 25 + 27},0`}
                fill="#E5E4E2"
                stroke="#4A4A4A"
                strokeWidth="1"
              />
            ))}
          </g>

          {/* 4-Vane Rotating Reel */}
          <g transform={`translate(220, 110) rotate(${reelAngleDeg})`}>
            <circle cx="0" cy="0" r="8" fill="#1A1A1A" />
            {/* 4 Reel Arms & Slats */}
            {Array.from({ length: 4 }).map((_, i) => {
              const armAngle = i * 90;
              return (
                <g key={`reel-arm-${armAngle}`} transform={`rotate(${armAngle})`}>
                  <line x1="0" y1="0" x2="95" y2="0" stroke="#8B5A2B" strokeWidth="3.5" />
                  <rect
                    x="85"
                    y="-12"
                    width="22"
                    height="24"
                    rx="2"
                    fill="#D4AF37"
                    stroke="#8B5A2B"
                    strokeWidth="1.5"
                  />
                </g>
              );
            })}
          </g>

          {/* Pitman Rod & Crank Drive */}
          <g transform="translate(130, 208)">
            <line
              x1="-50"
              y1="0"
              x2={cutterX + 50}
              y2="0"
              stroke="#333333"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="-50" cy="0" r="14" fill="#666666" stroke="#222" strokeWidth="2" />
            <circle cx={-50 + Math.cos(phase) * 8} cy={Math.sin(phase) * 8} r="5" fill="#C5A059" />
          </g>

          {/* Grain Divider Point */}
          <polygon
            points="50,280 180,210 180,240 70,290"
            fill="#C5A059"
            stroke="#8B5A2B"
            strokeWidth="2"
            opacity="0.8"
          />
          <text
            x="65"
            y="270"
            fill="#3D2817"
            fontSize="10"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            Grain Divider
          </text>
        </svg>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Ground Speed
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {groundSpeedMps} m/s ({groundSpeedMph} mph)
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Cutter Crank Estimate
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500">
            {reaper.cutterCrankRpm} RPM
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Ground Wheel Estimate
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500">
            {reaper.groundWheelRpm} RPM
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Reel Belt Estimate
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {reelRpm} RPM
          </span>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-parchment-200 dark:border-ink-800">
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Horse Ground Speed</span>
            <span className="font-mono">{groundSpeedMph.toFixed(1)} mph</span>
          </div>
          <input
            type="range"
            min="1.5"
            max="5.0"
            step="0.2"
            value={groundSpeedMph}
            onChange={(e) => updateParam("groundSpeedMph", Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>13-inch to 12-inch Reel Belt</span>
            <span className="font-mono">{reelRpm} RPM</span>
          </div>
          <div className="h-2 rounded bg-parchment-200 dark:bg-ink-800 overflow-hidden">
            <div
              className="h-full bg-amber-600"
              style={{ width: `${Math.min(100, (reelRpm / 80) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
