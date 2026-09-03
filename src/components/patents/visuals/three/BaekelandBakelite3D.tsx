"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { stepBaekelandBakelite } from "@/physics/catalogKernels";
import { createStudioClock } from "@/physics/tickScheduler";
import type { ContinuumState, ThermodynamicsState } from "@/physics/types";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { buildBaekelandBakeliteModel } from "./baekelandBakeliteModel";
import { type KernelChip, StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

const EXHIBIT_ID = "us-942699-baekeland-bakelite";

type CameraPreset = "iso" | "autoclave" | "mold" | "molecular" | "gauges";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [4.5, 3.2, 5.5], target: [0, 1.6, 0] },
  autoclave: { pos: [0, 1.8, 4.0], target: [0, 1.4, 0] },
  mold: { pos: [0, 1.4, 1.6], target: [0, 1.3, 0] },
  molecular: { pos: [0, 4.2, 2.5], target: [0, 3.4, 0] },
  gauges: { pos: [0, 2.8, 1.8], target: [0, 2.4, 0] },
};

const PRESET_LABELS: Record<CameraPreset, string> = {
  iso: "Isometric",
  autoclave: "Autoclave",
  mold: "Mold & Press",
  molecular: "Polymer Matrix",
  gauges: "Gauges",
};

export function BaekelandBakelite3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [cutaway, setCutaway] = useState(true);
  const [showCallouts, setShowCallouts] = useState(true);
  const [activePreset, setActivePreset] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  const { params, updateParam } = usePatentPhysics(EXHIBIT_ID);
  const tempC = (params.curingTempC as number) ?? 130;
  const pressPsi = (params.autoclavePressurePsi as number) ?? 75;
  const catPct = (params.catalystPct as number) ?? 1.5;
  const timeMin = (params.curingTimeMin as number) ?? 60;
  const filler = (params.fillerPct as number) ?? 45;

  const live = useLiveSimParams({
    curingTempC: tempC,
    autoclavePressurePsi: pressPsi,
    catalystPct: catPct,
    curingTimeMin: timeMin,
    fillerPct: filler,
    cutaway,
    showCallouts,
  });

  // Shared transport tape: the curing kernel is steady-state in the controls
  // (no time integration), so this face publishes an honest ENVELOPE —
  // autoclave thermodynamics and cured-resin strength from
  // stepBaekelandBakelite — while the local rAF keeps pacing the display.
  const sim = stepBaekelandBakelite(tempC, pressPsi, catPct, timeMin, filler);

  const bakeliteThermo: ThermodynamicsState = {
    temperatureCelsius: tempC,
    temperatureKelvin: tempC + 273.15,
    pressureAtm: pressPsi / 14.6959, // autoclave gauge psi -> atm
    partialPressureButaneAtm: 0,
    heatInputWatts: 0,
    coolingPowerWatts: 0,
    coefficientOfPerformance: 0,
    blackbodyRadiantPowerWatts: 0,
    fluidFlowVelocityMps: 0,
  };
  const curedContinuum: ContinuumState = {
    tensileStressMpa: sim.tensileStrengthMpa,
    tensileStrainPct: 0,
    elasticModulusGpa: 0,
    crossLinkDensityMolesPerCm3: 0,
    stitchFrequencyHz: 0,
    feedVelocityMmPs: 0,
    buoyancyLiftForceKiloNewtons: 0,
  };
  useFrankenSimPhysics(EXHIBIT_ID, {
    domain: "materials_kinetics",
    refusal: {
      isRefused: !sim.isFoamingSuppressed,
      reason: !sim.isFoamingSuppressed
        ? "Insufficient mold pressure: foaming voids would defeat the thermoset"
        : undefined,
    },
    thermo: bakeliteThermo,
    continuum: curedContinuum,
  });

  const studioRef = useRef<ReturnType<typeof createThreeStudioScene> | null>(null);

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

    const model = buildBaekelandBakeliteModel();
    studio.scene.add(model.rootGroup);

    let rafId = 0;
    const clock = createStudioClock();

    const animate = (now: number) => {
      rafId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const { simTimeSec: virtualTime } = clock.pump(now);

      const p = live.current;
      model.update(
        {
          curingTempC: p.curingTempC,
          autoclavePressurePsi: p.autoclavePressurePsi,
          catalystPct: p.catalystPct,
          curingTimeMin: p.curingTimeMin,
          fillerPct: p.fillerPct,
        },
        virtualTime,
      );
      model.setCutaway(p.cutaway);
      model.setCalloutsVisible(p.showCallouts);

      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      studio.dispose();
      studioRef.current = null;
    };
  }, [live]);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActivePreset(preset);
    if (preset === "mold") setCutaway(true);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const chips: KernelChip[] = [
    {
      label: "Stage",
      value: sim.resinStage.split(" ")[0] ?? "A-stage",
      tone: sim.resinStage.startsWith("C") ? "ok" : undefined,
    },
    {
      label: "Conversion",
      value: `${(sim.conversionP * 100).toFixed(1)}%`,
      tone: sim.conversionP >= 0.85 ? "ok" : undefined,
    },
    {
      label: "P_model",
      value: `${pressPsi} psi`,
      tone: sim.isFoamingSuppressed ? "ok" : "warn",
    },
    {
      label: "Tensile (model)",
      value: `${sim.tensileStrengthMpa} MPa`,
      tone: "ok",
    },
    {
      label: "Dielectric (model)",
      value: `${sim.dielectricBreakdownKvPerMm} kV/mm`,
      tone: "ok",
    },
  ];

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">
        Leo Baekeland phenol-formaldehyde process, editorial 3D model. The closed vessel and
        molecular network are modern interpretations, not historical drawings.
      </div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-9.5rem)] sm:max-w-[calc(100%-28rem)] gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3.5 h-3.5" /> View:
            </span>
            {(["iso", "autoclave", "mold", "molecular", "gauges"] as const).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyCameraPreset(preset)}
                className={`min-h-9 px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
                  activePreset === preset
                    ? "bg-amber-600 text-white shadow-xs font-semibold"
                    : "text-ink-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {PRESET_LABELS[preset]}
              </button>
            ))}
          </div>
        )}

        {/* Top-Right Action Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap justify-end gap-1.5 sm:gap-2 max-w-[min(90%,26rem)] sm:max-w-[26rem]">
          <button
            type="button"
            onClick={() => {
              setCutaway(!cutaway);
              soundEngine.playSwitchClick();
            }}
            title={cutaway ? "Switch to Solid Autoclave" : "Switch to Autoclave Cutaway"}
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
              setShowCallouts(!showCallouts);
              soundEngine.playSwitchClick();
            }}
            title={showCallouts ? "Hide Callout Numbers" : "Show Callout Numbers"}
            className={`min-h-9 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs flex items-center gap-1 ${
              showCallouts
                ? "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-700"
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
            onClick={() => applyCameraPreset("iso")}
            className="min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        <StudioKernelChips visible={showUiOverlay} chips={chips} title="Bakelite SI Telemetry" />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SensitivitySlider
            id="curingTemp"
            patentId="us-942699-baekeland-bakelite"
            paramKey="autoclaveTempC"
            label="Curing Temperature"
            value={tempC}
            min={110}
            max={200}
            step={5}
            onChange={(val) => updateParam("curingTempC", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="autoclavePressure"
            patentId="us-942699-baekeland-bakelite"
            paramKey="autoclavePressurePsi"
            label="Closed-Vessel Pressure (model)"
            value={pressPsi}
            min={25}
            max={150}
            step={5}
            onChange={(val) => updateParam("autoclavePressurePsi", val)}
            allParams={params}
          />

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Wood-Flour Filler</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                {filler}%
              </span>
            </div>
            <input
              type="range"
              aria-label="Wood-flour filler percentage"
              min="10"
              max="60"
              step="5"
              value={filler}
              onChange={(e) => updateParam("fillerPct", Number.parseFloat(e.target.value))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>
        </div>

        <ClaimConstraintToggle
          patentId="us-942699-baekeland-bakelite"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-942699-baekeland-bakelite"
          params={params}
          className="mt-3"
        />
      </div>
    </div>
  );
}
