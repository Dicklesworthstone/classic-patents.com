"use client";

import { Camera, Zap } from "lucide-react";
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
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

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

        {/* Camera Views Bar */}
        {showUiOverlay && (
          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-1.5rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> View:
            </span>
            {(["overview", "bulb", "galvanometer", "regulation"] as CameraPreset[]).map(
              (preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setView(preset)}
                  className={`px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
                    activePreset === preset
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-ink-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                  }`}
                >
                  {preset}
                </button>
              ),
            )}
          </div>
        )}

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                Regulator:
              </span>
              <span
                className={`font-bold ${
                  sim.regulatorState === "nominal"
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-amber-800 dark:text-amber-400"
                }`}
              >
                {sim.regulatorState === "nominal" ? "BALANCED (0°)" : "TRIP ACTIVE"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Thermionic Current:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {sim.emissionCurrentMicroAmps.toFixed(1)} µA
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Cathode Temp:</span>
              <span className="text-rose-700 dark:text-rose-400 font-bold">
                {sim.filamentTemperatureK} K
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Galvo Deflection:</span>
              <span className="text-sky-800 dark:text-sky-400 font-bold">
                {sim.galvoDeflectionDeg.toFixed(1)}°
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Mains Voltage:</span>
              <span className="text-cyan-800 dark:text-cyan-400 font-bold">
                {sim.mainsVoltageV} V
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
