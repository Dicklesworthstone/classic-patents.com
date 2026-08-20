"use client";

import { Activity, Camera, Eye, EyeOff, Layers, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepWhitneyCottonGin } from "@/physics/catalogKernels";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";
import {
  buildWhitneyCottonGinModel,
  updateWhitneyCottonGinKinematics,
} from "./whitneyCottonGinModel";

type CameraPreset = "iso" | "grate_saws" | "brush_drum" | "hopper" | "crank_drive" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [9.5, 7.5, 11.5], target: [0, 0, 0] },
  grate_saws: { pos: [0, 1.2, 4.8], target: [0, 0.4, 0] },
  brush_drum: { pos: [-3.2, 1.8, 3.8], target: [-1.0, 0, 0] },
  hopper: { pos: [0, 6.2, 2.5], target: [0, 1.5, 0] },
  crank_drive: { pos: [5.5, 0.8, 2.5], target: [3.5, 0, 0] },
  top: { pos: [0, 12.0, 0.1], target: [0, 0, 0] },
};

export function WhitneyCottonGin3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mechanical Simulation Parameters
  const { params } = usePatentPhysics("us-x72-whitney-cotton-gin");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const crankRpm = params.crankRpm ?? 180;
  const gin = stepWhitneyCottonGin({ crankRpm });
  const sawSpeedRpm = gin.sawRpm;
  const brushSpeedRpm = gin.brushRpm;
  const [showFibers, setShowFibers] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  const dailyOutputLbs = gin.outputLbsPerDay.toFixed(1);
  const laborMultiplier = String(gin.laborMultiplier);

  const live = useLiveSimParams({
    crankRpm,
    sawSpeedRpm,
    brushSpeedRpm,
    showFibers,
    isCutaway,
    isAudioMuted,
    outputLbsPerDay: gin.outputLbsPerDay,
    crankOmegaRadPerS: gin.crankOmegaRadPerS,
    sawOmegaRadPerS: gin.sawOmegaRadPerS,
    brushOmegaRadPerS: gin.brushOmegaRadPerS,
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
    const model = buildWhitneyCottonGinModel();
    scene.add(model.rootGroup);

    // Animation Loop
    let reqId: number;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = 1 / 60;
      const p = live.current;

      updateWhitneyCottonGinKinematics(
        model,
        delta,
        p.crankOmegaRadPerS,
        p.sawOmegaRadPerS,
        p.brushOmegaRadPerS,
        p.showFibers,
        p.isCutaway,
        p.crankRpm,
      );

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
      {/* 3D WebGL Canvas Viewport */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls & Camera Presets */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-parchment-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-parchment-100 uppercase tracking-wider">
            Whitney Cotton Gin 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent X72 (1794)
          </span>
        </div>

        {/* Camera Preset Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["grate_saws", "Grate & Saws"],
              ["brush_drum", "Brush Drum"],
              ["hopper", "Hopper Chute"],
              ["crank_drive", "Crank Drive"],
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

        {/* Quick Toggles */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Switch to Solid Frame" : "Switch to Frame Cutaway"}
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
            onClick={() => setShowFibers(!showFibers)}
            title="Toggle Fiber Stream Particles"
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              showFibers
                ? "bg-amber-600/30 text-amber-300 border border-amber-500/40"
                : "text-parchment-400 hover:text-white"
            }`}
          >
            {showFibers ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4 text-amber-400" />
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
        title="Whitney gin"
        chips={[
          { label: "Crank", value: String(Math.round(crankRpm)), unit: "rpm" },
          { label: "Saws", value: String(sawSpeedRpm), unit: "rpm" },
          { label: "v_tip", value: String(gin.sawTipSpeedMps), unit: "m/s" },
          { label: "Brush", value: String(brushSpeedRpm), unit: "rpm" },
          { label: "Lint", value: dailyOutputLbs, unit: "lb/day" },
          { label: "vs hand", value: `${laborMultiplier}×` },
          { label: "ω_crank", value: gin.crankOmegaRadPerS.toFixed(1), unit: "rad/s" },
          {
            label: "Lint crate",
            value: crateSource === "wasm" ? "fs-lbm" : "ts-fluid-fallback",
          },
        ]}
      />
    </div>
  );
}
