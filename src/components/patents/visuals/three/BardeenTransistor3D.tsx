"use client";

import { Cpu, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";

export function BardeenTransistor3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Semiconductor Point-Contact State Controls
  const [emitterCurrentMa, setEmitterCurrentMa] = useState<number>(2.5); // 0.5 to 10.0 mA
  const [collectorVoltageV, setCollectorVoltageV] = useState<number>(-40); // -10 to -80 V
  const [pointContactGapMicrons, setPointContactGapMicrons] = useState<number>(50); // 10 to 150 µm
  const [showHoleDrift, setShowHoleDrift] = useState<boolean>(true);

  // Transistor Physics Calculations
  // Alpha (Current Gain): alpha = dI_c / dI_e * exp(-gap / diffusion_length)
  const holeDiffusionLength = 80; // µm
  const alphaCurrentGain = (1.8 * Math.exp(-pointContactGapMicrons / holeDiffusionLength)).toFixed(
    2,
  );
  const collectorCurrentMa = (Number(alphaCurrentGain) * emitterCurrentMa).toFixed(2);
  const powerGainDb = Math.round(
    10 *
      Math.log10(
        (Math.abs(collectorVoltageV) * Number(collectorCurrentMa)) / (0.6 * emitterCurrentMa),
      ),
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with High-Luminosity Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [10, 8, 12],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS ---
    const germaniumCrystalMat = new THREE.MeshStandardMaterial({
      color: 0x475569, // High-purity monocrystalline n-type Germanium
      roughness: 0.15,
      metalness: 0.85,
    });

    const goldFoilMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Gold foil point-contact razor knife
      roughness: 0.1,
      metalness: 0.98,
    });

    const polystyreneWedgeMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, // Insulating plastic triangular wedge
      transmission: 0.88,
      opacity: 0.9,
      transparent: true,
      roughness: 0.1,
      ior: 1.5,
    });

    const brassSpringMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.2,
      metalness: 0.9,
    });

    // --- 3D POINT-CONTACT TRANSISTOR ASSEMBLY ---
    const transistorGroup = new THREE.Group();
    scene.add(transistorGroup);

    // 1. Germanium Crystal Block on Copper Baseplate
    const geBlock = new THREE.Mesh(new THREE.BoxGeometry(6.0, 1.2, 5.0), germaniumCrystalMat);
    geBlock.position.y = -0.6;
    geBlock.castShadow = true;
    geBlock.receiveShadow = true;
    transistorGroup.add(geBlock);

    const basePlate = new THREE.Mesh(
      new THREE.BoxGeometry(7.0, 0.4, 6.0),
      new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.3, metalness: 0.85 }),
    );
    basePlate.position.y = -1.4;
    basePlate.receiveShadow = true;
    transistorGroup.add(basePlate);

    // 2. Triangular Polystyrene Wedge Knife
    const wedgeGeo = new THREE.ConeGeometry(1.8, 2.5, 3);
    const wedge = new THREE.Mesh(wedgeGeo, polystyreneWedgeMat);
    wedge.position.set(0, 1.6, 0);
    wedge.rotation.y = Math.PI / 2;
    transistorGroup.add(wedge);

    // 3. Gold Foil Strips Slit at Apex into Emitter & Collector Micro-Contacts
    const gapUnits = pointContactGapMicrons * 0.012;

    const emitterFoil = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.8, 0.45), goldFoilMat);
    emitterFoil.position.set(-gapUnits / 2, 0.8, 0);
    emitterFoil.rotation.z = -0.15;
    emitterFoil.castShadow = true;
    transistorGroup.add(emitterFoil);

    const collectorFoil = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.8, 0.45), goldFoilMat);
    collectorFoil.position.set(gapUnits / 2, 0.8, 0);
    collectorFoil.rotation.z = 0.15;
    collectorFoil.castShadow = true;
    transistorGroup.add(collectorFoil);

    // Brass Contact Pressure Springs
    const spring1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.0, 8), brassSpringMat);
    spring1.position.set(-1.2, 2.2, 0);
    spring1.rotation.z = -0.6;
    const spring2 = spring1.clone();
    spring2.position.x = 1.2;
    spring2.rotation.z = 0.6;
    transistorGroup.add(spring1);
    transistorGroup.add(spring2);

    // --- GLOWING MINORITY CARRIER (HOLE) DRIFT PARTICLES ---
    const holeCount = 180;
    const holeGeo = new THREE.BufferGeometry();
    const holePos = new Float32Array(holeCount * 3);
    const holeColors = new Float32Array(holeCount * 3);

    const glowTex = createGlowPointTexture();

    for (let i = 0; i < holeCount; i++) {
      const idx = i * 3;
      holePos[idx] = -gapUnits / 2 + Math.random() * gapUnits;
      holePos[idx + 1] = 0.05 - Math.random() * 0.4;
      holePos[idx + 2] = (Math.random() - 0.5) * 0.8;

      // Radiant Gold/Amber Hole Injection Clouds
      holeColors[idx] = 1.0;
      holeColors[idx + 1] = 0.7;
      holeColors[idx + 2] = 0.2;
    }

    holeGeo.setAttribute("position", new THREE.BufferAttribute(holePos, 3));
    holeGeo.setAttribute("color", new THREE.BufferAttribute(holeColors, 3));

    const holePoints = new THREE.Points(
      holeGeo,
      new THREE.PointsMaterial({
        size: 0.35,
        map: glowTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    transistorGroup.add(holePoints);

    // --- RENDER LOOP & REAL-TIME CARRIER INJECTION ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Animate Holes drifting from forward-biased Emitter (+) to reverse-biased Collector (-)
      const hPos = holePos;
      const driftSpeed = (emitterCurrentMa / 2.5) * 4.0 * delta;

      for (let i = 0; i < holeCount; i++) {
        const idx = i * 3;
        hPos[idx] += driftSpeed;
        if (hPos[idx] > gapUnits / 2 + 0.1) {
          hPos[idx] = -gapUnits / 2 - 0.05;
          hPos[idx + 1] = 0.05 - Math.random() * 0.35;
          hPos[idx + 2] = (Math.random() - 0.5) * 0.8;
        }
      }
      holeGeo.attributes.position.needsUpdate = true;
      holePoints.visible = showHoleDrift;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      studio.dispose();
    };
  }, [emitterCurrentMa, pointContactGapMicrons, showHoleDrift]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      {/* 3D WebGL Canvas Viewport */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Live HUD Telemetry Overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
            <div className="text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              Point-Contact Transistor Telemetry
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs font-sans">
              <div>
                <span className="text-ink-600 dark:text-ink-400">Current Gain ($\alpha$):</span>{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {alphaCurrentGain} (Amplifying)
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Collector Current ($I_c$):</span>{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {collectorCurrentMa} mA
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Contact Micro-Gap:</span>{" "}
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {pointContactGapMicrons} µm (0.002 in)
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Power Gain:</span>{" "}
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  +{powerGainDb} dB ({(10 ** (powerGainDb / 10)).toFixed(0)}×)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>Minority Carrier Hole Injection through Surface Inversion Layer</span>
          </div>
        </div>

        {/* Toggle Controls */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            type="button"
            onClick={() => setShowHoleDrift(!showHoleDrift)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all ${
              showHoleDrift
                ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                : "bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
            }`}
          >
            Hole Drift
          </button>
        </div>
      </div>

      {/* Parameter Sliders Panel */}
      <div className="p-4 sm:p-5 bg-parchment-100/80 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
        {/* Emitter Current */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Emitter Current ($I_e$):</span>
            <span className="font-bold text-amber-700 dark:text-amber-400">
              {emitterCurrentMa.toFixed(1)} mA
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="8.0"
            step="0.5"
            value={emitterCurrentMa}
            onChange={(e) => setEmitterCurrentMa(Number(e.target.value))}
            className="w-full accent-amber-600 dark:accent-amber-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Forward-biased gold contact hole injector
          </span>
        </div>

        {/* Collector Reverse Voltage */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Collector Bias ($V_c$):</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {collectorVoltageV} V (Reverse)
            </span>
          </div>
          <input
            type="range"
            min="-80"
            max="-10"
            step="5"
            value={collectorVoltageV}
            onChange={(e) => setCollectorVoltageV(Number(e.target.value))}
            className="w-full accent-blue-600 dark:accent-blue-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            High electric field collecting injected holes
          </span>
        </div>

        {/* Point Contact Spacing */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Whisker Gap Spacing:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {pointContactGapMicrons} µm
            </span>
          </div>
          <input
            type="range"
            min="15"
            max="120"
            step="5"
            value={pointContactGapMicrons}
            onChange={(e) => setPointContactGapMicrons(Number(e.target.value))}
            className="w-full accent-emerald-600 dark:accent-emerald-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Must be within minority carrier diffusion length $L_p$
          </span>
        </div>

        {/* Signal Voltage Gain */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Voltage Gain ($A_v$):</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">
              {(Math.abs(collectorVoltageV) / 0.6).toFixed(0)}×
            </span>
          </div>
          <div className="w-full bg-parchment-300 dark:bg-ink-800 rounded-full h-3 overflow-hidden mt-2 border border-parchment-400 dark:border-ink-700">
            <div
              className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full transition-all duration-300"
              style={{ width: `${Math.min(100, (Math.abs(collectorVoltageV) / 80) * 95)}%` }}
            />
          </div>
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            {"Transfer Resistance ($R_{out} \\gg R_{in}$) $\\implies$ TRANS-RESISTOR"}
          </span>
        </div>
      </div>
    </div>
  );
}
