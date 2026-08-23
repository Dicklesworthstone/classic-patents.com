"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepTownesLaser } from "@/physics/catalogKernels";
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
import {
  articulateTownesLaserModel,
  buildTownesLaserModel,
  type TownesLaserModelNodes,
} from "./townesLaserModel";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

interface TownesLaser3DProps {
  initialPumpPowerWatts?: number;
  initialCavityLengthCm?: number;
  initialMirror2ReflectivityPct?: number;
  initialBeamDiameterMm?: number;
}

type CameraPreset = "isometric" | "opticalCavity" | "rearReflector" | "outputCoupler" | "detector";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  isometric: { pos: [0, 3.5, 5.0], target: [0, 0, 0] },
  opticalCavity: { pos: [0, 1.2, 3.2], target: [0, 0, 0] },
  rearReflector: { pos: [-2.6, 0.6, 2.2], target: [-2.6, 0, 0] },
  outputCoupler: { pos: [2.0, 0.6, 2.2], target: [2.0, 0, 0] },
  detector: { pos: [2.6, 0.6, 2.2], target: [2.6, 0, 0] },
};

/** Fields the render loop consumes from each laser kernel step. */
interface TownesStepPose {
  pumpPowerWatts: number;
  laserOutputPowerWatts: number;
  intraCavityPowerWatts: number;
  isLasing: boolean;
  pumpShimmerOmegaRadPerS: number;
  beamShimmerOmegaRadPerS: number;
}

