"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { createKilbyIntegratedCircuitModel, type KilbyModel } from "./kilbyIntegratedCircuitModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

interface Kilby3DProps {
  className?: string;
}

type CameraPreset = "overview" | "transistors" | "wireBonds" | "capacitor";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { label: string; pos: [number, number, number]; target: [number, number, number] }
> = {
  overview: {
    label: "Monolithic Die Overview",
    pos: [0, 6.5, 9.0],
    target: [0, 0.4, 0],
  },
  transistors: {
    label: "Mesa Transistors (T1/T2)",
    pos: [-1.8, 2.5, 3.5],
    target: [-1.8, 0.6, 0],
  },
  wireBonds: {
    label: "Gold Flying Wire Bonds",
    pos: [0, 2.0, 4.0],
    target: [0, 0.8, 0.5],
  },
  capacitor: {
    label: "P-N Junction Capacitor",
    pos: [0, 2.8, 3.0],
    target: [0, 0.6, 0.6],
  },
};

export const KilbyIntegratedCircuit3D: React.FC<Kilby3DProps> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const modelRef = useRef<KilbyModel | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const { isAudioMuted, toggleSound } = usePatentAudio();

  const { params, updateParam } = usePatentPhysics("us-3138743-kilby-integrated-circuit");
  const supplyVoltageV = params.supplyVoltageV ?? 6.0;
  const baseDriveCurrentUa = params.baseDriveCurrentUa ?? 40;
  const reverseBiasVoltageV = params.reverseBiasVoltageV ?? 3.0;
  const resistorLengthUm = params.resistorLengthUm ?? 500;
  const resistorWidthUm = params.resistorWidthUm ?? 50;

  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("overview");

  const live = useLiveSimParams({
    supplyVoltageV,
    baseDriveCurrentUa,
    reverseBiasVoltageV,
    resistorLengthUm,
    resistorWidthUm,
    isCutaway,
  });

  const handlePresetChange = (preset: CameraPreset) => {
    setCameraPreset(preset);
    const targetConfig = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(targetConfig.pos, targetConfig.target);
  };

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

    const model = createKilbyIntegratedCircuitModel({
      substrateMaterial: "germanium",
      ...live.current,
    });
    modelRef.current = model;
    studio.scene.add(model.group);

    const animate = () => {
      timeRef.current += 0.016;
      studio.controls.update();

      model.update(timeRef.current, {
        substrateMaterial: "germanium",
        ...live.current,
      });

      model.setCutaway?.(live.current.isCutaway ?? false);

      studio.renderer.render(studio.scene, studio.camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      model.dispose();
      studio.cleanup();
      studioRef.current = null;
      modelRef.current = null;
    };
  }, [live]);

  return (
    <div
      className={`flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent ${className}`}
    >
      <div className="sr-only">Jack Kilby Monolithic Solid Circuit 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-14rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3.5 h-3.5" /> View:
            </span>
            {(Object.keys(CAMERA_PRESETS) as CameraPreset[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => handlePresetChange(key)}
                className={`px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
                  cameraPreset === key
                    ? "bg-amber-600 text-white shadow-xs font-semibold"
                    : "text-ink-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {CAMERA_PRESETS[key].label}
              </button>
            ))}
          </div>
        )}

        {/* Top-Right Action Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap justify-end gap-1.5 sm:gap-2 max-w-[90%]">
          <button
            type="button"
            onClick={() => {
              toggleSound();
              soundEngine.playSwitchClick();
            }}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            aria-label={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              isCutaway
                ? "bg-cyan-600 text-white border-cyan-700 shadow-md ring-2 ring-cyan-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
            title={isCutaway ? "Solid Germanium Substrate" : "Transparent Substrate Cutaway"}
            aria-label={isCutaway ? "Solid Germanium Substrate" : "Transparent Substrate Cutaway"}
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              showUiOverlay
                ? "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
                : "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-600"
            }`}
            title={showUiOverlay ? "Hide Overlay Telemetry" : "Show Overlay Telemetry"}
            aria-label={showUiOverlay ? "Hide Overlay Telemetry" : "Show Overlay Telemetry"}
          >
            {showUiOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden md:inline">{showUiOverlay ? "Hide HUD" : "Show HUD"}</span>
          </button>

          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => handlePresetChange("overview")}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Bottom-Left Telemetry Banner */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 bg-parchment-50/95 dark:bg-ink-950/95 p-3 rounded-xl border border-parchment-300 dark:border-ink-800 backdrop-blur-md pointer-events-none shadow-md max-w-sm">
            <div className="text-xs font-mono font-bold text-amber-800 dark:text-amber-400">
              US 3,138,743 — Jack Kilby Monolithic Solid Circuit
            </div>
            <div className="text-[10px] font-sans text-ink-600 dark:text-ink-400 mt-0.5">
              Single-Crystal Germanium Bar with Mesa Transistors &amp; Gold Flying Wires
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">DC Supply Voltage</span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {supplyVoltageV.toFixed(1)} V
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="12"
              step="0.5"
              value={supplyVoltageV}
              onChange={(e) => updateParam("supplyVoltageV", Number.parseFloat(e.target.value))}
              className="w-full accent-amber-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Base Drive Current</span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {baseDriveCurrentUa} µA
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={baseDriveCurrentUa}
              onChange={(e) => updateParam("baseDriveCurrentUa", Number.parseFloat(e.target.value))}
              className="w-full accent-cyan-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Capacitor Reverse Bias
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                {reverseBiasVoltageV.toFixed(1)} V
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={reverseBiasVoltageV}
              onChange={(e) =>
                updateParam("reverseBiasVoltageV", Number.parseFloat(e.target.value))
              }
              className="w-full accent-emerald-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Bottom SI Telemetry Chip Strip */}
      <StudioKernelChips
        visible={true}
        title="GERMANIUM MONOLITHIC SOLID CIRCUIT"
        chips={[
          { label: "V_cc", value: `${supplyVoltageV.toFixed(1)}`, unit: "V" },
          { label: "I_base", value: `${baseDriveCurrentUa.toFixed(0)}`, unit: "µA" },
          { label: "V_bias", value: `${reverseBiasVoltageV.toFixed(1)}`, unit: "V" },
          { label: "Substrate", value: "Germanium (Ge)", unit: "single-crystal" },
          { label: "Topology", value: "Phase-Shift Oscillator" },
          { label: "Interconnect", value: "Au Flying Wires" },
        ]}
      />
    </div>
  );
};
