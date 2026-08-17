"use client";

import { Flame } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createThreeStudioScene } from "./ThreeStudioScene";

export function GoodyearRubber3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Polymer Vulcanization State
  const [temperatureCelsius, setTemperatureCelsius] = useState<number>(140); // 20 to 200 C
  const [sulfurWeightPct, setSulfurWeightPct] = useState<number>(8); // 0 to 25%
  const [tensileStrain, setTensileStrain] = useState<number>(1.2); // 1.0 to 2.5x stretch
  const [showSulfurBridges, setShowSulfurBridges] = useState<boolean>(true);

  // Cross-linking Network Density & Elasticity Physics
  const crosslinkDensityMols = (
    sulfurWeightPct *
    (temperatureCelsius > 120 ? 1.0 : 0.05) *
    1.8
  ).toFixed(1);
  const elasticModulusMpa = Math.max(0.2, Number(crosslinkDensityMols) * 0.45).toFixed(2);
  const isStickyViscous = temperatureCelsius > 80 && sulfurWeightPct < 2;
  const isBrittleGlassy = temperatureCelsius < 0 && sulfurWeightPct < 2;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with Museum Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [15, 11, 18],
      targetPos: [0, 0, 0],
      bgBottomColor: 0x0f172a,
      rimColor: 0xf59e0b,
      ambientIntensity: 1.3,
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS ---
    const isopreneCarbonMat = new THREE.MeshStandardMaterial({
      color: 0x334155, // Polyisoprene polymer chain backbone
      roughness: 0.6,
      metalness: 0.2,
    });

    const sulfurBridgeMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15, // Sulfur cross-linking bridge atoms (Yellow)
      roughness: 0.3,
      metalness: 0.8,
      emissive: 0xca8a04,
      emissiveIntensity: 0.4,
    });

    // --- 3D POLYMER CHAIN MESH ---
    const rubberGroup = new THREE.Group();
    scene.add(rubberGroup);

    const numChains = 4;
    const segmentsPerChain = 10;
    const chainMeshes: THREE.Mesh[][] = [];

    for (let c = 0; c < numChains; c++) {
      const chainNodes: THREE.Mesh[] = [];
      const baseY = (c - (numChains - 1) / 2) * 2.5;

      for (let s = 0; s < segmentsPerChain; s++) {
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 16), isopreneCarbonMat);
        const baseX = (s - (segmentsPerChain - 1) / 2) * 1.6;
        sphere.position.set(baseX, baseY, 0);
        chainNodes.push(sphere);
        rubberGroup.add(sphere);
      }
      chainMeshes.push(chainNodes);
    }

    // Dynamic Sulfur Cross-linking Bridge Cylinders
    const bridgeGroup = new THREE.Group();
    const bridgeCylinders: THREE.Mesh[] = [];

    for (let c = 0; c < numChains - 1; c++) {
      for (let s = 1; s < segmentsPerChain - 1; s += 2) {
        const bridge = new THREE.Mesh(
          new THREE.CylinderGeometry(0.14, 0.14, 2.5, 12),
          sulfurBridgeMat,
        );
        bridge.position.set(
          (s - (segmentsPerChain - 1) / 2) * 1.6,
          (c - (numChains - 2) / 2) * 2.5,
          0,
        );
        bridgeCylinders.push(bridge);
        bridgeGroup.add(bridge);
      }
    }
    rubberGroup.add(bridgeGroup);

    // --- ANIMATION & PHYSICS INTEGRATION LOOP ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      controls.update();

      // Tensile Strain Deformation
      const stretch = tensileStrain;
      rubberGroup.scale.set(stretch, 1 / Math.sqrt(stretch), 1 / Math.sqrt(stretch));

      // Thermal Polymer Segment Jiggle
      const thermalWiggle = (temperatureCelsius / 100) * 0.12;
      chainMeshes.forEach((chain, cIdx) => {
        chain.forEach((node, sIdx) => {
          const wobble = Math.sin(time * 6.0 + sIdx + cIdx) * thermalWiggle;
          node.position.z = wobble;
        });
      });

      // Cross-linking visibility based on sulfur and toggle
      bridgeGroup.visible = showSulfurBridges && sulfurWeightPct > 1;
      const numActiveBridges = Math.min(
        bridgeCylinders.length,
        Math.floor((sulfurWeightPct / 25) * bridgeCylinders.length),
      );
      bridgeCylinders.forEach((b, idx) => {
        b.visible = idx < numActiveBridges;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      studio.dispose();
    };
  }, [temperatureCelsius, sulfurWeightPct, tensileStrain, showSulfurBridges]);

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Flame className="w-6 h-6 text-amber-500 animate-pulse" />
            <h3 className="font-serif text-2xl font-bold text-ink-950 dark:text-parchment-50">
              3D Real-Time Goodyear Vulcanized Rubber &amp; Cross-Linking Simulator (US 3,633)
            </h3>
          </div>
          <p className="text-sm sm:text-base text-ink-700 dark:text-ink-300 mt-1">
            Studio-illuminated Three.js polymer physics illustrating{" "}
            <strong>sulfur atom cross-linking bridges</strong> and{" "}
            <strong>temperature-stable elasticity</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-xs sm:text-sm font-mono font-bold border border-amber-300 dark:border-amber-800 shadow-2xs">
            Elastic Modulus: {elasticModulusMpa} MPa
          </div>
        </div>
      </div>

      {/* 3D WebGL Canvas & HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-[#0f172a] border border-parchment-300 dark:border-ink-800 relative min-h-[460px] overflow-hidden shadow-inner">
          {/* Top HUD */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none text-xs sm:text-sm font-mono">
            <div className="px-3.5 py-1.5 bg-ink-900/90 border border-ink-800 text-amber-300 rounded-xl shadow-md">
              Polymer State:{" "}
              <span className="font-bold">
                {isStickyViscous
                  ? "Sticky Slime (Rotting)"
                  : isBrittleGlassy
                    ? "Brittle Solid (Cracking)"
                    : "Vulcanized Elastomer (Stable)"}
              </span>
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={() => setShowSulfurBridges(!showSulfurBridges)}
                className={`px-3 py-1 rounded-lg border text-xs font-mono transition-colors ${
                  showSulfurBridges
                    ? "bg-amber-600 text-white border-amber-500"
                    : "bg-ink-900 text-ink-400 border-ink-800"
                }`}
              >
                Sulfur Bridges: {showSulfurBridges ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* 3D Canvas */}
          <div ref={containerRef} className="w-full h-[460px] cursor-grab active:cursor-grabbing" />

          {/* Bottom Telemetry */}
          <div className="w-full grid grid-cols-4 gap-3 text-center text-sm font-mono p-4 bg-ink-950/95 border-t border-ink-800 text-ink-300 z-10">
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                CURE TEMP
              </span>
              <span className="text-amber-400 font-bold text-sm sm:text-base">
                {temperatureCelsius} °C
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                SULFUR BRIDGES
              </span>
              <span className="text-emerald-400 font-bold text-sm sm:text-base">
                {sulfurWeightPct}% Weight
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                STRETCH RATIO
              </span>
              <span className="text-blue-400 font-bold text-sm sm:text-base">
                {tensileStrain.toFixed(1)}x Elongation
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                3D INTERACTION
              </span>
              <span className="text-purple-400 font-semibold text-xs sm:text-sm">
                Drag Orbit / Zoom
              </span>
            </div>
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/80 dark:bg-ink-900/70 p-6 space-y-5 shadow-sm">
            <span className="font-serif font-bold text-base sm:text-lg text-ink-950 dark:text-parchment-50 block">
              Vulcanization Chemistry Controls
            </span>

            {/* Cure Temperature Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Heat Curing Temperature ($T$)
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {temperatureCelsius} °C
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="200"
                step="10"
                value={temperatureCelsius}
                onChange={(e) => setTemperatureCelsius(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Sulfur Additive Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Sulfur Content Ratio (%wt)
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {sulfurWeightPct}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={sulfurWeightPct}
                onChange={(e) => setSulfurWeightPct(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Tensile Stretch Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Applied Tensile Elongation ($\lambda$)
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {tensileStrain.toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="2.5"
                step="0.1"
                value={tensileStrain}
                onChange={(e) => setTensileStrain(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-ink-950 dark:text-parchment-100 text-xs sm:text-sm font-sans space-y-1.5">
              <span className="font-bold text-amber-900 dark:text-amber-300 block font-mono text-xs uppercase tracking-wider">
                Goodyear&apos;s Hot Stove Accidental Cure:
              </span>
              <p className="leading-relaxed">
                Raw natural rubber melted into sticky goo in summer and cracked into glass in
                winter. In 1839, Charles Goodyear accidentally dropped a mixture of India rubber and
                sulfur onto a red-hot wood stove. Instead of melting, it charred into a resilient,
                waterproof, elastic solid.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
