/**
 * Source-bounded reconstruction of the mechanism actually printed in US 313,224.
 *
 * The grant describes parallel continuous matrix-bars, key-set stops, a clamp
 * and blade that assemble a temporary matrix, and a separate mold/pump train.
 * It does not describe the later commercial magazine, spacebands, or matrix
 * return/sorting apparatus. Dimensions below are stable display proportions.
 */

import * as THREE from "three";

export interface MergenthalerMatrixBarNodes {
  rootGroup: THREE.Group;
  frameGroup: THREE.Group;
  keyboardGroup: THREE.Group;
  matrixBarGroup: THREE.Group;
  continuousBars: THREE.Mesh[];
  stopPins: THREE.Mesh[];
  excludedBandGroup: THREE.Group;
  clampGroup: THREE.Group;
  moldGroup: THREE.Group;
  moldUpper: THREE.Mesh;
  moldLower: THREE.Mesh;
  plunger: THREE.Mesh;
  slug: THREE.Mesh;
}

export interface MergenthalerMatrixBarMaterials {
  castIron: THREE.MeshStandardMaterial;
  steel: THREE.MeshStandardMaterial;
  brass: THREE.MeshStandardMaterial;
  matrixFace: THREE.MeshStandardMaterial;
  moltenMetal: THREE.MeshStandardMaterial;
  excluded: THREE.MeshStandardMaterial;
}

export interface MergenthalerMatrixBarPose {
  cycle01: number;
  stopTravelDisplay: number;
  moldClosurePct: number;
  claim1Active: boolean;
  cutaway: boolean;
}

const BAR_COUNT = 8;
const BAR_BASE_Y = 0.55;
const BAR_TRAVEL = 0.56;

function trackMaterial<T extends THREE.Material>(material: T, materials: THREE.Material[]): T {
  materials.push(material);
  return material;
}

function trackGeometry<T extends THREE.BufferGeometry>(
  geometry: T,
  geometries: THREE.BufferGeometry[],
): T {
  geometries.push(geometry);
  return geometry;
}

function beamBetween(
  start: THREE.Vector3,
  end: THREE.Vector3,
  radius: number,
  material: THREE.Material,
  geometries: THREE.BufferGeometry[],
): THREE.Mesh {
  const delta = end.clone().sub(start);
  const beam = new THREE.Mesh(
    trackGeometry(new THREE.CylinderGeometry(radius, radius, delta.length(), 10), geometries),
    material,
  );
  beam.position.copy(start).addScaledVector(delta, 0.5);
  beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
  return beam;
}

