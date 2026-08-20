"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepMorseTelegraph } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildMorseTelegraphModel, updateMorseTelegraphKinematics } from "./morseTelegraphModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset =
  | "iso"
  | "key_lever"
  | "electromagnet_relay"
  | "paper_tape_register"
  | "sounding_anvil"
  | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [11, 8, 13], target: [0, 0, 0] },
  key_lever: { pos: [-3.5, 2.5, 4.5], target: [-3.5, -0.8, 0] },
  electromagnet_relay: { pos: [3.5, 2.0, 4.0], target: [3.5, -0.8, 0] },
  paper_tape_register: { pos: [2.0, 3.5, 3.5], target: [1.5, 0.5, 0] },
  sounding_anvil: { pos: [3.5, 3.0, 2.0], target: [3.5, 0.2, 0] },
  top: { pos: [0, 11.5, 0.1], target: [0, 0, 0] },
};

export function MorseTelegraph3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // Telegraph Circuit State Controls
  const { params } = usePatentPhysics("us-1647-morse-telegraph");
  const lineVoltageV = params.lineVoltageV ?? 24;
  const lineLengthMiles = params.lineLengthMiles ?? 44;
  const [keyIsDown, setKeyIsDown] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const morse = stepMorseTelegraph({
    wireTurns: params.wireTurns ?? 1200,
    lineVoltageV,
    lineLengthMiles,
    wpmSpeed: params.wpmSpeed ?? 20,
  });

  const live = useLiveSimParams({
    keyIsDown,
    lineVoltageV,
    lineLengthMiles,
    isAudioMuted,
    isCutaway,
    wpmSpeed: morse.wpmSpeed,
    loopCurrentMa: morse.loopCurrentMa,
    magneticForceN: morse.magneticForceN,
    ampereTurns: morse.ampereTurns,
    tapeAdvanceRadPerS: morse.tapeAdvanceRadPerS,
    unitDurationMs: morse.unitDurationMs,
    keyOscillationRadPerS: morse.keyOscillationRadPerS,
    armatureStrikeM: morse.armatureStrikeM,
    electronDisplaySpeed: morse.electronDisplaySpeed,
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

    const { rootGroup, nodes, materials, dispose } = buildMorseTelegraphModel();
    scene.add(rootGroup);

    // Animation Loop
    let reqId: number;
    let timeSec = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const dt = 1 / 60;
      timeSec += dt;
      const p = live.current;

      updateMorseTelegraphKinematics(
        nodes,
        materials,
        dt,
        timeSec,
        p.keyOscillationRadPerS,
        p.armatureStrikeM,
        p.tapeAdvanceRadPerS,
        p.electronDisplaySpeed,
        p.keyIsDown,
        p.isCutaway,
        p.lineVoltageV,
        p.lineLengthMiles,
        p.wpmSpeed,
      );

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="relative w-full h-[620px] bg-parchment-900 rounded-2xl overflow-hidden border border-parchment-700 shadow-2xl flex flex-col">
      <section
        ref={containerRef}
        aria-label="3D Interactive Morse Telegraph simulation"
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={() => setKeyIsDown(true)}
        onMouseUp={() => setKeyIsDown(false)}
      />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-parchment-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-parchment-100 uppercase tracking-wider">
            Morse Telegraph 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 1,647 (1840)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["key_lever", "Key Lever"],
              ["electromagnet_relay", "Electromagnet"],
              ["paper_tape_register", "Paper Tape"],
              ["sounding_anvil", "Anvil"],
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
                  : "text-parchment-300 hover:text-white hover:bg-parchment-800/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Solid Mahogany Base" : "Cutaway Base"}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-sans rounded-lg transition-colors ${
              isCutaway
                ? "bg-amber-600/30 text-amber-200 border border-amber-500/40"
                : "text-parchment-300 hover:text-white hover:bg-parchment-800/60"
            }`}
          >
            {isCutaway ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isCutaway ? "Cutaway" : "Solid"}</span>
          </button>

          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            <Zap className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      <StudioKernelChips
        visible={showUiOverlay}
        title="Morse electro-magnetic telegraph"
        chips={[
          { label: "Line Length", value: String(lineLengthMiles), unit: "mi" },
          { label: "Battery", value: String(lineVoltageV), unit: "V" },
          { label: "Loop Current", value: morse.loopCurrentMa.toFixed(1), unit: "mA" },
          { label: "Hold Force", value: morse.magneticForceN.toFixed(2), unit: "N" },
          { label: "Ampere-Turns", value: String(morse.ampereTurns), unit: "A·t" },
          { label: "Line R", value: String(morse.lineResistanceOhms), unit: "Ω" },
          { label: "Total Loop R", value: String(morse.loopResistanceOhms), unit: "Ω" },
          { label: "WPM Speed", value: String(morse.wpmSpeed), unit: "wpm" },
        ]}
      />
    </div>
  );
}
