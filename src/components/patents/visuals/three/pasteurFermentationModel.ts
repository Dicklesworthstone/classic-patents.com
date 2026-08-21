/**
 * Source-bounded reader model for Pasteur's US 135,245 apparatus.
 *
 * The patent shows closed vessels A on supports b, an overhead water pipe E
 * feeding exterior spray nozzles P, a carbonic-acid-gas generator M M with
 * supply line w, and an exit tube x dipping into a water cup v. The source
 * permits galvanized iron, wood, or another suitable vessel material without
 * selecting one; dimensions, rates, and pressures are not printed. This model
 * therefore treats its neutral material, geometry, and animation speed as
 * illustrative presentation choices. For legibility, the 3D studio isolates
 * one representative vessel A with the shared service equipment; the 2D face
 * retains the complete three-vessel Fig. 1 arrangement.
 */

import * as THREE from "three";
import { createGlowPointTexture } from "./ThreeStudioScene";

export interface PasteurFermentationModelNodes {
  rootGroup: THREE.Group;
  vesselGroup: THREE.Group;
  tank: THREE.Mesh;
  domeLid: THREE.Mesh;
  support: THREE.Group;
  pipeE: THREE.Mesh;
  nozzleP: THREE.Mesh;
  generatorM: THREE.Mesh;
  supplyLineW: THREE.Mesh;
  exitTubeX: THREE.Mesh;
  waterCupV: THREE.Mesh;
  sprayPoints: THREE.Points;
  sprayPositions: Float32Array;
  gasPoints: THREE.Points;
  gasPositions: Float32Array;
}

export interface PasteurFermentationMaterials {
  vessel: THREE.MeshStandardMaterial;
  structure: THREE.MeshStandardMaterial;
  water: THREE.PointsMaterial;
  gas: THREE.PointsMaterial;
  cupWater: THREE.MeshStandardMaterial;
}

export interface PasteurFermentationModelResult {
  rootGroup: THREE.Group;
  nodes: PasteurFermentationModelNodes;
  materials: PasteurFermentationMaterials;
  dispose: () => void;
}

const SPRAY_COUNT = 48;
const GAS_COUNT = 32;

function deterministicUnit(index: number, channel: number): number {
  const sample = Math.sin((index + 1) * 12.9898 + (channel + 1) * 78.233) * 43758.5453;
  return sample - Math.floor(sample);
}

function tubeBetween(
  points: readonly THREE.Vector3[],
  radius: number,
  material: THREE.Material,
  track: <T extends THREE.BufferGeometry>(geometry: T) => T,
): THREE.Mesh {
  const curve = new THREE.CatmullRomCurve3([...points]);
  return new THREE.Mesh(track(new THREE.TubeGeometry(curve, 28, radius, 10, false)), material);
}

