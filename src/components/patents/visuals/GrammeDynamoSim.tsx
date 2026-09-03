"use client";

import { Pause, Play, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { grammeCoil, grammeJunctionRod, stepGrammeDynamo } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";
import { useOffscreenGate } from "./useOffscreenGate";

const UI_SNAPSHOT_INTERVAL_MS = 80;

export function GrammeDynamoSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-120057-gramme-dynamo");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const shaftRate = params.shaftRate ?? 1;
  const gramme = stepGrammeDynamo({ shaftRate });
  const printedJunctionCount = gramme.printedJunctionCount;
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [angleDeg, setAngleDeg] = useState<number>(0);
  const animRef = useRef<number | null>(null);
  const angleRef = useRef(0);
  const dynamoRef = useRef<ReturnType<typeof stepGrammeDynamo> | null>(null);
  const armatureRef = useRef<SVGGElement>(null);
  const { rootRef, onscreenRef } = useOffscreenGate<HTMLDivElement>();

  useEffect(() => {
    dynamoRef.current = gramme;
  }, [gramme]);

  useEffect(() => {
    if (!isPlaying) return;
    let lastUiSnapshot = 0;
    const loop = (time: number) => {
      animRef.current = requestAnimationFrame(loop);
      if (!onscreenRef.current) return;
      const liveDynamo = dynamoRef.current;
      if (!liveDynamo) return;
      // The animation is a visual cue, not a historical speed measurement.
      // Fixed per-frame steps avoid deriving state from a private wall clock.
      angleRef.current =
        (angleRef.current + liveDynamo.displayDegPerFrame) % liveDynamo.displayWrapDeg;
      armatureRef.current?.setAttribute(
        "transform",
        `translate(${liveDynamo.torusCx}, ${liveDynamo.torusCy}) rotate(${angleRef.current})`,
      );
      if (time - lastUiSnapshot >= UI_SNAPSHOT_INTERVAL_MS) {
        lastUiSnapshot = time;
        setAngleDeg(angleRef.current);
      }
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, onscreenRef]);

  return (
    <div
      ref={rootRef}
      className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
              Zénobe Gramme Continuous-Current Ring Dynamo (US 120,057)
            </h3>
          </div>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400 mt-0.5">
            Endless soft-iron ring, 36 joined toroidal bobbins, radial commutator rods, and
            collecting rubbers.
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
              angleRef.current = 0;
              armatureRef.current?.setAttribute(
                "transform",
                `translate(${gramme.torusCx}, ${gramme.torusCy}) rotate(0)`,
              );
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
          aria-label={`Gramme dynamo simulation: ${isPlaying ? "armature spinning" : "stopped"}, armature angle ${Math.round(angleDeg)} degrees`}
          className="w-full h-full"
        >
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
          <g
            ref={armatureRef}
            transform={`translate(${gramme.torusCx}, ${gramme.torusCy}) rotate(${angleDeg})`}
          >
            {/* Laminated Soft-Iron Torus */}
            <circle
              cx="0"
              cy="0"
              r={gramme.torusSvgR}
              fill="none"
              stroke="#4A5568"
              strokeWidth="30"
            />

            {/* Distributed Endless Helical Coils around Ring */}
            {Array.from({ length: printedJunctionCount }).map((_, i) => {
              const coil = grammeCoil(
                i,
                gramme.torusSvgR,
                gramme.junctionPitchDeg,
                gramme.coilPadX,
                gramme.coilPadY,
                gramme.coilSvgW,
                gramme.coilSvgH,
              );
              return (
                <rect
                  key={`gramme-coil-${coil.deg}`}
                  x={coil.x}
                  y={coil.y}
                  width={coil.w}
                  height={coil.h}
                  rx="3"
                  fill="#D4AF37"
                  stroke="#8B5A2B"
                  strokeWidth="1"
                  transform={`rotate(${coil.deg}, ${coil.cx}, ${coil.cy})`}
                />
              );
            })}

            {/* Junction conductors rotate with the endless bobbin; this is not a later commutator. */}
            <circle
              cx="0"
              cy="0"
              r={gramme.junctionInnerSvgR}
              fill="#4A5568"
              stroke="#1A202C"
              strokeWidth="2"
            />
            {Array.from({ length: printedJunctionCount }).map((_, i) => {
              const rod = grammeJunctionRod(
                i,
                gramme.junctionPitchDeg,
                gramme.junctionInnerSvgR,
                gramme.junctionOuterSvgR,
              );
              return (
                <line
                  key={`junction-${i}`}
                  x1={rod.x1}
                  y1={rod.y1}
                  x2={rod.x2}
                  y2={rod.y2}
                  stroke="#C5A059"
                  strokeWidth="2"
                />
              );
            })}
          </g>

          {/* Stationary collecting rubbers S engage the rotating junction conductors. */}
          <rect
            x={gramme.brushSvgX}
            y={gramme.brushSvgY0}
            width={gramme.brushSvgW}
            height={gramme.brushSvgH}
            fill="#1A202C"
            stroke="#2D3748"
            strokeWidth="1.5"
          />
          <rect
            x={gramme.brushSvgX}
            y={gramme.brushSvgY1}
            width={gramme.brushSvgW}
            height={gramme.brushSvgH}
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
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Ring h₁ (fs-symmetry)
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-sky-700 dark:text-sky-400">
            {gramme.ringHarmonicH1.toFixed(3)}
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
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </div>
      </div>
    </div>
  );
}
