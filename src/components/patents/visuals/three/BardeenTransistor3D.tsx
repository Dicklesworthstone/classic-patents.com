"use client";

import {
  Activity,
  Camera,
  Cpu,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { HudText } from "@/components/ui/LatexRenderer";
import { FrankenSimEngine } from "@/physics/engine";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "apex" | "band" | "spring" | "base";

export function BardeenTransistor3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Semiconductor Point-Contact State Controls
  const { params, updateParam } = usePatentPhysics("us-2569347-bardeen-transistor");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const emitterCurrentMa = params.emitterCurrent ?? 1.5;
  const collectorVoltageV = params.collectorBias ?? -40;
  const pointContactGapMicrons = params.pointSpacing ?? 50;
  const [showHoleDrift, setShowHoleDrift] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();
  const [isToneActive, setIsToneActive] = useState<boolean>(false);

  // Transistor Physics Calculations (FrankenSim Germanium Minority Transport)
  const semiState = FrankenSimEngine.stepBardeenTransistor(
    emitterCurrentMa,
    collectorVoltageV,
    pointContactGapMicrons,
  );

  useFrankenSimPhysics("us-2569347-bardeen-transistor", {
    domain: "semiconductor_carrier",
    timestampMs: Date.now(),
    timeStepDt: 0.016,
    refusal: { isRefused: false },
    semi: semiState,
  });
  const alphaCurrentGain = semiState.currentGainAlpha.toFixed(2);
  const collectorCurrentMa = (semiState.currentGainAlpha * emitterCurrentMa).toFixed(2);
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

  const toggleSound = () => {
    toggleEngine();
  };

  const toggleAudioTone = () => {
    if (isToneActive) {
      soundEngine.stopContinuousTone();
      setIsToneActive(false);
    } else {
      // 1000 Hz test signal amplified through transistor
      soundEngine.playContinuousTone(1000, "sine", 0.12 * Math.min(1.0, powerGainDb / 20));
      setIsToneActive(true);
      if (isAudioMuted) {
        toggleEngine();
      }
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

    const copperPlatenMat = new THREE.MeshStandardMaterial({
      color: 0xc25e1a,
      roughness: 0.25,
      metalness: 0.9,
    });

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.22,
      metalness: 0.92,
    });

    const transistorGroup = new THREE.Group();
    scene.add(transistorGroup);

    // Heavy Copper Grounding Base Platen (Ohmic base contact)
    const basePlaten = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.5, 6.8), copperPlatenMat);
    basePlaten.position.y = -1.35;
    basePlaten.receiveShadow = true;
    transistorGroup.add(basePlaten);

    // Soldered Base Terminal Lug
    const baseLug = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.4, 12), brassMat);
    baseLug.rotation.z = Math.PI / 2;
    baseLug.position.set(-3.8, -1.35, 0);
    transistorGroup.add(baseLug);

    // Etched High-Purity n-Type Germanium Crystal Slab
    const geBlock = new THREE.Mesh(new THREE.BoxGeometry(6.2, 1.1, 5.2), germaniumCrystalMat);
    geBlock.position.y = -0.55;
    geBlock.castShadow = true;
    transistorGroup.add(geBlock);

    // Triangular Polystyrene Plastic Wedge (Brattain's shaped wedge)
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

    // Phosphor-Bronze Cantilever Spring & Knurled Micrometer Pressure Screw
    const springGroup = new THREE.Group();
    springGroup.position.set(0, 2.6, 0);

    const springArm = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.08, 3.2), phosphorBronzeMat);
    springGroup.add(springArm);

    const adjustmentScrew = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 0.9, 24),
      brassMat,
    );
    adjustmentScrew.position.set(0, 0.45, 1.2);
    springGroup.add(adjustmentScrew);

    // Spring Retaining Post
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 3.6, 16), brassMat);
    post.position.set(0, -1.2, 1.2);
    springGroup.add(post);

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
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-col gap-1.5 sm:gap-2 pointer-events-none max-w-[calc(100%-8rem)] sm:max-w-md transition-opacity duration-200">
            <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md p-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
              <div className="text-[10px] sm:text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 animate-pulse" />
                Point-Contact Transistor Telemetry
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 sm:gap-y-1 mt-1 text-[10px] sm:text-xs font-sans">
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Current Gain (α):</span>{" "}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {alphaCurrentGain}
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Collector:</span>{" "}
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
            <div className="hidden sm:flex bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 items-center gap-2 max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />
              <span className="truncate">
                John Bardeen &amp; Walter Brattain (US 2,524,035) — Point-Contact Transistor
              </span>
            </div>
          </div>
        )}

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
            onClick={toggleAudioTone}
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${isToneActive ? "bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-400 animate-pulse" : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"}`}
            title="Play 1 kHz Test Tone"
          >
            <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            aria-label={isAudioMuted ? "Unmute simulation audio" : "Mute simulation audio"}
            type="button"
            onClick={toggleSound}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 transition-colors shadow-sm"
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
            className={`p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${showCalloutPins ? "bg-amber-600 text-white border-amber-700 shadow-md" : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300"}`}
            title="Toggle Pins"
          >
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-1.5rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> View:
            </span>
            {(["iso", "apex", "band", "spring", "base"] as const).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => applyCameraPreset(id)}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-sans whitespace-nowrap shrink-0 transition-colors ${activeCamera === id ? "bg-amber-700 text-white font-semibold" : "text-ink-700 dark:text-parchment-300 hover:bg-parchment-200"}`}
              >
                {id.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
