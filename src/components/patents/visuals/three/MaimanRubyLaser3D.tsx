"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { stepMaimanRubyLaser } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { createMaimanRubyLaserModel } from "./maimanRubyLaserModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "ruby_rod" | "flashlamp" | "resonator" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [10, 8, 14], target: [3, 0.4, 0] },
  ruby_rod: { pos: [4.5, 2.0, 5.0], target: [3, 0.4, 0] },
  flashlamp: { pos: [1.5, 3.5, 4.0], target: [2.5, 0.4, 0] },
  resonator: { pos: [9.0, 1.2, 2.0], target: [6.0, 0.4, 0] },
  top: { pos: [3.0, 16.0, 0.1], target: [3, 0.4, 0] },
};

export function MaimanRubyLaser3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { params, updateParam } = usePatentPhysics("us-3353115-maiman-ruby-laser");
  const pumpEnergyJoules = params.pumpEnergyJoules ?? 150;
  const crystalTemperatureKelvin = params.crystalTemperatureKelvin ?? 300;
  const outputMirrorReflectivity = params.outputMirrorReflectivity ?? 0.92;
  const flashDurationMs = params.flashDurationMs ?? 1.0;
  const rodLengthCm = params.rodLengthCm ?? 5.0;

  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState(false);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [isFiring, setIsFiring] = useState(false);
  const isFiringRef = useRef(false);
  const { isAudioMuted, toggleSound } = usePatentAudio();

  const live = useLiveSimParams({
    pumpEnergyJoules,
    flashDurationMs,
    rodLengthCm,
    outputMirrorReflectivity,
    crystalTemperatureKelvin,
    isCutaway,
  });

  const studioRef = useRef<StudioContext | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const metrics = stepMaimanRubyLaser({
    pumpEnergyJoules: live.current.pumpEnergyJoules,
    flashDurationMs: live.current.flashDurationMs,
    rodLengthCm: live.current.rodLengthCm,
    outputMirrorReflectivity: live.current.outputMirrorReflectivity,
    crystalTemperatureKelvin: live.current.crystalTemperatureKelvin,
  });

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

    const laserModel = createMaimanRubyLaserModel();
    studio.scene.add(laserModel.nodes.group);

    let animId = 0;
    let flashPhase = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (isFiringRef.current) {
        flashPhase += 0.05;
        if (flashPhase > 1.0) {
          flashPhase = 0;
          setIsFiring(false);
          isFiringRef.current = false;
        }
      }

      laserModel.update(
        {
          pumpEnergyJoules: live.current.pumpEnergyJoules,
          flashDurationMs: live.current.flashDurationMs,
          rodLengthCm: live.current.rodLengthCm,
          outputMirrorReflectivity: live.current.outputMirrorReflectivity,
          crystalTemperatureKelvin: live.current.crystalTemperatureKelvin,
        },
        flashPhase,
        isFiringRef.current,
      );

      laserModel.setCutaway?.(live.current.isCutaway ?? false);

      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      laserModel.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  const triggerLaserPulse = () => {
    if (isFiringRef.current) return;
    setIsFiring(true);
    isFiringRef.current = true;
    if (!isAudioMuted) {
      soundEngine.playSparkDischarge(0.4);
    }
  };

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Theodore Maiman Ruby Laser 3D</div>
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
                ["iso", "Isometric"],
                ["ruby_rod", "Ruby Crystal Rod"],
                ["flashlamp", "Helical Xenon Lamp"],
                ["resonator", "Fabry-Pérot Cavity"],
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

        {/* Top-Right Action Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 max-w-[90%] pointer-events-auto">
          <ClaimConstraintToggle
            patentId="us-3353115-maiman-ruby-laser"
            claimStates={claimStates}
            onToggleClaim={(c: number, active: boolean) => {
              setClaimStates((prev) => ({ ...prev, [c]: active }));
              updateParam("pumpEnergyJoules", active ? 150 : 20);
            }}
          />
          <button
            type="button"
            onClick={triggerLaserPulse}
            disabled={isFiring}
            className={`p-1.5 sm:px-3 sm:py-2 rounded-xl backdrop-blur-md border font-sans text-xs font-bold transition-all shadow-sm ${
              isFiring
                ? "bg-rose-600 text-white border-rose-500 shadow-rose-500/50 animate-pulse"
                : "bg-rose-700 text-white border-rose-800 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-500"
            }`}
          >
            {isFiring ? "⚡ Discharging..." : "⚡ Trigger Flashlamp"}
          </button>

          <button
            type="button"
            onClick={() => {
              toggleSound();
              soundEngine.playSwitchClick();
            }}
            className="p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            aria-label={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              isCutaway
                ? "bg-cyan-600 text-white border-cyan-700 shadow-md ring-2 ring-cyan-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
            title={isCutaway ? "Solid Cavity Housing" : "Transparent Resonator Cutaway"}
            aria-label={isCutaway ? "Solid Cavity Housing" : "Transparent Resonator Cutaway"}
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
                Emission:
              </span>
              <span
                className={`font-bold ${metrics.isLasing ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}`}
              >
                {metrics.isLasing ? "COHERENT 694.3 nm" : "SUB-THRESHOLD"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Peak Power:</span>
              <span className="text-rose-700 dark:text-rose-400 font-bold">
                {metrics.laserPeakPowerKw.toFixed(1)} kW
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Pulse Energy:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {metrics.laserPulseEnergyJoules.toFixed(2)} J
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Threshold:</span>
              <span className="text-ink-700 dark:text-ink-300 font-bold">
                {metrics.thresholdPumpEnergyJoules.toFixed(0)} J
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SensitivitySlider
            id="pumpEnergy"
            patentId="us-3353115-maiman-laser"
            paramKey="pumpPowerWatts"
            label="Xenon Flash Energy"
            value={pumpEnergyJoules}
            min={50}
            max={500}
            step={10}
            unit="J"
            onChange={(val) => updateParam("pumpEnergyJoules", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="maimanTemp"
            patentId="us-3353115-maiman-ruby-laser"
            paramKey="temperature"
            label="Crystal Temperature"
            value={crystalTemperatureKelvin}
            min={77}
            max={400}
            step={5}
            unit="K"
            onChange={(val) => updateParam("crystalTemperatureKelvin", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="maimanMirror"
            patentId="us-3353115-maiman-ruby-laser"
            paramKey="reflectivity"
            label="Coupler Reflectivity"
            value={outputMirrorReflectivity}
            min={0.7}
            max={0.98}
            step={0.01}
            unit=""
            onChange={(val) => updateParam("outputMirrorReflectivity", val)}
            allParams={params}
          />
        </div>

        <ClaimConstraintToggle
          patentId="us-3353115-maiman-ruby-laser"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-3353115-maiman-ruby-laser"
          params={params}
          className="mt-3"
        />
      </div>

      {/* Bottom SI Telemetry Chip Strip */}
      <StudioKernelChips
        visible={true}
        title="RUBY LASER QUANTUM OPTICS"
        chips={[
          { label: "Wavelength", value: "694.3", unit: "nm" },
          { label: "P_peak", value: metrics.laserPeakPowerKw.toFixed(1), unit: "kW" },
          { label: "E_pulse", value: metrics.laserPulseEnergyJoules.toFixed(2), unit: "J" },
          { label: "E_thresh", value: metrics.thresholdPumpEnergyJoules.toFixed(0), unit: "J" },
          { label: "R_out", value: (outputMirrorReflectivity * 100).toFixed(0), unit: "%" },
          { label: "T_crystal", value: String(crystalTemperatureKelvin), unit: "K" },
          {
            label: "State",
            value: metrics.isLasing ? "Lasing Cascade" : "Spontaneous Decay",
            tone: metrics.isLasing ? "hot" : "ok",
          },
        ]}
      />
    </div>
  );
}
