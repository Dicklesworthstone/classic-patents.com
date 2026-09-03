"use client";

import { Camera, Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import {
  KAMEN_INJECTION_ID,
  readKamenInjectionControls,
  readKamenInjectionTapeFrame,
  resetKamenInjectionTape,
} from "@/physics/kamenInjectionKernel";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { buildKamenInjectionModel } from "./kamenInjectionModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

const VIEWS = {
  overview: {
    label: "Figure 1",
    position: [7.6, 4.2, 8.4] as [number, number, number],
    target: [0.2, -0.05, 0] as [number, number, number],
  },
  drive: {
    label: "Figure 3 drive",
    position: [-6.6, 2.3, 5.8] as [number, number, number],
    target: [-1.1, -0.18, 0] as [number, number, number],
  },
  counter: {
    label: "Figure 6 loop",
    position: [5.3, 2.8, 5.7] as [number, number, number],
    target: [1.5, -0.25, -0.75] as [number, number, number],
  },
  syringe: {
    label: "Syringe contact",
    position: [5.8, 3.0, 5.2] as [number, number, number],
    target: [1.6, 0.85, 0.45] as [number, number, number],
  },
} as const;

function cameraForViewport(viewName: keyof typeof VIEWS, width: number) {
  const view = VIEWS[viewName];
  if (width >= 640) return view;
  const multiplier = 1.55;
  return {
    ...view,
    position: [
      view.target[0] + (view.position[0] - view.target[0]) * multiplier,
      view.target[1] + (view.position[1] - view.target[1]) * multiplier,
      view.target[2] + (view.position[2] - view.target[2]) * multiplier,
    ] as [number, number, number],
  };
}

export function KamenMedicationInjection3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [view, setView] = useState<keyof typeof VIEWS>("overview");
  const { effectiveParams, claimStates, claimConstraintResult, updateParam, resetParams } =
    usePatentPhysics(KAMEN_INJECTION_ID);
  useFrankenSimPhysics(KAMEN_INJECTION_ID);
  const liveParams = useLiveSimParams(effectiveParams);
  const controls = readKamenInjectionControls(effectiveParams);
  const tape = readKamenInjectionTapeFrame(controls);
  const selectView = (next: keyof typeof VIEWS) => {
    setView(next);
    const camera = cameraForViewport(next, containerRef.current?.clientWidth ?? 1000);
    studioRef.current?.controls.setView(camera.position, camera.target);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const initialView = cameraForViewport("overview", container.clientWidth);
    const studio = createThreeStudioScene({
      container,
      cameraPos: initialView.position,
      targetPos: initialView.target,
      environmentStyle: "studio",
      enableClouds: false,
      ambientIntensity: 2.2,
      sunIntensity: 2.8,
      cameraMinDistance: 2.4,
      cameraMaxDistance: 28,
    });
    studioRef.current = studio;
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.7,
      metalness: 0.22,
    });
    const floor = new THREE.Mesh(new THREE.CircleGeometry(6.3, 64), floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.17;
    floor.receiveShadow = true;
    studio.scene.add(floor);
    const model = buildKamenInjectionModel();
    studio.scene.add(model.root);
    studio.renderer.setAnimationLoop(() => {
      if (!studio.isVisible()) return;
      const currentControls = readKamenInjectionControls(liveParams.current);
      model.updateFrame(readKamenInjectionTapeFrame(currentControls));
      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    });
    return () => {
      studio.renderer.setAnimationLoop(null);
      studio.scene.remove(model.root, floor);
      model.dispose();
      floor.geometry.dispose();
      floorMaterial.dispose();
      studio.dispose();
      studioRef.current = null;
    };
  }, [liveParams]);

  useEffect(() => {
    const restoreView = () => {
      const container = containerRef.current;
      if (!container) return;
      const camera = cameraForViewport(view, container.clientWidth);
      studioRef.current?.controls.setView(camera.position, camera.target);
    };
    window.addEventListener("resize", restoreView);
    return () => window.removeEventListener("resize", restoreView);
  }, [view]);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">
      <div className="relative min-h-[430px] sm:min-h-[540px]">
        <div ref={containerRef} className="absolute inset-0" />
        <div className="pointer-events-none absolute top-5 left-5 hidden rounded-xl border border-cyan-700/70 bg-slate-950/90 px-3 py-2 backdrop-blur sm:block">
          <p className="font-mono text-[10px] tracking-[0.16em] text-cyan-300">
            US 3,858,581 · FIGS. 1–6 · SOURCE TOPOLOGY
          </p>
          <p className="mt-1 text-sm font-medium text-white">
            Clamped syringe · counted screw drive · clutch
          </p>
        </div>
        <div className="pointer-events-none absolute right-3 bottom-3 hidden max-w-[24rem] rounded-xl border border-slate-700 bg-slate-950/90 px-3 py-2 font-mono text-[11px] leading-4 text-slate-200 backdrop-blur sm:block">
          <p className="text-cyan-300">{tape.metrics.phase.toUpperCase()}</p>
          <p>
            Counter 116/114: {tape.metrics.secondCounterDigit}/{tape.metrics.firstCounterDigit} ·
            target {controls.selectedPulseCount}
          </p>
          <p>
            Screw turns {tape.state.leadScrewTurns.toFixed(1)} · follower travel{" "}
            {(tape.metrics.followerPositionNormalized * 100).toFixed(0)}% normalized
          </p>
          <p className="text-rose-300">
            Pitch, dose, pressure, flow, and safe rate: not disclosed.
          </p>
        </div>
      </div>
      <div className="grid gap-3 border-t border-slate-700/80 bg-slate-950 p-3 sm:p-5 lg:grid-cols-[1fr_auto]">
        <div className="space-y-2">
          <div
            data-mobile-layout="source-title-below-canvas"
            className="rounded-xl border border-cyan-700/70 bg-slate-900/90 px-3 py-2 sm:hidden"
          >
            <p className="font-mono text-[10px] tracking-[0.16em] text-cyan-300">
              US 3,858,581 · FIGS. 1–6 · SOURCE TOPOLOGY
            </p>
            <p className="mt-1 text-sm font-medium text-white">
              Clamped syringe · counted screw drive · clutch
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <label className="text-xs text-slate-200">
              Pulse target{" "}
              <span className="float-right font-mono text-purple-300">
                {controls.selectedPulseCount}
              </span>
              <input
                className="mt-1 w-full accent-purple-400"
                type="range"
                min="1"
                max="99"
                step="1"
                value={controls.selectedPulseCount}
                aria-label="Selected pulse count"
                onChange={(event) => updateParam("selectedPulseCount", Number(event.target.value))}
              />
            </label>
            <label className="text-xs text-slate-200">
              Display speed{" "}
              <span className="float-right font-mono text-cyan-300">
                {controls.displayTurnsPerSecond.toFixed(0)} turns/s
              </span>
              <input
                className="mt-1 w-full accent-cyan-400"
                type="range"
                min="1"
                max="12"
                step="1"
                value={controls.displayTurnsPerSecond}
                aria-label="Museum display turns per second"
                onChange={(event) =>
                  updateParam("displayTurnsPerSecond", Number(event.target.value))
                }
              />
            </label>
            <label className="text-xs text-slate-200">
              Motor-off display interval{" "}
              <span className="float-right font-mono text-amber-300">
                {controls.offIntervalDisplaySeconds.toFixed(1)} s
              </span>
              <input
                className="mt-1 w-full accent-amber-400"
                type="range"
                min="0.5"
                max="8"
                step="0.5"
                value={controls.offIntervalDisplaySeconds}
                aria-label="Museum motor-off display interval"
                onChange={(event) =>
                  updateParam("offIntervalDisplaySeconds", Number(event.target.value))
                }
              />
            </label>
            <label className="text-xs text-slate-200">
              Claim 3 clutch
              <select
                className="mt-1 w-full rounded border border-slate-600 bg-slate-900 p-1 text-xs"
                value={Number(controls.clutchEngaged)}
                aria-label="Clutch engagement"
                onChange={(event) => updateParam("clutchEngaged", Number(event.target.value))}
              >
                <option value="1">Engaged · screw driven</option>
                <option value="0">Released · motor only</option>
              </select>
            </label>
          </div>
          <ClaimConstraintToggle
            patentId={KAMEN_INJECTION_ID}
            claimStates={claimStates}
            onToggleClaim={(claimNumber, active) =>
              updateParam(claimConstraintStateParamId(claimNumber), active ? 1 : 0)
            }
          />
          {claimConstraintResult.activeFailures.length > 0 && (
            <div role="status" className="rounded-lg border border-rose-800 bg-rose-950/80 p-2">
              {claimConstraintResult.activeFailures.map((failure) => (
                <p key={failure} className="text-[10px] leading-4 text-rose-100">
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
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <button
            type="button"
            onClick={() => updateParam("running", controls.running ? 0 : 1)}
            className="min-h-9 rounded-lg border border-cyan-500 bg-cyan-500 px-2.5 text-xs font-semibold text-slate-950"
          >
            {controls.running ? (
              <Pause className="mr-1 inline h-3.5 w-3.5" />
            ) : (
              <Play className="mr-1 inline h-3.5 w-3.5" />
            )}
            {controls.running ? "Pause" : "Run"}
          </button>
          {(Object.keys(VIEWS) as Array<keyof typeof VIEWS>).map((candidate) => (
            <button
              key={candidate}
              type="button"
              onClick={() => selectView(candidate)}
              className={`min-h-9 rounded-lg border px-2.5 text-xs capitalize focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 ${view === candidate ? "border-cyan-400 bg-cyan-400 text-slate-950" : "border-slate-600 bg-slate-900 text-slate-200 hover:bg-slate-800"}`}
            >
              <Camera className="mr-1 inline h-3.5 w-3.5" />
              {VIEWS[candidate].label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              resetKamenInjectionTape();
              resetParams();
              selectView("overview");
            }}
            className="min-h-9 rounded-lg border border-slate-600 bg-slate-900 px-2.5 text-xs text-slate-200 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
          >
            <RotateCcw className="mr-1 inline h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>
      <p className="border-t border-slate-800 px-4 py-3 text-xs leading-5 text-slate-300 sm:px-5">
        The cutaway follows Figs. 1–6: syringe 12 is clamped to plate 52; follower 18 stays threaded
        on screw 22 and pushes plunger 14; striker 80 reaches switch 84 once per screw turn; the
        wired 114/116 counter pair stops motor 24 at the selected integer. Claim{" "}
        {tape.metrics.activeClaim} is the current source probe. {tape.metrics.refusal.reason}
      </p>
    </section>
  );
}
