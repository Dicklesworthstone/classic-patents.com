"use client";

import { Flame, Rocket } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";

export function GoddardRocket3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Propulsion & Staging State Controls
  const [chamberPressurePsi, setChamberPressurePsi] = useState<number>(300); // 100 to 600 psi
  const [fuelFlowRateKgs, setFuelFlowRateKgs] = useState<number>(1.8); // 0.5 to 5.0 kg/s
  const [activeStage, setActiveStage] = useState<1 | 2>(1);
  const [gyroGimbalAngleDeg, setGyroGimbalAngleDeg] = useState<number>(3); // -15 to +15 deg
  const [showExhaustPlume, setShowExhaustPlume] = useState<boolean>(true);
  const [isLaunching, _setIsLaunching] = useState<boolean>(true);

  // Rocket Propulsion Physics (Tsiolkovsky Equation)
  // Characteristic Exhaust Velocity: c = sqrt(2 * gamma / (gamma - 1) * R * T_c * (1 - (p_e/p_c)^((gamma-1)/gamma)))
  const specificImpulseSec = Math.round(180 + (chamberPressurePsi / 300) * 45);
  const exhaustVelocityMps = specificImpulseSec * 9.80665;
  const thrustNewtons = Math.round(fuelFlowRateKgs * exhaustVelocityMps);
  const thrustLbf = Math.round(thrustNewtons * 0.2248);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Studio Scene with High-Luminosity Studio Lighting
    const studio = createThreeStudioScene({
      container,
      cameraPos: [13, 10, 16],
      targetPos: [0, 0, 0],
    });

    const { scene, camera, renderer, controls } = studio;

    // --- PBR MATERIALS ---
    const aluminumHullMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9, // Duralumin rocket outer skin
      roughness: 0.2,
      metalness: 0.9,
    });

    const copperNozzleMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Regeneratively cooled copper de Laval nozzle
      roughness: 0.3,
      metalness: 0.85,
    });

    const _steelGimbalMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.35,
      metalness: 0.8,
    });

    // --- 3D MULTI-STAGE ROCKET ASSEMBLY ---
    const rocketGroup = new THREE.Group();
    scene.add(rocketGroup);

    // Stage 1 (Booster Stage)
    const stage1Group = new THREE.Group();
    const stage1Body = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.2, 5.5, 36),
      aluminumHullMat,
    );
    stage1Body.castShadow = true;
    stage1Body.receiveShadow = true;
    stage1Group.add(stage1Body);

    // 4 Aerodynamic Stabilizing Fins
    for (let f = 0; f < 4; f++) {
      const fAngle = (f * Math.PI) / 2;
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.8, 1.2), aluminumHullMat);
      fin.position.set(Math.cos(fAngle) * 1.6, -2.0, Math.sin(fAngle) * 1.6);
      fin.rotation.y = -fAngle;
      fin.castShadow = true;
      stage1Group.add(fin);
    }

    // De Laval Supersonic Converging-Diverging Exhaust Nozzle
    const nozzleGroup = new THREE.Group();
    nozzleGroup.position.y = -2.75;

    const convNozzle = new THREE.Mesh(
      new THREE.ConeGeometry(0.85, 0.9, 24, 1, true),
      copperNozzleMat,
    );
    convNozzle.rotation.x = Math.PI;
    convNozzle.castShadow = true;
    nozzleGroup.add(convNozzle);
    stage1Group.add(nozzleGroup);
    rocketGroup.add(stage1Group);

    // Stage 2 (Upper Payload Stage & Conical Nosecone)
    const stage2Group = new THREE.Group();
    stage2Group.position.y = 4.2;

    const stage2Body = new THREE.Mesh(
      new THREE.CylinderGeometry(1.15, 1.15, 3.2, 36),
      aluminumHullMat,
    );
    stage2Body.castShadow = true;
    stage2Group.add(stage2Body);

    const noseCone = new THREE.Mesh(
      new THREE.ConeGeometry(1.15, 2.4, 36),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.25, metalness: 0.7 }),
    );
    noseCone.position.y = 2.8;
    noseCone.castShadow = true;
    stage2Group.add(noseCone);
    rocketGroup.add(stage2Group);

    // --- SUPERSONIC EXHAUST PLUME WITH SHOCK DIAMONDS ---
    const exhaustCount = 350;
    const exhaustGeo = new THREE.BufferGeometry();
    const exhaustPos = new Float32Array(exhaustCount * 3);
    const exhaustColors = new Float32Array(exhaustCount * 3);

    const glowTex = createGlowPointTexture();

    for (let i = 0; i < exhaustCount; i++) {
      const idx = i * 3;
      const progress = i / exhaustCount;
      exhaustPos[idx] = (Math.random() - 0.5) * (0.3 + progress * 1.8);
      exhaustPos[idx + 1] = -3.2 - progress * 6.5;
      exhaustPos[idx + 2] = (Math.random() - 0.5) * (0.3 + progress * 1.8);

      // White-Hot Core to Radiant Orange-Gold to Violet Plume
      exhaustColors[idx] = 1.0;
      exhaustColors[idx + 1] = 0.8 - progress * 0.5;
      exhaustColors[idx + 2] = 0.2 + progress * 0.6;
    }

    exhaustGeo.setAttribute("position", new THREE.BufferAttribute(exhaustPos, 3));
    exhaustGeo.setAttribute("color", new THREE.BufferAttribute(exhaustColors, 3));

    const exhaustPoints = new THREE.Points(
      exhaustGeo,
      new THREE.PointsMaterial({
        size: 0.55,
        map: glowTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    rocketGroup.add(exhaustPoints);

    // --- RENDER LOOP & REAL-TIME TRAJECTORY DYNAMICS ---
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Gyroscopic Gimbal Nozzle Deflection
      const gimbalRad = (gyroGimbalAngleDeg * Math.PI) / 180;
      nozzleGroup.rotation.z = Math.sin(elapsed * 4.0) * 0.05 + gimbalRad;

      // Staging Separation Physics
      if (activeStage === 2) {
        stage2Group.position.y += delta * 4.0;
        stage1Group.position.y -= delta * 2.0;
        stage1Group.rotation.z += delta * 0.2;
      } else {
        stage2Group.position.y = 4.2;
        stage1Group.position.y = 0;
        stage1Group.rotation.z = 0;
      }

      // Supersonic Exhaust Particle Physics
      if (showExhaustPlume && isLaunching) {
        const ePos = exhaustPos;
        const exhaustSpeed = (exhaustVelocityMps / 800) * 20.0 * delta;

        for (let i = 0; i < exhaustCount; i++) {
          const idx = i * 3;
          ePos[idx + 1] -= exhaustSpeed;

          // Shock diamond necking pattern along plume axis
          const yDist = Math.abs(ePos[idx + 1] + 3.2);
          const expansion = 0.2 + yDist * 0.18 + Math.sin(yDist * 4.0) * 0.12;
          ePos[idx] = (Math.random() - 0.5) * expansion;
          ePos[idx + 2] = (Math.random() - 0.5) * expansion;

          if (ePos[idx + 1] < -10.0) {
            ePos[idx + 1] = -3.2;
          }
        }
        exhaustGeo.attributes.position.needsUpdate = true;
        exhaustPoints.visible = true;
      } else {
        exhaustPoints.visible = false;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      studio.dispose();
    };
  }, [activeStage, gyroGimbalAngleDeg, showExhaustPlume, isLaunching, exhaustVelocityMps]);

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      {/* 3D WebGL Canvas Viewport */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Live HUD Telemetry Overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm">
            <div className="text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Rocket className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              Goddard Propulsion Telemetry
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-xs font-sans">
              <div>
                <span className="text-ink-600 dark:text-ink-400">Total Thrust ($F$):</span>{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {thrustNewtons} N ({thrustLbf} lbf)
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">
                  {"Specific Impulse ($I_{sp}$):"}
                </span>{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {specificImpulseSec} seconds
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Exhaust Velocity ($v_e$):</span>{" "}
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {exhaustVelocityMps.toFixed(0)} m/s (Mach {(exhaustVelocityMps / 343).toFixed(1)})
                </span>
              </div>
              <div>
                <span className="text-ink-600 dark:text-ink-400">Gimbal Vector:</span>{" "}
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {gyroGimbalAngleDeg > 0 ? `+${gyroGimbalAngleDeg}°` : `${gyroGimbalAngleDeg}°`}{" "}
                  Yaw
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 text-[11px] font-sans text-ink-700 dark:text-ink-300 flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>Liquid LOX / Gasoline Rocket Motor with de Laval Expansion Nozzle</span>
          </div>
        </div>

        {/* Toggle Controls */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            type="button"
            onClick={() => setShowExhaustPlume(!showExhaustPlume)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all ${
              showExhaustPlume
                ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                : "bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
            }`}
          >
            Exhaust Plume
          </button>
          <button
            type="button"
            onClick={() => setActiveStage(activeStage === 1 ? 2 : 1)}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold border transition-all ${
              activeStage === 2
                ? "bg-blue-600 text-white border-blue-700 shadow-sm"
                : "bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-700"
            }`}
          >
            {activeStage === 1 ? "Stage 1 Stack" : "Stage Separation"}
          </button>
        </div>
      </div>

      {/* Parameter Sliders Panel */}
      <div className="p-4 sm:p-5 bg-parchment-100/80 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
        {/* Chamber Pressure */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Combustion Pressure ($P_c$):</span>
            <span className="font-bold text-amber-700 dark:text-amber-400">
              {chamberPressurePsi} psi
            </span>
          </div>
          <input
            type="range"
            min="100"
            max="600"
            step="25"
            value={chamberPressurePsi}
            onChange={(e) => setChamberPressurePsi(Number(e.target.value))}
            className="w-full accent-amber-600 dark:accent-amber-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Higher pressure increases supersonic expansion ratio
          </span>
        </div>

        {/* Mass Flow Rate */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>{"Propellant Mass Flow ($\\dot{m}$):"}</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {fuelFlowRateKgs.toFixed(1)} kg/s
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="5.0"
            step="0.2"
            value={fuelFlowRateKgs}
            onChange={(e) => setFuelFlowRateKgs(Number(e.target.value))}
            className="w-full accent-blue-600 dark:accent-blue-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Liquid oxygen and gasoline fuel feed rate
          </span>
        </div>

        {/* Gyroscopic Gimbal Angle */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Gimbal Vane Steering:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {gyroGimbalAngleDeg}°
            </span>
          </div>
          <input
            type="range"
            min="-15"
            max="15"
            step="1"
            value={gyroGimbalAngleDeg}
            onChange={(e) => setGyroGimbalAngleDeg(Number(e.target.value))}
            className="w-full accent-emerald-600 dark:accent-emerald-400 cursor-pointer"
          />
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            Exhaust vane thrust vector control (TVC)
          </span>
        </div>

        {/* Tsiolkovsky Delta-V */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-medium text-ink-900 dark:text-parchment-100">
            <span>Staged $\Delta V$ Capability:</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">
              {(exhaustVelocityMps * Math.log(3.5)).toFixed(0)} m/s
            </span>
          </div>
          <div className="w-full bg-parchment-300 dark:bg-ink-800 rounded-full h-3 overflow-hidden mt-2 border border-parchment-400 dark:border-ink-700">
            <div
              className="bg-gradient-to-r from-emerald-500 to-purple-600 h-full transition-all duration-300"
              style={{ width: `${Math.min(100, (specificImpulseSec / 250) * 85)}%` }}
            />
          </div>
          <span className="text-[10px] text-ink-500 dark:text-ink-400 block">
            $\Delta v = v_e \ln(m_0/m_f)$ staging multiplier
          </span>
        </div>
      </div>
    </div>
  );
}
