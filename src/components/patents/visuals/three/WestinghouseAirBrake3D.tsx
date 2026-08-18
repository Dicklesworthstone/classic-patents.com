"use client";

import { Activity, Camera, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import { FrankenSimEngine } from "@/physics/engine";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";
import {
  buildWestinghouseAirBrakeModel,
  updateWestinghouseAirBrakeKinematics,
  type WestinghouseAirBrakeModelResult,
} from "./westinghouseAirBrakeModel";

type CameraPreset =
  | "iso"
  | "triple_valve"
  | "brake_cylinder"
  | "wheel_shoes"
  | "reservoir"
  | "track";

export function WestinghouseAirBrake3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);

  // Pneumatic Simulation Parameters
  const { params } = usePatentPhysics("us-124404-westinghouse-air-brake");
  const trainlinePressurePsi = params.trainPipePressure ?? params.brakePressurePsi ?? 70;
  const westinghouse = FrankenSimEngine.stepWestinghouseAirBrake({
    trainPipePressurePsi: trainlinePressurePsi,
    carMassTonnes: params.carMass ?? 35,
  });
  const isBrakeClamped = westinghouse.valveState !== "RELEASE";
  const clampingForceKn = westinghouse.shoeClampingForceKn;
  const stoppingDistanceFt = westinghouse.stoppingDistanceFt;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    trainlinePressurePsi,
    isBrakeClamped,
    isAudioMuted,
    clampingForceKn,
    stoppingDistanceFt,
    pistonStrokeRatio: westinghouse.pistonStrokeRatio,
    approachSpeedMph: westinghouse.approachSpeedMph,
    rollingOmegaRadPerS: westinghouse.rollingOmegaRadPerS,
    clampRatio: westinghouse.clampRatio,
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
        camera.position.set(8.5, 5.5, 9.5);
        controls.target.set(0, 0, 0);
        break;
      case "triple_valve":
        camera.position.set(-0.8, 1.8, 2.5);
        controls.target.set(-0.2, 0.85, 0.35);
        break;
      case "brake_cylinder":
        camera.position.set(2.4, 1.8, 2.5);
        controls.target.set(1.4, 0.85, -0.2);
        break;
      case "wheel_shoes":
        camera.position.set(-2.5, -0.2, 3.2);
        controls.target.set(-1.8, -1.05, 0);
        break;
      case "reservoir":
        camera.position.set(-2.6, 2.0, 2.4);
        controls.target.set(-1.6, 0.85, -0.2);
        break;
      case "track":
        camera.position.set(0, -1.2, 5.5);
        controls.target.set(0, -1.5, 0);
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
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Build procedural 3D model
    const brakeModel: WestinghouseAirBrakeModelResult = buildWestinghouseAirBrakeModel();
    scene.add(brakeModel.root);

    // Animation Loop
    let reqId: number;
    let wheelAngle = 0;
    let wasClamped = false;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = 1 / 60;
      const p = live.current;

      const clampRatio = p.clampRatio ?? (p.isBrakeClamped ? 1 : 0);
      const wheelOmega = p.rollingOmegaRadPerS ?? 0;

      wheelAngle -= wheelOmega * delta;

      // Update model kinematics
      updateWestinghouseAirBrakeKinematics(
        brakeModel.nodes,
        brakeModel.materials,
        wheelAngle,
        clampRatio,
        wheelOmega,
      );

      // Audio hiss on brake application trigger
      if (p.isBrakeClamped && !wasClamped && !p.isAudioMuted) {
        soundEngine.playPneumaticPuff();
      }
      wasClamped = p.isBrakeClamped;

      controls.update();
      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      brakeModel.dispose();
      studio.cleanup();
    };
  }, [live]);

  return (
    <div className="relative w-full h-[620px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/60 shadow-lg pointer-events-auto">
          <Activity className="w-4 h-4 text-sky-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-slate-100 uppercase tracking-wider">
            Westinghouse Automatic Air Brake 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
            US Patent 124,404 (1872)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Overview"],
              ["triple_valve", "Triple Valve"],
              ["brake_cylinder", "Cylinder & Levers"],
              ["wheel_shoes", "Brake Shoes"],
              ["reservoir", "Air Tank"],
              ["track", "Truck & Rails"],
            ] as [CameraPreset, string][]
          ).map(([preset, label]) => (
            <button
              key={preset}
              type="button"
              onClick={() => applyCameraPreset(preset)}
              className={`px-2.5 py-1 text-xs font-sans rounded-lg transition-colors ${
                activeCamera === preset
                  ? "bg-sky-600 text-white font-semibold shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60 shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className="p-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Zap className="w-4 h-4 text-sky-400" />
          </button>
        </div>
      </div>

      <StudioKernelChips
        visible={showUiOverlay}
        title="Westinghouse Fail-Safe Pneumatics"
        chips={[
          { label: "Pipe Pressure", value: `${trainlinePressurePsi} psi` },
          {
            label: "State",
            value: westinghouse.valveState,
            tone: westinghouse.valveState === "EMERGENCY" ? "warn" : "ok",
          },
          { label: "Clamping Force", value: `${clampingForceKn.toFixed(1)} kN` },
          { label: "Stop Dist.", value: `${stoppingDistanceFt.toFixed(0)} ft` },
          { label: "Fail-Safe", value: "Triple-Valve Armed" },
          { label: "ω_roll", value: westinghouse.rollingOmegaRadPerS.toFixed(1), unit: "rad/s" },
        ]}
      />
    </div>
  );
}
