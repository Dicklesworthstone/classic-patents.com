/**
 * noycePlanarIcModel.ts
 *
 * Museum-Grade Procedural 3D Model for Robert N. Noyce's 1959 Monolithic Planar Integrated Circuit
 * (US Patent 2,981,877 - "Semiconductor Device-and-Lead Structure").
 *
 * Reconstructs Fairchild Semiconductor's revolutionary monolithic planar IC:
 * 1. Ceramic DIP package substrate with gold die-attach pocket.
 * 2. 14 gold leadframe terminal fingers.
 * 3. Monolithic single-crystal p-type silicon substrate (Claim 1).
 * 4. 9 isolated n-type diffused wells forming isolated transistors, diodes, and resistors in a single die (Claim 2).
 * 5. Thermally grown SiO2 insulating passivation dielectric layer (Claim 3).
 * 6. Evaporated and etched aluminum film interconnection traces deposited directly onto the oxide (Claim 4).
 * 7. Fine gold wire bonds connecting bond pads to package leadframe.
 * 8. High-speed logic signal pulse particles propagating across the monolithic metal bus traces.
 */

import * as THREE from "three";
import { createLcg } from "@/utils/lcg";
import { createGlowPointTexture } from "./ThreeStudioScene";

const lcg = createLcg(19590425);

export interface NoycePlanarIcModelNodes {
  rootGroup: THREE.Group;
  ceramicBase: THREE.Mesh;
  goldPocket: THREE.Mesh;
  leads: THREE.Mesh[];
  substrateMesh: THREE.Mesh;
  nWellsGroup: THREE.Group;
  oxideLayer: THREE.Mesh;
  metalGroup: THREE.Group;
  signalPoints: THREE.Points;
  signalPos: Float32Array;
  signalCount: number;
}

export interface NoycePlanarIcMaterials {
  siliconSubstrate: THREE.MeshStandardMaterial;
  nDiffused: THREE.MeshStandardMaterial;
  siliconDioxide: THREE.MeshPhysicalMaterial;
  aluminumMetal: THREE.MeshStandardMaterial;
  goldBondWire: THREE.MeshStandardMaterial;
  ceramic: THREE.MeshStandardMaterial;
  signalMat: THREE.PointsMaterial;
}

export interface NoycePlanarIcModelResult {
  root: THREE.Group;
  rootGroup: THREE.Group;
  nodes: NoycePlanarIcModelNodes;
  materials: NoycePlanarIcMaterials;
  updateKinematics: (
    dt: number,
    activeLayer: "all" | "silicon" | "oxide" | "metal",
    showLogicSignals: boolean,
    clockFrequencyMhz: number,
  ) => void;
  dispose: () => void;
}

const SIGNAL_COUNT = 60;

