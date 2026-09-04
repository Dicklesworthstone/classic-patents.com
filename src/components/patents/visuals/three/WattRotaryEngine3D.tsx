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
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import {
  getWattRotaryTapeFrame,
  readWattRotaryControls,
  stepWattRotaryEngine,
  WATT_ROTARY_FRANKENSIM_BOUNDARY,
  WATT_ROTARY_KERNEL_SOURCE,
  WATT_ROTARY_KINEMATIC_GEOMETRY,
  WATT_ROTARY_SOURCE_BOUNDARY,
} from "@/physics/wattRotaryKernel";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
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
  // Keep the flywheel behind the sun-and-planet train in the default view.
  // The model is read from the mechanism side first; the flywheel remains
  // available as a named part instead of becoming an accidental occluder.
  overview: {
    pos: [4.8, 5.4, -5.8],
    target: [0.5, WATT_ROTARY_KINEMATIC_GEOMETRY.sunCenterY + 0.9, 0],
  },
  // Inspect the meshing pair from the side opposite the flywheel. Looking
  // through the flywheel's rim makes the very mechanism this preset teaches
  // needlessly opaque.
  "gear-mesh": {
    pos: [3.25, 2.65, -3],
    target: [
      WATT_ROTARY_KINEMATIC_GEOMETRY.sunCenterX,
      WATT_ROTARY_KINEMATIC_GEOMETRY.sunCenterY,
      0,
    ],
  },
  beam: {
    pos: [0.2, 5.7, 4.0],
    target: [
      WATT_ROTARY_KINEMATIC_GEOMETRY.beamPivotX,
      WATT_ROTARY_KINEMATIC_GEOMETRY.beamPivotY,
      0,
    ],
  },
  cylinder: { pos: [-3.8, 3.7, 3.2], target: [-2.2, 2.7, 0] },
};

