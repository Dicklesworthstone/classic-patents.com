"use client";

import { Lightbulb, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useMemo } from "react";
import { stepEdisonIndicator } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";

export function EdisonIndicatorSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-307031-edison-indicator");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const mainsVoltage = params.mainsVoltageV ?? 110;
  const biasNum = params.plateBiasPolarity ?? 1;
  const plateBias: "positive" | "negative" | "neutral" =
    biasNum > 0 ? "positive" : biasNum < 0 ? "negative" : "neutral";
  const nullRefVoltage = params.galvanometerTorsionNullV ?? 110;

  const sim = useMemo(() => {
    return stepEdisonIndicator({
      mainsVoltageV: mainsVoltage,
      plateBiasPolarity: biasNum,
      galvanometerTorsionNullV: nullRefVoltage,
    });
  }, [mainsVoltage, biasNum, nullRefVoltage]);

  // Filament glow color mapped from temperature (approx 1900K to 2300K)
  const glowIntensity = Math.max(0.2, Math.min(1.0, (sim.filamentTemperatureK - 1800) / 500));
  const filamentColor = `rgb(255, ${Math.round(140 + glowIntensity * 100)}, ${Math.round(40 + glowIntensity * 180)})`;
  const haloRadius = 16 + glowIntensity * 24;

  // Galvo needle angle in degrees (center 0, +/- 25)
  const needleRotation = sim.galvoDeflectionDeg;

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6 bg-parchment-50 dark:bg-ink-950 border border-parchment-300 dark:border-ink-800 rounded-2xl shadow-md text-ink-900 dark:text-parchment-100 font-sans">
      {/* Header / Mode Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="font-serif text-lg sm:text-xl font-bold text-ink-950 dark:text-parchment-50">
              Thomas Edison Electrical Indicator & Thermionic Diode (US 307,031)
            </h3>
          </div>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400 mt-0.5">
            Edison effect thermionic emission, plate bias polarity, and torsion galvanometer voltage
            regulation.
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
              sim.regulatorState === "nominal"
                ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                : sim.regulatorState === "high_voltage_trip"
                  ? "bg-red-100 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800 animate-pulse"
                  : "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 animate-pulse"
            }`}
          >
            {sim.regulatorState === "nominal"
              ? "● Equilibrium"
              : sim.regulatorState === "high_voltage_trip"
                ? "▲ Over-Voltage"
                : "▼ Under-Voltage"}
          </span>
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

      {/* Main SVG Schematic & Visual Simulation */}
      <div className="relative w-full aspect-[16/9] min-h-[340px] max-h-[500px] bg-parchment-50 dark:bg-ink-950 border border-parchment-300 dark:border-ink-800 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
        <svg
          viewBox="0 0 800 450"
          className="w-full h-full select-none"
          role="img"
          aria-label="Edison Effect Electrical Indicator and Galvanometer Circuit Simulation"
        >
          <defs>
            {/* Radial glow filter for incandescent filament */}
            <radialGradient id="filamentGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffb833" stopOpacity={glowIntensity * 0.9} />
              <stop offset="60%" stopColor="#ff5500" stopOpacity={glowIntensity * 0.4} />
              <stop offset="100%" stopColor="#ff2200" stopOpacity="0" />
            </radialGradient>
            {/* Glass bulb gradient */}
            <radialGradient id="bulbGlass" cx="40%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.35" />
              <stop offset="85%" stopColor="#38bdf8" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.25" />
            </radialGradient>
            {/* Electron particle marker */}
            <filter id="electronGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
            </filter>
          </defs>

          {/* Background Grid Lines */}
          <g stroke="currentColor" strokeOpacity="0.05" strokeWidth="1">
            {Array.from({ length: 16 }).map((_, i) => (
              <line key={`gx-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="450" />
            ))}
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`gy-${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} />
            ))}
          </g>

          {/* DISTRIBUTION MAINS (1 & 2) */}
          <g>
            {/* Positive Main (+) (1) */}
            <path d="M 40 40 L 760 40" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
            <text
              x="50"
              y="32"
              className="text-[11px] font-mono font-bold fill-red-600 dark:fill-red-400"
            >
              Main Conductor 1
            </text>

            {/* Negative Main (-) (2) */}
            <path d="M 40 410 L 760 410" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
            <text
              x="50"
              y="430"
              className="text-[11px] font-mono font-bold fill-blue-600 dark:fill-blue-400"
            >
              Main Conductor 2
            </text>
          </g>

          {/* PARALLEL LOAD LAMPS (a, a) */}
          <g opacity="0.6">
            {/* Lamp 1 */}
            <line
              x1="120"
              y1="40"
              x2="120"
              y2="410"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <circle
              cx="120"
              cy="225"
              r="22"
              fill="#fbbf24"
              fillOpacity={glowIntensity * 0.5}
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path d="M 114 235 Q 120 205 126 235" fill="none" stroke="#d97706" strokeWidth="2" />
            <text x="110" y="260" className="text-[9px] font-mono fill-current text-ink-500">
              lamp a
            </text>

            {/* Lamp 2 */}
            <line
              x1="680"
              y1="40"
              x2="680"
              y2="410"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <circle
              cx="680"
              cy="225"
              r="22"
              fill="#fbbf24"
              fillOpacity={glowIntensity * 0.5}
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path d="M 674 235 Q 680 205 686 235" fill="none" stroke="#d97706" strokeWidth="2" />
            <text x="670" y="260" className="text-[9px] font-mono fill-current text-ink-500">
              lamp a
            </text>
          </g>

          {/* INDICATOR LAMP (A) ENCLOSURE & VACUUM GLOBE */}
          <g transform="translate(250, 220)">
            {/* Globe Glow Halo */}
            <circle
              cx="0"
              cy="0"
              r={haloRadius * 2.2}
              fill="url(#filamentGlow)"
              pointerEvents="none"
            />

            {/* Glass Envelope Bulb */}
            <circle
              cx="0"
              cy="-10"
              r="70"
              fill="url(#bulbGlass)"
              stroke="#0284c7"
              strokeWidth="2"
            />
            <rect
              x="-24"
              y="55"
              width="48"
              height="30"
              rx="4"
              fill="#64748b"
              stroke="#334155"
              strokeWidth="1.5"
            />
            <text
              x="-65"
              y="-60"
              className="text-[12px] font-serif font-bold fill-sky-700 dark:fill-sky-300"
            >
              Lamp A (Vacuous Space)
            </text>

            {/* Carbon Filament Cathode Loop (3 & 4) */}
            <path
              d="M -22 55 L -16 -10 Q 0 -55 16 -10 L 22 55"
              fill="none"
              stroke={filamentColor}
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Independent Platinum Collector Plate (b) */}
            <rect
              x="-6"
              y="-35"
              width="12"
              height="30"
              rx="1.5"
              fill={
                plateBias === "positive"
                  ? "#38bdf8"
                  : plateBias === "negative"
                    ? "#f87171"
                    : "#94a3b8"
              }
              stroke="#0f172a"
              strokeWidth="1.5"
            />
            {/* Sealed Plate Lead Wire (5) */}
            <line x1="0" y1="-5" x2="0" y2="70" stroke="#0284c7" strokeWidth="2" />

            <text x="-12" y="-40" className="text-[10px] font-mono font-bold fill-current">
              b
            </text>

            {/* Thermionic Electron Cloud Particles */}
            {plateBias === "positive" && (
              <g className="animate-pulse" filter="url(#electronGlow)">
                {[-14, -8, 8, 14].map((xOffset, i) => (
                  <circle
                    key={`e-${i}`}
                    cx={xOffset * 0.6}
                    cy={-25 + (i % 3) * 10}
                    r="2.2"
                    fill="#38bdf8"
                  />
                ))}
              </g>
            )}

            {/* Leads connecting out of base */}
            {/* Positive leg (3) */}
            <path
              d="M -22 85 L -22 190 L -210 190"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2.5"
            />
            {/* Negative leg (4) */}
            <path d="M 22 85 L 22 190 L 510 190" fill="none" stroke="#3b82f6" strokeWidth="2.5" />

            {/* Platinum Shunt Lead 5 to Binding Post c */}
            <path
              d="M 0 85 L 0 130 L 200 130"
              fill="none"
              stroke="#0284c7"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
          </g>

          {/* TORSION GALVANOMETER (B) */}
          <g transform="translate(540, 220)">
            {/* Frame B */}
            <rect
              x="-80"
              y="-110"
              width="160"
              height="220"
              rx="12"
              fill="#1e293b"
              stroke="#475569"
              strokeWidth="2.5"
            />
            <text x="-70" y="-88" className="text-[11px] font-serif font-bold fill-amber-400">
              Galvanometer B
            </text>

            {/* Circular Meter Dial */}
            <circle cx="0" cy="-10" r="58" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />

            {/* Calibrated Scale (n) */}
            <path d="M -40 -30 Q 0 -50 40 -30" fill="none" stroke="#64748b" strokeWidth="2" />
            {[-20, -10, 0, 10, 20].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const x1 = Math.sin(rad) * 44;
              const y1 = -Math.cos(rad) * 44 - 10;
              const x2 = Math.sin(rad) * 52;
              const y2 = -Math.cos(rad) * 52 - 10;
              return (
                <line
                  key={`tick-${deg}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#334155"
                  strokeWidth="1.5"
                />
              );
            })}
            <text x="-3" y="-53" className="text-[9px] font-mono font-bold fill-slate-700">
              0
            </text>
            <text x="-48" y="-22" className="text-[8px] font-mono fill-blue-600">
              -V
            </text>
            <text x="35" y="-22" className="text-[8px] font-mono fill-red-600">
              +V
            </text>

            {/* Deflecting Galvanometer Needle (e) & Pointer (m) */}
            <g transform={`rotate(${needleRotation}, 0, -10)`}>
              <line
                x1="0"
                y1="25"
                x2="0"
                y2="-48"
                stroke="#dc2626"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="0" cy="-10" r="5" fill="#b91c1c" stroke="#fff" strokeWidth="1.5" />
              {/* Articulated Relay Arm (o) */}
              <line x1="0" y1="-48" x2="0" y2="-75" stroke="#f59e0b" strokeWidth="2" />
              <circle cx="0" cy="-75" r="3.5" fill="#d97706" />
            </g>

            {/* Bilateral Relay Contacts (p, p) for Automatic Dynamo Regulation */}
            <circle
              cx="-25"
              cy="-85"
              r="6"
              fill={sim.regulatorState === "low_voltage_trip" ? "#3b82f6" : "#475569"}
              stroke="#fff"
              strokeWidth="1.5"
            />
            <text x="-48" y="-82" className="text-[8px] font-mono font-bold fill-blue-400">
              p (Low)
            </text>

            <circle
              cx="25"
              cy="-85"
              r="6"
              fill={sim.regulatorState === "high_voltage_trip" ? "#ef4444" : "#475569"}
              stroke="#fff"
              strokeWidth="1.5"
            />
            <text x="34" y="-82" className="text-[8px] font-mono font-bold fill-red-400">
              p (High)
            </text>

            {/* Coil d d & Torsion Wire f details */}
            <rect
              x="-35"
              y="32"
              width="70"
              height="24"
              rx="4"
              fill="#334155"
              stroke="#64748b"
              strokeWidth="1"
            />
            <text x="-28" y="48" className="text-[9px] font-mono fill-slate-300">
              Coils d d
            </text>

            {/* Binding Posts c & c' */}
            <circle cx="-50" cy="85" r="6" fill="#ca8a04" stroke="#fef08a" strokeWidth="1" />
            <text x="-54" y="74" className="text-[9px] font-mono font-bold fill-amber-300">
              c
            </text>
            <circle cx="50" cy="85" r="6" fill="#ca8a04" stroke="#fef08a" strokeWidth="1" />
            <text x="46" y="74" className="text-[9px] font-mono font-bold fill-amber-300">
              c&apos;
            </text>

            {/* Thumb-nut Torsion Adjuster (j) */}
            <rect
              x="-12"
              y="95"
              width="24"
              height="10"
              rx="2"
              fill="#94a3b8"
              stroke="#cbd5e1"
              strokeWidth="1"
            />
            <text x="-25" y="103" className="text-[8px] font-mono fill-slate-400">
              Nut j
            </text>
          </g>

          {/* Shunt Conductors 5 and 6 */}
          <g strokeWidth="2" strokeDasharray="3 3">
            {/* Wire 5: Plate b -> Binding post c */}
            <path d="M 450 350 L 490 350 L 490 305" fill="none" stroke="#0284c7" />
            <text
              x="455"
              y="342"
              className="text-[10px] font-mono font-bold fill-sky-600 dark:fill-sky-400"
            >
              Wire 5 (Plate Shunt)
            </text>

            {/* Wire 6: Positive Main -> Binding post c' */}
            <path d="M 590 305 L 590 40" fill="none" stroke="#ef4444" />
            <text
              x="596"
              y="100"
              className="text-[10px] font-mono font-bold fill-red-600 dark:fill-red-400"
            >
              Wire 6 (+ Lead)
            </text>
          </g>
        </svg>
      </div>

      {/* Interactive Controls Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-parchment-200/60 dark:bg-ink-950/60 p-4 sm:p-5 rounded-xl border border-parchment-300 dark:border-ink-800 text-xs font-sans">
        {/* Control 1: Mains Line Voltage */}
        <div className="space-y-2">
          <div className="flex justify-between items-center font-mono">
            <label
              htmlFor="mains-v-slider"
              className="font-bold text-ink-900 dark:text-parchment-100"
            >
              Mains Voltage (V_line):
            </label>
            <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
              {mainsVoltage} V
            </span>
          </div>
          <input
            id="mains-v-slider"
            type="range"
            min="90"
            max="130"
            step="1"
            value={mainsVoltage}
            onChange={(e) => updateParam("mainsVoltageV", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
          <div className="flex justify-between text-[10px] font-mono text-ink-500">
            <span>90 V (Under)</span>
            <span>110 V (Nominal)</span>
            <span>130 V (Over)</span>
          </div>
        </div>

        {/* Control 2: Plate Bias Polarity */}
        <div className="space-y-2">
          <span className="font-mono font-bold text-ink-900 dark:text-parchment-100 block">
            Plate Bias Electrode Connection:
          </span>
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => updateParam("plateBiasPolarity", 1)}
              className={`py-1.5 px-2 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer ${
                plateBias === "positive"
                  ? "bg-amber-700 text-white border-amber-800 dark:bg-amber-700"
                  : "bg-parchment-100 dark:bg-ink-900 text-ink-700 dark:text-parchment-300 border-parchment-300 dark:border-ink-800 hover:bg-parchment-200"
              }`}
            >
              + Pos (Normal)
            </button>
            <button
              type="button"
              onClick={() => updateParam("plateBiasPolarity", 0)}
              className={`py-1.5 px-2 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer ${
                plateBias === "neutral"
                  ? "bg-amber-700 text-white border-amber-800 dark:bg-amber-700"
                  : "bg-parchment-100 dark:bg-ink-900 text-ink-700 dark:text-parchment-300 border-parchment-300 dark:border-ink-800 hover:bg-parchment-200"
              }`}
            >
              0 Float
            </button>
            <button
              type="button"
              onClick={() => updateParam("plateBiasPolarity", -1)}
              className={`py-1.5 px-2 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer ${
                plateBias === "negative"
                  ? "bg-amber-700 text-white border-amber-800 dark:bg-amber-700"
                  : "bg-parchment-100 dark:bg-ink-900 text-ink-700 dark:text-parchment-300 border-parchment-300 dark:border-ink-800 hover:bg-parchment-200"
              }`}
            >
              - Neg (Reverse)
            </button>
          </div>
          <p className="text-[10px] font-serif text-ink-600 dark:text-parchment-400 italic">
            Connecting to positive leg collects electrons; negative bias produces zero vacuum
            current.
          </p>
        </div>

        {/* Control 3: Galvanometer Torsion Zero Null */}
        <div className="space-y-2">
          <div className="flex justify-between items-center font-mono">
            <label
              htmlFor="torsion-null-slider"
              className="font-bold text-ink-900 dark:text-parchment-100"
            >
              Torsion Null (Nut j):
            </label>
            <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-ink-800 font-bold">
              {nullRefVoltage} V₀
            </span>
          </div>
          <input
            id="torsion-null-slider"
            type="range"
            min="105"
            max="115"
            step="1"
            value={nullRefVoltage}
            onChange={(e) => updateParam("galvanometerTorsionNullV", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
          <p className="text-[10px] font-serif text-ink-600 dark:text-parchment-400 italic">
            Calibrates the center-zero balance point of torsion wire f against normal candle-power.
          </p>
        </div>
      </div>

      {/* Live SI Telemetry Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-parchment-50 dark:bg-ink-950 border border-parchment-300 dark:border-ink-800 space-y-1">
          <div className="text-[10px] text-ink-500 uppercase tracking-wider">
            Thermionic Current
          </div>
          <div className="text-base sm:text-lg font-bold text-amber-600 dark:text-amber-400">
            {sim.emissionCurrentMicroAmps.toFixed(1)} µA
          </div>
          <div className="text-[10px] text-ink-600 dark:text-parchment-400">
            J = {sim.thermionicCurrentDensityA_m2.toFixed(3)} A/m²
          </div>
        </div>

        <div className="p-3 rounded-xl bg-parchment-50 dark:bg-ink-950 border border-parchment-300 dark:border-ink-800 space-y-1">
          <div className="text-[10px] text-ink-500 uppercase tracking-wider">
            Cathode Temperature
          </div>
          <div className="text-base sm:text-lg font-bold text-orange-600 dark:text-orange-400">
            {sim.filamentTemperatureK} K
          </div>
          <div className="text-[10px] text-ink-600 dark:text-parchment-400">
            P = {sim.filamentPowerW} W (Joule)
          </div>
        </div>

        <div className="p-3 rounded-xl bg-parchment-50 dark:bg-ink-950 border border-parchment-300 dark:border-ink-800 space-y-1">
          <div className="text-[10px] text-ink-500 uppercase tracking-wider">Needle Deflection</div>
          <div className="text-base sm:text-lg font-bold text-indigo-600 dark:text-indigo-400">
            {sim.galvoDeflectionDeg > 0 ? "+" : ""}
            {sim.galvoDeflectionDeg.toFixed(1)}°
          </div>
          <div className="text-[10px] text-ink-600 dark:text-parchment-400">
            Torque balance θ = S_V · ΔV
          </div>
        </div>

        <div className="p-3 rounded-xl bg-parchment-50 dark:bg-ink-950 border border-parchment-300 dark:border-ink-800 space-y-1">
          <div className="text-[10px] text-ink-500 uppercase tracking-wider">
            Rectification Ratio
          </div>
          <div className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {plateBias === "positive" ? "> 10,000 : 1" : "0 : 1 (Cutoff)"}
          </div>
          <div className="text-[10px] text-ink-600 dark:text-parchment-400">
            Unidirectional Vacuum Flow
          </div>
        </div>
      </div>
    </div>
  );
}

export default EdisonIndicatorSim;
