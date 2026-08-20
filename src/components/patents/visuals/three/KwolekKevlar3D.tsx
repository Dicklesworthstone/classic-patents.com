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
import { stepKevlarContinuum } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildKwolekKevlarModel, updateKwolekKevlarKinematics } from "./kwolekKevlarModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "ring" | "hbonds" | "spinneret" | "impact" | "top";

export function KwolekKevlar3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Polymer Chemistry State Controls
  const { params } = usePatentPhysics("us-3671542-kwolek-kevlar");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const drawRatio = params.drawRatio ?? 6.5;
  const polymerConcentrationPct = params.polymerConcentrationPct ?? 18.5;
  const temperatureCelsius = params.temperatureCelsius ?? 85;
  const showHydrogenBonds = params.showHydrogenBonds !== 0;
  const isImpactTesting = params.isImpactTesting !== 0;
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound } = usePatentAudio();

  const kevlar = stepKevlarContinuum(
    drawRatio,
    params.impactVelocity ?? 450,
    params.appliedTension ?? 30,
    temperatureCelsius,
  );
  const isNematicLCP = polymerConcentrationPct >= 12.0 && temperatureCelsius < 105;
  const tensileStrengthGpa = kevlar.tensileStrengthGpa.toFixed(2);
  const modulusGpa = kevlar.elasticModulusGpa.toFixed(0);

  const live = useLiveSimParams({
    temperatureCelsius,
    showHydrogenBonds,
    isImpactTesting,
    isNematicLCP,
    isCutaway,
    isAudioMuted,
    elasticModulusGpa: kevlar.elasticModulusGpa,
    tensileStressMpa: kevlar.tensileStressMpa,
    impactVelocityMps: params.impactVelocity ?? 450,
    bulletDisplaySpeed: kevlar.bulletDisplaySpeed,
    impactDisplayMs: kevlar.impactDisplayMs,
    chainWiggleOmegaRadPerS: kevlar.chainWiggleOmegaRadPerS,
    thermalDisorder: kevlar.thermalDisorder,
    shearAlignment: kevlar.shearAlignment,
    chainWiggleAmp: kevlar.chainWiggleAmp,
    chainWobbleAmp: kevlar.chainWobbleAmp,
    chainWobbleOmega: kevlar.chainWobbleOmega,
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
        controls.setView([11, 8, 14], [0, 0, 0]);
        break;
      case "ring":
        controls.setView([0, 1.4, 3.8], [0, 0, 0]);
        break;
      case "hbonds":
        controls.setView([0, 5.5, 0.1], [0, 0, 0]);
        break;
      case "spinneret":
        controls.setView([-5.5, 2.0, 4.0], [-5.0, 0, 0]);
        break;
      case "impact":
        controls.setView([4.0, 1.5, 5.0], [1.5, 0, 0]);
        break;
      case "top":
        controls.setView([0, 11.5, 0.1], [0, 0, 0]);
        break;
    }
  };

  const handleToggleSound = () => {
    toggleSound(() => {
      soundEngine.playElastomerSnap(1.2);
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [11, 8, 14],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    const model = buildKwolekKevlarModel();
    scene.add(model.root);

    let reqId: number;
    let elapsed = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = 1 / 60;
      elapsed += delta;
      const p = live.current;

      const wiggle = p.chainWiggleOmegaRadPerS;

      for (let i = 0; i < model.chains.length; i++) {
        const item = model.chains[i];
        if (p.isNematicLCP) {
          item.group.rotation.z = Math.sin(elapsed * wiggle + i) * p.chainWiggleAmp;
          item.group.position.y =
            item.baseY + Math.sin(elapsed * p.chainWobbleOmega + i) * p.chainWobbleAmp;
        }
      }

      updateKwolekKevlarKinematics(
        model,
        delta,
        p.isImpactTesting,
        p.showHydrogenBonds,
        p.shearAlignment,
        p.bulletDisplaySpeed,
        p.isCutaway,
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
                <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 animate-pulse" />
                Liquid Crystal Aramid Telemetry
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 sm:gap-y-1 mt-1 text-[10px] sm:text-xs font-sans">
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Strength:</span>{" "}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {tensileStrengthGpa} GPa ({isNematicLCP ? "≈5× steel" : "isotropic"})
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Modulus:</span>{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {modulusGpa} GPa · {kevlar.alignmentPct}% align
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Phase:</span>{" "}
                  <span
                    className={`font-bold ${
                      isNematicLCP
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {isNematicLCP ? "Nematic LCP" : "Isotropic"}
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Spec Strength:</span>{" "}
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    2.5×10⁶ N·m/kg
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 items-center gap-2 max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />
              <span className="truncate">Stephanie Kwolek (US 3,819,587) — Kevlar (1971)</span>
            </div>
          </div>
        )}

        {/* Top Right Tool Bar (Toggle UI, Audio, Pins, Cutaway, Reset) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setIsCutaway(!isCutaway)}
            title={isCutaway ? "Switch to Solid Spinneret" : "Switch to Spinneret Cutaway"}
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
            aria-label={isAudioMuted ? "Enable Sound Synthesis" : "Mute Sound"}
            type="button"
            onClick={handleToggleSound}
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
                ["ring", "Benzene Ring"],
                ["hbonds", "H-Bonds Sheet"],
                ["spinneret", "Spinneret Die"],
                ["impact", "Ballistic Impact"],
                ["top", "Top View"],
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
