"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { stepHallAluminium } from "@/physics/catalogKernels";
import { createStudioClock } from "@/physics/tickScheduler";
import type { ElectromagneticsState, ThermodynamicsState } from "@/physics/types";
import {
  globalTransportBus,
  type TapeUpdater,
  useFrankenSimPhysics,
} from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { type HallAluminiumCameraPreset, hallViewForViewport } from "./hallAluminiumCamera";
import { createHallAluminiumModel, updateHallAluminiumVisual } from "./hallAluminiumModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

const IDLE_EM: ElectromagneticsState = {
  frequencyHz: 0,
  magneticFluxDensityTesla: 0,
  electricFieldVpm: 0,
  phaseAngleRad: 0,
  inductanceHenry: 0,
  capacitanceFarad: 0,
  currentAmperes: 0,
  voltageVolts: 0,
  powerFactor: 0,
  efficiencyPct: 0,
  synchronousRpm: 0,
  slipFraction: 0,
  rotorRpm: 0,
  shaftPowerWatts: 0,
  electricalInputWatts: 0,
};

const IDLE_THERMO: ThermodynamicsState = {
  temperatureCelsius: 960,
  temperatureKelvin: 1233.15,
  pressureAtm: 1,
  partialPressureButaneAtm: 0,
  heatInputWatts: 0,
  coolingPowerWatts: 0,
  coefficientOfPerformance: 0,
  blackbodyRadiantPowerWatts: 0,
  fluidFlowVelocityMps: 0,
};

