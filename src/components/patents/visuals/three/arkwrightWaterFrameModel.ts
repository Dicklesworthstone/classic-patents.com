import * as THREE from "three";
import type { ArkwrightKinematicPhases } from "@/physics/arkwrightKernel";

export interface ArkwrightWaterFrameModelNodes {
  root: THREE.Group;
  wheelGroup: THREE.Group;
  shaftGroup: THREE.Group;
  feedRollersGroup: THREE.Group;
  deliveryRollersGroup: THREE.Group;
  feedLowerRollers: THREE.Mesh[];
  feedUpperRollers: THREE.Mesh[];
  deliveryLowerRollers: THREE.Mesh[];
  deliveryUpperRollers: THREE.Mesh[];
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

  const drumGeom = new THREE.CylinderGeometry(0.24, 0.24, 0.16, 32);
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
  shaftGroup.position.set(0, 0.22, 0);
  root.add(shaftGroup);

  const shaftGeom = new THREE.CylinderGeometry(0.015, 0.015, 1.15, 16);
  disposables.push(shaftGeom);
  const shaftMesh = new THREE.Mesh(shaftGeom, ironMaterial);
  shaftMesh.rotation.z = Math.PI / 2;
  shaftGroup.add(shaftMesh);

  // Clutch disengaging lever
  const clutchGeom = new THREE.BoxGeometry(0.04, 0.08, 0.04);
  disposables.push(clutchGeom);
  const clutchMesh = new THREE.Mesh(clutchGeom, brassMaterial);
  clutchMesh.position.set(-0.45, 0, 0);
  shaftGroup.add(clutchMesh);

  // ==================== 4. C & D: DIFFERENTIAL DRAFTING ROLLERS ====================
  const feedRollersGroup = new THREE.Group();
  feedRollersGroup.name = "feed-rollers-C1";
  feedRollersGroup.position.set(0, 0.88, -0.06);
  root.add(feedRollersGroup);

  const deliveryRollersGroup = new THREE.Group();
  deliveryRollersGroup.name = "delivery-rollers-C4";
  deliveryRollersGroup.position.set(0, 0.88, 0.06);
  root.add(deliveryRollersGroup);

  // 4 Spindle stations along X-axis: -0.36, -0.12, 0.12, 0.36
  const stationX = [-0.36, -0.12, 0.12, 0.36];

  const rollerGeom = new THREE.CylinderGeometry(0.018, 0.018, 0.07, 16);
  disposables.push(rollerGeom);
  const feedLowerRollers: THREE.Mesh[] = [];
  const feedUpperRollers: THREE.Mesh[] = [];
  const deliveryLowerRollers: THREE.Mesh[] = [];
  const deliveryUpperRollers: THREE.Mesh[] = [];

  for (const x of stationX) {
    // Pair 1: Feed Rollers (Lower fluted brass, upper leather cot)
    const lowerFeed = new THREE.Mesh(rollerGeom, brassMaterial);
    lowerFeed.rotation.z = Math.PI / 2;
    lowerFeed.position.set(x, -0.01, 0);
    feedRollersGroup.add(lowerFeed);
    feedLowerRollers.push(lowerFeed);

    const upperFeed = new THREE.Mesh(rollerGeom, leatherMaterial);
    upperFeed.rotation.z = Math.PI / 2;
    upperFeed.position.set(x, 0.026, 0);
    feedRollersGroup.add(upperFeed);
    feedUpperRollers.push(upperFeed);

    // Pair 4: Delivery Rollers (Accelerating speed)
    const lowerDeliv = new THREE.Mesh(rollerGeom, brassMaterial);
    lowerDeliv.rotation.z = Math.PI / 2;
    lowerDeliv.position.set(x, -0.01, 0);
    deliveryRollersGroup.add(lowerDeliv);
    deliveryLowerRollers.push(lowerDeliv);

    const upperDeliv = new THREE.Mesh(rollerGeom, leatherMaterial);
    upperDeliv.rotation.z = Math.PI / 2;
    upperDeliv.position.set(x, 0.026, 0);
    deliveryRollersGroup.add(upperDeliv);
    deliveryUpperRollers.push(upperDeliv);

    // D: Suspended Lead Weights & Saddles
    const saddleWireGeom = new THREE.CylinderGeometry(0.002, 0.002, 0.18, 8);
    disposables.push(saddleWireGeom);
    const saddleWire = new THREE.Mesh(saddleWireGeom, ironMaterial);
    saddleWire.position.set(x, -0.08, 0);
    feedRollersGroup.add(saddleWire);

    const weightGeom = new THREE.CylinderGeometry(0.025, 0.025, 0.06, 16);
    disposables.push(weightGeom);
    const weightMesh = new THREE.Mesh(weightGeom, leadWeightMaterial);
    weightMesh.position.set(x, -0.16, 0);
    feedRollersGroup.add(weightMesh);
  }

  // ==================== 5. E & F: SPINDLES, FLYERS & BOBBINS ====================
  const flyerGroups: THREE.Group[] = [];
  const bobbinGroups: THREE.Group[] = [];

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
    const spindleShaftGeom = new THREE.CylinderGeometry(0.005, 0.005, 0.45, 12);
    disposables.push(spindleShaftGeom);
    const spindleShaft = new THREE.Mesh(spindleShaftGeom, steelMaterial);
    spindleShaft.position.set(0, 0.58, 0);
    spindleStation.add(spindleShaft);

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
  const wheelBevel = new THREE.Mesh(wheelBevelGeom, brassMaterial);
  wheelBevel.name = "wheel-axis-bevel-member";
  wheelBevel.rotation.x = Math.PI / 2;
  wheelBevel.position.z = 0.05;
  const shaftBevel = new THREE.Mesh(shaftBevelGeom, brassMaterial);
  shaftBevel.name = "shaft-axis-bevel-member";
  shaftBevel.rotation.z = Math.PI / 2;
  shaftBevel.position.x = -0.05;
  rightAngleDriveGroup.add(wheelBevel, shaftBevel);
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
    { label: "E", pos: [-0.36, 0.74, 0.12], desc: "High-Speed Steel Flyer (3500 RPM)" },
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
    for (const roller of feedLowerRollers) roller.rotation.x = phases.feedRollerRad;
    for (const roller of feedUpperRollers) roller.rotation.x = -phases.feedRollerRad;
    for (const roller of deliveryLowerRollers) roller.rotation.x = phases.deliveryRollerRad;
    for (const roller of deliveryUpperRollers) roller.rotation.x = -phases.deliveryRollerRad;
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
    deliveryRollersGroup,
    feedLowerRollers,
    feedUpperRollers,
    deliveryLowerRollers,
    deliveryUpperRollers,
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
