import * as THREE from "three";
import type {
  StackhouseSourceControls,
  StackhouseSourcePose,
} from "@/physics/stackhouseSourceKernel";

export interface StackhouseSourceModel {
  readonly root: THREE.Group;
  readonly fixedForearmGroup: THREE.Group;
  readonly forearmRollGroup: THREE.Group;
  readonly firstObliqueTiltGroup: THREE.Group;
  readonly intermediateRollGroup: THREE.Group;
  readonly secondObliqueTiltGroup: THREE.Group;
  readonly toolRollGroup: THREE.Group;
  readonly offsetBridgeMesh: THREE.Mesh;
  readonly toolFlangeMesh: THREE.Mesh;
  readonly toolTipMesh: THREE.Mesh;
  readonly pointPMarkerMesh: THREE.Mesh;
  readonly update: (pose: StackhouseSourcePose, controls: StackhouseSourceControls) => void;
  readonly dispose: () => void;
}

function cylinderAlongZ(
  radius: number,
  length: number,
  material: THREE.Material,
  geometries: THREE.BufferGeometry[],
): THREE.Mesh {
  const geometry = new THREE.CylinderGeometry(radius, radius, length, 24);
  geometries.push(geometry);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = Math.PI / 2;
  return mesh;
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
  const housingMaterial = material({ color: 0x334155, roughness: 0.42, metalness: 0.72 });
  const outerShaftMaterial = material({ color: 0x0369a1, roughness: 0.28, metalness: 0.85 });
  const middleShaftMaterial = material({ color: 0x0ea5e9, roughness: 0.25, metalness: 0.82 });
  const innerShaftMaterial = material({ color: 0x7dd3fc, roughness: 0.2, metalness: 0.78 });
  const gearMaterial = material({ color: 0xd97706, roughness: 0.3, metalness: 0.84 });
  const toolMaterial = material({ color: 0x7e22ce, roughness: 0.32, metalness: 0.76 });
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

  const forearmHousing = cylinderAlongZ(0.2, 1.5, housingMaterial, geometries);
  forearmHousing.name = "ForearmSection6";
  forearmHousing.position.z = -0.75;
  fixedForearmGroup.add(forearmHousing);

  const shaftRadii = [0.14, 0.095, 0.05] as const;
  const shaftMaterials = [outerShaftMaterial, middleShaftMaterial, innerShaftMaterial] as const;
  const shaftNames = ["OuterForearmShaft15", "IntermediateForearmShaft16", "InnerForearmShaft19"];
  shaftRadii.forEach((radius, index) => {
    const shaft = cylinderAlongZ(radius, 1.4 + index * 0.025, shaftMaterials[index], geometries);
    shaft.name = shaftNames[index];
    shaft.position.z = -0.69;
    shaft.renderOrder = index;
    fixedForearmGroup.add(shaft);
  });

  const motorPlateGeometry = new THREE.BoxGeometry(0.72, 0.34, 0.12);
  geometries.push(motorPlateGeometry);
  const motorPlate = new THREE.Mesh(motorPlateGeometry, housingMaterial);
  motorPlate.name = "ElbowMotorHousing9d";
  motorPlate.position.z = -1.48;
  fixedForearmGroup.add(motorPlate);
  [-0.22, 0, 0.22].forEach((x, index) => {
    const motor = cylinderAlongZ(0.075, 0.25, shaftMaterials[index], geometries);
    motor.name = `HydraulicMotor9${String.fromCharCode(97 + index)}`;
    motor.position.set(x, 0, -1.62);
    fixedForearmGroup.add(motor);
  });

  const forearmRollGroup = new THREE.Group();
  forearmRollGroup.name = "AxisAARollAssembly";
  root.add(forearmRollGroup);
  forearmRollGroup.add(axisGuide("AxisAA", 0x38bdf8, geometries, materials));

  const firstGearGeometry = new THREE.ConeGeometry(0.18, 0.12, 28);
  geometries.push(firstGearGeometry);
  const firstGear = new THREE.Mesh(firstGearGeometry, gearMaterial);
  firstGear.name = "BevelGear17";
  firstGear.rotation.x = Math.PI / 2;
  firstGear.position.z = -0.015;
  forearmRollGroup.add(firstGear);

  const firstObliqueTiltGroup = new THREE.Group();
  firstObliqueTiltGroup.name = "AxisBBFixedObliqueMount";
  forearmRollGroup.add(firstObliqueTiltGroup);

  const intermediateRollGroup = new THREE.Group();
  intermediateRollGroup.name = "HousingShaft14aAxisBBRoll";
  firstObliqueTiltGroup.add(intermediateRollGroup);
  intermediateRollGroup.add(axisGuide("AxisBB", 0xf59e0b, geometries, materials));

  const secondGear = new THREE.Mesh(firstGearGeometry, gearMaterial);
  secondGear.name = "BevelGear18AndHousing14a";
  secondGear.rotation.x = -Math.PI / 2;
  secondGear.position.z = 0.035;
  intermediateRollGroup.add(secondGear);

  const intermediateHousing = cylinderAlongZ(0.145, 0.72, outerShaftMaterial, geometries);
  intermediateHousing.name = "RotatableHousingShaft14a";
  intermediateHousing.position.z = 0.34;
  intermediateRollGroup.add(intermediateHousing);

  const secondObliqueTiltGroup = new THREE.Group();
  secondObliqueTiltGroup.name = "AxisCCFixedObliqueMount";
  intermediateRollGroup.add(secondObliqueTiltGroup);

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

  const terminalShaft = cylinderAlongZ(0.092, 0.54, innerShaftMaterial, geometries);
  terminalShaft.name = "TerminalShaft26";
  terminalShaft.position.z = 0.25;
  toolRollGroup.add(terminalShaft);

  const flangeGeometry = new THREE.CylinderGeometry(0.17, 0.17, 0.08, 32);
  geometries.push(flangeGeometry);
  const toolFlangeMesh = new THREE.Mesh(flangeGeometry, toolMaterial);
  toolFlangeMesh.name = "MountingSurface14c";
  toolFlangeMesh.rotation.x = Math.PI / 2;
  toolFlangeMesh.position.z = 0.56;
  toolRollGroup.add(toolFlangeMesh);

  const tipGeometry = new THREE.ConeGeometry(0.055, 0.22, 20);
  geometries.push(tipGeometry);
  const toolTipMesh = new THREE.Mesh(tipGeometry, toolMaterial);
  toolTipMesh.name = "EndEffector11";
  toolTipMesh.rotation.x = Math.PI / 2;
  toolTipMesh.position.z = 0.71;
  toolRollGroup.add(toolTipMesh);

  const pointGeometry = new THREE.SphereGeometry(0.04, 20, 16);
  geometries.push(pointGeometry);
  const pointPMarkerMesh = new THREE.Mesh(pointGeometry, pointMaterial);
  pointPMarkerMesh.name = "PreferredAxisIntersectionPointP";
  root.add(pointPMarkerMesh);

  const update = (pose: StackhouseSourcePose, _controls: StackhouseSourceControls) => {
    forearmRollGroup.rotation.z = pose.thetaARad;
    firstObliqueTiltGroup.rotation.y = pose.alphaABRad;
    intermediateRollGroup.rotation.z = pose.thetaBRad;
    secondObliqueTiltGroup.rotation.y = -pose.alphaBCRad;
    secondObliqueTiltGroup.position.x = pose.terminalAxisOffset;
    toolRollGroup.rotation.z = pose.thetaCRad;

    offsetBridgeMesh.visible = pose.terminalAxisOffset > 0;
    offsetBridgeMesh.scale.set(Math.max(pose.terminalAxisOffset, 0.001), 1, 1);
    offsetBridgeMesh.position.set(pose.terminalAxisOffset / 2, 0, 0);
    root.updateMatrixWorld(true);
  };

  return {
    root,
    fixedForearmGroup,
    forearmRollGroup,
    firstObliqueTiltGroup,
    intermediateRollGroup,
    secondObliqueTiltGroup,
    toolRollGroup,
    offsetBridgeMesh,
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
