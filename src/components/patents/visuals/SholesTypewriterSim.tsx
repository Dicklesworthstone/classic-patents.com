"use client";

import { Keyboard, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { sholesTypebarPose, stepSholesTypewriter } from "@/physics/machineKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";

export function SholesTypewriterSim() {
  const { params, resetParams, updateParam } = usePatentPhysics("us-79265-sholes-typewriter");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const [typedMarks, setTypedMarks] = useState<string>("••••••••");
  const [activeKeyIndex, setActiveKeyIndex] = useState<number>(0);

  const sholes = stepSholesTypewriter(params.typingSpeedWpm ?? 40, 0);
  const displayColumn = typedMarks.length % sholes.displayColumnWrap;

  const handleKeyPress = (keyNumber: number) => {
    setActiveKeyIndex(keyNumber - 1);
    soundEngine.playSwitchClick();
    if (typedMarks.length < 28) {
      setTypedMarks((previous) => `${previous}•`);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
              Christopher Latham Sholes Type-Writer Mechanism Study (US 79,265)
            </h3>
          </div>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400 mt-0.5">
            Radial type-bar kinematics, escapement carriage feed, and inked ribbon impression.
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
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
              setTypedMarks("");
              setActiveKeyIndex(0);
              resetParams();
              soundEngine.playSwitchClick();
            }}
            aria-label="Clear diagrammatic type marks"
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Animation Stage */}
      <div className="relative w-full aspect-[16/9] max-h-[360px] bg-parchment-100 dark:bg-ink-900 rounded-xl overflow-hidden border border-parchment-200 dark:border-ink-800 flex items-center justify-center">
        <svg viewBox="0 0 600 340" className="w-full h-full">
          {/* Paper Platen Roller & Escapement Carriage */}
          <g transform={`translate(${200 - displayColumn * sholes.columnPitchPx}, 40)`}>
            <rect
              x="0"
              y="0"
              width="340"
              height="40"
              rx="8"
              fill="#2D3748"
              stroke="#1A202C"
              strokeWidth="2"
            />
            <rect
              x="20"
              y="-15"
              width="300"
              height="25"
              fill="#FFFFFF"
              stroke="#CBD5E0"
              strokeWidth="1"
            />
            {/* Diagrammatic marks, not a transcription or keyboard layout. */}
            <text
              x="30"
              y="2"
              fill="#1A202C"
              fontFamily="monospace"
              fontSize="13"
              fontWeight="bold"
            >
              {typedMarks}
            </text>
          </g>

          {/* Central strike point and the inking-ribbon spools named in claim 5. */}
          <g transform="translate(300, 75)">
            <circle cx="0" cy="0" r="6" fill="#E53E3E" opacity="0.8" />
            <line
              x1="-80"
              y1="0"
              x2="80"
              y2="0"
              stroke="#742A2A"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.6"
            />
            <circle cx="-90" cy="0" r="14" fill="#4A5568" stroke="#2D3748" strokeWidth="2" />
            <circle cx="90" cy="0" r="14" fill="#4A5568" stroke="#2D3748" strokeWidth="2" />
            <text
              x="-45"
              y="-10"
              fill="#742A2A"
              fontSize="9"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Inking ribbon
            </text>
          </g>

          {/* Circular Radial Typebar Basket Ring */}
          <ellipse
            cx="300"
            cy="200"
            rx="140"
            ry="70"
            fill="none"
            stroke="#8B5A2B"
            strokeWidth="8"
            opacity="0.4"
          />

          {/* A deliberately small diagrammatic subset. The grant specifies one bar and key per type, not a number. */}
          <g id="typebar-basket">
            {Array.from({ length: sholes.displayColumnWrap }).map((_, i) => {
              const bar = sholesTypebarPose(i, activeKeyIndex);
              return (
                <g key={`typebar-${bar.bAngle}`}>
                  <line
                    x1={bar.xStart}
                    y1={bar.yStart}
                    x2={bar.xEnd}
                    y2={bar.yEnd}
                    stroke={bar.isActive ? "#D69E2E" : "#718096"}
                    strokeWidth={bar.isActive ? 3.5 : 2}
                  />
                  {bar.isActive && (
                    <circle
                      cx="300"
                      cy="75"
                      r="5"
                      fill="#D69E2E"
                      stroke="#744210"
                      strokeWidth="1.5"
                    />
                  )}
                </g>
              );
            })}
          </g>

          {/* Ratchet I and bifurcated lever H are shown schematically, not to scale. */}
          <g transform="translate(140, 60)">
            <circle
              cx="0"
              cy="0"
              r={sholes.ratchetSvgR}
              fill="#C5A059"
              stroke="#5C4033"
              strokeWidth="2"
            />
            {Array.from({ length: sholes.ratchetToothCount }).map((_, i) => (
              <line
                key={`esc-tooth-${i}`}
                x1="0"
                y1="0"
                x2={
                  Math.cos((i * sholes.ratchetToothPitchDeg * Math.PI) / 180) * sholes.ratchetSvgR
                }
                y2={
                  Math.sin((i * sholes.ratchetToothPitchDeg * Math.PI) / 180) * sholes.ratchetSvgR
                }
                stroke="#1A1A1A"
                strokeWidth="2"
              />
            ))}
            <text x="-40" y="-22" fill="#888" fontSize="10" fontFamily="sans-serif">
              Ratchet I / lever H
            </text>
          </g>
          <text
            x="300"
            y="320"
            textAnchor="middle"
            fill="#718096"
            fontSize="10"
            fontFamily="sans-serif"
          >
            Diagrammatic subset: the source states one key and type-bar for each type, without a
            count.
          </text>
        </svg>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Diagram carriage step
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {displayColumn}
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Source pitch
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500">
            Not stated
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Active control
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500">
            Key {activeKeyIndex + 1}
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Ratchet state
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {sholes.ratchetReleasePct > 0 ? "Releasing" : "Held"}
          </span>
        </div>
      </div>

      <label className="mb-4 block rounded-xl border border-parchment-200 bg-parchment-100 p-3 dark:border-ink-800 dark:bg-ink-900">
        <span className="mb-2 flex items-baseline justify-between gap-3 text-xs font-sans font-medium text-ink-700 dark:text-parchment-300">
          <span>Demonstration cadence</span>
          <span className="font-mono text-amber-700 dark:text-amber-400">
            {params.typingSpeedWpm ?? 40} strokes/min
          </span>
        </span>
        <input
          aria-label="Demonstration cadence in strokes per minute"
          className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          type="range"
          min="10"
          max="120"
          step="5"
          value={params.typingSpeedWpm ?? 40}
          onChange={(event) => updateParam("typingSpeedWpm", Number(event.target.value))}
        />
        <span className="mt-1 block text-[11px] text-ink-500 dark:text-ink-400">
          Visitor-selected display pace only. The source gives no measured operating rate.
        </span>
      </label>

      {/* The source calls for piano-like keys but does not identify their arrangement. */}
      <div className="pt-2 border-t border-parchment-200 dark:border-ink-800">
        <div className="text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-2">
          Trigger a diagrammatic key to follow the direct key-to-type-bar and ratchet sequence:
        </div>
        <div className="flex flex-wrap gap-1.5 justify-center">
          {Array.from({ length: 12 }, (_, index) => index + 1).map((keyNumber) => (
            <button
              key={keyNumber}
              type="button"
              onClick={() => handleKeyPress(keyNumber)}
              aria-label={`Trigger diagrammatic key ${keyNumber}`}
              className="px-2.5 py-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-amber-600 hover:text-white dark:hover:bg-amber-600 font-mono text-xs font-bold text-ink-800 dark:text-parchment-200 transition-colors shadow-sm"
            >
              Key {keyNumber}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
