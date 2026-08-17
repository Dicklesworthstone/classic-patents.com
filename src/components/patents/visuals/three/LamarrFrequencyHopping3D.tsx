"use client";

import { Radio } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createThreeStudioScene } from "./ThreeStudioScene";

export function LamarrFrequencyHopping3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Frequency Hopping Parameters
  const [hopRateHps, setHopRateHps] = useState<number>(15); // 4 to 40 hops/sec
  const [carrierChannels, _setCarrierChannels] = useState<number>(88); // 88 Piano Keys
  const [isJammingActive, setIsJammingActive] = useState<boolean>(true);
  const [showSpectrumWaterfall, _setShowSpectrumWaterfall] = useState<boolean>(true);

  // Spread Spectrum Electronic Warfare Physics
  const jammingImmunityDb = Math.round(10 * Math.log10(carrierChannels)); // Processing Gain = 10 log10(N) = +19.4 dB
  const interceptionProbabilityPct = ((1 / carrierChannels) * 100).toFixed(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with Museum Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [15, 12, 17],
      targetPos: [0, 0, 0],
      bgBottomColor: 0x0f172a,
      rimColor: 0x38bdf8,
      ambientIntensity: 1.3,
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS ---
    const brassRollersMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.95,
      roughness: 0.15,
    });

    const punchedPaperMat = new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      roughness: 0.8,
      metalness: 0.05,
    });

    const _torpedoSteelMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.9,
      roughness: 0.25,
    });

    const activeRfMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const _jammingRfMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });

    // --- 3D PLAYER PIANO ROLL MECHANISM ASSEMBLY ---
    const hoppingGroup = new THREE.Group();
    scene.add(hoppingGroup);

    // Dual Brass Slotted Paper Rollers (Transmitter & Torpedo Receiver)
    const roller1 = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 9.0, 32), brassRollersMat);
    roller1.rotation.z = Math.PI / 2;
    roller1.position.set(0, 2.5, -2.5);
    hoppingGroup.add(roller1);

    const roller2 = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 9.0, 32), brassRollersMat);
    roller2.rotation.z = Math.PI / 2;
    roller2.position.set(0, -2.5, 2.5);
    hoppingGroup.add(roller2);

    // Perforated 88-Note Slotted Paper Roll
    const paperPlane = new THREE.Mesh(new THREE.PlaneGeometry(8.5, 7.5), punchedPaperMat);
    paperPlane.rotation.x = -Math.PI / 4;
    hoppingGroup.add(paperPlane);

    // 88 Piano Key Contact Finger Array (Sensing roll perforations)
    const numPins = 16;
    const pinGroup = new THREE.Group();
    for (let i = 0; i < numPins; i++) {
      const pin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 1.2, 8),
        new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.95, roughness: 0.1 }),
      );
      pin.position.set(-3.8 + (i * 7.6) / numPins, 0.5, 0);
      pin.rotation.x = Math.PI / 4;
      pinGroup.add(pin);
    }
    hoppingGroup.add(pinGroup);

    // --- 3D FREQUENCY HOPPING SPECTRUM WATERFALL ---
    const spectrumBars: THREE.Mesh[] = [];
    const spectrumGroup = new THREE.Group();
    spectrumGroup.position.set(0, -3.8, 0);

    for (let i = 0; i < 32; i++) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.0, 0.2), activeRfMat.clone());
      bar.position.set(-4.0 + (i * 8.0) / 32, 0, 0);
      spectrumBars.push(bar);
      spectrumGroup.add(bar);
    }
    scene.add(spectrumGroup);

    // --- ANIMATION & PHYSICS INTEGRATION LOOP ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      controls.update();

      // Synchronized Roll Rotation
      const rollSpeed = (hopRateHps / 10) * 1.5;
      roller1.rotation.y = time * rollSpeed;
      roller2.rotation.y = time * rollSpeed;

      // Pseudo-random frequency channel hopping
      const currentChannel = Math.floor((time * hopRateHps) % 32);
      const jamChannel = Math.floor((time * (hopRateHps * 0.2)) % 32);

      spectrumGroup.visible = showSpectrumWaterfall;
      if (showSpectrumWaterfall) {
        spectrumBars.forEach((bar, idx) => {
          if (idx === currentChannel) {
            bar.scale.y = 2.5;
            (bar.material as THREE.MeshBasicMaterial).color.setHex(0x38bdf8); // True signal
          } else if (isJammingActive && (idx === jamChannel || idx === (jamChannel + 1) % 32)) {
            bar.scale.y = 2.0;
            (bar.material as THREE.MeshBasicMaterial).color.setHex(0xef4444); // Enemy jamming
          } else {
            bar.scale.y = 0.2;
            (bar.material as THREE.MeshBasicMaterial).color.setHex(0x334155);
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      studio.dispose();
    };
  }, [hopRateHps, isJammingActive, showSpectrumWaterfall]);

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Radio className="w-6 h-6 text-purple-500 animate-pulse" />
            <h3 className="font-serif text-2xl font-bold text-ink-950 dark:text-parchment-50">
              3D Real-Time Lamarr-Antheil Spread-Spectrum Secret Communication Simulator (US
              2,292,387)
            </h3>
          </div>
          <p className="text-sm sm:text-base text-ink-700 dark:text-ink-300 mt-1">
            Studio-illuminated Three.js electronic warfare simulation of{" "}
            <strong>synchronized 88-channel perforated player piano rolls</strong> and{" "}
            <strong>jamming-proof torpedo guidance</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-300 text-xs sm:text-sm font-mono font-bold border border-purple-300 dark:border-purple-800 shadow-2xs">
            +{jammingImmunityDb} dB Anti-Jamming Gain (88 Frequencies)
          </div>
        </div>
      </div>

      {/* 3D WebGL Canvas & HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-[#0f172a] border border-parchment-300 dark:border-ink-800 relative min-h-[460px] overflow-hidden shadow-inner">
          {/* Top HUD */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none text-xs sm:text-sm font-mono">
            <div className="px-3.5 py-1.5 bg-ink-900/90 border border-ink-800 text-purple-300 rounded-xl shadow-md">
              Anti-Jamming Processing Gain:{" "}
              <span className="font-bold">+{jammingImmunityDb} dB</span> (Interception:{" "}
              <span className="text-emerald-300 font-bold">{interceptionProbabilityPct}%</span>)
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={() => setIsJammingActive(!isJammingActive)}
                className={`px-3 py-1 rounded-lg border text-xs font-mono transition-colors ${
                  isJammingActive
                    ? "bg-red-600 text-white border-red-500"
                    : "bg-ink-900 text-ink-400 border-ink-800"
                }`}
              >
                Enemy Jamming: {isJammingActive ? "ACTIVE" : "OFF"}
              </button>
            </div>
          </div>

          {/* 3D Canvas */}
          <div ref={containerRef} className="w-full h-[460px] cursor-grab active:cursor-grabbing" />

          {/* Bottom Telemetry */}
          <div className="w-full grid grid-cols-4 gap-3 text-center text-sm font-mono p-4 bg-ink-950/95 border-t border-ink-800 text-ink-300 z-10">
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                HOPPING RATE
              </span>
              <span className="text-purple-400 font-bold text-sm sm:text-base">
                {hopRateHps} Hops / sec
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                CHANNELS
              </span>
              <span className="text-emerald-400 font-bold text-sm sm:text-base">
                88 Frequencies
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                SYNCHRONIZATION
              </span>
              <span className="text-blue-400 font-bold text-sm sm:text-base">
                Punched Paper Tape
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
              Spread-Spectrum Controls
            </span>

            {/* Hopping Rate Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  {"Carrier Hopping Frequency Rate ($f_{hop}$)"}
                </span>
                <span className="text-purple-600 dark:text-purple-400 font-bold">
                  {hopRateHps} Hops/s
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="40"
                step="2"
                value={hopRateHps}
                onChange={(e) => setHopRateHps(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-ink-950 dark:text-parchment-100 text-xs sm:text-sm font-sans space-y-1.5">
              <span className="font-bold text-purple-900 dark:text-purple-300 block font-mono text-xs uppercase tracking-wider">
                Hedy Lamarr&apos;s Spread Spectrum:
              </span>
              <p className="leading-relaxed">
                Hollywood actress Hedy Lamarr and avant-garde composer George Antheil co-invented
                frequency hopping to steer radio-guided Allied torpedoes without Axis enemy
                interception. Their patent became the foundation of modern Wi-Fi, Bluetooth, GPS,
                and CDMA cell networks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
