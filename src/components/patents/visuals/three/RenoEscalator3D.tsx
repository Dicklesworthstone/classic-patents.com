"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import { stepRenoEscalator } from "@/physics/machineKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import {
  buildRenoEscalatorModel,
  type RenoEscalatorModelResult,
  updateRenoEscalatorKinematics,
} from "./renoEscalatorModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "comb_plates" | "cleated_deck" | "handrail" | "drive_machinery" | "top";

export function RenoEscalator3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [cutawayMode, setCutawayMode] = useState<boolean>(true);

  // Transit Dynamics Parameters
  const { params } = usePatentPhysics("us-470918-reno-escalator");
  const beltSpeedMps = params.beltSpeed ?? 0.45;
  const passengerCount = params.passengerCount ?? 30;
  const inclineAngleDeg = params.inclineAngle ?? 25;
  const renoIdle = stepRenoEscalator({
    passengerCount,
    inclineAngleDeg,
    velocityMps: beltSpeedMps,
  });
  const deckSpeedFpm = renoIdle.speedFpm;
  const passengersPerHour = renoIdle.throughputPerHour;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    beltSpeedMps,
    sheaveOmegaRadPerS: renoIdle.sheaveOmegaRadPerS,
    passengerCount,
    inclineAngleDeg,
    cutawayMode,
    isAudioMuted,
    speedFpm: deckSpeedFpm,
    throughputPerHour: passengersPerHour,
    motorPowerKw: renoIdle.motorPowerKw,
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
        camera.position.set(9.5, 6.5, 10.5);
        controls.target.set(0, 0, 0);
        break;
      case "comb_plates":
        camera.position.set(5.5, 3.2, 2.5);
        controls.target.set(4.2, 2.1, 0);
        break;
      case "cleated_deck":
        camera.position.set(0, 2.4, 3.8);
        controls.target.set(0, 0.4, 0);
        break;
      case "handrail":
        camera.position.set(-2.5, 2.2, 3.2);
        controls.target.set(-1.0, 1.2, 1.4);
        break;
      case "drive_machinery":
        camera.position.set(6.5, 2.2, 2.8);
        controls.target.set(5.2, 1.5, 0);
        break;
      case "top":
        camera.position.set(0, 11.5, 0.1);
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
      cameraPos: [9.5, 6.5, 10.5],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Procedural Reno Inclined Elevator Model
    const escalatorModel: RenoEscalatorModelResult = buildRenoEscalatorModel(inclineAngleDeg);
    scene.add(escalatorModel.root);

    // Animation Loop
    let reqId: number;
    let cleatDisplacement = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = 1 / 60;
      const p = live.current;

      cleatDisplacement += p.beltSpeedMps * delta;

      updateRenoEscalatorKinematics(
        escalatorModel.nodes,
        escalatorModel.materials,
        delta,
        cleatDisplacement,
        p.sheaveOmegaRadPerS,
        p.cutawayMode,
      );

      controls.update();
      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      escalatorModel.dispose();
      studio.cleanup();
    };
  }, [live, inclineAngleDeg]);

  return (
    <div className="relative w-full h-[620px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/60 shadow-lg pointer-events-auto">
          <Activity className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-slate-100 uppercase tracking-wider">
            Reno Inclined Elevator & Comb 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 470,918 (1892)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Overview"],
              ["comb_plates", "Comb Teeth"],
              ["cleated_deck", "Cleated Deck"],
              ["handrail", "Handrail"],
              ["drive_machinery", "Drive Motor"],
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
            title={cutawayMode ? "Switch to Solid Panels" : "Switch to Glass Balustrade"}
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
        title="Reno Endless Conveyor Dynamics"
        chips={[
          { label: "Belt Speed", value: `${deckSpeedFpm} FPM` },
          { label: "Throughput", value: `${passengersPerHour.toLocaleString()} pass/h` },
          { label: "Incline", value: `${inclineAngleDeg}°` },
          { label: "Power", value: `${renoIdle.motorPowerKw.toFixed(1)} kW` },
          { label: "Safety Comb", value: "1.2mm Intermeshed" },
        ]}
      />
    </div>
  );
}
