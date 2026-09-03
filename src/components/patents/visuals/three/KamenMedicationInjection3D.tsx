"use client";

import { Eye, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import { stepKamenInjectionMechanism } from "@/physics/kamenInjectionKernel";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { buildKamenInjectionModel } from "./kamenInjectionModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

const PATENT_ID = "us-3858581-kamen-medication-injection-device";
const VIEWS = {
  overview: {
    position: [6.0, 3.6, 6.1] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
  },
  drive: {
    position: [-4.9, 2.1, 3.7] as [number, number, number],
    target: [-1.2, 0, 0] as [number, number, number],
  },
  counter: {
    position: [4.2, 2.5, 3.7] as [number, number, number],
    target: [1.5, 0.4, 0] as [number, number, number],
  },
} as const;
function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function KamenMedicationInjection3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [view, setView] = useState<keyof typeof VIEWS>("overview");
  const { effectiveParams, claimStates, claimConstraintResult, updateParam, resetParams } =
    usePatentPhysics(PATENT_ID);
  const liveParams = useLiveSimParams(effectiveParams);
  const pose = useMemo(() => stepKamenInjectionMechanism(effectiveParams), [effectiveParams]);
  useFrankenSimPhysics(PATENT_ID, {
    domain: "solid_mechanics",
    refusal: {
      isRefused: true,
      reason: claimConstraintResult.refusalWarning ?? pose.refusal.reason,
    },
  });
  const selectView = (next: keyof typeof VIEWS) => {
    setView(next);
    const camera = VIEWS[next];
    studioRef.current?.controls.setView(camera.position, camera.target);
  };
  // biome-ignore lint/correctness/useExhaustiveDependencies: The mounted render loop reads this stable, layout-effect-synchronized ref; depending on its current value would rebuild the Three.js scene.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const studio = createThreeStudioScene({
      container,
      cameraPos: VIEWS.overview.position,
      targetPos: VIEWS.overview.target,
      environmentStyle: "studio",
      enableClouds: false,
      ambientIntensity: 2.3,
      sunIntensity: 2.6,
      cameraMinDistance: 2.8,
      cameraMaxDistance: 12,
    });
    studioRef.current = studio;
    const { scene, camera, renderer, controls } = studio;
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.7,
      metalness: 0.22,
    });
    const floor = new THREE.Mesh(new THREE.CircleGeometry(5.4, 64), floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.2;
    floor.receiveShadow = true;
    scene.add(floor);
    const model = buildKamenInjectionModel();
    scene.add(model.root);
    const clock = createStudioClock();
    let frame = 0;
    const animate = (now: number) => {
      frame = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      clock.pump(now);
      model.updatePose(stepKamenInjectionMechanism(liveParams.current));
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
  }, []);
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">
      <div className="relative min-h-[430px] sm:min-h-[540px]">
        <div ref={containerRef} className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-3 sm:inset-x-5 sm:top-5">
          <div className="rounded-xl border border-cyan-700/70 bg-slate-950/90 px-3 py-2 backdrop-blur">
            <p className="font-mono text-[10px] tracking-[0.16em] text-cyan-300">
              US 3,858,581 · PROCEDURAL 3D
            </p>
            <p className="mt-1 text-sm font-medium text-white">
              Motor, lead screw, follower, and counter
            </p>
          </div>
          <div className="max-w-xs rounded-xl border border-rose-800/70 bg-rose-950/90 px-3 py-2 text-right text-[11px] leading-4 text-rose-100 backdrop-blur">
            Nonclinical mechanism exhibit. It does not calculate a dose, flow, pressure, or
            therapeutic result.
          </div>
        </div>
        <div className="absolute bottom-3 left-3 right-3 grid gap-3 rounded-xl border border-slate-700/80 bg-slate-950/90 p-3 backdrop-blur sm:bottom-5 sm:left-5 sm:right-5 lg:grid-cols-[1fr_auto]">
          <div className="space-y-2">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <label className="text-xs text-slate-200">
                Lead-screw rotation{" "}
                <span className="float-right font-mono text-cyan-300">
                  {percent(pose.leadScrewTurnFraction)}
                </span>
                <input
                  className="mt-1 w-full accent-cyan-400"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={pose.leadScrewTurnFraction}
                  aria-label="Lead-screw rotation"
                  onChange={(event) =>
                    updateParam("leadScrewTurnFraction", Number(event.target.value))
                  }
                />
              </label>
              <label className="text-xs text-slate-200">
                Counter target{" "}
                <span className="float-right font-mono text-purple-300">
                  {percent(pose.counterTargetFraction)}
                </span>
                <input
                  className="mt-1 w-full accent-purple-400"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={pose.counterTargetFraction}
                  aria-label="Pulse counter target"
                  onChange={(event) =>
                    updateParam("counterTargetFraction", Number(event.target.value))
                  }
                />
              </label>
              <label className="text-xs text-slate-200">
                Motor circuit
                <select
                  className="mt-1 w-full rounded border border-slate-600 bg-slate-900 p-1 text-xs"
                  value={Number(pose.motorCircuitClosed)}
                  aria-label="Motor circuit state"
                  onChange={(event) =>
                    updateParam("motorCircuitClosed", Number(event.target.value))
                  }
                >
                  <option value="1">Closed</option>
                  <option value="0">Open</option>
                </select>
              </label>
              <label className="text-xs text-slate-200">
                Relief arrangement
                <select
                  className="mt-1 w-full rounded border border-slate-600 bg-slate-900 p-1 text-xs"
                  value={Number(pose.reliefPathShown)}
                  aria-label="Relief arrangement"
                  onChange={(event) => updateParam("reliefPathShown", Number(event.target.value))}
                >
                  <option value="0">Hidden</option>
                  <option value="1">Shown</option>
                </select>
              </label>
            </div>
            <ClaimConstraintToggle
              patentId={PATENT_ID}
              claimStates={claimStates}
              onToggleClaim={(claimNumber, active) =>
                updateParam(claimConstraintStateParamId(claimNumber), active ? 1 : 0)
              }
            />
            {claimConstraintResult.activeFailures.length > 0 && (
              <div role="status" className="rounded-lg border border-rose-800 bg-rose-950/80 p-2">
                {claimConstraintResult.activeFailures.map((failure) => (
                  <p key={failure} className="text-[10px] leading-4 text-rose-100">
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
        Live claim probe: Claim {pose.activeClaim} is represented by {pose.motorState}.{" "}
        {pose.refusal.reason}
      </p>
    </section>
  );
}