export function buildMergenthalerMatrixBarModel(): {
  rootGroup: THREE.Group;
  nodes: MergenthalerMatrixBarNodes;
  materials: MergenthalerMatrixBarMaterials;
  dispose: () => void;
} {
  const geometries: THREE.BufferGeometry[] = [];
  const disposableMaterials: THREE.Material[] = [];
  const rootGroup = new THREE.Group();
  rootGroup.name = "US313224MatrixBarMachine";

  const materials: MergenthalerMatrixBarMaterials = {
    castIron: trackMaterial(
      new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.62, metalness: 0.68 }),
      disposableMaterials,
    ),
    steel: trackMaterial(
      new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.22, metalness: 0.88 }),
      disposableMaterials,
    ),
    brass: trackMaterial(
      new THREE.MeshStandardMaterial({ color: 0xb7791f, roughness: 0.32, metalness: 0.78 }),
      disposableMaterials,
    ),
    matrixFace: trackMaterial(
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.48, metalness: 0.48 }),
      disposableMaterials,
    ),
    moltenMetal: trackMaterial(
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xb45309,
        emissiveIntensity: 0.35,
        roughness: 0.3,
        metalness: 0.55,
      }),
      disposableMaterials,
    ),
    excluded: trackMaterial(
      new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.44, metalness: 0.34 }),
      disposableMaterials,
    ),
  };

  const frameGroup = new THREE.Group();
  rootGroup.add(frameGroup);
  const base = new THREE.Mesh(
    trackGeometry(new THREE.BoxGeometry(6.2, 0.34, 4.0), geometries),
    materials.castIron,
  );
  base.position.y = -2.05;
  base.receiveShadow = true;
  frameGroup.add(base);

  const postGeometry = trackGeometry(new THREE.BoxGeometry(0.34, 4.2, 0.38), geometries);
  for (const x of [-2.55, 2.55]) {
    for (const z of [-1.35, 1.35]) {
      const post = new THREE.Mesh(postGeometry, materials.castIron);
      post.position.set(x, 0.05, z);
      post.castShadow = true;
      frameGroup.add(post);
    }
  }
  const topBeamGeometry = trackGeometry(new THREE.BoxGeometry(5.45, 0.34, 0.42), geometries);
  for (const z of [-1.35, 1.35]) {
    const beam = new THREE.Mesh(topBeamGeometry, materials.castIron);
    beam.position.set(0, 2.14, z);
    frameGroup.add(beam);
  }

  const keyboardGroup = new THREE.Group();
  keyboardGroup.name = "FingerKeyAndAdjustingPinDeck";
  keyboardGroup.position.set(0, -1.25, 1.55);
  rootGroup.add(keyboardGroup);
  const keyBed = new THREE.Mesh(
    trackGeometry(new THREE.BoxGeometry(3.9, 0.22, 0.9), geometries),
    materials.castIron,
  );
  keyBed.rotation.x = -0.18;
  keyboardGroup.add(keyBed);
  const keyGeometry = trackGeometry(new THREE.CylinderGeometry(0.075, 0.085, 0.1, 12), geometries);
  for (let row = 0; row < 3; row += 1) {
    for (let column = 0; column < 8; column += 1) {
      const key = new THREE.Mesh(keyGeometry, materials.brass);
      key.position.set(-1.55 + column * 0.44, 0.18, -0.24 + row * 0.25);
      keyboardGroup.add(key);
    }
  }

  const matrixBarGroup = new THREE.Group();
  matrixBarGroup.name = "ParallelContinuousMatrixBars";
  matrixBarGroup.position.set(-0.45, 0, 0.05);
  rootGroup.add(matrixBarGroup);

  const lowerGuide = new THREE.Mesh(
    trackGeometry(new THREE.BoxGeometry(3.7, 0.22, 0.65), geometries),
    materials.steel,
  );
  lowerGuide.position.y = -1.45;
  matrixBarGroup.add(lowerGuide);
  const upperGuide = lowerGuide.clone();
  upperGuide.position.y = 1.55;
  matrixBarGroup.add(upperGuide);

  const continuousBars: THREE.Mesh[] = [];
  const stopPins: THREE.Mesh[] = [];
  const barGeometry = trackGeometry(new THREE.BoxGeometry(0.28, 2.65, 0.26), geometries);
  const characterLandGeometry = trackGeometry(new THREE.BoxGeometry(0.18, 0.12, 0.055), geometries);
  const pinGeometry = trackGeometry(new THREE.CylinderGeometry(0.065, 0.065, 0.72, 10), geometries);
  for (let index = 0; index < BAR_COUNT; index += 1) {
    const x = -1.45 + index * 0.42;
    const bar = new THREE.Mesh(barGeometry, materials.brass);
    bar.name = `ContinuousMatrixBar${index + 1}`;
    bar.position.set(x, BAR_BASE_Y, 0);
    bar.castShadow = true;
    matrixBarGroup.add(bar);
    continuousBars.push(bar);
    for (let character = 0; character < 6; character += 1) {
      const land = new THREE.Mesh(characterLandGeometry, materials.matrixFace);
      land.position.set(0, -0.95 + character * 0.38, 0.155);
      bar.add(land);
    }

    const pin = new THREE.Mesh(pinGeometry, materials.steel);
    pin.name = `StopPin${index + 1}`;
    pin.rotation.x = Math.PI / 2;
    pin.position.set(x, -1.23, 0.38);
    matrixBarGroup.add(pin);
    stopPins.push(pin);

    const linkage = beamBetween(
      new THREE.Vector3(x, -1.28, 0.62),
      new THREE.Vector3(x * 0.82, -0.18, 1.32),
      0.025,
      materials.steel,
      geometries,
    );
    matrixBarGroup.add(linkage);
  }

  const clampGroup = new THREE.Group();
  clampGroup.name = "TransverseBladeAndClamp";
  matrixBarGroup.add(clampGroup);
  const clamp = new THREE.Mesh(
    trackGeometry(new THREE.BoxGeometry(3.75, 0.24, 0.24), geometries),
    materials.steel,
  );
  clamp.position.set(0, -0.05, 0.42);
  clampGroup.add(clamp);
  const blade = new THREE.Mesh(
    trackGeometry(new THREE.BoxGeometry(3.6, 0.08, 0.42), geometries),
    materials.steel,
  );
  blade.position.set(0, 0.18, 0.26);
  clampGroup.add(blade);

  // Claim 1 expressly excludes separate matrices united by a flexible band.
  // Keep that comparison supported inside the same carriage rather than
  // floating it in space when the visitor inverts the claim constraint.
  const excludedBandGroup = new THREE.Group();
  excludedBandGroup.name = "ExcludedFlexibleBandAlternative";
  excludedBandGroup.visible = false;
  matrixBarGroup.add(excludedBandGroup);
  const comparisonTray = new THREE.Mesh(
    trackGeometry(new THREE.BoxGeometry(3.65, 0.18, 0.72), geometries),
    materials.castIron,
  );
  comparisonTray.position.y = 0.13;
  excludedBandGroup.add(comparisonTray);
  const tileGeometry = trackGeometry(new THREE.BoxGeometry(0.28, 0.48, 0.24), geometries);
  for (let index = 0; index < BAR_COUNT; index += 1) {
    const tile = new THREE.Mesh(tileGeometry, materials.excluded);
    tile.position.set(-1.45 + index * 0.42, 0.46, 0);
    excludedBandGroup.add(tile);
  }
  const bandCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.82, 0.48, 0.18),
    new THREE.Vector3(0, 0.55, 0.2),
    new THREE.Vector3(1.82, 0.48, 0.18),
  ]);
  const band = new THREE.Mesh(
    trackGeometry(new THREE.TubeGeometry(bandCurve, 28, 0.035, 8, false), geometries),
    materials.excluded,
  );
  excludedBandGroup.add(band);

  const moldGroup = new THREE.Group();
  moldGroup.name = "SectionalMoldAndForcePump";
  moldGroup.position.set(2.15, -0.1, -0.55);
  rootGroup.add(moldGroup);
  const moldGeometry = trackGeometry(new THREE.BoxGeometry(1.15, 0.62, 0.85), geometries);
  const moldUpper = new THREE.Mesh(moldGeometry, materials.castIron);
  const moldLower = new THREE.Mesh(moldGeometry, materials.castIron);
  moldUpper.position.y = 0.48;
  moldLower.position.y = -0.48;
  moldGroup.add(moldUpper, moldLower);

  const pot = new THREE.Mesh(
    trackGeometry(new THREE.CylinderGeometry(0.72, 0.82, 1.35, 20), geometries),
    materials.castIron,
  );
  pot.position.set(0.2, -0.95, -0.78);
  rootGroup.add(pot);
  const potStand = new THREE.Mesh(
    trackGeometry(new THREE.BoxGeometry(1.35, 0.95, 1.35), geometries),
    materials.castIron,
  );
  potStand.position.set(0.2, -1.48, -0.78);
  rootGroup.add(potStand);
  const plunger = new THREE.Mesh(
    trackGeometry(new THREE.CylinderGeometry(0.13, 0.13, 1.15, 14), geometries),
    materials.steel,
  );
  plunger.position.set(0.2, 0.1, -0.78);
  rootGroup.add(plunger);
  const deliveryPipe = beamBetween(
    new THREE.Vector3(0.55, -0.6, -0.78),
    new THREE.Vector3(1.58, -0.2, -0.58),
    0.075,
    materials.brass,
    geometries,
  );
  rootGroup.add(deliveryPipe);

  const slug = new THREE.Mesh(
    trackGeometry(new THREE.BoxGeometry(1.0, 0.22, 0.32), geometries),
    materials.moltenMetal,
  );
  slug.position.set(0, 0, 0.55);
  slug.visible = false;
  moldGroup.add(slug);

  const nodes: MergenthalerMatrixBarNodes = {
    rootGroup,
    frameGroup,
    keyboardGroup,
    matrixBarGroup,
    continuousBars,
    stopPins,
    excludedBandGroup,
    clampGroup,
    moldGroup,
    moldUpper,
    moldLower,
    plunger,
    slug,
  };

  updateMergenthalerMatrixBarModel(nodes, materials, {
    cycle01: 0,
    stopTravelDisplay: 6.5,
    moldClosurePct: 40,
    claim1Active: true,
    cutaway: false,
  });

  return {
    rootGroup,
    nodes,
    materials,
    dispose: () => {
      for (const geometry of geometries) geometry.dispose();
      for (const material of disposableMaterials) material.dispose();
    },
  };
}

