"use client";

import { Activity, Camera, Eye, EyeOff, Flame, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { stepNobelDynamite } from "@/physics/catalogKernels";
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

type CameraPreset = "iso" | "blasting_cap" | "matrix_cutaway" | "fuse" | "top";

export function NobelDynamite3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);

  // Chemical Explosives Parameters
  const { params } = usePatentPhysics("us-78317-nobel-dynamite");
  const ngPercentage = params.ngConcentrationPct ?? params.ngConcentration ?? 75;
  const nobel = stepNobelDynamite({
    ngConcentrationPct: ngPercentage,
    capEnergyJoules: params.capEnergyJoules ?? 1.2,
  });
  const detonationVelocityMps = nobel.detonationVelocityMps;
  const blastOverpressureMpa = nobel.isInitiated ? Math.round(4500 + (ngPercentage - 50) * 120) : 0;
  const [isFuseLit, setIsFuseLit] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    ngPercentage,
    detonationVelocityMps,
    isFuseLit,
    isAudioMuted,
    blastOverpressureMpa,
    isInitiated: nobel.isInitiated ? 1 : 0,
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
      emissive: 0xff4400,
      emissiveIntensity: 0,
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
      // Cap must actually initiate — fuse alone does not detonate kieselguhr-NG
      const det = p.isFuseLit && p.isInitiated > 0.5;
      kieselguhrMatrixMat.emissiveIntensity = det ? 1.6 : 0;
      sparkMat.size = 0.4 + (p.detonationVelocityMps / 8000) * 1.4;

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
            title={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            {showUiOverlay ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4 text-amber-400" />
            )}
          </button>
        </div>
      </div>

      <StudioKernelChips
        visible={showUiOverlay}
        title="Nobel kieselguhr"
        chips={[
          { label: "NG", value: String(ngPercentage), unit: "%" },
          {
            label: "Cap",
            value: String(params.capEnergyJoules ?? 1.2),
            unit: "J",
            tone: nobel.isInitiated ? "ok" : "warn",
          },
          {
            label: "v_d",
            value: String(detonationVelocityMps),
            unit: "m/s",
            tone: nobel.isInitiated ? "hot" : "warn",
          },
          { label: "P", value: String(blastOverpressureMpa), unit: "MPa" },
        ]}
      />
    </div>
  );
}
