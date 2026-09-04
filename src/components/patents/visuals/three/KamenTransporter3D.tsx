"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PhysicsTelemetryBadge } from "@/components/patents/PhysicsTelemetryBadge";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import {
  buildKamenTransporterModel,
  type KamenTransporterModel,
  updateKamenTransporterKinematics,
} from "@/components/patents/visuals/three/kamenTransporterModel";
import {
  createThreeStudioScene,
  type StudioContext,
} from "@/components/patents/visuals/three/ThreeStudioScene";
import { ALL_COLORIZED_EQUATIONS } from "@/data/colorizedEquations";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import { wasmSurfaceForPatent } from "@/physics/coverageManifest";
import {
  createKamenTransporterTransportUpdater,
  getKamenTransporterTapeState,
  KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M,
  KAMEN_TRANSPORTER_TOPOLOGY_LABELS,
  KAMEN_TRANSPORTER_TOPOLOGY_STATES,
  readKamenTransporterControls,
} from "@/physics/kamenTransporterKernel";
import {
  ensureKamenTransporterWasm,
  type KamenTransporterKernelSource,
  kamenTransporterKernelSource,
  kamenTransporterRuntimeLabel,
  stepKamenTransporterPhysics,
} from "@/physics/kamenTransporterWasm";
import { globalTransportBus, useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import {
  type KamenTransporterCameraPreset,
  kamenTransporterCameraForViewport,
} from "./kamenTransporterCamera";
import { useLiveSimParams } from "./useLiveSimParams";

export default function KamenTransporter3D({
  patentId = "us-5701965-kamen-transporter",
}: {
  patentId?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const modelRef = useRef<KamenTransporterModel | null>(null);
  const { effectiveParams, claimStates, updateParam } = usePatentPhysics(patentId);
  const controls = useMemo(() => readKamenTransporterControls(effectiveParams), [effectiveParams]);
  const [kernelSource, setKernelSource] = useState<KamenTransporterKernelSource>(
    kamenTransporterKernelSource,
  );
  const topology = useMemo(
    () => stepKamenTransporterPhysics(controls, kernelSource),
    [controls, kernelSource],
  );
  const liveControls = useLiveSimParams(controls);
  const [cameraPreset, setCameraPreset] = useState<KamenTransporterCameraPreset>("overview");

  useFrankenSimPhysics(patentId);

  useEffect(() => {
    if (!wasmSurfaceForPatent(patentId)) return;
    let active = true;
    void ensureKamenTransporterWasm().then((nextSource) => {
      if (active) setKernelSource(nextSource);
    });
    return () => {
      active = false;
    };
  }, [patentId]);

  // This fixed tape carries source-reading state only. It neither derives nor
  // animates a speed, torque, angle, or stability value from the grant.
  useEffect(() => {
    return globalTransportBus.registerUpdater(
      patentId,
      createKamenTransporterTransportUpdater(
        () => liveControls.current,
        stepKamenTransporterPhysics,
      ),
      kernelSource === "wasm" ? "WASM" : "TS_FALLBACK",
    );
  }, [kernelSource, liveControls, patentId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let destroyed = false;
    let animationFrameId: number;
    const overview = kamenTransporterCameraForViewport(
      "overview",
      container.clientWidth,
      container.clientHeight,
    );
    const studio = createThreeStudioScene({
      container,
      cameraPos: overview.pos,
      targetPos: overview.target,
      ambientIntensity: 0.7,
      sunIntensity: 1.5,
    });
    studioRef.current = studio;

    const model = buildKamenTransporterModel();
    modelRef.current = model;
    studio.scene.add(model.root);
    const initialControls = readKamenTransporterControls({ topologyState: 1 });
    updateKamenTransporterKinematics(
      model,
      initialControls,
      stepKamenTransporterPhysics(initialControls),
      0,
    );

    const loop = () => {
      if (destroyed) return;
      animationFrameId = requestAnimationFrame(loop);
      if (!studio.isVisible()) return;
      const tape = getKamenTransporterTapeState();
      if (tape) {
        updateKamenTransporterKinematics(
          model,
          tape.controls,
          tape.telemetry,
          tape.wheelRollAngleRad,
        );
      }
      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };
    loop();

    return () => {
      destroyed = true;
      cancelAnimationFrame(animationFrameId);
      if (modelRef.current) {
        studio.scene.remove(modelRef.current.root);
        modelRef.current.dispose();
      }
      studio.dispose();
    };
  }, []);

  useEffect(() => {
    if (cameraPreset !== "overview") return;
    const reselectResponsiveOverview = () => {
      const container = containerRef.current;
      if (!container) return;
      const view = kamenTransporterCameraForViewport(
        "overview",
        container.clientWidth,
        container.clientHeight,
        controls.topologyState,
      );
      studioRef.current?.controls.setView(view.pos, view.target);
    };
    reselectResponsiveOverview();
    window.addEventListener("resize", reselectResponsiveOverview);
    window.addEventListener("orientationchange", reselectResponsiveOverview);
    return () => {
      window.removeEventListener("resize", reselectResponsiveOverview);
      window.removeEventListener("orientationchange", reselectResponsiveOverview);
    };
  }, [cameraPreset, controls.topologyState]);

  const handleCameraPreset = (preset: KamenTransporterCameraPreset) => {
    setCameraPreset(preset);
    if (!studioRef.current) return;
    const container = containerRef.current;
    const view = kamenTransporterCameraForViewport(
      preset,
      container?.clientWidth ?? 0,
      container?.clientHeight ?? 0,
      controls.topologyState,
    );
    studioRef.current.controls.setView(view.pos, view.target);
  };

  const selectedStateIndex = KAMEN_TRANSPORTER_TOPOLOGY_STATES.indexOf(topology.topologyState);

  return (
    <div
      className="flex w-full flex-col items-center space-y-4 rounded-2xl border border-parchment-300 bg-parchment-50 p-3 shadow-patent dark:border-ink-800 dark:bg-ink-950 sm:space-y-6 sm:p-6"
      data-testid="kamen-transporter-three"
      data-kamen-state={topology.topologyState}
      data-kamen-contact-wheels={topology.displayPose.contactWheelIds.join(",")}
      data-kamen-contact-count={topology.displayPose.contactCount}
      data-kamen-minimum-gap-m={topology.displayPose.minimumGapM.toFixed(12)}
      data-kamen-riser-contact-wheels={topology.displayPose.riserContactWheelIds.join(",")}
      data-kamen-riser-contact-count={topology.displayPose.riserContactCount}
      data-kamen-minimum-riser-clearance-m={
        topology.displayPose.minimumRiserClearanceM?.toFixed(12) ?? "not-applicable"
      }
      data-kamen-runtime-source={topology.runtimeSource}
      data-kamen-owner={topology.genericOwner}
      data-kamen-boundary={topology.runtimeBoundary}
      data-kamen-source-figure={topology.displayPose.sourceFigure}
      data-kamen-axle-x-m={topology.displayPose.axleXM.toFixed(12)}
      data-kamen-axle-y-m={topology.displayPose.axleYM.toFixed(12)}
      data-kamen-carrier-rotation-rad={topology.displayPose.carrierRotationRad.toFixed(12)}
      data-kamen-chassis-pitch-rad={topology.displayPose.chassisPitchRad.toFixed(12)}
      data-kamen-stair-active={topology.displayPose.stairActive ? "true" : "false"}
      data-kamen-cluster-topology={topology.clusterTopologyActive ? "present" : "withheld"}
      data-kamen-balance-loop={topology.balanceLoopActive ? "active" : "withheld"}
      data-kamen-wheel-count="three-per-lateral-cluster"
      data-kamen-wheel-radius-m={KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M.wheelRadiusM}
      data-kamen-cluster-radius-m={KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M.clusterRadiusM}
      data-kamen-stair-rise-m={KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M.stairRiseM}
      data-kamen-stair-tread-m={KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M.stairTreadM}
    >
      <div className="flex w-full flex-col justify-between gap-4 border-b border-parchment-200 pb-4 sm:flex-row sm:items-center dark:border-ink-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-cyan-300 bg-cyan-100 px-2.5 py-0.5 text-xs font-bold text-cyan-800 dark:border-cyan-700 dark:bg-cyan-900/60 dark:text-cyan-200">
              US 5,701,965
            </span>
            <span className="font-mono text-xs font-medium text-ink-500 dark:text-ink-400">
              THREE.JS + FS-MBD RIGID-CONTACT STUDIO
            </span>
          </div>
          <h3 className="mt-1 font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
            Transporter Balance, Transfer &amp; Climb Relationships
          </h3>
        </div>
      </div>

      <div
        className="relative min-h-[420px] w-full select-none overflow-hidden rounded-xl border border-parchment-300 bg-ink-950 dark:border-ink-800"
        style={{ aspectRatio: "16 / 9" }}
      >
        <div ref={containerRef} className="h-full w-full cursor-grab active:cursor-grabbing" />

        <label className="sr-only" htmlFor="kamen-transporter-camera-view">
          Camera view
        </label>
        <select
          id="kamen-transporter-camera-view"
          aria-label="Camera view"
          className="absolute right-3 top-3 z-10 max-w-[calc(100%-1.5rem)] rounded-lg border border-ink-700 bg-ink-900/90 px-2.5 py-2 font-mono text-[11px] font-bold text-ink-200 backdrop-blur-sm sm:hidden"
          value={cameraPreset}
          onChange={(event) =>
            handleCameraPreset(event.target.value as KamenTransporterCameraPreset)
          }
        >
          <option value="overview">OVERVIEW</option>
          <option value="side">SIDE</option>
          <option value="balance">BALANCE RELATION</option>
          <option value="stairs">STAIR SEQUENCE</option>
        </select>
        <div className="absolute left-3 top-3 z-10 hidden gap-1.5 rounded-lg border border-ink-700 bg-ink-900/80 p-1 backdrop-blur-sm sm:flex">
          {(["overview", "side", "balance", "stairs"] as const).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handleCameraPreset(preset)}
              className={`rounded px-2.5 py-1 font-mono text-[11px] font-bold transition-colors ${
                cameraPreset === preset
                  ? "bg-cyan-600 text-white"
                  : "text-ink-300 hover:bg-ink-800 hover:text-white"
              }`}
            >
              {preset.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="absolute bottom-3 left-3 z-10 hidden space-y-1 rounded-lg border border-ink-700 bg-ink-900/85 p-3 font-mono text-xs text-ink-200 backdrop-blur-sm sm:block">
          <div className="flex items-center gap-2">
            <span className="font-bold text-cyan-400">STATE:</span>
            <span>{topology.stateLabel.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-400">WHEEL CONTROL:</span>
            <span>{topology.wheelControlMode.replaceAll("-", " ").toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-emerald-400">CLAIMS:</span>
            <span>{topology.sourceClaimNumbers.join(", ")}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sky-400">TREAD:</span>
            <span>
              {topology.displayPose.contactWheelIds.join(" + ").toUpperCase()} ·{" "}
              {topology.displayPose.sourceFigure}
            </span>
          </div>
          {topology.displayPose.stairActive ? (
            <div className="flex items-center gap-2">
              <span className="font-bold text-rose-400">RISER:</span>
              <span>
                {topology.displayPose.riserContactCount > 0
                  ? `${topology.displayPose.riserContactWheelIds.join(" + ").toUpperCase()} TANGENT`
                  : "CLEAR"}
              </span>
            </div>
          ) : null}
          <p className="max-w-80 pt-1 text-[10px] leading-relaxed text-ink-400">
            {kamenTransporterRuntimeLabel(topology.runtimeSource)} · Table 1 dimensions · tread and
            finite-riser clearance.
          </p>
        </div>
      </div>

      <div data-mobile-layout="telemetry-after-canvas" className="w-full">
        <PhysicsTelemetryBadge
          patentId={patentId}
          equations={ALL_COLORIZED_EQUATIONS[patentId] ?? []}
        />
      </div>

      <div
        data-mobile-layout="controls-after-canvas"
        className="grid w-full grid-cols-1 gap-4 font-mono text-xs md:grid-cols-2"
      >
        <div className="space-y-3 rounded-lg border border-parchment-200 bg-parchment-100 p-3 dark:border-ink-800 dark:bg-ink-900">
          <div className="flex items-center justify-between text-ink-700 dark:text-parchment-200">
            <label htmlFor="kamen-3d-topology-state" className="font-bold">
              Claim-reading state
            </label>
            <span className="text-[10px] text-ink-500 dark:text-ink-400">SOURCE POSES</span>
          </div>
          <div id="kamen-3d-topology-state" className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {KAMEN_TRANSPORTER_TOPOLOGY_STATES.map((state, index) => (
              <button
                key={state}
                type="button"
                data-audit-primary-control={index === 0 ? "true" : undefined}
                onClick={() => updateParam("topologyState", index)}
                className={`rounded px-2 py-1.5 text-left text-[10px] font-bold transition-colors ${
                  selectedStateIndex === index
                    ? "bg-cyan-600 text-white"
                    : "bg-parchment-200 text-ink-700 hover:bg-parchment-300 dark:bg-ink-800 dark:text-ink-300 dark:hover:bg-ink-700"
                }`}
              >
                {KAMEN_TRANSPORTER_TOPOLOGY_LABELS[state].toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-parchment-200 bg-parchment-100 p-3 text-ink-700 dark:border-ink-800 dark:bg-ink-900 dark:text-parchment-200">
          <p className="font-bold">Source boundary</p>
          <p className="mt-1 text-[11px] leading-relaxed text-ink-600 dark:text-ink-400">
            The grant prints three equal wheels per cluster and nominal wheel, carrier, stair, and
            centre-offset dimensions. The generic fs-mbd owner checks rigid tread support and finite
            vertical-riser clearance; force, friction, impact, compliance, motor, sensor, and
            controller results remain withheld.
          </p>
        </div>

        <div className="col-span-full border-t border-parchment-200 pt-2 dark:border-ink-800">
          <ClaimConstraintToggle
            patentId={patentId}
            claimStates={claimStates}
            onClaimStateChange={(number, active) =>
              updateParam(claimConstraintStateParamId(number), active ? 1 : 0)
            }
          />
        </div>
      </div>
    </div>
  );
}
