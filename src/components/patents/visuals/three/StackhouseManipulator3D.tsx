"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PhysicsTelemetryBadge } from "@/components/patents/PhysicsTelemetryBadge";
import {
  buildStackhouseManipulatorModel,
  type StackhouseManipulator3DModel,
} from "@/components/patents/visuals/three/stackhouseManipulatorModel";
import {
  createThreeStudioScene,
  type StudioContext,
} from "@/components/patents/visuals/three/ThreeStudioScene";
import { ALL_COLORIZED_EQUATIONS } from "@/data/colorizedEquations";
import {
  readStackhouseManipulatorControls,
  stepStackhouseManipulatorSi,
} from "@/physics/stackhouseManipulatorKernel";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

export default function StackhouseManipulator3D({
  patentId = "us-4068536-stackhouse-manipulator",
}: {
  patentId?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const modelRef = useRef<StackhouseManipulator3DModel | null>(null);

  const { params, updateParam } = usePatentPhysics(patentId);
  const controls = useMemo(() => readStackhouseManipulatorControls(params), [params]);
  const tel = useMemo(() => stepStackhouseManipulatorSi(controls), [controls]);

  useFrankenSimPhysics(patentId);

  const liveControlsRef = useRef(controls);
  const liveTelRef = useRef(tel);
  useEffect(() => {
    liveControlsRef.current = controls;
    liveTelRef.current = tel;
  }, [controls, tel]);

  const [cameraPreset, setCameraPreset] = useState<"isometric" | "forearm" | "bend" | "flange">(
    "isometric",
  );

  useEffect(() => {
    if (!containerRef.current) return;

    let destroyed = false;

    const studio = createThreeStudioScene({
      container: containerRef.current,
      cameraPos: [0.6, 0.4, 0.7],
      targetPos: [0, 0, 0],
      ambientIntensity: 0.7,
      sunIntensity: 1.6,
      enableFloorGrid: true,
    });
    studioRef.current = studio;

    const model = buildStackhouseManipulatorModel();
    modelRef.current = model;
    studio.scene.add(model.root);

    const clock = createStudioClock();
    let frame = 0;
    const animate = (now: number) => {
      if (destroyed) return;
      frame = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      clock.pump(now);

      model.update(liveTelRef.current, liveControlsRef.current);
      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };

    frame = requestAnimationFrame(animate);

    return () => {
      destroyed = true;
      cancelAnimationFrame(frame);
      if (modelRef.current) {
        studio.scene.remove(modelRef.current.root);
        modelRef.current.dispose();
      }
      studio.dispose();
    };
  }, []);

  useEffect(() => {
    if (!studioRef.current) return;
    const { camera, controls: orbitControls } = studioRef.current;
    if (cameraPreset === "isometric") {
      camera.position.set(0.6, 0.4, 0.7);
      orbitControls.target.set(0, 0, 0);
    } else if (cameraPreset === "forearm") {
      camera.position.set(0, 0.6, 0.1);
      orbitControls.target.set(0, 0, -0.15);
    } else if (cameraPreset === "bend") {
      camera.position.set(0.7, 0.1, 0.1);
      orbitControls.target.set(0, 0.05, 0.05);
    } else if (cameraPreset === "flange") {
      camera.position.set(0.2, 0.3, 0.5);
      orbitControls.target.set(0, 0.1, 0.1);
    }
    orbitControls.update();
  }, [cameraPreset]);

  const equations = ALL_COLORIZED_EQUATIONS[patentId] ?? [];

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border/40 bg-card/60 p-4 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/30 pb-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            3D Studio: 3-Roll Spherical Wrist Manipulator
          </h3>
          <p className="text-xs text-muted-foreground">
            US 4,068,536 • Concentric Oblique Shafts & Single Intersection Center Point
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-background/50 p-1">
          {(
            [
              { key: "isometric", label: "Isometric" },
              { key: "forearm", label: "Forearm Roll" },
              { key: "bend", label: "Oblique Bend" },
              { key: "flange", label: "Tool Flange" },
            ] as const
          ).map((view) => (
            <button
              key={view.key}
              type="button"
              onClick={() => setCameraPreset(view.key)}
              className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
                cameraPreset === view.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* 3D WebGL Canvas */}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border/30 bg-slate-950/80 lg:col-span-2">
          <div ref={containerRef} className="h-full w-full" />
          <div className="pointer-events-none absolute bottom-3 left-3 rounded bg-black/60 px-2 py-1 font-mono text-[10px] text-white backdrop-blur">
            Tip Pos: [{tel.toolTipPositionM[0].toFixed(2)}, {tel.toolTipPositionM[1].toFixed(2)},{" "}
            {tel.toolTipPositionM[2].toFixed(2)}] m • Bend: {tel.totalBendAngleDeg.toFixed(1)}°
          </div>
        </div>

        {/* Telemetry & Controls Panel */}
        <div className="flex flex-col gap-3">
          <PhysicsTelemetryBadge patentId={patentId} equations={equations} />

          <div className="flex flex-col gap-2 rounded-lg border border-border/30 bg-muted/20 p-3">
            <h4 className="text-xs font-semibold text-foreground">Kinematic Controls</h4>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">Forearm Roll (θ₁)</span>
                <span className="font-mono text-primary">
                  {controls.forearmRollDeg.toFixed(0)}°
                </span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={controls.forearmRollDeg}
                onChange={(e) => updateParam("forearmRollDeg", Number(e.target.value))}
                className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-border accent-primary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">Intermediate Roll (θ₂)</span>
                <span className="font-mono text-primary">
                  {controls.intermediateRollDeg.toFixed(0)}°
                </span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={controls.intermediateRollDeg}
                onChange={(e) => updateParam("intermediateRollDeg", Number(e.target.value))}
                className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-border accent-primary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">Tool Spin Roll (θ₃)</span>
                <span className="font-mono text-primary">{controls.toolRollDeg.toFixed(0)}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={controls.toolRollDeg}
                onChange={(e) => updateParam("toolRollDeg", Number(e.target.value))}
                className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-border accent-primary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">Tool Standoff (m)</span>
                <span className="font-mono text-primary">{controls.toolLengthM.toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.40"
                step="0.01"
                value={controls.toolLengthM}
                onChange={(e) => updateParam("toolLengthM", Number(e.target.value))}
                className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-border accent-primary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
