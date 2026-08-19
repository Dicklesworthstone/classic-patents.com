/**
 * davenportElectricMotorModel.ts
 *
 * Museum-Grade Procedural 3D Model for Thomas Davenport's 1837 Commutator DC Electric Motor
 * (US Patent 132 - "Improvement in Propelling Machinery by Magnetism and Electro-Magnetism").
 *
 * Reconstructs the first patented electric motor in the United States:
 * 1. Turned circular mahogany wooden baseboard with turned brass ball feet and knurled binding posts.
 * 2. Stationary semicircular horseshoe electromagnets (Stator) with silk-insulated copper coils (Claim 1).
 * 3. Revolving cross-shaped 4-pole rotor armature with soft-iron cores and copper wire windings (Claim 2).
 * 4. Split-ring commutator segments on vertical steel drive shaft with copper spring leaf brushes.
 * 5. Dynamic commutator contact spark photons and brass bridge frame stanchions.
 */

import * as THREE from "three";
import { gaMotorFrameIndex, gaMotorOrbit } from "@/physics/genericWasm";
import { createLcg } from "@/utils/lcg";

const lcg = createLcg(2287);

export interface DavenportMotorModelNodes {
  rootGroup: THREE.Group;
  baseboard: THREE.Mesh;
  pillars: THREE.Mesh[];
  statorGroup: THREE.Group;
  statorCoils: THREE.Mesh[];
  rotorGroup: THREE.Group;
  rotorPoles: THREE.Mesh[];
  shaft: THREE.Mesh;
  commutator: THREE.Mesh;
  brushes: THREE.Mesh[];
  sparkPoints: THREE.Points;
  sparkPositions: Float32Array;
  sparkCount: number;
  bindingPosts?: THREE.Group;
}

export interface DavenportMotorMaterials {
  mahogany: THREE.MeshStandardMaterial;
  ironCore: THREE.MeshStandardMaterial;
  copperWire: THREE.MeshStandardMaterial;
  brass: THREE.MeshStandardMaterial;
  steelShaft: THREE.MeshStandardMaterial;
  sparkMat: THREE.PointsMaterial;
  ebonite?: THREE.MeshStandardMaterial;
}

export interface DavenportMotorModelResult {
  rootGroup: THREE.Group;
  nodes: DavenportMotorModelNodes;
  materials: DavenportMotorMaterials;
  dispose: () => void;
}

const SPARK_COUNT = 30;

/**
 * Deterministic unit noise for procedural grain generation.
 */
function deterministicUnit(index: number, channel: number): number {
  const sample = Math.sin((index + 1) * 12.9898 + (channel + 1) * 78.233) * 43758.5453;
  return sample - Math.floor(sample);
}

/**
 * Procedural Mahogany Grain Texture
 */
function createMahoganyTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  // Rich warm mahogany red-brown
  ctx.fillStyle = "#4a1e0d";
  ctx.fillRect(0, 0, 512, 512);

  // Growth rings & figure
  for (let i = 0; i < 95; i++) {
    const x = i * 5.5 + (deterministicUnit(i, 0) - 0.5) * 4;
    const alpha = 0.07 + (i % 4 === 0 ? 0.14 : 0.04);
    ctx.strokeStyle = `rgba(120, 42, 14, ${alpha})`;
    ctx.lineWidth = 1.3 + (i % 3) * 0.5;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.bezierCurveTo(x + 16, 160, x - 12, 360, x + 8, 512);
    ctx.stroke();
  }

  // Wood pores
  for (let p = 0; p < 320; p++) {
    const px = deterministicUnit(p, 1) * 512;
    const py = deterministicUnit(p, 2) * 512;
    ctx.fillStyle = "rgba(30, 10, 4, 0.28)";
    ctx.fillRect(px, py, 1.8, 5 + deterministicUnit(p, 3) * 8);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildDavenportMotorModel(): DavenportMotorModelResult {
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

  const mahoganyTex = createMahoganyTexture();
  if (mahoganyTex) texturesToDispose.push(mahoganyTex);

  // --- Museum-Grade Materials ---
  const mahogany = trackMat(
    new THREE.MeshStandardMaterial({
      ...(mahoganyTex ? { map: mahoganyTex } : {}),
      color: 0x4a1e0d,
      roughness: 0.45,
      metalness: 0.05,
    }),
  );

  const ironCore = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x22272e,
      roughness: 0.62,
      metalness: 0.85,
    }),
  );

  const copperWire = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.3,
      metalness: 0.9,
    }),
  );

  const brass = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.22,
      metalness: 0.92,
    }),
  );

  const steelShaft = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.12,
      metalness: 0.95,
    }),
  );

  const ebonite = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.55,
      metalness: 0.1,
    }),
  );

  const sparkMat = trackMat(
    new THREE.PointsMaterial({
      size: 0.25,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      color: 0x38bdf8,
      depthWrite: false,
    }),
  );

  const materials: DavenportMotorMaterials = {
    mahogany,
    ironCore,
    copperWire,
    brass,
    steelShaft,
    sparkMat,
    ebonite,
  };

  // --- 1. Turned Mahogany Baseboard & Brass Ball Feet ---
  const baseGroup = new THREE.Group();
  rootGroup.add(baseGroup);

  const baseboard = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(4.4, 4.6, 0.65, 36)),
    materials.mahogany,
  );
  baseboard.position.y = -2.0;
  baseboard.receiveShadow = true;
  baseboard.castShadow = true;
  baseGroup.add(baseboard);

  // Concentric turned molding groove on top of baseboard
  const baseGroove = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(4.1, 0.06, 8, 36)),
    materials.mahogany,
  );
  baseGroove.rotation.x = Math.PI / 2;
  baseGroove.position.y = -1.65;
  baseGroup.add(baseGroove);

  // 4 Turned Brass Ball Feet with Flanged Necks
  [
    [-2.8, -2.8],
    [2.8, -2.8],
    [-2.8, 2.8],
    [2.8, 2.8],
  ].forEach(([fx, fz]) => {
    const footGroup = new THREE.Group();
    footGroup.position.set(fx, -2.4, fz);

    const footBall = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.32, 16, 16)),
      materials.brass,
    );
    footBall.castShadow = true;
    footGroup.add(footBall);

    const neck = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.18, 0.25, 0.15, 16)),
      materials.brass,
    );
    neck.position.y = 0.22;
    footGroup.add(neck);

    baseGroup.add(footGroup);
  });

  // Battery Terminal Binding Posts with Knurled Thumbscrews
  const bindingPosts = new THREE.Group();
  bindingPosts.position.set(0, -1.65, 3.4);
  rootGroup.add(bindingPosts);

  [-0.6, 0.6].forEach((tx) => {
    const post = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.14, 0.14, 0.5, 16)),
      materials.brass,
    );
    post.position.x = tx;
    post.castShadow = true;
    bindingPosts.add(post);

    const nut = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.24, 0.24, 0.18, 16)),
      materials.brass,
    );
    nut.position.set(tx, 0.3, 0);
    nut.castShadow = true;
    bindingPosts.add(nut);
  });

  // 4 Turned Brass Baluster Pillars Supporting Top Plate
  const pillars: THREE.Mesh[] = [];
  [
    [-2.4, -2.4],
    [2.4, -2.4],
    [-2.4, 2.4],
    [2.4, 2.4],
  ].forEach(([sx, sz]) => {
    const pillar = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.18, 0.22, 3.8, 16)),
      materials.brass,
    );
    pillar.position.set(sx, 0, sz);
    pillar.castShadow = true;
    rootGroup.add(pillar);
    pillars.push(pillar);

    // Turned baluster collar details on pillar
    const midRing = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.25, 0.05, 8, 16)),
      materials.brass,
    );
    midRing.rotation.x = Math.PI / 2;
    midRing.position.set(sx, 0, sz);
    rootGroup.add(midRing);
  });

  // Top brass plate connecting stanchions
  const topPlate = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(4.0, 4.0, 0.1, 32)),
    materials.brass,
  );
  topPlate.position.y = 1.9;
  topPlate.castShadow = true;
  rootGroup.add(topPlate);

  // Journal Bearing Sleeve on Top Plate with Turned Oil Cup
  const topBearing = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.3, 0.3, 0.35, 20)),
    materials.brass,
  );
  topBearing.position.y = 2.05;
  rootGroup.add(topBearing);

  const oilCup = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.14, 0.28, 12)), materials.brass);
  oilCup.position.set(0.38, 2.18, 0);
  rootGroup.add(oilCup);

  // --- 2. Stationary Semicircular Horseshoe Electromagnets (Stator) (Claim 1) ---
  const statorGroup = new THREE.Group();
  rootGroup.add(statorGroup);
  const statorCoils: THREE.Mesh[] = [];

  [-1, 1].forEach((dir) => {
    const magnetGroup = new THREE.Group();
    magnetGroup.position.x = dir * 2.2;

    // Curved soft iron horseshoe core
    const core = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(1.4, 0.35, 16, 24, Math.PI)),
      materials.ironCore,
    );
    core.rotation.z = dir > 0 ? -Math.PI / 2 : Math.PI / 2;
    core.castShadow = true;
    magnetGroup.add(core);

    // Silk-wrapped copper wire coils on each pole leg
    [-0.8, 0.8].forEach((cy) => {
      const coil = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.58, 0.58, 1.25, 20)),
        materials.copperWire,
      );
      coil.position.set(0, cy, 0);
      coil.castShadow = true;
      magnetGroup.add(coil);
      statorCoils.push(coil);
    });

    statorGroup.add(magnetGroup);
  });

  // --- 3. Revolving Cross-Shaped 4-Pole Rotor Armature (Claim 2) ---
  const rotorGroup = new THREE.Group();
  rootGroup.add(rotorGroup);

  const shaft = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.14, 0.14, 5.0, 16)),
    materials.steelShaft,
  );
  shaft.castShadow = true;
  rotorGroup.add(shaft);

  // Brass shaft balancing collar
  const shaftCollar = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.28, 0.28, 0.2, 16)),
    materials.brass,
  );
  shaftCollar.position.y = -0.7;
  rotorGroup.add(shaftCollar);

  const rotorPoles: THREE.Mesh[] = [];
  for (let p = 0; p < 4; p++) {
    const pAngle = (p * Math.PI) / 2;
    const poleGroup = new THREE.Group();
    poleGroup.rotation.y = pAngle;

    // Soft iron cylindrical core
    const ironPole = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.2, 0.2, 1.65, 14)),
      materials.ironCore,
    );
    ironPole.rotation.z = Math.PI / 2;
    ironPole.position.x = 0.92;
    poleGroup.add(ironPole);

    // Copper wire armature bobbin with end flanges
    const coil = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.44, 0.44, 1.15, 18)),
      materials.copperWire,
    );
    coil.rotation.z = Math.PI / 2;
    coil.position.x = 0.92;
    coil.castShadow = true;
    poleGroup.add(coil);
    rotorPoles.push(coil);

    // Outer soft-iron pole shoe
    const poleShoe = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.26, 0.26, 0.12, 14)),
      materials.ironCore,
    );
    poleShoe.rotation.z = Math.PI / 2;
    poleShoe.position.x = 1.65;
    poleGroup.add(poleShoe);

    rotorGroup.add(poleGroup);
  }

  // --- 4. Split-Ring Commutator & Copper Leaf Brushes ---
  const commutatorGroup = new THREE.Group();
  commutatorGroup.position.y = 1.6;
  rotorGroup.add(commutatorGroup);

  const commutator = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.38, 0.38, 0.5, 24)),
    materials.brass,
  );
  commutator.castShadow = true;
  commutatorGroup.add(commutator);

  // Ebonite insulating split segments between commutator halves
  [-1, 1].forEach((dir) => {
    const splitInsulator = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.04, 0.52, 0.8)),
      ebonite,
    );
    splitInsulator.rotation.y = dir * (Math.PI / 4);
    commutatorGroup.add(splitInsulator);
  });

  const brushes: THREE.Mesh[] = [];
  [-0.52, 0.52].forEach((bx) => {
    const brushHolderGroup = new THREE.Group();
    brushHolderGroup.position.set(bx, 1.6, 0);

    // Spring copper leaf contact
    const brush = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.04, 0.85, 0.16)),
      materials.copperWire,
    );
    brush.castShadow = true;
    brushHolderGroup.add(brush);
    brushes.push(brush);

    // Turned brass brush mounting post
    const holderPost = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.1, 0.1, 0.6, 12)),
      materials.brass,
    );
    holderPost.position.set(bx > 0 ? 0.22 : -0.22, 0, 0);
    brushHolderGroup.add(holderPost);

    rootGroup.add(brushHolderGroup);
  });

  // --- 5. Commutator Sparks Particles ---
  const sparkGeo = trackGeo(new THREE.BufferGeometry());
  const sparkPositions = new Float32Array(SPARK_COUNT * 3);
  for (let i = 0; i < SPARK_COUNT; i++) {
    sparkPositions[i * 3] = (lcg() > 0.5 ? 0.4 : -0.4) + (lcg() - 0.5) * 0.15;
    sparkPositions[i * 3 + 1] = 1.6 + (lcg() - 0.5) * 0.2;
    sparkPositions[i * 3 + 2] = (lcg() - 0.5) * 0.2;
  }
  sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPositions, 3));
  const sparkPoints = new THREE.Points(sparkGeo, materials.sparkMat);
  rootGroup.add(sparkPoints);

  const nodes: DavenportMotorModelNodes = {
    rootGroup,
    baseboard,
    pillars,
    statorGroup,
    statorCoils,
    rotorGroup,
    rotorPoles,
    shaft,
    commutator,
    brushes,
    sparkPoints,
    sparkPositions,
    sparkCount: SPARK_COUNT,
    bindingPosts,
  };

  const dispose = () => {
    for (const m of materialsToDispose) {
      m.dispose();
    }
    for (const g of geometriesToDispose) {
      g.dispose();
    }
    for (const t of texturesToDispose) {
      t.dispose();
    }
  };

  return { rootGroup, nodes, materials, dispose };
}

