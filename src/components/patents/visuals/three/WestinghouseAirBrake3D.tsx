"use client";

import { Activity, Camera, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FrankenSimEngine } from "@/physics/engine";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { StudioKernelChips } from "./StudioKernelChips";
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
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);

  // Pneumatic Simulation Parameters from Shared Hook
  const { params } = usePatentPhysics("us-124404-westinghouse-air-brake");
  const trainPipePressurePsi = params.trainPipePressure ?? 0;
  const reservoirPipePressurePsi = params.reservoirPipePressure ?? 90;
  const selectingCockPos = params.selectingCockPosition ?? 0;
  const accidentTripMode = params.accidentTrip ?? 0;
  const signalPulsePsi = params.signalPulsePressure ?? 0;

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
    const brakeModel: WestinghouseAirBrakeModelResult = buildWestinghouseAirBrakeModel();
    scene.add(brakeModel.root);

    // Animation Loop
    let reqId: number;
    let wheelAngle = 0;
    let wasClamped = false;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = 1 / 60;
      const p = live.current;

      const wheelOmega = p.rollingOmegaRadPerS ?? 0;
      wheelAngle -= wheelOmega * delta;

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

      // Rotate wheels
      brakeModel.nodes.wheelSets.forEach((ws) => {
        ws.rotation.z = wheelAngle;
      });

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
    <div className="relative w-full h-[620px] bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent flex flex-col">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-parchment-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto text-parchment-100">
          <Activity className="w-4 h-4 text-sky-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-parchment-100 uppercase tracking-wider">
            Westinghouse Double-Pipe Air Brake 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
            US Patent 124,404 (1872)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
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
              className={`px-2.5 py-1 text-xs font-sans rounded-lg transition-colors ${
                activeCamera === preset
                  ? "bg-sky-600 text-white font-semibold shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60 shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className="p-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Zap className="w-4 h-4 text-sky-400" />
          </button>
        </div>
      </div>

      <StudioKernelChips
        visible={showUiOverlay}
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
  );
}
