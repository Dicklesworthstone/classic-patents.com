"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX, Waves, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FrankenSimEngine } from "@/physics/engine";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import {
  buildCarrierAirConditionerModel,
  updateCarrierAirConditionerKinematics,
  type CarrierAirConditionerModelResult,
} from "./carrierAirConditionerModel";
import { StudioKernelChips } from "./StudioKernelChips";
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

export function CarrierAirConditioner3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [cutawayMode, setCutawayMode] = useState<boolean>(true);

  // Psychrometric Air Treatment Parameters from Physics Bus
  const { params } = usePatentPhysics("us-808897-carrier-air-conditioner");
  const airflowCfm = params.airflowCfm ?? 15000;
  const sprayWaterTempC = params.sprayTempC ?? 12.5;
  const [showSprayMist, setShowSprayMist] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const carrier = FrankenSimEngine.stepCarrierAirConditioner({
    inletTempC: 28,
    inletRhPct: 65,
    sprayWaterTempC,
    reheatTempC: 20,
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
      case "spray_chamber":
        camera.position.set(-2.2, 1.8, 3.2);
        controls.target.set(-1.8, 0.4, 0);
        break;
      case "baffle_plates":
        camera.position.set(1.2, 1.8, 2.8);
        controls.target.set(0.6, 0.4, 0);
        break;
      case "blower_fan":
        camera.position.set(4.2, 1.8, 3.5);
        controls.target.set(3.2, 0.4, 0);
        break;
      case "pump_sump":
        camera.position.set(-2.4, -0.6, 3.5);
        controls.target.set(-1.8, -1.1, 0.8);
        break;
      case "dampers":
        camera.position.set(-5.5, 1.5, 2.5);
        controls.target.set(-4.0, 0.4, 0);
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

    // Build procedural 3D model
    const airModel: CarrierAirConditionerModelResult = buildCarrierAirConditionerModel();
    scene.add(airModel.root);

    // Animation Loop
    let reqId: number;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = 1 / 60;
      const p = live.current;

      updateCarrierAirConditionerKinematics(
        airModel.nodes,
        airModel.materials,
        delta,
        p.airflowCfm,
        p.sprayWaterTempC,
        p.showSprayMist,
        p.cutawayMode,
      );

      controls.update();
      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      airModel.dispose();
      studio.cleanup();
    };
  }, [live]);

  return (
    <div className="relative w-full h-[620px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/60 shadow-lg pointer-events-auto">
          <Waves className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-slate-100 uppercase tracking-wider">
            Carrier Psychrometric Dew-Point 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            US Patent 808,897 (1906)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
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
              className={`px-2.5 py-1 text-xs font-sans rounded-lg transition-colors ${
                activeCamera === preset
                  ? "bg-cyan-600 text-white font-semibold shadow-sm"
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
            title={cutawayMode ? "Switch to Solid Shell" : "Switch to Cutaway View"}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              cutawayMode
                ? "bg-cyan-600 text-white font-semibold shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            {cutawayMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setShowSprayMist(!showSprayMist)}
            title={showSprayMist ? "Hide Atomized Mist" : "Show Atomized Mist"}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              showSprayMist
                ? "bg-cyan-600 text-white font-semibold shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Waves className="w-4 h-4" />
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
            <Zap className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
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
