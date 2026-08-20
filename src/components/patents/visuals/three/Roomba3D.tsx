"use client";

import { useEffect, useRef, useState } from "react";
import { createThreeStudioScene } from "@/components/patents/visuals/three/ThreeStudioScene";
import { useLiveSimParams } from "@/components/patents/visuals/three/useLiveSimParams";
import { ROOMBA_ROOM, type RoombaState, stepRoomba } from "@/physics/roombaKernel";
import { TickScheduler } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { buildRoombaModel } from "./RoombaModel";

const EXHIBIT_ID = "us-6594844-roomba";

export function Roomba3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState(true);
  const [hud, setHud] = useState({ mode: "spiral", speed: 0.3 });
  const { params } = usePatentPhysics(EXHIBIT_ID);
  const live = useLiveSimParams(params);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const studio = createThreeStudioScene({ container });
    const model = buildRoombaModel();
    studio.scene.add(model.root);

    studio.camera.position.set(0, 3.2, 3.2);
    studio.camera.lookAt(0, 0, 0);

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
      <div className="absolute top-3 right-3 z-10">
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
