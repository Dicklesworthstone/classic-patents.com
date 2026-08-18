"use client";

import { Activity, Camera, Eye, EyeOff, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { HudText } from "@/components/ui/LatexRenderer";
import { FrankenSimEngine } from "@/physics/engine";
import { TESLA_FIELD_POLES, teslaBAt, teslaFieldDisplayOmegaRadPerS } from "@/physics/teslaKernel";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import {
  createThreeStudioScene,
  type StudioContext,
} from "./ThreeStudioScene";
import { buildTeslaMotorModel } from "./teslaMotorModel";
import { useLiveSimParams } from "./useLiveSimParams";

type CameraPreset = "iso" | "stator_coils" | "squirrel_cage" | "shaft_drive" | "top";

export function TeslaMotor3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Electrical & Mechanical Simulation State
  const { params, updateParam } = usePatentPhysics("us-381968-tesla-motor");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const acFrequencyHz = params.frequency ?? 60;
  const phaseCount = (params.phaseCount as 2 | 3) ?? 2;
  const appliedLoadTorqueNm = params.loadTorque ?? 38.5;
  const [showMagneticFlux, setShowMagneticFlux] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const isPlayingAudio = (params.acHum ?? 0) === 1;

  // Electromechanical Induction Physics Calculations (FrankenSim Engine)
  const fieldPoles = TESLA_FIELD_POLES;
  const polePairs = fieldPoles / 2;
  const emPhysics = FrankenSimEngine.stepTeslaMotor(acFrequencyHz, fieldPoles, appliedLoadTorqueNm);
  const synchronousSpeedRpm = emPhysics.synchronousRpm;
  const slip = emPhysics.slipFraction;
  const rotorSpeedRpm = emPhysics.rotorRpm;
  const electricalPowerWatts = emPhysics.electricalInputWatts;
  const rotorInducedCurrentAmps = Math.round(emPhysics.currentAmperes);

  useFrankenSimPhysics("us-381968-tesla-motor", {
    domain: "electromagnetics_flux",
    em: emPhysics,
  });

  const live = useLiveSimParams({
    acFrequencyHz,
    polePairs,
    slip,
    showMagneticFlux,
    isPlayingAudio,
    fieldDisplayOmegaRadPerS: teslaFieldDisplayOmegaRadPerS(acFrequencyHz),
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
      case "squirrel_cage":
        camera.position.set(0, 1.8, 3.8);
        controls.target.set(0, -0.4, 0);
        break;
      case "shaft_drive":
        camera.position.set(5.5, 1.5, 3.5);
        controls.target.set(2.0, -0.4, 0);
        break;
      case "top":
        camera.position.set(0, 11.5, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  // Web Audio AC Motor 60Hz Harmonic Sound
  useEffect(() => {
    if (isPlayingAudio) {
      soundEngine.playTeslaMotorHum(acFrequencyHz, rotorSpeedRpm);
    } else {
      soundEngine.stopContinuousTone();
    }
    return () => {
      soundEngine.stopContinuousTone();
    };
  }, [isPlayingAudio, acFrequencyHz, rotorSpeedRpm]);

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
    const model = buildTeslaMotorModel(phaseCount);
    scene.add(model.rootGroup);

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
    let renderedSteps = 0;
    let bFieldAngle = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      renderedSteps += 1;
      const delta = 1 / 60;
      const elapsed = renderedSteps * (1 / 60);
      const p = live.current;

      // Electrical ω shown at 1/20 so a 60 Hz field is visible.
      const omegaDisplay =
        p.fieldDisplayOmegaRadPerS ?? teslaFieldDisplayOmegaRadPerS(p.acFrequencyHz);
      bFieldAngle += omegaDisplay * delta;
      const field = teslaBAt(bFieldAngle, phaseCount);
      bFieldArrow.setDirection(new THREE.Vector3(field.bx, 0, field.by));

      const omegaRotor = omegaDisplay * (1 - p.slip);
      model.rotorGroup.rotation.y += omegaRotor * delta;

      for (const item of model.coilMeshes) {
        const phaseOffset = item.phaseIdx * (phaseCount === 2 ? Math.PI / 2 : (2 * Math.PI) / 3);
        const currentI = Math.sin(elapsed * p.acFrequencyHz * 0.5 + phaseOffset);
        const mat = item.mesh.material as THREE.MeshStandardMaterial;
        mat.emissive = new THREE.Color(0xf59e0b);
        mat.emissiveIntensity = Math.abs(currentI) * 0.9;
      }

      const fPos = model.fluxPositions;
      for (let i = 0; i < model.fluxCount; i++) {
        const idx = i * 3;
        const x = fPos[idx];
        const z = fPos[idx + 2];
        const r = Math.sqrt(x * x + z * z);
        let curAngle = Math.atan2(z, x);
        curAngle += omegaDisplay * delta;

        fPos[idx] = Math.cos(curAngle) * r;
        fPos[idx + 2] = Math.sin(curAngle) * r;
      }
      model.fluxPoints.geometry.attributes.position.needsUpdate = true;
      model.fluxPoints.visible = p.showMagneticFlux;
      bFieldArrow.visible = p.showMagneticFlux;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      model.dispose();
      bFieldArrow.dispose();
      studio.dispose();
    };
  }, [live, phaseCount]);

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
                Polyphase Induction Telemetry
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 sm:gap-y-1 mt-1 text-[10px] sm:text-xs font-sans">
                <div>
                  <span className="text-ink-600 dark:text-ink-400">
                    <HudText text="Sync ($n_s$):" />
                  </span>{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {synchronousSpeedRpm} RPM
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">
                    <HudText text="Rotor ($n_r$):" />
                  </span>{" "}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {rotorSpeedRpm} RPM
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">
                    <HudText text="Slip ($s$):" />
                  </span>{" "}
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {(slip * 100).toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Power:</span>{" "}
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {electricalPowerWatts} W ({(electricalPowerWatts / 745.7).toFixed(1)} HP)
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 items-center gap-2 max-w-full">
              <Activity className="w-3.5 h-3.5 text-blue-500 animate-spin-slow shrink-0" />
              <span className="truncate">Rotor Current: {rotorInducedCurrentAmps} A RMS</span>
            </div>
          </div>
        )}

        {/* Top Right Tool Bar (Toggle UI, Audio, Pins, Reset) */}
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
            aria-label={isPlayingAudio ? "Stop AC Motor Audio" : "Play AC Motor 60Hz Tone"}
            type="button"
            onClick={() => updateParam("acHum", isPlayingAudio ? 0 : 1)}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              isPlayingAudio
                ? "bg-amber-600 text-white border-amber-700 shadow-md"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
            title={isPlayingAudio ? "Stop AC Motor Audio" : "Play AC Motor 60Hz Tone"}
          >
            {isPlayingAudio ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
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
                ["squirrel_cage", "Rotor & Bars"],
                ["shaft_drive", "Shaft & Pulley"],
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
      </div>
    </div>
  );
}
