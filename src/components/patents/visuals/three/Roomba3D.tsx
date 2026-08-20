"use client";

import { useEffect, useRef, useState } from "react";
import {
  createThreeStudioScene,
  type StudioContext,
} from "@/components/patents/visuals/three/ThreeStudioScene";
import { useLiveSimParams } from "@/components/patents/visuals/three/useLiveSimParams";
import { ROOMBA_ROOM, type RoombaState, stepRoomba } from "@/physics/roombaKernel";
import { TickScheduler } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { buildRoombaModel } from "./RoombaModel";

const EXHIBIT_ID = "us-6594844-roomba";

type CameraPreset = "iso" | "robot_chassis" | "cleaning_path" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [0, 3.2, 3.2], target: [0, 0, 0] },
  robot_chassis: { pos: [0, 1.2, 1.5], target: [0, 0, 0] },
  cleaning_path: { pos: [2.5, 3.5, 2.5], target: [0, 0, 0] },
  top: { pos: [0, 5.5, 0.01], target: [0, 0, 0] },
};

export function Roomba3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [hud, setHud] = useState({ mode: "spiral", speed: 0.3 });
  const { params } = usePatentPhysics(EXHIBIT_ID);
  const live = useLiveSimParams(params);

  const studioRef = useRef<StudioContext | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

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
    const model = buildRoombaModel();
    studio.scene.add(model.root);

    let renderedSteps = 0;
    const sched = new TickScheduler(1 / 120, 0);
    let hudCounter = 0;
    let rafId = 0;
    let currentState: RoombaState | undefined;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      renderedSteps += 1;
      const p = live.current;

      sched.pump(renderedSteps / 60, () => {
        currentState = stepRoomba(
          {
            wheelSpeedMps: p.wheelSpeedMps ?? 0.3,
            turnRateRadSec: p.turnRateRadSec ?? 1.5,
            roomWidth: ROOMBA_ROOM.width,
            roomHeight: ROOMBA_ROOM.height,
          },
          currentState,
          1 / 120,
        );
      });

      if (currentState) {
        model.mainGroup.position.x = currentState.displayX;
        model.mainGroup.position.z = currentState.displayY;
        model.mainGroup.rotation.y = -currentState.heading;

        if (renderedSteps % 4 === 0) {
          model.updateTrail(currentState.displayX, currentState.displayY);
        }

        hudCounter += 1;
        if (hudCounter % 15 === 0) {
          setHud({
            mode: currentState.mode,
            speed: p.wheelSpeedMps ?? 0.3,
          });
        }
      }

      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      model.dispose();
      studio.dispose();
    };
  }, [live]);

  return (
    <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        {showUiOverlay && (
          <div className="flex items-center gap-1 bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md p-1 rounded-xl border border-neutral-300 dark:border-neutral-700">
            {(
              [
                ["iso", "ISO"],
                ["robot_chassis", "Chassis"],
                ["cleaning_path", "Path"],
                ["top", "Top"],
              ] as [CameraPreset, string][]
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyCameraPreset(preset)}
                className={`px-2 py-1 text-xs font-sans rounded-lg transition-colors ${
                  activeCamera === preset
                    ? "bg-emerald-600 text-white font-semibold shadow-sm"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => setShowUiOverlay((v) => !v)}
          className="p-2 rounded-xl bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md border border-neutral-300 dark:border-neutral-700 text-xs font-mono"
        >
          {showUiOverlay ? "hide" : "show"}
        </button>
      </div>
      {showUiOverlay && (
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none max-w-xs">
          <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs space-y-1">
            <div>
              Behavior State:{" "}
              <span className="font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">
                {hud.mode}
              </span>
            </div>
            <div>
              Wheel Speed: <span className="font-mono font-bold">{hud.speed.toFixed(2)} m/s</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Roomba3D;
