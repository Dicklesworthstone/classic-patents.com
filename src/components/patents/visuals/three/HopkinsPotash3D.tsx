"use client";

import { Activity, Camera, Eye, EyeOff, Layers, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import { stepHopkinsPotash } from "@/physics/hopkinsPotashKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { animateHopkinsPotashModel, buildHopkinsPotashModel } from "./hopkinsPotashModel";
import { type KernelChip, StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "furnace" | "leaching" | "crystallizer" | "ingot" | "top";

export function HopkinsPotash3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const patentId = "us-x1-hopkins-potash";

  const { params } = usePatentPhysics(patentId);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const roastTempC = params.roastTempC ?? 750;
  const roastTimeHours = params.roastTimeHours ?? 2.5;
  const ashBatchKg = params.ashBatchKg ?? 200;
  const waterTempC = params.waterTempC ?? 80;

  const pot = stepHopkinsPotash({
    roastTempC,
    roastTimeHours,
    ashBatchKg,
    waterTempC,
  });

  const live = useLiveSimParams({
    roastTempC,
    roastTimeHours,
    ashBatchKg,
    waterTempC,
    isCutaway,
    isAudioMuted,
    decarbonizationPct: pot.decarbonizationPct,
    pearlAshYieldKg: pot.pearlAshYieldKg,
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
        camera.position.set(4.5, 3.2, 4.8);
        controls.target.set(0, 0.5, 0);
        break;
      case "furnace":
        camera.position.set(-1.6, 1.4, 2.5);
        controls.target.set(-1.6, 0.6, 0);
        break;
      case "leaching":
        camera.position.set(-0.4, 1.3, 2.2);
        controls.target.set(-0.4, 0.5, 0);
        break;
      case "crystallizer":
        camera.position.set(0.8, 1.4, 2.2);
        controls.target.set(0.8, 0.5, 0);
        break;
      case "ingot":
        camera.position.set(1.8, 1.0, 1.8);
        controls.target.set(1.8, 0.25, 0);
        break;
      case "top":
        camera.position.set(0, 6.0, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [4.5, 3.2, 4.8],
      targetPos: [0, 0.5, 0],
      fov: 45,
    });

    controlsRef.current = studio.controls;
    cameraRef.current = studio.camera;

    const modelResult = buildHopkinsPotashModel();
    studio.scene.add(modelResult.rootGroup);

    let animId: number;

    const animate = (now: number) => {
      animId = requestAnimationFrame(animate);
      const timeS = now / 1000;
      const p = live.current;

      animateHopkinsPotashModel(
        modelResult,
        {
          roastTempC: p.roastTempC,
          roastTimeHours: p.roastTimeHours,
          ashBatchKg: p.ashBatchKg,
          waterTempC: p.waterTempC,
        },
        timeS,
      );

      modelResult.nodes.furnaceArch.visible = !p.isCutaway;
      studio.renderer.render(studio.scene, studio.camera);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      modelResult.dispose();
      studio.cleanup();
    };
  }, [live]);

  const kernelChips: KernelChip[] = [
    {
      label: "Decarbonization",
      value: `${pot.decarbonizationPct.toFixed(1)}%`,
      tone: pot.decarbonizationPct > 80 ? "ok" : "warn",
    },
    {
      label: "Pearl Ash Yield",
      value: `${pot.pearlAshYieldKg.toFixed(1)} kg`,
      tone: "hot",
    },
    {
      label: "Purity",
      value: `${pot.pearlAshPurityPct.toFixed(1)}%`,
      tone: "ok",
    },
    {
      label: "Ley Density",
      value: `${pot.leyDensityKgM3.toFixed(0)} kg/m³`,
    },
  ];

  return (
    <div className="relative w-full h-[620px] bg-parchment-900 rounded-2xl overflow-hidden border border-parchment-700 shadow-2xl flex flex-col">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Header & Presets Toolbar */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-parchment-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-parchment-100 uppercase tracking-wider">
            Hopkins Pot & Pearl Ash Facility
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent No. 1 [X1] (1790)
          </span>
        </div>

        {/* Camera Views Bar */}
        <div className="flex items-center gap-1 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-0.5" />
          {(
            [
              ["iso", "Overview"],
              ["furnace", "Kiln (Stage 1)"],
              ["leaching", "Tub (Stage 2)"],
              ["crystallizer", "Pot (Stage 3)"],
              ["ingot", "Ingot (Stage 4)"],
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

        {/* Action Toggles */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            className={`p-2 rounded-lg text-xs font-medium border backdrop-blur-md transition-colors ${
              isCutaway
                ? "bg-amber-600 border-amber-400 text-white"
                : "bg-ink-900/80 border-parchment-700/30 text-parchment-300 hover:bg-ink-800"
            }`}
            title="Toggle Cutaway View"
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={toggleEngine}
            className="p-2 rounded-lg text-xs font-medium bg-ink-900/80 border border-parchment-700/30 text-parchment-300 hover:bg-ink-800 backdrop-blur-md transition-colors"
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className="p-2 rounded-lg text-xs font-medium bg-ink-900/80 border border-parchment-700/30 text-parchment-300 hover:bg-ink-800 backdrop-blur-md transition-colors"
            title="Toggle Overlay UI"
          >
            {showUiOverlay ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Physics Chips */}
      <StudioKernelChips
        visible={showUiOverlay}
        title="Arrhenius Calcination & Leaching Yield"
        chips={kernelChips}
        side="left"
      />
    </div>
  );
}
