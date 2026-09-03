import * as THREE from "three";
import type {
  StackhouseSourceControls,
  StackhouseSourcePose,
} from "@/physics/stackhouseSourceKernel";

export interface StackhouseSourceModel {
  readonly root: THREE.Group;
  readonly fixedForearmGroup: THREE.Group;
  readonly forearmRollGroup: THREE.Group;
  readonly intermediateInputGroup: THREE.Group;
  readonly innerInputGroup: THREE.Group;
  readonly firstObliqueTiltGroup: THREE.Group;
  readonly intermediateRollGroup: THREE.Group;
  readonly internalDriveGroup: THREE.Group;
  readonly secondObliqueTiltGroup: THREE.Group;
  readonly toolRollGroup: THREE.Group;
  readonly motorRotorGroups: readonly THREE.Group[];
  readonly bevelGearMeshes: readonly THREE.Mesh[];
  readonly wristBearingMeshes: readonly THREE.Mesh[];
  readonly offsetBridgeMesh: THREE.Mesh;
  readonly terminalHousingMesh: THREE.Mesh;
  readonly toolFlangeMesh: THREE.Mesh;
  readonly toolTipMesh: THREE.Mesh;
  readonly pointPMarkerMesh: THREE.Mesh;
  readonly update: (pose: StackhouseSourcePose, controls: StackhouseSourceControls) => void;
  readonly dispose: () => void;
}

function box(
  dimensions: readonly [number, number, number],
  material: THREE.Material,
  geometries: THREE.BufferGeometry[],
): THREE.Mesh {
  const geometry = new THREE.BoxGeometry(...dimensions);
  geometries.push(geometry);
  return new THREE.Mesh(geometry, material);
}

function cylinderAlongZ(
  radius: number,
  length: number,
  material: THREE.Material,
  geometries: THREE.BufferGeometry[],
  options: {
    radialSegments?: number;
    openEnded?: boolean;
    thetaStart?: number;
    thetaLength?: number;
  } = {},
): THREE.Mesh {
  const geometry = new THREE.CylinderGeometry(
    radius,
    radius,
    length,
    options.radialSegments ?? 24,
    1,
    options.openEnded ?? false,
    options.thetaStart ?? 0,
    options.thetaLength ?? Math.PI * 2,
  );
  geometries.push(geometry);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = Math.PI / 2;
  return mesh;
}

function cutawayShellAlongZ(
  radius: number,
  length: number,
  material: THREE.Material,
  geometries: THREE.BufferGeometry[],
): THREE.Mesh {
  return cylinderAlongZ(radius, length, material, geometries, {
    radialSegments: 36,
    openEnded: true,
    // The missing quadrant faces the default camera. This geometry and its
    // partial translucency are explicit museum cutaway conventions, not
    // properties attributed to the source housing.
    thetaStart: Math.PI * 0.94,
    thetaLength: Math.PI * 1.5,
  });
}

function bearingRing(
  radius: number,
  tube: number,
  material: THREE.Material,
  geometries: THREE.BufferGeometry[],
): THREE.Mesh {
  const geometry = new THREE.TorusGeometry(radius, tube, 10, 32);
  geometries.push(geometry);
  return new THREE.Mesh(geometry, material);
}

interface GearResult {
  readonly group: THREE.Group;
  readonly body: THREE.Mesh;
}

function spurGear(
  name: string,
  radius: number,
  depth: number,
  material: THREE.Material,
  geometries: THREE.BufferGeometry[],
  toothCount = 16,
): GearResult {
  const group = new THREE.Group();
  group.name = `${name} rotating assembly`;
  const body = cylinderAlongZ(radius * 0.84, depth, material, geometries, {
    radialSegments: 32,
  });
  body.name = name;
  group.add(body);

  const toothGeometry = new THREE.BoxGeometry(
    (2 * Math.PI * radius * 0.54) / toothCount,
    radius * 0.18,
    depth * 0.86,
  );
  geometries.push(toothGeometry);
  const teeth = new THREE.InstancedMesh(toothGeometry, material, toothCount);
  teeth.name = `${name} teeth`;
  const toothTransform = new THREE.Object3D();
  for (let index = 0; index < toothCount; index += 1) {
    const angle = (index / toothCount) * Math.PI * 2;
    toothTransform.position.set(
      Math.cos(angle) * radius * 0.91,
      Math.sin(angle) * radius * 0.91,
      0,
    );
    toothTransform.rotation.set(0, 0, angle);
    toothTransform.updateMatrix();
    teeth.setMatrixAt(index, toothTransform.matrix);
  }
  teeth.instanceMatrix.needsUpdate = true;
  group.add(teeth);
  return { group, body };
}

