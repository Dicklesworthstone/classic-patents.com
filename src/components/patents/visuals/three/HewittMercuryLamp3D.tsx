"use client";

import { Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { stepHewittMercuryLamp } from "@/physics/catalogKernels";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import { createStudioClock } from "@/physics/tickScheduler";
import type { ElectromagneticsState, ThermodynamicsState } from "@/physics/types";
import {
  globalTransportBus,
  type TapeUpdater,
  useFrankenSimPhysics,
} from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import {
  articulateHewittMercuryLampModel,
  buildHewittMercuryLampModel,
  type HewittMercuryLampModelNodes,
} from "./hewittMercuryLampModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { StudioOverlayActionToolbar } from "./StudioOverlayActionToolbar";
import { createOrbitingStudioOverlayActions } from "./studioOverlayActions";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

interface HewittMercuryLamp3DProps {
  initialMainsVoltageV?: number;
  initialTubeLengthCm?: number;
  initialTubeDiameterMm?: number;
  initialCondenserCoolingLevel?: number;
  initialBallastResistanceOhms?: number;
}

type CameraPreset = "isometric" | "cathode" | "plasmaColumn" | "condenser";

const IDLE_EM: ElectromagneticsState = {
  frequencyHz: 0,
  magneticFluxDensityTesla: 0,
  electricFieldVpm: 0,
  phaseAngleRad: 0,
  inductanceHenry: 0,
  capacitanceFarad: 0,
  currentAmperes: 0,
  voltageVolts: 0,
  powerFactor: 0,
  efficiencyPct: 0,
  synchronousRpm: 0,
  slipFraction: 0,
  rotorRpm: 0,
  shaftPowerWatts: 0,
  electricalInputWatts: 0,
};

const IDLE_THERMO: ThermodynamicsState = {
  temperatureCelsius: 42,
  temperatureKelvin: 315.15,
  pressureAtm: 1,
  partialPressureButaneAtm: 0,
  heatInputWatts: 0,
  coolingPowerWatts: 0,
  coefficientOfPerformance: 0,
  blackbodyRadiantPowerWatts: 0,
  fluidFlowVelocityMps: 0,
};

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  isometric: { pos: [0, 2.5, 6.2], target: [0, 1.5, -0.15] },
  cathode: { pos: [-1.6, 1.6, 1.8], target: [-1.6, 1.4, 0] },
  plasmaColumn: { pos: [0, 1.6, 2.5], target: [0, 1.5, 0] },
  condenser: { pos: [1.6, 1.9, 1.8], target: [1.6, 1.7, 0] },
};

