"use client";

import { Camera, Eye, EyeOff, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  createThreeStudioScene,
  type StudioContext,
} from "@/components/patents/visuals/three/ThreeStudioScene";
import { useLiveSimParams } from "@/components/patents/visuals/three/useLiveSimParams";
import { type EInkState, stepEInk } from "@/physics/eInkKernel";
import { TickScheduler } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { buildEInkModel } from "./EInkModel";
import { StudioKernelChips } from "./StudioKernelChips";

const EXHIBIT_ID = "us-6120588-eink";

type CameraPreset = "iso" | "microcapsule" | "electrodes" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [0, 0.4, 3.2], target: [0, 0, 0] },
  microcapsule: { pos: [0, 0.2, 1.8], target: [0, 0, 0] },
  electrodes: { pos: [0, 1.2, 2.2], target: [0, 0, 0] },
  top: { pos: [0, 4.0, 0.01], target: [0, 0, 0] },
};

export function EInk3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [hud, setHud] = useState({
    voltage: 15,
    reflectance: 72,
    contrast: "12:1",
    stateLabel: "White State",
  });
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
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showUiOverlay
                ? "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
                : "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
            }`}
            title={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
            aria-label={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
          >
            {showUiOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-1.5rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3.5 h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["microcapsule", "Microcapsule"],
                ["electrodes", "Electrode Grid"],
                ["top", "Plan View"],
              ] as [CameraPreset, string][]
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyCameraPreset(preset)}
                className={`px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
                  activeCamera === preset
                    ? "bg-amber-600 text-white shadow-xs font-semibold"
                    : "text-ink-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="E-Ink Electrophoretic State"
          chips={[
            { label: "State", value: hud.stateLabel },
            {
              label: "Voltage",
              value: `${hud.voltage > 0 ? `+${hud.voltage}` : hud.voltage}`,
              unit: "V",
            },
            { label: "Reflectance", value: `${hud.reflectance}`, unit: "%" },
            { label: "Contrast", value: `${hud.contrast}` },
          ]}
        />
      </div>
    </div>
  );
}

export default EInk3D;
