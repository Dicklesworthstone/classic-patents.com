"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PhysicsTelemetryBadge } from "@/components/patents/PhysicsTelemetryBadge";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { createCrumpFdmModel } from "@/components/patents/visuals/three/crumpFdmModel";
import {
  createThreeStudioScene,
  type StudioContext,
} from "@/components/patents/visuals/three/ThreeStudioScene";
import { ALL_COLORIZED_EQUATIONS } from "@/data/colorizedEquations";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import { wasmSurfaceForPatent } from "@/physics/coverageManifest";
import { CRUMP_FDM_SCENARIO_NOTE, readCrumpFdmControls } from "@/physics/crumpFdmKernel";
import {
  type CrumpFdmKernelSource,
  crumpFdmKernelSource,
  crumpFdmRuntimeLabel,
  ensureCrumpFdmWasm,
  stepCrumpFdmPhysics,
} from "@/physics/crumpFdmWasm";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { type CrumpCameraPreset, crumpViewForViewport } from "./crumpFdmCamera";
import { useLiveSimParams } from "./useLiveSimParams";

const PATENT_ID = "us-5121329-crump-fdm";

export function CrumpFdm3D({ patentId = PATENT_ID }: { patentId?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const { effectiveParams, claimStates, claimConstraintResult, updateParam } =
    usePatentPhysics(patentId);
  const liveParams = useLiveSimParams(effectiveParams);

  const controls = useMemo(() => readCrumpFdmControls(effectiveParams), [effectiveParams]);
  const [kernelSource, setKernelSource] = useState<CrumpFdmKernelSource>(crumpFdmKernelSource);
  const telemetry = useMemo(
    () => stepCrumpFdmPhysics(controls, kernelSource),
    [controls, kernelSource],
  );
  const equations = useMemo(() => ALL_COLORIZED_EQUATIONS[patentId] ?? [], [patentId]);

  useFrankenSimPhysics(patentId);

  useEffect(() => {
    if (!wasmSurfaceForPatent(patentId)) return;
    let active = true;
    void ensureCrumpFdmWasm().then((nextSource) => {
      if (active) setKernelSource(nextSource);
    });
    return () => {
      active = false;
    };
  }, [patentId]);

  const [cameraPreset, setCameraPreset] = useState<CrumpCameraPreset>("isometric");

  // The persistent WebGL scene reads the stable layout-effect-synchronized control ref; depending on `.current` would recreate and flash the studio.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const initialView = crumpViewForViewport("isometric", container.clientWidth);
    const studio = createThreeStudioScene({
      container,
      cameraPos: initialView.position,
      targetPos: initialView.target,
      environmentStyle: "studio",
      enableFloorGrid: true,
      floorColor: 0x1e293b,
      gridColor: 0x475569,
    });
    studioRef.current = studio;
    const { scene, camera, renderer, controls: orbitControls } = studio;

    const model = createCrumpFdmModel();
    scene.add(model.root);

    let frame = 0;
    const clock = createStudioClock();

    const animate = (now: number) => {
      frame = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const { simTimeSec } = clock.pump(now);
      const activeControls = readCrumpFdmControls(liveParams.current);
      const activeTelemetry = stepCrumpFdmPhysics(activeControls);

      model.update(activeControls, activeTelemetry, simTimeSec);
      orbitControls.update();
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      scene.remove(model.root);
      model.dispose();
      studio.dispose();
      studioRef.current = null;
    };
  }, [liveParams]);

  useEffect(() => {
    const restoreResponsiveView = () => {
      const container = containerRef.current;
      if (!container) return;
      const next = crumpViewForViewport(cameraPreset, container.clientWidth);
      studioRef.current?.controls.setView(next.position, next.target);
    };
    window.addEventListener("resize", restoreResponsiveView);
    return () => window.removeEventListener("resize", restoreResponsiveView);
  }, [cameraPreset]);

  const setView = (view: CrumpCameraPreset) => {
    setCameraPreset(view);
    const studio = studioRef.current;
    if (!studio) return;
    const next = crumpViewForViewport(view, containerRef.current?.clientWidth ?? 1000);
    studio.controls.setView(next.position, next.target);
  };

  return (
    <div
      className="flex flex-col gap-4"
      data-testid="crump-fdm-three"
      data-crump-claim1-topology={telemetry.claim1ApparatusPresent ? "present" : "withheld"}
      data-crump-claim2-heating={telemetry.claim2HeatingMeansPresent ? "present" : "withheld"}
      data-crump-claim39-tip={telemetry.claim39PlanarGapPresent ? "planar" : "rounded"}
      data-crump-extruding={telemetry.isExtruding ? "true" : "false"}
      data-crump-layer-gap-mm={controls.layerHeightMm.toFixed(3)}
      data-crump-flow-mm3-s={telemetry.volumetricFlowRateMm3S.toFixed(6)}
      data-crump-pressure-mpa={telemetry.nozzlePressureDropMPa.toFixed(6)}
      data-crump-runtime-source={telemetry.runtimeSource}
      data-crump-capillary-owner={telemetry.capillaryOwner}
      data-crump-thermal-owner={telemetry.thermalOwner}
      data-crump-capillary-boundary={telemetry.capillaryBoundary}
      data-crump-thermal-boundary={telemetry.thermalBoundary}
      data-crump-world-support="chassis-base-posts-crown"
    >
      {/* 3D Viewport with HUD */}
      <div className="relative min-h-[360px] w-full overflow-hidden rounded-2xl border border-stone-800 bg-stone-950 shadow-2xl sm:min-h-0 sm:aspect-[16/9]">
        <div ref={containerRef} className="h-full w-full" />

        {/* Camera Preset Toolbar */}
        <label className="sr-only" htmlFor="crump-3d-camera-view">
          Camera view
        </label>
        <select
          id="crump-3d-camera-view"
          aria-label="Camera view"
          className="absolute right-3 top-3 z-10 max-w-[calc(100%-1.5rem)] rounded-lg border border-stone-700 bg-stone-900/90 px-2.5 py-2 text-[11px] font-medium text-stone-100 backdrop-blur sm:hidden"
          value={cameraPreset}
          onChange={(event) => setView(event.target.value as CrumpCameraPreset)}
        >
          <option value="isometric">ISOMETRIC</option>
          <option value="nozzle">NOZZLE &amp; ROAD</option>
          <option value="top">GANTRY TOP</option>
          <option value="side">SIDE PROFILE</option>
        </select>
        <div className="absolute right-4 top-4 z-10 hidden gap-1.5 rounded-lg border border-stone-700/80 bg-stone-900/90 p-1.5 backdrop-blur sm:flex">
          <button
            type="button"
            onClick={() => setView("isometric")}
            className={`rounded px-2.5 py-1 text-xs font-medium transition ${
              cameraPreset === "isometric"
                ? "bg-amber-500 text-stone-950 font-semibold"
                : "text-stone-300 hover:text-stone-100 hover:bg-stone-800"
            }`}
          >
            Isometric
          </button>
          <button
            type="button"
            onClick={() => setView("nozzle")}
            className={`rounded px-2.5 py-1 text-xs font-medium transition ${
              cameraPreset === "nozzle"
                ? "bg-amber-500 text-stone-950 font-semibold"
                : "text-stone-300 hover:text-stone-100 hover:bg-stone-800"
            }`}
          >
            Nozzle & Road
          </button>
          <button
            type="button"
            onClick={() => setView("top")}
            className={`rounded px-2.5 py-1 text-xs font-medium transition ${
              cameraPreset === "top"
                ? "bg-amber-500 text-stone-950 font-semibold"
                : "text-stone-300 hover:text-stone-100 hover:bg-stone-800"
            }`}
          >
            Gantry Top
          </button>
          <button
            type="button"
            onClick={() => setView("side")}
            className={`rounded px-2.5 py-1 text-xs font-medium transition ${
              cameraPreset === "side"
                ? "bg-amber-500 text-stone-950 font-semibold"
                : "text-stone-300 hover:text-stone-100 hover:bg-stone-800"
            }`}
          >
            Side Profile
          </button>
        </div>

        {/* Live HUD Overlay */}
        <div className="pointer-events-none absolute bottom-4 left-4 z-10 hidden flex-wrap gap-2 sm:flex">
          <span className="rounded-md border border-cyan-500/40 bg-stone-900/90 px-3 py-1.5 text-xs font-mono text-cyan-300 backdrop-blur">
            Flow Q: {telemetry.volumetricFlowRateMm3S.toFixed(2)} mm³/s
          </span>
          <span className="rounded-md border border-amber-500/40 bg-stone-900/90 px-3 py-1.5 text-xs font-mono text-amber-300 backdrop-blur">
            Pressure ΔP: {telemetry.nozzlePressureDropMPa.toFixed(3)} MPa
          </span>
          <span className="rounded-md border border-emerald-500/40 bg-stone-900/90 px-3 py-1.5 text-xs font-mono text-emerald-300 backdrop-blur">
            Feed v_feed: {telemetry.filamentFeedSpeedMmS.toFixed(2)} mm/s
          </span>
          {telemetry.refusalReason && (
            <span className="rounded-md border border-rose-500/60 bg-rose-950/90 px-3 py-1.5 text-xs font-mono text-rose-300 backdrop-blur">
              {telemetry.refusalReason}
            </span>
          )}
        </div>
      </div>

      <div
        data-mobile-layout="telemetry-after-canvas"
        className="grid gap-2 rounded-xl border border-stone-800 bg-stone-900/70 p-3 text-[11px] font-mono sm:hidden"
      >
        <span className="text-cyan-300">
          Flow Q: {telemetry.volumetricFlowRateMm3S.toFixed(2)} mm³/s
        </span>
        <span className="text-amber-300">
          Pressure ΔP: {telemetry.nozzlePressureDropMPa.toFixed(3)} MPa
        </span>
        <span className="text-emerald-300">
          Feed v_feed: {telemetry.filamentFeedSpeedMmS.toFixed(2)} mm/s
        </span>
        {telemetry.refusalReason && (
          <span className="text-rose-300">{telemetry.refusalReason}</span>
        )}
      </div>

      {/* Physics Telemetry Badge */}
      <PhysicsTelemetryBadge patentId={patentId} equations={equations} />

      <div className="grid gap-2 text-[11px] leading-4 sm:grid-cols-2">
        <div className="rounded-lg border border-emerald-800/70 bg-emerald-950/30 p-3 text-emerald-100">
          <span className="font-mono font-bold text-emerald-300">GENERIC LAW OWNERS</span>
          <p className="mt-1">
            {crumpFdmRuntimeLabel(telemetry.runtimeSource)} · {telemetry.capillaryOwner} ·{" "}
            {telemetry.thermalOwner}
          </p>
        </div>
        <div className="rounded-lg border border-rose-800/70 bg-rose-950/30 p-3 text-rose-100">
          <span className="font-mono font-bold text-rose-300">MODEL BOUNDARY</span>
          <p className="mt-1">
            {CRUMP_FDM_SCENARIO_NOTE} No shear-thinning, entrance loss, contact resistance, phase
            change, bond strength, or historic performance is inferred.
          </p>
        </div>
      </div>

      {claimConstraintResult.refusalWarning && (
        <div className="rounded-lg border border-rose-700/70 bg-rose-950/50 p-3 text-xs leading-5 text-rose-100">
          {claimConstraintResult.refusalWarning}
        </div>
      )}

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3">
          <label htmlFor="fdm-3d-nozzle-temp" className="block text-xs font-medium text-stone-300">
            Nozzle Temperature ({controls.nozzleTempC.toFixed(0)} °C)
          </label>
          <input
            id="fdm-3d-nozzle-temp"
            type="range"
            min="140"
            max="280"
            step="5"
            value={controls.nozzleTempC}
            onChange={(e) => updateParam("nozzleTempC", Number(e.target.value))}
            className="mt-1 w-full accent-amber-500"
          />
        </div>
        <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3">
          <label htmlFor="fdm-3d-print-speed" className="block text-xs font-medium text-stone-300">
            Print Speed ({controls.printSpeedMmS.toFixed(0)} mm/s)
          </label>
          <input
            id="fdm-3d-print-speed"
            type="range"
            min="10"
            max="150"
            step="5"
            value={controls.printSpeedMmS}
            onChange={(e) => updateParam("printSpeedMmS", Number(e.target.value))}
            className="mt-1 w-full accent-amber-500"
          />
        </div>
        <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3">
          <label htmlFor="fdm-3d-layer-height" className="block text-xs font-medium text-stone-300">
            Layer Height ({controls.layerHeightMm.toFixed(2)} mm)
          </label>
          <input
            id="fdm-3d-layer-height"
            type="range"
            min="0.05"
            max="0.50"
            step="0.05"
            value={controls.layerHeightMm}
            onChange={(e) => updateParam("layerHeightMm", Number(e.target.value))}
            className="mt-1 w-full accent-amber-500"
          />
        </div>
        <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3">
          <label htmlFor="fdm-3d-road-width" className="block text-xs font-medium text-stone-300">
            Road Width ({controls.roadWidthMm.toFixed(2)} mm)
          </label>
          <input
            id="fdm-3d-road-width"
            type="range"
            min="0.20"
            max="1.00"
            step="0.05"
            value={controls.roadWidthMm}
            onChange={(e) => updateParam("roadWidthMm", Number(e.target.value))}
            className="mt-1 w-full accent-amber-500"
          />
        </div>
      </div>

      <div className="p-4 bg-stone-950 border-t border-stone-800">
        <ClaimConstraintToggle
          patentId={patentId}
          claimStates={claimStates}
          onClaimStateChange={(num, active) =>
            updateParam(claimConstraintStateParamId(num), active ? 1 : 0)
          }
        />
      </div>
    </div>
  );
}

export default CrumpFdm3D;
