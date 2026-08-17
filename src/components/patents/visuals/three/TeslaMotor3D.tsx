"use client";

import { Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { soundEngine } from "@/utils/soundEngine";
import { createThreeStudioScene } from "./ThreeStudioScene";

export function TeslaMotor3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Electrical & Mechanical Simulation State
  const [acFrequencyHz, setAcFrequencyHz] = useState<number>(60); // 10 to 120 Hz
  const [phaseCount, setPhaseCount] = useState<2 | 3>(2); // 2-Phase (90 deg) vs 3-Phase (120 deg)
  const [polePairs, _setPolePairs] = useState<number>(2); // 2 poles (1 pair) or 4 poles (2 pairs)
  const [appliedLoadTorqueNm, setAppliedLoadTorqueNm] = useState<number>(14.0); // 0 to 40 Nm
  const [showMagneticFlux, setShowMagneticFlux] = useState<boolean>(true);
  const [_showRotorCurrents, _setShowRotorCurrents] = useState<boolean>(true);
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

    // Create Studio Scene with Museum Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [13, 10, 15],
      targetPos: [0, 0, 0],
      bgBottomColor: 0x0f172a,
      rimColor: 0xf59e0b,
      ambientIntensity: 1.3,
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS ---
    const statorIronMat = new THREE.MeshStandardMaterial({
      color: 0x334155, // Laminated silicon steel stator core
      roughness: 0.45,
      metalness: 0.85,
    });

    const copperCoilMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Magnet wire copper coils
      roughness: 0.25,
      metalness: 0.9,
    });

    const copperRotorBarMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Pure copper squirrel-cage conductor bars
      roughness: 0.2,
      metalness: 0.95,
    });

    const rotorCoreMat = new THREE.MeshStandardMaterial({
      color: 0x475569, // Laminated rotor cylinder
      roughness: 0.5,
      metalness: 0.7,
    });

    const shaftSteelMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9, // Polished steel drive shaft
      roughness: 0.1,
      metalness: 0.95,
    });

    // --- 3D STATOR ASSEMBLY ---
    const statorGroup = new THREE.Group();
    scene.add(statorGroup);

    // Laminated Iron Stator Ring
    const statorGeo = new THREE.CylinderGeometry(5.2, 5.2, 3.8, 36, 1, true);
    const statorMesh = new THREE.Mesh(statorGeo, statorIronMat);
    statorGroup.add(statorMesh);

    // Salient Stator Poles and Electromagnetic Coils
    const poleCount = phaseCount === 2 ? 4 : 6;
    const coilMeshes: THREE.Mesh[] = [];

    for (let i = 0; i < poleCount; i++) {
      const angle = (i * 2 * Math.PI) / poleCount;
      const poleGroup = new THREE.Group();
      poleGroup.rotation.y = angle;

      // Iron Pole Shoe
      const shoeMesh = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.6, 1.2), statorIronMat);
      shoeMesh.position.set(4.1, 0, 0);
      poleGroup.add(shoeMesh);

      // Copper Coil Spool around Pole
      const coilMesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 3.2, 1.8), copperCoilMat.clone());
      coilMesh.position.set(3.9, 0, 0);
      poleGroup.add(coilMesh);
      coilMeshes.push(coilMesh);

      statorGroup.add(poleGroup);
    }

    // --- 3D SQUIRREL-CAGE INDUCTION ROTOR ---
    const rotorGroup = new THREE.Group();
    scene.add(rotorGroup);

    // Laminated Cylindrical Rotor Core
    const rotorCore = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.8, 3.6, 32), rotorCoreMat);
    rotorGroup.add(rotorCore);

    // Drive Shaft
    const driveShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 9.0, 24), shaftSteelMat);
    rotorGroup.add(driveShaft);

    // Copper End-Rings (Shorting the squirrel cage)
    const topEndRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.6, 0.22, 16, 32),
      copperRotorBarMat,
    );
    topEndRing.rotation.x = Math.PI / 2;
    topEndRing.position.y = 1.8;
    const bottomEndRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.6, 0.22, 16, 32),
      copperRotorBarMat,
    );
    bottomEndRing.rotation.x = Math.PI / 2;
    bottomEndRing.position.y = -1.8;
    rotorGroup.add(topEndRing);
    rotorGroup.add(bottomEndRing);

    // Longitudinal Copper Rotor Conductor Bars
    const numRotorBars = 16;
    for (let i = 0; i < numRotorBars; i++) {
      const angle = (i * 2 * Math.PI) / numRotorBars;
      const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.6, 8), copperRotorBarMat);
      bar.position.set(Math.cos(angle) * 2.6, 0, Math.sin(angle) * 2.6);
      rotorGroup.add(bar);
    }

    // --- 3D ROTATING MAGNETIC FLUX STREAMLINES ---
    const fluxCount = 140;
    const fluxGeo = new THREE.BufferGeometry();
    const fluxPos = new Float32Array(fluxCount * 3);
    const fluxCol = new Float32Array(fluxCount * 3);

    for (let i = 0; i < fluxCount; i++) {
      fluxCol[i * 3] = 0.2;
      fluxCol[i * 3 + 1] = 0.8;
      fluxCol[i * 3 + 2] = 1.0;
    }
    fluxGeo.setAttribute("position", new THREE.BufferAttribute(fluxPos, 3));
    fluxGeo.setAttribute("color", new THREE.BufferAttribute(fluxCol, 3));

    const fluxPoints = new THREE.Points(
      fluxGeo,
      new THREE.PointsMaterial({
        size: 0.18,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
      }),
    );
    scene.add(fluxPoints);

    // --- ANIMATION & PHYSICS INTEGRATION LOOP ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      controls.update();

      // Synchronous B-Field Angular Frequency: omega_s = 2pi * f / p
      const omegaSync = (2 * Math.PI * acFrequencyHz) / polePairs;
      const fluxAngle = time * omegaSync;

      // Rotor Mechanical Angular Speed: omega_r = omega_s * (1 - s)
      const omegaRotor = omegaSync * (1 - slip);
      rotorGroup.rotation.y = time * omegaRotor;

      // Pulsing Stator Coils Emissive Current Glow
      coilMeshes.forEach((mesh, idx) => {
        const phaseOffset = (idx * 2 * Math.PI) / poleCount;
        const currentPhase = Math.sin(time * 2 * Math.PI * acFrequencyHz - phaseOffset);
        const intensity = Math.abs(currentPhase);
        (mesh.material as THREE.MeshStandardMaterial).emissive.setHex(0xd97706);
        (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity * 1.5;
      });

      // Rotating Magnetic Flux Streamlines Vector Field
      fluxPoints.visible = showMagneticFlux;
      if (showMagneticFlux) {
        const positions = fluxGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < fluxCount; i++) {
          const progress = ((i * 7 + time * 60) % 100) / 100;
          const r = 0.8 + progress * 2.8;
          const theta = fluxAngle + (i % 8) * (Math.PI / 4) + (progress - 0.5) * 0.5;
          positions[i * 3] = Math.cos(theta) * r;
          positions[i * 3 + 1] = ((i % 13) - 6) * 0.25;
          positions[i * 3 + 2] = Math.sin(theta) * r;
        }
        fluxGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      studio.dispose();
    };
  }, [acFrequencyHz, phaseCount, polePairs, slip, showMagneticFlux]);

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Zap className="w-6 h-6 text-amber-500 animate-pulse" />
            <h3 className="font-serif text-2xl font-bold text-ink-950 dark:text-parchment-50">
              3D Real-Time Tesla Polyphase AC Induction Motor Simulator (US 381,968)
            </h3>
          </div>
          <p className="text-sm sm:text-base text-ink-700 dark:text-ink-300 mt-1">
            Studio-illuminated Three.js electromagnetic physics simulating the{" "}
            <strong>rotating magnetic field $\vec&#123;B&#125;_(net)$</strong> and{" "}
            <strong>Faraday-Lenz squirrel-cage induction torque</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all border shadow-2xs ${
              isPlayingAudio
                ? "bg-amber-600 text-white border-amber-700 shadow-sm animate-pulse"
                : "bg-parchment-200 dark:bg-ink-800 text-ink-800 dark:text-parchment-200 border-parchment-300 dark:border-ink-700"
            }`}
          >
            {isPlayingAudio ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
            <span>60Hz AC Hum: {isPlayingAudio ? "LIVE" : "MUTED"}</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas & HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-[#0f172a] border border-parchment-300 dark:border-ink-800 relative min-h-[460px] overflow-hidden shadow-inner">
          {/* Top HUD */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none text-xs sm:text-sm font-mono">
            <div className="px-3.5 py-1.5 bg-ink-900/90 border border-ink-800 text-amber-300 rounded-xl shadow-md">
              Rotor Speed: <span className="font-bold">{rotorSpeedRpm} RPM</span> (Slip:{" "}
              {(slip * 100).toFixed(1)}%) · Power:{" "}
              <span className="text-emerald-300 font-bold">{electricalPowerWatts} W</span>
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={() => setShowMagneticFlux(!showMagneticFlux)}
                className={`px-3 py-1 rounded-lg border text-xs font-mono transition-colors ${
                  showMagneticFlux
                    ? "bg-blue-600 text-white border-blue-500"
                    : "bg-ink-900 text-ink-400 border-ink-800"
                }`}
              >
                B-Field: {showMagneticFlux ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* 3D Canvas */}
          <div ref={containerRef} className="w-full h-[460px] cursor-grab active:cursor-grabbing" />

          {/* Bottom Telemetry */}
          <div className="w-full grid grid-cols-4 gap-3 text-center text-sm font-mono p-4 bg-ink-950/95 border-t border-ink-800 text-ink-300 z-10">
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                SYNC SPEED (n_s)
              </span>
              <span className="text-emerald-400 font-bold text-sm sm:text-base">
                {synchronousSpeedRpm} RPM
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                ROTOR CURRENT
              </span>
              <span className="text-amber-400 font-bold text-sm sm:text-base">
                {rotorInducedCurrentAmps} Amps
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                LOAD TORQUE
              </span>
              <span className="text-blue-400 font-bold text-sm sm:text-base">
                {appliedLoadTorqueNm.toFixed(1)} N·m
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
              AC Polyphase Motor Controls
            </span>

            {/* AC Frequency Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  {"Line Frequency ($f_{ac}$)"}
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {acFrequencyHz} Hz
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                step="5"
                value={acFrequencyHz}
                onChange={(e) => setAcFrequencyHz(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Load Torque Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  {"Mechanical Shaft Load ($\\tau_{load}$)"}
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
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
                className="w-full accent-blue-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Polyphase Mode Switcher */}
            <div className="space-y-1.5">
              <span className="text-xs sm:text-sm font-mono block text-ink-800 dark:text-ink-200 font-semibold mb-1">
                AC Phase Configuration
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm font-mono">
                <button
                  type="button"
                  onClick={() => setPhaseCount(2)}
                  className={`p-2.5 rounded-xl border text-center transition-colors shadow-2xs ${
                    phaseCount === 2
                      ? "bg-amber-700 text-white font-bold"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-800 dark:text-ink-200"
                  }`}
                >
                  2-Phase Quadrature (90°)
                </button>
                <button
                  type="button"
                  onClick={() => setPhaseCount(3)}
                  className={`p-2.5 rounded-xl border text-center transition-colors shadow-2xs ${
                    phaseCount === 3
                      ? "bg-amber-700 text-white font-bold"
                      : "bg-parchment-200 dark:bg-ink-800 text-ink-800 dark:text-ink-200"
                  }`}
                >
                  3-Phase Polyphase (120°)
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-ink-950 dark:text-parchment-100 text-xs sm:text-sm font-sans space-y-1.5">
              <span className="font-bold text-amber-900 dark:text-amber-300 block font-mono text-xs uppercase tracking-wider">
                Tesla&apos;s Induction Principle:
              </span>
              <p className="leading-relaxed">
                By passing alternating currents with different phases through independent stator
                coils, Tesla created a smoothly rotating magnetic field vector of constant magnitude
                ($\vec&#123;B&#125;_(net)$). This drags the closed rotor without any commutators,
                sparks, or brushes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
