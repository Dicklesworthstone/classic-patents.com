/**
 * Procedural Three.js Model Builder for US 593,138
 * Nikola Tesla — Electrical Transformer (High-Frequency Tesla Coil, 1897)
 *
 * Implements the authentic resonant air-core transformer:
 * - Turned mahogany baseboard with 6 radial slotted guide combs
 * - Continuous Archimedean flat pancake / conical spiral primary coil (Claim 1)
 * - Vertical helical secondary resonator cylinder with high-voltage insulation (Claim 2)
 * - Spun aluminum toroidal electrostatic topload terminal (Claim 3)
 * - Rotary quenching spark gap with twin spherical brass electrodes
 * - Real-time branching lightning streamers and glowing coronal discharge particles
 */

import * as THREE from "three";
import { createLcg } from "@/utils/lcg";
import { createGlowPointTexture } from "./ThreeStudioScene";

export interface TeslaCoilModel {
  root: THREE.Group;
  coilGroup: THREE.Group;
  tableBase: THREE.Mesh;
  secondaryCylinder: THREE.Mesh;
  spiralMesh: THREE.Mesh;
  toroidMesh: THREE.Mesh;
  sparkGapBase: THREE.Mesh;
  coronaPoints: THREE.Points;
  streamerLines: THREE.Line[];
  streamerGeos: THREE.BufferGeometry[];
  updateKinematics: (
    delta: number,
    showLightningStreamers: boolean,
    streamerLengthMeters: number,
    secondaryVoltageMv: number,
  ) => void;
  dispose: () => void;
}

