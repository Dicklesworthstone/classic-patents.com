"use client";

import { Disc, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepDeLavalSeparator } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";
import { useOffscreenGate } from "./useOffscreenGate";

export function DeLavalSeparatorSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-247804-delaval-separator");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const bowlRpm = params.bowlRpm ?? 6500;
  const rawMilkFlowLph = params.rawMilkFlowLph ?? 300;
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [angleDeg, setAngleDeg] = useState<number>(0);
  const animRef = useRef<number | null>(null);
  const { rootRef, onscreenRef } = useOffscreenGate<HTMLDivElement>();

  const sep = stepDeLavalSeparator({ bowlRpm, rawMilkFlowLph });
  const centrifugalAccG = sep.gForce;
  const creamYieldLph = sep.creamFlowLph;
  const skimMilkYieldLph = sep.skimFlowLph;
  const separationEfficiencyPct = sep.fatYieldPct;

  useEffect(() => {
    if (!isPlaying) return;

    let lastTime = performance.now();

    const loop = (time: number) => {
      animRef.current = requestAnimationFrame(loop);
      if (!onscreenRef.current) return;
      const dt = Math.min(0.1, (time - lastTime) / 1000);
      lastTime = time;

      setAngleDeg((prev) => (prev + sep.displayOmegaDegPerS * dt) % sep.displayWrapDeg);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, sep.displayOmegaDegPerS, sep.displayWrapDeg, onscreenRef.current]);

  return (
    <div
      ref={rootRef}
      className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Disc className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
              Gustaf de Laval Continuous Centrifugal Cream Separator (US 247,804)
            </h3>
          </div>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400 mt-0.5">
            High-G artificial gravity (4,000+ G), concentric fluid density stratification, and dual
            spout discharge.
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
        <svg
          viewBox="0 0 600 340"
          role="img"
          aria-label={`De Laval cream separator simulation: ${isPlaying ? "bowl spinning" : "stopped"}, rotor angle ${Math.round(angleDeg)} degrees`}
          className="w-full h-full"
        >
          {/* Vertical Separating Rotor Bowl Cross Section */}
          <g transform="translate(300, 180)">
            {/* Outer Forged Steel Bowl Wall */}
            <path
              d="M -90 -60 L -110 50 Q -100 80, 0 80 Q 100 80, 110 50 L 90 -60 Z"
              fill="#2D3748"
              stroke="#1A202C"
              strokeWidth="3"
            />

            {/* Stratified Fluid Layers inside Bowl */}
            {/* Outer Layer: Dense Skim Milk (Blue/Grey) */}
            <path
              d="M -85 -55 L -105 45 Q -95 72, 0 72 Q 95 72, 105 45 L 85 -55 Z"
              fill="#4299E1"
              opacity={Math.min(1, 0.55 + sep.skimCrateDensity)}
            />

            {/* Inner Core Layer: Light Butterfat Cream (Yellow) */}
            <path
              d="M -45 -55 L -55 45 Q -45 65, 0 65 Q 45 65, 55 45 L 45 -55 Z"
              fill="#ECC94B"
              opacity={Math.min(1, 0.65 + sep.creamCrateDensity)}
            />

            {/* Nested disc vanes — display ω, not leftover rpm×6 */}
            <g transform={`rotate(${angleDeg})`}>
              {[0, 45, 90, 135].map((a) => (
                <line
                  key={`disc-vane-${a}`}
                  x1="0"
                  y1="-48"
                  x2="0"
                  y2="48"
                  transform={`rotate(${a})`}
                  stroke="#E2E8F0"
                  strokeWidth="1.5"
                  opacity="0.55"
                />
              ))}
            </g>

            {/* Central Vertical Feed Spindle */}
            <rect
              x="-8"
              y="-90"
              width="16"
              height="170"
              fill="#CBD5E0"
              stroke="#4A5568"
              strokeWidth="1"
            />

            {/* Skim Milk Climbing Conduit Tube */}
            <path
              d="M -95 30 L -75 -65 L -140 -80"
              stroke="#3182CE"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />
            <text
              x="-195"
              y="-85"
              fill="#3182CE"
              fontSize="10"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Skim Spout ({skimMilkYieldLph} L/h)
            </text>

            {/* Cream Central Overflow Weir */}
            <path
              d="M 40 -55 L 45 -70 L 130 -80"
              stroke="#D69E2E"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />
            <text
              x="135"
              y="-85"
              fill="#D69E2E"
              fontSize="10"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Cream Spout ({creamYieldLph} L/h)
            </text>

            {/* Central Raw Milk Feed Stream */}
            <line
              x1="0"
              y1="-120"
              x2="0"
              y2="-60"
              stroke="#FFFFFF"
              strokeWidth="6"
              strokeDasharray="4 4"
            />
            <text
              x="-55"
              y="-125"
              fill="#CBD5E0"
              fontSize="10"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Raw Milk ({rawMilkFlowLph} L/h)
            </text>
          </g>
        </svg>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Centrifugal Field
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {centrifugalAccG.toLocaleString()} G · {bowlRpm} RPM · ω×{sep.displaySlowdown}{" "}
            {sep.displayOmegaDegPerS.toFixed(0)} °/s
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Cream Yield
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500">
            {creamYieldLph} L/hr
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Skim Yield
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500">
            {skimMilkYieldLph} L/hr
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Fat Recovery
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {separationEfficiencyPct}%
          </span>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-parchment-200 dark:border-ink-800">
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Rotor Bowl Rotational Speed</span>
            <span className="font-mono">{bowlRpm} RPM</span>
          </div>
          <input
            type="range"
            min="2000"
            max="9000"
            step="250"
            value={bowlRpm}
            onChange={(e) => updateParam("bowlRpm", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Raw Milk Feed Rate</span>
            <span className="font-mono">{rawMilkFlowLph} L/hr</span>
          </div>
          <input
            type="range"
            min="100"
            max="600"
            step="25"
            value={rawMilkFlowLph}
            onChange={(e) => updateParam("rawMilkFlowLph", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </div>
      </div>
    </div>
  );
}
