"use client";

import { Eye, EyeOff, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  INITIAL_ETHERNET_STATE,
  readEthernetControls,
  stepMetcalfeEthernetSi,
} from "@/physics/metcalfeEthernetKernel";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { buildMetcalfeEthernetModel } from "./metcalfeEthernetModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";

const PATENT_ID = "us-4063220-metcalfe-ethernet";

const VIEWS = {
  overview: {
    position: [0, 3.2, 5.8] as [number, number, number],
    target: [0, 1.0, 0] as [number, number, number],
  },
  alto1: {
    position: [-2.0, 1.8, 2.2] as [number, number, number],
    target: [-2.0, 1.3, 0.3] as [number, number, number],
  },
  coaxTap: {
    position: [-0.5, 1.0, 0.8] as [number, number, number],
    target: [-0.5, 0.4, -0.5] as [number, number, number],
  },
  alto2: {
    position: [2.0, 1.8, 2.2] as [number, number, number],
    target: [2.0, 1.3, 0.3] as [number, number, number],
  },
} as const;

export function MetcalfeEthernet3D({ patentId = PATENT_ID }: { patentId?: string } = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [view, setView] = useState<keyof typeof VIEWS>("overview");
  const [interfaceVisible, setInterfaceVisible] = useState(true);

  const { params, updateParam, resetParams } = usePatentPhysics(patentId);
  const liveParams = useRef(params);
  liveParams.current = params;

  const simStateRef = useRef(INITIAL_ETHERNET_STATE);

  useFrankenSimPhysics(patentId);

  const selectView = (nextView: keyof typeof VIEWS) => {
    setView(nextView);
    const camera = VIEWS[nextView];
    studioRef.current?.controls.setView(camera.position, camera.target);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: VIEWS.overview.position,
      targetPos: VIEWS.overview.target,
      environmentStyle: "studio",
      enableClouds: false,
      ambientIntensity: 2.2,
      sunIntensity: 2.8,
      cameraMinDistance: 1.5,
      cameraMaxDistance: 12,
    });
    studioRef.current = studio;
    const { scene, camera, renderer, controls: studioControls } = studio;

    const model = buildMetcalfeEthernetModel();
    scene.add(model.root);

    const clock = createStudioClock();

    const loop = (timeNow: number) => {
      const dt = Math.min(clock.pump(timeNow).dt, 0.05);
      const currentControls = readEthernetControls(liveParams.current as any);

      // Step physics
      const result = stepMetcalfeEthernetSi(simStateRef.current, currentControls, dt);
      simStateRef.current = result.state;

      // Update 3D model
      model.updateState(result.metrics, currentControls);

      studioControls.update();
      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(loop);

    return () => {
      renderer.setAnimationLoop(null);
      model.dispose();
      studio.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[540px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
      <div ref={containerRef} className="w-full h-full" />

      {/* View Presets */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {(Object.keys(VIEWS) as Array<keyof typeof VIEWS>).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => selectView(v)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
              view === v
                ? "bg-amber-500 text-slate-950 font-bold"
                : "bg-slate-900/80 text-slate-300 hover:bg-slate-800"
            }`}
          >
            {v === "overview" && "Full Lab Overview"}
            {v === "alto1" && "Alto 1 (Transmitter)"}
            {v === "coaxTap" && "Coaxial Tap Transceiver"}
            {v === "alto2" && "Alto 2 (Receiver)"}
          </button>
        ))}
      </div>

      {/* Visibility Toggle & Reset */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          type="button"
          onClick={() => setInterfaceVisible(!interfaceVisible)}
          className="p-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 rounded-md transition"
          title="Toggle HUD Controls"
        >
          {interfaceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
        <button
          type="button"
          onClick={() => resetParams()}
          className="p-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 rounded-md transition"
          title="Reset Parameters"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Floating HUD Controls */}
      {interfaceVisible && (
        <div className="absolute bottom-4 left-4 right-4 z-10 p-4 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-lg flex flex-wrap gap-4 items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-amber-400">Cable Length:</span>
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={params.cableLengthMeters ?? 500}
              onChange={(e) => updateParam("cableLengthMeters", Number(e.target.value))}
              className="accent-amber-400 cursor-pointer w-28"
            />
            <span className="font-mono text-slate-200">{params.cableLengthMeters ?? 500} m</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-semibold text-sky-400">Data Rate:</span>
            <input
              type="range"
              min="1.0"
              max="10.0"
              step="0.5"
              value={params.dataRateMbps ?? 2.94}
              onChange={(e) => updateParam("dataRateMbps", Number(e.target.value))}
              className="accent-sky-400 cursor-pointer w-28"
            />
            <span className="font-mono text-slate-200">{params.dataRateMbps ?? 2.94} Mbps</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => updateParam("triggerCollision", params.triggerCollision ? 0 : 1)}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
                params.triggerCollision
                  ? "bg-rose-600 text-white"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
            >
              {params.triggerCollision ? "Collision Active (Jamming)" : "Inject Packet Collision"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
