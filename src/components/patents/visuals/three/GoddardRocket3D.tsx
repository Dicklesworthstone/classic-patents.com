"use client";

import { Flame, Rocket } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createGlowPointTexture, createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

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

  const live = useLiveSimParams({
    activeStage,
    gyroGimbalAngleDeg,
    showExhaustPlume,
    isLaunching,
    exhaustVelocityMps,
  });

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
      new THREE.CylinderGeometry(1.2, 1.2, 5.5, 48),
      aluminumHullMat,
    );
    stage1Body.castShadow = true;
    stage1Body.receiveShadow = true;
    stage1Group.add(stage1Body);

    // Structural Stringer Rings along Stage 1
    for (let r = 0; r < 4; r++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.21, 0.03, 8, 36),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 }),
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -2.2 + r * 1.4;
      stage1Group.add(ring);
    }

    // 4 Swept Aerodynamic Stabilizing Fins with Airfoil Profile
    for (let f = 0; f < 4; f++) {
      const fAngle = (f * Math.PI) / 2;
      const finShape = new THREE.Shape();
      finShape.moveTo(0, 0);
      finShape.lineTo(1.4, -0.6);
      finShape.lineTo(1.4, -1.8);
      finShape.lineTo(0, -1.5);
      finShape.closePath();

      const finGeo = new THREE.ExtrudeGeometry(finShape, { depth: 0.08, bevelEnabled: false });
      finGeo.center();
      const fin = new THREE.Mesh(finGeo, aluminumHullMat);
      fin.position.set(Math.cos(fAngle) * 1.8, -2.0, Math.sin(fAngle) * 1.8);
      fin.rotation.y = -fAngle + Math.PI / 2;
      fin.castShadow = true;
      stage1Group.add(fin);
    }

    // De Laval Supersonic Converging-Diverging Exhaust Bell Nozzle (Smooth Lathe Geometry)
    const nozzleGroup = new THREE.Group();
    nozzleGroup.position.y = -2.75;

    // Gyroscopic Gimbal Outer & Inner Ring
    const gimbalRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.95, 0.06, 12, 32),
      new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.85, roughness: 0.3 }),
    );
    gimbalRing.rotation.x = Math.PI / 2;
    gimbalRing.position.y = 0.2;
    nozzleGroup.add(gimbalRing);

    // De Laval Contour: Combustion Chamber (wide) -> Throat Constriction (narrow) -> Flared Expansion Bell
    const nozzlePoints: THREE.Vector2[] = [];
    nozzlePoints.push(new THREE.Vector2(0.85, 0.3)); // Injector dome
    nozzlePoints.push(new THREE.Vector2(0.82, 0.1)); // Combustion chamber wall
    nozzlePoints.push(new THREE.Vector2(0.42, -0.2)); // Converging section
    nozzlePoints.push(new THREE.Vector2(0.32, -0.35)); // Supersonic throat ($M = 1$)
    nozzlePoints.push(new THREE.Vector2(0.45, -0.65)); // Diverging bell
    nozzlePoints.push(new THREE.Vector2(0.68, -1.05)); // Parabolic bell exit
    nozzlePoints.push(new THREE.Vector2(0.92, -1.45)); // Nozzle exit lip ($M \approx 3.2$)

    const deLavalGeo = new THREE.LatheGeometry(nozzlePoints, 36);
    const deLavalMesh = new THREE.Mesh(deLavalGeo, copperNozzleMat);
    deLavalMesh.castShadow = true;
    nozzleGroup.add(deLavalMesh);

    // Regenerative Cooling Tube Manifold Ring at Exit Lip
    const manifoldRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.93, 0.045, 8, 32),
      copperNozzleMat,
    );
    manifoldRing.rotation.x = Math.PI / 2;
    manifoldRing.position.y = -1.45;
    nozzleGroup.add(manifoldRing);

    stage1Group.add(nozzleGroup);
    rocketGroup.add(stage1Group);

    // Stage 2 (Upper Payload Stage & Conical Nosecone)
    const stage2Group = new THREE.Group();
    stage2Group.position.y = 4.2;

    // Interstage Separation Truss
    const interstageRing = new THREE.Mesh(
      new THREE.CylinderGeometry(1.18, 1.2, 0.5, 36, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 }),
    );
    interstageRing.position.y = -1.85;
    stage2Group.add(interstageRing);

    const stage2Body = new THREE.Mesh(
      new THREE.CylinderGeometry(1.15, 1.15, 3.2, 48),
      aluminumHullMat,
    );
    stage2Body.castShadow = true;
    stage2Group.add(stage2Body);

    const noseCone = new THREE.Mesh(
      new THREE.ConeGeometry(1.15, 2.4, 48),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.25, metalness: 0.7 }),
    );
    noseCone.position.y = 2.8;
    noseCone.castShadow = true;
    stage2Group.add(noseCone);

    // Pitot Airspeed & Dynamic Pressure Probe
    const pitotProbe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.9, 8),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95 }),
    );
    pitotProbe.position.y = 4.3;
    stage2Group.add(pitotProbe);

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
      const p = live.current;

      // Gyroscopic Gimbal Nozzle Deflection
      const gimbalRad = (p.gyroGimbalAngleDeg * Math.PI) / 180;
      nozzleGroup.rotation.z = Math.sin(elapsed * 4.0) * 0.05 + gimbalRad;

      // Staging Separation Physics
      if (p.activeStage === 2) {
        stage2Group.position.y += delta * 4.0;
        stage1Group.position.y -= delta * 2.0;
        stage1Group.rotation.z += delta * 0.2;
      } else {
        stage2Group.position.y = 4.2;
        stage1Group.position.y = 0;
        stage1Group.rotation.z = 0;
      }

      // Supersonic Exhaust Particle Physics
      if (p.showExhaustPlume && p.isLaunching) {
        const ePos = exhaustPos;
        const exhaustSpeed = (p.exhaustVelocityMps / 800) * 20.0 * delta;

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
