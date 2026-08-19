import { createLcg } from "@/utils/lcg";
/**
 * edisonPhonographModel.ts
 *
 * Museum-Grade Procedural 3D Model for Thomas Alva Edison's 1878 Tinfoil Phonograph (US Patent 200,521).
 * It distinguishes the source-specified cylinder, foil, diaphragms, hard point,
 * threaded shaft, and clock-work drive from illustrative display geometry. The
 * patent does not state the material, dimensions, horn profile, or drive train.
 */

import * as THREE from "three";

export interface EdisonPhonographModel {
  rootGroup: THREE.Group;
  cylinderGroup: THREE.Group;
  soundBoxGroup: THREE.Group;
  stylus: THREE.Mesh;
  rotationReferenceWheel: THREE.Mesh;
  materials: {
    illustrativeBase: THREE.MeshStandardMaterial;
    illustrativeDarkMetal: THREE.MeshStandardMaterial;
    illustrativeWarmMetal: THREE.MeshStandardMaterial;
    tinfoil: THREE.MeshStandardMaterial;
    illustrativeLightMetal: THREE.MeshStandardMaterial;
  };
  dispose: () => void;
}

export function buildEdisonPhonographModel(): EdisonPhonographModel {
  const lcg = createLcg(2185);
  const rootGroup = new THREE.Group();
  const texturesToDispose: THREE.Texture[] = [];
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];

  // Illustrative support texture. No wood species is stated in US 200,521.
  let woodTexture: THREE.CanvasTexture | undefined;
  if (typeof document !== "undefined") {
    const woodCanvas = document.createElement("canvas");
    woodCanvas.width = 512;
    woodCanvas.height = 512;
    const wctx = woodCanvas.getContext("2d");
    if (wctx) {
      wctx.fillStyle = "#3b1708";
      wctx.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 240; i++) {
        wctx.fillStyle = i % 2 === 0 ? "rgba(80, 30, 10, 0.45)" : "rgba(25, 10, 5, 0.5)";
        wctx.fillRect(0, lcg() * 512, 512, lcg() * 3 + 1);
      }
    }
    woodTexture = new THREE.CanvasTexture(woodCanvas);
    woodTexture.colorSpace = THREE.SRGBColorSpace;
    woodTexture.wrapS = THREE.RepeatWrapping;
    woodTexture.wrapT = THREE.RepeatWrapping;
    woodTexture.repeat.set(2, 4);
    texturesToDispose.push(woodTexture);
  }

  // Materials
  const illustrativeBaseMat = new THREE.MeshStandardMaterial({
    ...(woodTexture ? { map: woodTexture } : {}),
    color: 0x4a1d0a,
    roughness: 0.45,
    metalness: 0.08,
  });
  materialsToDispose.push(illustrativeBaseMat);

  const illustrativeDarkMetalMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.48,
    metalness: 0.85,
  });
  materialsToDispose.push(illustrativeDarkMetalMat);

  const illustrativeWarmMetalMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.18,
    metalness: 0.92,
  });
  materialsToDispose.push(illustrativeWarmMetalMat);

  const tinfoilMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.22,
    metalness: 0.94,
  });
  materialsToDispose.push(tinfoilMat);

  const illustrativeLightMetalMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.12,
    metalness: 0.96,
  });
  materialsToDispose.push(illustrativeLightMetalMat);

  // ==========================================
  // 1. Illustrative support base. Its material and dimensions are not source claims.
  // ==========================================
  const baseGroup = new THREE.Group();
  rootGroup.add(baseGroup);

  const basePlinth = new THREE.Mesh(new THREE.BoxGeometry(11.0, 0.7, 5.8), illustrativeBaseMat);
  basePlinth.position.y = -1.8;
  basePlinth.receiveShadow = true;
  basePlinth.castShadow = true;
  baseGroup.add(basePlinth);

  // Illustrative leveling feet.
  [
    [-4.8, -2.2],
    [4.8, -2.2],
    [-4.8, 2.2],
    [4.8, 2.2],
  ].forEach(([fx, fz]) => {
    const foot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.35, 0.3, 16),
      illustrativeWarmMetalMat,
    );
    foot.position.set(fx, -2.2, fz);
    baseGroup.add(foot);
  });

  // Illustrative bearing stanchions.
  [-3.6, 3.6].forEach((bx) => {
    const stanchion = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 2.4, 1.4),
      illustrativeDarkMetalMat,
    );
    stanchion.position.set(bx, -0.4, 0);
    stanchion.castShadow = true;
    baseGroup.add(stanchion);

    // Illustrative bearing cap and oil cup.
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.32, 0.4, 16),
      illustrativeWarmMetalMat,
    );
    cap.rotation.z = Math.PI / 2;
    cap.position.set(bx, 0.8, 0);
    baseGroup.add(cap);

    const oilCup = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.22, 12), illustrativeWarmMetalMat);
    oilCup.position.set(bx, 1.1, 0);
    baseGroup.add(oilCup);
  });

  // ==========================================
  // 2. Source-specified grooved cylinder and threaded shaft (Claim 4).
  // ==========================================
  const cylinderGroup = new THREE.Group();
  cylinderGroup.position.set(0, 0.8, 0);
  rootGroup.add(cylinderGroup);

  // Shaft X is source-specified; its display material and length are illustrative.
  const leadScrew = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 10.2, 24),
    illustrativeLightMetalMat,
  );
  leadScrew.rotation.z = Math.PI / 2;
  leadScrew.castShadow = true;
  cylinderGroup.add(leadScrew);

  // Cylinder A with source-specified metallic-foil recording surface.
  const mandrel = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.45, 4.8, 36), tinfoilMat);
  mandrel.rotation.z = Math.PI / 2;
  mandrel.position.x = -0.4;
  mandrel.castShadow = true;
  cylinderGroup.add(mandrel);

  // Illustrative groove cue for the source-specified ten-groove-per-inch helix.
  for (let g = 0; g < 8; g++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.46, 0.015, 8, 36),
      illustrativeWarmMetalMat,
    );
    ring.rotation.y = Math.PI / 2;
    ring.position.x = -2.4 + g * 0.6;
    cylinderGroup.add(ring);
  }

  // Illustrative rotation reference. The source names clock-work M or another power source.
  const rotationReferenceWheel = new THREE.Mesh(
    new THREE.TorusGeometry(1.8, 0.18, 16, 36),
    illustrativeDarkMetalMat,
  );
  rotationReferenceWheel.position.x = -4.5;
  rotationReferenceWheel.rotation.y = Math.PI / 2;
  rotationReferenceWheel.castShadow = true;
  cylinderGroup.add(rotationReferenceWheel);

  // Spokes are illustrative display geometry.
  for (let s = 0; s < 6; s++) {
    const angle = (s * Math.PI) / 3;
    const spoke = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.07, 1.6, 8),
      illustrativeDarkMetalMat,
    );
    spoke.position.set(-4.5, Math.cos(angle) * 0.85, Math.sin(angle) * 0.85);
    spoke.rotation.x = angle;
    cylinderGroup.add(spoke);
  }

  // Illustrative drive indicator. US 200,521 names clock-work M or another
  // source of power; this display geometry does not identify a historical drive.
  const crankArm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.6, 0.35), illustrativeDarkMetalMat);
  crankArm.position.set(4.9, 0.6, 0);
  cylinderGroup.add(crankArm);

  const crankHandle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.14, 0.6, 12),
    illustrativeBaseMat,
  );
  crankHandle.rotation.x = Math.PI / 2;
  crankHandle.position.set(4.9, 1.3, 0.4);
  cylinderGroup.add(crankHandle);

  // ==========================================
  // 3. Source-specified diaphragm and hard point (Claim 3).
  // ==========================================
  const soundBoxGroup = new THREE.Group();
  soundBoxGroup.position.set(0, 1.6, 1.8);
  rootGroup.add(soundBoxGroup);

  // Pivot Arm Carriage
  const pivotArm = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 1.8), illustrativeWarmMetalMat);
  pivotArm.position.set(0, -0.4, -0.8);
  soundBoxGroup.add(pivotArm);

  // Illustrative diaphragm housing.
  const soundBox = new THREE.Mesh(
    new THREE.CylinderGeometry(0.75, 0.75, 0.4, 24),
    illustrativeWarmMetalMat,
  );
  soundBox.rotation.x = Math.PI / 2;
  soundBox.castShadow = true;
  soundBoxGroup.add(soundBox);

  // The source names a diaphragm but provides no material.
  const diaphragm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.68, 0.68, 0.05, 24),
    illustrativeLightMetalMat,
  );
  diaphragm.rotation.x = Math.PI / 2;
  soundBoxGroup.add(diaphragm);

  // The source requires hard material but does not identify it.
  const stylus = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.55, 12), illustrativeLightMetalMat);
  stylus.rotation.x = -Math.PI / 2;
  stylus.position.set(0, -0.55, -0.2);
  soundBoxGroup.add(stylus);

  // Illustrative speaking-tube profile. The source does not specify a horn profile.
  const horn = new THREE.Mesh(
    new THREE.ConeGeometry(1.8, 3.6, 24, 1, true),
    illustrativeWarmMetalMat,
  );
  horn.rotation.x = -Math.PI / 3.2;
  horn.position.set(0, 1.8, 2.0);
  horn.castShadow = true;
  soundBoxGroup.add(horn);

  const dispose = () => {
    for (const t of texturesToDispose) t.dispose();
    for (const m of materialsToDispose) m.dispose();
    for (const g of geometriesToDispose) g.dispose();
  };

  return {
    rootGroup,
    cylinderGroup,
    soundBoxGroup,
    stylus,
    rotationReferenceWheel,
    materials: {
      illustrativeBase: illustrativeBaseMat,
      illustrativeDarkMetal: illustrativeDarkMetalMat,
      illustrativeWarmMetal: illustrativeWarmMetalMat,
      tinfoil: tinfoilMat,
      illustrativeLightMetal: illustrativeLightMetalMat,
    },
    dispose,
  };
}

/**
 * Updates the source-linked cylinder rotation and an illustrative stylus motion.
 */
export function updateEdisonPhonographKinematics(
  model: EdisonPhonographModel,
  dt: number,
  timeSec: number,
  mandrelOmegaRadPerS: number,
  stylusAmp: number,
  stylusOmegaRadPerS: number,
  isCutaway: boolean,
) {
  model.cylinderGroup.rotation.x += mandrelOmegaRadPerS * dt;
  model.rotationReferenceWheel.rotation.x += mandrelOmegaRadPerS * dt;

  // Illustrative display motion only. The source specifies no amplitude or frequency.
  const vibration = Math.sin(timeSec * stylusOmegaRadPerS) * stylusAmp;
  model.stylus.position.y = -0.55 + vibration;

  // Cutaway Mode
  model.materials.illustrativeBase.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.illustrativeBase.transparent = isCutaway;
  model.materials.tinfoil.opacity = isCutaway ? 0.55 : 1.0;
  model.materials.tinfoil.transparent = isCutaway;
}
