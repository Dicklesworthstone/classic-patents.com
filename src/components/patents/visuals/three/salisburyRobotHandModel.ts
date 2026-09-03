/**
 * salisburyRobotHandModel.ts
 *
 * Procedural 3D WebGL mechanism for Carl F. Ruoff and J. Kenneth Salisbury, Jr.'s
 * Multi-Fingered Robotic Hand (US Patent 4,921,293).
 *
 * Reconstructs the connected source topology rather than a free-floating prop:
 * remote drive -> forearm -> two-axis wrist -> palm -> three serial digits.
 * Four rendered cable paths per digit stay attached to the moving pulley chain.
 * Dimensions and display pose are normalized because the grant prints neither.
 */

import * as THREE from "three";
import type { SalisburyRobotHandTelemetry } from "@/physics/salisburyRobotHandKernel";

export interface FingerHierarchy {
  root: THREE.Group;
  yawLink: THREE.Group;
  proximalLink: THREE.Group;
  distalLink: THREE.Group;
  fingertipMesh: THREE.Mesh;
  pulleys: THREE.Mesh[];
  firstIdlerLock: THREE.Mesh;
  firstIdlerFreeMarker: THREE.Mesh;
  tendonLines: THREE.LineSegments;
}

export interface SalisburyRobotHandModel {
  rootGroup: THREE.Group;
  forearmGroup: THREE.Group;
  wristGroup: THREE.Group;
  palmGroup: THREE.Group;
  fingers: FingerHierarchy[];
  cableBundles: THREE.LineSegments[];
  actuatorSpools: THREE.Mesh[];
  tensionSensors: THREE.Mesh[];
  sourceTopologyObjects: THREE.Object3D[];
  materials: {
    aluminiumChassis: THREE.MeshStandardMaterial;
    fingerLink: THREE.MeshStandardMaterial;
    pulleyBrass: THREE.MeshStandardMaterial;
    fingertipElastomer: THREE.MeshStandardMaterial;
    cableSteel: THREE.LineBasicMaterial;
  };
  dispose: () => void;
}

