"use client";

import { Camera, Eye, EyeOff, RotateCcw, Sparkles, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import { HudText } from "@/components/ui/LatexRenderer";
import { FrankenSimEngine } from "@/physics/engine";
import { ensureTeslaWasm } from "@/physics/teslaWasm";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { buildTeslaCoilModel } from "./teslaCoilModel";
import { useLiveSimParams } from "./useLiveSimParams";

type CameraPreset = "iso" | "toroid_breakout" | "primary_spiral" | "spark_gap" | "top";

export function TeslaCoil3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureTeslaWasm();
  }, []);

  // Interpretive high-potential-transformer controls, not a facsimile reconstruction.
  const { params } = usePatentPhysics("us-593138-tesla-coil");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const primaryCap = params.primaryCap ?? 45;
  const toploadCapacitancePf = params.toploadCapacitancePf ?? 35;
  const sparkGapDistanceMm = params.sparkGapDistanceMm ?? 12;
  const inputVoltageKv = params.inputVoltageKv ?? 15;
  const couplingK = params.couplingK ?? 0.18;
  const secondaryTurns = params.secondaryTurns ?? 850;
  const [showLightningStreamers, _setShowLightningStreamers] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Interpretive coupled-LC host-model calculations.
  const coilPhysics = FrankenSimEngine.stepTeslaCoilFromControls({
    primaryCap,
    toploadCapacitancePf,
    inputVoltageKv,
    sparkGapDistanceMm,
    couplingK,
    secondaryTurns,
  });
  const resonantFreqKhz = coilPhysics.resonantFreqKhz;
  const secondaryVoltageMv = coilPhysics.secondaryPotentialMv.toFixed(2);
  const streamerLengthInches = coilPhysics.streamerLengthInches.toFixed(1);
  const streamerLengthMeters = coilPhysics.streamerLengthMeters.toFixed(2);

  useFrankenSimPhysics("us-593138-tesla-coil", {
    domain: "electromagnetics_flux",
    refusal: { isRefused: false },
    em: {
      frequencyHz: resonantFreqKhz * 1000,
      magneticFluxDensityTesla: 0,
      electricFieldVpm: Number(secondaryVoltageMv) * 1e6,
      phaseAngleRad: 0,
      inductanceHenry: 0,
      capacitanceFarad: 0,
      currentAmperes: 0,
      voltageVolts: inputVoltageKv * 1000,
      powerFactor: 0,
      efficiencyPct: 0,
      synchronousRpm: 0,
      slipFraction: 0,
      rotorRpm: 0,
      shaftPowerWatts: 0,
      electricalInputWatts: 0,
    },
  });

  const live = useLiveSimParams({
    resonantFreqKhz,
    sparkGapDistanceMm,
    inputVoltageKv,
    couplingK,
    showLightningStreamers,
    secondaryVoltageMv,
    streamerLengthInches: coilPhysics.streamerLengthInches,
    streamerStudioLength: coilPhysics.streamerStudioLength,
    sparkRateHz: params.sparkRateHz ?? 120,
  });

  const controlsRef = useRef<StudioContext["controls"] | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    switch (preset) {
      case "iso":
        camera.position.set(11, 9, 14);
        controls.target.set(0, 0, 0);
        break;
      case "toroid_breakout":
        camera.position.set(0, 4.2, 4.5);
        controls.target.set(0, 2.5, 0);
        break;
      case "primary_spiral":
        camera.position.set(0, -1.2, 5.5);
        controls.target.set(0, -2.4, 0);
        break;
      case "spark_gap":
        camera.position.set(2.8, -2.2, 3.8);
        controls.target.set(2.4, -3.2, 0);
        break;
      case "top":
        camera.position.set(0, 13.0, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  // Audio synthesis
  useEffect(() => {
    if (isPlayingAudio) {
      soundEngine.playContinuousTone(resonantFreqKhz * 2.0, "sawtooth", 0.035);
    } else {
      soundEngine.stopContinuousTone();
    }
    return () => {
      soundEngine.stopContinuousTone();
    };
  }, [isPlayingAudio, resonantFreqKhz]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [11, 9, 14],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    const model = buildTeslaCoilModel();
    scene.add(model.root);

    let reqId: number;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = 1 / 60;
      const p = live.current;

      model.updateKinematics(
        delta,
        p.showLightningStreamers,
        p.streamerStudioLength,
        Number(p.secondaryVoltageMv),
      );

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      model.dispose();
      studio.dispose();
    };
  }, [live]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      {/* 3D WebGL Canvas Viewport */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Live HUD Telemetry Overlay */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-col gap-1.5 sm:gap-2 pointer-events-none max-w-[calc(100%-8rem)] sm:max-w-md transition-opacity duration-200">
            <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md p-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
              <div className="text-[10px] sm:text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 animate-pulse" />
                Interpretive Transformer Telemetry
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 sm:gap-y-1 mt-1 text-[10px] sm:text-xs font-sans">
                <div>
                  <span className="text-ink-600 dark:text-ink-400">
                    <HudText text="Freq ($f_0$):" />
                  </span>{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {resonantFreqKhz} kHz{" "}
                    <HudText
                      text={`($k = ${couplingK.toFixed(2)}$, $C_t = ${toploadCapacitancePf}$ pF)`}
                    />
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Output:</span>{" "}
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {secondaryVoltageMv} MV Potential
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Arc:</span>{" "}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {streamerLengthInches} In ({streamerLengthMeters} m)
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Input:</span>{" "}
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {inputVoltageKv} kV ({sparkGapDistanceMm} mm)
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 items-center gap-2 max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />
              <span className="truncate">
                Nikola Tesla (US 593,138) — Electrical Transformer (1897)
              </span>
            </div>
          </div>
        )}

        {/* Top Right Tool Bar (Toggle UI, Audio, Pins, Reset) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
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
            aria-label="Toggle test tone"
            type="button"
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={isPlayingAudio ? "Mute Tesla Audio" : "Enable Tesla Resonant Tone"}
          >
            {isPlayingAudio ? (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
          <button
            aria-label={showCalloutPins ? "Hide annotation pins" : "Show annotation pins"}
            type="button"
            onClick={() => setShowCalloutPins(!showCalloutPins)}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
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
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Camera Views Bar */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-1.5rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> View:
            </span>
            {(
              [
                ["iso", "Isometric"],
                ["toroid_breakout", "Toroid"],
                ["primary_spiral", "Spiral Primary"],
                ["spark_gap", "Rotary Gap"],
                ["top", "Overhead"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => applyCameraPreset(id)}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-sans whitespace-nowrap shrink-0 transition-colors ${
                  activeCamera === id
                    ? "bg-amber-700 dark:bg-amber-600 text-white font-semibold shadow-xs"
                    : "text-ink-700 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
