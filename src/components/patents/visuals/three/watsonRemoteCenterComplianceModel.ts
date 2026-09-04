import * as THREE from "three";
import type { WatsonRemoteCenterCompliancePose } from "@/physics/watsonRemoteCenterComplianceKernel";

export interface WatsonRemoteCenterComplianceModel {
  root: THREE.Group;
  updatePose: (pose: WatsonRemoteCenterCompliancePose) => void;
  dispose: () => void;
}

export interface WatsonRemoteCenterExhibitGeometry {
  ringPosition: THREE.Vector3;
  platePosition: THREE.Vector3;
  plateRotationZ: number;
  toolTip: THREE.Vector3;
  holeMouth: THREE.Vector3;
  remoteCenter: THREE.Vector3;
  toolAxis: THREE.Vector3;
  tipContactGap: number;
  remoteCenterToTipGap: number;
}

const RING_Y = 0.67;
const PLATE_Y = 0.12;
const TOOL_TIP_LOCAL_Y = -1.91;
const HOLE_X = 0.58;
const HOLE_MOUTH_Y = -1.79;
const MAX_DISPLAY_TILT_RAD = 0.24;

interface FlexureAssembly {
  group: THREE.Group;
  firstNeck: THREE.Mesh;
  body: THREE.Mesh;
  secondNeck: THREE.Mesh;
}

function setBetween(mesh: THREE.Mesh, start: THREE.Vector3, end: THREE.Vector3) {
  const direction = end.clone().sub(start);
  const length = direction.length();
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.scale.set(1, length, 1);
  if (length > 1e-12) {
    mesh.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.multiplyScalar(1 / length),
    );
  }
}

function updateFlexure(flexure: FlexureAssembly, start: THREE.Vector3, end: THREE.Vector3) {
  const firstJoint = start.clone().lerp(end, 0.18);
  const secondJoint = start.clone().lerp(end, 0.82);
  setBetween(flexure.firstNeck, start, firstJoint);
  setBetween(flexure.body, firstJoint, secondJoint);
  setBetween(flexure.secondNeck, secondJoint, end);
}

/**
 * Source-bounded drawing geometry shared by the renderer and its invariants.
 * The radial stage rotates plate 20 about free end 52 when Claim 1's remote
 * topology is present. The comparison state instead pivots at plate 20, which
 * visibly sweeps the free end away from the fixed hole during correction.
 */
export function deriveWatsonRemoteCenterExhibitGeometry(
  pose: WatsonRemoteCenterCompliancePose,
): WatsonRemoteCenterExhibitGeometry {
  const translatedX = THREE.MathUtils.lerp(0, HOLE_X, pose.translationPhase);
  const plateRotationZ = pose.remainingAxisMismatch * MAX_DISPLAY_TILT_RAD;
  const rotation = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 0, 1),
    plateRotationZ,
  );
  const rotatedLocalTip = new THREE.Vector3(0, TOOL_TIP_LOCAL_Y, 0).applyQuaternion(rotation);
  const holeMouth = new THREE.Vector3(HOLE_X, HOLE_MOUTH_Y, 0);
  const intendedContact = new THREE.Vector3(translatedX, HOLE_MOUTH_Y, 0);
  const platePosition = pose.remoteCenterTopology
    ? intendedContact.clone().sub(rotatedLocalTip)
    : new THREE.Vector3(translatedX, PLATE_Y, 0);
  const toolTip = platePosition.clone().add(rotatedLocalTip);
  const remoteCenter = pose.remoteCenterTopology ? intendedContact : platePosition.clone();
  const toolAxis = new THREE.Vector3(0, -1, 0).applyQuaternion(rotation).normalize();

  return {
    ringPosition: new THREE.Vector3(translatedX, RING_Y, 0),
    platePosition,
    plateRotationZ,
    toolTip,
    holeMouth,
    remoteCenter,
    toolAxis,
    tipContactGap: toolTip.distanceTo(holeMouth),
    remoteCenterToTipGap: remoteCenter.distanceTo(toolTip),
  };
}

