/**
 * boyleSmithCcdModel.ts
 *
 * Museum-Grade Procedural 3D Model for Willard S. Boyle & George E. Smith's 1974 Charge-Coupled Device
 * (US Patent 3,858,232 - "Buried Channel Charge Coupled Devices").
 *
 * Reconstructs the Bell Labs semiconductor imaging & memory invention:
 * 1. P-type silicon substrate ingot slab.
 * 2. Boron-doped channel stop lateral isolation barriers.
 * 3. Transparent silicon dioxide (SiO2) gate dielectric insulator layer.
 * 4. 3-phase clock bus lines (Phase 1, Phase 2, Phase 3).
 * 5. 9 polysilicon gate electrodes connected via contact vias (Claim 1 & Claim 2).
 * 6. Floating diffusion sensing node amplifier at the output terminus.
 * 7. Subsurface electron charge packets transferring along the channel with high charge transfer efficiency (CTE > 0.9999).
 */

import * as THREE from "three";
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
}

export interface BoyleSmithCcdMaterials {
  pSiliconSubstrate: THREE.MeshStandardMaterial;
  gatePolySilicon: THREE.MeshStandardMaterial;
  gateActive: THREE.MeshStandardMaterial;
  oxideMat: THREE.MeshPhysicalMaterial;
  channelStopMat: THREE.MeshStandardMaterial;
  outputNodeMat: THREE.MeshStandardMaterial;
  packetMat: THREE.PointsMaterial;
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

  const glowTex = createGlowPointTexture();
  texturesToDispose.push(glowTex);

  // Materials
  const materials: BoyleSmithCcdMaterials = {
    pSiliconSubstrate: trackMat(
      new THREE.MeshStandardMaterial({
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
    const phaseNum = (g % 3) + 1;

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

  // 6. Output Floating Diffusion Sensing Node
  const outputNode = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.65, 0.3, 3.2)),
    materials.outputNodeMat,
  );
  outputNode.position.set(4.3, 0.38, -0.4);
  outputNode.castShadow = true;
  rootGroup.add(outputNode);

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
  for (let i = 0; i < nodes.packetCount; i++) {
    const idx = i * 3;
    const pixelIdx = Math.floor(i / (nodes.packetCount / 3));
    const targetGateX = -3.6 + (pixelIdx * 3 + (activePhase - 1)) * 0.85;
    pPos[idx] += (targetGateX - pPos[idx]) * 0.25;
  }
  nodes.packetPoints.geometry.attributes.position.needsUpdate = true;

  // Cutaway Mode
  materials.pSiliconSubstrate.opacity = isCutaway ? 0.4 : 1.0;
  materials.pSiliconSubstrate.transparent = isCutaway;
  materials.oxideMat.transmission = isCutaway ? 0.95 : 0.85;
}
