"use client";

import { Camera, Eye, EyeOff, RotateCcw, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { stepTeslaMotorFig9, teslaBAt, teslaMotorPhaseHz } from "@/physics/teslaKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { buildTeslaMotorModel, updateTeslaMotorKinematics } from "./teslaMotorModel";
import { useLiveSimParams } from "./useLiveSimParams";

type CameraPreset = "iso" | "stator_coils" | "disk" | "shaft" | "generator" | "top";

export function TeslaMotor3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Electrical & Mechanical Simulation State
  const { params } = usePatentPhysics("us-381968-tesla-motor");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const acFrequencyHz = teslaMotorPhaseHz(params);
  const phaseCount = (params.phaseCount as 2 | 3) ?? 2;
  const fig13Unavailable = phaseCount === 3;
  const [showMagneticFlux] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  const apparatus = stepTeslaMotorFig9(acFrequencyHz);

  const live = useLiveSimParams({
    acFrequencyHz,
    phaseCount,
    showMagneticFlux,
    fieldDisplayOmegaRadPerS: apparatus.fieldDisplayOmegaRadPerS,
  });

  const controlsRef = useRef<StudioContext["controls"] | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    switch (preset) {
      case "iso":
        camera.position.set(13, 10, 15);
        controls.target.set(0, 0, 0);
        break;
      case "stator_coils":
        camera.position.set(0, 4.2, 5.8);
        controls.target.set(0, 0, 0);
        break;
      case "disk":
        camera.position.set(0, 1.8, 3.8);
        controls.target.set(0, -0.4, 0);
        break;
      case "shaft":
        camera.position.set(5.5, 1.5, 3.5);
        controls.target.set(2.0, -0.4, 0);
        break;
      case "generator":
        camera.position.set(-5.5, 2.5, 3.5);
        controls.target.set(-2.5, 0.5, 0);
        break;
      case "top":
        camera.position.set(0, 11.5, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  useEffect(() => {
    void ensureGenericWasm().then((next) => setCrateSource(next));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [13, 10, 15],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // --- 3D STATOR & ROTOR ASSEMBLY ---
    const fig9Model = buildTeslaMotorModel();
    scene.add(fig9Model.rootGroup);

    // --- ROTATING B-FIELD VECTOR ARROW ---
    const bFieldArrow = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 2.2, 0),
      3.2,
      0x38bdf8,
      0.6,
      0.35,
    );
    scene.add(bFieldArrow);

    // --- RENDER LOOP & REAL-TIME PHYSICS SIMULATION ---
    let reqId: number;
    let bFieldAngle = 0;
    let fieldTimeSec = 0;
    let lastFrameTimeMs: number | undefined;

    const animate = (frameTimeMs: number) => {
      reqId = requestAnimationFrame(animate);
      const delta =
        lastFrameTimeMs === undefined ? 0 : Math.min((frameTimeMs - lastFrameTimeMs) / 1000, 0.1);
      lastFrameTimeMs = frameTimeMs;
      const p = live.current;
      const sourceGuideAvailable = p.phaseCount !== 3;
      fig9Model.rootGroup.visible = sourceGuideAvailable;

      // The shared display rate keeps the field motion legible in the source guide.
      const omegaDisplay = p.fieldDisplayOmegaRadPerS;
      bFieldAngle += omegaDisplay * delta;
      fieldTimeSec += delta;
      const field = teslaBAt(bFieldAngle);
      bFieldArrow.setDirection(new THREE.Vector3(field.bx, 0, field.by));

      updateTeslaMotorKinematics(
        fig9Model,
        delta,
        omegaDisplay,
        bFieldAngle,
        p.showMagneticFlux && sourceGuideAvailable,
        fieldTimeSec,
      );

      bFieldArrow.visible = p.showMagneticFlux && sourceGuideAvailable;

      controls.update();
      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      fig9Model.dispose();
      bFieldArrow.dispose();
      studio.dispose();
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      {/* 3D WebGL Canvas Viewport */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Live HUD Telemetry Overlay */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-col gap-1.5 sm:gap-2 pointer-events-none max-w-[calc(100%-8rem)] sm:max-w-md transition-opacity duration-200">
            <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md p-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
              <div className="text-[10px] sm:text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse text-amber-500" />
                US 381,968 Fig. 9 Source Guide
              </div>
              {!fig13Unavailable ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 sm:gap-y-1 mt-1 text-[10px] sm:text-xs font-sans">
                  <div>
                    <span className="text-ink-600 dark:text-ink-400">Ring R:</span>{" "}
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      annulus and four coils
                    </span>
                  </div>
                  <div>
                    <span className="text-ink-600 dark:text-ink-400">Disk D:</span>{" "}
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      mounted within R
                    </span>
                  </div>
                  <div>
                    <span className="text-ink-600 dark:text-ink-400">Generator G:</span>{" "}
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      B/B′ coils and contact rings
                    </span>
                  </div>
                  <div>
                    <span className="text-ink-600 dark:text-ink-400">L/L′:</span>{" "}
                    <span className="font-bold text-purple-600 dark:text-purple-400">
                      motor-generator circuits
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mt-1 text-[10px] sm:text-xs font-sans text-ink-700 dark:text-ink-300">
                  The three-circuit Fig. 13 arrangement is available in the facsimile, but this 3D
                  source guide deliberately renders Fig. 9 only rather than synthesizing another
                  model.
                </div>
              )}
            </div>

            <div className="hidden sm:flex bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 items-center gap-2 max-w-full">
              <span className="truncate">
                Fig. 15–16 is the distinct source variant that dispenses with sliding contacts.
              </span>
            </div>
          </div>
        )}

        {/* Top-right controls for the source guide. */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showUiOverlay
                ? "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
                : "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
            }`}
            title={showUiOverlay ? "Hide Overlay UI (Clean 3D View)" : "Show Overlay UI"}
            aria-label={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
          >
            {showUiOverlay ? (
              <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
          <button
            aria-label={showCalloutPins ? "Hide annotation pins" : "Show annotation pins"}
            type="button"
            onClick={() => setShowCalloutPins(!showCalloutPins)}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showCalloutPins
                ? "bg-amber-600 text-white border-amber-700 shadow-md"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
            title="Toggle Historical Patent Numeral Pins"
          >
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Camera Views Bar */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-1.5rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["stator_coils", "Stator Coils"],
                ["disk", "Magnetic Disk D"],
                ["shaft", "Axis a"],
                ["generator", "Generator G"],
                ["top", "Plan View"],
              ] as const
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyCameraPreset(preset)}
                className={`px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
                  activeCamera === preset
                    ? "bg-amber-600 text-white shadow-xs"
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
          title="fs-ga rotating-field motor"
          chips={[
            { label: "Crate", value: crateSource === "wasm" ? "fs-wasm" : "ts-ga-fallback" },
            { label: "Field f", value: acFrequencyHz.toFixed(0), unit: "Hz" },
            {
              label: "ω_display",
              value: apparatus.fieldDisplayOmegaRadPerS.toFixed(2),
              unit: "rad/s",
            },
          ]}
        />
      </div>
    </div>
  );
}