function bevelGear(
  name: string,
  radius: number,
  depth: number,
  material: THREE.Material,
  geometries: THREE.BufferGeometry[],
  toothCount = 18,
): GearResult {
  const group = new THREE.Group();
  group.name = `${name} rotating assembly`;
  const bodyGeometry = new THREE.CylinderGeometry(radius * 0.42, radius * 0.82, depth, 36);
  geometries.push(bodyGeometry);
  const body = new THREE.Mesh(bodyGeometry, material);
  body.name = name;
  body.rotation.x = Math.PI / 2;
  group.add(body);

  const toothGeometry = new THREE.BoxGeometry(
    (2 * Math.PI * radius * 0.52) / toothCount,
    radius * 0.22,
    depth * 0.42,
  );
  geometries.push(toothGeometry);
  const teeth = new THREE.InstancedMesh(toothGeometry, material, toothCount);
  teeth.name = `${name} teeth`;
  const toothTransform = new THREE.Object3D();
  for (let index = 0; index < toothCount; index += 1) {
    const angle = (index / toothCount) * Math.PI * 2;
    toothTransform.position.set(
      Math.cos(angle) * radius * 0.78,
      Math.sin(angle) * radius * 0.78,
      -depth * 0.33,
    );
    toothTransform.rotation.set(0, 0, angle);
    toothTransform.updateMatrix();
    teeth.setMatrixAt(index, toothTransform.matrix);
  }
  teeth.instanceMatrix.needsUpdate = true;
  group.add(teeth);
  return { group, body };
}

function axisGuide(
  name: string,
  color: number,
  geometries: THREE.BufferGeometry[],
  materials: THREE.Material[],
): THREE.Line {
  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, -0.32),
    new THREE.Vector3(0, 0, 0.88),
  ]);
  const material = new THREE.LineDashedMaterial({ color, dashSize: 0.06, gapSize: 0.035 });
  geometries.push(geometry);
  materials.push(material);
  const line = new THREE.Line(geometry, material);
  line.name = name;
  line.computeLineDistances();
  return line;
}

/**
 * Connected drawing-space model of the source topology. Every moving assembly
 * is nested below the shaft/housing that physically carries it; no distal part
 * is positioned independently in world space.
 */
