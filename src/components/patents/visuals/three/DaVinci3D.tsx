"use client";

import { Camera, Eye, EyeOff, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  createThreeStudioScene,
  type StudioContext,
} from "@/components/patents/visuals/three/ThreeStudioScene";
import { useLiveSimParams } from "@/components/patents/visuals/three/useLiveSimParams";
import { type DaVinciState, stepDaVinci } from "@/physics/daVinciKernel";
import { TickScheduler } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { buildDaVinciModel } from "./DaVinciModel";
import { StudioKernelChips } from "./StudioKernelChips";

const EXHIBIT_ID = "us-6331181-davinci";

type CameraPreset = "iso" | "master_console" | "slave_wrist" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [0, 1.2, 2.5], target: [0, 0, 0] },
  master_console: { pos: [0, 1.6, 1.8], target: [0, 0.8, 0] },
  slave_wrist: { pos: [0, 0.5, 1.5], target: [0, 0, 0] },
  top: { pos: [0, 4.0, 0.01], target: [0, 0, 0] },
};

export function DaVinci3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [hud, setHud] = useState({
    scale: 3,
    tremorAtten: 94.5,
    tipVelocity: 0,
  });
  const { params } = usePatentPhysics(EXHIBIT_ID);
  const live = useLiveSimParams(params);

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
      container: container as HTMLDivElement,
      cameraPos: iso.pos,
      targetPos: iso.target,
    });
    studioRef.current = studio;
    const model = buildDaVinciModel();
    studio.scene.add(model.root);

    let renderedSteps = 0;
    const sched = new TickScheduler(1 / 120, 0);
    let hudCounter = 0;
    let rafId = 0;
    let currentState: DaVinciState | undefined;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      renderedSteps += 1;
      const p = live.current;
      const timeSec = renderedSteps / 60;

      sched.pump(timeSec, () => {
        currentState = stepDaVinci(
          {
            motionScaleRatio: p.motionScaleRatio ?? 3.0,
            tremorFilterEnabled: (p.tremorFilterEnabled ?? 1) > 0.5,
            masterInputSpeedMps: p.masterInputSpeedMps ?? 0.5,
            gripAngleDeg: p.gripAngleDeg ?? 30,
          },
          timeSec,
          currentState,
        );
      });

      if (currentState) {
        model.masterHandle.position.set(
          currentState.masterX,
          currentState.masterY + 0.8,
          currentState.masterZ,
        );

        model.baseGroup.position.set(currentState.slaveX, currentState.slaveY, currentState.slaveZ);
        model.baseGroup.rotation.y = currentState.baseYawRad;
        model.baseGroup.rotation.x = currentState.shoulderPitchRad;

        model.wristPitchGroup.rotation.x = currentState.wristPitchRad;
        model.wristYawGroup.rotation.y = currentState.wristYawRad;
        model.wristRollGroup.rotation.z = currentState.wristRollRad;

        model.leftJawGroup.rotation.z = -currentState.gripRad / 2;
        model.rightJawGroup.rotation.z = currentState.gripRad / 2;

        hudCounter += 1;
        if (hudCounter % 10 === 0) {
          setHud({
            scale: p.motionScaleRatio ?? 3,
            tremorAtten: currentState.tremorAttenuationPercent,
            tipVelocity: currentState.tipVelocityMms,
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
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

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

        {/* Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-1.5rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3.5 h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["master_console", "Surgeon Console"],
                ["slave_wrist", "Articulated Wrist"],
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

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="DaVinci Telesurgical Kinematics"
          chips={[
            { label: "Scale Ratio", value: `${hud.scale}:1` },
            {
              label: "Tremor Filter",
              value: hud.tremorAtten > 0 ? "Active (-26 dB)" : "Bypassed",
              tone: hud.tremorAtten > 0 ? "ok" : "warn",
            },
            { label: "Tip Speed", value: hud.tipVelocity.toFixed(1), unit: "mm/s" },
          ]}
        />
      </div>
    </div>
  );
}

export default DaVinci3D;
