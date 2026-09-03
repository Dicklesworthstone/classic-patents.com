"use client";

import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { stepMultiTouch } from "@/physics/multiTouchKernel";
import { createStudioClock } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { SimulationHeader } from "./SimulationHeader";
import { usePatentAudio } from "./three/usePatentAudio";
import { useOffscreenGate } from "./useOffscreenGate";

interface MultiTouchSimProps {
  initialFingerCount?: number;
  initialSeparationMm?: number;
  initialPressureGrams?: number;
}

export function MultiTouchSim({
  initialFingerCount = 2,
  initialSeparationMm = 50,
  initialPressureGrams = 80,
}: MultiTouchSimProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sepId = useId();
  const pressureId = useId();
  const { rootRef, onscreenRef } = useOffscreenGate<HTMLDivElement>();

  const { params, updateParam, resetParams } = usePatentPhysics("us-7479949-multitouch");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const fingerCount = Math.round(params.fingerCount ?? initialFingerCount);
  const separationMm = params.fingerSeparationMm ?? initialSeparationMm;
  const pressureGrams = params.touchPressureGrams ?? initialPressureGrams;
  const gestureVelocityMmS = params.gestureVelocityMmS ?? 15;

  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let timeSec = 0;
    const clock = createStudioClock();
    let state = stepMultiTouch(
      {
        fingerCount,
        fingerSeparationMm: separationMm,
        touchPressureGrams: pressureGrams,
        gestureVelocityMmS,
      },
      0,
    );

    const render = (now: number) => {
      animId = requestAnimationFrame(render);
      if (!onscreenRef.current) return;
      if (isPlaying) {
        const { simTimeSec } = clock.pump(now);
        timeSec = simTimeSec;
        state = stepMultiTouch(
          {
            fingerCount,
            fingerSeparationMm: separationMm,
            touchPressureGrams: pressureGrams,
            gestureVelocityMmS,
          },
          timeSec,
          state,
        );
      }

      const w = canvas.width;
      const h = canvas.height;

      // Dark capacitive UI background
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
      ctx.fillText("APPLE MULTI-TOUCH CAPACITIVE GESTURE HEURISTICS", 20, 26);
      ctx.font = "11px monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(
        `US 7,479,949 • Mutual Capacitance Sensor Matrix • Fingers: ${fingerCount} • Separation: ${separationMm.toFixed(0)}mm • Mode: ${state.gestureMode}`,
        20,
        42,
      );

      // ========================================================
      // 1. INTERACTIVE TOUCHSCREEN GLASS SURFACE (Left Pane: x: 40 to 390, y: 65 to 325)
      // ========================================================
      const tX = 40;
      const tY = 65;
      const tW = 350;
      const tH = 260;

      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(tX, tY, tW, tH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 11px system-ui, sans-serif";
      ctx.fillText("CAPACITIVE TOUCH DISPLAY SURFACE", tX + 12, tY + 22);

      // Screen center
      const sCenterX = tX + tW / 2;
      const sCenterY = tY + tH / 2 + 10;

      // Scaled Document / Image Box under fingers
      const docBaseW = 120;
      const docBaseH = 80;
      const curW = docBaseW * state.zoomScale;
      const curH = docBaseH * state.zoomScale;

      ctx.save();
      ctx.translate(sCenterX, sCenterY);
      if (state.gestureMode === "Two-Finger Rotate") {
        ctx.rotate((state.rotationAngleDeg * Math.PI) / 180);
      }

      ctx.fillStyle = "rgba(59, 130, 246, 0.2)";
      ctx.fillRect(-curW / 2, -curH / 2, curW, curH);
      ctx.strokeStyle = "#60a5fa";
      ctx.lineWidth = 2;
      ctx.strokeRect(-curW / 2, -curH / 2, curW, curH);

      // Photo placeholder icon
      ctx.strokeStyle = "rgba(147, 197, 253, 0.5)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-curW / 3, curH / 4);
      ctx.lineTo(-curW / 10, -curH / 6);
      ctx.lineTo(curW / 8, curH / 6);
      ctx.lineTo(curW / 3, -curH / 4);
      ctx.lineTo(curW / 2.5, curH / 4);
      ctx.stroke();

      ctx.restore();

      // Draw Touch Contact Points
      const mapX = (normX: number) => sCenterX + normX * (tW * 0.38);
      const mapY = (normY: number) => sCenterY + normY * (tH * 0.38);

      if (fingerCount >= 1) {
        const p1x = mapX(state.touch1X);
        const p1y = mapY(state.touch1Y);

        // Capacitive contact halo
        const haloGrad = ctx.createRadialGradient(p1x, p1y, 4, p1x, p1y, 24);
        haloGrad.addColorStop(0, "rgba(56, 189, 248, 0.9)");
        haloGrad.addColorStop(1, "rgba(56, 189, 248, 0.0)");
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(p1x, p1y, 24, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#0284c7";
        ctx.beginPath();
        ctx.arc(p1x, p1y, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 9px monospace";
        ctx.fillText("F1", p1x - 5, p1y + 3);
      }

      if (fingerCount >= 2) {
        const p1x = mapX(state.touch1X);
        const p1y = mapY(state.touch1Y);
        const p2x = mapX(state.touch2X);
        const p2y = mapY(state.touch2Y);

        // Distance vector line between fingers
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(p1x, p1y);
        ctx.lineTo(p2x, p2y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Contact 2 halo
        const haloGrad2 = ctx.createRadialGradient(p2x, p2y, 4, p2x, p2y, 24);
        haloGrad2.addColorStop(0, "rgba(245, 158, 11, 0.9)");
        haloGrad2.addColorStop(1, "rgba(245, 158, 11, 0.0)");
        ctx.fillStyle = haloGrad2;
        ctx.beginPath();
        ctx.arc(p2x, p2y, 24, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#d97706";
        ctx.beginPath();
        ctx.arc(p2x, p2y, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 9px monospace";
        ctx.fillText("F2", p2x - 5, p2y + 3);

        // Euclidean Distance label
        const midX = (p1x + p2x) / 2;
        const midY = (p1y + p2y) / 2;
        ctx.fillStyle = "#fde68a";
        ctx.font = "bold 10px monospace";
        ctx.fillText(`D(t) = ${separationMm.toFixed(0)} mm`, midX + 8, midY - 6);
      }

      // ========================================================
      // 2. MUTUAL CAPACITANCE SENSOR HEATMAP (Right Pane: x: 420 to 740, y: 65 to 325)
      // ========================================================
      const mX = 420;
      const mY = 65;
      const mW = 320;
      const mH = 260;

      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(mX, mY, mW, mH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 11px system-ui, sans-serif";
      ctx.fillText("MUTUAL CAPACITANCE NODE MATRIX (4x4)", mX + 12, mY + 22);

      // 4x4 Grid Heatmap
      const gSize = 38;
      const gStartX = mX + 25;
      const gStartY = mY + 45;

      for (let r = 0; r < 4; r++) {
        for (let col = 0; col < 4; col++) {
          const val = state.sensorMatrix[r]?.[col] ?? 0.05;
          const nodeX = gStartX + col * (gSize + 8);
          const nodeY = gStartY + r * (gSize + 8);

          // Heat color (blue -> cyan -> yellow -> red)
          const heat = Math.min(1.0, val / 0.8);
          const rCol = Math.round(heat * 240);
          const gCol = Math.round(100 + heat * 100);
          const bCol = Math.round((1.0 - heat) * 220);

          ctx.fillStyle = `rgb(${rCol}, ${gCol}, ${bCol})`;
          ctx.fillRect(nodeX, nodeY, gSize, gSize);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
          ctx.lineWidth = 1;
          ctx.strokeRect(nodeX, nodeY, gSize, gSize);

          ctx.fillStyle = heat > 0.4 ? "#000000" : "#ffffff";
          ctx.font = "9px monospace";
          ctx.fillText(`-${(val * 0.8).toFixed(2)}`, nodeX + 4, nodeY + gSize / 2 + 3);
        }
      }

      // Telemetry Readouts beside matrix
      const readX = mX + 215;
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px monospace";
      ctx.fillText("Zoom Scale S(t):", readX, mY + 55);
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 12px monospace";
      ctx.fillText(`${state.zoomScale.toFixed(2)}x`, readX, mY + 70);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px monospace";
      ctx.fillText("Rotation θ(t):", readX, mY + 95);
      ctx.fillStyle = "#f59e0b";
      ctx.font = "bold 12px monospace";
      ctx.fillText(`${state.rotationAngleDeg.toFixed(1)}°`, readX, mY + 110);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px monospace";
      ctx.fillText("Capacitive Shunt:", readX, mY + 135);
      ctx.fillStyle = "#34d399";
      ctx.font = "bold 12px monospace";
      ctx.fillText(`-${state.mutualCapacitanceDeltaPf.toFixed(2)} pF`, readX, mY + 150);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px monospace";
      ctx.fillText("Gesture Mode:", readX, mY + 175);
      ctx.fillStyle = "#a78bfa";
      ctx.font = "bold 11px monospace";
      ctx.fillText(state.gestureMode, readX, mY + 190);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [fingerCount, separationMm, pressureGrams, gestureVelocityMmS, isPlaying, onscreenRef]);

  return (
    <div
      ref={rootRef}
      className="w-full flex flex-col gap-4 p-4 sm:p-6 rounded-2xl bg-parchment-50 dark:bg-ink-950 border border-parchment-300 dark:border-ink-800 text-ink-900 dark:text-parchment-100 shadow-md"
    >
      <SimulationHeader
        title="Steve Jobs et al. Multi-Touch Gesture UI (US 7,479,949)"
        description="Interactive mutual capacitance sensor matrix, centroid tracking, pinch-to-zoom, and affine gesture heuristics."
        playbackAction={{
          label: isPlaying ? "Pause Simulation" : "Play Simulation",
          icon: isPlaying ? (
            <Pause className="h-4 w-4 text-amber-600" />
          ) : (
            <Play className="h-4 w-4" />
          ),
          onPress: () => {
            setIsPlaying(!isPlaying);
            soundEngine.playSwitchClick();
          },
        }}
        audioAction={{
          label: isAudioMuted ? "Unmute Sound" : "Mute Sound",
          icon: isAudioMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />,
          onPress: () => {
            toggleSound();
            soundEngine.playSwitchClick();
          },
        }}
        onReset={() => {
          resetParams();
          soundEngine.playSwitchClick();
        }}
        actionOrder="audio-playback"
        descriptionHasTopMargin={false}
        withBottomMargin={false}
      />

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-parchment-100/80 dark:bg-ink-900/70 border border-parchment-200 dark:border-ink-800/80 text-xs">
        {/* Finger Separation Distance */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between font-mono text-ink-700 dark:text-parchment-300">
            <label htmlFor={sepId}>Finger Separation D(t):</label>
            <span className="text-amber-600 dark:text-amber-400 font-bold">
              {separationMm.toFixed(0)} mm
            </span>
          </div>
          <input
            id={sepId}
            type="range"
            min="15"
            max="120"
            step="1"
            value={separationMm}
            onChange={(e) => updateParam("fingerSeparationMm", parseFloat(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-500">
            Pinch fingers together (15mm) to zoom out; spread apart (120mm) to zoom in
          </span>
        </div>

        {/* Touch Normal Pressure */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between font-mono text-ink-700 dark:text-parchment-300">
            <label htmlFor={pressureId}>Touch Contact Force:</label>
            <span className="text-cyan-600 dark:text-cyan-400 font-bold">
              {pressureGrams.toFixed(0)} grams
            </span>
          </div>
          <input
            id={pressureId}
            type="range"
            min="20"
            max="200"
            step="5"
            value={pressureGrams}
            onChange={(e) => updateParam("touchPressureGrams", parseFloat(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-500">
            Higher contact force expands finger flesh contact area, deepening capacitive shunt
          </span>
        </div>
      </div>

      {/* Mode Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              updateParam("fingerCount", 1);
              soundEngine.playSwitchClick();
            }}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold border transition-all ${
              fingerCount === 1
                ? "bg-blue-100 dark:bg-blue-950/60 border-blue-400 dark:border-blue-500/80 text-blue-800 dark:text-blue-300"
                : "bg-parchment-100 dark:bg-ink-900 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-ink-400 hover:text-ink-900 dark:hover:text-neutral-200"
            }`}
          >
            ☝️ 1 Finger: Scroll
          </button>
          <button
            type="button"
            onClick={() => {
              updateParam("fingerCount", 2);
              soundEngine.playSwitchClick();
            }}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold border transition-all ${
              fingerCount === 2
                ? "bg-amber-100 dark:bg-amber-950/60 border-amber-400 dark:border-amber-500/80 text-amber-800 dark:text-amber-300"
                : "bg-parchment-100 dark:bg-ink-900 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-ink-400 hover:text-ink-900 dark:hover:text-neutral-200"
            }`}
          >
            ✌️ 2 Fingers: Pinch & Rotate
          </button>
        </div>

        <span className="text-[11px] font-mono text-ink-500 dark:text-ink-400">
          Transform Engine:{" "}
          <span className="text-indigo-600 dark:text-indigo-400">Affine Matrix Interpolation</span>
        </span>
      </div>
    </div>
  );
}
