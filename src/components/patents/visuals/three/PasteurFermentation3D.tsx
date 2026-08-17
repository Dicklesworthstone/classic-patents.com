"use client";

import { Activity, Camera, Eye, Sparkles, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import {
  createGlowPointTexture,
  createThreeStudioScene,
  type StudioContext,
} from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

type CameraPreset = "iso" | "gooseneck_airlock" | "cooling_coil" | "sampling_valve" | "top";

interface ScenarioPreset {
  id: string;
  name: string;
  desc: string;
  tempCelsius: number;
  pureYeast: boolean;
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: "pasteur_1873_pure_yeast",
    name: "1873 Pasteur Axenic Fermentation",
    desc: "Louis Pasteur's sterile closed-tank fermentation with cotton-filtered goose-neck air trap eliminating lactic/acetic souring (US 135,245).",
    tempCelsius: 16.5,
    pureYeast: true,
  },
  {
    id: "rapid_lager_fermentation",
    name: "Controlled Cold Lager Primary (10°C)",
    desc: "Cold-jacket cooling stabilizing bottom-fermenting Saccharomyces pastorianus for pristine crystal-clear Pilsner beer.",
    tempCelsius: 10.0,
    pureYeast: true,
  },
  {
    id: "unsterile_prior_art",
    name: "Unsealed Prior-Art Open Vat",
    desc: "Demonstrating atmospheric airborne wild bacterium contamination resulting in acetic acid spoil and vinegar conversion.",
    tempCelsius: 24.0,
    pureYeast: false,
  },
];

