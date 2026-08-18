"use client";

import { Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepPasteurFermentation } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { usePatentAudio } from "./three/usePatentAudio";

export function PasteurFermentationSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-135245-pasteur-fermentation");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const bathTempC = params.pasteurizationTempC ?? 58;
  const holdTimeMinutes = params.holdTimeMin ?? 20;
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const animRef = useRef<number | null>(null);

  const pasteur = stepPasteurFermentation({
    pasteurizationTempC: bathTempC,
    holdTimeMin: holdTimeMinutes,
    wortTempC: params.wortTempC ?? 22,
  });
  const decimalReductionLog = pasteur.logReduction;
  const isMicrobesKilled = decimalReductionLog >= 6;
  const isAromaPreserved = bathTempC <= 65;
  const survivingBacteriaPct = pasteur.survivorPct;
  const shelfLifeMonths = pasteur.shelfLifeMonths;

  useEffect(() => {
    if (!isPlaying) return;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min(0.1, (time - lastTime) / 1000);
      lastTime = time;
      
      setTimerSeconds((prev) => (prev + dt) % 60);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying]);

  return (
    <div className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
            Pasteur Thermal Fermentation &amp; Pasteurization (US 135,245)
          </h3>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400">
            Interactive 2D Biochemical Model — Sub-Boiling Thermal Inactivation, Aseptic Filtered
            Cooling, and Pure Yeast Monoculture
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
            onClick={() => {
              resetParams();
              setTimerSeconds(0);
            }}
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
          {/* Water Heating Jacket Tank */}
          <rect
            x="140"
            y="80"
            width="320"
            height="200"
            rx="16"
            fill="#ED8936"
            opacity={bathTempC / 120}
            stroke="#C05621"
            strokeWidth="3"
          />
          <text
            x="160"
            y="105"
            fill="#FFFFFF"
            fontWeight="bold"
            fontSize="12"
            fontFamily="sans-serif"
          >
            Water Bath: {bathTempC}°C
          </text>

          {/* Sealed Copper Fermentation Vat inside Bath */}
          <rect
            x="200"
            y="110"
            width="200"
            height="150"
            rx="8"
            fill="#8B5A2B"
            stroke="#5C4033"
            strokeWidth="2"
          />
          <rect x="210" y="125" width="180" height="120" rx="4" fill="#D69E2E" opacity="0.75" />
          <text
            x="235"
            y="180"
            fill="#2D3748"
            fontWeight="bold"
            fontSize="13"
            fontFamily="sans-serif"
          >
            Sealed Liquid Vat
          </text>

          {/* Microscopic Spoilage Microbes vs Yeast Cells */}
          <g id="microbial-view">
            {Array.from({ length: 14 }).map((_, i) => {
              const xPos = 230 + (i % 5) * 32;
              const yOffset = Math.sin(timerSeconds * 3 + i) * 3;
              const yPos = 140 + Math.floor(i / 5) * 28 + yOffset;
              const isAlive = !isMicrobesKilled;
              return (
                <g key={`microbe-${xPos}-${i}`}>
                  {/* Round Yeast cells (Intact) */}
                  <circle
                    cx={xPos}
                    cy={yPos}
                    r="5"
                    fill="#FAF089"
                    stroke="#B7791F"
                    strokeWidth="1.5"
                  />
                  {/* Rod-shaped Lactic/Acetic Bacteria (Killed if hot) */}
                  <rect
                    x={xPos + 10}
                    y={yPos - 3}
                    width="10"
                    height="4"
                    rx="2"
                    fill={isAlive ? "#E53E3E" : "#718096"}
                    opacity={isAlive ? 0.9 : 0.25}
                  />
                </g>
              );
            })}
          </g>

          {/* Cotton-Wool Sterile Air Filter Tube on Top */}
          <g transform="translate(300, 70)">
            <line x1="0" y1="0" x2="0" y2="40" stroke="#CBD5E0" strokeWidth="6" />
            <ellipse
              cx="0"
              cy="-5"
              rx="20"
              ry="12"
              fill="#EDF2F7"
              stroke="#A0AEC0"
              strokeWidth="2"
            />
            <text
              x="-45"
              y="-12"
              fill="#718096"
              fontSize="9"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Cotton Filter
            </text>
          </g>
        </svg>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Water Temperature
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {bathTempC}°C
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Microbial Lethality
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500">
            {decimalReductionLog} Log Reduction
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Surviving Bacteria
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500">
            {survivingBacteriaPct}%
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Aroma / Shelf-Life
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {isAromaPreserved ? "Intact" : "Boiled"} / {shelfLifeMonths} mo
          </span>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-parchment-200 dark:border-ink-800">
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Water Bath Temperature</span>
            <span className="font-mono">{bathTempC}°C</span>
          </div>
          <input
            type="range"
            min="45"
            max="75"
            step="1"
            value={bathTempC}
            onChange={(e) => updateParam("pasteurizationTempC", Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Thermal Hold Time</span>
            <span className="font-mono">{holdTimeMinutes} minutes</span>
          </div>
          <input
            type="range"
            min="5"
            max="40"
            step="5"
            value={holdTimeMinutes}
            onChange={(e) => updateParam("holdTimeMin", Number(e.target.value))}
            className="w-full accent-amber-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
