"use client";

import { Camera, Eye, EyeOff, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { createStudioClock } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import {
  buildDaimlerMarineEngineModel,
  updateDaimlerMarineEngineKinematics,
} from "./daimlerEngineModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "motor" | "coupling" | "reverse" | "cooling" | "reservoirs";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [4.5, 3.5, 5.5], target: [0, 0.4, 0] },
  motor: { pos: [0, 1.4, 4.5], target: [0, 0.2, 0] },
  coupling: { pos: [1.3, 0.6, 3.2], target: [1.1, 0.15, 0] },
  reverse: { pos: [1.0, -0.2, 3.5], target: [1.1, 0.15, 0] },
  cooling: { pos: [0, 1.5, 3.5], target: [0, 0.2, 0.6] },
  reservoirs: { pos: [0, -1.5, 4.2], target: [0, -0.8, 0] },
};

export function DaimlerEngine3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { params, updateParam } = usePatentPhysics("us-361931-daimler-engine");

  const shaftPosition = params.shaftPosition ?? 1;
  const coolingPumpEnabled = params.coolingPumpEnabled ?? 1;
  const aheadContact = Math.max(0, Math.min(1, shaftPosition));
  const asternEngagement = Math.max(0, Math.min(1, -shaftPosition));
  const neutral = 1 - Math.min(1, Math.abs(shaftPosition));

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isMuted, toggleMute } = usePatentAudio();

  const live = useLiveSimParams({
    shaftPosition,
    coolingPumpEnabled,
    isPlaying,
  });

  const studioRef = useRef<StudioContext | null>(null);

  const setCameraView = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };
  const applyCameraPreset = setCameraView;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [4.5, 3.5, 5.5],
      targetPos: [0, 0.4, 0],
    });
    studioRef.current = studio;

    const engineModel = buildDaimlerMarineEngineModel();
    studio.scene.add(engineModel.rootGroup);

    let animId = 0;
    const clock = createStudioClock();

    const animate = (now: number) => {
      animId = requestAnimationFrame(animate);
      const { dt } = clock.pump(now);

      const p = live.current;
      if (p.isPlaying && !isMuted && dt > 0.5) soundEngine.playSwitchClick();
      updateDaimlerMarineEngineKinematics(engineModel, p.shaftPosition, p.coolingPumpEnabled);

      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      engineModel.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live, isMuted]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <PortHamiltonianEnergyStrip
        patentId="us-361931-daimler-engine"
        params={{
          shaftPosition,
          coolingPumpEnabled,
        }}
      />
      <div className="sr-only">Daimler marine propulsion installation, US 361,931</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-9.5rem)] sm:max-w-[calc(100%-28rem)] gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["motor", "Motor"],
                ["coupling", "Forward coupling"],
                ["reverse", "Reverse disks"],
                ["cooling", "Cooling pipes"],
                ["reservoirs", "Gas reservoirs"],
              ] as [CameraPreset, string][]
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => setCameraView(preset)}
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

        {/* Top-Right Action Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 max-w-[min(90%,26rem)] sm:max-w-[26rem] pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              isPlaying
                ? "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
                : "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-600"
            }`}
          >
            <Play className="w-3.5 h-3.5 inline sm:mr-1" />
            <span className="hidden md:inline">{isPlaying ? "Pause" : "Run"}</span>
          </button>
          <button
            type="button"
            onClick={toggleMute}
            className="p-1.5 sm:px-2 sm:py-1.5 rounded-lg text-xs font-sans bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border border-parchment-300 dark:border-ink-700 hover:bg-parchment-100 transition-colors shadow-xs"
            title={isMuted ? "Unmute installation audio" : "Mute installation audio"}
            aria-label={isMuted ? "Unmute installation audio" : "Mute installation audio"}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 inline" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 inline text-emerald-600 dark:text-emerald-400" />
            )}
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
            onClick={() => applyCameraPreset("iso")}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                Shaft position:
              </span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {shaftPosition.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Ahead contact:</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                {aheadContact.toFixed(2)} fraction
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Neutral:</span>
              <span className="text-rose-700 dark:text-rose-400 font-bold">
                {neutral.toFixed(2)} fraction
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Astern train:</span>
              <span className="text-sky-800 dark:text-sky-400 font-bold">
                {asternEngagement.toFixed(2)} fraction
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Installation:</span>
              <span className="text-purple-800 dark:text-purple-400 font-bold">
                marine / pump {coolingPumpEnabled ? "on" : "off"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SensitivitySlider
            id="daimlerShaftPosition"
            patentId="us-361931-daimler-engine"
            paramKey="shaftPosition"
            label="Propeller-shaft position"
            value={shaftPosition}
            min={-1}
            max={1}
            step={0.05}
            onChange={(val) => updateParam("shaftPosition", val)}
            allParams={params}
          />

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Cooling pump</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                {coolingPumpEnabled ? "on" : "off"}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="1"
              value={coolingPumpEnabled}
              onChange={(e) => updateParam("coolingPumpEnabled", Number(e.target.value))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>
        </div>

        <PortHamiltonianEnergyStrip
          patentId="us-361931-daimler-engine"
          params={params}
          className="mt-3"
        />
      </div>

      {/* Bottom SI Telemetry Chip Strip */}
      <StudioKernelChips
        visible={true}
        title="MARINE PROPULSION INSTALLATION"
        chips={[
          { label: "Shaft position", value: `${shaftPosition.toFixed(2)}`, unit: "fraction" },
          { label: "Ahead contact", value: `${aheadContact.toFixed(2)}`, unit: "fraction" },
          { label: "Astern train", value: `${asternEngagement.toFixed(2)}`, unit: "fraction" },
          {
            label: "Cooling pump",
            value: coolingPumpEnabled ? "on" : "off",
            unit: "fore / aft pipes",
            tone: "ok",
          },
          { label: "Gas storage", value: "high / low pressure", unit: "reservoirs" },
        ]}
      />
    </div>
  );
}
