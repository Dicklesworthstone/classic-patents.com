"use client";

import { Activity, Camera, Eye, EyeOff, Flame, Volume2, VolumeX, Zap } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import { stepNobelDynamite } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildNobelDynamiteModel, updateNobelDynamiteKinematics } from "./nobelDynamiteModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "blasting_cap" | "matrix_cutaway" | "fuse" | "detonation_wave" | "top";

export const NobelDynamite3D = memo(function NobelDynamite3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // Chemical Explosives Parameters
  const { params } = usePatentPhysics("us-78317-nobel-dynamite");
  const ngPercentage = params.ngConcentrationPct ?? params.ngConcentration ?? 75;
  const nobel = stepNobelDynamite({
    ngConcentrationPct: ngPercentage,
    capEnergyJoules: params.capEnergyJoules ?? 1.2,
  });
  const detonationVelocityMps = nobel.detonationVelocityMps;
  const [isFuseLit, setIsFuseLit] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const fuseTimerRef = useRef<number | null>(null);

  const live = useLiveSimParams({
    ngPercentage,
    detonationVelocityMps,
    isFuseLit,
    shockwaveGlow: nobel.shockwaveGlow,
    stickDisplayOmegaRadPerS: nobel.stickDisplayOmegaRadPerS,
    isAudioMuted,
    isCutaway,
    blastOverpressureMpa: nobel.blastOverpressureMpa,
    isInitiated: nobel.isInitiated ? 1 : 0,
    chargeTransitUs: nobel.chargeTransitUs,
    flashDisplayMs: nobel.flashDisplayMs,
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
        camera.position.set(8.5, 6.0, 9.5);
        controls.target.set(0, 0, 0);
        break;
      case "blasting_cap":
        camera.position.set(0, 3.2, 3.0);
        controls.target.set(0, 2.0, 0);
        break;
      case "matrix_cutaway":
        camera.position.set(0, 0, 3.5);
        controls.target.set(0, 0, 0);
        break;
      case "fuse":
        camera.position.set(0, 4.8, 2.5);
        controls.target.set(0, 3.5, 0);
        break;
      case "detonation_wave":
        camera.position.set(3.5, 2.0, 4.5);
        controls.target.set(0, 0, 0);
        break;
      case "top":
        camera.position.set(0, 11.0, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const igniteFuse = () => {
    setIsFuseLit(true);
    if (!isAudioMuted) {
      soundEngine.playSwitchClick();
    }
    if (fuseTimerRef.current !== null) {
      window.clearTimeout(fuseTimerRef.current);
    }
    fuseTimerRef.current = window.setTimeout(() => {
      setIsFuseLit(false);
    }, nobel.flashDisplayMs);
  };

  useEffect(() => {
    return () => {
      if (fuseTimerRef.current !== null) {
        window.clearTimeout(fuseTimerRef.current);
      }
    };
  }, []);

  const toggleSound = () => {
    toggleEngine(() => {
      soundEngine.playSwitchClick();
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [8.5, 6.0, 9.5],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    const { rootGroup, nodes, materials, dispose } = buildNobelDynamiteModel();
    scene.add(rootGroup);

    // Animation Loop
    let reqId: number;
    let timeSec = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const dt = 1 / 60;
      timeSec += dt;
      const p = live.current;

      updateNobelDynamiteKinematics(
        nodes,
        materials,
        dt,
        timeSec,
        p.isFuseLit,
        p.shockwaveGlow,
        p.stickDisplayOmegaRadPerS,
        p.isCutaway,
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
            Nobel Dynamite 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 78,317 (1868)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["blasting_cap", "Blasting Cap"],
              ["matrix_cutaway", "Kieselguhr Matrix"],
              ["fuse", "Safety Fuse"],
              ["detonation_wave", "Shockwave"],
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
            onClick={igniteFuse}
            disabled={isFuseLit}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-sans rounded-lg transition-colors ${
              isFuseLit
                ? "bg-red-600 text-white animate-pulse"
                : "bg-amber-600/30 text-amber-200 border border-amber-500/40 hover:bg-amber-600/50"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>{isFuseLit ? "DETONATING" : "Ignite Fuse"}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Solid Cartridge" : "Cutaway Interior"}
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
        title="Nobel dynamite detonation physics"
        chips={[
          { label: "NG Loading", value: String(ngPercentage), unit: "%" },
          { label: "Detonation Velocity", value: String(detonationVelocityMps), unit: "m/s" },
          { label: "Blast Overpressure", value: String(nobel.blastOverpressureMpa), unit: "MPa" },
          { label: "Specific Energy", value: String(nobel.energyMjPerKg), unit: "MJ/kg" },
          { label: "Cap Energy", value: String(nobel.capEnergyJoules ?? 1.2), unit: "J" },
          { label: "Transit Time", value: nobel.chargeTransitUs.toFixed(1), unit: "µs" },
          { label: "Explosive State", value: isFuseLit ? "DETONATION" : "STABLE" },
        ]}
      />
    </div>
  );
});
