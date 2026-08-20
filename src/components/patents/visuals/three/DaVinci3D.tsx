"use client";

import { useEffect, useRef, useState } from "react";
import { createThreeStudioScene } from "@/components/patents/visuals/three/ThreeStudioScene";
import { useLiveSimParams } from "@/components/patents/visuals/three/useLiveSimParams";
import { type DaVinciState, stepDaVinci } from "@/physics/daVinciKernel";
import { TickScheduler } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { buildDaVinciModel } from "./DaVinciModel";

const EXHIBIT_ID = "us-6331181-davinci";

export function DaVinci3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState(true);
  const [hud, setHud] = useState({
    scale: 3,
    tremorAtten: 94.5,
    tipVelocity: 0,
  });
  const { params } = usePatentPhysics(EXHIBIT_ID);
  const live = useLiveSimParams(params);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const studio = createThreeStudioScene({
      container: container as HTMLDivElement,
      cameraPos: [0, 1.2, 2.5],
      targetPos: [0, 0, 0],
    });
    const model = buildDaVinciModel();
    studio.scene.add(model.root);

    let renderedSteps = 0;
    const sched = new TickScheduler(1 / 120, 0);
    let hudCounter = 0;
    let rafId = 0;
    let currentState: DaVinciState | undefined;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      renderedSteps += 1;
      const p = live.current;
      const timeSec = renderedSteps / 60;

      sched.pump(timeSec, () => {
        currentState = stepDaVinci(
          {
            motionScaleRatio: p.motionScaleRatio ?? 3.0,
            tremorFilterEnabled: (p.tremorFilterEnabled ?? 1) > 0.5,
            masterInputSpeedMps: p.masterInputSpeedMps ?? 0.5,
            gripAngleDeg: p.gripAngleDeg ?? 30,
          },
          timeSec,
          currentState,
        );
      });

      if (currentState) {
        model.masterHandle.position.set(
          currentState.masterX,
          currentState.masterY + 0.8,
          currentState.masterZ,
        );

        model.baseGroup.position.set(currentState.slaveX, currentState.slaveY, currentState.slaveZ);
        model.baseGroup.rotation.y = currentState.baseYawRad;
        model.baseGroup.rotation.x = currentState.shoulderPitchRad;

        model.wristPitchGroup.rotation.x = currentState.wristPitchRad;
        model.wristYawGroup.rotation.y = currentState.wristYawRad;
        model.wristRollGroup.rotation.z = currentState.wristRollRad;

        model.leftJawGroup.rotation.z = -currentState.gripRad / 2;
        model.rightJawGroup.rotation.z = currentState.gripRad / 2;

        hudCounter += 1;
        if (hudCounter % 10 === 0) {
          setHud({
            scale: p.motionScaleRatio ?? 3,
            tremorAtten: currentState.tremorAttenuationPercent,
            tipVelocity: currentState.tipVelocityMms,
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
              Scale Ratio: <span className="font-mono font-bold">{hud.scale}:1</span>
            </div>
            <div>
              Tremor Filter:{" "}
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {hud.tremorAtten > 0 ? "Active (-26 dB)" : "Bypassed"}
              </span>
            </div>
            <div>
              Tip Speed:{" "}
              <span className="font-mono font-bold">{hud.tipVelocity.toFixed(1)} mm/s</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DaVinci3D;
