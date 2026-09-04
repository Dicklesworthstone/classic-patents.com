"use client";

import { Camera, Eye, EyeOff, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ensureGenericWasm } from "@/physics/genericWasm";
import { createStudioClock } from "@/physics/tickScheduler";
import {
  globalTransportBus,
  type TapeUpdater,
  useFrankenSimPhysics,
} from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import {
  linotypeCameraForViewport,
  type MergenthalerLinotypeCameraPreset,
} from "./mergenthalerLinotypeCamera";
import {
  buildMergenthalerMatrixBarModel,
  updateMergenthalerMatrixBarModel,
} from "./mergenthalerMatrixBarModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

export function MergenthalerLinotype3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  useEffect(() => {
    void ensureGenericWasm();
  }, []);

  const { params, updateParam } = usePatentPhysics("us-313224-mergenthaler-linotype");
  // The registry still carries legacy parameter keys for route compatibility.
  // This source face interprets them only as declared display coordinates; it
  // never projects later commercial Linotype measurements onto US 313,224.
  const selectionCadencePerMin = params.matrixRate ?? 60;
  const stopTravelDisplay = params.spacebandWedge ?? 6.5;
  const moldClosurePct = Math.round((((params.potTemp ?? 260) - 220) / 100) * 100);
  const claim1Active = claimStates[1] !== false;
  const [activeCamera, setActiveCamera] = useState<MergenthalerLinotypeCameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    selectionCadencePerMin,
    stopTravelDisplay,
    moldClosurePct,
    claim1Active,
    isAudioMuted,
    isCutaway,
  });

  // Shared transport tape envelope: pot thermodynamics and cycle pose
  // publish to the patentId-keyed bus.
  useFrankenSimPhysics("us-313224-mergenthaler-linotype", {
    domain: "thermodynamics_transport",
    refusal: {
      isRefused: true,
      reason:
        "US 313,224 supplies mechanism topology but no dimensions, loads, temperature, pressure, or cadence for an SI solve.",
    },
  });

  const cycle01Ref = useRef(0);
  useEffect(() => {
    const integrate: TapeUpdater = (_prev, dt) => {
      if (live.current.claim1Active) {
        cycle01Ref.current =
          (cycle01Ref.current + (live.current.selectionCadencePerMin / 60) * dt) % 1;
      }
      return {
        machine: {
          poseXMeters: 0,
          poseYMeters: 0,
          headingRad: cycle01Ref.current * Math.PI * 2,
          modeLabel: live.current.claim1Active
            ? "continuous matrix-bar selection"
            : "excluded flexible-band comparison",
          wheelSpeedMps: 0,
        },
      };
    };
    const unregister = globalTransportBus.registerUpdater(
      "us-313224-mergenthaler-linotype",
      integrate,
      "TS_FALLBACK",
    );
    return unregister;
  }, [live]);

  const applyCameraPreset = (preset: MergenthalerLinotypeCameraPreset) => {
    setActiveCamera(preset);
    const cfg = linotypeCameraForViewport(preset, containerRef.current?.clientWidth ?? 1024);
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const toggleSound = () => {
    toggleEngine(() => {
      soundEngine.playSwitchClick();
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const iso = linotypeCameraForViewport("iso", container.clientWidth);
    const studio = createThreeStudioScene({
      container,
      cameraPos: iso.pos,
      targetPos: iso.target,
    });
    studioRef.current = studio;

    const { scene, camera, renderer, controls } = studio;

    const { rootGroup, nodes, materials, dispose } = buildMergenthalerMatrixBarModel();
    scene.add(rootGroup);

    // Animation Loop
    let reqId: number;
    const clock = createStudioClock();

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      controls.update();
      clock.pump(now);
      const p = live.current;
      updateMergenthalerMatrixBarModel(nodes, materials, {
        cycle01: cycle01Ref.current,
        stopTravelDisplay: p.stopTravelDisplay,
        moldClosurePct: p.moldClosurePct,
        claim1Active: p.claim1Active,
        cutaway: p.isCutaway,
      });

      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Mergenthaler US 313,224 matrix-bar machine 3D</div>
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
                ["matrix_magazine", "Matrix Bars"],
                ["casting_pot", "Mold & Pump"],
                ["spaceband_justifier", "Stops & Clamp"],
                ["keyboard", "Finger Keys"],
                ["top", "Top"],
              ] as [MergenthalerLinotypeCameraPreset, string][]
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyCameraPreset(preset)}
                className={`min-h-9 px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
                  activeCamera === preset
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-ink-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Top-Right Action Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap justify-end gap-1.5 sm:gap-2 max-w-[min(90%,26rem)] sm:max-w-[26rem]">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Switch to solid frame" : "Show frame cutaway"}
            className={`min-h-9 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              isCutaway
                ? "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-700"
                : "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
            }`}
          >
            {isCutaway ? (
              <EyeOff className="w-3.5 h-3.5 inline sm:mr-1" />
            ) : (
              <Eye className="w-3.5 h-3.5 inline sm:mr-1" />
            )}
            <span className="hidden md:inline">{isCutaway ? "Solid" : "Cutaway"}</span>
          </button>
          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute mechanism sound" : "Mute mechanism sound"}
            className="min-h-9 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100 transition-colors shadow-xs"
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 inline sm:mr-1 text-ink-500" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 inline sm:mr-1 text-amber-600" />
            )}
            <span className="hidden md:inline">{isAudioMuted ? "Muted" : "Sound"}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`min-h-9 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              showUiOverlay
                ? "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
                : "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-700"
            }`}
            title={showUiOverlay ? "Hide Overlay Telemetry" : "Show Overlay Telemetry"}
            aria-label={showUiOverlay ? "Hide Overlay Telemetry" : "Show Overlay Telemetry"}
          >
            {showUiOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden md:inline">{showUiOverlay ? "Hide HUD" : "Show HUD"}</span>
          </button>
          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="min-h-9 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100 transition-colors shadow-xs"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-3.5 h-3.5 inline sm:mr-1" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>

        <StudioKernelChips
          visible={showUiOverlay}
          title="US 313,224 SOURCE-BOUNDED MATRIX-BAR MACHINE"
          chips={[
            { label: "Claim 1", value: claim1Active ? "continuous bar" : "excluded band" },
            { label: "Cadence", value: String(selectionCadencePerMin), unit: "display/min" },
            { label: "Stop travel", value: stopTravelDisplay.toFixed(1), unit: "display mm" },
            { label: "Mold", value: String(moldClosurePct), unit: "% closed" },
            { label: "Kernel", value: "typed refusal — no SI data" },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Declared Selection Cadence
              </span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {selectionCadencePerMin} display/min
              </span>
            </div>
            <input
              type="range"
              aria-label="Declared matrix-bar selection cadence"
              min="20"
              max="120"
              step="5"
              value={selectionCadencePerMin}
              onChange={(e) => updateParam("matrixRate", Number.parseFloat(e.target.value))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Selected-Bar Stop Travel
              </span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {stopTravelDisplay.toFixed(1)} display mm
              </span>
            </div>
            <input
              type="range"
              aria-label="Selected matrix-bar stop travel"
              min="3"
              max="10"
              step="0.5"
              value={stopTravelDisplay}
              onChange={(e) => updateParam("spacebandWedge", Number.parseFloat(e.target.value))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Sectional Mold Closure
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                {moldClosurePct}%
              </span>
            </div>
            <input
              type="range"
              aria-label="Sectional mold closure percentage"
              min="0"
              max="100"
              step="5"
              value={moldClosurePct}
              onChange={(e) => updateParam("potTemp", 220 + Number.parseFloat(e.target.value))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>
        </div>

        <ClaimConstraintToggle
          patentId="us-313224-mergenthaler-linotype"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />
        <p className="mt-3 text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
          Source boundary: the grant supplies the continuous matrix-bars, key-set stops, clamp,
          sectional mold, and force-pump topology. It supplies no dimensions, alloy recipe,
          temperature, pressure, cadence, or later magazine/distributor system; display travel and
          cadence therefore remain explicitly illustrative, and no WASM/SI step is claimed.
        </p>
      </div>
    </div>
  );
}
