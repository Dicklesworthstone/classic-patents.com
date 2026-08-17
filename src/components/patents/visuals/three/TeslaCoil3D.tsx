"use client";

import { Camera, Eye, EyeOff, RotateCcw, Sparkles, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { HudText } from "@/components/ui/LatexRenderer";
import { FrankenSimEngine } from "@/physics/engine";
import { soundEngine } from "@/utils/soundEngine";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

type CameraPreset = "iso" | "toroid_breakout" | "primary_spiral" | "spark_gap" | "top";

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  freqKhz: number;
  gapMm: number;
  voltageKv: number;
  toploadPf: number;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: "tesla_1891_patent",
    name: "1891 Resonant Transformer (US 512,340)",
    desc: "Nikola Tesla's air-core resonant transformer: Flat spiral primary loosely coupled to tuned secondary coil.",
    freqKhz: 180,
    gapMm: 12,
    voltageKv: 15,
    toploadPf: 35,
  },
  {
    id: "colorado_springs_1899",
    name: "1899 Colorado Springs Magnifier",
    desc: "Tesla's 50-foot magnifying transmitter generating 12-million-volt 135-foot lightning arcs shaking the Pikes Peak soil.",
    freqKhz: 95,
    gapMm: 28,
    voltageKv: 30,
    toploadPf: 75,
  },
  {
    id: "wardenclyffe_tower",
    name: "1901 Wardenclyffe Wireless Tower",
    desc: "Massive 68-foot hemispherical dome topload designed for global telluric wireless power transmission through Earth's crust.",
    freqKhz: 120,
    gapMm: 22,
    voltageKv: 25,
    toploadPf: 60,
  },
  {
    id: "high_frequency_cw",
    name: "350 kHz Continuous-Wave Resonance",
    desc: "High-frequency compact coil producing smooth violet brush coronal discharge with zero magnetic saturation.",
    freqKhz: 350,
    gapMm: 8,
    voltageKv: 10,
    toploadPf: 20,
  },
];

