"use client";

import { Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createThreeStudioScene } from "./ThreeStudioScene";

export function KwolekKevlar3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Polymer Chemistry State Controls
  const [shearRate, setShearRate] = useState<number>(450); // 50 to 1000 s^-1
  const [polymerConcentrationPct, setPolymerConcentrationPct] = useState<number>(18.5); // 5 to 25 wt%
  const [temperatureCelsius, setTemperatureCelsius] = useState<number>(85); // 20 to 120 °C
  const [showHydrogenBonds, setShowHydrogenBonds] = useState<boolean>(true);
  const [isImpactTesting, setIsImpactTesting] = useState<boolean>(false);

  // Liquid-Crystal Physics Calculations
  // Nematic Liquid Crystalline Phase Transition at critical concentration ~12-14%
  const isNematicLCP = polymerConcentrationPct >= 12.0 && temperatureCelsius < 105;
  const tensileStrengthGpa = (isNematicLCP ? 3.6 * (shearRate / 500) ** 0.35 : 0.8).toFixed(2);
  const modulusGpa = (isNematicLCP ? 130 * (shearRate / 500) ** 0.4 : 25).toFixed(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with High-Luminosity Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [11, 8, 14],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS ---
    const carbonRingMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Aromatic 1,4-phenylene benzene ring (Golden Aramid)
      roughness: 0.25,
      metalness: 0.85,
    });

    const amideNitrogenMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6, // Nitrogen (-NH-)
      roughness: 0.2,
      metalness: 0.6,
    });

    const carbonylOxygenMat = new THREE.MeshStandardMaterial({
      color: 0xef4444, // Carbonyl Oxygen (=O)
      roughness: 0.2,
      metalness: 0.6,
    });

    const spinneretSteelMat = new THREE.MeshStandardMaterial({
      color: 0x475569, // Stainless steel spinneret die plate
      roughness: 0.15,
      metalness: 0.95,
    });

    // --- 3D POLYMER CHAIN ASSEMBLY (POLY-P-PHENYLENE TEREPHTHALAMIDE - PPTA) ---
    const polymerGroup = new THREE.Group();
    scene.add(polymerGroup);

    // Spinneret Extrusion Nozzle
    const nozzle = new THREE.Mesh(
      new THREE.CylinderGeometry(3.6, 2.2, 1.8, 36, 1, true),
      spinneretSteelMat,
    );
    nozzle.position.set(-5.5, 0, 0);
    nozzle.rotation.z = -Math.PI / 2;
    polymerGroup.add(nozzle);

    // Parallel Rigid-Rod Polymer Chains (5 Chains)
    const chains: { group: THREE.Group; baseY: number; baseZ: number }[] = [];
    const numChains = 5;

    for (let c = 0; c < numChains; c++) {
      const chainG = new THREE.Group();
      const yPos = (c - (numChains - 1) / 2) * 1.3;
      chainG.position.set(0, yPos, 0);

      // Repeat Units along Chain (6 Monomer units)
      for (let u = 0; u < 6; u++) {
        const xPos = -4.0 + u * 1.5;

        // Benzene Ring (Hexagonal Ring of Carbon Atoms)
        const ringG = new THREE.Group();
        ringG.position.x = xPos;
        for (let r = 0; r < 6; r++) {
          const angle = (r * Math.PI) / 3;
          const atom = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), carbonRingMat);
          atom.position.set(Math.cos(angle) * 0.35, Math.sin(angle) * 0.35, 0);
          ringG.add(atom);
        }
        chainG.add(ringG);

        // Amide Linkage (-CO-NH-)
        const carbonyl = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), carbonylOxygenMat);
        carbonyl.position.set(xPos + 0.6, 0.28, 0);
        chainG.add(carbonyl);

        const amideN = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), amideNitrogenMat);
        amideN.position.set(xPos + 0.9, -0.28, 0);
        chainG.add(amideN);
      }

      polymerGroup.add(chainG);
      chains.push({ group: chainG, baseY: yPos, baseZ: 0 });
    }

    // --- INTER-CHAIN HYDROGEN BONDING LATTICE ($N-H \cdots O=C$) ---
    const _hBondLines: THREE.LineSegments[] = [];
    const hBondGeo = new THREE.BufferGeometry();
    const hBondPos: number[] = [];

    for (let c = 0; c < numChains - 1; c++) {
      const y1 = chains[c].baseY;
      const y2 = chains[c + 1].baseY;
      for (let u = 0; u < 6; u++) {
        const xPos = -4.0 + u * 1.5 + 0.75;
        hBondPos.push(xPos, y1 + 0.28, 0);
        hBondPos.push(xPos, y2 - 0.28, 0);
      }
    }

    hBondGeo.setAttribute("position", new THREE.Float32BufferAttribute(hBondPos, 3));
    const hBondMesh = new THREE.LineSegments(
      hBondGeo,
      new THREE.LineDashedMaterial({
        color: 0x38bdf8,
        dashSize: 0.15,
        gapSize: 0.1,
        transparent: true,
        opacity: 0.75,
      }),
    );
    hBondMesh.computeLineDistances();
    polymerGroup.add(hBondMesh);

    // --- BALLISTIC PROJECTILE IMPACT SIMULATOR ---
    const bullet = new THREE.Mesh(
      new THREE.ConeGeometry(0.35, 1.2, 16),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.15, metalness: 0.95 }),
    );
    bullet.rotation.z = Math.PI / 2;
    bullet.position.set(7.0, 0, 0);
    bullet.castShadow = true;
    scene.add(bullet);

    // --- RENDER LOOP & REAL-TIME POLYMER NEMATIC DYNAMICS ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Shear-induced Liquid Crystal Alignment
      const shearAlignment = Math.min(1.0, shearRate / 600);
      const thermalDisorder = Math.max(0, (temperatureCelsius - 60) / 60) * 0.3;

      for (let i = 0; i < numChains; i++) {
        const item = chains[i];
        if (isNematicLCP) {
          // Rigid parallel orientation along fiber extrusion axis
          item.group.rotation.z =
            Math.sin(elapsed * 2.0 + i) * (0.05 * (1 - shearAlignment) + thermalDisorder);
          item.group.position.y = item.baseY + Math.cos(elapsed * 2.0 + i) * 0.04;
        } else {
          // Isotropic tangled coil disorder
          item.group.rotation.z = Math.sin(elapsed * 1.5 + i) * 0.45;
          item.group.position.y = item.baseY + Math.sin(elapsed * 1.5 + i) * 0.3;
        }
      }

      hBondMesh.visible = showHydrogenBonds && isNematicLCP;

      // Ballistic Impact Stress Wave Propagation
      if (isImpactTesting) {
        bullet.position.x -= delta * 18.0;
        if (bullet.position.x < 1.0) {
          // Decelerate & bounce back (Kevlar absorbs kinetic energy)
          bullet.position.x = 1.0;
          polymerGroup.position.x = -Math.sin(elapsed * 30.0) * 0.25;
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
  }, [shearRate, temperatureCelsius, showHydrogenBonds, isImpactTesting, isNematicLCP]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      {/* 3D WebGL Canvas Viewport */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Live HUD Telemetry Overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
            <div className="text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              Liquid Crystal Aramid Telemetry
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs font-sans">
              <div>
                <span className="text-ink-600 dark:text-ink-400">Tensile Strength:</span>{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {tensileStrengthGpa} GPa (5× Steel)
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Young's Modulus ($E$):</span>{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">{modulusGpa} GPa</span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Polymer Phase:</span>{" "}
                <span
                  className={`font-bold ${
                    isNematicLCP
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {isNematicLCP ? "Nematic Liquid Crystal" : "Isotropic Solution"}
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Specific Strength:</span>{" "}
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  2.5 × 10⁶ N·m/kg
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isNematicLCP ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            <span>
              {isNematicLCP
                ? "Self-Assembling Rigid-Rod PPTA Chains Aligned Under Extrusion Shear"
                : "Disordered Solution: Sub-critical Concentration"}
            </span>
          </div>
        </div>

        {/* Toggle Controls */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            type="button"
            onClick={() => setShowHydrogenBonds(!showHydrogenBonds)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all ${
              showHydrogenBonds
                ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                : "bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
            }`}
          >
            H-Bonds
          </button>
          <button
            type="button"
            onClick={() => setIsImpactTesting(!isImpactTesting)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all ${
              isImpactTesting
                ? "bg-red-600 text-white border-red-700 shadow-sm"
                : "bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
            }`}
          >
            {isImpactTesting ? "Impact Active" : "Test Impact"}
          </button>
        </div>
      </div>

      {/* Parameter Sliders Panel */}
      <div className="p-4 sm:p-5 bg-parchment-100/80 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
        {/* Shear Rate */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>{"Spinneret Shear Rate ($\\dot{\\gamma}$):"}</span>
            <span className="font-bold text-amber-700 dark:text-amber-400">{shearRate} s⁻¹</span>
          </div>
          <input
            type="range"
            min="50"
            max="1000"
            step="50"
            value={shearRate}
            onChange={(e) => setShearRate(Number(e.target.value))}
            className="w-full accent-amber-600 dark:accent-amber-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Hydrodynamic alignment through spinning orifice
          </span>
        </div>

        {/* PPTA Polymer Concentration */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>PPTA in Sulfuric Acid:</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
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
            className="w-full accent-blue-600 dark:accent-blue-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Critical nematic threshold: ~12.5 wt%
          </span>
        </div>

        {/* Temperature */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Dope Temperature ($T$):</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {temperatureCelsius}°C
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="120"
            step="5"
            value={temperatureCelsius}
            onChange={(e) => setTemperatureCelsius(Number(e.target.value))}
            className="w-full accent-emerald-600 dark:accent-emerald-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Liquid crystalline melting point behavior
          </span>
        </div>

        {/* Bullet Energy Absorption */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Kinetic Energy Dissipation:</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">
              {isNematicLCP ? "450 Joules (9mm Stopped)" : "120 Joules (Penetrated)"}
            </span>
          </div>
          <div className="w-full bg-parchment-300 dark:bg-ink-800 rounded-full h-3 overflow-hidden mt-2 border border-parchment-400 dark:border-ink-700">
            <div
              className="bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500 h-full transition-all duration-300"
              style={{ width: `${isNematicLCP ? 95 : 25}%` }}
            />
          </div>
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            {"Longitudinal sound speed $c = \\sqrt{E/\\rho} \\approx 10{,}000\\text{ m/s}$"}
          </span>
        </div>
      </div>
    </div>
  );
}
