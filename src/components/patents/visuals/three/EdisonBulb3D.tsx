"use client";

import { Camera, Eye, EyeOff, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { stepEdisonBulb } from "@/physics/catalogKernels";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildEdisonBulbModel, updateEdisonBulbKinematics } from "./edisonBulbModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset =
  | "iso"
  | "filament_horseshoe"
  | "screw_base"
  | "exhaust_tip"
  | "glass_stem"
  | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [11, 7, 14], target: [0, 0, 0] },
  filament_horseshoe: { pos: [0, 2.5, 4.2], target: [0, 1.2, 0] },
  screw_base: { pos: [0, -2.2, 3.8], target: [0, -2.8, 0] },
  exhaust_tip: { pos: [0, 4.8, 2.6], target: [0, 3.8, 0] },
  glass_stem: { pos: [0, 0.5, 3.2], target: [0, -0.6, 0] },
  top: { pos: [0, 10.5, 0.1], target: [0, 0, 0] },
};

export const EdisonBulb3D = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // Electrical & Thermal Simulation State
  const { params } = usePatentPhysics("us-223898-edison-lightbulb");
  const appliedVoltage = params.voltage ?? 110;
  const vacuumTorr = params.vacuumTorr ?? 1e-6;
  const [showGasMolecules] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [crateSource, setCrateSource] = useState(genericKernelSource());
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const bulb = stepEdisonBulb({
    voltage: appliedVoltage,
    filamentLength: params.filamentLength ?? 22,
  });

  const live = useLiveSimParams({
    appliedVoltage,
    filamentTempKelvin: bulb.filamentTempK,
    showGasMolecules,
    vacuumTorr,
    isCutaway,
    isAudioMuted,
    incandescenceIntensity: bulb.incandescenceIntensity,
    thermalJitterPerS: bulb.thermalJitterPerS,
    filamentEmissiveScale: bulb.filamentEmissiveScale,
    bulbLightScale: bulb.bulbLightScale,
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

    const model = buildEdisonBulbModel();
    scene.add(model.rootGroup);

    // Animation Loop
    let reqId: number;
    let timeSec = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const dt = 1 / 60;
      timeSec += dt;
      const p = live.current;

      updateEdisonBulbKinematics(
        model,
        dt,
        timeSec,
        p.incandescenceIntensity,
        p.filamentTempKelvin,
        p.thermalJitterPerS,
        p.filamentEmissiveScale,
        p.bulbLightScale,
        p.vacuumTorr,
        p.showGasMolecules,
        p.isCutaway,
        p.appliedVoltage,
      );

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      model.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Title HUD */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 pointer-events-none rounded-xl border border-parchment-700/60 bg-parchment-950/80 px-3.5 py-2 backdrop-blur-md shadow-lg">
            <div className="font-mono text-xs font-bold text-parchment-100 uppercase tracking-wider">
              Edison Incandescent Bulb 3D
            </div>
            <div className="text-[11px] text-parchment-300 font-sans">
              US Patent 223,898 • High-Resistance Carbonized Filament
            </div>
          </div>
        )}

        {/* Top Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Clear Glass Bulb" : "Cutaway Interior"}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm text-xs font-sans flex items-center gap-1 ${
              isCutaway
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            {isCutaway ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden sm:inline">{isCutaway ? "Cutaway" : "Glass"}</span>
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
                ["filament_horseshoe", "Horseshoe Filament"],
                ["screw_base", "Edison Screw Base"],
                ["exhaust_tip", "Exhaust Seal Tip"],
                ["glass_stem", "Lead-in Stem"],
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
          title="Edison high-resistance incandescent lamp"
          chips={[
            { label: "Voltage", value: `${appliedVoltage}`, unit: "V" },
            { label: "Filament Temp", value: `${bulb.filamentTempK.toFixed(0)}`, unit: "K" },
            { label: "Hot Resistance", value: `${bulb.hotResistanceOhm.toFixed(1)}`, unit: "Ω" },
            { label: "Current", value: `${bulb.currentAmps.toFixed(2)}`, unit: "A" },
            { label: "Radiant Power", value: `${bulb.radiantWatts.toFixed(1)}`, unit: "W" },
            {
              label: "Luminous Efficacy",
              value: `${bulb.luminousLmPerW.toFixed(2)}`,
              unit: "lm/W",
            },
            { label: "Design Life", value: `${bulb.designLifeHours}`, unit: "hrs" },
            { label: "Vacuum Level", value: vacuumTorr.toExponential(1), unit: "Torr" },
            {
              label: "Heat crate",
              value: crateSource === "wasm" ? "fs-sparse" : "ts-heat-fallback",
            },
          ]}
        />
      </div>
    </div>
  );
});
