"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { stepEngelbartMouse } from "@/physics/catalogKernels";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import { createStudioClock } from "@/physics/tickScheduler";
import type { MachineState } from "@/physics/types";
import {
  globalTransportBus,
  type TapeUpdater,
  useFrankenSimPhysics,
} from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import {
  buildEngelbartMouseModel,
  ENGELBART_DESK_Y,
  updateEngelbartMouseKinematics,
} from "./engelbartMouseModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "wheels" | "xray" | "microswitch" | "potentiometers" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [10, 7.5, 13], target: [0.5, 0.55, 1.2] },
  wheels: { pos: [6, 1.8, -10], target: [0, -0.12, -0.2] },
  xray: { pos: [7, 6.5, 11.5], target: [0.3, 0.7, 1] },
  microswitch: { pos: [4.5, 4.4, -6.5], target: [0, 1.8, -1.7] },
  potentiometers: { pos: [-6.5, 4.2, -6], target: [-0.2, 0.5, -0.2] },
  top: { pos: [0, 16, 0.1], target: [0, 0, 0] },
};

function cameraForViewport(preset: CameraPreset, width: number) {
  const config = CAMERA_PRESETS[preset];
  if (width >= 520) return config;
  const scale = preset === "top" ? 1.15 : 1.34;
  return {
    pos: config.pos.map((coordinate, index) =>
      index === 1 && preset !== "top" ? coordinate * 1.12 : coordinate * scale,
    ) as [number, number, number],
    target: config.target,
  };
}

// The patent's teaching is the orthogonal resolver mechanism beneath the
// housing. Start in the expressly-labelled cutaway inspection state so the
// visitor sees that mechanism before choosing a close-up.
const DEFAULT_CAMERA_PRESET: CameraPreset = "xray";

const IDLE_MACHINE: MachineState = {
  poseXMeters: 0,
  poseYMeters: 0,
  headingRad: 0,
  modeLabel: "orthogonal-position-wheels",
  wheelSpeedMps: 0,
};

