"use client";

import { Camera, Eye, EyeOff, Radio, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepTeslaTeleautomaton } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import {
  buildTeslaTeleautomatonModel,
  type TeslaTeleautomatonModelResult,
  updateTeslaTeleautomatonKinematics,
} from "./teslaTeleautomatonModel";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset =
  | "iso"
  | "coherer_switch"
  | "stepping_disk"
  | "propeller_rudder"
  | "antenna_mast"
  | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [7.5, 5.0, 8.5], target: [0, 0, 0] },
  coherer_switch: { pos: [1.4, 1.6, 2.2], target: [0.6, 0.35, 0] },
  stepping_disk: { pos: [0.5, 1.8, 2.4], target: [0, 0.35, 0] },
  propeller_rudder: { pos: [-5.5, 0.8, 3.2], target: [-4.0, -0.4, 0] },
  antenna_mast: { pos: [0.8, 4.2, 4.0], target: [0, 2.4, 0] },
  top: { pos: [0, 9.5, 0.1], target: [0, 0, 0] },
};

export function TeslaTeleautomaton3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [cutawayMode, setCutawayMode] = useState<boolean>(true);

  const { params, updateParam } = usePatentPhysics("us-613809-tesla-teleautomaton");
  const rudderAngleDeg = params.rudderAngle ?? 15;
  const transmitterFreqKhz = params.rfFrequency ?? 150;
  const propellerThrottlePct = params.propellerThrottlePct ?? 75;
  const pulseCount = params.pulseCount ?? 3;
  const [showRadioWaves, setShowRadioWaves] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const tele = stepTeslaTeleautomaton({
    rfFrequency: transmitterFreqKhz,
    rudderAngle: rudderAngleDeg,
    propellerThrottlePct,
    pulseCount,
  });

  const live = useLiveSimParams({
    rudderAngleDeg,
    transmitterFreqKhz,
    propellerThrottlePct,
    pulseCount,
    showRadioWaves,
    cutawayMode,
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

    // Procedural Tesla Teleautomaton Vessel Model
    const vesselModel: TeslaTeleautomatonModelResult = buildTeslaTeleautomatonModel();
    scene.add(vesselModel.root);

    // Animation Loop
    let reqId: number;
    let timeSec = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = 1 / 60;
      timeSec += delta;
      const p = live.current;
      const out = stepTeslaTeleautomaton({
        rfFrequency: p.transmitterFreqKhz,
        rudderAngle: p.rudderAngleDeg,
        propellerThrottlePct: p.propellerThrottlePct,
        pulseCount: p.pulseCount,
      });

      updateTeslaTeleautomatonKinematics(
        vesselModel.nodes,
        vesselModel.materials,
        delta,
        timeSec,
        out.propellerOmegaRadPerS,
        out.rudderAngleDeg,
        p.showRadioWaves,
        p.cutawayMode,
        out.steppingDiskIndex,
        out.cohererDisplayOmegaRadPerS,
      );

      controls.update();
      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      vesselModel.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Nikola Tesla Teleautomaton Wireless Robotic Boat 3D</div>
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
                ["iso", "Overview"],
                ["coherer_switch", "Coherer"],
                ["stepping_disk", "Logic Disk"],
                ["propeller_rudder", "Prop & Rudder"],
                ["antenna_mast", "RF Antenna"],
                ["top", "Top"],
              ] as const
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyCameraPreset(preset)}
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

        {/* Top Right Tool Bar */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setCutawayMode(!cutawayMode)}
            title={cutawayMode ? "Switch to Solid Hull" : "Switch to Cutaway Hull"}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              cutawayMode
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            {cutawayMode ? (
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowRadioWaves(!showRadioWaves)}
            title={showRadioWaves ? "Hide RF Waves" : "Show RF Waves"}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showRadioWaves
                ? "bg-amber-600 text-white border-amber-700 shadow-md"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            aria-label={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            type="button"
            onClick={toggleSound}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showUiOverlay
                ? "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
                : "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
            }`}
            title={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
            aria-label={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
          >
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                RF Frequency:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {transmitterFreqKhz} kHz ({tele.isResonant ? "Tuned" : "Off-Peak"})
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Coherer Resistance:</span>
              <span className="text-cyan-800 dark:text-cyan-400 font-bold">
                {tele.cohererOhms} Ω
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Propeller Thrust:</span>
              <span className="text-emerald-800 dark:text-emerald-400 font-bold">
                {tele.motorThrustN} N
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Rudder Angle:</span>
              <span className="text-purple-800 dark:text-purple-400 font-bold">
                {rudderAngleDeg}°
              </span>
            </div>
          </div>
        )}

        <StudioKernelChips
          visible={showUiOverlay}
          title="Tesla Wireless Teleautomation"
          chips={[
            { label: "Tx Freq", value: `${transmitterFreqKhz} kHz` },
            {
              label: "Resonance",
              value: tele.isResonant ? "TUNED LOCK" : "OFF-PEAK",
              tone: tele.isResonant ? "ok" : "warn",
            },
            { label: "Coherer R", value: `${tele.cohererOhms} Ω` },
            { label: "Rudder", value: `${rudderAngleDeg}°` },
            { label: "Prop ω", value: `${tele.propellerOmegaRadPerS.toFixed(1)} rad/s` },
            { label: "Thrust", value: `${tele.motorThrustN} N` },
            {
              label: "Turn Radius",
              value: tele.turningRadiusM < 900 ? `${tele.turningRadiusM} m` : "Straight",
            },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Transmitter RF Frequency
              </span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {transmitterFreqKhz} kHz
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="200"
              step="5"
              value={transmitterFreqKhz}
              onChange={(e) => updateParam("rfFrequency", Number.parseInt(e.target.value, 10))}
              className="w-full accent-amber-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Rudder Position</span>
              <span className="text-purple-700 dark:text-purple-400 font-mono font-bold">
                {rudderAngleDeg}°
              </span>
            </div>
            <input
              type="range"
              min="-45"
              max="45"
              step="5"
              value={rudderAngleDeg}
              onChange={(e) => updateParam("rudderAngle", Number.parseInt(e.target.value, 10))}
              className="w-full accent-purple-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Propeller Throttle</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                {propellerThrottlePct}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={propellerThrottlePct}
              onChange={(e) =>
                updateParam("propellerThrottlePct", Number.parseInt(e.target.value, 10))
              }
              className="w-full accent-emerald-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
