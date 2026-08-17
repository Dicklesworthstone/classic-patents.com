"use client";

import { Activity, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { soundEngine } from "@/utils/soundEngine";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";

export function TeslaMotor3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Electrical & Mechanical Simulation State
  const [acFrequencyHz, setAcFrequencyHz] = useState<number>(60); // 10 to 120 Hz
  const [phaseCount, setPhaseCount] = useState<2 | 3>(2); // 2-Phase (90 deg) vs 3-Phase (120 deg)
  const [polePairs, _setPolePairs] = useState<number>(2); // 2 poles (1 pair) or 4 poles (2 pairs)
  const [appliedLoadTorqueNm, setAppliedLoadTorqueNm] = useState<number>(14.0); // 0 to 40 Nm
  const [showMagneticFlux, setShowMagneticFlux] = useState<boolean>(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Electromechanical Induction Physics Calculations
  // Synchronous Speed: n_s = (120 * f) / P (RPM)
  const totalPoles = polePairs * 2;
  const synchronousSpeedRpm = (120 * acFrequencyHz) / totalPoles;

  // Rotor Slip: s = (n_s - n_r) / n_s = LoadTorque / MaxTorque
  const maxBreakdownTorqueNm = 45.0;
  const slip = Math.min(0.95, Math.max(0.015, appliedLoadTorqueNm / maxBreakdownTorqueNm));
  const rotorSpeedRpm = Math.round(synchronousSpeedRpm * (1 - slip));
  const electricalPowerWatts = Math.round(
    ((appliedLoadTorqueNm * (rotorSpeedRpm * 2 * Math.PI)) / 60) * 1.15,
  );
  const rotorInducedCurrentAmps = Math.round(slip * 65.0 * (acFrequencyHz / 60));

  // Web Audio AC Motor 60Hz Harmonic Sound
  useEffect(() => {
    if (isPlayingAudio) {
      soundEngine.playTeslaMotorHum(acFrequencyHz, rotorSpeedRpm);
    } else {
      soundEngine.stopContinuousTone();
    }
    return () => {
      soundEngine.stopContinuousTone();
    };
  }, [isPlayingAudio, acFrequencyHz, rotorSpeedRpm]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with High-Luminosity Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [13, 10, 15],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS (Luminous & Rich Specular Highlights) ---
    const statorIronMat = new THREE.MeshStandardMaterial({
      color: 0x475569, // Laminated silicon steel stator core
      roughness: 0.35,
      metalness: 0.85,
    });

    const _copperCoilMat = new THREE.MeshStandardMaterial({
      color: 0xe07a10, // Magnet wire copper coils
      roughness: 0.2,
      metalness: 0.85,
    });

    const copperRotorBarMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Pure copper squirrel-cage conductor bars
      roughness: 0.15,
      metalness: 0.95,
    });

    const rotorCoreMat = new THREE.MeshStandardMaterial({
      color: 0x64748b, // Laminated rotor cylinder
      roughness: 0.4,
      metalness: 0.6,
    });

    const shaftSteelMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc, // Polished steel drive shaft
      roughness: 0.08,
      metalness: 0.95,
    });

    // --- 3D STATOR ASSEMBLY ---
    const statorGroup = new THREE.Group();
    scene.add(statorGroup);

    // Laminated Iron Stator Ring Outer Housing
    const statorGeo = new THREE.CylinderGeometry(5.2, 5.2, 3.8, 48, 1, true);
    const statorMesh = new THREE.Mesh(statorGeo, statorIronMat);
    statorMesh.castShadow = true;
    statorMesh.receiveShadow = true;
    statorGroup.add(statorMesh);

    // 4 Saliency Pole Projections & Phase Coils
    const coilMeshes: { mesh: THREE.Mesh; phaseIdx: number }[] = [];
    const numPoles = phaseCount === 2 ? 4 : 6;

    for (let i = 0; i < numPoles; i++) {
      const angle = (i * 2 * Math.PI) / numPoles;
      const poleGeo = new THREE.BoxGeometry(1.6, 3.2, 1.4);
      const poleMesh = new THREE.Mesh(poleGeo, statorIronMat);
      poleMesh.position.set(Math.cos(angle) * 3.8, 0, Math.sin(angle) * 3.8);
      poleMesh.rotation.y = -angle;
      poleMesh.castShadow = true;
      statorGroup.add(poleMesh);

      // Wound Copper Coil on Pole Shoe
      const coilGeo = new THREE.TorusGeometry(1.0, 0.42, 16, 32);
      const coilMesh = new THREE.Mesh(
        coilGeo,
        new THREE.MeshStandardMaterial({
          color: 0xca8a04,
          roughness: 0.25,
          metalness: 0.8,
        }),
      );
      coilMesh.position.set(Math.cos(angle) * 3.5, 0, Math.sin(angle) * 3.5);
      coilMesh.rotation.y = -angle;
      coilMesh.castShadow = true;
      statorGroup.add(coilMesh);

      coilMeshes.push({ mesh: coilMesh, phaseIdx: i % phaseCount });
    }

    // --- 3D SQUIRREL-CAGE INDUCTION ROTOR ---
    const rotorGroup = new THREE.Group();
    scene.add(rotorGroup);

    // Laminated Silicon Rotor Core
    const rotorGeo = new THREE.CylinderGeometry(2.3, 2.3, 3.4, 32);
    const rotorMesh = new THREE.Mesh(rotorGeo, rotorCoreMat);
    rotorMesh.castShadow = true;
    rotorMesh.receiveShadow = true;
    rotorGroup.add(rotorMesh);

    // Copper Conductor Bars embedded in Rotor Slots (16 Bars)
    const numBars = 16;
    for (let b = 0; b < numBars; b++) {
      const bAngle = (b * 2 * Math.PI) / numBars;
      const barGeo = new THREE.CylinderGeometry(0.1, 0.1, 3.6, 12);
      const barMesh = new THREE.Mesh(barGeo, copperRotorBarMat);
      barMesh.position.set(Math.cos(bAngle) * 2.2, 0, Math.sin(bAngle) * 2.2);
      barMesh.castShadow = true;
      rotorGroup.add(barMesh);
    }

    // Heavy Copper End Rings Short-Circuiting All Bars
    const endRingGeo = new THREE.TorusGeometry(2.2, 0.18, 16, 32);
    const topRing = new THREE.Mesh(endRingGeo, copperRotorBarMat);
    topRing.rotation.x = Math.PI / 2;
    topRing.position.y = 1.72;
    const bottomRing = topRing.clone();
    bottomRing.position.y = -1.72;
    rotorGroup.add(topRing);
    rotorGroup.add(bottomRing);

    // Steel Central Drive Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.4, 0.4, 7.8, 24);
    const shaftMesh = new THREE.Mesh(shaftGeo, shaftSteelMat);
    shaftMesh.castShadow = true;
    rotorGroup.add(shaftMesh);

    // --- GLOWING ROTATING MAGNETIC FLUX STREAMLINES ---
    const fluxCount = 240;
    const fluxGeo = new THREE.BufferGeometry();
    const fluxPositions = new Float32Array(fluxCount * 3);
    const fluxColors = new Float32Array(fluxCount * 3);

    const glowTex = createGlowPointTexture();

    for (let i = 0; i < fluxCount; i++) {
      const idx = i * 3;
      const r = 0.5 + Math.random() * 2.6;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 3.0;

      fluxPositions[idx] = Math.cos(theta) * r;
      fluxPositions[idx + 1] = y;
      fluxPositions[idx + 2] = Math.sin(theta) * r;

      // Electric Cyan to Bright Amber Vector Gradient
      fluxColors[idx] = 0.1 + Math.random() * 0.3;
      fluxColors[idx + 1] = 0.7 + Math.random() * 0.3;
      fluxColors[idx + 2] = 1.0;
    }

    fluxGeo.setAttribute("position", new THREE.BufferAttribute(fluxPositions, 3));
    fluxGeo.setAttribute("color", new THREE.BufferAttribute(fluxColors, 3));

    const fluxPoints = new THREE.Points(
      fluxGeo,
      new THREE.PointsMaterial({
        size: 0.45,
        map: glowTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    scene.add(fluxPoints);

    // --- ROTATING B-FIELD VECTOR ARROW ---
    const bFieldArrow = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 2.2, 0),
      3.2,
      0x38bdf8,
      0.6,
      0.35,
    );
    scene.add(bFieldArrow);

    // --- RENDER LOOP & REAL-TIME PHYSICS SIMULATION ---
    let reqId: number;
    const clock = new THREE.Clock();
    let bFieldAngle = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // 1. Angular Velocity of Rotating Magnetic Field: omega_sync = 2 * pi * f / p
      const omegaSync = (2 * Math.PI * acFrequencyHz) / polePairs;
      bFieldAngle += omegaSync * delta * 0.08; // Scaled for visual tracking

      // 2. Rotate B-Field Vector
      const bDir = new THREE.Vector3(Math.cos(bFieldAngle), 0, Math.sin(bFieldAngle));
      bFieldArrow.setDirection(bDir);

      // 3. Rotor Mechanical Rotation: omega_rotor = omega_sync * (1 - slip)
      const omegaRotor = omegaSync * (1 - slip) * 0.08;
      rotorGroup.rotation.y += omegaRotor * delta;

      // 4. Modulate Stator Coil Emissive Glow by Instantaneous Sinusoidal Phase Current
      for (const item of coilMeshes) {
        const phaseOffset = item.phaseIdx * (phaseCount === 2 ? Math.PI / 2 : (2 * Math.PI) / 3);
        const currentI = Math.sin(elapsed * acFrequencyHz * 0.5 + phaseOffset);
        const mat = item.mesh.material as THREE.MeshStandardMaterial;
        mat.emissive = new THREE.Color(0xf59e0b);
        mat.emissiveIntensity = Math.abs(currentI) * 0.9;
      }

      // 5. Rotate Flux Particles
      const fPos = fluxPositions;
      for (let i = 0; i < fluxCount; i++) {
        const idx = i * 3;
        const x = fPos[idx];
        const z = fPos[idx + 2];
        const r = Math.sqrt(x * x + z * z);
        let curAngle = Math.atan2(z, x);
        curAngle += omegaSync * delta * 0.08;

        fPos[idx] = Math.cos(curAngle) * r;
        fPos[idx + 2] = Math.sin(curAngle) * r;
      }
      fluxGeo.attributes.position.needsUpdate = true;
      fluxPoints.visible = showMagneticFlux;
      bFieldArrow.visible = showMagneticFlux;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      studio.dispose();
    };
  }, [acFrequencyHz, phaseCount, polePairs, showMagneticFlux, slip]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      {/* 3D WebGL Canvas Viewport */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Live HUD Telemetry Overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
            <div className="text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 animate-pulse text-amber-500" />
              Polyphase Induction Telemetry
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs font-sans">
              <div>
                <span className="text-ink-600 dark:text-ink-400">Sync Speed ($n_s$):</span>{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {synchronousSpeedRpm} RPM
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Rotor Speed ($n_r$):</span>{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {rotorSpeedRpm} RPM
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Rotor Slip ($s$):</span>{" "}
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {(slip * 100).toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Shaft Power:</span>{" "}
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {electricalPowerWatts} W ({(electricalPowerWatts / 745.7).toFixed(2)} HP)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-blue-500 animate-spin-slow" />
            <span>Induced Rotor Current: {rotorInducedCurrentAmps} A RMS</span>
          </div>
        </div>

        {/* Audio & Field Toggles */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            type="button"
            onClick={() => setShowMagneticFlux(!showMagneticFlux)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all ${
              showMagneticFlux
                ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                : "bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
            }`}
          >
            <Zap className="w-3.5 h-3.5 inline mr-1" />
            B-Field Flux
          </button>
          <button
            type="button"
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all ${
              isPlayingAudio
                ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                : "bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
            }`}
          >
            {isPlayingAudio ? (
              <>
                <Volume2 className="w-3.5 h-3.5 inline mr-1 animate-pulse" />
                Audio ON
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 inline mr-1" />
                Audio OFF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Parameter Sliders Panel */}
      <div className="p-4 sm:p-5 bg-parchment-100/80 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
        {/* AC Frequency */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>AC Frequency ($f$):</span>
            <span className="font-bold text-amber-700 dark:text-amber-400">{acFrequencyHz} Hz</span>
          </div>
          <input
            type="range"
            min="10"
            max="120"
            step="5"
            value={acFrequencyHz}
            onChange={(e) => setAcFrequencyHz(Number(e.target.value))}
            className="w-full accent-amber-600 dark:accent-amber-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Sets rotating stator flux velocity $\omega_s = 2\pi f / P$
          </span>
        </div>

        {/* Phase System */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Phase Configuration:</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {phaseCount === 2 ? "2-Phase (90° Quadrature)" : "3-Phase (120° Balanced)"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setPhaseCount(2)}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold border ${
                phaseCount === 2
                  ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                  : "bg-white/80 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
              }`}
            >
              2-Phase (Tesla 1888)
            </button>
            <button
              type="button"
              onClick={() => setPhaseCount(3)}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold border ${
                phaseCount === 3
                  ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                  : "bg-white/80 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
              }`}
            >
              3-Phase Modern
            </button>
          </div>
        </div>

        {/* Mechanical Load Torque */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Shaft Load Torque:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {appliedLoadTorqueNm.toFixed(1)} N·m
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="38"
            step="1"
            value={appliedLoadTorqueNm}
            onChange={(e) => setAppliedLoadTorqueNm(Number(e.target.value))}
            className="w-full accent-emerald-600 dark:accent-emerald-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Higher load increases slip $s$ to induce torque
          </span>
        </div>

        {/* Rotor Induction Efficiency */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Electromechanical Efficiency:</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">
              {((1 - slip) * 94).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-parchment-300 dark:bg-ink-800 rounded-full h-3 overflow-hidden mt-2 border border-parchment-400 dark:border-ink-700">
            <div
              className="bg-gradient-to-r from-emerald-500 to-amber-500 h-full transition-all duration-300"
              style={{ width: `${Math.max(5, (1 - slip) * 94)}%` }}
            />
          </div>
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            {"$\\eta \\approx (1-s)\\cdot\\eta_{mag}$ (Zero brush friction loss)"}
          </span>
        </div>
      </div>
    </div>
  );
}
