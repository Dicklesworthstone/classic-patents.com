"use client";

import { Eye, EyeOff, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import {
  readBaerControls,
  readBaerOdysseyTapeFrame,
  requestBaerTargetReset,
} from "@/physics/baerOdysseyKernel";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import {
  BAER_ODYSSEY_CAMERA_VIEWS,
  type BaerOdysseyCameraView,
  baerViewForViewport,
} from "./baerOdysseyCamera";
import { buildBaerOdysseyModel } from "./baerOdysseyModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

const PATENT_ID = "us-3728480-baer-odyssey";

export function BaerOdyssey3D({ patentId = PATENT_ID }: { patentId?: string } = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [view, setView] = useState<BaerOdysseyCameraView>("overview");
  const [interfaceVisible, setInterfaceVisible] = useState(true);

  const { params, effectiveParams, claimStates, claimConstraintResult, updateParam, resetParams } =
    usePatentPhysics(patentId);
  const liveParams = useLiveSimParams(effectiveParams);

  const selectView = (nextView: BaerOdysseyCameraView) => {
    setView(nextView);
    const camera = baerViewForViewport(nextView, containerRef.current?.clientWidth ?? 1000);
    studioRef.current?.controls.setView(camera.position, camera.target);
  };

  // The persistent WebGL scene reads the stable layout-effect-synchronized control ref; depending on `.current` would recreate and flash the studio.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const overview = baerViewForViewport("overview", container.clientWidth);
    const studio = createThreeStudioScene({
      container,
      cameraPos: overview.position,
      targetPos: overview.target,
      environmentStyle: "studio",
      enableClouds: false,
      ambientIntensity: 2.2,
      sunIntensity: 2.8,
      cameraMinDistance: 1.5,
      cameraMaxDistance: 10,
    });
    studioRef.current = studio;
    const { scene, camera, renderer, controls: studioControls } = studio;

    const model = buildBaerOdysseyModel();
    scene.add(model.root);

    const loop = () => {
      if (!studio.isVisible()) return;
      const currentControls = readBaerControls(liveParams.current as any);
      const result = readBaerOdysseyTapeFrame(currentControls);

      // The transport bus is the sole kernel stepper; Three.js only projects it.
      model.updateState(result.metrics, currentControls);

      studioControls.update();
      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(loop);

    return () => {
      renderer.setAnimationLoop(null);
      model.dispose();
      studio.dispose();
    };
  }, [liveParams]);

  useEffect(() => {
    const restoreResponsiveView = () => {
      const container = containerRef.current;
      if (!container) return;
      const camera = baerViewForViewport(view, container.clientWidth);
      studioRef.current?.controls.setView(camera.position, camera.target);
    };
    window.addEventListener("resize", restoreResponsiveView);
    return () => window.removeEventListener("resize", restoreResponsiveView);
  }, [view]);

  return (
    <div className="relative flex min-h-[540px] w-full flex-col overflow-hidden rounded-2xl border border-amber-900/60 bg-slate-950 shadow-2xl">
      <div className="relative min-h-[420px] sm:min-h-[540px]">
        <div ref={containerRef} className="absolute inset-0 h-full w-full" />

        {/* Camera View Switcher Buttons */}
        <div className="absolute top-4 right-4 left-4 z-10 flex flex-nowrap gap-2 overflow-x-auto pb-1 lg:right-56">
          {(Object.keys(BAER_ODYSSEY_CAMERA_VIEWS) as BaerOdysseyCameraView[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => selectView(key)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-mono font-medium backdrop-blur-md transition ${
                view === key
                  ? "border border-amber-500 bg-amber-950/80 text-amber-300 shadow-lg"
                  : "border border-stone-800 bg-stone-900/60 text-stone-400 hover:bg-stone-800/80 hover:text-stone-200"
              }`}
            >
              {key === "overview" && "Figure 1B Apparatus"}
              {key === "tvScreen" && "Dots 20 / 20₁"}
              {key === "consoleControls" && "Master Unit 21"}
              {key === "player1" && "Control Unit 22"}
            </button>
          ))}
        </div>

        {/* Top Right HUD Controls */}
        <div className="absolute top-14 right-4 z-10 flex items-center gap-2 lg:top-4">
          <button
            type="button"
            onClick={() => setInterfaceVisible(!interfaceVisible)}
            className="rounded-lg border border-stone-800 bg-stone-900/70 p-2 text-stone-400 backdrop-blur-md hover:bg-stone-800 hover:text-stone-200 transition"
            title={interfaceVisible ? "Hide HUD Controls" : "Show HUD Controls"}
            aria-label={
              interfaceVisible ? "Hide source apparatus controls" : "Show source apparatus controls"
            }
          >
            {interfaceVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              requestBaerTargetReset();
              resetParams();
            }}
            className="flex items-center gap-1.5 rounded-lg border border-stone-800 bg-stone-900/70 px-3 py-1.5 text-xs font-mono text-stone-300 backdrop-blur-md hover:bg-stone-800 transition"
            aria-label="Reset source apparatus controls and SCR latch"
          >
            <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
            Reset Apparatus
          </button>
        </div>
      </div>

      {/* Controls remain in normal flow so they cannot cover the CRT or claim controls. */}
      {interfaceVisible && (
        <div className="relative z-10 m-4 grid grid-cols-1 gap-3 rounded-xl border border-stone-800 bg-stone-950/90 p-3.5 text-xs font-mono shadow-2xl backdrop-blur-md md:grid-cols-4">
          <div>
            <div className="mb-1 flex justify-between gap-3 text-stone-400">
              <label className="min-w-0 leading-tight" htmlFor="baer-p1-horizontal">
                Dot 20 Horizontal (Knob 17)
              </label>
              <span className="shrink-0 tabular-nums text-sky-400">
                {((params.player1PotX ?? 0.25) as number).toFixed(2)}
              </span>
            </div>
            <input
              id="baer-p1-horizontal"
              aria-label="Dot 20 horizontal potentiometer"
              type="range"
              min="0.05"
              max="0.95"
              step="0.01"
              value={(params.player1PotX ?? 0.25) as number}
              onChange={(e) => updateParam("player1PotX", parseFloat(e.target.value))}
              className="w-full accent-sky-400"
            />
          </div>

          <div>
            <div className="mb-1 flex justify-between gap-3 text-stone-400">
              <label className="min-w-0 leading-tight" htmlFor="baer-p1-vertical">
                Dot 20 Vertical (Knob 16)
              </label>
              <span className="shrink-0 tabular-nums text-sky-400">
                {((params.player1PotY ?? 0.5) as number).toFixed(2)}
              </span>
            </div>
            <input
              id="baer-p1-vertical"
              aria-label="Dot 20 vertical potentiometer"
              type="range"
              min="0.05"
              max="0.95"
              step="0.01"
              value={(params.player1PotY ?? 0.5) as number}
              onChange={(e) => updateParam("player1PotY", parseFloat(e.target.value))}
              className="w-full accent-sky-400"
            />
          </div>

          <div>
            <div className="mb-1 flex justify-between gap-3 text-stone-400">
              <label className="min-w-0 leading-tight" htmlFor="baer-p2-horizontal">
                Dot 20₁ Horizontal (Knob 17₁)
              </label>
              <span className="shrink-0 tabular-nums text-pink-400">
                {((params.player2PotX ?? 0.75) as number).toFixed(2)}
              </span>
            </div>
            <input
              id="baer-p2-horizontal"
              aria-label="Dot 20-1 horizontal potentiometer"
              type="range"
              min="0.05"
              max="0.95"
              step="0.01"
              value={(params.player2PotX ?? 0.75) as number}
              onChange={(e) => updateParam("player2PotX", parseFloat(e.target.value))}
              className="w-full accent-pink-400"
            />
          </div>

          <div>
            <div className="mb-1 flex justify-between gap-3 text-stone-400">
              <label className="min-w-0 leading-tight" htmlFor="baer-p2-vertical">
                Dot 20₁ Vertical (Knob 16₁)
              </label>
              <span className="shrink-0 tabular-nums text-pink-400">
                {((params.player2PotY ?? 0.5) as number).toFixed(2)}
              </span>
            </div>
            <input
              id="baer-p2-vertical"
              aria-label="Dot 20-1 vertical potentiometer"
              type="range"
              min="0.05"
              max="0.95"
              step="0.01"
              value={(params.player2PotY ?? 0.5) as number}
              onChange={(e) => updateParam("player2PotY", parseFloat(e.target.value))}
              className="w-full accent-pink-400"
            />
          </div>
        </div>
      )}

      <div className="shrink-0 p-4 bg-stone-950 border-t border-stone-800">
        <ClaimConstraintToggle
          patentId={patentId}
          claimStates={claimStates}
          onClaimStateChange={(claimNumber, active) =>
            updateParam(claimConstraintStateParamId(claimNumber), active ? 1 : 0)
          }
        />
        {claimConstraintResult.refusalWarning && (
          <p className="mt-3 rounded-lg border border-rose-400/50 bg-rose-950/50 px-3 py-2 text-xs leading-relaxed text-rose-200">
            {claimConstraintResult.refusalWarning}
          </p>
        )}
      </div>
    </div>
  );
}
