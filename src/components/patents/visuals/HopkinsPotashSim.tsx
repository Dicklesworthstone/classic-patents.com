"use client";

import { Flame, FlaskConical, Pause, Play, Sparkles, Volume2, VolumeX, Waves } from "lucide-react";
import {
  getHopkinsTapeFrame,
  HOPKINS_DEFAULT_CONTROLS,
  HOPKINS_FRANKENSIM_BOUNDARY,
  HOPKINS_KERNEL_SOURCE,
  HOPKINS_SOURCE_BOUNDARY,
  stepHopkinsPotash,
} from "@/physics/hopkinsPotashKernel";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { SimulationHeader } from "./SimulationHeader";
import { usePatentAudio } from "./three/usePatentAudio";

export function HopkinsPotashSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-x1-hopkins-potash");
  const { isAudioMuted, toggleSound } = usePatentAudio();

  const roastTempC = params.roastTempC ?? HOPKINS_DEFAULT_CONTROLS.roastTempC;
  const roastTimeHours = params.roastTimeHours ?? HOPKINS_DEFAULT_CONTROLS.roastTimeHours;
  const ashBatchKg = params.ashBatchKg ?? HOPKINS_DEFAULT_CONTROLS.ashBatchKg;
  const waterTempC = params.waterTempC ?? HOPKINS_DEFAULT_CONTROLS.waterTempC;
  const isPlaying = (params.isRunning ?? 1) > 0.5;
  const fallback = stepHopkinsPotash({
    roastTempC,
    roastTimeHours,
    ashBatchKg,
    waterTempC,
  });
  const { frame } = useFrankenSimPhysics("us-x1-hopkins-potash", {
    domain: "thermodynamics_transport",
    refusal: { isRefused: true, reason: HOPKINS_SOURCE_BOUNDARY },
  });
  const tape = getHopkinsTapeFrame();
  const pot = tape?.outputs ?? fallback;
  const cycleProgress = tape?.phases.processCycle01 ?? 0;

  // Dynamic colors based on temperature
  const flameHue = Math.min(50, Math.max(10, (roastTempC - 500) * 0.08));
  const ashGlow = `rgb(${Math.min(255, 140 + (roastTempC - 500) * 0.25)}, ${Math.min(200, 40 + (roastTempC - 500) * 0.35)}, 30)`;
  const mobileOperations = [
    {
      number: 1,
      title: "Burn raw ashes in a furnace",
      detail: `Scenario burnout ${pot.decarbonizationPct}% at ${roastTempC} °C`,
    },
    {
      number: 2,
      title: "Dissolve and boil the burnt ashes",
      detail: `Scenario ley density ${pot.leyDensityKgM3} kg/m³`,
    },
    {
      number: 3,
      title: "Draw off and settle the ley",
      detail: "Clear ley above a supported insoluble-dross layer",
    },
    {
      number: 4,
      title: "Boil the ley into true pearl ash",
      detail: `Scenario yield ${pot.pearlAshYieldKg} kg at ${pot.pearlAshPurityPct}% assay`,
    },
    {
      number: 5,
      title: "Optionally flux pearl ash into pot ash",
      detail: `Scenario fused phase ${pot.potashFusedVolumeLiters} L; no invented ingot`,
    },
  ] as const;

  return (
    <div
      className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors"
      data-hopkins-face="two"
      data-hopkins-runtime-tick={frame.tick}
      data-hopkins-runtime-provenance={frame.provenance}
      data-hopkins-kernel-source={HOPKINS_KERNEL_SOURCE}
      data-hopkins-frankensim-boundary={HOPKINS_FRANKENSIM_BOUNDARY}
      data-hopkins-running={isPlaying}
      data-hopkins-process-cycle={cycleProgress}
      data-hopkins-flame-phase-rad={tape?.phases.flamePhaseRad ?? 0}
      data-hopkins-boil-phase-rad={tape?.phases.boilPhaseRad ?? 0}
    >
      <SimulationHeader
        icon={<FlaskConical className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
        title="Samuel Hopkins Potash & Pearl Ash Apparatus (US X1)"
        description="The five printed operations in source order; geometry and numerical outputs are declared modern teaching scenarios."
        playbackAction={{
          label: isPlaying ? "Pause Simulation" : "Play Simulation",
          icon: isPlaying ? (
            <Pause className="h-4 w-4 text-amber-600" />
          ) : (
            <Play className="h-4 w-4" />
          ),
          onPress: () => {
            updateParam("isRunning", isPlaying ? 0 : 1);
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
          updateParam("resetEpoch", (params.resetEpoch ?? 0) + 1);
          soundEngine.playSwitchClick();
        }}
      />

      <p className="mt-3 text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
        {HOPKINS_SOURCE_BOUNDARY}
      </p>

      {/* Main 2D Schematic Simulation SVG */}
      <div className="relative my-6 w-full rounded-xl border border-parchment-300 dark:border-ink-800 bg-white dark:bg-ink-900 overflow-hidden shadow-inner flex items-center justify-center sm:min-h-[360px] p-2">
        <ol
          className="w-full list-none space-y-1 p-2 sm:hidden"
          aria-label="Five-operation mobile process chain"
        >
          {mobileOperations.map((operation, index) => (
            <li key={operation.number}>
              <div
                data-hopkins-mobile-operation={operation.number}
                className="flex items-start gap-3 rounded-lg border border-parchment-300 bg-parchment-50 p-3 dark:border-ink-700 dark:bg-ink-950"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-700 font-mono text-sm font-bold text-white">
                  {operation.number}
                </span>
                <div>
                  <p className="font-serif text-sm font-bold text-ink-900 dark:text-parchment-100">
                    {operation.title}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-ink-600 dark:text-parchment-400">
                    {operation.detail}
                  </p>
                </div>
              </div>
              {index < mobileOperations.length - 1 && (
                <div className="flex h-8 items-center pl-[1.6rem] text-[10px] font-mono text-amber-700 dark:text-amber-400">
                  <span className="h-full border-l-2 border-dashed border-amber-500" />
                  <span className="ml-2">↓ normalized material handoff</span>
                </div>
              )}
            </li>
          ))}
        </ol>
        <svg
          viewBox="0 0 800 400"
          className="hidden w-full h-auto max-h-[460px] select-none sm:block"
          role="img"
          aria-label="Source-bounded Samuel Hopkins five-operation pot and pearl ash process reader"
        >
          {/* Background Grid & Framing */}
          <rect width="800" height="400" fill="transparent" />
          <defs>
            <marker
              id="hopkins-flow-arrow"
              markerWidth="8"
              markerHeight="8"
              refX="7"
              refY="4"
              orient="auto"
            >
              <path d="M 0 0 L 8 4 L 0 8 Z" fill="#d97706" />
            </marker>
          </defs>
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

          {/* ════════ PRINTED OPERATION 1: BURN RAW ASHES ════════ */}
          <g id="operation-1-burn-ashes" transform="translate(-20 0) scale(0.82 1)">
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
              1. Burn Raw Ashes
            </text>
            <text x="120" y="326" textAnchor="middle" fill="#059669" fontSize="10" fontWeight="600">
              Scenario burnout: {pot.decarbonizationPct}%
            </text>
          </g>

          {/* Transfer Arrow 1 -> 2 */}
          <path
            d="M 144 210 L 176 210"
            stroke="#d97706"
            strokeWidth="2"
            markerEnd="url(#hopkins-flow-arrow)"
            strokeDasharray="4 2"
          />

          {/* ════════ PRINTED OPERATION 2: DISSOLVE AND BOIL ════════ */}
          <g id="operation-2-dissolve-boil" transform="translate(-37 0) scale(0.82 1)">
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
              2. Dissolve &amp; Boil
            </text>
            <text x="320" y="326" textAnchor="middle" fill="#0284c7" fontSize="10" fontWeight="600">
              Scenario ρ = {pot.leyDensityKgM3} kg/m³
            </text>
          </g>

          {/* Normalized draw-off pipe: operation 2 -> printed operation 3 */}
          <path
            d="M 275 260 L 325 260"
            stroke="#f59e0b"
            strokeWidth="3"
            fill="none"
            markerEnd="url(#hopkins-flow-arrow)"
          />

          {/* ════════ PRINTED OPERATION 3: DRAW OFF AND SETTLE THE LEY ════════ */}
          <g id="operation-3-settle-ley">
            <path
              d="M 330 155 L 338 275 L 422 275 L 430 155 Z"
              fill="#78350f"
              stroke="#451a03"
              strokeWidth="3"
            />
            <rect x="340" y="175" width="80" height="65" rx="3" fill="#f59e0b" opacity="0.8" />
            <rect x="339" y="242" width="82" height="30" rx="2" fill="#57534e" />
            <text x="380" y="209" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
              Settled Ley
            </text>
            <text x="380" y="260" textAnchor="middle" fill="#e7e5e4" fontSize="8">
              Insoluble dross
            </text>
            <text
              x="380"
              y="310"
              textAnchor="middle"
              fill="currentColor"
              className="text-ink-800 dark:text-parchment-200 font-serif font-bold text-xs"
            >
              3. Draw Off &amp; Settle
            </text>
            <text x="380" y="326" textAnchor="middle" fill="#0284c7" fontSize="9" fontWeight="600">
              Gravity separation
            </text>
          </g>

          <path
            d="M 430 245 L 456 245"
            stroke="#f59e0b"
            strokeWidth="3"
            fill="none"
            markerEnd="url(#hopkins-flow-arrow)"
          />

          {/* ════════ PRINTED OPERATION 4: BOIL SETTLED LEY INTO PEARL ASH ════════ */}
          <g id="operation-4-pearl-ash" transform="translate(95 0) scale(0.82 1)">
            <rect
              x="460"
              y="228"
              width="100"
              height="48"
              rx="5"
              fill="#7c2d12"
              stroke="#431407"
              strokeWidth="3"
            />
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
              4. Pearl Ash Kettle
            </text>
            <text x="510" y="326" textAnchor="middle" fill="#9333ea" fontSize="10" fontWeight="600">
              Scenario {pot.pearlAshYieldKg} kg ({pot.pearlAshPurityPct}% assay)
            </text>
          </g>

          {/* Normalized manual tray: pearl ash -> optional fluxing operation */}
          <path
            d="M 571 230 L 657 230"
            stroke="#9333ea"
            strokeWidth="4"
            strokeDasharray="3 3"
            markerEnd="url(#hopkins-flow-arrow)"
          />

          {/* ════════ OPTIONAL OPERATION 5: FLUX PEARL ASH INTO POT ASH ════════ */}
          <g id="operation-5-flux-pot-ash" transform="translate(113 0) scale(0.85 1)">
            <rect
              x="642"
              y="224"
              width="106"
              height="40"
              rx="5"
              fill="#7c2d12"
              stroke="#431407"
              strokeWidth="3"
            />
            <path
              d="M 650 185 Q 695 265 740 185 Z"
              fill="#1f2937"
              stroke="#111827"
              strokeWidth="3"
            />
            <ellipse
              cx="695"
              cy="190"
              rx="42"
              ry="9"
              fill="#fbbf24"
              stroke="#d97706"
              strokeWidth="2"
            />
            <text
              x="695"
              y="215"
              textAnchor="middle"
              fill="#92400e"
              fontSize="10"
              fontWeight="bold"
              fontFamily="serif"
            >
              FUSED POT ASH
            </text>

            <text
              x="695"
              y="310"
              textAnchor="middle"
              fill="currentColor"
              className="text-ink-800 dark:text-parchment-200 font-serif font-bold text-xs"
            >
              5. Optional Fluxing
            </text>
            <text x="695" y="326" textAnchor="middle" fill="#d97706" fontSize="10" fontWeight="600">
              Scenario fused phase: {pot.potashFusedVolumeLiters} L
            </text>
          </g>
        </svg>
      </div>

      {/* Real-time SI Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="p-3 rounded-xl bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800">
          <div className="flex items-center gap-1.5 text-xs text-parchment-700 dark:text-ink-400 font-mono">
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            Scenario Burnout
          </div>
          <div className="text-lg font-bold font-mono text-ink-900 dark:text-parchment-100 mt-1">
            {pot.decarbonizationPct}%
          </div>
          <div className="text-[11px] text-parchment-600 dark:text-ink-400">
            Declared kinetic model
          </div>
        </div>

        <div className="p-3 rounded-xl bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800">
          <div className="flex items-center gap-1.5 text-xs text-parchment-700 dark:text-ink-400 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Scenario Pearl Ash
          </div>
          <div className="text-lg font-bold font-mono text-ink-900 dark:text-parchment-100 mt-1">
            {pot.pearlAshYieldKg} kg
          </div>
          <div className="text-[11px] text-parchment-600 dark:text-ink-400">
            {pot.pearlAshPurityPct}% assumed assay relation
          </div>
        </div>

        <div className="p-3 rounded-xl bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800">
          <div className="flex items-center gap-1.5 text-xs text-parchment-700 dark:text-ink-400 font-mono">
            <Waves className="w-3.5 h-3.5 text-blue-600" />
            Scenario Ley
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
            Scenario Extraction
          </div>
          <div className="text-lg font-bold font-mono text-ink-900 dark:text-parchment-100 mt-1">
            {pot.extractionEfficiencyPct}%
          </div>
          <div className="text-[11px] text-parchment-600 dark:text-ink-400">
            vs declared salt inventory
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
