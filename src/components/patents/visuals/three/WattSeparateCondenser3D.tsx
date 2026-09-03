"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { createStudioClock } from "@/physics/tickScheduler";
import {
  globalTransportBus,
  type TapeUpdater,
  useFrankenSimPhysics,
} from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { stepWattCondenser } from "@/physics/wattCondenserKernel";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { type KernelChip, StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";
import {
  type WattSeparateCondenserCameraPreset,
  wattSeparateCondenserCameraForViewport,
} from "./wattSeparateCondenserCamera";
import { buildWattSeparateCondenserModel } from "./wattSeparateCondenserModel";

const EXHIBIT_ID = "gb-913-watt-separate-condenser";

export function WattSeparateCondenser3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [cutaway, setCutaway] = useState(false);
  const [showCallouts, setShowCallouts] = useState(true);
  const [activePreset, setActivePreset] = useState<WattSeparateCondenserCameraPreset>("iso");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  const handlePresetChange = (preset: WattSeparateCondenserCameraPreset) => {
    setActivePreset(preset);
    const cfg = wattSeparateCondenserCameraForViewport(
      preset,
      containerRef.current?.clientWidth ?? 1024,
    );
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const { params, updateParam } = usePatentPhysics(EXHIBIT_ID);
  const boilerPressurePsi = params.boilerPressurePsi ?? 10.0;
  const condenserTempC = params.condenserTempC ?? 38.0;
  const strokesPerMinute = params.strokesPerMinute ?? 16;

  const outputs = stepWattCondenser({
    boilerPressurePsi,
    condenserTempC,
    cylinderBoreInches: params.cylinderBoreInches,
    pistonStrokeFeet: params.pistonStrokeFeet,
    strokesPerMinute,
    hasSeparateCondenser: (params.hasSeparateCondenser ?? 1) > 0.5,
    hasSteamJacket: (params.hasSteamJacket ?? 1) > 0.5,
  });
  const live = useLiveSimParams({
    boilerPressurePsi,
    condenserTempC,
    strokesPerMinute,
    hasSeparateCondenser: (params.hasSeparateCondenser ?? 1) > 0.5,
    hasSteamJacket: (params.hasSteamJacket ?? 1) > 0.5,
    cutaway,
    showCallouts,
  });

  // Shared transport tape: condenser cycle publishes to the patentId-keyed bus.
  useFrankenSimPhysics(EXHIBIT_ID, {
    domain: "thermodynamics_transport",
    refusal: { isRefused: false },
  });
  const wattPhaseRef = useRef(0);

  useEffect(() => {
    const integrate: TapeUpdater = (_prev, dt) => {
      const p = live.current;
      const out = stepWattCondenser({
        boilerPressurePsi: p.boilerPressurePsi,
        condenserTempC: p.condenserTempC,
        strokesPerMinute: p.strokesPerMinute,
        hasSeparateCondenser: p.hasSeparateCondenser,
        hasSteamJacket: p.hasSteamJacket,
      });
      wattPhaseRef.current = (wattPhaseRef.current + dt * out.cycleOmegaRadPerS) % (2 * Math.PI);
      return {
        machine: {
          // Piston travel and beam deflection on the tape.
          poseXMeters: Math.sin(wattPhaseRef.current) * 0.5,
          poseYMeters: 2.6 + Math.sin(wattPhaseRef.current) * 0.5,
          headingRad: -Math.sin(wattPhaseRef.current) * (12 * (Math.PI / 180)),
          modeLabel: p.hasSeparateCondenser ? "separate condenser" : "steam jacket",
          wheelSpeedMps: 0,
        },
        thermo: {
          temperatureCelsius: out.steamTempC,
          temperatureKelvin: out.steamTempC + 273.15,
          pressureAtm: out.boilerPressureAbsKpa / 101.325,
          partialPressureButaneAtm: 0,
          heatInputWatts: out.heatInputRateKw * 1000,
          coolingPowerWatts: 0,
          coefficientOfPerformance: 0,
          blackbodyRadiantPowerWatts: 0,
          fluidFlowVelocityMps: 0,
        },
      };
    };
    const unregister = globalTransportBus.registerUpdater(EXHIBIT_ID, integrate, "TS_FALLBACK");
    return unregister;
  }, [live]);

  // The persistent WebGL scene consumes the stable layout-effect-synchronized control ref so toggles do not rebuild and flash the studio.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const iso = wattSeparateCondenserCameraForViewport("iso", container.clientWidth);
    const studio = createThreeStudioScene({
      container,
      cameraPos: iso.pos,
      targetPos: iso.target,
    });
    studioRef.current = studio;

    const model = buildWattSeparateCondenserModel();
    studio.scene.add(model.root);

    let rafId = 0;
    const clock = createStudioClock();

    const animate = (now: number) => {
      rafId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      clock.pump(now);
      // Bus-owned integration: read the latest shared-tape cycle phase.
      const pistonPos = Math.sin(wattPhaseRef.current);
      const beamAngleRad = -pistonPos * (12 * (Math.PI / 180));

      model.beamGroup.rotation.z = beamAngleRad;
      model.pistonGroup.position.y = 2.6 + pistonPos * 0.5;
      model.airPumpRodGroup.position.y = 2.5 - pistonPos * 0.35;
      model.pitworkRodGroup.position.y = 2.5 - pistonPos * 0.55;
      model.setCutaway(live.current.cutaway);
      model.setCalloutsVisible(live.current.showCallouts);

      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      model.dispose();
      studio.dispose();
      studioRef.current = null;
    };
  }, [live]);

  const chips: KernelChip[] = [
    {
      label: "Indicated Power",
      value: `${outputs.indicatedHorsepower.toFixed(1)} hp`,
      unit: `${outputs.indicatedPowerKw.toFixed(1)} kW`,
      tone: "ok",
    },
    {
      label: "Condenser Vacuum",
      value: `${outputs.vacuumDepthInchesHg.toFixed(1)} inHg`,
      unit: `${outputs.condenserPressureAbsKpa.toFixed(1)} kPa`,
      tone: "ok",
    },
    {
      label: "Thermal Efficiency",
      value: `${outputs.thermalEfficiencyPct.toFixed(2)}%`,
      unit: "Rankine cycle",
      tone: "hot",
    },
    {
      label: "Coal Burn Rate",
      value: `${outputs.coalConsumptionKgPerHour.toFixed(1)} kg/h`,
      unit: `${outputs.specificFuelConsumptionKgPerKwh.toFixed(2)} kg/kWh`,
      tone: "warn",
    },
  ];

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">James Watt Separate Condenser Steam Engine 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-9.5rem)] sm:max-w-[calc(100%-28rem)] gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3.5 h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Overview"],
                ["cylinder", "Steam Jacket (B)"],
                ["condenser", "Condenser (E)"],
                ["beam", "Walking Beam (H)"],
                ["boiler", "Boiler (A)"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => handlePresetChange(id)}
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
            title={cutaway ? "Switch to Solid Engine" : "Switch to Cylinder Cutaway"}
            className={`min-h-9 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs flex items-center gap-1 ${
              cutaway
                ? "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-700"
                : "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">{cutaway ? "Cutaway" : "Solid"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowCallouts((v) => !v);
              soundEngine.playSwitchClick();
            }}
            title={showCallouts ? "Hide Callout Letters" : "Show Callout Letters"}
            className={`min-h-9 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs flex items-center gap-1 ${
              showCallouts
                ? "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-700"
                : "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{showCallouts ? "Pins" : "Pins Off"}</span>
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
            onClick={() => handlePresetChange("iso")}
            className="min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
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
          <SensitivitySlider
            id="boilerPressure"
            patentId={EXHIBIT_ID}
            paramKey="boilerPressurePsi"
            label="Boiler Steam Pressure"
            value={boilerPressurePsi}
            min={5}
            max={30}
            step={0.5}
            unit="PSI"
            onChange={(val) => updateParam("boilerPressurePsi", val)}
            allParams={params}
          />

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Condenser Temperature
              </span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {condenserTempC.toFixed(0)} °C
              </span>
            </div>
            <input
              type="range"
              aria-label="Condenser temperature"
              min="20"
              max="60"
              step="1"
              value={condenserTempC}
              onChange={(e) => updateParam("condenserTempC", Number.parseFloat(e.target.value))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Stroke Rate</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                {strokesPerMinute} SPM
              </span>
            </div>
            <input
              type="range"
              aria-label="Stroke rate"
              min="10"
              max="35"
              step="1"
              value={strokesPerMinute}
              onChange={(e) => updateParam("strokesPerMinute", Number.parseFloat(e.target.value))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>
        </div>

        <ClaimConstraintToggle
          patentId={EXHIBIT_ID}
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip patentId={EXHIBIT_ID} params={params} className="mt-3" />
      </div>
    </div>
  );
}
