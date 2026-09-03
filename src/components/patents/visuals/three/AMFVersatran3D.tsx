"use client";

import { Eye, EyeOff, RotateCcw } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import {
  AMF_VERSATRAN_CLAIM_PROBE_PARAMS,
  readAmfVersatranClaimStates,
  stepAmfVersatranTopology,
} from "@/physics/amfVersatranKernel";
import { applyClaimConstraintModifications } from "@/physics/claimConstraints";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import {
  AMF_VERSATRAN_CAMERA_VIEWS,
  type AmfVersatranCameraView,
  amfVersatranViewForViewport,
} from "./amfVersatranCamera";
import { buildAmfVersatranModel } from "./amfVersatranModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

const PATENT_ID = "us-3212649-amf-versatran";
const SOURCE_BOUNDARY_MESSAGE =
  "Normalized topology only. The grant does not publish a dimension table, payload, pressure, flow, timing, force, or performance calibration.";

const POSE_CONTROLS = [
  {
    id: "columnRotation",
    label: "Column rotation",
    min: -1,
    max: 1,
    defaultValue: 0,
    accent: "accent-cyan-400",
  },
  {
    id: "carriageLift",
    label: "Carriage lift",
    min: 0,
    max: 1,
    defaultValue: 0.55,
    accent: "accent-violet-400",
  },
  {
    id: "armTravel",
    label: "Arm travel",
    min: 0,
    max: 1,
    defaultValue: 0.55,
    accent: "accent-amber-400",
  },
  {
    id: "wristRotation",
    label: "Wrist rotation · arm axis",
    min: -1,
    max: 1,
    defaultValue: 0,
    accent: "accent-purple-400",
  },
  {
    id: "wristSwing",
    label: "Wrist swing · vertical axis",
    min: -1,
    max: 1,
    defaultValue: 0,
    accent: "accent-purple-400",
  },
  {
    id: "gripperOperation",
    label: "Gripper operation",
    min: 0,
    max: 1,
    defaultValue: 0.25,
    accent: "accent-amber-400",
  },
] as const;

/**
 * Procedural Three.js face for US 3,212,649. It reads the shared normalized
 * topology kernel and explicitly reports its refusal because the grant does
 * not publish inputs needed for a source-backed dynamic body model.
 */
