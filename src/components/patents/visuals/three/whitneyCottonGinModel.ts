import * as THREE from "three";
import { fluidFrames, sampleFluidAt } from "@/physics/genericWasm";
import type { WhitneyKinematicPhases } from "@/physics/whitneyCottonGinKernel";
import { createGlowPointTexture } from "./ThreeStudioScene";

export interface WhitneyCottonGinModel {
  rootGroup: THREE.Group;
  frameGroup: THREE.Group;
  grateGroup: THREE.Group;
  sawCylinderGroup: THREE.Group;
  wireTeeth: THREE.InstancedMesh;
  brushCylinderGroup: THREE.Group;
  brushBristles: THREE.InstancedMesh;
  crankGroup: THREE.Group;
  drivePulleyGroup: THREE.Group;
  brushPulleyGroup: THREE.Group;
  beltSpans: readonly THREE.Mesh[];
  beltWraps: readonly THREE.Mesh[];
  fiberPoints: THREE.Points;
  fiberPositions: Float32Array;
  fiberSeeds: Float32Array;
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
    transparent: true,
    opacity: 1.0,
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
    [-0.8, 1.4].forEach((zPos) => {
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

  // --- 3. SLOTTED IRON BREASTWORK GRATE (SOURCE PART II) ---
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

  // --- 4. REVOLVING WOODEN CYLINDER WITH ANNULAR WIRE-TOOTH ROWS ---
  const sawCylinderGroup = new THREE.Group();
  sawCylinderGroup.position.set(0, 0.2, -0.8);
  rootGroup.add(sawCylinderGroup);

  // Central Wooden Cylinder Core
  const woodCoreGeo = new THREE.CylinderGeometry(0.9, 0.9, 7.2, 24);
  geometriesToDispose.push(woodCoreGeo);
  const woodCore = new THREE.Mesh(woodCoreGeo, walnutWood);
  woodCore.rotation.z = Math.PI / 2;
  sawCylinderGroup.add(woodCore);

  // The source is explicit: individual one-inch iron-wire teeth are driven
  // into a continuous wooden cylinder in annular rows and bent 55°–60°
  // toward the tangent. Circular saw plates would be a different machine.
  const toothRowCount = 27;
  const teethPerVisibleRow = 16;
  const toothLength = 0.55;
  const wireToothGeometry = new THREE.CylinderGeometry(0.022, 0.027, toothLength, 6);
  geometriesToDispose.push(wireToothGeometry);
  const wireTeeth = new THREE.InstancedMesh(
    wireToothGeometry,
    ironSaw,
    toothRowCount * teethPerVisibleRow,
  );
  wireTeeth.name = "source-wire-teeth-in-annular-rows";
  const toothDummy = new THREE.Object3D();
  const cylinderAxis = new THREE.Vector3(0, 1, 0);
  const toothAngleFromTangent = THREE.MathUtils.degToRad(57.5);
  let toothIndex = 0;
  for (let row = 0; row < toothRowCount; row++) {
    const x = -3.1 + row * (6.2 / (toothRowCount - 1));
    for (let tooth = 0; tooth < teethPerVisibleRow; tooth++) {
      const theta = (tooth / teethPerVisibleRow) * Math.PI * 2;
      const radial = new THREE.Vector3(0, Math.cos(theta), Math.sin(theta));
      const tangent = new THREE.Vector3(0, -Math.sin(theta), Math.cos(theta));
      const direction = tangent
        .multiplyScalar(Math.cos(toothAngleFromTangent))
        .add(radial.clone().multiplyScalar(Math.sin(toothAngleFromTangent)))
        .normalize();
      const base = radial.multiplyScalar(0.9);
      toothDummy.position.set(x, base.y, base.z).addScaledVector(direction, toothLength / 2);
      toothDummy.quaternion.setFromUnitVectors(cylinderAxis, direction);
      toothDummy.updateMatrix();
      wireTeeth.setMatrixAt(toothIndex, toothDummy.matrix);
      toothIndex += 1;
    }
  }
  wireTeeth.instanceMatrix.needsUpdate = true;
  wireTeeth.castShadow = true;
  sawCylinderGroup.add(wireTeeth);

  // Heavy Iron Axle Arbor Shaft
  const sawShaftGeo = new THREE.CylinderGeometry(0.18, 0.18, 9.4, 16);
  geometriesToDispose.push(sawShaftGeo);
  const sawShaft = new THREE.Mesh(sawShaftGeo, shaftSteel);
  sawShaft.rotation.z = Math.PI / 2;
  sawCylinderGroup.add(sawShaft);

  // --- 5. HIGH-SPEED CLEARING BRUSH CYLINDER (SOURCE PART IV) ---
  const brushCylinderGroup = new THREE.Group();
  brushCylinderGroup.position.set(0, 0.2, 1.4);
  rootGroup.add(brushCylinderGroup);

  // Two crossed frames on the iron axis carry four longitudinal brush rails,
  // matching Part IV rather than representing the clearer as a solid drum.
  for (const x of [-2.35, 2.35]) {
    for (const alongZ of [false, true]) {
      const crossArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.12, 0.12), walnutWood);
      geometriesToDispose.push(crossArm.geometry);
      crossArm.position.x = x;
      if (alongZ) crossArm.rotation.x = Math.PI / 2;
      brushCylinderGroup.add(crossArm);
    }
  }

