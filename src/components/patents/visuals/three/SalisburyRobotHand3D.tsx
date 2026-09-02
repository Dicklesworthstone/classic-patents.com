"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PhysicsTelemetryBadge } from "@/components/patents/PhysicsTelemetryBadge";
import {
  buildSalisburyRobotHandModel,
  type SalisburyRobotHandModel,
  updateSalisburyRobotHandModel,
} from "@/components/patents/visuals/three/salisburyRobotHandModel";
import {
  createThreeStudioScene,
  type StudioContext,
} from "@/components/patents/visuals/three/ThreeStudioScene";
import { ALL_COLORIZED_EQUATIONS } from "@/data/colorizedEquations";
import { wasmSurfaceForPatent } from "@/physics/coverageManifest";
import { FrankenSimEngine } from "@/physics/engine";
import { readSalisburyRobotHandControls } from "@/physics/salisburyRobotHandKernel";
import {
  ensureSalisburyWasm,
  type SalisburyKernelSource,
  salisburyKernelSource,
  salisburyRuntimeLabel,
} from "@/physics/salisburyWasm";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

export default function SalisburyRobotHand3D({
  patentId = "us-4921293-salisbury-robot-hand",
}: {
  patentId?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const modelRef = useRef<SalisburyRobotHandModel | null>(null);

  const { params, updateParam } = usePatentPhysics(patentId);
  const controls = useMemo(() => readSalisburyRobotHandControls(params), [params]);
  const [, setKernelSource] = useState<SalisburyKernelSource>(salisburyKernelSource());
  const tel = FrankenSimEngine.stepSalisburyRobotHand(controls);
  const equations = useMemo(() => ALL_COLORIZED_EQUATIONS[patentId] ?? [], [patentId]);

  useFrankenSimPhysics(patentId);

  const liveTelRef = useRef(tel);
  useEffect(() => {
    liveTelRef.current = tel;
  }, [tel]);

  const [cameraPreset, setCameraPreset] = useState<"overview" | "wrist" | "pulleys" | "cables">(
    "overview",
  );
  const [hudVisible, setHudVisible] = useState(false);

  useEffect(() => {
    // Preserve the mechanism as the primary instrument on tablet/phone. The
    // explicit button still lets any visitor reopen the telemetry overlay.
    setHudVisible(window.matchMedia("(min-width: 880px)").matches);
  }, []);

  useEffect(() => {
    // Coverage metadata is the admission gate. An unbuilt/unpinned module must
    // remain a quiet typed fallback instead of causing a speculative 404 fetch.
    if (!wasmSurfaceForPatent(patentId)) return;

    let active = true;
    void ensureSalisburyWasm().then((nextSource) => {
      if (active) setKernelSource(nextSource);
    });
    return () => {
      active = false;
    };
  }, [patentId]);

  useEffect(() => {
    if (!containerRef.current) return;

    const studio = createThreeStudioScene({
      container: containerRef.current,
      cameraPos: [3.9, 2.4, 5.2],
      targetPos: [0, -0.35, 0],
      environmentStyle: "studio",
      enableFloorGrid: true,
      floorColor: 0x1e293b,
      gridColor: 0x475569,
    });
    studioRef.current = studio;

    const model = buildSalisburyRobotHandModel();
    updateSalisburyRobotHandModel(model, liveTelRef.current);
    modelRef.current = model;
    studio.scene.add(model.rootGroup);

    let animId: number;
    const renderLoop = () => {
      if (modelRef.current && studioRef.current) {
        updateSalisburyRobotHandModel(modelRef.current, liveTelRef.current);
        studioRef.current.controls.update();
        studioRef.current.renderer.render(studioRef.current.scene, studioRef.current.camera);
      }
      animId = requestAnimationFrame(renderLoop);
    };
    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
      if (modelRef.current) {
        studio.scene.remove(modelRef.current.rootGroup);
        modelRef.current.dispose();
        modelRef.current = null;
      }
      studio.dispose();
      studioRef.current = null;
    };
  }, []);

  const handleCameraPreset = (preset: "overview" | "wrist" | "pulleys" | "cables") => {
    setCameraPreset(preset);
    if (!studioRef.current) return;

    switch (preset) {
      case "overview":
        studioRef.current.controls.setView([3.9, 2.4, 5.2], [0, -0.35, 0]);
        break;
      case "wrist":
        studioRef.current.controls.setView([2.7, 0.2, 3.2], [0, -0.35, 0]);
        break;
      case "pulleys":
        studioRef.current.controls.setView([2.0, 2.0, 2.4], [0, 0.75, 0]);
        break;
      case "cables":
        studioRef.current.controls.setView([3.4, -0.5, 3.3], [0, -1.0, 0]);
        break;
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-700/60 bg-slate-950/90 p-4 text-slate-100 shadow-2xl backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-semibold tracking-wide text-slate-100">
            Salisbury Hand Connected Transmission Studio
          </h3>
          <p className="text-xs text-slate-400">
            US 4,921,293 • remote drive → wrist → palm → three anchored digits • representative
            T₁–T₄ study, 12 routed ends
          </p>
        </div>

        <div className="flex rounded-lg bg-slate-800/80 p-1 text-xs">
          <button
            type="button"
            onClick={() => handleCameraPreset("overview")}
            className={`rounded px-2.5 py-1 transition ${
              cameraPreset === "overview"
                ? "bg-emerald-600 font-medium text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => handleCameraPreset("wrist")}
            className={`rounded px-2.5 py-1 transition ${
              cameraPreset === "wrist"
                ? "bg-emerald-600 font-medium text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Wrist
          </button>
          <button
            type="button"
            onClick={() => handleCameraPreset("pulleys")}
            className={`rounded px-2.5 py-1 transition ${
              cameraPreset === "pulleys"
                ? "bg-emerald-600 font-medium text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Pulleys
          </button>
          <button
            type="button"
            onClick={() => handleCameraPreset("cables")}
            className={`rounded px-2.5 py-1 transition ${
              cameraPreset === "cables"
                ? "bg-emerald-600 font-medium text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Cable route
          </button>
        </div>
      </div>

      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-900 shadow-inner">
        <div ref={containerRef} className="h-full w-full" />

        <button
          type="button"
          onClick={() => setHudVisible((visible) => !visible)}
          className="absolute right-3 top-3 rounded-md border border-slate-600/70 bg-slate-950/85 px-2.5 py-1.5 text-[11px] font-medium text-slate-200 shadow backdrop-blur hover:border-slate-400"
          aria-label={hudVisible ? "Hide telemetry HUD" : "Show telemetry HUD"}
          aria-pressed={hudVisible}
        >
          {hudVisible ? "Hide HUD" : "Show HUD"}
        </button>

        {hudVisible && (
          <div className="pointer-events-none absolute bottom-3 left-3 flex max-w-[min(24rem,calc(100%-6rem))] flex-col gap-1 rounded-md border border-slate-700/60 bg-slate-950/80 p-2.5 font-mono text-[10px] backdrop-blur sm:text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Runtime:</span>
              <span
                className={tel.runtimeSource === "wasm" ? "text-emerald-400" : "text-amber-400"}
              >
                {salisburyRuntimeLabel(tel.runtimeSource)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Topology:</span>
              <span className="font-semibold text-slate-200">
                {tel.digitCount} palm-rooted digits · {tel.scalarJointCoordinates} joints ·{" "}
                {tel.cableEndCount} cable ends
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Peak tension:</span>
              <span className="font-semibold text-sky-400">
                {Math.max(...tel.tendonTensionsN).toFixed(1)} N
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">τ₁ / τ₂ / τ₃:</span>
              <span className="text-emerald-400">
                {tel.jointTorquesNm.map((torque) => torque.toFixed(3)).join(" / ")} N·m
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Claim 2 first idler:</span>
              <span className={tel.claim2IdlerProbe ? "text-emerald-400" : "text-amber-400"}>
                {tel.claim2IdlerProbe ? "held" : "not held"}
              </span>
            </div>
          </div>
        )}

        {tel.refusalReason && (
          <div className="absolute left-3 right-20 top-3 rounded border border-rose-500/50 bg-rose-950/90 p-2 text-xs font-mono text-rose-200">
            ⚠️ {tel.refusalReason}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 px-3 py-2 text-xs leading-relaxed text-amber-100/90">
        The moving pose is a normalized diagram of one digit’s signed torque output, mirrored across
        the three connected digits for comparison. The physical hand has twelve separately routed
        cable ends. The grant supplies the cable topology and three static equations, but not
        dimensions, inertia, damping, contact properties, grasp force, force closure, speed, or
        stability.
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-300">Cable tension T₁</span>
            <span className="font-mono text-sky-400">{controls.tensionT1N.toFixed(1)} N</span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            step="1"
            value={controls.tensionT1N}
            onChange={(e) => updateParam("tensionT1N", Number.parseFloat(e.target.value))}
            className="accent-sky-500"
          />
          <span className="text-[10px] text-slate-500">Moments at Axes 1 and 2 through R₁/R₃</span>
        </div>

        <div className="flex flex-col gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-300">Cable tension T₂</span>
            <span className="font-mono text-emerald-400">{controls.tensionT2N.toFixed(1)} N</span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            step="1"
            value={controls.tensionT2N}
            onChange={(e) => updateParam("tensionT2N", Number.parseFloat(e.target.value))}
            className="accent-emerald-500"
          />
          <span className="text-[10px] text-slate-500">
            Contributes to all three printed equations
          </span>
        </div>

        <div className="flex flex-col gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-300">Cable tension T₃</span>
            <span className="font-mono text-amber-400">{controls.tensionT3N.toFixed(1)} N</span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            step="1"
            value={controls.tensionT3N}
            onChange={(e) => updateParam("tensionT3N", Number.parseFloat(e.target.value))}
            className="accent-amber-500"
          />
          <span className="text-[10px] text-slate-500">Opposes T₂ at Axis 3</span>
        </div>

        <div className="flex flex-col gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-300">Cable tension T₄</span>
            <span className="font-mono text-rose-400">{controls.tensionT4N.toFixed(1)} N</span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            step="1"
            value={controls.tensionT4N}
            onChange={(e) => updateParam("tensionT4N", Number.parseFloat(e.target.value))}
            className="accent-rose-500"
          />
          <span className="text-[10px] text-slate-500">Opposes T₁ at Axes 1 and 2</span>
        </div>

        <div className="flex flex-col gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-300">Illustrative R₂ scale</span>
            <span className="font-mono text-cyan-400">{controls.radiusScaleMm} mm</span>
          </div>
          <input
            type="range"
            min="4"
            max="20"
            step="1"
            value={controls.radiusScaleMm}
            onChange={(e) => updateParam("radiusScaleMm", Number.parseFloat(e.target.value))}
            className="accent-cyan-500"
          />
          <span className="text-[10px] text-slate-500">
            Visitor input, not a historic dimension
          </span>
        </div>

        <div className="flex flex-col gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-300">Claim 2 first idler</span>
            <span className="font-mono text-orange-400">
              {controls.firstIdlerFixed ? "fixed" : "free"}
            </span>
          </div>
          <input
            type="checkbox"
            checked={controls.firstIdlerFixed}
            onChange={(e) => updateParam("firstIdlerFixed", e.target.checked ? 1 : 0)}
            className="h-5 w-5 accent-orange-500"
          />
          <span className="text-[10px] text-slate-500">
            Claim predicate; torque law stays separate
          </span>
        </div>
      </div>

      <PhysicsTelemetryBadge patentId={patentId} equations={equations} />
    </div>
  );
}
