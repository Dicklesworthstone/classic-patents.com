"use client";

import { Camera, Eye, EyeOff, Radio, RotateCcw, Shield, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FrankenSimEngine } from "@/physics/engine";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "roll" | "waterfall" | "escapement" | "torpedo";

export function LamarrFrequencyHopping3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Spread Spectrum State Controls
  const { params } = usePatentPhysics("us-2292387-lamarr-frequency-hopping");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const carrierChannelsCount = params.channels ?? 88;
  const hopRateHopsPerSec = params.hopRate ?? 4;
  const isJammingActive = params.isJammingActive !== 0;
  const [currentChannel, setCurrentChannel] = useState<number>(1);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound } = usePatentAudio();

  // Spread Spectrum Physics Calculations (FrankenSim Slotted Frequency-Hopping)
  const fhPhysics = FrankenSimEngine.stepLamarrFrequencyHopping(
    carrierChannelsCount,
    hopRateHopsPerSec,
  );

  useFrankenSimPhysics("us-2292387-lamarr-frequency-hopping", {
    domain: "electromagnetics_flux",
    timestampMs: Date.now(),
    timeStepDt: 0.016,
    refusal: { isRefused: false },
    em: {
      frequencyHz: fhPhysics.spreadSpectrumBandwidthMhz * 1e6,
      magneticFluxDensityTesla: 0,
      electricFieldVpm: 0,
      phaseAngleRad: 0,
      inductanceHenry: 0,
      capacitanceFarad: 0,
      currentAmperes: 0,
      voltageVolts: 0,
      powerFactor: 0,
      efficiencyPct: 0,
      synchronousRpm: 0,
      slipFraction: 0,
    },
  });
  const processingGainDb = fhPhysics.processingGainDb.toFixed(1);
  const antiJamMarginDb = fhPhysics.antiJammingMarginDb.toFixed(1);
  const channelDenom = Math.max(1, carrierChannelsCount - 1);
  const activeFrequencyMhz = (
    302 +
    ((Math.max(1, currentChannel) - 1) * (520 - 302)) / channelDenom
  ).toFixed(1);

  const live = useLiveSimParams({
    hopRateHopsPerSec,
    isJammingActive,
    carrierChannelsCount,
    jamChannel: params.jamChannel ?? Math.floor(carrierChannelsCount * 0.3),
    isAudioMuted,
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
        camera.position.set(12, 9, 15);
        controls.target.set(0, 0, 0);
        break;
      case "roll":
        camera.position.set(0, 3.2, 4.0);
        controls.target.set(0, 1.4, 0);
        break;
      case "waterfall":
        camera.position.set(0, -3.2, 5.0);
        controls.target.set(0, -1.8, 0);
        break;
      case "escapement":
        camera.position.set(-4.5, 1.5, 3.5);
        controls.target.set(-3.0, 0.4, 0);
        break;
      case "torpedo":
        camera.position.set(8, 3, 9);
        controls.target.set(0, 0.5, 0);
        break;
    }
    controls.update();
  };

  const handleToggleSound = () => {
    toggleSound(() => {
      soundEngine.playPianoKeyHop(440);
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [12, 9, 15],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // --- PBR MATERIALS ---
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.18,
      metalness: 0.92,
    });

    const pianoRollPaperMat = new THREE.MeshStandardMaterial({
      color: 0xfef9e7,
      roughness: 0.8,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    // --- 3D PIANO ROLL & SPREAD SPECTRUM ASSEMBLY ---
    const apparatusGroup = new THREE.Group();
    scene.add(apparatusGroup);

    // Torpedo Guidance Bay Aluminum Housing Frame
    const torpedoBay = new THREE.Mesh(
      new THREE.CylinderGeometry(4.2, 4.2, 7.8, 36, 1, true),
      new THREE.MeshStandardMaterial({
        color: 0x334155,
        metalness: 0.85,
        roughness: 0.35,
        side: THREE.BackSide,
      }),
    );
    torpedoBay.rotation.z = Math.PI / 2;
    torpedoBay.position.y = 0.5;
    apparatusGroup.add(torpedoBay);

    // Brass Sideplates & Gear Train Framework
    [-2.6, 2.6].forEach((zPos) => {
      const sidePlate = new THREE.Mesh(new THREE.BoxGeometry(7.2, 2.8, 0.15), brassMat);
      sidePlate.position.set(0, 0.4, zPos);
      apparatusGroup.add(sidePlate);
    });

    // Take-Up & Supply Flanged Brass Spools
    const drum1 = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 5.0, 32), brassMat);
    drum1.rotation.x = Math.PI / 2;
    drum1.position.set(-3.0, 0.4, 0);
    drum1.castShadow = true;
    apparatusGroup.add(drum1);

    const drum2 = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 5.0, 32), brassMat);
    drum2.rotation.x = Math.PI / 2;
    drum2.position.set(3.0, 0.4, 0);
    drum2.castShadow = true;
    apparatusGroup.add(drum2);

    [-3.0, 3.0].forEach((xPos) => {
      [-2.55, 2.55].forEach((fz) => {
        const flange = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.08, 32), brassMat);
        flange.rotation.x = Math.PI / 2;
        flange.position.set(xPos, 0.4, fz);
        apparatusGroup.add(flange);
      });
    });

    // Perforated 88-Key Paper Roll Tape Web between drums
    const paperWeb = new THREE.Mesh(new THREE.PlaneGeometry(6.0, 4.8), pianoRollPaperMat);
    paperWeb.position.set(0, 1.45, 0);
    paperWeb.rotation.x = -Math.PI / 2;
    paperWeb.castShadow = true;
    paperWeb.receiveShadow = true;
    apparatusGroup.add(paperWeb);

    // 88-Key Spring Contact Sensing Comb with Gold Plunger Pins
    const comb = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.45, 4.9),
      new THREE.MeshStandardMaterial({ color: 0xca8a04, roughness: 0.2, metalness: 0.95 }),
    );
    comb.position.set(0, 1.7, 0);
    comb.castShadow = true;
    apparatusGroup.add(comb);

    for (let p = 0; p < 22; p++) {
      const pin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.35, 8),
        new THREE.MeshStandardMaterial({ color: 0xfef08a, metalness: 0.95 }),
      );
      pin.position.set(0, 1.48, -2.2 + p * 0.21);
      apparatusGroup.add(pin);
    }

    // --- 3D SPECTRAL WATERFALL FREQUENCY HOPPING BARS ---
    const spectrumBarsGroup = new THREE.Group();
    spectrumBarsGroup.position.set(0, -2.2, 0);

    const maxDisplayChannels = 88;
    const barMeshes: THREE.Mesh[] = [];

    for (let c = 0; c < maxDisplayChannels; c++) {
      const x = -5.0 + (c / Math.max(1, maxDisplayChannels - 1)) * 10.0;
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
    let activeChan = 22;
    // Coprime step with 88 piano keys — same shared roll as the 2D schematic.
    let rollStep = 0;
    const PIANO_KEYS = 88;
    const PIANO_ROLL_STEP = 37;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = live.current;

      hopTimer += delta;
      const hopInterval = 1.0 / Math.max(1, p.hopRateHopsPerSec);

      if (hopTimer >= hopInterval) {
        hopTimer = 0;
        rollStep += 1;
        const pianoKey = ((rollStep * PIANO_ROLL_STEP) % PIANO_KEYS) + 1;
        const liveChannels = Math.max(
          8,
          Math.min(maxDisplayChannels, Math.round(p.carrierChannelsCount)),
        );
        activeChan = Math.floor(((pianoKey - 1) / PIANO_KEYS) * liveChannels);
        setCurrentChannel(activeChan + 1);

        if (!p.isAudioMuted && rollStep % 3 === 0) {
          const freq = 220 + (pianoKey / PIANO_KEYS) * 660;
          soundEngine.playPianoKeyHop(freq);
        }
      }

      drum1.rotation.y += delta * 1.5;
      drum2.rotation.y += delta * 1.5;

      // Update Spectral Channel Waterfall — bar count tracks the channel slider.
      const liveChannels = Math.max(
        8,
        Math.min(maxDisplayChannels, Math.round(p.carrierChannelsCount)),
      );
      const jamCenter = Math.min(
        liveChannels - 1,
        Math.max(0, Math.round(p.jamChannel ?? liveChannels * 0.3) - 1),
      );
      for (let c = 0; c < maxDisplayChannels; c++) {
        const bar = barMeshes[c];
        if (c >= liveChannels) {
          bar.visible = false;
          continue;
        }
        bar.visible = true;
        bar.position.x = -5.0 + (c / Math.max(1, liveChannels - 1)) * 10.0;
        const mat = bar.material as THREE.MeshStandardMaterial;

        const isJammerBar =
          p.isJammingActive && (c === jamCenter - 1 || c === jamCenter || c === jamCenter + 1);
        if (c === activeChan && isJammerBar) {
          bar.scale.y = 5.2;
          bar.position.y = 1.05;
          mat.color.setHex(0xef4444);
          mat.emissive.setHex(0xef4444);
          mat.emissiveIntensity = 1.0;
        } else if (c === activeChan) {
          bar.scale.y = 4.5;
          bar.position.y = 0.9;
          mat.color.setHex(0x10b981);
          mat.emissive.setHex(0x10b981);
          mat.emissiveIntensity = 0.8;
        } else if (isJammerBar) {
          bar.scale.y = 6.0;
          bar.position.y = 1.2;
          mat.color.setHex(0xef4444);
          mat.emissive.setHex(0xef4444);
          mat.emissiveIntensity = 0.9;
        } else {
          bar.scale.y = 1.0;
          bar.position.y = 0.2;
          mat.color.setHex(0x334155);
          mat.emissive.setHex(0x000000);
          mat.emissiveIntensity = 0;
        }
      }

      const hPos = hopPos;
      for (let i = 0; i < hopCount; i++) {
        const idx = i * 3;
        hPos[idx + 1] += delta * 3.5;
        if (hPos[idx + 1] > 5.0) {
          hPos[idx + 1] = 1.5;
          hPos[idx] =
            -5.0 +
            (activeChan / Math.max(1, liveChannels - 1)) * 10.0 +
            (Math.random() - 0.5) * 0.8;
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
                <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 animate-pulse" />
                Spread Spectrum Telemetry
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 sm:gap-y-1 mt-1 text-[10px] sm:text-xs font-sans">
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Carrier Freq:</span>{" "}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {activeFrequencyMhz} MHz (Ch {currentChannel}/{carrierChannelsCount})
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Processing Gain:</span>{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    +{processingGainDb} dB ({carrierChannelsCount} Ch)
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Anti-Jam:</span>{" "}
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    +{antiJamMarginDb} dB
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Hop Rate:</span>{" "}
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {hopRateHopsPerSec} hops/sec
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 items-center gap-2 max-w-full">
              <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse shrink-0" />
              <span className="truncate">
                Hedy Lamarr &amp; George Antheil (US 2,292,387) — Secret Comm (1942)
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
            aria-label={isAudioMuted ? "Enable Sound Synthesis" : "Mute Sound"}
            type="button"
            onClick={handleToggleSound}
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
                ["roll", "88-Key Roll"],
                ["waterfall", "RF Waterfall"],
                ["escapement", "Escapement"],
                ["torpedo", "Torpedo Bay"],
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
