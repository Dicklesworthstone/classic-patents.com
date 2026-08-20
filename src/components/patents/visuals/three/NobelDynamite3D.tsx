"use client";

import { Camera, Eye, EyeOff, Flame, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { stepNobelDynamite } from "@/physics/catalogKernels";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildNobelDynamiteModel, updateNobelDynamiteKinematics } from "./nobelDynamiteModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "blasting_cap" | "matrix_cutaway" | "fuse" | "detonation_wave" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [8.5, 6.0, 9.5], target: [0, 0, 0] },
  blasting_cap: { pos: [0, 3.2, 3.0], target: [0, 2.0, 0] },
  matrix_cutaway: { pos: [0, 0, 3.5], target: [0, 0, 0] },
  fuse: { pos: [0, 4.8, 2.5], target: [0, 3.5, 0] },
  detonation_wave: { pos: [3.5, 2.0, 4.5], target: [0, 0, 0] },
  top: { pos: [0, 11.0, 0.1], target: [0, 0, 0] },
};

export const NobelDynamite3D = memo(function NobelDynamite3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // Chemical Explosives Parameters
  const { params } = usePatentPhysics("us-78317-nobel-dynamite");
  const ngPercentage = params.ngConcentrationPct ?? params.ngConcentration ?? 75;
  const nobel = stepNobelDynamite({
    ngConcentrationPct: ngPercentage,
    capEnergyJoules: params.capEnergyJoules ?? 1.2,
  });
  const detonationVelocityMps = nobel.detonationVelocityMps;
  const [isFuseLit, setIsFuseLit] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());
  const fuseTimerRef = useRef<number | null>(null);

  const live = useLiveSimParams({
    ngPercentage,
    capEnergyJoules: params.capEnergyJoules ?? 1.2,
    detonationVelocityMps,
    isFuseLit,
    shockwaveGlow: nobel.shockwaveGlow,
    stickDisplayOmegaRadPerS: nobel.stickDisplayOmegaRadPerS,
    isAudioMuted,
    isCutaway,
    blastOverpressureMpa: nobel.blastOverpressureMpa,
    isInitiated: nobel.isInitiated ? 1 : 0,
    chargeTransitUs: nobel.chargeTransitUs,
    flashDisplayMs: nobel.flashDisplayMs,
  });

  const studioRef = useRef<StudioContext | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const igniteFuse = () => {
    setIsFuseLit(true);
    if (!isAudioMuted) {
      soundEngine.playSwitchClick();
    }
    if (fuseTimerRef.current !== null) {
      window.clearTimeout(fuseTimerRef.current);
    }
    fuseTimerRef.current = window.setTimeout(() => {
      setIsFuseLit(false);
    }, nobel.flashDisplayMs);
  };

  useEffect(() => {
    return () => {
      if (fuseTimerRef.current !== null) {
        window.clearTimeout(fuseTimerRef.current);
      }
    };
  }, []);

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

    const { rootGroup, nodes, materials, dispose } = buildNobelDynamiteModel();
    scene.add(rootGroup);

    // Animation Loop
    let reqId: number;
    let timeSec = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const dt = 1 / 60;
      timeSec += dt;
      const p = live.current;

      updateNobelDynamiteKinematics(
        nodes,
        materials,
        dt,
        timeSec,
        p.isFuseLit,
        p.shockwaveGlow,
        p.stickDisplayOmegaRadPerS,
        p.isCutaway,
        p.ngPercentage,
        p.capEnergyJoules,
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
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Title HUD */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 pointer-events-none rounded-xl border border-parchment-700/60 bg-parchment-950/80 px-3.5 py-2 backdrop-blur-md shadow-lg">
            <div className="font-mono text-xs font-bold text-parchment-100 uppercase tracking-wider">
              Nobel Dynamite 3D
            </div>
            <div className="text-[11px] text-parchment-300 font-sans">
              US Patent 78,317 • Porous-Earth Nitroglycerin Explosive
            </div>
          </div>
        )}

        {/* Top Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={igniteFuse}
            disabled={isFuseLit}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-sans font-medium transition-colors shadow-sm ${
              isFuseLit
                ? "bg-red-600 text-white animate-pulse"
                : "bg-amber-600 hover:bg-amber-500 text-white"
            }`}
          >
            <Flame className="w-4 h-4 text-amber-200" />
            <span>{isFuseLit ? "DETONATING" : "Ignite"}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Solid Cartridge" : "Cutaway Interior"}
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

        {/* Camera Views Bar */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-1.5rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3.5 h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["blasting_cap", "Blasting Cap"],
                ["matrix_cutaway", "Kieselguhr Matrix"],
                ["fuse", "Safety Fuse"],
                ["detonation_wave", "Shockwave"],
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
          title="Nobel dynamite detonation physics"
          chips={[
            { label: "NG Loading", value: String(ngPercentage), unit: "%" },
            { label: "Detonation Velocity", value: String(detonationVelocityMps), unit: "m/s" },
            { label: "Blast Overpressure", value: String(nobel.blastOverpressureMpa), unit: "MPa" },
            { label: "Specific Energy", value: String(nobel.energyMjPerKg), unit: "MJ/kg" },
            { label: "Cap Energy", value: String(nobel.capEnergyJoules ?? 1.2), unit: "J" },
            { label: "Transit Time", value: nobel.chargeTransitUs.toFixed(1), unit: "µs" },
            { label: "Explosive State", value: isFuseLit ? "DETONATION" : "STABLE" },
            {
              label: "Shock crate",
              value: crateSource === "wasm" ? "fs-fft" : "ts-wave-fallback",
            },
          ]}
        />
      </div>
    </div>
  );
});
