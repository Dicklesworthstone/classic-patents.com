"use client";

import { Camera } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import {
  KILBY_FIGURE_7_VALUES,
  KILBY_PRINTED_WAFER,
  readKilbySourceCircuitControls,
  stepKilbySourceCircuitTopology,
} from "@/physics/kilbySourceCircuitKernel";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import {
  KILBY_SOURCE_CIRCUIT_CAMERA_PRESETS,
  type KilbySourceCircuitCameraPreset,
  kilbySourceCircuitCameraForViewport,
} from "./kilbySourceCircuitCamera";
import { buildKilbySourceCircuitModel } from "./kilbySourceCircuitModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { StudioOverlayActionToolbar } from "./StudioOverlayActionToolbar";
import { createStandardStudioOverlayActions } from "./studioOverlayActions";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

interface Kilby3DProps {
  className?: string;
}

/** Source-bounded reconstruction of Kilby's Fig. 6a monolithic multivibrator. */
export const KilbyIntegratedCircuit3D: React.FC<Kilby3DProps> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const frameRef = useRef<number | null>(null);
  const { params, updateParam } = usePatentPhysics("us-3138743-kilby-integrated-circuit");
  const controls = readKilbySourceCircuitControls(params);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const [activeView, setActiveView] = useState<KilbySourceCircuitCameraPreset>("figure6a");
  const [cutaway, setCutaway] = useState(false);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const state = stepKilbySourceCircuitTopology({
    ...controls,
    sectionRevealFraction: cutaway ? 1 : controls.sectionRevealFraction,
    claim1ConductiveMeansPresent: claimStates[1] === false ? 0 : 1,
  });
  const live = useLiveSimParams({ state });

  useFrankenSimPhysics("us-3138743-kilby-integrated-circuit", {
    domain: "semiconductor_microarch",
    refusal: { isRefused: true, reason: state.refusal.reason },
  });

  const applyView = (preset: KilbySourceCircuitCameraPreset) => {
    setActiveView(preset);
    const container = containerRef.current;
    const view = kilbySourceCircuitCameraForViewport(
      preset,
      container?.clientWidth ?? 0,
      container?.clientHeight ?? 0,
    );
    studioRef.current?.controls.setView(view.pos, view.target);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const initial = kilbySourceCircuitCameraForViewport(
      "figure6a",
      container.clientWidth,
      container.clientHeight,
    );
    const studio = createThreeStudioScene({
      container,
      cameraPos: initial.pos,
      targetPos: initial.target,
    });
    studioRef.current = studio;
    const model = buildKilbySourceCircuitModel();
    studio.scene.add(model.root);
    const clock = createStudioClock();

    const animate = (now: number) => {
      frameRef.current = requestAnimationFrame(animate);
      if (!studio.isVisible()) {
        return;
      }
      clock.pump(now);
      model.update(live.current.state);
      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      model.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  // A gallery reader can rotate from a desktop-width overview into a portrait
  // phone without remounting the studio. Reapply only the broad Fig. 6a view;
  // deliberate close inspection presets keep their chosen framing.
  useEffect(() => {
    if (activeView !== "figure6a") return;
    const reselectResponsiveOverview = () => {
      const container = containerRef.current;
      if (!container) return;
      const view = kilbySourceCircuitCameraForViewport(
        "figure6a",
        container.clientWidth,
        container.clientHeight,
      );
      studioRef.current?.controls.setView(view.pos, view.target);
    };
    window.addEventListener("resize", reselectResponsiveOverview);
    window.addEventListener("orientationchange", reselectResponsiveOverview);
    return () => {
      window.removeEventListener("resize", reselectResponsiveOverview);
      window.removeEventListener("orientationchange", reselectResponsiveOverview);
    };
  }, [activeView]);

  const actions = createStandardStudioOverlayActions({
    isCutaway: cutaway,
    onToggleCutaway: () => setCutaway((value) => !value),
    cutawayTitle: cutaway ? "Restore opaque germanium wafer" : "Reveal integral wafer regions",
    isAudioMuted,
    onToggleSound: () => {
      toggleSound();
      soundEngine.playSwitchClick();
    },
    showUiOverlay,
    onToggleUiOverlay: () => setShowUiOverlay((value) => !value),
    overlayTitle: showUiOverlay ? "Hide source labels" : "Show source labels",
    onResetCamera: () => applyView("figure6a"),
  });

  return (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-2xl border border-parchment-300 bg-parchment-50/60 shadow-patent dark:border-ink-800 dark:bg-ink-950/80 ${className}`}
    >
      <div className="sr-only">
        Kilby Figure 6a single-body germanium circuit with attached Kovar leads and thermally bonded
        gold wires
      </div>
      <div className="relative min-h-[410px] w-full flex-1 cursor-grab active:cursor-grabbing sm:min-h-[500px]">
        <div ref={containerRef} className="absolute inset-0 h-full w-full" />
        {showUiOverlay && (
          <div className="absolute top-4 left-4 z-10 hidden max-w-[calc(100%-26rem)] flex-nowrap gap-1.5 overflow-x-auto rounded-xl border border-parchment-300 bg-white/85 p-1.5 text-xs shadow-sm backdrop-blur-md sm:flex dark:border-ink-700 dark:bg-ink-900/85">
            <span className="flex shrink-0 items-center gap-1 px-2 py-1 font-sans text-ink-500">
              <Camera className="h-3.5 w-3.5" /> View:
            </span>
            {(
              Object.entries(KILBY_SOURCE_CIRCUIT_CAMERA_PRESETS) as [
                KilbySourceCircuitCameraPreset,
                (typeof KILBY_SOURCE_CIRCUIT_CAMERA_PRESETS)[KilbySourceCircuitCameraPreset],
              ][]
            ).map(([preset, view]) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyView(preset)}
                className={`min-h-9 shrink-0 rounded-lg px-2 py-1 font-medium ${activeView === preset ? "bg-amber-600 font-semibold text-white" : "text-ink-700 hover:bg-parchment-200 dark:text-ink-300"}`}
              >
                {view.label}
              </button>
            ))}
          </div>
        )}
        <StudioOverlayActionToolbar actions={actions} />

        {showUiOverlay && (
          <div className="pointer-events-none absolute bottom-4 left-4 z-10 hidden max-w-sm rounded-xl border border-parchment-300 bg-parchment-50/95 p-3 font-mono text-xs text-ink-900 shadow-md sm:block dark:border-ink-800 dark:bg-ink-950/95 dark:text-parchment-100">
            <div className="mb-2 border-b border-parchment-200 pb-1 font-sans font-semibold text-amber-800 dark:border-ink-800 dark:text-amber-300">
              FIG. 6a SOURCE CONSTRUCTION
            </div>
            <p>50 alloyed gold-plated Kovar leads contact the wafer edge</p>
            <p>51–54 evaporated-gold contact areas; 56 aluminum emitters</p>
            <p>60 etched mesa/slot isolation; 70 thermally bonded gold wires</p>
            <p>R1–R8, C1–C2, and T1–T2 remain integral to one body</p>
          </div>
        )}
        <StudioKernelChips
          side="right"
          visible={showUiOverlay}
          title="SOURCE-BOUNDED SOLID CIRCUIT"
          chips={[
            {
              label: "Claim 1",
              value: state.claim1TopologyComplete ? "held" : "withheld",
              tone: state.claim1TopologyComplete ? "ok" : "hot",
            },
            { label: "wafer", value: "0.200 × 0.080", unit: "in" },
            { label: "body", value: "0.0025", unit: "in" },
            { label: "n layer", value: "0.7", unit: "mil" },
            { label: "performance", value: "refused", tone: "hot" },
          ]}
        />
      </div>

      <div className="border-t border-parchment-300 bg-parchment-100/90 p-4 dark:border-ink-800 dark:bg-ink-900/90">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="flex justify-between text-xs">
              <span className="font-medium text-ink-700 dark:text-ink-300">
                Semiconductor section reveal
              </span>
              <span className="font-mono font-bold">
                {(controls.sectionRevealFraction * 100).toFixed(0)}%
              </span>
            </span>
            <input
              type="range"
              aria-label="Semiconductor section reveal"
              min={0}
              max={1}
              step={0.01}
              value={controls.sectionRevealFraction}
              onChange={(event) => updateParam("sectionRevealFraction", Number(event.target.value))}
              className="h-11 w-full cursor-pointer accent-cyan-600"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="flex justify-between text-xs">
              <span className="font-medium text-ink-700 dark:text-ink-300">Wire 70 arch</span>
              <span className="font-mono font-bold">
                {(controls.wireArchFraction * 100).toFixed(0)}%
              </span>
            </span>
            <input
              type="range"
              aria-label="Thermally bonded wire arch"
              min={0.2}
              max={1}
              step={0.01}
              value={controls.wireArchFraction}
              onChange={(event) => updateParam("wireArchFraction", Number(event.target.value))}
              className="h-11 w-full cursor-pointer accent-amber-600"
            />
          </label>
        </div>
        <ClaimConstraintToggle
          patentId="us-3138743-kilby-integrated-circuit"
          claimStates={claimStates}
          onToggleClaim={(claimNumber, active) => {
            setClaimStates((previous) => ({ ...previous, [claimNumber]: active }));
            if (claimNumber === 1) updateParam("claim1ConductiveMeansPresent", active ? 1 : 0);
          }}
          className="mt-3"
        />
        <p className="mt-3 text-[11px] leading-relaxed text-ink-600 dark:text-ink-400">
          The grant prints the {KILBY_PRINTED_WAFER.resistivityOhmCm} Ω·cm germanium wafer and
          Figure 7 values ({KILBY_FIGURE_7_VALUES.r1R2Ohms / 1000} kΩ,
          {KILBY_FIGURE_7_VALUES.r3R8Ohms / 1000} kΩ, {KILBY_FIGURE_7_VALUES.r4R5R6R7Ohms} Ω, and{" "}
          {KILBY_FIGURE_7_VALUES.c1C2Microfarads} µF), but no supply voltage, junction geometry,
          transistor gain, measured frequency, delay, power, or thermal point. Those outputs are
          refused.
        </p>
      </div>
    </div>
  );
};

export default KilbyIntegratedCircuit3D;