function cameraPresetForViewport(
  preset: CameraPreset,
  viewportWidth: number,
): {
  pos: [number, number, number];
  target: [number, number, number];
} {
  const config = CAMERA_PRESETS[preset];
  if (viewportWidth >= 640) return config;

  // A portrait viewport has far less horizontal field of view than the
  // desktop studio. Preserve the same target but move the camera outward so
  // the complete mechanism remains inspectable instead of clipping its gears.
  // The 320px shell has a narrower usable canvas than the 375px layout; its
  // flywheel otherwise touches the left edge even though the 375px frame is
  // correctly composed. Keep that additional clearance local to the narrow
  // shell instead of making every phone unnecessarily distant.
  // At 320px the full scene is only 286 CSS pixels wide after the page
  // gutter. A 1.75× pullback still clipped the flywheel and base corners in
  // the live studio, so the narrow-shell composition deliberately has its
  // own fit distance rather than pretending that the 375px framing transfers.
  const mobileDistanceMultiplier = viewportWidth < 360 ? 2.15 : 1.55;
  return {
    pos: [
      config.target[0] + (config.pos[0] - config.target[0]) * mobileDistanceMultiplier,
      config.target[1] + (config.pos[1] - config.target[1]) * mobileDistanceMultiplier,
      config.target[2] + (config.pos[2] - config.target[2]) * mobileDistanceMultiplier,
    ],
    target: config.target,
  };
}

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

  const isPlaying = (params.isRunning ?? 1) > 0.5;
  const [cutaway, setCutaway] = useState(false);
  // The labels are useful on demand, but sprite labels render above the mesh
  // and make the compact planet/sun pair harder to inspect at tablet width.
  const [showCallouts, setShowCallouts] = useState(false);
  // The gear train is the teaching surface. Telemetry remains available from
  // the toggle, but it must not cover the mesh by default.
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(false);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("overview");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  const live = useLiveSimParams({
    strokeRateSpm,
    boilerPressureKpa,
    gearRatioNpOverNs,
    flywheelMassKg,
    cutaway,
    showCallouts,
    gearInspection: cameraPreset === "gear-mesh",
  });

  // Pure consumer of the shared transport tape: the route-level owner survives
  // 2D/3D switches; this face only consumes it.
  const { frame } = useFrankenSimPhysics("gb-1306-watt-rotary-engine", {
    domain: "thermo_fluid",
    refusal: { isRefused: true, reason: WATT_ROTARY_SOURCE_BOUNDARY },
  });

  const handleCameraPreset = (preset: CameraPreset) => {
    setCameraPreset(preset);
    const cfg = cameraPresetForViewport(preset, window.innerWidth);
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  // The mounted rAF loop deliberately reads this stable, layout-effect-synchronized ref so a control change never tears down and flashes the WebGL scene.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const initialPreset = cameraPresetForViewport("overview", window.innerWidth);
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

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      studio.controls.update();

      if (modelRef.current) {
        // Bus-owned kernel step: read the latest shared-tape gear poses.
        const out = getWattRotaryTapeFrame()?.telemetry;
        if (out) {
          modelRef.current.updateAnimation(out);
        }
        modelRef.current.setCutaway(live.current.cutaway);
        modelRef.current.setGearInspection(live.current.gearInspection);
        modelRef.current.setShowCallouts(live.current.showCallouts);
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

  useEffect(() => {
    const restoreMobileFraming = () => {
      if (window.innerWidth >= 640) return;
      const config = cameraPresetForViewport(cameraPreset, window.innerWidth);
      studioRef.current?.controls.setView(config.pos, config.target);
    };

    restoreMobileFraming();
    window.addEventListener("resize", restoreMobileFraming);
    return () => window.removeEventListener("resize", restoreMobileFraming);
  }, [cameraPreset]);

  const telemetry =
    getWattRotaryTapeFrame()?.telemetry ??
    stepWattRotaryEngine(
      readWattRotaryControls({
        strokeRateSpm,
        boilerPressureKpa,
        gearRatioNpOverNs,
        flywheelMassKg,
      }),
      0,
    );

  return (
    <div
      className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent"
      data-watt-face="three"
      data-watt-runtime-tick={frame.tick}
      data-watt-runtime-provenance={frame.provenance}
      data-watt-kernel-source={WATT_ROTARY_KERNEL_SOURCE}
      data-watt-frankensim-boundary={WATT_ROTARY_FRANKENSIM_BOUNDARY}
      data-watt-running={isPlaying}
      data-watt-carrier-angle-rad={telemetry.planetOrbitAngleRad}
      data-watt-rod-angle-rad={telemetry.connectingRodAngleRad}
      data-watt-planet-angle-rad={telemetry.planetBodyAngleRad}
      data-watt-sun-angle-rad={telemetry.sunShaftAngleRad}
      data-watt-mesh-residual-rad={telemetry.gearMeshConstraintResidualRad}
      data-watt-rod-residual-m={telemetry.connectingRodConstraintResidualM}
      data-watt-sun-teeth={telemetry.sunTeeth}
      data-watt-planet-teeth={telemetry.planetTeeth}
    >
      <div className="sr-only">James Watt Rotary Steam Engine &amp; Sun-and-Planet Gear 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        <div className="absolute top-3 left-3 lg:top-4 lg:left-4 z-10 hidden lg:flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-9.5rem)] lg:max-w-[calc(100%-28rem)] gap-1 lg:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 lg:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] lg:text-xs transition-opacity duration-200">
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
              title={
                preset === "gear-mesh"
                  ? "Gear inspection view (flywheel and labels temporarily hidden)"
                  : undefined
              }
              className={`min-h-9 px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
                cameraPreset === preset
                  ? "bg-amber-600 text-white shadow-xs font-semibold"
                  : "text-ink-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="absolute top-3 left-3 z-10 lg:hidden">
          <label className="sr-only" htmlFor="watt-camera-view">
            Camera view
          </label>
          <select
            id="watt-camera-view"
            value={cameraPreset}
            onChange={(event) => handleCameraPreset(event.target.value as CameraPreset)}
            className="min-h-9 max-w-32 rounded-lg border border-parchment-300 bg-white/95 px-2 text-xs font-semibold text-ink-800 shadow-sm backdrop-blur-md dark:border-ink-700 dark:bg-ink-900/95 dark:text-parchment-100"
            aria-label="Watt engine camera view"
          >
            <option value="overview">Overview</option>
            <option value="gear-mesh">Gear Mesh</option>
            <option value="beam">Beam</option>
            <option value="cylinder">Cylinder</option>
          </select>
        </div>

        {/* Top-Right Action Controls */}
        <div className="absolute top-14 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap justify-end gap-1.5 sm:gap-2 max-w-[calc(100%-1.5rem)] sm:max-w-[26rem]">
          <button
            type="button"
            aria-label={isPlaying ? "Pause Motion" : "Resume Motion"}
            onClick={() => {
              updateParam("isRunning", isPlaying ? 0 : 1);
              soundEngine.playSwitchClick();
            }}
            className={`min-h-9 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              isPlaying
                ? "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
                : "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-700"
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
            className={`min-h-9 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs flex items-center gap-1 ${
              cutaway
                ? "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-700"
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
            className={`min-h-9 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs flex items-center gap-1 ${
              showCallouts
                ? "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-700"
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
            onClick={() => handleCameraPreset("overview")}
            className="min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
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
                {telemetry.speedMultiplier.toFixed(2)}× ({telemetry.planetTeeth}:
                {telemetry.sunTeeth} teeth)
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Driveshaft Speed:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {telemetry.shaftRpm.toFixed(1)} RPM instantaneous
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Scenario Ideal Power:</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                {telemetry.meanPowerKw.toFixed(1)} kW
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Scenario Indicated HP:</span>
              <span className="text-purple-800 dark:text-purple-400 font-bold">
                {telemetry.indicatedHorsepower.toFixed(1)} hp
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Scenario Piston Force:</span>
              <span className="text-rose-700 dark:text-rose-400 font-bold">
                {(telemetry.pistonForceN / 1e3).toFixed(1)} kN
              </span>
            </div>
          </div>
        )}

        {/* Bottom SI Telemetry Chip Strip */}
        <StudioKernelChips
          side="right"
          visible={showUiOverlay}
          title="SUN AND PLANET ROTARY STEAM POWER"
          chips={[
            { label: "Scenario Stroke", value: `${strokeRateSpm}`, unit: "SPM" },
            {
              label: "Scenario Pressure",
              value: `${boilerPressureKpa}`,
              unit: "kPa",
            },
            {
              label: "Shaft Speed",
              value: `${telemetry.meanShaftRpm.toFixed(0)}`,
              unit: "RPM",
              tone: "hot",
            },
            {
              label: "Gear Ratio",
              value: `${telemetry.gearRatioNpOverNs.toFixed(2)}:1`,
              unit: "Planet/Sun",
            },
            {
              label: "Scenario Flywheel Mass",
              value: `${flywheelMassKg.toLocaleString()}`,
              unit: "kg",
            },
            { label: "Mechanism", value: "Sun and Planet Epicyclic Gearing" },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Scenario Effective Pressure
              </span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {boilerPressureKpa} kPa
              </span>
            </div>
            <input
              type="range"
              aria-label="Scenario effective boiler pressure"
              min="40"
              max="120"
              step="5"
              value={boilerPressureKpa}
              onChange={(e) => updateParam("boilerPressureKpa", Number.parseFloat(e.target.value))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Scenario Stroke Rate
              </span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {strokeRateSpm} SPM
              </span>
            </div>
            <input
              type="range"
              aria-label="Scenario stroke rate"
              min="10"
              max="40"
              step="1"
              value={strokeRateSpm}
              onChange={(e) => updateParam("strokeRateSpm", Number.parseFloat(e.target.value))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Planet / Sun Teeth</span>
              <span className="text-sky-700 dark:text-sky-400 font-mono font-bold">
                {telemetry.planetTeeth}:{telemetry.sunTeeth}
              </span>
            </div>
            <input
              data-audit-primary-control="true"
              aria-label="Planet to sun gear ratio"
              type="range"
              min="0.5"
              max="2"
              step="0.25"
              value={gearRatioNpOverNs}
              onChange={(event) =>
                updateParam("gearRatioNpOverNs", Number.parseFloat(event.target.value))
              }
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sky-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-sky-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Scenario Flywheel Mass
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                {flywheelMassKg} kg
              </span>
            </div>
            <input
              type="range"
              aria-label="Scenario flywheel mass"
              min="1000"
              max="5000"
              step="250"
              value={flywheelMassKg}
              onChange={(e) => updateParam("flywheelMassKg", Number.parseFloat(e.target.value))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>
        </div>

        <p className="mt-3 rounded-xl border border-amber-500/25 bg-amber-950/10 px-3 py-2 text-xs leading-relaxed text-ink-700 dark:text-parchment-300">
          <strong className="text-ink-900 dark:text-parchment-100">Source boundary.</strong>{" "}
          {WATT_ROTARY_SOURCE_BOUNDARY}
        </p>

        <ClaimConstraintToggle
          patentId="gb-1306-watt-rotary-engine"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />
      </div>
    </div>
  );
}
