/**
 * dieselEngineModel.ts
 *
 * Ultra-high-fidelity procedural 3D mechanical model for Rudolf Diesel's
 * landmark 1895 internal-combustion engine (US Patent No. 542,846).
 *
 * Faithfully reconstructs the historic 1893–1897 Augsburg prototype (Deutsches Museum):
 * 1. Heavy ribbed cast-iron bedplate and open-front A-frame column with bronze crosshead guides.
 * 2. High-pressure long-stroke cylinder with cooling water jacket, flange bolts, and combustion bowl.
 * 3. Marine-type split-bearing connecting rod, crosshead slipper, and 4-ring trunk piston.
 * 4. Overhead cylinder head with poppet intake/exhaust valves, central blast-air fuel injector, and rocker arms.
 * 5. Side-mounted two-stage blast air compressor pump, intercooler line, and 80-bar forged air flask.
 * 6. Flyball centrifugal governor, fuel metering pump, and 10-foot massive spoked cast-iron flywheel.
 * 7. Real-time kinematic linkage articulation: crankshaft, connecting rod, crosshead, piston, rocker arms, and flyball governor.
 */

import * as THREE from "three";

export interface DieselEngineNodes {
  rootGroup: THREE.Group;
  crankshaftGroup: THREE.Group;
  flywheelGroup: THREE.Group;
  conRodGroup: THREE.Group;
  crossheadGroup: THREE.Group;
  pistonGroup: THREE.Group;
  intakeRocker: THREE.Group;
  exhaustRocker: THREE.Group;
  injectorRocker: THREE.Group;
  intakeValve: THREE.Group;
  exhaustValve: THREE.Group;
  injectorNeedle: THREE.Group;
  flyballGovernor: THREE.Group;
  governorBallsGroup: THREE.Group;
  fuelPumpPlunger: THREE.Group;
  compressorLinkage: THREE.Group;
  flameMesh: THREE.Mesh;
  gasVolumeMesh: THREE.Mesh;
  cylinderJacketMesh: THREE.Mesh;
  cylinderCutawayMesh: THREE.Mesh;
  pressureNeedle: THREE.Mesh;
}

export interface DieselEngineMaterials {
  castIron: THREE.MeshStandardMaterial;
  darkCastIron: THREE.MeshStandardMaterial;
  polishedSteel: THREE.MeshStandardMaterial;
  forgedSteel: THREE.MeshStandardMaterial;
  brass: THREE.MeshStandardMaterial;
  bronze: THREE.MeshStandardMaterial;
  copper: THREE.MeshStandardMaterial;
  paintedGreen: THREE.MeshStandardMaterial;
  flameMat: THREE.MeshStandardMaterial;
  gasMat: THREE.MeshStandardMaterial;
  glassMat: THREE.MeshPhysicalMaterial;
}

export function createDieselEngineMaterials(): DieselEngineMaterials {
  const castIron = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.7,
    metalness: 0.65,
  });

  const darkCastIron = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.8,
    metalness: 0.5,
  });

  const polishedSteel = new THREE.MeshStandardMaterial({
    color: 0xcfd8dc,
    roughness: 0.18,
    metalness: 0.95,
  });

  const forgedSteel = new THREE.MeshStandardMaterial({
    color: 0x78909c,
    roughness: 0.35,
    metalness: 0.9,
  });

  const brass = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.25,
    metalness: 0.85,
  });

  const bronze = new THREE.MeshStandardMaterial({
    color: 0xa8713a,
    roughness: 0.3,
    metalness: 0.8,
  });

  const copper = new THREE.MeshStandardMaterial({
    color: 0xb87333,
    roughness: 0.28,
    metalness: 0.85,
  });

  const paintedGreen = new THREE.MeshStandardMaterial({
    color: 0x1b4332,
    roughness: 0.55,
    metalness: 0.3,
  });

  const flameMat = new THREE.MeshStandardMaterial({
    color: 0xfff7ed,
    emissive: 0xf97316,
    emissiveIntensity: 4.0,
    roughness: 0.1,
    transparent: true,
    opacity: 0.95,
  });

  const gasMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.5,
    transparent: true,
    opacity: 0.45,
    roughness: 0.3,
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.22,
    roughness: 0.05,
    metalness: 0.05,
    transmission: 0.9,
    thickness: 0.4,
  });

  return {
    castIron,
    darkCastIron,
    polishedSteel,
    forgedSteel,
    brass,
    bronze,
    copper,
    paintedGreen,
    flameMat,
    gasMat,
    glassMat,
  };
}

