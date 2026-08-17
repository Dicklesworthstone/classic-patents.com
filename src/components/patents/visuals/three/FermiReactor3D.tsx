"use client";

import {
  Camera,
  Eye,
  EyeOff,
  Flame,
  RotateCcw,
  Shield,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { HudText } from "@/components/ui/LatexRenderer";
import { soundEngine } from "@/utils/soundEngine";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "control_rods" | "graphite_core" | "gantry" | "top";

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  rodPct: number;
  moderatorPct: number;
  enrichmentPct: number;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: "cp1_1942_criticality",
    name: "Dec 2, 1942 CP-1 First Criticality",
    desc: "Enrico Fermi commands George Weil to withdraw ZIP rod to 65%, reaching self-sustaining chain reaction (k_eff = 1.006).",
    rodPct: 65,
    moderatorPct: 99.9,
    enrichmentPct: 0.72,
  },
  {
    id: "scram_shutdown",
    name: "Full SCRAM Emergency Insertion",
    desc: "All cadmium safety control rods dropped into the graphite core, absorbing thermal neutrons and terminating criticality.",
    rodPct: 0,
    moderatorPct: 99.9,
    enrichmentPct: 0.72,
  },
  {
    id: "delayed_critical",
    name: "Delayed-Neutron Steady State",
    desc: "Exact critical balance (k_eff = 1.000) governed by the 0.65% delayed neutron fraction from precursor fission decays.",
    rodPct: 58,
    moderatorPct: 99.9,
    enrichmentPct: 0.72,
  },
  {
    id: "impure_graphite",
    name: "Boron-Contaminated Graphite",
    desc: "Prior-art impure moderator with high thermal neutron capture cross-section preventing chain reaction buildup.",
    rodPct: 30,
    moderatorPct: 98.5,
    enrichmentPct: 0.72,
  },
];

