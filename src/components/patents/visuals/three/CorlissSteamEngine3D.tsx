"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { stepCorlissEngine } from "@/physics/catalogKernels";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { createStudioClock } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { buildCorlissEngineModel, updateCorlissEngineKinematics } from "./corlissSteamEngineModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "wrist_plate" | "dashpots" | "flywheel" | "governor" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [12.0, 9.0, 13.0], target: [0, 0, 0] },
  wrist_plate: { pos: [-2.0, 1.8, 4.5], target: [-1.8, 0.4, 0] },
  dashpots: { pos: [-2.2, -0.8, 3.8], target: [-2.0, -1.8, 0] },
  flywheel: { pos: [4.5, 2.5, 6.0], target: [3.8, 0.5, 0] },
  governor: { pos: [-1.0, 3.2, 4.0], target: [-1.0, 1.8, 1.2] },
  top: { pos: [0, 14.0, 0.1], target: [0, 0, 0] },
};

export function CorlissSteamEngine3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);

  // Thermodynamic Simulation Parameters
  const { params, updateParam } = usePatentPhysics("us-6162-corliss-steam-engine");
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const engineRpm = params.engineRpm ?? 65;
  const steamPressurePsi = params.steamPressurePsi ?? 100;
  const cutoffPct = params.cutoffPct ?? 25;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  const corliss = stepCorlissEngine({ steamPressurePsi, engineRpm, cutoffPct });
  const indicatedHp = corliss.indicatedHp;
  const thermalEfficiencyPct = corliss.thermalEfficiencyPct.toFixed(1);

  const live = useLiveSimParams({
    engineRpm,
    steamPressurePsi,
    cutoffPct,
    isAudioMuted,
    isCutaway,
    indicatedHp,
    thermalEfficiencyPct: Number(thermalEfficiencyPct),
    crankOmegaRadPerS: corliss.crankOmegaRadPerS,
    governorOmegaRadPerS: corliss.governorOmegaRadPerS,
    govSpread: corliss.govSpread,
    wristAmp: corliss.wristAmp,
    wristLeadRad: corliss.wristLeadRad,
    crankWrapRad: corliss.crankWrapRad,
  });

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

    // Build procedural 3D model
    const model = buildCorlissEngineModel();
    scene.add(model.rootGroup);

    // Animation Loop
    let reqId: number;
    const clock = createStudioClock();

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      const { dt, simTimeSec: timeSec } = clock.pump(now);
      const p = live.current;

      const crankAngleRad = (timeSec * p.crankOmegaRadPerS) % p.crankWrapRad;

      updateCorlissEngineKinematics(model, {
        crankAngleRad,
        governorOmegaRadPerS: p.governorOmegaRadPerS,
        cutoffFraction: p.cutoffPct / 100,
        isCutaway: p.isCutaway,
        dt,
        govSpread: p.govSpread,
        wristAmp: p.wristAmp,
        wristLeadRad: p.wristLeadRad,
      });

      // Periodic audio tick on valve disengagement trip
      if (!p.isAudioMuted && Math.sin(crankAngleRad) > 0.98) {
        soundEngine.playSwitchClick();
      }

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

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Corliss Steam Engine 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-14rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["wrist_plate", "Wrist Plate"],
                ["dashpots", "Dashpots"],
                ["flywheel", "Flywheel"],
                ["governor", "Governor"],
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

        {/* Top-Right Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Switch to Solid Engine" : "Switch to Cylinder Cutaway"}
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
            title={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
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
                Indicated Power:
              </span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {indicatedHp} IHP
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Steam Pressure:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {steamPressurePsi} psi
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Cutoff Point:</span>
              <span className="text-cyan-800 dark:text-cyan-400 font-bold">
                {cutoffPct}% stroke
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Engine Speed:</span>
              <span className="text-purple-800 dark:text-purple-400 font-bold">
                {engineRpm} RPM
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SensitivitySlider
            id="steamPressure"
            patentId="us-6162-corliss-steam-engine"
            paramKey="boilerPressurePsi"
            label="Boiler Steam Pressure"
            value={steamPressurePsi}
            min={40}
            max={180}
            step={5}
            onChange={(val) => updateParam("steamPressurePsi", val)}
            allParams={params}
          />

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Engine Speed</span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {engineRpm} RPM
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="120"
              step="5"
              value={engineRpm}
              onChange={(e) => updateParam("engineRpm", Number.parseInt(e.target.value, 10))}
              className="w-full accent-cyan-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <SensitivitySlider
            id="cutoffPct"
            patentId="us-6162-corliss-steam-engine"
            paramKey="cutoffPct"
            label="Governor Cutoff Fraction"
            value={cutoffPct}
            min={10}
            max={60}
            step={5}
            onChange={(val) => updateParam("cutoffPct", val)}
            allParams={params}
          />
        </div>

        <ClaimConstraintToggle
          patentId="us-6162-corliss-steam-engine"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-6162-corliss-steam-engine"
          params={params}
          className="mt-3"
        />
      </div>

      <StudioKernelChips
        visible={showUiOverlay}
        side="right"
        title="Corliss dashpot trip"
        chips={[
          { label: "Steam", value: String(steamPressurePsi), unit: "psi" },
          { label: "Cutoff", value: String(cutoffPct), unit: "%" },
          { label: "IHP", value: String(indicatedHp), unit: "hp" },
          { label: "η", value: thermalEfficiencyPct, unit: "%" },
          { label: "P", value: String(corliss.boilerMpa), unit: "MPa" },
          { label: "r_exp", value: String(corliss.expansionRatio) },
          { label: "ω", value: corliss.crankOmegaRadPerS.toFixed(2), unit: "rad/s" },
          {
            label: "Valve crate",
            value: crateSource === "wasm" ? "fs-symmetry" : "ts-cyclic-fallback",
          },
        ]}
      />
    </div>
  );
}
