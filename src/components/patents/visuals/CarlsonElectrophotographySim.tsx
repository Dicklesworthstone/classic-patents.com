"use client";

import { Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepCarlsonElectrophotography } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { useLiveSimParams } from "./three/useLiveSimParams";
import { usePatentAudio } from "./three/usePatentAudio";
import { useOffscreenGate } from "./useOffscreenGate";

interface CarlsonElectrophotographySimProps {
  initialCoronaVoltageKv?: number;
  initialExposureLuxSec?: number;
  initialLayerThicknessUm?: number;
  initialFuserTemperatureC?: number;
}

export function CarlsonElectrophotographySim({
  initialCoronaVoltageKv = 6.5,
  initialExposureLuxSec = 12,
  initialLayerThicknessUm = 30,
  initialFuserTemperatureC = 185,
}: CarlsonElectrophotographySimProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { rootRef, onscreenRef } = useOffscreenGate<HTMLDivElement>();

  const physicsState = usePatentPhysics("us-2297691-carlson-electrophotography");
  const { params, updateParam, resetParams } = physicsState;
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const coronaVoltageKv = params.coronaVoltageKv ?? initialCoronaVoltageKv;
  const exposureLuxSec = params.exposureLuxSec ?? initialExposureLuxSec;
  const layerThicknessUm = params.layerThicknessUm ?? initialLayerThicknessUm;
  const fuserTemperatureC = params.fuserTemperatureC ?? initialFuserTemperatureC;
  const [isRotating, setIsRotating] = useState(true);

  const physics = stepCarlsonElectrophotography({
    coronaVoltageKv,
    exposureLuxSec,
    layerThicknessUm,
    fuserTemperatureC,
  });
  const live = useLiveSimParams({ isRotating, physics });

  // The layout-effect bridge updates telemetry without tearing down the drum
  // animation, so control changes retain the current rotation phase.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // The 640x380 logical canvas is stretched to ~1100+ CSS px on desktop,
    // so a 1:1 backing store smears every stroke across multiple device
    // pixels. Scale the backing store by devicePixelRatio (capped at 2) and
    // keep drawing in unchanged logical coordinates via the base transform.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const LOGICAL_W = 640;
    const LOGICAL_H = 380;
    canvas.width = LOGICAL_W * dpr;
    canvas.height = LOGICAL_H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    let animId: number;
    let angle = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      if (!onscreenRef.current) return;
      const { isRotating, physics } = live.current;
      if (isRotating) {
        angle += 0.015;
      }

      const w = LOGICAL_W;
      const h = LOGICAL_H;

      // Dark background
      ctx.fillStyle = "#0a0f1d";
      ctx.fillRect(0, 0, w, h);

      // Subtle Grid
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

      // Header
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 13px system-ui, -apple-system, sans-serif";
      ctx.fillText("CHESTER CARLSON ELECTROPHOTOGRAPHY & XEROGRAPHY SIMULATOR", 20, 26);
      ctx.font = "11px monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText("US 2,297,691 • 5-Step Photoconductive Electrostatic Copy Cycle", 20, 42);

      // ========================================================
      // 1. ROTARY PHOTOCONDUCTIVE DRUM (Center: x: 190, y: 190, r: 85)
      // ========================================================
      const drumCx = 190;
      const drumCy = 185;
      const drumR = 80;

      // Outer Amorphous Selenium Photoreceptor Layer
      ctx.save();
      ctx.beginPath();
      ctx.arc(drumCx, drumCy, drumR, 0, Math.PI * 2);
      ctx.fillStyle = "#1e293b";
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = "#818cf8"; // Selenium sheen
      ctx.stroke();

      // Aluminum Grounded Drum Core
      ctx.beginPath();
      ctx.arc(drumCx, drumCy, drumR - 15, 0, Math.PI * 2);
      ctx.fillStyle = "#334155";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#64748b";
      ctx.stroke();

      // Rotating Hub Spokes
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        const spokeAngle = angle + (i * Math.PI) / 2;
        ctx.beginPath();
        ctx.moveTo(drumCx, drumCy);
        ctx.lineTo(
          drumCx + Math.cos(spokeAngle) * (drumR - 15),
          drumCy + Math.sin(spokeAngle) * (drumR - 15),
        );
        ctx.stroke();
      }
      ctx.restore();

      // Drum Label
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = "#c7d2fe";
      ctx.fillText("SELENIUM DRUM (25)", drumCx - 46, drumCy + 4);

      // ========================================================
      // 2. THE 5 SURROUNDING WORK STATIONS
      // ========================================================

      // (A) STATION 1: CORONA CHARGING WIRE (Top-Left: 10 o'clock)
      const chargeX = drumCx - 65;
      const chargeY = drumCy - 70;
      ctx.fillStyle = "#fbbf24";
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(chargeX, chargeY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Corona ion spray rays
      ctx.strokeStyle = "#fde047";
      ctx.lineWidth = 1.5;
      for (let a = 0.3; a < 1.4; a += 0.3) {
        ctx.beginPath();
        ctx.moveTo(chargeX, chargeY);
        ctx.lineTo(chargeX + Math.cos(a) * 24, chargeY + Math.sin(a) * 24);
        ctx.stroke();
      }
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = "#facc15";
      ctx.fillText(
        `1. CORONA CHARGE (+${physics.initialSurfacePotentialV}V)`,
        chargeX - 100,
        chargeY - 14,
      );

      // (B) STATION 2: OPTICAL SLIT EXPOSURE (Top: 12 o'clock)
      const expX = drumCx;
      const expY = drumCy - drumR - 35;
      ctx.fillStyle = "#0284c7";
      ctx.fillRect(expX - 25, expY, 50, 18);
      ctx.strokeStyle = "#38bdf8";
      ctx.strokeRect(expX - 25, expY, 50, 18);

      // Light Projection Beam
      ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
      ctx.beginPath();
      ctx.moveTo(expX - 20, expY + 18);
      ctx.lineTo(expX + 20, expY + 18);
      ctx.lineTo(drumCx + 15, drumCy - drumR);
      ctx.lineTo(drumCx - 15, drumCy - drumR);
      ctx.closePath();
      ctx.fill();

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = "#38bdf8";
      ctx.fillText("2. OPTICAL EXPOSURE (15)", expX - 58, expY - 8);

      // (C) STATION 3: TRIBOELECTRIC TONER DEVELOPER (Right: 2 o'clock)
      const devX = drumCx + 75;
      const devY = drumCy - 40;
      ctx.fillStyle = "#1e1b4b";
      ctx.fillRect(devX, devY - 15, 45, 40);
      ctx.strokeStyle = "#6366f1";
      ctx.strokeRect(devX, devY - 15, 45, 40);

      // Cascading toner particles
      ctx.fillStyle = "#a855f7";
      for (let p = 0; p < 8; p++) {
        const px = devX - 5 + ((p * 7 + Math.floor(angle * 20)) % 15);
        const py = devY - 5 + ((p * 5) % 25);
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = "#c084fc";
      ctx.fillText("3. TONER DUST (28)", devX + 2, devY - 22);

      // (D) STATION 4: PAPER TRANSFER ROLLER (Bottom: 6 o'clock)
      const transX = drumCx;
      const transY = drumCy + drumR + 25;

      // Transfer Roller
      ctx.fillStyle = "#334155";
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(transX, transY + 10, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Paper Web running between drum and transfer roll
      ctx.strokeStyle = "#f8fafc";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(transX - 90, transY);
      ctx.lineTo(transX + 160, transY);
      ctx.stroke();

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = "#f1f5f9";
      ctx.fillText("4. PAPER TRANSFER (29)", transX - 110, transY + 34);

      // (E) STATION 5: HEATED FUSER ROLLERS (Bottom-Right: x: 420, y: transY)
      const fuserX = transX + 110;
      const fuserY = transY;

      // Hot upper fuser roll
      ctx.fillStyle = physics.fuserTemperatureC >= 170 ? "#dc2626" : "#b45309";
      ctx.strokeStyle = "#fca5a5";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(fuserX, fuserY - 14, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Pressure lower fuser roll
      ctx.fillStyle = "#475569";
      ctx.beginPath();
      ctx.arc(fuserX, fuserY + 14, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Fused text mark on exiting paper
      ctx.font = "bold 8px monospace";
      ctx.fillStyle = "#020617";
      ctx.fillText("10-22-38 ASTORIA", fuserX + 22, transY - 3);

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = "#f87171";
      ctx.fillText(`5. FUSER (${physics.fuserTemperatureC}°C)`, fuserX - 25, fuserY + 40);

      // ========================================================
      // 3. SURFACE ELECTROSTATIC VOLTAGE PROFILE GRAPH V(x) (Right-Top)
      // ========================================================
      const graphX = 360;
      const graphY = 65;
      const graphW = 255;
      const graphH = 125;

      ctx.fillStyle = "#020617";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 1.5;
      ctx.fillRect(graphX, graphY, graphW, graphH);
      ctx.strokeRect(graphX, graphY, graphW, graphH);

      // Axes
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 1;
      const baseVy = graphY + graphH - 15;
      ctx.beginPath();
      ctx.moveTo(graphX, baseVy);
      ctx.lineTo(graphX + graphW, baseVy);
      ctx.stroke();

      ctx.font = "9px monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText("0V", graphX + 8, baseVy + 12);
      ctx.fillText("+800V", graphX + 8, graphY + 14);
      ctx.fillText("PHOTORECEPTOR CHARGE PROFILE V(x)", graphX + 45, graphY + 14);

      // Plot Voltage Curves
      // Dark Area (Retained Charge) vs Light Area (Discharged)
      const v0Y = baseVy - (physics.initialSurfacePotentialV / 800) * (graphH - 30);
      const vExpY = baseVy - (physics.exposedSurfacePotentialV / 800) * (graphH - 30);

      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(graphX + 40, v0Y);
      ctx.lineTo(graphX + 110, v0Y); // Dark image region
      ctx.lineTo(graphX + 130, vExpY); // Edge transition
      ctx.lineTo(graphX + 240, vExpY); // Exposed background region
      ctx.stroke();

      // Annotations on graph
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = "#fbbf24";
      ctx.fillText(`Image (+${physics.initialSurfacePotentialV}V)`, graphX + 45, v0Y - 6);
      ctx.fillStyle = "#38bdf8";
      ctx.fillText(`Bg (+${physics.exposedSurfacePotentialV}V)`, graphX + 145, vExpY - 6);

      // Contrast ΔV arrow
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(graphX + 120, vExpY);
      ctx.lineTo(graphX + 120, v0Y);
      ctx.stroke();

      ctx.fillStyle = "#22c55e";
      ctx.font = "bold 9px monospace";
      ctx.fillText(`ΔV: ${physics.contrastPotentialV}V`, graphX + 126, (v0Y + vExpY) / 2 + 3);

      // ========================================================
      // 4. BOTTOM TELEMETRY BAR
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
      ctx.fillStyle = "#22c55e";
      ctx.fillText(`CONTRAST: ${physics.contrastPotentialV} V`, 20, h - 22);
      ctx.fillStyle = "#38bdf8";
      ctx.fillText(`OPTICAL DENSITY: ${physics.opticalDensity} OD`, 170, h - 22);
      ctx.fillStyle = "#c084fc";
      ctx.fillText(`TONER DENSITY: ${physics.tonerMassDensityMgPerCm2} mg/cm²`, 360, h - 22);
      ctx.fillStyle = "#f87171";
      ctx.fillText(`FUSING QUALITY: ${physics.fuserBondQualityPct}%`, 530, h - 22);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [live, onscreenRef]);

  return (
    <div
      ref={rootRef}
      className="flex flex-col gap-4 rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors"
    >
      {/* Header with Title and Global Action Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
            Chester Carlson Electrophotography / Xerography (US 2,297,691)
          </h3>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400">
            Corona electrostatic charging, photoconductive optical discharge, toner transfer, and
            heat fusing.
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setIsRotating(!isRotating);
              soundEngine.playSwitchClick();
            }}
            aria-label={isRotating ? "Pause Drum" : "Run Drum"}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
            title={isRotating ? "Pause Drum" : "Run Drum"}
          >
            {isRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
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
              setIsRotating(true);
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

      {/* 2D Canvas Viewport */}
      <div className="relative w-full aspect-[16/9] max-h-[520px] rounded-xl overflow-hidden border border-parchment-300 dark:border-ink-800 bg-slate-950">
        <canvas ref={canvasRef} width={640} height={380} className="w-full h-full object-contain" />
      </div>

      {/* Interactive Control Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-parchment-100/80 dark:bg-ink-900/60 rounded-xl border border-parchment-200 dark:border-ink-800">
        {/* Corona Voltage */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-amber-600 dark:text-yellow-400">Corona Voltage</span>
            <span className="font-mono text-amber-700 dark:text-yellow-300">
              {coronaVoltageKv.toFixed(2)} kV
            </span>
          </div>
          <input
            type="range"
            aria-label="Corona charging voltage in kilovolts"
            min={4.0}
            max={8.0}
            step={0.25}
            value={coronaVoltageKv}
            onChange={(e) => updateParam("coronaVoltageKv", Number(e.target.value))}
            className="w-full h-1.5 bg-parchment-300 dark:bg-ink-700 rounded-lg appearance-none cursor-pointer accent-amber-600 dark:accent-yellow-500"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400">
            Surface charging potential
          </span>
        </div>

        {/* Optical Exposure */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-cyan-600 dark:text-cyan-400">Optical Exposure</span>
            <span className="font-mono text-cyan-700 dark:text-cyan-300">
              {exposureLuxSec} lx·s
            </span>
          </div>
          <input
            type="range"
            aria-label="Optical exposure in lux seconds"
            min={0}
            max={30}
            step={1}
            value={exposureLuxSec}
            onChange={(e) => updateParam("exposureLuxSec", Number(e.target.value))}
            className="w-full h-1.5 bg-parchment-300 dark:bg-ink-700 rounded-lg appearance-none cursor-pointer accent-cyan-600 dark:accent-cyan-500"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400">Discharge light energy</span>
        </div>

        {/* Photoreceptor Thickness */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-indigo-600 dark:text-indigo-400">Selenium Thickness</span>
            <span className="font-mono text-indigo-700 dark:text-indigo-300">
              {layerThicknessUm} µm
            </span>
          </div>
          <input
            type="range"
            aria-label="Selenium photoconductor thickness in micrometers"
            min={10}
            max={60}
            step={5}
            value={layerThicknessUm}
            onChange={(e) => updateParam("layerThicknessUm", Number(e.target.value))}
            className="w-full h-1.5 bg-parchment-300 dark:bg-ink-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-500"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400">
            Semiconductor layer depth
          </span>
        </div>

        {/* Fuser Temperature */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-rose-600 dark:text-rose-400">Fuser Temperature</span>
            <span className="font-mono text-rose-700 dark:text-rose-300">
              {fuserTemperatureC}°C
            </span>
          </div>
          <input
            type="range"
            aria-label="Fuser temperature in degrees Celsius"
            min={120}
            max={220}
            step={5}
            value={fuserTemperatureC}
            onChange={(e) => updateParam("fuserTemperatureC", Number(e.target.value))}
            className="w-full h-1.5 bg-parchment-300 dark:bg-ink-700 rounded-lg appearance-none cursor-pointer accent-rose-600 dark:accent-rose-500"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400">Thermal resin bonding</span>
        </div>
      </div>
    </div>
  );
}

export default CarlsonElectrophotographySim;