export function buildNoycePlanarIcModel(): NoycePlanarIcModelResult {
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
  const materials: NoycePlanarIcMaterials = {
    siliconSubstrate: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.25,
        metalness: 0.85,
      }),
    ),
    nDiffused: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        roughness: 0.3,
        metalness: 0.75,
      }),
    ),
    siliconDioxide: trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        transmission: 0.82,
        opacity: 0.85,
        transparent: true,
        roughness: 0.05,
        ior: 1.46,
      }),
    ),
    aluminumMetal: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.08,
        metalness: 0.98,
      }),
    ),
    goldBondWire: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.15,
        metalness: 0.95,
      }),
    ),
    ceramic: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.35,
        metalness: 0.1,
      }),
    ),
    signalMat: trackMat(
      new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 0.32,
        map: glowTex,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    ),
  };

  // 1. Ceramic DIP Base Header
  const ceramicBase = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(12.4, 0.6, 12.4)),
    materials.ceramic,
  );
  ceramicBase.position.y = -1.0;
  ceramicBase.receiveShadow = true;
  rootGroup.add(ceramicBase);

  // 2. Gold Die-Attach Cavity Pocket
  const goldPocket = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(8.6, 0.08, 8.6)),
    materials.goldBondWire,
  );
  goldPocket.position.y = -0.68;
  rootGroup.add(goldPocket);

  // 3. 14 Gold-Plated Leadframe Fingers
  const leads: THREE.Mesh[] = [];
  for (let f = 0; f < 7; f++) {
    const fX = -4.2 + f * 1.4;
    [-5.5, 5.5].forEach((fZ) => {
      const lead = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.65, 0.12, 1.8)),
        materials.goldBondWire,
      );
      lead.position.set(fX, -0.65, fZ);
      lead.castShadow = true;
      rootGroup.add(lead);
      leads.push(lead);
    });
  }

  // 4. P-Type Monolithic Silicon Substrate
  const substrateGeo = trackGeo(new THREE.BoxGeometry(8.0, 0.8, 8.0));
  const substrateMesh = new THREE.Mesh(substrateGeo, materials.siliconSubstrate);
  substrateMesh.position.y = -0.3;
  substrateMesh.castShadow = true;
  substrateMesh.receiveShadow = true;
  rootGroup.add(substrateMesh);

  // 5. 9 Isolated N-Type Diffused Wells
  const nWellsGroup = new THREE.Group();
  for (let x = -2.2; x <= 2.2; x += 2.2) {
    for (let z = -2.2; z <= 2.2; z += 2.2) {
      const well = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(1.5, 0.18, 1.5)),
        materials.nDiffused,
      );
      well.position.set(x, 0.12, z);
      well.castShadow = true;
      nWellsGroup.add(well);
    }
  }
  rootGroup.add(nWellsGroup);

  // 6. Thermally Grown SiO2 Passivation Layer
  const oxideLayer = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(7.8, 0.35, 7.8)),
    materials.siliconDioxide,
  );
  oxideLayer.position.y = 0.35;
  rootGroup.add(oxideLayer);

  // 7. Aluminum Metallization Film Interconnects
  const metalGroup = new THREE.Group();

  const trace1 = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(7.2, 0.12, 0.45)),
    materials.aluminumMetal,
  );
  trace1.position.set(0, 0.58, -1.8);
  trace1.castShadow = true;

  const trace2 = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(7.2, 0.12, 0.45)),
    materials.aluminumMetal,
  );
  trace2.position.set(0, 0.58, 1.8);
  trace2.castShadow = true;
  metalGroup.add(trace1, trace2);

  for (let x = -2.2; x <= 2.2; x += 2.2) {
    const bridge = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.45, 0.12, 4.0)),
      materials.aluminumMetal,
    );
    bridge.position.set(x, 0.58, 0);
    bridge.castShadow = true;
    metalGroup.add(bridge);
  }
  rootGroup.add(metalGroup);

  // 8. Logic Signal Pulse Particles
  const signalGeo = trackGeo(new THREE.BufferGeometry());
  const signalPos = new Float32Array(SIGNAL_COUNT * 3);
  for (let i = 0; i < SIGNAL_COUNT; i++) {
    signalPos[i * 3] = (lcg() - 0.5) * 6.5;
    signalPos[i * 3 + 1] = 0.62;
    signalPos[i * 3 + 2] = (lcg() - 0.5) * 6.5;
  }
  signalGeo.setAttribute("position", new THREE.BufferAttribute(signalPos, 3));
  const signalPoints = new THREE.Points(signalGeo, materials.signalMat);
  rootGroup.add(signalPoints);

  const nodes: NoycePlanarIcModelNodes = {
    rootGroup,
    ceramicBase,
    goldPocket,
    leads,
    substrateMesh,
    nWellsGroup,
    oxideLayer,
    metalGroup,
    signalPoints,
    signalPos,
    signalCount: SIGNAL_COUNT,
  };

  const updateKinematics = (
    dt: number,
    activeLayer: "all" | "silicon" | "oxide" | "metal",
    showLogicSignals: boolean,
    clockFrequencyMhz: number,
  ) => {
    updateNoycePlanarIcKinematics(
      nodes,
      materials,
      dt,
      0,
      clockFrequencyMhz,
      showLogicSignals,
      false,
    );
    nodes.substrateMesh.visible = activeLayer === "all" || activeLayer === "silicon";
    nodes.nWellsGroup.visible = activeLayer === "all" || activeLayer === "silicon";
    nodes.oxideLayer.visible = activeLayer === "all" || activeLayer === "oxide";
    nodes.metalGroup.visible = activeLayer === "all" || activeLayer === "metal";
  };

  const dispose = () => {
    for (const m of materialsToDispose) m.dispose();
    for (const g of geometriesToDispose) g.dispose();
    for (const t of texturesToDispose) t.dispose();
  };

  return { root: rootGroup, rootGroup, nodes, materials, updateKinematics, dispose };
}

export const buildNoycePlanarICModel = buildNoycePlanarIcModel;

/**
 * Updates logic signal pulse flow and cutaway layer transparency.
 */
export function updateNoycePlanarIcKinematics(
  nodes: NoycePlanarIcModelNodes,
  materials: NoycePlanarIcMaterials,
  dt: number,
  _timeSec: number,
  clockFrequencyMhz: number,
  showLogicSignals: boolean,
  isCutaway: boolean,
) {
  const signalSpeed = clockFrequencyMhz * 0.45 * dt;
  const pos = nodes.signalPos;

  for (let i = 0; i < nodes.signalCount; i++) {
    const idx = i * 3;
    pos[idx] += signalSpeed;
    if (pos[idx] > 3.4) {
      pos[idx] = -3.4;
    }
  }
  nodes.signalPoints.geometry.attributes.position.needsUpdate = true;
  nodes.signalPoints.visible = showLogicSignals;

  // Cutaway Mode
  materials.siliconDioxide.transmission = isCutaway ? 0.95 : 0.82;
  materials.siliconDioxide.opacity = isCutaway ? 0.4 : 0.85;
  materials.aluminumMetal.opacity = isCutaway ? 0.6 : 1.0;
  materials.aluminumMetal.transparent = isCutaway;
}
