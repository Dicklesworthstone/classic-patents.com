"use client";

import {
  Camera,
  Eye,
  EyeOff,
  Layers,
  RotateCcw,
  Sparkles,
  Thermometer,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";
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

export function EinsteinRefrigerator3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Absorption Thermodynamics State Controls
  const { params } = usePatentPhysics("us-1781541-einstein-refrigerator");
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
  const butanePartialPressureAtm = frige.partialPressureButaneAtm.toFixed(2);
  const evaporatorTemperatureCelsius = frige.evapTempC;
  const copEfficiency = frige.cop.toFixed(2);
  const coolingPowerWatts = frige.coolingWatts;

  const live = useLiveSimParams({
    heatInputWatts,
    isHeating,
    isCutaway,
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

  const controlsRef = useRef<StudioContext["controls"] | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    switch (preset) {
      case "iso":
        camera.position.set(11, 8, 14);
        controls.target.set(0, 0, 0);
        break;
      case "generator":
        camera.position.set(3.8, 0.4, 3.8);
        controls.target.set(3.4, -0.8, 0);
        break;
      case "condenser":
        camera.position.set(2.4, 3.6, 3.0);
        controls.target.set(2.2, 2.6, 0);
        break;
      case "evaporator":
        camera.position.set(-2.8, 2.8, 3.8);
        controls.target.set(-2.8, 1.8, 0);
        break;
      case "absorber":
        camera.position.set(-3.2, -0.6, 3.6);
        controls.target.set(-2.8, -1.4, 0);
        break;
      case "top":
        camera.position.set(0, 11.5, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const toggleSound = () => {
    toggleEngine(() => {
      soundEngine.playSwitchClick();
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [11, 8, 14],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // --- 3D EINSTEIN-SZILARD REFRIGERATOR ASSEMBLY ---
    const model = buildEinsteinRefrigeratorModel();
    scene.add(model.rootGroup);

    // --- RENDER LOOP & REAL-TIME THERMOSIPHON CIRCULATION ---
    let reqId: number;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = 1 / 60;
      const p = live.current;

      model.materials.coldEvaporator.emissiveIntensity = p.evaporatorGlowIntensity;
      model.materials.coldEvaporator.color.setHex(p.evapTempC < -10 ? 0x7dd3fc : 0x64748b);

      updateEinsteinRefrigeratorKinematics(
        model,
        delta,
        p.fluidDisplaySpeed,
        p.heaterGlowIntensity,
        p.generatorGlowIntensity,
        p.isHeating,
        p.isCutaway,
        p.heatFrameIndex,
        p.fluidWrapY,
      );

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      model.dispose();
      studio.dispose();
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      {/* 3D WebGL Canvas Viewport */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Live HUD Telemetry Overlay */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-col gap-1.5 sm:gap-2 pointer-events-none max-w-[calc(100%-8rem)] sm:max-w-md transition-opacity duration-200">
            <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md p-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
              <div className="text-[10px] sm:text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Thermometer className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 animate-pulse" />
                Einstein-Szilard Absorption Cycle
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 sm:gap-y-1 mt-1 text-[10px] sm:text-xs font-sans">
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Evaporator Temp:</span>{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {evaporatorTemperatureCelsius}°C ({frige.evapTempF}°F)
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Cooling Power:</span>{" "}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {coolingPowerWatts} W (COP {copEfficiency})
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Butane P:</span>{" "}
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {butanePartialPressureAtm} atm ({systemPressureAtm} atm Tot)
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Moving Parts:</span>{" "}
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    0 (Hermetic / Silent)
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 items-center gap-2 max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse shrink-0" />
              <span className="truncate">
                Albert Einstein & Leo Szilard (US 1,781,541) — Refrigeration (1930)
              </span>
            </div>
          </div>
        )}

        {/* Top Right Tool Bar (Toggle UI, Audio, Pins, Cutaway, Reset) */}
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
            title={showUiOverlay ? "Hide Overlay UI (Clean 3D View)" : "Show Overlay UI"}
            aria-label={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
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
            title={isAudioMuted ? "Enable Sound Synthesis" : "Mute Sound"}
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
            title="Toggle Historical Patent Numeral Pins"
          >
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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

        {/* Camera Views Bar */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-1.5rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
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
      </div>
    </div>
  );
}
