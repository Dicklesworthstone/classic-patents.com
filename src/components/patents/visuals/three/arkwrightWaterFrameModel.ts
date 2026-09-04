import * as THREE from "three";
import type { ArkwrightKinematicPhases } from "@/physics/arkwrightKernel";

export interface ArkwrightWaterFrameModelNodes {
  root: THREE.Group;
  wheelGroup: THREE.Group;
  shaftGroup: THREE.Group;
  feedRollersGroup: THREE.Group;
  intermediateRollerOneGroup: THREE.Group;
  intermediateRollerTwoGroup: THREE.Group;
  deliveryRollersGroup: THREE.Group;
  feedLowerRollers: THREE.Group[];
  feedUpperRollers: THREE.Group[];
  intermediateOneLowerRollers: THREE.Group[];
  intermediateOneUpperRollers: THREE.Group[];
  intermediateTwoLowerRollers: THREE.Group[];
  intermediateTwoUpperRollers: THREE.Group[];
  deliveryLowerRollers: THREE.Group[];
  deliveryUpperRollers: THREE.Group[];
  wheelBevelRotor: THREE.Group;
  shaftBevelRotor: THREE.Group;
  rollerDriveRotors: THREE.Group[];
  spindleDriveRotors: THREE.Group[];
  flyerGroups: THREE.Group[];
  bobbinGroups: THREE.Group[];
  traverseRailGroup: THREE.Group;
  camGroup: THREE.Group;
  calloutGroup: THREE.Group;
  setCutaway: (cutaway: boolean) => void;
  setCalloutsVisible: (visible: boolean) => void;
  updateAnimation: (phases: ArkwrightKinematicPhases) => void;
  dispose: () => void;
}

