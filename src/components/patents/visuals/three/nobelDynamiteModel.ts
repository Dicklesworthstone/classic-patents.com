/**
 * nobelDynamiteModel.ts
 *
 * Museum-Grade Procedural 3D Model for Alfred Nobel's 1868 Porous-Earth Explosive Dynamite
 * (US Patent 78,317 - "Improved Explosive Compound").
 *
 * Reconstructs the revolutionary high-explosive safety invention:
 * 1. Paraffin-coated wax-paper cartridge tube with cutaway cross-section.
 * 2. Porous diatomaceous earth (kieselguhr) absorbent core saturated with liquid nitroglycerin.
 * 3. Instanced microscopic siliceous diatom fossil grains holding the liquid by capillary action.
 * 4. Copper blasting cap detonator loaded with mercury fulminate (US Patent 78,317 Claim 2).
 * 5. Braided safety fuse with dynamic burning spark particles and detonation shockwave emission.
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
}

export interface NobelDynamiteMaterials {
  waxPaper: THREE.MeshStandardMaterial;
  kieselguhrMatrix: THREE.MeshStandardMaterial;
  grainMat: THREE.MeshStandardMaterial;
  copperCap: THREE.MeshStandardMaterial;
  safetyFuse: THREE.MeshStandardMaterial;
  sparkMat: THREE.PointsMaterial;
  shockwaveMat: THREE.MeshStandardMaterial;
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

  // Materials
  const materials: NobelDynamiteMaterials = {
    waxPaper: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.6,
        metalness: 0.1,
      }),
    ),
    kieselguhrMatrix: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x92400e,
        roughness: 0.9,
        metalness: 0.05,
        emissive: 0xff4400,
        emissiveIntensity: 0,
      }),
    ),
    grainMat: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        roughness: 0.8,
        metalness: 0.1,
      }),
    ),
    copperCap: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xca8a04,
        roughness: 0.2,
        metalness: 0.92,
      }),
    ),
    safetyFuse: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1c1917,
        roughness: 0.85,
        metalness: 0.0,
      }),
    ),
    sparkMat: trackMat(
      new THREE.PointsMaterial({
        size: 0.6,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        color: 0xff6600,
        depthWrite: false,
      }),
    ),
    shockwaveMat: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xffedd5,
        emissive: 0xf97316,
        emissiveIntensity: 0,
        transparent: true,
        opacity: 0,
        roughness: 0.1,
      }),
    ),
  };

  const stickGroup = new THREE.Group();
  rootGroup.add(stickGroup);

  // 1. Wax Paper Shell (Claim 1)
  const paperShell = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(1.2, 1.2, 5.0, 32, 1, false, 0, Math.PI * 1.3)),
    materials.waxPaper,
  );
  paperShell.castShadow = true;
  stickGroup.add(paperShell);

  // 2. Kieselguhr Core Matrix
  const kieselguhrCore = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(1.15, 1.15, 4.9, 32)),
    materials.kieselguhrMatrix,
  );
  stickGroup.add(kieselguhrCore);

  // 3. Instanced Diatom Grains (Microscopic siliceous shells)
  const grainCount = 35;
  const grainGeo = trackGeo(new THREE.DodecahedronGeometry(0.12));
  const grainInst = new THREE.InstancedMesh(grainGeo, materials.grainMat, grainCount);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < grainCount; i++) {
    dummy.position.set((lcg() - 0.5) * 1.8, (lcg() - 0.5) * 4.2, lcg() * 0.9);
    dummy.rotation.set(lcg() * Math.PI, lcg() * Math.PI, 0);
    dummy.updateMatrix();
    grainInst.setMatrixAt(i, dummy.matrix);
  }
  grainInst.instanceMatrix.needsUpdate = true;
  stickGroup.add(grainInst);

  // 4. Copper Detonator Blasting Cap (Claim 2: Fulminate of Mercury)
  const capGroup = new THREE.Group();
  capGroup.position.set(0, 2.2, 0);
  stickGroup.add(capGroup);

  const copperCasing = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.24, 0.24, 1.8, 16)),
    materials.copperCap,
  );
  copperCasing.castShadow = true;
  capGroup.add(copperCasing);

  // 5. Braided Safety Fuse Cord
  const fuseCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 2.8, 0),
    new THREE.Vector3(0.4, 3.4, 0.3),
    new THREE.Vector3(0.1, 4.2, 0.6),
  ]);
  const fuseGeo = trackGeo(new THREE.TubeGeometry(fuseCurve, 20, 0.08, 8, false));
  const fuseMesh = new THREE.Mesh(fuseGeo, materials.safetyFuse);
  stickGroup.add(fuseMesh);

  // 6. Glowing Fuse Spark Particle
  const sparkGeo = trackGeo(new THREE.BufferGeometry());
  sparkGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array([0.1, 4.2, 0.6]), 3),
  );
  const sparkPoints = new THREE.Points(sparkGeo, materials.sparkMat);
  stickGroup.add(sparkPoints);

  // 7. Spherical Detonation Shockwave Mesh
  const shockwaveGeo = trackGeo(new THREE.SphereGeometry(1.5, 24, 24));
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
  detonationVelocityMps: number,
  isCutaway: boolean,
) {
  // 1. Slow presentation rotation
  nodes.stickGroup.rotation.y += dt * 0.2;

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
    materials.shockwaveMat.emissiveIntensity = 1.0 + (detonationVelocityMps / 6000) * 1.5;
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
