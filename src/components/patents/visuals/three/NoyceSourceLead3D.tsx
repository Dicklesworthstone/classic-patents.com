"use client";

import { Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  readNoycePlanarLeadControls,
  stepNoycePlanarLeadTopology,
} from "@/physics/noycePlanarLeadKernel";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { buildNoyceSourceLeadModel } from "./noyceSourceLeadModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { StudioOverlayActionToolbar } from "./StudioOverlayActionToolbar";
import { createStandardStudioOverlayActions } from "./studioOverlayActions";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "figure1" | "crossSection" | "oxideBridge" | "contacts" | "backContact";

const VIEWS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  figure1: { pos: [7.8, 6.8, 9.2], target: [0, -0.1, 0] },
  crossSection: { pos: [0, 2.1, 8.5], target: [0, -0.25, 0] },
  oxideBridge: { pos: [4.5, 3.1, 4.6], target: [0.8, 0.45, 0] },
  contacts: { pos: [2.2, 4.8, 3.2], target: [0, 0.45, 0] },
  backContact: { pos: [-4.6, -2.1, 5.6], target: [0, -0.8, 0] },
};

const PHONE_VIEW = {
  pos: [10.5, 10.2, 16.5] as [number, number, number],
  target: [0, -0.1, 0] as [number, number, number],
};

function viewFor(preset: CameraPreset) {
  return preset === "figure1" && window.matchMedia("(max-width: 639px)").matches
    ? PHONE_VIEW
    : VIEWS[preset];
}

