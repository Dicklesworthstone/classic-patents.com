/**
 * haberAmmoniaModel.ts
 *
 * Procedural 3D WebGL Model of Fritz Haber & Robert Le Rossignol's 1910
 * High-Pressure Catalytic Ammonia Synthesis Converter Apparatus (US Patent 971,501).
 *
 * Conforms to the Classic Patents 3D visualization doctrine:
 * - Pure procedural Three.js geometry (No GLTF/GLB asset loading)
 * - Deterministic pseudo-random seeding (Deterministic replay in frame loop)
 * - Named articulation nodes with complete deep disposal
 */

import * as THREE from "three";

export interface HaberAmmoniaModelNodes {
  root: THREE.Group;
  compressorPiston: THREE.Mesh;
  compressorFlywheel: THREE.Mesh;
  catalystBed: THREE.Mesh;
  catalystGlowLight: THREE.PointLight;
  heatExchangerCoil: THREE.Mesh;
  condenserLiquidMesh: THREE.Mesh;
  flowParticles: THREE.Points;
  materials: THREE.Material[];
}

export function buildHaberAmmoniaModel(): HaberAmmoniaModelNodes {
  const root = new THREE.Group();
  const materials: THREE.Material[] = [];

  // ==========================================
  // MATERIALS
  // ==========================================
  const steelMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.35,
    metalness: 0.85,
  });
  materials.push(steelMat);

  const darkFlangeMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.5,
    metalness: 0.9,
  });
  materials.push(darkFlangeMat);

  const copperPipeMat = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    roughness: 0.3,
    metalness: 0.8,
  });
  materials.push(copperPipeMat);

  const catalystMat = new THREE.MeshStandardMaterial({
    color: 0x78350f,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.4,
    roughness: 0.8,
    metalness: 0.3,
  });
  materials.push(catalystMat);

  const liquidAmmoniaMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    roughness: 0.1,
    metalness: 0.1,
    transparent: true,
    opacity: 0.85,
  });
  materials.push(liquidAmmoniaMat);

  const baseSkidMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.8,
    metalness: 0.2,
  });
  materials.push(baseSkidMat);

  // ==========================================
  // 1. BASE MOUNTING SKID
  // ==========================================
  const skidGeo = new THREE.BoxGeometry(6.5, 0.25, 3.2);
  const skidMesh = new THREE.Mesh(skidGeo, baseSkidMat);
  skidMesh.position.set(0, -0.125, 0);
  skidMesh.receiveShadow = true;
  root.add(skidMesh);

  // ==========================================
  // 2. HIGH-PRESSURE FEED COMPRESSOR (Left: x = -2.0)
  // ==========================================
  const compGroup = new THREE.Group();
  compGroup.position.set(-2.0, 0, 0);
  root.add(compGroup);

  // Compressor Frame
  const compFrameGeo = new THREE.BoxGeometry(1.0, 1.2, 0.9);
  const compFrameMesh = new THREE.Mesh(compFrameGeo, darkFlangeMat);
  compFrameMesh.position.set(0, 0.6, 0);
  compFrameMesh.castShadow = true;
  compGroup.add(compFrameMesh);

  // Compression Cylinder
  const cylGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.8, 16);
  const cylMesh = new THREE.Mesh(cylGeo, steelMat);
  cylMesh.position.set(0, 1.4, 0);
  compGroup.add(cylMesh);

  // Reciprocating Piston Rod
  const pistonGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.4, 16);
  const compressorPiston = new THREE.Mesh(pistonGeo, copperPipeMat);
  compressorPiston.position.set(0, 1.3, 0);
  compGroup.add(compressorPiston);

  // Flywheel
  const flywheelGeo = new THREE.TorusGeometry(0.5, 0.08, 12, 24);
  const compressorFlywheel = new THREE.Mesh(flywheelGeo, steelMat);
  compressorFlywheel.position.set(0, 0.6, 0.5);
  compGroup.add(compressorFlywheel);

  // ==========================================
  // 3. REGENERATIVE HEAT EXCHANGER (Center-Left: x = -0.7)
  // ==========================================
  const hxGroup = new THREE.Group();
  hxGroup.position.set(-0.7, 0, 0);
  root.add(hxGroup);

  // HX Shell Column
  const hxShellGeo = new THREE.CylinderGeometry(0.35, 0.35, 2.4, 20);
  const hxShellMesh = new THREE.Mesh(hxShellGeo, steelMat);
  hxShellMesh.position.set(0, 1.2, 0);
  hxGroup.add(hxShellMesh);

  // HX Top and Bottom Flanges
  const hxFlangeGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.12, 20);
  const hxTopFlange = new THREE.Mesh(hxFlangeGeo, darkFlangeMat);
  hxTopFlange.position.set(0, 2.4, 0);
  hxGroup.add(hxTopFlange);

  const hxBottomFlange = new THREE.Mesh(hxFlangeGeo, darkFlangeMat);
  hxBottomFlange.position.set(0, 0.1, 0);
  hxGroup.add(hxBottomFlange);

  // Internal Coil indicator
  const coilGeo = new THREE.TorusGeometry(0.2, 0.04, 8, 20);
  const heatExchangerCoil = new THREE.Mesh(coilGeo, copperPipeMat);
  heatExchangerCoil.rotation.x = Math.PI / 2;
  heatExchangerCoil.position.set(0, 1.2, 0);
  hxGroup.add(heatExchangerCoil);

  // ==========================================
  // 4. MAIN SYNTHESIS CONVERTER REACTOR (Center-Right: x = 0.7)
  // ==========================================
  const reactorGroup = new THREE.Group();
  reactorGroup.position.set(0.7, 0, 0);
  root.add(reactorGroup);

  // Heavy Forged Steel Outer Reactor Wall
  const reactorWallGeo = new THREE.CylinderGeometry(0.55, 0.55, 3.0, 24);
  const reactorWallMesh = new THREE.Mesh(reactorWallGeo, darkFlangeMat);
  reactorWallMesh.position.set(0, 1.5, 0);
  reactorWallMesh.castShadow = true;
  reactorGroup.add(reactorWallMesh);

  // Heavy Bolted Flanges (Top, Middle, Bottom)
  const flangeGeo = new THREE.CylinderGeometry(0.68, 0.68, 0.18, 24);
  const topFlange = new THREE.Mesh(flangeGeo, steelMat);
  topFlange.position.set(0, 3.0, 0);
  reactorGroup.add(topFlange);

  const midFlange = new THREE.Mesh(flangeGeo, steelMat);
  midFlange.position.set(0, 1.5, 0);
  reactorGroup.add(midFlange);

  const btmFlange = new THREE.Mesh(flangeGeo, steelMat);
  btmFlange.position.set(0, 0.15, 0);
  reactorGroup.add(btmFlange);

  // Solid Catalyst Bed (Inside / Cutaway core)
  const catBedGeo = new THREE.CylinderGeometry(0.42, 0.42, 1.8, 20);
  const catalystBed = new THREE.Mesh(catBedGeo, catalystMat);
  catalystBed.position.set(0, 1.5, 0.1);
  reactorGroup.add(catalystBed);

  // Catalyst Thermal Glow Point Light
  const catalystGlowLight = new THREE.PointLight(0xf59e0b, 2.0, 4.0);
  catalystGlowLight.position.set(0.7, 1.5, 0.5);
  root.add(catalystGlowLight);

  // ==========================================
  // 5. CHILLER CONDENSER & SEPARATOR (Right: x = 2.1)
  // ==========================================
  const sepGroup = new THREE.Group();
  sepGroup.position.set(2.1, 0, 0);
  root.add(sepGroup);

  // Condenser Shell
  const sepShellGeo = new THREE.CylinderGeometry(0.4, 0.4, 2.2, 20);
  const sepShellMesh = new THREE.Mesh(sepShellGeo, steelMat);
  sepShellMesh.position.set(0, 1.1, 0);
  sepGroup.add(sepShellMesh);

  // Liquid Ammonia Reservoir Level
  const liquidGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.6, 20);
  const condenserLiquidMesh = new THREE.Mesh(liquidGeo, liquidAmmoniaMat);
  condenserLiquidMesh.position.set(0, 0.35, 0);
  sepGroup.add(condenserLiquidMesh);

  // Liquid Ammonia Drain Valve
  const drainGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.35, 12);
  const drainMesh = new THREE.Mesh(drainGeo, copperPipeMat);
  drainMesh.position.set(0, -0.05, 0);
  sepGroup.add(drainMesh);

  // ==========================================
  // 6. HIGH-PRESSURE CONNECTING PIPES
  // ==========================================
  const pipeMat = copperPipeMat;

  // Compressor -> HX Pipe
  const pipe1Geo = new THREE.CylinderGeometry(0.05, 0.05, 1.3, 12);
  const pipe1 = new THREE.Mesh(pipe1Geo, pipeMat);
  pipe1.rotation.z = Math.PI / 2;
  pipe1.position.set(-1.35, 1.4, 0);
  root.add(pipe1);

  // HX -> Reactor Top Pipe
  const pipe2Geo = new THREE.CylinderGeometry(0.05, 0.05, 1.4, 12);
  const pipe2 = new THREE.Mesh(pipe2Geo, pipeMat);
  pipe2.rotation.z = Math.PI / 2;
  pipe2.position.set(0.0, 2.3, 0);
  root.add(pipe2);

  // Reactor Bottom -> HX Bottom Pipe
  const pipe3Geo = new THREE.CylinderGeometry(0.05, 0.05, 1.4, 12);
  const pipe3 = new THREE.Mesh(pipe3Geo, pipeMat);
  pipe3.rotation.z = Math.PI / 2;
  pipe3.position.set(0.0, 0.3, 0);
  root.add(pipe3);

  // HX Bottom -> Condenser Pipe
  const pipe4Geo = new THREE.CylinderGeometry(0.05, 0.05, 2.8, 12);
  const pipe4 = new THREE.Mesh(pipe4Geo, pipeMat);
  pipe4.rotation.z = Math.PI / 2;
  pipe4.position.set(0.7, 0.1, 0.5);
  root.add(pipe4);

  // Top Recycle Return Pipe (Condenser -> Compressor)
  const recyclePipeGeo = new THREE.CylinderGeometry(0.04, 0.04, 4.1, 12);
  const recyclePipe = new THREE.Mesh(recyclePipeGeo, steelMat);
  recyclePipe.rotation.z = Math.PI / 2;
  recyclePipe.position.set(0.05, 2.8, 0);
  root.add(recyclePipe);

  // ==========================================
  // 7. DETERMINISTIC GAS FLOW PARTICLES
  // ==========================================
  const particleCount = 60;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    // Deterministic pseudo-random seed distribution
    const r1 = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    const r2 = (Math.sin(i * 78.233) * 43758.5453) % 1;
    const r3 = (Math.sin(i * 45.164) * 43758.5453) % 1;

    particlePositions[i * 3] = -2.0 + Math.abs(r1) * 4.2;
    particlePositions[i * 3 + 1] = 0.5 + Math.abs(r2) * 2.2;
    particlePositions[i * 3 + 2] = (Math.abs(r3) - 0.5) * 0.4;
  }

  particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 0.06,
    transparent: true,
    opacity: 0.8,
  });
  materials.push(particleMat);

  const flowParticles = new THREE.Points(particleGeo, particleMat);
  root.add(flowParticles);

  return {
    root,
    compressorPiston,
    compressorFlywheel,
    catalystBed,
    catalystGlowLight,
    heatExchangerCoil,
    condenserLiquidMesh,
    flowParticles,
    materials,
  };
}

