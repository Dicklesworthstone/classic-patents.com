"use client";

import { Activity, Camera, RotateCcw, Sparkles, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FrankenSimEngine } from "@/physics/engine";
import { soundEngine } from "@/utils/soundEngine";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

type CameraPreset = "iso" | "stator_coils" | "squirrel_cage" | "shaft_drive" | "top";

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  freqHz: number;
  phases: 2 | 3;
  loadTorqueNm: number;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: "tesla_1888_2phase",
    name: "1888 Tesla Original 2-Phase Motor",
    desc: "Nikola Tesla's breakthrough (US 381,968): 2-phase 90° quadrature currents creating the first rotating magnetic field without brushes.",
    freqHz: 60,
    phases: 2,
    loadTorqueNm: 14.0,
  },
  {
    id: "niagara_falls_3phase",
    name: "1895 Niagara Falls Polyphase Grid",
    desc: "3-phase 120° balanced power transmission driving heavy industrial induction machinery at Niagara Falls.",
    freqHz: 60,
    phases: 3,
    loadTorqueNm: 22.0,
  },
  {
    id: "high_torque_breakdown",
    name: "Heavy Industrial High-Slip Load",
    desc: "Near-maximum 35 N·m shaft resistance inducing high rotor current to generate massive counter-torque.",
    freqHz: 60,
    phases: 3,
    loadTorqueNm: 35.0,
  },
  {
    id: "variable_freq_drive",
    name: "Variable Frequency Turbo Mode",
    desc: "120 Hz high-frequency excitation driving the synchronous magnetic field to 3,600 RPM.",
    freqHz: 120,
    phases: 3,
    loadTorqueNm: 12.0,
  },
];

