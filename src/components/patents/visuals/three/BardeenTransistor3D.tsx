"use client";

import { Activity, Camera, Cpu, RotateCcw, Sparkles, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { soundEngine } from "@/utils/soundEngine";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

type CameraPreset = "iso" | "apex" | "band" | "spring" | "base";

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  gap: number;
  emitterMa: number;
  collectorV: number;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: "bell_1947",
    name: "Dec 16, 1947 Historic First Gain",
    desc: "Brattain & Bardeen's historic Bell Labs discovery with 50µm razor-cut gap in gold foil on Germanium.",
    gap: 50,
    emitterMa: 2.5,
    collectorV: -40,
  },
  {
    id: "high_gain",
    name: "Sub-Diffusion High Gain",
    desc: "20µm microscopic gap well within hole diffusion length $L_p$, achieving >22 dB power amplification.",
    gap: 20,
    emitterMa: 3.5,
    collectorV: -60,
  },
  {
    id: "diffusion_cutoff",
    name: "Hole Diffusion Cutoff",
    desc: "140µm gap exceeds minority carrier diffusion length $L_p = 80$ µm, dropping α below threshold.",
    gap: 140,
    emitterMa: 2.5,
    collectorV: -40,
  },
  {
    id: "high_power",
    name: "Heavy Injection Current",
    desc: "High emitter forward bias injecting dense stream of minority carrier holes into the inversion layer.",
    gap: 35,
    emitterMa: 7.0,
    collectorV: -75,
  },
];