export function buildDieselEngineModel(): {
  root: THREE.Group;
  nodes: DieselEngineNodes;
  materials: DieselEngineMaterials;
} {
  const mats = createDieselEngineMaterials();
  const root = new THREE.Group();
  root.name = "DieselEngineRoot";

  // 1. HEAVY CAST-IRON BEDPLATE & OIL SUMP
  const bedplateGroup = new THREE.Group();
  bedplateGroup.name = "BedplateGroup";

  const baseBox = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.45, 3.4), mats.darkCastIron);
  baseBox.position.set(0, -2.4, 0);
  baseBox.castShadow = true;
  baseBox.receiveShadow = true;
  bedplateGroup.add(baseBox);

  const baseRim = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.15, 3.8), mats.darkCastIron);
  baseRim.position.set(0, -2.55, 0);
  baseRim.receiveShadow = true;
  bedplateGroup.add(baseRim);

  const bossGeo = new THREE.CylinderGeometry(0.16, 0.18, 0.25, 12);
  const boltGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.4, 8);
  const bossPositions = [
    [-3.1, -2.4, -1.5],
    [-3.1, -2.4, 1.5],
    [3.1, -2.4, -1.5],
    [3.1, -2.4, 1.5],
    [0.0, -2.4, -1.5],
    [0.0, -2.4, 1.5],
  ];
  for (const [bx, by, bz] of bossPositions) {
    const boss = new THREE.Mesh(bossGeo, mats.darkCastIron);
    boss.position.set(bx, by, bz);
    const bolt = new THREE.Mesh(boltGeo, mats.polishedSteel);
    bolt.position.set(bx, by + 0.15, bz);
    bedplateGroup.add(boss, bolt);
  }

  // Crankshaft main bearing pedestals
  for (const zOffset of [-0.65, 0.65]) {
    const pedestal = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.9, 0.4), mats.castIron);
    pedestal.position.set(0, -1.95, zOffset);
    pedestal.castShadow = true;

    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 0.42, 16, 1, false, 0, Math.PI),
      mats.castIron,
    );
    cap.rotation.z = Math.PI / 2;
    cap.position.set(0, -1.5, zOffset);

    const oilCup = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.2, 12), mats.brass);
    oilCup.position.set(0, -1.25, zOffset);

    bedplateGroup.add(pedestal, cap, oilCup);
  }
  root.add(bedplateGroup);

  // 2. VERTICAL A-FRAME TRUNK COLUMN WITH CROSSHEAD GUIDES
  const columnGroup = new THREE.Group();
  columnGroup.name = "ColumnGroup";

  for (const sign of [-1, 1]) {
    const colMesh = new THREE.Mesh(new THREE.BoxGeometry(0.45, 2.4, 1.6), mats.castIron);
    colMesh.position.set(sign * 1.05, -0.6, 0);
    colMesh.castShadow = true;

    const rib = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.2, 0.3), mats.castIron);
    rib.position.set(sign * 1.32, -0.6, 0);
    columnGroup.add(colMesh, rib);
  }

  const platform = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.25, 2.0), mats.castIron);
  platform.position.set(0, 0.65, 0);
  platform.castShadow = true;
  columnGroup.add(platform);

  for (const zSign of [-1, 1]) {
    const guideRail = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.8, 0.12), mats.bronze);
    guideRail.position.set(0, -0.5, zSign * 0.45);
    columnGroup.add(guideRail);
  }
  root.add(columnGroup);

  // 3. HIGH-PRESSURE CYLINDER, WATER JACKET & HEAD
  const cylinderGroup = new THREE.Group();
  cylinderGroup.name = "CylinderGroup";

  const jacketGeo = new THREE.CylinderGeometry(0.92, 0.92, 2.6, 28);
  const cylinderJacketMesh = new THREE.Mesh(jacketGeo, mats.paintedGreen);
  cylinderJacketMesh.position.set(0, 2.0, 0);
  cylinderJacketMesh.castShadow = true;
  cylinderGroup.add(cylinderJacketMesh);

  const cutawayGeo = new THREE.CylinderGeometry(
    0.92,
    0.92,
    2.6,
    28,
    1,
    false,
    Math.PI * 0.25,
    Math.PI * 1.5,
  );
  const cylinderCutawayMesh = new THREE.Mesh(cutawayGeo, mats.glassMat);
  cylinderCutawayMesh.position.set(0, 2.0, 0);
  cylinderCutawayMesh.visible = false;
  cylinderGroup.add(cylinderCutawayMesh);

  const baseFlange = new THREE.Mesh(
    new THREE.CylinderGeometry(1.15, 1.15, 0.22, 24),
    mats.castIron,
  );
  baseFlange.position.set(0, 0.78, 0);
  cylinderGroup.add(baseFlange);

  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI * 2) / 8;
    const stud = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.28, 8),
      mats.polishedSteel,
    );
    stud.position.set(Math.cos(angle) * 1.02, 0.9, Math.sin(angle) * 1.02);
    cylinderGroup.add(stud);
  }

  const linerGeo = new THREE.CylinderGeometry(0.72, 0.72, 2.5, 24, 1, true);
  const liner = new THREE.Mesh(linerGeo, mats.polishedSteel);
  liner.position.set(0, 2.0, 0);
  cylinderGroup.add(liner);

  const waterInlet = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.6, 12), mats.copper);
  waterInlet.rotation.z = Math.PI / 2;
  waterInlet.position.set(-1.1, 1.1, 0);

  const waterOutlet = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.6, 12), mats.copper);
  waterOutlet.rotation.z = Math.PI / 2;
  waterOutlet.position.set(-1.1, 2.9, 0);
  cylinderGroup.add(waterInlet, waterOutlet);

  const headMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.12, 1.15, 0.5, 24), mats.castIron);
  headMesh.position.set(0, 3.5, 0);
  headMesh.castShadow = true;
  cylinderGroup.add(headMesh);

  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI * 2) / 8;
    const headBolt = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.35, 8),
      mats.polishedSteel,
    );
    headBolt.position.set(Math.cos(angle) * 0.98, 3.8, Math.sin(angle) * 0.98);
    cylinderGroup.add(headBolt);
  }

  const gasGeo = new THREE.CylinderGeometry(0.7, 0.7, 1.0, 20);
  const gasVolumeMesh = new THREE.Mesh(gasGeo, mats.gasMat);
  gasVolumeMesh.position.set(0, 2.7, 0);
  cylinderGroup.add(gasVolumeMesh);

  const flameGeo = new THREE.SphereGeometry(0.58, 20, 16);
  const flameMesh = new THREE.Mesh(flameGeo, mats.flameMat);
  flameMesh.position.set(0, 3.15, 0);
  flameMesh.visible = false;
  cylinderGroup.add(flameMesh);

  root.add(cylinderGroup);

  // 4. OVERHEAD VALVETRAIN, BLAST-AIR INJECTOR & ROCKER ARMS
  const valvetrainGroup = new THREE.Group();
  valvetrainGroup.name = "ValvetrainGroup";

  const rockerStand = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.7, 1.2), mats.castIron);
  rockerStand.position.set(0.4, 4.0, 0);
  const rockerShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.045, 1.4, 12),
    mats.polishedSteel,
  );
  rockerShaft.rotation.x = Math.PI / 2;
  rockerShaft.position.set(0.4, 4.3, 0);
  valvetrainGroup.add(rockerStand, rockerShaft);

  // Intake Valve
  const intakeValve = new THREE.Group();
  intakeValve.name = "IntakeValve";
  const intakeStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.8, 10),
    mats.polishedSteel,
  );
  const intakeSpring = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.09, 0.45, 12),
    mats.darkCastIron,
  );
  const intakeDisc = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.22, 0.06, 16),
    mats.polishedSteel,
  );
  intakeStem.position.set(0, 4.0, -0.42);
  intakeSpring.position.set(0, 4.05, -0.42);
  intakeDisc.position.set(0, 3.65, -0.42);
  intakeValve.add(intakeStem, intakeSpring, intakeDisc);
  valvetrainGroup.add(intakeValve);

  const intakeRocker = new THREE.Group();
  intakeRocker.position.set(0.4, 4.3, -0.42);
  const intakeArm = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 0.08), mats.forgedSteel);
  intakeArm.position.set(-0.2, 0, 0);
  intakeRocker.add(intakeArm);
  valvetrainGroup.add(intakeRocker);

  // Exhaust Valve
  const exhaustValve = new THREE.Group();
  exhaustValve.name = "ExhaustValve";
  const exhaustStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.8, 10),
    mats.polishedSteel,
  );
  const exhaustSpring = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.09, 0.45, 12),
    mats.darkCastIron,
  );
  const exhaustDisc = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.22, 0.06, 16),
    mats.polishedSteel,
  );
  exhaustStem.position.set(0, 4.0, 0.42);
  exhaustSpring.position.set(0, 4.05, 0.42);
  exhaustDisc.position.set(0, 3.65, 0.42);
  exhaustValve.add(exhaustStem, exhaustSpring, exhaustDisc);
  valvetrainGroup.add(exhaustValve);

  const exhaustPipe = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.14, 1.2, 16),
    mats.castIron,
  );
  exhaustPipe.rotation.x = Math.PI / 2;
  exhaustPipe.position.set(-0.6, 3.7, 0.9);
  valvetrainGroup.add(exhaustPipe);

  const exhaustRocker = new THREE.Group();
  exhaustRocker.position.set(0.4, 4.3, 0.42);
  const exhaustArm = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 0.08), mats.forgedSteel);
  exhaustArm.position.set(-0.2, 0, 0);
  exhaustRocker.add(exhaustArm);
  valvetrainGroup.add(exhaustRocker);

  // Injector Valve
  const injectorGroup = new THREE.Group();
  injectorGroup.name = "InjectorGroup";
  const injectorBody = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.9, 16), mats.brass);
  injectorBody.position.set(0, 4.15, 0);

  const injectorNeedle = new THREE.Group();
  injectorNeedle.name = "InjectorNeedle";
  const needleStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.035, 1.1, 10),
    mats.polishedSteel,
  );
  needleStem.position.set(0, 4.25, 0);
  const needleSpring = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.07, 0.4, 10),
    mats.polishedSteel,
  );
  needleSpring.position.set(0, 4.45, 0);
  injectorNeedle.add(needleStem, needleSpring);

  injectorGroup.add(injectorBody, injectorNeedle);
  valvetrainGroup.add(injectorGroup);

  const injectorRocker = new THREE.Group();
  injectorRocker.position.set(0.4, 4.3, 0);
  const injectorArm = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 0.08), mats.forgedSteel);
  injectorArm.position.set(-0.2, 0, 0);
  injectorRocker.add(injectorArm);
  valvetrainGroup.add(injectorRocker);

  const blastTube = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.6, 8), mats.copper);
  blastTube.rotation.z = Math.PI / 3;
  blastTube.position.set(-0.7, 4.4, 0);
  valvetrainGroup.add(blastTube);

  root.add(valvetrainGroup);

  // 5. PISTON, CROSSHEAD, CONNECTING ROD & CRANKSHAFT
  const pistonGroup = new THREE.Group();
  pistonGroup.name = "PistonGroup";
  pistonGroup.position.set(0, 1.8, 0);

  const pistonBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.7, 0.7, 1.2, 24),
    mats.polishedSteel,
  );
  pistonBody.castShadow = true;
  pistonGroup.add(pistonBody);

  const bowlMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.1, 0.22, 16),
    mats.forgedSteel,
  );
  bowlMesh.position.set(0, 0.5, 0);
  pistonGroup.add(bowlMesh);

  for (let r = 0; r < 4; r++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.705, 0.018, 8, 24), mats.darkCastIron);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, 0.4 - r * 0.12, 0);
    pistonGroup.add(ring);
  }

  const pistonRod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.09, 1.2, 16),
    mats.polishedSteel,
  );
  pistonRod.position.set(0, -0.9, 0);
  pistonGroup.add(pistonRod);
  root.add(pistonGroup);

  const crossheadGroup = new THREE.Group();
  crossheadGroup.name = "CrossheadGroup";
  crossheadGroup.position.set(0, 0.3, 0);

  const crossheadBlock = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.35, 0.8), mats.bronze);
  crossheadBlock.castShadow = true;
  const gudgeonPin = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.07, 0.92, 16),
    mats.polishedSteel,
  );
  gudgeonPin.rotation.x = Math.PI / 2;
  crossheadGroup.add(crossheadBlock, gudgeonPin);
  root.add(crossheadGroup);

  const conRodGroup = new THREE.Group();
  conRodGroup.name = "ConRodGroup";
  conRodGroup.position.set(0, 0.3, 0);

  const rodShank = new THREE.Mesh(
    new THREE.CylinderGeometry(0.075, 0.09, 2.2, 16),
    mats.forgedSteel,
  );
  rodShank.position.set(0, -1.1, 0);
  rodShank.castShadow = true;

  const bigEndBearing = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.32, 16),
    mats.brass,
  );
  bigEndBearing.rotation.x = Math.PI / 2;
  bigEndBearing.position.set(0, -2.2, 0);

  const capBolts = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.08, 0.36), mats.polishedSteel);
  capBolts.position.set(0, -2.3, 0);

  conRodGroup.add(rodShank, bigEndBearing, capBolts);
  root.add(conRodGroup);

  const crankshaftGroup = new THREE.Group();
  crankshaftGroup.name = "CrankshaftGroup";
  crankshaftGroup.position.set(0, -1.65, 0);

  const mainShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 2.4, 20),
    mats.polishedSteel,
  );
  mainShaft.rotation.x = Math.PI / 2;
  crankshaftGroup.add(mainShaft);

  for (const zSign of [-0.22, 0.22]) {
    const web = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.1, 0.14), mats.forgedSteel);
    web.position.set(0, 0.1, zSign);

    const counterweight = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.5, 0.16), mats.darkCastIron);
    counterweight.position.set(0, -0.4, zSign);
    crankshaftGroup.add(web, counterweight);
  }

  const crankPin = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.11, 0.38, 16),
    mats.polishedSteel,
  );
  crankPin.rotation.x = Math.PI / 2;
  crankPin.position.set(0, 0.55, 0);
  crankshaftGroup.add(crankPin);

  root.add(crankshaftGroup);

  // 6. 10-FOOT MASSIVE CAST-IRON FLYWHEEL
  const flywheelGroup = new THREE.Group();
  flywheelGroup.name = "FlywheelGroup";
  flywheelGroup.position.set(0, -1.65, 1.6);

  const flywheelRadius = 2.6;

  const rimMesh = new THREE.Mesh(
    new THREE.TorusGeometry(flywheelRadius, 0.24, 16, 48),
    mats.darkCastIron,
  );
  rimMesh.castShadow = true;
  flywheelGroup.add(rimMesh);

  const hubMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.45, 20), mats.castIron);
  hubMesh.rotation.x = Math.PI / 2;
  hubMesh.castShadow = true;
  flywheelGroup.add(hubMesh);

  for (let s = 0; s < 6; s++) {
    const angle = (s * Math.PI * 2) / 6;
    const spoke = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.13, flywheelRadius - 0.35, 12),
      mats.castIron,
    );
    spoke.position.set(
      (Math.cos(angle) * (flywheelRadius - 0.2)) / 2,
      (Math.sin(angle) * (flywheelRadius - 0.2)) / 2,
      0,
    );
    spoke.rotation.z = angle + Math.PI / 2;
    flywheelGroup.add(spoke);
  }

  for (let b = 0; b < 12; b++) {
    const bAngle = (b * Math.PI * 2) / 12;
    const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.1, 8), mats.darkCastIron);
    hole.position.set(Math.cos(bAngle) * flywheelRadius, Math.sin(bAngle) * flywheelRadius, 0.18);
    flywheelGroup.add(hole);
  }
  root.add(flywheelGroup);

  // 7. TWO-STAGE BLAST AIR COMPRESSOR & 80-BAR STORAGE FLASK
  const auxGroup = new THREE.Group();
  auxGroup.name = "AuxiliaryGroup";

  const compPump = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, 1.2, 16),
    mats.paintedGreen,
  );
  compPump.position.set(1.4, -0.6, -0.6);
  compPump.castShadow = true;

  const compHighStage = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.6, 12), mats.brass);
  compHighStage.position.set(1.4, 0.15, -0.6);

  const compressorLinkage = new THREE.Group();
  compressorLinkage.name = "CompressorLinkage";
  const beam = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.06), mats.forgedSteel);
  beam.position.set(0.9, -0.4, -0.5);
  compressorLinkage.add(beam);

  auxGroup.add(compPump, compHighStage, compressorLinkage);

  const flaskGroup = new THREE.Group();
  flaskGroup.position.set(-2.2, -0.6, -1.2);

  const flaskBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.38, 2.4, 20),
    mats.paintedGreen,
  );
  flaskBody.castShadow = true;
  const flaskDomeTop = new THREE.Mesh(
    new THREE.SphereGeometry(0.38, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    mats.paintedGreen,
  );
  flaskDomeTop.position.set(0, 1.2, 0);

  const flaskBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.45, 0.45, 0.15, 16),
    mats.darkCastIron,
  );
  flaskBase.position.set(0, -1.2, 0);

  const gaugeHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.08, 16), mats.brass);
  gaugeHousing.rotation.x = Math.PI / 2;
  gaugeHousing.position.set(0, 1.45, 0.35);

  const gaugeFace = new THREE.Mesh(new THREE.CircleGeometry(0.12, 16), mats.polishedSteel);
  gaugeFace.position.set(0, 1.45, 0.4);

  const pressureNeedle = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.09, 0.01), mats.flameMat);
  pressureNeedle.position.set(0, 1.48, 0.41);

  const handwheel = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.025, 8, 16), mats.brass);
  handwheel.rotation.x = Math.PI / 2;
  handwheel.position.set(0, 1.7, 0);

  flaskGroup.add(
    flaskBody,
    flaskDomeTop,
    flaskBase,
    gaugeHousing,
    gaugeFace,
    pressureNeedle,
    handwheel,
  );
  auxGroup.add(flaskGroup);

  const copperPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.8, 12), mats.copper);
  copperPipe.rotation.z = Math.PI / 2.5;
  copperPipe.position.set(-0.4, 0.2, -1.0);
  auxGroup.add(copperPipe);

  root.add(auxGroup);

  // 8. CENTRIFUGAL FLYBALL GOVERNOR & FUEL METERING PUMP
  const governorGroup = new THREE.Group();
  governorGroup.name = "GovernorGroup";
  governorGroup.position.set(-1.4, 0.2, 0.8);

  const govStand = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.4, 12), mats.castIron);
  govStand.position.set(0, 0, 0);

  const flyballGovernor = new THREE.Group();
  flyballGovernor.name = "FlyballGovernor";
  flyballGovernor.position.set(0, 0.5, 0);

  const governorBallsGroup = new THREE.Group();
  governorBallsGroup.name = "GovernorBallsGroup";

  for (const bSign of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.35, 8), mats.polishedSteel);
    arm.rotation.z = bSign * 0.55;
    arm.position.set(bSign * 0.12, -0.08, 0);

    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 10), mats.brass);
    ball.position.set(bSign * 0.22, -0.22, 0);
    governorBallsGroup.add(arm, ball);
  }
  flyballGovernor.add(governorBallsGroup);
  governorGroup.add(govStand, flyballGovernor);

  const fuelPumpBlock = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.25), mats.bronze);
  fuelPumpBlock.position.set(-1.4, -0.5, 0.8);

  const fuelPumpPlunger = new THREE.Group();
  fuelPumpPlunger.name = "FuelPumpPlunger";
  const plunger = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8),
    mats.polishedSteel,
  );
  plunger.position.set(-1.4, -0.3, 0.8);
  fuelPumpPlunger.add(plunger);

  root.add(governorGroup, fuelPumpBlock, fuelPumpPlunger);

  return {
    root,
    nodes: {
      rootGroup: root,
      crankshaftGroup,
      flywheelGroup,
      conRodGroup,
      crossheadGroup,
      pistonGroup,
      intakeRocker,
      exhaustRocker,
      injectorRocker,
      intakeValve,
      exhaustValve,
      injectorNeedle,
      flyballGovernor,
      governorBallsGroup,
      fuelPumpPlunger,
      compressorLinkage,
      flameMesh,
      gasVolumeMesh,
      cylinderJacketMesh,
      cylinderCutawayMesh,
      pressureNeedle,
    },
    materials: mats,
  };
}

