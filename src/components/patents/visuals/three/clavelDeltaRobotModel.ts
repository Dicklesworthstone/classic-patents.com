import * as THREE from "three";
import type {
  ClavelDeltaRobotTopologyState,
  ClavelDeltaVec3,
} from "@/physics/clavelDeltaRobotKernel";
import { stepClavelDeltaRobotTopology } from "@/physics/clavelDeltaRobotKernel";

export interface ClavelDeltaRobotModel {
  readonly root: THREE.Group;
  readonly updatePose: (state: ClavelDeltaRobotTopologyState) => void;
  readonly dispose: () => void;
}

export const CLAVEL_EXHIBIT_FLOOR_Y = -2.18;
const CLAVEL_BASE_CENTER_Y = 0.72;
const CLAVEL_BASE_THICKNESS = 0.15;

function point([x, y, z]: ClavelDeltaVec3): THREE.Vector3 {
  return new THREE.Vector3(x, y, z);
}

function setBeamBetween(mesh: THREE.Mesh, start: THREE.Vector3, end: THREE.Vector3) {
  const direction = end.clone().sub(start);
  const beamLength = direction.length();
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.scale.set(1, Math.max(0.0001, beamLength), 1);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
}

/**
 * Procedural, normalized Figure 1 teaching model. The named pieces follow the
 * grant's base / axis / arm / paired-bar / movable-member vocabulary; this is
 * not a commercial Delta robot mesh or a geometric reconstruction with
 * unprinted dimensions.
 */
