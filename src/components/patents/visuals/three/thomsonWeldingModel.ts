/**
 * thomsonWeldingModel.ts
 *
 * Museum-Grade Procedural 3D Model for Elihu Thomson's 1886 Electric Resistance Butt-Welding
 * (US Patent 347,140).
 *
 * Reconstructs the original electric resistance welding machine:
 * 1. Heavy cast-iron workshop machine bed.
 * 2. Step-down transformer with laminated magnetic iron core loop and heavy secondary single-turn copper winding.
 * 3. Massive dual copper clamping jaws (fixed left jaw, sliding right jaw with axial compression screw).
 * 4. Clamped steel workpieces undergoing solid-state plastic upset welding.
 * 5. White-hot plastic weld seam bulging with temperature-dependent incandescence.
 * 6. Deterministic incandescent spark particle ejection system.
 */

import * as THREE from "three";
import { createLcg } from "@/utils/lcg";

const lcg = createLcg(1458);

export interface ThomsonWeldingModelNodes {
  rootGroup: THREE.Group;
  bedGroup: THREE.Group;
  transformerGroup: THREE.Group;
  secondaryBar: THREE.Mesh;
  clampGroup: THREE.Group;
  leftJaw: THREE.Mesh;
  rightJaw: THREE.Mesh;
  compressionScrew: THREE.Mesh;
  leftBar: THREE.Mesh;
  rightBar: THREE.Mesh;
  weldSeam: THREE.Mesh;
  sparkPoints: THREE.Points;
}

export interface ThomsonWeldingMaterials {
  castIron: THREE.MeshStandardMaterial;
  heavyCopper: THREE.MeshStandardMaterial;
  steelWorkpiece: THREE.MeshStandardMaterial;
  glowingWeld: THREE.MeshStandardMaterial;
  sparkPoints: THREE.PointsMaterial;
}

export interface ThomsonWeldingModelResult {
  rootGroup: THREE.Group;
  nodes: ThomsonWeldingModelNodes;
  materials: ThomsonWeldingMaterials;
  dispose: () => void;
}

const SPARK_COUNT = 72;

