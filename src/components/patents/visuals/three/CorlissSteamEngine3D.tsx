"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import { stepCorlissEngine } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildCorlissEngineModel } from "./corlissSteamEngineModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "wrist_plate" | "dashpots" | "flywheel" | "top";

export function CorlissSteamEngine3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Thermodynamic Simulation Parameters
  const { params } = usePatentPhysics("us-6162-corliss-steam-engine");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const engineRpm = params.engineRpm ?? 65;
  const steamPressurePsi = params.steamPressurePsi ?? 100;
  const cutoffPct = params.cutoffPct ?? 25;
  const [_showCalloutPins, _setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const corliss = stepCorlissEngine({ steamPressurePsi, engineRpm, cutoffPct });
  const indicatedHp = corliss.indicatedHp;
  const thermalEfficiencyPct = corliss.thermalEfficiencyPct.toFixed(1);

  const live = useLiveSimParams({
    engineRpm,
    steamPressurePsi,
    cutoffPct,
    isAudioMuted,
    indicatedHp,
    thermalEfficiencyPct: Number(thermalEfficiencyPct),
    crankOmegaRadPerS: corliss.crankOmegaRadPerS,
    governorOmegaRadPerS: corliss.governorOmegaRadPerS,
  });

  const controlsRef = useRef<StudioContext["controls"] | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    switch (preset) {
      case "iso":
        camera.position.set(12.0, 9.0, 13.0);
        controls.target.set(0, 0, 0);
        break;
      case "wrist_plate":
        camera.position.set(-2.0, 1.8, 4.5);
        controls.target.set(-1.8, 0.4, 0);
        break;
      case "dashpots":
        camera.position.set(-2.2, -0.8, 3.8);
        controls.target.set(-2.0, -1.8, 0);
        break;
      case "flywheel":
        camera.position.set(4.5, 2.5, 6.0);
        controls.target.set(3.8, 0.5, 0);
        break;
      case "top":
        camera.position.set(0, 14.0, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };
  const toggleSound = () => {
    toggleEngine(() => {
      soundEngine.playSwitchClick();
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [12.0, 9.0, 13.0],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Build procedural 3D model
    const model = buildCorlissEngineModel();
    scene.add(model.rootGroup);

    // Animation Loop
    let reqId: number;
    let crankAngle = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = 1 / 60;
      const p = live.current;

      const omegaRadPerSec = p.crankOmegaRadPerS ?? (p.engineRpm * 2 * Math.PI) / 60;
      crankAngle = (crankAngle + omegaRadPerSec * delta) % (Math.PI * 2);

      // Crank & flywheel rotation
      model.crankGroup.rotation.z = crankAngle;

      // Governor rotation & flyball expansion
      const govOmega = p.governorOmegaRadPerS ?? omegaRadPerSec * 1.8;
      model.governorGroup.rotation.y += govOmega * delta;
      const govSpread = 0.35 + Math.min(0.35, (p.engineRpm / 100) * 0.25);
      model.governorBalls[0].position.x = -govSpread;
      model.governorBalls[1].position.x = govSpread;

      // Kinematics: crankpin position
      const crankR = 0.65;
      const pinX = 3.8 + Math.cos(crankAngle) * crankR;
      const pinY = Math.sin(crankAngle) * crankR;

      // Slider-crank crosshead position
      const rodL = 4.4;
      const strokeX = pinX - Math.sqrt(Math.max(0.1, rodL ** 2 - pinY ** 2));
      model.crossheadGroup.position.x = strokeX;

      // Connecting rod pose
      model.conRodGroup.position.set(strokeX, 0, 0);
      const rodAngle = Math.atan2(pinY, pinX - strokeX);
      model.conRodGroup.rotation.z = rodAngle;

      // Central wrist plate harmonic oscillation
      const wristAmp = 0.18 + (p.cutoffPct / 100) * 0.35;
      const wristAngle = Math.sin(crankAngle + Math.PI * 0.25) * wristAmp;
      model.wristPlate.rotation.z = wristAngle;

      // 4 Rotary oscillating valve levers
      model.valveLevers[0].rotation.z = wristAngle * 0.9;
      model.valveLevers[1].rotation.z = -wristAngle * 0.9;
      model.valveLevers[2].rotation.z = Math.sin(crankAngle) * wristAmp * 0.7;
      model.valveLevers[3].rotation.z = -Math.sin(crankAngle) * wristAmp * 0.7;

      // Dashpot rods drop motion
      const drop1 = Math.max(0, -wristAngle * 1.2);
      const drop2 = Math.max(0, wristAngle * 1.2);
      model.dashpotRods[0].position.y = 1.5 - drop1;
      model.dashpotRods[1].position.y = 1.5 - drop2;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      model.dispose();
      studio.cleanup();
    };
  }, [live]);

  return (
    <div className="relative w-full h-[620px] bg-parchment-900 rounded-2xl overflow-hidden border border-parchment-700 shadow-2xl flex flex-col">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-parchment-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-parchment-100 uppercase tracking-wider">
            Corliss Steam Engine 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 6,162 (1849)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["wrist_plate", "Wrist Plate"],
              ["dashpots", "Dashpots"],
              ["flywheel", "Flywheel"],
              ["top", "Top"],
            ] as [CameraPreset, string][]
          ).map(([preset, label]) => (
            <button
              key={preset}
              type="button"
              onClick={() => applyCameraPreset(preset)}
              className={`px-2.5 py-1 text-xs font-sans rounded-lg transition-colors ${
                activeCamera === preset
                  ? "bg-amber-600 text-white font-semibold shadow-sm"
                  : "text-parchment-300 hover:text-white hover:bg-parchment-800/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            title={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            {showUiOverlay ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4 text-amber-400" />
            )}
          </button>
          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <StudioKernelChips
        visible={showUiOverlay}
        title="Corliss dashpot trip"
        chips={[
          { label: "Steam", value: String(steamPressurePsi), unit: "psi" },
          { label: "Cutoff", value: String(cutoffPct), unit: "%" },
          { label: "IHP", value: String(indicatedHp), unit: "hp" },
          { label: "η", value: thermalEfficiencyPct, unit: "%" },
          { label: "P", value: String(corliss.boilerMpa), unit: "MPa" },
          { label: "r_exp", value: String(corliss.expansionRatio) },
          { label: "ω", value: corliss.crankOmegaRadPerS.toFixed(2), unit: "rad/s" },
        ]}
      />
    </div>
  );
}
