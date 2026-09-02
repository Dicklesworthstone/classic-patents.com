"use client";

import { Eye, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { stepMakinoScaraTopology } from "@/physics/makinoScaraKernel";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { buildMakinoScaraModel } from "./makinoScaraModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";

const PATENT_ID = "us-4341502-makino-scara";

const VIEWS = {
  overview: {
    position: [5.2, 4.0, 5.8] as [number, number, number],
    target: [0, -3.85, 0] as [number, number, number],
  },
  plan: {
    position: [0, 8.5, 0.01] as [number, number, number],
    target: [0, -4.08, 0] as [number, number, number],
  },
  tool: {
    position: [2.4, 1.4, 3.0] as [number, number, number],
    target: [0.15, -4.0, 0.25] as [number, number, number],
  },
} as const;

export function MakinoScara3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [view, setView] = useState<keyof typeof VIEWS>("overview");
  const { params, updateParam, resetParams } = usePatentPhysics(PATENT_ID);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const liveParams = useRef(params);
  liveParams.current = params;
  const pose = stepMakinoScaraTopology(params);
  const topology = params.topologyVariant ?? 1;

  // The source-bounded refusal is itself a first-class physics status. No
  // FrankenSim/WASM badge is shown because no source-supported SI body model
  // can be stepped from this grant's un-dimensioned geometry.
  useFrankenSimPhysics(PATENT_ID, {
    domain: "solid_mechanics",
    refusal: { isRefused: true, reason: pose.refusal.reason },
  });

  const selectView = (next: keyof typeof VIEWS) => {
    setView(next);
    const camera = VIEWS[next];
    studioRef.current?.controls.setView(camera.position, camera.target);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const initial = VIEWS.overview;
    const studio = createThreeStudioScene({
      container,
      cameraPos: initial.position,
      targetPos: initial.target,
      environmentStyle: "studio",
      enableClouds: false,
      ambientIntensity: 2.7,
      sunIntensity: 3.1,
      cameraMinDistance: 2.8,
      cameraMaxDistance: 12,
    });
    studioRef.current = studio;
    const { scene, camera, renderer, controls } = studio;

    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.68,
      metalness: 0.28,
    });
    const floor = new THREE.Mesh(new THREE.CircleGeometry(4.7, 64), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -4.5;
    floor.receiveShadow = true;
    scene.add(floor);

    const model = buildMakinoScaraModel();
    scene.add(model.root);
    const axes = new THREE.AxesHelper(1.15);
    axes.position.set(-1.55, -4.42, -1.25);
    scene.add(axes);

    let frame = 0;
    const clock = createStudioClock();
    const animate = (now: number) => {
      frame = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      clock.pump(now);
      model.updatePose(stepMakinoScaraTopology(liveParams.current));
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
    };
  }, []);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">
      <div className="relative min-h-[420px] sm:min-h-[520px]">
        <div ref={containerRef} className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-x-3 top-3 hidden items-start justify-between gap-3 sm:flex sm:inset-x-5 sm:top-5">
          <div className="rounded-xl border border-cyan-700/70 bg-slate-950/85 px-3 py-2 backdrop-blur">
            <p className="font-mono text-[10px] tracking-[0.16em] text-cyan-300">
              US 4,341,502 · PROCEDURAL 3D
            </p>
            <p className="mt-1 text-sm font-medium text-white">Normalized four-link linkage</p>
          </div>
          <div className="rounded-xl border border-rose-800/70 bg-rose-950/85 px-3 py-2 text-right text-[11px] leading-4 text-rose-100 backdrop-blur sm:max-w-xs">
            No source-backed SI dynamics: topology and angle geometry only.
          </div>
        </div>
      </div>
      <div
        data-mobile-layout="controls-below-canvas"
        className="grid gap-2 border-t border-slate-700/80 bg-slate-950/90 p-3 sm:grid-cols-[1fr_auto]"
      >
        <div className="grid gap-2 sm:grid-cols-3">
          <label className="text-xs text-slate-200">
            θ₁{" "}
            <span className="float-right font-mono text-cyan-300">
              {(params.firstLinkAngleDeg ?? 32).toFixed(0)}°
            </span>
            <input
              className="mt-1 w-full accent-cyan-400"
              type="range"
              min="-180"
              max="180"
              step="1"
              value={params.firstLinkAngleDeg ?? 32}
              aria-label="First-link angle"
              onChange={(event) => updateParam("firstLinkAngleDeg", Number(event.target.value))}
            />
          </label>
          <label className="text-xs text-slate-200">
            θ₂{" "}
            <span className="float-right font-mono text-amber-300">
              {(params.fourthLinkAngleDeg ?? -38).toFixed(0)}°
            </span>
            <input
              className="mt-1 w-full accent-amber-400"
              type="range"
              min="-180"
              max="180"
              step="1"
              value={params.fourthLinkAngleDeg ?? -38}
              aria-label="Fourth-link angle"
              onChange={(event) => updateParam("fourthLinkAngleDeg", Number(event.target.value))}
            />
          </label>
          <label className="text-xs text-slate-200">
            Claim form
            <select
              className="mt-1 w-full rounded border border-slate-600 bg-slate-900 p-1 text-xs"
              value={topology}
              aria-label="Claim topology"
              onChange={(event) => updateParam("topologyVariant", Number(event.target.value))}
            >
              <option value="1">1 · concentric</option>
              <option value="2">3 · offset</option>
              <option value="3">6 · Y-link</option>
            </select>
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

        <div className="border-t border-slate-800 pt-2">
          <ClaimConstraintToggle
            patentId={PATENT_ID}
            claimStates={claimStates}
            onClaimStateChange={(num, active) =>
              setClaimStates((prev) => ({ ...prev, [num]: active }))
            }
          />
        </div>
      </div>
    </section>
  );
}
