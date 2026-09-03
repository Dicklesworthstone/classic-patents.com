"use client";

import { Eye, EyeOff, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import {
  readEthernetControls,
  readMetcalfeEthernetTapeFrame,
  resetMetcalfeEthernetTape,
} from "@/physics/metcalfeEthernetKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { buildMetcalfeEthernetModel } from "./metcalfeEthernetModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

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

export function metcalfeViewForViewport(
  view: keyof typeof VIEWS,
  viewportWidth: number,
): { position: [number, number, number]; target: [number, number, number] } {
  const config = VIEWS[view];
  if (viewportWidth >= 640) return config;
  const multiplier = view === "overview" ? 1.95 : 1.5;
  return {
    position: [
      config.target[0] + (config.position[0] - config.target[0]) * multiplier,
      config.target[1] + (config.position[1] - config.target[1]) * multiplier,
      config.target[2] + (config.position[2] - config.target[2]) * multiplier,
    ],
    target: config.target,
  };
}

export function MetcalfeEthernet3D({ patentId = PATENT_ID }: { patentId?: string } = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [view, setView] = useState<keyof typeof VIEWS>("overview");
  const [interfaceVisible, setInterfaceVisible] = useState(true);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  const { params, effectiveParams, updateParam, resetParams } = usePatentPhysics(patentId);
  const liveParams = useLiveSimParams(effectiveParams);

  const selectView = (nextView: keyof typeof VIEWS) => {
    setView(nextView);
    const camera = metcalfeViewForViewport(nextView, containerRef.current?.clientWidth ?? 1000);
    studioRef.current?.controls.setView(camera.position, camera.target);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: The persistent WebGL scene reads the stable layout-effect-synchronized control ref; depending on `.current` would recreate and flash the studio.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const overview = metcalfeViewForViewport("overview", container.clientWidth);
    const studio = createThreeStudioScene({
      container,
      cameraPos: overview.position,
      targetPos: overview.target,
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

    const loop = () => {
      if (!studio.isVisible()) return;
      const currentControls = readEthernetControls(liveParams.current as any);
      const result = readMetcalfeEthernetTapeFrame(currentControls);

      // The transport bus steps CSMA/CD; this render loop only projects it.
      model.updateState(result.state, result.metrics, currentControls);

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

  useEffect(() => {
    const restoreResponsiveView = () => {
      const container = containerRef.current;
      if (!container) return;
      const camera = metcalfeViewForViewport(view, container.clientWidth);
      studioRef.current?.controls.setView(camera.position, camera.target);
    };
    window.addEventListener("resize", restoreResponsiveView);
    return () => window.removeEventListener("resize", restoreResponsiveView);
  }, [view]);

  return (
    <div className="flex min-h-[540px] w-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
      <div className="relative min-h-[460px] flex-1">
        <div ref={containerRef} className="absolute inset-0 h-full w-full" />

        {/* View Presets */}
        <div className="absolute top-4 left-4 right-24 z-10 flex gap-2 overflow-x-auto pb-1">
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
            aria-label="Toggle Ethernet HUD controls"
          >
            {interfaceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              resetMetcalfeEthernetTape();
              resetParams();
            }}
            className="p-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 rounded-md transition"
            title="Reset Parameters"
            aria-label="Reset Ethernet parameters and event tape"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Floating HUD Controls */}
        {interfaceVisible && (
          <div className="absolute bottom-4 left-4 right-4 z-10 max-h-[45%] overflow-y-auto p-4 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-lg flex flex-wrap gap-4 items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <label htmlFor="metcalfe-3d-cable-length" className="font-semibold text-amber-400">
                Cable Length:
              </label>
              <input
                id="metcalfe-3d-cable-length"
                aria-label="Coaxial cable length"
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
              <label htmlFor="metcalfe-3d-data-rate" className="font-semibold text-sky-400">
                Data Rate:
              </label>
              <input
                id="metcalfe-3d-data-rate"
                aria-label="Ethernet data rate"
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
                onClick={() => {
                  const activate = !params.triggerCollision;
                  updateParam("station1Transmitting", 1);
                  updateParam("station2Transmitting", activate ? 1 : 0);
                  updateParam("triggerCollision", activate ? 1 : 0);
                }}
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

      <div className="shrink-0 p-4 bg-slate-950 border-t border-slate-800">
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
