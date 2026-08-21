"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { stepFessendenWireless } from "@/physics/catalogKernels";
import { createStudioClock } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import {
  articulateFessendenWireless,
  buildFessendenWirelessModel,
  type FessendenWirelessModelNodes,
} from "./fessendenWirelessModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "isometric" | "alternator" | "cageAntenna" | "liquidBarretter";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  isometric: { pos: [3.5, 3.0, 4.5], target: [0, 1.2, 0] },
  alternator: { pos: [-1.8, 1.2, 2.0], target: [-1.8, 0.4, 0] },
  cageAntenna: { pos: [0.5, 2.2, 2.5], target: [0.5, 1.8, 0] },
  liquidBarretter: { pos: [2.0, 0.8, 1.2], target: [1.9, 0.3, 0] },
};

export function FessendenWireless3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { params, updateParam } = usePatentPhysics("us-706737-fessenden-wireless");
  const carrierFreqKhz = params.carrierFrequencyKhz ?? 75;
  const audioModPct = params.audioModulationPct ?? 65;
  const antennaTuningUh = params.antennaTuningUh ?? 450;
  const distanceKm = params.transmissionDistanceKm ?? 25;
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("isometric");
  const [isRotating, setIsRotating] = useState(false);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState(false);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const { isAudioMuted, toggleSound } = usePatentAudio();

  const studioRef = useRef<StudioContext | null>(null);
  const nodesRef = useRef<FessendenWirelessModelNodes | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  const sim = stepFessendenWireless({
    carrierFrequencyKhz: carrierFreqKhz,
    audioModulationPct: audioModPct,
    antennaTuningUh: antennaTuningUh,
    transmissionDistanceKm: distanceKm,
  });

  useEffect(() => {
    if (isAudioMuted) {
      soundEngine.stopContinuousTone();
      return;
    }
    const audioHz = sim.audioFrequencyHz;
    const sample = Math.min(1, Math.abs(sim.audioSignalCurrentMicroamps) / 80);
    soundEngine.playFieldTransducer({ kind: "am", sample, carrierHz: audioHz });
    return () => {
      soundEngine.stopContinuousTone();
    };
  }, [isAudioMuted, sim.audioFrequencyHz, sim.audioSignalCurrentMicroamps]);

  const live = useLiveSimParams({
    carrierFreqKhz,
    audioModPct,
    isRotating,
    isCutaway,
    radiatedPowerWatts: sim.radiatedPowerWatts,
    isResonant: sim.isResonant,
    waveRingDisplayRate: sim.waveRingDisplayRate,
    headsetDisplayOmegaRadPerS: sim.headsetDisplayOmegaRadPerS,
    audioEnvelopeOmegaRadPerS: sim.audioEnvelopeOmegaRadPerS,
  });

  const handlePresetChange = (preset: CameraPreset) => {
    setCameraPreset(preset);
    const { pos, target } = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(pos, target);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const overview = CAMERA_PRESETS.isometric;
    const studio = createThreeStudioScene({
      container,
      cameraPos: overview.pos,
      targetPos: overview.target,
    });
    studioRef.current = studio;

    const pointGlow = new THREE.PointLight(0x10b981, 1.5, 8);
    pointGlow.position.set(0.5, 2.0, 0);
    studio.scene.add(pointGlow);

    const nodes = buildFessendenWirelessModel();
    nodesRef.current = nodes;
    studio.scene.add(nodes.root);

    const clock = createStudioClock();
    const animate = (now: number) => {
      const { dt, simTimeSec } = clock.pump(now);
      timeRef.current = simTimeSec;

      const p = live.current;
      if (p.isRotating) {
        nodes.root.rotation.y += dt * 0.26;
      }
      studio.controls.update();

      articulateFessendenWireless(nodes, {
        timeSec: timeRef.current,
        carrierFrequencyKhz: p.carrierFreqKhz,
        radiatedPowerWatts: p.radiatedPowerWatts,
        audioModulationPct: p.audioModPct,
        isResonant: p.isResonant,
        waveRingDisplayRate: p.waveRingDisplayRate,
        headsetDisplayOmegaRadPerS: p.headsetDisplayOmegaRadPerS,
        audioEnvelopeOmegaRadPerS: p.audioEnvelopeOmegaRadPerS,
      });

      nodes.setCutaway?.(p.isCutaway ?? false);

      pointGlow.color.setHex(p.isResonant ? 0x10b981 : 0xf59e0b);
      pointGlow.intensity = (p.radiatedPowerWatts / 1000) * 2.0;

      studio.renderer.render(studio.scene, studio.camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      nodes.materials.forEach((m: THREE.Material) => {
        m.dispose();
      });
      studio.cleanup();
      studioRef.current = null;
      nodesRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Reginald Fessenden Wireless Signaling 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar & Claim Constraint Toggle */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-col gap-2 max-w-[calc(100%-14rem)] sm:max-w-none pointer-events-auto">
            <ClaimConstraintToggle
              patentId="us-706737-fessenden-wireless"
              claimStates={claimStates}
              onToggleClaim={(num, active) =>
                setClaimStates((prev) => ({ ...prev, [num]: active }))
              }
            />
            <div className="flex flex-nowrap overflow-x-auto scrollbar-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
              <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
                <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> View:
              </span>
              {(
                ["isometric", "alternator", "cageAntenna", "liquidBarretter"] as CameraPreset[]
              ).map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => handlePresetChange(preset)}
                  className={`px-2 py-1 rounded-lg transition-colors font-medium shrink-0 capitalize ${
                    cameraPreset === preset
                      ? "bg-amber-600 text-white shadow-xs font-semibold"
                      : "text-ink-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                  }`}
                >
                  {preset.replace(/([A-Z])/g, " $1")}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Top-Right Action Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
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
            onClick={() => setIsRotating(!isRotating)}
            className={`p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              isRotating
                ? "bg-amber-700 text-white border-amber-800 dark:bg-amber-600"
                : "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
            }`}
          >
            {isRotating ? "Stop Orbit" : "Auto Orbit"}
          </button>

          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              isCutaway
                ? "bg-cyan-600 text-white border-cyan-700 shadow-md ring-2 ring-cyan-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
            title={isCutaway ? "Solid Apparatus" : "Transparent Apparatus Housing Cutaway"}
            aria-label={isCutaway ? "Solid Apparatus" : "Transparent Apparatus Housing Cutaway"}
          >
            <Layers className="w-4 h-4" />
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
            onClick={() => handlePresetChange("isometric")}
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
                Resonance:
              </span>
              <span
                className={`font-bold ${sim.isResonant ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}`}
              >
                {sim.antennaResonantFreqKhz} kHz ({sim.isResonant ? "LOCKED" : "DETUNED"})
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Radiated RF:</span>
              <span className="text-cyan-800 dark:text-cyan-400 font-bold">
                {sim.radiatedPowerWatts} W
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">RF Efficiency:</span>
              <span className="text-emerald-800 dark:text-emerald-400 font-bold">
                {sim.radiationEfficiencyPct}%
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Rx Power:</span>
              <span className="text-purple-800 dark:text-purple-400 font-bold">
                {sim.receivedPowerMicrowatts} µW
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Audio SNR:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {sim.audioSnrDb} dB
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SensitivitySlider
            id="carrierFreq3d"
            patentId="us-706737-fessenden-wireless"
            paramKey="carrierFreqKhz"
            label="Alternator Frequency"
            value={carrierFreqKhz}
            min={50}
            max={100}
            step={1}
            onChange={(val) => updateParam("carrierFrequencyKhz", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="audioMod3d"
            patentId="us-706737-fessenden-wireless"
            paramKey="modDepthPct"
            label="Audio Modulation"
            value={audioModPct}
            min={10}
            max={100}
            step={5}
            onChange={(val) => updateParam("audioModulationPct", val)}
            allParams={params}
          />

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Antenna Inductance</span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {antennaTuningUh} µH
              </span>
            </div>
            <input
              id="antennaTuning3d"
              type="range"
              min="200"
              max="800"
              step="10"
              value={antennaTuningUh}
              onChange={(e) => updateParam("antennaTuningUh", Number(e.target.value))}
              className="w-full accent-cyan-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>

        <PortHamiltonianEnergyStrip
          patentId="us-706737-fessenden-wireless"
          params={params}
          className="mt-3"
        />
      </div>

      {/* Bottom SI Telemetry Chip Strip */}
      <StudioKernelChips
        visible={true}
        title="CONTINUOUS WAVE RADIO TELEPHONY"
        chips={[
          { label: "f_carrier", value: `${carrierFreqKhz.toFixed(1)}`, unit: "kHz" },
          { label: "P_radiated", value: `${sim.radiatedPowerWatts.toFixed(0)}`, unit: "W" },
          { label: "Modulation", value: `${audioModPct.toFixed(0)}%`, unit: "AM" },
          { label: "Antenna L", value: `${antennaTuningUh.toFixed(0)}`, unit: "µH" },
          {
            label: "Resonance",
            value: sim.isResonant ? "Tuned Locked" : "Detuned",
            tone: sim.isResonant ? "ok" : "warn",
          },
          { label: "Detector", value: "Liquid Barretter Electrolytic" },
        ]}
      />
    </div>
  );
}
