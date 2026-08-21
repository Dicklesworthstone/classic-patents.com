"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepZeppelinAirship } from "@/physics/catalogKernels";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { createStudioClock } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";
import { buildZeppelinAirshipModel, updateZeppelinAirshipKinematics } from "./zeppelinAirshipModel";

type CameraPreset =
  | "iso"
  | "girders_frame"
  | "engine_gondola"
  | "gas_cells"
  | "control_fins"
  | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [16.0, 9.0, 18.0], target: [0, 0, 0] },
  girders_frame: { pos: [0, 2.0, 6.5], target: [0, 0, 0] },
  engine_gondola: { pos: [-4.5, -2.5, 4.0], target: [-3.5, -2.2, 0] },
  gas_cells: { pos: [3.5, 2.5, 5.0], target: [2.0, 0, 0] },
  control_fins: { pos: [-8.5, 1.5, 3.5], target: [-6.5, 0, 0] },
  top: { pos: [0, 22.0, 0.1], target: [0, 0, 0] },
};

export function ZeppelinAirship3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  // Aerostatic & Aerodynamic Parameters
  const { params, updateParam } = usePatentPhysics("us-621195-zeppelin-airship");
  const gasInflation = (params.gasInflation as number) ?? 95;
  const flightSpeedKnots =
    (params.flightSpeedKnots as number) ?? (params.airspeedMph as number) ?? 28;
  const trimWeightPosM = (params.trimWeight as number) ?? 5;
  const flightAlt = (params.flightAlt as number) ?? 300;

  const zep = stepZeppelinAirship({
    gasInflation,
    flightAlt,
    flightSpeedKnots: Number(flightSpeedKnots),
    trimWeight: trimWeightPosM,
  });
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  const live = useLiveSimParams({
    airspeedKmh: zep.flightSpeedKmh,
    engineRpm: zep.propellerRpm,
    isCutaway,
    isAudioMuted,
    trimWeightPosM,
    gasInflation,
    flightSpeedKnots: Number(flightSpeedKnots),
    netLiftKn: zep.netLiftKn,
    hullStudioY: zep.hullStudioY,
    pitchTrimDeg: zep.pitchTrimDeg,
    parasiteDragKn: zep.parasiteDragKn,
    propellerOmegaRadPerS: zep.propellerDisplayOmegaRadPerS,
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
    void ensureGenericWasm().then((next) => setCrateSource(next));
  }, []);

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

    const { scene, camera, renderer, controls } = studio;

    // Build procedural 3D model
    const { rootGroup, nodes, materials, dispose } = buildZeppelinAirshipModel();
    scene.add(rootGroup);

    // Animation Loop
    let reqId: number;
    const clock = createStudioClock();

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      const { dt, simTimeSec: timeSec } = clock.pump(now);
      const p = live.current;

      updateZeppelinAirshipKinematics(
        nodes,
        materials,
        dt,
        timeSec,
        p.hullStudioY,
        p.pitchTrimDeg,
        p.propellerOmegaRadPerS,
        p.trimWeightPosM,
        p.isCutaway,
        p.gasInflation,
        p.flightSpeedKnots,
      );

      controls.update();
      renderer.render(scene, camera);
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
      <div className="sr-only">Zeppelin LZ-1 Airship 3D</div>
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
                ["girders_frame", "Lattice Girders"],
                ["engine_gondola", "Gondolas"],
                ["gas_cells", "Gas Cells"],
                ["control_fins", "Tail Fins"],
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
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Solid Envelope" : "Cutaway Hydrogen Cells"}
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
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
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
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                Gross Buoyancy:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {zep.grossBuoyancyKn} kN
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Net Lift:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {zep.netLiftKn} kN
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Cruising Speed:</span>
              <span className="font-bold text-cyan-800 dark:text-cyan-400">
                {zep.flightSpeedKmh.toFixed(1)} km/h
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Pitch Trim:</span>
              <span className="font-bold text-purple-800 dark:text-purple-400">
                {zep.pitchTrimDeg}°
              </span>
            </div>
          </div>
        )}

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="Zeppelin rigid aerostat"
          chips={[
            { label: "Gross", value: String(zep.grossBuoyancyKn), unit: "kN" },
            { label: "Net", value: String(zep.netLiftKn), unit: "kN" },
            { label: "Speed", value: zep.flightSpeedKmh.toFixed(1), unit: "km/h" },
            { label: "RPM", value: String(zep.propellerRpm), unit: "rpm" },
            { label: "Pitch", value: String(zep.pitchTrimDeg), unit: "°" },
            { label: "Drag", value: String(zep.parasiteDragKn), unit: "kN" },
            { label: "Volume", value: String(Math.round(zep.hydrogenVolumeM3)), unit: "m³" },
            {
              label: "Lift crate",
              value: crateSource === "wasm" ? "fs-sparse" : "ts-heat-fallback",
            },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Hydrogen Cell Inflation
              </span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {gasInflation}%
              </span>
            </div>
            <input
              type="range"
              min="75"
              max="100"
              step="1"
              value={gasInflation}
              onChange={(e) => updateParam("gasInflation", Number.parseInt(e.target.value, 10))}
              className="w-full accent-amber-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Keel Sliding Ballast
              </span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {trimWeightPosM} m
              </span>
            </div>
            <input
              type="range"
              min="-15"
              max="15"
              step="1"
              value={trimWeightPosM}
              onChange={(e) => updateParam("trimWeight", Number.parseInt(e.target.value, 10))}
              className="w-full accent-cyan-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Cruising Airspeed</span>
              <span className="text-purple-700 dark:text-purple-400 font-mono font-bold">
                {flightSpeedKnots} knots
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="45"
              step="1"
              value={flightSpeedKnots}
              onChange={(e) => updateParam("flightSpeedKnots", Number.parseInt(e.target.value, 10))}
              className="w-full accent-purple-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>

        <ClaimConstraintToggle
          patentId="us-621195-zeppelin-airship"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-621195-zeppelin-airship"
          params={params}
          className="mt-3"
        />
      </div>
    </div>
  );
}
