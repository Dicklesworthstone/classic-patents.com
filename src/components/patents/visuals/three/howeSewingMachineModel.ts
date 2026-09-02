/**
 * Source-bound procedural model of Elias Howe's US 4,750 sewing machine.
 *
 * Topology comes from the reviewed grant and Figs. 1–7:
 * A bed; B standards; C one main shaft carrying cams Q/R; O the needle-arm
 * rock shaft; G the arm and its fixed curved eye-pointed needle; I the
 * horizontal shuttle trough; J picker-staves; K shuttle; H the pinned,
 * rack-holed baster plate; and W the loop-lifting rod.
 *
 * The grant prints two local dimensions only: the needle eye is about 1/8 in
 * from the point and the baster points are about 3/4 in apart. The remaining
 * studio dimensions are normalized reconstruction proportions, not measured
 * dimensions of the surviving machine.
 */

import * as THREE from "three";
import { type HoweLockstitchState, stepHoweLockstitch } from "@/physics/machineKernels";

export { howeCyclicFlex } from "@/physics/genericWasm";

const UP = new THREE.Vector3(0, 1, 0);
const scratchBeamDelta = new THREE.Vector3();
const SHAFT_CENTER = new THREE.Vector3(-2.25, 1.35, 0);
const NEEDLE_PIVOT = new THREE.Vector3(0.15, 1.35, 0);
const SHUTTLE_CENTER_X = 2.15;
const SHUTTLE_HOME_Y = -1.18;
const SHUTTLE_HOME_Z = 0.34;
const SHUTTLE_THROW = 2.25;
const FEED_WRAP = 1.5;
const FEED_PITCH_STUDIO = 0.18;
const LEFT_PICKER_ANCHOR = new THREE.Vector3(-3.72, -0.74, SHUTTLE_HOME_Z);
const RIGHT_PICKER_ANCHOR = new THREE.Vector3(4.92, -0.74, SHUTTLE_HOME_Z);

export interface HoweSewingMachineModel {
  rootGroup: THREE.Group;
  mainShaftRotor: THREE.Group;
  mainShaft: THREE.Mesh;
  needleCamQ: THREE.Mesh;
  feedCamR: THREE.Mesh;
  feedCamPin: THREE.Mesh;
  needleArmGroup: THREE.Group;
  curvedNeedle: THREE.Mesh;
  needleEye: THREE.Mesh;
  needleFollower: THREE.Mesh;
  shuttleGroup: THREE.Group;
  shuttleMesh: THREE.Mesh;
  shuttleRaceGroup: THREE.Group;
  bypassRaceGroup: THREE.Group;
  leftPickerStave: THREE.Mesh;
  rightPickerStave: THREE.Mesh;
  basterPlateGroup: THREE.Group;
  basterPlate: THREE.Mesh;
  clothMesh: THREE.Mesh;
  feedRatchet: THREE.Mesh;
  liftingRodGroup: THREE.Group;
  liftingGuide: THREE.Mesh;
  upperThreadLine: THREE.Line;
  lowerThreadLine: THREE.Line;
  calloutGroup: THREE.Group;
  materials: {
    castIron: THREE.MeshStandardMaterial;
    darkIron: THREE.MeshStandardMaterial;
    polishedSteel: THREE.MeshStandardMaterial;
    brass: THREE.MeshStandardMaterial;
    bronze: THREE.MeshStandardMaterial;
    threadMat: THREE.LineBasicMaterial;
    lowerThreadMat: THREE.LineBasicMaterial;
    clothMat: THREE.MeshStandardMaterial;
  };
  setCutaway: (cutaway: boolean) => void;
  dispose: () => void;
}

export interface HoweConnectivityReport {
  mainShaftOwnsNeedleCam: boolean;
  mainShaftOwnsFeedCam: boolean;
  needleOwnsEye: boolean;
  armOwnsNeedle: boolean;
  basterPlateOwnsCloth: boolean;
  shuttleConstrainedToRace: boolean;
  pickerStavesPresent: boolean;
}

function setBeamBetween(mesh: THREE.Mesh, start: THREE.Vector3, end: THREE.Vector3): void {
  const delta = scratchBeamDelta.copy(end).sub(start);
  const length = Math.max(0.0001, delta.length());
  mesh.position.copy(start).addScaledVector(delta, 0.5);
  mesh.quaternion.setFromUnitVectors(UP, delta.multiplyScalar(1 / length));
  mesh.scale.set(1, length, 1);
}

