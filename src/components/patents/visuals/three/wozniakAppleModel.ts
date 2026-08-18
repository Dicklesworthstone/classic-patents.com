/**
 * Procedural Three.js Model Builder for US 4,136,359
 * Stephen G. Wozniak — Microcomputer for Use with Video Display (Apple II, 1979)
 *
 * Implements the authentic Apple II video display generator & bus timing architecture:
 * - Molded beige structural foam enclosure with sloped keyboard deck
 * - Green FR-4 double-sided motherboard PCB with gold ground perimeter traces
 * - MOS Technology 6502 8-bit CPU in 40-pin DIP package with orientation notch (Claim 1)
 * - 4116 Dynamic RAM matrix with zero-wait-state interleaved scanning (Claim 2)
 * - 8 peripheral expansion slots with 50-pin gold edge connectors
 * - 14.31818 MHz master crystal oscillator and RCA composite video out jack (Claim 3)
 * - Interleaved Phi-1 video / Phi-2 CPU address and data bus pulses
 */

import * as THREE from "three";
import { createLcg } from "@/utils/lcg";
import { createGlowPointTexture } from "./ThreeStudioScene";

export interface WozniakAppleModel {
  root: THREE.Group;
  computerGroup: THREE.Group;
  motherboard: THREE.Mesh;
  cpuGroup: THREE.Group;
  ramGroup: THREE.Group;
  romGroup: THREE.Group;
  slotsGroup: THREE.Group;
  crystal: THREE.Mesh;
  rcaJack: THREE.Mesh;
  busPoints: THREE.Points;
  busGeo: THREE.BufferGeometry;
  busPos: Float32Array;
  busColors: Float32Array;
  updateKinematics: (
    delta: number,
    renderedSteps: number,
    busDisplaySpeed: number,
    isCpuActive: boolean,
  ) => void;
  dispose: () => void;
}

