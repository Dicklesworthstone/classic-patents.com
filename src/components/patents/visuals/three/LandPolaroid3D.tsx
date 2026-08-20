"use client";

import { Zap } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { createLandPolaroidModel, type LandPolaroidModelNodes } from "./landPolaroidModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

interface LandPolaroid3DProps {
  className?: string;
}

type CameraPreset = "overview" | "rollers" | "pod" | "print";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { label: string; pos: [number, number, number]; target: [number, number, number] }
> = {
  overview: {
    label: "Instant Camera & Film Overview",
    pos: [3.5, 5.0, 7.5],
    target: [0.5, 0, 1.2],
  },
  rollers: {
    label: "Nip Pressure Rollers",
    pos: [1.8, 2.2, 2.5],
    target: [0.6, 0, 0],
  },
  pod: {
    label: "Rupturable Reagent Pod",
    pos: [0.6, 2.5, 1.5],
    target: [0.6, 0, -0.6],
  },
  print: {
    label: "Developing Positive Print",
    pos: [3.5, 2.8, 4.5],
    target: [2.4, 0, 2.8],
  },
};

export const LandPolaroid3D: React.FC<LandPolaroid3DProps> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const modelRef = useRef<LandPolaroidModelNodes | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);

  const { params } = usePatentPhysics("us-2543181-land-polaroid");
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("overview");

  const live = useLiveSimParams({
    developmentTimeSec: params.developmentTimeSec ?? 30,
    exposureFraction: params.exposureFraction ?? 0.6,
    reagentViscosityCp: params.reagentViscosityCp ?? 25000,
    rollerGapUm: params.rollerGapUm ?? 25,
    alkaliPh: params.alkaliPh ?? 12.6,
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

    const model = createLandPolaroidModel(live.current);
    modelRef.current = model;
    studio.scene.add(model.group);

    const animate = () => {
      timeRef.current += 0.016;
      studio.controls.update();
      model.update(timeRef.current, live.current);
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

      {/* Preset Camera Selector */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-1.5 bg-slate-900/90 p-1.5 rounded-lg border border-slate-800 backdrop-blur-sm">
        {(Object.keys(CAMERA_PRESETS) as CameraPreset[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => handlePresetChange(key)}
            className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors ${
              cameraPreset === key
                ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500"
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
          <Zap className={`w-4 h-4 ${showUiOverlay ? "text-emerald-400" : "text-slate-500"}`} />
        </button>
      </div>

      {/* Historic Model 95 Banner */}
      {showUiOverlay && (
        <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 px-3 py-2 rounded-lg border border-slate-800 backdrop-blur-sm pointer-events-none">
          <div className="text-xs font-mono font-semibold text-emerald-400">
            US 2,543,181 — Edwin Land Polaroid Instant Film & Camera
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            Diffusion Transfer Reversal with Rupturable Foil Pod & Squeegee Rollers
          </div>
        </div>
      )}
    </div>
  );
};
