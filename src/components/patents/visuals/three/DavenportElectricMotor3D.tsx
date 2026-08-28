"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepDavenportMotor } from "@/physics/catalogKernels";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { createStudioClock } from "@/physics/tickScheduler";
import type { ElectromagneticsState } from "@/physics/types";
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
  buildDavenportMotorModel,
  updateDavenportMotorKinematics,
} from "./davenportElectricMotorModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "commutator" | "stator_magnets" | "rotor" | "brushes" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [9.5, 6.5, 10.5], target: [0, 0, 0] },
  commutator: { pos: [0, 2.5, 3.8], target: [0, 1.2, 0] },
  stator_magnets: { pos: [3.2, 1.5, 3.5], target: [1.5, 0, 0] },
  rotor: { pos: [0, 4.0, 1.5], target: [0, 0, 0] },
  brushes: { pos: [-1.8, 2.2, 2.5], target: [-0.5, 1.6, 0] },
  top: { pos: [0, 11.5, 0.1], target: [0, 0, 0] },
};

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

export function DavenportElectricMotor3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // Electromechanical Parameters
  const { params, updateParam } = usePatentPhysics("us-132-davenport-electric-motor");
  const supplyVoltage = (params.batteryVoltage as number) ?? 12;
  const loadTorque = (params.loadTorque as number) ?? 0.8;
  const davenport = stepDavenportMotor({ batteryVoltage: supplyVoltage, loadTorque });
  const motorRpm = davenport.shaftRpm;
  const [showSparkParticles, setShowSparkParticles] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  const live = useLiveSimParams({
    motorRpm,
    supplyVoltage,
    showSparkParticles,
    isAudioMuted,
    isCutaway,
    loadTorque,
    mechanicalWatts: davenport.shaftPowerW,
    shaftOmegaRadPerS: davenport.shaftOmegaRadPerS,
  });

  // Shared transport tape: the motor's electrical drive state publishes to
  // the patentId-keyed bus so every consumer reads one deterministic envelope.
  useFrankenSimPhysics("us-132-davenport-electric-motor", {
    domain: "electromagnetics_flux",
    timestampMs: 0,
    timeStepDt: 1 / 60,
    refusal: { isRefused: false },
    em: { ...IDLE_EM, voltageVolts: supplyVoltage, rotorRpm: motorRpm },
  });

  // One tape-bound integrator (br-ixl.3): the registered updater owns the
  // authoritative shaft angle; the render loop keeps dt-paced mesh
  // interpolation. Accumulators live in refs so re-registering on control
  // changes never resets the rotor phase.
  const shaftAngleRef = useRef(0);
  useEffect(() => {
    const integrate: TapeUpdater = (prev, dt) => {
      shaftAngleRef.current += live.current.shaftOmegaRadPerS * dt;
      return {
        refusal: { isRefused: false },
        machine: {
          poseXMeters: 0,
          poseYMeters: 0,
          headingRad: shaftAngleRef.current,
          modeLabel: "commutator DC motor",
          // No metric rotor radius exists in the source; wheel speed stays
          // unpublished rather than invented.
          wheelSpeedMps: 0,
        },
        em: {
          ...(prev.em ?? IDLE_EM),
          voltageVolts: live.current.supplyVoltage,
          rotorRpm: live.current.motorRpm,
        },
      };
    };
    globalTransportBus.registerUpdater("us-132-davenport-electric-motor", integrate, "TS_FALLBACK");
    return () => globalTransportBus.unregisterUpdater("us-132-davenport-electric-motor");
  }, [live.current.shaftOmegaRadPerS, live.current.supplyVoltage, live.current.motorRpm]);

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

    const { rootGroup, nodes, materials, dispose } = buildDavenportMotorModel();
    scene.add(rootGroup);

    // Animation Loop
    let reqId: number;

    const clock = createStudioClock();

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const { dt } = clock.pump(now);
      const p = live.current;

      updateDavenportMotorKinematics(
        nodes,
        materials,
        dt,
        p.shaftOmegaRadPerS,
        p.showSparkParticles ? 1.0 : 0.0,
        p.supplyVoltage > 0 ? 0.8 : 0.2,
        p.isCutaway,
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
      <div className="sr-only">Davenport DC Motor 3D</div>
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
                ["commutator", "Commutator"],
                ["stator_magnets", "Stator"],
                ["rotor", "Rotor Armature"],
                ["brushes", "Brushes"],
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
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Solid Apparatus" : "Cutaway View"}
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
            onClick={() => setShowSparkParticles(!showSparkParticles)}
            title="Toggle Commutator Sparks"
            className={`min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showSparkParticles
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            <Zap className="w-4 h-4" />
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
                Shaft Speed:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {Math.round(motorRpm)} RPM
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Armature Current:</span>
              <span className="font-bold text-cyan-800 dark:text-cyan-400">
                {davenport.armatureCurrentA.toFixed(1)} A
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Shaft Power:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {davenport.shaftPowerW.toFixed(1)} W
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Efficiency:</span>
              <span className="font-bold text-purple-800 dark:text-purple-400">
                {davenport.efficiencyPct.toFixed(1)}%
              </span>
            </div>
          </div>
        )}

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="Davenport commutator DC motor"
          chips={[
            { label: "Shaft Speed", value: String(Math.round(motorRpm)), unit: "rpm" },
            { label: "Voltage", value: `${supplyVoltage}`, unit: "V" },
            { label: "Current", value: `${davenport.armatureCurrentA.toFixed(1)}`, unit: "A" },
            { label: "Load Torque", value: `${loadTorque.toFixed(2)}`, unit: "N·m" },
            { label: "Shaft Power", value: `${davenport.shaftPowerW.toFixed(1)}`, unit: "W" },
            {
              label: "Electrical Input",
              value: `${davenport.electricalWatts.toFixed(1)}`,
              unit: "W",
            },
            { label: "Efficiency", value: `${davenport.efficiencyPct.toFixed(1)}`, unit: "%" },
            { label: "ω_shaft", value: `${davenport.shaftOmegaRadPerS.toFixed(1)}`, unit: "rad/s" },
            {
              label: "Spark crate",
              value: crateSource === "wasm" ? "fs-ga" : "ts-ga-fallback",
            },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Galvanic Battery Voltage
              </span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {supplyVoltage} V
              </span>
            </div>
            <input
              type="range"
              min="4"
              max="24"
              step="1"
              value={supplyVoltage}
              onChange={(e) => updateParam("batteryVoltage", Number.parseInt(e.target.value, 10))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Mechanical Load Torque
              </span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {loadTorque.toFixed(2)} N·m
              </span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.1"
              value={loadTorque}
              onChange={(e) => updateParam("loadTorque", Number.parseFloat(e.target.value))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>
        </div>

        <ClaimConstraintToggle
          patentId="us-132-davenport-electric-motor"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-132-davenport-electric-motor"
          params={params}
          className="mt-3"
        />
      </div>
    </div>
  );
}
