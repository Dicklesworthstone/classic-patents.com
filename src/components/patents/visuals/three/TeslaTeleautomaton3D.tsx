"use client";

import { Camera, Eye, EyeOff, Radio, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { stepTeslaTeleautomaton } from "@/physics/catalogKernels";
import { createStudioClock } from "@/physics/tickScheduler";
import {
  globalTransportBus,
  type TapeUpdater,
  useFrankenSimPhysics,
} from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
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

/** Fields the render loop consumes from each teleautomaton kernel step. */
interface TeleautoStepPose {
  propellerOmegaRadPerS: number;
  rudderAngleDeg: number;
  steppingDiskIndex: number;
  cohererDisplayOmegaRadPerS: number;
}

export function TeslaTeleautomaton3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [cutawayMode, setCutawayMode] = useState<boolean>(true);

  const { params, updateParam } = usePatentPhysics("us-613809-tesla-teleautomaton");
  const rudderAngleDeg = params.rudderAngle ?? 15;
  const transmitterFreqKhz = params.rfFrequency ?? 150;
  const propellerThrottlePct = params.propellerThrottlePct ?? 75;
  const pulseCount = params.pulseCount ?? 3;
  const [showRadioWaves, setShowRadioWaves] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

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

  // Shared transport tape: RF tank/coherer/propulsion state publishes to the patentId-keyed bus.
  useFrankenSimPhysics("us-613809-tesla-teleautomaton", {
    domain: "electromagnetics_flux",
    refusal: { isRefused: false },
  });
  const teleStepRef = useRef<TeleautoStepPose | null>(null);
  const teleDiskPhaseRef = useRef(0);

  useEffect(() => {
    const integrate: TapeUpdater = (_prev, dt) => {
      const out = stepTeslaTeleautomaton({
        rfFrequency: live.current.transmitterFreqKhz,
        rudderAngle: live.current.rudderAngleDeg,
        propellerThrottlePct: live.current.propellerThrottlePct,
        pulseCount: live.current.pulseCount,
      });
      teleStepRef.current = out;
      // Stepping-disk commutator rotation is the accumulated EM phase on the tape.
      teleDiskPhaseRef.current += out.cohererDisplayOmegaRadPerS * dt;
      return {
        em: {
          frequencyHz: out.rfFrequencyKhz * 1000,
          magneticFluxDensityTesla: 0,
          electricFieldVpm: 0,
          phaseAngleRad: teleDiskPhaseRef.current,
          inductanceHenry: 0,
          capacitanceFarad: 0,
          currentAmperes: 0,
          voltageVolts: 0,
          powerFactor: 0,
          efficiencyPct: 0,
          synchronousRpm: 0,
          slipFraction: 0,
          rotorRpm: out.propellerRpm,
          shaftPowerWatts: 0,
          electricalInputWatts: 0,
        },
      };
    };
    globalTransportBus.registerUpdater("us-613809-tesla-teleautomaton", integrate, "TS_FALLBACK");
    return () => globalTransportBus.unregisterUpdater("us-613809-tesla-teleautomaton");
  }, [live]);

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
    const clock = createStudioClock();

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      const { dt: delta, simTimeSec: timeSec } = clock.pump(now);
      const p = live.current;
      // Bus-owned kernel step: read the latest shared-tape outputs; render
      // immediately from the static model until the first tape tick lands.
      const out = teleStepRef.current;
      if (out) {
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
      }

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
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-9.5rem)] sm:max-w-[calc(100%-28rem)] gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
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
            title={showUiOverlay ? "Hide Overlay UI (Clean 3D View)" : "Show Overlay UI"}
            aria-label={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
          >
            {showUiOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
          <SensitivitySlider
            id="rfFrequency"
            patentId="us-613809-tesla-teleautomaton"
            paramKey="rfFrequency"
            label="Transmitter RF Frequency"
            value={transmitterFreqKhz}
            min={100}
            max={200}
            step={5}
            onChange={(val) => updateParam("rfFrequency", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="rudderAngle"
            patentId="us-613809-tesla-teleautomaton"
            paramKey="rudderAngleDeg"
            label="Rudder Position"
            value={rudderAngleDeg}
            min={-45}
            max={45}
            step={5}
            onChange={(val) => updateParam("rudderAngle", val)}
            allParams={params}
          />

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
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
            />
          </div>
        </div>

        <ClaimConstraintToggle
          patentId="us-613809-tesla-teleautomaton"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-613809-tesla-teleautomaton"
          params={params}
          className="mt-3"
        />
      </div>
    </div>
  );
}
