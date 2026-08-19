"use client";

import {
  Activity,
  Camera,
  Eye,
  EyeOff,
  RotateCcw,
  Scissors,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";
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

  const controlsRef = useRef<StudioContext["controls"] | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    switch (preset) {
      case "iso":
        camera.position.set(10.0, 6.5, 11.5);
        controls.target.set(0, 0, 0);
        break;
      case "safety_pawls":
        camera.position.set(2.8, 2.2, 3.2);
        controls.target.set(1.8, 1.8, 0);
        break;
      case "leaf_spring":
        camera.position.set(0, 4.2, 3.8);
        controls.target.set(0, 2.5, 0);
        break;
      case "cab":
        camera.position.set(0, 0.5, 4.5);
        controls.target.set(0, 0, 0);
        break;
      case "crown_sheave":
        camera.position.set(0, 6.8, 3.5);
        controls.target.set(0, 5.6, 0);
        break;
      case "top":
        camera.position.set(0, 13.0, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
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

    const studio = createThreeStudioScene({
      container,
      cameraPos: [10.0, 6.5, 11.5],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

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
            Otis Safety Elevator 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 31,128 (1861)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["safety_pawls", "Safety Pawls"],
              ["leaf_spring", "Leaf Spring"],
              ["cab", "Passenger Cab"],
              ["crown_sheave", "Crown Sheave"],
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

        {/* Toggles & Cut Rope Action */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Solid Mode" : "Cutaway Guide Posts"}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-sans rounded-lg transition-colors ${
              isCutaway
                ? "bg-amber-600/30 text-amber-200 border border-amber-500/40"
                : "text-parchment-300 hover:text-white hover:bg-parchment-800/60"
            }`}
          >
            {isCutaway ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isCutaway ? "Cutaway" : "Solid"}</span>
          </button>

          {isRopeSevered ? (
            <button
              type="button"
              onClick={resetRope}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reconnect Cable
            </button>
          ) : (
            <button
              type="button"
              onClick={cutRope}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-md transition-colors animate-pulse"
            >
              <Scissors className="w-3.5 h-3.5" /> Cut Rope (Demonstration)
            </button>
          )}

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
  );
}
