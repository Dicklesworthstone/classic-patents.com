"use client";

import { Eye, EyeOff } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { stepEdisonIndicator } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { buildEdisonIndicatorModel } from "./edisonIndicatorModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

type CameraPreset = "overview" | "bulb" | "galvanometer" | "regulation";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  overview: { pos: [0, 2.2, 3.8], target: [0, 0.9, 0] },
  bulb: { pos: [-1.1, 1.2, 2.0], target: [-1.1, 1.15, 0] },
  galvanometer: { pos: [1.0, 1.3, 2.0], target: [1.0, 1.25, 0] },
  regulation: { pos: [1.0, 1.9, 1.4], target: [1.0, 1.8, 0] },
};

export default function EdisonIndicator3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [activePreset, setActivePreset] = useState<CameraPreset>("overview");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);

  const { params } = usePatentPhysics("us-307031-edison-indicator");

  const mainsVoltage = (params.mainsVoltageV as number) ?? 110;
  const plateBias = (params.plateBiasPolarity as number) ?? 1;
  const nullRefVoltage = (params.galvanometerTorsionNullV as number) ?? 110;

  const sim = useMemo(() => {
    return stepEdisonIndicator({
      mainsVoltageV: mainsVoltage,
      plateBiasPolarity: plateBias,
      galvanometerTorsionNullV: nullRefVoltage,
    });
  }, [mainsVoltage, plateBias, nullRefVoltage]);

  const live = useLiveSimParams(sim);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: CAMERA_PRESETS.overview.pos,
      targetPos: CAMERA_PRESETS.overview.target,
      environmentStyle: "studio",
    });
    studioRef.current = studio;
    const model = buildEdisonIndicatorModel();
    studio.scene.add(model.root);

    let rafId = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const currentSim = live.current;
      model.update({
        filamentTemperatureK: currentSim.filamentTemperatureK,
        galvoDeflectionDeg: currentSim.galvoDeflectionDeg,
        plateBiasPolarity: currentSim.plateBiasPolarity,
        mainsVoltageV: currentSim.mainsVoltageV,
      });
      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      model.dispose();
      studio.dispose();
      studioRef.current = null;
    };
  }, [live]);

  const setView = (preset: CameraPreset) => {
    setActivePreset(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
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
          {(["overview", "bulb", "galvanometer", "regulation"] as CameraPreset[]).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setView(preset)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold capitalize transition-all cursor-pointer ${
                activePreset === preset
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-parchment-300 hover:bg-ink-800 hover:text-white"
              }`}
            >
              {preset}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowUiOverlay((prev) => !prev)}
          className="p-2 rounded-xl bg-ink-900/85 hover:bg-ink-800 text-parchment-300 hover:text-white border border-ink-700 backdrop-blur-md transition-colors shadow-md cursor-pointer"
          title={showUiOverlay ? "Hide Overlay HUD" : "Show Overlay HUD"}
          aria-label={showUiOverlay ? "Hide Overlay HUD" : "Show Overlay HUD"}
        >
          {showUiOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {/* Bottom-Left Real-Time SI Telemetry HUD (Pointer Events None) */}
      {showUiOverlay && (
        <div className="absolute bottom-4 left-4 z-10 pointer-events-none max-w-sm w-full">
          <div className="bg-ink-950/85 backdrop-blur-md p-4 rounded-2xl border border-ink-800 shadow-2xl text-parchment-100 space-y-3">
            <div className="flex items-center justify-between border-b border-ink-800 pb-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-amber-400">
                Edison Thermionic HUD
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                  sim.regulatorState === "nominal"
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                    : sim.regulatorState === "high_voltage_trip"
                      ? "bg-red-950 text-red-300 border border-red-800 animate-pulse"
                      : "bg-blue-950 text-blue-300 border border-blue-800 animate-pulse"
                }`}
              >
                {sim.regulatorState === "nominal"
                  ? "Balanced (0°)"
                  : sim.regulatorState === "high_voltage_trip"
                    ? "Over-V Trip (+)"
                    : "Under-V Trip (-)"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded-lg bg-ink-900/80 border border-ink-800">
                <div className="text-[9px] text-ink-400">Thermionic Current</div>
                <div className="text-sm font-bold text-amber-400">
                  {sim.emissionCurrentMicroAmps.toFixed(1)} µA
                </div>
              </div>
              <div className="p-2 rounded-lg bg-ink-900/80 border border-ink-800">
                <div className="text-[9px] text-ink-400">Cathode Temp</div>
                <div className="text-sm font-bold text-orange-400">
                  {sim.filamentTemperatureK} K
                </div>
              </div>
              <div className="p-2 rounded-lg bg-ink-900/80 border border-ink-800">
                <div className="text-[9px] text-ink-400">Needle Deflection</div>
                <div className="text-sm font-bold text-indigo-400">
                  {sim.galvoDeflectionDeg > 0 ? "+" : ""}
                  {sim.galvoDeflectionDeg.toFixed(1)}°
                </div>
              </div>
              <div className="p-2 rounded-lg bg-ink-900/80 border border-ink-800">
                <div className="text-[9px] text-ink-400">Mains Voltage</div>
                <div className="text-sm font-bold text-cyan-400">{sim.mainsVoltageV} V</div>
              </div>
            </div>

            <p className="text-[10px] font-serif text-ink-400 italic leading-snug">
              Drag to orbit 3D model · Scroll to zoom · Use camera presets above to inspect vacuum
              diode and galvanometer.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
