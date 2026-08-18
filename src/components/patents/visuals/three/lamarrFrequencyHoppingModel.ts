/**
 * Procedural Three.js Model Builder for US 2,292,387
 * Hedy Kiesler Markey (Hedy Lamarr) & George Antheil — Secret Communication System (1942)
 *
 * Implements the authentic spread-spectrum frequency-hopping torpedo guidance system:
 * - Cylindrical torpedo instrument bay aluminum frame with brass sideplates
 * - Clockwork-driven slotted 88-key perforated piano roll paper tape web (Claim 1)
 * - Twin flanged brass supply and take-up tape reels
 * - 88-contact spring finger sensing comb with gold plunger pins (Claim 2)
 * - 88-channel RF spectral frequency waterfall bars showing active carrier hops vs jamming (Claim 3)
 * - RF carrier hopping trajectory particles
 */

import * as THREE from "three";
import { createLcg } from "@/utils/lcg";
import { createGlowPointTexture } from "./ThreeStudioScene";

export interface LamarrFrequencyHoppingModel {
  root: THREE.Group;
  apparatusGroup: THREE.Group;
  drum1: THREE.Mesh;
  drum2: THREE.Mesh;
  paperWeb: THREE.Mesh;
  comb: THREE.Mesh;
  spectrumBarsGroup: THREE.Group;
  barMeshes: THREE.Mesh[];
  hopPoints: THREE.Points;
  updateKinematics: (
    delta: number,
    activeChan: number,
    liveChannels: number,
    isJammingActive: boolean,
    jamCenter: number,
  ) => void;
  dispose: () => void;
}

