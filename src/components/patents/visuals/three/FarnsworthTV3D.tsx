"use client";

import { Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { FrankenSimEngine } from "@/physics/engine";
import { readFarnsworthTvControls, readFarnsworthTvTapeFrame } from "@/physics/farnsworthTvKernel";
import {
  computeFarnsworthRasterField,
  createColormappedFieldTexture,
  writeColormappedField,
} from "@/physics/fieldTextures";
import { ensureGenericWasm } from "@/physics/genericWasm";
import { usePatentRuntimeTick } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { buildFarnsworthTvModel, updateFarnsworthTvKinematics } from "./farnsworthTvModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { StudioOverlayActionToolbar } from "./StudioOverlayActionToolbar";
import { createSourceBoundStudioOverlayActions } from "./studioOverlayActions";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "photocathode" | "aperture" | "coils" | "electron_gun" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [7.8, 5.2, 9.1], target: [0, 0, 0] },
  photocathode: { pos: [-4, 0.5, 3], target: [-2.5, 0, 0] },
  aperture: { pos: [2.5, 1, 2], target: [2.0, 0, 0] },
  coils: { pos: [0, 3, 4], target: [0, 0, 0] },
  electron_gun: { pos: [4.5, 1, 2], target: [3.5, 0, 0] },
  top: { pos: [0, 9, 0.1], target: [0, 0, 0] },
};

function cameraPresetForViewport(
  preset: CameraPreset,
  viewportWidth: number,
): { pos: [number, number, number]; target: [number, number, number] } {
  const config = CAMERA_PRESETS[preset];
  if (viewportWidth >= 640) return config;

  const distanceMultiplier = preset === "iso" ? 2.15 : 1.55;
  return {
    pos: [
      config.target[0] + (config.pos[0] - config.target[0]) * distanceMultiplier,
      config.target[1] + (config.pos[1] - config.target[1]) * distanceMultiplier,
      config.target[2] + (config.pos[2] - config.target[2]) * distanceMultiplier,
    ],
    target: config.target,
  };
}

