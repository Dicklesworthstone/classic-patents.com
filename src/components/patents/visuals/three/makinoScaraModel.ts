import * as THREE from "three";
import type { MakinoScaraPose } from "@/physics/makinoScaraKernel";

export interface MakinoScaraModel {
  root: THREE.Group;
  updatePose: (pose: MakinoScaraPose) => void;
  dispose: () => void;
}

export const MAKINO_SCARA_MODEL_ROOT_Y = -3.55;
export const MAKINO_SCARA_MODEL_FLOOR_Y = -4.11;
export const MAKINO_SCARA_BASE_BOTTOM_LOCAL_Y = -0.56;
const FIRST_LINK_LAYER_Y = 0.35;
const FOURTH_LINK_LAYER_Y = 0.64;
const TOOL_LINK_LAYER_Y = (FIRST_LINK_LAYER_Y + FOURTH_LINK_LAYER_Y) / 2;
const BELT_LAYER_Y = 0.98;

function point3([x, z]: readonly [number, number], layerY = 0): THREE.Vector3 {
  return new THREE.Vector3(x, layerY, z);
}

function setRodBetween(mesh: THREE.Mesh, start: THREE.Vector3, end: THREE.Vector3) {
  const direction = end.clone().sub(start);
  const length = direction.length();
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  if (length <= Number.EPSILON) {
    mesh.scale.set(1, 0, 1);
    mesh.quaternion.identity();
    return;
  }
  mesh.scale.set(1, length, 1);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
}

function setVerticalMember(mesh: THREE.Mesh, x: number, z: number, startY: number, endY: number) {
  setRodBetween(mesh, new THREE.Vector3(x, startY, z), new THREE.Vector3(x, endY, z));
}

function setParallelBeltRuns(
  first: THREE.Mesh,
  second: THREE.Mesh,
  start: THREE.Vector3,
  end: THREE.Vector3,
) {
  const direction = end.clone().sub(start);
  const normal = new THREE.Vector3(-direction.z, 0, direction.x);
  if (normal.lengthSq() <= Number.EPSILON) normal.set(1, 0, 0);
  normal.normalize().multiplyScalar(0.13);
  setRodBetween(first, start.clone().add(normal), end.clone().add(normal));
  setRodBetween(second, start.clone().sub(normal), end.clone().sub(normal));
}

/**
 * A procedural, intentionally normalized exhibit of the four-link mechanism.
 * It is built from the patent's named link/shaft topology, not a commercial
 * SCARA GLTF or unprinted machine dimensions.
 */
