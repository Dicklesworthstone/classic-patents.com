"use client";

import { RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useState } from "react";
import { stepThomsonWelding } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";

export function ThomsonWeldingSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-347140-thomson-welding");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const weldCurrentAmps = params.weldCurrentAmps ?? 4500;
  const clampPressureMpa = params.clampPressureMpa ?? 35;
  const [isWelding, setIsWelding] = useState<boolean>(false);

  const weld = stepThomsonWelding({ weldCurrentAmps, clampPressureMpa });
  const interfaceTempC = weld.interfaceTempC;
  const isPlasticForged = weld.isForged;

  const handleWeld = () => {
    setIsWelding(true);
    soundEngine.playSwitchClick();
    setTimeout(() => setIsWelding(false), weld.weldPulseMs);
  };

  return (
    <div className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
              Elihu Thomson Electric Resistance Butt-Welder (US 347,140)
            </h3>
          </div>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400 mt-0.5">
            Low-voltage high-current step-down transformer, Joule heating (I²R), and plastic upset
            forging.
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleWeld}
            aria-label="Trigger Electric Weld"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-sans text-xs font-bold shadow transition-colors active:scale-95"
          >
            <Zap className="w-4 h-4" />
            <span>Apply Current</span>
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
              setIsWelding(false);
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
          aria-label={`Electric welding simulation: ${isWelding ? `welding at ${Math.round(weldCurrentAmps)} amps` : "electrodes idle"}, workpiece interface at ${Math.round(interfaceTempC)} degrees Celsius`}
          className="w-full h-full"
        >
          {/* Heavy Step-Down Transformer Core (Bottom) */}
          <rect
            x="180"
            y="220"
            width="240"
            height="80"
            rx="8"
            fill="#4A5568"
            stroke="#2D3748"
            strokeWidth="2"
          />
          <text
            x="210"
            y="265"
            fill="#CBD5E0"
            fontWeight="bold"
            fontSize="12"
            fontFamily="sans-serif"
          >
            Step-Down Transformer (1.5 V, {weldCurrentAmps} A)
          </text>

          {/* Heavy Solid Copper Secondary Conductor Bars */}
          <path
            d="M 220 220 L 220 160 L 250 160"
            stroke="#B87333"
            strokeWidth="18"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 380 220 L 380 160 L 350 160"
            stroke="#B87333"
            strokeWidth="18"
            fill="none"
            strokeLinecap="round"
          />

          {/* Left Water-Cooled Copper Clamp & Steel Rod */}
          <g transform="translate(180, 130)">
            <rect
              x="0"
              y="0"
              width="90"
              height="60"
              rx="4"
              fill="#B87333"
              stroke="#8B5A2B"
              strokeWidth="2"
            />
            <rect
              x="40"
              y="20"
              width="80"
              height="20"
              rx="2"
              fill="#718096"
              stroke="#2D3748"
              strokeWidth="1"
            />
          </g>

          {/* Right Water-Cooled Copper Clamp & Steel Rod (Mechanical Clamp Travel) */}
          <g transform={`translate(${isWelding ? 315 : 330}, 130)`}>
            <rect
              x="0"
              y="0"
              width="90"
              height="60"
              rx="4"
              fill="#B87333"
              stroke="#8B5A2B"
              strokeWidth="2"
            />
            <rect
              x="-30"
              y="20"
              width="80"
              height="20"
              rx="2"
              fill="#718096"
              stroke="#2D3748"
              strokeWidth="1"
            />
            {/* Hydraulic axial arrow */}
            <line
              x1="80"
              y1="30"
              x2="110"
              y2="30"
              stroke="#E53E3E"
              strokeWidth="4"
              markerEnd="url(#arrow)"
            />
          </g>

          {/* High-Temperature Weld Abutment Interface */}
          <g transform="translate(300, 150)">
            {/* White-Hot Glow & Incandescent Sparks if welding */}
            <circle
              cx="0"
              cy="0"
              r={isWelding ? 18 : 8}
              fill={isWelding ? "#FFFFFF" : interfaceTempC > 800 ? "#ECC94B" : "#718096"}
              opacity="0.95"
            />
            {isWelding && (
              <g>
                <circle cx="0" cy="0" r="35" fill="#ECC94B" opacity="0.45" />
                <line x1="0" y1="0" x2="-25" y2="-20" stroke="#ECC94B" strokeWidth="2" />
                <line x1="0" y1="0" x2="20" y2="-28" stroke="#ECC94B" strokeWidth="2" />
                <line x1="0" y1="0" x2="-15" y2="25" stroke="#ECC94B" strokeWidth="2" />
                <line x1="0" y1="0" x2="25" y2="20" stroke="#ECC94B" strokeWidth="2" />
              </g>
            )}
            {/* Plastic Upset Burr */}
            <ellipse
              cx="0"
              cy="0"
              rx={weld.burrSvgRx}
              ry="16"
              fill="#DD6B20"
              opacity={interfaceTempC > 900 ? 0.85 : 0}
            />
          </g>
        </svg>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Secondary Current
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {weldCurrentAmps.toLocaleString()} A
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Interface Heat Rate
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500">
            {weld.jouleKw.toFixed(1)} kW (I²R)
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Interface Temp
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500">
            {interfaceTempC}°C
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Weld State
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {isPlasticForged ? "Solid Forged" : "Cold / Elastic"} · {weld.weldPulseMs} ms
          </span>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-parchment-200 dark:border-ink-800">
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Secondary Welding Current</span>
            <span className="font-mono">{weldCurrentAmps} Amperes</span>
          </div>
          <input
            type="range"
            aria-label="Secondary welding current in amperes"
            min="1000"
            max="6000"
            step="100"
            value={weldCurrentAmps}
            onChange={(e) => updateParam("weldCurrentAmps", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Mechanical Clamping Pressure</span>
            <span className="font-mono">{clampPressureMpa} MPa</span>
          </div>
          <input
            type="range"
            aria-label="Mechanical clamping pressure in megapascals"
            min="10"
            max="60"
            step="5"
            value={clampPressureMpa}
            onChange={(e) => updateParam("clampPressureMpa", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </div>
      </div>
    </div>
  );
}
