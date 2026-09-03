import * as THREE from "three";
import type { KamenSegwayControls, KamenSegwayTelemetry } from "@/physics/kamenSegwayKernel";

export interface KamenSegway3DObjects {
  rootGroup: THREE.Group;
  vehicleYawGroup: THREE.Group;
  chassisGroup: THREE.Group;
  leftWheelGroup: THREE.Group;
  rightWheelGroup: THREE.Group;
  mastGroup: THREE.Group;
  riderGroup: THREE.Group;
  groundGrid: THREE.GridHelper;
  update: (controls: KamenSegwayControls, tel: KamenSegwayTelemetry, timeSec: number) => void;
}

export function createKamenSegwayModel(): KamenSegway3DObjects {
  const rootGroup = new THREE.Group();
  rootGroup.name = "kamen-segway-root";

  // 1. Ground Grid
  const groundGrid = new THREE.GridHelper(6, 12, 0x0ea5e9, 0x1e293b);
  groundGrid.name = "segway-world-fixed museum floor";
  groundGrid.position.y = -0.015;
  for (const material of Array.isArray(groundGrid.material)
    ? groundGrid.material
    : [groundGrid.material]) {
    material.transparent = true;
    material.opacity = 0.2;
    material.depthWrite = false;
  }
  rootGroup.add(groundGrid);

  // Steering rotates the machine in the world; the museum floor is a fixed
  // reference frame and must never yaw with the rider.
  const vehicleYawGroup = new THREE.Group();
  vehicleYawGroup.name = "segway-vehicle-yaw-frame";
  rootGroup.add(vehicleYawGroup);

  // 2. Transporter Machine Root (Pivot on wheel axle at y = 0.24)
  const chassisGroup = new THREE.Group();
  chassisGroup.position.y = 0.24;
  vehicleYawGroup.add(chassisGroup);

  // Chassis base platform
  const platformGeo = new THREE.BoxGeometry(0.55, 0.08, 0.42);
  const platformMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.4,
    metalness: 0.6,
  });
  const platformMesh = new THREE.Mesh(platformGeo, platformMat);
  platformMesh.position.y = 0.04;
  chassisGroup.add(platformMesh);

  // Rubber foot pads (left & right)
  const padGeo = new THREE.BoxGeometry(0.18, 0.015, 0.32);
  const padMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.9,
    metalness: 0.1,
  });
  const leftPad = new THREE.Mesh(padGeo, padMat);
  leftPad.position.set(-0.16, 0.085, 0);
  chassisGroup.add(leftPad);

  const rightPad = new THREE.Mesh(padGeo, padMat);
  rightPad.position.set(0.16, 0.085, 0);
  chassisGroup.add(rightPad);

  // Gearbox & battery cluster housing
  const housingGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.48, 24);
  housingGeo.rotateZ(Math.PI / 2);
  const housingMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.3,
    metalness: 0.8,
  });
  const housingMesh = new THREE.Mesh(housingGeo, housingMat);
  housingMesh.position.y = 0;
  chassisGroup.add(housingMesh);

  // 3. Coaxial Wheels (Radius R = 0.24 m, Width = 0.08 m)
  const tireGeo = new THREE.TorusGeometry(0.2, 0.045, 16, 32);
  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x090d16,
    roughness: 0.9,
    metalness: 0.1,
  });

  const rimGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.06, 24);
  rimGeo.rotateZ(Math.PI / 2);
  const rimMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.2,
    metalness: 0.8,
  });

  // Left Wheel Group
  const leftWheelGroup = new THREE.Group();
  leftWheelGroup.position.set(-0.29, 0, 0);
  const leftTire = new THREE.Mesh(tireGeo, tireMat);
  leftTire.rotation.y = Math.PI / 2;
  const leftRim = new THREE.Mesh(rimGeo, rimMat);
  leftWheelGroup.add(leftTire);
  leftWheelGroup.add(leftRim);
  chassisGroup.add(leftWheelGroup);

  // Right Wheel Group
  const rightWheelGroup = new THREE.Group();
  rightWheelGroup.position.set(0.29, 0, 0);
  const rightTire = new THREE.Mesh(tireGeo, tireMat);
  rightTire.rotation.y = Math.PI / 2;
  const rightRim = new THREE.Mesh(rimGeo, rimMat);
  rightWheelGroup.add(rightTire);
  rightWheelGroup.add(rightRim);
  chassisGroup.add(rightWheelGroup);

  // 4. Handlebar Mast Column
  const mastGroup = new THREE.Group();
  mastGroup.position.set(0, 0.08, 0.1);
  chassisGroup.add(mastGroup);

  // Aluminum upright tube (height ~ 0.95 m)
  const mastTubeGeo = new THREE.CylinderGeometry(0.022, 0.025, 0.95, 16);
  const mastTubeMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.2,
    metalness: 0.9,
  });
  const mastTube = new THREE.Mesh(mastTubeGeo, mastTubeMat);
  mastTube.position.y = 0.475;
  mastGroup.add(mastTube);

  // Horizontal T-Bar Handlebar
  const tBarGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.52, 16);
  tBarGeo.rotateZ(Math.PI / 2);
  const tBarMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.3,
    metalness: 0.7,
  });
  const tBar = new THREE.Mesh(tBarGeo, tBarMat);
  tBar.position.y = 0.95;
  mastGroup.add(tBar);

  // Ergonomic hand grips
  const gripGeo = new THREE.CylinderGeometry(0.024, 0.024, 0.12, 16);
  gripGeo.rotateZ(Math.PI / 2);
  const gripMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.8,
  });
  const leftGrip = new THREE.Mesh(gripGeo, gripMat);
  leftGrip.name = "segway-left-grip";
  leftGrip.position.set(-0.2, 0.95, 0);
  mastGroup.add(leftGrip);

  const rightGrip = new THREE.Mesh(gripGeo, gripMat);
  rightGrip.name = "segway-right-grip";
  rightGrip.position.set(0.2, 0.95, 0);
  mastGroup.add(rightGrip);

  // 5. Stylized Human Rider
  const riderGroup = new THREE.Group();
  chassisGroup.add(riderGroup);

  const riderMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.4,
    metalness: 0.3,
  });

  // Rider Legs
  const legGeo = new THREE.CylinderGeometry(0.045, 0.04, 0.52, 12);
  const leftLeg = new THREE.Mesh(legGeo, riderMat);
  leftLeg.position.set(-0.14, 0.34, 0);
  riderGroup.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, riderMat);
  rightLeg.position.set(0.14, 0.34, 0);
  riderGroup.add(rightLeg);

  // Rider Torso
  const torsoGeo = new THREE.CylinderGeometry(0.14, 0.12, 0.46, 12);
  const torso = new THREE.Mesh(torsoGeo, riderMat);
  torso.position.set(0, 0.8, 0);
  riderGroup.add(torso);

  // Rider Head
  const headGeo = new THREE.SphereGeometry(0.1, 16, 16);
  const head = new THREE.Mesh(headGeo, riderMat);
  head.position.set(0, 1.12, 0);
  riderGroup.add(head);

  // Rider arms are endpoint-solved struts from the torso shoulders to the
  // handlebar grips. This keeps the humanoid visibly tethered to the machine
  // instead of placing decorative cylinders near the controls.
  const addConnectedArm = (
    name: string,
    shoulder: THREE.Vector3,
    gripInMastCoordinates: THREE.Vector3,
  ) => {
    const gripInChassisCoordinates = gripInMastCoordinates.clone().add(mastGroup.position);
    const direction = gripInChassisCoordinates.clone().sub(shoulder);
    const armGeo = new THREE.CylinderGeometry(0.03, 0.035, direction.length(), 12);
    const arm = new THREE.Mesh(armGeo, riderMat);
    arm.name = name;
    arm.position.copy(shoulder).add(gripInChassisCoordinates).multiplyScalar(0.5);
    arm.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    riderGroup.add(arm);
  };

  addConnectedArm("segway-left-arm", new THREE.Vector3(-0.1, 0.92, 0), leftGrip.position);
  addConnectedArm("segway-right-arm", new THREE.Vector3(0.1, 0.92, 0), rightGrip.position);

  // Update Animation Method
  const update = (controls: KamenSegwayControls, tel: KamenSegwayTelemetry, timeSec: number) => {
    // 1. Pitch Rotation of Chassis about wheel axis
    const pitchRad = (controls.riderPitchDeg * Math.PI) / 180;
    chassisGroup.rotation.x = -pitchRad; // Tilt forward in Z direction

    // 2. Yaw Steering Differential
    const yawRate = controls.steeringInput * 1.5;
    vehicleYawGroup.rotation.y = timeSec * yawRate * 0.5;

    // 3. Wheel Spin Rotation based on velocity: omega = v / R
    const wheelOmega = tel.velocityMS / 0.24;
    leftWheelGroup.rotation.x = timeSec * wheelOmega * (1 - controls.steeringInput * 0.3);
    rightWheelGroup.rotation.x = timeSec * wheelOmega * (1 + controls.steeringInput * 0.3);

    // 4. Tactile Ripple Alarm Shudder Vibration
    if (tel.tactileAlarmActive) {
      const shudder = Math.sin(timeSec * 2 * Math.PI * 18.0) * 0.006;
      chassisGroup.position.y = 0.24 + shudder;
      chassisGroup.position.z = shudder * 0.5;
    } else {
      chassisGroup.position.y = 0.24;
      chassisGroup.position.z = 0;
    }

    // 5. Speed Pushback Tilt on Handlebar Mast
    if (tel.speedPushbackActive) {
      mastGroup.rotation.x = (tel.pitchPushbackDeg * Math.PI) / 180;
    } else {
      mastGroup.rotation.x = 0;
    }
  };

  return {
    rootGroup,
    vehicleYawGroup,
    chassisGroup,
    leftWheelGroup,
    rightWheelGroup,
    mastGroup,
    riderGroup,
    groundGrid,
    update,
  };
}
