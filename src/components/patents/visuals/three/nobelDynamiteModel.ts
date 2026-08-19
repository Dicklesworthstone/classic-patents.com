/**
 * nobelDynamiteModel.ts
 *
 * Museum-Grade Procedural 3D Model for Alfred Nobel's 1868 Porous-Earth Explosive Dynamite
 * (US Patent 78,317 - "Improved Explosive Compound").
 *
 * Reconstructs the revolutionary high-explosive safety invention:
 * 1. Paraffin-coated wax-paper cartridge tube with authentic crimped pleated end folds and cutaway cross-section.
 * 2. Porous diatomaceous earth (kieselguhr) absorbent core saturated with liquid nitroglycerin (Claim 1).
 * 3. Microscopic siliceous diatom fossil grains holding the liquid by capillary action.
 * 4. Seamless copper blasting cap detonator loaded with mercury fulminate (Claim 2).
 * 5. Braided safety fuse with dynamic burning spark particles and detonation shockwave emission.
 * 6. Historical wooden storage crate with sawdust bedding.
 */

import * as THREE from "three";
import { createLcg } from "@/utils/lcg";

const lcg = createLcg(1323);

export interface NobelDynamiteModelNodes {
  rootGroup: THREE.Group;
  stickGroup: THREE.Group;
  paperShell: THREE.Mesh;
  kieselguhrCore: THREE.Mesh;
  grainInst: THREE.InstancedMesh;
  capGroup: THREE.Group;
  copperCasing: THREE.Mesh;
  fuseMesh: THREE.Mesh;
  sparkPoints: THREE.Points;
  shockwaveMesh: THREE.Mesh;
  crateGroup?: THREE.Group;
}

export interface NobelDynamiteMaterials {
  waxPaper: THREE.MeshStandardMaterial;
  kieselguhrMatrix: THREE.MeshStandardMaterial;
  grainMat: THREE.MeshStandardMaterial;
  copperCap: THREE.MeshStandardMaterial;
  safetyFuse: THREE.MeshStandardMaterial;
  sparkMat: THREE.PointsMaterial;
  shockwaveMat: THREE.MeshStandardMaterial;
  crateWood: THREE.MeshStandardMaterial;
}

export interface NobelDynamiteModelResult {
  rootGroup: THREE.Group;
  nodes: NobelDynamiteModelNodes;
  materials: NobelDynamiteMaterials;
  dispose: () => void;
}

