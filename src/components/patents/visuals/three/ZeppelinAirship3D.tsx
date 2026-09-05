"use client";

import { Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { stepZeppelinAirship } from "@/physics/catalogKernels";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import { createStudioClock } from "@/physics/tickScheduler";
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
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { StudioOverlayActionToolbar } from "./StudioOverlayActionToolbar";
import { createStandardStudioOverlayActions } from "./studioOverlayActions";
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
  iso: { pos: [13.5, 7.6, 15.2], target: [0, 0, 0] },
  girders_frame: { pos: [0, 2.0, 6.5], target: [0, 0, 0] },
  engine_gondola: { pos: [-4.5, -2.5, 4.0], target: [-3.5, -2.2, 0] },
  gas_cells: { pos: [3.5, 2.5, 5.0], target: [2.0, 0, 0] },
  control_fins: { pos: [-8.5, 1.5, 3.5], target: [-6.5, 0, 0] },
  top: { pos: [0, 22.0, 0.1], target: [0, 0, 0] },
};

/** Fields the render loop consumes from each airship kernel step. */
interface ZeppelinPose {
  hullStudioY: number;
  pitchTrimDeg: number;
  propellerDisplayOmegaRadPerS: number;
}

export function ZeppelinAirship3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  // Aerostatic & Aerodynamic Parameters
  const { params, updateParam } = usePatentPhysics("us-621195-zeppelin-airship");
  const gasInflation = (params.gasInflation as number) ?? 95;
  const flightSpeedKnots =
    (params.flightSpeedKnots as number) ?? (params.airspeedMph as number) ?? 28;
  const trimWeightPosM = (params.trimWeight as number) ?? 5;
  const flightAlt = (params.flightAlt as number) ?? 300;

  const zep = stepZeppelinAirship({
    gasInflation,
    flightAlt,
    flightSpeedKnots: Number(flightSpeedKnots),
    trimWeight: trimWeightPosM,
  });
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const crateSource = useGenericWasmSource();

  const live = useLiveSimParams({
    airspeedKmh: zep.flightSpeedKmh,
    engineRpm: zep.propellerRpm,
    isCutaway,
    isAudioMuted,
    trimWeightPosM,
    gasInflation,
    flightAlt,
    flightSpeedKnots: Number(flightSpeedKnots),
    hullStudioY: zep.hullStudioY,
    pitchTrimDeg: zep.pitchTrimDeg,
    propellerOmegaRadPerS: zep.propellerDisplayOmegaRadPerS,
  });

  // Shared transport tape: aerostatic state publishes to the patentId-keyed bus.
  useFrankenSimPhysics("us-621195-zeppelin-airship", {
    domain: "aerodynamics_mbd",
    refusal: { isRefused: false },
  });
  const zeppelinPoseRef = useRef<ZeppelinPose | null>(null);

  useEffect(() => {
    const integrate: TapeUpdater = (_prev) => {
      const p = live.current;
      const out = stepZeppelinAirship({
        gasInflation: p.gasInflation,
        flightAlt: p.flightAlt,
        flightSpeedKnots: p.flightSpeedKnots,
        trimWeight: p.trimWeightPosM,
      });
      zeppelinPoseRef.current = out;
      return {
        aero: {
          airspeedMps: (out.flightSpeedKmh / 3.6) * 1,
          altitudeMeters: p.flightAlt,
          angleOfAttackRad: (out.pitchTrimDeg * Math.PI) / 180,
          sideslipRad: 0,
          pitchRateRps: 0,
          rollRateRps: 0,
          yawRateRps: 0,
          liftNewtons: out.netLiftKn * 1000,
          inducedDragNewtons: 0,
          parasiticDragNewtons: out.parasiteDragKn * 1000,
          thrustNewtons: out.parasiteDragKn * 1000,
          elevatorDeflectionDeg: 0,
          rudderDeflectionDeg: 0,
          wingWarpDeflectionDeg: 0,
        },
        machine: {
          poseXMeters: 0,
          // Hull buoyancy station on the tape.
          poseYMeters: out.hullStudioY,
          headingRad: (out.pitchTrimDeg * Math.PI) / 180,
          modeLabel: "rigid airship cruise",
          wheelSpeedMps: 0,
        },
      };
    };
    const unregister = globalTransportBus.registerUpdater(
      "us-621195-zeppelin-airship",
      integrate,
      "TS_FALLBACK",
    );
    return unregister;
  }, [live]);

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
    const container = containerRef.current;
    if (!container) return;

    const iso = CAMERA_PRESETS.iso;
    const studio = createThreeStudioScene({
      container,
      cameraPos: iso.pos,
      targetPos: iso.target,
    });
    studioRef.current = studio;

    const { scene, camera, renderer, controls } = studio;

    // Build procedural 3D model
    const { rootGroup, nodes, materials, dispose } = buildZeppelinAirshipModel();
    scene.add(rootGroup);

    // Animation Loop
    let reqId: number;
    const clock = createStudioClock();

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const { dt } = clock.pump(now);
      const p = live.current;

      // Bus-owned kernel step: prefer the latest shared-tape aerostatic state.
      const z = zeppelinPoseRef.current;
      updateZeppelinAirshipKinematics(
        nodes,
        materials,
        dt,
        z ? z.hullStudioY : p.hullStudioY,
        z ? z.pitchTrimDeg : p.pitchTrimDeg,
        z ? z.propellerDisplayOmegaRadPerS : p.propellerOmegaRadPerS,
        p.trimWeightPosM,
        p.isCutaway,
        p.gasInflation,
        p.flightSpeedKnots,
      );

      controls.update();
      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Zeppelin LZ-1 Airship 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-9.5rem)] sm:max-w-[calc(100%-28rem)] gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3.5 h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["girders_frame", "Lattice Girders"],
                ["engine_gondola", "Gondolas"],
                ["gas_cells", "Gas Cells"],
                ["control_fins", "Tail Fins"],
                ["top", "Plan View"],
              ] as [CameraPreset, string][]
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyCameraPreset(preset)}
                className={`min-h-9 px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
                  activeCamera === preset
                    ? "bg-amber-600 text-white shadow-xs font-semibold"
                    : "text-ink-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <StudioOverlayActionToolbar
          actions={createStandardStudioOverlayActions({
            isCutaway,
            onToggleCutaway: () => setIsCutaway(!isCutaway),
            cutawayTitle: isCutaway ? "Solid Envelope" : "Cutaway Hydrogen Cells",
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
                Gross Buoyancy:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {zep.grossBuoyancyKn} kN
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Net Lift:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {zep.netLiftKn} kN
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Cruising Speed:</span>
              <span className="font-bold text-cyan-800 dark:text-cyan-400">
                {zep.flightSpeedKmh.toFixed(1)} km/h
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Pitch Trim:</span>
              <span className="font-bold text-purple-800 dark:text-purple-400">
                {zep.pitchTrimDeg}°
              </span>
            </div>
          </div>
        )}

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
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

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SensitivitySlider
            id="zeppelin3dGasInflation"
            patentId="us-621195-zeppelin-airship"
            paramKey="gasInflation"
            label="Hydrogen Cell Inflation"
            value={gasInflation}
            min={75}
            max={100}
            step={1}
            unit="%"
            onChange={(val) => updateParam("gasInflation", val)}
            allParams={params}
          />
          <SensitivitySlider
            id="zeppelin3dTrimWeight"
            patentId="us-621195-zeppelin-airship"
            paramKey="trimWeight"
            label="Keel Sliding Ballast"
            value={trimWeightPosM}
            min={-15}
            max={15}
            step={1}
            unit=" m"
            onChange={(val) => updateParam("trimWeight", val)}
            allParams={params}
          />
          <SensitivitySlider
            id="zeppelin3dAirspeed"
            patentId="us-621195-zeppelin-airship"
            paramKey="flightSpeedKnots"
            label="Cruising Airspeed"
            value={flightSpeedKnots}
            min={10}
            max={45}
            step={1}
            unit=" knots"
            onChange={(val) => updateParam("flightSpeedKnots", val)}
            allParams={params}
          />
        </div>

        <ClaimConstraintToggle
          patentId="us-621195-zeppelin-airship"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) => {
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }));
            updateParam(claimConstraintStateParamId(claimNo), active ? 1 : 0);
          }}
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-621195-zeppelin-airship"
          params={params}
          className="mt-3"
        />
      </div>
    </div>
  );
}
