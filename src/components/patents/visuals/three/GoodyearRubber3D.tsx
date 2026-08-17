"use client";

import { Layers, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

export function GoodyearRubber3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Vulcanization Chemistry State Controls
  const [sulfurWeightPct, setSulfurWeightPct] = useState<number>(4.5); // 0.5 to 15%
  const [cureTemperatureCelsius, setCureTemperatureCelsius] = useState<number>(140); // 20 to 180 °C
  const [appliedTensileStretch, setAppliedTensileStretch] = useState<number>(1.6); // 1.0 to 3.5×
  const [showSulfurCrosslinks, setShowSulfurCrosslinks] = useState<boolean>(true);

  // Vulcanization Physics & Polymer Mechanics Calculations
  // Crosslink Density: nu = rho * (sulfur% / 100) / M_sulfur
  const isVulcanized = sulfurWeightPct >= 2.0 && cureTemperatureCelsius >= 120;
  const tensileElasticModulusMpa = isVulcanized
    ? (1.2 * (sulfurWeightPct / 3.0) ** 1.3).toFixed(2)
    : "0.15";
  const glassTransitionTempC = Math.round(-70 + sulfurWeightPct * 4.5);
  const thermalStability =
    cureTemperatureCelsius > 165
      ? "Degradation (Overcured)"
      : isVulcanized
        ? "Stable (-40°C to +120°C)"
        : "Melted Stickiness / Cold Embrittlement";

  const live = useLiveSimParams({
    appliedTensileStretch,
    showSulfurCrosslinks,
    isVulcanized,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with High-Luminosity Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [11, 8, 13],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS ---
    const polyisopreneCarbonMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b, // Polyisoprene polymer backbone (Carbon)
      roughness: 0.5,
      metalness: 0.3,
    });

    const sulfurBridgeMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15, // Elemental sulfur cross-linking bridge (-S-S-)
      roughness: 0.2,
      metalness: 0.7,
      emissive: 0xeab308,
      emissiveIntensity: 0.4,
    });

    const clampMat = new THREE.MeshStandardMaterial({
      color: 0x475569, // Tensile test steel tensile grips
      roughness: 0.15,
      metalness: 0.9,
    });

    // --- 3D POLYMER NETWORK ASSEMBLY ---
    const rubberGroup = new THREE.Group();
    scene.add(rubberGroup);

    // Left and Right Tensile Grip Clamps with Knurled Thumbscrews
    const leftClampG = new THREE.Group();
    leftClampG.position.set(-4.5, 0, 0);

    const leftClamp = new THREE.Mesh(new THREE.BoxGeometry(0.85, 4.4, 3.4), clampMat);
    leftClamp.castShadow = true;
    leftClampG.add(leftClamp);

    // Knurled Brass Tightening Screws
    [-1.4, 1.4].forEach((sy) => {
      const screw = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.35, 0.6, 24),
        new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.2 }),
      );
      screw.rotation.z = Math.PI / 2;
      screw.position.set(-0.6, sy, 0);
      leftClampG.add(screw);
    });
    rubberGroup.add(leftClampG);

    const rightClampG = new THREE.Group();
    rightClampG.position.set(4.5, 0, 0);

    const rightClamp = new THREE.Mesh(new THREE.BoxGeometry(0.85, 4.4, 3.4), clampMat);
    rightClamp.castShadow = true;
    rightClampG.add(rightClamp);

    [-1.4, 1.4].forEach((sy) => {
      const screw = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.35, 0.6, 24),
        new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.2 }),
      );
      screw.rotation.z = Math.PI / 2;
      screw.position.set(0.6, sy, 0);
      rightClampG.add(screw);
    });
    rubberGroup.add(rightClampG);

    // Entangled cis-1,4-Polyisoprene Chains (4 Polymer Chains)
    const chains: { curve: THREE.CatmullRomCurve3; mesh: THREE.Mesh; basePts: THREE.Vector3[] }[] =
      [];
    const numChains = 4;

    for (let c = 0; c < numChains; c++) {
      const yBase = (c - (numChains - 1) / 2) * 1.0;
      const pts: THREE.Vector3[] = [];
      const numSegments = 10;

      for (let s = 0; s <= numSegments; s++) {
        const x = -4.0 + (s / numSegments) * 8.0;
        const y = yBase + Math.sin(s * 1.5 + c) * 0.4;
        const z = Math.cos(s * 1.8 + c) * 0.6;
        pts.push(new THREE.Vector3(x, y, z));
      }

      const curve = new THREE.CatmullRomCurve3(pts);
      const geo = new THREE.TubeGeometry(curve, 40, 0.12, 8, false);
      const mesh = new THREE.Mesh(geo, polyisopreneCarbonMat);
      mesh.castShadow = true;
      rubberGroup.add(mesh);

      chains.push({ curve, mesh, basePts: pts });
    }

    // Sulfur Disulfide Bridge Atoms & Covalent Crosslink Struts (-S-S-)
    const sulfurBridgesGroup = new THREE.Group();
    const numBridges = 8;
    const sulfurSpheres: THREE.Mesh[] = [];

    for (let b = 0; b < numBridges; b++) {
      const x = -3.0 + (b / numBridges) * 6.0;
      const bridgeG = new THREE.Group();
      bridgeG.position.set(x, (Math.random() - 0.5) * 1.6, (Math.random() - 0.5) * 0.8);

      const sAtom1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), sulfurBridgeMat);
      sAtom1.position.y = -0.22;
      bridgeG.add(sAtom1);

      const sAtom2 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), sulfurBridgeMat);
      sAtom2.position.y = 0.22;
      bridgeG.add(sAtom2);

      const sBond = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.44, 8),
        new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.5 }),
      );
      bridgeG.add(sBond);

      bridgeG.castShadow = true;
      sulfurBridgesGroup.add(bridgeG);
      sulfurSpheres.push(sAtom1);
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

      // Tensile Stretch Extension Factor
      const stretch = p.appliedTensileStretch;
      rightClamp.position.x = 4.5 * stretch;
      leftClamp.position.x = -4.5 * stretch;

      // Deform polymer chains smoothly with scale and oscillation
      const uncoilFactor = Math.max(0.1, 1.0 / stretch);
      for (let c = 0; c < chains.length; c++) {
        const item = chains[c];
        item.mesh.scale.set(stretch, uncoilFactor, uncoilFactor);
        item.mesh.position.y = Math.sin(elapsed * 3.0 + c) * (p.isVulcanized ? 0.04 : 0.12);
        item.mesh.position.z = Math.cos(elapsed * 3.0 + c) * (p.isVulcanized ? 0.04 : 0.12);
      }

      // Sulfur bridges visibility & positioning
      sulfurBridgesGroup.visible = p.showSulfurCrosslinks && p.isVulcanized;
      for (let b = 0; b < numBridges; b++) {
        const sphere = sulfurSpheres[b];
        sphere.position.x = (-3.0 + (b / numBridges) * 6.0) * stretch;
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
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
            <div className="text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              Vulcanized Elastomer Telemetry
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs font-sans">
              <div>
                <span className="text-ink-600 dark:text-ink-400">Tensile Modulus ($E$):</span>{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {tensileElasticModulusMpa} MPa
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Applied Elongation:</span>{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {(appliedTensileStretch * 100).toFixed(0)}% (λ ={" "}
                  {appliedTensileStretch.toFixed(2)})
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Thermal Property:</span>{" "}
                <span
                  className={`font-bold ${
                    isVulcanized
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {thermalStability}
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Glass Transition ($T_g$):</span>{" "}
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {glassTransitionTempC}°C
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>
              {isVulcanized
                ? "Sulfur Cross-Links Transform Liquid Viscous Flow into True Rubber Elasticity"
                : "Unvulcanized Raw Hevea Gum (Subject to Thermal Breakdown)"}
            </span>
          </div>
        </div>

        {/* Toggle Controls */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            type="button"
            onClick={() => setShowSulfurCrosslinks(!showSulfurCrosslinks)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all ${
              showSulfurCrosslinks
                ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                : "bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
            }`}
          >
            Sulfur Bridges
          </button>
        </div>
      </div>

      {/* Parameter Sliders Panel */}
      <div className="p-4 sm:p-5 bg-parchment-100/80 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
        {/* Sulfur Proportion */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Sulfur Cross-Linker:</span>
            <span className="font-bold text-amber-700 dark:text-amber-400">
              {sulfurWeightPct.toFixed(1)} wt%
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="15.0"
            step="0.5"
            value={sulfurWeightPct}
            onChange={(e) => setSulfurWeightPct(Number(e.target.value))}
            className="w-full accent-amber-600 dark:accent-amber-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Forms covalent disulfide cross-links (-S_x-)
          </span>
        </div>

        {/* Vulcanization Cure Temperature */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>{"Stove Heating ($T_{cure}$):"}</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {cureTemperatureCelsius}°C
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="180"
            step="5"
            value={cureTemperatureCelsius}
            onChange={(e) => setCureTemperatureCelsius(Number(e.target.value))}
            className="w-full accent-blue-600 dark:accent-blue-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Goodyear's potbelly stove accidental heating (1839)
          </span>
        </div>

        {/* Tensile Stretch Pull */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Tensile Stretch (Extension):</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {appliedTensileStretch.toFixed(2)}×
            </span>
          </div>
          <input
            type="range"
            min="1.0"
            max="3.0"
            step="0.1"
            value={appliedTensileStretch}
            onChange={(e) => setAppliedTensileStretch(Number(e.target.value))}
            className="w-full accent-emerald-600 dark:accent-emerald-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Entropic spring recovery $\sigma = G(\lambda - 1/\lambda^2)$
          </span>
        </div>

        {/* Elastic Memory Retentivity */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Elastic Memory Snap:</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">
              {isVulcanized ? "100% Snapback" : "Permanent Plastic Deformation"}
            </span>
          </div>
          <div className="w-full bg-parchment-300 dark:bg-ink-800 rounded-full h-3 overflow-hidden mt-2 border border-parchment-400 dark:border-ink-700">
            <div
              className={`h-full transition-all duration-300 ${
                isVulcanized ? "bg-gradient-to-r from-blue-500 to-emerald-500" : "bg-amber-500"
              }`}
              style={{ width: `${isVulcanized ? 95 : 20}%` }}
            />
          </div>
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            US 3,633 created the modern global rubber industry
          </span>
        </div>
      </div>
    </div>
  );
}
