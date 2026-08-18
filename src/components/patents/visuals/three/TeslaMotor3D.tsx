"use client";

import { Activity, Camera, Eye, EyeOff, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { HudText } from "@/components/ui/LatexRenderer";
import { FrankenSimEngine } from "@/physics/engine";
import { teslaBAt } from "@/physics/teslaKernel";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

type CameraPreset = "iso" | "stator_coils" | "squirrel_cage" | "shaft_drive" | "top";

export function TeslaMotor3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Electrical & Mechanical Simulation State
  const { params, updateParam } = usePatentPhysics("us-381968-tesla-motor");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const acFrequencyHz = params.frequency ?? 60;
  const phaseCount = (params.phaseCount as 2 | 3) ?? 2;
  const appliedLoadTorqueNm = params.loadTorque ?? 38.5;
  const [showMagneticFlux, _setShowMagneticFlux] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const isPlayingAudio = (params.acHum ?? 0) === 1;

  // Electromechanical Induction Physics Calculations (FrankenSim Engine)
  // Four/six coil sides around one N–S pair: a 2-pole rotating field.
  const fieldPoles = 2;
  const polePairs = fieldPoles / 2;
  const emPhysics = FrankenSimEngine.stepTeslaMotor(acFrequencyHz, fieldPoles, appliedLoadTorqueNm);
  const synchronousSpeedRpm = emPhysics.synchronousRpm;
  const slip = emPhysics.slipFraction;
  const rotorSpeedRpm = Math.round(synchronousSpeedRpm * (1 - slip));
  const electricalPowerWatts = Math.round(
    ((appliedLoadTorqueNm * (rotorSpeedRpm * 2 * Math.PI)) / 60) * 1.15,
  );
  const rotorInducedCurrentAmps = Math.round(emPhysics.currentAmperes);

  useFrankenSimPhysics("us-381968-tesla-motor", {
    domain: "electromagnetics_flux",
    em: {
      frequencyHz: acFrequencyHz,
      magneticFluxDensityTesla: 0.8,
      electricFieldVpm: 0,
      phaseAngleRad: 0,
      inductanceHenry: 0.12,
      capacitanceFarad: 0,
      currentAmperes: rotorInducedCurrentAmps,
      voltageVolts: 110,
      powerFactor: 0.85,
      efficiencyPct: 78,
      synchronousRpm: synchronousSpeedRpm,
      slipFraction: slip,
    },
  });

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

    // Heavy Cast-Iron Bedplate with Mounting Flanges
    const bedplate = new THREE.Mesh(
      new THREE.BoxGeometry(11.0, 0.7, 7.5),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6, metalness: 0.75 }),
    );
    bedplate.position.y = -4.2;
    bedplate.receiveShadow = true;
    statorGroup.add(bedplate);

    // 4 Anchor Bosses with Hexagonal Hold-Down Bolts
    [
      [-4.8, -3.0],
      [4.8, -3.0],
      [-4.8, 3.0],
      [4.8, 3.0],
    ].forEach(([bx, bz]) => {
      const boss = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 0.4, 16), statorIronMat);
      boss.position.set(bx, -3.7, bz);
      statorGroup.add(boss);

      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.35, 6), shaftSteelMat);
      bolt.position.set(bx, -3.4, bz);
      statorGroup.add(bolt);
    });

    // Twin Cast-Iron Pillow Block Bearing Pedestals (Fore & Aft)
    [-3.8, 3.8].forEach((pedZ) => {
      const pedestalGroup = new THREE.Group();
      pedestalGroup.position.set(0, -1.8, pedZ);

      // Flanged Pedestal Base
      const pedBase = new THREE.Mesh(new THREE.BoxGeometry(3.2, 3.8, 0.8), statorIronMat);
      pedBase.position.y = -1.2;
      pedBase.castShadow = true;
      pedestalGroup.add(pedBase);

      // Bronze Split Sleeve Bearing Bushing
      const bushing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.72, 0.72, 0.95, 24),
        new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.2 }),
      );
      bushing.rotation.x = Math.PI / 2;
      bushing.castShadow = true;
      pedestalGroup.add(bushing);

      // Brass Grease / Oil Cup Reservoirs
      const oilCup = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.14, 0.45, 12),
        new THREE.MeshStandardMaterial({ color: 0xc8963e, metalness: 0.92, roughness: 0.25 }),
      );
      oilCup.position.set(0, 0.95, 0);
      pedestalGroup.add(oilCup);

      statorGroup.add(pedestalGroup);
    });

    // Stator Outer Ring Core with Lamination Clamp Studs
    const statorGeo = new THREE.CylinderGeometry(5.2, 5.2, 3.8, 48, 1, true);
    const statorMesh = new THREE.Mesh(statorGeo, statorIronMat);
    statorMesh.castShadow = true;
    statorMesh.receiveShadow = true;
    statorGroup.add(statorMesh);

    // Stator Lamination Stack Ribs
    for (let l = 0; l < 8; l++) {
      const lamRing = new THREE.Mesh(
        new THREE.TorusGeometry(5.22, 0.04, 8, 48),
        new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 }),
      );
      lamRing.rotation.x = Math.PI / 2;
      lamRing.position.y = -1.6 + l * 0.46;
      statorGroup.add(lamRing);
    }

    // 4 Longitudinal Stator Through-Bolts with Hex Nuts
    for (let tb = 0; tb < 4; tb++) {
      const tbAngle = (tb * Math.PI) / 2 + Math.PI / 4;
      const tbX = Math.cos(tbAngle) * 5.0;
      const tbZ = Math.sin(tbAngle) * 5.0;
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.4, 8), shaftSteelMat);
      rod.position.set(tbX, 0, tbZ);
      statorGroup.add(rod);

      [-2.15, 2.15].forEach((nutY) => {
        const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.18, 6), shaftSteelMat);
        nut.position.set(tbX, nutY, tbZ);
        statorGroup.add(nut);
      });
    }

    // Terminal Connection Board with Knurled Brass Binding Posts
    const termBoard = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 1.2, 0.35),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5 }),
    );
    termBoard.position.set(0, 3.8, 4.2);
    statorGroup.add(termBoard);

    for (let post = 0; post < 4; post++) {
      const postMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.35, 12),
        new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.95, roughness: 0.2 }),
      );
      postMesh.rotation.x = Math.PI / 2;
      postMesh.position.set(-0.75 + post * 0.5, 3.8, 4.45);
      statorGroup.add(postMesh);
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

    // Polished Drive Shaft with Keyway Slot
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 9.8, 24), shaftSteelMat);
    shaft.rotation.x = Math.PI / 2;
    shaft.castShadow = true;
    rotorGroup.add(shaft);

    // Crowned Output Belt Pulley on Shaft Extension
    const pulleyGroup = new THREE.Group();
    pulleyGroup.position.set(0, 0, 4.4);

    const pulleyRim = new THREE.Mesh(
      new THREE.CylinderGeometry(1.45, 1.45, 1.1, 24),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.35 }),
    );
    pulleyRim.rotation.x = Math.PI / 2;
    pulleyRim.castShadow = true;
    pulleyGroup.add(pulleyRim);

    // Pulley Hub & Locking Setscrew
    const pulleyHub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.75, 0.75, 1.3, 16),
      shaftSteelMat,
    );
    pulleyHub.rotation.x = Math.PI / 2;
    pulleyGroup.add(pulleyHub);
    rotorGroup.add(pulleyGroup);

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

      // Electrical ω shown at 1/20 so a 60 Hz field is visible. HUD states ns.
      const visualScale = 1 / 20;
      const omegaElec = 2 * Math.PI * p.acFrequencyHz;
      bFieldAngle += omegaElec * visualScale * delta;
      const field = teslaBAt(bFieldAngle, phaseCount);
      bFieldArrow.setDirection(new THREE.Vector3(field.bx, 0, field.by));

      const omegaRotor = omegaElec * visualScale * (1 - p.slip);
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
        curAngle += omegaElec * visualScale * delta;

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
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-col gap-1.5 sm:gap-2 pointer-events-none max-w-[calc(100%-8rem)] sm:max-w-md transition-opacity duration-200">
            <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md p-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
              <div className="text-[10px] sm:text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse text-amber-500" />
                Polyphase Induction Telemetry
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 sm:gap-y-1 mt-1 text-[10px] sm:text-xs font-sans">
                <div>
                  <span className="text-ink-600 dark:text-ink-400">
                    <HudText text="Sync ($n_s$):" />
                  </span>{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {synchronousSpeedRpm} RPM
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">
                    <HudText text="Rotor ($n_r$):" />
                  </span>{" "}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {rotorSpeedRpm} RPM
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">
                    <HudText text="Slip ($s$):" />
                  </span>{" "}
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {(slip * 100).toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Power:</span>{" "}
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {electricalPowerWatts} W ({(electricalPowerWatts / 745.7).toFixed(1)} HP)
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 items-center gap-2 max-w-full">
              <Activity className="w-3.5 h-3.5 text-blue-500 animate-spin-slow shrink-0" />
              <span className="truncate">Rotor Current: {rotorInducedCurrentAmps} A RMS</span>
            </div>
          </div>
        )}

        {/* Top Right Tool Bar (Toggle UI, Audio, Pins, Reset) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showUiOverlay
                ? "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
                : "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
            }`}
            title={showUiOverlay ? "Hide Overlay UI (Clean 3D View)" : "Show Overlay UI"}
            aria-label={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
          >
            {showUiOverlay ? (
              <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
          <button
            aria-label="Toggle test tone"
            type="button"
            onClick={() => updateParam("acHum", isPlayingAudio ? 0 : 1)}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={isPlayingAudio ? "Mute Motor Audio" : "Enable Motor Harmonic Sound"}
          >
            {isPlayingAudio ? (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
          <button
            aria-label={showCalloutPins ? "Hide annotation pins" : "Show annotation pins"}
            type="button"
            onClick={() => setShowCalloutPins(!showCalloutPins)}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showCalloutPins
                ? "bg-amber-600 text-white border-amber-700 shadow-md"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
            title="Toggle Historical Patent Numeral Pins"
          >
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Camera Views Bar */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-1.5rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> View:
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
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-sans whitespace-nowrap shrink-0 transition-colors ${
                  activeCamera === id
                    ? "bg-amber-700 dark:bg-amber-600 text-white font-semibold shadow-xs"
                    : "text-ink-700 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
