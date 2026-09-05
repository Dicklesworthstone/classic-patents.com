"use client";

import { Activity, Check, CircleAlert, Flame, Gauge, Zap } from "lucide-react";
import type React from "react";
import { computePortHamiltonianEnergy } from "@/physics/energyLedger";

interface PortHamiltonianEnergyStripProps {
  patentId: string;
  params: Record<string, number>;
  simTimeSec?: number;
  className?: string;
}

function formatJoules(joules: number) {
  if (joules >= 1e6) return `${(joules / 1e6).toFixed(2)} MJ`;
  if (joules >= 1e3) return `${(joules / 1e3).toFixed(1)} kJ`;
  return `${joules.toFixed(1)} J`;
}

function formatWatts(watts: number) {
  if (watts >= 1e6) return `${(watts / 1e6).toFixed(2)} MW`;
  if (watts >= 1e3) return `${(watts / 1e3).toFixed(1)} kW`;
  return `${watts.toFixed(1)} W`;
}

export const PortHamiltonianEnergyStrip: React.FC<PortHamiltonianEnergyStripProps> = ({
  patentId,
  params,
  simTimeSec = 0,
  className = "",
}) => {
  const ledger = computePortHamiltonianEnergy(patentId, params, simTimeSec);

  return (
    <div
      data-energy-availability={ledger.availability}
      data-energy-runtime={ledger.runtimeSource}
      className={`grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-between gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-parchment-100/90 dark:bg-ink-950/90 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 text-[10px] sm:text-[11px] font-mono text-ink-800 dark:text-parchment-200 shadow-xs ${className}`}
    >
      {ledger.availability === "unavailable" ? (
        <p className="col-span-2 w-full font-sans text-ink-600 dark:text-ink-300">
          Energy data unavailable: {ledger.reason}
        </p>
      ) : (
        <>
          {/* Total Stored Energy */}
          <div className="flex items-center gap-1 sm:gap-1.5 min-w-0" title={ledger.reason}>
            <Gauge className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="text-ink-500 dark:text-ink-400 font-sans truncate">
              {/* Touch has no title tooltips: show the identity itself instead. */}
              {ledger.availability === "kernel-partial" && ledger.storedEnergyAvailable
                ? "Kinetic:"
                : "Stored:"}
            </span>
            <span className="font-bold text-ink-900 dark:text-parchment-100 shrink-0">
              {ledger.storedEnergyAvailable
                ? formatJoules(ledger.energy.totalHamiltonianJoules)
                : "Unknown"}
            </span>
          </div>

          {/* Input Power */}
          <div
            className="flex items-center gap-1 sm:gap-1.5 min-w-0"
            title="External Port Power Inflow u^T * y"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span className="text-ink-500 dark:text-ink-400 font-sans truncate">
              <span className="[@media(pointer:coarse)]:hidden">Inflow:</span>
              <span className="hidden [@media(pointer:coarse)]:inline">u·y:</span>
            </span>
            <span className="font-bold text-cyan-800 dark:text-cyan-300 shrink-0">
              {ledger.inputPowerAvailable ? formatWatts(ledger.inputPowerWatts) : "Unknown"}
            </span>
          </div>

          {/* Dissipated Power */}
          <div
            className="flex items-center gap-1 sm:gap-1.5 min-w-0"
            title={
              ledger.dissipationLabel
                ? ledger.reason
                : "Positive Semi-Definite Dissipation D(x) >= 0"
            }
          >
            <Flame className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
            <span className="text-ink-500 dark:text-ink-400 font-sans truncate">
              {ledger.dissipationLabel ? `${ledger.dissipationLabel}:` : "Loss:"}
            </span>
            <span className="font-bold text-rose-800 dark:text-rose-300 shrink-0">
              {ledger.dissipatedPowerAvailable
                ? formatWatts(ledger.dissipatedPowerWatts)
                : "Unknown"}
            </span>
          </div>

          {ledger.outputPowerWatts !== null && (
            <div className="flex min-w-0 items-center gap-1 sm:gap-1.5" title={ledger.reason}>
              <Zap className="w-3.5 h-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="font-sans text-ink-500 dark:text-ink-400">Output:</span>
              <span className="shrink-0 font-bold text-emerald-800 dark:text-emerald-300">
                {formatWatts(ledger.outputPowerWatts)}
              </span>
            </div>
          )}

          {/* A power closure is not a transient stored-energy conservation test. */}
          <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
            {ledger.balance.kind === "steady-state" ? (
              <span
                className={`flex items-center gap-1 ${ledger.balance.balanced ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}`}
                title={`Steady power residual: ${ledger.balance.residualWatts} W; tolerance: ${ledger.balance.toleranceWatts} W. No transient energy test.`}
              >
                {ledger.balance.balanced ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <CircleAlert className="w-3.5 h-3.5" />
                )}
                Steady power {ledger.balance.balanced ? "balanced" : "mismatch"}
              </span>
            ) : (
              <span
                className="flex items-center gap-1 text-ink-600 dark:text-ink-300"
                title={ledger.balance.reason}
              >
                <Activity className="w-3.5 h-3.5" /> Balance unmeasured
              </span>
            )}
          </div>

          <div
            className="col-span-2 sm:col-span-1 text-[9px] sm:text-[10px] text-ink-400 dark:text-ink-500 truncate text-right sm:text-left pt-0.5 sm:pt-0 border-t sm:border-t-0 border-parchment-200 dark:border-ink-800/60 sm:max-w-none"
            title={
              ledger.digestKind === "blake3"
                ? "Blake3 replay digest from a stepped WASM module"
                : "Host digest. Not Blake3: no WASM hasher stepped."
            }
          >
            {ledger.stateDigest}
          </div>
          <p className="col-span-2 w-full font-sans text-ink-600 dark:text-ink-300">
            {ledger.reason}
          </p>
        </>
      )}
    </div>
  );
};
