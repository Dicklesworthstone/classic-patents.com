"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX, Zap } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { stepEngelbartMouse } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildEngelbartMouseModel, updateEngelbartMouseKinematics } from "./engelbartMouseModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "wheels" | "xray" | "microswitch" | "potentiometers" | "top";

export const EngelbartMouse3D = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isXRayMode, setIsXRayMode] = useState<boolean>(false);

  // Mouse Kinematics & Rendering State
  const { params } = usePatentPhysics("us-3541541-engelbart-mouse");
  const displacementSpeedMmSec = params.mouseSpeed ?? 350;
  const mouseTrajectory = "figure8" as const;
  const [isClicking, setIsClicking] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const wheelRadiusMm = params.wheelRadius ?? 10;
  const mouse = stepEngelbartMouse({
    mouseSpeed: displacementSpeedMmSec,
    wheelRadius: wheelRadiusMm,
    pulsesPerRev: params.pulsesPerRev ?? 200,
  });
  const cpiResolution = mouse.dpi;
  const pulseRateHz = mouse.pulseRateHz;

  const live = useLiveSimParams({
    displacementSpeedMmSec,
    mouseTrajectory,
    isClicking,
    isXRayMode,
    cpiResolution,
    wheelRadiusMm,
    dpi: mouse.dpi,
    omegaRadPerS: mouse.omegaRadPerS,
    pathDisplayOmega: mouse.pathDisplayOmega,
    resolverSvgScale: mouse.resolverSvgScale,
    pulsesPerRev: params.pulsesPerRev ?? 200,
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
        camera.position.set(11, 9, 13);
        controls.target.set(0, 0, 0);
        break;
      case "wheels":
        camera.position.set(0, -6, 9);
        controls.target.set(0, 0, 0);
        break;
      case "xray":
        setIsXRayMode(true);
        camera.position.set(4, 7, 9);
        controls.target.set(0, 1.2, 0);
        break;
      case "microswitch":
        camera.position.set(3, 4, -4);
        controls.target.set(1.3, 2.0, -2.0);
        break;
      case "potentiometers":
        setIsXRayMode(true);
        camera.position.set(-3, 3, 2);
        controls.target.set(0, 0.5, 0);
        break;
      case "top":
        camera.position.set(0, 16, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const toggleSound = () => {
    toggleEngine(() => {
      soundEngine.playMicroswitchClick();
    });
  };

  const handleManualClick = () => {
    setIsClicking(true);
    if (!isAudioMuted) {
      soundEngine.playMicroswitchClick();
    }
    setTimeout(() => setIsClicking(false), mouse.clickDisplayMs);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [11, 9, 13],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Formica Desk Surface
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.6,
      metalness: 0.1,
    });
    const desk = new THREE.Mesh(new THREE.BoxGeometry(26, 0.4, 20), deskMat);
    desk.position.y = -0.22;
    desk.receiveShadow = true;
    scene.add(desk);

    const { rootGroup, nodes, materials, dispose } = buildEngelbartMouseModel();
    scene.add(rootGroup);

    let reqId: number;
    let timeSec = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const dt = 1 / 60;
      timeSec += dt;
      const p = live.current;

      updateEngelbartMouseKinematics(
        nodes,
        materials,
        dt,
        timeSec,
        p.pathDisplayOmega,
        p.resolverSvgScale,
        p.mouseTrajectory,
        p.wheelRadiusMm,
        p.pulsesPerRev,
        p.isClicking,
        p.isXRayMode,
      );

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      deskMat.dispose();
      desk.geometry.dispose();
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
          <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-parchment-100 uppercase tracking-wider">
            Engelbart Computer Mouse 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 3,541,541 (1964)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["wheels", "Orthogonal Wheels"],
              ["xray", "Internal X-Ray"],
              ["microswitch", "Red Button"],
              ["potentiometers", "Resolvers"],
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
            onClick={handleManualClick}
            className="px-2.5 py-1 text-xs font-sans rounded-lg bg-red-600/80 text-white hover:bg-red-500 transition-colors shadow-sm"
          >
            Click Button
          </button>

          <button
            type="button"
            onClick={() => setIsXRayMode(!isXRayMode)}
            title={isXRayMode ? "Solid Walnut Body" : "X-Ray Walnut Body"}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-sans rounded-lg transition-colors ${
              isXRayMode
                ? "bg-amber-600/30 text-amber-200 border border-amber-500/40"
                : "text-parchment-300 hover:text-white hover:bg-parchment-800/60"
            }`}
          >
            {isXRayMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isXRayMode ? "X-Ray" : "Solid"}</span>
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
            <Zap className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      <StudioKernelChips
        visible={showUiOverlay}
        title="Engelbart orthogonal position resolver kinetics"
        chips={[
          { label: "Displacement", value: `${displacementSpeedMmSec}`, unit: "mm/s" },
          { label: "Wheel Radius", value: `${wheelRadiusMm}`, unit: "mm" },
          { label: "Encoder Resolution", value: `${cpiResolution}`, unit: "CPI" },
          { label: "Pulse Rate", value: `${pulseRateHz.toFixed(0)}`, unit: "pulses/s", tone: "ok" },
          { label: "Wheel Angular Vel", value: `${mouse.omegaRadPerS.toFixed(1)}`, unit: "rad/s" },
        ]}
      />
    </div>
  );
});
