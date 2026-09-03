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
import { useLiveSimParams } from "./useLiveSimParams";

const PATENT_ID = "us-2988237-devol-programmed-transfer";

export function DevolProgrammedTransfer3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { params, updateParam, resetParams } = usePatentPhysics(PATENT_ID);
  const liveParams = useLiveSimParams(params);
  const state = stepDevolProgrammedTransfer(params);

  useFrankenSimPhysics(PATENT_ID, {
    domain: "solid_mechanics",
    refusal: { isRefused: true, reason: state.refusal.reason },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: The mounted render loop reads this stable, layout-effect-synchronized ref; depending on its current value would rebuild the Three.js scene.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const phone = container.clientWidth < 640;
    const studio = createThreeStudioScene({
      container,
      cameraPos: phone ? [7.8, 4.7, 8.4] : [5.3, 3.25, 5.6],
      targetPos: phone ? [1.5, 0.95, 0] : [0.65, 0.95, 0],
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

  return (
    <section className="overflow-hidden rounded-2xl border border-indigo-800/60 bg-slate-950 shadow-2xl">
      <header className="flex flex-col gap-2 border-b border-indigo-800/60 bg-slate-950 px-3 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:px-5">
        <div>
          <p className="font-mono text-[10px] tracking-[0.16em] text-indigo-300">
            US 2,988,237 · PROCEDURAL 3D
          </p>
          <p className="mt-1 text-sm font-medium text-white">
            Fig. 1 rectilinear transfer topology
          </p>
        </div>
        <p className="max-w-md text-[11px] leading-4 text-rose-200 sm:text-right">
          Coded slots drive normalized exhibit travel only. The grant supplies no reusable arm
          dimensions, payload, speed, pressure, or force law.
        </p>
      </header>
      <div className="relative min-h-[420px] sm:min-h-[540px]">
        <div ref={containerRef} className="absolute inset-0" />
      </div>
      <div className="grid gap-3 border-t border-indigo-800/60 bg-slate-950/95 p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-[1fr_1fr_auto_auto_auto_auto] lg:items-end">
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
        <label className="flex min-h-9 items-center justify-between gap-2 rounded-lg border border-slate-700 px-2 text-xs text-slate-200">
          Anticipator
          <input
            type="checkbox"
            checked={(params.anticipationEnabled ?? 1) >= 0.5}
            onChange={(event) => updateParam("anticipationEnabled", Number(event.target.checked))}
          />
        </label>
        <label className="flex min-h-9 items-center justify-between gap-2 rounded-lg border border-slate-700 px-2 text-xs text-slate-200">
          Record
          <input
            type="checkbox"
            checked={(params.recordingMode ?? 0) >= 0.5}
            onChange={(event) => updateParam("recordingMode", Number(event.target.checked))}
          />
        </label>
        <label className="flex min-h-9 items-center justify-between gap-2 rounded-lg border border-slate-700 px-2 text-xs text-slate-200">
          Grip
          <input
            type="checkbox"
            checked={(params.gripperClosed ?? 0) >= 0.5}
            onChange={(event) => updateParam("gripperClosed", Number(event.target.checked))}
          />
        </label>
        <button
          type="button"
          onClick={resetParams}
          className="min-h-9 self-end rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-xs text-slate-100 hover:bg-slate-800"
        >
          <RotateCcw className="mr-1 inline h-3.5 w-3.5" />
          Reset
        </button>
        <p className="text-[11px] leading-4 text-slate-400 sm:col-span-2 lg:col-span-6">
          {state.traversalMode.replaceAll("-", " ")} · {state.programPhase} · gripper{" "}
          {state.gripperState}
        </p>
      </div>
    </section>
  );
}
