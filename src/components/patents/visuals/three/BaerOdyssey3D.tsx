"use client";

import { Eye, EyeOff, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { readBaerControls, readBaerOdysseyTapeFrame } from "@/physics/baerOdysseyKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { buildBaerOdysseyModel } from "./baerOdysseyModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

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

export function baerViewForViewport(
  view: keyof typeof VIEWS,
  viewportWidth: number,
): { position: [number, number, number]; target: [number, number, number] } {
  const config = VIEWS[view];
  if (viewportWidth >= 640) return config;
  const multiplier = view === "overview" ? 1.55 : 1.35;
  return {
    position: [
      config.target[0] + (config.position[0] - config.target[0]) * multiplier,
      config.target[1] + (config.position[1] - config.target[1]) * multiplier,
      config.target[2] + (config.position[2] - config.target[2]) * multiplier,
    ],
    target: config.target,
  };
}

export function BaerOdyssey3D({ patentId = PATENT_ID }: { patentId?: string } = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [view, setView] = useState<keyof typeof VIEWS>("overview");
  const [interfaceVisible, setInterfaceVisible] = useState(true);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  const { params, effectiveParams, updateParam, resetParams } = usePatentPhysics(patentId);
  const liveParams = useLiveSimParams(effectiveParams);

  const selectView = (nextView: keyof typeof VIEWS) => {
    setView(nextView);
    const camera = baerViewForViewport(nextView, containerRef.current?.clientWidth ?? 1000);
    studioRef.current?.controls.setView(camera.position, camera.target);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: The persistent WebGL scene reads the stable layout-effect-synchronized control ref; depending on `.current` would recreate and flash the studio.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const overview = baerViewForViewport("overview", container.clientWidth);
    const studio = createThreeStudioScene({
      container,
      cameraPos: overview.position,
      targetPos: overview.target,
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

    const loop = () => {
      if (!studio.isVisible()) return;
      const currentControls = readBaerControls(liveParams.current as any);
      const result = readBaerOdysseyTapeFrame(currentControls);

      // The transport bus is the sole kernel stepper; Three.js only projects it.
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

  useEffect(() => {
    const restoreResponsiveView = () => {
      const container = containerRef.current;
      if (!container) return;
      const camera = baerViewForViewport(view, container.clientWidth);
      studioRef.current?.controls.setView(camera.position, camera.target);
    };
    window.addEventListener("resize", restoreResponsiveView);
    return () => window.removeEventListener("resize", restoreResponsiveView);
  }, [view]);

  return (
    <div className="relative flex min-h-[540px] w-full flex-col overflow-hidden rounded-2xl border border-amber-900/60 bg-slate-950 shadow-2xl">
      <div className="relative min-h-[420px] sm:min-h-[540px]">
        <div ref={containerRef} className="absolute inset-0 h-full w-full" />

        {/* Camera View Switcher Buttons */}
        <div className="absolute top-4 left-4 right-36 z-10 flex flex-nowrap gap-2 overflow-x-auto pb-1">
          {(Object.keys(VIEWS) as Array<keyof typeof VIEWS>).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => selectView(key)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-mono font-medium backdrop-blur-md transition ${
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
            aria-label={interfaceVisible ? "Hide Odyssey controls" : "Show Odyssey controls"}
          >
            {interfaceVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => resetParams()}
            className="flex items-center gap-1.5 rounded-lg border border-stone-800 bg-stone-900/70 px-3 py-1.5 text-xs font-mono text-stone-300 backdrop-blur-md hover:bg-stone-800 transition"
            aria-label="Reset Odyssey control sliders"
          >
            <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
            Reset Sliders
          </button>
        </div>
      </div>

      {/* Controls use normal flow on phones so they cannot cover the CRT. */}
      {interfaceVisible && (
        <div className="relative z-10 m-4 grid grid-cols-1 gap-3 rounded-xl border border-stone-800 bg-stone-950/90 p-3.5 text-xs font-mono shadow-2xl backdrop-blur-md sm:absolute sm:bottom-16 sm:left-4 sm:right-4 sm:m-0 md:grid-cols-4">
          <div>
            <div className="flex justify-between text-stone-400 mb-1">
              <label htmlFor="baer-p1-horizontal">P1 Horizontal (Knob 17)</label>
              <span className="text-sky-400">
                {((params.player1PotX ?? 0.15) as number).toFixed(2)}
              </span>
            </div>
            <input
              id="baer-p1-horizontal"
              aria-label="Player 1 horizontal potentiometer"
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
              <label htmlFor="baer-p1-vertical">P1 Vertical (Knob 16)</label>
              <span className="text-sky-400">
                {((params.player1PotY ?? 0.5) as number).toFixed(2)}
              </span>
            </div>
            <input
              id="baer-p1-vertical"
              aria-label="Player 1 vertical potentiometer"
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
              <label htmlFor="baer-p2-horizontal">P2 Horizontal (Knob 17₁)</label>
              <span className="text-pink-400">
                {((params.player2PotX ?? 0.85) as number).toFixed(2)}
              </span>
            </div>
            <input
              id="baer-p2-horizontal"
              aria-label="Player 2 horizontal potentiometer"
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
              <label htmlFor="baer-ball-spin">English / Ball Spin</label>
              <span className="text-amber-400">
                {((params.englishControl ?? 0.0) as number).toFixed(2)}
              </span>
            </div>
            <input
              id="baer-ball-spin"
              aria-label="Odyssey ball spin"
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

      <div className="shrink-0 p-4 bg-stone-950 border-t border-stone-800">
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
