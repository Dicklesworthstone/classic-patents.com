"use client";

import { Pause, Play, RotateCcw, Tv, Volume2, VolumeX } from "lucide-react";
import { useMemo, useState } from "react";
import {
  type FarnsworthTvControls,
  readFarnsworthTvControls,
  readFarnsworthTvTapeFrame,
  resetFarnsworthTvTape,
} from "@/physics/farnsworthTvKernel";
import { usePatentRuntimeTick } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";

const PATENT_ID = "us-1773980-farnsworth-tv";

export function FarnsworthTVSim() {
  const { effectiveParams, updateParam, resetParams } = usePatentPhysics(PATENT_ID);
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const controls = useMemo<FarnsworthTvControls>(
    () => readFarnsworthTvControls(effectiveParams as any),
    [effectiveParams],
  );
  const runtimeTick = usePatentRuntimeTick(PATENT_ID, 1);
  const { beamState: beam, scanFrame } = readFarnsworthTvTapeFrame(controls);
  const scanLines = controls.scanLines;
  const [mode, setMode] = useState<"electronic-farnsworth" | "mechanical-nipkow">(
    "electronic-farnsworth",
  );
  const isScanning = controls.running;

  return (
    <div
      className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md transition-colors"
      data-runtime-tick={runtimeTick}
      data-raster-line={scanFrame.rasterLineIndex}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Tv className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-serif text-lg sm:text-xl font-bold text-ink-900 dark:text-parchment-100">
              Philo Farnsworth Image Dissector & All-Electronic TV (US 1,773,980)
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-0.5">
            Magnetic raster deflection coils, photoelectron imaging, and continuous electron beam
            scanning.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => {
              const newMode =
                mode === "electronic-farnsworth" ? "mechanical-nipkow" : "electronic-farnsworth";
              setMode(newMode);
              updateParam("scanLines", newMode === "mechanical-nipkow" ? 30 : 120);
              soundEngine.playSwitchClick();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300 hover:bg-parchment-300 dark:hover:bg-ink-700 transition-colors"
          >
            {mode === "electronic-farnsworth" ? "Nipkow Disc Mode" : "Electronic Mode"}
          </button>
          <button
            type="button"
            onClick={() => {
              updateParam("running", isScanning ? 0 : 1);
              soundEngine.playSwitchClick();
            }}
            className="p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
            title={isScanning ? "Pause Beam" : "Resume Scan"}
            aria-label={isScanning ? "Pause Beam" : "Resume Scan"}
          >
            {isScanning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
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
              resetFarnsworthTvTape();
              setMode("electronic-farnsworth");
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

      <div className="my-5">
        {/* CRT / Image Screen */}
        <div className="flex flex-col items-center justify-center rounded-xl bg-ink-950 p-6 border border-parchment-200 dark:border-ink-800 relative min-h-[300px]">
          <div className="w-64 h-56 rounded-2xl bg-zinc-900 border-4 border-zinc-700 shadow-2xl relative overflow-hidden flex items-center justify-center">
            {/* CRT Phosphor Scan Lines Effect */}
            <div
              className={`absolute inset-0 bg-contain bg-center opacity-80 ${
                mode === "mechanical-nipkow" ? "blur-sm contrast-75" : ""
              }`}
              style={{
                backgroundImage:
                  "radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.9) 0%, rgba(6, 78, 59, 0.4) 70%, transparent 100%)",
              }}
            >
              {/* Raster Scanline Overlay */}
              <div
                className="w-full h-full"
                style={{
                  background: `repeating-linear-gradient(0deg, transparent, transparent ${240 / scanLines}px, rgba(0,0,0,0.6) ${240 / scanLines}px, rgba(0,0,0,0.6) ${480 / scanLines}px)`,
                }}
              />
            </div>

            {/* Moving Electron Beam Spot */}
            <div
              className="absolute w-3 h-3 rounded-full bg-emerald-300 shadow-[0_0_12px_#34d399] transition-colors duration-75"
              style={{
                left: `${scanFrame.rasterXPercent}%`,
                top: `${scanFrame.rasterYPercent}%`,
                opacity: scanFrame.inHorizontalRetrace ? 0 : 1,
                transform: "translate(-50%, -50%)",
              }}
            />

            {/* Test Pattern Overlay (Farnsworth Historic Triangle or Dollar Sign) */}
            <div className="relative z-10 text-emerald-400 font-mono font-black text-4xl opacity-75 tracking-widest">
              $ 1927
            </div>
          </div>

          <div className="text-xs font-mono text-ink-300 mt-3">
            {mode === "electronic-farnsworth" ? (
              <span className="text-emerald-400 font-bold">
                Electron Optics: {scanLines} lines · {beam.electronVelocityMegaMps} Mm/s · r=
                {beam.gyroRadiusMm} mm · {beam.photocathodeCurrentUa} µA
              </span>
            ) : (
              <span className="text-amber-400 font-bold">
                Mechanical Nipkow Disc: Severe 30-line Blur & Frame Shake
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
