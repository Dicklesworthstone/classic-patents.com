"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { readMarconiRuntimeControls, readMarconiTapeFrame } from "@/physics/marconiSharedKernel";
import { usePatentRuntimeTick } from "@/physics/useFrankenSimPhysics";
import { getPatentPhysicsParams, usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { buildMarconiRadioModel, updateMarconiRadioKinematics } from "./marconiRadioModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset =
  | "iso"
  | "full_system"
  | "receiver"
  | "spark_gap"
  | "induction_coil"
  | "aerial_monopole"
  | "morse_key"
  | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [13, 8.5, 15.5], target: [1.8, 0.8, 0] },
  full_system: { pos: [14.2, 9.2, 17], target: [1.8, 0.7, 0] },
  receiver: { pos: [10.2, 1.4, 5.8], target: [6.5, -1.6, 0] },
  spark_gap: { pos: [0, -0.8, 3.8], target: [0, -1.8, 0] },
  induction_coil: { pos: [0, -1.2, -4.5], target: [0, -2.1, -1.8] },
  aerial_monopole: { pos: [-3.5, 3.5, 6.5], target: [-3.5, 2.5, 0] },
  morse_key: { pos: [3.0, -1.5, 2.5], target: [3.0, -2.4, -0.5] },
  top: { pos: [0, 13.5, 0.1], target: [0, 0, 0] },
};

export function marconiViewForViewport(preset: CameraPreset, viewportWidth: number) {
  const config = CAMERA_PRESETS[preset];
  const multiplier = viewportWidth < 480 ? 1.35 : viewportWidth < 900 ? 1.08 : 1;
  return {
    pos: [
      config.target[0] + (config.pos[0] - config.target[0]) * multiplier,
      config.target[1] + (config.pos[1] - config.target[1]) * multiplier,
      config.target[2] + (config.pos[2] - config.target[2]) * multiplier,
    ] as [number, number, number],
    target: config.target,
  };
}

