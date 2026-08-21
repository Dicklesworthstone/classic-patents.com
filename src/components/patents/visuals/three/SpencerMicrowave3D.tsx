import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { voltsToKv } from "@/physics/catalogKernels";
import { FrankenSimEngine } from "@/physics/engine";
import {
  computeSpencerCavityField,
  createColormappedFieldTexture,
  writeColormappedField,
} from "@/physics/fieldTextures";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import {
  buildSpencerMicrowaveModel,
  updateSpencerMicrowaveKinematics,
} from "./spencerMicrowaveModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset =
  | "iso"
  | "cavity_resonator"
  | "electron_spokes"
  | "waveguide_launch"
  | "strapping_rings"
  | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [8, 6, 9], target: [0, 0, 0] },
  cavity_resonator: { pos: [0, 2.5, 3.5], target: [0, 0, 0] },
  electron_spokes: { pos: [0, 4.5, 0.1], target: [0, 0, 0] },
  waveguide_launch: { pos: [2.5, 1.8, 3.0], target: [1.2, 0, 0] },
  strapping_rings: { pos: [0, 1.2, 2.5], target: [0, 0, 0] },
  top: { pos: [0, 10.0, 0.1], target: [0, 0, 0] },
};

export function SpencerMicrowave3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);

  // Magnetron & Cavity Resonator State
  const { params, updateParam } = usePatentPhysics("us-2495429-spencer-microwave");
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const anodeVoltageVolts = params.anodeVoltage ?? 2200;
  const anodeVoltageKv = voltsToKv(anodeVoltageVolts);
  const magneticFieldGauss = params.magneticFieldGauss ?? 1450;
  const rfPowerWatts = params.rfPowerSetting ?? 800;
  const [showSpokeWheel, _setShowSpokeWheel] = useState<boolean>(true);
  const [showWaterDipoles, _setShowWaterDipoles] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  // RF Cavity Physics Calculations (FrankenSim Hull Cutoff & Microwave Emission)
  const rfPhysics = FrankenSimEngine.stepSpencerMicrowave(
    anodeVoltageKv,
    magneticFieldGauss,
    rfPowerWatts,
  );

  useFrankenSimPhysics("us-2495429-spencer-microwave", {
    domain: "electromagnetics_flux",
    timestampMs: 0,
    timeStepDt: 0.016,
    refusal: { isRefused: false },
    em: {
      frequencyHz: rfPhysics.microwaveFreqHz,
      magneticFluxDensityTesla: rfPhysics.magneticFluxDensityTesla,
      electricFieldVpm: rfPhysics.electricFieldVpm,
      phaseAngleRad: 0,
      inductanceHenry: 0,
      capacitanceFarad: 0,
      currentAmperes: 0,
      voltageVolts: rfPhysics.voltageVolts,
      powerFactor: 0,
      efficiencyPct: 0,
      synchronousRpm: 0,
      slipFraction: 0,
      rotorRpm: 0,
      shaftPowerWatts: 0,
      electricalInputWatts: 0,
    },
  });
  const hullCutoffGauss = rfPhysics.hullCutoffGauss;
  const isOscillating = rfPhysics.isOscillating;
  const waterDielectricLossDensity = rfPhysics.dielectricLossWattsPerDm3.toFixed(1);

  const live = useLiveSimParams({
    anodeVoltageKv,
    magneticFieldGauss,
    isOscillating,
    showSpokeWheel,
    showWaterDipoles,
    isCutaway,
    isAudioMuted,
    rfPowerWatts,
    spokeDisplayOmegaRadPerS: rfPhysics.spokeDisplayOmegaRadPerS,
  });

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  useEffect(() => {
    void ensureGenericWasm().then((next) => setCrateSource(next));
  }, []);

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

    const { scene, renderer, controls } = studio;

    const model = buildSpencerMicrowaveModel();
    scene.add(model.root);

    const fieldGrid = 32;
    const fieldTex = createColormappedFieldTexture(
      computeSpencerCavityField(800, true, 0, fieldGrid),
      fieldGrid,
      fieldGrid,
    );
    const fieldPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(3.2, 3.2),
      new THREE.MeshBasicMaterial({
        map: fieldTex,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
      }),
    );
    fieldPlane.rotation.x = -Math.PI / 2;
    fieldPlane.position.y = 0.04;
    scene.add(fieldPlane);
    const fieldRgba = fieldTex.image.data as Uint8Array;

    let audioTick = 0;
    let reqId: number;
    const clock = createStudioClock();

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      const { dt, simTimeSec } = clock.pump(now);
      const p = live.current;

      updateSpencerMicrowaveKinematics(
        model,
        dt,
        p.isOscillating,
        p.spokeDisplayOmegaRadPerS,
        0.85,
        p.showSpokeWheel,
        p.isCutaway,
      );

      if (!p.isAudioMuted && p.isOscillating) {
        audioTick += 1;
        soundEngine.playFieldTransducer({
          kind: "rf",
          sample: Math.min(1, (p.spokeDisplayOmegaRadPerS ?? 0) / 4.5),
          carrierHz: 90,
        });
        if (audioTick % 30 === 0) {
          soundEngine.playSparkDischarge(0.15);
        }
      } else if (p.isAudioMuted) {
        soundEngine.stopContinuousTone();
      }

      writeColormappedField(
        fieldRgba,
        computeSpencerCavityField(
          p.rfPowerWatts ?? 800,
          Boolean(p.isOscillating),
          simTimeSec,
          fieldGrid,
        ),
        fieldGrid,
        fieldGrid,
      );
      fieldTex.needsUpdate = true;

      controls.update();
      renderer.render(scene, studio.camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      fieldTex.dispose();
      fieldPlane.geometry.dispose();
      (fieldPlane.material as THREE.MeshBasicMaterial).dispose();
      model.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <PortHamiltonianEnergyStrip
        patentId="us-2495429-spencer-microwave"
        params={{
          rfPowerWatts,
          anodeVoltage: anodeVoltageVolts,
        }}
      />
      <div className="sr-only">Percy L. Spencer Microwave Cavity Magnetron 3D</div>
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
                ["cavity_resonator", "Cavity"],
                ["electron_spokes", "Spokes"],
                ["waveguide_launch", "Waveguide"],
                ["strapping_rings", "Strapping Rings"],
                ["top", "Interaction Space"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => applyCameraPreset(id)}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-sans whitespace-nowrap shrink-0 transition-colors ${
                  activeCamera === id
                    ? "bg-amber-700 dark:bg-amber-600 text-white font-semibold shadow-xs"
                    : "text-ink-700 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Top Right Tool Bar */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 max-w-[90%] pointer-events-auto">
          <ClaimConstraintToggle
            patentId="us-2495429-spencer-microwave"
            claimStates={claimStates}
            onToggleClaim={(c: number, active: boolean) => {
              setClaimStates((prev) => ({ ...prev, [c]: active }));
              updateParam("rfPowerSetting", active ? 800 : 0);
            }}
          />
          <button
            type="button"
            onClick={() => {
              setIsCutaway(!isCutaway);
              soundEngine.playSwitchClick();
            }}
            title={isCutaway ? "Switch to Solid Magnetron" : "Switch to Magnetron Cutaway"}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              isCutaway
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            aria-label="Toggle audio hum"
            type="button"
            onClick={() => {
              toggleSound();
              soundEngine.playSwitchClick();
            }}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            )}
          </button>
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
            onClick={() => {
              setShowCalloutPins(!showCalloutPins);
              soundEngine.playSwitchClick();
            }}
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
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                RF Frequency:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {rfPhysics.microwaveFreqMhz.toLocaleString()} MHz (λ = {rfPhysics.wavelengthCm} cm)
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">RF Output:</span>
              <span className="text-purple-800 dark:text-purple-400 font-bold">
                {rfPowerWatts} W CW
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Hull Cutoff:</span>
              <span className="text-emerald-800 dark:text-emerald-400 font-bold">
                {hullCutoffGauss} G ({magneticFieldGauss} G Active)
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Dielectric Loss:</span>
              <span className="text-cyan-800 dark:text-cyan-400 font-bold">
                {waterDielectricLossDensity} W/dm³
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SensitivitySlider
            id="anodeVoltage"
            patentId="us-2495429-spencer-microwave"
            paramKey="anodeVoltage"
            label="Anode Potential"
            value={anodeVoltageVolts}
            min={1000}
            max={4000}
            step={50}
            unit="V"
            onChange={(val: number) => updateParam("anodeVoltage", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="magneticField"
            patentId="us-2495429-spencer-microwave"
            paramKey="magneticFieldGauss"
            label="Axial Magnetic Field"
            value={magneticFieldGauss}
            min={800}
            max={2500}
            step={25}
            unit="G"
            onChange={(val: number) => updateParam("magneticFieldGauss", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="rfPower"
            patentId="us-2495429-spencer-microwave"
            paramKey="rfPowerSetting"
            label="RF Power Rating"
            value={rfPowerWatts}
            min={200}
            max={1500}
            step={50}
            unit="W"
            onChange={(val: number) => updateParam("rfPowerSetting", val)}
            allParams={params}
          />
        </div>

        <PortHamiltonianEnergyStrip
          patentId="us-2495429-spencer-microwave"
          params={params}
          className="mt-3"
        />
      </div>

      <StudioKernelChips
        visible={showUiOverlay}
        title="Spencer cavity magnetron"
        chips={[
          { label: "Anode", value: String(anodeVoltageKv), unit: "kV" },
          { label: "B", value: String(magneticFieldGauss), unit: "G" },
          { label: "RF", value: String(rfPowerWatts), unit: "W" },
          { label: "f", value: String(rfPhysics.microwaveFreqMhz), unit: "MHz" },
          {
            label: "Spoke crate",
            value: crateSource === "wasm" ? "fs-sparse" : "ts-heat-fallback",
          },
        ]}
      />
    </div>
  );
}
