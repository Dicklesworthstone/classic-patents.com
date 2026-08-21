"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  createThreeStudioScene,
  type StudioContext,
} from "@/components/patents/visuals/three/ThreeStudioScene";
import { useLiveSimParams } from "@/components/patents/visuals/three/useLiveSimParams";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { ROOMBA_ROOM, type RoombaState, stepRoomba } from "@/physics/roombaKernel";
import { TickScheduler } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { buildRoombaModel } from "./RoombaModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { usePatentAudio } from "./usePatentAudio";

const EXHIBIT_ID = "us-6594844-roomba";

type CameraPreset = "iso" | "robot_chassis" | "cleaning_path" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [0, 3.2, 3.2], target: [0, 0, 0] },
  robot_chassis: { pos: [0, 1.2, 1.5], target: [0, 0, 0] },
  cleaning_path: { pos: [2.5, 3.5, 2.5], target: [0, 0, 0] },
  top: { pos: [0, 5.5, 0.01], target: [0, 0, 0] },
};

export function Roomba3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [hud, setHud] = useState({ mode: "spiral", speed: 0.3 });
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const { params, updateParam } = usePatentPhysics(EXHIBIT_ID);
  const wheelSpeedMps = (params.wheelSpeedMps as number) ?? 0.3;
  const turnRateRadSec = (params.turnRateRadSec as number) ?? 1.5;

  const live = useLiveSimParams({
    wheelSpeedMps,
    turnRateRadSec,
    isCutaway,
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
    const model = buildRoombaModel();
    studio.scene.add(model.root);

    let renderedSteps = 0;
    const sched = new TickScheduler(1 / 120, 0);
    let hudCounter = 0;
    let rafId = 0;
    let currentState: RoombaState | undefined;
    let lastFrameTimeMs: number | undefined;

    const animate = (frameTimeMs: number) => {
      rafId = requestAnimationFrame(animate);
      const delta =
        lastFrameTimeMs !== undefined ? Math.min((frameTimeMs - lastFrameTimeMs) / 1000, 0.1) : 0;
      lastFrameTimeMs = frameTimeMs;

      renderedSteps += 1;
      const p = live.current;

      sched.pump(renderedSteps / 60, () => {
        currentState = stepRoomba(
          {
            wheelSpeedMps: p.wheelSpeedMps ?? 0.3,
            turnRateRadSec: p.turnRateRadSec ?? 1.5,
            roomWidth: ROOMBA_ROOM.width,
            roomHeight: ROOMBA_ROOM.height,
          },
          currentState,
          1 / 120,
        );
      });

      if (currentState) {
        model.mainGroup.position.x = currentState.displayX;
        model.mainGroup.position.z = currentState.displayY;
        model.mainGroup.rotation.y = -currentState.heading;
        model.updateKinematics(
          delta,
          p.wheelSpeedMps ?? 0.3,
          currentState.displayX,
          currentState.displayY,
        );

        if (renderedSteps % 4 === 0) {
          model.updateTrail(currentState.displayX, currentState.displayY);
        }

        hudCounter += 1;
        if (hudCounter % 15 === 0) {
          setHud({
            mode: currentState.mode,
            speed: p.wheelSpeedMps ?? 0.3,
          });
        }
      }

      model.setCutaway?.(p.isCutaway ?? false);

      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      model.dispose();
      studio.dispose();
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Autonomous Roomba Robotic Vacuum 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-14rem)] sm:max-w-[calc(100%-28rem)] gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3.5 h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["robot_chassis", "Chassis Cutaway"],
                ["cleaning_path", "Cleaning Spiral"],
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
            onClick={() => {
              toggleSound();
              soundEngine.playSwitchClick();
            }}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            aria-label={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              isCutaway
                ? "bg-cyan-600 text-white border-cyan-700 shadow-md ring-2 ring-cyan-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
            title={isCutaway ? "Solid Chassis Shell" : "Transparent Internal Cutaway"}
            aria-label={isCutaway ? "Solid Chassis Shell" : "Transparent Internal Cutaway"}
          >
            <Layers className="w-4 h-4" />
          </button>

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
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                Drive Speed:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {wheelSpeedMps.toFixed(2)} m/s
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Navigation Mode:</span>
              <span className="font-bold text-cyan-800 dark:text-cyan-400">
                {hud.mode.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Turn Rate:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {turnRateRadSec.toFixed(1)} rad/s
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Room Coverage:</span>
              <span className="font-bold text-purple-800 dark:text-purple-400">98.4%</span>
            </div>
          </div>
        )}

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="Autonomous Navigation State"
          chips={[
            { label: "Behavior", value: hud.mode.toUpperCase() },
            { label: "Wheel Speed", value: `${hud.speed.toFixed(2)}`, unit: "m/s" },
            { label: "Coverage", value: "98.4", unit: "%", tone: "ok" },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SensitivitySlider
            id="roombaDriveSpeed"
            patentId="us-6594844-roomba"
            paramKey="wheelSpeedMps"
            label="Drive Speed"
            value={wheelSpeedMps}
            min={0.1}
            max={1.0}
            step={0.1}
            unit=" m/s"
            onChange={(val) => updateParam("wheelSpeedMps", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="roombaTurnRate"
            patentId="us-6594844-roomba"
            paramKey="turnRateRadSec"
            label="Turn Deflection Rate"
            value={turnRateRadSec}
            min={0.5}
            max={3.0}
            step={0.5}
            unit=" rad/s"
            onChange={(val) => updateParam("turnRateRadSec", val)}
            allParams={params}
          />
        </div>

        <ClaimConstraintToggle
          patentId="us-6594844-roomba"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip patentId="us-6594844-roomba" params={params} className="mt-3" />
      </div>
    </div>
  );
}

export default Roomba3D;
