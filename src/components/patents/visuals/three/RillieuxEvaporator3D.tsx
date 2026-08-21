"use client";

import { Camera, Zap } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { stepRillieuxEvaporator } from "@/physics/rillieuxEvaporatorKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import {
  createRillieuxEvaporatorModel,
  type RillieuxEvaporatorModelNodes,
} from "./rillieuxEvaporatorModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

interface Rillieux3DProps {
  className?: string;
}

type CameraPreset = "overview" | "pan1" | "pan2" | "pan3" | "condenser";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { label: string; pos: [number, number, number]; target: [number, number, number] }
> = {
  overview: {
    label: "3-Effect Cascade Overview",
    pos: [0, 8.0, 14.0],
    target: [0, 2.0, 0],
  },
  pan1: {
    label: "Effect 1 (Live Steam)",
    pos: [-4.2, 5.0, 6.0],
    target: [-4.2, 2.2, 0],
  },
  pan2: {
    label: "Effect 2 (Intermediate Vapor)",
    pos: [0, 5.0, 6.0],
    target: [0, 2.2, 0],
  },
  pan3: {
    label: "Effect 3 (Final Concentrate)",
    pos: [4.2, 5.0, 6.0],
    target: [4.2, 2.2, 0],
  },
  condenser: {
    label: "Barometric Condenser",
    pos: [7.5, 4.0, 5.5],
    target: [6.5, 2.0, 0],
  },
};

export const RillieuxEvaporator3D: React.FC<Rillieux3DProps> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const modelRef = useRef<RillieuxEvaporatorModelNodes | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("overview");
  const [showUiOverlay, setShowUiOverlay] = useState(true);

  const { params, updateParam } = usePatentPhysics("us-3237-rillieux-evaporator");
  const juiceFeedRateKgPerH = params.juiceFeedRateKgPerH ?? 4500;
  const initialBrixDeg = params.initialBrixDeg ?? 14;
  const targetBrixDeg = params.targetBrixDeg ?? 60;
  const numberOfEffects = params.numberOfEffects ?? 3;

  const live = useLiveSimParams({
    juiceFeedRateKgPerH,
    initialBrixDeg,
    targetBrixDeg,
    numberOfEffects,
  });

  const state = stepRillieuxEvaporator({
    juiceFeedRateKgPerH,
    initialBrixDeg,
    targetBrixDeg,
    numberOfEffects,
  });

  const handlePresetChange = (preset: CameraPreset) => {
    setCameraPreset(preset);
    const target = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(target.pos, target.target);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: CAMERA_PRESETS.overview.pos,
      targetPos: CAMERA_PRESETS.overview.target,
    });
    studioRef.current = studio;

    const model = createRillieuxEvaporatorModel();
    modelRef.current = model;
    studio.scene.add(model.group);

    let lastTime: number | null = null;
    const animate = (now: number) => {
      const dt = lastTime === null ? 0.016 : Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;
      timeRef.current += dt;

      const p = live.current;
      const simState = stepRillieuxEvaporator({
        juiceFeedRateKgPerH: p.juiceFeedRateKgPerH,
        initialBrixDeg: p.initialBrixDeg,
        targetBrixDeg: p.targetBrixDeg,
        numberOfEffects: p.numberOfEffects,
      });

      model.update(simState, timeRef.current);

      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      model.dispose();
      studio.cleanup();
      studioRef.current = null;
      modelRef.current = null;
    };
  }, [live]);

  return (
    <div
      className={`flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent ${className}`}
    >
      <div className="sr-only">Norbert Rillieux Multiple-Effect Evaporator 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-14rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> View:
            </span>
            {(Object.keys(CAMERA_PRESETS) as CameraPreset[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => handlePresetChange(key)}
                className={`px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
                  cameraPreset === key
                    ? "bg-amber-600 text-white shadow-xs font-semibold"
                    : "text-ink-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {CAMERA_PRESETS[key].label}
              </button>
            ))}
          </div>
        )}

        {/* Top-Right Action Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap justify-end gap-1.5 sm:gap-2 max-w-[90%]">
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
            <Zap className="w-3.5 h-3.5 inline sm:mr-1" />
            <span className="hidden md:inline">{showUiOverlay ? "Hide HUD" : "Show HUD"}</span>
          </button>
          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => handlePresetChange("overview")}
            className="p-1.5 sm:px-2 sm:py-1.5 rounded-lg text-xs font-sans bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border border-parchment-300 dark:border-ink-700 hover:bg-parchment-100 transition-colors shadow-xs"
            title="Reset Orbit Camera"
          >
            <Camera className="w-3.5 h-3.5 inline" />
          </button>
        </div>

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                Fuel Economy:
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                {state.fuelSavingsPct.toFixed(1)}% Fuel Saved
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Steam Economy:</span>
              <span className="text-cyan-800 dark:text-cyan-400 font-bold">
                {state.steamEconomyRatio.toFixed(2)} kg/kg
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Evaporation Rate:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {state.totalEvaporationKgPerH.toFixed(0)} kg/h
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Final Syrup:</span>
              <span className="text-purple-800 dark:text-purple-400 font-bold">
                {state.syrupOutputRateKgPerH.toFixed(0)} kg/h ({targetBrixDeg}°Bx)
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
              <span className="text-ink-700 dark:text-ink-300 font-medium">Juice Feed Rate</span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {juiceFeedRateKgPerH} kg/h
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="10000"
              step="250"
              value={juiceFeedRateKgPerH}
              onChange={(e) =>
                updateParam("juiceFeedRateKgPerH", Number.parseFloat(e.target.value))
              }
              className="w-full accent-amber-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Initial Raw Juice Brix
              </span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {initialBrixDeg} °Bx
              </span>
            </div>
            <input
              type="range"
              min="8"
              max="25"
              step="1"
              value={initialBrixDeg}
              onChange={(e) => updateParam("initialBrixDeg", Number.parseFloat(e.target.value))}
              className="w-full accent-cyan-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Target Concentrate Brix
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                {targetBrixDeg} °Bx
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="75"
              step="1"
              value={targetBrixDeg}
              onChange={(e) => updateParam("targetBrixDeg", Number.parseFloat(e.target.value))}
              className="w-full accent-emerald-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
