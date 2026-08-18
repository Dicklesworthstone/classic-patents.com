"use client";

import { Camera, Eye, EyeOff, Mic, RotateCcw, Volume2, VolumeX, Waves, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { stepBellTelephone } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { createLcg } from "@/utils/lcg";
import { soundEngine } from "@/utils/soundEngine";
import {
  createGlowPointTexture,
  createThreeStudioScene,
  type StudioContext,
} from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

const lcg = createLcg(1315);

type CameraPreset = "iso" | "speaking_horn" | "liquid_transmitter" | "battery_cells" | "top";

export function BellTelephone3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { params } = usePatentPhysics("us-174465-bell-telephone");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const acousticFrequencyHz = params.acousticFrequencyHz ?? 440;
  const voiceAmplitude = ((params.voiceAmplitude ?? 75) - 40) / 55;
  const batteryVoltage = params.batteryVoltage ?? 6.0;
  const liquidConductivity = params.liquidConductivity ?? 1.2;
  const [showAcousticWaves, _setShowAcousticWaves] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const bell = stepBellTelephone({
    voiceAmplitude: params.voiceAmplitude ?? 75,
    airGap: params.airGap ?? 0.35,
    batteryVoltage,
    liquidConductivity,
    acousticFrequencyHz,
  });
  const baseResistanceOhms = bell.baseResistanceOhms;
  const resistanceModulationOhms = bell.resistanceModulationOhms;
  const currentBaselineAmps = bell.currentBaselineAmps;
  const peakAudioCurrentMa = bell.modulatedMa;

  const live = useLiveSimParams({
    acousticFrequencyHz,
    voiceAmplitude,
    showAcousticWaves,
    currentBaselineAmps,
    diaphragmUm: bell.diaphragmUm,
    modulatedMa: bell.modulatedMa,
    acousticDisplayOmegaRadPerS: bell.acousticDisplayOmegaRadPerS,
    electronDisplaySpeed: bell.electronDisplaySpeed,
    waveAdvancePerS: bell.waveAdvancePerS,
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
        camera.position.set(11, 8, 14);
        controls.target.set(0, 0, 0);
        break;
      case "speaking_horn":
        camera.position.set(-4.5, 1.8, 4.0);
        controls.target.set(-1.4, 0.5, 0);
        break;
      case "liquid_transmitter":
        camera.position.set(3.5, 1.2, 3.8);
        controls.target.set(2.0, -1.0, 0);
        break;
      case "battery_cells":
        camera.position.set(-3.5, 0.5, 4.5);
        controls.target.set(-2.5, -1.5, 1.8);
        break;
      case "top":
        camera.position.set(0, 11.0, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  // Sound Engine Integration
  useEffect(() => {
    if (isPlayingAudio) {
      soundEngine.playContinuousTone(acousticFrequencyHz, "sine", voiceAmplitude * 0.1);
    } else {
      soundEngine.stopContinuousTone();
    }
    return () => {
      soundEngine.stopContinuousTone();
    };
  }, [isPlayingAudio, acousticFrequencyHz, voiceAmplitude]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [11, 8, 14],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // --- PBR MATERIALS ---
    const brassMaterial = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.22,
      metalness: 0.9,
    });

    const polishedWoodMaterial = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.35,
      metalness: 0.1,
    });

    const diaphragmMaterial = new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      roughness: 0.6,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });

    const glassCupMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      ior: 1.45,
    });

    const liquidMaterial = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.75,
    });

    const platinumRodMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.08,
      metalness: 0.98,
    });

    // --- 3D TELEPHONE TRANSMITTER APPARATUS ---
    const phoneGroup = new THREE.Group();
    scene.add(phoneGroup);

    // Beveled Walnut Instrument Base
    const baseBoard = new THREE.Mesh(new THREE.BoxGeometry(10.0, 0.6, 6.0), polishedWoodMaterial);
    baseBoard.position.y = -3.2;
    baseBoard.receiveShadow = true;
    phoneGroup.add(baseBoard);

    // Flared Acoustic Speaking Horn
    const hornPoints: THREE.Vector2[] = [];
    hornPoints.push(new THREE.Vector2(0.42, 0));
    hornPoints.push(new THREE.Vector2(0.45, 0.6));
    hornPoints.push(new THREE.Vector2(0.55, 1.4));
    hornPoints.push(new THREE.Vector2(0.85, 2.4));
    hornPoints.push(new THREE.Vector2(1.35, 3.2));
    hornPoints.push(new THREE.Vector2(1.85, 3.7));
    hornPoints.push(new THREE.Vector2(1.88, 3.8));

    const hornGeo = new THREE.LatheGeometry(hornPoints, 48);
    const hornMesh = new THREE.Mesh(hornGeo, brassMaterial);
    hornMesh.rotation.z = -Math.PI / 2;
    hornMesh.position.set(-1.4, 0.5, 0);
    hornMesh.castShadow = true;
    phoneGroup.add(hornMesh);

    // Diaphragm Collar
    const collarMesh = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.08, 12, 32), brassMaterial);
    collarMesh.rotation.y = Math.PI / 2;
    collarMesh.position.set(-1.4, 0.5, 0);
    phoneGroup.add(collarMesh);

    for (let s = 0; s < 6; s++) {
      const sAngle = (s * Math.PI * 2) / 6;
      const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.15, 8), brassMaterial);
      screw.rotation.z = Math.PI / 2;
      screw.position.set(-1.4, 0.5 + Math.sin(sAngle) * 0.52, Math.cos(sAngle) * 0.52);
      phoneGroup.add(screw);
    }

    // Diaphragm Disc
    const diaphragmGeo = new THREE.CircleGeometry(0.48, 36);
    const diaphragmMesh = new THREE.Mesh(diaphragmGeo, diaphragmMaterial);
    diaphragmMesh.rotation.y = Math.PI / 2;
    diaphragmMesh.position.set(-1.38, 0.5, 0);
    diaphragmMesh.castShadow = true;
    phoneGroup.add(diaphragmMesh);

    // Glass Beaker Cup
    const beakerPoints: THREE.Vector2[] = [];
    beakerPoints.push(new THREE.Vector2(0, 0));
    beakerPoints.push(new THREE.Vector2(1.0, 0));
    beakerPoints.push(new THREE.Vector2(1.05, 0.1));
    beakerPoints.push(new THREE.Vector2(1.1, 1.8));
    beakerPoints.push(new THREE.Vector2(1.22, 2.2));
    const beakerGeo = new THREE.LatheGeometry(beakerPoints, 36);
    const glassCup = new THREE.Mesh(beakerGeo, glassCupMaterial);
    glassCup.position.set(2.0, -2.4, 0);
    phoneGroup.add(glassCup);

    // Liquid Electrolyte
    const liquidMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(1.04, 0.98, 1.6, 36),
      liquidMaterial,
    );
    liquidMesh.position.set(2.0, -1.5, 0);
    phoneGroup.add(liquidMesh);

    // Platinum Base Electrode
    const baseElectrode = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.4, 0.12, 16),
      platinumRodMaterial,
    );
    baseElectrode.position.set(2.0, -2.3, 0);
    phoneGroup.add(baseElectrode);

    // Dipping Needle Rod
    const rodGroup = new THREE.Group();
    rodGroup.position.set(2.0, 0.6, 0);

    const platinumRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.02, 2.4, 16),
      platinumRodMaterial,
    );
    platinumRod.castShadow = true;
    rodGroup.add(platinumRod);
    phoneGroup.add(rodGroup);

    // Linkage Arm
    const fulcrumPost = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.15, 2.2, 16),
      brassMaterial,
    );
    fulcrumPost.position.set(0.35, -0.6, 0);
    fulcrumPost.castShadow = true;
    phoneGroup.add(fulcrumPost);

    const linkArm = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.08, 0.08), brassMaterial);
    linkArm.position.set(0.35, 0.5, 0);
    linkArm.castShadow = true;
    phoneGroup.add(linkArm);

    // Battery Jars
    for (let b = 0; b < 2; b++) {
      const battery = new THREE.Mesh(
        new THREE.CylinderGeometry(0.7, 0.7, 1.6, 24),
        new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3, metalness: 0.8 }),
      );
      battery.position.set(-3.2 + b * 1.8, -2.1, 1.8);
      battery.castShadow = true;
      phoneGroup.add(battery);
    }

    // --- ACOUSTIC SOUND PRESSURE WAVES ---
    const waveCount = 5;
    const waveRings: THREE.Mesh[] = [];
    for (let i = 0; i < waveCount; i++) {
      const ringGeo = new THREE.TorusGeometry(0.6 + i * 0.45, 0.03, 12, 36);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.7 - i * 0.12,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.y = Math.PI / 2;
      ring.position.set(-5.5 - i * 0.6, 0.5, 0);
      phoneGroup.add(ring);
      waveRings.push(ring);
    }

    // --- GLOWING ELECTRICAL CURRENT PARTICLES ---
    const electronCount = 80;
    const electronGeo = new THREE.BufferGeometry();
    const electronPos = new Float32Array(electronCount * 3);
    const glowTex = createGlowPointTexture();

    for (let i = 0; i < electronCount; i++) {
      const idx = i * 3;
      electronPos[idx] = 2.0 + (lcg() - 0.5) * 0.5;
      electronPos[idx + 1] = -0.5 - lcg() * 1.5;
      electronPos[idx + 2] = (lcg() - 0.5) * 0.5;
    }

    electronGeo.setAttribute("position", new THREE.BufferAttribute(electronPos, 3));
    const electronPoints = new THREE.Points(
      electronGeo,
      new THREE.PointsMaterial({
        size: 0.32,
        map: glowTex,
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    phoneGroup.add(electronPoints);

    // --- RENDER LOOP & REAL-TIME ACOUSTIC OSCILLATION ---
    let reqId: number;
    let renderedSteps = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      renderedSteps += 1;
      const delta = 1 / 60;
      const elapsed = renderedSteps * (1 / 60);
      const p = live.current;

      const throwUm = Math.max(0.2, p.diaphragmUm);
      const oscillation =
        Math.sin(
          elapsed * (p.acousticDisplayOmegaRadPerS ?? 2 * Math.PI * p.acousticFrequencyHz * 0.05),
        ) *
        (throwUm / 8);

      diaphragmMesh.position.x = -1.38 + oscillation * 0.04;
      rodGroup.position.y = 0.6 - oscillation * 0.35;
      linkArm.rotation.z = -oscillation * 0.12;

      for (let i = 0; i < waveCount; i++) {
        const ring = waveRings[i];
        if (ring) {
          ring.visible = p.showAcousticWaves;
          const wavePhase = (elapsed * (p.waveAdvancePerS ?? 3) + i * 0.8) % 3.0;
          ring.scale.setScalar(1.0 + wavePhase * 0.4);
          (ring.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.8 - wavePhase * 0.25);
        }
      }

      const ePos = electronPos;
      const currentSpeed =
        ((p.electronDisplaySpeed ?? p.currentBaselineAmps * 12) +
          (p.modulatedMa / 1000) * oscillation * 12) *
        delta;
      for (let i = 0; i < electronCount; i++) {
        const idx = i * 3;
        ePos[idx + 1] -= currentSpeed;
        if (ePos[idx + 1] < -2.2) {
          ePos[idx + 1] = -0.5;
        }
      }
      electronGeo.attributes.position.needsUpdate = true;

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
                <Waves className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 animate-pulse" />
                Acoustic-Electric Telemetry
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 sm:gap-y-1 mt-1 text-[10px] sm:text-xs font-sans">
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Frequency:</span>{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {acousticFrequencyHz} Hz
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Liquid R:</span>{" "}
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {baseResistanceOhms.toFixed(1)} Ω (±{resistanceModulationOhms.toFixed(1)} Ω)
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">DC Current:</span>{" "}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {(currentBaselineAmps * 1000).toFixed(1)} mA
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">AC Mod:</span>{" "}
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    ±{peakAudioCurrentMa.toFixed(1)} mA
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 items-center gap-2 max-w-full">
              <Mic className="w-3.5 h-3.5 text-amber-600 animate-pulse shrink-0" />
              <span className="truncate">
                Alexander Graham Bell (US 174,465) — Variable Resistance (1876)
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
            aria-label="Toggle test tone"
            type="button"
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={isPlayingAudio ? "Mute Acoustic Tone" : "Play Continuous Sine Audio"}
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
                ["speaking_horn", "Speaking Horn"],
                ["liquid_transmitter", "Liquid Cup"],
                ["battery_cells", "Daniell Cell"],
                ["top", "Acoustic Axis"],
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
