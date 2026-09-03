import * as THREE from "three";
import type { DevolProgramState } from "@/physics/devolProgrammedTransferKernel";

export interface DevolProgrammedTransferModel {
  root: THREE.Group;
  update: (state: DevolProgramState) => void;
  dispose: () => void;
}

/**
 * Procedural museum geometry derived from Figs. 1, 2, and 11: a wheeled
 * transfer unit, horizontal cylinder/arm, vertical head, gripper, moving
 * encoder, and the program drum. All dimensions are normalized display
 * conventions; the grant does not supply a reusable machine geometry.
 */
export function buildDevolProgrammedTransferModel(): DevolProgrammedTransferModel {
  const root = new THREE.Group();
  root.name = "US 2,988,237 source-bounded programmed article transfer exhibit";
  const materials: THREE.Material[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  const material = <T extends THREE.Material>(item: T): T => {
    materials.push(item);
    return item;
  };
  const geometry = <T extends THREE.BufferGeometry>(item: T): T => {
    geometries.push(item);
    return item;
  };
  const ink = material(
    new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.7, roughness: 0.3 }),
  );
  const steel = material(
    new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.82, roughness: 0.2 }),
  );
  const program = material(
    new THREE.MeshStandardMaterial({ color: 0x4f46e5, metalness: 0.55, roughness: 0.27 }),
  );
  const encoder = material(
    new THREE.MeshStandardMaterial({ color: 0x0891b2, metalness: 0.46, roughness: 0.28 }),
  );
  const grip = material(
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.64, roughness: 0.2 }),
  );
  const rubber = material(
    new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.2, roughness: 0.76 }),
  );

  const rails = new THREE.Group();
  rails.name = "Tracks 14";
  for (const z of [-0.8, 0.8]) {
    const rail = new THREE.Mesh(geometry(new THREE.BoxGeometry(7.4, 0.1, 0.12)), steel);
    rail.name = `Track 14 rail z=${z}`;
    rail.position.set(0, -0.37, z);
    rails.add(rail);
  }
  root.add(rails);

  const carriage = new THREE.Group();
  carriage.name = "Transfer apparatus 10";
  const base = new THREE.Mesh(geometry(new THREE.BoxGeometry(1.5, 1.35, 1.45)), ink);
  base.name = "Control unit 26 and elevator housing 38";
  base.position.y = 0.43;
  carriage.add(base);

  for (const x of [-0.48, 0.48]) {
    const axle = new THREE.Mesh(
      geometry(new THREE.CylinderGeometry(0.055, 0.055, 1.62, 14)),
      steel,
    );
    axle.name = `Wheel axle 12 x=${x}`;
    axle.rotation.x = Math.PI / 2;
    axle.position.set(x, -0.16, 0);
    carriage.add(axle);
    for (const z of [-0.8, 0.8]) {
      const wheel = new THREE.Mesh(
        geometry(new THREE.CylinderGeometry(0.16, 0.16, 0.14, 20)),
        rubber,
      );
      wheel.name = `Track wheel 12 x=${x} z=${z}`;
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(x, -0.16, z);
      carriage.add(wheel);
    }
  }

  const elevator = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.72, 0.82, 0.72)), steel);
  elevator.name = "Vertical elevator slide 38";
  elevator.position.y = 1.48;
  carriage.add(elevator);
  const actuator = new THREE.Mesh(geometry(new THREE.BoxGeometry(1.62, 0.42, 0.52)), steel);
  actuator.name = "Hydraulic actuator housing 36";
  actuator.position.set(0.68, 1.72, 0);
  carriage.add(actuator);
  const arm = new THREE.Mesh(geometry(new THREE.BoxGeometry(1, 0.18, 0.18)), encoder);
  arm.name = "Telescoping arm 34";
  arm.position.y = 1.72;
  carriage.add(arm);

  const head = new THREE.Group();
  head.name = "Transfer head 10a and article gripper 44";
  const headBody = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.46, 0.55, 0.5)), encoder);
  headBody.name = "Transfer head body 10a";
  head.add(headBody);
  const stem = new THREE.Mesh(geometry(new THREE.CylinderGeometry(0.06, 0.06, 0.58, 14)), steel);
  stem.name = "Jaw actuator stem 42";
  stem.position.y = -0.54;
  head.add(stem);
  const jawCarrier = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.13, 0.12, 0.62)), steel);
  jawCarrier.name = "Jaw 44 carrier crosshead";
  jawCarrier.position.y = -0.82;
  head.add(jawCarrier);
  const leftFinger = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.13, 0.34, 0.1)), grip);
  leftFinger.name = "Jaw 44 near finger";
  leftFinger.position.set(0, -0.96, -0.28);
  const rightFinger = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.13, 0.34, 0.1)), grip);
  rightFinger.name = "Jaw 44 far finger";
  rightFinger.position.set(0, -0.96, 0.28);
  head.add(leftFinger, rightFinger);
  carriage.add(head);

  const encoderTrack = new THREE.Mesh(geometry(new THREE.BoxGeometry(3.4, 0.1, 0.18)), program);
  encoderTrack.name = "Position encoder 50";
  encoderTrack.position.set(2.35, 2.35, -0.5);
  carriage.add(encoderTrack);
  const encoderBracket = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.12, 0.48, 0.18)), steel);
  encoderBracket.name = "Position encoder 50 support bracket";
  encoderBracket.position.set(0.72, 2.09, -0.5);
  carriage.add(encoderBracket);
  const encoderBracketReturn = new THREE.Mesh(
    geometry(new THREE.BoxGeometry(0.12, 0.12, 0.52)),
    steel,
  );
  encoderBracketReturn.name = "Position encoder 50 support return";
  encoderBracketReturn.position.set(0.72, 1.9, -0.25);
  carriage.add(encoderBracketReturn);

  const sensingAssembly = new THREE.Group();
  sensingAssembly.name = "Directly coupled sensing assembly 46/48";
  const movingEncoder = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.28, 0.28, 0.32)), program);
  movingEncoder.name = "Sensing head 46";
  movingEncoder.position.set(0, 2.35, -0.5);
  sensingAssembly.add(movingEncoder);
  const couplingDrop = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.08, 0.31, 0.08)), steel);
  couplingDrop.name = "Direct mechanical coupling arm 48 vertical member";
  couplingDrop.position.set(0, 2.095, -0.5);
  sensingAssembly.add(couplingDrop);
  const couplingReturn = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.08, 0.08, 0.54)), steel);
  couplingReturn.name = "Direct mechanical coupling arm 48 return member";
  couplingReturn.position.set(0, 1.98, -0.23);
  sensingAssembly.add(couplingReturn);
  carriage.add(sensingAssembly);

  const drumGroup = new THREE.Group();
  drumGroup.name = "Magnetic program drum 40 cutaway within control unit 26";
  const drum = new THREE.Mesh(geometry(new THREE.CylinderGeometry(0.32, 0.32, 0.38, 28)), program);
  drum.name = "Magnetic program drum 40 rotor";
  drum.rotation.x = Math.PI / 2;
  drumGroup.add(drum);
  const shaft = new THREE.Mesh(geometry(new THREE.CylinderGeometry(0.055, 0.055, 0.58, 16)), steel);
  shaft.name = "Program drum 40 mounted shaft";
  shaft.rotation.x = Math.PI / 2;
  drumGroup.add(shaft);
  drumGroup.position.set(-0.22, 0.48, 0.76);
  carriage.add(drumGroup);
  const drumMount = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.9, 0.84, 0.08)), steel);
  drumMount.name = "Program drum 40 bearing mount on control unit 26";
  drumMount.position.set(-0.22, 0.48, 0.72);
  carriage.add(drumMount);

  const controllerJunction = new THREE.Mesh(
    geometry(new THREE.BoxGeometry(0.18, 0.18, 0.12)),
    program,
  );
  controllerJunction.name = "Coincidence controller 100 cable junction";
  controllerJunction.position.set(0.45, 0.92, 0.76);
  carriage.add(controllerJunction);

  const cableGeometry = geometry(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0.45, 0.92, 0.82),
      new THREE.Vector3(0.62, 1.5, 0.82),
      new THREE.Vector3(1.2, 2.55, 0.2),
      new THREE.Vector3(1.8, 2.35, -0.34),
    ]),
  );
  const cableMaterial = material(new THREE.LineBasicMaterial({ color: 0xa78bfa }));
  const programCable = new THREE.Line(cableGeometry, cableMaterial);
  programCable.name = "Encoder-to-controller electrical signal path";
  programCable.userData.semantic = "electrical-signal-path-not-structural-member";
  carriage.add(programCable);

  root.add(carriage);

  return {
    root,
    update: (state) => {
      const maximum = 2 ** state.bitWidth - 1;
      const normalizedTravel = state.sensedSlot / maximum;
      const armAnchorX = 0.88;
      const armInterfaceX = 1.55 + normalizedTravel * 2;
      const armLength = armInterfaceX - armAnchorX;
      arm.scale.x = armLength;
      arm.position.x = armAnchorX + armLength / 2;
      head.position.set(armInterfaceX + 0.23, 1.72, 0);
      sensingAssembly.position.x = head.position.x;
      const jawCenterOffset = state.gripperState === "seizing" ? 0.15 : 0.31;
      leftFinger.position.z = -jawCenterOffset;
      rightFinger.position.z = jawCenterOffset;
      drumGroup.rotation.z = (state.recordedSlot / Math.max(1, maximum)) * Math.PI * 2;
      const cablePositions = cableGeometry.getAttribute("position") as THREE.BufferAttribute;
      cablePositions.setXYZ(0, 0.45, 0.92, 0.82);
      cablePositions.setXYZ(1, 0.62, 1.5, 0.82);
      cablePositions.setXYZ(2, Math.max(1.2, head.position.x - 0.45), 2.55, 0.2);
      cablePositions.setXYZ(3, head.position.x, 2.35, -0.34);
      cablePositions.needsUpdate = true;
    },
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
