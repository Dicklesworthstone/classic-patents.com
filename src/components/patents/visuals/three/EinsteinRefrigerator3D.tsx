"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { stepEinsteinRefrigerator } from "@/physics/catalogKernels";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import { ensureGenericWasm } from "@/physics/genericWasm";
import { createStudioClock } from "@/physics/tickScheduler";
import type { ThermodynamicsState } from "@/physics/types";
import {
  globalTransportBus,
  type TapeUpdater,
  useFrankenSimPhysics,
} from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import {
  buildEinsteinRefrigeratorModel,
  updateEinsteinRefrigeratorKinematics,
} from "./einsteinRefrigeratorModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "generator" | "condenser" | "evaporator" | "exchanger" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [11, 8, 14], target: [0, 0, 0] },
  generator: { pos: [-4.8, -1.1, 3.8], target: [-3.4, -2.05, 0] },
  condenser: { pos: [2.4, 2.8, 3.8], target: [0, 0, 0] },
  evaporator: { pos: [4.8, 1.7, 3.8], target: [3.4, 0.32, 0] },
  exchanger: { pos: [-3.2, -0.6, 3.6], target: [-1.55, -2.05, 0] },
  top: { pos: [0, 11.5, 0.1], target: [0, 0, 0] },
};

const IDLE_THERMO: ThermodynamicsState = {
  temperatureCelsius: 0,
  temperatureKelvin: 0,
  pressureAtm: 0,
  partialPressureButaneAtm: 0,
  heatInputWatts: 0,
  coolingPowerWatts: 0,
  coefficientOfPerformance: 0,
  blackbodyRadiantPowerWatts: 0,
  fluidFlowVelocityMps: 0,
};

