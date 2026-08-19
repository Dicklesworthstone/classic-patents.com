"use client";

import {
  Camera,
  Eye,
  EyeOff,
  RotateCcw,
  Scissors,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import { FrankenSimEngine } from "@/physics/engine";
import { stepHoweLockstitch } from "@/physics/machineKernels";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildHoweSewingMachineModel, howeCyclicFlex } from "./howeSewingMachineModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "needle" | "shuttle" | "flywheel" | "top";

export function HoweSewingMachine3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mechanical Stitching State Controls
  const { params } = usePatentPhysics("us-4750-howe-sewing-machine");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const stitchingSpeedRpm = params.crankRpm ?? 240;
  const stitchPitchMm = params.stitchPitchMm ?? 3.5;
  const threadTensionGrams = params.threadTensionGrams ?? 45;
  const isCranking = params.isCranking !== 0;
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  // Lockstitch Kinematics Calculations (FrankenSim 4-Bar Mechanism)
  const stitchState = FrankenSimEngine.stepHoweSewingMachine(
    stitchingSpeedRpm,
    threadTensionGrams,
    stitchPitchMm,
  );

  useFrankenSimPhysics("us-4750-howe-sewing-machine", {
    domain: "continuum_elasticity",
    timestampMs: Date.now(),
    timeStepDt: 0.016,
    refusal: { isRefused: false },
    continuum: {
      tensileStressMpa: 0,
      tensileStrainPct: 0,
      elasticModulusGpa: 0,
      crossLinkDensityMolesPerCm3: 0,
      stitchFrequencyHz: stitchState.stitchFrequencyHz,
      feedVelocityMmPs: stitchState.clothFeedMmPerS,
      buoyancyLiftForceKiloNewtons: 0,
    },
  });
  const stitchesPerSecond = stitchState.stitchFrequencyHz.toFixed(1);
  const clothFeedRateMmPerSec = stitchState.clothFeedMmPerS.toFixed(1);

  const live = useLiveSimParams({
    stitchingSpeedRpm,
    isCranking,
    stitchPitchMm,
    clothFeedRateMmPerSec,
    threadTensionGrams,
    isAudioMuted,
    crankOmegaRadPerS: stitchState.crankOmegaRadPerS,
    crankOmegaDegPerS: stitchState.crankOmegaDegPerS,
    displayWrapDeg: stitchState.displayWrapDeg,
    clothStudioAdvancePerS: stitchState.clothStudioAdvancePerS,
    clothStudioWrap: stitchState.clothStudioWrap,
    stitchFrequencyHz: stitchState.stitchFrequencyHz,
  });

  const controlsRef = useRef<StudioContext["controls"] | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    switch (preset) {
      case "iso":
        camera.position.set(11, 8, 13);
        controls.target.set(0, 0, 0);
        break;
      case "needle":
        camera.position.set(3.2, 0.4, 3.0);
        controls.target.set(2.8, -1.0, 0);
        break;
      case "shuttle":
        camera.position.set(2.8, -1.2, 2.5);
        controls.target.set(2.8, -1.5, 0);
        break;
      case "flywheel":
        camera.position.set(-4.5, 2.2, 3.5);
        controls.target.set(-3.8, 2.1, 0);
        break;
      case "top":
        camera.position.set(1.0, 7.0, 0.1);
        controls.target.set(1.0, 0, 0);
        break;
    }
    controls.update();
  };

  const toggleSound = () => {
    toggleEngine(() => {
      soundEngine.playLockstitchClack();
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [11, 8, 13],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Build procedural 3D model
    const model = buildHoweSewingMachineModel();
    scene.add(model.rootGroup);

    // Render loop & kinematics
    let reqId: number;
    let renderedSteps = 0;
    let prevStitchCycle = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      renderedSteps += 1;
      const elapsed = renderedSteps * (1 / 60);
      const p = live.current;

      const crankDeg = (elapsed * p.crankOmegaDegPerS) % p.displayWrapDeg;
      const stitch = stepHoweLockstitch(crankDeg);

      if (p.isCranking) {
        const flex = howeCyclicFlex(p.crankOmegaRadPerS);
        model.flywheelGroup.rotation.x = elapsed * p.crankOmegaRadPerS;
        model.needleArmGroup.rotation.z = stitch.needleStudioRotZ * flex;
        model.needleArmGroup.position.y = stitch.needleStudioY;
        model.shuttleGroup.position.z = stitch.shuttleStudioZ * flex;
        model.clothMesh.position.z = -((elapsed * p.clothStudioAdvancePerS) % p.clothStudioWrap);

        // Acoustic clack synthesis on stitch cycle
        const currentCycle = Math.floor(elapsed * p.stitchFrequencyHz);
        if (currentCycle !== prevStitchCycle) {
          prevStitchCycle = currentCycle;
          if (!p.isAudioMuted) {
            soundEngine.playLockstitchClack();
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
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      {/* 3D WebGL Canvas Viewport */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Live HUD Telemetry Overlay */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-col gap-1.5 sm:gap-2 pointer-events-none max-w-[calc(100%-8rem)] sm:max-w-md transition-opacity duration-200">
            <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md p-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
              <div className="text-[10px] sm:text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Scissors className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 animate-pulse" />
                Lockstitch Kinematics Telemetry
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 sm:gap-y-1 mt-1 text-[10px] sm:text-xs font-sans">
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Velocity:</span>{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {stitchingSpeedRpm} RPM ({stitchesPerSecond} Hz)
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Feed:</span>{" "}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {clothFeedRateMmPerSec} mm/s
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Lock shear:</span>{" "}
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {stitchState.lockstitchShearStrengthN} N
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Tension:</span>{" "}
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {threadTensionGrams} g
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 items-center gap-2 max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse shrink-0" />
              <span className="truncate">Elias Howe Jr. (US 4,750) — Sewing Machine (1846)</span>
            </div>
          </div>
        )}

        {/* Top Right Tool Bar (Toggle UI, Audio, Pins, Reset) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showUiOverlay
                ? "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
                : "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
            }`}
            title={showUiOverlay ? "Hide Overlay UI (Clean 3D View)" : "Show Overlay UI"}
            aria-label={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
          >
            {showUiOverlay ? (
              <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
          <button
            aria-label={isAudioMuted ? "Unmute simulation audio" : "Mute simulation audio"}
            type="button"
            onClick={toggleSound}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={isAudioMuted ? "Enable Sound Synthesis" : "Mute Sound"}
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            )}
          </button>
          <button
            aria-label={showCalloutPins ? "Hide annotation pins" : "Show annotation pins"}
            type="button"
            onClick={() => setShowCalloutPins(!showCalloutPins)}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showCalloutPins
                ? "bg-amber-600 text-white border-amber-700 shadow-md"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
            title="Toggle Historical Patent Numeral Pins"
          >
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Camera Views Bar */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-1.5rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["needle", "Needle Point"],
                ["shuttle", "Boat Shuttle"],
                ["flywheel", "Flywheel Crank"],
                ["top", "Cloth Feed"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => applyCameraPreset(id)}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-sans whitespace-nowrap shrink-0 transition-colors ${
                  activeCamera === id
                    ? "bg-amber-700 dark:bg-amber-600 text-white font-semibold shadow-xs"
                    : "text-ink-700 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