export function TownesLaser3D({
  initialPumpPowerWatts = 350,
  initialCavityLengthCm = 25,
  initialMirror2ReflectivityPct = 94,
  initialBeamDiameterMm = 8,
}: TownesLaser3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const nodesRef = useRef<TownesLaserModelNodes | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState(false);
  const { isAudioMuted, toggleSound } = usePatentAudio();

  const { params, updateParam } = usePatentPhysics("us-2929922-townes-laser");
  const pumpPowerWatts = params.pumpPowerWatts ?? initialPumpPowerWatts;
  const cavityLengthCm = params.cavityLengthCm ?? initialCavityLengthCm;
  const mirror2ReflectivityPct = params.mirror2ReflectivityPct ?? initialMirror2ReflectivityPct;
  const beamDiameterMm = params.beamDiameterMm ?? initialBeamDiameterMm;

  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("isometric");
  const [isRotating, setIsRotating] = useState(false);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  const sim = stepTownesLaser({
    pumpPowerWatts,
    cavityLengthCm,
    mirror2ReflectivityPct,
    beamDiameterMm,
  });

  const live = useLiveSimParams({
    pumpPowerWatts: sim.pumpPowerWatts,
    laserOutputPowerWatts: sim.laserOutputPowerWatts,
    intraCavityPowerWatts: sim.intraCavityPowerWatts,
    isLasing: sim.isLasing,
    pumpShimmerOmegaRadPerS: sim.pumpShimmerOmegaRadPerS,
    beamShimmerOmegaRadPerS: sim.beamShimmerOmegaRadPerS,
    cavityLengthCm,
    mirror2ReflectivityPct,
    beamDiameterMm,
    isRotating,
    isCutaway,
  });

  // Shared transport tape: cavity/beam state publishes to the patentId-keyed bus.
  useFrankenSimPhysics("us-2929922-townes-laser", {
    domain: "optics_waves",
    refusal: { isRefused: false },
  });
  const townesBeamRef = useRef<TownesStepPose | null>(null);
  const townesBeamPhaseRef = useRef(0);

  useEffect(() => {
    const integrate: TapeUpdater = (_prev, dt) => {
      const out = stepTownesLaser({
        pumpPowerWatts: live.current.pumpPowerWatts,
        cavityLengthCm: live.current.cavityLengthCm,
        mirror2ReflectivityPct: live.current.mirror2ReflectivityPct,
        beamDiameterMm: live.current.beamDiameterMm,
      });
      townesBeamPhaseRef.current += out.beamShimmerOmegaRadPerS * dt;
      townesBeamRef.current = out;
      return {
        em: {
          frequencyHz: 2.99792458e8 / (out.wavelengthNm * 1e-9),
          magneticFluxDensityTesla: 0,
          electricFieldVpm: 0,
          phaseAngleRad: townesBeamPhaseRef.current,
          inductanceHenry: 0,
          capacitanceFarad: 0,
          currentAmperes: 0,
          voltageVolts: 0,
          powerFactor: 0,
          efficiencyPct: 0,
          synchronousRpm: 0,
          slipFraction: 0,
          rotorRpm: 0,
          shaftPowerWatts: 0,
          electricalInputWatts: out.pumpPowerWatts,
        },
      };
    };
    globalTransportBus.registerUpdater("us-2929922-townes-laser", integrate, "TS_FALLBACK");
    return () => globalTransportBus.unregisterUpdater("us-2929922-townes-laser");
  }, [live]);

  const handlePresetChange = (preset: CameraPreset) => {
    setCameraPreset(preset);
    const targetConfig = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(targetConfig.pos, targetConfig.target);
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

    const nodes = buildTownesLaserModel();
    studio.scene.add(nodes.root);
    nodesRef.current = nodes;

    const clock = createStudioClock();
    const animate = (now: number) => {
      const { simTimeSec } = clock.pump(now);
      timeRef.current = simTimeSec;
      const current = live.current;
      if (current.isRotating) {
        nodes.root.rotation.y += 0.0044;
      }
      studio.controls.update();

      // Bus-owned kernel step: prefer the latest shared-tape beam state.
      const w = townesBeamRef.current;
      articulateTownesLaserModel(
        nodes,
        {
          pumpPowerWatts: w ? w.pumpPowerWatts : current.pumpPowerWatts,
          laserOutputPowerWatts: w ? w.laserOutputPowerWatts : current.laserOutputPowerWatts,
          intraCavityPowerWatts: w ? w.intraCavityPowerWatts : current.intraCavityPowerWatts,
          isLasing: w ? w.isLasing : current.isLasing,
          pumpShimmerOmegaRadPerS: w ? w.pumpShimmerOmegaRadPerS : current.pumpShimmerOmegaRadPerS,
          beamShimmerOmegaRadPerS: w ? w.beamShimmerOmegaRadPerS : current.beamShimmerOmegaRadPerS,
        },
        timeRef.current,
      );

      nodes.setCutaway?.(current.isCutaway ?? false);

      studio.renderer.render(studio.scene, studio.camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      for (const m of nodes.materials) {
        m.dispose();
      }
      studio.cleanup();
      studioRef.current = null;
      nodesRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Townes &amp; Schawlow Optical Maser Laser 3D</div>
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
                ["isometric", "Isometric"],
                ["opticalCavity", "Optical Cavity"],
                ["rearReflector", "Rear Mirror"],
                ["outputCoupler", "Output Coupler"],
                ["detector", "Detector"],
              ] as [CameraPreset, string][]
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetChange(preset)}
                className={`px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
                  cameraPreset === preset
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
                ? "bg-amber-700 text-white border-amber-800 dark:bg-amber-700"
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
            title={isCutaway ? "Solid Tube" : "Transparent Resonator Tube Cutaway"}
            aria-label={isCutaway ? "Solid Tube" : "Transparent Resonator Tube Cutaway"}
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
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
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">State:</span>
              <span
                className={`font-bold ${sim.isLasing ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}`}
              >
                {sim.isLasing ? "LASING COHERENT" : "BELOW THRESHOLD"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Output Power:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {sim.laserOutputPowerWatts} W
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Threshold Gain:</span>
              <span className="text-emerald-800 dark:text-emerald-400 font-bold">
                {sim.thresholdGainPerCm} cm⁻¹
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Intracavity Flux:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {sim.intraCavityPowerWatts} W
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Beam Divergence:</span>
              <span className="text-sky-800 dark:text-sky-400 font-bold">
                {sim.beamDivergenceMrad} mrad
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Flashlamp Optical Pump
              </span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {pumpPowerWatts} W
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="1000"
              step="25"
              value={pumpPowerWatts}
              onChange={(e) => updateParam("pumpPowerWatts", Number.parseFloat(e.target.value))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Cavity Resonator Length
              </span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {cavityLengthCm} cm
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              step="1"
              value={cavityLengthCm}
              onChange={(e) => updateParam("cavityLengthCm", Number.parseFloat(e.target.value))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Coupler Reflectivity
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                {mirror2ReflectivityPct}%
              </span>
            </div>
            <input
              type="range"
              min="80"
              max="99"
              step="1"
              value={mirror2ReflectivityPct}
              onChange={(e) =>
                updateParam("mirror2ReflectivityPct", Number.parseFloat(e.target.value))
              }
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>
        </div>

        <ClaimConstraintToggle
          patentId="us-2929922-townes-laser"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-2929922-townes-laser"
          params={params}
          className="mt-3"
        />
      </div>

      {/* Bottom SI Telemetry Chip Strip */}
      <StudioKernelChips
        visible={true}
        title="OPTICAL MASER QUANTUM CAVITY"
        chips={[
          { label: "P_out", value: String(sim.laserOutputPowerWatts), unit: "W" },
          { label: "P_intra", value: String(sim.intraCavityPowerWatts), unit: "W" },
          { label: "g_th", value: String(sim.thresholdGainPerCm), unit: "cm⁻¹" },
          { label: "θ_div", value: String(sim.beamDivergenceMrad), unit: "mrad" },
          { label: "L_cavity", value: String(cavityLengthCm), unit: "cm" },
          { label: "R_2", value: String(mirror2ReflectivityPct), unit: "%" },
          {
            label: "State",
            value: sim.isLasing ? "Coherent Resonance" : "Sub-Threshold",
            tone: sim.isLasing ? "hot" : "ok",
          },
        ]}
      />
    </div>
  );
}

export default TownesLaser3D;
