"use client";

import { Activity, Camera, Eye, EyeOff, Layers, Volume2, VolumeX, Waves } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepEricssonPropeller } from "@/physics/catalogKernels";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import {
  buildEricssonPropellerModel,
  updateEricssonPropellerKinematics,
} from "./ericssonPropellerModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "propeller_drum" | "helical_blades" | "sternpost" | "rudder" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [9.0, 6.0, 10.5], target: [0, 0, 0] },
  propeller_drum: { pos: [0, 0.5, 4.2], target: [0, 0, 0] },
  helical_blades: { pos: [2.5, 1.8, 3.0], target: [0.5, 0, 0] },
  sternpost: { pos: [-3.2, 1.2, 3.5], target: [-1.5, 0, 0] },
  rudder: { pos: [4.2, 0.8, 2.5], target: [2.8, 0, 0] },
  top: { pos: [0, 11.0, 0.1], target: [0, 0, 0] },
};

export function EricssonPropeller3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const [showWake, setShowWake] = useState<boolean>(true);

  // Hydrodynamic & Marine Propulsion Parameters
  const { params } = usePatentPhysics("us-588-ericsson-propeller");
  const shaftRpm = params.shaftRpm ?? 120;
  const bladeCount = params.bladeCount ?? 8;
  const pitchAngleDeg = params.pitchAngleDeg ?? 35;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  const ericson = stepEricssonPropeller({
    shaftRpm,
    bladePitchAngleDeg: pitchAngleDeg,
  });

  const live = useLiveSimParams({
    shipSpeedKnots: ericson.shipSpeedKnots,
    shaftRpm,
    bladeCount,
    pitchAngleDeg,
    isAudioMuted,
    isCutaway,
    showWake,
    thrustKn: ericson.thrustKn,
    efficiencyPct: ericson.propulsiveEfficiencyPct,
    slipRatio: ericson.slipFraction,
    shaftOmegaRadPerS: ericson.shaftOmegaRadPerS,
    wakeSwirlCoeff: ericson.wakeSwirlCoeff,
    wakeOpacity: ericson.wakeOpacity,
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

    // Build authentic procedural model
    const model = buildEricssonPropellerModel();
    scene.add(model.rootGroup);

    // Animation Loop
    let reqId: number;

    let previousFrameTime: number | undefined;
    const animate = (frameTime: number) => {
      reqId = requestAnimationFrame(animate);
      const delta = Math.min(
        0.1,
        Math.max(0, (frameTime - (previousFrameTime ?? frameTime)) / 1000),
      );
      previousFrameTime = frameTime;
      const p = live.current;

      updateEricssonPropellerKinematics(
        model,
        delta,
        p.shaftOmegaRadPerS,
        p.wakeOpacity,
        p.shipSpeedKnots,
        p.wakeSwirlCoeff,
        p.showWake,
        p.isCutaway,
      );

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

  return (
    <div className="relative w-full h-[620px] bg-parchment-900 rounded-2xl overflow-hidden border border-parchment-700 shadow-2xl flex flex-col">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-parchment-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-parchment-100 uppercase tracking-wider">
            Ericsson Spiral-Plate Reader Aid 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 588 (1838)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["propeller_drum", "Propeller Drum"],
              ["helical_blades", "Helical Blades"],
              ["sternpost", "Sternpost"],
              ["rudder", "Rudder"],
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
            title={isCutaway ? "Switch to Solid Hull" : "Switch to Hull Cutaway"}
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
            onClick={() => setShowWake(!showWake)}
            title={showWake ? "Hide Wake Streamlines" : "Show Wake Streamlines"}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              showWake
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "text-parchment-400 hover:text-white hover:bg-parchment-800"
            }`}
          >
            <Waves className="w-4 h-4" />
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
            title={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            {showUiOverlay ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4 text-amber-400" />
            )}
          </button>
        </div>
      </div>

      <StudioKernelChips
        visible={showUiOverlay}
        title="Source-bounded reader aid"
        chips={[
          { label: "Source hoops", value: "2", unit: "broad hoops" },
          {
            label: "Source spiral",
            value: "3",
            unit: "diameters / turn",
          },
          { label: "Source shafts", value: "b opposite a", unit: "b slower" },
          { label: "Source casing", value: "about 1/8", unit: "inch clearance" },
          { label: "Display motion", value: String(Math.round(shaftRpm)), unit: "model rpm" },
          {
            label: "Wake crate",
            value: crateSource === "wasm" ? "fs-lbm" : "ts-fluid-fallback",
          },
        ]}
      />
    </div>
  );
}
