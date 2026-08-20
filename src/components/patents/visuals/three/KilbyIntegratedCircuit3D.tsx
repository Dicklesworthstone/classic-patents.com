"use client";

import { Zap } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { createKilbyIntegratedCircuitModel, type KilbyModel } from "./kilbyIntegratedCircuitModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

interface Kilby3DProps {
  className?: string;
}

type CameraPreset = "overview" | "transistors" | "wireBonds" | "capacitor";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { label: string; pos: [number, number, number]; target: [number, number, number] }
> = {
  overview: {
    label: "Monolithic Die Overview",
    pos: [0, 6.5, 9.0],
    target: [0, 0.4, 0],
  },
  transistors: {
    label: "Mesa Transistors (T1/T2)",
    pos: [-1.8, 2.5, 3.5],
    target: [-1.8, 0.6, 0],
  },
  wireBonds: {
    label: "Gold Flying Wire Bonds",
    pos: [0, 2.0, 4.0],
    target: [0, 0.8, 0.5],
  },
  capacitor: {
    label: "P-N Junction Capacitor",
    pos: [0, 2.8, 3.0],
    target: [0, 0.6, 0.6],
  },
};

export const KilbyIntegratedCircuit3D: React.FC<Kilby3DProps> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const modelRef = useRef<KilbyModel | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);

  const { params } = usePatentPhysics("us-3138743-kilby-integrated-circuit");

  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("overview");

  const live = useLiveSimParams({
    supplyVoltageV: params.supplyVoltageV ?? 6.0,
    resistorLengthUm: params.resistorLengthUm ?? 500,
    resistorWidthUm: params.resistorWidthUm ?? 50,
    reverseBiasVoltageV: params.reverseBiasVoltageV ?? 3.0,
    baseDriveCurrentUa: params.baseDriveCurrentUa ?? 40,
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

    const model = createKilbyIntegratedCircuitModel({
      substrateMaterial: "germanium",
      ...live.current,
    });
    modelRef.current = model;
    studio.scene.add(model.group);

    const animate = () => {
      timeRef.current += 0.016;
      studio.controls.update();

      model.update(timeRef.current, {
        substrateMaterial: "germanium",
        ...live.current,
      });

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

      {/* Historic Monolithic Microchip Banner */}
      {showUiOverlay && (
        <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 px-3 py-2 rounded-lg border border-slate-800 backdrop-blur-sm pointer-events-none">
          <div className="text-xs font-mono font-semibold text-amber-400">
            US 3,138,743 — Jack Kilby Monolithic Solid Circuit
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            Single-Crystal Germanium Bar with Mesa Transistors & Gold Flying Wires
          </div>
        </div>
      )}
    </div>
  );
};
