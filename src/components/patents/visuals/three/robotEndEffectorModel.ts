import * as THREE from "three";
import type { RobotEndEffectorState } from "@/physics/robotEndEffectorKernel";

export interface RobotEndEffectorModel {
  root: THREE.Group;
  updateState: (state: RobotEndEffectorState) => void;
  dispose: () => void;
}

/**
 * Procedural museum model derived from the named frame, double screws, hands,
 * fingers, spur gears, and encoder pegs in US 4,765,668. The source does not
 * print complete frame/finger dimensions, so fixed rail and finger lengths are
 * deliberately display proportions; only live screw displacement comes from
 * the disclosed 5 mm lead and 6-inch typical opening.
 */
export function buildRobotEndEffectorModel(): RobotEndEffectorModel {
  const root = new THREE.Group();
  root.name = "US 4,765,668 source-bounded double-handed end effector";
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

  const frameMat = material(
    new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.84, roughness: 0.24 }),
  );
  const screwMat = material(
    new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.92, roughness: 0.12 }),
  );
  const handMat = material(
    new THREE.MeshStandardMaterial({ color: 0x0891b2, metalness: 0.68, roughness: 0.25 }),
  );
  const fingerMat = material(
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.55, roughness: 0.28 }),
  );
  const gearMat = material(
    new THREE.MeshStandardMaterial({ color: 0xa16207, metalness: 0.88, roughness: 0.18 }),
  );
  const sensorMat = material(
    new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: new THREE.Color(0x0e7490),
      emissiveIntensity: 0.4,
      metalness: 0.3,
      roughness: 0.3,
    }),
  );

  const frame = new THREE.Group();
  frame.name = "Frame 12 with cylinders 26 and 30 and web 28";
  root.add(frame);
  const web = new THREE.Mesh(geometry(new THREE.BoxGeometry(3.2, 0.16, 0.74)), frameMat);
  web.name = "Central web 28";
  frame.add(web);
  for (const z of [-0.43, 0.43]) {
    const rail = new THREE.Mesh(
      geometry(new THREE.CylinderGeometry(0.14, 0.14, 3.2, 28)),
      frameMat,
    );
    rail.name = z > 0 ? "Upper cylinder 26" : "Lower cylinder 30";
    rail.rotation.z = Math.PI / 2;
    rail.position.z = z;
    frame.add(rail);
  }

  const screwGroup = new THREE.Group();
  screwGroup.name = "Opposed-thread ball screws 40";
  root.add(screwGroup);
  const handGroups: Array<{ group: THREE.Group; side: -1 | 1 }> = [];
  const fingerGroups: THREE.Group[] = [];
  const screwMeshes: THREE.Mesh[] = [];
  for (const z of [-0.43, 0.43]) {
    const screw = new THREE.Mesh(
      geometry(new THREE.CylinderGeometry(0.075, 0.075, 2.86, 24)),
      screwMat,
    );
    screw.name = z > 0 ? "Upper ball screw 40" : "Lower ball screw 40";
    screw.rotation.z = Math.PI / 2;
    screw.position.z = z;
    screwGroup.add(screw);
    screwMeshes.push(screw);

    for (const side of [-1, 1] as const) {
      const hand = new THREE.Group();
      hand.name = `${z > 0 ? "Upper" : "Lower"} hand ${side < 0 ? "left" : "right"}`;
      const carriage = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.38, 0.36, 0.25)), handMat);
      carriage.name = "Sliding hand body";
      hand.add(carriage);
      const finger = new THREE.Group();
      finger.name = "Removable dovetail finger";
      const tenon = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.18, 0.13, 0.3)), fingerMat);
      tenon.position.y = 0.25;
      const jaw = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.16, 0.78, 0.16)), fingerMat);
      jaw.position.y = 0.66;
      finger.add(tenon, jaw);
      hand.add(finger);
      root.add(hand);
      handGroups.push({ group: hand, side });
      fingerGroups.push(finger);
    }
  }

  const gearEnd = new THREE.Group();
  gearEnd.name = "Motor spur gears 66 and screw spur gears 68";
  gearEnd.position.x = 1.72;
  root.add(gearEnd);
  const motorGear = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.23, 0.23, 0.12, 24)),
    gearMat,
  );
  motorGear.name = "Motor spur gear 66";
  motorGear.rotation.z = Math.PI / 2;
  motorGear.position.set(0, 0.12, 0.43);
  const screwGear = new THREE.Mesh(
    geometry(new THREE.CylinderGeometry(0.3, 0.3, 0.12, 24)),
    gearMat,
  );
  screwGear.name = "Ball-screw spur gear 68";
  screwGear.rotation.z = Math.PI / 2;
  screwGear.position.set(0, -0.08, 0.43);
  gearEnd.add(motorGear, screwGear);

  const encoder = new THREE.Group();
  encoder.name = "Eight-peg encoder 72 and inductive switch 74";
  encoder.position.copy(motorGear.position);
  for (let index = 0; index < 8; index += 1) {
    const peg = new THREE.Mesh(
      geometry(new THREE.CylinderGeometry(0.026, 0.026, 0.16, 12)),
      sensorMat,
    );
    peg.name = `Encoder peg 72 · ${index + 1}`;
    peg.rotation.z = Math.PI / 2;
    const angle = (index * Math.PI * 2) / 8;
    peg.position.set(0.1, Math.cos(angle) * 0.16, Math.sin(angle) * 0.16);
    encoder.add(peg);
  }
  const switchBody = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.18, 0.1, 0.18)), sensorMat);
  switchBody.name = "Inductive proximity switch 74";
  switchBody.position.set(0.08, 0.34, 0);
  encoder.add(switchBody);
  gearEnd.add(encoder);

  const displayMetresToWorld = 7;
  const updateState = (state: RobotEndEffectorState) => {
    const offset = state.perHandOffsetM * displayMetresToWorld;
    for (const hand of handGroups) hand.group.position.x = hand.side * offset;
    for (const screw of screwMeshes) screw.rotation.x = state.screwAngleRad;
    motorGear.rotation.x = state.motorRevolutions * 2 * Math.PI;
    screwGear.rotation.x = -state.screwAngleRad;
    encoder.rotation.x = state.motorRevolutions * 2 * Math.PI;
    for (const finger of fingerGroups) {
      finger.position.y = -state.fingerRetainedFraction * 0.02;
      finger.visible = state.fingerRetainedFraction > 0.03;
    }
    root.rotation.x = state.frameRotationRad;
  };

  return {
    root,
    updateState,
    dispose: () => {
      for (const item of geometries) item.dispose();
      for (const item of materials) item.dispose();
    },
  };
}