export function EinsteinRefrigerator3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Absorption Thermodynamics State Controls
  const { params, effectiveParams, updateParam, claimStates } = usePatentPhysics(
    "us-1781541-einstein-refrigerator",
  );
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const heatInputWatts = effectiveParams.heatInput ?? 220;
  const systemPressureAtm = effectiveParams.totalPressure ?? 15;
  const auxiliaryGasRatio =
    effectiveParams.ammoniaRatio ?? effectiveParams.auxiliaryGasRatio ?? 0.65;
  const [isHeating, _setIsHeating] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const claim1Active = claimStates[1] ?? true;

  useEffect(() => {
    void ensureGenericWasm();
  }, []);

  const frige = stepEinsteinRefrigerator({
    heatInput: heatInputWatts,
    totalPressure: systemPressureAtm,
    ammoniaRatio: auxiliaryGasRatio,
    claim1LiftPathPresent: effectiveParams.claim1LiftPathPresent,
  });
  const evaporatorTemperatureCelsius = frige.evapTempC;
  const copEfficiency = frige.cop.toFixed(2);
  const coolingPowerWatts = frige.coolingWatts;

  const live = useLiveSimParams({
    heatInputWatts,
    isHeating,
    isCutaway,
    showCalloutPins,
    isAudioMuted,
    totalPressureAtm: systemPressureAtm,
    partialPressureButaneAtm: frige.partialPressureButaneAtm,
    claim1Active: claim1Active ? 1 : 0,
    coolingWatts: frige.coolingWatts,
    evapTempC: frige.evapTempC,
    cop: frige.cop,
    fluidDisplaySpeed: frige.fluidDisplaySpeed,
    heaterGlowIntensity: frige.heaterGlowIntensity,
    generatorGlowIntensity: frige.generatorGlowIntensity,
    evaporatorGlowIntensity: frige.evaporatorGlowIntensity,
    heatFrameIndex: frige.heatFrameIndex,
    fluidWrapY: frige.fluidWrapY,
  });

  // Shared transport tape: the absorption-cycle operating point publishes to
  // the patentId-keyed bus so every face reads one deterministic state.
  useFrankenSimPhysics("us-1781541-einstein-refrigerator", {
    domain: "thermodynamics_transport",
    refusal: claim1Active
      ? { isRefused: false }
      : {
          isRefused: true,
          reason: frige.refusalReason ?? "Claim 1 heated liquid-lift path is withheld.",
        },
    thermo: {
      ...IDLE_THERMO,
      temperatureCelsius: frige.evapTempC,
      temperatureKelvin: frige.evapTempC + 273.15,
      pressureAtm: systemPressureAtm,
      partialPressureButaneAtm: frige.partialPressureButaneAtm,
      heatInputWatts,
      coolingPowerWatts: claim1Active ? frige.coolingWatts : 0,
      coefficientOfPerformance: frige.cop,
    },
  });

  // One tape-bound gate (br-ixl): the bus updater owns the claim boundary and
  // publishes the kernel-derived cycle state each tick.
  useEffect(() => {
    const integrate: TapeUpdater = () => {
      const refused = (live.current.claim1Active ?? 1) < 0.5;
      return {
        refusal: {
          isRefused: refused,
          reason: refused
            ? "Claim 1 heated conduit 32 is withheld; no cooling state is inferred."
            : undefined,
        },
        thermo: {
          ...IDLE_THERMO,
          temperatureCelsius: live.current.evapTempC ?? -25,
          temperatureKelvin: (live.current.evapTempC ?? -25) + 273.15,
          pressureAtm: live.current.totalPressureAtm ?? 15,
          partialPressureButaneAtm: live.current.partialPressureButaneAtm ?? 5.25,
          heatInputWatts: live.current.heatInputWatts ?? 220,
          coolingPowerWatts: refused ? 0 : (live.current.coolingWatts ?? 0),
          coefficientOfPerformance: refused ? 0 : (live.current.cop ?? 0),
        },
      };
    };
    return globalTransportBus.registerUpdater(
      "us-1781541-einstein-refrigerator",
      integrate,
      "TS_FALLBACK",
    );
  }, [live]);

  const studioRef = useRef<StudioContext | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const toggleSound = () => {
    toggleEngine(() => {
      soundEngine.playSwitchClick();
    });
  };

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

    const { scene, renderer, controls } = studio;

    // Build procedural 3D model
    const fridge = buildEinsteinRefrigeratorModel();
    scene.add(fridge.rootGroup);

    // Animation Loop
    let reqId: number;

    const clock = createStudioClock();

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const { dt } = clock.pump(now);
      const p = live.current;

      updateEinsteinRefrigeratorKinematics(
        fridge,
        dt,
        p.fluidDisplaySpeed,
        p.heaterGlowIntensity,
        p.generatorGlowIntensity,
        p.isHeating,
        p.isCutaway,
        p.heatFrameIndex,
        p.fluidWrapY,
        (p.claim1Active ?? 1) >= 0.5,
      );

      controls.update();
      renderer.render(scene, studio.camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      fridge.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">
        Albert Einstein & Leo Szilard (US 1,781,541) Absorption Refrigerator 3D
      </div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-9.5rem)] sm:max-w-[calc(100%-28rem)] gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["generator", "Boiler Generator"],
                ["condenser", "Condenser Fins"],
                ["evaporator", "Cold Evaporator"],
                ["exchanger", "Solution Exchanger"],
                ["top", "Top View"],
              ] as const
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyCameraPreset(preset)}
                className={`min-h-9 px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
                  activeCamera === preset
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-ink-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Top Right Tool Bar */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Switch to Solid Steel" : "Switch to Vessel Cutaway"}
            className={`min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              isCutaway
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            aria-label={showUiOverlay ? "Hide overlay interface" : "Show overlay interface"}
            className={`min-h-9 p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showUiOverlay
                ? "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
                : "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
            }`}
          >
            {showUiOverlay ? (
              <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
          <button
            aria-label={isAudioMuted ? "Unmute simulation audio" : "Mute simulation audio"}
            type="button"
            onClick={toggleSound}
            className="min-h-9 p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            )}
          </button>
          <button
            aria-label={showCalloutPins ? "Hide annotation pins" : "Show annotation pins"}
            type="button"
            onClick={() => setShowCalloutPins(!showCalloutPins)}
            className={`min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showCalloutPins
                ? "bg-amber-600 text-white border-amber-700 shadow-md"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                Evaporator Temp:
              </span>
              <span className="font-bold text-cyan-700 dark:text-cyan-400">
                {claim1Active
                  ? `${evaporatorTemperatureCelsius.toFixed(1)} °C (${frige.evapTempF} °F)`
                  : "WITHHELD"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Cooling Output:</span>
              <span className="text-emerald-800 dark:text-emerald-400 font-bold">
                {claim1Active ? `${coolingPowerWatts.toFixed(1)} W` : "REFUSED"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Heat Input:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {heatInputWatts} W
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">COP Efficiency:</span>
              <span className="text-purple-800 dark:text-purple-400 font-bold">
                {claim1Active ? copEfficiency : "REFUSED"}
              </span>
            </div>
          </div>
        )}

        {/* Bottom SI Telemetry Chip Strip */}
        <StudioKernelChips
          side="right"
          visible={showUiOverlay}
          title="ABSORPTION REFRIGERATION THERMODYNAMICS"
          chips={[
            {
              label: "T_evap",
              value: claim1Active ? evaporatorTemperatureCelsius.toFixed(1) : "WITHHELD",
              unit: claim1Active ? "°C" : undefined,
              tone: claim1Active ? "ok" : "warn",
            },
            {
              label: "Q_cooling",
              value: claim1Active ? coolingPowerWatts.toFixed(0) : "REFUSED",
              unit: claim1Active ? "W" : undefined,
            },
            { label: "COP", value: claim1Active ? copEfficiency : "REFUSED" },
            { label: "Q_heat", value: `${heatInputWatts.toFixed(0)}`, unit: "W" },
            {
              label: "P_total",
              value: `${systemPressureAtm.toFixed(1)}`,
              unit: "atm",
            },
            { label: "Working Fluid", value: "Butane + NH₃ + H₂O" },
            {
              label: "Mechanism",
              value: claim1Active
                ? "Gravity + Heat-Lift / Hermetic"
                : "Conduit 32 Withheld / Open Cycle",
              tone: claim1Active ? undefined : "warn",
            },
            { label: "Boundary", value: "Illustrative scenario — patent prints no setpoint" },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SensitivitySlider
            id="einsteinHeatInput"
            patentId="us-1781541-einstein-refrigerator"
            paramKey="heatInput"
            label="Heat Source Input"
            value={heatInputWatts}
            min={50}
            max={500}
            step={10}
            unit=" W"
            onChange={(val) => updateParam("heatInput", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="einsteinTotalPressure"
            patentId="us-1781541-einstein-refrigerator"
            paramKey="totalPressure"
            label="Total System Pressure"
            value={systemPressureAtm}
            min={5}
            max={30}
            step={1}
            unit=" atm"
            onChange={(val) => updateParam("totalPressure", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="einsteinAmmoniaRatio"
            patentId="us-1781541-einstein-refrigerator"
            paramKey="ammoniaRatio"
            label="Ammonia Auxiliary Fraction"
            value={Math.round(auxiliaryGasRatio * 100)}
            min={20}
            max={90}
            step={5}
            unit="%"
            onChange={(val) => updateParam("ammoniaRatio", val / 100)}
            allParams={params}
          />
        </div>

        <ClaimConstraintToggle
          patentId="us-1781541-einstein-refrigerator"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            updateParam(claimConstraintStateParamId(claimNo), active ? 1 : 0)
          }
          className="mt-2"
        />

        {claim1Active ? (
          <PortHamiltonianEnergyStrip
            patentId="us-1781541-einstein-refrigerator"
            params={effectiveParams}
            className="mt-3"
          />
        ) : (
          <div className="mt-3 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 font-mono text-[11px] text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200">
            Energy ledger refused: Claim 1&apos;s heat-lift return is open, and the grant prints no
            replacement operating state.
          </div>
        )}
      </div>
    </div>
  );
}