export function BardeenTransistor3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Semiconductor Point-Contact State Controls
  const [emitterCurrentMa, setEmitterCurrentMa] = useState<number>(2.5);
  const [collectorVoltageV, setCollectorVoltageV] = useState<number>(-40);
  const [pointContactGapMicrons, setPointContactGapMicrons] = useState<number>(50);
  const [showHoleDrift, setShowHoleDrift] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  const [isToneActive, setIsToneActive] = useState<boolean>(false);

  // Transistor Physics Calculations
  const holeDiffusionLength = 80;
  const alphaCurrentGain = (1.8 * Math.exp(-pointContactGapMicrons / holeDiffusionLength)).toFixed(
    2,
  );
  const collectorCurrentMa = (Number(alphaCurrentGain) * emitterCurrentMa).toFixed(2);
  const voltageGain = Math.round(Math.abs(collectorVoltageV) / 0.6);
  const powerGainDb = Math.max(
    0,
    Math.round(
      10 *
        Math.log10(
          (Math.abs(collectorVoltageV) * Number(collectorCurrentMa)) / (0.6 * emitterCurrentMa),
        ),
    ),
  );

  const live = useLiveSimParams({
    emitterCurrentMa,
    pointContactGapMicrons,
    collectorVoltageV,
    showHoleDrift,
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
        camera.position.set(10, 8, 12);
        controls.target.set(0, 0.5, 0);
        break;
      case "apex":
        camera.position.set(0, 1.2, 3.2);
        controls.target.set(0, 0.4, 0);
        break;
      case "band":
        camera.position.set(0, 7.5, 0.1);
        controls.target.set(0, 0, 0);
        break;
      case "spring":
        camera.position.set(4, 5, 6);
        controls.target.set(0, 1.5, 0);
        break;
      case "base":
        camera.position.set(-5, 2, 4);
        controls.target.set(-2, 0, 1);
        break;
    }
    controls.update();
  };

  const applyScenario = (s: ScenarioPreset) => {
    setPointContactGapMicrons(s.gap);
    setEmitterCurrentMa(s.emitterMa);
    setCollectorVoltageV(s.collectorV);
    if (!isAudioMuted) {
      soundEngine.playPianoKeyHop(Math.round(s.gap * 4));
    }
  };

  const toggleSound = () => {
    const isMuted = soundEngine.toggleMute();
    setIsAudioMuted(isMuted);
  };

  const toggleAudioTone = () => {
    if (isToneActive) {
      soundEngine.stopContinuousTone();
      setIsToneActive(false);
    } else {
      // 1000 Hz test signal amplified through transistor
      soundEngine.playContinuousTone(1000, "sine", 0.12 * Math.min(1.0, powerGainDb / 20));
      setIsToneActive(true);
      setIsAudioMuted(false);
    }
  };

  useEffect(() => {
    return () => {
      soundEngine.stopContinuousTone();
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [10, 8, 12],
      targetPos: [0, 0.5, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    const germaniumCrystalMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.15,
      metalness: 0.85,
    });

    const goldFoilMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.1,
      metalness: 0.98,
    });

    const polystyreneWedgeMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.88,
      opacity: 0.9,
      transparent: true,
      roughness: 0.1,
      ior: 1.5,
    });

    const phosphorBronzeMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.2,
      metalness: 0.92,
    });

    const transistorGroup = new THREE.Group();
    scene.add(transistorGroup);

    const geBlock = new THREE.Mesh(new THREE.BoxGeometry(6.2, 1.1, 5.2), germaniumCrystalMat);
    geBlock.position.y = -0.55;
    geBlock.castShadow = true;
    transistorGroup.add(geBlock);

    const wedgeShape = new THREE.Shape();
    wedgeShape.moveTo(-0.9, 2.2);
    wedgeShape.lineTo(0.9, 2.2);
    wedgeShape.lineTo(0, 0.05);
    wedgeShape.closePath();

    const wedgeGeo = new THREE.ExtrudeGeometry(wedgeShape, { depth: 0.8, bevelEnabled: false });
    wedgeGeo.center();
    const wedge = new THREE.Mesh(wedgeGeo, polystyreneWedgeMat);
    wedge.position.set(0, 1.25, 0);
    transistorGroup.add(wedge);

    const springGroup = new THREE.Group();
    springGroup.position.set(0, 2.6, 0);
    const springArm = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.06, 2.6), phosphorBronzeMat);
    springGroup.add(springArm);
    const adjustmentScrew = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.8, 16),
      phosphorBronzeMat,
    );
    adjustmentScrew.position.set(0, 0.35, 1.1);
    springGroup.add(adjustmentScrew);
    transistorGroup.add(springGroup);

    const emitterGroup = new THREE.Group();
    const collectorGroup = new THREE.Group();

    const emitterFoil = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.8, 0.75), goldFoilMat);
    emitterFoil.rotation.z = -0.42;
    emitterFoil.position.set(-0.55, 1.1, 0);
    emitterGroup.add(emitterFoil);

    const emitterWire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 2.2, 8),
      phosphorBronzeMat,
    );
    emitterWire.rotation.z = -0.6;
    emitterWire.position.set(-1.4, 2.0, 0);
    emitterGroup.add(emitterWire);
    transistorGroup.add(emitterGroup);

    const collectorFoil = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.8, 0.75), goldFoilMat);
    collectorFoil.rotation.z = 0.42;
    collectorFoil.position.set(0.55, 1.1, 0);
    collectorGroup.add(collectorFoil);

    const collectorWire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 2.2, 8),
      phosphorBronzeMat,
    );
    collectorWire.rotation.z = 0.6;
    collectorWire.position.set(1.4, 2.0, 0);
    collectorGroup.add(collectorWire);
    transistorGroup.add(collectorGroup);

    const holeCount = 120;
    const holeGeo = new THREE.BufferGeometry();
    const holePos = new Float32Array(holeCount * 3);
    for (let i = 0; i < holeCount; i++) {
      holePos[i * 3] = -0.6 + Math.random() * 1.2;
      holePos[i * 3 + 1] = 0.05 - Math.random() * 0.35;
      holePos[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }
    holeGeo.setAttribute("position", new THREE.BufferAttribute(holePos, 3));
    const glowTex = createGlowPointTexture();
    const holePoints = new THREE.Points(
      holeGeo,
      new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 0.22,
        map: glowTex,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    transistorGroup.add(holePoints);

    let reqId: number;
    const clock = new THREE.Clock();
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = live.current;
      const currentGapUnits = p.pointContactGapMicrons * 0.012;
      emitterGroup.position.x = -currentGapUnits / 2;
      collectorGroup.position.x = currentGapUnits / 2;
      const driftSpeed =
        (p.emitterCurrentMa / 2.5) * (Math.abs(p.collectorVoltageV) / 40) * 3.5 * delta;
      for (let i = 0; i < holeCount; i++) {
        const idx = i * 3;
        holePos[idx] += driftSpeed;
        if (holePos[idx] > currentGapUnits / 2 + 0.1) {
          holePos[idx] = -currentGapUnits / 2 - 0.05;
        }
      }
      holeGeo.attributes.position.needsUpdate = true;
      holePoints.visible = p.showHoleDrift;
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
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none max-w-[calc(100%-8rem)] sm:max-w-md">
          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
            <div className="text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              Point-Contact Transistor Telemetry
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs font-sans">
              <div>
                <span className="text-ink-600 dark:text-ink-400">Current Gain (α):</span>{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {alphaCurrentGain}
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Collector Current:</span>{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {collectorCurrentMa} mA
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Power Gain:</span>{" "}
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  +{powerGainDb} dB ({voltageGain}×)
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 flex items-center gap-2 max-w-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />
            <span className="truncate">
              John Bardeen &amp; Walter Brattain (US 2,524,035) — Point-Contact Transistor
            </span>
          </div>
        </div>

        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            type="button"
            onClick={toggleAudioTone}
            className={`p-2.5 rounded-xl backdrop-blur-md border transition-all shadow-sm ${isToneActive ? "bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-400 animate-pulse" : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"}`}
            title="Play 1 kHz Test Tone"
          >
            <Activity className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={toggleSound}
            className="p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 transition-all shadow-sm"
          >
            {isAudioMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-600" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowCalloutPins(!showCalloutPins)}
            className={`p-2.5 rounded-xl backdrop-blur-md border transition-all shadow-sm ${showCalloutPins ? "bg-amber-600 text-white border-amber-700 shadow-md" : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300"}`}
            title="Toggle Pins"
          >
            <Zap className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 transition-all shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-xs">
          <span className="px-2 py-1 text-ink-500 font-sans flex items-center gap-1">
            <Camera className="w-3.5 h-3.5" /> View:
          </span>
          {(["iso", "apex", "band", "spring", "base"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => applyCameraPreset(id)}
              className={`px-2.5 py-1 rounded-lg font-sans transition-all ${activeCamera === id ? "bg-amber-700 text-white font-semibold" : "text-ink-700 dark:text-parchment-300 hover:bg-parchment-200"}`}
            >
              {id.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-5 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 space-y-4">
        <div className="space-y-1.5">
          <div className="text-xs font-sans font-bold text-ink-700 dark:text-ink-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Operating Scenarios:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => applyScenario(s)}
                className="p-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 bg-white/70 dark:bg-ink-950/70 hover:bg-parchment-50 dark:hover:bg-ink-800 text-left transition-all"
              >
                <div className="text-xs font-bold text-ink-900 dark:text-parchment-100">
                  {s.name}
                </div>
                <div className="text-[10px] text-ink-500 line-clamp-2">{s.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-sans font-semibold text-ink-800 dark:text-parchment-200">
              <span>Emitter Current:</span>
              <span className="text-amber-700 font-bold">{emitterCurrentMa.toFixed(1)} mA</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="8.0"
              step="0.5"
              value={emitterCurrentMa}
              onChange={(e) => setEmitterCurrentMa(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-sans font-semibold text-ink-800 dark:text-parchment-200">
              <span>Collector Bias:</span>
              <span className="text-blue-600 font-bold">{collectorVoltageV} V</span>
            </div>
            <input
              type="range"
              min="-80"
              max="-10"
              step="5"
              value={collectorVoltageV}
              onChange={(e) => setCollectorVoltageV(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-sans font-semibold text-ink-800 dark:text-parchment-200">
              <span>Whisker Gap:</span>
              <span className="text-emerald-600 font-bold">{pointContactGapMicrons} µm</span>
            </div>
            <input
              type="range"
              min="15"
              max="150"
              step="5"
              value={pointContactGapMicrons}
              onChange={(e) => setPointContactGapMicrons(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 border-t border-parchment-200 dark:border-ink-800 text-xs font-sans">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showHoleDrift}
              onChange={(e) => setShowHoleDrift(e.target.checked)}
              className="rounded accent-amber-600"
            />
            <span>Render Minority Carrier Hole Drift</span>
          </label>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-ink-600 dark:text-ink-400">Power Amplification:</span>
            <div className="w-28 sm:w-36 bg-parchment-300 dark:bg-ink-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full transition-all"
                style={{ width: `${Math.min(100, (powerGainDb / 25) * 100)}%` }}
              />
            </div>
            <span className="font-bold text-ink-800 dark:text-parchment-200">
              +{powerGainDb} dB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
