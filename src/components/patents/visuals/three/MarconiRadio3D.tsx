"use client";

import { Camera, Eye, EyeOff, Radio, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { HudText } from "@/components/ui/LatexRenderer";
import { FrankenSimEngine } from "@/physics/engine";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import {
  createGlowPointTexture,
  createThreeStudioScene,
  type StudioContext,
} from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "spark_gap" | "induction_coil" | "aerial_monopole" | "top";

export function MarconiRadio3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Spark-Gap Radio State Controls
  const { params } = usePatentPhysics("us-586193-marconi-radio");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const aerialHeightMeters = params.aerialHeight ?? 88;
  const sparkGapMm = params.sparkGapMm ?? 10;
  const inductionCoilKv = params.sparkVoltage ?? 28;
  const [showEmWavefronts, _setShowEmWavefronts] = useState<boolean>(true);
  const [isSparking, _setIsSparking] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  // Electromagnetic Wireless Physics (FrankenSim Monopole Radiation)
  const radioPhysics = FrankenSimEngine.stepMarconiRadio(
    aerialHeightMeters,
    sparkGapMm,
    inductionCoilKv,
  );

  useFrankenSimPhysics("us-586193-marconi-radio", {
    domain: "electromagnetics_flux",
    timestampMs: Date.now(),
    timeStepDt: 0.016,
    refusal: { isRefused: false },
    em: {
      frequencyHz: radioPhysics.resonantFreqMhz * 1e6,
      magneticFluxDensityTesla: 0,
      electricFieldVpm: 0,
      phaseAngleRad: 0,
      inductanceHenry: 0,
      capacitanceFarad: 0,
      currentAmperes: 0,
      voltageVolts: inductionCoilKv * 1000,
      powerFactor: 0,
      efficiencyPct: 0,
      synchronousRpm: 0,
      slipFraction: 0,
    },
  });
  const wavelengthMeters = radioPhysics.wavelengthMeters;
  const resonantFreqMhz = radioPhysics.resonantFreqMhz.toFixed(2);
  const maxRangeMiles = radioPhysics.maxRangeMiles.toFixed(1);
  const peakRfPowerKw = radioPhysics.peakRfPowerKw.toFixed(1);

  const live = useLiveSimParams({
    aerialHeightMeters,
    sparkGapMm,
    inductionCoilKv,
    showEmWavefronts,
    isSparking,
    isAudioMuted,
    resonantFreqMhz: radioPhysics.resonantFreqMhz,
    peakRfPowerKw: radioPhysics.peakRfPowerKw,
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
        camera.position.set(13, 10, 16);
        controls.target.set(0, 0, 0);
        break;
      case "spark_gap":
        camera.position.set(0, -0.8, 3.8);
        controls.target.set(0, -1.8, 0);
        break;
      case "induction_coil":
        camera.position.set(0, -1.2, -4.5);
        controls.target.set(0, -2.1, -1.8);
        break;
      case "aerial_monopole":
        camera.position.set(-3.5, 3.5, 6.5);
        controls.target.set(-3.5, 2.5, 0);
        break;
      case "top":
        camera.position.set(0, 13.5, 0.1);
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
      cameraPos: [13, 10, 16],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // --- PBR MATERIALS ---
    const brassBallMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.1,
      metalness: 0.98,
    });

    const copperAerialMat = new THREE.MeshStandardMaterial({
      color: 0xca8a04,
      roughness: 0.25,
      metalness: 0.88,
    });

    const woodMastMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.5,
      metalness: 0.05,
    });

    const groundEarthMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.6,
      metalness: 0.7,
    });

    // --- 3D MARCONI WIRELESS TRANSMITTER ASSEMBLY ---
    const radioGroup = new THREE.Group();
    scene.add(radioGroup);

    // Pine Wood Aerial Mast
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.35, 9.5, 16), woodMastMat);
    mast.position.set(-3.5, 0.8, 0);
    mast.castShadow = true;
    radioGroup.add(mast);
    const mastBaseY = -3.95;

    // Top Aerial Capacity Plate
    const capacityHat = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.2, 0.08, 24),
      copperAerialMat,
    );
    capacityHat.position.set(-3.5, 5.5, 0);
    radioGroup.add(capacityHat);

    // Guy Wires
    const guyWiresGeo = new THREE.BufferGeometry();
    const guyPositions: number[] = [];
    [-2.2, 2.2].forEach((gz) => {
      guyPositions.push(-3.5, 5.2, 0, -6.5, -3.0, gz);
      guyPositions.push(-3.5, 5.2, 0, -0.5, -3.0, gz);
      guyPositions.push(-3.5, 3.0, 0, -5.5, -3.0, gz * 0.8);
      guyPositions.push(-3.5, 3.0, 0, -1.5, -3.0, gz * 0.8);
    });
    guyWiresGeo.setAttribute("position", new THREE.Float32BufferAttribute(guyPositions, 3));
    const guyLines = new THREE.LineSegments(
      guyWiresGeo,
      new THREE.LineBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.6 }),
    );
    radioGroup.add(guyLines);

    // Aerial Wire
    const aerialWire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 8.5, 8),
      copperAerialMat,
    );
    aerialWire.position.set(-3.2, 0.8, 0);
    aerialWire.castShadow = true;
    radioGroup.add(aerialWire);

    // Induction Spark Coil Base
    const coilBase = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 0.35, 2.4),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.4 }),
    );
    coilBase.position.set(0, -2.8, -1.8);
    radioGroup.add(coilBase);

    const inductionCoil = new THREE.Mesh(
      new THREE.CylinderGeometry(0.65, 0.65, 2.6, 24),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 }),
    );
    inductionCoil.rotation.z = Math.PI / 2;
    inductionCoil.position.set(0, -2.1, -1.8);
    radioGroup.add(inductionCoil);

    // Augusto Righi 4-Sphere Spark Gap
    const sparkGapGroup = new THREE.Group();
    sparkGapGroup.position.set(0, -1.8, 0);

    const spherePositions = [-1.2, -0.4, 0.4, 1.2];
    spherePositions.forEach((sx, idx) => {
      const isInner = idx === 1 || idx === 2;
      const radius = isInner ? 0.35 : 0.28;
      const ball = new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 24), brassBallMat);
      ball.position.x = sx;
      ball.castShadow = true;
      sparkGapGroup.add(ball);

      const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.12, 1.0, 16),
        new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9 }),
      );
      pillar.position.set(sx, -0.6, 0);
      sparkGapGroup.add(pillar);
    });

    // Central Spark Discharge Arc Line
    const sparkArcMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
    });
    const sparkArcGeo = new THREE.BufferGeometry();
    const arcPositions = new Float32Array(15 * 3);
    sparkArcGeo.setAttribute("position", new THREE.BufferAttribute(arcPositions, 3));
    const sparkArc = new THREE.Line(sparkArcGeo, sparkArcMat);
    sparkGapGroup.add(sparkArc);

    radioGroup.add(sparkGapGroup);

    // Buried Earth Ground Plate
    const groundPlate = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.08, 3.0), groundEarthMat);
    groundPlate.position.set(0, -3.2, 0);
    radioGroup.add(groundPlate);

    // Ground Wire
    const groundWire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 1.4, 8),
      copperAerialMat,
    );
    groundWire.position.set(0, -2.5, 0);
    radioGroup.add(groundWire);

    // --- EXPANDING ELECTROMAGNETIC SPHERICAL WAVEFRONTS ---
    const waveCount = 5;
    const waveRings: THREE.Mesh[] = [];
    for (let i = 0; i < waveCount; i++) {
      const ringGeo = new THREE.RingGeometry(1.2 + i * 1.5, 1.28 + i * 1.5, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.7 - i * 0.12,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(-3.2, 1.0, 0);
      radioGroup.add(ring);
      waveRings.push(ring);
    }

    // --- GLOWING RF SPARK PHOTON PARTICLES ---
    const sparkCount = 60;
    const sparkParticleGeo = new THREE.BufferGeometry();
    const sparkParticlePos = new Float32Array(sparkCount * 3);
    const glowTex = createGlowPointTexture();

    for (let i = 0; i < sparkCount; i++) {
      const idx = i * 3;
      sparkParticlePos[idx] = (Math.random() - 0.5) * 0.8;
      sparkParticlePos[idx + 1] = -1.8 + (Math.random() - 0.5) * 0.3;
      sparkParticlePos[idx + 2] = (Math.random() - 0.5) * 0.4;
    }
    sparkParticleGeo.setAttribute("position", new THREE.BufferAttribute(sparkParticlePos, 3));

    const sparkPoints = new THREE.Points(
      sparkParticleGeo,
      new THREE.PointsMaterial({
        size: 0.28,
        map: glowTex,
        color: 0x67e8f9,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    radioGroup.add(sparkPoints);

    // --- RENDER LOOP & REAL-TIME RF OSCILLATION DYNAMICS ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const _delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const p = live.current;

      const mastScale = Math.max(0.25, (p.aerialHeightMeters ?? 88) / 88);
      mast.scale.y = mastScale;
      mast.position.y = mastBaseY + 4.75 * mastScale;
      capacityHat.position.y = mastBaseY + 9.5 * mastScale;

      if (p.isSparking) {
        sparkPoints.visible = true;
        sparkArc.visible = Math.random() > 0.15;

        const aPos = arcPositions;
        for (let i = 0; i < 15; i++) {
          const t = i / 14;
          const idx = i * 3;
          aPos[idx] = -0.4 + t * 0.8;
          aPos[idx + 1] = (Math.random() - 0.5) * 0.12;
          aPos[idx + 2] = (Math.random() - 0.5) * 0.12;
        }
        sparkArcGeo.attributes.position.needsUpdate = true;

        const sPos = sparkParticlePos;
        for (let i = 0; i < sparkCount; i++) {
          const idx = i * 3;
          sPos[idx] = (Math.random() - 0.5) * 0.8;
          sPos[idx + 1] = -1.8 + (Math.random() - 0.5) * 0.3;
          sPos[idx + 2] = (Math.random() - 0.5) * 0.4;
        }
        sparkParticleGeo.attributes.position.needsUpdate = true;
      } else {
        sparkPoints.visible = false;
        sparkArc.visible = false;
      }

      for (let i = 0; i < waveCount; i++) {
        const ring = waveRings[i];
        if (ring) {
          ring.visible = p.showEmWavefronts && p.isSparking;
          const wavePhase = (elapsed * (Math.max(0.2, p.resonantFreqMhz) / 0.85) + i * 0.7) % 3.0;
          ring.scale.setScalar(1.0 + wavePhase * 0.6);
          (ring.material as THREE.MeshBasicMaterial).opacity = Math.max(
            0,
            0.35 + (p.peakRfPowerKw / 80) * 0.5 - wavePhase * 0.24,
          );
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      studio.dispose();
    };
  }, [live]);

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
                <Radio className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 animate-pulse" />
                Electromagnetic Wireless Telemetry
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 sm:gap-y-1 mt-1 text-[10px] sm:text-xs font-sans">
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Wavelength:</span>{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {wavelengthMeters} m ({resonantFreqMhz} MHz)
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Peak RF:</span>{" "}
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {peakRfPowerKw} kW Pulse
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Range:</span>{" "}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {maxRangeMiles} Mi <HudText text="($D \\propto h^2$)" />
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Potential:</span>{" "}
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {inductionCoilKv} kV ({sparkGapMm} mm)
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 items-center gap-2 max-w-full">
              <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />
              <span className="truncate">
                Guglielmo Marconi (US 586,193) — Wireless Signals (1897)
              </span>
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
            aria-label={isAudioMuted ? "Unmute simulation audio" : "Mute simulation audio"}
            type="button"
            onClick={toggleSound}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={isAudioMuted ? "Enable Sound" : "Mute Sound"}
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
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
                ["spark_gap", "Spark Gap"],
                ["induction_coil", "Induction Coil"],
                ["aerial_monopole", "Aerial Mast"],
                ["top", "Radiation Axis"],
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
