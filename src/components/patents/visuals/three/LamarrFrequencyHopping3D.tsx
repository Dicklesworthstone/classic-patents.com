"use client";

import {
  Camera,
  Eye,
  EyeOff,
  Layers,
  Radio,
  RotateCcw,
  Shield,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import {
  FrankenSimEngine,
  lamarrChannelFrequencyMhz,
  lamarrDefaultJamChannel,
  lamarrPianoKeyHz,
  lamarrPianoRollChannel,
  lamarrRadioChannel,
} from "@/physics/engine";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import {
  buildLamarrFrequencyHoppingModel,
  updateLamarrFrequencyHoppingKinematics,
} from "./lamarrFrequencyHoppingModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "roll" | "waterfall" | "escapement" | "torpedo" | "top";

export function LamarrFrequencyHopping3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Spread Spectrum State Controls
  const { params } = usePatentPhysics("us-2292387-lamarr-frequency-hopping");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const carrierChannelsCount = params.channels ?? 88;
  const hopRateHopsPerSec = params.hopRate ?? 4;
  const isJammingActive = params.isJammingActive !== 0;
  const [currentChannel, setCurrentChannel] = useState<number>(1);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound } = usePatentAudio();

  // Spread Spectrum Physics Calculations (FrankenSim Slotted Frequency-Hopping)
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
  const processingGainDb = fhPhysics.processingGainDb.toFixed(1);
  const antiJamMarginDb = fhPhysics.antiJammingMarginDb.toFixed(1);
  const activeFrequencyMhz = lamarrChannelFrequencyMhz(
    currentChannel,
    carrierChannelsCount,
  ).toFixed(1);

  const live = useLiveSimParams({
    hopRateHopsPerSec,
    isJammingActive,
    carrierChannelsCount,
    isCutaway,
    jamChannel: params.jamChannel ?? fhPhysics.defaultJamChannel,
    hopSoundStride: fhPhysics.hopSoundStride,
    isAudioMuted,
  });

  const controlsRef = useRef<StudioContext["controls"] | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    switch (preset) {
      case "iso":
        controls.setView([12, 9, 15], [0, 0, 0]);
        break;
      case "roll":
        controls.setView([0, 3.2, 4.0], [0, 1.4, 0]);
        break;
      case "waterfall":
        controls.setView([0, -3.2, 5.0], [0, -1.8, 0]);
        break;
      case "escapement":
        controls.setView([-4.5, 1.5, 3.5], [-3.0, 0.4, 0]);
        break;
      case "torpedo":
        controls.setView([8, 3, 9], [0, 0.5, 0]);
        break;
      case "top":
        controls.setView([0, 10.5, 0.1], [0, 0, 0]);
        break;
    }
  };

  const handleToggleSound = () => {
    toggleSound(() => {
      soundEngine.playPianoKeyHop(440);
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [12, 9, 15],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    const model = buildLamarrFrequencyHoppingModel();
    scene.add(model.root);

    let reqId: number;
    let hopTimer = 0;
    let activeChan = 22;
    let rollStep = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = 1 / 60;
      const p = live.current;

      hopTimer += delta;
      const hopInterval = 1.0 / Math.max(1, p.hopRateHopsPerSec);

      if (hopTimer >= hopInterval) {
        hopTimer = 0;
        rollStep += 1;
        const pianoKey = lamarrPianoRollChannel(rollStep);
        const liveChannels = Math.max(8, Math.min(88, Math.round(p.carrierChannelsCount)));
        activeChan = lamarrRadioChannel(pianoKey, liveChannels) - 1;
        setCurrentChannel(activeChan + 1);

        if (!p.isAudioMuted && rollStep % p.hopSoundStride === 0) {
          soundEngine.playPianoKeyHop(lamarrPianoKeyHz(pianoKey));
        }
      }

      const liveChannels = Math.max(8, Math.min(88, Math.round(p.carrierChannelsCount)));
      const jamCenter = Math.min(
        liveChannels - 1,
        Math.max(0, Math.round(p.jamChannel ?? lamarrDefaultJamChannel(liveChannels)) - 1),
      );

      updateLamarrFrequencyHoppingKinematics(
        model,
        delta,
        activeChan,
        liveChannels,
        p.isJammingActive,
        jamCenter,
        p.isCutaway,
      );

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      model.dispose();
      studio.dispose();
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      {/* 3D WebGL Canvas Viewport */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Live HUD Telemetry Overlay */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-col gap-1.5 sm:gap-2 pointer-events-none max-w-[calc(100%-8rem)] sm:max-w-md transition-opacity duration-200">
            <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md p-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
              <div className="text-[10px] sm:text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 animate-pulse" />
                Spread Spectrum Telemetry
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 sm:gap-y-1 mt-1 text-[10px] sm:text-xs font-sans">
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Carrier Freq:</span>{" "}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {activeFrequencyMhz} MHz (Ch {currentChannel}/{carrierChannelsCount})
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Processing Gain:</span>{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    +{processingGainDb} dB ({carrierChannelsCount} Ch)
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Anti-Jam:</span>{" "}
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    +{antiJamMarginDb} dB
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Hop Rate:</span>{" "}
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {hopRateHopsPerSec} hops/sec
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 items-center gap-2 max-w-full">
              <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse shrink-0" />
              <span className="truncate">
                Hedy Lamarr &amp; George Antheil (US 2,292,387) — Secret Comm (1942)
              </span>
            </div>
          </div>
        )}

        {/* Top Right Tool Bar (Toggle UI, Audio, Pins, Cutaway, Reset) */}
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

        {/* Camera Views Bar */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-1.5rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
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
      </div>
    </div>
  );
}
