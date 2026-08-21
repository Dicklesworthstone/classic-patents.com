"use client";

import { Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { FrankenSimEngine } from "@/physics/engine";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { buildFermiReactorModel, updateFermiReactorKinematics } from "./fermiReactorModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "control_rods" | "graphite_core" | "gantry" | "detector" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [13, 10, 16], target: [0, 0, 0] },
  control_rods: { pos: [0, 3.2, 4.2], target: [0, 1.0, 0] },
  graphite_core: { pos: [0, -0.6, 4.5], target: [0, -1.2, 0] },
  gantry: { pos: [0, 7.5, 6.0], target: [0, 4.0, 0] },
  detector: { pos: [5.5, 0.5, 3.2], target: [2.4, -0.5, 0] },
  top: { pos: [0, 11.0, 0.1], target: [0, 0, 0] },
};

export function FermiReactor3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Nuclear Reactor Kinetics State Controls
  const { params, updateParam } = usePatentPhysics("us-2708656-fermi-reactor");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const controlRodWithdrawalPct = params.rodWithdrawal ?? 83.5;
  const moderatorPurityPct = params.moderatorPurity ?? 99.5;
  const fuelEnrichmentPct = params.fuelEnrichmentPct ?? 0.72;
  const [showNeutronCascade, _setShowNeutronCascade] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  // Four-Factor Nuclear Physics Calculations
  const reactorKinetics = FrankenSimEngine.stepFermiReactor(
    controlRodWithdrawalPct,
    moderatorPurityPct,
    fuelEnrichmentPct,
  );

  const kEff = reactorKinetics.kEffective.toFixed(3);
  const isSupercritical = Number(kEff) > 1.002;
  const isCritical = Number(kEff) >= 0.998 && Number(kEff) <= 1.002;
  const reactorPowerWatts = reactorKinetics.thermalPowerWatts;
  const reactivityDollars = reactorKinetics.reactivityDollars.toFixed(2);

  useFrankenSimPhysics("us-2708656-fermi-reactor", {
    domain: "nuclear_kinetics",
    refusal: { isRefused: false },
    nuclear: reactorKinetics,
  });

  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  const live = useLiveSimParams({
    controlRodWithdrawalPct,
    moderatorPurityPct,
    showNeutronCascade,
    isCutaway,
    kEff,
    geigerIntervalMs: reactorKinetics.geigerIntervalMs,
    geigerIntervalS: reactorKinetics.geigerIntervalS,
    isAudioMuted,
    neutronDisplaySpeed: reactorKinetics.neutronDisplaySpeed,
    rodStudioY: reactorKinetics.rodStudioY,
    fuelGlowIntensity: reactorKinetics.fuelGlowIntensity,
  });

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

    const { scene, camera, renderer, controls } = studio;

    // Build procedural 3D model
    const model = buildFermiReactorModel();
    scene.add(model.root);

    let reqId: number;
    let geigerClickTimer = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = 1 / 60;
      const p = live.current;

      updateFermiReactorKinematics(
        model,
        delta,
        p.controlRodWithdrawalPct,
        Number(p.kEff),
        p.moderatorPurityPct,
        p.neutronDisplaySpeed,
        p.rodStudioY,
        p.fuelGlowIntensity,
        p.showNeutronCascade,
        p.isCutaway,
      );

      if (p.showNeutronCascade) {
        geigerClickTimer += delta;
        const clickInterval = p.geigerIntervalS;
        if (geigerClickTimer > clickInterval) {
          geigerClickTimer = 0;
          if (!p.isAudioMuted) {
            soundEngine.playSwitchClick();
          }
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      model.dispose();
      studio.dispose();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-parchment-100 dark:bg-ink-950 border border-parchment-300 dark:border-ink-800 shadow-xl flex flex-col transition-colors">
      {/* Port-Hamiltonian Conservative Energy & Radiation Dissipation Strip */}
      <PortHamiltonianEnergyStrip
        patentId="us-2708656-fermi-reactor"
        params={{
          thermalNeutronFlux: 1.2e6 * Number(kEff),
          keff: Number(kEff),
          coreTempKelvin: 310.0 + (reactorPowerWatts / 200.0) * 15.0,
        }}
      />

      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-parchment-300 dark:border-ink-800 bg-parchment-50/90 dark:bg-ink-900/90 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="font-serif text-base sm:text-lg font-bold text-ink-900 dark:text-parchment-100">
              Enrico Fermi & Leo Szilard Nuclear Chain-Reacting Pile (US 2,708,656)
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-0.5">
            Chicago Pile-1 (CP-1): Graphite moderator lattice, lumped natural uranium, and cadmium
            safety rods.
          </p>
        </div>
      </div>

      {/* 3D WebGL Studio Canvas Viewport */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] min-h-[380px] max-h-[600px] bg-ink-950 overflow-hidden select-none">
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Top-Left Camera View Presets Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 shadow-sm max-w-[calc(100%-120px)] sm:max-w-none">
            {(
              [
                ["iso", "Overview"],
                ["control_rods", "Safety Rods"],
                ["graphite_core", "Core Lattice"],
                ["gantry", "Timber Rig"],
                ["detector", "Geiger Counter"],
                ["top", "Top-Down"],
              ] as const
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyCameraPreset(preset)}
                className={`px-2 py-1 rounded-lg text-xs font-sans font-semibold transition-colors ${
                  activeCamera === preset
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Top-Right Action Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap items-center gap-1.5 max-w-[90%] justify-end">
          <ClaimConstraintToggle
            patentId="us-2708656-fermi-reactor"
            claimStates={claimStates}
            onToggleClaim={(c, active) => {
              setClaimStates((prev) => ({ ...prev, [c]: active }));
              updateParam("rodWithdrawal", active ? 83.5 : 99.5);
            }}
          />
          <button
            type="button"
            onClick={() => {
              setIsCutaway(!isCutaway);
              soundEngine.playSwitchClick();
            }}
            title={isCutaway ? "Switch to Solid Pile" : "Switch to Core Cutaway"}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              isCutaway
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
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
            aria-label={isAudioMuted ? "Unmute simulation audio" : "Mute simulation audio"}
            type="button"
            onClick={toggleSound}
            className="p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={isAudioMuted ? "Enable Sound Synthesis" : "Mute Sound"}
          >
            {isAudioMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-600" />
            )}
          </button>
          <button
            aria-label={showCalloutPins ? "Hide annotation pins" : "Show annotation pins"}
            type="button"
            onClick={() => setShowCalloutPins(!showCalloutPins)}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showCalloutPins
                ? "bg-amber-600 text-white border-amber-700 shadow-md"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
            title="Toggle Historical Patent Numeral Pins"
          >
            <Zap className="w-4 h-4" />
          </button>
          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
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
                k Effective:
              </span>
              <span
                className={`font-bold ${
                  isSupercritical
                    ? "text-red-700 dark:text-red-400"
                    : isCritical
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-blue-700 dark:text-blue-400"
                }`}
              >
                {kEff} (
                {isSupercritical ? "Supercritical" : isCritical ? "Critical" : "Subcritical"})
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Thermal Power:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {reactorPowerWatts} W
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Reactivity ρ:</span>
              <span className="text-purple-800 dark:text-purple-400 font-bold">
                ${reactivityDollars}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Rod Withdrawal:</span>
              <span className="text-cyan-800 dark:text-cyan-400 font-bold">
                {controlRodWithdrawalPct}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SensitivitySlider
            id="rodWithdrawal"
            patentId="us-2708656-fermi-reactor"
            paramKey="controlRodWithdrawalPct"
            label="Control Rod Withdrawal"
            value={controlRodWithdrawalPct}
            min={0}
            max={100}
            step={0.5}
            unit="%"
            onChange={(val) => updateParam("rodWithdrawal", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="moderatorPurity"
            patentId="us-2708656-fermi-reactor"
            paramKey="moderatorPurity"
            label="Moderator Graphite Purity"
            value={moderatorPurityPct}
            min={95}
            max={100}
            step={0.1}
            unit="%"
            onChange={(val) => updateParam("moderatorPurity", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="fuelEnrichment"
            patentId="us-2708656-fermi-reactor"
            paramKey="fuelEnrichmentPct"
            label="Fuel U-235 Enrichment"
            value={fuelEnrichmentPct}
            min={0.5}
            max={2.5}
            step={0.05}
            unit="%"
            onChange={(val) => updateParam("fuelEnrichmentPct", val)}
            allParams={params}
          />
        </div>
      </div>

      {/* Bottom SI Telemetry Chip Strip */}
      <StudioKernelChips
        visible={true}
        title="CP-1 FOUR-FACTOR KINETICS"
        chips={[
          {
            label: "k_eff",
            value: String(kEff),
            tone: isSupercritical ? "hot" : isCritical ? "ok" : "warn",
          },
          {
            label: "Thermal Power",
            value:
              reactorPowerWatts >= 1000
                ? `${(reactorPowerWatts / 1000).toFixed(1)} kW`
                : `${reactorPowerWatts.toFixed(0)} W`,
          },
          { label: "Reactivity ($)", value: reactivityDollars, unit: "$" },
          {
            label: "Rod Position",
            value: `${controlRodWithdrawalPct.toFixed(1)}%`,
            unit: "withdrawn",
          },
          { label: "Moderator", value: `${moderatorPurityPct.toFixed(1)}%`, unit: "purity" },
          {
            label: "Neutron Flux",
            value: reactorKinetics.thermalNeutronFluxNPerCm2S.toExponential(2),
            unit: "n/cm²s",
          },
          {
            label: "Regime",
            value: isSupercritical
              ? "Supercritical"
              : isCritical
                ? "Critical Steady"
                : "Subcritical Dampened",
            tone: isSupercritical ? "hot" : isCritical ? "ok" : "warn",
          },
        ]}
      />
    </div>
  );
}
