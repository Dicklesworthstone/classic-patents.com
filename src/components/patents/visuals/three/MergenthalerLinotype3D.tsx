"use client";

import { Camera, Eye, EyeOff, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { stepMergenthalerLinotype } from "@/physics/machineKernels";
import { createStudioClock } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import {
  buildMergenthalerLinotypeModel,
  updateMergenthalerLinotypeKinematics,
} from "./mergenthalerLinotypeModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset =
  | "iso"
  | "matrix_magazine"
  | "casting_pot"
  | "spaceband_justifier"
  | "keyboard"
  | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [11.0, 8.5, 12.5], target: [0, 0, 0] },
  matrix_magazine: { pos: [0, 4.2, 3.8], target: [0, 2.2, 0] },
  casting_pot: { pos: [-2.8, 0.5, 3.5], target: [-1.5, -0.4, 0] },
  spaceband_justifier: { pos: [0, 0.8, 3.2], target: [0, 0.2, 0] },
  keyboard: { pos: [0, 1.2, 3.4], target: [0, -0.6, 1.4] },
  top: { pos: [0, 14.0, 0.1], target: [0, 0, 0] },
};

export function MergenthalerLinotype3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  // Linotype Mechanical Composing Parameters
  const { params, updateParam } = usePatentPhysics("us-313224-mergenthaler-linotype");
  const matrixRate = params.matrixRate ?? 60;
  const spacebandWedge = params.spacebandWedge ?? 6.5;
  const potTempC = params.potTemp ?? 260;
  const linotypeIdle = stepMergenthalerLinotype({
    matrixRatePerMin: matrixRate,
    spacebandWedgeMm: spacebandWedge,
    potTempC,
  });
  const castingLpm = linotypeIdle.linesPerMin;
  const charsPerHour = linotypeIdle.charsPerHour;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  const live = useLiveSimParams({
    matrixRate,
    spacebandWedge,
    potTempC,
    isAudioMuted,
    isCutaway,
  });

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
    void ensureGenericWasm().then((next) => setCrateSource(next));
  }, []);

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

    const { rootGroup, nodes, materials, dispose } = buildMergenthalerLinotypeModel();
    scene.add(rootGroup);

    // Animation Loop
    let reqId: number;
    const clock = createStudioClock();

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      controls.update();
      const { dt, simTimeSec: timeSec } = clock.pump(now);
      const p = live.current;

      const step = stepMergenthalerLinotype({
        matrixRatePerMin: p.matrixRate,
        spacebandWedgeMm: p.spacebandWedge,
        potTempC: p.potTempC,
        elapsedS: timeSec,
      });

      // Update cutaway transparency on metal pot
      materials.castIron.opacity = p.isCutaway ? 0.35 : 1.0;
      materials.castIron.transparent = p.isCutaway;

      updateMergenthalerLinotypeKinematics(
        nodes,
        materials,
        dt,
        timeSec,
        step.plungerY,
        step.moldAngle,
        step.slugOut,
        step.wedgeLift,
        p.matrixRate,
        p.spacebandWedge,
        p.potTempC,
      );

      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Mergenthaler Linotype 3D</div>
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
                ["matrix_magazine", "Magazine"],
                ["casting_pot", "Casting Pot"],
                ["spaceband_justifier", "Spacebands"],
                ["keyboard", "Keyboard"],
                ["top", "Top"],
              ] as [CameraPreset, string][]
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

        {/* Top-Right Action Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap justify-end gap-1.5 sm:gap-2 max-w-[90%]">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Switch to Solid Casting" : "Switch to Framework Cutaway"}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              isCutaway
                ? "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-600"
                : "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
            }`}
          >
            {isCutaway ? (
              <EyeOff className="w-3.5 h-3.5 inline sm:mr-1" />
            ) : (
              <Eye className="w-3.5 h-3.5 inline sm:mr-1" />
            )}
            <span className="hidden md:inline">{isCutaway ? "Solid" : "Cutaway"}</span>
          </button>
          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Linecaster Sound" : "Mute Linecaster Sound"}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100 transition-colors shadow-xs"
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 inline sm:mr-1 text-ink-500" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 inline sm:mr-1 text-amber-600" />
            )}
            <span className="hidden md:inline">{isAudioMuted ? "Muted" : "Sound"}</span>
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
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100 transition-colors shadow-xs"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-3.5 h-3.5 inline sm:mr-1" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>

        <StudioKernelChips
          visible={showUiOverlay}
          title="Mergenthaler hot-metal linecaster"
          chips={[
            { label: "Lines", value: castingLpm.toFixed(1), unit: "lpm" },
            { label: "Throughput", value: String(charsPerHour), unit: "char/hr" },
            { label: "Wedge", value: String(spacebandWedge), unit: "mm" },
            { label: "Pot", value: String(Math.round(potTempC)), unit: "°C" },
            { label: "Width", value: String(linotypeIdle.justificationWidthMm), unit: "mm" },
            { label: "Solid", value: String(linotypeIdle.solidificationTimeMs), unit: "ms" },
            { label: "Hardness", value: String(linotypeIdle.brinellHardness), unit: "HB" },
            { label: "Dist", value: String(linotypeIdle.distributorFreqHz), unit: "Hz" },
            {
              label: "Mag crate",
              value: crateSource === "wasm" ? "fs-symmetry" : "ts-cyclic-fallback",
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
                Matrix Assembly Rate
              </span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {matrixRate} char/min
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="120"
              step="5"
              value={matrixRate}
              onChange={(e) => updateParam("matrixRate", Number.parseFloat(e.target.value))}
              className="w-full accent-amber-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Spaceband Wedge Lift
              </span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {spacebandWedge.toFixed(1)} mm
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="10"
              step="0.5"
              value={spacebandWedge}
              onChange={(e) => updateParam("spacebandWedge", Number.parseFloat(e.target.value))}
              className="w-full accent-cyan-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Melting Pot Temperature
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                {potTempC} °C
              </span>
            </div>
            <input
              type="range"
              min="230"
              max="320"
              step="5"
              value={potTempC}
              onChange={(e) => updateParam("potTemp", Number.parseFloat(e.target.value))}
              className="w-full accent-emerald-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>

        <ClaimConstraintToggle
          patentId="us-313224-mergenthaler-linotype"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-313224-mergenthaler-linotype"
          params={params}
          className="mt-3"
        />
      </div>
    </div>
  );
}
