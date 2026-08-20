"use client";

import { Camera, Eye, EyeOff, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepEdisonPhonograph } from "@/physics/catalogKernels";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import {
  buildEdisonPhonographModel,
  updateEdisonPhonographKinematics,
} from "./edisonPhonographModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset =
  | "iso"
  | "stylus_groove"
  | "tinfoil_cylinder"
  | "speaking_tube"
  | "illustrative_drive"
  | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [9.5, 7.0, 11.0], target: [0, 0, 0] },
  stylus_groove: { pos: [0, 2.2, 3.2], target: [0, 1.2, 0.8] },
  tinfoil_cylinder: { pos: [-1.8, 1.8, 3.8], target: [-0.4, 0.8, 0] },
  speaking_tube: { pos: [2.8, 3.0, 4.0], target: [0, 1.8, 1.8] },
  illustrative_drive: { pos: [-4.5, 2.0, 3.5], target: [-3.5, 0.5, 0] },
  top: { pos: [0, 12.0, 0.1], target: [0, 0, 0] },
};

export function EdisonPhonograph3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // Acoustic & Kinematic Parameters
  const { params } = usePatentPhysics("us-200521-edison-phonograph");
  const mandrelRpm = params.mandrelRpm ?? 60;
  const cylinderRpm = mandrelRpm;
  const voiceVolumeDb = params.voiceVolumeDb ?? params.soundWaveAmpDb ?? 75;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  const phono = stepEdisonPhonograph({
    mandrelRpm,
    voiceVolumeDb,
  });

  const live = useLiveSimParams({
    mandrelRpm,
    cylinderRpm,
    voiceVolumeDb,
    isAudioMuted,
    isCutaway,
    grooveDepthMicrons: phono.grooveDepthMicrons,
    leadScrewPitchMm: phono.leadScrewPitchMm,
    surfaceSpeedCmPerS: phono.surfaceSpeedCmPerS,
    audioBandwidthHz: phono.audioBandwidthHz,
    mandrelOmegaRadPerS: phono.mandrelOmegaRadPerS,
    stylusAmp: phono.stylusAmp,
    stylusOmegaRadPerS: phono.stylusOmegaRadPerS,
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

    const { scene, camera, renderer, controls } = studio;

    const model = buildEdisonPhonographModel();
    scene.add(model.rootGroup);

    // Animation Loop
    let reqId: number;
    let timeSec = 0;
    let lastFrameMs: number | undefined;

    const animate = (frameMs: number) => {
      reqId = requestAnimationFrame(animate);
      const dt = lastFrameMs !== undefined ? Math.min((frameMs - lastFrameMs) / 1000, 0.1) : 1 / 60;
      lastFrameMs = frameMs;
      timeSec += dt;
      const p = live.current;

      updateEdisonPhonographKinematics(
        model,
        dt,
        timeSec,
        p.mandrelOmegaRadPerS,
        p.stylusAmp,
        p.stylusOmegaRadPerS,
        p.isCutaway,
        p.cylinderRpm,
        p.voiceVolumeDb,
      );

      controls.update();
      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

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
              Edison Phonograph 3D
            </div>
            <div className="text-[11px] text-parchment-300 font-sans">
              US Patent 200,521 • Tinfoil Sound Recording Cylinder
            </div>
          </div>
        )}

        {/* Top Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Solid Materials" : "Cutaway Cylinder"}
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
                ["stylus_groove", "Stylus & Diaphragm"],
                ["tinfoil_cylinder", "Tinfoil Cylinder"],
                ["speaking_tube", "Speaking Tube"],
                ["illustrative_drive", "Illustrative Drive"],
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
          title="Edison cylinder acoustics"
          chips={[
            {
              label: "Source groove pitch",
              value: String(phono.sourceGroovesPerInch),
              unit: "grooves/in",
            },
            {
              label: "Source thread pitch",
              value: String(phono.sourceThreadsPerInch),
              unit: "threads/in",
            },
            { label: "Illustrative turn setting", value: String(mandrelRpm), unit: "rpm" },
            {
              label: "Illustrative axial animation",
              value: phono.axialTravelMmPerS.toFixed(2),
              unit: "mm/s",
            },
            { label: "Model ω", value: phono.mandrelOmegaRadPerS.toFixed(1), unit: "rad/s" },
            {
              label: "Groove crate",
              value: crateSource === "wasm" ? "fs-fft" : "ts-wave-fallback",
            },
          ]}
        />

        <div className="sr-only">
          Note: Rotational rate, travel range, indentation motion, and sound character are
          model-only reader aids, not source claims.
        </div>
      </div>
    </div>
  );
}