export function buildTeslaCoilModel(): TeslaCoilModel {
  const root = new THREE.Group();
  const disposables: Array<{ dispose: () => void }> = [];
  const lcg = createLcg(18971102);

  // --- AUTHENTIC MATERIALS ---
  const toroidAluminumMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.1,
    metalness: 0.95,
  });
  disposables.push(toroidAluminumMat);

  const secondaryCopperWireMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.3,
    metalness: 0.85,
  });
  disposables.push(secondaryCopperWireMat);

  const primaryHeavyCopperMat = new THREE.MeshStandardMaterial({
    color: 0xca8a04,
    roughness: 0.18,
    metalness: 0.9,
  });
  disposables.push(primaryHeavyCopperMat);

  const baseMahoganyMat = new THREE.MeshStandardMaterial({
    color: 0x78350f,
    roughness: 0.35,
    metalness: 0.05,
  });
  disposables.push(baseMahoganyMat);

  const sparkGapBrassMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.12,
    metalness: 0.95,
  });
  disposables.push(sparkGapBrassMat);

  const sparkGapBaseMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.5,
  });
  disposables.push(sparkGapBaseMat);

  // ==========================================
  // RESONANT TRANSFORMER APPARATUS (CLAIM 1)
  // ==========================================
  const coilGroup = new THREE.Group();
  root.add(coilGroup);

  // Insulated Base Table
  const tableGeo = new THREE.CylinderGeometry(4.2, 4.5, 0.8, 36);
  disposables.push(tableGeo);
  const tableBase = new THREE.Mesh(tableGeo, baseMahoganyMat);
  tableBase.position.y = -3.8;
  tableBase.receiveShadow = true;
  coilGroup.add(tableBase);

  // Secondary Resonator Cylinder (Claim 2)
  const secGeo = new THREE.CylinderGeometry(0.85, 0.85, 5.2, 48);
  disposables.push(secGeo);
  const secondaryCylinder = new THREE.Mesh(secGeo, secondaryCopperWireMat);
  secondaryCylinder.position.y = -0.6;
  secondaryCylinder.castShadow = true;
  coilGroup.add(secondaryCylinder);

  // Archimedean Spiral Primary Coil
  const spiralPts: THREE.Vector3[] = [];
  const numSpiralTurns = 6.0;
  const numSpiralPts = 160;
  const innerRadius = 1.3;
  const outerRadius = 3.6;

  for (let i = 0; i <= numSpiralPts; i++) {
    const t = i / numSpiralPts;
    const angle = t * numSpiralTurns * Math.PI * 2;
    const radius = innerRadius + t * (outerRadius - innerRadius);
    const y = -2.8 + t * 0.45;
    spiralPts.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius));
  }

  const spiralCurve = new THREE.CatmullRomCurve3(spiralPts);
  const spiralGeo = new THREE.TubeGeometry(spiralCurve, 140, 0.09, 8, false);
  disposables.push(spiralGeo);
  const spiralMesh = new THREE.Mesh(spiralGeo, primaryHeavyCopperMat);
  spiralMesh.castShadow = true;
  coilGroup.add(spiralMesh);

  // 6 Radial Slotted Comb Standoffs
  for (let s = 0; s < 6; s++) {
    const sAngle = (s * Math.PI * 2) / 6;
    const combGeo = new THREE.BoxGeometry(2.4, 0.35, 0.18);
    disposables.push(combGeo);
    const comb = new THREE.Mesh(combGeo, baseMahoganyMat);
    comb.position.set(Math.cos(sAngle) * 2.4, -2.8, Math.sin(sAngle) * 2.4);
    comb.rotation.y = -sAngle;
    coilGroup.add(comb);
  }

  // Toroidal Topload Terminal (Claim 3)
  const toroidGeo = new THREE.TorusGeometry(1.65, 0.65, 24, 48);
  disposables.push(toroidGeo);
  const toroidMesh = new THREE.Mesh(toroidGeo, toroidAluminumMat);
  toroidMesh.rotation.x = Math.PI / 2;
  toroidMesh.position.y = 2.4;
  toroidMesh.castShadow = true;
  coilGroup.add(toroidMesh);

  // Rotary Spark Gap
  const gapBaseGeo = new THREE.BoxGeometry(2.4, 0.15, 1.4);
  disposables.push(gapBaseGeo);
  const sparkGapBase = new THREE.Mesh(gapBaseGeo, sparkGapBaseMat);
  sparkGapBase.position.set(2.4, -3.3, 0);
  coilGroup.add(sparkGapBase);

  [-0.5, 0.5].forEach((gx) => {
    const electrodeGeo = new THREE.SphereGeometry(0.22, 16, 16);
    disposables.push(electrodeGeo);
    const electrode = new THREE.Mesh(electrodeGeo, sparkGapBrassMat);
    electrode.position.set(2.4 + gx, -3.05, 0);
    coilGroup.add(electrode);
  });

  // ==========================================
  // BRANCHING LIGHTNING STREAMER LINES
  // ==========================================
  const streamerCount = 6;
  const streamerLines: THREE.Line[] = [];
  const streamerGeos: THREE.BufferGeometry[] = [];

  for (let s = 0; s < streamerCount; s++) {
    const segCount = 14;
    const geo = new THREE.BufferGeometry();
    disposables.push(geo);
    const pos = new Float32Array(segCount * 3);
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.9,
    });
    disposables.push(mat);
    const line = new THREE.Line(geo, mat);
    root.add(line);
    streamerLines.push(line);
    streamerGeos.push(geo);
  }

  // ==========================================
  // GLOWING CORONAL PARTICLES
  // ==========================================
  const coronaCount = 80;
  const coronaGeo = new THREE.BufferGeometry();
  disposables.push(coronaGeo);
  const coronaPos = new Float32Array(coronaCount * 3);
  const glowTex = createGlowPointTexture();
  disposables.push(glowTex);

  for (let i = 0; i < coronaCount; i++) {
    const idx = i * 3;
    const theta = lcg() * Math.PI * 2;
    const r = 1.65 + (lcg() - 0.5) * 0.9;
    coronaPos[idx] = Math.cos(theta) * r;
    coronaPos[idx + 1] = 2.4 + (lcg() - 0.5) * 0.8;
    coronaPos[idx + 2] = Math.sin(theta) * r;
  }
  coronaGeo.setAttribute("position", new THREE.BufferAttribute(coronaPos, 3));

  const coronaMat = new THREE.PointsMaterial({
    size: 0.35,
    map: glowTex,
    color: 0x67e8f9,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  disposables.push(coronaMat);

  const coronaPoints = new THREE.Points(coronaGeo, coronaMat);
  root.add(coronaPoints);

  // ==========================================
  // KINEMATICS & PLASMA DISCHARGE UPDATE FUNCTION
  // ==========================================
  const updateKinematics = (
    _delta: number,
    showLightningStreamers: boolean,
    streamerLengthMeters: number,
    _secondaryVoltageMv: number,
  ) => {
    if (showLightningStreamers) {
      coronaPoints.visible = true;

      for (let s = 0; s < streamerCount; s++) {
        const line = streamerLines[s];
        const geo = streamerGeos[s];
        const posAttr = geo.attributes.position as THREE.BufferAttribute;
        const pos = posAttr.array as Float32Array;

        const theta = (s * Math.PI * 2) / streamerCount + (lcg() - 0.5) * 0.4;
        const length = (streamerLengthMeters / 1.5) * (2.2 + lcg() * 1.8);

        let curX = Math.cos(theta) * 1.8;
        let curY = 2.4;
        let curZ = Math.sin(theta) * 1.8;

        pos[0] = curX;
        pos[1] = curY;
        pos[2] = curZ;

        const segs = 14;
        for (let i = 1; i < segs; i++) {
          curX += Math.cos(theta) * (length / segs) + (lcg() - 0.5) * 0.35;
          curY += (lcg() - 0.3) * (length / segs) * 0.5;
          curZ += Math.sin(theta) * (length / segs) + (lcg() - 0.5) * 0.35;

          const idx = i * 3;
          pos[idx] = curX;
          pos[idx + 1] = curY;
          pos[idx + 2] = curZ;
        }

        posAttr.needsUpdate = true;
        line.visible = true;
      }
    } else {
      coronaPoints.visible = false;
      for (let s = 0; s < streamerCount; s++) {
        streamerLines[s].visible = false;
      }
    }
  };

  const dispose = () => {
    for (const d of disposables) {
      d.dispose();
    }
  };

  return {
    root,
    coilGroup,
    tableBase,
    secondaryCylinder,
    spiralMesh,
    toroidMesh,
    sparkGapBase,
    coronaPoints,
    streamerLines,
    streamerGeos,
    updateKinematics,
    dispose,
  };
}
