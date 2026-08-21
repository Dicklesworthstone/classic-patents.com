"use client";

import { Camera, Eye, EyeOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepBoyleSmithCcd } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { createBoyleSmithCcdModel } from "./boyleSmithCcdModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

type CameraPreset = "iso" | "gate_array" | "package" | "potential_well" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [12, 10, 16], target: [0, 0, 0] },
  gate_array: { pos: [0, 3.5, 5.0], target: [0, 0, 0] },
  package: { pos: [0, 7.0, 7.5], target: [0, 0, 0] },
  potential_well: { pos: [4.5, 2.2, 4.0], target: [0, -0.5, 0] },
  top: { pos: [0, 15.0, 0.1], target: [0, 0, 0] },
};

export function BoyleSmithCcd3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { params, updateParam } = usePatentPhysics("us-3858232-boyle-smith-ccd");
  const [showUiOverlay, setShowUiOverlay] = useState(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [isRunning, setIsRunning] = useState(true);

  const gateVoltage = params.gateVoltageV ?? 10;
  const clockFreq = params.clockFrequencyMhz ?? 5.0;
  const incidentLux = params.incidentLux ?? 250;
  const integrationTime = params.integrationTimeMs ?? 16.7;
  const temperature = params.temperatureKelvin ?? 300;

  const live = useLiveSimParams({
    gateVoltageV: gateVoltage,
    clockFrequencyMhz: clockFreq,
    incidentLux,
    integrationTimeMs: integrationTime,
    temperatureKelvin: temperature,
    isRunning,
  });

  const studioRef = useRef<StudioContext | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const metrics = stepBoyleSmithCcd({
    gateVoltageV: gateVoltage,
    clockFrequencyMhz: clockFreq,
    incidentLux,
    integrationTimeMs: integrationTime,
    temperatureKelvin: temperature,
  });

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

    const ccdModel = createBoyleSmithCcdModel();
    studio.scene.add(ccdModel.nodes.group);

    let animId = 0;
    let clockPhase = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (live.current.isRunning) {
        clockPhase = (clockPhase + 0.05) % (Math.PI * 2);
      }

      ccdModel.update(live.current, clockPhase);
      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      ccdModel.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Boyle &amp; Smith Charge Coupled Device 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-14rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["gate_array", "Gates"],
                ["package", "Package"],
                ["potential_well", "Wells"],
                ["top", "Top"],
              ] as [CameraPreset, string][]
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyCameraPreset(preset)}
                className={`px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
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

        {/* Top-Right Action Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap justify-end gap-1.5 sm:gap-2 max-w-[90%]">
          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className={`p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              isRunning
                ? "bg-amber-700 text-white border-amber-800 dark:bg-amber-600"
                : "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
            }`}
          >
            {isRunning ? "Pause Clock" : "Run Clock"}
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
            onClick={() => applyCameraPreset("iso")}
            className="p-1.5 sm:px-2 sm:py-1.5 rounded-lg text-xs font-sans bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border border-parchment-300 dark:border-ink-700 hover:bg-parchment-100 transition-colors shadow-xs"
            title="Reset Orbit Camera"
          >
            <Camera className="w-3.5 h-3.5 inline" />
          </button>
        </div>

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                Transfer Efficiency:
              </span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {metrics.ctePct}%
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Full-Well Capacity:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {(metrics.fullWellCapacityElectrons / 1000).toFixed(0)}k e⁻
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Depletion Depth:</span>
              <span className="text-sky-800 dark:text-sky-400 font-bold">
                {metrics.depletionDepthUm} µm
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Gate Transfer Voltage
              </span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {gateVoltage} V
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="20"
              step="1"
              value={gateVoltage}
              onChange={(e) => updateParam("gateVoltageV", Number.parseFloat(e.target.value))}
              className="w-full accent-amber-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Clock Frequency</span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {clockFreq.toFixed(1)} MHz
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={clockFreq}
              onChange={(e) => updateParam("clockFrequencyMhz", Number.parseFloat(e.target.value))}
              className="w-full accent-cyan-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Incident Illumination
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                {incidentLux} lux
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="1000"
              step="25"
              value={incidentLux}
              onChange={(e) => updateParam("incidentLux", Number.parseFloat(e.target.value))}
              className="w-full accent-emerald-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Bottom SI Telemetry Chip Strip */}
      <StudioKernelChips
        visible={true}
        title="CHARGE-COUPLED DEVICE SEMICONDUCTOR"
        chips={[
          { label: "V_gate", value: `${gateVoltage.toFixed(0)}`, unit: "V" },
          { label: "f_clock", value: `${clockFreq.toFixed(1)}`, unit: "MHz" },
          {
            label: "Full Well",
            value: `${metrics.fullWellCapacityElectrons.toLocaleString()}`,
            unit: "e⁻",
          },
          {
            label: "CTE",
            value: `${metrics.ctePct.toFixed(4)}%`,
          },
          {
            label: "Dark Charge",
            value: `${metrics.darkElectrons.toFixed(0)}`,
            unit: "e⁻",
          },
          { label: "Integration", value: `${integrationTime.toFixed(1)}`, unit: "ms" },
          { label: "Architecture", value: "3-Phase Polysilicon MOS Transfer" },
        ]}
      />
    </div>
  );
}