export function MarconiRadio3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // Spark-Gap Radio State Controls
  const { params, updateParam } = usePatentPhysics("us-586193-marconi-radio");
  const aerialHeightMeters = params.aerialHeight ?? 88;
  const sparkGapMm = params.sparkGapMm ?? 10;
  const inductionCoilKv = params.sparkVoltage ?? 28;
  const showEmWavefronts = true;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  const runtimeControls = readMarconiRuntimeControls(params);
  const runtimeTick = usePatentRuntimeTick("us-586193-marconi-radio", 30, true);
  void runtimeTick;
  // Pure consumer of the shared transport tape; no local integration clock.
  const tapeFrame = readMarconiTapeFrame(runtimeControls);

  const live = useLiveSimParams({
    aerialHeightMeters,
    sparkGapMm,
    inductionCoilKv,
    showEmWavefronts,
    isAudioMuted,
    isCutaway,
    runtimeControls,
  });

  const studioRef = useRef<StudioContext | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = marconiViewForViewport(preset, containerRef.current?.clientWidth ?? 1000);
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const toggleSound = () => {
    toggleEngine(() => {
      soundEngine.playSwitchClick();
    });
  };

  const triggerSpark = () => {
    const current = readMarconiRuntimeControls(getPatentPhysicsParams("us-586193-marconi-radio"));
    updateParam("sparkPulseSequence", current.sparkPulseSequence + 1);
    if (!isAudioMuted) soundEngine.playSparkDischarge(0.12);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const iso = marconiViewForViewport("iso", container.clientWidth);
    const studio = createThreeStudioScene({
      container,
      cameraPos: iso.pos,
      targetPos: iso.target,
    });
    studioRef.current = studio;

    const { scene, camera, renderer, controls } = studio;

    const { rootGroup, nodes, materials, dispose } = buildMarconiRadioModel();
    scene.add(rootGroup);

    // Animation Loop
    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const p = live.current;
      const tape = readMarconiTapeFrame(p.runtimeControls);

      updateMarconiRadioKinematics(nodes, materials, {
        mastStudioScale: tape.display.mastStudioScale,
        sparkGapStudioHalfSpan: tape.display.sparkGapStudioHalfSpan,
        wavefrontProgress: tape.wavefrontProgress,
        sparkActive: tape.sparkActive,
        waveActive: tape.waveActive,
        showEmWavefronts: p.showEmWavefronts,
        receiverConducting: tape.receiverConducting,
        relayActive: tape.relayActive,
        resetActive: tape.resetActive,
        resetPhase: tape.resetPhase,
        isCutaway: p.isCutaway,
      });

      controls.update();
      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  useEffect(() => {
    const restoreResponsiveView = () => {
      const container = containerRef.current;
      if (!container) return;
      const config = marconiViewForViewport(activeCamera, container.clientWidth);
      studioRef.current?.controls.setView(config.pos, config.target);
    };
    window.addEventListener("resize", restoreResponsiveView);
    return () => window.removeEventListener("resize", restoreResponsiveView);
  }, [activeCamera]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Guglielmo Marconi Wireless Radio 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-9.5rem)] sm:max-w-[calc(100%-15rem)] gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["full_system", "Full System"],
                ["receiver", "Receiver & Reset"],
                ["spark_gap", "Spark Gap"],
                ["induction_coil", "Induction Coil"],
                ["aerial_monopole", "Aerial Mast"],
                ["morse_key", "Morse Key"],
                ["top", "Radiation Axis"],
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

        {/* Top Right Tool Bar */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={triggerSpark}
            title="Fire one transmitter spark pulse"
            aria-label="Fire Spark"
            className="flex min-h-9 items-center gap-1 rounded-xl border border-amber-700 bg-amber-600 p-1.5 text-xs text-white shadow-sm transition-colors hover:bg-amber-700 sm:p-2"
          >
            <Zap className="h-4 w-4" />
            <span className="hidden lg:inline">Fire Spark</span>
          </button>
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Solid Apparatus" : "Cutaway Apparatus"}
            className={`min-h-9 p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm text-xs font-sans flex items-center gap-1 ${
              isCutaway
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">{isCutaway ? "Cutaway" : "Solid"}</span>
          </button>

          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Spark Sound" : "Mute Spark Sound"}
            aria-label={isAudioMuted ? "Unmute Spark Sound" : "Mute Spark Sound"}
            className="min-h-9 p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`min-h-9 p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showUiOverlay
                ? "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
                : "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
            }`}
            title={showUiOverlay ? "Hide Overlay UI (Clean 3D View)" : "Show Overlay UI"}
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
                Receiver sequence:
              </span>
              <span className="font-bold text-sky-800 dark:text-sky-400">
                {tapeFrame.receiverStage.replaceAll("-", " ")}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Imperfect contact:</span>
              <span className="font-bold text-cyan-800 dark:text-cyan-400">
                {tapeFrame.receiverConducting ? "conducting" : "open"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Local relay:</span>
              <span className="text-emerald-800 dark:text-emerald-400 font-bold">
                {tapeFrame.relayActive ? "energized" : "idle"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Shaking means:</span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {tapeFrame.resetActive ? "resetting contact" : "ready"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Quantitative RF result:</span>
              <span className="text-rose-700 dark:text-rose-400 font-bold">source withheld</span>
            </div>
          </div>
        )}

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="Marconi transmitter-to-receiver apparatus"
          chips={[
            { label: "Display mast", value: `${aerialHeightMeters}`, unit: "m" },
            { label: "Display gap", value: `${sparkGapMm}`, unit: "mm" },
            { label: "Display coil", value: `${inductionCoilKv}`, unit: "kV" },
            { label: "Receiver", value: tapeFrame.receiverStage.replaceAll("-", " ") },
            { label: "Tube current", value: "≤1", unit: "mA (source)" },
            { label: "Single-cell EMF", value: "≤1.5", unit: "V (source)" },
            { label: "RF link budget", value: "not disclosed" },
            { label: "Causal tape", value: "source-bounded TS" },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SensitivitySlider
            id="sparkVoltage"
            patentId="us-586193-marconi-radio"
            paramKey="sparkVoltageKv"
            label="Illustrative Coil Potential"
            value={inductionCoilKv}
            min={5}
            max={50}
            step={1}
            onChange={(val) => updateParam("sparkVoltage", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="aerialHeight"
            patentId="us-586193-marconi-radio"
            paramKey="antennaHeightM"
            label="Illustrative Aerial Height"
            value={aerialHeightMeters}
            min={10}
            max={120}
            step={2}
            onChange={(val) => updateParam("aerialHeight", val)}
            allParams={params}
          />

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Illustrative Spark-Gap Spacing
              </span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {sparkGapMm} mm
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="25"
              step="1"
              value={sparkGapMm}
              onChange={(e) => updateParam("sparkGapMm", Number.parseInt(e.target.value, 10))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>
        </div>

        <ClaimConstraintToggle
          patentId="us-586193-marconi-radio"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <p className="mt-3 rounded-lg border border-rose-800/40 bg-rose-950/20 p-3 text-xs leading-relaxed text-ink-700 dark:text-ink-300">
          <span className="font-mono font-bold text-rose-700 dark:text-rose-300">
            SOURCE BOUNDARY —
          </span>{" "}
          The controls scale this explanatory apparatus. The grant does not supply the L, C,
          antenna-current, loss, or path inputs needed for an honest frequency, power, or range
          calculation; the model therefore shows the claimed causal topology without inventing a
          link budget.
        </p>
      </div>
    </div>
  );
}
