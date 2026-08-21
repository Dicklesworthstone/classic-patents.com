"use client";

import { Camera, Eye, EyeOff, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { stepBellPhotophone } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { createBellPhotophoneModel } from "./bellPhotophoneModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "overview" | "transmitter" | "receiver" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  overview: { pos: [0, 4.0, 12.0], target: [0, 1.0, 0] },
  transmitter: { pos: [-3.5, 2.5, 4.0], target: [-5.0, 1.2, 0] },
  receiver: { pos: [3.5, 2.5, 4.0], target: [5.0, 1.2, 0] },
  top: { pos: [0, 14.0, 0.1], target: [0, 1.0, 0] },
};

interface BellPhotophone3DProps {
  initialVoiceSplDb?: number;
  initialDistanceM?: number;
  initialSolarWPerM2?: number;
}

export function BellPhotophone3D({
  initialVoiceSplDb = 75,
  initialDistanceM = 213,
  initialSolarWPerM2 = 950,
}: BellPhotophone3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);

  const { params, updateParam } = usePatentPhysics("us-235199-bell-photophone");
  const voiceSplDb = params.voiceSplDb ?? initialVoiceSplDb;
  const transmissionDistanceM = params.transmissionDistanceM ?? initialDistanceM;
  const solarIrradianceWPerM2 = params.solarIrradianceWPerM2 ?? initialSolarWPerM2;
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("overview");

  const handlePresetChange = (preset: CameraPreset) => {
    setCameraPreset(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const photoState = useMemo(() => {
    return stepBellPhotophone({
      voiceSplDb: !isAudioMuted ? voiceSplDb : 40,
      transmissionDistanceM,
      solarIrradianceWPerM2,
    });
  }, [voiceSplDb, transmissionDistanceM, solarIrradianceWPerM2, isAudioMuted]);

  const live = useLiveSimParams({ photoState });

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

    const model = createBellPhotophoneModel();
    studio.scene.add(model.group);

    let rafId = 0;
    let elapsedTimeSec = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      elapsedTimeSec += 0.016;
      model.update(live.current.photoState, elapsedTimeSec);
      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      model.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Alexander Graham Bell Photophone 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-14rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3.5 h-3.5" /> View:
            </span>
            {(
              [
                ["overview", "Overview"],
                ["transmitter", "Transmitter"],
                ["receiver", "Receiver Dish"],
                ["top", "Top"],
              ] as [CameraPreset, string][]
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetChange(preset)}
                className={`px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
                  cameraPreset === preset
                    ? "bg-amber-600 text-white shadow-xs font-semibold"
                    : "text-ink-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {label}
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

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                Modulation:
              </span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {(photoState.modulationDepth * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Selenium R:</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                {photoState.seleniumOperatingResistanceKOhms.toFixed(1)} kΩ
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Signal Current:</span>
              <span className="text-cyan-800 dark:text-cyan-400 font-bold">
                {photoState.audioSignalCurrentUa.toFixed(2)} µA
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Reproduced SPL:</span>
              <span className="text-purple-800 dark:text-purple-400 font-bold">
                {photoState.reproducedAudioSplDb.toFixed(1)} dB SPL
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Optical Link SNR:</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                {photoState.linkSnrDb.toFixed(1)} dB
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Voice Acoustic Level
              </span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {voiceSplDb} dB SPL
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              step="1"
              value={voiceSplDb}
              onChange={(e) => updateParam("voiceSplDb", Number.parseFloat(e.target.value))}
              className="w-full accent-amber-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Transmission Distance
              </span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {transmissionDistanceM} m
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="500"
              step="10"
              value={transmissionDistanceM}
              onChange={(e) =>
                updateParam("transmissionDistanceM", Number.parseFloat(e.target.value))
              }
              className="w-full accent-cyan-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Solar Irradiance</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                {solarIrradianceWPerM2} W/m²
              </span>
            </div>
            <input
              type="range"
              min="400"
              max="1200"
              step="25"
              value={solarIrradianceWPerM2}
              onChange={(e) =>
                updateParam("solarIrradianceWPerM2", Number.parseFloat(e.target.value))
              }
              className="w-full accent-emerald-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Bottom SI Telemetry Chip Strip */}
      <StudioKernelChips
        visible={true}
        title="SELENIUM OPTICAL SPEECH TRANSMISSION"
        chips={[
          {
            label: "Distance",
            value: `${transmissionDistanceM.toFixed(0)}`,
            unit: "m",
            tone: "hot",
          },
          {
            label: "Voice SPL",
            value: `${voiceSplDb.toFixed(0)}`,
            unit: "dB",
          },
          {
            label: "Sunlight Flux",
            value: `${solarIrradianceWPerM2.toFixed(0)}`,
            unit: "W/m²",
          },
          { label: "Detector", value: "Crystalline Selenium (Se) Cell" },
          {
            label: "Modulation",
            value: "Diaphragm Mirror Beam Deflection",
          },
        ]}
      />
    </div>
  );
}

export default BellPhotophone3D;
