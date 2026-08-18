"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX, Waves } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { stepEricssonPropeller } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { createLcg } from "@/utils/lcg";
import { soundEngine } from "@/utils/soundEngine";
import { StudioKernelChips } from "./StudioKernelChips";
import {
  createGlowPointTexture,
  createThreeStudioScene,
  type StudioContext,
} from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

const lcg = createLcg(1787);

type CameraPreset = "iso" | "propeller_drum" | "helical_blades" | "sternpost" | "top";

export function EricssonPropeller3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Marine Hydrodynamics Parameters
  const { params } = usePatentPhysics("us-588-ericsson-propeller");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const shaftRpm = params.shaftRpm ?? 120;
  const ericson = stepEricssonPropeller({
    shaftRpm,
    bladePitchAngleDeg: params.bladePitchAngleDeg ?? 35,
  });
  const shipSpeedKnots = ericson.shipSpeedKnots;
  const [showWake, setShowWake] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const thrustKn = ericson.thrustKn.toFixed(1);
  const propulsiveEfficiencyPct = ((1 - ericson.slipFraction) * 100).toFixed(1);

  const live = useLiveSimParams({
    shaftRpm,
    shipSpeedKnots,
    showWake,
    isAudioMuted,
    thrustKn: ericson.thrustKn,
    bladePitchAngleDeg: params.bladePitchAngleDeg ?? 35,
    propulsiveEfficiencyPct: Number(propulsiveEfficiencyPct),
    shaftOmegaRadPerS: ericson.shaftOmegaRadPerS,
    wakeSwirlScale: ericson.wakeSwirlScale,
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
      const r = 0.5 + lcg() * 2.2;
      const a = lcg() * Math.PI * 2;
      wakePositions[idx] = 1.0 + lcg() * 6.5; // Downstream along +X
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
    let renderedSteps = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      renderedSteps += 1;
      const delta = 1 / 60;
      const p = live.current;

      const omegaRadPerSec = p.shaftOmegaRadPerS ?? (p.shaftRpm * 2 * Math.PI) / 60;
      propGroup.rotation.x += omegaRadPerSec * delta;

      // Animate wake spiral streamlines
      const pos = wakePositions;
      for (let i = 0; i < wakeCount; i++) {
        const idx = i * 3;
        pos[idx] += (p.shipSpeedKnots / 8.5) * 6.5 * delta;
        const y = pos[idx + 1];
        const z = pos[idx + 2];
        let curAngle = Math.atan2(z, y);
        curAngle += omegaRadPerSec * delta * (p.wakeSwirlScale ?? 0.4);
        const r = Math.sqrt(y * y + z * z);
        pos[idx + 1] = Math.cos(curAngle) * r;
        pos[idx + 2] = Math.sin(curAngle) * r;

        if (pos[idx] > 7.5) {
          pos[idx] = 0.8;
        }
      }
      wakeGeo.attributes.position.needsUpdate = true;
      wakePoints.visible = p.showWake;
      const wakeMat = wakePoints.material as THREE.PointsMaterial;
      wakeMat.opacity = Math.min(0.95, 0.3 + (p.thrustKn / 30) * 0.65);
      wakeMat.color.setHex(p.thrustKn > 12 ? 0x38bdf8 : 0x64748b);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      studio.cleanup();
    };
  }, [live]);

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
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            title={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            {showUiOverlay ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4 text-amber-400" />
            )}
          </button>
          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <StudioKernelChips
        visible={showUiOverlay}
        title="Ericsson screw"
        chips={[
          { label: "Shaft", value: String(Math.round(shaftRpm)), unit: "rpm" },
          { label: "Pitch", value: String(params.bladePitchAngleDeg ?? 35), unit: "°" },
          { label: "Ship", value: String(shipSpeedKnots), unit: "kn" },
          { label: "Thrust", value: thrustKn, unit: "kN" },
          { label: "η_p", value: propulsiveEfficiencyPct, unit: "%" },
          { label: "slip", value: String(ericson.slipFraction) },
          { label: "p", value: String(ericson.pitchMeters), unit: "m" },
          { label: "ω", value: ericson.shaftOmegaRadPerS.toFixed(1), unit: "rad/s" },
        ]}
      />
    </div>
  );
}
