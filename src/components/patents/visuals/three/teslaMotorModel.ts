import * as THREE from "three";
import { gaMotorFrameIndex, gaMotorOrbit } from "@/physics/genericWasm";
import { stepTeslaMotorFig9 } from "@/physics/teslaKernel";
import { createLcg } from "@/utils/lcg";
import { createGlowPointTexture } from "./ThreeStudioScene";

/**
 * Museum-Grade Procedural 3D Model for Nikola Tesla's Electro-Magnetic Motor (US 381,968).
 * Models the source-bounded Fig. 9 apparatus: annular ring R with coils C/C′,
 * magnetic disk D, generator G with coils B/B′, and its four collector rings and brushes.
 */
export interface TeslaMotorModel {
  rootGroup: THREE.Group;
  statorGroup: THREE.Group;
  rotorGroup: THREE.Group;
  shaftMarker: THREE.Mesh;
  generatorGroup: THREE.Group;
  generatorCollectorRings: THREE.Mesh[];
  generatorBrushes: THREE.Mesh[];
  coilMeshes: { mesh: THREE.Mesh; phaseIdx: number; defaultEmissive?: THREE.Color }[];
  fluxPoints: THREE.Points;
  fluxPositions: Float32Array;
  fluxCount: number;
  materials: {
    annulusIron: THREE.MeshStandardMaterial;
    statorIron: THREE.MeshStandardMaterial;
    bedplateMat: THREE.MeshStandardMaterial;
    copperCoil: THREE.MeshStandardMaterial;
    insulatedWire: THREE.MeshStandardMaterial;
    magneticDisk: THREE.MeshStandardMaterial;
    rotorCoreMat: THREE.MeshStandardMaterial;
    shaftSteel: THREE.MeshStandardMaterial;
    contactRing: THREE.MeshStandardMaterial;
    brassTrim: THREE.MeshStandardMaterial;
    terminalWood: THREE.MeshStandardMaterial;
    collector: THREE.MeshStandardMaterial;
    fluxMat: THREE.PointsMaterial;
  };
  setCutaway?: (cutaway: boolean) => void;
  dispose: () => void;
}