export function buildNobelDynamiteModel(): NobelDynamiteModelResult {
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
  const waxPaper = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xcd6e1a,
      roughness: 0.45,
      metalness: 0.08,
    }),
  );

  const kieselguhrMatrix = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x8b3a0f,
      roughness: 0.92,
      metalness: 0.04,
      emissive: 0xff3300,
      emissiveIntensity: 0,
    }),
  );

  const grainMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xfde047,
      roughness: 0.75,
      metalness: 0.12,
    }),
  );

  const copperCap = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xca7828,
      roughness: 0.22,
      metalness: 0.94,
    }),
  );

  const safetyFuse = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x292524,
      roughness: 0.88,
      metalness: 0.02,
    }),
  );

  const crateWood = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x785338,
      roughness: 0.78,
      metalness: 0.03,
    }),
  );

  const sparkMat = trackMat(
    new THREE.PointsMaterial({
      size: 0.65,
      color: 0xffdd44,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    }),
  );

  const shockwaveMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0,
      roughness: 0.2,
      emissive: 0xff5500,
      emissiveIntensity: 0,
      side: THREE.DoubleSide,
    }),
  );

  const materials: NobelDynamiteMaterials = {
    waxPaper,
    kieselguhrMatrix,
    grainMat,
    copperCap,
    safetyFuse,
    sparkMat,
    shockwaveMat,
    crateWood,
  };

  // --- Background/Bedding Wooden Storage Crate ---
  const crateGroup = new THREE.Group();
  crateGroup.position.set(0, -2.2, -1.2);
  rootGroup.add(crateGroup);

  const crateBase = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(8.5, 0.4, 6.2)),
    materials.crateWood,
  );
  crateBase.receiveShadow = true;
  crateGroup.add(crateBase);

  // Crate side walls
  [-3.0, 3.0].forEach((cz) => {
    const wall = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(8.5, 1.4, 0.3)),
      materials.crateWood,
    );
    wall.position.set(0, 0.7, cz);
    crateGroup.add(wall);
  });
  [-4.1, 4.1].forEach((cx) => {
    const wall = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.3, 1.4, 5.8)),
      materials.crateWood,
    );
    wall.position.set(cx, 0.7, 0);
    crateGroup.add(wall);
  });

  // Secondary auxiliary dynamite sticks resting in crate
  [-1.4, 1.4].forEach((sz) => {
    const auxStick = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.9, 0.9, 4.8, 20)),
      materials.waxPaper,
    );
    auxStick.rotation.z = Math.PI / 2;
    auxStick.position.set(0, 0.5, sz);
    auxStick.castShadow = true;
    crateGroup.add(auxStick);
  });

  // --- Primary Dynamite Cartridge Assembly ---
  const stickGroup = new THREE.Group();
  stickGroup.position.set(0, 0.5, 0);
  rootGroup.add(stickGroup);

  // 1. Wax Paper Cartridge Shell (Claim 1) with ~270-degree cutaway
  const paperShell = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(1.22, 1.22, 5.2, 36, 1, false, 0, Math.PI * 1.35)),
    materials.waxPaper,
  );
  paperShell.castShadow = true;
  stickGroup.add(paperShell);

  // Crimped pleated end folds on both caps
  [-2.6, 2.6].forEach((ey) => {
    const endCap = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(1.24, 1.24, 0.22, 24)),
      materials.waxPaper,
    );
    endCap.position.y = ey;
    endCap.castShadow = true;
    stickGroup.add(endCap);
  });

  // 2. Kieselguhr Porous Earth Core Matrix (Claim 1)
  const kieselguhrCore = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(1.16, 1.16, 5.0, 32)),
    materials.kieselguhrMatrix,
  );
  kieselguhrCore.castShadow = true;
  stickGroup.add(kieselguhrCore);

  // 3. Microscopic Instanced Diatom Fossil Shells
  const grainCount = 35;
  const grainGeo = trackGeo(new THREE.DodecahedronGeometry(0.14));
  const grainInst = new THREE.InstancedMesh(grainGeo, materials.grainMat, grainCount);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < grainCount; i++) {
    dummy.position.set((lcg() - 0.5) * 1.8, (lcg() - 0.5) * 4.2, lcg() * 0.95);
    dummy.rotation.set(lcg() * Math.PI, lcg() * Math.PI, 0);
    dummy.updateMatrix();
    grainInst.setMatrixAt(i, dummy.matrix);
  }
  grainInst.instanceMatrix.needsUpdate = true;
  stickGroup.add(grainInst);

  // 4. Seamless Copper Blasting Cap Detonator (Claim 2: Fulminate of Mercury)
  const capGroup = new THREE.Group();
  capGroup.position.set(0, 2.2, 0);
  stickGroup.add(capGroup);

  const copperCasing = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.26, 0.26, 1.9, 20)),
    materials.copperCap,
  );
  copperCasing.castShadow = true;
  capGroup.add(copperCasing);

  // Cap crimp rings
  const crimp = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.27, 0.03, 8, 20)),
    materials.copperCap,
  );
  crimp.rotation.x = Math.PI / 2;
  crimp.position.y = 0.5;
  capGroup.add(crimp);

  // 5. Braided Safety Fuse Cord
  const fuseCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 2.8, 0),
    new THREE.Vector3(0.45, 3.4, 0.35),
    new THREE.Vector3(0.12, 4.3, 0.65),
  ]);
  const fuseGeo = trackGeo(new THREE.TubeGeometry(fuseCurve, 28, 0.085, 10, false));
  const fuseMesh = new THREE.Mesh(fuseGeo, materials.safetyFuse);
  stickGroup.add(fuseMesh);

  // 6. Glowing Fuse Spark Particle Emitter
  const sparkGeo = trackGeo(new THREE.BufferGeometry());
  sparkGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array([0.12, 4.3, 0.65]), 3),
  );
  const sparkPoints = new THREE.Points(sparkGeo, materials.sparkMat);
  stickGroup.add(sparkPoints);

  // 7. Spherical Detonation Shockwave Mesh
  const shockwaveGeo = trackGeo(new THREE.SphereGeometry(1.6, 32, 32));
  const shockwaveMesh = new THREE.Mesh(shockwaveGeo, materials.shockwaveMat);
  shockwaveMesh.visible = false;
  stickGroup.add(shockwaveMesh);

  const nodes: NobelDynamiteModelNodes = {
    rootGroup,
    stickGroup,
    paperShell,
    kieselguhrCore,
    grainInst,
    capGroup,
    copperCasing,
    fuseMesh,
    sparkPoints,
    shockwaveMesh,
    crateGroup,
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
 * Updates cartridge rotation, fuse spark flickering, detonation core glow, and cutaway.
 */
export function updateNobelDynamiteKinematics(
  nodes: NobelDynamiteModelNodes,
  materials: NobelDynamiteMaterials,
  dt: number,
  timeSec: number,
  isFuseLit: boolean,
  shockwaveGlow: number,
  stickDisplayOmegaRadPerS: number,
  isCutaway: boolean,
) {
  // 1. Slow presentation rotation
  nodes.stickGroup.rotation.y += dt * stickDisplayOmegaRadPerS;

  // 2. Pulse Fuse Spark when lit
  if (isFuseLit) {
    materials.sparkMat.opacity = 0.7 + Math.sin(timeSec * 25) * 0.3;
    const wave = (Math.sin(timeSec * 8) + 1) * 0.5;
    materials.kieselguhrMatrix.emissiveIntensity = 0.4 + wave * 0.6;
    materials.kieselguhrMatrix.emissive.setHex(0xff3300);

    nodes.shockwaveMesh.visible = true;
    const scale = 1.0 + wave * 1.5;
    nodes.shockwaveMesh.scale.set(scale, scale, scale);
    materials.shockwaveMat.opacity = Math.max(0, 0.4 - wave * 0.35);
    materials.shockwaveMat.emissiveIntensity = shockwaveGlow;
  } else {
    materials.sparkMat.opacity = 0;
    materials.kieselguhrMatrix.emissiveIntensity = 0;
    nodes.shockwaveMesh.visible = false;
  }

  // 3. Cutaway Mode
  materials.waxPaper.opacity = isCutaway ? 0.35 : 1.0;
  materials.waxPaper.transparent = isCutaway;
  materials.kieselguhrMatrix.opacity = isCutaway ? 0.6 : 1.0;
  materials.kieselguhrMatrix.transparent = isCutaway;
}