export function buildWozniakAppleModel(): WozniakAppleModel {
  const root = new THREE.Group();
  const disposables: Array<{ dispose: () => void }> = [];
  const lcg = createLcg(19790123);

  // --- AUTHENTIC MATERIALS ---
  const caseBeigeMat = new THREE.MeshStandardMaterial({
    color: 0xe2d9c8,
    roughness: 0.45,
    metalness: 0.05,
  });
  disposables.push(caseBeigeMat);

  const pcbGreenMat = new THREE.MeshStandardMaterial({
    color: 0x14532d,
    roughness: 0.35,
    metalness: 0.2,
  });
  disposables.push(pcbGreenMat);

  const icChipMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.25,
    metalness: 0.8,
  });
  disposables.push(icChipMat);

  const goldSlotMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.15,
    metalness: 0.95,
  });
  disposables.push(goldSlotMat);

  const metalMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.95,
  });
  disposables.push(metalMat);

  const rcaMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.9,
  });
  disposables.push(rcaMat);

  // ==========================================
  // CHASSIS & MOTHERBOARD PCB
  // ==========================================
  const computerGroup = new THREE.Group();
  root.add(computerGroup);

  const chassisGeo = new THREE.BoxGeometry(11.4, 1.8, 10.4);
  disposables.push(chassisGeo);
  const chassis = new THREE.Mesh(chassisGeo, caseBeigeMat);
  chassis.position.y = -1.5;
  chassis.receiveShadow = true;
  computerGroup.add(chassis);

  const deckGeo = new THREE.BoxGeometry(10.8, 0.4, 3.2);
  disposables.push(deckGeo);
  const deck = new THREE.Mesh(deckGeo, caseBeigeMat);
  deck.position.set(0, -0.6, 4.2);
  deck.rotation.x = 0.25;
  deck.receiveShadow = true;
  computerGroup.add(deck);

  const mbGeo = new THREE.BoxGeometry(10.6, 0.12, 9.2);
  disposables.push(mbGeo);
  const motherboard = new THREE.Mesh(mbGeo, pcbGreenMat);
  motherboard.position.y = -0.55;
  motherboard.receiveShadow = true;
  computerGroup.add(motherboard);

  const traceGeo = new THREE.BoxGeometry(10.4, 0.14, 9.0);
  disposables.push(traceGeo);
  const traceRing = new THREE.Mesh(traceGeo, goldSlotMat);
  traceRing.position.y = -0.54;
  computerGroup.add(traceRing);

  // ==========================================
  // MOS 6502 CPU (CLAIM 1)
  // ==========================================
  const cpuGroup = new THREE.Group();
  cpuGroup.position.set(-3.2, -0.42, 0.4);

  const cpuBodyGeo = new THREE.BoxGeometry(1.3, 0.22, 3.4);
  disposables.push(cpuBodyGeo);
  const cpuBody = new THREE.Mesh(cpuBodyGeo, icChipMat);
  cpuBody.castShadow = true;
  cpuGroup.add(cpuBody);

  const notchGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.1, 16, 1, false, 0, Math.PI);
  disposables.push(notchGeo);
  const notch = new THREE.Mesh(
    notchGeo,
    new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 }),
  );
  notch.position.set(0, 0.12, -1.6);
  cpuGroup.add(notch);

  for (let p = 0; p < 20; p++) {
    const pinZ = -1.5 + p * 0.16;
    [-0.7, 0.7].forEach((pinX) => {
      const pinGeo = new THREE.BoxGeometry(0.12, 0.15, 0.06);
      disposables.push(pinGeo);
      const pin = new THREE.Mesh(pinGeo, metalMat);
      pin.position.set(pinX, -0.1, pinZ);
      cpuGroup.add(pin);
    });
  }
  computerGroup.add(cpuGroup);

  // ==========================================
  // 4116 DRAM MATRIX & ROM BANK (CLAIM 2)
  // ==========================================
  const ramGroup = new THREE.Group();
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      const ramGeo = new THREE.BoxGeometry(0.45, 0.18, 0.95);
      disposables.push(ramGeo);
      const ramChip = new THREE.Mesh(ramGeo, icChipMat);
      ramChip.position.set(-0.8 + col * 0.62, -0.44, -2.4 + row * 1.25);
      ramChip.castShadow = true;
      ramGroup.add(ramChip);
    }
  }
  computerGroup.add(ramGroup);

  const romGroup = new THREE.Group();
  for (let r = 0; r < 6; r++) {
    const romGeo = new THREE.BoxGeometry(0.65, 0.2, 1.8);
    disposables.push(romGeo);
    const romChip = new THREE.Mesh(romGeo, icChipMat);
    romChip.position.set(3.6, -0.43, -2.4 + r * 0.9);
    romChip.castShadow = true;
    romGroup.add(romChip);
  }
  computerGroup.add(romGroup);

  // 8 Expansion Slots
  const slotsGroup = new THREE.Group();
  for (let s = 0; s < 8; s++) {
    const slotGeo = new THREE.BoxGeometry(0.28, 0.45, 3.4);
    disposables.push(slotGeo);
    const slotBody = new THREE.Mesh(slotGeo, goldSlotMat);
    slotBody.position.set(-3.4 + s * 0.95, -0.32, 2.6);
    slotBody.castShadow = true;
    slotsGroup.add(slotBody);
  }
  computerGroup.add(slotsGroup);

  // 14.31818 MHz Crystal (Claim 3)
  const crystalGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.65, 16);
  disposables.push(crystalGeo);
  const crystal = new THREE.Mesh(crystalGeo, metalMat);
  crystal.position.set(-4.4, -0.28, -2.2);
  crystal.castShadow = true;
  computerGroup.add(crystal);

  // RCA Jack
  const rcaGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.5, 16);
  disposables.push(rcaGeo);
  const rcaJack = new THREE.Mesh(rcaGeo, rcaMat);
  rcaJack.rotation.x = Math.PI / 2;
  rcaJack.position.set(4.2, -0.35, -4.6);
  computerGroup.add(rcaJack);

  // ==========================================
  // INTERLEAVED BUS DATA PARTICLES
  // ==========================================
  const busPacketCount = 140;
  const busGeo = new THREE.BufferGeometry();
  disposables.push(busGeo);
  const busPos = new Float32Array(busPacketCount * 3);
  const busColors = new Float32Array(busPacketCount * 3);
  const glowTex = createGlowPointTexture();
  disposables.push(glowTex);

  for (let i = 0; i < busPacketCount; i++) {
    const idx = i * 3;
    const isPhi1Video = i % 2 === 0;

    busPos[idx] = -2.8 + lcg() * 5.5;
    busPos[idx + 1] = -0.85 + lcg() * 0.2;
    busPos[idx + 2] = -2.0 + lcg() * 4.0;

    if (isPhi1Video) {
      busColors[idx] = 0.2;
      busColors[idx + 1] = 0.8;
      busColors[idx + 2] = 1.0;
    } else {
      busColors[idx] = 0.2;
      busColors[idx + 1] = 0.9;
      busColors[idx + 2] = 0.4;
    }
  }

  busGeo.setAttribute("position", new THREE.BufferAttribute(busPos, 3));
  busGeo.setAttribute("color", new THREE.BufferAttribute(busColors, 3));

  const busMat = new THREE.PointsMaterial({
    size: 0.35,
    map: glowTex,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  disposables.push(busMat);

  const busPoints = new THREE.Points(busGeo, busMat);
  computerGroup.add(busPoints);

  // ==========================================
  // KINEMATICS UPDATE FUNCTION
  // ==========================================
  const updateKinematics = (
    delta: number,
    _renderedSteps: number,
    busDisplaySpeed: number,
    isCpuActive: boolean,
  ) => {
    const bPos = busPos;
    const speed = (busDisplaySpeed ?? 4.0) * delta;

    for (let i = 0; i < busPacketCount; i++) {
      const idx = i * 3;
      const isPhi1Video = i % 2 === 0;

      if (isPhi1Video) {
        bPos[idx] += speed * 1.5;
        if (bPos[idx] > 3.8) {
          bPos[idx] = -2.8;
        }
      } else if (isCpuActive) {
        bPos[idx + 2] += speed * 1.2;
        if (bPos[idx + 2] > 2.8) {
          bPos[idx + 2] = -2.2;
        }
      }
    }
    busGeo.attributes.position.needsUpdate = true;
  };

  const dispose = () => {
    for (const d of disposables) {
      d.dispose();
    }
  };

  return {
    root,
    computerGroup,
    motherboard,
    cpuGroup,
    ramGroup,
    romGroup,
    slotsGroup,
    crystal,
    rcaJack,
    busPoints,
    busGeo,
    busPos,
    busColors,
    updateKinematics,
    dispose,
  };
}
