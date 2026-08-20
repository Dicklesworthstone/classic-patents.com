"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepDeLavalSeparator } from "@/physics/catalogKernels";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildDeLavalSeparatorModel } from "./delavalSeparatorModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "centrifuge_bowl" | "conical_discs" | "outlet_spouts" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [9.5, 7.5, 11.0], target: [0, 0, 0] },
  centrifuge_bowl: { pos: [0, 1.8, 3.8], target: [0, 0.8, 0] },
  conical_discs: { pos: [2.2, 2.2, 2.8], target: [0, 0.8, 0] },
  outlet_spouts: { pos: [-2.5, 3.2, 3.0], target: [0, 2.2, 0] },
  top: { pos: [0, 12.0, 0.1], target: [0, 0, 0] },
};

export function DeLavalSeparator3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);

  // Centrifugal Separation Parameters
  const { params } = usePatentPhysics("us-247804-delaval-separator");
  const bowlRpm = params.bowlRpm ?? params.rotorRpm ?? 6500;
  const sep = stepDeLavalSeparator({
    bowlRpm,
    rawMilkFlowLph: params.rawMilkFlowLph ?? 300,
  });
  const centrifugalGs = sep.gForce;
  const throughputLitersPerHr = sep.creamFlowLph;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  const live = useLiveSimParams({
    bowlRpm,
    centrifugalGs,
    fatYieldPct: sep.fatYieldPct,
    creamFlowLph: sep.creamFlowLph,
    isAudioMuted,
    displayOmegaRadPerS: sep.displayOmegaRadPerS,
    bowlOmegaRadPerS: sep.bowlOmegaRadPerS,
    creamDropAdvancePerS: sep.creamDropAdvancePerS,
    pulleyDisplayOmegaRadPerS: sep.pulleyDisplayOmegaRadPerS,
    skimDropAdvancePerS: sep.skimDropAdvancePerS,
    creamDropOriginY: sep.creamDropOriginY,
    creamDropSpacing: sep.creamDropSpacing,
    creamDropWrap: sep.creamDropWrap,
    skimDropOriginY: sep.skimDropOriginY,
    skimDropSpacing: sep.skimDropSpacing,
    skimDropWrap: sep.skimDropWrap,
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

    // Build procedural 3D model
    const model = buildDeLavalSeparatorModel();
    scene.add(model.rootGroup);

    // Animation Loop
    let reqId: number;
    let elapsed = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = 1 / 60;
      elapsed += delta;
      const p = live.current;

      const omega = p.displayOmegaRadPerS ?? 0;
      model.bowlGroup.rotation.y += omega * delta;
      model.spindleGroup.rotation.y += omega * delta;
      model.pulleyGroup.rotation.y += p.pulleyDisplayOmegaRadPerS * delta;

      // Cream (inner) vs skim (outer) only when g-force is high enough to split
      const split = p.centrifugalGs > 2000;
      const creamSpeed = p.creamDropAdvancePerS;
      const skimSpeed = p.skimDropAdvancePerS;
      model.creamDrops.forEach((drop, i) => {
        drop.visible = split;
        drop.position.y =
          p.creamDropOriginY - ((elapsed * creamSpeed + i * p.creamDropSpacing) % p.creamDropWrap);
      });
      model.skimDrops.forEach((drop, i) => {
        drop.visible = split;
        drop.position.y =
          p.skimDropOriginY - ((elapsed * skimSpeed + i * p.skimDropSpacing) % p.skimDropWrap);
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      model.dispose();
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
            De Laval Separator 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 247,804 (1881)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["centrifuge_bowl", "Centrifuge Bowl"],
              ["conical_discs", "Conical Discs"],
              ["outlet_spouts", "Outlet Spouts"],
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
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            title={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            {showUiOverlay ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4 text-amber-400" />
            )}
          </button>
        </div>
      </div>

      <StudioKernelChips
        visible={showUiOverlay}
        title="De Laval centrifuge"
        chips={[
          { label: "Bowl", value: String(Math.round(bowlRpm)), unit: "rpm" },
          {
            label: "g",
            value: centrifugalGs.toLocaleString(),
            unit: "×g",
            tone: centrifugalGs > 2000 ? "ok" : "warn",
          },
          { label: "Fat yield", value: sep.fatYieldPct.toFixed(1), unit: "%" },
          { label: "Cream", value: throughputLitersPerHr.toFixed(1), unit: "L/h" },
          { label: "Skim", value: sep.skimFlowLph.toFixed(1), unit: "L/h" },
          { label: "ω", value: sep.bowlOmegaRadPerS.toFixed(0), unit: "rad/s" },
          { label: "ω×0.15", value: sep.displayOmegaRadPerS.toFixed(1), unit: "rad/s" },
          {
            label: "Cream crate",
            value: crateSource === "wasm" ? "fs-lbm" : "ts-fluid-fallback",
          },
        ]}
      />
    </div>
  );
}
