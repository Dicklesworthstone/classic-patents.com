"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { stepHaberAmmonia } from "@/physics/catalogKernels";
import { createStudioClock } from "@/physics/tickScheduler";
import type { ThermodynamicsState } from "@/physics/types";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import {
  articulateHaberAmmoniaModel,
  buildHaberAmmoniaModel,
  type HaberAmmoniaModelNodes,
} from "./haberAmmoniaModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

interface HaberAmmonia3DProps {
  initialPressureAtm?: number;
  initialTemperatureCelsius?: number;
  initialFeedFlowRateMolesPerSec?: number;
  initialCatalystActivity?: number;
}

type CameraPreset = "isometric" | "reactor" | "heatExchanger" | "condenser";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  isometric: { pos: [0, 4.0, 7.5], target: [0, 1.4, 0] },
  reactor: { pos: [0.7, 2.2, 4.2], target: [0.7, 1.5, 0] },
  heatExchanger: { pos: [-0.7, 2.0, 3.8], target: [-0.7, 1.2, 0] },
  condenser: { pos: [2.1, 1.8, 3.8], target: [2.1, 1.1, 0] },
};

export default function HaberAmmonia3D({
  initialPressureAtm = 175,
  initialTemperatureCelsius = 530,
  initialFeedFlowRateMolesPerSec = 50,
  initialCatalystActivity = 1.0,
}: HaberAmmonia3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const nodesRef = useRef<HaberAmmoniaModelNodes | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState(false);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const { isAudioMuted, toggleSound } = usePatentAudio();

  const { params, updateParam } = usePatentPhysics("us-971501-haber-ammonia");
  const pressureAtm = params.pressureAtm ?? initialPressureAtm;
  const temperatureCelsius = params.temperatureCelsius ?? initialTemperatureCelsius;
  const feedFlowRateMolesPerSec = params.feedFlowRateMolesPerSec ?? initialFeedFlowRateMolesPerSec;
  const catalystActivity = params.catalystActivity ?? initialCatalystActivity;
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("isometric");
  const [isRotating, setIsRotating] = useState(false);

  const sim = stepHaberAmmonia({
    pressureAtm,
    temperatureCelsius,
    feedFlowRateMolesPerSec,
    catalystActivity,
  });

  // Shared transport tape: US 971,501 carries no apparatus drawing and its
  // host kernel is a parametric equilibrium step (nothing integrates over dt),
  // so publication is envelope-only. Values are the kernel's own SI outputs.
  useFrankenSimPhysics("us-971501-haber-ammonia", {
    domain: "thermodynamics_transport",
    refusal: { isRefused: false },
    thermo: {
      temperatureCelsius: sim.catalystTemperatureCelsius,
      temperatureKelvin: sim.catalystTemperatureCelsius + 273.15,
      pressureAtm: sim.pressureAtm,
      partialPressureButaneAtm: 0,
      heatInputWatts: 0,
      coolingPowerWatts: 0,
      coefficientOfPerformance: 0,
      blackbodyRadiantPowerWatts: 0,
      fluidFlowVelocityMps: 0,
    } satisfies ThermodynamicsState,
  });
  const sourceBoundedVisualOnly = true;

  const live = useLiveSimParams({
    isRotating,
    isCutaway,
    pressureAtm,
    temperatureCelsius,
    ammoniaYieldPct: sim.ammoniaYieldPct,
    ammoniaProductionKgPerHour: sim.ammoniaProductionKgPerHour,
    compressorDisplayOmegaRadPerS: sim.compressorDisplayOmegaRadPerS,
    loopFlowAdvance: sim.loopFlowAdvance,
  });

  const handlePresetChange = (preset: CameraPreset) => {
    setCameraPreset(preset);
    const targetConfig = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(targetConfig.pos, targetConfig.target);
  };

  const handleClaimToggle = (claimNumber: number, active: boolean) => {
    setClaimStates((prev) => ({ ...prev, [claimNumber]: active }));
    updateParam("pressureAtm", active ? 175 : 1);
  };

  useEffect(() => {
    // The published patent explicitly says "No Drawing". The source-bounded
    // fallback below must not mount (or even construct) the retained,
    // interpretive apparatus draft behind that refusal boundary.
    if (sourceBoundedVisualOnly) return;

    const container = containerRef.current;
    if (!container) return;

    const overview = CAMERA_PRESETS.isometric;
    const studio = createThreeStudioScene({
      container,
      cameraPos: overview.pos,
      targetPos: overview.target,
    });
    studioRef.current = studio;

    const nodes = buildHaberAmmoniaModel();
    nodesRef.current = nodes;
    studio.scene.add(nodes.root);

    const clock = createStudioClock();
    const animate = (now: number) => {
      if (!studio.isVisible()) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      const { dt, simTimeSec } = clock.pump(now);
      timeRef.current = simTimeSec;

      const p = live.current;
      if (p.isRotating) {
        nodes.root.rotation.y += dt * 0.26;
      }
      studio.controls.update();

      nodes.setCutaway?.(p.isCutaway ?? false);

      articulateHaberAmmoniaModel(
        nodes,
        {
          pressureAtm: p.pressureAtm,
          temperatureCelsius: p.temperatureCelsius,
          ammoniaYieldPct: p.ammoniaYieldPct,
          ammoniaProductionKgPerHour: p.ammoniaProductionKgPerHour,
          compressorDisplayOmegaRadPerS: p.compressorDisplayOmegaRadPerS,
          loopFlowAdvance: p.loopFlowAdvance,
        },
        timeRef.current,
      );

      studio.renderer.render(studio.scene, studio.camera);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      nodes.materials.forEach((m) => {
        m.dispose();
      });
      studio.cleanup();
      studioRef.current = null;
      nodesRef.current = null;
    };
  }, [live]);

  if (sourceBoundedVisualOnly) {
    return (
      <section
        data-testid="three-d-source-boundary"
        role="status"
        aria-labelledby="haber-3d-source-boundary-heading"
        className="flex min-h-[380px] flex-col justify-center gap-4 rounded-2xl border border-amber-300 bg-amber-50 p-6 text-slate-900 shadow-md dark:border-amber-800 dark:bg-slate-950 dark:text-slate-100"
      >
        <div className="flex items-center gap-3">
          <Layers className="h-6 w-6 text-amber-700 dark:text-amber-400" />
          <h3 id="haber-3d-source-boundary-heading" className="font-serif text-xl font-bold">
            3D apparatus view withheld: no drawing in US 971,501
          </h3>
        </div>
        <ClaimConstraintToggle
          patentId="us-971501-haber-ammonia"
          claimStates={claimStates}
          onToggleClaim={handleClaimToggle}
          className="self-start"
        />
        <p className="max-w-3xl text-sm leading-6 text-slate-700 dark:text-slate-300">
          This grant contains no apparatus drawing. A compressor, heat exchanger, condenser, or
          recycle loop would be a later industrial interpretation rather than an archival figure, so
          the procedural process model is disabled. The accepted visual state is the source text and
          the live chemistry readout below.
        </p>
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-xs uppercase tracking-wide text-slate-500">Pressure</div>
            <div className="font-mono text-lg text-cyan-700 dark:text-cyan-300">
              {sim.pressureAtm} atm
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-xs uppercase tracking-wide text-slate-500">Temperature</div>
            <div className="font-mono text-lg text-amber-700 dark:text-amber-300">
              {sim.catalystTemperatureCelsius} °C
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-xs uppercase tracking-wide text-slate-500">Host model yield</div>
            <div className="font-mono text-lg text-emerald-700 dark:text-emerald-300">
              {sim.ammoniaYieldPct}%
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-xs uppercase tracking-wide text-slate-500">Catalyst</div>
            <div className="font-mono text-lg text-violet-700 dark:text-violet-300">osmium</div>
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Host SI fallback only; no WASM module or source drawing is claimed by this treatment.
        </p>
      </section>
    );
  }

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Fritz Haber Synthetic Ammonia Production 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-9.5rem)] sm:max-w-[calc(100%-28rem)] gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> View:
            </span>
            {(["isometric", "reactor", "heatExchanger", "condenser"] as CameraPreset[]).map(
              (preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => handlePresetChange(preset)}
                  className={`min-h-9 px-2 py-1 rounded-lg transition-colors font-medium shrink-0 capitalize ${
                    cameraPreset === preset
                      ? "bg-amber-600 text-white shadow-xs font-semibold"
                      : "text-ink-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                  }`}
                >
                  {preset.replace(/([A-Z])/g, " $1")}
                </button>
              ),
            )}
          </div>
        )}

        {/* Top-Right Action Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap justify-end gap-1.5 sm:gap-2 max-w-[min(90%,26rem)] sm:max-w-[26rem] pointer-events-auto">
          <ClaimConstraintToggle
            patentId="us-971501-haber-ammonia"
            claimStates={claimStates}
            onToggleClaim={handleClaimToggle}
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
            title={isCutaway ? "Switch to Solid Reactor Shell" : "Switch to Interior Cutaway"}
            aria-label={isCutaway ? "Switch to Solid Reactor Shell" : "Switch to Interior Cutaway"}
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
            onClick={() => setIsRotating(!isRotating)}
            aria-pressed={isRotating}
            className={`min-h-9 p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              isRotating
                ? "bg-amber-700 text-white border-amber-800 dark:bg-amber-700"
                : "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
            }`}
          >
            {isRotating ? "Stop Orbit" : "Auto Orbit"}
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
            onClick={() => handlePresetChange("isometric")}
            className="min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:px-2 sm:py-1.5 rounded-lg text-xs font-sans bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border border-parchment-300 dark:border-ink-700 hover:bg-parchment-100 transition-colors shadow-xs"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-3.5 h-3.5 inline" />
          </button>
        </div>

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                Pressure:
              </span>
              <span className="text-cyan-800 dark:text-cyan-400 font-bold">
                {sim.pressureAtm} atm ({sim.pressureMpa} MPa)
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Catalyst Temp:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {sim.catalystTemperatureCelsius} °C
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Single-Pass Yield:</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                {sim.ammoniaYieldPct}%
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Production Rate:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {sim.ammoniaProductionKgPerHour} kg/hr
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Reaction Heat:</span>
              <span className="text-rose-700 dark:text-rose-400 font-bold">
                {sim.reactionHeatGeneratedKw} kW
              </span>
            </div>
          </div>
        )}

        {/* Bottom SI Telemetry Chip Strip */}
        <StudioKernelChips
          side="right"
          visible={showUiOverlay}
          title="HABER-BOSCH AMMONIA EQUILIBRIUM"
          chips={[
            {
              label: "Yield (NH₃)",
              value: `${sim.ammoniaYieldPct.toFixed(1)}%`,
              tone: "hot",
            },
            {
              label: "Production",
              value: `${sim.ammoniaProductionKgPerHour.toFixed(0)}`,
              unit: "kg/h",
            },
            { label: "Pressure", value: `${pressureAtm.toFixed(0)}`, unit: "atm" },
            {
              label: "Temperature",
              value: `${temperatureCelsius.toFixed(0)}`,
              unit: "°C",
            },
            {
              label: "Feed Flow",
              value: `${feedFlowRateMolesPerSec.toFixed(0)}`,
              unit: "mol/s",
            },
            { label: "Catalyst", value: "Promoted Osmium / α-Fe" },
            {
              label: "Thermodynamics",
              value: "Exothermic Le Chatelier High-Pressure",
            },
          ]}
        />
      </div>

      {showUiOverlay && (
        <div className="p-4 border-t border-parchment-300 dark:border-ink-800 bg-parchment-100/80 dark:bg-ink-900/60 rounded-b-2xl text-xs font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SensitivitySlider
              id="haberPressure"
              patentId="us-971501-haber-ammonia"
              paramKey="synthesisPressureBar"
              label="System Pressure"
              value={pressureAtm}
              min={50}
              max={300}
              step={5}
              unit="atm"
              onChange={(val) => updateParam("pressureAtm", val)}
              allParams={params}
            />

            <SensitivitySlider
              id="haberTemp"
              patentId="us-971501-haber-ammonia"
              paramKey="synthesisTempC"
              label="Catalyst Temp"
              value={temperatureCelsius}
              min={350}
              max={650}
              step={5}
              unit="°C"
              onChange={(val) => updateParam("temperatureCelsius", val)}
              allParams={params}
            />

            <SensitivitySlider
              id="haberFlowRate"
              patentId="us-971501-haber-ammonia"
              paramKey="pressure"
              label="Feed Flow Rate"
              value={feedFlowRateMolesPerSec}
              min={10}
              max={100}
              step={5}
              unit="mol/s"
              onChange={(val) => updateParam("feedFlowRateMolesPerSec", val)}
              allParams={params}
            />
          </div>

          <PortHamiltonianEnergyStrip
            patentId="us-971501-haber-ammonia"
            params={params}
            className="mt-3"
          />
        </div>
      )}
    </div>
  );
}
