"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { stepBellPhotophone } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { createBellPhotophoneModel } from "./bellPhotophoneModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

type CameraPreset = "overview" | "transmitter" | "receiver" | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  overview: { pos: [0, 4.0, 12.0], target: [0, 1.0, 0] },
  transmitter: { pos: [-3.5, 2.5, 4.0], target: [-5.0, 1.2, 0] },
  receiver: { pos: [3.5, 2.5, 4.0], target: [5.0, 1.2, 0] },
  top: { pos: [0, 14.0, 0.1], target: [0, 1.0, 0] },
};

interface BellPhotophone3DProps {
  initialVoiceSplDb?: number;
  initialDistanceM?: number;
  initialSolarWPerM2?: number;
}

export function BellPhotophone3D({
  initialVoiceSplDb = 75,
  initialDistanceM = 213,
  initialSolarWPerM2 = 950,
}: BellPhotophone3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const voiceId = useId();
  const distId = useId();
  const solarId = useId();

  const { params, updateParam } = usePatentPhysics("us-235199-bell-photophone");
  const voiceSplDb = params.voiceSplDb ?? initialVoiceSplDb;
  const transmissionDistanceM = params.transmissionDistanceM ?? initialDistanceM;
  const solarIrradianceWPerM2 = params.solarIrradianceWPerM2 ?? initialSolarWPerM2;
  const [isAudioActive, setIsAudioActive] = useState<boolean>(true);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("overview");

  const handlePresetChange = (preset: CameraPreset) => {
    setCameraPreset(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const photoState = useMemo(() => {
    return stepBellPhotophone({
      voiceSplDb: isAudioActive ? voiceSplDb : 40,
      transmissionDistanceM,
      solarIrradianceWPerM2,
    });
  }, [voiceSplDb, transmissionDistanceM, solarIrradianceWPerM2, isAudioActive]);

  const live = useLiveSimParams({ photoState });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const overview = CAMERA_PRESETS.overview;
    const studio = createThreeStudioScene({
      container,
      cameraPos: overview.pos,
      targetPos: overview.target,
      environmentStyle: "studio",
    });
    studioRef.current = studio;

    const model = createBellPhotophoneModel();
    studio.scene.add(model.group);

    let rafId = 0;
    let elapsedTimeSec = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      elapsedTimeSec += 0.016;
      model.update(live.current.photoState, elapsedTimeSec);
      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      model.dispose();
      studio.dispose();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 text-neutral-100 shadow-2xl backdrop-blur-md">
      {/* Viewport Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-amber-400">
            Alexander Graham Bell 3D Photophone Studio
          </h3>
          <p className="text-sm text-neutral-400">
            Interactive WebGL Free-Space Optical Transmission • Sunbeam Modulation & Parabolic
            Selenium Receiver
          </p>
        </div>

        {/* Controls and Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs">
            <button
              type="button"
              onClick={() => handlePresetChange("overview")}
              className={`px-2.5 py-1 rounded font-mono ${
                cameraPreset === "overview"
                  ? "bg-amber-500/30 text-amber-300 font-bold"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => handlePresetChange("transmitter")}
              className={`px-2.5 py-1 rounded font-mono ${
                cameraPreset === "transmitter"
                  ? "bg-amber-500/30 text-amber-300 font-bold"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Transmitter
            </button>
            <button
              type="button"
              onClick={() => handlePresetChange("receiver")}
              className={`px-2.5 py-1 rounded font-mono ${
                cameraPreset === "receiver"
                  ? "bg-amber-500/30 text-amber-300 font-bold"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Receiver Dish
            </button>
            <button
              type="button"
              onClick={() => handlePresetChange("top")}
              className={`px-2.5 py-1 rounded font-mono ${
                cameraPreset === "top"
                  ? "bg-amber-500/30 text-amber-300 font-bold"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Top View
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsAudioActive(!isAudioActive)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border ${
              isAudioActive
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30"
                : "bg-neutral-800 text-neutral-400 border-neutral-700"
            }`}
          >
            {isAudioActive ? "Voice ON" : "Voice OFF"}
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div className="relative w-full aspect-[16/9] min-h-[420px] bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800 shadow-inner">
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Live HUD Overlay */}
        <div className="absolute top-4 left-4 pointer-events-none flex flex-col gap-2 font-mono text-xs">
          <div className="bg-neutral-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-800 shadow">
            <span className="text-neutral-400">Beam Modulation: </span>
            <span className="text-amber-400 font-bold">
              {(photoState.modulationDepth * 100).toFixed(1)}%
            </span>
          </div>
          <div className="bg-neutral-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-800 shadow">
            <span className="text-neutral-400">Selenium R: </span>
            <span className="text-emerald-400 font-bold">
              {photoState.seleniumOperatingResistanceKOhms.toFixed(1)} kΩ
            </span>
          </div>
          <div className="bg-neutral-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-800 shadow">
            <span className="text-neutral-400">Audio Signal: </span>
            <span className="text-cyan-400 font-bold">
              {photoState.audioSignalCurrentUa.toFixed(2)} µA
            </span>
          </div>
        </div>
      </div>

      {/* Real-Time Controllers & Physical Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-950/60 p-5 rounded-xl border border-neutral-800">
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Real-Time Optical Link Controllers
          </h4>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-mono">
              <label htmlFor={voiceId} className="text-neutral-300">
                Vocal Sound Pressure Level
              </label>
              <span className="text-amber-400 font-bold">{voiceSplDb} dB SPL</span>
            </div>
            <input
              id={voiceId}
              type="range"
              min="50"
              max="95"
              step="1"
              value={voiceSplDb}
              onChange={(e) => updateParam("voiceSplDb", parseInt(e.target.value, 10))}
              className="w-full accent-amber-500 bg-neutral-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-mono">
              <label htmlFor={distId} className="text-neutral-300">
                Transmission Distance
              </label>
              <span className="text-cyan-400 font-bold">{transmissionDistanceM} m</span>
            </div>
            <input
              id={distId}
              type="range"
              min="10"
              max="500"
              step="5"
              value={transmissionDistanceM}
              onChange={(e) => updateParam("transmissionDistanceM", parseInt(e.target.value, 10))}
              className="w-full accent-cyan-500 bg-neutral-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-mono">
              <label htmlFor={solarId} className="text-neutral-300">
                Solar Radiant Irradiance
              </label>
              <span className="text-yellow-400 font-bold">{solarIrradianceWPerM2} W/m²</span>
            </div>
            <input
              id={solarId}
              type="range"
              min="200"
              max="1200"
              step="50"
              value={solarIrradianceWPerM2}
              onChange={(e) => updateParam("solarIrradianceWPerM2", parseInt(e.target.value, 10))}
              className="w-full accent-yellow-500 bg-neutral-800 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 justify-center font-mono text-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Physical Optics & Link Telemetry
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800">
              <span className="text-neutral-500 text-[10px] block">CONCENTRATED POWER</span>
              <span className="text-amber-400">{photoState.concentratedPowerMw.toFixed(2)} mW</span>
            </div>
            <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800">
              <span className="text-neutral-500 text-[10px] block">BEAM DIVERGENCE</span>
              <span className="text-neutral-200">
                {photoState.beamDivergenceMrad.toFixed(1)} mrad
              </span>
            </div>
            <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800">
              <span className="text-neutral-500 text-[10px] block">REPRODUCED SPL</span>
              <span className="text-indigo-400">
                {photoState.reproducedAudioSplDb.toFixed(1)} dB SPL
              </span>
            </div>
            <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800">
              <span className="text-neutral-500 text-[10px] block">LINK SNR</span>
              <span className="text-emerald-400">{photoState.linkSnrDb.toFixed(1)} dB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BellPhotophone3D;