export function buildArkwrightWaterFrameModel(): ArkwrightWaterFrameModelNodes {
  const root = new THREE.Group();
  root.name = "arkwright-water-frame-root";

  const disposables: Array<{ dispose: () => void }> = [];

  // ==================== PROCEDURAL MATERIALS ====================
  const oakMaterial = new THREE.MeshStandardMaterial({
    color: 0x8c5e35,
    roughness: 0.75,
    metalness: 0.05,
  });
  disposables.push(oakMaterial);

  const darkOakMaterial = new THREE.MeshStandardMaterial({
    color: 0x5c3d22,
    roughness: 0.85,
    metalness: 0.05,
  });
  disposables.push(darkOakMaterial);

  const ironMaterial = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.45,
    metalness: 0.8,
  });
  disposables.push(ironMaterial);

  const brassMaterial = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.35,
    metalness: 0.85,
  });
  disposables.push(brassMaterial);

  const steelMaterial = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.25,
    metalness: 0.9,
  });
  disposables.push(steelMaterial);

  const leatherMaterial = new THREE.MeshStandardMaterial({
    color: 0xc29b74,
    roughness: 0.6,
    metalness: 0.1,
  });
  disposables.push(leatherMaterial);

  const leadWeightMaterial = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.7,
    metalness: 0.6,
  });
  disposables.push(leadWeightMaterial);

  const cottonYarnMaterial = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    roughness: 0.9,
    metalness: 0.0,
  });
  disposables.push(cottonYarnMaterial);

  // ==================== 1. TIMBER STAND & FRAMING ====================
  const frameGroup = new THREE.Group();
  frameGroup.name = "timber-frame";
  root.add(frameGroup);

  // Base plinth beams
  const baseGeom = new THREE.BoxGeometry(1.4, 0.08, 0.7);
  disposables.push(baseGeom);
  const baseMesh = new THREE.Mesh(baseGeom, darkOakMaterial);
  baseMesh.position.set(0, 0.04, 0);
  frameGroup.add(baseMesh);

  // 4 Corner vertical oak posts
  const postGeom = new THREE.BoxGeometry(0.08, 1.3, 0.08);
  disposables.push(postGeom);
  const postPositions = [
    [-0.6, 0.69, -0.28],
    [0.6, 0.69, -0.28],
    [-0.6, 0.69, 0.28],
    [0.6, 0.69, 0.28],
  ];
  for (const pos of postPositions) {
    const post = new THREE.Mesh(postGeom, oakMaterial);
    post.position.set(pos[0], pos[1], pos[2]);
    frameGroup.add(post);
  }

  // Top header beam & cross-rails
  const topHeaderGeom = new THREE.BoxGeometry(1.36, 0.06, 0.64);
  disposables.push(topHeaderGeom);
  const topHeader = new THREE.Mesh(topHeaderGeom, oakMaterial);
  topHeader.position.set(0, 1.34, 0);
  frameGroup.add(topHeader);

  // Middle drafting support beam (y = 0.85)
  const draftBeamGeom = new THREE.BoxGeometry(1.24, 0.05, 0.25);
  disposables.push(draftBeamGeom);
  const draftBeam = new THREE.Mesh(draftBeamGeom, oakMaterial);
  draftBeam.position.set(0, 0.85, 0);
  frameGroup.add(draftBeam);

  // Lower spindle rail (y = 0.35)
  const spindleRailGeom = new THREE.BoxGeometry(1.24, 0.04, 0.2);
  disposables.push(spindleRailGeom);
  const spindleRail = new THREE.Mesh(spindleRailGeom, oakMaterial);
  spindleRail.position.set(0, 0.35, 0);
  frameGroup.add(spindleRail);

  // ==================== 2. A: CENTRAL DRIVING DRUM / WHEEL ====================
  const wheelGroup = new THREE.Group();
  wheelGroup.name = "driving-drum-A";
  wheelGroup.position.set(0.35, 0.22, 0);
  root.add(wheelGroup);

  // The normalized drum is tangent to the plinth and lower rail instead of
  // passing through both timber members.
  const drumGeom = new THREE.CylinderGeometry(0.13, 0.13, 0.16, 32);
  disposables.push(drumGeom);
  const drumMesh = new THREE.Mesh(drumGeom, darkOakMaterial);
  drumMesh.rotation.x = Math.PI / 2;
  wheelGroup.add(drumMesh);

  // Iron drum axle
  const drumAxleGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.32, 16);
  disposables.push(drumAxleGeom);
  const drumAxle = new THREE.Mesh(drumAxleGeom, ironMaterial);
  drumAxle.rotation.x = Math.PI / 2;
  wheelGroup.add(drumAxle);

  // ==================== 3. B: HORIZONTAL IRON DRIVING SHAFT ====================
  const shaftGroup = new THREE.Group();
  shaftGroup.name = "driving-shaft-B";
  shaftGroup.position.set(0, 0.22, 0.06);
  root.add(shaftGroup);

  const shaftGeom = new THREE.CylinderGeometry(0.015, 0.015, 1.15, 16);
  disposables.push(shaftGeom);
  const shaftMesh = new THREE.Mesh(shaftGeom, ironMaterial);
  shaftMesh.rotation.z = Math.PI / 2;
  shaftGroup.add(shaftMesh);

  // The clutch lever is supported by the frame and does not orbit with the
  // shaft. Keeping it out of shaftGroup prevents the old cage-rotation bug.
  const clutchGeom = new THREE.BoxGeometry(0.04, 0.08, 0.04);
  disposables.push(clutchGeom);
  const clutchMesh = new THREE.Mesh(clutchGeom, brassMaterial);
  clutchMesh.position.set(-0.45, 0.26, 0.06);
  root.add(clutchMesh);

  // Fixed bearing pedestals tie the shaft to the base instead of leaving the
  // complete drive train suspended in space.
  const bearingPedestalGeom = new THREE.BoxGeometry(0.06, 0.14, 0.08);
  const bearingCapGeom = new THREE.BoxGeometry(0.08, 0.06, 0.1);
  disposables.push(bearingPedestalGeom, bearingCapGeom);
  for (const x of [-0.52, 0.52]) {
    const pedestal = new THREE.Mesh(bearingPedestalGeom, darkOakMaterial);
    pedestal.position.set(x, 0.15, 0.06);
    root.add(pedestal);
    const cap = new THREE.Mesh(bearingCapGeom, ironMaterial);
    cap.position.set(x, 0.22, 0.06);
    root.add(cap);
  }

  // ==================== 4. C & D: DIFFERENTIAL DRAFTING ROLLERS ====================
  const feedRollersGroup = new THREE.Group();
  feedRollersGroup.name = "feed-rollers-C1";
  feedRollersGroup.position.set(0, 0.88, -0.09);
  root.add(feedRollersGroup);

  const intermediateRollerOneGroup = new THREE.Group();
  intermediateRollerOneGroup.name = "intermediate-rollers-C2";
  intermediateRollerOneGroup.position.set(0, 0.88, -0.03);
  root.add(intermediateRollerOneGroup);

  const intermediateRollerTwoGroup = new THREE.Group();
  intermediateRollerTwoGroup.name = "intermediate-rollers-C3";
  intermediateRollerTwoGroup.position.set(0, 0.88, 0.03);
  root.add(intermediateRollerTwoGroup);

  const deliveryRollersGroup = new THREE.Group();
  deliveryRollersGroup.name = "delivery-rollers-C4";
  deliveryRollersGroup.position.set(0, 0.88, 0.09);
  root.add(deliveryRollersGroup);

  // 4 Spindle stations along X-axis: -0.36, -0.12, 0.12, 0.36
  const stationX = [-0.36, -0.12, 0.12, 0.36];

  const rollerGeom = new THREE.CylinderGeometry(0.018, 0.018, 0.07, 16);
  disposables.push(rollerGeom);
  const feedLowerRollers: THREE.Group[] = [];
  const feedUpperRollers: THREE.Group[] = [];
  const intermediateOneLowerRollers: THREE.Group[] = [];
  const intermediateOneUpperRollers: THREE.Group[] = [];
  const intermediateTwoLowerRollers: THREE.Group[] = [];
  const intermediateTwoUpperRollers: THREE.Group[] = [];
  const deliveryLowerRollers: THREE.Group[] = [];
  const deliveryUpperRollers: THREE.Group[] = [];

  const rollerAxleGeom = new THREE.CylinderGeometry(0.003, 0.003, 0.92, 10);
  const saddleWireGeom = new THREE.CylinderGeometry(0.002, 0.002, 0.18, 8);
  const weightGeom = new THREE.CylinderGeometry(0.025, 0.025, 0.06, 16);
  disposables.push(rollerAxleGeom, saddleWireGeom, weightGeom);

  for (const group of [
    feedRollersGroup,
    intermediateRollerOneGroup,
    intermediateRollerTwoGroup,
    deliveryRollersGroup,
  ]) {
    const axle = new THREE.Mesh(rollerAxleGeom, ironMaterial);
    axle.name = `${group.name}-continuous-lower-axle`;
    axle.rotation.z = Math.PI / 2;
    axle.position.y = -0.01;
    group.add(axle);
  }

  const createRollerRotor = (
    name: string,
    x: number,
    y: number,
    material: THREE.MeshStandardMaterial,
  ): THREE.Group => {
    const rotor = new THREE.Group();
    rotor.name = name;
    rotor.position.set(x, y, 0);
    const roller = new THREE.Mesh(rollerGeom, material);
    // CylinderGeometry is Y-aligned; this fixed child transform aligns it to
    // the rotor's X axis. Animation then rotates the parent about that axis.
    roller.rotation.z = Math.PI / 2;
    rotor.add(roller);
    return rotor;
  };

  stationX.forEach((x, stationIndex) => {
    // Pair 1: Feed Rollers (Lower fluted brass, upper leather cot)
    const lowerFeed = createRollerRotor(
      `feed-lower-rotor-${stationIndex + 1}`,
      x,
      -0.01,
      brassMaterial,
    );
    feedRollersGroup.add(lowerFeed);
    feedLowerRollers.push(lowerFeed);

    const upperFeed = createRollerRotor(
      `feed-upper-rotor-${stationIndex + 1}`,
      x,
      0.026,
      leatherMaterial,
    );
    feedRollersGroup.add(upperFeed);
    feedUpperRollers.push(upperFeed);

    const lowerIntermediateOne = createRollerRotor(
      `intermediate-one-lower-rotor-${stationIndex + 1}`,
      x,
      -0.01,
      brassMaterial,
    );
    intermediateRollerOneGroup.add(lowerIntermediateOne);
    intermediateOneLowerRollers.push(lowerIntermediateOne);

    const upperIntermediateOne = createRollerRotor(
      `intermediate-one-upper-rotor-${stationIndex + 1}`,
      x,
      0.026,
      leatherMaterial,
    );
    intermediateRollerOneGroup.add(upperIntermediateOne);
    intermediateOneUpperRollers.push(upperIntermediateOne);

    const lowerIntermediateTwo = createRollerRotor(
      `intermediate-two-lower-rotor-${stationIndex + 1}`,
      x,
      -0.01,
      brassMaterial,
    );
    intermediateRollerTwoGroup.add(lowerIntermediateTwo);
    intermediateTwoLowerRollers.push(lowerIntermediateTwo);

    const upperIntermediateTwo = createRollerRotor(
      `intermediate-two-upper-rotor-${stationIndex + 1}`,
      x,
      0.026,
      leatherMaterial,
    );
    intermediateRollerTwoGroup.add(upperIntermediateTwo);
    intermediateTwoUpperRollers.push(upperIntermediateTwo);

    // Pair 4: Delivery Rollers (Accelerating speed)
    const lowerDeliv = createRollerRotor(
      `delivery-lower-rotor-${stationIndex + 1}`,
      x,
      -0.01,
      brassMaterial,
    );
    deliveryRollersGroup.add(lowerDeliv);
    deliveryLowerRollers.push(lowerDeliv);

    const upperDeliv = createRollerRotor(
      `delivery-upper-rotor-${stationIndex + 1}`,
      x,
      0.026,
      leatherMaterial,
    );
    deliveryRollersGroup.add(upperDeliv);
    deliveryUpperRollers.push(upperDeliv);

    // D: each pressure stage keeps its own stationary saddle and deadweight.
    for (const group of [
      feedRollersGroup,
      intermediateRollerOneGroup,
      intermediateRollerTwoGroup,
      deliveryRollersGroup,
    ]) {
      const saddleWire = new THREE.Mesh(saddleWireGeom, ironMaterial);
      saddleWire.position.set(x, -0.08, 0);
      group.add(saddleWire);

      const weightMesh = new THREE.Mesh(weightGeom, leadWeightMaterial);
      weightMesh.position.set(x, -0.16, 0);
      group.add(weightMesh);
    }
  });

  // Source-bounded normalized transmission: four belt planes carry the main
  // shaft's motion to the four drafting stages. The pinned reconstruction
  // withholds tooth counts and pulley diameters, so speed ratios remain owned
  // by the declared kinematic kernel instead of being inferred from these
  // reader-aid members.
  const rollerDriveRotors: THREE.Group[] = [];
  const driveBeltMaterial = new THREE.LineBasicMaterial({ color: 0x6b4423 });
  const drivePulleyGeom = new THREE.CylinderGeometry(0.025, 0.025, 0.018, 20);
  disposables.push(driveBeltMaterial, drivePulleyGeom);
  const rollerStages = [
    feedRollersGroup,
    intermediateRollerOneGroup,
    intermediateRollerTwoGroup,
    deliveryRollersGroup,
  ];
  rollerStages.forEach((stage, stageIndex) => {
    const x = 0.46 + stageIndex * 0.025;

    const shaftPulley = new THREE.Mesh(drivePulleyGeom, ironMaterial);
    shaftPulley.name = `main-shaft-drafting-pulley-${stageIndex + 1}`;
    shaftPulley.rotation.z = Math.PI / 2;
    shaftPulley.position.x = x;
    shaftGroup.add(shaftPulley);

    const stagePulleyRotor = new THREE.Group();
    stagePulleyRotor.name = `drafting-stage-drive-rotor-${stageIndex + 1}`;
    stagePulleyRotor.position.set(x, 0.87, stage.position.z);
    const stagePulley = new THREE.Mesh(drivePulleyGeom, brassMaterial);
    stagePulley.rotation.z = Math.PI / 2;
    stagePulleyRotor.add(stagePulley);
    root.add(stagePulleyRotor);
    rollerDriveRotors.push(stagePulleyRotor);

    const bottomY = 0.22;
    const bottomZ = 0.06;
    const topY = 0.87;
    const topZ = stage.position.z;
    const dy = topY - bottomY;
    const dz = topZ - bottomZ;
    const distance = Math.hypot(dy, dz);
    const offsetY = (-dz / distance) * 0.025;
    const offsetZ = (dy / distance) * 0.025;
    const beltGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x, bottomY + offsetY, bottomZ + offsetZ),
      new THREE.Vector3(x, topY + offsetY, topZ + offsetZ),
      new THREE.Vector3(x, topY - offsetY, topZ - offsetZ),
      new THREE.Vector3(x, bottomY - offsetY, bottomZ - offsetZ),
    ]);
    disposables.push(beltGeometry);
    const belt = new THREE.LineLoop(beltGeometry, driveBeltMaterial);
    belt.name = `continuous-drafting-drive-belt-${stageIndex + 1}`;
    root.add(belt);
  });

  // ==================== 5. E & F: SPINDLES, FLYERS & BOBBINS ====================
  const flyerGroups: THREE.Group[] = [];
  const bobbinGroups: THREE.Group[] = [];
  const spindleDriveRotors: THREE.Group[] = [];
  const spindleDriverBevelGeom = new THREE.CylinderGeometry(0.012, 0.028, 0.035, 16);
  const spindleDrivenBevelGeom = new THREE.CylinderGeometry(0.012, 0.028, 0.035, 16);
  disposables.push(spindleDriverBevelGeom, spindleDrivenBevelGeom);

  // Four continuous roving paths make the material flow physically legible:
  // feed nip -> delivery nip -> flyer guide -> bobbin. They remain stationary
  // centerlines while the rollers and flyers move around them.
  const yarnPathMaterial = new THREE.LineBasicMaterial({
    color: 0xfef08a,
    transparent: true,
    opacity: 0.9,
  });
  disposables.push(yarnPathMaterial);
  const yarnPathGeometries: THREE.BufferGeometry[] = [];
  for (const x of stationX) {
    const pathPoints = [
      new THREE.Vector3(x, 0.88, -0.12),
      new THREE.Vector3(x, 0.88, 0.06),
      new THREE.Vector3(x, 0.72, 0.06),
      new THREE.Vector3(x + 0.045, 0.56, 0.06),
      new THREE.Vector3(x + 0.026, 0.61, 0.06),
    ];
    const pathGeometry = new THREE.BufferGeometry().setFromPoints(pathPoints);
    disposables.push(pathGeometry);
    yarnPathGeometries.push(pathGeometry);
    const yarnPath = new THREE.Line(pathGeometry, yarnPathMaterial);
    yarnPath.name = `continuous-roving-path-${x}`;
    root.add(yarnPath);
  }

  // G: Traversing Rail holding the bobbins (moves up and down)
  const traverseRailGroup = new THREE.Group();
  traverseRailGroup.name = "traverse-rail-G";
  traverseRailGroup.position.set(0, 0.52, 0.06);
  root.add(traverseRailGroup);

  const travRailMesh = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.025, 0.12), oakMaterial);
  traverseRailGroup.add(travRailMesh);

  for (let i = 0; i < 4; i++) {
    const x = stationX[i];

    // Spindle station group
    const spindleStation = new THREE.Group();
    spindleStation.position.set(x, 0, 0.06);
    root.add(spindleStation);

    // Steel Spindle Shaft
    const spindleShaftGeom = new THREE.CylinderGeometry(0.005, 0.005, 0.61, 12);
    disposables.push(spindleShaftGeom);
    const spindleShaft = new THREE.Mesh(spindleShaftGeom, steelMaterial);
    spindleShaft.position.set(0, 0.515, 0);
    spindleStation.add(spindleShaft);

    // Per-station bevel pairs close the power path from horizontal shaft B to
    // each vertical spindle. The driver is a shaft child; the driven member
    // follows the shared spindle phase on its own Y-axis rotor.
    const spindleDriverBevel = new THREE.Mesh(spindleDriverBevelGeom, brassMaterial);
    spindleDriverBevel.name = `spindle-driver-bevel-${i + 1}`;
    spindleDriverBevel.rotation.z = Math.PI / 2;
    spindleDriverBevel.position.x = x;
    shaftGroup.add(spindleDriverBevel);

    const spindleDrivenRotor = new THREE.Group();
    spindleDrivenRotor.name = `spindle-driven-bevel-rotor-${i + 1}`;
    spindleDrivenRotor.position.set(x, 0.245, 0.06);
    const spindleDrivenBevel = new THREE.Mesh(spindleDrivenBevelGeom, brassMaterial);
    spindleDrivenBevel.position.y = -0.018;
    spindleDrivenRotor.add(spindleDrivenBevel);
    root.add(spindleDrivenRotor);
    spindleDriveRotors.push(spindleDrivenRotor);

    // Spindle Whorl (brass pulley at bottom)
    const whorlGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.02, 16);
    disposables.push(whorlGeom);
    const whorl = new THREE.Mesh(whorlGeom, brassMaterial);
    whorl.position.set(0, 0.38, 0);
    spindleStation.add(whorl);

    // E: Revolving Steel Flyer
    const flyerGroup = new THREE.Group();
    flyerGroup.name = `flyer-${i + 1}`;
    flyerGroup.position.set(0, 0.72, 0);
    spindleStation.add(flyerGroup);
    flyerGroups.push(flyerGroup);

    // Flyer U-shaped curved arms
    const flyerTopGeom = new THREE.CylinderGeometry(0.01, 0.01, 0.04, 12);
    disposables.push(flyerTopGeom);
    const flyerTop = new THREE.Mesh(flyerTopGeom, steelMaterial);
    flyerGroup.add(flyerTop);

    const armLeftGeom = new THREE.CylinderGeometry(0.003, 0.003, 0.16, 8);
    disposables.push(armLeftGeom);
    const armLeft = new THREE.Mesh(armLeftGeom, steelMaterial);
    armLeft.position.set(-0.045, -0.08, 0);
    flyerGroup.add(armLeft);

    const armRightGeom = new THREE.CylinderGeometry(0.003, 0.003, 0.16, 8);
    disposables.push(armRightGeom);
    const armRight = new THREE.Mesh(armRightGeom, steelMaterial);
    armRight.position.set(0.045, -0.08, 0);
    flyerGroup.add(armRight);

    // Pigtail eye hooks at tips
    const eyeGeom = new THREE.TorusGeometry(0.006, 0.002, 8, 12);
    disposables.push(eyeGeom);
    const eyeLeft = new THREE.Mesh(eyeGeom, brassMaterial);
    eyeLeft.position.set(-0.045, -0.16, 0);
    flyerGroup.add(eyeLeft);

    const eyeRight = new THREE.Mesh(eyeGeom, brassMaterial);
    eyeRight.position.set(0.045, -0.16, 0);
    flyerGroup.add(eyeRight);

    // F: Bobbin mounted on traverse rail
    const bobbinGroup = new THREE.Group();
    bobbinGroup.name = `bobbin-${i + 1}`;
    bobbinGroup.position.set(x, 0.04, 0);
    traverseRailGroup.add(bobbinGroup);
    bobbinGroups.push(bobbinGroup);

    // Bobbin wooden core & flanges
    const bobbinFlangeGeom = new THREE.CylinderGeometry(0.026, 0.026, 0.006, 16);
    disposables.push(bobbinFlangeGeom);
    const flangeBottom = new THREE.Mesh(bobbinFlangeGeom, darkOakMaterial);
    flangeBottom.position.set(0, 0, 0);
    bobbinGroup.add(flangeBottom);

    const flangeTop = new THREE.Mesh(bobbinFlangeGeom, darkOakMaterial);
    flangeTop.position.set(0, 0.09, 0);
    bobbinGroup.add(flangeTop);

    // Wound Cotton Yarn on Bobbin
    const yarnGeom = new THREE.CylinderGeometry(0.022, 0.022, 0.084, 16);
    disposables.push(yarnGeom);
    const yarnMesh = new THREE.Mesh(yarnGeom, cottonYarnMaterial);
    yarnMesh.position.set(0, 0.045, 0);
    bobbinGroup.add(yarnMesh);
  }

  // ==================== 6. G: HEART-CAM & TRAVERSE LINKAGE ====================
  const camGroup = new THREE.Group();
  camGroup.name = "heart-cam-G";
  camGroup.position.set(0.55, 0.52, 0);
  root.add(camGroup);

  // Cardioid heart-cam shape
  const heartShape = new THREE.Shape();
  heartShape.moveTo(0, -0.06);
  heartShape.bezierCurveTo(0.06, -0.08, 0.08, 0.02, 0, 0.08);
  heartShape.bezierCurveTo(-0.08, 0.02, -0.06, -0.08, 0, -0.06);

  const extrudeSettings = { depth: 0.02, bevelEnabled: false };
  const heartGeom = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
  disposables.push(heartGeom);
  const heartMesh = new THREE.Mesh(heartGeom, ironMaterial);
  heartMesh.rotation.z = Math.PI;
  camGroup.add(heartMesh);

  // Cam follower rocker lever
  const leverGeom = new THREE.BoxGeometry(0.02, 0.22, 0.015);
  disposables.push(leverGeom);
  const leverMesh = new THREE.Mesh(leverGeom, brassMaterial);
  leverMesh.position.set(-0.05, 0, 0);
  camGroup.add(leverMesh);

  // A visible right-angle transmission at the intersection of wheel A and
  // shaft B closes the power path. The modern reconstruction names
  // intermediate gearing without dimensions, so these are deliberately
  // normalized bevel members rather than asserted historical tooth counts.
  const rightAngleDriveGroup = new THREE.Group();
  rightAngleDriveGroup.name = "normalized-right-angle-drive-A-to-B";
  rightAngleDriveGroup.position.set(0.35, 0.22, 0);
  const wheelBevelGeom = new THREE.CylinderGeometry(0.045, 0.09, 0.08, 20);
  const shaftBevelGeom = new THREE.CylinderGeometry(0.045, 0.09, 0.08, 20);
  disposables.push(wheelBevelGeom, shaftBevelGeom);
  const wheelBevelRotor = new THREE.Group();
  wheelBevelRotor.name = "wheel-axis-bevel-rotor";
  wheelBevelRotor.position.z = 0.05;
  const wheelBevel = new THREE.Mesh(wheelBevelGeom, brassMaterial);
  wheelBevel.name = "wheel-axis-bevel-member";
  wheelBevel.rotation.x = Math.PI / 2;
  wheelBevelRotor.add(wheelBevel);
  const shaftBevelRotor = new THREE.Group();
  shaftBevelRotor.name = "shaft-axis-bevel-rotor";
  shaftBevelRotor.position.set(-0.05, 0, 0.06);
  const shaftBevel = new THREE.Mesh(shaftBevelGeom, brassMaterial);
  shaftBevel.name = "shaft-axis-bevel-member";
  shaftBevel.rotation.z = Math.PI / 2;
  shaftBevelRotor.add(shaftBevel);
  rightAngleDriveGroup.add(wheelBevelRotor, shaftBevelRotor);
  root.add(rightAngleDriveGroup);

  // ==================== 7. CALLOUT ANNOTATION PINS ====================
  const calloutGroup = new THREE.Group();
  calloutGroup.name = "callout-pins";
  root.add(calloutGroup);

  const callouts = [
    { label: "A", pos: [0.35, 0.22, 0.15], desc: "Great Water-Wheel Drum" },
    { label: "B", pos: [-0.45, 0.22, 0.1], desc: "Iron Driving Shaft & Clutch" },
    { label: "C", pos: [-0.12, 0.95, 0], desc: "Differential Drafting Rollers" },
    { label: "D", pos: [0.12, 0.72, -0.06], desc: "Lead Clamping Deadweights" },
    { label: "E", pos: [-0.36, 0.74, 0.12], desc: "Revolving Steel Flyer" },
    { label: "F", pos: [0.36, 0.54, 0.12], desc: "Drag-Retarded Bobbin" },
    { label: "G", pos: [0.55, 0.52, 0.1], desc: "Heart-Cam Traverse Motion" },
  ];

  for (const c of callouts) {
    const pinGroup = new THREE.Group();
    pinGroup.position.set(c.pos[0], c.pos[1], c.pos[2]);

    const pinSphereGeom = new THREE.SphereGeometry(0.025, 16, 16);
    disposables.push(pinSphereGeom);
    const pinMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    disposables.push(pinMat);
    const pinMesh = new THREE.Mesh(pinSphereGeom, pinMat);
    pinGroup.add(pinMesh);

    calloutGroup.add(pinGroup);
  }

  // Toggles
  const setCutaway = (_cutaway: boolean) => {
    // Framework is open-frame; cutaway highlights internal gears and drafting train
  };

  const setCalloutsVisible = (visible: boolean) => {
    calloutGroup.visible = visible;
  };

  const updateAnimation = (phases: ArkwrightKinematicPhases) => {
    // Rotate every body about its own physical shaft. Rotating the former
    // aggregate groups made complete roller nips, hanging weights, and the
    // main drum orbit around arbitrary world axes.
    wheelGroup.rotation.z = phases.wheelRad;
    shaftGroup.rotation.x = phases.shaftRad;
    wheelBevelRotor.rotation.z = phases.wheelRad;
    shaftBevelRotor.rotation.x = phases.shaftRad;
    for (const roller of feedLowerRollers) roller.rotation.x = phases.feedRollerRad;
    for (const roller of feedUpperRollers) roller.rotation.x = -phases.feedRollerRad;
    for (const roller of intermediateOneLowerRollers) {
      roller.rotation.x = phases.intermediateRollerOneRad;
    }
    for (const roller of intermediateOneUpperRollers) {
      roller.rotation.x = -phases.intermediateRollerOneRad;
    }
    for (const roller of intermediateTwoLowerRollers) {
      roller.rotation.x = phases.intermediateRollerTwoRad;
    }
    for (const roller of intermediateTwoUpperRollers) {
      roller.rotation.x = -phases.intermediateRollerTwoRad;
    }
    for (const roller of deliveryLowerRollers) roller.rotation.x = phases.deliveryRollerRad;
    for (const roller of deliveryUpperRollers) roller.rotation.x = -phases.deliveryRollerRad;
    const draftingPhases = [
      phases.feedRollerRad,
      phases.intermediateRollerOneRad,
      phases.intermediateRollerTwoRad,
      phases.deliveryRollerRad,
    ];
    rollerDriveRotors.forEach((rotor, index) => {
      rotor.rotation.x = draftingPhases[index];
    });
    for (const rotor of spindleDriveRotors) rotor.rotation.y = phases.spindleRad;
    for (const flyer of flyerGroups) flyer.rotation.y = phases.spindleRad;
    for (const bobbin of bobbinGroups) bobbin.rotation.y = phases.bobbinRad;

    const traverseOffset = Math.sin(phases.traverseRad) * 0.04;
    traverseRailGroup.position.y = 0.52 + traverseOffset;
    camGroup.rotation.z = phases.traverseRad;

    // Keep the final yarn segment attached to the traversing bobbin instead
    // of leaving a floating endpoint at the rail's neutral pose.
    for (const pathGeometry of yarnPathGeometries) {
      const positions = pathGeometry.getAttribute("position") as THREE.BufferAttribute;
      positions.setY(4, 0.61 + traverseOffset);
      positions.needsUpdate = true;
    }
  };

  const dispose = () => {
    for (const d of disposables) {
      d.dispose();
    }
  };

  return {
    root,
    wheelGroup,
    shaftGroup,
    feedRollersGroup,
    intermediateRollerOneGroup,
    intermediateRollerTwoGroup,
    deliveryRollersGroup,
    feedLowerRollers,
    feedUpperRollers,
    intermediateOneLowerRollers,
    intermediateOneUpperRollers,
    intermediateTwoLowerRollers,
    intermediateTwoUpperRollers,
    deliveryLowerRollers,
    deliveryUpperRollers,
    wheelBevelRotor,
    shaftBevelRotor,
    rollerDriveRotors,
    spindleDriveRotors,
    flyerGroups,
    bobbinGroups,
    traverseRailGroup,
    camGroup,
    calloutGroup,
    setCutaway,
    setCalloutsVisible,
    updateAnimation,
    dispose,
  };
}
