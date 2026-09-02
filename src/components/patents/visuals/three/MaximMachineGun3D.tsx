"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { FrankenSimEngine } from "@/physics/engine";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
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

type CameraPreset =
  | "iso"
  | "muzzle_sleeve"
  | "reversing_linkage"
  | "breech_crosshead"
  | "volute_spring"
  | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [2.5, 1.8, 2.5], target: [0, 0, 0.4] },
  muzzle_sleeve: { pos: [0.8, 0.5, 1.6], target: [0, 0.1, 0.9] },
  reversing_linkage: { pos: [1.1, 0.5, 0.7], target: [0, 0.08, 0.5] },
  breech_crosshead: { pos: [-0.6, 0.6, -0.2], target: [0, 0.1, -0.1] },
  volute_spring: { pos: [0.8, 0.5, -0.3], target: [0.1, 0.1, -0.2] },
  top: { pos: [0, 3.5, 0.4], target: [0, 0, 0.4] },
};

export function MaximMachineGun3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  const { params, updateParam, resetParams } = usePatentPhysics("us-319596-maxim-machine-gun");
  const gasImpulsePct = (params.gasImpulsePct as number) ?? 75;
  const cyclePhaseDeg = (params.cyclePhase as number) ?? 0;

  const maxim = FrankenSimEngine.stepMaximMachineGun({
    cyclePhaseDeg,
    gasImpulsePct,
    cycleRpm: 60,
  });

  useFrankenSimPhysics("us-319596-maxim-machine-gun", {
    domain: "solid_mechanics",
    refusal: { isRefused: false },
    machine: {
      poseXMeters: 0,
      poseYMeters: 0,
      headingRad: 0,
      modeLabel: "muzzle-gas-sleeve",
      wheelSpeedMps: 0,
    },
  });

  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  const live = useLiveSimParams({
    isAudioMuted,
    isCutaway,
    gasImpulsePct,
    sleeveForwardMm: maxim.sleeveForwardMm,
    breechOpenMm: maxim.breechOpenMm,
    fireOmegaRadPerS: maxim.fireOmegaRadPerS,
    fireCycleWrapRad: maxim.fireCycleWrapRad,
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

    const model = buildMaximMachineGunModel();
    modelRef.current = model;
    scene.add(model.rootGroup);

    const flashLight = new THREE.PointLight(0xf97316, 0, 5.0);
    flashLight.position.set(0, 0.1, 1.25);
    scene.add(flashLight);

    let reqId: number;
    let timeSec = 0;
    const clock = createStudioClock();

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      const { dt } = clock.pump(now);
      timeSec += dt;

      const p = live.current;
      const cyclePhase = (timeSec * p.fireOmegaRadPerS) % p.fireCycleWrapRad;

      const { isMuzzleFlash } = updateMaximMachineGunKinematics(
        model,
        dt,
        cyclePhase,
        p.fireOmegaRadPerS,
        p.gasImpulsePct,
        true,
        p.isCutaway,
      );

      flashLight.intensity = isMuzzleFlash ? 4.5 : 0;
      controls.update();
      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      scene.remove(model.rootGroup);
      scene.remove(flashLight);
      flashLight.dispose();
      model.dispose();
      studio.dispose();
      studioRef.current = null;
      modelRef.current = null;
    };
  }, [live]);

  return (
    <div
      className="relative w-full aspect-[4/3] sm:aspect-[16/9] max-h-[640px] bg-parchment-900 rounded-2xl overflow-hidden border border-parchment-700 shadow-2xl select-none"
    >
      <div ref={containerRef} className="absolute inset-0" />
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="bg-ink-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-parchment-800/50 shadow-lg flex items-center gap-2.5">
          <Layers className="w-4 h-4 text-amber-500" />
          <span className="font-serif text-xs font-semibold tracking-wide text-parchment-100">
            Maxim Machine Gun 3D (US 319,596)
          </span>
          <StudioKernelChips
            chips={[
              { label: "Kernel", value: crateSource },
              { label: "Topology", value: "Fixed Barrel / Sleeve" },
            ]}
          />
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-ink-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-800/50 shadow-lg">
        <button
          type="button"
          onClick={() => {
            setIsCutaway(!isCutaway);
            soundEngine.playSwitchClick();
          }}
          aria-label={isCutaway ? "Disable Mechanism Cutaway" : "Enable Mechanism Cutaway"}
          className={`px-2.5 py-1 rounded-lg text-xs font-sans transition-all flex items-center gap-1 ${
            isCutaway
              ? "bg-amber-600 text-parchment-900 font-bold shadow-sm"
              : "text-parchment-300 hover:text-parchment-100 hover:bg-parchment-800/40"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Cutaway</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setShowUiOverlay(!showUiOverlay);
            soundEngine.playSwitchClick();
          }}
          aria-label={showUiOverlay ? "Hide Telemetry Overlay" : "Show Telemetry Overlay"}
          className="p-1.5 rounded-lg text-parchment-400 hover:text-parchment-100 hover:bg-parchment-800/40 transition-colors"
        >
          {showUiOverlay ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={toggleSound}
          aria-label={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
          className="p-1.5 rounded-lg text-parchment-400 hover:text-parchment-100 hover:bg-parchment-800/40 transition-colors"
        >
          {isAudioMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4 text-amber-400" />
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            resetParams();
            applyCameraPreset("iso");
            soundEngine.playSwitchClick();
          }}
          aria-label="Reset Camera and Controls"
          className="p-1.5 rounded-lg text-parchment-400 hover:text-parchment-100 hover:bg-parchment-800/40 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-1 bg-ink-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-800/50 shadow-lg">
        <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-0.5" />
        {(
          [
            ["iso", "ISO"],
            ["muzzle_sleeve", "Muzzle Sleeve"],
            ["reversing_linkage", "Rocker Linkage"],
            ["breech_crosshead", "Crosshead / Breech"],
            ["volute_spring", "Volute Spring"],
            ["top", "Plan (Fig. 2)"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              applyCameraPreset(key);
              soundEngine.playSwitchClick();
            }}
            className={`px-2 py-1 rounded-lg text-[11px] font-sans transition-all ${
              activeCamera === key
                ? "bg-amber-600 text-parchment-900 font-bold shadow-sm"
                : "text-parchment-300 hover:text-parchment-100 hover:bg-parchment-800/40"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {showUiOverlay && (
        <div className="absolute bottom-4 right-4 z-10 w-72 bg-ink-950/90 backdrop-blur-md p-3.5 rounded-xl border border-parchment-800/50 shadow-xl flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-parchment-800/60 pb-2">
            <span className="font-serif text-xs font-semibold text-parchment-200">
              Muzzle-Gas Kinematics
            </span>
            <span className="font-mono text-[10px] text-amber-400">US 319,596</span>
          </div>

          <div className="flex flex-col gap-2">
            <SensitivitySlider
              id="maxim-gas-impulse"
              patentId="us-319596-maxim-machine-gun"
              paramKey="gasImpulsePct"
              label="Muzzle Gas Expansion Pressure"
              value={gasImpulsePct}
              min={25}
              max={100}
              step={5}
              unit="%"
              onChange={(val) => updateParam("gasImpulsePct", val)}
            />
          </div>

          <PortHamiltonianEnergyStrip patentId="us-319596-maxim-machine-gun" params={params} />

          <ClaimConstraintToggle
            patentId="us-319596-maxim-machine-gun"
            claimStates={claimStates}
            onToggleClaim={(claimNumber, active) =>
              setClaimStates((prev) => ({ ...prev, [claimNumber]: active }))
            }
          />
        </div>
      )}
    </div>
  );
}
