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
 * encoder, and the program drum. All dimensions are display conventions.
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

  const rails = new THREE.Group();
  rails.name = "Tracks 14";
  for (const z of [-0.8, 0.8]) {
    const rail = new THREE.Mesh(geometry(new THREE.BoxGeometry(7.4, 0.1, 0.12)), steel);
    rail.position.set(0, -0.35, z);
    rails.add(rail);
  }
  root.add(rails);

  const carriage = new THREE.Group();
  carriage.name = "Transfer apparatus 10";
  const base = new THREE.Mesh(geometry(new THREE.BoxGeometry(1.3, 1.25, 1.25)), ink);
  base.position.y = 0.3;
  carriage.add(base);
  const elevator = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.72, 1.1, 0.72)), steel);
  elevator.position.y = 1.42;
  carriage.add(elevator);
  const actuator = new THREE.Mesh(geometry(new THREE.CylinderGeometry(0.15, 0.15, 2.4, 20)), steel);
  actuator.rotation.z = Math.PI / 2;
  actuator.position.set(1.15, 1.96, 0);
  carriage.add(actuator);
  const arm = new THREE.Mesh(geometry(new THREE.BoxGeometry(2.3, 0.17, 0.17)), encoder);
  arm.position.set(2.1, 1.96, 0);
  carriage.add(arm);
  const head = new THREE.Group();
  head.name = "Transfer head 10a and article gripper 44";
  const headBody = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.34, 0.56, 0.46)), encoder);
  head.add(headBody);
  const stem = new THREE.Mesh(geometry(new THREE.CylinderGeometry(0.06, 0.06, 0.65, 14)), steel);
  stem.position.y = -0.55;
  head.add(stem);
  const leftFinger = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.11, 0.34, 0.13)), grip);
  leftFinger.position.set(-0.18, -0.99, 0);
  const rightFinger = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.11, 0.34, 0.13)), grip);
  rightFinger.position.set(0.18, -0.99, 0);
  head.add(leftFinger, rightFinger);
  carriage.add(head);
  const movingEncoder = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.28, 0.28, 0.62)), program);
  movingEncoder.name = "Sensing head 46";
  movingEncoder.position.set(-0.42, 2.18, 0);
  carriage.add(movingEncoder);
  root.add(carriage);

  const encoderTrack = new THREE.Mesh(geometry(new THREE.BoxGeometry(6, 0.1, 0.19)), program);
  encoderTrack.name = "Position encoder 50";
  encoderTrack.position.set(0.3, 2.18, -0.36);
  root.add(encoderTrack);

  const drumGroup = new THREE.Group();
  drumGroup.name = "Magnetic program drum 40";
  const drum = new THREE.Mesh(geometry(new THREE.CylinderGeometry(0.43, 0.43, 0.78, 28)), program);
  drum.rotation.z = Math.PI / 2;
  drumGroup.add(drum);
  const shaft = new THREE.Mesh(geometry(new THREE.CylinderGeometry(0.08, 0.08, 1.04, 16)), steel);
  shaft.rotation.z = Math.PI / 2;
  drumGroup.add(shaft);
  drumGroup.position.set(-2.1, 0.55, -1.05);
  root.add(drumGroup);

  const cableGeometry = geometry(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-1.75, 0.62, -0.92),
      new THREE.Vector3(-0.42, 1.02, -0.34),
    ]),
  );
  const cableMaterial = material(new THREE.LineBasicMaterial({ color: 0xa78bfa }));
  const programCable = new THREE.Line(cableGeometry, cableMaterial);
  programCable.name = "program-controller signal cable to moving transfer apparatus";
  root.add(programCable);

  return {
    root,
    update: (state) => {
      const maximum = 2 ** state.bitWidth - 1;
      const normalizedTravel = (state.sensedSlot / maximum - 0.5) * 3.2;
      carriage.position.x = normalizedTravel;
      // The head stays physically attached to the end of arm 34. The arm's
      // right-hand face is x=3.25 in this normalized drawing-space model.
      head.position.x = 3.25;
      const gap = state.gripperState === "seizing" ? 0.08 : 0.3;
      leftFinger.position.x = -gap / 2;
      rightFinger.position.x = gap / 2;
      movingEncoder.position.x = -0.42;
      drumGroup.rotation.x = (state.recordedSlot / Math.max(1, maximum)) * Math.PI * 2;
      const cablePositions = cableGeometry.getAttribute("position") as THREE.BufferAttribute;
      cablePositions.setXYZ(0, -1.75, 0.62, -0.92);
      cablePositions.setXYZ(1, carriage.position.x - 0.42, 1.02, -0.34);
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
