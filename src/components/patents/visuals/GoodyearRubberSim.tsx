"use client";

import { Layers } from "lucide-react";
import { useState } from "react";
import { stepGoodyearRubber } from "@/physics/catalogKernels";
import { vulcanKinetics } from "@/physics/thermochem";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

export function GoodyearRubberSim() {
  const { params, updateParam } = usePatentPhysics("us-3633-goodyear-rubber");
  const sulfurPercent = params.sulfurPct ?? 8;
  const [temperatureCelsius, setTemperatureCelsius] = useState<number>(35);
  const [appliedStress, setAppliedStress] = useState<number>(50);

  const rubber = stepGoodyearRubber(params.vulcanTemp ?? 145, sulfurPercent, 30);
  const isRaw = sulfurPercent < 2;
  const isEbonite = sulfurPercent > 20;
  const isElastic = !isRaw && !isEbonite && !rubber.isStickyOrBrittle;

  const isMelted = isRaw && temperatureCelsius > 35;
  const isBrittle = isRaw && temperatureCelsius < 0;
  const cure = vulcanKinetics(params.vulcanTemp ?? 145, sulfurPercent);

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-500" />
            <h3 className="font-serif text-xl font-bold text-ink-900 dark:text-parchment-100">
              Goodyear Thermal Sulfur Vulcanization Simulator (US 3,633)
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-1">
            Discover how sulfur disulfide cross-links transform temperature-sensitive raw
            polyisoprene into durable elastomeric rubber.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border shadow-sm ${
              isMelted
                ? "bg-red-950 border-red-700 text-red-300 animate-pulse"
                : isBrittle
                  ? "bg-blue-950 border-blue-700 text-blue-300"
                  : isElastic
                    ? "bg-emerald-950 border-emerald-700 text-emerald-300"
                    : "bg-amber-950 border-amber-700 text-amber-300"
            }`}
          >
            {isMelted
              ? "✗ RAW GUM MELTED: Foul sticky liquid sludge"
              : isBrittle
                ? "✗ RAW GUM FROZEN: Glassy brittle fracture"
                : isElastic
                  ? "✓ VULCANIZED ELASTIC: Thermoset cross-linked elastomer"
                  : "✓ EBONITE HARD RUBBER: High sulfur hard resin"}
          </span>
        </div>
      </div>

      {/* Visual Canvas & Molecular Chains */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-ink-950 p-6 border border-parchment-200 dark:border-ink-800 relative min-h-[360px] space-y-4">
          <svg viewBox="0 0 440 220" className="w-full max-w-md h-auto select-none">
            {/* Molecular Polyisoprene Chains */}
            {[-40, -15, 10, 35].map((yOffset, idx) => {
              const stretch = appliedStress * 0.8;
              const yBase = 110 + yOffset;
              const sag = isMelted ? 25 : 0;
              return (
                <g key={idx}>
                  <path
                    d={`M 40,${yBase + sag} Q ${220 + stretch},${yBase + sag * 1.5} ${380 + (isElastic ? stretch : 0)},${yBase}`}
                    fill="none"
                    stroke={isMelted ? "#ef4444" : "#f59e0b"}
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {/* Sulfur Disulfide Cross-Links between chains */}
                  {!isRaw && idx < 3 && (
                    <g stroke="#eab308" strokeWidth="2.5">
                      <line x1="100" y1={yBase} x2="100" y2={yBase + 25} />
                      <line x1="180" y1={yBase} x2="180" y2={yBase + 25} />
                      <line x1="260" y1={yBase} x2="260" y2={yBase + 25} />
                      <line x1="340" y1={yBase} x2="340" y2={yBase + 25} />
                      {/* Sulfur Atoms */}
                      <circle cx="100" cy={yBase + 12} r="4" fill="#ca8a04" />
                      <circle cx="180" cy={yBase + 12} r="4" fill="#ca8a04" />
                      <circle cx="260" cy={yBase + 12} r="4" fill="#ca8a04" />
                      <circle cx="340" cy={yBase + 12} r="4" fill="#ca8a04" />
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Telemetry Footer */}
          <div className="w-full grid grid-cols-3 gap-2 text-center text-xs font-mono pt-3 border-t border-ink-800 text-ink-300">
            <div>
              <span className="text-ink-500 block text-[10px]">SULFUR RATIO</span>
              <span className="text-amber-400 font-bold">{sulfurPercent}% Sulfur</span>
            </div>
            <div>
              <span className="text-ink-500 block text-[10px]">TEMPERATURE</span>
              <span className="text-orange-400 font-bold">{temperatureCelsius}°C</span>
            </div>
            <div>
              <span className="text-ink-500 block text-[10px]">ELASTIC RETURN</span>
              <span className={isElastic ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                {rubber.elasticReturnPct}% / {rubber.tensileStrengthPsi} psi
              </span>
            </div>
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/70 dark:bg-ink-900/60 p-5 space-y-4">
            <span className="font-serif font-bold text-sm text-ink-900 dark:text-parchment-100 block">
              Vulcanization Parameters
            </span>
            <div className="rounded-lg border border-parchment-200 dark:border-ink-800 p-2.5 text-[11px] font-mono space-y-1">
              <div className="uppercase tracking-wider text-ink-500">Cure kinetics</div>
              <div className="flex justify-between">
                <span>regime</span>
                <span className="font-bold">{cure.regime}</span>
              </div>
              <div className="flex justify-between">
                <span>relative rate</span>
                <span className="font-bold">{cure.rateRel.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>cross-link</span>
                <span className="font-bold">{cure.crosslinkMolCm3} mol/cm³</span>
              </div>
            </div>

            {/* Sulfur Percentage Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Sulfur Compounding Content
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {sulfurPercent}%
                </span>
              </div>
              <input
                type="range"
                aria-label="Sulfur Compounding Content"
                min="0"
                max="30"
                value={sulfurPercent}
                onChange={(e) => updateParam("sulfurPct", Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-ink-500 font-mono">
                <span>0% (Raw Gum)</span>
                <span>8% (Tire)</span>
                <span>30% (Ebonite)</span>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-amber-700 dark:text-amber-400 pt-1">
                <span>Crosslinks: {cure.crosslinkMolCm3} mol/cm³</span>
                <span className="capitalize">State: {cure.regime}</span>
              </div>
            </div>

            {/* Temperature Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Ambient Temperature
                </span>
                <span className="text-orange-600 dark:text-orange-400 font-bold">
                  {temperatureCelsius}°C
                </span>
              </div>
              <input
                type="range"
                aria-label="Ambient Temperature"
                min="-20"
                max="100"
                value={temperatureCelsius}
                onChange={(e) => setTemperatureCelsius(Number(e.target.value))}
                className="w-full accent-orange-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Applied Mechanical Tensile Stress */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Applied Tensile Strain
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">{appliedStress}%</span>
              </div>
              <input
                type="range"
                aria-label="Applied Tensile Strain"
                min="0"
                max="100"
                value={appliedStress}
                onChange={(e) => setAppliedStress(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
