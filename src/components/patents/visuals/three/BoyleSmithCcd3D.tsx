"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX, Zap } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import { FrankenSimEngine } from "@/physics/engine";
import { stepCcdWells } from "@/physics/machineKernels";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildBoyleSmithCcdModel, updateBoyleSmithCcdKinematics } from "./boyleSmithCcdModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset =
  | "iso"
  | "potential_well"
  | "sensing_node"
  | "gate_electrodes"
  | "bus_lines"
  | "top";

export const BoyleSmithCcd3D = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // CCD Physics & Clocking State Controls
  const { params } = usePatentPhysics("us-3858232-boyle-smith-ccd");
  const [clockPhase] = useState<1 | 2 | 3>(1);
  const incidentLux = params.incidentLux ?? 850;
  const gateVoltageV = params.gateVoltage ?? 8;
  const isAutoClocking = true;
  const clockFreq = params.clockFreq ?? params.clockSpeedFactor ?? 2.5;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const ccdWells = stepCcdWells(clockPhase, incidentLux, clockFreq, gateVoltageV);
  const ccdState = FrankenSimEngine.stepBoyleSmithCcd(
    clockPhase,
    gateVoltageV,
    incidentLux,
    clockFreq,
  );

  useFrankenSimPhysics("us-3858232-boyle-smith-ccd", {
    domain: "semiconductor_carrier",
    timestampMs: Date.now(),
    timeStepDt: 0.016,
    refusal: { isRefused: false },
    semi: ccdState,
  });

  const fullWellElectrons = ccdWells.fullWellElectrons;
  const collectedChargeElectrons = Math.round(ccdWells.wells[clockPhase - 1] ?? 0);
  const transferEfficiencyPct = (ccdWells.cte * 100).toFixed(4);

  const live = useLiveSimParams({
    clockPhase,
    isAutoClocking,
    gateVoltageV,
    clockFreq,
    incidentLux,
    isAudioMuted,
    photoElectrons: ccdWells.photoElectrons,
    fullWellElectrons: ccdWells.fullWellElectrons,
    cte: ccdWells.cte,
    phaseDisplayMs: ccdWells.phaseDisplayMs,
    phasePeriodNs: ccdWells.phasePeriodNs,
    isCutaway,
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
        camera.position.set(11, 9, 14);
        controls.target.set(0, 0, 0);
        break;
      case "potential_well":
        camera.position.set(0, 1.4, 4.5);
        controls.target.set(0, 0, 0);
        break;
      case "sensing_node":
        camera.position.set(4.8, 1.8, 2.5);
        controls.target.set(4.0, 0.2, 0);
        break;
      case "gate_electrodes":
        camera.position.set(-1.5, 4.5, 3.0);
        controls.target.set(0, 0.4, 0);
        break;
      case "bus_lines":
        camera.position.set(0, 3.5, 5.0);
        controls.target.set(0, 0.4, 1.5);
        break;
      case "top":
        camera.position.set(0, 8.5, 0.1);
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
      cameraPos: [11, 9, 14],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    const { rootGroup, nodes, materials, dispose } = buildBoyleSmithCcdModel();
    scene.add(rootGroup);

    let reqId: number;
    let _renderedSteps = 0;
    let phaseTimer = 0;
    let currentActivePhase: 1 | 2 | 3 = 1;
    let timeSec = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      _renderedSteps += 1;
      const delta = 1 / 60;
      timeSec += delta;
      const p = live.current;

      if (p.isAutoClocking) {
        phaseTimer += delta;
        if (phaseTimer > p.phaseDisplayMs / 1000) {
          phaseTimer = 0;
          currentActivePhase = ((currentActivePhase % 3) + 1) as 1 | 2 | 3;
        }
      } else {
        currentActivePhase = p.clockPhase;
      }

      const wells = stepCcdWells(currentActivePhase, p.incidentLux, p.clockFreq, p.gateVoltageV);

      updateBoyleSmithCcdKinematics(
        nodes,
        materials,
        delta,
        timeSec,
        currentActivePhase,
        wells,
        p.isCutaway ?? false,
      );

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      dispose();
      studio.cleanup();
    };
  }, [live]);

  return (
    <div className="relative w-full h-[620px] bg-parchment-900 rounded-2xl overflow-hidden border border-parchment-700 shadow-2xl flex flex-col">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-parchment-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-parchment-100 uppercase tracking-wider">
            Boyle-Smith Charge-Coupled Device 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            US Patent 3,858,232 (1974)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["potential_well", "Potential Wells"],
              ["sensing_node", "Sensing Node"],
              ["gate_electrodes", "3-Phase Gates"],
              ["bus_lines", "Clock Bus"],
              ["top", "Top"],
            ] as [CameraPreset, string][]
          ).map(([preset, label]) => (
            <button
              key={preset}
              type="button"
              onClick={() => applyCameraPreset(preset)}
              className={`px-2.5 py-1 text-xs font-sans rounded-lg transition-colors ${
                activeCamera === preset
                  ? "bg-cyan-600 text-white font-semibold shadow-sm"
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
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Solid Substrate" : "Cutaway Substrate"}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-sans rounded-lg transition-colors ${
              isCutaway
                ? "bg-cyan-600/30 text-cyan-200 border border-cyan-500/40"
                : "text-parchment-300 hover:text-white hover:bg-parchment-800/60"
            }`}
          >
            {isCutaway ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isCutaway ? "Cutaway" : "Solid"}</span>
          </button>

          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            <Zap className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>

      <StudioKernelChips
        visible={showUiOverlay}
        title="Boyle-Smith 3-phase charge transfer kinetics"
        chips={[
          { label: "Gate V_g", value: `${gateVoltageV}`, unit: "V" },
          { label: "Incident Lux", value: `${incidentLux}`, unit: "lux" },
          { label: "Clock Freq", value: `${clockFreq}`, unit: "MHz" },
          {
            label: "Full-Well Capacity",
            value: `${fullWellElectrons.toLocaleString()}`,
            unit: "e⁻",
          },
          {
            label: "Packet Charge",
            value: `${collectedChargeElectrons.toLocaleString()}`,
            unit: "e⁻",
          },
          { label: "Transfer Efficiency (CTE)", value: `${transferEfficiencyPct}%`, tone: "ok" },
        ]}
      />
    </div>
  );
});
