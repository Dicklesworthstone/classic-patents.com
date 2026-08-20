"use client";

import { Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepDeForestAudion } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { articulateDeForestAudionModel, buildDeForestAudionModel } from "./deForestAudionModel";
import { createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

type CameraPreset = "isometric" | "gridControl" | "filament" | "plateAnode";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  isometric: { pos: [0, 1.5, 4.0], target: [0, 0.2, 0] },
  gridControl: { pos: [0, 0.4, 2.0], target: [0, 0.2, 0] },
  filament: { pos: [-1.2, 0.4, 1.8], target: [-0.35, 0.2, 0] },
  plateAnode: { pos: [1.2, 0.4, 1.8], target: [0.4, 0.2, 0] },
};

export function DeForestAudion3D() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<ReturnType<typeof createThreeStudioScene> | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useState(true);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("isometric");
  const [isRotating, setIsRotating] = useState(false);

  const { params, updateParam } = usePatentPhysics("us-879532-de-forest-audion");

  const plateVoltageV = params.plateVoltageV ?? 45;
  const gridBiasVoltageV = params.gridBiasVoltageV ?? -1.5;
  const filamentCurrentA = params.filamentCurrentA ?? 1.0;
  const gridSignalAmplitudeMv = params.gridSignalAmplitudeMv ?? 50;
  const loadResistanceKOhms = params.loadResistanceKOhms ?? 20;

  const sim = stepDeForestAudion({
    plateVoltageV,
    gridBiasVoltageV,
    filamentCurrentA,
    gridSignalAmplitudeMv,
    loadResistanceKOhms,
  });

  const live = useLiveSimParams({
    filamentTemperatureK: sim.filamentTemperatureK,
    plateCurrentMa: sim.plateCurrentMa,
    voltageGain: sim.voltageGain,
    isConducting: sim.isConducting,
    isRotating,
  });

  const handlePresetChange = (preset: CameraPreset) => {
    setCameraPreset(preset);
    const targetConfig = CAMERA_PRESETS[preset];
    if (studioRef.current) {
      studioRef.current.controls.setView(targetConfig.pos, targetConfig.target);
    }
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

    const nodes = buildDeForestAudionModel();
    studio.scene.add(nodes.root);

    let animId = 0;
    let frame = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      frame += 1;
      const time = frame / 60;
      const p = live.current;

      if (p.isRotating) {
        nodes.root.rotation.y += 0.005;
      }
      studio.controls.update();

      articulateDeForestAudionModel(
        nodes,
        {
          filamentTemperatureK: p.filamentTemperatureK,
          plateCurrentMa: p.plateCurrentMa,
          voltageGain: p.voltageGain,
          isConducting: p.isConducting,
        },
        time,
      );

      studio.renderer.render(studio.scene, studio.camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      nodes.materials.forEach((m) => {
        m.dispose();
      });
      studio.dispose();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-wide text-cyan-400">
            Lee de Forest Audion Triode Vacuum Tube 3D WebGL Studio
          </h2>
          <p className="text-sm text-slate-400">
            Procedural 3D simulation of US Patent 879,532 • Pure WebGL (No GLTF assets)
          </p>
        </div>

        {/* Camera Presets & Orbit Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {(["isometric", "gridControl", "filament", "plateAnode"] as CameraPreset[]).map(
            (preset) => (
              <button
                key={preset}
                type="button"
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
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            title={showUiOverlay ? "Hide HUD" : "Show HUD"}
            className="p-1.5 rounded-lg text-xs bg-slate-900 text-slate-400 hover:text-white border border-slate-700 transition-colors"
          >
            <Zap className={`w-4 h-4 ${showUiOverlay ? "text-amber-400" : "text-slate-500"}`} />
          </button>
        </div>
      </div>

      {/* 3D WebGL Viewport */}
      <div className="relative w-full aspect-[16/9] max-h-[560px] rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
        <div ref={containerRef} className="w-full h-full" />

        {/* Bottom-Left Pointer-Events-None Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-4 left-4 p-3 bg-slate-900/80 backdrop-blur-md rounded-lg border border-slate-700 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Voltage Gain:</span>
              <span className="text-emerald-400 font-bold">{sim.voltageGain}x</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Plate Current:</span>
              <span className="text-cyan-400 font-bold">{sim.plateCurrentMa} mA</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Transconductance:</span>
              <span className="text-amber-400 font-bold">
                {sim.dynamicTransconductanceMicromhos} µmhos
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Cutoff Bias:</span>
              <span className="text-rose-400 font-bold">{sim.gridCutoffVoltageV} V</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Power Gain:</span>
              <span className="text-purple-400 font-bold">{sim.powerGainDb} dB</span>
            </div>
          </div>
        )}
      </div>

      {/* Parameter Control Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-slate-900/60 rounded-lg border border-slate-800">
        {/* Plate Voltage */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-amber-400">B-Battery Plate</span>
            <span className="font-mono text-amber-300">{plateVoltageV} V</span>
          </div>
          <input
            type="range"
            min={10}
            max={120}
            step={5}
            value={plateVoltageV}
            onChange={(e) => updateParam("plateVoltageV", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <span className="text-[10px] text-slate-400">High-voltage DC supply</span>
        </div>

        {/* Grid Bias Voltage */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-cyan-400">Grid Bias Voltage</span>
            <span className="font-mono text-cyan-300">{gridBiasVoltageV.toFixed(1)} V</span>
          </div>
          <input
            type="range"
            min={-6.0}
            max={2.0}
            step={0.25}
            value={gridBiasVoltageV}
            onChange={(e) => updateParam("gridBiasVoltageV", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <span className="text-[10px] text-slate-400">Electrostatic control bias</span>
        </div>

        {/* Filament Current */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-yellow-400">Filament Current</span>
            <span className="font-mono text-yellow-300">{filamentCurrentA.toFixed(1)} A</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={1.5}
            step={0.1}
            value={filamentCurrentA}
            onChange={(e) => updateParam("filamentCurrentA", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
          <span className="text-[10px] text-slate-400">Cathode heating power</span>
        </div>

        {/* Input Signal Amplitude */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-emerald-400">Input RF Signal</span>
            <span className="font-mono text-emerald-300">{gridSignalAmplitudeMv} mV</span>
          </div>
          <input
            type="range"
            min={10}
            max={200}
            step={5}
            value={gridSignalAmplitudeMv}
            onChange={(e) => updateParam("gridSignalAmplitudeMv", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <span className="text-[10px] text-slate-400">Antenna carrier swing</span>
        </div>

        {/* Plate Load Resistance */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-purple-400">Load Resistance</span>
            <span className="font-mono text-purple-300">{loadResistanceKOhms} kΩ</span>
          </div>
          <input
            type="range"
            min={5}
            max={50}
            step={5}
            value={loadResistanceKOhms}
            onChange={(e) => updateParam("loadResistanceKOhms", Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <span className="text-[10px] text-slate-400">Headset coil impedance</span>
        </div>
      </div>
    </div>
  );
}

export default DeForestAudion3D;