/**
 * Procedural Figure 1 / Figure 7 exhibit. Every physical part follows the
 * printed load path: fixed machine housing 18 and lip 54 -> axial flexures
 * 56/58/60 -> ring 22 -> radial flexures 24/26/28 -> plate 20 -> rod 16.
 * Dashed radii are non-physical guides and remain visually distinct.
 */
export function buildWatsonRemoteCenterComplianceModel(): WatsonRemoteCenterComplianceModel {
  const root = new THREE.Group();
  root.name = "US 4,098,001 normalized remote-center compliance exhibit";
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

  const housingMat = material(
    new THREE.MeshStandardMaterial({ color: 0x172554, metalness: 0.78, roughness: 0.25 }),
  );
  const movingMat = material(
    new THREE.MeshStandardMaterial({ color: 0x273966, metalness: 0.72, roughness: 0.28 }),
  );
  const axialMat = material(
    new THREE.MeshStandardMaterial({ color: 0x06b6d4, metalness: 0.6, roughness: 0.28 }),
  );
  const radialMat = material(
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.62, roughness: 0.25 }),
  );
  const toolMat = material(
    new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.84, roughness: 0.17 }),
  );
  const markerMat = material(
    new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x075985,
      emissiveIntensity: 0.85,
      transparent: true,
      opacity: 0.82,
      wireframe: true,
      depthWrite: false,
    }),
  );
  const twistMat = material(
    new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      transparent: true,
      opacity: 0.72,
      metalness: 0.45,
    }),
  );
  const workpieceMat = material(
    new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.72,
      roughness: 0.32,
      side: THREE.DoubleSide,
    }),
  );
  const boreMat = material(
    new THREE.MeshStandardMaterial({
      color: 0x64748b,
      metalness: 0.68,
      roughness: 0.3,
      side: THREE.DoubleSide,
    }),
  );

  const topCap = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(1.3, 1.3, 0.18, 40)),
    housingMat,
  );
  topCap.name = "fixed machine portion 18 top cap";
  topCap.position.y = 1.36;
  root.add(topCap);
  const bottomLip = new THREE.Mesh(
    geometry(new THREE.TorusGeometry(1.03, 0.13, 12, 40)),
    housingMat,
  );
  bottomLip.name = "fixed machine lip 54";
  bottomLip.rotation.x = Math.PI / 2;
  bottomLip.position.y = PLATE_Y;
  root.add(bottomLip);
  const postGeometry = geometry(new THREE.BoxGeometry(0.18, 1.1, 0.18));
  const postPositions: Array<[number, number, number]> = [
    [-1.08, 0.75, -0.2],
    [1.08, 0.75, -0.2],
    [0, 0.75, -1.04],
  ];
  for (const [index, position] of postPositions.entries()) {
    const post = new THREE.Mesh(postGeometry, housingMat);
    post.name = `fixed machine wall 55 cutaway support ${index + 1}`;
    post.position.set(...position);
    root.add(post);
  }

  const ring = new THREE.Group();
  ring.name = "intermediate ring 22";
  const ringMesh = new THREE.Mesh(geometry(new THREE.TorusGeometry(0.75, 0.13, 12, 40)), movingMat);
  ringMesh.name = "annular third member ring 22";
  ringMesh.rotation.x = Math.PI / 2;
  ring.add(ringMesh);
  root.add(ring);

  const plate = new THREE.Group();
  plate.name = "second member plate 20 and operator rod 16";
  const plateMesh = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.72, 0.72, 0.14, 40)),
    movingMat,
  );
  plateMesh.name = "operator plate 20";
  plate.add(plateMesh);
  const rod = new THREE.Mesh(geometry(new THREE.CylinderGeometry(0.145, 0.145, 1.68, 24)), toolMat);
  rod.name = "operator rod 16";
  rod.position.y = -0.91;
  plate.add(rod);
  const rodNose = new THREE.Mesh(geometry(new THREE.ConeGeometry(0.145, 0.16, 24)), toolMat);
  rodNose.name = "rod 16 free-end nose 52";
  rodNose.position.y = -1.83;
  rodNose.rotation.x = Math.PI;
  plate.add(rodNose);
  const contactPoint = new THREE.Object3D();
  contactPoint.name = "rod 16 contact point at free end 52";
  contactPoint.position.y = TOOL_TIP_LOCAL_Y;
  plate.add(contactPoint);
  root.add(plate);

  const axialFlexures: FlexureAssembly[] = [];
  const radialFlexures: FlexureAssembly[] = [];
  const radialGuides: THREE.Line[] = [];
  const flexureBodyGeometry = geometry(new THREE.CylinderGeometry(0.052, 0.052, 1, 14));
  const flexureNeckGeometry = geometry(new THREE.CylinderGeometry(0.027, 0.027, 1, 12));
  const createFlexure = (name: string, flexureMaterial: THREE.Material) => {
    const group = new THREE.Group();
    group.name = name;
    const firstNeck = new THREE.Mesh(flexureNeckGeometry, flexureMaterial);
    firstNeck.name = `${name} first major-motion portion`;
    const body = new THREE.Mesh(flexureBodyGeometry, flexureMaterial);
    body.name = `${name} body`;
    const secondNeck = new THREE.Mesh(flexureNeckGeometry, flexureMaterial);
    secondNeck.name = `${name} second major-motion portion`;
    group.add(firstNeck, body, secondNeck);
    root.add(group);
    return { group, firstNeck, body, secondNeck } satisfies FlexureAssembly;
  };
  const guideMaterial = material(
    new THREE.LineDashedMaterial({ color: 0x67e8f9, dashSize: 0.09, gapSize: 0.07 }),
  );
  for (let index = 0; index < 3; index += 1) {
    const angle = (index * Math.PI * 2) / 3;
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);
    const axial = createFlexure(`translational flexure ${[56, 58, 60][index]}`, axialMat);
    axialFlexures.push(axial);
    const radial = createFlexure(`rotational flexure ${[24, 26, 28][index]}`, radialMat);
    radialFlexures.push(radial);
    axial.group.userData.baseAnchor = new THREE.Vector3(cosine * 0.9, PLATE_Y + 0.04, sine * 0.9);
    axial.group.userData.ringAnchor = new THREE.Vector3(cosine * 0.86, -0.04, sine * 0.86);
    radial.group.userData.ringAnchor = new THREE.Vector3(cosine * 0.76, -0.05, sine * 0.76);
    radial.group.userData.plateAnchor = new THREE.Vector3(cosine * 0.6, 0.05, sine * 0.6);

    const guideGeometry = geometry(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]),
    );
    const guide = new THREE.Line(guideGeometry, guideMaterial);
    guide.name = `virtual radius through rotational flexure ${[24, 26, 28][index]}`;
    guide.computeLineDistances();
    root.add(guide);
    radialGuides.push(guide);
  }

  const remoteCenter = new THREE.Mesh(geometry(new THREE.SphereGeometry(0.095, 20, 16)), markerMat);
  remoteCenter.name = "remote center 50 virtual marker";
  root.add(remoteCenter);

  const bellows = new THREE.Group();
  bellows.name = "bellows 90 and support wire 94, claim 2 torque-resistant means";
  const bellowsSleeve = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.2, 0.2, 1, 20, 1, true)),
    twistMat,
  );
  bellowsSleeve.name = "bellows 90 flexible casing 92";
  bellows.add(bellowsSleeve);
  const bellowsRings: THREE.Mesh[] = [];
  const bellowsRingGeometry = geometry(new THREE.TorusGeometry(0.25, 0.035, 9, 28));
  for (let index = 0; index < 7; index += 1) {
    const convolution = new THREE.Mesh(bellowsRingGeometry, twistMat);
    convolution.name = `bellows 90 convolution ${index + 1}`;
    bellows.add(convolution);
    bellowsRings.push(convolution);
  }
  root.add(bellows);

  // Workpiece 73 is fixed. Four rails form a genuine open bore rather than
  // placing a dark cylinder on top of a solid, falsely labelled slab.
  const workpiece = new THREE.Group();
  workpiece.name = "fixed workpiece 73 with through-hole 71";
  const outerWidth = 1.28;
  const outerDepth = 1.08;
  const opening = 0.38;
  const railWidth = (outerWidth - opening) / 2;
  const railDepth = (outerDepth - opening) / 2;
  const sideRailGeometry = geometry(new THREE.BoxGeometry(railWidth, 0.18, outerDepth));
  const endRailGeometry = geometry(new THREE.BoxGeometry(opening, 0.18, railDepth));
  for (const direction of [-1, 1]) {
    const side = new THREE.Mesh(sideRailGeometry, workpieceMat);
    side.name = `workpiece 73 side ${direction < 0 ? "left" : "right"}`;
    side.position.set(direction * (opening / 2 + railWidth / 2), -2.12, 0);
    workpiece.add(side);
    const end = new THREE.Mesh(endRailGeometry, workpieceMat);
    end.name = `workpiece 73 end ${direction < 0 ? "front" : "back"}`;
    end.position.set(0, -2.12, direction * (opening / 2 + railDepth / 2));
    workpiece.add(end);
  }
  const hole = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.29, opening / 2, 0.24, 32, 1, true)),
    boreMat,
  );
  hole.name = "fixed open chamfered hole 71 and chamfer 75";
  hole.position.y = -1.91;
  workpiece.add(hole);
  workpiece.position.x = HOLE_X;
  root.add(workpiece);

  const fixedBellowsAnchor = new THREE.Vector3(0, 1.25, 0);
  const plateBellowsAnchor = new THREE.Vector3(0, 0.08, 0);
  const zAxis = new THREE.Vector3(0, 0, 1);

  const updatePose = (pose: WatsonRemoteCenterCompliancePose) => {
    const exhibit = deriveWatsonRemoteCenterExhibitGeometry(pose);
    ring.position.copy(exhibit.ringPosition);
    plate.position.copy(exhibit.platePosition);
    plate.rotation.set(0, 0, exhibit.plateRotationZ);
    root.updateMatrixWorld(true);
    for (const axial of axialFlexures) {
      const baseAnchor = axial.group.userData.baseAnchor as THREE.Vector3;
      const ringAnchor = ring.localToWorld(
        (axial.group.userData.ringAnchor as THREE.Vector3).clone(),
      );
      updateFlexure(axial, baseAnchor, ringAnchor);
    }
    remoteCenter.position.copy(exhibit.remoteCenter);
    for (let index = 0; index < radialFlexures.length; index += 1) {
      const radial = radialFlexures[index];
      const ringAnchor = ring.localToWorld(
        (radial.group.userData.ringAnchor as THREE.Vector3).clone(),
      );
      const plateAnchor = plate.localToWorld(
        (radial.group.userData.plateAnchor as THREE.Vector3).clone(),
      );
      updateFlexure(radial, ringAnchor, plateAnchor);

      const guide = radialGuides[index];
      const position = guide.geometry.getAttribute("position") as THREE.BufferAttribute;
      position.setXYZ(0, exhibit.remoteCenter.x, exhibit.remoteCenter.y, exhibit.remoteCenter.z);
      position.setXYZ(1, ringAnchor.x, ringAnchor.y, ringAnchor.z);
      position.needsUpdate = true;
      guide.geometry.computeBoundingSphere();
      guide.computeLineDistances();
    }
    markerMat.color.setHex(pose.remoteCenterTopology ? 0x06b6d4 : 0x64748b);
    markerMat.emissive.setHex(pose.remoteCenterTopology ? 0x075985 : 0x334155);

    const movingBellowsAnchor = plate.localToWorld(plateBellowsAnchor.clone());
    setBetween(bellowsSleeve, fixedBellowsAnchor, movingBellowsAnchor);
    const bellowsDirection = movingBellowsAnchor.clone().sub(fixedBellowsAnchor).normalize();
    const bellowsOrientation = new THREE.Quaternion().setFromUnitVectors(zAxis, bellowsDirection);
    for (let index = 0; index < bellowsRings.length; index += 1) {
      const interpolation = (index + 1) / (bellowsRings.length + 1);
      bellowsRings[index].position
        .copy(fixedBellowsAnchor)
        .lerp(movingBellowsAnchor, interpolation);
      bellowsRings[index].quaternion.copy(bellowsOrientation);
    }
    bellows.visible = pose.antiTwistConstraint;
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
