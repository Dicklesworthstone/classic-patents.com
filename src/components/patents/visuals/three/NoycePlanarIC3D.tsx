"use client";

import { Camera, Eye, EyeOff, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { stepNoyceIC } from "@/physics/catalogKernels";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildNoycePlanarIcModel, updateNoycePlanarIcKinematics } from "./noycePlanarICModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

type CameraPreset =
  | "iso"
  | "metallization_layer"
  | "oxide_dielectric"
  | "pn_junctions"
  | "leadframe"
  | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [10, 8, 12], target: [0, 0, 0] },
  metallization_layer: { pos: [0, 3.5, 4.5], target: [0, 0.6, 0] },
  oxide_dielectric: { pos: [0, 2.2, 5.0], target: [0, 0.3, 0] },
  pn_junctions: { pos: [-2.2, 1.8, 3.5], target: [-1.0, 0.1, 0] },
  leadframe: { pos: [0, 4.5, 8.5], target: [0, -0.6, 0] },
  top: { pos: [0, 11.0, 0.1], target: [0, 0, 0] },
};

export const NoycePlanarIC3D = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Semiconductor Microfabrication Parameters
  const { params } = usePatentPhysics("us-2981877-noyce-ic");
  const reverseBias = params.reverseBias ?? params.supplyVoltageV ?? 5.0;
  const oxideThickness = params.oxideThickness ?? 0.5;
  const clockFrequencyMhz = params.clockFrequencyMhz ?? 10;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  const noyce = stepNoyceIC({
    reverseBias,
    oxideThickness,
    clockFrequencyMhz,
  });

  const live = useLiveSimParams({
    reverseBias,
    oxideThickness,
    clockFrequencyMhz,
    clockPeriodNs: noyce.clockPeriodNs,
    signalDisplaySpeed: noyce.signalDisplaySpeed,
    isCutaway,
  });

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const toggleSound = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  useEffect(() => {
    if (isPlayingAudio) {
      soundEngine.playContinuousTone(noyce.toneHz, "square", 0.02);
    } else {
      soundEngine.stopContinuousTone();
    }
    return () => {
      soundEngine.stopContinuousTone();
    };
  }, [isPlayingAudio, noyce.toneHz]);

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

    // Build procedural 3D model
    const { rootGroup, nodes, materials, dispose } = buildNoycePlanarIcModel();
    scene.add(rootGroup);

    // Animation Loop
    let reqId: number;
    let presentationStep = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = 1 / 60;
      const p = live.current;
      const elapsedSeconds = presentationStep / 60;
      presentationStep += 1;

      updateNoycePlanarIcKinematics(
        nodes,
        materials,
        delta,
        elapsedSeconds,
        p.signalDisplaySpeed,
        true,
        p.isCutaway,
      );

      controls.update();
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
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Switch to Solid Silicon" : "Switch to Die Cutaway"}
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
            title={isPlayingAudio ? "Mute Clock Tone" : "Play Clock Tone"}
            className="p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
          >
            {isPlayingAudio ? (
              <Volume2 className="w-4 h-4 text-sky-500" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
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
                ["metallization_layer", "Metal Layer"],
                ["oxide_dielectric", "Oxide Layer"],
                ["pn_junctions", "PN Junctions"],
                ["leadframe", "Leadframe"],
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
          title="Noyce planar monolithic circuit kinetics"
          chips={[
            { label: "Clock Freq", value: `${clockFrequencyMhz}`, unit: "MHz" },
            { label: "Oxide Layer", value: `${noyce.oxideThicknessNm.toFixed(0)}`, unit: "nm" },
            {
              label: "Junction Cap",
              value: `${noyce.junctionCapPfPerMm2.toFixed(2)}`,
              unit: "pF/mm²",
            },
            { label: "Prop Delay", value: `${noyce.propDelayPs.toFixed(0)}`, unit: "ps" },
            { label: "Max Clock", value: `${noyce.maxClockGhz}`, unit: "GHz", tone: "ok" },
            {
              label: "Bus crate",
              value: crateSource === "wasm" ? "fs-la" : "ts-laplace-fallback",
            },
          ]}
        />
      </div>
    </div>
  );
});
