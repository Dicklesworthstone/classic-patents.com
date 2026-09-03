"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepLincolnBuoy } from "@/physics/catalogKernels";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { useGenericWasmSource } from "@/physics/useGenericWasmSource";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { type LincolnBuoyCameraPreset, lincolnBuoyViewForViewport } from "./lincolnBuoyCamera";
import { buildLincolnBuoyModel, updateLincolnBuoyKinematics } from "./lincolnBuoyModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

export function LincolnBuoy3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // Hydrostatic & Vessel Parameters
  const { params, updateParam } = usePatentPhysics("us-6469-lincoln-buoy");
  const bellowsInflationPct =
    (params.inflationPct as number) ?? (params.bellowsInflationPct as number) ?? 80;
  const riverShoalDepthFt =
    (params.shoalDepth as number) ?? (params.riverShoalDepthFt as number) ?? 4.5;
  const steamboatWeightTons =
    (params.weightTons as number) ?? (params.steamboatWeightTons as number) ?? 380;
  const [activeCamera, setActiveCamera] = useState<LincolnBuoyCameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  useGenericWasmSource();
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  const lincoln = stepLincolnBuoy({
    inflationPct: bellowsInflationPct,
    shoalDepth: riverShoalDepthFt,
    weightTons: steamboatWeightTons,
  });

  const baseDraftFt = lincoln.baseDraftFt;

  // Shared transport tape envelope: hydrostatic lift publishes to the
  // patentId-keyed bus so badges and sibling faces read one honest value.
  useFrankenSimPhysics("us-6469-lincoln-buoy", {
    domain: "continuum_elasticity",
    refusal: { isRefused: false },
    continuum: {
      tensileStressMpa: 0,
      tensileStrainPct: 0,
      elasticModulusGpa: 0,
      crossLinkDensityMolesPerCm3: 0,
      stitchFrequencyHz: 0,
      feedVelocityMmPs: 0,
      buoyancyLiftForceKiloNewtons: lincoln.liftKn,
    },
  });
  const effectiveDraftFt = lincoln.hullDraftFt;

  const live = useLiveSimParams({
    bellowsInflationPct,
    riverShoalDepthFt,
    weightTons: steamboatWeightTons,
    baseDraftFt,
    effectiveDraftFt,
    isCutaway,
    isAudioMuted,
    liftKn: lincoln.liftKn,
    shoalClearanceFt: lincoln.shoalClearanceFt,
    paddleDisplayOmegaRadPerS: lincoln.paddleDisplayOmegaRadPerS,
  });

  const applyCameraPreset = (preset: LincolnBuoyCameraPreset) => {
    setActiveCamera(preset);
    const cfg = lincolnBuoyViewForViewport(preset, containerRef.current?.clientWidth ?? 1000);
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

    const iso = lincolnBuoyViewForViewport("iso", container.clientWidth);
    const studio = createThreeStudioScene({
      container,
      cameraPos: iso.pos,
      targetPos: iso.target,
    });
    studioRef.current = studio;

    const { scene, camera, renderer, controls } = studio;

    // Load High-Fidelity Procedural 3D Model
    const model = buildLincolnBuoyModel();
    scene.add(model.rootGroup);

    // Animation Loop
    let reqId: number;

    const clock = createStudioClock();

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const { dt } = clock.pump(now);
      const p = live.current;

      updateLincolnBuoyKinematics(
        model,
        dt,
        p.bellowsInflationPct,
        p.riverShoalDepthFt,
        p.baseDraftFt,
        p.effectiveDraftFt,
        p.paddleDisplayOmegaRadPerS,
        p.isCutaway,
        p.weightTons,
      );

      model.materials.hullWood.color.setHex(p.shoalClearanceFt > 0 ? 0x5c3a21 : 0x991b1b);

      controls.update();
      renderer.render(scene, camera);
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
      const next = lincolnBuoyViewForViewport(activeCamera, container.clientWidth);
      studioRef.current?.controls.setView(next.pos, next.target);
    };
    window.addEventListener("resize", restoreResponsiveView);
    return () => window.removeEventListener("resize", restoreResponsiveView);
  }, [activeCamera]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Abraham Lincoln (US 6,469) — Buoying Vessels (1849) 3D</div>
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

        {/* Top Right Tool Bar */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex gap-1.5 sm:gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Switch to Solid Hull" : "Switch to Hull Cutaway"}
            className={`min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              isCutaway
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            <Layers className="w-4 h-4" />
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
            {showUiOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            aria-label={isAudioMuted ? "Unmute simulation audio" : "Mute simulation audio"}
            type="button"
            onClick={toggleSound}
            className="min-h-9 p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={isAudioMuted ? "Enable Sound" : "Mute Sound"}
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            )}
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
                Lift Force:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {lincoln.liftKn.toFixed(0)} kN
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Effective Draft:</span>
              <span className="font-bold text-cyan-800 dark:text-cyan-400">
                {effectiveDraftFt.toFixed(2)} ft
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Shoal Clearance:</span>
              <span
                className={`font-bold ${lincoln.shoalClearanceFt > 0 ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}`}
              >
                {lincoln.shoalClearanceFt.toFixed(2)} ft
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Bellows State:</span>
              <span className="font-bold text-purple-800 dark:text-purple-400">
                {bellowsInflationPct}% inflated
              </span>
            </div>
          </div>
        )}

        {/* The stern paddlewheel occupies the lower-right of the source-derived
            vessel. Keep the secondary readout in the empty upper river lane so
            it cannot mask that named mechanism at the desktop default view. */}
        <StudioKernelChips
          side="right"
          visible={showUiOverlay}
          placement="top"
          width="compact"
          title="HYDROSTATIC BUOYANCY & SHOAL CLEARANCE"
          chips={[
            {
              label: "Draft",
              value: `${effectiveDraftFt.toFixed(1)}'`,
              unit: `(was ${baseDraftFt.toFixed(1)}')`,
            },
            {
              label: "Buoyant Lift",
              value: `${lincoln.liftKn.toFixed(0)}`,
              unit: "kN",
              tone: "hot",
            },
            {
              label: "Shoal Clearance",
              value: `${lincoln.shoalClearanceFt.toFixed(1)}'`,
              unit: `in ${riverShoalDepthFt.toFixed(1)}' water`,
              tone: lincoln.shoalClearanceFt > 0 ? "ok" : "warn",
            },
            {
              label: "Bellows Volume",
              value: `${lincoln.displacedVolumeCuFt.toFixed(0)}`,
              unit: "ft³",
            },
            { label: "Vessel Weight", value: `${steamboatWeightTons}`, unit: "tons" },
            { label: "Mechanism", value: "India-Rubber Expandable Air Chambers" },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Bellows Inflation</span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {bellowsInflationPct}%
              </span>
            </div>
            <input
              type="range"
              aria-label="Bellows inflation"
              min="0"
              max="100"
              step="1"
              value={bellowsInflationPct}
              onChange={(e) => updateParam("inflationPct", Number.parseInt(e.target.value, 10))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Steamboat Weight</span>
              <span className="text-purple-700 dark:text-purple-400 font-mono font-bold">
                {steamboatWeightTons} T
              </span>
            </div>
            <input
              type="range"
              aria-label="Steamboat weight"
              min="200"
              max="600"
              step="10"
              value={steamboatWeightTons}
              onChange={(e) => updateParam("weightTons", Number.parseInt(e.target.value, 10))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-purple-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Shoal Water Depth</span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {riverShoalDepthFt.toFixed(1)} ft
              </span>
            </div>
            <input
              type="range"
              aria-label="Shoal water depth"
              min="2.0"
              max="12.0"
              step="0.1"
              value={riverShoalDepthFt}
              onChange={(e) => updateParam("shoalDepth", Number.parseFloat(e.target.value))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>
        </div>

        <ClaimConstraintToggle
          patentId="us-6469-lincoln-buoy"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-6469-lincoln-buoy"
          params={params}
          className="mt-3"
        />
      </div>
    </div>
  );
}