export function buildTeslaMotorModel(): TeslaMotorModel {
  const lcg = createLcg(1888);
  const rootGroup = new THREE.Group();
  rootGroup.name = "US 381,968 Fig. 9 Electro-Magnetic Motor";

  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const texturesToDispose: THREE.Texture[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    geometriesToDispose.push(geo);
    return geo;
  };

  const trackMat = <T extends THREE.Material>(mat: T): T => {
    materialsToDispose.push(mat);
    return mat;
  };

  // --- 1. PBR MATERIALS ---
  const statorIron = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.35,
      metalness: 0.85,
    }),
  );
  const annulusIron = statorIron;

  const bedplateMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.6,
      metalness: 0.75,
    }),
  );

  const copperCoil = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.25,
      metalness: 0.85,
    }),
  );
  const insulatedWire = copperCoil;

  const magneticDisk = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.35,
      metalness: 0.72,
    }),
  );

  // Retained as a disposable palette slot for the model contract; Fig. 9's
  // visible rotating member is the source-described magnetic disk D.
  const rotorCoreMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.42,
      metalness: 0.65,
    }),
  );

  const shaftSteel = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.08,
      metalness: 0.95,
    }),
  );

  const contactRing = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xc8963e,
      roughness: 0.22,
      metalness: 0.92,
    }),
  );
  const brassTrim = contactRing;

  const terminalWood = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.55,
      metalness: 0.05,
    }),
  );

  const collector = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.65,
      metalness: 0.3,
    }),
  );

  // --- 2. STATOR & INDUSTRIAL CAST-IRON CHASSIS ---
  const statorGroup = new THREE.Group();
  statorGroup.name = "R annulus and C/C-prime coils";
  rootGroup.add(statorGroup);

  // Heavy Cast-Iron Bedplate with Mounting Flanges
  const bedplateGeo = trackGeo(new THREE.BoxGeometry(11.4, 0.75, 7.8));
  const bedplate = new THREE.Mesh(bedplateGeo, bedplateMat);
  bedplate.position.y = -4.2;
  bedplate.receiveShadow = true;
  statorGroup.add(bedplate);

  // 4 Anchor Bosses with Hexagonal Hold-Down Bolts
  const bossPositions: [number, number][] = [
    [-4.8, -3.0],
    [4.8, -3.0],
    [-4.8, 3.0],
    [4.8, 3.0],
  ];
  const bossGeo = trackGeo(new THREE.CylinderGeometry(0.35, 0.4, 0.4, 16));
  const boltGeo = trackGeo(new THREE.CylinderGeometry(0.14, 0.14, 0.35, 6));

  for (const [bx, bz] of bossPositions) {
    const boss = new THREE.Mesh(bossGeo, statorIron);
    boss.position.set(bx, -3.7, bz);
    statorGroup.add(boss);

    const bolt = new THREE.Mesh(boltGeo, shaftSteel);
    bolt.position.set(bx, -3.4, bz);
    statorGroup.add(bolt);
  }

  // Twin Cast-Iron Pillow Block Bearing Pedestals (Fore & Aft)
  const pedBaseGeo = trackGeo(new THREE.BoxGeometry(3.2, 3.8, 0.8));
  const bushingGeo = trackGeo(new THREE.CylinderGeometry(0.72, 0.72, 0.95, 24));
  const oilCupGeo = trackGeo(new THREE.CylinderGeometry(0.18, 0.14, 0.45, 12));

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

    const oilCup = new THREE.Mesh(oilCupGeo, contactRing);
    oilCup.position.set(0, 0.95, 0);
    pedestalGroup.add(oilCup);

    statorGroup.add(pedestalGroup);
  });

  // Stator Outer Ring Core (Annulus R)
  const annulusGeo = trackGeo(new THREE.CylinderGeometry(5.2, 5.2, 3.6, 48, 1, true));
  const annulusMesh = new THREE.Mesh(annulusGeo, statorIron);
  annulusMesh.castShadow = true;
  annulusMesh.receiveShadow = true;
  statorGroup.add(annulusMesh);

  // Insulated ring bands represented in the source's annulus R.
  const lamRingGeo = trackGeo(new THREE.TorusGeometry(5.22, 0.04, 8, 48));
  for (let l = 0; l < 8; l++) {
    const lamRing = new THREE.Mesh(lamRingGeo, collector);
    lamRing.rotation.x = Math.PI / 2;
    lamRing.position.y = -1.5 + l * 0.43;
    statorGroup.add(lamRing);
  }

  // 4 Longitudinal Stator Through-Bolts with Hex Nuts
  const throughRodGeo = trackGeo(new THREE.CylinderGeometry(0.08, 0.08, 4.4, 8));
  const throughNutGeo = trackGeo(new THREE.CylinderGeometry(0.16, 0.16, 0.18, 6));

  for (let tb = 0; tb < 4; tb++) {
    const tbAngle = (tb * Math.PI) / 2 + Math.PI / 4;
    const tbX = Math.cos(tbAngle) * 5.0;
    const tbZ = Math.sin(tbAngle) * 5.0;
    const rod = new THREE.Mesh(throughRodGeo, shaftSteel);
    rod.position.set(tbX, 0, tbZ);
    statorGroup.add(rod);

    [-2.0, 2.0].forEach((nutY) => {
      const nut = new THREE.Mesh(throughNutGeo, shaftSteel);
      nut.position.set(tbX, nutY, tbZ);
      statorGroup.add(nut);
    });
  }

  // Terminal Connection Board with Knurled Brass Binding Posts
  const termBoardGeo = trackGeo(new THREE.BoxGeometry(2.4, 1.2, 0.35));
  const termBoard = new THREE.Mesh(termBoardGeo, terminalWood);
  termBoard.position.set(0, 3.8, 4.2);
  statorGroup.add(termBoard);

  const postGeo = trackGeo(new THREE.CylinderGeometry(0.12, 0.12, 0.35, 12));
  for (let post = 0; post < 4; post++) {
    const postMesh = new THREE.Mesh(postGeo, contactRing);
    postMesh.rotation.x = Math.PI / 2;
    postMesh.position.set(-0.75 + post * 0.5, 3.8, 4.45);
    statorGroup.add(postMesh);
  }

  // Salient Stator Poles & Copper Windings (C, C, C', C')
  const numPoles = 4;
  const coilMeshes: { mesh: THREE.Mesh; phaseIdx: number; defaultEmissive?: THREE.Color }[] = [];

  const poleIronGeo = trackGeo(new THREE.BoxGeometry(1.5, 2.8, 1.3));
  const coilGeo = trackGeo(new THREE.BoxGeometry(1.8, 2.2, 1.6));

  for (let p = 0; p < numPoles; p++) {
    const angle = (p * (2 * Math.PI)) / numPoles;
    const poleGroup = new THREE.Group();
    poleGroup.position.set(Math.cos(angle) * 3.85, 0, Math.sin(angle) * 3.85);
    poleGroup.rotation.y = -angle + Math.PI / 2;

    const poleIron = new THREE.Mesh(poleIronGeo, statorIron);
    poleIron.castShadow = true;
    poleGroup.add(poleIron);

    const coilMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.25,
        metalness: 0.85,
        emissive: new THREE.Color(0x000000),
      }),
    );
    const coilMesh = new THREE.Mesh(coilGeo, coilMat);
    coilMesh.castShadow = true;
    poleGroup.add(coilMesh);

    coilMeshes.push({
      mesh: coilMesh,
      phaseIdx: p % 2,
      defaultEmissive: new THREE.Color(0x000000),
    });
    statorGroup.add(poleGroup);
  }

  // --- 3. FIG. 9 MAGNETIC DISK D ON AXIS a ---
  const rotorGroup = new THREE.Group();
  rotorGroup.name = "D magnetic disk on axis a";
  rootGroup.add(rotorGroup);

  // Polished Drive Shaft (axis a)
  const shaftGeo = trackGeo(new THREE.CylinderGeometry(0.35, 0.35, 9.6, 24));
  const shaft = new THREE.Mesh(shaftGeo, shaftSteel);
  shaft.rotation.x = Math.PI / 2;
  shaft.castShadow = true;
  rotorGroup.add(shaft);

  // Fig. 9 Disk D and Opposite Peripheral Cutaways
  const diskGeo = trackGeo(new THREE.CylinderGeometry(2.55, 2.55, 0.5, 32));
  const diskMesh = new THREE.Mesh(diskGeo, magneticDisk);
  diskMesh.castShadow = true;
  rotorGroup.add(diskMesh);

  const markerGeo = trackGeo(new THREE.CylinderGeometry(0.38, 0.38, 0.14, 20));
  const shaftMarker = new THREE.Mesh(markerGeo, magneticDisk);
  shaftMarker.position.y = 0.32;
  rotorGroup.add(shaftMarker);

  // --- 4. SOURCE GENERATOR G, COLLECTOR RINGS, AND BRUSHES ---
  // Fig. 9 prints generator G with coils B/B' and collector rings b/b'
  const generatorGroup = new THREE.Group();
  generatorGroup.name = "G generator with B/B-prime and b/b-prime";
  generatorGroup.position.set(7.4, 0, 0);
  rootGroup.add(generatorGroup);

  const fieldGeo = trackGeo(new THREE.BoxGeometry(1.05, 5.0, 4.8));
  const field = new THREE.Mesh(fieldGeo, statorIron);
  field.position.x = 1.25;
  generatorGroup.add(field);

  const armatureGeo = trackGeo(new THREE.CylinderGeometry(1.25, 1.25, 3.0, 28));
  const armature = new THREE.Mesh(armatureGeo, copperCoil);
  armature.rotation.z = Math.PI / 2;
  armature.position.x = -0.1;
  generatorGroup.add(armature);

  const generatorShaftGeo = trackGeo(new THREE.CylinderGeometry(0.16, 0.16, 6.0, 16));
  const generatorShaft = new THREE.Mesh(generatorShaftGeo, shaftSteel);
  generatorShaft.rotation.z = Math.PI / 2;
  generatorShaft.position.x = -0.8;
  generatorGroup.add(generatorShaft);

  const generatorCollectorRings: THREE.Mesh[] = [];
  const generatorBrushes: THREE.Mesh[] = [];
  const ringGeo = trackGeo(new THREE.TorusGeometry(0.38, 0.065, 8, 18));
  const brushGeo = trackGeo(new THREE.BoxGeometry(0.24, 0.35, 0.16));

  const ringCount = 4;
  for (let index = 0; index < ringCount; index++) {
    const ring = new THREE.Mesh(ringGeo, contactRing);
    ring.rotation.y = Math.PI / 2;
    ring.position.set(-2.4 + index * 0.28, 0, 0);
    generatorGroup.add(ring);
    generatorCollectorRings.push(ring);

    const brush = new THREE.Mesh(brushGeo, collector);
    brush.position.set(-2.4 + index * 0.28, 0.48, 0);
    generatorGroup.add(brush);
    generatorBrushes.push(brush);
  }

  // L/L': Connecting conductors between motor and generator
  const conductorMat = trackMat(new THREE.LineBasicMaterial({ color: 0x94a3b8 }));
  for (const y of [-1.15, -0.4, 0.4, 1.15]) {
    const points = [
      new THREE.Vector3(3.9, y, -3.3),
      new THREE.Vector3(5.3, y, -3.3),
      new THREE.Vector3(5.3, y, 0),
      new THREE.Vector3(4.85, y, 0),
    ];
    const conductorGeo = trackGeo(new THREE.BufferGeometry().setFromPoints(points));
    rootGroup.add(new THREE.Line(conductorGeo, conductorMat));
  }

  // --- 5. GLOWING ROTATING MAGNETIC FLUX FIELD PARTICLES ---
  const fluxCount = 180;
  const fluxGeo = trackGeo(new THREE.BufferGeometry());
  const fluxPositions = new Float32Array(fluxCount * 3);
  const fluxColors = new Float32Array(fluxCount * 3);
  const glowTex = createGlowPointTexture();
  texturesToDispose.push(glowTex);

  for (let index = 0; index < fluxCount; index++) {
    const offset = index * 3;
    const radius = 2.6 + lcg() * 1.8;
    const angle = lcg() * Math.PI * 2;
    fluxPositions[offset] = Math.cos(angle) * radius;
    fluxPositions[offset + 1] = (lcg() - 0.5) * 2.8;
    fluxPositions[offset + 2] = Math.sin(angle) * radius;
    fluxColors[offset] = 0.2;
    fluxColors[offset + 1] = 0.74;
    fluxColors[offset + 2] = 1.0;
  }

  fluxGeo.setAttribute("position", new THREE.BufferAttribute(fluxPositions, 3));
  fluxGeo.setAttribute("color", new THREE.BufferAttribute(fluxColors, 3));

  const fluxMat = trackMat(
    new THREE.PointsMaterial({
      size: 0.35,
      map: glowTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  const fluxPoints = new THREE.Points(fluxGeo, fluxMat);
  statorGroup.add(fluxPoints);

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
      annulusIron,
      statorIron,
      bedplateMat,
      copperCoil,
      insulatedWire,
      magneticDisk,
      rotorCoreMat,
      shaftSteel,
      contactRing,
      brassTrim,
      terminalWood,
      collector,
      fluxMat,
    },
    setCutaway: (cutaway: boolean) => {
      statorIron.transparent = cutaway;
      statorIron.opacity = cutaway ? 0.35 : 1.0;
      statorIron.needsUpdate = true;
    },
    dispose: () => {
      for (const geometry of geometriesToDispose) geometry.dispose();
      for (const material of materialsToDispose) material.dispose();
      for (const texture of texturesToDispose) texture.dispose();
    },
  };
}

