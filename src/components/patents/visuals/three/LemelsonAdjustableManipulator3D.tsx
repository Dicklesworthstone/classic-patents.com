"use client";

import { Eye, EyeOff, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { stepLemelsonManipulatorTopology } from "@/physics/lemelsonAdjustableManipulatorKernel";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { buildLemelsonAdjustableManipulatorModel } from "./lemelsonAdjustableManipulatorModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";

const PATENT_ID = "us-3260375-lemelson-adjustable-manipulator";

const VIEWS = {
  overview: {
    position: [4.8, 3.2, 5.2] as [number, number, number],
    target: [0, 1.0, 0] as [number, number, number],
  },
  gantry: {
    position: [0.0, 3.8, 4.5] as [number, number, number],
    target: [0, 2.0, 0] as [number, number, number],
  },
  wrist: {
    position: [2.5, 0.8, 2.5] as [number, number, number],
    target: [0.5, 0.2, 0] as [number, number, number],
  },
} as const;

const POSE_CONTROLS = [
  {
    id: "carriagePosition",
    label: "Carriage Display Coordinate",
    min: -1,
    max: 1,
    defaultValue: 0.15,
    accent: "accent-cyan-400",
  },
  {
    id: "columnElevation",
    label: "Vertical-Member Display Coordinate",
    min: 0,
    max: 1,
    defaultValue: 0.65,
    accent: "accent-indigo-400",
  },
  {
    id: "columnAzimuth",
    label: "Rotary Display Coordinate",
    min: -1,
    max: 1,
    defaultValue: 0.25,
    accent: "accent-amber-400",
  },
  {
    id: "wristPivot",
    label: "Pivot-Joint Display Coordinate",
    min: -1,
    max: 1,
    defaultValue: -0.2,
    accent: "accent-emerald-400",
  },
  {
    id: "jawClosure",
    label: "Illustrated Jaw Closure",
    min: 0,
    max: 1,
    defaultValue: 0.45,
    accent: "accent-rose-400",
  },
  {
    id: "stop1Azimuth",
    label: "Rotary Actuator 1 Display Position",
    min: -1,
    max: 1,
    defaultValue: -0.75,
    accent: "accent-amber-400",
  },
  {
    id: "stop2Azimuth",
    label: "Rotary Actuator 2 Display Position",
    min: -1,
    max: 1,
    defaultValue: 0.75,
    accent: "accent-orange-400",
  },
  {
    id: "stop1Elevation",
    label: "Vertical Actuator 1 Display Position",
    min: 0,
    max: 1,
    defaultValue: 0.15,
    accent: "accent-indigo-400",
  },
  {
    id: "stop2Elevation",
    label: "Vertical Actuator 2 Display Position",
    min: 0,
    max: 1,
    defaultValue: 0.85,
    accent: "accent-violet-400",
  },
] as const;

export function LemelsonAdjustableManipulator3D({
  patentId = PATENT_ID,
}: {
  patentId?: string;
} = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [view, setView] = useState<keyof typeof VIEWS>("overview");
  const [interfaceVisible, setInterfaceVisible] = useState(true);
  const { params, updateParam, resetParams } = usePatentPhysics(PATENT_ID);
  const liveParams = useRef(params);
  liveParams.current = params;
  const state = stepLemelsonManipulatorTopology(params);

  useFrankenSimPhysics(patentId, {
    domain: "solid_mechanics",
    refusal: { isRefused: true, reason: state.refusal.reason },
  });

  const selectView = (nextView: keyof typeof VIEWS) => {
    setView(nextView);
    const camera = VIEWS[nextView];
    studioRef.current?.controls.setView(camera.position, camera.target);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const studio = createThreeStudioScene({
      container,
      cameraPos: VIEWS.overview.position,
      targetPos: VIEWS.overview.target,
      environmentStyle: "studio",
      enableClouds: false,
      ambientIntensity: 2.5,
      sunIntensity: 3.0,
      cameraMinDistance: 2.0,
      cameraMaxDistance: 15.0,
    });
    studioRef.current = studio;
    const { scene, camera, renderer, controls } = studio;

    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.3,
      roughness: 0.7,
    });
    const floor = new THREE.Mesh(new THREE.CircleGeometry(5.0, 64), floorMaterial);
    floor.name = "factory floor reference";
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.5;
    floor.receiveShadow = true;
    scene.add(floor);

    const model = buildLemelsonAdjustableManipulatorModel();
    model.updateState(stepLemelsonManipulatorTopology(liveParams.current));
    scene.add(model.root);

    let frame = 0;
    const clock = createStudioClock();
    const animate = (now: number) => {
      frame = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      clock.pump(now);
      model.updateState(stepLemelsonManipulatorTopology(liveParams.current));
      controls.update();
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      model.dispose();
      floor.geometry.dispose();
      floorMaterial.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, []);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">
      <div className="relative min-h-[500px] sm:min-h-[630px]">
        <div ref={containerRef} className="absolute inset-0" />
        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-3 sm:inset-x-5 sm:top-5">
          <div className="rounded-xl border border-cyan-700/70 bg-slate-950/85 px-3 py-2 backdrop-blur">
            <p className="font-mono text-[10px] tracking-[0.16em] text-cyan-300">
              US 3,260,375 · ADJUSTABLE MANIPULATOR TOPOLOGY
            </p>
            <h3 className="text-sm font-semibold text-white">Procedural WebGL Topology Model</h3>
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            <div className="flex rounded-lg border border-slate-700 bg-slate-900/80 p-0.5 backdrop-blur">
              {(Object.keys(VIEWS) as (keyof typeof VIEWS)[]).map((vKey) => (
                <button
                  key={vKey}
                  type="button"
                  onClick={() => selectView(vKey)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                    view === vKey
                      ? "bg-cyan-500/20 text-cyan-300"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {vKey}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setInterfaceVisible((prev) => !prev)}
              className="rounded-lg border border-slate-700 bg-slate-900/80 p-1.5 text-slate-300 hover:text-white backdrop-blur"
              title={interfaceVisible ? "Hide controls HUD" : "Show controls HUD"}
            >
              {interfaceVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Controls HUD Panel */}
        {interfaceVisible && (
          <div className="absolute right-3 bottom-3 z-10 max-h-[480px] w-80 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900/90 p-4 text-slate-200 shadow-2xl backdrop-blur sm:right-5 sm:bottom-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Normalized Display Controls
              </h4>
              <button
                type="button"
                onClick={resetParams}
                className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-xs text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {POSE_CONTROLS.map((ctrl) => {
                const val = (params[ctrl.id] ?? ctrl.defaultValue) as number;
                return (
                  <div key={ctrl.id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <label htmlFor={`3d-${ctrl.id}`} className="text-slate-300">
                        {ctrl.label}
                      </label>
                      <span className="font-mono text-cyan-300">{val.toFixed(2)}</span>
                    </div>
                    <input
                      id={`3d-${ctrl.id}`}
                      type="range"
                      min={ctrl.min}
                      max={ctrl.max}
                      step={0.05}
                      value={val}
                      onChange={(e) => updateParam(ctrl.id, Number.parseFloat(e.target.value))}
                      className={`h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 ${ctrl.accent}`}
                    />
                  </div>
                );
              })}
            </div>

            <div className="mt-4 border-t border-slate-800 pt-3 text-[11px] text-slate-400 leading-relaxed">
              <p className="font-mono font-semibold text-cyan-300">Display boundary:</p>
              <p>
                The source illustrates carriage, column, rotary, pivot, jaw, and switch-actuator
                relationships. All scene lengths and transforms are procedural; no source
                dimensions, speed, force, timing, or controller-performance result is displayed.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