export function inspectHoweConnectivity(model: HoweSewingMachineModel): HoweConnectivityReport {
  return {
    mainShaftOwnsNeedleCam: model.needleCamQ.parent === model.mainShaftRotor,
    mainShaftOwnsFeedCam: model.feedCamR.parent === model.mainShaftRotor,
    needleOwnsEye: model.needleEye.parent === model.curvedNeedle,
    armOwnsNeedle: model.curvedNeedle.parent === model.needleArmGroup,
    basterPlateOwnsCloth: model.clothMesh.parent === model.basterPlateGroup,
    shuttleConstrainedToRace:
      model.shuttleGroup.parent === model.shuttleRaceGroup &&
      model.shuttleMesh.parent === model.shuttleGroup,
    pickerStavesPresent:
      model.leftPickerStave.parent === model.rootGroup &&
      model.rightPickerStave.parent === model.rootGroup,
  };
}

export function buildHoweSewingMachineModel(): HoweSewingMachineModel {
  const rootGroup = new THREE.Group();
  rootGroup.name = "Howe US 4,750 source topology";

  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];

  const material = <T extends THREE.Material>(value: T): T => {
    materialsToDispose.push(value);
    return value;
  };
  const geometry = <T extends THREE.BufferGeometry>(value: T): T => {
    geometriesToDispose.push(value);
    return value;
  };
  const addMesh = (
    parent: THREE.Object3D,
    meshGeometry: THREE.BufferGeometry,
    meshMaterial: THREE.Material,
    name: string,
  ): THREE.Mesh => {
    const mesh = new THREE.Mesh(meshGeometry, meshMaterial);
    mesh.name = name;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };

  const castIron = material(
    new THREE.MeshStandardMaterial({ color: 0x26313c, roughness: 0.5, metalness: 0.82 }),
  );
  const darkIron = material(
    new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.64, metalness: 0.72 }),
  );
  const polishedSteel = material(
    new THREE.MeshStandardMaterial({ color: 0xe8edf2, roughness: 0.14, metalness: 0.94 }),
  );
  const brass = material(
    new THREE.MeshStandardMaterial({ color: 0xc77a16, roughness: 0.25, metalness: 0.86 }),
  );
  const bronze = material(
    new THREE.MeshStandardMaterial({ color: 0x925018, roughness: 0.34, metalness: 0.78 }),
  );
  const threadMat = material(new THREE.LineBasicMaterial({ color: 0xc0262d }));
  const lowerThreadMat = material(new THREE.LineBasicMaterial({ color: 0x2563eb }));
  const clothMat = material(
    new THREE.MeshStandardMaterial({
      color: 0xf4e4bc,
      roughness: 0.9,
      metalness: 0,
      side: THREE.DoubleSide,
    }),
  );

  // A — one continuous bed and bolted feet.
  const bed = addMesh(
    rootGroup,
    geometry(new THREE.BoxGeometry(10.4, 0.42, 3.5)),
    castIron,
    "A — bed",
  );
  bed.position.set(0.15, -1.62, 0);
  for (const x of [-4.55, 4.85]) {
    for (const z of [-1.35, 1.35]) {
      const foot = addMesh(
        rootGroup,
        geometry(new THREE.CylinderGeometry(0.3, 0.36, 0.46, 16)),
        darkIron,
        "A — mounting foot",
      );
      foot.position.set(x, -1.97, z);
    }
  }

  // B — standards rise continuously from bed to the shaft bearings and bridge.
  const leftStandard = addMesh(
    rootGroup,
    geometry(new THREE.BoxGeometry(0.72, 3.05, 1.05)),
    castIron,
    "B — left standard",
  );
  leftStandard.position.set(-2.25, -0.02, 0);
  const rightStandard = addMesh(
    rootGroup,
    geometry(new THREE.BoxGeometry(0.58, 2.28, 0.82)),
    castIron,
    "B — needle standard",
  );
  rightStandard.position.set(0.15, 0.2, 0);
  const bridge = addMesh(
    rootGroup,
    geometry(new THREE.BoxGeometry(3.05, 0.4, 0.78)),
    castIron,
    "B — upper bridge",
  );
  bridge.position.set(-1.05, 1.34, 0);

  for (const z of [-0.56, 0.56]) {
    const bearing = addMesh(
      rootGroup,
      geometry(new THREE.CylinderGeometry(0.29, 0.29, 0.2, 24)),
      bronze,
      "C — main-shaft bearing",
    );
    bearing.rotation.x = Math.PI / 2;
    bearing.position.set(SHAFT_CENTER.x, SHAFT_CENTER.y, z);
  }

  // C, D, Q, R — one rotor: shaft, flywheel, needle cam, and feed cam.
  const mainShaftRotor = new THREE.Group();
  mainShaftRotor.name = "C — common main-shaft rotor";
  mainShaftRotor.position.copy(SHAFT_CENTER);
  rootGroup.add(mainShaftRotor);

  const mainShaft = addMesh(
    mainShaftRotor,
    geometry(new THREE.CylinderGeometry(0.105, 0.105, 4.4, 18)),
    polishedSteel,
    "C — main shaft",
  );
  mainShaft.rotation.x = Math.PI / 2;

  const flywheelRim = addMesh(
    mainShaftRotor,
    geometry(new THREE.TorusGeometry(1.43, 0.14, 12, 48)),
    castIron,
    "D — flywheel rim",
  );
  flywheelRim.position.z = -1.72;
  for (let index = 0; index < 6; index += 1) {
    const spoke = addMesh(
      mainShaftRotor,
      geometry(new THREE.BoxGeometry(0.12, 1.28, 0.1)),
      castIron,
      "D — flywheel spoke",
    );
    spoke.position.z = -1.72;
    spoke.position.x = Math.sin((index * Math.PI) / 3) * 0.64;
    spoke.position.y = Math.cos((index * Math.PI) / 3) * 0.64;
    spoke.rotation.z = -(index * Math.PI) / 3;
  }
  const crankHandle = addMesh(
    mainShaftRotor,
    geometry(new THREE.CylinderGeometry(0.085, 0.085, 0.72, 14)),
    bronze,
    "E — hand crank",
  );
  crankHandle.rotation.x = Math.PI / 2;
  crankHandle.position.set(0, 1.07, -2.08);

  const needleCamQ = addMesh(
    mainShaftRotor,
    geometry(new THREE.CylinderGeometry(0.58, 0.58, 0.36, 32)),
    brass,
    "Q — grooved needle cam",
  );
  needleCamQ.rotation.x = Math.PI / 2;
  needleCamQ.position.z = -0.2;
  const needleCamMarker = addMesh(
    mainShaftRotor,
    geometry(new THREE.BoxGeometry(0.16, 0.64, 0.08)),
    polishedSteel,
    "l — needle-cam groove marker",
  );
  needleCamMarker.position.set(0.36, 0, -0.42);
  needleCamMarker.rotation.z = -0.5;

  const feedCamR = addMesh(
    mainShaftRotor,
    geometry(new THREE.CylinderGeometry(0.43, 0.43, 0.25, 28)),
    bronze,
    "R — feed cam",
  );
  feedCamR.rotation.x = Math.PI / 2;
  feedCamR.position.z = 0.48;
  const feedCamPin = addMesh(
    mainShaftRotor,
    geometry(new THREE.SphereGeometry(0.1, 12, 8)),
    polishedSteel,
    "R — feed-cam pin",
  );
  feedCamPin.position.set(0.3, 0, 0.65);

  // O, G, P, k — the curved needle is rigidly carried by the rocking arm.
  const needleArmGroup = new THREE.Group();
  needleArmGroup.name = "O/G — needle rock-shaft and vibrating arm";
  needleArmGroup.position.copy(NEEDLE_PIVOT);
  rootGroup.add(needleArmGroup);

  const rockShaft = addMesh(
    needleArmGroup,
    geometry(new THREE.CylinderGeometry(0.13, 0.13, 1.15, 18)),
    polishedSteel,
    "O — needle-arm rock shaft",
  );
  rockShaft.rotation.x = Math.PI / 2;

  const needleArm = addMesh(
    needleArmGroup,
    geometry(new THREE.BoxGeometry(2.65, 0.24, 0.31)),
    castIron,
    "G — vibrating needle arm",
  );
  needleArm.position.set(1.2, -0.18, 0);

  const followerArm = addMesh(
    needleArmGroup,
    geometry(new THREE.BoxGeometry(1.78, 0.15, 0.18)),
    castIron,
    "P — cam follower arm",
  );
  followerArm.position.set(-0.89, 0, -0.12);
  const needleFollower = addMesh(
    needleArmGroup,
    geometry(new THREE.CylinderGeometry(0.12, 0.12, 0.18, 16)),
    polishedSteel,
    "k — roller in cam groove",
  );
  needleFollower.rotation.x = Math.PI / 2;
  needleFollower.position.set(-1.78, 0, -0.12);

  const needleCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(1.2, -0.25, 0),
    new THREE.Vector3(2.25, -0.85, 0),
    new THREE.Vector3(2.08, -2.34, 0),
  );
  const curvedNeedle = addMesh(
    needleArmGroup,
    geometry(new THREE.TubeGeometry(needleCurve, 36, 0.033, 8, false)),
    polishedSteel,
    "curved eye-pointed needle — Claim 1",
  );
  const needleEye = addMesh(
    curvedNeedle,
    geometry(new THREE.TorusGeometry(0.061, 0.013, 7, 16)),
    brass,
    "needle eye — about 1/8 inch from point",
  );
  needleEye.position.copy(needleCurve.getPoint(0.93));

  // I, J, K, M, N — shuttle is a child of its horizontal race and is pushed
  // alternately by two staves whose endpoints are recomputed every frame.
  const shuttleRaceGroup = new THREE.Group();
  shuttleRaceGroup.name = "I — horizontal shuttle trough";
  rootGroup.add(shuttleRaceGroup);
  for (const z of [0.05, 0.64]) {
    const rail = addMesh(
      shuttleRaceGroup,
      geometry(new THREE.BoxGeometry(7.7, 0.19, 0.13)),
      darkIron,
      "I — shuttle-race rail",
    );
    rail.position.set(0.6, SHUTTLE_HOME_Y - 0.2, z);
  }
  const raceFloor = addMesh(
    shuttleRaceGroup,
    geometry(new THREE.BoxGeometry(7.7, 0.12, 0.72)),
    castIron,
    "I — shuttle-race floor",
  );
  raceFloor.position.set(0.6, SHUTTLE_HOME_Y - 0.31, SHUTTLE_HOME_Z);

  const bypassRaceGroup = new THREE.Group();
  bypassRaceGroup.name = "counterfactual offset guide — Claim 1 disabled";
  shuttleRaceGroup.add(bypassRaceGroup);
  for (const z of [0.6, 1.19]) {
    const rail = addMesh(
      bypassRaceGroup,
      geometry(new THREE.BoxGeometry(7.7, 0.12, 0.09)),
      brass,
      "counterfactual guided shuttle rail",
    );
    rail.position.set(0.6, SHUTTLE_HOME_Y - 0.14, z);
  }
  bypassRaceGroup.visible = false;

  const shuttleGroup = new THREE.Group();
  shuttleGroup.name = "M/N — sliding shuttle box";
  shuttleGroup.position.set(SHUTTLE_CENTER_X, SHUTTLE_HOME_Y, SHUTTLE_HOME_Z);
  shuttleRaceGroup.add(shuttleGroup);
  const shuttleMesh = addMesh(
    shuttleGroup,
    geometry(new THREE.CapsuleGeometry(0.19, 1.1, 6, 16)),
    polishedSteel,
    "K — boat shuttle and bobbin",
  );
  shuttleMesh.rotation.z = Math.PI / 2;
  const bobbin = addMesh(
    shuttleGroup,
    geometry(new THREE.CylinderGeometry(0.1, 0.1, 0.68, 14)),
    bronze,
    "K — shuttle bobbin",
  );
  bobbin.rotation.z = Math.PI / 2;

  const leftPickerStave = addMesh(
    rootGroup,
    geometry(new THREE.CylinderGeometry(0.065, 0.065, 1, 10)),
    darkIron,
    "J — left picker-stave",
  );
  const rightPickerStave = addMesh(
    rootGroup,
    geometry(new THREE.CylinderGeometry(0.065, 0.065, 1, 10)),
    darkIron,
    "J — right picker-stave",
  );

  // H — the vertical pinned plate, its rack, and the cloth are one carriage.
  const basterPlateGroup = new THREE.Group();
  basterPlateGroup.name = "H — baster-plate feed carriage";
  basterPlateGroup.position.set(0.55, -0.08, 0.02);
  rootGroup.add(basterPlateGroup);

  const basterPlate = addMesh(
    basterPlateGroup,
    geometry(new THREE.BoxGeometry(5.35, 1.72, 0.1)),
    polishedSteel,
    "H — pinned and rack-holed baster plate",
  );
  basterPlate.position.y = -0.28;

  const clothMesh = addMesh(
    basterPlateGroup,
    geometry(new THREE.PlaneGeometry(4.9, 1.38, 12, 5)),
    clothMat,
    "cloth fixed to baster plate H",
  );
  clothMesh.position.set(0, -0.2, 0.075);

  const rack = addMesh(
    basterPlateGroup,
    geometry(new THREE.BoxGeometry(5.45, 0.18, 0.22)),
    darkIron,
    "H — rack edge",
  );
  rack.position.set(0, -1.05, -0.02);

  // The printed point pitch is about 3/4 inch; studio pitch preserves that
  // explicit local spacing without claiming an overall machine scale.
  for (let x = -2.25; x <= 2.26; x += 0.75) {
    const point = addMesh(
      basterPlateGroup,
      geometry(new THREE.ConeGeometry(0.035, 0.24, 7)),
      polishedSteel,
      "H — cloth point at approximately 3/4 inch pitch",
    );
    point.rotation.x = Math.PI / 2;
    point.position.set(x, -0.74, 0.18);

    const rackHole = addMesh(
      basterPlateGroup,
      geometry(new THREE.TorusGeometry(0.055, 0.016, 6, 12)),
      brass,
      "H — feed rack hole",
    );
    rackHole.position.set(x, -1.05, 0.12);
  }

  const feedRatchet = addMesh(
    rootGroup,
    geometry(new THREE.CylinderGeometry(0.34, 0.34, 0.2, 12)),
    brass,
    "U/V — baster-plate feed ratchet",
  );
  feedRatchet.rotation.x = Math.PI / 2;
  feedRatchet.position.set(-1.15, -1.12, 0.82);
  const feedLink = addMesh(
    rootGroup,
    geometry(new THREE.CylinderGeometry(0.055, 0.055, 1, 10)),
    darkIron,
    "S/T — feed arm and claw",
  );

  // Spool, thread guide, and W lifting rod are all mounted to the standards.
  const spool = addMesh(
    rootGroup,
    geometry(new THREE.CylinderGeometry(0.26, 0.26, 0.58, 20)),
    bronze,
    "upper-thread spool",
  );
  spool.position.set(-0.95, 2.18, 0.24);
  const spoolPin = addMesh(
    rootGroup,
    geometry(new THREE.CylinderGeometry(0.045, 0.045, 0.9, 12)),
    polishedSteel,
    "spool spindle",
  );
  spoolPin.position.set(-0.95, 2.18, 0.24);

  const tensionGuide = addMesh(
    rootGroup,
    geometry(new THREE.TorusGeometry(0.17, 0.045, 8, 20)),
    brass,
    "upper-thread guide",
  );
  tensionGuide.position.set(-0.15, 1.7, 0.2);

  const liftingRodGroup = new THREE.Group();
  liftingRodGroup.name = "W — loop-lifting rod";
  liftingRodGroup.position.set(0.55, 1.62, 0.2);
  rootGroup.add(liftingRodGroup);
  const liftingRod = addMesh(
    liftingRodGroup,
    geometry(new THREE.CylinderGeometry(0.045, 0.045, 0.72, 12)),
    polishedSteel,
    "W — thread lifting rod",
  );
  liftingRod.rotation.z = Math.PI / 2;
  const liftingGuide = addMesh(
    liftingRodGroup,
    geometry(new THREE.TorusGeometry(0.1, 0.027, 7, 16)),
    brass,
    "u — lifting-rod thread pin",
  );
  liftingGuide.position.x = 0.35;

  const upperThreadPositions = new Float32Array(8 * 3);
  const upperThreadGeometry = geometry(new THREE.BufferGeometry());
  upperThreadGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(upperThreadPositions, 3).setUsage(THREE.DynamicDrawUsage),
  );
  const upperThreadLine = new THREE.Line(upperThreadGeometry, threadMat);
  upperThreadLine.name = "upper thread: spool → guide → W → needle eye → loop";
  upperThreadLine.frustumCulled = false;
  rootGroup.add(upperThreadLine);

  const lowerThreadPositions = new Float32Array(4 * 3);
  const lowerThreadGeometry = geometry(new THREE.BufferGeometry());
  lowerThreadGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(lowerThreadPositions, 3).setUsage(THREE.DynamicDrawUsage),
  );
  const lowerThreadLine = new THREE.Line(lowerThreadGeometry, lowerThreadMat);
  lowerThreadLine.name = "lower thread: shuttle bobbin → interlock";
  lowerThreadLine.frustumCulled = false;
  rootGroup.add(lowerThreadLine);

  const calloutGroup = new THREE.Group();
  calloutGroup.name = "US 4,750 figure-letter pins";
  rootGroup.add(calloutGroup);
  const calloutPositions: ReadonlyArray<readonly [string, number, number, number]> = [
    ["C", -2.25, 1.35, -0.8],
    ["Q", -1.8, 1.72, -0.2],
    ["O", 0.15, 1.35, 0.6],
    ["K", 2.15, -0.86, 0.34],
    ["H", 0.55, 0.72, 0.12],
    ["W", 0.9, 1.9, 0.2],
  ];
  for (const [label, x, y, z] of calloutPositions) {
    const pin = addMesh(
      calloutGroup,
      geometry(new THREE.SphereGeometry(0.09, 12, 8)),
      brass,
      `patent callout ${label}`,
    );
    pin.position.set(x, y, z);
  }
  calloutGroup.visible = false;

  setBeamBetween(
    leftPickerStave,
    LEFT_PICKER_ANCHOR,
    new THREE.Vector3(SHUTTLE_CENTER_X - 0.75, SHUTTLE_HOME_Y, SHUTTLE_HOME_Z),
  );
  setBeamBetween(
    rightPickerStave,
    RIGHT_PICKER_ANCHOR,
    new THREE.Vector3(SHUTTLE_CENTER_X + 0.75, SHUTTLE_HOME_Y, SHUTTLE_HOME_Z),
  );
  setBeamBetween(
    feedLink,
    new THREE.Vector3(-1.95, 1.2, 0.65),
    new THREE.Vector3(-1.15, -0.78, 0.82),
  );

  const model: HoweSewingMachineModel = {
    rootGroup,
    mainShaftRotor,
    mainShaft,
    needleCamQ,
    feedCamR,
    feedCamPin,
    needleArmGroup,
    curvedNeedle,
    needleEye,
    needleFollower,
    shuttleGroup,
    shuttleMesh,
    shuttleRaceGroup,
    bypassRaceGroup,
    leftPickerStave,
    rightPickerStave,
    basterPlateGroup,
    basterPlate,
    clothMesh,
    feedRatchet,
    liftingRodGroup,
    liftingGuide,
    upperThreadLine,
    lowerThreadLine,
    calloutGroup,
    materials: {
      castIron,
      darkIron,
      polishedSteel,
      brass,
      bronze,
      threadMat,
      lowerThreadMat,
      clothMat,
    },
    setCutaway: (cutaway: boolean) => {
      for (const value of [castIron, darkIron]) {
        value.transparent = cutaway;
        value.opacity = cutaway ? 0.28 : 1;
        value.depthWrite = !cutaway;
        value.needsUpdate = true;
      }
    },
    dispose: () => {
      for (const value of geometriesToDispose) value.dispose();
      for (const value of materialsToDispose) value.dispose();
    },
  };

  updateHoweSewingMachineKinematics(model, stepHoweLockstitch(0, 65, true));

  return model;
}

