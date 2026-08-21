/**
 * bardeenTransistorModel.ts
 *
 * Museum-Grade Procedural 3D Model for John Bardeen & Walter Brattain's 1948 Point-Contact Transistor
 * (US Patent 2,569,347 - "Three-Electrode Circuit Element Utilizing Semiconductive Materials").
 *
 * Reconstructs the Bell Labs point-contact germanium transistor:
 * 1. Heavy copper grounding base platen providing ohmic base connection.
 * 2. High-purity n-type etched germanium crystal slab with crystalline grain (Claim 1).
 * 3. Triangular polystyrene plastic wedge with razor-slit gold foil ribbon (Claim 2).
 * 4. Microscopic point contacts (~50 µm spacing) forming emitter and collector electrodes.
 * 5. Phosphor-bronze cantilever spring and brass knurled adjustment micrometer screw.
 * 6. Minority carrier (positive hole) drift particle stream injected across the space-charge inversion layer.
 */

import * as THREE from "three";
import { BARDEEN_HOLE_RESET_PAD, BARDEEN_HOLE_WRAP_PAD } from "@/physics/catalogKernels";
import { heatFrames, sampleHeatAt } from "@/physics/genericWasm";
import { createLcg } from "@/utils/lcg";
import { createGlowPointTexture } from "./ThreeStudioScene";

const lcg = createLcg(1770);

export interface BardeenTransistorModelNodes {
  rootGroup: THREE.Group;
  basePlaten: THREE.Mesh;
  baseLug: THREE.Mesh;
  geBlock: THREE.Mesh;
  wedge: THREE.Mesh;
  springGroup: THREE.Group;
  springArm: THREE.Mesh;
  adjustmentScrew: THREE.Mesh;
  post: THREE.Mesh;
  emitterGroup: THREE.Group;
  collectorGroup: THREE.Group;
  emitterFoil: THREE.Mesh;
  collectorFoil: THREE.Mesh;
  holePoints: THREE.Points;
  holePos: Float32Array;
  holeCount: number;
}

export interface BardeenTransistorMaterials {
  germaniumCrystal: THREE.MeshStandardMaterial;
  goldFoil: THREE.MeshStandardMaterial;
  polystyreneWedge: THREE.MeshPhysicalMaterial;
  phosphorBronze: THREE.MeshStandardMaterial;
  copperPlaten: THREE.MeshStandardMaterial;
  brass: THREE.MeshStandardMaterial;
  holeMat: THREE.PointsMaterial;
}

export interface BardeenTransistorModelResult {
  rootGroup: THREE.Group;
  nodes: BardeenTransistorModelNodes;
  materials: BardeenTransistorMaterials;
  dispose: () => void;
}

/**
 * Deterministic unit noise for procedural texture generation.
 */
function deterministicUnit(index: number, channel: number): number {
  const sample = Math.sin((index + 1) * 12.9898 + (channel + 1) * 78.233) * 43758.5453;
  return sample - Math.floor(sample);
}

/**
 * Procedural Etched N-Type Germanium Crystal Texture
 */
function createGermaniumTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  // Dark slate-gray metallic semiconductor base
  ctx.fillStyle = "#334155";
  ctx.fillRect(0, 0, 512, 512);

  // Crystal cleavage striations & chemical etch pits
  for (let i = 0; i < 70; i++) {
    const y = i * 7.5 + (deterministicUnit(i, 0) - 0.5) * 5;
    const alpha = 0.08 + (i % 3 === 0 ? 0.12 : 0.03);
    ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y + (deterministicUnit(i, 1) - 0.5) * 15);
    ctx.stroke();
  }

  // Microscopic etch pits & grain boundaries
  for (let p = 0; p < 220; p++) {
    const px = deterministicUnit(p, 2) * 512;
    const py = deterministicUnit(p, 3) * 512;
    ctx.fillStyle = "rgba(15, 23, 42, 0.35)";
    ctx.beginPath();
    ctx.arc(px, py, 1.5 + deterministicUnit(p, 4) * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const HOLE_COUNT = 120;

export function buildBardeenTransistorModel(): BardeenTransistorModelResult {
  const rootGroup = new THREE.Group();
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

  const geTex = createGermaniumTexture();
  if (geTex) texturesToDispose.push(geTex);

  const glowTex = createGlowPointTexture();
  texturesToDispose.push(glowTex);

  // Materials
  const materials: BardeenTransistorMaterials = {
    germaniumCrystal: trackMat(
      new THREE.MeshStandardMaterial({
        ...(geTex ? { map: geTex } : {}),
        color: 0x475569,
        roughness: 0.15,
        metalness: 0.85,
      }),
    ),
    goldFoil: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.1,
        metalness: 0.98,
      }),
    ),
    polystyreneWedge: trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.88,
        opacity: 0.9,
        transparent: true,
        roughness: 0.1,
        ior: 1.5,
      }),
    ),
    phosphorBronze: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xb45309,
        roughness: 0.2,
        metalness: 0.92,
      }),
    ),
    copperPlaten: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xc25e1a,
        roughness: 0.25,
        metalness: 0.9,
      }),
    ),
    brass: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.22,
        metalness: 0.92,
      }),
    ),
    holeMat: trackMat(
      new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 0.22,
        map: glowTex,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    ),
  };

  // 1. Heavy Copper Grounding Base Platen with Screw Terminals
  const basePlaten = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(8.2, 0.5, 6.8)),
    materials.copperPlaten,
  );
  basePlaten.position.y = -1.35;
  basePlaten.receiveShadow = true;
  rootGroup.add(basePlaten);

  const baseLug = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.12, 0.12, 1.4, 12)),
    materials.brass,
  );
  baseLug.rotation.z = Math.PI / 2;
  baseLug.position.set(-3.8, -1.35, 0);
  baseLug.castShadow = true;
  rootGroup.add(baseLug);

  // Platen Corner Fastener Screws
  [
    [-3.6, -2.9],
    [3.6, -2.9],
    [-3.6, 2.9],
    [3.6, 2.9],
  ].forEach(([sx, sz]) => {
    const screw = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.18, 0.18, 0.15, 16)),
      materials.brass,
    );
    screw.position.set(sx, -1.05, sz);
    rootGroup.add(screw);
  });

  // 2. Germanium Crystal Slab (US 2,524,035 Claim 1)
  const geBlock = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(6.2, 1.1, 5.2)),
    materials.germaniumCrystal,
  );
  geBlock.position.y = -0.55;
  geBlock.castShadow = true;
  rootGroup.add(geBlock);

  // 3. Polystyrene Wedge with Razor Slit Apex
  const wedgeShape = new THREE.Shape();
  wedgeShape.moveTo(-0.9, 2.2);
  wedgeShape.lineTo(0.9, 2.2);
  wedgeShape.lineTo(0, 0.05);
  wedgeShape.closePath();

  const wedgeGeo = trackGeo(
    new THREE.ExtrudeGeometry(wedgeShape, { depth: 0.8, bevelEnabled: false }),
  );
  wedgeGeo.center();
  const wedge = new THREE.Mesh(wedgeGeo, materials.polystyreneWedge);
  wedge.position.set(0, 1.25, 0);
  rootGroup.add(wedge);

  // 4. Phosphor-Bronze Cantilever Spring & Micrometer Screw
  const springGroup = new THREE.Group();
  springGroup.position.set(0, 2.6, 0);

  const springArm = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.35, 0.08, 3.2)),
    materials.phosphorBronze,
  );
  springGroup.add(springArm);

  const adjustmentScrew = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.24, 0.24, 0.9, 24)),
    materials.brass,
  );
  adjustmentScrew.position.set(0, 0.45, 1.2);
  adjustmentScrew.castShadow = true;
  springGroup.add(adjustmentScrew);

  const post = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.18, 0.18, 3.6, 16)),
    materials.brass,
  );
  post.position.set(0, -1.2, 1.2);
  post.castShadow = true;
  springGroup.add(post);

  rootGroup.add(springGroup);

  // 5. Emitter and Collector Electrodes
  const emitterGroup = new THREE.Group();
  const collectorGroup = new THREE.Group();

  const emitterFoil = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.18, 1.8, 0.75)),
    materials.goldFoil,
  );
  emitterFoil.rotation.z = -0.42;
  emitterFoil.position.set(-0.55, 1.1, 0);
  emitterFoil.castShadow = true;
  emitterGroup.add(emitterFoil);

  const emitterWire = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 8)),
    materials.phosphorBronze,
  );
  emitterWire.rotation.z = -0.6;
  emitterWire.position.set(-1.4, 2.0, 0);
  emitterGroup.add(emitterWire);
  rootGroup.add(emitterGroup);

  const collectorFoil = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.18, 1.8, 0.75)),
    materials.goldFoil,
  );
  collectorFoil.rotation.z = 0.42;
  collectorFoil.position.set(0.55, 1.1, 0);
  collectorFoil.castShadow = true;
  collectorGroup.add(collectorFoil);

  const collectorWire = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 8)),
    materials.phosphorBronze,
  );
  collectorWire.rotation.z = 0.6;
  collectorWire.position.set(1.4, 2.0, 0);
  collectorGroup.add(collectorWire);
  rootGroup.add(collectorGroup);

  // 6. Minority Carrier (Hole) Drift Particles
  const holeGeo = trackGeo(new THREE.BufferGeometry());
  const holePos = new Float32Array(HOLE_COUNT * 3);
  for (let i = 0; i < HOLE_COUNT; i++) {
    holePos[i * 3] = -0.6 + lcg() * 1.2;
    holePos[i * 3 + 1] = 0.05 - lcg() * 0.35;
    holePos[i * 3 + 2] = (lcg() - 0.5) * 0.8;
  }
  holeGeo.setAttribute("position", new THREE.BufferAttribute(holePos, 3));
  const holePoints = new THREE.Points(holeGeo, materials.holeMat);
  rootGroup.add(holePoints);

  const nodes: BardeenTransistorModelNodes = {
    rootGroup,
    basePlaten,
    baseLug,
    geBlock,
    wedge,
    springGroup,
    springArm,
    adjustmentScrew,
    post,
    emitterGroup,
    collectorGroup,
    emitterFoil,
    collectorFoil,
    holePoints,
    holePos,
    holeCount: HOLE_COUNT,
  };

  const dispose = () => {
    for (const m of materialsToDispose) m.dispose();
    for (const g of geometriesToDispose) g.dispose();
    for (const t of texturesToDispose) t.dispose();
  };

  return { rootGroup, nodes, materials, dispose };
}

