"use client";

import { RotateCcw, Volume2, VolumeX } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { stepKilbyIntegratedCircuit } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";

interface KilbySimProps {
  className?: string;
}

export const KilbyIntegratedCircuitSim: React.FC<KilbySimProps> = ({ className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { params, updateParam, resetParams } = usePatentPhysics(
    "us-3138743-kilby-integrated-circuit",
  );
  const { isAudioMuted, toggleSound } = usePatentAudio();

  const [activeCircuitMode, setActiveCircuitMode] = useState<"flipflop" | "oscillator">("flipflop");
  const [clockState, setClockState] = useState<boolean>(false);

  const supplyVoltage = params.supplyVoltageV ?? 6.0;
  const resistorLength = params.resistorLengthUm ?? 500;
  const resistorWidth = params.resistorWidthUm ?? 50;
  const reverseBias = params.reverseBiasVoltageV ?? 3.0;
  const baseDrive = params.baseDriveCurrentUa ?? 40;

  const simState = stepKilbyIntegratedCircuit({
    substrateMaterial: "germanium",
    supplyVoltageV: supplyVoltage,
    resistorLengthUm: resistorLength,
    resistorWidthUm: resistorWidth,
    reverseBiasVoltageV: reverseBias,
    baseDriveCurrentUa: baseDrive,
  });

  useEffect(() => {
    let animationFrameId: number;
    let time = 0;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      time += 0.03;

      // Dark solid-state blueprint/museum background
      ctx.fillStyle = "#090d16";
      ctx.fillRect(0, 0, width, height);

      // Subtle engineering coordinate grid
      ctx.strokeStyle = "rgba(59, 130, 246, 0.08)";
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Title & Architecture Banner
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "bold 13px 'JetBrains Mono', monospace";
      ctx.fillText("TEXAS INSTRUMENTS — JACK KILBY MONOLITHIC SOLID CIRCUIT (1958/1964)", 20, 26);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.fillText(
        `MODE: ${activeCircuitMode.toUpperCase()} | GERMANIUM DIE: 0.200" × 0.080" | V_CC: ${supplyVoltage}V`,
        20,
        42,
      );

      // Draw Monolithic Germanium Die
      const dieX = width * 0.12;
      const dieY = height * 0.18;
      const dieW = width * 0.76;
      const dieH = height * 0.44;

      // Die metallic ground plate
      ctx.fillStyle = "#1e293b";
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 2;
      ctx.fillRect(dieX - 8, dieY - 8, dieW + 16, dieH + 16);
      ctx.strokeRect(dieX - 8, dieY - 8, dieW + 16, dieH + 16);

      // Germanium Crystalline Substrate
      const gradGe = ctx.createLinearGradient(dieX, dieY, dieX, dieY + dieH);
      gradGe.addColorStop(0, "#334155");
      gradGe.addColorStop(0.5, "#1e293b");
      gradGe.addColorStop(1, "#0f172a");
      ctx.fillStyle = gradGe;
      ctx.fillRect(dieX, dieY, dieW, dieH);
      ctx.strokeStyle = "#0ea5e9";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(dieX, dieY, dieW, dieH);

      // Component Mesas on the Die
      // 1. Resistor Mesa 1 (Collector Load R1)
      const r1X = dieX + dieW * 0.08;
      const r1Y = dieY + dieH * 0.2;
      const r1W = dieW * 0.2;
      const r1H = dieH * 0.22;

      ctx.fillStyle = "#1e1b4b";
      ctx.strokeStyle = "#818cf8";
      ctx.lineWidth = 1.5;
      ctx.fillRect(r1X, r1Y, r1W, r1H);
      ctx.strokeRect(r1X, r1Y, r1W, r1H);

      // Serpentine path inside Resistor R1
      ctx.strokeStyle = "#a5b4fc";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(r1X + 8, r1Y + 8);
      ctx.lineTo(r1X + r1W - 8, r1Y + 8);
      ctx.lineTo(r1X + r1W - 8, r1Y + r1H / 2);
      ctx.lineTo(r1X + 8, r1Y + r1H / 2);
      ctx.lineTo(r1X + 8, r1Y + r1H - 8);
      ctx.lineTo(r1X + r1W - 8, r1Y + r1H - 8);
      ctx.stroke();

      // R1 Text
      ctx.fillStyle = "#c7d2fe";
      ctx.font = "bold 10px 'JetBrains Mono', monospace";
      ctx.fillText(`R1: ${simState.collectorLoadResistanceOhms}Ω`, r1X + 10, r1Y + r1H + 16);

      // 2. Active Mesa Transistor T1
      const t1X = dieX + dieW * 0.35;
      const t1Y = dieY + dieH * 0.15;
      const t1W = dieW * 0.14;
      const t1H = dieH * 0.32;

      // Collector base mesa
      ctx.fillStyle = "#064e3b";
      ctx.strokeStyle = "#34d399";
      ctx.fillRect(t1X, t1Y, t1W, t1H);
      ctx.strokeRect(t1X, t1Y, t1W, t1H);

      // Diffused base stripe
      ctx.fillStyle = "#047857";
      ctx.fillRect(t1X + 6, t1Y + 6, t1W - 12, t1H * 0.45);

      // Emitter alloyed dot
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(t1X + t1W / 2, t1Y + t1H * 0.25, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#6ee7b7";
      ctx.font = "bold 10px 'JetBrains Mono', monospace";
      ctx.fillText("T1 (Mesa BJT)", t1X, t1Y + t1H + 16);

      // 3. P-N Junction Capacitor C1
      const c1X = dieX + dieW * 0.54;
      const c1Y = dieY + dieH * 0.2;
      const c1W = dieW * 0.15;
      const c1H = dieH * 0.24;

      ctx.fillStyle = "#701a75";
      ctx.strokeStyle = "#e879f9";
      ctx.fillRect(c1X, c1Y, c1W, c1H);
      ctx.strokeRect(c1X, c1Y, c1W, c1H);

      // Depletion zone gap
      const depW = Math.min(c1W - 12, Math.max(4, simState.depletionWidthUm * 4));
      ctx.fillStyle = "#3b0764";
      ctx.fillRect(c1X + (c1W - depW) / 2, c1Y + 4, depW, c1H - 8);

      ctx.fillStyle = "#f5d0fe";
      ctx.font = "bold 10px 'JetBrains Mono', monospace";
      ctx.fillText(`C1: ${simState.junctionCapacitancePf}pF`, c1X + 4, c1Y + c1H + 16);

      // 4. Active Mesa Transistor T2 / Output Resistor R2
      const t2X = dieX + dieW * 0.75;
      const t2Y = dieY + dieH * 0.15;
      const t2W = dieW * 0.14;
      const t2H = dieH * 0.32;

      ctx.fillStyle = "#064e3b";
      ctx.strokeStyle = "#34d399";
      ctx.fillRect(t2X, t2Y, t2W, t2H);
      ctx.strokeRect(t2X, t2Y, t2W, t2H);

      ctx.fillStyle = "#047857";
      ctx.fillRect(t2X + 6, t2Y + 6, t2W - 12, t2H * 0.45);

      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(t2X + t2W / 2, t2Y + t2H * 0.25, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#6ee7b7";
      ctx.font = "bold 10px 'JetBrains Mono', monospace";
      ctx.fillText("T2 (Mesa BJT)", t2X, t2Y + t2H + 16);

      // Gold Flying Wire Bonds (Thermal compression bonded leads)
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2.5;

      // Wire 1: R1 to T1 Collector
      ctx.beginPath();
      ctx.moveTo(r1X + r1W, r1Y + r1H / 2);
      ctx.quadraticCurveTo((r1X + r1W + t1X) / 2, dieY - 15, t1X + 10, t1Y + 10);
      ctx.stroke();

      // Wire 2: T1 Collector to C1
      ctx.beginPath();
      ctx.moveTo(t1X + t1W - 8, t1Y + 10);
      ctx.quadraticCurveTo((t1X + t1W + c1X) / 2, dieY - 20, c1X + 8, c1Y + c1H / 2);
      ctx.stroke();

      // Wire 3: C1 to T2 Base
      ctx.beginPath();
      ctx.moveTo(c1X + c1W - 8, c1Y + c1H / 2);
      ctx.quadraticCurveTo((c1X + c1W + t2X) / 2, dieY - 15, t2X + t2W / 2, t2Y + t2H * 0.25);
      ctx.stroke();

      // Gold bond contact balls
      ctx.fillStyle = "#fbbf24";
      const bondPoints = [
        [r1X + r1W, r1Y + r1H / 2],
        [t1X + 10, t1Y + 10],
        [t1X + t1W - 8, t1Y + 10],
        [c1X + 8, c1Y + c1H / 2],
        [c1X + c1W - 8, c1Y + c1H / 2],
        [t2X + t2W / 2, t2Y + t2H * 0.25],
      ];
      for (const [bx, by] of bondPoints) {
        ctx.beginPath();
        ctx.arc(bx, by, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Dynamic Signal Pulse along Gold Wire Bonds
      const oscPhase =
        activeCircuitMode === "oscillator"
          ? Math.sin(time * simState.switchingDisplayOmegaRadPerS)
          : clockState
            ? 1
            : -1;
      const pulsePos = (time * simState.bondPulseAdvance) % 1;
      const ppx = r1X + r1W + (t2X - r1X) * pulsePos;
      const ppy = dieY - 15 + Math.sin(pulsePos * Math.PI) * -10;

      ctx.fillStyle = oscPhase > 0 ? "#38bdf8" : "#f43f5e";
      ctx.shadowColor = oscPhase > 0 ? "#38bdf8" : "#f43f5e";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(ppx, ppy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Bottom Telemetry Dashboard Cards
      const cardY = height * 0.7;
      const cardW = width * 0.18;
      const cardH = height * 0.24;
      const gap = width * 0.02;
      const startX = width * 0.04;

      const metrics = [
        {
          label: "BULK RESISTOR",
          val: `${simState.collectorLoadResistanceOhms} Ω`,
          sub: `L/W = ${(resistorLength / resistorWidth).toFixed(1)} sq`,
          color: "#818cf8",
        },
        {
          label: "P-N CAPACITOR",
          val: `${simState.junctionCapacitancePf} pF`,
          sub: `W_dep = ${simState.depletionWidthUm} µm`,
          color: "#e879f9",
        },
        {
          label: "COLLECTOR V_OUT",
          val: `${simState.collectorVoltageV} V`,
          sub: `I_c = ${simState.collectorCurrentMa} mA`,
          color: "#34d399",
        },
        {
          label: "PROP. DELAY",
          val: `${simState.propagationDelayNs} ns`,
          sub: `f_max = ${simState.maxClockFrequencyMhz} MHz`,
          color: "#38bdf8",
        },
        {
          label: "PACKING DENSITY",
          val: `${(simState.componentDensityPerCuFt / 1e6).toFixed(1)}M`,
          sub: "parts / cu. ft.",
          color: "#f59e0b",
        },
      ];

      metrics.forEach((m, idx) => {
        const cx = startX + idx * (cardW + gap);
        ctx.fillStyle = "#111827";
        ctx.strokeStyle = m.color;
        ctx.lineWidth = 1.2;
        ctx.fillRect(cx, cardY, cardW, cardH);
        ctx.strokeRect(cx, cardY, cardW, cardH);

        ctx.fillStyle = "#9ca3af";
        ctx.font = "9px 'JetBrains Mono', monospace";
        ctx.fillText(m.label, cx + 10, cardY + 18);

        ctx.fillStyle = m.color;
        ctx.font = "bold 14px 'JetBrains Mono', monospace";
        ctx.fillText(m.val, cx + 10, cardY + 40);

        ctx.fillStyle = "#6b7280";
        ctx.font = "9px 'JetBrains Mono', monospace";
        ctx.fillText(m.sub, cx + 10, cardY + 58);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [simState, activeCircuitMode, clockState, supplyVoltage, resistorLength, resistorWidth]);

  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors ${className}`}
    >
      {/* Header with Title and Global Action Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
            Jack Kilby Miniaturized Electronic Circuit (US 3,138,743)
          </h3>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400">
            Monolithic semiconductor integrated circuit: bulk germanium resistors, P-N junction
            capacitors, and mesa transistors.
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
              resetParams();
              setActiveCircuitMode("flipflop");
              setClockState(false);
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

      <div className="w-full flex flex-wrap justify-between items-center gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-semibold uppercase tracking-wider">
            Architecture:
          </span>
          <button
            type="button"
            onClick={() => {
              setActiveCircuitMode("flipflop");
              soundEngine.playSwitchClick();
            }}
            className={`px-3 py-1 text-xs font-mono rounded-lg border transition-colors ${
              activeCircuitMode === "flipflop"
                ? "bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border-cyan-400 dark:border-cyan-500"
                : "bg-parchment-100 dark:bg-slate-900 text-ink-700 dark:text-slate-400 border-parchment-300 dark:border-slate-700 hover:text-ink-900 dark:hover:text-slate-200"
            }`}
          >
            Bistable Multivibrator (Fig. 7)
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveCircuitMode("oscillator");
              soundEngine.playSwitchClick();
            }}
            className={`px-3 py-1 text-xs font-mono rounded-lg border transition-colors ${
              activeCircuitMode === "oscillator"
                ? "bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border-purple-400 dark:border-purple-500"
                : "bg-parchment-100 dark:bg-slate-900 text-ink-700 dark:text-slate-400 border-parchment-300 dark:border-slate-700 hover:text-ink-900 dark:hover:text-slate-200"
            }`}
          >
            Phase-Shift Oscillator (Fig. 11)
          </button>
        </div>

        {activeCircuitMode === "flipflop" && (
          <button
            type="button"
            onClick={() => {
              setClockState((prev) => !prev);
              soundEngine.playSwitchClick();
            }}
            className="px-3 py-1 text-xs font-mono rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-400 dark:border-emerald-500 hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-colors"
          >
            Trigger Flip-Flop (Toggle Q)
          </button>
        )}
      </div>

      <canvas
        ref={canvasRef}
        width={820}
        height={480}
        className="w-full max-w-4xl h-auto rounded-lg border border-slate-800 shadow-2xl bg-slate-950"
      />

      <div className="w-full max-w-4xl mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
          <label
            htmlFor="supply-voltage"
            className="text-[11px] font-mono text-slate-400 block mb-1"
          >
            Supply Voltage (+Vcc): {supplyVoltage}V
          </label>
          <input
            id="supply-voltage"
            type="range"
            min="1.5"
            max="12.0"
            step="0.5"
            value={supplyVoltage}
            onChange={(e) => updateParam("supplyVoltageV", parseFloat(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>

        <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
          <label
            htmlFor="resistor-length"
            className="text-[11px] font-mono text-slate-400 block mb-1"
          >
            Resistor Aspect L: {resistorLength}µm
          </label>
          <input
            id="resistor-length"
            type="range"
            min="100"
            max="2000"
            step="50"
            value={resistorLength}
            onChange={(e) => updateParam("resistorLengthUm", parseFloat(e.target.value))}
            className="w-full accent-indigo-400"
          />
        </div>

        <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
          <label htmlFor="reverse-bias" className="text-[11px] font-mono text-slate-400 block mb-1">
            Capacitor Bias V_R: {reverseBias}V
          </label>
          <input
            id="reverse-bias"
            type="range"
            min="0.5"
            max="10.0"
            step="0.5"
            value={reverseBias}
            onChange={(e) => updateParam("reverseBiasVoltageV", parseFloat(e.target.value))}
            className="w-full accent-fuchsia-400"
          />
        </div>

        <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
          <label htmlFor="base-drive" className="text-[11px] font-mono text-slate-400 block mb-1">
            Base Drive: {baseDrive}µA
          </label>
          <input
            id="base-drive"
            type="range"
            min="5"
            max="150"
            step="5"
            value={baseDrive}
            onChange={(e) => updateParam("baseDriveCurrentUa", parseFloat(e.target.value))}
            className="w-full accent-emerald-400"
          />
        </div>
      </div>
    </div>
  );
};
