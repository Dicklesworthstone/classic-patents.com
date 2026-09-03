"use client";

import { Eye, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import { stepLemelsonWarehouseTopology } from "@/physics/lemelsonWarehouseKernel";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { buildLemelsonWarehouseModel } from "./lemelsonWarehouseModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

const PATENT_ID = "us-3119501-lemelson-automatic-warehousing";
const VIEWS = {
  overview: {
    position: [7.2, 5.4, 7.3] as [number, number, number],
    target: [0.5, -0.25, 0.2] as [number, number, number],
  },
  rail: {
    position: [0, 5.8, 0.05] as [number, number, number],
    target: [0, -0.5, 0] as [number, number, number],
  },
  bay: {
    position: [5.4, 2.1, 4.2] as [number, number, number],
    target: [2.7, -0.2, 0.7] as [number, number, number],
  },
} as const;

function viewForViewport(view: keyof typeof VIEWS, viewportWidth: number) {
  const config = VIEWS[view];
  if (viewportWidth >= 640) return config;

  const distanceMultiplier = view === "overview" ? 1.45 : 1.25;
  return {
    position: config.position.map(
      (coordinate, index) =>
        config.target[index] + (coordinate - config.target[index]) * distanceMultiplier,
    ) as [number, number, number],
    target: config.target,
  };
}

function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function LemelsonAutomaticWarehousing3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [view, setView] = useState<keyof typeof VIEWS>("overview");
  const { effectiveParams, claimStates, claimConstraintResult, updateParam, resetParams } =
    usePatentPhysics(PATENT_ID);
  const liveParams = useLiveSimParams(effectiveParams);
  const pose = stepLemelsonWarehouseTopology(effectiveParams);
  useFrankenSimPhysics(PATENT_ID, {
    domain: "solid_mechanics",
    refusal: {
      isRefused: true,
      reason: claimConstraintResult.refusalWarning ?? pose.refusal.reason,
    },
  });
  const selectView = (next: keyof typeof VIEWS) => {
    setView(next);
    const camera = viewForViewport(next, containerRef.current?.clientWidth ?? 1000);
    studioRef.current?.controls.setView(camera.position, camera.target);
  };

  // The persistent WebGL scene reads the stable layout-effect-synchronized control ref; depending on `.current` would recreate and flash the studio.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const initialView = viewForViewport("overview", container.clientWidth);
    const studio = createThreeStudioScene({
      container,
      cameraPos: initialView.position,
      targetPos: initialView.target,
      environmentStyle: "studio",
      enableClouds: false,
      ambientIntensity: 2.4,
      sunIntensity: 2.7,
      cameraMinDistance: 3.2,
      cameraMaxDistance: 22,
    });
    studioRef.current = studio;
    const { scene, camera, renderer, controls } = studio;
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.7,
      metalness: 0.23,
    });
    const floor = new THREE.Mesh(new THREE.CircleGeometry(6.2, 64), floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.7;
    floor.receiveShadow = true;
    scene.add(floor);
    const model = buildLemelsonWarehouseModel();
    scene.add(model.root);
    const clock = createStudioClock();
    let frame = 0;
    const animate = (now: number) => {
      frame = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      clock.pump(now);
      model.updatePose(stepLemelsonWarehouseTopology(liveParams.current));
      controls.update();
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      scene.remove(model.root, floor);
      model.dispose();
      floor.geometry.dispose();
      floorMaterial.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [liveParams]);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">
      <div className="relative min-h-[430px] sm:min-h-[540px]">
        <div ref={containerRef} className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-3 sm:inset-x-5 sm:top-5">
          <div className="max-w-[12rem] rounded-xl border border-cyan-700/70 bg-slate-950/90 px-3 py-2 backdrop-blur sm:max-w-none">
            <p className="font-mono text-[10px] tracking-[0.16em] text-cyan-300">
              US 3,119,501 · PROCEDURAL 3D
            </p>
            <p className="mt-1 text-xs font-medium text-white sm:text-sm">
              <span className="sm:hidden">Rail / lift / shuttle</span>
              <span className="hidden sm:inline">Rail, elevator, shuttle, and bay topology</span>
            </p>
          </div>
          <div className="hidden max-w-xs rounded-xl border border-rose-800/70 bg-rose-950/90 px-3 py-2 text-right text-[11px] leading-4 text-rose-100 backdrop-blur sm:block">
            Normalized host geometry only. No source-backed warehouse scale or performance model.
          </div>
        </div>
      </div>
      <div
        data-mobile-layout="controls-below-canvas"
        className="grid gap-3 border-t border-slate-700/80 bg-slate-950/90 p-3 backdrop-blur sm:p-4"
      >
        <ClaimConstraintToggle
          patentId={PATENT_ID}
          claimStates={claimStates}
          onToggleClaim={(claimNumber, active) =>
            updateParam(claimConstraintStateParamId(claimNumber), active ? 1 : 0)
          }
        />
        {claimConstraintResult.activeFailures.length > 0 && (
          <div role="status" className="rounded-lg border border-rose-800 bg-rose-950/80 p-2">
            {claimConstraintResult.activeFailures.map((failure: string) => (
              <p key={failure} className="text-[11px] leading-4 text-rose-100">
                {failure}
              </p>
            ))}
            {claimConstraintResult.refusalWarning && (
              <p className="mt-1 text-[10px] leading-4 text-rose-200">
                {claimConstraintResult.refusalWarning}
              </p>
            )}
          </div>
        )}
        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-xs text-slate-200">
              Rail address{" "}
              <span className="float-right font-mono text-cyan-300">
                {percent(pose.railAddressFraction)}
              </span>
              <input
                className="mt-1 w-full accent-cyan-400"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={pose.railAddressFraction}
                aria-label="Rail address"
                onChange={(event) => updateParam("railAddressFraction", Number(event.target.value))}
              />
            </label>
            <label className="text-xs text-slate-200">
              Vertical address{" "}
              <span className="float-right font-mono text-amber-300">
                {percent(pose.levelAddressFraction)}
              </span>
              <input
                className="mt-1 w-full accent-amber-400"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={pose.levelAddressFraction}
                aria-label="Vertical address"
                onChange={(event) =>
                  updateParam("levelAddressFraction", Number(event.target.value))
                }
              />
            </label>
            <label className="text-xs text-slate-200">
              Shuttle extension{" "}
              <span className="float-right font-mono text-purple-300">
                {percent(pose.shuttleExtensionFraction)}
              </span>
              <input
                className="mt-1 w-full accent-purple-400"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={pose.shuttleExtensionFraction}
                aria-label="Shuttle extension"
                onChange={(event) =>
                  updateParam("shuttleExtensionFraction", Number(event.target.value))
                }
              />
            </label>
            <label className="text-xs text-slate-200">
              Addressing logic
              <select
                className="mt-1 w-full rounded border border-slate-600 bg-slate-900 p-1 text-xs"
                value={Number(pose.automaticAddressing)}
                aria-label="Automatic addressing"
                onChange={(event) => updateParam("automaticAddressing", Number(event.target.value))}
              >
                <option value="1">Claim sequence</option>
                <option value="0">Manual comparison</option>
              </select>
            </label>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            {(Object.keys(VIEWS) as Array<keyof typeof VIEWS>).map((candidate) => (
              <button
                key={candidate}
                type="button"
                onClick={() => selectView(candidate)}
                className={`min-h-9 rounded-lg border px-2.5 text-xs capitalize focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 ${view === candidate ? "border-cyan-400 bg-cyan-400 text-slate-950" : "border-slate-600 bg-slate-900 text-slate-200 hover:bg-slate-800"}`}
              >
                <Eye className="mr-1 inline h-3.5 w-3.5" />
                {candidate}
              </button>
            ))}
            <button
              type="button"
              onClick={resetParams}
              className="min-h-9 rounded-lg border border-slate-600 bg-slate-900 px-2.5 text-xs text-slate-200 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
            >
              <RotateCcw className="mr-1 inline h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </div>
      </div>
      <p className="border-t border-slate-800 px-4 py-3 text-xs leading-5 text-slate-300 sm:px-5">
        Live claim probe: Claim {pose.activeClaim} is represented by the current {pose.addressState}{" "}
        state. {pose.refusal.reason}
      </p>
    </section>
  );
}
