"use client";

import {
  Anchor,
  Camera,
  Eye,
  EyeOff,
  Layers,
  RotateCcw,
  Volume2,
  VolumeX,
  Waves,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import { stepLincolnBuoy } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildLincolnBuoyModel, updateLincolnBuoyKinematics } from "./lincolnBuoyModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "bellows_chambers" | "pilothouse" | "paddlewheel" | "keel" | "top";

export function LincolnBuoy3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Marine Hydrostatic State Controls
  const { params } = usePatentPhysics("us-6469-lincoln-buoy");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const bellowsInflationPct = params.inflationPct ?? 75;
  const steamboatWeightTons = params.weightTons ?? 380;
  const riverShoalDepthFt = params.shoalDepth ?? 3.5;
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const lincoln = stepLincolnBuoy({
    inflationPct: bellowsInflationPct,
    weightTons: steamboatWeightTons,
    shoalDepth: riverShoalDepthFt,
  });
  const hullLengthFt = lincoln.hullLengthFt;
  const hullBeamFt = lincoln.hullBeamFt;
  const waterDensityLbsPerCuFt = lincoln.waterDensityLbsPerCuFt;
  const hullWaterplaneAreaSqFt = lincoln.waterplaneAreaSqFt;
  const baseDraftFt = lincoln.baseDraftFt;

  const netLiftTons = lincoln.liftTons;
  const effectiveDraftFt = lincoln.hullDraftFt;
  const underKeelClearanceFt = lincoln.shoalClearanceFt.toFixed(2);
  const isAground = lincoln.shoalClearanceFt <= 0;

  const live = useLiveSimParams({
    bellowsInflationPct,
    riverShoalDepthFt,
    baseDraftFt,
    effectiveDraftFt,
    isCutaway,
    isAudioMuted,
    liftKn: lincoln.liftKn,
    shoalClearanceFt: lincoln.shoalClearanceFt,
    paddleDisplayOmegaRadPerS: lincoln.paddleDisplayOmegaRadPerS,
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
        camera.position.set(14, 10, 16);
        controls.target.set(0, 0, 0);
        break;
      case "bellows_chambers":
        camera.position.set(0, -0.8, 6.5);
        controls.target.set(0, -0.5, 0);
        break;
      case "pilothouse":
        camera.position.set(-5.5, 5.0, 5.0);
        controls.target.set(-3.2, 3.5, 0);
        break;
      case "paddlewheel":
        camera.position.set(8.5, 1.2, 3.5);
        controls.target.set(6.8, 0, 0);
        break;
      case "keel":
        camera.position.set(0, -4.5, 8.5);
        controls.target.set(0, -1.0, 0);
        break;
      case "top":
        camera.position.set(0, 13.0, 0.1);
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
      cameraPos: [14, 10, 16],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // --- 3D STEAMBOAT & LINCOLN BELLOWS ASSEMBLY ---
    const model = buildLincolnBuoyModel();
    scene.add(model.rootGroup);

    // --- RENDER LOOP & REAL-TIME HYDROSTATIC DYNAMICS ---
    let reqId: number;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const p = live.current;

      const dt = 1 / 60;
      updateLincolnBuoyKinematics(
        model,
        dt,
        p.bellowsInflationPct,
        p.riverShoalDepthFt,
        p.baseDraftFt,
        p.effectiveDraftFt,
        p.paddleDisplayOmegaRadPerS,
        p.isCutaway,
      );

      model.materials.hullWood.color.setHex(p.shoalClearanceFt > 0 ? 0x5c3a21 : 0x991b1b);

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
                <Anchor className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 animate-pulse" />
                Hydrostatic Buoyancy Telemetry
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 sm:gap-y-1 mt-1 text-[10px] sm:text-xs font-sans">
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Draft:</span>{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {effectiveDraftFt.toFixed(1)} ft · {hullLengthFt}×{hullBeamFt} ft ·{" "}
                    {hullWaterplaneAreaSqFt.toFixed(0)} ft² · {waterDensityLbsPerCuFt} lb/ft³
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Lift:</span>{" "}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    +{netLiftTons} T Lift
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Depth:</span>{" "}
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {riverShoalDepthFt.toFixed(1)} ft
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Clearance:</span>{" "}
                  <span
                    className={`font-bold ${
                      isAground
                        ? "text-red-600 dark:text-red-400"
                        : "text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {underKeelClearanceFt} ft ({isAground ? "Aground" : "Clear"})
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 items-center gap-2 max-w-full">
              <Waves className="w-3.5 h-3.5 text-blue-500 animate-pulse shrink-0" />
              <span className="truncate">Abraham Lincoln (US 6,469) — Buoying Vessels (1849)</span>
            </div>
          </div>
        )}

        {/* Top Right Tool Bar (Toggle UI, Audio, Pins, Reset) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Switch to Solid Hull" : "Switch to Hull Cutaway"}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              isCutaway
                ? "bg-amber-600 text-white border-amber-700 shadow-md"
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
            title={isAudioMuted ? "Enable Sound" : "Mute Sound"}
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
                ["bellows_chambers", "Air Bellows"],
                ["pilothouse", "Pilothouse"],
                ["paddlewheel", "Paddlewheel"],
                ["keel", "Keel & Hull"],
                ["top", "Plan View"],
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
