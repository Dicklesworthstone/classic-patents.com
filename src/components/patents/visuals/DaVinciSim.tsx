"use client";

import { Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { stepDaVinci } from "@/physics/daVinciKernel";
import { createStudioClock } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";
import { useOffscreenGate } from "./useOffscreenGate";

interface DaVinciSimProps {
  initialMotionScale?: number;
  initialTremorFilter?: boolean;
}

export function DaVinciSim({
  initialMotionScale = 3.0,
  initialTremorFilter = true,
}: DaVinciSimProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { rootRef, onscreenRef } = useOffscreenGate<HTMLDivElement>();
  const motionScaleId = useId();
  const speedId = useId();
  const gripId = useId();

  const { params, updateParam, resetParams } = usePatentPhysics("us-6331181-davinci");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const motionScale = params.motionScaleRatio ?? initialMotionScale;
  const tremorFilter = (params.tremorFilterEnabled ?? (initialTremorFilter ? 1 : 0)) === 1;
  const inputSpeed = params.masterInputSpeedMps ?? 0.5;
  const gripAngleDeg = params.gripAngleDeg ?? 30;

  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let timeSec = 0;
    const clock = createStudioClock();
    let state = stepDaVinci(
      {
        motionScaleRatio: motionScale,
        tremorFilterEnabled: tremorFilter,
        masterInputSpeedMps: inputSpeed,
        gripAngleDeg,
      },
      0,
    );

    const render = (now: number) => {
      animId = requestAnimationFrame(render);
      if (!onscreenRef.current) return;
      if (isPlaying) {
        const { simTimeSec } = clock.pump(now);
        timeSec = simTimeSec;
        state = stepDaVinci(
          {
            motionScaleRatio: motionScale,
            tremorFilterEnabled: tremorFilter,
            masterInputSpeedMps: inputSpeed,
            gripAngleDeg,
          },
          timeSec,
          state,
        );
      }

      const w = canvas.width;
      const h = canvas.height;

      // Dark surgical UI background
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
      ctx.fillText("US 6,331,181 SURGICAL TOOL INTERFACE INSTRUMENT", 20, 26);
      ctx.font = "11px monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(
        `US 6,331,181 • Tool-interface data path • Compatibility: ${tremorFilter ? "PRESENT" : "ABSENT"} • Illustrative offset: ${motionScale.toFixed(1)}`,
        20,
        42,
      );

      // ========================================================
      // 1. MASTER SURGEON CONSOLE (Left Pane: x: 40 to 360, y: 65 to 325)
      // ========================================================
      const mX = 40;
      const mY = 65;
      const mW = 320;
      const mH = 260;

      ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(mX, mY, mW, mH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#60a5fa";
      ctx.font = "bold 11px system-ui, sans-serif";
      ctx.fillText("MASTER CONSOLE (Surgeon Hand Grip)", mX + 12, mY + 22);

      // Master Workspace Center
      const mCenterX = mX + mW / 2;
      const mCenterY = mY + mH / 2 + 10;

      // Coordinate axes
      ctx.strokeStyle = "rgba(71, 85, 105, 0.5)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(mCenterX - 90, mCenterY);
      ctx.lineTo(mCenterX + 90, mCenterY);
      ctx.moveTo(mCenterX, mCenterY - 70);
      ctx.lineTo(mCenterX, mCenterY + 70);
      ctx.stroke();
      ctx.setLineDash([]);

      // Master Hand Grip Position (with tremor if unfiltered)
      const mHandX = mCenterX + state.masterX * 240;
      const mHandY = mCenterY + state.masterY * 240;

      // Master Hand Gimbal Rings
      ctx.strokeStyle = "#93c5fd";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(mHandX, mHandY, 22, 0, Math.PI * 2);
      ctx.stroke();

      // Master Pinchers / Finger Loops
      ctx.fillStyle = "#3b82f6";
      ctx.beginPath();
      ctx.arc(mHandX - 12, mHandY, 6, 0, Math.PI * 2);
      ctx.arc(mHandX + 12, mHandY, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#bfdbfe";
      ctx.font = "10px monospace";
      ctx.fillText(
        `X: ${(state.masterX * 100).toFixed(1)} mm  Y: ${(state.masterY * 100).toFixed(1)} mm`,
        mX + 12,
        mY + mH - 14,
      );

      // ========================================================
      // 2. PATIENT ANATOMY & SLAVE ENDOWRIST (Right Pane: x: 400 to 740, y: 65 to 325)
      // ========================================================
      const sX = 400;
      const sY = 65;
      const sW = 340;
      const sH = 260;

      ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(sX, sY, sW, sH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#34d399";
      ctx.font = "bold 11px system-ui, sans-serif";
      ctx.fillText("PATIENT SURGICAL SITE (illustrative distal tool)", sX + 12, sY + 22);

      // Trocar Cannula Port (Fulcrum Inversion Constraint)
      const trocarX = sX + sW / 2;
      const trocarY = sY + 50;

      // Abdominal Wall
      ctx.fillStyle = "rgba(244, 63, 94, 0.2)";
      ctx.fillRect(sX + 20, trocarY - 6, sW - 40, 12);
      ctx.strokeStyle = "#f43f5e";
      ctx.lineWidth = 1;
      ctx.strokeRect(sX + 20, trocarY - 6, sW - 40, 12);

      ctx.fillStyle = "#fda4af";
      ctx.font = "9px monospace";
      ctx.fillText("TROCAR CANNULA (8mm Port Fulcrum)", sX + 25, trocarY - 10);

      // Slave Instrument Shaft passing through Trocar
      const sTipX =
        trocarX + state.slaveX * 240 * (1.0 / (motionScale > 1 ? motionScale * 0.35 : 1));
      const sTipY =
        trocarY + 110 + state.slaveY * 240 * (1.0 / (motionScale > 1 ? motionScale * 0.35 : 1));

      // Shaft Line
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(trocarX, trocarY - 20);
      ctx.lineTo(sTipX, sTipY - 25);
      ctx.stroke();

      // Trocar Pivot Bushing
      ctx.fillStyle = "#334155";
      ctx.strokeStyle = "#0284c7";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(trocarX, trocarY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // EndoWrist Articulation Joints (Pitch / Yaw Pulleys)
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(sTipX, sTipY - 25, 5, 0, Math.PI * 2);
      ctx.fill();

      // Wrist clevis to tip
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(sTipX, sTipY - 25);
      ctx.lineTo(sTipX, sTipY - 6);
      ctx.stroke();

      // Micro-Forceps Jaws (Grip Angle)
      const halfGrip = state.gripRad / 2;
      const jawLen = 14;
      ctx.strokeStyle = state.isGrasped ? "#34d399" : state.isColliding ? "#f43f5e" : "#10b981";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(sTipX, sTipY - 6);
      ctx.lineTo(sTipX - Math.sin(halfGrip) * jawLen, sTipY - 6 + Math.cos(halfGrip) * jawLen);
      ctx.moveTo(sTipX, sTipY - 6);
      ctx.lineTo(sTipX + Math.sin(halfGrip) * jawLen, sTipY - 6 + Math.cos(halfGrip) * jawLen);
      ctx.stroke();

      // ========================================================
      // 2B. COFFEE CUP OBSTACLE & ANTI-CLIPPING BOUNDARY
      // ========================================================
      const cupCanvasX = sX + sW / 2 + state.cupX * 220;
      const cupCanvasY = sY + 180 + (state.cupY + 0.15) * 180;
      const cupCanvasR = 18;
      const cupCanvasH = 28;

      // Cup Shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.beginPath();
      ctx.ellipse(cupCanvasX, cupCanvasY + cupCanvasH / 2, cupCanvasR + 2, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cup Body
      ctx.fillStyle = state.isGrasped
        ? "rgba(16, 185, 129, 0.35)"
        : state.isCupContact
          ? "rgba(244, 63, 94, 0.35)"
          : "rgba(248, 250, 252, 0.2)";
      ctx.strokeStyle = state.isGrasped ? "#10b981" : state.isCupContact ? "#ef4444" : "#e2e8f0";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(
        cupCanvasX - cupCanvasR,
        cupCanvasY - cupCanvasH / 2,
        cupCanvasR * 2,
        cupCanvasH,
        4,
      );
      ctx.fill();
      ctx.stroke();

      // Cup Handle
      ctx.strokeStyle = state.isCupContact ? "#ef4444" : "#cbd5e1";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cupCanvasX + cupCanvasR + 4, cupCanvasY, 7, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();

      // Coffee Liquid Top
      ctx.fillStyle = "#3b1d11";
      ctx.beginPath();
      ctx.ellipse(
        cupCanvasX,
        cupCanvasY - cupCanvasH / 2 + 2,
        cupCanvasR - 2,
        3,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();

      // Cup Label & State
      ctx.font = "8px monospace";
      ctx.fillStyle = state.isGrasped ? "#34d399" : state.isCupContact ? "#f87171" : "#94a3b8";
      ctx.fillText(
        state.isGrasped
          ? "CUP (GRASPED)"
          : state.isCupContact
            ? `CUP HIT (${state.contactForceN.toFixed(1)}N)`
            : "COFFEE CUP",
        cupCanvasX - 22,
        cupCanvasY + cupCanvasH / 2 + 12,
      );

      // Contact Spark / Normal line if colliding
      if (state.isColliding) {
        ctx.strokeStyle = "#fbbf24";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(sTipX, sTipY, 5, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = "#6ee7b7";
      ctx.font = "10px monospace";
      ctx.fillText(
        `Tip: ${state.tipVelocityMms.toFixed(1)} mm/s | Collision: ${state.isGrasped ? "GRASPED" : state.isColliding ? "CONTACT (RESOLVED)" : "CLEAR"}`,
        sX + 12,
        sY + sH - 14,
      );

      // Connecting Digital Signal Stream (Center bridge)
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(mX + mW, mY + mH / 2);
      ctx.lineTo(sX, sY + mH / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 9px monospace";
      ctx.fillText("PROCESSOR DATA BUS", (mX + mW + sX) / 2 - 45, mY + mH / 2 - 8);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [motionScale, tremorFilter, inputSpeed, gripAngleDeg, isPlaying, onscreenRef.current]);

  return (
    <div
      ref={rootRef}
      className="w-full flex flex-col gap-4 p-4 sm:p-6 rounded-2xl bg-parchment-50 dark:bg-ink-950 border border-parchment-300 dark:border-ink-800 text-ink-900 dark:text-parchment-100 shadow-md"
    >
      {/* Header with Title and Global Action Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3">
        <div>
          <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
            Surgical Tool Data Interface (US 6,331,181)
          </h3>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400">
            Source-bounded tool interface: compatibility, tool type, measured calibration offsets,
            and engagement data cross the processor boundary.
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
              setIsPlaying(!isPlaying);
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-parchment-100/80 dark:bg-ink-900/70 border border-parchment-200 dark:border-ink-800/80 text-xs">
        {/* Motion Scaling Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between font-mono text-ink-700 dark:text-parchment-300">
            <label htmlFor={motionScaleId}>Illustrative calibration offset:</label>
            <span className="text-amber-600 dark:text-amber-400 font-bold">
              {motionScale.toFixed(1)}
            </span>
          </div>
          <input
            id={motionScaleId}
            type="range"
            min="1.0"
            max="10.0"
            step="0.5"
            value={motionScale}
            onChange={(e) => updateParam("motionScaleRatio", parseFloat(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-500">
            Numeric value is illustrative; the grant claims stored measured offsets, not a ratio.
          </span>
        </div>

        {/* Input Trajectory Speed */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between font-mono text-ink-700 dark:text-parchment-300">
            <label htmlFor={speedId}>Illustrative drive speed:</label>
            <span className="text-cyan-600 dark:text-cyan-400 font-bold">
              {inputSpeed.toFixed(2)} m/s
            </span>
          </div>
          <input
            id={speedId}
            type="range"
            min="0.2"
            max="1.5"
            step="0.05"
            value={inputSpeed}
            onChange={(e) => updateParam("masterInputSpeedMps", parseFloat(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-500">
            Presentation-only motion for the explanatory instrument
          </span>
        </div>

        {/* Micro-Forceps Jaw Grip */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between font-mono text-ink-700 dark:text-parchment-300">
            <label htmlFor={gripId}>Illustrative end-effector angle:</label>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              {gripAngleDeg}°
            </span>
          </div>
          <input
            id={gripId}
            type="range"
            min="0"
            max="60"
            step="2"
            value={gripAngleDeg}
            onChange={(e) => updateParam("gripAngleDeg", parseFloat(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-500">
            Presentation-only distal pose; not a numeric claim limitation
          </span>
        </div>
      </div>

      {/* Button Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              updateParam("tremorFilterEnabled", tremorFilter ? 0 : 1);
              soundEngine.playSwitchClick();
            }}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold border transition-all ${
              tremorFilter
                ? "bg-emerald-100 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-500/80 text-emerald-800 dark:text-emerald-300"
                : "bg-parchment-100 dark:bg-ink-900 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-ink-400 hover:text-ink-900 dark:hover:text-neutral-200"
            }`}
          >
            {tremorFilter ? "✓ Compatibility signal: PRESENT" : "✗ Compatibility signal: ABSENT"}
          </button>
        </div>

        <span className="text-[11px] font-mono text-ink-500 dark:text-ink-400">
          Tool-boundary probe:{" "}
          <span className="text-indigo-600 dark:text-indigo-400">
            compatibility and calibration data
          </span>
        </span>
      </div>
    </div>
  );
}