export function buildLamarrFrequencyHoppingModel(): LamarrFrequencyHoppingModel {
  const root = new THREE.Group();
  const disposables: Array<{ dispose: () => void }> = [];
  const lcg = createLcg(19420811);

  // --- AUTHENTIC MATERIALS ---
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.18,
    metalness: 0.92,
  });
  disposables.push(brassMat);

  const pianoRollPaperMat = new THREE.MeshStandardMaterial({
    color: 0xfef9e7,
    roughness: 0.8,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });
  disposables.push(pianoRollPaperMat);

  const torpedoBayMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.85,
    roughness: 0.35,
    side: THREE.BackSide,
  });
  disposables.push(torpedoBayMat);

  const goldCombMat = new THREE.MeshStandardMaterial({
    color: 0xca8a04,
    roughness: 0.2,
    metalness: 0.95,
  });
  disposables.push(goldCombMat);

  const pinMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    metalness: 0.95,
  });
  disposables.push(pinMat);

  // ==========================================
  // TORPEDO INSTRUMENT BAY & PIANO ROLL ASSEMBLY (CLAIM 1)
  // ==========================================
  const apparatusGroup = new THREE.Group();
  root.add(apparatusGroup);

  // Torpedo Bay Aluminum Shell
  const bayGeo = new THREE.CylinderGeometry(4.2, 4.2, 7.8, 36, 1, true);
  disposables.push(bayGeo);
  const torpedoBay = new THREE.Mesh(bayGeo, torpedoBayMat);
  torpedoBay.rotation.z = Math.PI / 2;
  torpedoBay.position.y = 0.5;
  apparatusGroup.add(torpedoBay);

  // Brass Framework Sideplates
  [-2.6, 2.6].forEach((zPos) => {
    const plateGeo = new THREE.BoxGeometry(7.2, 2.8, 0.15);
    disposables.push(plateGeo);
    const sidePlate = new THREE.Mesh(plateGeo, brassMat);
    sidePlate.position.set(0, 0.4, zPos);
    apparatusGroup.add(sidePlate);
  });

  // Twin Flanged Brass Spools
  const drum1Geo = new THREE.CylinderGeometry(0.8, 0.8, 5.0, 32);
  disposables.push(drum1Geo);
  const drum1 = new THREE.Mesh(drum1Geo, brassMat);
  drum1.rotation.x = Math.PI / 2;
  drum1.position.set(-3.0, 0.4, 0);
  drum1.castShadow = true;
  apparatusGroup.add(drum1);

  const drum2Geo = new THREE.CylinderGeometry(0.8, 0.8, 5.0, 32);
  disposables.push(drum2Geo);
  const drum2 = new THREE.Mesh(drum2Geo, brassMat);
  drum2.rotation.x = Math.PI / 2;
  drum2.position.set(3.0, 0.4, 0);
  drum2.castShadow = true;
  apparatusGroup.add(drum2);

  [-3.0, 3.0].forEach((xPos) => {
    [-2.55, 2.55].forEach((fz) => {
      const flangeGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.08, 32);
      disposables.push(flangeGeo);
      const flange = new THREE.Mesh(flangeGeo, brassMat);
      flange.rotation.x = Math.PI / 2;
      flange.position.set(xPos, 0.4, fz);
      apparatusGroup.add(flange);
    });
  });

  // Perforated 88-Key Piano Roll Tape
  const webGeo = new THREE.PlaneGeometry(6.0, 4.8);
  disposables.push(webGeo);
  const paperWeb = new THREE.Mesh(webGeo, pianoRollPaperMat);
  paperWeb.position.set(0, 1.45, 0);
  paperWeb.rotation.x = -Math.PI / 2;
  paperWeb.castShadow = true;
  paperWeb.receiveShadow = true;
  apparatusGroup.add(paperWeb);

  // 88-Key Gold Plunger Pin Sensing Comb (Claim 2)
  const combGeo = new THREE.BoxGeometry(0.28, 0.45, 4.9);
  disposables.push(combGeo);
  const comb = new THREE.Mesh(combGeo, goldCombMat);
  comb.position.set(0, 1.7, 0);
  comb.castShadow = true;
  apparatusGroup.add(comb);

  for (let p = 0; p < 22; p++) {
    const pinGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.35, 8);
    disposables.push(pinGeo);
    const pin = new THREE.Mesh(pinGeo, pinMat);
    pin.position.set(0, 1.48, -2.2 + p * 0.21);
    apparatusGroup.add(pin);
  }

  // ==========================================
  // 88-CHANNEL RF SPECTRAL WATERFALL BARS (CLAIM 3)
  // ==========================================
  const spectrumBarsGroup = new THREE.Group();
  spectrumBarsGroup.position.set(0, -2.2, 0);
  apparatusGroup.add(spectrumBarsGroup);

  const maxDisplayChannels = 88;
  const barMeshes: THREE.Mesh[] = [];

  for (let c = 0; c < maxDisplayChannels; c++) {
    const x = -5.0 + (c / Math.max(1, maxDisplayChannels - 1)) * 10.0;
    const barGeo = new THREE.BoxGeometry(0.18, 0.4, 0.4);
    disposables.push(barGeo);
    const barMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.3,
      metalness: 0.7,
    });
    disposables.push(barMat);
    const bar = new THREE.Mesh(barGeo, barMat);
    bar.position.set(x, 0.2, 0);
    spectrumBarsGroup.add(bar);
    barMeshes.push(bar);
  }

  // ==========================================
  // RF CARRIER HOPPING PARTICLES
  // ==========================================
  const hopCount = 80;
  const hopGeo = new THREE.BufferGeometry();
  disposables.push(hopGeo);
  const hopPos = new Float32Array(hopCount * 3);
  const glowTex = createGlowPointTexture();
  disposables.push(glowTex);

  for (let i = 0; i < hopCount; i++) {
    const idx = i * 3;
    hopPos[idx] = (lcg() - 0.5) * 8.0;
    hopPos[idx + 1] = 2.0 + lcg() * 2.5;
    hopPos[idx + 2] = (lcg() - 0.5) * 3.0;
  }
  hopGeo.setAttribute("position", new THREE.BufferAttribute(hopPos, 3));

  const hopMat = new THREE.PointsMaterial({
    size: 0.4,
    map: glowTex,
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  disposables.push(hopMat);

  const hopPoints = new THREE.Points(hopGeo, hopMat);
  root.add(hopPoints);

  // ==========================================
  // KINEMATICS UPDATE FUNCTION
  // ==========================================
  const updateKinematics = (
    delta: number,
    activeChan: number,
    liveChannels: number,
    isJammingActive: boolean,
    jamCenter: number,
  ) => {
    drum1.rotation.y += delta * 1.5;
    drum2.rotation.y += delta * 1.5;

    for (let c = 0; c < maxDisplayChannels; c++) {
      const bar = barMeshes[c];
      if (c >= liveChannels) {
        bar.visible = false;
        continue;
      }
      bar.visible = true;

      const mat = bar.material as THREE.MeshStandardMaterial;
      const isJamZone = isJammingActive && Math.abs(c - jamCenter) <= 2;
      const isActive = c === activeChan;

      if (isActive) {
        bar.scale.y = 3.5;
        bar.position.y = 0.7;
        mat.color.setHex(0x38bdf8);
        mat.emissive.setHex(0x0284c7);
        mat.emissiveIntensity = 0.8;
      } else if (isJamZone) {
        bar.scale.y = 2.2;
        bar.position.y = 0.44;
        mat.color.setHex(0xef4444);
        mat.emissive.setHex(0x991b1b);
        mat.emissiveIntensity = 0.4;
      } else {
        bar.scale.y = 1.0;
        bar.position.y = 0.2;
        mat.color.setHex(0x334155);
        mat.emissive.setHex(0x000000);
        mat.emissiveIntensity = 0.0;
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
    apparatusGroup,
    drum1,
    drum2,
    paperWeb,
    comb,
    spectrumBarsGroup,
    barMeshes,
    hopPoints,
    updateKinematics,
    dispose,
  };
}
