"use client";

import { Flame, FlaskConical, Pause, Play, Sparkles, Volume2, VolumeX, Waves } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepHopkinsPotash } from "@/physics/hopkinsPotashKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { SimulationHeader } from "./SimulationHeader";
import { usePatentAudio } from "./three/usePatentAudio";
import { useOffscreenGate } from "./useOffscreenGate";

const UI_SNAPSHOT_INTERVAL_MS = 80;

export function HopkinsPotashSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-x1-hopkins-potash");
  const { isAudioMuted, toggleSound } = usePatentAudio();

  const roastTempC = params.roastTempC ?? 750;
  const roastTimeHours = params.roastTimeHours ?? 2.5;
  const ashBatchKg = params.ashBatchKg ?? 200;
  const waterTempC = params.waterTempC ?? 80;

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [cycleProgress, setCycleProgress] = useState<number>(0);
  const cycleProgressRef = useRef(0);
  const roastTimeHoursRef = useRef(roastTimeHours);
  const { rootRef, onscreenRef } = useOffscreenGate<HTMLDivElement>();

  const pot = stepHopkinsPotash({
    roastTempC,
    roastTimeHours,
    ashBatchKg,
    waterTempC,
  });

  useEffect(() => {
    roastTimeHoursRef.current = roastTimeHours;
  }, [roastTimeHours]);

  useEffect(() => {
    if (!isPlaying) return;
    let animId: number;
    let lastTime = performance.now();
    let lastUiSnapshot = 0;

    const loop = (now: number) => {
      animId = requestAnimationFrame(loop);
      if (!onscreenRef.current) {
        lastTime = now;
        return;
      }
      const dt = Math.max(0, Math.min(0.1, (now - lastTime) / 1000));
      lastTime = now;
      const cycleRate = 0.2 * (2.5 / Math.max(0.2, roastTimeHoursRef.current));
      cycleProgressRef.current = (cycleProgressRef.current + dt * cycleRate) % 1.0;
      // Flame, smoke, drops, and vapor paths are coupled paths rather than a rigid
      // transform, so publish a bounded SVG snapshot instead of a full rAF re-render.
      if (now - lastUiSnapshot >= UI_SNAPSHOT_INTERVAL_MS) {
        lastUiSnapshot = now;
        setCycleProgress(cycleProgressRef.current);
      }
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, onscreenRef]);

  // Dynamic colors based on temperature
  const flameHue = Math.min(50, Math.max(10, (roastTempC - 500) * 0.08));
  const ashGlow = `rgb(${Math.min(255, 140 + (roastTempC - 500) * 0.25)}, ${Math.min(200, 40 + (roastTempC - 500) * 0.35)}, 30)`;

  return (
    <div
      ref={rootRef}
      className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors"
    >
      <SimulationHeader
        icon={<FlaskConical className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
        title="Samuel Hopkins Potash & Pearl Ash Apparatus (US X1)"
        description="US Patent No. 1 (1790) — Thermochemical calcination, raw ash leaching, and pearl ash crystallization."
        playbackAction={{
          label: isPlaying ? "Pause Simulation" : "Play Simulation",
          icon: isPlaying ? (
            <Pause className="h-4 w-4 text-amber-600" />
          ) : (
            <Play className="h-4 w-4" />
          ),
          onPress: () => {
            setIsPlaying(!isPlaying);
            soundEngine.playSwitchClick();
          },
        }}
        audioAction={{
          label: isAudioMuted ? "Unmute Audio" : "Mute Audio",
          icon: isAudioMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4 text-amber-600" />
          ),
          onPress: () => {
            toggleSound();
            soundEngine.playSwitchClick();
          },
        }}
        onReset={() => {
          resetParams();
          cycleProgressRef.current = 0;
          setCycleProgress(0);
          soundEngine.playSwitchClick();
        }}
      />

      {/* Main 2D Schematic Simulation SVG */}
      <div className="relative my-6 w-full rounded-xl border border-parchment-300 dark:border-ink-800 bg-white dark:bg-ink-900 overflow-hidden shadow-inner flex items-center justify-center min-h-[360px] p-2">
        <svg
          viewBox="0 0 800 400"
          className="w-full h-auto max-h-[460px] select-none"
          role="img"
          aria-label="Samuel Hopkins 1790 4-Stage Pot and Pearl Ash Process Diagram"
        >
          {/* Background Grid & Framing */}
          <rect width="800" height="400" fill="transparent" />
          <pattern id="hp-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-parchment-200 dark:text-ink-800"
            />
          </pattern>
          <rect width="800" height="400" fill="url(#hp-grid)" opacity="0.4" />

          {/* ════════ STAGE 1: REVERBERATORY CALCINING KILN ════════ */}
          <g id="stage-1-furnace">
            {/* Furnace Brick Shell */}
            <path
              d="M 40 280 L 40 140 Q 120 90 200 140 L 200 280 Z"
              fill="#5c2c1e"
              stroke="#3d1d14"
              strokeWidth="3"
            />
            {/* Arched Reverberatory Roof */}
            <path
              d="M 50 145 Q 120 105 190 145"
              fill="none"
              stroke="#d97706"
              strokeWidth="4"
              strokeDasharray="6 3"
              opacity="0.8"
            />
            {/* Hearth Bed & Glowing Ashes */}
            <rect x="55" y="220" width="130" height="30" rx="4" fill={ashGlow} />
            <text
              x="120"
              y="240"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="10"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              Raw Ash Bed ({roastTempC}°C)
            </text>

            {/* Firebox & Flames */}
            <path
              d={`M 60 270 Q 75 ${250 - Math.sin(cycleProgress * 20) * 10} 90 270 Q 105 ${245 - Math.cos(cycleProgress * 15) * 12} 120 270 Q 135 ${250 - Math.sin(cycleProgress * 25) * 8} 150 270 Q 165 ${255 - Math.cos(cycleProgress * 18) * 10} 180 270 Z`}
              fill={`hsl(${flameHue}, 95%, 55%)`}
              opacity="0.85"
            />

            {/* Chimney & Smoke Exhaust */}
            <rect
              x="70"
              y="60"
              width="30"
              height="70"
              fill="#3d1d14"
              stroke="#26120c"
              strokeWidth="2"
            />
            {/* Rising CO2 particles */}
            {[...Array(6)].map((_, i) => (
              <circle
                key={`smoke-${i}`}
                cx={85 + Math.sin(cycleProgress * 10 + i) * 12}
                cy={60 - ((cycleProgress * 100 + i * 25) % 50)}
                r={3 + i}
                fill="#9ca3af"
                opacity={
                  Math.max(0, 0.6 - ((cycleProgress * 100 + i * 25) % 50) / 60) *
                  (1 - pot.decarbonizationPct / 120)
                }
              />
            ))}

            <text
              x="120"
              y="310"
              textAnchor="middle"
              fill="currentColor"
              className="text-ink-800 dark:text-parchment-200 font-serif font-bold text-xs"
            >
              1. Calcining Furnace
            </text>
            <text x="120" y="326" textAnchor="middle" fill="#059669" fontSize="10" fontWeight="600">
              {pot.decarbonizationPct}% Decarbonized
            </text>
          </g>

          {/* Transfer Arrow 1 -> 2 */}
          <path
            d="M 210 210 L 250 210"
            stroke="#d97706"
            strokeWidth="2"
            markerEnd="url(#arrow)"
            strokeDasharray="4 2"
          />

          {/* ════════ STAGE 2: LIXIVIATION LEACHING VAT ════════ */}
          <g id="stage-2-leaching">
            {/* Wooden Staved Tub */}
            <path
              d="M 260 140 L 270 280 L 370 280 L 380 140 Z"
              fill="#78350f"
              stroke="#451a03"
              strokeWidth="3"
            />
            {/* Ash Percolating Layer */}
            <rect x="273" y="160" width="94" height="60" fill="#d1d5db" opacity="0.8" rx="2" />
            <text x="320" y="195" textAnchor="middle" fill="#374151" fontSize="9" fontWeight="bold">
              Calcined Ash
            </text>

            {/* Hot Water Shower Pipe */}
            <line x1="320" y1="90" x2="320" y2="135" stroke="#0284c7" strokeWidth="4" />
            <circle cx="320" cy="135" r="5" fill="#0284c7" />
            {/* Water Drops */}
            {[...Array(4)].map((_, i) => (
              <line
                key={`drop-${i}`}
                x1={290 + i * 20}
                y1={140 + ((cycleProgress * 60 + i * 15) % 20)}
                x2={290 + i * 20}
                y2={145 + ((cycleProgress * 60 + i * 15) % 20)}
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="2 2"
              />
            ))}

            {/* Heavy Ley Layer at Bottom */}
            <rect x="271" y="240" width="98" height="38" fill="#f59e0b" opacity="0.85" rx="2" />
            <text x="320" y="262" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
              Alkaline Ley ({waterTempC}°C)
            </text>

            <text
              x="320"
              y="310"
              textAnchor="middle"
              fill="currentColor"
              className="text-ink-800 dark:text-parchment-200 font-serif font-bold text-xs"
            >
              2. Leaching Tub
            </text>
            <text x="320" y="326" textAnchor="middle" fill="#0284c7" fontSize="10" fontWeight="600">
              ρ = {pot.leyDensityKgM3} kg/m³
            </text>
          </g>

          {/* Transfer Pipe 2 -> 3 */}
          <path d="M 370 260 L 440 260" stroke="#f59e0b" strokeWidth="3" fill="none" />

          {/* ════════ STAGE 3: EVAPORATING CRYSTALLIZER ════════ */}
          <g id="stage-3-crystallizer">
            {/* Hemispherical Iron Pot on Fire Hearth */}
            <path
              d="M 440 180 Q 510 280 580 180 Z"
              fill="#374151"
              stroke="#1f2937"
              strokeWidth="3"
            />
            {/* Boiling Boiling Liquor */}
            <path d="M 450 200 Q 510 260 570 200 Z" fill="#fbbf24" opacity="0.9" />

            {/* Steam Vapors */}
            {[...Array(5)].map((_, i) => (
              <path
                key={`steam-${i}`}
                d={`M ${470 + i * 22} 180 Q ${480 + i * 22 + Math.sin(cycleProgress * 15 + i) * 10} 140 ${470 + i * 22} 100`}
                stroke="#e5e7eb"
                strokeWidth="2"
                fill="none"
                opacity={0.7}
                strokeDasharray="4 2"
              />
            ))}

            {/* Precipitating Pearl Ash Crystals */}
            {[...Array(8)].map((_, i) => (
              <circle
                key={`crystal-${i}`}
                cx={480 + (i % 4) * 20 + Math.sin(i) * 5}
                cy={220 + Math.floor(i / 4) * 15}
                r="3"
                fill="#ffffff"
                stroke="#d97706"
                strokeWidth="1"
              />
            ))}

            {/* Underfire */}
            <path
              d="M 470 285 Q 510 270 550 285"
              fill="none"
              stroke="#ef4444"
              strokeWidth="4"
              strokeDasharray="5 3"
            />

            <text
              x="510"
              y="310"
              textAnchor="middle"
              fill="currentColor"
              className="text-ink-800 dark:text-parchment-200 font-serif font-bold text-xs"
            >
              3. Pearl Ash Kettle
            </text>
            <text x="510" y="326" textAnchor="middle" fill="#9333ea" fontSize="10" fontWeight="600">
              {pot.pearlAshYieldKg} kg ({pot.pearlAshPurityPct}% Pure)
            </text>
          </g>

          {/* Transfer 3 -> 4 */}
          <path d="M 580 230 L 640 230" stroke="#9333ea" strokeWidth="2" strokeDasharray="3 3" />

          {/* ════════ STAGE 4: FLUXING & CAST POTASH ════════ */}
          <g id="stage-4-fluxing">
            {/* Ingot Mold */}
            <rect
              x="640"
              y="190"
              width="110"
              height="80"
              rx="6"
              fill="#1f2937"
              stroke="#111827"
              strokeWidth="3"
            />
            {/* Cast Solid Potash Ingot */}
            <rect
              x="650"
              y="200"
              width="90"
              height="60"
              rx="3"
              fill="#fef3c7"
              stroke="#d97706"
              strokeWidth="2"
            />
            <text
              x="695"
              y="235"
              textAnchor="middle"
              fill="#92400e"
              fontSize="10"
              fontWeight="bold"
              fontFamily="serif"
            >
              TRUE POTASH
            </text>
            <text x="695" y="250" textAnchor="middle" fill="#78350f" fontSize="8">
              Fused K₂CO₃
            </text>

            <text
              x="695"
              y="310"
              textAnchor="middle"
              fill="currentColor"
              className="text-ink-800 dark:text-parchment-200 font-serif font-bold text-xs"
            >
              4. Fluxing Smelter
            </text>
            <text x="695" y="326" textAnchor="middle" fill="#d97706" fontSize="10" fontWeight="600">
              {pot.potashFusedVolumeLiters} L Cast Block
            </text>
          </g>
        </svg>
      </div>

      {/* Real-time SI Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="p-3 rounded-xl bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800">
          <div className="flex items-center gap-1.5 text-xs text-parchment-700 dark:text-ink-400 font-mono">
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            Decarbonization
          </div>
          <div className="text-lg font-bold font-mono text-ink-900 dark:text-parchment-100 mt-1">
            {pot.decarbonizationPct}%
          </div>
          <div className="text-[11px] text-parchment-600 dark:text-ink-400">
            Organic carbon oxidized
          </div>
        </div>

        <div className="p-3 rounded-xl bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800">
          <div className="flex items-center gap-1.5 text-xs text-parchment-700 dark:text-ink-400 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Pearl Ash Yield
          </div>
          <div className="text-lg font-bold font-mono text-ink-900 dark:text-parchment-100 mt-1">
            {pot.pearlAshYieldKg} kg
          </div>
          <div className="text-[11px] text-parchment-600 dark:text-ink-400">
            {pot.pearlAshPurityPct}% K₂CO₃ assay
          </div>
        </div>

        <div className="p-3 rounded-xl bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800">
          <div className="flex items-center gap-1.5 text-xs text-parchment-700 dark:text-ink-400 font-mono">
            <Waves className="w-3.5 h-3.5 text-blue-600" />
            Ley Concentration
          </div>
          <div className="text-lg font-bold font-mono text-ink-900 dark:text-parchment-100 mt-1">
            {pot.leyConcentrationGpl} g/L
          </div>
          <div className="text-[11px] text-parchment-600 dark:text-ink-400">
            {pot.leyDensityKgM3} kg/m³ density
          </div>
        </div>

        <div className="p-3 rounded-xl bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800">
          <div className="flex items-center gap-1.5 text-xs text-parchment-700 dark:text-ink-400 font-mono">
            <FlaskConical className="w-3.5 h-3.5 text-emerald-600" />
            Extraction Yield
          </div>
          <div className="text-lg font-bold font-mono text-ink-900 dark:text-parchment-100 mt-1">
            {pot.extractionEfficiencyPct}%
          </div>
          <div className="text-[11px] text-parchment-600 dark:text-ink-400">
            vs theoretical max salt
          </div>
        </div>
      </div>

      {/* Interactive Controls Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-parchment-200 dark:border-ink-800">
        <div>
          <label
            htmlFor="hopkins-roast-temp"
            className="block text-xs font-mono font-medium text-ink-700 dark:text-parchment-300 mb-1"
          >
            Furnace Temp: <span className="font-bold text-amber-600">{roastTempC}°C</span>
          </label>
          <input
            id="hopkins-roast-temp"
            type="range"
            min="500"
            max="950"
            step="25"
            value={roastTempC}
            onChange={(e) => updateParam("roastTempC", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </div>

        <div>
          <label
            htmlFor="hopkins-roast-time"
            className="block text-xs font-mono font-medium text-ink-700 dark:text-parchment-300 mb-1"
          >
            Roasting Time: <span className="font-bold text-amber-600">{roastTimeHours} hrs</span>
          </label>
          <input
            id="hopkins-roast-time"
            type="range"
            min="0.5"
            max="6.0"
            step="0.5"
            value={roastTimeHours}
            onChange={(e) => updateParam("roastTimeHours", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </div>

        <div>
          <label
            htmlFor="hopkins-ash-batch"
            className="block text-xs font-mono font-medium text-ink-700 dark:text-parchment-300 mb-1"
          >
            Raw Ash Batch: <span className="font-bold text-amber-600">{ashBatchKg} kg</span>
          </label>
          <input
            id="hopkins-ash-batch"
            type="range"
            min="50"
            max="500"
            step="25"
            value={ashBatchKg}
            onChange={(e) => updateParam("ashBatchKg", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </div>

        <div>
          <label
            htmlFor="hopkins-water-temp"
            className="block text-xs font-mono font-medium text-ink-700 dark:text-parchment-300 mb-1"
          >
            Water Temp: <span className="font-bold text-amber-600">{waterTempC}°C</span>
          </label>
          <input
            id="hopkins-water-temp"
            type="range"
            min="20"
            max="100"
            step="5"
            value={waterTempC}
            onChange={(e) => updateParam("waterTempC", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </div>
      </div>
    </div>
  );
}