export function FarnsworthTV3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);

  // Dissector Tube State Controls
  const patentId = "us-1773980-farnsworth-tv";
  const { params, effectiveParams, updateParam } = usePatentPhysics(patentId);
  const runtimeTick = usePatentRuntimeTick(patentId, 6);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const anodeVoltageVolts = params.anodeVoltage ?? 1500;
  const coilCurrentA = params.coilCurrent ?? 0.42;
  const deflectionGauss = FrankenSimEngine.farnsworthDeflectionGauss(coilCurrentA);
  const lightIntensityLux = params.lightIntensityLux ?? 500;
  const [showElectronBeam, _setShowElectronBeam] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  useEffect(() => {
    void ensureGenericWasm();
  }, []);

  void runtimeTick;
  const tapeFrame = readFarnsworthTvTapeFrame(readFarnsworthTvControls(effectiveParams as any));
  const beamState = tapeFrame.beamState;
  const velocityMps = beamState.electronVelocityMps;
  const velocityFractionC = beamState.relativisticPct.toFixed(1);
  const photocathodeCurrentUa = beamState.photocathodeCurrentUa.toFixed(1);

  const live = useLiveSimParams({
    effectiveParams,
    showElectronBeam,
    isCutaway,
    isAudioMuted,
    velocityMps,
  });

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = cameraPresetForViewport(preset, containerRef.current?.clientWidth ?? 1000);
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

    const iso = cameraPresetForViewport("iso", container.clientWidth);
    const studio = createThreeStudioScene({
      container,
      cameraPos: iso.pos,
      targetPos: iso.target,
    });
    studioRef.current = studio;

    const { scene, renderer, controls } = studio;

    const model = buildFarnsworthTvModel();
    scene.add(model.root);

    const fieldGrid = 32;
    const fieldValues = new Float32Array(fieldGrid * fieldGrid);
    const initial = readFarnsworthTvTapeFrame(
      readFarnsworthTvControls(live.current.effectiveParams as any),
    );
    const initialScanFrame = initial.scanFrame;
    const fieldTex = createColormappedFieldTexture(
      computeFarnsworthRasterField(
        initialScanFrame.beamFraction,
        fieldGrid,
        fieldValues,
        initialScanFrame.rasterYPercent / 100,
      ),
      fieldGrid,
      fieldGrid,
    );
    const photocathodeField = new THREE.Mesh(
      new THREE.CircleGeometry(1.55, 64),
      new THREE.MeshBasicMaterial({
        map: fieldTex,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
      }),
    );
    photocathodeField.position.z = 0.02;
    model.photocathode.add(photocathodeField);
    const fieldRgba = fieldTex.image.data as Uint8Array;

    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const p = live.current;
      const current = readFarnsworthTvTapeFrame(readFarnsworthTvControls(p.effectiveParams as any));
      const { beamState: currentBeam, scanFrame } = current;

      updateFarnsworthTvKinematics(
        model,
        currentBeam,
        scanFrame,
        p.showElectronBeam && !scanFrame.inHorizontalRetrace,
        p.isCutaway,
      );

      writeColormappedField(
        fieldRgba,
        computeFarnsworthRasterField(
          scanFrame.beamFraction,
          fieldGrid,
          fieldValues,
          scanFrame.rasterYPercent / 100,
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
      photocathodeField.geometry.dispose();
      (photocathodeField.material as THREE.MeshBasicMaterial).dispose();
      model.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  useEffect(() => {
    const restoreResponsiveFraming = () => {
      const container = containerRef.current;
      if (!container) return;
      const config = cameraPresetForViewport(activeCamera, container.clientWidth);
      studioRef.current?.controls.setView(config.pos, config.target);
    };

    window.addEventListener("resize", restoreResponsiveFraming);
    return () => window.removeEventListener("resize", restoreResponsiveFraming);
  }, [activeCamera]);

  return (
    <div
      className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent"
      data-runtime-tick={runtimeTick}
      data-raster-line={tapeFrame.scanFrame.rasterLineIndex}
    >
      <div className="sr-only">Philo T. Farnsworth Image Dissector Tube 3D</div>
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
                ["photocathode", "Photocathode"],
                ["aperture", "Anode Aperture"],
                ["coils", "Deflection Coils"],
                ["electron_gun", "Electron Collector"],
                ["top", "Optical Axis"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => applyCameraPreset(id)}
                className={`min-h-9 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-sans whitespace-nowrap shrink-0 transition-colors ${
                  activeCamera === id
                    ? "bg-amber-700 dark:bg-amber-700 text-white font-semibold shadow-xs"
                    : "text-ink-700 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <StudioOverlayActionToolbar
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex gap-1.5 sm:gap-2"
          actions={createSourceBoundStudioOverlayActions({
            isCutaway,
            onToggleCutaway: () => setIsCutaway(!isCutaway),
            cutawayTitle: isCutaway ? "Switch to Solid Tube Mounts" : "Switch to Tube Cutaway",
            showUiOverlay,
            onToggleUiOverlay: () => setShowUiOverlay(!showUiOverlay),
            isAudioMuted,
            onToggleSound: toggleSound,
            audioAriaLabel: isAudioMuted ? "Unmute simulation audio" : "Mute simulation audio",
            audioTitle: isAudioMuted ? "Enable Sound Synthesis" : "Mute Sound",
            showCalloutPins,
            onToggleCalloutPins: () => setShowCalloutPins(!showCalloutPins),
            onResetCamera: () => applyCameraPreset("iso"),
          })}
        />

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                Electron Velocity:
              </span>
              <span className="font-bold text-cyan-700 dark:text-cyan-400">
                {(velocityMps / 1e6).toFixed(1)} Mm/s ({velocityFractionC}% c)
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Anode Voltage:</span>
              <span className="text-purple-800 dark:text-purple-400 font-bold">
                {anodeVoltageVolts} V
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Photocathode:</span>
              <span className="text-emerald-800 dark:text-emerald-400 font-bold">
                {photocathodeCurrentUa} µA
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Deflection Field:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {deflectionGauss.toFixed(1)} G ({coilCurrentA.toFixed(2)} A)
              </span>
            </div>
          </div>
        )}

        {/* Bottom SI Telemetry Chip Strip */}
        <StudioKernelChips
          side="right"
          visible={showUiOverlay}
          title="ELECTRON OPTICAL IMAGE DISSECTOR"
          chips={[
            {
              label: "v_electron",
              value: `${(velocityMps / 1e6).toFixed(1)}M`,
              unit: "m/s",
              tone: "hot",
            },
            { label: "Relativistic", value: `${velocityFractionC}% c` },
            { label: "V_anode", value: `${anodeVoltageVolts.toFixed(0)}`, unit: "V" },
            { label: "I_photo", value: `${photocathodeCurrentUa}`, unit: "µA" },
            {
              label: "B_deflect",
              value: `${deflectionGauss.toFixed(1)}`,
              unit: "Gauss",
            },
            { label: "Scanning", value: "All-Electronic Continuous Dissection" },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SensitivitySlider
            id="farnsworthAnodeVoltage"
            patentId="us-1773980-farnsworth-tv"
            paramKey="anodeVoltage"
            label="Anode Potential"
            value={anodeVoltageVolts}
            min={500}
            max={3000}
            step={50}
            unit=" V"
            onChange={(val) => updateParam("anodeVoltage", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="farnsworthCoilCurrent"
            patentId="us-1773980-farnsworth-tv"
            paramKey="coilCurrent"
            label="Deflection Coil Current"
            value={coilCurrentA}
            min={0.1}
            max={1.0}
            step={0.02}
            unit=" A"
            onChange={(val) => updateParam("coilCurrent", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="farnsworthLightIntensity"
            patentId="us-1773980-farnsworth-tv"
            paramKey="lightIntensityLux"
            label="Target Illumination"
            value={lightIntensityLux}
            min={50}
            max={2000}
            step={50}
            unit=" lux"
            onChange={(val) => updateParam("lightIntensityLux", val)}
            allParams={params}
          />
        </div>

        <ClaimConstraintToggle
          patentId="us-1773980-farnsworth-tv"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-1773980-farnsworth-tv"
          params={params}
          className="mt-3"
        />
      </div>
    </div>
  );
}
