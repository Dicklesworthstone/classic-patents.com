"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { stepEdisonBulb } from "@/physics/catalogKernels";
import {
  computeEdisonFilamentThermalField,
  createColormappedFieldTexture,
  writeColormappedField,
} from "@/physics/fieldTextures";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { TickScheduler } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { buildEdisonBulbModel, updateEdisonBulbKinematics } from "./edisonBulbModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset =
  | "iso"
  | "filament_horseshoe"
  | "screw_base"
  | "exhaust_tip"
  | "glass_stem"
  | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [11, 7, 14], target: [0, 0, 0] },
  filament_horseshoe: { pos: [0, 2.5, 4.2], target: [0, 1.2, 0] },
  screw_base: { pos: [0, -2.2, 3.8], target: [0, -2.8, 0] },
  exhaust_tip: { pos: [0, 4.8, 2.6], target: [0, 3.8, 0] },
  glass_stem: { pos: [0, 0.5, 3.2], target: [0, -0.6, 0] },
  top: { pos: [0, 10.5, 0.1], target: [0, 0, 0] },
};

export const EdisonBulb3D = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // Electrical & Thermal Simulation State
  const { params, updateParam } = usePatentPhysics("us-223898-edison-lightbulb");
  const appliedVoltage = params.voltage ?? 110;
  const filamentLengthCm = params.filamentLength ?? 22;
  const vacuumTorr = params.vacuumTorr ?? 1e-6;
  const [showGasMolecules] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [crateSource, setCrateSource] = useState(genericKernelSource());
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const bulb = stepEdisonBulb({
    voltage: appliedVoltage,
    filamentLength: filamentLengthCm,
  });

  const live = useLiveSimParams({
    appliedVoltage,
    filamentTempKelvin: bulb.filamentTempK,
    showGasMolecules,
    vacuumTorr,
    isCutaway,
    isAudioMuted,
    incandescenceIntensity: bulb.incandescenceIntensity,
    thermalJitterPerS: bulb.thermalJitterPerS,
    filamentEmissiveScale: bulb.filamentEmissiveScale,
    bulbLightScale: bulb.bulbLightScale,
    claim1Active: claimStates[1] === false ? 0 : 1,
  });

  const studioRef = useRef<StudioContext | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const toggleSound = () => {
    toggleEngine(() => {
      soundEngine.playSwitchClick();
    });
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

    const { scene, camera, renderer, controls } = studio;

    const model = buildEdisonBulbModel();
    scene.add(model.rootGroup);

    const fieldGrid = 32;
    const fieldTex = createColormappedFieldTexture(
      computeEdisonFilamentThermalField(2200, 110, 1e-4, fieldGrid),
      fieldGrid,
      fieldGrid,
    );
    const fieldPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(3.2, 3.2),
      new THREE.MeshBasicMaterial({
        map: fieldTex,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    fieldPlane.position.set(0, 1.2, 0);
    scene.add(fieldPlane);
    const fieldRgba = fieldTex.image.data as Uint8Array;

    let reqId: number;
    let timeSec = 0;
    const sched = new TickScheduler(1 / 60, 0);
    let lastMs: number | undefined;

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      const delta = lastMs !== undefined ? Math.min((now - lastMs) / 1000, 0.1) : 0;
      lastMs = now;
      const p = live.current;
      const refused = (p.claim1Active ?? 1) < 0.5;
      if (!refused) {
        sched.pump(now / 1000, () => {
          timeSec += 1 / 60;
        });
      }

      updateEdisonBulbKinematics(
        model,
        refused ? 0 : delta,
        timeSec,
        p.incandescenceIntensity,
        p.filamentTempKelvin,
        p.thermalJitterPerS,
        p.filamentEmissiveScale,
        p.bulbLightScale,
        p.vacuumTorr,
        p.showGasMolecules,
        p.isCutaway,
        p.appliedVoltage,
      );

      writeColormappedField(
        fieldRgba,
        computeEdisonFilamentThermalField(
          p.filamentTempKelvin ?? 2200,
          p.appliedVoltage ?? 110,
          p.vacuumTorr ?? 1e-4,
          fieldGrid,
        ),
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
      <div className="sr-only">Thomas Edison Incandescent Bulb 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-9.5rem)] sm:max-w-[calc(100%-28rem)] gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3.5 h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["filament_horseshoe", "Horseshoe Filament"],
                ["screw_base", "Edison Screw Base"],
                ["exhaust_tip", "Exhaust Seal Tip"],
                ["glass_stem", "Lead-in Stem"],
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

        {/* Top Right Tool Bar */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <ClaimConstraintToggle
            patentId="us-223898-edison-lamp"
            claimStates={claimStates}
            onToggleClaim={(c, active) => setClaimStates((prev) => ({ ...prev, [c]: active }))}
          />
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Solid Envelope" : "Cutaway Chamber"}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm text-xs font-sans flex items-center gap-1 ${
              isCutaway
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">{isCutaway ? "Cutaway" : "Solid"}</span>
          </button>

          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Hum" : "Mute Hum"}
            aria-label={isAudioMuted ? "Unmute Hum" : "Mute Hum"}
            className="p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showUiOverlay
                ? "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
                : "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
            }`}
            title={showUiOverlay ? "Hide Overlay UI (Clean 3D View)" : "Show Overlay UI"}
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

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                Filament Temp:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {bulb.filamentTempK.toFixed(0)} K
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Hot Resistance:</span>
              <span className="font-bold text-cyan-800 dark:text-cyan-400">
                {bulb.hotResistanceOhm.toFixed(1)} Ω
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Radiant Output:</span>
              <span className="font-bold text-emerald-800 dark:text-emerald-400">
                {bulb.radiantWatts.toFixed(1)} W
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Luminous Efficacy:</span>
              <span className="text-purple-800 dark:text-purple-400 font-bold">
                {bulb.luminousLmPerW.toFixed(2)} lm/W
              </span>
            </div>
          </div>
        )}

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="Edison high-resistance incandescent lamp"
          chips={[
            { label: "Voltage", value: `${appliedVoltage}`, unit: "V" },
            { label: "Filament Temp", value: `${bulb.filamentTempK.toFixed(0)}`, unit: "K" },
            { label: "Hot Resistance", value: `${bulb.hotResistanceOhm.toFixed(1)}`, unit: "Ω" },
            { label: "Current", value: `${bulb.currentAmps.toFixed(2)}`, unit: "A" },
            { label: "Radiant Power", value: `${bulb.radiantWatts.toFixed(1)}`, unit: "W" },
            {
              label: "Luminous Efficacy",
              value: `${bulb.luminousLmPerW.toFixed(2)}`,
              unit: "lm/W",
            },
            { label: "Design Life", value: `${bulb.designLifeHours}`, unit: "hrs" },
            { label: "Vacuum Level", value: vacuumTorr.toExponential(1), unit: "Torr" },
            {
              label: "Heat crate",
              value: crateSource === "wasm" ? "fs-sparse" : "ts-heat-fallback",
            },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <SensitivitySlider
            id="voltage"
            patentId="us-223898-edison-lamp"
            paramKey="mainsVoltageV"
            label="Applied Terminal Voltage"
            value={appliedVoltage}
            min={40}
            max={130}
            step={1}
            unit="V"
            onChange={(val) => updateParam("voltage", val)}
            allParams={params}
          />

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Carbon Filament Length
              </span>
              <span className="text-purple-700 dark:text-purple-400 font-mono font-bold">
                {filamentLengthCm} cm
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="30"
              step="1"
              value={filamentLengthCm}
              onChange={(e) => updateParam("filamentLength", Number.parseInt(e.target.value, 10))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-purple-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>
        </div>

        <PortHamiltonianEnergyStrip
          patentId="us-223898-edison-lamp"
          params={params}
          className="mt-3"
        />
      </div>
    </div>
  );
});
