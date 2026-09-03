"use client";

import { Camera } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { stepLandPolaroidInstantFilm } from "@/physics/catalogKernels";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import {
  type LandPolaroidCameraPreset as CameraPreset,
  LAND_POLAROID_CAMERA_PRESETS,
  landPolaroidViewForViewport,
} from "./landPolaroidCamera";
import { createLandPolaroidModel, type LandPolaroidModelNodes } from "./landPolaroidModel";
import { LAND_POLAROID_3D_SOURCE_BOUNDARY } from "./landPolaroidSourceBoundary";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { StudioOverlayActionToolbar } from "./StudioOverlayActionToolbar";
import { createWideStudioOverlayActions } from "./studioOverlayActions";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

interface LandPolaroid3DProps {
  className?: string;
}

export const LandPolaroid3D: React.FC<LandPolaroid3DProps> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const modelRef = useRef<LandPolaroidModelNodes | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(true);
  const { isAudioMuted, toggleSound } = usePatentAudio();

  const { params, updateParam } = usePatentPhysics("us-2543181-land-polaroid");
  const developmentTimeSec = params.developmentTimeSec ?? 30;
  const exposureFraction = params.exposureFraction ?? 0.6;
  const reagentViscosityCp = params.reagentViscosityCp ?? 25000;
  const rollerGapUm = params.rollerGapUm ?? 25;
  const alkaliPh = params.alkaliPh ?? 12.6;
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({
    1: (params.claim1Active ?? 1) >= 0.5,
  });
  const claim1Active = claimStates[1] ?? true;
  const sourceState = stepLandPolaroidInstantFilm({
    developmentTimeSec,
    exposureFraction,
    reagentViscosityCp,
    rollerGapUm,
    alkaliPh,
    claim1Active,
  });

  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("overview");

  const live = useLiveSimParams({
    developmentTimeSec,
    exposureFraction,
    reagentViscosityCp,
    rollerGapUm,
    alkaliPh,
    isCutaway,
    claim1Active,
  });

  // The source owns the topology and chemistry description, but not the
  // constants needed to claim a calibrated FrankenSim diffusion or energy run.
  useFrankenSimPhysics("us-2543181-land-polaroid", {
    domain: "materials_kinetics",
    refusal: { isRefused: true, reason: LAND_POLAROID_3D_SOURCE_BOUNDARY },
  });

  const handlePresetChange = (preset: CameraPreset) => {
    setCameraPreset(preset);
    const view = landPolaroidViewForViewport(preset, containerRef.current?.clientWidth ?? 1024);
    studioRef.current?.controls.setView(view.pos, view.target);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const overview = landPolaroidViewForViewport("overview", container.clientWidth);
    const studio = createThreeStudioScene({
      container,
      cameraPos: overview.pos,
      targetPos: overview.target,
    });
    studioRef.current = studio;

    const model = createLandPolaroidModel(live.current);
    modelRef.current = model;
    studio.scene.add(model.group);

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      if (!studio.isVisible()) {
        return;
      }
      studio.controls.update();
      model.setCutaway(live.current.isCutaway ?? false);
      model.update(0, live.current);
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
            {(Object.keys(LAND_POLAROID_CAMERA_PRESETS) as CameraPreset[]).map((key) => (
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
                {LAND_POLAROID_CAMERA_PRESETS[key].label}
              </button>
            ))}
          </div>
        )}

        {/* Top-Right Action Controls */}
        <StudioOverlayActionToolbar
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap justify-end gap-1.5 sm:gap-2 max-w-[min(90%,26rem)] sm:max-w-[26rem]"
          actions={createWideStudioOverlayActions({
            isCutaway,
            onToggleCutaway: () => {
              setIsCutaway((prev) => !prev);
              soundEngine.playSwitchClick();
            },
            cutawayTitle: isCutaway
              ? "Restore Opaque Photosensitive Sheet"
              : "Expose Internal Layer Stack",
            isAudioMuted,
            onToggleSound: () => {
              toggleSound();
              soundEngine.playSwitchClick();
            },
            showUiOverlay,
            onToggleUiOverlay: () => setShowUiOverlay(!showUiOverlay),
            onResetCamera: () => handlePresetChange("overview"),
          })}
        />

        {/* Bottom-Left Telemetry Banner */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 bg-parchment-50/95 dark:bg-ink-950/95 p-3 rounded-xl border border-parchment-300 dark:border-ink-800 backdrop-blur-md pointer-events-none shadow-md max-w-sm">
            <div className="text-xs font-mono font-bold text-amber-800 dark:text-amber-400">
              US 2,543,181 — Edwin Land Polaroid Instant Film
            </div>
            <div className="text-[10px] font-sans text-ink-600 dark:text-ink-400 mt-0.5">
              Claim 1 attached product with liquid container and superposed transfer layers
            </div>
          </div>
        )}

        {/* Bottom SI Telemetry Chip Strip */}
        <StudioKernelChips
          side="right"
          visible={showUiOverlay}
          title="SOURCE TOPOLOGY · MODERN TEACHING LENS"
          chips={[
            { label: "Scenario t_dev", value: `${developmentTimeSec.toFixed(0)}`, unit: "s" },
            { label: "Teaching Gap", value: `${rollerGapUm.toFixed(0)}`, unit: "µm" },
            {
              label: "Viscosity",
              value: `${reagentViscosityCp.toLocaleString()}`,
              unit: "cP",
            },
            { label: "Alkali pH", value: `${alkaliPh.toFixed(1)}`, unit: "pH" },
            { label: "Exposure", value: `${(exposureFraction * 100).toFixed(0)}%` },
            {
              label: "Transfer",
              value: `${sourceState.transferEfficiencyPercent.toFixed(1)}`,
              unit: "% scenario",
            },
            {
              label: "Claim 1 path",
              value: sourceState.claim1PathActive ? "attached" : "removed",
              tone: sourceState.claim1PathActive ? "ok" : "warn",
            },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <p
          data-testid="land-polaroid-source-boundary"
          className="mb-4 text-xs leading-relaxed text-ink-600 dark:text-ink-300"
        >
          <strong className="text-ink-900 dark:text-parchment-100">Source boundary.</strong>{" "}
          {LAND_POLAROID_3D_SOURCE_BOUNDARY}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SensitivitySlider
            id="developmentTime"
            patentId="us-2543181-land-polaroid"
            paramKey="developmentTimeSec"
            label="Development Time"
            value={developmentTimeSec}
            min={0}
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
              aria-label="Exposure level"
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
          onToggleClaim={(claimNo, active) => {
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }));
            updateParam("claim1Active", active ? 1 : 0);
          }}
          className="mt-2"
        />
      </div>
    </div>
  );
};
