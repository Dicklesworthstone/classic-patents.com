"use client";

import { Eye, EyeOff, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { applyClaimConstraintModifications } from "@/physics/claimConstraints";
import {
  CLAVEL_DELTA_ROBOT_CLAIM_PROBE_PARAMS,
  readClavelDeltaRobotClaimStates,
  stepClavelDeltaRobotTopology,
} from "@/physics/clavelDeltaRobotKernel";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { buildClavelDeltaRobotModel } from "./clavelDeltaRobotModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";

const PATENT_ID = "us-4976582-clavel-delta-robot";

const VIEWS = {
  overview: {
    position: [4.4, 2.7, 5.0] as [number, number, number],
    target: [0, -0.1, 0] as [number, number, number],
  },
  platform: {
    position: [2.1, 0.3, 2.7] as [number, number, number],
    target: [0, -0.78, 0] as [number, number, number],
  },
  base: {
    position: [0.05, 4.1, 0.1] as [number, number, number],
    target: [0, 0.2, 0] as [number, number, number],
  },
} as const;

const ARM_CONTROLS = [
  { id: "armOneInput", label: "Arm 1", color: "text-cyan-300", accent: "accent-cyan-400" },
  { id: "armTwoInput", label: "Arm 2", color: "text-amber-300", accent: "accent-amber-400" },
  { id: "armThreeInput", label: "Arm 3", color: "text-violet-300", accent: "accent-violet-400" },
] as const;

/** Procedural Three.js studio driven only by the shared patent-physics bus. */
export function ClavelDeltaRobot3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const liveParams = useRef<Record<string, number>>({});
  const [view, setView] = useState<keyof typeof VIEWS>("overview");
  const [showUiOverlay, setShowUiOverlay] = useState(true);
  const [webglUnavailable, setWebglUnavailable] = useState(false);
  const { params, updateParam, resetParams } = usePatentPhysics(PATENT_ID);
  const claimStates = useMemo(() => readClavelDeltaRobotClaimStates(params), [params]);
  const claimResult = useMemo(
    () => applyClaimConstraintModifications(PATENT_ID, params, claimStates),
    [params, claimStates],
  );
  liveParams.current = claimResult.modifiedParams;
  const state = useMemo(
    () => stepClavelDeltaRobotTopology(claimResult.modifiedParams),
    [claimResult.modifiedParams],
  );

  // The hook records a typed refusal boundary rather than claiming that a
  // FrankenSim/WASM rigid-body solver ran. The patent lacks the values needed
  // for an auditable SI closed-loop Delta model.
  useFrankenSimPhysics(PATENT_ID, {
    domain: "solid_mechanics",
    refusal: { isRefused: true, reason: state.refusal.reason },
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const initial = VIEWS.overview;
    let studio: StudioContext;
    try {
      studio = createThreeStudioScene({
        container,
        cameraPos: initial.position,
        targetPos: initial.target,
        environmentStyle: "studio",
        enableClouds: false,
        ambientIntensity: 2.6,
        sunIntensity: 3.0,
        cameraMinDistance: 2.2,
        cameraMaxDistance: 11,
      });
    } catch {
      setWebglUnavailable(true);
      return;
    }
    studioRef.current = studio;
    const { scene, camera, renderer, controls } = studio;

    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.65,
      metalness: 0.24,
    });
    const floor = new THREE.Mesh(new THREE.CircleGeometry(3.35, 64), floorMaterial);
    floor.name = "Normalized exhibit floor";
    floor.rotation.x = -Math.PI / 2;
    // Kept below the declared normalized platform/tool display envelope; this
    // is framing geometry, not a source-backed floor height.
    floor.position.y = -2.18;
    floor.receiveShadow = true;
    scene.add(floor);

    const model = buildClavelDeltaRobotModel();
    model.updatePose(stepClavelDeltaRobotTopology(liveParams.current));
    scene.add(model.root);
    const axes = new THREE.AxesHelper(0.7);
    axes.position.set(-1.75, -2.08, -1.4);
    scene.add(axes);

    const clock = createStudioClock();
    let frame = 0;
    const animate = (now: number) => {
      frame = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      clock.pump(now);
      model.updatePose(stepClavelDeltaRobotTopology(liveParams.current));
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

  const selectView = (next: keyof typeof VIEWS) => {
    setView(next);
    const nextView = VIEWS[next];
    studioRef.current?.controls.setView(nextView.position, nextView.target);
  };

  const setClaim = (number: number, active: boolean) => {
    const key =
      CLAVEL_DELTA_ROBOT_CLAIM_PROBE_PARAMS[
        number as keyof typeof CLAVEL_DELTA_ROBOT_CLAIM_PROBE_PARAMS
      ];
    if (key) updateParam(key, active ? 1 : 0);
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">
      <div className="relative min-h-[440px] sm:min-h-[540px]">
        <div ref={containerRef} className="absolute inset-0" />
        {webglUnavailable && (
          <div
            className="absolute inset-0 z-10 grid place-items-center bg-slate-950/95 p-6 text-center"
            role="status"
            aria-live="polite"
            data-clavel-delta-robot-webgl-fallback="true"
          >
            <div className="max-w-md rounded-2xl border border-amber-700/70 bg-slate-900 p-5 shadow-2xl">
              <p className="font-mono text-[11px] tracking-[0.15em] text-amber-300">
                3D STUDIO UNAVAILABLE
              </p>
              <h4 className="mt-2 font-serif text-xl text-white">
                This browser cannot create WebGL.
              </h4>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                The source, shared telemetry, and claim probes remain available. Choose the 2D
                Diagram view to inspect the same source-bounded Delta topology without WebGL.
              </p>
            </div>
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-3 top-3 z-10 sm:inset-x-5 sm:top-5">
          {showUiOverlay && (
            <div className="flex items-start justify-between gap-3 pr-11">
              <div className="rounded-xl border border-cyan-700/70 bg-slate-950/85 px-3 py-2 backdrop-blur">
                <p className="font-mono text-[10px] tracking-[0.16em] text-cyan-300">
                  US 4,976,582 · PROCEDURAL 3D
                </p>
                <p className="mt-1 text-sm font-medium text-white">
                  Three paired-bar legs · one fixed-attitude platform
                </p>
              </div>
              <div className="max-w-xs rounded-xl border border-rose-800/70 bg-rose-950/85 px-3 py-2 text-right text-[11px] leading-4 text-rose-100 backdrop-blur">
                Source-bounded topology only. No WASM step, SI dynamics, payload, speed, or accuracy
                claim.
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowUiOverlay((current) => !current)}
            aria-pressed={showUiOverlay}
            aria-label={
              showUiOverlay
                ? "Hide studio controls and notices"
                : "Show studio controls and notices"
            }
            data-clavel-delta-robot-ui-toggle="true"
            className="pointer-events-auto absolute right-0 top-0 flex min-h-9 items-center gap-1 rounded-lg border border-slate-600 bg-slate-950/90 px-2 text-[11px] text-slate-100 backdrop-blur hover:bg-slate-800"
          >
            {showUiOverlay ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{showUiOverlay ? "Hide UI" : "Show UI"}</span>
          </button>
        </div>

        {showUiOverlay && (
          <div
            className="absolute bottom-3 left-3 right-3 max-h-[calc(100%-4.5rem)] overflow-y-auto rounded-xl border border-slate-700/80 bg-slate-950/90 p-3 backdrop-blur sm:bottom-5 sm:left-5 sm:right-5"
            data-clavel-delta-robot-ui-overlay="true"
          >
            <div className="grid gap-2 sm:grid-cols-4">
              {ARM_CONTROLS.map((control) => {
                const value = params[control.id] ?? 0;
                return (
                  <label className="text-xs text-slate-200" key={control.id}>
                    <span className={control.color}>{control.label}</span>
                    <span className="float-right font-mono">{value.toFixed(2)}</span>
                    <input
                      className={`mt-1 w-full ${control.accent}`}
                      type="range"
                      min="-1"
                      max="1"
                      step="0.02"
                      value={value}
                      aria-label={`${control.label} normalized input`}
                      onChange={(event) => updateParam(control.id, Number(event.target.value))}
                    />
                  </label>
                );
              })}
              <label className="text-xs text-slate-200">
                <span className="text-amber-300">Tool axis</span>
                <span className="float-right font-mono">
                  {(params.toolAxisInput ?? 0).toFixed(2)}
                </span>
                <input
                  className="mt-1 w-full accent-amber-400"
                  type="range"
                  min="-1"
                  max="1"
                  step="0.02"
                  value={params.toolAxisInput ?? 0}
                  aria-label="Tool-axis normalized input"
                  onChange={(event) => updateParam("toolAxisInput", Number(event.target.value))}
                />
              </label>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-3">
              <div className="flex flex-wrap gap-2">
                {(Object.keys(VIEWS) as Array<keyof typeof VIEWS>).map((candidate) => (
                  <button
                    key={candidate}
                    type="button"
                    onClick={() => selectView(candidate)}
                    className={
                      "min-h-9 rounded-lg border px-2.5 text-xs capitalize " +
                      (view === candidate
                        ? "border-cyan-400 bg-cyan-500 text-slate-950"
                        : "border-slate-600 bg-slate-900 text-slate-200 hover:bg-slate-800")
                    }
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
              <span className="font-mono text-[10px] text-slate-400">
                {state.status.replaceAll("-", " ").toUpperCase()}
              </span>
            </div>
            <ClaimConstraintToggle
              patentId={PATENT_ID}
              claimStates={{ ...claimStates }}
              onToggleClaim={setClaim}
              className="mt-3 border-t border-slate-800 pt-3"
            />
          </div>
        )}
      </div>
    </section>
  );
}
