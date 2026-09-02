import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { stepDevolProgrammedTransfer } from "@/physics/devolProgrammedTransferKernel";
import { buildDevolProgrammedTransferModel } from "./devolProgrammedTransferModel";

const THREE_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals", "three");

describe("US 2,988,237 Devol programmed-transfer visual boundary", () => {
  test("uses procedural geometry for the granted gantry, encoder, drum, and gripper", () => {
    const source = readFileSync(join(THREE_DIRECTORY, "devolProgrammedTransferModel.ts"), "utf8");
    const model = buildDevolProgrammedTransferModel();
    expect(source).not.toContain("useGLTF");
    expect(source).not.toContain(".gltf");
    expect(source).not.toContain(".glb");
    expect(source).not.toContain("Math.random");
    expect(model.root.getObjectByName("Transfer apparatus 10")).toBeDefined();
    expect(model.root.getObjectByName("Sensing head 46")).toBeDefined();
    expect(model.root.getObjectByName("Position encoder 50")).toBeDefined();
    expect(model.root.getObjectByName("Magnetic program drum 40")).toBeDefined();
    expect(
      model.root.getObjectByName("program-controller signal cable to moving transfer apparatus"),
    ).toBeInstanceOf(THREE.Line);
    model.update(stepDevolProgrammedTransfer({ sensedSlot: 63, bitWidth: 6, gripperClosed: 1 }));
    model.root.updateMatrixWorld(true);
    const apparatus = model.root.getObjectByName("Transfer apparatus 10");
    const head = model.root.getObjectByName("Transfer head 10a and article gripper 44");
    const sensor = model.root.getObjectByName("Sensing head 46");
    const track = model.root.getObjectByName("Position encoder 50");
    expect(head?.parent).toBe(apparatus);
    expect(head?.position.x).toBeCloseTo(3.25, 8);
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
    expect(studioSource).not.toContain("performance.now()");
    expect(simSource).toContain("usePatentPhysics");
    expect(simSource).toContain("Slots are codes");
  });
});
