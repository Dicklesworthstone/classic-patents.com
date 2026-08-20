"use client";

import {
  Camera,
  Eye,
  EyeOff,
  Flame,
  Layers,
  Rocket,
  RotateCcw,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FrankenSimEngine } from "@/physics/engine";
import { ensureGoddardWasm } from "@/physics/goddardWasm";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildGoddardRocketModel, updateGoddardRocketKinematics } from "./goddardRocketModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

import { usePatentAudio } from "./usePatentAudio";

type CameraPreset =
  | "iso"
  | "de_laval_nozzle"
  | "combustion_chamber"
  | "gimbal_actuator"
  | "interstage"
  | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [13, 10, 16], target: [0, 0, 0] },
  de_laval_nozzle: { pos: [0, -3.2, 5.0], target: [0, -3.0, 0] },
  combustion_chamber: { pos: [0, -0.5, 4.5], target: [0, -1.0, 0] },
  gimbal_actuator: { pos: [2.8, -2.4, 3.5], target: [0, -2.5, 0] },
  interstage: { pos: [2.8, 1.8, 4.2], target: [0, 1.5, 0] },
  top: { pos: [0, 11.5, 0.1], target: [0, 0, 0] },
};

export function GoddardRocket3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGoddardWasm();
  }, []);

  // Propulsion & Staging State Controls
  const { params } = usePatentPhysics("us-1102653-goddard-rocket");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const chamberPressurePsi = params.chamberPressure ?? 350;
  const expansionRatio = params.expansionRatio ?? 3.5;
  const fuelFlowRateKgs = params.fuelFlowRateKgs ?? 1.8;
  const activeStage = params.activeStage ?? 1;
  const gyroGimbalAngleDeg = params.gyroGimbalAngleDeg ?? 3;
  const showExhaustPlume = params.showExhaustPlume !== 0;
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  // Rocket Propulsion Physics (FrankenSim de Laval Isentropic Expansion)
  const rocketPhysics = FrankenSimEngine.stepGoddardRocket(
    chamberPressurePsi,
    fuelFlowRateKgs,
    4.2,
    expansionRatio,
  );

  useFrankenSimPhysics("us-1102653-goddard-rocket", {
    domain: "thermodynamics_transport",
    timestampMs: Date.now(),
    timeStepDt: 0.016,
    refusal: { isRefused: false },
    thermo: {
      temperatureCelsius: 0,
      temperatureKelvin: 0,
      pressureAtm: rocketPhysics.chamberPressureAtm,
      partialPressureButaneAtm: 0,
      heatInputWatts: 0,
      coolingPowerWatts: 0,
      coefficientOfPerformance: 0,
      blackbodyRadiantPowerWatts: 0,
      fluidFlowVelocityMps: rocketPhysics.exhaustVelocityMps,
    },
  });
  const specificImpulseSec = Number(rocketPhysics.specificImpulseSec.toFixed(1));
  const exhaustVelocityMps = rocketPhysics.exhaustVelocityMps;
  const machExit = rocketPhysics.machExit;
  const thrustNewtons = rocketPhysics.thrustNewtons;
  const thrustLbf = rocketPhysics.thrustLbf;

  const live = useLiveSimParams({
    activeStage,
    gyroGimbalAngleDeg,
    showExhaustPlume,
    isCutaway,
    exhaustVelocityMps,
    expansionRatio: rocketPhysics.expansionRatio,
    plumeAdvancePerS: rocketPhysics.plumeAdvancePerS,
    exhaustTempK: rocketPhysics.exhaustTempK,
    isAudioMuted,
  });

  const studioRef = useRef<StudioContext | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = CAMERA_PRESETS[preset];
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

    const iso = CAMERA_PRESETS.iso;
    const studio = createThreeStudioScene({
      container,
      cameraPos: iso.pos,
      targetPos: iso.target,
    });
    studioRef.current = studio;

    const { scene, camera, renderer, controls } = studio;

    const model = buildGoddardRocketModel();
    scene.add(model.root);

    let reqId: number;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = 1 / 60;
      const p = live.current;

      updateGoddardRocketKinematics(
        model,
        delta,
        p.activeStage,
        p.gyroGimbalAngleDeg,
        p.expansionRatio,
        p.plumeAdvancePerS,
        p.showExhaustPlume,
        p.isCutaway,
      );

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      model.dispose();
      studio.dispose();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      {/* 3D WebGL Canvas Viewport */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Live HUD Telemetry Overlay */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-col gap-1.5 sm:gap-2 pointer-events-none max-w-[calc(100%-8rem)] sm:max-w-md transition-opacity duration-200">
            <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md p-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
              <div className="text-[10px] sm:text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Rocket className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 animate-pulse" />
                Supersonic Rocket Propulsion Telemetry
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 sm:gap-y-1 mt-1 text-[10px] sm:text-xs font-sans">
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Thrust:</span>{" "}
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {thrustNewtons.toLocaleString()} N ({thrustLbf.toLocaleString()} lbf)
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">{"I_sp:"}</span>{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {specificImpulseSec} s
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Exhaust V:</span>{" "}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {exhaustVelocityMps.toLocaleString()} m/s (M{machExit.toFixed(2)})
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Chamber P:</span>{" "}
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {chamberPressurePsi} psi ({rocketPhysics.chamberPressureAtm} atm)
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 items-center gap-2 max-w-full">
              <Flame className="w-3.5 h-3.5 text-amber-600 animate-pulse shrink-0" />
              <span className="truncate">
                Robert H. Goddard (US 1,155,986) — Rocket Apparatus (1914)
              </span>
            </div>
          </div>
        )}

        {/* Top Right Tool Bar (Toggle UI, Audio, Pins, Cutaway, Reset) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Switch to Solid Hull" : "Switch to Rocket Hull Cutaway"}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              isCutaway
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
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
            aria-label={isAudioMuted ? "Unmute simulation audio" : "Mute simulation audio"}
            type="button"
            onClick={toggleSound}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={isAudioMuted ? "Enable Sound" : "Mute Sound"}
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            )}
          </button>
          <button
            aria-label={showCalloutPins ? "Hide annotation pins" : "Show annotation pins"}
            type="button"
            onClick={() => setShowCalloutPins(!showCalloutPins)}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showCalloutPins
                ? "bg-amber-600 text-white border-amber-700 shadow-md"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
            title="Toggle Historical Patent Numeral Pins"
          >
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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

        {/* Camera Views Bar */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-1.5rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["de_laval_nozzle", "De Laval Nozzle"],
                ["combustion_chamber", "Chamber"],
                ["gimbal_actuator", "Gimbal Vanes"],
                ["interstage", "Interstage Stage 2"],
                ["top", "Aero Profile"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => applyCameraPreset(id)}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-sans whitespace-nowrap shrink-0 transition-colors ${
                  activeCamera === id
                    ? "bg-amber-700 dark:bg-amber-600 text-white font-semibold shadow-xs"
                    : "text-ink-700 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
