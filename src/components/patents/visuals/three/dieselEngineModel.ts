/**
 * Source-bounded procedural placeholder for the held US 542,846 face.
 *
 * The grant names parts C, P, B, D, L, and s, but does not provide a measured
 * prototype, fabrication schedule, or operating telemetry. This model therefore
 * exposes only named source organs and a deterministic illustrative pose.
 */

import * as THREE from "three";

export interface DieselEngineNodes {
  rootGroup: THREE.Group;
  cylinderC: THREE.Group;
  plungerP: THREE.Group;
  crank: THREE.Group;
  hopperB: THREE.Group;
  admissionPlugD: THREE.Group;
  airReservoirL: THREE.Group;
  annularSpaceS: THREE.Mesh;
}

export interface DieselEngineMaterials {
  body: THREE.MeshStandardMaterial;
  accent: THREE.MeshStandardMaterial;
  source: THREE.MeshStandardMaterial;
}

export function createDieselEngineMaterials(): DieselEngineMaterials {
  return {
    body: new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.75, metalness: 0.25 }),
    accent: new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.55, metalness: 0.35 }),
    source: new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.28,
      roughness: 0.8,
    }),
  };
}

export function buildDieselEngineModel(): {
  root: THREE.Group;
  nodes: DieselEngineNodes;
  materials: DieselEngineMaterials;
} {
  const materials = createDieselEngineMaterials();
  const root = new THREE.Group();
  root.name = "DieselSourceOrgans";

  const cylinderC = new THREE.Group();
  cylinderC.name = "CylinderC";
  const cylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(1, 1, 2.8, 20, 1, true),
    materials.body,
  );
  cylinder.rotation.z = Math.PI / 2;
  cylinderC.add(cylinder);

  const plungerP = new THREE.Group();
  plungerP.name = "PlungerP";
  const plunger = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.82, 0.25, 20), materials.accent);
  plunger.rotation.z = Math.PI / 2;
  plunger.position.x = -1.1;
  plungerP.add(plunger);

  const crank = new THREE.Group();
  crank.name = "Crank";
  crank.position.x = -1.65;
  crank.add(new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.08, 8, 20), materials.body));

  const hopperB = new THREE.Group();
  hopperB.name = "HopperB";
  hopperB.position.set(0, 1.1, 0);
  hopperB.add(new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.7, 12), materials.accent));

  const admissionPlugD = new THREE.Group();
  admissionPlugD.name = "AdmissionPlugD";
  admissionPlugD.position.set(0, 0.55, 0);
  admissionPlugD.add(new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.35, 12), materials.accent));

  const airReservoirL = new THREE.Group();
  airReservoirL.name = "AirReservoirL";
  airReservoirL.position.set(1.8, 0.8, 0);
  airReservoirL.add(new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 10), materials.source));

  const annularSpaceS = new THREE.Mesh(
    new THREE.TorusGeometry(0.32, 0.07, 8, 20),
    materials.source,
  );
  annularSpaceS.name = "AnnularSpaceS";
  annularSpaceS.position.set(1.0, 0, 0);
  annularSpaceS.rotation.y = Math.PI / 2;

  root.add(cylinderC, plungerP, crank, hopperB, admissionPlugD, airReservoirL, annularSpaceS);

  return {
    root,
    nodes: { rootGroup: root, cylinderC, plungerP, crank, hopperB, admissionPlugD, airReservoirL, annularSpaceS },
    materials,
  };
}

/** Deterministic pose only; this is not a thermodynamic or dimensional simulation. */
export function updateDieselEngineKinematics(
  nodes: DieselEngineNodes,
  phaseRad: number,
  cutawayMode: boolean,
): void {
  const phase = Number.isFinite(phaseRad) ? phaseRad : 0;
  nodes.crank.rotation.z = phase;
  nodes.plungerP.position.x = -0.12 + Math.sin(phase) * 0.12;
  nodes.annularSpaceS.visible = cutawayMode;
}
