"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PhysicsTelemetryBadge } from "@/components/patents/PhysicsTelemetryBadge";
import { buildStackhouseSourceModel } from "@/components/patents/visuals/three/stackhouseSourceModel";
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
import {
  type StackhouseSourceCameraPreset,
  stackhouseSourceCameraForViewport,
} from "./stackhouseSourceCamera";
import { useLiveSimParams } from "./useLiveSimParams";

const PATENT_ID = "us-4068536-stackhouse-manipulator";

export default function StackhouseSourceBounded3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [view, setView] = useState<StackhouseSourceCameraPreset>("overview");
  const { params, updateParam } = usePatentPhysics(PATENT_ID);
  const controls = useMemo(() => readStackhouseSourceControls(params), [params]);
  const pose = useMemo(() => stepStackhouseSourceTopology(controls), [controls]);
  const livePose = useLiveSimParams(pose);
  const liveControls = useLiveSimParams(controls);

  useFrankenSimPhysics(PATENT_ID, {
    domain: "solid_mechanics",
    refusal: { isRefused: true, reason: pose.refusal.reason },
  });

  // The persistent WebGL scene reads stable layout-effect-synchronized pose and control refs; depending on `.current` would recreate and flash the studio.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const initialView = stackhouseSourceCameraForViewport("overview", container.clientWidth);
    const studio = createThreeStudioScene({
      container,
      cameraPos: initialView.position,
      targetPos: initialView.target,
      environmentStyle: "studio",
      enableClouds: false,
      enableFloorGrid: true,
      ambientIntensity: 2.1,
      sunIntensity: 2.5,
      cameraMinDistance: 1.2,
      cameraMaxDistance: 12,
    });
    studioRef.current = studio;
    const model = buildStackhouseSourceModel();
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
      studioRef.current = null;
    };
  }, [livePose, liveControls]);

  const chooseView = (next: StackhouseSourceCameraPreset) => {
    setView(next);
    const camera = stackhouseSourceCameraForViewport(
      next,
      containerRef.current?.clientWidth ?? 1000,
    );
    studioRef.current?.controls.setView(camera.position, camera.target);
  };

  useEffect(() => {
    const restoreView = () => {
      const container = containerRef.current;
      if (!container) return;
      const camera = stackhouseSourceCameraForViewport(view, container.clientWidth);
      studioRef.current?.controls.setView(camera.position, camera.target);
    };
    window.addEventListener("resize", restoreView);
    return () => window.removeEventListener("resize", restoreView);
  }, [view]);

  const equations = ALL_COLORIZED_EQUATIONS[PATENT_ID] ?? [];

  return (
    <section
      data-testid="stackhouse-source-three"
      data-axis-intersection={pose.singleIntersection >= 0.5 ? "point-p" : "offset-contrast"}
      data-tool-direction={pose.toolDirection.map((value) => value.toFixed(6)).join(",")}
      data-rotation-determinant={pose.rotationDeterminant.toFixed(12)}
      data-rotation-orthonormality-error={pose.rotationOrthonormalityError.toExponential(3)}
      data-joint-owner={pose.jointOwner}
      className="space-y-4 rounded-xl border border-border/40 bg-card/60 p-3 backdrop-blur sm:p-4"
    >
      <div className="relative min-h-[430px] overflow-hidden rounded-lg border border-border/30 bg-slate-950 sm:min-h-[520px]">
        <div ref={containerRef} className="absolute inset-0" />
        <div className="pointer-events-none absolute top-4 left-4 hidden max-w-xl rounded-xl border border-cyan-800/70 bg-slate-950/90 px-3 py-2 backdrop-blur sm:block">
          <p className="font-mono text-[10px] tracking-[0.15em] text-cyan-300">
            US 4,068,536 · FIGS. 1–4 · SOURCE TOPOLOGY
          </p>
          <p className="mt-1 text-sm font-medium text-white">
            Elbow motors · concentric shafts · three bevel paths · point P
          </p>
        </div>
        <div className="pointer-events-none absolute right-3 bottom-3 hidden max-w-sm rounded-xl border border-slate-700 bg-slate-950/90 px-3 py-2 font-mono text-[10px] leading-4 text-slate-200 backdrop-blur sm:block">
          <p className="text-cyan-300">{pose.intersectionState.toUpperCase()}</p>
          <p>
            Display bend {pose.bendAngleDeg.toFixed(1)}° · azimuth {pose.azimuthAngleDeg.toFixed(1)}
            °
          </p>
          <p>
            Selected obliquities {controls.firstObliqueAngleDeg.toFixed(0)}° /{" "}
            {controls.secondObliqueAngleDeg.toFixed(0)}° · source says only &gt;45°
          </p>
          <p className="text-rose-300">Torque, speed, payload, precision: not disclosed.</p>
        </div>
      </div>

      <div className="space-y-3">
        <div
          data-mobile-layout="source-title-below-canvas"
          className="rounded-xl border border-cyan-800/70 bg-slate-950 px-3 py-2 sm:hidden"
        >
          <p className="font-mono text-[10px] tracking-[0.15em] text-cyan-300">
            US 4,068,536 · FIGS. 1–4 · SOURCE TOPOLOGY
          </p>
          <p className="mt-1 text-sm font-medium text-white">
            Elbow motors · concentric shafts · three bevel paths · point P
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["overview", "shafts", "pointP", "tool"] as StackhouseSourceCameraPreset[]).map(
            (name) => (
              <button
                key={name}
                type="button"
                onClick={() => chooseView(name)}
                className={`min-h-9 rounded-lg border px-3 text-xs capitalize ${
                  view === name
                    ? "border-cyan-500 bg-cyan-500 text-slate-950"
                    : "border-border/60 bg-background text-foreground hover:bg-muted"
                }`}
              >
                {name === "pointP" ? "Point P" : name}
              </button>
            ),
          )}
          <button
            type="button"
            data-testid="stackhouse-intersection-toggle"
            aria-pressed={controls.singleIntersection < 0.5}
            onClick={() =>
              updateParam("singleIntersection", controls.singleIntersection >= 0.5 ? 0 : 1)
            }
            className="min-h-9 rounded-lg border border-amber-500/60 bg-amber-500/10 px-3 text-xs text-amber-900 hover:bg-amber-500/20 dark:text-amber-100"
          >
            {controls.singleIntersection >= 0.5 ? "Show offset contrast" : "Restore point P"}
          </button>
        </div>
        <PhysicsTelemetryBadge patentId={PATENT_ID} equations={equations} />
      </div>

      <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-950 dark:text-amber-100">
        The cutaway follows the source path: hydraulic motors 9a/9b/9c drive spur gears into shafts
        15/16/19; bevel pairs 17/18 and 21/22 turn the B-axis members; pair 24/25 turns terminal
        shaft 26 and its attached end effector 11. The housings and outer tubes are partially
        translucent museum cutaways, not source materials. <strong>Quantitative refusal:</strong>{" "}
        {pose.refusal.reason}
      </p>
    </section>
  );
}
