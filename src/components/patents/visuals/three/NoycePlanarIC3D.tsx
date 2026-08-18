"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX, Zap } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import { stepNoyceIC } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildNoycePlanarICModel, updateNoycePlanarIcKinematics } from "./noycePlanarICModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

type CameraPreset =
  | "iso"
  | "metallization_layer"
  | "oxide_dielectric"
  | "pn_junctions"
  | "leadframe"
  | "top";

export const NoycePlanarIC3D = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // Microelectronics State Controls
  const { params } = usePatentPhysics("us-2981877-noyce-ic");
  const clockFrequencyMhz = params.clockFrequencyMhz ?? 10;
  const [showLogicSignals] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const noyce = stepNoyceIC({
    reverseBias: params.reverseBias ?? 5,
    oxideThickness: params.oxideThickness ?? 0.5,
    clockFrequencyMhz,
  });
  const oxideLayerThicknessNm = noyce.oxideThicknessNm;
  const gateCapacitancePf = noyce.junctionCapPfPerMm2;
  const gatePropagationDelayPs = noyce.propDelayPs;
  const maxClockGhz = noyce.maxClockGhz.toFixed(2);

  const live = useLiveSimParams({
    clockFrequencyMhz,
    oxideLayerThicknessNm,
    showLogicSignals,
    clockPeriodNs: noyce.clockPeriodNs,
    signalDisplaySpeed: noyce.signalDisplaySpeed,
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
        camera.position.set(10, 8, 12);
        controls.target.set(0, 0, 0);
        break;
      case "metallization_layer":
        camera.position.set(0, 3.5, 4.5);
        controls.target.set(0, 0.6, 0);
        break;
      case "oxide_dielectric":
        camera.position.set(0, 2.2, 5.0);
        controls.target.set(0, 0.3, 0);
        break;
      case "pn_junctions":
        camera.position.set(-2.2, 1.8, 3.5);
        controls.target.set(-1.0, 0.1, 0);
        break;
      case "leadframe":
        camera.position.set(0, 4.5, 8.5);
        controls.target.set(0, -0.6, 0);
        break;
      case "top":
        camera.position.set(0, 11.0, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const toggleSound = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  useEffect(() => {
    if (isPlayingAudio) {
      soundEngine.playContinuousTone(200 + clockFrequencyMhz * 15, "square", 0.02);
    } else {
      soundEngine.stopContinuousTone();
    }
    return () => {
      soundEngine.stopContinuousTone();
    };
  }, [isPlayingAudio, clockFrequencyMhz]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [10, 8, 12],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    const { rootGroup, nodes, materials, dispose } = buildNoycePlanarICModel();
    scene.add(rootGroup);

    let reqId: number;
    let timeSec = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const dt = 1 / 60;
      timeSec += dt;
      const p = live.current;

      updateNoycePlanarIcKinematics(
        nodes,
        materials,
        dt,
        timeSec,
        p.signalDisplaySpeed,
        p.showLogicSignals,
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
          <Activity className="w-4 h-4 text-sky-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-parchment-100 uppercase tracking-wider">
            Noyce Monolithic Planar IC 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
            US Patent 2,981,877 (1959)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["metallization_layer", "Aluminum Traces"],
              ["oxide_dielectric", "SiO₂ Dielectric"],
              ["pn_junctions", "PN Junctions"],
              ["leadframe", "Leadframe"],
              ["top", "Top"],
            ] as [CameraPreset, string][]
          ).map(([preset, label]) => (
            <button
              key={preset}
              type="button"
              onClick={() => applyCameraPreset(preset)}
              className={`px-2.5 py-1 text-xs font-sans rounded-lg transition-colors ${
                activeCamera === preset
                  ? "bg-sky-600 text-white font-semibold shadow-sm"
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
            title={isCutaway ? "Solid Oxide" : "Cutaway Oxide"}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-sans rounded-lg transition-colors ${
              isCutaway
                ? "bg-sky-600/30 text-sky-200 border border-sky-500/40"
                : "text-parchment-300 hover:text-white hover:bg-parchment-800/60"
            }`}
          >
            {isCutaway ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isCutaway ? "Cutaway" : "Solid"}</span>
          </button>

          <button
            type="button"
            onClick={toggleSound}
            title={isPlayingAudio ? "Mute Clock Audio" : "Play Clock Audio"}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            {isPlayingAudio ? (
              <Volume2 className="w-4 h-4 text-sky-400" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            <Zap className="w-4 h-4 text-sky-400" />
          </button>
        </div>
      </div>

      <StudioKernelChips
        visible={showUiOverlay}
        title="Noyce planar monolithic circuit kinetics"
        chips={[
          { label: "Clock Freq", value: `${clockFrequencyMhz}`, unit: "MHz" },
          { label: "Oxide Layer", value: `${oxideLayerThicknessNm.toFixed(0)}`, unit: "nm" },
          { label: "Junction Cap", value: `${gateCapacitancePf.toFixed(2)}`, unit: "pF/mm²" },
          { label: "Prop Delay", value: `${gatePropagationDelayPs.toFixed(0)}`, unit: "ps" },
          { label: "Max Clock", value: `${maxClockGhz}`, unit: "GHz", tone: "ok" },
        ]}
      />
    </div>
  );
});
