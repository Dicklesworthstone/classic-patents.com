"use client";

import { Camera, Eye, EyeOff, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepMaimanRubyLaser } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { createMaimanRubyLaserModel } from "./maimanRubyLaserModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

type CameraPreset = "iso" | "ruby_rod" | "flashlamp" | "resonator" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [10, 8, 14], target: [3, 0.4, 0] },
  ruby_rod: { pos: [4.5, 2.0, 5.0], target: [3, 0.4, 0] },
  flashlamp: { pos: [1.5, 3.5, 4.0], target: [2.5, 0.4, 0] },
  resonator: { pos: [9.0, 1.2, 2.0], target: [6.0, 0.4, 0] },
  top: { pos: [3.0, 16.0, 0.1], target: [3, 0.4, 0] },
};

export function MaimanRubyLaser3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { params, updateParam } = usePatentPhysics("us-3353115-maiman-ruby-laser");
  const pumpEnergyJoules = params.pumpEnergyJoules ?? 150;
  const crystalTemperatureKelvin = params.crystalTemperatureKelvin ?? 300;
  const outputMirrorReflectivity = params.outputMirrorReflectivity ?? 0.92;
  const flashDurationMs = params.flashDurationMs ?? 1.0;
  const rodLengthCm = params.rodLengthCm ?? 5.0;

  const [showUiOverlay, setShowUiOverlay] = useState(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [isFiring, setIsFiring] = useState(false);
  const isFiringRef = useRef(false);

  const live = useLiveSimParams({
    pumpEnergyJoules,
    flashDurationMs,
    rodLengthCm,
    outputMirrorReflectivity,
    crystalTemperatureKelvin,
  });

  const studioRef = useRef<StudioContext | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const metrics = stepMaimanRubyLaser({
    pumpEnergyJoules: live.current.pumpEnergyJoules,
    flashDurationMs: live.current.flashDurationMs,
    rodLengthCm: live.current.rodLengthCm,
    outputMirrorReflectivity: live.current.outputMirrorReflectivity,
    crystalTemperatureKelvin: live.current.crystalTemperatureKelvin,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const iso = CAMERA_PRESETS.iso;
    const studio = createThreeStudioScene({
      container,
      cameraPos: iso.pos,
      targetPos: iso.target,
    });
    studioRef.current = studio;

    const laserModel = createMaimanRubyLaserModel();
    studio.scene.add(laserModel.nodes.group);

    let animId = 0;
    let flashPhase = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (isFiringRef.current) {
        flashPhase += 0.05;
        if (flashPhase > 1.0) {
          flashPhase = 0;
          setIsFiring(false);
          isFiringRef.current = false;
        }
      }

      laserModel.update(
        {
          pumpEnergyJoules: live.current.pumpEnergyJoules,
          flashDurationMs: live.current.flashDurationMs,
          rodLengthCm: live.current.rodLengthCm,
          outputMirrorReflectivity: live.current.outputMirrorReflectivity,
          crystalTemperatureKelvin: live.current.crystalTemperatureKelvin,
        },
        flashPhase,
        isFiringRef.current,
      );

      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      laserModel.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  const triggerLaserPulse = () => {
    if (isFiringRef.current) return;
    setIsFiring(true);
    isFiringRef.current = true;
  };

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Theodore Maiman Ruby Laser 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-14rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3.5 h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["ruby_rod", "Ruby Rod"],
                ["flashlamp", "Flashlamp"],
                ["resonator", "Resonator"],
                ["top", "Top"],
              ] as [CameraPreset, string][]
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyCameraPreset(preset)}
                className={`px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
                  activeCamera === preset
                    ? "bg-amber-600 text-white shadow-xs font-semibold"
                    : "text-ink-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Top-Right Action Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap justify-end gap-1.5 sm:gap-2 max-w-[90%]">
          <button
            type="button"
            onClick={triggerLaserPulse}
            disabled={isFiring}
            className={`p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              isFiring
                ? "bg-rose-700 text-white border-rose-800 animate-pulse"
                : "bg-rose-600 text-white border-rose-700 hover:bg-rose-500 active:scale-95"
            }`}
          >
            {isFiring ? "⚡ Discharging..." : "⚡ Trigger Flashlamp"}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              showUiOverlay
                ? "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
                : "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-600"
            }`}
            title={showUiOverlay ? "Hide Overlay Telemetry" : "Show Overlay Telemetry"}
            aria-label={showUiOverlay ? "Hide Overlay Telemetry" : "Show Overlay Telemetry"}
          >
            {showUiOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden md:inline">{showUiOverlay ? "Hide HUD" : "Show HUD"}</span>
          </button>

          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                Emission:
              </span>
              <span
                className={`font-bold ${metrics.isLasing ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}`}
              >
                {metrics.isLasing ? "COHERENT 694.3 nm" : "SUB-THRESHOLD"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Peak Power:</span>
              <span className="text-rose-700 dark:text-rose-400 font-bold">
                {metrics.laserPeakPowerKw.toFixed(1)} kW
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Pulse Energy:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {metrics.laserPulseEnergyJoules.toFixed(2)} J
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Threshold:</span>
              <span className="text-ink-700 dark:text-ink-300 font-bold">
                {metrics.thresholdPumpEnergyJoules.toFixed(0)} J
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Xenon Flash Energy</span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {pumpEnergyJoules} J
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="500"
              step="10"
              value={pumpEnergyJoules}
              onChange={(e) => updateParam("pumpEnergyJoules", Number.parseFloat(e.target.value))}
              className="w-full accent-amber-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Crystal Temperature
              </span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {crystalTemperatureKelvin} K
              </span>
            </div>
            <input
              type="range"
              min="77"
              max="400"
              step="5"
              value={crystalTemperatureKelvin}
              onChange={(e) =>
                updateParam("crystalTemperatureKelvin", Number.parseFloat(e.target.value))
              }
              className="w-full accent-cyan-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Coupler Reflectivity
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                {(outputMirrorReflectivity * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.70"
              max="0.98"
              step="0.01"
              value={outputMirrorReflectivity}
              onChange={(e) =>
                updateParam("outputMirrorReflectivity", Number.parseFloat(e.target.value))
              }
              className="w-full accent-emerald-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Bottom SI Telemetry Chip Strip */}
      <StudioKernelChips
        visible={true}
        title="RUBY LASER QUANTUM OPTICS"
        chips={[
          { label: "Wavelength", value: "694.3", unit: "nm" },
          { label: "P_peak", value: metrics.laserPeakPowerKw.toFixed(1), unit: "kW" },
          { label: "E_pulse", value: metrics.laserPulseEnergyJoules.toFixed(2), unit: "J" },
          { label: "E_thresh", value: metrics.thresholdPumpEnergyJoules.toFixed(0), unit: "J" },
          { label: "R_out", value: (outputMirrorReflectivity * 100).toFixed(0), unit: "%" },
          { label: "T_crystal", value: String(crystalTemperatureKelvin), unit: "K" },
          {
            label: "State",
            value: metrics.isLasing ? "Lasing Cascade" : "Spontaneous Decay",
            tone: metrics.isLasing ? "hot" : "ok",
          },
        ]}
      />
    </div>
  );
}
