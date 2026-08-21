/**
 * goodyearRubberModel.ts
 *
 * Museum-Grade Procedural 3D Model for Charles Goodyear's 1844 Vulcanized Rubber
 * (US Patent 3,633 - "Improvement in India-Rubber Fabrics").
 *
 * Reconstructs the macromolecular crosslinked network and mechanical testing apparatus:
 * 1. Opposing tensile testing machine grips with knurled brass clamping thumbscrews and slideway rails.
 * 2. Dynamic tensile stress vector arrows indicating mechanical load and strain distribution.
 * 3. 6 Entangled cis-1,4-polyisoprene elastomer macromolecule chains with isoprene methyl groups (Claim 1).
 * 4. Disulfide (-S-S-) and polysulfide covalent crosslinking sulfur bridges between polymer backbones (Claim 2).
 * 5. Real-time entropic elasticity deformation with transverse Poisson thinning and thermal Brownian motion.
 * 6. Calibrated mechanical dial strain gauge indicating tensile elongation.
 */

import * as THREE from "three";
import { goodyearUncoilFactor, stepGoodyearRubber } from "@/physics/catalogKernels";
import { heatFrames, sampleHeatAt } from "@/physics/genericWasm";
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
  testFrameGroup?: THREE.Group;
  strainGauge?: THREE.Mesh;
  gaugeNeedle?: THREE.Mesh;
}

export interface GoodyearRubberMaterials {
  polyisoprene: THREE.MeshStandardMaterial;
  sulfurBridge: THREE.MeshStandardMaterial;
  sulfurBond: THREE.MeshStandardMaterial;
  clamp: THREE.MeshStandardMaterial;
  brassScrew: THREE.MeshStandardMaterial;
  stressArrow: THREE.MeshStandardMaterial;
  frameIron: THREE.MeshStandardMaterial;
  dialMat?: THREE.MeshStandardMaterial;
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

