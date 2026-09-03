"use client";

import { Eye, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import { stepGoertzMasterSlaveTopology } from "@/physics/goertzElectronicMasterSlaveManipulatorKernel";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { buildGoertzElectronicMasterSlaveManipulatorModel } from "./goertzElectronicMasterSlaveManipulatorModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

const PATENT_ID = "us-2846084-goertz-electronic-master-slave-manipulator";

const VIEWS = {
  overview: {
    position: [5.9, 3.8, 6.8] as [number, number, number],
    target: [0, -0.4, 0] as [number, number, number],
  },
  master: {
    position: [-4.7, 2.5, 4.5] as [number, number, number],
    target: [-2.1, -0.35, 0] as [number, number, number],
  },
  slave: {
    position: [4.7, 2.5, 4.5] as [number, number, number],
    target: [2.1, -0.35, 0] as [number, number, number],
  },
} as const;

type AxisControl = {
  id:
    | "horizontalArmPivot"
    | "horizontalArmRoll"
    | "verticalArmPivot"
    | "verticalArmRoll"
    | "toolAxis171"
    | "toolAxis172"
    | "gripperClosure";
  label: string;
  min: number;
  max: number;
  accent: string;
};

const AXIS_CONTROLS: readonly AxisControl[] = [
  {
    id: "horizontalArmPivot",
    label: "Arm 51 · axis 113b",
    min: -1,
    max: 1,
    accent: "accent-cyan-400",
  },
  {
    id: "horizontalArmRoll",
    label: "Arm 51 · axial roll",
    min: -1,
    max: 1,
    accent: "accent-cyan-400",
  },
  {
    id: "verticalArmPivot",
    label: "Arm 52 · axis 126",
    min: -1,
    max: 1,
    accent: "accent-violet-400",
  },
  {
    id: "verticalArmRoll",
    label: "Arm 52 · axial roll",
    min: -1,
    max: 1,
    accent: "accent-violet-400",
  },
  {
    id: "toolAxis171",
    label: "Tool 53 · axis 171",
    min: -1,
    max: 1,
    accent: "accent-amber-400",
  },
  {
    id: "toolAxis172",
    label: "Tool 53 · axis 172",
    min: -1,
    max: 1,
    accent: "accent-amber-400",
  },
  {
    id: "gripperClosure",
    label: "Tool 53 · close claw",
    min: 0,
    max: 1,
    accent: "accent-amber-400",
  },
];

function percent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function GoertzElectronicMasterSlaveManipulator3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [view, setView] = useState<keyof typeof VIEWS>("overview");
  const { params, effectiveParams, claimStates, claimConstraintResult, updateParam, resetParams } =
    usePatentPhysics(PATENT_ID);
  const liveParams = useLiveSimParams(effectiveParams);
  const pose = stepGoertzMasterSlaveTopology(effectiveParams);

  // The patent supplies topology, not the SI inputs that a physical robot-arm
  // simulation would need. This accurately records a typed refusal instead of
  // presenting the procedural exhibit as a FrankenSim/WASM force calculation.
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
    const initial = VIEWS.overview;
    const studio = createThreeStudioScene({
      container,
      cameraPos: initial.position,
      targetPos: initial.target,
      environmentStyle: "studio",
      enableClouds: false,
      ambientIntensity: 2.6,
      sunIntensity: 2.8,
      cameraMinDistance: 2.6,
      cameraMaxDistance: 13,
    });
    studioRef.current = studio;
    const { scene, camera, renderer, controls } = studio;

    const presentationFloorMaterial = new THREE.MeshStandardMaterial({
      color: 0x020617,
      roughness: 0.78,
      metalness: 0.18,
    });
    const presentationFloor = new THREE.Mesh(
      new THREE.CircleGeometry(5.4, 64),
      presentationFloorMaterial,
    );
    presentationFloor.name = "museum presentation floor";
    presentationFloor.rotation.x = -Math.PI / 2;
    presentationFloor.position.y = -2.03;
    presentationFloor.receiveShadow = true;
    scene.add(presentationFloor);

    const model = buildGoertzElectronicMasterSlaveManipulatorModel();
    scene.add(model.root);
    const axes = new THREE.AxesHelper(0.85);
    axes.position.set(-3.55, -1.95, -1.18);
    scene.add(axes);

    let frame = 0;
    const clock = createStudioClock();
    const animate = (now: number) => {
      frame = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      clock.pump(now);
      model.updatePose(stepGoertzMasterSlaveTopology(liveParams.current));
      controls.update();
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      model.dispose();
      presentationFloor.geometry.dispose();
      presentationFloorMaterial.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, []);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">
      <div className="relative min-h-[490px] sm:min-h-[610px]">
        <div ref={containerRef} className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-3 sm:inset-x-5 sm:top-5">
          <div className="rounded-xl border border-cyan-700/70 bg-slate-950/85 px-3 py-2 backdrop-blur">
            <p className="font-mono text-[10px] tracking-[0.16em] text-cyan-300">
              US 2,846,084 · PROCEDURAL 3D
            </p>
            <p className="mt-1 text-sm font-medium text-white">Master handle ↔ remote grasper</p>
          </div>
          <div className="rounded-xl border border-rose-800/70 bg-rose-950/90 px-3 py-2 text-right text-[11px] leading-4 text-rose-100 backdrop-blur sm:max-w-xs">
            Source-bound normalized topology. No dimensions, payload, force, speed, or WASM-step
            claim.
          </div>
        </div>
      </div>
      <div
        data-mobile-layout="controls-below-canvas"
        className="grid gap-3 border-t border-slate-700/90 bg-slate-950/95 p-3"
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
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {AXIS_CONTROLS.map((control) => {
            const value = params[control.id] ?? 0;
            return (
              <label key={control.id} className="text-[11px] text-slate-200">
                {control.label}
                <span className="float-right font-mono text-cyan-300">
                  {control.id === "gripperClosure" ? percent(value) : value.toFixed(2)}
                </span>
                <input
                  className={`mt-1 w-full ${control.accent}`}
                  type="range"
                  min={control.min}
                  max={control.max}
                  step="0.01"
                  value={value}
                  aria-label={control.label}
                  onChange={(event) => updateParam(control.id, Number(event.target.value))}
                />
              </label>
            );
          })}
          <label className="text-[11px] text-slate-200">
            Illustrative remote resistance
            <span className="float-right font-mono text-rose-300">
              {percent(params.contactResistance ?? 0)}
            </span>
            <input
              className="mt-1 w-full accent-rose-400"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={params.contactResistance ?? 0}
              aria-label="Illustrative remote contact resistance"
              onChange={(event) => updateParam("contactResistance", Number(event.target.value))}
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="max-w-xl text-[11px] leading-4 text-slate-300">
            Seven source-described channels synchronize the two articulated assemblies. An
            illustrative obstruction creates positional mismatch; the highlighted arrow appears only
            when Claim 9’s bilateral reflection is enabled.
          </p>
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
        <p className="rounded-lg border border-rose-900/70 bg-rose-950/35 px-2 py-1.5 text-[10px] leading-4 text-rose-100">
          {pose.refusal.reason}
        </p>
      </div>
    </section>
  );
}
