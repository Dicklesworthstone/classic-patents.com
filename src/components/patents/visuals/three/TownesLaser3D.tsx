"use client";

import { Camera, Eye, EyeOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepTownesLaser } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import {
  articulateTownesLaserModel,
  buildTownesLaserModel,
  type TownesLaserModelNodes,
} from "./townesLaserModel";
import { useLiveSimParams } from "./useLiveSimParams";

interface TownesLaser3DProps {
  initialPumpPowerWatts?: number;
  initialCavityLengthCm?: number;
  initialMirror2ReflectivityPct?: number;
  initialBeamDiameterMm?: number;
}

type CameraPreset = "isometric" | "opticalCavity" | "rearReflector" | "outputCoupler" | "detector";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  isometric: { pos: [0, 2.5, 5.0], target: [0, 0, 0] },
  opticalCavity: { pos: [-0.3, 0.8, 3.2], target: [-0.3, 0, 0] },
  rearReflector: { pos: [-1.8, 0.6, 2.2], target: [-1.8, 0, 0] },
  outputCoupler: { pos: [1.2, 0.6, 2.2], target: [1.2, 0, 0] },
  detector: { pos: [2.6, 0.6, 2.2], target: [2.6, 0, 0] },
};

export function TownesLaser3D({
  initialPumpPowerWatts = 350,
  initialCavityLengthCm = 25,
  initialMirror2ReflectivityPct = 94,
  initialBeamDiameterMm = 8,
}: TownesLaser3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const nodesRef = useRef<TownesLaserModelNodes | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const [showUiOverlay, setShowUiOverlay] = useState(true);

  const { params, updateParam } = usePatentPhysics("us-2929922-townes-laser");
  const pumpPowerWatts = params.pumpPowerWatts ?? initialPumpPowerWatts;
  const cavityLengthCm = params.cavityLengthCm ?? initialCavityLengthCm;
  const mirror2ReflectivityPct = params.mirror2ReflectivityPct ?? initialMirror2ReflectivityPct;
  const beamDiameterMm = params.beamDiameterMm ?? initialBeamDiameterMm;

  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("isometric");
  const [isRotating, setIsRotating] = useState(false);

  const sim = stepTownesLaser({
    pumpPowerWatts,
    cavityLengthCm,
    mirror2ReflectivityPct,
    beamDiameterMm,
  });

  const live = useLiveSimParams({
    pumpPowerWatts,
    laserOutputPowerWatts: sim.laserOutputPowerWatts,
    intraCavityPowerWatts: sim.intraCavityPowerWatts,
    isLasing: sim.isLasing,
    pumpShimmerOmegaRadPerS: sim.pumpShimmerOmegaRadPerS,
    beamShimmerOmegaRadPerS: sim.beamShimmerOmegaRadPerS,
    isRotating,
  });

  const handlePresetChange = (preset: CameraPreset) => {
    setCameraPreset(preset);
    const targetConfig = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(targetConfig.pos, targetConfig.target);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const overview = CAMERA_PRESETS.isometric;
    const studio = createThreeStudioScene({
      container,
      cameraPos: overview.pos,
      targetPos: overview.target,
    });
    studioRef.current = studio;

    const nodes = buildTownesLaserModel();
    studio.scene.add(nodes.root);
    nodesRef.current = nodes;

    const animate = () => {
      timeRef.current += 0.016;
      const current = live.current;
      if (current.isRotating) {
        nodes.root.rotation.y += 0.0044;
      }
      studio.controls.update();

      articulateTownesLaserModel(
        nodes,
        {
          pumpPowerWatts: current.pumpPowerWatts,
          laserOutputPowerWatts: current.laserOutputPowerWatts,
          intraCavityPowerWatts: current.intraCavityPowerWatts,
          isLasing: current.isLasing,
          pumpShimmerOmegaRadPerS: current.pumpShimmerOmegaRadPerS,
          beamShimmerOmegaRadPerS: current.beamShimmerOmegaRadPerS,
        },
        timeRef.current,
      );

      studio.renderer.render(studio.scene, studio.camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      for (const m of nodes.materials) {
        m.dispose();
      }
      studio.cleanup();
      studioRef.current = null;
      nodesRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Townes &amp; Schawlow Optical Maser Laser 3D</div>
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
                ["isometric", "Isometric"],
                ["opticalCavity", "Optical Cavity"],
                ["rearReflector", "Rear Mirror"],
                ["outputCoupler", "Output Coupler"],
                ["detector", "Detector"],
              ] as [CameraPreset, string][]
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetChange(preset)}
                className={`px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
                  cameraPreset === preset
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
            onClick={() => setIsRotating(!isRotating)}
            className={`p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              isRotating
                ? "bg-amber-700 text-white border-amber-800 dark:bg-amber-600"
                : "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
            }`}
          >
            {isRotating ? "Stop Orbit" : "Auto Orbit"}
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
            onClick={() => handlePresetChange("isometric")}
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
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">State:</span>
              <span
                className={`font-bold ${sim.isLasing ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}`}
              >
                {sim.isLasing ? "LASING COHERENT" : "BELOW THRESHOLD"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Output Power:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {sim.laserOutputPowerWatts} W
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Threshold Gain:</span>
              <span className="text-emerald-800 dark:text-emerald-400 font-bold">
                {sim.thresholdGainPerCm} cm⁻¹
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Intracavity Flux:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {sim.intraCavityPowerWatts} W
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Beam Divergence:</span>
              <span className="text-sky-800 dark:text-sky-400 font-bold">
                {sim.beamDivergenceMrad} mrad
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
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Flashlamp Optical Pump
              </span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {pumpPowerWatts} W
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="1000"
              step="25"
              value={pumpPowerWatts}
              onChange={(e) => updateParam("pumpPowerWatts", Number.parseFloat(e.target.value))}
              className="w-full accent-amber-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Cavity Resonator Length
              </span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {cavityLengthCm} cm
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              step="1"
              value={cavityLengthCm}
              onChange={(e) => updateParam("cavityLengthCm", Number.parseFloat(e.target.value))}
              className="w-full accent-cyan-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Coupler Reflectivity
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                {mirror2ReflectivityPct}%
              </span>
            </div>
            <input
              type="range"
              min="80"
              max="99"
              step="1"
              value={mirror2ReflectivityPct}
              onChange={(e) =>
                updateParam("mirror2ReflectivityPct", Number.parseFloat(e.target.value))
              }
              className="w-full accent-emerald-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TownesLaser3D;
