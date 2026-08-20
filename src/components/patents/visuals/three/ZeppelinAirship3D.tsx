"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepZeppelinAirship } from "@/physics/catalogKernels";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";
import { buildZeppelinAirshipModel, updateZeppelinAirshipKinematics } from "./zeppelinAirshipModel";

type CameraPreset =
  | "iso"
  | "girders_frame"
  | "engine_gondola"
  | "gas_cells"
  | "control_fins"
  | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [16.0, 9.0, 18.0], target: [0, 0, 0] },
  girders_frame: { pos: [0, 2.0, 6.5], target: [0, 0, 0] },
  engine_gondola: { pos: [-4.5, -2.5, 4.0], target: [-3.5, -2.2, 0] },
  gas_cells: { pos: [3.5, 2.5, 5.0], target: [2.0, 0, 0] },
  control_fins: { pos: [-8.5, 1.5, 3.5], target: [-6.5, 0, 0] },
  top: { pos: [0, 22.0, 0.1], target: [0, 0, 0] },
};

export function ZeppelinAirship3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // Aerostatic & Aerodynamic Parameters
  const { params } = usePatentPhysics("us-621195-zeppelin-airship");
  const flightSpeedKnots = params.flightSpeedKnots ?? params.airspeedMph ?? 28;
  const trimWeightPosM = params.trimWeight ?? 5;
  const zep = stepZeppelinAirship({
    gasInflation: params.gasInflation ?? 95,
    flightAlt: params.flightAlt ?? 300,
    flightSpeedKnots: Number(flightSpeedKnots),
    trimWeight: trimWeightPosM,
  });
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  const live = useLiveSimParams({
    airspeedKmh: zep.flightSpeedKmh,
    engineRpm: zep.propellerRpm,
    isCutaway,
    isAudioMuted,
    trimWeightPosM,
    gasInflation: params.gasInflation ?? 95,
    flightSpeedKnots: Number(flightSpeedKnots),
    netLiftKn: zep.netLiftKn,
    hullStudioY: zep.hullStudioY,
    pitchTrimDeg: zep.pitchTrimDeg,
    parasiteDragKn: zep.parasiteDragKn,
    propellerOmegaRadPerS: zep.propellerDisplayOmegaRadPerS,
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

    const { rootGroup, nodes, materials, dispose } = buildZeppelinAirshipModel();
    scene.add(rootGroup);

    // Animation Loop
    let reqId: number;
    let timeSec = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const dt = 1 / 60;
      timeSec += dt;
      const p = live.current;

      updateZeppelinAirshipKinematics(
        nodes,
        materials,
        dt,
        timeSec,
        p.hullStudioY,
        p.pitchTrimDeg,
        p.propellerOmegaRadPerS,
        p.trimWeightPosM,
        p.isCutaway,
        p.gasInflation,
        p.flightSpeedKnots,
      );

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
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-parchment-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-parchment-100 uppercase tracking-wider">
            Zeppelin LZ-1 Airship 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 621,195 (1899)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["girders_frame", "Lattice Girders"],
              ["engine_gondola", "Gondolas"],
              ["gas_cells", "Gas Cells"],
              ["control_fins", "Tail Fins"],
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
            title={isCutaway ? "Solid Envelope" : "Cutaway Hydrogen Cells"}
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
        title="Zeppelin rigid aerostat"
        chips={[
          { label: "Gross", value: String(zep.grossBuoyancyKn), unit: "kN" },
          { label: "Net", value: String(zep.netLiftKn), unit: "kN" },
          { label: "Speed", value: zep.flightSpeedKmh.toFixed(1), unit: "km/h" },
          { label: "RPM", value: String(zep.propellerRpm), unit: "rpm" },
          { label: "Pitch", value: String(zep.pitchTrimDeg), unit: "°" },
          { label: "Drag", value: String(zep.parasiteDragKn), unit: "kN" },
          { label: "Volume", value: String(Math.round(zep.hydrogenVolumeM3)), unit: "m³" },
          {
            label: "Lift crate",
            value: crateSource === "wasm" ? "fs-sparse" : "ts-heat-fallback",
          },
        ]}
      />
    </div>
  );
}
