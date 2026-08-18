"use client";

import { Activity, Camera, Eye, EyeOff, Layers, Volume2, VolumeX, Waves } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import { stepPeltonWheel } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildPeltonWheelModel, updatePeltonWheelKinematics } from "./peltonWheelModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "split_bucket" | "needle_nozzle" | "runner_wheel" | "tailrace" | "top";

export function PeltonWheel3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // Hydrodynamic Impulse Parameters
  const { params } = usePatentPhysics("us-233692-pelton-water-wheel");
  const headMeters = params.headMeters ?? 450;
  const wheelRpm = params.runnerRpm ?? params.rotorRpm ?? 600;
  const pelton = stepPeltonWheel({ headMeters, runnerRpm: wheelRpm });
  const jetVelocityMps = pelton.jetVelocityMps;
  const hydraulicEfficiencyPct = pelton.etaPct;
  const powerKw = pelton.shaftPowerKw;
  const [showJet, setShowJet] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    headMeters,
    wheelRpm,
    jetVelocityMps,
    showJet,
    isCutaway,
    isAudioMuted,
    etaPct: hydraulicEfficiencyPct,
    shaftPowerKw: powerKw,
    speedRatio: pelton.speedRatio,
    runnerOmegaRadPerS: pelton.runnerOmegaRadPerS,
    jetDisplaySpeed: pelton.jetDisplaySpeed,
    sprayDisplaySpeed: pelton.sprayDisplaySpeed,
    pressureNeedleRad: pelton.pressureNeedleRad,
    needleStudioX: pelton.needleStudioX,
    needleStudioY: pelton.needleStudioY,
    handwheelOmegaRadPerS: pelton.handwheelOmegaRadPerS,
    jetOpacity: pelton.jetOpacity,
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
        camera.position.set(10.5, 7.5, 11.5);
        controls.target.set(0, 0, 0);
        break;
      case "split_bucket":
        camera.position.set(-1.0, 2.5, 3.5);
        controls.target.set(-0.5, 1.8, 0);
        break;
      case "needle_nozzle":
        camera.position.set(-3.5, 0.5, 3.8);
        controls.target.set(-2.2, -0.4, 0);
        break;
      case "runner_wheel":
        camera.position.set(0, 1.0, 4.5);
        controls.target.set(0, 0, 0);
        break;
      case "tailrace":
        camera.position.set(0, -3.2, 5.0);
        controls.target.set(0, -2.0, 0);
        break;
      case "top":
        camera.position.set(0, 12.5, 0.1);
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
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [10.5, 7.5, 11.5],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Build procedural 3D model
    const model = buildPeltonWheelModel();
    scene.add(model.rootGroup);

    // Animation Loop
    let reqId: number;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = 1 / 60;
      const p = live.current;

      const omegaRadPerSec = p.runnerOmegaRadPerS;

      updatePeltonWheelKinematics(
        model,
        delta,
        omegaRadPerSec,
        p.jetDisplaySpeed,
        p.sprayDisplaySpeed,
        p.pressureNeedleRad,
        p.needleStudioX,
        p.needleStudioY,
        p.handwheelOmegaRadPerS,
        p.showJet,
        p.isCutaway,
      );

      // Euler optimum is u/v ≈ 0.5. Off-design color shift
      const ratioErr = Math.abs(p.speedRatio - 0.5);
      const jetMat = model.materials.waterJet;
      jetMat.color.setHex(ratioErr < 0.08 ? 0x38bdf8 : p.speedRatio < 0.5 ? 0x0284c7 : 0xfb7185);
      jetMat.opacity = p.jetOpacity;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      model.dispose();
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
            Pelton Water Wheel 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 233,692 (1880)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["split_bucket", "Split Bucket"],
              ["needle_nozzle", "Needle Nozzle"],
              ["runner_wheel", "Runner Wheel"],
              ["tailrace", "Tailrace"],
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
            title={isCutaway ? "Switch to Solid Casing" : "Switch to Casing Cutaway"}
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
            onClick={() => setShowJet(!showJet)}
            title="Toggle Water Jet Stream"
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              showJet
                ? "bg-amber-600/30 text-amber-300 border border-amber-500/40"
                : "text-parchment-400 hover:text-white"
            }`}
          >
            <Waves className="w-4 h-4 text-cyan-400" />
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
        title="Pelton impulse runner"
        chips={[
          { label: "Head", value: String(headMeters), unit: "m" },
          { label: "v_jet", value: String(jetVelocityMps), unit: "m/s" },
          { label: "u", value: String(pelton.bucketSpeedMps), unit: "m/s" },
          {
            label: "u/v",
            value: pelton.speedRatio.toFixed(3),
            tone: Math.abs(pelton.speedRatio - 0.5) < 0.08 ? "ok" : "warn",
          },
          { label: "η", value: String(hydraulicEfficiencyPct), unit: "%" },
          { label: "Shaft", value: String(powerKw), unit: "kW" },
          { label: "ω", value: pelton.runnerOmegaRadPerS.toFixed(1), unit: "rad/s" },
        ]}
      />
    </div>
  );
}
