"use client";

import { Activity, Camera, Flame, Sparkles, Volume2, VolumeX, Zap } from "lucide-react";
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

type CameraPreset = "iso" | "blasting_cap" | "matrix_cutaway" | "fuse" | "top";

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  ngRatioPct: number;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: "nobel_1867_standard",
    name: "1867 Nobel No. 1 Dynamite (75% NG)",
    desc: "Alfred Nobel's benchmark composition: 75% liquid nitroglycerin absorbed in 25% inert porous kieselguhr diatomaceous earth (US 78,317).",
    ngRatioPct: 75,
  },
  {
    id: "gelignite_high_density",
    name: "Gelignite Blasting Gelatin (90% NG)",
    desc: "High-density waterproof formulation utilizing nitrocellulose gelling to achieve 7,800 m/s explosive detonation velocity for granite tunneling.",
    ngRatioPct: 90,
  },
  {
    id: "safe_transport_mix",
    name: "Safety Low-Sensitivity Mix (60% NG)",
    desc: "Reduced nitroglycerin ratio eliminating free oil exudation during railway transport and temperature swings.",
    ngRatioPct: 60,
  },
];

export function NobelDynamite3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Chemical Explosives Parameters
  const { params, updateParam } = usePatentPhysics("us-78317-nobel-dynamite");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const ngPercentage = params.ngConcentration ?? 75;
  const detonationVelocityMps = Math.round(5200 + (ngPercentage - 50) * 80);
  const blastOverpressureMpa = Math.round(4500 + (ngPercentage - 50) * 120);
  const [isFuseLit, setIsFuseLit] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    ngPercentage,
    detonationVelocityMps,
    isFuseLit,
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
        camera.position.set(8.5, 6.0, 9.5);
        controls.target.set(0, 0, 0);
        break;
      case "blasting_cap":
        camera.position.set(0, 3.2, 3.0);
        controls.target.set(0, 2.0, 0);
        break;
      case "matrix_cutaway":
        camera.position.set(0, 0, 3.5);
        controls.target.set(0, 0, 0);
        break;
      case "fuse":
        camera.position.set(0, 4.8, 2.5);
        controls.target.set(0, 3.5, 0);
        break;
      case "top":
        camera.position.set(0, 11.0, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const igniteFuse = () => {
    setIsFuseLit(true);
    if (!isAudioMuted) {
      soundEngine.playSwitchClick();
    }
  };

  const applyScenario = (s: ScenarioPreset) => {
    updateParam("ngConcentration", s.ngRatioPct);
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
      cameraPos: [8.5, 6.0, 9.5],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Materials
    const waxPaperMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.6,
      metalness: 0.1,
    });

    const kieselguhrMatrixMat = new THREE.MeshStandardMaterial({
      color: 0x92400e,
      roughness: 0.9,
      metalness: 0.05,
    });

    const copperCapMat = new THREE.MeshStandardMaterial({
      color: 0xca8a04,
      roughness: 0.2,
      metalness: 0.92,
    });

    const safetyFuseMat = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      roughness: 0.85,
      metalness: 0.0,
    });

    const sparkGlowTex = createGlowPointTexture();

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Cutaway Wax-Paper Dynamite Cartridge Stick (Claim 1)
    const stickGroup = new THREE.Group();
    rootGroup.add(stickGroup);

    // Outer Wax Paper Tube (Half-Cylinder Cutaway)
    const paperShell = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.2, 5.0, 32, 1, false, 0, Math.PI * 1.3),
      waxPaperMat,
    );
    paperShell.castShadow = true;
    stickGroup.add(paperShell);

    // Inner Porous Kieselguhr-NG Core Matrix
    const kieselguhrCore = new THREE.Mesh(
      new THREE.CylinderGeometry(1.15, 1.15, 4.9, 32),
      kieselguhrMatrixMat,
    );
    stickGroup.add(kieselguhrCore);

    // Diatomaceous Kieselguhr Grains / Microscopic Siliceous Shells
    const grainCount = 35;
    const grainGeo = new THREE.DodecahedronGeometry(0.12);
    const grainInst = new THREE.InstancedMesh(
      grainGeo,
      new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.8 }),
      grainCount,
    );
    const dummy = new THREE.Object3D();
    for (let i = 0; i < grainCount; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * 1.8,
        (Math.random() - 0.5) * 4.2,
        Math.random() * 0.9,
      );
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      dummy.updateMatrix();
      grainInst.setMatrixAt(i, dummy.matrix);
    }
    grainInst.instanceMatrix.needsUpdate = true;
    stickGroup.add(grainInst);

    // 2. Copper Blasting Detonator Cap (Claim 2: Fulminate of Mercury)
    const capGroup = new THREE.Group();
    capGroup.position.set(0, 2.2, 0);
    stickGroup.add(capGroup);

    const copperCasing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 1.8, 16),
      copperCapMat,
    );
    copperCasing.castShadow = true;
    capGroup.add(copperCasing);

    // 3. Braided Safety Fuse Cord
    const fuseCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 2.8, 0),
      new THREE.Vector3(0.4, 3.4, 0.3),
      new THREE.Vector3(0.1, 4.2, 0.6),
    ]);
    const fuseGeo = new THREE.TubeGeometry(fuseCurve, 20, 0.08, 8, false);
    const fuseMesh = new THREE.Mesh(fuseGeo, safetyFuseMat);
    stickGroup.add(fuseMesh);

    // 4. Glowing Fuse Spark Particle
    const sparkMat = new THREE.PointsMaterial({
      size: 0.6,
      map: sparkGlowTex,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      color: 0xff6600,
    });
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([0.1, 4.2, 0.6]), 3),
    );
    const sparkPoints = new THREE.Points(sparkGeo, sparkMat);
    stickGroup.add(sparkPoints);

    // Animation Loop
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = live.current;

      stickGroup.rotation.y += delta * 0.15;

      // Pulse Fuse Spark when lit
      if (p.isFuseLit) {
        sparkMat.opacity = 0.7 + Math.sin(clock.getElapsedTime() * 25) * 0.3;
      } else {
        sparkMat.opacity = 0;
      }

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
            Nobel Dynamite 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 78,317 (1868)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["blasting_cap", "Blasting Cap"],
              ["matrix_cutaway", "Porous Matrix"],
              ["fuse", "Safety Fuse"],
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
            onClick={igniteFuse}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md transition-colors ${
              isFuseLit
                ? "bg-orange-600 text-white animate-pulse"
                : "bg-amber-600 hover:bg-amber-500 text-white"
            }`}
          >
            <Flame className="w-3.5 h-3.5" /> {isFuseLit ? "Fuse Burning" : "Light Fuse"}
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
              <span className="text-[10px] text-parchment-400 uppercase">
                Nitroglycerin Fraction
              </span>
              <span className="font-bold text-amber-400">{ngPercentage}% NG</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Detonation Velocity</span>
              <span className="font-bold text-red-400">{detonationVelocityMps} m/s (Mach 21)</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Blast Overpressure</span>
              <span className="font-bold text-blue-400">{blastOverpressureMpa} MPa</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Stabilizing Matrix</span>
              <span className="font-bold text-amber-300">Porous Diatomaceous Kieselguhr</span>
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
                NG Ratio:
              </span>
              <input
                type="range"
                min="50"
                max="90"
                step="5"
                value={ngPercentage}
                onChange={(e) => updateParam("ngConcentration", Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-xs font-mono text-amber-400 w-12 text-right font-bold">
                {ngPercentage}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
