"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FrankenSimEngine } from "@/physics/engine";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildGoodyearRubberModel, updateGoodyearRubberKinematics } from "./goodyearRubberModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "chains" | "bridges" | "clamps" | "stress_vectors" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [6, 4, 7], target: [0, 0, 0] },
  chains: { pos: [0, 1.5, 3.5], target: [0, 0, 0] },
  bridges: { pos: [1.2, 0.8, 2.0], target: [0.5, 0, 0] },
  clamps: { pos: [4.5, 1.5, 3.0], target: [2.5, 0, 0] },
  stress_vectors: { pos: [0, 5.0, 4.0], target: [0, 0, 0] },
  top: { pos: [0, 9.0, 0.1], target: [0, 0, 0] },
};

export function GoodyearRubber3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // Vulcanization Chemistry & Physics State
  const { params, updateParam } = usePatentPhysics("us-3633-goodyear-rubber");
  const sulfurWeightPct = params.sulfurPct ?? 8;
  const cureTemperatureCelsius = params.vulcanTemp ?? 145;
  const appliedTensileStretch = params.appliedTensileStretch ?? 1.8;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  // Thermodynamic & Polymer Mechanics Calculations
  const rubberPhysics = FrankenSimEngine.stepGoodyearRubber(
    cureTemperatureCelsius,
    sulfurWeightPct,
    30,
    appliedTensileStretch,
    params.specimenTempC ?? 35,
  );

  useFrankenSimPhysics("us-3633-goodyear-rubber", {
    domain: "continuum_polymers",
    timestampMs: 0,
    timeStepDt: 0.016,
    refusal: { isRefused: false },
    continuum: {
      tensileStressMpa: rubberPhysics.tensileStrengthMpa,
      tensileStrainPct: rubberPhysics.elasticReturnPct,
      elasticModulusGpa: 0,
      crossLinkDensityMolesPerCm3: rubberPhysics.crossLinkDensity,
      stitchFrequencyHz: 0,
      feedVelocityMmPs: 0,
      buoyancyLiftForceKiloNewtons: 0,
    },
  });

  const live = useLiveSimParams({
    appliedTensileStretch,
    cureTemperatureCelsius,
    sulfurWeightPct,
    crossLinkDensity: rubberPhysics.crossLinkDensity,
    tensileStrengthPsi: rubberPhysics.tensileStrengthPsi,
    elasticReturnPct: rubberPhysics.elasticReturnPct,
    stressScale: rubberPhysics.stressScale,
    thermalAmplitude: rubberPhysics.thermalAmplitude,
    clampStudioX: rubberPhysics.clampStudioX,
    isVulcanized: rubberPhysics.crossLinkDensity > 0.02,
    showSulfurCrosslinks: true,
    showStressVectors: true,
    isCutaway,
    isAudioMuted,
    vulcanizationTempC: cureTemperatureCelsius,
    sulfurPct: sulfurWeightPct,
    specimenTempC: params.specimenTempC ?? 35,
  });

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const toggleSound = () => {
    toggleEngine(() => {
      soundEngine.playElastomerSnap(appliedTensileStretch);
    });
  };

  useEffect(() => {
    void ensureGenericWasm().then((next) => setCrateSource(next));
  }, []);

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

    const model = buildGoodyearRubberModel();
    scene.add(model.rootGroup);

    // Animation Loop
    let reqId: number;
    let timeSec = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const dt = 1 / 60;
      timeSec += dt;
      const p = live.current;

      updateGoodyearRubberKinematics(
        model.nodes,
        model.materials,
        dt,
        timeSec,
        p.appliedTensileStretch,
        p.clampStudioX,
        p.stressScale,
        p.thermalAmplitude,
        p.isVulcanized,
        p.showSulfurCrosslinks,
        p.showStressVectors,
        p.isCutaway,
        p.vulcanizationTempC,
        p.sulfurPct,
        p.specimenTempC,
      );

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      model.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Charles Goodyear Vulcanized Rubber 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-14rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3.5 h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["chains", "Polymer Chains"],
                ["bridges", "Sulfur Bridges"],
                ["clamps", "Tensile Clamps"],
                ["stress_vectors", "Stress Vectors"],
                ["top", "Plan View"],
              ] as [CameraPreset, string][]
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyCameraPreset(preset)}
                className={`px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
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
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Solid Network" : "Cutaway View"}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm text-xs font-sans flex items-center gap-1 ${
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
            aria-label={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
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
                Tensile Strength:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {Math.round(rubberPhysics.tensileStrengthPsi)} psi
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Elastic Return:</span>
              <span className="font-bold text-cyan-800 dark:text-cyan-400">
                {rubberPhysics.elasticReturnPct.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Crosslink Density:</span>
              <span className="font-bold text-emerald-800 dark:text-emerald-400">
                {rubberPhysics.crossLinkDensity.toExponential(2)} mol/cm³
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Tensile Modulus:</span>
              <span className="text-purple-800 dark:text-purple-400 font-bold">
                {rubberPhysics.tensileStrengthMpa.toFixed(2)} MPa
              </span>
            </div>
          </div>
        )}

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="Goodyear rubber fabric model"
          chips={[
            { label: "Cure Temp", value: `${cureTemperatureCelsius}`, unit: "°C" },
            { label: "Sulfur", value: `${sulfurWeightPct}`, unit: "wt%" },
            {
              label: "Tensile",
              value: String(Math.round(rubberPhysics.tensileStrengthPsi)),
              unit: "psi",
            },
            { label: "Modulus", value: rubberPhysics.tensileStrengthMpa.toFixed(2), unit: "MPa" },
            {
              label: "Crosslink ρ",
              value: rubberPhysics.crossLinkDensity.toExponential(2),
              unit: "mol/cm³",
            },
            {
              label: "Elastic Return",
              value: `${rubberPhysics.elasticReturnPct.toFixed(1)}`,
              unit: "%",
            },
            {
              label: "Glass Tg",
              value: `${rubberPhysics.glassTransitionTempC.toFixed(0)}`,
              unit: "°C",
            },
            { label: "Stretch λ", value: `${appliedTensileStretch.toFixed(2)}`, unit: "x" },
            {
              label: "Heat crate",
              value: crateSource === "wasm" ? "fs-sparse" : "ts-heat-fallback",
            },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Vulcanization Temp</span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {cureTemperatureCelsius} °C
              </span>
            </div>
            <input
              type="range"
              min="110"
              max="190"
              step="2"
              value={cureTemperatureCelsius}
              onChange={(e) => updateParam("vulcanTemp", Number.parseInt(e.target.value, 10))}
              className="w-full accent-amber-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Sulfur Fraction</span>
              <span className="text-purple-700 dark:text-purple-400 font-mono font-bold">
                {sulfurWeightPct} wt%
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="14"
              step="0.5"
              value={sulfurWeightPct}
              onChange={(e) => updateParam("sulfurPct", Number.parseFloat(e.target.value))}
              className="w-full accent-purple-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Tensile Stretch (λ)
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                {appliedTensileStretch.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.05"
              value={appliedTensileStretch}
              onChange={(e) =>
                updateParam("appliedTensileStretch", Number.parseFloat(e.target.value))
              }
              className="w-full accent-emerald-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
