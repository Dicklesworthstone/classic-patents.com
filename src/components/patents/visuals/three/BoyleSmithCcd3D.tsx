"use client";

import { useEffect, useRef, useState } from "react";
import { stepBoyleSmithCcd } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { createBoyleSmithCcdModel } from "./boyleSmithCcdModel";
import { createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

const CAMERA_OVERVIEW = {
  pos: [12, 10, 16] as [number, number, number],
  target: [0, 0, 0] as [number, number, number],
};

export function BoyleSmithCcd3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { params, updateParam } = usePatentPhysics("us-3858232-boyle-smith-ccd");
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

    const studio = createThreeStudioScene({
      container,
      cameraPos: CAMERA_OVERVIEW.pos,
      targetPos: CAMERA_OVERVIEW.target,
      environmentStyle: "studio",
    });

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
    };
  }, [live]);

  return (
    <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-950 p-4 shadow-2xl">
      <div
        className="relative h-[480px] w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-950"
        ref={containerRef}
      >
        <div className="absolute top-4 left-4 z-10 rounded-md border border-slate-800/80 bg-slate-900/80 px-3 py-2 backdrop-blur-md">
          <div className="font-mono text-xs font-bold text-slate-200">
            BOYLE & SMITH CCD 3D STUDIO (US 3,858,232)
          </div>
          <div className="text-[11px] text-slate-400">
            Interactive WebGL 3D Model • 3-Phase Gate Array • Clocked Potential Wells • Ceramic DIP
            Package
          </div>
        </div>

        <div className="absolute bottom-4 left-4 z-10 rounded-md border border-sky-500/50 bg-slate-950/80 px-3 py-1.5 font-mono text-xs text-sky-300 backdrop-blur-md">
          CTE: {metrics.ctePct}% • Capacity: {(metrics.fullWellCapacityElectrons / 1000).toFixed(0)}
          k e⁻ • Well Depth: {metrics.depletionDepthUm} µm
        </div>
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
