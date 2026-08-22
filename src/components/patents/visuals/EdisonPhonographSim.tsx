"use client";

import { Disc, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  edisonFoilGrooveX,
  edisonLeadScrewThreadX,
  phonographAxialTravelMm,
  stepEdisonPhonograph,
} from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";

export function EdisonPhonographSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-200521-edison-phonograph");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const mandrelRpm = params.mandrelRpm ?? 60;
  const voiceVolumeDb = params.voiceVolumeDb ?? 75;
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [cylinderAngleDeg, setCylinderAngleDeg] = useState<number>(0);
  const animRef = useRef<number | null>(null);

  const phono = stepEdisonPhonograph({ mandrelRpm, voiceVolumeDb });
  const leadScrewPitchMm = phono.leadScrewPitchMm;
  const axialTravelMm = phonographAxialTravelMm(
    cylinderAngleDeg,
    leadScrewPitchMm,
    phono.axialDisplayWrapMm,
  );

  useEffect(() => {
    if (!isPlaying) return;

    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min(0.1, (time - lastTime) / 1000);
      lastTime = time;

      setCylinderAngleDeg((prev) => prev + phono.mandrelOmegaDegPerS * dt);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, phono.mandrelOmegaDegPerS]);

  return (
    <div className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Disc className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
              Thomas Edison Tinfoil Cylinder Phonograph (US 200,521)
            </h3>
          </div>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400 mt-0.5">
            Cylinder A, metallic foil, threaded shaft X, and recording / reproducing diaphragms.
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
              setCylinderAngleDeg(0);
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
          {/* Illustrative support stand. US 200,521 does not specify its material or dimensions. */}
          <rect
            x="40"
            y="270"
            width="520"
            height="30"
            rx="4"
            fill="#5C4033"
            stroke="#3D2817"
            strokeWidth="2"
          />

          {/* Threaded Lead-Screw Shaft running across */}
          <rect
            x="80"
            y="165"
            width="440"
            height="10"
            fill="#CBD5E0"
            stroke="#4A5568"
            strokeWidth="1"
          />
          {/* Screw Threads */}
          {Array.from({ length: phono.leadScrewThreadCount }).map((_, i) => {
            const x = edisonLeadScrewThreadX(
              i,
              phono.leadScrewThreadOriginX,
              phono.leadScrewThreadPitchX,
            );
            return (
              <line
                key={`thread-${i}`}
                x1={x}
                y1={phono.leadScrewThreadY0}
                x2={x + phono.leadScrewThreadDx}
                y2={phono.leadScrewThreadY1}
                stroke="#718096"
                strokeWidth="1"
              />
            );
          })}

          {/* Cylinder A and its metal-foil recording surface, translated by the source-specified thread. */}
          <g
            transform={`translate(${phono.cylinderSvgX + axialTravelMm * phono.axialSvgPxPerMm}, ${phono.cylinderSvgY})`}
          >
            <rect
              x="0"
              y="0"
              width={phono.cylinderSvgW}
              height={phono.cylinderSvgH}
              rx="4"
              fill="#9A7B4F"
              stroke="#744210"
              strokeWidth="2"
            />
            <rect
              x="10"
              y="5"
              width="180"
              height="70"
              rx="2"
              fill="#E2E8F0"
              opacity={Math.min(1, 0.6 + phono.grooveWaveRms)}
            />
            <text
              x="50"
              y="45"
              fill="#4A5568"
              fontWeight="bold"
              fontSize="13"
              fontFamily="sans-serif"
            >
              Tinfoil Cylinder
            </text>
            {/* Spiral Grooves on Tinfoil */}
            {Array.from({ length: phono.foilGrooveCount }).map((_, i) => {
              const x = edisonFoilGrooveX(i, phono.foilGrooveOriginX, phono.foilGroovePitchX);
              return (
                <line
                  key={`groove-${i}`}
                  x1={x}
                  y1="5"
                  x2={x}
                  y2="75"
                  stroke="#A0AEC0"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              );
            })}
          </g>

          {/* Source-specified speaking tube, diaphragm, and hard indenting point. */}
          <g transform="translate(260, 60)">
            {/* The widening tube is an illustrative profile, not a source-specified horn geometry. */}
            <polygon points="0,0 60,-35 60,35" fill="#8B6F47" stroke="#60472A" strokeWidth="2" />
            {/* Source specifies a diaphragm but not its material. */}
            <line
              x1="0"
              y1="-20"
              x2="0"
              y2="20"
              stroke="#CBD5E0"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Source specifies a hard indenting point but not its material. */}
            <polygon points="0,20 -3,45 3,45" fill="#1A202C" />
            <text
              x="-60"
              y="-10"
              fill="#8B5A2B"
              fontSize="10"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Speaking tube B
            </text>
          </g>

          {/* Illustrative rotation indicator. The patent names clock-work M or another power source, not this drive geometry. */}
          <g transform="translate(520, 170)">
            <circle cx="0" cy="0" r="50" fill="none" stroke="#2D3748" strokeWidth="10" />
            <circle cx="0" cy="0" r="8" fill="#111" />
            <line
              x1="0"
              y1="0"
              x2={Math.cos((cylinderAngleDeg * Math.PI) / 180) * phono.driveIndicatorSvgR}
              y2={Math.sin((cylinderAngleDeg * Math.PI) / 180) * phono.driveIndicatorSvgR}
              stroke="#4A5568"
              strokeWidth="3"
            />
            <circle
              cx={Math.cos((cylinderAngleDeg * Math.PI) / 180) * phono.driveIndicatorSvgR}
              cy={Math.sin((cylinderAngleDeg * Math.PI) / 180) * phono.driveIndicatorSvgR}
              r="5"
              fill="#8B5A2B"
            />
          </g>
        </svg>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Source groove pitch
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {phono.sourceGroovesPerInch} grooves/in
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Source thread pitch
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500">
            {phono.sourceThreadsPerInch} threads/in
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Model axial display
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500">
            {axialTravelMm} mm
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Illustrative turn setting
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {mandrelRpm} RPM
          </span>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-parchment-200 dark:border-ink-800">
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Illustrative clock-work rate</span>
            <span className="font-mono">{mandrelRpm} RPM</span>
          </div>
          <input
            type="range"
            min="40"
            max="140"
            step="5"
            value={mandrelRpm}
            onChange={(e) => updateParam("mandrelRpm", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Illustrative diaphragm-excitation level</span>
            <span className="font-mono">{voiceVolumeDb} / 100 model units</span>
          </div>
          <input
            type="range"
            min="40"
            max="100"
            step="5"
            value={voiceVolumeDb}
            onChange={(e) => updateParam("voiceVolumeDb", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </div>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-ink-600 dark:text-ink-300">
        The patent specifies cylinder A, metallic foil or another yielding material, a
        ten-groove-per-inch helix, a matching ten-thread-per-inch shaft, a diaphragm, and clock-work
        M or another source of power. The excitation slider and all displayed animation geometry,
        rate, travel range, indentation motion, and sound character are model-only reader aids, not
        historical measurements or additional patent claims.
      </p>
    </div>
  );
}
