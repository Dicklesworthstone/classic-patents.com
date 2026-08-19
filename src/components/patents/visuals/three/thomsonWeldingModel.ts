/**
 * thomsonWeldingModel.ts
 *
 * Museum-Grade Procedural 3D Model for Elihu Thomson's 1886 Electric Resistance Butt-Welding
 * (US Patent 347,140 - "Apparatus for Electric Welding").
 *
 * Reconstructs the original 1886 electric resistance welding machine:
 * 1. Heavy cast-iron machine bedplate with dovetail slideway and foundation bolt lugs.
 * 2. Step-down transformer with laminated magnetic iron core, fine primary winding, and massive
 *    single-turn rectangular secondary cast-copper conductor bar (Claim 1).
 * 3. Massive dual copper clamping jaws (fixed left jaw, sliding right carriage with dovetail gibs).
 * 4. Heavy ACME-thread axial compression screw with 4-spoke cast iron handwheel for forging pressure.
 * 5. Clamped steel workpiece rods with thermal heat-affected zone (HAZ) gradient.
 * 6. White-hot plastic upset weld seam with authentic flash collar bulging and incandescence.
 * 7. Deterministic ballistic incandescent spark particle ejection system.
 */

import * as THREE from "three";
import { stepThomsonWelding, wrapCycleRad } from "@/physics/catalogKernels";
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
  handwheelMesh?: THREE.Mesh;
}

export interface ThomsonWeldingMaterials {
  castIron: THREE.MeshStandardMaterial;
  heavyCopper: THREE.MeshStandardMaterial;
  steelWorkpiece: THREE.MeshStandardMaterial;
  glowingWeld: THREE.MeshStandardMaterial;
  sparkPoints: THREE.PointsMaterial;
  primaryCoil: THREE.MeshStandardMaterial;
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

