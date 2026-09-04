/**
 * wozniakAppleModel.ts
 *
 * Museum-Grade Procedural 3D Model for Steve Wozniak's 1979 Apple II Microcomputer
 * (US Patent 4,136,359 - "Microcomputer for Use with Video Display").
 *
 * Reconstructs the authentic Apple II video display generator & bus timing architecture:
 * - Molded beige structural foam enclosure with sloped keyboard deck and ventilation louvers.
 * - Green FR-4 double-sided motherboard PCB with gold ground perimeter traces and silkscreen.
 * - MOS Technology 6502 8-bit CPU in 40-pin DIP package with orientation notch and metal pins (Claim 1).
 * - 4116 Dynamic RAM matrix (3 banks of 8 chips = 24 DRAM DIPs) with interleaved video scanning (Claim 2).
 * - 6 System ROM DIPs for Integer BASIC and the Autostart Monitor.
 * - 8 peripheral expansion slots with 50-pin gold edge connectors (Slots 0–7).
 * - 14.31818 MHz master crystal oscillator and RCA composite video out jack (Claim 3).
 * - Interleaved Phi-1 video / Phi-2 CPU address and data bus pulses.
 */

import * as THREE from "three";
import { wozniakIsVideoPacket } from "@/physics/catalogKernels";
import { laplacianModeShape, laplacianModes } from "@/physics/genericWasm";
import { createLcg } from "@/utils/lcg";
import { createGlowPointTexture } from "./ThreeStudioScene";

export interface WozniakAppleModel {
  root: THREE.Group;
  computerGroup: THREE.Group;
  chassis: THREE.Mesh;
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
  setCutaway?: (cutaway: boolean) => void;
  dispose: () => void;
}

/**
 * Deterministic unit noise for procedural PCB generation.
 */
function deterministicUnit(index: number, channel: number): number {
  const sample = Math.sin((index + 1) * 12.9898 + (channel + 1) * 78.233) * 43758.5453;
  return sample - Math.floor(sample);
}

/**
 * Procedural Green FR-4 Epoxy Motherboard Texture with Copper Traces & Silkscreen
 */
function createPcbTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  // Deep Apple II Rev 0 PCB green
  ctx.fillStyle = "#14532d";
  ctx.fillRect(0, 0, 512, 512);

  // Copper bus tracks
  ctx.strokeStyle = "rgba(34, 197, 94, 0.35)";
  ctx.lineWidth = 1.2;
  for (let b = 0; b < 32; b++) {
    const y = 30 + b * 14;
    ctx.beginPath();
    ctx.moveTo(20, y);
    ctx.lineTo(240, y);
    ctx.lineTo(280, y + 20);
    ctx.lineTo(490, y + 20);
    ctx.stroke();
  }

  // IC Component silkscreen boxes & reference designators
  ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
  ctx.lineWidth = 1.0;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 8; c++) {
      const rx = 140 + c * 40;
      const ry = 80 + r * 60;
      ctx.strokeRect(rx, ry, 30, 45);
    }
  }

  // CPU Silkscreen outline
  ctx.strokeRect(40, 200, 70, 150);

  // Solder vias & contact pads
  ctx.fillStyle = "rgba(234, 179, 8, 0.6)";
  for (let v = 0; v < 180; v++) {
    const vx = deterministicUnit(v, 0) * 480 + 16;
    const vy = deterministicUnit(v, 1) * 480 + 16;
    ctx.beginPath();
    ctx.arc(vx, vy, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 1);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildWozniakAppleModel(): WozniakAppleModel {
  const root = new THREE.Group();
  const disposables: Array<{ dispose: () => void }> = [];
  const lcg = createLcg(19790123);

  const pcbTex = createPcbTexture();
  if (pcbTex) disposables.push(pcbTex);

  // --- Museum-Grade Materials ---
  const caseBeigeMat = new THREE.MeshStandardMaterial({
    color: 0xdfd4be,
    roughness: 0.52,
    metalness: 0.04,
  });
  disposables.push(caseBeigeMat);

  const pcbGreenMat = new THREE.MeshStandardMaterial({
    ...(pcbTex ? { map: pcbTex } : {}),
    color: 0x14532d,
    roughness: 0.32,
    metalness: 0.25,
  });
  disposables.push(pcbGreenMat);

  const icChipMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.3,
    metalness: 0.75,
  });
  disposables.push(icChipMat);

  const goldSlotMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.18,
    metalness: 0.94,
  });
  disposables.push(goldSlotMat);

  const metalMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.12,
    metalness: 0.96,
  });
  disposables.push(metalMat);

  const rcaMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.22,
    metalness: 0.92,
  });
  disposables.push(rcaMat);

  // ==========================================
  // CHASSIS & MOTHERBOARD PCB
  // ==========================================
  const computerGroup = new THREE.Group();
  root.add(computerGroup);

  // Beige Structural Foam Main Chassis Tub
  const chassisGeo = new THREE.BoxGeometry(11.6, 1.8, 10.6);
  disposables.push(chassisGeo);
  const chassis = new THREE.Mesh(chassisGeo, caseBeigeMat);
  chassis.position.y = -1.5;
  chassis.receiveShadow = true;
  computerGroup.add(chassis);

  // Sloped Keyboard Deck
  const deckGeo = new THREE.BoxGeometry(11.0, 0.45, 3.4);
  disposables.push(deckGeo);
  const deck = new THREE.Mesh(deckGeo, caseBeigeMat);
  deck.position.set(0, -0.6, 4.3);
  deck.rotation.x = 0.25;
  deck.receiveShadow = true;
  computerGroup.add(deck);

  // Green FR-4 Glass-Epoxy Motherboard PCB
  const mbGeo = new THREE.BoxGeometry(10.8, 0.12, 9.4);
  disposables.push(mbGeo);
  const motherboard = new THREE.Mesh(mbGeo, pcbGreenMat);
  motherboard.position.y = -0.55;
  motherboard.receiveShadow = true;
  computerGroup.add(motherboard);

  // Gold-Plated Ground Ring Perimeter Trace
  const traceGeo = new THREE.BoxGeometry(10.5, 0.14, 9.1);
  disposables.push(traceGeo);
  const traceRing = new THREE.Mesh(traceGeo, goldSlotMat);
  traceRing.position.y = -0.54;
  computerGroup.add(traceRing);

  // ==========================================
  // MOS 6502 8-BIT CPU (CLAIM 1)
  // ==========================================
  const cpuGroup = new THREE.Group();
  cpuGroup.position.set(-3.2, -0.42, 0.4);

  const cpuBodyGeo = new THREE.BoxGeometry(1.35, 0.22, 3.5);
  disposables.push(cpuBodyGeo);
  const cpuBody = new THREE.Mesh(cpuBodyGeo, icChipMat);
  cpuBody.castShadow = true;
  cpuGroup.add(cpuBody);

  // Pin 1 Index Notch
  const notchGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.1, 16, 1, false, 0, Math.PI);
  disposables.push(notchGeo);
  const notch = new THREE.Mesh(
    notchGeo,
    new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 }),
  );
  notch.position.set(0, 0.12, -1.65);
  cpuGroup.add(notch);

  // 40 Silver DIP Pins (20 pins per side)
  for (let p = 0; p < 20; p++) {
    const pinZ = -1.55 + p * 0.165;
    [-0.72, 0.72].forEach((pinX) => {
      const pinGeo = new THREE.BoxGeometry(0.12, 0.16, 0.07);
      disposables.push(pinGeo);
      const pin = new THREE.Mesh(pinGeo, metalMat);
      pin.position.set(pinX, -0.1, pinZ);
      cpuGroup.add(pin);
    });
  }
  computerGroup.add(cpuGroup);

  // ==========================================
  // 4116 DRAM MATRIX & SYSTEM ROM BANK (CLAIM 2)
  // ==========================================
  const ramGroup = new THREE.Group();
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      const ramGeo = new THREE.BoxGeometry(0.48, 0.18, 0.98);
      disposables.push(ramGeo);
      const ramChip = new THREE.Mesh(ramGeo, icChipMat);
      ramChip.position.set(-0.8 + col * 0.64, -0.44, -2.4 + row * 1.25);
      ramChip.castShadow = true;
      ramGroup.add(ramChip);
    }
  }
  computerGroup.add(ramGroup);

  const romGroup = new THREE.Group();
  for (let r = 0; r < 6; r++) {
    const romGeo = new THREE.BoxGeometry(0.68, 0.2, 1.85);
    disposables.push(romGeo);
    const romChip = new THREE.Mesh(romGeo, icChipMat);
    romChip.position.set(3.6, -0.43, -2.4 + r * 0.92);
    romChip.castShadow = true;
    romGroup.add(romChip);
  }
  computerGroup.add(romGroup);

  // ==========================================
  // 8 PERIPHERAL EXPANSION SLOTS (SLOTS 0–7)
  // ==========================================
  const slotsGroup = new THREE.Group();
  for (let s = 0; s < 8; s++) {
    const slotGeo = new THREE.BoxGeometry(0.28, 0.48, 3.5);
    disposables.push(slotGeo);
    const slotBody = new THREE.Mesh(slotGeo, goldSlotMat);
    slotBody.position.set(-3.4 + s * 0.96, -0.31, 2.6);
    slotBody.castShadow = true;
    slotsGroup.add(slotBody);
  }
  computerGroup.add(slotsGroup);

  // 14.31818 MHz Master Quartz Crystal (Claim 3)
  const crystalGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.68, 16);
  disposables.push(crystalGeo);
  const crystal = new THREE.Mesh(crystalGeo, metalMat);
  crystal.position.set(-4.4, -0.28, -2.2);
  crystal.castShadow = true;
  computerGroup.add(crystal);

  // RCA Composite Video Output Jack
  const rcaGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.52, 16);
  disposables.push(rcaGeo);
  const rcaJack = new THREE.Mesh(rcaGeo, rcaMat);
  rcaJack.rotation.x = Math.PI / 2;
  rcaJack.position.set(4.2, -0.35, -4.6);
  rcaJack.castShadow = true;
  computerGroup.add(rcaJack);

  // ==========================================
  // INTERLEAVED BUS DATA PARTICLES (PHI-1 & PHI-2)
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
    const isPhi1Video = wozniakIsVideoPacket(i);

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
    size: 0.38,
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
    const speed = busDisplaySpeed * delta;
    const modes = laplacianModes(16, 3);

    for (let i = 0; i < busPacketCount; i++) {
      const idx = i * 3;
      const isPhi1Video = wozniakIsVideoPacket(i);
      const mode = 1 + 0.35 * laplacianModeShape(modes, 16, 3, 0, i);

      if (isPhi1Video) {
        bPos[idx] += speed * 1.5 * mode;
        if (bPos[idx] > 3.8) {
          bPos[idx] = -2.8;
        }
      } else if (isCpuActive) {
        bPos[idx + 2] += speed * 1.2 * mode;
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

  const setCutaway = (cutaway: boolean) => {
    caseBeigeMat.transparent = cutaway;
    caseBeigeMat.opacity = cutaway ? 0.25 : 1.0;
    caseBeigeMat.needsUpdate = true;
  };

  return {
    root,
    computerGroup,
    chassis,
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
    setCutaway,
    dispose,
  };
}
