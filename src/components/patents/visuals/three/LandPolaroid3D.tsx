"use client";

import { Eye, EyeOff, RotateCcw } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { createLandPolaroidModel, type LandPolaroidModelNodes } from "./landPolaroidModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

interface LandPolaroid3DProps {
  className?: string;
}

type CameraPreset = "overview" | "rollers" | "pod" | "print";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { label: string; pos: [number, number, number]; target: [number, number, number] }
> = {
  overview: {
    label: "Instant Camera & Film Overview",
    pos: [3.5, 5.0, 7.5],
    target: [0.5, 0, 1.2],
  },
  rollers: {
    label: "Nip Pressure Rollers",
    pos: [1.8, 2.2, 2.5],
    target: [0.6, 0, 0],
  },
  pod: {
    label: "Rupturable Reagent Pod",
    pos: [0.6, 2.5, 1.5],
    target: [0.6, 0, -0.6],
  },
  print: {
    label: "Developing Positive Print",
    pos: [3.5, 2.8, 4.5],
    target: [2.4, 0, 2.8],
  },
};

export const LandPolaroid3D: React.FC<LandPolaroid3DProps> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const modelRef = useRef<LandPolaroidModelNodes | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);

  const { params, updateParam } = usePatentPhysics("us-2543181-land-polaroid");
  const developmentTimeSec = params.developmentTimeSec ?? 30;
  const exposureFraction = params.exposureFraction ?? 0.6;
  const reagentViscosityCp = params.reagentViscosityCp ?? 25000;
  const rollerGapUm = params.rollerGapUm ?? 25;
  const alkaliPh = params.alkaliPh ?? 12.6;

  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("overview");

  const live = useLiveSimParams({
    developmentTimeSec,
    exposureFraction,
    reagentViscosityCp,
    rollerGapUm,
    alkaliPh,
  });

  const handlePresetChange = (preset: CameraPreset) => {
    setCameraPreset(preset);
    const targetConfig = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(targetConfig.pos, targetConfig.target);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const overview = CAMERA_PRESETS.overview;
    const studio = createThreeStudioScene({
      container,
      cameraPos: overview.pos,
      targetPos: overview.target,
    });
    studioRef.current = studio;

    const model = createLandPolaroidModel(live.current);
    modelRef.current = model;
    studio.scene.add(model.group);

    const animate = () => {
      timeRef.current += 0.016;
      studio.controls.update();
      model.update(timeRef.current, live.current);
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
      <div className="sr-only">Edwin Land Polaroid Instant Film 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-14rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
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
            {showUiOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden md:inline">{showUiOverlay ? "Hide HUD" : "Show HUD"}</span>
          </button>

          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => handlePresetChange("overview")}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Bottom-Left Telemetry Banner */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 bg-parchment-50/95 dark:bg-ink-950/95 p-3 rounded-xl border border-parchment-300 dark:border-ink-800 backdrop-blur-md pointer-events-none shadow-md max-w-sm">
            <div className="text-xs font-mono font-bold text-amber-800 dark:text-amber-400">
              US 2,543,181 — Edwin Land Polaroid Instant Film
            </div>
            <div className="text-[10px] font-sans text-ink-600 dark:text-ink-400 mt-0.5">
              Diffusion Transfer Reversal with Rupturable Foil Pod &amp; Squeegee Rollers
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Development Time</span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {developmentTimeSec} s
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              step="1"
              value={developmentTimeSec}
              onChange={(e) => updateParam("developmentTimeSec", Number.parseFloat(e.target.value))}
              className="w-full accent-amber-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Exposure Exposure</span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {(exposureFraction * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={exposureFraction}
              onChange={(e) => updateParam("exposureFraction", Number.parseFloat(e.target.value))}
              className="w-full accent-cyan-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Roller Gap</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                {rollerGapUm} µm
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              step="1"
              value={rollerGapUm}
              onChange={(e) => updateParam("rollerGapUm", Number.parseFloat(e.target.value))}
              className="w-full accent-emerald-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
