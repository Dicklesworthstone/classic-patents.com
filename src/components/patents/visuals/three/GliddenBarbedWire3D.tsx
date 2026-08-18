"use client";

import { Activity, Camera, Eye, EyeOff, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { stepGliddenBarbedWire } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "barb_lock" | "twisting_helix" | "takeup_drum" | "top";

export function GliddenBarbedWire3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);

  // Wire Manufacturing Parameters
  const { params } = usePatentPhysics("us-157124-glidden-barbed-wire");
  const twistsPerFoot = params.twistsPerFoot ?? 5;
  const barbSpacingInches = params.barbSpacingInches ?? 5.0;
  const glidden = stepGliddenBarbedWire({
    wireTensionN: params.wireTensionN ?? 650,
    twistsPerFoot,
    animalPushForceN: params.animalPushForceN ?? 120,
    barbSpacingInches,
  });
  const feetPerMinute = glidden.productionRateFtPerMin.toFixed(1);
  const tensileStrengthLbs = glidden.tensileStrengthLbs;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    machineRpm: glidden.machineRpm,
    barbSpacingInches,
    isAudioMuted,
    sagCm: glidden.sagCm,
    isLocked: glidden.isLocked ? 1 : 0,
    flyerOmegaRadPerS: glidden.flyerOmegaRadPerS,
    reelOmegaRadPerS: glidden.reelOmegaRadPerS,
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
        camera.position.set(9.5, 6.5, 10.5);
        controls.target.set(0, 0, 0);
        break;
      case "barb_lock":
        camera.position.set(0, 1.2, 3.2);
        controls.target.set(0, 0.4, 0);
        break;
      case "twisting_helix":
        camera.position.set(-2.5, 1.8, 3.5);
        controls.target.set(-1.0, 0, 0);
        break;
      case "takeup_drum":
        camera.position.set(3.5, 2.0, 4.0);
        controls.target.set(2.2, 0, 0);
        break;
      case "top":
        camera.position.set(0, 11.5, 0.1);
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
      cameraPos: [9.5, 6.5, 10.5],
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

    const galvanizedSteelMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.2,
      metalness: 0.95,
    });

    const walnutWoodMat = new THREE.MeshStandardMaterial({
      color: 0x5c2c16,
      roughness: 0.6,
      metalness: 0.05,
    });

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Heavy Wooden Workshop Bench & Cast Iron Bed
    const bench = new THREE.Mesh(new THREE.BoxGeometry(11.0, 0.8, 5.5), walnutWoodMat);
    bench.position.y = -2.2;
    bench.receiveShadow = true;
    rootGroup.add(bench);

    // 2. Dual Feed Spools (Raw Wire Inflow)
    [-3.8, -3.8].forEach((sx, idx) => {
      const spool = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.6, 24), castIronMat);
      spool.rotation.z = Math.PI / 2;
      spool.position.set(sx, idx === 0 ? 0.8 : -0.8, -1.2);
      rootGroup.add(spool);
    });

    // 3. Rotating Twister Flyer Arbor (Claim 1)
    const flyerGroup = new THREE.Group();
    flyerGroup.position.set(-1.8, 0, 0);
    rootGroup.add(flyerGroup);

    const flyerRing = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.12, 12, 32), castIronMat);
    flyerRing.rotation.y = Math.PI / 2;
    flyerGroup.add(flyerRing);

    // 4. Barbed Wire Twisting Helical Model (Claim 1 & Claim 2)
    const wireAssemblyGroup = new THREE.Group();
    rootGroup.add(wireAssemblyGroup);

    // Double-Strand Twisted Wire
    const strand1Curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-3.2, 0.1, 0),
      new THREE.Vector3(-1.0, 0.15, 0.1),
      new THREE.Vector3(1.0, 0.1, -0.1),
      new THREE.Vector3(3.2, 0.1, 0),
    ]);
    const strand1Geo = new THREE.TubeGeometry(strand1Curve, 40, 0.04, 8, false);
    const strand1Mesh = new THREE.Mesh(strand1Geo, galvanizedSteelMat);
    wireAssemblyGroup.add(strand1Mesh);

    const strand2Curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-3.2, -0.1, 0),
      new THREE.Vector3(-1.0, -0.15, -0.1),
      new THREE.Vector3(1.0, -0.1, 0.1),
      new THREE.Vector3(3.2, -0.1, 0),
    ]);
    const strand2Geo = new THREE.TubeGeometry(strand2Curve, 40, 0.04, 8, false);
    const strand2Mesh = new THREE.Mesh(strand2Geo, galvanizedSteelMat);
    wireAssemblyGroup.add(strand2Mesh);

    // 5 Discrete 2-Point Diamond Barbs Coiled Around Strand 1 (Claim 2)
    const barbCount = 5;
    for (let b = 0; b < barbCount; b++) {
      const bx = -2.2 + b * 1.1;
      const barbGroup = new THREE.Group();
      barbGroup.position.set(bx, 0, 0);

      // Coiled Wire Loop
      const coil = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.035, 8, 16), galvanizedSteelMat);
      barbGroup.add(coil);

      // Sharp Diamond Spurs (2 Points)
      [-1, 1].forEach((dir) => {
        const spur = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.35, 4), galvanizedSteelMat);
        spur.position.set(0, dir * 0.22, dir * 0.15);
        spur.rotation.x = (dir * Math.PI) / 4;
        barbGroup.add(spur);
      });

      wireAssemblyGroup.add(barbGroup);
    }

    // 5. Take-Up Reel Drum (Winding Finished Wire)
    const reelGroup = new THREE.Group();
    reelGroup.position.set(3.5, 0, 0);
    rootGroup.add(reelGroup);

    const reelHub = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.4, 24), walnutWoodMat);
    reelHub.rotation.z = Math.PI / 2;
    reelGroup.add(reelHub);

    [-0.7, 0.7].forEach((rx) => {
      const flange = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.12, 24), castIronMat);
      flange.rotation.z = Math.PI / 2;
      flange.position.x = rx;
      reelGroup.add(flange);
    });

    // Animation Loop
    let reqId: number;
    let _renderedSteps = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      _renderedSteps += 1;
      const delta = 1 / 60;
      const p = live.current;

      const omegaRadPerSec = p.flyerOmegaRadPerS ?? (p.machineRpm * 2 * Math.PI) / 60;
      flyerGroup.rotation.x += omegaRadPerSec * delta;
      galvanizedSteelMat.color.setHex(p.isLocked > 0 ? 0xe2e8f0 : 0xf87171);
      reelGroup.rotation.x += (p.reelOmegaRadPerS ?? omegaRadPerSec * 0.2) * delta;

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
            Glidden Barbed Wire Machine 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 157,124 (1874)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["barb_lock", "Barb Locking"],
              ["twisting_helix", "Flyer Helix"],
              ["takeup_drum", "Takeup Drum"],
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
        title="Glidden locked barb"
        chips={[
          { label: "Twists", value: String(twistsPerFoot), unit: "/ft" },
          { label: "Sag", value: String(glidden.sagCm), unit: "cm" },
          { label: "Hold", value: String(glidden.barbSlipThresholdN), unit: "N" },
          {
            label: "Lock",
            value: glidden.isLocked ? "held" : "slip",
            tone: glidden.isLocked ? "ok" : "warn",
          },
          { label: "Line", value: feetPerMinute, unit: "ft/min" },
          { label: "Wire", value: String(tensileStrengthLbs), unit: "lb" },
          { label: "ω", value: glidden.flyerOmegaRadPerS.toFixed(1), unit: "rad/s" },
        ]}
      />
    </div>
  );
}
