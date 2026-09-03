"use client";

import { Eye, EyeOff, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { applyClaimConstraintModifications } from "@/physics/claimConstraints";
import {
  INITIAL_SIKORSKY_STATE,
  readSikorskyControls,
  SIKORSKY_SOURCE_BOUNDARY,
  stepSikorskyHelicopterSi,
} from "@/physics/sikorskyHelicopterKernel";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { useResponsiveStudioHud } from "./StudioKernelChips";
import {
  SIKORSKY_HELICOPTER_CAMERA_VIEWS,
  SIKORSKY_HELICOPTER_VIEW_LABELS,
  type SikorskyHelicopterCameraView,
  sikorskyViewForViewport,
} from "./sikorskyHelicopterCamera";
import { buildSikorskyHelicopterModel } from "./sikorskyHelicopterModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

const PATENT_ID = "us-2318259-sikorsky-helicopter";

export function SikorskyHelicopter3D({ patentId = PATENT_ID }: { patentId?: string } = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [view, setView] = useState<SikorskyHelicopterCameraView>("overview");
  const [interfaceVisible, setInterfaceVisible] = useResponsiveStudioHud(true);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true, 2: true });

  const { params, updateParam, resetParams } = usePatentPhysics(patentId);
  const claimResult = useMemo(
    () => applyClaimConstraintModifications(PATENT_ID, params, claimStates),
    [claimStates, params],
  );
  const effectiveControls = useMemo(
    () => readSikorskyControls(claimResult.modifiedParams),
    [claimResult.modifiedParams],
  );
  const liveParams = useLiveSimParams(claimResult.modifiedParams);

  const simStateRef = useRef(INITIAL_SIKORSKY_STATE);

  useFrankenSimPhysics(patentId, {
    domain: "aerodynamics_mbd",
    refusal: { isRefused: true, reason: SIKORSKY_SOURCE_BOUNDARY.reason },
  });

  const resetSimulation = () => {
    resetParams();
    setClaimStates({ 1: true, 2: true });
    simStateRef.current = INITIAL_SIKORSKY_STATE;
  };

  const selectView = (nextView: SikorskyHelicopterCameraView) => {
    setView(nextView);
    const camera = sikorskyViewForViewport(
      nextView,
      containerRef.current?.clientWidth ?? 1000,
      simStateRef.current.altitudeMeters,
    );
    studioRef.current?.controls.setView(camera.position, camera.target);
  };

  // The mounted render loop reads this stable, layout-effect-synchronized ref; depending on its current value would rebuild the Three.js scene.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const initialCamera = sikorskyViewForViewport(
      "overview",
      container.clientWidth,
      INITIAL_SIKORSKY_STATE.altitudeMeters,
    );
    const studio = createThreeStudioScene({
      container,
      cameraPos: initialCamera.position,
      targetPos: initialCamera.target,
      environmentStyle: "studio",
      enableClouds: false,
      ambientIntensity: 2.2,
      sunIntensity: 2.8,
    });
    studioRef.current = studio;
    const { scene, camera, renderer, controls: studioControls } = studio;

    const model = buildSikorskyHelicopterModel();
    scene.add(model.root);

    const clock = createStudioClock();

    const loop = (timeNow: number) => {
      if (!studio.isVisible()) return;
      const dt = Math.min(clock.pump(timeNow).dt, 0.05);
      const controls = readSikorskyControls(liveParams.current as any);
      const { state: nextState, metrics } = stepSikorskyHelicopterSi(
        simStateRef.current,
        controls,
        dt,
      );
      simStateRef.current = nextState;

      model.updateState(metrics, controls, nextState);
      studioControls.update();
      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(loop);

    return () => {
      renderer.setAnimationLoop(null);
      model.dispose();
      studio.dispose();
      studioRef.current = null;
    };
  }, [liveParams]);

  const collective = effectiveControls.collectivePitchDeg;
  const cyclicPitch = effectiveControls.cyclicPitchForwardDeg;
  const cyclicRoll = effectiveControls.cyclicRollRightDeg;
  const pedals = effectiveControls.tailRotorPedalPercent;
  const engineRunning = effectiveControls.engineRunning !== 0;

  return (
    <section className="w-full overflow-hidden rounded-xl border border-stone-800 bg-stone-950 shadow-2xl">
      <div className="relative aspect-[4/3] max-h-[680px] w-full overflow-hidden">
        <div ref={containerRef} className="absolute inset-0" />

        {/* A native phone selector keeps every complete inspection name readable
            without running under the visibility/reset controls. */}
        <div className="absolute top-4 left-4 right-24 z-10 sm:hidden">
          <label className="sr-only" htmlFor="sikorsky-helicopter-view">
            Helicopter inspection view
          </label>
          <select
            aria-label="Helicopter inspection view"
            className="h-9 w-full rounded-lg border border-stone-700/60 bg-stone-900/85 px-3 pr-8 text-[11px] font-semibold text-stone-100 uppercase backdrop-blur-md"
            data-testid="sikorsky-mobile-view-select"
            id="sikorsky-helicopter-view"
            onChange={(event) => selectView(event.target.value as SikorskyHelicopterCameraView)}
            value={view}
          >
            {(Object.keys(SIKORSKY_HELICOPTER_CAMERA_VIEWS) as SikorskyHelicopterCameraView[]).map(
              (key) => (
                <option key={key} value={key}>
                  {SIKORSKY_HELICOPTER_VIEW_LABELS[key]}
                </option>
              ),
            )}
          </select>
        </div>

        {/* Floating View Presets */}
        <div className="absolute top-4 left-4 right-20 z-10 hidden flex-nowrap gap-2 overflow-x-auto scrollbar-none sm:flex">
          {(Object.keys(SIKORSKY_HELICOPTER_CAMERA_VIEWS) as SikorskyHelicopterCameraView[]).map(
            (key) => (
              <button
                key={key}
                type="button"
                onClick={() => selectView(key)}
                className={`shrink-0 px-3 py-1 rounded text-xs font-semibold tracking-wider uppercase transition-colors backdrop-blur-md ${
                  view === key
                    ? "bg-amber-500/90 text-stone-950 shadow-md"
                    : "bg-stone-900/80 hover:bg-stone-800/80 text-stone-300 border border-stone-700/60"
                }`}
              >
                {SIKORSKY_HELICOPTER_VIEW_LABELS[key]}
              </button>
            ),
          )}
        </div>

        {/* UI Visibility Toggle */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            type="button"
            onClick={() => setInterfaceVisible((v) => !v)}
            className="p-1.5 rounded-lg bg-stone-900/80 hover:bg-stone-800/80 text-stone-300 border border-stone-700/60 backdrop-blur-md transition-colors"
            title={interfaceVisible ? "Hide UI Overlay" : "Show UI Overlay"}
          >
            {interfaceVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={resetSimulation}
            className="p-1.5 rounded-lg bg-stone-900/80 hover:bg-stone-800/80 text-stone-300 border border-stone-700/60 backdrop-blur-md transition-colors"
            title="Reset Controls"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Controls Overlay */}
        {interfaceVisible && (
          <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-stone-950/85 border border-stone-800/80 backdrop-blur-md z-10 flex flex-col md:flex-row gap-4 justify-between items-center text-xs text-stone-200">
            <div className="flex-1 w-full space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-amber-400">Collective Pitch Lever</span>
                <span className="font-mono text-emerald-400">{collective.toFixed(1)}°</span>
              </div>
              <input
                type="range"
                aria-label="Collective pitch lever"
                min={2.0}
                max={16.0}
                step={0.2}
                value={collective}
                onChange={(e) => updateParam("collectivePitchDeg", parseFloat(e.target.value))}
                className="w-full accent-amber-500 bg-stone-800 rounded h-1.5 cursor-pointer"
              />
            </div>

            <div className="flex-1 w-full space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-cyan-400">Fore/Aft Cyclic Stick</span>
                <span className="font-mono text-cyan-400">{cyclicPitch.toFixed(1)}°</span>
              </div>
              <input
                type="range"
                aria-label="Fore and aft cyclic stick"
                min={-10.0}
                max={10.0}
                step={0.5}
                value={cyclicPitch}
                onChange={(e) => updateParam("cyclicPitchForwardDeg", parseFloat(e.target.value))}
                className="w-full accent-cyan-500 bg-stone-800 rounded h-1.5 cursor-pointer"
              />
            </div>

            <div className="flex-1 w-full space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sky-400">Lateral Cyclic Roll</span>
                <span className="font-mono text-sky-400">{cyclicRoll.toFixed(1)}°</span>
              </div>
              <input
                type="range"
                aria-label="Lateral cyclic roll"
                min={-10.0}
                max={10.0}
                step={0.5}
                value={cyclicRoll}
                onChange={(e) => updateParam("cyclicRollRightDeg", parseFloat(e.target.value))}
                className="w-full accent-sky-500 bg-stone-800 rounded h-1.5 cursor-pointer"
              />
            </div>

            <div className="flex-1 w-full space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-purple-400">Anti-Torque Rudder Pedals</span>
                <span className="font-mono text-purple-400">{pedals.toFixed(0)}%</span>
              </div>
              <input
                type="range"
                aria-label="Anti-torque rudder pedals"
                min={-100}
                max={100}
                step={5}
                value={pedals}
                onChange={(e) => updateParam("tailRotorPedalPercent", parseFloat(e.target.value))}
                className="w-full accent-purple-500 bg-stone-800 rounded h-1.5 cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateParam("engineRunning", engineRunning ? 0 : 1)}
                className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
                  engineRunning
                    ? "bg-rose-800 hover:bg-rose-700 text-white"
                    : "bg-emerald-700 hover:bg-emerald-600 text-white"
                }`}
              >
                {engineRunning ? "Cut Engine (Autorotation)" : "Start Engine"}
              </button>
            </div>
          </div>
        )}

        <p
          data-testid="sikorsky-source-boundary"
          className="pointer-events-none absolute right-4 top-14 hidden max-w-md rounded-lg border border-amber-700/60 bg-stone-950/90 px-3 py-2 text-right text-[11px] leading-4 text-amber-100 backdrop-blur-md sm:block"
        >
          <strong>Normalized modern scenario.</strong> The grant supplies control topology, not
          mass, dimensions, RPM, gear ratio, aerodynamic coefficients, inertia, force, or power. All
          displayed numbers are modern assumptions.
        </p>
      </div>

      <div className="space-y-3 border-t border-stone-800 bg-stone-950 p-4">
        <p className="text-xs leading-relaxed text-amber-200 sm:hidden">
          <strong>Normalized modern scenario.</strong> {SIKORSKY_SOURCE_BOUNDARY.reason}
        </p>
        {claimResult.refusalWarning && (
          <p className="rounded-lg border border-rose-800/70 bg-rose-950/60 px-3 py-2 text-xs text-rose-100">
            {claimResult.refusalWarning}
          </p>
        )}
        <ClaimConstraintToggle
          patentId={patentId}
          claimStates={claimStates}
          onClaimStateChange={(num, active) =>
            setClaimStates((prev) => ({ ...prev, [num]: active }))
          }
        />
      </div>
    </section>
  );
}
