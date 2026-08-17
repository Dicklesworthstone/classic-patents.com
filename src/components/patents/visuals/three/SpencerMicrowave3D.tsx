"use client";

import { Radio } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

export function SpencerMicrowave3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Magnetron & Cavity Resonator State
  const [anodeVoltageKv, setAnodeVoltageKv] = useState<number>(4.2); // 2.0 to 6.0 kV
  const [magneticFieldGauss, setMagneticFieldGauss] = useState<number>(1450); // 800 to 2200 Gauss
  const [rfPowerWatts, setRfPowerWatts] = useState<number>(850); // 200 to 1200 Watts
  const [showSpokeWheel, setShowSpokeWheel] = useState<boolean>(true);
  const [showWaterDipoles, setShowWaterDipoles] = useState<boolean>(true);

  // RF Cavity Physics Calculations
  // Resonant Microwave Frequency: f = 2450 MHz (lambda = 12.2 cm)
  const rfFreqMhz = 2450;
  // Hull Cutoff Magnetic Field: B_c = sqrt(8 * m * V / (e * r_a^2 * (1 - r_c^2/r_a^2)^2))
  // Hull cutoff B_c ∝ √V_a. Calibrated so B_c ≈ 1180 G at the default 4.2 kV anode.
  const hullCutoffGauss = 1180 * Math.sqrt(anodeVoltageKv / 4.2);
  const isOscillating = magneticFieldGauss > hullCutoffGauss;
  const waterDielectricLossDensity = isOscillating ? (rfPowerWatts * 1.8).toFixed(0) : "0";

  const live = useLiveSimParams({
    anodeVoltageKv,
    magneticFieldGauss,
    showSpokeWheel,
    showWaterDipoles,
    isOscillating,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with High-Luminosity Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [12, 10, 15],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS ---
    const copperAnodeMat = new THREE.MeshStandardMaterial({
      color: 0xca8a04, // Polished OFHC copper anode block
      roughness: 0.22,
      metalness: 0.88,
    });

    const cathodeMat = new THREE.MeshStandardMaterial({
      color: 0xef4444, // Heated thoriated tungsten oxide cathode
      roughness: 0.4,
      metalness: 0.5,
      emissive: 0xef4444,
      emissiveIntensity: 0.8,
    });

    const alnicoMagnetMat = new THREE.MeshStandardMaterial({
      color: 0x334155, // Alnico permanent magnet pole piece
      roughness: 0.35,
      metalness: 0.8,
    });

    // --- 3D 8-CAVITY MAGNETRON ANODE BLOCK ---
    const magnetronGroup = new THREE.Group();
    scene.add(magnetronGroup);

    // Central Anode Cylinder with 8 Cylindrical Resonant Cavities
    const anodeOuter = new THREE.Mesh(
      new THREE.CylinderGeometry(4.2, 4.2, 3.4, 48),
      copperAnodeMat,
    );
    anodeOuter.castShadow = true;
    anodeOuter.receiveShadow = true;
    magnetronGroup.add(anodeOuter);

    // Center Bore for Interaction Space
    const centerBore = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 1.6, 3.42, 32),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 }),
    );
    magnetronGroup.add(centerBore);

    // 8 Radial Resonant Hole-and-Slot Cavities
    const numCavities = 8;
    for (let i = 0; i < numCavities; i++) {
      const angle = (i * 2 * Math.PI) / numCavities;
      // Resonant Hole
      const hole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.65, 0.65, 3.42, 16),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 }),
      );
      hole.position.set(Math.cos(angle) * 2.8, 0, Math.sin(angle) * 2.8);
      magnetronGroup.add(hole);

      // Slot opening to center interaction space
      const slot = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 3.42, 0.22),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 }),
      );
      slot.position.set(Math.cos(angle) * 2.1, 0, Math.sin(angle) * 2.1);
      slot.rotation.y = -angle;
      magnetronGroup.add(slot);
    }

    // Central Thermionic Cathode & Heater Filament
    const cathode = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 4.4, 24), cathodeMat);
    cathode.castShadow = true;
    magnetronGroup.add(cathode);

    // Top and Bottom Alnico Magnet Horseshoe Pole Pieces
    const topPole = new THREE.Mesh(new THREE.CylinderGeometry(4.4, 4.4, 0.8, 36), alnicoMagnetMat);
    topPole.position.y = 2.1;
    topPole.castShadow = true;
    const bottomPole = topPole.clone();
    bottomPole.position.y = -2.1;
    magnetronGroup.add(topPole);
    magnetronGroup.add(bottomPole);

    // Output Antenna Coupling Loop & Rectangular Waveguide Horn
    const waveguide = new THREE.Mesh(
      new THREE.BoxGeometry(4.0, 1.8, 2.4),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.85 }),
    );
    waveguide.position.set(5.5, 0, 0);
    waveguide.castShadow = true;
    magnetronGroup.add(waveguide);

    // --- GLOWING ELECTRON SPOKE WHEEL PARTICLES ---
    const electronCount = 280;
    const electronGeo = new THREE.BufferGeometry();
    const electronPos = new Float32Array(electronCount * 3);
    const electronColors = new Float32Array(electronCount * 3);

    const glowTex = createGlowPointTexture();

    for (let i = 0; i < electronCount; i++) {
      const idx = i * 3;
      const spokeIdx = i % 4; // 4 rotating space-charge spokes
      const baseAngle = (spokeIdx * Math.PI) / 2;
      const r = 0.5 + Math.random() * 1.0;
      const spread = (Math.random() - 0.5) * 0.4;
      const theta = baseAngle + spread + r * 0.5;

      electronPos[idx] = Math.cos(theta) * r;
      electronPos[idx + 1] = (Math.random() - 0.5) * 2.2;
      electronPos[idx + 2] = Math.sin(theta) * r;

      electronColors[idx] = 0.2;
      electronColors[idx + 1] = 0.8;
      electronColors[idx + 2] = 1.0;
    }

    electronGeo.setAttribute("position", new THREE.BufferAttribute(electronPos, 3));
    electronGeo.setAttribute("color", new THREE.BufferAttribute(electronColors, 3));

    const spokePoints = new THREE.Points(
      electronGeo,
      new THREE.PointsMaterial({
        size: 0.35,
        map: glowTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    scene.add(spokePoints);

    // --- WATER MOLECULE DIPOLE SIMULATOR ($H_2O$ DIELECTRIC HEATING) ---
    const waterGroup = new THREE.Group();
    waterGroup.position.set(6.2, 0, 0);
    scene.add(waterGroup);

    const waterMolecules: { group: THREE.Group; rotSpeed: number }[] = [];
    for (let w = 0; w < 6; w++) {
      const wMol = new THREE.Group();
      wMol.position.set(
        (Math.random() - 0.5) * 1.8,
        (Math.random() - 0.5) * 1.0,
        (Math.random() - 0.5) * 1.4,
      );

      // Central Oxygen Atom (Red)
      const oxygen = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 }),
      );
      wMol.add(oxygen);

      // Two Hydrogen Atoms (White) bonded at 104.5 degrees
      const h1 = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 }),
      );
      h1.position.set(0.25, 0.18, 0);
      const h2 = h1.clone();
      h2.position.set(-0.25, 0.18, 0);
      wMol.add(h1);
      wMol.add(h2);

      waterGroup.add(wMol);
      waterMolecules.push({ group: wMol, rotSpeed: 4.0 + Math.random() * 8.0 });
    }

    // --- RENDER LOOP & REAL-TIME PHYSICS SIMULATION ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const p = live.current;

      // Cyclotron Electron Spoke Wheel Rotation: v_drift = E x B / B^2
      if (p.isOscillating) {
        const driftAngularSpeed = (p.anodeVoltageKv / 4.0) * (1450 / p.magneticFieldGauss) * 8.0;
        const ePos = electronPos;

        for (let i = 0; i < electronCount; i++) {
          const idx = i * 3;
          const x = ePos[idx];
          const z = ePos[idx + 2];
          const r = Math.sqrt(x * x + z * z);
          let angle = Math.atan2(z, x);
          angle += driftAngularSpeed * delta;

          ePos[idx] = Math.cos(angle) * r;
          ePos[idx + 2] = Math.sin(angle) * r;
        }
        electronGeo.attributes.position.needsUpdate = true;
      }
      spokePoints.visible = p.showSpokeWheel && p.isOscillating;

      // Rotate and oscillate polar water dipoles to simulate dielectric friction heating
      for (const mol of waterMolecules) {
        if (p.isOscillating) {
          mol.group.rotation.x = Math.sin(elapsed * mol.rotSpeed) * 1.8;
          mol.group.rotation.y = Math.cos(elapsed * mol.rotSpeed) * 1.8;
        }
      }
      waterGroup.visible = p.showWaterDipoles;

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
              <Radio className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              Cavity Magnetron Oscillation
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs font-sans">
              <div>
                <span className="text-ink-600 dark:text-ink-400">Resonant Frequency:</span>{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {rfFreqMhz} MHz (λ = 12.2 cm)
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">RF Output Power:</span>{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {isOscillating ? `${rfPowerWatts} W CW` : "0 W (Cutoff)"}
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Hull Cutoff $B_c$:</span>{" "}
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {hullCutoffGauss} Gauss
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Dielectric Heat Rate:</span>{" "}
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {waterDielectricLossDensity} W/kg
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isOscillating ? "bg-emerald-500 animate-pulse" : "bg-red-500"
              }`}
            />
            <span>
              {isOscillating
                ? "Crossed-Field Cyclotron Resonance: Electron Spokes Trapped"
                : "Sub-Critical Field: Electrons Anode-Colliding (No Resonance)"}
            </span>
          </div>
        </div>

        {/* Toggle Controls */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            type="button"
            onClick={() => setShowSpokeWheel(!showSpokeWheel)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all ${
              showSpokeWheel
                ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                : "bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
            }`}
          >
            Electron Spokes
          </button>
          <button
            type="button"
            onClick={() => setShowWaterDipoles(!showWaterDipoles)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all ${
              showWaterDipoles
                ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                : "bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
            }`}
          >
            H₂O Dipoles
          </button>
        </div>
      </div>

      {/* Parameter Sliders Panel */}
      <div className="p-4 sm:p-5 bg-parchment-100/80 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
        {/* Anode Voltage */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Anode High Voltage ($V_a$):</span>
            <span className="font-bold text-amber-700 dark:text-amber-400">
              {anodeVoltageKv.toFixed(1)} kV
            </span>
          </div>
          <input
            type="range"
            min="2.0"
            max="6.0"
            step="0.2"
            value={anodeVoltageKv}
            onChange={(e) => setAnodeVoltageKv(Number(e.target.value))}
            className="w-full accent-amber-600 dark:accent-amber-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Radial electrostatic field acceleration $E_r$
          </span>
        </div>

        {/* Magnetic Field */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Axial Magnetic Field ($B_z$):</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {magneticFieldGauss} Gauss
            </span>
          </div>
          <input
            type="range"
            min="800"
            max="2200"
            step="50"
            value={magneticFieldGauss}
            onChange={(e) => setMagneticFieldGauss(Number(e.target.value))}
            className="w-full accent-blue-600 dark:accent-blue-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Alnico magnet flux curling electron trajectories
          </span>
        </div>

        {/* RF Microwave Power */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Output Microwave Power:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {rfPowerWatts} W
            </span>
          </div>
          <input
            type="range"
            min="200"
            max="1200"
            step="50"
            value={rfPowerWatts}
            onChange={(e) => setRfPowerWatts(Number(e.target.value))}
            className="w-full accent-emerald-600 dark:accent-emerald-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Energy delivered to waveguide aperture
          </span>
        </div>

        {/* Dielectric Heating Efficiency */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Percy Spencer Popcorn Test:</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">
              {isOscillating ? "Kernels Popping (100°C+)" : "Cold"}
            </span>
          </div>
          <div className="w-full bg-parchment-300 dark:bg-ink-800 rounded-full h-3 overflow-hidden mt-2 border border-parchment-400 dark:border-ink-700">
            <div
              className="bg-gradient-to-r from-blue-500 via-amber-500 to-red-500 h-full transition-all duration-300"
              style={{ width: `${isOscillating ? (rfPowerWatts / 1200) * 100 : 0}%` }}
            />
          </div>
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Molecular rotation at 2.45 billion flips/sec
          </span>
        </div>
      </div>
    </div>
  );
}
