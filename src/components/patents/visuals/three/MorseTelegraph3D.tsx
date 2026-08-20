"use client";

import { Camera, Eye, EyeOff, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
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
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <section
          ref={containerRef}
          aria-label="3D Interactive Morse Telegraph simulation"
          className="absolute inset-0 w-full h-full"
          onMouseDown={() => setKeyIsDown(true)}
          onMouseUp={() => setKeyIsDown(false)}
        />

        {/* Top-Left Title HUD */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 pointer-events-none rounded-xl border border-parchment-700/60 bg-parchment-950/80 px-3.5 py-2 backdrop-blur-md shadow-lg">
            <div className="font-mono text-xs font-bold text-parchment-100 uppercase tracking-wider">
              Morse Telegraph 3D
            </div>
            <div className="text-[11px] text-parchment-300 font-sans">
              US Patent 1,647 • Electro-Magnetic Telegraph &amp; Sounder
            </div>
          </div>
        )}

        {/* Top Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Solid Mahogany Base" : "Cutaway Base"}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm text-xs font-sans flex items-center gap-1 ${
              isCutaway
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            {isCutaway ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden sm:inline">{isCutaway ? "Cutaway" : "Solid"}</span>
          </button>

          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showUiOverlay
                ? "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
                : "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
            }`}
            title={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
            aria-label={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
          >
            <Zap className="w-4 h-4" />
          </button>

          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Camera Views Bar */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-1.5rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3.5 h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["key_lever", "Key Lever"],
                ["electromagnet_relay", "Electromagnet"],
                ["paper_tape_register", "Paper Tape"],
                ["sounding_anvil", "Anvil"],
                ["top", "Plan View"],
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

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
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
    </div>
  );
}
