"use client";

import { useEffect, useRef, useState } from "react";
import { createThreeStudioScene } from "@/components/patents/visuals/three/ThreeStudioScene";
import { useLiveSimParams } from "@/components/patents/visuals/three/useLiveSimParams";
import { type MultiTouchState, stepMultiTouch } from "@/physics/multiTouchKernel";
import { TickScheduler } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { buildMultiTouchModel } from "./MultiTouchModel";

const EXHIBIT_ID = "us-7479949";

export function MultiTouch3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState(true);
  const [hud, setHud] = useState({
    mode: "Pinch-to-Zoom",
    zoom: 1.0,
    touchCount: 2,
    deltaC: "0.68",
  });
  const { params } = usePatentPhysics(EXHIBIT_ID);
  const live = useLiveSimParams(params);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const studio = createThreeStudioScene({ container });
    const model = buildMultiTouchModel();
    studio.scene.add(model.root);

    studio.camera.position.set(0, 0, 4.5);
    studio.camera.lookAt(0, 0, 0);

    let renderedSteps = 0;
    const sched = new TickScheduler(1 / 120, 0);
    let hudCounter = 0;
    let rafId = 0;
    let currentState: MultiTouchState | undefined;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      renderedSteps += 1;
      const p = live.current;
      const timeSec = renderedSteps / 60;

      sched.pump(timeSec, () => {
        currentState = stepMultiTouch(
          {
            fingerCount: p.fingerCount ?? 2,
            fingerSeparationMm: p.fingerSeparationMm ?? 50,
            touchPressureGrams: p.touchPressureGrams ?? 80,
            gestureVelocityMmS: p.gestureVelocityMmS ?? 15,
          },
          timeSec,
          currentState,
        );
      });

      if (currentState) {
        model.touch1.visible = currentState.activeTouchCount >= 1;
        model.touch2.visible = currentState.activeTouchCount >= 2;

        if (currentState.activeTouchCount >= 1) {
          model.touch1.position.x = currentState.touch1X;
          model.touch1.position.y = currentState.touch1Y;
        }

        if (currentState.activeTouchCount >= 2) {
          model.touch2.position.x = currentState.touch2X;
          model.touch2.position.y = currentState.touch2Y;
        }

        const targetScale = Math.max(0.5, Math.min(3.0, currentState.zoomScale));
        const curDocS = model.docGroup.scale.x;
        const nextDocS = curDocS + (targetScale - curDocS) * 0.15;
        model.docGroup.scale.set(nextDocS, nextDocS, nextDocS);

        if (currentState.gestureMode === "Two-Finger Rotate") {
          model.docGroup.rotation.z = (currentState.rotationAngleDeg * Math.PI) / 180;
        } else if (currentState.gestureMode === "Single-Finger Scroll") {
          model.docGroup.position.x = currentState.touch1X * 0.5;
          model.docGroup.position.y = currentState.touch1Y * 0.5;
        }

        model.mainGroup.rotation.x = Math.sin(timeSec * 0.5) * 0.08 + 0.1;
        model.mainGroup.rotation.y = Math.cos(timeSec * 0.4) * 0.08;

        hudCounter += 1;
        if (hudCounter % 10 === 0) {
          setHud({
            mode: currentState.gestureMode,
            zoom: Number(currentState.zoomScale.toFixed(2)),
            touchCount: currentState.activeTouchCount,
            deltaC: currentState.mutualCapacitanceDeltaPf.toFixed(2),
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
              Gesture Mode:{" "}
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                {hud.mode}
              </span>
            </div>
            <div>
              Scale Transformation: <span className="font-mono font-bold">{hud.zoom}x</span>
            </div>
            <div>
              Active Contacts:{" "}
              <span className="font-mono font-bold">{hud.touchCount} point(s)</span>
            </div>
            <div>
              Mutual Capacitance &Delta;C:{" "}
              <span className="font-mono font-bold">-{hud.deltaC} pF</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MultiTouch3D;
