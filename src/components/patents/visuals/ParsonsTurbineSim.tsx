"use client";

import { Disc, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { parsonsIsRotor, parsonsStageHeight } from "@/physics/catalogKernels";
import { FrankenSimEngine } from "@/physics/engine";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";

export function ParsonsTurbineSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-608969-parsons-turbine");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const rotorRpm = params.rotorRpm ?? 3000;
  const inletPressurePsi = params.inletPressurePsi ?? 180;
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [angleDeg, setAngleDeg] = useState<number>(0);
  const animRef = useRef<number | null>(null);

  // Reaction Turbine Thermodynamics
  const parsons = FrankenSimEngine.stepParsonsTurbine({
    rotorRpm,
    inletPressurePsi,
  });
  const pInletMpa = parsons.inletMpa;
  const stageCount = parsons.stageCount;
  const steamBladeSpeedRatio = parsons.steamBladeSpeedRatio;

  useEffect(() => {
    if (!isPlaying) return;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min(0.1, (time - lastTime) / 1000);
      lastTime = time;

      setAngleDeg((prev) => (prev + parsons.displayOmegaDegPerS * dt) % parsons.displayWrapDeg);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, parsons.displayOmegaDegPerS, parsons.displayWrapDeg]);

  return (
    <div className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Disc className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
              Charles Parsons Multistage Reaction Steam Turbine (US 608,969)
            </h3>
          </div>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400 mt-0.5">
            Compound pressure-staging ({stageCount} rings), expanding conical casing, and dummy
            piston thrust balance.
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
            {isPlaying ? <Pause className="w-4 h-4 text-cyan-600" /> : <Play className="w-4 h-4" />}
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
              <Volume2 className="w-4 h-4 text-cyan-600" />
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              resetParams();
              setAngleDeg(0);
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
          {/* Stepped Expanding Casing (Top & Bottom halves) */}
          <polygon
            points="120,110 240,95 380,80 500,60 500,280 380,260 240,245 120,230"
            fill="#2D3748"
            stroke="#1A202C"
            strokeWidth="2"
            opacity="0.3"
          />

          {/* High-Pressure Steam Inlet Port (Left) */}
          <g transform="translate(80, 140)">
            <rect
              x="0"
              y="0"
              width="40"
              height="60"
              rx="4"
              fill="#E53E3E"
              opacity={Math.min(1, 0.55 + parsons.steamCrateDensity)}
            />
            <text
              x="-70"
              y="35"
              fill="#E53E3E"
              fontSize="10"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Inlet ({inletPressurePsi} psi)
            </text>
          </g>

          {/* Low-Pressure Exhaust to Condenser (Right) */}
          <g transform="translate(500, 110)">
            <rect x="0" y="0" width="50" height="120" rx="4" fill="#3182CE" opacity="0.6" />
            <text
              x="5"
              y="65"
              fill="#FFFFFF"
              fontSize="10"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Exhaust
            </text>
          </g>

          {/* Central Rotating Turbine Rotor Shaft */}
          <rect
            x="60"
            y="162"
            width="480"
            height="16"
            fill="#718096"
            stroke="#1A202C"
            strokeWidth="1.5"
          />

          {/* 3 Step Expansion Cylinders on Drum Rotor */}
          <rect
            x="130"
            y="145"
            width="100"
            height="50"
            fill="#4A5568"
            stroke="#2D3748"
            strokeWidth="1"
          />
          <rect
            x="240"
            y="135"
            width="130"
            height="70"
            fill="#4A5568"
            stroke="#2D3748"
            strokeWidth="1"
          />
          <rect
            x="380"
            y="120"
            width="110"
            height="100"
            fill="#4A5568"
            stroke="#2D3748"
            strokeWidth="1"
          />

          {/* Alternating Fixed Stator Blades & Moving Rotor Blade Rings */}
          {Array.from({ length: parsons.stageRingSvgCount }).map((_, i) => {
            const xPos = parsons.stageSvgOriginX + i * parsons.stageSvgPitch;
            const isRotor = parsonsIsRotor(i, parsons.rotorStageParity);
            const height = parsonsStageHeight(
              xPos,
              parsons.stageSplitX0,
              parsons.stageSplitX1,
              parsons.stageHeightNear,
              parsons.stageHeightMid,
              parsons.stageHeightFar,
            );
            return (
              <g key={`stage-ring-${xPos}`}>
                {/* Upper Blades */}
                <line
                  x1={xPos}
                  y1={parsons.bladeMidY - height}
                  x2={xPos + (isRotor ? parsons.bladeLean : -parsons.bladeLean)}
                  y2={parsons.bladeMidY - parsons.bladeGap}
                  stroke={isRotor ? "#D4AF37" : "#CBD5E0"}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Lower Blades */}
                <line
                  x1={xPos}
                  y1={parsons.bladeMidY + parsons.bladeGap}
                  x2={xPos + (isRotor ? parsons.bladeLean : -parsons.bladeLean)}
                  y2={parsons.bladeMidY + height}
                  stroke={isRotor ? "#D4AF37" : "#CBD5E0"}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </g>
            );
          })}

          {/* Axial Balancing Dummy Pistons (Opposing Thrust) */}
          <rect
            x="90"
            y="135"
            width="30"
            height="70"
            fill="#CBD5E0"
            stroke="#718096"
            strokeWidth="1"
          />
          <text
            x="60"
            y="225"
            fill="#718096"
            fontSize="9"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            Dummy Piston Balance
          </text>

          {/* Shaft-end view — display ω, not leftover rpm×6 */}
          <g transform="translate(545, 300)">
            <circle r="22" fill="#1A202C" stroke="#718096" strokeWidth="1.5" />
            <g transform={`rotate(${angleDeg})`}>
              {[0, 45, 90, 135].map((a) => (
                <line
                  key={`rotor-spoke-${a}`}
                  x1="0"
                  y1="-18"
                  x2="0"
                  y2="18"
                  transform={`rotate(${a})`}
                  stroke="#D4AF37"
                  strokeWidth="2"
                />
              ))}
            </g>
          </g>
        </svg>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Turbine Speed
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {rotorRpm} RPM · ω×{parsons.displaySlowdown} {parsons.displayOmegaDegPerS.toFixed(0)}{" "}
            °/s
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Inlet Pressure
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500">
            {pInletMpa} MPa ({inletPressurePsi} psi)
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Turbine Power
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500">
            {parsons.shaftPowerMw} MW
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Blade Speed Ratio
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {steamBladeSpeedRatio} u/c
          </span>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-parchment-200 dark:border-ink-800">
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Turbine Rotational Speed</span>
            <span className="font-mono">{rotorRpm} RPM</span>
          </div>
          <input
            type="range"
            min="1000"
            max="6000"
            step="100"
            value={rotorRpm}
            onChange={(e) => updateParam("rotorRpm", Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Boiler Superheated Steam Pressure</span>
            <span className="font-mono">{inletPressurePsi} psi</span>
          </div>
          <input
            type="range"
            min="60"
            max="300"
            step="10"
            value={inletPressurePsi}
            onChange={(e) => updateParam("inletPressurePsi", Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
