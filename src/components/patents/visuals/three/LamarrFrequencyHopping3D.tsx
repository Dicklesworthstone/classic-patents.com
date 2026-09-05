"use client";

import { Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import { readLamarrRuntimeControls, readLamarrTapeFrame } from "@/physics/lamarrSharedKernel";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { type LamarrCameraPreset, lamarrViewForViewport } from "./lamarrFrequencyHoppingCamera";
import {
  buildLamarrFrequencyHoppingModel,
  updateLamarrFrequencyHoppingKinematics,
} from "./lamarrFrequencyHoppingModel";
import { useResponsiveStudioHud } from "./StudioKernelChips";
import { StudioOverlayActionToolbar } from "./StudioOverlayActionToolbar";
import { createSourceBoundStudioOverlayActions } from "./studioOverlayActions";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

export function LamarrFrequencyHopping3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);

  // Spread Spectrum State Controls
  const { effectiveParams, updateParam, claimStates } = usePatentPhysics(
    "us-2292387-lamarr-frequency-hopping",
  );
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<LamarrCameraPreset>("iso");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  useFrankenSimPhysics("us-2292387-lamarr-frequency-hopping");
  // Pure consumer of the shared transport tape; no local integration clock.
  const recordState = readLamarrTapeFrame(readLamarrRuntimeControls(effectiveParams));
  const live = useLiveSimParams({ recordState, isCutaway });

  const applyCameraPreset = (preset: LamarrCameraPreset) => {
    setActiveCamera(preset);
    const cfg = lamarrViewForViewport(preset, containerRef.current?.clientWidth ?? 1000);
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const handleToggleSound = () => {
    toggleSound(() => {
      soundEngine.playSwitchClick();
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const iso = lamarrViewForViewport("iso", container.clientWidth);
    const studio = createThreeStudioScene({
      container,
      cameraPos: iso.pos,
      targetPos: iso.target,
    });
    studioRef.current = studio;

    const { scene, renderer, controls } = studio;

    const model = buildLamarrFrequencyHoppingModel();
    scene.add(model.root);

    // Animation Loop
    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const state = live.current;

      updateLamarrFrequencyHoppingKinematics(
        model,
        state.recordState.recordPosition,
        state.recordState.receiverEffective,
        state.recordState.warningLampOn,
        state.isCutaway,
        state.recordState.recordSynchronizationPresent,
      );

      controls.update();
      renderer.render(scene, studio.camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      model.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  useEffect(() => {
    const restoreResponsiveView = () => {
      const container = containerRef.current;
      if (!container) return;
      const config = lamarrViewForViewport(activeCamera, container.clientWidth);
      studioRef.current?.controls.setView(config.pos, config.target);
    };
    window.addEventListener("resize", restoreResponsiveView);
    return () => window.removeEventListener("resize", restoreResponsiveView);
  }, [activeCamera]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Hedy Lamarr & George Antheil Secret Communication System 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-9.5rem)] sm:max-w-[calc(100%-28rem)] gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["roll", "Record Strip"],
                ["waterfall", "Channel Rows"],
                ["escapement", "Switch Head"],
                ["torpedo", "Torpedo Control"],
                ["top", "Top View"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => applyCameraPreset(id)}
                className={`min-h-9 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-sans whitespace-nowrap shrink-0 transition-colors ${
                  activeCamera === id
                    ? "bg-amber-700 dark:bg-amber-700 text-white font-semibold shadow-xs"
                    : "text-ink-700 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <StudioOverlayActionToolbar
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex gap-1.5 sm:gap-2"
          actions={createSourceBoundStudioOverlayActions({
            isCutaway,
            onToggleCutaway: () => setIsCutaway(!isCutaway),
            cutawayTitle: isCutaway
              ? "Switch to Solid Torpedo Bay"
              : "Switch to Torpedo Bay Cutaway",
            showUiOverlay,
            onToggleUiOverlay: () => setShowUiOverlay(!showUiOverlay),
            isAudioMuted,
            onToggleSound: handleToggleSound,
            audioAriaLabel: isAudioMuted ? "Enable Sound Synthesis" : "Mute Sound",
            audioTitle: isAudioMuted ? "Enable Sound Synthesis" : "Mute Sound",
            showCalloutPins,
            onToggleCalloutPins: () => setShowCalloutPins(!showCalloutPins),
            onResetCamera: () => applyCameraPreset("iso"),
          })}
        />

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                Transmitter record row:
              </span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {recordState.transmitterRow} (
                {!recordState.recordSynchronizationPresent
                  ? "receiver record withheld"
                  : recordState.receiverEffective
                    ? "D–G receiver channel"
                    : "A–C false channel"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Lamp 43:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {recordState.warningLampOn
                  ? "ON (false channel)"
                  : recordState.recordSynchronizationPresent
                    ? "OFF (matched)"
                    : "OFF (receiver withheld)"}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
        <div>
          <SensitivitySlider
            id="lamarrRecordPosition"
            patentId="us-2292387-lamarr-frequency-hopping"
            paramKey="recordPosition"
            label="Transmitter record position"
            value={recordState.recordPosition}
            min={0}
            max={6}
            step={1}
            unit="row"
            auditPrimaryControl={true}
            onChange={(next) => updateParam("recordPosition", next)}
            allParams={effectiveParams as Record<string, number>}
          />
          <span className="text-ink-500 mt-1 block">
            Row {recordState.transmitterRow} · transmitter 7 positions · receiver 4 effective
            positions
          </span>
        </div>
        <div className="space-y-2">
          <span>Command labels</span>
          <div className="flex gap-2">
            <span className="rounded border border-cyan-700 px-2 py-1">100-cycle → left step</span>
            <span className="rounded border border-cyan-700 px-2 py-1">500-cycle → right step</span>
          </div>
          <span>
            {recordState.warningLampOn
              ? "Lamp 43 warns: do not send a control impulse."
              : recordState.recordSynchronizationPresent
                ? "Lamp 43 off: records select the same channel."
                : "Claim 1 probe: the receiver record and synchronization path are withheld."}
          </span>
        </div>
      </div>

      <div className="px-4 pb-4 bg-parchment-100/90 dark:bg-ink-900/90">
        <ClaimConstraintToggle
          patentId="us-2292387-lamarr-frequency-hopping"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            updateParam(claimConstraintStateParamId(claimNo), active ? 1 : 0)
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-2292387-lamarr-frequency-hopping"
          params={effectiveParams}
          className="mt-3"
        />
      </div>
    </div>
  );
}
