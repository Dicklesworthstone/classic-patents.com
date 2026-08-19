"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import { FrankenSimEngine } from "@/physics/engine";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildEastmanKodakModel, updateEastmanKodakKinematics } from "./eastmanKodakModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset =
  | "iso"
  | "roll_film"
  | "barrel_shutter"
  | "lens_aperture"
  | "winding_key"
  | "top";

export function EastmanKodak3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // Photographic Optics Parameters
  const { params } = usePatentPhysics("us-388850-eastman-kodak");
  const shutterSpeedSec = (() => {
    const raw = params.shutterSpeed ?? 0.05;
    return raw > 1 ? 1 / raw : raw;
  })();
  const kodak = FrankenSimEngine.stepEastmanKodak({
    shutterSpeedSec,
    apertureFNumber: params.apertureStop ?? 9,
    subjectDistanceM: params.subjectDist ?? 3,
  });
  const shutterFractionSec = kodak.shutterReciprocal;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  const live = useLiveSimParams({
    shutterFractionSec,
    isAudioMuted,
    isCutaway,
    exposureValueEv: kodak.exposureValueEv,
    hyperfocalM: kodak.hyperfocalM,
    barrelOmegaRadPerS: kodak.barrelOmegaRadPerS,
    flashDisplayMs: kodak.flashDisplayMs,
    filmAdvanceSpeedRadPerS: kodak.filmAdvanceSpeedRadPerS,
    supplySpoolOmegaRadPerS: kodak.supplySpoolOmegaRadPerS,
  });

  const controlsRef = useRef<StudioContext["controls"] | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    switch (preset) {
      case "iso":
        camera.position.set(8.5, 6.5, 9.5);
        controls.target.set(0, 0, 0);
        break;
      case "roll_film":
        camera.position.set(0, 2.0, 3.2);
        controls.target.set(0, 0.4, 0);
        break;
      case "barrel_shutter":
        camera.position.set(2.8, 1.2, 3.0);
        controls.target.set(1.4, 0, 0);
        break;
      case "lens_aperture":
        camera.position.set(3.5, 0.5, 2.0);
        controls.target.set(2.2, 0, 0);
        break;
      case "winding_key":
        camera.position.set(-2.5, 3.2, 1.0);
        controls.target.set(-1.6, 2.1, -1.2);
        break;
      case "top":
        camera.position.set(0, 11.0, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
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

    const studio = createThreeStudioScene({
      container,
      cameraPos: [8.5, 6.5, 9.5],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    const { rootGroup, nodes, materials, dispose } = buildEastmanKodakModel();
    scene.add(rootGroup);

    // Animation Loop
    let reqId: number;
    let timeSec = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const dt = 1 / 60;
      timeSec += dt;
      const p = live.current;

      updateEastmanKodakKinematics(
        nodes,
        materials,
        dt,
        timeSec,
        p.barrelOmegaRadPerS ?? 0,
        p.isCutaway,
        p.filmAdvanceSpeedRadPerS,
        p.supplySpoolOmegaRadPerS,
      );

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      dispose();
      studio.cleanup();
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
            Eastman Kodak Camera 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 388,850 (1888)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["roll_film", "Roll Film"],
              ["barrel_shutter", "Shutter"],
              ["lens_aperture", "Lens"],
              ["winding_key", "Winding Key"],
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
            title={isCutaway ? "Solid Camera Body" : "Cutaway Interior"}
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
        title="Eastman roll-film camera"
        chips={[
          { label: "Shutter", value: `1/${shutterFractionSec}`, unit: "s" },
          { label: "Aperture", value: "f/9", unit: "" },
          { label: "Capacity", value: String(kodak.rollCapacity), unit: "exp" },
          { label: "Format", value: `${kodak.filmFormatInches}"`, unit: "dia" },
          { label: "EV", value: String(kodak.exposureValueEv), unit: "" },
          { label: "Hyperfocal", value: `${kodak.hyperfocalM}m`, unit: "" },
          { label: "DoF Near", value: `${kodak.dofNearM}m`, unit: "" },
          { label: "Focus", value: kodak.isInFocus ? "sharp" : "soft" },
          {
            label: "Spool crate",
            value: crateSource === "wasm" ? "fs-symmetry" : "ts-cyclic-fallback",
          },
        ]}
      />
    </div>
  );
}
