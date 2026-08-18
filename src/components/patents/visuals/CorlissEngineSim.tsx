"use client";

import { Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepCorlissEngine } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { usePatentAudio } from "./three/usePatentAudio";

export function CorlissEngineSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-6162-corliss-steam-engine");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const boilerPressurePsi = params.steamPressurePsi ?? params.boilerPressurePsi ?? 100;
  const cutoffFractionPct = params.cutoffPct ?? params.cutoffRatioPct ?? 25;
  const engineRpm = params.engineRpm ?? params.rpm ?? 65;
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [crankAngleDeg, setCrankAngleDeg] = useState<number>(0);
  const animRef = useRef<number | null>(null);

  const corliss = stepCorlissEngine({
    steamPressurePsi: boilerPressurePsi,
    engineRpm,
    cutoffPct: cutoffFractionPct,
  });
  const pBoilerMpa = corliss.boilerMpa;
  const expansionRatio = corliss.expansionRatio;
  const indicatedHorsepower = corliss.indicatedHp;
  const thermalEfficiencyPct = corliss.thermalEfficiencyPct;

  useEffect(() => {
    if (!isPlaying) return;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      setCrankAngleDeg((prev) => (prev + engineRpm * 6 * dt) % 360);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, engineRpm]);

  // Kinematic calculations for piston & wrist-plate
  const pistonStroke = Math.sin((crankAngleDeg * Math.PI) / 180) * 45;
  const wristPlateAngle = Math.sin(((crankAngleDeg + 90) * Math.PI) / 180) * 22;
  const isIntakeOpen = crankAngleDeg % 180 < (cutoffFractionPct / 100) * 180;

  return (
    <div className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
            Corliss Steam Engine & Wrist-Plate Gear (US 6,162)
          </h3>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400">
            Interactive 2D Thermodynamic Model — Central Oscillating Wrist-Plate, 4 Rotary Valves,
            and Dashpot Trip Cut-Off
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
          {/* Steam Cylinder Block */}
          <rect
            x="60"
            y="90"
            width="220"
            height="160"
            rx="8"
            fill="#3D3D3D"
            stroke="#222"
            strokeWidth="3"
          />
          <rect x="75" y="110" width="190" height="120" fill="#1A1A1A" />

          {/* 4 Rotary Corliss Valves at 4 Corners */}
          {/* Top Left: Steam Intake Left */}
          <g transform="translate(85, 100)">
            <circle cx="0" cy="0" r="16" fill="#8B5A2B" stroke="#D4AF37" strokeWidth="2" />
            <line
              x1="-14"
              y1="0"
              x2="14"
              y2="0"
              stroke={isIntakeOpen ? "#38A169" : "#E53E3E"}
              strokeWidth="4"
            />
          </g>
          {/* Top Right: Steam Intake Right */}
          <g transform="translate(255, 100)">
            <circle cx="0" cy="0" r="16" fill="#8B5A2B" stroke="#D4AF37" strokeWidth="2" />
            <line
              x1="-14"
              y1="0"
              x2="14"
              y2="0"
              stroke={!isIntakeOpen ? "#38A169" : "#E53E3E"}
              strokeWidth="4"
            />
          </g>
          {/* Bottom Left: Exhaust Left */}
          <g transform="translate(85, 240)">
            <circle cx="0" cy="0" r="16" fill="#5C4033" stroke="#888" strokeWidth="2" />
            <line
              x1="-14"
              y1="0"
              x2="14"
              y2="0"
              stroke={!isIntakeOpen ? "#38A169" : "#E53E3E"}
              strokeWidth="4"
            />
          </g>
          {/* Bottom Right: Exhaust Right */}
          <g transform="translate(255, 240)">
            <circle cx="0" cy="0" r="16" fill="#5C4033" stroke="#888" strokeWidth="2" />
            <line
              x1="-14"
              y1="0"
              x2="14"
              y2="0"
              stroke={isIntakeOpen ? "#38A169" : "#E53E3E"}
              strokeWidth="4"
            />
          </g>

          {/* Reciprocating Steam Piston & Rod */}
          <g transform={`translate(${170 + pistonStroke}, 170)`}>
            <rect
              x="-18"
              y="-55"
              width="36"
              height="110"
              rx="3"
              fill="#A0AEC0"
              stroke="#4A5568"
              strokeWidth="2"
            />
            <rect
              x="18"
              y="-6"
              width="170"
              height="12"
              fill="#CBD5E0"
              stroke="#718096"
              strokeWidth="1"
            />
          </g>

          {/* Central Oscillating Wrist-Plate (Corliss Valve Hub) */}
          <g transform={`translate(170, 170) rotate(${wristPlateAngle})`}>
            <circle cx="0" cy="0" r="32" fill="#C5A059" stroke="#5C4033" strokeWidth="2" />
            <circle cx="0" cy="0" r="8" fill="#222" />
            {/* 4 Connecting Valve Linkage Pins */}
            <circle cx="-18" cy="-18" r="4.5" fill="#3D3D3D" />
            <circle cx="18" cy="-18" r="4.5" fill="#3D3D3D" />
            <circle cx="-18" cy="18" r="4.5" fill="#3D3D3D" />
            <circle cx="18" cy="18" r="4.5" fill="#3D3D3D" />
          </g>
          <text
            x="135"
            y="174"
            fill="#1A1A1A"
            fontSize="9"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            Wrist-Plate
          </text>

          {/* Valve Linkage Rods from Wrist-Plate to Valves */}
          <line x1="152" y1="152" x2="85" y2="100" stroke="#8B5A2B" strokeWidth="2.5" />
          <line x1="188" y1="152" x2="255" y2="100" stroke="#8B5A2B" strokeWidth="2.5" />
          <line x1="152" y1="188" x2="85" y2="240" stroke="#8B5A2B" strokeWidth="2.5" />
          <line x1="188" y1="188" x2="255" y2="240" stroke="#8B5A2B" strokeWidth="2.5" />

          {/* Connecting Rod & Giant Flywheel */}
          <g transform="translate(480, 170)">
            <circle cx="0" cy="0" r="95" fill="none" stroke="#4A5568" strokeWidth="16" />
            <circle cx="0" cy="0" r="14" fill="#222" />
            {/* Flywheel Spokes */}
            {Array.from({ length: 6 }).map((_, i) => {
              const spkAngle = (i * 60 + crankAngleDeg) % 360;
              return (
                <line
                  key={`spoke-${spkAngle}`}
                  x1="0"
                  y1="0"
                  x2={Math.cos((spkAngle * Math.PI) / 180) * 85}
                  y2={Math.sin((spkAngle * Math.PI) / 180) * 85}
                  stroke="#718096"
                  strokeWidth="4"
                />
              );
            })}
            {/* Crank Pin */}
            <circle
              cx={Math.cos((crankAngleDeg * Math.PI) / 180) * 45}
              cy={Math.sin((crankAngleDeg * Math.PI) / 180) * 45}
              r="7"
              fill="#D4AF37"
            />
          </g>

          {/* Main Connecting Rod */}
          <line
            x1={358 + pistonStroke}
            y1="170"
            x2={480 + Math.cos((crankAngleDeg * Math.PI) / 180) * 45}
            y2={170 + Math.sin((crankAngleDeg * Math.PI) / 180) * 45}
            stroke="#2D3748"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Boiler Pressure
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {pBoilerMpa} MPa ({boilerPressurePsi} psi)
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Expansion Ratio
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500">
            {expansionRatio}:1 ({cutoffFractionPct}% cut-off)
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
            <span>Boiler Steam Pressure</span>
            <span className="font-mono">{boilerPressurePsi} psi</span>
          </div>
          <input
            type="range"
            min="40"
            max="180"
            step="5"
            value={boilerPressurePsi}
            onChange={(e) => updateParam("boilerPressurePsi", Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Cut-Off Stroke Ratio (Governor)</span>
            <span className="font-mono">{cutoffFractionPct}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="60"
            step="2"
            value={cutoffFractionPct}
            onChange={(e) => updateParam("cutoffRatioPct", Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
