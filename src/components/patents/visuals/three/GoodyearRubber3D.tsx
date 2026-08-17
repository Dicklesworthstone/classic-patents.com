"use client";

import {
  Camera,
  Eye,
  EyeOff,
  Layers,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { HudText } from "@/components/ui/LatexRenderer";
import { FrankenSimEngine } from "@/physics/engine";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "chains" | "bridges" | "clamps" | "top";

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  sulfurPct: number;
  tempC: number;
  stretch: number;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: "goodyear_1844",
    name: "1844 Goodyear Vulcanized Rubber (US 3,633)",
    desc: "Charles Goodyear's historic breakthrough: Sulfur cross-links creating thermostable polymer network resilient from -40°C to +140°C.",
    sulfurPct: 4.5,
    tempC: 140,
    stretch: 1.8,
  },
  {
    id: "raw_gum_rubber",
    name: "Unvulcanized Raw Natural Gum (Prior Art)",
    desc: "Uncrosslinked polyisoprene chains sliding past each other; turns sticky in summer heat (>45°C) and brittle in cold (<0°C).",
    sulfurPct: 0.0,
    tempC: 45,
    stretch: 1.2,
  },
  {
    id: "high_stretch",
    name: "High Tensile Elongation Test",
    desc: "Polymer chains uncoiling under 3.5× stretch; cross-link nodes pull taut, illustrating entropic elasticity (negative thermal expansion).",
    sulfurPct: 5.0,
    tempC: 120,
    stretch: 3.5,
  },
  {
    id: "ebonite_hard",
    name: "Ebonite / Hard Rubber (High Sulfur)",
    desc: "Heavy 30% sulfur loading creating rigid, densely crosslinked thermoset ebonite with no elastomeric flexibility.",
    sulfurPct: 30.0,
    tempC: 150,
    stretch: 1.05,
  },
  {
    id: "frost_brittleness",
    name: "Deep Freeze Glass Transition (-40°C)",
    desc: "Unvulcanized rubber below glass transition temperature $T_g$; thermal kinetic energy drops, freezing chain rotation.",
    sulfurPct: 4.5,
    tempC: -40,
    stretch: 1.05,
  },
];

