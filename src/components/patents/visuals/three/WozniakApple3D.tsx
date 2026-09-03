"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { stepWozniakApple } from "@/physics/catalogKernels";
import { ensureGenericWasm } from "@/physics/genericWasm";
import { createStudioClock } from "@/physics/tickScheduler";
import {
  globalTransportBus,
  type TapeUpdater,
  useFrankenSimPhysics,
} from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";
import { buildWozniakAppleModel } from "./wozniakAppleModel";

type CameraPreset = "iso" | "cpu" | "ram_matrix" | "slots" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [0, 8.0, 9.5], target: [0, 0, 0] },
  cpu: { pos: [-2.5, 3.5, 4.0], target: [-1.2, 0, 0] },
  ram_matrix: { pos: [2.5, 3.5, 4.0], target: [1.2, 0, 0] },
  slots: { pos: [0, 4.0, 5.0], target: [0, 0, 1.5] },
  top: { pos: [0, 11.0, 0.1], target: [0, 0, 0] },
};

/** Fields the render loop consumes from each Apple kernel step. */
interface WozniakStepPose {
  busDisplaySpeed: number;
}

export function WozniakApple3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);

  // Microcomputer Architecture State Controls
  const { params, updateParam } = usePatentPhysics("us-4136359-wozniak-apple");
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const [videoMode] = useState<"text" | "lores" | "hires">("lores");
  const [isCpuActive] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  useEffect(() => {
    void ensureGenericWasm();
  }, []);

  const clockFrequencyMhz =
    (params.crystalFreq as number) ?? (params.masterClockMhz as number) ?? 14.31818;
  const ramCapacityKb = (params.ramCapacityKb as number) ?? 48;

  const apple = stepWozniakApple({
    crystalFreq: clockFrequencyMhz,
    ramCapacityKb,
  });

  const _cycleTimeNs = apple.cycleTimeNs;
  const phi1VideoAccessWindowNs = apple.dramWindowNs;
  const effectiveCpuThroughputPct = apple.cpuDutyPct;
  const _colorSubcarrierMhz = apple.colorSubcarrierMhz.toFixed(4);

  const live = useLiveSimParams({
    clockFrequencyMhz,
    cpuClockMhz: apple.cpuClockMhz,
    dramWindowNs: apple.dramWindowNs,
    videoMode,
    ramCapacityKb,
    isCpuActive,
    isCutaway,
    isAudioMuted,
    phi2DisplayHz: apple.phi2DisplayHz,
    busDisplaySpeed: apple.busDisplaySpeed,
  });

  // Shared transport tape: 6502 bus-cycle state publishes to the patentId-keyed bus.
  useFrankenSimPhysics("us-4136359-wozniak-apple", {
    domain: "semiconductor_microarch",
    refusal: { isRefused: false },
  });
  const wozniakRef = useRef<WozniakStepPose | null>(null);

  useEffect(() => {
    const integrate: TapeUpdater = (_prev) => {
      const out = stepWozniakApple({
        crystalFreq: live.current.clockFrequencyMhz,
        ramCapacityKb: live.current.ramCapacityKb,
      });
      wozniakRef.current = out;
      return {
        semi: {
          biasVoltageVolts: 0,
          currentGainAlpha: 0,
          holeDiffusionCoefficientCm2ps: 0,
          chargeTransferEfficiencyPct: 0,
          clockPeriodNs: out.cycleTimeNs,
          busBandwidthMbps: out.busDisplaySpeed,
          electronVelocityMps: 0,
          relativisticFractionC: 0,
          voltageGain: 0,
          powerGainDb: 0,
          collectorCurrentMa: 0,
        },
      };
    };
    const unregister = globalTransportBus.registerUpdater(
      "us-4136359-wozniak-apple",
      integrate,
      "TS_FALLBACK",
    );
    return unregister;
  }, [live]);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const toggleSound = () => {
    toggleEngine(() => {
      soundEngine.playMicroswitchClick();
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

    const { scene, camera, renderer } = studio;

    const model = buildWozniakAppleModel();
    scene.add(model.root);

    let reqId: number;
    const clock = createStudioClock();

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const { dt: delta, simTimeSec: animTime } = clock.pump(now);
      const p = live.current;

      // Bus-owned kernel step: prefer the latest shared-tape bus state.
      const a = wozniakRef.current;
      model.updateKinematics(
        delta,
        animTime,
        a ? a.busDisplaySpeed : p.busDisplaySpeed,
        p.isCpuActive,
      );
      model.setCutaway?.(p.isCutaway ?? false);

      studio.controls.update();
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
      <div className="sr-only">Steve Wozniak Apple II Microcomputer 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-9.5rem)] sm:max-w-[calc(100%-28rem)] gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3.5 h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["cpu", "6502 CPU"],
                ["ram_matrix", "4116 RAM Bank"],
                ["slots", "Bus Slots"],
                ["top", "Motherboard"],
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

        {/* Top Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <button
            aria-label={isAudioMuted ? "Unmute simulation audio" : "Mute simulation audio"}
            type="button"
            onClick={toggleSound}
            className="min-h-9 p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={isAudioMuted ? "Enable Sound Synthesis" : "Mute Sound"}
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
            title={isCutaway ? "Solid Enclosure" : "Transparent Case Cutaway"}
            aria-label={isCutaway ? "Solid Enclosure" : "Transparent Case Cutaway"}
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            aria-label={showCalloutPins ? "Hide annotation pins" : "Show annotation pins"}
            type="button"
            onClick={() => setShowCalloutPins(!showCalloutPins)}
            className={`min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showCalloutPins
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
            title="Toggle Historical Patent Numeral Pins"
          >
            <Zap className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`min-h-9 p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showUiOverlay
                ? "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
                : "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
            }`}
            title={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
            aria-label={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
          >
            {showUiOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
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
                Apple II Bus Telemetry:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {clockFrequencyMhz.toFixed(3)} MHz
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Throughput:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {effectiveCpuThroughputPct}% CPU (no DMA halt)
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Memory Slot:</span>
              <span className="font-bold text-cyan-800 dark:text-cyan-400">
                {phi1VideoAccessWindowNs} ns (Φ₁/Φ₂)
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">RAM Bank:</span>
              <span className="font-bold text-purple-800 dark:text-purple-400">
                {ramCapacityKb} KB (Auto-Refreshed)
              </span>
            </div>
          </div>
        )}

        {/* Bottom SI Telemetry Chip Strip */}
        <StudioKernelChips
          side="right"
          visible={showUiOverlay}
          title="APPLE II DUAL-PHASE TIMING GENERATOR"
          chips={[
            {
              label: "Master Crystal",
              value: `${clockFrequencyMhz.toFixed(4)}`,
              unit: "MHz",
            },
            {
              label: "CPU Clock (Φ2)",
              value: `${apple.cpuClockMhz.toFixed(3)}`,
              unit: "MHz",
            },
            { label: "NTSC Subcarrier", value: "3.5795", unit: "MHz" },
            {
              label: "DRAM Window",
              value: `${phi1VideoAccessWindowNs.toFixed(0)}`,
              unit: "ns (Φ1)",
            },
            {
              label: "CPU Duty",
              value: `${effectiveCpuThroughputPct.toFixed(0)}%`,
              unit: "Zero Wait States",
            },
            {
              label: "RAM Capacity",
              value: `${ramCapacityKb}`,
              unit: "KB Dynamic RAM",
            },
            { label: "Contention", value: "0% Interleaved Shared Bus" },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SensitivitySlider
            id="wozniakCrystalFreq"
            patentId="us-4136359-wozniak-apple"
            paramKey="crystalFreq"
            label="Master Quartz Crystal"
            value={clockFrequencyMhz}
            min={7.0}
            max={28.0}
            step={0.1}
            unit=" MHz"
            onChange={(val) => updateParam("crystalFreq", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="wozniakRamCapacity"
            patentId="us-4136359-wozniak-apple"
            paramKey="ramCapacityKb"
            label="RAM Capacity"
            value={ramCapacityKb}
            min={4}
            max={48}
            step={4}
            unit=" KB"
            onChange={(val) => updateParam("ramCapacityKb", val)}
            allParams={params}
          />
        </div>

        <ClaimConstraintToggle
          patentId="us-4136359-wozniak-apple"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-4136359-wozniak-apple"
          params={params}
          className="mt-3"
        />
      </div>
    </div>
  );
}
