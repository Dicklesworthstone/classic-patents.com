"use client";

import {
  Camera,
  Eye,
  EyeOff,
  RotateCcw,
  Shield,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { soundEngine } from "@/utils/soundEngine";
import { createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "ring" | "hbonds" | "spinneret" | "impact";

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  shear: number;
  conc: number;
  temp: number;
  impact: boolean;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: "kwolek_1971",
    name: "1971 Stephanie Kwolek (US 3,819,587)",
    desc: "Stephanie Kwolek's discovery: Liquid-crystal nematic dopes yielding ultra-high tensile PPTA fibers.",
    shear: 450,
    conc: 19.5,
    temp: 85,
    impact: false,
  },
  {
    id: "isotropic_poor",
    name: "Isotropic Solution (Disordered)",
    desc: "Low-concentration solution lacking nematic ordering, producing weak random-coil filaments.",
    shear: 100,
    conc: 8.0,
    temp: 45,
    impact: false,
  },
  {
    id: "ballistic_impact",
    name: "Ballistic Impact Absorption",
    desc: "High-speed projectile impact testing transverse wave dispersion across hydrogen-bonded aromatic sheets.",
    shear: 600,
    conc: 20.0,
    temp: 75,
    impact: true,
  },
  {
    id: "high_shear",
    name: "High-Shear Industrial Spinning",
    desc: "850 s⁻¹ capillary extrusion shear rate locking PPTA rigid-rods into flawless parallel crystal domains.",
    shear: 850,
    conc: 22.0,
    temp: 80,
    impact: false,
  },
];