export function NoycePlanarIC3D() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const frameRef = useRef<number | null>(null);
  const { params, updateParam } = usePatentPhysics("us-2981877-noyce-ic");
  const controls = readNoycePlanarLeadControls(params);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const [activeView, setActiveView] = useState<CameraPreset>("figure1");
  const [cutaway, setCutaway] = useState(false);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const state = stepNoycePlanarLeadTopology({
    ...controls,
    claim1OxideBridgePresent: claimStates[1] === false ? 0 : 1,
  });
  const live = useLiveSimParams({ state, cutaway });

  useFrankenSimPhysics("us-2981877-noyce-ic", {
    domain: "semiconductor_microarch",
    refusal: { isRefused: true, reason: state.refusal.reason },
  });

  const applyView = (preset: CameraPreset) => {
    setActiveView(preset);
    const view = viewFor(preset);
    studioRef.current?.controls.setView(view.pos, view.target);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const initial = viewFor("figure1");
    const studio = createThreeStudioScene({
      container,
      cameraPos: initial.pos,
      targetPos: initial.target,
    });
    studioRef.current = studio;
    const model = buildNoyceSourceLeadModel();
    studio.scene.add(model.root);
    const clock = createStudioClock();

    const animate = (now: number) => {
      frameRef.current = requestAnimationFrame(animate);
      if (!studio.isVisible()) {
        return;
      }
      clock.pump(now);
      model.update(live.current.state, live.current.cutaway);
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

  const actions = createStandardStudioOverlayActions({
    isCutaway: cutaway,
    onToggleCutaway: () => setCutaway((value) => !value),
    cutawayTitle: cutaway ? "Show full semiconductor body" : "Show sectioned semiconductor body",
    isAudioMuted,
    onToggleSound: () => {
      toggleSound();
      soundEngine.playSwitchClick();
    },
    showUiOverlay,
    onToggleUiOverlay: () => setShowUiOverlay((value) => !value),
    overlayTitle: showUiOverlay ? "Hide source labels" : "Show source labels",
    onResetCamera: () => applyView("figure1"),
  });

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-parchment-300 bg-parchment-50/60 shadow-patent dark:border-ink-800 dark:bg-ink-950/80">
      <div className="sr-only">
        Noyce Figure 1 and 2 oxide-insulated semiconductor lead crossing in three dimensions
      </div>
      <div className="relative min-h-[410px] w-full flex-1 cursor-grab active:cursor-grabbing sm:min-h-[500px]">
        <div ref={containerRef} className="absolute inset-0 h-full w-full" />
        {showUiOverlay && (
          <div className="absolute top-4 left-4 z-10 hidden max-w-[calc(100%-26rem)] flex-nowrap gap-1.5 overflow-x-auto rounded-xl border border-parchment-300 bg-white/85 p-1.5 text-xs shadow-sm backdrop-blur-md sm:flex dark:border-ink-700 dark:bg-ink-900/85">
            <span className="flex shrink-0 items-center gap-1 px-2 py-1 font-sans text-ink-500">
              <Camera className="h-3.5 w-3.5" /> View:
            </span>
            {(
              [
                ["figure1", "Fig. 1 Plan"],
                ["crossSection", "Fig. 2 Section"],
                ["oxideBridge", "Oxide Bridge"],
                ["contacts", "Contacts 6/8"],
                ["backContact", "Back Contact 10"],
              ] as const
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyView(preset)}
                className={`min-h-9 shrink-0 rounded-lg px-2 py-1 font-medium ${activeView === preset ? "bg-amber-600 font-semibold text-white" : "text-ink-700 hover:bg-parchment-200 dark:text-ink-300"}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
        <StudioOverlayActionToolbar actions={actions} />

        {showUiOverlay && (
          <div className="pointer-events-none absolute bottom-4 left-4 z-10 hidden max-w-sm rounded-xl border border-parchment-300 bg-parchment-50/95 p-3 font-mono text-xs text-ink-900 shadow-md sm:block dark:border-ink-800 dark:bg-ink-950/95 dark:text-parchment-100">
            <div className="mb-2 border-b border-parchment-200 pb-1 font-sans font-semibold text-amber-800 dark:border-ink-800 dark:text-amber-300">
              FIGS. 1–2 SOURCE RELATIONSHIP
            </div>
            <p>6 discoid emitter contact → lead 7</p>
            <p>8 C-shaped base contact → lead 9</p>
            <p>5″ oxide tongue carries lead 7 across junctions 3 and 4</p>
            <p>10 back-side collector coating remains attached to body 1</p>
          </div>
        )}
        <StudioKernelChips
          side="right"
          visible={showUiOverlay}
          title="SOURCE-BOUNDED PLANAR LEAD"
          chips={[
            {
              label: "Claim 1",
              value: state.claim1TopologyComplete ? "held" : "withheld",
              tone: state.claim1TopologyComplete ? "ok" : "hot",
            },
            { label: "oxide", value: controls.oxideThicknessUm.toFixed(1), unit: "µm" },
            { label: "junction", value: "surface-reaching" },
            {
              label: "lead",
              value: state.leadFitsContactGap ? "gap-clear" : "contacting",
              tone: state.leadFitsContactGap ? "ok" : "hot",
            },
            { label: "delay", value: "refused", tone: "hot" },
          ]}
        />
      </div>

      <div className="border-t border-parchment-300 bg-parchment-100/90 p-4 dark:border-ink-800 dark:bg-ink-900/90">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="flex justify-between text-xs">
              <span className="font-medium text-ink-700 dark:text-ink-300">Oxide thickness</span>
              <span className="font-mono font-bold">{controls.oxideThicknessUm.toFixed(1)} µm</span>
            </span>
            <input
              type="range"
              aria-label="Oxide thickness"
              min={0.5}
              max={2}
              step={0.1}
              value={controls.oxideThicknessUm}
              onChange={(event) => updateParam("oxideThicknessUm", Number(event.target.value))}
              className="h-11 w-full cursor-pointer accent-cyan-600"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="flex justify-between text-xs">
              <span className="font-medium text-ink-700 dark:text-ink-300">
                Lead width / contact span
              </span>
              <span className="font-mono font-bold">
                {(controls.leadStripWidthFraction * 100).toFixed(0)}%
              </span>
            </span>
            <input
              type="range"
              aria-label="Lead width relative to contact span"
              min={0.08}
              max={0.28}
              step={0.01}
              value={controls.leadStripWidthFraction}
              onChange={(event) =>
                updateParam("leadStripWidthFraction", Number(event.target.value))
              }
              className="h-11 w-full cursor-pointer accent-amber-600"
            />
          </label>
        </div>
        <ClaimConstraintToggle
          patentId="us-2981877-noyce-ic"
          claimStates={claimStates}
          onToggleClaim={(claimNumber, active) =>
            setClaimStates((previous) => ({ ...previous, [claimNumber]: active }))
          }
          className="mt-3"
        />
        <p className="mt-3 text-[11px] leading-relaxed text-ink-600 dark:text-ink-400">
          The grant gives the topology and an oxide-thickness example, but no bias voltage, dopant
          profile, junction area, dielectric constant, or clock. Capacitance, depletion width,
          propagation delay, maximum frequency, and power are therefore refused.
        </p>
      </div>
    </div>
  );
}

export default NoycePlanarIC3D;
