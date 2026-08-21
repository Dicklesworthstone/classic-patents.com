"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { gatlingBoltStudioX, stepGatlingGun } from "@/physics/catalogKernels";
import { ensureGenericWasm, genericKernelSource } from "@/physics/genericWasm";
import { createStudioClock } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { buildGatlingGunModel } from "./gatlingGunModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
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
  const { params, updateParam } = usePatentPhysics("us-36836-gatling-gun");
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const crankRpm = params.crankRpm ?? 60;
  const barrelCount = params.barrelCount ?? 6;
  const gatling = stepGatlingGun({
    crankRpm,
    barrelCount,
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
    let lastFireTime = 0;
    const clock = createStudioClock();

    const animate = (nowMs: number) => {
      reqId = requestAnimationFrame(animate);
      const { dt: delta, simTimeSec } = clock.pump(nowMs);
      const p = live.current;

      // Rotate Barrel Cluster & Drive Crank via shared SI speed
      const omega = p.crankOmegaRadPerS;
      model.nodes.barrelClusterGroup.rotation.x += omega * delta;
      model.nodes.crankGroup.rotation.x += omega * delta;

      // Reciprocate Bolts along Spiral Cam Track
      const clusterAngle = model.nodes.barrelClusterGroup.rotation.x;
      model.nodes.bolts.forEach((bolt, i) => {
        const boltAngle = clusterAngle + i * p.barrelSpacingRad;
        bolt.position.x = gatlingBoltStudioX(boltAngle, p.boltHomeX, p.camStrokeStudio);
      });

      // Muzzle Flash & Sound Triggering on live fire interval
      if (simTimeSec - lastFireTime > p.fireIntervalS) {
        lastFireTime = simTimeSec;
        if (p.showMuzzleFlash) {
          model.materials.muzzleFlash.opacity = 1.0;
          model.muzzleFlashPoints.visible = true;
        }
        if (!p.isAudioMuted) {
          soundEngine.playGunshot();
        }
      }

      // Decay Muzzle Flash
      if (model.materials.muzzleFlash.opacity > 0) {
        model.materials.muzzleFlash.opacity = Math.max(
          0,
          model.materials.muzzleFlash.opacity - p.muzzleFlashDecayPerS * delta,
        );
        if (model.materials.muzzleFlash.opacity <= 0.01) {
          model.muzzleFlashPoints.visible = false;
        }
      }

      // Cutaway Visibility
      model.nodes.breechCover.visible = !p.isCutaway;

      controls.update();
      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      model.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Richard Gatling Gun 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar & Claim Inversion Toggle */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-col gap-2 max-w-[calc(100%-14rem)] sm:max-w-none pointer-events-auto">
            <ClaimConstraintToggle
              patentId="us-36836-gatling-gun"
              claimStates={claimStates}
              onToggleClaim={(num, active) =>
                setClaimStates((prev) => ({ ...prev, [num]: active }))
              }
            />
            <div className="flex flex-nowrap overflow-x-auto scrollbar-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
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
          </div>
        )}

        {/* Top Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Solid Housing" : "Cutaway Breech"}
            className={`p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm text-xs font-sans flex items-center gap-1 ${
              isCutaway
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">{isCutaway ? "Cutaway" : "Solid"}</span>
          </button>

          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            aria-label={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
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
            title={showUiOverlay ? "Hide Overlay UI (Clean 3D View)" : "Show Overlay UI"}
            aria-label={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
          >
            {showUiOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                Rate of Fire:
              </span>
              <span className="font-bold text-rose-700 dark:text-rose-400">
                {roundsPerMinute} rds/min
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Crank Speed:</span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {Math.round(crankRpm)} RPM
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Cooling Interval:</span>
              <span className="font-bold text-cyan-800 dark:text-cyan-400">
                {gatling.barrelCoolingIntervalS.toFixed(2)} s/bbl
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Muzzle Energy:</span>
              <span className="font-bold text-purple-800 dark:text-purple-400">
                {gatling.muzzleEnergyJoules} J
              </span>
            </div>
          </div>
        )}

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="Gatling cam-crank cluster"
          chips={[
            { label: "Crank", value: String(Math.round(crankRpm)), unit: "rpm" },
            { label: "Barrels", value: String(barrelCount) },
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

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <SensitivitySlider
            id="crankRpm"
            patentId="us-36836-gatling-gun"
            paramKey="crankRpm"
            label="Hand Crank Speed"
            value={crankRpm}
            min={20}
            max={120}
            step={5}
            onChange={(val) => updateParam("crankRpm", val)}
            allParams={params}
          />

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">
                Revolving Barrel Count
              </span>
              <span className="text-purple-700 dark:text-purple-400 font-mono font-bold">
                {barrelCount} barrels
              </span>
            </div>
            <input
              type="range"
              min="4"
              max="10"
              step="2"
              value={barrelCount}
              onChange={(e) => updateParam("barrelCount", Number.parseInt(e.target.value, 10))}
              className="w-full accent-purple-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>

        <ClaimConstraintToggle
          patentId="us-36836-gatling-gun"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-36836-gatling-gun"
          params={params}
          className="mt-3"
        />
      </div>
    </div>
  );
}
