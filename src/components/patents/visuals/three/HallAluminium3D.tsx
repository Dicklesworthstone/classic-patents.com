"use client";

import { Eye, EyeOff } from "lucide-react";
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

export default function HallAluminium3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePreset, setActivePreset] = useState<CameraPreset>("overview");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);

  const { params } = usePatentPhysics("us-400766-hall-aluminium");

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
    <div className="relative w-full h-full min-h-[460px] sm:min-h-[540px] bg-ink-950 rounded-2xl overflow-hidden shadow-xl border border-parchment-300 dark:border-ink-800 font-sans select-none">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Top-Right Control Bar: Camera Presets & UI Toggle */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <div className="flex bg-ink-900/85 backdrop-blur-md p-1 rounded-xl border border-ink-700 shadow-md">
          {(["overview", "anodes", "molten_bath", "siphon_tap"] as CameraPreset[]).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setView(preset)}
              className={`px-3 py-1 text-xs font-mono rounded-lg capitalize transition-all cursor-pointer ${
                activePreset === preset
                  ? "bg-cyan-600 text-white font-bold shadow-xs"
                  : "text-parchment-400 hover:text-white"
              }`}
            >
              {preset.replace("_", " ")}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowUiOverlay((prev) => !prev)}
          className="p-2 rounded-xl bg-ink-900/85 backdrop-blur-md border border-ink-700 text-parchment-300 hover:text-white transition-all shadow-md cursor-pointer"
          title={showUiOverlay ? "Hide Telemetry Overlay" : "Show Telemetry Overlay"}
        >
          {showUiOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {/* Bottom-Left Real-Time Telemetry HUD Overlay */}
      {showUiOverlay && (
        <div className="absolute bottom-4 left-4 z-10 max-w-xs sm:max-w-sm bg-ink-950/85 backdrop-blur-md border border-ink-800/80 p-4 rounded-xl shadow-2xl text-xs space-y-2 pointer-events-none">
          <div className="flex items-center justify-between border-b border-ink-800 pb-2">
            <span className="font-mono uppercase tracking-wider text-[11px] text-cyan-400 font-bold">
              US 400,766 · Hall Smelter
            </span>
            <span className="font-mono text-emerald-400 font-bold">
              {sim.currentEfficiencyPct}% Faradaic Yield
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-ink-300 font-mono text-[11px]">
            <div>
              <span className="text-ink-400">Current:</span>{" "}
              <strong className="text-white">{(sim.currentAmperes / 1000).toFixed(0)} kA</strong>
            </div>
            <div>
              <span className="text-ink-400">Cell Voltage:</span>{" "}
              <strong className="text-amber-400">{sim.totalCellVoltage} V</strong>
            </div>
            <div>
              <span className="text-ink-400">Production:</span>{" "}
              <strong className="text-cyan-400">{sim.aluminiumProductionRateKgPerHour} kg/h</strong>
            </div>
            <div>
              <span className="text-ink-400">Bath Temp:</span>{" "}
              <strong className="text-orange-400">{sim.bathTemperatureCelsius} °C</strong>
            </div>
          </div>

          <div className="text-[10px] text-ink-400 pt-1 border-t border-ink-800/60 font-mono">
            ρ(Al) = 2.28 g/cm³ &gt; ρ(Cryolite) = 2.10 g/cm³ (Sunk metal pad)
          </div>
        </div>
      )}
    </div>
  );
}
