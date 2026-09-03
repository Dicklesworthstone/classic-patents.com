/**
 * Procedural source-reading model for US 5,701,965 — Human Transporter.
 *
 * This is a qualitative claim-reading instrument: it makes the supported
 * ground-contacting cluster, balance-loop, transfer, and climb relationships
 * visible. Scene dimensions and the discrete cluster poses are normalized
 * display coordinates, not measurements or a reconstruction of a gear train.
 */

import * as THREE from "three";
import type {
  KamenTransporterControls,
  KamenTransporterTelemetry,
} from "@/physics/kamenTransporterKernel";

/** Normalized scene radius only; it is not a dimension disclosed by the grant. */
const DISPLAY_WHEEL_RADIUS = 0.15;

export interface KamenTransporterModel {
  root: THREE.Group;
  chassis: THREE.Group;
  seatGroup: THREE.Group;
  standingMast: THREE.Group;
  leftCluster: THREE.Group;
  rightCluster: THREE.Group;
  leftWheel1: THREE.Mesh;
  leftWheel2: THREE.Mesh;
  rightWheel1: THREE.Mesh;
  rightWheel2: THREE.Mesh;
  stairTerrain: THREE.Group;
  cgMarker: THREE.Mesh;
  topologyLinkLine: THREE.Line;
  dispose: () => void;
}

export function buildKamenTransporterModel(): KamenTransporterModel {
  const root = new THREE.Group();
  root.name = "kamen-source-topology";
  const materialsToDispose: THREE.Material[] = [];
  const geometriesToDispose: THREE.BufferGeometry[] = [];

  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    metalness: 0.6,
    roughness: 0.3,
  });
  const structuralMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.8,
    roughness: 0.4,
  });
  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.9,
    metalness: 0.1,
  });
  const rimMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    metalness: 0.7,
    roughness: 0.2,
  });
  const accentMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.5,
    roughness: 0.3,
  });
  const topologyMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x047857,
    emissiveIntensity: 0.4,
    roughness: 0.2,
  });
  const stairMat = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.8 });
  materialsToDispose.push(
    chassisMat,
    structuralMat,
    tireMat,
    rimMat,
    accentMat,
    topologyMat,
    stairMat,
  );

  const chassis = new THREE.Group();
  chassis.name = "support-and-control-body";
  root.add(chassis);
  const baseGeom = new THREE.BoxGeometry(0.4, 0.14, 0.46);
  geometriesToDispose.push(baseGeom);
  const baseMesh = new THREE.Mesh(baseGeom, structuralMat);
  baseMesh.castShadow = true;
  chassis.add(baseMesh);

  const crossMemberGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.62, 24);
  crossMemberGeom.rotateX(Math.PI / 2);
  geometriesToDispose.push(crossMemberGeom);
  chassis.add(new THREE.Mesh(crossMemberGeom, accentMat));

  // A support silhouette keeps the human-transporter context legible; it is
  // not a claim that this is the physical configuration of any embodiment.
  const seatGroup = new THREE.Group();
  seatGroup.name = "support-silhouette";
  chassis.add(seatGroup);
  const seatCushionGeom = new THREE.BoxGeometry(0.38, 0.08, 0.38);
  geometriesToDispose.push(seatCushionGeom);
  const seatCushion = new THREE.Mesh(seatCushionGeom, chassisMat);
  seatCushion.position.set(0, 0.25, 0);
  seatGroup.add(seatCushion);
  const seatBackGeom = new THREE.BoxGeometry(0.06, 0.45, 0.38);
  geometriesToDispose.push(seatBackGeom);
  const seatBack = new THREE.Mesh(seatBackGeom, chassisMat);
  seatBack.position.set(-0.16, 0.5, 0);
  seatGroup.add(seatBack);

  const standingMast = new THREE.Group();
  standingMast.name = "balance-mode-marker";
  chassis.add(standingMast);
  const mastGeom = new THREE.CylinderGeometry(0.02, 0.025, 0.95, 16);
  geometriesToDispose.push(mastGeom);
  const mastMesh = new THREE.Mesh(mastGeom, structuralMat);
  mastMesh.position.set(0.12, 0.52, 0);
  standingMast.add(mastMesh);
  const handleBarGeom = new THREE.CylinderGeometry(0.018, 0.018, 0.45, 16);
  handleBarGeom.rotateX(Math.PI / 2);
  geometriesToDispose.push(handleBarGeom);
  const handleBarMesh = new THREE.Mesh(handleBarGeom, accentMat);
  handleBarMesh.position.set(0.12, 1.0, 0);
  standingMast.add(handleBarMesh);

  const markerGeom = new THREE.SphereGeometry(0.04, 16, 16);
  geometriesToDispose.push(markerGeom);
  const cgMarker = new THREE.Mesh(markerGeom, topologyMat);
  cgMarker.name = "topology-state-marker";
  cgMarker.position.set(0, 0.85, 0);
  chassis.add(cgMarker);

  const linkGeom = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0.85, 0),
  ]);
  geometriesToDispose.push(linkGeom);
  const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8 });
  materialsToDispose.push(lineMat);
  const topologyLinkLine = new THREE.Line(linkGeom, lineMat);
  topologyLinkLine.name = "control-relationship-link";
  chassis.add(topologyLinkLine);

  function createClusterWheelGroup(sideZ: number) {
    const cluster = new THREE.Group();
    cluster.name = "cluster-wheel-module";
    cluster.position.set(0, 0, sideZ);
    root.add(cluster);

    const carrier = new THREE.Group();
    carrier.name = "cluster-wheel-carrier";
    cluster.add(carrier);
    const armGeom = new THREE.BoxGeometry(0.36, 0.04, 0.03);
    geometriesToDispose.push(armGeom);
    carrier.add(new THREE.Mesh(armGeom, structuralMat));

    const capGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.05, 16);
    capGeom.rotateX(Math.PI / 2);
    geometriesToDispose.push(capGeom);
    carrier.add(new THREE.Mesh(capGeom, accentMat));

    const tireTubeRadius = 0.04;
    const tireGeom = new THREE.TorusGeometry(
      DISPLAY_WHEEL_RADIUS - tireTubeRadius,
      tireTubeRadius,
      16,
      24,
    );
    geometriesToDispose.push(tireGeom);
    const rimGeom = new THREE.CylinderGeometry(0.09, 0.09, 0.04, 16);
    rimGeom.rotateX(Math.PI / 2);
    geometriesToDispose.push(rimGeom);

    const wheel1 = new THREE.Mesh(tireGeom, tireMat);
    wheel1.name = "cluster-wheel-a";
    wheel1.position.set(-0.18, 0, 0);
    wheel1.castShadow = true;
    carrier.add(wheel1);
    wheel1.add(new THREE.Mesh(rimGeom, rimMat));

    const wheel2 = new THREE.Mesh(tireGeom, tireMat);
    wheel2.name = "cluster-wheel-b";
    wheel2.position.set(0.18, 0, 0);
    wheel2.castShadow = true;
    carrier.add(wheel2);
    wheel2.add(new THREE.Mesh(rimGeom, rimMat));

    return { cluster, wheel1, wheel2 };
  }

  const left = createClusterWheelGroup(0.32);
  const right = createClusterWheelGroup(-0.32);

  const stairTerrain = new THREE.Group();
  stairTerrain.name = "symbolic-stair-sequence";
  stairTerrain.position.set(1.2, -0.15, 0);
  stairTerrain.visible = false;
  root.add(stairTerrain);
  // These are normalized scene blocks used only to distinguish the transfer /
  // climb states. They are not a measured stair geometry from the patent.
  for (let i = 0; i < 4; i++) {
    const stepGeom = new THREE.BoxGeometry(0.35, 0.16 * (i + 1), 1.2);
    geometriesToDispose.push(stepGeom);
    const stepMesh = new THREE.Mesh(stepGeom, stairMat);
    stepMesh.position.set(i * 0.32, (0.16 * (i + 1)) / 2, 0);
    stepMesh.receiveShadow = true;
    stairTerrain.add(stepMesh);
  }

  return {
    root,
    chassis,
    seatGroup,
    standingMast,
    leftCluster: left.cluster,
    rightCluster: right.cluster,
    leftWheel1: left.wheel1,
    leftWheel2: left.wheel2,
    rightWheel1: right.wheel1,
    rightWheel2: right.wheel2,
    stairTerrain,
    cgMarker,
    topologyLinkLine,
    dispose: () => {
      materialsToDispose.forEach((material) => {
        material.dispose();
      });
      geometriesToDispose.forEach((geometry) => {
        geometry.dispose();
      });
    },
  };
}

