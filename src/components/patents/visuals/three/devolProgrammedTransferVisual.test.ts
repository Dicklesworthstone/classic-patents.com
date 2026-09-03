import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { stepDevolProgrammedTransfer } from "@/physics/devolProgrammedTransferKernel";
import { buildDevolProgrammedTransferModel } from "./devolProgrammedTransferModel";

const THREE_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals", "three");

function worldBounds(object: THREE.Object3D): THREE.Box3 {
  object.updateWorldMatrix(true, true);
  return new THREE.Box3().setFromObject(object);
}

function requiredObject(root: THREE.Object3D, name: string): THREE.Object3D {
  const object = root.getObjectByName(name);
  expect(object).toBeDefined();
  if (!object) throw new Error(`Expected model object ${name}.`);
  return object;
}

describe("US 2,988,237 Devol programmed-transfer visual boundary", () => {
  test("uses procedural geometry for the disclosed carriage, encoder, drum, and gripper", () => {
    const source = readFileSync(join(THREE_DIRECTORY, "devolProgrammedTransferModel.ts"), "utf8");
    const model = buildDevolProgrammedTransferModel();
    expect(source).not.toContain("useGLTF");
    expect(source).not.toContain(".gltf");
    expect(source).not.toContain(".glb");
    expect(source).not.toContain("Math.random");
    expect(model.root.getObjectByName("Transfer apparatus 10")).toBeDefined();
    expect(model.root.getObjectByName("Sensing head 46")).toBeDefined();
    expect(model.root.getObjectByName("Position encoder 50")).toBeDefined();
    expect(
      model.root.getObjectByName("Magnetic program drum 40 cutaway within control unit 26"),
    ).toBeDefined();
    expect(
      model.root.getObjectByName("Encoder-to-controller electrical signal path"),
    ).toBeInstanceOf(THREE.Line);
    model.update(stepDevolProgrammedTransfer({ sensedSlot: 63, bitWidth: 6, gripperClosed: 1 }));
    model.root.updateMatrixWorld(true);
    const apparatus = model.root.getObjectByName("Transfer apparatus 10");
    const head = model.root.getObjectByName("Transfer head 10a and article gripper 44");
    const sensor = model.root.getObjectByName("Sensing head 46");
    const track = model.root.getObjectByName("Position encoder 50");
    expect(head?.parent).toBe(apparatus);
    expect(head?.position.x).toBeGreaterThan(3.5);
    expect(sensor?.getWorldPosition(new THREE.Vector3()).x ?? Number.NaN).toBeLessThanOrEqual(
      (track?.position.x ?? 0) + 3,
    );
    model.update(stepDevolProgrammedTransfer({ sensedSlot: 0, bitWidth: 6 }));
    model.root.updateMatrixWorld(true);
    expect(sensor?.getWorldPosition(new THREE.Vector3()).x ?? Number.NaN).toBeGreaterThanOrEqual(
      (track?.position.x ?? 0) - 3,
    );
    model.dispose();
  });

  test("rests the apparatus on four rail-contacting wheels rather than floating between tracks", () => {
    const model = buildDevolProgrammedTransferModel();
    model.update(stepDevolProgrammedTransfer({ sensedSlot: 24, bitWidth: 6 }));
    model.root.updateMatrixWorld(true);
    const base = requiredObject(model.root, "Control unit 26 and elevator housing 38");
    for (const x of [-0.48, 0.48]) {
      const axle = requiredObject(model.root, `Wheel axle 12 x=${x}`);
      expect(worldBounds(base).intersectsBox(worldBounds(axle))).toBe(true);
      for (const z of [-0.8, 0.8]) {
        const wheel = requiredObject(model.root, `Track wheel 12 x=${x} z=${z}`);
        const rail = requiredObject(model.root, `Track 14 rail z=${z}`);
        const wheelBounds = worldBounds(wheel);
        const railBounds = worldBounds(rail);
        expect(wheelBounds.min.y).toBeCloseTo(railBounds.max.y, 8);
        expect(wheelBounds.intersectsBox(worldBounds(axle))).toBe(true);
        expect(railBounds.min.y).toBeCloseTo(-0.42, 8);
      }
    }
    model.dispose();
  });

  test("moves sensing head 46 with telescoping head 10a while apparatus 10 stays on its rails", () => {
    const model = buildDevolProgrammedTransferModel();
    const apparatus = model.root.getObjectByName("Transfer apparatus 10");
    const head = model.root.getObjectByName("Transfer head 10a and article gripper 44");
    const sensor = model.root.getObjectByName("Sensing head 46");
    const arm = model.root.getObjectByName("Telescoping arm 34");
    const apparatusAtStart = apparatus?.position.clone();
    model.update(stepDevolProgrammedTransfer({ sensedSlot: 0, bitWidth: 6 }));
    model.root.updateMatrixWorld(true);
    const headAtStart = head?.getWorldPosition(new THREE.Vector3()).x ?? Number.NaN;
    const sensorAtStart = sensor?.getWorldPosition(new THREE.Vector3()).x ?? Number.NaN;
    const armScaleAtStart = arm?.scale.x ?? Number.NaN;
    model.update(stepDevolProgrammedTransfer({ sensedSlot: 63, bitWidth: 6 }));
    model.root.updateMatrixWorld(true);
    const headAtEnd = head?.getWorldPosition(new THREE.Vector3()).x ?? Number.NaN;
    const sensorAtEnd = sensor?.getWorldPosition(new THREE.Vector3()).x ?? Number.NaN;
    expect(apparatus?.position).toEqual(apparatusAtStart);
    expect(headAtEnd).toBeGreaterThan(headAtStart);
    expect(sensorAtEnd - sensorAtStart).toBeCloseTo(headAtEnd - headAtStart, 8);
    expect(sensorAtEnd).toBeCloseTo(headAtEnd, 8);
    expect(arm?.scale.x ?? Number.NaN).toBeGreaterThan(armScaleAtStart);
    model.dispose();
  });

  test("maintains a continuous actuator-to-arm-to-head-to-gripper load path", () => {
    const model = buildDevolProgrammedTransferModel();
    model.update(stepDevolProgrammedTransfer({ sensedSlot: 42, bitWidth: 6, gripperClosed: 1 }));
    model.root.updateMatrixWorld(true);
    const actuator = requiredObject(model.root, "Hydraulic actuator housing 36");
    const arm = requiredObject(model.root, "Telescoping arm 34");
    const headBody = requiredObject(model.root, "Transfer head body 10a");
    const stem = requiredObject(model.root, "Jaw actuator stem 42");
    const carrier = requiredObject(model.root, "Jaw 44 carrier crosshead");
    const nearJaw = requiredObject(model.root, "Jaw 44 near finger");
    const farJaw = requiredObject(model.root, "Jaw 44 far finger");
    expect(worldBounds(actuator).intersectsBox(worldBounds(arm))).toBe(true);
    expect(worldBounds(arm).max.x).toBeCloseTo(worldBounds(headBody).min.x, 8);
    expect(worldBounds(headBody).intersectsBox(worldBounds(stem))).toBe(true);
    expect(worldBounds(stem).intersectsBox(worldBounds(carrier))).toBe(true);
    expect(worldBounds(carrier).intersectsBox(worldBounds(nearJaw))).toBe(true);
    expect(worldBounds(carrier).intersectsBox(worldBounds(farJaw))).toBe(true);
    const seizedGap = Math.abs(farJaw.position.z - nearJaw.position.z);
    model.update(stepDevolProgrammedTransfer({ sensedSlot: 42, bitWidth: 6, gripperClosed: 0 }));
    expect(Math.abs(farJaw.position.z - nearJaw.position.z)).toBeGreaterThan(seizedGap);
    model.dispose();
  });

  test("supports encoder 50 and anchors both ends of the electrical signal path", () => {
    const model = buildDevolProgrammedTransferModel();
    model.update(stepDevolProgrammedTransfer({ sensedSlot: 31, bitWidth: 6 }));
    model.root.updateMatrixWorld(true);
    const actuator = requiredObject(model.root, "Hydraulic actuator housing 36");
    const encoder = requiredObject(model.root, "Position encoder 50");
    const bracket = requiredObject(model.root, "Position encoder 50 support bracket");
    const bracketReturn = requiredObject(model.root, "Position encoder 50 support return");
    const sensor = requiredObject(model.root, "Sensing head 46");
    const headBody = requiredObject(model.root, "Transfer head body 10a");
    const couplingDrop = requiredObject(
      model.root,
      "Direct mechanical coupling arm 48 vertical member",
    );
    const couplingReturn = requiredObject(
      model.root,
      "Direct mechanical coupling arm 48 return member",
    );
    const junction = requiredObject(model.root, "Coincidence controller 100 cable junction");
    const cable = requiredObject(
      model.root,
      "Encoder-to-controller electrical signal path",
    ) as THREE.Line;
    expect(worldBounds(actuator).intersectsBox(worldBounds(bracketReturn))).toBe(true);
    expect(worldBounds(bracketReturn).intersectsBox(worldBounds(bracket))).toBe(true);
    expect(worldBounds(bracket).intersectsBox(worldBounds(encoder))).toBe(true);
    expect(worldBounds(sensor).intersectsBox(worldBounds(encoder))).toBe(true);
    expect(worldBounds(sensor).intersectsBox(worldBounds(couplingDrop))).toBe(true);
    expect(worldBounds(couplingDrop).intersectsBox(worldBounds(couplingReturn))).toBe(true);
    expect(worldBounds(couplingReturn).intersectsBox(worldBounds(headBody))).toBe(true);
    expect(cable.userData.semantic).toBe("electrical-signal-path-not-structural-member");
    const positions = cable.geometry.getAttribute("position") as THREE.BufferAttribute;
    const first = new THREE.Vector3().fromBufferAttribute(positions, 0);
    const last = new THREE.Vector3().fromBufferAttribute(positions, positions.count - 1);
    expect(worldBounds(junction).containsPoint(first)).toBe(true);
    expect(worldBounds(sensor).containsPoint(last)).toBe(true);
    model.dispose();
  });

  test("mounts the program drum through its shaft and bearing plate to control unit 26", () => {
    const model = buildDevolProgrammedTransferModel();
    model.update(stepDevolProgrammedTransfer({ recordedSlot: 47, bitWidth: 6 }));
    model.root.updateMatrixWorld(true);
    const base = requiredObject(model.root, "Control unit 26 and elevator housing 38");
    const rotor = requiredObject(model.root, "Magnetic program drum 40 rotor");
    const shaft = requiredObject(model.root, "Program drum 40 mounted shaft");
    const mount = requiredObject(model.root, "Program drum 40 bearing mount on control unit 26");
    expect(worldBounds(base).intersectsBox(worldBounds(mount))).toBe(true);
    expect(worldBounds(mount).intersectsBox(worldBounds(shaft))).toBe(true);
    expect(worldBounds(shaft).intersectsBox(worldBounds(rotor))).toBe(true);
    model.dispose();
  });

  test("connects both interactive faces to the shared bus and refuses unsupported physics", () => {
    const studioSource = readFileSync(
      join(THREE_DIRECTORY, "DevolProgrammedTransfer3D.tsx"),
      "utf8",
    );
    const simSource = readFileSync(
      join(
        process.cwd(),
        "src",
        "components",
        "patents",
        "visuals",
        "DevolProgrammedTransferSim.tsx",
      ),
      "utf8",
    );
    expect(studioSource).toContain("usePatentPhysics");
    expect(studioSource).toContain("useFrankenSimPhysics");
    expect(studioSource).toContain("isRefused: true");
    expect(studioSource).toContain("normalized exhibit travel only");
    expect(studioSource).toContain('updateParam("gripperClosed"');
    expect(studioSource).toContain('updateParam("anticipationEnabled"');
    expect(studioSource).toContain('updateParam("recordingMode"');
    expect(studioSource).not.toContain("performance.now()");
    expect(simSource).toContain("usePatentPhysics");
    expect(simSource).toContain("Slots are codes");
  });
});
