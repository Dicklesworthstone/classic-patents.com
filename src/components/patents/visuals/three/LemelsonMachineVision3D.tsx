"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PhysicsTelemetryBadge } from "@/components/patents/PhysicsTelemetryBadge";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { createLemelsonMachineVisionModel } from "@/components/patents/visuals/three/lemelsonMachineVisionModel";
import {
  createThreeStudioScene,
  type StudioContext,
} from "@/components/patents/visuals/three/ThreeStudioScene";
import { ALL_COLORIZED_EQUATIONS } from "@/data/colorizedEquations";
import {
  readLemelsonMachineVisionControls,
  stepLemelsonMachineVisionSi,
} from "@/physics/lemelsonMachineVisionKernel";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

const PATENT_ID = "us-3081379-lemelson-machine-vision";

export function LemelsonMachineVision3D({ patentId = PATENT_ID }: { patentId?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  const { params } = usePatentPhysics(patentId);
  const liveParams = useRef(params);
  liveParams.current = params;

  const controls = useMemo(() => readLemelsonMachineVisionControls(params), [params]);
  const state = useMemo(() => stepLemelsonMachineVisionSi(controls), [controls]);
  const equations = useMemo(() => ALL_COLORIZED_EQUATIONS[patentId] ?? [], [patentId]);

  useFrankenSimPhysics(patentId);

  const [cameraPreset, setCameraPreset] = useState<"isometric" | "vidicon" | "diverter" | "top">(
    "isometric",
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [2.5, 2.0, 2.5],
      targetPos: [0, 0.8, 0],
      environmentStyle: "studio",
      enableFloorGrid: true,
      floorColor: 0x0f172a,
      gridColor: 0x334155,
    });
    studioRef.current = studio;
    const { scene, camera, renderer, controls: orbitControls } = studio;

    const model = createLemelsonMachineVisionModel();
    scene.add(model.root);

    let frame = 0;
    const clock = createStudioClock();

    const animate = (now: number) => {
      frame = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;

      const { simTimeSec } = clock.pump(now);
      const currentControls = readLemelsonMachineVisionControls(liveParams.current);
      const currentState = stepLemelsonMachineVisionSi(currentControls);

      model.update(currentControls, currentState.metrics, simTimeSec);

      orbitControls.update();
      renderer.render(scene, camera);
    };

    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      model.dispose();
      studio.dispose();
      studioRef.current = null;
    };
  }, []);

  const handlePresetChange = (preset: "isometric" | "vidicon" | "diverter" | "top") => {
    setCameraPreset(preset);
    const studio = studioRef.current;
    if (!studio) return;

    switch (preset) {
      case "isometric":
        studio.camera.position.set(2.5, 2.0, 2.5);
        studio.controls.target.set(0, 0.8, 0);
        break;
      case "vidicon":
        studio.camera.position.set(0.6, 1.4, 0.8);
        studio.controls.target.set(0, 1.0, 0);
        break;
      case "diverter":
        studio.camera.position.set(1.4, 1.1, 0.9);
        studio.controls.target.set(0.6, 0.6, 0);
        break;
      case "top":
        studio.camera.position.set(0, 3.2, 0.01);
        studio.controls.target.set(0, 0.6, 0);
        break;
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-700/80 bg-slate-900 p-5 text-slate-100 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-emerald-400">
            3D Studio — Lemelson Television Inspection Station
          </h3>
          <p className="text-xs text-slate-400">
            Procedural WebGL Station: Overhead Vidicon Tube, Scan Deflection Beam & Solenoid Sorter
          </p>
        </div>
        <div className="flex gap-1.5 rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
          {(["isometric", "vidicon", "diverter", "top"] as const).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handlePresetChange(preset)}
              className={`rounded px-2.5 py-1 font-medium capitalize transition-colors ${
                cameraPreset === preset
                  ? "bg-emerald-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-[480px] w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
        <div ref={containerRef} className="h-full w-full" />
        <PhysicsTelemetryBadge patentId={patentId} equations={equations} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
          <span className="text-slate-400">Horizontal Scan (f_H)</span>
          <p className="mt-1 font-mono text-sm font-bold text-emerald-400">
            {state.metrics.horizontalScanFreqHz} Hz
          </p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
          <span className="text-slate-400">Beam Scan Velocity</span>
          <p className="mt-1 font-mono text-sm font-bold text-cyan-400">
            {state.metrics.scanBeamVelocityMPerS.toFixed(0)} m/s
          </p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
          <span className="text-slate-400">Pulse Width (τ)</span>
          <p className="mt-1 font-mono text-sm font-bold text-amber-400">
            {state.metrics.pulseWidthUs.toFixed(2)} µs
          </p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
          <span className="text-slate-400">Solenoid Reject Force</span>
          <p className="mt-1 font-mono text-sm font-bold text-ruby-400">
            {state.metrics.solenoidForceN.toFixed(2)} N
          </p>
        </div>
      </div>

      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <ClaimConstraintToggle
          patentId={patentId}
          claimStates={claimStates}
          onClaimStateChange={(num, active) =>
            setClaimStates((prev) => ({ ...prev, [num]: active }))
          }
        />
      </div>
    </div>
  );
}
