"use client";

import { Flame, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";

export function FermiReactor3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Nuclear Reactor Kinetics State Controls
  const [controlRodWithdrawalPct, setControlRodWithdrawalPct] = useState<number>(65); // 0 to 100%
  const [moderatorPurityPct, setModeratorPurityPct] = useState<number>(99.9); // 95 to 99.99%
  const [fuelEnrichmentPct, setFuelEnrichmentPct] = useState<number>(0.72); // 0.72% natural U
  const [showNeutronCascade, _setShowNeutronCascade] = useState<boolean>(true);

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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with High-Luminosity Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [13, 10, 16],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS ---
    const graphiteMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b, // High-purity graphite carbon moderator blocks
      roughness: 0.5,
      metalness: 0.6,
    });

    const uraniumFuelMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Metallic natural uranium fuel cylinders
      roughness: 0.3,
      metalness: 0.85,
    });

    const cadmiumRodMat = new THREE.MeshStandardMaterial({
      color: 0x64748b, // Cadmium neutron-absorbing control rods
      roughness: 0.15,
      metalness: 0.95,
    });

    const timberSupportMat = new THREE.MeshStandardMaterial({
      color: 0x78350f, // Pine timber support framing (CP-1 squash court)
      roughness: 0.6,
      metalness: 0.1,
    });

    // --- 3D REACTOR CORE LATTICE ASSEMBLY ---
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Pine Timber Base Scaffold
    const timberBase = new THREE.Mesh(new THREE.BoxGeometry(10.0, 0.8, 10.0), timberSupportMat);
    timberBase.position.y = -3.4;
    timberBase.receiveShadow = true;
    coreGroup.add(timberBase);

    // Graphite Moderator Block Matrix (Layered Chicago Pile)
    const pileGroup = new THREE.Group();
    const layerSize = 5;
    const blockSize = 1.4;

    for (let x = 0; x < layerSize; x++) {
      for (let z = 0; z < layerSize; z++) {
        for (let y = 0; y < 4; y++) {
          const block = new THREE.Mesh(
            new THREE.BoxGeometry(blockSize * 0.95, 0.7, blockSize * 0.95),
            graphiteMat,
          );
          block.position.set((x - 2) * blockSize, -2.6 + y * 0.75, (z - 2) * blockSize);
          block.castShadow = true;
          block.receiveShadow = true;
          pileGroup.add(block);
        }
      }
    }
    coreGroup.add(pileGroup);

    // Embedded Cylindrical Uranium Fuel Lumps
    const fuelGroup = new THREE.Group();
    for (let x = -1; x <= 1; x++) {
      for (let z = -1; z <= 1; z++) {
        const fuel = new THREE.Mesh(
          new THREE.CylinderGeometry(0.22, 0.22, 2.8, 16),
          uraniumFuelMat,
        );
        fuel.position.set(x * blockSize * 1.5, -1.4, z * blockSize * 1.5);
        fuel.castShadow = true;
        fuelGroup.add(fuel);
      }
    }
    coreGroup.add(fuelGroup);

    // Movable Cadmium Control Rods (Vertical Channels)
    const rodGroup = new THREE.Group();
    const rod1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4.5, 16), cadmiumRodMat);
    rod1.position.set(-0.8, 0, 0);
    rod1.castShadow = true;
    const rod2 = rod1.clone();
    rod2.position.set(0.8, 0, 0);
    rodGroup.add(rod1);
    rodGroup.add(rod2);
    coreGroup.add(rodGroup);

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

      // Radiant Electric Blue Cherenkov & Fast Yellow Neutrons
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

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Control Rod Vertical Height Position
      const targetRodY = -0.5 + (controlRodWithdrawalPct / 100) * 3.2;
      rodGroup.position.y += (targetRodY - rodGroup.position.y) * 0.1;

      // Animate Thermal Neutron Diffusion & Scattering
      if (showNeutronCascade) {
        const nPos = neutronPos;
        const speed = (Number(kEff) / 1.0) * 4.0 * delta;

        for (let i = 0; i < neutronCount; i++) {
          const idx = i * 3;
          // Random Brownian elastic scattering step in graphite
          nPos[idx] += (Math.random() - 0.5) * speed;
          nPos[idx + 1] += (Math.random() - 0.5) * speed;
          nPos[idx + 2] += (Math.random() - 0.5) * speed;

          // Boundary wrapping inside core volume
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
  }, [controlRodWithdrawalPct, showNeutronCascade, kEff]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      {/* 3D WebGL Canvas Viewport */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Live HUD Telemetry Overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
            <div className="text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              Neutronic Criticality Telemetry
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs font-sans">
              <div>
                <span className="text-ink-600 dark:text-ink-400">{"Effective $k_{eff}$:"}</span>{" "}
                <span
                  className={`font-bold ${
                    isCritical
                      ? "text-emerald-600 dark:text-emerald-400"
                      : isSupercritical
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {kEff} (
                  {isCritical ? "Critical" : isSupercritical ? "Supercritical" : "Subcritical"})
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Thermal Output:</span>{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {reactorPowerWatts} Watts ($th$)
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Reactivity ($\rho$):</span>{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {reactivityDollars} $
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Cadmium Rods:</span>{" "}
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {controlRodWithdrawalPct}% Withdrawn
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>Chicago Pile-1 (CP-1): Fermi &amp; Szilard US 2,708,656 ($k \ge 1.0$)</span>
          </div>
        </div>

        {/* Scram Emergency Button */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            type="button"
            onClick={() => setControlRodWithdrawalPct(0)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-sans font-bold bg-red-600 hover:bg-red-700 text-white border border-red-700 shadow-md transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5" />
            SCRAM (Insert Rods)
          </button>
        </div>
      </div>

      {/* Parameter Sliders Panel */}
      <div className="p-4 sm:p-5 bg-parchment-100/80 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
        {/* Control Rod Height */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Cadmium Control Rods:</span>
            <span className="font-bold text-amber-700 dark:text-amber-400">
              {controlRodWithdrawalPct}% Withdrawn
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={controlRodWithdrawalPct}
            onChange={(e) => setControlRodWithdrawalPct(Number(e.target.value))}
            className="w-full accent-amber-600 dark:accent-amber-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Withdrawing reduces thermal neutron capture
          </span>
        </div>

        {/* Moderator Purity */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Graphite Carbon Purity:</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {moderatorPurityPct.toFixed(2)}%
            </span>
          </div>
          <input
            type="range"
            min="95.0"
            max="99.99"
            step="0.05"
            value={moderatorPurityPct}
            onChange={(e) => setModeratorPurityPct(Number(e.target.value))}
            className="w-full accent-blue-600 dark:accent-blue-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Szilard's boron impurity purification breakthrough
          </span>
        </div>

        {/* Fuel Uranium Grade */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Uranium U-235 Ratio:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {fuelEnrichmentPct.toFixed(2)}% (Natural)
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.05"
            value={fuelEnrichmentPct}
            onChange={(e) => setFuelEnrichmentPct(Number(e.target.value))}
            className="w-full accent-emerald-600 dark:accent-emerald-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Heterogeneous lattice achieves $k &gt; 1$ with natural U
          </span>
        </div>

        {/* Criticality Stability */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Criticality State:</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">
              {isCritical
                ? "k = 1.000 Steady"
                : isSupercritical
                  ? "Exponential Flux ↑"
                  : "Decaying Subcritical"}
            </span>
          </div>
          <div className="w-full bg-parchment-300 dark:bg-ink-800 rounded-full h-3 overflow-hidden mt-2 border border-parchment-400 dark:border-ink-700">
            <div
              className={`h-full transition-all duration-300 ${
                isCritical ? "bg-emerald-500" : isSupercritical ? "bg-purple-600" : "bg-amber-500"
              }`}
              style={{ width: `${Math.min(100, Math.max(10, (Number(kEff) / 1.1) * 90))}%` }}
            />
          </div>
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Delayed neutron fraction $\beta = 0.0065$ enables safe control
          </span>
        </div>
      </div>
    </div>
  );
}