export function articulateHaberAmmoniaModel(
  nodes: HaberAmmoniaModelNodes,
  telemetry: {
    pressureAtm: number;
    temperatureCelsius: number;
    ammoniaYieldPct: number;
    ammoniaProductionKgPerHour: number;
  },
  timeSec: number,
) {
  // 1. Compressor Piston & Flywheel rotation
  const compSpeed = 4.0;
  nodes.compressorFlywheel.rotation.z = timeSec * compSpeed;
  nodes.compressorPiston.position.y = 1.3 + Math.sin(timeSec * compSpeed) * 0.12;

  // 2. Catalyst Bed Thermal Glow
  const tempRatio = Math.max(0, Math.min(1, (telemetry.temperatureCelsius - 350) / 300));
  const catMat = nodes.catalystBed.material as THREE.MeshStandardMaterial;
  if (catMat) {
    catMat.emissiveIntensity = 0.2 + tempRatio * 0.8;
  }
  nodes.catalystGlowLight.intensity = 1.0 + tempRatio * 2.5;

  // 3. Liquid Ammonia Reservoir Height
  const liquidHeight = Math.max(
    0.1,
    Math.min(0.8, 0.2 + (telemetry.ammoniaProductionKgPerHour / 100) * 0.5),
  );
  nodes.condenserLiquidMesh.scale.set(1, liquidHeight, 1);

  // 4. Flow Particles along synthesis loop
  const posAttr = nodes.flowParticles.geometry.getAttribute("position") as THREE.BufferAttribute;
  const posArr = posAttr.array as Float32Array;
  const count = posArr.length / 3;

  for (let i = 0; i < count; i++) {
    posArr[i * 3] += 0.02;
    if (posArr[i * 3] > 2.2) {
      posArr[i * 3] = -2.0;
    }
  }
  posAttr.needsUpdate = true;
}
