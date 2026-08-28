"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { wrapCycleRad } from "@/physics/catalogKernels";
import { stepDieselEngine as kernelStepDieselEngine } from "@/physics/dieselEngineKernel";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
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
  buildDieselEngineModel,
  type DieselEngineMaterials,
  type DieselEngineNodes,
  updateDieselEngineKinematics,
} from "./dieselEngineModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "cylinder" | "injector" | "crosshead" | "compressor" | "flywheel";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [7.5, 3.2, 7.5], target: [0, 0.4, 0] },
  cylinder: { pos: [0.1, 2.4, 3.4], target: [0, 2.0, 0] },
  injector: { pos: [0.1, 4.4, 2.2], target: [0, 3.8, 0] },
  crosshead: { pos: [0.1, -0.4, 3.0], target: [0, -0.6, 0] },
  compressor: { pos: [-3.6, 0.6, -1.8], target: [-1.0, -0.2, -0.8] },
  flywheel: { pos: [4.5, -0.8, 3.8], target: [0, -1.6, 1.6] },
};

const BAR_TO_ATM = 0.986923;

const IDLE_THERMO: ThermodynamicsState = {
  temperatureCelsius: 0,
  temperatureKelvin: 273.15,
  pressureAtm: 1,
  partialPressureButaneAtm: 0,
  heatInputWatts: 0,
  coolingPowerWatts: 0,
  coefficientOfPerformance: 0,
  blackbodyRadiantPowerWatts: 0,
  fluidFlowVelocityMps: 0,
};

