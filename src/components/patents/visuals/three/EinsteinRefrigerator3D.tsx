"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepEinsteinRefrigerator } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import {
  buildEinsteinRefrigeratorModel,
  updateEinsteinRefrigeratorKinematics,
} from "./einsteinRefrigeratorModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "generator" | "condenser" | "evaporator" | "absorber" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [11, 8, 14], target: [0, 0, 0] },
  generator: { pos: [3.8, 0.4, 3.8], target: [3.4, -0.8, 0] },
  condenser: { pos: [2.4, 3.6, 3.0], target: [2.2, 2.6, 0] },
  evaporator: { pos: [-2.8, 2.8, 3.8], target: [-2.8, 1.8, 0] },
  absorber: { pos: [-3.2, -0.6, 3.6], target: [-2.8, -1.4, 0] },
  top: { pos: [0, 11.5, 0.1], target: [0, 0, 0] },
};

export function EinsteinRefrigerator3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Absorption Thermodynamics State Controls
  const { params, updateParam } = usePatentPhysics("us-1781541-einstein-refrigerator");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const heatInputWatts = params.heatInput ?? 220;
  const systemPressureAtm = params.totalPressure ?? 15;
  const auxiliaryGasRatio = params.ammoniaRatio ?? params.auxiliaryGasRatio ?? 0.65;
  const [isHeating, _setIsHeating] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const frige = stepEinsteinRefrigerator({
    heatInput: heatInputWatts,
    totalPressure: systemPressureAtm,
    ammoniaRatio: auxiliaryGasRatio,
  });
  const evaporatorTemperatureCelsius = frige.evapTempC;
  const copEfficiency = frige.cop.toFixed(2);
  const coolingPowerWatts = frige.coolingWatts;

  const live = useLiveSimParams({
    heatInputWatts,
    isHeating,
    isCutaway,
    showCalloutPins,
    isAudioMuted,
    coolingWatts: frige.coolingWatts,
    evapTempC: frige.evapTempC,
    cop: frige.cop,
    fluidDisplaySpeed: frige.fluidDisplaySpeed,
    heaterGlowIntensity: frige.heaterGlowIntensity,
    generatorGlowIntensity: frige.generatorGlowIntensity,
    evaporatorGlowIntensity: frige.evaporatorGlowIntensity,
    heatFrameIndex: frige.heatFrameIndex,
    fluidWrapY: frige.fluidWrapY,
  });

  const studioRef = useRef<StudioContext | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const toggleSound = () => {
    toggleEngine(() => {
      soundEngine.playSwitchClick();
    });
  };

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

    const { scene, renderer, controls } = studio;

    // Build procedural 3D model
    const fridge = buildEinsteinRefrigeratorModel();
    scene.add(fridge.rootGroup);

    // Animation Loop
    let reqId: number;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const dt = 1 / 60;
      const p = live.current;

      updateEinsteinRefrigeratorKinematics(
        fridge,
        dt,
        p.fluidDisplaySpeed,
        p.heaterGlowIntensity,
        p.generatorGlowIntensity,
        p.isHeating,
        p.isCutaway,
        p.heatFrameIndex,
        p.fluidWrapY,
      );

      controls.update();
      renderer.render(scene, studio.camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      fridge.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">
        Albert Einstein & Leo Szilard (US 1,781,541) Absorption Refrigerator 3D
      </div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-14rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["generator", "Boiler Generator"],
                ["condenser", "Condenser Fins"],
                ["evaporator", "Cold Evaporator"],
                ["absorber", "Absorber Column"],
                ["top", "Top View"],
              ] as const
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyCameraPreset(preset)}
                className={`px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
                  activeCamera === preset
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-ink-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Top Right Tool Bar */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Switch to Solid Steel" : "Switch to Vessel Cutaway"}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              isCutaway
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showUiOverlay
                ? "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
                : "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
            }`}
          >
            {showUiOverlay ? (
              <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
          <button
            aria-label={isAudioMuted ? "Unmute simulation audio" : "Mute simulation audio"}
            type="button"
            onClick={toggleSound}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            )}
          </button>
          <button
            aria-label={showCalloutPins ? "Hide annotation pins" : "Show annotation pins"}
            type="button"
            onClick={() => setShowCalloutPins(!showCalloutPins)}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showCalloutPins
                ? "bg-amber-600 text-white border-amber-700 shadow-md"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                Evaporator Temp:
              </span>
              <span className="font-bold text-cyan-700 dark:text-cyan-400">
                {evaporatorTemperatureCelsius.toFixed(1)} °C ({frige.evapTempF} °F)
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Cooling Output:</span>
              <span className="text-emerald-800 dark:text-emerald-400 font-bold">
                {coolingPowerWatts.toFixed(1)} W
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Heat Input:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {heatInputWatts} W
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">COP Efficiency:</span>
              <span className="text-purple-800 dark:text-purple-400 font-bold">
                {copEfficiency}
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
              <span className="text-ink-700 dark:text-ink-300 font-medium">Heat Source Input</span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {heatInputWatts} W
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="500"
              step="10"
              value={heatInputWatts}
              onChange={(e) => updateParam("heatInput", Number.parseInt(e.target.value, 10))}
              className="w-full accent-amber-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Total System Pressure
              </span>
              <span className="text-purple-700 dark:text-purple-400 font-mono font-bold">
                {systemPressureAtm} atm
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={systemPressureAtm}
              onChange={(e) => updateParam("totalPressure", Number.parseInt(e.target.value, 10))}
              className="w-full accent-purple-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Ammonia Auxiliary Fraction
              </span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {Math.round(auxiliaryGasRatio * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="90"
              step="5"
              value={Math.round(auxiliaryGasRatio * 100)}
              onChange={(e) =>
                updateParam("ammoniaRatio", Number.parseInt(e.target.value, 10) / 100)
              }
              className="w-full accent-cyan-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
