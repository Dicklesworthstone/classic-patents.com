"use client";

import { Camera, Eye, EyeOff, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { type RenoCameraPreset, renoCameraForViewport } from "./renoEscalatorCamera";
import {
  buildRenoEscalatorModel,
  type RenoEscalatorModelResult,
  updateRenoEscalatorIncline,
  updateRenoEscalatorKinematics,
} from "./renoEscalatorModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

const RENO_SOURCE_SPEED_FPM = 200;
const RENO_SOURCE_SPEED_MPS = 1.016;
const RENO_SOURCE_MAX_SINGLE_FILE_PER_HOUR = 6000;
const RENO_SOURCE_COMB_CLEARANCE_MM = 3.175;

export function RenoEscalator3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [cutawayMode, setCutawayMode] = useState<boolean>(true);

  // Transit Dynamics Parameters
  const { params, updateParam } = usePatentPhysics("us-470918-reno-escalator");
  const beltSpeedMps = (params.beltSpeed as number) ?? RENO_SOURCE_SPEED_MPS;
  const inclineAngleDeg = (params.inclineAngle as number) ?? 25;
  const deckSpeedFpm = Math.round((beltSpeedMps * 60) / 0.3048);
  const [activeCamera, setActiveCamera] = useState<RenoCameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const live = useLiveSimParams({
    beltSpeedMps,
    inclineAngleDeg,
    cutawayMode,
    isAudioMuted,
  });

  // This publishes a TS-host transport snapshot for cross-face state only.
  // No Reno-specific WASM module steps this visualization.
  useFrankenSimPhysics("us-470918-reno-escalator", {
    domain: "solid_mechanics",
    refusal: { isRefused: false },
    machine: {
      poseXMeters: 0,
      poseYMeters: 0,
      headingRad: 0,
      modeLabel: "inclined belt running",
      wheelSpeedMps: beltSpeedMps,
    },
  });

  const studioRef = useRef<StudioContext | null>(null);

  const cameraViewForContainer = (preset: RenoCameraPreset) => {
    const container = containerRef.current;
    return renoCameraForViewport(preset, container?.clientWidth ?? 0, container?.clientHeight ?? 0);
  };

  const applyCameraPreset = (preset: RenoCameraPreset) => {
    setActiveCamera(preset);
    const cfg = cameraViewForContainer(preset);
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const toggleSound = () => {
    toggleEngine(() => {
      soundEngine.playSwitchClick();
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const iso = renoCameraForViewport("iso", container.clientWidth, container.clientHeight);
    const studio = createThreeStudioScene({
      container,
      cameraPos: iso.pos,
      targetPos: iso.target,
    });
    studioRef.current = studio;

    const { scene, camera, renderer, controls } = studio;

    // The model persists for the studio lifetime. Incline changes mutate its
    // one shared layout, so the canvas, camera, and belt phase never flash.
    const escalatorModel: RenoEscalatorModelResult = buildRenoEscalatorModel();
    scene.add(escalatorModel.root);

    let reqId: number;
    let beltTravelM = 0;
    let lastInclineAngleDeg = Number.NaN;
    const clock = createStudioClock();

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const { dt } = clock.pump(now);
      const p = live.current;
      beltTravelM += Math.max(0, p.beltSpeedMps) * dt;

      if (p.inclineAngleDeg !== lastInclineAngleDeg) {
        updateRenoEscalatorIncline(escalatorModel.nodes, p.inclineAngleDeg);
        lastInclineAngleDeg = p.inclineAngleDeg;
      }

      updateRenoEscalatorKinematics(
        escalatorModel.nodes,
        escalatorModel.materials,
        beltTravelM,
        p.cutawayMode,
      );

      controls.update();
      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      escalatorModel.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  useEffect(() => {
    if (activeCamera !== "iso") return;
    const reselectResponsiveOverview = () => {
      const container = containerRef.current;
      if (!container) return;
      const view = renoCameraForViewport("iso", container.clientWidth, container.clientHeight);
      studioRef.current?.controls.setView(view.pos, view.target);
    };
    window.addEventListener("resize", reselectResponsiveOverview);
    window.addEventListener("orientationchange", reselectResponsiveOverview);
    return () => {
      window.removeEventListener("resize", reselectResponsiveOverview);
      window.removeEventListener("orientationchange", reselectResponsiveOverview);
    };
  }, [activeCamera]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Reno Inclined Elevator &amp; Comb 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-9.5rem)] sm:max-w-[calc(100%-28rem)] gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3.5 h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Overview"],
                ["comb_plates", "Comb Teeth"],
                ["cleated_deck", "Cleated Deck"],
                ["handrail", "Handrail"],
                ["top_drive", "Top Drive Wheel"],
                ["top", "Top"],
              ] as [RenoCameraPreset, string][]
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyCameraPreset(preset)}
                className={`min-h-9 px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
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
            onClick={() => setCutawayMode(!cutawayMode)}
            title={cutawayMode ? "Switch to Solid Panels" : "Switch to Glass Balustrade"}
            className={`min-h-9 p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm text-xs font-sans flex items-center gap-1 ${
              cutawayMode
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            {cutawayMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden sm:inline">{cutawayMode ? "Cutaway" : "Solid"}</span>
          </button>

          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="min-h-9 p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`min-h-9 p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showUiOverlay
                ? "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
                : "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
            }`}
            title={showUiOverlay ? "Hide Overlay UI (Clean 3D View)" : "Show Overlay UI"}
            aria-label={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
          >
            {showUiOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
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
                Belt Speed:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {deckSpeedFpm} FPM ({beltSpeedMps.toFixed(3)} m/s)
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Patent Maximum:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {RENO_SOURCE_MAX_SINGLE_FILE_PER_HOUR.toLocaleString()} pass/h, single file
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Truss Incline:</span>
              <span className="font-bold text-cyan-800 dark:text-cyan-400">{inclineAngleDeg}°</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Comb Clearance:</span>
              <span className="font-bold text-purple-800 dark:text-purple-400">
                ≤ 1/8 in ({RENO_SOURCE_COMB_CLEARANCE_MM} mm)
              </span>
            </div>
          </div>
        )}

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="Reno Endless Conveyor Dynamics"
          chips={[
            { label: "Belt Speed", value: `${deckSpeedFpm} FPM` },
            { label: "Source Speed", value: `${RENO_SOURCE_SPEED_FPM} FPM (1.016 m/s)` },
            {
              label: "Source Maximum",
              value: `${RENO_SOURCE_MAX_SINGLE_FILE_PER_HOUR.toLocaleString()}/h single file`,
            },
            { label: "Incline", value: `${inclineAngleDeg}°` },
            { label: "Comb Clearance", value: "≤ 1/8 in (3.175 mm)" },
            { label: "Power Location", value: "Top wheels; bottom permitted" },
            { label: "Drive constraint", value: "v = ωR" },
            { label: "Kernel", value: "TS host kinematics" },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Belt Speed (source reference 200 FPM)
              </span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {beltSpeedMps.toFixed(3)} m/s
              </span>
            </div>
            <input
              type="range"
              aria-label="Belt speed"
              min="0.400"
              max="1.200"
              step="0.001"
              value={beltSpeedMps}
              onChange={(e) => updateParam("beltSpeed", Number.parseFloat(e.target.value))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Truss Incline (source preference ≈25°)
              </span>
              <span className="text-purple-700 dark:text-purple-400 font-mono font-bold">
                {inclineAngleDeg}°
              </span>
            </div>
            <input
              type="range"
              aria-label="Truss incline"
              min="20"
              max="35"
              step="1"
              value={inclineAngleDeg}
              onChange={(e) => updateParam("inclineAngle", Number.parseInt(e.target.value, 10))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-purple-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>
        </div>

        <ClaimConstraintToggle
          patentId="us-470918-reno-escalator"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-470918-reno-escalator"
          params={params}
          className="mt-3"
        />
      </div>
    </div>
  );
}
