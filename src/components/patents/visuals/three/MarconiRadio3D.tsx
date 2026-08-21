"use client";

import { Camera, Eye, EyeOff, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
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
  const { params, updateParam } = usePatentPhysics("us-586193-marconi-radio");
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
    let sparkCooldown = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = 1 / 60;
      timeSec += delta;
      const p = live.current;

      sparkCooldown += delta;
      const shouldFire = sparkCooldown >= 0.15;
      if (shouldFire) {
        sparkCooldown = 0;
        if (!p.isAudioMuted && p.isSparking) {
          soundEngine.playSparkDischarge(0.12);
        }
      }

      updateMarconiRadioKinematics(
        nodes,
        materials,
        delta,
        timeSec,
        p.aerialHeightMeters,
        p.resonantFreqMhz,
        p.waveOpacityBase,
        p.wavePhaseRate,
        p.mastStudioScale,
        p.showEmWavefronts,
        p.isSparking && shouldFire,
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
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Guglielmo Marconi Wireless Radio 3D</div>
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
            title={isCutaway ? "Solid Apparatus" : "Cutaway Apparatus"}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm text-xs font-sans flex items-center gap-1 ${
              isCutaway
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            {isCutaway ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden sm:inline">{isCutaway ? "Cutaway" : "Solid"}</span>
          </button>

          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Spark Sound" : "Mute Spark Sound"}
            aria-label={isAudioMuted ? "Unmute Spark Sound" : "Mute Spark Sound"}
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
            title={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
            aria-label={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
          >
            <Zap className="w-4 h-4" />
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
                Resonant Frequency:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {radioPhysics.resonantFreqMhz.toFixed(2)} MHz
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Wavelength (λ = 4h):</span>
              <span className="font-bold text-cyan-800 dark:text-cyan-400">
                {radioPhysics.wavelengthMeters.toFixed(1)} m
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Peak RF Power:</span>
              <span className="text-emerald-800 dark:text-emerald-400 font-bold">
                {radioPhysics.peakRfPowerKw.toFixed(1)} kW
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Radiation Resistance:</span>
              <span className="text-purple-800 dark:text-purple-400 font-bold">
                {radioPhysics.radiationResistanceOhms.toFixed(1)} Ω
              </span>
            </div>
          </div>
        )}

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="Marconi monopole spark-gap transmitter"
          chips={[
            { label: "Mast Height", value: `${aerialHeightMeters}`, unit: "m" },
            {
              label: "Wavelength",
              value: `${radioPhysics.wavelengthMeters.toFixed(1)}`,
              unit: "m",
            },
            {
              label: "Frequency",
              value: `${radioPhysics.resonantFreqMhz.toFixed(2)}`,
              unit: "MHz",
            },
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

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Induction Coil Potential
              </span>
              <span className="text-purple-700 dark:text-purple-400 font-mono font-bold">
                {inductionCoilKv} kV
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="1"
              value={inductionCoilKv}
              onChange={(e) => updateParam("sparkVoltage", Number.parseInt(e.target.value, 10))}
              className="w-full accent-purple-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Vertical Aerial Mast Height
              </span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {aerialHeightMeters} m
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="120"
              step="2"
              value={aerialHeightMeters}
              onChange={(e) => updateParam("aerialHeight", Number.parseInt(e.target.value, 10))}
              className="w-full accent-amber-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Spark Gap Spacing</span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {sparkGapMm} mm
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="25"
              step="1"
              value={sparkGapMm}
              onChange={(e) => updateParam("sparkGapMm", Number.parseInt(e.target.value, 10))}
              className="w-full accent-cyan-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
