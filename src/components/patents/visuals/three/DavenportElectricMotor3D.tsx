"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import { stepDavenportMotor } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import {
  buildDavenportMotorModel,
  updateDavenportMotorKinematics,
} from "./davenportElectricMotorModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "commutator" | "stator_magnets" | "rotor" | "brushes" | "top";

export function DavenportElectricMotor3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // Electromechanical Parameters
  const { params } = usePatentPhysics("us-132-davenport-electric-motor");
  const supplyVoltage = params.batteryVoltage ?? 12;
  const loadTorque = params.loadTorque ?? 0.8;
  const davenport = stepDavenportMotor({ batteryVoltage: supplyVoltage, loadTorque });
  const motorRpm = davenport.shaftRpm;
  const [showSparkParticles, setShowSparkParticles] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    motorRpm,
    supplyVoltage,
    showSparkParticles,
    isAudioMuted,
    isCutaway,
    loadTorque,
    mechanicalWatts: davenport.shaftPowerW,
    shaftOmegaRadPerS: davenport.shaftOmegaRadPerS,
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
        camera.position.set(9.0, 7.5, 10.5);
        controls.target.set(0, 0, 0);
        break;
      case "commutator":
        camera.position.set(0, 2.5, 3.8);
        controls.target.set(0, 1.2, 0);
        break;
      case "stator_magnets":
        camera.position.set(3.2, 1.5, 3.5);
        controls.target.set(1.5, 0, 0);
        break;
      case "rotor":
        camera.position.set(0, 4.0, 1.5);
        controls.target.set(0, 0, 0);
        break;
      case "brushes":
        camera.position.set(-1.8, 2.2, 2.5);
        controls.target.set(-0.5, 1.6, 0);
        break;
      case "top":
        camera.position.set(0, 11.5, 0.1);
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
      cameraPos: [9.0, 7.5, 10.5],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    const { rootGroup, nodes, materials, dispose } = buildDavenportMotorModel();
    scene.add(rootGroup);

    // Animation Loop
    let reqId: number;
    let timeSec = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const dt = 1 / 60;
      timeSec += dt;
      const p = live.current;

      updateDavenportMotorKinematics(
        nodes,
        materials,
        dt,
        timeSec,
        p.shaftOmegaRadPerS ?? 0,
        p.showSparkParticles,
        p.isCutaway,
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
            Davenport DC Motor 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 132 (1837)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["commutator", "Commutator"],
              ["stator_magnets", "Stator"],
              ["rotor", "Rotor Armature"],
              ["brushes", "Brushes"],
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
            title={isCutaway ? "Solid Apparatus" : "Cutaway View"}
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
            onClick={() => setShowSparkParticles(!showSparkParticles)}
            title="Toggle Commutator Sparks"
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              showSparkParticles
                ? "bg-amber-600/30 text-amber-300 border border-amber-500/40"
                : "text-parchment-400 hover:text-white hover:bg-parchment-800/60"
            }`}
          >
            <Zap className="w-4 h-4 text-sky-400" />
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
        title="Davenport commutator DC motor"
        chips={[
          { label: "Shaft Speed", value: String(Math.round(motorRpm)), unit: "rpm" },
          { label: "Voltage", value: `${supplyVoltage}`, unit: "V" },
          { label: "Current", value: `${davenport.armatureCurrentA.toFixed(1)}`, unit: "A" },
          { label: "Load Torque", value: `${loadTorque.toFixed(2)}`, unit: "N·m" },
          { label: "Shaft Power", value: `${davenport.shaftPowerW.toFixed(1)}`, unit: "W" },
          {
            label: "Electrical Input",
            value: `${davenport.electricalWatts.toFixed(1)}`,
            unit: "W",
          },
          { label: "Efficiency", value: `${davenport.efficiencyPct.toFixed(1)}`, unit: "%" },
          { label: "ω_shaft", value: `${davenport.shaftOmegaRadPerS.toFixed(1)}`, unit: "rad/s" },
        ]}
      />
    </div>
  );
}