export function AmfVersatran3D({ patentId = PATENT_ID }: { patentId?: string } = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [view, setView] = useState<AmfVersatranCameraView>("overview");
  const [interfaceVisible, setInterfaceVisible] = useState(true);
  const [webglUnavailable, setWebglUnavailable] = useState(false);
  const { params, updateParam, resetParams } = usePatentPhysics(patentId);
  const claimStates = useMemo(() => readAmfVersatranClaimStates(params), [params]);
  const claimResult = useMemo(
    () => applyClaimConstraintModifications(PATENT_ID, params, claimStates),
    [params, claimStates],
  );
  const liveParams = useLiveSimParams(claimResult.modifiedParams);
  const state = stepAmfVersatranTopology(claimResult.modifiedParams);
  const claim1Active = claimStates[1] ?? true;
  const claim8Active = claimStates[8] ?? true;
  const claim12Active = claimStates[12] ?? true;

  useFrankenSimPhysics(patentId, {
    domain: "solid_mechanics",
    refusal: { isRefused: true, reason: state.refusal.reason },
  });

  const selectView = (nextView: AmfVersatranCameraView) => {
    setView(nextView);
    const camera = amfVersatranViewForViewport(nextView, containerRef.current?.clientWidth ?? 1000);
    studioRef.current?.controls.setView(camera.position, camera.target);
  };

  // Resolve the WebGL fallback before the browser paints: a passive effect can
  // briefly show an empty canvas and controls when WebGL creation fails.
  // `useLiveSimParams` returns one stable ref object; keeping that object in
  // the dependency list preserves the mounted studio while avoiding a stale
  // initial pose. Deliberately do not depend on its mutable `.current` value.
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let studio: StudioContext;
    try {
      studio = createThreeStudioScene({
        container,
        cameraPos: amfVersatranViewForViewport("overview", container.clientWidth).position,
        targetPos: amfVersatranViewForViewport("overview", container.clientWidth).target,
        environmentStyle: "studio",
        enableClouds: false,
        ambientIntensity: 2.7,
        sunIntensity: 3.1,
        cameraMinDistance: 2.3,
        cameraMaxDistance: 13,
      });
    } catch {
      // A blocked GPU or a browser without WebGL must not take down the full
      // patent page. The dispatcher still exposes the shared 2D instrument.
      setWebglUnavailable(true);
      return;
    }
    studioRef.current = studio;
    const { scene, camera, renderer, controls } = studio;

    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x020617,
      metalness: 0.22,
      roughness: 0.78,
    });
    const floor = new THREE.Mesh(new THREE.CircleGeometry(4.85, 64), floorMaterial);
    floor.name = "normalized museum floor";
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.01;
    floor.receiveShadow = true;
    scene.add(floor);

    const model = buildAmfVersatranModel();
    model.updateState(stepAmfVersatranTopology(liveParams.current));
    scene.add(model.root);
    const axes = new THREE.AxesHelper(0.72);
    axes.position.set(-2.4, -0.99, -1.35);
    scene.add(axes);

    let frame = 0;
    const clock = createStudioClock();
    const animate = (now: number) => {
      frame = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      clock.pump(now);
      model.updateState(stepAmfVersatranTopology(liveParams.current));
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

  useEffect(() => {
    const restoreResponsiveView = () => {
      const container = containerRef.current;
      if (!container) return;
      const camera = amfVersatranViewForViewport(view, container.clientWidth);
      studioRef.current?.controls.setView(camera.position, camera.target);
    };
    window.addEventListener("resize", restoreResponsiveView);
    return () => window.removeEventListener("resize", restoreResponsiveView);
  }, [view]);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">
      <div className="relative min-h-[500px] pt-[432px] lg:pt-[642px]">
        <div
          ref={containerRef}
          className="absolute inset-x-0 top-0 h-[420px] lg:h-[630px]"
          data-mobile-layout="dedicated-model-viewport"
        />
        {webglUnavailable && (
          <div
            className="absolute inset-x-0 top-0 z-10 grid h-[420px] place-items-center bg-slate-950/95 p-6 text-center lg:h-[630px]"
            role="status"
            aria-live="polite"
            data-amf-versatran-webgl-fallback="true"
          >
            <div className="max-w-md rounded-2xl border border-amber-700/70 bg-slate-900 p-5 shadow-2xl">
              <p className="font-mono text-[11px] tracking-[0.15em] text-amber-300">
                3D STUDIO UNAVAILABLE
              </p>
              <h4 className="mt-2 font-serif text-xl text-white">
                This browser cannot create WebGL.
              </h4>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                The archival source, shared telemetry, and claim probes remain available. Choose the
                2D Diagram view to inspect the same source-bounded AMF topology without WebGL.
              </p>
            </div>
          </div>
        )}
        {!webglUnavailable && !claim1Active && (
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-[420px] items-center justify-center bg-slate-950/65 p-6 text-center backdrop-blur-[2px] lg:h-[630px]"
            role="status"
            data-amf-versatran-claim-1-withheld="true"
          >
            <div className="max-w-md rounded-2xl border border-rose-700/80 bg-slate-950/95 p-5 shadow-2xl">
              <p className="font-mono text-[11px] tracking-[0.15em] text-rose-300">
                CLAIM 1 TOPOLOGY WITHHELD
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                This viewport deliberately does not assert the six-actuator hydraulic/servo-valve
                combination while Claim 1 is inverted. The source text and 2D topology remain
                available below; the empty apparatus is a boundary, not a render failure.
              </p>
            </div>
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-3 top-3 hidden items-start justify-between gap-3 sm:inset-x-5 sm:top-5 sm:flex">
          <div className="rounded-xl border border-cyan-700/70 bg-slate-950/85 px-3 py-2 backdrop-blur">
            <p className="font-mono text-[10px] tracking-[0.16em] text-cyan-300">
              US 3,212,649 · PROCEDURAL 3D
            </p>
            <p className="mt-1 text-sm font-medium text-white">
              Column B · carriage C · arm A · wrist G
            </p>
          </div>
          <button
            type="button"
            onClick={() => setInterfaceVisible((current) => !current)}
            className="pointer-events-auto inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-600 bg-slate-950/90 px-2.5 text-xs text-slate-100 backdrop-blur hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
            aria-pressed={!interfaceVisible}
          >
            {interfaceVisible ? (
              <EyeOff className="h-3.5 w-3.5" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}
            {interfaceVisible ? "Hide UI" : "Show UI"}
          </button>
        </div>

        {interfaceVisible && !webglUnavailable && (
          <>
            <div className="pointer-events-none absolute left-3 top-24 hidden rounded-xl border border-slate-700/80 bg-slate-950/85 p-2.5 font-mono text-[11px] text-slate-200 backdrop-blur sm:left-5 sm:block">
              <p>
                MODE{" "}
                <span className="text-cyan-300">
                  {state.programMode === "manual-teach-and-record"
                    ? "TEACH / RECORD"
                    : "RECORDED-SIGNAL PLAYBACK"}
                </span>
              </p>
              <p>
                TRACKING <span className="text-amber-300">{state.trackingState.toUpperCase()}</span>
              </p>
              <p>
                CLAIM <span className="text-violet-300">{state.activeClaim}</span> · max |e|{" "}
                <span className="text-rose-300">
                  {state.maximumNormalizedPhaseError.toFixed(2)}
                </span>
              </p>
            </div>
            <p className="pointer-events-none absolute right-3 top-24 hidden max-w-[15rem] rounded-xl border border-rose-900/70 bg-rose-950/88 px-3 py-2 text-right text-[10px] leading-4 text-rose-100 backdrop-blur sm:right-5 sm:block">
              {SOURCE_BOUNDARY_MESSAGE}
            </p>

            <div
              className="relative z-20 mx-3 grid scroll-mt-24 gap-3 rounded-xl border border-slate-700/90 bg-slate-950/92 p-3 backdrop-blur"
              data-mobile-layout="controls-after-canvas"
            >
              <p className="rounded-lg border border-rose-900/70 bg-rose-950/60 p-2 text-[11px] leading-4 text-rose-100 sm:hidden">
                {SOURCE_BOUNDARY_MESSAGE}
              </p>
              <p className="rounded-lg border border-slate-700/80 bg-slate-900/80 p-2 font-mono text-[10px] leading-4 text-slate-200 sm:hidden">
                MODE{" "}
                <span className="text-cyan-300">
                  {state.programMode === "manual-teach-and-record"
                    ? "TEACH / RECORD"
                    : "RECORDED-SIGNAL PLAYBACK"}
                </span>
                {" · "}TRACKING{" "}
                <span className="text-amber-300">{state.trackingState.toUpperCase()}</span>
              </p>
              <ClaimConstraintToggle
                patentId={PATENT_ID}
                claimStates={claimStates}
                onToggleClaim={(claimNumber, active) => {
                  const claimProbeParam =
                    AMF_VERSATRAN_CLAIM_PROBE_PARAMS[
                      claimNumber as keyof typeof AMF_VERSATRAN_CLAIM_PROBE_PARAMS
                    ];
                  if (claimProbeParam) updateParam(claimProbeParam, active ? 1 : 0);
                  if (claimNumber === 8 && !active) updateParam("teachReplayMode", 0);
                }}
              />
              {claimResult.activeFailures.length > 0 && (
                <div role="status" className="rounded-lg border border-rose-800 bg-rose-950/80 p-2">
                  {claimResult.activeFailures.map((failure) => (
                    <p key={failure} className="text-[11px] leading-4 text-rose-100">
                      {failure}
                    </p>
                  ))}
                  {claimResult.refusalWarning && (
                    <p className="mt-1 text-[10px] leading-4 text-rose-200">
                      {claimResult.refusalWarning}
                    </p>
                  )}
                </div>
              )}
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {POSE_CONTROLS.map((control) => {
                  const value = params[control.id] ?? control.defaultValue;
                  return (
                    <label key={control.id} className="text-[11px] text-slate-200">
                      {control.label}
                      <span className="float-right font-mono text-cyan-300">
                        {value.toFixed(2)}
                      </span>
                      <input
                        className={`mt-1 w-full ${control.accent}`}
                        type="range"
                        min={control.min}
                        max={control.max}
                        step="0.05"
                        value={value}
                        aria-label={`${control.label} normalized display coordinate`}
                        onChange={(event) => updateParam(control.id, Number(event.target.value))}
                      />
                    </label>
                  );
                })}
                <label
                  className={`flex items-center justify-between gap-2 text-[11px] text-slate-200 ${
                    claim8Active ? "" : "cursor-not-allowed opacity-60"
                  }`}
                >
                  Recorded-signal playback
                  <input
                    className="h-4 w-4 accent-emerald-400"
                    type="checkbox"
                    disabled={!claim8Active}
                    checked={(params.teachReplayMode ?? 0) >= 0.5}
                    aria-label="Automatic recorded-signal playback"
                    onChange={(event) =>
                      updateParam("teachReplayMode", event.target.checked ? 1 : 0)
                    }
                  />
                </label>
                <label
                  className={`text-[11px] text-slate-200 ${
                    claim8Active ? "" : "cursor-not-allowed opacity-60"
                  }`}
                >
                  Illustrative record/feedback offset
                  <span className="float-right font-mono text-rose-300">
                    {(params.resolverPhaseOffset ?? 0).toFixed(2)}
                  </span>
                  <input
                    className="mt-1 w-full accent-rose-400"
                    type="range"
                    min="-1"
                    max="1"
                    step="0.05"
                    disabled={!claim8Active}
                    value={params.resolverPhaseOffset ?? 0}
                    aria-label="Illustrative normalized record and feedback phase offset"
                    onChange={(event) =>
                      updateParam("resolverPhaseOffset", Number(event.target.value))
                    }
                  />
                </label>
              </div>

              {!state.claimProbeStates[1] && (
                <p
                  role="status"
                  className="rounded-lg border border-rose-800 bg-rose-950/80 p-2 text-[11px] leading-4 text-rose-100"
                >
                  Claim 1 is withheld on the shared bus, so the six-actuator model is intentionally
                  removed rather than treated as a physical failure prediction.
                </p>
              )}
              <p className="rounded-lg border border-amber-900/70 bg-amber-950/25 p-2 text-[11px] leading-4 text-amber-100">
                Claim 12 probe: the procedural model shows paired engaging pinions and opposed rack
                motion only while the source-described gripper topology is live.{" "}
                {claim12Active ? "Pinion/rack topology live." : "Pinion/rack topology withheld."}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="max-w-2xl text-[11px] leading-4 text-slate-300">
                  Claims 1, 8, and 12 are made legible as six named motions, a manual teach/record
                  path, recorded-signal playback, and a pair of gripping fingers. The cyan and amber
                  display positions are normalized signals, not a physical rate.
                </p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(AMF_VERSATRAN_CAMERA_VIEWS) as AmfVersatranCameraView[]).map(
                    (candidate) => (
                      <button
                        key={candidate}
                        type="button"
                        onClick={() => selectView(candidate)}
                        className={
                          "min-h-9 rounded-lg border px-2.5 text-xs capitalize focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 " +
                          (view === candidate
                            ? "border-cyan-400 bg-cyan-400 text-slate-950"
                            : "border-slate-600 bg-slate-900 text-slate-200 hover:bg-slate-800")
                        }
                      >
                        <Eye className="mr-1 inline h-3.5 w-3.5" />
                        {candidate}
                      </button>
                    ),
                  )}
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
          </>
        )}
      </div>
    </section>
  );
}

export const AMFVersatran3D = AmfVersatran3D;
