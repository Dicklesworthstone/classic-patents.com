"use client";

import { Lightbulb } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

export function EdisonBulb3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Electrical & Thermal Simulation State
  const [appliedVoltage, setAppliedVoltage] = useState<number>(110); // 0 to 140 Volts
  const [vacuumTorr, setVacuumTorr] = useState<number>(1e-6); // 1.0 down to 1e-6 Torr
  const [filamentMaterial, setFilamentMaterial] = useState<"carbonized-bamboo" | "platinum-wire">(
    "carbonized-bamboo",
  );
  const [showGasMolecules, setShowGasMolecules] = useState<boolean>(true);

  // Physics Calculations
  const baseResistance = filamentMaterial === "carbonized-bamboo" ? 100 : 4;
  const currentAmps = appliedVoltage / baseResistance;
  const powerWatts = appliedVoltage * currentAmps;
  // Blackbody temperature estimate (Stefan-Boltzmann P = sigma * A * T^4)
  const filamentTempKelvin = Math.round(300 + (powerWatts * 4e10) ** 0.25);
  const estimatedLifespanHours =
    vacuumTorr < 1e-4 ? Math.round(1200 / (appliedVoltage / 110) ** 3.5) : 0;

  const live = useLiveSimParams({
    appliedVoltage,
    filamentTempKelvin,
    showGasMolecules,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with Luminous Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [11, 7, 14],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;

    // Dynamic Bulb Point Light (Simulates internal incandescence)
    const bulbLight = new THREE.PointLight(0xffaa33, 0, 30);
    bulbLight.position.set(0, 1.0, 0);
    bulbLight.castShadow = true;
    scene.add(bulbLight);

    // --- PBR MATERIALS ---
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.96,
      opacity: 1,
      transparent: true,
      roughness: 0.03,
      ior: 1.54,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });

    const brassScrewBaseMaterial = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.92,
      roughness: 0.18,
    });

    const platinumLeadMaterial = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.95,
      roughness: 0.1,
    });

    const filamentMaterialMesh = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      roughness: 0.7,
      metalness: 0.3,
      emissive: 0xff6600,
      emissiveIntensity: 0.0,
    });

    // --- 3D BULB ASSEMBLY ---
    const bulbGroup = new THREE.Group();
    scene.add(bulbGroup);

    // Blown Glass Pear-Shaped Envelope
    const glassSphere = new THREE.Mesh(new THREE.SphereGeometry(2.8, 48, 48), glassMaterial);
    glassSphere.position.y = 1.0;
    bulbGroup.add(glassSphere);

    const glassNeck = new THREE.Mesh(
      new THREE.CylinderGeometry(1.25, 2.7, 2.2, 36, 1, true),
      glassMaterial,
    );
    glassNeck.position.y = -1.2;
    bulbGroup.add(glassNeck);

    // Exhaust Pip on Top (Historical Edison detail)
    const exhaustPip = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.45, 16), glassMaterial);
    exhaustPip.position.y = 3.9;
    bulbGroup.add(exhaustPip);

    // Brass Screw Base
    const baseCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(1.22, 1.22, 1.8, 36),
      brassScrewBaseMaterial,
    );
    baseCylinder.position.y = -2.9;
    baseCylinder.castShadow = true;
    bulbGroup.add(baseCylinder);

    // Wooden Display Mount
    const mountStand = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 2.6, 0.7, 32),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.4 }),
    );
    mountStand.position.y = -4.1;
    mountStand.receiveShadow = true;
    bulbGroup.add(mountStand);

    // Internal Glass Stem Mount
    const glassStem = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.5, 2.4, 16), glassMaterial);
    glassStem.position.y = -0.6;
    bulbGroup.add(glassStem);

    // Platinum In-Lead Support Wires
    const leftLead = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 2.8, 8),
      platinumLeadMaterial,
    );
    leftLead.position.set(-0.45, 0.3, 0);
    leftLead.castShadow = true;
    const rightLead = leftLead.clone();
    rightLead.position.set(0.45, 0.3, 0);
    bulbGroup.add(leftLead);
    bulbGroup.add(rightLead);

    // High-Resistance Carbonized Bamboo Filament Loop (Horseshoe Arch)
    const filamentCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.45, 1.7, 0),
      new THREE.Vector3(-0.55, 2.5, 0.05),
      new THREE.Vector3(0, 3.0, 0),
      new THREE.Vector3(0.55, 2.5, -0.05),
      new THREE.Vector3(0.45, 1.7, 0),
    ]);
    const filamentGeo = new THREE.TubeGeometry(filamentCurve, 40, 0.045, 8, false);
    const filamentMesh = new THREE.Mesh(filamentGeo, filamentMaterialMesh);
    bulbGroup.add(filamentMesh);

    // --- RESIDUAL GAS MOLECULES / MEAN FREE PATH SIMULATION ---
    const moleculeCount = vacuumTorr > 1e-4 ? 120 : 18;
    const gasGeo = new THREE.BufferGeometry();
    const gasPositions = new Float32Array(moleculeCount * 3);
    const gasVelocities = new Float32Array(moleculeCount * 3);

    const glowTex = createGlowPointTexture();

    for (let i = 0; i < moleculeCount; i++) {
      const idx = i * 3;
      const r = Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      gasPositions[idx] = r * Math.sin(phi) * Math.cos(theta);
      gasPositions[idx + 1] = 1.0 + r * Math.cos(phi);
      gasPositions[idx + 2] = r * Math.sin(phi) * Math.sin(theta);

      gasVelocities[idx] = (Math.random() - 0.5) * 0.04;
      gasVelocities[idx + 1] = (Math.random() - 0.5) * 0.04;
      gasVelocities[idx + 2] = (Math.random() - 0.5) * 0.04;
    }

    gasGeo.setAttribute("position", new THREE.BufferAttribute(gasPositions, 3));
    const gasPoints = new THREE.Points(
      gasGeo,
      new THREE.PointsMaterial({
        size: 0.35,
        map: glowTex,
        color: 0x93c5fd,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    scene.add(gasPoints);

    // --- RENDER LOOP & REAL-TIME BLACKBODY RADIATION ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const _delta = clock.getDelta();

      const p = live.current;

      // Compute Incandescence Intensity & Color Temperature
      const incandescence = Math.min(1.0, (p.appliedVoltage / 120) ** 2.2);

      // Blackbody Color Ramp: Black -> Dull Cherry (800K) -> Orange-Gold (1800K) -> White-Gold (2400K)
      let r = 0;
      let g = 0;
      let b = 0;

      if (p.filamentTempKelvin < 700) {
        r = 0.1;
        g = 0.05;
        b = 0.05;
      } else if (p.filamentTempKelvin < 1400) {
        r = 0.9;
        g = 0.2 + (p.filamentTempKelvin - 700) / 1400;
        b = 0.05;
      } else {
        r = 1.0;
        g = 0.75 + (p.filamentTempKelvin - 1400) / 4000;
        b = 0.4 + (p.filamentTempKelvin - 1400) / 3000;
      }

      filamentMaterialMesh.emissive = new THREE.Color(r, g, b);
      filamentMaterialMesh.emissiveIntensity = incandescence * 3.5;

      bulbLight.color = new THREE.Color(r, g, b);
      bulbLight.intensity = incandescence * 4.2;

      // Animate Residual Gas Molecules
      const gPos = gasPositions;
      for (let i = 0; i < moleculeCount; i++) {
        const idx = i * 3;
        gPos[idx] += gasVelocities[idx];
        gPos[idx + 1] += gasVelocities[idx + 1];
        gPos[idx + 2] += gasVelocities[idx + 2];

        // Spherical boundary bounce inside bulb
        const dx = gPos[idx];
        const dy = gPos[idx + 1] - 1.0;
        const dz = gPos[idx + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist > 2.5) {
          gasVelocities[idx] *= -1;
          gasVelocities[idx + 1] *= -1;
          gasVelocities[idx + 2] *= -1;
        }
      }
      gasGeo.attributes.position.needsUpdate = true;
      gasPoints.visible = p.showGasMolecules;

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
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              Incandescent Circuit Telemetry
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs font-sans">
              <div>
                <span className="text-ink-600 dark:text-ink-400">Filament Temp:</span>{" "}
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {filamentTempKelvin} K ({filamentTempKelvin - 273}°C)
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Current ($I$):</span>{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {currentAmps.toFixed(2)} A
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Power ($P=V^2/R$):</span>{" "}
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {powerWatts.toFixed(1)} W
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">
                  {"Lifespan ($10^{-6}\\text{Torr}$):"}
                </span>{" "}
                <span
                  className={`font-bold ${
                    estimatedLifespanHours > 800
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {vacuumTorr < 1e-4 ? `${estimatedLifespanHours} hrs` : "Instant Burnout (<1s)"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                vacuumTorr < 1e-4 ? "bg-emerald-500 animate-pulse" : "bg-red-500"
              }`}
            />
            <span>
              {vacuumTorr < 1e-4
                ? "Sprengel Mercury Vacuum: Oxidation Inhibited"
                : "Atmospheric Oxygen Present: Rapid Combustion"}
            </span>
          </div>
        </div>

        {/* Gas Molecule Toggle */}
        <div className="absolute top-4 right-4 z-10">
          <button
            type="button"
            onClick={() => setShowGasMolecules(!showGasMolecules)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all ${
              showGasMolecules
                ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                : "bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
            }`}
          >
            Residual Gas
          </button>
        </div>
      </div>

      {/* Parameter Sliders Panel */}
      <div className="p-4 sm:p-5 bg-parchment-100/80 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
        {/* Applied Voltage */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Terminal Voltage ($V$):</span>
            <span className="font-bold text-amber-700 dark:text-amber-400">{appliedVoltage} V</span>
          </div>
          <input
            type="range"
            min="0"
            max="140"
            step="2"
            value={appliedVoltage}
            onChange={(e) => setAppliedVoltage(Number(e.target.value))}
            className="w-full accent-amber-600 dark:accent-amber-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Edison 110V parallel distribution standard
          </span>
        </div>

        {/* Filament Material */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Filament Composition:</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {filamentMaterial === "carbonized-bamboo" ? "Carbonized Bamboo" : "Platinum Wire"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setFilamentMaterial("carbonized-bamboo")}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold border ${
                filamentMaterial === "carbonized-bamboo"
                  ? "bg-amber-600 text-white border-amber-700 shadow-sm"
                  : "bg-white/80 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
              }`}
            >
              Carbon (100Ω)
            </button>
            <button
              type="button"
              onClick={() => setFilamentMaterial("platinum-wire")}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold border ${
                filamentMaterial === "platinum-wire"
                  ? "bg-amber-600 text-white border-amber-700 shadow-sm"
                  : "bg-white/80 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
              }`}
            >
              Platinum (4Ω)
            </button>
          </div>
        </div>

        {/* Vacuum Level */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Envelope Vacuum:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {vacuumTorr < 1e-4 ? "10⁻⁶ Torr (High Vacuum)" : "1.0 Torr (Air Leaked)"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setVacuumTorr(1e-6)}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold border ${
                vacuumTorr < 1e-4
                  ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                  : "bg-white/80 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
              }`}
            >
              10⁻⁶ Torr (Sealed)
            </button>
            <button
              type="button"
              onClick={() => setVacuumTorr(1.0)}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold border ${
                vacuumTorr >= 1e-4
                  ? "bg-red-600 text-white border-red-700 shadow-sm"
                  : "bg-white/80 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
              }`}
            >
              Air Leak (Burnout)
            </button>
          </div>
        </div>

        {/* Luminous Efficacy */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Luminous Output:</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">
              {(powerWatts * 0.16).toFixed(1)} Lumens (16 cp)
            </span>
          </div>
          <div className="w-full bg-parchment-300 dark:bg-ink-800 rounded-full h-3 overflow-hidden mt-2 border border-parchment-400 dark:border-ink-700">
            <div
              className="bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-200 h-full transition-all duration-300"
              style={{ width: `${Math.min(100, (powerWatts / 150) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Candlepower equivalent: ~16 standard sperm candles
          </span>
        </div>
      </div>
    </div>
  );
}
