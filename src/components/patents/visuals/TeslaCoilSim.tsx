"use client";

import { Zap } from "lucide-react";
import { SparkWaterfall } from "@/components/patents/visuals/SparkWaterfall";
import { FrankenSimEngine } from "@/physics/engine";
import { teslaCoilResonantKhz } from "@/physics/teslaKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

export function TeslaCoilSim() {
  const { params, updateParam } = usePatentPhysics("us-533367-tesla-coil");
  const primaryCapacitanceNf = params.primaryCap ?? 45;
  const inputKv = params.inputVoltageKv ?? 15;
  const sparkGap = params.sparkGapDistanceMm ?? 12;
  const couplingK = params.couplingK ?? 0.18;
  const sparkRateHz = params.sparkRateHz ?? 120;
  const secondaryTurns = params.secondaryTurns ?? 850;
  const toploadCapacitancePf = params.toploadCapacitancePf ?? 35;

  // Resonant calculations via central physics engine
  const resonantFreqKhz = teslaCoilResonantKhz(primaryCapacitanceNf, toploadCapacitancePf);
  const res = FrankenSimEngine.stepTeslaCoil(
    resonantFreqKhz,
    inputKv,
    sparkGap,
    145,
    couplingK,
    secondaryTurns,
  );
  const secondaryVoltageKv = res.secondaryPotentialKv;
  const streamerScale = res.streamerScale;

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Zap className="w-6 h-6 text-purple-500 animate-pulse" />
            <h3 className="font-serif text-2xl font-bold text-ink-950 dark:text-parchment-50">
              Nikola Tesla&apos;s High-Frequency Resonant Transformer (US 533,367)
            </h3>
          </div>
          <p className="text-sm sm:text-base text-ink-700 dark:text-ink-300 mt-1">
            Air-core dual-tuned LC electrical resonance producing high-frequency standing waves and
            million-volt plasma streamers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-300 text-xs sm:text-sm font-mono font-bold border border-purple-300 dark:border-purple-800 shadow-2xs">
            {secondaryVoltageKv} kV Peak Potential
          </div>
        </div>
      </div>

      {/* Interactive Visual Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-[#0a0f1d] border border-parchment-300 dark:border-ink-800 p-6 relative min-h-[380px] overflow-hidden">
          <svg viewBox="0 0 600 340" className="w-full h-auto max-h-[340px]">
            {/* Background Dark Lab */}
            <rect width="600" height="340" fill="#090d16" />

            {/* Floor Ground Plane */}
            <line x1="50" y1="300" x2="550" y2="300" stroke="#334155" strokeWidth="3" />
            {/* Ground Symbol */}
            <path
              d="M 300 300 L 300 320 M 285 320 L 315 320 M 290 325 L 310 325 M 295 330 L 305 330"
              stroke="#64748b"
              strokeWidth="2"
            />

            {/* Primary Coil (Heavy Flat Spiral / Conical Outer Ring) */}
            <g transform="translate(300, 270)">
              {[-60, -45, -30, 30, 45, 60].map((x, i) => (
                <circle
                  key={i}
                  cx={x}
                  cy="0"
                  r="5"
                  fill="#f59e0b"
                  stroke="#d97706"
                  strokeWidth="1.5"
                />
              ))}
            </g>

            {/* Secondary Conical / Helical Resonator Winding */}
            <g transform="translate(300, 260)">
              <path
                d="M -25 0 L -15 -140 L 15 -140 L 25 0 Z"
                fill="#1e1b4b"
                stroke="#6366f1"
                strokeWidth="2"
              />
              {/* Helical Turn Lines */}
              {Array.from({ length: 18 }).map((_, i) => (
                <line
                  key={i}
                  x1={-25 + i * 0.55}
                  y1={-i * 7.5}
                  x2={25 - i * 0.55}
                  y2={-i * 7.5 - 3}
                  stroke="#a855f7"
                  strokeWidth="1.5"
                  opacity="0.85"
                />
              ))}
            </g>

            {/* Topload Toroid Terminal (High Voltage Sphere) */}
            <g transform="translate(300, 110)">
              <ellipse
                cx="0"
                cy="0"
                rx="45"
                ry="18"
                fill="#cbd5e1"
                stroke="#f8fafc"
                strokeWidth="2"
              />
              <ellipse cx="0" cy="0" rx="35" ry="12" fill="#94a3b8" />
            </g>

            {/* High-Frequency Plasma Electrical Streamers (Lightning Discharges) */}
            <g
              stroke="#c084fc"
              strokeWidth="2"
              fill="none"
              opacity="0.9"
              transform={`translate(300 110) scale(${streamerScale}) translate(-300 -110)`}
            >
              {/* Left Branching Arc */}
              <path d="M 260 110 Q 220 80 180 90 T 130 60 T 80 110 T 50 140" strokeWidth="2.5" />
              <path d="M 180 90 Q 150 130 110 150" strokeWidth="1.5" />
              {/* Right Branching Arc */}
              <path d="M 340 110 Q 380 70 420 85 T 480 50 T 530 90 T 560 130" strokeWidth="2.5" />
              <path d="M 420 85 Q 460 120 500 140" strokeWidth="1.5" />
              {/* Vertical Corona Streamers */}
              <path d="M 300 95 Q 290 50 310 20" strokeWidth="2" stroke="#e9d5ff" />
              <path d="M 280 100 Q 260 60 250 30" strokeWidth="1.5" stroke="#e9d5ff" />
              <path d="M 320 100 Q 340 60 350 30" strokeWidth="1.5" stroke="#e9d5ff" />
            </g>

            {/* Spark Gap & Tank Circuit Representation on Left */}
            <g transform="translate(100, 240)">
              <rect x="-30" y="-30" width="60" height="40" fill="#1e293b" stroke="#475569" rx="4" />
              <text x="-25" y="-12" fill="#38bdf8" fontSize="9" fontFamily="monospace">
                PRIMARY CAP
              </text>
              <text
                x="-20"
                y="2"
                fill="#f8fafc"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {primaryCapacitanceNf} nF
              </text>
              {/* Spark Gap */}
              <circle cx="55" cy="-10" r="4" fill="#fbbf24" />
              <circle cx="65" cy="-10" r="4" fill="#fbbf24" />
              <line x1="58" y1="-10" x2="62" y2="-10" stroke="#67e8f9" strokeWidth="3" />
            </g>
          </svg>

          {/* Telemetry Strip */}
          <div className="w-full grid grid-cols-3 gap-2 text-center text-xs sm:text-sm font-mono pt-3 border-t border-ink-800 text-ink-300">
            <div>
              <span className="text-ink-400 block text-xs">RESONANT FREQUENCY</span>
              <span className="text-purple-400 font-bold text-sm sm:text-base">
                {resonantFreqKhz.toFixed(1)} kHz
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs">TOPLOAD VOLTAGE</span>
              <span className="text-amber-400 font-bold text-sm sm:text-base">
                {secondaryVoltageKv} kV
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs">SPARK REPETITION</span>
              <span className="text-emerald-400 font-bold text-sm sm:text-base">
                {sparkRateHz} PPS
              </span>
            </div>
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <SparkWaterfall
            fundamentalHz={resonantFreqKhz * 1000}
            energy={Math.min(1, secondaryVoltageKv / 1500)}
            firing={true}
          />
          <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/80 dark:bg-ink-900/70 p-5 space-y-4 shadow-sm">
            <span className="font-serif font-bold text-base sm:text-lg text-ink-950 dark:text-parchment-50 block">
              Resonant LC Parameters
            </span>

            {/* Primary Tank Capacitance Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Primary Tank Cap ($C_p$)
                </span>
                <span className="text-purple-600 dark:text-purple-400 font-bold">
                  {primaryCapacitanceNf} nF
                </span>
              </div>
              <input
                type="range"
                aria-label="Primary Tank Cap (C_p)"
                min="10"
                max="90"
                step="5"
                value={primaryCapacitanceNf}
                onChange={(e) => updateParam("primaryCap", Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

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
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Spark Gap Repetition Rate Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Rotary Spark Gap Rate
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {sparkRateHz} Hz
                </span>
              </div>
              <input
                type="range"
                aria-label="Rotary Spark Gap Rate"
                min="30"
                max="400"
                step="10"
                value={sparkRateHz}
                onChange={(e) => updateParam("sparkRateHz", Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-ink-950 dark:text-parchment-100 text-xs sm:text-sm font-sans">
              <span className="font-bold text-purple-900 dark:text-purple-300 block font-mono text-xs uppercase tracking-wider mb-1">
                Quarter-Wave Resonance:
              </span>
              <p className="leading-relaxed">
                By tuning the primary capacitor tank circuit to match the secondary coil&apos;s
                natural resonant frequency ({resonantFreqKhz.toFixed(1)} kHz), standing
                electromagnetic waves build up massive electrical potential at the ungrounded toroid
                terminal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
