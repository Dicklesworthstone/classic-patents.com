"use client";

import { Camera } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import { stepRillieuxEvaporator } from "@/physics/rillieuxEvaporatorKernel";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import {
  type RillieuxEvaporatorCameraPreset as CameraPreset,
  RILLIEUX_EVAPORATOR_CAMERA_PRESETS,
  rillieuxEvaporatorCameraForViewport,
} from "./rillieuxEvaporatorCamera";
import {
  createRillieuxEvaporatorModel,
  type RillieuxEvaporatorModelNodes,
} from "./rillieuxEvaporatorModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { StudioOverlayActionToolbar } from "./StudioOverlayActionToolbar";
import { createWideStudioOverlayActions } from "./studioOverlayActions";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

interface Rillieux3DProps {
  className?: string;
}

export const RillieuxEvaporator3D: React.FC<Rillieux3DProps> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const modelRef = useRef<RillieuxEvaporatorModelNodes | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("overview");
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState(false);
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  const { params, updateParam } = usePatentPhysics("us-3237-rillieux-evaporator");
  const juiceFeedRateKgPerH = params.juiceFeedRateKgPerH ?? 4500;
  const initialBrixDeg = params.initialBrixDeg ?? 14;
  const targetBrixDeg = params.targetBrixDeg ?? 60;
  const numberOfEffects = params.numberOfEffects ?? 3;

  const live = useLiveSimParams({
    isCutaway,
    juiceFeedRateKgPerH,
    initialBrixDeg,
    targetBrixDeg,
    numberOfEffects,
  });

  const state = stepRillieuxEvaporator({
    juiceFeedRateKgPerH,
    initialBrixDeg,
    targetBrixDeg,
    numberOfEffects,
  });

  const handlePresetChange = (preset: CameraPreset) => {
    setCameraPreset(preset);
    const target = rillieuxEvaporatorCameraForViewport(
      preset,
      containerRef.current?.clientWidth ?? 1000,
      containerRef.current?.clientHeight ?? 700,
    );
    studioRef.current?.controls.setView(target.pos, target.target);
  };

  // Shared transport tape: the audited kernel's first-effect thermal state
  // publishes as the initial thermo envelope (mass-balance outputs, not
  // invented dynamics); the per-frame kernel call feeding model.update stays.
  useFrankenSimPhysics("us-3237-rillieux-evaporator", {
    domain: "thermodynamics_transport",
    refusal: { isRefused: false },
    thermo: {
      temperatureCelsius: state.effects[0]?.boilingTemperatureC ?? 0,
      temperatureKelvin: (state.effects[0]?.boilingTemperatureC ?? 0) + 273.15,
      pressureAtm: (state.effects[0]?.operatingPressureKPa ?? 0) / 101.325,
      partialPressureButaneAtm: 0,
      heatInputWatts: (state.effects[0]?.heatTransferKw ?? 0) * 1000,
      coolingPowerWatts: 0,
      coefficientOfPerformance: 0,
      blackbodyRadiantPowerWatts: 0,
      fluidFlowVelocityMps: 0,
    },
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: rillieuxEvaporatorCameraForViewport(
        "overview",
        container.clientWidth,
        container.clientHeight,
      ).pos,
      targetPos: rillieuxEvaporatorCameraForViewport(
        "overview",
        container.clientWidth,
        container.clientHeight,
      ).target,
    });
    studioRef.current = studio;

    const model = createRillieuxEvaporatorModel();
    modelRef.current = model;
    studio.scene.add(model.group);

    const clock = createStudioClock();
    const animate = (now: number) => {
      // Keep the lifecycle alive whether the studio is currently intersecting
      // the viewport or not. Scheduling only in the hidden branch froze the
      // model after its first visible frame.
      animFrameRef.current = requestAnimationFrame(animate);
      if (!studio.isVisible()) {
        return;
      }
      const { simTimeSec } = clock.pump(now);
      timeRef.current = simTimeSec;

      const p = live.current;
      const simState = stepRillieuxEvaporator({
        juiceFeedRateKgPerH: p.juiceFeedRateKgPerH,
        initialBrixDeg: p.initialBrixDeg,
        targetBrixDeg: p.targetBrixDeg,
        numberOfEffects: p.numberOfEffects,
      });

      model.setCutaway?.(p.isCutaway ?? false);
      model.update(simState, timeRef.current);

      studio.controls.update();
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

  useEffect(() => {
    const restoreResponsiveView = () => {
      const container = containerRef.current;
      if (!container) return;
      const view = rillieuxEvaporatorCameraForViewport(
        cameraPreset,
        container.clientWidth,
        container.clientHeight,
      );
      studioRef.current?.controls.setView(view.pos, view.target);
    };
    window.addEventListener("resize", restoreResponsiveView);
    return () => window.removeEventListener("resize", restoreResponsiveView);
  }, [cameraPreset]);

  return (
    <div
      className={`flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent ${className}`}
    >
      <div className="sr-only">Norbert Rillieux Multiple-Effect Evaporator 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-9.5rem)] sm:max-w-[calc(100%-28rem)] gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> View:
            </span>
            {(Object.keys(RILLIEUX_EVAPORATOR_CAMERA_PRESETS) as CameraPreset[]).map((key) => (
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
                {RILLIEUX_EVAPORATOR_CAMERA_PRESETS[key].label}
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
              ? "Switch to Solid Evaporator Shells"
              : "Switch to Interior Cutaway",
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

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                Fuel Economy:
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                {state.fuelSavingsPct.toFixed(1)}% Fuel Saved
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Steam Economy:</span>
              <span className="text-cyan-800 dark:text-cyan-400 font-bold">
                {state.steamEconomyRatio.toFixed(2)} kg/kg
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Evaporation Rate:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {state.totalEvaporationKgPerH.toFixed(0)} kg/h
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Final Syrup:</span>
              <span className="text-purple-800 dark:text-purple-400 font-bold">
                {state.syrupOutputRateKgPerH.toFixed(0)} kg/h ({targetBrixDeg}°Bx)
              </span>
            </div>
          </div>
        )}

        {/* Bottom SI Telemetry Chip Strip */}
        <StudioKernelChips
          side="right"
          visible={showUiOverlay}
          title="MULTIPLE-EFFECT VACUUM EVAPORATION"
          chips={[
            {
              label: "Water Evaporated",
              value: `${state.totalEvaporationKgPerH.toFixed(0)}`,
              unit: "kg/h",
              tone: "hot",
            },
            {
              label: "Steam Economy",
              value: `${state.steamEconomyRatio.toFixed(2)}`,
              unit: "kg evap / kg steam",
            },
            {
              label: "Syrup Output",
              value: `${state.syrupOutputRateKgPerH.toFixed(0)}`,
              unit: "kg/h",
            },
            {
              label: "Feed / Target",
              value: `${initialBrixDeg}° → ${targetBrixDeg}°`,
              unit: "Brix",
            },
            {
              label: "Steam Saved",
              value: `${state.fuelSavingsPct.toFixed(0)}%`,
              unit: "vs single-effect",
            },
            {
              label: "Effects",
              value: `${numberOfEffects}-Stage Latent Heat Cascade`,
            },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SensitivitySlider
            id="rillieuxFeedRate"
            patentId="us-3237-rillieux-evaporator"
            paramKey="juiceFeedRateKgPerH"
            label="Juice Feed Rate"
            value={juiceFeedRateKgPerH}
            min={2000}
            max={25000}
            step={500}
            unit=" kg/h"
            thumb="cyan"
            onChange={(val) => updateParam("juiceFeedRateKgPerH", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="rillieuxInitialBrix"
            patentId="us-3237-rillieux-evaporator"
            paramKey="initialBrixDeg"
            label="Initial Raw Juice Brix"
            value={initialBrixDeg}
            min={10}
            max={20}
            step={0.5}
            unit=" °Bx"
            thumb="amber"
            onChange={(val) => updateParam("initialBrixDeg", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="rillieuxTargetBrix"
            patentId="us-3237-rillieux-evaporator"
            paramKey="targetBrixDeg"
            label="Target Concentrate Brix"
            value={targetBrixDeg}
            min={50}
            max={75}
            step={1}
            unit=" °Bx"
            thumb="amber"
            onChange={(val) => updateParam("targetBrixDeg", val)}
            allParams={params}
          />
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-ink-500 dark:text-ink-400">
          Modern SI teaching controls: the 1843 grant specifies the steam path, two-pan/vacuum
          relationships, and differential thermometer, but does not print these feed-rate or Brix
          setpoints. Values below are model assumptions, not archival measurements.
        </p>

        <ClaimConstraintToggle
          patentId="us-3237-rillieux-evaporator"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) => {
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }));
            updateParam(claimConstraintStateParamId(claimNo), active ? 1 : 0);
          }}
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-3237-rillieux-evaporator"
          params={params}
          className="mt-3"
        />
      </div>
    </div>
  );
};
