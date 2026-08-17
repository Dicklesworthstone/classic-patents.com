"use client";

import { Radio, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { soundEngine } from "@/utils/soundEngine";
import { createThreeStudioScene } from "./ThreeStudioScene";

export function MorseTelegraph3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Telegraph Parameters
  const [wpmSpeed, setWpmSpeed] = useState<number>(20); // 5 to 40 WPM
  const [lineCurrentMa, setLineCurrentMa] = useState<number>(85); // 20 to 150 mA
  const [isKeyDown, setIsKeyDown] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Physics Calculations
  const dotDurationMs = Math.round(1200 / wpmSpeed);
  const dashDurationMs = dotDurationMs * 3;
  const electromagnetForceNewtons = ((lineCurrentMa / 100) * 4.2).toFixed(2);

  // Live Sound for Morse Clicks
  const handleKeyClick = (down: boolean) => {
    setIsKeyDown(down);
    if (isPlayingAudio) {
      if (down) {
        soundEngine.playMorseClick();
      } else {
        soundEngine.playMorseClick();
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with Museum Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [14, 11, 16],
      targetPos: [0, 0, 0],
      bgBottomColor: 0x0f172a,
      rimColor: 0xd97706,
      ambientIntensity: 1.3,
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS ---
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.9,
      roughness: 0.2,
    });

    const ironCoreMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.85,
      roughness: 0.35,
    });

    const copperCoilMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      metalness: 0.8,
      roughness: 0.3,
    });

    const mahoganyBaseMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.6,
      metalness: 0.1,
    });

    // --- 3D MORSE TELEGRAPH KEY & SOUNDER ASSEMBLY ---
    const telegraphGroup = new THREE.Group();
    scene.add(telegraphGroup);

    // Polished Mahogany Table Base
    const tableBase = new THREE.Mesh(new THREE.BoxGeometry(16, 0.8, 10), mahoganyBaseMat);
    tableBase.position.y = -3.0;
    tableBase.receiveShadow = true;
    telegraphGroup.add(tableBase);

    // 1. Sending Key Mechanism (Left Side)
    const keyGroup = new THREE.Group();
    keyGroup.position.set(-4.5, -2.4, 0);

    // Brass Base Pillar Supports
    const keyPillars = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.4, 1.2), brassMat);
    keyGroup.add(keyPillars);

    // Pivoting Brass Lever Arm
    const leverArm = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.35, 0.6), brassMat);
    leverArm.position.set(0.5, 0.9, 0);
    keyGroup.add(leverArm);

    // Bakelite / Hard Rubber Finger Knob
    const knob = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.6, 0.5, 24),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.2 }),
    );
    knob.position.set(3.4, 1.3, 0);
    keyGroup.add(knob);

    // Platinum Contact Anvil
    const keyContact = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 0.4, 16),
      new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.95, roughness: 0.1 }),
    );
    keyContact.position.set(2.4, 0.2, 0);
    keyGroup.add(keyContact);

    telegraphGroup.add(keyGroup);

    // 2. Receiving Electromagnet Sounder (Right Side)
    const sounderGroup = new THREE.Group();
    sounderGroup.position.set(4.5, -2.4, 0);

    // Dual Horseshoe Electromagnet Coils
    const coil1 = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 2.6, 24), copperCoilMat);
    coil1.position.set(-1.0, 1.3, 0);
    const coil2 = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 2.6, 24), copperCoilMat);
    coil2.position.set(1.0, 1.3, 0);
    sounderGroup.add(coil1);
    sounderGroup.add(coil2);

    // Soft Iron Armature Bar
    const armatureBar = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.4, 0.8), ironCoreMat);
    armatureBar.position.set(0, 2.8, 0);
    sounderGroup.add(armatureBar);

    // Brass Sounder Anvil Frame
    const sounderFrame = new THREE.Mesh(new THREE.BoxGeometry(4.2, 4.2, 0.4), brassMat);
    sounderFrame.position.set(0, 2.4, -1.2);
    sounderGroup.add(sounderFrame);

    telegraphGroup.add(sounderGroup);

    // --- ANIMATION & PHYSICS INTEGRATION LOOP ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      controls.update();

      // Lever depression and Armature snap
      const isPressed = isKeyDown || Math.sin(time * (wpmSpeed * 0.4)) > 0.4;
      leverArm.rotation.z = isPressed ? -0.06 : 0;
      armatureBar.position.y = isPressed ? 2.65 : 2.95;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      studio.dispose();
    };
  }, [wpmSpeed, isKeyDown]);

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Radio className="w-6 h-6 text-amber-500 animate-pulse" />
            <h3 className="font-serif text-2xl font-bold text-ink-950 dark:text-parchment-50">
              3D Real-Time Morse Electro-Magnetic Telegraph Simulator (US 1,647)
            </h3>
          </div>
          <p className="text-sm sm:text-base text-ink-700 dark:text-ink-300 mt-1">
            Studio-illuminated Three.js electromagnetic simulation of the{" "}
            <strong>spring-loaded brass telegraph key</strong> and{" "}
            <strong>electromagnetic sounder click</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all border shadow-2xs ${
              isPlayingAudio
                ? "bg-amber-600 text-white border-amber-700 shadow-sm"
                : "bg-parchment-200 dark:bg-ink-800 text-ink-800 dark:text-parchment-200 border-parchment-300 dark:border-ink-700"
            }`}
          >
            {isPlayingAudio ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
            <span>Click Sound: {isPlayingAudio ? "LIVE" : "MUTED"}</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas & HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-[#0f172a] border border-parchment-300 dark:border-ink-800 relative min-h-[460px] overflow-hidden shadow-inner">
          {/* Top HUD */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none text-xs sm:text-sm font-mono">
            <div className="px-3.5 py-1.5 bg-ink-900/90 border border-ink-800 text-amber-300 rounded-xl shadow-md">
              Sounder Pull: <span className="font-bold">{electromagnetForceNewtons} N</span> (Dot:{" "}
              {dotDurationMs} ms · Dash: {dashDurationMs} ms)
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                type="button"
                onMouseDown={() => handleKeyClick(true)}
                onMouseUp={() => handleKeyClick(false)}
                onTouchStart={() => handleKeyClick(true)}
                onTouchEnd={() => handleKeyClick(false)}
                className={`px-4 py-1.5 rounded-xl border font-mono font-bold text-xs transition-colors shadow-sm ${
                  isKeyDown
                    ? "bg-amber-600 text-white border-amber-500 scale-95"
                    : "bg-ink-900 text-amber-400 border-ink-700 hover:bg-ink-800"
                }`}
              >
                PRESS TELEGRAPH KEY (TAP)
              </button>
            </div>
          </div>

          {/* 3D Canvas */}
          <div ref={containerRef} className="w-full h-[460px] cursor-grab active:cursor-grabbing" />

          {/* Bottom Telemetry */}
          <div className="w-full grid grid-cols-4 gap-3 text-center text-sm font-mono p-4 bg-ink-950/95 border-t border-ink-800 text-ink-300 z-10">
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                CODE SPEED
              </span>
              <span className="text-amber-400 font-bold text-sm sm:text-base">{wpmSpeed} WPM</span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                LOOP CURRENT
              </span>
              <span className="text-emerald-400 font-bold text-sm sm:text-base">
                {lineCurrentMa} mA
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs font-semibold uppercase tracking-wider">
                CIRCUIT STATE
              </span>
              <span
                className={`font-bold text-sm sm:text-base ${isKeyDown ? "text-amber-400" : "text-blue-400"}`}
              >
                {isKeyDown ? "CLOSED (MARK)" : "OPEN (SPACE)"}
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
              Telegraph Line Controls
            </span>

            {/* WPM Speed Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Transmission Speed (WPM)
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">{wpmSpeed} WPM</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                step="1"
                value={wpmSpeed}
                onChange={(e) => setWpmSpeed(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Loop Current Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  {"Telegraph Loop Current ($I_{line}$)"}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {lineCurrentMa} mA
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="150"
                step="5"
                value={lineCurrentMa}
                onChange={(e) => setLineCurrentMa(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-ink-950 dark:text-parchment-100 text-xs sm:text-sm font-sans space-y-1.5">
              <span className="font-bold text-amber-900 dark:text-amber-300 block font-mono text-xs uppercase tracking-wider">
                Morse&apos;s Protocol &amp; Hardware:
              </span>
              <p className="leading-relaxed">
                Samuel Morse solved long-distance electric communication through two inventions: the
                binary dot-and-dash variable-duration code, and the relay-repeater electromagnet
                that refreshed degraded signals across continent-spanning copper lines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
