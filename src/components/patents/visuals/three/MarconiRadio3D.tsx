"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FrankenSimEngine } from "@/physics/engine";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildMarconiRadioModel, updateMarconiRadioKinematics } from "./marconiRadioModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset =
  | "iso"
  | "spark_gap"
  | "induction_coil"
  | "aerial_monopole"
  | "morse_key"
  | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [13, 10, 16], target: [0, 0, 0] },
  spark_gap: { pos: [0, -0.8, 3.8], target: [0, -1.8, 0] },
  induction_coil: { pos: [0, -1.2, -4.5], target: [0, -2.1, -1.8] },
  aerial_monopole: { pos: [-3.5, 3.5, 6.5], target: [-3.5, 2.5, 0] },
  morse_key: { pos: [3.0, -1.5, 2.5], target: [3.0, -2.4, -0.5] },
  top: { pos: [0, 13.5, 0.1], target: [0, 0, 0] },
};

export function MarconiRadio3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // Spark-Gap Radio State Controls
  const { params } = usePatentPhysics("us-586193-marconi-radio");
  const aerialHeightMeters = params.aerialHeight ?? 88;
  const sparkGapMm = params.sparkGapMm ?? 10;
  const inductionCoilKv = params.sparkVoltage ?? 28;
  const [showEmWavefronts] = useState<boolean>(true);
  const [isSparking] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [crateSource, setCrateSource] = useState(genericKernelSource());
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  // Electromagnetic Wireless Physics (FrankenSim Monopole Radiation)
  const radioPhysics = FrankenSimEngine.stepMarconiRadio(
    aerialHeightMeters,
    sparkGapMm,
    inductionCoilKv,
  );

  const live = useLiveSimParams({
    aerialHeightMeters,
    sparkGapMm,
    inductionCoilKv,
    showEmWavefronts,
    isSparking,
    isAudioMuted,
    isCutaway,
    resonantFreqMhz: radioPhysics.resonantFreqMhz,
    peakRfPowerKw: radioPhysics.peakRfPowerKw,
    waveOpacityBase: radioPhysics.waveOpacityBase,
    wavePhaseRate: radioPhysics.wavePhaseRate,
    mastStudioScale: radioPhysics.mastStudioScale,
  });

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

    const { rootGroup, nodes, materials, dispose } = buildMarconiRadioModel();
    scene.add(rootGroup);

    // Animation Loop
    let reqId: number;
    let timeSec = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const dt = 1 / 60;
      timeSec += dt;
      const p = live.current;

      updateMarconiRadioKinematics(
        nodes,
        materials,
        dt,
        timeSec,
        p.aerialHeightMeters,
        p.resonantFreqMhz,
        p.waveOpacityBase,
        p.wavePhaseRate,
        p.mastStudioScale,
        p.isSparking,
        p.showEmWavefronts,
        p.isCutaway,
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
    <div className="relative w-full h-[620px] bg-parchment-900 rounded-2xl overflow-hidden border border-parchment-700 shadow-2xl flex flex-col">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-parchment-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-parchment-100 uppercase tracking-wider">
            Marconi Wireless Radio 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 586,193 (1897)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["spark_gap", "Spark Gap"],
              ["induction_coil", "Induction Coil"],
              ["aerial_monopole", "Aerial Mast"],
              ["morse_key", "Morse Key"],
              ["top", "Radiation Axis"],
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
            title={isCutaway ? "Solid Apparatus" : "Cutaway View"}
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
        title="Marconi monopole spark-gap transmitter"
        chips={[
          { label: "Mast Height", value: `${aerialHeightMeters}`, unit: "m" },
          { label: "Wavelength", value: `${radioPhysics.wavelengthMeters.toFixed(1)}`, unit: "m" },
          { label: "Frequency", value: `${radioPhysics.resonantFreqMhz.toFixed(2)}`, unit: "MHz" },
          { label: "Spark Gap", value: `${sparkGapMm}`, unit: "mm" },
          { label: "Coil Voltage", value: `${inductionCoilKv}`, unit: "kV" },
          { label: "Peak RF", value: `${radioPhysics.peakRfPowerKw.toFixed(1)}`, unit: "kW" },
          { label: "Range", value: `${radioPhysics.maxRangeMiles.toFixed(1)}`, unit: "mi" },
          {
            label: "R_rad",
            value: `${radioPhysics.radiationResistanceOhms.toFixed(1)}`,
            unit: "Ω",
          },
          {
            label: "Wave crate",
            value: crateSource === "wasm" ? "fs-fft" : "ts-wave-fallback",
          },
        ]}
      />
    </div>
  );
}