export function updateDieselEngineKinematics(
  nodes: DieselEngineNodes,
  materials: DieselEngineMaterials,
  crankAngleRad: number,
  compressionRatio: number,
  isAutoIgnition: boolean,
  cutawayMode: boolean,
  engineRpm: number,
) {
  const crankR = 0.55;
  const rodLen = 2.2;

  const pinX = Math.cos(crankAngleRad - Math.PI / 2) * crankR;
  const pinY = Math.sin(crankAngleRad - Math.PI / 2) * crankR - 1.65;

  const crossheadY = pinY + Math.sqrt(Math.max(0.1, rodLen ** 2 - pinX ** 2));
  nodes.crossheadGroup.position.y = crossheadY;

  const pistonY = crossheadY + 1.5;
  nodes.pistonGroup.position.y = pistonY;

  nodes.conRodGroup.position.set(0, crossheadY, 0);
  const rodAngle = Math.atan2(pinX, crossheadY - pinY);
  nodes.conRodGroup.rotation.z = -rodAngle;

  nodes.crankshaftGroup.rotation.z = crankAngleRad;
  nodes.flywheelGroup.rotation.z = crankAngleRad;

  const cycleAngle = (crankAngleRad * 0.5) % (Math.PI * 2);

  const isIntake = cycleAngle >= 0 && cycleAngle < Math.PI * 0.5;
  const intakeLift = isIntake ? Math.sin((cycleAngle / (Math.PI * 0.5)) * Math.PI) * 0.15 : 0;
  nodes.intakeValve.position.y = -intakeLift;
  nodes.intakeRocker.rotation.z = intakeLift * 1.5;

  const isCompression = cycleAngle >= Math.PI * 0.5 && cycleAngle < Math.PI;
  const compProgress = (cycleAngle - Math.PI * 0.5) / (Math.PI * 0.5);

  const isInjection = cycleAngle >= Math.PI && cycleAngle < Math.PI * 1.18;
  const injectionLift = isInjection
    ? Math.sin(((cycleAngle - Math.PI) / (Math.PI * 0.18)) * Math.PI) * 0.12
    : 0;
  nodes.injectorNeedle.position.y = injectionLift;
  nodes.injectorRocker.rotation.z = injectionLift * 1.8;

  const isExhaust = cycleAngle >= Math.PI * 1.5 && cycleAngle < Math.PI * 2;
  const exhaustLift = isExhaust
    ? Math.sin(((cycleAngle - Math.PI * 1.5) / (Math.PI * 0.5)) * Math.PI) * 0.15
    : 0;
  nodes.exhaustValve.position.y = -exhaustLift;
  nodes.exhaustRocker.rotation.z = exhaustLift * 1.5;

  if (isInjection && isAutoIgnition) {
    nodes.flameMesh.visible = true;
    const pulse = Math.sin(((cycleAngle - Math.PI) / (Math.PI * 0.18)) * Math.PI);
    nodes.flameMesh.scale.setScalar(0.7 + pulse * 0.6);
    materials.flameMat.emissiveIntensity = 3.0 + pulse * 3.0;
  } else {
    nodes.flameMesh.visible = false;
  }

  const gasTopY = 3.4;
  const gasHeight = Math.max(0.18, gasTopY - (pistonY + 0.5));
  nodes.gasVolumeMesh.scale.set(1.0, gasHeight, 1.0);
  nodes.gasVolumeMesh.position.y = gasTopY - gasHeight * 0.5;

  if (isCompression) {
    const heatColor = new THREE.Color().lerpColors(
      new THREE.Color(0x38bdf8),
      new THREE.Color(0xf97316),
      compProgress,
    );
    materials.gasMat.color = heatColor;
    materials.gasMat.emissive = heatColor;
    materials.gasMat.emissiveIntensity = 0.2 + compProgress * 1.8;
  } else if (isInjection) {
    materials.gasMat.color = new THREE.Color(0xfef08a);
    materials.gasMat.emissive = new THREE.Color(0xf97316);
    materials.gasMat.emissiveIntensity = 2.5;
  } else if (isExhaust) {
    materials.gasMat.color = new THREE.Color(0x64748b);
    materials.gasMat.emissive = new THREE.Color(0x334155);
    materials.gasMat.emissiveIntensity = 0.1;
  } else {
    materials.gasMat.color = new THREE.Color(0x38bdf8);
    materials.gasMat.emissive = new THREE.Color(0x0284c7);
    materials.gasMat.emissiveIntensity = 0.3;
  }

  nodes.cylinderJacketMesh.visible = !cutawayMode;
  nodes.cylinderCutawayMesh.visible = cutawayMode;

  nodes.compressorLinkage.rotation.z = Math.sin(crankAngleRad) * 0.18;

  nodes.flyballGovernor.rotation.y = crankAngleRad * 2.0;
  const ballSpread = Math.min(1.4, Math.max(0.4, (engineRpm / 150) * 0.85));
  nodes.governorBallsGroup.scale.set(ballSpread, 1.0, ballSpread);

  nodes.fuelPumpPlunger.position.y = Math.sin(cycleAngle * 2) * 0.08;

  const pBar = isCompression ? 1 + compProgress * (compressionRatio * 2.2) : isInjection ? 45 : 1.5;
  nodes.pressureNeedle.rotation.z = -(pBar / 80) * (Math.PI * 1.4);
}
