"use client";

import { useEffect, useRef, useState } from "react";
import { createThreeStudioScene } from "@/components/patents/visuals/three/ThreeStudioScene";
import { useLiveSimParams } from "@/components/patents/visuals/three/useLiveSimParams";
import { type EInkState, stepEInk } from "@/physics/eInkKernel";
import { TickScheduler } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { buildEInkModel } from "./EInkModel";

const EXHIBIT_ID = "us-6120588-eink";

export function EInk3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState(true);
  const [hud, setHud] = useState({
    voltage: 15,
    reflectance: 72,
    contrast: "12:1",
    stateLabel: "White State",
  });
  const { params } = usePatentPhysics(EXHIBIT_ID);
  const live = useLiveSimParams(params);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const studio = createThreeStudioScene({
      container,
      cameraPos: [0, 0.4, 3.2],
      targetPos: [0, 0, 0],
    });
    const model = buildEInkModel();
    studio.scene.add(model.root);

    let renderedSteps = 0;
    const sched = new TickScheduler(1 / 120, 0);
    let hudCounter = 0;
    let rafId = 0;
    let currentState: EInkState | undefined;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      renderedSteps += 1;
      const p = live.current;

      sched.pump(renderedSteps / 60, () => {
        currentState = stepEInk(
          {
            electrodeVoltageVolts: p.electrodeVoltageVolts ?? 15,
            fluidViscosityCp: p.fluidViscosityCp ?? 2.0,
            particleChargeCoupled: p.particleChargeCoupled ?? 1.0,
          },
          1 / 120,
          currentState,
        );
      });

      if (currentState) {
        const whiteTargetY = currentState.whiteParticleNormY * 0.85;
        const blackTargetY = currentState.blackParticleNormY * 0.85;

        model.whiteParticleMeshes.forEach((mesh, i) => {
          const jitter = Math.cos(i * 5.1) * 0.5 * 0.15;
          mesh.position.y += (whiteTargetY + jitter - mesh.position.y) * 0.18;
        });

        model.blackParticleMeshes.forEach((mesh, i) => {
          const jitter = Math.sin(i * 4.3) * 0.5 * 0.15;
          mesh.position.y += (blackTargetY + jitter - mesh.position.y) * 0.18;
        });

        const isUpward = currentState.electricFieldVperUm > 0;
        model.eFieldArrows.forEach((arrow) => {
          arrow.rotation.x = isUpward ? 0 : Math.PI;
        });

        model.mainGroup.rotation.y += 0.003;

        hudCounter += 1;
        if (hudCounter % 10 === 0) {
          const v = p.electrodeVoltageVolts ?? 15;
          const label =
            v > 2 ? "White (Reflective)" : v < -2 ? "Black (Absorptive)" : "Transition / Grayscale";
          setHud({
            voltage: v,
            reflectance: currentState.surfaceReflectancePercent,
            contrast: currentState.contrastRatio,
            stateLabel: label,
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
              State:{" "}
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                {hud.stateLabel}
              </span>
            </div>
            <div>
              Driving Potential:{" "}
              <span className="font-mono font-bold">
                {hud.voltage > 0 ? `+${hud.voltage}` : hud.voltage} V
              </span>
            </div>
            <div>
              Top Reflectance: <span className="font-mono font-bold">{hud.reflectance}%</span>
            </div>
            <div>
              Contrast Ratio: <span className="font-mono font-bold">{hud.contrast}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EInk3D;
