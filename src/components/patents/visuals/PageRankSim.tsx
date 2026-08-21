"use client";

import { Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { stepPageRank } from "@/physics/pageRankKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";

interface PageRankSimProps {
  initialDampingFactor?: number;
}

// Directed graph node layout
// 0: Page A, 1: Page B, 2: Page C, 3: Page D, 4: Page E
const GRAPH_NODES = [
  { id: 0, label: "Page A", x: 120, y: 130, color: "#38bdf8" },
  { id: 1, label: "Page B", x: 260, y: 80, color: "#a855f7" },
  { id: 2, label: "Page C", x: 380, y: 190, color: "#10b981" },
  { id: 3, label: "Page D", x: 240, y: 250, color: "#f59e0b" },
  { id: 4, label: "Page E", x: 100, y: 260, color: "#ec4899" },
];

// Adjacency edges: [from, to]
const GRAPH_EDGES = [
  [0, 1], // A -> B
  [0, 2], // A -> C
  [1, 2], // B -> C
  [2, 0], // C -> A
  [3, 2], // D -> C
  [4, 0], // E -> A
  [4, 3], // E -> D
];

export function PageRankSim({ initialDampingFactor = 0.85 }: PageRankSimProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dampingId = useId();

  const { params, updateParam, resetParams } = usePatentPhysics("us-6285999-pagerank");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const dampingFactor = params.dampingFactor ?? initialDampingFactor;

  const [iterationCount, setIterationCount] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [ranks, setRanks] = useState<number[]>([0.2, 0.2, 0.2, 0.2, 0.2]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particlePhase = 0;

    const render = () => {
      particlePhase += 0.02;

      const w = canvas.width;
      const h = canvas.height;

      // Dark background
      ctx.fillStyle = "#090d16";
      ctx.fillRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = "rgba(30, 41, 59, 0.4)";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Title & Masthead
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 13px system-ui, -apple-system, sans-serif";
      ctx.fillText("GOOGLE PAGERANK RANDOM SURFER & MARKOV CHAIN GRAPH", 20, 26);
      ctx.font = "11px monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(
        `US 6,285,999 • Dominant Eigenvector Power Iteration • Damping d: ${dampingFactor.toFixed(2)} • Iterations: ${iterationCount}`,
        20,
        42,
      );

      // ========================================================
      // 1. DIRECTED HYPERLINK GRAPH (Left Pane: x: 40 to 460, y: 60 to 325)
      // ========================================================
      const gX = 40;
      const gY = 60;
      const gW = 430;
      const gH = 265;

      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(gX, gY, gW, gH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 11px system-ui, sans-serif";
      ctx.fillText("DIRECTED WEB CITATION GRAPH (N = 5 NODES)", gX + 12, gY + 22);

      // Draw Directed Hyperlink Arrows & Flowing Surfer Particles
      for (const [fromIdx, toIdx] of GRAPH_EDGES) {
        const from = GRAPH_NODES[fromIdx];
        const to = GRAPH_NODES[toIdx];

        // Line vector
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const dist = Math.hypot(dx, dy);
        const ux = dx / dist;
        const uy = dy / dist;

        const startX = from.x + ux * 24;
        const startY = from.y + uy * 24;
        const endX = to.x - ux * 26;
        const endY = to.y - uy * 26;

        ctx.strokeStyle = "rgba(100, 116, 139, 0.6)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Arrow head
        const arrowAngle = Math.atan2(dy, dx);
        const arrowLen = 9;
        ctx.fillStyle = "rgba(148, 163, 184, 0.8)";
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - arrowLen * Math.cos(arrowAngle - Math.PI / 6),
          endY - arrowLen * Math.sin(arrowAngle - Math.PI / 6),
        );
        ctx.lineTo(
          endX - arrowLen * Math.cos(arrowAngle + Math.PI / 6),
          endY - arrowLen * Math.sin(arrowAngle + Math.PI / 6),
        );
        ctx.closePath();
        ctx.fill();

        // Flowing Random Surfer Probability Photon
        const t = (particlePhase + (fromIdx * 0.3 + toIdx * 0.2)) % 1.0;
        const px = startX + (endX - startX) * t;
        const py = startY + (endY - startY) * t;

        ctx.fillStyle = "#facc15";
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Web Page Nodes
      for (const n of GRAPH_NODES) {
        const rank = ranks[n.id] ?? 0.2;
        // Node radius scales with PageRank score
        const radius = 18 + rank * 40;

        // Node Glow Halo
        const glow = ctx.createRadialGradient(n.x, n.y, 4, n.x, n.y, radius + 8);
        glow.addColorStop(0, `${n.color}88`);
        glow.addColorStop(1, `${n.color}00`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius + 8, 0, Math.PI * 2);
        ctx.fill();

        // Solid Node Circle
        ctx.fillStyle = "#1e293b";
        ctx.strokeStyle = n.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Label
        ctx.fillStyle = "#f8fafc";
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.fillText(n.label, n.x, n.y - 2);

        ctx.fillStyle = n.color;
        ctx.font = "bold 9px monospace";
        ctx.fillText(`${(rank * 100).toFixed(1)}%`, n.x, n.y + 11);
        ctx.textAlign = "left";
      }

      // ========================================================
      // 2. STATIONARY EIGENVECTOR RANK DISTRIBUTION (Right Pane: x: 490 to 740, y: 60 to 325)
      // ========================================================
      const rX = 490;
      const rY = 60;
      const rW = 250;
      const rH = 265;

      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(rX, rY, rW, rH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 11px system-ui, sans-serif";
      ctx.fillText("STATIONARY PROBABILITY r", rX + 12, rY + 22);

      // Bar Chart for each Page
      const bStartY = rY + 45;
      const bHeight = 28;
      const bMaxW = 140;

      for (let i = 0; i < GRAPH_NODES.length; i++) {
        const n = GRAPH_NODES[i];
        const rVal = ranks[i] ?? 0.2;
        const curY = bStartY + i * (bHeight + 8);

        ctx.fillStyle = "#cbd5e1";
        ctx.font = "bold 10px monospace";
        ctx.fillText(n.label, rX + 15, curY + 16);

        // Background Bar Track
        ctx.fillStyle = "rgba(51, 65, 85, 0.5)";
        ctx.fillRect(rX + 75, curY + 4, bMaxW, 18);

        // Filled Rank Bar
        const fillW = Math.max(4, rVal * bMaxW * 2.2);
        ctx.fillStyle = n.color;
        ctx.fillRect(rX + 75, curY + 4, fillW, 18);

        // Percentage Text
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 9px monospace";
        ctx.fillText(`${(rVal * 100).toFixed(1)}%`, rX + 75 + fillW + 6, curY + 16);
      }

      // Sum Invariant
      const sum = ranks.reduce((a, b) => a + b, 0);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "9px monospace";
      ctx.fillText(`Invariant: Σ r_i = ${sum.toFixed(3)} (Stochastic Sum)`, rX + 15, rY + rH - 12);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [ranks, dampingFactor, iterationCount]);

  // Step iteration effect when playing
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setRanks((prev) => {
        const next = stepPageRank({ dampingFactor }, prev);
        return next.ranks;
      });
      setIterationCount((c) => c + 1);
    }, 400);

    return () => clearInterval(interval);
  }, [isPlaying, dampingFactor]);

  const handleStepOnce = () => {
    setRanks((prev) => {
      const next = stepPageRank({ dampingFactor }, prev);
      return next.ranks;
    });
    setIterationCount((c) => c + 1);
  };

  const handleReset = () => {
    setRanks([0.2, 0.2, 0.2, 0.2, 0.2]);
    setIterationCount(0);
  };

  return (
    <div className="w-full flex flex-col gap-4 p-4 sm:p-6 rounded-2xl bg-parchment-50 dark:bg-ink-950 border border-parchment-300 dark:border-ink-800 text-ink-900 dark:text-parchment-100 shadow-md">
      {/* Header with Title and Global Action Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
            PageRank Hyperlink Analysis (US 6,285,999)
          </h3>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400">
            Method for node ranking in a linked database: random surfer Markov model, stochastic
            transition matrix, and damping factor power iteration.
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => {
              toggleSound();
              soundEngine.playSwitchClick();
            }}
            aria-label={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsPlaying(!isPlaying);
              soundEngine.playSwitchClick();
            }}
            aria-label={isPlaying ? "Pause Simulation" : "Play Simulation"}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
            title={isPlaying ? "Pause Simulation" : "Play Simulation"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-amber-600" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              resetParams();
              handleReset();
              soundEngine.playSwitchClick();
            }}
            aria-label="Reset Simulation"
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative w-full overflow-hidden rounded-xl border border-parchment-300 dark:border-neutral-800 bg-[#090d16]">
        <canvas
          ref={canvasRef}
          width={760}
          height={340}
          className="w-full h-auto block aspect-[760/340]"
        />
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-parchment-100/80 dark:bg-neutral-900/70 border border-parchment-200 dark:border-neutral-800/80 text-xs">
        {/* Damping Factor Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between font-mono text-ink-700 dark:text-neutral-300">
            <label htmlFor={dampingId}>Damping Factor d (Surfer Probability):</label>
            <span className="text-amber-600 dark:text-amber-400 font-bold">
              {dampingFactor.toFixed(2)}
            </span>
          </div>
          <input
            id={dampingId}
            type="range"
            min="0.50"
            max="0.98"
            step="0.01"
            value={dampingFactor}
            onChange={(e) => updateParam("dampingFactor", parseFloat(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-neutral-500">
            Probability d = 0.85 that the random surfer follows a hyperlink; 1 - d = 0.15 for random
            jump
          </span>
        </div>

        {/* Status / Algorithm Insights */}
        <div className="flex flex-col justify-center gap-1 p-2.5 rounded bg-parchment-50/80 dark:bg-neutral-950/60 border border-parchment-200 dark:border-neutral-800 font-mono text-[11px]">
          <div className="text-ink-700 dark:text-neutral-400">
            Markov Chain:{" "}
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">
              Irreducible & Primitive
            </span>
          </div>
          <div className="text-ink-700 dark:text-neutral-400">
            Dominant Eigenvalue:{" "}
            <span className="text-cyan-700 dark:text-cyan-400 font-bold">λ₁ = 1.000</span>
          </div>
          <div className="text-ink-500 dark:text-neutral-500 text-[10px]">
            Power iteration converges to unique steady-state distribution (Perron-Frobenius theorem)
          </div>
        </div>
      </div>

      {/* Button Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              handleStepOnce();
              soundEngine.playSwitchClick();
            }}
            className="px-3 py-1.5 rounded-lg font-mono text-xs font-semibold bg-parchment-100 dark:bg-neutral-900 border border-parchment-300 dark:border-neutral-700 text-ink-700 dark:text-neutral-200 hover:bg-parchment-200 dark:hover:bg-neutral-800 hover:text-ink-900 dark:hover:text-white transition-all"
          >
            ⚡ Step Power Iteration (+1)
          </button>
        </div>

        <span className="text-[11px] font-mono text-ink-500 dark:text-neutral-400">
          Convergence Engine:{" "}
          <span className="text-indigo-600 dark:text-indigo-400">Power Iteration</span>
        </span>
      </div>
    </div>
  );
}
