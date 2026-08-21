"use client";

import { Activity, Camera, Eye, EyeOff, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { stepRenoEscalator } from "@/physics/machineKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import {
  buildRenoEscalatorModel,
  type RenoEscalatorModelResult,
  updateRenoEscalatorKinematics,
} from "./renoEscalatorModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "comb_plates" | "cleated_deck" | "handrail" | "drive_machinery" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [9.5, 6.5, 10.5], target: [0, 0, 0] },
  comb_plates: { pos: [5.5, 3.2, 2.5], target: [4.2, 2.1, 0] },
  cleated_deck: { pos: [0, 2.4, 3.8], target: [0, 0.4, 0] },
  handrail: { pos: [-2.5, 2.2, 3.2], target: [-1.0, 1.2, 1.4] },
  drive_machinery: { pos: [6.5, 2.2, 2.8], target: [5.2, 1.5, 0] },
  top: { pos: [0, 11.5, 0.1], target: [0, 0, 0] },
};

export function RenoEscalator3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [cutawayMode, setCutawayMode] = useState<boolean>(true);

  // Transit Dynamics Parameters
  const { params, updateParam } = usePatentPhysics("us-470918-reno-escalator");
  const beltSpeedMps = (params.beltSpeed as number) ?? 0.45;
  const passengerCount = (params.passengerCount as number) ?? 30;
  const inclineAngleDeg = (params.inclineAngle as number) ?? 25;
  const renoIdle = stepRenoEscalator({
    passengerCount,
    inclineAngleDeg,
    velocityMps: beltSpeedMps,
  });
  const deckSpeedFpm = renoIdle.speedFpm;
  const passengersPerHour = renoIdle.throughputPerHour;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  const live = useLiveSimParams({
    beltSpeedMps,
    sheaveOmegaRadPerS: renoIdle.sheaveOmegaRadPerS,
    passengerCount,
    inclineAngleDeg,
    cutawayMode,
    isAudioMuted,
    speedFpm: deckSpeedFpm,
    throughputPerHour: passengersPerHour,
    motorPowerKw: renoIdle.motorPowerKw,
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

    // Procedural Reno Inclined Elevator Model
    const escalatorModel: RenoEscalatorModelResult = buildRenoEscalatorModel(inclineAngleDeg);
    scene.add(escalatorModel.root);

    let reqId: number;
    let timeSec = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const dt = 1 / 60;
      timeSec += dt;
      const p = live.current;

      updateRenoEscalatorKinematics(
        escalatorModel.nodes,
        escalatorModel.materials,
        dt,
        timeSec,
        p.sheaveOmegaRadPerS,
        p.cutawayMode,
      );

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      escalatorModel.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live, inclineAngleDeg]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Reno Inclined Elevator &amp; Comb 3D</div>
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
                ["iso", "Overview"],
                ["comb_plates", "Comb Teeth"],
                ["cleated_deck", "Cleated Deck"],
                ["handrail", "Handrail"],
                ["drive_machinery", "Drive Motor"],
                ["top", "Top"],
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
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setCutawayMode(!cutawayMode)}
            title={cutawayMode ? "Switch to Solid Panels" : "Switch to Glass Balustrade"}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm text-xs font-sans flex items-center gap-1 ${
              cutawayMode
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            {cutawayMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden sm:inline">{cutawayMode ? "Cutaway" : "Solid"}</span>
          </button>

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
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showUiOverlay
                ? "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
                : "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
            }`}
            title={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
            aria-label={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
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
                Tread Speed:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {deckSpeedFpm} FPM ({beltSpeedMps.toFixed(2)} m/s)
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Hourly Throughput:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {passengersPerHour.toLocaleString()} pass/h
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Truss Incline:</span>
              <span className="font-bold text-cyan-800 dark:text-cyan-400">{inclineAngleDeg}°</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Motor Power:</span>
              <span className="font-bold text-purple-800 dark:text-purple-400">
                {renoIdle.motorPowerKw.toFixed(1)} kW
              </span>
            </div>
          </div>
        )}

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="Reno Endless Conveyor Dynamics"
          chips={[
            { label: "Belt Speed", value: `${deckSpeedFpm} FPM` },
            { label: "Throughput", value: `${passengersPerHour.toLocaleString()} pass/h` },
            { label: "Incline", value: `${inclineAngleDeg}°` },
            { label: "Power", value: `${renoIdle.motorPowerKw.toFixed(1)} kW` },
            { label: "Safety Comb", value: "1.2mm Intermeshed" },
            {
              label: "Sheave crate",
              value: crateSource === "wasm" ? "fs-symmetry" : "ts-cyclic-fallback",
            },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Tread Speed</span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {beltSpeedMps.toFixed(2)} m/s
              </span>
            </div>
            <input
              type="range"
              min="0.30"
              max="0.75"
              step="0.05"
              value={beltSpeedMps}
              onChange={(e) => updateParam("beltSpeed", Number.parseFloat(e.target.value))}
              className="w-full accent-amber-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Live Passenger Load
              </span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {passengerCount} riders
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="2"
              value={passengerCount}
              onChange={(e) => updateParam("passengerCount", Number.parseInt(e.target.value, 10))}
              className="w-full accent-cyan-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Truss Incline Angle
              </span>
              <span className="text-purple-700 dark:text-purple-400 font-mono font-bold">
                {inclineAngleDeg}°
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="35"
              step="1"
              value={inclineAngleDeg}
              onChange={(e) => updateParam("inclineAngle", Number.parseInt(e.target.value, 10))}
              className="w-full accent-purple-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
