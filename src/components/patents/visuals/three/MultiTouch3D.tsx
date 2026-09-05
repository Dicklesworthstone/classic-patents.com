"use client";

import { Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  createThreeStudioScene,
  type StudioContext,
} from "@/components/patents/visuals/three/ThreeStudioScene";
import { useLiveSimParams } from "@/components/patents/visuals/three/useLiveSimParams";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import { type MultiTouchState, stepMultiTouch } from "@/physics/multiTouchKernel";
import {
  globalTransportBus,
  type TapeUpdater,
  useFrankenSimPhysics,
} from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { buildMultiTouchModel } from "./MultiTouchModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { StudioOverlayActionToolbar } from "./StudioOverlayActionToolbar";
import { createExplodedLayerStudioOverlayActions } from "./studioOverlayActions";
import { usePatentAudio } from "./usePatentAudio";

const EXHIBIT_ID = "us-7479949-multitouch";

type CameraPreset = "iso" | "touch_surface" | "command_flow" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  // Keep the whole touch surface and its support in the initial view; the
  // close presets expose contact geometry and the command-display surface.
  iso: { pos: [0, 0, 7.5], target: [0, 0, 0] },
  touch_surface: { pos: [0, 0.8, 3.2], target: [0, 0, 0] },
  command_flow: { pos: [0, 1.8, 2.5], target: [0, 0, 0] },
  top: { pos: [0, 5.0, 0.01], target: [0, 0, 0] },
};