export function HewittMercuryLamp3D({
  initialMainsVoltageV = 110,
  initialTubeLengthCm = 100,
  initialTubeDiameterMm = 25,
  initialCondenserCoolingLevel = 1.0,
  initialBallastResistanceOhms = 12,
}: HewittMercuryLamp3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const nodesRef = useRef<HewittMercuryLampModelNodes | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState(false);
  const { isAudioMuted, toggleSound } = usePatentAudio();

  const { params, updateParam } = usePatentPhysics("us-682690-hewitt-mercury-lamp");
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const mainsVoltageV = params.mainsVoltageV ?? initialMainsVoltageV;
  const tubeLengthCm = params.tubeLengthCm ?? initialTubeLengthCm;
  const tubeDiameterMm = params.tubeDiameterMm ?? initialTubeDiameterMm;
  const condenserCoolingLevel = params.condenserCoolingLevel ?? initialCondenserCoolingLevel;
  const ballastResistanceOhms = params.ballastResistanceOhms ?? initialBallastResistanceOhms;
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>("isometric");
  const [isRotating, setIsRotating] = useState(false);

  const sim = stepHewittMercuryLamp({
    mainsVoltageV,
    tubeLengthCm,
    tubeDiameterMm,
    condenserCoolingLevel,
    ballastResistanceOhms,
  });

  const live = useLiveSimParams({
    isRotating,
    isCutaway,
    mainsVoltageV,
    tubeLengthCm,
    tubeDiameterMm,
    condenserCoolingLevel,
    ballastResistanceOhms,
    arcCurrentAmperes: sim.arcCurrentAmperes,
    luminousEfficacyLmPerWatt: sim.luminousEfficacyLmPerWatt,
    mercuryVaporPressureMmHg: sim.mercuryVaporPressureMmHg,
    arcOperatingVoltageV: sim.arcOperatingVoltageV,
    plasmaFlickerOmegaRadPerS: sim.plasmaFlickerOmegaRadPerS,
    cathodeSpotOmegaXRadPerS: sim.cathodeSpotOmegaXRadPerS,
    cathodeSpotOmegaYRadPerS: sim.cathodeSpotOmegaYRadPerS,
  });

  // Shared transport tape: the arc-discharge kernel step is owned by the bus
  // updater (TS_FALLBACK); the render loop keeps articulating from live refs.
  useFrankenSimPhysics("us-682690-hewitt-mercury-lamp", {
    domain: "electromagnetics_flux",
    refusal: { isRefused: false },
    em: {
      ...IDLE_EM,
      currentAmperes: sim.arcCurrentAmperes,
      voltageVolts: sim.arcOperatingVoltageV,
      electricFieldVpm: sim.electricFieldVPerCm * 100,
    },
    thermo: { ...IDLE_THERMO, pressureAtm: sim.mercuryVaporPressurePa / 101325 },
  });

  useEffect(() => {
    const integrate: TapeUpdater = (prev) => {
      const s = stepHewittMercuryLamp({
        mainsVoltageV: live.current.mainsVoltageV,
        tubeLengthCm: live.current.tubeLengthCm,
        tubeDiameterMm: live.current.tubeDiameterMm,
        condenserCoolingLevel: live.current.condenserCoolingLevel,
        ballastResistanceOhms: live.current.ballastResistanceOhms,
      });
      return {
        refusal: {
          isRefused: !s.isStable,
          reason: s.isStable
            ? undefined
            : "Ballast cannot stabilize the arc's negative differential resistance",
        },
        em: {
          ...(prev.em ?? IDLE_EM),
          currentAmperes: s.arcCurrentAmperes,
          voltageVolts: s.arcOperatingVoltageV,
          electricFieldVpm: s.electricFieldVPerCm * 100,
          electricalInputWatts: s.totalPowerWatts,
          efficiencyPct: s.electricalEfficiencyPct,
        },
        thermo: {
          ...(prev.thermo ?? IDLE_THERMO),
          pressureAtm: s.mercuryVaporPressurePa / 101325,
        },
      };
    };
    const unregister = globalTransportBus.registerUpdater(
      "us-682690-hewitt-mercury-lamp",
      integrate,
      "TS_FALLBACK",
    );
    return unregister;
  }, [live]);

  const handlePresetChange = (preset: CameraPreset) => {
    setCameraPreset(preset);
    const targetConfig = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(targetConfig.pos, targetConfig.target);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const overview = CAMERA_PRESETS.isometric;
    const studio = createThreeStudioScene({
      container,
      cameraPos: overview.pos,
      targetPos: overview.target,
    });
    studioRef.current = studio;

    const nodes = buildHewittMercuryLampModel();
    nodesRef.current = nodes;
    studio.scene.add(nodes.root);

    const clock = createStudioClock();
    const animate = (now: number) => {
      animFrameRef.current = requestAnimationFrame(animate);
      if (!studio.isVisible()) {
        return;
      }
      const { dt, simTimeSec } = clock.pump(now);
      timeRef.current = simTimeSec;

      const p = live.current;
      if (p.isRotating) {
        nodes.root.rotation.y += dt * 0.26;
      }
      studio.controls.update();

      articulateHewittMercuryLampModel(
        nodes,
        {
          arcCurrentAmperes: p.arcCurrentAmperes,
          luminousEfficacyLmPerWatt: p.luminousEfficacyLmPerWatt,
          mercuryVaporPressureMmHg: p.mercuryVaporPressureMmHg,
          arcOperatingVoltageV: p.arcOperatingVoltageV,
          plasmaFlickerOmegaRadPerS: p.plasmaFlickerOmegaRadPerS,
          cathodeSpotOmegaXRadPerS: p.cathodeSpotOmegaXRadPerS,
          cathodeSpotOmegaYRadPerS: p.cathodeSpotOmegaYRadPerS,
        },
        timeRef.current,
      );

      nodes.setCutaway?.(p.isCutaway ?? false);

      studio.renderer.render(studio.scene, studio.camera);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      nodes.dispose();
      studio.cleanup();
      studioRef.current = null;
      nodesRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Peter Cooper Hewitt Mercury-Vapor Arc Lamp 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* The claim probe is a mechanism control, not optional HUD chrome. Keep
            it reachable when the responsive telemetry overlay starts hidden. */}
        <div className="absolute top-14 right-3 sm:top-16 sm:right-4 z-10 max-w-[calc(100%-1.5rem)] pointer-events-auto">
          <ClaimConstraintToggle
            patentId="us-682690-hewitt-mercury-lamp"
            claimStates={claimStates}
            onToggleClaim={(num, active) => setClaimStates((prev) => ({ ...prev, [num]: active }))}
          />
        </div>

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 max-w-[calc(100%-9.5rem)] sm:max-w-[calc(100%-28rem)] pointer-events-auto">
            <div className="flex flex-nowrap overflow-x-auto scrollbar-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
              <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
                <Camera className="w-3.5 h-3.5" /> View:
              </span>
              {(["isometric", "cathode", "plasmaColumn", "condenser"] as CameraPreset[]).map(
                (preset) => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => handlePresetChange(preset)}
                    className={`min-h-9 px-2 py-1 rounded-lg transition-colors font-medium shrink-0 capitalize ${
                      cameraPreset === preset
                        ? "bg-amber-600 text-white shadow-xs font-semibold"
                        : "text-ink-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                    }`}
                  >
                    {preset.replace(/([A-Z])/g, " $1")}
                  </button>
                ),
              )}
            </div>
          </div>
        )}

        {/* Top-Right Action Controls */}
        <StudioOverlayActionToolbar
          actions={createOrbitingStudioOverlayActions({
            isAudioMuted,
            onToggleSound: () => {
              toggleSound();
              soundEngine.playSwitchClick();
            },
            isRotating,
            onToggleRotating: () => setIsRotating(!isRotating),
            isCutaway,
            onToggleCutaway: () => setIsCutaway(!isCutaway),
            cutawayTitle: isCutaway ? "Solid Tube" : "Transparent Glass Tube Cutaway",
            showUiOverlay,
            onToggleUiOverlay: () => setShowUiOverlay(!showUiOverlay),
            onResetCamera: () => handlePresetChange("isometric"),
          })}
        />

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                Luminous Efficacy:
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                {sim.luminousEfficacyLmPerWatt} lm/W
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Total Flux:</span>
              <span className="text-cyan-800 dark:text-cyan-400 font-bold">
                {sim.luminousFluxLumens.toLocaleString()} lm
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Arc Current:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">
                {sim.arcCurrentAmperes} A
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Operating Voltage:</span>
              <span className="text-sky-800 dark:text-sky-400 font-bold">
                {sim.arcOperatingVoltageV} V
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Carbon Bulb Equivalent:</span>
              <span className="text-purple-800 dark:text-purple-400 font-bold">
                {sim.equivalentCarbonBulbs}x
              </span>
            </div>
          </div>
        )}

        {/* Bottom SI Telemetry Chip Strip */}
        <StudioKernelChips
          side="right"
          visible={showUiOverlay}
          title="MERCURY VAPOR PLASMA DISCHARGE"
          chips={[
            {
              label: "Arc Current",
              value: `${sim.arcCurrentAmperes.toFixed(2)}`,
              unit: "A",
            },
            {
              label: "Operating Voltage",
              value: `${sim.arcOperatingVoltageV.toFixed(1)}`,
              unit: "V",
            },
            {
              label: "Luminous Efficacy",
              value: `${sim.luminousEfficacyLmPerWatt.toFixed(1)}`,
              unit: "lm/W",
            },
            {
              label: "Vapor Pressure",
              value: `${sim.mercuryVaporPressureMmHg.toFixed(3)}`,
              unit: "mmHg",
            },
            {
              label: "Ballast",
              value: `${ballastResistanceOhms.toFixed(0)}`,
              unit: "Ω",
            },
            {
              label: "State",
              value: sim.arcOperatingVoltageV > 0 ? "Plasma Conduction" : "Extinguished",
              tone: sim.arcOperatingVoltageV > 0 ? "ok" : "warn",
            },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SensitivitySlider
            id="hewittMainsVoltage"
            patentId="us-682690-hewitt-mercury-lamp"
            paramKey="mainsVoltageV"
            label="Mains Voltage"
            value={mainsVoltageV}
            min={80}
            max={240}
            step={5}
            unit="V"
            onChange={(val) => updateParam("mainsVoltageV", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="hewittTubeLength"
            patentId="us-682690-hewitt-mercury-lamp"
            paramKey="tubeLengthCm"
            label="Discharge Tube Length"
            value={tubeLengthCm}
            min={50}
            max={200}
            step={5}
            unit="cm"
            onChange={(val) => updateParam("tubeLengthCm", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="hewittBallastResistance"
            patentId="us-682690-hewitt-mercury-lamp"
            paramKey="ballastResistanceOhms"
            label="Ballast Resistance"
            value={ballastResistanceOhms}
            min={4}
            max={40}
            step={1}
            unit="Ω"
            onChange={(val) => updateParam("ballastResistanceOhms", val)}
            allParams={params}
          />
        </div>

        <ClaimConstraintToggle
          patentId="us-682690-hewitt-mercury-lamp"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) => {
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }));
            updateParam(claimConstraintStateParamId(claimNo), active ? 1 : 0);
          }}
          className="mt-3"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-682690-hewitt-mercury-lamp"
          params={params}
          className="mt-3"
        />
      </div>
    </div>
  );
}

export default HewittMercuryLamp3D;
