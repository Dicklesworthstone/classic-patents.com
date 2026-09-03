"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Scissors, Shield, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import {
  advanceOtisPlatformPosition,
  OTIS_DEFAULT_PLATFORM_POSITION,
  type OtisDriveCommand,
} from "@/physics/otisKernel";
import {
  ensureOtisWasm,
  type OtisKernelSource,
  type OtisMechanismState,
  stepOtisTopology,
} from "@/physics/otisWasm";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { buildOtis1861HoistingModel, updateOtis1861Kinematics } from "./otis1861HoistingModel";
import {
  OTIS_CAMERA_PRESETS,
  type OtisCameraPreset,
  otisOverviewRadiusForViewport,
} from "./otisHoistingCamera";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

const PATENT_ID = "us-31128-otis-elevator";
function initialState(): OtisMechanismState {
  return {
    ...stepOtisTopology({
      platformPositionNormalized: OTIS_DEFAULT_PLATFORM_POSITION,
      drivePhaseRad: 0,
      driveCommand: 0,
      ropeGIntact: true,
      stopRopePulled: false,
      claim1HookLockEnabled: true,
      claim3BrakeInterlockEnabled: true,
      claim4CounterpoiseEnabled: true,
    }),
  };
}

export function OtisHoistingApparatus3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const positionRef = useRef(OTIS_DEFAULT_PLATFORM_POSITION);
  const phaseRef = useRef(0);
  const kernelSourceRef = useRef<OtisKernelSource>("unloaded");
  const { params, updateParam, resetParams } = usePatentPhysics(PATENT_ID);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState(false);
  const [activeCamera, setActiveCamera] = useState<OtisCameraPreset>("overview");
  const [kernelSource, setKernelSource] = useState<OtisKernelSource>("unloaded");
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({
    1: true,
    3: true,
    4: true,
  });
  const [uiState, setUiState] = useState<OtisMechanismState>(initialState);

  const driveCommand = [-1, 0, 1].includes(params.driveCommand)
    ? (params.driveCommand as OtisDriveCommand)
    : 0;
  const displayRatePct = params.displayRatePct ?? 60;
  const ropeGIntact = (params.ropeGIntegrityPct ?? 100) >= 15;
  const stopRopePulled = params.stopRopePulled === 1;
  const live = useLiveSimParams({
    driveCommand,
    displayRatePct,
    ropeGIntact,
    stopRopePulled,
    claim1HookLockEnabled: claimStates[1] !== false,
    claim3BrakeInterlockEnabled: claimStates[3] !== false,
    claim4CounterpoiseEnabled: claimStates[4] !== false,
    isCutaway,
  });

  useFrankenSimPhysics(PATENT_ID, {
    domain: "solid_mechanics",
    refusal: {
      isRefused: uiState.freeFallCounterfactual,
      ...(uiState.freeFallCounterfactual
        ? { reason: "Claim 1 hook-lock geometry is disabled while hoisting rope G is broken." }
        : {}),
    },
    machine: {
      poseXMeters: 0,
      poseYMeters: 0,
      headingRad: 0,
      modeLabel: uiState.mechanismMode,
      wheelSpeedMps: 0,
    },
  });

  const applyCameraPreset = (preset: OtisCameraPreset) => {
    setActiveCamera(preset);
    const camera = OTIS_CAMERA_PRESETS[preset];
    const studio = studioRef.current;
    studio?.controls.setView(camera.pos, camera.target);
    if (preset === "overview") {
      studio?.controls.setRadius(
        otisOverviewRadiusForViewport(containerRef.current?.clientWidth ?? 0),
      );
    }
  };

  useEffect(() => {
    let mounted = true;
    void ensureOtisWasm().then((source) => {
      if (!mounted) return;
      kernelSourceRef.current = source;
      setKernelSource(source);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const camera = OTIS_CAMERA_PRESETS.overview;
    const studio = createThreeStudioScene({
      container,
      cameraPos: camera.pos,
      targetPos: camera.target,
      fov: 39,
    });
    studioRef.current = studio;
    studio.controls.setRadius(otisOverviewRadiusForViewport(container.clientWidth));
    const model = buildOtis1861HoistingModel();
    studio.scene.add(model.root);

    let requestId = 0;
    let frame = 0;
    const clock = createStudioClock();
    const animate = (now: number) => {
      requestId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const { dt } = clock.pump(now);
      const current = live.current;
      const preStep = stepOtisTopology({
        platformPositionNormalized: positionRef.current,
        drivePhaseRad: phaseRef.current,
        driveCommand: current.driveCommand,
        ropeGIntact: current.ropeGIntact,
        stopRopePulled: current.stopRopePulled,
        claim1HookLockEnabled: current.claim1HookLockEnabled,
        claim3BrakeInterlockEnabled: current.claim3BrakeInterlockEnabled,
        claim4CounterpoiseEnabled: current.claim4CounterpoiseEnabled,
      });
      positionRef.current = advanceOtisPlatformPosition(
        positionRef.current,
        preStep.platformMotionDirection,
        current.displayRatePct,
        dt,
      );
      const transmittedDirection = preStep.straightBeltOWorking
        ? 1
        : preStep.crossBeltPWorking
          ? -1
          : 0;
      if (transmittedDirection !== 0) {
        const declaredDisplayTurnsPerSecond = 0.12 + (current.displayRatePct / 100) * 0.38;
        phaseRef.current =
          (phaseRef.current +
            transmittedDirection * declaredDisplayTurnsPerSecond * Math.PI * 2 * dt +
            Math.PI * 2) %
          (Math.PI * 2);
      }
      const state = stepOtisTopology({
        platformPositionNormalized: positionRef.current,
        drivePhaseRad: phaseRef.current,
        driveCommand: current.driveCommand,
        ropeGIntact: current.ropeGIntact,
        stopRopePulled: current.stopRopePulled,
        claim1HookLockEnabled: current.claim1HookLockEnabled,
        claim3BrakeInterlockEnabled: current.claim3BrakeInterlockEnabled,
        claim4CounterpoiseEnabled: current.claim4CounterpoiseEnabled,
      });
      if (state.runtimeSource !== kernelSourceRef.current) {
        kernelSourceRef.current = state.runtimeSource;
        setKernelSource(state.runtimeSource);
      }
      updateOtis1861Kinematics(model, state);
      model.setCutaway(current.isCutaway);
      frame += 1;
      if (frame % 8 === 0) setUiState(state);
      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };
    requestId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(requestId);
      model.dispose();
      studio.dispose();
      studioRef.current = null;
    };
  }, [live]);

  const setDrive = (command: OtisDriveCommand) => {
    updateParam("driveCommand", command);
    if (command !== 0) updateParam("stopRopePulled", 0);
    soundEngine.playSwitchClick();
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-parchment-300 bg-parchment-50/60 shadow-patent dark:border-ink-800 dark:bg-ink-950/80">
      <div className="sr-only">Otis 1861 Complete Hoisting Apparatus 3D (US 31,128)</div>
      <div
        data-testid="otis-three-viewport"
        className="relative min-h-[420px] w-full flex-1 cursor-grab active:cursor-grabbing sm:min-h-[500px]"
      >
        <div ref={containerRef} className="absolute inset-0 h-full w-full" />

        {showUiOverlay && (
          <div className="scrollbar-none absolute top-3 left-3 z-10 flex max-w-[calc(100%-9rem)] flex-nowrap gap-1 overflow-x-auto rounded-xl border border-parchment-300 bg-white/85 p-1 text-[10px] shadow-sm backdrop-blur-md dark:border-ink-700 dark:bg-ink-900/85 sm:top-4 sm:left-4 sm:max-w-[calc(100%-27rem)] sm:gap-1.5 sm:p-1.5 sm:text-xs">
            <span className="flex shrink-0 items-center gap-1 px-1.5 py-1 font-sans text-ink-500">
              <Camera className="h-3.5 w-3.5" /> View:
            </span>
            {(
              [
                ["overview", "Whole Apparatus"],
                ["safety", "C / E / F / f"],
                ["drive", "H / I / N"],
                ["interlock", "S / T / U / Z"],
                ["counterpoise", "Q / R"],
                ["top", "Plan"],
              ] as [OtisCameraPreset, string][]
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyCameraPreset(preset)}
                className={`min-h-9 shrink-0 rounded-lg px-2 py-1 font-medium transition-colors ${
                  activeCamera === preset
                    ? "bg-amber-600 font-semibold text-white shadow-xs"
                    : "text-ink-700 hover:bg-parchment-200 dark:text-ink-300 dark:hover:bg-ink-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <div
          data-testid="otis-studio-utilities"
          className="absolute top-3 right-3 z-20 flex flex-wrap justify-end gap-1.5 sm:top-4 sm:right-4"
        >
          <button
            type="button"
            onClick={() => setIsCutaway((value) => !value)}
            className={`min-h-9 rounded-xl border p-2 shadow-sm backdrop-blur-md ${
              isCutaway
                ? "border-cyan-700 bg-cyan-600 text-white"
                : "border-parchment-300 bg-white/90 text-ink-700 dark:border-ink-700 dark:bg-ink-900/90 dark:text-parchment-300"
            }`}
            title="Toggle structural cutaway"
            aria-label="Toggle structural cutaway"
          >
            <Layers className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay((value) => !value)}
            className="min-h-9 rounded-xl border border-parchment-300 bg-white/90 p-2 text-ink-700 shadow-sm backdrop-blur-md dark:border-ink-700 dark:bg-ink-900/90 dark:text-parchment-300"
            aria-label={showUiOverlay ? "Hide overlay" : "Show overlay"}
          >
            {showUiOverlay ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => applyCameraPreset("overview")}
            className="min-h-9 rounded-xl border border-parchment-300 bg-white/90 p-2 text-ink-700 shadow-sm backdrop-blur-md dark:border-ink-700 dark:bg-ink-900/90 dark:text-parchment-300"
            aria-label="Reset camera"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        {showUiOverlay && (
          <div className="pointer-events-none absolute bottom-3 left-3 z-10 flex max-w-[18rem] flex-col gap-1.5 rounded-xl border border-parchment-300 bg-parchment-50/95 p-3 font-mono text-xs text-ink-900 shadow-md backdrop-blur-md dark:border-ink-800 dark:bg-ink-950/95 dark:text-parchment-100 sm:bottom-4 sm:left-4">
            <div className="border-b border-parchment-200 pb-1 font-sans font-semibold dark:border-ink-800">
              1861 source topology
            </div>
            <div className="flex justify-between gap-4">
              <span>Mode</span>
              <strong className="text-amber-600">{uiState.mechanismMode}</strong>
            </div>
            <div className="flex justify-between gap-4">
              <span>Belts O / P</span>
              <strong>
                {uiState.straightBeltOWorking
                  ? "O working"
                  : uiState.crossBeltPWorking
                    ? "P working"
                    : "both idle"}
              </strong>
            </div>
            <div className="flex justify-between gap-4">
              <span>Brake Z</span>
              <strong>{uiState.brakeZEngaged ? "on L" : "released"}</strong>
            </div>
            <div className="flex justify-between gap-4">
              <span>Hooks f / racks C</span>
              <strong>{uiState.pawlsFEngaged ? "locked" : "clear"}</strong>
            </div>
            <div className="flex justify-between gap-4">
              <span>Counterpoise Q / R</span>
              <strong>
                {uiState.claim4CounterpoiseTopologySatisfied ? "opposed" : "inverted"}
              </strong>
            </div>
          </div>
        )}

        <StudioKernelChips
          side="right"
          visible={showUiOverlay}
          title="SOURCE-BOUNDED HOIST TOPOLOGY"
          chips={[
            { label: "Coordinates", value: `${uiState.scalarJointCoordinates}` },
            { label: "Independent drive", value: `${uiState.independentDriveDofs}`, unit: "DOF" },
            {
              label: "Platform",
              value: `${Math.round(uiState.platformPositionNormalized * 100)}`,
              unit: "% display",
            },
            {
              label: "Shipper S",
              value:
                uiState.shipperPositionNormalized < 0
                  ? "raise"
                  : uiState.shipperPositionNormalized > 0
                    ? "lower"
                    : "stop",
            },
            { label: "Kernel", value: kernelSource === "wasm" ? "fs-mbd WASM" : "typed mirror" },
          ]}
        />
      </div>

      <div className="space-y-3 border-t border-parchment-300 bg-parchment-100/90 p-4 dark:border-ink-800 dark:bg-ink-900/90">
        <div className="flex flex-wrap items-center gap-2">
          {([1, 0, -1] as OtisDriveCommand[]).map((command) => (
            <button
              key={command}
              type="button"
              onClick={() => setDrive(command)}
              className={`min-h-11 rounded-lg border px-4 font-sans text-sm font-semibold ${
                driveCommand === command
                  ? "border-amber-700 bg-amber-600 text-white"
                  : "border-parchment-300 bg-white text-ink-800 dark:border-ink-700 dark:bg-ink-800 dark:text-parchment-100"
              }`}
            >
              {command > 0 ? "Raise · belt O" : command < 0 ? "Lower · belt P" : "Stop · J/K idle"}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              updateParam("stopRopePulled", stopRopePulled ? 0 : 1);
              soundEngine.playSwitchClick();
            }}
            className={`min-h-11 rounded-lg border px-4 font-sans text-sm font-semibold ${stopRopePulled ? "border-rose-700 bg-rose-600 text-white" : "border-parchment-300 bg-white text-ink-800 dark:border-ink-700 dark:bg-ink-800 dark:text-parchment-100"}`}
          >
            <Shield className="mr-1 inline h-4 w-4" /> Pull stop rope U
          </button>
          <button
            type="button"
            onClick={() => {
              updateParam("ropeGIntegrityPct", ropeGIntact ? 0 : 100);
              soundEngine.playImpactThud();
            }}
            className={`min-h-11 rounded-lg border px-4 font-sans text-sm font-semibold ${!ropeGIntact ? "border-rose-700 bg-rose-600 text-white" : "border-parchment-300 bg-white text-ink-800 dark:border-ink-700 dark:bg-ink-800 dark:text-parchment-100"}`}
          >
            <Scissors className="mr-1 inline h-4 w-4" />{" "}
            {ropeGIntact ? "Sever rope G" : "Restore rope G"}
          </button>
        </div>
        <div
          data-testid="otis-claim-status-panel"
          data-claim-layout="below-studio"
          className="flex min-w-0 flex-wrap items-center gap-2 border-t border-parchment-200 pt-3 dark:border-ink-800"
        >
          <span className="shrink-0 font-sans text-[11px] font-semibold text-ink-600 dark:text-ink-300">
            Claim topology
          </span>
          <ClaimConstraintToggle
            patentId={PATENT_ID}
            claimStates={claimStates}
            className="min-w-0 flex-1 gap-1.5 max-[480px]:flex-nowrap max-[480px]:gap-1 max-[480px]:[&>button]:min-h-9 max-[480px]:[&>button]:px-2 max-[480px]:[&>button>span]:sr-only"
            onToggleClaim={(claimNumber, active) =>
              setClaimStates((previous) => ({ ...previous, [claimNumber]: active }))
            }
          />
        </div>
        <SensitivitySlider
          id="otisDisplayRate"
          patentId={PATENT_ID}
          paramKey="displayRatePct"
          label="Declared display rate"
          value={displayRatePct}
          min={0}
          max={100}
          step={1}
          unit="%"
          onChange={(value) => updateParam("displayRatePct", value)}
          allParams={params}
        />
        <div className="flex items-start justify-between gap-3 text-[11px] text-ink-500 dark:text-ink-400">
          <p>
            US 31,128 gives topology and switching logic, not dimensions, load, speed, force, spring
            rate, stopping distance, engagement time, or power. Motion is a normalized studio
            coordinate; all lettered parts remain physically connected.
          </p>
          <button
            type="button"
            onClick={() => {
              resetParams();
              positionRef.current = OTIS_DEFAULT_PLATFORM_POSITION;
              phaseRef.current = 0;
            }}
            className="shrink-0 rounded-lg border border-parchment-300 p-2 dark:border-ink-700"
            aria-label="Reset apparatus"
          >
            <Zap className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
