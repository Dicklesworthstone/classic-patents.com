"use client";

import { Camera, Eye, EyeOff, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { HudText } from "@/components/ui/LatexRenderer";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { stepTeslaMotorFig9, teslaBAt, teslaMotorPhaseHz } from "@/physics/teslaKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { buildTeslaMotorModel, updateTeslaMotorKinematics } from "./teslaMotorModel";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "stator_coils" | "disk" | "shaft" | "generator" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [13, 10, 15], target: [0, 0, 0] },
  stator_coils: { pos: [0, 4.2, 5.8], target: [0, 0, 0] },
  disk: { pos: [0, 1.8, 3.8], target: [0, -0.4, 0] },
  shaft: { pos: [5.5, 1.5, 3.5], target: [2.0, -0.4, 0] },
  generator: { pos: [-5.5, 2.5, 3.5], target: [-2.5, 0.5, 0] },
  top: { pos: [0, 11.5, 0.1], target: [0, 0, 0] },
};

export function TeslaMotor3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Electrical & Mechanical Simulation State
  const { params, updateParam } = usePatentPhysics("us-381968-tesla-motor");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const acFrequencyHz = teslaMotorPhaseHz(params);
  const phaseCount = (params.phaseCount as 2 | 3) ?? 2;
  const fig13Unavailable = phaseCount === 3;
  const [showMagneticFlux] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [crateSource, setCrateSource] = useState(genericKernelSource());
  const { isAudioMuted, toggleSound } = usePatentAudio();

  const apparatus = stepTeslaMotorFig9(acFrequencyHz);

  // Electromechanical Induction Physics Calculations
  const appliedLoadTorqueNm = params.loadTorque ?? 14;
  const synchronousSpeedRpm = apparatus.generatorRpm;
  const slip = 0.03;
  const rotorSpeedRpm = Math.round(synchronousSpeedRpm * (1 - slip));
  const electricalPowerWatts = Math.round(
    ((appliedLoadTorqueNm * (rotorSpeedRpm * 2 * Math.PI)) / 60) * 1.15,
  );
  const rotorInducedCurrentAmps = Math.round(12 * (acFrequencyHz / 60));

  const live = useLiveSimParams({
    acFrequencyHz,
    phaseCount,
    showMagneticFlux,
    fieldDisplayOmegaRadPerS: apparatus.fieldDisplayOmegaRadPerS,
    isAudioMuted,
    rotorSpeedRpm,
    isCutaway,
  });

  const studioRef = useRef<StudioContext | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  useEffect(() => {
    void ensureGenericWasm().then((next) => setCrateSource(next));
  }, []);

  // Web Audio AC Motor 60Hz Harmonic Sound
  useEffect(() => {
    if (!isAudioMuted) {
      soundEngine.playTeslaMotorHum(acFrequencyHz, rotorSpeedRpm);
    } else {
      soundEngine.stopContinuousTone();
    }
    return () => {
      soundEngine.stopContinuousTone();
    };
  }, [isAudioMuted, acFrequencyHz, rotorSpeedRpm]);

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

    const { scene, camera, renderer, controls } = studio;

    // --- 3D STATOR & ROTOR ASSEMBLY ---
    const fig9Model = buildTeslaMotorModel(phaseCount);
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
        lastFrameTimeMs !== undefined ? Math.min((frameTimeMs - lastFrameTimeMs) / 1000, 0.1) : 0;
      lastFrameTimeMs = frameTimeMs;
      const p = live.current;
      const fig9Available = p.phaseCount === 2;

      fieldTimeSec += delta;
      bFieldAngle += p.fieldDisplayOmegaRadPerS * delta;

      const cos = Math.cos(bFieldAngle);
      const sin = Math.sin(bFieldAngle);
      bFieldArrow.setDirection(new THREE.Vector3(cos, 0, sin).normalize());

      const bFieldTesla = teslaBAt(bFieldAngle);
      const bFieldLen = THREE.MathUtils.clamp(
        (Math.hypot(bFieldTesla.bx, bFieldTesla.by) / 1.4) * 3.5,
        1.5,
        4.5,
      );
      bFieldArrow.setLength(bFieldLen, 0.6, 0.35);

      updateTeslaMotorKinematics(
        fig9Model,
        delta,
        p.fieldDisplayOmegaRadPerS,
        bFieldAngle,
        p.showMagneticFlux && fig9Available,
        fieldTimeSec,
      );

      bFieldArrow.visible = p.showMagneticFlux && fig9Available;
      fig9Model.setCutaway?.(p.isCutaway ?? false);

      controls.update();
      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      fig9Model.dispose();
      bFieldArrow.dispose();
      studio.dispose();
      studioRef.current = null;
    };
  }, [live, phaseCount]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Nikola Tesla Electro-Magnetic Motor 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-14rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
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

        {/* Top-right overlay and audio controls */}
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
            aria-label={isAudioMuted ? "Enable Motor Harmonic Sound" : "Mute Motor Audio"}
            type="button"
            onClick={() => toggleSound()}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={!isAudioMuted ? "Mute Motor Audio" : "Enable Motor Harmonic Sound"}
          >
            {!isAudioMuted ? (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="text-[10px] sm:text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-parchment-200 dark:border-ink-800/80">
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse text-amber-500" />
              US 381,968 Fig. 9 motor-generator
            </div>
            {!fig13Unavailable ? (
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-ink-600 dark:text-ink-400">
                    <HudText text="Sync ($n_s$):" />
                  </span>
                  <span className="font-bold text-blue-700 dark:text-blue-400">
                    {synchronousSpeedRpm} rpm
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-ink-600 dark:text-ink-400">
                    <HudText text="Rotor ($n_r$):" />
                  </span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    {rotorSpeedRpm} rpm
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-ink-600 dark:text-ink-400">
                    <HudText text="Slip ($s$):" />
                  </span>
                  <span className="font-bold text-amber-700 dark:text-amber-400">
                    {(slip * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-ink-600 dark:text-ink-400">Power:</span>
                  <span className="font-bold text-purple-700 dark:text-purple-400">
                    {electricalPowerWatts} W ({(electricalPowerWatts / 745.7).toFixed(1)} HP)
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-ink-600 dark:text-ink-400">Rotor Current:</span>
                  <span className="font-bold text-cyan-700 dark:text-cyan-400">
                    {rotorInducedCurrentAmps} A RMS
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-ink-600 dark:text-ink-400">Generator:</span>
                  <span className="font-bold text-blue-700 dark:text-blue-400">
                    {apparatus.generatorRpm} rpm
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-ink-600 dark:text-ink-400">Disk D:</span>
                  <span className="font-bold text-amber-700 dark:text-amber-400">
                    {apparatus.diskRpm} rpm
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-[10px] sm:text-xs font-sans text-ink-700 dark:text-ink-300">
                The three-circuit Fig. 13 arrangement is available in the facsimile, but this 3D
                instrument deliberately renders Fig. 9 only rather than synthesizing another model.
              </div>
            )}
            <div className="text-[10px] font-sans text-ink-500 dark:text-ink-400 pt-1 border-t border-parchment-200 dark:border-ink-800/80">
              Fig. 15–16 is the distinct source variant that dispenses with sliding contacts.
            </div>
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

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Generator AC Frequency
              </span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {acFrequencyHz} Hz
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="120"
              step="5"
              value={acFrequencyHz}
              onChange={(e) => updateParam("frequency", Number.parseInt(e.target.value, 10))}
              className="w-full accent-amber-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Phase Circuit Families
              </span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {phaseCount} Phases
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => updateParam("phaseCount", 2)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                  phaseCount === 2
                    ? "bg-amber-600 text-white border-amber-700 shadow-xs"
                    : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-parchment-300 border-parchment-300 dark:border-ink-700 hover:bg-parchment-300"
                }`}
              >
                2-Phase (Fig. 9)
              </button>
              <button
                type="button"
                onClick={() => updateParam("phaseCount", 3)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                  phaseCount === 3
                    ? "bg-amber-600 text-white border-amber-700 shadow-xs"
                    : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-parchment-300 border-parchment-300 dark:border-ink-700 hover:bg-parchment-300"
                }`}
              >
                3-Phase (Fig. 13)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