export function PasteurFermentation3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Biochemical Fermentation Parameters
  const { params, updateParam } = usePatentPhysics("us-135245-pasteur-fermentation");
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
  const fermentationTempC = params.tempCelsius ?? 16.5;
  const isPureYeast = params.pureYeast ?? true;
  const alcoholAbvPct = (5.2 * (fermentationTempC / 16.5)).toFixed(1);
  const co2PressureBar = (1.8 * (fermentationTempC / 16.5)).toFixed(2);
  const [showBubbles, setShowBubbles] = useState<boolean>(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound: toggleEngine } = usePatentAudio();

  const live = useLiveSimParams({
    fermentationTempC,
    isPureYeast,
    showBubbles,
    isAudioMuted,
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
        camera.position.set(9.0, 7.0, 10.5);
        controls.target.set(0, 0, 0);
        break;
      case "gooseneck_airlock":
        camera.position.set(0, 4.5, 3.5);
        controls.target.set(0, 3.0, 0);
        break;
      case "cooling_coil":
        camera.position.set(2.8, 0, 3.5);
        controls.target.set(0, -0.5, 0);
        break;
      case "sampling_valve":
        camera.position.set(0, -0.8, 3.8);
        controls.target.set(0, -1.2, 1.2);
        break;
      case "top":
        camera.position.set(0, 11.5, 0.1);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const applyScenario = (s: ScenarioPreset) => {
    updateParam("tempCelsius", s.tempCelsius);
    if (!isAudioMuted) {
      soundEngine.playSwitchClick();
    }
  };

  const toggleSound = () => {
    toggleEngine(() => {
      soundEngine.playSwitchClick();
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [9.0, 7.0, 10.5],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Materials
    const tinnedCopperMat = new THREE.MeshStandardMaterial({
      color: 0xc8963e,
      roughness: 0.22,
      metalness: 0.92,
    });

    const brassPipesMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.2,
      metalness: 0.9,
    });

    const castIronMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.85,
    });

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.45,
    });

    const bubbleGlowTex = createGlowPointTexture();

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Cast-Iron Tripod Support Stand
    const tripod = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.6, 1.2, 16), castIronMat);
    tripod.position.y = -2.2;
    tripod.receiveShadow = true;
    rootGroup.add(tripod);

    // 2. Closed Tinned Copper Fermentation Vessel (Claim 1)
    const vatGroup = new THREE.Group();
    rootGroup.add(vatGroup);

    // Main Cylindrical Tank
    const tank = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.1, 3.8, 36), tinnedCopperMat);
    tank.position.y = 0.2;
    tank.castShadow = true;
    vatGroup.add(tank);

    // Hemispherical Top Dome Lid
    const domeLid = new THREE.Mesh(
      new THREE.SphereGeometry(2.1, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2),
      tinnedCopperMat,
    );
    domeLid.position.y = 2.1;
    vatGroup.add(domeLid);

    // 3. Goose-Neck Airlock Tube with Cotton Sterile Filter (Claim 2)
    const airlockCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 3.1, 0),
      new THREE.Vector3(0, 4.0, 0),
      new THREE.Vector3(0.8, 4.6, 0),
      new THREE.Vector3(1.6, 4.0, 0),
      new THREE.Vector3(1.6, 3.4, 0),
      new THREE.Vector3(2.2, 3.2, 0),
    ]);
    const airlockGeo = new THREE.TubeGeometry(airlockCurve, 32, 0.08, 12, false);
    const airlockMesh = new THREE.Mesh(airlockGeo, brassPipesMat);
    vatGroup.add(airlockMesh);

    // Cotton Microbial Filter Bulb
    const cottonBulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }),
    );
    cottonBulb.position.set(2.2, 3.2, 0);
    vatGroup.add(cottonBulb);

    // 4. Helical Cold-Water Cooling Coil Jacket
    const coilGroup = new THREE.Group();
    for (let c = 0; c < 6; c++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(2.18, 0.06, 12, 36), brassPipesMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -1.2 + c * 0.45;
      coilGroup.add(ring);
    }
    vatGroup.add(coilGroup);

    // 5. Sight Glass Tube & Tasting Sampling Valve
    const sightGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.8, 12), glassMat);
    sightGlass.position.set(2.2, 0.2, 0);
    vatGroup.add(sightGlass);

    const samplingCock = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.6, 12),
      brassPipesMat,
    );
    samplingCock.rotation.z = Math.PI / 2;
    samplingCock.position.set(0, -1.2, 2.2);
    vatGroup.add(samplingCock);

    // 6. Fermentation CO2 Gas Bubbles Particles
    const bubbleCount = 60;
    const bubbleGeo = new THREE.BufferGeometry();
    const bubblePositions = new Float32Array(bubbleCount * 3);
    for (let i = 0; i < bubbleCount; i++) {
      const idx = i * 3;
      const r = Math.random() * 1.8;
      const a = Math.random() * Math.PI * 2;
      bubblePositions[idx] = Math.cos(a) * r;
      bubblePositions[idx + 1] = -1.4 + Math.random() * 3.2;
      bubblePositions[idx + 2] = Math.sin(a) * r;
    }
    bubbleGeo.setAttribute("position", new THREE.BufferAttribute(bubblePositions, 3));
    const bubbleMat = new THREE.PointsMaterial({
      size: 0.22,
      map: bubbleGlowTex,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      color: 0xfef08a,
    });
    const bubblePoints = new THREE.Points(bubbleGeo, bubbleMat);
    vatGroup.add(bubblePoints);

    // Animation Loop
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const p = live.current;

      // Animate rising bubbles
      const pos = bubblePositions;
      for (let i = 0; i < bubbleCount; i++) {
        const idx = i * 3;
        pos[idx + 1] += 0.8 * delta;
        if (pos[idx + 1] > 2.0) {
          pos[idx + 1] = -1.4;
        }
      }
      bubbleGeo.attributes.position.needsUpdate = true;
      bubblePoints.visible = p.showBubbles;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      studio.cleanup();
    };
  }, [live.current]);

  return (
    <div className="relative w-full h-[620px] bg-parchment-900 rounded-2xl overflow-hidden border border-parchment-700 shadow-2xl flex flex-col">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-parchment-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-parchment-100 uppercase tracking-wider">
            Pasteur Fermentation Vat 3D
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            US Patent 135,245 (1873)
          </span>
        </div>

        {/* Camera Toolbar */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <Camera className="w-3.5 h-3.5 text-parchment-400 ml-1.5 mr-1" />
          {(
            [
              ["iso", "Isometric"],
              ["gooseneck_airlock", "Gooseneck Trap"],
              ["cooling_coil", "Cooling Coils"],
              ["sampling_valve", "Sampling Valve"],
              ["top", "Top"],
            ] as [CameraPreset, string][]
          ).map(([preset, label]) => (
            <button
              key={preset}
              type="button"
              onClick={() => applyCameraPreset(preset)}
              className={`px-2.5 py-1 text-xs font-sans rounded-lg transition-colors ${
                activeCamera === preset
                  ? "bg-amber-600 text-white font-semibold shadow-sm"
                  : "text-parchment-300 hover:text-white hover:bg-parchment-800/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-1.5 bg-parchment-950/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/60 shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={() => setShowBubbles(!showBubbles)}
            title="Toggle CO2 Bubbles"
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              showBubbles
                ? "bg-amber-600/30 text-amber-300 border border-amber-500/40"
                : "text-parchment-400 hover:text-white"
            }`}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={toggleSound}
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            <Zap className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Bottom Telemetry Bar & Controls */}
      {showUiOverlay && (
        <div className="absolute bottom-4 left-4 right-4 bg-parchment-950/90 backdrop-blur-md rounded-2xl border border-parchment-700/70 p-4 shadow-2xl z-10 flex flex-col gap-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pb-2 border-b border-parchment-800/80 text-xs font-mono">
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Vat Temperature</span>
              <span className="font-bold text-amber-400">{fermentationTempC}°C</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">
                Dissolved CO2 Pressure
              </span>
              <span className="font-bold text-blue-400">{co2PressureBar} bar</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Alcohol Yield</span>
              <span className="font-bold text-emerald-400">{alcoholAbvPct}% ABV</span>
            </div>
            <div className="bg-parchment-900/80 px-3 py-1.5 rounded-lg border border-parchment-700/50 flex flex-col">
              <span className="text-[10px] text-parchment-400 uppercase">Airlock Protection</span>
              <span className="font-bold text-amber-300">Sterile Cotton Gooseneck Trap</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-mono text-parchment-400 flex items-center gap-1 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Presets:
              </span>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {SCENARIOS.map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => applyScenario(sc)}
                    className="px-2.5 py-1 text-xs font-sans rounded-lg bg-parchment-800/80 hover:bg-parchment-700 text-parchment-200 hover:text-white border border-parchment-600/50 transition-colors whitespace-nowrap"
                  >
                    {sc.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-72 shrink-0">
              <span className="text-xs font-sans text-parchment-300 shrink-0 font-medium">
                Vat Temp:
              </span>
              <input
                type="range"
                min="8"
                max="28"
                step="0.5"
                value={fermentationTempC}
                onChange={(e) => updateParam("tempCelsius", Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-xs font-mono text-amber-400 w-16 text-right font-bold">
                {fermentationTempC}°C
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
