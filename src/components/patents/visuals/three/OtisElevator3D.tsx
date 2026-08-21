"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Scissors, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { stepOtisElevator } from "@/physics/machineKernels";
import { createStudioClock } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildOtisElevatorModel, updateOtisElevatorKinematics } from "./otisElevatorModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "safety_pawls" | "leaf_spring" | "cab" | "crown_sheave" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [10.0, 6.5, 11.5], target: [0, 0, 0] },
  safety_pawls: { pos: [2.8, 2.2, 3.2], target: [1.8, 1.8, 0] },
  leaf_spring: { pos: [0, 4.2, 3.8], target: [0, 2.5, 0] },
  cab: { pos: [0, 0.5, 4.5], target: [0, 0, 0] },
  crown_sheave: { pos: [0, 6.8, 3.5], target: [0, 5.6, 0] },
  top: { pos: [0, 13.0, 0.1], target: [0, 0, 0] },
};

export function OtisElevator3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mechanical Elevator Simulation Parameters
  const { params, updateParam } = usePatentPhysics("us-31128-otis-elevator");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const cabPayloadKg = (params.cabPayload as number) ?? 650;
  const cableTensionPct = (params.cableTension as number) ?? 100;
  const otis = stepOtisElevator({ cabPayloadKg, cableTensionPct });
  const isRopeSevered = otis.isSnapped;
  const cabWeightLbs = otis.cabPayloadLbs;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  const pawlEngagementMs = otis.pawlEngagementMs;
  const stoppingDistanceInches = otis.stoppingDistanceIn;

  const live = useLiveSimParams({
    isRopeSevered,
    cabPayloadKg,
    cableTensionPct,
    isAudioMuted,
    isCutaway,
  });

  const studioRef = useRef<StudioContext | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const cutRope = () => {
    updateParam("cableTension", 0);
    if (!isAudioMuted) {
      soundEngine.playImpactThud();
    }
  };

  const resetRope = () => {
    updateParam("cableTension", 100);
    if (!isAudioMuted) {
      soundEngine.playSwitchClick();
    }
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

    const { root, nodes, materials, dispose } = buildOtisElevatorModel();
    scene.add(root);

    // Animation Loop
    let reqId: number;
    const clock = createStudioClock();

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      const { dt: delta, simTimeSec: timeSec } = clock.pump(now);
      const p = live.current;

      const currentOtis = stepOtisElevator({
        cabPayloadKg: p.cabPayloadKg,
        cableTensionPct: p.cableTensionPct,
      });

      updateOtisElevatorKinematics(
        nodes,
        materials,
        delta,
        timeSec,
        p.isRopeSevered,
        currentOtis.springBowY,
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
      <div className="sr-only">Otis Safety Elevator 3D</div>
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
                ["safety_pawls", "Safety Pawls"],
                ["leaf_spring", "Leaf Spring"],
                ["cab", "Passenger Cab"],
                ["crown_sheave", "Crown Sheave"],
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

        {/* Top Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          {isRopeSevered ? (
            <button
              type="button"
              onClick={resetRope}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-sans font-medium transition-colors shadow-sm"
              title="Reset Hoisting Cable"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Rope</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={cutRope}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-sans font-medium transition-colors shadow-sm animate-pulse"
              title="Sever Hoisting Rope (Trigger Safety Pawls)"
            >
              <Scissors className="w-4 h-4" />
              <span>Cut Rope</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Solid Structure" : "Cutaway View"}
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
                Cable Tension:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {cableTensionPct}%
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Pawl Engagement:</span>
              <span
                className={`font-bold ${isRopeSevered ? "text-rose-700 dark:text-rose-400" : "text-emerald-700 dark:text-emerald-400"}`}
              >
                {isRopeSevered ? `ENGAGED (${pawlEngagementMs} ms)` : "STOWED (TAUT)"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Stopping Distance:</span>
              <span className="font-bold text-cyan-800 dark:text-cyan-400">
                {stoppingDistanceInches} in
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Hoist Tension:</span>
              <span className="font-bold text-purple-800 dark:text-purple-400">
                {otis.hoistTensionKn.toFixed(1)} kN
              </span>
            </div>
          </div>
        )}

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="Otis wagon-spring safety"
          chips={[
            { label: "Payload", value: String(cabWeightLbs), unit: "lb" },
            {
              label: "Cable",
              value: String(Math.round(cableTensionPct)),
              unit: "%",
              tone: isRopeSevered ? "warn" : "ok",
            },
            {
              label: "Pawls",
              value: otis.isPawlEngaged ? "engaged" : "stowed",
              tone: otis.isPawlEngaged ? "hot" : "ok",
            },
            { label: "Stop", value: String(stoppingDistanceInches), unit: "in" },
            { label: "Pawl", value: String(pawlEngagementMs), unit: "ms" },
            { label: "Arrest", value: String(otis.peakArrestForceKn), unit: "kN" },
            { label: "Mass", value: String(otis.hangingMassKg), unit: "kg" },
            { label: "T", value: String(otis.hoistTensionKn), unit: "kN" },
            {
              label: "Sheave crate",
              value: crateSource === "wasm" ? "fs-symmetry" : "ts-cyclic-fallback",
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
                Elevator Cab Payload
              </span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {cabPayloadKg} kg
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="1500"
              step="50"
              value={cabPayloadKg}
              onChange={(e) => updateParam("cabPayload", Number.parseInt(e.target.value, 10))}
              className="w-full accent-amber-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Hoisting Cable Tension
              </span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {cableTensionPct}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={cableTensionPct}
              onChange={(e) => updateParam("cableTension", Number.parseInt(e.target.value, 10))}
              className="w-full accent-cyan-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
