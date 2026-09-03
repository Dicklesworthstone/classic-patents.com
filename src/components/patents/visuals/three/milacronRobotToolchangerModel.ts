import * as THREE from "three";
import type { MilacronRobotToolchangerState } from "@/physics/milacronRobotToolchangerKernel";

export interface MilacronRobotToolchangerModel {
  root: THREE.Group;
  updateState: (state: MilacronRobotToolchangerState) => void;
  setInspectionMode: (mode: "adapter" | "lock" | "rack") => void;
  dispose: () => void;
}

/**
 * Procedural exhibit based on the named front/rear plates, locking slide,
 * T-member, locator pins, and common base in US 4,512,709. The source omits
 * dimensions, so all fixed geometry is explicitly normalized display form.
 */
export function buildMilacronRobotToolchangerModel(): MilacronRobotToolchangerModel {
  const root = new THREE.Group();
  root.name = "US 4,512,709 normalized robot toolchanger exhibit";
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

  const housingMat = material(
    new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.24 }),
  );
  const faceMat = material(
    new THREE.MeshStandardMaterial({ color: 0x0e7490, metalness: 0.7, roughness: 0.22 }),
  );
  const slideMat = material(
    new THREE.MeshStandardMaterial({ color: 0x0891b2, metalness: 0.66, roughness: 0.2 }),
  );
  const baseMat = material(
    new THREE.MeshStandardMaterial({ color: 0xa16207, metalness: 0.7, roughness: 0.24 }),
  );
  const toolBaseFaceMat = material(
    new THREE.MeshStandardMaterial({ color: 0xa16207, metalness: 0.7, roughness: 0.24 }),
  );
  const tMat = material(
    new THREE.MeshStandardMaterial({ color: 0xe11d48, metalness: 0.55, roughness: 0.24 }),
  );
  const locatorMat = material(
    new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.82, roughness: 0.16 }),
  );
  const utilityMat = material(
    new THREE.MeshStandardMaterial({ color: 0xa78bfa, metalness: 0.35, roughness: 0.3 }),
  );

  const frontPlateCenterZ = 0.18;
  const frontPlateThickness = 0.17;
  const toolBaseThickness = 0.2;
  const toolBaseSeatedZ = frontPlateCenterZ + frontPlateThickness / 2 + toolBaseThickness / 2;
  const toolBaseApproachZ = 1.26;

  const robotFlange = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(1.05, 1.05, 0.25, 48)),
    housingMat,
  );
  robotFlange.name = "Normalized robot end-effector flange";
  robotFlange.rotation.x = Math.PI / 2;
  robotFlange.position.z = -0.98;
  root.add(robotFlange);

  const rearPlate = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(1.08, 1.08, 0.15, 48)),
    housingMat,
  );
  rearPlate.name = "Rear plate 27";
  rearPlate.rotation.x = Math.PI / 2;
  rearPlate.position.z = -0.68;
  const frontPlateShape = new THREE.Shape();
  frontPlateShape.absarc(0, 0, 1.1, 0, Math.PI * 2, false);
  const frontPlateOpening = new THREE.Path();
  frontPlateOpening.absarc(0, 0, 0.34, 0, Math.PI * 2, true);
  frontPlateShape.holes.push(frontPlateOpening);
  const frontPlateGeometry = geometry(
    new THREE.ExtrudeGeometry(frontPlateShape, {
      depth: frontPlateThickness,
      bevelEnabled: false,
      curveSegments: 48,
    }),
  );
  frontPlateGeometry.translate(0, 0, -frontPlateThickness / 2);
  const frontPlate = new THREE.Mesh(frontPlateGeometry, faceMat);
  frontPlate.name = "Front plate 26 and central opening 30";
  frontPlate.position.z = frontPlateCenterZ;
  root.add(rearPlate, frontPlate);

  for (const [x, y] of [
    [-0.62, -0.52],
    [0.62, -0.52],
    [-0.62, 0.52],
    [0.62, 0.52],
  ] as const) {
    const spacer = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.2, 0.2, 0.9)), housingMat);
    spacer.name = "Spacer block 28 / 29";
    spacer.position.set(x, y, -0.25);
    root.add(spacer);
  }

  const actuator = new THREE.Group();
  actuator.name = "Linear actuator 60, cylinder 47, rod 46, and yoke 45";
  const cylinder = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.2, 0.2, 1.15, 28)),
    utilityMat,
  );
  cylinder.rotation.z = Math.PI / 2;
  cylinder.position.z = -0.37;
  const rod = new THREE.Mesh(geometry(new THREE.CylinderGeometry(0.07, 0.07, 1.7, 20)), locatorMat);
  rod.rotation.z = Math.PI / 2;
  rod.position.z = -0.17;
  actuator.add(cylinder, rod);
  root.add(actuator);

  const slideGroup = new THREE.Group();
  slideGroup.name = "Locking slide 33 with aperture 34 and bifurcated ramp 41";
  const apertureWidth = 0.26;
  const apertureHeight = 0.38;
  const slideWidth = 1.32;
  const slideHeight = 0.5;
  const sideRailWidth = (slideWidth - apertureWidth) / 2;
  const endRailHeight = (slideHeight - apertureHeight) / 2;
  const sideRailGeometry = geometry(new THREE.BoxGeometry(sideRailWidth, slideHeight, 0.14));
  const endRailGeometry = geometry(new THREE.BoxGeometry(apertureWidth, endRailHeight, 0.14));
  const leftRail = new THREE.Mesh(sideRailGeometry, slideMat);
  leftRail.name = "Locking slide 33 left rail";
  leftRail.position.x = -(apertureWidth + sideRailWidth) / 2;
  const rightRail = new THREE.Mesh(sideRailGeometry, slideMat);
  rightRail.name = "Locking slide 33 right rail";
  rightRail.position.x = (apertureWidth + sideRailWidth) / 2;
  const topRail = new THREE.Mesh(endRailGeometry, slideMat);
  topRail.name = "Locking slide 33 top aperture bridge";
  topRail.position.y = (apertureHeight + endRailHeight) / 2;
  const bottomRail = new THREE.Mesh(endRailGeometry, slideMat);
  bottomRail.name = "Locking slide 33 bottom aperture bridge";
  bottomRail.position.y = -(apertureHeight + endRailHeight) / 2;
  const aperture = new THREE.Object3D();
  aperture.name = "Slide aperture 34 clear opening";
  aperture.userData.normalizedOpening = { width: apertureWidth, height: apertureHeight };
  const rampLeft = new THREE.Mesh(geometry(new THREE.ConeGeometry(0.15, 0.32, 4)), locatorMat);
  rampLeft.name = "Slide ramp surface 41 left";
  rampLeft.rotation.z = -Math.PI / 2;
  rampLeft.position.set(-0.28, -0.18, -0.18);
  const rampRight = rampLeft.clone();
  rampRight.name = "Slide ramp surface 41 right";
  rampRight.rotation.z = Math.PI / 2;
  rampRight.position.x = 0.28;
  slideGroup.add(leftRail, rightRail, topRail, bottomRail, aperture, rampLeft, rampRight);
  root.add(slideGroup);

  const locatorGroup = new THREE.Group();
  locatorGroup.name = "Locating pins 43 and 44";
  const roundPin = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.09, 0.09, 0.36, 20)),
    locatorMat,
  );
  roundPin.position.set(-0.46, -0.42, 0.42);
  const diamondPin = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.12, 0.12, 0.36, 4)),
    locatorMat,
  );
  diamondPin.rotation.z = Math.PI / 4;
  diamondPin.position.set(0.46, -0.42, 0.42);
  locatorGroup.add(roundPin, diamondPin);
  root.add(locatorGroup);

  const toolBase = new THREE.Group();
  toolBase.name = "Common tool base 18 with T-member 35";
  const basePlate = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.88, 0.88, toolBaseThickness, 44)),
    toolBaseFaceMat,
  );
  basePlate.name = "Common tool base 18 face plate";
  basePlate.rotation.x = Math.PI / 2;
  const bushingA = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.14, 0.14, 0.22, 20)),
    housingMat,
  );
  bushingA.rotation.x = Math.PI / 2;
  bushingA.position.set(-0.46, -0.42, -0.12);
  const bushingB = bushingA.clone();
  bushingB.position.x = 0.46;
  const stem = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.22, 0.34, 0.58)), tMat);
  stem.name = "Retention member 32 and T-member 35 stem";
  stem.position.z = -0.37;
  const crossbar = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.82, 0.27, 0.17)), tMat);
  crossbar.name = "T-member 35 crossbar 38 and display ramp 39";
  crossbar.position.z = -0.67;
  const genericRetentionHead = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.24, 0.24, 0.16, 28)),
    tMat,
  );
  genericRetentionHead.name = "Generic Claim 3 retention-member head";
  genericRetentionHead.rotation.x = Math.PI / 2;
  genericRetentionHead.position.z = -0.67;
  toolBase.add(basePlate, bushingA, bushingB, stem, crossbar, genericRetentionHead);
  root.add(toolBase);

  const rack = new THREE.Group();
  rack.name = "Representative tool rack 20";
  rack.position.set(-2.2, -0.4, 0.2);
  const rackRail = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.22, 1.7, 0.34)), housingMat);
  rackRail.position.y = 0.22;
  rack.add(rackRail);
  for (const y of [-0.52, 0.05, 0.62]) {
    const parkedBase = new THREE.Mesh(
      geometry(new THREE.CylinderGeometry(0.29, 0.29, 0.15, 20)),
      baseMat,
    );
    parkedBase.rotation.x = Math.PI / 2;
    parkedBase.position.set(0.18, y, 0);
    rack.add(parkedBase);
  }
  root.add(rack);

  const updateState = (state: MilacronRobotToolchangerState) => {
    // Normalized display positions; no source length, speed, or trajectory is asserted.
    toolBase.visible = state.toolBasePresent;
    toolBase.position.z =
      toolBaseApproachZ - state.registrationFraction * (toolBaseApproachZ - toolBaseSeatedZ);
    slideGroup.position.x = state.lockingSlideFraction * 0.58;
    crossbar.visible = state.claimFourTMemberSelected;
    genericRetentionHead.visible = !state.claimFourTMemberSelected;
    rampLeft.visible = state.claimFourTMemberSelected;
    rampRight.visible = state.claimFourTMemberSelected;
    const captured = state.claimFourRampCaptured;
    tMat.emissive.setHex(captured ? 0x5f0f2c : 0x000000);
    tMat.emissiveIntensity = captured ? 0.35 : 0;
    slideMat.emissive.setHex(state.lockingSlideEngaged ? 0x075985 : 0x000000);
    slideMat.emissiveIntensity = state.lockingSlideEngaged ? 0.22 : 0;
  };

  const setInspectionMode = (mode: "adapter" | "lock" | "rack") => {
    const lockCutaway = mode === "lock";
    toolBaseFaceMat.transparent = lockCutaway;
    toolBaseFaceMat.opacity = lockCutaway ? 0.18 : 1;
    toolBaseFaceMat.depthWrite = !lockCutaway;
    toolBaseFaceMat.needsUpdate = true;
    basePlate.userData.isDiagrammaticLockCutaway = lockCutaway;
  };

  return {
    root,
    updateState,
    setInspectionMode,
    dispose: () => {
      for (const item of geometries) item.dispose();
      for (const item of materials) item.dispose();
    },
  };
}
