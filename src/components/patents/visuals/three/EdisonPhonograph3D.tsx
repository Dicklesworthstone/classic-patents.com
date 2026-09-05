"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { phonographAxialTravelMm, stepEdisonPhonograph } from "@/physics/catalogKernels";
import { createStudioClock } from "@/physics/tickScheduler";
import type { MachineState } from "@/physics/types";
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
  type EdisonPhonographCameraPreset,
  edisonPhonographCameraForViewport,
} from "./edisonPhonographCamera";
import {
  buildEdisonPhonographModel,
  updateEdisonPhonographKinematics,
} from "./edisonPhonographModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

const IDLE_MACHINE: MachineState = {
  poseXMeters: 0,
  poseYMeters: 0,
  headingRad: 0,
  modeLabel: "mandrel-cylinder",
  wheelSpeedMps: 0,
};

export function EdisonPhonograph3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);

  // Acoustic & Kinematic Parameters
  const { params, updateParam } = usePatentPhysics("us-200521-edison-phonograph");
  const mandrelRpm = params.mandrelRpm ?? 60;
  const cylinderRpm = mandrelRpm;
  const voiceVolumeDb = params.voiceVolumeDb ?? params.soundWaveAmpDb ?? 75;
  const [activeCamera, setActiveCamera] = useState<EdisonPhonographCameraPreset>("iso");
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const phono = stepEdisonPhonograph({
    mandrelRpm,
    voiceVolumeDb,
  });

  // Shared transport tape: the US 200,521 mandrel/cylinder pose publishes to
  // the patentId-keyed bus so every face reads one deterministic state.
  useFrankenSimPhysics("us-200521-edison-phonograph", {
    domain: "solid_mechanics",
    refusal: { isRefused: false },
    machine: {
      ...IDLE_MACHINE,
      wheelSpeedMps: phono.axialTravelMmPerS / 1000,
    },
  });

  const live = useLiveSimParams({
    mandrelRpm,
    cylinderRpm,
    voiceVolumeDb,
    isAudioMuted,
    isCutaway,
    leadScrewPitchMm: phono.leadScrewPitchMm,
    mandrelOmegaRadPerS: phono.mandrelOmegaRadPerS,
    stylusAmp: phono.stylusAmp,
    stylusOmegaRadPerS: phono.stylusOmegaRadPerS,
    axialFeedMmPerS: phono.axialTravelMmPerS,
  });

  // One tape-bound integrator (br-ixl): the bus updater owns the mandrel
  // rotation phase and lead-screw travel. Accumulators live in refs so
  // re-registering on control changes never snaps the phase back to zero.
  const mandrelAngleRef = useRef(0);
  const lastLegalAngleRef = useRef(0);
  useEffect(() => {
    const integrate: TapeUpdater = (_prev, dt) => {
      const refused = (live.current.mandrelRpm ?? 0) <= 0;
      if (!refused) {
        mandrelAngleRef.current += (live.current.mandrelOmegaRadPerS ?? 0) * dt;
        lastLegalAngleRef.current = mandrelAngleRef.current;
      } else {
        mandrelAngleRef.current = lastLegalAngleRef.current;
      }
      const angleDeg = (mandrelAngleRef.current * 180) / Math.PI;
      return {
        refusal: {
          isRefused: refused,
          reason: refused ? "Crank stopped: cylinder held at last legal angle" : undefined,
        },
        machine: {
          ...IDLE_MACHINE,
          poseXMeters:
            phonographAxialTravelMm(angleDeg, live.current.leadScrewPitchMm ?? 2.54) / 1000,
          headingRad: mandrelAngleRef.current,
          wheelSpeedMps: (live.current.axialFeedMmPerS ?? 0) / 1000,
        },
      };
    };
    return globalTransportBus.registerUpdater(
      "us-200521-edison-phonograph",
      integrate,
      "TS_FALLBACK",
    );
  }, [live]);

  const applyCameraPreset = (preset: EdisonPhonographCameraPreset) => {
    setActiveCamera(preset);
    const cfg = edisonPhonographCameraForViewport(preset, containerRef.current?.clientWidth ?? 0);
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

    const iso = edisonPhonographCameraForViewport("iso", container.clientWidth);
    const studio = createThreeStudioScene({
      container,
      cameraPos: iso.pos,
      targetPos: iso.target,
    });
    studioRef.current = studio;

    const { scene, camera, renderer, controls } = studio;

    const model = buildEdisonPhonographModel();
    scene.add(model.rootGroup);

    // Animation Loop (lastFrameMs tracked by createStudioClock)
    let reqId: number;
    const clock = createStudioClock();

    const animate = (frameMs: number) => {
      reqId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const { dt: delta, simTimeSec: timeSec } = clock.pump(frameMs);
      const p = live.current;

      updateEdisonPhonographKinematics(
        model,
        delta,
        timeSec,
        p.mandrelOmegaRadPerS,
        p.stylusAmp,
        p.stylusOmegaRadPerS,
        p.isCutaway,
        p.cylinderRpm,
        p.voiceVolumeDb,
      );

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

  useEffect(() => {
    const restoreResponsiveCamera = () => {
      const container = containerRef.current;
      if (!container) return;
      const cfg = edisonPhonographCameraForViewport(activeCamera, container.clientWidth);
      studioRef.current?.controls.setView(cfg.pos, cfg.target);
    };
    window.addEventListener("resize", restoreResponsiveCamera);
    return () => window.removeEventListener("resize", restoreResponsiveCamera);
  }, [activeCamera]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Thomas Edison Phonograph 3D</div>
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
                ["stylus_groove", "Stylus & Diaphragm"],
                ["tinfoil_cylinder", "Tinfoil Cylinder"],
                ["speaking_tube", "Speaking Tube"],
                ["illustrative_drive", "Illustrative Drive"],
                ["top", "Plan View"],
              ] as [EdisonPhonographCameraPreset, string][]
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

        {/* Top Right Tool Bar */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 max-w-[min(90%,26rem)] sm:max-w-[26rem] pointer-events-auto">
          <ClaimConstraintToggle
            patentId="us-200521-edison-phonograph"
            claimStates={claimStates}
            onToggleClaim={(c: number, active: boolean) => {
              setClaimStates((prev) => ({ ...prev, [c]: active }));
              updateParam("mandrelRpm", active ? 60 : 0);
            }}
          />
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Solid Apparatus" : "Cutaway View"}
            className={`min-h-9 p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm text-xs font-sans flex items-center gap-1 ${
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
            className="min-h-9 p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
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
            {showUiOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
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
                Illustrative turn setting:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                {mandrelRpm} model rpm
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Lead Screw Pitch:</span>
              <span className="text-purple-800 dark:text-purple-400 font-bold">
                {phono.leadScrewPitchMm.toFixed(2)} mm
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Illustrative stylus motion:</span>
              <span className="font-bold text-cyan-800 dark:text-cyan-400">
                {phono.stylusAmp.toFixed(4)} display units
              </span>
            </div>
            <p className="pt-1 border-t border-parchment-200 dark:border-ink-800/80 text-[10px] leading-relaxed text-ink-500 dark:text-ink-400">
              Reader aid only: the grant gives no rate, indentation depth, surface speed, or audio
              response.
            </p>
          </div>
        )}

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="Edison source and reader aids"
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
            { label: "Illustrative turn setting", value: String(mandrelRpm), unit: "model rpm" },
            {
              label: "Illustrative axial animation",
              value: phono.axialTravelMmPerS.toFixed(2),
              unit: "mm/s",
            },
            {
              label: "Illustrative angular rate",
              value: phono.mandrelOmegaRadPerS.toFixed(1),
              unit: "rad/s",
            },
            {
              label: "Illustrative stylus motion",
              value: phono.stylusAmp.toFixed(4),
              unit: "display units",
            },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <SensitivitySlider
            id="phonograph-mandrel-3d"
            patentId="us-200521-edison-phonograph"
            paramKey="mandrelRpm"
            label="Illustrative clock-work rate"
            value={mandrelRpm}
            min={40}
            max={140}
            step={5}
            unit="RPM"
            onChange={(val) => updateParam("mandrelRpm", val)}
            allParams={params}
          />
          <SensitivitySlider
            id="phonograph-volume-3d"
            patentId="us-200521-edison-phonograph"
            paramKey="voiceVolumeDb"
            label="Illustrative diaphragm-excitation level"
            value={voiceVolumeDb}
            min={40}
            max={100}
            step={5}
            unit="model units"
            onChange={(val) => updateParam("voiceVolumeDb", val)}
            allParams={params}
          />
        </div>

        <ClaimConstraintToggle
          patentId="us-200521-edison-phonograph"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            setClaimStates((prev) => ({ ...prev, [claimNo]: active }))
          }
          className="mt-2"
        />

        <PortHamiltonianEnergyStrip
          patentId="us-200521-edison-phonograph"
          params={params}
          className="mt-3"
        />
      </div>
    </div>
  );
}
