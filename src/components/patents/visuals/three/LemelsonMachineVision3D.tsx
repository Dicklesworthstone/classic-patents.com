"use client";

import { RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { createLemelsonMachineVisionModel } from "@/components/patents/visuals/three/lemelsonMachineVisionModel";
import {
  createThreeStudioScene,
  type StudioContext,
} from "@/components/patents/visuals/three/ThreeStudioScene";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import { stepLemelsonMachineVisionTopology } from "@/physics/lemelsonMachineVisionKernel";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { useLiveSimParams } from "./useLiveSimParams";

const PATENT_ID = "us-3081379-lemelson-machine-vision";

const SIGNAL_CONTROLS = [
  ["scanPathEnabled", "Scan path"],
  ["synchronizedGateEnabled", "Synchronized gate"],
  ["analyzingCircuitEnabled", "Analyzing circuit"],
  ["inspectionSignalPresent", "Picture signal present"],
  ["referenceSignalMatches", "Reference comparison"],
] as const;

const CAMERA_PRESET_LABELS = {
  isometric: "overview",
  vidicon: "scan source",
  diverter: "control path",
  top: "top",
} as const;

export function LemelsonMachineVision3D({ patentId = PATENT_ID }: { patentId?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const { effectiveParams, claimStates, claimConstraintResult, updateParam, resetParams } =
    usePatentPhysics(patentId);
  const state = useMemo(
    () => stepLemelsonMachineVisionTopology(effectiveParams),
    [effectiveParams],
  );
  const liveState = useLiveSimParams(state);
  const sourceBoundaryTelemetry = useMemo(
    () => ({
      domain: "solid_mechanics" as const,
      refusal: {
        isRefused: true,
        reason: claimConstraintResult.refusalWarning ?? state.sourceBoundary.reason,
      },
    }),
    [claimConstraintResult.refusalWarning, state.sourceBoundary.reason],
  );

  useFrankenSimPhysics(patentId, sourceBoundaryTelemetry);

  const [cameraPreset, setCameraPreset] = useState<"isometric" | "vidicon" | "diverter" | "top">(
    "isometric",
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: The mounted render loop reads this stable, layout-effect-synchronized ref; depending on its current value would rebuild the Three.js scene.
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
    model.update(liveState.current);

    let frame = 0;

    const animate = () => {
      frame = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;

      model.update(liveState.current);

      orbitControls.update();
      renderer.render(scene, camera);
    };

    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      scene.remove(model.root);
      model.dispose();
      studio.cleanup();
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
    <section className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 bg-slate-900/80 px-4 py-3 sm:px-6">
        <div>
          <p className="font-mono text-[11px] tracking-[0.16em] text-cyan-300">
            US 3,081,379 · PROCEDURAL 3D SOURCE TOPOLOGY
          </p>
          <h3 className="mt-1 font-serif text-xl text-white">
            Scan, selected signal, and analysis path
          </h3>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">
            The 3D studio is a display-proportion reading aid for the claimed relationship. Color
            reports normalized signal states; no moving part, beam sweep, waveform scale, or output
            mechanism is presented as a calibrated reconstruction.
          </p>
        </div>
        <div className="flex flex-wrap gap-1 rounded-lg border border-slate-700 bg-slate-950 p-1 text-xs">
          {(["isometric", "vidicon", "diverter", "top"] as const).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handlePresetChange(preset)}
              className={`rounded px-2.5 py-1 font-medium transition-colors ${
                cameraPreset === preset
                  ? "bg-cyan-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {CAMERA_PRESET_LABELS[preset]}
            </button>
          ))}
        </div>
      </header>

      <div className="relative h-[480px] w-full overflow-hidden border-b border-slate-800 bg-slate-950">
        <div ref={containerRef} className="h-full w-full" />
        <div className="pointer-events-none absolute left-3 top-3 max-w-sm rounded-lg border border-cyan-800/80 bg-slate-950/90 px-3 py-2 font-mono text-[10px] leading-5 text-cyan-100 backdrop-blur">
          <p className="text-cyan-300">CLAIM 1 TOPOLOGY</p>
          <p>{state.signalPath.join(" → ")}</p>
        </div>
        <div className="pointer-events-none absolute bottom-3 right-3 max-w-xs rounded-lg border border-rose-900/80 bg-slate-950/90 px-3 py-2 text-right text-[10px] leading-4 text-rose-100 backdrop-blur">
          Display geometry only; no source-backed velocity, amplitude, force, or response model.
        </div>
      </div>

      <div className="grid gap-3 border-b border-slate-800 bg-slate-900/50 p-4 text-xs sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-700 bg-slate-950/70 p-3">
          <p className="font-mono text-cyan-300">SCAN PATH</p>
          <p className="mt-1 text-slate-100">{state.scanPathActive ? "ACTIVE" : "WITHHELD"}</p>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-950/70 p-3">
          <p className="font-mono text-emerald-300">PICTURE SIGNAL</p>
          <p className="mt-1 text-slate-100">{state.gatedPictureSignal ? "SELECTED" : "HELD"}</p>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-950/70 p-3">
          <p className="font-mono text-purple-300">ANALYZER</p>
          <p className="mt-1 text-slate-100">
            {state.analyzingCircuitActive ? "AVAILABLE" : "WITHHELD"}
          </p>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-950/70 p-3">
          <p className="font-mono text-amber-300">REFERENCE</p>
          <p className="mt-1 text-slate-100">{state.referenceComparison.toUpperCase()}</p>
        </div>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_20rem] sm:p-5">
        <div className="space-y-3">
          <p className="font-mono text-xs text-cyan-300">S ∧ G ∧ A ∧ I → C</p>
          <p className="text-sm leading-6 text-slate-300">
            A scan path (S), synchronized gate (G), analyzing circuit (A), and picture-signal
            availability (I) establish the display&apos;s control-path readiness (C). This is a
            logical reading of Claim 1, not a prediction of any physical machine outcome.
          </p>
          <ClaimConstraintToggle
            patentId={patentId}
            claimStates={claimStates}
            onToggleClaim={(claimNumber, active) =>
              updateParam(claimConstraintStateParamId(claimNumber), active ? 1 : 0)
            }
          />
          {claimConstraintResult.activeFailures.length > 0 && (
            <div role="status" className="rounded-lg border border-rose-800 bg-rose-950/70 p-3">
              {claimConstraintResult.activeFailures.map((failure) => (
                <p key={failure} className="text-[11px] leading-5 text-rose-100">
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
          <p className="rounded-lg border border-rose-900/70 bg-rose-950/40 p-3 text-xs leading-5 text-rose-100">
            {state.sourceBoundary.reason}
          </p>
        </div>

        <form
          className="space-y-3 rounded-xl border border-slate-700 bg-slate-900/60 p-3"
          onSubmit={(event) => event.preventDefault()}
        >
          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-cyan-300">
              Source-state controls
            </h4>
            <p className="mt-1 text-[11px] leading-4 text-slate-400">
              Each switch is a normalized availability state, never an SI setpoint.
            </p>
          </div>
          {SIGNAL_CONTROLS.map(([id, label]) => (
            <label
              key={id}
              className="flex items-center justify-between gap-3 text-xs text-slate-200"
            >
              <span>{label}</span>
              <input
                type="checkbox"
                checked={state.controls[id] >= 0.5}
                onChange={(event) => updateParam(id, event.target.checked ? 1 : 0)}
                className="h-4 w-4 accent-cyan-400"
              />
            </label>
          ))}
          <button
            type="button"
            onClick={resetParams}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-100 hover:bg-slate-800"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset source exhibit
          </button>
        </form>
      </div>
    </section>
  );
}
