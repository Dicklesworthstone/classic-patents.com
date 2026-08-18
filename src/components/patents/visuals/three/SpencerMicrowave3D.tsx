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
import { HudText } from "@/components/ui/LatexRenderer";
import { FrankenSimEngine } from "@/physics/engine";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { createLcg } from "@/utils/lcg";
import { soundEngine } from "@/utils/soundEngine";
import {
  createGlowPointTexture,
  createThreeStudioScene,
  type StudioContext,
} from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

const lcg = createLcg(1661);

type CameraPreset = "iso" | "cavity_resonator" | "electron_spokes" | "waveguide_launch" | "top";

export function SpencerMicrowave3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Magnetron & Cavity Resonator State
  const { params } = usePatentPhysics("us-2495429-spencer-microwave");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const anodeVoltageKv = (params.anodeVoltage ?? 2200) / 1000;
  const magneticFieldGauss = params.magneticFieldGauss ?? 1450;
  const rfPowerWatts = params.rfPowerSetting ?? 800;
  const [showSpokeWheel, _setShowSpokeWheel] = useState<boolean>(true);
  const [showWaterDipoles, _setShowWaterDipoles] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // RF Cavity Physics Calculations (FrankenSim Hull Cutoff & Microwave Emission)
  const rfPhysics = FrankenSimEngine.stepSpencerMicrowave(
    anodeVoltageKv,
    magneticFieldGauss,
    rfPowerWatts,
  );

  useFrankenSimPhysics("us-2495429-spencer-microwave", {
    domain: "electromagnetics_flux",
    timestampMs: Date.now(),
    timeStepDt: 0.016,
    refusal: { isRefused: false },
    em: {
      frequencyHz: rfPhysics.microwaveFreqMhz * 1e6,
      magneticFluxDensityTesla: magneticFieldGauss * 1e-4,
      electricFieldVpm: (anodeVoltageKv * 1000) / 0.01,
      phaseAngleRad: 0,
      inductanceHenry: 0,
      capacitanceFarad: 0,
      currentAmperes: 0,
      voltageVolts: anodeVoltageKv * 1000,
      powerFactor: 0,
      efficiencyPct: 0,
      synchronousRpm: 0,
      slipFraction: 0,
      rotorRpm: 0,
      shaftPowerWatts: 0,
      electricalInputWatts: 0,
    },
  });
  const hullCutoffGauss = rfPhysics.hullCutoffGauss;
  const isOscillating = rfPhysics.isOscillating;
  const waterDielectricLossDensity = rfPhysics.dielectricLossWattsPerDm3.toString();

  const live = useLiveSimParams({
    anodeVoltageKv,
    magneticFieldGauss,
    showSpokeWheel,
    showWaterDipoles,
    isOscillating,
    microwaveFreqMhz: rfPhysics.microwaveFreqMhz,
    dielectricLoss: rfPhysics.dielectricLossWattsPerDm3,
  });

  const controlsRef = useRef<StudioContext["controls"] | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    switch (preset) {
      case "iso":
        camera.position.set(12, 10, 15);
        controls.target.set(0, 0, 0);
        break;
      case "cavity_resonator":
        camera.position.set(0, 3.2, 5.5);
        controls.target.set(0, 0, 0);
        break;
      case "electron_spokes":
        camera.position.set(0, 7.5, 0.1);
        controls.target.set(0, 0, 0);
        break;
      case "waveguide_launch":
        camera.position.set(4.5, 2.5, 3.5);
        controls.target.set(3.0, 0, 0);
        break;
      case "top":
        camera.position.set(0, 13.0, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  // Audio Magnetron Hum
  useEffect(() => {
    if (isPlayingAudio && isOscillating) {
      soundEngine.playContinuousTone(120, "sawtooth", 0.035);
    } else {
      soundEngine.stopContinuousTone();
    }
    return () => {
      soundEngine.stopContinuousTone();
    };
  }, [isPlayingAudio, isOscillating]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [12, 10, 15],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // --- PBR MATERIALS ---
    const copperAnodeMat = new THREE.MeshStandardMaterial({
      color: 0xca8a04,
      roughness: 0.22,
      metalness: 0.88,
    });

    const cathodeMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.4,
      metalness: 0.5,
      emissive: 0xef4444,
      emissiveIntensity: 0.8,
    });

    const alnicoMagnetMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.35,
      metalness: 0.8,
    });

    // --- 3D CAVITY MAGNETRON & MICROWAVE ASSEMBLY ---
    const magnetronGroup = new THREE.Group();
    scene.add(magnetronGroup);

    // Anode Block Shell
    const anodeOuter = new THREE.Mesh(
      new THREE.CylinderGeometry(4.3, 4.3, 3.4, 48),
      copperAnodeMat,
    );
    anodeOuter.castShadow = true;
    anodeOuter.receiveShadow = true;
    magnetronGroup.add(anodeOuter);

    // Center Interaction Bore
    const centerBore = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, 3.42, 36),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 }),
    );
    magnetronGroup.add(centerBore);

    // 8 Radial Resonant Cavities
    const numCavities = 8;
    for (let i = 0; i < numCavities; i++) {
      const angle = (i * 2 * Math.PI) / numCavities;
      const hole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.62, 0.62, 3.42, 24),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 }),
      );
      hole.position.set(Math.cos(angle) * 2.8, 0, Math.sin(angle) * 2.8);
      magnetronGroup.add(hole);

      const slot = new THREE.Mesh(
        new THREE.BoxGeometry(1.3, 3.42, 0.18),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 }),
      );
      slot.position.set(Math.cos(angle) * 2.1, 0, Math.sin(angle) * 2.1);
      slot.rotation.y = -angle;
      magnetronGroup.add(slot);
    }

    // Pi-Mode Strapping Rings
    [-1.6, 1.6].forEach((yPos) => {
      const innerRing = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.05, 8, 36), copperAnodeMat);
      innerRing.rotation.x = Math.PI / 2;
      innerRing.position.y = yPos;
      magnetronGroup.add(innerRing);

      const outerRing = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.05, 8, 36), copperAnodeMat);
      outerRing.rotation.x = Math.PI / 2;
      outerRing.position.y = yPos;
      magnetronGroup.add(outerRing);
    });

    // Central Thermionic Cathode
    const cathode = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 4.2, 24), cathodeMat);
    cathode.castShadow = true;
    magnetronGroup.add(cathode);

    [-2.1, 2.1].forEach((yEnd) => {
      const endHat = new THREE.Mesh(
        new THREE.CylinderGeometry(0.65, 0.65, 0.12, 24),
        new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9 }),
      );
      endHat.position.y = yEnd;
      magnetronGroup.add(endHat);
    });

    // Alnico Permanent Magnet Shoes
    [-3.2, 3.2].forEach((yMag) => {
      const poleShoe = new THREE.Mesh(
        new THREE.CylinderGeometry(3.5, 4.2, 1.8, 36),
        alnicoMagnetMat,
      );
      poleShoe.position.y = yMag;
      magnetronGroup.add(poleShoe);
    });

    // --- ROTATING ELECTRON SPOKE WHEEL PARTICLES ---
    const spokeCount = 120;
    const spokeGeo = new THREE.BufferGeometry();
    const spokePos = new Float32Array(spokeCount * 3);
    const glowTex = createGlowPointTexture();

    for (let i = 0; i < spokeCount; i++) {
      const idx = i * 3;
      const spokeIndex = i % 4;
      const baseAngle = (spokeIndex * Math.PI) / 2;
      const r = 0.5 + lcg() * 0.9;
      const angle = baseAngle + (lcg() - 0.5) * 0.3;
      spokePos[idx] = Math.cos(angle) * r;
      spokePos[idx + 1] = (lcg() - 0.5) * 1.5;
      spokePos[idx + 2] = Math.sin(angle) * r;
    }
    spokeGeo.setAttribute("position", new THREE.BufferAttribute(spokePos, 3));

    const spokePoints = new THREE.Points(
      spokeGeo,
      new THREE.PointsMaterial({
        size: 0.26,
        map: glowTex,
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    magnetronGroup.add(spokePoints);

    // --- RENDER LOOP & REAL-TIME SPOKE WHEEL ROTATION ---
    let reqId: number;
    let renderedSteps = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      renderedSteps += 1;
      const delta = 1 / 60;
      const p = live.current;

      if (p.isOscillating) {
        spokePoints.visible = p.showSpokeWheel;
        spokePoints.rotation.y += delta * (p.microwaveFreqMhz / 2450) * 4.5;
        (spokePoints.material as THREE.PointsMaterial).opacity = Math.min(
          0.95,
          0.25 + (p.dielectricLoss / 2000) * 0.7,
        );
      } else {
        spokePoints.visible = false;
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
                Cavity Magnetron &amp; Microwave Telemetry
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 sm:gap-y-1 mt-1 text-[10px] sm:text-xs font-sans">
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Freq:</span>{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {rfPhysics.microwaveFreqMhz.toLocaleString()} MHz (λ = {rfPhysics.wavelengthCm}{" "}
                    cm){isOscillating ? "" : " — below Hull cutoff"}
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">RF Output:</span>{" "}
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {rfPowerWatts} W CW
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">
                    <HudText text="Hull Cutoff ($B_c$):" />
                  </span>{" "}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {hullCutoffGauss} G ({magneticFieldGauss} G Active)
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Heating:</span>{" "}
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {waterDielectricLossDensity} W/dm³
                    {rfPhysics.timeToPopS > 0 ? ` · ${rfPhysics.timeToPopS}s to 100 °C` : ""}
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 items-center gap-2 max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />
              <span className="truncate">
                Percy L. Spencer (US 2,495,429) — Microwave Heating (1945)
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
            title={isPlayingAudio ? "Mute Magnetron Hum" : "Enable 120Hz Magnetron Hum"}
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
                ["cavity_resonator", "Cavity"],
                ["electron_spokes", "Spokes"],
                ["waveguide_launch", "Waveguide"],
                ["top", "Interaction Space"],
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
