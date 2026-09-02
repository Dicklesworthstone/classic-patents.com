"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PhysicsTelemetryBadge } from "@/components/patents/PhysicsTelemetryBadge";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "@/components/patents/visuals/PortHamiltonianEnergyStrip";
import {
  createMestralVelcroModel,
  type MestralVelcro3DObjects,
} from "@/components/patents/visuals/three/mestralVelcroModel";
import {
  createThreeStudioScene,
  type StudioContext,
} from "@/components/patents/visuals/three/ThreeStudioScene";
import { ALL_COLORIZED_EQUATIONS } from "@/data/colorizedEquations";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import { readMestralVelcroControls, stepMestralVelcroSi } from "@/physics/mestralVelcroKernel";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

export default function MestralVelcro3D({
  patentId = "us-2717437-mestral-velcro",
}: {
  patentId?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const modelRef = useRef<MestralVelcro3DObjects | null>(null);

  const { effectiveParams, claimStates, updateParam } = usePatentPhysics(patentId);
  const controls = useMemo(
    () => readMestralVelcroControls(effectiveParams),
    [effectiveParams],
  );
  const tel = useMemo(() => stepMestralVelcroSi(controls), [controls]);

  useFrankenSimPhysics(patentId);

  const [cameraPreset, setCameraPreset] = useState<
    "perspective" | "peel-front" | "hooks-detail" | "top"
  >("perspective");

  // Live refs for animation frame render loop
  const liveControlsRef = useRef(controls);
  const liveTelRef = useRef(tel);

  useEffect(() => {
    liveControlsRef.current = controls;
    liveTelRef.current = tel;
  }, [controls, tel]);

  useEffect(() => {
    if (!containerRef.current) return;

    const studio = createThreeStudioScene({
      container: containerRef.current,
      cameraPos: [4.5, 3.5, 9.5],
      targetPos: [0, 0.5, 0],
      environmentStyle: "studio",
      enableFloorGrid: true,
      floorColor: 0x1c1917,
      gridColor: 0x44403c,
    });
    studioRef.current = studio;

    const model = createMestralVelcroModel();
    modelRef.current = model;
    studio.scene.add(model.rootGroup);

    const clock = createStudioClock();
    let animId: number;

    const renderLoop = (now: number) => {
      clock.pump(now);
      if (modelRef.current && studioRef.current) {
        modelRef.current.update(liveControlsRef.current, liveTelRef.current);
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

  const handleCameraPreset = (preset: "perspective" | "peel-front" | "hooks-detail" | "top") => {
    setCameraPreset(preset);
    if (!studioRef.current) return;
    switch (preset) {
      case "perspective":
        studioRef.current.controls.setView([4.5, 3.5, 9.5], [0, 0.5, 0]);
        break;
      case "peel-front":
        studioRef.current.controls.setView([0, 1.2, 7.5], [0, 0.5, 0]);
        break;
      case "hooks-detail":
        studioRef.current.controls.setView([-2.0, 1.0, 3.2], [-2.0, 0.5, 0]);
        break;
      case "top":
        studioRef.current.controls.setView([0, 11.0, 0.1], [0, 0, 0]);
        break;
    }
  };

  const equations = ALL_COLORIZED_EQUATIONS[patentId] ?? [];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 shadow-2xl flex flex-col">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-[480px] relative">
        {/* Camera Preset Toolbar */}
        <div className="absolute top-4 left-4 z-10 flex items-center space-x-1.5 p-1 bg-stone-900/90 backdrop-blur-md rounded-lg border border-stone-800 shadow-md">
          <button
            type="button"
            onClick={() => handleCameraPreset("perspective")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              cameraPreset === "perspective"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            Perspective
          </button>
          <button
            type="button"
            onClick={() => handleCameraPreset("peel-front")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              cameraPreset === "peel-front"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            Peel Front
          </button>
          <button
            type="button"
            onClick={() => handleCameraPreset("hooks-detail")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              cameraPreset === "hooks-detail"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            Hook Detail
          </button>
          <button
            type="button"
            onClick={() => handleCameraPreset("top")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              cameraPreset === "top"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            Top 90°
          </button>
        </div>

        {/* Live Telemetry Badge Component */}
        <PhysicsTelemetryBadge patentId={patentId} equations={equations} />
      </div>

      {/* Control Slider Dashboard */}
      <div className="p-5 bg-stone-950 border-t border-stone-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Filament Diameter */}
        <div className="flex flex-col space-y-1.5">
          <div className="flex justify-between text-stone-300 font-medium">
            <span>Monofilament Diameter (d)</span>
            <span className="font-mono text-amber-400">
              {controls.filamentDiameterMm.toFixed(2)} mm
            </span>
          </div>
          <input
            type="range"
            min="0.10"
            max="0.35"
            step="0.01"
            value={controls.filamentDiameterMm}
            onChange={(e) => updateParam("filamentDiameterMm", parseFloat(e.target.value))}
            className="accent-amber-500 bg-stone-800 h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        {/* Peeling Angle */}
        <div className="flex flex-col space-y-1.5">
          <div className="flex justify-between text-stone-300 font-medium">
            <span>Peeling Angle (θ)</span>
            <span className="font-mono text-blue-400">{controls.peelAngleDeg}°</span>
          </div>
          <input
            type="range"
            min="20"
            max="160"
            step="5"
            value={controls.peelAngleDeg}
            onChange={(e) => updateParam("peelAngleDeg", parseInt(e.target.value, 10))}
            className="accent-blue-500 bg-stone-800 h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        {/* Lancet Bar Temp */}
        <div className="flex flex-col space-y-1.5">
          <div className="flex justify-between text-stone-300 font-medium">
            <span>Lancet Heat Temp</span>
            <span className="font-mono text-red-400">{controls.heatSettingTempC}°C</span>
          </div>
          <input
            type="range"
            min="100"
            max="200"
            step="5"
            value={controls.heatSettingTempC}
            onChange={(e) => updateParam("heatSettingTempC", parseInt(e.target.value, 10))}
            className="accent-red-500 bg-stone-800 h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        {/* Interactive Peel Separation */}
        <div className="flex flex-col space-y-1.5">
          <div className="flex justify-between text-stone-300 font-medium">
            <span>Peeling Advance</span>
            <span className="font-mono text-cyan-400">{(tel.peelProgress * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.05"
            max="0.95"
            step="0.01"
            value={controls.peelProgress}
            onChange={(e) => updateParam("peelProgress", parseFloat(e.target.value))}
            className="accent-cyan-500 bg-stone-800 h-1.5 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Claim Constraints & Energy Ledger */}
      <div className="p-4 bg-stone-950 border-t border-stone-800 flex flex-col space-y-3">
        <ClaimConstraintToggle
          patentId={patentId}
          claimStates={claimStates}
          onToggleClaim={(claimNumber, active) =>
            updateParam(claimConstraintStateParamId(claimNumber), active ? 1 : 0)
          }
        />
        <PortHamiltonianEnergyStrip
          patentId={patentId}
          params={controls as unknown as Record<string, number>}
        />
      </div>
    </div>
  );
}
