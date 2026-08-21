"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { FrankenSimEngine } from "@/physics/engine";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { TickScheduler } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import {
  buildBardeenTransistorModel,
  updateBardeenTransistorKinematics,
} from "./bardeenTransistorModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "apex" | "band" | "spring" | "base" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [10, 8, 12], target: [0, 0.5, 0] },
  apex: { pos: [0, 1.2, 3.2], target: [0, 0.4, 0] },
  band: { pos: [0, 7.5, 0.1], target: [0, 0, 0] },
  spring: { pos: [4, 5, 6], target: [0, 1.5, 0] },
  base: { pos: [-5, 2, 4], target: [-2, 0, 1] },
  top: { pos: [0, 12.0, 0.1], target: [0, 0, 0] },
};

export const BardeenTransistor3D = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // Semiconductor Point-Contact State Controls
  const { params, updateParam } = usePatentPhysics("us-2524035-bardeen-transistor");
  const emitterCurrentMa = params.emitterCurrent ?? 1.5;
  const collectorVoltageV = params.collectorBias ?? -40;
  const pointContactGapMicrons = params.pointSpacing ?? 50;
  const [showHoleDrift] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  // Transistor Physics Calculations (FrankenSim Germanium Minority Transport)
  const semiState = FrankenSimEngine.stepBardeenTransistor(
    emitterCurrentMa,
    collectorVoltageV,
    pointContactGapMicrons,
  );

  const alphaCurrentGain = semiState.currentGainAlpha.toFixed(2);
  const collectorCurrentMa = semiState.collectorCurrentMa.toFixed(2);
  const voltageGain = semiState.voltageGain;
  const powerGainDb = semiState.powerGainDb;

  const live = useLiveSimParams({
    collectorVoltageV,
    showHoleDrift,
    currentGainAlpha: semiState.currentGainAlpha,
    holeDiffusion: semiState.holeDiffusionCoefficientCm2ps,
    holeDriftSpeed: semiState.holeDriftSpeed ?? 0,
    gapStudioUnits: semiState.gapStudioUnits ?? 0,
    isCutaway,
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
    void ensureGenericWasm().then((next) => setCrateSource(next));
  }, []);

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

    const { rootGroup, nodes, materials, dispose } = buildBardeenTransistorModel();
    scene.add(rootGroup);

    // Animation Loop
    let reqId: number;
    let simTimeSec = 0;
    const sched = new TickScheduler(1 / 60, 0);
    let lastMs: number | undefined;

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      const dt = lastMs !== undefined ? Math.min((now - lastMs) / 1000, 0.1) : 1 / 60;
      lastMs = now;
      sched.pump(now / 1000, () => {
        simTimeSec += 1 / 60;
      });
      const p = live.current;

      updateBardeenTransistorKinematics(
        nodes,
        materials,
        dt,
        Math.floor(simTimeSec * 60),
        p.gapStudioUnits,
        p.holeDriftSpeed,
        p.showHoleDrift,
        p.isCutaway ?? false,
      );

      controls.update();
      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">John Bardeen & Walter Brattain Point-Contact Transistor 3D</div>
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
                ["iso", "Isometric"],
                ["apex", "Point Contacts"],
                ["band", "Energy Bands"],
                ["spring", "Cantilever Spring"],
                ["base", "Base Platen"],
                ["top", "Plan View"],
              ] as [CameraPreset, string][]
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyCameraPreset(preset)}
                className={`px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
                  activeCamera === preset
                    ? "bg-amber-600 text-white shadow-xs font-semibold"
                    : "text-ink-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Top Right Tool Bar */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Solid Crystal" : "Cutaway Crystal"}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm text-xs font-sans flex items-center gap-1 ${
              isCutaway
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">{isCutaway ? "Cutaway" : "Solid"}</span>
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
                : "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
            }`}
            title={showUiOverlay ? "Hide Overlay UI (Clean 3D View)" : "Show Overlay UI"}
            aria-label={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
          >
            {showUiOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                Current Gain α:
              </span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {alphaCurrentGain}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Collector Current:</span>
              <span className="text-purple-800 dark:text-purple-400 font-bold">
                {collectorCurrentMa} mA
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Power Gain:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                +{powerGainDb.toFixed(1)} dB ({voltageGain.toFixed(1)}×)
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Contact Spacing:</span>
              <span className="text-cyan-800 dark:text-cyan-400 font-bold">
                {pointContactGapMicrons} µm
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
                Emitter Current (I_e)
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                {emitterCurrentMa.toFixed(1)} mA
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.1"
              value={emitterCurrentMa}
              onChange={(e) => updateParam("emitterCurrent", Number.parseFloat(e.target.value))}
              className="w-full accent-emerald-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Collector Bias (V_c)
              </span>
              <span className="text-purple-700 dark:text-purple-400 font-mono font-bold">
                {collectorVoltageV} V
              </span>
            </div>
            <input
              type="range"
              min="-80"
              max="-10"
              step="5"
              value={collectorVoltageV}
              onChange={(e) => updateParam("collectorBias", Number.parseInt(e.target.value, 10))}
              className="w-full accent-purple-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Point Contact Spacing
              </span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {pointContactGapMicrons} µm
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="150"
              step="5"
              value={pointContactGapMicrons}
              onChange={(e) => updateParam("pointSpacing", Number.parseInt(e.target.value, 10))}
              className="w-full accent-cyan-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <StudioKernelChips
        visible={showUiOverlay}
        side="right"
        title="Bardeen point-contact semiconductor transport"
        chips={[
          { label: "Emitter I_e", value: `${emitterCurrentMa}`, unit: "mA" },
          { label: "Collector V_c", value: `${collectorVoltageV}`, unit: "V" },
          { label: "Contact Gap", value: `${pointContactGapMicrons}`, unit: "µm" },
          { label: "Current Gain α", value: alphaCurrentGain, tone: "ok" },
          { label: "Collector I_c", value: collectorCurrentMa, unit: "mA" },
          { label: "Voltage Gain A_v", value: `${voltageGain.toFixed(1)}×` },
          { label: "Power Gain G_p", value: `${powerGainDb.toFixed(1)}`, unit: "dB" },
          {
            label: "Hole crate",
            value: crateSource === "wasm" ? "fs-sparse" : "ts-heat-fallback",
          },
        ]}
      />
    </div>
  );
});
