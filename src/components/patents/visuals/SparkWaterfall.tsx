"use client";

import { useEffect, useRef } from "react";

import { useOffscreenGate } from "./useOffscreenGate";

interface SparkWaterfallProps {
  /** Fundamental of the damped spark, Hz */
  fundamentalHz: number;
  /** Packet energy proxy, 0–1 */
  energy: number;
  firing: boolean;
  className?: string;
}

const BINS = 48;
const ROWS = 28;
const ODD_HARMONICS = [1, 3, 5, 7, 9, 11];

function sparkSpectrum(fundamentalHz: number, energy: number): Float32Array {
  const bins = new Float32Array(BINS);
  const fMax = Math.max(fundamentalHz * 13, 1);
  for (const n of ODD_HARMONICS) {
    const f = fundamentalHz * n;
    const x = (f / fMax) * (BINS - 1);
    const amp = energy / n;
    const i0 = Math.max(0, Math.floor(x) - 1);
    const i1 = Math.min(BINS - 1, Math.ceil(x) + 1);
    for (let i = i0; i <= i1; i++) {
      const d = i - x;
      bins[i] += amp * Math.exp(-d * d * 1.6);
    }
  }
  return bins;
}

export function SparkWaterfall({ fundamentalHz, energy, firing, className }: SparkWaterfallProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { rootRef, onscreenRef } = useOffscreenGate<HTMLDivElement>();
  const rowsRef = useRef<Float32Array[]>(
    Array.from({ length: ROWS }, () => new Float32Array(BINS)),
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = performance.now();

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!onscreenRef.current) return;
      if (now - last < 50) return;
      last = now;

      const rows = rowsRef.current;
      const injected = firing
        ? sparkSpectrum(fundamentalHz, Math.min(1, Math.max(0.05, energy)))
        : new Float32Array(BINS);
      const next = new Float32Array(BINS);
      for (let i = 0; i < BINS; i++) {
        next[i] = injected[i] + rows[0][i] * 0.72;
      }
      rows.pop();
      rows.unshift(next);

      const w = canvas.width;
      const h = canvas.height;
      const cellW = w / BINS;
      const cellH = h / ROWS;
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, w, h);

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < BINS; c++) {
          const v = Math.min(1, rows[r][c]);
          if (v < 0.02) continue;
          const g = Math.round(80 + v * 160);
          const b = Math.round(40 + (1 - r / ROWS) * 80);
          ctx.fillStyle = `rgba(255, ${g}, ${b}, ${0.25 + v * 0.75})`;
          ctx.fillRect(c * cellW, r * cellH, cellW + 0.5, cellH + 0.5);
        }
      }
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [energy, firing, fundamentalHz, onscreenRef.current]);

  const f0Khz = (fundamentalHz / 1000).toFixed(0);

  return (
    <div ref={rootRef} className={className}>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-ink-500 dark:text-ink-400">
          Spark spectrum
        </span>
        <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400">
          f₀ = {f0Khz} kHz · odd harmonics
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={360}
        height={112}
        className="w-full h-28 rounded-lg border border-ink-800 bg-ink-950"
        aria-label={`Damped-spark waterfall. Fundamental ${f0Khz} kilohertz. Odd harmonics decay with time.`}
      />
      <p className="mt-1 text-[10px] font-sans text-ink-500 dark:text-ink-400">
        A spark is a damped train, not a sine. Energy sits on odd harmonics of the aerial and fades
        down the page after each firing.
      </p>
    </div>
  );
}
