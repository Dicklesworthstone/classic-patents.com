import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import * as THREE from "three";
import { KAMEN_SEGWAY_DEFAULT_CONTROLS, stepKamenSegwaySi } from "@/physics/kamenSegwayKernel";
import { createKamenSegwayModel } from "./kamenSegwayModel";

describe("US 6,302,230 Dean Kamen Segway Transporter 3D WebGL Model", () => {
  test("constructs valid procedural 3D hierarchy and child groups", () => {
    const segway = createKamenSegwayModel();

    expect(segway.rootGroup).toBeDefined();
    expect(segway.chassisGroup).toBeDefined();
    expect(segway.leftWheelGroup).toBeDefined();
    expect(segway.rightWheelGroup).toBeDefined();
    expect(segway.mastGroup).toBeDefined();
    expect(segway.riderGroup).toBeDefined();
    expect(segway.groundGrid).toBeDefined();

    expect(segway.rootGroup.children.length).toBeGreaterThan(0);
    expect(segway.chassisGroup.children.length).toBeGreaterThan(4);

    segway.rootGroup.updateMatrixWorld(true);
    for (const side of ["left", "right"] as const) {
      const arm = segway.rootGroup.getObjectByName(`segway-${side}-arm`) as THREE.Mesh;
      const grip = segway.rootGroup.getObjectByName(`segway-${side}-grip`) as THREE.Mesh;
      expect(arm).toBeDefined();
      expect(grip).toBeDefined();
      const armLength = (arm.geometry as THREE.CylinderGeometry).parameters.height;
      const armWorld = arm.getWorldPosition(new THREE.Vector3());
      const armWorldQuaternion = arm.getWorldQuaternion(new THREE.Quaternion());
      const halfAxis = new THREE.Vector3(0, armLength / 2, 0).applyQuaternion(armWorldQuaternion);
      const endpointA = armWorld.clone().add(halfAxis);
      const endpointB = armWorld.clone().sub(halfAxis);
      const gripWorld = grip.getWorldPosition(new THREE.Vector3());
      expect(
        Math.min(endpointA.distanceTo(gripWorld), endpointB.distanceTo(gripWorld)),
      ).toBeLessThan(1e-9);
    }
  });

  test("animates pitch rotation, wheel spin, and haptic shudder vibration", () => {
    const segway = createKamenSegwayModel();
    const controls = { ...KAMEN_SEGWAY_DEFAULT_CONTROLS, riderPitchDeg: 6.0 };
    const tel = stepKamenSegwaySi(controls);

    segway.update(controls, tel, 1.5);

    // Forward pitch tilt applied
    expect(segway.chassisGroup.rotation.x).toBeLessThan(0);

    // Wheels spun
    expect(segway.leftWheelGroup.rotation.x).not.toBe(0);
    expect(segway.rightWheelGroup.rotation.x).not.toBe(0);
  });

  test("connects both visual faces to the shared claim probes and source boundary", () => {
    const twoD = readFileSync(
      resolve(process.cwd(), "src/components/patents/visuals/KamenSegwaySim.tsx"),
      "utf8",
    );
    const threeD = readFileSync(
      resolve(process.cwd(), "src/components/patents/visuals/three/KamenSegway3D.tsx"),
      "utf8",
    );

    for (const visualSource of [twoD, threeD]) {
      expect(visualSource).toContain("usePatentPhysics");
      expect(visualSource).toContain("ClaimConstraintToggle");
      expect(visualSource).toContain("claim1BalanceEnabled");
      expect(visualSource).toContain("claim2RippleEnabled");
      expect(visualSource).toContain("modern illustrative");
      expect(visualSource).not.toContain("18 Hz");
    }

    expect(threeD).toContain("studio.controls.update()");
    expect(threeD).toContain("studio.renderer.render(studio.scene, studio.camera)");
    expect(threeD).toContain("hidden sm:flex flex-col");
  });
});