const scratchNeedleEye = new THREE.Vector3();
const scratchLiftGuide = new THREE.Vector3();
const scratchShuttle = new THREE.Vector3();
const scratchFeedPin = new THREE.Vector3();
const scratchRootPoint = new THREE.Vector3();
const scratchLeftShuttle = new THREE.Vector3();
const scratchRightShuttle = new THREE.Vector3();
const scratchFeedPawl = new THREE.Vector3();

function writePoint(array: Float32Array, index: number, point: THREE.Vector3): void {
  array[index * 3] = point.x;
  array[index * 3 + 1] = point.y;
  array[index * 3 + 2] = point.z;
}

function inRootSpace(
  model: HoweSewingMachineModel,
  object: THREE.Object3D,
  target: THREE.Vector3,
): THREE.Vector3 {
  object.getWorldPosition(target);
  return model.rootGroup.worldToLocal(target);
}

export function updateHoweSewingMachineKinematics(
  model: HoweSewingMachineModel,
  state: HoweLockstitchState,
  completedCycles = 0,
  showCalloutPins = false,
): void {
  model.mainShaftRotor.rotation.z = -state.crankAngleRad;
  model.needleArmGroup.rotation.z = state.needleArmAngleRad;

  model.shuttleGroup.position.set(
    SHUTTLE_CENTER_X + state.shuttleTravelNormalized * SHUTTLE_THROW,
    SHUTTLE_HOME_Y,
    SHUTTLE_HOME_Z + state.shuttleTrackOffsetZ,
  );
  model.bypassRaceGroup.visible = state.shuttleTrackOffsetZ > 0;

  const totalFeedSteps = completedCycles + state.feedAdvanceFraction;
  const unwrappedFeed = totalFeedSteps * FEED_PITCH_STUDIO;
  const wrappedFeed = ((unwrappedFeed + FEED_WRAP / 2) % FEED_WRAP) - FEED_WRAP / 2;
  model.basterPlateGroup.position.x = 0.55 + wrappedFeed;
  model.feedRatchet.rotation.z = -(totalFeedSteps * Math.PI) / 6;
  model.liftingRodGroup.position.y = 1.62 + state.liftingRodNormalized * 0.32;
  model.calloutGroup.visible = showCalloutPins;

  model.rootGroup.updateMatrixWorld(true);

  const shuttlePosition = inRootSpace(model, model.shuttleGroup, scratchShuttle);
  scratchLeftShuttle.set(shuttlePosition.x - 0.75, shuttlePosition.y, shuttlePosition.z);
  scratchRightShuttle.set(shuttlePosition.x + 0.75, shuttlePosition.y, shuttlePosition.z);
  setBeamBetween(model.leftPickerStave, LEFT_PICKER_ANCHOR, scratchLeftShuttle);
  setBeamBetween(model.rightPickerStave, RIGHT_PICKER_ANCHOR, scratchRightShuttle);

  const upperAttribute = model.upperThreadLine.geometry.getAttribute(
    "position",
  ) as THREE.BufferAttribute;
  const upper = upperAttribute.array as Float32Array;
  const needleEyePoint = inRootSpace(model, model.needleEye, scratchNeedleEye);
  const liftPoint = inRootSpace(model, model.liftingGuide, scratchLiftGuide);
  const loopRadius = state.loopOpen ? 0.16 + state.loopWidth * 0.012 : 0.035;
  const fabricPoint = scratchRootPoint.set(
    needleEyePoint.x + 0.04,
    Math.max(-1.06, needleEyePoint.y - 0.18),
    0.12,
  );
  writePoint(upper, 0, scratchFeedPin.set(-0.95, 2.5, 0.24));
  writePoint(upper, 1, scratchFeedPawl.set(-0.15, 1.7, 0.2));
  writePoint(upper, 2, liftPoint);
  writePoint(upper, 3, needleEyePoint);
  writePoint(
    upper,
    4,
    scratchFeedPin.set(fabricPoint.x + loopRadius * 0.35, fabricPoint.y, loopRadius),
  );
  writePoint(upper, 5, fabricPoint);
  writePoint(
    upper,
    6,
    scratchFeedPawl.set(fabricPoint.x + loopRadius * 0.35, fabricPoint.y, -loopRadius),
  );
  writePoint(upper, 7, needleEyePoint);
  upperAttribute.needsUpdate = true;

  const lowerAttribute = model.lowerThreadLine.geometry.getAttribute(
    "position",
  ) as THREE.BufferAttribute;
  const lower = lowerAttribute.array as Float32Array;
  writePoint(lower, 0, shuttlePosition);
  writePoint(
    lower,
    1,
    scratchFeedPin.set(
      (shuttlePosition.x + fabricPoint.x) * 0.5,
      SHUTTLE_HOME_Y + 0.1,
      shuttlePosition.z,
    ),
  );
  writePoint(lower, 2, fabricPoint);
  writePoint(lower, 3, scratchFeedPawl.set(fabricPoint.x - 0.8, fabricPoint.y, 0.12));
  lowerAttribute.needsUpdate = true;

  const feedCamPoint = inRootSpace(model, model.feedCamPin, scratchFeedPin);
  const feedPawlPoint = scratchFeedPawl.set(-1.15, -0.78, 0.82);
  const feedLink = model.rootGroup.getObjectByName("S/T — feed arm and claw");
  if (feedLink instanceof THREE.Mesh) {
    setBeamBetween(
      feedLink,
      scratchFeedPin.set(feedCamPoint.x + 0.3, feedCamPoint.y, 0.65),
      feedPawlPoint,
    );
  }
}
