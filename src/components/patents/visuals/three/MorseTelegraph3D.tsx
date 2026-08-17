"use client";

import {
  Camera,
  Eye,
  EyeOff,
  Radio,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { soundEngine } from "@/utils/soundEngine";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

type CameraPreset = "iso" | "key_lever" | "electromagnet_relay" | "paper_tape_register" | "top";

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  voltageV: number;
  miles: number;
  wpm: number;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: "morse_1844_what_hath_god_wrought",
    name: "May 24, 1844 Historic Transmission",
    desc: "Samuel Morse transmits 'What hath God wrought' across 44 miles of single-wire telegraph line between DC and Baltimore.",
    voltageV: 24,
    miles: 44,
    wpm: 16,
  },
  {
    id: "high_speed_dispatch",
    name: "High-Speed Railroad Dispatching",
    desc: "30 words-per-minute rapid train routing telegraphy over a 12-mile local junction wire.",
    voltageV: 18,
    miles: 12,
    wpm: 30,
  },
  {
    id: "transcontinental_long_line",
    name: "Transcontinental High-Resistance Line",
    desc: "Long 120-mile trunk line requiring 48V battery potential to overcome wire resistance and drive relay armature.",
    voltageV: 48,
    miles: 120,
    wpm: 22,
  },
  {
    id: "low_voltage_demo",
    name: "Local Depot Test Circuit",
    desc: "Low-voltage 6V test line demonstrating relay spring tension calibration and armature air gap mechanics.",
    voltageV: 6,
    miles: 44,
    wpm: 10,
  },
];