export function updateMergenthalerMatrixBarModel(
  nodes: MergenthalerMatrixBarNodes,
  materials: MergenthalerMatrixBarMaterials,
  pose: MergenthalerMatrixBarPose,
): void {
  const cycle01 = ((pose.cycle01 % 1) + 1) % 1;
  const stopTravel = THREE.MathUtils.clamp(pose.stopTravelDisplay / 12, 0, 1);
  const closure = THREE.MathUtils.clamp(pose.moldClosurePct / 100, 0, 1);
  const selectedIndex = Math.min(BAR_COUNT - 1, Math.floor(cycle01 * BAR_COUNT));

  nodes.continuousBars.forEach((bar, index) => {
    const selectedDrop = index === selectedIndex ? BAR_TRAVEL * stopTravel : 0;
    const encodedStop = ((index * 3) % 5) * 0.055 * stopTravel;
    bar.position.y = BAR_BASE_Y - selectedDrop - encodedStop;
    bar.visible = pose.claim1Active;
    nodes.stopPins[index].position.z = 0.26 + (index === selectedIndex ? 0.28 : 0);
  });
  nodes.excludedBandGroup.visible = !pose.claim1Active;

  nodes.clampGroup.position.z = THREE.MathUtils.lerp(0.42, 0.04, closure);
  const moldGap = THREE.MathUtils.lerp(0.68, 0.34, closure);
  nodes.moldUpper.position.y = moldGap;
  nodes.moldLower.position.y = -moldGap;
  nodes.plunger.position.y = THREE.MathUtils.lerp(0.28, -0.02, closure);
  nodes.slug.visible = pose.claim1Active && closure > 0.86 && cycle01 > 0.55;

  materials.castIron.transparent = pose.cutaway;
  materials.castIron.opacity = pose.cutaway ? 0.42 : 1;
}
