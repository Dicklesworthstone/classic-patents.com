"use client";

import { Radio, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { soundEngine } from "@/utils/soundEngine";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

export function MorseTelegraph3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Telegraph Circuit State Controls
  const [lineVoltageV, setLineVoltageV] = useState<number>(24); // 6 to 48 V
  const [lineLengthMiles, setLineLengthMiles] = useState<number>(44); // Baltimore to Washington (44 miles)
  const [keyIsDown, setKeyIsDown] = useState<boolean>(false);
  const [wpmSpeed, setWpmSpeed] = useState<number>(20); // 5 to 35 WPM
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(true);

  // Telegraph Circuit Physics Calculations
  // Line Resistance: R_line = 12 ohms/mile
  const lineResistanceOhms = Math.round(lineLengthMiles * 12.5);
  const coilResistanceOhms = 150;
  const totalResistanceOhms = lineResistanceOhms + coilResistanceOhms;
  const loopCurrentMa = ((lineVoltageV / totalResistanceOhms) * 1000).toFixed(1);
  const magneticHoldForceN = (Number(loopCurrentMa) * 0.08).toFixed(2);

  const live = useLiveSimParams({
    keyIsDown,
    lineVoltageV,
    lineLengthMiles,
    loopCurrentMa,
  });

  // Audio Click Trigger
  const handleKeyDown = () => {
    setKeyIsDown(true);
    if (isPlayingAudio) soundEngine.playMorseClick();
  };

  const handleKeyUp = () => {
    setKeyIsDown(false);
    if (isPlayingAudio) soundEngine.playMorseClick();
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with High-Luminosity Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [11, 8, 13],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS ---
    const mahoganyMat = new THREE.MeshStandardMaterial({
      color: 0x78350f, // Rich mahogany wood baseboard
      roughness: 0.35,
      metalness: 0.08,
    });

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Polished instrument brass
      roughness: 0.18,
      metalness: 0.92,
    });

    const copperCoilMat = new THREE.MeshStandardMaterial({
      color: 0xca8a04, // Silk-insulated copper wire windings
      roughness: 0.28,
      metalness: 0.85,
    });

    const ironCoreMat = new THREE.MeshStandardMaterial({
      color: 0x334155, // Soft iron electromagnet poles
      roughness: 0.4,
      metalness: 0.8,
    });

    const paperTapeMat = new THREE.MeshStandardMaterial({
      color: 0xfef9e7, // Paper register tape
      roughness: 0.8,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });

    // --- 3D MORSE TELEGRAPH APPARATUS ---
    const telegraphGroup = new THREE.Group();
    scene.add(telegraphGroup);

    // Beveled Honduras Mahogany Baseboard
    const base = new THREE.Mesh(new THREE.BoxGeometry(12.5, 0.7, 7.5), mahoganyMat);
    base.position.y = -2.4;
    base.castShadow = true;
    base.receiveShadow = true;
    telegraphGroup.add(base);

    // 4 Turned Brass Bun Feet
    [
      [-5.6, -3.2],
      [5.6, -3.2],
      [-5.6, 3.2],
      [5.6, 3.2],
    ].forEach(([fx, fz]) => {
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.25, 0.35, 16), brassMat);
      foot.position.set(fx, -2.9, fz);
      telegraphGroup.add(foot);
    });

    // --- SECTION 1: TRANSMITTING CAMELBACK KEY LEVER (LEFT) ---
    const keyGroup = new THREE.Group();
    keyGroup.position.set(-3.5, -1.8, 0);

    // Cast-Brass Key Baseplate
    const keyPlate = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.18, 2.2), brassMat);
    keyPlate.castShadow = true;
    keyGroup.add(keyPlate);

    // Conical Pivot Trunnion Posts & Screws
    [-0.9, 0.9].forEach((zPos) => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.85, 12), brassMat);
      post.position.set(0, 0.45, zPos);
      keyGroup.add(post);

      const pivotScrew = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.4, 8), brassMat);
      pivotScrew.rotation.x = Math.PI / 2;
      pivotScrew.position.set(0, 0.65, zPos * 0.7);
      keyGroup.add(pivotScrew);
    });

    // Camelback Curved Brass Key Lever
    const keyLeverGroup = new THREE.Group();
    keyLeverGroup.position.set(0, 0.65, 0);
    keyLeverGroup.name = "keyLever";

    const keyLever = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.16, 0.28), brassMat);
    keyLever.position.set(0.6, 0, 0);
    keyLever.castShadow = true;
    keyLeverGroup.add(keyLever);

    // Turned Ebony Finger Knob with Finger Saucer
    const knobSaucer = new THREE.Mesh(
      new THREE.CylinderGeometry(0.65, 0.55, 0.12, 24),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.25 }),
    );
    knobSaucer.position.set(2.4, 0.15, 0);
    knobSaucer.castShadow = true;
    keyLeverGroup.add(knobSaucer);

    const knobTop = new THREE.Mesh(
      new THREE.SphereGeometry(0.38, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.25 }),
    );
    knobTop.position.set(2.4, 0.42, 0);
    knobTop.castShadow = true;
    keyLeverGroup.add(knobTop);

    // Platinum Electrical Contact Points
    const contactUpper = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.15, 8),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.95 }),
    );
    contactUpper.position.set(1.4, -0.12, 0);
    keyLeverGroup.add(contactUpper);

    // Key Return Spring
    const returnSpring = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.4, 12),
      new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85 }),
    );
    returnSpring.position.set(0.8, -0.25, 0);
    keyGroup.add(returnSpring);

    keyGroup.add(keyLeverGroup);
    telegraphGroup.add(keyGroup);

    // --- SECTION 2: RELAY / SOUNDER ELECTROMAGNET (CENTER-RIGHT) ---
    const sounderGroup = new THREE.Group();
    sounderGroup.position.set(1.6, -1.8, -0.8);

    // Soft-Iron Yoke Base Strap
    const ironYoke = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 2.4), ironCoreMat);
    ironYoke.castShadow = true;
    sounderGroup.add(ironYoke);

    // Dual Vertical Electromagnet Coils (Horseshoe Magnet Wire Bobbins)
    for (let c = 0; c < 2; c++) {
      const zPos = (c - 0.5) * 1.6;
      // Black Vulcanized Fiber Flanges (top and bottom)
      [-0.1, 2.1].forEach((yFlange) => {
        const flange = new THREE.Mesh(
          new THREE.CylinderGeometry(0.72, 0.72, 0.08, 24),
          new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 }),
        );
        flange.position.set(0, yFlange, zPos);
        sounderGroup.add(flange);
      });

      const coil = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 2.0, 24), copperCoilMat);
      coil.position.set(0, 1.0, zPos);
      coil.castShadow = true;
      sounderGroup.add(coil);

      const core = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 2.3, 16), ironCoreMat);
      core.position.set(0, 1.15, zPos);
      sounderGroup.add(core);
    }

    // Cast Brass Sounding Anvil Arch Bridge
    const anvilArch = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2.6, 2.2), brassMat);
    anvilArch.position.set(1.4, 1.3, 0);
    anvilArch.castShadow = true;
    sounderGroup.add(anvilArch);

    // Sounder Armature Lever & Soft Iron Keeper
    const armatureGroup = new THREE.Group();
    armatureGroup.position.set(0, 2.35, 0);

    const softIronKeeper = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.25, 2.2), ironCoreMat);
    softIronKeeper.castShadow = true;
    armatureGroup.add(softIronKeeper);

    const sounderBar = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.22, 0.28), brassMat);
    sounderBar.position.set(1.1, 0.08, 0);
    sounderBar.castShadow = true;
    armatureGroup.add(sounderBar);

    sounderGroup.add(armatureGroup);
    telegraphGroup.add(sounderGroup);

    // --- SECTION 3: CLOCKWORK PAPER TAPE EMBOSSING REGISTER (FAR RIGHT) ---
    const registerGroup = new THREE.Group();
    registerGroup.position.set(4.6, -1.8, 1.4);

    // Clockwork Brass Sideplates & Spool Drum
    const spoolDrum = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.4, 0.8, 32),
      new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85 }),
    );
    spoolDrum.rotation.x = Math.PI / 2;
    spoolDrum.position.set(0, 1.2, 0);
    registerGroup.add(spoolDrum);

    // Paper Tape Roll Wounded on Drum
    const tapeRoll = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.6, 32), paperTapeMat);
    tapeRoll.rotation.x = Math.PI / 2;
    tapeRoll.position.set(0, 1.2, 0);
    registerGroup.add(tapeRoll);

    // Friction Feed Rollers
    const roller1 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.7, 16), brassMat);
    roller1.rotation.x = Math.PI / 2;
    roller1.position.set(-1.2, 1.0, 0);
    registerGroup.add(roller1);

    telegraphGroup.add(registerGroup);

    // --- BRASS TERMINAL BINDING POSTS ---
    [-4.8, -4.0, 4.8].forEach((bx) => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.6, 16), brassMat);
      post.position.set(bx, -1.8, -2.8);
      telegraphGroup.add(post);
    });

    // --- GLOWING TELEGRAPH CURRENT WIRE PARTICLES ---
    const currentCount = 90;
    const currentGeo = new THREE.BufferGeometry();
    const currentPos = new Float32Array(currentCount * 3);
    const glowTex = createGlowPointTexture();

    for (let i = 0; i < currentCount; i++) {
      const idx = i * 3;
      currentPos[idx] = -3.2 + (i / currentCount) * 6.0;
      currentPos[idx + 1] = -2.0;
      currentPos[idx + 2] = 0;
    }

    currentGeo.setAttribute("position", new THREE.BufferAttribute(currentPos, 3));
    const currentPoints = new THREE.Points(
      currentGeo,
      new THREE.PointsMaterial({
        size: 0.35,
        map: glowTex,
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    scene.add(currentPoints);

    // --- RENDER LOOP & REAL-TIME MORSE DYNAMICS ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const p = live.current;

      // Automatic Morse Code Beacon: "WHAT HATH GOD WROUGHT"
      // Simulated periodic key presses if not manually held
      const autoPattern = Math.sin(elapsed * 6.0) > 0.3 && elapsed % 4.0 < 2.5;
      const isEnergized = p.keyIsDown || autoPattern;

      // Key Lever Dip
      const keyMesh = keyGroup.getObjectByName("keyLever");
      if (keyMesh) {
        keyMesh.rotation.z = isEnergized ? 0.08 : 0;
      }

      // Armature Sounder Click Down toward electromagnet pole shoes
      armatureGroup.position.y = isEnergized ? 2.25 : 2.45;

      // Pulse Wire Current Particles
      currentPoints.visible = isEnergized;
      const cPos = currentPos;
      const currentSpeed = Math.min(25.0, Math.max(5.0, Number(p.loopCurrentMa) * 0.15));
      for (let i = 0; i < currentCount; i++) {
        const idx = i * 3;
        cPos[idx] += delta * currentSpeed;
        if (cPos[idx] > 2.8) {
          cPos[idx] = -3.2;
        }
      }
      currentGeo.attributes.position.needsUpdate = true;

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
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
            <div className="text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              Morse Telegraph Circuit Telemetry
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs font-sans">
              <div>
                <span className="text-ink-600 dark:text-ink-400">Loop Current ($I$):</span>{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {loopCurrentMa} mA DC
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Line Resistance:</span>{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {totalResistanceOhms} Ω ({lineLengthMiles} miles)
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Armature Force ($F$):</span>{" "}
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {magneticHoldForceN} N
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Transmission Rate:</span>{" "}
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {wpmSpeed} WPM (PARIS standard)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>"What hath God wrought" (May 24, 1844 — Washington to Baltimore)</span>
          </div>
        </div>

        {/* Interactive Morse Key Tap Button */}
        <div className="absolute bottom-4 left-4 z-10 flex gap-2">
          <button
            type="button"
            onMouseDown={handleKeyDown}
            onMouseUp={handleKeyUp}
            onTouchStart={handleKeyDown}
            onTouchEnd={handleKeyUp}
            className={`px-5 py-2.5 rounded-xl font-sans font-bold text-sm shadow-lg transition-all active:scale-95 ${
              keyIsDown
                ? "bg-amber-500 text-white ring-4 ring-amber-400/40"
                : "bg-white dark:bg-ink-800 text-ink-900 dark:text-parchment-100 border border-parchment-300 dark:border-ink-700"
            }`}
          >
            {keyIsDown ? "KEY CLOSED (CIRCUIT ON)" : "TAP MORSE KEY"}
          </button>
        </div>

        {/* Audio Toggle */}
        <div className="absolute top-4 right-4 z-10">
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
                Sounder Click ON
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 inline mr-1" />
                Sounder Click OFF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Parameter Sliders Panel */}
      <div className="p-4 sm:p-5 bg-parchment-100/80 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
        {/* Line Voltage */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Battery Bank Voltage ($V$):</span>
            <span className="font-bold text-amber-700 dark:text-amber-400">{lineVoltageV} V</span>
          </div>
          <input
            type="range"
            min="6"
            max="48"
            step="6"
            value={lineVoltageV}
            onChange={(e) => setLineVoltageV(Number(e.target.value))}
            className="w-full accent-amber-600 dark:accent-amber-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Grove nitric acid battery cells in series
          </span>
        </div>

        {/* Transmission Line Length */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Telegraph Wire Span:</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {lineLengthMiles} miles ({lineResistanceOhms} Ω)
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="150"
            step="5"
            value={lineLengthMiles}
            onChange={(e) => setLineLengthMiles(Number(e.target.value))}
            className="w-full accent-blue-600 dark:accent-blue-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Galvanized iron telegraph wire on cedar poles
          </span>
        </div>

        {/* Transmission Speed */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Operator Keying Speed:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {wpmSpeed} Words/Min
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="35"
            step="1"
            value={wpmSpeed}
            onChange={(e) => setWpmSpeed(Number(e.target.value))}
            className="w-full accent-emerald-600 dark:accent-emerald-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Dot = 1 unit, Dash = 3 units, Word space = 7 units
          </span>
        </div>

        {/* Relay Margin */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Relay Sensitivity Margin:</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">
              {Number(loopCurrentMa) > 20 ? "Strong Click (>20mA)" : "Marginal Signal"}
            </span>
          </div>
          <div className="w-full bg-parchment-300 dark:bg-ink-800 rounded-full h-3 overflow-hidden mt-2 border border-parchment-400 dark:border-ink-700">
            <div
              className="bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500 h-full transition-all duration-300"
              style={{ width: `${Math.min(100, (Number(loopCurrentMa) / 60) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Morse relay amplifier allows thousands of miles span
          </span>
        </div>
      </div>
    </div>
  );
}
