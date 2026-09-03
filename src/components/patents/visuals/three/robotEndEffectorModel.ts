import * as THREE from "three";
import type { RobotEndEffectorState } from "@/physics/robotEndEffectorKernel";

export interface RobotEndEffectorModel {
  root: THREE.Group;
  updateState: (state: RobotEndEffectorState) => void;
  dispose: () => void;
}

export const ROBOT_END_EFFECTOR_EXHIBIT_FLOOR_Y = -1.7;
export const ROBOT_END_EFFECTOR_HAND_WIDTH_WORLD = 0.32;
export const ROBOT_END_EFFECTOR_TRANSVERSE_TRAVEL_WORLD = 0.34;
const TRANSVERSE_RAIL_HALF_LENGTH_WORLD = 0.65;
const TRANSVERSE_BEARING_HALF_LENGTH_WORLD = 0.15;

/**
 * Procedural museum model derived from the named frame, double screws, hands,
 * fingers, spur gears, and encoder pegs in US 4,765,668. The source does not
 * print complete frame/finger dimensions, so fixed rail and finger lengths are
 * deliberately display proportions; only live screw displacement comes from
 * the disclosed 5 mm lead and 6-inch typical opening.
 */
export function buildRobotEndEffectorModel(): RobotEndEffectorModel {
  const root = new THREE.Group();
  root.name = "US 4,765,668 source-bounded double-handed end effector";
  const materials: THREE.Material[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  const material = <T extends THREE.Material>(value: T): T => {
    materials.push(value);
    return value;
  };
  const geometry = <T extends THREE.BufferGeometry>(value: T): T => {
    geometries.push(value);
    return value;
  };

  const frameMat = material(
    new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.84, roughness: 0.24 }),
  );
  const screwMat = material(
    new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.92, roughness: 0.12 }),
  );
  const handMat = material(
    new THREE.MeshStandardMaterial({ color: 0x0891b2, metalness: 0.68, roughness: 0.25 }),
  );
  const fingerMat = material(
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.55, roughness: 0.28 }),
  );
  const gearMat = material(
    new THREE.MeshStandardMaterial({ color: 0xa16207, metalness: 0.88, roughness: 0.18 }),
  );
  const sensorMat = material(
    new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: new THREE.Color(0x0e7490),
      emissiveIntensity: 0.4,
      metalness: 0.3,
      roughness: 0.3,
    }),
  );
  const gripCommandMat = material(
    new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: new THREE.Color(0xf59e0b),
      emissiveIntensity: 0.15,
      metalness: 0.18,
      roughness: 0.32,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
    }),
  );

  const createSpurGear = (
    name: string,
    pitchRadius: number,
    toothCount: number,
    gearMaterial: THREE.MeshStandardMaterial,
    phaseOffset = 0,
  ): THREE.Group => {
    const gear = new THREE.Group();
    gear.name = name;
    gear.userData.pitchRadius = pitchRadius;
    gear.userData.toothCount = toothCount;
    const module = (2 * pitchRadius) / toothCount;
    const toothDepth = Math.max(0.025, module * 0.76);
    const bodyRadius = pitchRadius - toothDepth * 0.4;
    const disc = new THREE.Mesh(
      geometry(new THREE.CylinderGeometry(bodyRadius, bodyRadius, 0.13, 40)),
      gearMaterial,
    );
    disc.name = `${name} pitch body`;
    disc.rotation.z = Math.PI / 2;
    gear.add(disc);
    const toothGeometry = geometry(
      new THREE.BoxGeometry(0.14, toothDepth, Math.max(0.018, module * 0.64)),
    );
    for (let toothIndex = 0; toothIndex < toothCount; toothIndex += 1) {
      const angle = phaseOffset + (toothIndex / toothCount) * Math.PI * 2;
      const tooth = new THREE.Mesh(toothGeometry, gearMaterial);
      tooth.name = `${name} tooth ${toothIndex + 1}`;
      const radius = bodyRadius + toothDepth / 2;
      tooth.position.set(0, Math.cos(angle) * radius, Math.sin(angle) * radius);
      tooth.rotation.x = angle;
      gear.add(tooth);
    }
    return gear;
  };

  const createThread = (name: string, xStart: number, xEnd: number, handedness: -1 | 1) => {
    const turns = 12;
    const segments = 144;
    const points = Array.from({ length: segments + 1 }, (_, index) => {
      const fraction = index / segments;
      const angle = handedness * fraction * turns * Math.PI * 2;
      return new THREE.Vector3(
        THREE.MathUtils.lerp(xStart, xEnd, fraction),
        Math.cos(angle) * 0.082,
        Math.sin(angle) * 0.082,
      );
    });
    const thread = new THREE.Mesh(
      geometry(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), segments, 0.011, 6)),
      screwMat,
    );
    thread.name = name;
    thread.userData.handedness = handedness < 0 ? "left" : "right";
    thread.userData.turns = turns;
    return thread;
  };

  const transverseCarriage = new THREE.Group();
  transverseCarriage.name = "Claim 16 guided transverse carriage 134";
  root.add(transverseCarriage);

  const rotatingAssembly = new THREE.Group();
  rotatingAssembly.name = "Connector-mounted rotating gripper assembly 10";
  transverseCarriage.add(rotatingAssembly);

  const frame = new THREE.Group();
  frame.name = "Frame 12 with cylinders 26 and 30 and web 28";
  rotatingAssembly.add(frame);
  const web = new THREE.Mesh(geometry(new THREE.BoxGeometry(3.2, 0.16, 0.68)), frameMat);
  web.name = "Central web 28";
  frame.add(web);
  const motorAxisY = 0.268;
  for (const side of [-1, 1] as const) {
    const rail = new THREE.Mesh(
      geometry(new THREE.CylinderGeometry(0.19, 0.19, 3.2, 28)),
      frameMat,
    );
    rail.name = side > 0 ? "Upper cylinder 26" : "Lower cylinder 30";
    rail.rotation.z = Math.PI / 2;
    rail.position.y = side * motorAxisY;
    frame.add(rail);
  }

  for (const x of [-1.64, 1.64]) {
    const endPlate = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.16, 1.72, 0.82)), frameMat);
    endPlate.name = x < 0 ? "End plate 46" : "End plate 48";
    endPlate.position.x = x;
    rotatingAssembly.add(endPlate);
  }

  const screwGroup = new THREE.Group();
  screwGroup.name = "Opposed-thread ball screws 40";
  rotatingAssembly.add(screwGroup);
  const handGroups: Array<{ group: THREE.Group; side: -1 | 1 }> = [];
  const fingerGroups: Array<{
    group: THREE.Group;
    seatedOffsetX: number;
    withdrawalDirection: -1 | 1;
  }> = [];
  const screwAssemblies: THREE.Group[] = [];
  const screwAxisY = 0.72;
  for (const transverseSide of [-1, 1] as const) {
    const screw = new THREE.Group();
    screw.name = transverseSide > 0 ? "Upper ball screw 40" : "Lower ball screw 40";
    screw.position.y = transverseSide * screwAxisY;
    const screwCore = new THREE.Mesh(
      geometry(new THREE.CylinderGeometry(0.075, 0.075, 3.16, 24)),
      screwMat,
    );
    screwCore.name = `${screw.name} core and central portion 58`;
    screwCore.rotation.z = Math.PI / 2;
    screw.add(
      screwCore,
      createThread(`${screw.name} right-hand threaded portion 56`, -1.55, -0.1, 1),
      createThread(`${screw.name} left-hand threaded portion 60`, 0.1, 1.55, -1),
    );
    screwGroup.add(screw);
    screwAssemblies.push(screw);

    for (const longitudinalSide of [-1, 1] as const) {
      const hand = new THREE.Group();
      const partNumber =
        transverseSide > 0 ? (longitudinalSide < 0 ? 14 : 16) : longitudinalSide < 0 ? 18 : 20;
      const fingerNumber =
        transverseSide > 0 ? (longitudinalSide < 0 ? 22 : 23) : longitudinalSide < 0 ? 24 : 25;
      hand.name = `${transverseSide > 0 ? "Upper" : "Lower"} hand ${partNumber}`;
      hand.position.y = transverseSide * 0.54;
      const carriage = new THREE.Mesh(
        geometry(new THREE.BoxGeometry(ROBOT_END_EFFECTOR_HAND_WIDTH_WORLD, 0.52, 0.68)),
        handMat,
      );
      carriage.name = "Sliding hand body";
      hand.add(carriage);
      const finger = new THREE.Group();
      finger.name = `Removable dovetail finger ${fingerNumber}`;
      const tenon = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.38, 0.16, 0.24)), fingerMat);
      tenon.name = `Dovetail tenon 108 for finger ${fingerNumber}`;
      tenon.position.y = transverseSide * 0.24;
      const jaw = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.18, 0.78, 0.18)), fingerMat);
      jaw.name = `Outward grasping portion 104 for finger ${fingerNumber}`;
      jaw.position.y = transverseSide * 0.68;
      finger.add(tenon, jaw);
      hand.add(finger);
      rotatingAssembly.add(hand);
      handGroups.push({ group: hand, side: longitudinalSide });
      fingerGroups.push({
        group: finger,
        seatedOffsetX: -longitudinalSide * (ROBOT_END_EFFECTOR_HAND_WIDTH_WORLD - 0.18) * 0.5,
        withdrawalDirection: -longitudinalSide as -1 | 1,
      });
    }
  }

  // These amber arrows are an explicit command meter, not a force acting on
  // an invented workpiece. The source reports a 2,000 N prototype maximum and
  // force controllability, but withholds the contact geometry and transfer law
  // needed to turn a visitor request into physical contact-force telemetry.
  const gripCommandIndicators: Array<{ group: THREE.Group; side: -1 | 1 }> = [];
  const commandShaftGeometry = geometry(new THREE.CylinderGeometry(0.025, 0.025, 0.3, 16));
  const commandHeadGeometry = geometry(new THREE.ConeGeometry(0.075, 0.16, 20));
  for (const side of [-1, 1] as const) {
    const indicator = new THREE.Group();
    indicator.name = `${side < 0 ? "Left" : "Right"} requested grip command indicator — not contact force`;
    indicator.rotation.z = side < 0 ? -Math.PI / 2 : Math.PI / 2;
    const shaft = new THREE.Mesh(commandShaftGeometry, gripCommandMat);
    shaft.name = "Requested grip command arrow shaft";
    shaft.position.y = -0.08;
    const head = new THREE.Mesh(commandHeadGeometry, gripCommandMat);
    head.name = "Requested grip command arrow head";
    head.position.y = 0.13;
    indicator.add(shaft, head);
    // Place the diagrammatic meter on the observer-facing side of the frame so
    // it cannot be mistaken for, or occluded by, the rear mechanical members.
    indicator.position.set(side * 0.85, 0, 0.78);
    rotatingAssembly.add(indicator);
    gripCommandIndicators.push({ group: indicator, side });
  }

  const gearEnd = new THREE.Group();
  gearEnd.name = "Upper and lower gear trains 62 and 64";
  gearEnd.position.x = 1.82;
  rotatingAssembly.add(gearEnd);
  const screwGearPitchRadius = 0.26;
  const motorGearPitchRadius = screwGearPitchRadius * (35.6 / 48.3);
  const gearCenterDistance = screwGearPitchRadius + motorGearPitchRadius;
  const upperScrewGear = createSpurGear(
    "Upper ball-screw spur gear 68",
    screwGearPitchRadius,
    19,
    gearMat,
  );
  upperScrewGear.position.y = screwAxisY;
  const upperMotorGear = createSpurGear(
    "Upper motor spur gear 66",
    motorGearPitchRadius,
    14,
    gearMat,
    Math.PI / 14,
  );
  upperMotorGear.position.y = screwAxisY - gearCenterDistance;
  const lowerScrewGear = createSpurGear(
    "Lower ball-screw spur gear 68",
    screwGearPitchRadius,
    19,
    gearMat,
  );
  lowerScrewGear.position.y = -screwAxisY;
  const lowerMotorGear = createSpurGear(
    "Lower motor spur gear 66",
    motorGearPitchRadius,
    14,
    gearMat,
    Math.PI / 14,
  );
  lowerMotorGear.position.y = -screwAxisY + gearCenterDistance;
  gearEnd.add(upperScrewGear, upperMotorGear, lowerScrewGear, lowerMotorGear);

  for (const [name, y] of [
    ["Upper screw-gear shaft 70", screwAxisY],
    ["Upper motor shaft 36", screwAxisY - gearCenterDistance],
    ["Lower motor shaft 38", -screwAxisY + gearCenterDistance],
    ["Lower screw-gear shaft 70", -screwAxisY],
  ] as const) {
    const shaft = new THREE.Mesh(
      geometry(new THREE.CylinderGeometry(0.055, 0.055, 0.36, 14)),
      screwMat,
    );
    shaft.name = name;
    shaft.rotation.z = Math.PI / 2;
    shaft.position.set(-0.15, y, 0);
    gearEnd.add(shaft);
  }

  const encoderPegs = new THREE.Group();
  encoderPegs.name = "Rotating eight-peg encoder 72";
  encoderPegs.position.copy(upperMotorGear.position);
  for (let index = 0; index < 8; index += 1) {
    const peg = new THREE.Mesh(
      geometry(new THREE.CylinderGeometry(0.026, 0.026, 0.16, 12)),
      sensorMat,
    );
    peg.name = `Encoder peg 72 · ${index + 1}`;
    peg.rotation.z = Math.PI / 2;
    const angle = (index * Math.PI * 2) / 8;
    peg.position.set(-0.1, Math.cos(angle) * 0.15, Math.sin(angle) * 0.15);
    encoderPegs.add(peg);
  }
  const switchBody = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.18, 0.1, 0.18)), sensorMat);
  switchBody.name = "Inductive proximity switch 74";
  switchBody.position.set(-0.19, upperMotorGear.position.y + 0.226, 0);
  gearEnd.add(encoderPegs, switchBody);

  const connector = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.35, 0.35, 0.3, 32)),
    frameMat,
  );
  connector.name = "Robot connector 130 rotational fitting";
  connector.rotation.z = Math.PI / 2;
  connector.position.x = -1.87;
  transverseCarriage.add(connector);

  const connectorHousing = new THREE.Mesh(
    geometry(new THREE.BoxGeometry(0.32, 1.55, 0.34)),
    frameMat,
  );
  connectorHousing.name = "Robot-side support housing for transverse mechanism 134";
  connectorHousing.position.set(-2.05, 0, 0);
  root.add(connectorHousing);

  for (const side of [-1, 1] as const) {
    const rail = new THREE.Mesh(
      geometry(new THREE.CylinderGeometry(0.055, 0.055, TRANSVERSE_RAIL_HALF_LENGTH_WORLD * 2, 16)),
      screwMat,
    );
    rail.name = `${side > 0 ? "Upper" : "Lower"} transverse guide for bearings ${side > 0 ? 156 : 158}`;
    rail.rotation.x = Math.PI / 2;
    rail.position.set(-1.84, side * 0.56, 0);
    root.add(rail);

    const bearing = new THREE.Mesh(
      geometry(new THREE.BoxGeometry(0.28, 0.22, TRANSVERSE_BEARING_HALF_LENGTH_WORLD * 2)),
      handMat,
    );
    bearing.name = `${side > 0 ? "Upper" : "Lower"} sliding bearing ${side > 0 ? 156 : 158}`;
    bearing.position.set(-1.84, side * 0.56, 0);
    transverseCarriage.add(bearing);
  }

  // The grant identifies connector 130 but does not print the upstream robot
  // arm geometry. This neutral museum stand supports that disclosed connector
  // without pretending to reconstruct robot 132.
  const supportPost = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.3, 1.25, 0.46)), frameMat);
  supportPost.name = "Exhibit wrist support for connector 130 — not claimed robot geometry";
  supportPost.position.set(-2.05, -0.975, 0);
  root.add(supportPost);
  const supportFoot = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.92, 0.1, 0.82)), frameMat);
  supportFoot.name = "Exhibit wrist support floor foot";
  supportFoot.position.set(-2.05, -1.65, 0);
  root.add(supportFoot);

  const displayMetresToWorld = 7;
  const updateState = (state: RobotEndEffectorState) => {
    const offset = state.perHandOffsetM * displayMetresToWorld;
    const handCenterOffset = offset + ROBOT_END_EFFECTOR_HAND_WIDTH_WORLD / 2;
    for (const hand of handGroups) {
      hand.group.position.x = hand.side * handCenterOffset;
      hand.group.visible = state.claim1TopologyPresent;
    }
    for (const screw of screwAssemblies) {
      screw.rotation.x = -state.screwAngleRad;
      screw.visible = state.claim1TopologyPresent;
    }
    upperMotorGear.rotation.x = state.motorRevolutions * 2 * Math.PI;
    lowerMotorGear.rotation.x = state.motorRevolutions * 2 * Math.PI;
    upperScrewGear.rotation.x = -state.screwAngleRad;
    lowerScrewGear.rotation.x = -state.screwAngleRad;
    encoderPegs.rotation.x = state.motorRevolutions * 2 * Math.PI;
    for (const finger of fingerGroups) {
      const withdrawalFraction = 1 - state.fingerRetainedFraction;
      finger.group.position.x =
        finger.seatedOffsetX +
        finger.withdrawalDirection * Math.min(0.18, withdrawalFraction * 0.2);
      finger.group.visible = state.claim1TopologyPresent && state.fingerRetainedFraction > 0.03;
    }
    const gripCommandFraction = Math.min(
      1,
      Math.max(0, state.requestedGripForceN / state.sourceReportedGripForceN),
    );
    gripCommandMat.opacity = 0.16 + gripCommandFraction * 0.58;
    gripCommandMat.emissiveIntensity = 0.15 + gripCommandFraction * 1.35;
    for (const indicator of gripCommandIndicators) {
      indicator.group.position.x = indicator.side * (handCenterOffset + 0.43);
      indicator.group.scale.setScalar(0.72 + gripCommandFraction * 0.48);
      indicator.group.visible = state.claim1TopologyPresent;
      indicator.group.userData.requestedGripForceN = state.requestedGripForceN;
      indicator.group.userData.isContactForce = false;
    }
    transverseCarriage.position.z =
      state.transverseOffsetNormalized * ROBOT_END_EFFECTOR_TRANSVERSE_TRAVEL_WORLD;
    rotatingAssembly.rotation.x = state.frameRotationRad;
    root.userData.claim1TopologyPresent = state.claim1TopologyPresent;
    root.userData.clearJawGapM = state.jawOpeningM;
    root.userData.fingerWithdrawalDirection = "inward toward the screw midpoint";
    root.userData.transversePositionNormalized = state.transverseOffsetNormalized;
    root.userData.transverseGuidesRemainEngaged =
      Math.abs(transverseCarriage.position.z) + TRANSVERSE_BEARING_HALF_LENGTH_WORLD <=
      TRANSVERSE_RAIL_HALF_LENGTH_WORLD;
  };

  return {
    root,
    updateState,
    dispose: () => {
      for (const item of geometries) item.dispose();
      for (const item of materials) item.dispose();
    },
  };
}