/**
 * Updates point contact gap spacing, hole diffusion drift velocity, and cutaway mode.
 */
export function updateBardeenTransistorKinematics(
  nodes: BardeenTransistorModelNodes,
  materials: BardeenTransistorMaterials,
  dt: number,
  _timeSec: number,
  gapStudioUnits: number,
  holeDriftSpeed: number,
  showHoleDrift: boolean,
  isCutaway: boolean,
) {
  const currentGapUnits = gapStudioUnits;
  nodes.emitterGroup.position.x = -currentGapUnits / 2;
  nodes.collectorGroup.position.x = currentGapUnits / 2;

  const driftSpeed = holeDriftSpeed * dt;
  const pos = nodes.holePos;
  const heat = heatFrames(12, 16, 2);
  const heatFrame = Math.abs(Math.floor(_timeSec * 8)) % 16;

  for (let i = 0; i < nodes.holeCount; i++) {
    const idx = i * 3;
    const u = (pos[idx] / Math.max(0.1, currentGapUnits)) * 0.5 + 0.5;
    const local = 1 + Math.abs(sampleHeatAt(heat, 12, 16, heatFrame, u, 0.5));
    pos[idx] += driftSpeed * local;
    if (pos[idx] > currentGapUnits / 2 + BARDEEN_HOLE_WRAP_PAD) {
      pos[idx] = -currentGapUnits / 2 - BARDEEN_HOLE_RESET_PAD;
    }
  }
  nodes.holePoints.geometry.attributes.position.needsUpdate = true;
  nodes.holePoints.visible = showHoleDrift;

  // Cutaway Mode
  materials.germaniumCrystal.opacity = isCutaway ? 0.45 : 1.0;
  materials.germaniumCrystal.transparent = isCutaway;
  materials.polystyreneWedge.transmission = isCutaway ? 0.95 : 0.88;
}
