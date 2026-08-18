"use client";

import { Activity, Camera, Volume2, VolumeX, Wind, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { stepParsonsTurbine } from "@/physics/catalogKernels";
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

type CameraPreset = "iso" | "turbine_stages" | "rotor_blades" | "governor" | "top";

export function ParsonsTurbine3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Steam Turbomachinery Parameters
  const { params } = usePatentPhysics("us-608969-parsons-turbine");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const turbineRpm = params.rotorRpm ?? 3000;
  const steamPressureBar = params.steamPressureBar ?? (params.inletPressurePsi ?? 180) / 14.5038;
  const parsons = stepParsonsTurbine({
    rotorRpm: turbineRpm,
    inletPressurePsi: params.inletPressurePsi ?? steamPressureBar * 14.5038,
  });
  const powerKw = parsons.shaftPowerKw;
  const stageCount = parsons.stageCount;
  const [showSteamFlow, setShowSteamFlow] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    turbineRpm,
    steamPressureBar,
    showSteamFlow,
    isAudioMuted,
    shaftPowerKw: powerKw,
    enthalpyKjKg: parsons.enthalpyKjKg,
    inletMpa: parsons.inletMpa,
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
        camera.position.set(12.5, 8.0, 14.0);
        controls.target.set(0, 0, 0);
        break;
      case "turbine_stages":
        camera.position.set(0, 2.0, 5.0);
        controls.target.set(0, 0.5, 0);
        break;
      case "rotor_blades":
        camera.position.set(2.8, 1.8, 3.5);
        controls.target.set(1.5, 0.4, 0);
        break;
      case "governor":
        camera.position.set(-4.5, 2.2, 3.5);
        controls.target.set(-3.5, 1.0, 0);
        break;
      case "top":
        camera.position.set(0, 14.5, 0.1);
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
      cameraPos: [12.5, 8.0, 14.0],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Materials
    const castIronCasingMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.6,
      metalness: 0.7,
      side: THREE.DoubleSide,
    });

    const steelRotorMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.2,
      metalness: 0.8,
    });

    const bronzeBladesMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.3,
      metalness: 0.85,
      side: THREE.DoubleSide,
    });

    const statorBladesMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.4,
      metalness: 0.8,
      side: THREE.DoubleSide,
    });

    const steamGlowTex = createGlowPointTexture();

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Heavy Foundation Bed & Flanged Bearing Pedestals
    const bedplate = new THREE.Mesh(new THREE.BoxGeometry(13.0, 0.9, 6.5), castIronCasingMat);
    bedplate.position.y = -2.6;
    bedplate.receiveShadow = true;
    rootGroup.add(bedplate);

    // Bearing pedestals
    const pedestalLeft = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3.0, 2.0), castIronCasingMat);
    pedestalLeft.position.set(-5.5, -1.0, 0);
    rootGroup.add(pedestalLeft);
    const pedestalRight = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3.0, 2.0), castIronCasingMat);
    pedestalRight.position.set(5.5, -1.0, 0);
    rootGroup.add(pedestalRight);

    // 2. Stepped Reaction Turbine Casing (Lower Half Fixed, Upper Cutaway)
    const casingGroup = new THREE.Group();
    rootGroup.add(casingGroup);

    // 3. Stepped Rotor Drum with Bladed Stage Discs
    const rotorGroup = new THREE.Group();
    rootGroup.add(rotorGroup);

    // Drive Shaft
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 12.5, 32), steelRotorMat);
    shaft.rotation.z = Math.PI / 2;
    rotorGroup.add(shaft);

    // Dummy Piston Balance
    const dummyPiston = new THREE.Mesh(
      new THREE.CylinderGeometry(0.85, 0.85, 0.8, 32),
      steelRotorMat,
    );
    dummyPiston.rotation.z = Math.PI / 2;
    dummyPiston.position.set(-4.8, 0, 0);
    rotorGroup.add(dummyPiston);

    // Stages Configuration
    const stages = [
      { cx: -2.8, drumR: 0.8, casingR: 1.3, length: 3.0, rows: 8, bladeCount: 40 }, // HP Stage
      { cx: 0.2, drumR: 1.2, casingR: 1.8, length: 2.8, rows: 7, bladeCount: 60 }, // IP Stage
      { cx: 3.4, drumR: 1.6, casingR: 2.4, length: 3.2, rows: 6, bladeCount: 80 }, // LP Stage
    ];

    // Crescent Blade Geometry
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, 0.08);
    bladeShape.quadraticCurveTo(0.1, 0.04, 0.15, -0.08);
    bladeShape.quadraticCurveTo(0.05, -0.02, 0, 0.08);
    const extrudeSettings = { depth: 1.0, bevelEnabled: false };
    const baseBladeGeo = new THREE.ExtrudeGeometry(bladeShape, extrudeSettings);
    baseBladeGeo.center(); // Center it so we can scale Y for height

    let totalRotorBlades = 0;
    let totalStatorBlades = 0;
    stages.forEach((s) => {
      totalRotorBlades += s.rows * s.bladeCount;
      totalStatorBlades += s.rows * s.bladeCount;
    });

    const rotorInstanced = new THREE.InstancedMesh(baseBladeGeo, bronzeBladesMat, totalRotorBlades);
    rotorGroup.add(rotorInstanced);

    const statorInstanced = new THREE.InstancedMesh(
      baseBladeGeo,
      statorBladesMat,
      totalStatorBlades,
    );
    casingGroup.add(statorInstanced);

    let rotorIdx = 0;
    let statorIdx = 0;
    const dummyObj = new THREE.Object3D();

    stages.forEach(({ cx, drumR, casingR, length, rows, bladeCount }) => {
      // Drum
      const drum = new THREE.Mesh(
        new THREE.CylinderGeometry(drumR, drumR, length, 32),
        steelRotorMat,
      );
      drum.rotation.z = Math.PI / 2;
      drum.position.set(cx, 0, 0);
      rotorGroup.add(drum);

      // Casing (cutaway)
      const casing = new THREE.Mesh(
        new THREE.CylinderGeometry(
          casingR + 0.1,
          casingR + 0.1,
          length,
          64,
          1,
          false,
          0,
          Math.PI * 1.3,
        ),
        castIronCasingMat,
      );
      casing.rotation.z = Math.PI / 2;
      casing.position.set(cx, 0, 0);
      casing.castShadow = true;
      casing.receiveShadow = true;
      casingGroup.add(casing);

      const rowSpacing = length / (rows * 2);
      const startX = cx - length / 2 + rowSpacing;

      for (let r = 0; r < rows; r++) {
        // Rotor Row
        const rX = startX + r * 2 * rowSpacing;
        const bladeHeight = casingR - drumR - 0.02; // Gap of 0.02

        for (let b = 0; b < bladeCount; b++) {
          const angle = (b / bladeCount) * Math.PI * 2;
          dummyObj.position.set(
            rX,
            Math.cos(angle) * (drumR + bladeHeight / 2),
            Math.sin(angle) * (drumR + bladeHeight / 2),
          );
          dummyObj.rotation.set(angle, Math.PI / 2, 0);
          dummyObj.rotateY(Math.PI / 6); // Angle of attack
          dummyObj.scale.set(1.0, 1.0, bladeHeight);
          dummyObj.updateMatrix();
          rotorInstanced.setMatrixAt(rotorIdx++, dummyObj.matrix);
        }

        // Stator Row (attached to casing, pointing inwards)
        const sX = startX + r * 2 * rowSpacing + rowSpacing;
        for (let b = 0; b < bladeCount; b++) {
          const angle = (b / bladeCount) * Math.PI * 2;
          // Only add stator blades to the lower half + a bit of the cutaway so it matches the casing shell
          if (angle > Math.PI * 1.3 && angle < Math.PI * 2) continue; // Skip where casing is cut away

          dummyObj.position.set(
            sX,
            Math.cos(angle) * (casingR - bladeHeight / 2),
            Math.sin(angle) * (casingR - bladeHeight / 2),
          );
          dummyObj.rotation.set(angle + Math.PI, Math.PI / 2, 0);
          dummyObj.rotateY(-Math.PI / 6); // Reverse angle of attack for stator
          dummyObj.scale.set(1.0, 1.0, bladeHeight);
          dummyObj.updateMatrix();
          statorInstanced.setMatrixAt(statorIdx++, dummyObj.matrix);
        }
      }
    });

    // 4. Steam Flow Streamline Particles
    const steamCount = 300;
    const steamGeo = new THREE.BufferGeometry();
    const steamPositions = new Float32Array(steamCount * 3);
    const steamColors = new Float32Array(steamCount * 3);
    const steamRadii = new Float32Array(steamCount); // Store target radius for each particle

    for (let i = 0; i < steamCount; i++) {
      const idx = i * 3;
      const x = -4.5 + Math.random() * 9.5;

      // Determine radius based on stage
      let maxR = 0.8;
      if (x > -4.3 && x <= -1.3) maxR = 1.25;
      else if (x > -1.3 && x <= 1.7) maxR = 1.75;
      else if (x > 1.7 && x <= 5.0) maxR = 2.35;

      const r = maxR * Math.random() ** 0.5; // distribute within volume
      const a = Math.random() * Math.PI * 2;

      steamPositions[idx] = x;
      steamPositions[idx + 1] = Math.cos(a) * r;
      steamPositions[idx + 2] = Math.sin(a) * r;
      steamRadii[i] = r;

      steamColors[idx] = 0.8;
      steamColors[idx + 1] = 0.9;
      steamColors[idx + 2] = 1.0;
    }

    steamGeo.setAttribute("position", new THREE.BufferAttribute(steamPositions, 3));
    steamGeo.setAttribute("color", new THREE.BufferAttribute(steamColors, 3));

    const steamPoints = new THREE.Points(
      steamGeo,
      new THREE.PointsMaterial({
        size: 0.18,
        map: steamGlowTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    rootGroup.add(steamPoints);

    // Animation Loop
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = live.current;

      const omegaRadPerSec = (p.turbineRpm * 2 * Math.PI) / 60;
      rotorGroup.rotation.x += omegaRadPerSec * delta * 0.08;

      // Animate axial expansion of steam from HP inlet to LP exhaust
      const pos = steamPositions;
      for (let i = 0; i < steamCount; i++) {
        const idx = i * 3;
        pos[idx] += (p.enthalpyKjKg / 550) * (p.turbineRpm / 3000) * 12 * delta;
        let x = pos[idx];

        if (x > 5.0) {
          x = -4.5;
          pos[idx] = x;
        }

        let maxR = 0.8;
        if (x > -4.3 && x <= -1.3) maxR = 1.25;
        else if (x > -1.3 && x <= 1.7) maxR = 1.75;
        else if (x > 1.7 && x <= 5.0) maxR = 2.35;

        // Let steam radii expand to fill the chamber
        let r = steamRadii[i];
        if (r < maxR) {
          r += (maxR - r) * 5.0 * delta;
        } else if (r > maxR + 0.1) {
          r -= (r - maxR) * 10.0 * delta;
        }
        steamRadii[i] = r;

        let a = Math.atan2(pos[idx + 2], pos[idx + 1]);
        a += omegaRadPerSec * delta * 0.04;
        pos[idx + 1] = Math.cos(a) * r;
        pos[idx + 2] = Math.sin(a) * r;
      }
      steamGeo.attributes.position.needsUpdate = true;
      steamPoints.visible = p.showSteamFlow;
      (steamPoints.material as THREE.PointsMaterial).opacity = Math.min(
        0.95,
        0.25 + (p.shaftPowerKw / 14000) * 0.7,
      );

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
            Parsons Steam Turbine 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 608,969 (1898)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["turbine_stages", "Casing Stages"],
              ["rotor_blades", "Rotor Blades"],
              ["governor", "Governor"],
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
            onClick={() => setShowSteamFlow(!showSteamFlow)}
            title="Toggle Steam Streamlines"
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              showSteamFlow
                ? "bg-amber-600/30 text-amber-300 border border-amber-500/40"
                : "text-parchment-400 hover:text-white"
            }`}
          >
            <Wind className="w-4 h-4 text-sky-400" />
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

      <StudioKernelChips
        visible={showUiOverlay}
        title="Parsons reaction stages"
        chips={[
          { label: "Rotor", value: String(Math.round(turbineRpm)), unit: "rpm" },
          { label: "Inlet", value: parsons.inletMpa.toFixed(2), unit: "MPa" },
          { label: "h", value: String(parsons.enthalpyKjKg), unit: "kJ/kg" },
          { label: "Shaft", value: String(powerKw), unit: "kW" },
          { label: "Stages", value: String(stageCount) },
          { label: "u/c", value: String(parsons.steamBladeSpeedRatio) },
        ]}
      />
    </div>
  );
}
