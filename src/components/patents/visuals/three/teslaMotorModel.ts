import * as THREE from "three";
import { createLcg } from "@/utils/lcg";
import { createGlowPointTexture } from "./ThreeStudioScene";

export interface TeslaMotorModel {
  rootGroup: THREE.Group;
  statorGroup: THREE.Group;
  rotorGroup: THREE.Group;
  shaftMarker: THREE.Mesh;
  /** Fig. 9 / Fig. 13 source generator, separate from disk D's motor shaft. */
  generatorGroup: THREE.Group;
  generatorCollectorRings: THREE.Mesh[];
  generatorBrushes: THREE.Mesh[];
  coilMeshes: { mesh: THREE.Mesh; phaseIdx: number; defaultEmissive: THREE.Color }[];
  fluxPoints: THREE.Points;
  fluxPositions: Float32Array;
  fluxCount: number;
  materials: {
    statorIron: THREE.MeshStandardMaterial;
    bedplateMat: THREE.MeshStandardMaterial;
    copperCoil: THREE.MeshStandardMaterial;
    diskSteel: THREE.MeshStandardMaterial;
    rotorCoreMat: THREE.MeshStandardMaterial;
    shaftSteel: THREE.MeshStandardMaterial;
    brassTrim: THREE.MeshStandardMaterial;
    terminalWood: THREE.MeshStandardMaterial;
    fluxMat: THREE.PointsMaterial;
  };
  dispose: () => void;
}

export function buildTeslaMotorModel(phaseCount: 2 | 3 = 2): TeslaMotorModel {
  const lcg = createLcg(1888);
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

  const diskSteel = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.32,
    metalness: 0.78,
  });
  materialsToDispose.push(diskSteel);

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

  // --- 3. FIG. 9 MAGNETIC DISK AND SHAFT ---
  const rotorGroup = new THREE.Group();
  rootGroup.add(rotorGroup);

  // Fig. 9 labels D as a magnetic disk mounted freely inside ring R.
  const rotorCoreGeo = new THREE.CylinderGeometry(2.65, 2.65, 0.55, 32);
  geometriesToDispose.push(rotorCoreGeo);
  const rotorCore = new THREE.Mesh(rotorCoreGeo, rotorCoreMat);
  rotorCore.castShadow = true;
  rotorCore.receiveShadow = true;
  rotorGroup.add(rotorCore);

  // The drawing gives D an axis a, not a later industrial output rotor.
  const shaftGeo = new THREE.CylinderGeometry(0.18, 0.18, 5.2, 24);
  geometriesToDispose.push(shaftGeo);
  const shaft = new THREE.Mesh(shaftGeo, shaftSteel);
  shaft.rotation.x = Math.PI / 2;
  rotorGroup.add(shaft);

  // Two opposite cutaways echo the outline shown for D on Fig. 9.
  const cutawayGeo = new THREE.BoxGeometry(1.2, 0.62, 1.55);
  geometriesToDispose.push(cutawayGeo);
  for (const x of [-2.45, 2.45]) {
    const cutaway = new THREE.Mesh(cutawayGeo, statorIron);
    cutaway.position.set(x, 0, 0);
    rotorGroup.add(cutaway);
  }

  const markerGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.16, 20);
  geometriesToDispose.push(markerGeo);
  const shaftMarker = new THREE.Mesh(markerGeo, diskSteel);
  shaftMarker.position.y = 0.38;
  rotorGroup.add(shaftMarker);

  // --- 3a. SOURCE GENERATOR, COLLECTOR RINGS, AND BRUSHES ---
  // Fig. 9 prints two generator coils B/B′ and four insulated rings b b b′ b′.
  // Fig. 13 is the distinct three-circuit comparison with three coils K/K′/K″
  // and six rings e e e′ e′ e″ e″. These are collector rings on the generator,
  // not a commutator on the motor.
  const generatorGroup = new THREE.Group();
  generatorGroup.position.set(7.3, 0, 0);
  rootGroup.add(generatorGroup);

  const generatorYokeGeo = new THREE.BoxGeometry(1.05, 5.4, 5.1);
  geometriesToDispose.push(generatorYokeGeo);
  const generatorYoke = new THREE.Mesh(generatorYokeGeo, statorIron);
  generatorYoke.position.x = 1.35;
  generatorGroup.add(generatorYoke);

  const generatorArmatureGeo = new THREE.CylinderGeometry(1.35, 1.35, 3.25, 28);
  geometriesToDispose.push(generatorArmatureGeo);
  const generatorArmature = new THREE.Mesh(generatorArmatureGeo, copperCoil);
  generatorArmature.rotation.z = Math.PI / 2;
  generatorArmature.position.x = -0.15;
  generatorGroup.add(generatorArmature);

  const generatorShaftGeo = new THREE.CylinderGeometry(0.18, 0.18, 6.2, 16);
  geometriesToDispose.push(generatorShaftGeo);
  const generatorShaft = new THREE.Mesh(generatorShaftGeo, shaftSteel);
  generatorShaft.rotation.z = Math.PI / 2;
  generatorShaft.position.x = -0.85;
  generatorGroup.add(generatorShaft);

  const generatorCollectorRings: THREE.Mesh[] = [];
  const generatorBrushes: THREE.Mesh[] = [];
  const ringGeo = new THREE.TorusGeometry(0.39, 0.07, 8, 18);
  const brushGeo = new THREE.BoxGeometry(0.26, 0.38, 0.18);
  geometriesToDispose.push(ringGeo, brushGeo);
  const circuitCount = phaseCount === 2 ? 2 : 3;
  for (let ringIndex = 0; ringIndex < circuitCount * 2; ringIndex++) {
    const ring = new THREE.Mesh(ringGeo, brassTrim);
    ring.rotation.y = Math.PI / 2;
    ring.position.set(-2.5 + ringIndex * 0.28, 0, 0);
    generatorGroup.add(ring);
    generatorCollectorRings.push(ring);

    const brush = new THREE.Mesh(brushGeo, bedplateMat);
    brush.position.set(-2.5 + ringIndex * 0.28, 0.5, 0);
    generatorGroup.add(brush);
    generatorBrushes.push(brush);
  }

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
    shaftMarker,
    generatorGroup,
    generatorCollectorRings,
    generatorBrushes,
    coilMeshes,
    fluxPoints,
    fluxPositions,
    fluxCount,
    materials: {
      statorIron,
      bedplateMat,
      copperCoil,
      diskSteel,
      rotorCoreMat,
      shaftSteel,
      brassTrim,
      terminalWood,
      fluxMat,
    },
    dispose,
  };
}

