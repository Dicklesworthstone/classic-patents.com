"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  createThreeStudioScene,
  type StudioContext,
} from "@/components/patents/visuals/three/ThreeStudioScene";
import { useLiveSimParams } from "@/components/patents/visuals/three/useLiveSimParams";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { type DaVinciState, readDaVinciControls, stepDaVinci } from "@/physics/daVinciKernel";
import {
  daVinciTopologyKernelSource,
  ensureDaVinciTopologyWasm,
  tryDaVinciTopologyWasmStep,
} from "@/physics/daVinciWasm";
import {
  globalTransportBus,
  type TapeUpdater,
  useFrankenSimPhysics,
} from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { buildDaVinciModel } from "./DaVinciModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { usePatentAudio } from "./usePatentAudio";

const EXHIBIT_ID = "us-6331181-davinci";

type CameraPreset = "iso" | "master_console" | "slave_wrist" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [4.4, 2.8, 6], target: [-0.55, 0.35, 0] },
  master_console: { pos: [2.5, 2.2, 4.2], target: [0, 0.75, 0] },
  slave_wrist: { pos: [1.25, 0.55, 2.0], target: [0, -0.15, 0.15] },
  top: { pos: [0, 5.6, 0.01], target: [-0.55, 0, 0] },
};

const IDLE_MACHINE = {
  poseXMeters: 0,
  poseYMeters: 0,
  headingRad: 0,
  modeLabel: "teleop slave arm",
  wheelSpeedMps: 0,
};

