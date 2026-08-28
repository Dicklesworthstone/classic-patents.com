"use client";

import { Cog, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  mccormickCrankPinSvg,
  mccormickFaceSickleX,
  mccormickGrainStemX,
  mccormickGuardX,
  mccormickReelAngleDeg,
  stepMcCormickReaper,
} from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";
import { useOffscreenGate } from "./useOffscreenGate";

export function McCormickReaperSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-x8277-mccormick-reaper");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const groundSpeedMph = params.forwardSpeedMph ?? params.groundSpeedMph ?? 2.5;
  const reaper = stepMcCormickReaper({ forwardSpeedMph: groundSpeedMph });
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [phase, setPhase] = useState<number>(0);
  const animRef = useRef<number | null>(null);
  const { rootRef, onscreenRef } = useOffscreenGate<HTMLDivElement>();

  const groundSpeedMps = reaper.groundSpeedMps;
  const reelRpm = reaper.reelRpm;

  useEffect(() => {
    if (!isPlaying) return;
    const loop = () => {
      animRef.current = requestAnimationFrame(loop);
      if (!onscreenRef.current) return;
      // Fixed presentation steps make the visual reproducible from the same
      // shared control state. They do not claim to be a physical time solver.
      setPhase((prev) => (prev + reaper.cutterDisplayRadPerFrame) % reaper.phaseWrapRad);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, reaper.cutterDisplayRadPerFrame, reaper.phaseWrapRad, onscreenRef.current]);

  const cutterX = Math.sin(phase) * reaper.cutterSvgAmp;
  const reelAngleDeg = mccormickReelAngleDeg(phase, reaper.reelToCutterRatio);

  return (
    <div
      ref={rootRef}
      className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Cog className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
              Cyrus McCormick Mechanical Grain Reaper (US X8277)
            </h3>
          </div>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400 mt-0.5">
            Ground wheel drive, gear transmission, reciprocating sickle bar, and revolving grain
            divider reel.
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
            title={isPlaying ? "Pause Simulation" : "Play Simulation"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-amber-600 dark:text-amber-400" />
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
            aria-label={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              resetParams();
              setIsPlaying(true);
              soundEngine.playSwitchClick();
            }}
            aria-label="Reset Simulation"
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
            title="Reset Simulation"
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
          aria-label={`Mechanical reaper simulation: ${isPlaying ? `reaping at ${groundSpeedMph} miles per hour` : "stopped"}, reel turning at ${Math.round(reelRpm)} rpm and sickle cycling`}
          className="w-full h-full"
        >
          {/* Standing Grain Stems */}
          <g id="grain-field" opacity="0.6">
            {Array.from({ length: reaper.grainStemCount }).map((_, i) => (
              <path
                key={`stem-${i}`}
                d={`M ${mccormickGrainStemX(i, reaper.grainStemOriginX, reaper.grainStemPitchX)} ${reaper.grainStemY0} Q ${mccormickGrainStemX(i, reaper.grainStemOriginX, reaper.grainStemPitchX) + reaper.grainStemQdx} ${reaper.grainStemQy}, ${mccormickGrainStemX(i, reaper.grainStemOriginX, reaper.grainStemPitchX) + reaper.grainStemEndDx} ${reaper.grainStemY1}`}
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
            {Array.from({ length: reaper.guardCount }).map((_, i) => (
              <polygon
                key={`guard-${i}`}
                points={`${mccormickGuardX(i, reaper.guardPitchX)},0 ${mccormickGuardX(i, reaper.guardPitchX) + reaper.guardTipDx},${reaper.guardTipDy} ${mccormickGuardX(i, reaper.guardPitchX) + reaper.guardEndDx},0`}
                fill="#3A3A3A"
                stroke="#1A1A1A"
                strokeWidth="1.5"
              />
            ))}
          </g>

          {/* Reciprocating Serrated Sickle Blade */}
          <g id="sickle-blade" transform={`translate(${180 + cutterX}, 205)`}>
            <rect x="0" y="0" width="280" height="6" fill="#C5A059" stroke="#888" strokeWidth="1" />
            {Array.from({ length: reaper.sickleToothCount }).map((_, i) => (
              <polygon
                key={`sickle-tooth-${i}`}
                points={`${mccormickFaceSickleX(i, reaper.sickleToothOriginX, reaper.sickleToothPitchX)},0 ${mccormickFaceSickleX(i, reaper.sickleToothOriginX, reaper.sickleToothPitchX) + reaper.faceSickleTipDx},${reaper.faceSickleTipDy} ${mccormickFaceSickleX(i, reaper.sickleToothOriginX, reaper.sickleToothPitchX) + reaper.faceSickleEndDx},0`}
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
            {Array.from({ length: reaper.reelArmCount }).map((_, i) => {
              const armAngle = i * (360 / reaper.reelArmCount);
              return (
                <g key={`reel-arm-${armAngle}`} transform={`rotate(${armAngle})`}>
                  <line
                    x1="0"
                    y1="0"
                    x2={reaper.reelArmSvgLen}
                    y2="0"
                    stroke="#8B5A2B"
                    strokeWidth="3.5"
                  />
                  <rect
                    x={reaper.reelSlatX}
                    y={reaper.reelSlatY}
                    width={reaper.reelSlatW}
                    height={reaper.reelSlatH}
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
              x2={cutterX + reaper.pitmanCutterPad}
              y2="0"
              stroke="#333333"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="-50" cy="0" r="14" fill="#666666" stroke="#222" strokeWidth="2" />
            <circle
              cx={mccormickCrankPinSvg(phase, reaper.crankPinHubX, reaper.crankPinOrbitPx).cx}
              cy={mccormickCrankPinSvg(phase, reaper.crankPinHubX, reaper.crankPinOrbitPx).cy}
              r="5"
              fill="#C5A059"
            />
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
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>13-inch to 12-inch Reel Belt</span>
            <span className="font-mono">{reelRpm} RPM</span>
          </div>
          <div className="h-2 rounded bg-parchment-200 dark:bg-ink-800 overflow-hidden">
            <div className="h-full bg-amber-600" style={{ width: `${reaper.reelBarPct}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
