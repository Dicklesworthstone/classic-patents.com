"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX, Zap } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { FrankenSimEngine } from "@/physics/engine";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
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
  const { params } = usePatentPhysics("us-2524035-bardeen-transistor");
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

    const { scene, camera, renderer } = studio;

    const { rootGroup, nodes, materials, dispose } = buildBardeenTransistorModel();
    scene.add(rootGroup);

    let reqId: number;
    let timeSec = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const dt = 1 / 60;
      timeSec += dt;
      const p = live.current;

      updateBardeenTransistorKinematics(
        nodes,
        materials,
        dt,
        timeSec,
        p.gapStudioUnits,
        p.holeDriftSpeed,
        p.showHoleDrift,
        p.isCutaway ?? false,
      );

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
    <div className="relative w-full h-[620px] bg-parchment-900 rounded-2xl overflow-hidden border border-parchment-700 shadow-2xl flex flex-col">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-parchment-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-parchment-100 uppercase tracking-wider">
            Bardeen Point-Contact Transistor 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 2,524,035 (1950)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["apex", "Point Contacts"],
              ["band", "Energy Bands"],
              ["spring", "Cantilever Spring"],
              ["base", "Base Platen"],
              ["top", "Top"],
            ] as [CameraPreset, string][]
          ).map(([preset, label]) => (
            <button
              key={preset}
              type="button"
              onClick={() => applyCameraPreset(preset)}
              className={`px-2.5 py-1 text-xs font-sans rounded-lg transition-colors ${
                activeCamera === preset
                  ? "bg-amber-600 text-white font-semibold shadow-sm"
                  : "text-parchment-300 hover:text-white hover:bg-parchment-800/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Solid Crystal" : "Cutaway Crystal"}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-sans rounded-lg transition-colors ${
              isCutaway
                ? "bg-amber-600/30 text-amber-200 border border-amber-500/40"
                : "text-parchment-300 hover:text-white hover:bg-parchment-800/60"
            }`}
          >
            {isCutaway ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isCutaway ? "Cutaway" : "Solid"}</span>
          </button>

          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            <Zap className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      <StudioKernelChips
        visible={showUiOverlay}
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
