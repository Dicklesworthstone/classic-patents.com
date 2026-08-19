/**
 * boyleSmithCcdModel.ts
 *
 * Museum-Grade Procedural 3D Model for Willard S. Boyle & George E. Smith's 1974 Charge-Coupled Device
 * (US Patent 3,858,232 - "Buried Channel Charge Coupled Devices").
 *
 * Reconstructs the Bell Labs semiconductor imaging & memory invention:
 * 1. P-type silicon substrate ingot slab with authentic crystal lattice finish.
 * 2. Boron-doped channel stop lateral isolation barriers.
 * 3. Transparent silicon dioxide (SiO2) gate dielectric insulator layer.
 * 4. 3-phase clock bus lines (Phase 1, Phase 2, Phase 3).
 * 5. 9 polysilicon gate electrodes connected via contact vias (Claim 1 & Claim 2).
 * 6. Floating diffusion sensing node amplifier and reset gate at the output terminus.
 * 7. Subsurface electron charge packets transferring along the channel with high charge transfer efficiency (CTE > 0.9999).
 */

import * as THREE from "three";
import { laplacianModeShape, laplacianModes } from "@/physics/genericWasm";
import { ccdGatePhase } from "@/physics/machineKernels";
import { createGlowPointTexture } from "./ThreeStudioScene";

export interface GateNode {
  mesh: THREE.Mesh;
  phase: number;
  x: number;
}

export interface BoyleSmithCcdModelNodes {
  rootGroup: THREE.Group;
  substrate: THREE.Mesh;
  channelStops: THREE.Mesh[];
  oxide: THREE.Mesh;
  busLines: THREE.Mesh[];
  gates: GateNode[];
  outputNode: THREE.Mesh;
  packetPoints: THREE.Points;
  packetPos: Float32Array;
  packetCount: number;
  bondPads?: THREE.Mesh[];
}

export interface BoyleSmithCcdMaterials {
  pSiliconSubstrate: THREE.MeshStandardMaterial;
  gatePolySilicon: THREE.MeshStandardMaterial;
  gateActive: THREE.MeshStandardMaterial;
  oxideMat: THREE.MeshPhysicalMaterial;
  channelStopMat: THREE.MeshStandardMaterial;
  outputNodeMat: THREE.MeshStandardMaterial;
  packetMat: THREE.PointsMaterial;
  goldPadMat?: THREE.MeshStandardMaterial;
}

export interface BoyleSmithCcdModelResult {
  root: THREE.Group;
  rootGroup: THREE.Group;
  nodes: BoyleSmithCcdModelNodes;
  materials: BoyleSmithCcdMaterials;
  updateKinematics: (
    delta: number,
    activePhase: 1 | 2 | 3,
    wellsData: {
      wells: number[];
      fullWellElectrons: number;
      cte: number;
      packetOpacity: number;
    },
  ) => void;
  dispose: () => void;
}

const PACKET_COUNT = 240;
const NUM_GATES = 9;

/**
 * Deterministic unit noise for procedural grain generation.
 */
function deterministicUnit(index: number, channel: number): number {
  const sample = Math.sin((index + 1) * 12.9898 + (channel + 1) * 78.233) * 43758.5453;
  return sample - Math.floor(sample);
}

/**
 * Procedural Polished Silicon Wafer Texture
 */
