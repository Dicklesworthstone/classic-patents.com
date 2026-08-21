"use client";

import { Camera, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { stepFessendenWireless } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import {
  articulateFessendenWireless,
  buildFessendenWirelessModel,
  type FessendenWirelessModelNodes,
} from "./fessendenWirelessModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

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
  const [showUiOverlay, setShowUiOverlay] = useState(true);

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

  const live = useLiveSimParams({
    carrierFreqKhz,
    audioModPct,
    isRotating,
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

    let lastTime: number | null = null;
    const animate = (now: number) => {
      const dt = lastTime === null ? 0.016 : Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;
      timeRef.current += dt;

      const p = live.current;
      if (p.isRotating) {
        nodes.root.rotation.y += 0.0044;
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

      pointGlow.color.setHex(p.isResonant ? 0x10b981 : 0xf59e0b);
      pointGlow.intensity = (p.radiatedPowerWatts / 1000) * 2.0;

      studio.renderer.render(studio.scene, studio.camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      nodes.materials.forEach((m) => {
        m.dispose();
      });
      studio.cleanup();
      studioRef.current = null;
      nodesRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Right Action Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap justify-end gap-1.5 sm:gap-2 max-w-[90%]">
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
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              showUiOverlay
                ? "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
                : "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-600"
            }`}
            title={showUiOverlay ? "Hide Overlay Telemetry" : "Show Overlay Telemetry"}
            aria-label={showUiOverlay ? "Hide Overlay Telemetry" : "Show Overlay Telemetry"}
          >
            <Zap className="w-3.5 h-3.5 inline sm:mr-1" />
            <span className="hidden md:inline">{showUiOverlay ? "Hide HUD" : "Show HUD"}</span>
          </button>
        </div>

        {/* Camera Views Bar */}
        {showUiOverlay && (
          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-1.5rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> View:
            </span>
            {(["isometric", "alternator", "cageAntenna", "liquidBarretter"] as CameraPreset[]).map(
              (preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => handlePresetChange(preset)}
                  className={`px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
                    cameraPreset === preset
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-ink-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                  }`}
                >
                  {preset.replace(/([A-Z])/g, " $1")}
                </button>
              ),
            )}
          </div>
        )}

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

      {showUiOverlay && (
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-t border-parchment-300 dark:border-ink-800 bg-parchment-100/80 dark:bg-ink-900/60 rounded-b-2xl text-xs font-mono">
          <div className="flex flex-col gap-1">
            <label htmlFor="carrierFreq3d" className="text-ink-700 dark:text-parchment-300">
              Alternator Frequency: {carrierFreqKhz} kHz
            </label>
            <input
              id="carrierFreq3d"
              type="range"
              min="50"
              max="100"
              step="1"
              value={carrierFreqKhz}
              onChange={(e) => updateParam("carrierFrequencyKhz", Number(e.target.value))}
              className="h-1.5 w-36 accent-amber-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="audioMod3d" className="text-ink-700 dark:text-parchment-300">
              Audio Modulation: {audioModPct}%
            </label>
            <input
              id="audioMod3d"
              type="range"
              min="10"
              max="100"
              step="5"
              value={audioModPct}
              onChange={(e) => updateParam("audioModulationPct", Number(e.target.value))}
              className="h-1.5 w-32 accent-amber-500"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="antennaTuning3d" className="text-ink-700 dark:text-parchment-300">
              Antenna Inductance: {antennaTuningUh} µH
            </label>
            <input
              id="antennaTuning3d"
              type="range"
              min="200"
              max="800"
              step="10"
              value={antennaTuningUh}
              onChange={(e) => updateParam("antennaTuningUh", Number(e.target.value))}
              className="h-1.5 w-32 accent-amber-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
