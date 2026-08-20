"use client";

import { Camera, Eye, EyeOff, RotateCcw, Scissors, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { stepOtisElevator } from "@/physics/machineKernels";
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
  const cabPayloadKg = params.cabPayload ?? 650;
  const cableTensionPct = params.cableTension ?? 100;
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
    let timeSec = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const dt = 1 / 60;
      timeSec += dt;
      const p = live.current;

      const step = stepOtisElevator({
        cabPayloadKg: p.cabPayloadKg,
        cableTensionPct: p.cableTensionPct,
      });

      // Update cutaway transparency
      materials.agedTimberWood.opacity = p.isCutaway ? 0.35 : 1.0;
      materials.agedTimberWood.transparent = p.isCutaway;

      updateOtisElevatorKinematics(
        nodes,
        materials,
        dt,
        timeSec,
        step.isSnapped,
        step.springBowY,
        step.isPawlEngaged,
        p.cabPayloadKg,
        p.cableTensionPct,
      );

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Title HUD */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 pointer-events-none rounded-xl border border-parchment-700/60 bg-parchment-950/80 px-3.5 py-2 backdrop-blur-md shadow-lg">
            <div className="font-mono text-xs font-bold text-parchment-100 uppercase tracking-wider">
              Otis Safety Elevator 3D
            </div>
            <div className="text-[11px] text-parchment-300 font-sans">
              US Patent 31,128 • Hoisting Apparatus with Safety Pawls
            </div>
          </div>
        )}

        {/* Top Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          {isRopeSevered ? (
            <button
              type="button"
              onClick={resetRope}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reconnect Cable
            </button>
          ) : (
            <button
              type="button"
              onClick={cutRope}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-md transition-colors animate-pulse"
            >
              <Scissors className="w-3.5 h-3.5" /> Cut Cable
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Solid Mode" : "Cutaway Guide Posts"}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm text-xs font-sans flex items-center gap-1 ${
              isCutaway
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            {isCutaway ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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

        {/* Camera Views Bar */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-1.5rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs">
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
    </div>
  );
}
