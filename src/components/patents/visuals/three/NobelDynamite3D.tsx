"use client";

import { Camera, Eye, EyeOff, Flame, Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { stepNobelDynamite } from "@/physics/catalogKernels";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import { TickScheduler } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { useGenericWasmSource } from "@/physics/useGenericWasmSource";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { buildNobelDynamiteModel, updateNobelDynamiteKinematics } from "./nobelDynamiteModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "blasting_cap" | "matrix_cutaway" | "fuse" | "detonation_wave" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [8.5, 6.0, 9.5], target: [0, 0, 0] },
  blasting_cap: { pos: [0, 3.2, 3.0], target: [0, 2.0, 0] },
  matrix_cutaway: { pos: [0, 0, 3.5], target: [0, 0, 0] },
  fuse: { pos: [0, 4.8, 2.5], target: [0, 3.5, 0] },
  detonation_wave: { pos: [3.5, 2.0, 4.5], target: [0, 0, 0] },
  top: { pos: [0, 11.0, 0.1], target: [0, 0, 0] },
};

export const NobelDynamite3D = memo(function NobelDynamite3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // Chemical Explosives Parameters
  const { params, updateParam } = usePatentPhysics("us-78317-nobel-dynamite");
  const ngPercentage =
    (params.ngConcentrationPct as number) ?? (params.ngConcentration as number) ?? 75;
  const capEnergyJoules = (params.capEnergyJoules as number) ?? 1.2;

  const nobel = stepNobelDynamite({
    ngConcentrationPct: ngPercentage,
    capEnergyJoules,
  });
  const detonationVelocityMps = nobel.detonationVelocityMps;

  // Shared transport tape envelope: detonation pressure and shock-front
  // velocity publish to the patentId-keyed bus so badges and sibling faces
  // read one honest state.
  useFrankenSimPhysics("us-78317-nobel-dynamite", {
    domain: "thermo_fluid",
    refusal: { isRefused: false },
    thermo: {
      temperatureCelsius: 0,
      temperatureKelvin: 0,
      pressureAtm: nobel.blastOverpressureMpa * 9.86923,
      partialPressureButaneAtm: 0,
      heatInputWatts: 0,
      coolingPowerWatts: 0,
      coefficientOfPerformance: 0,
      blackbodyRadiantPowerWatts: 0,
      fluidFlowVelocityMps: nobel.detonationVelocityMps,
    },
  });
  const [isFuseLit, setIsFuseLit] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const crateSource = useGenericWasmSource();
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const fuseTimerRef = useRef<number | null>(null);

  const live = useLiveSimParams({
    ngPercentage,
    capEnergyJoules,
    detonationVelocityMps,
    isFuseLit,
    shockwaveGlow: nobel.shockwaveGlow,
    isAudioMuted,
    isCutaway,
    blastOverpressureMpa: nobel.blastOverpressureMpa,
    isInitiated: nobel.isInitiated ? 1 : 0,
    chargeTransitUs: nobel.chargeTransitUs,
    flashDisplayMs: nobel.flashDisplayMs,
  });

  const studioRef = useRef<StudioContext | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const igniteFuse = () => {
    setIsFuseLit(true);
    if (!isAudioMuted) {
      soundEngine.playSwitchClick();
    }
    if (fuseTimerRef.current !== null) {
      window.clearTimeout(fuseTimerRef.current);
    }
    fuseTimerRef.current = window.setTimeout(() => {
      setIsFuseLit(false);
    }, nobel.flashDisplayMs);
  };

  useEffect(() => {
    return () => {
      if (fuseTimerRef.current !== null) {
        window.clearTimeout(fuseTimerRef.current);
      }
    };
  }, []);

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

    const { scene, camera, renderer, controls } = studio;

    const { rootGroup, nodes, materials, dispose } = buildNobelDynamiteModel();
    scene.add(rootGroup);

    // Animation Loop
    let reqId: number;
    let simTimeSec = 0;
    const sched = new TickScheduler(1 / 60, 0);

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      sched.pump(now / 1000, () => {
        simTimeSec += 1 / 60;
      });
      const elapsedSec = simTimeSec;
      const p = live.current;

      updateNobelDynamiteKinematics(
        nodes,
        materials,
        elapsedSec,
        Boolean(p.isFuseLit),
        p.shockwaveGlow,
        p.isCutaway,
        p.ngPercentage,
        p.capEnergyJoules,
      );

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

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Nobel Dynamite 3D</div>
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
                ["iso", "Isometric"],
                ["blasting_cap", "Blasting Cap"],
                ["matrix_cutaway", "Kieselguhr Matrix"],
                ["fuse", "Safety Fuse"],
                ["detonation_wave", "Shockwave"],
                ["top", "Plan View"],
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

        {/* Top Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={igniteFuse}
            disabled={isFuseLit}
            title="Ignite Blasting Cap"
            className={`min-h-9 p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm text-xs font-sans flex items-center gap-1 ${
              isFuseLit
                ? "bg-red-600 text-white border-red-700 animate-pulse ring-2 ring-red-500/50"
                : "bg-amber-500 text-white border-amber-600 hover:bg-amber-600"
            }`}
          >
            <Flame className="w-4 h-4" />
            <span className="hidden sm:inline">{isFuseLit ? "Detonating!" : "Detonate"}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Solid Cartridge" : "Cutaway Interior"}
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
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
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
                Detonation Velocity:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {detonationVelocityMps} m/s
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Blast Overpressure:</span>
              <span className="font-bold text-cyan-800 dark:text-cyan-400">
                {nobel.blastOverpressureMpa} MPa
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Specific Energy:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {nobel.energyMjPerKg} MJ/kg
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">State:</span>
              <span
                className={`font-bold ${isFuseLit ? "text-rose-700 dark:text-rose-400" : "text-purple-800 dark:text-purple-400"}`}
              >
                {isFuseLit ? "DETONATION WAVE" : "STABLE ABSORPTION"}
              </span>
            </div>
          </div>
        )}

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="Nobel dynamite detonation physics"
          chips={[
            { label: "NG Loading", value: String(ngPercentage), unit: "%" },
            { label: "Detonation Velocity", value: String(detonationVelocityMps), unit: "m/s" },
            { label: "Blast Overpressure", value: String(nobel.blastOverpressureMpa), unit: "MPa" },
            { label: "Specific Energy", value: String(nobel.energyMjPerKg), unit: "MJ/kg" },
            { label: "Cap Energy", value: String(nobel.capEnergyJoules ?? 1.2), unit: "J" },
            { label: "Transit Time", value: nobel.chargeTransitUs.toFixed(1), unit: "µs" },
            { label: "Explosive State", value: isFuseLit ? "DETONATION" : "STABLE" },
            {
              label: "Shock crate",
              value: crateSource === "wasm" ? "fs-fft" : "ts-wave-fallback",
            },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SensitivitySlider
            id="nobel3dNgRatio"
            patentId="us-78317-nobel-dynamite"
            paramKey="ngConcentrationPct"
            label="Nitroglycerin Absorption"
            value={ngPercentage}
            min={50}
            max={85}
            step={1}
            unit="%"
            onChange={(val) => updateParam("ngConcentrationPct", val)}
            allParams={params}
          />
          <SensitivitySlider
            id="nobel3dCapEnergy"
            patentId="us-78317-nobel-dynamite"
            paramKey="capEnergyJoules"
            label="Blasting Cap Shock Energy"
            value={capEnergyJoules}
            min={0.2}
            max={3.0}
            step={0.1}
            unit=" J"
            onChange={(val) => updateParam("capEnergyJoules", val)}
            allParams={params}
          />
        </div>

        <ClaimConstraintToggle
          patentId="us-78317-nobel-dynamite"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) => {
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }));
            updateParam(claimConstraintStateParamId(claimNo), active ? 1 : 0);
          }}
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-78317-nobel-dynamite"
          params={params}
          className="mt-3"
        />
      </div>
    </div>
  );
});