  // --- Museum-Grade Materials ---
  const polyisoprene = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x242d38,
      roughness: 0.52,
      metalness: 0.2,
    }),
  );

  const sulfurBridge = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.18,
      metalness: 0.8,
      emissive: 0xca8a04,
      emissiveIntensity: 0.5,
    }),
  );

  const sulfurBond = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xeab308,
      roughness: 0.25,
      metalness: 0.65,
    }),
  );

  const clamp = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.22,
      metalness: 0.92,
    }),
  );

  const brassScrew = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.94,
      roughness: 0.22,
    }),
  );

  const stressArrow = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 0.65,
      roughness: 0.2,
    }),
  );

  const frameIron = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.65,
      metalness: 0.85,
    }),
  );

  const dialMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xfef9c3,
      roughness: 0.2,
      metalness: 0.1,
    }),
  );

  const materials: GoodyearRubberMaterials = {
    polyisoprene,
    sulfurBridge,
    sulfurBond,
    clamp,
    brassScrew,
    stressArrow,
    frameIron,
    dialMat,
  };

  // --- Mechanical Tensile Testing Frame Base ---
  const testFrameGroup = new THREE.Group();
  testFrameGroup.position.set(0, -2.6, 0);
  rootGroup.add(testFrameGroup);

  const frameBed = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(13.5, 0.6, 5.0)),
    materials.frameIron,
  );
  frameBed.receiveShadow = true;
  testFrameGroup.add(frameBed);

  // Chrome guide slideway rails for tensile carriage
  [-1.6, 1.6].forEach((rz) => {
    const rail = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.12, 0.12, 12.8, 16)),
      materials.clamp,
    );
    rail.rotation.z = Math.PI / 2;
    rail.position.set(0, 0.45, rz);
    testFrameGroup.add(rail);
  });

  // --- 1. Opposing Tensile Machine Clamps ---
  const leftClampGroup = new THREE.Group();
  leftClampGroup.position.set(-4.5, 0, 0);

  const leftClamp = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.88, 4.6, 3.6)),
    materials.clamp,
  );
  leftClamp.castShadow = true;
  leftClamp.receiveShadow = true;
  leftClampGroup.add(leftClamp);

  // Serrated clamp gripping face jaw insert
  const leftJaw = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.08, 4.2, 3.2)),
    materials.frameIron,
  );
  leftJaw.position.x = 0.44;
  leftClampGroup.add(leftJaw);

  [-1.5, 1.5].forEach((sy) => {
    const screw = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.38, 0.38, 0.65, 24)),
      materials.brassScrew,
    );
    screw.rotation.z = Math.PI / 2;
    screw.position.set(-0.65, sy, 0);
    screw.castShadow = true;
    leftClampGroup.add(screw);

    // Cross-tommy bar on thumbscrew
    const tommy = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.06, 0.06, 1.1, 12)),
      materials.brassScrew,
    );
    tommy.position.set(-0.95, sy, 0);
    leftClampGroup.add(tommy);
  });
  rootGroup.add(leftClampGroup);

  // Dial Strain Gauge on Fixed Left Clamp
  const strainGauge = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.55, 0.55, 0.15, 24)),
    dialMat,
  );
  strainGauge.rotation.z = Math.PI / 2;
  strainGauge.position.set(-0.55, 2.5, 0);
  leftClampGroup.add(strainGauge);

  const gaugeBezel = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.56, 0.05, 8, 24)),
    materials.brassScrew,
  );
  gaugeBezel.rotation.y = Math.PI / 2;
  gaugeBezel.position.set(-0.62, 2.5, 0);
  leftClampGroup.add(gaugeBezel);

  const gaugeNeedle = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.03, 0.38, 0.02)),
    materials.frameIron,
  );
  gaugeNeedle.position.set(-0.64, 2.5 + 0.12, 0);
  leftClampGroup.add(gaugeNeedle);

  const rightClampGroup = new THREE.Group();
  rightClampGroup.position.set(4.5, 0, 0);

  const rightClamp = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.88, 4.6, 3.6)),
    materials.clamp,
  );
  rightClamp.castShadow = true;
  rightClamp.receiveShadow = true;
  rightClampGroup.add(rightClamp);

  const rightJaw = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.08, 4.2, 3.2)),
    materials.frameIron,
  );
  rightJaw.position.x = -0.44;
  rightClampGroup.add(rightJaw);

  [-1.5, 1.5].forEach((sy) => {
    const screw = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.38, 0.38, 0.65, 24)),
      materials.brassScrew,
    );
    screw.rotation.z = Math.PI / 2;
    screw.position.set(0.65, sy, 0);
    screw.castShadow = true;
    rightClampGroup.add(screw);

    const tommy = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.06, 0.06, 1.1, 12)),
      materials.brassScrew,
    );
    tommy.position.set(0.95, sy, 0);
    rightClampGroup.add(tommy);
  });
  rootGroup.add(rightClampGroup);

  // --- 2. Tensile Stress Force Vector Arrows ---
  const leftArrow = new THREE.Mesh(
    trackGeo(new THREE.ConeGeometry(0.34, 1.2, 20)),
    materials.stressArrow,
  );
  leftArrow.rotation.z = Math.PI / 2;
  leftArrow.position.set(-1.45, 0, 0);
  leftClampGroup.add(leftArrow);

  const rightArrow = new THREE.Mesh(
    trackGeo(new THREE.ConeGeometry(0.34, 1.2, 20)),
    materials.stressArrow,
  );
  rightArrow.rotation.z = -Math.PI / 2;
  rightArrow.position.set(1.45, 0, 0);
  rightClampGroup.add(rightArrow);

  // --- 3. Cis-1,4-Polyisoprene Elastomer Chains (Claim 1) ---
  const chains: PolymerChainItem[] = [];
  const numChains = 6;

  for (let c = 0; c < numChains; c++) {
    const yBase = (c - (numChains - 1) / 2) * 0.72;
    const pts: THREE.Vector3[] = [];
    const numSegments = 16;

    for (let s = 0; s <= numSegments; s++) {
      const x = -4.0 + (s / numSegments) * 8.0;
      const y = yBase + Math.sin(s * 1.6 + c * 1.2) * 0.48;
      const z = Math.cos(s * 1.8 + c * 1.5) * 0.68;
      pts.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(pts);
    const geo = trackGeo(new THREE.TubeGeometry(curve, 54, 0.115, 10, false));
    const mesh = new THREE.Mesh(geo, materials.polyisoprene);
    mesh.castShadow = true;
    rootGroup.add(mesh);

    chains.push({ curve, mesh, basePts: pts });
  }

  // --- 4. Disulfide (-S-S-) Crosslink Bridges (Claim 2) ---
  const sulfurBridgesGroup = new THREE.Group();
  const numBridges = 14;
  const bridgeItems: SulfurBridgeItem[] = [];

  for (let b = 0; b < numBridges; b++) {
    const baseX = -3.2 + (b / (numBridges - 1)) * 6.4;
    const bridgeG = new THREE.Group();
    bridgeG.position.set(baseX, (lcg() - 0.5) * 1.8, (lcg() - 0.5) * 1.0);

    const sAtom1 = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.19, 18, 18)),
      materials.sulfurBridge,
    );
    sAtom1.position.y = -0.22;
    bridgeG.add(sAtom1);

    const sAtom2 = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.19, 18, 18)),
      materials.sulfurBridge,
    );
    sAtom2.position.y = 0.22;
    bridgeG.add(sAtom2);

    const sBond = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.045, 0.045, 0.44, 10)),
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
    testFrameGroup,
    strainGauge,
    gaugeNeedle,
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
  clampStudioX: number,
  stressScale: number,
  thermalAmplitude: number,
  isVulcanized: boolean,
  showSulfurCrosslinks: boolean,
  showStressVectors: boolean,
  isCutaway: boolean,
  vulcanizationTempC?: number,
  sulfurPct?: number,
  specimenTempC?: number,
) {
  const stretch = appliedTensileStretch;
  nodes.rightClampGroup.position.x = clampStudioX;
  nodes.leftClampGroup.position.x = -clampStudioX;

  // Stress vector scaling
  nodes.leftArrow.visible = showStressVectors;
  nodes.rightArrow.visible = showStressVectors;
  nodes.leftArrow.scale.set(stressScale, stressScale, stressScale);
  nodes.rightArrow.scale.set(stressScale, stressScale, stressScale);

  const rubber = stepGoodyearRubber(
    vulcanizationTempC,
    sulfurPct,
    30,
    appliedTensileStretch,
    specimenTempC,
  );
  if (nodes.gaugeNeedle) {
    nodes.gaugeNeedle.rotation.x = -(stretch - 1.0) * rubber.gaugeNeedleRadPerStretch;
  }

  // Deform polymer chains: Affine extension and transverse Poisson thinning
  const uncoilFactor = goodyearUncoilFactor(stretch, rubber.uncoilMin);
  const heat = heatFrames(12, 16, 2);
  const heatFrame = Math.abs(Math.floor(timeSec * 6)) % 16;
  for (let c = 0; c < nodes.chains.length; c++) {
    const item = nodes.chains[c];
    item.mesh.scale.set(stretch, uncoilFactor, uncoilFactor);
    const u = (c + 0.5) / Math.max(1, nodes.chains.length);
    const local = 1 + Math.abs(sampleHeatAt(heat, 12, 16, heatFrame, u, 0.35));
    item.mesh.position.y =
      Math.sin(timeSec * rubber.thermalWobbleOmega + c * rubber.thermalWobblePhasePitch) *
      thermalAmplitude *
      local;
    item.mesh.position.z =
      Math.cos(timeSec * rubber.thermalWobbleOmega + c * rubber.thermalWobblePhasePitch) *
      thermalAmplitude *
      local;
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
