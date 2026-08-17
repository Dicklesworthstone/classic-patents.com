"use client";

import { Radio, Tv } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";

export function FarnsworthTV3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Dissector Tube State Controls
  const [acceleratingVoltageKv, setAcceleratingVoltageKv] = useState<number>(3.5); // 1.0 to 6.0 kV
  const [horizontalFreqKhz, setHorizontalFreqKhz] = useState<number>(15.75); // 5 to 30 kHz
  const [verticalFreqHz, setVerticalFreqHz] = useState<number>(60); // 30 to 120 Hz
  const [lightIntensityLux, setLightIntensityLux] = useState<number>(500); // 100 to 2000 Lux
  const [showElectronBeam, setShowElectronBeam] = useState<boolean>(true);
  const [_showMagneticFields, _setShowMagneticFields] = useState<boolean>(true);

  // Electron Optics Physics
  // Electron Velocity: v = sqrt(2 * e * V / m_e)
  const eCharge = 1.602e-19;
  const mElectron = 9.109e-31;
  const velocityMps = Math.sqrt((2 * eCharge * acceleratingVoltageKv * 1000) / mElectron);
  const velocityFractionC = (velocityMps / 3e8) * 100;
  const photocathodeCurrentUa = (lightIntensityLux * 0.045).toFixed(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with High-Luminosity Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [13, 9, 15],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS ---
    const glassEnvelopeMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.94,
      opacity: 1,
      transparent: true,
      roughness: 0.04,
      ior: 1.5,
      side: THREE.DoubleSide,
    });

    const photocathodeMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Cesium-oxide coated photoemissive silver disc
      roughness: 0.35,
      metalness: 0.85,
      emissive: 0x0369a1,
      emissiveIntensity: 0.5,
    });

    const copperDeflectionCoilMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.25,
      metalness: 0.85,
    });

    const anodeBrassMat = new THREE.MeshStandardMaterial({
      color: 0xca8a04,
      roughness: 0.2,
      metalness: 0.9,
    });

    // --- 3D DISSECTOR TUBE ASSEMBLY ---
    const tubeGroup = new THREE.Group();
    scene.add(tubeGroup);

    // Cylindrical Vacuum Glass Envelope
    const glassTube = new THREE.Mesh(
      new THREE.CylinderGeometry(1.8, 1.8, 10.0, 36, 1, true),
      glassEnvelopeMat,
    );
    glassTube.rotation.z = Math.PI / 2;
    tubeGroup.add(glassTube);

    // Front Flat Optical Window
    const frontWindow = new THREE.Mesh(new THREE.CircleGeometry(1.8, 36), glassEnvelopeMat);
    frontWindow.rotation.y = -Math.PI / 2;
    frontWindow.position.x = -5.0;
    tubeGroup.add(frontWindow);

    // Photoelectric Cathode Plate (Backlit optical receiver)
    const photocathode = new THREE.Mesh(new THREE.CircleGeometry(1.6, 36), photocathodeMat);
    photocathode.rotation.y = Math.PI / 2;
    photocathode.position.x = -4.7;
    tubeGroup.add(photocathode);

    // Anode Aperture Finger Target with Electron Multiplier Window
    const anodeFinger = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.25, 1.2, 16),
      anodeBrassMat,
    );
    anodeFinger.position.set(4.8, 0, 0);
    anodeFinger.rotation.z = Math.PI / 2;
    tubeGroup.add(anodeFinger);

    // Magnetic Focus Solenoid Outer Coil
    const focusCoil = new THREE.Mesh(
      new THREE.CylinderGeometry(2.1, 2.1, 6.5, 32, 1, true),
      new THREE.MeshStandardMaterial({
        color: 0x475569,
        roughness: 0.4,
        metalness: 0.7,
        wireframe: true,
      }),
    );
    focusCoil.rotation.z = Math.PI / 2;
    tubeGroup.add(focusCoil);

    // 2-Axis Orthogonal Magnetic Deflection Coils (Horizontal & Vertical)
    const hCoil1 = new THREE.Mesh(
      new THREE.TorusGeometry(2.2, 0.22, 12, 32),
      copperDeflectionCoilMat,
    );
    hCoil1.position.set(0.5, 0, 0);
    tubeGroup.add(hCoil1);

    const vCoil1 = new THREE.Mesh(
      new THREE.TorusGeometry(2.2, 0.22, 12, 32),
      copperDeflectionCoilMat,
    );
    vCoil1.rotation.y = Math.PI / 2;
    vCoil1.position.set(1.8, 0, 0);
    tubeGroup.add(vCoil1);

    // --- GLOWING ELECTRON BEAM PARTICLES ---
    const beamCount = 350;
    const beamGeo = new THREE.BufferGeometry();
    const beamPos = new Float32Array(beamCount * 3);
    const beamColors = new Float32Array(beamCount * 3);

    const glowTex = createGlowPointTexture();

    for (let i = 0; i < beamCount; i++) {
      const idx = i * 3;
      const progress = i / beamCount;
      beamPos[idx] = -4.5 + progress * 9.3;
      beamPos[idx + 1] = 0;
      beamPos[idx + 2] = 0;

      // Bright Blue-Violet Cathode Ray Glow
      beamColors[idx] = 0.3 + progress * 0.4;
      beamColors[idx + 1] = 0.8 + progress * 0.2;
      beamColors[idx + 2] = 1.0;
    }

    beamGeo.setAttribute("position", new THREE.BufferAttribute(beamPos, 3));
    beamGeo.setAttribute("color", new THREE.BufferAttribute(beamColors, 3));

    const beamPoints = new THREE.Points(
      beamGeo,
      new THREE.PointsMaterial({
        size: 0.4,
        map: glowTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    scene.add(beamPoints);

    // --- RENDER LOOP & REAL-TIME ELECTRON RASTER DYNAMICS ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Electron Beam Deflection by Magnetic Lorentz Force: F = q(v x B)
      // High-speed sawtooth deflection in horizontal (X) and vertical (Y)
      const hSawtooth = ((elapsed * 4.0) % 1.0) * 2 - 1; // Simulated horizontal line scan
      const vSawtooth = ((elapsed * 0.8) % 1.0) * 2 - 1; // Simulated vertical frame scan

      const bPos = beamPos;
      for (let i = 0; i < beamCount; i++) {
        const idx = i * 3;
        const progress = (bPos[idx] + 4.5) / 9.3;

        if (progress > 0.4) {
          const deflectFactor = (progress - 0.4) / 0.6;
          bPos[idx + 1] = vSawtooth * 0.9 * deflectFactor;
          bPos[idx + 2] = hSawtooth * 0.9 * deflectFactor;
        } else {
          bPos[idx + 1] = (Math.random() - 0.5) * 0.06;
          bPos[idx + 2] = (Math.random() - 0.5) * 0.06;
        }

        // Particle propagation
        bPos[idx] += delta * 25.0;
        if (bPos[idx] > 4.8) {
          bPos[idx] = -4.5;
        }
      }
      beamGeo.attributes.position.needsUpdate = true;
      beamPoints.visible = showElectronBeam;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      studio.dispose();
    };
  }, [showElectronBeam]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      {/* 3D WebGL Canvas Viewport */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Live HUD Telemetry Overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
            <div className="text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              Image Dissector Telemetry
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs font-sans">
              <div>
                <span className="text-ink-600 dark:text-ink-400">Electron Velocity:</span>{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {(velocityMps / 1e6).toFixed(1)} × 10⁶ m/s ({velocityFractionC.toFixed(2)}% $c$)
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Photocathode Current:</span>{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {photocathodeCurrentUa} µA
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Horizontal Scan Rate:</span>{" "}
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {horizontalFreqKhz} kHz
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Frame Refresh ($f_v$):</span>{" "}
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {verticalFreqHz} Hz Interlaced
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Pure Electronic Video Scanning (No Mechanical Nipkow Disk)</span>
          </div>
        </div>

        {/* Toggle Controls */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            type="button"
            onClick={() => setShowElectronBeam(!showElectronBeam)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all ${
              showElectronBeam
                ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                : "bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
            }`}
          >
            Electron Beam
          </button>
        </div>
      </div>

      {/* Parameter Sliders Panel */}
      <div className="p-4 sm:p-5 bg-parchment-100/80 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
        {/* Accelerating Voltage */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Anode Potential ($V_a$):</span>
            <span className="font-bold text-amber-700 dark:text-amber-400">
              {acceleratingVoltageKv.toFixed(1)} kV
            </span>
          </div>
          <input
            type="range"
            min="1.0"
            max="6.0"
            step="0.2"
            value={acceleratingVoltageKv}
            onChange={(e) => setAcceleratingVoltageKv(Number(e.target.value))}
            className="w-full accent-amber-600 dark:accent-amber-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Accelerates photoelectrons to optical aperture
          </span>
        </div>

        {/* Horizontal Scan Rate */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Horizontal Deflection ($f_h$):</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {horizontalFreqKhz} kHz
            </span>
          </div>
          <input
            type="range"
            min="5.0"
            max="30.0"
            step="1.0"
            value={horizontalFreqKhz}
            onChange={(e) => setHorizontalFreqKhz(Number(e.target.value))}
            className="w-full accent-blue-600 dark:accent-blue-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Deflects entire electron image across aperture
          </span>
        </div>

        {/* Vertical Refresh Rate */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Vertical Frame Rate ($f_v$):</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {verticalFreqHz} Hz
            </span>
          </div>
          <input
            type="range"
            min="30"
            max="120"
            step="10"
            value={verticalFreqHz}
            onChange={(e) => setVerticalFreqHz(Number(e.target.value))}
            className="w-full accent-emerald-600 dark:accent-emerald-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Overcomes visual persistence threshold (flicker-free)
          </span>
        </div>

        {/* Incident Illumination */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Subject Illumination:</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">
              {lightIntensityLux} Lux
            </span>
          </div>
          <input
            type="range"
            min="100"
            max="1500"
            step="50"
            value={lightIntensityLux}
            onChange={(e) => setLightIntensityLux(Number(e.target.value))}
            className="w-full accent-purple-600 dark:accent-purple-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Einstein photoelectric photoemission rate
          </span>
        </div>
      </div>
    </div>
  );
}