export function TeslaCoil3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Electrical Resonant State Controls
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const [resonantFreqKhz, setResonantFreqKhz] = useState<number>(180); // 50 to 500 kHz
  const [sparkGapDistanceMm, setSparkGapDistanceMm] = useState<number>(12); // 2 to 30 mm
  const [inputVoltageKv, setInputVoltageKv] = useState<number>(15); // 5 to 30 kV
  const [_toploadCapacitancePf, setToploadCapacitancePf] = useState<number>(35); // 10 to 80 pF
  const [showLightningStreamers, _setShowLightningStreamers] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // High-Frequency Resonant Physics Calculations (FrankenSim Coupled LC Transformation)
  const coilPhysics = FrankenSimEngine.stepTeslaCoil(
    resonantFreqKhz,
    inputVoltageKv,
    sparkGapDistanceMm,
  );
  const secondaryVoltageMv = coilPhysics.secondaryPotentialMv.toFixed(2);
  const streamerLengthInches = coilPhysics.streamerLengthInches.toFixed(1);

  const live = useLiveSimParams({
    resonantFreqKhz,
    sparkGapDistanceMm,
    inputVoltageKv,
    showLightningStreamers,
    secondaryVoltageMv,
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
        camera.position.set(11, 9, 14);
        controls.target.set(0, 0, 0);
        break;
      case "toroid_breakout":
        camera.position.set(0, 4.2, 4.5);
        controls.target.set(0, 2.5, 0);
        break;
      case "primary_spiral":
        camera.position.set(0, -1.2, 5.5);
        controls.target.set(0, -2.4, 0);
        break;
      case "spark_gap":
        camera.position.set(2.8, -2.2, 3.8);
        controls.target.set(2.4, -3.2, 0);
        break;
      case "top":
        camera.position.set(0, 13.0, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const applyScenario = (s: ScenarioPreset) => {
    setResonantFreqKhz(s.freqKhz);
    setSparkGapDistanceMm(s.gapMm);
    setInputVoltageKv(s.voltageKv);
    setToploadCapacitancePf(s.toploadPf);
    if (isPlayingAudio) {
      soundEngine.playContinuousTone(s.freqKhz * 2.0, "sawtooth", 0.04);
    }
  };

  // Audio synthesis
  useEffect(() => {
    if (isPlayingAudio) {
      soundEngine.playContinuousTone(resonantFreqKhz * 2.0, "sawtooth", 0.035);
    } else {
      soundEngine.stopContinuousTone();
    }
    return () => {
      soundEngine.stopContinuousTone();
    };
  }, [isPlayingAudio, resonantFreqKhz]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [11, 9, 14],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // --- PBR MATERIALS ---
    const toroidAluminumMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.1,
      metalness: 0.95,
    });

    const secondaryCopperWireMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.3,
      metalness: 0.85,
    });

    const primaryHeavyCopperMat = new THREE.MeshStandardMaterial({
      color: 0xca8a04,
      roughness: 0.18,
      metalness: 0.9,
    });

    const baseMahoganyMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.35,
      metalness: 0.05,
    });

    const sparkGapBrassMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.12,
      metalness: 0.95,
    });

    // --- 3D TESLA COIL APPARATUS ---
    const coilGroup = new THREE.Group();
    scene.add(coilGroup);

    // Insulated Base Table
    const tableBase = new THREE.Mesh(
      new THREE.CylinderGeometry(4.2, 4.5, 0.8, 36),
      baseMahoganyMat,
    );
    tableBase.position.y = -3.8;
    tableBase.receiveShadow = true;
    coilGroup.add(tableBase);

    // Secondary Helical Resonator Tube
    const secondaryCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.85, 0.85, 5.2, 48),
      secondaryCopperWireMat,
    );
    secondaryCylinder.position.y = -0.6;
    secondaryCylinder.castShadow = true;
    coilGroup.add(secondaryCylinder);

    // Continuous Archimedean Spiral Primary Coil
    const spiralPts: THREE.Vector3[] = [];
    const numSpiralTurns = 6.0;
    const numSpiralPts = 160;
    const innerRadius = 1.3;
    const outerRadius = 3.6;

    for (let i = 0; i <= numSpiralPts; i++) {
      const t = i / numSpiralPts;
      const angle = t * numSpiralTurns * Math.PI * 2;
      const radius = innerRadius + t * (outerRadius - innerRadius);
      const y = -2.8 + t * 0.45;
      spiralPts.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius));
    }

    const spiralCurve = new THREE.CatmullRomCurve3(spiralPts);
    const spiralGeo = new THREE.TubeGeometry(spiralCurve, 140, 0.09, 8, false);
    const spiralMesh = new THREE.Mesh(spiralGeo, primaryHeavyCopperMat);
    spiralMesh.castShadow = true;
    coilGroup.add(spiralMesh);

    // 6 Radial Slotted Mahogany Comb Standoffs
    for (let s = 0; s < 6; s++) {
      const sAngle = (s * Math.PI * 2) / 6;
      const comb = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.35, 0.18), baseMahoganyMat);
      comb.position.set(Math.cos(sAngle) * 2.4, -2.8, Math.sin(sAngle) * 2.4);
      comb.rotation.y = -sAngle;
      coilGroup.add(comb);
    }

    // Spun Aluminum Toroidal Terminal Topload
    const toroidGeo = new THREE.TorusGeometry(1.65, 0.65, 24, 48);
    const toroidMesh = new THREE.Mesh(toroidGeo, toroidAluminumMat);
    toroidMesh.rotation.x = Math.PI / 2;
    toroidMesh.position.y = 2.4;
    toroidMesh.castShadow = true;
    coilGroup.add(toroidMesh);

    // Rotary Spark Gap Assembly on Baseboard
    const sparkGapBase = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.15, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 }),
    );
    sparkGapBase.position.set(2.4, -3.3, 0);
    coilGroup.add(sparkGapBase);

    [-0.5, 0.5].forEach((gx) => {
      const electrode = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), sparkGapBrassMat);
      electrode.position.set(2.4 + gx, -3.05, 0);
      coilGroup.add(electrode);
    });

    // --- REAL-TIME BRANCHING LIGHTNING STREAMER LINES ---
    const streamerCount = 6;
    const streamerLines: THREE.Line[] = [];
    const streamerGeos: THREE.BufferGeometry[] = [];

    for (let s = 0; s < streamerCount; s++) {
      const segCount = 14;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(segCount * 3);
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        linewidth: 2,
        transparent: true,
        opacity: 0.9,
      });
      const line = new THREE.Line(geo, mat);
      scene.add(line);
      streamerLines.push(line);
      streamerGeos.push(geo);
    }

    // --- GLOWING CORONAL PARTICLES ---
    const coronaCount = 80;
    const coronaGeo = new THREE.BufferGeometry();
    const coronaPos = new Float32Array(coronaCount * 3);
    const glowTex = createGlowPointTexture();

    for (let i = 0; i < coronaCount; i++) {
      const idx = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const r = 1.65 + (Math.random() - 0.5) * 0.9;
      coronaPos[idx] = Math.cos(theta) * r;
      coronaPos[idx + 1] = 2.4 + (Math.random() - 0.5) * 0.8;
      coronaPos[idx + 2] = Math.sin(theta) * r;
    }
    coronaGeo.setAttribute("position", new THREE.BufferAttribute(coronaPos, 3));

    const coronaPoints = new THREE.Points(
      coronaGeo,
      new THREE.PointsMaterial({
        size: 0.35,
        map: glowTex,
        color: 0x67e8f9,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    scene.add(coronaPoints);

    // --- RENDER LOOP & REAL-TIME LIGHTNING DYNAMICS ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const _delta = clock.getDelta();
      const p = live.current;

      if (p.showLightningStreamers) {
        coronaPoints.visible = true;

        for (let s = 0; s < streamerCount; s++) {
          const line = streamerLines[s];
          const geo = streamerGeos[s];
          if (line && geo) {
            line.visible = Math.random() > 0.15;
            const posAttr = geo.attributes.position as THREE.BufferAttribute;
            const posArr = posAttr.array as Float32Array;

            const baseAngle = (s * Math.PI * 2) / streamerCount + Math.random() * 0.2;
            const startX = Math.cos(baseAngle) * 1.65;
            const startY = 2.4;
            const startZ = Math.sin(baseAngle) * 1.65;

            const length = Number(p.secondaryVoltageMv) * 1.6;

            posArr[0] = startX;
            posArr[1] = startY;
            posArr[2] = startZ;

            for (let i = 1; i < 14; i++) {
              const t = i / 13;
              const idx = i * 3;
              const jitter = 0.35 * (1 - t * 0.3);
              posArr[idx] =
                startX + Math.cos(baseAngle) * t * length + (Math.random() - 0.5) * jitter;
              posArr[idx + 1] = startY + t * length * 0.5 + (Math.random() - 0.5) * jitter;
              posArr[idx + 2] =
                startZ + Math.sin(baseAngle) * t * length + (Math.random() - 0.5) * jitter;
            }
            posAttr.needsUpdate = true;
          }
        }
      } else {
        coronaPoints.visible = false;
        streamerLines.forEach((l) => {
          l.visible = false;
        });
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
                <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 animate-pulse" />
                Resonant Transformer Telemetry
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 sm:gap-y-1 mt-1 text-[10px] sm:text-xs font-sans">
                <div>
                  <span className="text-ink-600 dark:text-ink-400">
                    <HudText text="Freq ($f_0$):" />
                  </span>{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {resonantFreqKhz} kHz <HudText text="($k \\approx 0.12$)" />
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Output:</span>{" "}
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {secondaryVoltageMv} MV Potential
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Arc:</span>{" "}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {streamerLengthInches} In (
                    {((Number(streamerLengthInches) * 2.54) / 100).toFixed(2)} m)
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Input:</span>{" "}
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {inputVoltageKv} kV ({sparkGapDistanceMm} mm)
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 items-center gap-2 max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />
              <span className="truncate">
                Nikola Tesla (US 512,340) — Electrical Transformer (1894)
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
            title={isPlayingAudio ? "Mute Tesla Audio" : "Enable Tesla Resonant Tone"}
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
                ["toroid_breakout", "Toroid"],
                ["primary_spiral", "Spiral Primary"],
                ["spark_gap", "Rotary Gap"],
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
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Historical Tesla Coil Presets:
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
                  <HudText text={s.desc} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Resonant Frequency */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="font-semibold text-ink-800 dark:text-parchment-200">
                <HudText text="Resonant Frequency ($f_0$):" />
              </span>
              <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">
                {resonantFreqKhz} kHz
              </span>
            </div>
            <input
              type="range"
              aria-label="Resonant Frequency (f_0)"
              min="50"
              max="500"
              step="10"
              value={resonantFreqKhz}
              onChange={(e) => setResonantFreqKhz(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
              {"Tuned LC resonant frequency: 1 / (2π√LC)"}
            </span>
          </div>

          {/* Spark Gap Distance */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="font-semibold text-ink-800 dark:text-parchment-200">
                Spark Gap Distance:
              </span>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                {sparkGapDistanceMm} mm
              </span>
            </div>
            <input
              type="range"
              aria-label="Spark Gap Distance"
              min="2"
              max="30"
              step="1"
              value={sparkGapDistanceMm}
              onChange={(e) => setSparkGapDistanceMm(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
              Breakdown capacitor discharge voltage
            </span>
          </div>

          {/* Primary Voltage */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="font-semibold text-ink-800 dark:text-parchment-200">
                Primary Supply:
              </span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                {inputVoltageKv} kV AC
              </span>
            </div>
            <input
              type="range"
              aria-label="Primary Supply"
              min="5"
              max="30"
              step="1"
              value={inputVoltageKv}
              onChange={(e) => setInputVoltageKv(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
              Step-up line transformer potential
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
