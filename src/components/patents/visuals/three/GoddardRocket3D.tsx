import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { FrankenSimEngine } from "@/physics/engine";
import { ensureGoddardWasm } from "@/physics/goddardWasm";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import { buildGoddardRocketModel, updateGoddardRocketKinematics } from "./goddardRocketModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset =
  | "iso"
  | "de_laval_nozzle"
  | "combustion_chamber"
  | "gimbal_actuator"
  | "interstage"
  | "top";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [13, 10, 16], target: [0, 0, 0] },
  de_laval_nozzle: { pos: [0, -3.2, 5.0], target: [0, -3.0, 0] },
  combustion_chamber: { pos: [0, -0.5, 4.5], target: [0, -1.0, 0] },
  gimbal_actuator: { pos: [2.8, -2.4, 3.5], target: [0, -2.5, 0] },
  interstage: { pos: [2.8, 1.8, 4.2], target: [0, 1.5, 0] },
  top: { pos: [0, 11.5, 0.1], target: [0, 0, 0] },
};

export function GoddardRocket3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGoddardWasm();
  }, []);

  // Propulsion & Staging State Controls
  const { params, updateParam } = usePatentPhysics("us-1102653-goddard-rocket");
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const chamberPressurePsi = params.chamberPressure ?? 350;
  const expansionRatio = params.expansionRatio ?? 3.5;
  const fuelFlowRateKgs = params.fuelFlowRateKgs ?? 1.8;
  const activeStage = params.activeStage ?? 1;
  const gyroGimbalAngleDeg = params.gyroGimbalAngleDeg ?? 3;
  const showExhaustPlume = params.showExhaustPlume !== 0;
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });

  // Rocket Propulsion Physics (FrankenSim de Laval Isentropic Expansion)
  const rocketPhysics = FrankenSimEngine.stepGoddardRocket(
    chamberPressurePsi,
    fuelFlowRateKgs,
    4.2,
    expansionRatio,
  );

  useFrankenSimPhysics("us-1102653-goddard-rocket", {
    domain: "thermodynamics_transport",
    timestampMs: 0,
    timeStepDt: 0.016,
    refusal: { isRefused: false },
    thermo: {
      temperatureCelsius: 0,
      temperatureKelvin: 0,
      pressureAtm: rocketPhysics.chamberPressureAtm,
      partialPressureButaneAtm: 0,
      heatInputWatts: 0,
      coolingPowerWatts: 0,
      coefficientOfPerformance: 0,
      blackbodyRadiantPowerWatts: 0,
      fluidFlowVelocityMps: rocketPhysics.exhaustVelocityMps,
    },
  });
  const specificImpulseSec = Number(rocketPhysics.specificImpulseSec.toFixed(1));
  const exhaustVelocityMps = rocketPhysics.exhaustVelocityMps;
  const machExit = rocketPhysics.machExit;
  const thrustNewtons = rocketPhysics.thrustNewtons;
  const thrustLbf = rocketPhysics.thrustLbf;

  const live = useLiveSimParams({
    activeStage,
    chamberPressurePsi,
    fuelFlowRateKgs,
    gyroGimbalAngleDeg,
    expansionRatio,
    showExhaustPlume,
    showCalloutPins,
    isCutaway,
    isAudioMuted,
    thrustNewtons,
    exhaustVelocityMps,
    specificImpulseSec,
    machExit,
    plumeAdvancePerS: Math.min(24, Math.max(4, exhaustVelocityMps / 100)),
  });

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

    const { scene, renderer, controls } = studio;

    // Build procedural 3D model
    const rocket = buildGoddardRocketModel();
    scene.add(rocket.root);

    // Animation Loop
    let reqId: number;

    const clock = createStudioClock();

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const { dt } = clock.pump(now);
      const p = live.current;

      updateGoddardRocketKinematics(
        rocket,
        dt,
        p.activeStage,
        p.gyroGimbalAngleDeg,
        p.expansionRatio,
        p.plumeAdvancePerS,
        p.showExhaustPlume,
        p.isCutaway,
      );

      controls.update();
      renderer.render(scene, studio.camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      rocket.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <PortHamiltonianEnergyStrip
        patentId="us-1102653-goddard-rocket"
        params={{
          fuelFlowRateKgs,
          chamberPressure: chamberPressurePsi,
        }}
      />
      <div className="sr-only">Robert H. Goddard Rocket Apparatus 3D Simulation</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-9.5rem)] sm:max-w-[calc(100%-28rem)] gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["de_laval_nozzle", "De Laval Nozzle"],
                ["combustion_chamber", "Chamber"],
                ["gimbal_actuator", "Gimbal Vanes"],
                ["interstage", "Interstage Stage 2"],
                ["top", "Aero Profile"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => applyCameraPreset(id)}
                className={`min-h-9 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-sans whitespace-nowrap shrink-0 transition-colors ${
                  activeCamera === id
                    ? "bg-amber-700 dark:bg-amber-700 text-white font-semibold shadow-xs"
                    : "text-ink-700 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Top Right Tool Bar */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap items-center gap-1.5 sm:gap-2 justify-end max-w-[min(90%,26rem)] sm:max-w-[26rem] pointer-events-auto">
          <ClaimConstraintToggle
            patentId="us-1102653-goddard-rocket"
            claimStates={claimStates}
            onToggleClaim={(c: number, active: boolean) => {
              setClaimStates((prev) => ({ ...prev, [c]: active }));
              updateParam("chamberPressure", active ? 350 : 80);
            }}
          />
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Switch to Solid Hull" : "Switch to Rocket Hull Cutaway"}
            className={`min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              isCutaway
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`min-h-9 p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showUiOverlay
                ? "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
                : "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
            }`}
            title={showUiOverlay ? "Hide Overlay UI (Clean 3D View)" : "Show Overlay UI"}
            aria-label={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
          >
            {showUiOverlay ? (
              <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
          <button
            aria-label={isAudioMuted ? "Unmute simulation audio" : "Mute simulation audio"}
            type="button"
            onClick={toggleSound}
            className="min-h-9 p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={isAudioMuted ? "Enable Sound" : "Mute Sound"}
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            )}
          </button>
          <button
            aria-label={showCalloutPins ? "Hide annotation pins" : "Show annotation pins"}
            type="button"
            onClick={() => setShowCalloutPins(!showCalloutPins)}
            className={`min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showCalloutPins
                ? "bg-amber-600 text-white border-amber-700 shadow-md"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
            title="Toggle Historical Patent Numeral Pins"
          >
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                Thrust Force:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {Math.round(thrustNewtons)} N ({Math.round(thrustLbf)} lbf)
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Specific Impulse:</span>
              <span className="text-cyan-800 dark:text-cyan-400 font-bold">
                {specificImpulseSec} s
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Exhaust Velocity:</span>
              <span className="text-emerald-800 dark:text-emerald-400 font-bold">
                {exhaustVelocityMps.toLocaleString()} m/s (M{machExit.toFixed(2)})
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Chamber Pressure:</span>
              <span className="text-purple-800 dark:text-purple-400 font-bold">
                {chamberPressurePsi} psi
              </span>
            </div>
          </div>
        )}

        {/* Bottom SI Telemetry Chip Strip */}
        <StudioKernelChips
          side="right"
          visible={showUiOverlay}
          title="LIQUID PROPELLANT ROCKET PROPULSION"
          chips={[
            {
              label: "Thrust",
              value: `${thrustNewtons.toFixed(0)} N`,
              unit: `(${thrustLbf.toFixed(0)} lbf)`,
              tone: "hot",
            },
            { label: "I_sp", value: `${specificImpulseSec.toFixed(1)}`, unit: "s" },
            { label: "v_exhaust", value: `${exhaustVelocityMps.toFixed(0)}`, unit: "m/s" },
            { label: "Exit Mach", value: `M ${machExit.toFixed(2)}`, tone: "hot" },
            { label: "P_chamber", value: `${chamberPressurePsi.toFixed(0)}`, unit: "psi" },
            { label: "Expansion", value: `${expansionRatio.toFixed(1)}:1`, unit: "ratio" },
            { label: "Propellant", value: "Liquid Oxygen + Gasoline" },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SensitivitySlider
            id="chamberPressure"
            patentId="us-1102653-goddard-rocket"
            paramKey="chamberPressure"
            label="Chamber Pressure"
            value={chamberPressurePsi}
            min={100}
            max={800}
            step={25}
            unit="psi"
            onChange={(val) => updateParam("chamberPressure", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="fuelFlowRate"
            patentId="us-1102653-goddard-rocket"
            paramKey="fuelFlowRateKgs"
            label="Fuel Flow Rate"
            value={fuelFlowRateKgs}
            min={0.5}
            max={5.0}
            step={0.1}
            unit="kg/s"
            onChange={(val) => updateParam("fuelFlowRateKgs", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="expansionRatio"
            patentId="us-1102653-goddard-rocket"
            paramKey="expansionRatio"
            label="Nozzle Expansion Ratio"
            value={expansionRatio}
            min={2.0}
            max={10.0}
            step={0.5}
            unit=":1"
            onChange={(val) => updateParam("expansionRatio", val)}
            allParams={params}
          />
        </div>

        <ClaimConstraintToggle
          patentId="us-1102653-goddard-rocket"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-1102653-goddard-rocket"
          params={params}
          className="mt-3"
        />
      </div>
    </div>
  );
}