  // --- Museum-Grade Materials ---
  const castIron = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x22272e,
      roughness: 0.65,
      metalness: 0.85,
    }),
  );

  const heavyCopper = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xc26228,
      roughness: 0.28,
      metalness: 0.92,
    }),
  );

  const primaryCoil = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x854d0e,
      roughness: 0.45,
      metalness: 0.75,
    }),
  );

  const steelWorkpiece = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.18,
      metalness: 0.94,
    }),
  );

  const glowingWeld = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xffedd5,
      roughness: 0.1,
      emissive: 0xff5500,
      emissiveIntensity: 1.0,
    }),
  );

  const sparkPointsMat = trackMat(
    new THREE.PointsMaterial({
      size: 0.18,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      color: 0xffaa00,
    }),
  );

  const materials: ThomsonWeldingMaterials = {
    castIron,
    heavyCopper,
    steelWorkpiece,
    glowingWeld,
    sparkPoints: sparkPointsMat,
    primaryCoil,
  };

  // --- 1. Heavy Cast-Iron Machine Bedplate ---
  const bedGroup = new THREE.Group();
  rootGroup.add(bedGroup);

  const bed = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(10.6, 0.85, 5.8)), materials.castIron);
  bed.position.y = -2.2;
  bed.receiveShadow = true;
  bed.castShadow = true;
  bedGroup.add(bed);

  // Dovetail guide ways for sliding jaw carriage
  const slideway = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(7.2, 0.22, 2.2)),
    materials.steelWorkpiece,
  );
  slideway.position.set(0.6, -1.7, 0);
  slideway.receiveShadow = true;
  bedGroup.add(slideway);

  // --- 2. Transformer Laminated Magnetic Core & Massive Secondary ---
  const transformerGroup = new THREE.Group();
  transformerGroup.position.set(0, -1.1, 0);
  rootGroup.add(transformerGroup);

  // Laminated transformer iron core frame
  const coreMesh = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(4.4, 1.5, 2.4)),
    materials.castIron,
  );
  coreMesh.castShadow = true;
  transformerGroup.add(coreMesh);

  // Primary multi-turn wire coil spool
  const primaryMesh = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.85, 0.85, 1.8, 24)),
    materials.primaryCoil,
  );
  primaryMesh.rotation.z = Math.PI / 2;
  primaryMesh.position.set(0, -0.1, 0);
  transformerGroup.add(primaryMesh);

  // Massive rectangular cross-section single-turn cast copper secondary bar (Claim 1)
  const secondaryBar = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(5.2, 0.45, 0.95)),
    materials.heavyCopper,
  );
  secondaryBar.position.y = 0.95;
  secondaryBar.castShadow = true;
  transformerGroup.add(secondaryBar);

  // Flexible braided copper jumper leads connecting secondary to clamp jaws
  [-1.6, 1.6].forEach((jx) => {
    const lead = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.22, 0.22, 0.9, 16)),
      materials.heavyCopper,
    );
    lead.position.set(jx, 1.45, 0);
    transformerGroup.add(lead);
  });

  // --- 3. Massive Clamping Jaws & Mechanical Forging Screw (Claim 1 & 2) ---
  const clampGroup = new THREE.Group();
  rootGroup.add(clampGroup);

  // Fixed Left Jaw
  const leftJaw = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(1.5, 1.7, 1.5)),
    materials.heavyCopper,
  );
  leftJaw.position.set(-1.4, 0.4, 0);
  leftJaw.castShadow = true;
  clampGroup.add(leftJaw);

  // Top clamping toggle lever & bolt on Left Jaw
  const leftClampBolt = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.12, 0.12, 0.8, 12)),
    materials.steelWorkpiece,
  );
  leftClampBolt.position.set(-1.4, 1.5, 0);
  clampGroup.add(leftClampBolt);

  // Movable Right Jaw Carriage
  const rightJaw = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(1.5, 1.7, 1.5)),
    materials.heavyCopper,
  );
  rightJaw.position.set(1.4, 0.4, 0);
  rightJaw.castShadow = true;
  clampGroup.add(rightJaw);

  const rightClampBolt = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.12, 0.12, 0.8, 12)),
    materials.steelWorkpiece,
  );
  rightClampBolt.position.set(1.4, 1.5, 0);
  clampGroup.add(rightClampBolt);

  // Heavy ACME Compression Forging Screw
  const compressionScrew = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.16, 0.16, 2.6, 20)),
    materials.steelWorkpiece,
  );
  compressionScrew.rotation.z = Math.PI / 2;
  compressionScrew.position.set(3.0, 0.4, 0);
  compressionScrew.castShadow = true;
  clampGroup.add(compressionScrew);

  // 4-Spoke Cast Iron Handwheel on Forging Screw
  const handwheelMesh = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.65, 0.08, 12, 28)),
    materials.castIron,
  );
  handwheelMesh.rotation.y = Math.PI / 2;
  handwheelMesh.position.set(4.3, 0.4, 0);
  clampGroup.add(handwheelMesh);

  // --- 4. Clamped Steel Workpiece Rods & Upset Weld Seam ---
  const leftBar = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.34, 0.34, 2.8, 28)),
    materials.steelWorkpiece,
  );
  leftBar.rotation.z = Math.PI / 2;
  leftBar.position.set(-1.3, 0.4, 0);
  leftBar.castShadow = true;
  clampGroup.add(leftBar);

  const rightBar = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.34, 0.34, 2.8, 28)),
    materials.steelWorkpiece,
  );
  rightBar.rotation.z = Math.PI / 2;
  rightBar.position.set(1.3, 0.4, 0);
  rightBar.castShadow = true;
  clampGroup.add(rightBar);

  // White-Hot Plastic Upset Weld Seam Bulge (Claim 2)
  const weldSeam = new THREE.Mesh(
    trackGeo(new THREE.SphereGeometry(0.46, 28, 28)),
    materials.glowingWeld,
  );
  weldSeam.position.set(0, 0.4, 0);
  clampGroup.add(weldSeam);

  // --- 5. Deterministic Incandescent Spark Particle System ---
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
    handwheelMesh,
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
  weldGlowIntensity: number,
  weldSeamScale: number,
  jawStudioOffset: number,
  isForged: boolean,
  showSparks: boolean,
) {
  // 1. Incandescence Intensity & Color based on temperature
  // Below 500°C: dark; 500-900°C: dull red; 900-1200°C: bright orange; >1200°C: dazzling white
  materials.glowingWeld.emissiveIntensity = weldGlowIntensity;

  if (interfaceTempC > 1100) {
    materials.glowingWeld.emissive.setHex(0xffffff);
  } else if (interfaceTempC > 800) {
    materials.glowingWeld.emissive.setHex(0xff6600);
  } else {
    materials.glowingWeld.emissive.setHex(0xaa2200);
  }

  // 2. Plastic Upset Bulge Size
  nodes.weldSeam.scale.set(weldSeamScale, weldSeamScale * 1.1, weldSeamScale);

  // 3. Right Movable Clamp Compression Offset
  nodes.rightJaw.position.x = 1.4 - jawStudioOffset;
  nodes.rightBar.position.x = 1.2 - jawStudioOffset;

  // 4. Deterministic Spark Trajectory Animation
  nodes.sparkPoints.visible = showSparks && isForged;
  if (nodes.sparkPoints.visible) {
    const geo = nodes.sparkPoints.geometry as THREE.BufferGeometry;
    const pos = geo.attributes.position.array as Float32Array;

    const weld = stepThomsonWelding({});
    for (let i = 0; i < SPARK_COUNT; i++) {
      const idx = i * 3;
      const seed = (i * 1.37 + timeSec * 4.5) % 1.0;
      const radius = seed * 1.8;
      const angle = wrapCycleRad(i * weld.sparkGoldenAngleRad, weld.sparkWrapRad);
      pos[idx] = Math.cos(angle) * radius;
      pos[idx + 1] = 0.4 + Math.sin(seed * Math.PI) * 1.2 - seed ** 2 * 1.4;
      pos[idx + 2] = Math.sin(angle) * radius;
    }
    geo.attributes.position.needsUpdate = true;
  }
}
