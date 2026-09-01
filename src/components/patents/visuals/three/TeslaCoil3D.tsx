"use client";

// Pure consumer of the shared transport tape: standing-wave spatial profile is parameter-prescribed.
import { Camera, Eye, EyeOff, Layers, RotateCcw, Sparkles, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import {
  readTeslaTransformerControls,
  stepTeslaTransformerSi,
} from "@/physics/teslaTransformerKernel";
import { ensureTeslaWasm, teslaKernelSource } from "@/physics/teslaWasm";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { buildTeslaCoilModel } from "./tesla593138TransformerModel";
import { useLiveSimParams } from "./useLiveSimParams";

type CameraPreset = "iso" | "high_terminal" | "primary_spiral" | "earth_bond" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [10, 6.5, 13], target: [0, -0.5, 0] },
  high_terminal: { pos: [2.5, 3.8, 5.2], target: [0, 2.25, 0] },
  primary_spiral: { pos: [0, -0.5, 5.8], target: [0, -1.75, 0] },
  earth_bond: { pos: [5.2, -0.5, 4.8], target: [1.75, -1.65, 0] },
  top: { pos: [0, 13.0, 0.1], target: [0, 0, 0] },
};

export function TeslaCoil3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setKernelSource] = useState(teslaKernelSource);

  useEffect(() => {
    let active = true;
    void ensureTeslaWasm().then((nextSource) => {
      if (active) setKernelSource(nextSource);
    });
    return () => {
      active = false;
    };
  }, []);

  const { params, updateParam } = usePatentPhysics("us-593138-tesla-coil");
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const transformerControls = readTeslaTransformerControls({
    disturbanceFrequencyHz: params.disturbanceFrequencyHz,
    secondaryLengthMiles: params.secondaryLengthMiles,
  });
  const disturbanceFrequencyHz = transformerControls.disturbanceFrequencyHz;
  const secondaryLengthMiles = transformerControls.secondaryLengthMiles;
  const [showProfileSamples, setShowProfileSamples] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const claim1CommonNodeConnected = (params.claim1CommonNodeConnected ?? 1) >= 0.5;
  const claimStates = { 1: claim1CommonNodeConnected };

  const transformerPhysics = stepTeslaTransformerSi(transformerControls);

  useFrankenSimPhysics("us-593138-tesla-coil", {
    domain: "electromagnetics_flux",
    refusal: {
      isRefused: !claim1CommonNodeConnected,
      reason: !claim1CommonNodeConnected
        ? "Claim 1 topology absent: secondary low terminal is open from the primary / earth node."
        : undefined,
    },
  });

  const live = useLiveSimParams({
    electricalLengthRad: transformerPhysics.electricalLengthRad,
    isCutaway,
    showProfileSamples,
    claim1CommonNodeConnected: claim1CommonNodeConnected ? 1 : 0,
  });

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

    const { scene, camera, renderer, controls } = studio;

    const model = buildTeslaCoilModel();
    scene.add(model.root);

    let reqId: number;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const p = live.current;

      model.updateElectricalProfile(p.electricalLengthRad);
      const commonNodeConnected = (p.claim1CommonNodeConnected ?? 1) >= 0.5;
      model.setProfileMarkersVisible((p.showProfileSamples ?? false) && commonNodeConnected);
      model.setClaimedCommonNodeConnected(commonNodeConnected);

      model.setCutaway?.(p.isCutaway ?? false);

      controls.update();
      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      model.dispose();
      studio.dispose();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Nikola Tesla Electrical Transformer 3D</div>
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
                ["high_terminal", "Remote Terminal"],
                ["primary_spiral", "Spiral Primary"],
                ["earth_bond", "Primary / Earth Bond"],
                ["top", "Overhead"],
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

        {/* Top Right Tool Bar (Toggle UI, cutaway, pins, reset) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`min-h-9 p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showUiOverlay
                ? "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
                : "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
            }`}
            title={showUiOverlay ? "Hide Overlay UI (Clean 3D View)" : "Show Overlay UI"}
            aria-label={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
          >
            {showUiOverlay ? (
              <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            className={`min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              isCutaway
                ? "bg-cyan-600 text-white border-cyan-700 shadow-md ring-2 ring-cyan-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
            title={isCutaway ? "Solid Secondary Coil" : "Wireframe Secondary & Support Cutaway"}
            aria-label={
              isCutaway ? "Solid Secondary Coil" : "Wireframe Secondary & Support Cutaway"
            }
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            aria-label={
              showProfileSamples
                ? "Hide normalized winding samples"
                : "Show normalized winding samples"
            }
            type="button"
            disabled={!claim1CommonNodeConnected}
            onClick={() => setShowProfileSamples(!showProfileSamples)}
            className={`min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              !claim1CommonNodeConnected
                ? "bg-slate-300/80 dark:bg-ink-800/80 text-slate-500 cursor-not-allowed border-slate-400/50"
                : showProfileSamples
                  ? "bg-amber-600 text-white border-amber-700 shadow-md"
                  : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
            title={
              claim1CommonNodeConnected
                ? "Toggle normalized distributed-wave samples anchored to winding B"
                : "Claim 1 common node is open; normalized profile is refused"
            }
          >
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="text-[10px] sm:text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-parchment-200 dark:border-ink-800/80">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              Source-Bounded Transformer Telemetry
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-ink-600 dark:text-ink-400">Disturbance frequency:</span>
                <span className="font-bold text-amber-700 dark:text-amber-400">
                  {disturbanceFrequencyHz.toFixed(0)} Hz
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-ink-600 dark:text-ink-400">Required quarter-wave:</span>
                <span className="font-bold text-cyan-700 dark:text-cyan-400">
                  {transformerPhysics.quarterWaveLengthMiles.toFixed(2)} mi
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-ink-600 dark:text-ink-400">Electrical length:</span>
                <span className="font-bold text-purple-700 dark:text-purple-400">
                  {transformerPhysics.electricalLengthDeg.toFixed(1)}°
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-ink-600 dark:text-ink-400">Claimed common node:</span>
                <span
                  className={`font-bold ${
                    claim1CommonNodeConnected
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-rose-700 dark:text-rose-400"
                  }`}
                >
                  {claim1CommonNodeConnected ? "Connected" : "Open — profile refused"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-ink-600 dark:text-ink-400">Absolute potential:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  Underdetermined by source
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom SI Telemetry Chip Strip */}
        <StudioKernelChips
          side="right"
          visible={showUiOverlay}
          title="US 593,138 DISTRIBUTED-WAVE TRANSFORMER"
          chips={[
            {
              label: "Source form",
              value: "Fig. 2 conical graded winding",
              tone: "ok",
            },
            {
              label: "Claim 1 topology",
              value: claim1CommonNodeConnected ? "common node connected" : "secondary open",
              tone: claim1CommonNodeConnected ? "ok" : "warn",
            },
            {
              label: "Kernel",
              value:
                transformerPhysics.runtimeSource === "wasm"
                  ? "fs-flux WASM"
                  : "TypeScript fallback",
              tone: transformerPhysics.runtimeSource === "wasm" ? "ok" : "warn",
            },
            {
              label: "Secondary wire",
              value: secondaryLengthMiles.toFixed(1),
              unit: "mi",
            },
            {
              label: "Quarter-wave target",
              value: transformerPhysics.quarterWaveLengthMiles.toFixed(2),
              unit: "mi",
            },
            {
              label: "Length error",
              value: transformerPhysics.lengthErrorMiles.toFixed(2),
              unit: "mi",
              tone: Math.abs(transformerPhysics.lengthErrorMiles) < 0.01 ? "ok" : "warn",
            },
            {
              label: "V / discharge",
              value: "source-underdetermined",
              tone: "warn",
            },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SensitivitySlider
            id="disturbanceFrequency"
            patentId="us-593138-tesla-coil"
            paramKey="disturbanceFrequencyHz"
            label="Disturbance frequency"
            value={disturbanceFrequencyHz}
            min={500}
            max={1500}
            step={25}
            unit=" Hz"
            onChange={(val) => updateParam("disturbanceFrequencyHz", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="secondaryLengthMiles"
            patentId="us-593138-tesla-coil"
            paramKey="secondaryLengthMiles"
            label="Developed secondary length"
            value={secondaryLengthMiles}
            min={25}
            max={75}
            step={1}
            unit=" mi"
            onChange={(val) => updateParam("secondaryLengthMiles", val)}
            allParams={params}
          />
        </div>

        <ClaimConstraintToggle
          patentId="us-593138-tesla-coil"
          claimStates={claimStates}
          onToggleClaim={(_claimNo, active) =>
            updateParam("claim1CommonNodeConnected", active ? 1 : 0)
          }
          className="mt-2"
        />

        <p className="mt-3 text-[10px] text-ink-500 dark:text-ink-400">
          The 925 Hz, 185,000 mi/s, 50 mi defaults reproduce Tesla&apos;s printed example. The
          fs-flux kernel computes wavelength and electrical length only. Because the grant supplies
          no excitation, impedance, coupling, loss, or load data, absolute voltage and discharge
          length are deliberately not reported.
        </p>
      </div>
    </div>
  );
}
