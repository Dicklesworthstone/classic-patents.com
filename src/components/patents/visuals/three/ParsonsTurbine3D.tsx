"use client";

import { Camera, Eye, EyeOff, RotateCcw, Volume2, VolumeX, Wind, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepParsonsTurbine } from "@/physics/catalogKernels";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildParsonsTurbineModel, updateParsonsTurbineKinematics } from "./parsonsTurbineModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset =
  | "iso"
  | "turbine_stages"
  | "rotor_blades"
  | "governor"
  | "bearing_pedestal"
  | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [12.5, 8.0, 14.0], target: [0, 0, 0] },
  turbine_stages: { pos: [0, 2.0, 5.0], target: [0, 0.5, 0] },
  rotor_blades: { pos: [2.8, 1.8, 3.5], target: [1.5, 0.4, 0] },
  governor: { pos: [-4.5, 2.2, 3.5], target: [-3.5, 1.0, 0] },
  bearing_pedestal: { pos: [5.5, 2.5, 3.8], target: [5.5, -1.0, 0] },
  top: { pos: [0, 14.5, 0.1], target: [0, 0, 0] },
};

export function ParsonsTurbine3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // Steam Turbomachinery Parameters
  const { params } = usePatentPhysics("us-608969-parsons-turbine");
  const turbineRpm = params.rotorRpm ?? 3000;
  const parsons = stepParsonsTurbine({
    rotorRpm: turbineRpm,
    inletPressurePsi: params.inletPressurePsi ?? 180,
  });
  const steamPressureBar = params.steamPressureBar ?? parsons.inletBar;
  const powerKw = parsons.shaftPowerKw;
  const stageCount = parsons.stageCount;
  const [showSteamFlow, setShowSteamFlow] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  const live = useLiveSimParams({
    turbineRpm,
    steamPressureBar,
    showSteamFlow,
    isAudioMuted,
    isCutaway,
    shaftPowerKw: powerKw,
    enthalpyKjKg: parsons.enthalpyKjKg,
    inletMpa: parsons.inletMpa,
    displayOmegaRadPerS: parsons.displayOmegaRadPerS,
    steamAdvancePerS: parsons.steamAdvancePerS,
    steamOpacity: parsons.steamOpacity,
    steamSwirlOmegaRadPerS: parsons.steamSwirlOmegaRadPerS,
    rotorOmegaRadPerS: parsons.rotorOmegaRadPerS,
    bladeSpeedMps: parsons.bladeSpeedMps,
    steamSpeedMps: parsons.steamSpeedMps,
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

    const { rootGroup, nodes, materials, dispose } = buildParsonsTurbineModel();
    scene.add(rootGroup);

    // Animation Loop
    let reqId: number;
    let timeSec = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const dt = 1 / 60;
      timeSec += dt;
      const p = live.current;

      updateParsonsTurbineKinematics(
        nodes,
        materials,
        dt,
        timeSec,
        p.displayOmegaRadPerS ?? 0,
        p.steamAdvancePerS,
        p.steamOpacity,
        p.steamSwirlOmegaRadPerS,
        p.showSteamFlow,
        p.isCutaway,
        p.turbineRpm,
        p.steamPressureBar,
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
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Title HUD */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 pointer-events-none rounded-xl border border-parchment-700/60 bg-parchment-950/80 px-3.5 py-2 backdrop-blur-md shadow-lg">
            <div className="font-mono text-xs font-bold text-parchment-100 uppercase tracking-wider">
              Parsons Steam Turbine 3D
            </div>
            <div className="text-[11px] text-parchment-300 font-sans">
              US Patent 608,969 • Multistage Reaction Steam Turbine
            </div>
          </div>
        )}

        {/* Top Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
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
            {isCutaway ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
            title={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
            aria-label={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
          >
            <Zap className="w-4 h-4" />
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

        {/* Camera Views Bar */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-1.5rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3.5 h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["turbine_stages", "Stages"],
                ["rotor_blades", "Blades"],
                ["governor", "Governor"],
                ["bearing_pedestal", "Bearings"],
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
          title="Parsons reaction stages"
          chips={[
            { label: "Rotor", value: String(Math.round(turbineRpm)), unit: "rpm" },
            { label: "Inlet", value: parsons.inletMpa.toFixed(2), unit: "MPa" },
            { label: "h", value: String(parsons.enthalpyKjKg), unit: "kJ/kg" },
            { label: "Shaft", value: String(powerKw), unit: "kW" },
            { label: "Stages", value: String(stageCount) },
            { label: "u/c", value: String(parsons.steamBladeSpeedRatio) },
            { label: "u", value: String(parsons.bladeSpeedMps), unit: "m/s" },
            { label: "ω×0.08", value: parsons.displayOmegaRadPerS.toFixed(1), unit: "rad/s" },
            {
              label: "Steam crate",
              value: crateSource === "wasm" ? "fs-lbm" : "ts-fluid-fallback",
            },
          ]}
        />
      </div>
    </div>
  );
}
