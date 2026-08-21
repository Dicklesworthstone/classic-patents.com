"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FrankenSimEngine, lamarrChannelFrequencyMhz } from "@/physics/engine";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import {
  buildLamarrFrequencyHoppingModel,
  updateLamarrFrequencyHoppingKinematics,
} from "./lamarrFrequencyHoppingModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "roll" | "waterfall" | "escapement" | "torpedo" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [6, 4, 7], target: [0, 0, 0] },
  roll: { pos: [-2.5, 1.5, 3.5], target: [-1.5, 0, 0] },
  waterfall: { pos: [0, 2.5, 4.5], target: [0, 0, 0] },
  escapement: { pos: [2.0, 1.0, 3.0], target: [1.5, 0, 0] },
  torpedo: { pos: [4.0, 1.5, 3.5], target: [2.5, 0, 0] },
  top: { pos: [0, 9.0, 0.1], target: [0, 0, 0] },
};

export function LamarrFrequencyHopping3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);

  // Spread Spectrum State Controls
  const { params, updateParam } = usePatentPhysics("us-2292387-lamarr-frequency-hopping");
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const [_crateSource, setCrateSource] = useState(genericKernelSource());

  useEffect(() => {
    void ensureGenericWasm().then((next) => setCrateSource(next));
  }, []);

  const carrierChannelsCount = params.channels ?? params.carrierChannelsCount ?? 88;
  const hopRateHopsPerSec = params.hopRate ?? params.hopRateHopsPerSec ?? 4;
  const isJammingActive = params.isJammingActive !== 0;
  const currentChannel = Math.max(
    1,
    Math.min(carrierChannelsCount, Math.round(params.channel ?? 1)),
  );

  const fhPhysics = FrankenSimEngine.stepLamarrFrequencyHopping(
    carrierChannelsCount,
    hopRateHopsPerSec,
  );

  useFrankenSimPhysics("us-2292387-lamarr-frequency-hopping", {
    domain: "electromagnetics_flux",
    timestampMs: Date.now(),
    timeStepDt: 0.016,
    refusal: { isRefused: false },
    em: {
      frequencyHz: fhPhysics.spreadSpectrumBandwidthHz,
      magneticFluxDensityTesla: 0,
      electricFieldVpm: 0,
      phaseAngleRad: 0,
      inductanceHenry: 0,
      capacitanceFarad: 0,
      currentAmperes: 0,
      voltageVolts: 0,
      powerFactor: 0,
      efficiencyPct: 0,
      synchronousRpm: 0,
      slipFraction: 0,
      rotorRpm: 0,
      shaftPowerWatts: 0,
      electricalInputWatts: 0,
    },
  });

  const carrierFrequencyMhz = lamarrChannelFrequencyMhz(currentChannel, carrierChannelsCount);

  const live = useLiveSimParams({
    currentChannel,
    carrierChannelsCount,
    hopRateHopsPerSec,
    isJammingActive,
    jamCenter: params.jamCenter ?? 44,
    isCutaway,
    isAudioMuted,
    carrierFrequencyMhz,
    antiJammingMarginDb: fhPhysics.antiJammingMarginDb,
    processingGainDb: fhPhysics.processingGainDb,
    drumDisplayOmegaRadPerS: fhPhysics.drumDisplayOmegaRadPerS,
  });

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const handleToggleSound = () => {
    toggleSound(() => {
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

    const { scene, renderer, controls } = studio;

    const model = buildLamarrFrequencyHoppingModel();
    scene.add(model.root);

    // Animation Loop
    let reqId: number;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const p = live.current;

      updateLamarrFrequencyHoppingKinematics(
        model,
        1 / 60,
        p.currentChannel,
        p.carrierChannelsCount,
        p.isJammingActive,
        p.jamCenter,
        p.isCutaway,
        p.drumDisplayOmegaRadPerS,
      );

      controls.update();
      renderer.render(scene, studio.camera);
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
      <div className="sr-only">Hedy Lamarr & George Antheil Secret Communication System 3D</div>
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
                ["roll", "88-Key Roll"],
                ["waterfall", "RF Waterfall"],
                ["escapement", "Escapement"],
                ["torpedo", "Torpedo Bay"],
                ["top", "Top View"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => applyCameraPreset(id)}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-sans whitespace-nowrap shrink-0 transition-colors ${
                  activeCamera === id
                    ? "bg-amber-700 dark:bg-amber-600 text-white font-semibold shadow-xs"
                    : "text-ink-700 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Top Right Tool Bar */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Switch to Solid Torpedo Bay" : "Switch to Torpedo Bay Cutaway"}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              isCutaway
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showUiOverlay
                ? "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
                : "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
            }`}
            title={showUiOverlay ? "Hide Overlay UI (Clean 3D View)" : "Show Overlay UI"}
            aria-label={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
          >
            {showUiOverlay ? (
              <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
          <button
            aria-label={isAudioMuted ? "Enable Sound Synthesis" : "Mute Sound"}
            type="button"
            onClick={handleToggleSound}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={isAudioMuted ? "Enable Sound Synthesis" : "Mute Sound"}
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            )}
          </button>
          <button
            aria-label={showCalloutPins ? "Hide annotation pins" : "Show annotation pins"}
            type="button"
            onClick={() => setShowCalloutPins(!showCalloutPins)}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showCalloutPins
                ? "bg-amber-600 text-white border-amber-700 shadow-md"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
            title="Toggle Historical Patent Numeral Pins"
          >
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => applyCameraPreset("iso")}
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
                Carrier Freq:
              </span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {carrierFrequencyMhz.toFixed(1)} MHz (Ch {currentChannel}/{carrierChannelsCount})
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Processing Gain:</span>
              <span className="text-cyan-800 dark:text-cyan-400 font-bold">
                +{fhPhysics.processingGainDb} dB
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Anti-Jam Margin:</span>
              <span className="text-purple-800 dark:text-purple-400 font-bold">
                +{fhPhysics.antiJammingMarginDb} dB
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Hop Rate:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {hopRateHopsPerSec} hops/sec
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
              <span className="text-ink-700 dark:text-ink-300 font-medium">Carrier Channels</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                {carrierChannelsCount} keys
              </span>
            </div>
            <input
              type="range"
              min="16"
              max="88"
              step="4"
              value={carrierChannelsCount}
              onChange={(e) =>
                updateParam("carrierChannelsCount", Number.parseInt(e.target.value, 10))
              }
              className="w-full accent-emerald-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Slotted Hop Rate</span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {hopRateHopsPerSec} hops/sec
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="16"
              step="1"
              value={hopRateHopsPerSec}
              onChange={(e) =>
                updateParam("hopRateHopsPerSec", Number.parseInt(e.target.value, 10))
              }
              className="w-full accent-amber-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Channel Number</span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                Ch {currentChannel}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max={carrierChannelsCount}
              step="1"
              value={currentChannel}
              onChange={(e) => updateParam("channel", Number.parseInt(e.target.value, 10))}
              className="w-full accent-cyan-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Bottom SI Telemetry Chip Strip */}
      <StudioKernelChips
        visible={true}
        title="FREQUENCY HOPPING SPREAD SPECTRUM"
        chips={[
          {
            label: "Channel",
            value: `${currentChannel} / ${carrierChannelsCount}`,
            unit: "slots",
          },
          { label: "RF Frequency", value: `${carrierFrequencyMhz.toFixed(2)}`, unit: "MHz" },
          { label: "Hop Rate", value: `${hopRateHopsPerSec.toFixed(1)}`, unit: "hops/s" },
          {
            label: "Processing Gain",
            value: `${fhPhysics.processingGainDb.toFixed(1)}`,
            unit: "dB",
          },
          {
            label: "Anti-Jam Margin",
            value: `${fhPhysics.antiJammingMarginDb.toFixed(1)}`,
            unit: "dB",
          },
          { label: "Synchronization", value: "Slotted Player-Piano Tape" },
          {
            label: "Jam Resistance",
            value: isJammingActive ? "Frequency Agile Evading" : "Clear Channel",
            tone: isJammingActive ? "warn" : "ok",
          },
        ]}
      />
    </div>
  );
}
