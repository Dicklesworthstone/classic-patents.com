"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import { gatlingBoltCamFlex, gatlingBoltStudioX, stepGatlingGun } from "@/physics/catalogKernels";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildGatlingGunModel } from "./gatlingGunModel";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "barrels" | "breech_cam" | "hopper" | "crank" | "top";

export function GatlingGun3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Ballistic Simulation Parameters
  const { params } = usePatentPhysics("us-36836-gatling-gun");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const crankRpm = params.crankRpm ?? 60;
  const gatling = stepGatlingGun({
    crankRpm,
    barrelCount: params.barrelCount ?? 6,
  });
  const roundsPerMinute = gatling.roundsPerMin;
  const [showMuzzleFlash] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const [crateSource, setCrateSource] = useState(genericKernelSource());

  const live = useLiveSimParams({
    crankRpm,
    roundsPerMinute,
    showMuzzleFlash,
    isAudioMuted,
    isCutaway,
    crankOmegaRadPerS: gatling.crankOmegaRadPerS,
    barrelSpacingRad: gatling.barrelSpacingRad,
    camStrokeStudio: gatling.camStrokeStudio,
    boltHomeX: gatling.boltHomeX,
    boltFlexStudio: gatling.boltFlexStudio,
    fireIntervalS: gatling.fireIntervalS,
    muzzleFlashDecayPerS: gatling.muzzleFlashDecayPerS,
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
        controls.setView([9.0, 5.0, 10.0], [0, 0, 0]);
        break;
      case "barrels":
        controls.setView([4.5, 1.2, 3.8], [2.4, 0.4, 0]);
        break;
      case "breech_cam":
        controls.setView([-2.0, 1.8, 3.2], [-0.8, 0.4, 0]);
        break;
      case "hopper":
        controls.setView([-0.8, 3.8, 2.2], [-0.6, 1.4, 0]);
        break;
      case "crank":
        controls.setView([-3.6, 1.2, 2.8], [-2.4, 0.4, 0.85]);
        break;
      case "top":
        controls.setView([0, 11.0, 0.1], [0, 0, 0]);
        break;
    }
  };

  useEffect(() => {
    void ensureGenericWasm().then((next) => setCrateSource(next));
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const studio = createThreeStudioScene({
      container: containerRef.current,
      cameraPos: [9.0, 5.0, 10.0],
      targetPos: [0, 0, 0],
      fov: 38,
    });
    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Load High-Fidelity Gatling Gun Model
    const model = buildGatlingGunModel();
    scene.add(model.rootGroup);

    // Animation Loop
    let reqId: number;
    let renderedSteps = 0;
    let lastFireTime = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      renderedSteps += 1;
      const delta = 1 / 60;
      const p = live.current;

      // Update cutaway transparency on breech casing
      model.materials.bronzeReceiver.opacity = p.isCutaway ? 0.35 : 1.0;
      model.materials.bronzeReceiver.transparent = p.isCutaway;

      const omegaRadPerSec = p.crankOmegaRadPerS;
      model.barrelClusterGroup.rotation.x += omegaRadPerSec * delta;
      model.crankGroup.rotation.x += omegaRadPerSec * delta;

      // Kinematic Cam Track Bolt Reciprocation
      const currentAngle = model.barrelClusterGroup.rotation.x;
      model.bolts.forEach((bolt, idx) => {
        const barrelAngle = currentAngle + idx * p.barrelSpacingRad;
        const flex = gatlingBoltCamFlex(idx, model.bolts.length, p.crankRpm);
        bolt.position.x =
          gatlingBoltStudioX(barrelAngle, p.boltHomeX, p.camStrokeStudio) + flex * p.boltFlexStudio;
      });

      // Muzzle Flash & Acoustic Pulse at 12 o'clock firing position
      const now = renderedSteps * (1 / 60);
      if (now - lastFireTime > p.fireIntervalS) {
        lastFireTime = now;
        if (p.showMuzzleFlash) {
          model.materials.muzzleFlash.opacity = 0.95;
        }
        if (!p.isAudioMuted && typeof window !== "undefined") {
          soundEngine.playSparks();
        }
      } else {
        model.materials.muzzleFlash.opacity = Math.max(
          0,
          model.materials.muzzleFlash.opacity - delta * p.muzzleFlashDecayPerS,
        );
      }

      renderer.render(scene, camera);
    };

    animate();

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
            Gatling Gun 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 36,836 (1862)
          </span>
        </div>

        {/* Camera Views & Toggles */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              { id: "iso", label: "Overview" },
              { id: "barrels", label: "6 Barrels" },
              { id: "breech_cam", label: "Cam Breech" },
              { id: "hopper", label: "Hopper Feed" },
              { id: "crank", label: "Crank" },
              { id: "top", label: "Top" },
            ] as const
          ).map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => applyCameraPreset(c.id)}
              className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all ${
                activeCamera === c.id
                  ? "bg-amber-600 text-white font-bold shadow-xs"
                  : "text-parchment-300 hover:text-white hover:bg-parchment-800/60"
              }`}
            >
              {c.label}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Solid Receiver" : "Cutaway Breech Casing"}
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
            title={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            <Zap className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      <StudioKernelChips
        visible={showUiOverlay}
        title="Gatling cam-crank cluster"
        chips={[
          { label: "Crank", value: String(Math.round(crankRpm)), unit: "rpm" },
          { label: "Barrels", value: String(params.barrelCount ?? 6) },
          { label: "RoF", value: String(roundsPerMinute), unit: "rds/min" },
          { label: "Cooling", value: String(gatling.barrelCoolingIntervalS), unit: "s/bbl" },
          { label: "E", value: String(gatling.muzzleEnergyJoules), unit: "J" },
          { label: "ω", value: gatling.crankOmegaRadPerS.toFixed(2), unit: "rad/s" },
          {
            label: "Cluster crate",
            value: crateSource === "wasm" ? "fs-symmetry" : "ts-cyclic-fallback",
          },
          { label: "h₁", value: gatling.clusterHarmonicH1.toFixed(3) },
        ]}
      />
    </div>
  );
}
