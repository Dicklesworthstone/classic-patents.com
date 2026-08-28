"use client";

import { ArrowUpRight, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { renoCleatSvg, stepRenoEscalator } from "@/physics/machineKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";
import { useOffscreenGate } from "./useOffscreenGate";

export function RenoEscalatorSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-470918-reno-escalator");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const beltSpeedMps = params.beltSpeed ?? 0.45;
  const passengerLoad = params.passengerCount ?? 30;
  const inclineAngleDeg = params.inclineAngle ?? 25;
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [treadOffset, setTreadOffset] = useState<number>(0);
  const animRef = useRef<number | null>(null);
  const { rootRef, onscreenRef } = useOffscreenGate<HTMLDivElement>();

  const reno = stepRenoEscalator({
    passengerCount: passengerLoad,
    inclineAngleDeg,
    velocityMps: beltSpeedMps,
  });
  const beltSpeedFpm = reno.speedFpm;
  const passengersPerHour = reno.throughputPerHour;
  const driveMotorPowerKw = reno.motorPowerKw;

  useEffect(() => {
    if (!isPlaying) return;

    let lastTime = performance.now();

    const loop = (time: number) => {
      animRef.current = requestAnimationFrame(loop);
      if (!onscreenRef.current) return;
      const dt = Math.min(0.1, (time - lastTime) / 1000);
      lastTime = time;

      setTreadOffset((prev) => (prev + reno.treadSvgAdvancePerS * dt) % reno.treadSvgWrapPx);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, reno.treadSvgAdvancePerS, reno.treadSvgWrapPx, onscreenRef.current]);

  return (
    <div
      ref={rootRef}
      className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
              Jesse Reno Endless Inclined Escalator &amp; Comb Landing (US 470,918)
            </h3>
          </div>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400 mt-0.5">
            25° slotted hardwood cleats, intermeshing stationary comb plate, and moving handrail.
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
              setTreadOffset(0);
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
          {/* Structural Truss Frame */}
          <polygon
            points="40,280 180,280 480,100 560,100 560,140 460,140 160,320 40,320"
            fill="#2D3748"
            opacity="0.3"
            stroke="#1A202C"
            strokeWidth="2"
          />

          {/* Lower Landing Comb Plate (Left) */}
          <g transform="translate(60, 275)">
            <polygon
              points="0,0 40,0 35,15 0,15"
              fill="#D4AF37"
              stroke="#744210"
              strokeWidth="1.5"
            />
            <text
              x="-40"
              y="28"
              fill="#744210"
              fontSize="9"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Lower Comb
            </text>
          </g>

          {/* Upper Landing Comb Plate (Right) */}
          <g transform="translate(480, 95)">
            <polygon
              points="0,0 40,0 40,15 5,15"
              fill="#D4AF37"
              stroke="#744210"
              strokeWidth="1.5"
            />
            <text
              x="45"
              y="10"
              fill="#744210"
              fontSize="9"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Comb Landing
            </text>
          </g>

          {/* Moving 25-degree Incline Endless Cleated Belt */}
          <g id="moving-cleats">
            {Array.from({ length: 14 }).map((_, i) => {
              const { x: xPos, y: yPos } = renoCleatSvg(
                i,
                treadOffset,
                reno.cleatSvgPitchPx,
                reno.cleatSvgWrapPx,
                reno.cleatSvgOriginX,
                reno.cleatSvgOriginY,
                reno.cleatSvgXScale,
                reno.cleatSvgYScale,
              );
              return (
                <g
                  key={`cleat-${i * reno.cleatSvgPitchPx}`}
                  transform={`translate(${xPos}, ${yPos}) rotate(${reno.cleatSvgRotateDeg})`}
                >
                  {/* Longitudinal wooden ridge cleats */}
                  <rect
                    x="0"
                    y="0"
                    width="30"
                    height="8"
                    rx="1.5"
                    fill="#8B5A2B"
                    stroke="#5C4033"
                    strokeWidth="1"
                  />
                  <line x1="0" y1="4" x2="30" y2="4" stroke="#D4AF37" strokeWidth="1.5" />
                </g>
              );
            })}
          </g>

          {/* Synchronized Moving Rubber Handrail */}
          <path
            d="M 70 230 L 170 230 L 470 55 L 540 55"
            stroke="#1A202C"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          <text
            x="260"
            y="120"
            fill="#718096"
            fontSize="11"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            25° Inclined Moving Handrail
          </text>
        </svg>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Belt Linear Speed
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {beltSpeedMps} m/s ({beltSpeedFpm} FPM)
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Capacity
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500">
            {passengersPerHour.toLocaleString()} riders/hr
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Motor Power
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500">
            {driveMotorPowerKw} kW
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Incline Geometry
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {inclineAngleDeg}° Incline
          </span>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-parchment-200 dark:border-ink-800">
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Escalator Linear Speed</span>
            <span className="font-mono">
              {beltSpeedMps} m/s ({beltSpeedFpm} FPM)
            </span>
          </div>
          <input
            type="range"
            min="0.3"
            max="0.75"
            step="0.05"
            value={beltSpeedMps}
            onChange={(e) => updateParam("beltSpeed", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Passenger Live Load</span>
            <span className="font-mono">{passengerLoad} Passengers</span>
          </div>
          <input
            type="range"
            min="0"
            max="60"
            step="2"
            value={passengerLoad}
            onChange={(e) => updateParam("passengerCount", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </div>
      </div>
    </div>
  );
}
