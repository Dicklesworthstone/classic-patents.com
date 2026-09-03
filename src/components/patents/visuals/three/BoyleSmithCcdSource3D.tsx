"use client";

import { Camera, Eye, EyeOff, Layers, Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import {
  BOYLE_SMITH_CCD_ID,
  readBoyleSmithCcdSourceControls,
  readBoyleSmithCcdTapeFrame,
  resetBoyleSmithCcdTape,
} from "@/physics/boyleSmithCcdKernel";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { createBoyleSmithCcdSourceModel } from "./boyleSmithCcdSourceModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

type CameraPreset = "figure2" | "gateStack" | "phaseBuses" | "wells" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { label: string; position: [number, number, number]; target: [number, number, number] }
> = {
  figure2: { label: "Figure 2", position: [8.3, 5.4, 9.6], target: [0, -0.08, 0] },
  gateStack: { label: "Gate Stack", position: [0, 3.2, 6.8], target: [0, -0.05, 0] },
  phaseBuses: { label: "22′ / 23′ / 24′", position: [3.5, 4.2, -7.4], target: [0, 0.1, -0.7] },
  wells: { label: "Potential Wells", position: [5.3, 2.2, 5.6], target: [0, -0.3, 0] },
  top: { label: "Top", position: [0, 13, 0.1], target: [0, 0, 0] },
};

function cameraForViewport(preset: CameraPreset, viewportWidth: number) {
  const view = CAMERA_PRESETS[preset];
  if (viewportWidth >= 640) return view;
  const multiplier = 1.6;
  return {
    ...view,
    position: [
      view.target[0] + (view.position[0] - view.target[0]) * multiplier,
      view.target[1] + (view.position[1] - view.target[1]) * multiplier,
      view.target[2] + (view.position[2] - view.target[2]) * multiplier,
    ] as [number, number, number],
  };
}

export function BoyleSmithCcdSource3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const cutawayRef = useRef(true);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("figure2");
  const [interfaceVisible, setInterfaceVisible] = useState(true);
  const [cutaway, setCutaway] = useState(true);
  const { params, effectiveParams, claimStates, claimConstraintResult, updateParam, resetParams } =
    usePatentPhysics(BOYLE_SMITH_CCD_ID);
  useFrankenSimPhysics(BOYLE_SMITH_CCD_ID);
  const liveParams = useLiveSimParams(effectiveParams);
  const controls = readBoyleSmithCcdSourceControls(effectiveParams);
  const frame = readBoyleSmithCcdTapeFrame(controls);

  const applyCameraPreset = (preset: CameraPreset) => {
    setCameraPreset(preset);
    const view = cameraForViewport(preset, containerRef.current?.clientWidth ?? 1000);
    studioRef.current?.controls.setView(view.position, view.target);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const initialView = cameraForViewport("figure2", container.clientWidth);
    const studio = createThreeStudioScene({
      container,
      cameraPos: initialView.position,
      targetPos: initialView.target,
      environmentStyle: "studio",
      ambientIntensity: 2.1,
      sunIntensity: 2.7,
      cameraMinDistance: 2.2,
      cameraMaxDistance: 30,
    });
    studioRef.current = studio;
    const model = createBoyleSmithCcdSourceModel();
    studio.scene.add(model.root);

    studio.renderer.setAnimationLoop(() => {
      if (!studio.isVisible()) return;
      const currentControls = readBoyleSmithCcdSourceControls(liveParams.current);
      const currentFrame = readBoyleSmithCcdTapeFrame(currentControls);
      model.setCutaway(cutawayRef.current);
      model.update(currentFrame.metrics);
      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    });

    return () => {
      studio.renderer.setAnimationLoop(null);
      model.dispose();
      studio.dispose();
      studioRef.current = null;
    };
  }, [liveParams]);

  useEffect(() => {
    cutawayRef.current = cutaway;
  }, [cutaway]);

  useEffect(() => {
    const restoreView = () => {
      const container = containerRef.current;
      if (!container) return;
      const view = cameraForViewport(cameraPreset, container.clientWidth);
      studioRef.current?.controls.setView(view.position, view.target);
    };
    window.addEventListener("resize", restoreView);
    return () => window.removeEventListener("resize", restoreView);
  }, [cameraPreset]);

  const setRunning = (running: boolean) => updateParam("running", running ? 1 : 0);
  const toggleCutaway = () => {
    const nextCutaway = !cutawayRef.current;
    // The render loop reads this ref, so update it synchronously with the interaction.
    cutawayRef.current = nextCutaway;
    setCutaway(nextCutaway);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-parchment-300 bg-slate-950 shadow-patent dark:border-ink-800">
      <div className="relative min-h-[430px] w-full sm:min-h-[540px]">
        <div ref={containerRef} className="absolute inset-0 h-full w-full" />

        {interfaceVisible && (
          <div className="absolute top-3 right-3 left-3 z-10 flex flex-nowrap gap-1 overflow-x-auto rounded-xl border border-parchment-300 bg-white/90 p-1 text-[10px] shadow-sm backdrop-blur-md sm:right-72 sm:text-xs dark:border-ink-700 dark:bg-ink-900/90">
            <span className="flex shrink-0 items-center gap-1 px-2 py-1 text-ink-500">
              <Camera className="h-3.5 w-3.5" /> View
            </span>
            {(Object.keys(CAMERA_PRESETS) as CameraPreset[]).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyCameraPreset(preset)}
                className={`min-h-9 shrink-0 rounded-lg px-2.5 py-1 font-medium transition-colors ${
                  cameraPreset === preset
                    ? "bg-amber-700 text-white"
                    : "text-ink-700 hover:bg-parchment-200 dark:text-ink-200 dark:hover:bg-ink-800"
                }`}
              >
                {CAMERA_PRESETS[preset].label}
              </button>
            ))}
          </div>
        )}

        <div className="absolute top-16 right-3 z-10 flex items-center gap-1.5 sm:top-3">
          <button
            type="button"
            onClick={toggleCutaway}
            className={`min-h-9 rounded-lg border px-2.5 text-xs font-semibold ${
              cutaway
                ? "border-amber-500 bg-amber-700 text-white"
                : "border-parchment-300 bg-white/90 text-ink-800 dark:border-ink-700 dark:bg-ink-900/90 dark:text-ink-100"
            }`}
            aria-label={cutaway ? "Show opaque substrate" : "Show substrate cutaway"}
          >
            <Layers className="inline h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setRunning(!controls.running)}
            className="min-h-9 rounded-lg border border-amber-800 bg-amber-700 px-2.5 text-xs font-semibold text-white"
          >
            {controls.running ? (
              <Pause className="inline h-4 w-4" />
            ) : (
              <Play className="inline h-4 w-4" />
            )}{" "}
            <span className="hidden sm:inline">{controls.running ? "Pause" : "Run"}</span>
          </button>
          <button
            type="button"
            onClick={() => setInterfaceVisible((current) => !current)}
            className="min-h-9 rounded-lg border border-parchment-300 bg-white/90 px-2.5 text-ink-800 dark:border-ink-700 dark:bg-ink-900/90 dark:text-ink-100"
            aria-label={interfaceVisible ? "Hide source controls" : "Show source controls"}
          >
            {interfaceVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              resetBoyleSmithCcdTape();
              resetParams();
              applyCameraPreset("figure2");
            }}
            className="min-h-9 rounded-lg border border-parchment-300 bg-white/90 px-2.5 text-ink-800 dark:border-ink-700 dark:bg-ink-900/90 dark:text-ink-100"
            aria-label="Reset source apparatus"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        {interfaceVisible && (
          <div className="pointer-events-none absolute bottom-3 left-3 z-10 hidden max-w-[calc(100%-1.5rem)] rounded-xl border border-parchment-300 bg-white/90 p-3 font-mono text-[11px] text-ink-900 shadow-md backdrop-blur-md sm:block dark:border-ink-700 dark:bg-ink-950/90 dark:text-ink-100">
            <p className="font-bold text-amber-700 dark:text-amber-400">
              FIG. 2 / 3 SOURCE TOPOLOGY · HOST KERNEL
            </p>
            <p>
              Φ{frame.metrics.activePhase} · input {frame.metrics.inputPattern} · tₚ/Δt{" "}
              {controls.pulseWidthToStepRatio.toFixed(2)}
            </p>
            <p className={frame.metrics.packetMotionAllowed ? "text-emerald-700" : "text-rose-600"}>
              {frame.metrics.packetMotionAllowed
                ? "Overlapping wells preserve the displayed handoff."
                : "Transfer refused: required topology/timing absent."}
            </p>
            <p className="text-ink-500 dark:text-ink-400">
              CTE, carrier count, and watts: not disclosed.
            </p>
          </div>
        )}
      </div>

      {interfaceVisible && (
        <div className="border-t border-ink-800 bg-white p-3 font-mono text-[11px] text-ink-900 sm:hidden dark:bg-ink-950 dark:text-ink-100">
          <p className="font-bold text-amber-700 dark:text-amber-400">
            FIG. 2 / 3 SOURCE TOPOLOGY · HOST KERNEL
          </p>
          <p>
            Φ{frame.metrics.activePhase} · input {frame.metrics.inputPattern} · tₚ/Δt{" "}
            {controls.pulseWidthToStepRatio.toFixed(2)}
          </p>
          <p className={frame.metrics.packetMotionAllowed ? "text-emerald-700" : "text-rose-600"}>
            {frame.metrics.packetMotionAllowed
              ? "Overlapping wells preserve the displayed handoff."
              : "Transfer refused: required topology/timing absent."}
          </p>
          <p className="text-ink-500 dark:text-ink-400">
            CTE, carrier count, and watts: not disclosed.
          </p>
        </div>
      )}

      {interfaceVisible && (
        <div className="grid grid-cols-1 gap-4 border-t border-ink-800 bg-ink-950 p-4 font-mono text-xs text-parchment-100 sm:grid-cols-3">
          <label className="grid gap-1.5" htmlFor="ccd-visible-clock-rate">
            <span className="flex justify-between gap-3">
              Visible phase-step rate
              <span className="shrink-0 text-cyan-400">
                {controls.clockStepRateHz.toFixed(1)} Hz
              </span>
            </span>
            <input
              id="ccd-visible-clock-rate"
              aria-label="Visible phase-step rate"
              type="range"
              min="0.2"
              max="2.5"
              step="0.1"
              value={params.clockStepRateHz ?? 1.2}
              onChange={(event) => updateParam("clockStepRateHz", Number(event.target.value))}
              className="w-full accent-cyan-400"
            />
          </label>
          <label className="grid gap-1.5" htmlFor="ccd-pulse-overlap">
            <span className="flex justify-between gap-3">
              Pulse ratio tₚ / Δt
              <span className="shrink-0 text-emerald-400">
                {controls.pulseWidthToStepRatio.toFixed(2)}
              </span>
            </span>
            <input
              id="ccd-pulse-overlap"
              aria-label="Pulse width to step interval ratio"
              type="range"
              min="0.2"
              max="0.8"
              step="0.01"
              value={params.pulseWidthToStepRatio ?? 0.5}
              onChange={(event) => updateParam("pulseWidthToStepRatio", Number(event.target.value))}
              className="w-full accent-emerald-400"
            />
          </label>
          <label className="grid gap-1.5" htmlFor="ccd-pulse-depth">
            <span className="flex justify-between gap-3">
              Relative pulse depth
              <span className="shrink-0 text-amber-400">
                {controls.pulseDepthNormalized.toFixed(2)}
              </span>
            </span>
            <input
              id="ccd-pulse-depth"
              aria-label="Relative pulse depth"
              type="range"
              min="0.25"
              max="1"
              step="0.01"
              value={params.pulseDepthNormalized ?? 0.78}
              onChange={(event) => updateParam("pulseDepthNormalized", Number(event.target.value))}
              className="w-full accent-amber-400"
            />
          </label>
        </div>
      )}

      <div className="border-t border-ink-800 bg-black p-4">
        <ClaimConstraintToggle
          patentId={BOYLE_SMITH_CCD_ID}
          claimStates={claimStates}
          onClaimStateChange={(claimNumber, active) =>
            updateParam(claimConstraintStateParamId(claimNumber), active ? 1 : 0)
          }
        />
        {claimConstraintResult.refusalWarning && (
          <p className="mt-3 rounded-lg border border-rose-400/50 bg-rose-950/55 px-3 py-2 text-xs leading-relaxed text-rose-100">
            {claimConstraintResult.refusalWarning}
          </p>
        )}
      </div>
    </div>
  );
}
