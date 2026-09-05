"use client";

import { Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { stepDeForestAudion } from "@/physics/catalogKernels";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import { createStudioClock } from "@/physics/tickScheduler";
import type { SemiconductorState } from "@/physics/types";
import {
  globalTransportBus,
  type TapeUpdater,
  useFrankenSimPhysics,
} from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { articulateDeForestAudionModel, buildDeForestAudionModel } from "./deForestAudionModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { StudioOverlayActionToolbar } from "./StudioOverlayActionToolbar";
import { createOrbitingStudioOverlayActions } from "./studioOverlayActions";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "isometric" | "gridControl" | "filament" | "plateAnode";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  // Pull the opening view back from the bulb so the envelope gives context
  // without swallowing the plate, grid, and filament.
  isometric: { pos: [0, 0.8, 5.2], target: [0, 0.1, 0] },
  gridControl: { pos: [0, 0.4, 2.0], target: [0, 0.2, 0] },
  filament: { pos: [-1.2, 0.4, 1.8], target: [-0.35, 0.2, 0] },
  plateAnode: { pos: [1.2, 0.4, 1.8], target: [0.4, 0.2, 0] },
};

const IDLE_SEMI: SemiconductorState = {
  biasVoltageVolts: 0,
  currentGainAlpha: 0,
  holeDiffusionCoefficientCm2ps: 0,
  chargeTransferEfficiencyPct: 0,
  clockPeriodNs: 0,
  busBandwidthMbps: 0,
  electronVelocityMps: 0,
  relativisticFractionC: 0,
  voltageGain: 0,
  powerGainDb: 0,
  collectorCurrentMa: 0,
};

export function DeForestAudion3D() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  // The Audion's teaching surface is inside the evacuated envelope. Start in
  // the explicitly labeled glass cutaway, while retaining a solid-envelope
  // toggle for visitors who want the exterior apparatus.
  const [isCutaway, setIsCutaway] = useState(true);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("isometric");
  const [isRotating, setIsRotating] = useState(false);
  const { isAudioMuted, toggleSound } = usePatentAudio();

  const { params, effectiveParams, claimStates, updateParam } = usePatentPhysics(
    "us-879532-de-forest-audion",
  );
  const claim1Active = claimStates[1] ?? true;

  const plateVoltageV = params.plateVoltageV ?? 45;
  const gridBiasVoltageV = params.gridBiasVoltageV ?? -1.5;
  const filamentCurrentA = params.filamentCurrentA ?? 1.0;
  const gridSignalAmplitudeMv = params.gridSignalAmplitudeMv ?? 50;
  const loadResistanceKOhms = params.loadResistanceKOhms ?? 20;

  const sim = stepDeForestAudion({
    claim1GridPresent: claim1Active,
    plateVoltageV,
    gridBiasVoltageV,
    filamentCurrentA,
    gridSignalAmplitudeMv,
    loadResistanceKOhms,
  });

  const live = useLiveSimParams({
    claim1GridPresent: sim.claim1GridPresent,
    gridBiasVoltageV,
    filamentTemperatureK: sim.filamentTemperatureK,
    plateCurrentMa: sim.plateCurrentMa,
    voltageGain: sim.voltageGain,

    isConducting: sim.isConducting,
    electronStreamAdvancePerFrame: sim.electronStreamAdvancePerFrame,
    isRotating,
    isCutaway,
  });

  // Shared transport tape: the triode's operating point publishes to the
  // patentId-keyed bus so every consumer reads one deterministic envelope.
  useFrankenSimPhysics("us-879532-de-forest-audion", {
    domain: "semiconductor_carrier",
    timestampMs: 0,
    timeStepDt: 1 / 60,
    refusal: {
      isRefused: !claim1Active,
      reason: claim1Active
        ? undefined
        : "Claim 1 comparison withholds the interposed conducting member; active voltage-gain telemetry is refused.",
    },
    semi: { ...IDLE_SEMI },
  });

  // One tape-bound publisher (br-ixl.3): the audion kernel is a pure
  // operating-point evaluation, so the registered updater re-derives it from
  // the live params each tick; the render loop keeps its dt-paced articulation.
  useEffect(() => {
    const integrate: TapeUpdater = (prev) => {
      return {
        refusal: {
          isRefused: !live.current.claim1GridPresent,
          reason: live.current.claim1GridPresent
            ? undefined
            : "Claim 1 comparison withholds the interposed conducting member; active voltage-gain telemetry is refused.",
        },
        semi: {
          ...(prev.semi ?? IDLE_SEMI),
          biasVoltageVolts: live.current.gridBiasVoltageV,
          voltageGain: live.current.voltageGain,
          collectorCurrentMa: live.current.plateCurrentMa,
        },
      };
    };
    const unregister = globalTransportBus.registerUpdater(
      "us-879532-de-forest-audion",
      integrate,
      "TS_FALLBACK",
    );
    return unregister;
  }, [live]);

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
      if (!studio.isVisible()) return;
      const { simTimeSec: time } = clock.pump(now);
      const p = live.current;

      if (p.isRotating) {
        nodes.root.rotation.y += 0.005;
      }
      studio.controls.update();

      articulateDeForestAudionModel(
        nodes,
        {
          claim1GridPresent: p.claim1GridPresent,
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
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-9.5rem)] sm:max-w-[calc(100%-28rem)] gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> View:
            </span>
            {(["isometric", "gridControl", "filament", "plateAnode"] as CameraPreset[]).map(
              (preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePresetChange(preset)}
                  className={`min-h-9 px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
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
        <StudioOverlayActionToolbar
          actions={createOrbitingStudioOverlayActions({
            isAudioMuted,
            onToggleSound: () => {
              toggleSound();
              soundEngine.playSwitchClick();
            },
            isRotating,
            onToggleRotating: () => setIsRotating(!isRotating),
            isCutaway,
            onToggleCutaway: () => setIsCutaway(!isCutaway),
            cutawayTitle: isCutaway ? "Solid Envelope" : "Transparent Glass Cutaway",
            showUiOverlay,
            onToggleUiOverlay: () => setShowUiOverlay(!showUiOverlay),
            onResetCamera: () => handlePresetChange("isometric"),
          })}
        />

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

        {/* Bottom SI Telemetry Chip Strip */}
        <StudioKernelChips
          side="right"
          visible={showUiOverlay}
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
              value: !claim1Active
                ? "Two-Electrode Diode — No Gain"
                : sim.isConducting
                  ? "Active Linear Triode"
                  : "Cutoff",
              tone: claim1Active && sim.isConducting ? "ok" : "warn",
            },
          ]}
        />
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

          <SensitivitySlider
            id="filamentCurrent"
            patentId="us-879532-de-forest-audion"
            paramKey="filamentCurrentA"
            label="Filament Current"
            value={filamentCurrentA}
            min={0.5}
            max={1.5}
            step={0.05}
            unit="A"
            onChange={(val) => updateParam("filamentCurrentA", val)}
            allParams={params}
          />
        </div>

        <ClaimConstraintToggle
          patentId="us-879532-de-forest-audion"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            updateParam(claimConstraintStateParamId(claimNo), active ? 1 : 0)
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-879532-de-forest-audion"
          params={effectiveParams}
          className="mt-3"
        />
      </div>
    </div>
  );
}