export function buildSalisburyRobotHandModel(): SalisburyRobotHandModel {
  const rootGroup = new THREE.Group();
  const forearmGroup = new THREE.Group();
  const wristGroup = new THREE.Group();
  const palmGroup = new THREE.Group();
  palmGroup.name = "palm-20";
  rootGroup.add(forearmGroup);
  forearmGroup.add(wristGroup);
  wristGroup.add(palmGroup);

  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];

  // 1. Materials
  const aluminiumChassis = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.35,
    metalness: 0.8,
  });
  materialsToDispose.push(aluminiumChassis);

  const fingerLink = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.3,
    metalness: 0.75,
  });
  materialsToDispose.push(fingerLink);

  const pulleyBrass = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.25,
    metalness: 0.85,
  });
  materialsToDispose.push(pulleyBrass);

  const fingertipElastomer = new THREE.MeshStandardMaterial({
    color: 0xf59e0b, // Source says resilient material; hard rubber is one example.
    roughness: 0.65,
    metalness: 0.1,
  });
  materialsToDispose.push(fingertipElastomer);

  const cableSteel = new LineBasicMaterialWithDisposal({
    vertexColors: true,
    linewidth: 1.5,
  });
  materialsToDispose.push(cableSteel);

  // 2. Physically connected remote-drive, forearm, wrist, and palm assembly.
  const driveGeo = new THREE.BoxGeometry(1.25, 0.7, 1.0);
  geometriesToDispose.push(driveGeo);
  const driveMesh = new THREE.Mesh(driveGeo, aluminiumChassis);
  driveMesh.name = "remote-actuator-drive";
  driveMesh.position.set(0, -2.65, 0);
  forearmGroup.add(driveMesh);

  const forearmGeo = new THREE.BoxGeometry(0.8, 1.7, 0.8);
  geometriesToDispose.push(forearmGeo);
  const forearmMesh = new THREE.Mesh(forearmGeo, aluminiumChassis);
  forearmMesh.name = "robot-arm-12";
  forearmMesh.position.set(0, -1.45, 0);
  forearmGroup.add(forearmMesh);

  const wristYokeGeo = new THREE.BoxGeometry(1.05, 0.32, 0.85);
  geometriesToDispose.push(wristYokeGeo);
  const wristYoke = new THREE.Mesh(wristYokeGeo, aluminiumChassis);
  wristYoke.name = "wrist-axis-16-yoke";
  wristYoke.position.set(0, -0.45, 0);
  wristGroup.add(wristYoke);

  const firstWristPinGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.25, 20);
  geometriesToDispose.push(firstWristPinGeo);
  const firstWristPin = new THREE.Mesh(firstWristPinGeo, pulleyBrass);
  firstWristPin.rotation.z = Math.PI / 2;
  firstWristPin.position.set(0, -0.45, 0);
  wristGroup.add(firstWristPin);

  const secondWristPinGeo = new THREE.CylinderGeometry(0.16, 0.16, 1.0, 20);
  geometriesToDispose.push(secondWristPinGeo);
  const secondWristPin = new THREE.Mesh(secondWristPinGeo, pulleyBrass);
  secondWristPin.rotation.x = Math.PI / 2;
  secondWristPin.position.set(0, -0.18, 0);
  wristGroup.add(secondWristPin);

  const wristPlateGeo = new THREE.BoxGeometry(1.5, 0.22, 1.0);
  geometriesToDispose.push(wristPlateGeo);
  const wristPlate = new THREE.Mesh(wristPlateGeo, fingerLink);
  wristPlate.name = "wrist-terminal-plate";
  wristPlate.position.set(0, -0.05, 0);
  wristGroup.add(wristPlate);

  // Palm 20 is the source's angular member 22 plus transverse terminal member
  // 24, not a monolithic rectangular plate. Their overlap forms one rigid,
  // wrist-mounted T-shaped chassis: two fingers attach to member 24 and the
  // opposing thumb attaches to member 22.
  const angularMemberGeo = new THREE.BoxGeometry(0.58, 0.38, 1.55);
  geometriesToDispose.push(angularMemberGeo);
  const angularMember = new THREE.Mesh(angularMemberGeo, aluminiumChassis);
  angularMember.name = "palm angular member 22";
  angularMember.position.set(0, 0.15, 0.04);
  palmGroup.add(angularMember);

  const terminalMemberGeo = new THREE.BoxGeometry(2.15, 0.38, 0.52);
  geometriesToDispose.push(terminalMemberGeo);
  const terminalMember = new THREE.Mesh(terminalMemberGeo, aluminiumChassis);
  terminalMember.name = "palm terminal member 24";
  terminalMember.position.set(0, 0.15, -0.5);
  palmGroup.add(terminalMember);

  // 3. Build Three 3-DOF Articulated Fingers
  const fingers: FingerHierarchy[] = [];
  const fingerPositions = [
    { x: -0.7, z: -0.5, yawBase: -0.18 },
    { x: 0.7, z: -0.5, yawBase: 0.18 },
    { x: 0.0, z: 0.55, yawBase: Math.PI },
  ];
  const cableOffsets = [
    [-0.08, 0.08],
    [0.08, 0.08],
    [0.08, -0.08],
    [-0.08, -0.08],
  ] as const;
  const verticalAxis = new THREE.Vector3(0, 1, 0);
  const tensionSensors: THREE.Mesh[] = [];
  const sourceTopologyObjects: THREE.Object3D[] = [];
  const cableColors = [0x38bdf8, 0x34d399, 0xfbbf24, 0xfb7185] as const;

  for (let f = 0; f < 3; f++) {
    const fConfig = fingerPositions[f];
    const fingerRoot = new THREE.Group();
    fingerRoot.name = `finger-${f + 1}-three-joint-chain`;
    fingerRoot.position.set(fConfig.x, 0.42, fConfig.z);
    fingerRoot.rotation.y = fConfig.yawBase;
    palmGroup.add(fingerRoot);

    // Four source cable ends enter each digit through four individually
    // rendered strain-sensor seats on the connected palm.
    const sensorGeo = new THREE.BoxGeometry(0.11, 0.12, 0.11);
    geometriesToDispose.push(sensorGeo);
    for (const [x, z] of cableOffsets) {
      const seatOffset = new THREE.Vector3(x, 0, z).applyAxisAngle(verticalAxis, fConfig.yawBase);
      const sensor = new THREE.Mesh(sensorGeo, pulleyBrass);
      sensor.name = `finger-${f + 1}-sensor-${(tensionSensors.length % 4) + 1}`;
      // The seat overlaps the palm by 10 mm in normalized model space and its
      // upper face is exactly the shared external/internal cable endpoint.
      sensor.position.set(fConfig.x + seatOffset.x, 0.41, fConfig.z + seatOffset.z);
      palmGroup.add(sensor);
      tensionSensors.push(sensor);
      sourceTopologyObjects.push(sensor);
    }

    // Joint 1: Base Yaw Link (abduction/adduction)
    const yawLink = new THREE.Group();
    fingerRoot.add(yawLink);

    // Base pivot housing
    const baseHousingGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.35, 16);
    geometriesToDispose.push(baseHousingGeo);
    const baseHousingMesh = new THREE.Mesh(baseHousingGeo, fingerLink);
    baseHousingMesh.name = `finger-${f + 1}-axis-1-housing`;
    yawLink.add(baseHousingMesh);

    // Four contiguous source-numbered pulley sheaves 30′ through 30⁗.
    const basePulleyGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.08, 16);
    geometriesToDispose.push(basePulleyGeo);
    const basePulleyMeshes = Array.from({ length: 4 }, (_, index) => {
      const pulley = new THREE.Mesh(basePulleyGeo, pulleyBrass);
      const labels = ["30′", "30″", "30‴", "30⁗"] as const;
      pulley.name = `finger-${f + 1}-Axis-1-pulley-${labels[index]}`;
      // Every sheave is coaxial with pin 36. Varying position along Y stacks
      // the four 80-mm display-width sheaves contiguously on that one Axis 1.
      pulley.position.set(0, (index - 1.5) * 0.08, 0);
      yawLink.add(pulley);
      return pulley;
    });

    const basePinGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.48, 12);
    geometriesToDispose.push(basePinGeo);
    const basePin = new THREE.Mesh(basePinGeo, fingerLink);
    basePin.name = `finger-${f + 1}-Axis-1-pin-36`;
    yawLink.add(basePin);

    const firstIdlerLockGeo = new THREE.BoxGeometry(0.12, 0.1, 0.31);
    geometriesToDispose.push(firstIdlerLockGeo);
    const firstIdlerLock = new THREE.Mesh(firstIdlerLockGeo, fingerLink);
    firstIdlerLock.name = `finger-${f + 1}-Claim-2-first-idler-lock`;
    firstIdlerLock.position.set(0.15, -0.12, 0);
    yawLink.add(firstIdlerLock);

    const freeMarkerGeo = new THREE.TorusGeometry(0.205, 0.022, 8, 28);
    geometriesToDispose.push(freeMarkerGeo);
    const firstIdlerFreeMarker = new THREE.Mesh(freeMarkerGeo, fingertipElastomer);
    firstIdlerFreeMarker.name = `finger-${f + 1}-Claim-2-released-idler-marker`;
    firstIdlerFreeMarker.rotation.x = Math.PI / 2;
    firstIdlerFreeMarker.position.y = -0.12;
    firstIdlerFreeMarker.visible = false;
    yawLink.add(firstIdlerFreeMarker);

    // Base link strut extending to Joint 2
    const baseStrutGeo = new THREE.BoxGeometry(0.25, 0.5, 0.28);
    geometriesToDispose.push(baseStrutGeo);
    const baseStrutMesh = new THREE.Mesh(baseStrutGeo, fingerLink);
    baseStrutMesh.position.set(0, 0.35, 0);
    yawLink.add(baseStrutMesh);

    // Joint 2: Proximal Pitch Link
    const proximalLink = new THREE.Group();
    proximalLink.position.set(0, 0.6, 0);
    yawLink.add(proximalLink);

    // Joint 2 drive pulley (oriented horizontally on pitch axis)
    const j2PulleyMesh = new THREE.Mesh(basePulleyGeo, pulleyBrass);
    j2PulleyMesh.name = `finger-${f + 1}-Axis-2-drive-pulley-45`;
    j2PulleyMesh.rotation.z = Math.PI / 2;
    proximalLink.add(j2PulleyMesh);

    // Proximal Phalanx Link (Link 2)
    const link2Geo = new THREE.BoxGeometry(0.2, 0.75, 0.22);
    geometriesToDispose.push(link2Geo);
    const link2Mesh = new THREE.Mesh(link2Geo, fingerLink);
    link2Mesh.position.set(0, 0.4, 0);
    proximalLink.add(link2Mesh);

    // Joint 3: Distal Pitch Link
    const distalLink = new THREE.Group();
    distalLink.position.set(0, 0.8, 0);
    proximalLink.add(distalLink);

    // Joint 3 drive pulley
    const j3PulleyMesh = new THREE.Mesh(basePulleyGeo, pulleyBrass);
    j3PulleyMesh.name = `finger-${f + 1}-Axis-3-idler-pulley-54`;
    j3PulleyMesh.rotation.z = Math.PI / 2;
    distalLink.add(j3PulleyMesh);

    // Distal Phalanx Link (Link 3)
    const link3Geo = new THREE.BoxGeometry(0.18, 0.7, 0.18);
    geometriesToDispose.push(link3Geo);
    const link3Mesh = new THREE.Mesh(link3Geo, fingerLink);
    link3Mesh.position.set(0, 0.35, 0);
    distalLink.add(link3Mesh);

    // The source draws an elongated resilient cover over joint 48. A capsule
    // preserves that seated, finger-like geometry without inventing material
    // dimensions or presenting a detached spherical contact body.
    const tipGeo = new THREE.CapsuleGeometry(0.15, 0.36, 8, 20);
    geometriesToDispose.push(tipGeo);
    const fingertipMesh = new THREE.Mesh(tipGeo, fingertipElastomer);
    fingertipMesh.name = `finger-${f + 1}-resilient-tip-cover-48`;
    fingertipMesh.position.set(0, 0.86, 0);
    distalLink.add(fingertipMesh);

    // Four moving tendon polylines. Their vertices are rewritten after every
    // joint update so no cable end floats away from its pulley/link anchor.
    const tendonGeo = new THREE.BufferGeometry();
    tendonGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(72), 3));
    const tendonColors = new Float32Array(72);
    for (let cableIndex = 0; cableIndex < 4; cableIndex++) {
      const color = new THREE.Color(cableColors[cableIndex]);
      for (let vertexIndex = 0; vertexIndex < 6; vertexIndex++) {
        color.toArray(tendonColors, (cableIndex * 6 + vertexIndex) * 3);
      }
    }
    tendonGeo.setAttribute("color", new THREE.BufferAttribute(tendonColors, 3));
    geometriesToDispose.push(tendonGeo);
    const tendonLines = new THREE.LineSegments(tendonGeo, cableSteel);
    rootGroup.add(tendonLines);

    fingers.push({
      root: fingerRoot,
      yawLink,
      proximalLink,
      distalLink,
      fingertipMesh,
      pulleys: [...basePulleyMeshes, j2PulleyMesh, j3PulleyMesh],
      firstIdlerLock,
      firstIdlerFreeMarker,
      tendonLines,
    });
    sourceTopologyObjects.push(fingerRoot, tendonLines);
  }

  // 4. Twelve visible actuator drums and three four-cable bundles connect the
  // remote drive package to the exact same anchors used by the moving routes.
  const spoolGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.24, 16);
  geometriesToDispose.push(spoolGeo);
  const actuatorSpools: THREE.Mesh[] = [];
  const cableBundles: THREE.LineSegments[] = [];
  for (let fingerIndex = 0; fingerIndex < 3; fingerIndex++) {
    const routeVertices: THREE.Vector3[] = [];
    for (let cableIndex = 0; cableIndex < 4; cableIndex++) {
      const [offsetX, offsetZ] = cableOffsets[cableIndex];
      const spoolX = (fingerIndex - 1) * 0.36 + offsetX * 0.55;
      const spoolZ = offsetZ * 2.4;
      const spool = new THREE.Mesh(spoolGeo, pulleyBrass);
      spool.position.set(spoolX, -2.2, spoolZ);
      forearmGroup.add(spool);
      actuatorSpools.push(spool);

      const origin = new THREE.Vector3(spoolX, -2.08, spoolZ);
      const middle = new THREE.Vector3(spoolX * 0.72, -1.05, spoolZ * 0.72);
      const localEnd = new THREE.Vector3(offsetX, 0.05, offsetZ).applyAxisAngle(
        verticalAxis,
        fingerPositions[fingerIndex].yawBase,
      );
      const end = localEnd.add(
        new THREE.Vector3(fingerPositions[fingerIndex].x, 0.42, fingerPositions[fingerIndex].z),
      );
      routeVertices.push(origin, middle, middle.clone(), end);
    }
    const bundleGeometry = new THREE.BufferGeometry().setFromPoints(routeVertices);
    const bundleColors = new Float32Array(routeVertices.length * 3);
    for (let cableIndex = 0; cableIndex < 4; cableIndex++) {
      const color = new THREE.Color(cableColors[cableIndex]);
      for (let vertexIndex = 0; vertexIndex < 4; vertexIndex++) {
        color.toArray(bundleColors, (cableIndex * 4 + vertexIndex) * 3);
      }
    }
    bundleGeometry.setAttribute("color", new THREE.BufferAttribute(bundleColors, 3));
    geometriesToDispose.push(bundleGeometry);
    const bundle = new THREE.LineSegments(bundleGeometry, cableSteel);
    rootGroup.add(bundle);
    cableBundles.push(bundle);
    sourceTopologyObjects.push(bundle);
  }

  sourceTopologyObjects.push(...actuatorSpools);

  const dispose = () => {
    for (const mat of materialsToDispose) mat.dispose();
    for (const geo of geometriesToDispose) geo.dispose();
  };

  return {
    rootGroup,
    forearmGroup,
    wristGroup,
    palmGroup,
    fingers,
    cableBundles,
    actuatorSpools,
    tensionSensors,
    sourceTopologyObjects,
    materials: {
      aluminiumChassis,
      fingerLink,
      pulleyBrass,
      fingertipElastomer,
      cableSteel,
    },
    dispose,
  };
}

