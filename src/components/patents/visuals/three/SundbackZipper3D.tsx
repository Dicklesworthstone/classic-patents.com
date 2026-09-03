"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PhysicsTelemetryBadge } from "@/components/patents/PhysicsTelemetryBadge";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "@/components/patents/visuals/PortHamiltonianEnergyStrip";
import {
  buildSundbackZipperModel,
  type SundbackZipperModel,
  updateSundbackZipperKinematics,
} from "@/components/patents/visuals/three/sundbackZipperModel";
import {
  createThreeStudioScene,
  type StudioContext,
} from "@/components/patents/visuals/three/ThreeStudioScene";
import { ALL_COLORIZED_EQUATIONS } from "@/data/colorizedEquations";
import { readSundbackZipperControls, stepSundbackZipperSi } from "@/physics/sundbackZipperKernel";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

export default function SundbackZipper3D({
  patentId = "us-1219881-sundback-zipper",
}: {
  patentId?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const modelRef = useRef<SundbackZipperModel | null>(null);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true, 2: true });

  const { params, updateParam } = usePatentPhysics(patentId);
  const controls = useMemo(() => readSundbackZipperControls(params), [params]);
  const tel = useMemo(() => stepSundbackZipperSi(controls), [controls]);

  useFrankenSimPhysics(patentId);

  // Live ref for rAF loop to avoid canvas remounting
  const liveControlsRef = useRef(controls);
  const liveTelRef = useRef(tel);
  useEffect(() => {
    liveControlsRef.current = controls;
    liveTelRef.current = tel;
  }, [controls, tel]);

  const [cameraPreset, setCameraPreset] = useState<"front" | "perspective" | "detail" | "top">(
    "perspective",
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const studio = createThreeStudioScene({
      container: containerRef.current,
      // The unseparated chain is 12 units long. This is an overview, not the
      // tooth-detail camera, so retain both end stops and give the slider room
      // to travel without leaving the frame.
      cameraPos: [0, 0, 20],
      targetPos: [0, 0, 0],
      environmentStyle: "studio",
      enableFloorGrid: true,
      floorColor: 0x1e293b,
      gridColor: 0x475569,
    });
    studioRef.current = studio;

    const model = buildSundbackZipperModel();
    modelRef.current = model;
    studio.scene.add(model.rootGroup);

    let animId: number;
    const renderLoop = () => {
      if (modelRef.current && studioRef.current) {
        updateSundbackZipperKinematics(
          modelRef.current,
          liveTelRef.current,
          liveControlsRef.current.flexAngleDeg,
        );
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
      }
      studio.dispose();
    };
  }, []);

  const handleCameraPreset = (preset: "front" | "perspective" | "detail" | "top") => {
    setCameraPreset(preset);
    if (!studioRef.current) return;
    switch (preset) {
      case "front":
        studioRef.current.controls.setView([0, 0, 15], [0, 0, 0]);
        break;
      case "perspective":
        studioRef.current.controls.setView([4, 3, 13], [0, 0, 0]);
        break;
      case "detail":
        studioRef.current.controls.setView(
          [0, modelRef.current?.sliderGroup.position.y ?? 0, 4.5],
          [0, modelRef.current?.sliderGroup.position.y ?? 0, 0],
        );
        break;
      case "top":
        studioRef.current.controls.setView([0, 16, 0.1], [0, 0, 0]);
        break;
    }
  };

  return (
    <div className="w-full bg-parchment-50 dark:bg-ink-950 rounded-2xl border border-parchment-300 dark:border-ink-800 p-6 flex flex-col items-center space-y-6 shadow-patent">
      {/* 3D Header */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
              3D WEBGL STUDIO
            </span>
            <span className="text-xs font-mono font-medium text-ink-500 dark:text-ink-400">
              US 1,219,881 • GIDEON SUNDBACK
            </span>
          </div>
          <h3 className="text-lg font-serif font-bold text-ink-900 dark:text-parchment-100 mt-1">
            Separable Fastener 3D Interlocking Scoop Kinematics
          </h3>
        </div>
        <PhysicsTelemetryBadge
          patentId={patentId}
          equations={ALL_COLORIZED_EQUATIONS[patentId] ?? []}
        />
      </div>

      {/* 3D WebGL Canvas Container */}
      <div className="relative w-full aspect-[16/9] min-h-[420px] bg-ink-950 rounded-xl border border-parchment-300 dark:border-ink-800 overflow-hidden select-none">
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Camera Presets Overlay */}
        <div className="absolute top-3 left-3 flex gap-1.5 z-10 bg-ink-900/80 backdrop-blur-sm p-1 rounded-lg border border-ink-700">
          {(["perspective", "front", "detail", "top"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handleCameraPreset(p)}
              className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded transition-colors ${
                cameraPreset === p
                  ? "bg-amber-600 text-white"
                  : "text-ink-300 hover:text-white hover:bg-ink-800"
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>

        {/* HUD Overlay Chip */}
        <div className="absolute bottom-3 left-3 z-10 bg-ink-900/85 backdrop-blur-sm p-3 rounded-lg border border-ink-700 text-ink-200 font-mono text-xs space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">WEDGE CAM:</span>
            <span>{tel.camWedgeAngleDeg}° CONVERGENCE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">BURST LIMIT:</span>
            <span>{tel.burstResistanceN.toFixed(1)} N</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-bold">STATUS:</span>
            <span
              className={
                tel.burstRefusal
                  ? "text-rose-400 font-bold"
                  : tel.isLocked
                    ? "text-emerald-400 font-bold"
                    : "text-amber-300"
              }
            >
              {tel.burstRefusal
                ? "RUPTURE"
                : tel.isStalled
                  ? "JAMMED"
                  : tel.isLocked
                    ? "LOCKED"
                    : "OPEN"}
            </span>
          </div>
        </div>
      </div>

      {/* Control Sliders */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        <div className="p-3 bg-parchment-100 dark:bg-ink-900 rounded-lg border border-parchment-200 dark:border-ink-800 space-y-2">
          <div className="flex justify-between items-center text-ink-700 dark:text-parchment-200">
            <label htmlFor="slider-pos-3d">Slider Position</label>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              {controls.sliderPositionPct}%
            </span>
          </div>
          <input
            id="slider-pos-3d"
            type="range"
            min="0"
            max="100"
            step="1"
            value={controls.sliderPositionPct}
            onChange={(e) => updateParam("sliderPositionPct", Number(e.target.value))}
            className="w-full accent-amber-600"
          />
        </div>

        <div className="p-3 bg-parchment-100 dark:bg-ink-900 rounded-lg border border-parchment-200 dark:border-ink-800 space-y-2">
          <div className="flex justify-between items-center text-ink-700 dark:text-parchment-200">
            <label htmlFor="flex-angle-3d">Transverse Flexion</label>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              {controls.flexAngleDeg}°
            </span>
          </div>
          <input
            id="flex-angle-3d"
            type="range"
            min="0"
            max="180"
            step="5"
            value={controls.flexAngleDeg}
            onChange={(e) => updateParam("flexAngleDeg", Number(e.target.value))}
            className="w-full accent-amber-600"
          />
        </div>

        <div className="p-3 bg-parchment-100 dark:bg-ink-900 rounded-lg border border-parchment-200 dark:border-ink-800 space-y-2">
          <div className="flex justify-between items-center text-ink-700 dark:text-parchment-200">
            <label htmlFor="lat-tension-3d">Lateral Tension</label>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              {controls.lateralTensionN} N
            </span>
          </div>
          <input
            id="lat-tension-3d"
            type="range"
            min="0"
            max="200"
            step="5"
            value={controls.lateralTensionN}
            onChange={(e) => updateParam("lateralTensionN", Number(e.target.value))}
            className="w-full accent-amber-600"
          />
        </div>
      </div>

      <div className="p-4 bg-parchment-100 dark:bg-ink-900 rounded-lg border border-parchment-200 dark:border-ink-800">
        <PortHamiltonianEnergyStrip
          patentId={patentId}
          params={controls as unknown as Record<string, number>}
        />
      </div>

      <div className="p-4 bg-parchment-100 dark:bg-ink-900 rounded-lg border border-parchment-200 dark:border-ink-800">
        <ClaimConstraintToggle
          patentId={patentId}
          claimStates={claimStates}
          onClaimStateChange={(num, active) =>
            setClaimStates((prev) => ({ ...prev, [num]: active }))
          }
        />
      </div>
    </div>
  );
}
