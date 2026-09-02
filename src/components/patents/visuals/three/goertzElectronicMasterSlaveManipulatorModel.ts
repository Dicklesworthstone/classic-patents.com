import * as THREE from "three";
import type { GoertzMasterSlavePose } from "@/physics/goertzElectronicMasterSlaveManipulatorKernel";

export interface GoertzElectronicMasterSlaveManipulatorModel {
  root: THREE.Group;
  updatePose: (pose: GoertzMasterSlavePose) => void;
  dispose: () => void;
}

interface ArmAssembly {
  base: THREE.Vector3;
  firstArm: THREE.Mesh;
  secondArm: THREE.Mesh;
  toolStem: THREE.Mesh;
  shoulder: THREE.Mesh;
  elbow: THREE.Mesh;
  wrist: THREE.Mesh;
  jawA: THREE.Mesh;
  jawB: THREE.Mesh;
  cableA: THREE.Line;
  cableB: THREE.Line;
}

function setRodBetween(mesh: THREE.Mesh, start: THREE.Vector3, end: THREE.Vector3) {
  const direction = end.clone().sub(start);
  const length = direction.length();
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.scale.set(1, Math.max(length, 0.0001), 1);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
}

function pointsForChannels(base: THREE.Vector3, channels: readonly number[]) {
  const shoulderAngle = (channels[0] ?? 0) * 0.78 + (channels[1] ?? 0) * 0.16;
  const elbowAngle = shoulderAngle + 0.58 + (channels[2] ?? 0) * 0.88;
  const wristAngle = elbowAngle + (channels[4] ?? 0) * 0.56;
  const lateral = (channels[3] ?? 0) * 0.34;
  const first = base
    .clone()
    .add(
      new THREE.Vector3(
        0.95 * Math.cos(shoulderAngle),
        0.34 + lateral,
        0.95 * Math.sin(shoulderAngle),
      ),
    );
  const second = first
    .clone()
    .add(new THREE.Vector3(0.82 * Math.cos(elbowAngle), -1.14, 0.82 * Math.sin(elbowAngle)));
  const tool = second
    .clone()
    .add(
      new THREE.Vector3(
        0.38 * Math.cos(wristAngle),
        -0.32 + (channels[5] ?? 0) * 0.22,
        0.38 * Math.sin(wristAngle),
      ),
    );
  return { first, second, tool, wristAngle };
}

/**
 * A procedural, normalized reconstruction of the articulated relationship in
 * US 2,846,084. It deliberately uses no commercial robot asset or unspecified
 * dimensions; every moving member is driven by the shared seven-channel kernel.
 */
