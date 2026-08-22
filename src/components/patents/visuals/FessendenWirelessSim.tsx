"use client";

import { useEffect, useRef, useState } from "react";
import { stepFessendenWireless } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

export function FessendenWirelessSim() {
  const { params, updateParam } = usePatentPhysics("us-706737-fessenden-wireless");
  const carrierFreqKhz = params.carrierFrequencyKhz ?? 75;
  const audioModPct = params.audioModulationPct ?? 65;
  const antennaTuningUh = params.antennaTuningUh ?? 450;
  const distanceKm = params.transmissionDistanceKm ?? 25;
  const [isPlaying, setIsPlaying] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  const sim = stepFessendenWireless({
    carrierFrequencyKhz: carrierFreqKhz,
    audioModulationPct: audioModPct,
    antennaTuningUh: antennaTuningUh,
    transmissionDistanceKm: distanceKm,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;
      if (isPlaying) {
        timeRef.current += dt;
      }
      const t = timeRef.current;

      const w = canvas.width;
      const h = canvas.height;

      // Background
      ctx.fillStyle = "#090d16";
      ctx.fillRect(0, 0, w, h);

      // Grid / Blueprint lines
      ctx.strokeStyle = "rgba(30, 58, 138, 0.2)";
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

      // 1. Transmitter Station (Left)
      const txX = 140;
      const groundY = h - 80;

      // Ground plane
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(40, groundY);
      ctx.lineTo(w - 40, groundY);
      ctx.stroke();

      // Earth hash marks
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 1;
      for (let x = 50; x < w - 40; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, groundY);
        ctx.lineTo(x - 10, groundY + 12);
        ctx.stroke();
      }

      // RF Alternator (Dynamo 3)
      const dynamoX = txX - 60;
      const dynamoY = groundY - 40;
      ctx.fillStyle = "#1e293b";
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(dynamoX, dynamoY, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Rotating alternator rotor poles
      const rotorAngle = t * (carrierFreqKhz / 10);
      ctx.strokeStyle = "#0ea5e9";
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const ang = rotorAngle + (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(dynamoX, dynamoY);
        ctx.lineTo(dynamoX + Math.cos(ang) * 22, dynamoY + Math.sin(ang) * 22);
        ctx.stroke();
      }
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("RF Alternator", dynamoX, dynamoY + 40);

      // Series Tuning Inductor (Coil 2)
      const coilX = txX;
      const coilY = groundY - 40;
      ctx.strokeStyle = sim.isResonant ? "#10b981" : "#f59e0b";
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.arc(coilX - 15 + i * 8, coilY, 6, Math.PI, 0);
      }
      ctx.stroke();
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(`L = ${antennaTuningUh} µH`, coilX, coilY + 22);

      // Transmitter Cage Antenna (Mast 1)
      const mastTopY = 70;
      const mastBottomY = groundY - 70;
      const cageRadius = 16 * (sim.antennaCageDiameterM / 2.4);

      // Insulated mast spine
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(txX, mastBottomY);
      ctx.lineTo(txX, mastTopY);
      ctx.stroke();

      // Circular spreader rings (5)
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 2;
      for (let y = mastTopY; y <= mastBottomY; y += 45) {
        ctx.beginPath();
        ctx.ellipse(txX, y, cageRadius, 5, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Vertical cage wires (4) with live sinusoidal RF glow
      const rfPhase = t * carrierFreqKhz * 0.2;
      const currentAmp = Math.sin(rfPhase) * (sim.radiatedPowerWatts / 1000);
      ctx.strokeStyle = sim.isResonant
        ? `rgba(16, 185, 129, ${0.4 + Math.abs(currentAmp) * 0.6})`
        : `rgba(245, 158, 11, ${0.3 + Math.abs(currentAmp) * 0.4})`;
      ctx.lineWidth = 2;

      for (const offset of [-cageRadius, -cageRadius / 2, cageRadius / 2, cageRadius]) {
        ctx.beginPath();
        ctx.moveTo(txX + offset, mastTopY);
        ctx.lineTo(txX + offset, mastBottomY);
        ctx.stroke();
      }

      // Connecting lead to base
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(txX, mastBottomY);
      ctx.lineTo(txX, coilY);
      ctx.lineTo(dynamoX + 26, dynamoY);
      ctx.stroke();

      // 2. Continuous Electromagnetic Wavefronts (Poynting Flux)
      const rxX = w - 160;
      const waveStartX = txX + 25;
      const waveEndX = rxX - 25;
      const waveDist = waveEndX - waveStartX;

      const numWaves = 7;
      for (let i = 0; i < numWaves; i++) {
        const waveProgress = (t * sim.waveRingDisplayRate + i / numWaves) % 1;
        const _waveX = waveStartX + waveProgress * waveDist;
        const waveAlpha = Math.sin(waveProgress * Math.PI) * (sim.radiatedPowerWatts / 1000);
        const waveRadius = 40 + waveProgress * 120;

        ctx.strokeStyle = sim.isResonant
          ? `rgba(56, 189, 248, ${waveAlpha * 0.8})`
          : `rgba(245, 158, 11, ${waveAlpha * 0.4})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(waveStartX, (mastTopY + mastBottomY) / 2, waveRadius, -Math.PI / 3, Math.PI / 3);
        ctx.stroke();
      }

      // Continuous AM Modulated RF Carrier Trace (Mid-screen)
      const traceY = 80;
      const traceW = 200;
      const traceX = w / 2 - traceW / 2;

      ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 1;
      ctx.fillRect(traceX - 10, traceY - 40, traceW + 20, 80);
      ctx.strokeRect(traceX - 10, traceY - 40, traceW + 20, 80);

      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x <= traceW; x++) {
        const xNorm = x / traceW;
        const audioEnv =
          1 +
          (audioModPct / 100) * Math.sin(t * sim.audioEnvelopeOmegaRadPerS + xNorm * Math.PI * 4);
        const rfOsc = Math.sin(t * sim.rfTraceDisplayOmegaRadPerS + xNorm * Math.PI * 30);
        const yVal = traceY + rfOsc * audioEnv * 20 * (sim.radiatedPowerWatts / 1000);
        if (x === 0) ctx.moveTo(traceX + x, yVal);
        else ctx.lineTo(traceX + x, yVal);
      }
      ctx.stroke();
      ctx.fillStyle = "#94a3b8";
      ctx.font = "9px sans-serif";
      ctx.fillText("Modulated Carrier (AM)", traceX + traceW / 2, traceY + 34);

      // 3. Receiver Station (Right)
      // Receiver Aerial (10)
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(rxX, groundY - 30);
      ctx.lineTo(rxX, 85);
      ctx.stroke();

      // Top capacity hat / ring
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(rxX, 85, 20, 6, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#94a3b8";
      ctx.fillText("Aerial (10)", rxX, 70);

      // Liquid Barretter / Electrolytic Detector (12)
      const cupX = rxX + 50;
      const cupY = groundY - 60;

      // Glass acid cup (13)
      ctx.fillStyle = "rgba(56, 189, 248, 0.15)";
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.fillRect(cupX - 14, cupY, 28, 30);
      ctx.strokeRect(cupX - 14, cupY, 28, 30);

      // Dilute Nitric Acid Liquid Level
      ctx.fillStyle = "rgba(14, 165, 233, 0.4)";
      ctx.fillRect(cupX - 12, cupY + 10, 24, 18);

      // Wollaston microscopic platinum wire tip (14)
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cupX, cupY - 12);
      ctx.lineTo(cupX, cupY + 14);
      ctx.stroke();

      // Thermal micro-ionization glow at wire tip
      if (sim.receivedPowerMicrowatts > 0.05) {
        ctx.fillStyle = "rgba(251, 191, 36, 0.8)";
        ctx.beginPath();
        ctx.arc(
          cupX,
          cupY + 14,
          3 + Math.sin(t * sim.barretterGlowOmegaRadPerS) * 1.5,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }

      ctx.fillStyle = "#94a3b8";
      ctx.fillText("Liquid Barretter (12)", cupX, cupY + 44);

      // Telephone Earpiece Receiver (16)
      const phoneX = cupX + 45;
      const phoneY = groundY - 45;
      ctx.fillStyle = "#334155";
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(phoneX, phoneY, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Diaphragm acoustic vibration waves
      if (sim.audioSignalCurrentMicroamps > 0.5) {
        ctx.strokeStyle = "rgba(245, 158, 11, 0.7)";
        ctx.lineWidth = 1.5;
        const soundR = (t * sim.telephoneRingDisplayOmegaRadPerS) % 30;
        ctx.beginPath();
        ctx.arc(phoneX + 16, phoneY, soundR, -Math.PI / 4, Math.PI / 4);
        ctx.stroke();
      }
      ctx.fillStyle = "#94a3b8";
      ctx.fillText("Telephone (16)", phoneX, phoneY + 30);

      // Wiring connections in receiver loop
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(rxX, groundY - 30);
      ctx.lineTo(cupX - 10, cupY + 20); // aerial to base electrode
      ctx.moveTo(cupX, cupY - 12);
      ctx.lineTo(phoneX - 16, phoneY); // wire tip to phone
      ctx.moveTo(phoneX, phoneY + 16);
      ctx.lineTo(phoneX, groundY); // phone to ground
      ctx.stroke();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [carrierFreqKhz, audioModPct, antennaTuningUh, isPlaying, sim]);

  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 shadow-2xl">
      {/* HUD Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-wide text-cyan-400">
            Reginald Fessenden Continuous-Wave Radio & Electrolytic Detector
          </h2>
          <p className="text-sm text-slate-400">
            US Patent 706,737 • Uninterrupted Sinusoidal Radiation, Low-Loss Cage Aerials & Liquid
            Barretter
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${
              sim.isResonant
                ? "bg-emerald-950 text-emerald-300 border border-emerald-700"
                : "bg-amber-950 text-amber-300 border border-amber-700"
            }`}
          >
            {sim.isResonant ? "✓ Resonant Lock" : "⚠ Detuned (Off-Resonance)"}
          </span>
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-1.5 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition"
          >
            {isPlaying ? "Pause Simulation" : "Resume"}
          </button>
        </div>
      </div>

      {/* Interactive 2D Canvas */}
      <div className="relative w-full aspect-[16/9] bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
        <canvas ref={canvasRef} width={880} height={495} className="w-full h-full block" />
      </div>

      {/* Real-time SI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="text-xs text-slate-400 uppercase tracking-wider">Antenna Resonance</div>
          <div className="text-lg font-bold text-emerald-400">{sim.antennaResonantFreqKhz} kHz</div>
          <div className="text-xs text-slate-500">Δf = {sim.detuningKhz} kHz</div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="text-xs text-slate-400 uppercase tracking-wider">Radiated RF Power</div>
          <div className="text-lg font-bold text-cyan-400">{sim.radiatedPowerWatts} W</div>
          <div className="text-xs text-slate-500">Nominal 1 kW input</div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="text-xs text-slate-400 uppercase tracking-wider">
            Radiation Efficiency
          </div>
          <div className="text-lg font-bold text-emerald-400">{sim.radiationEfficiencyPct} %</div>
          <div className="text-xs text-slate-500">R_rad = {sim.radiationResistanceOhms} Ω</div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="text-xs text-slate-400 uppercase tracking-wider">Received Power (Rx)</div>
          <div className="text-lg font-bold text-purple-400">{sim.receivedPowerMicrowatts} µW</div>
          <div className="text-xs text-slate-500">At {distanceKm} km range</div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="text-xs text-slate-400 uppercase tracking-wider">Audio SNR</div>
          <div className="text-lg font-bold text-amber-400">{sim.audioSnrDb} dB</div>
          <div className="text-xs text-slate-500">Clear voice threshold</div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="text-xs text-slate-400 uppercase tracking-wider">Earpiece Volume</div>
          <div className="text-lg font-bold text-amber-400">{sim.audioSoundLevelDbSpl} dB SPL</div>
          <div className="text-xs text-slate-500">I_sig = {sim.audioSignalCurrentMicroamps} µA</div>
        </div>
      </div>

      {/* Interactive Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-900/60 p-4 rounded-lg border border-slate-800">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-300">RF Carrier Frequency</span>
            <span className="text-cyan-400 font-mono">{carrierFreqKhz} kHz</span>
          </div>
          <input
            type="range"
            min={40}
            max={120}
            step={1}
            value={carrierFreqKhz}
            onChange={(e) => updateParam("carrierFrequencyKhz", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
          <div className="text-xs text-slate-500 mt-1">
            High-frequency alternator generator speed
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-300">Audio Modulation Depth</span>
            <span className="text-cyan-400 font-mono">{audioModPct} %</span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={audioModPct}
            onChange={(e) => updateParam("audioModulationPct", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
          <div className="text-xs text-slate-500 mt-1">Carbon microphone acoustic modulation</div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-300">Antenna Tuning Coil (L)</span>
            <span className="text-cyan-400 font-mono">{antennaTuningUh} µH</span>
          </div>
          <input
            type="range"
            min={200}
            max={800}
            step={10}
            value={antennaTuningUh}
            onChange={(e) => updateParam("antennaTuningUh", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
          <div className="text-xs text-slate-500 mt-1">
            Adjustable series inductance for resonance
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-300">Transmission Distance</span>
            <span className="text-cyan-400 font-mono">{distanceKm} km</span>
          </div>
          <input
            type="range"
            min={5}
            max={100}
            step={5}
            value={distanceKm}
            onChange={(e) => updateParam("transmissionDistanceKm", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
          <div className="text-xs text-slate-500 mt-1">
            Free-space & groundwave propagation loss
          </div>
        </div>
      </div>
    </div>
  );
}
