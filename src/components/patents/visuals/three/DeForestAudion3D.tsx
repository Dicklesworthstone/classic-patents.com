"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { stepDeForestAudion } from "@/physics/catalogKernels";
import { createStudioClock } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { articulateDeForestAudionModel, buildDeForestAudionModel } from "./deForestAudionModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "isometric" | "gridControl" | "filament" | "plateAnode";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  isometric: { pos: [0, 1.5, 4.0], target: [0, 0.2, 0] },
  gridControl: { pos: [0, 0.4, 2.0], target: [0, 0.2, 0] },
  filament: { pos: [-1.2, 0.4, 1.8], target: [-0.35, 0.2, 0] },
  plateAnode: { pos: [1.2, 0.4, 1.8], target: [0.4, 0.2, 0] },
};

export function DeForestAudion3D() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<ReturnType<typeof createThreeStudioScene> | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState(false);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("isometric");
  const [isRotating, setIsRotating] = useState(false);
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  const { params, updateParam } = usePatentPhysics("us-879532-de-forest-audion");

  const plateVoltageV = params.plateVoltageV ?? 45;
  const gridBiasVoltageV = params.gridBiasVoltageV ?? -1.5;
  const filamentCurrentA = params.filamentCurrentA ?? 1.0;
  const gridSignalAmplitudeMv = params.gridSignalAmplitudeMv ?? 50;
  const loadResistanceKOhms = params.loadResistanceKOhms ?? 20;

  const sim = stepDeForestAudion({
    plateVoltageV,
    gridBiasVoltageV,
    filamentCurrentA,
    gridSignalAmplitudeMv,
    loadResistanceKOhms,
  });

  const live = useLiveSimParams({
    filamentTemperatureK: sim.filamentTemperatureK,
    plateCurrentMa: sim.plateCurrentMa,
    voltageGain: sim.voltageGain,
    isConducting: sim.isConducting,
    electronStreamAdvancePerFrame: sim.electronStreamAdvancePerFrame,
    isRotating,
    isCutaway,
  });

  const handlePresetChange = (preset: CameraPreset) => {
    setCameraPreset(preset);
    const targetConfig = CAMERA_PRESETS[preset];
    if (studioRef.current) {
      studioRef.current.controls.setView(targetConfig.pos, targetConfig.target);
    }
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

    const nodes = buildDeForestAudionModel();
    studio.scene.add(nodes.root);

    let animId = 0;
    const clock = createStudioClock();

    const animate = (now: number) => {
      animId = requestAnimationFrame(animate);
      const { simTimeSec: time } = clock.pump(now);
      const p = live.current;

      if (p.isRotating) {
        nodes.root.rotation.y += 0.005;
      }
      studio.controls.update();

      articulateDeForestAudionModel(
        nodes,
        {
          filamentTemperatureK: p.filamentTemperatureK,
          plateCurrentMa: p.plateCurrentMa,
          voltageGain: p.voltageGain,
          isConducting: p.isConducting,
          electronStreamAdvancePerFrame: p.electronStreamAdvancePerFrame,
        },
        time,
      );

      nodes.setCutaway?.(p.isCutaway ?? false);

      studio.renderer.render(studio.scene, studio.camera);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      nodes.materials.forEach((m) => {
        m.dispose();
      });
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Lee de Forest Audion Triode 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-14rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> View:
            </span>
            {(["isometric", "gridControl", "filament", "plateAnode"] as CameraPreset[]).map(
              (preset) => (
                <button
                  key={preset}
                  type="button"
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
            title={isCutaway ? "Solid Envelope" : "Transparent Glass Cutaway"}
            aria-label={isCutaway ? "Solid Envelope" : "Transparent Glass Cutaway"}
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
                Voltage Gain:
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                {sim.voltageGain}x
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Plate Current:</span>
              <span className="text-cyan-800 dark:text-cyan-400 font-bold">
                {sim.plateCurrentMa} mA
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Transconductance:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {sim.dynamicTransconductanceMicromhos} µmhos
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Cutoff Bias:</span>
              <span className="text-rose-700 dark:text-rose-400 font-bold">
                {sim.gridCutoffVoltageV} V
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Power Gain:</span>
              <span className="text-purple-800 dark:text-purple-400 font-bold">
                {sim.powerGainDb} dB
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SensitivitySlider
            id="plateVoltage"
            patentId="us-879532-de-forest-audion"
            paramKey="plateVoltageV"
            label="Plate Anode Voltage"
            value={plateVoltageV}
            min={10}
            max={100}
            step={1}
            onChange={(val) => updateParam("plateVoltageV", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="gridBiasVoltage"
            patentId="us-879532-de-forest-audion"
            paramKey="gridBiasVoltageV"
            label="Grid Bias Voltage"
            value={gridBiasVoltageV}
            min={-5}
            max={2}
            step={0.1}
            onChange={(val) => updateParam("gridBiasVoltageV", val)}
            allParams={params}
          />

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Filament Current</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                {filamentCurrentA.toFixed(2)} A
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.05"
              value={filamentCurrentA}
              onChange={(e) => updateParam("filamentCurrentA", Number.parseFloat(e.target.value))}
              className="w-full accent-emerald-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>

        <ClaimConstraintToggle
          patentId="us-879532-de-forest-audion"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-879532-de-forest-audion"
          params={params}
          className="mt-3"
        />
      </div>

      {/* Bottom SI Telemetry Chip Strip */}
      <StudioKernelChips
        visible={true}
        title="TRIODE THERMIONIC AMPLIFICATION"
        chips={[
          { label: "V_plate", value: `${plateVoltageV.toFixed(0)}`, unit: "V" },
          { label: "V_grid", value: `${gridBiasVoltageV.toFixed(1)}`, unit: "V" },
          { label: "I_plate", value: `${sim.plateCurrentMa.toFixed(2)}`, unit: "mA" },
          { label: "Gain (A_v)", value: `${sim.voltageGain.toFixed(1)}x` },
          {
            label: "T_filament",
            value: `${sim.filamentTemperatureK.toFixed(0)}`,
            unit: "K",
          },
          {
            label: "State",
            value: sim.isConducting ? "Active Linear Triode" : "Cutoff",
            tone: sim.isConducting ? "ok" : "warn",
          },
        ]}
      />
    </div>
  );
}
