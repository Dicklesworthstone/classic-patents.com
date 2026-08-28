"use client";

import { Flame, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useMemo, useState } from "react";
import { stepCortPuddlingRolling } from "@/physics/cortKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";

interface CortPuddlingRollingSimProps {
  className?: string;
}

export function CortPuddlingRollingSim({ className = "" }: CortPuddlingRollingSimProps) {
  const { params, updateParam, resetParams } = usePatentPhysics("gb-1420-cort-puddling-rolling");
  const { isAudioMuted, toggleSound } = usePatentAudio();

  const [activeTab, setActiveTab] = useState<"furnace" | "mill">("furnace");

  const furnaceTempC = params.furnaceTemperatureCelsius ?? 1350;
  const initialCarbonPct = params.initialCarbonPercent ?? 3.8;
  const rabbleRpm = params.rabbleStirringRpm ?? 15;
  const puddlingTimeMin = params.puddlingDurationMinutes ?? 90;
  const rollerPasses = params.rollerPassCount ?? 5;

  const sim = useMemo(() => {
    return stepCortPuddlingRolling({
      furnaceTemperatureCelsius: furnaceTempC,
      initialCarbonPercent: initialCarbonPct,
      rabbleStirringRpm: rabbleRpm,
      puddlingDurationMinutes: puddlingTimeMin,
      rollerPassCount: rollerPasses,
    });
  }, [furnaceTempC, initialCarbonPct, rabbleRpm, puddlingTimeMin, rollerPasses]);

  return (
    <div
      className={`w-full rounded-2xl bg-parchment-50 dark:bg-ink-950/90 border border-parchment-300 dark:border-parchment-700/40 shadow-md p-4 sm:p-6 text-ink-900 dark:text-parchment-100 transition-colors ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-600 dark:text-amber-500" />
            <h3 className="text-lg font-serif font-bold text-ink-950 dark:text-parchment-100 tracking-wide">
              Henry Cort Puddling Furnace &amp; Grooved Rolling (GB 1420)
            </h3>
          </div>
          <p className="text-xs font-mono text-ink-500 dark:text-parchment-400 mt-0.5">
            Reverberatory Decarburization &amp; Continuous Grooved Roll Squeeze
          </p>
          <p className="mt-2 max-w-2xl text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
            Editorial process model only. GB 1420&apos;s source edition is withheld; this instrument
            is not a reconstruction of a surviving patent drawing or a measured production record.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-end lg:self-auto">
          <div className="flex items-center gap-1 bg-parchment-200 dark:bg-ink-900/80 p-1 rounded-lg border border-parchment-300 dark:border-ink-700">
            <button
              type="button"
              onClick={() => {
                setActiveTab("furnace");
                soundEngine.playSwitchClick();
              }}
              className={`px-3 py-1 text-xs font-mono rounded-md transition-colors ${
                activeTab === "furnace"
                  ? "bg-amber-600 text-white font-bold"
                  : "text-ink-600 dark:text-parchment-400 hover:text-ink-900 dark:hover:text-parchment-200"
              }`}
            >
              Furnace
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("mill");
                soundEngine.playSwitchClick();
              }}
              className={`px-3 py-1 text-xs font-mono rounded-md transition-colors ${
                activeTab === "mill"
                  ? "bg-amber-600 text-white font-bold"
                  : "text-ink-600 dark:text-parchment-400 hover:text-ink-900 dark:hover:text-parchment-200"
              }`}
            >
              Rolling Mill
            </button>
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
              setActiveTab("furnace");
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

      {/* Main Interactive Diagram View */}
      <div className="relative w-full aspect-[16/9] min-h-[300px] max-h-[460px] bg-stone-950 rounded-xl overflow-hidden border border-stone-800 flex items-center justify-center p-2 mb-6">
        {activeTab === "furnace" ? (
          /* ========================================================= */
          /* SVG DIAGRAM 1: REVERBERATORY PUDDLING FURNACE CROSS-SECTION*/
          /* ========================================================= */
          <svg
            viewBox="0 0 900 480"
            role="img"
            aria-label={`Cort puddling furnace cross-section: reverberatory furnace at ${furnaceTempC} degrees Celsius refining pig iron from ${initialCarbonPct} percent carbon with the rabble stirring at ${rabbleRpm} rpm`}
            className="w-full h-full select-none"
          >
            <defs>
              <linearGradient id="fireGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#7f1d1d" />
                <stop offset="40%" stopColor="#ea580c" />
                <stop offset="80%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#fef08a" />
              </linearGradient>
              <linearGradient id="moltenIronGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ea580c" />
                <stop offset="50%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
              <linearGradient id="roofGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#442a18" />
                <stop offset="100%" stopColor="#ea580c" stopOpacity="0.4" />
              </linearGradient>
              <pattern id="hearthBrick" width="20" height="10" patternUnits="userSpaceOnUse">
                <rect width="20" height="10" fill="#292017" stroke="#1c160e" strokeWidth="0.8" />
              </pattern>
            </defs>

            {/* Masonry Background & Stack */}
            <rect x="60" y="380" width="780" height="60" fill="url(#hearthBrick)" />
            {/* Chimney Stack */}
            <path d="M 680 80 L 760 80 L 780 380 L 660 380 Z" fill="url(#hearthBrick)" />
            <rect x="670" y="120" width="80" height="8" fill="#1c1917" />
            <text
              x="710"
              y="70"
              font-family="monospace"
              font-size="11"
              fill="#a8a29e"
              textAnchor="middle"
            >
              Chimney Stack (Draft)
            </text>

            {/* Firebox & Grate (A) */}
            <rect
              x="80"
              y="240"
              width="140"
              height="140"
              fill="#1c1917"
              stroke="#44382c"
              strokeWidth="2"
            />
            {/* Grate bars */}
            <line
              x1="85"
              y1="340"
              x2="215"
              y2="340"
              stroke="#78716c"
              strokeWidth="4"
              strokeDasharray="8,6"
            />
            {/* Flames */}
            <path
              d="M 90 338 Q 110 260 130 338 Q 150 240 170 338 Q 190 270 210 338 Z"
              fill="url(#fireGrad)"
              className="animate-pulse"
            />
            <text
              x="150"
              y="365"
              font-family="sans-serif"
              font-size="11"
              font-weight="bold"
              fill="#fef08a"
              textAnchor="middle"
            >
              Coal Grate (A)
            </text>

            {/* Fire Bridge Wall (B) */}
            <rect
              x="220"
              y="220"
              width="40"
              height="160"
              fill="url(#hearthBrick)"
              stroke="#1c160e"
              strokeWidth="1.5"
            />
            <text
              x="240"
              y="210"
              font-family="monospace"
              font-size="10"
              fill="#d6d3d1"
              textAnchor="middle"
            >
              Bridge (B)
            </text>

            {/* Arched Reverberatory Roof (D) */}
            <path
              d="M 80 180 Q 420 90 680 180 L 680 220 Q 420 130 80 220 Z"
              fill="url(#roofGlow)"
              stroke="#573a21"
              strokeWidth="2.5"
            />
            <text
              x="420"
              y="125"
              font-family="sans-serif"
              font-size="12"
              font-weight="bold"
              fill="#fed7aa"
              textAnchor="middle"
            >
              Reverberatory Arched Roof (D) — Radiates Heat &amp; Deflects Clean Flame
            </text>

            {/* Concave Hearth Basin (C) */}
            <path
              d="M 260 270 Q 460 350 660 270 L 660 380 L 260 380 Z"
              fill="#1e1812"
              stroke="#3a2e22"
              strokeWidth="2"
            />
            {/* Molten Metal Bath */}
            <path
              d="M 270 275 Q 460 340 650 275 Q 460 315 270 275 Z"
              fill={sim.isPastyNatureState ? "#ca8a04" : "url(#moltenIronGrad)"}
              stroke="#b45309"
              strokeWidth="2"
            />

            {/* Puddle Sponge Ball (Coming to Nature) */}
            <ellipse
              cx="460"
              cy="295"
              rx={sim.isPastyNatureState ? "45" : "25"}
              ry={sim.isPastyNatureState ? "24" : "12"}
              fill={sim.isPastyNatureState ? "#f59e0b" : "#ea580c"}
              stroke="#78350f"
              strokeWidth="2.5"
            />
            <text
              x="460"
              y="335"
              font-family="monospace"
              font-size="11"
              font-weight="bold"
              fill="#fef3c7"
              textAnchor="middle"
            >
              {sim.isPastyNatureState ? 'Puddle Ball ("Nature")' : "Molten Iron Bath"}
            </text>

            {/* Rabble Rod (G) */}
            <g transform="rotate(-18 460 295)">
              <line
                x1="280"
                y1="210"
                x2="470"
                y2="295"
                stroke="#a8a29e"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M 465 285 L 475 305"
                stroke="#78716c"
                strokeWidth="7"
                strokeLinecap="round"
              />
            </g>
            <circle cx="330" cy="225" r="5" fill="#f59e0b" />
            <text
              x="330"
              y="210"
              font-family="monospace"
              font-size="10"
              fill="#fde68a"
              textAnchor="middle"
            >
              Rabble (G)
            </text>

            {/* Deflected Flame Flow Stream */}
            <path
              d="M 180 230 Q 300 170 460 190 Q 580 200 680 180"
              fill="none"
              stroke="#f97316"
              strokeWidth="3.5"
              strokeDasharray="8,5"
              opacity="0.8"
            />
            {/* Decarburization Gas Bubbles */}
            <circle cx="410" cy="265" r="4" fill="#fef08a" opacity="0.8" />
            <circle cx="440" cy="255" r="5" fill="#fef08a" opacity="0.8" />
            <circle cx="490" cy="260" r="3.5" fill="#fef08a" opacity="0.8" />
            <text x="490" y="245" font-family="sans-serif" font-size="10" fill="#fde047">
              CO (g) ↑
            </text>
          </svg>
        ) : (
          /* ========================================================= */
          /* SVG DIAGRAM 2: GROOVED ROLLING MILL FRONT ELEVATION        */
          /* ========================================================= */
          <svg
            viewBox="0 0 900 480"
            role="img"
            aria-label={`Cort rolling mill elevation: grooved rolls reducing the puddled iron billet over ${rollerPasses} passes`}
            className="w-full h-full select-none"
          >
            <defs>
              <linearGradient id="rollGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#44403c" />
                <stop offset="50%" stopColor="#78716c" />
                <stop offset="100%" stopColor="#292524" />
              </linearGradient>
              <linearGradient id="billetGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>

            {/* Heavy Cast-Iron Mill Stands (H) */}
            <rect
              x="140"
              y="60"
              width="80"
              height="340"
              rx="6"
              fill="#1c1917"
              stroke="#44403c"
              strokeWidth="2.5"
            />
            <rect
              x="680"
              y="60"
              width="80"
              height="340"
              rx="6"
              fill="#1c1917"
              stroke="#44403c"
              strokeWidth="2.5"
            />
            <rect
              x="100"
              y="380"
              width="700"
              height="50"
              rx="4"
              fill="#292524"
              stroke="#44403c"
              strokeWidth="2"
            />

            {/* Screw-Down Adjustment Spindles (K) */}
            <rect
              x="165"
              y="20"
              width="30"
              height="50"
              fill="#78716c"
              stroke="#1c1917"
              strokeWidth="1.5"
            />
            <circle cx="180" cy="15" r="14" fill="#a8a29e" stroke="#1c1917" strokeWidth="2" />
            <rect
              x="705"
              y="20"
              width="30"
              height="50"
              fill="#78716c"
              stroke="#1c1917"
              strokeWidth="1.5"
            />
            <circle cx="720" cy="15" r="14" fill="#a8a29e" stroke="#1c1917" strokeWidth="2" />

            {/* Top Grooved Roller (J1) */}
            <g transform="translate(220, 130)">
              <rect
                x="0"
                y="0"
                width="460"
                height="85"
                rx="8"
                fill="url(#rollGrad)"
                stroke="#1c1917"
                strokeWidth="2"
              />
              {/* Grooves */}
              <rect
                x="30"
                y="10"
                width="60"
                height="65"
                fill="#1c1917"
                stroke="#292524"
                strokeWidth="1.5"
              />
              <polygon
                points="135,10 175,42 135,75 95,42"
                fill="#1c1917"
                stroke="#292524"
                strokeWidth="1.5"
              />
              <rect
                x="195"
                y="22"
                width="70"
                height="40"
                fill="#1c1917"
                stroke="#292524"
                strokeWidth="1.5"
              />
              <circle cx="310" cy="42" r="22" fill="#1c1917" stroke="#292524" strokeWidth="1.5" />
              <circle cx="370" cy="42" r="14" fill="#1c1917" stroke="#292524" strokeWidth="1.5" />
              <circle cx="415" cy="42" r="8" fill="#1c1917" stroke="#292524" strokeWidth="1.5" />
            </g>

            {/* Bottom Grooved Roller (J2) */}
            <g transform="translate(220, 235)">
              <rect
                x="0"
                y="0"
                width="460"
                height="85"
                rx="8"
                fill="url(#rollGrad)"
                stroke="#1c1917"
                strokeWidth="2"
              />
              {/* Matching Grooves */}
              <rect
                x="30"
                y="10"
                width="60"
                height="65"
                fill="#1c1917"
                stroke="#292524"
                strokeWidth="1.5"
              />
              <polygon
                points="135,10 175,42 135,75 95,42"
                fill="#1c1917"
                stroke="#292524"
                strokeWidth="1.5"
              />
              <rect
                x="195"
                y="22"
                width="70"
                height="40"
                fill="#1c1917"
                stroke="#292524"
                strokeWidth="1.5"
              />
              <circle cx="310" cy="42" r="22" fill="#1c1917" stroke="#292524" strokeWidth="1.5" />
              <circle cx="370" cy="42" r="14" fill="#1c1917" stroke="#292524" strokeWidth="1.5" />
              <circle cx="415" cy="42" r="8" fill="#1c1917" stroke="#292524" strokeWidth="1.5" />
            </g>

            {/* Red-Hot Wrought Iron Billet inside Groove 1 */}
            <rect
              x="235"
              y="200"
              width="90"
              height="48"
              rx="4"
              fill="url(#billetGrad)"
              stroke="#b91c1c"
              strokeWidth="2"
            />
            {/* Slag droplets spraying downward */}
            <circle cx="270" cy="275" r="4" fill="#451a03" />
            <circle cx="290" cy="290" r="5" fill="#451a03" />
            <circle cx="310" cy="270" r="3.5" fill="#451a03" />
            <text x="320" y="315" font-family="monospace" font-size="10" fill="#fdba74">
              Liquid Slag Squeezed Out ↓
            </text>

            {/* Rotation Direction Arrows */}
            <path
              d="M 450 115 A 25 25 0 0 1 480 140"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="3"
              strokeDasharray="4,3"
            />
            <path
              d="M 450 335 A 25 25 0 0 0 480 310"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="3"
              strokeDasharray="4,3"
            />

            {/* Annotations */}
            <text
              x="450"
              y="80"
              font-family="sans-serif"
              font-size="12"
              font-weight="bold"
              fill="#e7e5e4"
              textAnchor="middle"
            >
              Grooved Rolls (J) — Graduated Passes (Roughing Box → Diamond → Flat → Round)
            </text>
            <text
              x="450"
              y="450"
              font-family="monospace"
              font-size="11"
              fill="#a8a29e"
              textAnchor="middle"
            >
              Modelled roll-bite pressure (P = {sim.hydrostaticSqueezePressureMpa.toFixed(0)} MPa) •
              Modelled reduction = {sim.totalAreaReductionRatio.toFixed(1)}×
            </text>
          </svg>
        )}
      </div>

      {/* Live SI Telemetry HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-6">
        <div className="bg-ink-900/60 p-2.5 rounded-xl border border-ink-800">
          <div className="text-[10px] font-mono text-parchment-400 uppercase tracking-wider">
            Residual Carbon
          </div>
          <div className="text-sm font-mono font-bold text-amber-400">
            {sim.residualCarbonPercent.toFixed(2)}% C
          </div>
          <div className="text-[10px] font-mono text-parchment-500">
            {sim.isPastyNatureState ? "Wrought Iron" : "Liquid Pig Iron"}
          </div>
        </div>

        <div className="bg-ink-900/60 p-2.5 rounded-xl border border-ink-800">
          <div className="text-[10px] font-mono text-parchment-400 uppercase tracking-wider">
            Melting Point (Solidus)
          </div>
          <div className="text-sm font-mono font-bold text-rose-400">
            {sim.ironMeltingPointCelsius} °C
          </div>
          <div className="text-[10px] font-mono text-parchment-500">
            +{sim.ironMeltingPointCelsius - 1147} °C rise
          </div>
        </div>

        <div className="bg-ink-900/60 p-2.5 rounded-xl border border-ink-800">
          <div className="text-[10px] font-mono text-parchment-400 uppercase tracking-wider">
            Charge State
          </div>
          <div
            className={`text-sm font-mono font-bold ${
              sim.isPastyNatureState ? "text-emerald-400" : "text-cyan-400"
            }`}
          >
            {sim.isPastyNatureState ? "Coming to Nature" : "Molten Liquid"}
          </div>
          <div className="text-[10px] font-mono text-parchment-500">
            {sim.carbonRemovedPercent.toFixed(2)}% C burnt
          </div>
        </div>

        <div className="bg-ink-900/60 p-2.5 rounded-xl border border-ink-800">
          <div className="text-[10px] font-mono text-parchment-400 uppercase tracking-wider">
            Residual Slag
          </div>
          <div className="text-sm font-mono font-bold text-indigo-400">
            {sim.residualSlagVolumeFractionPercent.toFixed(1)}%
          </div>
          <div className="text-[10px] font-mono text-parchment-500">
            Expelled {sim.slagExpelledKg.toFixed(1)} kg
          </div>
        </div>

        <div className="bg-ink-900/60 p-2.5 rounded-xl border border-ink-800">
          <div className="text-[10px] font-mono text-parchment-400 uppercase tracking-wider">
            Tensile Strength
          </div>
          <div className="text-sm font-mono font-bold text-emerald-400">
            {sim.tensileStrengthMpa.toFixed(0)} MPa
          </div>
          <div className="text-[10px] font-mono text-parchment-500">
            {sim.ductilityElongationPercent.toFixed(0)}% elongation
          </div>
        </div>

        <div className="bg-ink-900/60 p-2.5 rounded-xl border border-ink-800">
          <div className="text-[10px] font-mono text-parchment-400 uppercase tracking-wider">
            Rolling Speedup
          </div>
          <div className="text-sm font-mono font-bold text-purple-400">
            {sim.productionSpeedupVsHammer}×
          </div>
          <div className="text-[10px] font-mono text-parchment-500">
            {sim.hourlyIronOutputKg} kg/h output
          </div>
        </div>
      </div>

      {/* Interactive Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2 border-t border-ink-800">
        <div>
          <label
            htmlFor="cort-furnace-temp"
            className="block text-xs font-mono text-parchment-300 mb-1"
          >
            Furnace Temperature: {furnaceTempC} °C
          </label>
          <input
            id="cort-furnace-temp"
            type="range"
            min={1150}
            max={1550}
            step={25}
            value={furnaceTempC}
            onChange={(e) => updateParam("furnaceTemperatureCelsius", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-ink-800 dark:[&::-webkit-slider-runnable-track]:bg-ink-800 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-ink-800 dark:[&::-moz-range-track]:bg-ink-800 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </div>

        <div>
          <label
            htmlFor="cort-initial-carbon"
            className="block text-xs font-mono text-parchment-300 mb-1"
          >
            Pig Iron Carbon: {initialCarbonPct.toFixed(1)}% C
          </label>
          <input
            id="cort-initial-carbon"
            type="range"
            min={2.8}
            max={4.5}
            step={0.1}
            value={initialCarbonPct}
            onChange={(e) => updateParam("initialCarbonPercent", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-ink-800 dark:[&::-webkit-slider-runnable-track]:bg-ink-800 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-ink-800 dark:[&::-moz-range-track]:bg-ink-800 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </div>

        <div>
          <label
            htmlFor="cort-rabble-rpm"
            className="block text-xs font-mono text-parchment-300 mb-1"
          >
            Rabble Stirring: {rabbleRpm} RPM
          </label>
          <input
            id="cort-rabble-rpm"
            type="range"
            min={0}
            max={25}
            step={5}
            value={rabbleRpm}
            onChange={(e) => updateParam("rabbleStirringRpm", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-ink-800 dark:[&::-webkit-slider-runnable-track]:bg-ink-800 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-ink-800 dark:[&::-moz-range-track]:bg-ink-800 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </div>

        <div>
          <label
            htmlFor="cort-puddling-time"
            className="block text-xs font-mono text-parchment-300 mb-1"
          >
            Puddling Duration: {puddlingTimeMin} min
          </label>
          <input
            id="cort-puddling-time"
            type="range"
            min={30}
            max={150}
            step={10}
            value={puddlingTimeMin}
            onChange={(e) => updateParam("puddlingDurationMinutes", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-ink-800 dark:[&::-webkit-slider-runnable-track]:bg-ink-800 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-ink-800 dark:[&::-moz-range-track]:bg-ink-800 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </div>

        <div>
          <label
            htmlFor="cort-roller-passes"
            className="block text-xs font-mono text-parchment-300 mb-1"
          >
            Grooved Roll Passes: {rollerPasses} passes
          </label>
          <input
            id="cort-roller-passes"
            type="range"
            min={1}
            max={8}
            step={1}
            value={rollerPasses}
            onChange={(e) => updateParam("rollerPassCount", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-ink-800 dark:[&::-webkit-slider-runnable-track]:bg-ink-800 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-ink-800 dark:[&::-moz-range-track]:bg-ink-800 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </div>
      </div>
    </div>
  );
}
