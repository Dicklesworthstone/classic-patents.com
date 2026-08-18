"use client";

import { Camera, Cpu, Eye, EyeOff, RotateCcw, Sparkles, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { HudText } from "@/components/ui/LatexRenderer";
import { stepNoyceIC } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { createLcg } from "@/utils/lcg";
import { soundEngine } from "@/utils/soundEngine";
import {
  createGlowPointTexture,
  createThreeStudioScene,
  type StudioContext,
} from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

const lcg = createLcg(1256);

type CameraPreset = "iso" | "metallization_layer" | "oxide_dielectric" | "pn_junctions" | "top";

export function NoycePlanarIC3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Microelectronics State Controls
  const { params } = usePatentPhysics("us-2981877-noyce-ic");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const clockFrequencyMhz = params.clockFrequencyMhz ?? 10;
  const [activeLayer, _setActiveLayer] = useState<"all" | "silicon" | "oxide" | "metal">("all");
  const [showLogicSignals, _setShowLogicSignals] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const noyce = stepNoyceIC({
    reverseBias: params.reverseBias ?? 5,
    oxideThickness: params.oxideThickness ?? 0.5,
    clockFrequencyMhz,
  });
  const oxideLayerThicknessNm = noyce.oxideThicknessNm;
  const gateCapacitancePf = noyce.junctionCapPfPerMm2;
  const gatePropagationDelayPs = noyce.propDelayPs;
  const maxClockGhz = noyce.maxClockGhz.toFixed(2);

  const live = useLiveSimParams({
    clockFrequencyMhz,
    oxideLayerThicknessNm,
    activeLayer,
    showLogicSignals,
    clockPeriodNs: noyce.clockPeriodNs,
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
        camera.position.set(10, 8, 12);
        controls.target.set(0, 0, 0);
        break;
      case "metallization_layer":
        camera.position.set(0, 3.5, 4.5);
        controls.target.set(0, 0.6, 0);
        break;
      case "oxide_dielectric":
        camera.position.set(0, 2.2, 5.0);
        controls.target.set(0, 0.3, 0);
        break;
      case "pn_junctions":
        camera.position.set(-2.2, 1.8, 3.5);
        controls.target.set(-1.0, 0.1, 0);
        break;
      case "top":
        camera.position.set(0, 11.0, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  // Audio Clock Generator
  useEffect(() => {
    if (isPlayingAudio) {
      soundEngine.playContinuousTone(200 + clockFrequencyMhz * 15, "square", 0.02);
    } else {
      soundEngine.stopContinuousTone();
    }
    return () => {
      soundEngine.stopContinuousTone();
    };
  }, [isPlayingAudio, clockFrequencyMhz]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [10, 8, 12],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // --- PBR MATERIALS ---
    const siliconSubstrateMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.25,
      metalness: 0.85,
    });

    const nDiffusedMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.3,
      metalness: 0.75,
    });

    const siliconDioxideMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transmission: 0.82,
      opacity: 0.85,
      transparent: true,
      roughness: 0.05,
      ior: 1.46,
    });

    const aluminumMetalMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.08,
      metalness: 0.98,
    });

    const goldBondWireMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.15,
      metalness: 0.95,
    });

    // --- 3D MONOLITHIC PLANAR IC CHIP ASSEMBLY ---
    const chipGroup = new THREE.Group();
    scene.add(chipGroup);

    // Ceramic DIP Package Header
    const ceramicBase = new THREE.Mesh(
      new THREE.BoxGeometry(12.4, 0.6, 12.4),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35, metalness: 0.1 }),
    );
    ceramicBase.position.y = -1.0;
    ceramicBase.receiveShadow = true;
    chipGroup.add(ceramicBase);

    // Gold Die-Attach Cavity Pocket
    const goldPocket = new THREE.Mesh(new THREE.BoxGeometry(8.6, 0.08, 8.6), goldBondWireMat);
    goldPocket.position.y = -0.68;
    chipGroup.add(goldPocket);

    // 14 Gold-Plated Leadframe Fingers
    for (let f = 0; f < 7; f++) {
      const fX = -4.2 + f * 1.4;
      [-5.5, 5.5].forEach((fZ) => {
        const lead = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.12, 1.8), goldBondWireMat);
        lead.position.set(fX, -0.65, fZ);
        chipGroup.add(lead);
      });
    }

    // 1. P-Type Silicon Substrate
    const substrateGeo = new THREE.BoxGeometry(8.0, 0.8, 8.0);
    const substrateMesh = new THREE.Mesh(substrateGeo, siliconSubstrateMat);
    substrateMesh.position.y = -0.3;
    substrateMesh.castShadow = true;
    substrateMesh.receiveShadow = true;
    chipGroup.add(substrateMesh);

    // 2. N-Type Diffused Wells
    const nWellsGroup = new THREE.Group();
    for (let x = -2.2; x <= 2.2; x += 2.2) {
      for (let z = -2.2; z <= 2.2; z += 2.2) {
        const well = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.18, 1.5), nDiffusedMat);
        well.position.set(x, 0.12, z);
        nWellsGroup.add(well);
      }
    }
    chipGroup.add(nWellsGroup);

    // 3. SiO2 Passivation Layer
    const oxideLayer = new THREE.Mesh(new THREE.BoxGeometry(7.8, 0.35, 7.8), siliconDioxideMat);
    oxideLayer.position.y = 0.35;
    chipGroup.add(oxideLayer);

    // 4. Aluminum Metallization Traces
    const metalGroup = new THREE.Group();

    const trace1 = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.12, 0.45), aluminumMetalMat);
    trace1.position.set(0, 0.58, -1.8);
    trace1.castShadow = true;
    const trace2 = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.12, 0.45), aluminumMetalMat);
    trace2.position.set(0, 0.58, 1.8);
    trace2.castShadow = true;
    metalGroup.add(trace1, trace2);

    for (let x = -2.2; x <= 2.2; x += 2.2) {
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.12, 4.0), aluminumMetalMat);
      bridge.position.set(x, 0.58, 0);
      bridge.castShadow = true;
      metalGroup.add(bridge);
    }
    chipGroup.add(metalGroup);

    // --- GLOWING LOGIC SIGNAL PULSES ---
    const signalCount = 60;
    const signalGeo = new THREE.BufferGeometry();
    const signalPos = new Float32Array(signalCount * 3);
    const glowTex = createGlowPointTexture();

    for (let i = 0; i < signalCount; i++) {
      const idx = i * 3;
      signalPos[idx] = (lcg() - 0.5) * 6.5;
      signalPos[idx + 1] = 0.65;
      signalPos[idx + 2] = (lcg() - 0.5) * 6.5;
    }
    signalGeo.setAttribute("position", new THREE.BufferAttribute(signalPos, 3));

    const signalPoints = new THREE.Points(
      signalGeo,
      new THREE.PointsMaterial({
        size: 0.28,
        map: glowTex,
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    chipGroup.add(signalPoints);

    // --- RENDER LOOP & REAL-TIME LOGIC SIGNAL PROPAGATION ---
    let reqId: number;
    let _renderedSteps = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      _renderedSteps += 1;
      const delta = 1 / 60;
      const p = live.current;

      substrateMesh.visible = p.activeLayer === "all" || p.activeLayer === "silicon";
      nWellsGroup.visible = p.activeLayer === "all" || p.activeLayer === "silicon";
      oxideLayer.visible = p.activeLayer === "all" || p.activeLayer === "oxide";
      metalGroup.visible = p.activeLayer === "all" || p.activeLayer === "metal";

      if (p.showLogicSignals) {
        signalPoints.visible = true;
        const sPos = signalPos;
        const speed = (100 / Math.max(10, p.clockPeriodNs ?? 100)) * 18.0 * delta;

        for (let i = 0; i < signalCount; i++) {
          const idx = i * 3;
          sPos[idx] += speed;
          if (sPos[idx] > 3.4) {
            sPos[idx] = -3.4;
          }
        }
        signalGeo.attributes.position.needsUpdate = true;
      } else {
        signalPoints.visible = false;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
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
                <Cpu className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 animate-pulse" />
                Planar Monolithic IC Telemetry
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 sm:gap-y-1 mt-1 text-[10px] sm:text-xs font-sans">
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Clock:</span>{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {clockFrequencyMhz} MHz (Max {maxClockGhz} GHz)
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">
                    <HudText text="Oxide Cap ($C_{ox}$):" />
                  </span>{" "}
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {gateCapacitancePf.toFixed(2)} pF ({oxideLayerThicknessNm} nm)
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Gate Delay:</span>{" "}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {gatePropagationDelayPs} ps
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Depletion:</span>{" "}
                  <span className="font-bold text-sky-600 dark:text-sky-400">
                    {noyce.depletionWidthUm} µm · {noyce.breakdownMarginV} V margin
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Interconnect:</span>{" "}
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    Vapor Al (0 flying wires)
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 items-center gap-2 max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse shrink-0" />
              <span className="truncate">Robert N. Noyce (US 2,981,877) — Planar IC (1959)</span>
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
            title={isPlayingAudio ? "Mute Clock Audio" : "Enable Square-Wave Clock Tone"}
          >
            {isPlayingAudio ? (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
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
                ["metallization_layer", "Al Metal"],
                ["oxide_dielectric", "SiO₂ Glass"],
                ["pn_junctions", "PN Junctions"],
                ["top", "Die Surface"],
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
