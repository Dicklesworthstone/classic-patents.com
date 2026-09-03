"use client";

import { Radio, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef } from "react";
import { stepDeForestAudion } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { useLiveSimParams } from "./three/useLiveSimParams";
import { usePatentAudio } from "./three/usePatentAudio";
import { useOffscreenGate } from "./useOffscreenGate";

interface DeForestAudionSimProps {
  initialPlateVoltageV?: number;
  initialGridBiasVoltageV?: number;
  initialFilamentCurrentA?: number;
  initialGridSignalAmplitudeMv?: number;
  initialLoadResistanceKOhms?: number;
}

export function DeForestAudionSim({
  initialPlateVoltageV = 45,
  initialGridBiasVoltageV = -1.5,
  initialFilamentCurrentA = 1.0,
  initialGridSignalAmplitudeMv = 50,
  initialLoadResistanceKOhms = 20,
}: DeForestAudionSimProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { rootRef, onscreenRef } = useOffscreenGate<HTMLDivElement>();

  const { params, updateParam, resetParams } = usePatentPhysics("us-879532-de-forest-audion");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const plateVoltageV = params.plateVoltageV ?? initialPlateVoltageV;
  const gridBiasVoltageV = params.gridBiasVoltageV ?? initialGridBiasVoltageV;
  const filamentCurrentA = params.filamentCurrentA ?? initialFilamentCurrentA;
  const gridSignalAmplitudeMv = params.gridSignalAmplitudeMv ?? initialGridSignalAmplitudeMv;
  const loadResistanceKOhms = params.loadResistanceKOhms ?? initialLoadResistanceKOhms;

  // Compute live physics
  const physics = stepDeForestAudion({
    plateVoltageV,
    gridBiasVoltageV,
    filamentCurrentA,
    gridSignalAmplitudeMv,
    loadResistanceKOhms,
  });
  const live = useLiveSimParams({
    plateVoltageV,
    gridBiasVoltageV,
    filamentCurrentA,
    gridSignalAmplitudeMv,
    loadResistanceKOhms,
    physics,
  });

  // Draw from a layout-effect-synchronized snapshot so changing a control
  // preserves the accumulated electron and oscilloscope phase.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      if (!onscreenRef.current) return;
      const {
        plateVoltageV,
        gridBiasVoltageV,
        filamentCurrentA,
        gridSignalAmplitudeMv,
        loadResistanceKOhms,
        physics,
      } = live.current;
      time += 0.03;

      const w = canvas.width;
      const h = canvas.height;

      // Dark Archival Background
      ctx.fillStyle = "#0a0f1d";
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

      // Header
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 13px system-ui, -apple-system, sans-serif";
      ctx.fillText("LEE DE FOREST AUDION TRIODE VACUUM TUBE SIMULATOR", 20, 26);
      ctx.font = "11px monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(
        "US 879,532 • Thermionic Space-Charge Modulation & Triode Amplification",
        20,
        42,
      );

      // ========================================================
      // 1. TRIODE VACUUM BULB (Left side: center x: 180, y: 185)
      // ========================================================
      const bulbX = 180;
      const bulbY = 180;
      const bulbRadius = 90;

      // Glass Bulb Outer Circle
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 3;
      ctx.fillStyle = "rgba(15, 23, 42, 0.6)";
      ctx.beginPath();
      ctx.arc(bulbX, bulbY, bulbRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Brass Screw Base
      ctx.fillStyle = "#b45309";
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.fillRect(bulbX - 25, bulbY + bulbRadius, 50, 24);
      ctx.strokeRect(bulbX - 25, bulbY + bulbRadius, 50, 24);

      // (A) HEATED FILAMENT CATHODE (x: 130)
      const filX = bulbX - 50;
      const filYTop = bulbY - 45;
      const filYBot = bulbY + 45;

      ctx.save();
      const filHeat = Math.min(1.5, filamentCurrentA);
      ctx.strokeStyle = filHeat > 0.6 ? "#fbbf24" : "#78716c";
      ctx.lineWidth = 3;
      ctx.shadowColor = filHeat > 0.6 ? "#f59e0b" : "transparent";
      ctx.shadowBlur = filHeat > 0.6 ? 16 : 0;
      ctx.beginPath();
      ctx.moveTo(filX - 8, filYBot);
      ctx.lineTo(filX, filYTop);
      ctx.lineTo(filX + 8, filYBot);
      ctx.stroke();
      ctx.restore();

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = "#facc15";
      ctx.fillText(`FILAMENT F (${physics.filamentTemperatureK} K)`, filX - 35, filYBot + 16);

      // (B) INTERPOSED CONTROL GRID (x: 180, center)
      const gridX = bulbX;
      const isGridNeg = gridBiasVoltageV < 0;

      ctx.strokeStyle = isGridNeg ? "#f43f5e" : "#38bdf8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let gy = bulbY - 50; gy <= bulbY + 50; gy += 12) {
        ctx.moveTo(gridX - 6, gy);
        ctx.lineTo(gridX + 6, gy);
      }
      ctx.stroke();

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = isGridNeg ? "#fb7185" : "#38bdf8";
      ctx.fillText(`GRID a (${gridBiasVoltageV.toFixed(1)} V)`, gridX - 22, bulbY - 60);

      // (C) COLD COLLECTOR PLATE ANODE (x: 230)
      const plateX = bulbX + 50;
      ctx.fillStyle = "#64748b";
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 2;
      ctx.fillRect(plateX - 4, bulbY - 55, 8, 110);
      ctx.strokeRect(plateX - 4, bulbY - 55, 8, 110);

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = "#93c5fd";
      ctx.fillText(`PLATE b (+${plateVoltageV} V)`, plateX - 18, bulbY + 68);

      // (D) ANIMATED THERMIONIC ELECTRON STREAM PARTICLES
      if (physics.isConducting) {
        const streamCount = Math.round(physics.plateCurrentMa * 15);
        ctx.fillStyle = "#38bdf8";
        for (let i = 0; i < streamCount; i++) {
          const tProgress = (time * physics.electronDisplayAdvance + i * 0.12) % 1.0;
          const px = filX + tProgress * (plateX - filX);
          const py = bulbY - 40 + ((i * 17) % 80);

          // Grid repulsive choking effect
          let yOffset = 0;
          if (px > gridX - 10 && px < gridX + 10 && isGridNeg) {
            yOffset = Math.sin(tProgress * Math.PI) * 4;
          }

          ctx.beginPath();
          ctx.arc(px, py + yOffset, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ========================================================
      // 2. TRANSFER CHARACTERISTIC CURVE Ip vs Vg (Right top: x: 340, y: 70)
      // ========================================================
      const graphX = 350;
      const graphY = 65;
      const graphW = 260;
      const graphH = 140;

      ctx.fillStyle = "#020617";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 1.5;
      ctx.fillRect(graphX, graphY, graphW, graphH);
      ctx.strokeRect(graphX, graphY, graphW, graphH);

      // Axes
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 1;
      // Grid Vg = 0 axis (at x: graphX + 180)
      const zeroVgX = graphX + 180;
      ctx.beginPath();
      ctx.moveTo(zeroVgX, graphY);
      ctx.lineTo(zeroVgX, graphY + graphH);
      ctx.stroke();

      // Horizontal Axis
      const baseIpY = graphY + graphH - 15;
      ctx.beginPath();
      ctx.moveTo(graphX, baseIpY);
      ctx.lineTo(graphX + graphW, baseIpY);
      ctx.stroke();

      ctx.font = "9px monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText("-6V", graphX + 10, baseIpY + 12);
      ctx.fillText("-3V", graphX + 90, baseIpY + 12);
      ctx.fillText("0V", zeroVgX - 6, baseIpY + 12);
      ctx.fillText("+2V", graphX + graphW - 24, baseIpY + 12);
      ctx.fillText("Ip (mA)", graphX + 8, graphY + 14);

      // Plot Child-Langmuir Transfer Characteristic Curve
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let vx = -6; vx <= 2; vx += 0.2) {
        const pt = stepDeForestAudion({
          plateVoltageV,
          gridBiasVoltageV: vx,
          filamentCurrentA,
          gridSignalAmplitudeMv,
          loadResistanceKOhms,
        });

        const gx = zeroVgX + (vx / 6) * 160;
        const gy = baseIpY - (pt.plateCurrentMa / 6.0) * (graphH - 30);

        if (vx === -6) ctx.moveTo(gx, gy);
        else ctx.lineTo(gx, gy);
      }
      ctx.stroke();

      // Current Operating Point Q
      const currentGx = zeroVgX + (gridBiasVoltageV / 6) * 160;
      const currentGy = baseIpY - (physics.plateCurrentMa / 6.0) * (graphH - 30);

      ctx.fillStyle = "#f59e0b";
      ctx.shadowColor = "#f59e0b";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(currentGx, currentGy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = "#fde047";
      ctx.fillText(
        `Q: (${gridBiasVoltageV.toFixed(1)}V, ${physics.plateCurrentMa}mA)`,
        currentGx - 40,
        currentGy - 8,
      );

      // ========================================================
      // 3. OSCILLOSCOPE INPUT vs AMPLIFIED OUTPUT (Right bottom: x: 350, y: 225)
      // ========================================================
      const oscX = 350;
      const oscY = 225;
      const oscW = 260;
      const oscH = 95;

      ctx.fillStyle = "#020617";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 1.5;
      ctx.fillRect(oscX, oscY, oscW, oscH);
      ctx.strokeRect(oscX, oscY, oscW, oscH);

      ctx.font = "9px monospace";
      ctx.fillStyle = "#38bdf8";
      ctx.fillText(`INPUT Vin: ${physics.inputSignalMv} mV`, oscX + 10, oscY + 16);
      ctx.fillStyle = "#22c55e";
      ctx.fillText(
        `OUTPUT Vout: ${physics.outputSignalMv} mV (${physics.voltageGain}x Gain)`,
        oscX + 10,
        oscY + 30,
      );

      const oscMidY = oscY + 60;

      // Draw Input Wave (Cyan - Small)
      ctx.strokeStyle = "#06b6d4";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let ox = 0; ox < oscW; ox += 2) {
        const rad = ox * 0.08 - time * physics.scopeSweepOmegaRadPerS;
        const oy = oscMidY + Math.sin(rad) * 8;
        if (ox === 0) ctx.moveTo(oscX + ox, oy);
        else ctx.lineTo(oscX + ox, oy);
      }
      ctx.stroke();

      // Draw Amplified Output Wave (Green - Large, Phase-Inverted)
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let ox = 0; ox < oscW; ox += 2) {
        const rad = ox * 0.08 - time * physics.scopeSweepOmegaRadPerS;
        const oy = oscMidY - Math.sin(rad) * Math.min(32, 8 * (physics.voltageGain / 2.5));
        if (ox === 0) ctx.moveTo(oscX + ox, oy);
        else ctx.lineTo(oscX + ox, oy);
      }
      ctx.stroke();

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
      ctx.fillText(`VOLTAGE GAIN: ${physics.voltageGain}x`, 20, h - 22);
      ctx.fillStyle = "#38bdf8";
      ctx.fillText(`PLATE CURRENT: ${physics.plateCurrentMa} mA`, 180, h - 22);
      ctx.fillStyle = "#facc15";
      ctx.fillText(
        `TRANSCONDUCTANCE: ${physics.dynamicTransconductanceMicromhos} µmhos`,
        350,
        h - 22,
      );
      ctx.fillStyle = "#c084fc";
      ctx.fillText(`POWER GAIN: ${physics.powerGainDb} dB`, 520, h - 22);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [live, onscreenRef]);

  return (
    <div
      ref={rootRef}
      className="flex flex-col gap-4 rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 text-ink-900 dark:text-parchment-100 shadow-md transition-colors"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
              Lee de Forest Audion Triode Vacuum Tube Amplifier (US 879,532)
            </h3>
          </div>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400 mt-0.5">
            Electrostatic grid control of thermionic plate current, space-charge mediation, and
            voltage gain.
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
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-slate-700 text-ink-800 dark:text-parchment-200 transition-colors"
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              resetParams();
              soundEngine.playSwitchClick();
            }}
            aria-label="Reset Simulation"
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-slate-700 text-ink-800 dark:text-parchment-200 transition-colors"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-parchment-100/80 dark:bg-ink-900/60 rounded-xl border border-parchment-200 dark:border-ink-800">
        {/* B-Battery Plate Voltage */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-amber-400">B-Battery Plate</span>
            <span className="font-mono text-amber-300">{plateVoltageV} V</span>
          </div>
          <input
            type="range"
            aria-label="B-battery plate voltage in volts"
            min={10}
            max={120}
            step={5}
            value={plateVoltageV}
            onChange={(e) => updateParam("plateVoltageV", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <span className="text-[10px] text-slate-400">High-voltage DC supply</span>
        </div>

        {/* Grid Bias Voltage */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-cyan-400">Grid Bias Voltage</span>
            <span className="font-mono text-cyan-300">{gridBiasVoltageV.toFixed(1)} V</span>
          </div>
          <input
            type="range"
            aria-label="Grid bias voltage in volts"
            min={-6.0}
            max={2.0}
            step={0.25}
            value={gridBiasVoltageV}
            onChange={(e) => updateParam("gridBiasVoltageV", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <span className="text-[10px] text-slate-400">Electrostatic control bias</span>
        </div>

        {/* Filament Current */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-yellow-400">Filament Current</span>
            <span className="font-mono text-yellow-300">{filamentCurrentA.toFixed(1)} A</span>
          </div>
          <input
            type="range"
            aria-label="Filament current in amperes"
            min={0.5}
            max={1.5}
            step={0.1}
            value={filamentCurrentA}
            onChange={(e) => updateParam("filamentCurrentA", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
          <span className="text-[10px] text-slate-400">Cathode heating power</span>
        </div>

        {/* Input Signal Amplitude */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-emerald-400">Input RF Signal</span>
            <span className="font-mono text-emerald-300">{gridSignalAmplitudeMv} mV</span>
          </div>
          <input
            type="range"
            aria-label="Input radio-frequency signal amplitude in millivolts"
            min={10}
            max={200}
            step={5}
            value={gridSignalAmplitudeMv}
            onChange={(e) => updateParam("gridSignalAmplitudeMv", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <span className="text-[10px] text-slate-400">Antenna carrier swing</span>
        </div>

        {/* Plate Load Resistance */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-purple-400">Load Resistance</span>
            <span className="font-mono text-purple-300">{loadResistanceKOhms} kΩ</span>
          </div>
          <input
            type="range"
            aria-label="Headset load resistance in kiloohms"
            min={5}
            max={50}
            step={5}
            value={loadResistanceKOhms}
            onChange={(e) => updateParam("loadResistanceKOhms", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <span className="text-[10px] text-slate-400">Headset coil impedance</span>
        </div>
      </div>
    </div>
  );
}

export default DeForestAudionSim;
