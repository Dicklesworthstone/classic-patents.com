"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { FrankenSimEngine } from "@/physics/engine";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { createStudioClock } from "@/physics/tickScheduler";
import {
  globalTransportBus,
  type TapeUpdater,
  useFrankenSimPhysics,
} from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";
import {
  buildWestinghouseAirBrakeModel,
  updateWestinghouseAirBrakeKinematics,
  type WestinghouseAirBrakeModelResult,
} from "./westinghouseAirBrakeModel";

type CameraPreset =
  | "iso"
  | "selecting_cock"
  | "trip_apparatus"
  | "brake_cylinder"
  | "reservoir"
  | "signaling_gauge";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [8.5, 5.5, 9.5], target: [0, 0, 0] },
  selecting_cock: { pos: [0.2, 2.2, 2.8], target: [0, 0.9, 0.825] },
  trip_apparatus: { pos: [-3.2, 1.2, 2.6], target: [-3.6, 0.2, 0.85] },
  brake_cylinder: { pos: [2.6, 1.8, 2.2], target: [1.4, 0.5, 0] },
  reservoir: { pos: [-2.4, 1.8, 2.2], target: [-1.5, 0.5, 0] },
  signaling_gauge: { pos: [4.2, 1.8, 1.8], target: [3.4, 0.8, 0.4] },
};

