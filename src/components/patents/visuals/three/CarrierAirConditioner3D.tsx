"use client";

import { Camera, Eye, EyeOff, RotateCcw, Volume2, VolumeX, Waves } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { FrankenSimEngine } from "@/physics/engine";
import {
  computeCarrierSprayField,
  createColormappedFieldTexture,
  writeColormappedField,
} from "@/physics/fieldTextures";
import { createStudioClock } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import {
  buildCarrierAirConditionerModel,
  updateCarrierAirConditionerKinematics,
} from "./carrierAirConditionerModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset =
  | "iso"
  | "spray_chamber"
  | "baffle_plates"
  | "blower_fan"
  | "pump_sump"
  | "dampers";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [9.5, 6.5, 10.5], target: [0, 0, 0] },
  spray_chamber: { pos: [-2.2, 1.8, 3.2], target: [-1.8, 0.4, 0] },
  baffle_plates: { pos: [1.2, 1.8, 2.8], target: [0.6, 0.4, 0] },
  blower_fan: { pos: [4.2, 1.8, 3.5], target: [3.2, 0.4, 0] },
  pump_sump: { pos: [-2.4, -0.6, 3.5], target: [-1.8, -1.1, 0.8] },
  dampers: { pos: [-5.5, 1.5, 2.5], target: [-4.0, 0.4, 0] },
};

