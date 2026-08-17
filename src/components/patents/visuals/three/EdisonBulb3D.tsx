"use client";

import { Lightbulb } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function EdisonBulb3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Electrical & Thermal Simulation State
  const [appliedVoltage, setAppliedVoltage] = useState<number>(110); // 0 to 140 Volts
  const [vacuumTorr, setVacuumTorr] = useState<number>(1e-6); // 1.0 (Atmosphere) down to 1e-6 Torr (High Vacuum)
  const [filamentMaterial, setFilamentMaterial] = useState<"carbonized-bamboo" | "platinum-wire">(
    "carbonized-bamboo",
  );
  const [showGasMolecules, setShowGasMolecules] = useState<boolean>(true);

  // Physics Calculations
  // Resistance: R = 100 Ohms for carbonized bamboo; 4 Ohms for platinum
  const baseResistance = filamentMaterial === "carbonized-bamboo" ? 100 : 4;
  const currentAmps = appliedVoltage / baseResistance;
  const powerWatts = appliedVoltage * currentAmps;
  // Blackbody temperature estimate (Stefan-Boltzmann P = sigma * A * T^4)
  const filamentTempKelvin = Math.round(300 + (powerWatts * 4e10) ** 0.25);
  // Filament Lifespan estimate (Torr dependent - oxidation degradation)
  const estimatedLifespanHours =
    vacuumTorr < 1e-4
      ? Math.round(1200 / (appliedVoltage / 110) ** 3.5)
      : Math.round(0.2 / (vacuumTorr * 100));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 460;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(12, 10, 16);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.replaceChildren(renderer.domElement);

    // --- LIGHTING ---
    scene.add(new THREE.AmbientLight(0xffeedd, 0.4));

    // Dynamic Bulb Radiance Light
    const bulbLight = new THREE.PointLight(0xffaa33, 0, 25);
    bulbLight.position.set(0, 0.5, 0);
    scene.add(bulbLight);

    // --- GRID ---
    const grid = new THREE.GridHelper(30, 20, 0xd97706, 0x1e293b);
    grid.position.y = -6;
    scene.add(grid);

    // --- MATERIALS ---
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      ior: 1.52,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    const brassScrewBaseMaterial = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.9,
      roughness: 0.2,
    });

    const platinumLeadMaterial = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.95,
      roughness: 0.1,
    });

    const filamentMaterialMesh = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      roughness: 0.8,
      metalness: 0.2,
      emissive: 0xff6600,
      emissiveIntensity: 0.0,
    });

    // --- 3D BULB ASSEMBLY ---
    const bulbGroup = new THREE.Group();
    scene.add(bulbGroup);

    // 1. Hand-blown Glass Bulb Envelope
    const glassSphere = new THREE.Mesh(new THREE.SphereGeometry(3.6, 32, 24), glassMaterial);
    glassSphere.position.y = 1.0;
    bulbGroup.add(glassSphere);

    // Glass exhaust seal tip at top (historical hand-evacuated pip)
    const exhaustPip = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.6, 16), glassMaterial);
    exhaustPip.position.set(0, 4.7, 0);
    bulbGroup.add(exhaustPip);

    // Glass Neck Stem
    const glassNeck = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.4, 2.5, 32), glassMaterial);
    glassNeck.position.y = -2.2;
    bulbGroup.add(glassNeck);

    // 2. Brass Screw Base (The universal Edison base E26)
    const baseScrew = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 1.6, 2.0, 32),
      brassScrewBaseMaterial,
    );
    baseScrew.position.y = -3.8;
    bulbGroup.add(baseScrew);

    // 3. Central Glass Mount & Platinum Lead-in Wires
    const innerStem = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 3.0, 16), glassMaterial);
    innerStem.position.y = -1.0;
    bulbGroup.add(innerStem);

    // Twin Platinum Leads passing through glass seal
    const lead1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 3.0, 8),
      platinumLeadMaterial,
    );
    lead1.position.set(-0.6, 0, 0);
    bulbGroup.add(lead1);

    const lead2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 3.0, 8),
      platinumLeadMaterial,
    );
    lead2.position.set(0.6, 0, 0);
    bulbGroup.add(lead2);

    // 4. Edison Horseshoe Carbonized Bamboo Filament (CatmullRom Curve)
    const filamentCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.6, 1.5, 0),
      new THREE.Vector3(-0.8, 2.6, 0.2),
      new THREE.Vector3(0, 3.2, 0),
      new THREE.Vector3(0.8, 2.6, -0.2),
      new THREE.Vector3(0.6, 1.5, 0),
    ]);
    const filamentGeo = new THREE.TubeGeometry(filamentCurve, 32, 0.08, 8, false);
    const filamentMesh = new THREE.Mesh(filamentGeo, filamentMaterialMesh);
    bulbGroup.add(filamentMesh);

    // --- RESIDUAL GAS MOLECULES (Brownian Motion) ---
    const gasCount = 80;
    const gasGeo = new THREE.BufferGeometry();
    const gasPos = new Float32Array(gasCount * 3);
    for (let i = 0; i < gasCount; i++) {
      const radius = Math.random() * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      gasPos[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
      gasPos[i * 3 + 1] = 1.0 + Math.cos(phi) * radius;
      gasPos[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius;
    }
    gasGeo.setAttribute("position", new THREE.BufferAttribute(gasPos, 3));
    const gasPoints = new THREE.Points(
      gasGeo,
      new THREE.PointsMaterial({ color: 0x94a3b8, size: 0.12, transparent: true, opacity: 0.6 }),
    );
    bulbGroup.add(gasPoints);

    // --- MOUSE ORBIT CONTROLS ---
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let sphericalTheta = 0.8;
    let sphericalPhi = 0.45;
    let sphericalRadius = 20;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      sphericalTheta -= deltaX * 0.006;
      sphericalPhi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, sphericalPhi + deltaY * 0.006));
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      sphericalRadius = Math.max(8, Math.min(40, sphericalRadius + e.deltaY * 0.02));
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    dom.addEventListener("wheel", onWheel, { passive: false });

    // --- ANIMATION LOOP ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const _time = clock.getElapsedTime();

      // Camera Orbit
      camera.position.x = sphericalRadius * Math.sin(sphericalTheta) * Math.cos(sphericalPhi);
      camera.position.y = sphericalRadius * Math.sin(sphericalPhi);
      camera.position.z = sphericalRadius * Math.cos(sphericalTheta) * Math.cos(sphericalPhi);
      camera.lookAt(0, 0, 0);

      // Incandescence Intensity & Color Temperature
      const intensityNorm = Math.min(2.0, powerWatts / 60);
      filamentMaterialMesh.emissiveIntensity = intensityNorm * 2.5;

      if (filamentTempKelvin < 1000) {
        filamentMaterialMesh.emissive.setHex(0x551100);
      } else if (filamentTempKelvin < 1800) {
        filamentMaterialMesh.emissive.setHex(0xff3300);
      } else if (filamentTempKelvin < 2400) {
        filamentMaterialMesh.emissive.setHex(0xffaa00);
      } else {
        filamentMaterialMesh.emissive.setHex(0xffffee);
      }

      bulbLight.intensity = intensityNorm * 4.0;
      bulbLight.color.copy(filamentMaterialMesh.emissive);

      // Gas Molecule Brownian Agitation
      gasPoints.visible = showGasMolecules && vacuumTorr > 1e-4;
      if (gasPoints.visible) {
        const positions = gasGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < gasCount; i++) {
          positions[i * 3] += (Math.random() - 0.5) * 0.08;
          positions[i * 3 + 1] += (Math.random() - 0.5) * 0.08;
          positions[i * 3 + 2] += (Math.random() - 0.5) * 0.08;
        }
        gasGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      dom.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      dom.removeEventListener("wheel", onWheel);
      renderer.dispose();
    };
  }, [vacuumTorr, powerWatts, filamentTempKelvin, showGasMolecules]);

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Lightbulb className="w-6 h-6 text-amber-500 animate-pulse" />
            <h3 className="font-serif text-2xl font-bold text-ink-950 dark:text-parchment-50">
              3D Real-Time Edison Incandescent Lamp Simulator (US 223,898)
            </h3>
          </div>
          <p className="text-sm sm:text-base text-ink-700 dark:text-ink-300 mt-1">
            Real-time Three.js thermodynamic simulation of{" "}
            <strong>high-resistance carbon filaments</strong>,{" "}
            <strong>high-vacuum mean free path</strong>, and <strong>Planck incandescence</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-xs sm:text-sm font-mono font-bold border border-amber-300 dark:border-amber-800 shadow-2xs">
            100 Ω High Resistance
          </div>
        </div>
      </div>

      {/* 3D WebGL Canvas & HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-[#0a0f1d] border border-parchment-300 dark:border-ink-800 relative min-h-[460px] overflow-hidden">
          {/* Top HUD */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none text-xs sm:text-sm font-mono">
            <div className="px-3.5 py-1.5 bg-ink-900/90 border border-ink-800 text-amber-300 rounded-xl shadow">
              Radiant Power: <span className="font-bold">{powerWatts.toFixed(1)} Watts</span> (
              {currentAmps.toFixed(2)} Amps)
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={() => setShowGasMolecules(!showGasMolecules)}
                className={`px-3 py-1 rounded-lg border text-xs font-mono transition-colors ${
                  showGasMolecules
                    ? "bg-amber-600 text-white border-amber-500"
                    : "bg-ink-900 text-ink-400 border-ink-800"
                }`}
              >
                Residual Gas: {showGasMolecules ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* 3D Canvas */}
          <div ref={containerRef} className="w-full h-[460px] cursor-grab active:cursor-grabbing" />

          {/* Bottom Telemetry */}
          <div className="w-full grid grid-cols-4 gap-3 text-center text-sm font-mono p-4 bg-ink-950/95 border-t border-ink-800 text-ink-300 z-10">
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                FILAMENT TEMP
              </span>
              <span className="text-amber-400 font-bold text-sm sm:text-base">
                {filamentTempKelvin} K
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                BULB VACUUM
              </span>
              <span className="text-emerald-400 font-bold text-sm sm:text-base">
                {vacuumTorr < 1e-4 ? "10⁻⁶ Torr" : "Atmospheric"}
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                EST. LIFESPAN
              </span>
              <span className="text-blue-400 font-bold text-sm sm:text-base">
                {estimatedLifespanHours > 0 ? `${estimatedLifespanHours} hrs` : "Burnout (<1s)"}
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
              Electrical Potential &amp; Vacuum
            </span>

            {/* Voltage Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Applied DC Voltage ($V$)
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {appliedVoltage} Volts
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="140"
                step="5"
                value={appliedVoltage}
                onChange={(e) => setAppliedVoltage(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Vacuum Switcher */}
            <div className="space-y-1.5">
              <span className="text-xs sm:text-sm font-mono block text-ink-800 dark:text-ink-200 font-semibold mb-1">
                Bulb Vacuum Quality
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm font-mono">
                <button
                  type="button"
                  onClick={() => setVacuumTorr(1e-6)}
                  className={`p-2.5 rounded-xl border text-center transition-colors shadow-2xs ${
                    vacuumTorr < 1e-4
                      ? "bg-amber-700 text-white font-bold"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-800 dark:text-ink-200"
                  }`}
                >
                  ✓ High Vacuum (10⁻⁶ Torr)
                </button>
                <button
                  type="button"
                  onClick={() => setVacuumTorr(1.0)}
                  className={`p-2.5 rounded-xl border text-center transition-colors shadow-2xs ${
                    vacuumTorr >= 1e-4
                      ? "bg-red-700 text-white font-bold"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-800 dark:text-ink-200"
                  }`}
                >
                  Atmospheric (Fast Burn)
                </button>
              </div>
            </div>

            {/* Filament Material Switcher */}
            <div className="space-y-1.5">
              <span className="text-xs sm:text-sm font-mono block text-ink-800 dark:text-ink-200 font-semibold mb-1">
                Filament Material
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm font-mono">
                <button
                  type="button"
                  onClick={() => setFilamentMaterial("carbonized-bamboo")}
                  className={`p-2.5 rounded-xl border text-center transition-colors shadow-2xs ${
                    filamentMaterial === "carbonized-bamboo"
                      ? "bg-amber-700 text-white font-bold"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-800 dark:text-ink-200"
                  }`}
                >
                  Edison Carbonized (100 Ω)
                </button>
                <button
                  type="button"
                  onClick={() => setFilamentMaterial("platinum-wire")}
                  className={`p-2.5 rounded-xl border text-center transition-colors shadow-2xs ${
                    filamentMaterial === "platinum-wire"
                      ? "bg-amber-700 text-white font-bold"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-800 dark:text-ink-200"
                  }`}
                >
                  Low-R Platinum (4 Ω)
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-ink-950 dark:text-parchment-100 text-xs sm:text-sm font-sans space-y-1.5">
              <span className="font-bold text-amber-900 dark:text-amber-300 block font-mono text-xs uppercase tracking-wider">
                Edison&apos;s $I^2R$ Mathematical Breakthrough:
              </span>
              <p className="leading-relaxed">
                Prior inventors used low-resistance thick platinum wires (1–5 Ω), requiring copper
                transmission lines as thick as ship cables to carry massive currents. Edison proved
                that a high-resistance filament (100–200 Ω) allowed thin, economical distribution
                wires in a parallel grid ($P = V^2 / R$).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