export function TeslaMotor3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Electrical & Mechanical Simulation State
  const [acFrequencyHz, setAcFrequencyHz] = useState<number>(60); // 10 to 120 Hz
  const [phaseCount, setPhaseCount] = useState<2 | 3>(2);
  const [appliedLoadTorqueNm, setAppliedLoadTorqueNm] = useState<number>(14.0); // 0 to 40 Nm
  const [showMagneticFlux, _setShowMagneticFlux] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Electromechanical Induction Physics Calculations (FrankenSim Engine)
  const totalPoles = phaseCount === 2 ? 4 : 6;
  const polePairs = totalPoles / 2;
  const emPhysics = FrankenSimEngine.stepTeslaMotor(acFrequencyHz, totalPoles, appliedLoadTorqueNm);
  const synchronousSpeedRpm = emPhysics.synchronousRpm;
  const slip = emPhysics.slipFraction;
  const rotorSpeedRpm = Math.round(synchronousSpeedRpm * (1 - slip));
  const electricalPowerWatts = Math.round(
    ((appliedLoadTorqueNm * (rotorSpeedRpm * 2 * Math.PI)) / 60) * 1.15,
  );
  const rotorInducedCurrentAmps = Math.round(emPhysics.currentAmperes);

  const live = useLiveSimParams({
    acFrequencyHz,
    polePairs,
    slip,
    showMagneticFlux,
    isPlayingAudio,
  });

  const controlsRef = useRef<any>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    switch (preset) {
      case "iso":
        camera.position.set(13, 10, 15);
        controls.target.set(0, 0, 0);
        break;
      case "stator_coils":
        camera.position.set(0, 4.2, 5.8);
        controls.target.set(0, 0, 0);
        break;
      case "squirrel_cage":
        camera.position.set(0, 1.8, 3.8);
        controls.target.set(0, -0.4, 0);
        break;
      case "shaft_drive":
        camera.position.set(5.5, 1.5, 3.5);
        controls.target.set(2.0, -0.4, 0);
        break;
      case "top":
        camera.position.set(0, 11.5, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const applyScenario = (s: ScenarioPreset) => {
    setAcFrequencyHz(s.freqHz);
    setPhaseCount(s.phases);
    setAppliedLoadTorqueNm(s.loadTorqueNm);
    if (isPlayingAudio) {
      soundEngine.playTeslaMotorHum(
        s.freqHz,
        Math.round(((120 * s.freqHz) / (s.phases === 2 ? 4 : 6)) * 0.95),
      );
    }
  };

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

    const studio = createThreeStudioScene({
      container,
      cameraPos: [13, 10, 15],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // --- PBR MATERIALS ---
    const statorIronMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.35,
      metalness: 0.85,
    });

    const copperRotorBarMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.15,
      metalness: 0.95,
    });

    const rotorCoreMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.4,
      metalness: 0.6,
    });

    const shaftSteelMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.08,
      metalness: 0.95,
    });

    // --- 3D STATOR & INDUSTRIAL CHASSIS ASSEMBLY ---
    const statorGroup = new THREE.Group();
    scene.add(statorGroup);

    // Bedplate
    const bedplate = new THREE.Mesh(
      new THREE.BoxGeometry(11.0, 0.7, 7.5),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6, metalness: 0.75 }),
    );
    bedplate.position.y = -4.2;
    bedplate.receiveShadow = true;
    statorGroup.add(bedplate);

    // 4 Anchor Bosses
    [
      [-4.8, -3.0],
      [4.8, -3.0],
      [-4.8, 3.0],
      [4.8, 3.0],
    ].forEach(([bx, bz]) => {
      const boss = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 0.4, 16), statorIronMat);
      boss.position.set(bx, -3.7, bz);
      statorGroup.add(boss);
    });

    // Stator Outer Ring
    const statorGeo = new THREE.CylinderGeometry(5.2, 5.2, 3.8, 48, 1, true);
    const statorMesh = new THREE.Mesh(statorGeo, statorIronMat);
    statorMesh.castShadow = true;
    statorMesh.receiveShadow = true;
    statorGroup.add(statorMesh);

    // Stator Lamination Ribs
    for (let l = 0; l < 8; l++) {
      const lamRing = new THREE.Mesh(
        new THREE.TorusGeometry(5.22, 0.04, 8, 48),
        new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 }),
      );
      lamRing.rotation.x = Math.PI / 2;
      lamRing.position.y = -1.6 + l * 0.46;
      statorGroup.add(lamRing);
    }

    // Salient Stator Poles & Copper Windings
    const numPoles = phaseCount === 2 ? 4 : 6;
    const coilMeshes: { mesh: THREE.Mesh; phaseIdx: number }[] = [];

    for (let p = 0; p < numPoles; p++) {
      const angle = (p * (2 * Math.PI)) / numPoles;
      const poleGroup = new THREE.Group();
      poleGroup.position.set(Math.cos(angle) * 3.8, 0, Math.sin(angle) * 3.8);
      poleGroup.rotation.y = -angle + Math.PI / 2;

      // Iron Core Pole Piece
      const poleIron = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.2, 1.4), statorIronMat);
      poleIron.castShadow = true;
      poleGroup.add(poleIron);

      // Heavy Gauge Copper Magnet Wire Coil Spool
      const coilMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.25,
        metalness: 0.85,
      });
      const coilMesh = new THREE.Mesh(new THREE.BoxGeometry(1.9, 2.6, 1.8), coilMat);
      coilMesh.castShadow = true;
      poleGroup.add(coilMesh);

      coilMeshes.push({ mesh: coilMesh, phaseIdx: p % phaseCount });
      statorGroup.add(poleGroup);
    }

    // --- 3D ROTOR & SQUIRREL CAGE ASSEMBLY ---
    const rotorGroup = new THREE.Group();
    scene.add(rotorGroup);

    // Laminated Iron Rotor Cylinder Core
    const rotorCore = new THREE.Mesh(new THREE.CylinderGeometry(2.45, 2.45, 3.4, 32), rotorCoreMat);
    rotorCore.castShadow = true;
    rotorCore.receiveShadow = true;
    rotorGroup.add(rotorCore);

    // Polished Drive Shaft
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 9.2, 24), shaftSteelMat);
    shaft.castShadow = true;
    rotorGroup.add(shaft);

    // 16 Skewed Pure-Copper Squirrel-Cage Conductor Bars
    const barCount = 16;
    for (let b = 0; b < barCount; b++) {
      const barAngle = (b * (2 * Math.PI)) / barCount;
      const bar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 3.5, 12),
        copperRotorBarMat,
      );
      bar.position.set(Math.cos(barAngle) * 2.35, 0, Math.sin(barAngle) * 2.35);
      bar.rotation.z = 0.08;
      bar.castShadow = true;
      rotorGroup.add(bar);
    }

    // Heavy Copper Short-Circuit End Rings
    [-1.72, 1.72].forEach((endY) => {
      const endRing = new THREE.Mesh(
        new THREE.TorusGeometry(2.35, 0.18, 12, 32),
        copperRotorBarMat,
      );
      endRing.rotation.x = Math.PI / 2;
      endRing.position.y = endY;
      endRing.castShadow = true;
      rotorGroup.add(endRing);
    });

    // --- GLOWING ROTATING MAGNETIC FLUX FIELD PARTICLES ---
    const fluxCount = 180;
    const fluxGeo = new THREE.BufferGeometry();
    const fluxPositions = new Float32Array(fluxCount * 3);
    const fluxColors = new Float32Array(fluxCount * 3);

    const glowTex = createGlowPointTexture();

    for (let i = 0; i < fluxCount; i++) {
      const idx = i * 3;
      const radius = 2.6 + Math.random() * 1.8;
      const angle = Math.random() * Math.PI * 2;
      fluxPositions[idx] = Math.cos(angle) * radius;
      fluxPositions[idx + 1] = (Math.random() - 0.5) * 2.8;
      fluxPositions[idx + 2] = Math.sin(angle) * radius;

      fluxColors[idx] = 0.2;
      fluxColors[idx + 1] = 0.7 + Math.random() * 0.3;
      fluxColors[idx + 2] = 1.0;
    }

    fluxGeo.setAttribute("position", new THREE.BufferAttribute(fluxPositions, 3));
    fluxGeo.setAttribute("color", new THREE.BufferAttribute(fluxColors, 3));

    const fluxPoints = new THREE.Points(
      fluxGeo,
      new THREE.PointsMaterial({
        size: 0.38,
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
      const p = live.current;

      const omegaSync = (2 * Math.PI * p.acFrequencyHz) / p.polePairs;
      bFieldAngle += omegaSync * delta * 0.08;

      const bDir = new THREE.Vector3(Math.cos(bFieldAngle), 0, Math.sin(bFieldAngle));
      bFieldArrow.setDirection(bDir);

      const omegaRotor = omegaSync * (1 - p.slip) * 0.08;
      rotorGroup.rotation.y += omegaRotor * delta;

      for (const item of coilMeshes) {
        const phaseOffset = item.phaseIdx * (phaseCount === 2 ? Math.PI / 2 : (2 * Math.PI) / 3);
        const currentI = Math.sin(elapsed * p.acFrequencyHz * 0.5 + phaseOffset);
        const mat = item.mesh.material as THREE.MeshStandardMaterial;
        mat.emissive = new THREE.Color(0xf59e0b);
        mat.emissiveIntensity = Math.abs(currentI) * 0.9;
      }

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
      fluxPoints.visible = p.showMagneticFlux;
      bFieldArrow.visible = p.showMagneticFlux;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      studio.dispose();
    };
  }, [live, phaseCount]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      {/* 3D WebGL Canvas Viewport */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Live HUD Telemetry Overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none max-w-[calc(100%-8rem)] sm:max-w-md">
          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
            <div className="text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 animate-pulse text-amber-500" />
              Polyphase Induction Telemetry
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs font-sans">
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

          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 flex items-center gap-2 max-w-full">
            <Activity className="w-3.5 h-3.5 text-blue-500 animate-spin-slow shrink-0" />
            <span className="truncate">Induced Rotor Current: {rotorInducedCurrentAmps} A RMS</span>
          </div>
        </div>

        {/* Top Right Tool Bar (Audio, Pins, Reset) */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            type="button"
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className="p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-all shadow-sm"
            title={isPlayingAudio ? "Mute Motor Audio" : "Enable Motor Harmonic Sound"}
          >
            {isPlayingAudio ? (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowCalloutPins(!showCalloutPins)}
            className={`p-2.5 rounded-xl backdrop-blur-md border transition-all shadow-sm ${
              showCalloutPins
                ? "bg-amber-600 text-white border-amber-700 shadow-md"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
            title="Toggle Historical Patent Numeral Pins"
          >
            <Zap className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-all shadow-sm"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Camera Views Bar */}
        <div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-xs">
          <span className="px-2 py-1 text-ink-500 font-sans flex items-center gap-1">
            <Camera className="w-3.5 h-3.5" /> View:
          </span>
          {(
            [
              ["iso", "Isometric"],
              ["stator_coils", "Stator Poles"],
              ["squirrel_cage", "Rotor Cage"],
              ["shaft_drive", "Drive Shaft"],
              ["top", "Air Gap"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => applyCameraPreset(id)}
              className={`px-2.5 py-1 rounded-lg font-sans transition-all ${
                activeCamera === id
                  ? "bg-amber-700 dark:bg-amber-600 text-white font-semibold shadow-xs"
                  : "text-ink-700 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Controls & Scenario Bar */}
      <div className="p-4 sm:p-5 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 space-y-4">
        {/* Scenario Presets */}
        <div className="space-y-1.5">
          <div className="text-xs font-sans font-bold text-ink-700 dark:text-ink-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Historical Induction Scenarios:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => applyScenario(s)}
                className="p-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 bg-white/70 dark:bg-ink-950/70 hover:bg-parchment-50 dark:hover:bg-ink-800 text-left transition-all group"
              >
                <div className="text-xs font-serif font-bold text-ink-900 dark:text-parchment-100 group-hover:text-amber-700 dark:group-hover:text-amber-400">
                  {s.name}
                </div>
                <div className="text-[10px] font-sans text-ink-500 dark:text-ink-400 line-clamp-2 mt-0.5">
                  {s.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans pt-1">
          {/* AC Frequency */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
              <span>AC Frequency ($f$):</span>
              <span className="font-bold text-amber-700 dark:text-amber-400">
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
              className="w-full accent-amber-600 dark:accent-amber-400 cursor-pointer"
            />
            <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
              Rotating flux velocity $\omega_s = 2\pi f / P$
            </span>
          </div>

          {/* Phase System */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
              <span>Phase System:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {phaseCount === 2 ? "2-Phase (90° Quad)" : "3-Phase (120° Balanced)"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => setPhaseCount(2)}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
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
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
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
              {"η ≈ (1 − s) · η_mag (brushless)"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
