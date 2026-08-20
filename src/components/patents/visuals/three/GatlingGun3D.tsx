"use client";

import { Camera, Eye, EyeOff, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [9.0, 5.0, 10.0], target: [0, 0, 0] },
  barrels: { pos: [4.5, 1.2, 3.8], target: [2.4, 0.4, 0] },
  breech_cam: { pos: [-2.0, 1.8, 3.2], target: [-0.8, 0.4, 0] },
  hopper: { pos: [-0.8, 3.8, 2.2], target: [-0.6, 1.4, 0] },
  crank: { pos: [-3.6, 1.2, 2.8], target: [-2.4, 0.4, 0.85] },
  top: { pos: [0, 11.0, 0.1], target: [0, 0, 0] },
};

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

  const studioRef = useRef<StudioContext | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  useEffect(() => {
    void ensureGenericWasm().then((next) => setCrateSource(next));
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const iso = CAMERA_PRESETS.iso;
    const studio = createThreeStudioScene({
      container: containerRef.current,
      cameraPos: iso.pos,
      targetPos: iso.target,
      fov: 38,
    });
    studioRef.current = studio;
    const { scene, camera, renderer, controls } = studio;

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
              Gatling Gun 3D
            </div>
            <div className="text-[11px] text-parchment-300 font-sans">
              US Patent 36,836 • Revolving Battery Gun
            </div>
          </div>
        )}

        {/* Top Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Solid Receiver" : "Cutaway Breech Casing"}
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
                { id: "iso", label: "Isometric" },
                { id: "barrels", label: "6 Barrels" },
                { id: "breech_cam", label: "Cam Breech" },
                { id: "hopper", label: "Hopper Feed" },
                { id: "crank", label: "Crank" },
                { id: "top", label: "Plan View" },
              ] as const
            ).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => applyCameraPreset(c.id)}
                className={`px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
                  activeCamera === c.id
                    ? "bg-amber-600 text-white shadow-xs font-semibold"
                    : "text-ink-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
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
    </div>
  );
}
