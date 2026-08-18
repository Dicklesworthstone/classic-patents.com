"use client";

import { Activity, Camera, Eye, EyeOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { stepCorlissEngine } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildCorlissEngineModel } from "./corlissEngineModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "wristplate" | "flywheel" | "valves" | "top";

export function CorlissEngine3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { params } = usePatentPhysics("us-6162-corliss-steam-engine");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);

  const cutoffPct = params.cutoffPct ?? 25;
  const steamPressurePsi = params.steamPressurePsi ?? 125;
  const engineRpm = params.engineRpm ?? 50;

  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted } = usePatentAudio();

  const corliss = stepCorlissEngine({ steamPressurePsi, engineRpm });
  const indicatedHorsepower = corliss.indicatedHp;
  const thermalEfficiencyPct = corliss.thermalEfficiencyPct;

  const live = useLiveSimParams({
    cutoffPct,
    steamPressurePsi,
    indicatedHorsepower,
    thermalEfficiencyPct,
    engineRpm,
    isAudioMuted,
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
        camera.position.set(9.5, 4.5, 9.5);
        controls.target.set(0, 0, 0);
        break;
      case "wristplate":
        camera.position.set(-3.6, 1.2, 3.2);
        controls.target.set(-3.6, 0, 1.0);
        break;
      case "flywheel":
        camera.position.set(5.5, 1.5, 4.8);
        controls.target.set(3.4, 0, 0);
        break;
      case "valves":
        camera.position.set(-4.8, 2.2, 2.4);
        controls.target.set(-3.6, 0, 0);
        break;
      case "top":
        camera.position.set(0, 12.0, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const studio = createThreeStudioScene({
      container: containerRef.current,
      cameraPos: [9.5, 4.5, 9.5],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Load High-Fidelity Corliss Engine Model
    const model = buildCorlissEngineModel();
    scene.add(model.rootGroup);

    // Animation Loop
    let reqId: number;
    const clock = new THREE.Clock();
    let theta = 0;
    let lastStrokeTime = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = live.current;

      const omega = (p.engineRpm * 2 * Math.PI) / 60;
      theta += omega * delta;

      // 1. Flywheel & Crank Rotation
      model.flywheelGroup.rotation.z = -theta;

      // 2. Exact Slider-Crank Kinematics
      const crankRadius = 0.85;
      const rodLength = 4.2;
      const crankX = Math.cos(theta) * crankRadius;
      const crankY = Math.sin(theta) * crankRadius;

      // Crosshead displacement along X
      const crossheadX =
        3.4 - (crankX + Math.sqrt(Math.max(0.01, rodLength * rodLength - crankY * crankY)));
      model.crosshead.position.x = crossheadX + 2.6;

      // Connecting Rod orientation and position
      const rodMidX = (3.4 + crankX + crossheadX) / 2;
      const rodMidY = crankY / 2;
      model.connectingRod.position.set(rodMidX - 0.9, rodMidY, 0);
      const rodAngle = Math.atan2(crankY, 3.4 + crankX - crossheadX);
      model.connectingRod.rotation.z = rodAngle;

      // 3. Wrist Plate Oscillation & Valve Linkage
      const wristAmp = 0.14 + (p.cutoffPct / 100) * 0.36;
      const wristAngle = Math.sin(theta + Math.PI / 4) * wristAmp;
      model.wristPlate.rotation.z = wristAngle;
      model.reachRods.forEach((rod, idx) => {
        rod.rotation.z = wristAngle + (idx * Math.PI) / 4;
      });

      // 4. Centrifugal Flyball Governor
      model.governorBalls.rotation.y += omega * 2.5 * delta;

      // 5. Steam Puff Acoustics on Each Stroke
      const strokeInterval = 60 / (p.engineRpm * 2);
      const now = clock.getElapsedTime();
      if (now - lastStrokeTime > strokeInterval) {
        lastStrokeTime = now;
        if (!p.isAudioMuted && typeof window !== "undefined") {
          soundEngine.playPneumaticPuff();
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
  }, [live.current]);

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

        {/* Camera Views & HUD Toggle */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={() => setShowUiOverlay((v) => !v)}
            className="p-1.5 rounded-lg text-parchment-300 hover:text-white hover:bg-parchment-800/60 transition-colors"
            title={showUiOverlay ? "Hide HUD Overlay" : "Show HUD Overlay"}
            aria-label={showUiOverlay ? "Hide HUD Overlay" : "Show HUD Overlay"}
          >
            {showUiOverlay ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <div className="w-px h-3.5 bg-parchment-700/60 my-auto" />
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              { id: "iso", label: "Overview" },
              { id: "wristplate", label: "Wrist Plate" },
              { id: "flywheel", label: "Flywheel" },
              { id: "valves", label: "4 Valves" },
              { id: "top", label: "Top View" },
            ] as const
          ).map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => applyCameraPreset(c.id)}
              className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all ${
                activeCamera === c.id
                  ? "bg-amber-600 text-white font-bold shadow-xs"
                  : "text-parchment-300 hover:text-white hover:bg-parchment-800/60"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <StudioKernelChips
        visible={showUiOverlay}
        title="Corliss wrist-plate cutoff"
        chips={[
          { label: "Steam", value: String(steamPressurePsi), unit: "psi" },
          { label: "Cutoff", value: String(cutoffPct), unit: "%" },
          { label: "IHP", value: String(indicatedHorsepower), unit: "hp" },
          { label: "η", value: String(thermalEfficiencyPct), unit: "%" },
        ]}
      />
    </div>
  );
}
