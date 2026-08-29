"use client";

import { GitBranch, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { type ParsonsRoutingMode, stepParsonsMarine } from "@/physics/parsonsMarineKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";
import { useOffscreenGate } from "./useOffscreenGate";

export function ParsonsTurbineSim() {
  const { resetParams } = usePatentPhysics("us-608969-parsons-turbine");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [routing, setRouting] = useState<ParsonsRoutingMode>("series");
  const [reversing, setReversing] = useState(false);
  const [throttle, setThrottle] = useState(0.75);
  const [flowPhase, setFlowPhase] = useState<number>(0);
  const animRef = useRef<number | null>(null);
  const { rootRef, onscreenRef } = useOffscreenGate<HTMLDivElement>();
  const marine = stepParsonsMarine({ routing, reversing, throttle });

  useEffect(() => {
    if (!isPlaying) return;
    let lastTime = performance.now();

    const loop = (time: number) => {
      animRef.current = requestAnimationFrame(loop);
      if (!onscreenRef.current) return;
      const dt = Math.max(0, Math.min(0.1, (time - lastTime) / 1000));
      lastTime = time;

      setFlowPhase((prev) => (prev + dt * (0.5 + marine.flowRateRelative)) % 1);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, marine.flowRateRelative, onscreenRef.current]);

  return (
    <div
      ref={rootRef}
      className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
              Charles Parsons Marine Turbine Routing (US 608,969)
            </h3>
          </div>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400 mt-0.5">
            Valve-and-pipe routing between turbine banks, screw-shafts, condensers, and reversing
            turbines.
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setIsPlaying(!isPlaying);
              soundEngine.playSwitchClick();
            }}
            aria-label={isPlaying ? "Pause Simulation" : "Play Simulation"}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4 text-cyan-600" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              toggleSound();
              soundEngine.playSwitchClick();
            }}
            aria-label={isAudioMuted ? "Unmute Audio" : "Mute Audio"}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
          >
            {isAudioMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4 text-cyan-600" />
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              resetParams();
              setRouting("series");
              setReversing(false);
              setThrottle(0.75);
              soundEngine.playSwitchClick();
            }}
            aria-label="Reset Simulation"
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Animation Stage: a source-bound valve-and-pipe network. */}
      <div className="relative w-full aspect-[16/9] max-h-[360px] bg-parchment-100 dark:bg-ink-900 rounded-xl overflow-hidden border border-parchment-200 dark:border-ink-800 flex items-center justify-center">
        <svg
          viewBox="0 0 600 340"
          role="img"
          aria-label={`Marine steam turbine simulation: ${isPlaying ? `rotor turning ${marine.directionLabel}` : "rotor stopped"}, steam routed ${marine.routeLabel} at ${Math.round(throttle * 100)} percent throttle`}
          className="w-full h-full"
        >
          <defs>
            <marker
              id="parsons-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
            </marker>
          </defs>
          <rect x="18" y="18" width="564" height="304" rx="12" fill="#0f172a" opacity="0.3" />
          <text x="300" y="40" textAnchor="middle" fill="#fbbf24" fontSize="12">
            {marine.routeLabel}
          </text>
          <text x="38" y="72" fill="#f87171" fontSize="10">
            boiler
          </text>
          <rect x="34" y="82" width="52" height="184" rx="6" fill="#7f1d1d" opacity="0.7" />
          <text x="560" y="72" textAnchor="end" fill="#67e8f9" fontSize="10">
            condenser
          </text>
          <rect x="510" y="82" width="54" height="184" rx="6" fill="#164e63" opacity="0.8" />
          {marine.activeTurbines.map((name, index) => {
            const x = 120 + (index % 4) * 94;
            const y = 96 + Math.floor(index / 4) * 92;
            return (
              <g key={name}>
                <rect
                  x={x}
                  y={y}
                  width="64"
                  height="42"
                  rx="6"
                  fill={name === "X" || name === "Y" ? "#581c87" : "#334155"}
                  stroke="#cbd5e1"
                />
                <text x={x + 32} y={y + 25} textAnchor="middle" fill="#f8fafc" fontSize="13">
                  {name}
                </text>
              </g>
            );
          })}
          {marine.routeEdges.map(([from, to], index) => {
            const fromIndex = marine.activeTurbines.indexOf(from);
            const toIndex = marine.activeTurbines.indexOf(to);
            const fromX =
              from === "boiler"
                ? 86
                : from === "condenser E" || from === "condenser G" || from === "condenser H"
                  ? 510
                  : 120 + (fromIndex % 4) * 94 + 64;
            const fromY =
              from === "boiler"
                ? 174
                : from.startsWith("condenser")
                  ? 174
                  : 117 + Math.floor(fromIndex / 4) * 92;
            const toX =
              to === "condenser E" || to === "condenser G" || to === "condenser H"
                ? 510
                : to === "boiler"
                  ? 86
                  : 120 + (toIndex % 4) * 94;
            const toY = to.startsWith("condenser")
              ? 174
              : to === "boiler"
                ? 174
                : 117 + Math.floor(toIndex / 4) * 92;
            const pulse = (flowPhase + index / Math.max(1, marine.routeEdges.length)) % 1;
            return (
              <line
                key={`${from}-${to}`}
                x1={fromX}
                y1={fromY}
                x2={toX}
                y2={toY}
                stroke={pulse > 0.2 ? "#38bdf8" : "#fbbf24"}
                strokeWidth="2.5"
                markerEnd="url(#parsons-arrow)"
                opacity={0.8 + marine.throttle * 0.2}
              />
            );
          })}
          <text
            x="300"
            y="294"
            textAnchor="middle"
            fill={marine.reversing ? "#e879f9" : "#4ade80"}
            fontSize="11"
          >
            {marine.directionLabel.toUpperCase()} · valve topology is live
          </text>
        </svg>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Route topology
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {marine.routing}
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Active turbines
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-amber-700 dark:text-amber-500">
            {marine.activeTurbines.length}
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Screw-shafts
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-500">
            {marine.activeShafts}
          </span>
        </div>
        <div className="bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 p-2.5 rounded-xl text-center">
          <span className="text-[10px] uppercase tracking-wider text-ink-500 dark:text-ink-400 block font-sans">
            Direction
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-ink-900 dark:text-parchment-100">
            {marine.directionLabel}
          </span>
        </div>
      </div>

      {/* Source controls: valve topology and live steam admission. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-parchment-200 dark:border-ink-800">
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Valve connection</span>
            <span className="font-mono">{marine.routing}</span>
          </div>
          <select
            value={routing}
            onChange={(e) => setRouting(e.target.value as ParsonsRoutingMode)}
            className="w-full rounded-lg border border-parchment-300 dark:border-ink-700 bg-parchment-50 dark:bg-ink-900 px-2 py-2 text-sm"
          >
            <option value="series">Series (Fig. 1)</option>
            <option value="compound-parallel">Compound parallel (Fig. 1)</option>
            <option value="simple-parallel">Simple parallel (Fig. 1 / 3)</option>
          </select>
        </div>
        <div>
          <div className="flex justify-between text-xs font-sans font-medium text-ink-700 dark:text-parchment-300 mb-1">
            <span>Steam admission</span>
            <span className="font-mono">{Math.round(marine.throttle * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={throttle}
            onChange={(e) => setThrottle(Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
          <label className="mt-2 flex items-center gap-2 text-xs text-ink-700 dark:text-parchment-300">
            <input
              type="checkbox"
              checked={reversing}
              onChange={(e) => setReversing(e.target.checked)}
            />
            Figure 2 reversing turbines X / Y (astern)
          </label>
        </div>
      </div>
    </div>
  );
}
