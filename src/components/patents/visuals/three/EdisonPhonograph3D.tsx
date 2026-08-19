"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import { stepEdisonPhonograph } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import {
  buildEdisonPhonographModel,
  type EdisonPhonographModel,
  updateEdisonPhonographKinematics,
} from "./edisonPhonographModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset =
  | "iso"
  | "stylus_groove"
  | "tinfoil_cylinder"
  | "speaking_tube"
  | "illustrative_drive"
  | "top";

export function EdisonPhonograph3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // Acoustic Phonograph Parameters
  const { params } = usePatentPhysics("us-200521-edison-phonograph");
  const cylinderRpm = params.mandrelRpm ?? params.cylinderRpm ?? 60;
  const phono = stepEdisonPhonograph({
    mandrelRpm: cylinderRpm,
    voiceVolumeDb: params.voiceVolumeDb ?? 75,
  });
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    cylinderRpm,
    isAudioMuted,
    isCutaway,
    axialTravelMmPerS: phono.axialTravelMmPerS,
    mandrelOmegaRadPerS: phono.mandrelOmegaRadPerS,
    stylusAmp: phono.stylusAmp,
    stylusOmegaRadPerS: phono.stylusOmegaRadPerS,
  });

  const controlsRef = useRef<StudioContext["controls"] | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelRef = useRef<EdisonPhonographModel | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    switch (preset) {
      case "iso":
        camera.position.set(9.5, 7.0, 11.0);
        controls.target.set(0, 0, 0);
        break;
      case "stylus_groove":
        camera.position.set(0, 2.2, 3.2);
        controls.target.set(0, 1.2, 0.8);
        break;
      case "tinfoil_cylinder":
        camera.position.set(-1.8, 1.8, 3.8);
        controls.target.set(-0.4, 0.8, 0);
        break;
      case "speaking_tube":
        camera.position.set(2.8, 3.0, 4.0);
        controls.target.set(0, 1.8, 1.8);
        break;
      case "illustrative_drive":
        camera.position.set(-4.5, 2.0, 3.5);
        controls.target.set(-3.5, 0.5, 0);
        break;
      case "top":
        camera.position.set(0, 12.0, 0.1);
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
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [9.5, 7.0, 11.0],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    const model = buildEdisonPhonographModel();
    modelRef.current = model;
    scene.add(model.rootGroup);

    // Animation Loop
    let reqId: number;
    let timeSec = 0;
    let lastFrameMs: number | undefined;

    const animate = (frameMs: number) => {
      reqId = requestAnimationFrame(animate);
      const dt = Math.min(0.1, Math.max(0, (frameMs - (lastFrameMs ?? frameMs)) / 1000));
      lastFrameMs = frameMs;
      timeSec += dt;
      const p = live.current;

      updateEdisonPhonographKinematics(
        model,
        dt,
        timeSec,
        p.mandrelOmegaRadPerS,
        p.stylusAmp,
        p.stylusOmegaRadPerS,
        p.isCutaway,
      );

      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      model.dispose();
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
            Edison Phonograph 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 200,521 (1878)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["stylus_groove", "Stylus & Diaphragm"],
              ["tinfoil_cylinder", "Tinfoil Cylinder"],
              ["speaking_tube", "Speaking Tube"],
              ["illustrative_drive", "Illustrative Drive"],
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
            title={isCutaway ? "Solid Materials" : "Cutaway Cylinder"}
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
        title="Edison cylinder acoustics"
        chips={[
          {
            label: "Source groove pitch",
            value: String(phono.sourceGroovesPerInch),
            unit: "grooves/in",
          },
          {
            label: "Source thread pitch",
            value: String(phono.sourceThreadsPerInch),
            unit: "threads/in",
          },
          { label: "Illustrative turn setting", value: String(cylinderRpm), unit: "rpm" },
          {
            label: "Illustrative axial animation",
            value: phono.axialTravelMmPerS.toFixed(2),
            unit: "mm/s",
          },
          { label: "Model ω", value: phono.mandrelOmegaRadPerS.toFixed(1), unit: "rad/s" },
        ]}
      />
      <p className="pointer-events-none absolute bottom-3 left-4 right-4 rounded-lg bg-parchment-950/85 px-3 py-2 text-xs leading-relaxed text-parchment-200">
        US 200,521 specifies a cylinder, metallic foil or another yielding material, a
        ten-groove-per-inch helix, a matching ten-thread-per-inch shaft, diaphragms, and clock-work
        M or another power source. This studio's geometry, materials, drive form, rate, indentation
        motion, and sound are model-only reader aids, not measurements printed in the patent or
        additional patent claims.
      </p>
    </div>
  );
}
