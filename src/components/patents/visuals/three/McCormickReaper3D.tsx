"use client";

import { Activity, Camera, Eye, EyeOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { stepMcCormickReaper } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

type CameraPreset = "iso" | "sickle_guards" | "grain_reel" | "platform" | "top";

function deterministicUnit(index: number, channel: number): number {
  let state = Math.imul(index + 1, 0x9e3779b1) ^ Math.imul(channel + 1, 0x85ebca6b);
  state ^= state >>> 16;
  state = Math.imul(state, 0x7feb352d);
  state ^= state >>> 15;
  state = Math.imul(state, 0x846ca68b);
  state ^= state >>> 16;
  return (state >>> 0) / 0x1_0000_0000;
}

export function McCormickReaper3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mechanical Reaper Simulation Parameters
  const { params } = usePatentPhysics("us-x8277-mccormick-reaper");
  const groundSpeedMph = params.forwardSpeedMph ?? params.groundSpeedMph ?? 2.5;
  const reaper = stepMcCormickReaper({ forwardSpeedMph: groundSpeedMph });
  const cutterCrankRpm = reaper.cutterCrankRpm;
  const reelRpm = reaper.reelRpm;
  const [showStalks, setShowStalks] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");

  const live = useLiveSimParams({
    groundSpeedMph,
    cutterCrankRpm,
    reelRpm,
    showStalks,
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
        camera.position.set(10.5, 7.0, 11.0);
        controls.target.set(0, 0, 0);
        break;
      case "sickle_guards":
        camera.position.set(-1.0, 1.0, 4.5);
        controls.target.set(-0.5, -0.6, 1.8);
        break;
      case "grain_reel":
        camera.position.set(2.8, 3.8, 4.0);
        controls.target.set(0, 1.2, 0);
        break;
      case "platform":
        camera.position.set(0, 5.0, 0);
        controls.target.set(0, -0.5, -0.5);
        break;
      case "top":
        camera.position.set(0, 13.0, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: Three.js studio lifecycle
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [10.5, 7.0, 11.0],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Materials
    const weatheredWoodMat = new THREE.MeshStandardMaterial({
      color: 0x6b4226,
      roughness: 0.8,
      metalness: 0.05,
    });

    const ashWoodMat = new THREE.MeshStandardMaterial({
      color: 0xa16207,
      roughness: 0.6,
      metalness: 0.05,
    });

    const castIronMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.4,
      metalness: 0.85,
    });

    const sickleSteelMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.15,
      metalness: 0.95,
    });

    const brassGearsMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.25,
      metalness: 0.9,
    });

    const strawMat = new THREE.MeshStandardMaterial({
      color: 0xfde047,
      roughness: 0.9,
      metalness: 0.0,
    });

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Heavy Wooden Main Chassis & Grain Platform Deck
    const platformGroup = new THREE.Group();
    rootGroup.add(platformGroup);

    // Wooden Grain Platform
    const platformDeck = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.18, 4.5), weatheredWoodMat);
    platformDeck.position.set(0.5, -0.6, -0.5);
    platformDeck.castShadow = true;
    platformDeck.receiveShadow = true;
    platformGroup.add(platformDeck);

    // Draft Tongue (Extending Forward to Horses)
    const draftTongue = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.35, 7.5), ashWoodMat);
    draftTongue.position.set(3.2, -0.5, 4.2);
    draftTongue.castShadow = true;
    platformGroup.add(draftTongue);

    // Side Grain Divider Shoe (Triangular Wedge)
    const dividerShoe = new THREE.Mesh(new THREE.ConeGeometry(0.6, 2.8, 4), weatheredWoodMat);
    dividerShoe.rotation.x = Math.PI / 2;
    dividerShoe.rotation.z = Math.PI / 4;
    dividerShoe.position.set(-2.8, -0.5, 2.0);
    dividerShoe.castShadow = true;
    platformGroup.add(dividerShoe);

    // 2. Large Spoked Ground Drive Wheel with Master Bull Gear
    const driveWheelGroup = new THREE.Group();
    driveWheelGroup.position.set(3.4, -0.2, 0);
    rootGroup.add(driveWheelGroup);

    // Outer Wooden / Iron Tire Rim
    const wheelRim = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.14, 16, 36), castIronMat);
    wheelRim.rotation.y = Math.PI / 2;
    wheelRim.castShadow = true;
    driveWheelGroup.add(wheelRim);

    // Spoke Array
    for (let sp = 0; sp < 8; sp++) {
      const spAngle = (sp * Math.PI) / 4;
      const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.7, 12), castIronMat);
      spoke.rotation.x = spAngle;
      driveWheelGroup.add(spoke);
    }

    // Master Bull Gear Hub
    const bullGear = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.22, 24), brassGearsMat);
    bullGear.rotation.z = Math.PI / 2;
    driveWheelGroup.add(bullGear);

    // 3. Pointed Guard Fingers & Reciprocating Serrated Sickle Bar (Claim 1)
    const cutterAssembly = new THREE.Group();
    cutterAssembly.position.set(0.5, -0.6, 1.8);
    rootGroup.add(cutterAssembly);

    // Stationary Pointed Guard Fingers
    const fingerCount = 18;
    for (let f = 0; f < fingerCount; f++) {
      const fx = -2.8 + f * (5.6 / (fingerCount - 1));
      const finger = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.75, 4), castIronMat);
      finger.rotation.x = Math.PI / 2;
      finger.position.set(fx, 0, 0.35);
      finger.castShadow = true;
      cutterAssembly.add(finger);
    }

    // Reciprocating Serrated Sickle Bar
    const sickleBarGroup = new THREE.Group();
    cutterAssembly.add(sickleBarGroup);

    const sickleSteelBacking = new THREE.Mesh(
      new THREE.BoxGeometry(5.8, 0.08, 0.12),
      sickleSteelMat,
    );
    sickleBarGroup.add(sickleSteelBacking);

    // Triangular Serrated Cutter Teeth
    for (let t = 0; t < fingerCount; t++) {
      const tx = -2.8 + t * (5.6 / (fingerCount - 1));
      const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.45, 3), sickleSteelMat);
      tooth.rotation.x = Math.PI / 2;
      tooth.position.set(tx, 0.04, 0.2);
      sickleBarGroup.add(tooth);
    }

    // Pitman Arm & Crank Drive
    const pitmanArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 1.8), castIronMat);
    pitmanArm.position.set(3.0, 0, 0.8);
    pitmanArm.rotation.y = -Math.PI / 8;
    cutterAssembly.add(pitmanArm);

    // 4. Revolving 4-Vane Grain Reel
    const reelGroup = new THREE.Group();
    reelGroup.position.set(0.5, 1.4, 0.8);
    rootGroup.add(reelGroup);

    // Reel Central Axle
    const reelAxle = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 6.2, 16), ashWoodMat);
    reelAxle.rotation.z = Math.PI / 2;
    reelGroup.add(reelAxle);

    // 4 Radial Vanes
    for (let v = 0; v < 4; v++) {
      const vAngle = (v * Math.PI) / 2;
      const vaneGroup = new THREE.Group();
      vaneGroup.rotation.x = vAngle;

      // Radial Wooden Arms
      [-2.4, 2.4].forEach((axPos) => {
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.8, 0.08), ashWoodMat);
        arm.position.set(axPos, 0.9, 0);
        vaneGroup.add(arm);
      });

      // Horizontal Sweep Slat
      const slat = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.25, 0.04), ashWoodMat);
      slat.position.set(0, 1.8, 0);
      slat.castShadow = true;
      vaneGroup.add(slat);

      reelGroup.add(vaneGroup);
    }

    // 5. Standing Wheat Stalks Field & Falling Cut Stems
    const stalkCount = 45;
    const stalksInstanced = new THREE.InstancedMesh(
      new THREE.CylinderGeometry(0.03, 0.03, 1.6, 6),
      strawMat,
      stalkCount,
    );
    const dummy = new THREE.Object3D();
    for (let i = 0; i < stalkCount; i++) {
      dummy.position.set(
        -2.5 + deterministicUnit(i, 0) * 5.0,
        0.2,
        2.2 + deterministicUnit(i, 1) * 2.5,
      );
      dummy.rotation.set(
        (deterministicUnit(i, 2) - 0.5) * 0.2,
        0,
        (deterministicUnit(i, 3) - 0.5) * 0.2,
      );
      dummy.updateMatrix();
      stalksInstanced.setMatrixAt(i, dummy.matrix);
    }
    stalksInstanced.instanceMatrix.needsUpdate = true;
    rootGroup.add(stalksInstanced);

    // Cut Grain Sheaf on Deck
    const sheafGeo = new THREE.CylinderGeometry(0.35, 0.5, 2.2, 8);
    sheafGeo.rotateZ(Math.PI / 2);
    const sheafMesh = new THREE.Mesh(sheafGeo, strawMat);
    sheafMesh.position.set(0.6, -0.4, -0.6);
    sheafMesh.castShadow = true;
    platformGroup.add(sheafMesh);

    // Animation Loop
    let reqId: number;
    let presentationStep = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const p = live.current;
      // This is deliberately a fixed rendering step. It makes the same
      // control sequence reproduce the same pose without implying a wall-clock
      // simulation or a FrankenSim WASM solve.
      const elapsedSeconds = presentationStep / 60;
      presentationStep += 1;

      const sourceKinematics = stepMcCormickReaper({ forwardSpeedMph: p.groundSpeedMph });
      const wheelRadPerSec = (sourceKinematics.groundWheelRpm * 2 * Math.PI) / 60;
      const reelRadPerSec = (p.reelRpm * 2 * Math.PI) / 60;

      driveWheelGroup.rotation.x = wheelRadPerSec * elapsedSeconds;
      reelGroup.rotation.x = reelRadPerSec * elapsedSeconds;

      // Reciprocate Sickle Bar
      const sicklePhase = elapsedSeconds * (p.cutterCrankRpm / 60) * Math.PI * 2;
      sickleBarGroup.position.x = Math.sin(sicklePhase) * 0.18; // Illustrative visual amplitude only.

      stalksInstanced.visible = p.showStalks;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      studio.cleanup();
    };
  }, []);

  return (
    <div className="relative w-full h-[620px] bg-parchment-900 rounded-2xl overflow-hidden border border-parchment-700 shadow-2xl flex flex-col">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-parchment-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-parchment-100 uppercase tracking-wider">
            McCormick Reaper 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent X8277 (1834)
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-parchment-800 text-parchment-300 border border-parchment-700">
            host ratio estimate
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["sickle_guards", "Sickle Bar"],
              ["grain_reel", "Grain Reel"],
              ["platform", "Platform"],
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
            onClick={() => setShowStalks(!showStalks)}
            title="Toggle Wheat Stalks"
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              showStalks
                ? "bg-amber-600/30 text-amber-300 border border-amber-500/40"
                : "text-parchment-400 hover:text-white"
            }`}
          >
            {showStalks ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <StudioKernelChips
        visible
        title="McCormick cutter bar"
        chips={[
          { label: "Ground", value: String(groundSpeedMph), unit: "mph" },
          { label: "24-inch wheel", value: String(reaper.groundWheelRpm), unit: "rpm" },
          { label: "Crank", value: String(cutterCrankRpm), unit: "rpm" },
          { label: "Reel", value: String(reelRpm), unit: "rpm" },
        ]}
      />
    </div>
  );
}
