import * as THREE from "three";
import type { MakinoScaraPose } from "@/physics/makinoScaraKernel";

export interface MakinoScaraModel {
  root: THREE.Group;
  updatePose: (pose: MakinoScaraPose) => void;
  dispose: () => void;
}

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

/**
 * A procedural, intentionally normalized exhibit of the four-link mechanism.
 * It is built from the patent's named link/shaft topology, not a commercial
 * SCARA GLTF or unprinted machine dimensions.
 */
export function buildMakinoScaraModel(): MakinoScaraModel {
  const root = new THREE.Group();
  root.name = "US 4,341,502 normalized four-link assembly robot exhibit";
  root.position.y = -4.08;

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

  const plinth = new THREE.Mesh(geometry(new THREE.BoxGeometry(3.6, 0.16, 3.0)), baseMat);
  plinth.name = "Base 15 museum plinth";
  plinth.position.y = -0.12;
  plinth.receiveShadow = true;
  root.add(plinth);

  const motorOne = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.2, 0.25, 0.28, 28)),
    firstMat,
  );
  motorOne.name = "Motor 1 and shaft 3";
  motorOne.position.y = 0.1;
  root.add(motorOne);
  const motorTwo = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.16, 0.2, 0.24, 28)),
    fourthMat,
  );
  motorTwo.name = "Motor 2 and shaft 3a";
  // Claim 1 aligns the shaft axes, not the solid motor volumes. Stack the two
  // normalized housings axially so they meet without occupying the same space;
  // the two link layers below make both coaxial output paths inspectable.
  motorTwo.position.y = 0.36;
  root.add(motorTwo);

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

  const jointGeometry = geometry(new THREE.SphereGeometry(0.13, 20, 16));
  const firstJoint = new THREE.Mesh(jointGeometry, firstMat);
  firstJoint.name = "First outer joint";
  const fourthJoint = new THREE.Mesh(jointGeometry, fourthMat);
  fourthJoint.name = "Fourth outer joint";
  const toolJoint = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.1, 0.1, 0.52, 20)),
    toolMat,
  );
  toolJoint.name = "Assembly tool joint 8";
  const toolJointSecond = new THREE.Mesh(toolJoint.geometry, toolMat);
  toolJointSecond.name = "Assembly tool second pivot (Claim 6)";
  root.add(firstJoint, fourthJoint, toolJoint, toolJointSecond);

  const toolCarrier = new THREE.Mesh(rodGeometry, toolMat);
  toolCarrier.name = "Rigid two-pivot assembly tool 13";
  root.add(toolCarrier);

  const toolGroup = new THREE.Group();
  toolGroup.name = "Assembly tool 9";
  const toolBody = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.12, 0.12, 0.42, 18)),
    toolMat,
  );
  toolBody.rotation.x = Math.PI / 2;
  toolBody.position.z = 0.24;
  toolGroup.add(toolBody);
  const toolTip = new THREE.Mesh(geometry(new THREE.ConeGeometry(0.1, 0.22, 18)), toolMat);
  toolTip.rotation.x = Math.PI / 2;
  toolTip.position.z = 0.54;
  toolGroup.add(toolTip);
  root.add(toolGroup);

  const yLinkGroup = new THREE.Group();
  yLinkGroup.name = "Claim 6 Y-shaped link mechanism 14";
  const yRodA = new THREE.Mesh(rodGeometry, yMat);
  const yRodB = new THREE.Mesh(rodGeometry, yMat);
  const yRodC = new THREE.Mesh(rodGeometry, yMat);
  const yHub = new THREE.Mesh(jointGeometry, yMat);
  yLinkGroup.add(yRodA, yRodB, yRodC, yHub);
  root.add(yLinkGroup);

  const updatePose = (pose: MakinoScaraPose) => {
    const firstLayerY = 0.24;
    const fourthLayerY = 0.5;
    const toolLayerY = (firstLayerY + fourthLayerY) / 2;
    const baseA = point3(pose.firstBase, firstLayerY);
    const baseB = point3(pose.fourthBase, fourthLayerY);
    const outerA = point3(pose.firstOuterJoint, firstLayerY);
    const outerB = point3(pose.fourthOuterJoint, fourthLayerY);
    const firstTool = point3(pose.toolJoints[0], firstLayerY);
    const fourthTool = point3(pose.toolJoints[1], fourthLayerY);
    const tool = point3(pose.tool, toolLayerY);
    motorOne.position.set(baseA.x, 0.1, baseA.z);
    motorTwo.position.set(baseB.x, 0.36, baseB.z);
    setRodBetween(firstLink, baseA, outerA);
    setRodBetween(fourthLink, baseB, outerB);
    setRodBetween(secondLink, outerA, firstTool);
    setRodBetween(thirdLink, outerB, fourthTool);
    firstJoint.position.copy(outerA);
    fourthJoint.position.copy(outerB);
    toolJoint.position.copy(point3(pose.toolJoints[0], toolLayerY));
    toolJointSecond.position.copy(point3(pose.toolJoints[1], toolLayerY));
    toolJointSecond.visible = pose.topology === "claim-6-y-link";
    toolCarrier.visible = pose.topology === "claim-6-y-link";
    if (toolCarrier.visible) {
      setRodBetween(
        toolCarrier,
        point3(pose.toolJoints[0], toolLayerY),
        point3(pose.toolJoints[1], toolLayerY),
      );
    }
    toolGroup.position.copy(tool);
    toolGroup.rotation.y = -pose.toolAttitudeRad;

    yLinkGroup.visible = pose.yLinkHub !== null;
    if (pose.yLinkHub) {
      const yLinkLayerY = toolLayerY;
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
