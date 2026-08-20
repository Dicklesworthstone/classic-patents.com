"use client";

import { Camera, Eye, EyeOff, Volume2, VolumeX, Waves, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FrankenSimEngine } from "@/physics/engine";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import {
  buildCarrierAirConditionerModel,
  updateCarrierAirConditionerKinematics,
} from "./carrierAirConditionerModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset =
  | "iso"
  | "spray_chamber"
  | "baffle_plates"
  | "blower_fan"
  | "pump_sump"
  | "dampers";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [9.5, 6.5, 10.5], target: [0, 0, 0] },
  spray_chamber: { pos: [-2.2, 1.8, 3.2], target: [-1.8, 0.4, 0] },
  baffle_plates: { pos: [1.2, 1.8, 2.8], target: [0.6, 0.4, 0] },
  blower_fan: { pos: [4.2, 1.8, 3.5], target: [3.2, 0.4, 0] },
  pump_sump: { pos: [-2.4, -0.6, 3.5], target: [-1.8, -1.1, 0.8] },
  dampers: { pos: [-5.5, 1.5, 2.5], target: [-4.0, 0.4, 0] },
};

export function CarrierAirConditioner3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [cutawayMode, setCutawayMode] = useState<boolean>(true);

  // Psychrometric Air Treatment Parameters from Physics Bus
  const { params } = usePatentPhysics("us-808897-carrier-air-conditioner");
  const airflowCfm = params.airflowCfm ?? 15000;
  const sprayWaterTempC = params.sprayWaterTempC ?? 8;
  const [showSprayMist, setShowSprayMist] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const carrier = FrankenSimEngine.stepCarrierAirConditioner({
    inletTempC: params.inletTempC ?? 35,
    inletRhPct: params.inletRhPct ?? 75,
    sprayWaterTempC,
    reheatTempC: params.reheatTempC ?? 22,
    airflowCfm,
  });

  const live = useLiveSimParams({
    airflowCfm,
    sprayWaterTempC,
    showSprayMist,
    cutawayMode,
    isAudioMuted,
    dewPointInC: carrier.dewPointInC,
    moistureRemovedGPerKg: carrier.moistureRemovedGPerKg,
    finalAirTempC: carrier.finalAirTempC,
    finalRhPct: carrier.finalRhPct,
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

    const { root, nodes, materials, dispose } = buildCarrierAirConditionerModel();
    scene.add(root);

    // Animation Loop
    let reqId: number;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const dt = 1 / 60;
      const p = live.current;

      updateCarrierAirConditionerKinematics(
        nodes,
        materials,
        dt,
        p.airflowCfm,
        p.sprayWaterTempC,
        p.showSprayMist,
        p.cutawayMode,
      );

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="relative w-full h-[620px] bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent flex flex-col">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-parchment-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto text-parchment-100">
          <Waves className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-parchment-100 uppercase tracking-wider">
            Carrier Psychrometric Dew-Point 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            US Patent 808,897 (1906)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Overview"],
              ["spray_chamber", "Spray Chamber"],
              ["baffle_plates", "Eliminator Baffles"],
              ["blower_fan", "Centrifugal Fan"],
              ["pump_sump", "Pump & Sump"],
              ["dampers", "Dampers"],
            ] as [CameraPreset, string][]
          ).map(([preset, label]) => (
            <button
              key={preset}
              type="button"
              onClick={() => applyCameraPreset(preset)}
              className={`px-2.5 py-1 text-xs font-sans rounded-lg transition-colors ${
                activeCamera === preset
                  ? "bg-cyan-600 text-white font-semibold shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60 shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={() => setCutawayMode(!cutawayMode)}
            title={cutawayMode ? "Switch to Solid Shell" : "Switch to Cutaway View"}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              cutawayMode
                ? "bg-cyan-600 text-white font-semibold shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            {cutawayMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setShowSprayMist(!showSprayMist)}
            title={showSprayMist ? "Hide Atomized Mist" : "Show Atomized Mist"}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              showSprayMist
                ? "bg-cyan-600 text-white font-semibold shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Waves className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className="p-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Zap className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>

      <StudioKernelChips
        visible={showUiOverlay}
        title="Carrier Psychrometric Apparatus"
        chips={[
          { label: "Airflow", value: `${airflowCfm.toLocaleString()} CFM` },
          { label: "Spray Water", value: `${sprayWaterTempC.toFixed(1)} °C` },
          { label: "Inlet Dew Point", value: `${carrier.dewPointInC.toFixed(1)} °C` },
          { label: "Final Temp", value: `${carrier.finalAirTempC.toFixed(1)} °C` },
          { label: "Final RH", value: `${carrier.finalRhPct}%` },
          {
            label: "Moisture Extr.",
            value: `${carrier.moistureRemovedGPerKg.toFixed(1)} g/kg`,
          },
        ]}
      />
    </div>
  );
}
