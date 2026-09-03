"use client";

import { Eye, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { stepMilacronRobotToolchanger } from "@/physics/milacronRobotToolchangerKernel";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import {
  buildMilacronRobotToolchangerModel,
  type MilacronRobotToolchangerModel,
} from "./milacronRobotToolchangerModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

const PATENT_ID = "us-4512709-milacron-robot-toolchanger";
const VIEWS = {
  adapter: {
    position: [3.8, 2.8, 5.2] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
  },
  lock: {
    position: [2.1, 1.4, 3.2] as [number, number, number],
    target: [0.15, -0.1, 0.1] as [number, number, number],
  },
  rack: {
    position: [-4.5, 2.4, 4.8] as [number, number, number],
    target: [-1.1, -0.1, 0] as [number, number, number],
  },
} as const;

const PHONE_VIEWS = {
  adapter: {
    position: [7.0, 4.8, 8.8] as [number, number, number],
    target: [-0.3, -0.05, 0] as [number, number, number],
  },
  lock: {
    position: [3.9, 2.5, 5.5] as [number, number, number],
    target: [0.1, -0.1, 0.05] as [number, number, number],
  },
  rack: {
    position: [-7.2, 4.0, 7.6] as [number, number, number],
    target: [-1.15, -0.1, 0] as [number, number, number],
  },
} as const;

function viewForViewport(view: keyof typeof VIEWS, viewportWidth: number) {
  return viewportWidth < 640 ? PHONE_VIEWS[view] : VIEWS[view];
}

export function MilacronRobotToolchanger3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const modelRef = useRef<MilacronRobotToolchangerModel | null>(null);
  const { params, updateParam, resetParams } = usePatentPhysics(PATENT_ID);
  const liveParams = useLiveSimParams(params);
  const state = useMemo(() => stepMilacronRobotToolchanger(params), [params]);
  const [view, setView] = useState<keyof typeof VIEWS>("adapter");

  useFrankenSimPhysics(PATENT_ID, {
    domain: "solid_mechanics",
    refusal: { isRefused: true, reason: state.sourceBoundary.note },
  });

  const selectView = (next: keyof typeof VIEWS) => {
    setView(next);
    const selected = viewForViewport(next, containerRef.current?.clientWidth ?? 640);
    studioRef.current?.controls.setView(selected.position, selected.target);
    modelRef.current?.setInspectionMode(next);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: The mounted render loop reads this stable, layout-effect-synchronized ref; depending on its current value would rebuild the Three.js scene.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const initialView = container.clientWidth < 640 ? "lock" : "adapter";
    const initialCamera = viewForViewport(initialView, container.clientWidth);
    setView(initialView);
    const studio = createThreeStudioScene({
      container,
      cameraPos: initialCamera.position,
      targetPos: initialCamera.target,
      environmentStyle: "studio",
      enableClouds: false,
      ambientIntensity: 2.7,
      sunIntensity: 3.2,
      cameraMinDistance: 2.3,
      cameraMaxDistance: 12,
    });
    studioRef.current = studio;
    const { scene, camera, renderer, controls } = studio;
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.23,
      roughness: 0.72,
    });
    const floor = new THREE.Mesh(new THREE.CircleGeometry(4.6, 64), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.28;
    floor.receiveShadow = true;
    scene.add(floor);
    const model = buildMilacronRobotToolchangerModel();
    model.setInspectionMode(initialView);
    modelRef.current = model;
    scene.add(model.root);
    const axes = new THREE.AxesHelper(0.65);
    axes.position.set(-2.75, -1.18, -1.2);
    scene.add(axes);

    let frame = 0;
    const clock = createStudioClock();
    const animate = (now: number) => {
      frame = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      clock.pump(now);
      model.updateState(stepMilacronRobotToolchanger(liveParams.current));
      controls.update();
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      model.dispose();
      floor.geometry.dispose();
      floorMat.dispose();
      studio.cleanup();
      studioRef.current = null;
      modelRef.current = null;
    };
  }, []);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">
      <div className="relative min-h-[440px] sm:min-h-[540px]">
        <div ref={containerRef} className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-x-3 top-3 hidden items-start justify-between gap-3 sm:flex sm:inset-x-5 sm:top-5">
          <div className="rounded-xl border border-cyan-700/70 bg-slate-950/85 px-3 py-2 backdrop-blur">
            <p className="font-mono text-[10px] tracking-[0.16em] text-cyan-300">
              US 4,512,709 · PROCEDURAL 3D
            </p>
            <p className="mt-1 text-sm font-medium text-white">
              Common base and locking-slide topology
            </p>
          </div>
          <div className="rounded-xl border border-rose-800/70 bg-rose-950/85 px-3 py-2 text-right text-[11px] leading-4 text-rose-100 backdrop-blur sm:max-w-xs">
            Normalized geometry only. No source-backed force, stroke, or timing calculation.
          </div>
        </div>
        <div className="pointer-events-none absolute left-3 top-24 hidden rounded-xl border border-slate-700/80 bg-slate-950/85 p-2.5 font-mono text-[11px] text-slate-200 backdrop-blur sm:block sm:left-5">
          <p>
            STATE <span className="text-cyan-300">{state.phase}</span>
          </p>
          <p>
            REGISTRATION{" "}
            <span className="text-amber-300">
              {state.registrationComplete ? "SEATED" : "PENDING"}
            </span>
          </p>
          <p>
            CLAIM 4{" "}
            <span className="text-emerald-300">
              {state.claimFourTMemberSelected
                ? state.claimFourRampCaptured
                  ? "T-MEMBER CAPTURED"
                  : "T-MEMBER SELECTED"
                : "CLAIM 3 GENERIC MEMBER"}
            </span>
          </p>
        </div>
      </div>
      <div
        data-mobile-layout="controls-below-canvas"
        className="grid gap-3 border-t border-slate-700/80 bg-slate-950/90 p-3 lg:grid-cols-[minmax(0,1fr)_auto]"
      >
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <label className="text-xs text-slate-200">
            Registration{" "}
            <span className="float-right font-mono text-cyan-300">
              {Math.round((params.registrationFraction ?? 1) * 100)}%
            </span>
            <input
              className="mt-1 w-full accent-cyan-400"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={params.registrationFraction ?? 1}
              aria-label="Tool-base registration fraction"
              onChange={(event) => updateParam("registrationFraction", Number(event.target.value))}
            />
          </label>
          <label className="text-xs text-slate-200">
            Locking slide{" "}
            <span className="float-right font-mono text-amber-300">
              {Math.round((params.lockingSlideFraction ?? 1) * 100)}%
            </span>
            <input
              className="mt-1 w-full accent-amber-400"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={params.lockingSlideFraction ?? 1}
              aria-label="Locking slide fraction"
              onChange={(event) => updateParam("lockingSlideFraction", Number(event.target.value))}
            />
          </label>
          <label className="flex items-center justify-between gap-2 text-xs text-slate-200">
            Tool base present
            <input
              className="h-4 w-4 accent-cyan-400"
              type="checkbox"
              checked={state.toolBasePresent}
              aria-label="Tool base present"
              onChange={(event) => updateParam("toolBasePresent", event.target.checked ? 1 : 0)}
            />
          </label>
          <label className="flex items-center justify-between gap-2 text-xs text-slate-200">
            Claim 4 T-member form
            <input
              className="h-4 w-4 accent-rose-400"
              type="checkbox"
              checked={state.claimFourTMemberSelected}
              aria-label="Claim 4 T-member form"
              onChange={(event) => updateParam("claimFourTMember", event.target.checked ? 1 : 0)}
            />
          </label>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          {(Object.keys(VIEWS) as Array<keyof typeof VIEWS>).map((candidate) => (
            <button
              key={candidate}
              type="button"
              onClick={() => selectView(candidate)}
              className={`min-h-9 rounded-lg border px-2.5 text-xs capitalize ${view === candidate ? "border-cyan-400 bg-cyan-500 text-slate-950" : "border-slate-600 bg-slate-900 text-slate-200 hover:bg-slate-800"}`}
            >
              <Eye className="mr-1 inline h-3.5 w-3.5" />
              {candidate}
            </button>
          ))}
          <button
            type="button"
            onClick={resetParams}
            className="min-h-9 rounded-lg border border-slate-600 bg-slate-900 px-2.5 text-xs text-slate-200 hover:bg-slate-800"
          >
            <RotateCcw className="mr-1 inline h-3.5 w-3.5" />
            Reset
          </button>
        </div>
        <p className="text-[11px] leading-4 text-slate-400 lg:col-span-2">
          {view === "lock"
            ? "Lock inspection uses a transparent cutaway of common base 18 so aperture 34, slide 33, and the selected retention member remain visible. Transparency is an inspection aid, not source material."
            : "Adapter and rack views keep all source-described plates opaque; select Lock to inspect the otherwise enclosed capture geometry."}
        </p>
      </div>
    </section>
  );
}
