"use client";

import { Zap } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { stepRillieuxEvaporator } from "@/physics/rillieuxEvaporatorKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import {
  createRillieuxEvaporatorModel,
  type RillieuxEvaporatorModelNodes,
} from "./rillieuxEvaporatorModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

interface Rillieux3DProps {
  className?: string;
}

type CameraPreset = "overview" | "pan1" | "pan2" | "pan3" | "condenser";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { label: string; pos: [number, number, number]; target: [number, number, number] }
> = {
  overview: {
    label: "3-Effect Cascade Overview",
    pos: [0, 8.0, 14.0],
    target: [0, 2.0, 0],
  },
  pan1: {
    label: "Effect 1 (Atmospheric)",
    pos: [-4.5, 4.0, 6.0],
    target: [-4.5, 2.0, 0],
  },
  pan2: {
    label: "Effect 2 (Mid Vacuum)",
    pos: [0, 4.0, 6.0],
    target: [0, 2.0, 0],
  },
  pan3: {
    label: "Effect 3 (High Vacuum)",
    pos: [4.5, 4.0, 6.0],
    target: [4.5, 2.0, 0],
  },
  condenser: {
    label: "Barometric Condenser",
    pos: [7.0, 5.0, 5.0],
    target: [6.5, 3.0, 0],
  },
};

export const RillieuxEvaporator3D: React.FC<Rillieux3DProps> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const modelRef = useRef<RillieuxEvaporatorModelNodes | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("overview");

  const { params } = usePatentPhysics("us-3237-rillieux-evaporator");

  const live = useLiveSimParams({
    juiceFeedRateKgPerH: params.juiceFeedRateKgPerH ?? 10000,
    initialBrixDeg: params.initialBrixDeg ?? 14,
    targetBrixDeg: params.targetBrixDeg ?? 65,
    numberOfEffects: params.numberOfEffects ?? 3,
  });

  const handlePresetChange = (preset: CameraPreset) => {
    setCameraPreset(preset);
    const targetConfig = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(targetConfig.pos, targetConfig.target);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const overview = CAMERA_PRESETS.overview;
    const studio = createThreeStudioScene({
      container,
      cameraPos: overview.pos,
      targetPos: overview.target,
      environmentStyle: "studio",
    });
    studioRef.current = studio;

    const model = createRillieuxEvaporatorModel();
    modelRef.current = model;
    studio.scene.add(model.group);

    const animate = () => {
      timeRef.current += 0.016;
      studio.controls.update();

      const p = live.current;
      const state = stepRillieuxEvaporator({
        juiceFeedRateKgPerH: p.juiceFeedRateKgPerH,
        initialBrixDeg: p.initialBrixDeg,
        targetBrixDeg: p.targetBrixDeg,
        numberOfEffects: p.numberOfEffects,
      });

      model.update(state, timeRef.current);

      studio.renderer.render(studio.scene, studio.camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      model.dispose();
      studio.dispose();
      studioRef.current = null;
      modelRef.current = null;
    };
  }, [live]);

  return (
    <div
      className={`relative w-full h-[520px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 ${className}`}
    >
      <div ref={containerRef} className="w-full h-full" />

      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-1.5 bg-slate-900/90 p-1.5 rounded-lg border border-slate-800 backdrop-blur-sm">
        {(Object.keys(CAMERA_PRESETS) as CameraPreset[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => handlePresetChange(key)}
            className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors ${
              cameraPreset === key
                ? "bg-amber-950/80 text-amber-300 border border-amber-500"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            {CAMERA_PRESETS[key].label}
          </button>
        ))}
      </div>

      <div className="absolute top-4 right-4 z-10">
        <button
          type="button"
          onClick={() => setShowUiOverlay(!showUiOverlay)}
          title={showUiOverlay ? "Hide HUD" : "Show HUD"}
          className="p-1.5 rounded-lg text-xs bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800 transition-colors backdrop-blur-sm"
        >
          <Zap className={`w-4 h-4 ${showUiOverlay ? "text-amber-400" : "text-slate-500"}`} />
        </button>
      </div>

      {showUiOverlay && (
        <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 px-3 py-2 rounded-lg border border-slate-800 backdrop-blur-sm pointer-events-none">
          <div className="text-xs font-mono font-semibold text-amber-400">
            US 3,237 — Norbert Rillieux Multiple-Effect Evaporator
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            Triple-Effect Latent Heat Recovery Calandria Cascade
          </div>
        </div>
      )}
    </div>
  );
};