export function DieselEngine3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { params, updateParam } = usePatentPhysics("us-542846-diesel-engine");
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  const engineRpm = params.engineRpm ?? 150;
  const compressionRatio = params.compRatio ?? params.compressionRatio ?? 18;
  const blastAirPressure = params.blastAirPressure ?? 65;
  const cutoffRatio = params.cutoffRatio ?? 1.6;

  const diesel = kernelStepDieselEngine({
    compressionRatio,
    blastAirPressureBar: blastAirPressure,
    cutoffRatio,
    engineRpm,
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [cutawayMode, setCutawayMode] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isMuted, toggleMute } = usePatentAudio();

  const peakPressureBar = diesel.pCompBar;
  const peakTempC = diesel.tCompressionC;
  const thermalEfficiencyPct = diesel.brakeEfficiencyPct;
  const isAutoIgnition = diesel.isAutoIgnition;

  const live = useLiveSimParams({
    engineRpm,
    compressionRatio,
    blastAirPressure,
    cutoffRatio,
    isPlaying,
    isAutoIgnition: isAutoIgnition ? 1 : 0,
    claim1Active: claimStates[1] === false ? 0 : 1,
    peakTempC,
    cutawayMode,
    isMuted,
    crankOmegaRadPerS: diesel.crankOmegaRadPerS,
    governorBallSpread: diesel.governorBallSpread,
    pressureNeedleRadPerBar: diesel.pressureNeedleRadPerBar,
    cycleWrapRad: diesel.cycleWrapRad,
    camRatio: diesel.camRatio,
    camWrapRad: diesel.camWrapRad,
    injectionCamStartRad: diesel.injectionCamStartRad,
  });

  // Shared transport tape: the kernel-derived thermo state publishes to the
  // patentId-keyed bus so every consumer reads one deterministic envelope.
  useFrankenSimPhysics("us-542846-diesel-engine", {
    domain: "thermodynamics_transport",
    timestampMs: 0,
    timeStepDt: 1 / 60,
    refusal: { isRefused: false },
    thermo: {
      temperatureCelsius: peakTempC,
      temperatureKelvin: peakTempC + 273.15,
      pressureAtm: peakPressureBar * BAR_TO_ATM,
      partialPressureButaneAtm: 0,
      heatInputWatts: 0,
      coolingPowerWatts: 0,
      coefficientOfPerformance: 0,
      blackbodyRadiantPowerWatts: 0,
      fluidFlowVelocityMps: 0,
    },
  });

  const studioRef = useRef<StudioContext | null>(null);
  const animRef = useRef<number | null>(null);
  const nodesRef = useRef<DieselEngineNodes | null>(null);
  const matsRef = useRef<DieselEngineMaterials | null>(null);
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  // One tape-bound integrator (br-ixl.3): the registered updater owns the
  // crank-angle integration; the render loop only consumes bus frames.
  // Accumulators live in refs so re-registering on control changes never
  // snaps the crank back to zero. The kernel snapshot ref carries the
  // param-derived op point into the updater without re-running it per tick.
  const crankAngleRef = useRef(0);
  const lastLegalAngleRef = useRef(0);
  const kernelSnapshotRef = useRef({ pCompBar: peakPressureBar, tCompressionC: peakTempC });
  kernelSnapshotRef.current = { pCompBar: peakPressureBar, tCompressionC: peakTempC };

  useEffect(() => {
    const integrate: TapeUpdater = (prev, dt) => {
      if (!live.current.isPlaying) return null;
      // Refusal freezes the illegal step at the last legal angle instead of
      // clamping on (br-ixl.3 convention).
      const refused = (live.current.claim1Active ?? 1) < 0.5;
      if (!refused) {
        crankAngleRef.current = wrapCycleRad(
          crankAngleRef.current + live.current.crankOmegaRadPerS * dt,
          live.current.cycleWrapRad,
        );
        lastLegalAngleRef.current = crankAngleRef.current;
      } else {
        crankAngleRef.current = lastLegalAngleRef.current;
      }
      const snap = kernelSnapshotRef.current;
      return {
        refusal: {
          isRefused: refused,
          reason: refused ? "Claim 1 interlock open: crank held at last legal angle" : undefined,
        },
        machine: {
          poseXMeters: 0,
          poseYMeters: 0,
          headingRad: crankAngleRef.current,
          modeLabel: live.current.isAutoIgnition > 0.5 ? "compression-ignition" : "compression",
          // No metric flywheel radius exists in the source; wheel speed stays
          // unpublished rather than invented.
          wheelSpeedMps: 0,
        },
        thermo: {
          ...(prev.thermo ?? IDLE_THERMO),
          temperatureCelsius: snap.tCompressionC,
          temperatureKelvin: snap.tCompressionC + 273.15,
          pressureAtm: snap.pCompBar * BAR_TO_ATM,
        },
      };
    };
    globalTransportBus.registerUpdater("us-542846-diesel-engine", integrate, "TS_FALLBACK");
    return () => globalTransportBus.unregisterUpdater("us-542846-diesel-engine");
  }, [
    live.current.isPlaying,
    live.current.crankOmegaRadPerS,
    live.current.cycleWrapRad,
    live.current.isAutoIgnition,
    live.current.claim1Active,
  ]);

  useEffect(() => {
    void ensureGenericWasm().then((next) => setCrateSource(next));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [7.5, 3.2, 7.5],
      targetPos: [0, 0.4, 0],
      fov: 40,
      enableClouds: true,
      enableFloorGrid: true,
    });
    studioRef.current = studio;
    const { scene, renderer, controls } = studio;

    // Build procedural 3D model
    const { root, nodes, materials } = buildDieselEngineModel();
    nodesRef.current = nodes;
    matsRef.current = materials;
    scene.add(root);

    // --- RENDER LOOP: pure consumer of the shared transport tape ---
    // The registered updater integrates the crank angle on the bus; this
    // studio clock only paces mesh interpolation and falls back to the last
    // published pose until the first frame lands.
    let crankAngle = 0;
    let lastSoundAngle = 0;
    const clock = createStudioClock();
    const transport = globalTransportBus.getTransport("us-542846-diesel-engine");

    const renderLoop = (now: number) => {
      if (!studio.isVisible()) {
        animRef.current = requestAnimationFrame(renderLoop);
        return;
      }
      clock.pump(now);
      const p = live.current;

      if (p.isPlaying) {
        crankAngle = transport.lastFrame.telemetry.machine?.headingRad ?? crankAngle;

        updateDieselEngineKinematics(nodes, crankAngle, p.cutawayMode);

        // Sound cadence on combustion power stroke
        if (!p.isMuted) {
          const cycleRad = wrapCycleRad(crankAngle * p.camRatio, p.camWrapRad);
          if (cycleRad >= p.injectionCamStartRad && lastSoundAngle < p.injectionCamStartRad) {
            soundEngine.playPneumaticPuff();
          }
          lastSoundAngle = cycleRad;
        }
      }

      controls.update();
      renderer.render(scene, studio.camera);
      animRef.current = requestAnimationFrame(renderLoop);
    };

    animRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      studio.dispose();
    };
  }, [live]);

  const setCameraView = (view: CameraPreset) => {
    setActiveCamera(view);
    const cfg = CAMERA_PRESETS[view];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };
  const applyCameraPreset = setCameraView;

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Diesel Internal Combustion Engine 3D</div>
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
                ["cylinder", "Cylinder"],
                ["injector", "Injector"],
                ["crosshead", "Crosshead"],
                ["compressor", "Compressor"],
                ["flywheel", "Flywheel"],
              ] as [CameraPreset, string][]
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => setCameraView(preset)}
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

        {/* Top-Right Action Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap justify-end gap-1.5 sm:gap-2 max-w-[90%] pointer-events-auto">
          <ClaimConstraintToggle
            patentId="us-542846-diesel-engine"
            claimStates={claimStates}
            onToggleClaim={(c: number, active: boolean) => {
              setClaimStates((prev) => ({ ...prev, [c]: active }));
              updateParam("compressionRatio", active ? 18 : 6);
              updateParam("blastAirPressure", active ? 65 : 15);
            }}
          />
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`min-h-9 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              isPlaying
                ? "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
                : "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-600"
            }`}
          >
            <Zap className="w-3.5 h-3.5 inline sm:mr-1" />
            <span className="hidden md:inline">{isPlaying ? "Pause" : "Run"}</span>
          </button>
          <button
            type="button"
            onClick={() => setCutawayMode(!cutawayMode)}
            title={
              cutawayMode ? "Cutaway Active (Switch to Solid Engine)" : "Switch to Cutaway View"
            }
            className={`min-h-9 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              cutawayMode
                ? "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-600"
                : "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5 inline sm:mr-1" />
            <span className="hidden md:inline">
              {cutawayMode ? "Cutaway Active" : "Full Exterior"}
            </span>
          </button>
          <button
            type="button"
            onClick={toggleMute}
            className="min-h-9 p-1.5 sm:px-2 sm:py-1.5 rounded-lg text-xs font-sans bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border border-parchment-300 dark:border-ink-700 hover:bg-parchment-100 transition-colors shadow-xs"
            title={isMuted ? "Unmute Engine Audio" : "Mute Engine Audio"}
            aria-label={isMuted ? "Unmute Engine Audio" : "Mute Engine Audio"}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 inline" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 inline text-emerald-600 dark:text-emerald-400" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`min-h-9 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              showUiOverlay
                ? "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
                : "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-600"
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

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                Ignition State:
              </span>
              <span
                className={`font-bold ${isAutoIgnition ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}`}
              >
                {isAutoIgnition ? "COMPRESSION AUTO-IGNITION" : "SUB-CRITICAL"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Peak Pressure:</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                {peakPressureBar} bar
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Compression Temp:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">{peakTempC} °C</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Brake Efficiency:</span>
              <span className="text-sky-800 dark:text-sky-400 font-bold">
                {thermalEfficiencyPct}%
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
            id="dieselEngineRpm"
            patentId="us-542846-diesel-engine"
            paramKey="engineRpm"
            label="Engine Speed"
            value={engineRpm}
            min={60}
            max={300}
            step={10}
            unit="RPM"
            onChange={(val) => updateParam("engineRpm", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="dieselCompressionRatio"
            patentId="us-542846-diesel-engine"
            paramKey="compressionRatio"
            label="Compression Ratio"
            value={compressionRatio}
            min={12}
            max={24}
            step={1}
            unit=":1"
            onChange={(val) => updateParam("compressionRatio", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="dieselBlastAirPressure"
            patentId="us-542846-diesel-engine"
            paramKey="blastAirPressure"
            label="Air Blast Injection"
            value={blastAirPressure}
            min={40}
            max={90}
            step={5}
            unit="bar"
            onChange={(val) => updateParam("blastAirPressure", val)}
            allParams={params}
          />
        </div>

        <ClaimConstraintToggle
          patentId="us-542846-diesel-engine"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-542846-diesel-engine"
          params={params}
          className="mt-3"
        />
      </div>

      {/* Bottom SI Telemetry Chip Strip */}
      <StudioKernelChips
        visible={true}
        title="DIESEL THERMODYNAMICS"
        chips={[
          { label: "Bore / Stroke", value: "250 × 400", unit: "mm" },
          { label: "P_comp", value: String(peakPressureBar), unit: "bar" },
          { label: "T_comp", value: String(peakTempC), unit: "°C" },
          { label: "P_blast", value: String(blastAirPressure), unit: "bar" },
          { label: "η_brake", value: String(thermalEfficiencyPct), unit: "%" },
          { label: "Ignition", value: isAutoIgnition ? "Spontaneous" : "Sub-critical" },
          { label: "ω", value: diesel.crankOmegaRadPerS.toFixed(2), unit: "rad/s" },
          {
            label: "Gas crate",
            value: crateSource === "wasm" ? "fs-sparse" : "ts-heat-fallback",
          },
        ]}
      />
    </div>
  );
}
