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
  cylinderLinerSolid: THREE.Mesh;
  cylinderLinerCutaway: THREE.Mesh;
  cylinderJacketSolid: THREE.Mesh;
  cylinderJacketCutaway: THREE.Mesh;
  cylinderHeadSolid: THREE.Mesh;
  cylinderHeadCutaway: THREE.Mesh;
  plungerP: THREE.Group;
  wristPin: THREE.Mesh;
  connectingRod: THREE.Mesh;
  crank: THREE.Group;
  crankPin: THREE.Mesh;
  flywheelRim: THREE.Mesh;
  hopperB: THREE.Group;
  admissionPlugD: THREE.Group;
  airReservoirL: THREE.Group;
  annularSpaceS: THREE.Mesh;
}

const CRANK_CENTER_X = -1.85;
const CRANK_RADIUS = 0.35;
const CONNECTING_ROD_LENGTH = 1.2;
const WRIST_PIN_LOCAL_X = -0.7;

function setBoxBeamBetween(mesh: THREE.Mesh, start: THREE.Vector3, end: THREE.Vector3): void {
  const delta = end.clone().sub(start);
  mesh.position.copy(start).addScaledVector(delta, 0.5);
  mesh.rotation.set(0, 0, Math.atan2(delta.y, delta.x));
  mesh.scale.set(delta.length() / CONNECTING_ROD_LENGTH, 1, 1);
}

export interface DieselEngineMaterials {
  body: THREE.MeshStandardMaterial;
  accent: THREE.MeshStandardMaterial;
  source: THREE.MeshStandardMaterial;
}

