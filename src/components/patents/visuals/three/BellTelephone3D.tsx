"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX, Zap } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import { stepBellTelephone } from "@/physics/catalogKernels";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import {
  type BellTelephoneModel,
  buildBellTelephoneModel,
  updateBellTelephoneKinematics,
} from "./bellTelephoneModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset =
  | "iso"
  | "speaking_horn"
  | "liquid_transmitter"
  | "battery_cells"
  | "diaphragm_wire"
  | "top";

export const BellTelephone3D = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  const { params } = usePatentPhysics("us-174465-bell-telephone");
  const acousticFrequencyHz = params.acousticFrequencyHz ?? 440;
  const batteryVoltage = params.batteryVoltage ?? 6.0;
  const liquidConductivity = params.liquidConductivity ?? 1.2;
  const [showAcousticWaves] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  const bell = stepBellTelephone({
    voiceAmplitude: params.voiceAmplitude ?? 75,
    airGap: params.airGap ?? 0.35,
    batteryVoltage,
    liquidConductivity,
    acousticFrequencyHz,
  });
  const voiceAmplitude = bell.voiceNorm;

  const live = useLiveSimParams({
    acousticFrequencyHz,
    voiceAmplitude,
    voiceAmplitudeDb: params.voiceAmplitude ?? 75,
    showAcousticWaves,
    currentBaselineAmps: bell.currentBaselineAmps,
    diaphragmUm: bell.diaphragmUm,
    diaphragmStudioScale: bell.diaphragmStudioScale,
    modulatedMa: bell.modulatedMa,
    acousticDisplayOmegaRadPerS: bell.acousticDisplayOmegaRadPerS,
    electronDisplaySpeed: bell.electronDisplaySpeed,
    electronStudioSpeed: bell.electronStudioSpeed,
    waveAdvancePerS: bell.waveAdvancePerS,
    isCutaway,
    isAudioMuted,
  });

  const controlsRef = useRef<StudioContext["controls"] | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelRef = useRef<BellTelephoneModel | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    switch (preset) {
      case "iso":
        camera.position.set(11, 8, 14);
        controls.target.set(0, 0, 0);
        break;
      case "speaking_horn":
        camera.position.set(-4.5, 1.8, 4.0);
        controls.target.set(-1.4, 0.5, 0);
        break;
      case "liquid_transmitter":
        camera.position.set(3.5, 1.2, 3.8);
        controls.target.set(2.0, -1.0, 0);
        break;
      case "battery_cells":
        camera.position.set(-3.5, 0.5, 4.5);
        controls.target.set(-2.5, -1.5, 1.8);
        break;
      case "diaphragm_wire":
        camera.position.set(-0.5, 1.5, 2.8);
        controls.target.set(0, 0, 0);
        break;
      case "top":
        camera.position.set(0, 11.0, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
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

    const studio = createThreeStudioScene({
      container,
      cameraPos: [11, 8, 14],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    const model = buildBellTelephoneModel();
    modelRef.current = model;
    scene.add(model.rootGroup);

    // Animation Loop
    let reqId: number;
    let timeSec = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const dt = 1 / 60;
      timeSec += dt;
      const p = live.current;

      updateBellTelephoneKinematics(
        model,
        dt,
        timeSec,
        p.acousticDisplayOmegaRadPerS,
        p.diaphragmStudioScale,
        p.electronStudioSpeed,
        p.showAcousticWaves,
        p.isCutaway,
        p.voiceAmplitudeDb,
        p.acousticFrequencyHz,
      );

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      model.dispose();
      studio.cleanup();
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
            Bell Liquid Transmitter Telephone 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 174,465 (1876)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["speaking_horn", "Speaking Cone"],
              ["liquid_transmitter", "Liquid Transmitter"],
              ["battery_cells", "Battery Cells"],
              ["diaphragm_wire", "Diaphragm & Needle"],
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
            title={isCutaway ? "Solid Instrument" : "Cutaway Chamber"}
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
        title="Bell magneto-variable resistance acoustics"
        chips={[
          { label: "Frequency", value: String(acousticFrequencyHz), unit: "Hz" },
          { label: "Diaphragm Deflection", value: bell.diaphragmUm.toFixed(2), unit: "µm" },
          { label: "Baseline Resistance", value: bell.baseResistanceOhms.toFixed(1), unit: "Ω" },
          { label: "ΔR Modulation", value: bell.resistanceModulationOhms.toFixed(1), unit: "Ω" },
          {
            label: "Baseline Current",
            value: bell.currentBaselineMa.toFixed(1),
            unit: "mA",
          },
          { label: "Modulated Current", value: bell.modulatedMa.toFixed(2), unit: "mA" },
          { label: "Battery Voltage", value: batteryVoltage.toFixed(1), unit: "V" },
          { label: "Liquid Conductivity", value: liquidConductivity.toFixed(2), unit: "S/m" },
          {
            label: "Wave crate",
            value: crateSource === "wasm" ? "fs-fft" : "ts-wave-fallback",
          },
        ]}
      />
    </div>
  );
});
