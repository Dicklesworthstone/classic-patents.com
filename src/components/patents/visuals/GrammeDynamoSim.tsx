"use client";

import { Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepGrammeDynamo } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { usePatentAudio } from "./three/usePatentAudio";

export function GrammeDynamoSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-120057-gramme-dynamo");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const shaftRate = params.shaftRate ?? 1;
  const gramme = stepGrammeDynamo({ shaftRate });
  const printedJunctionCount = 36;
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [angleDeg, setAngleDeg] = useState<number>(0);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) return;
    const loop = () => {
      // The animation is a visual cue, not a historical speed measurement.
      // Fixed per-frame steps avoid deriving state from a private wall clock.
      setAngleDeg((prev) => (prev + gramme.displayDegPerFrame) % 360);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, gramme.displayDegPerFrame]);

  return (
    <div className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
            Gramme Continuous-Current Ring Apparatus (US 120,057)
          </h3>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400">
            Explanatory model of the printed endless ring, thirty-six joined bobbins, junction
            conductors, and collecting rubbers. The patent gives no electrical rating.
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
          {/* Stator Magnetic Field Pole Shoes */}
          <path
            d="M 80 70 Q 180 70, 180 170 Q 180 270, 80 270 Z"
            fill="#C53030"
            stroke="#9B2C2C"
            strokeWidth="3"
          />
          <text
            x="110"
            y="175"
            fill="#FFFFFF"
            fontWeight="bold"
            fontSize="22"
            fontFamily="sans-serif"
          >
            N
          </text>

          <path
            d="M 520 70 Q 420 70, 420 170 Q 420 270, 520 270 Z"
            fill="#2B6CB0"
            stroke="#2C5282"
            strokeWidth="3"
          />
          <text
            x="475"
            y="175"
            fill="#FFFFFF"
            fontWeight="bold"
            fontSize="22"
            fontFamily="sans-serif"
          >
            S
          </text>

          {/* Toroidal Soft-Iron Ring Armature */}
          <g transform={`translate(300, 170) rotate(${angleDeg})`}>
            {/* Laminated Soft-Iron Torus */}
            <circle cx="0" cy="0" r="100" fill="none" stroke="#4A5568" strokeWidth="30" />

            {/* Distributed Endless Helical Coils around Ring */}
            {Array.from({ length: printedJunctionCount }).map((_, i) => {
              const cAngle = (i * 360) / printedJunctionCount;
              const rad = (cAngle * Math.PI) / 180;
              const xPos = Math.cos(rad) * 100;
              const yPos = Math.sin(rad) * 100;
              return (
                <rect
                  key={`gramme-coil-${cAngle}`}
                  x={xPos - 6}
                  y={yPos - 16}
                  width="12"
                  height="32"
                  rx="3"
                  fill="#D4AF37"
                  stroke="#8B5A2B"
                  strokeWidth="1"
                  transform={`rotate(${cAngle}, ${xPos}, ${yPos})`}
                />
              );
            })}

            {/* Junction conductors rotate with the endless bobbin; this is not a later commutator. */}
            <circle cx="0" cy="0" r="35" fill="#4A5568" stroke="#1A202C" strokeWidth="2" />
            {Array.from({ length: printedJunctionCount }).map((_, i) => (
              <line
                key={`junction-${i * (360 / printedJunctionCount)}`}
                x1={Math.cos((i * 2 * Math.PI) / printedJunctionCount) * 35}
                y1={Math.sin((i * 2 * Math.PI) / printedJunctionCount) * 35}
                x2={Math.cos((i * 2 * Math.PI) / printedJunctionCount) * 48}
                y2={Math.sin((i * 2 * Math.PI) / printedJunctionCount) * 48}
                stroke="#C5A059"
                strokeWidth="2"
              />
            ))}
          </g>

          {/* Stationary collecting rubbers S engage the rotating junction conductors. */}
          <rect
            x="294"
            y="125"
            width="12"
            height="15"
            fill="#1A202C"
            stroke="#2D3748"
            strokeWidth="1.5"
          />
          <rect
            x="294"
            y="200"
            width="12"
            height="15"
            fill="#1A202C"
            stroke="#2D3748"
            strokeWidth="1.5"
          />
          <text
            x="315"
            y="135"
            fill="#1A202C"
            fontSize="11"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            Collecting rubber S
          </text>
          <text
            x="315"
            y="215"
            fill="#1A202C"
            fontSize="11"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            Opposed collector contact
          </text>
        </svg>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Induced e.m.f. (illustrative)
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {gramme.inducedEmfIndex}
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Printed joined bobbins
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500">
            {gramme.printedJunctionCount}
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Collection continuity (idealized)
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500">
            {gramme.collectionContinuityPct}%
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Source boundary
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            no V/A/W stated
          </span>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 gap-4 pt-2 border-t border-parchment-200 dark:border-ink-800">
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Illustrative shaft-rate factor</span>
            <span className="font-mono">{shaftRate.toFixed(1)}×</span>
          </div>
          <input
            type="range"
            aria-label="Illustrative shaft-rate factor"
            min="0.4"
            max="1.6"
            step="0.1"
            value={shaftRate}
            onChange={(e) => updateParam("shaftRate", Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
