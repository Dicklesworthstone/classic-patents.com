/**
 * kwolekKevlarModel.ts
 *
 * Museum-Grade Procedural 3D Model for Stephanie L. Kwolek's 1972 Optically
 * Anisotropic Aromatic Polyamide Dopes (US Patent 3,671,542).
 *
 * Implements a source-bounded liquid-crystalline PPTA polymer lattice and
 * a five-hole spinneret example from the specification:
 * - Multi-capillary stainless-steel spinneret shown as a pedagogical process fixture, not a claimed apparatus
 * - 5 parallel rigid-rod poly(p-phenylene terephthalamide) polymer chains with alternating dihedral phenylene rings
 * - Amide linkage groups (-NH-CO-) in strict trans-conformation with covalent backbone bonds
 * - Transverse inter-chain hydrogen-bond network (-NH···O=C-) forming a crystalline-sheet model, not a claim element
 * - Ballistic projectile impact testing assembly with dynamic kinetic energy dissipation wave
 */

import * as THREE from "three";
import { wave2dFrames, waveFrameRms } from "@/physics/genericWasm";

const HYDROGEN_BOND_AXIS = new THREE.Vector3(0, 1, 0);
const KWOLEK_HYDROGEN_BOND_BASE_OPACITY = 0.78;

function clampUnit(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/**
 * Maps the studio's scenario controls to a continuous *illustrative* ordering
 * dial. It deliberately does not diagnose a liquid-crystal phase: the patent's
 * onset depends on the specific polymer, solvent, inherent viscosity, and
 * viscosity-discontinuity criterion, none of which these three UI values fix.
 */
export function kwolekIllustrativeOrientationalOrder(
  polymerConcentrationPct: number,
  thermalDisorder: number,
  shearAlignment: number,
): number {
  const normalizedConcentration = clampUnit((polymerConcentrationPct - 5) / 20);
  const normalizedCooling = 1 - clampUnit(thermalDisorder / 0.3);
  return clampUnit(
    0.15 +
      normalizedConcentration * 0.45 +
      clampUnit(shearAlignment) * 0.25 +
      normalizedCooling * 0.15,
  );
}

/** Fades the crystalline-sheet teaching overlay without presenting a phase boundary. */
export function kwolekIllustrativeSheetVisibility(orientationalOrder: number): number {
  const t = clampUnit((orientationalOrder - 0.45) / 0.35);
  return t * t * (3 - 2 * t);
}

interface HydrogenBondBinding {
  fromChainIndex: number;
  toChainIndex: number;
  fromLocal: THREE.Vector3;
  toLocal: THREE.Vector3;
}

interface HydrogenBondKinematics {
  mesh: THREE.InstancedMesh;
  bindings: readonly HydrogenBondBinding[];
  from: THREE.Vector3;
  to: THREE.Vector3;
  direction: THREE.Vector3;
  midpoint: THREE.Vector3;
  inverseWorld: THREE.Matrix4;
  transform: THREE.Object3D;
}

export interface KwolekKevlarModel {
  root: THREE.Group;
  polymerGroup: THREE.Group;
  spinneretPack: THREE.Group;
  spinneretSolidGroup: THREE.Group;
  spinneretSectionGroup: THREE.Group;
  hBondsGroup: THREE.Group;
  hBondKinematics: HydrogenBondKinematics;
  bulletMesh: THREE.Mesh;
  impactWaveRms: Float64Array;
  chains: { group: THREE.Group; baseY: number }[];
  instancedMeshes: readonly THREE.InstancedMesh[];
  materials: {
    carbonRingMat: THREE.MeshStandardMaterial;
    amideNitrogenMat: THREE.MeshStandardMaterial;
    carbonylOxygenMat: THREE.MeshStandardMaterial;
    spinneretSteelMat: THREE.MeshStandardMaterial;
    bulletMat: THREE.MeshStandardMaterial;
    hBondMat: THREE.MeshStandardMaterial;
    bondStickMat: THREE.MeshStandardMaterial;
    holeMat: THREE.MeshStandardMaterial;
    spinneretFaceMat?: THREE.MeshStandardMaterial;
    casingBrassMat?: THREE.MeshStandardMaterial;
  };
  updateKinematics: (
    delta: number,
    isImpactTesting: boolean,
    showHydrogenBonds: boolean,
    shearRate: number,
    bulletDisplaySpeed: number,
    isCutaway?: boolean,
    orientationalOrder?: number,
  ) => void;
  dispose: () => void;
}

export function buildKwolekKevlarModel(): KwolekKevlarModel {
  const root = new THREE.Group();
  const disposables: Array<{ dispose: () => void }> = [];
  const instancedMeshes: THREE.InstancedMesh[] = [];

  // --- Museum-Grade Materials ---
  const carbonRingMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.22,
    metalness: 0.88,
  });
  disposables.push(carbonRingMat);

  const amideNitrogenMat = new THREE.MeshStandardMaterial({
    color: 0x2563eb,
    roughness: 0.18,
    metalness: 0.65,
  });
  disposables.push(amideNitrogenMat);

  const carbonylOxygenMat = new THREE.MeshStandardMaterial({
    color: 0xdc2626,
    roughness: 0.18,
    metalness: 0.65,
  });
  disposables.push(carbonylOxygenMat);

  const spinneretSteelMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.25,
    metalness: 0.92,
  });
  disposables.push(spinneretSteelMat);

  // Several examples specify a precious-metal or platinum spinneret. The
  // model intentionally uses a neutral metal rather than inventing a coating.
  const spinneretFaceMat = new THREE.MeshStandardMaterial({
    color: 0xd1d5db,
    roughness: 0.24,
    metalness: 0.95,
  });
  disposables.push(spinneretFaceMat);

  const casingBrassMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.2,
    metalness: 0.92,
  });
  disposables.push(casingBrassMat);

  const bulletMat = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    metalness: 0.92,
    roughness: 0.18,
  });
  disposables.push(bulletMat);

  const hBondMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.25,
    metalness: 0.6,
    transparent: true,
    opacity: KWOLEK_HYDROGEN_BOND_BASE_OPACITY,
  });
  disposables.push(hBondMat);

  const bondStickMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.3,
    metalness: 0.85,
  });
  disposables.push(bondStickMat);

  const holeMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.8,
  });
  disposables.push(holeMat);

  // ==========================================
  // 1. BASE PLINTH & TENSILE TEST RAIL BENCH
  // ==========================================
  const benchGroup = new THREE.Group();
  root.add(benchGroup);

  const plinth = new THREE.Mesh(new THREE.BoxGeometry(14.0, 0.45, 4.0), spinneretSteelMat);
  plinth.position.set(0, -4.2, 0);
  plinth.receiveShadow = true;
  benchGroup.add(plinth);

  // Left Spinneret Extrusion Pack Support Column
  const leftStanchion = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.8, 2.4), spinneretSteelMat);
  leftStanchion.position.set(-6.0, -3.1, 0);
  leftStanchion.castShadow = true;
  benchGroup.add(leftStanchion);

  // Right-Side Fiber Clamp Fixture & Tensile Grip Block
  const rightClamp = new THREE.Mesh(new THREE.BoxGeometry(1.4, 7.2, 2.4), spinneretSteelMat);
  rightClamp.position.set(5.0, 0, 0);
  rightClamp.castShadow = true;
  benchGroup.add(rightClamp);

  const rightStanchion = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.8, 2.4), spinneretSteelMat);
  rightStanchion.position.set(5.0, -3.1, 0);
  rightStanchion.castShadow = true;
  benchGroup.add(rightStanchion);

  // ==========================================
  // SPINNERET EXTRUSION EXAMPLE (five-hole specification example)
  // ==========================================
  const polymerGroup = new THREE.Group();
  root.add(polymerGroup);

  const spinneretPack = new THREE.Group();
  spinneretPack.position.set(-6.0, 0, 0);
  const spinneretSolidGroup = new THREE.Group();
  const spinneretSectionGroup = new THREE.Group();
  spinneretSectionGroup.visible = false;
  spinneretPack.add(spinneretSolidGroup, spinneretSectionGroup);

  // Heavy Stainless Steel Extrusion Die Body
  const packGeo = new THREE.BoxGeometry(1.6, 7.2, 2.4);
  disposables.push(packGeo);
  const packMesh = new THREE.Mesh(packGeo, spinneretSteelMat);
  packMesh.castShadow = true;
  spinneretSolidGroup.add(packMesh);

  // Source examples use precious-metal spinnerets; no unsupported plating is shown.
  const faceplateGeo = new THREE.BoxGeometry(0.12, 6.8, 2.1);
  disposables.push(faceplateGeo);
  const faceplate = new THREE.Mesh(faceplateGeo, spinneretFaceMat);
  faceplate.position.x = 0.82;
  faceplate.castShadow = true;
  spinneretSolidGroup.add(faceplate);

  // A literal half-section of the otherwise solid die. It exposes only the
  // documented capillaries and deliberately invents no distribution-pack internals.
  const sectionGeo = new THREE.BoxGeometry(0.8, 7.2, 2.4);
  disposables.push(sectionGeo);
  const sectionBody = new THREE.Mesh(sectionGeo, spinneretSteelMat);
  sectionBody.position.x = -0.4;
  sectionBody.castShadow = true;
  spinneretSectionGroup.add(sectionBody);

  // One specification example uses a five-hole spinneret. These cylinders are
  // capillary passages, not a dimensional reconstruction of an apparatus drawing.
  const numChains = 5;
  const instanceTransform = new THREE.Object3D();
  const holeGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.7, 20);
  disposables.push(holeGeo);
  const spinneretHoles = new THREE.InstancedMesh(holeGeo, holeMat, numChains);
  instancedMeshes.push(spinneretHoles);
  spinneretHoles.instanceMatrix.setUsage(THREE.StaticDrawUsage);
  for (let c = 0; c < numChains; c++) {
    const yPos = (c - (numChains - 1) / 2) * 1.35;
    // Keep the capillary face just proud of the outer plate so the solid view
    // retains a readable dark orifice while the section view exposes its bore.
    instanceTransform.position.set(0.07, yPos, 0);
    instanceTransform.rotation.set(0, 0, Math.PI / 2);
    instanceTransform.scale.setScalar(1);
    instanceTransform.updateMatrix();
    spinneretHoles.setMatrixAt(c, instanceTransform.matrix);
  }
  spinneretHoles.instanceMatrix.needsUpdate = true;
  spinneretPack.add(spinneretHoles);
  root.add(spinneretPack);

  // ==========================================
  // PPTA POLYMER CHAINS & AROMATIC RINGS
  // ==========================================
  const chains: { group: THREE.Group; baseY: number }[] = [];
  const monomersPerChain = 5;
  const ringGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.09, 6);
  const nGeo = new THREE.SphereGeometry(0.17, 16, 16);
  const oGeo = new THREE.SphereGeometry(0.17, 16, 16);
  const stickGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.46, 10);
  disposables.push(ringGeo, nGeo, oGeo, stickGeo);

  for (let c = 0; c < numChains; c++) {
    const chainGroup = new THREE.Group();
    const baseY = (c - (numChains - 1) / 2) * 1.35;
    chainGroup.position.set(0, baseY, 0);

    // Keep every molecular row independently articulated while batching its
    // identical atoms and bonds into four draw units instead of 25 meshes.
    const rings = new THREE.InstancedMesh(ringGeo, carbonRingMat, monomersPerChain);
    const nitrogenAtoms = new THREE.InstancedMesh(nGeo, amideNitrogenMat, monomersPerChain);
    const oxygenAtoms = new THREE.InstancedMesh(oGeo, carbonylOxygenMat, monomersPerChain);
    const backboneBonds = new THREE.InstancedMesh(stickGeo, bondStickMat, monomersPerChain * 2);
    instancedMeshes.push(rings, nitrogenAtoms, oxygenAtoms, backboneBonds);
    for (const mesh of [rings, nitrogenAtoms, oxygenAtoms, backboneBonds]) {
      mesh.instanceMatrix.setUsage(THREE.StaticDrawUsage);
      mesh.castShadow = true;
      chainGroup.add(mesh);
    }

    // Build repeating monomer units along chain axis
    for (let u = 0; u < monomersPerChain; u++) {
      const xOffset = -4.0 + u * 1.55;

      // 1,4-Phenylene aromatic ring (alternating tilted dihedral angles)
      instanceTransform.position.set(xOffset, 0, 0);
      instanceTransform.rotation.set(Math.PI / 2 + (u % 2 === 0 ? 0.25 : -0.25), 0, 0);
      instanceTransform.scale.setScalar(1);
      instanceTransform.updateMatrix();
      rings.setMatrixAt(u, instanceTransform.matrix);

      // Amide nitrogen atom (-NH-)
      instanceTransform.position.set(xOffset + 0.55, u % 2 === 0 ? 0.22 : -0.22, 0);
      instanceTransform.rotation.set(0, 0, 0);
      instanceTransform.updateMatrix();
      nitrogenAtoms.setMatrixAt(u, instanceTransform.matrix);

      // Carbonyl oxygen atom (=O)
      instanceTransform.position.set(xOffset - 0.55, u % 2 === 0 ? -0.22 : 0.22, 0);
      instanceTransform.updateMatrix();
      oxygenAtoms.setMatrixAt(u, instanceTransform.matrix);

      // Covalent backbone bond cylinders
      instanceTransform.rotation.set(0, 0, Math.PI / 2);
      instanceTransform.position.set(xOffset + 0.35, 0, 0);
      instanceTransform.updateMatrix();
      backboneBonds.setMatrixAt(u * 2, instanceTransform.matrix);
      instanceTransform.position.set(xOffset - 0.35, 0, 0);
      instanceTransform.updateMatrix();
      backboneBonds.setMatrixAt(u * 2 + 1, instanceTransform.matrix);
    }
    for (const mesh of [rings, nitrogenAtoms, oxygenAtoms, backboneBonds]) {
      mesh.instanceMatrix.needsUpdate = true;
    }

    polymerGroup.add(chainGroup);
    chains.push({ group: chainGroup, baseY });
  }

  // ==========================================
  // HYDROGEN-BOND NETWORK (schematic crystalline-sheet view)
  // ==========================================
  const hBondsGroup = new THREE.Group();
  const hBondGeo = new THREE.CylinderGeometry(0.038, 0.038, 1, 8);
  disposables.push(hBondGeo);
  const hBondCount = (numChains - 1) * monomersPerChain;
  const hBonds = new THREE.InstancedMesh(hBondGeo, hBondMat, hBondCount);
  instancedMeshes.push(hBonds);
  hBonds.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const hBondBindings: HydrogenBondBinding[] = [];
  for (let c = 0; c < numChains - 1; c++) {
    for (let u = 0; u < monomersPerChain; u++) {
      const xOffset = -4.0 + u * 1.55;
      const transverseOffset = u % 2 === 0 ? 0.22 : -0.22;
      hBondBindings.push({
        fromChainIndex: c,
        toChainIndex: c + 1,
        fromLocal: new THREE.Vector3(xOffset + 0.55, transverseOffset, 0),
        toLocal: new THREE.Vector3(xOffset - 0.55, -transverseOffset, 0),
      });
    }
  }
  hBondsGroup.add(hBonds);
  polymerGroup.add(hBondsGroup);

  const hBondKinematics: HydrogenBondKinematics = {
    mesh: hBonds,
    bindings: hBondBindings,
    from: new THREE.Vector3(),
    to: new THREE.Vector3(),
    direction: new THREE.Vector3(),
    midpoint: new THREE.Vector3(),
    inverseWorld: new THREE.Matrix4(),
    transform: new THREE.Object3D(),
  };

  // Illustrative ballistic projectile for the modern impact-response view;
  // no historical projectile shape or apparatus is attributed to this patent.
  const bulletGeo = new THREE.ConeGeometry(0.48, 1.5, 28);
  disposables.push(bulletGeo);
  const bulletMesh = new THREE.Mesh(bulletGeo, bulletMat);
  bulletMesh.rotation.z = Math.PI / 2;
  bulletMesh.position.set(6.5, 0, 0);
  bulletMesh.castShadow = true;
  root.add(bulletMesh);

  // The impact field is invariant for this source-bounded display. Drain it
  // once at construction instead of scanning a 16x16 frame on every paint.
  const impactField = wave2dFrames(16, 16, 2);
  const impactWaveRms = Float64Array.from({ length: 16 }, (_, frame) =>
    waveFrameRms(impactField, 16, 16, frame),
  );

  // ==========================================
  // KINEMATICS UPDATE FUNCTION
  // ==========================================
  const updateKinematics = (
    delta: number,
    isImpactTesting: boolean,
    showHydrogenBonds: boolean,
    shearRate: number,
    bulletDisplaySpeed: number,
    isCutaway = false,
    orientationalOrder = 1,
  ) => {
    updateKwolekKevlarKinematics(
      model,
      delta,
      isImpactTesting,
      showHydrogenBonds,
      shearRate,
      bulletDisplaySpeed,
      isCutaway,
      orientationalOrder,
    );
  };

  const dispose = () => {
    for (const mesh of instancedMeshes) {
      mesh.dispose();
    }
    for (const d of disposables) {
      d.dispose();
    }
  };

  const model: KwolekKevlarModel = {
    root,
    polymerGroup,
    spinneretPack,
    spinneretSolidGroup,
    spinneretSectionGroup,
    hBondsGroup,
    hBondKinematics,
    bulletMesh,
    impactWaveRms,
    chains,
    instancedMeshes,
    materials: {
      carbonRingMat,
      amideNitrogenMat,
      carbonylOxygenMat,
      spinneretSteelMat,
      bulletMat,
      hBondMat,
      bondStickMat,
      holeMat,
      spinneretFaceMat,
      casingBrassMat,
    },
    updateKinematics,
    dispose,
  };

  updateHydrogenBondKinematics(model);
  return model;
}

