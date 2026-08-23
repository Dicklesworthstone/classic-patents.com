"use client";

import { Camera, Eye, EyeOff, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { HudText } from "@/components/ui/LatexRenderer";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import {
  computeTeslaRotatingBField,
  createColormappedFieldTexture,
  writeColormappedField,
} from "@/physics/fieldTextures";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { stepTeslaMotorFig9, teslaBAt, teslaMotorPhaseHz } from "@/physics/teslaKernel";
import { createStudioClock } from "@/physics/tickScheduler";
import type { ElectromagneticsState } from "@/physics/types";
import {
  globalTransportBus,
  type TapeUpdater,
  useFrankenSimPhysics,
} from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
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

const IDLE_EM: ElectromagneticsState = {
  frequencyHz: 0,
  magneticFluxDensityTesla: 0,
  electricFieldVpm: 0,
  phaseAngleRad: 0,
  inductanceHenry: 0,
  capacitanceFarad: 0,
  currentAmperes: 0,
  voltageVolts: 0,
  powerFactor: 0,
  efficiencyPct: 0,
  synchronousRpm: 0,
  slipFraction: 0,
  rotorRpm: 0,
  shaftPowerWatts: 0,
  electricalInputWatts: 0,
};

export function TeslaMotor3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Electrical & Mechanical Simulation State
  const { params, updateParam } = usePatentPhysics("us-381968-tesla-motor");
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const generatorFrequencyHz = teslaMotorPhaseHz(params);
  const [showMagneticFlux] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [crateSource, setCrateSource] = useState(genericKernelSource());
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const { isAudioMuted, toggleSound } = usePatentAudio();

  const apparatus = stepTeslaMotorFig9(generatorFrequencyHz);

  const generatorRpm = apparatus.generatorRpm;
  // Shared transport tape: Fig. 9 EM state publishes to the patentId-keyed bus.
  useFrankenSimPhysics("us-381968-tesla-motor", {
    domain: "electromagnetics_flux",
    refusal: { isRefused: false },
    em: {
      frequencyHz: generatorFrequencyHz,
      magneticFluxDensityTesla: 0,
      electricFieldVpm: 0,
      phaseAngleRad: 0,
      inductanceHenry: 0,
      capacitanceFarad: 0,
      currentAmperes: 0,
      voltageVolts: 0,
      powerFactor: 0,
      efficiencyPct: 0,
      synchronousRpm: generatorRpm,
      slipFraction: 0,
      rotorRpm: generatorRpm,
      shaftPowerWatts: 0,
      electricalInputWatts: 0,
    },
  });

  const live = useLiveSimParams({
    generatorFrequencyHz,
    showMagneticFlux,
    fieldDisplayOmegaRadPerS: apparatus.fieldDisplayOmegaRadPerS,
    isAudioMuted,
    claim1Active: claimStates[1] === false ? 0 : 1,
  });

  // One tape-bound integrator (br-ixl.3): the bus updater owns the rotating
  // B-field physics so every face reads one deterministic state. Refusal
  // freezes the illegal step at the last legal angle instead of clamping on.
  const bFieldAngleRef = useRef(0);
  const lastLegalAngleRef = useRef(0);
  // One tape-bound integrator (br-ixl.3): the bus updater owns the rotating
  // B-field physics so every face reads one deterministic state. Refusal
  // freezes the illegal step at the last legal angle instead of clamping on.
  // Accumulators live in refs so re-registering on control changes never
  // snaps the phase back to zero.
  useEffect(() => {
    const integrate: TapeUpdater = (prev, dt) => {
      const refused = (live.current.claim1Active ?? 1) < 0.5;
      if (!refused) {
        bFieldAngleRef.current += live.current.fieldDisplayOmegaRadPerS * dt;
        lastLegalAngleRef.current = bFieldAngleRef.current;
      } else {
        bFieldAngleRef.current = lastLegalAngleRef.current;
      }
      return {
        refusal: {
          isRefused: refused,
          reason: refused
            ? "Claim 1 circuit open: rotating field held at last legal angle"
            : undefined,
        },
        em: { ...(prev.em ?? IDLE_EM), phaseAngleRad: bFieldAngleRef.current },
      };
    };
    globalTransportBus.registerUpdater("us-381968-tesla-motor", integrate, "TS_FALLBACK");
    return () => globalTransportBus.unregisterUpdater("us-381968-tesla-motor");
  }, [live.current.claim1Active, live.current.fieldDisplayOmegaRadPerS]);
  const studioRef = useRef<StudioContext | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  useEffect(() => {
    void ensureGenericWasm().then((next) => setCrateSource(next));
  }, []);

  // Optional generator-phase teaching tone.
  useEffect(() => {
    if (!isAudioMuted) {
      soundEngine.playTeslaGeneratorTone(generatorFrequencyHz, generatorRpm);
    } else {
      soundEngine.stopContinuousTone();
    }
    return () => {
      soundEngine.stopContinuousTone();
    };
  }, [isAudioMuted, generatorFrequencyHz, generatorRpm]);

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
    // The 3D studio is intentionally Fig. 9 only. Fig. 13 remains a separate
    // three-circuit teaching view in the 2D face, rather than a hybrid mesh.
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

    const fieldGrid = 32;
    const fieldTex = createColormappedFieldTexture(
      computeTeslaRotatingBField(0, fieldGrid),
      fieldGrid,
      fieldGrid,
    );
    const fieldPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(6.4, 6.4),
      new THREE.MeshBasicMaterial({
        map: fieldTex,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      }),
    );
    fieldPlane.rotation.x = -Math.PI / 2;
    fieldPlane.position.y = 0.02;
    scene.add(fieldPlane);
    const fieldRgba = fieldTex.image.data as Uint8Array;

    // --- RENDER LOOP: pure consumer of the shared transport tape ---
    // B-field angle and refusal arrive on bus frames from the registered
    // updater; this studio clock only paces mesh interpolation.
    let reqId: number;
    let fieldTimeSec = 0;
    const studioClock = createStudioClock();
    const transport = globalTransportBus.getTransport("us-381968-tesla-motor");

    const animate = (frameTimeMs: number) => {
      reqId = requestAnimationFrame(animate);
      const { dt: delta } = studioClock.pump(frameTimeMs);
      const p = live.current;
      const bFieldAngle = transport.lastFrame.telemetry.em?.phaseAngleRad ?? 0;
      const refused = transport.lastFrame.telemetry.refusal.isRefused;
      if (!refused) {
        fieldTimeSec += delta;
      }

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
        refused ? 0 : delta,
        p.fieldDisplayOmegaRadPerS,
        bFieldAngle,
        p.showMagneticFlux,
        fieldTimeSec,
      );

      bFieldArrow.visible = p.showMagneticFlux;
      fieldPlane.visible = p.showMagneticFlux;
      writeColormappedField(
        fieldRgba,
        computeTeslaRotatingBField(bFieldAngle, fieldGrid),
        fieldGrid,
        fieldGrid,
      );
      fieldTex.needsUpdate = true;

      controls.update();
      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      fig9Model.dispose();
      bFieldArrow.dispose();
      fieldTex.dispose();
      fieldPlane.geometry.dispose();
      (fieldPlane.material as THREE.MeshBasicMaterial).dispose();
      studio.dispose();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Nikola Tesla Electro-Magnetic Motor 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-9.5rem)] sm:max-w-[calc(100%-28rem)] gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
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

        {/* Top-Right Action Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <ClaimConstraintToggle
            patentId="us-381968-tesla-motor"
            claimStates={claimStates}
            onToggleClaim={(c, active) => setClaimStates((prev) => ({ ...prev, [c]: active }))}
          />
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
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-ink-600 dark:text-ink-400">Generator:</span>
                <span className="font-bold text-blue-700 dark:text-blue-400">
                  {generatorRpm} rpm
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-ink-600 dark:text-ink-400">
                  <HudText text="Disk D:" />
                </span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  {apparatus.diskRpm} rpm (source relation)
                </span>
              </div>
            </div>
            <div className="text-[10px] font-sans text-ink-500 dark:text-ink-400 pt-1 border-t border-parchment-200 dark:border-ink-800/80">
              Fig. 9 uses the generator's four collector rings and brushes; Fig. 15–16 is a distinct
              source variant that dispenses with sliding contacts. This visual is deliberately Fig.
              9 only.
            </div>
          </div>
        )}

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="source-bounded rotating-field motor"
          chips={[
            { label: "Crate", value: crateSource === "wasm" ? "fs-wasm" : "ts-ga-fallback" },
            { label: "Generator f", value: generatorFrequencyHz.toFixed(0), unit: "Hz" },
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
          <SensitivitySlider
            id="frequency"
            patentId="us-381968-tesla-motor"
            paramKey="frequency"
            label="Generator alternating-current frequency"
            value={generatorFrequencyHz}
            min={20}
            max={120}
            step={5}
            unit="Hz"
            onChange={(val) => updateParam("frequency", val)}
            allParams={params}
          />
        </div>

        <ClaimConstraintToggle
          patentId="us-381968-tesla-motor"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-381968-tesla-motor"
          params={params}
          className="mt-3"
        />
      </div>
    </div>
  );
}
