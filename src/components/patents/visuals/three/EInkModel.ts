import * as THREE from "three";
import { stepEInk } from "@/physics/eInkKernel";

export interface EInkModel {
  root: THREE.Group;
  mainGroup: THREE.Group;
  whiteParticleMeshes: THREE.Mesh[];
  blackParticleMeshes: THREE.Mesh[];
  eFieldArrows: THREE.Group[];
  topPlate: THREE.Mesh;
  bottomPlate: THREE.Mesh;
  updateElectrophoresis: (voltage: number, timeSec: number) => void;
  dispose: () => void;
}

export function buildEInkModel(): EInkModel {
  const root = new THREE.Group();
  root.name = "E-Ink Microencapsulated Electronic Paper Model";
  const mainGroup = new THREE.Group();
  root.add(mainGroup);

  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];

  const trackMat = <T extends THREE.Material>(mat: T): T => {
    materialsToDispose.push(mat);
    return mat;
  };

  const trackGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    geometriesToDispose.push(geo);
    return geo;
  };

  // --- Museum-Grade Materials ---
  const capsuleShellMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      roughness: 0.08,
      transmission: 0.88,
      ior: 1.48,
      thickness: 0.12,
      side: THREE.DoubleSide,
    }),
  );

  const fluidMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.15,
      roughness: 0.05,
      transmission: 0.95,
      ior: 1.42,
    }),
  );

  const itoElectrodeMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.5,
      roughness: 0.1,
      transmission: 0.85,
      metalness: 0.2,
    }),
  );

  const bottomElectrodeMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.85,
      roughness: 0.25,
    }),
  );

  const whiteParticleMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.1,
      emissive: new THREE.Color(0xf8fafc),
      emissiveIntensity: 0.2,
    }),
  );

  const blackParticleMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.85,
      metalness: 0.2,
    }),
  );

  const arrowMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.2,
      metalness: 0.8,
      emissive: new THREE.Color(0xd97706),
      emissiveIntensity: 0.4,
    }),
  );

  // 1. Top Transparent ITO Electrode
  const topPlateGeo = trackGeo(new THREE.BoxGeometry(2.8, 0.06, 2.8));
  const topPlate = new THREE.Mesh(topPlateGeo, itoElectrodeMat);
  topPlate.position.set(0, 1.45, 0);
  topPlate.castShadow = true;
  mainGroup.add(topPlate);

  // 2. Bottom Segmented Drive Electrode
  const bottomPlateGeo = trackGeo(new THREE.BoxGeometry(2.8, 0.08, 2.8));
  const bottomPlate = new THREE.Mesh(bottomPlateGeo, bottomElectrodeMat);
  bottomPlate.position.set(0, -1.45, 0);
  bottomPlate.receiveShadow = true;
  mainGroup.add(bottomPlate);

  // 3. Transparent Polymer Microcapsule Shell
  const capsuleGeo = trackGeo(new THREE.SphereGeometry(1.25, 32, 32));
  const capsule = new THREE.Mesh(capsuleGeo, capsuleShellMat);
  mainGroup.add(capsule);

  // Internal Dielectric Carrier Fluid Core
  const fluidGeo = trackGeo(new THREE.SphereGeometry(1.22, 24, 24));
  const fluid = new THREE.Mesh(fluidGeo, fluidMat);
  mainGroup.add(fluid);

  // 4. Positively-Charged TiO2 (White) & Negatively-Charged Carbon (Black) Nanoparticles
  const NUM_PARTICLES = 48;
  const particleGeo = trackGeo(new THREE.SphereGeometry(0.065, 16, 16));

  const whiteParticleMeshes: THREE.Mesh[] = [];
  const blackParticleMeshes: THREE.Mesh[] = [];
  const whiteInitialOffsets: { x: number; z: number; jitter: number }[] = [];
  const blackInitialOffsets: { x: number; z: number; jitter: number }[] = [];

  for (let i = 0; i < NUM_PARTICLES; i++) {
    const angle = (i / NUM_PARTICLES) * Math.PI * 2;
    const r = 0.2 + (Math.sin(i * 3.7) * 0.5 + 0.5) * 0.75;
    const offsetX = Math.cos(angle) * r;
    const offsetZ = Math.sin(angle) * r;
    const jitterY = Math.cos(i * 5.1) * 0.2;

    const wp = new THREE.Mesh(particleGeo, whiteParticleMat);
    wp.position.set(offsetX, 0.75 + jitterY, offsetZ);
    wp.castShadow = true;
    mainGroup.add(wp);
    whiteParticleMeshes.push(wp);
    whiteInitialOffsets.push({ x: offsetX, z: offsetZ, jitter: jitterY });

    const bp = new THREE.Mesh(particleGeo, blackParticleMat);
    bp.position.set(-offsetX, -0.75 - jitterY, -offsetZ);
    bp.castShadow = true;
    mainGroup.add(bp);
    blackParticleMeshes.push(bp);
    blackInitialOffsets.push({ x: -offsetX, z: -offsetZ, jitter: -jitterY });
  }

  // 5. Electric Field Directional Vectors
  const eFieldArrows: THREE.Group[] = [];
  const shaftGeo = trackGeo(new THREE.CylinderGeometry(0.018, 0.018, 2.2, 12));
  const headGeo = trackGeo(new THREE.ConeGeometry(0.06, 0.16, 12));

  const fieldCoords: [number, number][] = [
    [-1.0, -1.0],
    [1.0, -1.0],
    [-1.0, 1.0],
    [1.0, 1.0],
  ];

  fieldCoords.forEach(([x, z]) => {
    const arrowGroup = new THREE.Group();
    arrowGroup.position.set(x, 0, z);

    const shaft = new THREE.Mesh(shaftGeo, arrowMat);
    arrowGroup.add(shaft);

    const head = new THREE.Mesh(headGeo, arrowMat);
    head.position.y = 1.1;
    arrowGroup.add(head);

    mainGroup.add(arrowGroup);
    eFieldArrows.push(arrowGroup);
  });

  const updateElectrophoresis = (voltage: number, timeSec: number) => {
    // Electrophoretic particle velocity v = μ * E
    const normV = Math.max(-1, Math.min(1, voltage / 15));
    const targetYWhite = normV >= 0 ? 0.8 : -0.8;
    const targetYBlack = normV >= 0 ? -0.8 : 0.8;
    const eink = stepEInk({ electrodeVoltageVolts: voltage, fluidViscosityCp: 2.0 }, 0);
    const jitterOmega = (eink.brownianJitterOmegaYRadPerS + eink.brownianJitterOmegaXRadPerS) / 2;

    whiteParticleMeshes.forEach((wp, idx) => {
      const init = whiteInitialOffsets[idx];
      const targetY = targetYWhite + init.jitter;
      wp.position.y += (targetY - wp.position.y) * 0.08;
      wp.position.x = init.x + Math.sin(timeSec * jitterOmega + idx) * 0.02;
      wp.position.z = init.z + Math.cos(timeSec * jitterOmega + idx) * 0.02;
    });

    blackParticleMeshes.forEach((bp, idx) => {
      const init = blackInitialOffsets[idx];
      const targetY = targetYBlack + init.jitter;
      bp.position.y += (targetY - bp.position.y) * 0.08;
      bp.position.x = init.x + Math.cos(timeSec * jitterOmega + idx) * 0.02;
      bp.position.z = init.z + Math.sin(timeSec * jitterOmega + idx) * 0.02;
    });

    // Update E-field arrow direction and intensity
    eFieldArrows.forEach((arrow) => {
      arrow.rotation.x = normV >= 0 ? 0 : Math.PI;
      arrow.visible = Math.abs(normV) > 0.05;
    });
  };

  return {
    root,
    mainGroup,
    whiteParticleMeshes,
    blackParticleMeshes,
    eFieldArrows,
    topPlate,
    bottomPlate,
    updateElectrophoresis,
    dispose: () => {
      for (const g of geometriesToDispose) g.dispose();
      for (const m of materialsToDispose) m.dispose();
    },
  };
}
