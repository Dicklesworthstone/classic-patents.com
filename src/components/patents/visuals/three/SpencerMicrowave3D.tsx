import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  computeSpencerPathFieldDisplay,
  createColormappedFieldTexture,
  writeColormappedField,
} from "@/physics/fieldTextures";
import { stepSpencerMicrowaveSource } from "@/physics/spencerMicrowaveKernel";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import {
  SPENCER_3D_SOURCE_BOUNDARY,
  type SpencerCameraPreset,
  spencerViewForViewport,
} from "./spencerMicrowaveCamera";
import {
  buildSpencerMicrowaveModel,
  updateSpencerMicrowaveKinematics,
} from "./spencerMicrowaveModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

export function SpencerMicrowave3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);

  // Magnetron & Cavity Resonator State
  const { params, updateParam } = usePatentPhysics("us-2495429-spencer-microwave");
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(true);
  const sourceState = stepSpencerMicrowaveSource(params);
  const energyPathActive = sourceState.energyPathActive;
  const [showSpokeWheel, _setShowSpokeWheel] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const [activeCamera, setActiveCamera] = useState<SpencerCameraPreset>("iso");
  const { isAudioMuted, toggleSound } = usePatentAudio();

  useFrankenSimPhysics("us-2495429-spencer-microwave", {
    domain: "electromagnetics_flux",
    timestampMs: 0,
    timeStepDt: 0.016,
    refusal: { isRefused: true, reason: SPENCER_3D_SOURCE_BOUNDARY },
  });

  const live = useLiveSimParams({
    pathActive: sourceState.energyPathActive,
    showSpokeWheel,
    isCutaway,
    isAudioMuted,
    normalizedDisplayPhaseRateRadPerS: sourceState.normalizedDisplayPhaseRateRadPerS,
  });

  const applyCameraPreset = (preset: SpencerCameraPreset) => {
    setActiveCamera(preset);
    const cfg = spencerViewForViewport(preset, containerRef.current?.clientWidth ?? 1000);
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const iso = spencerViewForViewport("iso", container.clientWidth);
    const studio = createThreeStudioScene({
      container,
      cameraPos: iso.pos,
      targetPos: iso.target,
    });
    studioRef.current = studio;

    const { scene, renderer, controls } = studio;

    const model = buildSpencerMicrowaveModel();
    scene.add(model.root);

    const fieldGrid = 32;
    const fieldTex = createColormappedFieldTexture(
      computeSpencerPathFieldDisplay(0, 0, fieldGrid),
      fieldGrid,
      fieldGrid,
    );
    const fieldPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(1.8, 2.4),
      new THREE.MeshBasicMaterial({
        map: fieldTex,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
      }),
    );
    fieldPlane.rotation.x = -Math.PI / 2;
    // The field belongs over the conveyor treatment region, downstream of
    // the joined guide—not at an unconnected scene-origin display plane.
    fieldPlane.position.set(3.35, -0.62, 0);
    fieldPlane.visible = false;
    scene.add(fieldPlane);
    const fieldRgba = fieldTex.image.data as Uint8Array;

    let reqId: number;
    const clock = createStudioClock();

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const { dt, simTimeSec } = clock.pump(now);
      const p = live.current;

      updateSpencerMicrowaveKinematics(
        model,
        dt,
        p.pathActive,
        p.normalizedDisplayPhaseRateRadPerS,
        0.85,
        p.showSpokeWheel,
        p.isCutaway,
      );

      if (!p.isAudioMuted && p.pathActive) {
        soundEngine.playFieldTransducer({
          kind: "rf",
          sample: 0.65,
          carrierHz: 90,
        });
      } else if (p.isAudioMuted || !p.pathActive) {
        soundEngine.stopContinuousTone();
      }

      writeColormappedField(
        fieldRgba,
        computeSpencerPathFieldDisplay(
          p.pathActive ? 1 : 0,
          simTimeSec * p.normalizedDisplayPhaseRateRadPerS,
          fieldGrid,
        ),
        fieldGrid,
        fieldGrid,
      );
      fieldTex.needsUpdate = true;
      fieldPlane.visible = Boolean(p.pathActive);

      controls.update();
      renderer.render(scene, studio.camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      fieldTex.dispose();
      fieldPlane.geometry.dispose();
      (fieldPlane.material as THREE.MeshBasicMaterial).dispose();
      model.dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  useEffect(() => {
    const restoreResponsiveView = () => {
      const container = containerRef.current;
      if (!container) return;
      const config = spencerViewForViewport(activeCamera, container.clientWidth);
      studioRef.current?.controls.setView(config.pos, config.target);
    };
    window.addEventListener("resize", restoreResponsiveView);
    return () => window.removeEventListener("resize", restoreResponsiveView);
  }, [activeCamera]);

  return (
    <div
      className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent"
      data-testid="spencer-microwave-three"
      data-source-path={energyPathActive ? "active" : "disabled"}
      data-source-path-continuous={String(sourceState.sourcePathContinuous)}
      data-source-wavelength-reference-m={sourceState.sourceWavelengthReferenceM}
      data-vacuum-frequency-at-ten-centimeters-hz={sourceState.vacuumFrequencyAtTenCentimetersHz}
      data-kernel-source={sourceState.kernelSource}
      data-quantitative-tube-model="refused"
      data-quantitative-cooking-model="refused"
      data-display-rate-kind="normalized"
    >
      <div className="sr-only">Percy L. Spencer source-bounded food-treatment apparatus 3D</div>
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
                ["cavity_resonator", "Cavity"],
                ["electron_spokes", "Spokes"],
                ["waveguide_launch", "Waveguide"],
                ["transformer", "Transformer"],
                ["top", "Interaction Space"],
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
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 max-w-[min(90%,26rem)] sm:max-w-[26rem] pointer-events-auto">
          <ClaimConstraintToggle
            patentId="us-2495429-spencer-microwave"
            claimStates={claimStates}
            onToggleClaim={(c: number, active: boolean) => {
              setClaimStates((prev) => ({ ...prev, [c]: active }));
              updateParam("rfPowerSetting", active ? 1 : 0);
            }}
          />
          <button
            type="button"
            onClick={() => {
              setIsCutaway(!isCutaway);
              soundEngine.playSwitchClick();
            }}
            title={isCutaway ? "Switch to Solid Magnetron" : "Switch to Magnetron Cutaway"}
            className={`min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              isCutaway
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            aria-label="Toggle audio hum"
            type="button"
            onClick={() => {
              toggleSound();
              soundEngine.playSwitchClick();
            }}
            className="min-h-9 p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`min-h-9 p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
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
            aria-label={showCalloutPins ? "Hide annotation pins" : "Show annotation pins"}
            type="button"
            onClick={() => {
              setShowCalloutPins(!showCalloutPins);
              soundEngine.playSwitchClick();
            }}
            className={`min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
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
            className="min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
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
                Source wavelength region:
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400">λ ≲ 10 cm</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Vacuum relation at 10 cm:</span>
              <span className="text-purple-800 dark:text-purple-400 font-bold">
                ≈ {(sourceState.vacuumFrequencyAtTenCentimetersHz / 1e9).toFixed(3)} GHz
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Printed apparatus path:</span>
              <span className="text-emerald-800 dark:text-emerald-400 font-bold">
                10/11 → 24/25 → 23 → 28
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Tube & cooking SI:</span>
              <span className="text-cyan-800 dark:text-cyan-400 font-bold">REFUSED</span>
            </div>
          </div>
        )}

        <StudioKernelChips
          side="right"
          visible={showUiOverlay}
          title="Source-bounded apparatus state"
          chips={[
            { label: "Shared state", value: sourceState.kernelSource },
            { label: "Sources", value: "10 + 11" },
            { label: "Guide", value: "23" },
            { label: "Conveyor", value: "28" },
            { label: "SI performance", value: "refused" },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-ink-900 dark:text-parchment-100">
              Source-bounded energy path
            </p>
            <p className="mt-1 max-w-3xl text-xs leading-relaxed text-ink-600 dark:text-ink-300">
              {SPENCER_3D_SOURCE_BOUNDARY}
            </p>
          </div>
          <button
            type="button"
            aria-pressed={energyPathActive}
            onClick={() => updateParam("rfPowerSetting", energyPathActive ? 0 : 1)}
            className={`min-h-11 shrink-0 rounded-lg border px-4 text-sm font-semibold ${
              energyPathActive
                ? "border-emerald-700 bg-emerald-700 text-white"
                : "border-ink-400 bg-parchment-50 text-ink-800 dark:border-ink-600 dark:bg-ink-900 dark:text-parchment-200"
            }`}
          >
            Energy path {energyPathActive ? "enabled" : "disabled"}
          </button>
        </div>
      </div>
    </div>
  );
}
