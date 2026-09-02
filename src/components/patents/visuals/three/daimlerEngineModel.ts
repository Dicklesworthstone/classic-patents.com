import * as THREE from "three";

/** A source-bounded model of the in-line marine motor installation. */
export interface DaimlerMarineEngineModel {
  rootGroup: THREE.Group;
  motorGroup: THREE.Group;
  propellerShaftGroup: THREE.Group;
  couplingGroup: THREE.Group;
  reverseGroup: THREE.Group;
  thrustGroup: THREE.Group;
  coolingGroup: THREE.Group;
  reservoirGroup: THREE.Group;
  dispose: () => void;
}

export function buildDaimlerMarineEngineModel(): DaimlerMarineEngineModel {
  const rootGroup = new THREE.Group();
  const motorGroup = new THREE.Group();
  const propellerShaftGroup = new THREE.Group();
  const couplingGroup = new THREE.Group();
  const reverseGroup = new THREE.Group();
  const thrustGroup = new THREE.Group();
  const coolingGroup = new THREE.Group();
  const reservoirGroup = new THREE.Group();
  rootGroup.add(
    motorGroup,
    propellerShaftGroup,
    couplingGroup,
    reverseGroup,
    thrustGroup,
    coolingGroup,
    reservoirGroup,
  );

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const castIron = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.7,
    metalness: 0.6,
  });
  const steel = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.3, metalness: 0.9 });
  const brass = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.35,
    metalness: 0.8,
  });
  const copper = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    roughness: 0.4,
    metalness: 0.75,
  });
  const gas = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.55,
    roughness: 0.2,
  });
  const wood = new THREE.MeshStandardMaterial({
    color: 0x5c2c16,
    roughness: 0.75,
    metalness: 0.05,
  });
  materials.push(castIron, steel, brass, copper, gas, wood);
  const add = (
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    parent: THREE.Object3D,
    position: [number, number, number],
  ) => {
    geometries.push(geometry);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.castShadow = true;
    parent.add(mesh);
    return mesh;
  };

  // ==============================================================
  // 1. Boat Keel Timbers & Engine Bearer Bedplate (Ground Foundation)
  // ==============================================================
  const foundationGroup = new THREE.Group();
  rootGroup.add(foundationGroup);

  // Main Keel Stringer Timbers
  add(new THREE.BoxGeometry(9.0, 0.35, 0.6), wood, foundationGroup, [1.0, -1.8, 0]);
  for (const z of [-1.1, 1.1]) {
    add(new THREE.BoxGeometry(7.5, 0.3, 0.4), wood, foundationGroup, [0.5, -1.7, z]);
  }
  // Cross rib timbers
  for (const x of [-2.0, -0.6, 0.8, 2.2, 3.6, 4.8]) {
    add(new THREE.BoxGeometry(0.3, 0.28, 2.8), wood, foundationGroup, [x, -1.65, 0]);
  }

  // Cast-Iron Engine Bedplate
  add(new THREE.BoxGeometry(2.4, 0.3, 1.8), castIron, motorGroup, [0, -0.45, 0]);
  // 4 Cast Engine Mounting Feet Bolted to Bedplate
  for (const [mx, mz] of [
    [-0.95, -0.75],
    [0.95, -0.75],
    [-0.95, 0.75],
    [0.95, 0.75],
  ]) {
    add(new THREE.BoxGeometry(0.3, 0.4, 0.3), castIron, motorGroup, [mx, -0.2, mz]);
    add(new THREE.CylinderGeometry(0.06, 0.06, 0.5, 10), steel, motorGroup, [mx, -0.15, mz]);
  }

  // In-line motor cylinder and casing (Fig. 1 / claim 1).
  add(new THREE.BoxGeometry(1.8, 1.2, 1.5), castIron, motorGroup, [0, 0.2, 0]);
  // Top cylinder head and valve chest
  add(new THREE.CylinderGeometry(0.65, 0.65, 0.45, 20), castIron, motorGroup, [0, 1.0, 0]);
  add(new THREE.CylinderGeometry(0.2, 0.2, 0.3, 12), brass, motorGroup, [0, 1.35, 0]);

  // Propeller shaft with Pillow Block Bearing Pedestals
  add(
    new THREE.CylinderGeometry(0.14, 0.14, 4.8, 20),
    steel,
    propellerShaftGroup,
    [2.2, 0.15, 0],
  ).rotation.z = Math.PI / 2;

  // Pillow Block Bearing Pedestals supporting the rotating shaft
  for (const bx of [2.2, 3.8]) {
    const pedestal = add(new THREE.BoxGeometry(0.4, 1.4, 0.6), castIron, foundationGroup, [
      bx,
      -0.6,
      0,
    ]);
    const bearingCap = add(
      new THREE.CylinderGeometry(0.28, 0.28, 0.42, 16),
      brass,
      pedestal,
      [0, 0.75, 0],
    );
    bearingCap.rotation.z = Math.PI / 2;
  }

  // Stern 3-Bladed Marine Propeller at the aft end of shaft
  const propHub = add(
    new THREE.CylinderGeometry(0.3, 0.3, 0.4, 16),
    brass,
    propellerShaftGroup,
    [4.6, 0.15, 0],
  );
  propHub.rotation.z = Math.PI / 2;
  for (let b = 0; b < 3; b++) {
    const angle = (b * Math.PI * 2) / 3;
    const blade = add(new THREE.BoxGeometry(0.08, 0.9, 0.35), brass, propellerShaftGroup, [
      4.6,
      0.15 + Math.sin(angle) * 0.5,
      Math.cos(angle) * 0.5,
    ]);
    blade.rotation.x = angle + 0.35;
  }

  // Couplings and clutch
  add(
    new THREE.CylinderGeometry(0.48, 0.48, 0.22, 24),
    brass,
    couplingGroup,
    [0.95, 0.15, 0],
  ).rotation.z = Math.PI / 2;
  add(
    new THREE.CylinderGeometry(0.42, 0.42, 0.22, 24),
    brass,
    couplingGroup,
    [1.25, 0.15, 0],
  ).rotation.z = Math.PI / 2;

  // Reversing disk and intermediate friction disks (Fig. 2 / claim 4).
  for (const x of [0.72, 1.48]) {
    add(new THREE.CylinderGeometry(0.34, 0.34, 0.12, 20), steel, reverseGroup, [
      x,
      0.15,
      0,
    ]).rotation.z = Math.PI / 2;
  }
  add(new THREE.BoxGeometry(0.12, 1.05, 0.12), brass, reverseGroup, [0.72, 0.15, 0]);
  add(new THREE.BoxGeometry(0.12, 1.05, 0.12), brass, reverseGroup, [1.48, 0.15, 0]);
  const thrustRing = add(
    new THREE.TorusGeometry(0.34, 0.08, 12, 24),
    steel,
    thrustGroup,
    [0.52, 0.15, 0],
  );
  thrustRing.rotation.y = Math.PI / 2;

  // Fore/aft cooling pipes and water jacket (claims 7–9).
  add(
    new THREE.CylinderGeometry(0.09, 0.09, 3.5, 12),
    copper,
    coolingGroup,
    [0, 0.9, 0.95],
  ).rotation.z = Math.PI / 2;
  add(
    new THREE.CylinderGeometry(0.09, 0.09, 3.5, 12),
    copper,
    coolingGroup,
    [0, -0.55, 0.95],
  ).rotation.z = Math.PI / 2;
  add(
    new THREE.CylinderGeometry(0.52, 0.52, 0.35, 20),
    copper,
    coolingGroup,
    [0, 0.2, 0.95],
  ).rotation.z = Math.PI / 2;
  add(new THREE.BoxGeometry(0.38, 0.38, 0.38), brass, coolingGroup, [1.35, 0.9, 0.95]);

  // High-pressure holders and low-pressure reservoir (Fig. 5/6, claim 10) with mounting saddles
  add(new THREE.SphereGeometry(0.55, 20, 12), gas, reservoirGroup, [-1.4, -0.85, 0]);
  add(new THREE.BoxGeometry(0.8, 0.55, 0.8), castIron, reservoirGroup, [-1.4, -1.35, 0]);

  add(new THREE.SphereGeometry(0.55, 20, 12), gas, reservoirGroup, [1.1, -0.85, 0]);
  add(new THREE.BoxGeometry(0.8, 0.55, 0.8), castIron, reservoirGroup, [1.1, -1.35, 0]);

  add(new THREE.BoxGeometry(2.4, 0.28, 0.9), gas, reservoirGroup, [0, -1.45, 0]);
  // Reservoir cradle straps
  for (const rx of [-0.8, 0.8]) {
    add(new THREE.BoxGeometry(0.12, 0.4, 1.0), steel, reservoirGroup, [rx, -1.45, 0]);
  }

  return {
    rootGroup,
    motorGroup,
    propellerShaftGroup,
    couplingGroup,
    reverseGroup,
    thrustGroup,
    coolingGroup,
    reservoirGroup,
    dispose: () => {
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) material.dispose();
    },
  };
}

export function updateDaimlerMarineEngineKinematics(
  model: DaimlerMarineEngineModel,
  shaftPosition: number,
  coolingPumpEnabled: number,
) {
  const boundedPosition = Math.max(-1, Math.min(1, shaftPosition));
  const asternEngagement = Math.max(0, -boundedPosition);
  const aheadContact = Math.max(0, boundedPosition);
  model.propellerShaftGroup.position.x = boundedPosition * 0.35;
  model.couplingGroup.position.x = boundedPosition * 0.35;
  model.reverseGroup.scale.set(1, 0.65 + asternEngagement * 0.35, 1);
  model.thrustGroup.scale.setScalar(0.9 + aheadContact * 0.1);
  model.coolingGroup.scale.setScalar(coolingPumpEnabled > 0.5 ? 1 : 0.82);
}