class LineBasicMaterialWithDisposal extends THREE.LineBasicMaterial {}

function localRoutePoint(
  rootGroup: THREE.Group,
  object: THREE.Object3D,
  localPoint: THREE.Vector3,
): THREE.Vector3 {
  const worldPoint = object.localToWorld(localPoint.clone());
  return rootGroup.worldToLocal(worldPoint);
}

function updateTendonPath(rootGroup: THREE.Group, finger: FingerHierarchy): void {
  const position = finger.tendonLines.geometry.getAttribute("position") as THREE.BufferAttribute;
  const offsets = [
    [-0.08, 0.08],
    [0.08, 0.08],
    [0.08, -0.08],
    [-0.08, -0.08],
  ] as const;
  let vertex = 0;

  offsets.forEach(([x, z], cableIndex) => {
    const finalAnchor =
      cableIndex === 0 || cableIndex === 3
        ? localRoutePoint(rootGroup, finger.proximalLink, new THREE.Vector3(x, 0.42, z))
        : localRoutePoint(rootGroup, finger.distalLink, new THREE.Vector3(x, 0.68, z));
    const points = [
      localRoutePoint(rootGroup, finger.root, new THREE.Vector3(x, 0.05, z)),
      localRoutePoint(rootGroup, finger.yawLink, new THREE.Vector3(x, 0.16, z)),
      localRoutePoint(rootGroup, finger.proximalLink, new THREE.Vector3(x, 0.02, z)),
      finalAnchor,
    ];

    for (let segment = 0; segment < points.length - 1; segment++) {
      for (const point of [points[segment], points[segment + 1]]) {
        position.setXYZ(vertex, point.x, point.y, point.z);
        vertex += 1;
      }
    }
  });
  position.needsUpdate = true;
  finger.tendonLines.geometry.computeBoundingSphere();
}