export function buildClavelDeltaRobotModel(): ClavelDeltaRobotModel {
  const root = new THREE.Group();
  root.name = "US 4,976,582 normalized Clavel Delta topology exhibit";
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

  const baseMaterial = material(
    new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.82, roughness: 0.28 }),
  );
  const cyanMaterial = material(
    new THREE.MeshStandardMaterial({ color: 0x06b6d4, metalness: 0.58, roughness: 0.22 }),
  );
  const amberMaterial = material(
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.58, roughness: 0.24 }),
  );
  const violetMaterial = material(
    new THREE.MeshStandardMaterial({ color: 0xa78bfa, metalness: 0.52, roughness: 0.26 }),
  );
  const lowerMaterial = material(
    new THREE.MeshStandardMaterial({ color: 0xdbeafe, metalness: 0.7, roughness: 0.18 }),
  );
  const platformMaterial = material(
    new THREE.MeshStandardMaterial({
      color: 0x155e75,
      metalness: 0.66,
      roughness: 0.2,
      emissive: new THREE.Color(0x082f49),
      emissiveIntensity: 0.25,
    }),
  );
  const toolMaterial = material(
    new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      metalness: 0.76,
      roughness: 0.16,
      emissive: new THREE.Color(0x78350f),
      emissiveIntensity: 0.14,
    }),
  );
  const supportMaterial = material(
    new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.72, roughness: 0.34 }),
  );

  const base = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(1.52, 1.52, 0.15, 3)),
    baseMaterial,
  );
  base.name = "Base member 1";
  // CylinderGeometry's three outer vertices begin at +Z, -30°, and -150°.
  // A half-turn puts them on the same -90° / 30° / 150° radials as the three
  // source-labelled fixed actuator pivots instead of leaving those housings
  // outside the triangular base plate.
  base.rotation.y = Math.PI;
  base.position.y = CLAVEL_BASE_CENTER_Y;
  base.receiveShadow = true;
  root.add(base);

  // The grant calls member 1 fixed but does not claim or dimension a building
  // support. This deliberately neutral exhibit gantry closes that fixed-world
  // boundary without presenting it as a patent part. Its three posts sit on
  // the scene floor and its short radial headers overlap the base underside.
  const supportGroup = new THREE.Group();
  supportGroup.name = "Fixed-world exhibit gantry (not a patent part)";
  supportGroup.userData.sourceStatus = "exhibit-support-not-a-patent-part";
  const baseUndersideY = CLAVEL_BASE_CENTER_Y - CLAVEL_BASE_THICKNESS / 2;
  const postHeight = baseUndersideY - CLAVEL_EXHIBIT_FLOOR_Y;
  const postGeometry = geometry(new THREE.BoxGeometry(0.12, postHeight, 0.12));
  const footGeometry = geometry(new THREE.BoxGeometry(0.42, 0.07, 0.42));
  const headerGeometry = geometry(new THREE.CylinderGeometry(0.055, 0.055, 1, 14));
  for (let index = 0; index < 3; index += 1) {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / 3;
    const radialDirection = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));
    const postTop = radialDirection.clone().multiplyScalar(1.78);
    postTop.y = baseUndersideY;
    const baseAnchor = radialDirection.clone().multiplyScalar(1.28);
    baseAnchor.y = baseUndersideY;

    const post = new THREE.Mesh(postGeometry, supportMaterial);
    post.name = `Exhibit support post ${index + 1} (not a patent part)`;
    post.position.copy(postTop);
    post.position.y = CLAVEL_EXHIBIT_FLOOR_Y + postHeight / 2;
    post.castShadow = true;
    post.receiveShadow = true;

    const foot = new THREE.Mesh(footGeometry, supportMaterial);
    foot.name = `Exhibit floor foot ${index + 1} (not a patent part)`;
    foot.position.copy(postTop);
    foot.position.y = CLAVEL_EXHIBIT_FLOOR_Y + 0.035;
    foot.receiveShadow = true;

    const header = new THREE.Mesh(headerGeometry, supportMaterial);
    header.name = `Exhibit base header ${index + 1} (not a patent part)`;
    setBeamBetween(header, postTop, baseAnchor);
    header.castShadow = true;
    supportGroup.add(post, foot, header);
  }
  root.add(supportGroup);

  const topologyGroup = new THREE.Group();
  topologyGroup.name = "Claim 1 three-actuator parallel topology";
  root.add(topologyGroup);

  const armMaterials = [cyanMaterial, amberMaterial, violetMaterial] as const;
  const armGeometry = geometry(new THREE.CylinderGeometry(0.07, 0.085, 1, 18));
  const lowerGeometry = geometry(new THREE.CylinderGeometry(0.034, 0.034, 1, 14));
  const jointGeometry = geometry(new THREE.SphereGeometry(0.09, 18, 14));
  const fixedMotorGeometry = geometry(new THREE.CylinderGeometry(0.16, 0.16, 0.42, 24));
  const createNamedInstancedPart = (name: string, meshGeometry: THREE.BufferGeometry) => {
    const instances = new THREE.InstancedMesh(meshGeometry, lowerMaterial, 3);
    instances.name = name;
    instances.userData.actuatorIndices = [1, 2, 3];
    instances.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    topologyGroup.add(instances);
    return instances;
  };
  const upperJointAInstances = createNamedInstancedPart("Cardan joint 6a", jointGeometry);
  const upperJointBInstances = createNamedInstancedPart("Cardan joint 6b", jointGeometry);
  const lowerBarAInstances = createNamedInstancedPart("Linking bar 5a", lowerGeometry);
  const lowerBarBInstances = createNamedInstancedPart("Linking bar 5b", lowerGeometry);
  const lowerJointAInstances = createNamedInstancedPart("Cardan joint 7a", jointGeometry);
  const lowerJointBInstances = createNamedInstancedPart("Cardan joint 7b", jointGeometry);
  const instancedArticulation = [
    upperJointAInstances,
    upperJointBInstances,
    lowerBarAInstances,
    lowerBarBInstances,
    lowerJointAInstances,
    lowerJointBInstances,
  ] as const;
  const positiveYAxis = new THREE.Vector3(0, 1, 0);
  const instanceDirection = new THREE.Vector3();
  const instancePosition = new THREE.Vector3();
  const instanceQuaternion = new THREE.Quaternion();
  const instanceScale = new THREE.Vector3();
  const instanceMatrix = new THREE.Matrix4();
  const setInstancedPoint = (
    instances: THREE.InstancedMesh,
    index: number,
    position: THREE.Vector3,
  ) => {
    instanceMatrix.makeTranslation(position.x, position.y, position.z);
    instances.setMatrixAt(index, instanceMatrix);
  };
  const setInstancedBeamBetween = (
    instances: THREE.InstancedMesh,
    index: number,
    start: THREE.Vector3,
    end: THREE.Vector3,
  ) => {
    instanceDirection.subVectors(end, start);
    const beamLength = instanceDirection.length();
    instancePosition.addVectors(start, end).multiplyScalar(0.5);
    instanceQuaternion.setFromUnitVectors(positiveYAxis, instanceDirection.normalize());
    instanceScale.set(1, Math.max(0.0001, beamLength), 1);
    instanceMatrix.compose(instancePosition, instanceQuaternion, instanceScale);
    instances.setMatrixAt(index, instanceMatrix);
  };

  const armParts = [0, 1, 2].map((index) => {
    const group = new THREE.Group();
    group.name = `Actuator ${index + 1}, axis 2, fixed portion 3, control arm 4`;
    const mat = armMaterials[index] ?? cyanMaterial;
    const housing = new THREE.Mesh(fixedMotorGeometry, mat);
    housing.name = "Fixed actuator portion 3";
    const axis = new THREE.Mesh(
      geometry(new THREE.CylinderGeometry(0.055, 0.055, 0.44, 16)),
      baseMaterial,
    );
    axis.name = "Rotary axis 2";
    axis.rotation.z = Math.PI / 2;
    const upperArm = new THREE.Mesh(armGeometry, mat);
    upperArm.name = "Control arm 4";
    group.add(housing, axis, upperArm);
    topologyGroup.add(group);
    return {
      group,
      housing,
      axis,
      upperArm,
    };
  });

  const platform = new THREE.Mesh(
    geometry(new THREE.BoxGeometry(0.72, 0.1, 0.62)),
    platformMaterial,
  );
  platform.name = "Movable member 8";
  platform.castShadow = true;
  platform.receiveShadow = true;
  topologyGroup.add(platform);

  const toolGroup = new THREE.Group();
  toolGroup.name = "Working member 9 and longitudinal axis 10";
  const toolShaft = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.075, 0.075, 0.58, 18)),
    toolMaterial,
  );
  toolShaft.name = "Working member 9";
  toolShaft.position.y = -0.33;
  const gripperBridge = new THREE.Mesh(
    geometry(new THREE.BoxGeometry(0.44, 0.09, 0.12)),
    toolMaterial,
  );
  gripperBridge.name = "Working member 9 source-style gripper bridge";
  gripperBridge.position.y = -0.64;
  const jawGeometry = geometry(new THREE.BoxGeometry(0.09, 0.3, 0.1));
  const leftJaw = new THREE.Mesh(jawGeometry, toolMaterial);
  leftJaw.name = "Working member 9 gripper jaw A";
  leftJaw.position.set(-0.175, -0.79, 0);
  const rightJaw = new THREE.Mesh(jawGeometry, toolMaterial);
  rightJaw.name = "Working member 9 gripper jaw B";
  rightJaw.position.set(0.175, -0.79, 0);
  const orientationMarker = new THREE.Mesh(
    geometry(new THREE.SphereGeometry(0.055, 14, 10)),
    cyanMaterial,
  );
  orientationMarker.name = "Tool-axis exhibit orientation marker (not a patent part)";
  orientationMarker.position.set(-0.175, -0.96, 0);
  toolGroup.add(toolShaft, gripperBridge, leftJaw, rightJaw, orientationMarker);
  topologyGroup.add(toolGroup);

  const supplementaryMotor = new THREE.Group();
  supplementaryMotor.name = "Base-mounted supplementary motor 11 and telescopic arm 14";
  const motor = new THREE.Mesh(fixedMotorGeometry, toolMaterial);
  motor.name = "Supplementary motor 11";
  motor.position.set(0, 0.93, -0.1);
  motor.rotation.z = Math.PI / 2;
  const transmission = new THREE.Mesh(lowerGeometry, toolMaterial);
  transmission.name = "Telescopic arm 14";
  supplementaryMotor.add(motor, transmission);
  topologyGroup.add(supplementaryMotor);

  const updatePose = (state: ClavelDeltaRobotTopologyState) => {
    topologyGroup.visible = state.topologyVisible;
    state.legs.forEach((leg, index) => {
      const part = armParts[index];
      if (!part) return;
      const basePivot = point(leg.basePivot);
      const controlArmEnd = point(leg.controlArmEnd);
      const upperA = point(leg.upperJointA);
      const upperB = point(leg.upperJointB);
      const lowerA = point(leg.lowerJointA);
      const lowerB = point(leg.lowerJointB);

      part.housing.position.copy(basePivot);
      part.housing.position.y += 0.05;
      part.axis.position.copy(basePivot);
      setBeamBetween(part.upperArm, basePivot, controlArmEnd);
      setInstancedPoint(upperJointAInstances, index, upperA);
      setInstancedPoint(upperJointBInstances, index, upperB);
      setInstancedPoint(lowerJointAInstances, index, lowerA);
      setInstancedPoint(lowerJointBInstances, index, lowerB);
      setInstancedBeamBetween(lowerBarAInstances, index, upperA, lowerA);
      setInstancedBeamBetween(lowerBarBInstances, index, upperB, lowerB);
    });
    for (const instances of instancedArticulation) {
      instances.instanceMatrix.needsUpdate = true;
      instances.computeBoundingSphere();
    }
    lowerBarBInstances.visible = state.pairedBarsVisible;
    upperJointBInstances.visible = state.pairedBarsVisible;
    lowerJointBInstances.visible = state.pairedBarsVisible;

    platform.position.copy(point(state.platformCenter));
    toolGroup.position.copy(point(state.platformCenter));
    toolGroup.rotation.y = state.toolAxisRotationRad;
    toolGroup.visible = state.toolAxisVisible;
    supplementaryMotor.visible = state.toolAxisVisible;
    if (state.toolAxisVisible) {
      const start = motor.position.clone();
      const end = point(state.platformCenter);
      end.y += 0.02;
      setBeamBetween(transmission, start, end);
    }
  };

  // Keep the model valid immediately after construction. The web scene applies
  // live controls on its next line, but native USDZ export consumes the root
  // returned by the builder directly. Without a default pose, every mechanism
  // component remains collapsed at the origin and only the triangular base is
  // visible in SceneKit.
  updatePose(stepClavelDeltaRobotTopology());

  return {
    root,
    updatePose,
    dispose: () => {
      for (const item of geometries) {
        item.dispose();
      }
      for (const item of materials) {
        item.dispose();
      }
    },
  };
}
