"use client";

import { Eye, EyeOff, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import {
  INITIAL_BAER_STATE,
  readBaerControls,
  stepBaerOdysseySi,
} from "@/physics/baerOdysseyKernel";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { buildBaerOdysseyModel } from "./baerOdysseyModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";

const PATENT_ID = "us-3728480-baer-odyssey";

const VIEWS = {
  overview: {
    position: [0, 2.8, 4.6] as [number, number, number],
    target: [0, 0.8, 1.0] as [number, number, number],
  },
  tvScreen: {
    position: [0, 1.35, 2.4] as [number, number, number],
    target: [-0.15, 1.25, 0.75] as [number, number, number],
  },
  consoleControls: {
    position: [0, 1.6, 2.6] as [number, number, number],
    target: [0, 0.15, 1.8] as [number, number, number],
  },
  player1: {
    position: [-1.1, 0.9, 2.9] as [number, number, number],
    target: [-1.1, 0.1, 2.2] as [number, number, number],
  },
} as const;

export function BaerOdyssey3D({ patentId = PATENT_ID }: { patentId?: string } = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [view, setView] = useState<keyof typeof VIEWS>("overview");
  const [interfaceVisible, setInterfaceVisible] = useState(true);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  const { params, updateParam, resetParams } = usePatentPhysics(patentId);
  const liveParams = useRef(params);
  liveParams.current = params;

  const simStateRef = useRef(INITIAL_BAER_STATE);

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
      cameraMaxDistance: 10,
    });
    studioRef.current = studio;
    const { scene, camera, renderer, controls: studioControls } = studio;

    const model = buildBaerOdysseyModel();
    scene.add(model.root);

    const clock = createStudioClock();

    const loop = (timeNow: number) => {
      const dt = Math.min(clock.pump(timeNow).dt, 0.05);
      const currentControls = readBaerControls(liveParams.current as any);

      // Step physics
      const result = stepBaerOdysseySi(simStateRef.current, currentControls, dt);
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
    <div className="relative w-full h-[540px] rounded-2xl overflow-hidden border border-amber-900/60 bg-slate-950 shadow-2xl">
      <div ref={containerRef} className="w-full h-full" />

      {/* Camera View Switcher Buttons */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
        {(Object.keys(VIEWS) as Array<keyof typeof VIEWS>).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => selectView(key)}
            className={`rounded-lg px-3 py-1.5 text-xs font-mono font-medium backdrop-blur-md transition ${
              view === key
                ? "border border-amber-500 bg-amber-950/80 text-amber-300 shadow-lg"
                : "border border-stone-800 bg-stone-900/60 text-stone-400 hover:bg-stone-800/80 hover:text-stone-200"
            }`}
          >
            {key === "overview" && "Console & TV Studio"}
            {key === "tvScreen" && "CRT Screen Close-up"}
            {key === "consoleControls" && "Master Console Dials"}
            {key === "player1" && "Player 1 Potentiometers"}
          </button>
        ))}
      </div>

      {/* Top Right HUD Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setInterfaceVisible(!interfaceVisible)}
          className="rounded-lg border border-stone-800 bg-stone-900/70 p-2 text-stone-400 backdrop-blur-md hover:bg-stone-800 hover:text-stone-200 transition"
          title={interfaceVisible ? "Hide HUD Controls" : "Show HUD Controls"}
        >
          {interfaceVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={() => resetParams()}
          className="flex items-center gap-1.5 rounded-lg border border-stone-800 bg-stone-900/70 px-3 py-1.5 text-xs font-mono text-stone-300 backdrop-blur-md hover:bg-stone-800 transition"
        >
          <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
          Reset Sliders
        </button>
      </div>

      {/* Interactive Controls Overlay Panel */}
      {interfaceVisible && (
        <div className="absolute bottom-4 left-4 right-4 z-10 grid grid-cols-1 md:grid-cols-4 gap-3 rounded-xl border border-stone-800 bg-stone-950/85 p-3.5 backdrop-blur-md text-xs font-mono shadow-2xl">
          <div>
            <div className="flex justify-between text-stone-400 mb-1">
              <span>P1 Horizontal (Knob 17)</span>
              <span className="text-sky-400">
                {((params.player1PotX ?? 0.15) as number).toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.45"
              step="0.01"
              value={(params.player1PotX ?? 0.15) as number}
              onChange={(e) => updateParam("player1PotX", parseFloat(e.target.value))}
              className="w-full accent-sky-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-stone-400 mb-1">
              <span>P1 Vertical (Knob 16)</span>
              <span className="text-sky-400">
                {((params.player1PotY ?? 0.5) as number).toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.95"
              step="0.01"
              value={(params.player1PotY ?? 0.5) as number}
              onChange={(e) => updateParam("player1PotY", parseFloat(e.target.value))}
              className="w-full accent-sky-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-stone-400 mb-1">
              <span>P2 Horizontal (Knob 17₁)</span>
              <span className="text-pink-400">
                {((params.player2PotX ?? 0.85) as number).toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.55"
              max="0.95"
              step="0.01"
              value={(params.player2PotX ?? 0.85) as number}
              onChange={(e) => updateParam("player2PotX", parseFloat(e.target.value))}
              className="w-full accent-pink-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-stone-400 mb-1">
              <span>English / Ball Spin</span>
              <span className="text-amber-400">
                {((params.englishControl ?? 0.0) as number).toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="-1.0"
              max="1.0"
              step="0.05"
              value={(params.englishControl ?? 0.0) as number}
              onChange={(e) => updateParam("englishControl", parseFloat(e.target.value))}
              className="w-full accent-amber-400"
            />
          </div>
        </div>
      )}

      <div className="p-4 bg-stone-950 border-t border-stone-800">
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
