"use client";

import { Activity, Camera, Eye, EyeOff, Layers } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import { stepMcCormickReaper } from "@/physics/catalogKernels";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { buildMcCormickReaperModel, updateMcCormickReaperKinematics } from "./mccormickReaperModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

type CameraPreset = "iso" | "sickle_guards" | "grain_reel" | "platform" | "drive_wheel" | "top";

export function McCormickReaper3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mechanical Reaper Simulation Parameters
  const { params } = usePatentPhysics("us-x8277-mccormick-reaper");
  const groundSpeedMph = params.forwardSpeedMph ?? params.groundSpeedMph ?? 2.5;
  const [crateSource, setCrateSource] = useState(genericKernelSource());
  const reaper = stepMcCormickReaper({ forwardSpeedMph: groundSpeedMph });
  const cutterCrankRpm = reaper.cutterCrankRpm;
  const reelRpm = reaper.reelRpm;
  const [showStalks, setShowStalks] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");

  const live = useLiveSimParams({
    groundSpeedMph,
    cutterCrankRpm,
    reelRpm,
    showStalks,
    isCutaway,
    groundWheelOmegaRadPerS: reaper.groundWheelOmegaRadPerS,
    reelOmegaRadPerS: reaper.reelOmegaRadPerS,
    cutterOmegaRadPerS: reaper.cutterOmegaRadPerS,
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
        camera.position.set(10.5, 7.0, 11.0);
        controls.target.set(0, 0, 0);
        break;
      case "sickle_guards":
        camera.position.set(-1.0, 1.0, 4.5);
        controls.target.set(-0.5, -0.6, 1.8);
        break;
      case "grain_reel":
        camera.position.set(2.8, 3.8, 4.0);
        controls.target.set(0, 1.2, 0);
        break;
      case "platform":
        camera.position.set(0, 5.0, 0);
        controls.target.set(0, -0.5, -0.5);
        break;
      case "drive_wheel":
        camera.position.set(-5.0, 1.2, 3.2);
        controls.target.set(-3.2, 0.4, 0);
        break;
      case "top":
        camera.position.set(0, 13.0, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  useEffect(() => {
    void ensureGenericWasm().then((next) => setCrateSource(next));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [10.5, 7.0, 11.0],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Build procedural 3D model
    const model = buildMcCormickReaperModel();
    scene.add(model.rootGroup);

    // Animation Loop
    let reqId: number;
    let presentationStep = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const p = live.current;
      const elapsedSeconds = presentationStep / 60;
      presentationStep += 1;

      const wheelRadPerSec = p.groundWheelOmegaRadPerS;
      const reelRadPerSec = p.reelOmegaRadPerS;

      updateMcCormickReaperKinematics(
        model,
        wheelRadPerSec,
        reelRadPerSec,
        p.cutterOmegaRadPerS,
        elapsedSeconds,
        p.showStalks,
        p.isCutaway,
      );

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
    <div className="relative w-full h-[620px] bg-parchment-900 rounded-2xl overflow-hidden border border-parchment-700 shadow-2xl flex flex-col">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-parchment-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-parchment-100 uppercase tracking-wider">
            McCormick Reaper 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent X8277 (1834)
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-parchment-800 text-parchment-300 border border-parchment-700">
            host ratio estimate
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["sickle_guards", "Sickle Bar"],
              ["grain_reel", "Grain Reel"],
              ["platform", "Platform"],
              ["drive_wheel", "Drive Wheel"],
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
            title={isCutaway ? "Switch to Solid Platform" : "Switch to Platform Cutaway"}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              isCutaway
                ? "bg-amber-600/30 text-amber-300 border border-amber-500/40"
                : "text-parchment-400 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowStalks(!showStalks)}
            title="Toggle Wheat Stalks"
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              showStalks
                ? "bg-amber-600/30 text-amber-300 border border-amber-500/40"
                : "text-parchment-400 hover:text-white"
            }`}
          >
            {showStalks ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <StudioKernelChips
        visible
        title="McCormick cutter bar"
        chips={[
          { label: "Ground", value: String(groundSpeedMph), unit: "mph" },
          { label: "24-inch wheel", value: String(reaper.groundWheelRpm), unit: "rpm" },
          { label: "Crank", value: String(cutterCrankRpm), unit: "rpm" },
          { label: "Reel", value: String(reelRpm), unit: "rpm" },
          { label: "v", value: String(reaper.groundSpeedMps), unit: "m/s" },
          { label: "f_cut", value: String(reaper.cutterHz), unit: "Hz" },
          { label: "ω_cut", value: reaper.cutterOmegaRadPerS.toFixed(2), unit: "rad/s" },
          {
            label: "Reel crate",
            value: crateSource === "wasm" ? "fs-symmetry" : "ts-cyclic-fallback",
          },
        ]}
      />
    </div>
  );
}
