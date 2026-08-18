"use client";

import {
  Camera,
  Eye,
  EyeOff,
  Layers,
  RotateCcw,
  Shield,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import { HudText } from "@/components/ui/LatexRenderer";
import { FrankenSimEngine } from "@/physics/engine";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildFermiReactorModel, updateFermiReactorKinematics } from "./fermiReactorModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "control_rods" | "graphite_core" | "gantry" | "detector" | "top";

export function FermiReactor3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Nuclear Reactor Kinetics State Controls
  const { params } = usePatentPhysics("us-2708656-fermi-reactor");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const controlRodWithdrawalPct = params.rodWithdrawal ?? 83.5;
  const moderatorPurityPct = params.moderatorPurity ?? 99.5;
  const fuelEnrichmentPct = params.fuelEnrichmentPct ?? 0.72;
  const [showNeutronCascade, _setShowNeutronCascade] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  // Four-Factor Nuclear Physics Calculations
  const reactorKinetics = FrankenSimEngine.stepFermiReactor(
    controlRodWithdrawalPct,
    moderatorPurityPct,
    fuelEnrichmentPct,
  );

  const kEff = reactorKinetics.kEffective.toFixed(3);
  const isSupercritical = Number(kEff) > 1.002;
  const isCritical = Number(kEff) >= 0.998 && Number(kEff) <= 1.002;
  const reactorPowerWatts = reactorKinetics.thermalPowerWatts;
  const reactivityDollars = reactorKinetics.reactivityDollars.toFixed(2);

  useFrankenSimPhysics("us-2708656-fermi-reactor", {
    domain: "nuclear_kinetics",
    refusal: { isRefused: false },
    nuclear: reactorKinetics,
  });

  const live = useLiveSimParams({
    controlRodWithdrawalPct,
    moderatorPurityPct,
    showNeutronCascade,
    isCutaway,
    kEff,
    geigerIntervalMs: reactorKinetics.geigerIntervalMs,
    isAudioMuted,
    neutronDisplaySpeed: reactorKinetics.neutronDisplaySpeed,
    rodStudioY: reactorKinetics.rodStudioY,
    fuelGlowIntensity: reactorKinetics.fuelGlowIntensity,
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
        camera.position.set(13, 10, 16);
        controls.target.set(0, 0, 0);
        break;
      case "control_rods":
        camera.position.set(0, 3.2, 4.2);
        controls.target.set(0, 1.0, 0);
        break;
      case "graphite_core":
        camera.position.set(0, -0.6, 4.5);
        controls.target.set(0, -1.2, 0);
        break;
      case "gantry":
        camera.position.set(0, 7.5, 6.0);
        controls.target.set(0, 4.0, 0);
        break;
      case "detector":
        camera.position.set(5.5, 0.5, 3.2);
        controls.target.set(2.4, -0.5, 0);
        break;
      case "top":
        camera.position.set(0, 11.0, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const toggleSound = () => {
    toggleEngine(() => {
      soundEngine.playSwitchClick();
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [13, 10, 16],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    const model = buildFermiReactorModel();
    scene.add(model.root);

    let reqId: number;
    let geigerClickTimer = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = 1 / 60;
      const p = live.current;

      updateFermiReactorKinematics(
        model,
        delta,
        p.controlRodWithdrawalPct,
        Number(p.kEff),
        p.moderatorPurityPct,
        p.neutronDisplaySpeed,
        p.rodStudioY,
        p.fuelGlowIntensity,
        p.showNeutronCascade,
        p.isCutaway,
      );

      if (p.showNeutronCascade) {
        geigerClickTimer += delta;
        const clickInterval = Math.max(0.05, p.geigerIntervalMs / 1000);
        if (geigerClickTimer > clickInterval) {
          geigerClickTimer = 0;
          if (!p.isAudioMuted) {
            soundEngine.playSwitchClick();
          }
        }
      }

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
                <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 animate-pulse" />
                Neutronic Criticality Telemetry
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 sm:gap-y-1 mt-1 text-[10px] sm:text-xs font-sans">
                <div>
                  <span className="text-ink-600 dark:text-ink-400">
                    <HudText text="Effective $k$:" />
                  </span>{" "}
                  <span
                    className={`font-bold ${
                      isCritical
                        ? "text-emerald-600 dark:text-emerald-400"
                        : isSupercritical
                          ? "text-purple-600 dark:text-purple-400"
                          : "text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {kEff} ({isCritical ? "Crit" : isSupercritical ? "Super" : "Sub"})
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Reactivity:</span>{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {reactivityDollars} $
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Power:</span>{" "}
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {reactorPowerWatts} W Th
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">ZIP Height:</span>{" "}
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {controlRodWithdrawalPct}% Withdrawn
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 items-center gap-2 max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse shrink-0" />
              <span className="truncate">
                Enrico Fermi & Leo Szilard (US 2,708,656) — Neutronic Reactor (1942)
              </span>
            </div>
          </div>
        )}

        {/* Top Right Tool Bar (Toggle UI, Audio, Pins, Cutaway, Reset) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Switch to Solid Graphite" : "Switch to Core Cutaway"}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
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
            aria-label={isAudioMuted ? "Unmute simulation audio" : "Mute simulation audio"}
            type="button"
            onClick={toggleSound}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={isAudioMuted ? "Enable Sound Synthesis" : "Mute Sound"}
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
                ["control_rods", "Cadmium Rods"],
                ["graphite_core", "Graphite Core"],
                ["gantry", "Timber Rigging"],
                ["detector", "BF3 Detector"],
                ["top", "Core Grid"],
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
