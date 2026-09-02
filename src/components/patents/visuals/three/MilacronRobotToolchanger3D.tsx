"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  createMilacronRobotToolchangerModel,
  type MilacronToolchanger3DObjects,
} from "@/components/patents/visuals/three/milacronRobotToolchangerModel";
import {
  createThreeStudioScene,
  type StudioContext,
} from "@/components/patents/visuals/three/ThreeStudioScene";
import {
  readMilacronToolchangerControls,
  stepMilacronRobotToolchangerSi,
} from "@/physics/milacronRobotToolchangerKernel";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

const PATENT_ID = "us-4512709-milacron-robot-toolchanger";

const VIEWS = {
  isometric: {
    position: [3.8, 2.6, 4.2] as [number, number, number],
    target: [0, 0, 0.4] as [number, number, number],
  },
  wedge: {
    position: [0.2, 1.8, 0.1] as [number, number, number],
    target: [0.1, 0, -0.2] as [number, number, number],
  },
  pins: {
    position: [0, 0, 4.8] as [number, number, number],
    target: [0, 0, 0.2] as [number, number, number],
  },
} as const;

export function MilacronRobotToolchanger3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const { params, updateParam } = usePatentPhysics(PATENT_ID);
  const liveParams = useRef(params);
  liveParams.current = params;

  const controls = useMemo(
    () => readMilacronToolchangerControls(params),
    [params],
  );
  const telemetry = useMemo(
    () => stepMilacronRobotToolchangerSi(controls),
    [controls],
  );

  const [cameraPreset, setCameraPreset] = useState<keyof typeof VIEWS>("isometric");

  // Shared FrankenSim physics hook
  useFrankenSimPhysics(PATENT_ID, {
    domain: "solid_mechanics",
    refusal: {
      isRefused:
        telemetry.insufficientPressureRefusal ||
        telemetry.wedgeBackdriveRefusal ||
        telemetry.toolUnseatedRefusal,
      reason: telemetry.refusalReason,
    },
  });

  const handlePresetChange = (preset: keyof typeof VIEWS) => {
    setCameraPreset(preset);
    studioRef.current?.controls.setView(
      VIEWS[preset].position,
      VIEWS[preset].target,
    );
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: VIEWS.isometric.position,
      targetPos: VIEWS.isometric.target,
      environmentStyle: "studio",
      cameraMinDistance: 1.5,
      cameraMaxDistance: 14.0,
      sunIntensity: 2.8,
      ambientIntensity: 1.2,
    });
    studioRef.current = studio;
    const { scene, camera, renderer, controls: orbitControls } = studio;

    const model: MilacronToolchanger3DObjects = createMilacronRobotToolchangerModel();
    scene.add(model.root);

    let frame = 0;
    const clock = createStudioClock();

    const animate = (now: number) => {
      frame = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const { simTimeSec } = clock.pump(now);
      const currentControls = readMilacronToolchangerControls(liveParams.current);
      const currentTel = stepMilacronRobotToolchangerSi(currentControls);
      model.update(currentControls, currentTel, simTimeSec);
      orbitControls.update();
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      scene.remove(model.root);
      model.dispose();
      studio.dispose();
      studioRef.current = null;
    };
  }, []);

  return (
    <div className="relative flex flex-col gap-4 rounded-2xl border border-amber-900/40 bg-stone-950 p-6 text-stone-200 shadow-2xl">
      {/* 3D WebGL Canvas Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-stone-800 bg-stone-950">
        <div ref={containerRef} className="h-full w-full" />

        {/* Camera Preset Controls */}
        <div className="absolute right-4 top-4 flex gap-2 rounded-lg bg-stone-900/80 p-1.5 backdrop-blur-md border border-stone-700">
          <button
            type="button"
            onClick={() => handlePresetChange("isometric")}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
              cameraPreset === "isometric" ? "bg-amber-600 text-white" : "text-stone-300 hover:text-white"
            }`}
          >
            Isometric
          </button>
          <button
            type="button"
            onClick={() => handlePresetChange("wedge")}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
              cameraPreset === "wedge" ? "bg-amber-600 text-white" : "text-stone-300 hover:text-white"
            }`}
          >
            Wedge Slide (Fig. 6)
          </button>
          <button
            type="button"
            onClick={() => handlePresetChange("pins")}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
              cameraPreset === "pins" ? "bg-amber-600 text-white" : "text-stone-300 hover:text-white"
            }`}
          >
            Locating Pins (Fig. 7)
          </button>
        </div>

        {/* Telemetry HUD Overlay */}
        <div className="absolute bottom-4 left-4 rounded-lg bg-stone-900/85 p-3 font-mono text-xs text-stone-300 backdrop-blur-md border border-stone-800">
          <div className="font-bold text-amber-400">US 4,512,709 CLAMP METRICS</div>
          <div className="mt-1">Piston Thrust: {telemetry.actuatorThrustN.toFixed(0)} N</div>
          <div>Clamping Force: {telemetry.clampingForceN.toFixed(0)} N</div>
          <div>Bistable Holding: {telemetry.holdingForceWithoutPowerN.toFixed(0)} N</div>
          <div>Repeatability: {(telemetry.positionalRepeatabilityMm * 1000).toFixed(1)} µm</div>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3">
          <label htmlFor="milacron-3d-air-pressure" className="block text-xs font-medium text-stone-300">
            Air Pressure ({controls.airPressureMpa.toFixed(2)} MPa)
          </label>
          <input
            id="milacron-3d-air-pressure"
            type="range"
            min="0.2"
            max="1.0"
            step="0.05"
            value={controls.airPressureMpa}
            onChange={(e) => updateParam("airPressureMpa", Number(e.target.value))}
            className="mt-1 w-full accent-amber-500"
          />
        </div>
        <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3">
          <label htmlFor="milacron-3d-slide-stroke" className="block text-xs font-medium text-stone-300">
            Slide Stroke ({controls.slideStrokeMm} mm)
          </label>
          <input
            id="milacron-3d-slide-stroke"
            type="range"
            min="0"
            max="25"
            step="1"
            value={controls.slideStrokeMm}
            onChange={(e) => updateParam("slideStrokeMm", Number(e.target.value))}
            className="mt-1 w-full accent-amber-500"
          />
        </div>
        <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3">
          <label htmlFor="milacron-3d-docking-gap" className="block text-xs font-medium text-stone-300">
            Docking Gap ({controls.dockingGapMm.toFixed(1)} mm)
          </label>
          <input
            id="milacron-3d-docking-gap"
            type="range"
            min="0"
            max="5"
            step="0.2"
            value={controls.dockingGapMm}
            onChange={(e) => updateParam("dockingGapMm", Number(e.target.value))}
            className="mt-1 w-full accent-amber-500"
          />
        </div>
      </div>
    </div>
  );
}
