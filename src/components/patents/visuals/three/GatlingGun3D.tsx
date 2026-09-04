"use client";

import { Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { gatlingBoltStudioX, stepGatlingGun } from "@/physics/catalogKernels";
import { createStudioClock } from "@/physics/tickScheduler";
import type { MachineState } from "@/physics/types";
import {
  globalTransportBus,
  type TapeUpdater,
  useFrankenSimPhysics,
} from "@/physics/useFrankenSimPhysics";
import { useGenericWasmSource } from "@/physics/useGenericWasmSource";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { type GatlingGunCameraPreset, gatlingGunCameraForViewport } from "./gatlingGunCamera";
import { buildGatlingGunModel } from "./gatlingGunModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { StudioOverlayActionToolbar } from "./StudioOverlayActionToolbar";
import { createStandardStudioOverlayActions } from "./studioOverlayActions";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = GatlingGunCameraPreset;

const IDLE_MACHINE: MachineState = {
  poseXMeters: 0,
  poseYMeters: 0,
  headingRad: 0,
  modeLabel: "crank-battery",
  wheelSpeedMps: 0,
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
  const crateSource = useGenericWasmSource();

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
    claim1Active: claimStates[1] === false ? 0 : 1,
  });

  // Shared transport tape: the US 36,836 crank pose publishes to the
  // patentId-keyed bus so every face reads one deterministic state.
  useFrankenSimPhysics("us-36836-gatling-gun", {
    domain: "solid_mechanics",
    refusal: { isRefused: false },
    machine: { ...IDLE_MACHINE },
  });

  // One tape-bound integrator (br-ixl): the bus updater owns the crank
  // rotation phase so the render loop is a pure consumer of the tape.
  // Refusal freezes the illegal step at the last legal angle.
  const crankAngleRef = useRef(0);
  const lastLegalAngleRef = useRef(0);
  useEffect(() => {
    const integrate: TapeUpdater = (_prev, dt) => {
      const refused = (live.current.claim1Active ?? 1) < 0.5;
      if (!refused) {
        crankAngleRef.current += (live.current.crankOmegaRadPerS ?? 0) * dt;
        lastLegalAngleRef.current = crankAngleRef.current;
      } else {
        crankAngleRef.current = lastLegalAngleRef.current;
      }
      return {
        refusal: {
          isRefused: refused,
          reason: refused ? "Claim 1 feed closed: crank held at last legal angle" : undefined,
        },
        machine: {
          ...IDLE_MACHINE,
          headingRad: crankAngleRef.current,
        },
      };
    };
    const unregister = globalTransportBus.registerUpdater(
      "us-36836-gatling-gun",
      integrate,
      "TS_FALLBACK",
    );
    return unregister;
  }, [live]);

  const studioRef = useRef<StudioContext | null>(null);

  const cameraViewForContainer = (preset: CameraPreset) => {
    const container = containerRef.current;
    return gatlingGunCameraForViewport(
      preset,
      container?.clientWidth ?? 0,
      container?.clientHeight ?? 0,
    );
  };

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = cameraViewForContainer(preset);
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const iso = gatlingGunCameraForViewport("iso", container.clientWidth, container.clientHeight);
    const studio = createThreeStudioScene({
      container,
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
    const transport = globalTransportBus.getTransport("us-36836-gatling-gun");

    const animate = (nowMs: number) => {
      reqId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const { dt: delta, simTimeSec } = clock.pump(nowMs);
      const p = live.current;

      // Pure consumer of the shared transport tape: the crank angle arrives
      // on bus frames from the registered updater; this studio clock only
      // paces mesh interpolation and flash decay.
      const tape = transport.lastFrame.telemetry;
      const refused = tape.refusal.isRefused;
      const clusterAngle = tape.machine?.headingRad ?? model.nodes.barrelClusterGroup.rotation.x;
      model.nodes.barrelClusterGroup.rotation.x = clusterAngle;
      model.nodes.crankGroup.rotation.x = clusterAngle;
      model.nodes.bolts.forEach((bolt, i) => {
        const boltAngle = clusterAngle + i * p.barrelSpacingRad;
        bolt.position.x = gatlingBoltStudioX(boltAngle, p.boltHomeX, p.camStrokeStudio);
      });

      // Muzzle Flash & Sound Triggering on live fire interval
      if (!refused && simTimeSec - lastFireTime > p.fireIntervalS) {
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
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-col gap-2 max-w-[calc(100%-9.5rem)] sm:max-w-[calc(100%-28rem)] pointer-events-auto">
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
                  className={`min-h-9 px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
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
        <StudioOverlayActionToolbar
          actions={createStandardStudioOverlayActions({
            isCutaway,
            onToggleCutaway: () => setIsCutaway(!isCutaway),
            cutawayTitle: isCutaway ? "Solid Housing" : "Cutaway Breech",
            isAudioMuted,
            onToggleSound: toggleSound,
            showUiOverlay,
            onToggleUiOverlay: () => setShowUiOverlay(!showUiOverlay),
            overlayTitle: showUiOverlay ? "Hide Overlay UI (Clean 3D View)" : "Show Overlay UI",
            onResetCamera: () => applyCameraPreset("iso"),
          })}
        />

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
              aria-label="Revolving barrel count"
              min="4"
              max="10"
              step="2"
              value={barrelCount}
              onChange={(e) => updateParam("barrelCount", Number.parseInt(e.target.value, 10))}
              className="w-full h-11 appearance-none bg-transparent cursor-pointer touch-none [&::-webkit-slider-runnable-track]:h-2.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-parchment-300 dark:[&::-webkit-slider-runnable-track]:bg-ink-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-ink-950 [&::-moz-range-track]:h-2.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-parchment-300 dark:[&::-moz-range-track]:bg-ink-700 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-purple-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white dark:[&::-moz-range-thumb]:border-ink-950"
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