export function MultiTouch3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [hud, setHud] = useState({
    mode: "Vertical Screen Scroll",
    zoom: 1.0,
    touchCount: 1,
    initialAngleDeg: 15,
  });
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const { params, updateParam } = usePatentPhysics(EXHIBIT_ID);
  const fingerSeparationMm = (params.fingerSeparationMm as number) ?? 50;
  const fingerCount = (params.fingerCount as number) ?? 1;
  const initialMotionAngleDeg = (params.initialMotionAngleDeg as number) ?? 15;
  const claim1HeuristicActive =
    ((params[claimConstraintStateParamId(1)] as number | undefined) ?? 1) >= 0.5;
  const claimStates = { 1: claim1HeuristicActive };

  const live = useLiveSimParams({
    fingerSeparationMm,
    fingerCount,
    initialMotionAngleDeg,
    claim1HeuristicActive,
    isCutaway,
  });

  // This exhibit deliberately has no FrankenSim SI-domain law: the grant is
  // a command-classification rule after contact detection. The transport still
  // carries one source-bounded TS-kernel state to every presentation consumer.
  useFrankenSimPhysics(EXHIBIT_ID, {
    domain: "source_bounded_command_classification",
    refusal: {
      isRefused: true,
      reason:
        "US 7,479,949 does not disclose an SI sensor or energy model; the exhibit uses a source-bounded TypeScript command classifier.",
    },
    machine: {
      poseXMeters: 0,
      poseYMeters: 0,
      headingRad: 0,
      modeLabel: "Command heuristic",
      wheelSpeedMps: 0,
    },
  });

  // One tape-bound integrator: the bus updater owns the stepMultiTouch kernel
  // step so every reader shares one deterministic gesture state. Accumulators
  // live in refs so re-registering on control changes never snaps the gesture
  // back to zero; the full typed state rides a ref because the universal tape
  // carries only the fitting command label and initial-motion direction.
  const multiTouchStateRef = useRef<MultiTouchState | undefined>(undefined);
  const simTimeRef = useRef(0);
  useEffect(() => {
    const integrate: TapeUpdater = (_prev, dt) => {
      simTimeRef.current += dt;
      const next = stepMultiTouch(
        {
          fingerCount: live.current.fingerCount ?? 1,
          fingerSeparationMm: live.current.fingerSeparationMm ?? 50,
          initialMotionAngleDeg: live.current.initialMotionAngleDeg ?? 15,
          claim1HeuristicActive: live.current.claim1HeuristicActive ?? true,
        },
        simTimeRef.current,
        multiTouchStateRef.current,
      );
      multiTouchStateRef.current = next;
      return {
        machine: {
          poseXMeters: 0,
          poseYMeters: 0,
          headingRad: (next.initialMotionAngleDeg * Math.PI) / 180,
          modeLabel: next.gestureMode,
          wheelSpeedMps: 0,
        },
      };
    };
    return globalTransportBus.registerUpdater(EXHIBIT_ID, integrate, "TS_FALLBACK");
  }, [live]);

  const studioRef = useRef<StudioContext | null>(null);

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
      container,
      cameraPos: iso.pos,
      targetPos: iso.target,
    });
    studioRef.current = studio;
    const model = buildMultiTouchModel();
    studio.scene.add(model.root);

    let hudCounter = 0;
    let rafId = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const p = live.current;

      // Pure consumer of the shared transport tape: the bus updater owns the
      // stepMultiTouch kernel step; this loop reads its latest result.
      const currentState = multiTouchStateRef.current;

      if (currentState) {
        model.updateTouchContacts(
          { x: currentState.touch1X, y: currentState.touch1Y },
          { x: currentState.touch2X, y: currentState.touch2Y },
          currentState.activeTouchCount,
        );

        const targetScale = Math.max(0.5, Math.min(3.0, currentState.zoomScale));
        const curDocS = model.docGroup.scale.x;
        const nextDocS = curDocS + (targetScale - curDocS) * 0.15;
        model.docGroup.scale.set(nextDocS, nextDocS, nextDocS);

        model.docGroup.rotation.z = 0;
        if (currentState.gestureMode === "Vertical Screen Scroll") {
          model.docGroup.position.x = 0;
          model.docGroup.position.y = currentState.touch1Y * 0.5;
        } else if (currentState.gestureMode === "Two-Dimensional Translation") {
          model.docGroup.position.x = currentState.touch1X * 0.5;
          model.docGroup.position.y = currentState.touch1Y * 0.5;
        } else {
          model.docGroup.position.set(0, 0, model.docGroup.position.z);
        }

        hudCounter += 1;
        if (hudCounter % 10 === 0) {
          setHud({
            mode: currentState.gestureMode,
            zoom: Number(currentState.zoomScale.toFixed(2)),
            touchCount: currentState.activeTouchCount,
            initialAngleDeg: currentState.initialMotionAngleDeg,
          });
        }
      }

      model.setExplodedView?.(p.isCutaway ?? false);

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
      <div className="sr-only">US 7,479,949 touch-screen command heuristics 3D</div>
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
                ["touch_surface", "Glass Surface"],
                ["command_flow", "Command Surface"],
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
        <StudioOverlayActionToolbar
          actions={createExplodedLayerStudioOverlayActions({
            isAudioMuted,
            onToggleSound: () => {
              toggleSound();
              soundEngine.playSwitchClick();
            },
            isCutaway,
            onToggleCutaway: () => setIsCutaway(!isCutaway),
            cutawayTitle: isCutaway ? "Restore Device View" : "Separate Device View",
            showUiOverlay,
            onToggleUiOverlay: () => setShowUiOverlay(!showUiOverlay),
            onResetCamera: () => applyCameraPreset("iso"),
          })}
        />

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                Command result:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">{hud.mode}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Claim 8 scale:</span>
              <span className="font-bold text-cyan-800 dark:text-cyan-400">{hud.zoom}x</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Initial angle:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {hud.initialAngleDeg.toFixed(0)}°
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Active Contacts:</span>
              <span className="font-bold text-purple-800 dark:text-purple-400">
                {hud.touchCount} pts
              </span>
            </div>
          </div>
        )}

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="Source-Bounded Command State"
          chips={[
            { label: "Gesture", value: hud.mode },
            { label: "Scale", value: `${hud.zoom}x` },
            { label: "Contacts", value: `${hud.touchCount}`, unit: "pts" },
            { label: "Initial θ", value: `${hud.initialAngleDeg.toFixed(0)}°` },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <p className="mb-3 text-xs leading-5 text-ink-600 dark:text-ink-300">
          <span className="font-semibold">Source boundary:</span> this is a deterministic TypeScript
          command-classification exhibit for the issued claims. It deliberately does not model a
          capacitance stack, scan rate, pressure, or power budget that US 7,479,949 does not
          disclose.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SensitivitySlider
            id="multiTouchSeparation"
            patentId="us-7479949-multitouch"
            paramKey="fingerSeparationMm"
            label="Contact Separation Distance"
            value={fingerSeparationMm}
            min={15}
            max={120}
            step={5}
            unit=" mm"
            onChange={(val) => updateParam("fingerSeparationMm", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="multiTouchCount"
            patentId="us-7479949-multitouch"
            paramKey="fingerCount"
            label="Active Touch Contacts"
            value={fingerCount}
            min={0}
            max={2}
            step={1}
            unit=" pts"
            onChange={(val) => updateParam("fingerCount", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="multiTouchInitialAngle"
            patentId="us-7479949-multitouch"
            paramKey="initialMotionAngleDeg"
            label="Initial Motion Angle (illustrative)"
            value={initialMotionAngleDeg}
            min={0}
            max={90}
            step={1}
            unit="° from vertical"
            onChange={(val) => updateParam("initialMotionAngleDeg", val)}
            allParams={params}
          />
        </div>

        <ClaimConstraintToggle
          patentId="us-7479949-multitouch"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            updateParam(claimConstraintStateParamId(claimNo), active ? 1 : 0)
          }
          className="mt-2"
        />
      </div>
    </div>
  );
}

export default MultiTouch3D;
