"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FrankenSimEngine } from "@/physics/engine";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import {
  buildMaximMachineGunModel,
  type MaximMachineGunModel,
  updateMaximMachineGunKinematics,
} from "./maximMachineGunModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "toggle_lock" | "water_jacket" | "belt_feed" | "spade_grips" | "top";

export function MaximMachineGun3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // Automatic Recoil Ballistics Parameters
  const { params } = usePatentPhysics("us-319596-maxim-machine-gun");
  const fireRateRpm = params.firingRate ?? params.fireRateRpm ?? 600;
  const waterLevelLiters = params.waterLevel ?? 4;
  const recoilStrokeMm = params.recoilStroke ?? 19;

  const maxim = FrankenSimEngine.stepMaximMachineGun({
    firingRateRpm: fireRateRpm,
    waterJacketLiters: waterLevelLiters,
    recoilStrokeMm,
  });
  const [showMuzzleFlash] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    fireRateRpm,
    showMuzzleFlash,
    isAudioMuted,
    isCutaway,
    recoilStudioStroke: maxim.recoilStudioStroke,
    barrelTempC: maxim.barrelTempC,
    waterEvapRateGs: maxim.waterEvapRateGs,
    recoilMomentumNs: maxim.recoilMomentumNs,
    fireOmegaRadPerS: maxim.fireOmegaRadPerS,
    steamOpacity: maxim.steamOpacity,
    fireCycleWrapRad: maxim.fireCycleWrapRad,
    muzzleFlashSinThreshold: maxim.muzzleFlashSinThreshold,
  });

  const controlsRef = useRef<StudioContext["controls"] | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelRef = useRef<MaximMachineGunModel | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    switch (preset) {
      case "iso":
        camera.position.set(8.5, 5.5, 9.5);
        controls.target.set(0.5, 0.2, 0);
        break;
      case "toggle_lock":
        camera.position.set(-0.8, 1.8, 2.6);
        controls.target.set(-0.6, 0.4, 0);
        break;
      case "water_jacket":
        camera.position.set(2.2, 1.8, 3.2);
        controls.target.set(1.8, 0.4, 0);
        break;
      case "belt_feed":
        camera.position.set(-0.3, 1.6, 2.4);
        controls.target.set(-0.3, 0.5, 0);
        break;
      case "spade_grips":
        camera.position.set(-3.5, 1.2, 1.8);
        controls.target.set(-1.8, 0.4, 0);
        break;
      case "top":
        camera.position.set(0.5, 11.5, 0.1);
        controls.target.set(0.5, 0.2, 0);
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
      cameraPos: [8.5, 5.5, 9.5],
      targetPos: [0.5, 0.2, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Build procedural 3D model
    const model = buildMaximMachineGunModel();
    modelRef.current = model;
    scene.add(model.rootGroup);

    // Dynamic Muzzle Flash PointLight
    const flashLight = new THREE.PointLight(0xf97316, 0, 7.0);
    flashLight.position.set(4.65, 0.45, 0);
    scene.add(flashLight);

    // Animation Loop
    let reqId: number;
    let timeSec = 0;
    let renderedSteps = 0;
    let lastAudioShot = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const dt = 1 / 60;
      timeSec += dt;
      renderedSteps += 1;
      const p = live.current;

      const { isMuzzleFlash } = updateMaximMachineGunKinematics(
        model,
        dt,
        timeSec,
        p.fireOmegaRadPerS,
        p.recoilStudioStroke,
        p.barrelTempC,
        p.steamOpacity,
        p.showMuzzleFlash,
        p.isCutaway,
        p.fireCycleWrapRad,
        p.muzzleFlashSinThreshold,
      );

      flashLight.intensity = isMuzzleFlash ? 4.8 : 0;

      // Sound transducer trigger
      if (isMuzzleFlash && Math.floor(renderedSteps / 6) !== lastAudioShot) {
        lastAudioShot = Math.floor(renderedSteps / 6);
        if (!p.isAudioMuted) {
          soundEngine.playGunshot();
        }
      }

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
            Maxim Machine Gun 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 319,596 (1885)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["toggle_lock", "Toggle Lock"],
              ["water_jacket", "Water Jacket"],
              ["belt_feed", "Belt Feed"],
              ["spade_grips", "Spade Grips"],
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
            title={isCutaway ? "Solid Receiver" : "Cutaway Interior"}
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
        title="Maxim recoil ballistics"
        chips={[
          { label: "Cyclic Rate", value: String(Math.round(fireRateRpm)), unit: "rds/min" },
          { label: "Recoil Stroke", value: String(Math.round(maxim.recoilStrokeMm)), unit: "mm" },
          { label: "Toggle Unlock", value: String(maxim.toggleUnlockForceN), unit: "N" },
          { label: "Recoil p", value: String(maxim.recoilMomentumNs), unit: "N·s" },
          {
            label: "Barrel Temp",
            value: String(maxim.barrelTempC),
            unit: "°C",
            tone: maxim.barrelTempC > 200 ? "warn" : "ok",
          },
          { label: "Steam Evap", value: String(maxim.waterEvapRateGs), unit: "g/s" },
          { label: "Muzzle Energy", value: String(maxim.muzzleEnergyJoules), unit: "J" },
          { label: "ω_fire", value: maxim.fireOmegaRadPerS.toFixed(1), unit: "rad/s" },
        ]}
      />
    </div>
  );
}
