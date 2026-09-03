"use client";

import { Eye, EyeOff, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "@/components/patents/visuals/PortHamiltonianEnergyStrip";
import {
  INITIAL_SIKORSKY_STATE,
  readSikorskyControls,
  stepSikorskyHelicopterSi,
} from "@/physics/sikorskyHelicopterKernel";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { useResponsiveStudioHud } from "./StudioKernelChips";
import { buildSikorskyHelicopterModel } from "./sikorskyHelicopterModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

const PATENT_ID = "us-2318259-sikorsky-helicopter";

const VIEWS = {
  overview: {
    position: [7.8, 6.2, 9.4] as [number, number, number],
    target: [0, 2.7, -1.5] as [number, number, number],
  },
  rotorHead: {
    position: [0.9, 2.2, 1.2] as [number, number, number],
    target: [0, 1.8, 0] as [number, number, number],
  },
  tailRotor: {
    position: [1.8, 1.6, -3.2] as [number, number, number],
    target: [0, 1.2, -3.6] as [number, number, number],
  },
  cockpit: {
    position: [0, 1.2, 1.6] as [number, number, number],
    target: [0, 0.8, 0.4] as [number, number, number],
  },
} as const;

const MOBILE_OVERVIEW = {
  position: [5.7, 5.4, 6.4] as [number, number, number],
  target: [0, 2.7, -1.3] as [number, number, number],
};

export function SikorskyHelicopter3D({ patentId = PATENT_ID }: { patentId?: string } = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [view, setView] = useState<keyof typeof VIEWS>("overview");
  const [interfaceVisible, setInterfaceVisible] = useResponsiveStudioHud(true);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true, 2: true });

  const { params, updateParam, resetParams } = usePatentPhysics(patentId);
  const liveParams = useLiveSimParams(params);

  const simStateRef = useRef(INITIAL_SIKORSKY_STATE);

  useFrankenSimPhysics(patentId);

  const selectView = (nextView: keyof typeof VIEWS) => {
    setView(nextView);
    const camera =
      nextView === "overview" && (containerRef.current?.clientWidth ?? 1000) < 640
        ? MOBILE_OVERVIEW
        : VIEWS[nextView];
    studioRef.current?.controls.setView(camera.position, camera.target);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: The mounted render loop reads this stable, layout-effect-synchronized ref; depending on its current value would rebuild the Three.js scene.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const initialCamera = container.clientWidth < 640 ? MOBILE_OVERVIEW : VIEWS.overview;
    const studio = createThreeStudioScene({
      container,
      cameraPos: initialCamera.position,
      targetPos: initialCamera.target,
      environmentStyle: "studio",
      enableClouds: false,
      ambientIntensity: 2.2,
      sunIntensity: 2.8,
    });
    studioRef.current = studio;
    const { scene, camera, renderer, controls: studioControls } = studio;

    const model = buildSikorskyHelicopterModel();
    scene.add(model.root);

    const clock = createStudioClock();

    const loop = (timeNow: number) => {
      const dt = Math.min(clock.pump(timeNow).dt, 0.05);
      const controls = readSikorskyControls(liveParams.current as any);
      const { state: nextState, metrics } = stepSikorskyHelicopterSi(
        simStateRef.current,
        controls,
        dt,
      );
      simStateRef.current = nextState;

      model.updateState(metrics, controls, nextState);
      studioControls.update();
      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(loop);

    return () => {
      renderer.setAnimationLoop(null);
      model.dispose();
      studio.dispose();
      studioRef.current = null;
    };
  }, []);

  const collective =
    typeof params.collectivePitchDeg === "number" ? params.collectivePitchDeg : 9.5;
  const cyclicPitch =
    typeof params.cyclicPitchForwardDeg === "number" ? params.cyclicPitchForwardDeg : 0.0;
  const cyclicRoll =
    typeof params.cyclicRollRightDeg === "number" ? params.cyclicRollRightDeg : 0.0;
  const pedals =
    typeof params.tailRotorPedalPercent === "number" ? params.tailRotorPedalPercent : 0.0;
  const engineRunning = params.engineRunning !== 0;

  return (
    <div className="relative w-full aspect-[4/3] max-h-[680px] bg-stone-950 rounded-xl overflow-hidden border border-stone-800 shadow-2xl">
      <div ref={containerRef} className="w-full h-full" />

      {/* Floating View Presets */}
      <div className="absolute top-4 left-4 right-20 flex flex-nowrap gap-2 z-10 overflow-x-auto scrollbar-none">
        {(Object.keys(VIEWS) as Array<keyof typeof VIEWS>).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => selectView(key)}
            className={`shrink-0 px-3 py-1 rounded text-xs font-semibold tracking-wider uppercase transition-colors backdrop-blur-md ${
              view === key
                ? "bg-amber-500/90 text-stone-950 shadow-md"
                : "bg-stone-900/80 hover:bg-stone-800/80 text-stone-300 border border-stone-700/60"
            }`}
          >
            {key === "overview" && "Full Airframe"}
            {key === "rotorHead" && "Main Hub / Swashplate"}
            {key === "tailRotor" && "Anti-Torque Tail"}
            {key === "cockpit" && "Flight Controls"}
          </button>
        ))}
      </div>

      {/* UI Visibility Toggle */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button
          type="button"
          onClick={() => setInterfaceVisible((v) => !v)}
          className="p-1.5 rounded-lg bg-stone-900/80 hover:bg-stone-800/80 text-stone-300 border border-stone-700/60 backdrop-blur-md transition-colors"
          title={interfaceVisible ? "Hide UI Overlay" : "Show UI Overlay"}
        >
          {interfaceVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
        <button
          type="button"
          onClick={resetParams}
          className="p-1.5 rounded-lg bg-stone-900/80 hover:bg-stone-800/80 text-stone-300 border border-stone-700/60 backdrop-blur-md transition-colors"
          title="Reset Controls"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Controls Overlay */}
      {interfaceVisible && (
        <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-stone-950/85 border border-stone-800/80 backdrop-blur-md z-10 flex flex-col md:flex-row gap-4 justify-between items-center text-xs text-stone-200">
          <div className="flex-1 w-full space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-amber-400">Collective Pitch Lever</span>
              <span className="font-mono text-emerald-400">{collective.toFixed(1)}°</span>
            </div>
            <input
              type="range"
              min={2.0}
              max={16.0}
              step={0.2}
              value={collective}
              onChange={(e) => updateParam("collectivePitchDeg", parseFloat(e.target.value))}
              className="w-full accent-amber-500 bg-stone-800 rounded h-1.5 cursor-pointer"
            />
          </div>

          <div className="flex-1 w-full space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-cyan-400">Fore/Aft Cyclic Stick</span>
              <span className="font-mono text-cyan-400">{cyclicPitch.toFixed(1)}°</span>
            </div>
            <input
              type="range"
              min={-10.0}
              max={10.0}
              step={0.5}
              value={cyclicPitch}
              onChange={(e) => updateParam("cyclicPitchForwardDeg", parseFloat(e.target.value))}
              className="w-full accent-cyan-500 bg-stone-800 rounded h-1.5 cursor-pointer"
            />
          </div>

          <div className="flex-1 w-full space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sky-400">Lateral Cyclic Roll</span>
              <span className="font-mono text-sky-400">{cyclicRoll.toFixed(1)}°</span>
            </div>
            <input
              type="range"
              min={-10.0}
              max={10.0}
              step={0.5}
              value={cyclicRoll}
              onChange={(e) => updateParam("cyclicRollRightDeg", parseFloat(e.target.value))}
              className="w-full accent-sky-500 bg-stone-800 rounded h-1.5 cursor-pointer"
            />
          </div>

          <div className="flex-1 w-full space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-purple-400">Anti-Torque Rudder Pedals</span>
              <span className="font-mono text-purple-400">{pedals.toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min={-100}
              max={100}
              step={5}
              value={pedals}
              onChange={(e) => updateParam("tailRotorPedalPercent", parseFloat(e.target.value))}
              className="w-full accent-purple-500 bg-stone-800 rounded h-1.5 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => updateParam("engineRunning", engineRunning ? 0 : 1)}
              className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
                engineRunning
                  ? "bg-rose-800 hover:bg-rose-700 text-white"
                  : "bg-emerald-700 hover:bg-emerald-600 text-white"
              }`}
            >
              {engineRunning ? "Cut Engine (Autorotation)" : "Start Engine"}
            </button>
          </div>
        </div>
      )}

      <div className="p-4 bg-stone-950 border-t border-stone-800 space-y-4">
        <PortHamiltonianEnergyStrip patentId={patentId} params={params as Record<string, number>} />
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
