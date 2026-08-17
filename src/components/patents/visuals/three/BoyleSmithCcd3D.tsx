"use client";

import { Camera, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";

export function BoyleSmithCcd3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // CCD Physics & Clocking State Controls
  const [clockPhase, setClockPhase] = useState<1 | 2 | 3>(1);
  const [incidentLux, setIncidentLux] = useState<number>(450); // 50 to 1200 Lux
  const [gateVoltageV, setGateVoltageV] = useState<number>(10); // 2 to 15 V
  const [transferEfficiencyPct, _setTransferEfficiencyPct] = useState<number>(99.99); // 99.0 to 99.999%
  const [_showPotentialWells, _setShowPotentialWells] = useState<boolean>(true);
  const [isAutoClocking, setIsAutoClocking] = useState<boolean>(true);

  // Charge-Coupled Physics Calculations
  // Full Well Capacity: N_sat = C_ox * (V_g - V_th) * Area / q
  const fullWellElectrons = Math.round((gateVoltageV - 1.2) * 12500);
  const collectedChargeElectrons = Math.round(fullWellElectrons * Math.min(1.0, incidentLux / 800));
  const chargeTransferInneficiencyEpsilon = ((100 - transferEfficiencyPct) / 100).toExponential(2);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with High-Luminosity Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [11, 9, 14],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS ---
    const pSiliconSubstrateMat = new THREE.MeshStandardMaterial({
      color: 0x334155, // p-type Silicon substrate
      roughness: 0.25,
      metalness: 0.85,
    });

    const gatePolySiliconMat = new THREE.MeshStandardMaterial({
      color: 0xca8a04, // Polysilicon MOS transfer gates
      roughness: 0.2,
      metalness: 0.9,
    });

    const gateActiveMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6, // Positively biased gate (+Vg)
      roughness: 0.15,
      metalness: 0.8,
      emissive: 0x2563eb,
      emissiveIntensity: 0.7,
    });

    const oxideMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8, // SiO2 insulating dielectric
      transmission: 0.85,
      opacity: 0.9,
      transparent: true,
      roughness: 0.05,
      ior: 1.46,
    });

    // --- 3D CCD REGISTRY ARRAY ASSEMBLY ---
    const ccdGroup = new THREE.Group();
    scene.add(ccdGroup);

    // Silicon Substrate
    const substrate = new THREE.Mesh(new THREE.BoxGeometry(9.0, 1.0, 5.0), pSiliconSubstrateMat);
    substrate.position.y = -0.5;
    substrate.castShadow = true;
    substrate.receiveShadow = true;
    ccdGroup.add(substrate);

    // SiO2 Oxide Dielectric Layer
    const oxide = new THREE.Mesh(new THREE.BoxGeometry(8.8, 0.3, 4.8), oxideMat);
    oxide.position.y = 0.15;
    ccdGroup.add(oxide);

    // 9 MOS Gate Electrodes (3 Pixels x 3 Phases: phi_1, phi_2, phi_3)
    const gates: { mesh: THREE.Mesh; phase: number; x: number }[] = [];
    const numGates = 9;

    for (let g = 0; g < numGates; g++) {
      const gX = -3.6 + g * 0.9;
      const phaseNum = (g % 3) + 1;

      const gateMesh = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.25, 3.8), gatePolySiliconMat);
      gateMesh.position.set(gX, 0.42, 0);
      gateMesh.castShadow = true;
      ccdGroup.add(gateMesh);

      gates.push({ mesh: gateMesh, phase: phaseNum, x: gX });
    }

    // --- GLOWING ELECTRON CHARGE PACKETS ---
    const packetCount = 240;
    const packetGeo = new THREE.BufferGeometry();
    const packetPos = new Float32Array(packetCount * 3);
    const packetColors = new Float32Array(packetCount * 3);

    const glowTex = createGlowPointTexture();

    for (let i = 0; i < packetCount; i++) {
      const idx = i * 3;
      const pixelIdx = Math.floor(i / (packetCount / 3)); // 3 active packets
      const baseGateX = -3.6 + (pixelIdx * 3 + (clockPhase - 1)) * 0.9;

      packetPos[idx] = baseGateX + (Math.random() - 0.5) * 0.5;
      packetPos[idx + 1] = -0.2 - Math.random() * 0.25;
      packetPos[idx + 2] = (Math.random() - 0.5) * 2.8;

      // Electric Cyan Electron Packet Glow
      packetColors[idx] = 0.1;
      packetColors[idx + 1] = 0.9;
      packetColors[idx + 2] = 1.0;
    }

    packetGeo.setAttribute("position", new THREE.BufferAttribute(packetPos, 3));
    packetGeo.setAttribute("color", new THREE.BufferAttribute(packetColors, 3));

    const packetPoints = new THREE.Points(
      packetGeo,
      new THREE.PointsMaterial({
        size: 0.4,
        map: glowTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    ccdGroup.add(packetPoints);

    // --- RENDER LOOP & REAL-TIME CHARGE TRANSFER DYNAMICS ---
    let reqId: number;
    const clock = new THREE.Clock();
    let phaseTimer = 0;
    let currentActivePhase = clockPhase;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (isAutoClocking) {
        phaseTimer += delta;
        if (phaseTimer > 0.6) {
          phaseTimer = 0;
          currentActivePhase = ((currentActivePhase % 3) + 1) as 1 | 2 | 3;
        }
      } else {
        currentActivePhase = clockPhase;
      }

      // Update Gate Colors & Potential Wells
      for (const g of gates) {
        if (g.phase === currentActivePhase) {
          g.mesh.material = gateActiveMat;
          g.mesh.position.y = 0.38; // Slightly depressed in electrostatic field
        } else {
          g.mesh.material = gatePolySiliconMat;
          g.mesh.position.y = 0.42;
        }
      }

      // Animate Electron Charge Packets shifting to active potential well
      const pPos = packetPos;
      for (let i = 0; i < packetCount; i++) {
        const idx = i * 3;
        const pixelIdx = Math.floor(i / (packetCount / 3));
        const targetGateX = -3.6 + (pixelIdx * 3 + (currentActivePhase - 1)) * 0.9;

        pPos[idx] += (targetGateX + (Math.random() - 0.5) * 0.4 - pPos[idx]) * 0.15;
      }
      packetGeo.attributes.position.needsUpdate = true;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      studio.dispose();
    };
  }, [clockPhase, isAutoClocking]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      {/* 3D WebGL Canvas Viewport */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Live HUD Telemetry Overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
            <div className="text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              Charge-Coupled Device Telemetry
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs font-sans">
              <div>
                <span className="text-ink-600 dark:text-ink-400">Full Well Capacity:</span>{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {fullWellElectrons.toLocaleString()} $e^-$
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Photo-Generated $Q$:</span>{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {collectedChargeElectrons.toLocaleString()} $e^-$ (
                  {((collectedChargeElectrons / fullWellElectrons) * 100).toFixed(0)}%)
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">
                  Transfer Inefficiency ($\epsilon$):
                </span>{" "}
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {chargeTransferInneficiencyEpsilon}
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">3-Phase Clock Step:</span>{" "}
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  Phase $\phi_{clockPhase}$ Active
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>Bucket-Brigade Charge Packet Shift (Boyle &amp; Smith 1969)</span>
          </div>
        </div>

        {/* Auto-clock Toggle */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            type="button"
            onClick={() => setIsAutoClocking(!isAutoClocking)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all ${
              isAutoClocking
                ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                : "bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
            }`}
          >
            {isAutoClocking ? "Auto Clocking" : "Manual Step"}
          </button>
        </div>
      </div>

      {/* Parameter Sliders Panel */}
      <div className="p-4 sm:p-5 bg-parchment-100/80 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
        {/* Manual Phase Step Buttons */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>3-Phase Clock Sequence:</span>
            <span className="font-bold text-amber-700 dark:text-amber-400">
              Phase $\phi_{clockPhase}$
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => {
                setIsAutoClocking(false);
                setClockPhase(1);
              }}
              className={`py-1 px-2 rounded-md text-xs font-semibold border ${
                clockPhase === 1
                  ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                  : "bg-white/80 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
              }`}
            >
              {"Phase 1 ($\\phi_1$)"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAutoClocking(false);
                setClockPhase(2);
              }}
              className={`py-1 px-2 rounded-md text-xs font-semibold border ${
                clockPhase === 2
                  ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                  : "bg-white/80 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
              }`}
            >
              {"Phase 2 ($\\phi_2$)"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAutoClocking(false);
                setClockPhase(3);
              }}
              className={`py-1 px-2 rounded-md text-xs font-semibold border ${
                clockPhase === 3
                  ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                  : "bg-white/80 dark:bg-ink-800 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
              }`}
            >
              {"Phase 3 ($\\phi_3$)"}
            </button>
          </div>
        </div>

        {/* Gate Voltage */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Gate Potential ($V_g$):</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">{gateVoltageV} V</span>
          </div>
          <input
            type="range"
            min="2"
            max="15"
            step="1"
            value={gateVoltageV}
            onChange={(e) => setGateVoltageV(Number(e.target.value))}
            className="w-full accent-blue-600 dark:accent-blue-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Drives electrostatic potential well depth $\psi_s$
          </span>
        </div>

        {/* Incident Illumination */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Optical Illumination:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {incidentLux} Lux
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="1200"
            step="50"
            value={incidentLux}
            onChange={(e) => setIncidentLux(Number(e.target.value))}
            className="w-full accent-emerald-600 dark:accent-emerald-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Photon absorption photo-generates electron packets
          </span>
        </div>

        {/* Charge Transfer Efficiency (CTE) */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Transfer Efficiency (CTE):</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">
              {transferEfficiencyPct}%
            </span>
          </div>
          <div className="w-full bg-parchment-300 dark:bg-ink-800 rounded-full h-3 overflow-hidden mt-2 border border-parchment-400 dark:border-ink-700">
            <div
              className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full transition-all duration-300"
              style={{ width: `${Math.max(10, (transferEfficiencyPct - 99) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Silicon surface state charge trapping fidelity
          </span>
        </div>
      </div>
    </div>
  );
}
