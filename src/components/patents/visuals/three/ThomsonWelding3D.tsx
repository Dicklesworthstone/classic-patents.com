"use client";

import { Camera, Eye, EyeOff, Flame, Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepThomsonWelding } from "@/physics/catalogKernels";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { createStudioClock } from "@/physics/tickScheduler";
import {
  globalTransportBus,
  type TapeUpdater,
  useFrankenSimPhysics,
} from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { buildThomsonWeldingModel, updateThomsonWeldingKinematics } from "./thomsonWeldingModel";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset =
  | "iso"
  | "weld_junction"
  | "transformer_core"
  | "copper_clamps"
  | "compression_screw"
  | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [9.5, 7.0, 11.0], target: [0, 0, 0] },
  weld_junction: { pos: [0, 1.2, 3.2], target: [0, 0.4, 0] },
  transformer_core: { pos: [0, -1.0, 4.0], target: [0, -1.2, 0] },
  copper_clamps: { pos: [2.4, 1.5, 3.0], target: [0.8, 0.4, 0] },
  compression_screw: { pos: [3.8, 1.0, 2.2], target: [2.4, 0.4, 0] },
  top: { pos: [0, 12.0, 0.1], target: [0, 0, 0] },
};

/** Fields the render loop consumes from each welding kernel step. */
interface ThomsonWeldPose {
  jouleKw: number;
  interfaceTempC: number;
  weldGlowIntensity: number;
  weldSeamScale: number;
  jawStudioOffset: number;
}

export function ThomsonWelding3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // Electrical Resistance Welding Parameters
  const { params, updateParam } = usePatentPhysics("us-347140-thomson-welding");
  const weldCurrentAmps =
    (params.weldCurrentAmps as number) ?? (params.currentAmperes as number) ?? 4500;
  const clampPressureMpa = (params.clampPressureMpa as number) ?? 35;
  const weld = stepThomsonWelding({
    weldCurrentAmps,
    clampPressureMpa,
  });
  const weldTempCelsius = weld.interfaceTempC;
  const weldPowerKw = weld.jouleKw.toFixed(1);
  const [showSparks, setShowSparks] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  const live = useLiveSimParams({
    weldCurrentAmps,
    clampPressureMpa,
    weldTempCelsius,
    jouleKw: weld.jouleKw,
    isForged: weld.isForged ? 1 : 0,
    upsetBurrWidthMm: weld.upsetBurrWidthMm,
    weldGlowIntensity: weld.weldGlowIntensity,
    weldSeamScale: weld.weldSeamScale,
    jawStudioOffset: weld.jawStudioOffset,
    showSparks,
    isAudioMuted,
    isCutaway,
  });

  // Shared transport tape: Joule/forge state publishes to the patentId-keyed bus.
  useFrankenSimPhysics("us-347140-thomson-welding", {
    domain: "thermodynamics_transport",
    refusal: { isRefused: false },
  });
  const thomsonWeldRef = useRef<ThomsonWeldPose | null>(null);

  useEffect(() => {
    const integrate: TapeUpdater = (_prev) => {
      const out = stepThomsonWelding({
        weldCurrentAmps: live.current.weldCurrentAmps,
        clampPressureMpa: live.current.clampPressureMpa,
      });
      thomsonWeldRef.current = out;
      return {
        thermo: {
          temperatureCelsius: out.interfaceTempC,
          temperatureKelvin: out.interfaceTempC + 273.15,
          pressureAtm: 0,
          partialPressureButaneAtm: 0,
          heatInputWatts: out.jouleWatts,
          coolingPowerWatts: 0,
          coefficientOfPerformance: 0,
          blackbodyRadiantPowerWatts: 0,
          fluidFlowVelocityMps: 0,
        },
      };
    };
    globalTransportBus.registerUpdater("us-347140-thomson-welding", integrate, "TS_FALLBACK");
    return () => globalTransportBus.unregisterUpdater("us-347140-thomson-welding");
  }, [live]);
  const studioRef = useRef<StudioContext | null>(null);

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

    const { rootGroup, nodes, materials, dispose } = buildThomsonWeldingModel();
    scene.add(rootGroup);

    // Animation Loop
    let reqId: number;

    const clock = createStudioClock();

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const { dt } = clock.pump(now);
      const p = live.current;
      // Bus-owned kernel step: prefer the latest shared-tape weld state.
      const w = thomsonWeldRef.current;
      updateThomsonWeldingKinematics(
        nodes,
        materials,
        dt,
        w ? w.jouleKw : p.jouleKw,
        w ? w.interfaceTempC : p.weldTempCelsius,
        w ? w.weldGlowIntensity : p.weldGlowIntensity,
        w ? w.weldSeamScale : p.weldSeamScale,
        w ? w.jawStudioOffset : p.jawStudioOffset,
        p.showSparks,
        p.isCutaway,
        p.weldCurrentAmps,
        p.clampPressureMpa,
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
      <div className="sr-only">Thomson Butt-Welder 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-9.5rem)] sm:max-w-[calc(100%-28rem)] gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3.5 h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["weld_junction", "Weld Seam"],
                ["transformer_core", "Transformer"],
                ["copper_clamps", "Clamping Jaws"],
                ["compression_screw", "Screw"],
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

        {/* Top Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Solid Mode" : "Cutaway Machine Bed"}
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
            onClick={() => setShowSparks(!showSparks)}
            title={showSparks ? "Hide Sparks" : "Show Sparks"}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm text-xs font-sans flex items-center gap-1 ${
              showSparks
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            <Flame className="w-4 h-4" />
            <span className="hidden sm:inline">Sparks</span>
          </button>

          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
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
                Weld Current:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {Math.round(weldCurrentAmps)} A
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Joule Heat Rate:</span>
              <span className="font-bold text-cyan-800 dark:text-cyan-400">{weldPowerKw} kW</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Interface Temp:</span>
              <span className="font-bold text-rose-700 dark:text-rose-400">
                {weldTempCelsius}°C
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Upset Pressure:</span>
              <span className="font-bold text-purple-800 dark:text-purple-400">
                {clampPressureMpa} MPa
              </span>
            </div>
          </div>
        )}

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="Thomson resistance butt-welder"
          chips={[
            { label: "Current", value: String(Math.round(weldCurrentAmps)), unit: "A" },
            { label: "Power", value: weldPowerKw, unit: "kW" },
            {
              label: "Interface",
              value: String(weldTempCelsius),
              unit: "°C",
              tone: weld.isForged ? "hot" : "ok",
            },
            { label: "Pressure", value: String(clampPressureMpa), unit: "MPa" },
            { label: "State", value: weld.isForged ? "forged" : "heating" },
            { label: "Burr", value: String(weld.upsetBurrWidthMm), unit: "mm" },
            { label: "Pulse", value: String(weld.weldPulseMs), unit: "ms" },
            {
              label: "HAZ crate",
              value: crateSource === "wasm" ? "fs-sparse" : "ts-heat-fallback",
            },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Secondary Welding Current
              </span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {Math.round(weldCurrentAmps)} A
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="6000"
              step="100"
              value={weldCurrentAmps}
              onChange={(e) => updateParam("weldCurrentAmps", Number.parseInt(e.target.value, 10))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Mechanical Upset Pressure
              </span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {clampPressureMpa} MPa
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              step="5"
              value={clampPressureMpa}
              onChange={(e) => updateParam("clampPressureMpa", Number.parseInt(e.target.value, 10))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>
        </div>

        <ClaimConstraintToggle
          patentId="us-347140-thomson-welding"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-347140-thomson-welding"
          params={params}
          className="mt-3"
        />
      </div>
    </div>
  );
}
