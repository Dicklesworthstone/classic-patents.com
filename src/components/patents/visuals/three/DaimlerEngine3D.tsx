"use client";

import { Camera, Flame, Layers, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { wrapCycleRad } from "@/physics/catalogKernels";
import { FrankenSimEngine } from "@/physics/engine";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildDaimlerEngineModel, updateDaimlerEngineKinematics } from "./daimlerEngineModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "cylinder" | "crankcase" | "hottube" | "flywheel" | "top";

export function DaimlerEngine3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { params, updateParam } = usePatentPhysics("us-361931-daimler-engine");

  const engineRpm = params.engineRpm ?? 750;
  const hotTubeTempC = params.hotTubeTemp ?? 850;
  const daimler = FrankenSimEngine.stepDaimlerEngine({
    engineRpm,
    hotTubeTempC,
    differentialSlipAngleDeg: params.turnAngle ?? 15,
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isMuted, toggleMute } = usePatentAudio();

  const brakeHorsepower = daimler.brakeHorsepower;

  const live = useLiveSimParams({
    engineRpm,
    hotTubeTempC,
    isPlaying,
    isCutaway,
    bmepBar: daimler.bmepBar,
    brakeHorsepower: daimler.brakeHorsepower,
    outerWheelRpm: daimler.outerWheelRpm,
    innerWheelRpm: daimler.innerWheelRpm,
    runningOmegaRadPerS: daimler.runningOmegaRadPerS,
    isRunning: daimler.isRunning ? 1 : 0,
    hotTubeGlow: daimler.hotTubeGlow,
    cycleWrapRad: daimler.cycleWrapRad,
    crankWrapRad: daimler.crankWrapRad,
  });

  const studioRef = useRef<StudioContext | null>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [6.5, 3.8, 6.5],
      targetPos: [0, 0.4, 0],
      fov: 38,
      environmentStyle: "sky",
      enableClouds: true,
      enableFloorGrid: true,
      floorColor: 0x0f172a,
    });
    studioRef.current = studio;
    const { scene, renderer } = studio;

    // Build procedural 3D model
    const model = buildDaimlerEngineModel();
    scene.add(model.rootGroup);

    // Kinematic state
    let crankAngle = 0;
    let _renderedSteps = 0;
    let lastAudioStroke = -1;

    const renderLoop = () => {
      _renderedSteps += 1;
      const dt = 1 / 60;
      const p = live.current;

      if (p.isPlaying && p.isRunning > 0) {
        const speed = p.runningOmegaRadPerS;
        crankAngle = wrapCycleRad(crankAngle + speed * dt, p.cycleWrapRad);

        const cycleAngle = wrapCycleRad(crankAngle, p.crankWrapRad);

        const { strokeIndex } = updateDaimlerEngineKinematics(
          model,
          cycleAngle,
          crankAngle,
          p.hotTubeTempC,
          p.hotTubeGlow,
          p.isCutaway,
        );

        // Sound trigger on power stroke
        if (strokeIndex === 2 && strokeIndex !== lastAudioStroke) {
          lastAudioStroke = strokeIndex;
          if (!isMuted) {
            soundEngine.playPneumaticPuff();
          }
        } else if (strokeIndex !== 2) {
          lastAudioStroke = strokeIndex;
        }
      }

      studio.controls.update();
      renderer.render(scene, studio.camera);
      animRef.current = requestAnimationFrame(renderLoop);
    };

    animRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      model.dispose();
      studio.dispose();
    };
  }, [isMuted, live]);

  const setCameraView = (view: CameraPreset) => {
    setActiveCamera(view);
    const studio = studioRef.current;
    if (!studio) return;
    if (view === "iso") studio.controls.setView([6.5, 3.8, 6.5], [0, 0.4, 0]);
    if (view === "cylinder") studio.controls.setView([0.1, 1.8, 3.8], [0, 1.1, 0]);
    if (view === "crankcase") studio.controls.setView([2.4, -0.4, 2.8], [0, -0.6, 0]);
    if (view === "hottube") studio.controls.setView([1.8, 2.5, 1.8], [0.65, 2.3, 0]);
    if (view === "flywheel") studio.controls.setView([3.8, 0.8, 3.5], [0, 0, 0]);
    if (view === "top") studio.controls.setView([0, 8.0, 0.1], [0, 0, 0]);
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-amber-900/20 dark:border-ink-800 bg-slate-950 shadow-2xl">
      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        className="w-full h-[520px] sm:h-[620px] cursor-grab active:cursor-grabbing"
      />

      {/* Top Floating Header HUD */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl px-4 py-2.5 shadow-lg pointer-events-auto">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
            <h3 className="font-serif text-sm sm:text-base font-bold text-slate-100">
              Daimler High-Speed Petrol Engine 3D (US 361,931)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-amber-400 block mt-0.5">
            1885 &quot;Grandfather Clock&quot; Engine · Enclosed Crankcase &amp; Hot-Tube Ignition
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Switch to Solid Engine" : "Switch to Cutaway View"}
            className={`p-2 rounded-xl border transition-colors ${
              isCutaway
                ? "bg-amber-600 border-amber-500 text-white shadow-sm"
                : "bg-slate-900/90 border-slate-700/80 text-slate-200 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={toggleMute}
            className="p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-200 hover:text-white transition-colors"
            title={isMuted ? "Unmute sound" : "Mute sound"}
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
            className="px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-200 hover:text-white text-xs font-mono font-bold transition-colors"
          >
            {showUiOverlay ? "Hide HUD" : "Show HUD"}
          </button>
        </div>
      </div>

      {/* Interactive Controls Overlay HUD */}
      {showUiOverlay && (
        <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-end justify-between gap-4 pointer-events-none">
          {/* Main Controls Card */}
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 shadow-xl pointer-events-auto max-w-sm w-full space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Engine Throttle
              </span>
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold shadow-md transition-all ${
                  isPlaying
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
              >
                <Play className={`w-3.5 h-3.5 ${isPlaying ? "animate-spin" : ""}`} />
                <span>{isPlaying ? "Stop Engine" : "Ignite Petrol"}</span>
              </button>
            </div>

            {/* Engine RPM Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span>Crankshaft Speed</span>
                <span className="text-amber-400 font-bold">{engineRpm} RPM</span>
              </div>
              <input
                type="range"
                min="400"
                max="950"
                step="25"
                value={engineRpm}
                onChange={(e) => updateParam("engineRpm", Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span>Platinum hot-tube</span>
                <span className="text-amber-400 font-bold">{hotTubeTempC} °C</span>
              </div>
              <input
                type="range"
                min="650"
                max="950"
                step="10"
                value={hotTubeTempC}
                onChange={(e) => updateParam("hotTubeTemp", Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Live Readout Badges */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-slate-800/80 rounded-lg p-2 border border-slate-700 text-center">
                <span className="text-[10px] font-mono text-slate-400 block">Brake Power</span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {brakeHorsepower} HP
                </span>
              </div>
              <div className="bg-slate-800/80 rounded-lg p-2 border border-slate-700 text-center">
                <span className="text-[10px] font-mono text-slate-400 block">BMEP / tube</span>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {daimler.bmepBar} bar · {hotTubeTempC} °C
                </span>
              </div>
              <div className="bg-slate-800/80 rounded-lg p-2 border border-slate-700 text-center">
                <span className="text-[10px] font-mono text-slate-400 block">Diff wheels</span>
                <span className="text-xs font-mono font-bold text-sky-300">
                  {daimler.innerWheelRpm}/{daimler.outerWheelRpm} rpm
                </span>
              </div>
              <div className="bg-slate-800/80 rounded-lg p-2 border border-slate-700 text-center">
                <span className="text-[10px] font-mono text-slate-400 block">P/m</span>
                <span className="text-xs font-mono font-bold text-slate-200">
                  {daimler.specificPowerHpPerKg} hp/kg
                </span>
              </div>
            </div>
          </div>

          {/* Camera View Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-1.5 shadow-xl pointer-events-auto">
            <Camera className="w-4 h-4 text-slate-400 ml-1.5 mr-0.5" />
            {(
              [
                ["iso", "Isometric"],
                ["cylinder", "Cylinder"],
                ["crankcase", "Crankcase"],
                ["hottube", "Hot Tube"],
                ["flywheel", "Flywheels"],
                ["top", "Top"],
              ] as [CameraPreset, string][]
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => setCameraView(preset)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                  activeCamera === preset
                    ? "bg-amber-600 text-white font-semibold shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
