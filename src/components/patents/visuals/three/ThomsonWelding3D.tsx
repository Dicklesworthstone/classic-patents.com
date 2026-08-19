"use client";

import { Activity, Camera, Eye, EyeOff, Flame, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import { stepThomsonWelding } from "@/physics/catalogKernels";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { buildThomsonWeldingModel, updateThomsonWeldingKinematics } from "./thomsonWeldingModel";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset =
  | "iso"
  | "weld_junction"
  | "transformer_core"
  | "copper_clamps"
  | "compression_screw"
  | "top";

export function ThomsonWelding3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // Electrical Resistance Welding Parameters
  const { params } = usePatentPhysics("us-347140-thomson-welding");
  const weldCurrentAmps = params.weldCurrentAmps ?? params.currentAmperes ?? 4500;
  const clampPressureMpa = params.clampPressureMpa ?? 35;
  const weld = stepThomsonWelding({
    weldCurrentAmps,
    clampPressureMpa,
  });
  const weldTempCelsius = weld.interfaceTempC;
  const weldPowerKw = weld.jouleKw.toFixed(1);
  const [showSparks, setShowSparks] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  const live = useLiveSimParams({
    weldCurrentAmps,
    weldTempCelsius,
    jouleKw: weld.jouleKw,
    isForged: weld.isForged ? 1 : 0,
    upsetBurrWidthMm: weld.upsetBurrWidthMm,
    weldGlowIntensity: weld.weldGlowIntensity,
    weldSeamScale: weld.weldSeamScale,
    jawStudioOffset: weld.jawStudioOffset,
    showSparks,
    isAudioMuted,
    isCutaway,
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
        camera.position.set(9.5, 7.0, 11.0);
        controls.target.set(0, 0, 0);
        break;
      case "weld_junction":
        camera.position.set(0, 1.2, 3.2);
        controls.target.set(0, 0.4, 0);
        break;
      case "transformer_core":
        camera.position.set(0, -1.0, 4.0);
        controls.target.set(0, -1.2, 0);
        break;
      case "copper_clamps":
        camera.position.set(2.4, 1.5, 3.0);
        controls.target.set(0.8, 0.4, 0);
        break;
      case "compression_screw":
        camera.position.set(3.8, 1.0, 2.2);
        controls.target.set(2.4, 0.4, 0);
        break;
      case "top":
        camera.position.set(0, 12.0, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
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
      cameraPos: [9.5, 7.0, 11.0],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    const { rootGroup, nodes, materials, dispose } = buildThomsonWeldingModel();
    scene.add(rootGroup);

    // Animation Loop
    let reqId: number;
    let timeSec = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const dt = 1 / 60;
      timeSec += dt;
      const p = live.current;

      // Update cutaway transparency on cast-iron transformer body
      materials.castIron.opacity = p.isCutaway ? 0.35 : 1.0;
      materials.castIron.transparent = p.isCutaway;

      updateThomsonWeldingKinematics(
        nodes,
        materials,
        dt,
        timeSec,
        p.weldTempCelsius,
        p.weldGlowIntensity,
        p.weldSeamScale,
        p.jawStudioOffset,
        p.isForged > 0.5,
        p.showSparks,
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
            Thomson Butt-Welder 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 347,140 (1886)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["weld_junction", "Weld Seam"],
              ["transformer_core", "Transformer"],
              ["copper_clamps", "Clamping Jaws"],
              ["compression_screw", "Screw"],
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
            title={isCutaway ? "Solid Mode" : "Cutaway Machine Bed"}
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
            onClick={() => setShowSparks(!showSparks)}
            title={showSparks ? "Hide Sparks" : "Show Sparks"}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-sans rounded-lg transition-colors ${
              showSparks
                ? "bg-amber-600/30 text-amber-200 border border-amber-500/40"
                : "text-parchment-300 hover:text-white hover:bg-parchment-800/60"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Sparks</span>
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
        title="Thomson resistance butt-welder"
        chips={[
          { label: "Current", value: String(Math.round(weldCurrentAmps)), unit: "A" },
          { label: "Power", value: weldPowerKw, unit: "kW" },
          {
            label: "Interface",
            value: String(weldTempCelsius),
            unit: "°C",
            tone: weld.isForged ? "hot" : "ok",
          },
          { label: "Pressure", value: String(clampPressureMpa), unit: "MPa" },
          { label: "State", value: weld.isForged ? "forged" : "heating" },
          { label: "Burr", value: String(weld.upsetBurrWidthMm), unit: "mm" },
          { label: "Pulse", value: String(weld.weldPulseMs), unit: "ms" },
          {
            label: "HAZ crate",
            value: crateSource === "wasm" ? "fs-sparse" : "ts-heat-fallback",
          },
        ]}
      />
    </div>
  );
}
