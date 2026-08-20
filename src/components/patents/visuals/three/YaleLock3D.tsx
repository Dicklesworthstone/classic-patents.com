"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { DEFAULT_LOCK_BITTINGS_MM, stepYaleLock } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { createYaleLockModel } from "./yaleLockModel";

interface YaleLock3DProps {
  initialKeyInsertion?: number;
  initialAppliedTorque?: number;
}

export function YaleLock3D({
  initialKeyInsertion = 1.0,
  initialAppliedTorque = 0.15,
}: YaleLock3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const insertionId = useId();
  const torqueId = useId();

  const { params, updateParam } = usePatentPhysics("us-48475-yale-lock");
  const keyInsertion = params.keyInsertion ?? initialKeyInsertion;
  const appliedTorqueNm = params.appliedTorqueNm ?? initialAppliedTorque;
  const [useAuthorizedKey, setUseAuthorizedKey] = useState<boolean>(true);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [cameraPreset, setCameraPreset] = useState<"iso" | "cutaway" | "keyway" | "top">("iso");

  const activeKeyBittings = useMemo(() => {
    return useAuthorizedKey ? DEFAULT_LOCK_BITTINGS_MM : [5.0, 3.0, 5.5, 2.5, 5.0];
  }, [useAuthorizedKey]);

  const yaleState = useMemo(() => {
    return stepYaleLock({
      keyInsertion,
      appliedTorqueNm: isRotating ? appliedTorqueNm : 0.0,
      keyBittingsMm: activeKeyBittings,
      lockBittingsMm: DEFAULT_LOCK_BITTINGS_MM,
      currentPlugAngleRad: isRotating && keyInsertion >= 0.95 && useAuthorizedKey ? Math.PI / 2 : 0,
    });
  }, [keyInsertion, appliedTorqueNm, activeKeyBittings, isRotating, useAuthorizedKey]);

  const live = useLiveSimParams({ yaleState, keyInsertion });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [5.0, 3.5, 6.0],
      targetPos: [0, 0, 0],
    });

    const model = createYaleLockModel();
    studio.scene.add(model.group);

    let rafId = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      model.update(live.current.yaleState, live.current.keyInsertion);
      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };
    animate();

    // Preset camera transitions
    const applyCamera = (preset: typeof cameraPreset) => {
      if (preset === "iso") {
        studio.camera.position.set(5.0, 3.5, 6.0);
        studio.controls.target.set(0, 0, 0);
      } else if (preset === "cutaway") {
        studio.camera.position.set(0, 0, 7.5);
        studio.controls.target.set(0, 0, 0);
      } else if (preset === "keyway") {
        studio.camera.position.set(-6.5, 0, 0);
        studio.controls.target.set(0, 0, 0);
      } else if (preset === "top") {
        studio.camera.position.set(0, 7.5, 0.1);
        studio.controls.target.set(0, 0, 0);
      }
      studio.controls.update();
    };

    applyCamera(cameraPreset);

    return () => {
      cancelAnimationFrame(rafId);
      model.dispose();
      studio.dispose();
    };
  }, [cameraPreset, live]);

  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 text-neutral-100 shadow-2xl backdrop-blur-md">
      {/* 3D Viewport Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-amber-400">
            Linus Yale Jr. 3D Pin-Tumbler Studio
          </h3>
          <p className="text-sm text-neutral-400">
            Interactive WebGL Mechanics • Real-Time Split-Pin Shear Clearance & Deadbolt Throw
          </p>
        </div>

        {/* Camera and Mode Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs">
            <button
              type="button"
              onClick={() => setCameraPreset("iso")}
              className={`px-2.5 py-1 rounded font-mono ${
                cameraPreset === "iso"
                  ? "bg-amber-500/30 text-amber-300 font-bold"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Isometric
            </button>
            <button
              type="button"
              onClick={() => setCameraPreset("cutaway")}
              className={`px-2.5 py-1 rounded font-mono ${
                cameraPreset === "cutaway"
                  ? "bg-amber-500/30 text-amber-300 font-bold"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Cutaway Side
            </button>
            <button
              type="button"
              onClick={() => setCameraPreset("top")}
              className={`px-2.5 py-1 rounded font-mono ${
                cameraPreset === "top"
                  ? "bg-amber-500/30 text-amber-300 font-bold"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Top Shear
            </button>
            <button
              type="button"
              onClick={() => setCameraPreset("keyway")}
              className={`px-2.5 py-1 rounded font-mono ${
                cameraPreset === "keyway"
                  ? "bg-amber-500/30 text-amber-300 font-bold"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Keyway Face
            </button>
          </div>

          <button
            type="button"
            onClick={() => setUseAuthorizedKey(!useAuthorizedKey)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border ${
              useAuthorizedKey
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
                : "bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30"
            }`}
          >
            {useAuthorizedKey ? "Authorized Key" : "Wrong Key"}
          </button>

          <button
            type="button"
            disabled={!yaleState.isUnlocked}
            onClick={() => setIsRotating(!isRotating)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border ${
              yaleState.isUnlocked
                ? isRotating
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30"
                  : "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30"
                : "bg-neutral-800 text-neutral-500 border-neutral-700 cursor-not-allowed"
            }`}
          >
            {isRotating ? "Return (0°)" : "Turn Key (90°)"}
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div className="relative w-full aspect-[16/9] min-h-[420px] bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800 shadow-inner">
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Live HUD Overlay (Pointer Events None) */}
        <div className="absolute top-4 left-4 pointer-events-none flex flex-col gap-2 font-mono text-xs">
          <div className="bg-neutral-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-800 shadow">
            <span className="text-neutral-400">Shear Status: </span>
            <span
              className={
                yaleState.isUnlocked ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"
              }
            >
              {yaleState.isUnlocked ? "ALIGNED (UNLOCKED)" : "PINS BINDING"}
            </span>
          </div>
          <div className="bg-neutral-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-800 shadow">
            <span className="text-neutral-400">Max Pin Error: </span>
            <span className="text-amber-400 font-bold">
              {yaleState.maxShearErrorMm.toFixed(3)} mm
            </span>
          </div>
          <div className="bg-neutral-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-800 shadow">
            <span className="text-neutral-400">Bolt Throw: </span>
            <span className="text-cyan-400 font-bold">
              {yaleState.boltExtensionMm.toFixed(1)} mm{" "}
              {yaleState.isDeadlocked ? "(DEADLOCKED)" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-950/60 p-5 rounded-xl border border-neutral-800">
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Real-Time Key & Torque Controls
          </h4>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-mono">
              <label htmlFor={insertionId} className="text-neutral-300">
                Key Blade Insertion Depth
              </label>
              <span className="text-amber-400 font-bold">{(keyInsertion * 100).toFixed(0)}%</span>
            </div>
            <input
              id={insertionId}
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={keyInsertion}
              onChange={(e) => updateParam("keyInsertion", parseFloat(e.target.value))}
              className="w-full accent-amber-500 bg-neutral-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-mono">
              <label htmlFor={torqueId} className="text-neutral-300">
                Applied Rotational Torque
              </label>
              <span className="text-cyan-400 font-bold">{appliedTorqueNm.toFixed(2)} N·m</span>
            </div>
            <input
              id={torqueId}
              type="range"
              min="0"
              max="0.5"
              step="0.01"
              value={appliedTorqueNm}
              onChange={(e) => updateParam("appliedTorqueNm", parseFloat(e.target.value))}
              className="w-full accent-cyan-500 bg-neutral-800 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 justify-center font-mono text-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Physical Constants & Tolerances
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800">
              <span className="text-neutral-500 text-[10px] block">PLUG DIAMETER</span>
              <span className="text-neutral-200">12.7 mm (1/2 in)</span>
            </div>
            <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800">
              <span className="text-neutral-500 text-[10px] block">SHEAR TOLERANCE</span>
              <span className="text-emerald-400">&plusmn;0.09 mm</span>
            </div>
            <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800">
              <span className="text-neutral-500 text-[10px] block">SPRING RATE</span>
              <span className="text-amber-400">140 N/m</span>
            </div>
            <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800">
              <span className="text-neutral-500 text-[10px] block">KEY PERMUTATIONS</span>
              <span className="text-indigo-400">7,776 (6⁵)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default YaleLock3D;
