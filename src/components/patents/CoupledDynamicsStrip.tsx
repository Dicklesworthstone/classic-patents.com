"use client";

import { ArrowRight, Link2 } from "lucide-react";
import Link from "next/link";
import type { CoupleEdge } from "@/physics/coupleGraph";

interface CoupledDynamicsStripProps {
  edges: CoupleEdge[];
}

export function CoupledDynamicsStrip({ edges }: CoupledDynamicsStripProps) {
  if (!edges.length) return null;

  return (
    <div
      data-testid="coupled-dynamics-strip"
      data-coupled-edge-count={edges.length}
      className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-white/70 dark:bg-ink-900/70 p-3 space-y-2"
    >
      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-ink-500 dark:text-ink-400">
        <div className="flex items-center gap-1.5">
          <Link2 className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
          <span>Coupled Transfer Dynamics · fs-couple</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/labs"
            className="text-[9px] underline text-cyan-700 dark:text-cyan-400 hover:text-cyan-900 dark:hover:text-cyan-200 transition-colors"
          >
            Open Teaching Lab →
          </Link>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border border-cyan-300/60 dark:border-cyan-800/60 font-mono">
            {edges[0]?.source ?? "ts-fallback"}
          </span>
        </div>
      </div>
      <div className="space-y-1.5">
        {edges.map((edge) => (
          <div
            key={`${edge.from}->${edge.to}`}
            className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg bg-parchment-100/60 dark:bg-ink-950/60 border border-parchment-200 dark:border-ink-800/80 text-[11px] font-mono"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-ink-700 dark:text-parchment-300 font-medium truncate">
                {edge.from}
              </span>
              <ArrowRight className="w-3 h-3 text-ink-400 shrink-0" />
              <span className="text-ink-900 dark:text-white font-semibold truncate">{edge.to}</span>
            </div>
            <div className="flex items-center gap-1 font-bold text-cyan-700 dark:text-cyan-400 shrink-0">
              <span>{edge.gain > 0 ? `+${edge.gain}` : edge.gain}</span>
              <span className="text-[10px] font-normal text-ink-500 dark:text-ink-400">
                {edge.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
