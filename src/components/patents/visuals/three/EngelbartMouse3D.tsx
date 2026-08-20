"use client";

import { Camera, Eye, EyeOff, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { stepEngelbartMouse } from "@/physics/catalogKernels";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildEngelbartMouseModel, updateEngelbartMouseKinematics } from "./engelbartMouseModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "wheels" | "xray" | "microswitch" | "potentiometers" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [11, 9, 13], target: [0, 0, 0] },
  wheels: { pos: [0, -6, 9], target: [0, 0, 0] },
  xray: { pos: [4, 7, 9], target: [0, 1.2, 0] },
  microswitch: { pos: [3, 4, -4], target: [1.3, 2.0, -2.0] },
  potentiometers: { pos: [-3, 3, 2], target: [0, 0.5, 0] },
  top: { pos: [0, 16, 0.1], target: [0, 0, 0] },
};

export const EngelbartMouse3D = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isXRayMode, setIsXRayMode] = useState<boolean>(false);
  const [isClicking, setIsClicking] = useState<boolean>(false);

  // Mechanical Coordinates & Pulse Resolver Parameters
  const { params } = usePatentPhysics("us-3541541-engelbart-mouse");
  const mouseSpeedMmPerS = params.mouseSpeedMmPerS ?? 350;
  const surfaceFrictionCoeff = params.surfaceFrictionCoeff ?? 0.35;
  const wheelRadiusMm = params.wheelRadiusMm ?? 9.5;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  const mouse = stepEngelbartMouse({
    mouseSpeed: mouseSpeedMmPerS,
    wheelRadius: wheelRadiusMm,
    pulsesPerRev: params.pulsesPerRev ?? 200,
  });

  const live = useLiveSimParams({
    mouseSpeedMmPerS,
    surfaceFrictionCoeff,
    wheelRadiusMm,
    isAudioMuted,
    isXRayMode,
    isClicking,
    pulsesPerInch: mouse.dpi,
    wheelOmegaRadPerS: mouse.omegaRadPerS,
    pathDisplayOmega: mouse.pathDisplayOmega,
    resolverSvgScale: mouse.resolverSvgScale,
    pulsesPerRev: params.pulsesPerRev ?? 200,
  });

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    if (preset === "xray" || preset === "potentiometers") {
      setIsXRayMode(true);
    }
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
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
    setTimeout(() => setIsClicking(false), 250);
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

    // Formica Desk Surface
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.6,
      metalness: 0.1,
    });
    const desk = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), deskMat);
    desk.rotation.x = -Math.PI / 2;
    desk.position.y = -1.5;
    desk.receiveShadow = true;
    scene.add(desk);

    // Build procedural 3D model
    const { rootGroup, nodes, materials, dispose } = buildEngelbartMouseModel();
    scene.add(rootGroup);

    // Animation Loop
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
        "figure8",
        p.wheelRadiusMm,
        p.pulsesPerRev,
        p.isClicking,
        p.isXRayMode,
      );

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      dispose();
      deskMat.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsXRayMode(!isXRayMode)}
            title={isXRayMode ? "Solid Walnut Body" : "X-Ray Walnut Body"}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm text-xs font-sans flex items-center gap-1 ${
              isXRayMode
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            {isXRayMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden sm:inline">{isXRayMode ? "X-Ray" : "Solid"}</span>
          </button>
          <button
            type="button"
            onClick={handleManualClick}
            className="px-2.5 py-1.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white text-xs font-sans font-medium transition-colors shadow-sm"
          >
            Click
          </button>
          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showUiOverlay
                ? "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
                : "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
            }`}
            title={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
            aria-label={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
          >
            <Zap className="w-4 h-4" />
          </button>
          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Camera Views Bar */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-1.5rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3.5 h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["wheels", "Orthogonal Wheels"],
                ["xray", "Internal X-Ray"],
                ["microswitch", "Red Button"],
                ["potentiometers", "Resolvers"],
                ["top", "Plan View"],
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

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="Engelbart orthogonal position resolver kinetics"
          chips={[
            { label: "Displacement", value: `${mouseSpeedMmPerS}`, unit: "mm/s" },
            { label: "Wheel Radius", value: `${wheelRadiusMm}`, unit: "mm" },
            { label: "Encoder Resolution", value: `${mouse.dpi}`, unit: "CPI" },
            {
              label: "Pulse Rate",
              value: `${mouse.pulseRateHz.toFixed(0)}`,
              unit: "pulses/s",
              tone: "ok",
            },
            {
              label: "Wheel Angular Vel",
              value: `${mouse.omegaRadPerS.toFixed(1)}`,
              unit: "rad/s",
            },
            {
              label: "XY crate",
              value: crateSource === "wasm" ? "fs-symmetry" : "ts-cyclic-fallback",
            },
          ]}
        />
      </div>
    </div>
  );
});