export function DaVinci3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [hud, setHud] = useState({
    scale: 3,
    compatibilitySignalPercent: 100,
    tipVelocity: 0,
    isColliding: false,
    isGrasped: false,
    contactForceN: 0,
    obstacleDistanceMm: 50,
  });
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const [topologyKernelSource, setTopologyKernelSource] = useState(daVinciTopologyKernelSource());
  const { params, updateParam } = usePatentPhysics(EXHIBIT_ID);
  const motionScaleRatio = (params.motionScaleRatio as number) ?? 3.0;
  const tremorFilterEnabled = (params.tremorFilterEnabled as number) ?? 1;
  const masterInputSpeedMps = (params.masterInputSpeedMps as number) ?? 0.5;
  const gripAngleDeg = (params.gripAngleDeg as number) ?? 30;

  const live = useLiveSimParams({
    motionScaleRatio,
    tremorFilterEnabled,
    masterInputSpeedMps,
    gripAngleDeg,
    isCutaway,
  });

  // Shared transport tape: the slave-arm pose publishes to the patentId-keyed
  // bus so every consumer reads one deterministic envelope.
  useFrankenSimPhysics("us-6331181-davinci", {
    domain: "solid_mechanics",
    timestampMs: 0,
    timeStepDt: 1 / 60,
    refusal: { isRefused: false },
    machine: { ...IDLE_MACHINE },
  });

  const studioRef = useRef<StudioContext | null>(null);

  useEffect(() => {
    let active = true;
    void ensureDaVinciTopologyWasm().then((nextSource) => {
      if (active) setTopologyKernelSource(nextSource);
    });
    return () => {
      active = false;
    };
  }, []);

  // One tape-bound stepper (br-ixl.3): the registered updater owns the
  // per-tick daVinciKernel integration (two 1/120 sub-steps per 1/60 bus tick,
  // matching the previous TickScheduler cadence). The render loop only
  // consumes the latest kernel state. Accumulators live in refs so
  // re-registering on control changes never resets the presentation clock.
  const simTimeRef = useRef(0);
  const kernelStateRef = useRef<DaVinciState | null>(null);
  useEffect(() => {
    const integrate: TapeUpdater = (_prev, dt) => {
      const controls = readDaVinciControls({
        motionScaleRatio: live.current.motionScaleRatio,
        tremorFilterEnabled: live.current.tremorFilterEnabled,
        masterInputSpeedMps: live.current.masterInputSpeedMps,
        gripAngleDeg: live.current.gripAngleDeg,
      });
      const subSteps = Math.max(1, Math.round(dt / (1 / 120)));
      let state = kernelStateRef.current ?? undefined;
      const subDt = dt / subSteps;
      for (let sub = 0; sub < subSteps; sub++) {
        simTimeRef.current += subDt;
        state = stepDaVinci(controls, simTimeRef.current, state, subDt);
      }
      kernelStateRef.current = state ?? null;
      const s = kernelStateRef.current;
      return s
        ? {
            refusal: { isRefused: false },
            machine: {
              poseXMeters: s.tipX,
              poseYMeters: s.tipY,
              headingRad: s.wristYawRad,
              modeLabel: s.isGrasped
                ? "tool grasped"
                : s.isColliding
                  ? "contact resolved"
                  : "teleop tool clear",
              wheelSpeedMps: s.tipVelocityMms / 1000,
            },
          }
        : null;
    };
    globalTransportBus.registerUpdater("us-6331181-davinci", integrate, "TS_FALLBACK");
    return () => globalTransportBus.unregisterUpdater("us-6331181-davinci");
  }, [
    live.current.motionScaleRatio,
    live.current.tremorFilterEnabled,
    live.current.masterInputSpeedMps,
    live.current.gripAngleDeg,
  ]);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const iso = CAMERA_PRESETS.iso;
    const studio = createThreeStudioScene({
      container: container as HTMLDivElement,
      cameraPos: iso.pos,
      targetPos: iso.target,
    });
    studioRef.current = studio;
    const model = buildDaVinciModel();
    studio.scene.add(model.root);

    // --- RENDER LOOP: pure consumer of the shared transport tape ---
    // The registered updater owns the daVinciKernel integration; this loop
    // only paces mesh interpolation and HUD refresh from the latest state.
    let hudCounter = 0;
    let rafId = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const p = live.current;
      const currentState = kernelStateRef.current;

      if (currentState) {
        const topology = tryDaVinciTopologyWasmStep(
          currentState.baseYawRad,
          currentState.shoulderPitchRad,
          currentState.wristPitchRad,
          currentState.wristYawRad,
          currentState.wristRollRad,
          Math.max(-1, Math.min(1, currentState.slaveY)),
          currentState.compatibilitySignalPercent > 0,
        );
        model.updateArmPose(
          topology?.base_yaw_rad ?? currentState.baseYawRad,
          topology?.carriage_pitch_rad ?? currentState.shoulderPitchRad,
          currentState.elbowPitchRad,
          topology?.distal_pitch_rad ?? currentState.wristPitchRad,
          topology?.distal_yaw_rad ?? currentState.wristYawRad,
          topology?.tool_roll_rad ?? currentState.wristRollRad,
          currentState.gripRad,
          [currentState.masterX, currentState.masterY + 0.8, currentState.masterZ],
          [currentState.tipX, currentState.tipY, currentState.tipZ],
        );

        // Anti-Clipping Physical Object Pose & Contact Gizmo
        model.setCupPose(
          currentState.cupX,
          currentState.cupY,
          currentState.cupZ,
          currentState.cupRotY,
          currentState.isColliding,
          currentState.isGrasped,
        );

        model.setContactGizmo(
          currentState.contactPointX,
          currentState.contactPointY,
          currentState.contactPointZ,
          currentState.contactNormalX,
          currentState.contactNormalY,
          currentState.contactNormalZ,
          currentState.isColliding,
        );

        hudCounter += 1;
        if (hudCounter % 10 === 0) {
          setHud({
            scale: p.motionScaleRatio ?? 3,
            compatibilitySignalPercent: currentState.compatibilitySignalPercent,
            tipVelocity: currentState.tipVelocityMms,
            isColliding: currentState.isColliding,
            isGrasped: currentState.isGrasped,
            contactForceN: currentState.contactForceN,
            obstacleDistanceMm: currentState.obstacleDistanceMm,
          });
        }
      }

      model.setCutaway?.(p.isCutaway ?? false);

      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      model.dispose();
      studio.dispose();
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">US 6,331,181 robotic surgical tool interface 3D model</div>
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
                ["master_console", "Surgeon Console"],
                ["slave_wrist", "Articulated Wrist"],
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
            onClick={() => {
              toggleSound();
              soundEngine.playSwitchClick();
            }}
            className="min-h-9 p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            aria-label={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            className={`min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              isCutaway
                ? "bg-cyan-600 text-white border-cyan-700 shadow-md ring-2 ring-cyan-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
            title={isCutaway ? "Solid Shaft Casing" : "Transparent Wrist & Shaft Cutaway"}
            aria-label={isCutaway ? "Solid Shaft Casing" : "Transparent Wrist & Shaft Cutaway"}
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`min-h-9 p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showUiOverlay
                ? "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
                : "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
            }`}
            title={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
            aria-label={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
          >
            {showUiOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
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
                Illustrative offset:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {motionScaleRatio}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Illustrative drive speed:</span>
              <span className="font-bold text-cyan-800 dark:text-cyan-400">
                {masterInputSpeedMps.toFixed(2)} m/s
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">
                Illustrative end-effector angle:
              </span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {gripAngleDeg}°
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Compatibility signal:</span>
              <span className="font-bold text-purple-800 dark:text-purple-400">
                {hud.compatibilitySignalPercent > 0 ? "PRESENT" : "ABSENT"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-parchment-200 dark:border-ink-800/80 pt-1">
              <span className="text-ink-600 dark:text-ink-400">Collision State:</span>
              <span
                className={`font-bold ${
                  hud.isGrasped
                    ? "text-emerald-600 dark:text-emerald-400"
                    : hud.isColliding
                      ? "text-rose-600 dark:text-rose-400 animate-pulse"
                      : "text-ink-500 dark:text-ink-400"
                }`}
              >
                {hud.isGrasped ? "GRASPED" : hud.isColliding ? "CONTACT (RESOLVED)" : "CLEAR"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Contact Force:</span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {hud.contactForceN > 0 ? `${hud.contactForceN.toFixed(1)} N` : "0.0 N"}
              </span>
            </div>
          </div>
        )}

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="Da Vinci Tool Interface & Contact Telemetry"
          chips={[
            {
              label: "Topology",
              value: topologyKernelSource === "wasm" ? "fs-mbd WASM" : "host fallback",
              tone: topologyKernelSource === "wasm" ? "ok" : "warn",
            },
            { label: "Illustrative offset", value: `${hud.scale}` },
            {
              label: "Collision",
              value: hud.isGrasped ? "Grasped" : hud.isColliding ? "Contact" : "Clear",
              tone: hud.isGrasped ? "ok" : hud.isColliding ? "warn" : "ok",
            },
            {
              label: "Force",
              value: hud.contactForceN > 0 ? hud.contactForceN.toFixed(1) : "0.0",
              unit: "N",
            },
            { label: "Tip Speed", value: hud.tipVelocity.toFixed(1), unit: "mm/s" },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SensitivitySlider
            id="davinciScaleRatio"
            patentId="us-6331181-davinci"
            paramKey="motionScaleRatio"
            label="Illustrative calibration offset"
            value={motionScaleRatio}
            min={1}
            max={10}
            step={1}
            unit=""
            onChange={(val) => updateParam("motionScaleRatio", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="davinciHandSpeed"
            patentId="us-6331181-davinci"
            paramKey="masterInputSpeedMps"
            label="Illustrative drive speed"
            value={masterInputSpeedMps}
            min={0.2}
            max={1.5}
            step={0.05}
            unit=" m/s"
            onChange={(val) => updateParam("masterInputSpeedMps", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="davinciGripAngle"
            patentId="us-6331181-davinci"
            paramKey="gripAngleDeg"
            label="Illustrative end-effector angle"
            value={gripAngleDeg}
            min={0}
            max={60}
            step={5}
            unit="°"
            onChange={(val) => updateParam("gripAngleDeg", val)}
            allParams={params}
          />
        </div>

        <ClaimConstraintToggle
          patentId="us-6331181-davinci"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <p className="mt-3 text-[10px] text-ink-500 dark:text-ink-400">
          Source boundary: linkage scale, trajectory, contact stiffness, and cup mechanics are
          illustrative. The grant supplies no motor-power or friction data, so no SI energy strip is
          shown.
        </p>
      </div>
    </div>
  );
}

export default DaVinci3D;
