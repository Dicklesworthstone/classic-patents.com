"use client";

import { Cpu, Monitor, Pause, Play, RotateCcw, Sparkles, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TextWithLatex } from "@/components/ui/LatexRenderer";
import { stepWozniakApple, wozniakBusCycle } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";

export { wozniakBusCycle };

export function WozniakAppleSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("us-4136359-wozniak-apple");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const crystalFreq = params.crystalFreq ?? 14.318;
  const apple = stepWozniakApple({
    crystalFreq,
    ramCapacityKb: params.ramCapacityKb ?? 48,
  });
  const phi2Steal = params.phi2Steal ?? 0;
  const [clockPhase, setClockPhase] = useState<0 | 1>(0); // Phase 1: CPU, Phase 2: Video Shifter
  const [isClockRunning, setIsClockRunning] = useState<boolean>(true);
  const [rasterLine, setRasterLine] = useState<number>(42);
  const [colorMode, setColorMode] = useState<"color" | "monochrome">("color");
  const [dramAddress, setDramAddress] = useState<string>("0x0400");
  const busTickRef = useRef(0);

  const intervalMs = apple.busTickIntervalMs;

  // Dynamic Phase 1 / Phase 2 Interleaving Clock (14.31818 MHz master crystal divided down)
  useEffect(() => {
    if (!isClockRunning) return;
    const interval = setInterval(() => {
      busTickRef.current += 1;
      const cycle = wozniakBusCycle(
        busTickRef.current,
        phi2Steal,
        apple.videoPhaseDivisor,
        apple.dramBaseAddr,
        apple.dramAddrSpan,
        apple.dramAddrStride,
      );
      setClockPhase(cycle.phase);
      if (cycle.advanceRaster) setRasterLine((previous) => (previous + 1) % apple.rasterLineWrap);
      setDramAddress(cycle.dramAddress);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [
    isClockRunning,
    intervalMs,
    phi2Steal,
    apple.videoPhaseDivisor,
    apple.dramBaseAddr,
    apple.dramAddrSpan,
    apple.dramAddrStride,
    apple.rasterLineWrap,
  ]);

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-600 dark:text-amber-500 animate-pulse" />
            <h3 className="font-serif text-lg sm:text-xl font-bold text-ink-900 dark:text-parchment-100">
              Wozniak Shared-Bus DRAM Video Generator (US 4,136,359)
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-1">
            <TextWithLatex text="Wozniak’s breakthrough timing interleave: 6502 CPU accesses DRAM during Phase 1 ($\\Phi_1$), while Video Display logic fetches raster scanlines during Phase 2 ($\\Phi_2$) with " />
            <strong>zero bus contention and zero RAM refresh overhead</strong>.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsClockRunning(!isClockRunning)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 bg-white/80 dark:bg-ink-900/80 text-xs font-mono text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{isClockRunning ? "Pause Clock" : "Resume Clock"}</span>
        </button>
        <label className="flex items-center gap-2 text-[10px] font-mono text-ink-600 dark:text-ink-400">
          Steal Φ2
          <input
            type="range"
            min="0"
            max="0.9"
            step="0.05"
            aria-label="Steal phase-two video cycles"
            value={phi2Steal}
            onChange={(e) => updateParam("phi2Steal", Number(e.target.value))}
            className="w-24 accent-amber-600"
          />
        </label>
      </div>

      {/* Grid: 2D Bus Architecture Flow + Waveform */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Architecture Bus Multiplexer Diagram */}
        <div className="lg:col-span-2 relative bg-parchment-100/60 dark:bg-ink-900/60 rounded-xl border border-parchment-300 dark:border-ink-800 p-4 flex flex-col items-center justify-center min-h-[340px] overflow-hidden select-none">
          <div className="absolute top-3 left-3 text-[11px] font-mono text-ink-500 dark:text-ink-400 flex items-center gap-1.5">
            <Monitor className="w-3.5 h-3.5 text-amber-600" />
            <span>Multiplexed DRAM & NTSC Video Shifter Circuit</span>
          </div>

          <svg viewBox="0 0 420 280" className="w-full max-w-[500px] h-auto">
            {/* 6502 CPU Block */}
            <g transform="translate(30, 40)">
              <rect
                x="0"
                y="0"
                width="90"
                height="80"
                rx="6"
                className={`transition-colors duration-200 ${
                  clockPhase === 0
                    ? "fill-emerald-950/80 stroke-emerald-500 stroke-2 shadow-lg"
                    : "fill-slate-800/80 stroke-slate-600"
                }`}
              />
              <text
                x="45"
                y="35"
                textAnchor="middle"
                className="text-xs font-mono font-bold fill-white"
              >
                MOS 6502
              </text>
              <text
                x="45"
                y="55"
                textAnchor="middle"
                className="text-[10px] font-mono fill-emerald-400"
              >
                {apple.cpuClockMhz} MHz
              </text>
              <text
                x="45"
                y="70"
                textAnchor="middle"
                className="text-[8px] font-mono fill-slate-400"
              >
                {clockPhase === 0 ? "BUS MASTER" : "WAITING"}
              </text>
            </g>

            {/* Video Generator Timing State Machine */}
            <g transform="translate(30, 160)">
              <rect
                x="0"
                y="0"
                width="90"
                height="80"
                rx="6"
                className={`transition-colors duration-200 ${
                  clockPhase === 1
                    ? "fill-cyan-950/80 stroke-cyan-500 stroke-2 shadow-lg"
                    : "fill-slate-800/80 stroke-slate-600"
                }`}
              />
              <text
                x="45"
                y="35"
                textAnchor="middle"
                className="text-xs font-mono font-bold fill-white"
              >
                Video Logic
              </text>
              <text
                x="45"
                y="55"
                textAnchor="middle"
                className="text-[10px] font-mono fill-cyan-400"
              >
                Line {rasterLine}
              </text>
              <text
                x="45"
                y="70"
                textAnchor="middle"
                className="text-[8px] font-mono fill-slate-400"
              >
                {clockPhase === 1 ? "BUS MASTER" : "IDLE"}
              </text>
            </g>

            {/* 74LS157 Address Multiplexer Switch */}
            <g transform="translate(170, 95)">
              <rect
                x="0"
                y="0"
                width="80"
                height="90"
                rx="6"
                className="fill-amber-950/80 stroke-amber-500 stroke-2"
              />
              <text
                x="40"
                y="30"
                textAnchor="middle"
                className="text-[11px] font-mono font-bold fill-white"
              >
                74LS157
              </text>
              <text
                x="40"
                y="50"
                textAnchor="middle"
                className="text-[9px] font-mono fill-amber-400"
              >
                2:1 MUX
              </text>
              <text
                x="40"
                y="70"
                textAnchor="middle"
                className="text-[10px] font-mono font-bold fill-amber-300"
              >
                {clockPhase === 0 ? "Φ1 (CPU)" : "Φ2 (VID)"}
              </text>
            </g>

            {/* Dynamic RAM (4K/16K MK4096) */}
            <g transform="translate(300, 100)">
              <rect
                x="0"
                y="0"
                width="95"
                height="80"
                rx="6"
                className="fill-indigo-950/80 stroke-indigo-400 stroke-2"
              />
              <text
                x="47"
                y="32"
                textAnchor="middle"
                className="text-xs font-mono font-bold fill-white"
              >
                DRAM Array
              </text>
              <text
                x="47"
                y="50"
                textAnchor="middle"
                className="text-[10px] font-mono fill-indigo-300"
              >
                {dramAddress}
              </text>
              <text
                x="47"
                y="68"
                textAnchor="middle"
                className="text-[8px] font-mono fill-indigo-400"
              >
                Auto-Refreshed
              </text>
            </g>

            {/* Bus Lines connecting blocks */}
            {/* CPU to MUX */}
            <path
              d="M 120 80 L 170 120"
              fill="none"
              stroke={clockPhase === 0 ? "#10b981" : "#475569"}
              strokeWidth={clockPhase === 0 ? 3 : 1.5}
              strokeDasharray={clockPhase === 0 ? "none" : "3,3"}
            />
            {/* Video Logic to MUX */}
            <path
              d="M 120 200 L 170 160"
              fill="none"
              stroke={clockPhase === 1 ? "#06b6d4" : "#475569"}
              strokeWidth={clockPhase === 1 ? 3 : 1.5}
              strokeDasharray={clockPhase === 1 ? "none" : "3,3"}
            />
            {/* MUX to DRAM */}
            <path d="M 250 140 L 300 140" fill="none" stroke="#f59e0b" strokeWidth="3" />
          </svg>
        </div>

        {/* Phase Telemetry & NTSC Video Shifter Display */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white/90 dark:bg-ink-900/90 border border-parchment-300 dark:border-ink-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400">
                Phase Interleave Bus
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-parchment-100 dark:bg-ink-800/60 border border-parchment-200 dark:border-ink-700">
                <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
                  Master Clock
                </span>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  14.318 MHz
                </span>
                <span className="text-[10px] text-ink-500 block mt-0.5">÷14 = 1.023 MHz</span>
              </div>
              <div className="p-2.5 rounded-lg bg-parchment-100 dark:bg-ink-800/60 border border-parchment-200 dark:border-ink-700">
                <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
                  Active Phase
                </span>
                <span
                  className={`text-sm font-bold ${
                    clockPhase === 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-cyan-600 dark:text-cyan-400"
                  }`}
                >
                  {clockPhase === 0 ? "Φ1 (CPU Read/Write)" : "Φ2 (Video Shift)"}
                </span>
                <span className="text-[10px] text-ink-500 block mt-0.5">DRAM Free-Cycle</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-parchment-200 dark:border-ink-800 text-xs font-sans text-ink-700 dark:text-ink-300">
              <div className="flex justify-between">
                <span>DRAM Refresh Overhead:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  0% (Automatic)
                </span>
              </div>
              <div className="flex justify-between">
                <span>Color Burst Subcarrier:</span>
                <span className="font-mono font-bold">3.579545 MHz (NTSC)</span>
              </div>
            </div>
          </div>

          {/* Timing & Video Controls */}
          <div className="p-4 rounded-xl bg-white/90 dark:bg-ink-900/90 border border-parchment-300 dark:border-ink-800 shadow-sm space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400 block">
              Master Crystal Timing
            </span>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Master Quartz Crystal
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {crystalFreq.toFixed(3)} MHz
                </span>
              </div>
              <input
                type="range"
                aria-label="Master Quartz Crystal"
                min="10.0"
                max="18.0"
                step="0.1"
                value={crystalFreq}
                onChange={(e) => updateParam("crystalFreq", Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400 block pt-2 border-t border-parchment-200 dark:border-ink-800">
              Display & Color Matrix
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setColorMode("color")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors ${
                  colorMode === "color"
                    ? "bg-amber-600 text-white border-amber-700 font-bold"
                    : "bg-parchment-100 dark:bg-ink-800 text-ink-700 dark:text-parchment-300 border-parchment-300 dark:border-ink-700"
                }`}
              >
                Color Burst (High-Res)
              </button>
              <button
                type="button"
                onClick={() => setColorMode("monochrome")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors ${
                  colorMode === "monochrome"
                    ? "bg-amber-600 text-white border-amber-700 font-bold"
                    : "bg-parchment-100 dark:bg-ink-800 text-ink-700 dark:text-parchment-300 border-parchment-300 dark:border-ink-700"
                }`}
              >
                Monochrome Text (40x24)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