export function WestinghouseAirBrake3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  // Pneumatic Simulation Parameters from Shared Hook
  const { params, updateParam } = usePatentPhysics("us-124404-westinghouse-air-brake");
  const trainPipePressurePsi = (params.trainPipePressure as number) ?? 0;
  const reservoirPipePressurePsi = (params.reservoirPipePressure as number) ?? 90;
  const selectingCockPos = (params.selectingCockPosition as number) ?? 0;
  const accidentTripMode = (params.accidentTrip as number) ?? 0;
  const signalPulsePsi = (params.signalPulsePressure as number) ?? 0;

  const tripModes = ["running", "tripped_derailment", "tripped_parting"] as const;
  const tripCockState = tripModes[accidentTripMode] ?? "running";
  const selectingCockState = selectingCockPos === 1 ? "reversed" : "normal";

  const westinghouse = FrankenSimEngine.stepWestinghouseAirBrake({
    trainPipePressurePsi,
    reservoirPipePressurePsi,
    selectingCockState,
    tripCockState,
    signalPulsePressurePsi: signalPulsePsi,
  });

  const isBrakeClamped = westinghouse.brakeCylinderPressurePsi > 5;
  const clampingForceKn = westinghouse.shoeClampingForceKn;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  const live = useLiveSimParams({
    trainPipePressurePsi,
    reservoirPipePressurePsi,
    selectingCockState,
    tripCockState,
    signalPulsePressurePsi: signalPulsePsi,
    isBrakeClamped,
    isAudioMuted,
    clampingForceKn,
    rollingOmegaRadPerS: westinghouse.rollingOmegaRadPerS,
    isCutaway,
  });

  // Shared transport tape: brake pipe/triple-valve state publishes to the patentId-keyed bus.
  useFrankenSimPhysics("us-124404-westinghouse-air-brake", {
    domain: "thermo_fluid",
    refusal: { isRefused: false },
  });
  const westWheelAngleRef = useRef(0);

  useEffect(() => {
    const integrate: TapeUpdater = (_prev, dt) => {
      const p = live.current;
      const out = FrankenSimEngine.stepWestinghouseAirBrake({
        trainPipePressurePsi: p.trainPipePressurePsi,
        reservoirPipePressurePsi: p.reservoirPipePressurePsi,
        selectingCockState: p.selectingCockState as "normal" | "reversed",
        tripCockState: p.tripCockState as "running" | "tripped_derailment" | "tripped_parting",
        signalPulsePressurePsi: p.signalPulsePressurePsi,
      });
      westWheelAngleRef.current += out.rollingOmegaRadPerS * dt;
      return {
        machine: {
          poseXMeters: 0,
          poseYMeters: 0,
          headingRad: westWheelAngleRef.current,
          modeLabel: out.valveState,
          wheelSpeedMps: out.rollingOmegaRadPerS * out.wheelRadiusM,
        },
        thermo: {
          temperatureCelsius: 0,
          temperatureKelvin: 0,
          pressureAtm: out.brakeCylinderPressurePsi / 14.6959,
          partialPressureButaneAtm: 0,
          heatInputWatts: 0,
          coolingPowerWatts: 0,
          coefficientOfPerformance: 0,
          blackbodyRadiantPowerWatts: 0,
          fluidFlowVelocityMps: 0,
        },
      };
    };
    globalTransportBus.registerUpdater(
      "us-124404-westinghouse-air-brake",
      integrate,
      "TS_FALLBACK",
    );
    return () => globalTransportBus.unregisterUpdater("us-124404-westinghouse-air-brake");
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

    // Authentic Model
    const brakeModel: WestinghouseAirBrakeModelResult = buildWestinghouseAirBrakeModel();
    scene.add(brakeModel.root);

    // Animation Loop
    let reqId: number;
    let wasClamped = false;

    const clock = createStudioClock();

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      const { dt: delta } = clock.pump(now);
      const p = live.current;

      // Bus-owned integration: latest shared-tape wheel rotation.
      const wheelAngleNow = westWheelAngleRef.current;

      // Update model kinematics
      updateWestinghouseAirBrakeKinematics(
        brakeModel,
        {
          trainPipePressurePsi: p.trainPipePressurePsi,
          reservoirPipePressurePsi: p.reservoirPipePressurePsi,
          selectingCockState: p.selectingCockState as "normal" | "reversed" | undefined,
          tripCockState: p.tripCockState as
            | "running"
            | "tripped_derailment"
            | "tripped_parting"
            | undefined,
          signalPulsePressurePsi: p.signalPulsePressurePsi,
        },
        delta,
      );

      brakeModel.nodes.wheelSets.forEach((ws) => {
        ws.rotation.z = wheelAngleNow;
      });

      brakeModel.setCutaway?.(p.isCutaway ?? false);

      // Audio puff on brake application trigger
      if (p.isBrakeClamped && !wasClamped && !p.isAudioMuted) {
        soundEngine.playPneumaticPuff();
      }
      wasClamped = p.isBrakeClamped;

      controls.update();
      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      brakeModel.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Westinghouse Double-Pipe Air Brake 3D</div>
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
                ["selecting_cock", "Selecting Cock d¹"],
                ["trip_apparatus", "Trip Cock e"],
                ["brake_cylinder", "Cylinder C"],
                ["reservoir", "Receiver D"],
                ["signaling_gauge", "Signal Gauge g²"],
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

        {/* Top Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 max-w-[min(90%,26rem)] sm:max-w-[26rem] pointer-events-auto">
          <ClaimConstraintToggle
            patentId="us-124404-westinghouse-air-brake"
            claimStates={claimStates}
            onToggleClaim={(c: number, active: boolean) => {
              setClaimStates((prev) => ({ ...prev, [c]: active }));
              updateParam("reservoirPipePressure", active ? 90 : 0);
            }}
          />
          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              isCutaway
                ? "bg-cyan-600 text-white border-cyan-700 shadow-md ring-2 ring-cyan-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
            title={isCutaway ? "Solid Castings" : "Transparent Valve & Cylinder Cutaway"}
            aria-label={isCutaway ? "Solid Castings" : "Transparent Valve & Cylinder Cutaway"}
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
                Operating Pipe B:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {westinghouse.operatingPipePressurePsi} psi
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Receiver Pipe B¹:</span>
              <span className="font-bold text-cyan-800 dark:text-cyan-400">
                {westinghouse.reservoirPipePressurePsi} psi
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Cylinder C:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {westinghouse.brakeCylinderPressurePsi} psi
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Clamping Force:</span>
              <span className="font-bold text-purple-800 dark:text-purple-400">
                {clampingForceKn.toFixed(1)} kN
              </span>
            </div>
          </div>
        )}

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="US 124,404 Double-Pipe Pneumatics"
          chips={[
            { label: "Operating Pipe B", value: `${westinghouse.operatingPipePressurePsi} psi` },
            { label: "Receiver Pipe B¹", value: `${westinghouse.reservoirPipePressurePsi} psi` },
            {
              label: "Cock d¹",
              value: westinghouse.isSelectingCockReversed ? "Position 2 (Swapped)" : "Position 1",
              tone: "ok",
            },
            {
              label: "Cock e",
              value: westinghouse.isTripped ? "TRIPPED (Accident)" : "ARMED",
              tone: westinghouse.isTripped ? "warn" : "ok",
            },
            { label: "Cylinder C", value: `${westinghouse.brakeCylinderPressurePsi} psi` },
            { label: "Clamping", value: `${clampingForceKn.toFixed(1)} kN` },
            { label: "Signal Code", value: westinghouse.signalMessage },
            {
              label: "Pneumatics kernel",
              value: crateSource === "wasm" ? "fs-fluid" : "ts-pneumatics",
            },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SensitivitySlider
            id="westinghouseTrainPipe"
            patentId="us-124404-westinghouse-air-brake"
            paramKey="brakePipePressure"
            label="Operating Pipe (Pipe B)"
            value={trainPipePressurePsi}
            min={0}
            max={80}
            step={5}
            unit="psi"
            onChange={(val) => updateParam("trainPipePressure", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="westinghouseReservoirPipe"
            patentId="us-124404-westinghouse-air-brake"
            paramKey="reservoirPressure"
            label="Auxiliary Reservoir (Pipe B¹)"
            value={reservoirPipePressurePsi}
            min={0}
            max={100}
            step={5}
            unit="psi"
            onChange={(val) => updateParam("reservoirPipePressure", val)}
            allParams={params}
          />

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Selecting Cock d¹</span>
              <span className="text-purple-700 dark:text-purple-400 font-mono font-bold">
                {selectingCockPos === 1 ? "Position 2 (Swapped)" : "Position 1 (Normal)"}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="1"
              value={selectingCockPos}
              onChange={(e) =>
                updateParam("selectingCockPosition", Number.parseInt(e.target.value, 10))
              }
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-purple-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>
        </div>

        <ClaimConstraintToggle
          patentId="us-124404-westinghouse-air-brake"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-124404-westinghouse-air-brake"
          params={params}
          className="mt-3"
        />
      </div>
    </div>
  );
}