/**
 * Poses the molecular rows on a continuous orientation spectrum. At full order
 * the rows retain the lightly moving, parallel crystalline-sheet teaching pose;
 * at low order their deterministic rotations and offsets communicate a
 * disordered isotropic-style solution without relying on random state.
 */
export function poseKwolekIllustrativeOrder(
  model: KwolekKevlarModel,
  orientationalOrder: number,
  elapsedS: number,
  wiggleOmegaRadPerS: number,
  orderedWiggleAmp: number,
  orderedWobbleAmp: number,
  wobbleOmegaRadPerS: number,
): void {
  const order = clampUnit(orientationalOrder);
  const disorder = 1 - order;

  for (let index = 0; index < model.chains.length; index++) {
    const chain = model.chains[index];
    if (!chain) continue;

    // Golden-angle phases make the low-order arrangement visibly non-parallel
    // while remaining deterministic across replay and remount.
    const seed = (index + 1) * 2.399963229728653;
    const orderedRotation = Math.sin(elapsedS * wiggleOmegaRadPerS + index) * orderedWiggleAmp;
    const disorderedRotation = Math.sin(seed) * 0.9 + Math.cos(elapsedS * 0.8 + seed) * 0.12;
    const orderedWobble = Math.sin(elapsedS * wobbleOmegaRadPerS + index) * orderedWobbleAmp;
    const disorderedWobble = Math.cos(elapsedS * 0.7 + seed) * 0.12;

    chain.group.rotation.set(0, 0, orderedRotation * order + disorderedRotation * disorder);
    chain.group.position.set(
      Math.cos(seed * 1.7) * 0.24 * disorder,
      chain.baseY +
        orderedWobble * order +
        (Math.sin(seed * 1.1) * 0.42 + disorderedWobble) * disorder,
      Math.sin(seed * 1.9) * 0.32 * disorder,
    );
  }
}

