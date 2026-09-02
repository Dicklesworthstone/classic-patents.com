/**
 * bardeenTransistorModel.ts
 *
 * Procedural 3D reading of Fig. 1 and Fig. 1a in US 2,524,035.
 *
 * The model is intentionally limited to structures printed in this grant:
 * block 1, plated base 2, P-type surface layer 3, barrier 4, and the close
 * spring-wire emitter 5 and collector 6. It does not reconstruct the separate
 * December 1947 laboratory fixture.
 */

import * as THREE from "three";
import {
  BARDEEN_CARRIER_RESET_PAD,
  BARDEEN_CARRIER_WRAP_PAD,
} from "@/physics/bardeenPointContactKernel";
import { createGlowPointTexture } from "./ThreeStudioScene";

export interface BardeenTransistorModelNodes {
  rootGroup: THREE.Group;
  baseFilm: THREE.Mesh;
  geBlock: THREE.Mesh;
  surfaceLayer: THREE.Mesh;
  barrierLayer: THREE.Mesh;
  emitterGroup: THREE.Group;
  collectorGroup: THREE.Group;
  emitterContact: THREE.Mesh;
  collectorContact: THREE.Mesh;
  carrierPoints: THREE.Points;
  carrierPositions: Float32Array;
  carrierCount: number;
}

export interface BardeenTransistorMaterials {
  germaniumCrystal: THREE.MeshStandardMaterial;
  baseMetal: THREE.MeshStandardMaterial;
  surfaceLayer: THREE.MeshPhysicalMaterial;
  barrierLayer: THREE.MeshPhysicalMaterial;
  springWire: THREE.MeshStandardMaterial;
  carrierMaterial: THREE.PointsMaterial;
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

const CARRIER_COUNT = 120;

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
    baseMetal: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xb87333,
        roughness: 0.25,
        metalness: 0.9,
      }),
    ),
    surfaceLayer: trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        transmission: 0.3,
        opacity: 0.62,
        transparent: true,
        roughness: 0.25,
      }),
    ),
    barrierLayer: trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xa78bfa,
        transmission: 0.2,
        opacity: 0.5,
        transparent: true,
        roughness: 0.3,
      }),
    ),
    springWire: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xb7791f,
        roughness: 0.28,
        metalness: 0.88,
      }),
    ),
    carrierMaterial: trackMat(
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

  // Heavy Brass Mounting Baseplate with Terminal Screws
  const plinth = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(7.2, 0.35, 6.2)),
    materials.baseMetal,
  );
  plinth.position.y = -1.4;
  plinth.receiveShadow = true;
  rootGroup.add(plinth);

  // Terminal binding posts on baseplate
  for (const bx of [-3.0, 0, 3.0]) {
    const post = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.16, 0.16, 0.5, 12)),
      materials.baseMetal,
    );
    post.position.set(bx, -1.05, 2.6);
    rootGroup.add(post);
  }

  // Block 1: the supporting semiconductor body shown in Fig. 1 and Fig. 1a.
  const geBlock = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(6.2, 1.1, 5.2)),
    materials.germaniumCrystal,
  );
  geBlock.position.y = -0.55;
  geBlock.castShadow = true;
  rootGroup.add(geBlock);

  // Metal film 2: the patent permits copper or gold but does not require
  // either one. The neutral copper color is a display choice, not a claim.
  const baseFilm = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(6.0, 0.12, 5.0)),
    materials.baseMetal,
  );
  baseFilm.position.y = -1.18;
  baseFilm.receiveShadow = true;
  rootGroup.add(baseFilm);

  // P-type surface layer 3 and high-resistance barrier 4 from Fig. 1a. Their
  // visible thicknesses are exaggerated so the visitor can inspect them.
  const barrierLayer = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(6.0, 0.08, 5.0)),
    materials.barrierLayer,
  );
  barrierLayer.position.y = 0.02;
  rootGroup.add(barrierLayer);

  const surfaceLayer = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(6.0, 0.1, 5.0)),
    materials.surfaceLayer,
  );
  surfaceLayer.position.y = 0.11;
  rootGroup.add(surfaceLayer);

  // Overhead Dielectric Adjustment Bridge & Clamp Mount
  const bridgeMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.7,
    }),
  );
  const wedgeMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.3,
      metalness: 0.1,
    }),
  );

  // Bridge Support Upright Columns
  for (const colX of [-3.1, 3.1]) {
    const col = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.18, 0.22, 4.0, 16)),
      bridgeMat,
    );
    col.position.set(colX, 0.6, 0);
    col.castShadow = true;
    rootGroup.add(col);
  }
  // Bridge Crossbeam
  const bridgeBeam = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(6.6, 0.25, 0.5)), bridgeMat);
  bridgeBeam.position.set(0, 2.6, 0);
  rootGroup.add(bridgeBeam);

  // Insulating Point-Contact Support Wedge
  const wedge = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.65, 1.2, 4)), wedgeMat);
  wedge.rotation.y = Math.PI / 4;
  wedge.position.set(0, 2.0, 0);
  wedge.castShadow = true;
  rootGroup.add(wedge);

  // Emitter 5 and collector 6: pointed spring wires, one of the expressly
  // described contact forms. Their separation is animated from the shared
  // source-bounded step.
  const emitterGroup = new THREE.Group();
  const collectorGroup = new THREE.Group();

  const emitterContact = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.055, 0.055, 3.1, 12)),
    materials.springWire,
  );
  emitterContact.rotation.z = -0.46;
  emitterContact.position.set(-0.7, 1.5, 0);
  emitterContact.castShadow = true;
  emitterGroup.add(emitterContact);
  rootGroup.add(emitterGroup);

  const collectorContact = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.055, 0.055, 3.1, 12)),
    materials.springWire,
  );
  collectorContact.rotation.z = 0.46;
  collectorContact.position.set(0.7, 1.5, 0);
  collectorContact.castShadow = true;
  collectorGroup.add(collectorContact);
  rootGroup.add(collectorGroup);

  // Deterministic illustrative carrier paths. Their speed is explicitly a
  // display mapping; the grant does not report carrier lifetime or transit time.
  const carrierGeometry = trackGeo(new THREE.BufferGeometry());
  const carrierPositions = new Float32Array(CARRIER_COUNT * 3);
  for (let i = 0; i < CARRIER_COUNT; i++) {
    const fraction = i / CARRIER_COUNT;
    carrierPositions[i * 3] = -0.6 + fraction * 1.2;
    carrierPositions[i * 3 + 1] = 0.18 - (i % 7) * 0.025;
    carrierPositions[i * 3 + 2] = ((i % 11) / 10 - 0.5) * 0.9;
  }
  carrierGeometry.setAttribute("position", new THREE.BufferAttribute(carrierPositions, 3));
  const carrierPoints = new THREE.Points(carrierGeometry, materials.carrierMaterial);
  rootGroup.add(carrierPoints);

  const nodes: BardeenTransistorModelNodes = {
    rootGroup,
    baseFilm,
    geBlock,
    surfaceLayer,
    barrierLayer,
    emitterGroup,
    collectorGroup,
    emitterContact,
    collectorContact,
    carrierPoints,
    carrierPositions,
    carrierCount: CARRIER_COUNT,
  };

  const dispose = () => {
    for (const m of materialsToDispose) m.dispose();
    for (const g of geometriesToDispose) g.dispose();
    for (const t of texturesToDispose) t.dispose();
  };

  return { rootGroup, nodes, materials, dispose };
}

