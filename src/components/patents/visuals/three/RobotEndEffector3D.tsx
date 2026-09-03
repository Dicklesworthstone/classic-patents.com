"use client";

import { Eye, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import {
  ROBOT_END_EFFECTOR_FRANKENSIM_CONTACT_OWNER,
  ROBOT_END_EFFECTOR_FRANKENSIM_HELICAL_OWNER,
  ROBOT_END_EFFECTOR_FRANKENSIM_PRISMATIC_OWNER,
  ROBOT_END_EFFECTOR_FRANKENSIM_REVOLUTE_OWNER,
  stepRobotEndEffector,
} from "@/physics/robotEndEffectorKernel";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { buildRobotEndEffectorModel } from "./robotEndEffectorModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

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

function viewForViewport(view: keyof typeof VIEWS, viewportWidth: number) {
  const configured = VIEWS[view];
  if (viewportWidth >= 640) return configured;
  const distanceScale = 1.55;
  return {
    position: configured.position.map(
      (coordinate, index) =>
        configured.target[index] + (coordinate - configured.target[index]) * distanceScale,
    ) as [number, number, number],
    target: configured.target,
  };
}

export function RobotEndEffector3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const { params, effectiveParams, claimStates, claimConstraintResult, updateParam, resetParams } =
    usePatentPhysics(PATENT_ID);
  const liveParams = useLiveSimParams(effectiveParams);
  const state = useMemo(() => stepRobotEndEffector(effectiveParams), [effectiveParams]);
  const [view, setView] = useState<keyof typeof VIEWS>("perspective");

  // This is a shared deterministic screw/encoder kernel. No FrankenSim/WASM
  // step is claimed because the source withholds contact, pneumatic, payload,
  // frame-dimension, and connector-stroke inputs needed for a body simulation.
  const refusalTelemetry = useMemo(
    () => ({
      domain: "solid_mechanics" as const,
      refusal: { isRefused: true as const, reason: state.sourceBoundary.note },
    }),
    [state.sourceBoundary.note],
  );
  useFrankenSimPhysics(PATENT_ID, refusalTelemetry);

  const selectView = (next: keyof typeof VIEWS) => {
    setView(next);
    const selected = viewForViewport(next, containerRef.current?.clientWidth ?? 640);
    studioRef.current?.controls.setView(selected.position, selected.target);
  };

  // The mounted render loop reads this stable, layout-effect-synchronized ref; depending on its current value would rebuild the Three.js scene.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const initialView = viewForViewport("perspective", container.clientWidth);
    const studio = createThreeStudioScene({
      container,
      cameraPos: initialView.position,
      targetPos: initialView.target,
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
    floor.position.y = -1.7;
    floor.receiveShadow = true;
    scene.add(floor);

    const model = buildRobotEndEffectorModel();
    scene.add(model.root);
    const axes = new THREE.AxesHelper(0.65);
    axes.position.set(-2.15, -1.6, -1.28);
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
  }, [liveParams]);

  return (
    <section
      className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl"
      data-testid="robot-end-effector-three"
      data-robot-end-effector-topology={state.claim1TopologyPresent ? "present" : "withheld"}
      data-robot-end-effector-jaw-gap-mm={(state.jawOpeningM * 1000).toFixed(1)}
      data-robot-end-effector-midpoint-mm={(state.symmetricMidpointM * 1000).toFixed(3)}
      data-robot-end-effector-finger-retained={state.fingerRetainedFraction.toFixed(3)}
      data-robot-end-effector-finger-withdrawal="inward"
      data-robot-end-effector-transverse={state.transverseOffsetNormalized.toFixed(3)}
      data-robot-end-effector-roll-deg={((state.frameRotationRad * 180) / Math.PI).toFixed(0)}
      data-robot-end-effector-helical-owner={state.owners.helical}
      data-robot-end-effector-roll-owner={state.owners.roll}
      data-robot-end-effector-transverse-owner={state.owners.transverse}
      data-robot-end-effector-contact-owner={state.owners.contactCandidate}
      data-robot-end-effector-boundary="refused-unparameterized"
      data-robot-end-effector-support="two-guides-engaged"
    >
      <div className="relative min-h-[440px] sm:min-h-[540px]">
        <div ref={containerRef} className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-x-3 top-3 hidden items-start justify-between gap-3 sm:flex sm:inset-x-5 sm:top-5">
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

        <div className="pointer-events-none absolute left-3 top-24 hidden rounded-xl border border-slate-700/80 bg-slate-950/85 p-2.5 font-mono text-[11px] text-slate-200 backdrop-blur sm:block sm:left-5">
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
          <p>
            GRIP REQUEST{" "}
            <span className="text-amber-300">
              {state.requestedGripForceN.toFixed(0)} N · command only
            </span>
          </p>
        </div>
      </div>
      <div
        data-mobile-layout="controls-below-canvas"
        className="grid gap-3 border-t border-slate-700/80 bg-slate-950/90 p-3 lg:grid-cols-[minmax(0,1fr)_auto]"
      >
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
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
            Requested grip command
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
              aria-label="Requested grip command bounded by source maximum"
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
            Finger change · fixture omitted
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
              onChange={(event) => updateParam("fingerChangeFraction", Number(event.target.value))}
            />
          </label>
          <label className="text-xs text-slate-200">
            Claim 16 transverse stage
            <span className="float-right font-mono text-emerald-300">
              {(params.transverseOffsetFraction ?? 0).toFixed(2)} normalized
            </span>
            <input
              className="mt-1 w-full accent-emerald-400"
              type="range"
              min="-1"
              max="1"
              step="0.05"
              value={params.transverseOffsetFraction ?? 0}
              aria-label="Source-described transverse stage normalized position"
              onChange={(event) =>
                updateParam("transverseOffsetFraction", Number(event.target.value))
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

        <p className="text-[11px] leading-4 text-slate-400 lg:col-span-2">
          Finger change is inward axial dovetail withdrawal, as Claim 13 requires. At full travel
          the removed fingers enter the source-mentioned stationary fixture, whose geometry the
          grant does not draw, and leave this normalized view. Amber arrows visualize the requested
          grip command only; without a workpiece/contact model they are not force vectors or
          achieved contact force. Claim 16 transverse motion is normalized because no stroke is
          printed.
        </p>

        <div className="grid gap-2 text-[11px] leading-4 sm:grid-cols-2 lg:col-span-2">
          <div className="rounded-lg border border-emerald-700/60 bg-emerald-950/30 p-2 text-emerald-100">
            <span className="font-mono font-bold text-emerald-300">GENERIC JOINT OWNERS</span>
            <p className="mt-1">
              {ROBOT_END_EFFECTOR_FRANKENSIM_HELICAL_OWNER} closes the opposed screw relation;{" "}
              {ROBOT_END_EFFECTOR_FRANKENSIM_REVOLUTE_OWNER} and{" "}
              {ROBOT_END_EFFECTOR_FRANKENSIM_PRISMATIC_OWNER} own the source-described connector
              roll and transverse guide.
            </p>
          </div>
          <div className="rounded-lg border border-rose-700/60 bg-rose-950/30 p-2 text-rose-100">
            <span className="font-mono font-bold text-rose-300">CONTACT SOLVE REFUSED</span>
            <p className="mt-1">
              {ROBOT_END_EFFECTOR_FRANKENSIM_CONTACT_OWNER} needs workpiece geometry, materials,
              friction, and contact approach that the grant does not print. Grip pressure, payload,
              deflection, power, and cycle time remain unreported.
            </p>
          </div>
        </div>

        {claimConstraintResult.activeFailures.length > 0 && (
          <div
            role="status"
            className="rounded-lg border border-rose-600/60 bg-rose-950/40 p-2 text-xs leading-5 text-rose-100 lg:col-span-2"
          >
            {claimConstraintResult.activeFailures.map((failure) => (
              <p key={failure}>{failure}</p>
            ))}
            {claimConstraintResult.refusalWarning && (
              <p className="mt-1 text-rose-200">{claimConstraintResult.refusalWarning}</p>
            )}
          </div>
        )}

        <div className="border-t border-slate-800 pt-2">
          <ClaimConstraintToggle
            patentId={PATENT_ID}
            claimStates={claimStates}
            onToggleClaim={(number, active) =>
              updateParam(claimConstraintStateParamId(number), active ? 1 : 0)
            }
          />
        </div>
      </div>
    </section>
  );
}
