import * as THREE from "three";
import { createGlowPointTexture } from "./ThreeStudioScene";
import { createLcg } from "@/utils/lcg";

const lcg = createLcg(1888);

export interface TeslaMotorModel {
  rootGroup: THREE.Group;
  statorGroup: THREE.Group;
  rotorGroup: THREE.Group;
  drivePulley: THREE.Mesh;
  coilMeshes: { mesh: THREE.Mesh; phaseIdx: number; defaultEmissive: THREE.Color }[];
  fluxPoints: THREE.Points;
  fluxPositions: Float32Array;
  fluxCount: number;
  materials: {
    statorIron: THREE.MeshStandardMaterial;
    bedplateMat: THREE.MeshStandardMaterial;
    copperCoil: THREE.MeshStandardMaterial;
    copperRotorBar: THREE.MeshStandardMaterial;
    rotorCoreMat: THREE.MeshStandardMaterial;
    shaftSteel: THREE.MeshStandardMaterial;
    brassTrim: THREE.MeshStandardMaterial;
    terminalWood: THREE.MeshStandardMaterial;
    fluxMat: THREE.PointsMaterial;
  };
  dispose: () => void;
}

export function buildTeslaMotorModel(phaseCount: 2 | 3 = 2): TeslaMotorModel {
  const rootGroup = new THREE.Group();
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const texturesToDispose: THREE.Texture[] = [];

  // --- 1. PBR MATERIALS ---
  const statorIron = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.35,
    metalness: 0.85,
  });
  materialsToDispose.push(statorIron);

  const bedplateMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.6,
    metalness: 0.75,
  });
  materialsToDispose.push(bedplateMat);

  const copperCoil = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.25,
    metalness: 0.85,
  });
  materialsToDispose.push(copperCoil);

  const copperRotorBar = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.15,
    metalness: 0.95,
  });
  materialsToDispose.push(copperRotorBar);

  const rotorCoreMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.4,
    metalness: 0.65,
  });
  materialsToDispose.push(rotorCoreMat);

  const shaftSteel = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.08,
    metalness: 0.95,
  });
  materialsToDispose.push(shaftSteel);

  const brassTrim = new THREE.MeshStandardMaterial({
    color: 0xc8963e,
    roughness: 0.22,
    metalness: 0.92,
  });
  materialsToDispose.push(brassTrim);

  const terminalWood = new THREE.MeshStandardMaterial({
    color: 0x78350f,
    roughness: 0.55,
    metalness: 0.05,
  });
  materialsToDispose.push(terminalWood);

  // --- 2. STATOR & INDUSTRIAL CAST-IRON CHASSIS ---
  const statorGroup = new THREE.Group();
  rootGroup.add(statorGroup);

  // Heavy Cast-Iron Bedplate
  const bedplateGeo = new THREE.BoxGeometry(11.2, 0.75, 7.6);
  geometriesToDispose.push(bedplateGeo);
  const bedplate = new THREE.Mesh(bedplateGeo, bedplateMat);
  bedplate.position.y = -4.2;
  bedplate.receiveShadow = true;
  statorGroup.add(bedplate);

  // 4 Anchor Bosses with Hex Hold-Down Bolts
  const bossPositions: [number, number][] = [
    [-4.8, -3.0],
    [4.8, -3.0],
    [-4.8, 3.0],
    [4.8, 3.0],
  ];
  const bossGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.4, 16);
  geometriesToDispose.push(bossGeo);
  const boltGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.35, 6);
  geometriesToDispose.push(boltGeo);

  for (const [bx, bz] of bossPositions) {
    const boss = new THREE.Mesh(bossGeo, statorIron);
    boss.position.set(bx, -3.7, bz);
    statorGroup.add(boss);

    const bolt = new THREE.Mesh(boltGeo, shaftSteel);
    bolt.position.set(bx, -3.4, bz);
    statorGroup.add(bolt);
  }

  // Fore and Aft Pillow Block Bearing Pedestals
  const pedBaseGeo = new THREE.BoxGeometry(3.2, 3.8, 0.85);
  geometriesToDispose.push(pedBaseGeo);
  const bushingGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.98, 24);
  geometriesToDispose.push(bushingGeo);
  const oilCupGeo = new THREE.CylinderGeometry(0.18, 0.14, 0.45, 12);
  geometriesToDispose.push(oilCupGeo);

  [-3.8, 3.8].forEach((pedZ) => {
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.set(0, -1.8, pedZ);

    const pedBase = new THREE.Mesh(pedBaseGeo, statorIron);
    pedBase.position.y = -1.2;
    pedBase.castShadow = true;
    pedestalGroup.add(pedBase);

    const bushing = new THREE.Mesh(bushingGeo, brassTrim);
    bushing.rotation.x = Math.PI / 2;
    bushing.castShadow = true;
    pedestalGroup.add(bushing);

    const oilCup = new THREE.Mesh(oilCupGeo, brassTrim);
    oilCup.position.set(0, 0.95, 0);
    pedestalGroup.add(oilCup);

    statorGroup.add(pedestalGroup);
  });

  // Stator Outer Ring Core
  const statorGeo = new THREE.CylinderGeometry(5.2, 5.2, 3.8, 48, 1, true);
  geometriesToDispose.push(statorGeo);
  const statorMesh = new THREE.Mesh(statorGeo, statorIron);
  statorMesh.castShadow = true;
  statorMesh.receiveShadow = true;
  statorGroup.add(statorMesh);

  // Stator Lamination Stack Rings
  const lamRingGeo = new THREE.TorusGeometry(5.22, 0.04, 8, 48);
  geometriesToDispose.push(lamRingGeo);
  for (let l = 0; l < 8; l++) {
    const lamRing = new THREE.Mesh(lamRingGeo, bedplateMat);
    lamRing.rotation.x = Math.PI / 2;
    lamRing.position.y = -1.6 + l * 0.46;
    statorGroup.add(lamRing);
  }

  // 4 Stator Through-Bolts with Hex Nuts
  const rodGeo = new THREE.CylinderGeometry(0.08, 0.08, 4.4, 8);
  geometriesToDispose.push(rodGeo);
  const nutGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.18, 6);
  geometriesToDispose.push(nutGeo);

  for (let tb = 0; tb < 4; tb++) {
    const tbAngle = (tb * Math.PI) / 2 + Math.PI / 4;
    const tbX = Math.cos(tbAngle) * 5.0;
    const tbZ = Math.sin(tbAngle) * 5.0;
    const rod = new THREE.Mesh(rodGeo, shaftSteel);
    rod.position.set(tbX, 0, tbZ);
    statorGroup.add(rod);

    [-2.15, 2.15].forEach((nutY) => {
      const nut = new THREE.Mesh(nutGeo, shaftSteel);
      nut.position.set(tbX, nutY, tbZ);
      statorGroup.add(nut);
    });
  }

  // Terminal Board with Brass Binding Posts
  const termBoardGeo = new THREE.BoxGeometry(2.4, 1.2, 0.35);
  geometriesToDispose.push(termBoardGeo);
  const termBoard = new THREE.Mesh(termBoardGeo, terminalWood);
  termBoard.position.set(0, 3.8, 4.2);
  statorGroup.add(termBoard);

  const postGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.35, 12);
  geometriesToDispose.push(postGeo);
  for (let post = 0; post < 4; post++) {
    const postMesh = new THREE.Mesh(postGeo, brassTrim);
    postMesh.rotation.x = Math.PI / 2;
    postMesh.position.set(-0.75 + post * 0.5, 3.8, 4.45);
    statorGroup.add(postMesh);
  }

  // Salient Stator Poles & Copper Windings
  const numPoles = phaseCount === 2 ? 4 : 6;
  const coilMeshes: { mesh: THREE.Mesh; phaseIdx: number; defaultEmissive: THREE.Color }[] = [];

  const poleIronGeo = new THREE.BoxGeometry(1.6, 3.2, 1.4);
  geometriesToDispose.push(poleIronGeo);
  const coilGeo = new THREE.BoxGeometry(1.9, 2.6, 1.8);
  geometriesToDispose.push(coilGeo);

  for (let p = 0; p < numPoles; p++) {
    const angle = (p * (2 * Math.PI)) / numPoles;
    const poleGroup = new THREE.Group();
    poleGroup.position.set(Math.cos(angle) * 3.8, 0, Math.sin(angle) * 3.8);
    poleGroup.rotation.y = -angle + Math.PI / 2;

    const poleIron = new THREE.Mesh(poleIronGeo, statorIron);
    poleIron.castShadow = true;
    poleGroup.add(poleIron);

    const coilMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.25,
      metalness: 0.85,
      emissive: new THREE.Color(0x000000),
    });
    materialsToDispose.push(coilMat);

    const coilMesh = new THREE.Mesh(coilGeo, coilMat);
    coilMesh.castShadow = true;
    poleGroup.add(coilMesh);

    coilMeshes.push({
      mesh: coilMesh,
      phaseIdx: p % phaseCount,
      defaultEmissive: new THREE.Color(0x000000),
    });
    statorGroup.add(poleGroup);
  }

  // --- 3. ROTOR & SQUIRREL CAGE ARMATURE ---
  const rotorGroup = new THREE.Group();
  rootGroup.add(rotorGroup);

  // Laminated Iron Rotor Cylinder Core
  const rotorCoreGeo = new THREE.CylinderGeometry(2.45, 2.45, 3.4, 32);
  geometriesToDispose.push(rotorCoreGeo);
  const rotorCore = new THREE.Mesh(rotorCoreGeo, rotorCoreMat);
  rotorCore.castShadow = true;
  rotorCore.receiveShadow = true;
  rotorGroup.add(rotorCore);

  // Polished Drive Shaft with Keyway Slot
  const shaftGeo = new THREE.CylinderGeometry(0.55, 0.55, 9.8, 24);
  geometriesToDispose.push(shaftGeo);
  const shaft = new THREE.Mesh(shaftGeo, shaftSteel);
  shaft.rotation.x = Math.PI / 2;
  rotorGroup.add(shaft);

  // Embedded Copper Conductive Bars (Squirrel Cage)
  const barCount = 18;
  const barGeo = new THREE.CylinderGeometry(0.09, 0.09, 3.5, 12);
  geometriesToDispose.push(barGeo);

  for (let b = 0; b < barCount; b++) {
    const bAngle = (b * Math.PI * 2) / barCount;
    const bar = new THREE.Mesh(barGeo, copperRotorBar);
    bar.position.set(Math.cos(bAngle) * 2.38, 0, Math.sin(bAngle) * 2.38);
    bar.castShadow = true;
    rotorGroup.add(bar);
  }

  // Heavy Copper Short-Circuiting End-Rings
  const endRingGeo = new THREE.TorusGeometry(2.38, 0.14, 12, 36);
  geometriesToDispose.push(endRingGeo);
  [-1.75, 1.75].forEach((ey) => {
    const endRing = new THREE.Mesh(endRingGeo, copperRotorBar);
    endRing.rotation.x = Math.PI / 2;
    endRing.position.y = ey;
    endRing.castShadow = true;
    rotorGroup.add(endRing);
  });

  // Output Cast-Iron Belt Pulley
  const pulleyGeo = new THREE.CylinderGeometry(1.6, 1.6, 1.2, 32);
  geometriesToDispose.push(pulleyGeo);
  const drivePulley = new THREE.Mesh(pulleyGeo, statorIron);
  drivePulley.rotation.x = Math.PI / 2;
  drivePulley.position.z = 4.2;
  drivePulley.castShadow = true;
  rotorGroup.add(drivePulley);

  // --- 4. MAGNETIC FLUX FIELD STREAMLINES ---
  const fluxCount = 160;
  const fluxGeo = new THREE.BufferGeometry();
  geometriesToDispose.push(fluxGeo);
  const fluxPositions = new Float32Array(fluxCount * 3);
  const fluxColors = new Float32Array(fluxCount * 3);
  const glowTex = createGlowPointTexture();
  texturesToDispose.push(glowTex);

  for (let i = 0; i < fluxCount; i++) {
    const idx = i * 3;
    const r = 2.6 + lcg() * 1.8;
    const a = lcg() * Math.PI * 2;
    fluxPositions[idx] = Math.cos(a) * r;
    fluxPositions[idx + 1] = (lcg() - 0.5) * 3.0;
    fluxPositions[idx + 2] = Math.sin(a) * r;

    fluxColors[idx] = 0.22;
    fluxColors[idx + 1] = 0.74;
    fluxColors[idx + 2] = 0.98;
  }

  fluxGeo.setAttribute("position", new THREE.BufferAttribute(fluxPositions, 3));
  fluxGeo.setAttribute("color", new THREE.BufferAttribute(fluxColors, 3));

  const fluxMat = new THREE.PointsMaterial({
    size: 0.32,
    map: glowTex,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  materialsToDispose.push(fluxMat);

  const fluxPoints = new THREE.Points(fluxGeo, fluxMat);
  statorGroup.add(fluxPoints);

  const dispose = () => {
    for (const geo of geometriesToDispose) geo.dispose();
    for (const mat of materialsToDispose) mat.dispose();
    for (const tex of texturesToDispose) tex.dispose();
  };

  return {
    rootGroup,
    statorGroup,
    rotorGroup,
    drivePulley,
    coilMeshes,
    fluxPoints,
    fluxPositions,
    fluxCount,
    materials: {
      statorIron,
      bedplateMat,
      copperCoil,
      copperRotorBar,
      rotorCoreMat,
      shaftSteel,
      brassTrim,
      terminalWood,
      fluxMat,
    },
    dispose,
  };
}
