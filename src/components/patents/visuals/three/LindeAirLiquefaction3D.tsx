"use client";

import { Camera, Eye, EyeOff, Volume2, VolumeX, Wind, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FrankenSimEngine } from "@/physics/engine";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import {
  buildLindeLiquefactionModel,
  type LindeLiquefactionModelResult,
  updateLindeLiquefactionKinematics,
} from "./lindeLiquefactionModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset =
  | "iso"
  | "regulating_valve"
  | "counter_current_apparatus"
  | "vessel_v_prime"
  | "regulator"
  | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [7.5, 4.5, 8.5], target: [0, 0, 0] },
  regulating_valve: { pos: [0, -0.8, 3.2], target: [0, -1.6, 0] },
  counter_current_apparatus: { pos: [2.8, 1.8, 3.2], target: [0, 0.8, 0] },
  vessel_v_prime: { pos: [0, -2.0, 3.4], target: [0, -2.4, 0] },
  regulator: { pos: [1.4, 5.0, 3.0], target: [0, 4.2, 0] },
  top: { pos: [0, 9.5, 0.1], target: [0, 0, 0] },
};

export function LindeAirLiquefaction3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [showFlowTracer, setShowFlowTracer] = useState<boolean>(true);
  const [cutawayMode, setCutawayMode] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const { params, updateParam } = usePatentPhysics("us-727650-linde-air-liquefaction");
  const linde = FrankenSimEngine.stepLindeAirLiquefaction();
  const highPressureAtm =
    params.inletPressureAtm ?? params.highPressureAtm ?? linde.highPressureAtm;
  const lowPressureAtm = params.lowPressureAtm ?? linde.lowPressureAtm;
  const coolerOutletC = params.coolerOutletC ?? linde.coolerOutletC;

  const live = useLiveSimParams({
    highPressureAtm,
    showFlowTracer,
    cutawayMode,
    isAudioMuted,
  });

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const toggleSound = () => {
    toggleEngine(() => {
      soundEngine.playSwitchClick();
    });
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

    const { scene, camera, renderer, controls } = studio;

    const liquefierModel: LindeLiquefactionModelResult = buildLindeLiquefactionModel();
    scene.add(liquefierModel.root);

    let reqId: number;
    let timeSec = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = 1 / 60;
      timeSec += delta;
      const p = live.current;

      updateLindeLiquefactionKinematics(
        liquefierModel.nodes,
        liquefierModel.materials,
        timeSec,
        delta,
        p.highPressureAtm,
        p.cutawayMode,
        p.showFlowTracer,
      );

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      liquefierModel.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Linde apparatus diagram, source-bounded 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-14rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Overview"],
                ["counter_current_apparatus", "G′ Exchanger"],
                ["regulating_valve", "N / R′ Valve"],
                ["vessel_v_prime", "V′ Vessel"],
                ["regulator", "Regulator"],
                ["top", "Top"],
              ] as [CameraPreset, string][]
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyCameraPreset(preset)}
                className={`px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
                  activeCamera === preset
                    ? "bg-cyan-600 text-white shadow-xs font-semibold"
                    : "text-ink-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Top-Right Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setCutawayMode(!cutawayMode)}
            title={cutawayMode ? "Switch to Solid Shell" : "Switch to Cutaway Shell"}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm text-xs font-sans flex items-center gap-1 ${
              cutawayMode
                ? "bg-cyan-600 text-white border-cyan-700 shadow-md ring-2 ring-cyan-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            {cutawayMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span className="hidden sm:inline">{cutawayMode ? "Cutaway" : "Solid"}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowFlowTracer(!showFlowTracer)}
            title={
              showFlowTracer ? "Hide illustrative flow tracer" : "Show illustrative flow tracer"
            }
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showFlowTracer
                ? "bg-cyan-600 text-white border-cyan-700 shadow-md ring-2 ring-cyan-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            <Wind className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            aria-label={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showUiOverlay
                ? "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
                : "bg-cyan-600 text-white border-cyan-700 shadow-md ring-2 ring-cyan-500/30"
            }`}
            title={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
            aria-label={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
          >
            <Zap className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                High Pressure p²:
              </span>
              <span className="font-bold text-cyan-700 dark:text-cyan-400">
                {highPressureAtm} atm
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Return Pressure p′:</span>
              <span className="text-emerald-800 dark:text-emerald-400 font-bold">
                {lowPressureAtm} atm
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Pre-Cooler Temp t³:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {coolerOutletC} °C
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
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Inlet High Pressure (p²)
              </span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {highPressureAtm} atm
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="200"
              step="5"
              value={highPressureAtm}
              onChange={(e) => updateParam("highPressureAtm", Number.parseInt(e.target.value, 10))}
              className="w-full accent-cyan-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Return Low Pressure (p′)
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                {lowPressureAtm} atm
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={lowPressureAtm}
              onChange={(e) => updateParam("lowPressureAtm", Number.parseInt(e.target.value, 10))}
              className="w-full accent-emerald-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Pre-Cooler Temperature (t³)
              </span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {coolerOutletC} °C
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="30"
              step="1"
              value={coolerOutletC}
              onChange={(e) => updateParam("coolerOutletC", Number.parseInt(e.target.value, 10))}
              className="w-full accent-amber-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <StudioKernelChips
        visible={showUiOverlay}
        title="US 727,650 source conditions"
        chips={[
          { label: "p² high", value: `${highPressureAtm} atmospheres` },
          { label: "p′ low", value: `${lowPressureAtm} atmospheres` },
          { label: "t³ after K", value: `about ${coolerOutletC} °C or less` },
          {
            label: "G′ construction",
            value: `${linde.counterCurrentLengthM} m suggested`,
            tone: "ok",
          },
          { label: "Boundary", value: "No yield or terminal temperature printed", tone: "warn" },
        ]}
      />
    </div>
  );
}
