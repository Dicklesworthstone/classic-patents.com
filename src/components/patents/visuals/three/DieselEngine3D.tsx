"use client";

import {
  Activity,
  Camera,
  Eye,
  EyeOff,
  Flame,
  Layers,
  RotateCcw,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FrankenSimEngine } from "@/physics/engine";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import {
  buildDieselEngineModel,
  type DieselEngineMaterials,
  type DieselEngineNodes,
  updateDieselEngineKinematics,
} from "./dieselEngineModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "cylinder" | "injector" | "crosshead" | "compressor" | "flywheel";

export function DieselEngine3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { params, updateParam, resetParams } = usePatentPhysics("us-542846-diesel-engine");

  const engineRpm = params.engineRpm ?? 150;
  const compressionRatio = params.compRatio ?? params.compressionRatio ?? 18;
  const blastAirPressure = params.blastAirPressure ?? 65;
  const cutoffRatio = params.cutoffRatio ?? 1.6;

  const diesel = FrankenSimEngine.stepDieselEngine({
    compressionRatio,
    blastAirPressureBar: blastAirPressure,
    cutoffRatio,
    engineRpm,
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [cutawayMode, setCutawayMode] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isMuted, toggleMute } = usePatentAudio();

  const peakPressureBar = diesel.pCompBar;
  const peakTempC = diesel.tCompressionC;
  const thermalEfficiencyPct = diesel.brakeEfficiencyPct;
  const isAutoIgnition = diesel.isAutoIgnition;

  const live = useLiveSimParams({
    engineRpm,
    compressionRatio,
    blastAirPressure,
    cutoffRatio,
    isPlaying,
    isAutoIgnition: isAutoIgnition ? 1 : 0,
    peakTempC,
    cutawayMode,
    isMuted,
    crankOmegaRadPerS: diesel.crankOmegaRadPerS,
  });

  const studioRef = useRef<StudioContext | null>(null);
  const animRef = useRef<number | null>(null);
  const nodesRef = useRef<DieselEngineNodes | null>(null);
  const matsRef = useRef<DieselEngineMaterials | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [7.5, 3.2, 7.5],
      targetPos: [0, 0.4, 0],
      fov: 40,
      environmentStyle: "sky",
      enableClouds: true,
      enableFloorGrid: true,
      floorColor: 0x0f172a,
    });
    studioRef.current = studio;
    const { scene, renderer } = studio;

    // Build procedural 3D model
    const { root, nodes, materials } = buildDieselEngineModel();
    nodesRef.current = nodes;
    matsRef.current = materials;
    scene.add(root);

    // --- ANIMATION LOOP & KINEMATIC INTEGRATION ---
    let crankAngle = 0;
    let _renderedSteps = 0;
    let lastSoundAngle = 0;

    const renderLoop = () => {
      _renderedSteps += 1;
      const dt = 1 / 60;
      const p = live.current;

      if (p.isPlaying) {
        const speed = p.crankOmegaRadPerS ?? (p.engineRpm / 60) * Math.PI * 2;
        crankAngle = (crankAngle + speed * dt) % (Math.PI * 4);

        updateDieselEngineKinematics(
          nodes,
          materials,
          crankAngle,
          p.compressionRatio,
          p.isAutoIgnition > 0,
          p.cutawayMode,
          p.engineRpm,
        );

        // Sound cadence on combustion power stroke
        if (!p.isMuted) {
          const cycleRad = (crankAngle * 0.5) % (Math.PI * 2);
          if (cycleRad >= Math.PI && lastSoundAngle < Math.PI) {
            soundEngine.playPneumaticPuff();
          }
          lastSoundAngle = cycleRad;
        }
      }

      studio.controls.update();
      renderer.render(scene, studio.camera);
      animRef.current = requestAnimationFrame(renderLoop);
    };

    animRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      studio.dispose();
    };
  }, [live]);

  const setCameraView = (view: CameraPreset) => {
    setActiveCamera(view);
    const studio = studioRef.current;
    if (!studio) return;
    if (view === "iso") studio.controls.setView([7.5, 3.2, 7.5], [0, 0.4, 0]);
    if (view === "cylinder") studio.controls.setView([0.1, 2.4, 3.4], [0, 2.0, 0]);
    if (view === "injector") studio.controls.setView([0.1, 4.4, 2.2], [0, 3.8, 0]);
    if (view === "crosshead") studio.controls.setView([0.1, -0.4, 3.0], [0, -0.6, 0]);
    if (view === "compressor") studio.controls.setView([-3.6, 0.6, -1.8], [-1.0, -0.2, -0.8]);
    if (view === "flywheel") studio.controls.setView([4.5, -0.8, 3.8], [0, -1.6, 1.6]);
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-amber-900/20 dark:border-ink-800 bg-slate-950 shadow-2xl">
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={containerRef}
        className="w-full h-[520px] sm:h-[640px] cursor-grab active:cursor-grabbing"
      />

      {/* Top Floating Header HUD */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl px-4 py-2.5 shadow-lg pointer-events-auto">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
            <h3 className="font-serif text-sm sm:text-base font-bold text-slate-100">
              Diesel High-Compression Engine 3D (US 542,846)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-amber-400 block mt-0.5">
            Augsburg 1893–1897 Prototype · Adiabatic Compression T₂ = T₁ · r^(γ-1)
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setCutawayMode(!cutawayMode)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-mono font-bold transition-all shadow-md ${
              cutawayMode
                ? "bg-amber-600/90 border-amber-500 text-white"
                : "bg-slate-900/90 border-slate-700 text-slate-200 hover:text-white"
            }`}
            title="Toggle Cutaway Internal Thermo View"
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">
              {cutawayMode ? "Cutaway Active" : "Full Exterior"}
            </span>
          </button>
          <button
            type="button"
            onClick={toggleMute}
            className="p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-200 hover:text-white transition-colors"
            title={isMuted ? "Unmute sound" : "Mute sound"}
            aria-label={isMuted ? "Unmute sound" : "Mute sound"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className="p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-200 hover:text-white transition-colors"
            title={showUiOverlay ? "Hide HUD" : "Show HUD"}
            aria-label={showUiOverlay ? "Hide HUD" : "Show HUD"}
          >
            {showUiOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Interactive Controls Overlay HUD */}
      {showUiOverlay && (
        <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-end justify-between gap-4 pointer-events-none">
          {/* Main Controls Card */}
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 shadow-xl pointer-events-auto max-w-md w-full space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-amber-400" /> Thermodynamics &amp; Injection
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetParams}
                  className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
                  title="Reset to 1895 baseline parameters"
                  aria-label="Reset parameters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold shadow-md transition-all ${
                    isPlaying
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{isPlaying ? "Stop Engine" : "Start Engine"}</span>
                </button>
              </div>
            </div>

            {/* Compression Ratio Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span>Compression Ratio (r)</span>
                <span className="text-amber-400 font-bold">{compressionRatio}:1</span>
              </div>
              <input
                type="range"
                min="12.0"
                max="22.0"
                step="0.5"
                value={compressionRatio}
                onChange={(e) => updateParam("compRatio", Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
                aria-label="Compression Ratio"
              />
            </div>

            {/* Engine RPM Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span>Engine Speed</span>
                <span className="text-amber-400 font-bold">{engineRpm} RPM</span>
              </div>
              <input
                type="range"
                min="60"
                max="300"
                step="10"
                value={engineRpm}
                onChange={(e) => updateParam("engineRpm", Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
                aria-label="Engine Speed (RPM)"
              />
            </div>

            {/* Blast Air Injection Pressure Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span>Blast Air Pressure</span>
                <span className="text-emerald-400 font-bold">{blastAirPressure} bar</span>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                step="2"
                value={blastAirPressure}
                onChange={(e) => updateParam("blastAirPressure", Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
                aria-label="Blast Air Pressure (bar)"
              />
            </div>

            {/* Live Readout Badges */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="bg-slate-800/80 rounded-lg p-2 border border-slate-700 text-center">
                <span className="text-[9px] font-mono text-slate-400 block uppercase">P_peak</span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {peakPressureBar} bar
                </span>
              </div>
              <div className="bg-slate-800/80 rounded-lg p-2 border border-slate-700 text-center">
                <span className="text-[9px] font-mono text-slate-400 block uppercase">T_comp</span>
                <span className="text-xs font-mono font-bold text-amber-400">{peakTempC} °C</span>
              </div>
              <div className="bg-slate-800/80 rounded-lg p-2 border border-slate-700 text-center">
                <span className="text-[9px] font-mono text-slate-400 block uppercase">
                  η_thermal
                </span>
                <span className="text-xs font-mono font-bold text-sky-400">
                  {thermalEfficiencyPct}%
                </span>
              </div>
            </div>
          </div>

          {/* Camera View Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-1.5 shadow-xl pointer-events-auto">
            <Camera className="w-4 h-4 text-slate-400 ml-1.5 mr-0.5" />
            <button
              type="button"
              onClick={() => setCameraView("iso")}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                activeCamera === "iso"
                  ? "bg-amber-600 text-white font-bold"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setCameraView("cylinder")}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                activeCamera === "cylinder"
                  ? "bg-amber-600 text-white font-bold"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              Cylinder &amp; Rings
            </button>
            <button
              type="button"
              onClick={() => setCameraView("injector")}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                activeCamera === "injector"
                  ? "bg-amber-600 text-white font-bold"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              Blast Injector
            </button>
            <button
              type="button"
              onClick={() => setCameraView("crosshead")}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                activeCamera === "crosshead"
                  ? "bg-amber-600 text-white font-bold"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              Crosshead &amp; Rod
            </button>
            <button
              type="button"
              onClick={() => setCameraView("compressor")}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                activeCamera === "compressor"
                  ? "bg-amber-600 text-white font-bold"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              Air Flask &amp; Pump
            </button>
            <button
              type="button"
              onClick={() => setCameraView("flywheel")}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                activeCamera === "flywheel"
                  ? "bg-amber-600 text-white font-bold"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              Flywheel
            </button>
          </div>
        </div>
      )}

      {/* Bottom SI Telemetry Chip Strip */}
      <StudioKernelChips
        visible={true}
        title="DIESEL THERMODYNAMICS"
        chips={[
          { label: "Bore / Stroke", value: "250 × 400", unit: "mm" },
          { label: "P_comp", value: String(peakPressureBar), unit: "bar" },
          { label: "T_comp", value: String(peakTempC), unit: "°C" },
          { label: "P_blast", value: String(blastAirPressure), unit: "bar" },
          { label: "η_brake", value: String(thermalEfficiencyPct), unit: "%" },
          { label: "Ignition", value: isAutoIgnition ? "Spontaneous" : "Sub-critical" },
          { label: "ω", value: diesel.crankOmegaRadPerS.toFixed(2), unit: "rad/s" },
        ]}
      />
    </div>
  );
}