/**
 * Updates point-contact spacing, illustrative carrier motion, and cutaway mode.
 */
export function updateBardeenTransistorKinematics(
  nodes: BardeenTransistorModelNodes,
  materials: BardeenTransistorMaterials,
  dt: number,
  _timeSec: number,
  gapStudioUnits: number,
  carrierDisplaySpeed: number,
  showCarrierPaths: boolean,
  isCutaway: boolean,
) {
  const currentGapUnits = gapStudioUnits;
  nodes.emitterGroup.position.x = -currentGapUnits / 2;
  nodes.collectorGroup.position.x = currentGapUnits / 2;

  const displayStep = carrierDisplaySpeed * dt;
  const pos = nodes.carrierPositions;

  for (let i = 0; i < nodes.carrierCount; i++) {
    const idx = i * 3;
    pos[idx] += displayStep;
    if (pos[idx] > currentGapUnits / 2 + BARDEEN_CARRIER_WRAP_PAD) {
      pos[idx] = -currentGapUnits / 2 - BARDEEN_CARRIER_RESET_PAD;
    }
  }
  nodes.carrierPoints.geometry.attributes.position.needsUpdate = true;
  nodes.carrierPoints.visible = showCarrierPaths && carrierDisplaySpeed > 0;
  nodes.collectorGroup.visible = showCarrierPaths;

  // Cutaway Mode
  materials.germaniumCrystal.opacity = isCutaway ? 0.45 : 1.0;
  materials.germaniumCrystal.transparent = isCutaway;
  materials.surfaceLayer.opacity = isCutaway ? 0.85 : 0.62;
  materials.barrierLayer.opacity = isCutaway ? 0.75 : 0.5;
}
