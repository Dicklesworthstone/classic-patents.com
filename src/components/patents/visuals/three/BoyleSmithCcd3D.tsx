"use client";

import { Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepBoyleSmithCcd } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { createBoyleSmithCcdModel } from "./boyleSmithCcdModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

type CameraPreset = "iso" | "gate_array" | "package" | "potential_well" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [12, 10, 16], target: [0, 0, 0] },
  gate_array: { pos: [0, 3.5, 5.0], target: [0, 0, 0] },
  package: { pos: [0, 7.0, 7.5], target: [0, 0, 0] },
  potential_well: { pos: [4.5, 2.2, 4.0], target: [0, -0.5, 0] },
  top: { pos: [0, 15.0, 0.1], target: [0, 0, 0] },
};

export function BoyleSmithCcd3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { params, updateParam } = usePatentPhysics("us-3858232-boyle-smith-ccd");
  const [showUiOverlay, setShowUiOverlay] = useState(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [isRunning, setIsRunning] = useState(true);

  const gateVoltage = params.gateVoltageV ?? 10;
  const clockFreq = params.clockFrequencyMhz ?? 5.0;
  const incidentLux = params.incidentLux ?? 250;
  const integrationTime = params.integrationTimeMs ?? 16.7;
  const temperature = params.temperatureKelvin ?? 300;

  const live = useLiveSimParams({
    gateVoltageV: gateVoltage,
    clockFrequencyMhz: clockFreq,
    incidentLux,
    integrationTimeMs: integrationTime,
    temperatureKelvin: temperature,
    isRunning,
  });

  const studioRef = useRef<StudioContext | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const metrics = stepBoyleSmithCcd({
    gateVoltageV: gateVoltage,
    clockFrequencyMhz: clockFreq,
    incidentLux,
    integrationTimeMs: integrationTime,
    temperatureKelvin: temperature,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const iso = CAMERA_PRESETS.iso;
    const studio = createThreeStudioScene({
      container,
      cameraPos: iso.pos,
      targetPos: iso.target,
    });
    studioRef.current = studio;

    const ccdModel = createBoyleSmithCcdModel();
    studio.scene.add(ccdModel.nodes.group);

    let animId = 0;
    let frame = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      frame += 1;
      const time = frame / 60;
      const p = live.current;

      ccdModel.update(
        {
          gateVoltageV: p.gateVoltageV,
          clockFrequencyMhz: p.clockFrequencyMhz,
          incidentLux: p.incidentLux,
          integrationTimeMs: p.integrationTimeMs,
          temperatureKelvin: p.temperatureKelvin,
        },
        p.isRunning ? time : 0,
      );

      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      ccdModel.dispose();
      studio.dispose();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-950 p-4 shadow-2xl">
      <div
        className="relative h-[480px] w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-950"
        ref={containerRef}
      >
        {showUiOverlay && (
          <div className="absolute top-4 left-4 z-10 pointer-events-none rounded-md border border-slate-800/80 bg-slate-900/80 px-3 py-2 backdrop-blur-md">
            <div className="font-mono text-xs font-bold text-slate-200">
              BOYLE & SMITH CCD 3D STUDIO (US 3,858,232)
            </div>
            <div className="text-[11px] text-slate-400">
              Interactive WebGL 3D Model • 3-Phase Gate Array • Clocked Potential Wells • Ceramic
              DIP Package
            </div>
          </div>
        )}

        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {showUiOverlay && (
            <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md p-1 rounded-lg border border-slate-700">
              {(
                [
                  ["iso", "ISO"],
                  ["gate_array", "Gates"],
                  ["package", "Package"],
                  ["potential_well", "Wells"],
                  ["top", "Top"],
                ] as [CameraPreset, string][]
              ).map(([preset, label]) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => applyCameraPreset(preset)}
                  className={`px-2 py-1 text-xs font-sans rounded transition-colors ${
                    activeCamera === preset
                      ? "bg-sky-600 text-white font-semibold shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            title={showUiOverlay ? "Hide HUD" : "Show HUD"}
            className="p-1.5 rounded-lg text-xs bg-slate-900/80 text-slate-400 hover:text-white border border-slate-700 transition-colors backdrop-blur-md"
          >
            <Zap className={`w-4 h-4 ${showUiOverlay ? "text-sky-400" : "text-slate-500"}`} />
          </button>
        </div>

        {showUiOverlay && (
          <div className="absolute bottom-4 left-4 z-10 pointer-events-none rounded-md border border-sky-500/50 bg-slate-950/80 px-3 py-1.5 font-mono text-xs text-sky-300 backdrop-blur-md">
            CTE: {metrics.ctePct}% • Capacity:{" "}
            {(metrics.fullWellCapacityElectrons / 1000).toFixed(0)}k e⁻ • Well Depth:{" "}
            {metrics.depletionDepthUm} µm
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-800/80 bg-slate-900/50 p-4">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-col gap-1">
            <label htmlFor="gateVoltage3d" className="text-xs font-mono text-slate-400">
              Gate Bias: {gateVoltage} V
            </label>
            <input
              id="gateVoltage3d"
              type="range"
              min="5"
              max="15"
              step="0.5"
              value={gateVoltage}
              onChange={(e) => updateParam("gateVoltageV", Number(e.target.value))}
              className="h-1.5 w-32 accent-sky-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="clockFreq3d" className="text-xs font-mono text-slate-400">
              Clock: {clockFreq} MHz
            </label>
            <input
              id="clockFreq3d"
              type="range"
              min="0.5"
              max="20"
              step="0.5"
              value={clockFreq}
              onChange={(e) => updateParam("clockFrequencyMhz", Number(e.target.value))}
              className="h-1.5 w-32 accent-sky-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="incidentLux3d" className="text-xs font-mono text-slate-400">
              Light: {incidentLux} lux
            </label>
            <input
              id="incidentLux3d"
              type="range"
              min="10"
              max="2000"
              step="10"
              value={incidentLux}
              onChange={(e) => updateParam("incidentLux", Number(e.target.value))}
              className="h-1.5 w-32 accent-sky-500"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsRunning(!isRunning)}
          className="flex items-center gap-2 rounded-md bg-sky-600 px-5 py-2 font-mono text-xs font-bold text-white shadow-lg shadow-sky-600/30 transition hover:bg-sky-500 active:scale-95"
        >
          {isRunning ? "⏸ PAUSE CLOCK" : "▶ RUN 3-PHASE CLOCK"}
        </button>
      </div>
    </div>
  );
}