  const brushRailGeometry = new THREE.BoxGeometry(7, 0.14, 0.14);
  geometriesToDispose.push(brushRailGeometry);
  for (let row = 0; row < 4; row++) {
    const rowAngle = (row * Math.PI) / 2;
    const rail = new THREE.Mesh(brushRailGeometry, walnutWood);
    rail.position.set(0, Math.cos(rowAngle) * 0.56, Math.sin(rowAngle) * 0.56);
    brushCylinderGroup.add(rail);
  }

  const bristleGeometry = new THREE.CylinderGeometry(0.014, 0.018, 0.34, 5);
  geometriesToDispose.push(bristleGeometry);
  const brushBristleCount = 4 * 29;
  const brushBristleInstances = new THREE.InstancedMesh(
    bristleGeometry,
    brushBristles,
    brushBristleCount,
  );
  brushBristleInstances.name = "four-source-brush-rows";
  const bristleDummy = new THREE.Object3D();
  let bristleIndex = 0;
  for (let row = 0; row < 4; row++) {
    const theta = (row * Math.PI) / 2;
    const outward = new THREE.Vector3(0, Math.cos(theta), Math.sin(theta));
    for (let axial = 0; axial < 29; axial++) {
      bristleDummy.position.set(-3.35 + axial * (6.7 / 28), 0, 0).addScaledVector(outward, 0.8);
      bristleDummy.quaternion.setFromUnitVectors(cylinderAxis, outward);
      bristleDummy.updateMatrix();
      brushBristleInstances.setMatrixAt(bristleIndex, bristleDummy.matrix);
      bristleIndex += 1;
    }
  }
  brushBristleInstances.instanceMatrix.needsUpdate = true;
  brushCylinderGroup.add(brushBristleInstances);

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

  // Step-up whirls on the cylinder and clearer shafts. The source specifies
  // crowned wooden whirls and a leather band, but no diameters; these visible
  // relative radii close the declared 3:1 scenario.
  const drivePulleyGroup = new THREE.Group();
  drivePulleyGroup.position.set(-4.5, 0.2, -0.8);
  rootGroup.add(drivePulleyGroup);

  const drivePulleyGeo = new THREE.SphereGeometry(1, 24, 12);
  geometriesToDispose.push(drivePulleyGeo);
  const drivePulley = new THREE.Mesh(drivePulleyGeo, walnutWood);
  drivePulley.name = "source-crowned-cylinder-whirl";
  drivePulley.scale.set(0.16, 1.05, 1.05);
  drivePulley.castShadow = true;
  drivePulleyGroup.add(drivePulley);

  const brushPulleyGroup = new THREE.Group();
  brushPulleyGroup.position.set(-4.5, 0.2, 1.4);
  rootGroup.add(brushPulleyGroup);
  const brushPulleyGeo = new THREE.SphereGeometry(1, 20, 10);
  geometriesToDispose.push(brushPulleyGeo);
  const brushPulley = new THREE.Mesh(brushPulleyGeo, walnutWood);
  brushPulley.name = "source-crowned-clearer-whirl";
  brushPulley.scale.set(0.16, 0.35, 0.35);
  brushPulley.castShadow = true;
  brushPulleyGroup.add(brushPulley);

  // Crossed Leather Transmission Belt (Saw Shaft -> Brush Shaft Speed Step-Up)
  const beltMat = new THREE.MeshStandardMaterial({
    color: 0x78350f,
    roughness: 0.8,
    metalness: 0.1,
  });
  materialsToDispose.push(beltMat);

  function beltSpanBetween(start: THREE.Vector3, end: THREE.Vector3, name: string): THREE.Mesh {
    const direction = end.clone().sub(start);
    const geometry = new THREE.CylinderGeometry(0.045, 0.045, direction.length(), 8);
    geometriesToDispose.push(geometry);
    const span = new THREE.Mesh(geometry, beltMat);
    span.name = name;
    span.position.copy(start).add(end).multiplyScalar(0.5);
    span.quaternion.setFromUnitVectors(cylinderAxis, direction.normalize());
    rootGroup.add(span);
    return span;
  }
  const beltSpans = [
    beltSpanBetween(
      new THREE.Vector3(-4.5, 1.25, -0.8),
      new THREE.Vector3(-4.5, -0.15, 1.4),
      "crossed-band-span-a",
    ),
    beltSpanBetween(
      new THREE.Vector3(-4.5, -0.85, -0.8),
      new THREE.Vector3(-4.5, 0.55, 1.4),
      "crossed-band-span-b",
    ),
  ] as const;

