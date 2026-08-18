"use client";

import { Camera, Eye, EyeOff, Volume2, VolumeX, Wind, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import { FrankenSimEngine } from "@/physics/engine";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import {
  buildLindeLiquefactionModel,
  type LindeLiquefactionModelResult,
  updateLindeLiquefactionKinematics,
} from "./lindeLiquefactionModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset =
  | "iso"
  | "jt_valve"
  | "counter_heat_exchanger"
  | "liquid_dewar"
  | "spindle_handwheel"
  | "top";

export function LindeAirLiquefaction3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [cutawayMode, setCutawayMode] = useState<boolean>(true);

  // Cryogenic Thermodynamics Parameters
  const { params } = usePatentPhysics("us-727650-linde-air-liquefaction");
  const inletPressureBar = params.inletBar ?? params.inletPressureBar ?? 200;
  const [showMist, setShowMist] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const linde = FrankenSimEngine.stepLindeAirLiquefaction({
    compressorPressureBar: inletPressureBar,
    heatExchangerPasses: 48,
  });

  const live = useLiveSimParams({
    inletPressureBar,
    showMist,
    cutawayMode,
    isAudioMuted,
    coldEndTempK: linde.coldEndTempK,
    coldEndTempC: linde.coldEndTempC,
    jtDeltaTPerPass: linde.jtDeltaTPerPass,
    isLiquefying: linde.isLiquefying,
    liquidYieldPct: linde.liquidYieldPct,
    liquidOutputLitersPerHr: linde.liquidOutputLitersPerHr,
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
        camera.position.set(7.5, 4.5, 8.5);
        controls.target.set(0, 0, 0);
        break;
      case "jt_valve":
        camera.position.set(0, -0.8, 3.2);
        controls.target.set(0, -1.6, 0);
        break;
      case "counter_heat_exchanger":
        camera.position.set(2.8, 1.8, 3.2);
        controls.target.set(0, 0.8, 0);
        break;
      case "liquid_dewar":
        camera.position.set(0, -2.0, 3.4);
        controls.target.set(0, -2.4, 0);
        break;
      case "spindle_handwheel":
        camera.position.set(1.4, 5.0, 3.0);
        controls.target.set(0, 4.2, 0);
        break;
      case "top":
        camera.position.set(0, 9.5, 0.1);
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
      cameraPos: [7.5, 4.5, 8.5],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Procedural Linde Cryogenic Liquefier Model
    const liquefierModel: LindeLiquefactionModelResult = buildLindeLiquefactionModel();
    scene.add(liquefierModel.root);

    // Animation Loop
    let reqId: number;
    let timeSec = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = 1 / 60;
      timeSec += delta;
      const p = live.current;

      updateLindeLiquefactionKinematics(
        liquefierModel.nodes,
        liquefierModel.materials,
        delta,
        timeSec,
        p.inletPressureBar,
        p.showMist,
        p.cutawayMode,
      );

      controls.update();
      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      liquefierModel.dispose();
      studio.cleanup();
    };
  }, [live]);

  return (
    <div className="relative w-full h-[620px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/60 shadow-lg pointer-events-auto">
          <Wind className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-slate-100 uppercase tracking-wider">
            Linde Regenerative Air Liquefier 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            US Patent 727,650 (1903)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Overview"],
              ["counter_heat_exchanger", "Coil Exchanger"],
              ["jt_valve", "J-T Valve"],
              ["liquid_dewar", "Liquid Dewar"],
              ["spindle_handwheel", "Handwheel"],
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
            title={cutawayMode ? "Switch to Solid Shell" : "Switch to Cutaway Shell"}
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
            onClick={() => setShowMist(!showMist)}
            title={showMist ? "Hide Cryogenic Jet" : "Show Cryogenic Jet"}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              showMist
                ? "bg-cyan-600 text-white font-semibold shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Wind className="w-4 h-4" />
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
        title="Linde Joule-Thomson Cryogenics"
        chips={[
          { label: "Inlet P", value: `${inletPressureBar} bar` },
          { label: "Cold End T", value: `${linde.coldEndTempC} °C (${linde.coldEndTempK} K)` },
          { label: "ΔT / Pass", value: `-${linde.jtDeltaTPerPass.toFixed(1)} K` },
          {
            label: "State",
            value: linde.isLiquefying ? "LIQUEFYING" : "PRE-COOLING",
            tone: linde.isLiquefying ? "ok" : "warn",
          },
          { label: "Liquid Yield", value: `${linde.liquidYieldPct}%` },
          { label: "Output", value: `${linde.liquidOutputLitersPerHr} L/h` },
        ]}
      />
    </div>
  );
}
