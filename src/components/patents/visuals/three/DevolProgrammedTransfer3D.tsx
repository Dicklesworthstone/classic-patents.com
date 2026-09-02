"use client";

import { RotateCcw } from "lucide-react";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { stepDevolProgrammedTransfer } from "@/physics/devolProgrammedTransferKernel";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { buildDevolProgrammedTransferModel } from "./devolProgrammedTransferModel";
import { createThreeStudioScene } from "./ThreeStudioScene";

const PATENT_ID = "us-2988237-devol-programmed-transfer";

export function DevolProgrammedTransfer3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { params, updateParam, resetParams } = usePatentPhysics(PATENT_ID);
  const liveParams = useRef(params);
  liveParams.current = params;
  const refusal = stepDevolProgrammedTransfer(params).refusal;

  useFrankenSimPhysics(PATENT_ID, {
    domain: "solid_mechanics",
    refusal: { isRefused: true, reason: refusal.reason },
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const studio = createThreeStudioScene({
      container,
      cameraPos: [7, 4.5, 7],
      targetPos: [0.5, 0.75, 0],
      environmentStyle: "studio",
      enableClouds: false,
      ambientIntensity: 2.2,
      sunIntensity: 2.7,
      cameraMinDistance: 3,
      cameraMaxDistance: 15,
    });
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.7,
      metalness: 0.25,
    });
    const floor = new THREE.Mesh(new THREE.CircleGeometry(5.7, 64), floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.42;
    floor.receiveShadow = true;
    studio.scene.add(floor);
    const model = buildDevolProgrammedTransferModel();
    studio.scene.add(model.root);
    const clock = createStudioClock();
    let frame = 0;
    const render = (now: number) => {
      frame = requestAnimationFrame(render);
      if (!studio.isVisible()) return;
      clock.pump(now);
      model.update(stepDevolProgrammedTransfer(liveParams.current));
      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      studio.scene.remove(model.root, floor);
      model.dispose();
      floor.geometry.dispose();
      floorMaterial.dispose();
      studio.cleanup();
    };
  }, []);

  const state = stepDevolProgrammedTransfer(params);
  return (
    <section className="overflow-hidden rounded-2xl border border-indigo-800/60 bg-slate-950 shadow-2xl">
      <div className="relative min-h-[430px] sm:min-h-[540px]">
        <div ref={containerRef} className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-3 sm:inset-x-5 sm:top-5">
          <div className="rounded-xl border border-indigo-700/70 bg-slate-950/85 px-3 py-2 backdrop-blur">
            <p className="font-mono text-[10px] tracking-[0.16em] text-indigo-300">
              US 2,988,237 · PROCEDURAL 3D
            </p>
            <p className="mt-1 text-sm font-medium text-white">Programmed transfer topology</p>
          </div>
          <p className="max-w-xs rounded-xl border border-rose-800/70 bg-rose-950/85 px-3 py-2 text-right text-[11px] leading-4 text-rose-100 backdrop-blur">
            No source-backed arm geometry, payload, speed, pressure, or force telemetry.
          </p>
        </div>
        <div className="absolute bottom-3 left-3 right-3 grid gap-3 rounded-xl border border-slate-700/80 bg-slate-950/88 p-3 backdrop-blur sm:bottom-5 sm:left-5 sm:right-5 sm:grid-cols-[1fr_1fr_auto]">
          <label className="text-xs text-slate-100">
            Drum slot{" "}
            <span className="float-right font-mono text-indigo-300">{state.recordedSlot}</span>
            <input
              className="mt-1 w-full accent-indigo-400"
              type="range"
              min="0"
              max={2 ** state.bitWidth - 1}
              value={state.recordedSlot}
              onChange={(event) => updateParam("recordedSlot", Number(event.target.value))}
            />
          </label>
          <label className="text-xs text-slate-100">
            Encoder slot{" "}
            <span className="float-right font-mono text-cyan-300">{state.sensedSlot}</span>
            <input
              className="mt-1 w-full accent-cyan-400"
              type="range"
              min="0"
              max={2 ** state.bitWidth - 1}
              value={state.sensedSlot}
              onChange={(event) => updateParam("sensedSlot", Number(event.target.value))}
            />
          </label>
          <button
            type="button"
            onClick={resetParams}
            className="self-end rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-xs text-slate-100 hover:bg-slate-800"
          >
            <RotateCcw className="mr-1 inline h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}
