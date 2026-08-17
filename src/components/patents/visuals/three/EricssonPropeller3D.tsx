"use client";

import { Activity, Camera, Sparkles, Volume2, VolumeX, Waves, Zap } from "lucide-react";
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

type CameraPreset = "iso" | "propeller_drum" | "helical_blades" | "sternpost" | "top";

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  shaftRpm: number;
  shipSpeedKnots: number;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: "uss_princeton_1843",
    name: "1843 USS Princeton Warship",
    desc: "John Ericsson's 6-bladed hoop propeller driving the first screw-propelled steam warship in US naval history (US 588).",
    shaftRpm: 120,
    shipSpeedKnots: 11.5,
  },
  {
    id: "full_ahead_flank",
    name: "Full Ahead Flank (180 RPM)",
    desc: "High thrust 45 kN sprint delivering over 14 knots with helical blades channeling laminar axial wake.",
    shaftRpm: 180,
    shipSpeedKnots: 14.2,
  },
  {
    id: "bollard_pull_towing",
    name: "Bollard Pull Heavy Tow",
    desc: "Zero-advance maximum slip test generating 60 kN static bollard pull against heavy barge resistance.",
    shaftRpm: 100,
    shipSpeedKnots: 2.0,
  },
];

export function EricssonPropeller3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Marine Hydrodynamics Parameters
  const { params, updateParam } = usePatentPhysics("us-588-ericsson-propeller");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const shaftRpm = params.shaftRpm ?? 120;
  const shipSpeedKnots = params.shipSpeedKnots ?? 11.5;
  const [showWake, setShowWake] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  // Hydrodynamic Thrust Calculation: T = C_T * rho * n^2 * D^4
  const thrustKn = (0.0028 * shaftRpm ** 2 * 0.95).toFixed(1);
  const propulsiveEfficiencyPct = (68 + (shipSpeedKnots / 15) * 6).toFixed(1);

  const live = useLiveSimParams({
    shaftRpm,
    shipSpeedKnots,
    showWake,
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
        camera.position.set(9.0, 6.0, 10.5);
        controls.target.set(0, 0, 0);
        break;
      case "propeller_drum":
        camera.position.set(0, 0.5, 4.2);
        controls.target.set(0, 0, 0);
        break;
      case "helical_blades":
        camera.position.set(2.5, 1.8, 3.0);
        controls.target.set(0.5, 0, 0);
        break;
      case "sternpost":
        camera.position.set(-3.2, 1.2, 3.5);
        controls.target.set(-1.5, 0, 0);
        break;
      case "top":
        camera.position.set(0, 11.0, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const applyScenario = (s: ScenarioPreset) => {
    updateParam("shaftRpm", s.shaftRpm);
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
      cameraPos: [9.0, 6.0, 10.5],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Materials
    const bronzeGunmetalMat = new THREE.MeshStandardMaterial({
      color: 0xc8963e,
      roughness: 0.22,
      metalness: 0.92,
    });

    const shipHullIronMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.8,
    });

    const steelShaftMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.15,
      metalness: 0.95,
    });

    const waterGlowTex = createGlowPointTexture();

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Ship Stern Hull Framing, Sternpost & Rudder Gudgeons
    const hullGroup = new THREE.Group();
    hullGroup.position.set(-3.5, 0, 0);
    rootGroup.add(hullGroup);

    // Tapered Sternpost
    const sternpost = new THREE.Mesh(new THREE.BoxGeometry(1.2, 5.5, 0.6), shipHullIronMat);
    sternpost.position.set(0, 0.5, 0);
    hullGroup.add(sternpost);

    // Stuffing Box Shaft Tunnel
    const shaftTunnel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.4, 3.2, 16),
      shipHullIronMat,
    );
    shaftTunnel.rotation.z = Math.PI / 2;
    shaftTunnel.position.set(1.2, 0, 0);
    hullGroup.add(shaftTunnel);

    // 2. Ericsson Screw Propeller Assembly (Claim 1: Cylindrical Drum + Helical Blades)
    const propGroup = new THREE.Group();
    propGroup.position.set(0.5, 0, 0);
    rootGroup.add(propGroup);

    // Drive Shaft
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 7.5, 16), steelShaftMat);
    shaft.rotation.z = Math.PI / 2;
    shaft.position.x = -1.5;
    rootGroup.add(shaft);

    // Central Bronze Hub
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 1.4, 24), bronzeGunmetalMat);
    hub.rotation.z = Math.PI / 2;
    propGroup.add(hub);

    // Outer Cylindrical Supporting Drum Hoop (Claim 1)
    const drumHoop = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 2.4, 0.9, 36, 1, true),
      bronzeGunmetalMat,
    );
    drumHoop.rotation.z = Math.PI / 2;
    drumHoop.castShadow = true;
    propGroup.add(drumHoop);

    // 6 Helical Screw Blades with Constant Pitch Curvature
    for (let b = 0; b < 6; b++) {
      const angle = (b * Math.PI) / 3;
      const bladeGroup = new THREE.Group();
      bladeGroup.rotation.x = angle;

      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.9, 0.08), bronzeGunmetalMat);
      blade.position.set(0, 1.2, 0);
      blade.rotation.y = Math.PI / 5; // 36° true pitch angle
      blade.castShadow = true;
      bladeGroup.add(blade);

      propGroup.add(bladeGroup);
    }

    // 3. Marine Cavitation & Helical Slipstream Wake Particles
    const wakeCount = 180;
    const wakeGeo = new THREE.BufferGeometry();
    const wakePositions = new Float32Array(wakeCount * 3);
    const wakeColors = new Float32Array(wakeCount * 3);

    for (let i = 0; i < wakeCount; i++) {
      const idx = i * 3;
      const r = 0.5 + Math.random() * 2.2;
      const a = Math.random() * Math.PI * 2;
      wakePositions[idx] = 1.0 + Math.random() * 6.5; // Downstream along +X
      wakePositions[idx + 1] = Math.cos(a) * r;
      wakePositions[idx + 2] = Math.sin(a) * r;

      wakeColors[idx] = 0.4;
      wakeColors[idx + 1] = 0.85;
      wakeColors[idx + 2] = 1.0;
    }

    wakeGeo.setAttribute("position", new THREE.BufferAttribute(wakePositions, 3));
    wakeGeo.setAttribute("color", new THREE.BufferAttribute(wakeColors, 3));

    const wakePoints = new THREE.Points(
      wakeGeo,
      new THREE.PointsMaterial({
        size: 0.35,
        map: waterGlowTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    rootGroup.add(wakePoints);

    // Animation Loop
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = live.current;

      const omegaRadPerSec = (p.shaftRpm * 2 * Math.PI) / 60;
      propGroup.rotation.x += omegaRadPerSec * delta;

      // Animate wake spiral streamlines
      const pos = wakePositions;
      for (let i = 0; i < wakeCount; i++) {
        const idx = i * 3;
        pos[idx] += (p.shaftRpm / 60) * 8.0 * delta;
        const y = pos[idx + 1];
        const z = pos[idx + 2];
        let curAngle = Math.atan2(z, y);
        curAngle += omegaRadPerSec * delta * 0.4;
        const r = Math.sqrt(y * y + z * z);
        pos[idx + 1] = Math.cos(curAngle) * r;
        pos[idx + 2] = Math.sin(curAngle) * r;

        if (pos[idx] > 7.5) {
          pos[idx] = 0.8;
        }
      }
      wakeGeo.attributes.position.needsUpdate = true;
      wakePoints.visible = p.showWake;

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
            Ericsson Propeller 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 588 (1838)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["propeller_drum", "Drum Hoop"],
              ["helical_blades", "Helical Blades"],
              ["sternpost", "Sternpost"],
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
            onClick={() => setShowWake(!showWake)}
            title="Toggle Hydrodynamic Slipstream Particles"
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              showWake
                ? "bg-amber-600/30 text-amber-300 border border-amber-500/40"
                : "text-parchment-400 hover:text-white"
            }`}
          >
            <Waves className="w-4 h-4 text-cyan-400" />
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
              <span className="text-[10px] text-parchment-400 uppercase">Shaft Speed</span>
              <span className="font-bold text-amber-400">{shaftRpm} RPM</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Vessel Speed</span>
              <span className="font-bold text-blue-400">{shipSpeedKnots.toFixed(1)} Knots</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Axial Thrust</span>
              <span className="font-bold text-emerald-400">{thrustKn} kN</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">
                Propulsive Efficiency
              </span>
              <span className="font-bold text-amber-300">{propulsiveEfficiencyPct}%</span>
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
                Shaft RPM:
              </span>
              <input
                type="range"
                min="40"
                max="240"
                step="5"
                value={shaftRpm}
                onChange={(e) => updateParam("shaftRpm", Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-xs font-mono text-amber-400 w-12 text-right font-bold">
                {shaftRpm}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