export function buildMakinoScaraModel(): MakinoScaraModel {
  const root = new THREE.Group();
  root.name = "US 4,341,502 normalized four-link assembly robot exhibit";
  root.position.y = MAKINO_SCARA_MODEL_ROOT_Y;

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

  const baseMat = material(
    new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.82, roughness: 0.28 }),
  );
  const firstMat = material(
    new THREE.MeshStandardMaterial({ color: 0x06b6d4, metalness: 0.62, roughness: 0.22 }),
  );
  const fourthMat = material(
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.62, roughness: 0.24 }),
  );
  const followerMat = material(
    new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.76, roughness: 0.2 }),
  );
  const toolMat = material(
    new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      metalness: 0.7,
      roughness: 0.17,
      emissive: new THREE.Color(0x7c5200),
      emissiveIntensity: 0.12,
    }),
  );
  const yMat = material(
    new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      metalness: 0.45,
      roughness: 0.32,
      transparent: true,
      opacity: 0.86,
    }),
  );

  const beltMat = material(
    new THREE.MeshStandardMaterial({ color: 0x34d399, metalness: 0.18, roughness: 0.52 }),
  );
  const motorTenMat = material(
    new THREE.MeshStandardMaterial({ color: 0xa78bfa, metalness: 0.58, roughness: 0.24 }),
  );

  const baseFoot = new THREE.Mesh(geometry(new THREE.BoxGeometry(1.5, 0.16, 1.22)), baseMat);
  baseFoot.name = "Base 15 floor foot";
  baseFoot.position.set(0, MAKINO_SCARA_BASE_BOTTOM_LOCAL_Y + 0.08, -0.18);
  baseFoot.receiveShadow = true;
  root.add(baseFoot);
  const basePedestal = new THREE.Mesh(geometry(new THREE.BoxGeometry(1.3, 0.4, 0.58)), baseMat);
  basePedestal.name = "Base 15 motor pedestal";
  basePedestal.position.set(0, -0.2, -0.16);
  root.add(basePedestal);

  const motorOne = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.21, 0.25, 0.34, 28)),
    firstMat,
  );
  motorOne.name = "Motor 1 and shaft 3";
  motorOne.position.y = 0.17;
  root.add(motorOne);
  const motorTwo = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.18, 0.22, 0.3, 28)),
    fourthMat,
  );
  motorTwo.name = "Motor 2 and shaft 3a";
  root.add(motorTwo);

  const shaftGeometry = geometry(new THREE.CylinderGeometry(0.052, 0.052, 1, 18));
  const firstOutputShaft = new THREE.Mesh(shaftGeometry, firstMat);
  firstOutputShaft.name = "Vertical output shaft 3";
  const fourthOutputShaft = new THREE.Mesh(shaftGeometry, fourthMat);
  fourthOutputShaft.name = "Vertical output shaft 3a";
  root.add(firstOutputShaft, fourthOutputShaft);

  const rodGeometry = geometry(new THREE.CylinderGeometry(0.075, 0.075, 1, 16));
  const firstLink = new THREE.Mesh(rodGeometry, firstMat);
  firstLink.name = "First link 4";
  const fourthLink = new THREE.Mesh(rodGeometry, fourthMat);
  fourthLink.name = "Fourth link 5";
  const secondLink = new THREE.Mesh(rodGeometry, followerMat);
  secondLink.name = "Second link 6";
  const thirdLink = new THREE.Mesh(rodGeometry, followerMat);
  thirdLink.name = "Third link 7";
  root.add(firstLink, fourthLink, secondLink, thirdLink);

  const jointGeometry = geometry(new THREE.CylinderGeometry(0.115, 0.115, 0.38, 20));
  const firstJoint = new THREE.Mesh(jointGeometry, firstMat);
  firstJoint.name = "First vertical pivot shaft 8";
  const fourthJoint = new THREE.Mesh(jointGeometry, fourthMat);
  fourthJoint.name = "Third vertical pivot shaft 8";
  const toolJoint = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.105, 0.105, 0.46, 20)),
    toolMat,
  );
  toolJoint.name = "Second vertical axis and assembly tool joint 8";
  const toolJointSecond = new THREE.Mesh(toolJoint.geometry, toolMat);
  toolJointSecond.name = "Assembly tool second pivot (Claim 6)";
  root.add(firstJoint, fourthJoint, toolJoint, toolJointSecond);

  const toolCarrier = new THREE.Mesh(rodGeometry, toolMat);
  toolCarrier.name = "Rigid two-pivot assembly tool 13";
  root.add(toolCarrier);

  const toolGroup = new THREE.Group();
  toolGroup.name = "Assembly tool 9";
  const toolBody = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.13, 0.16, 0.44, 18)),
    toolMat,
  );
  toolBody.name = "Vertical assembly tool barrel";
  toolBody.position.y = -0.27;
  toolGroup.add(toolBody);
  const toolSpindle = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.055, 0.075, 0.22, 18)),
    toolMat,
  );
  toolSpindle.name = "Assembly tool spindle";
  toolSpindle.position.y = -0.59;
  toolGroup.add(toolSpindle);
  const toolIndex = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.34, 0.1, 0.12)), toolMat);
  toolIndex.name = "Asymmetric tool attitude index";
  toolIndex.position.set(0.11, -0.69, 0.08);
  toolGroup.add(toolIndex);
  root.add(toolGroup);

  // Claims 2 and 5 add motor 10 and two successive belt devices along links
  // 4 and 6. These parts remain one connected transmission: each belt meets a
  // pulley on a vertical supporting member, and the last member shares the
  // assembly-tool axis. Claim 6 replaces this coordinate with fixed attitude.
  const beltGroup = new THREE.Group();
  beltGroup.name = "Claims 2 and 5 connected belt transmission";
  const motorTen = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.15, 0.18, 0.3, 24)),
    motorTenMat,
  );
  motorTen.name = "Third motor 10";
  const pulleyGeometry = geometry(new THREE.TorusGeometry(0.13, 0.025, 10, 28));
  const basePulley = new THREE.Mesh(pulleyGeometry, beltMat);
  basePulley.name = "First belt-supporting member";
  const outerPulley = new THREE.Mesh(pulleyGeometry, beltMat);
  outerPulley.name = "Second belt-supporting member";
  const toolPulley = new THREE.Mesh(pulleyGeometry, beltMat);
  toolPulley.name = "Third belt-supporting member";
  for (const pulley of [basePulley, outerPulley, toolPulley]) {
    pulley.rotation.x = Math.PI / 2;
  }
  const beltGeometry = geometry(new THREE.CylinderGeometry(0.018, 0.018, 1, 10));
  const firstBeltA = new THREE.Mesh(beltGeometry, beltMat);
  const firstBeltB = new THREE.Mesh(beltGeometry, beltMat);
  const secondBeltA = new THREE.Mesh(beltGeometry, beltMat);
  const secondBeltB = new THREE.Mesh(beltGeometry, beltMat);
  firstBeltA.name = "First belt 11 outward run";
  firstBeltB.name = "First belt 11 return run";
  secondBeltA.name = "Second belt 12 outward run";
  secondBeltB.name = "Second belt 12 return run";
  const beltSupportGeometry = geometry(new THREE.CylinderGeometry(0.035, 0.035, 1, 12));
  const baseBeltSupport = new THREE.Mesh(beltSupportGeometry, motorTenMat);
  const outerBeltSupport = new THREE.Mesh(beltSupportGeometry, beltMat);
  const toolBeltSupport = new THREE.Mesh(beltSupportGeometry, beltMat);
  baseBeltSupport.name = "Motor 10 pulley shaft";
  outerBeltSupport.name = "First-axis belt support shaft";
  toolBeltSupport.name = "Second-axis belt support shaft";
  beltGroup.add(
    motorTen,
    basePulley,
    outerPulley,
    toolPulley,
    firstBeltA,
    firstBeltB,
    secondBeltA,
    secondBeltB,
    baseBeltSupport,
    outerBeltSupport,
    toolBeltSupport,
  );
  root.add(beltGroup);

  const yLinkGroup = new THREE.Group();
  yLinkGroup.name = "Claim 6 Y-shaped link mechanism 14";
  const yRodA = new THREE.Mesh(rodGeometry, yMat);
  const yRodB = new THREE.Mesh(rodGeometry, yMat);
  const yRodC = new THREE.Mesh(rodGeometry, yMat);
  const yHub = new THREE.Mesh(jointGeometry, yMat);
  yLinkGroup.add(yRodA, yRodB, yRodC, yHub);
  root.add(yLinkGroup);

  const updatePose = (pose: MakinoScaraPose) => {
    const baseA = point3(pose.firstBase, FIRST_LINK_LAYER_Y);
    const baseB = point3(pose.fourthBase, FOURTH_LINK_LAYER_Y);
    const outerA = point3(pose.firstOuterJoint, FIRST_LINK_LAYER_Y);
    const outerB = point3(pose.fourthOuterJoint, FOURTH_LINK_LAYER_Y);
    const firstTool = point3(pose.toolJoints[0], FIRST_LINK_LAYER_Y);
    const fourthTool = point3(pose.toolJoints[1], FOURTH_LINK_LAYER_Y);
    const tool = point3(pose.tool, TOOL_LINK_LAYER_Y);
    motorOne.position.set(baseA.x, 0.17, baseA.z);
    const coaxial = pose.topology === "claim-1-concentric";
    motorTwo.position.set(baseB.x, coaxial ? 0.49 : 0.15, baseB.z);
    setVerticalMember(firstOutputShaft, baseA.x, baseA.z, 0.27, FIRST_LINK_LAYER_Y + 0.08);
    setVerticalMember(
      fourthOutputShaft,
      baseB.x,
      baseB.z,
      coaxial ? 0.57 : 0.22,
      FOURTH_LINK_LAYER_Y + 0.08,
    );
    setRodBetween(firstLink, baseA, outerA);
    setRodBetween(fourthLink, baseB, outerB);
    setRodBetween(secondLink, outerA, firstTool);
    setRodBetween(thirdLink, outerB, fourthTool);
    firstJoint.position.copy(outerA);
    fourthJoint.position.copy(outerB);
    toolJoint.position.copy(point3(pose.toolJoints[0], TOOL_LINK_LAYER_Y));
    toolJointSecond.position.copy(point3(pose.toolJoints[1], TOOL_LINK_LAYER_Y));
    toolJointSecond.visible = pose.topology === "claim-6-y-link";
    toolCarrier.visible = pose.topology === "claim-6-y-link";
    if (toolCarrier.visible) {
      setRodBetween(
        toolCarrier,
        point3(pose.toolJoints[0], TOOL_LINK_LAYER_Y),
        point3(pose.toolJoints[1], TOOL_LINK_LAYER_Y),
      );
    }
    toolGroup.position.copy(tool);
    toolGroup.rotation.y = -pose.toolAttitudeRad;

    beltGroup.visible = pose.topology !== "claim-6-y-link";
    if (beltGroup.visible) {
      const motorTenBottom = coaxial ? FOURTH_LINK_LAYER_Y : 0.34;
      const motorTenTop = motorTenBottom + 0.3;
      motorTen.position.set(baseA.x, (motorTenBottom + motorTenTop) / 2, baseA.z);
      const beltBase = point3(pose.firstBase, BELT_LAYER_Y);
      const beltOuter = point3(pose.firstOuterJoint, BELT_LAYER_Y);
      const beltTool = point3(pose.toolJoints[0], BELT_LAYER_Y);
      basePulley.position.copy(beltBase);
      outerPulley.position.copy(beltOuter);
      toolPulley.position.copy(beltTool);
      setVerticalMember(baseBeltSupport, beltBase.x, beltBase.z, motorTenTop - 0.03, BELT_LAYER_Y);
      setVerticalMember(
        outerBeltSupport,
        beltOuter.x,
        beltOuter.z,
        FIRST_LINK_LAYER_Y,
        BELT_LAYER_Y,
      );
      setVerticalMember(toolBeltSupport, beltTool.x, beltTool.z, TOOL_LINK_LAYER_Y, BELT_LAYER_Y);
      setParallelBeltRuns(firstBeltA, firstBeltB, beltBase, beltOuter);
      setParallelBeltRuns(secondBeltA, secondBeltB, beltOuter, beltTool);
    }

    yLinkGroup.visible = pose.yLinkHub !== null;
    if (pose.yLinkHub) {
      const yLinkLayerY = TOOL_LINK_LAYER_Y;
      const yFirstOuter = point3(pose.firstOuterJoint, yLinkLayerY);
      const yBaseB = point3(pose.fourthBase, yLinkLayerY);
      const hub = point3(pose.yLinkHub, yLinkLayerY);
      const yToolRight = point3(pose.toolJoints[1], yLinkLayerY);
      setRodBetween(yRodA, yFirstOuter, hub);
      setRodBetween(yRodB, hub, yBaseB);
      setRodBetween(yRodC, hub, yToolRight);
      yHub.position.copy(hub);
    }
  };

  return {
    root,
    updatePose,
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