export function buildPasteurFermentationModel(): PasteurFermentationModelResult {
  const rootGroup = new THREE.Group();
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const texturesToDispose: THREE.Texture[] = [];
  const trackGeo = <T extends THREE.BufferGeometry>(geometry: T): T => {
    geometriesToDispose.push(geometry);
    return geometry;
  };
  const trackMat = <T extends THREE.Material>(material: T): T => {
    materialsToDispose.push(material);
    return material;
  };

  const glowTexture = createGlowPointTexture();
  texturesToDispose.push(glowTexture);
  const materials: PasteurFermentationMaterials = {
    vessel: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xb58a57,
        roughness: 0.62,
        metalness: 0.18,
        transparent: true,
      }),
    ),
    structure: trackMat(
      new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.58, metalness: 0.55 }),
    ),
    water: trackMat(
      new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 0.12,
        map: glowTexture,
        transparent: true,
        depthWrite: false,
      }),
    ),
    gas: trackMat(
      new THREE.PointsMaterial({
        color: 0x60a5fa,
        size: 0.15,
        map: glowTexture,
        transparent: true,
        depthWrite: false,
      }),
    ),
    cupWater: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x7dd3fc,
        roughness: 0.2,
        transparent: true,
        opacity: 0.55,
      }),
    ),
  };

  const vesselGroup = new THREE.Group();
  rootGroup.add(vesselGroup);
  const tank = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(2.0, 2.0, 3.7, 36)),
    materials.vessel,
  );
  tank.position.y = 0.1;
  tank.castShadow = true;
  vesselGroup.add(tank);

  const domeLid = new THREE.Mesh(
    trackGeo(new THREE.SphereGeometry(2.0, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2)),
    materials.vessel,
  );
  domeLid.position.y = 1.95;
  domeLid.castShadow = true;
  vesselGroup.add(domeLid);

  const support = new THREE.Group();
  for (const x of [-1.45, 1.45]) {
    const leg = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.24, 1.35, 0.34)),
      materials.structure,
    );
    leg.position.set(x, -2.35, 0);
    support.add(leg);
  }
  const crossbar = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(3.7, 0.22, 0.42)),
    materials.structure,
  );
  crossbar.position.y = -1.78;
  support.add(crossbar);
  vesselGroup.add(support);

  const pipeE = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.11, 0.11, 8.4, 14)),
    materials.structure,
  );
  pipeE.rotation.z = Math.PI / 2;
  pipeE.position.set(0, 4.35, 0);
  rootGroup.add(pipeE);

  const nozzleP = new THREE.Mesh(
    trackGeo(new THREE.ConeGeometry(0.45, 0.7, 18)),
    materials.structure,
  );
  nozzleP.rotation.x = Math.PI;
  nozzleP.position.set(0, 3.78, 0);
  rootGroup.add(nozzleP);

  const generatorM = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.1, 1.7, 1.8)),
    materials.structure,
  );
  generatorM.position.set(-4.4, -0.9, 0);
  generatorM.castShadow = true;
  rootGroup.add(generatorM);

  const supplyLineW = tubeBetween(
    [
      new THREE.Vector3(-3.4, -0.5, 0),
      new THREE.Vector3(-2.8, -0.2, 0),
      new THREE.Vector3(-2.0, 0.2, 0),
    ],
    0.08,
    materials.structure,
    trackGeo,
  );
  rootGroup.add(supplyLineW);

  const exitTubeX = tubeBetween(
    [
      new THREE.Vector3(1.65, 1.4, 0),
      new THREE.Vector3(3.0, 1.4, 0),
      new THREE.Vector3(3.0, -1.0, 0),
      new THREE.Vector3(3.45, -1.0, 0),
    ],
    0.08,
    materials.structure,
    trackGeo,
  );
  rootGroup.add(exitTubeX);

  const waterCupV = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.72, 0.72, 0.85, 24, 1, true)),
    materials.cupWater,
  );
  waterCupV.position.set(3.45, -1.35, 0);
  rootGroup.add(waterCupV);

  const sprayGeometry = trackGeo(new THREE.BufferGeometry());
  const sprayPositions = new Float32Array(SPRAY_COUNT * 3);
  for (let index = 0; index < SPRAY_COUNT; index += 1) {
    const offset = index * 3;
    const angle = deterministicUnit(index, 0) * Math.PI * 2;
    const radius = 1.4 + deterministicUnit(index, 1) * 0.8;
    sprayPositions[offset] = Math.cos(angle) * radius;
    sprayPositions[offset + 1] = 3.2 - deterministicUnit(index, 2) * 4.5;
    sprayPositions[offset + 2] = Math.sin(angle) * radius;
  }
  sprayGeometry.setAttribute("position", new THREE.BufferAttribute(sprayPositions, 3));
  const sprayPoints = new THREE.Points(sprayGeometry, materials.water);
  rootGroup.add(sprayPoints);

  const gasGeometry = trackGeo(new THREE.BufferGeometry());
  const gasPositions = new Float32Array(GAS_COUNT * 3);
  for (let index = 0; index < GAS_COUNT; index += 1) {
    const offset = index * 3;
    gasPositions[offset] = -4.1 + deterministicUnit(index, 0) * 7.4;
    gasPositions[offset + 1] = -0.65 + deterministicUnit(index, 1) * 2.0;
    gasPositions[offset + 2] = -0.08 + deterministicUnit(index, 2) * 0.16;
  }
  gasGeometry.setAttribute("position", new THREE.BufferAttribute(gasPositions, 3));
  const gasPoints = new THREE.Points(gasGeometry, materials.gas);
  rootGroup.add(gasPoints);

  const nodes: PasteurFermentationModelNodes = {
    rootGroup,
    vesselGroup,
    tank,
    domeLid,
    support,
    pipeE,
    nozzleP,
    generatorM,
    supplyLineW,
    exitTubeX,
    waterCupV,
    sprayPoints,
    sprayPositions,
    gasPoints,
    gasPositions,
  };

  const dispose = () => {
    for (const material of materialsToDispose) material.dispose();
    for (const geometry of geometriesToDispose) geometry.dispose();
    for (const texture of texturesToDispose) texture.dispose();
  };

  return { rootGroup, nodes, materials, dispose };
}

export function updatePasteurFermentationKinematics(
  nodes: PasteurFermentationModelNodes,
  materials: PasteurFermentationMaterials,
  dt: number,
  co2SweepPct: number,
  sprayCoveragePct: number,
  isCutaway: boolean,
) {
  const sprayRate = 0.8 + sprayCoveragePct / 70;
  for (let index = 0; index < SPRAY_COUNT; index += 1) {
    const offset = index * 3;
    nodes.sprayPositions[offset + 1] -= dt * sprayRate;
    if (nodes.sprayPositions[offset + 1] < -1.65) nodes.sprayPositions[offset + 1] = 3.2;
  }
  nodes.sprayPoints.geometry.attributes.position.needsUpdate = true;
  nodes.sprayPoints.visible = sprayCoveragePct > 0;
  materials.water.opacity = 0.15 + sprayCoveragePct / 125;

  const gasRate = 0.35 + co2SweepPct / 80;
  for (let index = 0; index < GAS_COUNT; index += 1) {
    const offset = index * 3;
    nodes.gasPositions[offset] += dt * gasRate;
    if (nodes.gasPositions[offset] > 3.65) nodes.gasPositions[offset] = -4.15;
  }
  nodes.gasPoints.geometry.attributes.position.needsUpdate = true;
  nodes.gasPoints.visible = co2SweepPct > 0;
  materials.gas.opacity = 0.15 + co2SweepPct / 125;

  materials.vessel.opacity = isCutaway ? 0.34 : 1;
  materials.vessel.transparent = isCutaway;
}
