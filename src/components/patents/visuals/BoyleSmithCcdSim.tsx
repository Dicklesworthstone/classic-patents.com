"use client";

import { Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepBoyleSmithCcd } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";

interface BoyleSmithCcdSimProps {
  interactive?: boolean;
}

export function BoyleSmithCcdSim({ interactive = true }: BoyleSmithCcdSimProps) {
  const { params, updateParam, resetParams } = usePatentPhysics("us-3858232-boyle-smith-ccd");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);

  const gateVoltage = params.gateVoltageV ?? 10;
  const clockFreq = params.clockFrequencyMhz ?? 5.0;
  const incidentLux = params.incidentLux ?? 250;
  const integrationTime = params.integrationTimeMs ?? 16.7;
  const temperature = params.temperatureKelvin ?? 300;

  const metrics = stepBoyleSmithCcd({
    gateVoltageV: gateVoltage,
    clockFrequencyMhz: clockFreq,
    incidentLux,
    integrationTimeMs: integrationTime,
    temperatureKelvin: temperature,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let clockPhase = 0;

    const render = () => {
      if (isRunning) {
        clockPhase = (clockPhase + 0.05 * (clockFreq / 5.0)) % (Math.PI * 2);
      }

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

      // Title
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "bold 14px 'JetBrains Mono', monospace";
      ctx.fillText("US 3,858,232 — BOYLE & SMITH CHARGE-COUPLED DEVICE (1974)", 24, 28);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "11px Inter, sans-serif";
      ctx.fillText(
        "3-Phase MOS Potential Well Shift Register • Optical Integration • Single-Conductivity Channel • >99.999% CTE",
        24,
        46,
      );

      // Main Device Cross-Section Layout
      const devX = 40;
      const devY = 70;
      const devW = w - 80;
      const devH = 220;

      // 1. P-Type Silicon Substrate (p-Si)
      const subY = devY + 70;
      const subH = devH - 70;
      const subGrad = ctx.createLinearGradient(devX, subY, devX, subY + subH);
      subGrad.addColorStop(0, "#1e293b");
      subGrad.addColorStop(1, "#0f172a");
      ctx.fillStyle = subGrad;
      ctx.fillRect(devX, subY, devW, subH);

      ctx.fillStyle = "#64748b";
      ctx.font = "bold 11px monospace";
      ctx.fillText(
        "p-Type Silicon Substrate (10 Ω·cm, Na = 10^15 cm^-3)",
        devX + 16,
        subY + subH - 16,
      );

      // 2. SiO2 Gate Dielectric (1200 Å)
      const oxY = subY - 14;
      const oxH = 14;
      ctx.fillStyle = "rgba(56, 189, 248, 0.4)";
      ctx.strokeStyle = "rgba(56, 189, 248, 0.7)";
      ctx.lineWidth = 1;
      ctx.fillRect(devX, oxY, devW, oxH);
      ctx.strokeRect(devX, oxY, devW, oxH);

      ctx.fillStyle = "#38bdf8";
      ctx.font = "9px monospace";
      ctx.fillText("Thermal SiO2 Insulator (1,200 Å)", devX + 16, oxY - 4);

      // 3. Three-Phase Gate Electrodes (Phi 1, Phi 2, Phi 3)
      const numStages = 4;
      const totalGates = numStages * 3;
      const gateW = (devW - 80) / totalGates;
      const gateH = 22;
      const gateStartY = oxY - gateH;

      // 3-Phase Clocks instantaneous voltages
      const phi1_V = gateVoltage * 0.5 * (1 + Math.sin(clockPhase));
      const phi2_V = gateVoltage * 0.5 * (1 + Math.sin(clockPhase - (2 * Math.PI) / 3));
      const phi3_V = gateVoltage * 0.5 * (1 + Math.sin(clockPhase - (4 * Math.PI) / 3));

      const gateVoltages = [phi1_V, phi2_V, phi3_V];
      const gateColors = ["#38bdf8", "#34d399", "#f43f5e"];

      for (let i = 0; i < totalGates; i++) {
        const gx = devX + 40 + i * gateW;
        const phaseIdx = i % 3;
        const v = gateVoltages[phaseIdx];
        const color = gateColors[phaseIdx];

        // Gate electrode block
        ctx.fillStyle = v > gateVoltage * 0.5 ? color : "#334155";
        ctx.fillRect(gx + 2, gateStartY, gateW - 4, gateH);
        ctx.strokeStyle = "#475569";
        ctx.strokeRect(gx + 2, gateStartY, gateW - 4, gateH);

        // Gate label
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 9px monospace";
        ctx.fillText(`Φ${phaseIdx + 1}`, gx + gateW / 2 - 6, gateStartY + 14);

        // Clock pulse voltage indicator
        ctx.fillStyle = v > gateVoltage * 0.5 ? color : "#94a3b8";
        ctx.font = "8px monospace";
        ctx.fillText(`${v.toFixed(0)}V`, gx + gateW / 2 - 8, gateStartY - 4);
      }

      // 4. Depletion Potential Wells & Surface Potential Profile (psi_s)
      ctx.beginPath();
      ctx.moveTo(devX + 40, subY);

      for (let i = 0; i < totalGates; i++) {
        const gx = devX + 40 + i * gateW;
        const phaseIdx = i % 3;
        const v = gateVoltages[phaseIdx];
        const wellDepth = (v / gateVoltage) * 45 + 10;

        ctx.lineTo(gx + 2, subY + wellDepth);
        ctx.lineTo(gx + gateW - 2, subY + wellDepth);
      }
      ctx.lineTo(devX + 40 + totalGates * gateW, subY);
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Shaded Depletion Region
      ctx.fillStyle = "rgba(245, 158, 11, 0.15)";
      ctx.fill();

      // 5. Stored Photoelectron Packets (Traveling Charge Clouds)
      const chargePacketProgress = (clockPhase / (Math.PI * 2)) * (gateW * 3);
      for (let s = 0; s < numStages; s++) {
        const px = devX + 40 + s * gateW * 3 + chargePacketProgress;
        const py = subY + 32;

        if (px < devX + 40 + totalGates * gateW) {
          // Electron cloud gradient
          const glowGrad = ctx.createRadialGradient(px, py, 2, px, py, 14);
          glowGrad.addColorStop(0, "#ffffff");
          glowGrad.addColorStop(0.4, "#60a5fa");
          glowGrad.addColorStop(1, "transparent");
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(px, py, 14, 0, Math.PI * 2);
          ctx.fill();

          // Electron count badge
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 9px monospace";
          ctx.fillText(
            `${(metrics.totalCollectedElectrons / 1000).toFixed(0)}k e⁻`,
            px - 16,
            py + 22,
          );
        }
      }

      // 6. Incident Photon Flux (Photogeneration)
      const numPhotons = Math.min(8, Math.max(2, Math.round(incidentLux / 50)));
      ctx.strokeStyle = "#fef08a";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < numPhotons; i++) {
        const phX = devX + 80 + i * (devW / (numPhotons + 1));
        const phY = gateStartY - 20 + ((clockPhase * 15 + i * 20) % 30);

        ctx.beginPath();
        ctx.moveTo(phX, phY);
        ctx.lineTo(phX, phY + 12);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(phX - 3, phY + 8);
        ctx.lineTo(phX, phY + 12);
        ctx.lineTo(phX + 3, phY + 8);
        ctx.stroke();
      }

      // ==========================================
      // Telemetry HUD Bar (Bottom)
      // ==========================================
      const hudY = 320;
      const cardW = (w - 48 - 36) / 4;
      const cardH = 75;

      const hudCards = [
        {
          title: "GATE VOLTAGE & WELL DEPTH",
          value: `${gateVoltage} V (ψs = ${metrics.surfacePotentialV} V)`,
          desc: `Depletion Depth: ${metrics.depletionDepthUm} µm`,
          highlight: true,
        },
        {
          title: "FULL-WELL CAPACITY",
          value: `${(metrics.fullWellCapacityElectrons / 1000).toFixed(0)}k e⁻`,
          desc: `Fill: ${metrics.wellFillPercentage}% ${metrics.isSaturated ? "(SATURATED)" : "(LINEAR)"}`,
          highlight: metrics.isSaturated,
        },
        {
          title: "TRANSFER EFFICIENCY (CTE)",
          value: `${metrics.ctePct}%`,
          desc: `Clock: ${clockFreq} MHz (T = ${metrics.clockPeriodNs} ns)`,
          highlight: metrics.ctePct > 99.99,
        },
        {
          title: "SIGNAL-TO-NOISE RATIO",
          value: `${metrics.snrDb} dB`,
          desc: `Dark Noise: ${metrics.darkElectrons} e⁻ at ${temperature} K`,
          highlight: metrics.snrDb > 20,
        },
      ];

      hudCards.forEach((card, idx) => {
        const cx = 24 + idx * (cardW + 12);
        ctx.fillStyle = card.highlight ? "rgba(15, 23, 42, 0.85)" : "rgba(15, 23, 42, 0.5)";
        ctx.strokeStyle = card.highlight ? "rgba(56, 189, 248, 0.5)" : "rgba(51, 65, 85, 0.5)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(cx, hudY, cardW, cardH, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#94a3b8";
        ctx.font = "9px 'JetBrains Mono', monospace";
        ctx.fillText(card.title, cx + 12, hudY + 20);

        ctx.fillStyle = card.highlight ? "#38bdf8" : "#e2e8f0";
        ctx.font = "bold 14px 'JetBrains Mono', monospace";
        ctx.fillText(card.value, cx + 12, hudY + 44);

        ctx.fillStyle = "#64748b";
        ctx.font = "10px Inter, sans-serif";
        ctx.fillText(card.desc, cx + 12, hudY + 62);
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [gateVoltage, clockFreq, incidentLux, temperature, isRunning, metrics]);

  return (
    <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-950 p-4 shadow-2xl">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
        <canvas ref={canvasRef} width={800} height={420} className="h-full w-full object-contain" />
      </div>

      {interactive && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-800/80 bg-slate-900/50 p-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex flex-col gap-1">
              <label htmlFor="gateVoltage" className="text-xs font-mono text-slate-400">
                Gate Voltage: {gateVoltage} V
              </label>
              <input
                id="gateVoltage"
                type="range"
                min="5"
                max="15"
                step="0.5"
                value={gateVoltage}
                onChange={(e) => updateParam("gateVoltageV", Number(e.target.value))}
                className="h-1.5 w-32 accent-sky-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="clockFreq" className="text-xs font-mono text-slate-400">
                Clock Freq: {clockFreq} MHz
              </label>
              <input
                id="clockFreq"
                type="range"
                min="0.5"
                max="20"
                step="0.5"
                value={clockFreq}
                onChange={(e) => updateParam("clockFrequencyMhz", Number(e.target.value))}
                className="h-1.5 w-32 accent-sky-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="incidentLux" className="text-xs font-mono text-slate-400">
                Incident Light: {incidentLux} lux
              </label>
              <input
                id="incidentLux"
                type="range"
                min="10"
                max="2000"
                step="10"
                value={incidentLux}
                onChange={(e) => updateParam("incidentLux", Number(e.target.value))}
                className="h-1.5 w-32 accent-sky-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="temperature" className="text-xs font-mono text-slate-400">
                Temp: {temperature} K
              </label>
              <input
                id="temperature"
                type="range"
                min="200"
                max="350"
                step="5"
                value={temperature}
                onChange={(e) => updateParam("temperatureKelvin", Number(e.target.value))}
                className="h-1.5 w-28 accent-sky-500"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-2 rounded-md bg-sky-600 px-5 py-2 font-mono text-xs font-bold text-white shadow-lg shadow-sky-600/30 transition hover:bg-sky-500 active:scale-95"
          >
            {isRunning ? "⏸ PAUSE CLOCK" : "▶ RUN 3-PHASE CLOCK"}
          </button>
        </div>
      )}
    </div>
  );
}
