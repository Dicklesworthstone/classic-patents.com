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

  const { params } = usePatentPhysics("us-727650-linde-air-liquefaction");
  const linde = FrankenSimEngine.stepLindeAirLiquefaction();
  const highPressureAtm =
    params.inletPressureAtm ?? params.highPressureAtm ?? linde.highPressureAtm;

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

    // Diagrammatic model of the named apparatus. It does not recreate a
    // measured installation or infer unprinted construction details.
    const liquefierModel: LindeLiquefactionModelResult = buildLindeLiquefactionModel();
    scene.add(liquefierModel.root);

    // Animation Loop
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
        delta,
        timeSec,
        p.highPressureAtm,
        Boolean(p.showFlowTracer),
        Boolean(p.cutawayMode),
      );

      controls.update();
      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      liquefierModel.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="relative w-full h-[620px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/60 shadow-lg pointer-events-auto">
          <Wind className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-slate-100 uppercase tracking-wider">
            Linde apparatus diagram, source-bounded 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            US Patent 727,650 (1903)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Overview"],
              ["counter_current_apparatus", "G′ exchanger"],
              ["regulating_valve", "N / R′"],
              ["vessel_v_prime", "V′ vessel"],
              ["regulator", "Regulator"],
              ["top", "Top"],
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
            title={cutawayMode ? "Switch to Solid Shell" : "Switch to Cutaway Shell"}
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
            onClick={() => setShowFlowTracer(!showFlowTracer)}
            title={
              showFlowTracer ? "Hide illustrative flow tracer" : "Show illustrative flow tracer"
            }
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              showFlowTracer
                ? "bg-cyan-600 text-white font-semibold shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Wind className="w-4 h-4" />
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
        title="US 727,650 source conditions"
        chips={[
          { label: "p² high", value: `${linde.highPressureAtm} atmospheres` },
          { label: "p′ low", value: `${linde.lowPressureAtm} atmospheres` },
          { label: "t³ after K", value: `about ${linde.coolerOutletC} °C or less` },
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
