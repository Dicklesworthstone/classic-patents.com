"use client";

import { Eye, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import {
  MAKINO_FRANKENSIM_BOUNDARY,
  MAKINO_FRANKENSIM_OWNER,
  measureMakinoScaraInvariants,
  stepMakinoScaraTopology,
} from "@/physics/makinoScaraKernel";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import {
  MAKINO_SCARA_CAMERA_VIEWS,
  type MakinoScaraCameraView,
  makinoScaraFloorForViewport,
  makinoScaraViewForViewport,
} from "./makinoScaraCamera";
import {
  buildMakinoScaraModel,
  MAKINO_SCARA_BASE_BOTTOM_LOCAL_Y,
  MAKINO_SCARA_MODEL_FLOOR_Y,
  MAKINO_SCARA_MODEL_ROOT_Y,
} from "./makinoScaraModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

const PATENT_ID = "us-4341502-makino-scara";

export function MakinoScara3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [view, setView] = useState<MakinoScaraCameraView>("overview");
  const { params, effectiveParams, claimStates, claimConstraintResult, updateParam, resetParams } =
    usePatentPhysics(PATENT_ID);
  const liveParams = useLiveSimParams(effectiveParams);
  const pose = useMemo(() => stepMakinoScaraTopology(effectiveParams), [effectiveParams]);
  const measurements = useMemo(() => measureMakinoScaraInvariants(pose), [pose]);
  const topology = params.topologyVariant ?? 1;
  const effectiveTopology = effectiveParams.topologyVariant ?? topology;
  const toolAttitudeDeg = (pose.toolAttitudeRad * 180) / Math.PI;
  const baseFloorGap = Math.abs(
    MAKINO_SCARA_MODEL_ROOT_Y + MAKINO_SCARA_BASE_BOTTOM_LOCAL_Y - MAKINO_SCARA_MODEL_FLOOR_Y,
  );
  const refusalTelemetry = useMemo(
    () => ({
      domain: "solid_mechanics" as const,
      refusal: { isRefused: true as const, reason: pose.refusal.reason },
    }),
    [pose.refusal.reason],
  );

  // The generic fs-mbd joint owner is identified, but no FrankenSim/WASM badge
  // is shown because an un-dimensioned closed loop cannot produce an SI body
  // model. Memoizing this envelope also avoids republishing an identical
  // refusal merely because React rendered a new object identity.
  useFrankenSimPhysics(PATENT_ID, refusalTelemetry);

  const selectView = (next: MakinoScaraCameraView) => {
    setView(next);
    const camera = makinoScaraViewForViewport(next, containerRef.current?.clientWidth ?? 1000);
    studioRef.current?.controls.setView(camera.position, camera.target);
  };

  // The mounted render loop reads this stable, layout-effect-synchronized ref; depending on its current value would rebuild the Three.js scene.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const initial = makinoScaraViewForViewport("overview", container.clientWidth);
    const floorPlan = makinoScaraFloorForViewport(container.clientWidth);
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
    const floor = new THREE.Mesh(new THREE.CircleGeometry(floorPlan.radius, 64), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(floorPlan.centerX, MAKINO_SCARA_MODEL_FLOOR_Y, 0);
    floor.receiveShadow = true;
    scene.add(floor);

    const model = buildMakinoScaraModel();
    scene.add(model.root);

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
  }, [liveParams]);

  // Keep an actively selected inspection view responsive when a handset
  // rotates or its viewport changes. The compact overview is derived from
  // the linkage's moving envelope, so it must be recalculated at the new width.
  useEffect(() => {
    const restoreResponsiveView = () => {
      const container = containerRef.current;
      if (!container) return;
      const camera = makinoScaraViewForViewport(view, container.clientWidth);
      studioRef.current?.controls.setView(camera.position, camera.target);
    };
    window.addEventListener("resize", restoreResponsiveView);
    return () => window.removeEventListener("resize", restoreResponsiveView);
  }, [view]);

  return (
    <section
      data-testid="makino-scara-three"
      data-topology={pose.topology}
      data-base-axis-gap={measurements.baseAxisGap.toFixed(12)}
      data-first-link-length={measurements.firstDrivenLinkLength.toFixed(12)}
      data-fourth-link-length={measurements.fourthDrivenLinkLength.toFixed(12)}
      data-second-link-length={measurements.secondFollowerLength.toFixed(12)}
      data-third-link-length={measurements.thirdFollowerLength.toFixed(12)}
      data-tool-pivot-gap={measurements.toolPivotGap.toFixed(12)}
      data-fixed-member-error={measurements.fixedMemberError.toExponential(4)}
      data-tool-attitude-deg={toolAttitudeDeg.toFixed(4)}
      data-belt-transmission={pose.beltTransmissionAvailable ? "connected" : "claim-6-fixed"}
      data-base-floor-gap={baseFloorGap.toExponential(4)}
      data-law-owner={`${MAKINO_FRANKENSIM_OWNER}; ${MAKINO_FRANKENSIM_BOUNDARY}`}
      className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl"
    >
      <div className="relative min-h-[420px] sm:min-h-[520px]">
        <div ref={containerRef} className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-x-5 top-5 hidden items-start justify-between gap-3 lg:flex">
          <div className="rounded-xl border border-cyan-700/70 bg-slate-950/85 px-3 py-2 backdrop-blur">
            <p className="font-mono text-[10px] tracking-[0.16em] text-cyan-300">
              US 4,341,502 · PROCEDURAL 3D
            </p>
            <p className="mt-1 text-sm font-medium text-white">Normalized four-link linkage</p>
          </div>
          <div className="rounded-xl border border-rose-800/70 bg-rose-950/85 px-3 py-2 text-right text-[11px] leading-4 text-rose-100 backdrop-blur sm:max-w-xs">
            {MAKINO_FRANKENSIM_OWNER} identified · constrained SI solve refused.
          </div>
        </div>
      </div>
      <div
        data-mobile-layout="controls-below-canvas"
        className="grid gap-2 border-t border-slate-700/80 bg-slate-950/90 p-3 sm:grid-cols-[1fr_auto]"
      >
        <div className="grid gap-2 sm:grid-cols-4">
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
            Tool φ{" "}
            <span className="float-right font-mono text-emerald-300">
              {toolAttitudeDeg.toFixed(0)}°
            </span>
            <input
              className="mt-1 w-full accent-emerald-400"
              type="range"
              min="-180"
              max="180"
              step="1"
              value={toolAttitudeDeg}
              disabled={pose.topology === "claim-6-y-link"}
              aria-label="Tool attitude"
              onChange={(event) => updateParam("toolAttitudeDeg", Number(event.target.value))}
            />
          </label>
          <label className="text-xs text-slate-200">
            Claim form
            <select
              className="mt-1 w-full rounded border border-slate-600 bg-slate-900 p-1 text-xs"
              value={effectiveTopology}
              disabled={claimStates[1] === false}
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
          {(Object.keys(MAKINO_SCARA_CAMERA_VIEWS) as MakinoScaraCameraView[]).map((candidate) => (
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

        <p className="text-[11px] leading-4 text-slate-400 sm:col-span-2">
          {pose.beltTransmissionAvailable
            ? "Claims 2/5 extension shown: motor 10 drives connected belt 11 along link 4 and belt 12 along link 6 to tool axis 8."
            : "Claim 6 shown: rigid tool 13 has two separated pivots and Y-link 14 holds its attitude fixed."}
        </p>

        <div className="border-t border-slate-800 pt-2 sm:col-span-2">
          <ClaimConstraintToggle
            patentId={PATENT_ID}
            claimStates={claimStates}
            onToggleClaim={(claimNumber, active) =>
              updateParam(claimConstraintStateParamId(claimNumber), active ? 1 : 0)
            }
          />
          {claimConstraintResult.activeFailures.length > 0 && (
            <div
              role="status"
              className="mt-2 rounded-lg border border-rose-800 bg-rose-950/70 p-2 text-[11px] leading-4 text-rose-100"
            >
              {claimConstraintResult.activeFailures.join(" ")}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
