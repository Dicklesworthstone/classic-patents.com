"use client";

import { Eye, EyeOff, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import { stepLemelsonManipulatorTopology } from "@/physics/lemelsonAdjustableManipulatorKernel";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import {
  LEMELSON_ADJUSTABLE_MANIPULATOR_CAMERA_VIEWS,
  type LemelsonAdjustableManipulatorCameraView,
  lemelsonAdjustableManipulatorViewForViewport,
} from "./lemelsonAdjustableManipulatorCamera";
import { buildLemelsonAdjustableManipulatorModel } from "./lemelsonAdjustableManipulatorModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

const PATENT_ID = "us-3260375-lemelson-adjustable-manipulator";

const POSE_CONTROLS = [
  {
    id: "carriagePosition",
    label: "Carriage Display Coordinate",
    min: -1,
    max: 1,
    defaultValue: 0.15,
    accent: "accent-cyan-400",
  },
  {
    id: "columnElevation",
    label: "Vertical-Member Display Coordinate",
    min: 0,
    max: 1,
    defaultValue: 0.65,
    accent: "accent-indigo-400",
  },
  {
    id: "columnAzimuth",
    label: "Rotary Display Coordinate",
    min: -1,
    max: 1,
    defaultValue: 0.25,
    accent: "accent-amber-400",
  },
  {
    id: "wristPivot",
    label: "Pivot-Joint Display Coordinate",
    min: -1,
    max: 1,
    defaultValue: -0.2,
    accent: "accent-emerald-400",
  },
  {
    id: "jawClosure",
    label: "Illustrated Jaw Closure",
    min: 0,
    max: 1,
    defaultValue: 0.45,
    accent: "accent-rose-400",
  },
  {
    id: "stop1Azimuth",
    label: "Rotary Actuator 1 Display Position",
    min: -1,
    max: 1,
    defaultValue: -0.75,
    accent: "accent-amber-400",
  },
  {
    id: "stop2Azimuth",
    label: "Rotary Actuator 2 Display Position",
    min: -1,
    max: 1,
    defaultValue: 0.75,
    accent: "accent-orange-400",
  },
  {
    id: "stop1Elevation",
    label: "Vertical Actuator 1 Display Position",
    min: 0,
    max: 1,
    defaultValue: 0.15,
    accent: "accent-indigo-400",
  },
  {
    id: "stop2Elevation",
    label: "Vertical Actuator 2 Display Position",
    min: 0,
    max: 1,
    defaultValue: 0.85,
    accent: "accent-violet-400",
  },
] as const;

export function LemelsonAdjustableManipulator3D({
  patentId = PATENT_ID,
}: {
  patentId?: string;
} = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [view, setView] = useState<LemelsonAdjustableManipulatorCameraView>("overview");
  const [interfaceVisible, setInterfaceVisible] = useState(true);
  const { params, effectiveParams, claimStates, claimConstraintResult, updateParam, resetParams } =
    usePatentPhysics(PATENT_ID);
  const liveParams = useLiveSimParams(effectiveParams);
  const state = stepLemelsonManipulatorTopology(effectiveParams);

  useFrankenSimPhysics(patentId, {
    domain: "solid_mechanics",
    refusal: {
      isRefused: true,
      reason: claimConstraintResult.refusalWarning ?? state.refusal.reason,
    },
  });

  const selectView = (nextView: LemelsonAdjustableManipulatorCameraView) => {
    setView(nextView);
    const camera = lemelsonAdjustableManipulatorViewForViewport(
      nextView,
      containerRef.current?.clientWidth ?? 640,
    );
    studioRef.current?.controls.setView(camera.position, camera.target);
  };

  // The mounted render loop reads this stable, layout-effect-synchronized ref; depending on its current value would rebuild the Three.js scene.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // Start every visitor with the complete supported apparatus. The former
    // phone-only wrist close-up hid the gantry, carriage, and most of the load
    // path on first paint; Wrist remains available as an explicit detail view.
    const initialView = "overview";
    const initialCamera = lemelsonAdjustableManipulatorViewForViewport(
      initialView,
      container.clientWidth,
    );
    setView(initialView);
    const studio = createThreeStudioScene({
      container,
      cameraPos: initialCamera.position,
      targetPos: initialCamera.target,
      environmentStyle: "studio",
      enableClouds: false,
      ambientIntensity: 2.5,
      sunIntensity: 3.0,
      cameraMinDistance: 2.0,
      cameraMaxDistance: 15.0,
    });
    studioRef.current = studio;
    const { scene, camera, renderer, controls } = studio;

    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.3,
      roughness: 0.7,
    });
    const floor = new THREE.Mesh(new THREE.CircleGeometry(5.0, 64), floorMaterial);
    floor.name = "factory floor reference";
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.5;
    floor.receiveShadow = true;
    scene.add(floor);

    const model = buildLemelsonAdjustableManipulatorModel();
    model.updateState(stepLemelsonManipulatorTopology(liveParams.current));
    scene.add(model.root);

    let frame = 0;
    const clock = createStudioClock();
    const animate = (now: number) => {
      frame = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      clock.pump(now);
      model.updateState(stepLemelsonManipulatorTopology(liveParams.current));
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
    <section className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">
      <div className="relative min-h-[500px] sm:min-h-[630px]">
        <div ref={containerRef} className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-x-5 top-5 hidden items-start justify-between gap-3 lg:flex">
          <div className="rounded-xl border border-cyan-700/70 bg-slate-950/85 px-3 py-2 backdrop-blur">
            <p className="font-mono text-[10px] tracking-[0.16em] text-cyan-300">
              US 3,260,375 · ADJUSTABLE MANIPULATOR TOPOLOGY
            </p>
            <h3 className="text-sm font-semibold text-white">Procedural WebGL Topology Model</h3>
          </div>

          <div className="pointer-events-auto flex w-full items-center justify-end gap-2 sm:w-auto">
            <div className="flex rounded-lg border border-slate-700 bg-slate-900/80 p-0.5 backdrop-blur">
              {(
                Object.keys(
                  LEMELSON_ADJUSTABLE_MANIPULATOR_CAMERA_VIEWS,
                ) as LemelsonAdjustableManipulatorCameraView[]
              ).map((vKey) => (
                <button
                  key={vKey}
                  type="button"
                  onClick={() => selectView(vKey)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                    view === vKey
                      ? "bg-cyan-500/20 text-cyan-300"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {vKey}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setInterfaceVisible((prev) => !prev)}
              className="rounded-lg border border-slate-700 bg-slate-900/80 p-1.5 text-slate-300 hover:text-white backdrop-blur"
              title={interfaceVisible ? "Hide controls panel" : "Show controls panel"}
            >
              {interfaceVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
      {interfaceVisible && (
        <div
          data-mobile-layout="controls-below-canvas"
          className="border-t border-slate-800 bg-slate-900/95 p-4 text-slate-200"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Normalized Display Controls
            </h4>
            <button
              type="button"
              onClick={resetParams}
              className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-xs text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          </div>

          <div
            data-responsive-view-deck
            className="mt-3 flex flex-wrap items-center gap-2 lg:hidden"
          >
            <span className="mr-1 text-[11px] font-mono uppercase tracking-wide text-slate-400">
              Camera
            </span>
            {(
              Object.keys(
                LEMELSON_ADJUSTABLE_MANIPULATOR_CAMERA_VIEWS,
              ) as LemelsonAdjustableManipulatorCameraView[]
            ).map((vKey) => (
              <button
                key={vKey}
                type="button"
                onClick={() => selectView(vKey)}
                className={`min-h-9 rounded-lg border px-2.5 text-xs font-medium capitalize transition-colors ${
                  view === vKey
                    ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                    : "border-slate-700 bg-slate-900 text-slate-300 hover:text-white"
                }`}
              >
                {vKey}
              </button>
            ))}
          </div>

          <div className="mt-3 grid gap-x-5 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {POSE_CONTROLS.map((ctrl) => {
              const val = (params[ctrl.id] ?? ctrl.defaultValue) as number;
              return (
                <div key={ctrl.id} className="space-y-1">
                  <div className="flex justify-between gap-2 text-xs">
                    <label htmlFor={`3d-${ctrl.id}`} className="text-slate-300">
                      {ctrl.label}
                    </label>
                    <span className="shrink-0 font-mono text-cyan-300">{val.toFixed(2)}</span>
                  </div>
                  <input
                    id={`3d-${ctrl.id}`}
                    type="range"
                    min={ctrl.min}
                    max={ctrl.max}
                    step={0.05}
                    value={val}
                    onChange={(e) => updateParam(ctrl.id, Number.parseFloat(e.target.value))}
                    className={`h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 ${ctrl.accent}`}
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-4 border-t border-slate-800 pt-3 text-[11px] leading-relaxed text-slate-400">
            <p className="font-mono font-semibold text-cyan-300">Display boundary:</p>
            <p>
              The source illustrates carriage, column, rotary, pivot, jaw, and switch-actuator
              relationships. All scene lengths and transforms are procedural; no source dimensions,
              speed, force, timing, or controller-performance result is displayed.
            </p>
          </div>
        </div>
      )}
      <div className="grid gap-3 border-t border-slate-800 bg-slate-950/95 p-4">
        <ClaimConstraintToggle
          patentId={PATENT_ID}
          claimStates={claimStates}
          onToggleClaim={(claimNumber, active) =>
            updateParam(claimConstraintStateParamId(claimNumber), active ? 1 : 0)
          }
        />
        <p className="font-mono text-[11px] text-cyan-200">
          {state.activeClaimScope}: {state.activeClaimStatus.toUpperCase()}
        </p>
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
      </div>
    </section>
  );
}