function updateHydrogenBondKinematics(model: KwolekKevlarModel): void {
  const { hBondKinematics } = model;
  const { bindings, direction, from, inverseWorld, mesh, midpoint, to, transform } =
    hBondKinematics;

  // The bonds live under polymerGroup while each row has its own animation
  // transform. Convert both atom endpoints into the bonds' local frame before
  // composing the cylinder matrix so they remain attached during every pose.
  model.root.updateMatrixWorld(true);
  inverseWorld.copy(model.hBondsGroup.matrixWorld).invert();

  for (let index = 0; index < bindings.length; index++) {
    const binding = bindings[index];
    const fromChain = model.chains[binding.fromChainIndex];
    const toChain = model.chains[binding.toChainIndex];
    if (!fromChain || !toChain) continue;

    from
      .copy(binding.fromLocal)
      .applyMatrix4(fromChain.group.matrixWorld)
      .applyMatrix4(inverseWorld);
    to.copy(binding.toLocal).applyMatrix4(toChain.group.matrixWorld).applyMatrix4(inverseWorld);
    direction.subVectors(to, from);
    const length = direction.length();
    midpoint.addVectors(from, to).multiplyScalar(0.5);
    transform.position.copy(midpoint);

    if (length > 1e-6) {
      direction.multiplyScalar(1 / length);
      transform.quaternion.setFromUnitVectors(HYDROGEN_BOND_AXIS, direction);
      transform.scale.set(1, length, 1);
    } else {
      transform.quaternion.identity();
      transform.scale.set(1, 0, 1);
    }

    transform.updateMatrix();
    mesh.setMatrixAt(index, transform.matrix);
  }

  mesh.instanceMatrix.needsUpdate = true;
  mesh.computeBoundingSphere();
}