export function buildStackhouseSourceModel(): StackhouseSourceModel {
  const root = new THREE.Group();
  root.name = "StackhouseSourceBoundedManipulator";
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const material = (options: THREE.MeshStandardMaterialParameters) => {
    const value = new THREE.MeshStandardMaterial(options);
    materials.push(value);
    return value;
  };
  const housingMaterial = material({
    color: 0x334155,
    roughness: 0.42,
    metalness: 0.72,
    transparent: true,
    opacity: 0.3,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  housingMaterial.name = "Normalized cutaway housing material";
  const motorHousingMaterial = material({ color: 0x334155, roughness: 0.42, metalness: 0.72 });
  const bearingMaterial = material({ color: 0xcbd5e1, roughness: 0.23, metalness: 0.9 });
  const outerShaftMaterial = material({
    color: 0x0369a1,
    roughness: 0.28,
    metalness: 0.85,
    transparent: true,
    opacity: 0.78,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const middleShaftMaterial = material({
    color: 0x0ea5e9,
    roughness: 0.25,
    metalness: 0.82,
    transparent: true,
    opacity: 0.86,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const innerShaftMaterial = material({ color: 0x7dd3fc, roughness: 0.2, metalness: 0.78 });
  const gearMaterial = material({ color: 0xd97706, roughness: 0.3, metalness: 0.84 });
  const innerGearMaterial = material({ color: 0xfacc15, roughness: 0.28, metalness: 0.8 });
  const terminalGearMaterial = material({ color: 0xfb7185, roughness: 0.3, metalness: 0.76 });
  const toolMaterial = material({ color: 0x7e22ce, roughness: 0.32, metalness: 0.76 });
  const gripperMaterial = material({ color: 0x475569, roughness: 0.38, metalness: 0.72 });
  const pointMaterial = material({
    color: 0xef4444,
    emissive: 0x7f1d1d,
    emissiveIntensity: 0.8,
  });
  const contrastMaterial = material({
    color: 0xf97316,
    roughness: 0.5,
    metalness: 0.45,
  });

  const fixedForearmGroup = new THREE.Group();
  fixedForearmGroup.name = "FixedForearmAndElbowMotors";
  root.add(fixedForearmGroup);

  const forearmHousing = cutawayShellAlongZ(0.2, 1.5, housingMaterial, geometries);
  forearmHousing.name = "ForearmSection6";
  forearmHousing.position.z = -0.75;
  fixedForearmGroup.add(forearmHousing);

  const motorPlate = box([0.86, 0.66, 0.14], motorHousingMaterial, geometries);
  motorPlate.name = "ElbowMotorHousing9d";
  motorPlate.position.z = -1.5;
  fixedForearmGroup.add(motorPlate);

  const forearmRollGroup = new THREE.Group();
  forearmRollGroup.name = "AxisAARollAssembly driven by shaft 15";
  root.add(forearmRollGroup);
  forearmRollGroup.add(axisGuide("AxisAA", 0x38bdf8, geometries, materials));

  const intermediateInputGroup = new THREE.Group();
  intermediateInputGroup.name = "IntermediateForearmShaft16Input";
  root.add(intermediateInputGroup);

  const innerInputGroup = new THREE.Group();
  innerInputGroup.name = "InnerForearmShaft19And20Input";
  root.add(innerInputGroup);

  const shaftGroups = [forearmRollGroup, intermediateInputGroup, innerInputGroup] as const;
  const shaftRadii = [0.14, 0.095, 0.05] as const;
  const shaftMaterials = [outerShaftMaterial, middleShaftMaterial, innerShaftMaterial] as const;
  const shaftNames = ["OuterForearmShaft15", "IntermediateForearmShaft16", "InnerForearmShaft19"];
  shaftRadii.forEach((radius, index) => {
    const shaft =
      index < 2
        ? cutawayShellAlongZ(radius, 1.43 + index * 0.018, shaftMaterials[index], geometries)
        : cylinderAlongZ(radius, 1.47, shaftMaterials[index], geometries);
    shaft.name = shaftNames[index];
    shaft.position.z = -0.71;
    shaft.renderOrder = index;
    shaftGroups[index].add(shaft);

    const phaseKey = box(
      [Math.max(0.018, radius * 0.22), Math.max(0.018, radius * 0.22), 1.25],
      shaftMaterials[index],
      geometries,
    );
    phaseKey.name = `${shaftNames[index]} phase witness`;
    phaseKey.position.set(radius * 0.82, 0, -0.72);
    shaftGroups[index].add(phaseKey);
  });

  const driveGearZ = [-1.34, -1.18, -1.02] as const;
  // Figure 4's printed routing is 9a -> shaft 15, 9c -> shaft 16,
  // and 9b -> shaft 19. Array order here follows the concentric shafts.
  const motorLetters = ["a", "c", "b"] as const;
  const motorPositions = [
    [-0.25, -0.15],
    [0.25, -0.15],
    [0, 0.29],
  ] as const;
  const motorRotorGroups: THREE.Group[] = [];
  motorPositions.forEach(([x, y], index) => {
    const motorLetter = motorLetters[index];
    const motor = cylinderAlongZ(0.105, 0.36, motorHousingMaterial, geometries);
    motor.name = `HydraulicMotor9${motorLetter}`;
    motor.position.set(x, y, -1.74);
    fixedForearmGroup.add(motor);

    const rotorGroup = new THREE.Group();
    rotorGroup.name = `HydraulicMotor9${motorLetter}Rotor`;
    rotorGroup.position.set(x, y, 0);
    const rotorShaft = cylinderAlongZ(0.026, 0.5, shaftMaterials[index], geometries);
    rotorShaft.position.z = -1.48;
    rotorGroup.add(rotorShaft);
    const pinion = spurGear(
      `Motor9${motorLetter}SpurPinion`,
      0.098,
      0.065,
      shaftMaterials[index],
      geometries,
      14,
    );
    pinion.group.position.z = driveGearZ[index];
    rotorGroup.add(pinion.group);
    root.add(rotorGroup);
    motorRotorGroups.push(rotorGroup);

    const driven = spurGear(
      `ForearmShaft${[15, 16, 19][index]}DrivenSpurGear`,
      0.205,
      0.06,
      shaftMaterials[index],
      geometries,
      22,
    );
    driven.group.position.z = driveGearZ[index];
    shaftGroups[index].add(driven.group);
  });

  const firstGear = bevelGear(
    "BevelGear17 on intermediate forearm shaft 16",
    0.19,
    0.12,
    gearMaterial,
    geometries,
  );
  firstGear.group.position.z = -0.105;
  intermediateInputGroup.add(firstGear.group);

  const firstObliqueTiltGroup = new THREE.Group();
  firstObliqueTiltGroup.name = "HousingPortion14bAxisBBBearingCarrier";
  forearmRollGroup.add(firstObliqueTiltGroup);
  firstObliqueTiltGroup.add(axisGuide("AxisBB", 0xf59e0b, geometries, materials));

  const wristBearingMeshes: THREE.Mesh[] = [];
  for (const z of [0.08, 0.59]) {
    const ring = bearingRing(0.177, 0.027, bearingMaterial, geometries);
    ring.name = `Housing14b axis B bearing at ${z}`;
    ring.position.z = z;
    firstObliqueTiltGroup.add(ring);
    wristBearingMeshes.push(ring);
  }
  for (const x of [-0.195, 0.195]) {
    const carrierRail = box([0.045, 0.055, 0.57], motorHousingMaterial, geometries);
    carrierRail.name = `SplitHousing14b carrier rail ${x < 0 ? "left" : "right"}`;
    carrierRail.position.set(x, 0, 0.335);
    firstObliqueTiltGroup.add(carrierRail);
  }

  const intermediateRollGroup = new THREE.Group();
  intermediateRollGroup.name = "HousingShaft14aAxisBBRoll";
  firstObliqueTiltGroup.add(intermediateRollGroup);
  const secondGear = bevelGear(
    "BevelGear18 on housing shaft 14a",
    0.19,
    0.12,
    gearMaterial,
    geometries,
  );
  secondGear.group.position.z = -0.105;
  intermediateRollGroup.add(secondGear.group);

  const intermediateHousing = cutawayShellAlongZ(0.145, 0.72, outerShaftMaterial, geometries);
  intermediateHousing.name = "RotatableHousingShaft14a";
  intermediateHousing.position.z = 0.34;
  intermediateRollGroup.add(intermediateHousing);

  const housingPhaseKey = box([0.026, 0.03, 0.56], gearMaterial, geometries);
  housingPhaseKey.name = "HousingShaft14a phase witness";
  housingPhaseKey.position.set(0.135, 0, 0.36);
  intermediateRollGroup.add(housingPhaseKey);

  const internalDriveGroup = new THREE.Group();
  internalDriveGroup.name = "InternalDriveShaft23IndependentRoll";
  firstObliqueTiltGroup.add(internalDriveGroup);
  const intermediateDriveShaft = cylinderAlongZ(0.055, 0.72, innerShaftMaterial, geometries);
  intermediateDriveShaft.name = "InternalDriveShaft23";
  intermediateDriveShaft.position.z = 0.34;
  internalDriveGroup.add(intermediateDriveShaft);
  const internalPhaseKey = box([0.018, 0.018, 0.6], innerGearMaterial, geometries);
  internalPhaseKey.name = "InternalDriveShaft23 phase witness";
  internalPhaseKey.position.set(0.048, 0, 0.35);
  internalDriveGroup.add(internalPhaseKey);

  const innerInputGear = bevelGear(
    "BevelGear21 on inner forearm shaft 20",
    0.12,
    0.085,
    innerGearMaterial,
    geometries,
  );
  innerInputGear.group.position.z = 0.075;
  innerInputGroup.add(innerInputGear.group);
  const innerDrivenGear = bevelGear(
    "BevelGear22 on internal shaft 23",
    0.12,
    0.085,
    innerGearMaterial,
    geometries,
  );
  innerDrivenGear.group.position.z = 0.075;
  internalDriveGroup.add(innerDrivenGear.group);

  const secondObliqueTiltGroup = new THREE.Group();
  secondObliqueTiltGroup.name = "AxisCCBearingCarrier on housing shaft 14a";
  intermediateRollGroup.add(secondObliqueTiltGroup);

  const terminalHousingMesh = cutawayShellAlongZ(0.132, 0.62, housingMaterial, geometries);
  terminalHousingMesh.name = "TerminalShaft26BearingHousing";
  terminalHousingMesh.position.z = 0.29;
  secondObliqueTiltGroup.add(terminalHousingMesh);
  for (const z of [0.08, 0.5]) {
    const ring = bearingRing(0.135, 0.022, bearingMaterial, geometries);
    ring.name = `Terminal shaft 26 bearing at ${z}`;
    ring.position.z = z;
    secondObliqueTiltGroup.add(ring);
    wristBearingMeshes.push(ring);
  }

  const bridgeGeometry = new THREE.BoxGeometry(1, 0.12, 0.12);
  geometries.push(bridgeGeometry);
  const offsetBridgeMesh = new THREE.Mesh(bridgeGeometry, contrastMaterial);
  offsetBridgeMesh.name = "OffsetAxisContrastBridge";
  offsetBridgeMesh.visible = false;
  intermediateRollGroup.add(offsetBridgeMesh);

  const toolRollGroup = new THREE.Group();
  toolRollGroup.name = "TerminalShaft26AxisCCRoll";
  secondObliqueTiltGroup.add(toolRollGroup);
  toolRollGroup.add(axisGuide("AxisCC", 0xc084fc, geometries, materials));

  const terminalShaft = cylinderAlongZ(0.067, 0.58, innerShaftMaterial, geometries);
  terminalShaft.name = "TerminalShaft26";
  terminalShaft.position.z = 0.25;
  toolRollGroup.add(terminalShaft);

  const terminalInputGear = bevelGear(
    "BevelGear24 on internal shaft 23",
    0.105,
    0.075,
    terminalGearMaterial,
    geometries,
    16,
  );
  terminalInputGear.group.position.z = -0.14;
  internalDriveGroup.add(terminalInputGear.group);
  const terminalDrivenGear = bevelGear(
    "BevelGear25 on terminal shaft 26",
    0.105,
    0.075,
    terminalGearMaterial,
    geometries,
    16,
  );
  terminalDrivenGear.group.position.z = -0.14;
  toolRollGroup.add(terminalDrivenGear.group);

  const flangeGeometry = new THREE.CylinderGeometry(0.17, 0.17, 0.08, 32);
  geometries.push(flangeGeometry);
  const toolFlangeMesh = new THREE.Mesh(flangeGeometry, toolMaterial);
  toolFlangeMesh.name = "MountingSurface14c";
  toolFlangeMesh.rotation.x = Math.PI / 2;
  toolFlangeMesh.position.z = 0.56;
  toolRollGroup.add(toolFlangeMesh);

  const toolTipMesh = box([0.15, 0.11, 0.15], gripperMaterial, geometries);
  toolTipMesh.name = "EndEffector11";
  toolTipMesh.position.z = 0.675;
  toolRollGroup.add(toolTipMesh);
  for (const x of [-0.06, 0.06]) {
    const jaw = box([0.045, 0.055, 0.22], toolMaterial, geometries);
    jaw.name = `EndEffector11 ${x < 0 ? "left" : "right"} jaw`;
    jaw.position.set(x, 0, 0.81);
    toolRollGroup.add(jaw);
  }

  const pointGeometry = new THREE.SphereGeometry(0.04, 20, 16);
  geometries.push(pointGeometry);
  const pointPMarkerMesh = new THREE.Mesh(pointGeometry, pointMaterial);
  pointPMarkerMesh.name = "PreferredAxisIntersectionPointP";
  root.add(pointPMarkerMesh);

  const bevelGearMeshes = [
    firstGear.body,
    secondGear.body,
    innerInputGear.body,
    innerDrivenGear.body,
    terminalInputGear.body,
    terminalDrivenGear.body,
  ];

  const update = (pose: StackhouseSourcePose, _controls: StackhouseSourceControls) => {
    forearmRollGroup.rotation.z = pose.thetaARad;
    intermediateInputGroup.rotation.z = -pose.thetaBRad;
    innerInputGroup.rotation.z = pose.thetaCRad;
    firstObliqueTiltGroup.rotation.y = pose.alphaABRad;
    intermediateRollGroup.rotation.z = pose.thetaBRad;
    internalDriveGroup.rotation.z = -pose.thetaCRad;
    secondObliqueTiltGroup.rotation.y = -pose.alphaBCRad;
    secondObliqueTiltGroup.position.x = pose.terminalAxisOffset;
    toolRollGroup.rotation.z = pose.thetaCRad;

    motorRotorGroups[0].rotation.z = -pose.thetaARad * 2;
    motorRotorGroups[1].rotation.z = pose.thetaBRad * 2;
    motorRotorGroups[2].rotation.z = -pose.thetaCRad * 2;

    offsetBridgeMesh.visible = pose.terminalAxisOffset > 0;
    offsetBridgeMesh.scale.set(Math.max(pose.terminalAxisOffset, 0.001), 1, 1);
    offsetBridgeMesh.position.set(pose.terminalAxisOffset / 2, 0, 0);
    root.updateMatrixWorld(true);
  };

  return {
    root,
    fixedForearmGroup,
    forearmRollGroup,
    intermediateInputGroup,
    innerInputGroup,
    firstObliqueTiltGroup,
    intermediateRollGroup,
    internalDriveGroup,
    secondObliqueTiltGroup,
    toolRollGroup,
    motorRotorGroups,
    bevelGearMeshes,
    wristBearingMeshes,
    offsetBridgeMesh,
    terminalHousingMesh,
    toolFlangeMesh,
    toolTipMesh,
    pointPMarkerMesh,
    update,
    dispose: () => {
      for (const geometry of new Set(geometries)) geometry.dispose();
      for (const item of new Set(materials)) item.dispose();
    },
  };
}
