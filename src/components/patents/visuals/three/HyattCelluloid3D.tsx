"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX, Zap } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { stepHyattCelluloid } from "@/physics/catalogKernels";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildHyattCelluloidModel, updateHyattCelluloidKinematics } from "./hyattCelluloidModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset =
  | "iso"
  | "hydraulic_ram"
  | "steam_jacket"
  | "nozzle_die"
  | "billiard_balls"
  | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [10.5, 7.5, 12.0], target: [0, 0, 0] },
  hydraulic_ram: { pos: [-3.5, 2.0, 4.5], target: [-2.0, 0, 0] },
  steam_jacket: { pos: [0, 1.2, 4.2], target: [0, 0, 0] },
  nozzle_die: { pos: [3.8, 1.5, 3.5], target: [2.5, -0.4, 0] },
  billiard_balls: { pos: [4.8, -0.5, 2.5], target: [4.2, -1.6, 0] },
  top: { pos: [0, 12.5, 0.1], target: [0, 0, 0] },
};

export const HyattCelluloid3D = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // Polymer Extrusion & Thermal Parameters
  const { params } = usePatentPhysics("us-105338-hyatt-celluloid");
  const steamTempC = params.steamTempC ?? 135;
  const hydraulicPressureMpa = (params.ramPressurePsi ?? 1200) * 0.00689476;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  const hyatt = stepHyattCelluloid({
    steamTempC,
    hydraulicPressureMpa,
  });

  const live = useLiveSimParams({
    steamTempC,
    hydraulicPressureMpa,
    isAudioMuted,
    isCutaway,
    viscosityPaS: hyatt.viscosityPaS,
    ramHz: hyatt.ramHz,
    ramStrokeStudio: hyatt.ramStrokeStudio,
    isMelted: hyatt.isMelted,
  });

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

    const { rootGroup, nodes, materials, dispose } = buildHyattCelluloidModel();
    scene.add(rootGroup);

    // Animation Loop
    let reqId: number;
    let timeSec = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const dt = 1 / 60;
      timeSec += dt;
      const p = live.current;

      updateHyattCelluloidKinematics(
        nodes,
        materials,
        dt,
        timeSec,
        p.steamTempC,
        p.viscosityPaS,
        p.isMelted ?? true,
        p.ramHz,
        p.ramStrokeStudio,
        p.isCutaway ?? false,
      );

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="relative w-full h-[620px] bg-parchment-900 rounded-2xl overflow-hidden border border-parchment-700 shadow-2xl flex flex-col">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-parchment-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-parchment-100 uppercase tracking-wider">
            Hyatt Celluloid Press 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 105,338 (1870)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["hydraulic_ram", "Hydraulic Ram"],
              ["steam_jacket", "Steam Jacket"],
              ["nozzle_die", "Extrusion Die"],
              ["billiard_balls", "Billiard Balls"],
              ["top", "Top"],
            ] as [CameraPreset, string][]
          ).map(([preset, label]) => (
            <button
              key={preset}
              type="button"
              onClick={() => applyCameraPreset(preset)}
              className={`px-2.5 py-1 text-xs font-sans rounded-lg transition-colors ${
                activeCamera === preset
                  ? "bg-amber-600 text-white font-semibold shadow-sm"
                  : "text-parchment-300 hover:text-white hover:bg-parchment-800/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Solid Machine" : "Cutaway Jacket"}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-sans rounded-lg transition-colors ${
              isCutaway
                ? "bg-amber-600/30 text-amber-200 border border-amber-500/40"
                : "text-parchment-300 hover:text-white hover:bg-parchment-800/60"
            }`}
          >
            {isCutaway ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isCutaway ? "Cutaway" : "Solid"}</span>
          </button>

          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            <Zap className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      <StudioKernelChips
        visible={showUiOverlay}
        title="Hyatt hydraulic polymer press kinematics"
        chips={[
          {
            label: "Steam Temp",
            value: `${steamTempC}`,
            unit: "°C",
            tone: hyatt.isMelted ? "ok" : "warn",
          },
          { label: "Hydraulic Ram", value: hydraulicPressureMpa.toFixed(0), unit: "MPa" },
          { label: "Melt Viscosity", value: `${hyatt.viscosityPaS}`, unit: "Pa·s" },
          {
            label: "Consolidation ρ",
            value: hyatt.consolidationDensityGPerCm3.toFixed(2),
            unit: "g/cm³",
          },
          { label: "Transparency", value: `${hyatt.transparencyPct}`, unit: "%" },
          {
            label: "Extrusion Rate",
            value: hyatt.isMelted ? hyatt.extrusionRateCmPerMin.toFixed(1) : "0.0",
            unit: "cm/min",
            tone: hyatt.isMelted ? "ok" : "warn",
          },
          { label: "Ram Stroke Freq", value: hyatt.ramHz.toFixed(2), unit: "Hz" },
          {
            label: "Melt crate",
            value: crateSource === "wasm" ? "fs-lbm" : "ts-fluid-fallback",
          },
        ]}
      />
    </div>
  );
});