export function updateKamenTransporterKinematics(
  model: KamenTransporterModel,
  _controls: KamenTransporterControls,
  tel: KamenTransporterTelemetry,
  _wheelRollAngleRad: number,
) {
  // No pitch or wheel spin is calculated: neither is published numerically in
  // US 5,701,965. The discrete display pose is explicitly a claim-reading cue.
  model.chassis.rotation.z = 0;
  const normalizedElevation = tel.topologyState === "ground_support" ? 0 : 0.22;
  model.chassis.position.y = normalizedElevation;
  model.leftCluster.position.y = normalizedElevation;
  model.rightCluster.position.y = normalizedElevation;

  model.leftCluster.visible = tel.clusterTopologyActive;
  model.rightCluster.visible = tel.clusterTopologyActive;
  const displayPose = tel.clusterTopologyActive ? tel.clusterDisplayPoseRad : 0;
  model.leftCluster.rotation.z = displayPose;
  model.rightCluster.rotation.z = displayPose;
  model.stairTerrain.visible = tel.stairSequenceActive;
  model.seatGroup.visible = true;
  model.standingMast.visible = tel.balanceLoopActive;

  model.leftWheel1.rotation.z = 0;
  model.leftWheel2.rotation.z = 0;
  model.rightWheel1.rotation.z = 0;
  model.rightWheel2.rotation.z = 0;

  const markerMaterial = model.cgMarker.material as THREE.MeshStandardMaterial;
  if (tel.balanceLoopActive) {
    markerMaterial.color.setHex(0x10b981);
    markerMaterial.emissive.setHex(0x047857);
  } else if (tel.clusterTopologyActive) {
    markerMaterial.color.setHex(0xf59e0b);
    markerMaterial.emissive.setHex(0x92400e);
  } else {
    markerMaterial.color.setHex(0x0284c7);
    markerMaterial.emissive.setHex(0x0369a1);
  }
}
