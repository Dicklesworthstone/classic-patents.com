"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { readLamarrRuntimeControls, readLamarrTapeFrame } from "@/physics/lamarrSharedKernel";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import {
  buildLamarrFrequencyHoppingModel,
  updateLamarrFrequencyHoppingKinematics,
} from "./lamarrFrequencyHoppingModel";
import { useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "roll" | "waterfall" | "escapement" | "torpedo" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [8, 5.5, 9.5], target: [0, 0, 0] },
  roll: { pos: [-2.5, 1.5, 3.5], target: [-1.5, 0, 0] },
  waterfall: { pos: [0, 2.5, 4.5], target: [0, 0, 0] },
  escapement: { pos: [2.0, 1.0, 3.0], target: [1.5, 0, 0] },
  torpedo: { pos: [4.0, 1.5, 3.5], target: [2.5, 0, 0] },
  top: { pos: [0, 9.0, 0.1], target: [0, 0, 0] },
};

export function lamarrViewForViewport(preset: CameraPreset, viewportWidth: number) {
  const config = CAMERA_PRESETS[preset];
  const multiplier =
    viewportWidth < 480 ? (preset === "iso" ? 1.55 : 1.3) : viewportWidth < 900 ? 1.15 : 1;
  return {
    pos: [
      config.target[0] + (config.pos[0] - config.target[0]) * multiplier,
      config.target[1] + (config.pos[1] - config.target[1]) * multiplier,
      config.target[2] + (config.pos[2] - config.target[2]) * multiplier,
    ] as [number, number, number],
    target: config.target,
  };
}

export function LamarrFrequencyHopping3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);

  // Spread Spectrum State Controls
  const { params, updateParam } = usePatentPhysics("us-2292387-lamarr-frequency-hopping");
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const { frame } = useFrankenSimPhysics("us-2292387-lamarr-frequency-hopping");
  // Pure consumer of the shared transport tape; no local integration clock.
  const recordState = readLamarrTapeFrame(readLamarrRuntimeControls(params));
  const live = useLiveSimParams({ recordState, isCutaway });

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = lamarrViewForViewport(preset, containerRef.current?.clientWidth ?? 1000);
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const handleToggleSound = () => {
    toggleSound(() => {
      soundEngine.playSwitchClick();
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const iso = lamarrViewForViewport("iso", container.clientWidth);
    const studio = createThreeStudioScene({
      container,
      cameraPos: iso.pos,
      targetPos: iso.target,
    });
    studioRef.current = studio;

    const { scene, renderer, controls } = studio;

    const model = buildLamarrFrequencyHoppingModel();
    scene.add(model.root);

    // Animation Loop
    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const state = live.current;

      updateLamarrFrequencyHoppingKinematics(
        model,
        state.recordState.recordPosition,
        state.recordState.receiverEffective,
        state.recordState.warningLampOn,
        state.isCutaway,
      );

      controls.update();
      renderer.render(scene, studio.camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      model.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  useEffect(() => {
    const restoreResponsiveView = () => {
      const container = containerRef.current;
      if (!container) return;
      const config = lamarrViewForViewport(activeCamera, container.clientWidth);
      studioRef.current?.controls.setView(config.pos, config.target);
    };
    window.addEventListener("resize", restoreResponsiveView);
    return () => window.removeEventListener("resize", restoreResponsiveView);
  }, [activeCamera]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Hedy Lamarr & George Antheil Secret Communication System 3D</div>
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
                ["roll", "Record Strip"],
                ["waterfall", "Channel Rows"],
                ["escapement", "Switch Head"],
                ["torpedo", "Torpedo Control"],
                ["top", "Top View"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => applyCameraPreset(id)}
                className={`min-h-9 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-sans whitespace-nowrap shrink-0 transition-colors ${
                  activeCamera === id
                    ? "bg-amber-700 dark:bg-amber-700 text-white font-semibold shadow-xs"
                    : "text-ink-700 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Top Right Tool Bar */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Switch to Solid Torpedo Bay" : "Switch to Torpedo Bay Cutaway"}
            className={`min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
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
            className={`min-h-9 p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
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
            aria-label={isAudioMuted ? "Enable Sound Synthesis" : "Mute Sound"}
            type="button"
            onClick={handleToggleSound}
            className="min-h-9 p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
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
            className={`min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
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
            className="min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
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
                Matched record row:
              </span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {recordState.transmitterRow} (
                {recordState.receiverEffective ? "D–G receiver channel" : "A–C false channel"})
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Lamp 43:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {recordState.warningLampOn ? "ON (false channel)" : "OFF (matched)"}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
        <label className="space-y-2">
          Matched record position
          <input
            type="range"
            min="0"
            max="6"
            value={recordState.recordPosition}
            onChange={(event) => {
              const next = Number(event.target.value);
              updateParam("recordPosition", next);
            }}
            data-audit-primary-control="true"
            data-runtime-tick={frame.tick}
            data-runtime-digest={frame.digest}
            className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-purple-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
          />
          <span>
            Row {recordState.transmitterRow} · transmitter 7 positions · receiver 4 effective
            positions
          </span>
        </label>
        <div className="space-y-2">
          <span>Command labels</span>
          <div className="flex gap-2">
            <span className="rounded border border-cyan-700 px-2 py-1">100-cycle → left step</span>
            <span className="rounded border border-cyan-700 px-2 py-1">500-cycle → right step</span>
          </div>
          <span>
            {recordState.warningLampOn
              ? "Lamp 43 warns: do not send a control impulse."
              : "Lamp 43 off: records select the same channel."}
          </span>
        </div>
      </div>

      <div className="px-4 pb-4 bg-parchment-100/90 dark:bg-ink-900/90">
        <ClaimConstraintToggle
          patentId="us-2292387-lamarr-frequency-hopping"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-2292387-lamarr-frequency-hopping"
          params={params}
          className="mt-3"
        />
      </div>
    </div>
  );
}
