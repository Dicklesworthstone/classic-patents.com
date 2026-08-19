"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX, Zap } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { stepSholesTypewriter } from "@/physics/machineKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { StudioKernelChips } from "./StudioKernelChips";
import {
  buildSholesTypewriterModel,
  updateSholesTypewriterKinematics,
} from "./sholesTypewriterModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset =
  | "iso"
  | "type_basket"
  | "platen_carriage"
  | "keyboard"
  | "escapement_ratchet"
  | "top";

export const SholesTypewriter3D = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // The source states a key-to-type-bar-to-ratchet sequence, not measured speed.
  const { params } = usePatentPhysics("us-79265-sholes-typewriter");
  const demonstrationCadence = params.typingSpeedWpm ?? 40;
  const sholesIdle = stepSholesTypewriter(demonstrationCadence, 0);
  const eventsPerSecond = sholesIdle.eventsPerSecond.toFixed(1);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  const live = useLiveSimParams({
    demonstrationCadence,
    isCutaway,
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
        camera.position.set(9.0, 7.5, 10.5);
        controls.target.set(0, 0, 0);
        break;
      case "type_basket":
        camera.position.set(0, 2.2, 3.5);
        controls.target.set(0, 0.4, 0);
        break;
      case "platen_carriage":
        camera.position.set(0, 3.2, 2.8);
        controls.target.set(0, 1.8, -0.4);
        break;
      case "keyboard":
        camera.position.set(0, 1.5, 4.2);
        controls.target.set(0, -0.8, 1.4);
        break;
      case "escapement_ratchet":
        camera.position.set(3.5, 2.8, 1.5);
        controls.target.set(2.8, 1.8, -0.2);
        break;
      case "top":
        camera.position.set(0, 11.5, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
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

    const studio = createThreeStudioScene({
      container,
      cameraPos: [9.0, 7.5, 10.5],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    const { rootGroup, nodes, materials, dispose } = buildSholesTypewriterModel();
    scene.add(rootGroup);

    let reqId: number;
    let displayElapsedS = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const p = live.current;
      displayElapsedS += 1 / 60;
      const step = stepSholesTypewriter(p.demonstrationCadence, displayElapsedS);

      updateSholesTypewriterKinematics(
        nodes,
        materials,
        step.ratchetReleasePct,
        step.displayTypebarIndex,
        p.isCutaway ?? false,
      );

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      dispose();
      studio.cleanup();
    };
  }, [live]);

  return (
    <div className="relative w-full h-[620px] bg-parchment-900 rounded-2xl overflow-hidden border border-parchment-700 shadow-2xl flex flex-col">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-parchment-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-parchment-100 uppercase tracking-wider">
            Sholes Type-Writer 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 79,265 (1868)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["type_basket", "Type Basket"],
              ["platen_carriage", "Platen Carriage"],
              ["keyboard", "Keyboard"],
              ["escapement_ratchet", "Escapement"],
              ["top", "Top"],
            ] as [CameraPreset, string][]
          ).map(([preset, label]) => (
            <button
              key={preset}
              type="button"
              onClick={() => applyCameraPreset(preset)}
              className={`px-2.5 py-1 text-xs font-sans rounded-lg transition-colors ${
                activeCamera === preset
                  ? "bg-amber-600 text-white font-semibold shadow-sm"
                  : "text-parchment-300 hover:text-white hover:bg-parchment-800/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Solid Frame" : "Cutaway Frame"}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-sans rounded-lg transition-colors ${
              isCutaway
                ? "bg-amber-600/30 text-amber-200 border border-amber-500/40"
                : "text-parchment-300 hover:text-white hover:bg-parchment-800/60"
            }`}
          >
            {isCutaway ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isCutaway ? "Cutaway" : "Solid"}</span>
          </button>

          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            <Zap className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      <StudioKernelChips
        visible={showUiOverlay}
        title="Sholes type-bar linkage & escapement kinematics"
        chips={[
          { label: "Cadence", value: `${demonstrationCadence}`, unit: "WPM" },
          { label: "Strike Rate", value: eventsPerSecond, unit: "Hz" },
          { label: "Typebars", value: "12", unit: "sample" },
          { label: "Escapement", value: "Ratchet I", unit: "step" },
          { label: "Platen Feed", value: "Line Space", unit: "auto" },
          {
            label: "Basket crate",
            value: crateSource === "wasm" ? "fs-symmetry" : "ts-cyclic-fallback",
          },
        ]}
      />
      <p className="absolute bottom-3 left-4 right-4 z-10 rounded-lg border border-parchment-700/60 bg-parchment-950/80 px-3 py-2 text-xs text-parchment-200 backdrop-blur-md">
        Source-faithful explanatory mode: Claim 1 (type-basket linkage), Claim 2 (moving platen
        carriage), and Claim 3 (ratchet wheel escapement).
      </p>
    </div>
  );
});
