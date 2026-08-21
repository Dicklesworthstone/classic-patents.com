"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX, Wind } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { type ParsonsRoutingMode, stepParsonsMarine } from "@/physics/parsonsMarineKernel";
import { createStudioClock } from "@/physics/tickScheduler";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { buildParsonsTurbineModel, updateParsonsTurbineKinematics } from "./parsonsTurbineModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset =
  | "iso"
  | "figure_1_banks"
  | "figure_2_reverse"
  | "figure_3_network"
  | "shaft_network"
  | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [12.5, 8.0, 14.0], target: [0, 0, 0] },
  figure_1_banks: { pos: [0, 2.0, 5.0], target: [0, 0.5, 0] },
  figure_2_reverse: { pos: [2.8, 1.8, 3.5], target: [1.5, 0.4, 0] },
  figure_3_network: { pos: [-4.5, 2.2, 3.5], target: [-3.5, 1.0, 0] },
  shaft_network: { pos: [5.5, 2.5, 3.8], target: [5.5, -1.0, 0] },
  top: { pos: [0, 14.5, 0.1], target: [0, 0, 0] },
};

export const ParsonsTurbine3D = memo(function ParsonsTurbine3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
  });
  const [routing, setRouting] = useState<ParsonsRoutingMode>("series");
  const [reversing, setReversing] = useState(false);
  const marine = stepParsonsMarine({ routing, reversing });
  const [showSteamFlow, setShowSteamFlow] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const live = useLiveSimParams({
    routing,
    reversing,
    showSteamFlow,
    isAudioMuted,
    isCutaway,
    displayOmegaRadPerS: 0.3,
    steamAdvancePerS: 1.2,
    steamOpacity: 0.72,
    steamSwirlOmegaRadPerS: 0.2,
  });

  const studioRef = useRef<StudioContext | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = CAMERA_PRESETS[preset];
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

    const iso = CAMERA_PRESETS.iso;
    const studio = createThreeStudioScene({
      container,
      cameraPos: iso.pos,
      targetPos: iso.target,
    });
    studioRef.current = studio;

    const { scene, renderer, controls } = studio;

    // Build procedural 3D model
    const { rootGroup, nodes, materials, dispose } = buildParsonsTurbineModel();
    scene.add(rootGroup);

    let reqId: number;
    let timeSec = 0;
    const clock = createStudioClock();

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      const { dt } = clock.pump(now);
      timeSec += dt;
      const p = live.current;

      updateParsonsTurbineKinematics(
        nodes,
        materials,
        dt,
        timeSec,
        p.displayOmegaRadPerS,
        p.steamAdvancePerS,
        p.steamOpacity,
        p.steamSwirlOmegaRadPerS,
        p.showSteamFlow,
        p.isCutaway,
        p.routing,
        p.reversing,
      );

      controls.update();
      renderer.render(scene, studio.camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Parsons Steam Turbine 3D</div>
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
                ["iso", "Isometric"],
                ["figure_1_banks", "Fig. 1 banks"],
                ["figure_2_reverse", "Fig. 2 reverse"],
                ["figure_3_network", "Fig. 3 network"],
                ["shaft_network", "Shafts"],
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

        {/* Top-Right Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 max-w-[90%] pointer-events-auto">
          <ClaimConstraintToggle
            patentId="us-608969-parsons-turbine"
            claimStates={claimStates}
            onToggleClaim={(claimNo, active) => {
              setClaimStates((prev) => ({ ...prev, [claimNo]: active }));
              if (claimNo === 1) setRouting(active ? "series" : "simple-parallel");
              if (claimNo === 2 || claimNo === 3) setReversing(active);
            }}
          />
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Solid Casing" : "Cutaway Casing"}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm text-xs font-sans flex items-center gap-1 ${
              isCutaway
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">{isCutaway ? "Cutaway" : "Solid"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSteamFlow(!showSteamFlow)}
            title="Toggle Steam Streamlines"
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showSteamFlow
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            <Wind className="w-4 h-4 text-sky-500" />
          </button>

          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            aria-label={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
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
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">Route:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {marine.routing}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Turbine banks:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {marine.activeTurbines.join(" ")}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Direction:</span>
              <span className="text-cyan-800 dark:text-cyan-400 font-bold">
                {marine.directionLabel}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="text-xs font-sans text-ink-700 dark:text-parchment-300">
            <span className="mb-1 block font-semibold">Valve connection</span>
            <select
              value={routing}
              onChange={(event) => setRouting(event.target.value as ParsonsRoutingMode)}
              className="w-full rounded-lg border border-parchment-300 dark:border-ink-700 bg-parchment-50 dark:bg-ink-900 px-2 py-2"
            >
              <option value="series">Series (Fig. 1)</option>
              <option value="compound-parallel">Compound parallel (Fig. 1)</option>
              <option value="simple-parallel">Simple parallel (Fig. 1 / 3)</option>
            </select>
          </label>
          <label className="text-xs font-sans text-ink-700 dark:text-parchment-300 flex items-end gap-2 pb-2">
            <input
              type="checkbox"
              checked={reversing}
              onChange={(event) => setReversing(event.target.checked)}
            />
            Figure 2 X / Y reversing turbines (astern)
          </label>
        </div>
      </div>

      <StudioKernelChips
        visible={showUiOverlay}
        side="right"
        title="Parsons marine routing"
        chips={[
          { label: "Topology", value: marine.routing },
          { label: "Banks", value: String(marine.activeTurbines.length) },
          { label: "Shafts", value: String(marine.activeShafts) },
          { label: "Direction", value: marine.directionLabel },
          { label: "Flow edges", value: String(marine.routeEdges.length) },
          { label: "Control", value: "valves + pipes" },
        ]}
      />
    </div>
  );
});
