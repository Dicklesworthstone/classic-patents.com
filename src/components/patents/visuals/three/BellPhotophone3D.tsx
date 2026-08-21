"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { stepBellPhotophone } from "@/physics/catalogKernels";
import { createStudioClock } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { createBellPhotophoneModel } from "./bellPhotophoneModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

type CameraPreset = "overview" | "transmitter" | "receiver" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  overview: { pos: [0, 4.0, 12.0], target: [0, 1.0, 0] },
  transmitter: { pos: [-3.5, 2.5, 4.0], target: [-5.0, 1.2, 0] },
  receiver: { pos: [3.5, 2.5, 4.0], target: [5.0, 1.2, 0] },
  top: { pos: [0, 14.0, 0.1], target: [0, 1.0, 0] },
};

export function BellPhotophone3D() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);

  const { params, updateParam } = usePatentPhysics("us-235199-bell-photophone");
  const beamVariationActive = (params.voiceSplDb ?? 1) > 0;
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("overview");
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  const handlePresetChange = (preset: CameraPreset) => {
    setCameraPreset(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const photoState = useMemo(() => {
    return stepBellPhotophone({
      beamVariationActive,
    });
  }, [beamVariationActive]);

  const live = useLiveSimParams({ photoState, isCutaway });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const overview = CAMERA_PRESETS.overview;
    const studio = createThreeStudioScene({
      container,
      cameraPos: overview.pos,
      targetPos: overview.target,
    });
    studioRef.current = studio;

    const model = createBellPhotophoneModel();
    studio.scene.add(model.group);

    let rafId = 0;
    const clock = createStudioClock();
    const animate = (now: number) => {
      rafId = requestAnimationFrame(animate);
      const { simTimeSec: elapsedTimeSec } = clock.pump(now);
      model.update(live.current.photoState, elapsedTimeSec);
      model.setCutaway?.(live.current.isCutaway ?? false);
      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      model.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Alexander Graham Bell Photophone 3D</div>
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
                ["overview", "Overview"],
                ["transmitter", "Transmitter"],
                ["receiver", "Receiver Dish"],
                ["top", "Top"],
              ] as [CameraPreset, string][]
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetChange(preset)}
                className={`px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
                  cameraPreset === preset
                    ? "bg-amber-600 text-white shadow-xs font-semibold"
                    : "text-ink-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Top-Right Action Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 max-w-[min(90%,26rem)] sm:max-w-[26rem] pointer-events-auto">
          <button
            type="button"
            onClick={() => updateParam("voiceSplDb", beamVariationActive ? 0 : 1)}
            className="rounded-xl border border-parchment-300 bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink-700 shadow-sm backdrop-blur-md transition-colors hover:bg-parchment-100 dark:border-ink-700 dark:bg-ink-900/90 dark:text-parchment-300 dark:hover:bg-ink-800"
            title="Toggle the qualitative beam-variation illustration"
            aria-label="Toggle the qualitative beam-variation illustration"
          >
            Beam variation: {beamVariationActive ? "on" : "off"}
          </button>

          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              isCutaway
                ? "bg-cyan-600 text-white border-cyan-700 shadow-md ring-2 ring-cyan-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
            title={isCutaway ? "Solid Mounts" : "Transparent Mounts & Mirrors Cutaway"}
            aria-label={isCutaway ? "Solid Mounts" : "Transparent Mounts & Mirrors Cutaway"}
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              showUiOverlay
                ? "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
                : "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-600"
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
            onClick={() => handlePresetChange("overview")}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                Beam state:
              </span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {photoState.beamVariationActive ? "varying" : "static"}
              </span>
            </div>
            <div className="pt-1 text-[11px] leading-4 text-ink-600 dark:text-ink-400">
              Qualitative source schematic. US 235,199 does not provide a measured optical link
              budget, selenium resistance curve, or acoustic-output calibration.
            </div>
          </div>
        )}
      </div>

      {/* Source-bounded control */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <p className="text-sm leading-6 text-ink-700 dark:text-ink-300">
          This 3D view is an explanatory arrangement, not a numerical reconstruction. It shows only
          the source-described chain: transmitter motion changes a beam, optics direct it, and a
          sensitive receiver can produce a corresponding acoustic or electrical effect.
        </p>

        <ClaimConstraintToggle
          patentId="us-235199-bell-photophone"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-235199-bell-photophone"
          params={params}
          className="mt-3"
        />
      </div>

      {/* Bottom SI Telemetry Chip Strip */}
      <StudioKernelChips
        visible={true}
        title="QUALITATIVE PHOTOPHONE ARRANGEMENT"
        chips={[
          { label: "Transmitter", value: "Beam controller" },
          { label: "Optical path", value: "Directed radiant beam" },
          { label: "Detector", value: "Crystalline Selenium (Se) Cell" },
          {
            label: "Output",
            value: "Direct sound or telephone circuit",
          },
        ]}
      />
    </div>
  );
}

export default BellPhotophone3D;
