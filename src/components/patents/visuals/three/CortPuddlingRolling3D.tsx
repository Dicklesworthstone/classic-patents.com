"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepCortPuddlingRolling } from "@/physics/cortKernel";
import { createStudioClock } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildCortPuddlingRollingModel } from "./cortPuddlingRollingModel";
import { type KernelChip, StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

const EXHIBIT_ID = "gb-1420-cort-puddling-rolling";

type CameraPreset = "iso" | "furnace" | "hearth" | "mill" | "grooves";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [0, 2.8, 6.0], target: [0, 1.2, 0] },
  furnace: { pos: [-2.8, 2.2, 3.8], target: [-2.8, 1.2, 0] },
  hearth: { pos: [-2.5, 1.8, 1.6], target: [-2.5, 0.9, 0] },
  mill: { pos: [2.0, 1.8, 3.6], target: [2.0, 1.1, 0] },
  grooves: { pos: [2.0, 1.3, 1.8], target: [2.0, 1.0, 0] },
};

export function CortPuddlingRolling3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [cutaway, setCutaway] = useState(true);
  const [showCallouts, setShowCallouts] = useState(true);
  const [activePreset, setActivePreset] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound } = usePatentAudio();

  const { params, updateParam } = usePatentPhysics(EXHIBIT_ID);
  const furnaceTempC = params.furnaceTemperatureCelsius ?? 1350;
  const initialCarbon = params.initialCarbonPercent ?? 3.8;
  const rabbleRpm = params.rabbleStirringRpm ?? 15;
  const puddlingMin = params.puddlingDurationMinutes ?? 90;
  const rollerPassCount = params.rollerPassCount ?? 5;
  const rollSpeedRpm = params.rollSpeedRpm ?? 30;

  const live = useLiveSimParams({
    furnaceTemperatureCelsius: furnaceTempC,
    initialCarbonPercent: initialCarbon,
    rabbleStirringRpm: rabbleRpm,
    puddlingDurationMinutes: puddlingMin,
    rollerPassCount: rollerPassCount,
    rollSpeedRpm: rollSpeedRpm,
  });

  const cutawayRef = useRef(cutaway);
  cutawayRef.current = cutaway;
  const calloutsRef = useRef(showCallouts);
  calloutsRef.current = showCallouts;

  const studioRef = useRef<ReturnType<typeof createThreeStudioScene> | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const iso = CAMERA_PRESETS.iso;
    const studio = createThreeStudioScene({
      container,
      cameraPos: iso.pos,
      targetPos: iso.target,
      fov: 42,
      enableFloorGrid: true,
    });
    studioRef.current = studio;

    const model = buildCortPuddlingRollingModel();
    studio.scene.add(model.root);

    let animId = 0;
    const clock = createStudioClock();

    const renderLoop = (now: number) => {
      animId = requestAnimationFrame(renderLoop);
      const { simTimeSec: virtualTime } = clock.pump(now);

      const p = live.current;
      const outputs = stepCortPuddlingRolling({
        furnaceTemperatureCelsius: p.furnaceTemperatureCelsius,
        initialCarbonPercent: p.initialCarbonPercent,
        rabbleStirringRpm: p.rabbleStirringRpm,
        puddlingDurationMinutes: p.puddlingDurationMinutes,
        rollerPassCount: p.rollerPassCount,
        rollSpeedRpm: p.rollSpeedRpm,
      });

      model.setCutaway(cutawayRef.current);
      model.setShowCallouts(calloutsRef.current);
      model.updateAnimation(
        virtualTime,
        outputs.isPastyNatureState,
        outputs.rollOmegaRadPerS,
        outputs.rabbleOmegaRadPerS,
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
  }, [live]);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActivePreset(preset);
    const studio = studioRef.current;
    if (!studio) return;
    const cfg = CAMERA_PRESETS[preset];
    studio.controls.setView(cfg.pos, cfg.target);
  };

  const outputs = stepCortPuddlingRolling({
    furnaceTemperatureCelsius: furnaceTempC,
    initialCarbonPercent: initialCarbon,
    rabbleStirringRpm: rabbleRpm,
    puddlingDurationMinutes: puddlingMin,
    rollerPassCount,
    rollSpeedRpm,
  });

  const chips: KernelChip[] = [
    {
      label: "Charge State",
      value: outputs.isPastyNatureState ? "Coming to Nature" : "Molten Fluid",
      unit: `${outputs.residualCarbonPercent.toFixed(2)}% C`,
      tone: outputs.isPastyNatureState ? "ok" : "warn",
    },
    {
      label: "Melting Point",
      value: `${outputs.ironMeltingPointCelsius} °C`,
      unit: `+${outputs.ironMeltingPointCelsius - 1147}°C rise`,
      tone: "ok",
    },
    {
      label: "Residual Slag",
      value: `${outputs.residualSlagVolumeFractionPercent.toFixed(1)}%`,
      unit: `-${outputs.slagExpelledKg.toFixed(1)} kg`,
      tone: outputs.residualSlagVolumeFractionPercent < 3.0 ? "ok" : "warn",
    },
    {
      label: "Tensile Strength",
      value: `${outputs.tensileStrengthMpa.toFixed(0)} MPa`,
      unit: `${outputs.ductilityElongationPercent.toFixed(0)}% elongation`,
      tone: "ok",
    },
    {
      label: "Throughput Speedup",
      value: `${outputs.productionSpeedupVsHammer}×`,
      unit: "vs Tilt Hammer",
      tone: "ok",
    },
  ];

  const presets: { id: CameraPreset; label: string }[] = [
    { id: "iso", label: "Overview" },
    { id: "furnace", label: "Puddling Furnace" },
    { id: "hearth", label: "Molten Hearth" },
    { id: "mill", label: "Rolling Mill" },
    { id: "grooves", label: "Groove Passes" },
  ];

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Henry Cort Puddling Process and Grooved Rollers 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Camera Views Bar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-14rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3.5 h-3.5" /> View:
            </span>
            {presets.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => applyCameraPreset(id)}
                className={`px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
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
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap justify-end gap-1.5 sm:gap-2 max-w-[90%]">
          <button
            type="button"
            onClick={() => {
              setCutaway((v) => !v);
              soundEngine.playSwitchClick();
            }}
            title={cutaway ? "Switch to Solid Furnace" : "Switch to Roof Cutaway"}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs flex items-center gap-1 ${
              cutaway
                ? "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-600"
                : "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5 inline sm:mr-1" />
            <span className="hidden md:inline">{cutaway ? "Cutaway" : "Solid"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowCallouts((v) => !v);
              soundEngine.playSwitchClick();
            }}
            title={showCallouts ? "Hide Callout Letters" : "Show Callout Letters"}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs flex items-center gap-1 ${
              showCallouts
                ? "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-600"
                : "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
            }`}
          >
            <Zap className="w-3.5 h-3.5 inline sm:mr-1" />
            <span className="hidden md:inline">{showCallouts ? "Pins" : "Pins Off"}</span>
          </button>
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
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              showUiOverlay
                ? "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
                : "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-600"
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
            onClick={() => applyCameraPreset("iso")}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title="Reset Orbit Camera"
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
              min="1100"
              max="1450"
              step="10"
              value={furnaceTempC}
              onChange={(e) =>
                updateParam("furnaceTemperatureCelsius", Number.parseFloat(e.target.value))
              }
              className="w-full accent-amber-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
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
              min="2.5"
              max="4.5"
              step="0.1"
              value={initialCarbon}
              onChange={(e) =>
                updateParam("initialCarbonPercent", Number.parseFloat(e.target.value))
              }
              className="w-full accent-amber-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
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
              min="10"
              max="50"
              step="1"
              value={rollSpeedRpm}
              onChange={(e) => updateParam("rollSpeedRpm", Number.parseFloat(e.target.value))}
              className="w-full accent-cyan-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
