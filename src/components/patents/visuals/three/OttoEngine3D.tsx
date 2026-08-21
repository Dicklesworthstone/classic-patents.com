"use client";

import { Camera, Eye, EyeOff, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { stepOttoEngine, wrapCycleRad } from "@/physics/catalogKernels";
import { createStudioClock } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import {
  buildOttoEngineModel,
  type OttoEngineModelResult,
  updateOttoEngineKinematics,
} from "./ottoEngineModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import {
  createGlowPointTexture,
  createThreeStudioScene,
  type StudioContext,
} from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset =
  | "iso"
  | "slide_valve"
  | "cylinder_piston"
  | "lay_shaft"
  | "governor"
  | "flywheels";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [8.5, 6.0, 9.5], target: [0, 0, 0] },
  slide_valve: { pos: [-4.5, 2.0, 2.8], target: [-3.2, 0.4, 0.7] },
  cylinder_piston: { pos: [-1.2, 2.8, 4.0], target: [-1.6, 0, 0] },
  lay_shaft: { pos: [1.2, 2.2, 3.4], target: [0.5, 0.4, 1.0] },
  governor: { pos: [-1.2, 1.8, 2.6], target: [-1.2, 0.8, 1.25] },
  flywheels: { pos: [4.5, 3.2, 5.5], target: [2.4, 0, 0] },
};

