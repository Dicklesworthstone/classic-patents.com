"use client";

import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
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
}

export function MultiTouchSim({
  initialFingerCount = 1,
  initialSeparationMm = 50,
}: MultiTouchSimProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sepId = useId();
  const angleId = useId();
  const { rootRef, onscreenRef } = useOffscreenGate<HTMLDivElement>();

  const { params, updateParam, resetParams } = usePatentPhysics("us-7479949-multitouch");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const fingerCount = Math.round(params.fingerCount ?? initialFingerCount);
  const separationMm = params.fingerSeparationMm ?? initialSeparationMm;
  const initialMotionAngleDeg = params.initialMotionAngleDeg ?? 15;
  const claim1HeuristicActive = (params[claimConstraintStateParamId(1)] ?? 1) >= 0.5;
  // US 7,479,949 says "a predetermined angle" but supplies no degree value.
  // This fixed, conspicuously-labelled value is an exhibit choice, not a claim constant.
  const initialAngleThresholdDeg = 30;

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
        initialMotionAngleDeg,
        initialAngleThresholdDeg,
        claim1HeuristicActive,
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
            initialMotionAngleDeg,
            initialAngleThresholdDeg,
            claim1HeuristicActive,
          },
          timeSec,
          state,
        );
      }

      const w = canvas.width;
      const h = canvas.height;

      // Neutral display background. This exhibit deliberately models no sensor stack.
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
      ctx.fillText("TOUCH-SCREEN COMMAND HEURISTICS", 20, 26);
      ctx.font = "11px monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(
        `US 7,479,949 • Contacts: ${fingerCount} • Initial angle: ${initialMotionAngleDeg.toFixed(0)}° • Command: ${state.gestureMode}`,
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
      ctx.fillText("TOUCH-SCREEN COMMAND SURFACE", tX + 12, tY + 22);

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

        // Contact halo is a visible interaction marker, not a sensor measurement.
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
      // 2. CLAIM 1 COMMAND DECISION (Right Pane: x: 420 to 740, y: 65 to 325)
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
      ctx.fillText("CLAIM 1: APPLY A COMMAND HEURISTIC", mX + 12, mY + 22);

      const cardX = mX + 18;
      const cardW = mW - 36;
      const drawStep = (y: number, number: string, text: string, active = false) => {
        ctx.fillStyle = active ? "rgba(14, 116, 144, 0.42)" : "rgba(30, 41, 59, 0.72)";
        ctx.fillRect(cardX, y, cardW, 38);
        ctx.strokeStyle = active ? "#38bdf8" : "rgba(148, 163, 184, 0.5)";
        ctx.strokeRect(cardX, y, cardW, 38);
        ctx.fillStyle = active ? "#7dd3fc" : "#cbd5e1";
        ctx.font = "bold 10px system-ui, sans-serif";
        ctx.fillText(number, cardX + 10, y + 16);
        ctx.font = "10px system-ui, sans-serif";
        ctx.fillText(text, cardX + 34, y + 16);
      };
      drawStep(mY + 42, "1", `Detect ${fingerCount} contact${fingerCount === 1 ? "" : "s"}`);
      drawStep(
        mY + 88,
        "2",
        claim1HeuristicActive ? "Apply initial-motion heuristic" : "Claim 1 heuristic withheld",
        claim1HeuristicActive,
      );
      drawStep(
        mY + 134,
        "3",
        claim1HeuristicActive ? `Process: ${state.gestureMode}` : "No claimed command routed",
        claim1HeuristicActive,
      );

      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px monospace";
      ctx.fillText("Initial angle θ:", cardX, mY + 202);
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 12px monospace";
      ctx.fillText(`${state.initialMotionAngleDeg.toFixed(0)}°`, cardX + 122, mY + 202);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px monospace";
      ctx.fillText("Illustrative boundary:", cardX, mY + 221);
      ctx.fillStyle = "#f59e0b";
      ctx.font = "bold 12px monospace";
      ctx.fillText(`${state.initialAngleThresholdDeg.toFixed(0)}°`, cardX + 150, mY + 221);
      ctx.fillStyle = "#64748b";
      ctx.font = "9px system-ui, sans-serif";
      ctx.fillText("No capacitance, pressure, or scan-rate value is claimed.", cardX, mY + 245);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [
    claim1HeuristicActive,
    fingerCount,
    separationMm,
    initialMotionAngleDeg,
    isPlaying,
    onscreenRef,
  ]);

  return (
    <div
      ref={rootRef}
      className="w-full flex flex-col gap-4 p-4 sm:p-6 rounded-2xl bg-parchment-50 dark:bg-ink-950 border border-parchment-300 dark:border-ink-800 text-ink-900 dark:text-parchment-100 shadow-md"
    >
      <SimulationHeader
        title="Touch-Screen Command Heuristics (US 7,479,949)"
        description="A source-bounded model of Claim 1's command decision. It shows contact geometry and a reader-selected angle boundary; it does not model or claim a sensor stack."
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

        {/* Claim 1's initial-motion direction */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between font-mono text-ink-700 dark:text-parchment-300">
            <label htmlFor={angleId}>Initial Motion Angle:</label>
            <span className="text-cyan-600 dark:text-cyan-400 font-bold">
              {initialMotionAngleDeg.toFixed(0)}° from vertical
            </span>
          </div>
          <input
            id={angleId}
            type="range"
            min="0"
            max="90"
            step="1"
            value={initialMotionAngleDeg}
            onChange={(e) => updateParam("initialMotionAngleDeg", parseFloat(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-500">
            The patent calls for a predetermined angle but prints no numerical cutoff; the 30°
            boundary in this exhibit is explicitly illustrative.
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
            ☝️ 1 Finger: Classify
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
            ✌️ 2 Fingers: Claim 8 Pinch
          </button>
        </div>

        <span className="text-[11px] font-mono text-ink-500 dark:text-ink-400">
          Kernel:{" "}
          <span className="text-indigo-600 dark:text-indigo-400">source-bounded TS rule</span>
        </span>
      </div>
    </div>
  );
}
