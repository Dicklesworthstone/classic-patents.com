"use client";

import { Camera, Eye, EyeOff, Layers, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { wrapCycleRad } from "@/physics/catalogKernels";
import { FrankenSimEngine } from "@/physics/engine";
import { createStudioClock } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { buildDaimlerEngineModel, updateDaimlerEngineKinematics } from "./daimlerEngineModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "cylinder" | "crankcase" | "hottube" | "flywheel" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [4.5, 3.5, 5.5], target: [0, 0.4, 0] },
  cylinder: { pos: [0, 2.2, 3.5], target: [0, 1.3, 0] },
  crankcase: { pos: [0, -0.2, 3.2], target: [0, -0.6, 0] },
  hottube: { pos: [-2.2, 2.6, 1.8], target: [-0.5, 2.2, 0] },
  flywheel: { pos: [3.6, 0.8, 2.4], target: [0, -0.6, 0] },
  top: { pos: [0, 7.0, 0.1], target: [0, 0.5, 0] },
};

export function DaimlerEngine3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { params, updateParam } = usePatentPhysics("us-361931-daimler-engine");

  const engineRpm = params.engineRpm ?? 750;
  const hotTubeTempC = params.hotTubeTemp ?? 850;
  const turnAngle = params.turnAngle ?? 15;
  const daimler = FrankenSimEngine.stepDaimlerEngine({
    engineRpm,
    hotTubeTempC,
    differentialSlipAngleDeg: turnAngle,
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isMuted, toggleMute } = usePatentAudio();

  const brakeHorsepower = daimler.brakeHorsepower;

  const live = useLiveSimParams({
    engineRpm,
    hotTubeTempC,
    isPlaying,
    isCutaway,
    bmepBar: daimler.bmepBar,
    brakeHorsepower: daimler.brakeHorsepower,
    outerWheelRpm: daimler.outerWheelRpm,
    innerWheelRpm: daimler.innerWheelRpm,
    runningOmegaRadPerS: daimler.runningOmegaRadPerS,
  });

  const studioRef = useRef<StudioContext | null>(null);

  const setCameraView = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };
  const applyCameraPreset = setCameraView;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [4.5, 3.5, 5.5],
      targetPos: [0, 0.4, 0],
    });
    studioRef.current = studio;

    const engineModel = buildDaimlerEngineModel();
    studio.scene.add(engineModel.rootGroup);

    let animId = 0;
    let crankAngleRad = 0;
    let virtualTime = 0;
    let lastAudioTime = 0;
    const clock = createStudioClock();

    const animate = (now: number) => {
      animId = requestAnimationFrame(animate);
      const { dt } = clock.pump(now);

      const p = live.current;
      if (p.isPlaying) {
        virtualTime += dt;
        crankAngleRad = wrapCycleRad(crankAngleRad + dt * p.runningOmegaRadPerS);

        const strokePeriod = (2 * Math.PI) / (p.runningOmegaRadPerS || 1);
        if (virtualTime - lastAudioTime > strokePeriod && !isMuted) {
          soundEngine.playLockstitchClack();
          lastAudioTime = virtualTime;
        }
      }

      updateDaimlerEngineKinematics(engineModel, crankAngleRad, crankAngleRad, p.isCutaway);

      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      engineModel.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live, isMuted]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <PortHamiltonianEnergyStrip
        patentId="us-361931-daimler-engine"
        params={{
          engineRpm,
          hotTubeTempC,
        }}
      />
      <div className="sr-only">Daimler High-Speed Petrol Engine 3D</div>
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
                ["cylinder", "Cylinder"],
                ["crankcase", "Crankcase"],
                ["hottube", "Hot Tube"],
                ["flywheel", "Flywheels"],
                ["top", "Top"],
              ] as [CameraPreset, string][]
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => setCameraView(preset)}
                className={`px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
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
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 max-w-[90%] pointer-events-auto">
          <ClaimConstraintToggle
            patentId="us-361931-daimler-engine"
            claimStates={claimStates}
            onToggleClaim={(c: number, active: boolean) => {
              setClaimStates((prev) => ({ ...prev, [c]: active }));
              updateParam("engineRpm", active ? 750 : 120);
            }}
          />
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              isPlaying
                ? "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
                : "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-600"
            }`}
          >
            <Play className="w-3.5 h-3.5 inline sm:mr-1" />
            <span className="hidden md:inline">{isPlaying ? "Pause" : "Run"}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Switch to Solid Engine" : "Switch to Cutaway View"}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              isCutaway
                ? "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-600"
                : "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5 inline sm:mr-1" />
            <span className="hidden md:inline">{isCutaway ? "Solid" : "Cutaway"}</span>
          </button>
          <button
            type="button"
            onClick={toggleMute}
            className="p-1.5 sm:px-2 sm:py-1.5 rounded-lg text-xs font-sans bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border border-parchment-300 dark:border-ink-700 hover:bg-parchment-100 transition-colors shadow-xs"
            title={isMuted ? "Unmute Engine Audio" : "Mute Engine Audio"}
            aria-label={isMuted ? "Unmute Engine Audio" : "Mute Engine Audio"}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 inline" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 inline text-emerald-600 dark:text-emerald-400" />
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
            onClick={() => applyCameraPreset("iso")}
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
                Crankshaft Speed:
              </span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">{engineRpm} RPM</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Brake Power:</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                {brakeHorsepower} HP
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">BMEP:</span>
              <span className="text-rose-700 dark:text-rose-400 font-bold">
                {daimler.bmepBar} bar · {hotTubeTempC} °C
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Differential Wheels:</span>
              <span className="text-sky-800 dark:text-sky-400 font-bold">
                {daimler.innerWheelRpm}/{daimler.outerWheelRpm} rpm
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Specific Power:</span>
              <span className="text-purple-800 dark:text-purple-400 font-bold">
                {daimler.specificPowerHpPerKg} hp/kg
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
              <span className="text-ink-700 dark:text-ink-300 font-medium">Engine Speed</span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {engineRpm} RPM
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="1200"
              step="50"
              value={engineRpm}
              onChange={(e) => updateParam("engineRpm", Number.parseInt(e.target.value, 10))}
              className="w-full accent-amber-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Hot-Tube Igniter Temp
              </span>
              <span className="text-rose-700 dark:text-rose-400 font-mono font-bold">
                {hotTubeTempC} °C
              </span>
            </div>
            <input
              type="range"
              min="600"
              max="1100"
              step="25"
              value={hotTubeTempC}
              onChange={(e) => updateParam("hotTubeTemp", Number.parseInt(e.target.value, 10))}
              className="w-full accent-rose-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Differential Turn Angle
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                {turnAngle}°
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="45"
              step="5"
              value={turnAngle}
              onChange={(e) => updateParam("turnAngle", Number.parseInt(e.target.value, 10))}
              className="w-full accent-emerald-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-parchment-200 dark:border-ink-800">
          <SensitivitySlider
            id="us-361931-daimler-engine-enginerpm"
            patentId="us-361931-daimler-engine"
            paramKey="engineRpm"
            label="Engine Speed"
            value={engineRpm}
            unit="RPM"
            min={200}
            max={1200}
            step={25}
            onChange={(val) => updateParam("engineRpm", Math.round(val))}
          />
        </div>
      </div>

      {/* Bottom SI Telemetry Chip Strip */}
      <StudioKernelChips
        visible={true}
        title="HIGH-SPEED FOUR-STROKE INTERNAL COMBUSTION"
        chips={[
          {
            label: "Power Output",
            value: `${brakeHorsepower.toFixed(2)}`,
            unit: "BHP",
            tone: "hot",
          },
          { label: "Crank Speed", value: `${engineRpm}`, unit: "RPM" },
          { label: "BMEP", value: `${daimler.bmepBar.toFixed(2)}`, unit: "bar" },
          { label: "Hot-Tube Temp", value: `${hotTubeTempC}`, unit: "°C" },
          {
            label: "Ignition",
            value: hotTubeTempC >= 750 ? "Incandescent Tube" : "Misfire",
            tone: hotTubeTempC >= 750 ? "ok" : "warn",
          },
          {
            label: "Architecture",
            value: "Curved-Groove Cam Standuhr Engine",
          },
        ]}
      />
    </div>
  );
}
