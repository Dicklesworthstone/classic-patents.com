"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX, Zap } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { stepGrammeDynamo } from "@/physics/catalogKernels";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildGrammeDynamoModel, updateGrammeDynamoKinematics } from "./grammeDynamoModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset =
  | "iso"
  | "ring_armature"
  | "collector_rods"
  | "pole_pieces"
  | "bearing_pedestal"
  | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [10.0, 7.5, 11.5], target: [0, 0, 0] },
  ring_armature: { pos: [0, 0.8, 4.2], target: [0, 0, 0] },
  collector_rods: { pos: [-2.8, 1.2, 3.2], target: [-1.4, 0, 0] },
  pole_pieces: { pos: [2.8, 2.5, 3.8], target: [1.2, 0, 0] },
  bearing_pedestal: { pos: [-4.5, 1.0, 2.5], target: [-3.8, -0.6, 0] },
  top: { pos: [0, 12.0, 0.1], target: [0, 0, 0] },
};

export const GrammeDynamo3D = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // The shared parameter map carries an explicitly illustrative shaft rate.
  const { params } = usePatentPhysics("us-120057-gramme-dynamo");
  const shaftRate = params.shaftRate ?? 1;
  const gramme = stepGrammeDynamo({ shaftRate });
  const [showMagneticFlux, setShowMagneticFlux] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [crateSource, setCrateSource] = useState(genericKernelSource());
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    shaftRate,
    inducedEmfIndex: gramme.inducedEmfIndex,
    showMagneticFlux,
    isAudioMuted,
    displayRadPerFrame: gramme.displayRadPerFrame,
    fluxOpacity: gramme.fluxOpacity,
    isCutaway,
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

    const { scene, camera, renderer } = studio;

    const { rootGroup, nodes, materials, dispose } = buildGrammeDynamoModel();
    scene.add(rootGroup);

    // Animation Loop
    let reqId: number;
    let timeSec = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const dt = 1 / 60;
      timeSec += dt;
      const p = live.current;

      updateGrammeDynamoKinematics(
        nodes,
        materials,
        dt,
        timeSec,
        p.shaftRate,
        p.inducedEmfIndex,
        p.displayRadPerFrame,
        p.fluxOpacity,
        p.showMagneticFlux,
        p.isCutaway ?? false,
      );

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
    <div className="relative w-full h-[620px] bg-parchment-900 rounded-2xl overflow-hidden border border-parchment-700 shadow-2xl flex flex-col">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-parchment-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-parchment-100 uppercase tracking-wider">
            Gramme Ring Dynamo 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 120,057 (1871)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["ring_armature", "Ring Armature"],
              ["collector_rods", "Junctions & Rubbers"],
              ["pole_pieces", "Field Poles"],
              ["bearing_pedestal", "Pedestals"],
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
            title={isCutaway ? "Solid Machine" : "Cutaway Frame"}
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
            onClick={() => setShowMagneticFlux(!showMagneticFlux)}
            title="Toggle Magnetic Flux"
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              showMagneticFlux
                ? "bg-amber-600/30 text-amber-300 border border-amber-500/40"
                : "text-parchment-400 hover:text-white"
            }`}
          >
            <Eye className="w-4 h-4" />
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
        title="Gramme ring collection"
        chips={[
          { label: "Shaft Rate", value: shaftRate.toFixed(1), unit: "relative" },
          { label: "Induced EMF", value: String(gramme.inducedEmfIndex), unit: "index" },
          { label: "Ring Bobbins", value: "36", unit: "wound" },
          { label: "Junctions", value: String(gramme.printedJunctionCount), unit: "printed" },
          {
            label: "Collection",
            value: String(gramme.collectionContinuityPct),
            unit: "% continuity",
          },
          { label: "Shaft Velocity", value: String(gramme.displayDegPerFrame), unit: "°/frame" },
          {
            label: "Ring crate",
            value: crateSource === "wasm" ? "fs-symmetry" : "ts-cyclic-fallback",
          },
          { label: "h₁", value: gramme.ringHarmonicH1.toFixed(3) },
        ]}
      />
      <p className="absolute bottom-3 left-4 right-4 z-10 rounded-lg border border-parchment-700/60 bg-parchment-950/80 px-3 py-2 text-xs text-parchment-200 backdrop-blur-md">
        Source-faithful explanatory mode: 36 joined bobbins, radial junction conductors, and
        collecting rubbers. US 120,057 established the continuous DC generation principle.
      </p>
    </div>
  );
});
