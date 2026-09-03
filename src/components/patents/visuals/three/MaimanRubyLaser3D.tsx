"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { EnergyFlowStrip } from "@/components/patents/EnergyFlowStrip";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { stepMaimanRubyLaser } from "@/physics/catalogKernels";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import { energyChannelsFor } from "@/physics/energyChannels";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
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
  iso: { pos: [10, 8, 14], target: [1.7, 0.2, 0] },
  ruby_rod: { pos: [4.5, 2.0, 5.0], target: [3, 0.4, 0] },
  flashlamp: { pos: [1.5, 3.5, 4.0], target: [2.5, 0.4, 0] },
  resonator: { pos: [9.0, 1.2, 2.0], target: [6.0, 0.4, 0] },
  top: { pos: [3.0, 16.0, 0.1], target: [3, 0.4, 0] },
};

function cameraForViewport(preset: CameraPreset, width: number) {
  const camera = CAMERA_PRESETS[preset];
  if (width >= 520) return camera;
  const scale = preset === "iso" ? 1.32 : 1.16;
  return {
    pos: camera.pos.map((value, index) =>
      Number((camera.target[index] + (value - camera.target[index]) * scale).toFixed(3)),
    ) as [number, number, number],
    target: camera.target,
  };
}

export function MaimanRubyLaser3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { params, effectiveParams, claimStates, claimConstraintResult, updateParam } =
    usePatentPhysics("us-3353115-maiman-ruby-laser");
  const pumpEnergyJoules = params.pumpEnergyJoules ?? 150;
  const crystalTemperatureKelvin = params.crystalTemperatureKelvin ?? 300;
  const outputMirrorReflectivity = params.outputMirrorReflectivity ?? 0.92;
  const flashDurationMs = params.flashDurationMs ?? 1.0;
  const rodLengthCm = params.rodLengthCm ?? 5.0;

  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [isFiring, setIsFiring] = useState(false);
  const isFiringRef = useRef(false);
  const { isAudioMuted, toggleSound } = usePatentAudio();

  const live = useLiveSimParams({
    pumpEnergyJoules: effectiveParams.pumpEnergyJoules ?? pumpEnergyJoules,
    flashDurationMs: effectiveParams.flashDurationMs ?? flashDurationMs,
    rodLengthCm: effectiveParams.rodLengthCm ?? rodLengthCm,
    outputMirrorReflectivity: effectiveParams.outputMirrorReflectivity ?? outputMirrorReflectivity,
    crystalTemperatureKelvin: effectiveParams.crystalTemperatureKelvin ?? crystalTemperatureKelvin,
    isCutaway,
  });
  // Shared transport tape: optical pumping state publishes to the bus.
  useFrankenSimPhysics("us-3353115-maiman-ruby-laser", {
    domain: "optics_waves",
    refusal: {
      isRefused: claimConstraintResult.activeFailures.length > 0,
      reason: claimConstraintResult.refusalWarning ?? undefined,
    },
  });

  const studioRef = useRef<StudioContext | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = cameraForViewport(preset, containerRef.current?.clientWidth ?? 800);
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const metrics = stepMaimanRubyLaser({
    pumpEnergyJoules: effectiveParams.pumpEnergyJoules,
    flashDurationMs: effectiveParams.flashDurationMs,
    rodLengthCm: effectiveParams.rodLengthCm,
    outputMirrorReflectivity: effectiveParams.outputMirrorReflectivity,
    crystalTemperatureKelvin: effectiveParams.crystalTemperatureKelvin,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const iso = cameraForViewport("iso", container.clientWidth);
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
    const studioClock = createStudioClock();

    const animate = (nowMs: number) => {
      animId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const { dt } = studioClock.pump(nowMs);

      if (isFiringRef.current) {
        // Millisecond laser physics is intentionally time-dilated for human
        // vision; the relative duration control still lengthens the display.
        const displayPulseDurationSeconds = 0.65 + 0.2 * live.current.flashDurationMs;
        flashPhase += dt / displayPulseDurationSeconds;
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
    animId = requestAnimationFrame(animate);

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
          <div className="absolute left-3 right-3 top-3 z-10 flex flex-nowrap gap-1 overflow-x-auto rounded-xl border border-parchment-300 bg-white/85 p-1 text-[10px] shadow-sm backdrop-blur-md transition-opacity scrollbar-none dark:border-ink-700 dark:bg-ink-900/85 sm:left-4 sm:right-auto sm:top-4 sm:max-w-[calc(100%-28rem)] sm:gap-1.5 sm:p-1.5 sm:text-xs">
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
                className={`min-h-9 px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
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
        <div className="pointer-events-auto absolute right-3 top-16 z-10 flex max-w-[calc(100%-1.5rem)] flex-wrap items-center justify-end gap-1.5 sm:right-4 sm:top-4 sm:max-w-[26rem] sm:gap-2">
          <button
            type="button"
            onClick={triggerLaserPulse}
            disabled={isFiring}
            className={`min-h-9 p-1.5 sm:px-3 sm:py-2 rounded-xl backdrop-blur-md border font-sans text-xs font-bold transition-all shadow-sm ${
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
            className="min-h-9 p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            aria-label={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            className={`min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
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
            className={`min-h-9 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              showUiOverlay
                ? "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
                : "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-700"
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
            className="min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
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
                {isFiring
                  ? metrics.isLasing
                    ? "COHERENT 694.3 nm"
                    : "FLUORESCENCE ONLY"
                  : metrics.isLasing
                    ? "ABOVE THRESHOLD — READY"
                    : "SUB-THRESHOLD"}
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

        {/* Bottom SI Telemetry Chip Strip */}
        <StudioKernelChips
          side="right"
          visible={showUiOverlay}
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
              value: isFiring
                ? metrics.isLasing
                  ? "Lasing Cascade"
                  : "Fluorescence Only"
                : metrics.isLasing
                  ? "Ready — Trigger Flash"
                  : "Sub-threshold",
              tone: metrics.isLasing ? "hot" : "ok",
            },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <SensitivitySlider
            id="pumpEnergy"
            patentId="us-3353115-maiman-ruby-laser"
            paramKey="pumpEnergyJoules"
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
            paramKey="crystalTemperatureKelvin"
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
            paramKey="outputMirrorReflectivity"
            label="Coupler Reflectivity"
            value={outputMirrorReflectivity}
            min={0.7}
            max={0.98}
            step={0.01}
            unit=""
            onChange={(val) => updateParam("outputMirrorReflectivity", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="maimanFlashDuration"
            patentId="us-3353115-maiman-ruby-laser"
            paramKey="flashDurationMs"
            label="Flash Duration"
            value={flashDurationMs}
            min={0.5}
            max={3}
            step={0.1}
            unit="ms"
            onChange={(val) => updateParam("flashDurationMs", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="maimanRodLength"
            patentId="us-3353115-maiman-ruby-laser"
            paramKey="rodLengthCm"
            label="Ruby Rod Length"
            value={rodLengthCm}
            min={2}
            max={10}
            step={0.5}
            unit="cm"
            onChange={(val) => updateParam("rodLengthCm", val)}
            allParams={params}
          />
        </div>

        <ClaimConstraintToggle
          patentId="us-3353115-maiman-ruby-laser"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            updateParam(claimConstraintStateParamId(claimNo), active ? 1 : 0)
          }
          className="mt-2"
        />

        {claimConstraintResult.activeFailures.length > 0 ? (
          <div
            role="status"
            className="mt-2 space-y-1 rounded-lg border border-rose-500/40 bg-rose-500/10 p-3"
          >
            {claimConstraintResult.activeFailures.map((failure) => (
              <p key={failure} className="text-xs leading-relaxed text-rose-900 dark:text-rose-100">
                {failure}
              </p>
            ))}
            <p className="text-[11px] leading-relaxed text-rose-800 dark:text-rose-200">
              Effective Claim 1 probe: {effectiveParams.pumpEnergyJoules?.toFixed(0)} J. The raw{" "}
              {pumpEnergyJoules.toFixed(0)} J scenario remains stored so restoring the claim does
              not erase the visitor&apos;s setting.
            </p>
          </div>
        ) : null}

        <div className="mt-3">
          <EnergyFlowStrip
            title="Scenario energy rate · common flash interval"
            channels={energyChannelsFor("us-3353115-maiman-ruby-laser", effectiveParams)}
          />
        </div>
      </div>
    </div>
  );
}
