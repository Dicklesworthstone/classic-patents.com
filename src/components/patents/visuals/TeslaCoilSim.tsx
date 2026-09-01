"use client";

import { RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { FrankenSimEngine } from "@/physics/engine";
import { ensureTeslaWasm, teslaKernelSource } from "@/physics/teslaWasm";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";

export function TeslaCoilSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-593138-tesla-coil");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const [, setKernelSource] = useState(teslaKernelSource);

  useEffect(() => {
    let active = true;
    void ensureTeslaWasm().then((nextSource) => {
      if (active) setKernelSource(nextSource);
    });
    return () => {
      active = false;
    };
  }, []);
  const primaryCapacitanceNf = params.primaryCap ?? 45;
  const inputKv = params.inputVoltageKv ?? 15;
  const sparkGap = params.sparkGapDistanceMm ?? 12;
  const couplingK = params.couplingK ?? 0.18;
  const secondaryTurns = params.secondaryTurns ?? 850;
  const toploadCapacitancePf = params.toploadCapacitancePf ?? 35;

  // Interpretive host-model calculations; see the source-edition gate on the record.
  const res = FrankenSimEngine.stepTeslaCoilFromControls({
    primaryCap: primaryCapacitanceNf,
    toploadCapacitancePf,
    inputVoltageKv: inputKv,
    sparkGapDistanceMm: sparkGap,
    couplingK,
    secondaryTurns,
  });
  const resonantFreqKhz = res.resonantFreqKhz;
  const secondaryVoltageKv = res.secondaryPotentialKv;
  const streamerScale = res.streamerScale;

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Zap className="w-6 h-6 text-purple-500 animate-pulse" />
            <h3 className="font-serif text-2xl font-bold text-ink-950 dark:text-parchment-50">
              Nikola Tesla&apos;s High-Potential Transformer (US 593,138)
            </h3>
          </div>
          <p className="text-sm sm:text-base text-ink-700 dark:text-ink-300 mt-1">
            High-frequency resonant air-core transformer: conical secondary winding, distributed
            capacitance voltage grading, and quarter-wave standing resonance.
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="px-3.5 py-1.5 rounded-xl bg-parchment-100 dark:bg-ink-900 text-ink-700 dark:text-parchment-300 text-xs sm:text-sm font-mono font-bold border border-parchment-300 dark:border-ink-700 shadow-2xs">
            {res.runtimeSource === "wasm" ? "Interpretive WASM step" : "TypeScript fallback"}
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-300 text-xs sm:text-sm font-mono font-bold border border-purple-300 dark:border-purple-800 shadow-2xs">
            {secondaryVoltageKv} kV Peak Potential
          </div>
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

      {/* Interactive Visual Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-canvas border border-parchment-300 dark:border-ink-800 p-6 relative min-h-[380px] overflow-hidden">
          <svg
            viewBox="0 0 600 340"
            role="img"
            aria-label={`US 593,138 Fig. 2 transformer: conical secondary, surrounding primary, common earth terminal, and ${streamerScale > 0 ? "interpretive remote-terminal discharge" : "no discharge"}`}
            className="w-full h-auto max-h-[340px]"
          >
            {/* Background Dark Lab */}
            <rect width="600" height="340" fill="#0a0f1d" />

            {/* Ground plane and mechanically supported table */}
            <line x1="50" y1="300" x2="550" y2="300" stroke="#334155" strokeWidth="3" />
            <rect x="145" y="260" width="310" height="24" rx="5" fill="#5c2c16" />
            <rect x="175" y="284" width="22" height="16" fill="#5c2c16" />
            <rect x="403" y="284" width="22" height="16" fill="#5c2c16" />

            {/* Fig. 2 conical insulating support and graded secondary B */}
            <path
              d="M 242 260 L 275 78 L 325 78 L 358 260 Z"
              fill="rgba(241,228,199,0.22)"
              stroke="#e7d7b7"
              strokeWidth="2"
            />
            {Array.from({ length: 32 }).map((_, index) => {
              const fraction = index / 31;
              const y = 86 + fraction * 166;
              const halfWidth = 25 + fraction * 31;
              return (
                <line
                  key={index}
                  x1={300 - halfWidth}
                  y1={y}
                  x2={300 + halfWidth}
                  y2={y}
                  stroke="#d97706"
                  strokeWidth="2"
                />
              );
            })}
            <text x="326" y="110" fill="#fbbf24" fontSize="12" fontFamily="monospace">
              B — GRADED SECONDARY
            </text>

            {/* Primary C surrounds the adjacent broad secondary end. */}
            <g fill="none" stroke="#f59e0b" strokeWidth="5">
              {[0, 1, 2, 3, 4].map((index) => (
                <ellipse key={index} cx="300" cy="255" rx={68 + index * 13} ry={10 + index * 3} />
              ))}
            </g>
            <text x="175" y="240" fill="#fbbf24" fontSize="12" fontFamily="monospace">
              C — PRIMARY
            </text>

            {/* Remote high-potential terminal; no source toroid. */}
            <line x1="300" y1="78" x2="300" y2="58" stroke="#f59e0b" strokeWidth="4" />
            <circle cx="300" cy="50" r="9" fill="#fbbf24" stroke="#fef3c7" strokeWidth="2" />
            <text x="318" y="53" fill="#fde68a" fontSize="10" fontFamily="monospace">
              REMOTE HIGH TERMINAL
            </text>

            {/* The claimed adjacent secondary / primary / earth bond. */}
            <rect x="452" y="235" width="12" height="35" rx="3" fill="#f59e0b" />
            <path d="M 356 245 Q 405 222 458 235" stroke="#f59e0b" strokeWidth="4" fill="none" />
            <path d="M 380 258 Q 420 250 458 245" stroke="#f59e0b" strokeWidth="4" fill="none" />
            <path d="M 458 235 L 480 300" stroke="#f59e0b" strokeWidth="4" fill="none" />
            <text x="394" y="216" fill="#6ee7b7" fontSize="10" fontFamily="monospace">
              PRIMARY + SECONDARY + EARTH
            </text>

            {/* Other primary terminal and source lead. */}
            <rect x="136" y="235" width="12" height="35" rx="3" fill="#f59e0b" />
            <path d="M 142 235 Q 185 235 220 255" stroke="#f59e0b" strokeWidth="4" fill="none" />
            <text x="72" y="228" fill="#93c5fd" fontSize="10" fontFamily="monospace">
              PRIMARY SOURCE
            </text>

            {/* Ground symbol at the end of the actual common-node lead. */}
            <path
              d="M 480 300 L 480 315 M 465 315 L 495 315 M 470 321 L 490 321 M 475 327 L 485 327"
              stroke="#6ee7b7"
              strokeWidth="2"
            />

            {/* Interpretive discharge from the source's remote terminal. */}
            <g
              stroke="#c084fc"
              strokeWidth="2"
              fill="none"
              opacity="0.9"
              transform={`translate(300 50) scale(${streamerScale}) translate(-300 -50)`}
            >
              <path d="M 300 41 Q 268 25 238 34" strokeWidth="2" />
              <path d="M 300 41 Q 334 22 366 35" strokeWidth="2" />
              <path d="M 300 41 Q 294 18 304 5" strokeWidth="2" stroke="#e9d5ff" />
            </g>
          </svg>

          {/* Telemetry Strip */}
          <div className="w-full grid grid-cols-3 gap-2 text-center text-xs sm:text-sm font-mono pt-3 border-t border-ink-800 text-ink-300">
            <div>
              <span className="text-ink-400 block text-xs">SOURCE FORM</span>
              <span className="text-purple-400 font-bold text-sm sm:text-base">FIG. 2 CONICAL</span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs">ILLUSTRATIVE POTENTIAL</span>
              <span className="text-amber-400 font-bold text-sm sm:text-base">
                {secondaryVoltageKv} kV
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs">INTERPRETIVE WASM</span>
              <span className="text-emerald-400 font-bold text-sm sm:text-base">
                {resonantFreqKhz.toFixed(1)} kHz
              </span>
            </div>
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/80 dark:bg-ink-900/70 p-5 space-y-4 shadow-sm">
            <span className="font-serif font-bold text-base sm:text-lg text-ink-950 dark:text-parchment-50 block">
              Interpretive Excitation Parameters
            </span>

            {/* Secondary Turns Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Secondary Turns ($N_s$)
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {secondaryTurns} turns
                </span>
              </div>
              <input
                type="range"
                aria-label="Secondary Turns (N_s)"
                min="400"
                max="1400"
                step="50"
                value={secondaryTurns}
                onChange={(e) => updateParam("secondaryTurns", Number(e.target.value))}
                className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
              />
            </div>

            {/* Illustrative input excitation */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Input excitation
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {inputKv} kV
                </span>
              </div>
              <input
                type="range"
                aria-label="Illustrative input excitation"
                min="5"
                max="30"
                step="1"
                value={inputKv}
                onChange={(e) => updateParam("inputVoltageKv", Number(e.target.value))}
                className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-ink-950 dark:text-parchment-100 text-xs sm:text-sm font-sans">
              <span className="font-bold text-purple-900 dark:text-purple-300 block font-mono text-xs uppercase tracking-wider mb-1">
                Quarter-Wave Resonance:
              </span>
              <p className="leading-relaxed">
                Tesla specifies secondary wire length near one quarter of the disturbance
                wavelength. The current {resonantFreqKhz.toFixed(1)} kHz value and{" "}
                {secondaryVoltageKv} kV potential come from the explicitly interpretive lumped
                model; the source apparatus claim is the graded winding and its
                primary-secondary-earth connection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
