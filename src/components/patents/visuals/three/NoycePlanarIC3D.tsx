"use client";

import { Activity, Camera, EyeOff, Volume2, VolumeX, Zap } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { stepNoyceIC } from "@/physics/catalogKernels";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildNoycePlanarIcModel, updateNoycePlanarIcKinematics } from "./noycePlanarICModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

type CameraPreset =
  | "iso"
  | "metallization_layer"
  | "oxide_dielectric"
  | "pn_junctions"
  | "leadframe"
  | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [10, 8, 12], target: [0, 0, 0] },
  metallization_layer: { pos: [0, 3.5, 4.5], target: [0, 0.6, 0] },
  oxide_dielectric: { pos: [0, 2.2, 5.0], target: [0, 0.3, 0] },
  pn_junctions: { pos: [-2.2, 1.8, 3.5], target: [-1.0, 0.1, 0] },
  leadframe: { pos: [0, 4.5, 8.5], target: [0, -0.6, 0] },
  top: { pos: [0, 11.0, 0.1], target: [0, 0, 0] },
};

export const NoycePlanarIC3D = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Semiconductor Microfabrication Parameters
  const { params } = usePatentPhysics("us-2981877-noyce-ic");
  const reverseBias = params.reverseBias ?? params.supplyVoltageV ?? 5.0;
  const oxideThickness = params.oxideThickness ?? 0.5;
  const clockFrequencyMhz = params.clockFrequencyMhz ?? 10;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  const noyce = stepNoyceIC({
    reverseBias,
    oxideThickness,
    clockFrequencyMhz,
  });

  const live = useLiveSimParams({
    reverseBias,
    oxideThickness,
    clockFrequencyMhz,
    clockPeriodNs: noyce.clockPeriodNs,
    signalDisplaySpeed: noyce.signalDisplaySpeed,
    isCutaway,
  });

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const toggleSound = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  useEffect(() => {
    if (isPlayingAudio) {
      soundEngine.playContinuousTone(noyce.toneHz, "square", 0.02);
    } else {
      soundEngine.stopContinuousTone();
    }
    return () => {
      soundEngine.stopContinuousTone();
    };
  }, [isPlayingAudio, noyce.toneHz]);

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
    const { rootGroup, nodes, materials, dispose } = buildNoycePlanarIcModel();
    scene.add(rootGroup);

    // Animation Loop
    let reqId: number;
    let presentationStep = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = 1 / 60;
      const p = live.current;
      const elapsedSeconds = presentationStep / 60;
      presentationStep += 1;

      updateNoycePlanarIcKinematics(
        nodes,
        materials,
        delta,
        elapsedSeconds,
        p.signalDisplaySpeed,
        true,
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
    <div className="relative w-full h-[620px] bg-parchment-900 rounded-2xl overflow-hidden border border-parchment-700 shadow-2xl flex flex-col">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-parchment-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Activity className="w-4 h-4 text-sky-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-parchment-100 uppercase tracking-wider">
            Noyce Planar IC 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
            US Patent 2,981,877
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["metallization_layer", "Metal Layer"],
              ["oxide_dielectric", "Oxide Layer"],
              ["pn_junctions", "PN Junctions"],
              ["leadframe", "Leadframe"],
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
            title={isCutaway ? "Switch to Solid Silicon" : "Switch to Die Cutaway"}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              isCutaway
                ? "bg-amber-600/30 text-amber-300 border border-amber-500/40"
                : "text-parchment-400 hover:text-white"
            }`}
          >
            <EyeOff className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={toggleSound}
            title={isPlayingAudio ? "Mute Clock Tone" : "Play Clock Tone"}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            {isPlayingAudio ? (
              <Volume2 className="w-4 h-4 text-sky-400" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            <Zap className="w-4 h-4 text-sky-400" />
          </button>
        </div>
      </div>

      <StudioKernelChips
        visible={showUiOverlay}
        title="Noyce planar monolithic circuit kinetics"
        chips={[
          { label: "Clock Freq", value: `${clockFrequencyMhz}`, unit: "MHz" },
          { label: "Oxide Layer", value: `${noyce.oxideThicknessNm.toFixed(0)}`, unit: "nm" },
          {
            label: "Junction Cap",
            value: `${noyce.junctionCapPfPerMm2.toFixed(2)}`,
            unit: "pF/mm²",
          },
          { label: "Prop Delay", value: `${noyce.propDelayPs.toFixed(0)}`, unit: "ps" },
          { label: "Max Clock", value: `${noyce.maxClockGhz}`, unit: "GHz", tone: "ok" },
          {
            label: "Bus crate",
            value: crateSource === "wasm" ? "fs-la" : "ts-laplace-fallback",
          },
        ]}
      />
    </div>
  );
});
