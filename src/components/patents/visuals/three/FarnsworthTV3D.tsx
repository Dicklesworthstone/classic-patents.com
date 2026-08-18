"use client";

import { Camera, Eye, EyeOff, RotateCcw, Sparkles, Tv, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
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

type CameraPreset = "iso" | "photocathode" | "aperture" | "coils" | "top";

export function FarnsworthTV3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Dissector Tube State Controls
  const { params, updateParam: _updateParam } = usePatentPhysics("us-1773980-farnsworth-tv");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const acceleratingVoltageKv = (params.anodeVoltage ?? 1500) / 1000;
  const coilCurrentA = params.coilCurrent ?? 0.42;
  const deflectionGauss = FrankenSimEngine.farnsworthDeflectionGauss(coilCurrentA);
  const horizontalFreqKhz = params.horizontalFreqKhz ?? 15.75;
  const verticalFreqHz = params.verticalFreqHz ?? 60;
  const lightIntensityLux = params.lightIntensityLux ?? 500;
  const [showElectronBeam, _setShowElectronBeam] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  // Electron Optics Physics (FrankenSim Relativistic Electron Beam)
  const beamState = FrankenSimEngine.stepFarnsworthTv(
    acceleratingVoltageKv,
    deflectionGauss,
    lightIntensityLux,
  );
  const velocityMps = beamState.electronVelocityMps;
  const velocityFractionC = (beamState.relativisticBeta * 100).toFixed(1);
  const photocathodeCurrentUa = beamState.photocathodeCurrentUa.toFixed(1);

  useFrankenSimPhysics("us-1773980-farnsworth-tv", {
    domain: "semiconductor_microarch",
    refusal: { isRefused: false },
    semi: {
      biasVoltageVolts: acceleratingVoltageKv * 1000,
      currentGainAlpha: 0,
      holeDiffusionCoefficientCm2ps: 0,
      chargeTransferEfficiencyPct: 0,
      clockPeriodNs: 0,
      busBandwidthMbps: 0,
      electronVelocityMps: velocityMps,
      relativisticFractionC: Number(velocityFractionC),
    },
  });

  const live = useLiveSimParams({
    acceleratingVoltageKv,
    horizontalFreqKhz,
    verticalFreqHz,
    showElectronBeam,
    isAudioMuted,
    velocityMps,
    lightIntensityLux,
    gyroRadiusMm: beamState.gyroRadiusMm,
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
        camera.position.set(13, 9, 15);
        controls.target.set(0, 0, 0);
        break;
      case "photocathode":
        camera.position.set(-5.8, 1.4, 2.5);
        controls.target.set(-4.8, 0, 0);
        break;
      case "aperture":
        camera.position.set(4.8, 1.5, 2.2);
        controls.target.set(4.0, 0, 0);
        break;
      case "coils":
        camera.position.set(0, 3.8, 3.2);
        controls.target.set(0, 0, 0);
        break;
      case "top":
        camera.position.set(0, 9.5, 0.1);
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
      cameraPos: [13, 9, 15],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // --- PBR MATERIALS ---
    const glassEnvelopeMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.94,
      opacity: 1,
      transparent: true,
      roughness: 0.04,
      ior: 1.5,
      side: THREE.DoubleSide,
    });

    const photocathodeMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.35,
      metalness: 0.85,
      emissive: 0x0369a1,
      emissiveIntensity: 0.5,
    });

    const copperDeflectionCoilMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.25,
      metalness: 0.85,
    });

    const anodeBrassMat = new THREE.MeshStandardMaterial({
      color: 0xca8a04,
      roughness: 0.2,
      metalness: 0.9,
    });

    // --- 3D FARNSWORTH IMAGE DISSECTOR ASSEMBLY ---
    const tubeGroup = new THREE.Group();
    scene.add(tubeGroup);

    // Polished Mahogany Optical Bench Base
    const bench = new THREE.Mesh(
      new THREE.BoxGeometry(14.0, 0.6, 5.0),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.35 }),
    );
    bench.position.y = -2.8;
    bench.receiveShadow = true;
    tubeGroup.add(bench);

    // Dual Brass Tube Saddle Clamps
    [-3.5, 3.5].forEach((cx) => {
      const clamp = new THREE.Mesh(
        new THREE.CylinderGeometry(2.3, 2.3, 0.4, 24, 1, true),
        anodeBrassMat,
      );
      clamp.rotation.z = Math.PI / 2;
      clamp.position.set(cx, 0, 0);
      tubeGroup.add(clamp);

      const clampStandoff = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.3, 2.2, 12),
        anodeBrassMat,
      );
      clampStandoff.position.set(cx, -1.4, 0);
      tubeGroup.add(clampStandoff);
    });

    // Blown Borosilicate Glass Image Dissector Envelope
    const tubePoints: THREE.Vector2[] = [];
    tubePoints.push(new THREE.Vector2(0, 0));
    tubePoints.push(new THREE.Vector2(1.9, 0.2));
    tubePoints.push(new THREE.Vector2(2.0, 0.8));
    tubePoints.push(new THREE.Vector2(2.0, 9.8));
    tubePoints.push(new THREE.Vector2(1.2, 10.4));
    tubePoints.push(new THREE.Vector2(0.4, 10.9));
    tubePoints.push(new THREE.Vector2(0.01, 11.2));

    const tubeGeo = new THREE.LatheGeometry(tubePoints, 36);
    const glassTube = new THREE.Mesh(tubeGeo, glassEnvelopeMat);
    glassTube.rotation.z = -Math.PI / 2;
    glassTube.position.x = -5.4;
    tubeGroup.add(glassTube);

    // Semi-Transparent Cesium-Oxide Photocathode Target Disc
    const photocathode = new THREE.Mesh(new THREE.CircleGeometry(1.7, 36), photocathodeMat);
    photocathode.rotation.y = Math.PI / 2;
    photocathode.position.x = -4.8;
    tubeGroup.add(photocathode);

    const goldRim = new THREE.Mesh(
      new THREE.TorusGeometry(1.72, 0.04, 12, 36),
      new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.95 }),
    );
    goldRim.rotation.y = Math.PI / 2;
    goldRim.position.x = -4.8;
    tubeGroup.add(goldRim);

    // Brass Optical Camera Lens Barrel
    const lensBarrel = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.4, 2.2, 24), anodeBrassMat);
    lensBarrel.rotation.z = Math.PI / 2;
    lensBarrel.position.set(-6.8, 0, 0);
    lensBarrel.castShadow = true;
    tubeGroup.add(lensBarrel);

    const glassLens = new THREE.Mesh(
      new THREE.SphereGeometry(0.95, 24, 24),
      new THREE.MeshPhysicalMaterial({ color: 0x93c5fd, transmission: 0.95, ior: 1.52 }),
    );
    glassLens.position.set(-7.9, 0, 0);
    tubeGroup.add(glassLens);

    // Anode Aperture Finger Target
    const anodeFinger = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.28, 1.8, 16),
      anodeBrassMat,
    );
    anodeFinger.position.set(4.4, 0, 0);
    anodeFinger.rotation.z = Math.PI / 2;
    tubeGroup.add(anodeFinger);

    const apertureTip = new THREE.Mesh(
      new THREE.TorusGeometry(0.12, 0.04, 8, 16),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 }),
    );
    apertureTip.rotation.y = Math.PI / 2;
    apertureTip.position.set(3.5, 0, 0);
    tubeGroup.add(apertureTip);

    // Magnetic Focus Solenoid Outer Coil
    const focusCoil = new THREE.Mesh(
      new THREE.CylinderGeometry(2.15, 2.15, 7.2, 36, 1, true),
      new THREE.MeshStandardMaterial({
        color: 0x475569,
        roughness: 0.35,
        metalness: 0.8,
        wireframe: true,
      }),
    );
    focusCoil.rotation.z = Math.PI / 2;
    focusCoil.position.x = -0.2;
    tubeGroup.add(focusCoil);

    // 2-Axis Orthogonal Saddle Deflection Yokes
    for (let d = 0; d < 4; d++) {
      const dAngle = (d * Math.PI) / 2;
      const saddleYoke = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.35, 1.2),
        copperDeflectionCoilMat,
      );
      saddleYoke.position.set(0.5, Math.cos(dAngle) * 2.3, Math.sin(dAngle) * 2.3);
      saddleYoke.rotation.x = dAngle;
      tubeGroup.add(saddleYoke);
    }

    // --- GLOWING ELECTRON BEAM PARTICLES ---
    const beamCount = 350;
    const beamGeo = new THREE.BufferGeometry();
    const beamPos = new Float32Array(beamCount * 3);
    const beamColors = new Float32Array(beamCount * 3);

    const glowTex = createGlowPointTexture();

    for (let i = 0; i < beamCount; i++) {
      const idx = i * 3;
      const progress = i / beamCount;
      beamPos[idx] = -4.5 + progress * 9.3;
      beamPos[idx + 1] = 0;
      beamPos[idx + 2] = 0;

      beamColors[idx] = 0.3 + progress * 0.4;
      beamColors[idx + 1] = 0.8 + progress * 0.2;
      beamColors[idx + 2] = 1.0;
    }

    beamGeo.setAttribute("position", new THREE.BufferAttribute(beamPos, 3));
    beamGeo.setAttribute("color", new THREE.BufferAttribute(beamColors, 3));

    const beamPoints = new THREE.Points(
      beamGeo,
      new THREE.PointsMaterial({
        size: 0.4,
        map: glowTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    scene.add(beamPoints);

    // --- RENDER LOOP & REAL-TIME ELECTRON RASTER DYNAMICS ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const p = live.current;

      const hFreq = p.horizontalFreqKhz * 0.25;
      const vFreq = p.verticalFreqHz * 0.015;
      const hSawtooth = ((elapsed * hFreq) % 1.0) * 2 - 1;
      const vSawtooth = ((elapsed * vFreq) % 1.0) * 2 - 1;

      const bPos = beamPos;
      const beamVelocityScale = (p.velocityMps / 1e6) * 0.71;

      for (let i = 0; i < beamCount; i++) {
        const idx = i * 3;
        const progress = (bPos[idx] + 4.5) / 9.3;

        if (progress > 0.4) {
          const deflectFactor = (progress - 0.4) / 0.6;
          // Default 1.5 kV / 120 G gyro is ~11 mm; scale raster around that.
          const rasterScale = Math.min(1.5, Math.max(0.45, 11 / Math.max(6, p.gyroRadiusMm)));
          bPos[idx + 1] = vSawtooth * 0.9 * deflectFactor * rasterScale;
          bPos[idx + 2] = hSawtooth * 0.9 * deflectFactor * rasterScale;
        } else {
          bPos[idx + 1] = (Math.random() - 0.5) * 0.06;
          bPos[idx + 2] = (Math.random() - 0.5) * 0.06;
        }

        bPos[idx] += delta * beamVelocityScale;
        if (bPos[idx] > 4.8) {
          bPos[idx] = -4.5;
        }
      }
      beamGeo.attributes.position.needsUpdate = true;
      beamPoints.visible = p.showElectronBeam;
      (beamPoints.material as THREE.PointsMaterial).opacity = Math.min(
        0.95,
        0.2 + (p.lightIntensityLux / 800) * 0.75,
      );

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
                <Tv className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 animate-pulse" />
                Electron Dissector Optics Telemetry
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 sm:gap-y-1 mt-1 text-[10px] sm:text-xs font-sans">
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Beam Velocity:</span>{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {(velocityMps / 1e6).toFixed(1)}M m/s ({velocityFractionC}% c)
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Photo-Current:</span>{" "}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {photocathodeCurrentUa} µA
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">H-Sweep:</span>{" "}
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {horizontalFreqKhz.toFixed(2)} kHz
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">V-Field:</span>{" "}
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {verticalFreqHz} Hz
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 items-center gap-2 max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse shrink-0" />
              <span className="truncate">
                Philo T. Farnsworth (US 1,773,980) — Television System (1927)
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
            title={isAudioMuted ? "Enable Sound Synthesis" : "Mute Sound"}
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
                ["photocathode", "Photocathode"],
                ["aperture", "Anode Aperture"],
                ["coils", "Deflection Coils"],
                ["top", "Optical Axis"],
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
