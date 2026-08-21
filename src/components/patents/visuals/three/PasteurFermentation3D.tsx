"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { stepPasteurFermentation } from "@/physics/catalogKernels";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import {
  buildPasteurFermentationModel,
  updatePasteurFermentationKinematics,
} from "./pasteurFermentationModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset =
  | "iso"
  | "gooseneck_airlock"
  | "cooling_coil"
  | "sampling_valve"
  | "cotton_filter"
  | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [9.0, 7.0, 10.5], target: [0, 0, 0] },
  gooseneck_airlock: { pos: [0, 4.5, 3.5], target: [0, 3.0, 0] },
  cooling_coil: { pos: [2.8, 0, 3.5], target: [0, -0.5, 0] },
  sampling_valve: { pos: [0, -0.8, 3.8], target: [0, -1.2, 1.2] },
  cotton_filter: { pos: [2.8, 3.5, 1.8], target: [2.2, 3.2, 0] },
  top: { pos: [0, 11.5, 0.1], target: [0, 0, 0] },
};

export const PasteurFermentation3D = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // Biochemical Fermentation Parameters
  const { params, updateParam } = usePatentPhysics("us-135245-pasteur-fermentation");
  const fermentationTempC = (params.wortTempC as number) ?? (params.tempCelsius as number) ?? 22;
  const pasteurizationTempC = (params.pasteurizationTempC as number) ?? 58;
  const holdTimeMin = (params.holdTimeMin as number) ?? 20;
  const isPureYeast = Boolean(params.pureYeast ?? true);

  const pasteur = stepPasteurFermentation({
    pasteurizationTempC,
    holdTimeMin,
    wortTempC: fermentationTempC,
  });
  const [showBubbles] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  const live = useLiveSimParams({
    fermentationTempC,
    isPureYeast,
    showBubbles,
    isAudioMuted,
    yeastActivityPct: pasteur.yeastActivityPct,
    logReduction: pasteur.logReduction,
    isCutaway,
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

    const { rootGroup, nodes, materials, dispose } = buildPasteurFermentationModel();
    scene.add(rootGroup);

    let reqId: number;
    let presentationStep = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const dt = 1 / 60;
      const elapsedSec = presentationStep * dt;
      presentationStep += 1;
      const p = live.current;

      updatePasteurFermentationKinematics(
        nodes,
        materials,
        dt,
        elapsedSec,
        p.fermentationTempC,
        p.yeastActivityPct,
        p.showBubbles,
        p.isCutaway ?? false,
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
      <div className="sr-only">Pasteur Fermentation Vat 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-14rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3.5 h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["gooseneck_airlock", "Gooseneck Trap"],
                ["cooling_coil", "Cooling Coils"],
                ["sampling_valve", "Sampling Valve"],
                ["cotton_filter", "Cotton Filter"],
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

        {/* Top Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Solid Vat" : "Cutaway Copper Vat"}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm text-xs font-sans flex items-center gap-1 ${
              isCutaway
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            <Layers className="w-4 h-4" />
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
            title={showUiOverlay ? "Hide Overlay UI (Clean 3D View)" : "Show Overlay UI"}
            aria-label={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
          >
            {showUiOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                Wort Temperature:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {fermentationTempC} °C
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Yeast Activity:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {pasteur.yeastActivityPct}%
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Alcohol Yield:</span>
              <span className="font-bold text-cyan-800 dark:text-cyan-400">
                {pasteur.alcoholAbvPct.toFixed(1)}% ABV
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Microbial Kill:</span>
              <span className="font-bold text-purple-800 dark:text-purple-400">
                {pasteur.logReduction.toFixed(1)} log
              </span>
            </div>
          </div>
        )}

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="Pasteur closed brewing vat kinematics"
          chips={[
            {
              label: "Wort Temp",
              value: `${fermentationTempC}`,
              unit: "°C",
              tone: pasteur.yeastActivityPct > 40 ? "ok" : "warn",
            },
            { label: "Yeast Activity", value: `${pasteur.yeastActivityPct}`, unit: "%" },
            { label: "Alcohol Yield", value: pasteur.alcoholAbvPct.toFixed(1), unit: "% ABV" },
            { label: "CO₂ Overpressure", value: pasteur.co2PressureBar.toFixed(2), unit: "bar" },
            { label: "Microbial Log Kill", value: pasteur.logReduction.toFixed(1) },
            { label: "Spoilage Survivors", value: `${pasteur.survivorPct}`, unit: "%" },
            { label: "Shelf Life", value: `${pasteur.shelfLifeMonths}`, unit: "months" },
            {
              label: "Wort crate",
              value: crateSource === "wasm" ? "fs-sparse" : "ts-heat-fallback",
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
                Fermentation Wort Temp
              </span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {fermentationTempC} °C
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="45"
              step="1"
              value={fermentationTempC}
              onChange={(e) => updateParam("wortTempC", Number.parseInt(e.target.value, 10))}
              className="w-full accent-amber-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Pasteurization Bath Temp
              </span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {pasteurizationTempC} °C
              </span>
            </div>
            <input
              type="range"
              min="45"
              max="75"
              step="1"
              value={pasteurizationTempC}
              onChange={(e) =>
                updateParam("pasteurizationTempC", Number.parseInt(e.target.value, 10))
              }
              className="w-full accent-cyan-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Thermal Hold Time</span>
              <span className="text-purple-700 dark:text-purple-400 font-mono font-bold">
                {holdTimeMin} min
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              step="5"
              value={holdTimeMin}
              onChange={(e) => updateParam("holdTimeMin", Number.parseInt(e.target.value, 10))}
              className="w-full accent-purple-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
});
