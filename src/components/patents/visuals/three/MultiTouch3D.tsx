"use client";

import { Camera, Eye, EyeOff, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  createThreeStudioScene,
  type StudioContext,
} from "@/components/patents/visuals/three/ThreeStudioScene";
import { useLiveSimParams } from "@/components/patents/visuals/three/useLiveSimParams";
import { type MultiTouchState, stepMultiTouch } from "@/physics/multiTouchKernel";
import { TickScheduler } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { buildMultiTouchModel } from "./MultiTouchModel";
import { StudioKernelChips } from "./StudioKernelChips";

const EXHIBIT_ID = "us-7479949-multitouch";

type CameraPreset = "iso" | "touch_surface" | "sensor_grid" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [0, 0, 4.5], target: [0, 0, 0] },
  touch_surface: { pos: [0, 0.8, 3.2], target: [0, 0, 0] },
  sensor_grid: { pos: [0, 1.8, 2.5], target: [0, 0, 0] },
  top: { pos: [0, 5.0, 0.01], target: [0, 0, 0] },
};

export function MultiTouch3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [hud, setHud] = useState({
    mode: "Pinch-to-Zoom",
    zoom: 1.0,
    touchCount: 2,
    deltaC: "0.68",
  });
  const { params, updateParam } = usePatentPhysics(EXHIBIT_ID);
  const fingerSeparationMm = (params.fingerSeparationMm as number) ?? 50;
  const fingerCount = (params.fingerCount as number) ?? 2;

  const live = useLiveSimParams({
    fingerSeparationMm,
    fingerCount,
    touchPressureGrams: params.touchPressureGrams ?? 80,
    gestureVelocityMmS: params.gestureVelocityMmS ?? 15,
  });

  const studioRef = useRef<StudioContext | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
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
    const model = buildMultiTouchModel();
    studio.scene.add(model.root);

    let renderedSteps = 0;
    const sched = new TickScheduler(1 / 120, 0);
    let hudCounter = 0;
    let rafId = 0;
    let currentState: MultiTouchState | undefined;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      renderedSteps += 1;
      const p = live.current;
      const timeSec = renderedSteps / 60;

      sched.pump(timeSec, () => {
        currentState = stepMultiTouch(
          {
            fingerCount: p.fingerCount ?? 2,
            fingerSeparationMm: p.fingerSeparationMm ?? 50,
            touchPressureGrams: p.touchPressureGrams ?? 80,
            gestureVelocityMmS: p.gestureVelocityMmS ?? 15,
          },
          timeSec,
          currentState,
        );
      });

      if (currentState) {
        model.touch1.visible = currentState.activeTouchCount >= 1;
        model.touch2.visible = currentState.activeTouchCount >= 2;

        if (currentState.activeTouchCount >= 1) {
          model.touch1.position.x = currentState.touch1X;
          model.touch1.position.y = currentState.touch1Y;
        }

        if (currentState.activeTouchCount >= 2) {
          model.touch2.position.x = currentState.touch2X;
          model.touch2.position.y = currentState.touch2Y;
        }

        const targetScale = Math.max(0.5, Math.min(3.0, currentState.zoomScale));
        const curDocS = model.docGroup.scale.x;
        const nextDocS = curDocS + (targetScale - curDocS) * 0.15;
        model.docGroup.scale.set(nextDocS, nextDocS, nextDocS);

        if (currentState.gestureMode === "Two-Finger Rotate") {
          model.docGroup.rotation.z = (currentState.rotationAngleDeg * Math.PI) / 180;
        } else if (currentState.gestureMode === "Single-Finger Scroll") {
          model.docGroup.position.x = currentState.touch1X * 0.5;
          model.docGroup.position.y = currentState.touch1Y * 0.5;
        }

        model.mainGroup.rotation.x = Math.sin(timeSec * 0.5) * 0.08 + 0.1;
        model.mainGroup.rotation.y = Math.cos(timeSec * 0.4) * 0.08;

        hudCounter += 1;
        if (hudCounter % 10 === 0) {
          setHud({
            mode: currentState.gestureMode,
            zoom: Number(currentState.zoomScale.toFixed(2)),
            touchCount: currentState.activeTouchCount,
            deltaC: currentState.mutualCapacitanceDeltaPf.toFixed(2),
          });
        }
      }

      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      model.dispose();
      studio.dispose();
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Steve Jobs Apple Multi-Touch Gesture Detection 3D</div>
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
                ["touch_surface", "Glass Surface"],
                ["sensor_grid", "ITO Sensor Grid"],
                ["top", "Plan View"],
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

        {/* Top Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showUiOverlay
                ? "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
                : "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
            }`}
            title={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
            aria-label={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
          >
            {showUiOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">Gesture Mode:</span>
              <span className="font-bold text-amber-700 dark:text-amber-400">{hud.mode}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Affine Scale Factor:</span>
              <span className="font-bold text-cyan-800 dark:text-cyan-400">{hud.zoom}x</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Capacitance Shunt:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">-{hud.deltaC} pF</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Active Contacts:</span>
              <span className="font-bold text-purple-800 dark:text-purple-400">{hud.touchCount} pts</span>
            </div>
          </div>
        )}

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="MultiTouch Capacitive State"
          chips={[
            { label: "Gesture", value: hud.mode },
            { label: "Scale", value: `${hud.zoom}x` },
            { label: "Contacts", value: `${hud.touchCount}`, unit: "pts" },
            { label: "ΔC", value: `-${hud.deltaC}`, unit: "pF" },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Contact Separation Distance</span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">{fingerSeparationMm} mm</span>
            </div>
            <input
              type="range"
              min="15"
              max="120"
              step="5"
              value={fingerSeparationMm}
              onChange={(e) => updateParam("fingerSeparationMm", Number.parseInt(e.target.value, 10))}
              className="w-full accent-amber-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Active Touch Contacts</span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">{fingerCount} pts</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="1"
              value={fingerCount}
              onChange={(e) => updateParam("fingerCount", Number.parseInt(e.target.value, 10))}
              className="w-full accent-cyan-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MultiTouch3D;
