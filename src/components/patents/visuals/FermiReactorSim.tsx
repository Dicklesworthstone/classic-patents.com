"use client";

import { Activity, RotateCcw, Shield, Sparkles } from "lucide-react";
import { TextWithLatex } from "@/components/ui/LatexRenderer";
import {
  FERMI_KINETICS_SOURCE_BOUNDARY,
  fermiLatticeCell,
  NATURAL_URANIUM_U235_PERCENT,
  stepFermiKinetics,
} from "@/physics/fermiKinetics";
import { computeFermiNormalizedDisplayField } from "@/physics/fieldTextures";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { ClaimConstraintToggle } from "./ClaimConstraintToggle";

export function FermiReactorSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-2708656-fermi-reactor");
  const controlRodWithdrawalPct = params.rodWithdrawal ?? 83.5;
  const moderatorPurityPct = params.moderatorPurity ?? 99.5;
  const claim1Active = (params.claim1Active ?? 1) >= 0.5;

  const kinetics = stepFermiKinetics(
    controlRodWithdrawalPct,
    moderatorPurityPct,
    NATURAL_URANIUM_U235_PERCENT,
    claim1Active,
  );

  const kEffective = kinetics.kEffective;
  const isSupercritical = claim1Active && kEffective > 1.002;
  const isCritical = claim1Active && kEffective >= 0.998 && kEffective <= 1.002;
  const normalizedWithdrawalPct = 100 * (1 - kinetics.controlRodInsertionFraction);
  const absorberSvgX = 70 + (normalizedWithdrawalPct / 100) * 220;

  // Shared spatial sampled display field matching 3D studio
  const displayField = computeFermiNormalizedDisplayField(
    kEffective,
    kinetics.controlRodInsertionFraction,
    16,
  );

  const resetToCriticality = () => {
    resetParams();
  };

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-600 dark:text-amber-500" />
            <h3 className="font-serif text-lg sm:text-xl font-bold text-ink-900 dark:text-parchment-100">
              Fermi–Szilard Graphite–Uranium Lattice (US 2,708,656)
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-1">
            <TextWithLatex text="Claim 1 binds natural-uranium rod geometry to Figure 3's $K = 1$ contour; the specification describes $K \\propto p f \\epsilon$." />
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={resetToCriticality}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 bg-white/80 dark:bg-ink-900/80 text-xs font-mono text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset teaching lens</span>
          </button>
        </div>
      </div>

      {/* Grid: 2D Reactor Core Cutaway + Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Core Diagram */}
        <div className="lg:col-span-2 relative bg-parchment-100/60 dark:bg-ink-900/60 rounded-xl border border-parchment-300 dark:border-ink-800 p-4 flex flex-col items-center justify-center min-h-[340px] overflow-hidden select-none">
          <div className="absolute top-3 left-3 text-[11px] font-mono text-ink-500 dark:text-ink-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-600" />
            <span>Graphite-Uranium Lattice Core (Cross-Section)</span>
          </div>

          <svg
            viewBox="0 0 400 280"
            role="img"
            aria-label={`Fermi reactor Claim 1 lattice: natural uranium rods ${claim1Active ? "present" : "removed"}; normalized absorber withdrawal ${normalizedWithdrawalPct} percent`}
            className="w-full max-w-[480px] h-auto"
          >
            {/* Core Boundary / Graphite Matrix */}
            <rect
              x="50"
              y="30"
              width="300"
              height="220"
              rx="12"
              className="fill-slate-800 dark:fill-ink-900 stroke-slate-600"
              strokeWidth="2"
            />

            {/* Graphite Blocks Lattice */}
            {Array.from({ length: kinetics.latticeRows }).map((_, r) =>
              Array.from({ length: kinetics.latticeCols }).map((_, c) => {
                const cell = fermiLatticeCell(
                  r,
                  c,
                  kinetics.latticeOriginX,
                  kinetics.latticeOriginY,
                  kinetics.latticePitchX,
                  kinetics.latticePitchY,
                  kinetics.latticeCellPadX,
                  kinetics.latticeCellPadY,
                  kinetics.latticeCellW,
                  kinetics.latticeCellH,
                  kinetics.latticeSlugR,
                );
                return (
                  <g key={`cell-${r}-${c}`}>
                    <rect
                      x={cell.x}
                      y={cell.y}
                      width={cell.w}
                      height={cell.h}
                      rx="3"
                      fill="rgba(255,255,255,0.05)"
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="1"
                    />
                    {/* End view of Claim 1 natural-uranium rods modulated by displayField */}
                    {claim1Active &&
                      (() => {
                        const gx = Math.min(15, Math.floor((c / kinetics.latticeCols) * 16));
                        const gy = Math.min(15, Math.floor((r / kinetics.latticeRows) * 16));
                        const fluxLocal = displayField[gy * 16 + gx] ?? 0.5;
                        return (
                          <circle
                            cx={cell.cx}
                            cy={cell.cy}
                            r={cell.slugR * (0.85 + fluxLocal * 0.3)}
                            opacity={0.65 + fluxLocal * 0.35}
                            className={
                              isSupercritical
                                ? "fill-red-500"
                                : isCritical
                                  ? "fill-emerald-400"
                                  : "fill-amber-600"
                            }
                          />
                        );
                      })()}
                  </g>
                );
              }),
            )}

            {/* Figure 8 side-entry absorber paths, shown on fixed guides. */}
            <g transform={`translate(${absorberSvgX}, 108)`}>
              <rect
                x="0"
                y="0"
                width="220"
                height="8"
                rx="2"
                className="fill-amber-400 stroke-amber-600"
              />
              <rect x="214" y="-5" width="12" height="18" rx="2" className="fill-slate-500" />
            </g>
            <g transform={`translate(${absorberSvgX}, 174)`}>
              <rect
                x="0"
                y="0"
                width="220"
                height="8"
                rx="2"
                className="fill-amber-400 stroke-amber-600"
              />
              <rect x="214" y="-5" width="12" height="18" rx="2" className="fill-slate-500" />
            </g>

            {/* Status Badge in Center */}
            <g transform="translate(90, 215)">
              <rect
                x="0"
                y="0"
                width="220"
                height="24"
                rx="6"
                className={
                  isSupercritical
                    ? "fill-red-900/90 stroke-red-500"
                    : isCritical
                      ? "fill-emerald-900/90 stroke-emerald-500"
                      : "fill-blue-900/90 stroke-blue-500"
                }
                strokeWidth="1.5"
              />
              <text
                x="110"
                y="16"
                textAnchor="middle"
                className="text-[10px] font-mono font-bold fill-white tracking-wider"
              >
                {!claim1Active
                  ? "CLAIM 1 LATTICE REMOVED"
                  : isSupercritical
                    ? "ABOVE UNITY · NORMALIZED"
                    : isCritical
                      ? "NEAR UNITY · NORMALIZED"
                      : "BELOW UNITY · NORMALIZED"}
              </text>
            </g>
          </svg>
        </div>

        {/* Telemetry and Controls */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white/90 dark:bg-ink-900/90 border border-parchment-300 dark:border-ink-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400">
                Source topology reader
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-parchment-100 dark:bg-ink-800/60 border border-parchment-200 dark:border-ink-700">
                <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
                  Normalized k_eff lens
                </span>
                <span
                  className={`text-sm font-bold ${
                    isSupercritical
                      ? "text-red-600 dark:text-red-400"
                      : isCritical
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {claim1Active ? kEffective.toFixed(4) : "REFUSED"}
                </span>
                <span className="text-[10px] text-ink-500 block mt-0.5">
                  not a calibrated rod-worth curve
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-parchment-100 dark:bg-ink-800/60 border border-parchment-200 dark:border-ink-700">
                <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
                  Claim 1 fuel basis
                </span>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  {claim1Active ? "Natural uranium rods" : "Rod lattice removed"}
                </span>
                <span className="text-[10px] text-ink-500 block mt-0.5">
                  {NATURAL_URANIUM_U235_PERCENT.toFixed(2)}% U-235 modern reference
                </span>
              </div>
            </div>
          </div>

          <p className="rounded-xl border border-amber-900/20 dark:border-ink-800 bg-amber-50/70 dark:bg-ink-900/70 p-3 text-xs leading-relaxed text-ink-700 dark:text-ink-300">
            <strong className="text-ink-900 dark:text-parchment-100">Source boundary.</strong>{" "}
            {FERMI_KINETICS_SOURCE_BOUNDARY}
          </p>

          {/* Core Controls */}
          <div className="p-4 rounded-xl bg-white/90 dark:bg-ink-900/90 border border-parchment-300 dark:border-ink-800 shadow-sm space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400 block">
              Source-bounded controls
            </span>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-ink-700 dark:text-ink-300">
                  Normalized Absorber Withdrawal:
                </span>
                <span className="font-mono font-bold text-amber-600">
                  {normalizedWithdrawalPct}%
                </span>
              </div>
              <input
                type="range"
                aria-label="Normalized Absorber Withdrawal"
                min="0"
                max="100"
                step="0.5"
                value={controlRodWithdrawalPct}
                onChange={(e) => updateParam("rodWithdrawal", Number(e.target.value))}
                className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-ink-700 dark:text-ink-300">Declared Graphite Purity:</span>
                <span className="font-mono font-bold text-amber-600">{moderatorPurityPct}%</span>
              </div>
              <input
                type="range"
                aria-label="Declared Graphite Purity"
                min="95"
                max="100"
                step="0.5"
                value={moderatorPurityPct}
                onChange={(e) => updateParam("moderatorPurity", Number(e.target.value))}
                className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
              />
            </div>

            <ClaimConstraintToggle
              patentId="us-2708656-fermi-reactor"
              claimStates={{ 1: claim1Active }}
              onToggleClaim={(_claimNumber, active) => updateParam("claim1Active", active ? 1 : 0)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
