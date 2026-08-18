/**
 * goodyearRubberModel.ts
 *
 * Museum-Grade Procedural 3D Model for Charles Goodyear's 1844 Vulcanized Rubber
 * (US Patent 3,633 - "Improvement in India-Rubber Fabrics").
 *
 * Reconstructs the macromolecular crosslinked network:
 * 1. Opposing tensile testing grips with knurled brass clamping screws.
 * 2. Dynamic tensile stress vector arrows indicating mechanical tension.
 * 3. 6 Entangled cis-1,4-polyisoprene elastomer macromolecule chains.
 * 4. Disulfide (-S-S-) covalent crosslinking sulfur bridges between polymer backbones.
 * 5. Real-time entropic elasticity deformation and thermal Brownian motion.
 */

import * as THREE from "three";
import { createLcg } from "@/utils/lcg";

const lcg = createLcg(1436);

export interface PolymerChainItem {
  curve: THREE.CatmullRomCurve3;
  mesh: THREE.Mesh;
  basePts: THREE.Vector3[];
}

export interface SulfurBridgeItem {
  group: THREE.Group;
  baseX: number;
}

export interface GoodyearRubberModelNodes {
  rootGroup: THREE.Group;
  leftClampGroup: THREE.Group;
  rightClampGroup: THREE.Group;
  leftArrow: THREE.Mesh;
  rightArrow: THREE.Mesh;
  chains: PolymerChainItem[];
  sulfurBridgesGroup: THREE.Group;
  bridgeItems: SulfurBridgeItem[];
}

export interface GoodyearRubberMaterials {
  polyisoprene: THREE.MeshStandardMaterial;
  sulfurBridge: THREE.MeshStandardMaterial;
  sulfurBond: THREE.MeshStandardMaterial;
  clamp: THREE.MeshStandardMaterial;
  brassScrew: THREE.MeshStandardMaterial;
  stressArrow: THREE.MeshStandardMaterial;
}

export interface GoodyearRubberModelResult {
  rootGroup: THREE.Group;
  nodes: GoodyearRubberModelNodes;
  materials: GoodyearRubberMaterials;
  dispose: () => void;
}

export function buildGoodyearRubberModel(): GoodyearRubberModelResult {
  const rootGroup = new THREE.Group();
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    geometriesToDispose.push(geo);
    return geo;
  };
  const trackMat = <T extends THREE.Material>(mat: T): T => {
    materialsToDispose.push(mat);
    return mat;
  };

  // Materials
  const materials: GoodyearRubberMaterials = {
    polyisoprene: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.45,
        metalness: 0.3,
      }),
    ),
    sulfurBridge: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.18,
        metalness: 0.8,
        emissive: 0xca8a04,
        emissiveIntensity: 0.45,
      }),
    ),
    sulfurBond: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xeab308,
        metalness: 0.6,
      }),
    ),
    clamp: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x475569,
        roughness: 0.15,
        metalness: 0.92,
      }),
    ),
    brassScrew: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd97706,
        metalness: 0.95,
        roughness: 0.2,
      }),
    ),
    stressArrow: trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xdc2626,
        emissiveIntensity: 0.6,
        roughness: 0.2,
      }),
    ),
  };

  // 1. Clamps
  const leftClampGroup = new THREE.Group();
  leftClampGroup.position.set(-4.5, 0, 0);

  const leftClamp = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.85, 4.4, 3.4)),
    materials.clamp,
  );
  leftClamp.castShadow = true;
  leftClamp.receiveShadow = true;
  leftClampGroup.add(leftClamp);

  [-1.4, 1.4].forEach((sy) => {
    const screw = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.35, 0.35, 0.6, 24)),
      materials.brassScrew,
    );
    screw.rotation.z = Math.PI / 2;
    screw.position.set(-0.6, sy, 0);
    leftClampGroup.add(screw);
  });
  rootGroup.add(leftClampGroup);

  const rightClampGroup = new THREE.Group();
  rightClampGroup.position.set(4.5, 0, 0);

  const rightClamp = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.85, 4.4, 3.4)),
    materials.clamp,
  );
  rightClamp.castShadow = true;
  rightClamp.receiveShadow = true;
  rightClampGroup.add(rightClamp);

  [-1.4, 1.4].forEach((sy) => {
    const screw = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.35, 0.35, 0.6, 24)),
      materials.brassScrew,
    );
    screw.rotation.z = Math.PI / 2;
    screw.position.set(0.6, sy, 0);
    rightClampGroup.add(screw);
  });
  rootGroup.add(rightClampGroup);

  // 2. Stress Force Vector Arrows
  const leftArrow = new THREE.Mesh(
    trackGeo(new THREE.ConeGeometry(0.32, 1.1, 16)),
    materials.stressArrow,
  );
  leftArrow.rotation.z = Math.PI / 2;
  leftArrow.position.set(-1.4, 0, 0);
  leftClampGroup.add(leftArrow);

  const rightArrow = new THREE.Mesh(
    trackGeo(new THREE.ConeGeometry(0.32, 1.1, 16)),
    materials.stressArrow,
  );
  rightArrow.rotation.z = -Math.PI / 2;
  rightArrow.position.set(1.4, 0, 0);
  rightClampGroup.add(rightArrow);

  // 3. Polymer Chains
  const chains: PolymerChainItem[] = [];
  const numChains = 6;

  for (let c = 0; c < numChains; c++) {
    const yBase = (c - (numChains - 1) / 2) * 0.7;
    const pts: THREE.Vector3[] = [];
    const numSegments = 14;

    for (let s = 0; s <= numSegments; s++) {
      const x = -4.0 + (s / numSegments) * 8.0;
      const y = yBase + Math.sin(s * 1.6 + c * 1.2) * 0.45;
      const z = Math.cos(s * 1.8 + c * 1.5) * 0.65;
      pts.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(pts);
    const geo = trackGeo(new THREE.TubeGeometry(curve, 48, 0.11, 8, false));
    const mesh = new THREE.Mesh(geo, materials.polyisoprene);
    mesh.castShadow = true;
    rootGroup.add(mesh);

    chains.push({ curve, mesh, basePts: pts });
  }

  // 4. Disulfide Crosslink Bridges (-S-S-)
  const sulfurBridgesGroup = new THREE.Group();
  const numBridges = 14;
  const bridgeItems: SulfurBridgeItem[] = [];

  for (let b = 0; b < numBridges; b++) {
    const baseX = -3.2 + (b / (numBridges - 1)) * 6.4;
    const bridgeG = new THREE.Group();
    bridgeG.position.set(baseX, (lcg() - 0.5) * 1.8, (lcg() - 0.5) * 1.0);

    const sAtom1 = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.18, 16, 16)),
      materials.sulfurBridge,
    );
    sAtom1.position.y = -0.2;
    bridgeG.add(sAtom1);

    const sAtom2 = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.18, 16, 16)),
      materials.sulfurBridge,
    );
    sAtom2.position.y = 0.2;
    bridgeG.add(sAtom2);

    const sBond = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.04, 0.04, 0.4, 8)),
      materials.sulfurBond,
    );
    bridgeG.add(sBond);

    bridgeG.castShadow = true;
    sulfurBridgesGroup.add(bridgeG);
    bridgeItems.push({ group: bridgeG, baseX });
  }
  rootGroup.add(sulfurBridgesGroup);

  const nodes: GoodyearRubberModelNodes = {
    rootGroup,
    leftClampGroup,
    rightClampGroup,
    leftArrow,
    rightArrow,
    chains,
    sulfurBridgesGroup,
    bridgeItems,
  };

  const dispose = () => {
    for (const m of materialsToDispose) {
      m.dispose();
    }
    for (const g of geometriesToDispose) {
      g.dispose();
    }
  };

  return { rootGroup, nodes, materials, dispose };
}

