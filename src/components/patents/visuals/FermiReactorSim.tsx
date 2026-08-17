"use client";

import { Activity, RotateCcw, Shield, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { FrankenSimEngine } from "@/physics/engine";

export function FermiReactorSim() {
  const [controlRodWithdrawalPct, setControlRodWithdrawalPct] = useState<number>(78);
  const [moderatorPurityPct, setModeratorPurityPct] = useState<number>(95);
  const [fuelEnrichmentPct, setFuelEnrichmentPct] = useState<number>(0.72);
  const [_neutronHistory, setNeutronHistory] = useState<number[]>([200, 200, 200, 200, 200]);

  // Compute Nuclear Kinetics via FrankenSimEngine
  const kinetics = FrankenSimEngine.stepFermiReactor(
    controlRodWithdrawalPct,
    moderatorPurityPct,
    fuelEnrichmentPct,
  );

  const kEffective = kinetics.kEffective;
  const reactivityDollars = kinetics.reactivityDollars;
  const thermalPowerWatts = kinetics.thermalPowerWatts;
  const thermalFlux = kinetics.thermalNeutronFluxNPerCm2S;

  const isSupercritical = kEffective > 1.002;
  const isCritical = kEffective >= 0.998 && kEffective <= 1.002;
  const _isSubcritical = kEffective < 0.998;

  // Neutron history tracker
  useEffect(() => {
    const timer = setInterval(() => {
      setNeutronHistory((prev) => [...prev.slice(1), Math.min(1000, thermalPowerWatts)]);
    }, 500);
    return () => clearInterval(timer);
  }, [thermalPowerWatts]);

  const resetToCriticality = () => {
    setControlRodWithdrawalPct(78);
    setModeratorPurityPct(95);
    setFuelEnrichmentPct(0.72);
  };

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-600 dark:text-amber-500 animate-pulse" />
            <h3 className="font-serif text-lg sm:text-xl font-bold text-ink-900 dark:text-parchment-100">
              Fermi-Szilard Chicago Pile-1 Criticality Matrix (US 2,708,656)
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-1">
            Observe the 4-Factor formula self-sustaining chain reaction: $k_{"{eff}"} = \eta \cdot
            \epsilon \cdot p \cdot f \cdot P_{"{NL}"}$.
          </p>
        </div>

        <button
          type="button"
          onClick={resetToCriticality}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 bg-white/80 dark:bg-ink-900/80 text-xs font-mono text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Calibrate k=1.000</span>
        </button>
      </div>

      {/* Grid: 2D Reactor Core Cutaway + Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Core Diagram */}
        <div className="lg:col-span-2 relative bg-parchment-100/60 dark:bg-ink-900/60 rounded-xl border border-parchment-300 dark:border-ink-800 p-4 flex flex-col items-center justify-center min-h-[340px] overflow-hidden select-none">
          <div className="absolute top-3 left-3 text-[11px] font-mono text-ink-500 dark:text-ink-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-600" />
            <span>Graphite-Uranium Lattice Core (Cross-Section)</span>
          </div>

          <svg viewBox="0 0 400 280" className="w-full max-w-[480px] h-auto">
            {/* Core Boundary / Graphite Matrix */}
            <rect
              x="50"
              y="30"
              width="300"
              height="220"
              rx="12"
              className="fill-slate-800 dark:fill-slate-900 stroke-slate-600"
              strokeWidth="2"
            />

            {/* Graphite Blocks Lattice */}
            {Array.from({ length: 5 }).map((_, r) =>
              Array.from({ length: 7 }).map((_, c) => {
                const cx = 80 + c * 40;
                const cy = 60 + r * 38;
                return (
                  <g key={`cell-${r}-${c}`}>
                    <rect
                      x={cx - 15}
                      y={cy - 14}
                      width="30"
                      height="28"
                      rx="3"
                      fill="rgba(255,255,255,0.05)"
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="1"
                    />
                    {/* Uranium Fuel Lump */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r="5"
                      className={
                        isSupercritical
                          ? "fill-red-500 animate-pulse"
                          : isCritical
                            ? "fill-emerald-400"
                            : "fill-amber-600"
                      }
                    />
                  </g>
                );
              }),
            )}

            {/* Cadmium Control Rods (Vertical Channels) */}
            {/* Control Rod 1 */}
            <g transform={`translate(140, ${30 - (controlRodWithdrawalPct / 100) * 120})`}>
              <rect
                x="0"
                y="0"
                width="8"
                height="180"
                rx="2"
                className="fill-amber-400 stroke-amber-600"
              />
              <circle cx="4" cy="5" r="3" className="fill-amber-500" />
            </g>
            {/* Control Rod 2 */}
            <g transform={`translate(252, ${30 - (controlRodWithdrawalPct / 100) * 120})`}>
              <rect
                x="0"
                y="0"
                width="8"
                height="180"
                rx="2"
                className="fill-amber-400 stroke-amber-600"
              />
              <circle cx="4" cy="5" r="3" className="fill-amber-500" />
            </g>

            {/* Neutron Flux Glow Overlay */}
            {isSupercritical && (
              <circle
                cx="200"
                cy="140"
                r="90"
                fill="url(#superFluxGlow)"
                className="pointer-events-none animate-ping"
                style={{ animationDuration: "2s" }}
              />
            )}
            <defs>
              <radialGradient id="superFluxGlow">
                <stop offset="0%" stopColor="rgba(239, 68, 68, 0.4)" />
                <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
              </radialGradient>
            </defs>

            {/* Status Badge in Center */}
            <g transform="translate(140, 215)">
              <rect
                x="0"
                y="0"
                width="120"
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
                x="60"
                y="16"
                textAnchor="middle"
                className="text-[10px] font-mono font-bold fill-white tracking-wider"
              >
                {isSupercritical
                  ? "SUPERCRITICAL"
                  : isCritical
                    ? "CRITICAL (STABLE)"
                    : "SUBCRITICAL"}
              </text>
            </g>
          </svg>
        </div>

        {/* Telemetry and Controls */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white/90 dark:bg-ink-900/90 border border-parchment-300 dark:border-ink-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400">
                Point Kinetics Telemetry
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-parchment-100 dark:bg-ink-800/60 border border-parchment-200 dark:border-ink-700">
                <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
                  k_eff Multiplier
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
                  {kEffective.toFixed(4)}
                </span>
                <span className="text-[10px] text-ink-500 block mt-0.5">
                  ${reactivityDollars.toFixed(2)} Reactivity
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-parchment-100 dark:bg-ink-800/60 border border-parchment-200 dark:border-ink-700">
                <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
                  Thermal Output
                </span>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  {thermalPowerWatts.toLocaleString()} W
                </span>
                <span className="text-[10px] text-ink-500 block mt-0.5">
                  {(thermalFlux / 1e7).toFixed(1)}e7 n/cm²s
                </span>
              </div>
            </div>
          </div>

          {/* Core Controls */}
          <div className="p-4 rounded-xl bg-white/90 dark:bg-ink-900/90 border border-parchment-300 dark:border-ink-800 shadow-sm space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400 block">
              Cadmium & Moderator Tuning
            </span>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-ink-700 dark:text-ink-300">Control Rod Withdrawal:</span>
                <span className="font-mono font-bold text-amber-600">
                  {controlRodWithdrawalPct}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={controlRodWithdrawalPct}
                onChange={(e) => setControlRodWithdrawalPct(Number(e.target.value))}
                className="w-full accent-amber-600"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-ink-700 dark:text-ink-300">Graphite Moderator Purity:</span>
                <span className="font-mono font-bold text-amber-600">{moderatorPurityPct}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="100"
                step="1"
                value={moderatorPurityPct}
                onChange={(e) => setModeratorPurityPct(Number(e.target.value))}
                className="w-full accent-amber-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