export const EngelbartMouse3D = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isXRayMode, setIsXRayMode] = useState<boolean>(true);
  const [isClicking, setIsClicking] = useState<boolean>(false);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mechanical Coordinates & Pulse Resolver Parameters
  const { params, effectiveParams, claimStates, claimConstraintResult, updateParam } =
    usePatentPhysics("us-3541541-engelbart-mouse");
  const mouseSpeedMmPerS =
    (effectiveParams.mouseSpeed as number) ?? (effectiveParams.mouseSpeedMmPerS as number) ?? 350;
  const wheelRadiusMm =
    (effectiveParams.wheelRadius as number) ?? (effectiveParams.wheelRadiusMm as number) ?? 10;
  const pulsesPerRev = (effectiveParams.pulsesPerRev as number) ?? 200;
  const claim1Active = claimStates[1] ?? true;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>(DEFAULT_CAMERA_PRESET);
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const mouse = stepEngelbartMouse({
    mouseSpeed: mouseSpeedMmPerS,
    wheelRadius: wheelRadiusMm,
    pulsesPerRev,
  });

  const live = useLiveSimParams({
    mouseSpeedMmPerS,
    wheelRadiusMm,
    isAudioMuted,
    isXRayMode,
    isClicking,
    pulsesPerInch: mouse.dpi,
    wheelOmegaRadPerS: mouse.omegaRadPerS,
    pathDisplayOmega: mouse.pathDisplayOmega,
    resolverSvgScale: mouse.resolverSvgScale,
    claim1Active: claim1Active ? 1 : 0,
    pulsesPerRev,
  });

  // Shared transport tape: the US 3,541,541 encoder-wheel pose publishes to
  // the patentId-keyed bus so every face reads one deterministic state.
  useFrankenSimPhysics("us-3541541-engelbart-mouse", {
    domain: "solid_mechanics",
    refusal: {
      isRefused: !claim1Active,
      reason: claimConstraintResult.refusalWarning ?? undefined,
    },
    machine: {
      ...IDLE_MACHINE,
      wheelSpeedMps: mouseSpeedMmPerS / 1000,
    },
  });

  // One tape-bound integrator owns the time-dilated exhibit path. The patent's
  // real rolling rate remains the separate SI value v/r.
  const pathPhaseRef = useRef(0);
  useEffect(() => {
    const integrate: TapeUpdater = (_prev, dt) => {
      const refused = (live.current.claim1Active ?? 1) < 0.5;
      pathPhaseRef.current += (live.current.pathDisplayOmega ?? 0) * dt;
      const poseX = Math.sin(pathPhaseRef.current) * 0.064;
      const poseY = refused ? 0 : Math.sin(pathPhaseRef.current * 2) * 0.036;
      return {
        refusal: {
          isRefused: refused,
          reason: refused
            ? "Claim 1 topology incomplete: second coordinate wheel and transducer withheld"
            : undefined,
        },
        machine: {
          ...IDLE_MACHINE,
          poseXMeters: poseX,
          poseYMeters: poseY,
          headingRad: 0,
          wheelSpeedMps: (live.current.mouseSpeedMmPerS ?? 0) / 1000,
        },
      };
    };
    const unregister = globalTransportBus.registerUpdater(
      "us-3541541-engelbart-mouse",
      integrate,
      "TS_FALLBACK",
    );
    return unregister;
  }, [live]);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    if (preset === "xray") setIsXRayMode(true);
    if (preset === "xray" || preset === "potentiometers") {
      setIsXRayMode(true);
    }
    const cfg = cameraForViewport(preset, containerRef.current?.clientWidth ?? 800);
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const toggleSound = () => {
    toggleEngine(() => {
      soundEngine.playMicroswitchClick();
    });
  };

  const handleManualClick = () => {
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    setIsClicking(true);
    if (!isAudioMuted) {
      soundEngine.playMicroswitchClick();
    }
    clickTimerRef.current = setTimeout(() => {
      setIsClicking(false);
      clickTimerRef.current = null;
    }, 250);
  };

  useEffect(
    () => () => {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const iso = cameraForViewport(DEFAULT_CAMERA_PRESET, container.clientWidth);
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
    desk.position.y = ENGELBART_DESK_Y;
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
      if (!studio.isVisible()) return;
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
        p.isClicking,
        p.isXRayMode,
        (p.claim1Active ?? 1) >= 0.5,
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
                ["potentiometers", "Transducers"],
                ["top", "Plan View"],
              ] as [CameraPreset, string][]
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyCameraPreset(preset)}
                className={`min-h-9 px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
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
            className={`min-h-9 p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm text-xs font-sans flex items-center gap-1 ${
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
            className="min-h-9 p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`min-h-9 p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
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
            className="min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
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
              <span className="text-ink-600 dark:text-ink-400">Alt. Encoder Resolution:</span>
              <span className="font-bold text-emerald-800 dark:text-emerald-400">
                {mouse.dpi} CPI
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Alt. Encoder Pulse Rate:</span>
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
            { label: "Scenario Speed", value: `${mouseSpeedMmPerS}`, unit: "mm/s" },
            { label: "Wheel Radius", value: `${wheelRadiusMm}`, unit: "mm" },
            { label: "Alt. Encoder", value: `${mouse.dpi}`, unit: "CPI" },
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
              label: "Roll constraint",
              value: "Δs = rΔθ",
              tone: claim1Active ? "ok" : "warn",
            },
            {
              label: "Coordinate axes",
              value: claim1Active ? "2 / 2" : "1 / 2 withheld",
              tone: claim1Active ? "ok" : "warn",
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
            label="Alternative Encoder PPR"
            value={pulsesPerRev}
            min={20}
            max={400}
            step={4}
            unit=" PPR"
            onChange={(val) => updateParam("pulsesPerRev", val)}
            allParams={params}
          />
        </div>

        <ClaimConstraintToggle
          patentId="us-3541541-engelbart-mouse"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            updateParam(claimConstraintStateParamId(claimNo), active ? 1 : 0)
          }
          className="mt-2"
        />

        {claimConstraintResult.refusalWarning ? (
          <div
            className="mt-3 rounded-lg border border-rose-400/50 bg-rose-600/10 px-3 py-2 text-xs text-rose-900 dark:text-rose-200"
            role="status"
          >
            {claimConstraintResult.refusalWarning}
          </div>
        ) : null}
        <p className="mt-3 text-[11px] leading-relaxed text-ink-600 dark:text-ink-400">
          Energy telemetry is withheld: US 3,541,541 prints no mouse mass, hand force, rolling
          resistance, transducer current, or supply voltage. The live values above are kinematics
          only.
        </p>
      </div>
    </div>
  );
});