/**
 * Updates Davenport motor armature rotation, commutator spark animation, and cutaway.
 */
export function updateDavenportMotorKinematics(
  nodes: DavenportMotorModelNodes,
  materials: DavenportMotorMaterials,
  dt: number,
  _timeSec: number,
  shaftOmegaRadPerS: number,
  showSparkParticles: boolean,
  isCutaway: boolean,
) {
  // 1. Rotor Armature Rotation
  nodes.rotorGroup.rotation.y += shaftOmegaRadPerS * dt;

  // 2. Commutator Spark Dynamics
  if (showSparkParticles && shaftOmegaRadPerS > 0.5) {
    nodes.sparkPoints.visible = true;
    const pos = nodes.sparkPositions;
    const orbit = gaMotorOrbit(nodes.sparkCount, 60);
    const frame = gaMotorFrameIndex(nodes.rotorGroup.rotation.y, 1, 60);
    const header = 2;
    for (let i = 0; i < nodes.sparkCount; i++) {
      const src = header + (frame * nodes.sparkCount + i) * 3;
      const idx = i * 3;
      const x = orbit[src] ?? 0;
      const y = orbit[src + 1] ?? 0;
      const z = orbit[src + 2] ?? 0;
      pos[idx] = (x - 1) * 0.5;
      pos[idx + 1] = 1.6 + z * 0.15;
      pos[idx + 2] = y * 0.2;
    }
    nodes.sparkPoints.geometry.attributes.position.needsUpdate = true;
  } else {
    nodes.sparkPoints.visible = false;
  }

  // 3. Cutaway Mode
  materials.mahogany.opacity = isCutaway ? 0.35 : 1.0;
  materials.mahogany.transparent = isCutaway;
  materials.copperWire.opacity = isCutaway ? 0.45 : 1.0;
  materials.copperWire.transparent = isCutaway;
}