export function buildThomsonWeldingModel(): ThomsonWeldingModelResult {
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
  const materials: ThomsonWeldingMaterials = {
    castIron: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.5,
        metalness: 0.85,
      }),
    ),
    heavyCopper: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xb45309,
        roughness: 0.25,
        metalness: 0.9,
      }),
    ),
    steelWorkpiece: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.2,
        metalness: 0.9,
      }),
    ),
    glowingWeld: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xffedd5,
        roughness: 0.1,
        emissive: 0xff5500,
        emissiveIntensity: 1.0,
      }),
    ),
    sparkPoints: trackMat(
      new THREE.PointsMaterial({
        size: 0.18,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        color: 0xffaa00,
      }),
    ),
  };

  // 1. Heavy Machine Bed Plinth
  const bedGroup = new THREE.Group();
  rootGroup.add(bedGroup);

  const bed = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(10.0, 0.8, 5.5)), materials.castIron);
  bed.position.y = -2.2;
  bed.receiveShadow = true;
  bedGroup.add(bed);

  // 2. Transformer Laminated Core Loop & Single-Turn Secondary
  const transformerGroup = new THREE.Group();
  transformerGroup.position.set(0, -1.2, 0);
  rootGroup.add(transformerGroup);

  const coreMesh = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(4.2, 1.4, 2.2)),
    materials.castIron,
  );
  transformerGroup.add(coreMesh);

  const secondaryBar = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(4.8, 0.4, 0.8)),
    materials.heavyCopper,
  );
  secondaryBar.position.y = 0.9;
  transformerGroup.add(secondaryBar);

  // 3. Clamping Jaws & Workpieces (Claim 2)
  const clampGroup = new THREE.Group();
  rootGroup.add(clampGroup);

  const leftJaw = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(1.4, 1.6, 1.4)),
    materials.heavyCopper,
  );
  leftJaw.position.set(-1.4, 0.4, 0);
  leftJaw.castShadow = true;
  clampGroup.add(leftJaw);

  const rightJaw = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(1.4, 1.6, 1.4)),
    materials.heavyCopper,
  );
  rightJaw.position.set(1.4, 0.4, 0);
  rightJaw.castShadow = true;
  clampGroup.add(rightJaw);

  const compressionScrew = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.12, 0.12, 2.2, 16)),
    materials.steelWorkpiece,
  );
  compressionScrew.rotation.z = Math.PI / 2;
  compressionScrew.position.set(2.8, 0.4, 0);
  clampGroup.add(compressionScrew);

  // 4. Steel Workpiece Rods
  const leftBar = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.32, 0.32, 2.6, 24)),
    materials.steelWorkpiece,
  );
  leftBar.rotation.z = Math.PI / 2;
  leftBar.position.set(-1.2, 0.4, 0);
  clampGroup.add(leftBar);

  const rightBar = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.32, 0.32, 2.6, 24)),
    materials.steelWorkpiece,
  );
  rightBar.rotation.z = Math.PI / 2;
  rightBar.position.set(1.2, 0.4, 0);
  clampGroup.add(rightBar);

  // White-Hot Upset Weld Seam
  const weldSeam = new THREE.Mesh(
    trackGeo(new THREE.SphereGeometry(0.42, 24, 24)),
    materials.glowingWeld,
  );
  weldSeam.position.set(0, 0.4, 0);
  clampGroup.add(weldSeam);

  // 5. Deterministic Incandescent Spark Particle System
  const sparkGeo = trackGeo(new THREE.BufferGeometry());
  const sparkPositions = new Float32Array(SPARK_COUNT * 3);
  for (let i = 0; i < SPARK_COUNT; i++) {
    sparkPositions[i * 3] = (lcg() - 0.5) * 0.4;
    sparkPositions[i * 3 + 1] = 0.4 + lcg() * 0.3;
    sparkPositions[i * 3 + 2] = (lcg() - 0.5) * 0.4;
  }
  sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPositions, 3));

  const sparkPoints = new THREE.Points(sparkGeo, materials.sparkPoints);
  clampGroup.add(sparkPoints);

  const nodes: ThomsonWeldingModelNodes = {
    rootGroup,
    bedGroup,
    transformerGroup,
    secondaryBar,
    clampGroup,
    leftJaw,
    rightJaw,
    compressionScrew,
    leftBar,
    rightBar,
    weldSeam,
    sparkPoints,
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
 * Updates Thomson weld incandescence, upset bulge size, and spark kinematics.
 */
export function updateThomsonWeldingKinematics(
  nodes: ThomsonWeldingModelNodes,
  materials: ThomsonWeldingMaterials,
  _dt: number,
  timeSec: number,
  interfaceTempC: number,
  upsetBurrWidthMm: number,
  isForged: boolean,
  showSparks: boolean,
) {
  // 1. Incandescence Intensity & Color based on temperature
  // Below 500°C: dark; 500-900°C: dull red; 900-1200°C: bright orange; >1200°C: dazzling white
  const tempRatio = Math.min(1.5, Math.max(0, interfaceTempC / 1300));
  materials.glowingWeld.emissiveIntensity = tempRatio * 1.8;

  if (interfaceTempC > 1100) {
    materials.glowingWeld.emissive.setHex(0xffffff);
  } else if (interfaceTempC > 800) {
    materials.glowingWeld.emissive.setHex(0xff6600);
  } else {
    materials.glowingWeld.emissive.setHex(0xaa2200);
  }

  // 2. Plastic Upset Bulge Size
  const scale = 1.0 + (upsetBurrWidthMm / 3.8) * 0.35;
  nodes.weldSeam.scale.set(scale, scale * 1.1, scale);

  // 3. Right Movable Clamp Compression Offset
  nodes.rightJaw.position.x = 1.4 - (upsetBurrWidthMm / 3.8) * 0.12;
  nodes.rightBar.position.x = 1.2 - (upsetBurrWidthMm / 3.8) * 0.12;

  // 4. Deterministic Spark Trajectory Animation
  nodes.sparkPoints.visible = showSparks && isForged;
  if (nodes.sparkPoints.visible) {
    const geo = nodes.sparkPoints.geometry as THREE.BufferGeometry;
    const pos = geo.attributes.position.array as Float32Array;

    for (let i = 0; i < SPARK_COUNT; i++) {
      const idx = i * 3;
      const seed = (i * 1.37 + timeSec * 4.5) % 1.0;
      const radius = seed * 1.8;
      const angle = (i * 2.399963) % (Math.PI * 2);
      pos[idx] = Math.cos(angle) * radius;
      pos[idx + 1] = 0.4 + Math.sin(seed * Math.PI) * 1.2 - seed ** 2 * 1.4;
      pos[idx + 2] = Math.sin(angle) * radius;
    }
    geo.attributes.position.needsUpdate = true;
  }
}
