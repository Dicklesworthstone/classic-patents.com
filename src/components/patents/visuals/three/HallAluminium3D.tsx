"use client";

import { Camera, Zap } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { stepHallAluminium } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { createHallAluminiumModel, updateHallAluminiumVisual } from "./hallAluminiumModel";
import { createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

type CameraPreset = "overview" | "anodes" | "molten_bath" | "siphon_tap";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  overview: { pos: [0, 3.2, 4.8], target: [0, 0, 0] },
  anodes: { pos: [0, 2.0, 2.6], target: [0, 0.5, 0] },
  molten_bath: { pos: [0, 0.9, 3.2], target: [0, -0.2, 0] },
  siphon_tap: { pos: [2.6, 0.6, 2.2], target: [1.8, -0.5, 0] },
};

export function HallAluminium3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePreset, setActivePreset] = useState<CameraPreset>("overview");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);

  const { params, updateParam } = usePatentPhysics("us-400766-hall-aluminium");

  const currentAmperes = (params.currentAmperes as number) ?? 300000;
  const bathTemperatureCelsius = (params.bathTemperatureCelsius as number) ?? 960;
  const aluminaConcentrationPct = (params.aluminaConcentrationPct as number) ?? 5.5;

  const sim = useMemo(() => {
    return stepHallAluminium({
      currentAmperes,
      bathTemperatureCelsius,
      aluminaConcentrationPct,
    });
  }, [currentAmperes, bathTemperatureCelsius, aluminaConcentrationPct]);

  const live = useLiveSimParams({
    currentAmperes,
    bathTemperatureCelsius,
    aluminaConcentrationPct,
  });

  const studioRef = useRef<ReturnType<typeof createThreeStudioScene> | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const overview = CAMERA_PRESETS.overview;
    const studio = createThreeStudioScene({
      container,
      cameraPos: overview.pos,
      targetPos: overview.target,
    });
    studioRef.current = studio;

    const model = createHallAluminiumModel();
    studio.scene.add(model.root);

    let rafId = 0;
    let virtualTime = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      virtualTime += 1 / 60;
      const currentSim = stepHallAluminium(live.current);

      updateHallAluminiumVisual(
        model,
        {
          currentAmperes: currentSim.currentAmperes,
          bathTemperatureCelsius: currentSim.bathTemperatureCelsius,
          totalCellVoltage: currentSim.totalCellVoltage,
          aluminiumProductionRateKgPerHour: currentSim.aluminiumProductionRateKgPerHour,
        },
        virtualTime,
      );

      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      studio.dispose();
      studioRef.current = null;
    };
  }, [live]);

  const setView = (preset: CameraPreset) => {
    setActivePreset(preset);
    const targetPreset = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(targetPreset.pos, targetPreset.target);
  };

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Charles Martin Hall Aluminium Reduction 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-14rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3.5 h-3.5" /> View:
            </span>
            {(["overview", "anodes", "molten_bath", "siphon_tap"] as CameraPreset[]).map(
              (preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setView(preset)}
                  className={`px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
                    activePreset === preset
                      ? "bg-amber-600 text-white shadow-xs font-semibold"
                      : "text-ink-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                  }`}
                >
                  {preset.replace("_", " ")}
                </button>
              ),
            )}
          </div>
        )}

        {/* Top-Right Action Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap justify-end gap-1.5 sm:gap-2 max-w-[90%]">
          <button
            type="button"
            onClick={() => setShowUiOverlay((prev) => !prev)}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              showUiOverlay
                ? "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
                : "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-600"
            }`}
            title={showUiOverlay ? "Hide Overlay Telemetry" : "Show Overlay Telemetry"}
            aria-label={showUiOverlay ? "Hide Overlay Telemetry" : "Show Overlay Telemetry"}
          >
            <Zap className="w-3.5 h-3.5 inline sm:mr-1" />
            <span className="hidden md:inline">{showUiOverlay ? "Hide HUD" : "Show HUD"}</span>
          </button>
        </div>

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">Yield:</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                {sim.currentEfficiencyPct}% Faradaic Yield
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Current:</span>
              <span className="text-cyan-800 dark:text-cyan-400 font-bold">
                {(sim.currentAmperes / 1000).toFixed(0)} kA
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Cell Voltage:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {sim.totalCellVoltage} V
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Production Rate:</span>
              <span className="text-cyan-800 dark:text-cyan-400 font-bold">
                {sim.aluminiumProductionRateKgPerHour} kg/h
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Bath Temp:</span>
              <span className="text-rose-700 dark:text-rose-400 font-bold">
                {sim.bathTemperatureCelsius} °C
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Cell DC Current</span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {(currentAmperes / 1000).toFixed(0)} kA
              </span>
            </div>
            <input
              type="range"
              min="100000"
              max="500000"
              step="10000"
              value={currentAmperes}
              onChange={(e) => updateParam("currentAmperes", Number.parseInt(e.target.value, 10))}
              className="w-full accent-cyan-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Cryolite Bath Temp</span>
              <span className="text-rose-700 dark:text-rose-400 font-mono font-bold">
                {bathTemperatureCelsius} °C
              </span>
            </div>
            <input
              type="range"
              min="920"
              max="1020"
              step="5"
              value={bathTemperatureCelsius}
              onChange={(e) =>
                updateParam("bathTemperatureCelsius", Number.parseInt(e.target.value, 10))
              }
              className="w-full accent-rose-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Alumina (Al₂O₃) Conc
              </span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {aluminaConcentrationPct}%
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="8"
              step="0.5"
              value={aluminaConcentrationPct}
              onChange={(e) =>
                updateParam("aluminaConcentrationPct", Number.parseFloat(e.target.value))
              }
              className="w-full accent-amber-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HallAluminium3D;
