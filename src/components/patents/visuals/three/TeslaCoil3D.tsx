"use client";

import {
  Camera,
  Eye,
  EyeOff,
  Layers,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FrankenSimEngine } from "@/physics/engine";
import { ensureTeslaWasm } from "@/physics/teslaWasm";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { buildTeslaCoilModel } from "./teslaCoilModel";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "toroid_breakout" | "primary_spiral" | "spark_gap" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [11, 9, 14], target: [0, 0, 0] },
  toroid_breakout: { pos: [0, 4.2, 4.5], target: [0, 2.5, 0] },
  primary_spiral: { pos: [0, -1.2, 5.5], target: [0, -2.4, 0] },
  spark_gap: { pos: [2.8, -2.2, 3.8], target: [2.4, -3.2, 0] },
  top: { pos: [0, 13.0, 0.1], target: [0, 0, 0] },
};

export function TeslaCoil3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureTeslaWasm();
  }, []);

  // Interpretive high-potential-transformer controls, not a facsimile reconstruction.
  const { params, updateParam } = usePatentPhysics("us-593138-tesla-coil");
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const primaryCap = params.primaryCap ?? 45;
  const toploadCapacitancePf = params.toploadCapacitancePf ?? 35;
  const sparkGapDistanceMm = params.sparkGapDistanceMm ?? 12;
  const inputVoltageKv = params.inputVoltageKv ?? 15;
  const couplingK = params.couplingK ?? 0.18;
  const secondaryTurns = params.secondaryTurns ?? 850;
  const [showLightningStreamers, _setShowLightningStreamers] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound } = usePatentAudio();

  // Interpretive coupled-LC host-model calculations.
  const coilPhysics = FrankenSimEngine.stepTeslaCoilFromControls({
    primaryCap,
    toploadCapacitancePf,
    inputVoltageKv,
    sparkGapDistanceMm,
    couplingK,
    secondaryTurns,
  });
  const resonantFreqKhz = coilPhysics.resonantFreqKhz;
  const secondaryVoltageMv = coilPhysics.secondaryPotentialMv.toFixed(2);
  const streamerLengthInches = coilPhysics.streamerLengthInches.toFixed(1);
  const streamerLengthMeters = coilPhysics.streamerLengthMeters.toFixed(2);

  useFrankenSimPhysics("us-593138-tesla-coil", {
    domain: "electromagnetics_flux",
    refusal: { isRefused: false },
    em: {
      frequencyHz: coilPhysics.resonantFreqHz,
      magneticFluxDensityTesla: 0,
      electricFieldVpm: coilPhysics.secondaryPotentialVolts,
      phaseAngleRad: 0,
      inductanceHenry: 0,
      capacitanceFarad: 0,
      currentAmperes: 0,
      voltageVolts: coilPhysics.inputVoltageVolts,
      powerFactor: 0,
      efficiencyPct: 0,
      synchronousRpm: 0,
      slipFraction: 0,
      rotorRpm: 0,
      shaftPowerWatts: 0,
      electricalInputWatts: 0,
    },
  });

  const live = useLiveSimParams({
    resonantFreqKhz,
    sparkGapDistanceMm,
    inputVoltageKv,
    couplingK,
    showLightningStreamers,
    secondaryVoltageMv,
    streamerLengthInches: coilPhysics.streamerLengthInches,
    streamerStudioLength: coilPhysics.streamerStudioLength,
    sparkRateHz: params.sparkRateHz ?? 120,
    isAudioMuted,
    isCutaway,
  });

  const studioRef = useRef<StudioContext | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
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

    const { scene, camera, renderer, controls } = studio;

    const model = buildTeslaCoilModel();
    scene.add(model.root);

    // Audio synthesizer
    let audioTick = 0;
    let reqId: number;

    const clock = createStudioClock();

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      const { dt } = clock.pump(now);
      const p = live.current;

      model.updateKinematics(
        dt,
        p.showLightningStreamers,
        p.streamerStudioLength,
        Number.parseFloat(p.secondaryVoltageMv),
      );

      model.setCutaway?.(p.isCutaway ?? false);

      if (!p.isAudioMuted) {
        audioTick += 1;
        if (audioTick % Math.max(1, Math.round(60 / (p.sparkRateHz / 10))) === 0) {
          soundEngine.playSparkDischarge(0.2);
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      model.dispose();
      studio.dispose();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Nikola Tesla Electrical Transformer 3D</div>
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
                ["toroid_breakout", "Toroid"],
                ["primary_spiral", "Spiral Primary"],
                ["spark_gap", "Rotary Gap"],
                ["top", "Overhead"],
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

        {/* Top Right Tool Bar (Toggle UI, Audio, Pins, Reset) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex gap-1.5 sm:gap-2">
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
            aria-label="Toggle test tone"
            type="button"
            onClick={() => {
              toggleSound();
              soundEngine.playSwitchClick();
            }}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={isAudioMuted ? "Unmute Tesla Audio" : "Mute Tesla Audio"}
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              isCutaway
                ? "bg-cyan-600 text-white border-cyan-700 shadow-md ring-2 ring-cyan-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
            title={isCutaway ? "Solid Secondary Coil" : "Wireframe Coil & Base Cutaway"}
            aria-label={isCutaway ? "Solid Secondary Coil" : "Wireframe Coil & Base Cutaway"}
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            aria-label={showCalloutPins ? "Hide annotation pins" : "Show annotation pins"}
            type="button"
            onClick={() => {
              setShowCalloutPins(!showCalloutPins);
              soundEngine.playSwitchClick();
            }}
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
            <div className="text-[10px] sm:text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-parchment-200 dark:border-ink-800/80">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              Interpretive Transformer Telemetry
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-ink-600 dark:text-ink-400">Resonant Freq:</span>
                <span className="font-bold text-amber-700 dark:text-amber-400">
                  {resonantFreqKhz} kHz
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-ink-600 dark:text-ink-400">Secondary Potential:</span>
                <span className="font-bold text-cyan-700 dark:text-cyan-400">
                  {secondaryVoltageMv} MV
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-ink-600 dark:text-ink-400">Corona Streamers:</span>
                <span className="font-bold text-purple-700 dark:text-purple-400">
                  {streamerLengthInches}" ({streamerLengthMeters} m)
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-ink-600 dark:text-ink-400">Input:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  {inputVoltageKv} kV ({sparkGapDistanceMm} mm)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Primary Capacitance
              </span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {primaryCap} nF
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={primaryCap}
              onChange={(e) => updateParam("primaryCap", Number.parseInt(e.target.value, 10))}
              className="w-full accent-amber-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Input Voltage</span>
              <span className="text-purple-700 dark:text-purple-400 font-mono font-bold">
                {inputVoltageKv} kV
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={inputVoltageKv}
              onChange={(e) => updateParam("inputVoltageKv", Number.parseInt(e.target.value, 10))}
              className="w-full accent-purple-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Spark Gap Distance</span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {sparkGapDistanceMm} mm
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="30"
              step="1"
              value={sparkGapDistanceMm}
              onChange={(e) =>
                updateParam("sparkGapDistanceMm", Number.parseInt(e.target.value, 10))
              }
              className="w-full accent-cyan-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Coil Coupling (k)</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                {couplingK.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.40"
              step="0.01"
              value={couplingK}
              onChange={(e) => updateParam("couplingK", Number.parseFloat(e.target.value))}
              className="w-full accent-emerald-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Bottom SI Telemetry Chip Strip */}
      <StudioKernelChips
        visible={true}
        title="HIGH-FREQUENCY RESONANT TRANSFORMER"
        chips={[
          {
            label: "V_secondary",
            value: `${secondaryVoltageMv}`,
            unit: "MV",
            tone: "hot",
          },
          {
            label: "f_resonant",
            value: `${resonantFreqKhz.toFixed(1)}`,
            unit: "kHz",
          },
          {
            label: "Streamer Length",
            value: `${streamerLengthInches}"`,
            unit: `(${streamerLengthMeters} m)`,
          },
          { label: "V_primary", value: `${inputVoltageKv.toFixed(0)}`, unit: "kV" },
          { label: "Coupling (k)", value: `${couplingK.toFixed(2)}` },
          { label: "Secondary", value: `${secondaryTurns}`, unit: "turns" },
          {
            label: "State",
            value: "Quarter-Wave Helical Resonance",
            tone: "hot",
          },
        ]}
      />
    </div>
  );
}
