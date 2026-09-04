"use client";

import {
  Camera,
  Eye,
  EyeOff,
  Layers,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  CORT_DEFAULT_CONTROLS,
  CORT_FRANKENSIM_BOUNDARY,
  CORT_KERNEL_SOURCE,
  CORT_SOURCE_BOUNDARY,
  CORT_ZERO_PHASES,
  getCortTapeFrame,
  stepCortPuddlingRolling,
} from "@/physics/cortKernel";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import {
  type CortPuddlingRollingCameraPreset as CameraPreset,
  cortPuddlingRollingViewForViewport,
} from "./cortPuddlingRollingCamera";
import { buildCortPuddlingRollingModel } from "./cortPuddlingRollingModel";
import { type KernelChip, StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

const EXHIBIT_ID = "gb-1420-cort-puddling-rolling";

const CAMERA_PRESET_OPTIONS: readonly { readonly id: CameraPreset; readonly label: string }[] = [
  { id: "iso", label: "Overview" },
  { id: "furnace", label: "Puddling Furnace" },
  { id: "hearth", label: "Molten Hearth" },
  { id: "mill", label: "Rolling Mill" },
  { id: "grooves", label: "Groove Passes" },
  { id: "drive", label: "Roll Drive" },
];

export function CortPuddlingRolling3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [cutaway, setCutaway] = useState(true);
  const [activePreset, setActivePreset] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound } = usePatentAudio();

  const { params, updateParam, resetParams } = usePatentPhysics(EXHIBIT_ID);
  const furnaceTempC =
    params.furnaceTemperatureCelsius ?? CORT_DEFAULT_CONTROLS.furnaceTemperatureCelsius;
  const initialCarbon = params.initialCarbonPercent ?? CORT_DEFAULT_CONTROLS.initialCarbonPercent;
  const rabbleRpm = params.rabbleStirringRpm ?? CORT_DEFAULT_CONTROLS.rabbleStirringRpm;
  const puddlingMin =
    params.puddlingDurationMinutes ?? CORT_DEFAULT_CONTROLS.puddlingDurationMinutes;
  const rollerPassCount = params.rollerPassCount ?? CORT_DEFAULT_CONTROLS.rollerPassCount;
  const rollSpeedRpm = params.rollSpeedRpm ?? CORT_DEFAULT_CONTROLS.rollSpeedRpm;
  const isRunning = (params.isRunning ?? 1) > 0.5;

  const fallbackOutputs = stepCortPuddlingRolling({
    furnaceTemperatureCelsius: furnaceTempC,
    initialCarbonPercent: initialCarbon,
    rabbleStirringRpm: rabbleRpm,
    puddlingDurationMinutes: puddlingMin,
    rollerPassCount,
    rollSpeedRpm,
  });

  const live = useLiveSimParams({
    cutaway,
  });

  const { frame } = useFrankenSimPhysics(EXHIBIT_ID, {
    domain: "thermodynamics_transport",
    refusal: { isRefused: true, reason: CORT_SOURCE_BOUNDARY },
  });
  const tape = getCortTapeFrame();
  const outputs = tape?.outputs ?? fallbackOutputs;

  const studioRef = useRef<StudioContext | null>(null);

  // The persistent WebGL scene consumes the stable layout-effect-synchronized control ref so toggles do not rebuild and flash the studio.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const initialCamera = cortPuddlingRollingViewForViewport("iso", container.clientWidth);
    const studio = createThreeStudioScene({
      container,
      cameraPos: initialCamera.pos,
      targetPos: initialCamera.target,
      fov: 42,
      enableFloorGrid: true,
    });
    studioRef.current = studio;

    const model = buildCortPuddlingRollingModel();
    studio.scene.add(model.root);

    let animId = 0;

    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop);
      if (!studio.isVisible()) return;
      // Pure consumer of the shared transport tape: kinematic phases arrive
      // pre-integrated on the tape, so no local clock or synthetic dt is needed.
      const liveTape = getCortTapeFrame();

      model.setCutaway(live.current.cutaway);
      model.updateAnimation(
        liveTape?.phases ?? CORT_ZERO_PHASES,
        liveTape?.timeSec ?? 0,
        liveTape?.outputs.isPastyNatureState ?? fallbackOutputs.isPastyNatureState,
      );

      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
      model.dispose();
      studio.cleanup();
    };
  }, [fallbackOutputs.isPastyNatureState, live]);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActivePreset(preset);
    const studio = studioRef.current;
    if (!studio) return;
    const camera = cortPuddlingRollingViewForViewport(
      preset,
      containerRef.current?.clientWidth ?? 1000,
    );
    studio.controls.setView(camera.pos, camera.target);
  };

  useEffect(() => {
    const restoreResponsiveView = () => {
      const container = containerRef.current;
      if (!container) return;
      const camera = cortPuddlingRollingViewForViewport(activePreset, container.clientWidth);
      studioRef.current?.controls.setView(camera.pos, camera.target);
    };

    window.addEventListener("resize", restoreResponsiveView);
    return () => window.removeEventListener("resize", restoreResponsiveView);
  }, [activePreset]);

  const chips: KernelChip[] = [
    {
      label: "Scenario Charge",
      value: outputs.isPastyNatureState ? "Coming to Nature" : "Molten Fluid",
      unit: `${outputs.residualCarbonPercent.toFixed(2)}% C`,
      tone: outputs.isPastyNatureState ? "ok" : "warn",
    },
    {
      label: "Scenario Solidus",
      value: `${outputs.ironMeltingPointCelsius} °C`,
      unit: "linearized Fe–C relation",
      tone: "ok",
    },
    {
      label: "Scenario Slag",
      value: `${outputs.residualSlagVolumeFractionPercent.toFixed(1)}%`,
      unit: `-${outputs.slagExpelledKg.toFixed(1)} kg`,
      tone: outputs.residualSlagVolumeFractionPercent < 3.0 ? "ok" : "warn",
    },
    {
      label: "Scenario Roll Load",
      value: `${outputs.rollSeparationForceKn.toFixed(0)} kN`,
      unit: `${outputs.hydrostaticSqueezePressureMpa.toFixed(0)} MPa`,
      tone: "ok",
    },
    {
      label: "First-Pass Nip",
      value: `${outputs.rollNipGapMm.toFixed(0)} mm`,
      unit: `${outputs.nipInterferenceMm.toFixed(0)} mm interference`,
      tone: "ok",
    },
  ];

  return (
    <div
      className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent"
      data-cort-face="three"
      data-cort-runtime-tick={frame.tick}
      data-cort-runtime-provenance={frame.provenance}
      data-cort-kernel-source={CORT_KERNEL_SOURCE}
      data-cort-frankensim-boundary={CORT_FRANKENSIM_BOUNDARY}
      data-cort-running={isRunning}
      data-cort-top-roll-phase-rad={tape?.phases.topRollRad ?? 0}
      data-cort-bottom-roll-phase-rad={tape?.phases.bottomRollRad ?? 0}
      data-cort-rabble-phase-rad={tape?.phases.rabbleCycleRad ?? 0}
      data-cort-billet-travel-m={tape?.phases.billetTravelM ?? 0}
      data-cort-nip-interference-mm={outputs.nipInterferenceMm}
    >
      <div className="sr-only">Henry Cort Puddling Process and Grooved Rollers 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* The compact camera control remains reachable even when the phone HUD is hidden. */}
        <label className="absolute top-14 left-3 z-10 sm:hidden">
          <span className="sr-only">Cort process camera view</span>
          <select
            aria-label="Cort process camera view"
            value={activePreset}
            onChange={(event) => applyCameraPreset(event.target.value as CameraPreset)}
            className="min-h-10 max-w-[10.5rem] rounded-lg border border-parchment-300 bg-white/90 px-2 text-xs font-semibold text-ink-800 shadow-sm backdrop-blur-md dark:border-ink-700 dark:bg-ink-900/90 dark:text-parchment-200"
          >
            {CAMERA_PRESET_OPTIONS.map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </label>

        {/* Camera Views Bar */}
        {showUiOverlay && (
          <div className="absolute top-4 left-4 z-10 hidden max-w-[calc(100%-28rem)] flex-nowrap gap-1.5 overflow-x-auto rounded-xl border border-parchment-300 bg-white/85 p-1.5 text-xs shadow-sm backdrop-blur-md transition-opacity duration-200 scrollbar-none dark:border-ink-700 dark:bg-ink-900/85 sm:flex">
            <span className="px-2 py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3.5 h-3.5" /> View:
            </span>
            {CAMERA_PRESET_OPTIONS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => applyCameraPreset(id)}
                className={`min-h-9 px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
                  activePreset === id
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
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap justify-end gap-1.5 sm:gap-2 max-w-[min(90%,26rem)] sm:max-w-[26rem]">
          <button
            type="button"
            onClick={() => {
              setCutaway((v) => !v);
              soundEngine.playSwitchClick();
            }}
            title={cutaway ? "Switch to Solid Furnace" : "Switch to Roof Cutaway"}
            className={`min-h-9 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs flex items-center gap-1 ${
              cutaway
                ? "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-700"
                : "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5 inline sm:mr-1" />
            <span className="hidden md:inline">{cutaway ? "Cutaway" : "Solid"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              updateParam("isRunning", isRunning ? 0 : 1);
              soundEngine.playSwitchClick();
            }}
            title={isRunning ? "Pause Process Motion" : "Resume Process Motion"}
            aria-label={isRunning ? "Pause Process Motion" : "Resume Process Motion"}
            className="min-h-9 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs flex items-center gap-1 bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isRunning ? "Pause" : "Resume"}</span>
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
            aria-label="Reset Simulation and Camera"
            type="button"
            onClick={() => {
              resetParams();
              updateParam("resetEpoch", (params.resetEpoch ?? 0) + 1);
              applyCameraPreset("iso");
              soundEngine.playSwitchClick();
            }}
            className="min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title="Reset Simulation and Camera"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Bottom SI Telemetry Chips */}
        <StudioKernelChips visible={showUiOverlay} chips={chips} title="SI Telemetry" />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Reverberatory Temp</span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {furnaceTempC} °C
              </span>
            </div>
            <input
              type="range"
              aria-label="Reverberatory furnace temperature"
              min="1100"
              max="1450"
              step="10"
              value={furnaceTempC}
              onChange={(e) =>
                updateParam("furnaceTemperatureCelsius", Number.parseFloat(e.target.value))
              }
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Pig Iron Carbon</span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {initialCarbon.toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              aria-label="Pig iron carbon content"
              min="2.5"
              max="4.5"
              step="0.1"
              value={initialCarbon}
              onChange={(e) =>
                updateParam("initialCarbonPercent", Number.parseFloat(e.target.value))
              }
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Roll Speed</span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {rollSpeedRpm} RPM
              </span>
            </div>
            <input
              type="range"
              aria-label="Roll speed"
              min="10"
              max="50"
              step="1"
              value={rollSpeedRpm}
              onChange={(e) => updateParam("rollSpeedRpm", Number.parseFloat(e.target.value))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
          {CORT_SOURCE_BOUNDARY}
        </p>
      </div>
    </div>
  );
}
