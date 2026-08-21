"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { stepPasteurFermentation } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import {
  buildPasteurFermentationModel,
  updatePasteurFermentationKinematics,
} from "./pasteurFermentationModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "vessel" | "nozzle" | "generator" | "exit_cup" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [10, 7, 11], target: [0, 0, 0] },
  vessel: { pos: [5.5, 2.8, 7], target: [0, 0.3, 0] },
  nozzle: { pos: [4, 5.5, 5], target: [0, 3.4, 0] },
  generator: { pos: [-7, 1.2, 5], target: [-4.2, -0.7, 0] },
  exit_cup: { pos: [6, 0.2, 5], target: [3.1, -0.8, 0] },
  top: { pos: [0, 12, 0.1], target: [0, 0, 0] },
};

export const PasteurFermentation3D = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { params, updateParam } = usePatentPhysics("us-135245-pasteur-fermentation");
  const co2SweepPct = params.co2SweepPct ?? 100;
  const sprayCoveragePct = params.sprayCoveragePct ?? 100;
  const wortTempC = params.wortTempC ?? 21.25;
  const process = stepPasteurFermentation({ co2SweepPct, sprayCoveragePct, wortTempC });
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const live = useLiveSimParams({ co2SweepPct, sprayCoveragePct, isCutaway });

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const camera = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(camera.pos, camera.target);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const studio = createThreeStudioScene({
      container,
      cameraPos: CAMERA_PRESETS.iso.pos,
      targetPos: CAMERA_PRESETS.iso.target,
    });
    studioRef.current = studio;
    const { rootGroup, nodes, materials, dispose } = buildPasteurFermentationModel();
    studio.scene.add(rootGroup);
    let requestId = 0;
    let previousMs: number | undefined;
    const animate = (nowMs: number) => {
      requestId = requestAnimationFrame(animate);
      const dt = previousMs === undefined ? 0 : Math.min((nowMs - previousMs) / 1000, 0.1);
      previousMs = nowMs;
      updatePasteurFermentationKinematics(
        nodes,
        materials,
        dt,
        live.current.co2SweepPct,
        live.current.sprayCoveragePct,
        live.current.isCutaway,
      );
      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };
    requestId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(requestId);
      dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-parchment-300 bg-parchment-50/60 shadow-patent dark:border-ink-800 dark:bg-ink-950/80">
      <div className="sr-only">Pasteur closed-vessel process apparatus in three dimensions</div>
      <div className="relative min-h-[380px] w-full flex-1 cursor-grab active:cursor-grabbing sm:min-h-[460px]">
        <div ref={containerRef} className="absolute inset-0 h-full w-full" />
        {showUiOverlay && (
          <div className="absolute left-3 top-3 z-10 flex max-w-[calc(100%-14rem)] flex-nowrap gap-1 overflow-x-auto rounded-xl border border-parchment-300 bg-white/85 p-1 text-[10px] shadow-sm backdrop-blur-md dark:border-ink-700 dark:bg-ink-900/85 sm:left-4 sm:top-4 sm:max-w-[calc(100%-28rem)] sm:gap-1.5 sm:p-1.5 sm:text-xs">
            <span className="flex shrink-0 items-center gap-1 px-1.5 py-0.5 font-sans text-ink-500 sm:px-2 sm:py-1">
              <Camera className="h-3.5 w-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["vessel", "Vessel A"],
                ["nozzle", "Pipe E / Nozzle P"],
                ["generator", "Generator M M"],
                ["exit_cup", "Exit x / Cup v"],
                ["top", "Plan View"],
              ] as [CameraPreset, string][]
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyCameraPreset(preset)}
                className={`shrink-0 rounded-lg px-2 py-1 font-medium transition-colors ${
                  activeCamera === preset
                    ? "bg-cyan-700 font-semibold text-white shadow-xs"
                    : "text-ink-700 hover:bg-parchment-200 dark:text-ink-300 dark:hover:bg-ink-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
        <div className="pointer-events-auto absolute right-3 top-3 z-10 flex items-center gap-1.5 sm:right-4 sm:top-4 sm:gap-2">
          <button
            type="button"
            onClick={() => setIsCutaway((value) => !value)}
            title={isCutaway ? "Show solid vessel" : "Show illustrative cutaway"}
            className={`flex items-center gap-1 rounded-xl border p-1.5 text-xs shadow-sm backdrop-blur-md transition-colors sm:p-2 ${
              isCutaway
                ? "border-cyan-800 bg-cyan-700 text-white"
                : "border-parchment-300 bg-white/90 text-ink-700 dark:border-ink-700 dark:bg-ink-900/90 dark:text-parchment-300"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span className="hidden sm:inline">{isCutaway ? "Cutaway" : "Solid"}</span>
          </button>
          <button
            type="button"
            onClick={() => toggleEngine(() => soundEngine.playSwitchClick())}
            aria-label={isAudioMuted ? "Unmute audio" : "Mute audio"}
            className="rounded-xl border border-parchment-300 bg-white/90 p-1.5 text-ink-700 shadow-sm backdrop-blur-md dark:border-ink-700 dark:bg-ink-900/90 dark:text-parchment-300 sm:p-2"
          >
            {isAudioMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay((value) => !value)}
            aria-label={showUiOverlay ? "Hide overlay" : "Show overlay"}
            className="rounded-xl border border-parchment-300 bg-white/90 p-1.5 text-ink-700 shadow-sm backdrop-blur-md dark:border-ink-700 dark:bg-ink-900/90 dark:text-parchment-300 sm:p-2"
          >
            {showUiOverlay ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => applyCameraPreset("iso")}
            aria-label="Reset camera"
            className="rounded-xl border border-parchment-300 bg-white/90 p-1.5 text-ink-700 shadow-sm backdrop-blur-md dark:border-ink-700 dark:bg-ink-900/90 dark:text-parchment-300 sm:p-2"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
        {showUiOverlay && (
          <div className="pointer-events-none absolute bottom-3 left-3 z-10 max-w-xs rounded-xl border border-parchment-300 bg-parchment-50/95 p-3 font-mono text-xs text-ink-900 shadow-md backdrop-blur-md dark:border-ink-800 dark:bg-ink-950/95 dark:text-parchment-100 sm:bottom-4 sm:left-4">
            <p className="mb-2 font-sans font-semibold">US 135,245 source sequence</p>
            <p>1. Introduce boiling-hot wort into closed vessel A.</p>
            <p>2. Sweep air out with carbonic-acid gas.</p>
            <p>3. Cool by spraying the vessel exterior.</p>
            <p>4. Add yeast at 20–22.5 °C.</p>
          </div>
        )}
        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="Source-bounded reader controls"
          chips={[
            { label: "CO₂ sweep", value: `${process.co2SweepPct}`, unit: "%" },
            { label: "Exterior spray", value: `${process.sprayCoveragePct}`, unit: "%" },
            { label: "Yeast-addition band", value: `${process.wortTempC}`, unit: "°C" },
            { label: "Sequence", value: process.readyForYeast ? "ready" : "incomplete" },
          ]}
        />
      </div>
      <div className="border-t border-parchment-300 bg-parchment-100/90 p-4 dark:border-ink-800 dark:bg-ink-900/90">
        <p className="mb-3 text-xs text-ink-600 dark:text-ink-300">
          Percentages control the reader animation only; the patent states no gas flow, spray rate,
          cooling time, pressure, or fixed vessel material beyond galvanized iron, wood, or another
          suitable material. This studio isolates one representative vessel A; the 2D face shows all
          three vessels printed in Fig. 1.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              id: "co2SweepPct",
              label: "CO₂ sweep progress",
              value: co2SweepPct,
              min: 0,
              max: 100,
              step: 5,
              unit: "%",
            },
            {
              id: "sprayCoveragePct",
              label: "Exterior spray coverage",
              value: sprayCoveragePct,
              min: 0,
              max: 100,
              step: 5,
              unit: "%",
            },
            {
              id: "wortTempC",
              label: "Yeast-addition temperature",
              value: wortTempC,
              min: 20,
              max: 22.5,
              step: 0.25,
              unit: "°C",
            },
          ].map((control) => (
            <label
              key={control.id}
              className="flex flex-col gap-1.5 text-xs font-medium text-ink-700 dark:text-ink-300"
            >
              <span className="flex justify-between">
                <span>{control.label}</span>
                <span className="font-mono font-bold">
                  {control.value}
                  {control.unit}
                </span>
              </span>
              <input
                type="range"
                min={control.min}
                max={control.max}
                step={control.step}
                value={control.value}
                onChange={(event) => updateParam(control.id, Number(event.target.value))}
                className="h-2 w-full cursor-pointer rounded-lg accent-cyan-700"
              />
            </label>
          ))}
        </div>

        <ClaimConstraintToggle
          patentId="us-135245-pasteur-fermentation"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />
      </div>
    </div>
  );
});