export function updateTeslaMotorKinematics(
  model: TeslaMotorModel,
  delta: number,
  omegaDisplay: number,
  bFieldAngle: number,
  showMagneticFlux: boolean,
  fieldTimeSec = 0,
): void {
  const tesla = stepTeslaMotorFig9(60);
  model.rotorGroup.rotation.y += omegaDisplay * delta;

  for (const item of model.coilMeshes) {
    const phaseOffset = item.phaseIdx * tesla.coilPhaseOffsetRad;
    const current = Math.sin(bFieldAngle + phaseOffset);
    const material = item.mesh.material as THREE.MeshStandardMaterial;
    material.emissive = new THREE.Color(tesla.coilEmissiveHex);
    material.emissiveIntensity = Math.abs(current) * tesla.coilEmissiveAmp;
  }

  const orbit = gaMotorOrbit(model.fluxCount, 60);
  const frame = gaMotorFrameIndex(fieldTimeSec, omegaDisplay, 60);
  const base = 2 + frame * model.fluxCount * 3;

  for (let index = 0; index < model.fluxCount; index++) {
    const src = base + index * 3;
    const dst = index * 3;
    const x = orbit[src] ?? 0;
    const y = orbit[src + 1] ?? 0;
    const z = orbit[src + 2] ?? 0;
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) continue;
    model.fluxPositions[dst] = (x - 1) * 2.8;
    model.fluxPositions[dst + 1] = z * 0.45;
    model.fluxPositions[dst + 2] = y * 2.8;
  }

  model.fluxPoints.geometry.attributes.position.needsUpdate = true;
  model.fluxPoints.visible = showMagneticFlux;
}
