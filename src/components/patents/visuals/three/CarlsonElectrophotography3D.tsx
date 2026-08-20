"use client";

import { useEffect, useRef, useState } from "react";
import { stepCarlsonElectrophotography } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import {
  articulateCarlsonElectrophotographyModel,
  buildCarlsonElectrophotographyModel,
  type CarlsonElectrophotographyModelNodes,
} from "./carlsonElectrophotographyModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

interface CarlsonElectrophotography3DProps {
  initialCoronaVoltageKv?: number;
  initialExposureLuxSec?: number;
  initialLayerThicknessUm?: number;
  initialFuserTemperatureC?: number;
}

type CameraPreset =
  | "isometric"
  | "photoreceptorDrum"
  | "coronaCharger"
  | "tonerDeveloper"
  | "thermalFuser";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  isometric: { pos: [0, 2.0, 4.5], target: [0, 0, 0] },
  photoreceptorDrum: { pos: [-0.2, 0.8, 2.5], target: [-0.2, 0.1, 0] },
  coronaCharger: { pos: [-1.4, 1.2, 1.8], target: [-0.95, 0.85, 0] },
  tonerDeveloper: { pos: [1.4, 0.8, 1.8], target: [0.95, 0.3, 0] },
  thermalFuser: { pos: [2.2, -0.2, 1.8], target: [1.7, -0.85, 0] },
};

export function CarlsonElectrophotography3D({
  initialCoronaVoltageKv = 6.5,
  initialExposureLuxSec = 12,
  initialLayerThicknessUm = 30,
  initialFuserTemperatureC = 185,
}: CarlsonElectrophotography3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const nodesRef = useRef<CarlsonElectrophotographyModelNodes | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  const { params, updateParam } = usePatentPhysics("us-2297691-carlson-electrophotography");
  const coronaVoltageKv = params.coronaVoltageKv ?? initialCoronaVoltageKv;
  const exposureLuxSec = params.exposureLuxSec ?? initialExposureLuxSec;
  const layerThicknessUm = params.layerThicknessUm ?? initialLayerThicknessUm;
  const fuserTemperatureC = params.fuserTemperatureC ?? initialFuserTemperatureC;

  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("isometric");
  const [isRotating, setIsRotating] = useState(false);

  const sim = stepCarlsonElectrophotography({
    coronaVoltageKv,
    exposureLuxSec,
    layerThicknessUm,
    fuserTemperatureC,
  });

  const live = useLiveSimParams({
    coronaVoltageKv,
    contrastPotentialV: sim.contrastPotentialV,
    opticalDensity: sim.opticalDensity,
    fuserTemperatureC,
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
    });
    studioRef.current = studio;

    const nodes = buildCarlsonElectrophotographyModel();
    studio.scene.add(nodes.root);
    nodesRef.current = nodes;

    const animate = () => {
      timeRef.current += 0.016;
      const current = live.current;
      if (current.isRotating) {
        nodes.root.rotation.y += 0.0044;
      }
      studio.controls.update();

      articulateCarlsonElectrophotographyModel(
        nodes,
        {
          coronaVoltageKv: current.coronaVoltageKv,
          contrastPotentialV: current.contrastPotentialV,
          opticalDensity: current.opticalDensity,
          fuserTemperatureC: current.fuserTemperatureC,
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
            Chester Carlson Electrophotography & Xerography 3D WebGL Studio
          </h2>
          <p className="text-sm text-slate-400">
            Procedural 3D simulation of US Patent 2,297,691 • Pure WebGL (No GLTF assets)
          </p>
        </div>

        {/* Camera Presets & Orbit Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              "isometric",
              "photoreceptorDrum",
              "coronaCharger",
              "tonerDeveloper",
              "thermalFuser",
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
            <span className="text-slate-400">Contrast Potential:</span>
            <span className="text-emerald-400 font-bold">{sim.contrastPotentialV} V</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Optical Density:</span>
            <span className="text-cyan-400 font-bold">{sim.opticalDensity} OD</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Initial Charge:</span>
            <span className="text-amber-400 font-bold">+{sim.initialSurfacePotentialV} V</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Toner Density:</span>
            <span className="text-purple-400 font-bold">{sim.tonerMassDensityMgPerCm2} mg/cm²</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Fusing Bond:</span>
            <span className="text-rose-400 font-bold">{sim.fuserBondQualityPct}%</span>
          </div>
        </div>
      </div>

      {/* Parameter Control Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-900/60 rounded-lg border border-slate-800">
        {/* Corona Voltage */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-yellow-400">Corona Grid Voltage</span>
            <span className="font-mono text-yellow-300">{coronaVoltageKv.toFixed(2)} kV</span>
          </div>
          <input
            type="range"
            min={4.0}
            max={8.0}
            step={0.25}
            value={coronaVoltageKv}
            onChange={(e) => updateParam("coronaVoltageKv", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
          <span className="text-[10px] text-slate-400">Surface charging potential</span>
        </div>

        {/* Optical Exposure */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-cyan-400">Optical Exposure</span>
            <span className="font-mono text-cyan-300">{exposureLuxSec} lx·s</span>
          </div>
          <input
            type="range"
            min={0}
            max={30}
            step={1}
            value={exposureLuxSec}
            onChange={(e) => updateParam("exposureLuxSec", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <span className="text-[10px] text-slate-400">Discharge light energy</span>
        </div>

        {/* Photoreceptor Thickness */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-indigo-400">Selenium Thickness</span>
            <span className="font-mono text-indigo-300">{layerThicknessUm} µm</span>
          </div>
          <input
            type="range"
            min={10}
            max={60}
            step={5}
            value={layerThicknessUm}
            onChange={(e) => updateParam("layerThicknessUm", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <span className="text-[10px] text-slate-400">Semiconductor layer depth</span>
        </div>

        {/* Fuser Temperature */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-rose-400">Fuser Temperature</span>
            <span className="font-mono text-rose-300">{fuserTemperatureC}°C</span>
          </div>
          <input
            type="range"
            min={120}
            max={220}
            step={5}
            value={fuserTemperatureC}
            onChange={(e) => updateParam("fuserTemperatureC", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
          <span className="text-[10px] text-slate-400">Thermal resin bonding</span>
        </div>
      </div>
    </div>
  );
}

export default CarlsonElectrophotography3D;
