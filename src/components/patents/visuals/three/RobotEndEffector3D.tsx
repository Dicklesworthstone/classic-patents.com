"use client";

import { Eye, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { stepRobotEndEffector } from "@/physics/robotEndEffectorKernel";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { buildRobotEndEffectorModel } from "./robotEndEffectorModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";

const PATENT_ID = "us-4765668-robot-end-effector";

const VIEWS = {
  perspective: {
    position: [4.8, 3.2, 5.4] as [number, number, number],
    target: [0, 0.35, 0] as [number, number, number],
  },
  gear: {
    position: [3.6, 1.5, 2.2] as [number, number, number],
    target: [1.55, 0, 0.3] as [number, number, number],
  },
  finger: {
    position: [-3.2, 2.8, 3.8] as [number, number, number],
    target: [-0.35, 0.35, 0.1] as [number, number, number],
  },
} as const;

export function RobotEndEffector3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const { params, updateParam, resetParams } = usePatentPhysics(PATENT_ID);
  const liveParams = useRef(params);
  liveParams.current = params;
  const state = useMemo(() => stepRobotEndEffector(params), [params]);
  const [view, setView] = useState<keyof typeof VIEWS>("perspective");

  // This is a shared deterministic screw/encoder kernel. No FrankenSim/WASM
  // step is claimed because the source withholds contact, pneumatic, payload,
  // frame-dimension, and connector-stroke inputs needed for a body simulation.
  useFrankenSimPhysics(PATENT_ID, {
    domain: "solid_mechanics",
    refusal: { isRefused: true, reason: state.sourceBoundary.note },
  });

  const selectView = (next: keyof typeof VIEWS) => {
    setView(next);
    studioRef.current?.controls.setView(VIEWS[next].position, VIEWS[next].target);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const studio = createThreeStudioScene({
      container,
      cameraPos: VIEWS.perspective.position,
      targetPos: VIEWS.perspective.target,
      environmentStyle: "studio",
      enableClouds: false,
      ambientIntensity: 2.6,
      sunIntensity: 3.1,
      cameraMinDistance: 2.4,
      cameraMaxDistance: 12,
    });
    studioRef.current = studio;
    const { scene, camera, renderer, controls } = studio;

    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.7,
      metalness: 0.23,
    });
    const floor = new THREE.Mesh(new THREE.CircleGeometry(4.6, 64), floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.14;
    floor.receiveShadow = true;
    scene.add(floor);

    const model = buildRobotEndEffectorModel();
    scene.add(model.root);
    const axes = new THREE.AxesHelper(0.65);
    axes.position.set(-2.15, -1.05, -1.28);
    scene.add(axes);

    let frame = 0;
    const clock = createStudioClock();
    const animate = (now: number) => {
      frame = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      clock.pump(now);
      model.updateState(stepRobotEndEffector(liveParams.current));
      controls.update();
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      model.dispose();
      floor.geometry.dispose();
      floorMaterial.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, []);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">
      <div className="relative min-h-[440px] sm:min-h-[540px]">
        <div ref={containerRef} className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-3 sm:inset-x-5 sm:top-5">
          <div className="rounded-xl border border-cyan-700/70 bg-slate-950/85 px-3 py-2 backdrop-blur">
            <p className="font-mono text-[10px] tracking-[0.16em] text-cyan-300">
              US 4,765,668 · PROCEDURAL 3D
            </p>
            <p className="mt-1 text-sm font-medium text-white">
              Double-handed end-effector kinematics
            </p>
          </div>
          <div className="rounded-xl border border-amber-800/70 bg-amber-950/85 px-3 py-2 text-right text-[11px] leading-4 text-amber-100 backdrop-blur sm:max-w-xs">
            Lead and encoder step are source-bound. Frame/finger proportions are illustrative.
          </div>
        </div>

        <div className="pointer-events-none absolute left-3 top-24 rounded-xl border border-slate-700/80 bg-slate-950/85 p-2.5 font-mono text-[11px] text-slate-200 backdrop-blur sm:left-5">
          <p>
            GAP <span className="text-cyan-300">{(state.jawOpeningM * 1000).toFixed(1)} mm</span>
          </p>
          <p>
            MIDPOINT <span className="text-emerald-300">fixed ideal 0.000 mm</span>
          </p>
          <p>
            ENCODER{" "}
            <span className="text-amber-300">{state.encoderCountModulo.toFixed(2)} / 8</span>
          </p>
        </div>

        <div className="absolute bottom-3 left-3 right-3 grid gap-3 rounded-xl border border-slate-700/80 bg-slate-950/90 p-3 backdrop-blur sm:bottom-5 sm:left-5 sm:right-5 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-xs text-slate-200">
              Jaw opening
              <span className="float-right font-mono text-cyan-300">
                {((params.jawOpeningFraction ?? 0.52) * 100).toFixed(0)}%
              </span>
              <input
                className="mt-1 w-full accent-cyan-400"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={params.jawOpeningFraction ?? 0.52}
                aria-label="Jaw opening fraction"
                onChange={(event) => updateParam("jawOpeningFraction", Number(event.target.value))}
              />
            </label>
            <label className="text-xs text-slate-200">
              Source-labelled grip setpoint
              <span className="float-right font-mono text-amber-300">
                {(params.gripForceSetpointN ?? 900).toFixed(0)} N
              </span>
              <input
                className="mt-1 w-full accent-amber-400"
                type="range"
                min="0"
                max="2000"
                step="25"
                value={params.gripForceSetpointN ?? 900}
                aria-label="Grip-force setpoint"
                onChange={(event) => updateParam("gripForceSetpointN", Number(event.target.value))}
              />
            </label>
            <label className="text-xs text-slate-200">
              Claim 17 frame rotation
              <span className="float-right font-mono text-violet-300">
                {(params.frameRotationDeg ?? 0).toFixed(0)}°
              </span>
              <input
                className="mt-1 w-full accent-violet-400"
                type="range"
                min="-180"
                max="180"
                step="1"
                value={params.frameRotationDeg ?? 0}
                aria-label="Longitudinal-axis frame rotation"
                onChange={(event) => updateParam("frameRotationDeg", Number(event.target.value))}
              />
            </label>
            <label className="text-xs text-slate-200">
              Finger change sequence
              <span className="float-right font-mono text-rose-300">
                {((params.fingerChangeFraction ?? 0) * 100).toFixed(0)}%
              </span>
              <input
                className="mt-1 w-full accent-rose-400"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={params.fingerChangeFraction ?? 0}
                aria-label="Finger-change sequence"
                onChange={(event) =>
                  updateParam("fingerChangeFraction", Number(event.target.value))
                }
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
        </div>
      </div>
    </section>
  );
}
