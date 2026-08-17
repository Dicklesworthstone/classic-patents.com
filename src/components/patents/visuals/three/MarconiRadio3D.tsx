"use client";

import { Radio, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";

export function MarconiRadio3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Spark-Gap Radio State Controls
  const [aerialHeightMeters, setAerialHeightMeters] = useState<number>(30); // 10 to 60 meters
  const [sparkGapMm, setSparkGapMm] = useState<number>(10); // 2 to 25 mm
  const [inductionCoilKv, setInductionCoilKv] = useState<number>(20); // 5 to 50 kV
  const [showEmWavefronts, setShowEmWavefronts] = useState<boolean>(true);
  const [isSparking, setIsSparking] = useState<boolean>(true);

  // Electromagnetic Wireless Physics (Maxwell-Hertz-Marconi Equation)
  // Fundamental Monopole Resonance: lambda = 4 * h
  const wavelengthMeters = aerialHeightMeters * 4;
  const resonantFreqMhz = (300 / wavelengthMeters).toFixed(2);
  // Marconi's Law: Maximum Transmission Range D = C * h^2
  const maxRangeMiles = (
    0.015 *
    aerialHeightMeters *
    aerialHeightMeters *
    (inductionCoilKv / 20)
  ).toFixed(1);
  const peakRfPowerKw = ((inductionCoilKv * inductionCoilKv) / (sparkGapMm * 1.5)).toFixed(1);

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
    const brassBallMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Polished Righi 4-sphere brass discharge balls
      roughness: 0.1,
      metalness: 0.98,
    });

    const copperAerialMat = new THREE.MeshStandardMaterial({
      color: 0xca8a04, // Elevated copper monopole antenna wire
      roughness: 0.25,
      metalness: 0.88,
    });

    const woodMastMat = new THREE.MeshStandardMaterial({
      color: 0x78350f, // Pine wooden telegraph mast
      roughness: 0.5,
      metalness: 0.05,
    });

    const groundEarthMat = new THREE.MeshStandardMaterial({
      color: 0x475569, // Buried copper earth plate grounding
      roughness: 0.6,
      metalness: 0.7,
    });

    // --- 3D MARCONI WIRELESS TRANSMITTER ASSEMBLY ---
    const radioGroup = new THREE.Group();
    scene.add(radioGroup);

    // Pine Wood Aerial Mast (30-60m scale)
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.35, 9.0, 16), woodMastMat);
    mast.position.set(-3.5, 0.5, 0);
    mast.castShadow = true;
    radioGroup.add(mast);

    // Elevated Monopole Copper Aerial Wire
    const aerialWire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 8.5, 8),
      copperAerialMat,
    );
    aerialWire.position.set(-3.2, 0.8, 0);
    aerialWire.castShadow = true;
    radioGroup.add(aerialWire);

    // Righi 4-Sphere Spark Gap Sub-Assembly
    const sparkGapGroup = new THREE.Group();
    sparkGapGroup.position.set(0, -1.8, 0);

    const ball1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 24, 24), brassBallMat);
    ball1.position.set(-1.2, 0, 0);
    ball1.castShadow = true;
    const ball2 = new THREE.Mesh(new THREE.SphereGeometry(0.7, 24, 24), brassBallMat);
    ball2.position.set(-0.35, 0, 0);
    ball2.castShadow = true;
    const ball3 = new THREE.Mesh(new THREE.SphereGeometry(0.7, 24, 24), brassBallMat);
    ball3.position.set(0.35, 0, 0);
    ball3.castShadow = true;
    const ball4 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 24, 24), brassBallMat);
    ball4.position.set(1.2, 0, 0);
    ball4.castShadow = true;

    sparkGapGroup.add(ball1);
    sparkGapGroup.add(ball2);
    sparkGapGroup.add(ball3);
    sparkGapGroup.add(ball4);
    radioGroup.add(sparkGapGroup);

    // Earth Grounding Plate (Buried in sea/soil - Marconi breakthrough)
    const earthPlate = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.2, 3.5), groundEarthMat);
    earthPlate.position.set(0, -3.2, 0);
    earthPlate.receiveShadow = true;
    radioGroup.add(earthPlate);

    // Grounding Cable from Spark Gap to Earth Plate
    const groundWire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 1.4, 8),
      copperAerialMat,
    );
    groundWire.position.set(1.2, -2.5, 0);
    radioGroup.add(groundWire);

    // --- EXPANDING 3D SPHERICAL ELECTROMAGNETIC WAVEFRONTS ---
    const waveCount = 5;
    const waveSpheres: THREE.Mesh[] = [];

    for (let w = 0; w < waveCount; w++) {
      const sphereGeo = new THREE.SphereGeometry(1.5 + w * 2.2, 24, 24);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.6 - w * 0.1,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.set(-3.2, 0.8, 0);
      radioGroup.add(sphere);
      waveSpheres.push(sphere);
    }

    // --- GLOWING HIGH-VOLTAGE SPARK PLASMA PARTICLES ---
    const sparkCount = 80;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(sparkCount * 3);
    const glowTex = createGlowPointTexture();

    for (let i = 0; i < sparkCount; i++) {
      const idx = i * 3;
      sparkPos[idx] = -0.35 + Math.random() * 0.7;
      sparkPos[idx + 1] = -1.8 + (Math.random() - 0.5) * 0.3;
      sparkPos[idx + 2] = (Math.random() - 0.5) * 0.3;
    }

    sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPos, 3));
    const sparkPoints = new THREE.Points(
      sparkGeo,
      new THREE.PointsMaterial({
        size: 0.45,
        map: glowTex,
        color: 0x60a5fa,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    radioGroup.add(sparkPoints);

    // --- RENDER LOOP & REAL-TIME EM RADIATION DYNAMICS ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const _delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Expanding Radio Wavefront Spheres (Speed of Light $c$)
      for (let w = 0; w < waveCount; w++) {
        const sphere = waveSpheres[w];
        const radius = (elapsed * 5.0 + w * 2.8) % 15.0;
        sphere.scale.set(radius, radius, radius);
        (sphere.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.7 - radius * 0.045);
        sphere.visible = showEmWavefronts && isSparking;
      }

      // Spark Gap Plasma Jitter
      if (isSparking) {
        const sPos = sparkPos;
        for (let i = 0; i < sparkCount; i++) {
          const idx = i * 3;
          sPos[idx] = -0.35 + Math.random() * 0.7;
          sPos[idx + 1] = -1.8 + (Math.random() - 0.5) * 0.25;
          sPos[idx + 2] = (Math.random() - 0.5) * 0.25;
        }
        sparkGeo.attributes.position.needsUpdate = true;
        sparkPoints.visible = Math.random() > 0.1;
      } else {
        sparkPoints.visible = false;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      studio.dispose();
    };
  }, [showEmWavefronts, isSparking]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      {/* 3D WebGL Canvas Viewport */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Live HUD Telemetry Overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
            <div className="text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              Marconi Wireless Radiotelegraphy
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs font-sans">
              <div>
                <span className="text-ink-600 dark:text-ink-400">Carrier Frequency:</span>{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {resonantFreqMhz} MHz (λ = {wavelengthMeters}m)
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Transmission Range:</span>{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {maxRangeMiles} miles (Marconi's Law $D \propto h^2$)
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Peak RF Power:</span>{" "}
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {peakRfPowerKw} kW Pulse
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Aerial Mast Height:</span>{" "}
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {aerialHeightMeters} meters
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Elevated Monopole + Earth Grounding: Hertzian Waves over Horizon</span>
          </div>
        </div>

        {/* Toggle Controls */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            type="button"
            onClick={() => setShowEmWavefronts(!showEmWavefronts)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all ${
              showEmWavefronts
                ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                : "bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
            }`}
          >
            EM Wavefronts
          </button>
          <button
            type="button"
            onClick={() => setIsSparking(!isSparking)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all ${
              isSparking
                ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                : "bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
            }`}
          >
            {isSparking ? "Spark Active" : "Silence"}
          </button>
        </div>
      </div>

      {/* Parameter Sliders Panel */}
      <div className="p-4 sm:p-5 bg-parchment-100/80 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
        {/* Aerial Mast Height */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Antenna Mast Height ($h$):</span>
            <span className="font-bold text-amber-700 dark:text-amber-400">
              {aerialHeightMeters} m ({Math.round(aerialHeightMeters * 3.28)} ft)
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="60"
            step="5"
            value={aerialHeightMeters}
            onChange={(e) => setAerialHeightMeters(Number(e.target.value))}
            className="w-full accent-amber-600 dark:accent-amber-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            $\lambda = 4h$ quarter-wave resonance
          </span>
        </div>

        {/* Induction Coil Voltage */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Ruhmkorff Coil Voltage:</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">{inductionCoilKv} kV</span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            step="5"
            value={inductionCoilKv}
            onChange={(e) => setInductionCoilKv(Number(e.target.value))}
            className="w-full accent-blue-600 dark:accent-blue-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            High voltage charging aerial capacitance
          </span>
        </div>

        {/* Spark Gap Distance */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Righi 4-Sphere Gap:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {sparkGapMm} mm
            </span>
          </div>
          <input
            type="range"
            min="2"
            max="25"
            step="1"
            value={sparkGapMm}
            onChange={(e) => setSparkGapMm(Number(e.target.value))}
            className="w-full accent-emerald-600 dark:accent-emerald-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Oil-immersed central gap produces damped oscillation
          </span>
        </div>

        {/* Transatlantic Range Margin */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Marconi Distance Scale:</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">
              {maxRangeMiles} mi ({Math.round(Number(maxRangeMiles) * 1.609)} km)
            </span>
          </div>
          <div className="w-full bg-parchment-300 dark:bg-ink-800 rounded-full h-3 overflow-hidden mt-2 border border-parchment-400 dark:border-ink-700">
            <div
              className="bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500 h-full transition-all duration-300"
              style={{ width: `${Math.min(100, (Number(maxRangeMiles) / 100) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            December 1901: First transatlantic signal ("S" •••)
          </span>
        </div>
      </div>
    </div>
  );
}
