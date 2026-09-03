"use client";

import { Camera, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { stepLandPolaroidInstantFilm } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { useLiveSimParams } from "./three/useLiveSimParams";
import { usePatentAudio } from "./three/usePatentAudio";
import { useOffscreenGate } from "./useOffscreenGate";

interface LandPolaroidSimProps {
  className?: string;
}

export const LandPolaroidSim: React.FC<LandPolaroidSimProps> = ({ className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const animationTimeRef = useRef(0);
  const { rootRef, onscreenRef } = useOffscreenGate<HTMLDivElement>();

  const { params, updateParam, resetParams } = usePatentPhysics("us-2543181-land-polaroid");
  const { isAudioMuted, toggleSound } = usePatentAudio();

  const developmentTimeSec = params.developmentTimeSec ?? 30;
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [internalTime, setInternalTime] = useState<number>(developmentTimeSec);
  const [viewMode, setViewMode] = useState<"sandwich" | "diffusion" | "print">("diffusion");

  const exposure = params.exposureFraction ?? 0.6;
  const viscosity = params.reagentViscosityCp ?? 25000;
  const rollerGap = params.rollerGapUm ?? 25;
  const alkaliPh = params.alkaliPh ?? 12.6;

  // The shared control is authoritative while the visitor has not explicitly
  // started the process timer. This keeps keyboard/pointer input stable across
  // 2D/3D mode changes instead of letting a default animation overwrite it.
  useEffect(() => {
    if (!isPlaying) setInternalTime(developmentTimeSec);
  }, [developmentTimeSec, isPlaying]);

  // Sync internal timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying) {
      timer = setInterval(() => {
        if (!onscreenRef.current) return;
        setInternalTime((prev) => {
          const next = prev >= 60 ? 0 : prev + 0.5;
          updateParam("developmentTimeSec", Math.round(next));
          return next;
        });
      }, 50);
    }
    return () => clearInterval(timer);
  }, [isPlaying, updateParam, onscreenRef]);

  const state = stepLandPolaroidInstantFilm({
    developmentTimeSec: internalTime,
    exposureFraction: exposure,
    reagentViscosityCp: viscosity,
    rollerGapUm: rollerGap,
    alkaliPh: alkaliPh,
  });
  const live = useLiveSimParams({
    alkaliPh,
    exposure,
    internalTime,
    rollerGap,
    state,
    viewMode,
    viscosity,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      animFrameRef.current = requestAnimationFrame(render);
      if (!onscreenRef.current) return;
      animationTimeRef.current += 0.02;
      const { alkaliPh, exposure, internalTime, rollerGap, state, viewMode, viscosity } =
        live.current;
      const animTime = animationTimeRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;

      // Background
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#0a0f1d");
      grad.addColorStop(1, "#030712");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      if (viewMode === "diffusion") {
        // Multi-layer Diffusion Transfer Micro-Cross-Section View
        const marginX = 50;
        const width = w - 100;

        // 1. Photosensitive Negative Emulsion Layer (Top)
        ctx.fillStyle = "#1e293b";
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(marginX, 40, width, 70, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 12px monospace";
        ctx.fillText("PHOTOSENSITIVE NEGATIVE EMULSION (AgBr)", marginX + 12, 58);
        ctx.font = "10px monospace";
        ctx.fillStyle = "#94a3b8";
        ctx.fillText(
          `Exposure: ${(exposure * 100).toFixed(0)}% • Negative Ag Density: D = ${state.negativeSilverDensity.toFixed(2)}`,
          marginX + 12,
          74,
        );

        // Render silver grains (Exposed = developing black metallic specks; Unexposed = dissolving into complexes)
        const grainCount = 36;
        for (let i = 0; i < grainCount; i++) {
          const gx = marginX + 20 + (i / grainCount) * (width - 40);
          const isExposed = i / grainCount < exposure;

          if (isExposed) {
            // Black metallic silver filament cluster
            ctx.fillStyle = `rgba(15, 23, 42, ${0.4 + 0.6 * (internalTime / 60)})`;
            ctx.strokeStyle = "#475569";
            ctx.beginPath();
            ctx.arc(gx, 92, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          } else {
            // Unexposed yellow AgBr grain dissolving
            const dissolveAlpha = Math.max(0.1, 1 - internalTime / 40);
            ctx.fillStyle = `rgba(234, 179, 8, ${dissolveAlpha})`;
            ctx.beginPath();
            ctx.arc(gx, 92, 5 * dissolveAlpha, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // 2. Viscous Processing Reagent Layer (Center Gap)
        const gapY = 120;
        const gapHeight = Math.max(40, rollerGap * 1.6);

        ctx.fillStyle = "rgba(16, 185, 129, 0.12)";
        ctx.strokeStyle = "#10b981";
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(marginX, gapY, width, gapHeight);
        ctx.fillRect(marginX, gapY, width, gapHeight);
        ctx.setLineDash([]);

        ctx.fillStyle = "#10b981";
        ctx.font = "bold 11px monospace";
        ctx.fillText(
          `VISCOUS REAGENT GAP (${rollerGap}µm, pH ${alkaliPh.toFixed(1)}, η = ${viscosity.toLocaleString()} cP)`,
          marginX + 12,
          gapY + 18,
        );

        // Animated diffusing complex ions [Ag(S2O3)2]3-
        const unexposedWidth = (1 - exposure) * width;
        const startX = marginX + exposure * width;
        const particleCount = Math.floor(25 * (1 - exposure));

        for (let p = 0; p < particleCount; p++) {
          const px = startX + ((p * 37 + animTime * 40) % Math.max(20, unexposedWidth));
          const prog = (Math.sin(animTime * 2 + p) + 1) / 2;
          const py = gapY + 10 + prog * (gapHeight - 20);

          ctx.fillStyle = "#34d399";
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // 3. Positive Image-Receiving Sheet (Bottom)
        const posSheetY = gapY + gapHeight + 10;
        ctx.fillStyle = "#0f172a";
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(marginX, posSheetY, width, 75, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#f59e0b";
        ctx.font = "bold 12px monospace";
        ctx.fillText(
          "IMAGE-RECEIVING POSITIVE SHEET (Catalytic Ag2S Nuclei)",
          marginX + 12,
          posSheetY + 20,
        );
        ctx.font = "10px monospace";
        ctx.fillStyle = "#94a3b8";
        ctx.fillText(
          `Positive Reflectance Density: D = ${state.positiveSilverDensity.toFixed(2)} • Transfer Eff: ${state.transferEfficiencyPercent.toFixed(1)}%`,
          marginX + 12,
          posSheetY + 36,
        );

        // Render precipitated silver mirror on positive nuclei
        for (let i = 0; i < grainCount; i++) {
          const px = marginX + 20 + (i / grainCount) * (width - 40);
          const isUnexposed = i / grainCount >= exposure;

          // Catalytic nuclei dots
          ctx.fillStyle = "#f59e0b";
          ctx.beginPath();
          ctx.arc(px, posSheetY + 54, 2, 0, Math.PI * 2);
          ctx.fill();

          if (isUnexposed && internalTime > 5) {
            // Metallic silver cluster forming positive image
            const rad = Math.min(7, 2 + 5 * (internalTime / 50));
            ctx.fillStyle = `rgba(226, 232, 240, ${Math.min(0.95, state.positiveSilverDensity / 2.0)})`;
            ctx.beginPath();
            ctx.arc(px, posSheetY + 54, rad, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else if (viewMode === "sandwich") {
        // Film Pod Rupture & Camera Roller Squeegee Diagram
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 13px monospace";
        ctx.fillText("HERMETIC REAGENT POD RUPTURE & ROLLER SPREADING MECHANISM", 40, 45);

        // Rollers
        const rx = w * 0.45;
        ctx.fillStyle = "#64748b";
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 2;

        // Upper roller
        ctx.beginPath();
        ctx.arc(rx, 110, 32, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Lower roller
        ctx.beginPath();
        ctx.arc(rx, 190, 32, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Film sandwich passing through
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(40, 146, rx - 40, 8); // Pre-nip sheets
        ctx.fillStyle = "#10b981";
        ctx.fillRect(rx, 148, w - rx - 40, 4); // Metered liquid layer

        // Bursting pod
        ctx.fillStyle = "#f59e0b";
        ctx.beginPath();
        ctx.ellipse(rx - 30, 150, 16, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#f59e0b";
        ctx.font = "11px monospace";
        ctx.fillText("Rupturing Reagent Pod", rx - 90, 130);
        ctx.fillStyle = "#38bdf8";
        ctx.fillText("Nip Pressure Rollers", rx - 60, 245);
        ctx.fillStyle = "#10b981";
        ctx.fillText(
          `Uniform Meniscus Spread: ${state.meniscusSpreadUniformityPercent.toFixed(1)}%`,
          rx + 20,
          140,
        );
      } else {
        // Finished Polaroid Print Simulation
        const pw = 220;
        const ph = 260;
        const px = (w - pw) / 2;
        const py = 40;

        // Classic Polaroid white border frame
        ctx.fillStyle = "#f8fafc";
        ctx.shadowColor = "rgba(0,0,0,0.6)";
        ctx.shadowBlur = 16;
        ctx.fillRect(px, py, pw, ph);
        ctx.shadowBlur = 0;

        // Picture area
        const picW = 180;
        const picH = 180;
        const picX = px + 20;
        const picY = py + 20;

        // Simulated positive image tone
        const brightness = Math.min(240, 20 + 200 * (1 - state.positiveSilverDensity / 2.2));
        ctx.fillStyle = `rgb(${brightness}, ${brightness * 0.96}, ${brightness * 0.9})`;
        ctx.fillRect(picX, picY, picW, picH);

        // Portrait silhouette
        ctx.fillStyle = `rgba(15, 23, 42, ${Math.min(0.9, 0.2 + state.positiveSilverDensity * 0.4)})`;
        ctx.beginPath();
        ctx.arc(picX + picW / 2, picY + 70, 32, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(picX + picW / 2, picY + 150, 60, 40, 0, 0, Math.PI * 2);
        ctx.fill();

        // Polaroid bottom label
        ctx.fillStyle = "#94a3b8";
        ctx.font = "10px monospace";
        ctx.fillText("POLAROID LAND TYPE 40 (60s)", px + 20, py + ph - 16);
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [live, onscreenRef]);

  return (
    <div
      ref={rootRef}
      className={`flex flex-col gap-4 rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
              Edwin Land Instant Photography & Diffusion Transfer (US 2,543,181)
            </h3>
          </div>
          <p className="font-sans text-xs text-ink-500 dark:text-ink-400 mt-0.5">
            Diffusion Transfer Reversal (DTR): reagent pod rupture, silver halide solubilization,
            and positive mordant deposition.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end lg:self-auto">
          {/* View Mode Tabs */}
          <div className="flex gap-1 bg-parchment-200 dark:bg-ink-900 p-1 rounded-lg border border-parchment-300 dark:border-ink-800">
            {(["diffusion", "sandwich", "print"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  setViewMode(mode);
                  soundEngine.playSwitchClick();
                }}
                className={`px-3 py-1 text-xs font-mono rounded-md transition-colors ${
                  viewMode === mode
                    ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-400 dark:border-emerald-500"
                    : "bg-parchment-100 dark:bg-ink-800 hover:bg-parchment-200 dark:hover:bg-slate-700 text-ink-700 dark:text-parchment-300"
                }`}
              >
                {mode === "diffusion"
                  ? "Diffusion Kinetics"
                  : mode === "sandwich"
                    ? "Roller Spread"
                    : "Instant Print"}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setIsPlaying(!isPlaying);
              soundEngine.playSwitchClick();
            }}
            aria-label={isPlaying ? "Pause Timer" : "Start Timer"}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
            title={isPlaying ? "Pause Timer" : "Start Timer"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Play className="w-4 h-4" />
            )}
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
              animationTimeRef.current = 0;
              resetParams();
              setInternalTime(30);
              setIsPlaying(false);
              setViewMode("diffusion");
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
      <div className="relative w-full h-[320px] rounded-xl overflow-hidden bg-slate-900 border border-parchment-300 dark:border-ink-800">
        <canvas ref={canvasRef} width={680} height={320} className="w-full h-full" />
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
        <div>
          <label htmlFor="dev-time" className="text-[11px] font-mono text-slate-400 block mb-1">
            Timer: {internalTime.toFixed(0)}s / 60s
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-2 py-0.5 text-xs bg-emerald-900 hover:bg-emerald-800 text-emerald-200 rounded font-mono"
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
            <input
              id="dev-time"
              type="range"
              min={0}
              max={60}
              value={internalTime}
              onChange={(e) => {
                const val = Number(e.target.value);
                setInternalTime(val);
                updateParam("developmentTimeSec", val);
              }}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="exposure-level"
            className="text-[11px] font-mono text-slate-400 block mb-1"
          >
            Exposure: {(exposure * 100).toFixed(0)}%
          </label>
          <input
            id="exposure-level"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={exposure}
            onChange={(e) => updateParam("exposureFraction", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </div>

        <div>
          <label
            htmlFor="gel-viscosity"
            className="text-[11px] font-mono text-slate-400 block mb-1"
          >
            Viscosity: {(viscosity / 1000).toFixed(0)}k cP
          </label>
          <input
            id="gel-viscosity"
            type="range"
            min={1000}
            max={80000}
            step={1000}
            value={viscosity}
            onChange={(e) => updateParam("reagentViscosityCp", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </div>

        <div>
          <label htmlFor="roller-gap" className="text-[11px] font-mono text-slate-400 block mb-1">
            Roller Gap: {rollerGap}µm
          </label>
          <input
            id="roller-gap"
            type="range"
            min={10}
            max={60}
            step={2}
            value={rollerGap}
            onChange={(e) => updateParam("rollerGapUm", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </div>

        <div>
          <label htmlFor="alkali-ph" className="text-[11px] font-mono text-slate-400 block mb-1">
            Alkali: pH {alkaliPh.toFixed(1)}
          </label>
          <input
            id="alkali-ph"
            type="range"
            min={10.5}
            max={13.8}
            step={0.1}
            value={alkaliPh}
            onChange={(e) => updateParam("alkaliPh", Number(e.target.value))}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
        </div>
      </div>
    </div>
  );
};
