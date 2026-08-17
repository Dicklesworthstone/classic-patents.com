"use client";

import { Sparkles, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { soundEngine } from "@/utils/soundEngine";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

export function TeslaCoil3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Electrical Resonant State Controls
  const [resonantFreqKhz, setResonantFreqKhz] = useState<number>(180); // 50 to 500 kHz
  const [sparkGapDistanceMm, setSparkGapDistanceMm] = useState<number>(12); // 2 to 30 mm
  const [inputVoltageKv, setInputVoltageKv] = useState<number>(15); // 5 to 30 kV
  const [toploadCapacitancePf, setToploadCapacitancePf] = useState<number>(35); // 10 to 80 pF
  const [showLightningStreamers, setShowLightningStreamers] = useState<boolean>(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // High-Frequency Resonant Physics Calculations
  // Secondary Output Voltage: V_sec = V_pri * sqrt(L_sec / L_pri) * Q
  const qFactor = 145;
  const secondaryVoltageMv = (
    ((inputVoltageKv * 1000 * Math.sqrt(85 / 0.012) * qFactor) / 1e6) *
    (sparkGapDistanceMm / 15)
  ).toFixed(2);
  const streamerLengthInches = (Number(secondaryVoltageMv) * 28).toFixed(1);

  const live = useLiveSimParams({
    resonantFreqKhz,
    sparkGapDistanceMm,
    inputVoltageKv,
    showLightningStreamers,
    secondaryVoltageMv,
  });

  // Audio synthesis
  useEffect(() => {
    if (isPlayingAudio) {
      soundEngine.playContinuousTone(resonantFreqKhz * 2.5, "sawtooth", 0.05);
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

    // Create Studio Scene with High-Luminosity Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [11, 9, 14],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS ---
    const toroidAluminumMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9, // Spun aluminum toroidal breakout terminal
      roughness: 0.1,
      metalness: 0.95,
    });

    const secondaryCopperWireMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // High-density magnet wire secondary turns
      roughness: 0.3,
      metalness: 0.85,
    });

    const primaryHeavyCopperMat = new THREE.MeshStandardMaterial({
      color: 0xca8a04, // Flat-spiral heavy copper strap primary
      roughness: 0.18,
      metalness: 0.9,
    });

    const baseMahoganyMat = new THREE.MeshStandardMaterial({
      color: 0x78350f, // Heavy mahogany insulated support table
      roughness: 0.35,
      metalness: 0.05,
    });

    const sparkGapBrassMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Rotary brass tungsten electrode balls
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

    // Secondary Helical Resonator Tube (1,000+ turns of fine magnet wire)
    const secondaryCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.85, 0.85, 5.2, 48),
      secondaryCopperWireMat,
    );
    secondaryCylinder.position.y = -0.6;
    secondaryCylinder.castShadow = true;
    coilGroup.add(secondaryCylinder);

    // Continuous Archimedean Spiral Primary Coil (6 Heavy Copper Tubing Turns)
    const spiralPts: THREE.Vector3[] = [];
    const numSpiralTurns = 6.0;
    const numSpiralPts = 160;
    const innerRadius = 1.3;
    const outerRadius = 3.6;

    for (let i = 0; i <= numSpiralPts; i++) {
      const t = i / numSpiralPts;
      const angle = t * numSpiralTurns * Math.PI * 2;
      const radius = innerRadius + t * (outerRadius - innerRadius);
      const y = -2.8 + t * 0.45; // Subtle conical taper
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
      const comb = new THREE.Mesh(
        new THREE.BoxGeometry(outerRadius - innerRadius + 0.5, 0.35, 0.12),
        baseMahoganyMat,
      );
      comb.position.set(
        Math.cos(sAngle) * ((innerRadius + outerRadius) / 2),
        -2.75,
        Math.sin(sAngle) * ((innerRadius + outerRadius) / 2),
      );
      comb.rotation.y = -sAngle;
      comb.castShadow = true;
      coilGroup.add(comb);
    }

    // Rotary Spark Gap Motor Housing & Electrodes
    const motorHousing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.55, 0.65, 16),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 }),
    );
    motorHousing.position.set(-2.5, -3.4, 2.0);
    motorHousing.castShadow = true;
    coilGroup.add(motorHousing);

    // Rotary Spark Gap Discharge Electrodes
    const sparkGapLeft = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), sparkGapBrassMat);
    sparkGapLeft.position.set(-2.5, -3.0, 2.0);
    const sparkGapRight = sparkGapLeft.clone();
    sparkGapRight.position.x = -1.9;
    coilGroup.add(sparkGapLeft);
    coilGroup.add(sparkGapRight);

    // Spun Aluminum Toroid Top-Load Capacitance Terminal
    const toroid = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.85, 32, 64), toroidAluminumMat);
    toroid.rotation.x = Math.PI / 2;
    toroid.position.y = 2.4;
    toroid.castShadow = true;
    coilGroup.add(toroid);

    // Top Center Brass Corona Sphere & Discharge Point Needle
    const coronaSphere = new THREE.Mesh(new THREE.SphereGeometry(0.45, 24, 24), sparkGapBrassMat);
    coronaSphere.position.y = 2.4;
    coilGroup.add(coronaSphere);

    const breakoutPoint = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.6, 12), sparkGapBrassMat);
    breakoutPoint.position.set(2.1, 2.4, 0);
    breakoutPoint.rotation.z = -Math.PI / 2;
    coilGroup.add(breakoutPoint);

    // --- 3D FRACTAL LIGHTNING PLASMA STREAMERS ---
    const streamerCount = 12;
    const streamerLines: THREE.Line[] = [];
    const glowTex = createGlowPointTexture();

    for (let s = 0; s < streamerCount; s++) {
      const pts: THREE.Vector3[] = [];
      const numSegments = 8;
      let currentPt = new THREE.Vector3(2.1, 2.4, 0);
      pts.push(currentPt.clone());

      for (let j = 0; j < numSegments; j++) {
        const branchDir = new THREE.Vector3(
          0.4 + Math.random() * 0.5,
          (Math.random() - 0.5) * 0.6,
          (Math.random() - 0.5) * 0.6,
        ).normalize();
        currentPt = currentPt.clone().add(branchDir.multiplyScalar(0.55));
        pts.push(currentPt);
      }

      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x93c5fd,
        transparent: true,
        opacity: 0.9,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      coilGroup.add(line);
      streamerLines.push(line);
    }

    // --- GLOWING SPARK DISCHARGE PARTICLES ---
    const sparkCount = 60;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(sparkCount * 3);

    for (let i = 0; i < sparkCount; i++) {
      const idx = i * 3;
      sparkPos[idx] = -2.5 + Math.random() * (12 * 0.05);
      sparkPos[idx + 1] = -3.2 + (Math.random() - 0.5) * 0.2;
      sparkPos[idx + 2] = 2.0 + (Math.random() - 0.5) * 0.2;
    }

    sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPos, 3));
    const sparkPoints = new THREE.Points(
      sparkGeo,
      new THREE.PointsMaterial({
        size: 0.45,
        map: glowTex,
        color: 0x60a5fa,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    scene.add(sparkPoints);

    // --- RENDER LOOP & REAL-TIME PLASMA DISCHARGE ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const _delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const p = live.current;

      // Update physical spark gap electrode position
      sparkGapRight.position.x = -2.5 + p.sparkGapDistanceMm * 0.05;

      // Animate Fractal Lightning Streamers
      if (p.showLightningStreamers) {
        const streamerScale = Math.min(2.5, Math.max(0.5, Number(p.secondaryVoltageMv) * 0.8));
        for (let s = 0; s < streamerCount; s++) {
          const line = streamerLines[s];
          const pts: THREE.Vector3[] = [];
          let cur = new THREE.Vector3(2.1, 2.4, 0);
          pts.push(cur.clone());

          const sAngle = (s * 2 * Math.PI) / streamerCount + Math.sin(elapsed * 12.0 + s) * 0.2;
          for (let j = 0; j < 8; j++) {
            const jitter = new THREE.Vector3(
              (Math.cos(sAngle) * 0.5 + (Math.random() - 0.5) * 0.4) * streamerScale,
              (Math.sin(elapsed * 20.0 + j) * 0.35 + (Math.random() - 0.5) * 0.3) * streamerScale,
              (Math.sin(sAngle) * 0.5 + (Math.random() - 0.5) * 0.4) * streamerScale,
            );
            cur = cur.clone().add(jitter);
            pts.push(cur);
          }
          line.geometry.setFromPoints(pts);
          line.visible = Math.random() > 0.15; // Realistic plasma flicker
        }
      } else {
        for (const line of streamerLines) {
          line.visible = false;
        }
      }

      // Animate Spark Gap plasma
      const sPos = sparkPos;
      for (let i = 0; i < sparkCount; i++) {
        const idx = i * 3;
        sPos[idx] = -2.5 + Math.random() * (p.sparkGapDistanceMm * 0.05);
        sPos[idx + 1] = -3.2 + (Math.random() - 0.5) * 0.15;
        sPos[idx + 2] = 2.0 + (Math.random() - 0.5) * 0.15;
      }
      sparkGeo.attributes.position.needsUpdate = true;

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
              <Zap className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              High-Frequency Resonator Telemetry
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs font-sans">
              <div>
                <span className="text-ink-600 dark:text-ink-400">Resonant Frequency:</span>{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {resonantFreqKhz} kHz
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Secondary Output:</span>{" "}
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {secondaryVoltageMv} Megavolts
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Plasma Streamers:</span>{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {streamerLengthInches} inches
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Resonator Q-Factor:</span>{" "}
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {qFactor} (Tuned)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
            <span>Air-Core Resonant Transformer (Zero Iron Core Saturation)</span>
          </div>
        </div>

        {/* Audio & Streamer Toggles */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            type="button"
            onClick={() => setShowLightningStreamers(!showLightningStreamers)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all ${
              showLightningStreamers
                ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                : "bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
            }`}
          >
            Plasma Streamers
          </button>
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
                Discharge Audio ON
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 inline mr-1" />
                Audio OFF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Parameter Sliders Panel */}
      <div className="p-4 sm:p-5 bg-parchment-100/80 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
        {/* Resonant Frequency */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Tuned LC Frequency ($f_0$):</span>
            <span className="font-bold text-amber-700 dark:text-amber-400">
              {resonantFreqKhz} kHz
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="400"
            step="10"
            value={resonantFreqKhz}
            onChange={(e) => setResonantFreqKhz(Number(e.target.value))}
            className="w-full accent-amber-600 dark:accent-amber-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            {"$f_0 = 1 / (2\\pi\\sqrt{L_{sec}C_{top}})$ resonant matching"}
          </span>
        </div>

        {/* Spark Gap Distance */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Quenched Spark Gap:</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {sparkGapDistanceMm} mm
            </span>
          </div>
          <input
            type="range"
            min="2"
            max="30"
            step="1"
            value={sparkGapDistanceMm}
            onChange={(e) => setSparkGapDistanceMm(Number(e.target.value))}
            className="w-full accent-blue-600 dark:accent-blue-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Air breakdown dielectric: 3 kV/mm
          </span>
        </div>

        {/* Primary Input Voltage */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Primary Tank Voltage ($V_p$):</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {inputVoltageKv} kV
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="30"
            step="1"
            value={inputVoltageKv}
            onChange={(e) => setInputVoltageKv(Number(e.target.value))}
            className="w-full accent-emerald-600 dark:accent-emerald-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Charged capacitor bank potential
          </span>
        </div>

        {/* Top-load Capacitance */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Toroid Terminal Capacitance:</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">
              {toploadCapacitancePf} pF
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="80"
            step="5"
            value={toploadCapacitancePf}
            onChange={(e) => setToploadCapacitancePf(Number(e.target.value))}
            className="w-full accent-purple-600 dark:accent-purple-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Smooth radius prevents premature corona discharge
          </span>
        </div>
      </div>
    </div>
  );
}