/**
 * Updates Stephanie Kwolek PPTA liquid crystalline Kevlar polymer sheet dynamics, hydrogen bond network, projectile strain dissipation, and spinneret cutaway.
 */
export function updateKwolekKevlarKinematics(
  model: KwolekKevlarModel,
  delta: number,
  isImpactTesting: boolean,
  showHydrogenBonds: boolean,
  _shearRate: number,
  bulletDisplaySpeed: number,
  isCutaway = false,
  orientationalOrder = 1,
): void {
  const sheetVisibility = showHydrogenBonds
    ? kwolekIllustrativeSheetVisibility(orientationalOrder)
    : 0;
  model.hBondsGroup.visible = sheetVisibility > 0.01;
  model.materials.hBondMat.opacity = KWOLEK_HYDROGEN_BOND_BASE_OPACITY * sheetVisibility;
  updateHydrogenBondKinematics(model);

  if (isImpactTesting) {
    const frame = Math.abs(Math.floor(model.bulletMesh.position.x * 2)) % 16;
    const rms = model.impactWaveRms[frame] ?? 0;
    model.bulletMesh.position.x -= delta * bulletDisplaySpeed * (1 + rms);
    if (model.bulletMesh.position.x < 1.0) {
      model.bulletMesh.position.x = 6.5;
    }
  } else {
    model.bulletMesh.position.x = 6.5;
  }

  // Section only the spinneret body. Bench and clamp steel keep their normal
  // opaque material, and no unreviewed internal distribution geometry is implied.
  model.spinneretSolidGroup.visible = !isCutaway;
  model.spinneretSectionGroup.visible = isCutaway;
}
