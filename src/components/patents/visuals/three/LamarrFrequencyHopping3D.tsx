"use client";

import { Radio, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";

export function LamarrFrequencyHopping3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Spread Spectrum State Controls
  const [carrierChannelsCount, setCarrierChannelsCount] = useState<number>(88); // 88 Piano keys
  const [hopRateHopsPerSec, setHopRateHopsPerSec] = useState<number>(12); // 4 to 30 hops/sec
  const [isJammingActive, setIsJammingActive] = useState<boolean>(true);
  const [currentChannel, setCurrentChannel] = useState<number>(44);

  // Spread Spectrum Physics Calculations
  // Processing Gain: PG = 10 * log10(Total Bandwidth / Channel Bandwidth)
  const processingGainDb = (10 * Math.log10(carrierChannelsCount)).toFixed(1);
  const antiJamMarginDb = (Number(processingGainDb) - 3.0).toFixed(1);
  const activeFrequencyMhz = (140.0 + (currentChannel / 88) * 40.0).toFixed(2);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with High-Luminosity Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [12, 9, 15],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS ---
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Polished instrument brass
      roughness: 0.18,
      metalness: 0.92,
    });

    const pianoRollPaperMat = new THREE.MeshStandardMaterial({
      color: 0xfef9e7, // Perforated paper piano roll
      roughness: 0.8,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    const _torpedoSteelMat = new THREE.MeshStandardMaterial({
      color: 0x475569, // Radio-controlled naval torpedo hull
      roughness: 0.25,
      metalness: 0.85,
    });

    // --- 3D PIANO ROLL & SPREAD SPECTRUM ASSEMBLY ---
    const apparatusGroup = new THREE.Group();
    scene.add(apparatusGroup);

    // Transmitter & Receiver Dual Piano Roll Drums
    const drum1 = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 5.2, 32), brassMat);
    drum1.position.set(-3.2, 0, 0);
    drum1.rotation.x = Math.PI / 2;
    drum1.castShadow = true;
    apparatusGroup.add(drum1);

    const drum2 = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 5.2, 32), brassMat);
    drum2.position.set(3.2, 0, 0);
    drum2.rotation.x = Math.PI / 2;
    drum2.castShadow = true;
    apparatusGroup.add(drum2);

    // Perforated 88-Key Paper Roll Tape Web between drums
    const paperWeb = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 4.8), pianoRollPaperMat);
    paperWeb.position.set(0, 1.2, 0);
    paperWeb.rotation.x = -Math.PI / 2;
    paperWeb.castShadow = true;
    paperWeb.receiveShadow = true;
    apparatusGroup.add(paperWeb);

    // Contact Finger Sensing Comb (88 spring-loaded contact pins)
    const comb = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.4, 4.8),
      new THREE.MeshStandardMaterial({ color: 0xca8a04, roughness: 0.2, metalness: 0.9 }),
    );
    comb.position.set(0, 1.45, 0);
    comb.castShadow = true;
    apparatusGroup.add(comb);

    // --- 3D SPECTRAL WATERFALL FREQUENCY HOPPING BARS ---
    const spectrumBarsGroup = new THREE.Group();
    spectrumBarsGroup.position.set(0, -2.2, 0);

    const numDisplayChannels = 44;
    const barMeshes: THREE.Mesh[] = [];

    for (let c = 0; c < numDisplayChannels; c++) {
      const x = -5.0 + (c / numDisplayChannels) * 10.0;
      const barGeo = new THREE.BoxGeometry(0.18, 0.4, 0.4);
      const barMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.3,
        metalness: 0.7,
      });
      const bar = new THREE.Mesh(barGeo, barMat);
      bar.position.set(x, 0.2, 0);
      spectrumBarsGroup.add(bar);
      barMeshes.push(bar);
    }
    apparatusGroup.add(spectrumBarsGroup);

    // --- GLOWING RF CARRIER HOPPING PARTICLES ---
    const hopCount = 80;
    const hopGeo = new THREE.BufferGeometry();
    const hopPos = new Float32Array(hopCount * 3);
    const glowTex = createGlowPointTexture();

    for (let i = 0; i < hopCount; i++) {
      const idx = i * 3;
      hopPos[idx] = (Math.random() - 0.5) * 8.0;
      hopPos[idx + 1] = 2.0 + Math.random() * 2.5;
      hopPos[idx + 2] = (Math.random() - 0.5) * 3.0;
    }

    hopGeo.setAttribute("position", new THREE.BufferAttribute(hopPos, 3));
    const hopPoints = new THREE.Points(
      hopGeo,
      new THREE.PointsMaterial({
        size: 0.4,
        map: glowTex,
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    scene.add(hopPoints);

    // --- RENDER LOOP & REAL-TIME SPREAD SPECTRUM HOPPING ---
    let reqId: number;
    const clock = new THREE.Clock();
    let hopTimer = 0;
    let activeChan = 44;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const _elapsed = clock.getElapsedTime();

      // Pseudo-Random Frequency Hopping Clocking
      hopTimer += delta;
      const hopInterval = 1.0 / hopRateHopsPerSec;

      if (hopTimer >= hopInterval) {
        hopTimer = 0;
        // Pseudo-random pseudo-sequence step (Lamarr piano perforation tape)
        activeChan = Math.floor(Math.random() * numDisplayChannels);
        setCurrentChannel(activeChan * 2);
      }

      // Rotate Piano Drums
      drum1.rotation.y += delta * 1.5;
      drum2.rotation.y += delta * 1.5;

      // Update Spectral Channel Waterfall
      for (let c = 0; c < numDisplayChannels; c++) {
        const bar = barMeshes[c];
        const mat = bar.material as THREE.MeshStandardMaterial;

        if (c === activeChan) {
          // Active Hopping Signal (Radiant Cyan/Green)
          bar.scale.y = 4.5;
          bar.position.y = 0.9;
          mat.color = new THREE.Color(0x10b981);
          mat.emissive = new THREE.Color(0x10b981);
          mat.emissiveIntensity = 0.8;
        } else if (isJammingActive && (c === 12 || c === 13 || c === 14)) {
          // Enemy Narrowband Jamming Spike (Red)
          bar.scale.y = 6.0;
          bar.position.y = 1.2;
          mat.color = new THREE.Color(0xef4444);
          mat.emissive = new THREE.Color(0xef4444);
          mat.emissiveIntensity = 0.9;
        } else {
          bar.scale.y = 1.0;
          bar.position.y = 0.2;
          mat.color = new THREE.Color(0x334155);
          mat.emissive = new THREE.Color(0x000000);
          mat.emissiveIntensity = 0;
        }
      }

      // Animate Hopping Particles
      const hPos = hopPos;
      for (let i = 0; i < hopCount; i++) {
        const idx = i * 3;
        hPos[idx + 1] += delta * 3.5;
        if (hPos[idx + 1] > 5.0) {
          hPos[idx + 1] = 1.5;
          hPos[idx] = -5.0 + (activeChan / numDisplayChannels) * 10.0 + (Math.random() - 0.5) * 0.8;
        }
      }
      hopGeo.attributes.position.needsUpdate = true;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      studio.dispose();
    };
  }, [hopRateHopsPerSec, isJammingActive]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      {/* 3D WebGL Canvas Viewport */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Live HUD Telemetry Overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
            <div className="text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              Frequency-Hopping Spread Spectrum
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs font-sans">
              <div>
                <span className="text-ink-600 dark:text-ink-400">Active Carrier:</span>{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {activeFrequencyMhz} MHz (Key #{currentChannel})
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Processing Gain ($G_p$):</span>{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  +{processingGainDb} dB (88 Channels)
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Anti-Jam Margin:</span>{" "}
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  +{antiJamMarginDb} dB Immunity
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Hop Rate:</span>{" "}
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {hopRateHopsPerSec} hops/second
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>
              Hedy Lamarr &amp; George Antheil (US 2,292,387) — Basis of Wi-Fi &amp; Bluetooth
            </span>
          </div>
        </div>

        {/* Jamming Toggle */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            type="button"
            onClick={() => setIsJammingActive(!isJammingActive)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all ${
              isJammingActive
                ? "bg-red-600 text-white border-red-700 shadow-sm"
                : "bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
            }`}
          >
            {isJammingActive ? "Enemy Jamming ON" : "Jamming Inactive"}
          </button>
        </div>
      </div>

      {/* Parameter Sliders Panel */}
      <div className="p-4 sm:p-5 bg-parchment-100/80 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
        {/* Hop Rate */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Hopping Velocity:</span>
            <span className="font-bold text-amber-700 dark:text-amber-400">
              {hopRateHopsPerSec} Hops/Sec
            </span>
          </div>
          <input
            type="range"
            min="4"
            max="30"
            step="2"
            value={hopRateHopsPerSec}
            onChange={(e) => setHopRateHopsPerSec(Number(e.target.value))}
            className="w-full accent-amber-600 dark:accent-amber-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Slotted player piano roll tape feed rate
          </span>
        </div>

        {/* Carrier Channels Count */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Piano Keys / Channels:</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              88 Discrete Frequencies
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="88"
            step="4"
            value={carrierChannelsCount}
            onChange={(e) => setCarrierChannelsCount(Number(e.target.value))}
            className="w-full accent-blue-600 dark:accent-blue-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Total spread spectrum bandwidth allocation
          </span>
        </div>

        {/* Torpedo Guidance Immunity */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Radio Torpedo Guidance:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              Unjammable (FHSS)
            </span>
          </div>
          <div className="w-full bg-parchment-300 dark:bg-ink-800 rounded-full h-3 overflow-hidden mt-2 border border-parchment-400 dark:border-ink-700">
            <div
              className="bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500 h-full transition-all duration-300"
              style={{ width: "96%" }}
            />
          </div>
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Narrowband jammers affect only 1/88th of transmission
          </span>
        </div>

        {/* Modern Heritage */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Modern Technology Lineage:</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">
              CDMA / Wi-Fi / GPS / Bluetooth
            </span>
          </div>
          <span className="text-[11px] text-ink-700 dark:text-parchment-200 block pt-1 leading-relaxed">
            Patented in 1942 as "Secret Communication System" by Hollywood actress Hedy Lamarr.
          </span>
        </div>
      </div>
    </div>
  );
}