export function CarrierAirConditioner3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [cutawayMode, setCutawayMode] = useState<boolean>(true);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  // Psychrometric Air Treatment Parameters from Physics Bus
  const { params, updateParam } = usePatentPhysics("us-808897-carrier-air-conditioner");
  const airflowCfm = params.airflowCfm ?? 15000;
  const sprayWaterTempC = params.sprayWaterTempC ?? 8;
  const inletRhPct = params.inletRhPct ?? 75;
  const [showSprayMist, setShowSprayMist] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const carrier = FrankenSimEngine.stepCarrierAirConditioner({
    inletTempC: params.inletTempC ?? 35,
    inletRhPct,
    sprayWaterTempC,
    reheatTempC: params.reheatTempC ?? 22,
    airflowCfm,
  });

  const live = useLiveSimParams({
    airflowCfm,
    sprayWaterTempC,
    showSprayMist,
    cutawayMode,
    isAudioMuted,
    dewPointInC: carrier.dewPointInC,
    moistureRemovedGPerKg: carrier.moistureRemovedGPerKg,
    finalAirTempC: carrier.finalAirTempC,
    finalRhPct: carrier.finalRhPct,
  });

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

    const { root, nodes, materials, dispose } = buildCarrierAirConditionerModel();
    scene.add(root);

    const fieldGrid = 32;
    const fieldTex = createColormappedFieldTexture(
      computeCarrierSprayField(15000, fieldGrid),
      fieldGrid,
      fieldGrid,
    );
    const fieldPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(4.2, 2.4),
      new THREE.MeshBasicMaterial({
        map: fieldTex,
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
      }),
    );
    fieldPlane.rotation.x = -Math.PI / 2;
    fieldPlane.position.set(-1.6, -0.2, 0);
    scene.add(fieldPlane);
    const fieldRgba = fieldTex.image.data as Uint8Array;

    let reqId: number;
    const clock = createStudioClock();

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      const { dt: delta } = clock.pump(now);
      const p = live.current;

      updateCarrierAirConditionerKinematics(
        nodes,
        materials,
        delta,
        p.airflowCfm,
        p.sprayWaterTempC,
        p.cutawayMode,
        p.showSprayMist,
      );

      writeColormappedField(
        fieldRgba,
        computeCarrierSprayField(p.airflowCfm ?? 15000, fieldGrid),
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
      dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Carrier Psychrometric Dew-Point 3D</div>
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
                ["iso", "Overview"],
                ["spray_chamber", "Spray Chamber"],
                ["baffle_plates", "Eliminator Baffles"],
                ["blower_fan", "Centrifugal Fan"],
                ["pump_sump", "Pump & Sump"],
                ["dampers", "Dampers"],
              ] as [CameraPreset, string][]
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyCameraPreset(preset)}
                className={`px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
                  activeCamera === preset
                    ? "bg-cyan-600 text-white shadow-xs font-semibold"
                    : "text-ink-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Top-Right Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 max-w-[90%] pointer-events-auto">
          <ClaimConstraintToggle
            patentId="us-808897-carrier-air-conditioner"
            claimStates={claimStates}
            onToggleClaim={(c: number, active: boolean) => {
              setClaimStates((prev) => ({ ...prev, [c]: active }));
              updateParam("sprayWaterTempC", active ? 8.0 : 28.0);
            }}
          />
          <button
            type="button"
            onClick={() => setCutawayMode(!cutawayMode)}
            title={cutawayMode ? "Switch to Solid Shell" : "Switch to Cutaway View"}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm text-xs font-sans flex items-center gap-1 ${
              cutawayMode
                ? "bg-cyan-600 text-white border-cyan-700 shadow-md ring-2 ring-cyan-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            {cutawayMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span className="hidden sm:inline">{cutawayMode ? "Cutaway" : "Solid"}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowSprayMist(!showSprayMist)}
            title={showSprayMist ? "Hide Atomized Mist" : "Show Atomized Mist"}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showSprayMist
                ? "bg-cyan-600 text-white border-cyan-700 shadow-md ring-2 ring-cyan-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            <Waves className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            aria-label={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
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
                : "bg-cyan-600 text-white border-cyan-700 shadow-md ring-2 ring-cyan-500/30"
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
                Dew Point Temp:
              </span>
              <span className="font-bold text-cyan-700 dark:text-cyan-400">
                {carrier.dewPointInC.toFixed(1)} °C
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Spray Water Temp:</span>
              <span className="text-emerald-800 dark:text-emerald-400 font-bold">
                {sprayWaterTempC.toFixed(1)} °C
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Final Humidity:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {carrier.finalRhPct}% RH
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Moisture Removed:</span>
              <span className="text-purple-800 dark:text-purple-400 font-bold">
                {carrier.moistureRemovedGPerKg.toFixed(1)} g/kg
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SensitivitySlider
            id="carrierAirflow"
            patentId="us-808897-carrier-air-conditioner"
            paramKey="airFlowCfm"
            label="Centrifugal Airflow"
            value={airflowCfm}
            min={5000}
            max={30000}
            step={1000}
            unit="CFM"
            onChange={(val) => updateParam("airflowCfm", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="carrierWaterTemp"
            patentId="us-808897-carrier-air-conditioner"
            paramKey="dewPointTempC"
            label="Atomizing Water Temp"
            value={sprayWaterTempC}
            min={2}
            max={20}
            step={0.5}
            unit="°C"
            onChange={(val) => updateParam("sprayWaterTempC", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="carrierInletRh"
            patentId="us-808897-carrier-air-conditioner"
            paramKey="inletRhPct"
            label="Inlet Relative Humidity"
            value={inletRhPct}
            min={30}
            max={95}
            step={5}
            unit="%"
            onChange={(val) => updateParam("inletRhPct", val)}
            allParams={params}
          />
        </div>

        <PortHamiltonianEnergyStrip
          patentId="us-808897-carrier-air-conditioner"
          params={params}
          className="mt-3"
        />
      </div>

      <StudioKernelChips
        visible={showUiOverlay}
        title="Carrier Psychrometric Apparatus"
        chips={[
          { label: "Airflow", value: `${airflowCfm.toLocaleString()} CFM` },
          { label: "Spray Water", value: `${sprayWaterTempC.toFixed(1)} °C` },
          { label: "Inlet Dew Point", value: `${carrier.dewPointInC.toFixed(1)} °C` },
          { label: "Final Temp", value: `${carrier.finalAirTempC.toFixed(1)} °C` },
          { label: "Final RH", value: `${carrier.finalRhPct}%` },
          {
            label: "Moisture Extr.",
            value: `${carrier.moistureRemovedGPerKg.toFixed(1)} g/kg`,
          },
        ]}
      />
    </div>
  );
}
