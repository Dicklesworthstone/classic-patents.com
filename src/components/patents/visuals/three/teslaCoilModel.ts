/**
 * teslaCoilModel.ts
 *
 * Museum-Grade Procedural 3D Model for Nikola Tesla's 1897 High-Frequency Electrical Transformer
 * (US Patent 593,138 - "Electrical Transformer").
 *
 * Reconstructs the authentic resonant air-core transformer:
 * - Turned mahogany baseboard with 6 radial slotted guide combs and brass binding posts.
 * - Continuous Archimedean flat pancake / conical spiral primary coil of heavy copper tubing (Claim 1).
 * - Vertical helical secondary resonator cylinder with high-voltage insulation and RF ground (Claim 2).
 * - Spun aluminum toroidal electrostatic topload terminal with discharge needle (Claim 3).
 * - Rotary quenching spark gap with spherical brass electrodes and Leyden jar tank capacitor.
 * - Real-time branching lightning streamers and glowing coronal discharge particles.
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
  capacitorGroup?: THREE.Group;
  updateKinematics: (
    delta: number,
    showLightningStreamers: boolean,
    streamerStudioLength: number,
    secondaryVoltageMv: number,
  ) => void;
  setCutaway?: (cutaway: boolean) => void;
  dispose: () => void;
}

export function buildTeslaCoilModel(): TeslaCoilModel {
  const root = new THREE.Group();
  const disposables: Array<{ dispose: () => void }> = [];
  const lcg = createLcg(18971102);

  // --- Museum-Grade Materials ---
  const toroidAluminumMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.12,
    metalness: 0.95,
  });
  disposables.push(toroidAluminumMat);

  const secondaryCopperWireMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.32,
    metalness: 0.85,
  });
  disposables.push(secondaryCopperWireMat);

  const primaryHeavyCopperMat = new THREE.MeshStandardMaterial({
    color: 0xca8a04,
    roughness: 0.2,
    metalness: 0.92,
  });
  disposables.push(primaryHeavyCopperMat);

  const baseMahoganyMat = new THREE.MeshStandardMaterial({
    color: 0x5c2c16,
    roughness: 0.42,
    metalness: 0.05,
  });
  disposables.push(baseMahoganyMat);

  const sparkGapBrassMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.15,
    metalness: 0.94,
  });
  disposables.push(sparkGapBrassMat);

  const sparkGapBaseMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.65,
    metalness: 0.8,
  });
  disposables.push(sparkGapBaseMat);

  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.1,
    metalness: 0.1,
    transparent: true,
    opacity: 0.5,
  });
  disposables.push(glassMat);

  // ==========================================
  // RESONANT TRANSFORMER APPARATUS (CLAIM 1)
  // ==========================================
  const coilGroup = new THREE.Group();
  root.add(coilGroup);

  // Insulated Mahogany Base Table
  const tableGeo = new THREE.CylinderGeometry(4.4, 4.6, 0.85, 36);
  disposables.push(tableGeo);
  const tableBase = new THREE.Mesh(tableGeo, baseMahoganyMat);
  tableBase.position.y = -3.8;
  tableBase.receiveShadow = true;
  tableBase.castShadow = true;
  coilGroup.add(tableBase);

  // 6 Turned Wooden Table Legs
  for (let l = 0; l < 6; l++) {
    const lAngle = (l * Math.PI * 2) / 6;
    const legGeo = new THREE.CylinderGeometry(0.22, 0.28, 2.0, 16);
    disposables.push(legGeo);
    const leg = new THREE.Mesh(legGeo, baseMahoganyMat);
    leg.position.set(Math.cos(lAngle) * 3.8, -4.8, Math.sin(lAngle) * 3.8);
    coilGroup.add(leg);
  }

  // Secondary Resonator Cylinder (Claim 2)
  const secGeo = new THREE.CylinderGeometry(0.88, 0.88, 5.4, 48);
  disposables.push(secGeo);
  const secondaryCylinder = new THREE.Mesh(secGeo, secondaryCopperWireMat);
  secondaryCylinder.position.y = -0.6;
  secondaryCylinder.castShadow = true;
  coilGroup.add(secondaryCylinder);

  // Ebonite base and top insulators on secondary cylinder
  [-3.3, 2.1].forEach((iy) => {
    const capGeo = new THREE.CylinderGeometry(0.95, 0.95, 0.2, 32);
    disposables.push(capGeo);
    const cap = new THREE.Mesh(capGeo, sparkGapBaseMat);
    cap.position.y = iy;
    coilGroup.add(cap);
  });

  // Archimedean Spiral Primary Coil of Heavy Copper Tubing
  const spiralPts: THREE.Vector3[] = [];
  const numSpiralTurns = 6.0;
  const numSpiralPts = 160;
  const innerRadius = 1.35;
  const outerRadius = 3.7;

  for (let i = 0; i <= numSpiralPts; i++) {
    const t = i / numSpiralPts;
    const angle = t * numSpiralTurns * Math.PI * 2;
    const radius = innerRadius + t * (outerRadius - innerRadius);
    const y = -2.8 + t * 0.45;
    spiralPts.push(new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius));
  }

  const spiralCurve = new THREE.CatmullRomCurve3(spiralPts);
  const spiralGeo = new THREE.TubeGeometry(spiralCurve, 140, 0.095, 10, false);
  disposables.push(spiralGeo);
  const spiralMesh = new THREE.Mesh(spiralGeo, primaryHeavyCopperMat);
  spiralMesh.castShadow = true;
  coilGroup.add(spiralMesh);

  // 6 Radial Slotted Comb Standoffs (Securing primary turns)
  for (let s = 0; s < 6; s++) {
    const sAngle = (s * Math.PI * 2) / 6;
    const combGeo = new THREE.BoxGeometry(2.5, 0.38, 0.2);
    disposables.push(combGeo);
    const comb = new THREE.Mesh(combGeo, baseMahoganyMat);
    comb.position.set(Math.cos(sAngle) * 2.5, -2.8, Math.sin(sAngle) * 2.5);
    comb.rotation.y = -sAngle;
    comb.castShadow = true;
    coilGroup.add(comb);
  }

  // Toroidal Topload Terminal (Claim 3) with Discharge Needle
  const toroidGeo = new THREE.TorusGeometry(1.7, 0.68, 28, 54);
  disposables.push(toroidGeo);
  const toroidMesh = new THREE.Mesh(toroidGeo, toroidAluminumMat);
  toroidMesh.rotation.x = Math.PI / 2;
  toroidMesh.position.y = 2.4;
  toroidMesh.castShadow = true;
  coilGroup.add(toroidMesh);

  // Brass discharge breakout needle on top of toroid
  const needleGeo = new THREE.ConeGeometry(0.08, 0.6, 12);
  disposables.push(needleGeo);
  const needle = new THREE.Mesh(needleGeo, sparkGapBrassMat);
  needle.position.set(0, 3.2, 0);
  coilGroup.add(needle);

  // Rotary Quenched Spark Gap
  const gapBaseGeo = new THREE.BoxGeometry(2.5, 0.16, 1.5);
  disposables.push(gapBaseGeo);
  const sparkGapBase = new THREE.Mesh(gapBaseGeo, sparkGapBaseMat);
  sparkGapBase.position.set(2.4, -3.3, 0);
  coilGroup.add(sparkGapBase);

  [-0.55, 0.55].forEach((gx) => {
    const electrodeGeo = new THREE.SphereGeometry(0.24, 18, 18);
    disposables.push(electrodeGeo);
    const electrode = new THREE.Mesh(electrodeGeo, sparkGapBrassMat);
    electrode.position.set(2.4 + gx, -3.05, 0);
    electrode.castShadow = true;
    coilGroup.add(electrode);
  });

  // Leyden Jar Tank Capacitors
  const capacitorGroup = new THREE.Group();
  capacitorGroup.position.set(-2.5, -3.2, 0);
  coilGroup.add(capacitorGroup);

  [-0.4, 0.4].forEach((jx) => {
    const jarGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.85, 16);
    disposables.push(jarGeo);
    const jar = new THREE.Mesh(jarGeo, glassMat);
    jar.position.set(jx, 0.45, 0);
    capacitorGroup.add(jar);

    const foilGeo = new THREE.CylinderGeometry(0.33, 0.33, 0.45, 16);
    disposables.push(foilGeo);
    const foil = new THREE.Mesh(foilGeo, toroidAluminumMat);
    foil.position.set(jx, 0.25, 0);
    capacitorGroup.add(foil);
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
    const r = 1.7 + (lcg() - 0.5) * 0.95;
    coronaPos[idx] = Math.cos(theta) * r;
    coronaPos[idx + 1] = 2.4 + (lcg() - 0.5) * 0.85;
    coronaPos[idx + 2] = Math.sin(theta) * r;
  }
  coronaGeo.setAttribute("position", new THREE.BufferAttribute(coronaPos, 3));

  const coronaMat = new THREE.PointsMaterial({
    size: 0.38,
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
    streamerStudioLength: number,
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
        const length = streamerStudioLength * (2.2 + lcg() * 1.8);

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

  const setCutaway = (cutaway: boolean) => {
    secondaryCopperWireMat.wireframe = cutaway;
    secondaryCopperWireMat.needsUpdate = true;
    baseMahoganyMat.transparent = cutaway;
    baseMahoganyMat.opacity = cutaway ? 0.4 : 1.0;
    baseMahoganyMat.needsUpdate = true;
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
    capacitorGroup,
    updateKinematics,
    setCutaway,
    dispose,
  };
}
