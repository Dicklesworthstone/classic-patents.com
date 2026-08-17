"use client";

import { Phone, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { soundEngine } from "@/utils/soundEngine";
import { createThreeStudioScene } from "./ThreeStudioScene";

export function BellTelephone3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Acoustic & Electrical Parameters
  const [acousticFrequencyHz, setAcousticFrequencyHz] = useState<number>(440); // 100 to 2000 Hz
  const [speechAmplitudeDb, setSpeechAmplitudeDb] = useState<number>(70); // 30 to 100 dB
  const [electrolyteDepthMm, setElectrolyteDepthMm] = useState<number>(4.0); // 1 to 10 mm
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Physical Calculations
  const batteryVoltage = 6.0;
  const circuitResistanceOhms = 20 + electrolyteDepthMm * 8;
  const currentMilliamps = (batteryVoltage / circuitResistanceOhms) * 1000;
  const acousticPressurePascals = 2e-5 * 10 ** (speechAmplitudeDb / 20);

  // Live Web Audio Acoustic Waveform
  useEffect(() => {
    if (isPlayingAudio) {
      soundEngine.playContinuousTone(acousticFrequencyHz, "sine", (speechAmplitudeDb / 100) * 0.1);
    } else {
      soundEngine.stopContinuousTone();
    }
    return () => {
      soundEngine.stopContinuousTone();
    };
  }, [isPlayingAudio, acousticFrequencyHz, speechAmplitudeDb]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with Museum Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [15, 11, 18],
      targetPos: [0, 0, 0],
      bgBottomColor: 0x0f172a,
      rimColor: 0x38bdf8,
      ambientIntensity: 1.3,
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS ---
    const brassMaterial = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.9,
      roughness: 0.2,
    });

    const ironDiaphragmMaterial = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      metalness: 0.8,
      roughness: 0.3,
    });

    const liquidElectrolyteMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      transmission: 0.82,
      opacity: 0.85,
      transparent: true,
      roughness: 0.1,
      ior: 1.33,
    });

    const needleMaterial = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.95,
      roughness: 0.1,
    });

    // --- 3D BELL VARIABLE-RESISTANCE TRANSMITTER ASSEMBLY ---
    const transmitterGroup = new THREE.Group();
    scene.add(transmitterGroup);

    // 1. Acoustic Speaking Horn Cone
    const hornMesh = new THREE.Mesh(new THREE.ConeGeometry(3.5, 4.5, 32, 1, true), brassMaterial);
    hornMesh.position.set(-6, 2.5, 0);
    hornMesh.rotation.z = -Math.PI / 2;
    transmitterGroup.add(hornMesh);

    // 2. Vibrating Parchment/Iron Acoustic Diaphragm
    const diaphragmMesh = new THREE.Mesh(new THREE.CircleGeometry(3.0, 32), ironDiaphragmMaterial);
    diaphragmMesh.position.set(-3.7, 2.5, 0);
    diaphragmMesh.rotation.y = Math.PI / 2;
    transmitterGroup.add(diaphragmMesh);

    // 3. Platinum Plunge Needle connected to Diaphragm
    const plungeNeedle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 3.2, 16),
      needleMaterial,
    );
    plungeNeedle.position.set(-1.0, 1.0, 0);
    plungeNeedle.rotation.z = Math.PI / 4;
    transmitterGroup.add(plungeNeedle);

    // 4. Acidulated Water Liquid Cup
    const cupMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.4, 2.5, 32), brassMaterial);
    cupMesh.position.set(0, -1.5, 0);
    transmitterGroup.add(cupMesh);

    const liquidMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.3, 2.0, 32),
      liquidElectrolyteMaterial,
    );
    liquidMesh.position.set(0, -1.4, 0);
    transmitterGroup.add(liquidMesh);

    // 5. Receiving Electromagnetic Sounder (Earphone)
    const receiverGroup = new THREE.Group();
    receiverGroup.position.set(8, 0, 0);

    const coilMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.4, 2.8, 24),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.8 }),
    );
    coilMesh.rotation.x = Math.PI / 2;
    receiverGroup.add(coilMesh);

    const ironCore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 3.6, 16),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 }),
    );
    ironCore.rotation.x = Math.PI / 2;
    receiverGroup.add(ironCore);

    const receiverDiaphragm = new THREE.Mesh(
      new THREE.CircleGeometry(2.4, 32),
      ironDiaphragmMaterial,
    );
    receiverDiaphragm.position.set(0, 0, 2.0);
    receiverGroup.add(receiverDiaphragm);

    transmitterGroup.add(receiverGroup);

    // --- 3D ACOUSTIC PRESSURE SOUND WAVES ---
    const waveCount = 20;
    const waveRings: THREE.Mesh[] = [];
    for (let i = 0; i < waveCount; i++) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.2, 0.35, 24),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7 }),
      );
      ring.position.set(-10 + i * 0.4, 2.5, 0);
      ring.rotation.y = Math.PI / 2;
      waveRings.push(ring);
      transmitterGroup.add(ring);
    }

    // --- ANIMATION & PHYSICS INTEGRATION LOOP ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      controls.update();

      // Acoustic Vibration Physics: x(t) = A sin(2pi f t)
      const omega = 2 * Math.PI * (acousticFrequencyHz / 100);
      const amp = (speechAmplitudeDb / 100) * 0.3;
      const vibration = Math.sin(time * omega) * amp;

      diaphragmMesh.position.x = -3.7 + vibration;
      plungeNeedle.position.y = 1.0 + vibration * 0.8;
      receiverDiaphragm.position.z = 2.0 + vibration * 0.7;

      // Sound Wave Propagation Animation
      waveRings.forEach((ring, idx) => {
        const ringProgress = (time * 2.0 + idx * 0.08) % 1.0;
        ring.scale.set(1 + ringProgress * 2.5, 1 + ringProgress * 2.5, 1);
        (ring.material as THREE.MeshBasicMaterial).opacity = (1 - ringProgress) * 0.8;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      studio.dispose();
    };
  }, [acousticFrequencyHz, speechAmplitudeDb]);

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Phone className="w-6 h-6 text-amber-500 animate-pulse" />
            <h3 className="font-serif text-2xl font-bold text-ink-950 dark:text-parchment-50">
              3D Real-Time Bell Telephone Acoustic Transducer Simulator (US 174,465)
            </h3>
          </div>
          <p className="text-sm sm:text-base text-ink-700 dark:text-ink-300 mt-1">
            Studio-illuminated Three.js electroacoustic simulation of{" "}
            <strong>variable-resistance liquid transmission</strong> and{" "}
            <strong>undulating electrical speech currents</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all border shadow-sm ${
              isPlayingAudio
                ? "bg-amber-600 text-white border-amber-700 animate-pulse"
                : "bg-parchment-200 dark:bg-ink-800 text-ink-800 dark:text-parchment-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-300"
            }`}
          >
            {isPlayingAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{isPlayingAudio ? "Audio Synth (Live)" : "Play Voice Tone"}</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas & HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-[#0f172a] border border-parchment-300 dark:border-ink-800 relative min-h-[460px] overflow-hidden shadow-inner">
          {/* Top HUD */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none text-xs sm:text-sm font-mono">
            <div className="px-3.5 py-1.5 bg-ink-900/90 border border-ink-800 text-amber-300 rounded-xl shadow-md">
              Circuit Resistance:{" "}
              <span className="font-bold">{circuitResistanceOhms.toFixed(1)} Ω</span> (
              {currentMilliamps.toFixed(1)} mA Undulating Current)
            </div>
          </div>

          {/* 3D Canvas */}
          <div ref={containerRef} className="w-full h-[460px] cursor-grab active:cursor-grabbing" />

          {/* Bottom Telemetry */}
          <div className="w-full grid grid-cols-4 gap-3 text-center text-sm font-mono p-4 bg-ink-950/95 border-t border-ink-800 text-ink-300 z-10">
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                ACOUSTIC FREQ
              </span>
              <span className="text-emerald-400 font-bold text-sm sm:text-base">
                {acousticFrequencyHz} Hz
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                SOUND LEVEL
              </span>
              <span className="text-amber-400 font-bold text-sm sm:text-base">
                {speechAmplitudeDb} dB
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                PRESSURE
              </span>
              <span className="text-blue-400 font-bold text-sm sm:text-base">
                {acousticPressurePascals.toFixed(3)} Pa
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                3D INTERACTION
              </span>
              <span className="text-purple-400 font-semibold text-xs sm:text-sm">
                Drag Orbit / Zoom
              </span>
            </div>
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/80 dark:bg-ink-900/70 p-6 space-y-5 shadow-sm">
            <span className="font-serif font-bold text-base sm:text-lg text-ink-950 dark:text-parchment-50 block">
              Acoustic &amp; Liquid Resistance Controls
            </span>

            {/* Acoustic Frequency Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Vocal Pitch Frequency ($f$)
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {acousticFrequencyHz} Hz
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="1200"
                step="20"
                value={acousticFrequencyHz}
                onChange={(e) => setAcousticFrequencyHz(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Speech Amplitude Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Vocal Volume Amplitude
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {speechAmplitudeDb} dB
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="95"
                step="5"
                value={speechAmplitudeDb}
                onChange={(e) => setSpeechAmplitudeDb(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Electrolyte Depth Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Electrolyte Plunge Depth ($L$)
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {electrolyteDepthMm} mm
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="10.0"
                step="0.5"
                value={electrolyteDepthMm}
                onChange={(e) => setElectrolyteDepthMm(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-ink-950 dark:text-parchment-100 text-xs sm:text-sm font-sans space-y-1.5">
              <span className="font-bold text-amber-900 dark:text-amber-300 block font-mono text-xs uppercase tracking-wider">
                Bell&apos;s Variable Resistance Discovery:
              </span>
              <p className="leading-relaxed">
                Prior telegraphs used on/off make-and-break switches (binary Morse). Bell discovered
                that dipping a needle attached to an acoustic diaphragm into acidulated water varied
                the circuit resistance smoothly ($i(t) \propto p(t)$), replicating the exact analog
                waveforms of human speech.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
