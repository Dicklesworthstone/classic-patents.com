"use client";

import { Activity, Camera, Radio, Sparkles, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import {
  createGlowPointTexture,
  createThreeStudioScene,
  type StudioContext,
} from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "coherer_switch" | "radio_antenna" | "rudder_prop" | "top";

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  rudderAngleDeg: number;
  propellerRpm: number;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: "madison_square_1898",
    name: "1898 Madison Square Garden Demonstration",
    desc: "Nikola Tesla's wireless remote-controlled robotic teleautomaton boat executing radio commands before stunned audiences (US 613,809).",
    rudderAngleDeg: 15,
    propellerRpm: 450,
  },
  {
    id: "hard_port_torpedo_maneuver",
    name: "Hard Port Evasive Turn (-30°)",
    desc: "Wireless coherer stepping drum cycling to hard port rudder with bow signaling light activation.",
    rudderAngleDeg: -30,
    propellerRpm: 600,
  },
  {
    id: "silent_submerged_recon",
    name: "Silent Low-Profile Submerged Cruise",
    desc: "Low-drag hull cruising with only radio receiving masts breaking water surface.",
    rudderAngleDeg: 0,
    propellerRpm: 200,
  },
];

export function TeslaTeleautomaton3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Wireless Teleautomation Robotics Parameters
  const { params, updateParam } = usePatentPhysics("us-613809-tesla-teleautomaton");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const rudderAngleDeg = params.rudderAngleDeg ?? 15;
  const propellerRpm = params.propellerRpm ?? 450;
  const vesselSpeedKnots = (propellerRpm * 0.018).toFixed(1);
  const rfFrequencyMhz = 2.4;
  const [showRadioWaves, setShowRadioWaves] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    rudderAngleDeg,
    propellerRpm,
    showRadioWaves,
    isAudioMuted,
  });

  const controlsRef = useRef<StudioContext["controls"] | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    switch (preset) {
      case "iso":
        camera.position.set(11.5, 7.5, 12.5);
        controls.target.set(0, 0, 0);
        break;
      case "coherer_switch":
        camera.position.set(0, 2.0, 3.5);
        controls.target.set(0, 0.6, 0);
        break;
      case "radio_antenna":
        camera.position.set(0, 4.2, 4.5);
        controls.target.set(0, 2.5, 0);
        break;
      case "rudder_prop":
        camera.position.set(-3.8, 0.5, 3.2);
        controls.target.set(-2.8, -0.4, 0);
        break;
      case "top":
        camera.position.set(0, 14.0, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const applyScenario = (s: ScenarioPreset) => {
    updateParam("rudderAngleDeg", s.rudderAngleDeg);
    if (!isAudioMuted) {
      soundEngine.playSwitchClick();
    }
  };

  const toggleSound = () => {
    toggleEngine(() => {
      soundEngine.playSwitchClick();
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [11.5, 7.5, 12.5],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Materials
    const copperHullMat = new THREE.MeshStandardMaterial({
      color: 0xc8963e,
      roughness: 0.35,
      metalness: 0.88,
    });

    const polishedBrassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.2,
      metalness: 0.95,
    });

    const ironDeckMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.45,
      metalness: 0.85,
    });

    const _rfWaveGlowTex = createGlowPointTexture();

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Pointed Streamlined Torpedo Boat Hull (Claim 1)
    const hullGroup = new THREE.Group();
    rootGroup.add(hullGroup);

    const hullPoints: THREE.Vector2[] = [];
    hullPoints.push(new THREE.Vector2(0.01, 4.8));
    hullPoints.push(new THREE.Vector2(0.7, 4.2));
    hullPoints.push(new THREE.Vector2(1.2, 2.0));
    hullPoints.push(new THREE.Vector2(1.2, -2.0));
    hullPoints.push(new THREE.Vector2(0.4, -4.2));
    hullPoints.push(new THREE.Vector2(0.01, -4.8));

    const hullGeo = new THREE.LatheGeometry(hullPoints, 24);
    hullGeo.rotateZ(Math.PI / 2);
    const hullMesh = new THREE.Mesh(hullGeo, copperHullMat);
    hullMesh.castShadow = true;
    hullGroup.add(hullMesh);

    // 2. Wireless Radio Receiving Antenna Mast & Signaling Beacon Masts (Claim 1)
    const antennaMast = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 3.8, 12),
      polishedBrassMat,
    );
    antennaMast.position.set(0, 2.4, 0);
    hullGroup.add(antennaMast);

    const mastTopSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 16, 16),
      new THREE.MeshStandardMaterial({
        color: 0xffedd5,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.95,
      }),
    );
    mastTopSphere.position.set(0, 4.3, 0);
    hullGroup.add(mastTopSphere);

    // Fore & Aft Signaling Light Masts
    [-2.2, 2.2].forEach((mx) => {
      const signalMast = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 2.2, 12),
        polishedBrassMat,
      );
      signalMast.position.set(mx, 1.6, 0);
      hullGroup.add(signalMast);
    });

    // 3. Radio Coherer & Stepping Drum Logic Controller (Claim 2)
    const cohererBox = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.8, 1.2), ironDeckMat);
    cohererBox.position.set(0, 0.6, 0);
    hullGroup.add(cohererBox);

    // 4. Steerable Rudder & Screw Propeller
    const rudderGroup = new THREE.Group();
    rudderGroup.position.set(-4.5, -0.4, 0);
    hullGroup.add(rudderGroup);

    const rudderBlade = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.9, 0.06), polishedBrassMat);
    rudderBlade.position.x = -0.4;
    rudderGroup.add(rudderBlade);

    // 3-Blade Screw Propeller
    const propGroup = new THREE.Group();
    propGroup.position.set(-4.9, -0.4, 0);
    hullGroup.add(propGroup);

    for (let b = 0; b < 3; b++) {
      const bAngle = (b * Math.PI * 2) / 3;
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.55, 0.04), polishedBrassMat);
      blade.position.set(0, Math.cos(bAngle) * 0.28, Math.sin(bAngle) * 0.28);
      blade.rotation.x = bAngle;
      propGroup.add(blade);
    }

    // 5. Wireless RF Electromagnetic Wave Particle Rings
    const waveCount = 4;
    const waveRings: THREE.Mesh[] = [];
    for (let w = 0; w < waveCount; w++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.6 + w * 0.8, 0.04, 8, 32),
        new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.8,
          emissive: 0x0284c7,
          emissiveIntensity: 0.9,
        }),
      );
      ring.position.set(0, 4.3, 0);
      rootGroup.add(ring);
      waveRings.push(ring);
    }

    // Animation Loop
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = live.current;

      // Gentle water buoyancy sway
      const t = clock.getElapsedTime();
      hullGroup.position.y = Math.sin(t * 1.5) * 0.08;
      hullGroup.rotation.z = Math.sin(t * 0.8) * 0.02;

      // Propeller spin
      const propSpeed = (p.propellerRpm / 60) * 12.0;
      propGroup.rotation.x += propSpeed * delta;

      // Rudder angle response
      const targetRudderRad = (p.rudderAngleDeg * Math.PI) / 180;
      rudderGroup.rotation.y = -targetRudderRad;

      // Radiating RF wave expansion
      waveRings.forEach((ring, idx) => {
        const scale = 1.0 + ((t * 2 + idx * 0.8) % 3.0);
        ring.scale.set(scale, scale, scale);
        const mat = ring.material as THREE.MeshStandardMaterial;
        mat.opacity = (1.0 - scale / 4.0) * (p.showRadioWaves ? 0.85 : 0);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      studio.cleanup();
    };
  }, [live.current]);

  return (
    <div className="relative w-full h-[620px] bg-parchment-900 rounded-2xl overflow-hidden border border-parchment-700 shadow-2xl flex flex-col">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-parchment-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-parchment-100 uppercase tracking-wider">
            Tesla Teleautomaton Robotic Boat 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 613,809 (1898)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["coherer_switch", "Coherer Logic"],
              ["radio_antenna", "RF Antenna"],
              ["rudder_prop", "Rudder & Screw"],
              ["top", "Top"],
            ] as [CameraPreset, string][]
          ).map(([preset, label]) => (
            <button
              key={preset}
              type="button"
              onClick={() => applyCameraPreset(preset)}
              className={`px-2.5 py-1 text-xs font-sans rounded-lg transition-colors ${
                activeCamera === preset
                  ? "bg-amber-600 text-white font-semibold shadow-sm"
                  : "text-parchment-300 hover:text-white hover:bg-parchment-800/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={() => setShowRadioWaves(!showRadioWaves)}
            title="Toggle RF Radio Waves"
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              showRadioWaves
                ? "bg-amber-600/30 text-amber-300 border border-amber-500/40"
                : "text-parchment-400 hover:text-white"
            }`}
          >
            <Radio className="w-4 h-4 text-sky-400" />
          </button>
          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            <Zap className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Bottom Telemetry Bar & Controls */}
      {showUiOverlay && (
        <div className="absolute bottom-4 left-4 right-4 bg-parchment-950/90 backdrop-blur-md rounded-2xl border border-parchment-700/70 p-4 shadow-2xl z-10 flex flex-col gap-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pb-2 border-b border-parchment-800/80 text-xs font-mono">
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Rudder Angle</span>
              <span className="font-bold text-amber-400">{rudderAngleDeg}°</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Propeller Speed</span>
              <span className="font-bold text-blue-400">
                {propellerRpm} RPM ({vesselSpeedKnots} Knots)
              </span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Wireless Channel</span>
              <span className="font-bold text-emerald-400">{rfFrequencyMhz} MHz RF Coherer</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Control System</span>
              <span className="font-bold text-amber-300">Wireless Teleautomation</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-mono text-parchment-400 flex items-center gap-1 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Presets:
              </span>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {SCENARIOS.map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => applyScenario(sc)}
                    className="px-2.5 py-1 text-xs font-sans rounded-lg bg-parchment-800/80 hover:bg-parchment-700 text-parchment-200 hover:text-white border border-parchment-600/50 transition-colors whitespace-nowrap"
                  >
                    {sc.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-72 shrink-0">
              <span className="text-xs font-sans text-parchment-300 shrink-0 font-medium">
                Rudder Angle:
              </span>
              <input
                type="range"
                min="-35"
                max="35"
                step="5"
                value={rudderAngleDeg}
                onChange={(e) => updateParam("rudderAngleDeg", Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-xs font-mono text-amber-400 w-12 text-right font-bold">
                {rudderAngleDeg}°
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
