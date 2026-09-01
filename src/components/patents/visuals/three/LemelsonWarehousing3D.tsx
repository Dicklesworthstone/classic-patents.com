"use client";

import { Eye, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  type LemelsonWarehousingControls,
  readLemelsonWarehousingControls,
  stepLemelsonWarehousingSi,
} from "@/physics/lemelsonWarehousingKernel";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import {
  createLemelsonWarehousingModel,
  type LemelsonWarehousingModel,
} from "./lemelsonWarehousingModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";

export function LemelsonWarehousing3D({
  patentId = "us-3119501-lemelson-automatic-warehousing",
}: {
  patentId?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const modelRef = useRef<LemelsonWarehousingModel | null>(null);

  useFrankenSimPhysics(patentId);
  const { params, updateParam } = usePatentPhysics(patentId);

  const controls: LemelsonWarehousingControls = readLemelsonWarehousingControls(params);

  const liveControlsRef = useRef<LemelsonWarehousingControls>(controls);
  liveControlsRef.current = controls;

  const [cameraPreset, setCameraPreset] = useState<"aisle" | "overhead" | "forks" | "bay">("aisle");

  const [simTime, setSimTime] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    let destroyed = false;
    let animFrameId: number;

    const studio = createThreeStudioScene({
      container: containerRef.current,
      cameraPos: [7, 5, 8],
      targetPos: [0, 2.5, 0],
      ambientIntensity: 0.8,
      sunIntensity: 1.6,
    });
    studioRef.current = studio;

    const model = createLemelsonWarehousingModel();
    modelRef.current = model;
    studio.scene.add(model.group);

    let lastTime = 0;

    const loop = (timeMs: number) => {
      if (destroyed) return;
      const dt = lastTime === 0 ? 0.016 : Math.min(0.05, (timeMs - lastTime) / 1000);
      lastTime = timeMs;

      setSimTime((prev) => {
        const next = prev + dt;
        const currentControls = liveControlsRef.current;
        const currentTel = stepLemelsonWarehousingSi(currentControls, next);
        model.update(currentTel);
        return next;
      });

      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
      animFrameId = requestAnimationFrame(loop);
    };

    animFrameId = requestAnimationFrame(loop);

    return () => {
      destroyed = true;
      cancelAnimationFrame(animFrameId);
      studio.scene.remove(model.group);
      model.dispose();
      studio.dispose();
      studioRef.current = null;
      modelRef.current = null;
    };
  }, []);

  const handleCameraPreset = (preset: "aisle" | "overhead" | "forks" | "bay") => {
    setCameraPreset(preset);
    const studio = studioRef.current;
    if (!studio) return;

    switch (preset) {
      case "aisle":
        studio.camera.position.set(7, 4.5, 8);
        studio.controls.target.set(0, 2.5, 0);
        break;
      case "overhead":
        studio.camera.position.set(0, 11, 0.1);
        studio.controls.target.set(0, 0, 0);
        break;
      case "forks":
        studio.camera.position.set(2, 3, 3);
        studio.controls.target.set(0, 2.5, 0);
        break;
      case "bay":
        studio.camera.position.set(5, 3, -4);
        studio.controls.target.set(3, 2, 0);
        break;
    }
    studio.controls.update();
  };

  const currentTel = stepLemelsonWarehousingSi(controls, simTime);

  return (
    <div className="flex flex-col w-full bg-stone-950 text-stone-100 rounded-xl border border-stone-800 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
              3D WebGL Studio • US 3,119,501
            </span>
          </div>
          <h3 className="text-xl font-serif font-bold text-stone-100 mt-1">
            Lemelson High-Density Automated Storage & Retrieval Studio
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(["aisle", "overhead", "forks", "bay"] as const).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handleCameraPreset(preset)}
              className={`px-3 py-1.5 rounded text-xs font-mono capitalize transition-colors ${
                cameraPreset === preset
                  ? "bg-amber-500 text-stone-950 font-bold"
                  : "bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-700"
              }`}
            >
              {preset} View
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSimTime(0)}
            className="flex items-center gap-1 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 border border-stone-700 rounded text-xs font-mono text-stone-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div className="relative w-full aspect-[16/9] bg-stone-900/40 rounded-lg border border-stone-800 overflow-hidden">
        <div ref={containerRef} className="w-full h-full" />

        {/* HUD Inset */}
        <div className="absolute bottom-4 left-4 bg-stone-950/90 border border-stone-800 rounded-lg p-3 backdrop-blur-sm space-y-1 font-mono text-xs">
          <div className="flex justify-between gap-6 text-stone-400">
            <span>Cycle Stage:</span>
            <span className="text-amber-400 font-bold">{currentTel.cyclePhaseName}</span>
          </div>
          <div className="flex justify-between gap-6 text-stone-400">
            <span>Active Drive:</span>
            <span className="text-cyan-400 font-bold">{currentTel.activeMotor}</span>
          </div>
          <div className="flex justify-between gap-6 text-stone-400">
            <span>PrCx (Aisle):</span>
            <span className="text-emerald-400 font-bold">{currentTel.counterPrCx} counts</span>
          </div>
          <div className="flex justify-between gap-6 text-stone-400">
            <span>PrCz (Shelf):</span>
            <span className="text-purple-400 font-bold">{currentTel.counterPrCz} counts</span>
          </div>
        </div>
      </div>

      {/* Real-Time Parameter Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-stone-900/60 p-4 rounded-lg border border-stone-800/80">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-stone-400">Target Bay X:</span>
            <span className="text-amber-400 font-bold">Bay {controls.targetBayX}</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={controls.targetBayX}
            onChange={(e) => updateParam("targetBayX", Number(e.target.value))}
            className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-stone-400">Target Level Z:</span>
            <span className="text-amber-400 font-bold">Tier {controls.targetShelfZ}</span>
          </div>
          <input
            type="range"
            min="1"
            max="6"
            step="1"
            value={controls.targetShelfZ}
            onChange={(e) => updateParam("targetShelfZ", Number(e.target.value))}
            className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-stone-400">Traverse Speed:</span>
            <span className="text-cyan-400 font-bold">{controls.traverseSpeed.toFixed(1)} m/s</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.1"
            value={controls.traverseSpeed}
            onChange={(e) => updateParam("traverseSpeed", Number(e.target.value))}
            className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-stone-400">Hoist Speed:</span>
            <span className="text-emerald-400 font-bold">{controls.hoistSpeed.toFixed(1)} m/s</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="1.2"
            step="0.1"
            value={controls.hoistSpeed}
            onChange={(e) => updateParam("hoistSpeed", Number(e.target.value))}
            className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>
      </div>
    </div>
  );
}

export default LemelsonWarehousing3D;
