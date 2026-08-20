"use client";

import { useEffect, useRef, useState } from "react";
import { stepHaberAmmonia } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import {
  articulateHaberAmmoniaModel,
  buildHaberAmmoniaModel,
  type HaberAmmoniaModelNodes,
} from "./haberAmmoniaModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

interface HaberAmmonia3DProps {
  initialPressureAtm?: number;
  initialTemperatureCelsius?: number;
  initialFeedFlowRateMolesPerSec?: number;
  initialCatalystActivity?: number;
}

type CameraPreset = "isometric" | "reactor" | "heatExchanger" | "condenser";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  isometric: { pos: [0, 4.0, 7.5], target: [0, 1.4, 0] },
  reactor: { pos: [0.7, 2.2, 4.2], target: [0.7, 1.5, 0] },
  heatExchanger: { pos: [-0.7, 2.0, 3.8], target: [-0.7, 1.2, 0] },
  condenser: { pos: [2.1, 1.8, 3.8], target: [2.1, 1.1, 0] },
};

export default function HaberAmmonia3D({
  initialPressureAtm = 175,
  initialTemperatureCelsius = 530,
  initialFeedFlowRateMolesPerSec = 50,
  initialCatalystActivity = 1.0,
}: HaberAmmonia3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const nodesRef = useRef<HaberAmmoniaModelNodes | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  const { params, updateParam } = usePatentPhysics("us-971501-haber-ammonia");
  const pressureAtm = params.pressureAtm ?? initialPressureAtm;
  const temperatureCelsius = params.temperatureCelsius ?? initialTemperatureCelsius;
  const feedFlowRateMolesPerSec = params.feedFlowRateMolesPerSec ?? initialFeedFlowRateMolesPerSec;
  const catalystActivity = params.catalystActivity ?? initialCatalystActivity;
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("isometric");
  const [isRotating, setIsRotating] = useState(false);

  const sim = stepHaberAmmonia({
    pressureAtm,
    temperatureCelsius,
    feedFlowRateMolesPerSec,
    catalystActivity,
  });

  const live = useLiveSimParams({
    isRotating,
    pressureAtm,
    temperatureCelsius,
    ammoniaYieldPct: sim.ammoniaYieldPct,
    ammoniaProductionKgPerHour: sim.ammoniaProductionKgPerHour,
  });

  const handlePresetChange = (preset: CameraPreset) => {
    setCameraPreset(preset);
    const targetConfig = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(targetConfig.pos, targetConfig.target);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const overview = CAMERA_PRESETS.isometric;
    const studio = createThreeStudioScene({
      container,
      cameraPos: overview.pos,
      targetPos: overview.target,
    });
    studioRef.current = studio;

    const nodes = buildHaberAmmoniaModel();
    nodesRef.current = nodes;
    studio.scene.add(nodes.root);

    let lastTime: number | null = null;
    const animate = (now: number) => {
      const dt = lastTime === null ? 0.016 : Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;
      timeRef.current += dt;

      const p = live.current;
      if (p.isRotating) {
        nodes.root.rotation.y += 0.0044;
      }
      studio.controls.update();

      articulateHaberAmmoniaModel(
        nodes,
        {
          pressureAtm: p.pressureAtm,
          temperatureCelsius: p.temperatureCelsius,
          ammoniaYieldPct: p.ammoniaYieldPct,
          ammoniaProductionKgPerHour: p.ammoniaProductionKgPerHour,
        },
        timeRef.current,
      );

      studio.renderer.render(studio.scene, studio.camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      nodes.materials.forEach((m) => {
        m.dispose();
      });
      studio.dispose();
      studioRef.current = null;
      nodesRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-wide text-cyan-400">
            Haber-Bosch Catalytic Ammonia Synthesis 3D WebGL Studio
          </h2>
          <p className="text-sm text-slate-400">
            Procedural 3D simulation of US Patent 971,501 • Pure WebGL (No GLTF assets)
          </p>
        </div>

        {/* Camera Presets & Orbit Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {(["isometric", "reactor", "heatExchanger", "condenser"] as CameraPreset[]).map(
            (preset) => (
              <button
                type="button"
                key={preset}
                onClick={() => handlePresetChange(preset)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition ${
                  cameraPreset === preset
                    ? "bg-cyan-700 text-white"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200"
                }`}
              >
                {preset.replace(/([A-Z])/g, " $1")}
              </button>
            ),
          )}
          <button
            type="button"
            onClick={() => setIsRotating(!isRotating)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
              isRotating
                ? "bg-amber-600 text-white"
                : "bg-slate-900 text-slate-400 hover:text-slate-200"
            }`}
          >
            {isRotating ? "Stop Orbit" : "Auto Orbit"}
          </button>
        </div>
      </div>

      {/* 3D WebGL Viewport */}
      <div className="relative w-full aspect-[16/9] max-h-[560px] rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
        <div ref={containerRef} className="w-full h-full" />

        {/* Bottom-Left Pointer-Events-None Telemetry HUD */}
        <div className="absolute bottom-4 left-4 p-3 bg-slate-900/80 backdrop-blur-md rounded-lg border border-slate-700 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">System Pressure:</span>
            <span className="text-cyan-400 font-bold">
              {sim.pressureAtm} atm ({sim.pressureMpa} MPa)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Catalyst Temp:</span>
            <span className="text-amber-400 font-bold">{sim.catalystTemperatureCelsius} °C</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Ammonia Single-Pass:</span>
            <span className="text-emerald-400 font-bold">{sim.ammoniaYieldPct}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Production Rate:</span>
            <span className="text-cyan-300 font-bold">{sim.ammoniaProductionKgPerHour} kg/hr</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Reaction Heat:</span>
            <span className="text-purple-400 font-bold">{sim.reactionHeatGeneratedKw} kW</span>
          </div>
        </div>
      </div>

      {/* Parameter Control Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-900/60 rounded-lg border border-slate-800">
        {/* Reactor Pressure */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-cyan-400">Reactor Pressure</span>
            <span className="font-mono text-cyan-300">{pressureAtm} atm</span>
          </div>
          <input
            type="range"
            min={50}
            max={300}
            step={5}
            value={pressureAtm}
            onChange={(e) => updateParam("pressureAtm", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <span className="text-[10px] text-slate-400">Super-atmospheric compression</span>
        </div>

        {/* Catalyst Bed Temperature */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-amber-400">Catalyst Temp</span>
            <span className="font-mono text-amber-300">{temperatureCelsius} °C</span>
          </div>
          <input
            type="range"
            min={350}
            max={650}
            step={5}
            value={temperatureCelsius}
            onChange={(e) => updateParam("temperatureCelsius", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <span className="text-[10px] text-slate-400">Kinetic rate vs equilibrium yield</span>
        </div>

        {/* Feed Gas Flow */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-emerald-400">Feed Gas Flow</span>
            <span className="font-mono text-emerald-300">{feedFlowRateMolesPerSec} mol/s</span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            step={2}
            value={feedFlowRateMolesPerSec}
            onChange={(e) => updateParam("feedFlowRateMolesPerSec", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <span className="text-[10px] text-slate-400">1 N₂ : 3 H₂ stoichiometric feed</span>
        </div>

        {/* Catalyst Activity */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-purple-400">Catalyst Activity</span>
            <span className="font-mono text-purple-300">{catalystActivity.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min={0.2}
            max={2.0}
            step={0.1}
            value={catalystActivity}
            onChange={(e) => updateParam("catalystActivity", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <span className="text-[10px] text-slate-400">Osmium / Promoted Fe contact mass</span>
        </div>
      </div>
    </div>
  );
}
