"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { FrankenSimEngine } from "@/physics/engine";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { createStudioClock } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import {
  buildMaximMachineGunModel,
  type MaximMachineGunModel,
  updateMaximMachineGunKinematics,
} from "./maximMachineGunModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "toggle_lock" | "water_jacket" | "belt_feed" | "spade_grips" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [8.5, 5.5, 9.5], target: [0.5, 0.2, 0] },
  toggle_lock: { pos: [-0.8, 1.8, 2.6], target: [-0.6, 0.4, 0] },
  water_jacket: { pos: [2.2, 1.8, 3.2], target: [1.8, 0.4, 0] },
  belt_feed: { pos: [-0.3, 1.6, 2.4], target: [-0.3, 0.5, 0] },
  spade_grips: { pos: [-3.5, 1.2, 1.8], target: [-1.8, 0.4, 0] },
  top: { pos: [0.5, 11.5, 0.1], target: [0.5, 0.2, 0] },
};

export function MaximMachineGun3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  // Automatic Recoil Ballistics Parameters
  const { params, updateParam } = usePatentPhysics("us-319596-maxim-machine-gun");
  const fireRateRpm = (params.firingRate as number) ?? (params.fireRateRpm as number) ?? 600;
  const waterLevelLiters =
    (params.waterLevel as number) ?? (params.waterLevelLiters as number) ?? 4;
  const recoilStrokeMm = (params.recoilStroke as number) ?? (params.recoilStrokeMm as number) ?? 19;

  const maxim = FrankenSimEngine.stepMaximMachineGun({
    firingRateRpm: fireRateRpm,
    waterJacketLiters: waterLevelLiters,
    recoilStrokeMm,
  });
  const [showMuzzleFlash] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  const live = useLiveSimParams({
    fireRateRpm,
    showMuzzleFlash,
    isAudioMuted,
    isCutaway,
    recoilStudioStroke: maxim.recoilStudioStroke,
    barrelTempC: maxim.barrelTempC,
    waterEvapRateGs: maxim.waterEvapRateGs,
    recoilMomentumNs: maxim.recoilMomentumNs,
    fireOmegaRadPerS: maxim.fireOmegaRadPerS,
    steamOpacity: maxim.steamOpacity,
    fireCycleWrapRad: maxim.fireCycleWrapRad,
    muzzleFlashSinThreshold: maxim.muzzleFlashSinThreshold,
  });

  const studioRef = useRef<StudioContext | null>(null);
  const modelRef = useRef<MaximMachineGunModel | null>(null);

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

    // Build procedural 3D model
    const model = buildMaximMachineGunModel();
    modelRef.current = model;
    scene.add(model.rootGroup);

    // Dynamic Muzzle Flash PointLight
    const flashLight = new THREE.PointLight(0xf97316, 0, 7.0);
    flashLight.position.set(4.65, 0.45, 0);
    scene.add(flashLight);

    // Animation Loop
    let reqId: number;
    let timeSec = 0;
    let renderedSteps = 0;
    let lastAudioShot = 0;

    const clock = createStudioClock();

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      const { dt } = clock.pump(now);
      timeSec += dt;
      renderedSteps += 1;
      const p = live.current;

      const { isMuzzleFlash } = updateMaximMachineGunKinematics(
        model,
        dt,
        timeSec,
        p.fireOmegaRadPerS,
        p.recoilStudioStroke,
        p.barrelTempC,
        p.steamOpacity,
        p.showMuzzleFlash,
        p.isCutaway,
        p.fireCycleWrapRad,
        p.muzzleFlashSinThreshold,
        p.fireRateRpm,
      );

      flashLight.intensity = isMuzzleFlash ? 4.8 : 0;

      // Sound transducer trigger
      if (isMuzzleFlash && Math.floor(renderedSteps / 6) !== lastAudioShot) {
        lastAudioShot = Math.floor(renderedSteps / 6);
        if (!p.isAudioMuted) {
          soundEngine.playGunshot();
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      model.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Maxim Machine Gun 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {/* Camera Preset Toolbar & Claim Inversion Toggle */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-col gap-2 max-w-[calc(100%-14rem)] sm:max-w-[calc(100%-28rem)] pointer-events-auto">
            <ClaimConstraintToggle
              patentId="us-319596-maxim-machine-gun"
              claimStates={claimStates}
              onToggleClaim={(num, active) =>
                setClaimStates((prev) => ({ ...prev, [num]: active }))
              }
            />
            <div className="flex flex-nowrap overflow-x-auto scrollbar-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
              <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
                <Camera className="w-3.5 h-3.5" /> View:
              </span>
              {(
                [
                  ["iso", "Isometric"],
                  ["toggle_lock", "Toggle Lock"],
                  ["water_jacket", "Water Jacket"],
                  ["belt_feed", "Belt Feed"],
                  ["spade_grips", "Spade Grips"],
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
          </div>
        )}

        {/* Top Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Solid Receiver" : "Cutaway Interior"}
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
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
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
                Cyclic Rate:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {Math.round(fireRateRpm)} rds/min
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Recoil Stroke:</span>
              <span className="font-bold text-cyan-800 dark:text-cyan-400">
                {maxim.recoilStrokeMm} mm
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Toggle Unlock Force:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {maxim.toggleUnlockForceN} N
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Barrel Temp:</span>
              <span
                className={`font-bold ${maxim.barrelTempC > 200 ? "text-rose-700 dark:text-rose-400" : "text-purple-800 dark:text-purple-400"}`}
              >
                {maxim.barrelTempC} °C
              </span>
            </div>
          </div>
        )}

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="Maxim recoil ballistics"
          chips={[
            { label: "Cyclic Rate", value: String(Math.round(fireRateRpm)), unit: "rds/min" },
            { label: "Recoil Stroke", value: String(Math.round(maxim.recoilStrokeMm)), unit: "mm" },
            { label: "Toggle Unlock", value: String(maxim.toggleUnlockForceN), unit: "N" },
            { label: "Recoil p", value: String(maxim.recoilMomentumNs), unit: "N·s" },
            {
              label: "Barrel Temp",
              value: String(maxim.barrelTempC),
              unit: "°C",
              tone: maxim.barrelTempC > 200 ? "warn" : "ok",
            },
            { label: "Steam Evap", value: String(maxim.waterEvapRateGs), unit: "g/s" },
            { label: "Muzzle Energy", value: String(maxim.muzzleEnergyJoules), unit: "J" },
            { label: "ω_fire", value: maxim.fireOmegaRadPerS.toFixed(1), unit: "rad/s" },
            {
              label: "Steam crate",
              value: crateSource === "wasm" ? "fs-sparse" : "ts-heat-fallback",
            },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SensitivitySlider
            id="firingRate"
            patentId="us-319596-maxim-machine-gun"
            paramKey="firingRateRpm"
            label="Cyclic Firing Rate"
            value={fireRateRpm}
            min={300}
            max={750}
            step={25}
            onChange={(val) => updateParam("firingRate", val)}
            allParams={params}
          />

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Water Jacket Fill</span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {waterLevelLiters.toFixed(1)} L
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="4.0"
              step="0.2"
              value={waterLevelLiters}
              onChange={(e) => updateParam("waterLevel", Number.parseFloat(e.target.value))}
              className="w-full accent-cyan-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <SensitivitySlider
            id="recoilStroke"
            patentId="us-319596-maxim-machine-gun"
            paramKey="recoilTravelMm"
            label="Short-Recoil Stroke"
            value={recoilStrokeMm}
            min={12}
            max={25}
            step={1}
            onChange={(val) => updateParam("recoilStroke", val)}
            allParams={params}
          />
        </div>

        <ClaimConstraintToggle
          patentId="us-319596-maxim-machine-gun"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-319596-maxim-machine-gun"
          params={params}
          className="mt-3"
        />
      </div>
    </div>
  );
}
