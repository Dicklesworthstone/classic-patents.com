import * as THREE from "three";
import type {
  ClavelDeltaRobotTopologyState,
  ClavelDeltaVec3,
} from "@/physics/clavelDeltaRobotKernel";

export interface ClavelDeltaRobotModel {
  readonly root: THREE.Group;
  readonly updatePose: (state: ClavelDeltaRobotTopologyState) => void;
  readonly dispose: () => void;
}

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

  const base = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(1.52, 1.52, 0.15, 3)),
    baseMaterial,
  );
  base.name = "Base member 1";
  base.rotation.y = Math.PI / 2;
  base.position.y = 0.72;
  base.receiveShadow = true;
  root.add(base);

  const topologyGroup = new THREE.Group();
  topologyGroup.name = "Claim 1 three-actuator parallel topology";
  root.add(topologyGroup);

  const armMaterials = [cyanMaterial, amberMaterial, violetMaterial] as const;
  const armGeometry = geometry(new THREE.CylinderGeometry(0.07, 0.085, 1, 18));
  const lowerGeometry = geometry(new THREE.CylinderGeometry(0.034, 0.034, 1, 14));
  const jointGeometry = geometry(new THREE.SphereGeometry(0.09, 18, 14));
  const fixedMotorGeometry = geometry(new THREE.CylinderGeometry(0.16, 0.16, 0.42, 24));

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
    const upperJointA = new THREE.Mesh(jointGeometry, lowerMaterial);
    upperJointA.name = "Cardan joint 6a";
    const upperJointB = new THREE.Mesh(jointGeometry, lowerMaterial);
    upperJointB.name = "Cardan joint 6b";
    const lowerBarA = new THREE.Mesh(lowerGeometry, lowerMaterial);
    lowerBarA.name = "Linking bar 5a";
    const lowerBarB = new THREE.Mesh(lowerGeometry, lowerMaterial);
    lowerBarB.name = "Linking bar 5b";
    const lowerJointA = new THREE.Mesh(jointGeometry, lowerMaterial);
    lowerJointA.name = "Cardan joint 7a";
    const lowerJointB = new THREE.Mesh(jointGeometry, lowerMaterial);
    lowerJointB.name = "Cardan joint 7b";
    group.add(
      housing,
      axis,
      upperArm,
      upperJointA,
      upperJointB,
      lowerBarA,
      lowerBarB,
      lowerJointA,
      lowerJointB,
    );
    topologyGroup.add(group);
    return {
      group,
      housing,
      axis,
      upperArm,
      upperJointA,
      upperJointB,
      lowerBarA,
      lowerBarB,
      lowerJointA,
      lowerJointB,
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
  const toolTip = new THREE.Mesh(geometry(new THREE.ConeGeometry(0.1, 0.18, 18)), toolMaterial);
  toolTip.name = "Tool tip";
  toolTip.position.y = -0.7;
  toolTip.rotation.x = Math.PI;
  toolGroup.add(toolShaft, toolTip);
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
      part.upperJointA.position.copy(upperA);
      part.upperJointB.position.copy(upperB);
      part.lowerJointA.position.copy(lowerA);
      part.lowerJointB.position.copy(lowerB);
      setBeamBetween(part.lowerBarA, upperA, lowerA);
      setBeamBetween(part.lowerBarB, upperB, lowerB);
      part.lowerBarB.visible = state.pairedBarsVisible;
      part.upperJointB.visible = state.pairedBarsVisible;
      part.lowerJointB.visible = state.pairedBarsVisible;
    });

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
