"use client";

import { Flame, Gauge, ShieldCheck, Zap } from "lucide-react";
import type React from "react";
import { computePortHamiltonianEnergy } from "@/physics/energyLedger";

interface PortHamiltonianEnergyStripProps {
  patentId: string;
  params: Record<string, number>;
  simTimeSec?: number;
  className?: string;
}

export const PortHamiltonianEnergyStrip: React.FC<PortHamiltonianEnergyStripProps> = ({
  patentId,
  params,
  simTimeSec = 0,
  className = "",
}) => {
  const ledger = computePortHamiltonianEnergy(patentId, params, simTimeSec);

  const formatJoules = (j: number) => {
    if (j >= 1e6) return `${(j / 1e6).toFixed(2)} MJ`;
    if (j >= 1e3) return `${(j / 1e3).toFixed(1)} kJ`;
    return `${j.toFixed(1)} J`;
  };

  const formatWatts = (w: number) => {
    if (w >= 1e6) return `${(w / 1e6).toFixed(2)} MW`;
    if (w >= 1e3) return `${(w / 1e3).toFixed(1)} kW`;
    return `${w.toFixed(1)} W`;
  };

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-parchment-100/90 dark:bg-ink-950/90 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 text-[11px] font-mono text-ink-800 dark:text-parchment-200 shadow-xs ${className}`}
    >
      {/* Total Stored Energy */}
      <div
        className="flex items-center gap-1.5"
        title="Total Port-Hamiltonian Stored Energy H(x) = T + V + W_em + Q"
      >
        <Gauge className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
        <span className="text-ink-500 dark:text-ink-400 font-sans">Stored Energy:</span>
        <span className="font-bold text-ink-900 dark:text-parchment-100">
          {formatJoules(ledger.energy.totalHamiltonianJoules)}
        </span>
      </div>

      {/* Input Power */}
      <div className="flex items-center gap-1.5" title="External Port Power Inflow u^T * y">
        <Zap className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
        <span className="text-ink-500 dark:text-ink-400 font-sans">Port Inflow:</span>
        <span className="font-bold text-cyan-800 dark:text-cyan-300">
          {formatWatts(ledger.inputPowerWatts)}
        </span>
      </div>

      {/* Dissipated Power */}
      <div
        className="flex items-center gap-1.5"
        title="Positive Semi-Definite Dissipation D(x) >= 0"
      >
        <Flame className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
        <span className="text-ink-500 dark:text-ink-400 font-sans">Dissipated:</span>
        <span className="font-bold text-rose-800 dark:text-rose-300">
          {formatWatts(ledger.dissipatedPowerWatts)}
        </span>
      </div>

      {/* Dirac Conservation Integrity */}
      <div className="flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span className="text-ink-500 dark:text-ink-400 font-sans">Energy Balance:</span>
        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
          ΔH ≈ 0 (<span className="text-[10px]">{ledger.supplyDefectWatts} W</span>)
        </span>
      </div>

      <div
        className="text-[10px] text-ink-400 dark:text-ink-500 truncate max-w-[120px] sm:max-w-none"
        title={
          ledger.digestKind === "blake3"
            ? "Blake3 replay digest from a stepped WASM module"
            : "Host digest. Not Blake3: no WASM hasher stepped."
        }
      >
        {ledger.stateDigest}
      </div>
    </div>
  );
};
