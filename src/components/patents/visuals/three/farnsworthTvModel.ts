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
import { farnsworthBeamFrac } from "@/physics/catalogKernels";
import { FrankenSimEngine } from "@/physics/engine";
import { laplacianModeShape, laplacianModes } from "@/physics/genericWasm";
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
  /** Deterministic per-particle offsets, sampled only during model construction. */
  beamJitter: Float32Array;
  /** Materials whose opacity changes in the deliberate cutaway presentation. */
  materials: {
    glassEnvelopeMat: THREE.MeshPhysicalMaterial;
    photocathodeMat: THREE.MeshStandardMaterial;
    copperCoilMat: THREE.MeshStandardMaterial;
    anodeBrassMat: THREE.MeshStandardMaterial;
    mahoganyMat: THREE.MeshStandardMaterial;
    goldMat: THREE.MeshStandardMaterial;
    apertureMat: THREE.MeshStandardMaterial;
    focusCoilMat: THREE.MeshStandardMaterial;
    beamMat: THREE.PointsMaterial;
  };
  updateKinematics: (
    delta: number,
    renderedSteps: number,
    electronDisplaySpeed: number,
    horizontalFreqKhz: number,
    verticalFreqHz: number,
    showElectronBeam: boolean,
    isCutaway?: boolean,
  ) => void;
  dispose: () => void;
}

/**
 * Deterministic unit noise for procedural grain generation.
 */
function deterministicUnit(index: number, channel: number): number {
  const sample = Math.sin((index + 1) * 12.9898 + (channel + 1) * 78.233) * 43758.5453;
  return sample - Math.floor(sample);
}

/**
 * Procedural Polished Mahogany Optical Bench Texture
 */
function createMahoganyTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  // Deep rich mahogany brown
  ctx.fillStyle = "#5c2410";
  ctx.fillRect(0, 0, 512, 512);

  // Longitudinal wood growth rings & ribbon figure
  for (let i = 0; i < 90; i++) {
    const x = i * 5.8 + (deterministicUnit(i, 0) - 0.5) * 4;
    const alpha = 0.08 + (i % 4 === 0 ? 0.14 : 0.04);
    ctx.strokeStyle = `rgba(45, 14, 5, ${alpha})`;
    ctx.lineWidth = 1.3 + (i % 3) * 0.5;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.bezierCurveTo(x + 14, 160, x - 12, 360, x + 6, 512);
    ctx.stroke();
  }

  // Pores
  for (let p = 0; p < 300; p++) {
    const px = deterministicUnit(p, 1) * 512;
    const py = deterministicUnit(p, 2) * 512;
    ctx.fillStyle = "rgba(25, 8, 3, 0.28)";
    ctx.fillRect(px, py, 1.8, 5 + deterministicUnit(p, 3) * 8);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildFarnsworthTvModel(): FarnsworthTvModel {
  const root = new THREE.Group();
  const disposables: Array<{ dispose: () => void }> = [];
  const lcg = createLcg(19300826);

  const mahoganyTex = createMahoganyTexture();
  if (mahoganyTex) disposables.push(mahoganyTex);

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
    ...(mahoganyTex ? { map: mahoganyTex } : {}),
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

  // Polished Mahogany Bench with Beveled Edges
  const benchGeo = new THREE.BoxGeometry(14.0, 0.65, 5.0);
  disposables.push(benchGeo);
  const bench = new THREE.Mesh(benchGeo, mahoganyMat);
  bench.position.y = -2.8;
  bench.castShadow = true;
  bench.receiveShadow = true;
  tubeGroup.add(bench);

  // 4 Turned Brass Bun Feet Under Optical Bench
  [
    [-6.2, -2.0],
    [6.2, -2.0],
    [-6.2, 2.0],
    [6.2, 2.0],
  ].forEach(([fx, fz]) => {
    const footGeo = new THREE.CylinderGeometry(0.35, 0.25, 0.25, 16);
    disposables.push(footGeo);
    const foot = new THREE.Mesh(footGeo, anodeBrassMat);
    foot.position.set(fx, -3.25, fz);
    tubeGroup.add(foot);
  });

  // Dual Brass Saddle Clamps with Thumbscrews
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
    clampStandoff.castShadow = true;
    tubeGroup.add(clampStandoff);

    // Knurled clamping thumbscrew on top
    const thumbGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.35, 14);
    disposables.push(thumbGeo);
    const thumb = new THREE.Mesh(thumbGeo, anodeBrassMat);
    thumb.position.set(cx, 2.45, 0);
    tubeGroup.add(thumb);
  });

  // Blown Glass Envelope with Exhaust Tip and Vacuum Neck
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
  glassTube.castShadow = true;
  tubeGroup.add(glassTube);

  // Cesium-Oxide Photocathode Disc (Photoemissive Surface)
  const photoGeo = new THREE.CircleGeometry(1.7, 36);
  disposables.push(photoGeo);
  const photocathode = new THREE.Mesh(photoGeo, photocathodeMat);
  photocathode.rotation.y = Math.PI / 2;
  photocathode.position.x = -4.8;
  photocathode.castShadow = true;
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

  // 5. Orthogonal Saddle Deflection Scanning Coils (Horizontal & Vertical Scanning)
  const saddleCoilGeo = new THREE.TorusGeometry(1.72, 0.08, 16, 32, Math.PI * 0.8);
  disposables.push(saddleCoilGeo);

  const saddleH1 = new THREE.Mesh(saddleCoilGeo, copperCoilMat);
  saddleH1.position.set(-0.2, 0, 0);
  root.add(saddleH1);

  const saddleH2 = new THREE.Mesh(saddleCoilGeo, copperCoilMat);
  saddleH2.rotation.y = Math.PI;
  saddleH2.position.set(-0.2, 0, 0);
  root.add(saddleH2);

  const saddleV1 = new THREE.Mesh(saddleCoilGeo, copperCoilMat);
  saddleV1.rotation.x = Math.PI / 2;
  saddleV1.position.set(-0.2, 0, 0);
  root.add(saddleV1);

  const saddleV2 = new THREE.Mesh(saddleCoilGeo, copperCoilMat);
  saddleV2.rotation.x = -Math.PI / 2;
  saddleV2.position.set(-0.2, 0, 0);
  root.add(saddleV2);

  // --- RELATIVISTIC SCANNING ELECTRON BEAM PARTICLES ---
  const beamCount = 220;
  const beamGeo = new THREE.BufferGeometry();
  disposables.push(beamGeo);
  const beamPos = new Float32Array(beamCount * 3);
  const beamColors = new Float32Array(beamCount * 3);
  const beamJitter = new Float32Array(beamCount * 3);

  const glowTex = createGlowPointTexture();
  disposables.push(glowTex);

  for (let i = 0; i < beamCount; i++) {
    const idx = i * 3;
    beamPos[idx] = -4.2 + lcg() * 6.5;
    beamPos[idx + 1] = (lcg() - 0.5) * 1.6;
    beamPos[idx + 2] = (lcg() - 0.5) * 1.6;

    beamJitter[idx] = (lcg() - 0.5) * 0.2;
    beamJitter[idx + 1] = (lcg() - 0.5) * 1.5;
    beamJitter[idx + 2] = (lcg() - 0.5) * 1.5;

    // Glowing cyan-electric blue electron image beam
    beamColors[idx] = 0.15;
    beamColors[idx + 1] = 0.75 + lcg() * 0.25;
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

  const updateKinematics = (
    delta: number,
    renderedSteps: number,
    electronDisplaySpeed: number,
    horizontalFreqKhz: number,
    verticalFreqHz: number,
    showElectronBeam: boolean,
    isCutaway = false,
  ) => {
    updateFarnsworthTvKinematics(
      model,
      delta,
      renderedSteps,
      electronDisplaySpeed,
      horizontalFreqKhz,
      verticalFreqHz,
      showElectronBeam,
      isCutaway,
    );
  };

  const dispose = () => {
    for (const d of disposables) {
      d.dispose();
    }
  };

  const model: FarnsworthTvModel = {
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
    beamJitter,
    materials: {
      glassEnvelopeMat,
      photocathodeMat,
      copperCoilMat,
      anodeBrassMat,
      mahoganyMat,
      goldMat,
      apertureMat,
      focusCoilMat,
      beamMat,
    },
    updateKinematics,
    dispose,
  };

  return model;
}

