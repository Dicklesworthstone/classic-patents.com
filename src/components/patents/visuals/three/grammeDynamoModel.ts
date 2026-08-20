/**
 * grammeDynamoModel.ts
 *
 * Museum-Grade Procedural 3D Model for Zénobe Gramme's 1871 Continuous DC Ring Armature Dynamo
 * (US Patent 120,057 - "Improvement in Magneto-Electric Machines").
 *
 * Reconstructs the first commercially viable continuous DC dynamo:
 * 1. Cast-iron bedplate with dual upright bearing pedestals.
 * 2. Soft iron annular ring core with 36 individual wound bobbins connected end-to-end (Claim 1).
 * 3. 36 radial brass junction rods rotating with the ring (Claim 2).
 * 4. Stationary collecting rubbers contacting successive junction conductors at the neutral magnetic axis.
 * 5. Upper and lower field electromagnet poles with concave iron shoes embracing the ring.
 * 6. Dual-stream toroidal magnetic flux lines circulating through the ring core.
 */

import * as THREE from "three";
import { grammeFluxRadius, stepGrammeDynamo } from "@/physics/catalogKernels";
import { cyclicSol, cyclicSymmetry } from "@/physics/genericWasm";
import { createGlowPointTexture } from "./ThreeStudioScene";

export interface GrammeDynamoModelNodes {
  rootGroup: THREE.Group;
  bedplate: THREE.Mesh;
  pedestals: THREE.Mesh[];
  statorGroup: THREE.Group;
  poleShoes: THREE.Mesh[];
  fieldCoils: THREE.Mesh[];
  armatureGroup: THREE.Group;
  shaft: THREE.Mesh;
  ironRing: THREE.Mesh;
  coilSectors: THREE.Mesh[];
  junctionRods: THREE.Mesh[];
  collectorRubbers: THREE.Mesh[];
  fluxPoints: THREE.Points;
  fluxPositions: Float32Array;
  fluxCount: number;
}

export interface GrammeDynamoMaterials {
  castIron: THREE.MeshStandardMaterial;
  copperCoil: THREE.MeshStandardMaterial;
  brass: THREE.MeshStandardMaterial;
  rubber: THREE.MeshStandardMaterial;
  steelShaft: THREE.MeshStandardMaterial;
  fluxMat: THREE.PointsMaterial;
}

export interface GrammeDynamoModelResult {
  rootGroup: THREE.Group;
  nodes: GrammeDynamoModelNodes;
  materials: GrammeDynamoMaterials;
  dispose: () => void;
}

/**
 * Deterministic unit noise for procedural generation.
 */
function deterministicUnit(index: number, channel: number): number {
  const sample = Math.sin((index + 1) * 12.9898 + (channel + 1) * 78.233) * 43758.5453;
  return sample - Math.floor(sample);
}

/**
 * Procedural Cast-Iron Machine Texture
 */
function createCastIronTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  ctx.fillStyle = "#1e293b";
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 500; i++) {
    const x = deterministicUnit(i, 0) * 512;
    const y = deterministicUnit(i, 1) * 512;
    const r = 0.5 + deterministicUnit(i, 2) * 1.5;
    const alpha = 0.06 + deterministicUnit(i, 3) * 0.1;
    ctx.fillStyle =
      deterministicUnit(i, 4) > 0.5
        ? `rgba(255, 255, 255, ${alpha})`
        : `rgba(0, 0, 0, ${alpha * 1.5})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const FLUX_COUNT = 120;
const SECTOR_COUNT = 36;

export function buildGrammeDynamoModel(): GrammeDynamoModelResult {
  const rootGroup = new THREE.Group();
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const texturesToDispose: THREE.Texture[] = [];

  const castIronTex = createCastIronTexture();
  if (castIronTex) texturesToDispose.push(castIronTex);

  const trackGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    geometriesToDispose.push(geo);
    return geo;
  };
  const trackMat = <T extends THREE.Material>(mat: T): T => {
    materialsToDispose.push(mat);
    return mat;
  };

  const fluxGlowTex = createGlowPointTexture();
  texturesToDispose.push(fluxGlowTex);

  // Materials
  const materials: GrammeDynamoMaterials = {
    castIron: trackMat(
      new THREE.MeshStandardMaterial({
        ...(castIronTex ? { map: castIronTex } : {}),
        color: 0x1e293b,
        roughness: 0.5,
        metalness: 0.8,
      }),
    ),
    copperCoil: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.25,
        metalness: 0.9,
      }),
    ),
    brass: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xc8963e,
        roughness: 0.2,
        metalness: 0.92,
      }),
    ),
    rubber: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x111827,
        roughness: 0.92,
        metalness: 0.02,
      }),
    ),
    steelShaft: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.1,
        metalness: 0.95,
      }),
    ),
    fluxMat: trackMat(
      new THREE.PointsMaterial({
        size: 0.25,
        map: fluxGlowTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    ),
  };

  // 1. Heavy Cast-Iron Bedplate & Upright Bearing Brackets
  const bedplate = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(10.5, 0.8, 6.5)),
    materials.castIron,
  );
  bedplate.position.y = -2.2;
  bedplate.receiveShadow = true;
  bedplate.castShadow = true;
  rootGroup.add(bedplate);

  const pedestals: THREE.Mesh[] = [];
  [-3.8, 3.8].forEach((bx) => {
    const pedestal = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.45, 0.6, 3.2, 16)),
      materials.castIron,
    );
    pedestal.position.set(bx, -0.6, 0);
    pedestal.castShadow = true;
    rootGroup.add(pedestal);
    pedestals.push(pedestal);
  });

  // 2. Stationary Field Magnet Iron Core Pole Shoes
  const statorGroup = new THREE.Group();
  rootGroup.add(statorGroup);

  const poleShoes: THREE.Mesh[] = [];
  const fieldCoils: THREE.Mesh[] = [];
  [-1, 1].forEach((dir) => {
    const poleShoe = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(2.6, 2.6, 2.8, 24, 1, true, 0, Math.PI * 0.6)),
      materials.castIron,
    );
    poleShoe.rotation.z = Math.PI / 2;
    poleShoe.rotation.x = dir > 0 ? Math.PI * 0.2 : Math.PI * 1.2;
    poleShoe.position.set(0, 0, 0);
    poleShoe.castShadow = true;
    statorGroup.add(poleShoe);
    poleShoes.push(poleShoe);

    const fCoil = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(2.2, 1.4, 2.4)),
      materials.copperCoil,
    );
    fCoil.position.set(0, dir * 2.2, 0);
    fCoil.castShadow = true;
    statorGroup.add(fCoil);
    fieldCoils.push(fCoil);
  });

  // 3. Revolving Gramme Ring Armature (Claim 1)
  const armatureGroup = new THREE.Group();
  rootGroup.add(armatureGroup);

  const shaft = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.18, 0.18, 9.0, 16)),
    materials.steelShaft,
  );
  shaft.rotation.z = Math.PI / 2;
  shaft.castShadow = true;
  armatureGroup.add(shaft);

  const ironRing = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(1.8, 0.45, 16, 36)),
    materials.castIron,
  );
  ironRing.rotation.y = Math.PI / 2;
  ironRing.castShadow = true;
  armatureGroup.add(ironRing);

  const coilSectors: THREE.Mesh[] = [];
  for (let s = 0; s < SECTOR_COUNT; s++) {
    const sAngle = (s * Math.PI * 2) / SECTOR_COUNT;
    const coilSector = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.55, 0.14, 12, 16)),
      materials.copperCoil,
    );
    coilSector.position.set(0, Math.cos(sAngle) * 1.8, Math.sin(sAngle) * 1.8);
    coilSector.rotation.y = Math.PI / 2;
    coilSector.rotation.x = sAngle;
    coilSector.castShadow = true;
    armatureGroup.add(coilSector);
    coilSectors.push(coilSector);
  }

  // 4. Junction Conductors & Stationary Rubbers (Claim 2)
  const junctionRods: THREE.Mesh[] = [];
  const junctionRodGeometry = trackGeo(new THREE.CylinderGeometry(0.055, 0.055, 0.85, 10));
  for (let junction = 0; junction < SECTOR_COUNT; junction++) {
    const angle = (junction * Math.PI * 2) / SECTOR_COUNT;
    const junctionRod = new THREE.Mesh(junctionRodGeometry, materials.brass);
    junctionRod.rotation.z = Math.PI / 2;
    junctionRod.position.set(-0.55, Math.cos(angle) * 1.8, Math.sin(angle) * 1.8);
    junctionRod.castShadow = true;
    armatureGroup.add(junctionRod);
    junctionRods.push(junctionRod);
  }

  const collectorRubbers: THREE.Mesh[] = [];
  [-1, 1].forEach((dir) => {
    const collectorRubber = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.22, 0.46, 0.8)),
      materials.rubber,
    );
    collectorRubber.position.set(-0.95, dir * 1.8, 0);
    collectorRubber.castShadow = true;
    rootGroup.add(collectorRubber);
    collectorRubbers.push(collectorRubber);
  });

  // 5. Magnetic Flux Vector Field Particles
  const fluxGeo = trackGeo(new THREE.BufferGeometry());
  const fluxPositions = new Float32Array(FLUX_COUNT * 3);
  const fluxColors = new Float32Array(FLUX_COUNT * 3);

  for (let i = 0; i < FLUX_COUNT; i++) {
    const idx = i * 3;
    const angle = (i * Math.PI * 2) / FLUX_COUNT;
    const radius = 1.42 + (i % 6) * 0.14;
    fluxPositions[idx] = ((i % 5) - 2) * 0.2;
    fluxPositions[idx + 1] = Math.cos(angle) * radius;
    fluxPositions[idx + 2] = Math.sin(angle) * radius;

    fluxColors[idx] = 0.2;
    fluxColors[idx + 1] = 0.85;
    fluxColors[idx + 2] = 1.0;
  }

  fluxGeo.setAttribute("position", new THREE.BufferAttribute(fluxPositions, 3));
  fluxGeo.setAttribute("color", new THREE.BufferAttribute(fluxColors, 3));

  const fluxPoints = new THREE.Points(fluxGeo, materials.fluxMat);
  rootGroup.add(fluxPoints);

  const nodes: GrammeDynamoModelNodes = {
    rootGroup,
    bedplate,
    pedestals,
    statorGroup,
    poleShoes,
    fieldCoils,
    armatureGroup,
    shaft,
    ironRing,
    coilSectors,
    junctionRods,
    collectorRubbers,
    fluxPoints,
    fluxPositions,
    fluxCount: FLUX_COUNT,
  };

  const dispose = () => {
    for (const m of materialsToDispose) m.dispose();
    for (const g of geometriesToDispose) g.dispose();
    for (const t of texturesToDispose) t.dispose();
  };

  return { rootGroup, nodes, materials, dispose };
}

/**
 * Updates armature rotation, magnetic flux flow, and cutaway mode.
 */
export function updateGrammeDynamoKinematics(
  nodes: GrammeDynamoModelNodes,
  materials: GrammeDynamoMaterials,
  dt: number,
  timeSec: number,
  _shaftRate: number,
  _inducedEmfIndex: number,
  displayRadPerFrame: number,
  fluxOpacity: number,
  showMagneticFlux: boolean,
  isCutaway: boolean,
) {
  const gramme = stepGrammeDynamo({});
  const radiansPerSec = displayRadPerFrame * gramme.displayFps;
  nodes.armatureGroup.rotation.x += radiansPerSec * dt;

  const ring = cyclicSymmetry(gramme.printedJunctionCount, 0.4 + gramme.shaftRate);
  let peak = 1e-9;
  for (let i = 0; i < gramme.printedJunctionCount; i++) {
    peak = Math.max(peak, Math.abs(cyclicSol(ring, i)));
  }
  const pos = nodes.fluxPositions;
  for (let i = 0; i < nodes.fluxCount; i++) {
    const idx = i * 3;
    const angle =
      (i * Math.PI * 2) / nodes.fluxCount + timeSec * radiansPerSec * gramme.fluxOrbitCoupling;
    const flex = 1 + 0.18 * (cyclicSol(ring, i) / peak);
    const radius =
      grammeFluxRadius(i, gramme.fluxRadiusBase, gramme.fluxRadiusPitch, gramme.fluxRadiusWrap) *
      flex;
    pos[idx + 1] = Math.cos(angle) * radius;
    pos[idx + 2] = Math.sin(angle) * radius;
  }
  nodes.fluxPoints.geometry.attributes.position.needsUpdate = true;

  nodes.fluxPoints.visible = showMagneticFlux;
  materials.fluxMat.opacity = fluxOpacity;

  // Cutaway Mode
  materials.castIron.opacity = isCutaway ? 0.35 : 1.0;
  materials.castIron.transparent = isCutaway;
}
