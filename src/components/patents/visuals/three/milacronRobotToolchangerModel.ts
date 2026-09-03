import * as THREE from "three";
import type { MilacronRobotToolchangerState } from "@/physics/milacronRobotToolchangerKernel";

export const MILACRON_EXHIBIT_FLOOR_Y = -1.28;
export const MILACRON_EXHIBIT_SLIDE_TRAVEL = 0.58;

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
  const toolMat = material(
    new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.76, roughness: 0.25 }),
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
  robotFlange.position.z = -0.88;

  const wrist = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.48, 0.48, 0.85, 40)),
    housingMat,
  );
  wrist.name = "Robot wrist 15 normalized continuation";
  wrist.rotation.x = Math.PI / 2;
  wrist.position.z = -1.43;
  const wristElbow = new THREE.Mesh(geometry(new THREE.SphereGeometry(0.5, 32, 20)), housingMat);
  wristElbow.name = "Robot wrist support elbow";
  wristElbow.position.z = -1.85;
  const robotSupport = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.38, 0.44, 1.28, 36)),
    housingMat,
  );
  robotSupport.name = "Normalized robot support column to exhibit floor";
  robotSupport.position.set(0, -0.64, -1.85);
  root.add(robotFlange, wrist, wristElbow, robotSupport);

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
  actuator.name = "Linear actuator 60 mounted to rear plate 27";
  const cylinder = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.18, 0.18, 0.72, 28)),
    utilityMat,
  );
  cylinder.name = "Actuator cylinder 47";
  cylinder.rotation.z = Math.PI / 2;
  cylinder.position.set(-1.36, 0, -0.35);
  const cylinderMount = new THREE.Mesh(
    geometry(new THREE.BoxGeometry(0.2, 0.46, 0.48)),
    housingMat,
  );
  cylinderMount.name = "Cylinder 47 mounting pad on rear plate 27";
  cylinderMount.position.set(-1.02, 0, -0.52);
  const rod = new THREE.Mesh(geometry(new THREE.CylinderGeometry(0.055, 0.055, 1, 20)), locatorMat);
  rod.name = "Piston rod 46 and adapter 66";
  rod.rotation.z = Math.PI / 2;
  rod.position.z = -0.35;
  actuator.add(cylinder, cylinderMount, rod);
  root.add(actuator);

  const slideGroup = new THREE.Group();
  slideGroup.name = "Locking slide 33 with aperture 34 and bifurcated ramp 41";
  const slideShape = new THREE.Shape();
  slideShape.moveTo(-0.78, -0.36);
  slideShape.lineTo(0.78, -0.36);
  slideShape.lineTo(0.78, 0.36);
  slideShape.lineTo(-0.78, 0.36);
  slideShape.closePath();
  // Aperture 34 admits the enlarged head in the open position. Its leftward
  // narrow extension is Claim 4's clearance slot 40: after the slide shifts,
  // the slot remains around stem 37 instead of cutting through it.
  const aperturePath = new THREE.Path();
  aperturePath.moveTo(-0.72, 0.12);
  aperturePath.lineTo(-0.44, 0.12);
  aperturePath.lineTo(-0.44, 0.27);
  aperturePath.lineTo(0.46, 0.27);
  aperturePath.lineTo(0.46, -0.27);
  aperturePath.lineTo(-0.44, -0.27);
  aperturePath.lineTo(-0.44, -0.12);
  aperturePath.lineTo(-0.72, -0.12);
  aperturePath.closePath();
  slideShape.holes.push(aperturePath);
  const slideGeometry = geometry(
    new THREE.ExtrudeGeometry(slideShape, {
      depth: 0.14,
      bevelEnabled: false,
      curveSegments: 1,
    }),
  );
  slideGeometry.translate(0, 0, -0.25);
  const slideBody = new THREE.Mesh(slideGeometry, slideMat);
  slideBody.name = "Locking slide 33 physical body";
  const aperture = new THREE.Object3D();
  aperture.name = "Slide aperture 34 clear opening";
  aperture.userData.normalizedOpening = { width: 0.9, height: 0.54 };
  const clearanceSlot = new THREE.Object3D();
  clearanceSlot.name = "Claim 4 stem clearance slot 40";
  clearanceSlot.userData.normalizedOpening = { width: 0.28, height: 0.24 };
  const rampGeometry = geometry(new THREE.BoxGeometry(0.46, 0.13, 0.11));
  const rampTop = new THREE.Mesh(rampGeometry, locatorMat);
  rampTop.name = "Bifurcated slide ramp surface 41 upper fork";
  rampTop.rotation.y = -0.18;
  rampTop.position.set(-MILACRON_EXHIBIT_SLIDE_TRAVEL, 0.2, -0.31);
  const rampBottom = rampTop.clone();
  rampBottom.name = "Bifurcated slide ramp surface 41 lower fork";
  rampBottom.position.y = -0.2;
  const yoke = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.16, 0.5, 0.22)), housingMat);
  yoke.name = "Yoke block 45 rigidly affixed to slide 33";
  yoke.position.set(-0.86, 0, -0.35);
  slideGroup.add(slideBody, aperture, clearanceSlot, rampTop, rampBottom, yoke);
  root.add(slideGroup);

  for (const y of [-0.43, 0.43]) {
    const guide = new THREE.Mesh(geometry(new THREE.BoxGeometry(1.72, 0.1, 0.22)), housingMat);
    guide.name = `Front-plate slideway ${y < 0 ? "32" : "31"}`;
    guide.position.set(0, y, -0.18);
    root.add(guide);
  }

  const locatorGroup = new THREE.Group();
  locatorGroup.name = "Locating pins 43 and 44";
  const roundPin = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.08, 0.08, 0.36, 20)),
    locatorMat,
  );
  roundPin.name = "Cylindrical locating pin 43";
  roundPin.rotation.x = Math.PI / 2;
  roundPin.position.set(-0.46, -0.42, 0.42);
  const diamondPinGeometry = geometry(new THREE.CylinderGeometry(0.09, 0.09, 0.36, 4));
  diamondPinGeometry.rotateY(Math.PI / 4);
  const diamondPin = new THREE.Mesh(diamondPinGeometry, locatorMat);
  diamondPin.name = "Diamond-section locating pin 44";
  diamondPin.rotation.x = Math.PI / 2;
  diamondPin.position.set(0.46, -0.42, 0.42);
  locatorGroup.add(roundPin, diamondPin);
  root.add(locatorGroup);

  const toolBase = new THREE.Group();
  toolBase.name = "Common tool base 18 with T-member 35";
  const toolBaseShape = new THREE.Shape();
  toolBaseShape.absarc(0, 0, 0.88, 0, Math.PI * 2, false);
  for (const x of [-0.46, 0.46]) {
    const bore = new THREE.Path();
    bore.absarc(x, -0.42, 0.105, 0, Math.PI * 2, true);
    toolBaseShape.holes.push(bore);
  }
  const basePlateGeometry = geometry(
    new THREE.ExtrudeGeometry(toolBaseShape, {
      depth: toolBaseThickness,
      bevelEnabled: false,
      curveSegments: 44,
    }),
  );
  basePlateGeometry.translate(0, 0, -toolBaseThickness / 2);
  const basePlate = new THREE.Mesh(basePlateGeometry, toolBaseFaceMat);
  basePlate.name = "Common tool base 18 face plate";
  const bushingShape = new THREE.Shape();
  bushingShape.absarc(0, 0, 0.15, 0, Math.PI * 2, false);
  const bushingBore = new THREE.Path();
  bushingBore.absarc(0, 0, 0.105, 0, Math.PI * 2, true);
  bushingShape.holes.push(bushingBore);
  const bushingGeometry = geometry(
    new THREE.ExtrudeGeometry(bushingShape, {
      depth: 0.3,
      bevelEnabled: false,
      curveSegments: 28,
    }),
  );
  bushingGeometry.translate(0, 0, -0.15);
  const bushingA = new THREE.Mesh(bushingGeometry, housingMat);
  bushingA.name = "Hardened shouldered bushing 42 for cylindrical pin 43";
  bushingA.position.set(-0.46, -0.42, 0);
  const bushingB = bushingA.clone();
  bushingB.name = "Hardened shouldered bushing 42 for diamond pin 44";
  bushingB.position.x = 0.46;
  const stem = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.2, 0.2, 0.52)), tMat);
  stem.name = "Retention member 32 and T-member 35 stem";
  stem.position.z = -0.35;
  const crossbar = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.82, 0.26, 0.18)), tMat);
  crossbar.name = "T-member 35 crossbar 38 and display ramp 39";
  crossbar.position.z = -0.65;
  const genericRetentionHead = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.24, 0.24, 0.18, 28)),
    tMat,
  );
  genericRetentionHead.name = "Generic Claim 3 retention-member head";
  genericRetentionHead.rotation.x = Math.PI / 2;
  genericRetentionHead.position.z = -0.65;
  const toolAssembly = new THREE.Group();
  toolAssembly.name = "Representative tool 19 rigidly attached to common base 18";
  const toolCollar = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.46, 0.46, 0.3, 36)),
    toolMat,
  );
  toolCollar.name = "Tool 19 mounting collar";
  toolCollar.rotation.x = Math.PI / 2;
  toolCollar.position.z = 0.25;
  const toolBody = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.34, 0.42, 0.68, 36)),
    toolMat,
  );
  toolBody.name = "Representative tool 19 body";
  toolBody.rotation.x = Math.PI / 2;
  toolBody.position.z = 0.74;
  const toolNose = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.18, 0.32, 0.24, 32)),
    locatorMat,
  );
  toolNose.name = "Representative tool 19 working end";
  toolNose.rotation.x = Math.PI / 2;
  toolNose.position.z = 1.2;
  toolAssembly.add(toolCollar, toolBody, toolNose);
  toolBase.add(basePlate, bushingA, bushingB, stem, crossbar, genericRetentionHead, toolAssembly);
  root.add(toolBase);

  const rack = new THREE.Group();
  rack.name = "Representative tool rack 20";
  rack.position.set(-2.2, -0.4, 0.2);
  const rackRail = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.22, 1.7, 0.34)), housingMat);
  rackRail.name = "Tool rack 20 vertical rail";
  rackRail.position.y = 0.22;
  const rackFoot = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.82, 0.12, 0.78)), housingMat);
  rackFoot.name = "Tool rack 20 floor foot";
  rackFoot.position.y = -0.82;
  const rackLeg = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.22, 0.26, 0.34)), housingMat);
  rackLeg.name = "Tool rack 20 continuous lower support";
  rackLeg.position.y = -0.69;
  rack.add(rackRail, rackFoot, rackLeg);
  const parkedBaseGeometry = geometry(new THREE.CylinderGeometry(0.29, 0.29, 0.15, 20));
  const parkedToolGeometry = geometry(new THREE.CylinderGeometry(0.13, 0.2, 0.62, 24));
  for (const [index, y] of [-0.52, 0.05, 0.62].entries()) {
    const parkedTool = new THREE.Group();
    parkedTool.name = `Rack tool 19 assembly ${index + 1}`;
    const parkedBase = new THREE.Mesh(parkedBaseGeometry, baseMat);
    parkedBase.name = `Rack common base 18 ${index + 1}`;
    parkedBase.rotation.x = Math.PI / 2;
    const parkedBody = new THREE.Mesh(parkedToolGeometry, toolMat);
    parkedBody.name = `Rack tool 19 body ${index + 1}`;
    parkedBody.rotation.x = Math.PI / 2;
    parkedBody.position.z = 0.385;
    parkedTool.position.set(0.18, y, 0);
    parkedTool.add(parkedBase, parkedBody);
    rack.add(parkedTool);
  }
  root.add(rack);

  const updateState = (state: MilacronRobotToolchangerState) => {
    // Normalized display positions; no source length, speed, or trajectory is asserted.
    toolBase.visible = state.toolBasePresent;
    toolBase.position.z =
      toolBaseApproachZ - state.registrationFraction * (toolBaseApproachZ - toolBaseSeatedZ);
    const slideX = state.lockingSlideFraction * MILACRON_EXHIBIT_SLIDE_TRAVEL;
    slideGroup.position.x = slideX;
    const yokeWorldX = slideX - 0.86;
    const cylinderRodExitX = -1;
    const rodLength = yokeWorldX - cylinderRodExitX;
    rod.scale.y = Math.max(0.001, rodLength);
    rod.position.x = (cylinderRodExitX + yokeWorldX) / 2;
    crossbar.visible = state.claimFourTMemberSelected;
    genericRetentionHead.visible = !state.claimFourTMemberSelected;
    rampTop.visible = state.claimFourTMemberSelected;
    rampBottom.visible = state.claimFourTMemberSelected;
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
    toolAssembly.visible = !lockCutaway;
    toolAssembly.userData.isHiddenForLockInspection = lockCutaway;
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
