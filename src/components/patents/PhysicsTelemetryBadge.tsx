"use client";

import { ChevronDown, ChevronUp, Cpu, Info, Zap } from "lucide-react";
import { useState } from "react";
import { LatexRenderer } from "@/components/ui/LatexRenderer";
import { PATENT_PHYSICS_REGISTRY } from "@/physics/telemetryData";

interface PhysicsTelemetryBadgeProps {
  patentId: string;
  defaultExpanded?: boolean;
}

export function PhysicsTelemetryBadge({
  patentId,
  defaultExpanded = false,
}: PhysicsTelemetryBadgeProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const data = PATENT_PHYSICS_REGISTRY[patentId];

  if (!data) return null;

  return (
    <div className="rounded-xl border border-cyan-800/60 bg-cyan-950/40 dark:bg-[#071322] p-3 sm:p-4 text-xs font-sans text-cyan-100 shadow-sm space-y-3">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>
          <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-cyan-300 uppercase tracking-wide">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            FrankenSim Physics Core
          </div>
          <span className="hidden sm:inline text-cyan-500/80 font-mono">·</span>
          <span className="text-[11px] text-cyan-200 font-medium truncate max-w-[280px] sm:max-w-md">
            {data.domainTitle}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 px-2 py-1 rounded bg-cyan-900/50 hover:bg-cyan-800/60 text-cyan-300 font-mono text-[11px] transition-colors border border-cyan-700/50"
        >
          <span>{expanded ? "Hide Telemetry" : "Inspect Physics"}</span>
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Metrics Row (Always visible or compact) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {data.metrics.map((metric) => (
          <div
            key={metric.label}
            className="p-2 rounded-lg bg-cyan-950/70 border border-cyan-800/50 flex flex-col justify-between"
          >
            <span className="text-[10px] uppercase font-mono text-cyan-400/90 truncate">
              {metric.label}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-mono text-sm sm:text-base font-bold text-white tracking-tight">
                {metric.value}
              </span>
              <span className="font-mono text-[10px] text-cyan-300">{metric.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Expanded Governing Equations & Deep Physics */}
      {expanded && (
        <div className="pt-2 border-t border-cyan-800/50 space-y-2.5 animate-fadeIn">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-300 mb-1">
              <Zap className="w-3 h-3 text-amber-400" />
              Governing Physical Law: {data.equationName}
            </div>
            <div className="p-2.5 rounded bg-black/40 border border-cyan-900 text-center font-serif text-sm overflow-x-auto text-cyan-50">
              <LatexRenderer math={data.governingEquation} block />
            </div>
          </div>

          <div className="flex items-start gap-1.5 text-[11px] text-cyan-200/90 leading-relaxed font-sans bg-cyan-950/50 p-2.5 rounded border border-cyan-900">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <span>{data.pedagogicalInsight}</span>
          </div>

          <div className="text-[10px] font-mono text-cyan-400/70 flex items-center justify-between">
            <span>Kernel: {data.engineMethod}()</span>
            <span>SI Unit Compliant (FrankenSim WASM Bridge)</span>
          </div>
        </div>
      )}
    </div>
  );
}