export function buildGoertzElectronicMasterSlaveManipulatorModel(): GoertzElectronicMasterSlaveManipulatorModel {
  const root = new THREE.Group();
  root.name = "US 2,846,084 normalized bilateral master-slave manipulator exhibit";
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const geometry = <T extends THREE.BufferGeometry>(value: T): T => {
    geometries.push(value);
    return value;
  };
  const material = <T extends THREE.Material>(value: T): T => {
    materials.push(value);
    return value;
  };
  const steel = material(
    new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.82, roughness: 0.24 }),
  );
  const masterMat = material(
    new THREE.MeshStandardMaterial({ color: 0x06b6d4, metalness: 0.58, roughness: 0.24 }),
  );
  const slaveMat = material(
    new THREE.MeshStandardMaterial({ color: 0x8b5cf6, metalness: 0.56, roughness: 0.24 }),
  );
  const toolMat = material(
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.64, roughness: 0.2 }),
  );
  const cableMat = material(
    new THREE.LineBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.85 }),
  );
  const linkMat = material(
    new THREE.MeshStandardMaterial({ color: 0x155e75, emissive: 0x062f3d, roughness: 0.35 }),
  );
  const resistanceMat = material(
    new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0x7c2d12,
      emissiveIntensity: 0.35,
      roughness: 0.3,
      transparent: true,
      opacity: 0.8,
    }),
  );

  const floor = new THREE.Mesh(geometry(new THREE.BoxGeometry(7.4, 0.12, 3.4)), steel);
  floor.name = "normalized master and slave support floor";
  floor.position.y = -1.95;
  floor.receiveShadow = true;
  root.add(floor);

  const divider = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.08, 3.9, 2.6)), steel);
  divider.name = "sealed-cell separation plane";
  divider.position.set(0, -0.05, 0);
  root.add(divider);

  function createArm(
    baseX: number,
    armMaterial: THREE.MeshStandardMaterial,
    name: string,
  ): ArmAssembly {
    const base = new THREE.Vector3(baseX, -1.82, 0);
    const plinth = new THREE.Mesh(
      geometry(new THREE.CylinderGeometry(0.44, 0.58, 0.26, 32)),
      steel,
    );
    plinth.name = `${name} support 50`;
    plinth.position.copy(base);
    root.add(plinth);
    const mast = new THREE.Mesh(geometry(new THREE.CylinderGeometry(0.15, 0.18, 1.5, 24)), steel);
    mast.name = `${name} support upright`;
    mast.position.copy(base).add(new THREE.Vector3(0, 0.75, 0));
    root.add(mast);
    const firstArm = new THREE.Mesh(
      geometry(new THREE.CylinderGeometry(0.15, 0.18, 1, 24)),
      armMaterial,
    );
    firstArm.name = `${name} first arm 51`;
    const secondArm = new THREE.Mesh(
      geometry(new THREE.CylinderGeometry(0.13, 0.16, 1, 24)),
      armMaterial,
    );
    secondArm.name = `${name} second arm 52`;
    const toolStem = new THREE.Mesh(
      geometry(new THREE.CylinderGeometry(0.09, 0.11, 1, 20)),
      toolMat,
    );
    toolStem.name = `${name} tool 53 stem`;
    const jointGeometry = geometry(new THREE.SphereGeometry(0.21, 24, 18));
    const shoulder = new THREE.Mesh(jointGeometry, armMaterial);
    shoulder.name = `${name} axis 113b joint`;
    const elbow = new THREE.Mesh(jointGeometry, armMaterial);
    elbow.name = `${name} axis 126 joint`;
    const wrist = new THREE.Mesh(jointGeometry, toolMat);
    wrist.name = `${name} axes 171 and 172 tool joint`;
    const jawGeometry = geometry(new THREE.BoxGeometry(0.1, 0.28, 0.1));
    const jawA = new THREE.Mesh(jawGeometry, toolMat);
    jawA.name = `${name} grasper jaw A`;
    const jawB = new THREE.Mesh(jawGeometry, toolMat);
    jawB.name = `${name} grasper jaw B`;
    const cableGeometryA = geometry(new THREE.BufferGeometry());
    cableGeometryA.setFromPoints([base, base.clone(), base.clone(), base.clone()]);
    const cableGeometryB = geometry(new THREE.BufferGeometry());
    cableGeometryB.setFromPoints([base, base.clone(), base.clone(), base.clone()]);
    const cableA = new THREE.Line(cableGeometryA, cableMat);
    cableA.name = `${name} source cable route 160–164`;
    const cableB = new THREE.Line(cableGeometryB, cableMat);
    cableB.name = `${name} source cable route 175–176`;
    root.add(firstArm, secondArm, toolStem, shoulder, elbow, wrist, jawA, jawB, cableA, cableB);
    return {
      base: base.clone().add(new THREE.Vector3(0, 1.5, 0)),
      firstArm,
      secondArm,
      toolStem,
      shoulder,
      elbow,
      wrist,
      jawA,
      jawB,
      cableA,
      cableB,
    };
  }

  const master = createArm(-2.3, masterMat, "master");
  const slave = createArm(2.3, slaveMat, "slave");
  const channelLink = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.045, 0.045, 1, 16)),
    linkMat,
  );
  channelLink.name = "seven duplicated electrical correspondence systems";
  root.add(channelLink);
  const resistanceArrow = new THREE.Mesh(
    geometry(new THREE.ConeGeometry(0.16, 0.42, 20)),
    resistanceMat,
  );
  resistanceArrow.name = "Claim 9 reflected-resistance indicator";
  root.add(resistanceArrow);

  function updateArm(arm: ArmAssembly, channels: readonly number[]) {
    const points = pointsForChannels(arm.base, channels);
    setRodBetween(arm.firstArm, arm.base, points.first);
    setRodBetween(arm.secondArm, points.first, points.second);
    setRodBetween(arm.toolStem, points.second, points.tool);
    arm.shoulder.position.copy(arm.base);
    arm.elbow.position.copy(points.first);
    arm.wrist.position.copy(points.second);
    const jawSpread = 0.13 + (1 - (channels[6] ?? 0)) * 0.16;
    arm.jawA.position.copy(points.tool).add(new THREE.Vector3(0, jawSpread, 0));
    arm.jawB.position.copy(points.tool).add(new THREE.Vector3(0, -jawSpread, 0));
    arm.jawA.rotation.z = points.wristAngle;
    arm.jawB.rotation.z = points.wristAngle;
    arm.cableA.geometry.setFromPoints([arm.base, points.first, points.second, points.tool]);
    arm.cableB.geometry.setFromPoints([
      arm.base.clone().add(new THREE.Vector3(0.08, 0, 0)),
      points.first.clone().add(new THREE.Vector3(0.05, 0, 0)),
      points.second.clone().add(new THREE.Vector3(-0.05, 0, 0)),
      points.tool.clone().add(new THREE.Vector3(0, 0.1, 0)),
    ]);
  }

  return {
    root,
    updatePose: (pose) => {
      updateArm(master, pose.masterChannels);
      updateArm(slave, pose.slaveChannels);
      const channelY = 1.36;
      const linkStart = new THREE.Vector3(-1.55, channelY, 0);
      const linkEnd = new THREE.Vector3(1.55, channelY, 0);
      setRodBetween(channelLink, linkStart, linkEnd);
      channelLink.visible = true;
      resistanceArrow.visible = pose.reflectedResistance > 0.005;
      if (resistanceArrow.visible) {
        resistanceArrow.position.set(0.92, 1.36, 0);
        resistanceArrow.rotation.z = Math.PI / 2;
        resistanceArrow.scale.setScalar(0.7 + pose.reflectedResistance * 0.8);
      }
      resistanceMat.opacity = 0.35 + pose.reflectedResistance * 0.65;
      linkMat.emissiveIntensity = 0.15 + pose.errorMagnitude * 0.7;
    },
    dispose: () => {
      geometries.forEach((item) => {
        item.dispose();
      });
      materials.forEach((item) => {
        item.dispose();
      });
    },
  };
}