export function FermiReactor3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Nuclear Reactor Kinetics State Controls
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [controlRodWithdrawalPct, setControlRodWithdrawalPct] = useState<number>(65); // 0 to 100%
  const [moderatorPurityPct, setModeratorPurityPct] = useState<number>(99.9); // 95 to 99.99%
  const [fuelEnrichmentPct, setFuelEnrichmentPct] = useState<number>(0.72); // 0.72% natural U
  const [showNeutronCascade, setShowNeutronCascade] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  // Four-Factor Nuclear Physics Calculations
  // k_eff = eta * epsilon * p * f * P_NL
  const kEff = (
    1.32 *
    (fuelEnrichmentPct / 0.72) ** 0.5 *
    (moderatorPurityPct / 100) ** 2 *
    (0.65 + (controlRodWithdrawalPct / 100) * 0.42)
  ).toFixed(3);
  const isSupercritical = Number(kEff) > 1.002;
  const isCritical = Number(kEff) >= 0.998 && Number(kEff) <= 1.002;
  const reactorPowerWatts = isSupercritical
    ? Math.round(500 * (Number(kEff) / 1.002) ** 4)
    : isCritical
      ? 200
      : Math.round(20 * (Number(kEff) / 0.99));
  const reactivityDollars = ((Number(kEff) - 1.0) / Number(kEff) / 0.0065).toFixed(2);

  const live = useLiveSimParams({
    controlRodWithdrawalPct,
    showNeutronCascade,
    kEff,
    isAudioMuted,
  });

  const controlsRef = useRef<any>(null);
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
      case "top":
        camera.position.set(0, 11.0, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const applyScenario = (s: ScenarioPreset) => {
    setControlRodWithdrawalPct(s.rodPct);
    setModeratorPurityPct(s.moderatorPct);
    setFuelEnrichmentPct(s.enrichmentPct);
    if (!isAudioMuted) {
      soundEngine.playSwitchClick();
    }
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

    // --- PBR MATERIALS ---
    const graphiteMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.6,
    });

    const uraniumFuelMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.3,
      metalness: 0.85,
    });

    const cadmiumRodMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.15,
      metalness: 0.95,
    });

    const timberSupportMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.6,
      metalness: 0.1,
    });

    // --- 3D FERMI-SZILARD CHICAGO PILE-1 ASSEMBLY ---
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Multi-Tier Pine & Douglas Fir Heavy Timber Scaffold
    const timberGroup = new THREE.Group();
    timberGroup.position.y = -3.4;

    for (let b = 0; b < 6; b++) {
      const beamX = new THREE.Mesh(new THREE.BoxGeometry(11.0, 0.45, 0.45), timberSupportMat);
      beamX.position.set(0, 0, -4.5 + b * 1.8);
      timberGroup.add(beamX);

      const beamZ = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 11.0), timberSupportMat);
      beamZ.position.set(-4.5 + b * 1.8, 0.45, 0);
      timberGroup.add(beamZ);
    }

    [
      [-5.0, -5.0],
      [5.0, -5.0],
      [-5.0, 5.0],
      [5.0, 5.0],
    ].forEach(([cx, cz]) => {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.6, 6.2, 0.6), timberSupportMat);
      post.position.set(cx, 3.1, cz);
      timberGroup.add(post);
    });

    const gantryBeam = new THREE.Mesh(new THREE.BoxGeometry(11.0, 0.5, 0.5), timberSupportMat);
    gantryBeam.position.set(0, 6.2, 0);
    timberGroup.add(gantryBeam);

    [-0.8, 0.8].forEach((px) => {
      const pulley = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.35, 0.15, 16),
        new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85 }),
      );
      pulley.rotation.z = Math.PI / 2;
      pulley.position.set(px, 5.8, 0);
      timberGroup.add(pulley);
    });

    coreGroup.add(timberGroup);

    // Graphite Moderator Brick Matrix
    const pileGroup = new THREE.Group();
    const layerSize = 5;
    const blockSize = 1.4;

    for (let x = 0; x < layerSize; x++) {
      for (let z = 0; z < layerSize; z++) {
        for (let y = 0; y < 5; y++) {
          const block = new THREE.Mesh(
            new THREE.BoxGeometry(blockSize * 0.94, 0.68, blockSize * 0.94),
            graphiteMat,
          );
          block.position.set((x - 2) * blockSize, -2.6 + y * 0.72, (z - 2) * blockSize);
          block.castShadow = true;
          block.receiveShadow = true;
          pileGroup.add(block);
        }
      }
    }
    coreGroup.add(pileGroup);

    // Embedded Cylindrical Uranium Fuel Lumps & Oxide Cylinders
    const fuelGroup = new THREE.Group();
    for (let x = -1; x <= 1; x++) {
      for (let z = -1; z <= 1; z++) {
        const fuel = new THREE.Mesh(
          new THREE.CylinderGeometry(0.24, 0.24, 3.2, 16),
          uraniumFuelMat,
        );
        fuel.position.set(x * blockSize * 1.5, -1.2, z * blockSize * 1.5);
        fuel.castShadow = true;
        fuelGroup.add(fuel);
      }
    }
    coreGroup.add(fuelGroup);

    // Movable Cadmium Control Rods
    const rodGroup = new THREE.Group();
    const rod1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 5.2, 16), cadmiumRodMat);
    rod1.position.set(-0.8, 0.4, 0);
    rod1.castShadow = true;
    const rod2 = rod1.clone();
    rod2.position.set(0.8, 0.4, 0);
    rodGroup.add(rod1);
    rodGroup.add(rod2);
    coreGroup.add(rodGroup);

    // Boron Trifluoride (BF3) Proportional Neutron Counter Chamber
    const bf3Detector = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 1.8, 16),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95 }),
    );
    bf3Detector.position.set(3.8, -0.6, 3.8);
    bf3Detector.castShadow = true;
    coreGroup.add(bf3Detector);

    // --- GLOWING THERMAL NEUTRON DIFFUSION CASCADE ---
    const neutronCount = 300;
    const neutronGeo = new THREE.BufferGeometry();
    const neutronPos = new Float32Array(neutronCount * 3);
    const neutronColors = new Float32Array(neutronCount * 3);

    const glowTex = createGlowPointTexture();

    for (let i = 0; i < neutronCount; i++) {
      const idx = i * 3;
      neutronPos[idx] = (Math.random() - 0.5) * 6.5;
      neutronPos[idx + 1] = -2.6 + Math.random() * 3.2;
      neutronPos[idx + 2] = (Math.random() - 0.5) * 6.5;

      neutronColors[idx] = 0.2;
      neutronColors[idx + 1] = 0.8;
      neutronColors[idx + 2] = 1.0;
    }

    neutronGeo.setAttribute("position", new THREE.BufferAttribute(neutronPos, 3));
    neutronGeo.setAttribute("color", new THREE.BufferAttribute(neutronColors, 3));

    const neutronPoints = new THREE.Points(
      neutronGeo,
      new THREE.PointsMaterial({
        size: 0.45,
        map: glowTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    coreGroup.add(neutronPoints);

    // --- RENDER LOOP & REAL-TIME NEUTRON KINETICS ---
    let reqId: number;
    const clock = new THREE.Clock();
    let geigerClickTimer = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = live.current;

      const targetRodY = -0.5 + (p.controlRodWithdrawalPct / 100) * 3.2;
      rodGroup.position.y += (targetRodY - rodGroup.position.y) * 0.1;

      if (p.showNeutronCascade) {
        const nPos = neutronPos;
        const speed = (Number(p.kEff) / 1.0) * 4.0 * delta;

        for (let i = 0; i < neutronCount; i++) {
          const idx = i * 3;
          nPos[idx] += (Math.random() - 0.5) * speed;
          nPos[idx + 1] += (Math.random() - 0.5) * speed;
          nPos[idx + 2] += (Math.random() - 0.5) * speed;

          if (
            Math.abs(nPos[idx]) > 3.5 ||
            nPos[idx + 1] < -3.0 ||
            nPos[idx + 1] > 1.5 ||
            Math.abs(nPos[idx + 2]) > 3.5
          ) {
            nPos[idx] = (Math.random() - 0.5) * 2.5;
            nPos[idx + 1] = -1.5 + (Math.random() - 0.5) * 1.5;
            nPos[idx + 2] = (Math.random() - 0.5) * 2.5;
          }
        }
        neutronGeo.attributes.position.needsUpdate = true;
        neutronPoints.visible = true;

        // Geiger counter acoustic feedback proportional to k_eff
        geigerClickTimer += delta;
        const clickInterval = Math.max(0.08, 0.4 / Number(p.kEff) ** 2);
        if (geigerClickTimer > clickInterval) {
          geigerClickTimer = 0;
          if (!p.isAudioMuted && Math.random() < 0.6) {
            soundEngine.playSwitchClick();
          }
        }
      } else {
        neutronPoints.visible = false;
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

      {/* Interactive Controls & Scenario Bar */}
      <div className="p-4 sm:p-5 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 space-y-4">
        {/* Scenario Presets */}
        <div className="space-y-1.5">
          <div className="text-xs font-sans font-bold text-ink-700 dark:text-ink-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Historical Nuclear Criticality
            Presets:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => applyScenario(s)}
                className="p-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 bg-white/70 dark:bg-ink-950/70 hover:bg-parchment-50 dark:hover:bg-ink-800 text-left transition-colors group"
              >
                <div className="text-xs font-serif font-bold text-ink-900 dark:text-parchment-100 group-hover:text-amber-700 dark:group-hover:text-amber-400">
                  {s.name}
                </div>
                <div className="text-[10px] font-sans text-ink-500 dark:text-ink-400 line-clamp-2 mt-0.5">
                  <HudText text={s.desc} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Cadmium Control Rods */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="font-semibold text-ink-800 dark:text-parchment-200">
                Cadmium ZIP Rod Height:
              </span>
              <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">
                {controlRodWithdrawalPct}% Withdrawn
              </span>
            </div>
            <input
              type="range"
              aria-label="Cadmium ZIP Rod Height"
              min="0"
              max="100"
              step="1"
              value={controlRodWithdrawalPct}
              onChange={(e) => setControlRodWithdrawalPct(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
              Thermal neutron poison absorption cross section
            </span>
          </div>

          {/* Moderator Purity */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="font-semibold text-ink-800 dark:text-parchment-200">
                AGOT Graphite Purity:
              </span>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                {moderatorPurityPct.toFixed(2)}%
              </span>
            </div>
            <input
              type="range"
              aria-label="AGOT Graphite Purity"
              min="95.0"
              max="99.99"
              step="0.05"
              value={moderatorPurityPct}
              onChange={(e) => setModeratorPurityPct(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
              Minimizes boron impurity parasitic capture
            </span>
          </div>

          {/* Neutron Cloud Toggle */}
          <div className="flex flex-col justify-end space-y-1.5">
            <button
              type="button"
              onClick={() => setShowNeutronCascade(!showNeutronCascade)}
              className={`w-full py-3 px-4 rounded-xl font-sans font-bold text-sm transition-colors shadow-sm flex items-center justify-center gap-2 ${
                showNeutronCascade
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                  : "bg-amber-600 hover:bg-amber-700 text-white shadow-md"
              }`}
            >
              <Flame className="w-4 h-4" />
              {showNeutronCascade ? "Neutron Flux VISIBLE" : "Neutron Flux HIDDEN"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
