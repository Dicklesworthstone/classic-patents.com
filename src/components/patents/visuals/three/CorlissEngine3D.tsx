"use client";

import { Activity, Camera, Gauge, Sparkles, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildCorlissEngineModel } from "./corlissEngineModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "wristplate" | "flywheel" | "valves" | "top";

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  engineRpm: number;
  boilerPressure: number;
  cutoffPercentage: number;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: "centennial_standard",
    name: "1876 Centennial 1400 HP Mode",
    desc: "George Corliss's towering 700-ton Centennial Exposition engine operating at nominal 36 RPM, 125 PSI with 25% automatic cutoff.",
    engineRpm: 36,
    boilerPressure: 125,
    cutoffPercentage: 25,
  },
  {
    id: "heavy_mill_load",
    name: "Heavy Textile Mill Load",
    desc: "High-torque operation with 40% extended cutoff delivering massive indicated horsepower to thousands of belt-driven looms.",
    engineRpm: 60,
    boilerPressure: 150,
    cutoffPercentage: 40,
  },
  {
    id: "light_economy",
    name: "High-Efficiency Economy (15% Cutoff)",
    desc: "Early steam cutoff maximizing adiabatic expansion ratio, achieving world-record thermal efficiency of 24%.",
    engineRpm: 45,
    boilerPressure: 110,
    cutoffPercentage: 15,
  },
];

export function CorlissEngine3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { params, updateParam } = usePatentPhysics("us-6162-corliss-steam-engine");

  const cutoffPct = params.cutoffPercentage ?? 25;
  const steamPressurePsi = params.boilerPressure ?? 125;
  const engineRpm = params.engineRpm ?? 50;

  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const indicatedHorsepower = Math.round(
    ((steamPressurePsi * 0.75 * 0.9 * 350 * engineRpm) / 33000) * 1.8,
  );
  const thermalEfficiencyPct = Math.round(18 + (steamPressurePsi / 125) * 6 - (cutoffPct / 50) * 4);

  const live = useLiveSimParams({
    cutoffPct,
    steamPressurePsi,
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

  const applyScenario = (s: ScenarioPreset) => {
    updateParam("engineRpm", s.engineRpm);
    updateParam("boilerPressure", s.boilerPressure);
    updateParam("cutoffPercentage", s.cutoffPercentage);
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
      const wristAngle = Math.sin(theta + Math.PI / 4) * 0.32;
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

        {/* Camera Views */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
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

      {/* Bottom Control Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pointer-events-none z-10">
        {/* Scenario Presets */}
        <div className="flex flex-wrap items-center gap-1.5 bg-parchment-950/85 backdrop-blur-md p-2 rounded-2xl border border-parchment-700/60 shadow-xl pointer-events-auto">
          <Sparkles className="w-4 h-4 text-amber-400 ml-1.5 mr-1" />
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => applyScenario(s)}
              className={`px-3 py-1.5 text-xs font-mono rounded-xl transition-all ${
                engineRpm === s.engineRpm
                  ? "bg-amber-600 text-white font-bold shadow-xs"
                  : "text-parchment-200 hover:text-white hover:bg-parchment-800/60"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Live Controls & SI Telemetry */}
        <div className="flex items-center gap-3 bg-parchment-950/85 backdrop-blur-md px-4 py-2 rounded-2xl border border-parchment-700/60 shadow-xl pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-parchment-300">RPM:</span>
            <input
              type="range"
              min="10"
              max="100"
              step="1"
              value={engineRpm}
              onChange={(e) => updateParam("engineRpm", Number.parseFloat(e.target.value))}
              className="w-20 h-1.5 bg-parchment-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <span className="text-xs font-mono font-bold text-amber-400 w-10 text-right">
              {engineRpm}
            </span>
          </div>

          <div className="h-4 w-px bg-parchment-700" />

          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs font-mono text-parchment-300">Power:</span>
            <span className="text-xs font-mono font-bold text-orange-400">
              {indicatedHorsepower} IHP
            </span>
          </div>

          <div className="h-4 w-px bg-parchment-700" />

          <div className="flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-mono text-parchment-300">Efficiency:</span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {thermalEfficiencyPct}%
            </span>
          </div>

          <div className="h-4 w-px bg-parchment-700" />

          <button
            type="button"
            onClick={toggleEngine}
            className="p-1.5 rounded-lg text-parchment-300 hover:text-white hover:bg-parchment-800/60 transition-colors"
            title={isAudioMuted ? "Unmute Steam Acoustics" : "Mute Steam Acoustics"}
          >
            {isAudioMuted ? (
              <VolumeX className="w-4 h-4 text-parchment-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
