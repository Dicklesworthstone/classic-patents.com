"use client";

import { Camera, Eye, EyeOff, RotateCcw, Volume2, VolumeX, Waves } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import { FrankenSimEngine } from "@/physics/engine";
import { createStudioClock } from "@/physics/tickScheduler";
import type { ThermodynamicsState } from "@/physics/types";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "../PortHamiltonianEnergyStrip";
import {
  type CarrierAirConditionerCameraPreset,
  carrierAirConditionerCameraForViewport,
} from "./carrierAirConditionerCamera";
import {
  buildCarrierAirConditionerModel,
  updateCarrierAirConditionerKinematics,
} from "./carrierAirConditionerModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

export function CarrierAirConditioner3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [cutawayMode, setCutawayMode] = useState(true);
  const [showSpray, setShowSpray] = useState(true);
  const [activeCamera, setActiveCamera] = useState<CarrierAirConditionerCameraPreset>("iso");
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true });
  const { isAudioMuted, toggleSound } = usePatentAudio();
  const { params, updateParam } = usePatentPhysics("us-808897-carrier-air-conditioner");
  const airflowCfm = params.airflowCfm ?? 15000;
  const sprayRatePct = params.sprayRatePct ?? 60;
  const separatorFaces = params.separatorFaces ?? 6;
  const carrier = FrankenSimEngine.stepCarrierAirConditioner({
    airflowCfm,
    sprayRatePct,
    separatorFaces,
  });
  const live = useLiveSimParams({
    animation: carrier.animation,
    cutawayMode,
    showSpray,
  });

  // Shared transport tape: the air-washer kernel is steady-state in its
  // controls (the grant models no thermal setpoints), so this face publishes
  // an honest ENVELOPE — separator airflow and fan work — while the local
  // rAF keeps pacing the spray/fan display.
  const washerThermo: ThermodynamicsState = {
    temperatureCelsius: 0, // no thermal setpoint modeled; see kernel modelBoundary
    temperatureKelvin: 0,
    pressureAtm: carrier.pressureDropPa / 101325,
    partialPressureButaneAtm: 0,
    heatInputWatts: carrier.airMovementWatts, // fan work against separator resistance
    coolingPowerWatts: 0,
    coefficientOfPerformance: 0,
    blackbodyRadiantPowerWatts: 0,
    fluidFlowVelocityMps: carrier.airCurrentMps,
  };
  useFrankenSimPhysics("us-808897-carrier-air-conditioner", {
    domain: "thermo_fluid",
    refusal: {
      isRefused: sprayRatePct <= 0,
      reason:
        sprayRatePct <= 0
          ? "Water spray shut off: the unobstructed wet front of Claim 1 is lost"
          : undefined,
    },
    thermo: washerThermo,
  });

  const applyCameraPreset = (preset: CarrierAirConditionerCameraPreset) => {
    setActiveCamera(preset);
    const container = containerRef.current;
    const view = carrierAirConditionerCameraForViewport(
      preset,
      container?.clientWidth ?? 0,
      container?.clientHeight ?? 0,
    );
    studioRef.current?.controls.setView(view.pos, view.target);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const overview = carrierAirConditionerCameraForViewport(
      "iso",
      container.clientWidth,
      container.clientHeight,
    );
    const studio = createThreeStudioScene({
      container,
      cameraPos: overview.pos,
      targetPos: overview.target,
      fov: 44,
    });
    studioRef.current = studio;
    const { scene, camera, renderer, controls } = studio;
    const { root, nodes, materials, dispose } = buildCarrierAirConditionerModel();
    scene.add(root);
    let requestId = 0;
    const clock = createStudioClock();
    const animate = (now: number) => {
      requestId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const { dt } = clock.pump(now);
      const p = live.current;
      updateCarrierAirConditionerKinematics(
        nodes,
        materials,
        dt,
        p.animation,
        p.cutawayMode,
        p.showSpray,
      );
      controls.update();
      renderer.render(scene, camera);
    };
    requestId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(requestId);
      dispose();
      studio.cleanup();
      studioRef.current = null;
    };
  }, [live]);

  useEffect(() => {
    if (activeCamera !== "iso") return;
    const reselectResponsiveOverview = () => {
      const container = containerRef.current;
      if (!container) return;
      const view = carrierAirConditionerCameraForViewport(
        "iso",
        container.clientWidth,
        container.clientHeight,
      );
      studioRef.current?.controls.setView(view.pos, view.target);
    };
    window.addEventListener("resize", reselectResponsiveOverview);
    window.addEventListener("orientationchange", reselectResponsiveOverview);
    return () => {
      window.removeEventListener("resize", reselectResponsiveOverview);
      window.removeEventListener("orientationchange", reselectResponsiveOverview);
    };
  }, [activeCamera]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Carrier wet air washer and sinuous separator model</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />
        {showUiOverlay && (
          <div className="absolute top-3 left-3 z-10 flex flex-nowrap overflow-x-auto gap-1 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 text-xs">
            <span className="px-1.5 py-1 text-ink-500 flex items-center gap-1">
              <Camera className="w-3.5 h-3.5" /> View:
            </span>
            {(["iso", "spray", "plates", "fan"] as CarrierAirConditionerCameraPreset[]).map(
              (preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => applyCameraPreset(preset)}
                  className={`min-h-9 px-2 py-1 rounded-lg ${activeCamera === preset ? "bg-cyan-600 text-white" : "text-ink-700 dark:text-ink-300"}`}
                >
                  {preset}
                </button>
              ),
            )}
          </div>
        )}
        <div className="absolute top-3 right-3 z-10 flex flex-wrap justify-end gap-1.5">
          <ClaimConstraintToggle
            patentId="us-808897-carrier-air-conditioner"
            claimStates={claimStates}
            onToggleClaim={(claim, active) => {
              setClaimStates((previous) => ({ ...previous, [claim]: active }));
              updateParam(claimConstraintStateParamId(claim), active ? 1 : 0);
              updateParam("sprayRatePct", active ? 60 : 0);
            }}
          />
          <button
            type="button"
            onClick={() => setCutawayMode((value) => !value)}
            title={cutawayMode ? "Show casing" : "Show cutaway"}
            aria-label={cutawayMode ? "Show casing" : "Show cutaway"}
            className="p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 border border-parchment-300 dark:border-ink-700"
          >
            {cutawayMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setShowSpray((value) => !value)}
            title={showSpray ? "Hide spray" : "Show spray"}
            aria-label={showSpray ? "Hide spray" : "Show spray"}
            className="p-2 rounded-xl bg-cyan-600 text-white"
          >
            <Waves className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              toggleSound();
              soundEngine.playSwitchClick();
            }}
            title={isAudioMuted ? "Unmute sound" : "Mute sound"}
            aria-label={isAudioMuted ? "Unmute sound" : "Mute sound"}
            className="p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 border border-parchment-300 dark:border-ink-700"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => applyCameraPreset("iso")}
            title="Reset camera"
            aria-label="Reset camera"
            className="p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 border border-parchment-300 dark:border-ink-700"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay((value) => !value)}
            title="Toggle overlay"
            aria-label="Toggle overlay"
            className="p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 border border-parchment-300 dark:border-ink-700"
          >
            {showUiOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 text-xs font-mono grid grid-cols-2 gap-x-4 gap-y-1">
            <span className="text-ink-500">Wet film</span>
            <strong>{carrier.wetFilmCoveragePct}%</strong>
            <span className="text-ink-500">Dust capture</span>
            <strong>{carrier.particleCapturePct}%</strong>
            <span className="text-ink-500">Droplet separation</span>
            <strong>{carrier.dropletSeparationPct}%</strong>
            <span className="text-ink-500">Flow resistance</span>
            <strong>{carrier.pressureDropPa} Pa</strong>
          </div>
        )}

        <StudioKernelChips
          side="right"
          visible={showUiOverlay}
          title="Carrier wet air washer"
          chips={[
            { label: "Air current", value: `${carrier.airCurrentMps} m/s` },
            { label: "Wet film", value: `${carrier.wetFilmCoveragePct}%` },
            { label: "Dust capture", value: `${carrier.particleCapturePct}%` },
            { label: "Droplet separation", value: `${carrier.dropletSeparationPct}%` },
            { label: "Kernel", value: "host SI" },
          ]}
        />
      </div>
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SensitivitySlider
            id="carrierAirflow"
            patentId="us-808897-carrier-air-conditioner"
            paramKey="airflowCfm"
            label="Air current through casing"
            value={airflowCfm}
            min={2000}
            max={30000}
            step={500}
            unit="cfm"
            onChange={(value) => updateParam("airflowCfm", value)}
            allParams={params}
          />
          <SensitivitySlider
            id="carrierSprayRate"
            patentId="us-808897-carrier-air-conditioner"
            paramKey="sprayRatePct"
            label="Fine liquid spray"
            value={sprayRatePct}
            min={10}
            max={100}
            step={5}
            unit="%"
            onChange={(value) => updateParam("sprayRatePct", value)}
            allParams={params}
          />
          <SensitivitySlider
            id="carrierSeparatorFaces"
            patentId="us-808897-carrier-air-conditioner"
            paramKey="separatorFaces"
            label="Sinuous faces and flanges"
            value={separatorFaces}
            min={2}
            max={12}
            step={1}
            unit="faces"
            onChange={(value) => updateParam("separatorFaces", value)}
            allParams={params}
          />
        </div>
        <PortHamiltonianEnergyStrip
          patentId="us-808897-carrier-air-conditioner"
          params={params}
          className="mt-3"
        />
      </div>
    </div>
  );
}
