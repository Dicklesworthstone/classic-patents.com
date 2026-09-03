"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  createThreeStudioScene,
  type StudioContext,
} from "@/components/patents/visuals/three/ThreeStudioScene";
import { useLiveSimParams } from "@/components/patents/visuals/three/useLiveSimParams";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { readEInkRuntimeControls, readEInkTapeFrame } from "@/physics/eInkSharedKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { buildEInkModel } from "./EInkModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { usePatentAudio } from "./usePatentAudio";

const EXHIBIT_ID = "us-6120588-eink";

type CameraPreset = "iso" | "microcapsule" | "electrodes" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [4.8, 3.2, 5.4], target: [0, -0.1, 0] },
  microcapsule: { pos: [2.5, 1.8, 3.4], target: [0, 0, 0] },
  electrodes: { pos: [4.4, 3.6, 4.9], target: [0, 0, 0] },
  top: { pos: [0, 6.0, 0.01], target: [0, 0, 0] },
};

export function eInkViewForViewport(preset: CameraPreset, viewportWidth: number) {
  const config = CAMERA_PRESETS[preset];
  const multiplier = viewportWidth < 480 ? (preset === "iso" ? 1.2 : 1.12) : 1;
  return {
    pos: config.pos.map(
      (coordinate, index) =>
        config.target[index] + (coordinate - config.target[index]) * multiplier,
    ) as [number, number, number],
    target: [...config.target] as [number, number, number],
  };
}

export function EInk3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [hud, setHud] = useState({
    voltage: 15,
    reflectance: 72,
    contrast: "modeled",
    stateLabel: "White State",
  });
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const { params, updateParam } = usePatentPhysics(EXHIBIT_ID);
  const electrodeVoltageVolts = (params.electrodeVoltageVolts as number) ?? 15;
  const fluidViscosityCp = (params.fluidViscosityCp as number) ?? 2.0;

  const live = useLiveSimParams({
    electrodeVoltageVolts,
    fluidViscosityCp,
    isRunning: params.isRunning ?? 1,
    isCutaway,
  });

  const studioRef = useRef<StudioContext | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = eInkViewForViewport(preset, containerRef.current?.clientWidth ?? 1000);
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const iso = eInkViewForViewport("iso", container.clientWidth);
    const studio = createThreeStudioScene({
      container,
      cameraPos: iso.pos,
      targetPos: iso.target,
    });
    studioRef.current = studio;
    const model = buildEInkModel();
    studio.scene.add(model.root);

    // --- RENDER LOOP: pure consumer of the shared transport tape ---
    // The stable dispatcher owner integrates eInkKernel; this loop only
    // projects the latest particle tape and refreshes the HUD.
    let hudCounter = 0;
    let rafId = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const p = live.current;
      const controls = readEInkRuntimeControls({
        ...p,
        running: (p.isRunning ?? 1) > 0,
      });
      const current = readEInkTapeFrame(controls);
      model.updateElectrophoresis(current.state, current.simTimeSec);

      hudCounter += 1;
      if (hudCounter % 10 === 0) {
        const v = controls.electrodeVoltageVolts;
        const label =
          v > 2 ? "White (Reflective)" : v < -2 ? "Black (Absorptive)" : "Transition / Grayscale";
        setHud({
          voltage: v,
          reflectance: current.state.surfaceReflectancePercent,
          contrast: current.state.contrastRatio,
          stateLabel: label,
        });
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

  useEffect(() => {
    const restoreResponsiveView = () => {
      const container = containerRef.current;
      if (!container) return;
      const next = eInkViewForViewport(activeCamera, container.clientWidth);
      studioRef.current?.controls.setView(next.pos, next.target);
    };
    window.addEventListener("resize", restoreResponsiveView);
    return () => window.removeEventListener("resize", restoreResponsiveView);
  }, [activeCamera]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">E-Ink Electrophoretic Microcapsule Display 3D</div>
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
                ["microcapsule", "Microcapsule Core"],
                ["electrodes", "Source Electrodes 100/110"],
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
            title={isCutaway ? "Collapse Electrode Plates" : "Explode Microcapsule Stack"}
            aria-label={isCutaway ? "Collapse Electrode Plates" : "Explode Microcapsule Stack"}
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
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">State:</span>
              <span className="font-bold text-amber-700 dark:text-amber-400">{hud.stateLabel}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Voltage:</span>
              <span className="font-bold text-cyan-800 dark:text-cyan-400">
                {hud.voltage > 0 ? `+${hud.voltage}` : hud.voltage} V
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Modeled response:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {hud.reflectance}%
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Response ratio:</span>
              <span className="font-bold text-purple-800 dark:text-purple-400">{hud.contrast}</span>
            </div>
          </div>
        )}

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="E-Ink Electrophoretic State"
          chips={[
            { label: "State", value: hud.stateLabel },
            {
              label: "Voltage",
              value: `${hud.voltage > 0 ? `+${hud.voltage}` : hud.voltage}`,
              unit: "V",
            },
            { label: "Modeled response", value: `${hud.reflectance}`, unit: "%" },
            { label: "Contrast", value: `${hud.contrast}` },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SensitivitySlider
            id="einkElectrodeVoltage"
            patentId="us-6120588-eink"
            paramKey="electrodeVoltageVolts"
            label="Electrode Potential"
            value={electrodeVoltageVolts}
            min={-15}
            max={15}
            step={1}
            unit=" V"
            onChange={(val) => updateParam("electrodeVoltageVolts", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="einkViscosity"
            patentId="us-6120588-eink"
            paramKey="fluidViscosityCp"
            label="Fluid Viscosity"
            value={fluidViscosityCp}
            min={0.5}
            max={5.0}
            step={0.5}
            unit=" cP"
            onChange={(val) => updateParam("fluidViscosityCp", val)}
            allParams={params}
          />
        </div>

        <ClaimConstraintToggle
          patentId="us-6120588-eink"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip patentId="us-6120588-eink" params={params} className="mt-3" />
      </div>
    </div>
  );
}

export default EInk3D;