export function OttoEngine3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Four-Stroke Thermodynamic Parameters from Physics Bus
  const { params, updateParam } = usePatentPhysics("us-194047-otto-engine");
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [cutawayMode, setCutawayMode] = useState<boolean>(true);
  const engineRpm = params.engineRpm ?? 180;
  const compressionRatio = params.compressionRatio ?? 4.5;
  const isRunning = params.isRunning ?? true;

  const otto = stepOttoEngine({
    engineRpm,
    compressionRatio,
  });

  const powerBhp = otto.brakeHorsepower.toFixed(1);
  const thermalEfficiencyPct = otto.thermalEfficiencyPct;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    engineRpm,
    compressionRatio,
    isRunning,
    isAudioMuted,
    cutawayMode,
    thermalEfficiencyPct,
    brakeHorsepower: otto.brakeHorsepower,
    crankOmegaRadPerS: otto.crankOmegaRadPerS,
    govDisplayOmegaRadPerS: otto.govDisplayOmegaRadPerS,
    flyballRadius: otto.flyballRadius,
    cycleWrapRad: otto.cycleWrapRad,
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

    // Build procedural 3D model
    const engineModel: OttoEngineModelResult = buildOttoEngineModel();
    scene.add(engineModel.root);

    // Dynamic combustion flame mesh inside cylinder
    const flameGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const flameGlowTex = createGlowPointTexture();
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xff6600,
      transparent: true,
      opacity: 0,
      map: flameGlowTex,
      blending: THREE.AdditiveBlending,
    });
    const flameMesh = new THREE.Mesh(flameGeo, flameMat);
    flameMesh.position.set(-2.5, 0.4, 0);
    scene.add(flameMesh);

    let reqId: number;
    let crankAngle = 0;
    let lastSoundStroke = -1;

    const clock = createStudioClock();

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      const { dt } = clock.pump(now);
      const p = live.current;

      if (p.isRunning) {
        crankAngle = wrapCycleRad(crankAngle + p.crankOmegaRadPerS * dt, p.cycleWrapRad);

        const currentStroke = Math.floor((crankAngle / (Math.PI * 4)) * 4);
        if (currentStroke === 2 && lastSoundStroke !== 2 && !p.isAudioMuted) {
          soundEngine.playImpactThud(0.8);
        }
        lastSoundStroke = currentStroke;

        const isPowerStroke = currentStroke === 2;
        flameMesh.visible = isPowerStroke && p.cutawayMode;
        if (isPowerStroke) {
          const strokePhase = ((crankAngle % (Math.PI * 4)) - Math.PI * 2) / Math.PI;
          flameMat.opacity = Math.sin(strokePhase * Math.PI) * 0.8;
          flameMesh.scale.setScalar(1 + Math.sin(strokePhase * Math.PI) * 0.5);
        }

        updateOttoEngineKinematics(
          engineModel.nodes,
          engineModel.materials,
          crankAngle,
          p.compressionRatio,
          p.cutawayMode,
          Boolean(p.isRunning),
          dt,
          p.govDisplayOmegaRadPerS,
          p.flyballRadius,
          p.engineRpm,
        );
      }

      controls.update();
      renderer.render(scene, studio.camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      flameGeo.dispose();
      flameMat.dispose();
      flameGlowTex.dispose();
      engineModel.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Otto Four-Stroke Engine 3D</div>
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
                ["slide_valve", "Slide Valve"],
                ["cylinder_piston", "Cylinder"],
                ["lay_shaft", "2:1 Lay Shaft"],
                ["governor", "Governor"],
                ["flywheels", "Flywheels"],
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

        {/* Top-Right Action Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap justify-end gap-1.5 sm:gap-2 max-w-[min(90%,26rem)] sm:max-w-[26rem] pointer-events-auto">
          <ClaimConstraintToggle
            patentId="us-194047-otto-engine"
            claimStates={claimStates}
            onToggleClaim={(c: number, active: boolean) => {
              setClaimStates((prev) => ({ ...prev, [c]: active }));
              updateParam("compressionRatio", active ? 4.5 : 1.2);
            }}
          />
          <button
            type="button"
            onClick={() => setCutawayMode(!cutawayMode)}
            title={cutawayMode ? "Switch to Solid Shell" : "Switch to Cutaway Interior"}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              cutawayMode
                ? "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-600"
                : "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
            }`}
          >
            {cutawayMode ? (
              <Eye className="w-3.5 h-3.5 inline sm:mr-1" />
            ) : (
              <EyeOff className="w-3.5 h-3.5 inline sm:mr-1" />
            )}
            <span className="hidden md:inline">
              {cutawayMode ? "Cutaway Active" : "Full Exterior"}
            </span>
          </button>
          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            aria-label={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-1.5 sm:px-2 sm:py-1.5 rounded-lg text-xs font-sans bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border border-parchment-300 dark:border-ink-700 hover:bg-parchment-100 transition-colors shadow-xs"
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 inline" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 inline text-emerald-600 dark:text-emerald-400" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              showUiOverlay
                ? "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
                : "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-600"
            }`}
            title={showUiOverlay ? "Hide Overlay Telemetry" : "Show Overlay Telemetry"}
            aria-label={showUiOverlay ? "Hide Overlay Telemetry" : "Show Overlay Telemetry"}
          >
            {showUiOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden md:inline">{showUiOverlay ? "Hide HUD" : "Show HUD"}</span>
          </button>
          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="p-1.5 sm:px-2 sm:py-1.5 rounded-lg text-xs font-sans bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border border-parchment-300 dark:border-ink-700 hover:bg-parchment-100 transition-colors shadow-xs"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-3.5 h-3.5 inline" />
          </button>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Engine Speed</span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {engineRpm} RPM
              </span>
            </div>
            <input
              type="range"
              min="60"
              max="300"
              step="10"
              value={engineRpm}
              onChange={(e) => updateParam("engineRpm", Number.parseInt(e.target.value, 10))}
              className="w-full accent-amber-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <SensitivitySlider
            id="compressionRatio"
            patentId="us-194047-otto-engine"
            paramKey="compressionRatio"
            label="Compression Ratio"
            value={compressionRatio}
            min={3}
            max={7}
            step={0.5}
            unit=":1"
            onChange={(val) => updateParam("compressionRatio", val)}
            allParams={params}
          />
        </div>

        <PortHamiltonianEnergyStrip
          patentId="us-194047-otto-engine"
          params={params}
          className="mt-3"
        />
      </div>

      <StudioKernelChips
        visible={showUiOverlay}
        title="Otto 4-Stroke Air-Standard"
        chips={[
          { label: "rpm", value: String(engineRpm) },
          { label: "r", value: `${compressionRatio.toFixed(1)}:1` },
          {
            label: "η",
            value: String(thermalEfficiencyPct),
            unit: "%",
            tone: thermalEfficiencyPct > 25 ? "ok" : "warn",
          },
          { label: "BHP", value: powerBhp },
          { label: "P2", value: String(otto.peakCompressionBar), unit: "bar" },
          { label: "P3", value: String(otto.peakFiringBar), unit: "bar" },
          { label: "ω", value: otto.crankOmegaRadPerS.toFixed(1), unit: "rad/s" },
        ]}
      />
    </div>
  );
}