export function HallAluminium3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePreset, setActivePreset] = useState<HallAluminiumCameraPreset>("overview");
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(true);
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  const { params, updateParam } = usePatentPhysics("us-400766-hall-aluminium");

  const currentAmperes = (params.currentAmperes as number) ?? 300000;
  const bathTemperatureCelsius = (params.bathTemperatureCelsius as number) ?? 960;
  const aluminaConcentrationPct = (params.aluminaConcentrationPct as number) ?? 5.5;

  const sim = useMemo(() => {
    return stepHallAluminium({
      currentAmperes,
      bathTemperatureCelsius,
      aluminaConcentrationPct,
    });
  }, [currentAmperes, bathTemperatureCelsius, aluminaConcentrationPct]);

  const live = useLiveSimParams({
    currentAmperes,
    bathTemperatureCelsius,
    aluminaConcentrationPct,
    totalCellVoltage: sim.totalCellVoltage,
    aluminiumProductionRateKgPerHour: sim.aluminiumProductionRateKgPerHour,
    isCutaway,
  });

  // Shared transport tape: the Hall-Héroult kernel step is owned by the bus
  // updater (TS_FALLBACK), so the render loop and any badge read one state.
  useFrankenSimPhysics("us-400766-hall-aluminium", {
    domain: "electromagnetics_flux",
    refusal: { isRefused: false },
    em: { ...IDLE_EM, currentAmperes: sim.currentAmperes, voltageVolts: sim.totalCellVoltage },
    thermo: { ...IDLE_THERMO, temperatureCelsius: sim.bathTemperatureCelsius },
  });

  useEffect(() => {
    const integrate: TapeUpdater = (prev) => {
      const s = stepHallAluminium({
        currentAmperes: live.current.currentAmperes,
        bathTemperatureCelsius: live.current.bathTemperatureCelsius,
        aluminaConcentrationPct: live.current.aluminaConcentrationPct,
      });
      return {
        refusal: { isRefused: false },
        em: {
          ...(prev.em ?? IDLE_EM),
          currentAmperes: s.currentAmperes,
          voltageVolts: s.totalCellVoltage,
          electricalInputWatts: s.electricalPowerKw * 1000,
        },
        thermo: {
          ...(prev.thermo ?? IDLE_THERMO),
          temperatureCelsius: s.bathTemperatureCelsius,
          temperatureKelvin: s.bathTemperatureCelsius + 273.15,
        },
      };
    };
    const unregister = globalTransportBus.registerUpdater(
      "us-400766-hall-aluminium",
      integrate,
      "TS_FALLBACK",
    );
    return unregister;
  }, [live]);

  const studioRef = useRef<ReturnType<typeof createThreeStudioScene> | null>(null);

  const applyCameraPreset = (preset: HallAluminiumCameraPreset) => {
    setActivePreset(preset);
    const studio = studioRef.current;
    if (!studio) return;
    const cfg = hallViewForViewport(preset, containerRef.current?.clientWidth ?? 1000);
    studio.controls.setView(cfg.pos, cfg.target);
  };
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const overview = hallViewForViewport("overview", container.clientWidth);
    const studio = createThreeStudioScene({
      container,
      cameraPos: overview.pos,
      targetPos: overview.target,
    });
    studioRef.current = studio;

    const { scene, camera, renderer, controls } = studio;

    const model = createHallAluminiumModel();
    scene.add(model.root);

    let reqId: number;
    const clock = createStudioClock();

    // Pure consumer of the shared transport tape: the bus updater owns the
    // Hall-Héroult kernel step; this loop only reads the latest frame.
    const transport = globalTransportBus.getTransport("us-400766-hall-aluminium");

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const { dt, simTimeSec: timeSec } = clock.pump(now);
      const p = live.current;
      const frameTel = transport.lastFrame.telemetry;

      model.setCutaway?.(p.isCutaway ?? false);

      updateHallAluminiumVisual(
        model,
        {
          currentAmperes: frameTel.em?.currentAmperes ?? p.currentAmperes,
          bathTemperatureCelsius: frameTel.thermo?.temperatureCelsius ?? p.bathTemperatureCelsius,
          totalCellVoltage: frameTel.em?.voltageVolts ?? p.totalCellVoltage,
          aluminiumProductionRateKgPerHour: p.aluminiumProductionRateKgPerHour,
        },
        timeSec,
        dt,
      );

      controls.update();
      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      model.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  useEffect(() => {
    const restoreResponsiveView = () => {
      const container = containerRef.current;
      if (!container) return;
      const config = hallViewForViewport(activePreset, container.clientWidth);
      studioRef.current?.controls.setView(config.pos, config.target);
    };
    window.addEventListener("resize", restoreResponsiveView);
    return () => window.removeEventListener("resize", restoreResponsiveView);
  }, [activePreset]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <PortHamiltonianEnergyStrip
        patentId="us-400766-hall-aluminium"
        params={{
          currentAmperes,
          bathTemperatureCelsius,
        }}
      />
      <div className="sr-only">Charles Martin Hall Aluminium Reduction 3D Simulation</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-9.5rem)] sm:max-w-[calc(100%-28rem)] gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3.5 h-3.5" /> View:
            </span>
            {(
              ["overview", "anodes", "molten_bath", "siphon_tap"] as HallAluminiumCameraPreset[]
            ).map((preset) => (
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
                {preset.replace("_", " ")}
              </button>
            ))}
          </div>
        )}

        {/* Top-Right Action Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap justify-end gap-1.5 sm:gap-2 max-w-[min(90%,26rem)] sm:max-w-[26rem] pointer-events-auto">
          <ClaimConstraintToggle
            patentId="us-400766-hall-aluminium"
            claimStates={claimStates}
            onToggleClaim={(c: number, active: boolean) => {
              setClaimStates((prev) => ({ ...prev, [c]: active }));
              updateParam("currentAmperes", active ? 300000 : 15000);
            }}
          />
          <button
            type="button"
            onClick={() => {
              setIsCutaway((prev) => !prev);
              soundEngine.playSwitchClick();
            }}
            className={`min-h-9 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs flex items-center gap-1 ${
              isCutaway
                ? "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-700"
                : "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
            }`}
            title={isCutaway ? "Switch to Solid Pot Shell" : "Switch to Interior Cutaway"}
            aria-label={isCutaway ? "Switch to Solid Pot Shell" : "Switch to Interior Cutaway"}
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">{isCutaway ? "Cutaway" : "Solid"}</span>
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
            onClick={() => setShowUiOverlay((prev) => !prev)}
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
            onClick={() => applyCameraPreset("overview")}
            className="min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">Yield:</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                {sim.currentEfficiencyPct}% Faradaic Yield
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Current:</span>
              <span className="text-cyan-800 dark:text-cyan-400 font-bold">
                {(sim.currentAmperes / 1000).toFixed(0)} kA
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Cell Voltage:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {sim.totalCellVoltage} V
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Production Rate:</span>
              <span className="text-cyan-800 dark:text-cyan-400 font-bold">
                {sim.aluminiumProductionRateKgPerHour} kg/h
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Bath Temp:</span>
              <span className="text-rose-700 dark:text-rose-400 font-bold">
                {sim.bathTemperatureCelsius} °C
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Alumina:</span>
              <span className="text-purple-800 dark:text-purple-400 font-bold">
                {sim.aluminaConcentrationPct}%
              </span>
            </div>
          </div>
        )}

        {/* Bottom SI Telemetry Chip Strip */}
        <StudioKernelChips
          side="right"
          visible={showUiOverlay}
          title="HALL-HÉROULT ELECTROLYTIC SMELTING"
          chips={[
            {
              label: "Cell Current",
              value: `${(currentAmperes / 1000).toFixed(0)}`,
              unit: "kA",
              tone: "hot",
            },
            {
              label: "Cell Voltage",
              value: `${sim.totalCellVoltage.toFixed(2)}`,
              unit: "V",
            },
            {
              label: "Al Production",
              value: `${sim.aluminiumProductionRateKgPerHour.toFixed(1)}`,
              unit: "kg/h",
            },
            { label: "Faraday η", value: `${sim.currentEfficiencyPct.toFixed(1)}%` },
            {
              label: "Bath Temp",
              value: `${bathTemperatureCelsius.toFixed(0)}`,
              unit: "°C",
            },
            {
              label: "Alumina (Al₂O₃)",
              value: `${aluminaConcentrationPct.toFixed(1)}%`,
              unit: "in Na₃AlF₆ Cryolite",
            },
            { label: "Process", value: "Molten Cryolite Electrolytic Reduction" },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <p
          data-testid="hall-cell-source-boundary"
          className="mb-3 text-[11px] leading-4 text-ink-600 dark:text-parchment-400"
        >
          The open wall is an exhibit cutaway. Hall&apos;s drawings establish the crucible, immersed
          electrodes, and molten bath; the four-anode layout and 300 kA scale are an explicitly
          normalized modern Hall–Héroult teaching scenario, not dimensions printed in US 400,766.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SensitivitySlider
            id="cellCurrent"
            patentId="us-400766-hall-aluminium"
            paramKey="currentAmperes"
            label="Cell Current"
            value={currentAmperes}
            min={100000}
            max={500000}
            step={10000}
            unit="A"
            onChange={(val) => updateParam("currentAmperes", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="bathTemp"
            patentId="us-400766-hall-aluminium"
            paramKey="bathTemperatureCelsius"
            label="Cryolite Bath Temp"
            value={bathTemperatureCelsius}
            min={920}
            max={1020}
            step={5}
            unit="°C"
            onChange={(val) => updateParam("bathTemperatureCelsius", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="aluminaConc"
            patentId="us-400766-hall-aluminium"
            paramKey="aluminaConcentrationPct"
            label="Alumina (Al₂O₃) Conc"
            value={aluminaConcentrationPct}
            min={2}
            max={8}
            step={0.5}
            unit="%"
            onChange={(val) => updateParam("aluminaConcentrationPct", val)}
            allParams={params}
          />
        </div>
      </div>
    </div>
  );
}

export default HallAluminium3D;
