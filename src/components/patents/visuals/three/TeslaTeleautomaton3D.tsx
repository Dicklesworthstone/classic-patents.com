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

  const { params } = usePatentPhysics("us-613809-tesla-teleautomaton");
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
    <div className="relative w-full h-[620px] bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent flex flex-col">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-parchment-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto text-parchment-100">
          <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-parchment-100 uppercase tracking-wider">
            Tesla Teleautomaton Robotic Boat 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 613,809 (1898)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Overview"],
              ["coherer_switch", "Coherer"],
              ["stepping_disk", "Logic Disk"],
              ["propeller_rudder", "Prop & Rudder"],
              ["antenna_mast", "RF Antenna"],
              ["top", "Top"],
            ] as [CameraPreset, string][]
          ).map(([preset, label]) => (
            <button
              key={preset}
              type="button"
              onClick={() => applyCameraPreset(preset)}
              className={`px-2.5 py-1 text-xs font-sans rounded-lg transition-colors ${
                activeCamera === preset
                  ? "bg-amber-600 text-white font-semibold shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60 shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={() => setCutawayMode(!cutawayMode)}
            title={cutawayMode ? "Switch to Solid Hull" : "Switch to Cutaway Hull"}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              cutawayMode
                ? "bg-amber-600 text-white font-semibold shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            {cutawayMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setShowRadioWaves(!showRadioWaves)}
            title={showRadioWaves ? "Hide RF Waves" : "Show RF Waves"}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              showRadioWaves
                ? "bg-amber-600 text-white font-semibold shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Radio className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className="p-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Zap className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

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
  );
}