  function beltWrap(
    points: readonly THREE.Vector3[],
    name: string,
  ): THREE.Mesh<THREE.TubeGeometry, THREE.MeshStandardMaterial> {
    const curve = new THREE.CatmullRomCurve3([...points], false, "centripetal");
    const geometry = new THREE.TubeGeometry(curve, 28, 0.05, 8, false);
    geometriesToDispose.push(geometry);
    const wrap = new THREE.Mesh(geometry, beltMat);
    wrap.name = name;
    rootGroup.add(wrap);
    return wrap;
  }

  // The straight crossed spans alone would terminate at the whirls. These
  // source-faithful wrap segments close the leather band continuously around
  // the far side of each crowned wooden whirl.
  const beltWraps = [
    beltWrap(
      [
        new THREE.Vector3(-4.5, 1.25, -0.8),
        new THREE.Vector3(-4.5, 0.95, -1.55),
        new THREE.Vector3(-4.5, 0.2, -1.85),
        new THREE.Vector3(-4.5, -0.55, -1.55),
        new THREE.Vector3(-4.5, -0.85, -0.8),
      ],
      "cylinder-whirl-band-wrap",
    ),
    beltWrap(
      [
        new THREE.Vector3(-4.5, -0.15, 1.4),
        new THREE.Vector3(-4.5, -0.05, 1.65),
        new THREE.Vector3(-4.5, 0.2, 1.75),
        new THREE.Vector3(-4.5, 0.45, 1.65),
        new THREE.Vector3(-4.5, 0.55, 1.4),
      ],
      "clearer-whirl-band-wrap",
    ),
  ] as const;

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
  const fiberSeeds = new Float32Array(fiberCount * 3);
  const fiberColors = new Float32Array(fiberCount * 3);
  const glowTex = createGlowPointTexture();
  texturesToDispose.push(glowTex);

  for (let i = 0; i < fiberCount; i++) {
    const idx = i * 3;
    fiberSeeds[idx] = (deterministicUnit(i, 0) - 0.5) * 6.2;
    fiberSeeds[idx + 1] = deterministicUnit(i, 1);
    fiberSeeds[idx + 2] = deterministicUnit(i, 2);
    fiberPositions[idx] = fiberSeeds[idx];
    fiberPositions[idx + 1] = 0.9;
    fiberPositions[idx + 2] = -0.5 + fiberSeeds[idx + 2] * 3;

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
    seed.position.set(
      (deterministicUnit(sd, 0) - 0.5) * 5.8,
      (deterministicUnit(sd, 1) - 0.5) * 0.4,
      (deterministicUnit(sd, 2) - 0.5) * 0.6,
    );
    seed.rotation.set(deterministicUnit(sd, 3) * Math.PI, deterministicUnit(sd, 4) * Math.PI, 0);
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
    wireTeeth,
    brushCylinderGroup,
    brushBristles: brushBristleInstances,
    crankGroup,
    drivePulleyGroup,
    brushPulleyGroup,
    beltSpans,
    beltWraps,
    fiberPoints,
    fiberPositions,
    fiberSeeds,
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
  phases: WhitneyKinematicPhases,
  showFibers: boolean,
  isCutaway = false,
): void {
  // The source puts the winch directly on the cylinder axle. Absolute shared
  // tape phases make replay, pause, reset, and 2D/3D switching exact.
  model.crankGroup.rotation.x = phases.crankRad;
  model.sawCylinderGroup.rotation.x = phases.cylinderRad;
  model.drivePulleyGroup.rotation.x = phases.cylinderRad;
  model.brushCylinderGroup.rotation.x = phases.clearerRad;
  model.brushPulleyGroup.rotation.x = phases.clearerRad;

  // Animate cotton fibers through the gin grate and doffing chamber
  if (showFibers) {
    model.fiberPoints.visible = true;
    const pos = model.fiberPositions;
    const fluid = fluidFrames(16, 8);
    const frame = Math.floor(phases.lintCycle01 * 8) % 8;
    for (let i = 0; i < model.fiberCount; i++) {
      const idx = i * 3;
      const u = (i + 0.5) / Math.max(1, model.fiberCount);
      const density = sampleFluidAt(fluid, 16, 8, frame, u, 0.4);
      const progress = (model.fiberSeeds[idx + 2] + phases.lintCycle01 * (1 + density)) % 1;
      pos[idx] = model.fiberSeeds[idx];
      pos[idx + 1] = 0.9 - progress * 0.65 + model.fiberSeeds[idx + 1] * 0.12;
      pos[idx + 2] = -0.55 + progress * 3.75;
    }
    model.fiberPoints.geometry.attributes.position.needsUpdate = true;
  } else {
    model.fiberPoints.visible = false;
  }

  // Cutaway transparency for timber casing and frame
  model.materials.walnutWood.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.walnutWood.transparent = isCutaway;
  model.materials.walnutWood.depthWrite = !isCutaway;
  model.materials.walnutWood.needsUpdate = true;
}