export function updateSalisburyRobotHandModel(
  model: SalisburyRobotHandModel,
  tel: SalisburyRobotHandTelemetry,
) {
  const [axis1Deg, axis2Deg, axis3Deg] = tel.displayJointAnglesDeg;
  for (const object of model.sourceTopologyObjects) object.visible = tel.claim1RoutingProbe;
  for (let index = 0; index < model.fingers.length; index++) {
    const finger = model.fingers[index];
    const mirror = index === 1 ? -1 : 1;
    finger.yawLink.rotation.y = (mirror * axis1Deg * Math.PI) / 180;
    finger.proximalLink.rotation.x = -(axis2Deg * Math.PI) / 180;
    finger.distalLink.rotation.x = -(axis3Deg * Math.PI) / 180;
    finger.firstIdlerLock.visible = tel.claim1RoutingProbe && tel.claim2IdlerProbe;
    finger.firstIdlerFreeMarker.visible = tel.claim1RoutingProbe && !tel.claim2IdlerProbe;
  }

  model.rootGroup.userData.claim1RoutingPresent = tel.claim1RoutingProbe;
  model.rootGroup.userData.firstIdlerFixed = tel.claim2IdlerProbe;
  model.rootGroup.userData.activeJointCoordinates = tel.activeJointCoordinates;
  model.rootGroup.userData.activeCableEndCount = tel.activeCableEndCount;
  model.rootGroup.userData.genericTopologyOwner = tel.owners.topology;
  model.rootGroup.userData.genericRevoluteOwner = tel.owners.revolute;

  model.rootGroup.updateMatrixWorld(true);
  for (const finger of model.fingers) updateTendonPath(model.rootGroup, finger);
}
