import * as THREE from "three";
import { stepWhitneyCottonGin } from "@/physics/catalogKernels";
import { createLcg } from "@/utils/lcg";
import { createGlowPointTexture } from "./ThreeStudioScene";

export interface WhitneyCottonGinModel {
  rootGroup: THREE.Group;
  frameGroup: THREE.Group;
  grateGroup: THREE.Group;
  sawCylinderGroup: THREE.Group;
  brushCylinderGroup: THREE.Group;
  crankGroup: THREE.Group;
  drivePulleyGroup: THREE.Group;
  fiberPoints: THREE.Points;
  fiberPositions: Float32Array;
  fiberCount: number;
  seedsGroup: THREE.Group;
  materials: {
    walnutWood: THREE.MeshStandardMaterial;
    ironSaw: THREE.MeshStandardMaterial;
    brassGrate: THREE.MeshStandardMaterial;
    brushBristles: THREE.MeshStandardMaterial;
    shaftSteel: THREE.MeshStandardMaterial;
    cottonFiberMat: THREE.PointsMaterial;
    seedMat: THREE.MeshStandardMaterial;
  };
  dispose: () => void;
}

/**
 * Deterministic unit noise for procedural grain generation.
 */
function deterministicUnit(index: number, channel: number): number {
  const sample = Math.sin((index + 1) * 12.9898 + (channel + 1) * 78.233) * 43758.5453;
  return sample - Math.floor(sample);
}

/**
 * Procedural 18th-Century Hand-Hewn American Walnut/Chestnut Timber Texture
 */
function createTimberTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  // Rustic dark walnut timber brown
  ctx.fillStyle = "#4e2712";
  ctx.fillRect(0, 0, 512, 512);

  // Longitudinal coarse wood grain & growth rings
  for (let i = 0; i < 90; i++) {
    const x = i * 5.8 + (deterministicUnit(i, 0) - 0.5) * 4;
    const alpha = 0.08 + (i % 4 === 0 ? 0.15 : 0.04);
    ctx.strokeStyle = `rgba(35, 12, 4, ${alpha})`;
    ctx.lineWidth = 1.4 + (i % 3) * 0.6;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.bezierCurveTo(x + 16, 160, x - 14, 360, x + 8, 512);
    ctx.stroke();
  }

  // Hand-adze plane marks & wood pores
  for (let p = 0; p < 260; p++) {
    const px = deterministicUnit(p, 1) * 512;
    const py = deterministicUnit(p, 2) * 512;
    ctx.fillStyle = "rgba(20, 6, 2, 0.32)";
    ctx.fillRect(px, py, 2.0, 6 + deterministicUnit(p, 3) * 8);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildWhitneyCottonGinModel(): WhitneyCottonGinModel {
  const lcg = createLcg(1794);
  const rootGroup = new THREE.Group();
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const texturesToDispose: THREE.Texture[] = [];

  const timberTex = createTimberTexture();
  if (timberTex) texturesToDispose.push(timberTex);

  // --- 1. PBR MATERIALS ---
  const walnutWood = new THREE.MeshStandardMaterial({
    ...(timberTex ? { map: timberTex } : {}),
    color: 0x5c3218,
    roughness: 0.72,
    metalness: 0.05,
  });
  materialsToDispose.push(walnutWood);

  const ironSaw = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.35,
    metalness: 0.88,
  });
  materialsToDispose.push(ironSaw);

  const brassGrate = new THREE.MeshStandardMaterial({
    color: 0xc8963e,
    roughness: 0.28,
    metalness: 0.85,
  });
  materialsToDispose.push(brassGrate);

  const brushBristles = new THREE.MeshStandardMaterial({
    color: 0x1c1917,
    roughness: 0.9,
    metalness: 0.1,
  });
  materialsToDispose.push(brushBristles);

  const shaftSteel = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.18,
    metalness: 0.94,
  });
  materialsToDispose.push(shaftSteel);

  const seedMat = new THREE.MeshStandardMaterial({
    color: 0x271c19,
    roughness: 0.85,
    metalness: 0.05,
  });
  materialsToDispose.push(seedMat);

  // --- 2. HEAVY TIMBER OAK/WALNUT FRAME & HOPPER ---
  const frameGroup = new THREE.Group();
  rootGroup.add(frameGroup);

  // Base Timber Bed Frame
  const baseBedGeo = new THREE.BoxGeometry(8.2, 0.6, 6.2);
  geometriesToDispose.push(baseBedGeo);
  const baseBed = new THREE.Mesh(baseBedGeo, walnutWood);
  baseBed.position.y = -2.5;
  baseBed.castShadow = true;
  baseBed.receiveShadow = true;
  frameGroup.add(baseBed);

  // 4 Heavy Corner Posts
  const postPositions: [number, number][] = [
    [-3.8, -2.8],
    [-3.8, 2.8],
    [3.8, -2.8],
    [3.8, 2.8],
  ];
  for (const [px, pz] of postPositions) {
    const postGeo = new THREE.BoxGeometry(0.6, 5.0, 0.6);
    geometriesToDispose.push(postGeo);
    const post = new THREE.Mesh(postGeo, walnutWood);
    post.position.set(px, 0, pz);
    post.castShadow = true;
    frameGroup.add(post);
  }

  // Side Housing Planks
  [-3.8, 3.8].forEach((xPos) => {
    const sidePlankGeo = new THREE.BoxGeometry(0.5, 4.8, 5.8);
    geometriesToDispose.push(sidePlankGeo);
    const sidePlank = new THREE.Mesh(sidePlankGeo, walnutWood);
    sidePlank.position.set(xPos, -0.1, 0);
    sidePlank.castShadow = true;
    frameGroup.add(sidePlank);

    // Brass Pillow Block Journal Bearings
    [-0.8, 1.2].forEach((zPos) => {
      const bearingGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.4, 16);
      geometriesToDispose.push(bearingGeo);
      const bearing = new THREE.Mesh(bearingGeo, brassGrate);
      bearing.rotation.z = Math.PI / 2;
      bearing.position.set(xPos > 0 ? xPos + 0.25 : xPos - 0.25, 0.2, zPos);
      frameGroup.add(bearing);
    });
  });

  // Raw Cotton Infeed Hopper Chute
  const hopperBackGeo = new THREE.BoxGeometry(7.2, 0.3, 3.2);
  geometriesToDispose.push(hopperBackGeo);
  const hopperBack = new THREE.Mesh(hopperBackGeo, walnutWood);
  hopperBack.position.set(0, 2.2, 1.7);
  hopperBack.rotation.x = -Math.PI / 4;
  hopperBack.castShadow = true;
  frameGroup.add(hopperBack);

  // --- 3. SLOTTED IRON BREASTWORK GRATE (CLAIM 1) ---
  const grateGroup = new THREE.Group();
  grateGroup.position.set(0, 0.3, 0.3);
  rootGroup.add(grateGroup);

  const grateRibCount = 28;
  for (let r = 0; r < grateRibCount; r++) {
    const rx = -3.2 + r * (6.4 / (grateRibCount - 1));
    const ribGeo = new THREE.BoxGeometry(0.06, 2.5, 0.45);
    geometriesToDispose.push(ribGeo);
    const rib = new THREE.Mesh(ribGeo, brassGrate);
    rib.position.set(rx, 0, 0);
    rib.rotation.x = Math.PI / 6;
    rib.castShadow = true;
    grateGroup.add(rib);
  }

  // --- 4. REVOLVING SAW CYLINDER (CLAIM 1 WIRE TEETH DISCS) ---
  const sawCylinderGroup = new THREE.Group();
  sawCylinderGroup.position.set(0, 0.2, -0.8);
  rootGroup.add(sawCylinderGroup);

  // Central Wooden Cylinder Core
  const woodCoreGeo = new THREE.CylinderGeometry(0.9, 0.9, 7.2, 24);
  geometriesToDispose.push(woodCoreGeo);
  const woodCore = new THREE.Mesh(woodCoreGeo, walnutWood);
  woodCore.rotation.z = Math.PI / 2;
  sawCylinderGroup.add(woodCore);

  // Concentric Iron Circular Saw Discs with Wooden Spacing Collars
  const sawCount = 27;
  for (let s = 0; s < sawCount; s++) {
    const sx = -3.1 + s * (6.2 / (sawCount - 1));
    const sawDiscGeo = new THREE.CylinderGeometry(1.48, 1.48, 0.04, 32);
    geometriesToDispose.push(sawDiscGeo);
    const sawDisc = new THREE.Mesh(sawDiscGeo, ironSaw);
    sawDisc.rotation.z = Math.PI / 2;
    sawDisc.position.set(sx, 0, 0);
    sawDisc.castShadow = true;
    sawCylinderGroup.add(sawDisc);

    // Wooden Spacing Collars between adjacent saw blades
    if (s < sawCount - 1) {
      const collarGeo = new THREE.CylinderGeometry(1.02, 1.02, 0.19, 16);
      geometriesToDispose.push(collarGeo);
      const collar = new THREE.Mesh(collarGeo, walnutWood);
      collar.rotation.z = Math.PI / 2;
      collar.position.set(sx + 0.12, 0, 0);
      sawCylinderGroup.add(collar);
    }
  }

  // Heavy Iron Axle Arbor Shaft
  const sawShaftGeo = new THREE.CylinderGeometry(0.18, 0.18, 9.4, 16);
  geometriesToDispose.push(sawShaftGeo);
  const sawShaft = new THREE.Mesh(sawShaftGeo, shaftSteel);
  sawShaft.rotation.z = Math.PI / 2;
  sawCylinderGroup.add(sawShaft);

  // --- 5. HIGH-SPEED CLEARING BRUSH CYLINDER (CLAIM 2) ---
  const brushCylinderGroup = new THREE.Group();
  brushCylinderGroup.position.set(0, 0.2, 1.2);
  rootGroup.add(brushCylinderGroup);

  const brushCoreGeo = new THREE.CylinderGeometry(0.72, 0.72, 7.2, 24);
  geometriesToDispose.push(brushCoreGeo);
  const brushCore = new THREE.Mesh(brushCoreGeo, walnutWood);
  brushCore.rotation.z = Math.PI / 2;
  brushCylinderGroup.add(brushCore);

  // 4 Longitudinal Rows of Stiff Hog Bristles
  for (let row = 0; row < 4; row++) {
    const rowAngle = (row * Math.PI) / 2;
    const bristleRowGeo = new THREE.BoxGeometry(7.0, 0.72, 0.16);
    geometriesToDispose.push(bristleRowGeo);
    const bristleRow = new THREE.Mesh(bristleRowGeo, brushBristles);
    bristleRow.position.set(0, Math.cos(rowAngle) * 0.76, Math.sin(rowAngle) * 0.76);
    bristleRow.rotation.x = rowAngle;
    brushCylinderGroup.add(bristleRow);
  }

  const brushShaftGeo = new THREE.CylinderGeometry(0.18, 0.18, 9.4, 16);
  geometriesToDispose.push(brushShaftGeo);
  const brushShaft = new THREE.Mesh(brushShaftGeo, shaftSteel);
  brushShaft.rotation.z = Math.PI / 2;
  brushCylinderGroup.add(brushShaft);

  // --- 6. HAND CRANK & STEP-UP PULLEY GEAR TRAIN ---
  const crankGroup = new THREE.Group();
  crankGroup.position.set(4.3, 0.2, -0.8);
  rootGroup.add(crankGroup);

  const crankArmGeo = new THREE.BoxGeometry(0.2, 1.8, 0.15);
  geometriesToDispose.push(crankArmGeo);
  const crankArm = new THREE.Mesh(crankArmGeo, ironSaw);
  crankArm.position.y = 0.8;
  crankGroup.add(crankArm);

  const crankHandleGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.0, 16);
  geometriesToDispose.push(crankHandleGeo);
  const crankHandle = new THREE.Mesh(crankHandleGeo, walnutWood);
  crankHandle.rotation.z = Math.PI / 2;
  crankHandle.position.set(0.6, 1.6, 0);
  crankHandle.castShadow = true;
  crankGroup.add(crankHandle);

  // Step-Up Belt Pulley Assembly
  const drivePulleyGroup = new THREE.Group();
  drivePulleyGroup.position.set(-4.5, 0.2, -0.8);
  rootGroup.add(drivePulleyGroup);

  const drivePulleyGeo = new THREE.CylinderGeometry(1.25, 1.25, 0.25, 24);
  geometriesToDispose.push(drivePulleyGeo);
  const drivePulley = new THREE.Mesh(drivePulleyGeo, ironSaw);
  drivePulley.rotation.z = Math.PI / 2;
  drivePulley.castShadow = true;
  drivePulleyGroup.add(drivePulley);

  // Small Pinion Pulley on Brush Shaft
  const brushPulleyGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.25, 20);
  geometriesToDispose.push(brushPulleyGeo);
  const brushPulley = new THREE.Mesh(brushPulleyGeo, ironSaw);
  brushPulley.rotation.z = Math.PI / 2;
  brushPulley.position.set(-4.5, 0.2, 1.2);
  brushPulley.castShadow = true;
  rootGroup.add(brushPulley);

  // Crossed Leather Transmission Belt (Saw Shaft -> Brush Shaft Speed Step-Up)
  const beltMat = new THREE.MeshStandardMaterial({
    color: 0x78350f,
    roughness: 0.8,
    metalness: 0.1,
  });
  materialsToDispose.push(beltMat);

  const beltTopGeo = new THREE.BoxGeometry(0.08, 0.12, 2.05);
  geometriesToDispose.push(beltTopGeo);
  const beltTop = new THREE.Mesh(beltTopGeo, beltMat);
  beltTop.position.set(-4.5, 0.85, 0.2);
  beltTop.rotation.x = 0.42;
  rootGroup.add(beltTop);

  const beltBotGeo = new THREE.BoxGeometry(0.08, 0.12, 2.05);
  geometriesToDispose.push(beltBotGeo);
  const beltBot = new THREE.Mesh(beltBotGeo, beltMat);
  beltBot.position.set(-4.5, -0.45, 0.2);
  beltBot.rotation.x = -0.42;
  rootGroup.add(beltBot);

  // Inclined Seed Apron Chute (Discharging Clean Seeds)
  const seedChuteGeo = new THREE.BoxGeometry(7.0, 0.18, 1.8);
  geometriesToDispose.push(seedChuteGeo);
  const seedChute = new THREE.Mesh(seedChuteGeo, walnutWood);
  seedChute.position.set(0, -1.2, 0.2);
  seedChute.rotation.x = Math.PI / 5;
  seedChute.receiveShadow = true;
  frameGroup.add(seedChute);

  // --- 7. FLYING COTTON FIBER PARTICLES & BLOCKED SEED HEAP ---
  const fiberCount = 140;
  const fiberGeo = new THREE.BufferGeometry();
  geometriesToDispose.push(fiberGeo);
  const fiberPositions = new Float32Array(fiberCount * 3);
  const fiberColors = new Float32Array(fiberCount * 3);
  const glowTex = createGlowPointTexture();
  texturesToDispose.push(glowTex);

  for (let i = 0; i < fiberCount; i++) {
    const idx = i * 3;
    fiberPositions[idx] = (lcg() - 0.5) * 6.2;
    fiberPositions[idx + 1] = 0.2 + (lcg() - 0.5) * 1.5;
    fiberPositions[idx + 2] = -0.5 + lcg() * 3.0;

    fiberColors[idx] = 0.98;
    fiberColors[idx + 1] = 0.98;
    fiberColors[idx + 2] = 0.95;
  }

  fiberGeo.setAttribute("position", new THREE.BufferAttribute(fiberPositions, 3));
  fiberGeo.setAttribute("color", new THREE.BufferAttribute(fiberColors, 3));

  const cottonFiberMat = new THREE.PointsMaterial({
    size: 0.28,
    map: glowTex,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  });
  materialsToDispose.push(cottonFiberMat);

  const fiberPoints = new THREE.Points(fiberGeo, cottonFiberMat);
  rootGroup.add(fiberPoints);

  // Blocked Seeds Group at Grate
  const seedsGroup = new THREE.Group();
  seedsGroup.position.set(0, -0.4, 0.4);
  rootGroup.add(seedsGroup);

  const seedGeo = new THREE.DodecahedronGeometry(0.12);
  geometriesToDispose.push(seedGeo);

  for (let sd = 0; sd < 35; sd++) {
    const seed = new THREE.Mesh(seedGeo, seedMat);
    seed.position.set((lcg() - 0.5) * 5.8, (lcg() - 0.5) * 0.4, (lcg() - 0.5) * 0.6);
    seed.rotation.set(lcg() * Math.PI, lcg() * Math.PI, 0);
    seedsGroup.add(seed);
  }

  const dispose = () => {
    for (const geo of geometriesToDispose) geo.dispose();
    for (const mat of materialsToDispose) mat.dispose();
    for (const tex of texturesToDispose) tex.dispose();
  };

  return {
    rootGroup,
    frameGroup,
    grateGroup,
    sawCylinderGroup,
    brushCylinderGroup,
    crankGroup,
    drivePulleyGroup,
    fiberPoints,
    fiberPositions,
    fiberCount,
    seedsGroup,
    materials: {
      walnutWood,
      ironSaw,
      brassGrate,
      brushBristles,
      shaftSteel,
      cottonFiberMat,
      seedMat,
    },
    dispose,
  };
}

