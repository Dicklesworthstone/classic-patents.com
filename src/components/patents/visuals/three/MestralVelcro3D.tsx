"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { PhysicsTelemetryBadge } from "@/components/patents/PhysicsTelemetryBadge";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import {
  createMestralVelcroModel,
  type MestralVelcro3DObjects,
} from "@/components/patents/visuals/three/mestralVelcroModel";
import {
  createThreeStudioScene,
  type StudioContext,
} from "@/components/patents/visuals/three/ThreeStudioScene";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { ALL_COLORIZED_EQUATIONS } from "@/data/colorizedEquations";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import {
  MESTRAL_VELCRO_SOURCE_BOUNDARY,
  readMestralVelcroControls,
  stepMestralVelcroSi,
} from "@/physics/mestralVelcroKernel";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { mestralOverviewCameraForViewport } from "./mestralVelcroCamera";

const MESTRAL_RUNTIME_BOUNDARY = {
  domain: "solid_mechanics",
  refusal: { isRefused: true, reason: MESTRAL_VELCRO_SOURCE_BOUNDARY },
} as const;

export default function MestralVelcro3D({
  patentId = "us-2717437-mestral-velcro",
}: {
  patentId?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const modelRef = useRef<MestralVelcro3DObjects | null>(null);

  const { effectiveParams, claimStates, updateParam } = usePatentPhysics(patentId);
  const controls = useMemo(() => readMestralVelcroControls(effectiveParams), [effectiveParams]);
  const tel = useMemo(() => stepMestralVelcroSi(controls), [controls]);

  useFrankenSimPhysics(patentId, MESTRAL_RUNTIME_BOUNDARY);

  const [cameraPreset, setCameraPreset] = useState<
    "perspective" | "peel-front" | "hooks-detail" | "top"
  >("perspective");

  // Live refs for animation frame render loop
  const liveControlsRef = useRef(controls);
  const liveTelRef = useRef(tel);

  useLayoutEffect(() => {
    liveControlsRef.current = controls;
    liveTelRef.current = tel;
  }, [controls, tel]);

  useEffect(() => {
    if (!containerRef.current) return;

    const overviewCamera = mestralOverviewCameraForViewport(containerRef.current.clientWidth);

    const studio = createThreeStudioScene({
      container: containerRef.current,
      cameraPos: overviewCamera.cameraPos,
      targetPos: overviewCamera.targetPos,
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
        if (!studioRef.current.isVisible()) {
          animId = requestAnimationFrame(renderLoop);
          return;
        }
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
        modelRef.current = null;
      }
      studio.dispose();
      studioRef.current = null;
    };
  }, []);

  const handleCameraPreset = (preset: "perspective" | "peel-front" | "hooks-detail" | "top") => {
    setCameraPreset(preset);
    if (!studioRef.current) return;
    switch (preset) {
      case "perspective":
        {
          const overviewCamera = mestralOverviewCameraForViewport(
            containerRef.current?.clientWidth ?? 1024,
          );
          studioRef.current.controls.setView(overviewCamera.cameraPos, overviewCamera.targetPos);
        }
        break;
      case "peel-front":
        studioRef.current.controls.setView([0, -2.2, 7.8], [0, -3.1, 0]);
        break;
      case "hooks-detail":
        studioRef.current.controls.setView([-2, -2.5, 3.5], [-2, -3.55, 0]);
        break;
      case "top":
        studioRef.current.controls.setView([0, 7, 0.1], [0, -3.5, 0]);
        break;
    }
  };

  const equations = ALL_COLORIZED_EQUATIONS[patentId] ?? [];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 shadow-2xl flex flex-col">
      <div className="border-b border-stone-800 bg-stone-950 px-4 py-3">
        <h3 className="font-serif text-base font-bold text-stone-100">
          De Mestral Hook-Pile Fabric · Source Figure 2
        </h3>
        <p className="mt-1 max-w-4xl text-xs leading-relaxed text-stone-400">
          Two pieces of the same hooked pile face each other; the upper piece is turned 90°. The
          lower fabric rests on the floor-supported exhibit plate, while the upper free edge remains
          attached to the silver peel clamp and its red external-traction boundary.
        </p>
      </div>
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
      <div className="p-5 bg-stone-950 border-t border-stone-800 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 text-xs">
        <SensitivitySlider
          id="velcro3dFilamentDiameter"
          patentId={patentId}
          paramKey="filamentDiameterMm"
          label="Illustrative Filament Diameter"
          value={controls.filamentDiameterMm}
          min={0.1}
          max={0.35}
          step={0.01}
          unit=" mm"
          onChange={(val: number) => updateParam("filamentDiameterMm", val)}
          allParams={effectiveParams}
        />

        <SensitivitySlider
          id="velcro3dHookLength"
          patentId={patentId}
          paramKey="hookLengthMm"
          label="Illustrative Hook Height"
          value={controls.hookLengthMm}
          min={1.0}
          max={3.0}
          step={0.1}
          unit=" mm"
          onChange={(val: number) => updateParam("hookLengthMm", val)}
          allParams={effectiveParams}
        />

        <SensitivitySlider
          id="velcro3dHookDensity"
          patentId={patentId}
          paramKey="hookDensityPerCm2"
          label="Illustrative Pile Population"
          value={controls.hookDensityPerCm2}
          min={20}
          max={120}
          step={4}
          unit=" cm⁻²"
          onChange={(val: number) => updateParam("hookDensityPerCm2", val)}
          allParams={effectiveParams}
        />

        <SensitivitySlider
          id="velcro3dPeelAngle"
          patentId={patentId}
          paramKey="peelAngleDeg"
          label="Applied Clamp Direction"
          value={controls.peelAngleDeg}
          min={20}
          max={160}
          step={5}
          unit="°"
          onChange={(val: number) => updateParam("peelAngleDeg", val)}
          allParams={effectiveParams}
        />

        <SensitivitySlider
          id="velcro3dPeelProgress"
          patentId={patentId}
          paramKey="peelProgress"
          label="Peeling Advance"
          value={controls.peelProgress}
          min={0.05}
          max={0.95}
          step={0.01}
          unit=""
          onChange={(val: number) => updateParam("peelProgress", val)}
          allParams={effectiveParams}
        />
      </div>

      <div className="border-t border-amber-900/60 bg-amber-950/25 px-4 py-3 text-xs leading-relaxed text-amber-100">
        <strong>Source boundary:</strong> Figure 2 establishes topology, not performance data. The
        exhibit refuses peel force, shear capacity, thermal-retention percentage, power, and
        energy-loss telemetry; no FrankenSim solid/contact WASM step is claimed.
      </div>

      {/* Claim Constraints */}
      <div className="p-4 bg-stone-950 border-t border-stone-800 flex flex-col space-y-3">
        <ClaimConstraintToggle
          patentId={patentId}
          claimStates={claimStates}
          onToggleClaim={(claimNumber, active) =>
            updateParam(claimConstraintStateParamId(claimNumber), active ? 1 : 0)
          }
        />
      </div>
    </div>
  );
}
