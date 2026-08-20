"use client";

import { useEffect, useRef, useState } from "react";
import { stepHewittMercuryLamp } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

interface HewittMercuryLampSimProps {
  initialMainsVoltageV?: number;
  initialTubeLengthCm?: number;
  initialTubeDiameterMm?: number;
  initialCondenserCoolingLevel?: number;
  initialBallastResistanceOhms?: number;
}

export function HewittMercuryLampSim({
  initialMainsVoltageV = 110,
  initialTubeLengthCm = 100,
  initialTubeDiameterMm = 25,
  initialCondenserCoolingLevel = 1.0,
  initialBallastResistanceOhms = 12,
}: HewittMercuryLampSimProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { params, updateParam } = usePatentPhysics("us-682690-hewitt-mercury-lamp");
  const mainsVoltageV = params.mainsVoltageV ?? initialMainsVoltageV;
  const tubeLengthCm = params.tubeLengthCm ?? initialTubeLengthCm;
  const tubeDiameterMm = params.tubeDiameterMm ?? initialTubeDiameterMm;
  const condenserCoolingLevel = params.condenserCoolingLevel ?? initialCondenserCoolingLevel;
  const ballastResistanceOhms = params.ballastResistanceOhms ?? initialBallastResistanceOhms;
  const [isLit, setIsLit] = useState(true);
  const [strikePulseTime, setStrikePulseTime] = useState(0);

  // Compute live physics
  const physics = stepHewittMercuryLamp({
    mainsVoltageV,
    tubeLengthCm,
    tubeDiameterMm,
    condenserCoolingLevel,
    ballastResistanceOhms,
  });

  const handleStrike = () => {
    setIsLit(true);
    setStrikePulseTime(1.0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.025;

      const w = canvas.width;
      const h = canvas.height;

      // Dark Archival Background
      ctx.fillStyle = "#060913";
      ctx.fillRect(0, 0, w, h);

      // Subtle Grid Lines
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

      // Title & Architecture Header
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 14px system-ui, -apple-system, sans-serif";
      ctx.fillText("PETER COOPER HEWITT MERCURY-VAPOR DISCHARGE ARC LAMP", 24, 28);
      ctx.font = "11px monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(
        "US 682,690 • Low-Pressure Plasma Positive Column & Cathode-Spot Emission",
        24,
        45,
      );

      // ========================================================
      // 1. TUBULAR MERCURY VAPOR LAMP (Center, tilted 15°)
      // ========================================================
      const tubeStartX = 70;
      const tubeStartY = 190;
      const tubeEndX = 460;
      const tubeEndY = 110;
      const tubeRadius = Math.max(12, tubeDiameterMm * 0.7);

      // Glass Tube Envelope Outer Glow (When Lit)
      if (isLit) {
        ctx.save();
        const glowGrad = ctx.createLinearGradient(tubeStartX, tubeStartY, tubeEndX, tubeEndY);
        glowGrad.addColorStop(0, "rgba(6, 182, 212, 0.4)");
        glowGrad.addColorStop(0.5, "rgba(34, 211, 238, 0.6)");
        glowGrad.addColorStop(1, "rgba(16, 185, 129, 0.4)");

        ctx.strokeStyle = glowGrad;
        ctx.lineWidth = tubeRadius * 2 + 20;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tubeStartX, tubeStartY);
        ctx.lineTo(tubeEndX, tubeEndY);
        ctx.stroke();
        ctx.restore();
      }

      // Heavy Glass Tube Body
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = tubeRadius * 2 + 4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(tubeStartX, tubeStartY);
      ctx.lineTo(tubeEndX, tubeEndY);
      ctx.stroke();

      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.arc(tubeStartX, tubeStartY, tubeRadius, 0, Math.PI * 2);
      ctx.arc(tubeEndX, tubeEndY, tubeRadius, 0, Math.PI * 2);
      ctx.fill();

      // Glowing Positive Column Plasma Arc (When Lit)
      if (isLit) {
        ctx.save();
        const plasmaGrad = ctx.createLinearGradient(tubeStartX, tubeStartY, tubeEndX, tubeEndY);
        plasmaGrad.addColorStop(0, "#06b6d4");
        plasmaGrad.addColorStop(0.3, "#22d3ee");
        plasmaGrad.addColorStop(0.7, "#10b981");
        plasmaGrad.addColorStop(1, "#34d399");

        ctx.strokeStyle = plasmaGrad;
        ctx.lineWidth = tubeRadius * 1.5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tubeStartX + 15, tubeStartY);
        ctx.lineTo(tubeEndX - 15, tubeEndY);
        ctx.stroke();

        // Inner Intense White-Cyan Core Streamers
        ctx.strokeStyle = "rgba(240, 253, 250, 0.9)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(tubeStartX + 20, tubeStartY);
        for (let x = tubeStartX + 20; x < tubeEndX - 20; x += 30) {
          const tPos = (x - tubeStartX) / (tubeEndX - tubeStartX);
          const yBase = tubeStartY + tPos * (tubeEndY - tubeStartY);
          const yFlicker = Math.sin(time * 15 + x * 0.1) * 3;
          ctx.lineTo(x, yBase + yFlicker);
        }
        ctx.stroke();
        ctx.restore();
      }

      // ========================================================
      // 2. LIQUID MERCURY CATHODE POOL (Lower Left, x: 50-90)
      // ========================================================
      ctx.fillStyle = "#94a3b8";
      ctx.beginPath();
      ctx.arc(tubeStartX, tubeStartY, tubeRadius + 4, 0, Math.PI);
      ctx.fill();
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Cathode Emitting Hot Spot (Dancing White Pinpoint)
      if (isLit) {
        const spotX = tubeStartX + Math.sin(time * 8) * 8;
        const spotY = tubeStartY - 2;
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(spotX, spotY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = "#fef08a";
        ctx.font = "bold 9px monospace";
        ctx.fillText("CATHODE SPOT (10⁶ A/cm²)", tubeStartX - 40, tubeStartY + 28);
      }

      // ========================================================
      // 3. IRON ANODE & CONDENSING GLOBE (Upper Right, x: 460)
      // ========================================================
      // Solid Iron Anode Plate
      ctx.fillStyle = "#64748b";
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 2;
      ctx.fillRect(tubeEndX - 8, tubeEndY - 14, 16, 28);
      ctx.strokeRect(tubeEndX - 8, tubeEndY - 14, 16, 28);

      // Bulbous Glass Condensing Chamber (8 in Fig. 1)
      const bulbX = tubeEndX + 45;
      const bulbY = tubeEndY - 20;
      const bulbRadius = 38;

      ctx.fillStyle = "rgba(15, 23, 42, 0.6)";
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(bulbX, bulbY, bulbRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Condensed Mercury Droplets trickling down
      for (let i = 0; i < 6; i++) {
        const dropY = bulbY - 20 + ((time * 30 + i * 18) % 45);
        ctx.fillStyle = "#cbd5e1";
        ctx.beginPath();
        ctx.arc(bulbX - 10 + i * 4, dropY, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillText("CONDENSING GLOBE 8", bulbX, bulbY - bulbRadius - 6);
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(
        `P_Hg = ${physics.mercuryVaporPressureMmHg} mmHg`,
        bulbX,
        bulbY + bulbRadius + 14,
      );
      ctx.textAlign = "left";

      // ========================================================
      // 4. HIGH-VOLTAGE STARTING KICK PULSE ANIMATION
      // ========================================================
      if (strikePulseTime > 0) {
        ctx.strokeStyle = "#c084fc";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(tubeStartX, tubeStartY);
        for (let x = tubeStartX; x < tubeEndX; x += 20) {
          const tPos = (x - tubeStartX) / (tubeEndX - tubeStartX);
          const yBase = tubeStartY + tPos * (tubeEndY - tubeStartY);
          const yJolt = Math.sin(x * 0.5 + time * 40) * 15;
          ctx.lineTo(x, yBase + yJolt);
        }
        ctx.lineTo(tubeEndX, tubeEndY);
        ctx.stroke();

        ctx.fillStyle = "#e9d5ff";
        ctx.font = "bold 11px monospace";
        ctx.fillText(`STARTING KICK: ${physics.breakdownStartingVoltageV} V`, 200, 80);
      }

      // ========================================================
      // 5. MERCURY EMISSION SPECTRUM BAR (Bottom: y = 250-310)
      // ========================================================
      const specX = 70;
      const specY = 265;
      const specW = 500;
      const specH = 32;

      ctx.fillStyle = "#020617";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 1.5;
      ctx.fillRect(specX, specY, specW, specH);
      ctx.strokeRect(specX, specY, specW, specH);

      // Discrete Mercury Spectral Lines
      // 253.7nm (UV, left marker)
      ctx.fillStyle = "#a855f7";
      ctx.fillRect(specX + 30, specY, 4, specH);
      // 404.7nm (Violet)
      ctx.fillStyle = "#818cf8";
      ctx.fillRect(specX + 130, specY, 5, specH);
      // 435.8nm (Blue)
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(specX + 175, specY, 7, specH);
      // 546.1nm (Green triplet - dominant)
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(specX + 310, specY, 12, specH);
      // 577.0 / 579.1nm (Yellow doublet)
      ctx.fillStyle = "#eab308";
      ctx.fillRect(specX + 360, specY, 6, specH);

      ctx.font = "9px monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText("253.7nm (UV)", specX + 10, specY + specH + 14);
      ctx.fillText("404.7nm", specX + 115, specY + specH + 14);
      ctx.fillText("435.8nm", specX + 165, specY + specH + 14);
      ctx.fillStyle = "#4ade80";
      ctx.fillText("546.1nm (Green)", specX + 295, specY + specH + 14);
      ctx.fillStyle = "#fde047";
      ctx.fillText("577nm", specX + 355, specY + specH + 14);

      // ========================================================
      // 6. BOTTOM TELEMETRY BAR
      // ========================================================
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, h - 45, w, 45);
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h - 45);
      ctx.lineTo(w, h - 45);
      ctx.stroke();

      ctx.font = "11px monospace";
      ctx.fillStyle = "#38bdf8";
      ctx.fillText(`ARC CURRENT: ${physics.arcCurrentAmperes} A`, 20, h - 22);
      ctx.fillStyle = "#22c55e";
      ctx.fillText(`EFFICACY: ${physics.luminousEfficacyLmPerWatt} lm/W`, 180, h - 22);
      ctx.fillStyle = "#facc15";
      ctx.fillText(`FLUX: ${physics.luminousFluxLumens.toLocaleString()} lm`, 350, h - 22);
      ctx.fillStyle = "#c084fc";
      ctx.fillText(`REPLACES: ${physics.equivalentCarbonBulbs} Carbon Bulbs`, 500, h - 22);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [tubeDiameterMm, isLit, strikePulseTime, physics]);

  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 shadow-2xl">
      {/* 2D Canvas Viewport */}
      <div className="relative w-full aspect-[16/9] max-h-[520px] rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
        <canvas ref={canvasRef} width={640} height={380} className="w-full h-full object-contain" />

        {/* High-Voltage Strike Ignition Button */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            type="button"
            onClick={handleStrike}
            className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-mono rounded-lg border border-cyan-400/40 shadow-lg transition active:scale-95"
          >
            ⚡ STRIKE IGNITION PULSE
          </button>
        </div>
      </div>

      {/* Control Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-slate-900/60 rounded-lg border border-slate-800">
        {/* Mains Voltage */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-cyan-400">Mains Voltage</span>
            <span className="font-mono text-cyan-300">{mainsVoltageV} V</span>
          </div>
          <input
            type="range"
            min={80}
            max={240}
            step={5}
            value={mainsVoltageV}
            onChange={(e) => updateParam("mainsVoltageV", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <span className="text-[10px] text-slate-400">Commercial supply mains</span>
        </div>

        {/* Tube Length */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-amber-400">Tube Length</span>
            <span className="font-mono text-amber-300">{tubeLengthCm} cm</span>
          </div>
          <input
            type="range"
            min={30}
            max={150}
            step={5}
            value={tubeLengthCm}
            onChange={(e) => updateParam("tubeLengthCm", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <span className="text-[10px] text-slate-400">Positive column length</span>
        </div>

        {/* Tube Diameter */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-emerald-400">Tube Diameter</span>
            <span className="font-mono text-emerald-300">{tubeDiameterMm} mm</span>
          </div>
          <input
            type="range"
            min={15}
            max={40}
            step={1}
            value={tubeDiameterMm}
            onChange={(e) => updateParam("tubeDiameterMm", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <span className="text-[10px] text-slate-400">Discharge bore width</span>
        </div>

        {/* Condenser Cooling */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-purple-400">Condenser Cooling</span>
            <span className="font-mono text-purple-300">{condenserCoolingLevel.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={2.0}
            step={0.1}
            value={condenserCoolingLevel}
            onChange={(e) => updateParam("condenserCoolingLevel", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <span className="text-[10px] text-slate-400">Vapor pressure regulator</span>
        </div>

        {/* Ballast Resistance */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-rose-400">Ballast Resistance</span>
            <span className="font-mono text-rose-300">{ballastResistanceOhms} Ω</span>
          </div>
          <input
            type="range"
            min={5}
            max={30}
            step={1}
            value={ballastResistanceOhms}
            onChange={(e) => updateParam("ballastResistanceOhms", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
          <span className="text-[10px] text-slate-400">Negative resistance stabilizer</span>
        </div>
      </div>
    </div>
  );
}

export default HewittMercuryLampSim;
