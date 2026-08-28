"use client";

import { FlaskConical, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useMemo } from "react";
import { stepBaekelandBakelite } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";

interface BaekelandBakeliteSimProps {
  className?: string;
}

export function BaekelandBakeliteSim({ className = "" }: BaekelandBakeliteSimProps) {
  const {
    params: controls,
    updateParam: setControl,
    resetParams,
  } = usePatentPhysics("us-942699-baekeland-bakelite");
  const { isAudioMuted, toggleSound } = usePatentAudio();

  const curingTempC = (controls.curingTempC as number) ?? 130;
  const autoclavePressurePsi = (controls.autoclavePressurePsi as number) ?? 75;
  const catalystPct = (controls.catalystPct as number) ?? 1.5;
  const curingTimeMin = (controls.curingTimeMin as number) ?? 60;
  const fillerPct = (controls.fillerPct as number) ?? 45;

  const sim = useMemo(() => {
    return stepBaekelandBakelite(
      curingTempC,
      autoclavePressurePsi,
      catalystPct,
      curingTimeMin,
      fillerPct,
    );
  }, [curingTempC, autoclavePressurePsi, catalystPct, curingTimeMin, fillerPct]);

  // Color transitions based on curing stage
  const resinColor = useMemo(() => {
    if (sim.resinStage.startsWith("C-stage")) {
      return sim.isFoamingSuppressed ? "#854d0e" : "#ca8a04"; // Rich deep amber/brown Bakelite vs foamy mustard
    }
    if (sim.resinStage.startsWith("B-stage")) {
      return "#d97706"; // Amber resitol
    }
    return "#f59e0b"; // Golden liquid resole
  }, [sim.resinStage, sim.isFoamingSuppressed]);

  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl border border-parchment-300 dark:border-ink-700 bg-parchment-50 dark:bg-ink-900/90 p-4 sm:p-6 shadow-md text-ink-900 dark:text-parchment-100 transition-colors ${className}`}
    >
      {/* Header & Principle Banner */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-parchment-200 dark:border-ink-700 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-xl font-bold font-serif text-ink-950 dark:text-parchment-100">
              Leo Baekeland Bakelite Phenol-Formaldehyde Synthesis (US 942,699)
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-1">
            Editorial process model of the patent's reaction, water separation, forming, and
            heat-and-pressure hardening. Resin-stage names and numerical material outputs are modern
            interpretations, not printed measurements in US 942,699.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-end lg:self-auto">
          <div
            className={`px-3 py-1 text-xs font-mono font-semibold rounded-lg border ${
              sim.resinStage.startsWith("C-stage")
                ? "bg-emerald-100 dark:bg-emerald-500/20 border-emerald-400 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-300"
                : sim.resinStage.startsWith("B-stage")
                  ? "bg-amber-100 dark:bg-amber-500/20 border-amber-400 dark:border-amber-500/40 text-amber-900 dark:text-amber-300"
                  : "bg-indigo-100 dark:bg-indigo-500/20 border-indigo-400 dark:border-indigo-500/40 text-indigo-900 dark:text-indigo-300"
            }`}
          >
            {sim.resinStage}
          </div>
          <div
            className={`px-3 py-1 text-xs font-mono font-semibold rounded-lg border ${
              sim.isFoamingSuppressed
                ? "bg-emerald-100 dark:bg-emerald-500/20 border-emerald-400 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-300"
                : "bg-rose-100 dark:bg-rose-500/20 border-rose-400 dark:border-rose-500/40 text-rose-900 dark:text-rose-300 animate-pulse"
            }`}
          >
            {sim.isFoamingSuppressed
              ? "Foaming Suppressed (Dense)"
              : "Boiling / Porous (Defective)"}
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

      {/* Main Visual Instrumentation Canvas / SVG */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* SVG editorial model: closed vessel, mold, and modern molecular interpretation. */}
        <div className="lg:col-span-7 bg-stone-950/80 rounded-lg p-4 border border-stone-800 flex flex-col items-center">
          <svg viewBox="0 0 600 360" className="w-full h-auto max-h-[360px] select-none">
            <defs>
              <linearGradient id="autoclaveSteel" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="50%" stopColor="#64748b" />
                <stop offset="100%" stopColor="#334155" />
              </linearGradient>
              <linearGradient id="steamJacket" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ea580c" stopOpacity="0.4" />
              </linearGradient>
              <pattern id="voidPattern" width="12" height="12" patternUnits="userSpaceOnUse">
                <circle cx="6" cy="6" r="3" fill="#ef4444" fillOpacity="0.6" />
              </pattern>
            </defs>

            {/* Background Grid */}
            <rect x="0" y="0" width="600" height="360" fill="#0c0a09" rx="8" />
            <path
              d="M 50,0 L 50,360 M 150,0 L 150,360 M 250,0 L 250,360 M 350,0 L 350,360 M 450,0 L 450,360 M 550,0 L 550,360"
              stroke="#1c1917"
              strokeWidth="1"
            />
            <path
              d="M 0,60 L 600,60 M 0,120 L 600,120 M 0,180 L 600,180 M 0,240 L 600,240 M 0,300 L 600,300"
              stroke="#1c1917"
              strokeWidth="1"
            />

            {/* Autoclave Vessel Shell (Cutaway) */}
            <g transform="translate(40, 40)">
              {/* Outer Steam Jacket */}
              <rect
                x="20"
                y="40"
                width="220"
                height="200"
                rx="20"
                fill="url(#autoclaveSteel)"
                stroke="#94a3b8"
                strokeWidth="2"
              />
              <rect
                x="28"
                y="48"
                width="204"
                height="184"
                rx="14"
                fill="url(#steamJacket)"
                opacity={curingTempC >= 100 ? "0.9" : "0.3"}
              />

              {/* Inner Pressure Chamber */}
              <rect
                x="45"
                y="65"
                width="170"
                height="150"
                rx="8"
                fill="#1e293b"
                stroke="#cbd5e1"
                strokeWidth="2"
              />

              {/* Mold Cavity / Specimen */}
              <rect
                x="65"
                y="110"
                width="130"
                height="85"
                rx="6"
                fill={resinColor}
                stroke="#d97706"
                strokeWidth="2"
                className="transition-colors duration-300"
              />

              {/* Void bubbles if foaming */}
              {!sim.isFoamingSuppressed && (
                <rect
                  x="65"
                  y="110"
                  width="130"
                  height="85"
                  rx="6"
                  fill="url(#voidPattern)"
                  opacity="0.8"
                />
              )}

              {/* Mold Clamping Ram & Piston */}
              <rect
                x="110"
                y="70"
                width="40"
                height="40"
                fill="#475569"
                stroke="#94a3b8"
                strokeWidth="1.5"
              />
              <path d="M 130,20 L 130,70" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />

              {/* Steam Entry & Exhaust Ports */}
              <path d="M 10,90 L 28,90" stroke="#f97316" strokeWidth="4" />
              <text x="5" y="85" fill="#f97316" fontSize="9" fontFamily="monospace">
                STEAM IN
              </text>

              {/* Compressed Air Inlet (Pressure P) */}
              <path d="M 130,0 L 130,20" stroke="#38bdf8" strokeWidth="4" />
              <circle cx="130" cy="-5" r="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
              <line
                x1="130"
                y1="-5"
                x2={130 + Math.cos(((autoclavePressurePsi / 120) * 1.5 - 0.75) * Math.PI) * 10}
                y2={-5 + Math.sin(((autoclavePressurePsi / 120) * 1.5 - 0.75) * Math.PI) * 10}
                stroke="#f43f5e"
                strokeWidth="2"
              />
              <text
                x="130"
                y="-22"
                fill="#38bdf8"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="middle"
                fontWeight="bold"
              >
                {autoclavePressurePsi} psi
              </text>

              <text
                x="130"
                y="155"
                fill="#ffffff"
                fontSize="11"
                fontFamily="sans-serif"
                textAnchor="middle"
                fontWeight="bold"
              >
                {sim.resinStage.startsWith("C-stage") ? "BAKELITE MATRIX" : "PREPOLYMER RESIN"}
              </text>
              <text
                x="130"
                y="172"
                fill="#fef08a"
                fontSize="9"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {fillerPct}% Filler | {sim.voidPorosityPct}% Voids
              </text>
            </g>

            {/* Molecular Crosslink Diagram */}
            <g transform="translate(320, 45)">
              <rect
                x="0"
                y="0"
                width="250"
                height="270"
                rx="8"
                fill="#18181b"
                stroke="#3f3f46"
                strokeWidth="1"
              />
              <text
                x="125"
                y="24"
                fill="#e4e4e7"
                fontSize="12"
                fontFamily="sans-serif"
                textAnchor="middle"
                fontWeight="bold"
              >
                3D Covalent Crosslinking Network
              </text>
              <text
                x="125"
                y="40"
                fill="#a1a1aa"
                fontSize="9"
                fontFamily="monospace"
                textAnchor="middle"
              >
                Phenol Rings (f=3) + Methylene Bridges (-CH₂-)
              </text>

              {/* Phenolic Ring Nodes */}
              {[
                { x: 50, y: 80, label: "Φ-OH" },
                { x: 125, y: 80, label: "Φ-OH" },
                { x: 200, y: 80, label: "Φ-OH" },
                { x: 85, y: 150, label: "Φ-OH" },
                { x: 165, y: 150, label: "Φ-OH" },
                { x: 50, y: 220, label: "Φ-OH" },
                { x: 125, y: 220, label: "Φ-OH" },
                { x: 200, y: 220, label: "Φ-OH" },
              ].map((node, i) => (
                <g key={i}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="16"
                    fill={sim.conversionP >= 0.67 ? "#15803d" : "#4f46e5"}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <text
                    x={node.x}
                    y={node.y + 4}
                    fill="#ffffff"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {node.label}
                  </text>
                </g>
              ))}

              {/* Methylene Bridges (-CH2-) */}
              {[
                { x1: 66, y1: 80, x2: 109, y2: 80, active: sim.conversionP >= 0.3 },
                { x1: 141, y1: 80, x2: 184, y2: 80, active: sim.conversionP >= 0.4 },
                { x1: 60, y1: 94, x2: 75, y2: 136, active: sim.conversionP >= 0.5 },
                { x1: 115, y1: 94, x2: 95, y2: 136, active: sim.conversionP >= 0.6 },
                { x1: 135, y1: 94, x2: 155, y2: 136, active: sim.conversionP >= 0.67 },
                { x1: 190, y1: 94, x2: 175, y2: 136, active: sim.conversionP >= 0.72 },
                { x1: 101, y1: 150, x2: 149, y2: 150, active: sim.conversionP >= 0.8 },
                { x1: 75, y1: 164, x2: 60, y2: 206, active: sim.conversionP >= 0.85 },
                { x1: 95, y1: 164, x2: 115, y2: 206, active: sim.conversionP >= 0.88 },
                { x1: 155, y1: 164, x2: 135, y2: 206, active: sim.conversionP >= 0.9 },
                { x1: 175, y1: 164, x2: 190, y2: 206, active: sim.conversionP >= 0.93 },
                { x1: 66, y1: 220, x2: 109, y2: 220, active: sim.conversionP >= 0.95 },
                { x1: 141, y1: 220, x2: 184, y2: 220, active: sim.conversionP >= 0.97 },
              ].map((link, idx) => (
                <line
                  key={idx}
                  x1={link.x1}
                  y1={link.y1}
                  x2={link.x2}
                  y2={link.y2}
                  stroke={link.active ? "#fbbf24" : "#3f3f46"}
                  strokeWidth={link.active ? "3" : "1"}
                  strokeDasharray={link.active ? "none" : "2,2"}
                  className="transition-all duration-300"
                />
              ))}

              <text
                x="125"
                y="255"
                fill="#fcd34d"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="middle"
                fontWeight="bold"
              >
                Model crosslink index: {sim.crosslinkDensity} (illustrative)
              </text>
            </g>
          </svg>
        </div>

        {/* Telemetry Metrics Readout */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3">
          <div className="bg-stone-950/60 p-3 rounded-lg border border-stone-800">
            <span className="text-xs text-stone-400 font-mono">Model Conversion (p)</span>
            <div className="text-xl font-bold text-amber-400 font-mono mt-0.5">
              {(sim.conversionP * 100).toFixed(1)}%
            </div>
            <div className="text-[10px] text-stone-500 mt-1">
              Teaching threshold, not a grant value
            </div>
          </div>

          <div className="bg-stone-950/60 p-3 rounded-lg border border-stone-800">
            <span className="text-xs text-stone-400 font-mono">Tensile (model)</span>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">
              {sim.tensileStrengthMpa} MPa
            </div>
            <div className="text-[10px] text-stone-500 mt-1">Illustrative filler response</div>
          </div>

          <div className="bg-stone-950/60 p-3 rounded-lg border border-stone-800">
            <span className="text-xs text-stone-400 font-mono">Dielectric (model)</span>
            <div className="text-xl font-bold text-cyan-400 font-mono mt-0.5">
              {sim.dielectricBreakdownKvPerMm} kV/mm
            </div>
            <div className="text-[10px] text-stone-500 mt-1">Not measured in US 942,699</div>
          </div>

          <div className="bg-stone-950/60 p-3 rounded-lg border border-stone-800">
            <span className="text-xs text-stone-400 font-mono">Vapor P (model)</span>
            <div className="text-xl font-bold text-rose-400 font-mono mt-0.5">
              {sim.waterVaporPressurePsi} psi
            </div>
            <div className="text-[10px] text-stone-500 mt-1">Illustrative saturation estimate</div>
          </div>

          <div className="bg-stone-950/60 p-3 rounded-lg border border-stone-800 col-span-2">
            <div className="flex justify-between items-center text-xs text-stone-400 font-mono">
              <span>Porosity (model): {sim.voidPorosityPct}%</span>
              <span>HDT (model): {sim.heatDeflectionTempC} °C</span>
            </div>
            <div className="w-full bg-stone-800 rounded-full h-2 mt-1.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  sim.voidPorosityPct < 5 ? "bg-emerald-500" : "bg-rose-500"
                }`}
                style={{ width: `${Math.min(100, sim.voidPorosityPct * 2)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Physics Sliders & Parameter Controllers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-stone-800">
        <div className="flex flex-col gap-1.5 bg-stone-950/40 p-3 rounded-lg border border-stone-800/80">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-stone-300">Curing Temp (°C)</span>
            <span className="text-amber-400 font-bold">{curingTempC} °C</span>
          </div>
          <input
            type="range"
            min="90"
            max="180"
            step="5"
            value={curingTempC}
            onChange={(e) => setControl("curingTempC", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
          <span className="text-[10px] text-stone-500">Nominal 110–140 °C range</span>
        </div>

        <div className="flex flex-col gap-1.5 bg-stone-950/40 p-3 rounded-lg border border-stone-800/80">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-stone-300">Closed-Vessel Pressure (psi)</span>
            <span className="text-sky-400 font-bold">{autoclavePressurePsi} psi</span>
          </div>
          <input
            type="range"
            min="0"
            max="120"
            step="5"
            value={autoclavePressurePsi}
            onChange={(e) => setControl("autoclavePressurePsi", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sky-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-sky-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
          <span className="text-[10px] text-stone-500">
            Illustrative model control; no source pressure range
          </span>
        </div>

        <div className="flex flex-col gap-1.5 bg-stone-950/40 p-3 rounded-lg border border-stone-800/80">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-stone-300">Cure Duration (min)</span>
            <span className="text-emerald-400 font-bold">{curingTimeMin} min</span>
          </div>
          <input
            type="range"
            min="10"
            max="180"
            step="5"
            value={curingTimeMin}
            onChange={(e) => setControl("curingTimeMin", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
          <span className="text-[10px] text-stone-500">Sustained baking duration</span>
        </div>

        <div className="flex flex-col gap-1.5 bg-stone-950/40 p-3 rounded-lg border border-stone-800/80">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-stone-300">Condensing Catalyst (%)</span>
            <span className="text-purple-400 font-bold">{catalystPct.toFixed(1)} %</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="5.0"
            step="0.1"
            value={catalystPct}
            onChange={(e) => setControl("catalystPct", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-purple-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
          <span className="text-[10px] text-stone-500">Acid/base reaction accelerator</span>
        </div>

        <div className="flex flex-col gap-1.5 bg-stone-950/40 p-3 rounded-lg border border-stone-800/80 sm:col-span-2 lg:col-span-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-stone-300">Filler Content (Listed Material) (%)</span>
            <span className="text-yellow-400 font-bold">{fillerPct} %</span>
          </div>
          <input
            type="range"
            min="0"
            max="60"
            step="5"
            value={fillerPct}
            onChange={(e) => setControl("fillerPct", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-yellow-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-yellow-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
          <span className="text-[10px] text-stone-500">
            Source lists fillers; performance is an illustrative model output
          </span>
        </div>
      </div>
      <p className="pt-3 text-[11px] leading-relaxed text-stone-500">
        Source boundary: US 942,699 gives qualitative pressure containment and a practical 110–140
        °C molding range. Conversion, porosity, tensile, dielectric, and pressure values shown here
        are modern illustrative model outputs, not historical measurements.
      </p>
    </div>
  );
}
