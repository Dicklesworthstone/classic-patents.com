"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { stepLandPolaroidInstantFilm } from "@/physics/catalogKernels";
import { createStudioClock } from "@/physics/tickScheduler";
import type { MachineState } from "@/physics/types";
import {
  globalTransportBus,
  type TapeUpdater,
  useFrankenSimPhysics,
} from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { createLandPolaroidModel, type LandPolaroidModelNodes } from "./landPolaroidModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

interface LandPolaroid3DProps {
  className?: string;
}

type CameraPreset = "overview" | "rollers" | "pod" | "print";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { label: string; pos: [number, number, number]; target: [number, number, number] }
> = {
  overview: {
    label: "Instant Camera & Film Overview",
    pos: [3.5, 5.0, 7.5],
    target: [0.5, 0, 1.2],
  },
  rollers: {
    label: "Nip Pressure Rollers",
    pos: [1.8, 2.2, 2.5],
    target: [0.6, 0, 0],
  },
  pod: {
    label: "Rupturable Reagent Pod",
    pos: [0.6, 2.5, 1.5],
    target: [0.6, 0, -0.6],
  },
  print: {
    label: "Developing Positive Print",
    pos: [3.5, 2.8, 4.5],
    target: [2.4, 0, 2.8],
  },
};

const IDLE_MACHINE: MachineState = {
  poseXMeters: 0,
  poseYMeters: 0,
  headingRad: 0,
  modeLabel: "idle",
  wheelSpeedMps: 0,
};