export function KwolekKevlar3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Polymer Chemistry State Controls
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [shearRate, setShearRate] = useState<number>(450); // 50 to 1000 s^-1
  const [polymerConcentrationPct, setPolymerConcentrationPct] = useState<number>(18.5); // 5 to 25 wt%
  const [temperatureCelsius, setTemperatureCelsius] = useState<number>(85); // 20 to 120 °C
  const [showHydrogenBonds, setShowHydrogenBonds] = useState<boolean>(true);
  const [isImpactTesting, setIsImpactTesting] = useState<boolean>(false);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound } = usePatentAudio();

  // Liquid-Crystal Physics Calculations
  const isNematicLCP = polymerConcentrationPct >= 12.0 && temperatureCelsius < 105;
  const tensileStrengthGpa = (isNematicLCP ? 3.6 * (shearRate / 500) ** 0.35 : 0.8).toFixed(2);
  const modulusGpa = (isNematicLCP ? 130 * (shearRate / 500) ** 0.4 : 25).toFixed(0);

  const live = useLiveSimParams({
    shearRate,
    temperatureCelsius,
    showHydrogenBonds,
    isImpactTesting,
    isNematicLCP,
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
        camera.position.set(11, 8, 14);
        controls.target.set(0, 0, 0);
        break;
      case "ring":
        camera.position.set(0, 1.4, 3.8);
        controls.target.set(0, 0, 0);
        break;
      case "hbonds":
        camera.position.set(0, 5.5, 0.1);
        controls.target.set(0, 0, 0);
        break;
      case "spinneret":
        camera.position.set(-5.5, 2.0, 4.0);
        controls.target.set(-5.0, 0, 0);
        break;
      case "impact":
        camera.position.set(4.0, 1.5, 5.0);
        controls.target.set(1.5, 0, 0);
        break;
    }
    controls.update();
  };

  const applyScenario = (s: ScenarioPreset) => {
    setShearRate(s.shear);
    setPolymerConcentrationPct(s.conc);
    setTemperatureCelsius(s.temp);
    setIsImpactTesting(s.impact);
    if (!isAudioMuted) {
      soundEngine.playElastomerSnap(s.shear / 400);
    }
  };

  const handleToggleSound = () => {
    toggleSound(() => {
      soundEngine.playElastomerSnap(1.2);
    });
  };

  const impactTimerRef = useRef<number | null>(null);

  const handleTriggerImpact = () => {
    if (impactTimerRef.current !== null) {
      window.clearTimeout(impactTimerRef.current);
    }
    setIsImpactTesting(true);
    if (!isAudioMuted) {
      soundEngine.playSwitchClick();
    }
    impactTimerRef.current = window.setTimeout(() => {
      setIsImpactTesting(false);
      impactTimerRef.current = null;
    }, 1800);
  };

  useEffect(() => {
    return () => {
      if (impactTimerRef.current !== null) {
        window.clearTimeout(impactTimerRef.current);
      }
    };
  }, []);

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

    // --- PBR MATERIALS ---
    const carbonRingMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.25,
      metalness: 0.85,
    });

    const amideNitrogenMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      roughness: 0.2,
      metalness: 0.6,
    });

    const carbonylOxygenMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.2,
      metalness: 0.6,
    });

    const spinneretSteelMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.15,
      metalness: 0.95,
    });

    // --- 3D POLYMER CHAIN ASSEMBLY ---
    const polymerGroup = new THREE.Group();
    scene.add(polymerGroup);

    // Stainless Steel Spinneret Extrusion Pack
    const spinneretPack = new THREE.Group();
    spinneretPack.position.set(-6.0, 0, 0);

    const nozzleBody = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 2.8, 1.4, 32),
      spinneretSteelMat,
    );
    nozzleBody.rotation.z = Math.PI / 2;
    spinneretPack.add(nozzleBody);

    for (let o = -2; o <= 2; o++) {
      const hole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.2, 12),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 }),
      );
      hole.rotation.z = Math.PI / 2;
      hole.position.set(0.7, o * 0.9, 0);
      spinneretPack.add(hole);
    }
    polymerGroup.add(spinneretPack);

    // Parallel Rigid-Rod Polymer Chains (5 Extended PPTA Liquid-Crystal Chains)
    const chains: { group: THREE.Group; baseY: number }[] = [];
    const numChains = 5;

    for (let c = 0; c < numChains; c++) {
      const chainG = new THREE.Group();
      const yPos = (c - (numChains - 1) / 2) * 1.35;
      chainG.position.set(0, yPos, 0);

      // Repeat Units along Chain (6 Monomer units)
      for (let u = 0; u < 6; u++) {
        const xPos = -4.2 + u * 1.55;

        // Benzene Ring (Hexagonal Carbon Ring)
        const ringG = new THREE.Group();
        ringG.position.x = xPos;
        for (let r = 0; r < 6; r++) {
          const angle = (r * Math.PI) / 3;
          const nextAngle = ((r + 1) * Math.PI) / 3;
          const ax = Math.cos(angle) * 0.38;
          const ay = Math.sin(angle) * 0.38;
          const bx = Math.cos(nextAngle) * 0.38;
          const by = Math.sin(nextAngle) * 0.38;

          const atom = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 12), carbonRingMat);
          atom.position.set(ax, ay, 0);
          ringG.add(atom);

          const bondStick = new THREE.Mesh(
            new THREE.CylinderGeometry(0.03, 0.03, 0.38, 8),
            new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 }),
          );
          bondStick.position.set((ax + bx) / 2, (ay + by) / 2, 0);
          bondStick.rotation.z = angle + Math.PI / 6;
          ringG.add(bondStick);
        }
        chainG.add(ringG);

        // Amide Group (-NH-CO-)
        const nAtom = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), amideNitrogenMat);
        nAtom.position.set(xPos + 0.55, 0.22, 0);
        chainG.add(nAtom);

        const oAtom = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), carbonylOxygenMat);
        oAtom.position.set(xPos + 0.95, -0.22, 0);
        chainG.add(oAtom);
      }

      chainG.castShadow = true;
      polymerGroup.add(chainG);
      chains.push({ group: chainG, baseY: yPos });
    }

    // Hydrogen Bonds (-NH···O=C-) Transverse Struts
    const hBondsGroup = new THREE.Group();
    for (let c = 0; c < numChains - 1; c++) {
      const yMid = (c - (numChains - 1) / 2) * 1.35 + 0.675;
      for (let u = 0; u < 5; u++) {
        const xPos = -3.6 + u * 1.55;
        const hBond = new THREE.Mesh(
          new THREE.CylinderGeometry(0.035, 0.035, 1.15, 8),
          new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            roughness: 0.3,
            metalness: 0.5,
            transparent: true,
            opacity: 0.75,
          }),
        );
        hBond.position.set(xPos, yMid, 0);
        hBondsGroup.add(hBond);
      }
    }
    polymerGroup.add(hBondsGroup);

    // Ballistic Bullet Projectile (9mm Parabellum test)
    const bullet = new THREE.Mesh(
      new THREE.ConeGeometry(0.45, 1.4, 24),
      new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.9, roughness: 0.2 }),
    );
    bullet.rotation.z = Math.PI / 2;
    bullet.position.set(6.5, 0, 0);
    scene.add(bullet);

    // --- RENDER LOOP & REAL-TIME LIQUID CRYSTAL DYNAMICS ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const p = live.current;

      const shearAlignment = Math.min(1.0, p.shearRate / 600);
      const thermalDisorder = Math.max(0, (p.temperatureCelsius - 60) / 60) * 0.3;

      for (let i = 0; i < numChains; i++) {
        const item = chains[i];
        if (p.isNematicLCP) {
          item.group.rotation.z =
            Math.sin(elapsed * 2.0 + i) * (0.05 * (1 - shearAlignment) + thermalDisorder);
          item.group.position.y = item.baseY + Math.cos(elapsed * 2.0 + i) * 0.04;
        } else {
          item.group.rotation.z = Math.sin(elapsed * 1.5 + i) * 0.45;
          item.group.position.y = item.baseY + Math.sin(elapsed * 1.5 + i) * 0.3;
        }
      }

      hBondsGroup.visible = p.showHydrogenBonds && p.isNematicLCP;

      // Nematic, well-sheared PPTA stops the projectile; isotropic dope does not.
      const stopsProjectile = p.isNematicLCP && p.shearRate >= 300;

      if (p.isImpactTesting) {
        bullet.position.x -= delta * 18.0;
        if (stopsProjectile && bullet.position.x < 1.0) {
          bullet.position.x = 1.0;
          polymerGroup.position.x = -Math.sin(elapsed * 30.0) * 0.25;
        } else if (!stopsProjectile && bullet.position.x < -7.0) {
          bullet.position.x = -7.0;
          polymerGroup.position.x = 0;
        }
      } else {
        bullet.position.x = 6.5;
        polymerGroup.position.x = 0;
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
                    {modulusGpa} GPa
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

        {/* Top Right Tool Bar (Toggle UI, Audio, Pins, Reset) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-all shadow-sm ${
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
            type="button"
            onClick={handleToggleSound}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-all shadow-sm"
            title={isAudioMuted ? "Enable Sound Synthesis" : "Mute Sound"}
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowCalloutPins(!showCalloutPins)}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-all shadow-sm ${
              showCalloutPins
                ? "bg-amber-600 text-white border-amber-700 shadow-md"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
            title="Toggle Historical Patent Numeral Pins"
          >
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-all shadow-sm"
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
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => applyCameraPreset(id)}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-sans whitespace-nowrap shrink-0 transition-all ${
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
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Liquid-Crystal Physical Scenarios:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => applyScenario(s)}
                className="p-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 bg-white/70 dark:bg-ink-950/70 hover:bg-parchment-50 dark:hover:bg-ink-800 text-left transition-all group"
              >
                <div className="text-xs font-serif font-bold text-ink-900 dark:text-parchment-100 group-hover:text-amber-700 dark:group-hover:text-amber-400">
                  {s.name}
                </div>
                <div className="text-[10px] font-sans text-ink-500 dark:text-ink-400 line-clamp-2 mt-0.5">
                  {s.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Shear Rate */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="font-semibold text-ink-800 dark:text-parchment-200">
                {"Spinneret Shear Rate (γ̇):"}
              </span>
              <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">
                {shearRate} s⁻¹
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={shearRate}
              onChange={(e) => setShearRate(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
              Hydrodynamic alignment through spinneret
            </span>
          </div>

          {/* Concentration */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="font-semibold text-ink-800 dark:text-parchment-200">
                {"PPTA in H₂SO₄ Dope:"}
              </span>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                {polymerConcentrationPct.toFixed(1)} wt%
              </span>
            </div>
            <input
              type="range"
              min="5.0"
              max="25.0"
              step="0.5"
              value={polymerConcentrationPct}
              onChange={(e) => setPolymerConcentrationPct(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
              Nematic threshold: ~12.5 wt%
            </span>
          </div>

          {/* Ballistic Impact Trigger Button */}
          <div className="flex flex-col justify-end space-y-1.5">
            <button
              type="button"
              onClick={handleTriggerImpact}
              className={`w-full py-3 px-4 rounded-xl font-sans font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 ${
                isImpactTesting
                  ? "bg-red-700 text-white scale-95 ring-2 ring-red-400 shadow-inner"
                  : "bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-md"
              }`}
            >
              <Shield className="w-4 h-4" />
              {isImpactTesting
                ? isNematicLCP && shearRate >= 300
                  ? "Arresting projectile in H-bonded sheet..."
                  : "Penetrating isotropic dope..."
                : "Test 9mm Ballistic Impact"}
            </button>
          </div>
        </div>

        {/* Checkbox Toggles & Nematic Phase Status */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 border-t border-parchment-200 dark:border-ink-800 text-xs font-sans">
          <div className="flex flex-wrap gap-4 text-ink-700 dark:text-parchment-300">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showHydrogenBonds}
                onChange={(e) => setShowHydrogenBonds(e.target.checked)}
                className="rounded accent-amber-600 cursor-pointer"
              />
              <span>Render Inter-Chain Hydrogen Bonds (-NH···O=C-)</span>
            </label>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-ink-600 dark:text-ink-400 text-xs">Tensile Resistance:</span>
            <div className="w-28 sm:w-36 bg-parchment-300 dark:bg-ink-800 rounded-full h-2.5 overflow-hidden border border-parchment-400 dark:border-ink-700">
              <div
                className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full transition-all duration-300"
                style={{ width: `${Math.min(100, (Number(tensileStrengthGpa) / 4.0) * 100)}%` }}
              />
            </div>
            <span className="font-bold text-xs text-ink-800 dark:text-parchment-200">
              {tensileStrengthGpa} GPa
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