/**
 * Updates Tesla induction motor rotor rotation, phase coil energization glow, magnetic flux field streamlines, and cutaway.
 */
export function updateTeslaMotorKinematics(
  model: TeslaMotorModel,
  delta: number,
  omegaDisplay: number,
  bFieldAngle: number,
  activePhaseCount: 2 | 3,
  showMagneticFlux: boolean,
  isCutaway = false,
): void {
  model.rotorGroup.rotation.y += omegaDisplay * delta;

  for (const item of model.coilMeshes) {
    const phaseOffset = item.phaseIdx * (activePhaseCount === 2 ? Math.PI / 2 : (2 * Math.PI) / 3);
    const currentI = Math.sin(bFieldAngle + phaseOffset);
    const mat = item.mesh.material as THREE.MeshStandardMaterial;
    mat.emissive = new THREE.Color(0xf59e0b);
    mat.emissiveIntensity = Math.abs(currentI) * 0.9;
  }

  const fPos = model.fluxPositions;
  for (let i = 0; i < model.fluxCount; i++) {
    const idx = i * 3;
    const x = fPos[idx];
    const z = fPos[idx + 2];
    const r = Math.sqrt(x * x + z * z);
    let curAngle = Math.atan2(z, x);
    curAngle += omegaDisplay * delta;

    fPos[idx] = Math.cos(curAngle) * r;
    fPos[idx + 2] = Math.sin(curAngle) * r;
  }
  model.fluxPoints.geometry.attributes.position.needsUpdate = true;
  model.fluxPoints.visible = showMagneticFlux;

  // Cutaway transparency for stator and bedplate
  model.materials.statorIron.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.statorIron.transparent = isCutaway;
  model.materials.bedplateMat.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.bedplateMat.transparent = isCutaway;
}
