"use client";

import { Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepMaimanRubyLaser } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { createMaimanRubyLaserModel } from "./maimanRubyLaserModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

type CameraPreset = "iso" | "ruby_rod" | "flashlamp" | "resonator" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [10, 8, 14], target: [3, 0.4, 0] },
  ruby_rod: { pos: [4.5, 2.0, 5.0], target: [3, 0.4, 0] },
  flashlamp: { pos: [1.5, 3.5, 4.0], target: [2.5, 0.4, 0] },
  resonator: { pos: [9.0, 1.2, 2.0], target: [6.0, 0.4, 0] },
  top: { pos: [3.0, 16.0, 0.1], target: [3, 0.4, 0] },
};

export function MaimanRubyLaser3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { params, updateParam } = usePatentPhysics("us-3353115-maiman-ruby-laser");
  const [showUiOverlay, setShowUiOverlay] = useState(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [isFiring, setIsFiring] = useState(false);
  const isFiringRef = useRef(false);

  const pumpEnergy = params.pumpEnergyJoules ?? 150;
  const flashDuration = params.flashDurationMs ?? 1.0;
  const rodLength = params.rodLengthCm ?? 5.0;
  const outputReflectivity = params.outputMirrorReflectivity ?? 0.92;
  const temperature = params.crystalTemperatureKelvin ?? 300;

  const live = useLiveSimParams({
    pumpEnergyJoules: pumpEnergy,
    flashDurationMs: flashDuration,
    rodLengthCm: rodLength,
    outputMirrorReflectivity: outputReflectivity,
    crystalTemperatureKelvin: temperature,
  });

  const studioRef = useRef<StudioContext | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const metrics = stepMaimanRubyLaser({
    pumpEnergyJoules: pumpEnergy,
    flashDurationMs: flashDuration,
    rodLengthCm: rodLength,
    outputMirrorReflectivity: outputReflectivity,
    crystalTemperatureKelvin: temperature,
  });

  const handleTriggerFlash = () => {
    setIsFiring(true);
    isFiringRef.current = true;
    setTimeout(() => {
      setIsFiring(false);
      isFiringRef.current = false;
    }, 700);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const iso = CAMERA_PRESETS.iso;
    const studio = createThreeStudioScene({
      container,
      cameraPos: iso.pos,
      targetPos: iso.target,
    });
    studioRef.current = studio;

    const laserModel = createMaimanRubyLaserModel();
    studio.scene.add(laserModel.nodes.group);

    let animId = 0;
    let frame = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      frame += 1;
      const time = frame / 60;
      const p = live.current;

      laserModel.update(
        {
          pumpEnergyJoules: p.pumpEnergyJoules,
          flashDurationMs: p.flashDurationMs,
          rodLengthCm: p.rodLengthCm,
          outputMirrorReflectivity: p.outputMirrorReflectivity,
          crystalTemperatureKelvin: p.crystalTemperatureKelvin,
        },
        time,
        isFiringRef.current,
      );

      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      laserModel.dispose();
      studio.dispose();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-950 p-4 shadow-2xl">
      <div
        className="relative h-[480px] w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-950"
        ref={containerRef}
      >
        {showUiOverlay && (
          <div className="absolute top-4 left-4 z-10 pointer-events-none rounded-md border border-slate-800/80 bg-slate-900/80 px-3 py-2 backdrop-blur-md">
            <div className="font-mono text-xs font-bold text-slate-200">
              MAIMAN RUBY LASER 3D STUDIO (US 3,353,115)
            </div>
            <div className="text-[11px] text-slate-400">
              Interactive WebGL 3D Model • Synthetic Ruby Cylinder • Coiled Helical Flashlamp
            </div>
          </div>
        )}

        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {showUiOverlay && (
            <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md p-1 rounded-lg border border-slate-700">
              {(
                [
                  ["iso", "ISO"],
                  ["ruby_rod", "Ruby Rod"],
                  ["flashlamp", "Flashlamp"],
                  ["resonator", "Resonator"],
                  ["top", "Top"],
                ] as [CameraPreset, string][]
              ).map(([preset, label]) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => applyCameraPreset(preset)}
                  className={`px-2 py-1 text-xs font-sans rounded transition-colors ${
                    activeCamera === preset
                      ? "bg-rose-600 text-white font-semibold shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            title={showUiOverlay ? "Hide HUD" : "Show HUD"}
            className="p-1.5 rounded-lg text-xs bg-slate-900/80 text-slate-400 hover:text-white border border-slate-700 transition-colors backdrop-blur-md"
          >
            <Zap className={`w-4 h-4 ${showUiOverlay ? "text-rose-400" : "text-slate-500"}`} />
          </button>
        </div>

        {showUiOverlay && isFiring && metrics.isLasing && (
          <div className="absolute bottom-4 left-4 z-10 pointer-events-none animate-pulse rounded-md border border-rose-500/60 bg-rose-950/80 px-3 py-1.5 font-mono text-xs font-bold text-rose-300 backdrop-blur-md">
            ⚡ STIMULATED EMISSION PULSE ACTIVE (694.3 nm)
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-800/80 bg-slate-900/50 p-4">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-col gap-1">
            <label htmlFor="pumpEnergy3d" className="text-xs font-mono text-slate-400">
              Pump Energy: {pumpEnergy} J
            </label>
            <input
              id="pumpEnergy3d"
              type="range"
              min="50"
              max="500"
              step="10"
              value={pumpEnergy}
              onChange={(e) => updateParam("pumpEnergyJoules", Number(e.target.value))}
              className="h-1.5 w-36 accent-rose-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="outputMirror3d" className="text-xs font-mono text-slate-400">
              Output Coupler R2: {(outputReflectivity * 100).toFixed(0)}%
            </label>
            <input
              id="outputMirror3d"
              type="range"
              min="0.70"
              max="0.98"
              step="0.01"
              value={outputReflectivity}
              onChange={(e) => updateParam("outputMirrorReflectivity", Number(e.target.value))}
              className="h-1.5 w-32 accent-rose-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="temp3d" className="text-xs font-mono text-slate-400">
              Temperature: {temperature} K
            </label>
            <input
              id="temp3d"
              type="range"
              min="100"
              max="350"
              step="10"
              value={temperature}
              onChange={(e) => updateParam("crystalTemperatureKelvin", Number(e.target.value))}
              className="h-1.5 w-28 accent-rose-500"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleTriggerFlash}
          disabled={isFiring}
          className={`flex items-center gap-2 rounded-md px-6 py-2.5 font-mono text-xs font-bold transition ${
            isFiring
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/50"
              : "bg-rose-600 text-white hover:bg-rose-500 active:scale-95 shadow-lg shadow-rose-600/30"
          }`}
        >
          {isFiring ? "⚡ FLASH DISCHARGE ACTIVE" : "⚡ TRIGGER FLASH DISCHARGE"}
        </button>
      </div>
    </div>
  );
}
