"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX, Wind, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";
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

  const controlsRef = useRef<StudioContext["controls"] | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    switch (preset) {
      case "iso":
        controls.setView([12.5, 8.0, 14.0], [0, 0, 0]);
        break;
      case "turbine_stages":
        controls.setView([0, 2.0, 5.0], [0, 0.5, 0]);
        break;
      case "rotor_blades":
        controls.setView([2.8, 1.8, 3.5], [1.5, 0.4, 0]);
        break;
      case "governor":
        controls.setView([-4.5, 2.2, 3.5], [-3.5, 1.0, 0]);
        break;
      case "bearing_pedestal":
        controls.setView([5.5, 2.5, 3.8], [5.5, -1.0, 0]);
        break;
      case "top":
        controls.setView([0, 14.5, 0.1], [0, 0, 0]);
        break;
    }
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

    const studio = createThreeStudioScene({
      container,
      cameraPos: [12.5, 8.0, 14.0],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

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

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      dispose();
      studio.cleanup();
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
            Parsons Steam Turbine 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 608,969 (1898)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["turbine_stages", "Stages"],
              ["rotor_blades", "Blades"],
              ["governor", "Governor"],
              ["bearing_pedestal", "Bearings"],
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
            title={isCutaway ? "Solid Casing" : "Cutaway Casing"}
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
            onClick={() => setShowSteamFlow(!showSteamFlow)}
            title="Toggle Steam Streamlines"
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              showSteamFlow
                ? "bg-amber-600/30 text-amber-300 border border-amber-500/40"
                : "text-parchment-400 hover:text-white hover:bg-parchment-800/60"
            }`}
          >
            <Wind className="w-4 h-4 text-sky-400" />
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
  );
}
