/**
 * davenportElectricMotorModel.ts
 *
 * Museum-Grade Procedural 3D Model for Thomas Davenport's 1837 Commutator DC Electric Motor
 * (US Patent 132 - "Improvement in Propelling Machinery by Magnetism and Electro-Magnetism").
 *
 * Reconstructs the first patented electric motor in the United States:
 * 1. Turned circular mahogany wooden baseboard with turned brass stanchions.
 * 2. Stationary semicircular horseshoe electromagnets (Stator) with silk-insulated copper coils.
 * 3. Revolving cross-shaped 4-pole rotor armature with soft-iron cores and copper wire windings.
 * 4. Split-ring commutator segments on vertical steel drive shaft with copper spring leaf brushes.
 * 5. Dynamic commutator contact spark photons.
 */

import * as THREE from "three";
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
}

export interface DavenportMotorMaterials {
  mahogany: THREE.MeshStandardMaterial;
  ironCore: THREE.MeshStandardMaterial;
  copperWire: THREE.MeshStandardMaterial;
  brass: THREE.MeshStandardMaterial;
  steelShaft: THREE.MeshStandardMaterial;
  sparkMat: THREE.PointsMaterial;
}

export interface DavenportMotorModelResult {
  rootGroup: THREE.Group;
  nodes: DavenportMotorModelNodes;
  materials: DavenportMotorMaterials;
  dispose: () => void;
}

const SPARK_COUNT = 30;

export function buildDavenportMotorModel(): DavenportMotorModelResult {
  const rootGroup = new THREE.Group();
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    geometriesToDispose.push(geo);
    return geo;
  };
  const trackMat = <T extends THREE.Material>(mat: T): T => {
    materialsToDispose.push(mat);
    return mat;
  };

  // Materials
  const materials: DavenportMotorMaterials = {
    mahogany: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x5c2c16,
        roughness: 0.5,
        metalness: 0.05,
      }),
    ),
    ironCore: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.4,
        metalness: 0.85,
      }),
    ),
    copperWire: trackMat(
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
    steelShaft: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.1,
        metalness: 0.95,
      }),
    ),
    sparkMat: trackMat(
      new THREE.PointsMaterial({
        size: 0.25,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        color: 0x38bdf8,
        depthWrite: false,
      }),
    ),
  };

  // 1. Turned Mahogany Baseboard & Brass Stanchions
  const baseboard = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(4.2, 4.5, 0.6, 36)),
    materials.mahogany,
  );
  baseboard.position.y = -2.0;
  baseboard.receiveShadow = true;
  rootGroup.add(baseboard);

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
    rootGroup.add(pillar);
    pillars.push(pillar);
  });

  // Top brass plate connecting stanchions
  const topPlate = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(4.0, 4.0, 0.1, 32)),
    materials.brass,
  );
  topPlate.position.y = 1.9;
  rootGroup.add(topPlate);

  // 2. Stationary Semicircular Horseshoe Electromagnets (Stator) (Claim 1)
  const statorGroup = new THREE.Group();
  rootGroup.add(statorGroup);
  const statorCoils: THREE.Mesh[] = [];

  [-1, 1].forEach((dir) => {
    const magnetGroup = new THREE.Group();
    magnetGroup.position.x = dir * 2.2;

    const core = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(1.4, 0.35, 16, 24, Math.PI)),
      materials.ironCore,
    );
    core.rotation.z = dir > 0 ? -Math.PI / 2 : Math.PI / 2;
    magnetGroup.add(core);

    [-0.8, 0.8].forEach((cy) => {
      const coil = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.55, 0.55, 1.2, 20)),
        materials.copperWire,
      );
      coil.position.set(0, cy, 0);
      coil.castShadow = true;
      magnetGroup.add(coil);
      statorCoils.push(coil);
    });

    statorGroup.add(magnetGroup);
  });

  // 3. Revolving Cross-Shaped Rotor Armature (Claim 2)
  const rotorGroup = new THREE.Group();
  rootGroup.add(rotorGroup);

  const shaft = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.14, 0.14, 5.0, 16)),
    materials.steelShaft,
  );
  shaft.castShadow = true;
  rotorGroup.add(shaft);

  const rotorPoles: THREE.Mesh[] = [];
  for (let p = 0; p < 4; p++) {
    const pAngle = (p * Math.PI) / 2;
    const poleGroup = new THREE.Group();
    poleGroup.rotation.y = pAngle;

    const ironPole = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.2, 0.2, 1.6, 12)),
      materials.ironCore,
    );
    ironPole.rotation.z = Math.PI / 2;
    ironPole.position.x = 0.9;
    poleGroup.add(ironPole);

    const coil = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.42, 0.42, 1.1, 16)),
      materials.copperWire,
    );
    coil.rotation.z = Math.PI / 2;
    coil.position.x = 0.9;
    coil.castShadow = true;
    poleGroup.add(coil);
    rotorPoles.push(coil);

    rotorGroup.add(poleGroup);
  }

  // 4. Split-Ring Commutator & Copper Leaf Brushes
  const commutator = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.38, 0.38, 0.5, 24)),
    materials.brass,
  );
  commutator.position.y = 1.6;
  rotorGroup.add(commutator);

  const brushes: THREE.Mesh[] = [];
  [-0.5, 0.5].forEach((bx) => {
    const brush = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.04, 0.8, 0.15)),
      materials.copperWire,
    );
    brush.position.set(bx, 1.6, 0);
    rootGroup.add(brush);
    brushes.push(brush);
  });

  // 5. Commutator Sparks Particles
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
  };

  const dispose = () => {
    for (const m of materialsToDispose) {
      m.dispose();
    }
    for (const g of geometriesToDispose) {
      g.dispose();
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
    for (let i = 0; i < nodes.sparkCount; i++) {
      const idx = i * 3;
      pos[idx] = (lcg() > 0.5 ? 0.4 : -0.4) + (lcg() - 0.5) * 0.15;
      pos[idx + 1] = 1.6 + (lcg() - 0.5) * 0.2;
      pos[idx + 2] = (lcg() - 0.5) * 0.2;
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
