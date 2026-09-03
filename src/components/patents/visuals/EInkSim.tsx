"use client";

import { Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import {
  readEInkRuntimeControls,
  readEInkTapeFrame,
  resetEInkTape,
} from "@/physics/eInkSharedKernel";
import { usePatentRuntimeTick } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";
import { useOffscreenGate } from "./useOffscreenGate";

interface EInkSimProps {
  initialVoltage?: number;
  initialViscosity?: number;
}

type EInkParticle = {
  index: number;
  restX: number;
  x: number;
  y: number; // -1 (bottom) to +1 (top)
  type: "white" | "black";
  size: number;
};

function createEInkParticles(): EInkParticle[] {
  const unitHash = (index: number, salt: number) => {
    const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
    return value - Math.floor(value);
  };
  const particles: EInkParticle[] = [];

  for (let index = 0; index < 35; index++) {
    const restX = (index % 2 === 0 ? 0.25 : 0.75) + (unitHash(index, 1) - 0.5) * 0.16;
    particles.push({
      index,
      restX,
      x: restX,
      y: 0.8,
      type: "white",
      size: 7 + unitHash(index, 3) * 3,
    });
  }

  for (let index = 0; index < 35; index++) {
    const particleIndex = index + 35;
    const restX = (index % 2 === 0 ? 0.25 : 0.75) + (unitHash(particleIndex, 1) - 0.5) * 0.16;
    particles.push({
      index: particleIndex,
      restX,
      x: restX,
      y: -0.8,
      type: "black",
      size: 7 + unitHash(particleIndex, 3) * 3,
    });
  }

  return particles;
}

export function EInkSim({ initialVoltage = 15.0, initialViscosity = 2.0 }: EInkSimProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { rootRef, onscreenRef } = useOffscreenGate<HTMLDivElement>();
  const voltageId = useId();
  const viscosityId = useId();

  const { params, updateParam, resetParams } = usePatentPhysics("us-6120588-eink");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const controls = readEInkRuntimeControls({
    electrodeVoltageVolts: params.electrodeVoltageVolts ?? initialVoltage,
    fluidViscosityCp: params.fluidViscosityCp ?? initialViscosity,
    particleChargeCoupled: params.particleChargeCoupled ?? 1,
    running: (params.isRunning ?? 1) > 0,
  });
  const voltage = controls.electrodeVoltageVolts;
  const viscosity = controls.fluidViscosityCp;
  usePatentRuntimeTick("us-6120588-eink", 1);
  const { state, simTimeSec } = readEInkTapeFrame(controls);
  const isPlaying = controls.running;

  // Microcapsule particles. Layout is an electrophoretic suspension distribution.
  const particlesRef = useRef<EInkParticle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (particlesRef.current.length === 0) {
      particlesRef.current = createEInkParticles();
    }

    const render = () => {
      if (!onscreenRef.current) return;

      // Both faces project the same kernel Y at the same tape time. Thermal
      // jitter drains the kernel's viscosity-dependent Stokes-Einstein rate.
      for (const p of particlesRef.current) {
        const targetY = p.type === "white" ? state.whiteParticleNormY : state.blackParticleNormY;
        const jitterY =
          Math.sin(p.index * 5.1 + simTimeSec * state.brownianJitterOmegaYRadPerS) * 0.04;
        p.y = Math.max(-0.88, Math.min(0.88, targetY + jitterY));
        p.x =
          p.restX + Math.cos(p.index * 4.3 + simTimeSec * state.brownianJitterOmegaXRadPerS) * 0.02;
        p.x = Math.max(0.12, Math.min(0.88, p.x));
      }

      const w = canvas.width;
      const h = canvas.height;

      // Dark UI background
      ctx.fillStyle = "#0a0f1d";
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
      ctx.fillText("E-INK MICROENCAPSULATED ELECTROPHORETIC DISPLAY", 20, 26);
      ctx.font = "11px monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(
        `US 6,120,588 • Modeled Electrophoretic Drift • Field: ${state.electricFieldVperUm.toFixed(2)} V/μm • Illustrative response: ${state.surfaceReflectancePercent}%`,
        20,
        42,
      );

      // ========================================================
      // 1. DUAL 50μm MICROCAPSULE CHAMBERS (Left/Center: x: 40 to 480, y: 65 to 325)
      // ========================================================
      const cX = 40;
      const cY = 65;
      const cW = 440;
      const cH = 260;

      // Top transparent electrode 100 (source Fig. 3 top-to-bottom embodiment)
      ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
      ctx.fillRect(cX + 20, cY + 15, cW - 40, 16);
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(cX + 20, cY + 15, cW - 40, 16);

      ctx.fillStyle = "#e0f2fe";
      ctx.font = "bold 10px monospace";
      ctx.fillText("TOP CLEAR ELECTRODE 100 (VIEWING SURFACE)", cX + 30, cY + 27);

      // Bottom electrode 110 (source Fig. 3 top-to-bottom embodiment)
      const bColor =
        voltage > 0
          ? "rgba(239, 68, 68, 0.3)"
          : voltage < 0
            ? "rgba(59, 130, 246, 0.3)"
            : "rgba(100, 116, 139, 0.3)";
      const bBorder = voltage > 0 ? "#ef4444" : voltage < 0 ? "#3b82f6" : "#64748b";

      ctx.fillStyle = bColor;
      ctx.fillRect(cX + 20, cY + cH - 35, cW - 40, 16);
      ctx.strokeStyle = bBorder;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(cX + 20, cY + cH - 35, cW - 40, 16);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "bold 10px monospace";
      ctx.fillText(
        `BOTTOM ELECTRODE 110 (${voltage > 0 ? `+${voltage.toFixed(1)}V` : voltage < 0 ? `${voltage.toFixed(1)}V` : "0.0V"})`,
        cX + 30,
        cY + cH - 23,
      );

      // Microcapsule shells 120 (the grant does not prescribe a single size)
      const caps = [
        { cx: cX + 130, cy: cY + cH / 2, r: 85 },
        { cx: cX + 310, cy: cY + cH / 2, r: 85 },
      ];

      for (const cap of caps) {
        // Dielectric clear fluid gradient
        const fluidGrad = ctx.createRadialGradient(cap.cx, cap.cy, 10, cap.cx, cap.cy, cap.r);
        fluidGrad.addColorStop(0, "rgba(30, 41, 59, 0.6)");
        fluidGrad.addColorStop(1, "rgba(15, 23, 42, 0.9)");

        ctx.fillStyle = fluidGrad;
        ctx.beginPath();
        ctx.arc(cap.cx, cap.cy, cap.r, 0, Math.PI * 2);
        ctx.fill();

        // Polymer Shell Wall
        ctx.strokeStyle = "rgba(251, 191, 36, 0.8)";
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Draw Colloidal Particles inside capsules
      for (const p of particlesRef.current) {
        // Map normalized x, y to left or right capsule
        const cap = p.x < 0.5 ? caps[0] : caps[1];
        const localX = (p.x < 0.5 ? p.x * 2.0 : (p.x - 0.5) * 2.0) - 0.5;
        const px = cap.cx + localX * 130;
        const py = cap.cy - p.y * 65;

        // Check if inside circle
        const dist = Math.hypot(px - cap.cx, py - cap.cy);
        if (dist < cap.r - 8) {
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);

          if (p.type === "white") {
            // Positively charged particle (one source embodiment)
            ctx.fillStyle = "#ffffff";
            ctx.strokeStyle = "#94a3b8";
            ctx.lineWidth = 1;
            ctx.fill();
            ctx.stroke();

            // Tiny '+' symbol
            ctx.fillStyle = "#3b82f6";
            ctx.font = "bold 8px monospace";
            ctx.fillText("+", px - 3, py + 3);
          } else {
            // Negatively charged particle (one source embodiment)
            ctx.fillStyle = "#18181b";
            ctx.strokeStyle = "#475569";
            ctx.lineWidth = 1;
            ctx.fill();
            ctx.stroke();

            // Tiny '-' symbol
            ctx.fillStyle = "#f87171";
            ctx.font = "bold 8px monospace";
            ctx.fillText("-", px - 2, py + 3);
          }
        }
      }

      // ========================================================
      // 2. OPTICAL TELEMETRY & BISTABLE GAUGE (Right Pane: x: 505 to 740, y: 65 to 325)
      // ========================================================
      const gX = 505;
      const gY = 65;
      const gW = 235;
      const gH = 260;

      ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(gX, gY, gW, gH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 11px system-ui, sans-serif";
      ctx.fillText("OPTICAL SPECTRAL TELEMETRY", gX + 12, gY + 22);

      // Live Reflective Sample Swatch
      const refl = state.surfaceReflectancePercent / 100;
      const swatchCol = Math.round(15 + refl * 225);
      ctx.fillStyle = `rgb(${swatchCol}, ${swatchCol}, ${swatchCol})`;
      ctx.fillRect(gX + 15, gY + 36, gW - 30, 48);
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(gX + 15, gY + 36, gW - 30, 48);

      ctx.fillStyle = refl > 0.4 ? "#0f172a" : "#f8fafc";
      ctx.font = "bold 11px monospace";
      ctx.fillText(
        `APPARENT STATE: ${refl > 0.4 ? "REFLECTIVE (WHITE)" : "ABSORPTIVE (BLACK)"}`,
        gX + 22,
        gY + 65,
      );

      // Gauge Readouts
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px monospace";
      ctx.fillText("E-Field Across Gap:", gX + 15, gY + 110);
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 11px monospace";
      ctx.fillText(`${state.electricFieldVperUm.toFixed(2)} V/µm`, gX + 15, gY + 125);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px monospace";
      ctx.fillText("Colloidal Drift Speed:", gX + 15, gY + 150);
      ctx.fillStyle = "#34d399";
      ctx.font = "bold 11px monospace";
      ctx.fillText(`${state.driftVelocityMms.toFixed(2)} mm/s`, gX + 15, gY + 165);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px monospace";
      ctx.fillText("Contrast Ratio:", gX + 15, gY + 190);
      ctx.fillStyle = "#f59e0b";
      ctx.font = "bold 12px monospace";
      ctx.fillText(state.contrastRatio, gX + 15, gY + 205);

      // Bistable Zero-Power Indicator
      const isZeroPower = Math.abs(voltage) < 0.1;
      ctx.fillStyle = isZeroPower ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.15)";
      ctx.fillRect(gX + 15, gY + 220, gW - 30, 26);
      ctx.strokeStyle = isZeroPower ? "#10b981" : "#ef4444";
      ctx.strokeRect(gX + 15, gY + 220, gW - 30, 26);

      ctx.fillStyle = isZeroPower ? "#34d399" : "#fca5a5";
      ctx.font = "bold 9px monospace";
      ctx.fillText(
        isZeroPower ? "⚡ BISTABLE: 0.0 W POWER DRAIN" : "⚡ ACTIVE: DRAWING SWITCHING CURRENT",
        gX + 20,
        gY + 236,
      );
    };

    render();
  }, [simTimeSec, state, voltage, onscreenRef]);

  return (
    <div
      ref={rootRef}
      className="w-full flex flex-col gap-4 p-4 sm:p-6 rounded-2xl bg-parchment-50 dark:bg-ink-950 border border-parchment-300 dark:border-ink-800 text-ink-900 dark:text-parchment-100 shadow-md"
    >
      {/* Header with Title and Global Action Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
            Electrophoretic E-Ink Display (US 6,120,588)
          </h3>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400">
            Source-bounded electrophoretic embodiment: oppositely charged particles in a
            microcapsule migrate toward the viewing surface according to field polarity.
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
              updateParam("isRunning", isPlaying ? 0 : 1);
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
              resetEInkTape();
              resetParams();
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
      <div className="relative w-full overflow-hidden rounded-xl border border-parchment-300 dark:border-ink-800 bg-canvas">
        <canvas
          ref={canvasRef}
          width={760}
          height={340}
          className="w-full h-auto block aspect-[760/340]"
        />
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-parchment-100/80 dark:bg-ink-900/70 border border-parchment-200 dark:border-ink-800/80 text-xs">
        {/* Driving Electrode Voltage */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between font-mono text-ink-700 dark:text-parchment-300">
            <label htmlFor={voltageId}>Applied Field (source electrodes 100/110):</label>
            <span className="text-amber-600 dark:text-amber-400 font-bold">
              {voltage > 0 ? "+" : ""}
              {voltage.toFixed(1)} V
            </span>
          </div>
          <input
            id={voltageId}
            type="range"
            min="-15.0"
            max="15.0"
            step="1.0"
            value={voltage}
            onChange={(e) => updateParam("electrodeVoltageVolts", parseFloat(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-500">
            This exhibit uses a bounded ±15 V control for the modeled field; the grant does not
            prescribe this drive voltage or a single pigment pair.
          </span>
        </div>

        {/* Fluid Dynamic Viscosity */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between font-mono text-ink-700 dark:text-parchment-300">
            <label htmlFor={viscosityId}>Fluid Viscosity (Stokes Drag):</label>
            <span className="text-cyan-600 dark:text-cyan-400 font-bold">
              {viscosity.toFixed(1)} cP
            </span>
          </div>
          <input
            id={viscosityId}
            type="range"
            min="0.5"
            max="5.0"
            step="0.1"
            value={viscosity}
            onChange={(e) => updateParam("fluidViscosityCp", parseFloat(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-500">
            Higher fluid viscosity slows electrophoretic switching speed (Stokes drag)
          </span>
        </div>
      </div>

      {/* Quick State Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              updateParam("electrodeVoltageVolts", 15.0);
              soundEngine.playSwitchClick();
            }}
            className="px-3 py-1.5 rounded-lg font-mono text-xs font-semibold bg-parchment-100 dark:bg-ink-900 border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-200 hover:bg-parchment-200 dark:hover:bg-neutral-800 hover:text-ink-900 dark:hover:text-white transition-colors"
          >
            ⚪ Positive field
          </button>
          <button
            type="button"
            onClick={() => {
              updateParam("electrodeVoltageVolts", -15.0);
              soundEngine.playSwitchClick();
            }}
            className="px-3 py-1.5 rounded-lg font-mono text-xs font-semibold bg-parchment-100 dark:bg-ink-900 border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-200 hover:bg-parchment-200 dark:hover:bg-neutral-800 hover:text-ink-900 dark:hover:text-white transition-colors"
          >
            ⚫ Negative field
          </button>
          <button
            type="button"
            onClick={() => {
              updateParam("electrodeVoltageVolts", 0.0);
              soundEngine.playSwitchClick();
            }}
            className="px-3 py-1.5 rounded-lg font-mono text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-400 dark:border-emerald-500/80 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/80 transition-colors"
          >
            ⚡ Field off (0V)
          </button>
        </div>

        <span className="text-[11px] font-mono text-ink-500 dark:text-ink-400">
          Carrier Kinetics:{" "}
          <span className="text-indigo-600 dark:text-indigo-400">Stokes-Einstein Mobility</span>
        </span>
      </div>
    </div>
  );
}