export function GoodyearRubber3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Vulcanization Chemistry & Physics State
  const { params, updateParam } = usePatentPhysics("us-3633-goodyear-rubber");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const sulfurWeightPct = params.sulfurPct ?? 8;
  const cureTemperatureCelsius = params.vulcanTemp ?? 145;
  const [appliedTensileStretch, setAppliedTensileStretch] = useState<number>(1.8);
  const [showSulfurCrosslinks, setShowSulfurCrosslinks] = useState<boolean>(true);
  const [showStressVectors, setShowStressVectors] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  // Thermodynamic & Polymer Mechanics Calculations (FrankenSim Polymer Cross-Linking Kinetics)
  const _rubberPhysics = FrankenSimEngine.stepGoodyearRubber(
    cureTemperatureCelsius,
    sulfurWeightPct,
    30,
  );
  const isVulcanized = sulfurWeightPct >= 2.0 && cureTemperatureCelsius >= 115;
  const glassTransitionTempC = Math.round(-70 + sulfurWeightPct * 3.8);
  const isGlassy = cureTemperatureCelsius < glassTransitionTempC;

  // Neo-Hookean Elastic Modulus: E = 3 * rho * R * T / M_c
  const tempKelvin = Math.max(200, cureTemperatureCelsius + 273.15);
  const crosslinkDensity = isVulcanized ? (sulfurWeightPct / 32.0) * 1.8 : 0.05;
  const tensileElasticModulusMpa = isGlassy
    ? "2400.0"
    : isVulcanized
      ? ((crosslinkDensity * (tempKelvin / 300) * 1.4) ** 1.15).toFixed(2)
      : "0.12";

  // True Stress: sigma = E * (lambda - 1 / lambda^2)
  const trueStressMpa = isGlassy
    ? "N/A (Rigid Glass)"
    : (
        Number(tensileElasticModulusMpa) *
        (appliedTensileStretch - 1 / appliedTensileStretch ** 2)
      ).toFixed(2);

  // Entropic Force: delta S = -0.5 * N * k * (lambda^2 + 2/lambda - 3)
  const entropicEntropyReductionJ = isVulcanized
    ? (
        0.5 *
        1.38e-23 *
        1e26 *
        (appliedTensileStretch ** 2 + 2 / appliedTensileStretch - 3)
      ).toFixed(1)
    : "0.0 (Plastic Flow)";

  const live = useLiveSimParams({
    appliedTensileStretch,
    showSulfurCrosslinks,
    showStressVectors,
    isVulcanized,
    isGlassy,
    cureTemperatureCelsius,
    sulfurWeightPct,
  });

  const controlsRef = useRef<any>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Camera presets dispatcher
  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    switch (preset) {
      case "iso":
        camera.position.set(11, 8, 13);
        controls.target.set(0, 0, 0);
        break;
      case "chains":
        camera.position.set(0, 1.5, 7.5);
        controls.target.set(0, 0, 0);
        break;
      case "bridges":
        camera.position.set(1.8, 0.8, 3.8);
        controls.target.set(1.5, 0, 0);
        break;
      case "clamps":
        camera.position.set(-6, 2.5, 5);
        controls.target.set(-4.5, 0, 0);
        break;
      case "top":
        camera.position.set(0, 15, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const applyScenario = (s: ScenarioPreset) => {
    updateParam("sulfurPct", s.sulfurPct);
    updateParam("vulcanTemp", s.tempC);
    setAppliedTensileStretch(s.stretch);
    if (!isAudioMuted) {
      soundEngine.playElastomerSnap(s.stretch);
    }
  };

  const toggleSound = () => {
    toggleEngine(() => {
      soundEngine.playElastomerSnap(appliedTensileStretch);
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [11, 8, 13],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // --- PBR MATERIALS ---
    const polyisopreneCarbonMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.45,
      metalness: 0.3,
    });

    const sulfurBridgeMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.18,
      metalness: 0.8,
      emissive: 0xca8a04,
      emissiveIntensity: 0.45,
    });

    const clampMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.15,
      metalness: 0.92,
    });

    const brassScrewMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.95,
      roughness: 0.2,
    });

    const stressArrowMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 0.6,
      roughness: 0.2,
    });

    // --- 3D POLYMER ASSEMBLY ---
    const rubberGroup = new THREE.Group();
    scene.add(rubberGroup);

    // Left and Right Tensile Grip Clamps
    const leftClampG = new THREE.Group();
    leftClampG.position.set(-4.5, 0, 0);

    const leftClamp = new THREE.Mesh(new THREE.BoxGeometry(0.85, 4.4, 3.4), clampMat);
    leftClamp.castShadow = true;
    leftClamp.receiveShadow = true;
    leftClampG.add(leftClamp);

    [-1.4, 1.4].forEach((sy) => {
      const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.6, 24), brassScrewMat);
      screw.rotation.z = Math.PI / 2;
      screw.position.set(-0.6, sy, 0);
      leftClampG.add(screw);
    });
    rubberGroup.add(leftClampG);

    const rightClampG = new THREE.Group();
    rightClampG.position.set(4.5, 0, 0);

    const rightClamp = new THREE.Mesh(new THREE.BoxGeometry(0.85, 4.4, 3.4), clampMat);
    rightClamp.castShadow = true;
    rightClamp.receiveShadow = true;
    rightClampG.add(rightClamp);

    [-1.4, 1.4].forEach((sy) => {
      const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.6, 24), brassScrewMat);
      screw.rotation.z = Math.PI / 2;
      screw.position.set(0.6, sy, 0);
      rightClampG.add(screw);
    });
    rubberGroup.add(rightClampG);

    // Dynamic Tensile Stress Force Vector Arrows
    const leftArrow = new THREE.Mesh(new THREE.ConeGeometry(0.32, 1.1, 16), stressArrowMat);
    leftArrow.rotation.z = Math.PI / 2;
    leftArrow.position.set(-1.4, 0, 0);
    leftClampG.add(leftArrow);

    const rightArrow = new THREE.Mesh(new THREE.ConeGeometry(0.32, 1.1, 16), stressArrowMat);
    rightArrow.rotation.z = -Math.PI / 2;
    rightArrow.position.set(1.4, 0, 0);
    rightClampG.add(rightArrow);

    // 6 Entangled cis-1,4-Polyisoprene Chains
    const chains: { curve: THREE.CatmullRomCurve3; mesh: THREE.Mesh; basePts: THREE.Vector3[] }[] =
      [];
    const numChains = 6;

    for (let c = 0; c < numChains; c++) {
      const yBase = (c - (numChains - 1) / 2) * 0.7;
      const pts: THREE.Vector3[] = [];
      const numSegments = 14;

      for (let s = 0; s <= numSegments; s++) {
        const x = -4.0 + (s / numSegments) * 8.0;
        const y = yBase + Math.sin(s * 1.6 + c * 1.2) * 0.45;
        const z = Math.cos(s * 1.8 + c * 1.5) * 0.65;
        pts.push(new THREE.Vector3(x, y, z));
      }

      const curve = new THREE.CatmullRomCurve3(pts);
      const geo = new THREE.TubeGeometry(curve, 48, 0.11, 8, false);
      const mesh = new THREE.Mesh(geo, polyisopreneCarbonMat);
      mesh.castShadow = true;
      rubberGroup.add(mesh);

      chains.push({ curve, mesh, basePts: pts });
    }

    // Sulfur Disulfide Bridge Atoms & Covalent Crosslink Struts (-S-S-)
    const sulfurBridgesGroup = new THREE.Group();
    const numBridges = 14;
    const bridgeItems: { group: THREE.Group; baseX: number }[] = [];

    for (let b = 0; b < numBridges; b++) {
      const baseX = -3.2 + (b / (numBridges - 1)) * 6.4;
      const bridgeG = new THREE.Group();
      bridgeG.position.set(baseX, (Math.random() - 0.5) * 1.8, (Math.random() - 0.5) * 1.0);

      const sAtom1 = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), sulfurBridgeMat);
      sAtom1.position.y = -0.2;
      bridgeG.add(sAtom1);

      const sAtom2 = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), sulfurBridgeMat);
      sAtom2.position.y = 0.2;
      bridgeG.add(sAtom2);

      const sBond = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.4, 8),
        new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.6 }),
      );
      bridgeG.add(sBond);

      bridgeG.castShadow = true;
      sulfurBridgesGroup.add(bridgeG);
      bridgeItems.push({ group: bridgeG, baseX });
    }
    rubberGroup.add(sulfurBridgesGroup);

    // --- RENDER LOOP & REAL-TIME ENTROPIC ELASTICITY ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const _delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const p = live.current;

      const stretch = p.appliedTensileStretch;
      rightClampG.position.x = 4.5 * stretch;
      leftClampG.position.x = -4.5 * stretch;

      // Stress vector scaling
      leftArrow.visible = p.showStressVectors;
      rightArrow.visible = p.showStressVectors;
      const stressScale = Math.min(2.5, Math.max(0.4, (stretch - 1.0) * 1.5 + 0.5));
      leftArrow.scale.set(stressScale, stressScale, stressScale);
      rightArrow.scale.set(stressScale, stressScale, stressScale);

      // Deform polymer chains: Affine extension and transverse thinning
      const uncoilFactor = Math.max(0.12, 1.0 / Math.sqrt(stretch));
      for (let c = 0; c < chains.length; c++) {
        const item = chains[c];
        item.mesh.scale.set(stretch, uncoilFactor, uncoilFactor);

        // Brownian thermal fluctuation increases with temperature
        const thermalAmplitude = p.isGlassy
          ? 0.005
          : (p.cureTemperatureCelsius / 140) * (p.isVulcanized ? 0.03 : 0.1);
        item.mesh.position.y = Math.sin(elapsed * 4.0 + c * 1.5) * thermalAmplitude;
        item.mesh.position.z = Math.cos(elapsed * 4.0 + c * 1.5) * thermalAmplitude;
      }

      // Sulfur bridges distribution
      sulfurBridgesGroup.visible = p.showSulfurCrosslinks && p.isVulcanized;
      for (let b = 0; b < bridgeItems.length; b++) {
        const item = bridgeItems[b];
        item.group.position.x = item.baseX * stretch;
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
                <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 animate-pulse" />
                Vulcanized Elastomer Telemetry
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 sm:gap-y-1 mt-1 text-[10px] sm:text-xs font-sans">
                <div>
                  <span className="text-ink-600 dark:text-ink-400">
                    <HudText text="Modulus ($E$):" />
                  </span>{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {tensileElasticModulusMpa} MPa
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">
                    <HudText text="Stretch ($\\lambda$):" />
                  </span>{" "}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {appliedTensileStretch.toFixed(2)}×
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Stress:</span>{" "}
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {trueStressMpa} MPa
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">
                    <HudText text="Entropic $\\Delta S$:" />
                  </span>{" "}
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    -{entropicEntropyReductionJ} J/K
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 items-center gap-2 max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />
              <span className="truncate">Charles Goodyear (US 3,633) — Vulcanization (1844)</span>
            </div>
          </div>
        )}

        {/* Top Right Tool Bar (Toggle UI, Audio, Callouts & Reset) */}
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
                ["chains", "Polymer Chains"],
                ["bridges", "Sulfur Bridges"],
                ["clamps", "Tensile Clamps"],
                ["top", "Top Stress Field"],
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
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Historical &amp; Physical Scenarios:
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
          {/* Sulfur Content */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="font-semibold text-ink-800 dark:text-parchment-200">
                Sulfur Additive (wt%):
              </span>
              <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">
                {sulfurWeightPct.toFixed(1)}% S
              </span>
            </div>
            <input
              type="range"
              aria-label="Sulfur Additive (wt%)"
              min="0.5"
              max="15.0"
              step="0.5"
              value={sulfurWeightPct}
              onChange={(e) => updateParam("sulfurPct", Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
              Forms covalent disulfide cross-links (-S_x-)
            </span>
          </div>

          {/* Cure Temperature */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="font-semibold text-ink-800 dark:text-parchment-200">
                Curing Temperature:
              </span>
              <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">
                {cureTemperatureCelsius}°C ({Math.round((cureTemperatureCelsius * 9) / 5 + 32)}°F)
              </span>
            </div>
            <input
              type="range"
              aria-label="Curing Temperature"
              min="-40"
              max="190"
              step="5"
              value={cureTemperatureCelsius}
              onChange={(e) => updateParam("vulcanTemp", Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
              Goodyear stove thermal cure (1839)
            </span>
          </div>

          {/* Tensile Stretch */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="font-semibold text-ink-800 dark:text-parchment-200">
                <HudText text="Applied Tensile Stretch ($\\lambda$):" />
              </span>
              <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">
                {appliedTensileStretch.toFixed(2)}×
              </span>
            </div>
            <input
              type="range"
              aria-label="Applied Tensile Stretch (\\lambda)"
              min="1.0"
              max="3.2"
              step="0.05"
              value={appliedTensileStretch}
              onChange={(e) => {
                const val = Number(e.target.value);
                setAppliedTensileStretch(val);
                if (!isAudioMuted && Math.random() < 0.2) {
                  soundEngine.playElastomerSnap(val);
                }
              }}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
              <HudText text="Entropic elasticity $\\sigma = G(\\lambda - 1/\\lambda^2)$" />
            </span>
          </div>
        </div>

        {/* Checkbox Toggles & Elastic Memory Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 border-t border-parchment-200 dark:border-ink-800 text-xs font-sans">
          <div className="flex flex-wrap gap-4 text-ink-700 dark:text-parchment-300">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showSulfurCrosslinks}
                onChange={(e) => setShowSulfurCrosslinks(e.target.checked)}
                className="rounded accent-amber-600 cursor-pointer"
              />
              <span>Highlight Disulfide Bridges (-S-S-)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showStressVectors}
                onChange={(e) => setShowStressVectors(e.target.checked)}
                className="rounded accent-amber-600 cursor-pointer"
              />
              <span>Render Tensile Force Vectors</span>
            </label>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-ink-600 dark:text-ink-400 text-xs">Elastic Memory:</span>
            <div className="w-28 sm:w-36 bg-parchment-300 dark:bg-ink-800 rounded-full h-2.5 overflow-hidden border border-parchment-400 dark:border-ink-700">
              <div
                className={`h-full transition-colors duration-300 ${
                  isVulcanized ? "bg-gradient-to-r from-blue-500 to-emerald-500" : "bg-amber-500"
                }`}
                style={{ width: `${isVulcanized ? 95 : 20}%` }}
              />
            </div>
            <span className="font-bold text-xs text-ink-800 dark:text-parchment-200">
              {isVulcanized ? "100% Snap" : "Plastic Flow"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
