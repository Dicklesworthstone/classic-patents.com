"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { FrankenSimEngine } from "@/physics/engine";
import { ensureHoweWasm, type HoweKernelSource, stepHoweTopology } from "@/physics/howeWasm";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import {
  buildHoweSewingMachineModel,
  updateHoweSewingMachineKinematics,
} from "./howeSewingMachineModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "needle" | "shuttle" | "flywheel" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [11, 8, 13], target: [0, 0, 0] },
  needle: { pos: [3.45, -0.15, 2.65], target: [2.2, -0.7, 0] },
  shuttle: { pos: [2.7, -0.25, 3.1], target: [2.15, -1.18, 0.34] },
  flywheel: { pos: [-4.7, 2.7, 1.7], target: [-2.25, 1.35, -1.72] },
  top: { pos: [1.0, 7.0, 0.1], target: [1.0, 0, 0] },
};

export function HoweSewingMachine3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mechanical Stitching State Controls
  const { params, updateParam } = usePatentPhysics("us-4750-howe-sewing-machine");
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const stitchingSpeedRpm = (params.crankRpm as number) ?? 240;
  const stitchPitchMm = (params.stitchPitchMm as number) ?? 3.5;
  const loopSlackPct = (params.loopSlackPct as number) ?? 65;
  const isCranking = params.isCranking !== 0;
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [kernelSource, setKernelSource] = useState<HoweKernelSource>("unloaded");
  const kernelSourceRef = useRef<HoweKernelSource>("unloaded");
  const { isAudioMuted, toggleSound } = usePatentAudio();

  // Source-order kinematics from the generic FrankenSim fs-mbd composition.
  const stitchState = FrankenSimEngine.stepHoweSewingMachine(
    stitchingSpeedRpm,
    loopSlackPct,
    stitchPitchMm,
  );

  useFrankenSimPhysics("us-4750-howe-sewing-machine", {
    domain: "continuum_elasticity",
    timestampMs: Date.now(),
    timeStepDt: 0.016,
    refusal: {
      isRefused: !stitchState.claim1InterlockPossible,
      reason: stitchState.claim1InterlockPossible
        ? undefined
        : "Displayed slack is below the declared loop-clearance boundary.",
    },
    continuum: {
      tensileStressMpa: 0,
      tensileStrainPct: 0,
      elasticModulusGpa: 0,
      crossLinkDensityMolesPerCm3: 0,
      stitchFrequencyHz: stitchState.stitchFrequencyHz,
      feedVelocityMmPs: stitchState.clothFeedMmPerS,
      buoyancyLiftForceKiloNewtons: 0,
    },
  });
  const stitchesPerSecond = stitchState.stitchFrequencyHz.toFixed(1);
  const clothFeedRateMmPerSec = stitchState.clothFeedMmPerS.toFixed(1);

  const live = useLiveSimParams({
    stitchingSpeedRpm,
    isCranking,
    stitchPitchMm,
    clothFeedRateMmPerSec,
    loopSlackPct,
    claim1InterlockEnabled: claimStates[1] !== false,
    showCalloutPins,
    isAudioMuted,
    crankOmegaRadPerS: stitchState.crankOmegaRadPerS,
    crankOmegaDegPerS: stitchState.crankOmegaDegPerS,
    displayWrapDeg: stitchState.displayWrapDeg,
    stitchFrequencyHz: stitchState.stitchFrequencyHz,
    isCutaway,
  });

  const studioRef = useRef<StudioContext | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  useEffect(() => {
    let mounted = true;
    void ensureHoweWasm().then((loadedSource) => {
      if (mounted) {
        kernelSourceRef.current = loadedSource;
        setKernelSource(loadedSource);
      }
    });
    return () => {
      mounted = false;
    };
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

    // Load High-Fidelity Procedural 3D Model
    const model = buildHoweSewingMachineModel();
    scene.add(model.rootGroup);

    // Animation Loop
    let reqId: number;
    let mainCrankAngleDeg = 0;
    let lastStitchTickTime = 0;
    let virtualTime = 0;
    let completedCycles = 0;

    const clock = createStudioClock();

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const { dt } = clock.pump(now);
      virtualTime += dt;
      const p = live.current;

      if (p.isCranking) {
        const unwrappedAngle = mainCrankAngleDeg + p.crankOmegaDegPerS * dt;
        completedCycles += Math.floor(unwrappedAngle / p.displayWrapDeg);
        mainCrankAngleDeg = unwrappedAngle % p.displayWrapDeg;

        // Periodic Click Audio Synthesis
        if (virtualTime - lastStitchTickTime > 1 / Math.max(1, p.stitchFrequencyHz)) {
          lastStitchTickTime = virtualTime;
          if (!p.isAudioMuted) {
            soundEngine.playSwitchClick();
          }
        }
      }

      const mechanismState = stepHoweTopology(
        mainCrankAngleDeg,
        p.loopSlackPct,
        p.claim1InterlockEnabled,
      );
      if (mechanismState.runtimeSource !== kernelSourceRef.current) {
        kernelSourceRef.current = mechanismState.runtimeSource;
        setKernelSource(mechanismState.runtimeSource);
      }
      updateHoweSewingMachineKinematics(model, mechanismState, completedCycles, p.showCalloutPins);

      model.setCutaway?.(p.isCutaway ?? false);

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
      <div className="sr-only">Elias Howe Sewing Machine 3D (US 4,750)</div>
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
                ["iso", "Overview"],
                ["needle", "Curved Needle"],
                ["shuttle", "Shuttle Race"],
                ["flywheel", "Flywheel & Cam"],
                ["top", "Overhead"],
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

        {/* Top Right Tool Bar (Toggle UI, Audio, Pins, Reset) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 max-w-[min(90%,26rem)] sm:max-w-[26rem] pointer-events-auto">
          <ClaimConstraintToggle
            patentId="us-4750-howe-sewing-machine"
            claimStates={claimStates}
            onToggleClaim={(c: number, active: boolean) => {
              setClaimStates((prev) => ({ ...prev, [c]: active }));
            }}
          />
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`min-h-9 p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
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
            aria-label={isAudioMuted ? "Unmute simulation audio" : "Mute simulation audio"}
            type="button"
            onClick={() => {
              toggleSound();
              soundEngine.playSwitchClick();
            }}
            className="min-h-9 p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={isAudioMuted ? "Enable Sound Synthesis" : "Mute Sound"}
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsCutaway(!isCutaway);
              soundEngine.playSwitchClick();
            }}
            className={`min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              isCutaway
                ? "bg-cyan-600 text-white border-cyan-700 shadow-md ring-2 ring-cyan-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
            title={isCutaway ? "Solid Castings" : "Transparent Frame Cutaway"}
            aria-label={isCutaway ? "Solid Castings" : "Transparent Frame Cutaway"}
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
            className={`min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showCalloutPins
                ? "bg-amber-600 text-white border-amber-700 shadow-md"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
            title="Toggle Historical Patent Letter Pins"
          >
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
                Declared display cadence:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {stitchesPerSecond} stitches/s ({stitchingSpeedRpm} RPM)
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Declared display feed:</span>
              <span className="text-cyan-800 dark:text-cyan-400 font-bold">
                {clothFeedRateMmPerSec} mm/s
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Loop clearance:</span>
              <span className="text-emerald-800 dark:text-emerald-400 font-bold">
                {stitchState.maximumLoopClearancePct >= 0 ? "+" : ""}
                {stitchState.maximumLoopClearancePct}%
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Claim 1 interlock:</span>
              <span className="text-purple-800 dark:text-purple-400 font-bold">
                {claimStates[1] !== false && stitchState.claim1InterlockPossible
                  ? "available"
                  : "refused"}
              </span>
            </div>
          </div>
        )}

        {/* Bottom SI Telemetry Chip Strip */}
        <StudioKernelChips
          side="right"
          visible={showUiOverlay}
          title="LOCKSTITCH KINEMATIC SYNCHRONIZATION"
          chips={[
            {
              label: "Display Cadence",
              value: stitchesPerSecond,
              unit: "stitches/s",
              tone: "hot",
            },
            {
              label: "Display Feed",
              value: clothFeedRateMmPerSec,
              unit: "mm/s",
            },
            { label: "Display Pitch", value: `${stitchPitchMm.toFixed(1)}`, unit: "mm" },
            { label: "Display Crank", value: `${stitchingSpeedRpm}`, unit: "RPM" },
            { label: "Loop Slack", value: `${loopSlackPct}`, unit: "%" },
            {
              label: "Kernel",
              value: kernelSource === "wasm" ? "fs-mbd WASM" : "typed mirror",
            },
            {
              label: "Mechanism",
              value: "Eye-Pointed Needle & Reciprocating Shuttle",
            },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SensitivitySlider
            id="howeSpeed"
            patentId="us-4750-howe-sewing-machine"
            paramKey="crankRpm"
            label="Drive Crank Speed"
            value={stitchingSpeedRpm}
            min={60}
            max={420}
            step={10}
            unit="RPM"
            onChange={(val) => updateParam("crankRpm", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="howePitch"
            patentId="us-4750-howe-sewing-machine"
            paramKey="stitchPitchMm"
            label="Stitch Pitch"
            value={stitchPitchMm}
            min={1.0}
            max={6.0}
            step={0.1}
            unit="mm"
            onChange={(val) => updateParam("stitchPitchMm", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="howeLoopSlack"
            patentId="us-4750-howe-sewing-machine"
            paramKey="loopSlackPct"
            label="Displayed Loop Slack"
            value={loopSlackPct}
            min={0}
            max={100}
            step={1}
            unit="%"
            onChange={(val) => updateParam("loopSlackPct", val)}
            allParams={params}
          />
        </div>

        <p className="mt-3 text-[11px] text-ink-500 dark:text-ink-400">
          No SI power strip is shown: US 4,750 gives no force, torque, inertia, friction, or power
          datum from which to close an honest energy balance.
        </p>
      </div>
    </div>
  );
}
