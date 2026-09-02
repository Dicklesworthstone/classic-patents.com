import * as THREE from "three";
import type { AmfVersatranTopologyState } from "@/physics/amfVersatranKernel";

export interface AmfVersatranModel {
  root: THREE.Group;
  updateState: (state: AmfVersatranTopologyState) => void;
  dispose: () => void;
}

function setRodBetween(mesh: THREE.Mesh, start: THREE.Vector3, end: THREE.Vector3) {
  const direction = end.clone().sub(start);
  const length = Math.max(direction.length(), 0.0001);
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.scale.set(1, length, 1);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
}

/**
 * A procedural, normalized museum form for the source-named apparatus:
 * rotating column B, carriage C, horizontal arm A, wrist G, work-manipulating
 * member, programming arm, and record/playback path. Fixed coordinates here
 * are display proportions only; US 3,212,649 prints no dimension table.
 */
export function buildAmfVersatranModel(): AmfVersatranModel {
  const root = new THREE.Group();
  root.name = "US 3,212,649 normalized AMF Versatran source-topology exhibit";
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

  const darkSteel = material(
    new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.84, roughness: 0.24 }),
  );
  const columnSteel = material(
    new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.76, roughness: 0.26 }),
  );
  const carriagePaint = material(
    new THREE.MeshStandardMaterial({ color: 0x0e7490, metalness: 0.58, roughness: 0.24 }),
  );
  const armPaint = material(
    new THREE.MeshStandardMaterial({ color: 0x0891b2, metalness: 0.56, roughness: 0.22 }),
  );
  const wristPaint = material(
    new THREE.MeshStandardMaterial({ color: 0x7c3aed, metalness: 0.52, roughness: 0.23 }),
  );
  const gripperPaint = material(
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7, roughness: 0.19 }),
  );
  const teachPaint = material(
    new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x25053d,
      emissiveIntensity: 0.2,
      metalness: 0.44,
      roughness: 0.27,
    }),
  );
  const signalPaint = material(
    new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x082f49,
      emissiveIntensity: 0.24,
      metalness: 0.45,
      roughness: 0.25,
    }),
  );
  const correspondenceLamp = material(
    new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x064e3b,
      emissiveIntensity: 0.3,
      roughness: 0.3,
    }),
  );
  const offsetLamp = material(
    new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0x881337,
      emissiveIntensity: 0.5,
      roughness: 0.25,
    }),
  );

  const basePlate = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(1.2, 1.28, 0.18, 36)),
    darkSteel,
  );
  basePlate.name = "Base assembly";
  basePlate.position.y = -0.92;
  root.add(basePlate);

  const columnAssembly = new THREE.Group();
  columnAssembly.name = "Rotating column B assembly";
  columnAssembly.position.y = -0.83;
  root.add(columnAssembly);

  const columnPost = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.24, 0.24, 2.65, 32)),
    columnSteel,
  );
  columnPost.position.y = 1.32;
  columnAssembly.add(columnPost);

  const carriage = new THREE.Group();
  carriage.name = "Elevating carriage C";
  const carriageBody = new THREE.Mesh(
    geometry(new THREE.BoxGeometry(0.68, 0.76, 0.68)),
    carriagePaint,
  );
  carriage.add(carriageBody);
  columnAssembly.add(carriage);

  const armRoot = new THREE.Group();
  armRoot.name = "Horizontal arm A";
  carriage.add(armRoot);

  const telescopingBoom = new THREE.Mesh(geometry(new THREE.BoxGeometry(1, 0.24, 0.24)), armPaint);
  telescopingBoom.name = "Normalized horizontal arm travel display";
  const actuatorShell = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.08, 0.08, 1, 16)),
    columnSteel,
  );
  actuatorShell.name = "Horizontal-arm actuator topology";
  actuatorShell.rotation.z = Math.PI / 2;
  const actuatorRod = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.045, 0.045, 1, 16)),
    darkSteel,
  );
  actuatorRod.name = "Horizontal-arm actuator rod topology";
  actuatorRod.rotation.z = Math.PI / 2;
  armRoot.add(telescopingBoom, actuatorShell, actuatorRod);

  const wristSwingStage = new THREE.Group();
  wristSwingStage.name = "Wrist assembly G swing about central vertical axis";
  const wristRotationStage = new THREE.Group();
  wristRotationStage.name = "Wrist assembly G rotation about horizontal arm axis";
  const wristHub = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.12, 0.12, 0.18, 18)),
    wristPaint,
  );
  wristHub.name = "Wrist G normalized hub";
  wristRotationStage.add(wristHub);

  const gripper = new THREE.Group();
  gripper.name = "Claim 12 work manipulating member with coupled gripping fingers";
  const pinionGripper = new THREE.Group();
  pinionGripper.name = "Claim 12 engaging pinions and Claim 13 rack topology";
  const upperPinion = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.075, 0.075, 0.045, 18)),
    gripperPaint,
  );
  upperPinion.name = "Gear 334 / Claim 12 engaging pinion";
  upperPinion.rotation.x = Math.PI / 2;
  upperPinion.position.set(0.1, 0.105, 0.01);
  const lowerPinion = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.075, 0.075, 0.045, 18)),
    gripperPaint,
  );
  lowerPinion.name = "Gear 346 / Claim 12 engaging pinion";
  lowerPinion.rotation.x = Math.PI / 2;
  lowerPinion.position.set(0.1, -0.105, 0.01);
  const upperJawPivot = new THREE.Group();
  upperJawPivot.name = "Upper gripping-finger pivot";
  upperJawPivot.position.set(0.1, 0.105, 0);
  const jawA = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.28, 0.045, 0.07)), gripperPaint);
  jawA.name = "Gripping finger 324";
  jawA.position.set(0.18, 0, 0);
  upperJawPivot.add(jawA);
  const lowerJawPivot = new THREE.Group();
  lowerJawPivot.name = "Lower gripping-finger pivot";
  lowerJawPivot.position.set(0.1, -0.105, 0);
  const jawB = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.28, 0.045, 0.07)), gripperPaint);
  jawB.name = "Gripping finger 326";
  jawB.position.set(0.18, 0, 0);
  lowerJawPivot.add(jawB);
  const upperRack = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.36, 0.04, 0.035)), darkSteel);
  upperRack.name = "Claim 13 upper linearly movable rack";
  upperRack.position.set(-0.09, 0.19, 0);
  const lowerRack = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.36, 0.04, 0.035)), darkSteel);
  lowerRack.name = "Claim 13 lower linearly movable rack";
  lowerRack.position.set(-0.09, -0.19, 0);
  const genericTool = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.38, 0.22, 0.14)), wristPaint);
  genericTool.name = "Generic work tool when Claim 12 topology is withheld";
  genericTool.position.set(0.22, 0, 0);
  genericTool.visible = false;
  pinionGripper.add(upperPinion, lowerPinion, upperJawPivot, lowerJawPivot, upperRack, lowerRack);
  gripper.add(pinionGripper, genericTool);
  wristRotationStage.add(gripper);
  wristSwingStage.add(wristRotationStage);
  armRoot.add(wristSwingStage);

  const teachLink = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.024, 0.024, 1, 12)),
    teachPaint,
  );
  teachLink.name = "Manual programming arm";
  const teachHandle = new THREE.Mesh(geometry(new THREE.SphereGeometry(0.09, 16, 12)), teachPaint);
  teachHandle.name = "Manual programming handle";
  columnAssembly.add(teachLink, teachHandle);

  const signalDisplay = new THREE.Group();
  signalDisplay.name = "Recorded-signal and feedback comparison display";
  const signalCabinet = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.9, 1.4, 0.36)), darkSteel);
  const recordedDial = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.2, 0.2, 0.05, 24)),
    signalPaint,
  );
  recordedDial.name = "Recorded command display";
  recordedDial.rotation.x = Math.PI / 2;
  recordedDial.position.set(-0.22, -0.22, 0.21);
  const feedbackDial = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.2, 0.2, 0.05, 24)),
    signalPaint,
  );
  feedbackDial.name = "Feedback position display";
  feedbackDial.rotation.x = Math.PI / 2;
  feedbackDial.position.set(0.22, -0.22, 0.21);
  const comparator = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.16, 0.2, 0.09)), gripperPaint);
  comparator.name = "Source-described comparison display";
  comparator.position.set(0, -0.22, 0.23);
  const comparisonLamps = [0, 1, 2].map((index) => {
    const lamp = new THREE.Mesh(
      geometry(new THREE.SphereGeometry(0.055, 14, 10)),
      correspondenceLamp,
    );
    lamp.name = `Comparison display channel ${index + 1}`;
    lamp.position.set(-0.22 + index * 0.22, -0.69, 0.22);
    signalDisplay.add(lamp);
    return lamp;
  });
  signalDisplay.position.set(1.66, -0.18, -0.88);
  signalDisplay.add(signalCabinet, recordedDial, feedbackDial, comparator);
  root.add(signalDisplay);

  const updateState = (state: AmfVersatranTopologyState) => {
    const { controls, displayPose } = state;
    root.visible = state.claimProbeStates[1];
    columnAssembly.rotation.y = displayPose.columnRotationDisplayRad;
    carriage.position.y = -0.42 + controls.carriageLift * 1.18;

    const boomLength = 0.72 + controls.armTravel * 0.9;
    telescopingBoom.scale.x = boomLength;
    telescopingBoom.position.x = 0.79 + boomLength / 2;
    actuatorShell.scale.y = boomLength * 0.88;
    actuatorShell.position.x = 0.76 + boomLength / 2;
    actuatorRod.scale.y = 0.37 + controls.armTravel * 0.68;
    actuatorRod.position.x = 1.1 + boomLength;

    const wristX = 0.79 + boomLength + 0.26;
    wristSwingStage.position.x = wristX;
    wristSwingStage.rotation.y = displayPose.wristSwingDisplayRad;
    wristRotationStage.rotation.x = displayPose.wristRotationDisplayRad;
    const pinionRotation = displayPose.gripperPinionRotationDisplayRad;
    upperPinion.rotation.z = pinionRotation;
    lowerPinion.rotation.z = -pinionRotation;
    upperJawPivot.rotation.z = pinionRotation;
    lowerJawPivot.rotation.z = -pinionRotation;
    const rackTravel = (displayPose.gripperRackTravelFraction - 0.5) * 0.16;
    upperRack.position.x = -0.09 + rackTravel;
    lowerRack.position.x = -0.09 - rackTravel;
    pinionGripper.visible = displayPose.pinionGripperTopologyEnabled;
    genericTool.visible = !displayPose.pinionGripperTopologyEnabled;

    const armStart = new THREE.Vector3(-0.36, 1.55, 0);
    const armEnd = new THREE.Vector3(-0.92, 1.35 + controls.carriageLift * 0.36, 0.08);
    setRodBetween(teachLink, armStart, armEnd);
    teachHandle.position.copy(armEnd).add(new THREE.Vector3(-0.08, -0.06, 0));
    teachPaint.emissive.setHex(
      state.programMode === "manual-teach-and-record" ? 0x4c1d95 : 0x16052b,
    );
    teachPaint.emissiveIntensity = state.programMode === "manual-teach-and-record" ? 0.52 : 0.13;

    recordedDial.rotation.z = (state.comparisonChannels[0]?.recordedSignalPhase ?? 0) * Math.PI * 2;
    feedbackDial.rotation.z = (state.comparisonChannels[0]?.feedbackSignalPhase ?? 0) * Math.PI * 2;
    // Claim 8 is the source-described recording / repetitive-playback path.
    // When that independent topology is withheld, do not leave a decorative
    // comparator cabinet standing in for the omitted relationship.
    signalDisplay.visible = state.claimProbeStates[8];
    signalPaint.emissive.setHex(
      state.programMode === "automatic-recorded-signal-playback" ? 0x0e7490 : 0x082f49,
    );
    signalPaint.emissiveIntensity =
      state.programMode === "automatic-recorded-signal-playback" ? 0.56 : 0.2;
    comparisonLamps.forEach((lamp, index) => {
      const hasOffset =
        Math.abs(state.comparisonChannels[index]?.normalizedPhaseError ?? 0) > 0.001;
      lamp.material = hasOffset ? offsetLamp : correspondenceLamp;
      lamp.scale.setScalar(hasOffset ? 1.18 : 1);
    });
  };

  return {
    root,
    updateState,
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

export const createAMFVersatranModel = buildAmfVersatranModel;