export const LandPolaroid3D: React.FC<LandPolaroid3DProps> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const modelRef = useRef<LandPolaroidModelNodes | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const { isAudioMuted, toggleSound } = usePatentAudio();

  const { params, updateParam } = usePatentPhysics("us-2543181-land-polaroid");
  const developmentTimeSec = params.developmentTimeSec ?? 30;
  const exposureFraction = params.exposureFraction ?? 0.6;
  const reagentViscosityCp = params.reagentViscosityCp ?? 25000;
  const rollerGapUm = params.rollerGapUm ?? 25;
  const alkaliPh = params.alkaliPh ?? 12.6;

  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("overview");

  const live = useLiveSimParams({
    developmentTimeSec,
    exposureFraction,
    reagentViscosityCp,
    rollerGapUm,
    alkaliPh,
    isCutaway,
  });

  // Roller phase lives in a ref so updater re-registration never snaps it.
  const rollerAngleRef = useRef(0);

  // Shared transport tape: the diffusion-transfer kernel (previously unused by
  // this face) is adopted here; the bus updater owns the roller integration.
  useFrankenSimPhysics("us-2543181-land-polaroid", {
    domain: "solid_mechanics",
    refusal: { isRefused: false },
    machine: { ...IDLE_MACHINE, modeLabel: "developing" },
  });

  useEffect(() => {
    const integrate: TapeUpdater = (_prev, dt) => {
      const film = stepLandPolaroidInstantFilm({
        reagentViscosityCp: live.current.reagentViscosityCp,
        rollerGapUm: live.current.rollerGapUm,
        alkaliPh: live.current.alkaliPh,
        exposureFraction: live.current.exposureFraction,
        developmentTimeSec: live.current.developmentTimeSec,
      });
      rollerAngleRef.current =
        (rollerAngleRef.current + film.rollerDisplayOmegaRadPerS * dt) % (Math.PI * 2);
      return {
        refusal: { isRefused: false },
        machine: {
          ...IDLE_MACHINE,
          headingRad: rollerAngleRef.current,
          modeLabel: film.printCompletionPercent >= 100 ? "print complete" : "developing",
        },
      };
    };
    const unregister = globalTransportBus.registerUpdater(
      "us-2543181-land-polaroid",
      integrate,
      "TS_FALLBACK",
    );
    return unregister;
  }, [live]);

  const handlePresetChange = (preset: CameraPreset) => {
    setCameraPreset(preset);
    const targetConfig = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(targetConfig.pos, targetConfig.target);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const overview = CAMERA_PRESETS.overview;
    const studio = createThreeStudioScene({
      container,
      cameraPos: overview.pos,
      targetPos: overview.target,
    });
    studioRef.current = studio;

    const model = createLandPolaroidModel(live.current);
    modelRef.current = model;
    studio.scene.add(model.group);

    const clock = createStudioClock();
    const animate = (now: number) => {
      animFrameRef.current = requestAnimationFrame(animate);
      if (!studio.isVisible()) {
        return;
      }
      const { simTimeSec } = clock.pump(now);
      timeRef.current = simTimeSec;
      studio.controls.update();
      model.setCutaway?.(live.current.isCutaway ?? false);
      model.update(timeRef.current, live.current);
      studio.renderer.render(studio.scene, studio.camera);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      model.dispose();
      studio.cleanup();
      studioRef.current = null;
      modelRef.current = null;
    };
  }, [live]);

  return (
    <div
      className={`flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent ${className}`}
    >
      <div className="sr-only">Edwin Land Polaroid Instant Film 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-9.5rem)] sm:max-w-[calc(100%-28rem)] gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3.5 h-3.5" /> View:
            </span>
            {(Object.keys(CAMERA_PRESETS) as CameraPreset[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => handlePresetChange(key)}
                className={`min-h-9 px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
                  cameraPreset === key
                    ? "bg-amber-600 text-white shadow-xs font-semibold"
                    : "text-ink-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {CAMERA_PRESETS[key].label}
              </button>
            ))}
          </div>
        )}

        {/* Top-Right Action Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap justify-end gap-1.5 sm:gap-2 max-w-[min(90%,26rem)] sm:max-w-[26rem]">
          <button
            type="button"
            onClick={() => {
              setIsCutaway((prev) => !prev);
              soundEngine.playSwitchClick();
            }}
            className={`min-h-9 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs flex items-center gap-1 ${
              isCutaway
                ? "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-700"
                : "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
            }`}
            title={isCutaway ? "Switch to Solid Camera Body" : "Switch to Interior Cutaway"}
            aria-label={isCutaway ? "Switch to Solid Camera Body" : "Switch to Interior Cutaway"}
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">{isCutaway ? "Cutaway" : "Solid"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              toggleSound();
              soundEngine.playSwitchClick();
            }}
            className="min-h-9 p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
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
            onClick={() => handlePresetChange("overview")}
            className="min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Bottom-Left Telemetry Banner */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 bg-parchment-50/95 dark:bg-ink-950/95 p-3 rounded-xl border border-parchment-300 dark:border-ink-800 backdrop-blur-md pointer-events-none shadow-md max-w-sm">
            <div className="text-xs font-mono font-bold text-amber-800 dark:text-amber-400">
              US 2,543,181 — Edwin Land Polaroid Instant Film
            </div>
            <div className="text-[10px] font-sans text-ink-600 dark:text-ink-400 mt-0.5">
              Diffusion Transfer Reversal with Rupturable Foil Pod &amp; Squeegee Rollers
            </div>
          </div>
        )}

        {/* Bottom SI Telemetry Chip Strip */}
        <StudioKernelChips
          side="right"
          visible={showUiOverlay}
          title="DIFFUSION-TRANSFER INSTANT CHEMISTRY"
          chips={[
            { label: "t_dev", value: `${developmentTimeSec.toFixed(0)}`, unit: "s" },
            { label: "Roller Gap", value: `${rollerGapUm.toFixed(0)}`, unit: "µm" },
            {
              label: "Viscosity",
              value: `${reagentViscosityCp.toLocaleString()}`,
              unit: "cP",
            },
            { label: "Alkali pH", value: `${alkaliPh.toFixed(1)}`, unit: "pH" },
            { label: "Exposure", value: `${(exposureFraction * 100).toFixed(0)}%` },
            { label: "Process", value: "One-Step Rupturable Pod Diffusion" },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SensitivitySlider
            id="developmentTime"
            patentId="us-2543181-land-polaroid"
            paramKey="devTimeSec"
            label="Development Time"
            value={developmentTimeSec}
            min={10}
            max={60}
            step={1}
            onChange={(val) => updateParam("developmentTimeSec", val)}
            allParams={params}
          />

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Exposure Level</span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {(exposureFraction * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={exposureFraction}
              onChange={(e) => updateParam("exposureFraction", Number.parseFloat(e.target.value))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>

          <SensitivitySlider
            id="rollerGap"
            patentId="us-2543181-land-polaroid"
            paramKey="rollerGapUm"
            label="Roller Gap"
            value={rollerGapUm}
            min={10}
            max={60}
            step={1}
            onChange={(val) => updateParam("rollerGapUm", val)}
            allParams={params}
          />
        </div>

        <ClaimConstraintToggle
          patentId="us-2543181-land-polaroid"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-2543181-land-polaroid"
          params={params}
          className="mt-3"
        />
      </div>
    </div>
  );
};