export function createDieselEngineMaterials(): DieselEngineMaterials {
  return {
    body: new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.62, metalness: 0.35 }),
    accent: new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.48, metalness: 0.42 }),
    source: new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.62,
      roughness: 0.48,
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

  // ==============================================================
  // 1. Cast-Iron Engine Bedplate & Crankcase Foundation
  // ==============================================================
  const bedplateGroup = new THREE.Group();
  root.add(bedplateGroup);

  // Heavy Foundation Bedplate
  const bedplate = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.4, 2.4), materials.body);
  bedplate.position.set(0, -1.6, 0);
  bedplate.receiveShadow = true;
  bedplateGroup.add(bedplate);

  // Crankcase Housing below cylinder & crank
  const crankcase = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.2, 1.8), materials.body);
  crankcase.position.set(-1.0, -0.8, 0);
  crankcase.castShadow = true;
  bedplateGroup.add(crankcase);

  // Cylinder Support Flange Bolted to Bedplate
  const cylinderBase = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.8, 1.6), materials.body);
  cylinderBase.position.set(0.6, -1.0, 0);
  bedplateGroup.add(cylinderBase);

  // ==============================================================
  // 2. Cylinder C & Working Chamber
  // ==============================================================
  const cylinderC = new THREE.Group();
  cylinderC.name = "CylinderC";
  // The camera approaches from the upper-front side. The source names a
  // cylinder and plunger, so cutaway mode opens that same near quadrant rather
  // than pretending that a translucent solid wall is an inspection window.
  const cutawayThetaStart = 1.45;
  const cutawayThetaLength = Math.PI * 1.33;

  const cylinderLinerSolid = new THREE.Mesh(
    new THREE.CylinderGeometry(1, 1, 2.8, 20, 1, true),
    materials.body,
  );
  cylinderLinerSolid.rotation.z = Math.PI / 2;
  cylinderC.add(cylinderLinerSolid);

  const cylinderLinerCutaway = new THREE.Mesh(
    new THREE.CylinderGeometry(1, 1, 2.8, 20, 1, true, cutawayThetaStart, cutawayThetaLength),
    materials.body,
  );
  cylinderLinerCutaway.rotation.z = Math.PI / 2;
  cylinderLinerCutaway.visible = false;
  cylinderC.add(cylinderLinerCutaway);

  // Cylinder Outer Jacket Wall
  const cylinderJacketSolid = new THREE.Mesh(
    new THREE.CylinderGeometry(1.15, 1.15, 2.6, 24),
    materials.body,
  );
  cylinderJacketSolid.rotation.z = Math.PI / 2;
  cylinderJacketSolid.position.x = 0.2;
  cylinderC.add(cylinderJacketSolid);

  const cylinderJacketCutaway = new THREE.Mesh(
    new THREE.CylinderGeometry(1.15, 1.15, 2.6, 24, 1, true, cutawayThetaStart, cutawayThetaLength),
    materials.body,
  );
  cylinderJacketCutaway.rotation.z = Math.PI / 2;
  cylinderJacketCutaway.position.x = 0.2;
  cylinderJacketCutaway.visible = false;
  cylinderC.add(cylinderJacketCutaway);

  // Cylinder Head End Flange
  const cylinderHeadSolid = new THREE.Mesh(
    new THREE.CylinderGeometry(1.22, 1.22, 0.35, 24),
    materials.body,
  );
  cylinderHeadSolid.rotation.z = Math.PI / 2;
  cylinderHeadSolid.position.x = 1.5;
  cylinderC.add(cylinderHeadSolid);

  const cylinderHeadCutaway = new THREE.Mesh(
    new THREE.CylinderGeometry(
      1.22,
      1.22,
      0.35,
      24,
      1,
      false,
      cutawayThetaStart,
      cutawayThetaLength,
    ),
    materials.body,
  );
  cylinderHeadCutaway.rotation.z = Math.PI / 2;
  cylinderHeadCutaway.position.x = 1.5;
  cylinderHeadCutaway.visible = false;
  cylinderC.add(cylinderHeadCutaway);

  // ==============================================================
  // 3. Plunger P & Connecting Rod Kinematics
  // ==============================================================
  const plungerP = new THREE.Group();
  plungerP.name = "PlungerP";
  const plunger = new THREE.Mesh(
    new THREE.CylinderGeometry(0.82, 0.82, 0.95, 20),
    materials.accent,
  );
  plunger.rotation.z = Math.PI / 2;
  plunger.position.x = -0.65;
  plungerP.add(plunger);

  // Gudgeon Wrist Pin
  const wristPin = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.9, 12), materials.body);
  wristPin.position.set(WRIST_PIN_LOCAL_X, 0, 0);
  wristPin.rotation.x = Math.PI / 2;
  plungerP.add(wristPin);

  // Connecting Rod linking Plunger to Crank Pin
  const conRod = new THREE.Mesh(
    new THREE.BoxGeometry(CONNECTING_ROD_LENGTH, 0.16, 0.18),
    materials.body,
  );
  conRod.name = "ConnectingRod";
  root.add(conRod);

  // ==============================================================
  // 4. Crankshaft, Bearings & Flywheel
  // ==============================================================
  const crank = new THREE.Group();
  crank.name = "Crank";
  crank.position.set(CRANK_CENTER_X, 0, 0);

  // Crank Throw Web
  const crankWeb = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.9, 0.35), materials.body);
  crank.add(crankWeb);

  // Crankpin
  const crankPin = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.14, 0.4, 16),
    materials.accent,
  );
  crankPin.position.set(0, CRANK_RADIUS, 0);
  crankPin.rotation.x = Math.PI / 2;
  crank.add(crankPin);

  // Main Shaft
  const mainShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 2.6, 16), materials.body);
  mainShaft.position.set(0, 0, 0);
  mainShaft.rotation.x = Math.PI / 2;
  crank.add(mainShaft);

  // Heavy Cast-Iron Flywheel
  const flywheelRim = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.16, 12, 32), materials.body);
  flywheelRim.position.z = 1.1;
  flywheelRim.castShadow = true;
  crank.add(flywheelRim);

  // Flywheel Spokes
  for (let s = 0; s < 6; s++) {
    const sAngle = (s * Math.PI * 2) / 6;
    const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.5, 8), materials.body);
    spoke.position.set(Math.cos(sAngle) * 0.75, Math.sin(sAngle) * 0.75, 1.1);
    spoke.rotation.z = sAngle - Math.PI / 2;
    crank.add(spoke);
  }

  // Pillow Block Main Bearings
  for (const bz of [-0.85, 0.85]) {
    const bearing = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.9, 0.35), materials.body);
    bearing.position.set(-1.85, -0.45, bz);
    bedplateGroup.add(bearing);
  }

  // ==============================================================
  // 5. Fuel Hopper B & Admission Plug D
  // ==============================================================
  const hopperB = new THREE.Group();
  hopperB.name = "HopperB";
  hopperB.position.set(0, 1.1, 0);
  hopperB.add(new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.7, 12), materials.accent));

  const hopperCollar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.28, 0.2, 16),
    materials.body,
  );
  hopperCollar.position.y = -0.4;
  hopperB.add(hopperCollar);

  const admissionPlugD = new THREE.Group();
  admissionPlugD.name = "AdmissionPlugD";
  admissionPlugD.position.set(0, 0.55, 0);
  admissionPlugD.add(
    new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.35, 12), materials.accent),
  );

  // ==============================================================
  // 6. Air Reservoir L with Mounting Saddle & Manifold Line
  // ==============================================================
  const airReservoirL = new THREE.Group();
  airReservoirL.name = "AirReservoirL";
  airReservoirL.position.set(1.8, 0.8, 0);
  airReservoirL.add(new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 10), materials.source));

  // Reservoir Support Saddle Stand Bolted to Bedplate
  const reservoirStand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.22, 1.8, 12),
    materials.body,
  );
  reservoirStand.position.set(0, -1.2, 0);
  airReservoirL.add(reservoirStand);

  // High-Pressure Air Injection Pipe connecting L to D
  const airPipeCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(1.3, 0.8, 0),
    new THREE.Vector3(0.7, 1.1, 0),
    new THREE.Vector3(0.15, 0.55, 0),
  );
  const airPipe = new THREE.Mesh(
    new THREE.TubeGeometry(airPipeCurve, 16, 0.045, 8, false),
    materials.accent,
  );
  root.add(airPipe);

  const annularSpaceS = new THREE.Mesh(
    new THREE.TorusGeometry(0.32, 0.07, 8, 20),
    materials.source,
  );
  annularSpaceS.name = "AnnularSpaceS";
  annularSpaceS.position.set(1.0, 0, 0);
  annularSpaceS.rotation.y = Math.PI / 2;

  root.add(cylinderC, plungerP, crank, hopperB, admissionPlugD, airReservoirL, annularSpaceS);

  const nodes: DieselEngineNodes = {
    rootGroup: root,
    cylinderC,
    cylinderLinerSolid,
    cylinderLinerCutaway,
    cylinderJacketSolid,
    cylinderJacketCutaway,
    cylinderHeadSolid,
    cylinderHeadCutaway,
    plungerP,
    wristPin,
    connectingRod: conRod,
    crank,
    crankPin,
    flywheelRim,
    hopperB,
    admissionPlugD,
    airReservoirL,
    annularSpaceS,
  };
  updateDieselEngineKinematics(nodes, 0, false);

  return {
    root,
    nodes,
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

  // Close the slider-crank loop exactly in the crank's XY plane. The grant
  // does not supply dimensions, so these are stable illustrative proportions;
  // the mechanical constraint itself is exact at every rendered phase.
  const crankPin = new THREE.Vector3(0, CRANK_RADIUS, 0)
    .applyAxisAngle(new THREE.Vector3(0, 0, 1), phase)
    .add(new THREE.Vector3(CRANK_CENTER_X, 0, 0));
  const horizontalReach = Math.sqrt(Math.max(CONNECTING_ROD_LENGTH ** 2 - crankPin.y ** 2, 0));
  const wristPin = new THREE.Vector3(crankPin.x + horizontalReach, 0, 0);
  nodes.plungerP.position.x = wristPin.x - WRIST_PIN_LOCAL_X;
  setBoxBeamBetween(nodes.connectingRod, wristPin, crankPin);
  nodes.cylinderLinerSolid.visible = !cutawayMode;
  nodes.cylinderLinerCutaway.visible = cutawayMode;
  nodes.cylinderJacketSolid.visible = !cutawayMode;
  nodes.cylinderJacketCutaway.visible = cutawayMode;
  nodes.cylinderHeadSolid.visible = !cutawayMode;
  nodes.cylinderHeadCutaway.visible = cutawayMode;
  nodes.annularSpaceS.visible = cutawayMode;
}
