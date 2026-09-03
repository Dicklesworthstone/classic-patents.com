/**
 * Procedural source-reading model for US 5,701,965 — Human Transporter.
 *
 * Table 1 owns the wheel, carrier, and stair dimensions. Figures 39--42 own
 * the discrete support poses. The model deliberately stops at rigid planar
 * contact geometry: it does not invent motor torque, friction, compliance,
 * impact, controller gains, or rider dynamics.
 */

import * as THREE from "three";
import type {
  KamenTransporterControls,
  KamenTransporterTelemetry,
} from "@/physics/kamenTransporterKernel";
import { KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M } from "@/physics/kamenTransporterKernel";

const WHEEL_PHASES_RAD = [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6] as const;
const LATERAL_CLUSTER_OFFSET_M = 0.31;

export interface KamenTransporterModel {
  root: THREE.Group;
  chassis: THREE.Group;
  seatGroup: THREE.Group;
  standingMast: THREE.Group;
  leftCluster: THREE.Group;
  rightCluster: THREE.Group;
  leftWheel1: THREE.Mesh;
  leftWheel2: THREE.Mesh;
  leftWheel3: THREE.Mesh;
  rightWheel1: THREE.Mesh;
  rightWheel2: THREE.Mesh;
  rightWheel3: THREE.Mesh;
  leftDirectWheel: THREE.Mesh;
  rightDirectWheel: THREE.Mesh;
  flatTerrain: THREE.Group;
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
  const stairMat = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.82 });
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
  baseMesh.position.y = 0.11;
  baseMesh.castShadow = true;
  chassis.add(baseMesh);

  const crossMemberGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.62, 24);
  crossMemberGeom.rotateX(Math.PI / 2);
  geometriesToDispose.push(crossMemberGeom);
  chassis.add(new THREE.Mesh(crossMemberGeom, accentMat));

  const axleBraceGeom = new THREE.BoxGeometry(0.12, 0.1, 0.13);
  geometriesToDispose.push(axleBraceGeom);
  const axleBrace = new THREE.Mesh(axleBraceGeom, structuralMat);
  axleBrace.position.y = 0.045;
  chassis.add(axleBrace);

  // A support silhouette keeps the human-transporter context legible; it is
  // not a claim that this is the physical configuration of any embodiment.
  const seatGroup = new THREE.Group();
  seatGroup.name = "support-silhouette";
  chassis.add(seatGroup);
  const seatCushionGeom = new THREE.BoxGeometry(0.38, 0.08, 0.38);
  geometriesToDispose.push(seatCushionGeom);
  const seatCushion = new THREE.Mesh(seatCushionGeom, chassisMat);
  seatCushion.position.set(0, 0.28, 0);
  seatGroup.add(seatCushion);
  const seatPedestalGeom = new THREE.BoxGeometry(0.12, 0.14, 0.12);
  geometriesToDispose.push(seatPedestalGeom);
  const seatPedestal = new THREE.Mesh(seatPedestalGeom, structuralMat);
  seatPedestal.position.set(0, 0.205, 0);
  seatGroup.add(seatPedestal);
  const seatBackGeom = new THREE.BoxGeometry(0.06, 0.45, 0.38);
  geometriesToDispose.push(seatBackGeom);
  const seatBack = new THREE.Mesh(seatBackGeom, chassisMat);
  seatBack.position.set(-0.16, 0.51, 0);
  seatGroup.add(seatBack);

  const standingMast = new THREE.Group();
  standingMast.name = "balance-mode-marker";
  chassis.add(standingMast);
  const mastGeom = new THREE.CylinderGeometry(0.02, 0.025, 0.95, 16);
  geometriesToDispose.push(mastGeom);
  const mastMesh = new THREE.Mesh(mastGeom, structuralMat);
  mastMesh.position.set(0.12, 0.625, 0);
  standingMast.add(mastMesh);
  const handleBarGeom = new THREE.CylinderGeometry(0.018, 0.018, 0.45, 16);
  handleBarGeom.rotateX(Math.PI / 2);
  geometriesToDispose.push(handleBarGeom);
  const handleBarMesh = new THREE.Mesh(handleBarGeom, accentMat);
  handleBarMesh.position.set(0.12, 1.1, 0);
  standingMast.add(handleBarMesh);

  const markerGeom = new THREE.SphereGeometry(0.04, 16, 16);
  geometriesToDispose.push(markerGeom);
  const cgMarker = new THREE.Mesh(markerGeom, topologyMat);
  cgMarker.name = "topology-state-marker";
  cgMarker.position.set(0, KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M.systemCentreOffsetM, 0);
  chassis.add(cgMarker);

  const linkGeom = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M.systemCentreOffsetM, 0),
  ]);
  geometriesToDispose.push(linkGeom);
  const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8 });
  materialsToDispose.push(lineMat);
  const topologyLinkLine = new THREE.Line(linkGeom, lineMat);
  topologyLinkLine.name = "control-relationship-link";
  chassis.add(topologyLinkLine);

  const wheelRadiusM = KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M.wheelRadiusM;
  const clusterRadiusM = KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M.clusterRadiusM;
  const tireTubeRadius = wheelRadiusM * 0.24;
  const tireGeom = new THREE.TorusGeometry(wheelRadiusM - tireTubeRadius, tireTubeRadius, 16, 32);
  geometriesToDispose.push(tireGeom);
  const rimGeom = new THREE.CylinderGeometry(wheelRadiusM * 0.58, wheelRadiusM * 0.58, 0.035, 24);
  rimGeom.rotateX(Math.PI / 2);
  geometriesToDispose.push(rimGeom);

  function createWheel(name: string): THREE.Mesh {
    const wheel = new THREE.Mesh(tireGeom, tireMat);
    wheel.name = name;
    wheel.castShadow = true;
    const rim = new THREE.Mesh(rimGeom, rimMat);
    rim.name = `${name}-rim-and-hub`;
    wheel.add(rim);
    return wheel;
  }

  function createClusterWheelGroup(sideZ: number) {
    const cluster = new THREE.Group();
    cluster.name = "cluster-wheel-module";
    cluster.position.set(0, 0, sideZ);
    root.add(cluster);

    const carrier = new THREE.Group();
    carrier.name = "cluster-wheel-carrier";
    cluster.add(carrier);
    const armGeom = new THREE.BoxGeometry(clusterRadiusM, 0.026, 0.028);
    geometriesToDispose.push(armGeom);
    for (const phaseRad of WHEEL_PHASES_RAD) {
      const arm = new THREE.Mesh(armGeom, structuralMat);
      arm.name = "hub-to-wheel-structural-arm";
      arm.position.set(
        (clusterRadiusM / 2) * Math.cos(phaseRad),
        (clusterRadiusM / 2) * Math.sin(phaseRad),
        0,
      );
      arm.rotation.z = phaseRad;
      carrier.add(arm);
    }

    const capGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.05, 16);
    capGeom.rotateX(Math.PI / 2);
    geometriesToDispose.push(capGeom);
    carrier.add(new THREE.Mesh(capGeom, accentMat));

    const wheels = WHEEL_PHASES_RAD.map((phaseRad, index) => {
      const wheel = createWheel(`cluster-wheel-${String.fromCharCode(97 + index)}`);
      wheel.position.set(
        clusterRadiusM * Math.cos(phaseRad),
        clusterRadiusM * Math.sin(phaseRad),
        0,
      );
      carrier.add(wheel);
      return wheel;
    });

    return { cluster, wheels };
  }

  const left = createClusterWheelGroup(LATERAL_CLUSTER_OFFSET_M);
  const right = createClusterWheelGroup(-LATERAL_CLUSTER_OFFSET_M);

  const leftDirectWheel = createWheel("direct-ground-wheel-left");
  leftDirectWheel.position.z = LATERAL_CLUSTER_OFFSET_M;
  leftDirectWheel.visible = false;
  root.add(leftDirectWheel);
  const rightDirectWheel = createWheel("direct-ground-wheel-right");
  rightDirectWheel.position.z = -LATERAL_CLUSTER_OFFSET_M;
  rightDirectWheel.visible = false;
  root.add(rightDirectWheel);

  function addTerrainBlock(
    group: THREE.Group,
    name: string,
    xMinM: number,
    xMaxM: number,
    topYM: number,
  ) {
    const terrainBottomM = -0.08;
    const blockGeom = new THREE.BoxGeometry(xMaxM - xMinM, topYM - terrainBottomM, 1.08);
    geometriesToDispose.push(blockGeom);
    const block = new THREE.Mesh(blockGeom, stairMat);
    block.name = name;
    block.position.set((xMinM + xMaxM) / 2, (topYM + terrainBottomM) / 2, 0);
    block.receiveShadow = true;
    group.add(block);
  }

  const flatTerrain = new THREE.Group();
  flatTerrain.name = "level-ground-support";
  addTerrainBlock(flatTerrain, "level-ground-top-y-zero", -0.72, 0.72, 0);
  root.add(flatTerrain);

  const stairTerrain = new THREE.Group();
  stairTerrain.name = "table-1-two-riser-support";
  stairTerrain.visible = false;
  root.add(stairTerrain);
  const { stairRiseM, stairTreadM } = KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M;
  addTerrainBlock(stairTerrain, "ground-approach-top-y-zero", -0.72, 0, 0);
  addTerrainBlock(stairTerrain, "first-tread-table-1", 0, stairTreadM, stairRiseM);
  addTerrainBlock(
    stairTerrain,
    "second-tread-table-1",
    stairTreadM,
    stairTreadM + 0.72,
    2 * stairRiseM,
  );

  return {
    root,
    chassis,
    seatGroup,
    standingMast,
    leftCluster: left.cluster,
    rightCluster: right.cluster,
    leftWheel1: left.wheels[0],
    leftWheel2: left.wheels[1],
    leftWheel3: left.wheels[2],
    rightWheel1: right.wheels[0],
    rightWheel2: right.wheels[1],
    rightWheel3: right.wheels[2],
    leftDirectWheel,
    rightDirectWheel,
    flatTerrain,
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
  // The source publishes discrete angles and dimensions but not a timed wheel
  // trajectory, so wheel spin remains fixed while the complete rigid pose is
  // projected exactly on both lateral carriers.
  const pose = tel.displayPose;
  model.chassis.position.set(pose.axleXM, pose.axleYM, 0);
  model.chassis.rotation.z = pose.chassisPitchRad;
  model.leftCluster.position.set(pose.axleXM, pose.axleYM, LATERAL_CLUSTER_OFFSET_M);
  model.rightCluster.position.set(pose.axleXM, pose.axleYM, -LATERAL_CLUSTER_OFFSET_M);

  model.leftCluster.visible = tel.clusterTopologyActive;
  model.rightCluster.visible = tel.clusterTopologyActive;
  model.leftCluster.rotation.z = pose.carrierRotationRad;
  model.rightCluster.rotation.z = pose.carrierRotationRad;
  model.leftDirectWheel.visible = !tel.clusterTopologyActive;
  model.rightDirectWheel.visible = !tel.clusterTopologyActive;
  model.leftDirectWheel.position.set(pose.axleXM, pose.axleYM, LATERAL_CLUSTER_OFFSET_M);
  model.rightDirectWheel.position.set(pose.axleXM, pose.axleYM, -LATERAL_CLUSTER_OFFSET_M);
  model.flatTerrain.visible = !pose.stairActive;
  model.stairTerrain.visible = pose.stairActive;
  model.seatGroup.visible = true;
  model.standingMast.visible = true;

  for (const wheel of [
    model.leftWheel1,
    model.leftWheel2,
    model.leftWheel3,
    model.rightWheel1,
    model.rightWheel2,
    model.rightWheel3,
    model.leftDirectWheel,
    model.rightDirectWheel,
  ]) {
    wheel.rotation.z = 0;
  }

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
