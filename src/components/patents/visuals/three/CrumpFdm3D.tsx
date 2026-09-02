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
import { readCrumpFdmControls, stepCrumpFdmSi } from "@/physics/crumpFdmKernel";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

const PATENT_ID = "us-5121329-crump-fdm";

export function CrumpFdm3D({ patentId = PATENT_ID }: { patentId?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true, 39: true });

  const { params, updateParam } = usePatentPhysics(patentId);
  const liveParams = useRef(params);
  liveParams.current = params;

  const controls = useMemo(() => readCrumpFdmControls(params), [params]);
  const telemetry = useMemo(() => stepCrumpFdmSi(controls), [controls]);
  const equations = useMemo(() => ALL_COLORIZED_EQUATIONS[patentId] ?? [], [patentId]);

  useFrankenSimPhysics(patentId);

  const [cameraPreset, setCameraPreset] = useState<"isometric" | "nozzle" | "top" | "side">(
    "isometric",
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [4.2, 3.6, 4.8],
      targetPos: [0, 1.4, 0],
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
      const activeTelemetry = stepCrumpFdmSi(activeControls);

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
  }, []);

  const setView = (view: "isometric" | "nozzle" | "top" | "side") => {
    setCameraPreset(view);
    const studio = studioRef.current;
    if (!studio) return;

    if (view === "isometric") {
      studio.controls.setView([4.2, 3.6, 4.8], [0, 1.4, 0]);
    } else if (view === "nozzle") {
      studio.controls.setView([0.8, 1.6, 1.2], [0, 1.3, 0]);
    } else if (view === "top") {
      studio.controls.setView([0.1, 6.2, 0.1], [0, 1.5, 0]);
    } else if (view === "side") {
      studio.controls.setView([5.2, 1.4, 0], [0, 1.4, 0]);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 3D Viewport with HUD */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-stone-800 bg-stone-950 shadow-2xl">
        <div ref={containerRef} className="h-full w-full" />

        {/* Camera Preset Toolbar */}
        <div className="absolute right-4 top-4 z-10 flex gap-1.5 rounded-lg border border-stone-700/80 bg-stone-900/90 p-1.5 backdrop-blur">
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
        <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex flex-wrap gap-2">
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

      {/* Physics Telemetry Badge */}
      <PhysicsTelemetryBadge patentId={patentId} equations={equations} />

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
          onClaimStateChange={(num, active) => setClaimStates((prev) => ({ ...prev, [num]: active }))}
        />
      </div>
    </div>
  );
}

export default CrumpFdm3D;
