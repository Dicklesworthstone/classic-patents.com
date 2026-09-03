"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PhysicsTelemetryBadge } from "@/components/patents/PhysicsTelemetryBadge";
import {
  buildStackhouseSourceModel,
  type StackhouseSourceModel,
} from "@/components/patents/visuals/three/stackhouseSourceModel";
import {
  createThreeStudioScene,
  type StudioContext,
} from "@/components/patents/visuals/three/ThreeStudioScene";
import { ALL_COLORIZED_EQUATIONS } from "@/data/colorizedEquations";
import {
  readStackhouseSourceControls,
  stepStackhouseSourceTopology,
} from "@/physics/stackhouseSourceKernel";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { useLiveSimParams } from "./useLiveSimParams";

const PATENT_ID = "us-4068536-stackhouse-manipulator";
const VIEWS = {
  overview: {
    position: [1.75, 1.15, 1.8] as [number, number, number],
    target: [0, -0.03, -0.45] as [number, number, number],
  },
  shafts: {
    position: [2.0, 0.6, -1.35] as [number, number, number],
    target: [0, 0, -0.72] as [number, number, number],
  },
  pointP: {
    position: [1.65, 1.25, 1.55] as [number, number, number],
    target: [0, 0, 0.18] as [number, number, number],
  },
  tool: {
    position: [1.9, 1.5, 2.5] as [number, number, number],
    target: [0.15, 0.05, 0.48] as [number, number, number],
  },
};

export default function StackhouseSourceBounded3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const modelRef = useRef<StackhouseSourceModel | null>(null);
  const [view, setView] = useState<keyof typeof VIEWS>("overview");
  const { params, updateParam, resetParams } = usePatentPhysics(PATENT_ID);
  const controls = useMemo(() => readStackhouseSourceControls(params), [params]);
  const pose = useMemo(() => stepStackhouseSourceTopology(controls), [controls]);
  const livePose = useLiveSimParams(pose);
  const liveControls = useLiveSimParams(controls);

  useFrankenSimPhysics(PATENT_ID, {
    domain: "solid_mechanics",
    refusal: { isRefused: true, reason: pose.refusal.reason },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: The persistent WebGL scene reads stable layout-effect-synchronized pose and control refs; depending on `.current` would recreate and flash the studio.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const studio = createThreeStudioScene({
      container,
      cameraPos: VIEWS.overview.position,
      targetPos: VIEWS.overview.target,
      environmentStyle: "studio",
      enableClouds: false,
      enableFloorGrid: true,
      ambientIntensity: 2.1,
      sunIntensity: 2.5,
      cameraMinDistance: 1.2,
      cameraMaxDistance: 8,
    });
    studioRef.current = studio;
    const model = buildStackhouseSourceModel();
    modelRef.current = model;
    studio.scene.add(model.root);

    let frame = 0;
    let destroyed = false;
    const render = () => {
      if (destroyed) return;
      frame = requestAnimationFrame(render);
      if (!studio.isVisible()) return;
      model.update(livePose.current, liveControls.current);
      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };
    frame = requestAnimationFrame(render);

    return () => {
      destroyed = true;
      cancelAnimationFrame(frame);
      studio.scene.remove(model.root);
      model.dispose();
      studio.cleanup();
      modelRef.current = null;
      studioRef.current = null;
    };
  }, []);

  const chooseView = (next: keyof typeof VIEWS) => {
    setView(next);
    const camera = VIEWS[next];
    studioRef.current?.controls.setView(camera.position, camera.target);
  };

  const equations = ALL_COLORIZED_EQUATIONS[PATENT_ID] ?? [];

  return (
    <section className="space-y-4 rounded-xl border border-border/40 bg-card/60 p-4 backdrop-blur">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border/30 pb-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            3D studio: nested Stackhouse wrist transmission
          </h3>
          <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground">
            The distal assemblies inherit every upstream transform. The elbow motors meet the
            concentric forearm shafts; the shafts meet bevel-gear housings; the terminal shaft and
            end effector remain attached through the entire pose. Housing and outer-tube quadrants
            are partially translucent museum cutaways so the nested shafts remain inspectable; that
            transparency is not attributed to the patent hardware.
          </p>
        </div>
        <div className="flex flex-wrap gap-1 rounded-lg border border-border/50 bg-background/50 p-1">
          {(Object.keys(VIEWS) as Array<keyof typeof VIEWS>).map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => chooseView(name)}
              className={`rounded px-2 py-1 text-xs capitalize ${
                view === name
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {name === "pointP" ? "Point P" : name}
            </button>
          ))}
        </div>
      </header>

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,2fr)_minmax(24rem,1fr)]">
        <div className="relative min-h-[28rem] overflow-hidden rounded-lg border border-border/30 bg-slate-950">
          <div ref={containerRef} className="absolute inset-0" />
          <div className="pointer-events-none absolute bottom-3 left-3 max-w-sm rounded bg-black/70 px-3 py-2 font-mono text-[10px] leading-relaxed text-white backdrop-blur">
            {pose.intersectionState} • display bend {pose.bendAngleDeg.toFixed(1)}° • selected
            obliquities {controls.firstObliqueAngleDeg.toFixed(0)}° /{" "}
            {controls.secondObliqueAngleDeg.toFixed(0)}°
          </div>
        </div>

        <div className="space-y-3">
          <PhysicsTelemetryBadge patentId={PATENT_ID} equations={equations} />
          <div className="space-y-3 rounded-lg border border-border/30 bg-muted/20 p-3">
            {(
              [
                ["forearmRollDeg", "Axis A–A′ roll", -180, 180],
                ["intermediateRollDeg", "Axis B–B′ roll", -180, 180],
                ["toolRollDeg", "Axis C–C′ roll", -180, 180],
                ["firstObliqueAngleDeg", "Selected A–B obliquity", 46, 80],
                ["secondObliqueAngleDeg", "Selected B–C obliquity", 46, 80],
              ] as const
            ).map(([id, label, min, max]) => (
              <label key={id} className="block text-[11px]">
                <span className="mb-1 flex justify-between gap-2">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-mono text-primary">{controls[id].toFixed(0)}°</span>
                </span>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step="1"
                  value={controls[id]}
                  onChange={(event) => updateParam(id, Number(event.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-border accent-primary"
                />
              </label>
            ))}

            <label className="flex items-center justify-between gap-3 text-[11px]">
              <span>
                <span className="block text-foreground">Preferred common point P</span>
                <span className="text-muted-foreground">
                  Off shows the source-permitted offset contrast
                </span>
              </span>
              <input
                type="checkbox"
                checked={controls.singleIntersection >= 0.5}
                onChange={(event) =>
                  updateParam("singleIntersection", event.target.checked ? 1 : 0)
                }
                className="h-4 w-4 accent-primary"
              />
            </label>

            <button
              type="button"
              onClick={resetParams}
              className="w-full rounded-md border border-border/60 bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
            >
              Reset source exhibit
            </button>
          </div>
        </div>
      </div>

      <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-950 dark:text-amber-100">
        <strong>Quantitative refusal:</strong> {pose.refusal.reason}
      </p>
    </section>
  );
}