/**
 * Updates tensile extension, polymer uncoiling, stress vectors, sulfur bridge distribution, and cutaway.
 */
export function updateGoodyearRubberKinematics(
  nodes: GoodyearRubberModelNodes,
  materials: GoodyearRubberMaterials,
  _dt: number,
  timeSec: number,
  appliedTensileStretch: number,
  tensileStrengthPsi: number,
  cureTemperatureCelsius: number,
  isVulcanized: boolean,
  isGlassy: boolean,
  showSulfurCrosslinks: boolean,
  showStressVectors: boolean,
  isCutaway: boolean,
) {
  const stretch = appliedTensileStretch;
  nodes.rightClampGroup.position.x = 4.5 * stretch;
  nodes.leftClampGroup.position.x = -4.5 * stretch;

  // Stress vector scaling
  nodes.leftArrow.visible = showStressVectors;
  nodes.rightArrow.visible = showStressVectors;
  const stressScale = Math.min(
    2.8,
    Math.max(0.35, (tensileStrengthPsi / 2800) * (stretch - 0.6)),
  );
  nodes.leftArrow.scale.set(stressScale, stressScale, stressScale);
  nodes.rightArrow.scale.set(stressScale, stressScale, stressScale);

  // Deform polymer chains: Affine extension and transverse Poisson thinning
  const uncoilFactor = Math.max(0.12, 1.0 / Math.sqrt(stretch));
  for (let c = 0; c < nodes.chains.length; c++) {
    const item = nodes.chains[c];
    item.mesh.scale.set(stretch, uncoilFactor, uncoilFactor);

    // Brownian thermal fluctuation increases with temperature
    const thermalAmplitude = isGlassy
      ? 0.005
      : (cureTemperatureCelsius / 140) * (isVulcanized ? 0.03 : 0.1);
    item.mesh.position.y = Math.sin(timeSec * 4.0 + c * 1.5) * thermalAmplitude;
    item.mesh.position.z = Math.cos(timeSec * 4.0 + c * 1.5) * thermalAmplitude;
  }

  // Sulfur bridges distribution
  nodes.sulfurBridgesGroup.visible = showSulfurCrosslinks && isVulcanized;
  for (let b = 0; b < nodes.bridgeItems.length; b++) {
    const item = nodes.bridgeItems[b];
    item.group.position.x = item.baseX * stretch;
  }

  // Cutaway Mode
  materials.polyisoprene.opacity = isCutaway ? 0.4 : 1.0;
  materials.polyisoprene.transparent = isCutaway;
  materials.clamp.opacity = isCutaway ? 0.35 : 1.0;
  materials.clamp.transparent = isCutaway;
}
