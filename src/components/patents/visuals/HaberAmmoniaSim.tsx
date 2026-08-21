"use client";

import { Activity, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepHaberAmmonia } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";

interface HaberAmmoniaSimProps {
  initialPressureAtm?: number;
  initialTemperatureCelsius?: number;
  initialFeedFlowRateMolesPerSec?: number;
  initialCatalystActivity?: number;
}

export function HaberAmmoniaSim({
  initialPressureAtm = 175,
  initialTemperatureCelsius = 530,
  initialFeedFlowRateMolesPerSec = 50,
  initialCatalystActivity = 1.0,
}: HaberAmmoniaSimProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { params, updateParam, resetParams } = usePatentPhysics("us-971501-haber-ammonia");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const pressureAtm = params.pressureAtm ?? initialPressureAtm;
  const temperatureCelsius = params.temperatureCelsius ?? initialTemperatureCelsius;
  const feedFlowRateMolesPerSec = params.feedFlowRateMolesPerSec ?? initialFeedFlowRateMolesPerSec;
  const catalystActivity = params.catalystActivity ?? initialCatalystActivity;
  const [isPlaying, setIsPlaying] = useState(true);

  // Compute live physics
  const physics = stepHaberAmmonia({
    pressureAtm,
    temperatureCelsius,
    feedFlowRateMolesPerSec,
    catalystActivity,
  });
  const sourceBoundedVisualOnly = true;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      if (isPlaying) time += 0.025;

      const w = canvas.width;
      const h = canvas.height;

      // Background
      ctx.fillStyle = "#090d16";
      ctx.fillRect(0, 0, w, h);

      // Draw Grid / Flow Lines
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
      ctx.font = "bold 15px system-ui, -apple-system, sans-serif";
      ctx.fillText("HABER-BOSCH HIGH-PRESSURE CATALYTIC SYNTHESIS LOOP", 24, 30);
      ctx.font = "11px monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText("US 971,501 • 1 N₂ + 3 H₂ ⇌ 2 NH₃ (ΔH = -92.4 kJ/mol)", 24, 48);

      // ========================================================
      // 1. FEED COMPRESSOR & RECYCLE INJECTION (Left, x: 40-140)
      // ========================================================
      const compX = 50;
      const compY = 160;

      // Compressor Body
      ctx.fillStyle = "#1e293b";
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(compX, compY, 80, 110, 6);
      ctx.fill();
      ctx.stroke();

      // Reciprocating Piston
      const pistonOffset = Math.sin(time * physics.compressorDisplayOmegaRadPerS) * 16;
      ctx.fillStyle = "#334155";
      ctx.fillRect(compX + 15, compY + 25 + pistonOffset, 50, 20);
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 3;
      ctx.strokeRect(compX + 15, compY + 25 + pistonOffset, 50, 20);

      // Connecting Rod
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(compX + 40, compY + 35 + pistonOffset);
      ctx.lineTo(compX + 40, compY + 90);
      ctx.stroke();

      // Crankshaft Wheel
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(compX + 40, compY + 90, 16, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillText("COMPRESSOR", compX + 40, compY + 130);
      ctx.fillStyle = "#38bdf8";
      ctx.fillText(`${pressureAtm} atm`, compX + 40, compY + 144);
      ctx.textAlign = "left";

      // N2 / H2 Feed Pipe entering compressor
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(10, compY + 50);
      ctx.lineTo(compX, compY + 50);
      ctx.stroke();

      ctx.fillStyle = "#60a5fa";
      ctx.font = "9px monospace";
      ctx.fillText("N₂ + 3H₂ FEED", 10, compY + 42);

      // ========================================================
      // 2. COUNTER-CURRENT HEAT EXCHANGER (Center-Left, x: 180-260)
      // ========================================================
      const hxX = 180;
      const hxY = 100;
      const hxW = 70;
      const hxH = 220;

      // Heat Exchanger Shell
      ctx.fillStyle = "#0f172a";
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(hxX, hxY, hxW, hxH, 8);
      ctx.fill();
      ctx.stroke();

      // Internal Heat Exchanger Baffles
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      for (let y = hxY + 25; y < hxY + hxH - 20; y += 22) {
        ctx.beginPath();
        ctx.moveTo(hxX + 8, y);
        ctx.lineTo(hxX + hxW - 8, y);
        ctx.stroke();
      }

      // Hot return stream (inner coil)
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(hxX + hxW / 2, hxY + 10);
      ctx.lineTo(hxX + hxW / 2, hxY + hxH - 10);
      ctx.stroke();

      ctx.fillStyle = "#f87171";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillText("HEAT EXCHANGER", hxX + hxW / 2, hxY - 8);
      ctx.fillStyle = "#fdba74";
      ctx.fillText(
        `Preheat: ${physics.feedPreheatTemperatureCelsius}°C`,
        hxX + hxW / 2,
        hxY + hxH + 16,
      );
      ctx.textAlign = "left";

      // ========================================================
      // 3. SYNTHESIS CONVERTER REACTOR (Center-Right, x: 300-420)
      // ========================================================
      const rX = 300;
      const rY = 70;
      const rW = 120;
      const rH = 270;

      // Heavy Forged Steel Outer Wall
      ctx.fillStyle = "#1e293b";
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(rX, rY, rW, rH, 18);
      ctx.fill();
      ctx.stroke();

      // Reactor Flanges (Top and Bottom)
      ctx.fillStyle = "#475569";
      ctx.fillRect(rX - 8, rY + 8, rW + 16, 12);
      ctx.fillRect(rX - 8, rY + rH - 20, rW + 16, 12);

      // Catalyst Bed Cavity (Solid Osmium / Promoted Iron)
      const catY = rY + 45;
      const catH = rH - 90;
      const tempFactor = (temperatureCelsius - 350) / 300;
      const catGlowAlpha = 0.3 + tempFactor * 0.5;

      ctx.fillStyle = `rgba(245, 158, 11, ${catGlowAlpha})`;
      ctx.fillRect(rX + 16, catY, rW - 32, catH);
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(rX + 16, catY, rW - 32, catH);

      // Catalyst Granules Pattern
      for (let i = 0; i < 40; i++) {
        const gx = rX + 24 + ((i * 19) % (rW - 48));
        const gy = catY + 12 + ((i * 23) % (catH - 24));
        ctx.fillStyle = i % 2 === 0 ? "#78350f" : "#92400e";
        ctx.beginPath();
        ctx.arc(gx, gy, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Animated Gas Particles inside Catalyst
      const particleCount = 20;
      for (let i = 0; i < particleCount; i++) {
        const py = catY + ((time * physics.catalystParticleAdvance + i * 20) % catH);
        const px = rX + 28 + (Math.sin(time * physics.compressorDisplayOmegaRadPerS + i) * 20 + 20);
        const isNh3 = i < Math.floor(particleCount * (physics.ammoniaYieldPct / 100) * 4);

        ctx.fillStyle = isNh3 ? "#22d3ee" : "#f1f5f9";
        ctx.beginPath();
        ctx.arc(px, py, isNh3 ? 4 : 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "#fef08a";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillText("OSMIUM CATALYST", rX + rW / 2, rY + 30);
      ctx.fillStyle = "#f59e0b";
      ctx.fillText(`${temperatureCelsius} °C`, rX + rW / 2, rY + rH - 30);
      ctx.fillStyle = "#38bdf8";
      ctx.fillText(`Yield: ${physics.ammoniaYieldPct}%`, rX + rW / 2, rY + rH - 12);
      ctx.textAlign = "left";

      // ========================================================
      // 4. CHILLER CONDENSER & NH3 SEPARATOR (Right, x: 470-570)
      // ========================================================
      const sepX = 480;
      const sepY = 110;
      const sepW = 80;
      const sepH = 200;

      // Condenser Vessel
      ctx.fillStyle = "#0c4a6e";
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(sepX, sepY, sepW, sepH, 12);
      ctx.fill();
      ctx.stroke();

      // Cooling Coils
      ctx.strokeStyle = "#0284c7";
      ctx.lineWidth = 3;
      for (let y = sepY + 30; y < sepY + 110; y += 16) {
        ctx.beginPath();
        ctx.arc(sepX + sepW / 2, y, 22, 0, Math.PI);
        ctx.stroke();
      }

      // Liquid Ammonia Level at bottom
      const liquidH = Math.min(60, 20 + physics.ammoniaProductionKgPerHour * 0.4);
      ctx.fillStyle = "#06b6d4";
      ctx.fillRect(sepX + 4, sepY + sepH - liquidH - 4, sepW - 8, liquidH);

      // Liquid droplet drip animation
      const dripY = sepY + 110 + ((time * physics.condenserDripAdvance) % (sepH - 110 - liquidH));
      ctx.fillStyle = "#22d3ee";
      ctx.beginPath();
      ctx.arc(sepX + sepW / 2, dripY, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#bae6fd";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillText("CONDENSER", sepX + sepW / 2, sepY - 6);
      ctx.fillStyle = "#06b6d4";
      ctx.fillText("LIQUID NH₃", sepX + sepW / 2, sepY + sepH + 14);
      ctx.fillText(
        `${physics.ammoniaProductionKgPerHour} kg/hr`,
        sepX + sepW / 2,
        sepY + sepH + 28,
      );
      ctx.textAlign = "left";

      // Product Tap Valve at Bottom
      ctx.strokeStyle = "#06b6d4";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(sepX + sepW / 2, sepY + sepH);
      ctx.lineTo(sepX + sepW / 2, sepY + sepH + 35);
      ctx.stroke();

      // ========================================================
      // 5. RECYCLE LOOP PIPE (Top return, x: 520 -> 90)
      // ========================================================
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(sepX + sepW / 2, sepY);
      ctx.lineTo(sepX + sepW / 2, 55);
      ctx.lineTo(compX + 40, 55);
      ctx.lineTo(compX + 40, compY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#34d399";
      ctx.font = "9px monospace";
      ctx.fillText(`RECYCLE GAS (Ratio ${physics.recycleRatio}:1)`, 180, 48);

      // Piping connections between units
      // Compressor -> HX
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(compX + 80, compY + 50);
      ctx.lineTo(hxX, compY + 50);
      ctx.stroke();

      // HX -> Reactor Top
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(hxX + hxW, hxY + 30);
      ctx.lineTo(rX, rY + 30);
      ctx.stroke();

      // Reactor Bottom -> HX Bottom
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(rX, rY + rH - 30);
      ctx.lineTo(hxX + hxW, hxY + hxH - 30);
      ctx.stroke();

      // HX Bottom -> Condenser Top
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(hxX + hxW / 2, hxY + hxH);
      ctx.lineTo(hxX + hxW / 2, 345);
      ctx.lineTo(sepX + sepW / 2, 345);
      ctx.lineTo(sepX + sepW / 2, sepY + sepH);
      ctx.stroke();

      // ========================================================
      // 6. BOTTOM TELEMETRY BAR
      // ========================================================
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, h - 50, w, 50);
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h - 50);
      ctx.lineTo(w, h - 50);
      ctx.stroke();

      ctx.font = "11px monospace";
      ctx.fillStyle = "#38bdf8";
      ctx.fillText(`PRESSURE: ${physics.pressureAtm} atm (${physics.pressureMpa} MPa)`, 20, h - 28);
      ctx.fillStyle = "#f59e0b";
      ctx.fillText(`TEMP: ${physics.catalystTemperatureCelsius} °C`, 220, h - 28);
      ctx.fillStyle = "#34d399";
      ctx.fillText(`YIELD: ${physics.ammoniaYieldPct}%`, 360, h - 28);
      ctx.fillStyle = "#a855f7";
      ctx.fillText(`EXOTHERM: ${physics.reactionHeatGeneratedKw} kW`, 480, h - 28);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [pressureAtm, temperatureCelsius, isPlaying, physics]);

  if (sourceBoundedVisualOnly) {
    return (
      <section
        aria-labelledby="haber-source-bounded-heading"
        className="flex flex-col gap-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-slate-900 shadow-md dark:border-amber-800 dark:bg-slate-950 dark:text-slate-100 sm:p-6"
      >
        <div className="border-b border-amber-200 pb-3 dark:border-amber-900">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-amber-700 dark:text-amber-400" />
            <h3 id="haber-source-bounded-heading" className="font-serif text-lg font-bold">
              US 971,501: Osmium Catalytic Contact
            </h3>
          </div>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Source-bounded chemistry instrument. The one-page grant has no drawing and does not
            disclose a compressor, heat exchanger, condenser, or recycle loop.
          </p>
        </div>

        <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Pressure
            </div>
            <div className="font-mono text-xl text-cyan-700 dark:text-cyan-300">
              {physics.pressureAtm} atm
            </div>
            <div className="text-[11px] text-slate-500">The grant prefers 100–200 atm.</div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Example temperature
            </div>
            <div className="font-mono text-xl text-amber-700 dark:text-amber-300">
              {physics.catalystTemperatureCelsius} °C
            </div>
            <div className="text-[11px] text-slate-500">The example states about 550 °C.</div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Host model yield
            </div>
            <div className="font-mono text-xl text-emerald-700 dark:text-emerald-300">
              {physics.ammoniaYieldPct}% NH₃
            </div>
            <div className="text-[11px] text-slate-500">The example reports 8% by volume.</div>
          </div>
        </div>

        <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
          The controls expose the host SI interpretation of pressure, temperature, feed amount, and
          catalyst activity. The canvas process-loop sketch remains disabled until a source drawing
          or separately accepted apparatus record exists.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["pressureAtm", "Pressure", pressureAtm, 50, 300, 5, "atm"],
            ["temperatureCelsius", "Catalyst temperature", temperatureCelsius, 350, 650, 5, "°C"],
            [
              "feedFlowRateMolesPerSec",
              "Reactant feed",
              feedFlowRateMolesPerSec,
              10,
              100,
              2,
              "mol/s",
            ],
            ["catalystActivity", "Catalyst activity", catalystActivity, 0.2, 2, 0.1, "×"],
          ].map(([id, label, value, min, max, step, unit]) => (
            <label key={id as string} className="flex flex-col gap-1 text-xs font-semibold">
              <span className="flex justify-between gap-2">
                <span>{label as string}</span>
                <span className="font-mono text-slate-600 dark:text-slate-300">
                  {Number(value).toFixed(id === "catalystActivity" ? 1 : 0)} {unit as string}
                </span>
              </span>
              <input
                aria-label={label as string}
                type="range"
                min={min as number}
                max={max as number}
                step={step as number}
                value={value as number}
                onChange={(event) => updateParam(id as string, Number(event.target.value))}
                className="accent-amber-600"
              />
            </label>
          ))}
        </div>

        <button
          type="button"
          onClick={resetParams}
          className="self-start rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold hover:bg-white dark:border-slate-700 dark:hover:bg-slate-900"
        >
          Reset source-bounded controls
        </button>
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-parchment-300 dark:border-slate-800 bg-parchment-50 dark:bg-slate-950 p-4 sm:p-6 text-ink-900 dark:text-slate-100 shadow-md transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
              Fritz Haber Catalytic High-Pressure Ammonia Synthesis (US 971,501)
            </h3>
          </div>
          <p className="font-sans text-xs text-ink-500 dark:text-slate-400 mt-0.5">
            Super-atmospheric compression loop, catalytic equilibrium kinetics, and exothermic heat
            recovery.
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setIsPlaying(!isPlaying);
              soundEngine.playSwitchClick();
            }}
            className={`p-2 rounded-lg transition-colors border shadow-sm ${
              isPlaying
                ? "bg-sky-600 text-white border-sky-700"
                : "bg-parchment-200 dark:bg-slate-800 text-ink-800 dark:text-parchment-200 border-parchment-300 dark:border-slate-700 hover:bg-parchment-300"
            }`}
            title={isPlaying ? "Pause Synthesis Loop" : "Run Synthesis Loop"}
            aria-label={isPlaying ? "Pause Synthesis Loop" : "Run Synthesis Loop"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              toggleSound();
              soundEngine.playSwitchClick();
            }}
            aria-label={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-slate-800 hover:bg-parchment-300 dark:hover:bg-slate-700 text-ink-800 dark:text-parchment-200 transition-colors"
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              resetParams();
              setIsPlaying(true);
              soundEngine.playSwitchClick();
            }}
            aria-label="Reset Simulation"
            className="p-2 rounded-lg bg-parchment-200 dark:bg-slate-800 hover:bg-parchment-300 dark:hover:bg-slate-700 text-ink-800 dark:text-parchment-200 transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2D Canvas Viewport */}
      <div className="relative w-full aspect-[16/9] max-h-[520px] rounded-xl overflow-hidden border border-parchment-300 dark:border-slate-800 bg-slate-950">
        <canvas ref={canvasRef} width={640} height={380} className="w-full h-full object-contain" />
      </div>

      {/* Control Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-parchment-100/80 dark:bg-slate-900/60 rounded-xl border border-parchment-200 dark:border-slate-800">
        {/* Reactor Pressure */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-cyan-400">Reactor Pressure</span>
            <span className="font-mono text-cyan-300">{pressureAtm} atm</span>
          </div>
          <input
            type="range"
            min={50}
            max={300}
            step={5}
            value={pressureAtm}
            onChange={(e) => updateParam("pressureAtm", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <span className="text-[10px] text-slate-400">Super-atmospheric compression</span>
        </div>

        {/* Catalyst Bed Temperature */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-amber-400">Catalyst Temp</span>
            <span className="font-mono text-amber-300">{temperatureCelsius} °C</span>
          </div>
          <input
            type="range"
            min={350}
            max={650}
            step={5}
            value={temperatureCelsius}
            onChange={(e) => updateParam("temperatureCelsius", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <span className="text-[10px] text-slate-400">Kinetic rate vs equilibrium yield</span>
        </div>

        {/* Feed Gas Flow Rate */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-emerald-400">Feed Flow Rate</span>
            <span className="font-mono text-emerald-300">{feedFlowRateMolesPerSec} mol/s</span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            step={2}
            value={feedFlowRateMolesPerSec}
            onChange={(e) => updateParam("feedFlowRateMolesPerSec", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <span className="text-[10px] text-slate-400">1 N₂ : 3 H₂ stoichiometric feed</span>
        </div>

        {/* Catalyst Activity */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-purple-400">Catalyst Activity</span>
            <span className="font-mono text-purple-300">{catalystActivity.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min={0.2}
            max={2.0}
            step={0.1}
            value={catalystActivity}
            onChange={(e) => updateParam("catalystActivity", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <span className="text-[10px] text-slate-400">Osmium / Promoted Fe contact mass</span>
        </div>
      </div>
    </div>
  );
}

export default HaberAmmoniaSim;
