/**
 * Procedural Three.js Model Builder for US 1,773,980
 * Philo T. Farnsworth — Television System (Image Dissector Tube, 1930)
 *
 * Implements the authentic all-electronic television image dissector camera tube:
 * - Polished mahogany optical bench base with dual brass saddle tube clamps
 * - Blown borosilicate glass dissector envelope holding high vacuum
 * - Cesium-oxide photoemissive cathode disc with gold edge collector ring (Claim 1)
 * - Brass camera objective lens barrel imaging optical scenes onto photocathode
 * - Target anode collection finger with precision scanning aperture hole (Claim 2)
 * - Longitudinal magnetic solenoid focusing coil and orthogonal saddle deflection yokes (Claim 3)
 * - Scanning relativistic electron image raster particles
 */

import * as THREE from "three";
import { createLcg } from "@/utils/lcg";
import { createGlowPointTexture } from "./ThreeStudioScene";

export interface FarnsworthTvModel {
  root: THREE.Group;
  tubeGroup: THREE.Group;
  photocathode: THREE.Mesh;
  lensBarrel: THREE.Mesh;
  anodeFinger: THREE.Mesh;
  apertureTip: THREE.Mesh;
  focusCoil: THREE.Mesh;
  beamPoints: THREE.Points;
  beamGeo: THREE.BufferGeometry;
  beamPos: Float32Array;
  beamColors: Float32Array;
  updateKinematics: (
    delta: number,
    renderedSteps: number,
    velocityMps: number,
    horizontalFreqKhz: number,
    verticalFreqHz: number,
    showElectronBeam: boolean,
  ) => void;
  dispose: () => void;
}

