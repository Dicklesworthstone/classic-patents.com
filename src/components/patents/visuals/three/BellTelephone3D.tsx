"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { stepBellTelephone } from "@/physics/catalogKernels";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { createStudioClock } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { buildBellTelephoneModel, updateBellTelephoneKinematics } from "./bellTelephoneModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset =
  | "iso"
  | "speaking_horn"
  | "liquid_transmitter"
  | "battery_cells"
  | "diaphragm_wire"
  | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [11, 8, 14], target: [0, 0, 0] },
  speaking_horn: { pos: [-4.5, 1.8, 4.0], target: [-1.4, 0.5, 0] },
  liquid_transmitter: { pos: [3.5, 1.2, 3.8], target: [2.0, -1.0, 0] },
  battery_cells: { pos: [-3.5, 0.5, 4.5], target: [-2.5, -1.5, 1.8] },
  diaphragm_wire: { pos: [-0.5, 1.5, 2.8], target: [0, 0, 0] },
  top: { pos: [0, 11.0, 0.1], target: [0, 0, 0] },
};

export const BellTelephone3D = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  const { params, updateParam } = usePatentPhysics("us-174465-bell-telephone");
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const voiceAmplitudeDb = params.voiceAmplitude ?? 75;
  const acousticFrequencyHz = params.acousticFrequencyHz ?? 440;
  const batteryVoltage = params.batteryVoltage ?? 6.0;
  const liquidConductivity = params.liquidConductivity ?? 1.2;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  const bell = stepBellTelephone({
    voiceAmplitude: voiceAmplitudeDb,
    airGap: params.airGap ?? 0.35,
    batteryVoltage,
    liquidConductivity,
    acousticFrequencyHz,
  });

  const live = useLiveSimParams({
    voiceAmplitudeDb,
    airGapMm: params.airGap ?? 0.35,
    acousticFrequencyHz,
    acousticDisplayOmegaRadPerS: bell.acousticDisplayOmegaRadPerS,
    diaphragmStudioScale: bell.diaphragmStudioScale,
    electronStudioSpeed: bell.electronStudioSpeed,
    waveAdvancePerS: bell.waveAdvancePerS,
    showAcousticWaves: true,
    isCutaway,
    isAudioMuted,
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

    const model = buildBellTelephoneModel();
    scene.add(model.rootGroup);

    // Animation Loop
    let reqId: number;
    const clock = createStudioClock();

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      const { dt: delta, simTimeSec: timeSec } = clock.pump(now);
      const p = live.current;

      updateBellTelephoneKinematics(
        model,
        delta,
        timeSec,
        p.acousticDisplayOmegaRadPerS,
        p.diaphragmStudioScale,
        p.electronStudioSpeed,
        p.showAcousticWaves,
        p.isCutaway,
        p.voiceAmplitudeDb,
        p.acousticFrequencyHz,
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
      <div className="sr-only">Alexander Graham Bell Liquid Transmitter Telephone 3D</div>
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
                ["speaking_horn", "Speaking Cone"],
                ["liquid_transmitter", "Liquid Transmitter"],
                ["diaphragm_wire", "Diaphragm & Needle"],
                ["battery_cells", "Battery Cells"],
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

        {/* Top Right Tool Bar */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Solid Apparatus" : "Cutaway View"}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm text-xs font-sans flex items-center gap-1 ${
              isCutaway
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">{isCutaway ? "Cutaway" : "Solid"}</span>
          </button>

          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            aria-label={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
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
            title={showUiOverlay ? "Hide Overlay UI (Clean 3D View)" : "Show Overlay UI"}
            aria-label={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
          >
            {showUiOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                Voice Acoustic Freq:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {acousticFrequencyHz} Hz
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Diaphragm Deflection:</span>
              <span className="font-bold text-cyan-800 dark:text-cyan-400">
                {bell.diaphragmUm.toFixed(2)} µm
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Baseline Current:</span>
              <span className="font-bold text-emerald-800 dark:text-emerald-400">
                {bell.currentBaselineMa.toFixed(1)} mA
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">ΔR Modulation:</span>
              <span className="text-purple-800 dark:text-purple-400 font-bold">
                {bell.resistanceModulationOhms.toFixed(1)} Ω
              </span>
            </div>
          </div>
        )}

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="Bell magneto-variable resistance acoustics"
          chips={[
            { label: "Frequency", value: String(acousticFrequencyHz), unit: "Hz" },
            { label: "Diaphragm Deflection", value: bell.diaphragmUm.toFixed(2), unit: "µm" },
            { label: "Baseline Resistance", value: bell.baseResistanceOhms.toFixed(1), unit: "Ω" },
            { label: "ΔR Modulation", value: bell.resistanceModulationOhms.toFixed(1), unit: "Ω" },
            {
              label: "Baseline Current",
              value: bell.currentBaselineMa.toFixed(1),
              unit: "mA",
            },
            { label: "Modulated Current", value: bell.modulatedMa.toFixed(2), unit: "mA" },
            { label: "Battery Voltage", value: batteryVoltage.toFixed(1), unit: "V" },
            { label: "Liquid Conductivity", value: liquidConductivity.toFixed(2), unit: "S/m" },
            {
              label: "Wave crate",
              value: crateSource === "wasm" ? "fs-fft" : "ts-wave-fallback",
            },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <SensitivitySlider
            id="bellVoiceAmplitude"
            patentId="us-174465-bell-telephone"
            paramKey="voiceAmplitude"
            label="Voice Pressure"
            value={voiceAmplitudeDb}
            min={40}
            max={95}
            step={1}
            unit=" dB"
            onChange={(val) => updateParam("voiceAmplitude", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="bellAcousticFreq"
            patentId="us-174465-bell-telephone"
            paramKey="acousticFrequencyHz"
            label="Voice Frequency"
            value={acousticFrequencyHz}
            min={200}
            max={800}
            step={10}
            unit=" Hz"
            onChange={(val) => updateParam("acousticFrequencyHz", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="bellBatteryVoltage"
            patentId="us-174465-bell-telephone"
            paramKey="batteryVoltage"
            label="Battery Voltage"
            value={batteryVoltage}
            min={1.0}
            max={12.0}
            step={0.5}
            unit=" V"
            onChange={(val) => updateParam("batteryVoltage", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="bellLiquidConductivity"
            patentId="us-174465-bell-telephone"
            paramKey="liquidConductivity"
            label="Liquid Conductivity"
            value={liquidConductivity}
            min={0.2}
            max={3.0}
            step={0.1}
            unit=" S/m"
            onChange={(val) => updateParam("liquidConductivity", val)}
            allParams={params}
          />
        </div>

        <ClaimConstraintToggle
          patentId="us-174465-bell-telephone"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-174465-bell-telephone"
          params={params}
          className="mt-3"
        />
      </div>
    </div>
  );
});
