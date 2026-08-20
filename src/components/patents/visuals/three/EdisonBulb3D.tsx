"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX, Zap } from "lucide-react";
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

    const { scene, camera, renderer } = studio;

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
    <div className="relative w-full h-[620px] bg-parchment-900 rounded-2xl overflow-hidden border border-parchment-700 shadow-2xl flex flex-col">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-parchment-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-parchment-100 uppercase tracking-wider">
            Edison Incandescent Bulb 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 223,898 (1880)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["filament_horseshoe", "Horseshoe Filament"],
              ["screw_base", "Edison Screw Base"],
              ["exhaust_tip", "Exhaust Seal Tip"],
              ["glass_stem", "Lead-in Stem"],
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
            title={isCutaway ? "Clear Glass Bulb" : "Cutaway Interior"}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-sans rounded-lg transition-colors ${
              isCutaway
                ? "bg-amber-600/30 text-amber-200 border border-amber-500/40"
                : "text-parchment-300 hover:text-white hover:bg-parchment-800/60"
            }`}
          >
            {isCutaway ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isCutaway ? "Cutaway" : "Glass"}</span>
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
        title="Edison high-resistance incandescent lamp"
        chips={[
          { label: "Voltage", value: `${appliedVoltage}`, unit: "V" },
          { label: "Filament Temp", value: `${bulb.filamentTempK.toFixed(0)}`, unit: "K" },
          { label: "Hot Resistance", value: `${bulb.hotResistanceOhm.toFixed(1)}`, unit: "Ω" },
          { label: "Current", value: `${bulb.currentAmps.toFixed(2)}`, unit: "A" },
          { label: "Radiant Power", value: `${bulb.radiantWatts.toFixed(1)}`, unit: "W" },
          { label: "Luminous Efficacy", value: `${bulb.luminousLmPerW.toFixed(2)}`, unit: "lm/W" },
          { label: "Design Life", value: `${bulb.designLifeHours}`, unit: "hrs" },
          { label: "Vacuum Level", value: vacuumTorr.toExponential(1), unit: "Torr" },
          {
            label: "Heat crate",
            value: crateSource === "wasm" ? "fs-sparse" : "ts-heat-fallback",
          },
        ]}
      />
    </div>
  );
});
