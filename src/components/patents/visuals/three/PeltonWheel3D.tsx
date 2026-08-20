"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX, Waves } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepPeltonWheel } from "@/physics/catalogKernels";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildPeltonWheelModel, updatePeltonWheelKinematics } from "./peltonWheelModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "split_bucket" | "needle_nozzle" | "runner_wheel" | "tailrace" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [10.5, 7.5, 11.5], target: [0, 0, 0] },
  split_bucket: { pos: [-1.0, 2.5, 3.5], target: [-0.5, 1.8, 0] },
  needle_nozzle: { pos: [-3.5, 0.5, 3.8], target: [-2.2, -0.4, 0] },
  runner_wheel: { pos: [0, 1.0, 4.5], target: [0, 0, 0] },
  tailrace: { pos: [0, -3.2, 5.0], target: [0, -2.0, 0] },
  top: { pos: [0, 12.5, 0.1], target: [0, 0, 0] },
};

export function PeltonWheel3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // Hydrodynamic Impulse Parameters
  const { params } = usePatentPhysics("us-233692-pelton-water-wheel");
  const headMeters = params.headMeters ?? 450;
  const wheelRpm = params.runnerRpm ?? params.rotorRpm ?? 600;
  const pelton = stepPeltonWheel({ headMeters, runnerRpm: wheelRpm });
  const jetVelocityMps = pelton.jetVelocityMps;
  const hydraulicEfficiencyPct = pelton.etaPct;
  const powerKw = pelton.shaftPowerKw;
  const [showJet, setShowJet] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  const live = useLiveSimParams({
    headMeters,
    wheelRpm,
    jetVelocityMps,
    showJet,
    isCutaway,
    isAudioMuted,
    etaPct: hydraulicEfficiencyPct,
    shaftPowerKw: powerKw,
    speedRatio: pelton.speedRatio,
    runnerOmegaRadPerS: pelton.runnerOmegaRadPerS,
    jetDisplaySpeed: pelton.jetDisplaySpeed,
    sprayDisplaySpeed: pelton.sprayDisplaySpeed,
    pressureNeedleRad: pelton.pressureNeedleRad,
    needleStudioX: pelton.needleStudioX,
    needleStudioY: pelton.needleStudioY,
    handwheelOmegaRadPerS: pelton.handwheelOmegaRadPerS,
    jetOpacity: pelton.jetOpacity,
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

    // Build procedural 3D model
    const model = buildPeltonWheelModel();
    scene.add(model.rootGroup);

    // Animation Loop
    let reqId: number;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = 1 / 60;
      const p = live.current;

      const omegaRadPerSec = p.runnerOmegaRadPerS;

      updatePeltonWheelKinematics(
        model,
        delta,
        omegaRadPerSec,
        p.jetDisplaySpeed,
        p.sprayDisplaySpeed,
        p.pressureNeedleRad,
        p.needleStudioX,
        p.needleStudioY,
        p.handwheelOmegaRadPerS,
        p.showJet,
        p.isCutaway,
        p.headMeters,
        p.wheelRpm,
      );

      // Euler optimum is u/v ≈ 0.5. Off-design color shift
      const ratioErr = Math.abs(p.speedRatio - 0.5);
      const jetMat = model.materials.waterJet;
      jetMat.color.setHex(ratioErr < 0.08 ? 0x38bdf8 : p.speedRatio < 0.5 ? 0x0284c7 : 0xfb7185);
      jetMat.opacity = p.jetOpacity;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      model.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Title HUD */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 pointer-events-none rounded-xl border border-parchment-700/60 bg-parchment-950/80 px-3.5 py-2 backdrop-blur-md shadow-lg">
            <div className="font-mono text-xs font-bold text-parchment-100 uppercase tracking-wider">
              Pelton Water Wheel 3D
            </div>
            <div className="text-[11px] text-parchment-300 font-sans">
              US Patent 233,692 • Split-Bucket Impulse Hydraulic Turbine
            </div>
          </div>
        )}

        {/* Top Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Switch to Solid Casing" : "Switch to Casing Cutaway"}
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
            onClick={() => setShowJet(!showJet)}
            title="Toggle Water Jet Stream"
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showJet
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            <Waves className="w-4 h-4 text-cyan-500" />
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
            title={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
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

        {/* Camera Views Bar */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-1.5rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3.5 h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["split_bucket", "Split Bucket"],
                ["needle_nozzle", "Needle Nozzle"],
                ["runner_wheel", "Runner Wheel"],
                ["tailrace", "Tailrace"],
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

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="Pelton impulse runner"
          chips={[
            { label: "Head", value: String(headMeters), unit: "m" },
            { label: "v_jet", value: String(jetVelocityMps), unit: "m/s" },
            { label: "u", value: String(pelton.bucketSpeedMps), unit: "m/s" },
            {
              label: "u/v",
              value: pelton.speedRatio.toFixed(3),
              tone: Math.abs(pelton.speedRatio - 0.5) < 0.08 ? "ok" : "warn",
            },
            { label: "η", value: String(hydraulicEfficiencyPct), unit: "%" },
            { label: "Shaft", value: String(powerKw), unit: "kW" },
            { label: "ω", value: pelton.runnerOmegaRadPerS.toFixed(1), unit: "rad/s" },
            {
              label: "Jet crate",
              value: crateSource === "wasm" ? "fs-lbm" : "ts-fluid-fallback",
            },
          ]}
        />
      </div>
    </div>
  );
}
