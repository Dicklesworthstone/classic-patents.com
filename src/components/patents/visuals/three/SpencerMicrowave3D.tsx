"use client";

import { Flame } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createThreeStudioScene } from "./ThreeStudioScene";

export function SpencerMicrowave3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Microwave Magnetron Parameters
  const [magneticFieldTesla, setMagneticFieldTesla] = useState<number>(0.12); // B-field (0.05 to 0.30 T)
  const [anodeVoltageKv, setAnodeVoltageKv] = useState<number>(4.0); // Anode Voltage (1.0 to 8.0 kV)
  const [foodMoisturePercent, setFoodMoisturePercent] = useState<number>(75); // % water content
  const [showWaveguide, setShowWaveguide] = useState<boolean>(true);
  const [showElectrons, setShowElectrons] = useState<boolean>(true);

  // Physics Calculations
  const electronCharge = 1.602e-19;
  const electronMass = 9.109e-31;
  const cyclotronFreqGhz =
    (electronCharge * magneticFieldTesla) / (2 * Math.PI * electronMass * 1e9);
  const rfPowerWatts = Math.round(anodeVoltageKv * 1000 * 0.3 * (foodMoisturePercent / 100));
  const heatingRateDegPerSec = (rfPowerWatts / 250).toFixed(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with Museum Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [15, 11, 17],
      targetPos: [0, 0, 0],
      bgBottomColor: 0x0f172a,
      rimColor: 0xf59e0b,
      ambientIntensity: 1.3,
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS ---
    const copperAnodeMaterial = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.9,
      roughness: 0.2,
    });

    const cathodeMaterial = new THREE.MeshStandardMaterial({
      color: 0xff4500,
      emissive: 0xff2200,
      emissiveIntensity: 0.9,
      metalness: 0.5,
      roughness: 0.3,
    });

    const waveMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });

    // --- 3D CAVITY MAGNETRON ANODE BLOCK ---
    const magnetronGroup = new THREE.Group();
    scene.add(magnetronGroup);

    // Outer Heavy Copper Cylindrical Shell
    const outerAnodeGeo = new THREE.CylinderGeometry(6.5, 6.5, 5.0, 48, 1, true);
    const outerAnodeMesh = new THREE.Mesh(outerAnodeGeo, copperAnodeMaterial);
    magnetronGroup.add(outerAnodeMesh);

    // 8 Cylindrical Resonant Cavities Cut Into Anode Vanes
    const numCavities = 8;
    for (let i = 0; i < numCavities; i++) {
      const angle = (i * 2 * Math.PI) / numCavities;
      const vaneGroup = new THREE.Group();
      vaneGroup.rotation.y = angle;

      // Resonant Hole
      const cavityHole = new THREE.Mesh(
        new THREE.CylinderGeometry(1.2, 1.2, 5.0, 24),
        copperAnodeMaterial,
      );
      cavityHole.position.set(4.0, 0, 0);
      vaneGroup.add(cavityHole);

      // Slot opening into Interaction Space
      const slotMesh = new THREE.Mesh(new THREE.BoxGeometry(1.6, 5.0, 0.4), copperAnodeMaterial);
      slotMesh.position.set(2.4, 0, 0);
      vaneGroup.add(slotMesh);

      magnetronGroup.add(vaneGroup);
    }

    // Central Thermionic Heated Tungsten/Barium Cathode Rod
    const cathodeRod = new THREE.Mesh(
      new THREE.CylinderGeometry(1.0, 1.0, 6.0, 24),
      cathodeMaterial,
    );
    magnetronGroup.add(cathodeRod);

    // Output Antenna Coupling Loop & Waveguide Launcher
    const antennaGroup = new THREE.Group();
    const probeMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 6.0, 16),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.95 }),
    );
    probeMesh.position.set(4.0, 4.0, 0);
    antennaGroup.add(probeMesh);

    const waveguideBox = new THREE.Mesh(new THREE.BoxGeometry(3.0, 8.0, 4.5), waveMaterial);
    waveguideBox.position.set(4.0, 5.5, 0);
    antennaGroup.add(waveguideBox);
    magnetronGroup.add(antennaGroup);

    // --- 3D ROTATING ELECTRON SPOKE WHEEL PARTICLES ---
    const numElectrons = 350;
    const electronGeo = new THREE.BufferGeometry();
    const electronPositions = new Float32Array(numElectrons * 3);
    const electronColors = new Float32Array(numElectrons * 3);

    for (let i = 0; i < numElectrons; i++) {
      electronColors[i * 3] = 0.2;
      electronColors[i * 3 + 1] = 0.8;
      electronColors[i * 3 + 2] = 1.0;
    }
    electronGeo.setAttribute("position", new THREE.BufferAttribute(electronPositions, 3));
    electronGeo.setAttribute("color", new THREE.BufferAttribute(electronColors, 3));

    const electronPoints = new THREE.Points(
      electronGeo,
      new THREE.PointsMaterial({ size: 0.2, vertexColors: true, transparent: true, opacity: 0.85 }),
    );
    magnetronGroup.add(electronPoints);

    // --- WATER MOLECULE ROTATING ELECTRIC DIPOLE LATTICE ---
    const waterGroup = new THREE.Group();
    waterGroup.position.set(-10, 0, 0);
    scene.add(waterGroup);

    const foodPlate = new THREE.Mesh(
      new THREE.CylinderGeometry(3.5, 3.5, 0.4, 32),
      new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.3, roughness: 0.7 }),
    );
    foodPlate.position.y = -2.5;
    waterGroup.add(foodPlate);

    const dipoles: THREE.Group[] = [];
    const dipoleCount = 14;
    for (let i = 0; i < dipoleCount; i++) {
      const dGroup = new THREE.Group();
      const radius = Math.random() * 2.6;
      const theta = Math.random() * Math.PI * 2;
      dGroup.position.set(
        Math.cos(theta) * radius,
        -2.0 + Math.random() * 1.5,
        Math.sin(theta) * radius,
      );

      // Oxygen atom (Red)
      const oxygen = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xef4444 }),
      );
      dGroup.add(oxygen);

      // 2 Hydrogen atoms (White)
      const h1 = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0xffffff }),
      );
      h1.position.set(0.35, 0.25, 0);
      dGroup.add(h1);

      const h2 = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0xffffff }),
      );
      h2.position.set(-0.35, 0.25, 0);
      dGroup.add(h2);

      dipoles.push(dGroup);
      waterGroup.add(dGroup);
    }

    // --- ANIMATION & PHYSICS INTEGRATION LOOP ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      controls.update();

      antennaGroup.visible = showWaveguide;
      electronPoints.visible = showElectrons;

      // Crossed Electric and Magnetic Fields Spoke Rotation: v_d = E / B
      const spokeAngularSpeed = (anodeVoltageKv / (magneticFieldTesla * 10)) * 2.5;

      const positions = electronGeo.attributes.position.array as Float32Array;
      const spokeCount = 4;

      for (let i = 0; i < numElectrons; i++) {
        const spokeIdx = i % spokeCount;
        const baseSpokeAngle = (spokeIdx * 2 * Math.PI) / spokeCount + time * spokeAngularSpeed;
        const radiusProgress = ((i * 7) % 100) / 100;
        const r = 1.0 + radiusProgress * 2.5;
        const spiralOffset = radiusProgress * 0.8;
        const currentAngle = baseSpokeAngle + spiralOffset;

        positions[i * 3] = Math.cos(currentAngle) * r;
        positions[i * 3 + 1] = ((i % 17) - 8) * 0.22;
        positions[i * 3 + 2] = Math.sin(currentAngle) * r;
      }
      electronGeo.attributes.position.needsUpdate = true;

      // Water Dipole Dielectric Oscillation
      const rfPhase = time * 20.0;
      dipoles.forEach((d, idx) => {
        d.rotation.x = Math.sin(rfPhase + idx) * 1.2;
        d.rotation.y = Math.cos(rfPhase * 0.8 + idx) * 0.9;
        d.position.y = -2.0 + Math.sin(time * 30.0 + idx) * 0.1;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      studio.dispose();
    };
  }, [anodeVoltageKv, magneticFieldTesla, showWaveguide, showElectrons]);

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Flame className="w-6 h-6 text-amber-500 animate-pulse" />
            <h3 className="font-serif text-2xl font-bold text-ink-950 dark:text-parchment-50">
              3D Real-Time Spencer Cavity Magnetron &amp; Microwave Simulator (US 2,495,429)
            </h3>
          </div>
          <p className="text-sm sm:text-base text-ink-700 dark:text-ink-300 mt-1">
            Studio-illuminated Three.js electrodynamic simulation of{" "}
            <strong>
              crossed $\vec&#123;E&#125; \times \vec&#123;B&#125;$ electron wheel spokes
            </strong>{" "}
            and <strong>2.45 GHz dielectric water heating</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-xs sm:text-sm font-mono font-bold border border-amber-300 dark:border-amber-800 shadow-2xs">
            2.45 GHz ISM Band
          </div>
        </div>
      </div>

      {/* 3D WebGL Canvas & HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-[#0f172a] border border-parchment-300 dark:border-ink-800 relative min-h-[460px] overflow-hidden shadow-inner">
          {/* Top HUD */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none text-xs sm:text-sm font-mono">
            <div className="px-3.5 py-1.5 bg-ink-900/90 border border-ink-800 text-amber-300 rounded-xl shadow-md">
              RF Thermal Power: <span className="font-bold">{rfPowerWatts} Watts</span> (
              {heatingRateDegPerSec} °C/sec)
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={() => setShowWaveguide(!showWaveguide)}
                className={`px-3 py-1 rounded-lg border text-xs font-mono transition-colors ${
                  showWaveguide
                    ? "bg-amber-600 text-white border-amber-500"
                    : "bg-ink-900 text-ink-400 border-ink-800"
                }`}
              >
                Waveguide: {showWaveguide ? "ON" : "OFF"}
              </button>
              <button
                type="button"
                onClick={() => setShowElectrons(!showElectrons)}
                className={`px-3 py-1 rounded-lg border text-xs font-mono transition-colors ${
                  showElectrons
                    ? "bg-blue-600 text-white border-blue-500"
                    : "bg-ink-900 text-ink-400 border-ink-800"
                }`}
              >
                Electrons: {showElectrons ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* 3D Canvas */}
          <div ref={containerRef} className="w-full h-[460px] cursor-grab active:cursor-grabbing" />

          {/* Bottom Telemetry */}
          <div className="w-full grid grid-cols-4 gap-3 text-center text-sm font-mono p-4 bg-ink-950/95 border-t border-ink-800 text-ink-300 z-10">
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                CYCLOTRON FREQ
              </span>
              <span className="text-emerald-400 font-bold text-sm sm:text-base">
                {cyclotronFreqGhz.toFixed(2)} GHz
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                ANODE VOLTAGE
              </span>
              <span className="text-amber-400 font-bold text-sm sm:text-base">
                {anodeVoltageKv.toFixed(1)} kV
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                MAG FIELD (B)
              </span>
              <span className="text-blue-400 font-bold text-sm sm:text-base">
                {magneticFieldTesla.toFixed(2)} T
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
              Magnetron Cross-Field Controls
            </span>

            {/* Anode Voltage Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  DC Anode Potential ($V_a$)
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {anodeVoltageKv} kV
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="8.0"
                step="0.2"
                value={anodeVoltageKv}
                onChange={(e) => setAnodeVoltageKv(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Magnetic Field B Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Axial Magnetic Flux ($B_z$)
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {magneticFieldTesla} Tesla
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.30"
                step="0.01"
                value={magneticFieldTesla}
                onChange={(e) => setMagneticFieldTesla(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Food Moisture Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  {"Food Moisture (H₂O Dipoles)"}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {foodMoisturePercent}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={foodMoisturePercent}
                onChange={(e) => setFoodMoisturePercent(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-ink-950 dark:text-parchment-100 text-xs sm:text-sm font-sans space-y-1.5">
              <span className="font-bold text-amber-900 dark:text-amber-300 block font-mono text-xs uppercase tracking-wider">
                Spencer&apos;s Accidental Discovery:
              </span>
              <p className="leading-relaxed">
                While testing Raytheon radar magnetrons, Spencer felt a peanut butter candy bar melt
                in his pocket. He then placed popcorn kernels next to the waveguide, causing them to
                explode across the laboratory floor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
