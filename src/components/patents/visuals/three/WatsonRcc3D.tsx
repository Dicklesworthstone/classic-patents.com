"use client";

import { Eye, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import {
  readWatsonRccControls,
  stepWatsonRccSi,
  type WatsonRccControls,
  type WatsonRccTelemetry,
} from "@/physics/watsonRccKernel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import {
  buildWatsonRccModel,
  updateWatsonRccKinematics,
  type WatsonRccModel,
} from "./watsonRccModel";

export function WatsonRcc3D({ patentId = "us-4098001-watson-rcc" }: { patentId?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const modelRef = useRef<WatsonRccModel | null>(null);

  useFrankenSimPhysics(patentId);
  const { params, updateParam, resetParams } = usePatentPhysics(patentId);

  const controls: WatsonRccControls = readWatsonRccControls(params);
  const tel: WatsonRccTelemetry = stepWatsonRccSi(controls);

  const liveControlsRef = useRef<WatsonRccControls>(controls);
  liveControlsRef.current = controls;

  const liveTelRef = useRef<WatsonRccTelemetry>(tel);
  liveTelRef.current = tel;

  const [cameraPreset, setCameraPreset] = useState<"perspective" | "side" | "focal" | "insertion">(
    "perspective",
  );

  useEffect(() => {
    if (!containerRef.current) return;

    let destroyed = false;
    let animFrameId: number;

    const studio = createThreeStudioScene({
      container: containerRef.current,
      cameraPos: [0.6, 0.35, 0.7],
      targetPos: [0, 0.15, 0],
      ambientIntensity: 0.7,
      sunIntensity: 1.5,
    });
    studioRef.current = studio;

    const model = buildWatsonRccModel();
    modelRef.current = model;
    studio.scene.add(model.root);

    const loop = () => {
      if (destroyed) return;

      updateWatsonRccKinematics(model, liveControlsRef.current, liveTelRef.current);

      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
      animFrameId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      destroyed = true;
      cancelAnimationFrame(animFrameId);
      if (modelRef.current) {
        studio.scene.remove(modelRef.current.root);
        modelRef.current.dispose();
      }
      studio.dispose();
    };
  }, []);

  const handleCameraPreset = (preset: "perspective" | "side" | "focal" | "insertion") => {
    setCameraPreset(preset);
    if (!studioRef.current) return;
    const { camera, controls: orbitControls } = studioRef.current;

    switch (preset) {
      case "perspective":
        camera.position.set(0.6, 0.35, 0.7);
        orbitControls.target.set(0, 0.15, 0);
        break;
      case "side":
        camera.position.set(0.75, 0.2, 0);
        orbitControls.target.set(0, 0.15, 0);
        break;
      case "focal":
        camera.position.set(0.35, 0.08, 0.4);
        orbitControls.target.set(0, 0.04, 0);
        break;
      case "insertion":
        camera.position.set(0.2, -0.05, 0.3);
        orbitControls.target.set(0, -0.02, 0);
        break;
    }
    orbitControls.update();
  };

  return (
    <div className="w-full bg-parchment-50 dark:bg-ink-950 rounded-2xl border border-parchment-300 dark:border-ink-800 p-6 flex flex-col items-center space-y-6 shadow-patent">
      {/* 3D Visual Header */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-parchment-200 dark:border-ink-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
              3D WEBGL STUDIO
            </span>
            <span className="text-xs font-mono text-ink-500 dark:text-parchment-400">
              US 4,098,001 · Watson RCC Flexure Kinematics
            </span>
          </div>
          <h3 className="text-xl font-display font-bold text-ink-900 dark:text-parchment-100 mt-1">
            Remote Center Compliance 3D Visual Model
          </h3>
        </div>

        {/* Camera View Presets */}
        <div className="flex flex-wrap items-center gap-2">
          {(["perspective", "side", "focal", "insertion"] as const).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handleCameraPreset(preset)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                cameraPreset === preset
                  ? "bg-cyan-600 text-white shadow"
                  : "bg-parchment-100 dark:bg-ink-800 text-ink-700 dark:text-parchment-300 border border-parchment-300 dark:border-ink-700 hover:bg-parchment-200 dark:hover:bg-ink-700"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="capitalize">{preset}</span>
            </button>
          ))}

          <button
            type="button"
            onClick={resetParams}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded-lg border border-parchment-300 dark:border-ink-700 bg-parchment-100 dark:bg-ink-800 text-ink-700 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-ink-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-[460px] bg-slate-950 rounded-xl border border-parchment-300 dark:border-ink-800 overflow-hidden shadow-inner cursor-grab active:cursor-grabbing relative"
      >
        {/* HUD Telemetry Overlay */}
        <div className="absolute top-4 left-4 z-10 bg-ink-950/80 backdrop-blur border border-ink-800 rounded-lg p-3 text-xs font-mono space-y-1 pointer-events-none">
          <div className="text-cyan-400 font-bold">RCC SPATIAL TELEMETRY</div>
          <div className="text-parchment-300">
            Tip Deflection δ_x:{" "}
            <span className="text-emerald-400 font-bold">
              {tel.tipLateralDisplacementMm.toFixed(2)} mm
            </span>
          </div>
          <div className="text-parchment-300">
            Peg Tilt θ_y:{" "}
            <span className="text-amber-400 font-bold">{tel.pegTiltAngleDeg.toFixed(2)}°</span>
          </div>
          <div className="text-parchment-300">
            Remote Center L_rcc:{" "}
            <span className="text-cyan-400 font-bold">
              {(tel.remoteCenterDistanceM * 1000).toFixed(0)} mm
            </span>
          </div>
          <div className="text-parchment-300">
            Jamming Risk:{" "}
            <span
              className={
                tel.jammingIndex >= 1.0
                  ? "text-rose-400 font-bold"
                  : tel.jammingIndex > 0.35
                    ? "text-amber-400 font-bold"
                    : "text-emerald-400 font-bold"
              }
            >
              {tel.jammingIndex.toFixed(2)} ({tel.insertionState.toUpperCase()})
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 bg-parchment-100 dark:bg-ink-900 p-4 rounded-xl border border-parchment-200 dark:border-ink-800">
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-ink-600 dark:text-parchment-400">Lateral Force (F_x):</span>
            <span className="font-bold text-ink-900 dark:text-parchment-100">
              {controls.lateralContactForceN} N
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="80"
            step="1"
            value={controls.lateralContactForceN}
            onChange={(e) => updateParam("lateralContactForceN", Number(e.target.value))}
            className="w-full accent-cyan-600"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-ink-600 dark:text-parchment-400">Tip Moment (M_y):</span>
            <span className="font-bold text-ink-900 dark:text-parchment-100">
              {controls.appliedMomentNm} N·m
            </span>
          </div>
          <input
            type="range"
            min="-3"
            max="3"
            step="0.1"
            value={controls.appliedMomentNm}
            onChange={(e) => updateParam("appliedMomentNm", Number(e.target.value))}
            className="w-full accent-purple-600"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-ink-600 dark:text-parchment-400">Initial Misalignment:</span>
            <span className="font-bold text-ink-900 dark:text-parchment-100">
              {controls.initialMisalignmentMm} mm
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="2.5"
            step="0.1"
            value={controls.initialMisalignmentMm}
            onChange={(e) => updateParam("initialMisalignmentMm", Number(e.target.value))}
            className="w-full accent-amber-600"
          />
        </div>
      </div>
    </div>
  );
}

export default WatsonRcc3D;
