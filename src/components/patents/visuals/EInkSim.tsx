"use client";

import { useEffect, useId, useRef, useState } from "react";
import { stepEInk } from "@/physics/eInkKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

interface EInkSimProps {
  initialVoltage?: number;
  initialViscosity?: number;
}

export function EInkSim({ initialVoltage = 15.0, initialViscosity = 2.0 }: EInkSimProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const voltageId = useId();
  const viscosityId = useId();

  const { params, updateParam } = usePatentPhysics("us-6120588-eink");
  const voltage = params.electrodeVoltageVolts ?? initialVoltage;
  const viscosity = params.fluidViscosityCp ?? initialViscosity;

  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Microcapsule particles simulation array
  const particlesRef = useRef<
    Array<{
      x: number;
      y: number; // -1 (bottom) to +1 (top)
      type: "white" | "black";
      vx: number;
      vy: number;
      size: number;
    }>
  >([]);

  if (particlesRef.current.length === 0) {
    const pts = [];
    // 35 white particles (positive charge)
    for (let i = 0; i < 35; i++) {
      pts.push({
        x: 0.1 + Math.random() * 0.8,
        y: -0.6 + Math.random() * 0.4,
        type: "white" as const,
        vx: 0,
        vy: 0,
        size: 7 + Math.random() * 3,
      });
    }
    // 35 black particles (negative charge)
    for (let i = 0; i < 35; i++) {
      pts.push({
        x: 0.1 + Math.random() * 0.8,
        y: 0.2 + Math.random() * 0.4,
        type: "black" as const,
        vx: 0,
        vy: 0,
        size: 7 + Math.random() * 3,
      });
    }
    particlesRef.current = pts;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let state = stepEInk({ electrodeVoltageVolts: voltage, fluidViscosityCp: viscosity }, 0.016);

    const render = () => {
      if (isPlaying) {
        state = stepEInk(
          { electrodeVoltageVolts: voltage, fluidViscosityCp: viscosity },
          0.016,
          state,
        );

        // Update particle positions based on electrophoretic mobility
        const vy = (voltage / 15.0) * (2.0 / viscosity) * 0.018;

        for (const p of particlesRef.current) {
          // White particles (+) move up if top is negative (voltage > 0)
          // Black particles (-) move down if top is negative
          const dir = p.type === "white" ? vy : -vy;
          p.y += dir + (Math.random() - 0.5) * 0.002; // Brownian motion perturbation
          p.y = Math.max(-0.88, Math.min(0.88, p.y));

          // Slight lateral Brownian drift constrained within capsule circle
          p.x += (Math.random() - 0.5) * 0.003;
          p.x = Math.max(0.12, Math.min(0.88, p.x));
        }
      }

      const w = canvas.width;
      const h = canvas.height;

      // Dark UI background
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
      ctx.fillText("E-INK MICROENCAPSULATED ELECTROPHORETIC DISPLAY", 20, 26);
      ctx.font = "11px monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(
        `US 6,120,588 • Stokes-Einstein Drift • Voltage: ${voltage > 0 ? "+" : ""}${voltage.toFixed(1)}V • Reflectance: ${state.surfaceReflectancePercent}% • Contrast: ${state.contrastRatio}`,
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

      // Top Transparent Viewing Electrode (ITO Film)
      ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
      ctx.fillRect(cX + 20, cY + 15, cW - 40, 16);
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(cX + 20, cY + 15, cW - 40, 16);

      ctx.fillStyle = "#e0f2fe";
      ctx.font = "bold 10px monospace";
      ctx.fillText("TOP TRANSPARENT CONDUCTING ITO ELECTRODE (VIEWING SURFACE)", cX + 30, cY + 27);

      // Bottom Addressable Pixel Electrode (Active Matrix TFT)
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
        `BOTTOM PIXEL ELECTRODE (${voltage > 0 ? `+${voltage.toFixed(1)}V ANODE` : voltage < 0 ? `${voltage.toFixed(1)}V CATHODE` : "0.0V BISTABLE OFF"})`,
        cX + 30,
        cY + cH - 23,
      );

      // Microcapsule Shells (50 micron polymer spheres)
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
            // Positively charged TiO2 White Particle
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
            // Negatively charged Carbon Black Particle
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

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [voltage, viscosity, isPlaying]);

  return (
    <div className="w-full flex flex-col gap-4 p-5 rounded-2xl bg-neutral-950 border border-neutral-800 text-neutral-100 shadow-xl">
      {/* Canvas */}
      <div className="relative w-full overflow-hidden rounded-xl border border-neutral-800 bg-[#090d16]">
        <canvas
          ref={canvasRef}
          width={760}
          height={340}
          className="w-full h-auto block aspect-[760/340]"
        />
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-neutral-900/70 border border-neutral-800/80 text-xs">
        {/* Driving Electrode Voltage */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between font-mono text-neutral-300">
            <label htmlFor={voltageId}>Driving Voltage (TFT Electrode):</label>
            <span className="text-amber-400 font-bold">
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
            className="w-full accent-amber-500 cursor-pointer"
          />
          <span className="text-[10px] text-neutral-500">
            +15V pulls white particles to top; -15V pulls black particles to top; 0V = bistable
            memory
          </span>
        </div>

        {/* Fluid Dynamic Viscosity */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between font-mono text-neutral-300">
            <label htmlFor={viscosityId}>Fluid Viscosity (Stokes Drag):</label>
            <span className="text-cyan-400 font-bold">{viscosity.toFixed(1)} cP</span>
          </div>
          <input
            id={viscosityId}
            type="range"
            min="0.5"
            max="5.0"
            step="0.1"
            value={viscosity}
            onChange={(e) => updateParam("fluidViscosityCp", parseFloat(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <span className="text-[10px] text-neutral-500">
            Higher fluid viscosity slows electrophoretic switching speed (Stokes drag)
          </span>
        </div>
      </div>

      {/* Quick State Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => updateParam("electrodeVoltageVolts", 15.0)}
            className="px-3 py-1.5 rounded-lg font-mono text-xs font-semibold bg-neutral-900 border border-neutral-700 text-neutral-200 hover:bg-neutral-800 hover:text-white transition-all"
          >
            ⚪ Switch White (+15V)
          </button>
          <button
            type="button"
            onClick={() => updateParam("electrodeVoltageVolts", -15.0)}
            className="px-3 py-1.5 rounded-lg font-mono text-xs font-semibold bg-neutral-900 border border-neutral-700 text-neutral-200 hover:bg-neutral-800 hover:text-white transition-all"
          >
            ⚫ Switch Black (-15V)
          </button>
          <button
            type="button"
            onClick={() => updateParam("electrodeVoltageVolts", 0.0)}
            className="px-3 py-1.5 rounded-lg font-mono text-xs font-semibold bg-emerald-950/60 border border-emerald-500/80 text-emerald-300 hover:bg-emerald-900/80 transition-all"
          >
            ⚡ Hold Zero Power (0V)
          </button>
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 rounded-lg font-mono text-xs font-semibold bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>
        </div>

        <span className="text-[11px] font-mono text-neutral-400">
          Carrier Kinetics: <span className="text-indigo-400">Stokes-Einstein Mobility</span>
        </span>
      </div>
    </div>
  );
}
