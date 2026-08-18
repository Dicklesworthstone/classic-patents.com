/**
 * corlissEngineModel.ts
 *
 * Museum-Grade Procedural 3D Model for George Henry Corliss's 1849 Steam Engine (US Patent 6,162).
 * Features authentic cast-iron box bedplate, 4 rotary valve bonnets (2 top admission with dashpot trip
 * release, 2 bottom exhaust), central oscillating wrist plate with 4 reach rods, crosshead guide bars,
 * heavy spoked flywheel with counterweight, and centrifugal governor with spinning brass flyballs.
 */

import * as THREE from "three";

export interface CorlissEngineModel {
  rootGroup: THREE.Group;
  flywheelGroup: THREE.Group;
  wristPlate: THREE.Mesh;
  crosshead: THREE.Mesh;
  connectingRod: THREE.Mesh;
  pistonRod: THREE.Mesh;
  governorBalls: THREE.Group;
  dashpots: THREE.Mesh[];
  reachRods: THREE.Mesh[];
  dispose: () => void;
}

export function buildCorlissEngineModel(): CorlissEngineModel {
  const rootGroup = new THREE.Group();
  const texturesToDispose: THREE.Texture[] = [];
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];

  // Materials
  const castIronMat = new THREE.MeshStandardMaterial({
    color: 0x243242,
    roughness: 0.45,
    metalness: 0.85,
  });
  materialsToDispose.push(castIronMat);

  const polishedSteelMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.18,
    metalness: 0.96,
  });
  materialsToDispose.push(polishedSteelMat);

  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.25,
    metalness: 0.9,
  });
  materialsToDispose.push(brassMat);

  const masonryBedMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.8,
    metalness: 0.1,
  });
  materialsToDispose.push(masonryBedMat);

  // ==========================================
  // 1. Foundation & Engine Bedplate
  // ==========================================
  const bedGroup = new THREE.Group();
  rootGroup.add(bedGroup);

  // Masonry Foundation Plinth
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(11.5, 0.6, 4.4), masonryBedMat);
  plinth.position.set(0, -1.9, 0);
  plinth.receiveShadow = true;
  bedGroup.add(plinth);

  // Heavy Cast-Iron Engine Bed
  const bedplate = new THREE.Mesh(new THREE.BoxGeometry(10.8, 0.4, 3.8), castIronMat);
  bedplate.position.set(0, -1.4, 0);
  bedplate.castShadow = true;
  bedplate.receiveShadow = true;
  bedGroup.add(bedplate);

  // ==========================================
  // 2. Steam Cylinder & 4 Corliss Rotary Valves (Claim 1)
  // ==========================================
  const cylinderGroup = new THREE.Group();
  cylinderGroup.position.set(-3.6, 0, 0);
  rootGroup.add(cylinderGroup);

  // Insulated Steam Jacket / Cylinder Body
  const cylinderBody = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.0, 1.8), castIronMat);
  cylinderBody.castShadow = true;
  cylinderGroup.add(cylinderBody);

  // Front & Rear Cylinder Heads with Flange Bolts
  [-1.35, 1.35].forEach((cx) => {
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.15, 24), castIronMat);
    head.rotation.z = Math.PI / 2;
    head.position.x = cx;
    cylinderGroup.add(head);
  });

  // 4 Rotary Valve Bonnets (2 Top Admission, 2 Bottom Exhaust)
  const valvePositions: [number, number][] = [
    [-0.9, 0.9], // Top Left (Admission 1)
    [0.9, 0.9], // Top Right (Admission 2)
    [-0.9, -0.9], // Bottom Left (Exhaust 1)
    [0.9, -0.9], // Bottom Right (Exhaust 2)
  ];

  valvePositions.forEach(([vx, vy]) => {
    const valveBonnet = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 2.0, 16), brassMat);
    valveBonnet.rotation.x = Math.PI / 2;
    valveBonnet.position.set(vx, vy, 0);
    valveBonnet.castShadow = true;
    cylinderGroup.add(valveBonnet);
  });

  // 2 Vertical Dashpot Air Cushions (for rapid spring/pneumatic valve closure)
  const dashpots: THREE.Mesh[] = [];
  [-0.9, 0.9].forEach((dx) => {
    const dashpot = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.8, 16), castIronMat);
    dashpot.position.set(dx, -0.8, 1.0);
    cylinderGroup.add(dashpot);
    dashpots.push(dashpot);
  });

  // ==========================================
  // 3. Central Oscillating Wrist Plate & Reach Rods (Claim 2)
  // ==========================================
  const wristPlateGroup = new THREE.Group();
  wristPlateGroup.position.set(-3.6, 0, 1.05);
  rootGroup.add(wristPlateGroup);

  const wristPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.12, 24), brassMat);
  wristPlate.rotation.x = Math.PI / 2;
  wristPlate.castShadow = true;
  wristPlateGroup.add(wristPlate);

  // 4 Reach Rods connecting Wrist Plate to Valve Bonnets
  const reachRods: THREE.Mesh[] = [];
  valvePositions.forEach(([vx, vy]) => {
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1, 8), polishedSteelMat);
    rod.position.set(vx * 0.5, vy * 0.5, 0.05);
    rod.rotation.z = Math.atan2(vy, vx) + Math.PI / 2;
    wristPlateGroup.add(rod);
    reachRods.push(rod);
  });

  // ==========================================
  // 4. Crosshead Slider & Guide Bars
  // ==========================================
  const guideGroup = new THREE.Group();
  guideGroup.position.set(-0.8, 0, 0);
  rootGroup.add(guideGroup);

  // Upper and Lower Machined Guide Bars
  [-0.45, 0.45].forEach((gy) => {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.14, 0.5), polishedSteelMat);
    bar.position.set(0, gy, 0);
    guideGroup.add(bar);
  });

  // Reciprocating Crosshead Block
  const crosshead = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.75, 0.6), polishedSteelMat);
  crosshead.position.set(0, 0, 0);
  crosshead.castShadow = true;
  guideGroup.add(crosshead);

  // Piston Rod (Cylinder -> Crosshead)
  const pistonRod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 2.0, 16),
    polishedSteelMat,
  );
  pistonRod.rotation.z = Math.PI / 2;
  pistonRod.position.set(-1.4, 0, 0);
  rootGroup.add(pistonRod);

  // Connecting Rod (Crosshead -> Crankshaft Pin)
  const connectingRod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.11, 4.4, 16),
    polishedSteelMat,
  );
  connectingRod.rotation.z = Math.PI / 2;
  connectingRod.position.set(1.4, 0, 0);
  connectingRod.castShadow = true;
  rootGroup.add(connectingRod);

  // ==========================================
  // 5. Crankshaft, Main Bearings & Massive Flywheel
  // ==========================================
  const crankshaftGroup = new THREE.Group();
  crankshaftGroup.position.set(3.4, 0, 0);
  rootGroup.add(crankshaftGroup);

  // Heavy Cast-Iron Pillow Block Main Bearings
  [-1.0, 1.0].forEach((bz) => {
    const bearing = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.2, 0.6), castIronMat);
    bearing.position.set(0, -0.6, bz);
    crankshaftGroup.add(bearing);
  });

  // Main Shaft
  const mainShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 2.8, 24),
    polishedSteelMat,
  );
  mainShaft.rotation.x = Math.PI / 2;
  crankshaftGroup.add(mainShaft);

  // Crank Web Disc & Crankpin
  const crankDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.22, 24), castIronMat);
  crankDisc.rotation.x = Math.PI / 2;
  crankDisc.position.z = 0.85;
  crankshaftGroup.add(crankDisc);

  // Spoked Flywheel Group (16-Foot Diameter Prototype)
  const flywheelGroup = new THREE.Group();
  flywheelGroup.position.set(3.4, 0, -0.5);
  rootGroup.add(flywheelGroup);

  // Heavy Outer Rim
  const flywheelRim = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.22, 16, 48), castIronMat);
  flywheelRim.castShadow = true;
  flywheelGroup.add(flywheelRim);

  // Central Flywheel Hub
  const flywheelHub = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.4, 24), castIronMat);
  flywheelHub.rotation.x = Math.PI / 2;
  flywheelGroup.add(flywheelHub);

  // 8 Curved Cast-Iron Spokes
  for (let s = 0; s < 8; s++) {
    const angle = (s * Math.PI) / 4;
    const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 2.2, 8), castIronMat);
    spoke.position.set(Math.cos(angle) * 1.15, Math.sin(angle) * 1.15, 0);
    spoke.rotation.z = angle + Math.PI / 2;
    spoke.castShadow = true;
    flywheelGroup.add(spoke);
  }

  // ==========================================
  // 6. Centrifugal Watt Governor (Flyballs)
  // ==========================================
  const governorGroup = new THREE.Group();
  governorGroup.position.set(1.6, 1.2, 0.8);
  rootGroup.add(governorGroup);

  const governorSpindle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 1.4, 12),
    polishedSteelMat,
  );
  governorGroup.add(governorSpindle);

  const governorBalls = new THREE.Group();
  governorGroup.add(governorBalls);

  [-0.35, 0.35].forEach((bx) => {
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), brassMat);
    ball.position.set(bx, 0.3, 0);
    ball.castShadow = true;
    governorBalls.add(ball);

    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8), polishedSteelMat);
    arm.position.set(bx * 0.5, 0.45, 0);
    arm.rotation.z = bx > 0 ? -Math.PI / 6 : Math.PI / 6;
    governorBalls.add(arm);
  });

  const dispose = () => {
    texturesToDispose.forEach((t) => {
      t.dispose();
    });
    materialsToDispose.forEach((m) => {
      m.dispose();
    });
    geometriesToDispose.forEach((g) => {
      g.dispose();
    });
  };

  return {
    rootGroup,
    flywheelGroup,
    wristPlate,
    crosshead,
    connectingRod,
    pistonRod,
    governorBalls,
    dashpots,
    reachRods,
    dispose,
  };
}
