"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { stepOttoEngine, wrapCycleRad } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import {
  buildOttoEngineModel,
  type OttoEngineModelResult,
  updateOttoEngineKinematics,
} from "./ottoEngineModel";
import { StudioKernelChips } from "./StudioKernelChips";
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
  const { params } = usePatentPhysics("us-194047-otto-engine");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
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

    const { scene, camera, renderer, controls } = studio;

    // Procedural 1877 Deutz Otto Model Assembly
    const engineModel: OttoEngineModelResult = buildOttoEngineModel();
    scene.add(engineModel.root);

    // Ignition Spark / Flame Flash Particle
    const flameGlowTex = createGlowPointTexture();
    const flameMat = new THREE.PointsMaterial({
      size: 0.9,
      map: flameGlowTex,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      color: 0xff6600,
    });
    const flameGeo = new THREE.BufferGeometry();
    flameGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([-3.45, 0.5, 0.7]), 3),
    );
    const flamePoint = new THREE.Points(flameGeo, flameMat);
    scene.add(flamePoint);

    // Animation Loop
    let reqId: number;
    let crankAngle = 0;
    let lastAudioFireCycle = -1;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = 1 / 60;
      const currentRpm = live.current.isRunning ? live.current.engineRpm : 0;
      const omega = live.current.isRunning ? live.current.crankOmegaRadPerS : 0;

      if (currentRpm > 0) {
        crankAngle = wrapCycleRad(crankAngle + omega * delta, live.current.cycleWrapRad);
      }

      // Kinematic update
      updateOttoEngineKinematics(
        engineModel.nodes,
        engineModel.materials,
        crankAngle,
        live.current.compressionRatio,
        live.current.cutawayMode,
        Boolean(live.current.isRunning),
        delta,
        live.current.govDisplayOmegaRadPerS,
        live.current.flyballRadius,
        currentRpm,
      );

      // Deflagration flame flash at ignition (start of power stroke at 360 deg = 2pi rad)
      const cyclePhase = crankAngle;
      const isPowerStart = cyclePhase >= Math.PI * 2 && cyclePhase < Math.PI * 2.3;
      if (isPowerStart && currentRpm > 0) {
        flameMat.opacity = THREE.MathUtils.lerp(flameMat.opacity, 0.95, 0.35);
      } else {
        flameMat.opacity = THREE.MathUtils.lerp(flameMat.opacity, 0.0, 0.2);
      }

      // Audio Transducer: Fire ignition combustion beat once per 4-stroke cycle
      const currentCycle = Math.floor(crankAngle / (Math.PI * 2));
      if (currentCycle !== lastAudioFireCycle && !live.current.isAudioMuted && currentRpm > 0) {
        lastAudioFireCycle = currentCycle;
        if (cyclePhase >= Math.PI * 2 && cyclePhase < Math.PI * 2.5) {
          soundEngine.playPneumaticPuff();
        }
      }

      controls.update();
      renderer.render(scene, camera);
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
    <div className="relative w-full h-[620px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/60 shadow-lg pointer-events-auto">
          <Activity className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-slate-100 uppercase tracking-wider">
            Otto Four-Stroke Engine 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 194,047 (1877)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
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
              className={`px-2.5 py-1 text-xs font-sans rounded-lg transition-colors ${
                activeCamera === preset
                  ? "bg-amber-600 text-white font-semibold shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60 shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={() => setCutawayMode(!cutawayMode)}
            title={cutawayMode ? "Switch to Solid Shell" : "Switch to Cutaway Interior"}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              cutawayMode
                ? "bg-amber-600 text-white font-semibold shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            {cutawayMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className="p-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Zap className="w-4 h-4 text-amber-400" />
          </button>
        </div>
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