/**
 * Updates Whitney cotton gin saw cylinder, brush doffing drum, crank handle, cotton fibers, and cutaway.
 */
export function updateWhitneyCottonGinKinematics(
  model: WhitneyCottonGinModel,
  dt: number,
  crankOmegaRadPerS: number,
  sawOmegaRadPerS: number,
  brushOmegaRadPerS: number,
  showFibers: boolean,
  isCutaway = false,
): void {
  // Crank handle manual rotation
  model.crankGroup.rotation.x += crankOmegaRadPerS * dt;

  // Saw cylinder rotation (forward, into hopper grate)
  model.sawCylinderGroup.rotation.x += sawOmegaRadPerS * dt;
  model.drivePulleyGroup.rotation.x += sawOmegaRadPerS * dt;

  // Brush cylinder high-speed counter-rotation (doffing fibers backwards)
  model.brushCylinderGroup.rotation.x -= brushOmegaRadPerS * dt;

  // Animate cotton fibers through the gin grate and doffing chamber
  if (showFibers) {
    model.fiberPoints.visible = true;
    const whitney = stepWhitneyCottonGin({});
    const pos = model.fiberPositions;
    for (let i = 0; i < model.fiberCount; i++) {
      const idx = i * 3;
      pos[idx + 2] += (sawOmegaRadPerS * whitney.fiberSawCoupling + whitney.fiberCarrySpeed) * dt;
      pos[idx + 1] -= whitney.fiberGravity * dt;

      if (pos[idx + 2] > whitney.fiberWrapZ) {
        pos[idx + 2] = whitney.fiberResetZ;
        pos[idx + 1] = whitney.fiberResetY;
      }
    }
    model.fiberPoints.geometry.attributes.position.needsUpdate = true;
  } else {
    model.fiberPoints.visible = false;
  }

  // Cutaway transparency for timber casing and frame
  model.materials.walnutWood.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.walnutWood.transparent = isCutaway;
}
