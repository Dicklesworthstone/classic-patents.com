"use client";

import { Activity, Camera, Eye, EyeOff, Layers, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepCorlissEngine } from "@/physics/catalogKernels";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildCorlissEngineModel, updateCorlissEngineKinematics } from "./corlissSteamEngineModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "wrist_plate" | "dashpots" | "flywheel" | "governor" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [12.0, 9.0, 13.0], target: [0, 0, 0] },
  wrist_plate: { pos: [-2.0, 1.8, 4.5], target: [-1.8, 0.4, 0] },
  dashpots: { pos: [-2.2, -0.8, 3.8], target: [-2.0, -1.8, 0] },
  flywheel: { pos: [4.5, 2.5, 6.0], target: [3.8, 0.5, 0] },
  governor: { pos: [-1.0, 3.2, 4.0], target: [-1.0, 1.8, 1.2] },
  top: { pos: [0, 14.0, 0.1], target: [0, 0, 0] },
};

export function CorlissSteamEngine3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);

  // Thermodynamic Simulation Parameters
  const { params } = usePatentPhysics("us-6162-corliss-steam-engine");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const engineRpm = params.engineRpm ?? 65;
  const steamPressurePsi = params.steamPressurePsi ?? 100;
  const cutoffPct = params.cutoffPct ?? 25;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  const corliss = stepCorlissEngine({ steamPressurePsi, engineRpm, cutoffPct });
  const indicatedHp = corliss.indicatedHp;
  const thermalEfficiencyPct = corliss.thermalEfficiencyPct.toFixed(1);

  const live = useLiveSimParams({
    engineRpm,
    steamPressurePsi,
    cutoffPct,
    isAudioMuted,
    isCutaway,
    indicatedHp,
    thermalEfficiencyPct: Number(thermalEfficiencyPct),
    crankOmegaRadPerS: corliss.crankOmegaRadPerS,
    governorOmegaRadPerS: corliss.governorOmegaRadPerS,
    govSpread: corliss.govSpread,
    wristAmp: corliss.wristAmp,
    crankWrapRad: corliss.crankWrapRad,
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

    // Build procedural 3D model
    const model = buildCorlissEngineModel();
    scene.add(model.rootGroup);

    // Animation Loop
    let reqId: number;
    let timeSec = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const dt = 1 / 60;
      timeSec += dt;
      const p = live.current;
      const crankAngle = timeSec * p.crankOmegaRadPerS;

      updateCorlissEngineKinematics(model, crankAngle, p.engineRpm, p.cutoffPct / 100, p.isCutaway);

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      model.dispose();
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
            Corliss Steam Engine 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 6,162 (1849)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["wrist_plate", "Wrist Plate"],
              ["dashpots", "Dashpots"],
              ["flywheel", "Flywheel"],
              ["governor", "Governor"],
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
            title={isCutaway ? "Switch to Solid Engine" : "Switch to Cylinder Cutaway"}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              isCutaway
                ? "bg-amber-600 text-white shadow-sm"
                : "text-parchment-400 hover:text-white hover:bg-parchment-800"
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            title={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            {showUiOverlay ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4 text-amber-400" />
            )}
          </button>
          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <StudioKernelChips
        visible={showUiOverlay}
        title="Corliss dashpot trip"
        chips={[
          { label: "Steam", value: String(steamPressurePsi), unit: "psi" },
          { label: "Cutoff", value: String(cutoffPct), unit: "%" },
          { label: "IHP", value: String(indicatedHp), unit: "hp" },
          { label: "η", value: thermalEfficiencyPct, unit: "%" },
          { label: "P", value: String(corliss.boilerMpa), unit: "MPa" },
          { label: "r_exp", value: String(corliss.expansionRatio) },
          { label: "ω", value: corliss.crankOmegaRadPerS.toFixed(2), unit: "rad/s" },
          {
            label: "Valve crate",
            value: crateSource === "wasm" ? "fs-symmetry" : "ts-cyclic-fallback",
          },
        ]}
      />
    </div>
  );
}
