"use client";

import { Camera, Zap } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { DEFAULT_LOCK_BITTINGS_MM, stepYaleLock } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { createYaleLockModel } from "./yaleLockModel";

type CameraPreset = "iso" | "cutaway" | "keyway" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [5.0, 3.5, 6.0], target: [0, 0, 0] },
  cutaway: { pos: [0, 0, 7.5], target: [0, 0, 0] },
  keyway: { pos: [-6.5, 0, 0], target: [0, 0, 0] },
  top: { pos: [0, 7.5, 0.1], target: [0, 0, 0] },
};

interface YaleLock3DProps {
  initialKeyInsertion?: number;
  initialAppliedTorque?: number;
}

export function YaleLock3D({
  initialKeyInsertion = 1.0,
  initialAppliedTorque = 0.15,
}: YaleLock3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const insertionId = useId();
  const torqueId = useId();

  const { params, updateParam } = usePatentPhysics("us-48475-yale-lock");
  const keyInsertion = params.keyInsertion ?? initialKeyInsertion;
  const appliedTorqueNm = params.appliedTorqueNm ?? initialAppliedTorque;
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [useAuthorizedKey, setUseAuthorizedKey] = useState<boolean>(true);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("iso");

  const handlePresetChange = (preset: CameraPreset) => {
    setCameraPreset(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const activeKeyBittings = useMemo(() => {
    return useAuthorizedKey ? DEFAULT_LOCK_BITTINGS_MM : [5.0, 3.0, 5.5, 2.5, 5.0];
  }, [useAuthorizedKey]);

  const yaleState = useMemo(() => {
    return stepYaleLock({
      keyInsertion,
      appliedTorqueNm: isRotating ? appliedTorqueNm : 0.0,
      keyBittingsMm: activeKeyBittings,
      lockBittingsMm: DEFAULT_LOCK_BITTINGS_MM,
      currentPlugAngleRad: isRotating && keyInsertion >= 0.95 && useAuthorizedKey ? Math.PI / 2 : 0,
    });
  }, [keyInsertion, appliedTorqueNm, activeKeyBittings, isRotating, useAuthorizedKey]);

  const live = useLiveSimParams({ yaleState, keyInsertion });

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

    const model = createYaleLockModel();
    studio.scene.add(model.group);

    let rafId = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      model.update(live.current.yaleState, live.current.keyInsertion);
      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      model.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Linus Yale Jr Pin Tumbler Cylinder Lock 3D</div>
      {/* 3D WebGL Canvas Viewport */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-14rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <button
              type="button"
              onClick={() => handlePresetChange("iso")}
              className={`px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
                cameraPreset === "iso"
                  ? "bg-amber-600 text-white shadow-xs font-semibold"
                  : "text-ink-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
              }`}
            >
              Isometric
            </button>
            <button
              type="button"
              onClick={() => handlePresetChange("cutaway")}
              className={`px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
                cameraPreset === "cutaway"
                  ? "bg-amber-600 text-white shadow-xs font-semibold"
                  : "text-ink-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
              }`}
            >
              Cutaway Side
            </button>
            <button
              type="button"
              onClick={() => handlePresetChange("top")}
              className={`px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
                cameraPreset === "top"
                  ? "bg-amber-600 text-white shadow-xs font-semibold"
                  : "text-ink-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
              }`}
            >
              Top Shear
            </button>
            <button
              type="button"
              onClick={() => handlePresetChange("keyway")}
              className={`px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
                cameraPreset === "keyway"
                  ? "bg-amber-600 text-white shadow-xs font-semibold"
                  : "text-ink-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
              }`}
            >
              Keyway Face
            </button>
          </div>
        )}

        {/* Top-Right Action Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap justify-end gap-1.5 sm:gap-2 max-w-[90%]">
          <button
            type="button"
            onClick={() => setUseAuthorizedKey(!useAuthorizedKey)}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              useAuthorizedKey
                ? "bg-emerald-700 text-white border-emerald-800 shadow-md ring-2 ring-emerald-500/30 dark:bg-emerald-600"
                : "bg-rose-700 text-white border-rose-800 shadow-md ring-2 ring-rose-500/30 dark:bg-rose-600"
            }`}
          >
            {useAuthorizedKey ? "Authorized Key" : "Wrong Key"}
          </button>

          <button
            type="button"
            disabled={!yaleState.isUnlocked}
            onClick={() => setIsRotating(!isRotating)}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              yaleState.isUnlocked
                ? isRotating
                  ? "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-600"
                  : "bg-cyan-700 text-white border-cyan-800 shadow-md ring-2 ring-cyan-500/30 dark:bg-cyan-600"
                : "bg-parchment-200 dark:bg-ink-800 text-ink-400 dark:text-parchment-600 border-parchment-300 dark:border-ink-700 cursor-not-allowed"
            }`}
          >
            {isRotating ? "Return (0°)" : "Turn Key (90°)"}
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
            <Zap className="w-3.5 h-3.5 inline sm:mr-1" />
            <span className="hidden md:inline">{showUiOverlay ? "Hide HUD" : "Show HUD"}</span>
          </button>
          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => handlePresetChange("iso")}
            className="p-1.5 sm:px-2 sm:py-1.5 rounded-lg text-xs font-sans bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border border-parchment-300 dark:border-ink-700 hover:bg-parchment-100 transition-colors shadow-xs"
            title="Reset Orbit Camera"
          >
            <Camera className="w-3.5 h-3.5 inline" />
          </button>
        </div>

        {/* Live HUD Overlay */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 pointer-events-none flex flex-col gap-1.5 font-sans text-xs max-w-xs">
            <div className="bg-parchment-50/90 dark:bg-ink-900/90 backdrop-blur-md p-2 rounded-xl border border-parchment-300 dark:border-ink-800 shadow-md">
              <div className="flex justify-between items-center text-xs pb-1 mb-1 border-b border-parchment-200 dark:border-ink-800">
                <span className="text-ink-600 dark:text-ink-400">Shear Status:</span>
                <span
                  className={
                    yaleState.isUnlocked
                      ? "text-emerald-700 dark:text-emerald-400 font-bold"
                      : "text-rose-700 dark:text-rose-400 font-bold"
                  }
                >
                  {yaleState.isUnlocked ? "ALIGNED (UNLOCKED)" : "PINS BINDING"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-ink-600 dark:text-ink-400">Max Pin Error:</span>
                <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                  {yaleState.maxShearErrorMm.toFixed(3)} mm
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-ink-600 dark:text-ink-400">Bolt Throw:</span>
                <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                  {yaleState.boltExtensionMm.toFixed(1)} mm{" "}
                  {yaleState.isDeadlocked ? "(LOCKED)" : ""}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <label htmlFor={insertionId} className="text-ink-700 dark:text-ink-300 font-medium">
                Key Blade Insertion Depth
              </label>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {(keyInsertion * 100).toFixed(0)}%
              </span>
            </div>
            <input
              id={insertionId}
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={keyInsertion}
              onChange={(e) => updateParam("keyInsertion", Number.parseFloat(e.target.value))}
              className="w-full accent-amber-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <label htmlFor={torqueId} className="text-ink-700 dark:text-ink-300 font-medium">
                Applied Rotational Torque
              </label>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {appliedTorqueNm.toFixed(2)} N·m
              </span>
            </div>
            <input
              id={torqueId}
              type="range"
              min="0"
              max="0.5"
              step="0.01"
              value={appliedTorqueNm}
              onChange={(e) => updateParam("appliedTorqueNm", Number.parseFloat(e.target.value))}
              className="w-full accent-cyan-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default YaleLock3D;
