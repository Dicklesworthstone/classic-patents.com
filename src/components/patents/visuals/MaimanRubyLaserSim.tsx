"use client";

import { RotateCcw, Sparkles, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepMaimanRubyLaser } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";
import { useOffscreenGate } from "./useOffscreenGate";

interface MaimanRubyLaserSimProps {
  interactive?: boolean;
}

export function MaimanRubyLaserSim({ interactive = true }: MaimanRubyLaserSimProps) {
  const { params, updateParam, resetParams } = usePatentPhysics("us-3353115-maiman-ruby-laser");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFiring, setIsFiring] = useState(false);
  const { rootRef, onscreenRef } = useOffscreenGate<HTMLDivElement>();

  const pumpEnergy = params.pumpEnergyJoules ?? 150;
  const flashDuration = params.flashDurationMs ?? 1.0;
  const rodLength = params.rodLengthCm ?? 5.0;
  const outputReflectivity = params.outputMirrorReflectivity ?? 0.92;
  const temperature = params.crystalTemperatureKelvin ?? 300;

  const metrics = stepMaimanRubyLaser({
    pumpEnergyJoules: pumpEnergy,
    flashDurationMs: flashDuration,
    rodLengthCm: rodLength,
    outputMirrorReflectivity: outputReflectivity,
    crystalTemperatureKelvin: temperature,
  });

  const handleTriggerFlash = () => {
    setIsFiring(true);
    setTimeout(() => setIsFiring(false), 600);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let _time = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      if (!onscreenRef.current) return;
      _time += 0.03;
      const w = canvas.width;
      const h = canvas.height;

      // Dark quantum optics lab background
      ctx.fillStyle = "#0a0f1d";
      ctx.fillRect(0, 0, w, h);

      // Draw optical bench grid lines
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

      // Title & Architecture
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "bold 14px 'JetBrains Mono', monospace";
      ctx.fillText("RUBY OPTICAL MASER (LASER)", 24, 32);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "11px Inter, sans-serif";
      ctx.fillText(
        "Solid-State Optical Maser • Helical Xenon Flash Pumping • 3-Level Population Inversion • 694.3 nm Stimulated Emission",
        24,
        46,
      );

      // Layout: Left/Center = Laser Head Cross-Section; Right = 3-Level Quantum State Diagram
      const headX = 60;
      const headY = 80;
      const headW = 380;
      const headH = 220;

      // Outer polished aluminum cylindrical housing
      ctx.fillStyle = "#1e293b";
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(headX, headY, headW, headH, 8);
      ctx.fill();
      ctx.stroke();

      // Interior reflective chamber
      const chamberX = headX + 20;
      const chamberY = headY + 20;
      const chamberW = headW - 40;
      const chamberH = headH - 40;
      const chamberGrad = ctx.createLinearGradient(
        chamberX,
        chamberY,
        chamberX,
        chamberY + chamberH,
      );
      chamberGrad.addColorStop(0, "#0f172a");
      chamberGrad.addColorStop(0.5, isFiring ? "rgba(250, 204, 21, 0.25)" : "#1e293b");
      chamberGrad.addColorStop(1, "#0f172a");
      ctx.fillStyle = chamberGrad;
      ctx.fillRect(chamberX, chamberY, chamberW, chamberH);

      // Helical Xenon Flash Lamp Coils
      const coilCount = 8;
      const coilSpacing = chamberW / (coilCount + 1);
      ctx.strokeStyle = isFiring ? "#fef08a" : "rgba(148, 163, 184, 0.4)";
      ctx.lineWidth = isFiring ? 6 : 4;
      if (isFiring) {
        ctx.shadowColor = "#facc15";
        ctx.shadowBlur = 15;
      }
      for (let i = 1; i <= coilCount; i++) {
        const cx = chamberX + i * coilSpacing;
        ctx.beginPath();
        ctx.ellipse(cx, chamberY + chamberH / 2, 10, chamberH / 2 - 15, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // Synthetic Pink Ruby Rod (Cr3+:Al2O3) along axis
      const rodX = chamberX + 30;
      const rodY = chamberY + chamberH / 2 - 12;
      const rodW = chamberW - 60;
      const rodH = 24;

      const rubyGrad = ctx.createLinearGradient(rodX, rodY, rodX, rodY + rodH);
      rubyGrad.addColorStop(0, "#f43f5e");
      rubyGrad.addColorStop(0.5, isFiring && metrics.isLasing ? "#ffe4e6" : "#e11d48");
      rubyGrad.addColorStop(1, "#9f1239");
      ctx.fillStyle = rubyGrad;
      ctx.fillRect(rodX, rodY, rodW, rodH);

      // Rear 100% Silver Reflector Mirror (R1)
      ctx.fillStyle = "#cbd5e1";
      ctx.fillRect(rodX - 6, rodY - 4, 6, rodH + 8);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "9px monospace";
      ctx.fillText("R1 (99.9%)", rodX - 22, rodY - 8);

      // Front Output Coupler Mirror (R2)
      ctx.fillStyle = "#94a3b8";
      ctx.fillRect(rodX + rodW, rodY - 4, 6, rodH + 8);
      ctx.fillText(`R2 (${(outputReflectivity * 100).toFixed(0)}%)`, rodX + rodW - 10, rodY - 8);

      // Laser Output Beam Extraction (Collimated 694.3 nm Deep-Red)
      if (isFiring && metrics.isLasing) {
        const beamStartX = rodX + rodW + 6;
        const beamY = rodY + rodH / 2;
        const beamEndX = w - 40;

        ctx.strokeStyle = "#ff0033";
        ctx.lineWidth = 10;
        ctx.shadowColor = "#ff0033";
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.moveTo(beamStartX, beamY);
        ctx.lineTo(beamEndX, beamY);
        ctx.stroke();

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(beamStartX, beamY);
        ctx.lineTo(beamEndX, beamY);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Output beam label
        ctx.fillStyle = "#ff4d6d";
        ctx.font = "bold 11px monospace";
        ctx.fillText("λ = 694.3 nm (COHERENT BEAM)", beamStartX + 40, beamY - 14);
      }

      // ==========================================
      // Quantum Three-Level State Diagram (Right)
      // ==========================================
      const qX = 480;
      const qY = 80;
      const qW = w - qX - 24;
      const qH = 220;

      ctx.fillStyle = "#1e293b";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(qX, qY, qW, qH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 12px 'JetBrains Mono', monospace";
      ctx.fillText("3-LEVEL QUANTUM DYNAMICS", qX + 16, qY + 24);

      // Level 3: Pump Bands (4F1, 4F2 green/violet)
      const l3Y = qY + 55;
      ctx.fillStyle = "#10b981";
      ctx.fillRect(qX + 30, l3Y, qW - 60, 16);
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 10px monospace";
      ctx.fillText("LEVEL 3: PUMP BANDS (4F1/4F2, 410 & 560 nm)", qX + 40, l3Y + 12);

      // Level 2: Metastable 2E Doublet (694.3 nm)
      const l2Y = qY + 115;
      ctx.fillStyle = "#f43f5e";
      ctx.fillRect(qX + 30, l2Y, qW - 60, 12);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10px monospace";
      ctx.fillText("LEVEL 2: METASTABLE 2E (τ ≈ 3.0 ms)", qX + 40, l2Y + 10);

      // Level 1: Ground State 4A2
      const l1Y = qY + 185;
      ctx.fillStyle = "#3b82f6";
      ctx.fillRect(qX + 30, l1Y, qW - 60, 12);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10px monospace";
      ctx.fillText("LEVEL 1: GROUND STATE 4A2 (Cr3+)", qX + 40, l1Y + 10);

      // Transition Arrows & Quantum Rates
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(qX + 60, l1Y);
      ctx.lineTo(qX + 60, l3Y + 16);
      ctx.stroke();
      ctx.fillStyle = "#38bdf8";
      ctx.font = "9px monospace";
      ctx.fillText("Pump (W13)", qX + 65, (l1Y + l3Y) / 2 + 10);

      // Fast non-radiative decay arrow (phonon relaxation)
      ctx.strokeStyle = "#fbbf24";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(qX + qW / 2, l3Y + 16);
      ctx.lineTo(qX + qW / 2, l2Y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#fbbf24";
      ctx.fillText("Phonon Decay (~100 ps)", qX + qW / 2 + 6, (l3Y + l2Y) / 2 + 12);

      // Stimulated Emission Arrow (694.3 nm R1 line)
      ctx.strokeStyle = "#ff0033";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(qX + qW - 80, l2Y + 12);
      ctx.lineTo(qX + qW - 80, l1Y);
      ctx.stroke();
      ctx.fillStyle = "#ff4d6d";
      ctx.font = "bold 9px monospace";
      ctx.fillText("694.3 nm (hν)", qX + qW - 75, (l2Y + l1Y) / 2 + 5);

      // ==========================================
      // Telemetry HUD Bar (Bottom)
      // ==========================================
      const hudY = 320;
      const cardW = (w - 48 - 36) / 4;
      const cardH = 75;

      const hudCards = [
        {
          title: "PUMP ENERGY & THRESHOLD",
          value: `${pumpEnergy} J / ${metrics.thresholdPumpEnergyJoules} J`,
          desc: metrics.isLasing ? "✓ PUMP EXCEEDS THRESHOLD" : "✗ BELOW LASING THRESHOLD",
          highlight: metrics.isLasing,
        },
        {
          title: "INVERSION RATIO (N2/N1)",
          value: `${metrics.populationInversionRatio}×`,
          desc:
            metrics.populationInversionRatio > 1
              ? "POPULATION INVERTED (N2 > N1)"
              : "UNINVERTED (ABSORPTION)",
          highlight: metrics.populationInversionRatio > 1,
        },
        {
          title: "LASER OUTPUT PULSE",
          value: `${metrics.laserPulseEnergyJoules.toFixed(2)} J (${metrics.laserPeakPowerKw.toFixed(1)} kW)`,
          desc: metrics.isLasing
            ? "Spiked Relaxation Oscillation"
            : "Spontaneous Fluorescence Only",
          highlight: metrics.laserPulseEnergyJoules > 0,
        },
        {
          title: "EMISSION WAVELENGTH",
          value: `${metrics.emissionWavelengthNm} nm`,
          desc: `R1 Line (Ruby at ${temperature} K)`,
          highlight: true,
        },
      ];

      hudCards.forEach((card, idx) => {
        const cx = 24 + idx * (cardW + 12);
        ctx.fillStyle = card.highlight ? "rgba(15, 23, 42, 0.85)" : "rgba(15, 23, 42, 0.5)";
        ctx.strokeStyle = card.highlight ? "rgba(225, 29, 72, 0.5)" : "rgba(51, 65, 85, 0.5)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(cx, hudY, cardW, cardH, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#94a3b8";
        ctx.font = "9px 'JetBrains Mono', monospace";
        ctx.fillText(card.title, cx + 12, hudY + 20);

        ctx.fillStyle = card.highlight ? "#f43f5e" : "#e2e8f0";
        ctx.font = "bold 14px 'JetBrains Mono', monospace";
        ctx.fillText(card.value, cx + 12, hudY + 44);

        ctx.fillStyle = "#64748b";
        ctx.font = "10px Inter, sans-serif";
        ctx.fillText(card.desc, cx + 12, hudY + 62);
      });
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [pumpEnergy, outputReflectivity, temperature, isFiring, metrics, onscreenRef.current]);

  return (
    <div
      ref={rootRef}
      className="flex flex-col gap-4 rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors"
    >
      {/* Header with Title and Global Action Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
              Theodore Maiman Ruby Laser (US 3,353,115)
            </h3>
          </div>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400 mt-0.5">
            Solid-state ruby optical maser: xenon flashlamp excitation, Cr³⁺ 3-level population
            inversion, and 694.3 nm stimulated photon cascade.
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
              handleTriggerFlash();
              soundEngine.playSwitchClick();
            }}
            disabled={isFiring}
            aria-label="Trigger Flashlamp"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold transition-all shadow-sm disabled:opacity-50"
            title="Trigger Flashlamp"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isFiring ? "FIRING..." : "TRIGGER"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
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
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-parchment-300 dark:border-ink-800 bg-slate-950">
        <canvas ref={canvasRef} width={800} height={420} className="h-full w-full object-contain" />
      </div>

      {interactive && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-parchment-200 dark:border-ink-800/80 bg-parchment-100/80 dark:bg-ink-900/50 p-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="pumpEnergy"
                className="text-xs font-mono text-ink-700 dark:text-ink-400"
              >
                Flash Pump Energy:{" "}
                <span className="font-bold text-rose-600 dark:text-rose-400">{pumpEnergy} J</span>
              </label>
              <input
                id="pumpEnergy"
                type="range"
                min="50"
                max="500"
                step="10"
                value={pumpEnergy}
                onChange={(e) => updateParam("pumpEnergyJoules", Number(e.target.value))}
                className="h-1.5 w-36 accent-rose-600 dark:accent-rose-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="outputReflectivity"
                className="text-xs font-mono text-ink-700 dark:text-ink-400"
              >
                Output Mirror R2:{" "}
                <span className="font-bold text-cyan-600 dark:text-cyan-400">
                  {(outputReflectivity * 100).toFixed(0)}%
                </span>
              </label>
              <input
                id="outputReflectivity"
                type="range"
                min="0.70"
                max="0.98"
                step="0.01"
                value={outputReflectivity}
                onChange={(e) => updateParam("outputMirrorReflectivity", Number(e.target.value))}
                className="h-1.5 w-32 accent-cyan-600 dark:accent-rose-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="temperature"
                className="text-xs font-mono text-ink-700 dark:text-ink-400"
              >
                Crystal Temp:{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {temperature} K
                </span>
              </label>
              <input
                id="temperature"
                type="range"
                min="100"
                max="350"
                step="10"
                value={temperature}
                onChange={(e) => updateParam("crystalTemperatureKelvin", Number(e.target.value))}
                className="h-1.5 w-28 accent-emerald-600 dark:accent-rose-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
