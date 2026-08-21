"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { stepEngelbartMouse } from "@/physics/catalogKernels";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { createStudioClock } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { buildEngelbartMouseModel, updateEngelbartMouseKinematics } from "./engelbartMouseModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
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
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isXRayMode, setIsXRayMode] = useState<boolean>(false);
  const [isClicking, setIsClicking] = useState<boolean>(false);

  // Mechanical Coordinates & Pulse Resolver Parameters
  const { params, updateParam } = usePatentPhysics("us-3541541-engelbart-mouse");
  const mouseSpeedMmPerS =
    (params.mouseSpeed as number) ?? (params.mouseSpeedMmPerS as number) ?? 350;
  const surfaceFrictionCoeff = (params.surfaceFrictionCoeff as number) ?? 0.35;
  const wheelRadiusMm = (params.wheelRadius as number) ?? (params.wheelRadiusMm as number) ?? 9.5;
  const pulsesPerRev = (params.pulsesPerRev as number) ?? 200;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  const mouse = stepEngelbartMouse({
    mouseSpeed: mouseSpeedMmPerS,
    wheelRadius: wheelRadiusMm,
    pulsesPerRev,
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
    pulsesPerRev,
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
    const model = buildEngelbartMouseModel();
    scene.add(model.rootGroup);

    // Animation Loop
    let reqId: number;
    const clock = createStudioClock();

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      const { dt, simTimeSec: timeSec } = clock.pump(now);
      const p = live.current;

      updateEngelbartMouseKinematics(
        model.nodes,
        model.materials,
        dt,
        timeSec,
        p.pathDisplayOmega,
        p.resolverSvgScale,
        "figure8",
        p.wheelRadiusMm,
        p.pulsesPerRev,
        p.isXRayMode,
        p.isClicking,
      );

      controls.update();
      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      model.dispose();
      deskMat.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Douglas Engelbart Computer Mouse 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-9.5rem)] sm:max-w-[calc(100%-28rem)] gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
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

        {/* Top Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsXRayMode(!isXRayMode)}
            title={isXRayMode ? "Solid Walnut Body" : "Cutaway X-Ray Walnut Body"}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm text-xs font-sans flex items-center gap-1 ${
              isXRayMode
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">{isXRayMode ? "Cutaway" : "Solid"}</span>
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
            aria-label={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
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
            title={showUiOverlay ? "Hide Overlay UI (Clean 3D View)" : "Show Overlay UI"}
            aria-label={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
          >
            {showUiOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                Tracking Speed:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {mouseSpeedMmPerS} mm/s
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Resolution:</span>
              <span className="font-bold text-emerald-800 dark:text-emerald-400">
                {mouse.dpi} CPI
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Pulse Rate:</span>
              <span className="font-bold text-purple-800 dark:text-purple-400">
                {mouse.pulseRateHz.toFixed(0)} pulses/s
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Wheel Angular Vel:</span>
              <span className="font-bold text-cyan-800 dark:text-cyan-400">
                {mouse.omegaRadPerS.toFixed(1)} rad/s
              </span>
            </div>
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

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SensitivitySlider
            id="engelbartSpeed"
            patentId="us-3541541-engelbart-mouse"
            paramKey="mouseSpeed"
            label="Tracking Speed"
            value={mouseSpeedMmPerS}
            min={100}
            max={800}
            step={25}
            unit=" mm/s"
            onChange={(val) => updateParam("mouseSpeed", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="engelbartRadius"
            patentId="us-3541541-engelbart-mouse"
            paramKey="wheelRadius"
            label="Wheel Radius"
            value={wheelRadiusMm}
            min={6}
            max={18}
            step={0.5}
            unit=" mm"
            onChange={(val) => updateParam("wheelRadius", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="engelbartPpr"
            patentId="us-3541541-engelbart-mouse"
            paramKey="pulsesPerRev"
            label="Resolver Pulses / Rev"
            value={pulsesPerRev}
            min={50}
            max={400}
            step={10}
            unit=" PPR"
            onChange={(val) => updateParam("pulsesPerRev", val)}
            allParams={params}
          />
        </div>

        <ClaimConstraintToggle
          patentId="us-3541541-engelbart-mouse"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-3541541-engelbart-mouse"
          params={params}
          className="mt-3"
        />
      </div>
    </div>
  );
});
