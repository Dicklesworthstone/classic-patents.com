"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  createHullStereolithographyModel,
  type HullStereolithography3DObjects,
} from "@/components/patents/visuals/three/hullStereolithographyModel";
import {
  createThreeStudioScene,
  type StudioContext,
} from "@/components/patents/visuals/three/ThreeStudioScene";
import {
  readHullStereolithographyControls,
  stepHullStereolithographySi,
} from "@/physics/hullStereolithographyKernel";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

const PATENT_ID = "us-4575330-hull-stereolithography";

const VIEWS = {
  isometric: {
    position: [3.5, 3.2, 4.2] as [number, number, number],
    target: [0, 0.9, 0] as [number, number, number],
  },
  top: {
    position: [0, 5.0, 0.1] as [number, number, number],
    target: [0, 1.2, 0] as [number, number, number],
  },
  side: {
    position: [0, 1.1, 4.5] as [number, number, number],
    target: [0, 0.9, 0] as [number, number, number],
  },
} as const;

export function HullStereolithography3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const { params, updateParam } = usePatentPhysics(PATENT_ID);
  const liveParams = useRef(params);
  liveParams.current = params;

  const controls = useMemo(() => readHullStereolithographyControls(params), [params]);
  const telemetry = useMemo(() => stepHullStereolithographySi(controls), [controls]);

  const [cameraPreset, setCameraPreset] = useState<keyof typeof VIEWS>("isometric");

  // Shared FrankenSim physics hook
  useFrankenSimPhysics(PATENT_ID, {
    domain: "solid_mechanics",
    refusal: {
      isRefused:
        telemetry.underexposureRefusal ||
        telemetry.overpenetrationRefusal ||
        telemetry.recoatDelayRefusal,
      reason: telemetry.refusalReason,
    },
  });

  const handlePresetChange = (preset: keyof typeof VIEWS) => {
    setCameraPreset(preset);
    studioRef.current?.controls.setView(VIEWS[preset].position, VIEWS[preset].target);
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

    const model: HullStereolithography3DObjects = createHullStereolithographyModel();
    scene.add(model.root);

    let frame = 0;
    const clock = createStudioClock();

    const animate = (now: number) => {
      frame = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const { simTimeSec } = clock.pump(now);
      const currentControls = readHullStereolithographyControls(liveParams.current);
      const currentTel = stepHullStereolithographySi(currentControls);
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
              cameraPreset === "isometric"
                ? "bg-amber-600 text-white"
                : "text-stone-300 hover:text-white"
            }`}
          >
            Isometric
          </button>
          <button
            type="button"
            onClick={() => handlePresetChange("top")}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
              cameraPreset === "top" ? "bg-amber-600 text-white" : "text-stone-300 hover:text-white"
            }`}
          >
            Galvo Head (Top)
          </button>
          <button
            type="button"
            onClick={() => handlePresetChange("side")}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
              cameraPreset === "side"
                ? "bg-amber-600 text-white"
                : "text-stone-300 hover:text-white"
            }`}
          >
            Vat Section (Side)
          </button>
        </div>

        {/* Telemetry HUD Overlay */}
        <div className="absolute bottom-4 left-4 rounded-lg bg-stone-900/85 p-3 font-mono text-xs text-stone-300 backdrop-blur-md border border-stone-800">
          <div className="font-bold text-amber-400">US 4,575,330 SLA DOSIMETRY</div>
          <div className="mt-1">Peak Exposure: {telemetry.peakExposureMJCm2.toFixed(1)} mJ/cm²</div>
          <div>
            Cure Depth: {telemetry.cureDepthUm.toFixed(1)} µm (Layer: {controls.layerThicknessUm}{" "}
            µm)
          </div>
          <div>Adhesion Ratio: {telemetry.interlayerAdhesionRatio.toFixed(2)}x</div>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3">
          <label htmlFor="sla-3d-laser-power" className="block text-xs font-medium text-stone-300">
            UV Laser Power ({controls.laserPowerMw} mW)
          </label>
          <input
            id="sla-3d-laser-power"
            type="range"
            min="10"
            max="150"
            value={controls.laserPowerMw}
            onChange={(e) => updateParam("laserPowerMw", Number(e.target.value))}
            className="mt-1 w-full accent-amber-500"
          />
        </div>
        <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3">
          <label htmlFor="sla-3d-scan-speed" className="block text-xs font-medium text-stone-300">
            Scan Speed ({controls.laserScanSpeedMmS} mm/s)
          </label>
          <input
            id="sla-3d-scan-speed"
            type="range"
            min="50"
            max="1000"
            step="10"
            value={controls.laserScanSpeedMmS}
            onChange={(e) => updateParam("laserScanSpeedMmS", Number(e.target.value))}
            className="mt-1 w-full accent-amber-500"
          />
        </div>
        <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3">
          <label
            htmlFor="sla-3d-layer-thickness"
            className="block text-xs font-medium text-stone-300"
          >
            Layer Thickness ({controls.layerThicknessUm} µm)
          </label>
          <input
            id="sla-3d-layer-thickness"
            type="range"
            min="25"
            max="250"
            step="5"
            value={controls.layerThicknessUm}
            onChange={(e) => updateParam("layerThicknessUm", Number(e.target.value))}
            className="mt-1 w-full accent-amber-500"
          />
        </div>
      </div>
    </div>
  );
}
