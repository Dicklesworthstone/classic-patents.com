"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX, Waves } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { stepPeltonWheel } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { StudioKernelChips } from "./StudioKernelChips";
import {
  createGlowPointTexture,
  createThreeStudioScene,
  type StudioContext,
} from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "split_bucket" | "needle_nozzle" | "runner_wheel" | "top";

export function PeltonWheel3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);

  // Hydrodynamic Impulse Parameters
  const { params } = usePatentPhysics("us-233692-pelton-water-wheel");
  const headMeters = params.headMeters ?? 450;
  const wheelRpm = params.runnerRpm ?? params.rotorRpm ?? 600;
  const pelton = stepPeltonWheel({ headMeters, runnerRpm: wheelRpm });
  const jetVelocityMps = pelton.jetVelocityMps;
  const hydraulicEfficiencyPct = pelton.etaPct;
  const powerKw = pelton.shaftPowerKw;
  const [showJet, setShowJet] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    headMeters,
    wheelRpm,
    jetVelocityMps,
    showJet,
    isAudioMuted,
    etaPct: hydraulicEfficiencyPct,
    shaftPowerKw: powerKw,
    speedRatio: pelton.speedRatio,
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
        camera.position.set(10.5, 7.5, 11.5);
        controls.target.set(0, 0, 0);
        break;
      case "split_bucket":
        camera.position.set(-1.0, 2.5, 3.5);
        controls.target.set(-0.5, 1.8, 0);
        break;
      case "needle_nozzle":
        camera.position.set(-3.5, 0.5, 3.8);
        controls.target.set(-2.2, -0.4, 0);
        break;
      case "runner_wheel":
        camera.position.set(0, 1.0, 4.5);
        controls.target.set(0, 0, 0);
        break;
      case "top":
        camera.position.set(0, 12.5, 0.1);
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
      cameraPos: [10.5, 7.5, 11.5],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Materials
    const castIronMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.85,
    });

    const bronzeBucketMat = new THREE.MeshStandardMaterial({
      color: 0xc8963e,
      roughness: 0.22,
      metalness: 0.92,
    });

    const steelShaftMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.1,
      metalness: 0.95,
    });

    const waterGlowTex = createGlowPointTexture();

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Cast-Iron Casing Housing with Viewing Cutaway
    const housing = new THREE.Mesh(
      new THREE.CylinderGeometry(3.6, 3.6, 1.8, 32, 1, false, 0, Math.PI * 1.5),
      castIronMat,
    );
    housing.rotation.x = Math.PI / 2;
    housing.position.set(0, 0, 0);
    housing.castShadow = true;
    rootGroup.add(housing);

    // 2. Pelton Runner Wheel with 18 Split Double-Cup Buckets (Claim 1 & Claim 2)
    const runnerGroup = new THREE.Group();
    rootGroup.add(runnerGroup);

    // Central Disc Hub
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.4, 32), castIronMat);
    hub.rotation.x = Math.PI / 2;
    runnerGroup.add(hub);

    // Drive Shaft
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 5.0, 16), steelShaftMat);
    shaft.rotation.x = Math.PI / 2;
    runnerGroup.add(shaft);

    // 18 Peripheral Split Ellipsoidal Buckets with Central Splitter Ridge (Claim 2)
    const bucketCount = 18;
    for (let b = 0; b < bucketCount; b++) {
      const bAngle = (b * Math.PI * 2) / bucketCount;
      const bucketGroup = new THREE.Group();
      bucketGroup.position.set(Math.cos(bAngle) * 2.2, Math.sin(bAngle) * 2.2, 0);
      bucketGroup.rotation.z = bAngle - Math.PI / 2;

      // Left Cup
      const leftCup = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 12, 12, 0, Math.PI, 0, Math.PI),
        bronzeBucketMat,
      );
      leftCup.position.set(0, 0, -0.22);
      leftCup.rotation.y = -Math.PI / 2;
      bucketGroup.add(leftCup);

      // Right Cup
      const rightCup = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 12, 12, 0, Math.PI, 0, Math.PI),
        bronzeBucketMat,
      );
      rightCup.position.set(0, 0, 0.22);
      rightCup.rotation.y = -Math.PI / 2;
      bucketGroup.add(rightCup);

      // Central Knife-Edge Splitter Wedge
      const splitter = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.5, 4), bronzeBucketMat);
      splitter.rotation.z = Math.PI / 2;
      splitter.position.set(0.1, 0, 0);
      bucketGroup.add(splitter);

      runnerGroup.add(bucketGroup);
    }

    // 3. High-Pressure Spear Needle Nozzle (Claim 1)
    const nozzleGroup = new THREE.Group();
    nozzleGroup.position.set(-3.2, -2.2, 0);
    rootGroup.add(nozzleGroup);

    const nozzleBody = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.8, 16), castIronMat);
    nozzleBody.rotation.z = -Math.PI / 3;
    nozzleGroup.add(nozzleBody);

    // 4. High-Speed Water Jet Stream Particles
    const jetCount = 140;
    const jetGeo = new THREE.BufferGeometry();
    const jetPositions = new Float32Array(jetCount * 3);
    const jetColors = new Float32Array(jetCount * 3);

    for (let i = 0; i < jetCount; i++) {
      const idx = i * 3;
      jetPositions[idx] = -3.0 + Math.random() * 2.8;
      jetPositions[idx + 1] = -2.0 + Math.random() * 1.8;
      jetPositions[idx + 2] = (Math.random() - 0.5) * 0.15;

      jetColors[idx] = 0.4;
      jetColors[idx + 1] = 0.85;
      jetColors[idx + 2] = 1.0;
    }

    jetGeo.setAttribute("position", new THREE.BufferAttribute(jetPositions, 3));
    jetGeo.setAttribute("color", new THREE.BufferAttribute(jetColors, 3));

    const jetPoints = new THREE.Points(
      jetGeo,
      new THREE.PointsMaterial({
        size: 0.25,
        map: waterGlowTex,
        vertexColors: false,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    rootGroup.add(jetPoints);

    // Animation Loop
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = live.current;

      const omegaRadPerSec = (p.wheelRpm * 2 * Math.PI) / 60;
      runnerGroup.rotation.z += omegaRadPerSec * delta;

      // Animate jet trajectory from nozzle to bucket
      const pos = jetPositions;
      for (let i = 0; i < jetCount; i++) {
        const idx = i * 3;
        pos[idx] += (p.jetVelocityMps / 50) * 8.0 * delta;
        pos[idx + 1] += (p.jetVelocityMps / 50) * 4.6 * delta;
        if (pos[idx] > 0.2) {
          pos[idx] = -3.0;
          pos[idx + 1] = -2.0;
        }
      }
      jetGeo.attributes.position.needsUpdate = true;
      jetPoints.visible = p.showJet;
      // Euler optimum is u/v ≈ 0.5. Off-design paints the jet: cyan too-slow, rose too-fast.
      const ratioErr = Math.abs((p.speedRatio ?? 0.5) - 0.5);
      const jetMat = jetPoints.material as THREE.PointsMaterial;
      jetMat.color.setHex(ratioErr < 0.08 ? 0xfbbf24 : p.speedRatio < 0.5 ? 0x38bdf8 : 0xfb7185);
      jetMat.opacity = 0.55 + (p.etaPct / 93) * 0.4;

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
            Pelton Water Wheel 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 233,692 (1880)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["split_bucket", "Split Bucket"],
              ["needle_nozzle", "Needle Nozzle"],
              ["runner_wheel", "Runner Wheel"],
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
            onClick={() => setShowJet(!showJet)}
            title="Toggle Water Jet Stream"
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              showJet
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
            title={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            {showUiOverlay ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4 text-amber-400" />
            )}
          </button>{" "}
        </div>
      </div>

      <StudioKernelChips
        visible={showUiOverlay}
        title="Pelton impulse runner"
        chips={[
          { label: "Head", value: String(headMeters), unit: "m" },
          { label: "v_jet", value: String(jetVelocityMps), unit: "m/s" },
          {
            label: "u/v",
            value: pelton.speedRatio.toFixed(3),
            tone: Math.abs(pelton.speedRatio - 0.5) < 0.08 ? "ok" : "warn",
          },
          { label: "η", value: String(hydraulicEfficiencyPct), unit: "%" },
          { label: "Shaft", value: String(powerKw), unit: "kW" },
        ]}
      />
    </div>
  );
}
