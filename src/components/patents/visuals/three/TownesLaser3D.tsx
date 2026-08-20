"use client";

import { useEffect, useRef, useState } from "react";
import { stepTownesLaser } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import {
  articulateTownesLaserModel,
  buildTownesLaserModel,
  type TownesLaserModelNodes,
} from "./townesLaserModel";
import { useLiveSimParams } from "./useLiveSimParams";

interface TownesLaser3DProps {
  initialPumpPowerWatts?: number;
  initialCavityLengthCm?: number;
  initialMirror2ReflectivityPct?: number;
  initialBeamDiameterMm?: number;
}

type CameraPreset = "isometric" | "opticalCavity" | "rearReflector" | "outputCoupler" | "detector";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  isometric: { pos: [0, 2.5, 5.0], target: [0, 0, 0] },
  opticalCavity: { pos: [-0.3, 0.8, 3.2], target: [-0.3, 0, 0] },
  rearReflector: { pos: [-1.8, 0.6, 2.2], target: [-1.8, 0, 0] },
  outputCoupler: { pos: [1.2, 0.6, 2.2], target: [1.2, 0, 0] },
  detector: { pos: [2.6, 0.6, 2.2], target: [2.6, 0, 0] },
};

export function TownesLaser3D({
  initialPumpPowerWatts = 350,
  initialCavityLengthCm = 25,
  initialMirror2ReflectivityPct = 94,
  initialBeamDiameterMm = 8,
}: TownesLaser3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const nodesRef = useRef<TownesLaserModelNodes | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  const { params, updateParam } = usePatentPhysics("us-2929922-townes-laser");
  const pumpPowerWatts = params.pumpPowerWatts ?? initialPumpPowerWatts;
  const cavityLengthCm = params.cavityLengthCm ?? initialCavityLengthCm;
  const mirror2ReflectivityPct = params.mirror2ReflectivityPct ?? initialMirror2ReflectivityPct;
  const beamDiameterMm = params.beamDiameterMm ?? initialBeamDiameterMm;

  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("isometric");
  const [isRotating, setIsRotating] = useState(false);

  const sim = stepTownesLaser({
    pumpPowerWatts,
    cavityLengthCm,
    mirror2ReflectivityPct,
    beamDiameterMm,
  });

  const live = useLiveSimParams({
    pumpPowerWatts,
    laserOutputPowerWatts: sim.laserOutputPowerWatts,
    intraCavityPowerWatts: sim.intraCavityPowerWatts,
    isLasing: sim.isLasing,
    isRotating,
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
      environmentStyle: "studio",
    });
    studioRef.current = studio;

    const nodes = buildTownesLaserModel();
    studio.scene.add(nodes.root);
    nodesRef.current = nodes;

    const animate = () => {
      timeRef.current += 0.016;
      const current = live.current;
      if (current.isRotating) {
        nodes.root.rotation.y += 0.0044;
      }
      studio.controls.update();

      articulateTownesLaserModel(
        nodes,
        {
          pumpPowerWatts: current.pumpPowerWatts,
          laserOutputPowerWatts: current.laserOutputPowerWatts,
          intraCavityPowerWatts: current.intraCavityPowerWatts,
          isLasing: current.isLasing,
        },
        timeRef.current,
      );

      studio.renderer.render(studio.scene, studio.camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      for (const m of nodes.materials) {
        m.dispose();
      }
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
            Townes & Schawlow Optical Maser / Laser 3D WebGL Studio
          </h2>
          <p className="text-sm text-slate-400">
            Procedural 3D simulation of US Patent 2,929,922 • Pure WebGL (No GLTF assets)
          </p>
        </div>

        {/* Camera Presets & Orbit Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              "isometric",
              "opticalCavity",
              "rearReflector",
              "outputCoupler",
              "detector",
            ] as CameraPreset[]
          ).map((preset) => (
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
          ))}
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
            <span className="text-slate-400">State:</span>
            <span className={`font-bold ${sim.isLasing ? "text-emerald-400" : "text-rose-400"}`}>
              {sim.isLasing ? "LASING COHERENT" : "BELOW THRESHOLD"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Output Power:</span>
            <span className="text-cyan-400 font-bold">{sim.laserOutputPowerWatts} W</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Threshold Gain:</span>
            <span className="text-emerald-400 font-bold">{sim.thresholdGainPerCm} cm⁻¹</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Intracavity Flux:</span>
            <span className="text-amber-400 font-bold">{sim.intraCavityPowerWatts} W</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Beam Divergence:</span>
            <span className="text-purple-400 font-bold">{sim.beamDivergenceMrad} mrad</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Mode Spacing:</span>
            <span className="text-indigo-400 font-bold">{sim.longitudinalModeSpacingMhz} MHz</span>
          </div>
        </div>
      </div>

      {/* Parameter Control Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-900/60 rounded-lg border border-slate-800">
        {/* Optical Pump Power */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-yellow-400">Optical Pump Power</span>
            <span className="font-mono text-yellow-300">{pumpPowerWatts} W</span>
          </div>
          <input
            type="range"
            min={50}
            max={1000}
            step={25}
            value={pumpPowerWatts}
            onChange={(e) => updateParam("pumpPowerWatts", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
          <span className="text-[10px] text-slate-400">Flashlamp excitation</span>
        </div>

        {/* Cavity Length */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-cyan-400">Cavity Length</span>
            <span className="font-mono text-cyan-300">{cavityLengthCm} cm</span>
          </div>
          <input
            type="range"
            min={5}
            max={100}
            step={5}
            value={cavityLengthCm}
            onChange={(e) => updateParam("cavityLengthCm", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <span className="text-[10px] text-slate-400">Mirror separation distance</span>
        </div>

        {/* Output Mirror Reflectivity */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-emerald-400">Output Coupler R2</span>
            <span className="font-mono text-emerald-300">{mirror2ReflectivityPct}%</span>
          </div>
          <input
            type="range"
            min={80}
            max={99.5}
            step={0.5}
            value={mirror2ReflectivityPct}
            onChange={(e) => updateParam("mirror2ReflectivityPct", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <span className="text-[10px] text-slate-400">Transmissive extraction</span>
        </div>

        {/* Beam Diameter */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-purple-400">Aperture Diameter</span>
            <span className="font-mono text-purple-300">{beamDiameterMm} mm</span>
          </div>
          <input
            type="range"
            min={2}
            max={25}
            step={1}
            value={beamDiameterMm}
            onChange={(e) => updateParam("beamDiameterMm", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <span className="text-[10px] text-slate-400">Diffraction divergence limit</span>
        </div>
      </div>
    </div>
  );
}

export default TownesLaser3D;
