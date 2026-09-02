"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PhysicsTelemetryBadge } from "@/components/patents/PhysicsTelemetryBadge";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import {
  buildKamenTransporterModel,
  type KamenTransporterModel,
  updateKamenTransporterKinematics,
} from "@/components/patents/visuals/three/kamenTransporterModel";
import {
  createThreeStudioScene,
  type StudioContext,
} from "@/components/patents/visuals/three/ThreeStudioScene";
import { ALL_COLORIZED_EQUATIONS } from "@/data/colorizedEquations";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import {
  createKamenTransporterTransportUpdater,
  getKamenTransporterTapeState,
  readKamenTransporterControls,
  stepKamenTransporterSi,
} from "@/physics/kamenTransporterKernel";
import { globalTransportBus, useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { useLiveSimParams } from "./useLiveSimParams";

export default function KamenTransporter3D({
  patentId = "us-5701965-kamen-transporter",
}: {
  patentId?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const modelRef = useRef<KamenTransporterModel | null>(null);

  const { effectiveParams, claimStates, updateParam } = usePatentPhysics(patentId);
  const controls = useMemo(() => readKamenTransporterControls(effectiveParams), [effectiveParams]);
  const tel = useMemo(() => stepKamenTransporterSi(controls), [controls]);

  useFrankenSimPhysics(patentId);
  const liveControls = useLiveSimParams(controls);

  // The bus owns fixed-step rolling state. The scene loop only projects the
  // terminal kernel pose, so velocity is never applied a second time in rAF.
  useEffect(() => {
    return globalTransportBus.registerUpdater(
      patentId,
      createKamenTransporterTransportUpdater(() => liveControls.current),
      "TS_FALLBACK",
    );
  }, [liveControls, patentId]);

  const [cameraPreset, setCameraPreset] = useState<"perspective" | "side" | "balance" | "stairs">(
    "perspective",
  );

  useEffect(() => {
    if (!containerRef.current) return;

    let destroyed = false;
    let animFrameId: number;

    const studio = createThreeStudioScene({
      container: containerRef.current,
      cameraPos: [1.8, 1.2, 2.2],
      targetPos: [0, 0.5, 0],
      ambientIntensity: 0.7,
      sunIntensity: 1.5,
    });
    studioRef.current = studio;

    const model = buildKamenTransporterModel();
    modelRef.current = model;
    studio.scene.add(model.root);

    const loop = () => {
      if (destroyed) return;
      animFrameId = requestAnimationFrame(loop);
      if (!studio.isVisible()) return;

      const tape = getKamenTransporterTapeState();
      if (tape) {
        updateKamenTransporterKinematics(
          model,
          tape.controls,
          tape.telemetry,
          tape.wheelRollAngleRad,
        );
      }

      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
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

  const handleCameraPreset = (preset: "perspective" | "side" | "balance" | "stairs") => {
    setCameraPreset(preset);
    if (!studioRef.current) return;
    const { camera, controls: orbitControls } = studioRef.current;

    switch (preset) {
      case "perspective":
        camera.position.set(1.8, 1.2, 2.2);
        orbitControls.target.set(0, 0.5, 0);
        break;
      case "side":
        camera.position.set(0, 0.5, 2.8);
        orbitControls.target.set(0, 0.5, 0);
        break;
      case "balance":
        camera.position.set(1.2, 0.9, 1.4);
        orbitControls.target.set(0, 0.85, 0);
        break;
      case "stairs":
        camera.position.set(2.4, 1.4, 2.0);
        orbitControls.target.set(0.8, 0.4, 0);
        break;
    }
    orbitControls.update();
  };

  return (
    <div className="flex w-full flex-col items-center space-y-4 rounded-2xl border border-parchment-300 bg-parchment-50 p-3 shadow-patent dark:border-ink-800 dark:bg-ink-950 sm:space-y-6 sm:p-6">
      {/* 3D Visual Header */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-cyan-100 dark:bg-cyan-900/60 text-cyan-800 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-700">
              US 5,701,965
            </span>
            <span className="text-xs font-mono font-medium text-ink-500 dark:text-ink-400">
              THREE.JS 3D INVERTED PENDULUM STUDIO
            </span>
          </div>
          <h3 className="text-lg font-serif font-bold text-ink-900 dark:text-parchment-100 mt-1">
            Dynamic Balancing Transporter & Stair-Climbing Robotics Studio
          </h3>
        </div>
        <div className="hidden sm:block">
          <PhysicsTelemetryBadge
            patentId={patentId}
            equations={ALL_COLORIZED_EQUATIONS[patentId] ?? []}
          />
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div className="relative w-full aspect-[16/9] min-h-[420px] bg-ink-950 rounded-xl border border-parchment-300 dark:border-ink-800 overflow-hidden select-none">
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Camera Presets Overlay */}
        <label className="sr-only" htmlFor="kamen-transporter-camera-view">
          Camera view
        </label>
        <select
          id="kamen-transporter-camera-view"
          aria-label="Camera view"
          className="absolute right-3 top-3 z-10 max-w-[calc(100%-1.5rem)] rounded-lg border border-ink-700 bg-ink-900/90 px-2.5 py-2 text-[11px] font-mono font-bold text-ink-200 backdrop-blur-sm sm:hidden"
          value={cameraPreset}
          onChange={(event) =>
            handleCameraPreset(event.target.value as "perspective" | "side" | "balance" | "stairs")
          }
        >
          <option value="perspective">PERSPECTIVE</option>
          <option value="side">SIDE</option>
          <option value="balance">BALANCE</option>
          <option value="stairs">STAIRS</option>
        </select>
        <div className="absolute left-3 top-3 z-10 hidden gap-1.5 rounded-lg border border-ink-700 bg-ink-900/80 p-1 backdrop-blur-sm sm:flex">
          {(["perspective", "side", "balance", "stairs"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handleCameraPreset(p)}
              className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded transition-colors ${
                cameraPreset === p
                  ? "bg-cyan-600 text-white"
                  : "text-ink-300 hover:text-white hover:bg-ink-800"
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>

        {/* HUD Overlay Chip */}
        <div className="absolute bottom-3 left-3 z-10 hidden space-y-1 rounded-lg border border-ink-700 bg-ink-900/85 p-3 font-mono text-xs text-ink-200 backdrop-blur-sm sm:block">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold">PITCH TILT:</span>
            <span>{tel.pitchAngleDeg.toFixed(1)}°</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">MOTOR TORQUE:</span>
            <span>{tel.balanceTorqueNm.toFixed(1)} N·m</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">STABILITY:</span>
            <span
              className={
                tel.pitchRefusal ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"
              }
            >
              {tel.pitchRefusal
                ? "UNSTABLE RUNAWAY"
                : `${(tel.stabilityMargin * 100).toFixed(0)}% MARGIN`}
            </span>
          </div>
        </div>
      </div>

      <div data-mobile-layout="telemetry-after-canvas" className="w-full sm:hidden">
        <PhysicsTelemetryBadge
          patentId={patentId}
          equations={ALL_COLORIZED_EQUATIONS[patentId] ?? []}
        />
      </div>

      {/* Control Sliders */}
      <div
        data-mobile-layout="controls-after-canvas"
        className="grid w-full grid-cols-1 gap-4 font-mono text-xs md:grid-cols-3"
      >
        <div className="p-3 bg-parchment-100 dark:bg-ink-900 rounded-lg border border-parchment-200 dark:border-ink-800 space-y-2">
          <div className="flex justify-between items-center text-ink-700 dark:text-parchment-200">
            <label htmlFor="rider-lean-3d">Rider Body Lean</label>
            <span className="font-bold text-cyan-600 dark:text-cyan-400">
              {controls.riderPitchLeanDeg}°
            </span>
          </div>
          <input
            id="rider-lean-3d"
            type="range"
            min="-15"
            max="15"
            step="1"
            value={controls.riderPitchLeanDeg}
            onChange={(e) => updateParam("riderPitchLeanDeg", Number(e.target.value))}
            className="w-full accent-cyan-600"
          />
        </div>

        <div className="p-3 bg-parchment-100 dark:bg-ink-900 rounded-lg border border-parchment-200 dark:border-ink-800 space-y-2">
          <div className="flex justify-between items-center text-ink-700 dark:text-parchment-200">
            <label htmlFor="speed-cmd-3d">Velocity Command</label>
            <span className="font-bold text-cyan-600 dark:text-cyan-400">
              {controls.velocityCommandMs.toFixed(1)} m/s
            </span>
          </div>
          <input
            id="speed-cmd-3d"
            type="range"
            min="-2.0"
            max="4.0"
            step="0.2"
            value={controls.velocityCommandMs}
            onChange={(e) => updateParam("velocityCommandMs", Number(e.target.value))}
            className="w-full accent-cyan-600"
          />
        </div>

        <div className="p-3 bg-parchment-100 dark:bg-ink-900 rounded-lg border border-parchment-200 dark:border-ink-800 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-bold text-ink-800 dark:text-parchment-100">Transporter Mode</span>
            <span className="text-[10px] text-ink-500 dark:text-ink-400">
              {controls.operatingMode.toUpperCase().replace("_", " ")}
            </span>
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => updateParam("operatingMode", "balance_2wheel" as unknown as number)}
              className={`px-2 py-1 rounded text-[10px] font-bold ${
                controls.operatingMode === "balance_2wheel"
                  ? "bg-cyan-600 text-white"
                  : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300"
              }`}
            >
              2-WHEEL
            </button>
            <button
              type="button"
              onClick={() => updateParam("operatingMode", "stair_climb" as unknown as number)}
              className={`px-2 py-1 rounded text-[10px] font-bold ${
                controls.operatingMode === "stair_climb"
                  ? "bg-amber-600 text-white"
                  : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300"
              }`}
            >
              STAIRS
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-parchment-200 dark:border-ink-800">
          <ClaimConstraintToggle
            patentId={patentId}
            claimStates={claimStates}
            onClaimStateChange={(num, active) =>
              updateParam(claimConstraintStateParamId(num), active ? 1 : 0)
            }
          />
        </div>
      </div>
    </div>
  );
}
