"use client";

import {
  Camera,
  Eye,
  EyeOff,
  Layers,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createStudioClock } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { readWattRotaryControls, stepWattRotaryEngine } from "@/physics/wattRotaryKernel";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";
import { buildWattRotaryEngineModel, type WattRotaryModelNodes } from "./wattRotaryEngineModel";

type CameraPreset = "overview" | "gear-mesh" | "beam" | "cylinder";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  overview: { pos: [4.8, 4.2, 5.8], target: [0.5, 1.8, 0] },
  "gear-mesh": { pos: [3.8, 1.8, 3.2], target: [2.2, 0.9, 0] },
  beam: { pos: [0.2, 4.5, 4.0], target: [0, 3.2, 0] },
  cylinder: { pos: [-3.8, 2.5, 3.2], target: [-2.2, 1.5, 0] },
};

export function WattRotaryEngine3D() {
  const { params, updateParam } = usePatentPhysics("gb-1306-watt-rotary-engine");

  const strokeRateSpm = params.strokeRateSpm ?? 20;
  const boilerPressureKpa = params.boilerPressureKpa ?? 70;
  const gearRatioNpOverNs = params.gearRatioNpOverNs ?? 1.0;
  const flywheelMassKg = params.flywheelMassKg ?? 3500;

  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const modelRef = useRef<WattRotaryModelNodes | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [cutaway, setCutaway] = useState(false);
  const [showCallouts, setShowCallouts] = useState(true);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("overview");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const cutawayRef = useRef(cutaway);
  cutawayRef.current = cutaway;

  const showCalloutsRef = useRef(showCallouts);
  showCalloutsRef.current = showCallouts;

  const live = useLiveSimParams({
    strokeRateSpm,
    boilerPressureKpa,
    gearRatioNpOverNs,
    flywheelMassKg,
  });

  const handleCameraPreset = (preset: CameraPreset) => {
    setCameraPreset(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const initialPreset = CAMERA_PRESETS.overview;
    const studio = createThreeStudioScene({
      container,
      cameraPos: initialPreset.pos,
      targetPos: initialPreset.target,
      cameraMinDistance: 1.5,
      cameraMaxDistance: 20,
    });
    studioRef.current = studio;

    const model = buildWattRotaryEngineModel();
    studio.scene.add(model.root);
    modelRef.current = model;

    let virtualTimeSec = 0;
    const clock = createStudioClock();

    const animate = (now: number) => {
      animFrameRef.current = requestAnimationFrame(animate);
      const { dt } = clock.pump(now);

      studio.controls.update();

      if (isPlayingRef.current) {
        virtualTimeSec += dt;
      }

      if (modelRef.current) {
        if (isPlayingRef.current) {
          const out = stepWattRotaryEngine(readWattRotaryControls(live.current), virtualTimeSec);
          modelRef.current.updateAnimation({
            beamAngleDeg: out.beamAngleDeg,
            planetOrbitAngleDeg: out.planetOrbitAngleDeg,
            sunShaftAngleDeg: out.sunShaftAngleDeg,
          });
        }
        modelRef.current.setCutaway(cutawayRef.current);
        modelRef.current.setShowCallouts(showCalloutsRef.current);
      }

      studio.renderer.render(studio.scene, studio.camera);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
      model.dispose();
      studio.cleanup();
      studioRef.current = null;
      modelRef.current = null;
    };
  }, [live]);

  const telemetry = stepWattRotaryEngine(
    {
      strokeRateSpm,
      boilerPressureKpa,
      gearRatioNpOverNs,
      flywheelMassKg,
    },
    0,
  );

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">James Watt Rotary Steam Engine &amp; Sun-and-Planet Gear 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-14rem)] sm:max-w-[calc(100%-28rem)] gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> View:
            </span>
            {(
              [
                ["overview", "Overview"],
                ["gear-mesh", "Gear Mesh"],
                ["beam", "Beam"],
                ["cylinder", "Cylinder"],
              ] as const
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleCameraPreset(preset)}
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
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap justify-end gap-1.5 sm:gap-2 max-w-[min(90%,26rem)] sm:max-w-[26rem]">
          <button
            type="button"
            onClick={() => {
              setIsPlaying(!isPlaying);
              soundEngine.playSwitchClick();
            }}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              isPlaying
                ? "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
                : "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-600"
            }`}
          >
            <RotateCw className="w-3.5 h-3.5 inline sm:mr-1" />
            <span className="hidden md:inline">{isPlaying ? "Pause" : "Play"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setCutaway(!cutaway);
              soundEngine.playSwitchClick();
            }}
            title={cutaway ? "Switch to Solid Shell" : "Switch to Cutaway Cylinder"}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs flex items-center gap-1 ${
              cutaway
                ? "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-600"
                : "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5 inline sm:mr-1" />
            <span className="hidden md:inline">{cutaway ? "Cutaway" : "Solid"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowCallouts(!showCallouts);
              soundEngine.playSwitchClick();
            }}
            title={showCallouts ? "Hide Callouts" : "Show Callouts"}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs flex items-center gap-1 ${
              showCallouts
                ? "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-600"
                : "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
            }`}
          >
            <Zap className="w-3.5 h-3.5 inline sm:mr-1" />
            <span className="hidden md:inline">{showCallouts ? "Pins" : "Pins Off"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              toggleSound();
              soundEngine.playSwitchClick();
            }}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
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
            onClick={() => handleCameraPreset("overview")}
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
                Shaft Multiplier:
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                {telemetry.speedMultiplier.toFixed(1)}× (2:1 Ratio)
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Driveshaft Speed:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {telemetry.shaftRpm.toFixed(1)} RPM
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Indicated Power:</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                {telemetry.meanPowerKw.toFixed(1)} kW
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Horsepower:</span>
              <span className="text-purple-800 dark:text-purple-400 font-bold">
                {telemetry.brakeHorsepower.toFixed(1)} hp
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Piston Force:</span>
              <span className="text-rose-700 dark:text-rose-400 font-bold">
                {(telemetry.pistonForceN / 1e3).toFixed(1)} kN
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
              <span className="text-ink-700 dark:text-ink-300 font-medium">Boiler Pressure</span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {boilerPressureKpa} kPa
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="120"
              step="5"
              value={boilerPressureKpa}
              onChange={(e) => updateParam("boilerPressureKpa", Number.parseFloat(e.target.value))}
              className="w-full accent-amber-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Stroke Rate</span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {strokeRateSpm} SPM
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="40"
              step="1"
              value={strokeRateSpm}
              onChange={(e) => updateParam("strokeRateSpm", Number.parseFloat(e.target.value))}
              className="w-full accent-cyan-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Flywheel Inertia</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                {flywheelMassKg} kg
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="5000"
              step="250"
              value={flywheelMassKg}
              onChange={(e) => updateParam("flywheelMassKg", Number.parseFloat(e.target.value))}
              className="w-full accent-emerald-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>

        <ClaimConstraintToggle
          patentId="gb-1306-watt-rotary-engine"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="gb-1306-watt-rotary-engine"
          params={params}
          className="mt-3"
        />
      </div>

      {/* Bottom SI Telemetry Chip Strip */}
      <StudioKernelChips
        visible={true}
        title="SUN AND PLANET ROTARY STEAM POWER"
        chips={[
          { label: "Stroke Rate", value: `${strokeRateSpm}`, unit: "SPM" },
          {
            label: "Boiler Pressure",
            value: `${boilerPressureKpa}`,
            unit: "kPa",
          },
          {
            label: "Shaft Speed",
            value: `${(strokeRateSpm * gearRatioNpOverNs).toFixed(0)}`,
            unit: "RPM",
            tone: "hot",
          },
          {
            label: "Gear Ratio",
            value: `${gearRatioNpOverNs.toFixed(1)}:1`,
            unit: "Sun/Planet",
          },
          {
            label: "Flywheel Mass",
            value: `${flywheelMassKg.toLocaleString()}`,
            unit: "kg",
          },
          { label: "Mechanism", value: "Sun and Planet Epicyclic Gearing" },
        ]}
      />
    </div>
  );
}