/**
 * Updates Farnsworth Dissector Tube relativistic electron beam scanning raster and cutaway.
 */
export function updateFarnsworthTvKinematics(
  model: FarnsworthTvModel,
  delta: number,
  renderedSteps: number,
  electronDisplaySpeed: number,
  horizontalFreqKhz: number,
  verticalFreqHz: number,
  showElectronBeam: boolean,
  isCutaway = false,
): void {
  if (showElectronBeam) {
    const bPos = model.beamPos;
    const speed = electronDisplaySpeed * delta;

    const tv = FrankenSimEngine.stepFarnsworthTv(1.5, 120);
    const simTimeSec = renderedSteps * (1 / 60);
    const hScan = Math.sin(simTimeSec * horizontalFreqKhz * tv.scanHCoupling) * tv.scanAmp;
    const vScan = Math.sin(simTimeSec * verticalFreqHz * tv.scanVCoupling) * tv.scanAmp;
    const modes = laplacianModes(16, 3);

    for (let i = 0; i < model.beamPos.length / 3; i++) {
      const idx = i * 3;
      bPos[idx] += speed;

      const pX = bPos[idx];
      const frac = farnsworthBeamFrac(pX, tv.beamPathOriginX, tv.beamPathSpanX);
      const mode = 1 + 0.35 * laplacianModeShape(modes, 16, 3, 0, i);

      bPos[idx + 1] = frac * vScan + model.beamJitter[idx + 1] * tv.beamJitterAmp * mode;
      bPos[idx + 2] = frac * hScan + model.beamJitter[idx + 2] * tv.beamJitterAmp * mode;

      if (bPos[idx] > tv.beamWrapX) {
        bPos[idx] = tv.beamPathOriginX + model.beamJitter[idx];
        bPos[idx + 1] = model.beamJitter[idx + 1];
        bPos[idx + 2] = model.beamJitter[idx + 2];
      }
    }
    model.beamGeo.attributes.position.needsUpdate = true;
    model.beamPoints.visible = true;
  } else {
    model.beamPoints.visible = false;
  }

  // Cutaway mode: make focusing/deflection coils and tube hardware translucent
  model.materials.focusCoilMat.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.focusCoilMat.transparent = isCutaway;
  model.materials.copperCoilMat.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.copperCoilMat.transparent = isCutaway;
  model.materials.mahoganyMat.opacity = isCutaway ? 0.35 : 1.0;
  model.materials.mahoganyMat.transparent = isCutaway;
}
