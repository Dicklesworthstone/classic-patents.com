"use client";

import { Mic, Volume2, VolumeX, Waves } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { soundEngine } from "@/utils/soundEngine";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";

export function BellTelephone3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Acoustic & Electrical Simulation State
  const [acousticFrequencyHz, setAcousticFrequencyHz] = useState<number>(440); // 100 to 1200 Hz
  const [voiceAmplitude, setVoiceAmplitude] = useState<number>(0.65); // 0 to 1.0
  const [batteryVoltage, setBatteryVoltage] = useState<number>(6.0); // 1.5 to 12 V
  const [liquidConductivity, setLiquidConductivity] = useState<number>(1.2); // acidulated water S/m
  const [showAcousticWaves, setShowAcousticWaves] = useState<boolean>(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Electrical Physics Calculations
  // Resistance: R(t) = R_0 - k * A * sin(omega * t)
  const baseResistanceOhms = 40.0 / liquidConductivity;
  const resistanceModulationOhms = baseResistanceOhms * 0.45 * voiceAmplitude;
  const currentBaselineAmps = batteryVoltage / baseResistanceOhms;
  const peakAudioCurrentMa =
    (batteryVoltage / (baseResistanceOhms - resistanceModulationOhms) - currentBaselineAmps) * 1000;

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

    // Create Studio Scene with High-Luminosity Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [11, 8, 14],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;

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

    // Walnut Instrument Base
    const baseBoard = new THREE.Mesh(new THREE.BoxGeometry(10.0, 0.6, 6.0), polishedWoodMaterial);
    baseBoard.position.y = -3.2;
    baseBoard.receiveShadow = true;
    phoneGroup.add(baseBoard);

    // Speaking Cone / Acoustic Horn (Brass)
    const hornGeo = new THREE.CylinderGeometry(1.6, 0.45, 3.8, 36, 1, true);
    const hornMesh = new THREE.Mesh(hornGeo, brassMaterial);
    hornMesh.rotation.z = -Math.PI / 2;
    hornMesh.position.set(-3.2, 0.5, 0);
    hornMesh.castShadow = true;
    phoneGroup.add(hornMesh);

    // Flexible Parchment Diaphragm Disc
    const diaphragmGeo = new THREE.CircleGeometry(1.45, 36);
    const diaphragmMesh = new THREE.Mesh(diaphragmGeo, diaphragmMaterial);
    diaphragmMesh.rotation.y = Math.PI / 2;
    diaphragmMesh.position.set(-1.3, 0.5, 0);
    diaphragmMesh.castShadow = true;
    phoneGroup.add(diaphragmMesh);

    // Vertical Acid Liquid Cup (Glass + Electrolyte)
    const glassCup = new THREE.Mesh(
      new THREE.CylinderGeometry(1.1, 0.9, 2.2, 32),
      glassCupMaterial,
    );
    glassCup.position.set(2.0, -1.2, 0);
    phoneGroup.add(glassCup);

    const liquidMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(1.02, 0.82, 1.8, 32),
      liquidMaterial,
    );
    liquidMesh.position.set(2.0, -1.3, 0);
    phoneGroup.add(liquidMesh);

    // Variable-Resistance Platinum Dipping Needle Rod
    const rodGroup = new THREE.Group();
    rodGroup.position.set(2.0, 0.6, 0);

    const platinumRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 2.4, 16),
      platinumRodMaterial,
    );
    platinumRod.castShadow = true;
    rodGroup.add(platinumRod);
    phoneGroup.add(rodGroup);

    // Mechanical Linkage Arm Connecting Diaphragm to Rod
    const linkArm = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.1, 0.1), brassMaterial);
    linkArm.position.set(0.35, 0.5, 0);
    linkArm.castShadow = true;
    phoneGroup.add(linkArm);

    // Gravity Cell Battery Jars (Daniel Cell DC Supply)
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
      electronPos[idx] = 2.0 + (Math.random() - 0.5) * 0.5;
      electronPos[idx + 1] = -0.5 - Math.random() * 1.5;
      electronPos[idx + 2] = (Math.random() - 0.5) * 0.5;
    }

    electronGeo.setAttribute("position", new THREE.BufferAttribute(electronPos, 3));
    const electronPoints = new THREE.Points(
      electronGeo,
      new THREE.PointsMaterial({
        size: 0.35,
        map: glowTex,
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    scene.add(electronPoints);

    // --- RENDER LOOP & REAL-TIME PHYSICS SIMULATION ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Diaphragm & Needle Rod Vibration: y(t) = A * sin(2 * pi * f * t)
      const omega = 2 * Math.PI * (acousticFrequencyHz / 80); // Scaled for visual tracking
      const displacement = Math.sin(elapsed * omega) * 0.35 * voiceAmplitude;

      diaphragmMesh.position.x = -1.3 + displacement * 0.4;
      rodGroup.position.y = 0.6 + displacement;

      // Animate Acoustic Wavefronts expanding into speaking cone
      for (let i = 0; i < waveCount; i++) {
        const ring = waveRings[i];
        const offset = (elapsed * 2.5 + i * 0.8) % 4.0;
        ring.position.x = -4.8 - offset;
        const scale = 1.0 + offset * 0.35;
        ring.scale.set(scale, scale, scale);
        (ring.material as THREE.MeshBasicMaterial).opacity =
          Math.max(0, 0.7 - offset * 0.15) * (voiceAmplitude > 0.05 ? 1 : 0);
        ring.visible = showAcousticWaves;
      }

      // Animate Current Drift Velocity in Electrolyte
      const ePos = electronPos;
      const driftSpeed = (currentBaselineAmps / 0.15) * delta * 2.0;
      for (let i = 0; i < electronCount; i++) {
        const idx = i * 3;
        ePos[idx + 1] -= driftSpeed;
        if (ePos[idx + 1] < -2.1) {
          ePos[idx + 1] = -0.4;
          ePos[idx] = 2.0 + (Math.random() - 0.5) * 0.5;
          ePos[idx + 2] = (Math.random() - 0.5) * 0.5;
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
  }, [acousticFrequencyHz, voiceAmplitude, showAcousticWaves, currentBaselineAmps]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      {/* 3D WebGL Canvas Viewport */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Live HUD Telemetry Overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
            <div className="text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Waves className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              Variable-Resistance Telephony
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs font-sans">
              <div>
                <span className="text-ink-600 dark:text-ink-400">Baseline $R_0$:</span>{" "}
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {baseResistanceOhms.toFixed(1)} Ω
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Audio $\Delta R$:</span>{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  ±{resistanceModulationOhms.toFixed(1)} Ω
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">DC Bias Current:</span>{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {(currentBaselineAmps * 1000).toFixed(1)} mA
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Audio Signal $\Delta I$:</span>{" "}
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  ±{peakAudioCurrentMa.toFixed(1)} mA
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 flex items-center gap-2">
            <Mic className="w-3.5 h-3.5 text-amber-600" />
            <span>"Mr. Watson, come here — I want to see you." (March 10, 1876)</span>
          </div>
        </div>

        {/* Audio & Wave Toggles */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            type="button"
            onClick={() => setShowAcousticWaves(!showAcousticWaves)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all ${
              showAcousticWaves
                ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                : "bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
            }`}
          >
            Sound Waves
          </button>
          <button
            type="button"
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all ${
              isPlayingAudio
                ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                : "bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
            }`}
          >
            {isPlayingAudio ? (
              <>
                <Volume2 className="w-3.5 h-3.5 inline mr-1 animate-pulse" />
                Tone ON
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 inline mr-1" />
                Tone OFF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Parameter Sliders Panel */}
      <div className="p-4 sm:p-5 bg-parchment-100/80 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
        {/* Acoustic Frequency */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Voice Frequency ($f$):</span>
            <span className="font-bold text-amber-700 dark:text-amber-400">
              {acousticFrequencyHz} Hz ({acousticFrequencyHz === 440 ? "Concert A" : "Formant"})
            </span>
          </div>
          <input
            type="range"
            min="100"
            max="1000"
            step="20"
            value={acousticFrequencyHz}
            onChange={(e) => setAcousticFrequencyHz(Number(e.target.value))}
            className="w-full accent-amber-600 dark:accent-amber-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Sets membrane vibration velocity $\omega = 2\pi f$
          </span>
        </div>

        {/* Voice Amplitude */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Sound Pressure (Volume):</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {(voiceAmplitude * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={voiceAmplitude}
            onChange={(e) => setVoiceAmplitude(Number(e.target.value))}
            className="w-full accent-blue-600 dark:accent-blue-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Controls immersion depth of platinum needle
          </span>
        </div>

        {/* Battery Voltage */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>DC Battery Supply:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {batteryVoltage.toFixed(1)} V
            </span>
          </div>
          <input
            type="range"
            min="1.5"
            max="12.0"
            step="0.5"
            value={batteryVoltage}
            onChange={(e) => setBatteryVoltage(Number(e.target.value))}
            className="w-full accent-emerald-600 dark:accent-emerald-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Daniel cells supplying constant electrical potential
          </span>
        </div>

        {/* Liquid Conductivity */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Electrolyte Conductivity:</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">
              {liquidConductivity.toFixed(2)} S/m
            </span>
          </div>
          <input
            type="range"
            min="0.4"
            max="2.5"
            step="0.1"
            value={liquidConductivity}
            onChange={(e) => setLiquidConductivity(Number(e.target.value))}
            className="w-full accent-purple-600 dark:accent-purple-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Dilute sulfuric acid in water bath
          </span>
        </div>
      </div>
    </div>
  );
}
