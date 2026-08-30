"use client";

import { RotateCcw, Sparkles, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TwoClocksStrip } from "@/components/patents/TwoClocksStrip";
import { stepTownesLaser } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";
import { useOffscreenGate } from "./useOffscreenGate";

interface TownesLaserSimProps {
  initialPumpPowerWatts?: number;
  initialCavityLengthCm?: number;
  initialMirror2ReflectivityPct?: number;
  initialBeamDiameterMm?: number;
}

export function TownesLaserSim({
  initialPumpPowerWatts = 350,
  initialCavityLengthCm = 25,
  initialMirror2ReflectivityPct = 94,
  initialBeamDiameterMm = 8,
}: TownesLaserSimProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { rootRef, onscreenRef } = useOffscreenGate<HTMLDivElement>();

  const { params, updateParam, resetParams } = usePatentPhysics("us-2929922-townes-laser");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const pumpPowerWatts = params.pumpPowerWatts ?? initialPumpPowerWatts;
  const cavityLengthCm = params.cavityLengthCm ?? initialCavityLengthCm;
  const mirror2ReflectivityPct = params.mirror2ReflectivityPct ?? initialMirror2ReflectivityPct;
  const beamDiameterMm = params.beamDiameterMm ?? initialBeamDiameterMm;
  const [activeMedium, setActiveMedium] = useState<
    "potassium_vapor" | "ruby_solid" | "he_ne_gas" | "nd_yag"
  >("potassium_vapor");

  const physics = stepTownesLaser({
    pumpPowerWatts,
    cavityLengthCm,
    mirror2ReflectivityPct,
    activeMedium,
    beamDiameterMm,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      if (!onscreenRef.current) return;
      phase += 0.08;

      const w = canvas.width;
      const h = canvas.height;

      // Dark quantum optics background
      ctx.fillStyle = "#050811";
      ctx.fillRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = "rgba(30, 41, 59, 0.35)";
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
      ctx.fillText("TOWNES & SCHAWLOW OPTICAL MASER / LASER SIMULATOR", 20, 26);
      ctx.font = "11px monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(
        `US 2,929,922 • Fabry-Pérot Open Cavity Resonator & Stimulated Emission (λ = ${physics.wavelengthNm} nm)`,
        20,
        42,
      );

      // ========================================================
      // 1. OPTICAL CAVITY RESONATOR (Left/Center: x: 50 to 330, y: 70 to 190)
      // ========================================================
      const cavX = 50;
      const cavY = 75;
      const cavW = 280;
      const cavH = 100;

      // Outer Pumping Lamp Glow (Yellow/Amber aura around tube)
      const pumpIntensity = Math.min(1.0, pumpPowerWatts / 800);
      ctx.fillStyle = `rgba(251, 191, 36, ${0.15 + pumpIntensity * 0.3})`;
      ctx.fillRect(cavX + 15, cavY - 8, cavW - 30, cavH + 16);

      // Glass Discharge Tube / Solid Rod
      ctx.fillStyle =
        activeMedium === "ruby_solid" ? "rgba(225, 29, 72, 0.25)" : "rgba(15, 23, 42, 0.8)";
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 2;
      ctx.fillRect(cavX + 20, cavY + 15, cavW - 40, cavH - 30);
      ctx.strokeRect(cavX + 20, cavY + 15, cavW - 40, cavH - 30);

      // Helical Flashlamp Coils
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 3;
      for (let x = cavX + 30; x < cavX + cavW - 35; x += 22) {
        ctx.beginPath();
        ctx.arc(x, cavY + 50, 42, -Math.PI / 3, Math.PI / 3);
        ctx.stroke();
      }

      // Rear High Reflector Mirror (R1 > 99.8%)
      ctx.fillStyle = "#e2e8f0";
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.fillRect(cavX + 10, cavY + 10, 10, cavH - 20);
      ctx.strokeRect(cavX + 10, cavY + 10, 10, cavH - 20);
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText("R1=99.8%", cavX - 8, cavY + 108);

      // Front Output Coupler Mirror (R2)
      ctx.fillStyle = "rgba(148, 163, 184, 0.7)";
      ctx.strokeStyle = "#38bdf8";
      ctx.fillRect(cavX + cavW - 20, cavY + 10, 10, cavH - 20);
      ctx.strokeRect(cavX + cavW - 20, cavY + 10, 10, cavH - 20);
      ctx.fillText(`R2=${mirror2ReflectivityPct}%`, cavX + cavW - 32, cavY + 108);

      // Open side boundary indicators (Mode diffraction loss)
      ctx.font = "8px monospace";
      ctx.fillStyle = "#64748b";
      ctx.fillText("▲ OPEN SIDES (OFF-AXIS DIFFRACTION LOSS) ▲", cavX + 32, cavY - 12);
      ctx.fillText("▼ OPEN SIDES (OFF-AXIS DIFFRACTION LOSS) ▼", cavX + 32, cavY + cavH + 20);

      // Lasing Standing Wave / Photons inside cavity
      if (physics.isLasing) {
        const beamColor =
          activeMedium === "ruby_solid"
            ? "#f43f5e"
            : activeMedium === "he_ne_gas"
              ? "#ef4444"
              : activeMedium === "nd_yag"
                ? "#a855f7"
                : "#38bdf8";

        // Coherent Standing Wave inside cavity
        ctx.strokeStyle = beamColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = cavX + 20; x <= cavX + cavW - 20; x += 2) {
          const k = 0.15;
          const y =
            cavY +
            50 +
            Math.sin((x - cavX) * k + phase) * 12 * (physics.intraCavityPowerWatts / 300);
          if (x === cavX + 20) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Extracted Laser Output Beam (Emerging rightward from R2)
        const beamW =
          physics.laserOutputPowerWatts > 0
            ? Math.min(18, 4 + physics.laserOutputPowerWatts * 0.1)
            : 0;
        ctx.fillStyle = beamColor;
        ctx.shadowColor = beamColor;
        ctx.shadowBlur = 15;
        ctx.fillRect(cavX + cavW - 10, cavY + 50 - beamW / 2, 280, beamW);
        ctx.shadowBlur = 0; // Reset

        // Output Beam Annotation
        ctx.font = "bold 10px monospace";
        ctx.fillStyle = beamColor;
        ctx.fillText(
          `COHERENT LASER BEAM (${physics.laserOutputPowerWatts} W, θ = ${physics.beamDivergenceMrad} mrad)`,
          cavX + cavW + 15,
          cavY + 40 - beamW / 2,
        );
      } else {
        // Below threshold - incoherent spontaneous glow
        ctx.fillStyle = "rgba(251, 191, 36, 0.4)";
        ctx.font = "italic 10px monospace";
        ctx.fillText("BELOW THRESHOLD (Spontaneous Incoherent Light Only)", cavX + 35, cavY + 54);
      }

      // ========================================================
      // 2. QUANTUM ENERGY LEVEL DIAGRAM (Top-Right: x: 370, y: 65, w: 250, h: 140)
      // ========================================================
      const qX = 370;
      const qY = 65;
      const qW = 250;
      const qH = 135;

      ctx.fillStyle = "#020617";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 1.5;
      ctx.fillRect(qX, qY, qW, qH);
      ctx.strokeRect(qX, qY, qW, qH);

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = "#38bdf8";
      ctx.fillText("QUANTUM ENERGY LEVELS & POPULATION", qX + 15, qY + 16);

      // Energy Level Lines (E1 ground, E2 upper laser, E3 pump level)
      const e1Y = qY + qH - 25; // Ground state E1 (4s)
      const e2Y = qY + 65; // Upper laser state E2 (5s)
      const e3Y = qY + 35; // Pump state E3 (5p)

      // E1 line
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(qX + 25, e1Y);
      ctx.lineTo(qX + qW - 25, e1Y);
      ctx.stroke();
      ctx.font = "9px monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText("E1 (Ground 4s)", qX + 30, e1Y + 14);

      // E2 line
      ctx.strokeStyle = "#22c55e";
      ctx.beginPath();
      ctx.moveTo(qX + 25, e2Y);
      ctx.lineTo(qX + qW - 25, e2Y);
      ctx.stroke();
      ctx.fillStyle = "#22c55e";
      ctx.fillText("E2 (Metastable 5s)", qX + 30, e2Y - 4);

      // E3 line
      ctx.strokeStyle = "#fbbf24";
      ctx.beginPath();
      ctx.moveTo(qX + 25, e3Y);
      ctx.lineTo(qX + qW - 25, e3Y);
      ctx.stroke();
      ctx.fillStyle = "#fbbf24";
      ctx.fillText("E3 (Pump 5p)", qX + 30, e3Y - 4);

      // Optical Pumping Arrow (E1 -> E3)
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(qX + 155, e1Y);
      ctx.lineTo(qX + 155, e3Y);
      ctx.stroke();
      ctx.fillText("Pump (Wp)", qX + 160, (e1Y + e3Y) / 2);

      // Non-radiative decay (E3 -> E2)
      ctx.strokeStyle = "#94a3b8";
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(qX + 185, e3Y);
      ctx.lineTo(qX + 185, e2Y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Stimulated Laser Transition Arrow (E2 -> E1)
      ctx.strokeStyle = physics.isLasing ? "#38bdf8" : "#64748b";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(qX + 215, e2Y);
      ctx.lineTo(qX + 215, e1Y);
      ctx.stroke();
      ctx.fillText("hν (Laser)", qX + 205, (e1Y + e2Y) / 2 + 10);

      // ========================================================
      // 3. L-I LASER POWER VS PUMP POWER CURVE (Bottom-Left: x: 50, y: 220)
      // ========================================================
      const liX = 50;
      const liY = 220;
      const liW = 280;
      const liH = 105;

      ctx.fillStyle = "#020617";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 1.5;
      ctx.fillRect(liX, liY, liW, liH);
      ctx.strokeRect(liX, liY, liW, liH);

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = "#38bdf8";
      ctx.fillText("LASER POWER CURVE: P_out vs P_pump", liX + 12, liY + 16);

      // Axes
      const liBaseY = liY + liH - 18;
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(liX + 25, liBaseY);
      ctx.lineTo(liX + liW - 15, liBaseY);
      ctx.moveTo(liX + 25, liBaseY);
      ctx.lineTo(liX + 25, liY + 22);
      ctx.stroke();

      // Plot curve: Threshold at 120W (x = liX + 25 + (120/1000)*230)
      const thX = liX + 25 + (120 / 1000) * 230;
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(liX + 25, liBaseY);
      ctx.lineTo(thX, liBaseY); // Below threshold zero power
      ctx.lineTo(liX + 25 + (1000 / 1000) * 230, liBaseY - (280 / 300) * 65); // Linear slope above threshold
      ctx.stroke();

      // Current Operating Q-Point
      const curX = liX + 25 + (pumpPowerWatts / 1000) * 230;
      const curY = physics.isLasing
        ? liBaseY - (physics.laserOutputPowerWatts / 300) * 65
        : liBaseY;
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(curX, curY, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = "8px monospace";
      ctx.fillText(`P_th: 120W`, thX - 18, liBaseY + 12);
      ctx.fillText(`${pumpPowerWatts}W`, curX - 10, liBaseY + 12);

      // ========================================================
      // 4. DIFFRACTION BEAM INTENSITY PROFILE (Bottom-Right: x: 370, y: 220)
      // ========================================================
      const profX = 370;
      const profY = 220;
      const profW = 250;
      const profH = 105;

      ctx.fillStyle = "#020617";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 1.5;
      ctx.fillRect(profX, profY, profW, profH);
      ctx.strokeRect(profX, profY, profW, profH);

      ctx.font = "bold 9px monospace";
      ctx.fillStyle = "#38bdf8";
      ctx.fillText("TEM00 GAUSSIAN INTENSITY PROFILE", profX + 15, profY + 16);

      // Plot Gaussian Beam Curve
      const profBaseY = profY + profH - 18;
      const profMidX = profX + profW / 2;
      ctx.strokeStyle = physics.isLasing ? "#22c55e" : "#64748b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = profX + 20; x <= profX + profW - 20; x += 2) {
        const dx = (x - profMidX) / 25;
        const gVal = Math.exp(-2 * dx * dx);
        const y = profBaseY - gVal * (physics.isLasing ? 65 : 10);
        if (x === profX + 20) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.font = "8px monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(
        `Beam Waist: w0 = ${(beamDiameterMm / 2).toFixed(1)} mm`,
        profX + 15,
        profBaseY + 12,
      );
      ctx.fillText(
        `Airy Divergence: ${physics.beamDivergenceMrad} mrad`,
        profX + 130,
        profBaseY + 12,
      );

      // ========================================================
      // 5. BOTTOM TELEMETRY STATUS BAR
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
      ctx.fillStyle = physics.isLasing ? "#22c55e" : "#ef4444";
      ctx.fillText(
        `STATUS: ${physics.isLasing ? "LASING COHERENT" : "BELOW THRESHOLD"}`,
        20,
        h - 22,
      );
      ctx.fillStyle = "#38bdf8";
      ctx.fillText(`OUTPUT: ${physics.laserOutputPowerWatts} W`, 200, h - 22);
      ctx.fillStyle = "#fbbf24";
      ctx.fillText(`GAIN THRESHOLD: ${physics.thresholdGainPerCm} cm⁻¹`, 330, h - 22);
      ctx.fillStyle = "#c084fc";
      ctx.fillText(`DIVERGENCE: ${physics.beamDivergenceMrad} mrad`, 510, h - 22);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [
    pumpPowerWatts,
    mirror2ReflectivityPct,
    beamDiameterMm,
    activeMedium,
    physics,
    onscreenRef.current,
  ]);

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
              Charles Townes &amp; Arthur Schawlow Optical Maser / Laser (US 2,929,922)
            </h3>
          </div>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400 mt-0.5">
            Fabry-Pérot resonant cavity, optical pumping threshold, and stimulated emission mode
            selection.
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
              setActiveMedium("potassium_vapor");
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-parchment-100/80 dark:bg-ink-900/60 rounded-xl border border-parchment-200 dark:border-ink-800">
        {/* Optical Pump Power */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-amber-600 dark:text-yellow-400">Pump Flash Power</span>
            <span className="font-mono text-amber-700 dark:text-yellow-300">
              {pumpPowerWatts} W
            </span>
          </div>
          <input
            type="range"
            min={50}
            max={1000}
            step={25}
            value={pumpPowerWatts}
            onChange={(e) => updateParam("pumpPowerWatts", Number(e.target.value))}
            className="w-full h-1.5 bg-parchment-300 dark:bg-ink-700 rounded-lg appearance-none cursor-pointer accent-amber-600 dark:accent-yellow-500"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400">Threshold ~120 W</span>
        </div>

        {/* Cavity Length */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-cyan-600 dark:text-cyan-400">Cavity Length (L)</span>
            <span className="font-mono text-cyan-700 dark:text-cyan-300">{cavityLengthCm} cm</span>
          </div>
          <input
            type="range"
            min={5}
            max={100}
            step={5}
            value={cavityLengthCm}
            onChange={(e) => updateParam("cavityLengthCm", Number(e.target.value))}
            className="w-full h-1.5 bg-parchment-300 dark:bg-ink-700 rounded-lg appearance-none cursor-pointer accent-cyan-600 dark:accent-cyan-500"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400">End mirror separation</span>
        </div>

        {/* Output Mirror Reflectivity */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-emerald-600 dark:text-emerald-400">Output Coupler R2</span>
            <span className="font-mono text-emerald-700 dark:text-emerald-300">
              {mirror2ReflectivityPct}%
            </span>
          </div>
          <input
            type="range"
            min={80}
            max={99.5}
            step={0.5}
            value={mirror2ReflectivityPct}
            onChange={(e) => updateParam("mirror2ReflectivityPct", Number(e.target.value))}
            className="w-full h-1.5 bg-parchment-300 dark:bg-ink-700 rounded-lg appearance-none cursor-pointer accent-emerald-600 dark:accent-emerald-500"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400">
            Front mirror reflection
          </span>
        </div>

        {/* Beam Diameter */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-purple-600 dark:text-purple-400">Aperture Diameter</span>
            <span className="font-mono text-purple-700 dark:text-purple-300">
              {beamDiameterMm} mm
            </span>
          </div>
          <input
            type="range"
            min={2}
            max={25}
            step={1}
            value={beamDiameterMm}
            onChange={(e) => updateParam("beamDiameterMm", Number(e.target.value))}
            className="w-full h-1.5 bg-parchment-300 dark:bg-ink-700 rounded-lg appearance-none cursor-pointer accent-purple-600 dark:accent-purple-500"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400">
            Diffraction divergence limit
          </span>
        </div>

        {/* Active Medium Selection */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="active-medium-select"
            className="text-xs font-semibold text-rose-600 dark:text-rose-400"
          >
            Active Medium
          </label>
          <select
            id="active-medium-select"
            value={activeMedium}
            onChange={(e) =>
              setActiveMedium(
                e.target.value as "potassium_vapor" | "ruby_solid" | "he_ne_gas" | "nd_yag",
              )
            }
            className="w-full py-1 px-2 text-xs bg-parchment-100 dark:bg-ink-800 text-ink-900 dark:text-parchment-200 rounded border border-parchment-300 dark:border-ink-700"
          >
            <option value="potassium_vapor">Potassium (3.14 µm)</option>
            <option value="ruby_solid">Ruby Rod (694.3 nm)</option>
            <option value="he_ne_gas">He-Ne Gas (632.8 nm)</option>
            <option value="nd_yag">Nd:YAG (1064 nm)</option>
          </select>
          <span className="text-[10px] text-ink-500 dark:text-ink-400">Laser transition media</span>
        </div>

        <div className="col-span-full">
          <TwoClocksStrip
            title="optical wave cycle vs cavity round-trip transit time"
            fast={{
              name: "Optical wave cycle (T)",
              period: ((physics.wavelengthNm / 1000) * 3.3356).toFixed(2),
              scale: "fs",
              detail:
                "Electromagnetic wave period for the selected atomic transition between stimulated energy levels.",
            }}
            slow={{
              name: "Cavity round-trip (t_rt)",
              period: ((2 * (cavityLengthCm / 100)) / 0.3).toFixed(2),
              scale: "ns",
              detail:
                "Round-trip photon transit time between the parallel Fabry-Perot end mirrors maintaining longitudinal modes.",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default TownesLaserSim;