function createSiliconTexture(): THREE.CanvasTexture | undefined {
  if (typeof document === "undefined") return undefined;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  // Mirror-polished silicon slate gray base
  ctx.fillStyle = "#2d3748";
  ctx.fillRect(0, 0, 512, 512);

  // Subtle crystal orientation striations
  for (let i = 0; i < 120; i++) {
    const y = i * 4.3 + (deterministicUnit(i, 0) - 0.5) * 2;
    ctx.strokeStyle = "rgba(74, 85, 104, 0.25)";
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  // Microscopic surface lattice reflections
  for (let p = 0; p < 200; p++) {
    const px = deterministicUnit(p, 1) * 512;
    const py = deterministicUnit(p, 2) * 512;
    ctx.fillStyle = "rgba(160, 174, 192, 0.15)";
    ctx.fillRect(px, py, 2, 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildBoyleSmithCcdModel(): BoyleSmithCcdModelResult {
  const rootGroup = new THREE.Group();
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const texturesToDispose: THREE.Texture[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    geometriesToDispose.push(geo);
    return geo;
  };
  const trackMat = <T extends THREE.Material>(mat: T): T => {
    materialsToDispose.push(mat);
    return mat;
  };

  const siliconTex = createSiliconTexture();
  if (siliconTex) texturesToDispose.push(siliconTex);

  const glowTex = createGlowPointTexture();
  texturesToDispose.push(glowTex);

  // Materials
  const materials: BoyleSmithCcdMaterials = {
    pSiliconSubstrate: trackMat(
      new THREE.MeshStandardMaterial({
        ...(siliconTex ? { map: siliconTex } : {}),
        color: 0x334155,
        roughness: 0.25,
        metalness: 0.85,
      }),
    ),
    gatePolySilicon: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xca8a04,
        roughness: 0.2,
        metalness: 0.9,
      }),
    ),
    gateActive: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        roughness: 0.15,
        metalness: 0.8,
        emissive: 0x2563eb,
        emissiveIntensity: 0.85,
      }),
    ),
    oxideMat: trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        transmission: 0.85,
        opacity: 0.9,
        transparent: true,
        roughness: 0.05,
        ior: 1.46,
      }),
    ),
    channelStopMat: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e1b4b,
        roughness: 0.8,
      }),
    ),
    outputNodeMat: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x10b981,
        roughness: 0.3,
        metalness: 0.8,
      }),
    ),
    goldPadMat: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.18,
        metalness: 0.95,
      }),
    ),
    packetMat: trackMat(
      new THREE.PointsMaterial({
        size: 0.4,
        map: glowTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    ),
  };

  // 1. P-Type Silicon Substrate Ingot
  const substrate = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(9.6, 1.0, 5.4)),
    materials.pSiliconSubstrate,
  );
  substrate.position.y = -0.5;
  substrate.castShadow = true;
  substrate.receiveShadow = true;
  rootGroup.add(substrate);

  // 2. Channel Stop Boron Isolation Barriers
  const channelStops: THREE.Mesh[] = [];
  [-2.4, 2.4].forEach((sz) => {
    const channelStop = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(9.4, 0.2, 0.4)),
      materials.channelStopMat,
    );
    channelStop.position.set(0, 0.05, sz);
    channelStop.castShadow = true;
    rootGroup.add(channelStop);
    channelStops.push(channelStop);
  });

  // 3. SiO2 Gate Dielectric Oxide Layer
  const oxide = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(9.4, 0.25, 4.4)), materials.oxideMat);
  oxide.position.y = 0.12;
  rootGroup.add(oxide);

  // 4. 3-Phase Clock Bus Lines
  const busLines: THREE.Mesh[] = [];
  const busColors = [0x0284c7, 0xd97706, 0x9333ea];
  for (let b = 0; b < 3; b++) {
    const busLine = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(9.0, 0.12, 0.22)),
      trackMat(
        new THREE.MeshStandardMaterial({
          color: busColors[b],
          metalness: 0.9,
          roughness: 0.2,
        }),
      ),
    );
    busLine.position.set(0, 0.38, 2.0 - b * 0.35);
    busLine.castShadow = true;
    rootGroup.add(busLine);
    busLines.push(busLine);
  }

  // 5. 9 Transparent Polysilicon Gate Electrodes
  const gates: GateNode[] = [];
  const gateGeo = trackGeo(new THREE.BoxGeometry(0.72, 0.24, 3.2));

  for (let g = 0; g < NUM_GATES; g++) {
    const gX = -3.6 + g * 0.85;
    const phaseNum = ccdGatePhase(g);

    const gateMesh = new THREE.Mesh(gateGeo, materials.gatePolySilicon);
    gateMesh.position.set(gX, 0.36, -0.4);
    gateMesh.castShadow = true;
    rootGroup.add(gateMesh);

    const busZ = 2.0 - (phaseNum - 1) * 0.35;
    const via = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.12, 0.14, Math.abs(busZ - -0.4))),
      trackMat(
        new THREE.MeshStandardMaterial({
          color: busColors[phaseNum - 1],
          metalness: 0.85,
        }),
      ),
    );
    via.position.set(gX, 0.36, (-0.4 + busZ) / 2);
    rootGroup.add(via);

    gates.push({ mesh: gateMesh, phase: phaseNum, x: gX });
  }

  // 6. Output Floating Diffusion Sensing Node & Reset Gate
  const outputNode = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.65, 0.3, 3.2)),
    materials.outputNodeMat,
  );
  outputNode.position.set(4.3, 0.38, -0.4);
  outputNode.castShadow = true;
  rootGroup.add(outputNode);

  // Gold Wire Bond Contact Pads on periphery
  const bondPads: THREE.Mesh[] = [];
  [-4.2, -4.2, -4.2, 4.4].forEach((bx, idx) => {
    const pad = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.35, 0.08, 0.35)),
      materials.goldPadMat || materials.gatePolySilicon,
    );
    pad.position.set(bx, 0.28, 1.8 - (idx % 3) * 0.8);
    rootGroup.add(pad);
    bondPads.push(pad);
  });

  // 7. Glowing Electron Charge Packets
  const packetGeo = trackGeo(new THREE.BufferGeometry());
  const packetPos = new Float32Array(PACKET_COUNT * 3);
  const packetColors = new Float32Array(PACKET_COUNT * 3);

  for (let i = 0; i < PACKET_COUNT; i++) {
    const idx = i * 3;
    const pixelIdx = Math.floor(i / (PACKET_COUNT / 3));
    const baseGateX = -3.6 + pixelIdx * 3 * 0.85;

    packetPos[idx] = baseGateX;
    packetPos[idx + 1] = -0.2;
    packetPos[idx + 2] = ((i % 10) / 10 - 0.5) * 2.8;

    packetColors[idx] = 0.1;
    packetColors[idx + 1] = 0.9;
    packetColors[idx + 2] = 1.0;
  }

  packetGeo.setAttribute("position", new THREE.BufferAttribute(packetPos, 3));
  packetGeo.setAttribute("color", new THREE.BufferAttribute(packetColors, 3));

  const packetPoints = new THREE.Points(packetGeo, materials.packetMat);
  rootGroup.add(packetPoints);

  const nodes: BoyleSmithCcdModelNodes = {
    rootGroup,
    substrate,
    channelStops,
    oxide,
    busLines,
    gates,
    outputNode,
    packetPoints,
    packetPos,
    packetCount: PACKET_COUNT,
    bondPads,
  };

  const dispose = () => {
    for (const m of materialsToDispose) m.dispose();
    for (const g of geometriesToDispose) g.dispose();
    for (const t of texturesToDispose) t.dispose();
  };

  const updateKinematics = (
    delta: number,
    activePhase: 1 | 2 | 3,
    wellsData: {
      wells: number[];
      fullWellElectrons: number;
      cte: number;
      packetOpacity: number;
    },
  ) => {
    updateBoyleSmithCcdKinematics(nodes, materials, delta, 0, activePhase, wellsData, false);
  };

  return { root: rootGroup, rootGroup, nodes, materials, updateKinematics, dispose };
}