export function MorseTelegraph3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Telegraph Circuit State Controls
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [lineVoltageV, setLineVoltageV] = useState<number>(24); // 6 to 48 VV
  const [lineLengthMiles, setLineLengthMiles] = useState<number>(44); // Baltimore to Washington (44 miles)
  const [keyIsDown, setKeyIsDown] = useState<boolean>(false);
  const [_wpmSpeed, setWpmSpeed] = useState<number>(20); // 5 to 35 WPM
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(true);

  // Telegraph Circuit Physics Calculations
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

  const controlsRef = useRef<any>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    switch (preset) {
      case "iso":
        camera.position.set(11, 8, 13);
        controls.target.set(0, 0, 0);
        break;
      case "key_lever":
        camera.position.set(-3.5, 2.5, 4.5);
        controls.target.set(-3.5, -0.8, 0);
        break;
      case "electromagnet_relay":
        camera.position.set(3.5, 2.0, 4.0);
        controls.target.set(3.5, -0.8, 0);
        break;
      case "paper_tape_register":
        camera.position.set(2.0, 3.5, 3.5);
        controls.target.set(1.5, 0.5, 0);
        break;
      case "top":
        camera.position.set(0, 11.5, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const applyScenario = (s: ScenarioPreset) => {
    setLineVoltageV(s.voltageV);
    setLineLengthMiles(s.miles);
    setWpmSpeed(s.wpm);
    if (isPlayingAudio) soundEngine.playMorseClick();
  };

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

    const studio = createThreeStudioScene({
      container,
      cameraPos: [11, 8, 13],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // --- PBR MATERIALS ---
    const mahoganyMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.35,
      metalness: 0.08,
    });

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.18,
      metalness: 0.92,
    });

    const copperCoilMat = new THREE.MeshStandardMaterial({
      color: 0xca8a04,
      roughness: 0.28,
      metalness: 0.85,
    });

    const ironCoreMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.4,
      metalness: 0.8,
    });

    const paperTapeMat = new THREE.MeshStandardMaterial({
      color: 0xfef9e7,
      roughness: 0.8,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });

    // --- 3D MORSE TELEGRAPH APPARATUS ---
    const telegraphGroup = new THREE.Group();
    scene.add(telegraphGroup);

    // Mahogany Baseboard
    const base = new THREE.Mesh(new THREE.BoxGeometry(12.5, 0.7, 7.5), mahoganyMat);
    base.position.y = -2.4;
    base.castShadow = true;
    base.receiveShadow = true;
    telegraphGroup.add(base);

    // Turned Bun Feet
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

    // --- SECTION 1: KEY LEVER (LEFT) ---
    const keyGroup = new THREE.Group();
    keyGroup.position.set(-3.5, -1.8, 0);

    const keyPlate = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.18, 2.2), brassMat);
    keyPlate.castShadow = true;
    keyGroup.add(keyPlate);

    [-0.9, 0.9].forEach((zPos) => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.85, 12), brassMat);
      post.position.set(0, 0.45, zPos);
      keyGroup.add(post);
    });

    const keyLeverGroup = new THREE.Group();
    keyLeverGroup.position.set(0, 0.65, 0);

    const keyLever = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.16, 0.28), brassMat);
    keyLever.position.set(-0.2, 0, 0);
    keyLever.castShadow = true;
    keyLeverGroup.add(keyLever);

    const knob = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.3, 0.35, 24),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 }),
    );
    knob.position.set(-2.1, 0.25, 0);
    knob.castShadow = true;
    keyLeverGroup.add(knob);

    keyGroup.add(keyLeverGroup);
    telegraphGroup.add(keyGroup);

    // --- SECTION 2: ELECTROMAGNET SOUNDER & REGISTER (RIGHT) ---
    const sounderGroup = new THREE.Group();
    sounderGroup.position.set(3.5, -1.8, 0);

    // Twin Horseshoe Electromagnet Coils
    [-0.65, 0.65].forEach((cz) => {
      const core = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 1.8, 16), ironCoreMat);
      core.position.set(0, 0.9, cz);
      sounderGroup.add(core);

      const coil = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 1.5, 24), copperCoilMat);
      coil.position.set(0, 0.85, cz);
      coil.castShadow = true;
      sounderGroup.add(coil);
    });

    // Sounder Armature Lever & Anvil Stop
    const armatureGroup = new THREE.Group();
    armatureGroup.position.set(0, 2.0, 0);

    const armatureBar = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.22, 0.45), ironCoreMat);
    armatureBar.castShadow = true;
    armatureGroup.add(armatureBar);

    sounderGroup.add(armatureGroup);

    // Paper Tape Register Spool & Guide Roller
    const spool = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.6, 24), paperTapeMat);
    spool.rotation.x = Math.PI / 2;
    spool.position.set(1.5, 1.4, -2.4);
    sounderGroup.add(spool);

    telegraphGroup.add(sounderGroup);

    // --- GLOWING CURRENT CIRCUIT ELECTRONS ---
    const electronCount = 50;
    const electronGeo = new THREE.BufferGeometry();
    const electronPos = new Float32Array(electronCount * 3);
    const glowTex = createGlowPointTexture();

    for (let i = 0; i < electronCount; i++) {
      const idx = i * 3;
      electronPos[idx] = -3.5 + (i / electronCount) * 7.0;
      electronPos[idx + 1] = -1.9;
      electronPos[idx + 2] = 0;
    }
    electronGeo.setAttribute("position", new THREE.BufferAttribute(electronPos, 3));

    const electronPoints = new THREE.Points(
      electronGeo,
      new THREE.PointsMaterial({
        size: 0.24,
        map: glowTex,
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
      }),
    );
    telegraphGroup.add(electronPoints);

    // --- RENDER LOOP & REAL-TIME ARMATURE DYNAMICS ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = live.current;

      if (p.keyIsDown) {
        keyLeverGroup.rotation.z = 0.06;
        armatureGroup.position.y = 1.85; // Pulled down onto pole faces
        spool.rotation.z += 0.03; // Spool tape advances
      } else {
        keyLeverGroup.rotation.z = -0.02;
        armatureGroup.position.y = 2.05; // Released by antagonist spring
      }

      if (p.keyIsDown) {
        electronPoints.visible = true;
        const ePos = electronPos;
        const speed = (Number(p.loopCurrentMa) / 30) * 15.0 * delta;
        for (let i = 0; i < electronCount; i++) {
          const idx = i * 3;
          ePos[idx] += speed;
          if (ePos[idx] > 3.5) {
            ePos[idx] = -3.5;
          }
        }
        electronGeo.attributes.position.needsUpdate = true;
      } else {
        electronPoints.visible = false;
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
                Telegraph Circuit Telemetry
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 sm:gap-y-1 mt-1 text-[10px] sm:text-xs font-sans">
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Current:</span>{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {keyIsDown ? `${loopCurrentMa} mA` : "0.0 mA (Open)"}
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Resistance:</span>{" "}
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {totalResistanceOhms} Ω ({lineResistanceOhms} Ω line)
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Magnetic Pull:</span>{" "}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {keyIsDown ? `${magneticHoldForceN} N` : "0.00 N"}
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Line Distance:</span>{" "}
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {lineLengthMiles} Mi ({lineVoltageV}V)
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 items-center gap-2 max-w-full">
              <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />
              <span className="truncate">Samuel F. B. Morse (US 1,647) — Telegraph (1840)</span>
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
            title={isPlayingAudio ? "Mute Telegraph Sounder Click" : "Enable Sounder Click"}
          >
            {isPlayingAudio ? (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
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
                ["key_lever", "Camelback Key"],
                ["electromagnet_relay", "Electromagnet"],
                ["paper_tape_register", "Register Tape"],
                ["top", "Overhead"],
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

      {/* Interactive Controls & Scenario Bar */}
      <div className="p-4 sm:p-5 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 space-y-4">
        {/* Scenario Presets */}
        <div className="space-y-1.5">
          <div className="text-xs font-sans font-bold text-ink-700 dark:text-ink-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Historical Telegraph Presets:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => applyScenario(s)}
                className="p-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 bg-white/70 dark:bg-ink-950/70 hover:bg-parchment-50 dark:hover:bg-ink-800 text-left transition-colors group"
              >
                <div className="text-xs font-serif font-bold text-ink-900 dark:text-parchment-100 group-hover:text-amber-700 dark:group-hover:text-amber-400">
                  {s.name}
                </div>
                <div className="text-[10px] font-sans text-ink-500 dark:text-ink-400 line-clamp-2 mt-0.5">
                  {s.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sliders Grid & Direct Key Press Trigger */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 items-center">
          {/* Direct Key Press */}
          <div className="space-y-1.5">
            <button
              type="button"
              onMouseDown={handleKeyDown}
              onMouseUp={handleKeyUp}
              onTouchStart={handleKeyDown}
              onTouchEnd={handleKeyUp}
              className={`w-full py-3.5 px-4 rounded-xl font-sans font-bold text-sm transition-colors shadow-sm flex items-center justify-center gap-2 select-none ${
                keyIsDown
                  ? "bg-amber-600 text-white scale-[0.98] shadow-inner"
                  : "bg-amber-700 hover:bg-amber-800 text-white shadow-md active:scale-95"
              }`}
            >
              <Zap className="w-4 h-4" />
              {keyIsDown ? "CIRCUIT CLOSED (TAP)" : "PRESS & HOLD KEY"}
            </button>
          </div>

          {/* Line Length */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="font-semibold text-ink-800 dark:text-parchment-200">
                Line Distance:
              </span>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                {lineLengthMiles} Miles
              </span>
            </div>
            <input
              type="range"
              aria-label="Line Distance"
              min="5"
              max="250"
              step="5"
              value={lineLengthMiles}
              onChange={(e) => setLineLengthMiles(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
              12.5 Ω/mile galvanised iron wire
            </span>
          </div>

          {/* Line Voltage */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="font-semibold text-ink-800 dark:text-parchment-200">
                Battery Potential:
              </span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                {lineVoltageV} Volts DC
              </span>
            </div>
            <input
              type="range"
              aria-label="Battery Potential"
              min="6"
              max="48"
              step="2"
              value={lineVoltageV}
              onChange={(e) => setLineVoltageV(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
              Gravity Daniell battery stack
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
