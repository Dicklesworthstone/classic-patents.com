"use client";

import { Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createStudioClock } from "@/physics/tickScheduler";
import { readTownesMaserControls, stepTownesMaserTopology } from "@/physics/townesMaserKernel";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { StudioOverlayActionToolbar } from "./StudioOverlayActionToolbar";
import { createOrbitingStudioOverlayActions } from "./studioOverlayActions";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import {
  type TownesMaserSystemCameraPreset as CameraPreset,
  townesMaserSystemCameraForViewport,
} from "./townesMaserSystemCamera";
import { buildTownesMaserSystemModel } from "./townesMaserSystemModel";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

export function TownesLaser3D() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const { params, updateParam } = usePatentPhysics("us-2929922-townes-laser");
  const controls = readTownesMaserControls(params);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isRotating, setIsRotating] = useState(false);
  const [isCutaway, setIsCutaway] = useState(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("system");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const topology = stepTownesMaserTopology({
    ...controls,
    claim1PathPresent: claimStates[1] === false ? 0 : 1,
  });
  const live = useLiveSimParams({ topology, isRotating, isCutaway });

  useFrankenSimPhysics("us-2929922-townes-laser", {
    domain: "optics_waves",
    refusal: {
      isRefused: true,
      reason: topology.refusal.reason,
    },
  });

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const config = townesMaserSystemCameraForViewport(
      preset,
      containerRef.current?.clientWidth ?? 1000,
      containerRef.current?.clientHeight ?? 700,
    );
    studioRef.current?.controls.setView(config.pos, config.target);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const initial = townesMaserSystemCameraForViewport(
      "system",
      container.clientWidth,
      container.clientHeight,
    );
    const studio = createThreeStudioScene({
      container,
      cameraPos: initial.pos,
      targetPos: initial.target,
    });
    studioRef.current = studio;
    const model = buildTownesMaserSystemModel();
    studio.scene.add(model.root);
    const clock = createStudioClock();
    const animate = (now: number) => {
      animFrameRef.current = requestAnimationFrame(animate);
      if (!studio.isVisible()) {
        return;
      }
      const { simTimeSec } = clock.pump(now);
      const current = live.current;
      if (current.isRotating) model.root.rotation.y += 0.0028;
      model.setCutaway(current.isCutaway);
      model.update(current.topology, simTimeSec);
      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current);
      model.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  useEffect(() => {
    const restoreResponsiveView = () => {
      const container = containerRef.current;
      if (!container) return;
      const view = townesMaserSystemCameraForViewport(
        activeCamera,
        container.clientWidth,
        container.clientHeight,
      );
      studioRef.current?.controls.setView(view.pos, view.target);
    };
    window.addEventListener("resize", restoreResponsiveView);
    return () => window.removeEventListener("resize", restoreResponsiveView);
  }, [activeCamera]);

  const toolbarActions = createOrbitingStudioOverlayActions({
    isAudioMuted,
    onToggleSound: () => {
      toggleSound();
      soundEngine.playSwitchClick();
    },
    isRotating,
    onToggleRotating: () => setIsRotating((value) => !value),
    isCutaway,
    onToggleCutaway: () => setIsCutaway((value) => !value),
    cutawayTitle: isCutaway ? "Show closed housings" : "Show source cutaway",
    showUiOverlay,
    onToggleUiOverlay: () => setShowUiOverlay((value) => !value),
    onResetCamera: () => applyCameraPreset("system"),
  });

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-parchment-300 bg-parchment-50/60 shadow-patent dark:border-ink-800 dark:bg-ink-950/80">
      <div className="sr-only">
        Schawlow and Townes connected maser generator, modulated amplifier, and detector system
      </div>
      <div className="relative min-h-[410px] w-full flex-1 cursor-grab active:cursor-grabbing sm:min-h-[500px]">
        <div ref={containerRef} className="absolute inset-0 h-full w-full" />

        {showUiOverlay && (
          <div className="absolute top-4 left-4 z-10 hidden max-w-[calc(100%-28rem)] flex-nowrap gap-1.5 overflow-x-auto rounded-xl border border-parchment-300 bg-white/85 p-1.5 text-xs shadow-sm backdrop-blur-md sm:flex dark:border-ink-700 dark:bg-ink-900/85">
            <span className="flex shrink-0 items-center gap-1 px-2 py-1 font-sans text-ink-500">
              <Camera className="h-3.5 w-3.5" /> View:
            </span>
            {(
              [
                ["system", "System"],
                ["generator", "Generator 10"],
                ["modeSelector", "Mode Selector"],
                ["amplifier", "Amplifier 12"],
                ["detector", "Detector 13"],
              ] as const
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyCameraPreset(preset)}
                className={`min-h-9 shrink-0 rounded-lg px-2 py-1 font-medium transition-colors ${
                  activeCamera === preset
                    ? "bg-amber-600 font-semibold text-white shadow-xs"
                    : "text-ink-700 hover:bg-parchment-200 dark:text-ink-300 dark:hover:bg-ink-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <StudioOverlayActionToolbar actions={toolbarActions} />

        {showUiOverlay && (
          <div className="pointer-events-none absolute bottom-4 left-4 z-10 hidden max-w-sm rounded-xl border border-parchment-300 bg-parchment-50/95 p-3 font-mono text-xs text-ink-900 shadow-md backdrop-blur-md sm:block dark:border-ink-800 dark:bg-ink-950/95 dark:text-parchment-100">
            <div className="mb-2 border-b border-parchment-200 pb-1 font-sans font-semibold text-amber-800 dark:border-ink-800 dark:text-amber-300">
              FIG. 1 CONNECTED COMMUNICATIONS PATH
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1">
              <span className="text-cyan-700 dark:text-cyan-300">10</span>
              <span>pumped potassium-vapor generator</span>
              <span className="text-amber-700 dark:text-amber-300">23–26</span>
              <span>lens → aperture 24 → lens mode selector</span>
              <span className="text-violet-700 dark:text-violet-300">12</span>
              <span>coil-32 Zeeman-modulated amplifier</span>
              <span className="text-rose-700 dark:text-rose-300">13</span>
              <span>photomultiplier detector</span>
            </div>
          </div>
        )}

        <StudioKernelChips
          side="right"
          visible={showUiOverlay}
          title="SOURCE-BOUNDED MASER TOPOLOGY"
          chips={[
            {
              label: "Path",
              value: topology.signalPathComplete ? "connected" : "withheld",
              tone: topology.signalPathComplete ? "ok" : "hot",
            },
            { label: "L/D", value: String(topology.chamberAspectRatio), unit: "ratio" },
            {
              label: "R²",
              value: (topology.readerRoundTripReflectivityFraction * 100).toFixed(2),
              unit: "%",
            },
            { label: "K vapor", value: String(topology.sourcePotassiumTemperatureK), unit: "K" },
            {
              label: "pressure",
              value: String(topology.sourcePotassiumPressureMmHg),
              unit: "mm Hg",
            },
            { label: "Output W", value: "refused", tone: "hot" },
          ]}
        />
      </div>

      <div className="border-t border-parchment-300 bg-parchment-100/90 p-4 dark:border-ink-800 dark:bg-ink-900/90">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Control
            label="Illustrative pump excitation"
            value={`${controls.pumpExcitationPct}%`}
            ariaLabel="Illustrative potassium lamp excitation"
            min={0}
            max={100}
            step={5}
            current={controls.pumpExcitationPct}
            onChange={(value) => updateParam("pumpExcitationPct", value)}
            tone="amber"
          />
          <Control
            label="Chamber length"
            value={`${controls.cavityLengthCm} cm`}
            ariaLabel="Maser chamber length"
            min={5}
            max={20}
            step={1}
            current={controls.cavityLengthCm}
            onChange={(value) => updateParam("cavityLengthCm", value)}
            tone="cyan"
          />
          <Control
            label="Mode-selector aperture"
            value={`${controls.modeApertureOpenPct}% open`}
            ariaLabel="Illustrative mode selector aperture opening"
            min={0}
            max={100}
            step={5}
            current={controls.modeApertureOpenPct}
            onChange={(value) => updateParam("modeApertureOpenPct", value)}
            tone="emerald"
          />
          <Control
            label="Zeeman modulation command"
            value={`${controls.modulationFieldPct}%`}
            ariaLabel="Illustrative longitudinal magnetic field command"
            min={0}
            max={100}
            step={5}
            current={controls.modulationFieldPct}
            onChange={(value) => updateParam("modulationFieldPct", value)}
            tone="violet"
          />
        </div>

        <ClaimConstraintToggle
          patentId="us-2929922-townes-laser"
          claimStates={claimStates}
          onToggleClaim={(claimNumber, active) =>
            setClaimStates((previous) => ({ ...previous, [claimNumber]: active }))
          }
          className="mt-3"
        />
        <p className="mt-3 text-[11px] leading-relaxed text-ink-600 dark:text-ink-400">
          Source boundary: the grant gives the connected apparatus and the approximately 10 × 1 cm
          chamber example, but not enough material or pump data to calculate output power,
          threshold, divergence, cavity Q, or detector response. Those quantities are deliberately
          refused.
        </p>
      </div>
    </div>
  );
}

interface ControlProps {
  label: string;
  value: string;
  ariaLabel: string;
  min: number;
  max: number;
  step: number;
  current: number;
  onChange: (value: number) => void;
  tone: "amber" | "cyan" | "emerald" | "violet";
}

const thumbClasses: Record<ControlProps["tone"], string> = {
  amber: "[&::-webkit-slider-thumb]:bg-amber-600 [&::-moz-range-thumb]:bg-amber-600",
  cyan: "[&::-webkit-slider-thumb]:bg-cyan-600 [&::-moz-range-thumb]:bg-cyan-600",
  emerald: "[&::-webkit-slider-thumb]:bg-emerald-600 [&::-moz-range-thumb]:bg-emerald-600",
  violet: "[&::-webkit-slider-thumb]:bg-violet-600 [&::-moz-range-thumb]:bg-violet-600",
};

function Control({
  label,
  value,
  ariaLabel,
  min,
  max,
  step,
  current,
  onChange,
  tone,
}: ControlProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex justify-between gap-3 text-xs font-sans">
        <span className="font-medium text-ink-700 dark:text-ink-300">{label}</span>
        <span className="shrink-0 font-mono font-bold text-ink-800 dark:text-parchment-200">
          {value}
        </span>
      </span>
      <input
        type="range"
        aria-label={ariaLabel}
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(event) => onChange(Number(event.target.value))}
        className={`h-11 w-full touch-none cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950 dark:[&::-moz-range-track]:bg-ink-700 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 dark:[&::-webkit-slider-thumb]:border-ink-950 ${thumbClasses[tone]}`}
      />
    </label>
  );
}

export default TownesLaser3D;