/**
 * Updates 3-phase gate bias potentials, electron charge shift, and cutaway mode.
 */
export function updateBoyleSmithCcdKinematics(
  nodes: BoyleSmithCcdModelNodes,
  materials: BoyleSmithCcdMaterials,
  _dt: number,
  _timeSec: number,
  activePhase: 1 | 2 | 3,
  wellsData: { wells: number[]; fullWellElectrons: number; cte: number; packetOpacity: number },
  isCutaway: boolean,
) {
  for (const g of nodes.gates) {
    const wellE = wellsData.wells[g.phase - 1] ?? 0;
    const fill = Math.min(1, wellE / Math.max(1, wellsData.fullWellElectrons));
    if (g.phase === activePhase) {
      g.mesh.material = materials.gateActive;
      g.mesh.position.y = 0.38;
      g.mesh.scale.y = 1 + fill * 0.8;
    } else {
      g.mesh.material = materials.gatePolySilicon;
      g.mesh.position.y = 0.42;
      g.mesh.scale.y = 1 + fill * 0.25;
    }
  }

  materials.packetMat.opacity = wellsData.packetOpacity;

  const pPos = nodes.packetPos;
  const modes = laplacianModes(16, 3);
  for (let i = 0; i < nodes.packetCount; i++) {
    const idx = i * 3;
    const pixelIdx = Math.floor(i / (nodes.packetCount / 3));
    const targetGateX = -3.6 + (pixelIdx * 3 + (activePhase - 1)) * 0.85;
    const mode = 1 + 0.3 * laplacianModeShape(modes, 16, 3, 0, i);
    pPos[idx] += (targetGateX - pPos[idx]) * 0.25 * mode;
  }
  nodes.packetPoints.geometry.attributes.position.needsUpdate = true;

  // Cutaway Mode
  materials.pSiliconSubstrate.opacity = isCutaway ? 0.4 : 1.0;
  materials.pSiliconSubstrate.transparent = isCutaway;
  materials.oxideMat.transmission = isCutaway ? 0.95 : 0.85;
}
