"use client";

import {
  Camera,
  Eye,
  EyeOff,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { blackbodyRgb } from "@/physics/blackbody";
import { stepEdisonBulb } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { createLcg } from "@/utils/lcg";
import { soundEngine } from "@/utils/soundEngine";
import {
  createGlowPointTexture,
  createThreeStudioScene,
  type StudioContext,
} from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

const lcg = createLcg(999);

type CameraPreset = "iso" | "filament_horseshoe" | "screw_base" | "exhaust_tip" | "top";

export function EdisonBulb3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Electrical & Thermal Simulation State
  const { params } = usePatentPhysics("us-223898-edison-lightbulb");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const appliedVoltage = params.voltage ?? 110;
  const vacuumTorr = params.vacuumTorr ?? 1e-6;
  const [_filamentMaterial, _setFilamentMaterial] = useState<"carbonized-bamboo" | "platinum-wire">(
    "carbonized-bamboo",
  );
  const [showGasMolecules, _setShowGasMolecules] = useState<boolean>(true);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const bulb = stepEdisonBulb({
    voltage: appliedVoltage,
    filamentLength: params.filamentLength ?? 22,
  });
  const powerWatts = bulb.radiantWatts;
  const filamentTempKelvin = bulb.filamentTempK;
  const currentAmps = bulb.currentAmps;
  const estimatedLifespanHours = vacuumTorr < 1e-4 ? bulb.designLifeHours : 0;

  const live = useLiveSimParams({
    appliedVoltage,
    filamentTempKelvin,
    showGasMolecules,
    vacuumTorr,
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
        camera.position.set(11, 7, 14);
        controls.target.set(0, 0, 0);
        break;
      case "filament_horseshoe":
        camera.position.set(0, 2.5, 4.2);
        controls.target.set(0, 1.2, 0);
        break;
      case "screw_base":
        camera.position.set(0, -2.2, 3.8);
        controls.target.set(0, -2.8, 0);
        break;
      case "exhaust_tip":
        camera.position.set(0, 4.8, 2.6);
        controls.target.set(0, 3.8, 0);
        break;
      case "top":
        camera.position.set(0, 10.5, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  // Web Audio Filament Hum
  useEffect(() => {
    if (isPlayingAudio && appliedVoltage > 10) {
      soundEngine.playContinuousTone(60 + appliedVoltage * 1.5, "sine", 0.04);
    } else {
      soundEngine.stopContinuousTone();
    }
    return () => {
      soundEngine.stopContinuousTone();
    };
  }, [isPlayingAudio, appliedVoltage]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [11, 7, 14],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Dynamic Bulb Point Light
    const bulbLight = new THREE.PointLight(0xffaa33, 0, 30);
    bulbLight.position.set(0, 1.0, 0);
    bulbLight.castShadow = true;
    scene.add(bulbLight);

    // --- PBR MATERIALS ---
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.96,
      opacity: 1,
      transparent: true,
      roughness: 0.03,
      ior: 1.54,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });

    const brassScrewBaseMaterial = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.92,
      roughness: 0.18,
    });

    const platinumLeadMaterial = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.95,
      roughness: 0.1,
    });

    const filamentMaterialMesh = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      roughness: 0.7,
      metalness: 0.3,
      emissive: 0xff6600,
      emissiveIntensity: 0.0,
    });

    // --- 3D BULB ASSEMBLY ---
    const bulbGroup = new THREE.Group();
    scene.add(bulbGroup);

    // Continuous Blown Glass Pear-Shaped Envelope with Exhaust Seal Pip
    const lathePoints: THREE.Vector2[] = [];
    lathePoints.push(new THREE.Vector2(0.001, 4.35)); // Top pointed exhaust seal pip
    lathePoints.push(new THREE.Vector2(0.08, 4.18));
    lathePoints.push(new THREE.Vector2(0.18, 3.92));
    lathePoints.push(new THREE.Vector2(0.65, 3.55));
    lathePoints.push(new THREE.Vector2(1.55, 3.05));
    lathePoints.push(new THREE.Vector2(2.45, 2.2));
    lathePoints.push(new THREE.Vector2(2.85, 1.15));
    lathePoints.push(new THREE.Vector2(2.72, 0.15));
    lathePoints.push(new THREE.Vector2(2.2, -0.75));
    lathePoints.push(new THREE.Vector2(1.6, -1.45));
    lathePoints.push(new THREE.Vector2(1.25, -2.05));
    lathePoints.push(new THREE.Vector2(1.22, -2.4));

    const glassGeo = new THREE.LatheGeometry(lathePoints, 64);
    const glassMesh = new THREE.Mesh(glassGeo, glassMaterial);
    glassMesh.castShadow = true;
    bulbGroup.add(glassMesh);

    // Glass Exhaust Seal Tip Pip (where Sprengel pump sealed off the vacuum)
    const exhaustPip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.08, 0.35, 16),
      glassMaterial,
    );
    exhaustPip.position.y = 4.25;
    bulbGroup.add(exhaustPip);

    // Brass Screw Base with Precision Rolled Thread Ridges
    const baseCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(1.22, 1.22, 1.4, 48),
      brassScrewBaseMaterial,
    );
    baseCylinder.position.y = -2.9;
    baseCylinder.castShadow = true;
    bulbGroup.add(baseCylinder);

    for (let t = 0; t < 5; t++) {
      const threadRing = new THREE.Mesh(
        new THREE.TorusGeometry(1.24, 0.09, 16, 48),
        brassScrewBaseMaterial,
      );
      threadRing.rotation.x = Math.PI / 2 + 0.08;
      threadRing.position.y = -2.3 - t * 0.28;
      bulbGroup.add(threadRing);
    }

    // Plaster-of-Paris Ceramic Insulator Ring
    const plasterInsulator = new THREE.Mesh(
      new THREE.CylinderGeometry(1.15, 1.15, 0.2, 32),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.9 }),
    );
    plasterInsulator.position.y = -3.55;
    bulbGroup.add(plasterInsulator);

    const centerContactPlate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.55, 0.15, 24),
      brassScrewBaseMaterial,
    );
    centerContactPlate.position.y = -3.72;
    bulbGroup.add(centerContactPlate);

    // Turned Mahogany/Walnut Archival Display Stand
    const woodMount = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 2.8, 0.8, 48),
      new THREE.MeshStandardMaterial({ color: 0x5c2b0c, roughness: 0.35, metalness: 0.05 }),
    );
    woodMount.position.y = -4.2;
    woodMount.receiveShadow = true;
    bulbGroup.add(woodMount);

    // Central Flanged Lead-Glass Stem Tube
    const stemPoints: THREE.Vector2[] = [];
    stemPoints.push(new THREE.Vector2(0.95, -2.4));
    stemPoints.push(new THREE.Vector2(0.38, -1.8));
    stemPoints.push(new THREE.Vector2(0.32, 0.2));
    stemPoints.push(new THREE.Vector2(0.38, 0.45));
    const stemGeo = new THREE.LatheGeometry(stemPoints, 32);
    const glassStem = new THREE.Mesh(stemGeo, glassMaterial);
    bulbGroup.add(glassStem);

    // Platinum Lead-in Wires with Glass Fusion Pinch Beads
    [-0.34, 0.34].forEach((xPos) => {
      const leadWire = new THREE.Mesh(
        new THREE.CylinderGeometry(0.032, 0.032, 2.3, 16),
        platinumLeadMaterial,
      );
      leadWire.position.set(xPos, -0.6, 0);
      leadWire.castShadow = true;
      bulbGroup.add(leadWire);

      // Glass seal pinch bead (where platinum coefficient of expansion matches glass)
      const glassPinchBead = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), glassMaterial);
      glassPinchBead.position.set(xPos, -1.1, 0);
      bulbGroup.add(glassPinchBead);

      // Copper / Carbon Clamping Sleeves
      const clampNut = new THREE.Mesh(
        new THREE.CylinderGeometry(0.075, 0.075, 0.16, 16),
        platinumLeadMaterial,
      );
      clampNut.position.set(xPos, 0.48, 0);
      bulbGroup.add(clampNut);
    });

    // Carbonized Bamboo Filament Horseshoe Loop (US Patent 223,898)
    const curvePoints: THREE.Vector3[] = [];
    const filamentSegments = 48;
    for (let i = 0; i <= filamentSegments; i++) {
      const theta = (i / filamentSegments) * Math.PI;
      const x = Math.cos(theta) * 0.58;
      const y = 0.55 + Math.sin(theta) * 1.75;
      const z = Math.sin(theta * 2) * 0.04; // Authentic slight twist
      curvePoints.push(new THREE.Vector3(x, y, z));
    }
    const filamentCurve = new THREE.CatmullRomCurve3(curvePoints);
    const filamentGeo = new THREE.TubeGeometry(filamentCurve, 56, 0.035, 12, false);
    const filamentMesh = new THREE.Mesh(filamentGeo, filamentMaterialMesh);
    filamentMesh.castShadow = true;
    bulbGroup.add(filamentMesh);

    // Residual Air Gas Molecules Cloud
    const gasCount = 70;
    const gasGeo = new THREE.BufferGeometry();
    const gasPos = new Float32Array(gasCount * 3);
    const glowTex = createGlowPointTexture();

    for (let i = 0; i < gasCount; i++) {
      const idx = i * 3;
      const r = lcg() * 2.2;
      const theta = lcg() * Math.PI * 2;
      const phi = (lcg() - 0.5) * Math.PI;
      gasPos[idx] = r * Math.cos(phi) * Math.cos(theta);
      gasPos[idx + 1] = 1.0 + r * Math.sin(phi);
      gasPos[idx + 2] = r * Math.cos(phi) * Math.sin(theta);
    }
    gasGeo.setAttribute("position", new THREE.BufferAttribute(gasPos, 3));

    const gasPoints = new THREE.Points(
      gasGeo,
      new THREE.PointsMaterial({
        size: 0.22,
        map: glowTex,
        color: 0x94a3b8,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
      }),
    );
    bulbGroup.add(gasPoints);

    // --- RENDER LOOP & REAL-TIME INCANDESCENCE DYNAMICS ---
    let reqId: number;
    let renderedSteps = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      renderedSteps += 1;
      const delta = 1 / 60;
      const p = live.current;

      const incandescenceIntensity = Math.min(1.0, (p.appliedVoltage / 110) ** 2);
      const isGlowing = incandescenceIntensity > 0.05;

      if (isGlowing) {
        const glowColor = new THREE.Color(blackbodyRgb(p.filamentTempKelvin));

        filamentMaterialMesh.emissive = glowColor;
        filamentMaterialMesh.color.copy(glowColor);
        filamentMaterialMesh.emissiveIntensity = incandescenceIntensity * 3.5;

        bulbLight.color = glowColor;
        bulbLight.intensity = incandescenceIntensity * 18.0;
      } else {
        filamentMaterialMesh.emissiveIntensity = 0;
        bulbLight.intensity = 0;
      }

      if (p.showGasMolecules && p.vacuumTorr > 1e-4) {
        gasPoints.visible = true;
        const gPos = gasPos;
        const thermalJitter = (p.filamentTempKelvin / 300) * 0.4 * delta;

        for (let i = 0; i < gasCount; i++) {
          const idx = i * 3;
          gPos[idx] += (lcg() - 0.5) * thermalJitter;
          gPos[idx + 1] += (lcg() - 0.5) * thermalJitter;
          gPos[idx + 2] += (lcg() - 0.5) * thermalJitter;
        }
        gasGeo.attributes.position.needsUpdate = true;
      } else {
        gasPoints.visible = false;
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
                <Lightbulb className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 animate-pulse" />
                Incandescent Blackbody Telemetry
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 sm:gap-y-1 mt-1 text-[10px] sm:text-xs font-sans">
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Filament Temp:</span>{" "}
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {filamentTempKelvin} K ({filamentTempKelvin - 273}°C)
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Power:</span>{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {powerWatts.toFixed(1)} W ({currentAmps.toFixed(2)} A)
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Vacuum:</span>{" "}
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {vacuumTorr.toExponential(1)} Torr
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Lifespan:</span>{" "}
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {estimatedLifespanHours} h · {bulb.luminousLmPerW} lm/W
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 items-center gap-2 max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse shrink-0" />
              <span className="truncate">Thomas A. Edison (US 223,898) — Electric Lamp (1880)</span>
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
            title={isPlayingAudio ? "Mute Filament Hum" : "Enable Filament Electrical Hum"}
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
                ["filament_horseshoe", "Filament"],
                ["screw_base", "Screw Base"],
                ["exhaust_tip", "Exhaust Tip"],
                ["top", "Axis View"],
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
