"use client";

import { Eye, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { stepWatsonRemoteCenterComplianceTopology } from "@/physics/watsonRemoteCenterComplianceKernel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { buildWatsonRemoteCenterComplianceModel } from "./watsonRemoteCenterComplianceModel";

const PATENT_ID = "us-4098001-watson-rcc";

const VIEWS = {
  overview: {
    position: [4.9, 3.6, 6.2] as [number, number, number],
    target: [0, -0.4, 0] as [number, number, number],
  },
  flexures: {
    position: [3.2, 1.2, 4.0] as [number, number, number],
    target: [0, 0.1, 0] as [number, number, number],
  },
  tip: {
    position: [2.6, -1.4, 3.2] as [number, number, number],
    target: [0.35, -2.05, 0] as [number, number, number],
  },
} as const;

function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function WatsonRemoteCenterCompliance3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [view, setView] = useState<keyof typeof VIEWS>("overview");
  const { params, updateParam, resetParams } = usePatentPhysics(PATENT_ID);
  const liveParams = useRef(params);
  liveParams.current = params;
  const pose = stepWatsonRemoteCenterComplianceTopology(params);

  // The generic fs-mbd crate is the appropriate future owner for a
  // dimensioned flexure/contact model. This patent's source omits the inputs
  // required for that step, so the browser truthfully exposes a refusal and
  // keeps this 3D face on the same normalized host kernel as the 2D face.
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
      ambientIntensity: 2.3,
      sunIntensity: 2.6,
      cameraMinDistance: 2.6,
      cameraMaxDistance: 11,
    });
    studioRef.current = studio;
    const { scene, camera, renderer, controls } = studio;
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.68,
      metalness: 0.25,
    });
    const floor = new THREE.Mesh(new THREE.CircleGeometry(4.8, 64), floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.6;
    floor.receiveShadow = true;
    scene.add(floor);
    const model = buildWatsonRemoteCenterComplianceModel();
    scene.add(model.root);
    const axes = new THREE.AxesHelper(0.7);
    axes.position.set(-1.55, -2.5, -1.3);
    scene.add(axes);
    const clock = createStudioClock();
    let frame = 0;
    const animate = (now: number) => {
      frame = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      clock.pump(now);
      model.updatePose(stepWatsonRemoteCenterComplianceTopology(liveParams.current));
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
              US 4,098,001 · PROCEDURAL 3D
            </p>
            <p className="mt-1 text-sm font-medium text-white">Remote-center flexure topology</p>
          </div>
          <div className="max-w-xs rounded-xl border border-rose-800/70 bg-rose-950/90 px-3 py-2 text-right text-[11px] leading-4 text-rose-100 backdrop-blur">
            Normalized host geometry only. No source-backed SI flexure, contact, or performance
            model.
          </div>
        </div>

        <div className="absolute bottom-3 left-3 right-3 grid gap-3 rounded-xl border border-slate-700/80 bg-slate-950/90 p-3 backdrop-blur sm:bottom-5 sm:left-5 sm:right-5 lg:grid-cols-[1fr_auto]">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-xs text-slate-200">
              Contact position{" "}
              <span className="float-right font-mono text-cyan-300">
                {percent(pose.lateralContactFraction)}
              </span>
              <input
                className="mt-1 w-full accent-cyan-400"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={pose.lateralContactFraction}
                aria-label="Chamfer contact position"
                onChange={(event) =>
                  updateParam("lateralContactFraction", Number(event.target.value))
                }
              />
            </label>
            <label className="text-xs text-slate-200">
              Axis mismatch{" "}
              <span className="float-right font-mono text-amber-300">
                {percent(pose.axisMismatchFraction)}
              </span>
              <input
                className="mt-1 w-full accent-amber-400"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={pose.axisMismatchFraction}
                aria-label="Initial axis mismatch"
                onChange={(event) =>
                  updateParam("axisMismatchFraction", Number(event.target.value))
                }
              />
            </label>
            <label className="text-xs text-slate-200">
              Claim 1 topology
              <select
                className="mt-1 w-full rounded border border-slate-600 bg-slate-900 p-1 text-xs"
                value={Number(pose.remoteCenterTopology)}
                aria-label="Remote-center topology"
                onChange={(event) =>
                  updateParam("remoteCenterTopology", Number(event.target.value))
                }
              >
                <option value="1">Remote center</option>
                <option value="0">Local-wrist contrast</option>
              </select>
            </label>
            <label className="text-xs text-slate-200">
              Claim 2 constraint
              <select
                className="mt-1 w-full rounded border border-slate-600 bg-slate-900 p-1 text-xs disabled:cursor-not-allowed disabled:opacity-50"
                value={Number(pose.antiTwistConstraint)}
                aria-label="Anti-twist constraint"
                disabled={!pose.remoteCenterTopology}
                onChange={(event) => updateParam("antiTwistConstraint", Number(event.target.value))}
              >
                <option value="1">Bellows shown</option>
                <option value="0">Bellows omitted</option>
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
        Live claim probe:{" "}
        {pose.activeClaim === null
          ? "the local-wrist comparison deliberately omits Claim 1's remote-center topology"
          : pose.activeClaim === 1
            ? "Claim 1 is the radial-plus-axial remote-center arrangement"
            : "Claim 2 adds the torque-resistant means to Claim 1"}
        . {pose.refusal.reason}
      </p>
    </section>
  );
}