export function buildFarnsworthTvModel(): FarnsworthTvModel {
  const root = new THREE.Group();
  const disposables: Array<{ dispose: () => void }> = [];
  const lcg = createLcg(19300826);

  // --- AUTHENTIC MATERIALS ---
  const glassEnvelopeMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.94,
    opacity: 1,
    transparent: true,
    roughness: 0.04,
    ior: 1.5,
    side: THREE.DoubleSide,
  });
  disposables.push(glassEnvelopeMat);

  const photocathodeMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.35,
    metalness: 0.85,
    emissive: 0x0369a1,
    emissiveIntensity: 0.5,
  });
  disposables.push(photocathodeMat);

  const copperCoilMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.25,
    metalness: 0.85,
  });
  disposables.push(copperCoilMat);

  const anodeBrassMat = new THREE.MeshStandardMaterial({
    color: 0xca8a04,
    roughness: 0.2,
    metalness: 0.9,
  });
  disposables.push(anodeBrassMat);

  const mahoganyMat = new THREE.MeshStandardMaterial({
    color: 0x78350f,
    roughness: 0.35,
  });
  disposables.push(mahoganyMat);

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xeab308,
    metalness: 0.95,
  });
  disposables.push(goldMat);

  const apertureMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.9,
  });
  disposables.push(apertureMat);

  const focusCoilMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.35,
    metalness: 0.8,
    wireframe: true,
  });
  disposables.push(focusCoilMat);

  // ==========================================
  // OPTICAL BENCH & DISSECTOR TUBE (CLAIM 1)
  // ==========================================
  const tubeGroup = new THREE.Group();
  root.add(tubeGroup);

  // Polished Mahogany Bench
  const benchGeo = new THREE.BoxGeometry(14.0, 0.6, 5.0);
  disposables.push(benchGeo);
  const bench = new THREE.Mesh(benchGeo, mahoganyMat);
  bench.position.y = -2.8;
  bench.receiveShadow = true;
  tubeGroup.add(bench);

  // Dual Brass Saddle Clamps
  [-3.5, 3.5].forEach((cx) => {
    const clampGeo = new THREE.CylinderGeometry(2.3, 2.3, 0.4, 24, 1, true);
    disposables.push(clampGeo);
    const clamp = new THREE.Mesh(clampGeo, anodeBrassMat);
    clamp.rotation.z = Math.PI / 2;
    clamp.position.set(cx, 0, 0);
    tubeGroup.add(clamp);

    const standoffGeo = new THREE.CylinderGeometry(0.25, 0.3, 2.2, 12);
    disposables.push(standoffGeo);
    const clampStandoff = new THREE.Mesh(standoffGeo, anodeBrassMat);
    clampStandoff.position.set(cx, -1.4, 0);
    tubeGroup.add(clampStandoff);
  });

  // Blown Glass Envelope
  const tubePoints: THREE.Vector2[] = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(1.9, 0.2),
    new THREE.Vector2(2.0, 0.8),
    new THREE.Vector2(2.0, 9.8),
    new THREE.Vector2(1.2, 10.4),
    new THREE.Vector2(0.4, 10.9),
    new THREE.Vector2(0.01, 11.2),
  ];
  const tubeGeo = new THREE.LatheGeometry(tubePoints, 36);
  disposables.push(tubeGeo);
  const glassTube = new THREE.Mesh(tubeGeo, glassEnvelopeMat);
  glassTube.rotation.z = -Math.PI / 2;
  glassTube.position.x = -5.4;
  tubeGroup.add(glassTube);

  // Cesium-Oxide Photocathode Disc
  const photoGeo = new THREE.CircleGeometry(1.7, 36);
  disposables.push(photoGeo);
  const photocathode = new THREE.Mesh(photoGeo, photocathodeMat);
  photocathode.rotation.y = Math.PI / 2;
  photocathode.position.x = -4.8;
  tubeGroup.add(photocathode);

  // Gold Collector Ring
  const ringGeo = new THREE.TorusGeometry(1.72, 0.04, 12, 36);
  disposables.push(ringGeo);
  const goldRim = new THREE.Mesh(ringGeo, goldMat);
  goldRim.rotation.y = Math.PI / 2;
  goldRim.position.x = -4.8;
  tubeGroup.add(goldRim);

  // Optical Lens Barrel
  const lensGeo = new THREE.CylinderGeometry(1.1, 1.4, 2.2, 24);
  disposables.push(lensGeo);
  const lensBarrel = new THREE.Mesh(lensGeo, anodeBrassMat);
  lensBarrel.rotation.z = Math.PI / 2;
  lensBarrel.position.set(-6.8, 0, 0);
  lensBarrel.castShadow = true;
  tubeGroup.add(lensBarrel);

  const glassLensGeo = new THREE.SphereGeometry(0.95, 24, 24);
  disposables.push(glassLensGeo);
  const glassLens = new THREE.Mesh(
    glassLensGeo,
    new THREE.MeshPhysicalMaterial({ color: 0x93c5fd, transmission: 0.95, ior: 1.52 }),
  );
  glassLens.position.set(-7.9, 0, 0);
  tubeGroup.add(glassLens);

  // ==========================================
  // ANODE APERTURE TARGET (CLAIM 2)
  // ==========================================
  const fingerGeo = new THREE.CylinderGeometry(0.22, 0.28, 1.8, 16);
  disposables.push(fingerGeo);
  const anodeFinger = new THREE.Mesh(fingerGeo, anodeBrassMat);
  anodeFinger.position.set(4.4, 0, 0);
  anodeFinger.rotation.z = Math.PI / 2;
  tubeGroup.add(anodeFinger);

  const tipGeo = new THREE.TorusGeometry(0.12, 0.04, 8, 16);
  disposables.push(tipGeo);
  const apertureTip = new THREE.Mesh(tipGeo, apertureMat);
  apertureTip.rotation.y = Math.PI / 2;
  apertureTip.position.set(3.5, 0, 0);
  tubeGroup.add(apertureTip);

  // ==========================================
  // MAGNETIC FOCUS & DEFLECTION COILS (CLAIM 3)
  // ==========================================
  const focusGeo = new THREE.CylinderGeometry(2.15, 2.15, 7.2, 36, 1, true);
  disposables.push(focusGeo);
  const focusCoil = new THREE.Mesh(focusGeo, focusCoilMat);
  focusCoil.rotation.z = Math.PI / 2;
  focusCoil.position.x = -0.2;
  tubeGroup.add(focusCoil);

  for (let d = 0; d < 4; d++) {
    const dAngle = (d * Math.PI) / 2;
    const yokeGeo = new THREE.BoxGeometry(2.4, 0.35, 1.2);
    disposables.push(yokeGeo);
    const saddleYoke = new THREE.Mesh(yokeGeo, copperCoilMat);
    saddleYoke.position.set(0.5, Math.cos(dAngle) * 2.3, Math.sin(dAngle) * 2.3);
    saddleYoke.rotation.x = dAngle;
    tubeGroup.add(saddleYoke);
  }

  // ==========================================
  // SCANNING ELECTRON IMAGE BEAM PARTICLES
  // ==========================================
  const beamCount = 350;
  const beamGeo = new THREE.BufferGeometry();
  disposables.push(beamGeo);
  const beamPos = new Float32Array(beamCount * 3);
  const beamColors = new Float32Array(beamCount * 3);
  const glowTex = createGlowPointTexture();
  disposables.push(glowTex);

  for (let i = 0; i < beamCount; i++) {
    const idx = i * 3;
    const progress = i / beamCount;
    beamPos[idx] = -4.5 + progress * 9.3;
    beamPos[idx + 1] = 0;
    beamPos[idx + 2] = 0;

    beamColors[idx] = 0.3 + progress * 0.4;
    beamColors[idx + 1] = 0.8 + progress * 0.2;
    beamColors[idx + 2] = 1.0;
  }

  beamGeo.setAttribute("position", new THREE.BufferAttribute(beamPos, 3));
  beamGeo.setAttribute("color", new THREE.BufferAttribute(beamColors, 3));

  const beamMat = new THREE.PointsMaterial({
    size: 0.4,
    map: glowTex,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  disposables.push(beamMat);

  const beamPoints = new THREE.Points(beamGeo, beamMat);
  root.add(beamPoints);

  // ==========================================
  // KINEMATICS & SCANNING DYNAMICS UPDATE FUNCTION
  // ==========================================
  const updateKinematics = (
    delta: number,
    renderedSteps: number,
    velocityMps: number,
    horizontalFreqKhz: number,
    verticalFreqHz: number,
    showElectronBeam: boolean,
  ) => {
    if (showElectronBeam) {
      const bPos = beamPos;
      const speed = (velocityMps / 20000000) * 45.0 * delta;

      const simTimeSec = renderedSteps * (1 / 60);
      const hScan = Math.sin(simTimeSec * horizontalFreqKhz * 0.4) * 0.9;
      const vScan = Math.sin(simTimeSec * verticalFreqHz * 0.2) * 0.9;

      for (let i = 0; i < beamCount; i++) {
        const idx = i * 3;
        bPos[idx] += speed;

        const pX = bPos[idx];
        const frac = Math.max(0, Math.min(1, (pX + 4.5) / 8.0));

        bPos[idx + 1] = frac * vScan + (lcg() - 0.5) * 0.08;
        bPos[idx + 2] = frac * hScan + (lcg() - 0.5) * 0.08;

        if (bPos[idx] > 4.2) {
          bPos[idx] = -4.5 + (lcg() - 0.5) * 0.2;
          bPos[idx + 1] = (lcg() - 0.5) * 1.5;
          bPos[idx + 2] = (lcg() - 0.5) * 1.5;
        }
      }
      beamGeo.attributes.position.needsUpdate = true;
      beamPoints.visible = true;
    } else {
      beamPoints.visible = false;
    }
  };

  const dispose = () => {
    for (const d of disposables) {
      d.dispose();
    }
  };

  return {
    root,
    tubeGroup,
    photocathode,
    lensBarrel,
    anodeFinger,
    apertureTip,
    focusCoil,
    beamPoints,
    beamGeo,
    beamPos,
    beamColors,
    updateKinematics,
    dispose,
  };
}
