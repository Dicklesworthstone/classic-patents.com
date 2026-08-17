"use client";

import { Rocket } from "lucide-react";
import { useState } from "react";
import { TextWithLatex } from "@/components/ui/LatexRenderer";

export function GoddardRocketSim() {
  const [activeStage, setActiveStage] = useState<1 | 2 | 3>(1);
  const [combustionPressurePsi, setCombustionPressurePsi] = useState<number>(350); // 150 to 800 psi
  const [nozzleExpansionRatio, setNozzleExpansionRatio] = useState<number>(12); // 4 to 25
  const [altitudeMiles, setAltitudeMiles] = useState<number>(18);

  // Optimal expansion ratio rises as ambient pressure falls with altitude.
  const optimalEpsilon = 8 + Math.min(22, altitudeMiles / 6);
  const mismatch = Math.abs(Math.log(nozzleExpansionRatio / optimalEpsilon));
  const expansionEfficiency = Math.max(0.55, Math.exp(-mismatch));

  // Supersonic de Laval calculations, derated by over/under-expansion at this altitude
  const specificImpulseSec = Math.round(
    (180 + Math.sqrt(combustionPressurePsi) * 4 + nozzleExpansionRatio * 2) * expansionEfficiency,
  );
  const exhaustVelocityMs = Math.round(specificImpulseSec * 9.80665);
  const thrustPounds = Math.round(
    ((combustionPressurePsi * 2.8 * nozzleExpansionRatio) / activeStage) * expansionEfficiency,
  );

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Rocket className="w-6 h-6 text-red-500 animate-pulse" />
            <h3 className="font-serif text-2xl font-bold text-ink-950 dark:text-parchment-50">
              Robert H. Goddard&apos;s Multi-Stage Rocket Simulator (US 1,155,986)
            </h3>
          </div>
          <p className="text-sm sm:text-base text-ink-700 dark:text-ink-300 mt-1">
            Simulate supersonic de Laval nozzle expansion, multi-stage deadweight jettisoning, and
            high-altitude rocket dynamics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-300 text-xs sm:text-sm font-mono font-bold border border-red-300 dark:border-red-800 shadow-2xs">
            Stage {activeStage} Active · Exhaust: {exhaustVelocityMs} m/s
          </div>
        </div>
      </div>

      {/* Interactive Visual Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-[#0a0f1d] border border-parchment-300 dark:border-ink-800 p-6 relative min-h-[380px] overflow-hidden">
          <svg viewBox="0 0 600 340" className="w-full h-auto max-h-[340px]">
            {/* Space/Atmosphere Gradient */}
            <rect width="600" height="340" fill="#030712" />

            {/* Stars */}
            {[
              [50, 40],
              [120, 90],
              [200, 30],
              [350, 60],
              [480, 40],
              [540, 110],
              [90, 200],
              [510, 240],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="1.5" fill="#f8fafc" opacity="0.7" />
            ))}

            {/* Earth Horizon Curvature at bottom */}
            <path
              d="M -50 360 Q 300 290 650 360 L 650 400 L -50 400 Z"
              fill="#0284c7"
              opacity="0.6"
            />
            <path d="M -50 360 Q 300 290 650 360" stroke="#38bdf8" strokeWidth="2" fill="none" />

            {/* Goddard Multi-Stage Rocket Stack */}
            <g transform="translate(300, 120)">
              {/* Stage 3 (Top Payload / Final Stage) */}
              <g>
                {/* Nose Cone */}
                <path
                  d="M 0 -70 L 12 -40 L -12 -40 Z"
                  fill="#e2e8f0"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                />
                {/* Stage 3 Tank Body */}
                <rect
                  x="-12"
                  y="-40"
                  width="24"
                  height="25"
                  fill="#cbd5e1"
                  stroke="#64748b"
                  strokeWidth="1.5"
                />
                {/* Stage 3 Nozzle */}
                <path d="M -6 -15 L -10 -5 L 10 -5 L 6 -15 Z" fill="#d97706" />
              </g>

              {/* Stage 2 (Middle Stage) */}
              {activeStage <= 2 && (
                <g transform="translate(0, 0)">
                  <rect
                    x="-16"
                    y="-5"
                    width="32"
                    height="35"
                    fill="#94a3b8"
                    stroke="#475569"
                    strokeWidth="1.5"
                  />
                  {/* Stage 2 Interstage Latch */}
                  <line
                    x1="-16"
                    y1="-5"
                    x2="16"
                    y2="-5"
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeDasharray="2,2"
                  />
                  {/* Stage 2 Nozzle */}
                  <path d="M -9 30 L -14 45 L 14 45 L 9 30 Z" fill="#d97706" />
                </g>
              )}

              {/* Stage 1 (Base Booster Stage) */}
              {activeStage === 1 && (
                <g transform="translate(0, 45)">
                  <rect
                    x="-20"
                    y="0"
                    width="40"
                    height="45"
                    fill="#64748b"
                    stroke="#334155"
                    strokeWidth="1.5"
                  />
                  {/* Base Stabilizing Fins */}
                  <polygon points="-20,20 -38,45 -20,45" fill="#dc2626" />
                  <polygon points="20,20 38,45 20,45" fill="#dc2626" />
                  {/* Supersonic de Laval Nozzle */}
                  <path
                    d="M -12 45 L -8 52 L -18 68 L 18 68 L 8 52 L 12 45 Z"
                    fill="#b45309"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                  />
                </g>
              )}

              {/* Supersonic Rocket Exhaust Plume */}
              <g
                transform={`translate(0, ${activeStage === 1 ? 113 : activeStage === 2 ? 45 : -5})`}
              >
                {/* Core Mach Diamonds */}
                <polygon points="0,0 -8,18 0,36 8,18" fill="#fef08a" opacity="0.9" />
                <polygon points="0,32 -6,48 0,64 6,48" fill="#fef08a" opacity="0.8" />
                {/* Outer Flame Envelope */}
                <path
                  d="M -15 0 Q -25 40 0 95 Q 25 40 15 0 Z"
                  fill="url(#exhaustGradient)"
                  opacity="0.85"
                />
              </g>
            </g>

            {/* Gradient definition */}
            <defs>
              <linearGradient id="exhaustGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="60%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Telemetry Annotations on Left */}
            <g transform="translate(40, 50)">
              <rect width="150" height="85" fill="#1e293b" rx="8" stroke="#334155" />
              <text x="12" y="24" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                ALTITUDE:
              </text>
              <text
                x="12"
                y="44"
                fill="#38bdf8"
                fontSize="13"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {altitudeMiles} MILES
              </text>
              <text x="12" y="62" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                EXHAUST VELOCITY:
              </text>
              <text
                x="12"
                y="77"
                fill="#10b981"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {exhaustVelocityMs} m/s (Mach {(exhaustVelocityMs / 340).toFixed(1)})
              </text>
            </g>
          </svg>

          {/* Telemetry Strip */}
          <div className="w-full grid grid-cols-3 gap-2 text-center text-xs sm:text-sm font-mono pt-3 border-t border-ink-800 text-ink-300">
            <div>
              <span className="text-ink-400 block text-xs">SPECIFIC IMPULSE</span>
              <span className="text-amber-400 font-bold text-sm sm:text-base">
                {specificImpulseSec} sec
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs">NOZZLE THRUST</span>
              <span className="text-red-400 font-bold text-sm sm:text-base">
                {thrustPounds} lbf
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs">EXPANSION RATIO</span>
              <span className="text-blue-400 font-bold text-sm sm:text-base">
                {nozzleExpansionRatio}:1
              </span>
            </div>
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/80 dark:bg-ink-900/70 p-5 space-y-4 shadow-sm">
            <span className="font-serif font-bold text-base sm:text-lg text-ink-950 dark:text-parchment-50 block">
              Rocket Staging &amp; Propulsion
            </span>

            {/* Stage Selector Buttons */}
            <div className="space-y-1.5">
              <span className="text-xs sm:text-sm font-mono block text-ink-800 dark:text-ink-200 font-semibold mb-1">
                Active Flight Stage
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs sm:text-sm font-mono">
                {[1, 2, 3].map((stage) => (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => {
                      setActiveStage(stage as 1 | 2 | 3);
                      setAltitudeMiles(stage === 1 ? 18 : stage === 2 ? 65 : 180);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-colors shadow-2xs ${
                      activeStage === stage
                        ? "bg-red-700 text-white font-bold"
                        : "bg-parchment-200 dark:bg-ink-800 text-ink-800 dark:text-ink-200"
                    }`}
                  >
                    Stage {stage}
                  </button>
                ))}
              </div>
            </div>

            {/* Chamber Pressure Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  <TextWithLatex text="Combustion Pressure ($P_c$)" />
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {combustionPressurePsi} PSI
                </span>
              </div>
              <input
                type="range"
                aria-label="Simulation parameter"
                min="150"
                max="750"
                step="25"
                value={combustionPressurePsi}
                onChange={(e) => setCombustionPressurePsi(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Nozzle Area Ratio Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  <TextWithLatex text="de Laval Nozzle Ratio ($\epsilon$)" />
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {nozzleExpansionRatio}:1
                </span>
              </div>
              <input
                type="range"
                aria-label="Simulation parameter"
                min="4"
                max="25"
                step="1"
                value={nozzleExpansionRatio}
                onChange={(e) => setNozzleExpansionRatio(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-ink-950 dark:text-parchment-100 text-xs sm:text-sm font-sans">
              <span className="font-bold text-red-900 dark:text-red-300 block font-mono text-xs uppercase tracking-wider mb-1">
                Goddard&apos;s Mass Fraction Insight:
              </span>
              <p className="leading-relaxed">
                By jettisoning spent casing deadweight between stages, the remaining rocket
                accelerates exponentially under the Tsiolkovsky equation{" "}
                <TextWithLatex text={"$\\Delta v = v_e \\ln(m_0/m_f)$"} />, enabling payloads to
                escape Earth&apos;s gravitational well. At {altitudeMiles} miles the optimum nozzle
                ratio is ~{optimalEpsilon.toFixed(0)}:1 ({(expansionEfficiency * 100).toFixed(0)}%
                expansion match).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
