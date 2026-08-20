"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { stepMergenthalerLinotype } from "@/physics/machineKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import {
  buildMergenthalerLinotypeModel,
  updateMergenthalerLinotypeKinematics,
} from "./mergenthalerLinotypeModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset =
  | "iso"
  | "matrix_magazine"
  | "casting_pot"
  | "spaceband_justifier"
  | "keyboard"
  | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [11.0, 8.5, 12.5], target: [0, 0, 0] },
  matrix_magazine: { pos: [0, 4.2, 3.8], target: [0, 2.2, 0] },
  casting_pot: { pos: [-2.8, 0.5, 3.5], target: [-1.5, -0.4, 0] },
  spaceband_justifier: { pos: [0, 0.8, 3.2], target: [0, 0.2, 0] },
  keyboard: { pos: [0, 1.2, 3.4], target: [0, -0.6, 1.4] },
  top: { pos: [0, 14.0, 0.1], target: [0, 0, 0] },
};

export function MergenthalerLinotype3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // Linotype Mechanical Composing Parameters
  const { params } = usePatentPhysics("us-313224-mergenthaler-linotype");
  const matrixRate = params.matrixRate ?? 60;
  const spacebandWedge = params.spacebandWedge ?? 6.5;
  const potTempC = params.potTemp ?? 260;
  const linotypeIdle = stepMergenthalerLinotype({
    matrixRatePerMin: matrixRate,
    spacebandWedgeMm: spacebandWedge,
    potTempC,
  });
  const castingLpm = linotypeIdle.linesPerMin;
  const charsPerHour = linotypeIdle.charsPerHour;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  const live = useLiveSimParams({
    matrixRate,
    spacebandWedge,
    potTempC,
    isAudioMuted,
    isCutaway,
  });

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

    const { rootGroup, nodes, materials, dispose } = buildMergenthalerLinotypeModel();
    scene.add(rootGroup);

    // Animation Loop
    let reqId: number;
    let timeSec = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      controls.update();
      const dt = 1 / 60;
      timeSec += dt;
      const p = live.current;

      const step = stepMergenthalerLinotype({
        matrixRatePerMin: p.matrixRate,
        spacebandWedgeMm: p.spacebandWedge,
        potTempC: p.potTempC,
        elapsedS: timeSec,
      });

      // Update cutaway transparency on metal pot
      materials.castIron.opacity = p.isCutaway ? 0.35 : 1.0;
      materials.castIron.transparent = p.isCutaway;

      updateMergenthalerLinotypeKinematics(
        nodes,
        materials,
        dt,
        timeSec,
        step.plungerY,
        step.moldAngle,
        step.slugOut,
        step.wedgeLift,
        p.matrixRate,
        p.spacebandWedge,
        p.potTempC,
      );

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
          <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-parchment-100 uppercase tracking-wider">
            Mergenthaler Linotype 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 313,224 (1885)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["matrix_magazine", "Magazine"],
              ["casting_pot", "Casting Pot"],
              ["spaceband_justifier", "Spacebands"],
              ["keyboard", "Keyboard"],
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
            title={isCutaway ? "Solid Castings" : "Cutaway Frame & Pot"}
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
        title="Mergenthaler hot-metal linecaster"
        chips={[
          { label: "Lines", value: castingLpm.toFixed(1), unit: "lpm" },
          { label: "Throughput", value: String(charsPerHour), unit: "char/hr" },
          { label: "Wedge", value: String(spacebandWedge), unit: "mm" },
          { label: "Pot", value: String(Math.round(potTempC)), unit: "°C" },
          { label: "Width", value: String(linotypeIdle.justificationWidthMm), unit: "mm" },
          { label: "Solid", value: String(linotypeIdle.solidificationTimeMs), unit: "ms" },
          { label: "Hardness", value: String(linotypeIdle.brinellHardness), unit: "HB" },
          { label: "Dist", value: String(linotypeIdle.distributorFreqHz), unit: "Hz" },
          {
            label: "Mag crate",
            value: crateSource === "wasm" ? "fs-symmetry" : "ts-cyclic-fallback",
          },
        ]}
      />
    </div>
  );
}
